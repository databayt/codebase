#!/usr/bin/env python3
"""
REF615 Relay Test Report DOCX Processor

This script optimizes the layout and footer of REF615 relay test reports:
1. Removes signature images (keeps structure for new signatures)
2. Creates native Word footer from inline signature table
3. Fixes margins for proper page layout
4. Removes excessive empty paragraphs
5. Removes cell shading from signature table
"""

import os
import re
import shutil
import tempfile
import zipfile
from pathlib import Path


# New margin values (in twips: 1440 twips = 1 inch)
NEW_MARGINS = {
    'top': '2160',      # 1.5"
    'bottom': '1440',   # 1.0"
    'left': '720',      # 0.5"
    'right': '720',     # 0.5"
    'header': '720',    # 0.5"
    'footer': '720',    # 0.5"
    'gutter': '0'
}

# Namespaces used in Office Open XML
NAMESPACES = {
    'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
    'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
    'wp': 'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing',
    'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'pic': 'http://schemas.openxmlformats.org/drawingml/2006/picture',
}


def extract_docx(docx_path: str, temp_dir: str) -> None:
    """Extract DOCX contents to temporary directory."""
    with zipfile.ZipFile(docx_path, 'r') as zf:
        zf.extractall(temp_dir)


def repackage_docx(temp_dir: str, output_path: str) -> None:
    """Repackage temporary directory into DOCX file."""
    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(temp_dir):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, temp_dir)
                zf.write(file_path, arcname)


def find_next_rid(rels_content: str) -> str:
    """Find the next available relationship ID."""
    rids = re.findall(r'Id="rId(\d+)"', rels_content)
    if rids:
        max_rid = max(int(rid) for rid in rids)
        return f'rId{max_rid + 1}'
    return 'rId1'


def find_signature_tables(document_content: str) -> list[tuple[int, int, str]]:
    """
    Find all signature tables in the document.
    A signature table contains "COMPANY" and has signature image references (rId7, rId8, rId9).
    Returns list of (start, end, table_xml) tuples.
    """
    signature_tables = []

    for match in re.finditer(r'<w:tbl>.*?</w:tbl>', document_content, re.DOTALL):
        table_xml = match.group(0)
        # Check if this is a signature table
        if 'COMPANY' in table_xml and ('rId7' in table_xml or 'rId8' in table_xml or 'rId9' in table_xml):
            signature_tables.append((match.start(), match.end(), table_xml))

    return signature_tables


def extract_signature_table(document_content: str) -> tuple[str, str]:
    """
    Extract the last table (signature table) from document.xml.
    Returns (table_xml, document_without_table).
    """
    # Find all tables
    tables = list(re.finditer(r'<w:tbl>.*?</w:tbl>', document_content, re.DOTALL))

    if not tables:
        raise ValueError("No tables found in document")

    last_table_match = tables[-1]
    table_xml = last_table_match.group(0)

    # Find position to cut - include some empty paragraphs before table
    start_pos = last_table_match.start()

    # Look for empty paragraphs before the table (keep 2 max)
    # Find the section of content before the table
    before_table = document_content[:start_pos]

    # Find where to cut (remove excessive empty paragraphs)
    # Pattern for empty paragraph
    empty_para_pattern = r'<w:p[^>]*>(?:<w:pPr>(?:<w:spacing[^/]*/?>)?</w:pPr>)?</w:p>'

    # Find consecutive empty paragraphs before the table
    matches = list(re.finditer(empty_para_pattern, before_table))

    if len(matches) >= 2:
        # Find consecutive empty paragraphs at the end
        consecutive_start = None
        for i in range(len(matches) - 1, -1, -1):
            match = matches[i]
            # Check if this paragraph is at the end of before_table
            if match.end() == len(before_table) or \
               (i < len(matches) - 1 and matches[i + 1].start() == match.end()):
                consecutive_start = i
            else:
                break

        if consecutive_start is not None:
            num_consecutive = len(matches) - consecutive_start
            if num_consecutive > 2:
                # Remove all but 2 empty paragraphs
                keep_from = matches[consecutive_start + num_consecutive - 2].start()
                before_table = before_table[:keep_from] + before_table[matches[consecutive_start].start():]
                before_table = document_content[:matches[consecutive_start].start()]

    # Also remove the table itself
    end_pos = last_table_match.end()

    # Find content before excessive empty paragraphs
    # Look for the last non-empty content
    content_before = document_content[:start_pos]

    # Find and count trailing empty paragraphs
    trailing_empty = []
    pos = len(content_before)
    while pos > 0:
        # Try to match empty paragraph ending at pos
        match = re.search(r'<w:p[^>]*>(?:<w:pPr>[^<]*(?:<[^/][^>]*/>)*</w:pPr>)?</w:p>$', content_before[:pos])
        if match and match.end() == pos:
            trailing_empty.insert(0, (match.start(), match.end()))
            pos = match.start()
        else:
            break

    # Keep only 2 empty paragraphs
    if len(trailing_empty) > 2:
        cut_pos = trailing_empty[0][0]  # Remove all
        keep_paras = content_before[trailing_empty[-2][0]:trailing_empty[-1][1]]
        content_before = content_before[:cut_pos]
    else:
        keep_paras = ''

    # Rebuild document without the table
    document_without_table = content_before + keep_paras + document_content[end_pos:]

    return table_xml, document_without_table


def remove_images_from_all_signature_tables(document_content: str) -> str:
    """
    Find all signature tables and remove drawing elements (images) and cell shading from them.
    Signature tables are identified by containing 'COMPANY' text.
    """
    def clean_signature_table_match(match):
        table_xml = match.group(0)

        # Check if this is a signature table (contains COMPANY)
        if 'COMPANY' not in table_xml:
            return table_xml  # Not a signature table, leave unchanged

        # Remove all drawing elements (signature images)
        cleaned = re.sub(r'<w:drawing>.*?</w:drawing>', '', table_xml, flags=re.DOTALL)

        # Remove cell shading with FCE9D9 color
        cleaned = re.sub(r'<w:shd[^>]*w:fill="FCE9D9"[^>]*/>', '', cleaned)

        return cleaned

    # Process all tables
    result = re.sub(r'<w:tbl>.*?</w:tbl>', clean_signature_table_match, document_content, flags=re.DOTALL)

    return result


def clean_signature_table(table_xml: str) -> str:
    """
    Clean the signature table:
    1. Remove drawing elements (signature images)
    2. Remove cell shading (FCE9D9)
    """
    # Remove all drawing elements (signature images)
    # Pattern: <w:drawing>...</w:drawing>
    cleaned = re.sub(r'<w:drawing>.*?</w:drawing>', '', table_xml, flags=re.DOTALL)

    # Remove cell shading with FCE9D9 color
    # Pattern: <w:shd w:val="clear" w:color="auto" w:fill="FCE9D9"/>
    cleaned = re.sub(r'<w:shd[^>]*w:fill="FCE9D9"[^>]*/>', '', cleaned)

    return cleaned


def create_footer_xml(table_xml: str) -> str:
    """Create footer1.xml with the signature table."""
    footer_xml = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:ftr xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas"
       xmlns:cx="http://schemas.microsoft.com/office/drawing/2014/chartex"
       xmlns:cx1="http://schemas.microsoft.com/office/drawing/2015/9/8/chartex"
       xmlns:cx2="http://schemas.microsoft.com/office/drawing/2015/10/21/chartex"
       xmlns:cx3="http://schemas.microsoft.com/office/drawing/2016/5/9/chartex"
       xmlns:cx4="http://schemas.microsoft.com/office/drawing/2016/5/10/chartex"
       xmlns:cx5="http://schemas.microsoft.com/office/drawing/2016/5/11/chartex"
       xmlns:cx6="http://schemas.microsoft.com/office/drawing/2016/5/12/chartex"
       xmlns:cx7="http://schemas.microsoft.com/office/drawing/2016/5/13/chartex"
       xmlns:cx8="http://schemas.microsoft.com/office/drawing/2016/5/14/chartex"
       xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
       xmlns:aink="http://schemas.microsoft.com/office/drawing/2016/ink"
       xmlns:am3d="http://schemas.microsoft.com/office/drawing/2017/model3d"
       xmlns:o="urn:schemas-microsoft-com:office:office"
       xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
       xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math"
       xmlns:v="urn:schemas-microsoft-com:vml"
       xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing"
       xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
       xmlns:w10="urn:schemas-microsoft-com:office:word"
       xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
       xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"
       xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml"
       xmlns:w16cex="http://schemas.microsoft.com/office/word/2018/wordml/cex"
       xmlns:w16cid="http://schemas.microsoft.com/office/word/2016/wordml/cid"
       xmlns:w16="http://schemas.microsoft.com/office/word/2018/wordml"
       xmlns:w16sdtdh="http://schemas.microsoft.com/office/word/2020/wordml/sdtdatahash"
       xmlns:w16se="http://schemas.microsoft.com/office/word/2015/wordml/symex"
       xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup"
       xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk"
       xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml"
       xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape"
       mc:Ignorable="w14 w15 w16se w16cid w16 w16cex w16sdtdh wp14">
'''
    footer_xml += table_xml
    footer_xml += '\n</w:ftr>'

    return footer_xml


def update_content_types(content_types_xml: str) -> str:
    """Add footer content type to [Content_Types].xml."""
    # Check if footer already exists
    if 'footer1.xml' in content_types_xml:
        return content_types_xml

    # Add footer override before the closing </Types> tag
    footer_override = '<Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>'

    return content_types_xml.replace('</Types>', footer_override + '</Types>')


def update_document_rels(rels_content: str, footer_rid: str) -> str:
    """Add footer relationship to document.xml.rels."""
    # Check if footer relationship already exists
    if 'footer1.xml' in rels_content:
        return rels_content

    # Add footer relationship before the closing </Relationships> tag
    footer_rel = f'<Relationship Id="{footer_rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/>'

    return rels_content.replace('</Relationships>', footer_rel + '</Relationships>')


def update_sectpr_elements(document_content: str, footer_rid: str) -> str:
    """
    Update all sectPr elements:
    1. Add footerReference
    2. Update margins
    """
    def replace_sectpr(match):
        sectpr = match.group(0)

        # Check if footer reference already exists
        if 'w:footerReference' not in sectpr:
            # Find position to insert footer reference (after header reference if exists)
            header_match = re.search(r'(<w:headerReference[^/]*/>\s*)', sectpr)
            if header_match:
                insert_pos = header_match.end()
                footer_ref = f'<w:footerReference w:type="default" r:id="{footer_rid}"/>'
                sectpr = sectpr[:insert_pos] + footer_ref + sectpr[insert_pos:]
            else:
                # Insert after <w:sectPr...>
                insert_pos = sectpr.find('>') + 1
                footer_ref = f'<w:footerReference w:type="default" r:id="{footer_rid}"/>'
                sectpr = sectpr[:insert_pos] + footer_ref + sectpr[insert_pos:]

        # Update margins
        margin_pattern = r'<w:pgMar[^/]*/>'
        new_margin = f'<w:pgMar w:top="{NEW_MARGINS["top"]}" w:right="{NEW_MARGINS["right"]}" w:bottom="{NEW_MARGINS["bottom"]}" w:left="{NEW_MARGINS["left"]}" w:header="{NEW_MARGINS["header"]}" w:footer="{NEW_MARGINS["footer"]}" w:gutter="{NEW_MARGINS["gutter"]}"/>'
        sectpr = re.sub(margin_pattern, new_margin, sectpr)

        return sectpr

    # Find and replace all sectPr elements
    result = re.sub(r'<w:sectPr[^>]*>.*?</w:sectPr>', replace_sectpr, document_content, flags=re.DOTALL)

    return result


def remove_empty_paragraphs_before_end(document_content: str) -> str:
    """Remove excessive empty paragraphs before the document end, keeping max 2."""
    # Find the last </w:body> tag
    body_end = document_content.rfind('</w:body>')
    if body_end == -1:
        return document_content

    content_before_end = document_content[:body_end]
    content_after = document_content[body_end:]

    # Pattern for empty paragraph (may have spacing properties but no text)
    empty_para_pattern = r'<w:p[^>]*>(?:<w:pPr>(?:<w:spacing[^/]*/?>|<w:rPr>[^<]*</w:rPr>|[^<])*</w:pPr>)?</w:p>\s*'

    # Find trailing empty paragraphs
    trailing_match = re.search(f'({empty_para_pattern})+$', content_before_end)

    if trailing_match:
        trailing_paras = trailing_match.group(0)
        # Count empty paragraphs
        empty_paras = re.findall(empty_para_pattern, trailing_paras)

        if len(empty_paras) > 2:
            # Keep only last 2
            keep = ''.join(empty_paras[-2:])
            content_before_end = content_before_end[:trailing_match.start()] + keep

    return content_before_end + content_after


def process_docx(input_path: str, output_path: str = None) -> bool:
    """
    Process a single DOCX file.

    Args:
        input_path: Path to input DOCX file
        output_path: Path for output file (defaults to overwriting input)

    Returns:
        True if successful, False otherwise
    """
    if output_path is None:
        output_path = input_path

    print(f"\nProcessing: {input_path}")

    try:
        # Create temporary directory
        with tempfile.TemporaryDirectory() as temp_dir:
            # Extract DOCX
            extract_docx(input_path, temp_dir)

            # Read document.xml
            doc_path = os.path.join(temp_dir, 'word', 'document.xml')
            with open(doc_path, 'r', encoding='utf-8') as f:
                document_content = f.read()

            # First, remove images from ALL signature tables throughout the document
            print("  - Removing signature images from all signature tables...")
            sig_tables = find_signature_tables(document_content)
            print(f"    Found {len(sig_tables)} signature tables with images")
            document_content = remove_images_from_all_signature_tables(document_content)

            # Extract and clean signature table for footer
            print("  - Extracting last signature table for footer...")
            table_xml, document_without_table = extract_signature_table(document_content)

            print("  - Cleaning signature table (removing images and shading)...")
            cleaned_table = clean_signature_table(table_xml)

            # Create footer XML
            print("  - Creating footer1.xml...")
            footer_xml = create_footer_xml(cleaned_table)

            # Write footer file
            footer_path = os.path.join(temp_dir, 'word', 'footer1.xml')
            with open(footer_path, 'w', encoding='utf-8') as f:
                f.write(footer_xml)

            # Update Content_Types.xml
            print("  - Updating [Content_Types].xml...")
            content_types_path = os.path.join(temp_dir, '[Content_Types].xml')
            with open(content_types_path, 'r', encoding='utf-8') as f:
                content_types = f.read()
            content_types = update_content_types(content_types)
            with open(content_types_path, 'w', encoding='utf-8') as f:
                f.write(content_types)

            # Update document.xml.rels
            print("  - Updating document.xml.rels...")
            rels_path = os.path.join(temp_dir, 'word', '_rels', 'document.xml.rels')
            with open(rels_path, 'r', encoding='utf-8') as f:
                rels_content = f.read()

            footer_rid = find_next_rid(rels_content)
            print(f"    Using relationship ID: {footer_rid}")

            rels_content = update_document_rels(rels_content, footer_rid)
            with open(rels_path, 'w', encoding='utf-8') as f:
                f.write(rels_content)

            # Update document.xml
            print("  - Updating document.xml (adding footer references, updating margins)...")
            # Note: document_without_table already has images removed from all signature tables
            document_content = update_sectpr_elements(document_without_table, footer_rid)

            # Remove excessive empty paragraphs
            print("  - Removing excessive empty paragraphs...")
            document_content = remove_empty_paragraphs_before_end(document_content)

            with open(doc_path, 'w', encoding='utf-8') as f:
                f.write(document_content)

            # Repackage DOCX
            print("  - Repackaging DOCX...")
            repackage_docx(temp_dir, output_path)

            print(f"  SUCCESS: {output_path}")
            return True

    except Exception as e:
        print(f"  ERROR: {e}")
        import traceback
        traceback.print_exc()
        return False


def validate_docx(docx_path: str) -> bool:
    """Basic validation that DOCX can be opened and has expected structure."""
    try:
        with zipfile.ZipFile(docx_path, 'r') as zf:
            # Check required files exist
            names = zf.namelist()
            required = ['word/document.xml', '[Content_Types].xml', 'word/footer1.xml']

            for req in required:
                if req not in names:
                    print(f"  Validation FAILED: Missing {req}")
                    return False

            # Try to read document.xml
            with zf.open('word/document.xml') as f:
                content = f.read().decode('utf-8')

                # Check for footer references
                if 'w:footerReference' not in content:
                    print("  Validation WARNING: No footer references found in document")

                # Check margins were updated
                if 'w:footer="720"' not in content:
                    print("  Validation WARNING: Footer margin may not be updated")

            # Try to read footer
            with zf.open('word/footer1.xml') as f:
                footer = f.read().decode('utf-8')

                # Check signature images removed
                if 'w:drawing' in footer:
                    print("  Validation WARNING: Drawing elements still present in footer")

                # Check shading removed
                if 'FCE9D9' in footer:
                    print("  Validation WARNING: Cell shading still present in footer")

            print("  Validation PASSED")
            return True

    except Exception as e:
        print(f"  Validation FAILED: {e}")
        return False


def main():
    """Process all REF615 report files."""
    reports_dir = Path('/Users/abdout/codebase/REF615/Final_Reports')

    # List of files to process
    files = sorted(reports_dir.glob('H*.docx'))

    print(f"Found {len(files)} DOCX files to process")
    print("=" * 60)

    success_count = 0
    fail_count = 0

    for docx_file in files:
        if process_docx(str(docx_file)):
            if validate_docx(str(docx_file)):
                success_count += 1
            else:
                fail_count += 1
        else:
            fail_count += 1

    print("\n" + "=" * 60)
    print(f"COMPLETE: {success_count} succeeded, {fail_count} failed")


if __name__ == '__main__':
    main()

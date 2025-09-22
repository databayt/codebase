// Test script to verify lead import functionality
// Run this in the browser console at http://localhost:3003/en/test-import

async function testLeadImport() {
  console.log('🚀 Starting Lead Import Test Suite');
  console.log('=====================================');

  // Test 1: Create a single lead
  console.log('\n📝 TEST 1: Creating single lead...');
  const testLead = {
    name: 'Test Lead ' + Date.now(),
    email: `test${Date.now()}@example.com`,
    company: 'Test Company',
    status: 'NEW',
    source: 'MANUAL',
    score: 75,
  };

  console.log('Sending:', testLead);

  // Import the action from the module
  const { createLead } = await import('/src/components/leads/action');
  const result = await createLead(testLead);

  if (result.success) {
    console.log('✅ Lead created successfully!');
    console.log('Lead ID:', result.data?.id);
  } else {
    console.log('❌ Failed to create lead:', result.error);
  }

  // Test 2: Fetch all leads
  console.log('\n📊 TEST 2: Fetching all leads...');
  const { getLeads } = await import('/src/components/leads/action');
  const leadsResult = await getLeads();

  console.log(`Found ${leadsResult.leads.length} leads`);
  console.log('Total in database:', leadsResult.pagination.total);
  console.log('Recent leads:');
  leadsResult.leads.slice(0, 3).forEach((lead, i) => {
    console.log(`  ${i + 1}. ${lead.name} - ${lead.email} (${lead.status})`);
  });

  // Test 3: Test CSV import
  console.log('\n📁 TEST 3: Testing CSV import...');
  const csvContent = `name,email,company,phone
John Doe,john@example.com,Acme Corp,555-0101
Jane Smith,jane@example.com,Tech Inc,555-0102
Bob Wilson,bob@example.com,Sales Co,555-0103`;

  console.log('CSV Content:');
  console.log(csvContent);

  // Simulate CSV parsing
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',');
  console.log('Headers:', headers);

  let importCount = 0;
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const leadData = {
      name: values[0],
      email: values[1],
      company: values[2],
      phone: values[3],
      status: 'NEW',
      source: 'IMPORT',
      score: 70,
    };

    console.log(`Importing: ${leadData.name}`);
    const importResult = await createLead(leadData);
    if (importResult.success) {
      importCount++;
      console.log(`  ✅ Imported: ${importResult.data?.id}`);
    } else {
      console.log(`  ❌ Failed: ${importResult.error}`);
    }
  }

  console.log(`\n✅ Import complete! ${importCount}/${lines.length - 1} leads imported`);

  // Test 4: Verify imported leads
  console.log('\n🔍 TEST 4: Verifying imported leads...');
  const finalResult = await getLeads();
  console.log(`Total leads after import: ${finalResult.pagination.total}`);

  console.log('\n=====================================');
  console.log('✅ Test Suite Complete!');
  console.log('Refresh the page to see updated leads in the table');

  return {
    created: result.success ? 1 : 0,
    imported: importCount,
    total: finalResult.pagination.total
  };
}

// Run the test
console.log('To run the test, execute: testLeadImport()');
console.log('Or copy and paste this entire script into the browser console');
// source.config.ts
import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import { rehypeCodeDefaultOptions } from "fumadocs-core/mdx-plugins";
var prettyCodeOptions = {
  ...rehypeCodeDefaultOptions,
  theme: {
    light: "github-light-default",
    dark: "github-dark"
  },
  defaultLang: "plaintext",
  transformers: [
    ...rehypeCodeDefaultOptions.transformers
  ],
  onVisitLine(node) {
    if (node.children.length === 0) {
      node.children = [{ type: "text", value: " " }];
    }
  },
  onVisitHighlightedLine(node) {
    node.properties.className = ["line--highlighted"];
  },
  onVisitHighlightedChars(node) {
    node.properties.className = ["word--highlighted"];
  }
};
var source_config_default = defineConfig({
  mdxOptions: {
    rehypeCodeOptions: prettyCodeOptions
  }
});
var atoms = defineDocs({
  dir: "content/atoms"
});
export {
  atoms,
  source_config_default as default
};

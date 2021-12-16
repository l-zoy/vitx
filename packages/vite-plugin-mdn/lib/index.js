function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import { compileTemplate } from '@vue/compiler-sfc';
import MarkdownIt from 'markdown-it';
import matter from 'gray-matter';

function toArray(n) {
  if (!Array.isArray(n)) return [n];
  return n;
}

export function parseId(id) {
  var index = id.indexOf('?');
  if (index < 0) return id;
  return id.slice(0, index);
}

function VitePluginMarkdown(options) {
  if (options === void 0) {
    options = {};
  }

  var resolved = _extends({
    markdownItOptions: {},
    markdownItUses: [],
    markdownItSetup: function markdownItSetup() {},
    wrapperClasses: 'markdown-body',
    wrapperComponent: null,
    transforms: {}
  }, options);

  var markdown = new MarkdownIt(_extends({
    html: true,
    linkify: true,
    typographer: true
  }, resolved.markdownItOptions));
  resolved.markdownItUses.forEach(function (e) {
    var _toArray = toArray(e),
        plugin = _toArray[0],
        options = _toArray[1];

    markdown.use(plugin, options);
  });
  resolved.markdownItSetup(markdown);
  var wrapperClasses = toArray(resolved.wrapperClasses).filter(function (i) {
    return i;
  }).join(' ');
  var config;
  return {
    name: 'vite-plugin-mdn',
    enforce: 'pre',
    configResolved: function configResolved(_config) {
      config = _config;
    },
    transform: function transform(raw, id) {
      var _config2;

      var path = parseId(id);

      if (!path.endsWith('.md')) {
        return raw;
      }

      if (resolved.transforms.before) {
        raw = resolved.transforms.before(raw, id);
      }

      var _matter = matter(raw),
          md = _matter.content,
          frontmatter = _matter.data;

      var sfc = markdown.render(md, {});

      if (resolved.wrapperClasses) {
        sfc = `<div class="${wrapperClasses}">${sfc}</div>`;
      }

      if (resolved.wrapperComponent) {
        sfc = `<${resolved.wrapperComponent} :frontmatter="frontmatter">${sfc}</${resolved.wrapperComponent}>`;
      }

      if (resolved.transforms.after) {
        sfc = resolved.transforms.after(sfc, id);
      }

      var _compileTemplate = compileTemplate({
        filename: path,
        id: path,
        source: sfc,
        transformAssetUrls: false
      }),
          result = _compileTemplate.code;

      result = result.replace('export function render', 'function render');
      result += `\nconst __matter = ${JSON.stringify(frontmatter)};`;
      result += '\nconst data = () => ({ frontmatter: __matter });';
      result += '\nconst __script = { render, data };';

      if (!((_config2 = config) != null && _config2.isProduction)) {
        result += `\n__script.__hmrId = ${JSON.stringify(path)};`;
      }

      result += '\nexport default __script;';
      return result;
    }
  };
}

export default VitePluginMarkdown;
import { MarkdownConverter } from "../../src/markdown-converter/markdown-converter";
import { MarkdownConverterOptions } from "../../src/markdown-converter/interface";


describe('markdownConverter - links', () => {
  it('converts a basic inline link', async () => {
    const md = '[Syncfusion](https://www.syncfusion.com)';
    const html = MarkdownConverter.toHtml(md);
    expect(html).toBe('<p><a href="https://www.syncfusion.com">Syncfusion</a></p>\n');
  });

  it('converts a link with a title', async () => {
    const md = '[Syncfusion Docs](https://ej2.syncfusion.com "EJ2 Docs")';
    const html = MarkdownConverter.toHtml(md);
    expect(html).toBe('<p><a href="https://ej2.syncfusion.com" title="EJ2 Docs">Syncfusion Docs</a></p>\n');
  });

  it('converts an autolink (angle brackets)', async () => {
    const md = '<https://example.com>';
    const html = MarkdownConverter.toHtml(md);
    expect(html).toBe('<p><a href="https://example.com">https://example.com</a></p>\n');
  });

  it('converts a mailto autolink', async () => {
    const md = '<user@example.com>';
    const html = MarkdownConverter.toHtml(md);
    expect(html).toBe('<p><a href="mailto:user@example.com">user@example.com</a></p>\n');
  });

  it('handles parentheses in the URL', async () => {
    const md = '[Release notes](https://example.com/releases/v1.0_(stable)/notes)';
    const html = MarkdownConverter.toHtml(md);
    expect(html).toBe('<p><a href="https://example.com/releases/v1.0_(stable)/notes">Release notes</a></p>\n');
  });

  it('keeps encoded spaces in the URL', async () => {
    const md = '[File](https://example.com/files/my%20file.pdf)';
    const html = MarkdownConverter.toHtml(md);
    expect(html).toBe('<p><a href="https://example.com/files/my%20file.pdf">File</a></p>\n');
  });

  it('renders inline formatting inside link text', async () => {
    const md = '[use `API`](https://example.com/api)';
    const html = MarkdownConverter.toHtml(md);
    expect(html).toBe('<p><a href="https://example.com/api">use <code>API</code></a></p>\n');
  });

  it('renders escaped brackets in link text', async () => {
    const md = '[\\[docs\\] section](https://example.com/docs)';
    const html = MarkdownConverter.toHtml(md);
    expect(html).toBe('<p><a href="https://example.com/docs">[docs] section</a></p>\n');
  });

  it('converts multiple links in a single paragraph', () => {
    const md = 'Links: [One](https://one.com), [Two](https://two.com).';
    const html = MarkdownConverter.toHtml(md);
    expect(html).toBe('<p>Links: <a href="https://one.com">One</a>, <a href="https://two.com">Two</a>.</p>\n');
  });
  it('converts link with inline emphasis in the text', () => {
    const md = '[click **here**](https://example.com)';
    const html = MarkdownConverter.toHtml(md);
    expect(html).toBe('<p><a href="https://example.com">click <strong>here</strong></a></p>\n');
  });
  it('handles link followed by text without extra spacing', () => {
    const md = '[go](https://example.com)now';
    const html = MarkdownConverter.toHtml(md);
    expect(html).toBe('<p><a href="https://example.com">go</a>now</p>\n');
  });
});

describe('MarkdownConverter - images', () => {
  it('converts a basic image', () => {
    const md = '![Alt text](https://example.com/image.png)';
    const html = MarkdownConverter.toHtml(md);
    expect(html).toBe('<p><img src="https://example.com/image.png" alt="Alt text"></p>\n');
  });

  it('converts an image with a title', () => {
    const md = '![Chart](https://example.com/chart.png "Sales chart")';
    const html = MarkdownConverter.toHtml(md);
    expect(html).toBe('<p><img src="https://example.com/chart.png" alt="Chart" title="Sales chart"></p>\n');
  });

  it('converts an image wrapped in a link', () => {
    const md = '[![Logo](https://example.com/logo.png "Company")](https://www.syncfusion.com)';
    const html = MarkdownConverter.toHtml(md);
    expect(html).toBe('<p><a href="https://www.syncfusion.com"><img src="https://example.com/logo.png" alt="Logo" title="Company"></a></p>\n');
  });

  it('handles parentheses in the image URL', () => {
    const md = '![Diagram](https://example.com/imgs/flow_(v2).png)';
    const html = MarkdownConverter.toHtml(md);
    expect(html).toBe('<p><img src="https://example.com/imgs/flow_(v2).png" alt="Diagram"></p>\n');
  });

  it('keeps encoded spaces in the image URL', () => {
    const md = '![Doc](https://example.com/assets/my%20doc.png)';
    const html = MarkdownConverter.toHtml(md);
    expect(html).toBe('<p><img src="https://example.com/assets/my%20doc.png" alt="Doc"></p>\n');
  });

  it('supports empty alt text', () => {
    const md = '![](https://example.com/blank-alt.png)';
    const html = MarkdownConverter.toHtml(md);
    expect(html).toBe('<p><img src="https://example.com/blank-alt.png" alt=""></p>\n');
  });

  it('allows brackets in alt text (escaped)', () => {
    const md = '![\\[icon\\] file](https://example.com/icon.png)';
    const html = MarkdownConverter.toHtml(md);
    expect(html).toBe('<p><img src="https://example.com/icon.png" alt="[icon] file"></p>\n');
  });
  it('converts image immediately followed by text', () => {
    const md = '![Alt](https://example.com/a.png)next';
    const html = MarkdownConverter.toHtml(md);
    expect(html).toBe('<p><img src="https://example.com/a.png" alt="Alt">next</p>\n');
  });

  it('converts image inside a sentence with emphasis around', () => {
    const md = 'Some text ![Alt](https://example.com/a.png) with *style*.';
    const html = MarkdownConverter.toHtml(md);
    expect(html).toBe('<p>Some text <img src="https://example.com/a.png" alt="Alt"> with <em>style</em>.</p>\n');
  });
});

describe('MarkdownConverter - Reference links (reflink) and bare URLs (url)', () => {
  describe('reflink: reference-style links and images resolved from definitions', () => {
    it('converts a reference link with title: [docs][site] and [site]: def', () => {
      const md = `This is a [docs][site] reference.

[site]: https://example.com "Site Docs"`;
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe('<p>This is a <a href="https://example.com" title="Site Docs">docs</a> reference.</p>\n');
    });

    it('converts a shortcut reference link: [docs] with [docs]: def', () => {
      const md = `Use [docs].

[docs]: https://example.com/docs`;
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe('<p>Use <a href="https://example.com/docs">docs</a>.</p>\n');
    });

    it('converts a collapsed reference link: [docs][] with [docs]: def and title', () => {
      const md = `See [docs][] now.

[docs]: https://example.com/now "Now"`;
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe('<p>See <a href="https://example.com/now" title="Now">docs</a> now.</p>\n');
    });

    it('leaves unresolved reference as text: [missing][ref]', () => {
      const md = `A [missing][ref].`;
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe('<p>A [missing][ref].</p>\n');
    });

    it('converts a reference image: ![alt][img] with [img]: def and title', () => {
      const md = `![alt][img]

[img]: https://example.com/a.png "A"`;
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe('<p><img src="https://example.com/a.png" alt="alt" title="A"></p>\n');
    });
  });

  describe('url: bare URL auto-linking (GFM), guarded by inLink state', () => {
    it('auto-links a bare URL in text', () => {
      const md = `Visit https://example.com/docs for more.`;
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe('<p>Visit <a href="https://example.com/docs">https://example.com/docs</a> for more.</p>\n');
    });

    it('does not auto-link a bare URL inside an existing link text (inLink guard)', () => {
      const md = `[see https://example.com](https://wrapper.example)`;
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe('<p><a href="https://wrapper.example">see https://example.com</a></p>\n');
    });

    it('auto-links multiple bare URLs in the same paragraph', () => {
      const md = `Refs: https://one.example/path and https://two.example/ok`;
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe('<p>Refs: <a href="https://one.example/path">https://one.example/path</a> and <a href="https://two.example/ok">https://two.example/ok</a></p>\n');
    });
  });
});

describe('MarkdownConverter - Paragraph immediately followed by reference definition (def) is merged', () => {
  it('keeps the ref definition as literal text when it directly follows a paragraph (no blank line)', () => {
    const md = [
      'This is a paragraph mentioning [docs][site].',
      '[site]: https://example.com "Site Docs"'
    ].join('\n');

    const html = MarkdownConverter.toHtml(md);
    const expected = [
      '<p>This is a paragraph mentioning [docs][site].',
      '[site]: <a href="https://example.com">https://example.com</a> &quot;Site Docs&quot;</p>',
      ''
    ].join('\n');

    expect(html).toBe(expected);
  });

  it('also merges a bare definition when there is no reference usage in the paragraph', () => {
    const md = [
      'Just a line of text.',
      '[ref]: https://example.org "Title"'
    ].join('\n');

    const html = MarkdownConverter.toHtml(md);
    const expected = [
      '<p>Just a line of text.',
      '[ref]: <a href="https://example.org">https://example.org</a> &quot;Title&quot;</p>',
      ''
    ].join('\n');

    expect(html).toBe(expected);
  });
});

describe('MarkdownConverter - Reference definition separated by a blank line is registered and used', () => {
  it('resolves the reference link when a blank line separates the paragraph and the definition', () => {
    const md = [
      'This is a [docs][site] reference.',
      '',
      '[site]: https://example.com "Site Docs"'
    ].join('\n');

    const html = MarkdownConverter.toHtml(md);

    expect(html).toBe('<p>This is a <a href="https://example.com" title="Site Docs">docs</a> reference.</p>\n');
  });
});

describe('Tokenizer.parseLink - angle bracket href', () => {
  it('strips < and > around href (non-pedantic)', () => {
    const md = '[label](<http://a.com>)';
    const html = MarkdownConverter.toHtml(md) as string;

    // Should parse as link
    expect(html).toContain('<a');
    expect(html).toContain('href="http://a.com"');
    expect(html).toContain('label</a>');
    
    // Should not contain angle brackets in href
    expect(html).not.toContain('href="<');
    expect(html).not.toContain('>"');
  });
});

describe('Tokenizer.parseLink - parentheses handling', () => {
  it('keeps URLs with balanced parentheses using findClosingBracket trimming', () => {
    const md = '[go](http://a.com/path_(test))';
    const html = MarkdownConverter.toHtml(md) as string;

    // Should parse as link with balanced parentheses in URL
    expect(html).toContain('<a');
    expect(html).toContain('href="http://a.com/path_(test)"');
    expect(html).toContain('>go</a>');
  });
});

describe('Tokenizer.parseLink - pedantic mode title splitting', () => {
  it('splits href and title from the href capture using pedanticHrefTitle', () => {
    const options = { gfm: false } as MarkdownConverterOptions;
    
    const md = '[Sync](http://a.com "My Title")';
    const html = MarkdownConverter.toHtml(md, options) as string;

    // Should parse as link with title attribute
    expect(html).toContain('<a');
    expect(html).toContain('href="http://a.com"');
    expect(html).toContain('title="My Title"');
    expect(html).toContain('>Sync</a>');
  });

  it('strips starting "<" in pedantic mode even without a closing ">"', () => {
    const options = { gfm: false } as MarkdownConverterOptions;
    
    const md = '[A](<http://a.com "T")';
    const html = MarkdownConverter.toHtml(md, options) as string;

    // Should parse as link even with malformed angle bracket
    expect(html).toContain('<a');
    expect(html).toContain('href');
    expect(html).toContain('http://a.com');
    expect(html).toContain('title="T"');
    expect(html).toContain('>A</a>');
  });
});

describe('Tokenizer.parseLink - basic sanity (non-pedantic)', () => {
  it('parses a simple inline link with no title', () => {
    const md = '[site](https://example.com)';
    const html = MarkdownConverter.toHtml(md) as string;

    // Should parse as link
    expect(html).toContain('<a');
    expect(html).toContain('href="https://example.com"');
    expect(html).toContain('>site</a>');
    
    // Should not have title attribute
    expect(html).not.toContain('title=');
  });

  it('parses a link with a quoted title (non-pedantic path)', () => {
    const md = '[label](https://e.com "T")';
    const html = MarkdownConverter.toHtml(md) as string;

    // Should parse as link with title
    expect(html).toContain('<a');
    expect(html).toContain('href="https://e.com"');
    expect(html).toContain('title="T"');
    expect(html).toContain('>label</a>');
  });
});

describe('MarkdownConverter - unsafe URL handling in links and images', () => {
  it('returns plain text when link href is unsafe', () => {
    const md = 'click here'; // Invalid surrogate triggers cleanUrl failure
    const html = MarkdownConverter.toHtml(md);
    expect(html).toBe('<p>click here</p>\n'); // No <a> tag, just text
  });

  it('returns escaped alt text when image href is unsafe', () => {
    const md = '!Alt <text>'; // Unsafe URL
    const html = MarkdownConverter.toHtml(md);
    expect(html).toBe('<p>!Alt <text></p>\n'); // No <img>, escaped alt text only
  });

  it('renders normal image when href is safe', () => {
    const md = '!Alt';
    const html = MarkdownConverter.toHtml(md);
    expect(html).toBe('<p>!Alt</p>\n');
  });
});
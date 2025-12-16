import { MarkdownConverter } from "../../src/markdown-converter/markdown-converter";

describe('MarkdownConverter - HTML tag passthrough (HTM tag conversion)', () => {
  describe('Inline HTML elements inside paragraphs', () => {
    it('preserves inline <em> and <strong> tags', () => {
      const md = `This is <em>em</em> and <strong>strong</strong> text.`;
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe(`<p>This is <em>em</em> and <strong>strong</strong> text.</p>\n`);
    });

    it('preserves inline <a> tag with href and title', () => {
      const md = `Visit <a href="https://example.com" title="Example">link</a> now.`;
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe(`<p>Visit <a href="https://example.com" title="Example">link</a> now.</p>\n`);
    });

    it('preserves inline <span> with class', () => {
      const md = `Text with <span class="hl">highlight</span>.`;
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe(`<p>Text with <span class="hl">highlight</span>.</p>\n`);
    });

    it('preserves inline <code> tag mixed with Markdown code', () => {
      const md = `Use <code>HTML</code> and \`MD\` here.`;
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe(`<p>Use <code>HTML</code> and <code>MD</code> here.</p>\n`);
    });

    it('preserves an inline <img> tag', () => {
      const md = `Icon: <img src="https://example.com/i.png" alt="i"> done.`;
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe(`<p>Icon: <img src="https://example.com/i.png" alt="i"> done.</p>\n`);
    });

    it('preserves a <br> tag inside a paragraph', () => {
      const md = `Line A<br>Line B`;
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe(`<p>Line A<br>Line B</p>\n`);
    });
  });

  describe('Block-level raw HTML', () => {
    it('preserves a raw <div> block', () => {
      const md = `<div class="wrap"><span>inside</span></div>`;
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe(`<div class="wrap"><span>inside</span></div>`);
    });

    it('preserves a raw <hr> block', () => {
      const md = `<hr>`;
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe(`<hr>`);
    });

    it('preserves a raw <table> block', () => {
      const md = `<table><thead><tr><th>A</th><th>B</th></tr></thead><tbody><tr><td>1</td><td>2</td></tr></tbody></table>`;
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe(`<table><thead><tr><th>A</th><th>B</th></tr></thead><tbody><tr><td>1</td><td>2</td></tr></tbody></table>`);
    });

    it('preserves a raw HTML block between paragraphs', () => {
      const md = `Above

<div><p>Inner</p></div>

Below`;
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe(`<p>Above</p>
<div><p>Inner</p></div>

<p>Below</p>
`);
    });
  });

  describe('Mixed Markdown and raw HTML', () => {
    it('combines raw HTML inline with Markdown emphasis', () => {
      const md = `Use <span>HTML</span> and **Markdown** together.`;
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe(`<p>Use <span>HTML</span> and <strong>Markdown</strong> together.</p>\n`);
    });

    it('allows raw HTML inside list items', () => {
      const md = `- First <em>one</em>
- Second <strong>two</strong>`;
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe(`<ul>
<li>First <em>one</em></li>
<li>Second <strong>two</strong></li>
</ul>
`);
    });

    it('allows raw HTML inside a blockquote', () => {
      const md = `> A quote with <em>HTML</em>`;
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe(`<blockquote>
<p>A quote with <em>HTML</em></p>
</blockquote>
`);
    });
  });

  describe('Escaped HTML and comments', () => {
    it('preserves HTML comments', () => {
      const md = `<!-- note: hidden -->`;
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe(`<!-- note: hidden -->`);
    });
  });

  describe('Edge cases with raw HTML', () => {
    it('preserves attributes and order in inline tags', () => {
      const md = `<a href="https://example.com" target="_blank" rel="noreferrer">go</a>`;
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe(`<p><a href="https://example.com" target="_blank" rel="noreferrer">go</a></p>\n`);
    });

    it('preserves nested raw HTML inside Markdown heading', () => {
      const md = `## Title with <em>HTML</em>`;
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe(`<h2>Title with <em>HTML</em></h2>\n`);
    });

    it('preserves raw HTML alongside fenced code blocks', () => {
      const md = `Before
<div>box</div>

\`\`\`
code
\`\`\`
After`;
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe(`<p>Before</p>
<div>box</div>

<pre><code>code
</code></pre>
<p>After</p>
`);
    });
  });

  describe('MarkdownConverter - Raw <script>/<style> blocks followed by inline text', () => {
    it('preserves a raw <script> block and renders trailing text as a separate paragraph', () => {
      const md = [
        '<script type="text/javascript">',
        '// JavaScript example',
        'document.getElementById("demo").innerHTML = "Hello JavaScript!";',
        '</script>',
        '',
        'okay'
      ].join('\n');
      const html = MarkdownConverter.toHtml(md);
      const expected = [
        '<script type="text/javascript">',
        '// JavaScript example',
        'document.getElementById("demo").innerHTML = "Hello JavaScript!";',
        '</script>',
        '',
        '<p>okay</p>',
        ''
      ].join('\n');
      expect(html).toBe(expected);
    });

    it('preserves a raw <style> block and renders trailing text as a separate paragraph', () => {
      const md = [
        '<style',
        'type="text/css">',
        'h1 {color:red;}',
        'p {color:blue;}',
        '</style>',
        'okay'
      ].join('\n');

      const html = MarkdownConverter.toHtml(md);

      const expected = [
        '<style',
        'type="text/css">',
        'h1 {color:red;}',
        'p {color:blue;}',
        '</style>',
        '<p>okay</p>',
        ''
      ].join('\n');

      expect(html).toBe(expected);
    });
  });
});
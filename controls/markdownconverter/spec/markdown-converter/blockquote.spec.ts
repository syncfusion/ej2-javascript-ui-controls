import { MarkdownConverter } from "../../src/markdown-converter/markdown-converter";

describe('MarkdownConverter - blockquote', () => {


  it('should convert a single-line blockquote', () => {
    const md = '> This is a quote';
    const html = MarkdownConverter.toHtml(md);
    expect(html).toContain('<blockquote>');
    expect(html).toContain('<p>This is a quote</p>');
    expect(html).toContain('</blockquote>');
  });

  it('should convert a multi-line blockquote', () => {
    const md = [
      '> Line 1',
      '> Line 2',
      '> Line 3'
    ].join('\n');
    const html = MarkdownConverter.toHtml(md);
    expect(html).toContain('<blockquote>');
    expect(html).toContain('Line 1');
    expect(html).toContain('Line 2');
    expect(html).toContain('Line 3');
    expect(html).toContain('</blockquote>');
  });

  it('should handle blockquote with inline formatting', () => {
    const md = '> This is **bold** and *emphasis*';
    const html = MarkdownConverter.toHtml(md);
    expect(html).toContain('<blockquote>');
    expect(html).toContain('<strong>bold</strong>');
    expect(html).toContain('<em>emphasis</em>');
    expect(html).toContain('</blockquote>');
  });

  it('should handle nested blockquotes', () => {
    const md = [
      '> Outer line',
      '>> Inner line'
    ].join('\n');
    const html = MarkdownConverter.toHtml(md);
    expect(html).toMatch(/<blockquote>[\s\S]*Outer line[\s\S]*<blockquote>[\s\S]*Inner line[\s\S]*<\/blockquote>[\s\S]*<\/blockquote>/);
  });

  it('should allow up to 3 leading spaces before ">"', () => {
    const md = '   > Indented blockquote';
    const html = MarkdownConverter.toHtml(md);
    expect(html).toContain('<blockquote>');
    expect(html).toContain('<p>Indented blockquote</p>');
    expect(html).toContain('</blockquote>');
  });

  it('should render blockquote followed by a normal paragraph', () => {
    const md = [
      '> Quote line',
      '',
      'Normal paragraph after'
    ].join('\n');
    const html = MarkdownConverter.toHtml(md);
    expect(html).toContain('<blockquote>');
    expect(html).toContain('<p>Quote line</p>');
    expect(html).toContain('</blockquote>');
    expect(html).toContain('<p>Normal paragraph after</p>');
  });
});

describe('MarkdownConverter - blockquote combinations', () => {
  it('converts blockquote containing a heading', () => {
    const md = ['> # Title', '> content'].join('\n');
    const html = MarkdownConverter.toHtml(md);
    expect(html).toContain('<blockquote>');
    expect(html).toContain('<h1>Title</h1>');
    expect(html).toContain('<p>content</p>');
    expect(html).toContain('</blockquote>');
  });

  it('converts blockquote followed by hr and paragraph', () => {
    const md = ['> Quote', '', '---', '', 'After'].join('\n');
    const html = MarkdownConverter.toHtml(md);
    expect(html).toContain('<blockquote>');
    expect(html).toContain('<p>Quote</p>');
    expect(html).toContain('</blockquote>');
    expect(html).toContain('<hr>');
    expect(html).toContain('<p>After</p>');
  });
});

describe('parseBlockquote - break on code token (exact HTML)', () => {
  it('splits into two blockquotes when a code block interrupts continuation', () => {
    const md = [
      '> Blockquote intro',
      '>',
      '>     indented code',
      '> Next quote'
    ].join('\n');
    const html = MarkdownConverter.toHtml(md) as string;

    const expected = [
      '<blockquote>',
      '<p>Blockquote intro</p>',
      '<pre><code>indented code',
      '</code></pre>',
      '<p>Next quote</p>',
      '</blockquote>',
      ''
    ].join('\n');

    expect(html).toBe(expected);
  });
});

describe('parseBlockquote - merge into nested blockquote (exact HTML)', () => {
  it('merges subsequent nested lines into the same inner blockquote', () => {
    const md = [
      '> Outer 1',
      '>> Inner A',
      '>> Inner B'
    ].join('\n');

    const html = MarkdownConverter.toHtml(md) as string;

    const expected = [
      '<blockquote>',
      '<p>Outer 1</p>',
      '<blockquote>',
      '<p>Inner A',
      'Inner B</p>',
      '</blockquote>',
      '</blockquote>',
      ''
    ].join('\n');

    expect(html).toBe(expected);
  });
});

describe('parseBlockquote - continue after list token (exact HTML)', () => {
  it('keeps list and trailing paragraph within the same blockquote', () => {
    const md = [
      '> - item 1',
      '> - item 2',
      '> trailing'
    ].join('\n');

    const html = MarkdownConverter.toHtml(md) as string;

    const expected = [
      '<blockquote>',
      '<ul>',
      '<li>item 1</li>',
      '<li>item 2\ntrailing</li>',
      '</ul>',
      '</blockquote>',
      ''
    ].join('\n');

    expect(html).toBe(expected);
  });
});

describe('MarkdownConverter - blockquote continuation branches (no regex, partial contains)', () => {

  it('breaks continuation when the last inner token is an indented code block', () => {
    const md = [
      '> Blockquote intro',
      '>',
      '>     indented code',
      'Outside paragraph'
    ].join('\n');

    const html = MarkdownConverter.toHtml(md);

    // Blockquote exists with intro paragraph and code block inside it
    expect(html).toBe(`<blockquote>
<p>Blockquote intro</p>
<pre><code>indented code
</code></pre>
</blockquote>\n<p>Outside paragraph</p>\n`);
  });

  it('merges continuation when the last inner token is a nested blockquote', () => {
    const md = [
      '> Outer 1',
      '>> Inner A',
      '>> Inner B',
      'Tail after'
    ].join('\n');

    const html = MarkdownConverter.toHtml(md);
    // Outer blockquote exists and contains inner blockquote
    expect(html).toBe(`<blockquote>
<p>Outer 1</p>
<blockquote>
<p>Inner A
Inner B</p>
</blockquote>
</blockquote>\n`);
  });

  it('continues outer loop when the last inner token is a list; keeps following lines outside', () => {
    const md = [
      '> - item 1',
      '>   - sub-item',
      'outside continuation',
      '',
      'another paragraph'
    ].join('\n');

    const html = MarkdownConverter.toHtml(md);

    // The list is inside the blockquote
    expect(html).toBe(`<blockquote>
<ul>
<li>item 1<ul>
<li>sub-item
outside continuation</li>
</ul>
</li>
</ul>
</blockquote>\n<p>another paragraph</p>\n`);
  });

  it('keeps trailing content after a list within the same blockquote', () => {
    const md = [
      '> - item 1',
      '> - item 2',
      '> trailing'
    ].join('\n');

    const html = MarkdownConverter.toHtml(md);

    // Blockquote with list items
    expect(html).toBe(`<blockquote>
<ul>
<li>item 1</li>
<li>item 2
trailing</li>
</ul>
</blockquote>\n`);
  });

  it('breaks continuation after fenced code inside blockquote', () => {
    const md = [
      '> ```js',
      '> const a = 1;',
      '> ```',
      'after the fence'
    ].join('\n');

    const html =MarkdownConverter.toHtml(md);
    // Fenced code block inside blockquote
    expect(html).toBe(`<blockquote>
<pre><code class="language-js">const a = 1;
</code></pre>
</blockquote>\n<p>after the fence</p>\n`);
  });
});
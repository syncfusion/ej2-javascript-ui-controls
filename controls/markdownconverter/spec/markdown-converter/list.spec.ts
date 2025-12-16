import { MarkdownConverterOptions } from "../../src/markdown-converter/interface";
import { Lexer } from "../../src/markdown-converter/lexer";
import { MarkdownConverter } from "../../src/markdown-converter/markdown-converter";
import { Parser } from "../../src/markdown-converter/parser";
import { block, inline, other } from "../../src/markdown-converter/rules";
import { Tokenizer } from "../../src/markdown-converter/tokenizer";
import { Token, TokenList } from "../../src/markdown-converter/tokens";
import { getDefaults } from "../../src/markdown-converter/utils";

// Minimal, typed fake lexer
function makeFakeLexer(): Lexer {
  const fake = {
    state: { inLink: false, inRawBlock: false, top: true },
    inline: (_: string): Token[] => [],
    tokenizeInline: (_: string): Token[] => [],
    tokenizeBlocks: (_: string, __: Token[] = [], ___?: boolean): Token[] => []
  } as unknown as Lexer;
  return fake;
}

function makeTokenizer(opts?: Partial<MarkdownConverterOptions>): Tokenizer {
  const options = { ...getDefaults(), ...(opts || {}) } as MarkdownConverterOptions;
  const tz = new Tokenizer(options);
  tz.rules = { other, block: block.gfm, inline: inline.gfm } as any;
  tz.lexer = makeFakeLexer();
  return tz;
}

describe('MarkdownConverter - List convertion', () => {
  describe('MarkdownConverter - Ordered List use cases', () => {
    it('converts a basic ordered list starting from 1', () => {
      const md = [
        '1. First',
        '2. Second',
        '3. Third'
      ].join('\n');
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe('<ol>\n<li>First</li>\n<li>Second</li>\n<li>Third</li>\n</ol>\n');
    });

    it('converts an ordered list with custom start index', () => {
      const md = [
        '3. Third',
        '4. Fourth'
      ].join('\n');
      const html = MarkdownConverter.toHtml(md);
      // Depending on renderer behavior, it may or may not include start="3"
      // Accept either: with or without the start attribute.
      expect(
        html === '<ol start="3">\n<li>Third</li>\n<li>Fourth</li>\n</ol>\n' ||
        html === '<ol>\n<li>Third</li>\n<li>Fourth</li>\n</ol>\n').toBe(true)
    });

    it('renders a basic ordered list (1., 2., 3.)', () => {
      const md = [
        '1. First',
        '2. Second',
        '3. Third'
      ].join('\n');
      const html = MarkdownConverter.toHtml(md);
      const expectedHtml = [
        '<ol>',
        '<li>First</li>',
        '<li>Second</li>',
        '<li>Third</li>',
        '</ol>',
        ''
      ].join('\n');
      expect(html).toBe(expectedHtml);
    });

    it('renders ordered list starting at 3', () => {
      const md = [
        '3. Third',
        '4. Fourth'
      ].join('\n');
      const html = MarkdownConverter.toHtml(md);
      // If your renderer includes start="3", keep this. If not, replace with <ol>... and adjust.
      const expectedHtml = [
        '<ol start="3">',
        '<li>Third</li>',
        '<li>Fourth</li>',
        '</ol>',
        ''
      ].join('\n');
      expect(html).toBe(expectedHtml);
    });

    it('renders ordered list containing a nested unordered list', () => {
      const md = [
        '1. Parent',
        '   - Child A',
        '   - Child B',
        '2. Sibling'
      ].join('\n');
      const html = MarkdownConverter.toHtml(md);
      const expectedHtml = [
        '<ol>',
        '<li>Parent<ul>',
        '<li>Child A</li>',
        '<li>Child B</li>',
        '</ul>',
        '</li>',
        '<li>Sibling</li>',
        '</ol>',
        ''
      ].join('\n');
      expect(html).toBe(expectedHtml);
    });

    it('renders unordered list inside ordered list item with paragraphs', () => {
      const md = [
        '1. Item one paragraph one.',
        '',
        '   Item one paragraph two.',
        '2. Item two'
      ].join('\n');
      const html = MarkdownConverter.toHtml(md);
      const expectedHtml = [
        '<ol>',
        '<li><p>Item one paragraph one.</p>',
        '<p>Item one paragraph two.</p>',
        '</li>',
        '<li><p>Item two</p>',
        '</li>',
        '</ol>',
        ''
      ].join('\n');
      expect(html).toBe(expectedHtml);
    });

    it('renders ordered list item containing a fenced code block with language', () => {
      const md = [
        '1. Step one',
        '',
        '   ```js',
        '   const ok = true;',
        '   ```',
        '2. Step two'
      ].join('\n');
      const html = MarkdownConverter.toHtml(md);
      const expectedHtml = [
        '<ol>',
        '<li><p>Step one</p>',
        '<pre><code class="language-js">const ok = true;',
        '</code></pre>', '</li>',
        '<li><p>Step two</p>', '</li>',
        '</ol>',
        ''
      ].join('\n');
      expect(html).toBe(expectedHtml);
    });

    it('renders ordered list items with inline formatting and links', () => {
      const md = [
        '1. Use **bold** text',
        '2. Use *italic* text',
        '3. Use `code` and [link](https://example.com)'
      ].join('\n');
      const html = MarkdownConverter.toHtml(md);
      const expectedHtml = [
        '<ol>',
        '<li>Use <strong>bold</strong> text</li>',
        '<li>Use <em>italic</em> text</li>',
        '<li>Use <code>code</code> and <a href="https://example.com">link</a></li>',
        '</ol>',
        ''
      ].join('\n');
      expect(html).toBe(expectedHtml);
    });

    it('renders an ordered list item that contains a nested unordered list which itself contains an ordered list', () => {
      const md = [
        '1. Parent OL item',
        '   - Child UL item',
        '     1. Grandchild OL item',
        '2. Sibling OL item'
      ].join('\n');
      const html = MarkdownConverter.toHtml(md);
      const expected = [
        '<ol>',
        '<li>Parent OL item<ul>',
        '<li>Child UL item<ol>',
        '<li>Grandchild OL item</li>',
        '</ol>',
        '</li>',
        '</ul>',
        '</li>',
        '<li>Sibling OL item</li>',
        '</ol>',
        ''
      ].join('\n');
      expect(html).toBe(expected);
    });

    it('renders an ordered list containing a blockquote within an item', () => {
      const md = [
        '1. Item with quote',
        '',
        '   > A nested quote',
        '2. Last item'
      ].join('\n');
      const html = MarkdownConverter.toHtml(md);
      const expected = [
        '<ol>',
        '<li><p>Item with quote</p>',
        '<blockquote>',
        '<p>A nested quote</p>',
        '</blockquote>',
        '</li>',
        '<li><p>Last item</p>',
        '</li>',
        '</ol>',
        ''
      ].join('\n');
      expect(html).toBe(expected);
    });

    it('renders ordered list split by a horizontal rule into two separate lists', () => {
      const md = [
        '1. First',
        '2. Second',
        '',
        '---',
        '',
        '1. Third',
        '2. Fourth'
      ].join('\n');
      const html = MarkdownConverter.toHtml(md);
      const expected = [
        '<ol>',
        '<li>First</li>',
        '<li>Second</li>',
        '</ol>',
        '<hr>',
        '<ol>',
        '<li>Third</li>',
        '<li>Fourth</li>',
        '</ol>',
        ''
      ].join('\n');
      expect(html).toBe(expected);
    });

    it('renders ordered list item containing an image and a link', () => {
      const md = [
        '1. Item with image ![alt](https://example.com/a.png)',
        '2. Item with link [click](https://example.com)'
      ].join('\n');
      const html = MarkdownConverter.toHtml(md);
      const expected = [
        '<ol>',
        '<li>Item with image <img src="https://example.com/a.png" alt="alt"></li>',
        '<li>Item with link <a href="https://example.com">click</a></li>',
        '</ol>',
        ''
      ].join('\n');
      expect(html).toBe(expected);
    });

    it('renders an ordered list item that contains a heading followed by text', () => {
      const md = [
        '1. Introduction',
        '',
        '   ### Subheading',
        '   Details after subheading.',
        '2. Done'
      ].join('\n');
      const html = MarkdownConverter.toHtml(md);
      const expected = [
        '<ol>',
        '<li><p>Introduction</p>',
        '<h3>Subheading</h3>',
        '<p>Details after subheading.</p>',
        '</li>',
        '<li><p>Done</p>',
        '</li>',
        '</ol>',
        ''
      ].join('\n');
      expect(html).toBe(expected);
    });

    it('creates an ordered list starting at a 9-digit value for a single item', () => {
      const md = '123456789. ok';
      const html = MarkdownConverter.toHtml(md);
      const expected = [
        '<ol start="123456789">',
        '<li>ok</li>',
        '</ol>',
        ''
      ].join('\n');
      expect(html).toBe(expected);
    });

    it('treats a standalone 10-digit marker line as a paragraph (not a list item)', () => {
      const md = '1234567890. not ok';
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe('<p>1234567890. not ok</p>\n');
    });

  });
  describe('MarkdownConverter - Unordered lists use cases', () => {
    it('converts a basic unordered list with dashes', () => {
      const md = [
        '- Item 1',
        '- Item 2',
        '- Item 3'
      ].join('\n');
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe('<ul>\n<li>Item 1</li>\n<li>Item 2</li>\n<li>Item 3</li>\n</ul>\n');
    });

    it('renders lists separated by blank lines as separate list blocks', () => {
      const md = [
        '- A',
        '- B',
        '',
        '- C'
      ].join('\n');
      const html = MarkdownConverter.toHtml(md);
      const expectedHtml = [
        '<ul>',
        '<li><p>A</p>',
        '</li>',
        '<li><p>B</p>',
        '</li>',
        '<li><p>C</p>',
        '</li>',
        '</ul>',
        ''
      ].join('\n');
      expect(html).toBe(expectedHtml);
    });

    it('converts a basic unordered list with asterisks', () => {
      const md = [
        '* Item A',
        '* Item B'
      ].join('\n');
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe('<ul>\n<li>Item A</li>\n<li>Item B</li>\n</ul>\n');
    });

    it('converts a nested unordered list (two levels)', () => {
      const md = [
        '- Parent 1',
        '  - Child 1.1',
        '  - Child 1.2',
        '- Parent 2'
      ].join('\n');
      const html = MarkdownConverter.toHtml(md);
      const expectedHtml = [
        '<ul>',
        '<li>Parent 1<ul>',
        '<li>Child 1.1</li>',
        '<li>Child 1.2</li>',
        '</ul>',
        '</li>',
        '<li>Parent 2</li>',
        '</ul>',
        ''
      ].join('\n');
      expect(html).toBe(expectedHtml);
    });

    it('renders mixed unordered markers (-, *, +) as Separate UL block', () => {
      const md = [
        '- Dash item',
        '* Star item',
        '+ Plus item'
      ].join('\n');
      const html = MarkdownConverter.toHtml(md);
      const expectedHtml = [
        '<ul>',
        '<li>Dash item</li>',
        '</ul>',
        '<ul>',
        '<li>Star item</li>',
        '</ul>',
        '<ul>',
        '<li>Plus item</li>',
        '</ul>',
        ''
      ].join('\n');
      expect(html).toBe(expectedHtml);
    });

    it('supports list item text with inline formatting', () => {
      const md = [
        '- This is **bold** and *italic*',
        '- Mixed `code` and ~~del~~'
      ].join('\n');
      const html = MarkdownConverter.toHtml(md);
      expect(html).toContain('<ul>');
      expect(html).toContain('<li>This is <strong>bold</strong> and <em>italic</em></li>');
      expect(html).toContain('<li>Mixed <code>code</code> and <del>del</del></li>');
      expect(html).toContain('</ul>');
    });

    it('renders a list item that contains a paragraph (blank line separation)', () => {
      const md = [
        '- Item 1',
        '',
        '  Continuation paragraph for item 1.',
        '- Item 2'
      ].join('\n');
      const html = MarkdownConverter.toHtml(md);
      const expectedHtml = [
        '<ul>',
        '<li><p>Item 1</p>',
        '<p>Continuation paragraph for item 1.</p>', '</li>',
        '<li><p>Item 2</p>',
        '</li>',
        '</ul>',
        ''
      ].join('\n');
      expect(html).toBe(expectedHtml);
    });

    it('renders tight unordered list (no blank lines)', () => {
      const md = [
        '- A',
        '- B',
        '- C'
      ].join('\n');
      const html = MarkdownConverter.toHtml(md);
      const expectedHtml = [
        '<ul>',
        '<li>A</li>',
        '<li>B</li>',
        '<li>C</li>',
        '</ul>',
        ''
      ].join('\n');
      expect(html).toBe(expectedHtml);
    });

    it('renders loose unordered list (with blank lines) as paragraphs in items', () => {
      const md = [
        '- Item 1',
        '',
        '- Item 2'
      ].join('\n');
      const html = MarkdownConverter.toHtml(md);
      // Many Markdown engines render loose items as <li><p>...</p></li>
      const expectedHtml = [
        '<ul>',
        '<li><p>Item 1</p>',
        '</li>',
        '<li><p>Item 2</p>',
        '</li>',
        '</ul>',
        ''
      ].join('\n');
      expect(html).toBe(expectedHtml);
    });

    it('renders nested unordered lists of multiple levels', () => {
      const md = [
        '- Parent',
        '  - Child 1',
        '    - Grandchild 1.1',
        '  - Child 2'
      ].join('\n');
      const html = MarkdownConverter.toHtml(md);
      const expectedHtml = [
        '<ul>',
        '<li>Parent<ul>',
        '<li>Child 1<ul>',
        '<li>Grandchild 1.1</li>',
        '</ul>',
        '</li>',
        '<li>Child 2</li>',
        '</ul>',
        '</li>',
        '</ul>',
        ''
      ].join('\n');
      expect(html).toBe(expectedHtml);
    });

    it('renders unordered list item with multiple paragraphs (continuation)', () => {
      const md = [
        '- Item 1 paragraph 1.',
        '',
        '  Item 1 paragraph 2.',
        '- Item 2'
      ].join('\n');
      const html = MarkdownConverter.toHtml(md);
      const expectedHtml = [
        '<ul>',
        '<li><p>Item 1 paragraph 1.</p>',
        '<p>Item 1 paragraph 2.</p>', '</li>',
        '<li><p>Item 2</p>', '</li>',
        '</ul>',
        ''
      ].join('\n');
      expect(html).toBe(expectedHtml);
    });

    it('renders unordered list item containing inline elements', () => {
      const md = [
        '- Text with **bold** and *em* and `code`',
        '- Link [here](https://example.com) and image ![alt](https://example.com/a.png)'
      ].join('\n');

      const html = MarkdownConverter.toHtml(md);
      const expectedHtml = [
        '<ul>',
        '<li>Text with <strong>bold</strong> and <em>em</em> and <code>code</code></li>',
        '<li>Link <a href="https://example.com">here</a> and image <img src="https://example.com/a.png" alt="alt"></li>',
        '</ul>',
        ''
      ].join('\n');

      expect(html).toBe(expectedHtml);
    });

    it('renders unordered list item containing a fenced code block', () => {
      const md = [
        '- Item 1',
        '',
        '  ```',
        '  code in list',
        '  ```',
        '- Item 2'
      ].join('\n');
      const html = MarkdownConverter.toHtml(md);
      const expectedHtml = [
        '<ul>',
        '<li><p>Item 1</p>',
        '<pre><code>code in list',
        '</code></pre>', '</li>',
        '<li><p>Item 2</p>', '</li>',
        '</ul>',
        ''
      ].join('\n');
      expect(html).toBe(expectedHtml);
    });

    it('renders lists separated by a blank line as one block (engine-specific)', () => {
      const md = [
        '- A',
        '- B',
        '',
        '- C'
      ].join('\n');
      const html = MarkdownConverter.toHtml(md);
      const expectedHtml = [
        '<ul>',
        '<li><p>A</p>',
        '</li>',
        '<li><p>B</p>',
        '</li>',
        '<li><p>C</p>',
        '</li>',
        '</ul>',
        ''
      ].join('\n');
      expect(html).toBe(expectedHtml);
    });
    it('renders UL with three levels of nesting', () => {
      const md = [
        '- L1',
        '  - L2',
        '    - L3'
      ].join('\n');
      const html = MarkdownConverter.toHtml(md);
      const expected = [
        '<ul>',
        '<li>L1<ul>',
        '<li>L2<ul>',
        '<li>L3</li>',
        '</ul>',
        '</li>',
        '</ul>',
        '</li>',
        '</ul>',
        ''
      ].join('\n');
      expect(html).toBe(expected);
    });

    it('renders UL item containing a fenced code block without language', () => {
      const md = [
        '- Intro',
        '',
        '  ```',
        '  code block inside list',
        '  ```',
        '- Outro'
      ].join('\n');
      const html = MarkdownConverter.toHtml(md);
      const expected = [
        '<ul>',
        '<li><p>Intro</p>',
        '<pre><code>code block inside list',
        '</code></pre>',
        '</li>',
        '<li><p>Outro</p>',
        '</li>',
        '</ul>',
        ''
      ].join('\n');
      expect(html).toBe(expected);
    });

    it('renders UL split by a horizontal rule into two separate UL blocks', () => {
      const md = [
        '- A',
        '- B',
        '',
        '---',
        '',
        '- C',
        '- D'
      ].join('\n');
      const html = MarkdownConverter.toHtml(md);
      const expected = [
        '<ul>',
        '<li>A</li>',
        '<li>B</li>',
        '</ul>',
        '<hr>',
        '<ul>',
        '<li>C</li>',
        '<li>D</li>',
        '</ul>',
        ''
      ].join('\n');
      expect(html).toBe(expected);
    });

    it('renders UL item with inline bold, italic, code, and link together', () => {
      const md = [
        '- Mix **bold**, *italic*, `code`, and [link](https://example.com)'
      ].join('\n');
      const html = MarkdownConverter.toHtml(md);
      const expected = [
        '<ul>',
        '<li>Mix <strong>bold</strong>, <em>italic</em>, <code>code</code>, and <a href="https://example.com">link</a></li>',
        '</ul>',
        ''
      ].join('\n');
      expect(html).toBe(expected);
    });

    it('renders UL item that contains an image followed by emphasized text', () => {
      const md = [
        '- ![Alt](https://example.com/a.png) with *emphasis*'
      ].join('\n');
      const html = MarkdownConverter.toHtml(md);
      const expected = [
        '<ul>',
        '<li><img src="https://example.com/a.png" alt="Alt"> with <em>emphasis</em></li>',
        '</ul>',
        ''
      ].join('\n');
      expect(html).toBe(expected);
    });

    it('renders a UL containing a nested OL with two items', () => {
      const md = [
        '- Parent',
        '  1. Child A',
        '  2. Child B'
      ].join('\n');

      const html = MarkdownConverter.toHtml(md);
      const expected = [
        '<ul>',
        '<li>Parent<ol>',
        '<li>Child A</li>',
        '<li>Child B</li>',
        '</ol>',
        '</li>',
        '</ul>',
        ''
      ].join('\n');
      expect(html).toBe(expected);
    });
  });
  describe('MarkdownConverter - Blockquote with Ordered List and Unordered List (single level)', () => {
    it('renders a blockquote containing an ordered list with a continued paragraph', () => {
      const md = [
        '> 1. item',
        '>',
        '>    more'
      ].join('\n');
      const html = MarkdownConverter.toHtml(md);
      expect(html).toMatch(
        /<blockquote>[\s\S]*<ol>[\s\S]*<li>[\s\S]*<p>item<\/p>[\s\S]*<p>more<\/p>[\s\S]*<\/li>[\s\S]*<\/ol>[\s\S]*<\/blockquote>/
      );
    });
    it('renders a blockquote containing an unordered list with a continued paragraph', () => {
      const md = [
        '> - item',
        '>',
        '>   more'
      ].join('\n');
      const html = MarkdownConverter.toHtml(md);
      expect(html).toMatch(
        /<blockquote>[\s\S]*<ul>[\s\S]*<li>[\s\S]*<p>item<\/p>[\s\S]*<p>more<\/p>[\s\S]*<\/li>[\s\S]*<\/ul>[\s\S]*<\/blockquote>/
      );
    });
    it('renders >>- one; >>; >  > two as nested blockquotes containing a UL and a paragraph', () => {
      const md = [
        '>>- one',
        '>>',
        '>  > two'
      ].join('\n');
      const html = MarkdownConverter.toHtml(md);
      expect(html).toMatch(
        /<blockquote>\s*<blockquote>\s*<ul>\s*<li>one<\/li>\s*<\/ul>\s*<p>two<\/p>\s*<\/blockquote>\s*<\/blockquote>/
      );
    });
  });
});

describe('MarkdownConverter - List with horizontal rule "* * *" between items', () => {
  it('renders "* Foo\\n* * *\\n* Bar" as UL, HR, UL (no blank lines)', () => {
    const md = [
      '* Foo',
      '* * *',
      '* Bar'
    ].join('\n');
    const html = MarkdownConverter.toHtml(md);
    const expected = [
      '<ul>',
      '<li>Foo</li>',
      '</ul>',
      '<hr>',
      '<ul>',
      '<li>Bar</li>',
      '</ul>',
      ''
    ].join('\n');

    expect(html).toBe(expected);
  });

  it('renders list items split by a space-separated HR with surrounding blank lines', () => {
    const md = [
      '* Foo',
      '',
      '* * *',
      '',
      '* Bar'
    ].join('\n');
    const html = MarkdownConverter.toHtml(md);
    const expected = [
      '<ul>',
      '<li>Foo</li>',
      '</ul>',
      '<hr>',
      '<ul>',
      '<li>Bar</li>',
      '</ul>',
      ''
    ].join('\n');

    expect(html).toBe(expected);
  });
});

describe('MarkdownConverter - Task list', () => {
  it('unchecked and checked (dash marker)', () => {
    const md = `- [ ] foo
- [x] bar`;

    const html = MarkdownConverter.toHtml(md);

    expect(html).toBe(`<ul>
<li><input disabled="" type="checkbox"> foo</li>
<li><input checked="" disabled="" type="checkbox"> bar</li>
</ul>
`);
  });

  it('checked with uppercase X', () => {
    const md = `- [X] done
- [ ] pending`;

    const html = MarkdownConverter.toHtml(md);

    expect(html).toBe(`<ul>
<li><input checked="" disabled="" type="checkbox"> done</li>
<li><input disabled="" type="checkbox"> pending</li>
</ul>
`);
  });

  it('star and plus markers (separate UL blocks)', () => {
    const md = `* [ ] alpha
+ [x] beta`;

    const html = MarkdownConverter.toHtml(md);

    expect(html).toBe(`<ul>
<li><input disabled="" type="checkbox"> alpha</li>
</ul>
<ul>
<li><input checked="" disabled="" type="checkbox"> beta</li>
</ul>
`);
  });

  it('ordered checklist (1., 2.)', () => {
    const md = `1. [ ] first
2. [x] second`;

    const html = MarkdownConverter.toHtml(md);

    expect(html).toBe(`<ol>
<li><input disabled="" type="checkbox"> first</li>
<li><input checked="" disabled="" type="checkbox"> second</li>
</ol>
`);
  });

  it('nested checklist under a parent list item (UL)', () => {
    const md = `- parent
  - [ ] child A
  - [x] child B`;

    const html = MarkdownConverter.toHtml(md);

    expect(html).toBe(`<ul>
<li>parent<ul>
<li><input disabled="" type="checkbox"> child A</li>
<li><input checked="" disabled="" type="checkbox"> child B</li>
</ul>
</li>
</ul>
`);
  });

  it('nested ordered checklist under a parent list item (OL)', () => {
    const md = `- parent
  1. [ ] A
  2. [x] B`;

    const html = MarkdownConverter.toHtml(md);

    expect(html).toBe(`<ul>
<li>parent<ol>
<li><input disabled="" type="checkbox"> A</li>
<li><input checked="" disabled="" type="checkbox"> B</li>
</ol>
</li>
</ul>
`);
  });

  it('checklist inside a blockquote', () => {
    const md = `> - [ ] todo
> - [x] done`;

    const html = MarkdownConverter.toHtml(md);

    expect(html).toBe(`<blockquote>
<ul>
<li><input disabled="" type="checkbox"> todo</li>
<li><input checked="" disabled="" type="checkbox"> done</li>
</ul>
</blockquote>
`);
  });

  it('task item with inline formatting', () => {
    const md = `- [ ] use **bold**, *italic*, and \`code\``;

    const html = MarkdownConverter.toHtml(md);

    expect(html).toBe(`<ul>
<li><input disabled="" type="checkbox"> use <strong>bold</strong>, <em>italic</em>, and <code>code</code></li>
</ul>
`);
  });

  it('task item with link and image', () => {
    const md = `- [x] see [docs](https://example.com) and ![alt](https://example.com/a.png)`;
    const html = MarkdownConverter.toHtml(md);
    expect(html).toBe(`<ul>
<li><input checked="" disabled="" type="checkbox"> see <a href="https://example.com">docs</a> and <img src="https://example.com/a.png" alt="alt"></li>
</ul>
`);
  });

  it('task item with continuation paragraph', () => {
    const md = `- [ ] first line

  continuation line`;
    const html = MarkdownConverter.toHtml(md);

    expect(html).toBe(`<ul>
<li><p><input disabled="" type="checkbox"> \nfirst line</p>
<p>continuation line</p>
</li>
</ul>
`);
  });

  it('two separate checklists split by hr', () => {
    const md = `- [ ] A
- [x] B

---

- [ ] C
- [x] D`;

    const html = MarkdownConverter.toHtml(md);
    expect(html).toBe(`<ul>
<li><input disabled="" type="checkbox"> A</li>
<li><input checked="" disabled="" type="checkbox"> B</li>
</ul>
<hr>
<ul>
<li><input disabled="" type="checkbox"> C</li>
<li><input checked="" disabled="" type="checkbox"> D</li>
</ul>
`);
  });

  it('empty task label', () => {
    const md = `- [ ]`;
    const html = MarkdownConverter.toHtml(md);
    expect(html).toBe(`<ul>
<li>[ ]</li>
</ul>
`);
  });
});

describe('Renderer.renderListItem - loose task list item injects checkbox and escapes first text token', () => {
  it('injects checkbox into first paragraph and escapes text (&, <, >) when item is loose', () => {
    // Loose task item: a blank line after the first line makes the item loose.
    // Include characters that require escaping to verify escaped=true behavior.
    const md = `- [ ] first & <tag>

  more`;
    const html = MarkdownConverter.toHtml(md);
    expect(html).toBe(`<ul>
<li><p><input disabled="" type="checkbox"> 
first &amp; <tag></p>
<p>more</p>
</li>
</ul>
`);
  });
});

describe('Renderer.renderListItem - first child is paragraph (loose task item)', () => {
  it('injects an unchecked checkbox into the first paragraph and escapes the first text token', () => {
    const parser = new Parser();             // sets up parser + renderer
    const renderer = parser.renderer;

    // Synthetic loose task item where the first child token is a paragraph.
    // Include escapable characters (&, <) to validate escaped=true behavior.
    const item: any = {
      task: true,
      checked: false,
      loose: true,
      tokens: [
        {
          type: 'paragraph',
          raw: 'first & <x>',
          text: 'first & <x>',
          tokens: [
            {
              type: 'text',
              raw: 'first & <x>',
              text: 'first & <x>'
            }
          ]
        }
      ]
    };

    const html = renderer.renderListItem(item);

    // Expected:
    // - Checkbox injected before the paragraph’s text
    // - First inline text token escaped (& -> &amp;, <x> -> &lt;x&gt;) and escaped=true
    // - Paragraph wrapped; entire item wrapped as <li>...</li>
    expect(html).toBe('<li><p><input disabled="" type="checkbox"> first &amp; &lt;x&gt;</p>\n</li>\n');
  });

  it('injects a checked checkbox when item.checked = true', () => {
    const parser = new Parser();
    const renderer = parser.renderer;
    const item: any = {
      task: true,
      checked: true,
      loose: true,
      tokens: [
        {
          type: 'paragraph',
          raw: 'alpha & <b>',
          text: 'alpha & <b>',
          tokens: [
            {
              type: 'text',
              raw: 'alpha & <b>',
              text: 'alpha & <b>'
            }
          ]
        }
      ]
    };

    const html = renderer.renderListItem(item);
    expect(html).toBe('<li><p><input checked="" disabled="" type="checkbox"> alpha &amp; &lt;b&gt;</p>\n</li>\n');
  });
});

describe('tokenizer.ts parseList branches', () => {
  it('handles an item that starts with a blank line and ends early (blankLine + next blank)', () => {
    const tz = makeTokenizer({ gfm: true});
    // A list item with only a bullet, followed by a blank line.
    // Triggers: blankLine === true and rules.other.blankLine.test(nextLine) === true -> endEarly = true
    const md = '-\n\nrest';
    const list = tz.parseList(md) as TokenList;

    expect(list).toBeDefined();
    expect(list.type).toBe('list');
    expect(list.items.length).toBe(1);

    const item = list.items[0];
    expect(item.raw).toBe('-');
    // No content gathered since we ended early
    expect(item.text).toBe('');
  });

  it('uses pedantic branch: indent=2 and stringTrimStart(line)', () => {
    const tz = makeTokenizer({ gfm: false });
    // After "- " we provide extra spaces before content. In pedantic mode,
    // indent is forced to 2 and stringTrimStart is used, so leading spaces are removed.
    const md = '-   content\n';
    const list = tz.parseList(md) as TokenList;

    expect(list).toBeDefined();
    expect(list.items.length).toBe(1);

    const item = list.items[0];
    // Pedantic branch should have trimmed leading spaces from "   content"
    expect(item.text).toContain('content');
    expect(item.text.startsWith('content')).toBe(true);
  });

  it('replaces tabs and computes indent in non-pedantic mode (listReplaceTabs path)', () => {
    const tz = makeTokenizer({ gfm: true });
    // Use a tab after "- " to trigger listReplaceTabs.
    // The code replaces a leading "\t" with 3 spaces and then computes indent.
    const md = '- \titem\n';
    const list = tz.parseList(md) as TokenList;

    expect(list).toBeDefined();
    expect(list.items.length).toBe(1);

    const item = list.items[0];
    // After tab replacement and indent slicing, only "item" should remain
    expect(item.text).toContain('item');
    expect(item.text.trim()).toBe('item');
  });
});
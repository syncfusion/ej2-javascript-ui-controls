import { MarkdownConverter } from "../../src/markdown-converter/markdown-converter";

describe('MarkdownConverter - Inline and Block code', () => {
  describe('inline code (`code`)', () => {
    it('should convert inline code span to <code> inside a paragraph', () => {
      const md = 'Use `code` here.';
      const html = MarkdownConverter.toHtml(md);
      expect(html).toContain('<p>Use <code>code</code> here.</p>');
    });

    it('should allow backticks inside a code span by using double backticks as fence', () => {
      const md = 'Use ``code with `backtick` inside`` here.';
      const html = MarkdownConverter.toHtml(md);
      expect(html).toContain('<p>Use <code>code with `backtick` inside</code> here.</p>');
    });

    it('should escape HTML inside inline code', () => {
      const md = 'Render `1 < 2 && 2 > 1` exactly.';
      const html = MarkdownConverter.toHtml(md);
      // HTML entities should be escaped inside code
      expect(html).toContain('<p>Render <code>1 &lt; 2 &amp;&amp; 2 &gt; 1</code> exactly.</p>');
    });
  });
  describe('fenced code block (```)', () => {
    it('should convert fenced code block to <pre><code>', () => {
      const md = [
        'Here is a code block:',
        '```',
        'function test() {',
        'return 42;',
        '}',
        '```'
      ].join('\n');
      const html = MarkdownConverter.toHtml(md);
      expect(html).toContain('<p>Here is a code block:</p>');
      expect(html).toContain('<pre><code>');
      expect(html).toContain('function test() {');
      expect(html).toContain('return 42;');
      expect(html).toContain('</code></pre>');
    });
    it('should support language info after the fence (no class assertion if not implemented)', () => {
      const md = [
        '```js',
        'const x = 1;',
        '```'
      ].join('\n');
      const html = MarkdownConverter.toHtml(md);
      expect(html).toContain(`<pre><code class="language-js">const x = 1;
</code></pre>`);
    });
    it('should preserve whitespace and line breaks inside fenced code', () => {
      const md = [
        '```',
        'line 1',
        'line 2 (indented)',
        'line 3',
        '```'
      ].join('\n');
      const html = MarkdownConverter.toHtml(md);
      const expectedHtml = [
        '<pre><code>line 1',
        'line 2 (indented)',
        'line 3',
        '</code></pre>',
        ''
      ].join('\n');
      expect(html).toBe(expectedHtml);
    });
    it('converts fenced code block using tildes (~~~)', () => {
      const md = [
        '~~~js',
        'const y = 2;',
        '~~~'
      ].join('\n');
      const html = MarkdownConverter.toHtml(md);
      const expectedHtml = [
        '<pre><code class="language-js">const y = 2;',
        '</code></pre>',
        ''
      ].join('\n');
      expect(html).toBe(expectedHtml);
    });

    it('converts inline code at paragraph boundaries', () => {
      const md = '`start` and end `code`';
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe('<p><code>start</code> and end <code>code</code></p>\n');
    });
  });
  describe('indented code block (4 spaces)', () => {
    it('should convert indented code block to <pre><code>', () => {
      const markdownInput = [
        '    line 1',
        '    line 2',
      ].join('\n');

      const expectedHtml = [
        '<pre><code>line 1',
        'line 2','</code></pre>', '',
      ].join('\n');
      const html = MarkdownConverter.toHtml(markdownInput);
      expect(html).toBe(expectedHtml);
    });
  });
});

describe('MarkdownConverter - Indented code block vs paragraph interruption', () => {
  it('does NOT allow an indented code block to interrupt a paragraph (merges into paragraph)', () => {
    const md = [
      'Paragraph line',
      '    still part of the same paragraph (indented 4 spaces)'
    ].join('\n');

    const html = MarkdownConverter.toHtml(md);
    expect(html).toBe('<p>Paragraph line\n' +
                '    still part of the same paragraph (indented 4 spaces)</p>\n');
  });

  it('treats indented code as a standalone code block when preceded by a blank line (pushes codeToken)', () => {
    // With a blank line, the indented lines form a proper indented code block.
    const md = [
      'Paragraph before',
      '',
      '    code line 1',
      '    code line 2',
      '',
      'Paragraph after'
    ].join('\n');

    const html = MarkdownConverter.toHtml(md);
    const expected = [
      '<p>Paragraph before</p>',
      '<pre><code>code line 1',
      'code line 2',
      '</code></pre>',
      '<p>Paragraph after</p>',
      ''
    ].join('\n');
    expect(html).toBe(expected);
  });

  it('treats a leading indented block as a standalone code block (pushes codeToken)', () => {
    // Code block at the start (no previous paragraph/text to merge with).
    const md = [
      '    const x = 1;',
      '    console.log(x);'
    ].join('\n');

    const html = MarkdownConverter.toHtml(md);
    const expected = [
      '<pre><code>const x = 1;',
      'console.log(x);',
      '</code></pre>',
      ''
    ].join('\n');
    expect(html).toBe(expected);
  });

  it('does NOT break a paragraph when the indented line follows immediately (prev token is paragraph)', () => {
    // Another explicit check for the merge branch with punctuation and mixed content
    const md = [
      'Intro text with punctuation.',
      '    indented continuation, not code block'
    ].join('\n');

    const html = MarkdownConverter.toHtml(md);
    // Single paragraph, no <pre><code>
    expect(html).toBe('<p>Intro text with punctuation.\n' +
                '    indented continuation, not code block</p>\n');
  });

});

describe('Tokenizer.indentCodeCompensation (fenced code)', () => {
  it('trims common indent when the fenced block is indented (covers all inner branches)', () => {
    // Opening fence indented by 3 spaces so indentToCode = '   '
    // Content lines:
    // - '   line1' (>= 3)  -> trimmed to 'line1'
    // - '     line2' (5)   -> trimmed to '  line2'
    // - '  x' (2)          -> unchanged (2 < 3)
    // - 'line0' (0)        -> unchanged (no beginningSpace match)
    const md = [
      '   ```js',
      '   line1',
      '     line2',
      '  x',
      'line0',
      '   ```'
    ].join('\n');
    const html = MarkdownConverter.toHtml(md) as string;
    
    // Should parse as code block with language js
    expect(html).toContain('<code');
    expect(html).toContain('js');
    
    // Should contain trimmed content
    expect(html).toContain('line1');
    expect(html).toContain('line2');
    expect(html).toContain('line0');
    
    // Should preserve relative indentation
    expect(html).toContain('  line2'); // 2 spaces preserved
  });

  it('returns content unchanged when the fenced block is not indented (no compensation)', () => {
    const md = [
      '```js',
      '    line1',   // 4 spaces
      '      line2', // 6 spaces
      ' x',         // 1 space
      'line0',      // 0 spaces
      '```'
    ].join('\n');
    const html = MarkdownConverter.toHtml(md) as string;

    // Should parse as code block
    expect(html).toContain('<code');
    expect(html).toContain('js');
    
    // No indent compensation → content spacing stays as-is
    expect(html).toContain('    line1'); // 4 spaces preserved
    expect(html).toContain('      line2'); // 6 spaces preserved
    expect(html).toContain(' x'); // 1 space preserved
    expect(html).toContain('line0');
  });
});

describe('MarkdownConverter - fenced code block rendering', () => {
  it('renders code block without language class when no language is provided', () => {
    const md = '```\nconsole.log("Hello");\n```';
    const html = MarkdownConverter.toHtml(md);
    expect(html).toBe('<pre><code>console.log(&quot;Hello&quot;);\n</code></pre>\n');
  });

  it('renders code block with language class when language is provided', () => {
    const md = '```javascript\nconsole.log("Hello");\n```';
    const html = MarkdownConverter.toHtml(md);
    expect(html).toBe('<pre><code class="language-javascript">console.log(&quot;Hello&quot;);\n</code></pre>\n');
  });

  it('extracts first non-space match from language and applies language class', () => {
    const md = '```   python  \nprint("Hello")\n```';
    const html = MarkdownConverter.toHtml(md);
    expect(html).toBe('<pre><code class="language-python">print(&quot;Hello&quot;)\n</code></pre>\n');
  });

  it('renders code block with escaped content when escaped=true', () => {
    const md = '```html\n<div>&</div>\n```';
    const html = MarkdownConverter.toHtml(md);
    expect(html).toBe('<pre><code class="language-html">&lt;div&gt;&amp;&lt;/div&gt;\n</code></pre>\n');
  });
});
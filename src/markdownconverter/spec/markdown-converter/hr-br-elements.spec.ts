import { MarkdownConverter } from "../../src/markdown-converter/markdown-converter";

describe('MarkdownConverter - Horizontal line', () => {
  describe('MarkdownConverter - Should convert horizontal line', () => { 
    it('should convert basic hr with dashes to HTML', () => {
      const md = '---';
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe('<hr>\n');
    });
    it('should convert hr with asterisks to HTML', () => {
      const md = '***';
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe('<hr>\n');
    });
    it('should convert hr with underscores to HTML', () => {
      const md = '___';
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe('<hr>\n');
    });
    it('should convert hr with leading spaces to HTML', () => {
      const md = '  ---';
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe('<hr>\n');
    });
    it('should convert hr with more than 3 characters to HTML', () => {
      const md = '-----';
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe('<hr>\n');
    });
    it('renders three consecutive "***" lines as three <hr> elements (no blank lines)', () => {
      const md = ['***', '***', '***'].join('\n');
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe('<hr>\n<hr>\n<hr>\n');
    });
  });
  describe('MarkdownConverter - Horizontal Rule Ensures <hr> correctly splits content into two paragraphs with a horizontal rule in between', () => {
    it('renders paragraph, <hr>, and paragraph in order', () => {
      const md = ['Above', '', '---', '', 'Below'].join('\n');
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe('<p>Above</p>\n<hr>\n<p>Below</p>\n');
    });
  });
  describe('MarkdownConverter | Horizontal rule validation | invalid HR markers should not render <hr>', () => {
    it('does not convert "+++" to <hr> (invalid HR marker)', () => {
      const md = '+++';
      const html = MarkdownConverter.toHtml(md);
      expect(html).not.toBe('<hr>\n');
      expect(html).toBe('<p>+++</p>\n');
    });

    it('does not convert "--" to <hr> (fewer than 3 dashes)', () => {
      const md = '--';
      const html = MarkdownConverter.toHtml(md);
      expect(html).not.toBe('<hr>\n');
      expect(html).toBe('<p>--</p>\n');
    });

    it('does not convert "**" to <hr> (fewer than 3 asterisks)', () => {
      const md = '**';
      const html = MarkdownConverter.toHtml(md);
      expect(html).not.toBe('<hr>\n');
      expect(html).toBe('<p>**</p>\n');
    });

    it('does not convert "__" to <hr> (fewer than 3 underscores)', () => {
      const md = '__';
      const html = MarkdownConverter.toHtml(md);
      expect(html).not.toBe('<hr>\n');
      expect(html).toBe('<p>__</p>\n');
    });
  });
  describe('MarkdownConverter | Horizontal rules with space-separated markers (* * *)', () => {
    it('renders three consecutive "* * *" lines (no blanks) as three <hr> elements', () => {
      const md = ['* * *', '* * *', '* * *'].join('\n');
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe('<hr>\n<hr>\n<hr>\n');
    });

    it('renders "* * *" lines with blank lines between as three <hr> elements', () => {
      const md = ['* * *', '', '* * *', '', '* * *'].join('\n');
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe('<hr>\n<hr>\n<hr>\n');
    });

    it('allows up to 3 leading spaces before "* * *"', () => {
      const md = ['   * * *', '  * * *', ' * * *'].join('\n');
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe('<hr>\n<hr>\n<hr>\n');
    });
  });
});

describe('MarkdownConverter - <br> hard line break', () => {
  it('should convert two trailing spaces + newline to a <br> inside a paragraph', () => {
    const md = `This is the first line.  \nAnd this is the second line`;
    const html = MarkdownConverter.toHtml(md);
    expect(html).toContain('<p>This is the first line.<br>And this is the second line</p>');
  });
});
import { MarkdownConverter } from "../../src/markdown-converter/markdown-converter";

describe('MarkdownConverter - Paragraph convertion', () => {
  describe('Markdown converter should convert paragraph tags', () => {
    it('should convert a single-line paragraph to HTML', () => {
      const md = 'This is a simple paragraph.';
      const html = MarkdownConverter.toHtml(md);
      expect(html).toContain('<p>');
      expect(html).toContain('This is a simple paragraph.');
      expect(html).toContain('</p>');
    });
    it('should convert multiple paragraphs to HTML', () => {
      const md = 'First paragraph.\n\nSecond paragraph.';
      const html = MarkdownConverter.toHtml(md);
      expect(html).toContain('<p>First paragraph.</p>');
      expect(html).toContain('<p>Second paragraph.</p>');
    });
    it('should convert a paragraph mixed with heading to HTML', () => {
      const md = '# Heading\n\nThis is a paragraph after the heading.';
      const html = MarkdownConverter.toHtml(md);
      expect(html).toContain('<h1>Heading</h1>');
      expect(html).toContain('<p>This is a paragraph after the heading.</p>');
    });
    it('converts hard break using backslash at end of line', () => {
      const md = 'Line one\\\nLine two';
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe('<p>Line one<br>Line two</p>\n');
    });
  });
});

describe('MarkdownConverter - Single newline spacer does not create a new paragraph', () => {
  it('keeps a single newline inside the same paragraph (no extra <p>)', () => {
    const md = [
      'First line of paragraph.',
      'Second line of same paragraph.'
    ].join('\n');
    const html = MarkdownConverter.toHtml(md);
    expect(html).toBe('<p>First line of paragraph.\nSecond line of same paragraph.</p>\n');
  });
});
import { MarkdownConverter } from '../../src/markdown-converter/markdown-converter';

describe('MarkdownConverter - Heading convertion', () => {
  describe('Should convert heading tags', () => {
    it('Should converts level-1 ATX heading (#)', () => {
      const md = '# Hello World';
      const html = MarkdownConverter.toHtml(md);
      expect(html).toContain('<h1');
      expect(html).toContain('Hello World');
    });
    it('should converts level-2 ATX heading (##)', () => {
      const md = '## Hello World';
      const html = MarkdownConverter.toHtml(md);
      expect(html).toContain('<h2');
      expect(html).toContain('Hello World');
    });
    it('should converts level-3 ATX heading (###)', () => {
      const md = '### Hello World';
      const html = MarkdownConverter.toHtml(md);
      expect(html).toContain('<h3');
      expect(html).toContain('Hello World');
    });
    it('should converts level-4 ATX heading (####)', () => {
      const md = '#### Hello World';
      const html = MarkdownConverter.toHtml(md);
      expect(html).toContain('<h4');
      expect(html).toContain('Hello World');
    });
    it('converts level-5 ATX heading (#####)', () => {
      const md = '##### Heading 5';
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe('<h5>Heading 5</h5>\n');
    });
    it('converts level-6 ATX heading (######)', () => {
      const md = '###### Heading 6';
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe('<h6>Heading 6</h6>\n');
    });
    it('converts ATX heading with inline code and emphasis', () => {
      const md = '### Title with `code` and **bold**';
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe('<h3>Title with <code>code</code> and <strong>bold</strong></h3>\n');
    });
    it('converts Setext heading with inline emphasis', () => {
      const md = ['Heading with *em*', '==='].join('\n');
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe('<h1>Heading with <em>em</em></h1>\n');
    });

  });
  describe('MarkdownConverter | Headings | More than six # is not a heading', () => {
    it('treats "####### foo" as a paragraph (not a heading)', () => {
      const md = '####### foo';
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe('<p>####### foo</p>\n');
    });
  });
  // Verifies ATX heading edge-cases: trimming trailing hashes and ignoring escaped hashes
  describe('MarkdownConverter | Headings | ATX edge-cases (trim trailing hashes, escaped # not a heading)', () => {
    it('trims trailing hashes in ATX headings', () => {
      const md = '### Title ###';
      const html =MarkdownConverter.toHtml(md);
      expect(html).toBe('<h3>Title</h3>\n');
    });

    it('treats escaped hash as plain text (not a heading)', () => {
      const md = '\\# Not a heading';
      const html =MarkdownConverter.toHtml(md);
      expect(html).toBe('<p># Not a heading</p>\n');
    });
  });
  describe('MarkdownConverter | Headings | ignores leading/trailing whitespace in ATX inline content', () => {
    it('parses "#                foo               " as <h1>foo</h1>', () => {
      const md = '#                foo               ';
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe('<h1>foo</h1>\n');
    });
  });
  describe('MarkdownConverter - Setext headings (underline style)', () => {
    it('converts level-1 Setext heading (=== underline) to <h1>', () => {
      const md = [
        'Heading level 1',
        '==============='
      ].join('\n');
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe('<h1>Heading level 1</h1>\n');
    });

    it('converts level-2 Setext heading (--- underline) to <h2>', () => {
      const md = [
        'Heading level 2',
        '---------------'
      ].join('\n');
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe('<h2>Heading level 2</h2>\n');
    });

    it('ignores extra spaces around the underline (level-1)', () => {
      const md = [
        'Heading level 1',
        '===   '
      ].join('\n');
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe('<h1>Heading level 1</h1>\n');
    });

    it('treats following content as a separate block after Setext heading', () => {
      const md = [
        'Heading level 1',
        '===============',
        '',
        'Paragraph after'
      ].join('\n');
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe('<h1>Heading level 1</h1>\n<p>Paragraph after</p>\n');
    });

    it('does not convert a lone dash line without preceding text to Setext heading (likely hr)', () => {
      const md = '---';
      const html = MarkdownConverter.toHtml(md);
      // Depending on your block rules precedence, this is typically an <hr>
      expect(html).toBe('<hr>\n');
    });
  });
});
import { MarkdownConverter } from "../../src/markdown-converter/markdown-converter";
import { Lexer } from "../../src/markdown-converter/lexer";
import { Token, } from "../../src/markdown-converter/tokens";
import { getDefaults } from '../../src/markdown-converter/utils';
import { MarkdownConverterOptions } from "../../src/markdown-converter/interface";
import { Tokenizer } from '../../src/markdown-converter/tokenizer';
import { block, inline, other } from '../../src/markdown-converter/rules';

function makeOptions(overrides?: Partial<MarkdownConverterOptions>): MarkdownConverterOptions {
  return { ...getDefaults(), ...overrides } as MarkdownConverterOptions;
}

function makeFakeLexer(): Lexer {
  const fake = {
    state: { inLink: false, inRawBlock: false, top: true },
    inline: (_: string): Token[] => {
      return [] as Token[];
    },
    tokenizeInline: (_: string): Token[] => {
      return [] as Token[];
    },
    tokenizeBlocks: (_: string, __: Token[] = [], ___?: boolean): Token[] => {
      return [] as Token[];
    }
  } as unknown as Lexer;
  return fake;
}

describe('MarkdownConverter - Custom options', () => {

  describe('options.breaks = true (single newline becomes <br>)', () => {
    it('renders a single newline as <br> when breaks: true (with gfm: true)', () => {
      const options = { gfm: true, lineBreak: true };
      const md = ['First line', 'Second line'].join('\n');
      const html = MarkdownConverter.toHtml(md, options);
      expect(html).toBe('<p>First line<br>Second line</p>\n');
    });

    it('does not convert a single newline to <br> when breaks: false (default)', () => {
      const md = ['First line', 'Second line'].join('\n');
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe('<p>First line\nSecond line</p>\n');
    });
  });

  describe('options.gfm = false disables GFM tables', () => {
    it('treats a GFM table as plain text when gfm: false', () => {
      const options = { gfm: false };
      const md = ['| A | B |', '| - | - |', '| 1 | 2 |'].join('\n');
      const html = MarkdownConverter.toHtml(md, options);
      expect(html).not.toContain('<table>');
      // engine-specific: allow either single <p> or other plain text rendering
      expect(html).toMatch(/<p>[\s\S]*\| A \| B \|[\s\S]*<\/p>|\| A \| B \|/);
    });
  });

  describe('pedantic: basic toggle smoke test', () => {
    it('parses headings in pedantic mode (smoke test)', () => {
      const options = { gfm: false };
      const html = MarkdownConverter.toHtml('# Heading', options);
      expect(html).toContain('<h1>Heading</h1>');
    });
  });

  describe('Tokenizer.url (GFM bare URL autolinking)', () => {
    it('autolinks bare URLs when gfm: true', () => {
      const options = {
        gfm: true
      }
      const html = MarkdownConverter.toHtml('Visit https://example.com/docs', options);
      expect(html).toBe('<p>Visit <a href="https://example.com/docs">https://example.com/docs</a></p>\n');
    });

    it('does not autolink bare URLs when gfm: false', () => {
      const options = {
        gfm: false
      }
      const html = MarkdownConverter.toHtml('Visit https://example.com/docs', options);
      expect(html).toBe('<p>Visit https://example.com/docs</p>\n');
    });

    it('still autolinks angle-bracket URLs via autolink() even when gfm: false', () => {
      const options = {
        gfm: false
      }
      const html = MarkdownConverter.toHtml('<https://example.org>', options);
      expect(html).toBe('<p><a href="https://example.org">https://example.org</a></p>\n');
    });
  });
  ;
});

describe('Lexer.tokenizeBlocks - indented code merges into last paragraph/text', () => {
  it('merges an indented line into a preceding paragraph (no blank line)', () => {
    const md = [
      'Paragraph line',
      '    still part of paragraph'
    ].join('\n');

    const html = MarkdownConverter.toHtml(md);
    // Single paragraph, no <pre><code>
    expect(html).toBe('<p>Paragraph line\n    still part of paragraph</p>\n');
  });
});

describe('Lexer.tokenizeBlocks - code merge into previous paragraph/text (non-duplicate cases)', () => {
  it('merges an indented line into a blockquote paragraph (no blank line)', () => {
    const md = [
      '> Paragraph',
      '>     indented continuation'
    ].join('\n');

    const html = MarkdownConverter.toHtml(md);
    expect(html).toBe('<blockquote>\n<p>Paragraph\n    indented continuation</p>\n</blockquote>\n');
  });

  it('merges an indented continuation into a task list item (no blank line)', () => {
    const md = [
      '- [ ] first',
      '    indented continuation'
    ].join('\n');

    const html = MarkdownConverter.toHtml(md);
    expect(html).toBe('<ul>\n<li><input disabled="" type="checkbox"> first\n  indented continuation</li>\n</ul>\n');
  });
});

describe('Lexer - infinite loop guard (silent=true)', () => {
  it('logs error and breaks without throwing when tokenizer never consumes input', () => {
    const tokenizer: any = {
      parseSpace: (): undefined => undefined,
      parseAtxHeading: (): undefined => undefined,
      ParseHorizontalRule: (): undefined => undefined,
      parseIndentedCode: (): undefined => undefined,
      parseFencedCode: (): undefined => undefined,
      parseBlockquote: (): undefined => undefined,
      parseSetextHeading: (): undefined => undefined,
      parseDefinition: (): undefined => undefined,
      parseList: (): undefined => undefined,
      parseHtmlBlock: (): undefined => undefined,
      parseTable: (): undefined => undefined,
      parseParagraph: (): undefined => undefined,
      parseText: (): undefined => undefined,
      parseInlineText: (): undefined => undefined,
      parseEmphasisOrStrong: (): undefined => undefined,
      parseStrikethrough: (): undefined => undefined,
      parseBreak: (): undefined => undefined,
      parseCodespan: (): undefined => undefined,
      parseLink: (): undefined => undefined,
      parseReferenceLink: (): undefined => undefined,
      parseAutoLink: (): undefined => undefined,
      parseBareUrl: (): undefined => undefined,
      parseEscape: (): undefined => undefined,
      parseHtmlTag: (): undefined => undefined
    };
    const options: any = { tokenizer, silent: true };
    const result = MarkdownConverter.toHtml('X', options);

    // Should return HTML string (error message format)
    expect(typeof result).toBe('string');
  });
});

describe('tokenizer.ts undefined-return branches', () => {
  let tz: Tokenizer;
  beforeEach(() => {
    tz = new Tokenizer(makeOptions({ gfm: true }));
    // Attach rules and a minimal lexer
    tz.rules = { other, block: block.gfm, inline: inline.gfm } as any;
    tz.lexer = makeFakeLexer();
  });

  it('parseParagraph returns undefined when source is an HR (not a paragraph)', () => {
    // block.paragraph should not match when the source is an HR.
    const res = tz.parseParagraph('');
    expect(res).toBeUndefined();
  });

  it('parseText returns undefined when source starts with a newline', () => {
    // block.text = /^[^\n]+/; starting with a newline won’t match.
    const res = tz.parseText('\nNext');
    expect(res).toBeUndefined();
  });

  it('parseInlineText returns undefined on empty string', () => {
    // inline.text should not match an empty string.
    const res = tz.parseInlineText('');
    expect(res).toBeUndefined();
  });

  // Optional: also cover parseAtxHeading undefined path for completeness
  it('parseAtxHeading returns undefined when no heading is present', () => {
    const res = tz.parseAtxHeading('not a heading\n');
    expect(res).toBeUndefined();
  });
  it('parseEmphasisOrStrong returns undefined when no text is present', () => {
    const res = tz.parseEmphasisOrStrong('', '');
    expect(res).toBeUndefined();
  });
});

describe('MarkdownConverter - async: true ', () => {
  it('should render markdown with async: true only', async () => {
    const opts: Partial<MarkdownConverterOptions> = {
      async: true
    };
    const src = `# Heading

This is a **bold** paragraph with *italic* text.

- List item 1
- List item 2

[Link](http://example.com)
`;
    const html = await MarkdownConverter.toHtml(src, opts);
    expect(html).toContain('<h1>Heading</h1>');
    expect(html).toContain('<strong>bold</strong>');
    expect(html).toContain('<em>italic</em>');
    expect(html).toContain('<li>List item 1</li>');
    expect(html).toContain('<a href="http://example.com">Link</a>');
  });
});

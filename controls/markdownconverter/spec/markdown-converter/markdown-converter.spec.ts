import { MarkdownConverterOptions } from '../../src/markdown-converter/interface';
import { MarkdownConverter } from '../../src/markdown-converter/markdown-converter';
import * as lexerModule from '../../src/markdown-converter/lexer';
import * as parserModule from '../../src/markdown-converter/parser';

describe('MarkdownConverter - core API and branch coverage', () => {
  it('convertMarkdownToHtml: sync baseline returns HTML', () => {
    const html = MarkdownConverter.toHtml('# Title') as string;
    expect(html).toBe('<h1>Title</h1>\n');
  });
});

describe('MarkdownConverter.parseMarkdown factory coverage', () => {
  it('throws for undefined/null and non-string input', () => {
    expect(() => MarkdownConverter.toHtml(undefined as any)).toThrowError(/input parameter is undefined or null/);
    expect(() => MarkdownConverter.toHtml(null as any)).toThrowError(/input parameter is undefined or null/);
    expect(() => MarkdownConverter.toHtml(123 as any)).toThrowError(/string expected/);
  });
});

describe('MarkdownConverter.onError - missing async and silent branch coverage', () => {
  it('silent=true, async=true: resolves with escaped error HTML', async () => {
    // async=true => Promise<string>
    const msg = await MarkdownConverter.toHtml(null, { silent: true, async: true }) as string;
    expect(typeof msg).toBe('string');
    expect(msg.startsWith('<p>An error occurred:</p><pre>')).toBe(true);
  });

  it('silent=false, async=true → rejects with the original validation error', async () => {
    const promise = MarkdownConverter.toHtml(null as any, {
      silent: false,
      async: true
    });
    let rejected = false;
    try {
      await promise;
    } catch (e) {
      rejected = true;
      expect(e.message).toBe('input parameter is undefined or null');
    }
    expect(rejected).toBe(true);
  })

  it('silent=false, async=false: throws the error (with appended message)', () => {
    expect(() => MarkdownConverter.toHtml(null, { silent: false, async: false })).toThrowError(/input parameter is undefined or null/);
  });
});

describe('Convert markdown to html using namespace and its method', () => {
  it('should convert markdown to html using namespace method', () => {
    const markdownContent = `# Hello World` + `\n` + `This is a **bold** text.`;
    const expectedHtml = '<h1>Hello World</h1>\n<p>This is a <strong>bold</strong> text.</p>\n';
    const htmlContent = MarkdownConverter.toHtml(markdownContent);
    expect(htmlContent).toBe(expectedHtml);
  });
  it('treats a GFM table as plain text when gfm: false', () => {
    const options: MarkdownConverterOptions = { gfm: false };
    const md = ['| A | B |', '| - | - |', '| 1 | 2 |'].join('\n');
    const html = MarkdownConverter.toHtml(md, options);
    expect(html).not.toContain('<table>');
    expect(html).toBe(`<p>| A | B |` + `\n` + `| - | - |` + `\n` + `| 1 | 2 |</p>`+`\n`);
  });
});

describe('MarkdownConverter.parseMarkdown catch block coverage', () => {
    let originalLexer: any;
    let originalParser: any;
    beforeAll(() => {
        originalLexer = lexerModule.Lexer.lex;
        originalParser = parserModule.Parser.parse;
    });
    afterAll(() => {
        lexerModule.Lexer.lex = originalLexer;
        parserModule.Parser.parse = originalParser;
    });
    it('should return error HTML when lexer throws and silent=true', () => {
        lexerModule.Lexer.lex = () => { throw new Error('Lexer failed'); };
        const result = MarkdownConverter.toHtml('# Heading', { silent: true });
        expect(typeof result).toBe('string');
        expect(result).toContain('An error occurred');
        expect(result).toContain('Lexer failed');
    });
    it('should throw error when lexer throws and silent=false', () => {
        lexerModule.Lexer.lex = () => { throw new Error('Lexer exploded'); };
        expect(() => MarkdownConverter.toHtml('# Heading', { silent: false})).toThrowError('Lexer exploded');
    });
});

describe('MarkdownConverter Option Handling Coverage', () => {
  it('should handle options with inherited properties only', () => {
    const inheritedOptions = Object.create({ inheritedKey: 'value' }); // No own properties
    const result = MarkdownConverter.toHtml('# Heading', inheritedOptions);
    expect(result).toContain('<h1>Heading</h1>');
  });
});
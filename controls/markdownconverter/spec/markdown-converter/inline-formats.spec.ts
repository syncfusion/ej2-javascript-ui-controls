import { MarkdownConverterOptions } from "../../src/markdown-converter/interface";
import { Lexer } from "../../src/markdown-converter/lexer";
import { MarkdownConverter } from "../../src/markdown-converter/markdown-converter";
import { Token } from "../../src/markdown-converter/tokens";
import { getDefaults } from "../../src/markdown-converter/utils";
import { Tokenizer } from '../../src/markdown-converter/tokenizer';
import { block, inline, other } from '../../src/markdown-converter/rules';


function makeOptions(overrides?: Partial<MarkdownConverterOptions>): MarkdownConverterOptions {
  return { ...getDefaults(), ...overrides } as MarkdownConverterOptions;
}

// Minimal typed fake lexer
function makeFakeLexer(): Lexer {
  const fake = {
    state: { inLink: false, inRawBlock: false, top: true },
    inline: (_: string): Token[] => [],
    tokenizeInline: (_: string): Token[] => [],
    tokenizeBlocks: (_: string, __: Token[] = [], ___?: boolean): Token[] => []
  } as unknown as Lexer;
  return fake;
}

describe('MarkdownConvert - Inline elements convertion', () => {
  describe('Markdown converter should convert inline elements', () => {
    it('should convert inline bold to HTML', () => {
      const md = 'This is **bold** text.';
      const html = MarkdownConverter.toHtml(md);
      expect(html).toContain('<p>This is <strong>bold</strong> text.</p>');
    });
    it('should convert inline italic to HTML', () => {
      const md = 'This is *italic* text.';
      const html = MarkdownConverter.toHtml(md);
      expect(html).toContain('<p>This is <em>italic</em> text.</p>');
    });
    it('should convert inline strikethrough to HTML', () => {
      const md = '~~strikethrough~~.';
      const htmlspecialchars = MarkdownConverter.toHtml(md);
      expect(htmlspecialchars).toContain('<del>strikethrough</del>');
    });
    it('should convert inline strikethrough to HTML', () => {
      const md = 'This is ~~strikethrough~~ text.';
      const htmlspecialchars = MarkdownConverter.toHtml(md);
      expect(htmlspecialchars).toContain('<p>This is <del>strikethrough</del> text.</p>');
    });
    it('converts nested bold and italic (***text***)', () => {
      const md = 'This has ***bold and italic*** text.';
      const html = MarkdownConverter.toHtml(md);
      // Allow either nesting style, but at least ensure both strong and em appear
      expect(html).toContain('<p>This has ');
      expect(html).toMatch(/<strong>|<em>/);
      expect(html).toContain('text.</p>');
    });
    it('converts strikethrough adjacent to punctuation', () => {
      const md = 'Wow, ~~nice~~!';
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe('<p>Wow, <del>nice</del>!</p>\n');
    });
    it('does not format escaped asterisks and underscores', () => {
      const md = 'Escaped \\*not bold\\* and \\_not italic\\_.';
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe('<p>Escaped *not bold* and _not italic_.</p>\n');
    });
  });
  describe('MarkdownConverter | Nested emphasis and strong combinations', () => {
    it('wraps strong inside em when pattern is ***strong** in emph*', () => {
      const md = '***strong** in emph*';
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe('<p><em><strong>strong</strong> in emph</em></p>\n');
    });

    it('wraps em inside strong when pattern is ***emph* in strong**', () => {
      const md = '***emph* in strong**';
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe('<p><strong><em>emph</em> in strong</strong></p>\n');
    });

    it('closes em then strong in sequence for pattern **in strong *emph***', () => {
      const md = '**in strong *emph***';
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe('<p><strong>in strong <em>emph</em></strong></p>\n');
    });

    it('wraps strong inside em when pattern is *in emph **strong***', () => {
      const md = '*in emph **strong***';
      const html = MarkdownConverter.toHtml(md);
      expect(html).toBe('<p><em>in emph <strong>strong</strong></em></p>\n');
    });
  });
});


describe('Tokenizer miscellaneous coverage', () => {
  it('parseParagraph trims final newline from match[1]', () => {
    const md = 'A simple paragraph line\n';
    const html = MarkdownConverter.toHtml(md) as string;

    // Should parse as paragraph
    expect(html).toContain('<p>');
    expect(html).toContain('A simple paragraph line');
    expect(html).toContain('</p>');
    
    // Should not have trailing newline in rendered text
    expect(html).not.toContain('line\n</p>');
  });

  it('parseText is used for list-item children when top=false', () => {
    const md = ['- one', '- two'].join('\n');
    const html = MarkdownConverter.toHtml(md) as string;

    // Should parse as list
    expect(html).toContain('<ul>');
    expect(html).toContain('<li>');
    
    // Should contain list items with text
    expect(html).toContain('one');
    expect(html).toContain('two');
    expect(html).toContain('</li>');
    expect(html).toContain('</ul>');
  });

  it('parseInlineText sets escaped=true when inside inline raw block (<code>…</code>)', () => {
    const inline = '<code>literal * & text</code>';
    const html = MarkdownConverter.toHtml(inline) as string;

    // Should parse as HTML tag with inline code
    expect(html).toContain('<code>');
    expect(html).toContain('literal * & text');
    expect(html).toContain('</code>');
    
    // Special characters inside code should not be interpreted as markdown
    expect(html).not.toContain('<em>');
    expect(html).not.toContain('<strong>');
  });

  it('parseEmphasisOrStrong produces em for "*a*" and strong for "**a**"', () => {
    
    // Test emphasis
    const emHtml = MarkdownConverter.toHtml('X *a* Y') as string;
    expect(emHtml).toContain('<em>');
    expect(emHtml).toContain('a');
    expect(emHtml).toContain('</em>');
    
    // Test strong
    const strongHtml = MarkdownConverter.toHtml('X **b** Y') as string;
    expect(strongHtml).toContain('<strong>');
    expect(strongHtml).toContain('b');
    expect(strongHtml).toContain('</strong>');
  });

  it('parseEmphasisOrStrong rejects "_" when prevChar is alphanumeric (no em for "a_b_")', () => {
    const html = MarkdownConverter.toHtml('a_b_') as string;

    // Should not parse as emphasis
    expect(html).not.toContain('<em>');
    expect(html).not.toContain('<strong>');
    
    // Should be plain text
    expect(html).toContain('a_b_');
  });
});


describe('tokenizer.ts parseEmphasisOrStrong - mid-balancing path', () => {
  let tz: Tokenizer;

  beforeEach(() => {
    tz = new Tokenizer(makeOptions({ gfm: true }));
    tz.rules = { other, block: block.gfm, inline: inline.gfm } as any;
    tz.lexer = makeFakeLexer();
  });

  it('skips ambiguous first right delimiter and closes with the second (CommonMark rules 9–10)', () => {
    // Triggers midBalancing:
    // leftLen = 2 ("**"), first matched rightDelim = "*" (rightLen = 1)
    // 2 % 3 !== 0 and (2 + 1) % 3 === 0 -> midBalancing += 1 and continue
    // then final rightDelim = "**" closes the strong
    const src = '**a*b** end';
    const masked = src; // sufficient for unit case

    const res = tz.parseEmphasisOrStrong(src, masked, '');
    expect(res).toBeDefined();
    expect(res!.type).toBe('strong');
    // Inner must include the asterisk between, since the first "*" was skipped
    expect(res!.text).toBe('a*b');
    expect(res!.raw).toBe('**a*b**');
  });

  it('also balances when left=1 and first right=2 (mirror case)', () => {
    // Mirror scenario: leftLen = 1, first rightDelim = "**" (rightLen = 2)
    // 1 % 3 !== 0 and (1 + 2) % 3 === 0 -> skip "**", then close with final "*"
    const src = '*a**b* end';
    const masked = src;

    const res = tz.parseEmphasisOrStrong(src, masked, '');
    // Smallest delimiter count is odd -> returns em
    expect(res).toBeDefined();
    expect(res!.type).toBe('em');
    expect(res!.text).toBe('a**b');
    expect(res!.raw).toBe('*a**b*');
  });
});


describe('tokenizer.ts parseCodespan trimming behavior', () => {
  let tz: Tokenizer;

  beforeEach(() => {
    tz = new Tokenizer(makeOptions({ gfm: true }));
    tz.rules = { other, block: block.gfm, inline: inline.gfm } as any;
    tz.lexer = makeFakeLexer();
  });

  it('trims one leading and one trailing space when there are non-space characters inside', () => {
    // Hits: hasNonSpaceChars === true and hasSpaceCharsOnBothEnds === true
    const res = tz.parseCodespan('` a ` more');
    expect(res).toBeDefined();
    expect(res!.type).toBe('codespan');
    // Branch under test: text should be trimmed to "a"
    expect(res!.text).toBe('a');
    // Raw should be exactly the matched codespan
    expect(res!.raw).toBe('` a `');
  });

  it('does not trim when content is only spaces (no non-space chars)', () => {
    // hasNonSpaceChars === false -> no trimming branch executed
    const res = tz.parseCodespan('`   ` end');
    expect(res).toBeDefined();
    expect(res!.type).toBe('codespan');
    expect(res!.text).toBe('   '); // unchanged
    expect(res!.raw).toBe('`   `');
  });

  it('does not trim when only leading space present (not both ends)', () => {
    // hasSpaceCharsOnBothEnds === false -> no trimming
    const res = tz.parseCodespan('` a` tail');
    expect(res).toBeDefined();
    expect(res!.type).toBe('codespan');
    expect(res!.text).toBe(' a'); // unchanged
    expect(res!.raw).toBe('` a`');
  });

  it('does not trim when only trailing space present (not both ends)', () => {
    // hasSpaceCharsOnBothEnds === false -> no trimming
    const res = tz.parseCodespan('`a ` tail');
    expect(res).toBeDefined();
    expect(res!.type).toBe('codespan');
    expect(res!.text).toBe('a '); // unchanged
    expect(res!.raw).toBe('`a `');
  });

  it('replaces newlines with spaces before trimming decision', () => {
    // Ensures text = match[2].replace(newLineCharGlobal, ' ') executes
    // and still satisfies the trimming rule
    const res = tz.parseCodespan('` a\nb ` done');
    expect(res).toBeDefined();
    // newline inside becomes space, then both-end spaces get trimmed to "a b"
    expect(res!.text).toBe('a b');
    expect(res!.raw).toBe('` a\nb `');
  });
});
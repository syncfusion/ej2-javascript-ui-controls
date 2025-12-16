import { Rules, other, block, inline } from './rules';
import { Token, TokenBlockquote, TokenBr, TokenCode, TokenCodespan, TokenDef, TokenDel, TokenEm, TokenEscape, TokenHeading, TokenHr, TokenHTML, TokenImage, TokenLink, TokenList, TokenParagraph, TokensList, TokenSpace, TokenStrong, TokenTable, TokenTag, TokenText } from './tokens';
import { Tokenizer } from './tokenizer';
import { getDefaults, arrayAt } from './utils';
import { MarkdownConverterOptions } from './interface';

/**
 * Block Lexer
 */
export class Lexer {
    tokens: TokensList;
    options: MarkdownConverterOptions;
    state: {
        inLink: boolean;
        inRawBlock: boolean;
        top: boolean;
    };
    rules: Rules = {
        other: other,
        block: block.normal,
        inline: inline.normal
    };
    private tokenizer: Tokenizer;
    private inlineQueue: { src: string, tokens: Token[] }[];

    constructor(options?: MarkdownConverterOptions) {
        // TokenList cannot be created in one go
        this.tokens = [] as unknown as TokensList;
        this.tokens.links = Object.create(null);
        this.options = options || getDefaults();
        this.tokenizer = new Tokenizer();
        this.tokenizer.options = this.options;
        this.tokenizer.lexer = this;
        this.inlineQueue = [];
        this.state = {
            inLink: false,
            inRawBlock: false,
            top: true
        };
        const rules: Rules = {
            other,
            block: block.normal,
            inline: inline.normal
        };
        if (this.options.gfm) {
            rules.block = block.gfm;
            rules.inline = this.options.lineBreak ? inline.breaks : inline.gfm;
        } else {
            rules.block = block.pedantic;
            rules.inline = inline.pedantic;
        }
        this.tokenizer.rules = rules;
    }

    /**
     * Tokenizes the full markdown source into a top-level token list.
     *
     * @param {string} src - Markdown source text.
     * @param {MarkdownConverterOptions} [options] - Optional options overriding defaults.
     * @returns {TokensList} A list of tokens representing block structure.
     * @hidden
     * @private
     */
    static lex(src: string, options?: MarkdownConverterOptions): TokensList {
        const lexer: Lexer = new Lexer(options);
        return lexer.lex(src);
    }

    /**
     * Tokenizes the full markdown source and resolves any deferred inline queues.
     *
     * @param {string} mdSource - Markdown source text.
     * @returns {TokensList} Finalized top-level token list.
     * @hidden
     * @private
     */
    public lex(mdSource: string): TokensList {
        mdSource = mdSource.replace(other.carriageReturn, '\n');
        this.tokens = [] as unknown as TokensList;
        this.tokens.links = Object.create(null);
        this.tokenizeBlocks(mdSource, this.tokens);
        for (let i: number = 0; i < this.inlineQueue.length; i++) {
            const next: { src: string; tokens: Token[] } = this.inlineQueue[i as number];
            this.tokenizeInline(next.src, next.tokens);
        }
        this.inlineQueue = [];
        return this.tokens;
    }

    /**
     * Tokenizes block-level constructs from the source into the provided collection.
     *
     * @param {string} mdSource - Markdown source.
     * @param {Token[] | TokensList} [tokens] - Target collection for tokens.
     * @param {boolean} [lastParagraphClipped] - Internal paragraph merge hint.
     * @returns {Token[] | TokensList} The updated token collection.
     * @hidden
     * @private
     */
    public tokenizeBlocks(mdSource: string, tokens?: Token[] | TokensList, lastParagraphClipped?: boolean): Token[] | TokensList {
        if (!this.options.gfm) {
            mdSource = mdSource.replace(other.tabCharGlobal, '    ').replace(other.spaceLine, '');
        }
        while (mdSource) {
            const spaceToken: TokenSpace | undefined = this.tokenizer.parseSpace(mdSource);
            if (spaceToken) {
                mdSource = mdSource.substring(spaceToken.raw.length);
                const lastToken: Token | undefined = arrayAt(tokens, -1);
                if (spaceToken.raw.length === 1 && lastToken !== undefined) {
                    // if there's a single \n as a spacer, it's terminating the last line,
                    // so move it there so that we don't get unnecessary paragraph tags
                    lastToken.raw += '\n';
                } else {
                    tokens.push(spaceToken);
                }
                continue;
            }
            // heading
            const headingToken: TokenHeading | undefined = this.tokenizer.parseAtxHeading(mdSource);
            if (headingToken) {
                mdSource = mdSource.substring(headingToken.raw.length);
                tokens.push(headingToken);
                continue;
            }
            // hr
            const hrToken: TokenHr | undefined = this.tokenizer.ParseHorizontalRule(mdSource);
            if (hrToken) {
                mdSource = mdSource.substring(hrToken.raw.length);
                tokens.push(hrToken);
                continue;
            }
            // code
            const codeToken: TokenCode | undefined = this.tokenizer.parseIndentedCode(mdSource);
            if (codeToken) {
                mdSource = mdSource.substring(codeToken.raw.length);
                const lastToken: Token | undefined = arrayAt(tokens, -1);
                // An indented code block cannot interrupt a paragraph.
                if (lastToken && (lastToken.type === 'paragraph' || lastToken.type === 'text') && ('text' in lastToken)) {
                    lastToken.raw += '\n' + codeToken.raw;
                    lastToken.text += '\n' + codeToken.text;
                    arrayAt(this.inlineQueue, -1)!.src = lastToken.text;
                } else {
                    tokens.push(codeToken);
                }
                continue;
            }
            // fences
            const fenceToken: TokenCode | undefined = this.tokenizer.parseFencedCode(mdSource);
            if (fenceToken) {
                mdSource = mdSource.substring(fenceToken.raw.length);
                tokens.push(fenceToken);
                continue;
            }
            // blockquote
            const blockquoteToken: TokenBlockquote | undefined = this.tokenizer.parseBlockquote(mdSource);
            if (blockquoteToken) {
                mdSource = mdSource.substring(blockquoteToken.raw.length);
                tokens.push(blockquoteToken);
                continue;
            }
            // lheading
            const levelHeadingToken: TokenHeading | undefined = this.tokenizer.parseSetextHeading(mdSource);
            if (levelHeadingToken) {
                mdSource = mdSource.substring(levelHeadingToken.raw.length);
                tokens.push(levelHeadingToken);
                continue;
            }
            // def
            const defToken: TokenDef | undefined = this.tokenizer.parseDefinition(mdSource);
            if (defToken) {
                mdSource = mdSource.substring(defToken.raw.length);
                const lastToken: Token | undefined = arrayAt(tokens, -1);
                if (lastToken && (lastToken.type === 'paragraph' || lastToken.type === 'text') && ('text' in lastToken)) {
                    lastToken.raw += '\n' + defToken.raw;
                    lastToken.text += '\n' + defToken.raw;
                    arrayAt(this.inlineQueue, -1)!.src = lastToken.text;
                } else if (!this.tokens.links[defToken.tag]) {
                    this.tokens.links[defToken.tag] = {
                        href: defToken.href,
                        title: defToken.title
                    };
                }
                continue;
            }
            // list
            const listToken: TokenList | undefined = this.tokenizer.parseList(mdSource);
            if (listToken) {
                mdSource = mdSource.substring(listToken.raw.length);
                tokens.push(listToken);
                continue;
            }
            // html
            const htmlToken: TokenHTML | undefined = this.tokenizer.parseHtmlBlock(mdSource);
            if (htmlToken) {
                mdSource = mdSource.substring(htmlToken.raw.length);
                tokens.push(htmlToken);
                continue;
            }
            // table (gfm)
            const tableToken: TokenTable | undefined = this.tokenizer.parseTable(mdSource);
            if (tableToken) {
                mdSource = mdSource.substring(tableToken.raw.length);
                tokens.push(tableToken);
                continue;
            }
            if (this.state.top) {
                const paragraphToken: TokenParagraph | undefined = this.tokenizer.parseParagraph(mdSource);
                if (paragraphToken) {
                    const lastToken: Token | undefined = arrayAt(tokens, -1);
                    if (lastParagraphClipped && lastToken && lastToken.type === 'paragraph' && ('text' in lastToken)) {
                        lastToken.raw += '\n' + paragraphToken.raw;
                        lastToken.text += '\n' + paragraphToken.text;
                        this.inlineQueue.pop();
                        arrayAt(this.inlineQueue, -1)!.mdSource = lastToken.text;
                    } else {
                        tokens.push(paragraphToken);
                    }
                    lastParagraphClipped = mdSource.length !== mdSource.length;
                    mdSource = mdSource.substring(paragraphToken.raw.length);
                    continue;
                }
            }
            // text
            const textToken: TokenText | undefined = this.tokenizer.parseText(mdSource);
            if (textToken) {
                mdSource = mdSource.substring(textToken.raw.length);
                const lastToken: Token | undefined = arrayAt(tokens, -1);
                if (lastToken && lastToken.type === 'text' && ('text' in lastToken)) {
                    lastToken.raw += '\n' + textToken.raw;
                    lastToken.text += '\n' + textToken.text;
                    this.inlineQueue.pop();
                    arrayAt(this.inlineQueue, -1)!.src = lastToken.text;
                } else {
                    tokens.push(textToken);
                }
                continue;
            }
            if (mdSource) {
                const errMsg: string = 'Infinite loop on byte: ' + mdSource.charCodeAt(0);
                if (this.options.silent) {
                    console.error(errMsg);
                    break;
                } else {
                    throw new Error(errMsg);
                }
            }
        }
        this.state.top = true;
        return tokens;
    }

    /**
     * Schedules inline tokenization for chained contexts (e.g., headings, paragraphs).
     *
     * @param {string} src - Inline source text to queue.
     * @param {Token[]} [tokens=[]] - Token array to receive inline tokens.
     * @returns {Token[]} The queued token collection.
     * @hidden
     * @private
     */
    public inline(src: string, tokens: Token[] = []): Token[] {
        this.inlineQueue.push({ src, tokens });
        return tokens;
    }

    /**
     * Tokenizes inline constructs from the provided inline source.
     *
     * @param {string} mdSource - Inline markdown source.
     * @param {Token[]} [tokens=[]] - Target inline token array.
     * @returns {Token[]} The updated inline token array.
     * @hidden
     * @private
     */
    public tokenizeInline(mdSource: string, tokens: Token[] = []): Token[] {
        // String with links masked to avoid interference with em and strong
        let maskedSrc: string = mdSource;
        let match: RegExpExecArray | null = null;
        // Mask out reflinks
        if (this.tokens.links) {
            const links: string[] = Object.keys(this.tokens.links);
            if (links.length > 0) {
                let reflinkMatch: RegExpExecArray = this.tokenizer.rules.inline.reflinkSearch.exec(maskedSrc);
                while (reflinkMatch != null) {
                    if (links.indexOf(reflinkMatch[0].slice(reflinkMatch[0].lastIndexOf('[') + 1, -1)) !== -1) {
                        maskedSrc = maskedSrc.slice(0, reflinkMatch.index)
                            + '[' + 'a'.repeat(reflinkMatch[0].length - 2) + ']'
                            + maskedSrc.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex);
                    }
                    reflinkMatch = this.tokenizer.rules.inline.reflinkSearch.exec(maskedSrc);
                }
            }
        }

        // Mask out escaped characters
        match = this.tokenizer.rules.inline.anyPunctuation.exec(maskedSrc);
        while (match != null) {
            maskedSrc = maskedSrc.slice(0, match.index) + '++' + maskedSrc.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
            match = this.tokenizer.rules.inline.anyPunctuation.exec(maskedSrc);
        }

        // Mask out other blocks
        match = this.tokenizer.rules.inline.blockSkip.exec(maskedSrc);
        while (match != null) {
            maskedSrc = maskedSrc.slice(0, match.index) + '[' + 'a'.repeat(match[0].length - 2) + ']' + maskedSrc.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
            match = this.tokenizer.rules.inline.blockSkip.exec(maskedSrc);
        }
        let keepPrevChar: boolean = false;
        let prevChar: string = '';
        while (mdSource) {
            if (!keepPrevChar) {
                prevChar = '';
            }
            keepPrevChar = false;
            // em & strong
            const boldToken: TokenEm | TokenStrong | undefined = this.tokenizer.parseEmphasisOrStrong(mdSource, maskedSrc, prevChar);
            if (boldToken) {
                mdSource = mdSource.substring(boldToken.raw.length);
                tokens.push(boldToken);
                continue;
            }
            // del (gfm)
            const delToken: TokenDel | undefined = this.tokenizer.parseStrikethrough(mdSource);
            if (delToken) {
                mdSource = mdSource.substring(delToken.raw.length);
                tokens.push(delToken);
                continue;
            }
            // br
            const brToken: TokenBr | undefined = this.tokenizer.parseBreak(mdSource);
            if (brToken) {
                mdSource = mdSource.substring(brToken.raw.length);
                tokens.push(brToken);
                continue;
            }
            // code
            const codeToken: TokenCodespan | undefined = this.tokenizer.parseCodespan(mdSource);
            if (codeToken) {
                mdSource = mdSource.substring(codeToken.raw.length);
                tokens.push(codeToken);
                continue;
            }
            // link
            const linkToken: TokenImage | TokenLink | undefined = this.tokenizer.parseLink(mdSource);
            if (linkToken) {
                mdSource = mdSource.substring(linkToken.raw.length);
                tokens.push(linkToken);
                continue;
            }
            // reflink, nolink
            const refLinkToken: TokenLink | TokenImage | TokenText | undefined = this.tokenizer.
                parseReferenceLink(mdSource, this.tokens.links);
            if (refLinkToken) {
                mdSource = mdSource.substring(refLinkToken.raw.length);
                const lastToken: Token | undefined = arrayAt(tokens, -1);
                if (refLinkToken.type === 'text' && lastToken && lastToken.type === 'text' && ('text' in lastToken)) {
                    lastToken.raw += refLinkToken.raw;
                    lastToken.text += refLinkToken.text;
                } else {
                    tokens.push(refLinkToken);
                }
                continue;
            }
            // autolink
            const autoLinkToken: TokenLink | undefined = this.tokenizer.parseAutoLink(mdSource);
            if (autoLinkToken) {
                mdSource = mdSource.substring(autoLinkToken.raw.length);
                tokens.push(autoLinkToken);
                continue;
            }
            // url (gfm)
            const urlToken: TokenLink | undefined = this.tokenizer.parseBareUrl(mdSource);
            if (!this.state.inLink && urlToken) {
                mdSource = mdSource.substring(urlToken.raw.length);
                tokens.push(urlToken);
                continue;
            }
            // escape
            const escapeToken: TokenEscape | undefined = this.tokenizer.parseEscape(mdSource);
            if (escapeToken) {
                mdSource = mdSource.substring(escapeToken.raw.length);
                tokens.push(escapeToken);
                continue;
            }
            // tag
            const tagToken: TokenTag | undefined = this.tokenizer.parseHtmlTag(mdSource);
            if (tagToken) {
                mdSource = mdSource.substring(tagToken.raw.length);
                tokens.push(tagToken);
                continue;
            }
            // text
            // prevent inlineText consuming extensions by clipping 'src' to extension start
            const inlineTextToken: TokenText | undefined = this.tokenizer.parseInlineText(mdSource);
            if (inlineTextToken) {
                mdSource = mdSource.substring(inlineTextToken.raw.length);
                if (inlineTextToken.raw.slice(-1) !== '_') { // Track prevChar before string of ____ started
                    prevChar = inlineTextToken.raw.slice(-1);
                }
                keepPrevChar = true;
                const lastToken: Token | undefined = arrayAt(tokens, -1);
                if (lastToken && lastToken.type === 'text' && ('text' in lastToken)) {
                    lastToken.raw += inlineTextToken.raw;
                    lastToken.text += inlineTextToken.text;
                } else {
                    tokens.push(inlineTextToken);
                }
                continue;
            }
        }
        return tokens;
    }
}



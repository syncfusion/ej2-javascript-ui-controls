import { Token, TokenParagraph, TokenHeading, TokenText, TokenEm, TokenStrong, TokenDel, TokenHr, TokenBr, TokenCodespan, TokenCode, TokenSpace, TokenBlockquote, TokenList, TokenLink, TokenImage, Links, TokenEscape, TokenListItem, TokenHTML, TokenTag, TokenTable, TokenDef } from './tokens';
import { Rules } from './rules';
import { Lexer } from './lexer';
import { MarkdownConverterOptions } from './interface';
import { removeTrailingSpace, arrayAt, findClosingBracket, stringTrimEnd, stringTrimStart, splitCells, getDefaults } from './utils';

/**
 * Tokenizer
 */
export class Tokenizer {
    options: MarkdownConverterOptions;
    rules: Rules;
    lexer: Lexer;
    constructor(options?: MarkdownConverterOptions) {
        this.options = options || getDefaults();
    }

    /**
     * Parses one or more newline characters into a space token.
     *
     * @param {string} mdSource - Markdown source beginning at current position.
     * @returns {TokenSpace | undefined} A space token when matched; otherwise undefined.
     * @hidden
     * @private
     */
    public parseSpace(mdSource: string): TokenSpace | undefined {
        const newlineMatch: RegExpMatchArray | null = this.rules.block.newline.exec(mdSource);
        if (newlineMatch && newlineMatch[0].length > 0) {
            return { type: 'space', raw: newlineMatch[0] };
        }
        return undefined;
    }

    /**
     * Parses an ATX heading (e.g., "# H1").
     *
     * @param {string} mdSource - Markdown source.
     * @returns {TokenHeading | undefined} A heading token when matched; otherwise undefined.
     * @hidden
     * @private
     */
    public parseAtxHeading(mdSource: string): TokenHeading | undefined {
        const match: RegExpMatchArray | null = this.rules.block.heading.exec(mdSource);
        if (match) {
            let text: string = match[2].trim();
            if (this.rules.other.endingHash.test(text)) {
                const trimmedText: string = removeTrailingSpace(text, '#');
                text = trimmedText.trim();
            }
            return {
                type: 'heading',
                raw: match[0],
                depth: match[1].length,
                text,
                tokens: this.lexer.inline(text)
            };
        }
        return undefined;
    }

    /**
     * Parses a paragraph block.
     *
     * @param {string} mdSource - Markdown source.
     * @returns {TokenParagraph | undefined} A paragraph token when matched; otherwise undefined.
     * @hidden
     * @private
     */
    public parseParagraph(mdSource: string): TokenParagraph | undefined {
        const match: RegExpExecArray | null = this.rules.block.paragraph.exec(mdSource);
        if (match) {
            const text: string = match[1].charAt(match[1].length - 1) === '\n' ? match[1].slice(0, -1) : match[1];
            return { type: 'paragraph', raw: match[0], text, tokens: this.lexer.inline(text) };
        }
        return undefined;
    }

    /**
     * Parses a raw text block (fallback when no other block matches).
     *
     * @param {string} mdSource - Markdown source.
     * @returns {TokenText | undefined} A text token when matched; otherwise undefined.
     * @hidden
     * @private
     */
    public parseText(mdSource: string): TokenText | undefined {
        const match: RegExpExecArray | null = this.rules.block.text.exec(mdSource);
        if (match) {
            return { type: 'text', raw: match[0], text: match[0], tokens: this.lexer.inline(match[0]) };
        }
        return undefined;
    }

    /**
     * Parses an inline text segment.
     *
     * @param {string} mdSource - Markdown source.
     * @returns {TokenText | undefined} A text token when matched; otherwise undefined.
     * @hidden
     * @private
     */
    public parseInlineText(mdSource: string): TokenText | undefined {
        const match: RegExpExecArray = this.rules.inline.text.exec(mdSource);
        if (match) {
            const escaped: boolean = this.lexer.state.inRawBlock;
            return { type: 'text', raw: match[0], text: match[0], escaped };
        }
        return undefined;
    }

    /**
     * Parses emphasis or strong emphasis (e.g., "*em*", "**strong**", "_em_", "__strong__").
     *
     * @param {string} src - Inline source starting at a delimiter.
     * @param {string} maskedSrc - Masked inline source to aid delimiter scanning.
     * @param {string} [prevChar] - Previous character to help with intraword checks.
     * @returns {TokenEm | TokenStrong | undefined} An emphasis/strong token when matched; otherwise undefined.
     * @hidden
     * @private
     */
    public parseEmphasisOrStrong(src: string, maskedSrc: string, prevChar: string = ''): TokenEm | TokenStrong | undefined {
        let openingDelimMatch: RegExpExecArray = this.rules.inline.emStrongLDelim.exec(src);
        if (!openingDelimMatch) {
            return undefined;
        }
        // _ can't be between two alphanumerics. \p{L}\p{N} includes non-english alphabet/numbers as well
        if (openingDelimMatch[3] && prevChar.match(this.rules.other.unicodeAlphaNumeric)) {
            return undefined;
        }
        const nextChar: string = openingDelimMatch[1] || openingDelimMatch[2] || '';
        if (!nextChar || !prevChar || this.rules.inline.punctuation.exec(prevChar)) {
            // unicode Regex counts emoji as 1 char; spread into array for proper count (used multiple times below)
            const leftLen: number = Array.from(openingDelimMatch[0]).length - 1;
            let rightDelim: string;
            let rightLen: number;
            let delimTotal: number = leftLen;
            let midBalancing: number = 0;
            const closeRegex: RegExp = openingDelimMatch[0][0] === '*'
                ? this.rules.inline.emStrongRDelimAst
                : this.rules.inline.emStrongRDelimUnd;

            closeRegex.lastIndex = 0;
            // Clip masked source to same section of string as src
            maskedSrc = maskedSrc.slice(-1 * src.length + leftLen);
            // Scan for closing delimiters
            // eslint-disable-next-line no-cond-assign
            while ((openingDelimMatch = closeRegex.exec(maskedSrc)) != null) {
                rightDelim = openingDelimMatch[1] || openingDelimMatch[2] || openingDelimMatch[3] || openingDelimMatch[4] ||
                    openingDelimMatch[5] || openingDelimMatch[6];
                if (!rightDelim) {
                    continue; // skip single * in __abc*abc__
                }
                rightLen = Array.from(rightDelim).length;
                if (openingDelimMatch[3] || openingDelimMatch[4]) {
                    // Found another Left Delim
                    delimTotal += rightLen;
                    continue;
                } else if (openingDelimMatch[5] || openingDelimMatch[6]) {
                    // Either Left or Right Delim
                    if (leftLen % 3 && !((leftLen + rightLen) % 3)) {
                        midBalancing += rightLen;
                        continue; // CommonMark Emphasis Rules 9-10
                    }
                }
                delimTotal -= rightLen;
                if (delimTotal > 0) {
                    continue; // Haven't found enough closing delimiters
                }
                // Remove extra characters. *a*** -> *a*
                rightLen = Math.min(rightLen, rightLen + delimTotal + midBalancing);
                // char length can be >1 for unicode characters
                const lastCharLength: number = Array.from(openingDelimMatch[0])[0].length;
                const raw: string = src.slice(0, leftLen + openingDelimMatch.index + lastCharLength + rightLen);

                // Create `em` if smallest delimiter has odd char count. *a***
                if (Math.min(leftLen, rightLen) % 2) {
                    const inner: string = raw.slice(1, -1);
                    return {
                        type: 'em',
                        raw,
                        text: inner,
                        tokens: this.lexer.tokenizeInline(inner)
                    };
                }
                // Create 'strong' if smallest delimiter has even char count. **a***
                const inner: string = raw.slice(2, -2);
                return {
                    type: 'strong',
                    raw,
                    text: inner,
                    tokens: this.lexer.tokenizeInline(inner)
                };
            }
        }
        return undefined;
    }

    /**
     * Parses strikethrough (GFM) e.g., "~~del~~".
     *
     * @param {string} mdSource - Inline markdown source.
     * @returns {TokenDel | undefined} A strikethrough token when matched; otherwise undefined.
     * @hidden
     * @private
     */
    public parseStrikethrough(mdSource: string): TokenDel | undefined {
        const match: RegExpExecArray = this.rules.inline.del.exec(mdSource);
        if (match) {
            return {
                type: 'del',
                raw: match[0],
                text: match[2],
                tokens: this.lexer.tokenizeInline(match[2])
            };
        }
        return undefined;
    }

    /**
     * Parses a horizontal rule (---, ***, ___).
     *
     * @param {string} mdSource - Markdown source.
     * @returns {TokenHr | undefined} An <hr> token when matched; otherwise undefined.
     * @hidden
     * @private
     */
    public ParseHorizontalRule(mdSource: string): TokenHr | undefined {
        const match: RegExpMatchArray | null = this.rules.block.hr.exec(mdSource);
        if (match) {
            return {
                type: 'hr',
                raw: removeTrailingSpace(match[0], '\n')
            };
        }
        return undefined;
    }

    /**
     * Parses a hard line break.
     *
     * @param {string} mdSource - Inline markdown source.
     * @returns {TokenBr | undefined} A break token when matched; otherwise undefined.
     * @hidden
     * @private
     */
    public parseBreak(mdSource: string): TokenBr | undefined {
        const match: RegExpExecArray = this.rules.inline.br.exec(mdSource);
        if (match) {
            return {
                type: 'br',
                raw: match[0]
            };
        }
        return undefined;
    }

    /**
     * Parses an indented code block (4-space).
     *
     * @param {string} mdSource - Markdown source.
     * @returns {TokenCode | undefined} A code block token when matched; otherwise undefined.
     * @hidden
     * @private
     */
    public parseIndentedCode(mdSource: string): TokenCode | undefined {
        const match: RegExpMatchArray | null = this.rules.block.code.exec(mdSource);
        if (match) {
            const text: string = match[0].replace(this.rules.other.codeRemoveIndent, '');
            return {
                type: 'code',
                raw: match[0],
                codeBlockStyle: 'indented',
                text: this.options.gfm
                    ? removeTrailingSpace(text, '\n')
                    : text
            };
        }
        return undefined;
    }

    /**
     * Parses an inline code span (e.g., "`code`").
     *
     * @param {string} mdSource - Inline markdown source.
     * @returns {TokenCodespan | undefined} A code span token when matched; otherwise undefined.
     * @hidden
     * @private
     */
    public parseCodespan(mdSource: string): TokenCodespan | undefined {
        const match: RegExpExecArray = this.rules.inline.code.exec(mdSource);
        if (match) {
            let text: string = match[2].replace(this.rules.other.newLineCharGlobal, ' ');
            const hasNonSpaceChars: string | boolean = this.rules.other.nonSpaceChar.test(text);
            const hasSpaceCharsOnBothEnds: string | boolean = this.rules.other.startingSpaceChar.test(text) &&
                this.rules.other.endingSpaceChar.test(text);
            if (hasNonSpaceChars && hasSpaceCharsOnBothEnds) {
                text = text.substring(1, text.length - 1);
            }
            return {
                type: 'codespan',
                raw: match[0],
                text
            };
        }
        return undefined;
    }
    private indentCodeCompensation(raw: string, text: string, rules: Rules): string {
        const matchIndentToCode: RegExpMatchArray | null = raw.match(rules.other.indentCodeCompensation);
        if (matchIndentToCode === null) {
            return text;
        }
        const indentToCode: string = matchIndentToCode[1];
        return text
            .split('\n')
            .map((line: string) => {
                const matchIndentInLine: RegExpMatchArray | null = line.match(rules.other.beginningSpace);
                if (matchIndentInLine === null) {
                    return line;
                }
                const [indentInLine] = matchIndentInLine;
                if (indentInLine.length >= indentToCode.length) {
                    return line.slice(indentToCode.length);
                }
                return line;
            })
            .join('\n');
    }
    private outputLink(cap: string[], link: Pick<TokenLink, 'href' | 'title'>, raw: string, lexer: Lexer, rules: Rules): TokenLink | TokenImage {
        const href: string = link.href;
        const title: string = link.title || null;
        const text: string = cap[1].replace(rules.other.outputLinkReplace, '$1');

        lexer.state.inLink = true;
        const token: TokenLink | TokenImage = {
            type: cap[0].charAt(0) === '!' ? 'image' : 'link',
            raw,
            href,
            title,
            text,
            tokens: lexer.tokenizeInline(text)
        } as TokenLink | TokenImage;
        lexer.state.inLink = false;
        return token;
    }

    /**
     * Parses a fenced code block (``` or ~~~).
     *
     * @param {string} mdSource - Markdown source.
     * @returns {TokenCode | undefined} A fenced code block token when matched; otherwise undefined.
     * @hidden
     * @private
     */
    public parseFencedCode(mdSource: string): TokenCode | undefined {
        const match: RegExpMatchArray | null = this.rules.block.fences.exec(mdSource);
        if (match) {
            const raw: string = match[0];
            const text: string = this.indentCodeCompensation(raw, match[3] || '', this.rules);
            return {
                type: 'code',
                raw,
                lang: match[2] ? match[2].trim().replace(this.rules.inline.anyPunctuation, '$1') : match[2],
                text
            };
        }
        return undefined;
    }

    /**
     * Parses a blockquote block (prefix ">").
     *
     * @param {string} mdSource - Markdown source.
     * @returns {TokenBlockquote | undefined} A blockquote token when matched; otherwise undefined.
     * @hidden
     * @private
     */
    public parseBlockquote(mdSource: string): TokenBlockquote | undefined {
        const match: RegExpMatchArray | null = this.rules.block.blockquote.exec(mdSource);
        if (match) {
            let lines: string[] = removeTrailingSpace(match[0], '\n').split('\n');
            let raw: string = '';
            let text: string = '';
            const tokens: Token[] = [];
            while (lines.length > 0) {
                let inBlockquote: boolean = false;
                const currentLines: string[] = [];
                let i: number;
                for (i = 0; i < lines.length; i++) {
                    // get lines up to a continuation
                    if (this.rules.other.blockquoteStart.test(lines[i as number])) {
                        currentLines.push(lines[i as number]);
                        inBlockquote = true;
                    } else if (!inBlockquote) {
                        currentLines.push(lines[i as number]);
                    } else {
                        break;
                    }
                }
                lines = lines.slice(i);
                const currentRaw: string = currentLines.join('\n');
                const currentText: string = currentRaw
                    // precede setext continuation with 4 spaces so it isn't a setext
                    .replace(this.rules.other.blockquoteSetextReplace, '\n    $1')
                    .replace(this.rules.other.blockquoteSetextReplace2, '');
                raw = raw ? `${raw}\n${currentRaw}` : currentRaw;
                text = text ? `${text}\n${currentText}` : currentText;
                // parse blockquote lines as top level tokens
                // merge paragraphs if this is a continuation
                const top: boolean = this.lexer.state.top;
                this.lexer.state.top = true;
                this.lexer.tokenizeBlocks(currentText, tokens, true);
                this.lexer.state.top = top;
                // if there is no continuation then we are done
                if (lines.length === 0) {
                    break;
                }
                const lastToken: Token = arrayAt(tokens, -1);
                if (lastToken && lastToken.type === 'code') {
                    // blockquote continuation cannot be preceded by a code block
                    break;
                } else if (lastToken && lastToken.type === 'blockquote') {
                    // include continuation in nested blockquote
                    const oldToken: TokenBlockquote = lastToken as TokenBlockquote;
                    const newText: string = oldToken.raw + '\n' + lines.join('\n');
                    const newToken: TokenBlockquote = this.parseBlockquote(newText)!;
                    tokens[tokens.length - 1] = newToken;
                    raw = raw.substring(0, raw.length - oldToken.raw.length) + newToken.raw;
                    text = text.substring(0, text.length - oldToken.text.length) + newToken.text;
                    break;
                } else if (lastToken && lastToken.type === 'list') {
                    // include continuation in nested list
                    const oldToken: TokenList = lastToken as TokenList;
                    const newText: string = oldToken.raw + '\n' + lines.join('\n');
                    const newToken: TokenList = this.parseList(newText)!;
                    tokens[tokens.length - 1] = newToken;
                    raw = raw.substring(0, raw.length - lastToken.raw.length) + newToken.raw;
                    text = text.substring(0, text.length - oldToken.raw.length) + newToken.raw;
                    lines = newText.substring(arrayAt(tokens, -1)!.raw.length).split('\n');
                    continue;
                }
            }
            return {
                type: 'blockquote',
                raw,
                tokens,
                text
            };
        }
        return undefined;
    }

    /**
     * Parses a Setext heading (underline-style, "=== / ---").
     *
     * @param {string} mdSource - Markdown source.
     * @returns {TokenHeading | undefined} A heading token when matched; otherwise undefined.
     * @hidden
     * @private
     */
    public parseSetextHeading(mdSource: string): TokenHeading | undefined {
        const match: RegExpExecArray | null = this.rules.block.lheading.exec(mdSource);
        if (match) {
            return {
                type: 'heading',
                raw: match[0],
                depth: match[2].charAt(0) === '=' ? 1 : 2,
                text: match[1],
                tokens: this.lexer.inline(match[1])
            };
        }
        return undefined;
    }

    /**
     * Parses a standard inline link or image (e.g., "[text](url)" or "![alt](src)").
     *
     * @param {string} mdSource - Inline markdown source.
     * @returns {TokenLink | TokenImage | undefined} A link/image token when matched; otherwise undefined.
     * @hidden
     * @private
     */
    public parseLink(mdSource: string): TokenLink | TokenImage | undefined {
        const match: RegExpExecArray | null = this.rules.inline.link.exec(mdSource);
        if (match) {
            const trimmedUrl: string = match[2].trim();
            if (this.options.gfm && this.rules.other.startAngleBracket.test(trimmedUrl)) {
                // commonmark requires matching angle brackets
                if (!(this.rules.other.endAngleBracket.test(trimmedUrl))) {
                    return undefined;
                }
                // ending angle bracket cannot be escaped
                const rtrimSlash: string = removeTrailingSpace(trimmedUrl.slice(0, -1), '\\');
                if ((trimmedUrl.length - rtrimSlash.length) % 2 === 0) {
                    return undefined;
                }
            } else {
                // find closing parenthesis
                const lastParenIndex: number = findClosingBracket(match[2], '()');
                if (lastParenIndex === -2) {
                    // more open parens than closed
                    return undefined;
                }
                if (lastParenIndex > -1) {
                    const start: number = match[0].indexOf('!') === 0 ? 5 : 4;
                    const linkLen: number = start + match[1].length + lastParenIndex;
                    match[2] = match[2].substring(0, lastParenIndex);
                    match[0] = match[0].substring(0, linkLen).trim();
                    match[3] = '';
                }
            }
            let href: string = match[2];
            let title: string = '';
            if (!this.options.gfm) {
                // split pedantic href and title
                const link: RegExpExecArray | null = this.rules.other.pedanticHrefTitle.exec(href);
                if (link) {
                    href = link[1];
                    title = link[3];
                }
            } else {
                title = match[3] ? match[3].slice(1, -1) : '';
            }
            href = href.trim();
            if (this.rules.other.startAngleBracket.test(href)) {
                if (!this.options.gfm && !(this.rules.other.endAngleBracket.test(trimmedUrl))) {
                    // pedantic allows starting angle bracket without ending angle bracket
                    href = href.slice(1);
                } else {
                    href = href.slice(1, -1);
                }
            }
            return this.outputLink(match, {
                href: href ? href.replace(this.rules.inline.anyPunctuation, '$1') : href,
                title: title ? title.replace(this.rules.inline.anyPunctuation, '$1') : title
            }, match[0], this.lexer, this.rules);
        }
        return undefined;
    }

    /**
     * Parses a reference-style link or image (reflink).
     *
     * @param {string} mdSource - Inline markdown source.
     * @param {Links} links - Collected link definitions map.
     * @returns {TokenLink | TokenImage | TokenText | undefined} A link/image or fallback text token; otherwise undefined.
     * @hidden
     * @private
     */
    public parseReferenceLink(mdSource: string, links: Links): TokenLink | TokenImage | TokenText | undefined {
        if (!links) {
            return undefined;
        }
        let match: RegExpExecArray | null;
        // eslint-disable-next-line no-cond-assign
        if ((match = this.rules.inline.reflink.exec(mdSource))
            // eslint-disable-next-line no-cond-assign
            || (match = this.rules.inline.nolink.exec(mdSource))) {
            const linkString: string = (match[2] || match[1]).replace(this.rules.other.multipleSpaceGlobal, ' ');
            const link: Pick<TokenLink | TokenImage, 'href' | 'title'> = links[linkString.toLowerCase()];
            if (!link) {
                const text: string = match[0].charAt(0);
                return {
                    type: 'text',
                    raw: text,
                    text
                };
            }
            return this.outputLink(match, link, match[0], this.lexer, this.rules);
        }
        return undefined;
    }

    /**
     * Parses an angle-bracket autolink (e.g., "<https://...>", "<user@example.com>").
     *
     * @param {string} mdSource - Inline markdown source.
     * @returns {TokenLink | undefined} A link token when matched; otherwise undefined.
     * @hidden
     * @private
     */
    public parseAutoLink(mdSource: string): TokenLink | undefined {
        const match: RegExpExecArray = this.rules.inline.autolink.exec(mdSource);
        if (match) {
            let text: string;
            let href: string;
            if (match[2] === '@') {
                text = match[1];
                href = 'mailto:' + text;
            } else {
                text = match[1];
                href = text;
            }
            return {
                type: 'link',
                raw: match[0],
                text,
                href,
                tokens: [
                    {
                        type: 'text',
                        raw: text,
                        text
                    }
                ]
            };
        }
        return undefined;
    }

    /**
     * Parses a bare URL (GFM autolink) outside of an existing link.
     *
     * @param {string} mdSource - Inline markdown source.
     * @returns {TokenLink | undefined} A link token when matched; otherwise undefined.
     * @hidden
     * @private
     */
    public parseBareUrl(mdSource: string): TokenLink | undefined {
        // Only GFM supports bare URL auto-linking
        if (!this.options.gfm) {
            return undefined;
        }
        // Do not autolink inside an existing link
        if (this.lexer && this.lexer.state.inLink) {
            return undefined;
        }
        let match: RegExpExecArray;
        // eslint-disable-next-line no-cond-assign
        if (match = this.rules.inline.url.exec(mdSource)) {
            let text: string;
            let href: string;
            if (match[2] === '@') {
                text = match[0];
                href = 'mailto:' + text;
            } else {
                // do extended autolink path validation
                let prevCapZero: string;
                do {
                    prevCapZero = match[0];
                    match[0] = this.rules.inline._backpedal.exec(match[0]) ? this.rules.inline._backpedal.exec(match[0])[0] : '';
                } while (prevCapZero !== match[0]);
                text = match[0];
                if (match[1] === 'www.') {
                    href = 'http://' + match[0];
                } else {
                    href = match[0];
                }
            }
            return {
                type: 'link',
                raw: match[0],
                text,
                href,
                tokens: [
                    {
                        type: 'text',
                        raw: text,
                        text
                    }
                ]
            };
        }
        return undefined;
    }

    /**
     * Parses a reference definition line (e.g., "[id]: url 'title'").
     *
     * @param {string} mdSource - Markdown source.
     * @returns {TokenDef | undefined} A definition token when matched; otherwise undefined.
     * @hidden
     * @private
     */
    public parseDefinition(mdSource: string): TokenDef | undefined {
        const match: RegExpExecArray | null = this.rules.block.def.exec(mdSource);
        if (match) {
            const tag: string = match[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, ' ');
            const href: string = match[2] ? match[2].replace(this.rules.other.hrefBrackets, '$1').replace(this.rules.inline.anyPunctuation, '$1') : '';
            const title: string = match[3] ? match[3].substring(1, match[3].length - 1).replace(this.rules.inline.anyPunctuation, '$1') : match[3];
            return {
                type: 'def',
                tag,
                raw: match[0],
                href,
                title
            };
        }
        return undefined;
    }

    /**
     * Parses an inline escape (e.g., "\*").
     *
     * @param {string} mdSource - Inline markdown source.
     * @returns {TokenEscape | undefined} An escape token when matched; otherwise undefined.
     * @hidden
     * @private
     */
    public parseEscape(mdSource: string): TokenEscape | undefined {
        const match: RegExpExecArray | null = this.rules.inline.escape.exec(mdSource);
        if (match) {
            return {
                type: 'escape',
                raw: match[0],
                text: match[1]
            };
        }
        return undefined;
    }

    /**
     * Parses an ordered/unordered list block.
     *
     * @param {string} mdSource - Markdown source.
     * @returns {TokenList | undefined} A list token when matched; otherwise undefined.
     * @hidden
     * @private
     */
    public parseList(mdSource: string): TokenList | undefined {
        let match: RegExpMatchArray | null = this.rules.block.list.exec(mdSource);
        if (match) {
            let bullet: string = match[1].trim();
            const isordered: boolean = bullet.length > 1;
            const list: TokenList = {
                type: 'list',
                raw: '',
                ordered: isordered,
                start: isordered ? +bullet.slice(0, -1) : '',
                loose: false,
                items: []
            };
            bullet = isordered ? `\\d{1,9}\\${bullet.slice(-1)}` : `\\${bullet}`;
            if (!this.options.gfm) {
                bullet = isordered ? bullet : '[*+-]';
            }
            // Get next list item
            const itemRegex: RegExp = this.rules.other.listItemRegex(bullet);
            let endsWithBlankLine: boolean = false;
            // Check if current bullet point can start a new List Item
            while (mdSource) {
                let endEarly: boolean = false;
                let raw: string = '';
                let itemContents: string = '';
                // eslint-disable-next-line no-cond-assign
                if (!(match = itemRegex.exec(mdSource))) {
                    break;
                }
                if (this.rules.block.hr.test(mdSource)) { // End list if bullet was actually HR (possibly move into itemRegex?)
                    break;
                }
                raw = match[0];
                mdSource = mdSource.substring(raw.length);
                let line: string = match[2].split('\n', 1)[0].replace(this.rules.other.listReplaceTabs, (t: string) => ' '.repeat(3 * t.length));
                let nextLine: string = mdSource.split('\n', 1)[0];
                let blankLine: boolean = !line.trim();
                let indent: number = 0;
                if (!this.options.gfm) {
                    indent = 2;
                    itemContents = stringTrimStart(line);
                } else if (blankLine) {
                    indent = match[1].length + 1;
                } else {
                    indent = match[2].search(this.rules.other.nonSpaceChar); // Find first non-space char
                    indent = indent > 4 ? 1 : indent; // Treat indented code blocks (> 4 spaces) as having only 1 indent
                    itemContents = line.slice(indent);
                    indent += match[1].length;
                }
                if (blankLine && this.rules.other.blankLine.test(nextLine)) { // Items begin with at most one blank line
                    raw += nextLine + '\n';
                    mdSource = mdSource.substring(nextLine.length + 1);
                    endEarly = true;
                }
                if (!endEarly) {
                    const nextBulletRegex: RegExp = this.rules.other.nextBulletRegex(indent);
                    const hrRegex: RegExp = this.rules.other.hrRegex(indent);
                    const fencesBeginRegex: RegExp = this.rules.other.fencesBeginRegex(indent);
                    const headingBeginRegex: RegExp = this.rules.other.headingBeginRegex(indent);
                    const htmlBeginRegex: RegExp = this.rules.other.htmlBeginRegex(indent);
                    // Check if following lines should be included in List Item
                    while (mdSource) {
                        const rawLine: string = mdSource.split('\n', 1)[0];
                        let nextLineWithoutTabs: string;
                        nextLine = rawLine;
                        // Re-align to follow commonmark nesting rules
                        if (!this.options.gfm) {
                            nextLine = nextLine.replace(this.rules.other.listReplaceNesting, '  ');
                            nextLineWithoutTabs = nextLine;
                        } else {
                            nextLineWithoutTabs = nextLine.replace(this.rules.other.tabCharGlobal, '    ');
                        }
                        // End list item if found code fences
                        if (fencesBeginRegex.test(nextLine)) {
                            break;
                        }
                        // End list item if found start of new heading
                        if (headingBeginRegex.test(nextLine)) {
                            break;
                        }
                        // End list item if found start of html block
                        if (htmlBeginRegex.test(nextLine)) {
                            break;
                        }
                        // End list item if found start of new bullet
                        if (nextBulletRegex.test(nextLine)) {
                            break;
                        }
                        // Horizontal rule found
                        if (hrRegex.test(nextLine)) {
                            break;
                        }
                        if (nextLineWithoutTabs.search(this.rules.other.nonSpaceChar) >= indent || !nextLine.trim()) { // Dedent if possible
                            itemContents += '\n' + nextLineWithoutTabs.slice(indent);
                        } else {
                            // not enough indentation
                            if (blankLine) {
                                break;
                            }
                            // Treat a 4-space indented line as continuation inside a tight list item,
                            // unless it starts a known block boundary (fence/heading/hr/html).
                            if (fencesBeginRegex.test(nextLine) ||
                                headingBeginRegex.test(nextLine) ||
                                hrRegex.test(nextLine) ||
                                htmlBeginRegex.test(nextLine)) {
                                break;
                            }
                            // Continuation: keep the indented line inside the current list item
                            itemContents += '\n' + nextLine;
                        }
                        if (!blankLine && !nextLine.trim()) { // Check if current line is blank
                            blankLine = true;
                        }
                        raw += rawLine + '\n';
                        mdSource = mdSource.substring(rawLine.length + 1);
                        line = nextLineWithoutTabs.slice(indent);
                    }
                }

                if (!list.loose) {
                    // If the previous item ended with a blank line, the list is loose
                    if (endsWithBlankLine) {
                        list.loose = true;
                    } else if (this.rules.other.doubleBlankLine.test(raw)) {
                        endsWithBlankLine = true;
                    }
                }

                let istask: RegExpExecArray | null = null;
                let ischecked: boolean | undefined;
                // Check for task list items
                if (this.options.gfm) {
                    istask = this.rules.other.listIsTask.exec(itemContents);
                    if (istask) {
                        ischecked = istask[0] !== '[ ] ';
                        itemContents = itemContents.replace(this.rules.other.listReplaceTask, '');
                    }
                }

                list.items.push({
                    type: 'list_item',
                    raw,
                    task: !!istask,
                    checked: ischecked,
                    loose: false,
                    text: itemContents,
                    tokens: []
                });

                list.raw += raw;
            }

            // Do not consume newlines at end of final item. Alternatively, make itemRegex *start* with any newlines to simplify/speed up endsWithBlankLine logic
            const lastItem: TokenListItem = arrayAt(list.items, -1);
            if (lastItem) {
                lastItem.raw = stringTrimEnd(lastItem.raw);
                lastItem.text = stringTrimEnd(lastItem.text);
            } else {
                // not a list since there were no items
                return undefined;
            }
            list.raw = stringTrimEnd(list.raw);

            // Item child tokens handled here at end because we needed to have the final item to trim it first
            for (let i: number = 0; i < list.items.length; i++) {
                this.lexer.state.top = false;
                list.items[i as number].tokens = this.lexer.tokenizeBlocks(list.items[i as number].text, []);

                if (!list.loose) {
                    // Check if list should be loose
                    const spacers: Token[] = list.items[i as number].tokens.filter((t: Token) => t.type === 'space');
                    const hasMultipleLineBreaks: boolean = spacers.length > 0 &&
                        spacers.some((t: Token) => this.rules.other.anyLine.test(t.raw));

                    list.loose = hasMultipleLineBreaks;
                }
            }

            // Set all items to loose if list is loose
            if (list.loose) {
                for (let i: number = 0; i < list.items.length; i++) {
                    list.items[i as number].loose = true;
                }
            }
            return list;
        }
        return undefined;
    }

    /**
     * Parses a raw HTML block.
     *
     * @param {string} mdSource - Markdown source.
     * @returns {TokenHTML | undefined} An HTML token when matched; otherwise undefined.
     * @hidden
     * @private
     */
    public parseHtmlBlock(mdSource: string): TokenHTML | undefined {
        const match: RegExpExecArray | null = this.rules.block.html.exec(mdSource);
        if (match) {
            const token: TokenHTML = {
                type: 'html',
                block: true,
                raw: match[0],
                pre: match[1] === 'pre' || match[1] === 'script' || match[1] === 'style',
                text: match[0]
            };
            return token;
        }
        return undefined;
    }

    /**
     * Parses an inline HTML tag and updates inLink/inRawBlock state.
     *
     * @param {string} mdSource - Inline markdown source.
     * @returns {TokenTag | undefined} An HTML tag token when matched; otherwise undefined.
     * @hidden
     * @private
     */
    public parseHtmlTag(mdSource: string): TokenTag | undefined {
        const match: RegExpExecArray | null = this.rules.inline.tag.exec(mdSource);
        if (match) {
            if (!this.lexer.state.inLink && this.rules.other.startATag.test(match[0])) {
                this.lexer.state.inLink = true;
            } else if (this.lexer.state.inLink && this.rules.other.endATag.test(match[0])) {
                this.lexer.state.inLink = false;
            }
            if (!this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(match[0])) {
                this.lexer.state.inRawBlock = true;
            } else if (this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(match[0])) {
                this.lexer.state.inRawBlock = false;
            }

            return {
                type: 'html',
                raw: match[0],
                inLink: this.lexer.state.inLink,
                inRawBlock: this.lexer.state.inRawBlock,
                block: false,
                text: match[0]
            };
        }
        return undefined;
    }

    /**
     * Parses a GFM table.
     *
     * @param {string} mdSource - Markdown source.
     * @returns {TokenTable | undefined} A table token when matched; otherwise undefined.
     * @hidden
     * @private
     */
    public parseTable(mdSource: string): TokenTable | undefined {
        const match: RegExpExecArray | null = this.rules.block.table.exec(mdSource);
        if (!match) {
            return undefined;
        }

        if (!this.rules.other.tableDelimiter.test(match[2])) {
            // delimiter row must have a pipe (|) or colon (:) otherwise it is a setext heading
            return undefined;
        }

        const headers: string[] = splitCells(match[1]);
        const aligns: string[] = match[2].replace(this.rules.other.tableAlignChars, '').split('|');
        const rows: string[] = match[3] && match[3].trim() ? match[3].replace(this.rules.other.tableRowBlankLine, '').split('\n') : [];

        const item: TokenTable = {
            type: 'table',
            raw: match[0],
            header: [],
            align: [],
            rows: []
        };

        if (headers.length !== aligns.length) {
            // header and align columns must be equal, rows can be different.
            return undefined;
        }

        for (const align of aligns) {
            if (this.rules.other.tableAlignRight.test(align)) {
                item.align.push('right');
            } else if (this.rules.other.tableAlignCenter.test(align)) {
                item.align.push('center');
            } else if (this.rules.other.tableAlignLeft.test(align)) {
                item.align.push('left');
            } else {
                item.align.push(null);
            }
        }

        for (let i: number = 0; i < headers.length; i++) {
            item.header.push({
                text: headers[i as number],
                tokens: this.lexer.inline(headers[i as number]),
                header: true,
                align: item.align[i as number]
            });
        }

        for (const row of rows) {
            item.rows.push(splitCells(row, item.header.length).map((cell: string, i: number) => {
                return {
                    text: cell,
                    tokens: this.lexer.inline(cell),
                    header: false,
                    align: item.align[i as number]
                };
            }));
        }

        return item;
    }
}

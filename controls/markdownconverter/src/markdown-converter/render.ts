import { TokenHeading, TokenParagraph, TokenText, TokenEscape, TokenSpace, TokenEm, TokenStrong, TokenDel, TokenHr, TokenBr, TokenCode, TokenCodespan, TokenBlockquote, TokenLink, TokenImage, TokenList, TokenListItem, TokenCheckbox, TokenHTML, TokenTag, TokenTable, TokenTableCell, TokenTableRow } from './tokens';
import { Parser } from './parser';
import { Rules, block, inline, other } from './rules';
import { getDefaults, cleanUrl, escape } from './utils';
import { MarkdownConverterOptions } from './interface';

export class Renderer {
    options: MarkdownConverterOptions;
    rules: Rules = {
        other: other,
        block: block.normal,
        inline: inline.normal
    };
    parser: Parser;
    constructor(parser?: Parser, options?: MarkdownConverterOptions) {
        this.parser = parser || undefined;
        this.options = options || getDefaults();
        this.rules = { other, block: block.normal, inline: inline.normal };
    }

    /**
     * Renders whitespace (no output).
     *
     * @param {TokenSpace} token - Space token.
     * @returns {string} An empty string.
     * @hidden
     * @private
     */
    public renderSpace(token: TokenSpace): string {
        return '';
    }

    /**
     * Renders a heading element (<h1>.. <h6>).
     *
     * @param {TokenHeading} token - Heading token with tokens/depth.
     * @returns {string} Rendered HTML heading.
     * @hidden
     * @private
     */
    public renderHeading({ tokens, depth }: TokenHeading): string {
        return `<h${depth}>${this.parser.parseInline(tokens)}</h${depth}>\n`;
    }

    /**
     * Renders a paragraph.
     *
     * @param {TokenParagraph} token - Paragraph token with child tokens.
     * @returns {string} Rendered HTML paragraph.
     * @hidden
     * @private
     */
    public renderParagraph({ tokens }: TokenParagraph): string {
        return `<p>${this.parser.parseInline(tokens)}</p>\n`;
    }

    /**
     * Renders plain or escaped inline text.
     *
     * @param {TokenText | TokenEscape} token - Text or escape token.
     * @returns {string} Rendered text HTML.
     * @hidden
     * @private
     */
    public renderText(token: TokenText | TokenEscape): string {
        return 'tokens' in token && token.tokens
            ? this.parser.parseInline(token.tokens)
            : ('escaped' in token && token.escaped ? token.text : escape(token.text));
    }

    /**
     * Renders bold (strong) inline content.
     *
     * @param {TokenStrong} token - Strong token with child tokens.
     * @returns {string} Rendered HTML strong element.
     * @hidden
     * @private
     */
    public renderStrong({ tokens }: TokenStrong): string {
        return `<strong>${this.parser.parseInline(tokens)}</strong>`;
    }

    /**
     * Renders emphasis (em) inline content.
     *
     * @param {TokenEm} token - Em token with child tokens.
     * @returns {string} Rendered HTML em element.
     * @hidden
     * @private
     */
    public renderEm({ tokens }: TokenEm): string {
        return `<em>${this.parser.parseInline(tokens)}</em>`;
    }

    /**
     * Renders strikethrough (del) inline content.
     *
     * @param {TokenDel} token - Del token with child tokens.
     * @returns {string} Rendered HTML del element.
     * @hidden
     * @private
     */
    public renderStrikethrough({ tokens }: TokenDel): string {
        return `<del>${this.parser.parseInline(tokens)}</del>`;
    }

    /**
     * Renders a horizontal rule.
     *
     * @param {TokenHr} token - HR token.
     * @returns {string} Rendered <hr> element.
     * @hidden
     * @private
     */
    public renderHorizontalRule(token: TokenHr): string {
        return '<hr>\n';
    }

    /**
     * Renders a hard line break.
     *
     * @param {TokenBr} token - Break token.
     * @returns {string} Rendered <br> element.
     * @hidden
     * @private
     */
    public renderHardBreak(token: TokenBr): string {
        return '<br>';
    }

    /**
     * Renders a fenced or indented code block.
     *
     * @param {TokenCode} token - Code token with text/lang info.
     * @returns {string} Rendered HTML code block.
     * @hidden
     * @private
     */
    public renderCodeBlock({ text, lang, escaped }: TokenCode): string {
        const langString: string | undefined = (lang || '').match(other.notSpaceStart) ? (lang || '').match(other.notSpaceStart)[0] : undefined;
        const code: string = text.replace(other.endingNewline, '') + '\n';
        if (!langString) {
            return '<pre><code>'
                + (escaped ? code : escape(code, true))
                + '</code></pre>\n';
        }
        return '<pre><code class="language-'
            + escape(langString)
            + '">'
            + (escaped ? code : escape(code, true))
            + '</code></pre>\n';
    }

    /**
     * Renders an inline code span.
     *
     * @param {TokenCodespan} token - Code span token.
     * @returns {string} Rendered HTML code element.
     * @hidden
     * @private
     */
    public renderCodeSpan({ text }: TokenCodespan): string {
        return `<code>${escape(text, true)}</code>`;
    }

    /**
     * Renders a blockquote element with child tokens.
     *
     * @param {TokenBlockquote} token - Blockquote token.
     * @returns {string} Rendered HTML blockquote.
     * @hidden
     * @private
     */
    public renderBlockquote({ tokens }: TokenBlockquote): string {
        const body: string = this.parser.parseBlocks(tokens);
        return `<blockquote>\n${body}</blockquote>\n`;
    }

    /**
     * Renders an anchor tag with inline content.
     *
     * @param {TokenLink} token - Link token with href/title/tokens.
     * @returns {string} Rendered anchor element or raw text for unsafe URL.
     * @hidden
     * @private
     */
    public renderLink({ href, title, tokens }: TokenLink): string {
        const text: string = this.parser.parseInline(tokens);
        const cleanHref: string | null = cleanUrl(href);
        if (cleanHref === null) {
            return text;
        }
        href = cleanHref;
        let out: string = '<a href="' + href + '"';
        if (title) {
            out += ' title="' + (escape(title)) + '"';
        }
        out += '>' + text + '</a>';
        return out;
    }

    /**
     * Renders an image tag.
     *
     * @param {TokenImage} token - Image token with href/title/alt.
     * @returns {string} Rendered image element or escaped alt text for unsafe URL.
     * @hidden
     * @private
     */
    public renderImage({ href, title, text, tokens }: TokenImage): string {
        if (tokens) {
            text = this.parser.parseInline(tokens);
        }
        const cleanHref: string | null = cleanUrl(href);
        if (cleanHref === null) {
            return escape(text);
        }
        href = cleanHref;
        let out: string = `<img src="${href}" alt="${text}"`;
        if (title) {
            out += ` title="${escape(title)}"`;
        }
        out += '>';
        return out;
    }

    /**
     * Renders an ordered/unordered list with list items.
     *
     * @param {TokenList} token - List token containing list items.
     * @returns {string} Rendered HTML list.
     * @hidden
     * @private
     */
    public renderList(token: TokenList): string {
        const ordered: boolean = token.ordered;
        const start: number | '' = token.start;
        let body: string = '';
        for (let j: number = 0; j < token.items.length; j++) {
            const item: TokenListItem = token.items[j as number];
            body += this.renderListItem(item);
        }
        const type: string = ordered ? 'ol' : 'ul';
        const startAttr: string = (ordered && start !== 1) ? (' start="' + start + '"') : '';
        return '<' + type + startAttr + '>\n' + body + '</' + type + '>\n';
    }

    /**
     * Renders a single list item, including task list checkbox output.
     *
     * @param {TokenListItem} item - List item token with child tokens.
     * @returns {string} Rendered list item HTML.
     * @hidden
     * @private
     */
    public renderListItem(item: any): string {
        let itemBody: string = '';
        if (item.task) {
            const checkbox: string = this.renderCheckbox({ checked: !!item.checked });
            if (item.loose) {
                if (item.tokens[0] && item.tokens[0].type === 'paragraph') {
                    item.tokens[0].text = checkbox + ' ' + item.tokens[0].text;
                    if (item.tokens[0].tokens && item.tokens[0].tokens.length > 0 && item.tokens[0].tokens[0].type === 'text') {
                        item.tokens[0].tokens[0].text = checkbox + ' ' + escape(item.tokens[0].tokens[0].text);
                        item.tokens[0].tokens[0].escaped = true;
                    }
                } else {
                    item.tokens.unshift({
                        type: 'text',
                        raw: checkbox + ' ',
                        text: checkbox + ' ',
                        escaped: true
                    });
                }
            } else {
                itemBody += checkbox + ' ';
            }
        }

        itemBody += this.parser.parseBlocks(item.tokens, !!item.loose);

        return `<li>${itemBody}</li>\n`;
    }

    /**
     * Renders a disabled checkbox for task list items.
     *
     * @param {TokenCheckbox} token - Checkbox state (checked/unchecked).
     * @returns {string} Rendered input checkbox element.
     * @hidden
     * @private
     */
    public renderCheckbox({ checked }: TokenCheckbox): string {
        return '<input '
            + (checked ? 'checked="" ' : '')
            + 'disabled="" type="checkbox">';
    }

    /**
     * Renders raw HTML (passthrough).
     *
     * @param {TokenHTML | TokenTag} token - Raw HTML token.
     * @returns {string} Raw HTML content.
     * @hidden
     * @private
     */
    public renderHtml({ text }: TokenHTML | TokenTag): string {
        return text;
    }

    /**
     * Renders a GFM table.
     *
     * @param {TokenTable} token - Table token.
     * @returns {string} Rendered HTML table.
     * @hidden
     * @private
     */
    public renderTable(token: TokenTable): string {
        let header: string = '';

        // header
        let cell: string = '';
        for (let j: number = 0; j < token.header.length; j++) {
            cell += this.renderTableCell(token.header[j as number]);
        }
        header += this.renderTableRow({ text: cell });

        let body: string = '';
        for (let j: number = 0; j < token.rows.length; j++) {
            const row: TokenTableCell[] = token.rows[j as number];

            cell = '';
            for (let k: number = 0; k < row.length; k++) {
                cell += this.renderTableCell(row[k as number]);
            }

            body += this.renderTableRow({ text: cell });
        }
        if (body) {
            body = `<tbody>${body}</tbody>`;
        }
        return '<table>\n'
            + '<thead>\n'
            + header
            + '</thead>\n'
            + body
            + '</table>\n';
    }
    /**
     * Renders a table row.
     *
     * @param {TokenTableRow} token - Table row token.
     * @returns {string} Rendered HTML row.
     * @hidden
     * @private
     */
    public renderTableRow({ text }: TokenTableRow): string {
        return `<tr>\n${text}</tr>\n`;
    }

    /**
     * Renders a table cell (th/td).
     *
     * @param {TokenTableCell} token - Table cell token with alignment and inline tokens.
     * @returns {string} Rendered HTML table cell.
     * @hidden
     * @private
     */
    public renderTableCell(token: TokenTableCell): string {
        const content: string = this.parser.parseInline(token.tokens);
        const type: string = token.header ? 'th' : 'td';
        const tag: string = token.align
            ? `<${type} align="${token.align}">`
            : `<${type}>`;
        return tag + content + `</${type}>\n`;
    }
}

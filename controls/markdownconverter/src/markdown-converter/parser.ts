import { Token, MarkedToken, TokenText } from './tokens';
import { Renderer } from './render';
import { MarkdownConverterOptions } from './interface';
import { getDefaults } from './utils';

export class Parser {
    options: MarkdownConverterOptions;
    renderer: Renderer;
    constructor(options ? : MarkdownConverterOptions, renderer?: Renderer) {
        this.renderer = renderer || new Renderer(); // Initialize Renderer instance
        this.options = options || getDefaults();
        this.renderer.options = this.options;
        this.renderer.parser = this;
    }
    /**
     * Static Parse Method
     *
     * @param {Token[]} tokens - Array of tokens
     * @param {MarkdownConverterOptions} options - Parsing options
     * @returns {string} Parsed HTML
     * @hidden
     * @private
     */
    static parse(tokens: Token[], options?: MarkdownConverterOptions): string {
        const parser: Parser = new Parser(options);
        return parser.parseBlocks(tokens);
    }

    /**
     * Parses a top-level token list (blocks) to HTML.
     *
     * @param {Token[]} tokens - Array of block tokens.
     * @param {boolean} [top=true] - Indicates top-level rendering (paragraph wrapping of text blocks).
     * @returns {string} Parsed HTML string.
     * @hidden
     * @private
     */
    public parseBlocks(tokens: Token[], top: boolean = true): string {
        let out: string = '';
        for (let i: number = 0; i < tokens.length; i++) {
            const anyToken: Token = tokens[i as number];
            const token: MarkedToken = anyToken as MarkedToken;
            switch (token.type) {
            case 'space': {
                out += this.renderer.renderSpace(token);
                continue;
            }
            case 'heading': {
                out += this.renderer.renderHeading(token);
                continue;
            }
            case 'paragraph': {
                out += this.renderer.renderParagraph(token);
                continue;
            }
            case 'hr': {
                out += this.renderer.renderHorizontalRule(token);
                continue;
            }
            case 'code': {
                out += this.renderer.renderCodeBlock(token);
                continue;
            }
            case 'blockquote': {
                out += this.renderer.renderBlockquote(token);
                continue;
            }
            case 'list': {
                out += this.renderer.renderList(token);
                continue;
            }
            case 'html': {
                out += this.renderer.renderHtml(token);
                continue;
            }
            case 'table': {
                out += this.renderer.renderTable(token);
                continue;
            }
            case 'text': {
                let textToken: TokenText = token;
                let body: string = this.renderer.renderText(textToken);
                while (i + 1 < tokens.length && tokens[i + 1].type === 'text') {
                    textToken = tokens[++i] as TokenText;
                    body += '\n' + this.renderer.renderText(textToken);
                }
                if (top) {
                    out += this.renderer.renderParagraph({
                        type: 'paragraph',
                        raw: body,
                        text: body,
                        tokens: [{ type: 'text', raw: body, text: body, escaped: true }]
                    });
                } else {
                    out += body;
                }
                continue;
            }
            }
        }

        return out;
    }
    /**
     * Parses inline tokens to HTML using the provided or default renderer.
     *
     * @param {Token[]} tokens - Array of inline tokens.
     * @param {Renderer} [renderer=this.renderer] - Renderer used to render inline nodes.
     * @returns {string} Parsed inline HTML string.
     * @hidden
     * @private
     */
    public parseInline(tokens: Token[], renderer: Renderer = this.renderer): string {
        let out: string = '';
        for (let i: number = 0; i < tokens.length; i++) {
            const anyToken: Token = tokens[i as number];
            const token: MarkedToken = anyToken as MarkedToken;
            switch (token.type) {
            case 'escape': {
                out += renderer.renderText(token);
                break;
            }
            case 'text': {
                out += renderer.renderText(token);
                break;
            }
            case 'strong': {
                out += renderer.renderStrong(token);
                break;
            }
            case 'em': {
                out += renderer.renderEm(token);
                break;
            }
            case 'del': {
                out += renderer.renderStrikethrough(token);
                break;
            }
            case 'br': {
                out += renderer.renderHardBreak(token);
                break;
            }
            case 'codespan': {
                out += renderer.renderCodeSpan(token);
                break;
            }
            case 'link': {
                out += this.renderer.renderLink(token);
                break;
            }
            case 'image': {
                out += this.renderer.renderImage(token);
                break;
            }
            case 'html': {
                out += renderer.renderHtml(token);
                break;
            }
            }
        }
        return out;
    }
}


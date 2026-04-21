/* eslint-disable no-use-before-define */

export type MarkedToken = (
    TokenBlockquote
    | TokenBr
    | TokenCode
    | TokenCodespan
    | TokenDef
    | TokenDel
    | TokenEm
    | TokenEscape
    | TokenHeading
    | TokenHr
    | TokenHTML
    | TokenImage
    | TokenLink
    | TokenList
    | TokenListItem
    | TokenParagraph
    | TokenSpace
    | TokenStrong
    | TokenTable
    | TokenTag
    | TokenText
);

export type Token = (
    MarkedToken
    | TokenGeneric);

export interface TokenBlockquote {
    type: 'blockquote';
    raw: string;
    text: string;
    tokens: Token[];
}

export interface TokenBr {
    type: 'br';
    raw: string;
}

export interface TokenCheckbox {
    checked: boolean;
}

export interface TokenCode {
    type: 'code';
    raw: string;
    codeBlockStyle?: 'indented';
    lang?: string;
    text: string;
    escaped?: boolean;
}

export interface TokenCodespan {
    type: 'codespan';
    raw: string;
    text: string;
}

export interface TokenDef {
    type: 'def';
    raw: string;
    tag: string;
    href: string;
    title: string;
}

export interface TokenDel {
    type: 'del';
    raw: string;
    text: string;
    tokens: Token[];
}

export interface TokenEm {
    type: 'em';
    raw: string;
    text: string;
    tokens: Token[];
}

export interface TokenEscape {
    type: 'escape';
    raw: string;
    text: string;
}

export interface TokenGeneric {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [index: string]: any;
    type: string;
    raw: string;
    tokens?: Token[];
}

export interface TokenHeading {
    type: 'heading';
    raw: string;
    depth: number;
    text: string;
    tokens: Token[];
}

export interface TokenHr {
    type: 'hr';
    raw: string;
}

export interface TokenHTML {
    type: 'html';
    raw: string;
    pre: boolean;
    text: string;
    block: boolean;
}

export interface TokenImage {
    type: 'image';
    raw: string;
    href: string;
    title: string | null;
    text: string;
    tokens: Token[];
}

export interface TokenLink {
    type: 'link';
    raw: string;
    href: string;
    title?: string | null;
    text: string;
    tokens: Token[];
}

export interface TokenList {
    type: 'list';
    raw: string;
    ordered: boolean;
    start: number | '';
    loose: boolean;
    items: TokenListItem[];
}

export interface TokenListItem {
    type: 'list_item';
    raw: string;
    task: boolean;
    checked?: boolean;
    loose: boolean;
    text: string;
    tokens: Token[];
}

export interface TokenParagraph {
    type: 'paragraph';
    raw: string;
    pre?: boolean;
    text: string;
    tokens: Token[];
}

export interface TokenSpace {
    type: 'space';
    raw: string;
}

export interface TokenStrong {
    type: 'strong';
    raw: string;
    text: string;
    tokens: Token[];
}

export interface TokenTable {
    type: 'table';
    raw: string;
    align: Array<'center' | 'left' | 'right' | null>;
    header: TokenTableCell[];
    rows: TokenTableCell[][];
}

export interface TokenTableCell {
    text: string;
    tokens: Token[];
    header: boolean;
    align: 'center' | 'left' | 'right' | null;
}

export interface TokenTableRow<P = string> {
    text: P;
}

export interface TokenTag {
    type: 'html';
    raw: string;
    inLink: boolean;
    inRawBlock: boolean;
    text: string;
    block: boolean;
}

export interface TokenText {
    type: 'text';
    raw: string;
    text: string;
    tokens?: Token[];
    escaped?: boolean;
}

export type Links = Record<string, Pick<TokenLink | TokenImage, 'href' | 'title'>>;

export type TokensList = Token[] & {
    links: Links;
};

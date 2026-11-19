/**
 * `EditorDocument` is the public-facing document type for the Rich Text Editor.
 *
 * The Headless Editor owns the canonical document model. The Rich Text
 * Editor exposes the same shape to consumers — there is no parallel
 * serializer, mapper, or conversion utility between the two.
 *
 * `EditorDocument` exposes the same structure as the Headless Editor's
 * `DocumentRoot`. Any consumer that captures / restores `value` as JSON is
 * capturing the same structure the Headless Editor mutates internally.
 */

/**
 * Public document model — the same shape used for `value` when
 * `valueFormat` is `'json'`. Always has `type: 'doc'` and may have any
 * registered block-level children.
 */
export interface EditorDocument {
    /** Always `'document'`. */
    type: 'document';
    /** Node attributes (alignment, indent, color, etc.). */
    attrs: Record<string, unknown>;
    /** Marks applied to this node (for block-level mark support). */
    marks: EditorMark[];
    /** Schema version — used for future migration handling. */
    schemaVersion: number;
    /** Child block nodes in the document. */
    children: BlockNode[];
}

/* Text alignment options shared by text-bearing block nodes. */
export type TextAlignment =
    | 'left'
    | 'center'
    | 'right'
    | 'justify';

/**
 * Attributes shared by text-bearing block nodes such as paragraphs and
 * headings. Designed for module augmentation so future features (for
 * example, `lineHeight`) can be added without changing existing items.
 */
export interface TextBlockAttributes {
    align?: TextAlignment;
    indent?: number
}

/* ---------- Block nodes ---------- */

/** Block-level node union — built-in plus registered custom block nodes. */
export type BlockNode =
    | ParagraphNode
    | HeadingNode
    | BlockquoteNode
    | CodeBlockNode
    | OrderedListNode
    | BulletListNode;

export interface ParagraphNode {
    type: 'paragraph';
    attrs?: TextBlockAttributes;
    children?: InlineNode[];
}

export interface HeadingAttributes extends TextBlockAttributes {
    level: 1 | 2 | 3 | 4;
}

export interface HeadingNode {
    type: 'heading';
    attrs: HeadingAttributes;
    children?: InlineNode[];
}

export interface BlockquoteNode {
    type: 'blockquote';
    children: BlockNode[];
}

export interface CodeBlockAttributes {
    language?: string;
}

export interface CodeBlockNode {
    type: 'codeBlock';
    attrs?: CodeBlockAttributes;
    children?: TextNode[];
}

export interface OrderedListAttributes {
    start?: number;
}

export interface OrderedListNode {
    type: 'orderedList';
    attrs?: OrderedListAttributes;
    children: ListItemNode[];
}

export interface BulletListNode {
    type: 'bulletList';
    children: ListItemNode[];
}

export interface ListItemNode {
    type: 'listItem';
    children: BlockNode[];
}

/* ---------- Inline nodes ---------- */

/** Inline-level node union — built-in plus registered custom inline nodes. */
export type InlineNode =
    | TextNode
    | HardBreakNode;

export interface TextNode {
    type: 'text';
    text: string;
    marks?: EditorMark[];
}

export interface HardBreakNode {
    type: 'hardBreak';
}

export interface LinkPreviewAttributes {
    url: string;
}

/* ---------- Marks ---------- */

/** Inline formatting marks — built-in plus registered custom marks. */
export type EditorMark =
    | BoldMark
    | ItalicMark
    | UnderlineMark
    | StrikeMark
    | SubscriptMark
    | SuperscriptMark
    | CodeMark
    | LinkMark
    | TextColorMark
    | BackgroundColorMark;

export interface BoldMark {
    type: 'bold';
}

export interface ItalicMark {
    type: 'italic';
}

export interface UnderlineMark {
    type: 'underline';
}

export interface StrikeMark {
    type: 'strike';
}

export interface SubscriptMark {
    type: 'subscript';
}

export interface SuperscriptMark {
    type: 'superscript';
}

export interface CodeMark {
    type: 'code';
}

export interface LinkAttributes {
    href: string;
    target?: '_self' | '_blank';
    rel?: string;
}

export interface LinkMark {
    type: 'link';
    attrs: LinkAttributes;
}

export interface TextColorAttributes {
    color: string;
}

export interface TextColorMark {
    type: 'textColor';
    attrs: TextColorAttributes;
}

export interface BackgroundColorAttributes {
    color: string;
}

export interface BackgroundColorMark {
    type: 'backgroundColor';
    attrs: BackgroundColorAttributes;
}

/* ---------- Custom-item registration (compile-time) ---------- */
/**
 * @private
 */
export interface CustomBlockNodeMap {
    /**
     * Internal marker for custom block-node registration.
     */
    readonly __customBlockNodeRegistry: never;
}

/**
 * @private
 */
export interface CustomInlineNodeMap {
    /**
     * Internal marker for custom inline-node registration.
     */
    readonly __customInlineNodeRegistry: never;
}

/**
 * @private
 */
export interface CustomMarkMap {
    /**
     * Internal marker for custom mark registration.
     */
    readonly __customMarkRegistry: never;
}

/**
 * @private
 */
type RegisteredCustomBlockNode =
    CustomBlockNodeMap[
        Exclude<
        keyof CustomBlockNodeMap,
        '__customBlockNodeRegistry'
        >
    ];

/**
 * @private
 */
type RegisteredCustomInlineNode =
    CustomInlineNodeMap[
        Exclude<
        keyof CustomInlineNodeMap,
        '__customInlineNodeRegistry'
        >
    ];
/**
 * @private
 */
type RegisteredCustomMark =
    CustomMarkMap[
        Exclude<
        keyof CustomMarkMap,
        '__customMarkRegistry'
        >
    ];

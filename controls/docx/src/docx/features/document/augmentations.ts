/**
 * Shared ambient augmentations for optional feature members on core types.
 *
 * Single source of truth for declaration merging onto the modules that
 * actually export the classes:
 * - `./index` (package barrel; the package entry point re-exports it as `@syncfusion/ej2-docx`)
 * - `./document`, `./paragraph`, `./section`
 *
 * Do not augment the package id `@syncfusion/ej2-docx` from this file.
 * `gulp ci-publish` / `es5-scripts` type-checks `src/**` as its own program.
 * TypeScript 3.3.1 resolves an external augmentation name before it will
 * merge it (`resolveExternalModule`). Inside that program the package name
 * has no resolvable module — `package.json` `main` points at a file that
 * does not exist yet — so `declare module '@syncfusion/ej2-docx'` is TS2664.
 * An ambient script stub is not part of the external-module resolution
 * path that this compile uses. Augmenting `./index` merges the same
 * interfaces onto the symbols consumers import from the package.
 *
 * Lives under the package sources with the document model. Package entry
 * points side-effect-import this module. Runtime prototype installs remain in
 * each feature module; importing this file has no runtime effect beyond
 * ensuring the ambient merges are in the program.
 *
 * Headers/footers continue to augment `PageSetup` from the
 * headers-footers feature (not WordDocument/Paragraph).
 *
 * @packageDocumentation
 * @private
 */
import { ContentControlType } from '../content-controls/index';
import { BuiltinDocumentProperties } from '../properties/index';
import { CustomDocumentProperties } from '../properties/index';
import { CommentCollection } from '../comments/index';
import { BookmarkCollection } from '../bookmarks/index';
import { FontSubstitutionTable } from '../font-table/index';
import { MailMergeCatalog } from '../mail-merge/index';
import { Footnotes } from '../notes/index';
import { Endnotes } from '../notes/index';
import { StyleCollection } from '../styles/index';
import { TableStyle } from '../styles/index';
import { ListType } from '../numbering/list-style';
import { ListStyle } from '../numbering/list-style';
import { ThemePart } from '../styles/theme';
import { ViewSetup } from '../settings/document-settings-facades';
import { DocumentSettings } from '../settings/document-settings-facades';
import { AttachedTemplate } from '../settings/index';
import { Watermark } from '../watermark/index';
import { BlockContentControl } from '../content-controls/index';
import { Table } from '../tables/index';
import { BookmarkStart } from '../bookmarks/index';
import { BookmarkEnd } from '../bookmarks/index';
import { Bookmark } from '../bookmarks/index';
import { AppendCommentMetadata } from '../comments/index';
import { Comment } from '../comments/index';
import { AppendCommentOptions } from '../comments/index';
import { InlineContentControl } from '../content-controls/index';
import { AutoShapeType } from '../drawing/index';
import { Shape } from '../drawing/index';
import { GroupOptions } from '../drawing/index';
import { GroupShape } from '../drawing/index';
import { AppendEditableRangeOptions } from '../editable-ranges/index';
import { EditableRange } from '../editable-ranges/index';
import { EditableRangeWrapOptions } from '../editable-ranges/index';
import { FieldType } from '../fields/index';
import { Field } from '../fields/index';
import { HyperlinkType } from '../fields/index';
import { Hyperlink } from '../fields/index';
import { Picture } from '../images/index';
import { ImageOptions } from '../images/index';
import { Image } from '../images/index';
import { ChartType } from '@syncfusion/ej2-xlsx';
import { Chart } from '../charts/index';
import { Footnote } from '../notes/index';
import { Endnote } from '../notes/index';
import { AppendOleObjectOptions } from '../ole-object/index';
import { OleObject } from '../ole-object/index';
import { SectionBreakCode } from '../sections/index';
import { ColumnCollection } from '../sections/index';
import { Column } from '../sections/index';
export {};

declare module './index' {
    interface WordDocument {
    /** Built-in document properties (title, author, dates, statistics, ...). */
        readonly builtinDocumentProperties: BuiltinDocumentProperties;
        /** User defined (custom) document properties. */
        readonly customDocumentProperties: CustomDocumentProperties;
        /**
         * Gets the comments defined in this document.
         * The collection contains the comment bodies associated with document comment ranges.
         *
         * @private
         */
        readonly comments: CommentCollection;

        /**
         * Paired bookmarks in document order (`BookmarkCollection`).
         * Orphan markers remain in the DOM but are omitted from this collection.
         *
         * @private
         */
        readonly bookmarks: BookmarkCollection;

        /**
         * Primary → alternate font name dictionary (`w:font/@w:name` →
         * `w:altName/@w:val`, ECMA-376-1 §17.8.3.1).
         *
         * **Preferred public API** for font substitutions. Map-style
         * methods (`set` / `get` / `has` / `delete` / `clear`, iteration). Same
         * object identity on every access for this document. Mutations dirty the
         * font table part; save emits `word/fontTable.xml` when dirty.
         *
         * Requires the font-table feature (via `@syncfusion/ej2-docx/font-table`, styles, or
         * {@link registerFontTableFeature}). Does not require calling
         * {@link fontTableFor} — that helper remains for full `CT_Font` catalog
         * metadata only.
         *
         * @private
         */
        readonly fontSubstitutionTable: FontSubstitutionTable;

        /**
         * @private
         */
        readonly mailMerge: MailMergeCatalog;

        /**
         * Document-level footnotes manager. Stable identity; enumerates interned
         * {@link Footnote} bodies referenced from the main story.
         *
         * @private
         */
        readonly footnotes: Footnotes;
        /**
         * Document-level endnotes manager. Stable identity; enumerates interned
         * {@link Endnote} bodies referenced from the main story.
         *
         * @private
         */
        readonly endnotes: Endnotes;


        /**
         * Gets the collection of styles owned by the document.
         *
         * @public
         */
        readonly styles: StyleCollection;
        /**
         * Create a custom table style and add it to this document's styles collection.
         *
         * @param {string} name Display name used to derive a deterministic style id.
         * @returns {TableStyle} Live table style owned by this document.
         */
        addTableStyle(name: string): TableStyle;
        /**
         * Create a custom list (numbering) style and add it to this document.
         *
         * @param {ListType} listType Bulleted or numbered list category.
         * @param {string} styleName Display name; must be unique among document styles.
         * @returns {ListStyle} Live list style owned by this document.
         */
        addListStyle(
            listType: ListType,
            styleName: string,
        ): ListStyle;
        /**
         * @private
         * The theme catalog for this document. Equivalent to `themeFor(document)`.
         * Plural name matches the product DOM surface (`document.themes`).
         */
        readonly themes: ThemePart;

        /**
         * View preferences for this document (`w:settings` view / zoom).
         * Same object identity on every access.
         *
         * @private
         */
        readonly viewSetup: ViewSetup;
        /**
         * Document settings facade (`compatibility`, protection-adjacent surface).
         * Same object identity on every access.
         *
         * @private
         */
        readonly settings: DocumentSettings;
        /**
         * Whether track revisions is enabled (`w:trackRevisions`). Absent → false.
         */
        trackRevisions: boolean;
        /**
         * Default tab stop in points (`w:defaultTabStop`).
         */
        defaultTabStop: number;
        /**
         * Attached template metadata from settings, when present.
         *
         * @private
         */
        readonly attachedTemplate: AttachedTemplate | undefined;

        /**
         * Gets or sets the document watermark.
         * Assign `undefined` to clear.
         *
         * @private
         */
        watermark: Watermark | undefined;
    }
    interface Body {
    /**
     * Appends a block-level content control (`w:sdt`) to this body.
     *
     * @param {ContentControlType} type - Authorable content-control kind.
     * @returns {BlockContentControl} The appended {@link BlockContentControl}.
     *
     * @example
     * ```ts
     * import { WordDocument, ContentControlType } from '@syncfusion/ej2-docx';
     * const doc = WordDocument.create();
     * const block = doc.body.addBlockContentControl(ContentControlType.Text);
     * block.tag = 'cust';
     * ```
     */
        addBlockContentControl(type: ContentControlType): BlockContentControl;

        /**
         * Appends a 1×1 table to the document body. Resize with {@link Table.resetCells}.
         *
         * Discover existing tables by walking {@link Body.items} with
         * {@link isTableBlock} (no document-order list accessor on the body).
         *
         * @returns {Table} The appended {@link Table}.
         */
        appendTable(): Table;
    }
    interface Paragraph {
    /**
     * Append a bookmark start marker (`w:bookmarkStart`) at the end of this paragraph.
     *
     * @param {string} name - Bookmark name (`w:name`); must be non-empty / not whitespace-only.
     * @returns {BookmarkStart} The authored start marker (pending id until save).
     * @public
     */
        appendBookmarkStart(name: string): BookmarkStart;
        /**
         * Append a bookmark end marker (`w:bookmarkEnd`) that pairs with a prior start marker.
         *
         * @param {string} name - Bookmark name to close; must match a prior start marker.
         * @returns {BookmarkEnd} The authored end marker.
         * @public
         */
        appendBookmarkEnd(name: string): BookmarkEnd;

        /**
         * Append a new comment (range markers + elevated {@link Comment}) on this paragraph.
         *
         * @param text - Initial comment body text.
         * @param options - Optional author, initials, date, and content range indices.
         * @returns Interned {@link Comment} shared with the document catalog.
         * @private
         */
        appendComment(text: string, options?: AppendCommentMetadata): Comment;
        /**
         * Append a new comment using a single options object (`text` required).
         *
         * @param options - Full {@link AppendCommentOptions}.
         * @returns Interned {@link Comment} shared with the document catalog.
         * @private
         */
        appendComment(options: AppendCommentOptions): Comment;

        /**
         * Appends a run-level content control (`w:sdt`) to this paragraph.
         *
         * @param {ContentControlType} type - Authorable content-control kind.
         * @returns {InlineContentControl} The appended {@link InlineContentControl}.
         *
         * @example
         * ```ts
         * import { WordDocument, ContentControlType } from '@syncfusion/ej2-docx';
         * const doc = WordDocument.create();
         * const p = doc.lastSection.body.appendParagraph();
         * const cc = p.appendInlineContentControl(ContentControlType.CheckBox);
         * cc.isChecked = true;
         * ```
         */
        appendInlineContentControl(type: ContentControlType): InlineContentControl;

        /**
         * Append a DrawingML preset shape as dual MC AlternateContent
         * (Choice `wps` + Fallback VML stub). Default placement is anchor.
         *
         * @param {AutoShapeType} autoShapeType - Specifies the preset geometry of the shape.
         * @param {number} width - Specifies the width of the shape, in points.
         * @param {number} height - Specifies the height of the shape, in points.
         * @returns {Shape} Returns the appended shape.
         */
        appendShape(autoShapeType: AutoShapeType, width: number, height: number): Shape;
        /**
         * Append an empty wordprocessing group as dual MC AlternateContent
         * (Choice `wpg` + Fallback VML stub). Nest children via
         * {@link GroupShape.appendShape} on the returned group.
         * Default placement is anchor.
         *
         * @private
         */
        appendGroup(options: GroupOptions): GroupShape;

        /**
         * Append a new editable range that wraps a fresh text run at the end of
         * this paragraph (bookmark-style authoring).
         *
         * Allocates a pending range id (materialized on save). Optional
         * `editorGroup` / `editor` map `w:edGrp` / `w:ed`. The library does not
         * evaluate document protection or editor identity.
         *
         * @param text - Text for the enclosed run
         * @param options - Optional `editorGroup`, `editor`, column attributes
         * @returns Live pair view (pending id until save)
         * @example
         * ```ts
         * const range = paragraph.appendEditableRange('edit me', { editorGroup: 'everyone' });
         * @private
         * ```
         */
        appendEditableRange(text: string, options?: AppendEditableRangeOptions): EditableRange;
        /**
         * Wrap existing content in this paragraph between the given inline indices
         * (see {@link insertEditableRangeAt}).
         *
         * @param options - Inclusive/exclusive indices and optional editor metadata
         * @returns Live pair view (pending id until save)
         * @private
         */
        insertEditableRangeAt(options: EditableRangeWrapOptions): EditableRange;

        /**
         * Append a supported Word field. The instruction is built from the field keyword and the
         * shared parameter; assign `fieldCode` on the returned field to replace arguments and switches.
         *
         * @param fieldResult - Shared parameter (field name, bookmark, formula, picture switch, ...)
         * and the initial (cached) field result text; empty uses the type's default.
         * @param fieldType - Supported FieldType.
         */
        appendField(fieldResult: string, fieldType: FieldType): Field;

        /**
         * Appends a hyperlink with the specified display text to the paragraph.
         *
         * @param {string} target - Specifies the hyperlink target, such as a URL, a file path, or a bookmark name.
         * @param {string} textToDisplay - Specifies the text that is displayed for the hyperlink.
         * @param {HyperlinkType} type - Specifies the type of the hyperlink.
         * @returns {Hyperlink} Returns the appended hyperlink.
         */
        appendHyperlink(target: string, textToDisplay: string, type: HyperlinkType): Hyperlink;
        /**
         * Appends a hyperlink that displays the specified picture to the paragraph.
         *
         * @param {string} target - Specifies the hyperlink target, such as a URL, a file path, or a bookmark name.
         * @param {Picture} picture - Specifies the picture that is displayed for the hyperlink.
         * @param {HyperlinkType} type - Specifies the type of the hyperlink.
         * @returns {Hyperlink} Returns the appended hyperlink.
         */
        appendHyperlink(target: string, picture: Picture, type: HyperlinkType): Hyperlink;
        /**
         * Appends an image to the paragraph from the given image bytes.
         *
         * @param {Uint8Array} bytes - Specifies the binary content of the image.
         * @param {ImageOptions} options - Specifies the optional image options, such as size, name, and description.
         * @returns {Image} Returns the appended image.
         */
        appendImage(bytes: Uint8Array, options?: ImageOptions): Image;

        // from src/features/charts/index.ts
        /**
         * Appends a new chart to the paragraph.
         *
         * @param chartType - The <see cref="ChartType">type</see> of the chart to create.
         * @param width - The width of the chart, in points.
         * @param height - The height of the chart, in points.
         * @returns The newly added <see cref="Chart">Chart</see>.
         * @public
         */
        appendChart(
            chartType: ChartType,
            width: number,
            height: number
        ): Chart;

        /**
         * Append a footnote reference and body to this paragraph.
         *
         * @param text - Initial body text for the note.
         * @private
         */
        appendFootnote(text: string): Footnote;
        /**
         * Append an endnote reference and body to this paragraph.
         *
         * @param text - Initial body text for the note.
         * @private
         */
        appendEndnote(text: string): Endnote;

        /**
         * Assign a list by numbering instance id (escape hatch). Prefer {@link Paragraph.listFormat}.
         *
         * @deprecated Prefer `listFormat` for customer-facing list authoring.
         */
        numbering: {
            numId: number;
            level?: number;
        };
        // listFormat is declared directly on the Paragraph class getter
        // (see Paragraph.listFormat in the owning module); intentionally not
        // re-declared here to avoid TS2687/TS2717 conflicting-declaration
        // errors under TS 3.3.1.
        /**
         * Resolved list label for this paragraph (empty when not in a list).
         * Read-only; does not mutate numbering counters.
         */
        readonly listString: string;

        /**
         * Append an embedded or linked OLE object. Internal feature surface —
         * not part of the public `@syncfusion/ej2-docx` / `@syncfusion/ej2-docx/all` API.
         *
         * @private
         */
        appendOleObject(options: AppendOleObjectOptions): OleObject;

        /**
         * Gets or sets the name of the paragraph style applied to the paragraph.
         */
        style: string | undefined;
    }

    // always-on Section accessors.
    // pageSetup is typed on the core Section class as the core PageSetup interface
    // (always defined). Do not redeclare pageSetup here — TS 3.3.1 rejects
    // interface merges that change getter type or optionality.
    interface Section {
    /**
     * Section break kind written on this section's `w:sectPr` (`w:type`).
     * Prefer this over retired public `sectionStart` naming.
     *
     * @public
     */
        breakCode: SectionBreakCode;

        /**
         * Explicit text columns for this section (`w:cols` / `w:col`).
         * Same {@link ColumnCollection} identity
         * as {@link PageSetup.columns}.
         *
         * @public
         */
        readonly columns: ColumnCollection;

        /**
         * Appends one explicit text column (`w:col`) to {@link Section.columns}.
         *
         * @param {number} width - Column width in points.
         * @param {number} spacing - Spacing after the column in points (default from library).
         * @returns {Column} The appended {@link Column}.
         *
         * @public
         */
        addColumn(width: number, spacing?: number): Column;
    }
}

declare module './document' {
    interface WordDocument {
    /** Built-in document properties (title, author, dates, statistics, ...). */
        readonly builtinDocumentProperties: BuiltinDocumentProperties;
        /** User defined (custom) document properties. */
        readonly customDocumentProperties: CustomDocumentProperties;
        /**
         * Gets the comments defined in this document.
         * The collection contains the comment bodies associated with document comment ranges.
         *
         * @private
         */
        readonly comments: CommentCollection;

        /**
         * Paired bookmarks in document order (`BookmarkCollection`).
         * Orphan markers remain in the DOM but are omitted from this collection.
         *
         * @private
         */
        readonly bookmarks: BookmarkCollection;

        /**
         * Primary → alternate font name dictionary (`w:font/@w:name` →
         * `w:altName/@w:val`, ECMA-376-1 §17.8.3.1).
         *
         * **Preferred public API** for font substitutions. Map-style
         * methods (`set` / `get` / `has` / `delete` / `clear`, iteration). Same
         * object identity on every access for this document. Mutations dirty the
         * font table part; save emits `word/fontTable.xml` when dirty.
         *
         * Requires the font-table feature (via `@syncfusion/ej2-docx/font-table`, styles, or
         * {@link registerFontTableFeature}). Does not require calling
         * {@link fontTableFor} — that helper remains for full `CT_Font` catalog
         * metadata only.
         *
         * @private
         */
        readonly fontSubstitutionTable: FontSubstitutionTable;

        /**
         * @private
         */
        readonly mailMerge: MailMergeCatalog;

        /**
         * Document-level footnotes manager. Stable identity; enumerates interned
         * {@link Footnote} bodies referenced from the main story.
         *
         * @private
         */
        readonly footnotes: Footnotes;
        /**
         * Document-level endnotes manager. Stable identity; enumerates interned
         * {@link Endnote} bodies referenced from the main story.
         *
         * @private
         */
        readonly endnotes: Endnotes;


        /**
         * Gets the collection of styles owned by the document.
         *
         * @public
         */
        readonly styles: StyleCollection;
        /**
         * Create a custom table style and add it to this document's styles collection.
         *
         * @param {string} name Display name used to derive a deterministic style id.
         * @returns {TableStyle} Live table style owned by this document.
         */
        addTableStyle(name: string): TableStyle;
        /**
         * Create a custom list (numbering) style and add it to this document.
         *
         * @param {ListType} listType Bulleted or numbered list category.
         * @param {string} styleName Display name; must be unique among document styles.
         * @returns {ListStyle} Live list style owned by this document.
         */
        addListStyle(
            listType: ListType,
            styleName: string,
        ): ListStyle;
        /**
         * @private
         * The theme catalog for this document. Equivalent to `themeFor(document)`.
         * Plural name matches the product DOM surface (`document.themes`).
         */
        readonly themes: ThemePart;

        /**
         * View preferences for this document (`w:settings` view / zoom).
         * Same object identity on every access.
         *
         * @private
         */
        readonly viewSetup: ViewSetup;
        /**
         * Document settings facade (`compatibility`, protection-adjacent surface).
         * Same object identity on every access.
         *
         * @private
         */
        readonly settings: DocumentSettings;
        /**
         * Whether track revisions is enabled (`w:trackRevisions`). Absent → false.
         */
        trackRevisions: boolean;
        /**
         * Default tab stop in points (`w:defaultTabStop`).
         */
        defaultTabStop: number;
        /**
         * Attached template metadata from settings, when present.
         *
         * @private
         */
        readonly attachedTemplate: AttachedTemplate | undefined;

        /**
         * Gets or sets the document watermark.
         * Assign `undefined` to clear.
         *
         * @private
         */
        watermark: Watermark | undefined;
    }
    interface Body {
    /**
     * Appends a block-level content control (`w:sdt`) to this body.
     *
     * @param {ContentControlType} type - Authorable content-control kind.
     * @returns {BlockContentControl} The appended {@link BlockContentControl}.
     */
        addBlockContentControl(type: ContentControlType): BlockContentControl;

        /**
         * Appends a 1×1 table to the first section body. Resize with {@link Table.resetCells}.
         *
         * Discover existing tables by walking {@link Body.items} with
         * {@link isTableBlock} (no document-order list accessor on the body).
         *
         * @returns {Table} The appended {@link Table}.
         */
        appendTable(): Table;
    }
}
declare module './paragraph' {
    interface Paragraph {
    /**
     * Append a bookmark start marker (`w:bookmarkStart`) at the end of this paragraph.
     *
     * @param {string} name - Bookmark name (`w:name`); must be non-empty / not whitespace-only.
     * @returns {BookmarkStart} The authored start marker (pending id until save).
     * @public
     */
        appendBookmarkStart(name: string): BookmarkStart;
        /**
         * Append a bookmark end marker (`w:bookmarkEnd`) that pairs with a prior start marker.
         *
         * @param {string} name - Bookmark name to close; must match a prior start marker.
         * @returns {BookmarkEnd} The authored end marker.
         * @public
         */
        appendBookmarkEnd(name: string): BookmarkEnd;

        /**
         * Append a new comment (range markers + elevated {@link Comment}) on this paragraph.
         *
         * @param text - Initial comment body text.
         * @param options - Optional author, initials, date, and content range indices.
         * @returns Interned {@link Comment} shared with the document catalog.
         * @private
         */
        appendComment(text: string, options?: AppendCommentMetadata): Comment;
        /**
         * Append a new comment using a single options object (`text` required).
         *
         * @param options - Full {@link AppendCommentOptions}.
         * @returns Interned {@link Comment} shared with the document catalog.
         * @private
         */
        appendComment(options: AppendCommentOptions): Comment;

        /**
         * Appends a run-level content control (`w:sdt`) to this paragraph.
         *
         * @param {ContentControlType} type - Authorable content-control kind.
         * @returns {InlineContentControl} The appended {@link InlineContentControl}.
         */
        appendInlineContentControl(type: ContentControlType): InlineContentControl;

        /**
         * Append a DrawingML preset shape as dual MC AlternateContent
         * (Choice `wps` + Fallback VML stub). Default placement is anchor.
         *
         * @param {AutoShapeType} autoShapeType - Specifies the preset geometry of the shape.
         * @param {number} width - Specifies the width of the shape, in points.
         * @param {number} height - Specifies the height of the shape, in points.
         * @returns {Shape} Returns the appended shape.
         */
        appendShape(autoShapeType: AutoShapeType, width: number, height: number): Shape;
        /**
         * Append an empty wordprocessing group as dual MC AlternateContent
         * (Choice `wpg` + Fallback VML stub). Nest children via
         * {@link GroupShape.appendShape} on the returned group.
         * Default placement is anchor.
         *
         * @private
         */
        appendGroup(options: GroupOptions): GroupShape;

        /**
         * Append a new editable range that wraps a fresh text run at the end of
         * this paragraph (bookmark-style authoring).
         *
         * Allocates a pending range id (materialized on save). Optional
         * `editorGroup` / `editor` map `w:edGrp` / `w:ed`. The library does not
         * evaluate document protection or editor identity.
         *
         * @param text - Text for the enclosed run
         * @param options - Optional `editorGroup`, `editor`, column attributes
         * @returns Live pair view (pending id until save)
         * @example
         * ```ts
         * const range = paragraph.appendEditableRange('edit me', { editorGroup: 'everyone' });
         * @private
         * ```
         */
        appendEditableRange(text: string, options?: AppendEditableRangeOptions): EditableRange;
        /**
         * Wrap existing content in this paragraph between the given inline indices
         * (see {@link insertEditableRangeAt}).
         *
         * @param options - Inclusive/exclusive indices and optional editor metadata
         * @returns Live pair view (pending id until save)
         * @private
         */
        insertEditableRangeAt(options: EditableRangeWrapOptions): EditableRange;

        /**
         * Append a supported Word field. The instruction is built from the field keyword and the
         * shared parameter; assign `fieldCode` on the returned field to replace arguments and switches.
         *
         * @param fieldResult - Shared parameter (field name, bookmark, formula, picture switch, ...)
         * and the initial (cached) field result text; empty uses the type's default.
         * @param fieldType - Supported FieldType.
         */
        appendField(fieldResult: string, fieldType: FieldType): Field;

        /**
         * Appends a hyperlink with the specified display text to the paragraph.
         *
         * @param {string} target - Specifies the hyperlink target, such as a URL, a file path, or a bookmark name.
         * @param {string} textToDisplay - Specifies the text that is displayed for the hyperlink.
         * @param {HyperlinkType} type - Specifies the type of the hyperlink.
         * @returns {Hyperlink} Returns the appended hyperlink.
         */
        appendHyperlink(target: string, textToDisplay: string, type: HyperlinkType): Hyperlink;
        /**
         * Appends a hyperlink that displays the specified picture to the paragraph.
         *
         * @param {string} target - Specifies the hyperlink target, such as a URL, a file path, or a bookmark name.
         * @param {Picture} picture - Specifies the picture that is displayed for the hyperlink.
         * @param {HyperlinkType} type - Specifies the type of the hyperlink.
         * @returns {Hyperlink} Returns the appended hyperlink.
         */
        appendHyperlink(target: string, picture: Picture, type: HyperlinkType): Hyperlink;
        /**
         * Appends an image to the paragraph from the given image bytes.
         *
         * @param {Uint8Array} bytes - Specifies the binary content of the image.
         * @param {ImageOptions} options - Specifies the optional image options, such as size, name, and description.
         * @returns {Image} Returns the appended image.
         */
        appendImage(bytes: Uint8Array, options?: ImageOptions): Image;

        // from src/features/charts/index.ts
        /**
         * Appends a new chart to the paragraph.
         *
         * @param chartType - The <see cref="ChartType">type</see> of the chart to create.
         * @param width - The width of the chart, in points.
         * @param height - The height of the chart, in points.
         * @returns The newly added <see cref="Chart">Chart</see>.
         * @public
         */
        appendChart(
            chartType: ChartType,
            width: number,
            height: number
        ): Chart;

        /**
         * Append a footnote reference and body to this paragraph.
         *
         * @param text - Initial body text for the note.
         * @private
         */
        appendFootnote(text: string): Footnote;
        /**
         * Append an endnote reference and body to this paragraph.
         *
         * @param text - Initial body text for the note.
         * @private
         */
        appendEndnote(text: string): Endnote;

        /**
         * Assign a list by numbering instance id (escape hatch). Prefer {@link Paragraph.listFormat}.
         *
         * @deprecated Prefer `listFormat` for customer-facing list authoring.
         */
        numbering: {
            numId: number;
            level?: number;
        };
        // listFormat is declared directly on the Paragraph class getter
        // (see Paragraph.listFormat in the owning module); intentionally not
        // re-declared here to avoid TS2687/TS2717 conflicting-declaration
        // errors under TS 3.3.1.
        /**
         * Resolved list label for this paragraph (empty when not in a list).
         * Read-only; does not mutate numbering counters.
         */
        readonly listString: string;

        /**
         * Append an embedded or linked OLE object. Internal feature surface —
         * not part of the public `@syncfusion/ej2-docx` / `@syncfusion/ej2-docx/all` API.
         *
         * @private
         */
        appendOleObject(options: AppendOleObjectOptions): OleObject;

        /**
         * Gets or sets the name of the paragraph style applied to the paragraph.
         */
        style: string | undefined;
    }
}

declare module './section' {
    // pageSetup intentionally not retyped — TS 3.3.1 merge crash if PageSetup overrides model type.
    interface Section {
    /**
     * Section break kind (`w:type` on `w:sectPr`).
     *
     * @public
     */
        breakCode: SectionBreakCode;

        /**
         * Explicit text columns (`w:cols` / `w:col`).
         *
         * @public
         */
        readonly columns: ColumnCollection;

        /**
         * Appends one explicit text column to {@link Section.columns}.
         *
         * @param {number} width - Column width in points.
         * @param {number} spacing - Spacing after the column in points.
         * @returns {Column} The appended column.
         *
         * @public
         */
        addColumn(width: number, spacing?: number): Column;
    }
}

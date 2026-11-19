/**
 * Shared ambient augmentations for optional feature members on core types.
 *
 * Single source of truth for declaration merging onto the modules that
 * actually export the classes:
 * - `./index` (package barrel; `src/index.ts` re-exports it as `@syncfusion/ej2-docx`)
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
 * Lives under `src/features/document/` with the document model. Package entry
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
    // from src/features/properties/index.ts
    /** Built-in document properties (title, author, dates, statistics, ...). */
    readonly builtinDocumentProperties: BuiltinDocumentProperties;
    /** User defined (custom) document properties. */
    readonly customDocumentProperties: CustomDocumentProperties;
    // from src/features/comments/index.ts
    /**
     * Gets the comments defined in this document.
     * The collection contains the comment bodies associated with document comment ranges.
      * @private
     */
    readonly comments: CommentCollection;

    // from src/features/bookmarks/index.ts
    /**
     * Paired bookmarks in document order (`BookmarkCollection`).
     * Orphan markers remain in the DOM but are omitted from this collection.
      * @private
     */
    readonly bookmarks: BookmarkCollection;

    // from src/features/font-table/index.ts
    /**
     * Primary → alternate font name dictionary (`w:font/@w:name` →
     * `w:altName/@w:val`, ECMA-376-1 §17.8.3.1).
     *
     * **Preferred public API** for font substitutions (TASK-8067). Map-style
     * methods (`set` / `get` / `has` / `delete` / `clear`, iteration). Same
     * object identity on every access for this document. Mutations dirty the
     * font table part; save emits `word/fontTable.xml` when dirty.
     *
     * Requires the font-table feature (via `@syncfusion/ej2-docx/font-table`, styles, or
     * {@link registerFontTableFeature}). Does not require calling
     * {@link fontTableFor} — that helper remains for full `CT_Font` catalog
     * metadata only.
     * @private
     */
    readonly fontSubstitutionTable: FontSubstitutionTable;

    // from src/features/mail-merge/index.ts
    /**
     * @private
     */
    readonly mailMerge: MailMergeCatalog;

    // from src/features/notes/index.ts
    /**
     * Document-level footnotes manager. Stable identity; enumerates interned
     * {@link Footnote} bodies referenced from the main story.
      * @private
     */
    readonly footnotes: Footnotes;
    /**
     * Document-level endnotes manager. Stable identity; enumerates interned
     * {@link Endnote} bodies referenced from the main story.
      * @private
     */
    readonly endnotes: Endnotes;


    // from src/features/styles/index.ts
    /**
     * @public
     * Document-owned live styles collection. */
    readonly styles: StyleCollection;
    /**
     * Create a custom table style and add it to this document's styles collection.
     *
     * @param name Display name used to derive a deterministic style id.
     * @returns Live table style owned by this document.
     */
    addTableStyle(name: string): TableStyle;
    /**
     * Create a custom list (numbering) style and add it to this document.
     *
     * @param listType Bulleted or numbered list category.
     * @param styleName Display name; must be unique among document styles.
     * @returns Live list style owned by this document.
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

    // from src/features/settings/document-settings-facades.ts
    /**
     * View preferences for this document (`w:settings` view / zoom).
     * Same object identity on every access.
      * @private
     */
    readonly viewSetup: ViewSetup;
    /**
     * Document settings facade (`compatibility`, protection-adjacent surface).
     * Same object identity on every access.
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
      * @private
     */
    readonly attachedTemplate: AttachedTemplate | undefined;

    // from src/features/watermark/index.ts
    /**
     * Gets or sets the document watermark.
     * Assign `undefined` to clear.
      * @private
     */
    watermark: Watermark | undefined;
  }
  interface Body {
    // from src/features/content-controls/index.ts
    /**
     * Appends a block-level content control (`w:sdt`) to this body.
     *
     * @param type - Authorable content-control kind.
     * @returns The appended {@link BlockContentControl}.
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

    // from src/features/tables/index.ts
    /**
     * Appends a 1×1 table to the document body. Resize with {@link Table.resetCells}.
     *
     * Discover existing tables by walking {@link Body.items} with
     * {@link isTableBlock} (no document-order list accessor on the body).
     *
     * @returns The appended {@link Table}.
     */
    appendTable(): Table;
  }
  interface Paragraph {
    // from src/features/bookmarks/index.ts
    /**
     * Append a bookmark start marker (`w:bookmarkStart`) at the end of this paragraph.
     *
     * @param name - Bookmark name (`w:name`); must be non-empty / not whitespace-only.
     * @returns The authored start marker (pending id until save).
     * @public
     */
    appendBookmarkStart(name: string): BookmarkStart;
    /**
     * Append a bookmark end marker (`w:bookmarkEnd`) that pairs with a prior start marker.
     *
     * @param name - Bookmark name to close; must match a prior start marker.
     * @returns The authored end marker.
     * @public
     */
    appendBookmarkEnd(name: string): BookmarkEnd;

    // from src/features/comments/index.ts
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

    // from src/features/content-controls/index.ts
    /**
     * Appends a run-level content control (`w:sdt`) to this paragraph.
     *
     * @param type - Authorable content-control kind.
     * @returns The appended {@link InlineContentControl}.
     *
     * @example
     * ```ts
     * import { WordDocument, ContentControlType } from '@syncfusion/ej2-docx';
     * const doc = WordDocument.create();
     * const p = doc.appendParagraph();
     * const cc = p.appendInlineContentControl(ContentControlType.CheckBox);
     * cc.isChecked = true;
     * ```
     */
    appendInlineContentControl(type: ContentControlType): InlineContentControl;

    // from src/features/drawing/index.ts
    /**
     * Append a DrawingML preset shape as dual MC AlternateContent
     * (Choice `wps` + Fallback VML stub). Default placement is anchor.
     */
    appendShape(autoShapeType: AutoShapeType, width: number, height: number): Shape;
    /**
     * Append an empty wordprocessing group as dual MC AlternateContent
     * (Choice `wpg` + Fallback VML stub). Nest children via
     * {@link GroupShape.appendShape} on the returned group (TASK-8051).
     * Default placement is anchor.
      * @private
     */
    appendGroup(options: GroupOptions): GroupShape;

    // from src/features/editable-ranges/index.ts
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

    // from src/features/fields/index.ts
    /**
     * Append a supported Word field (PAGE, NUMPAGES, IF, MERGEFIELD, HYPERLINK).
     *
     * @param fieldName - Logical name (merge field name, or placeholder for PAGE/NUMPAGES/IF/HYPERLINK).
     * @param fieldType - Supported FieldType.
     */
    appendField(fieldName: string, fieldType: FieldType): Field;

    // from src/features/fields/index.ts
    appendHyperlink(target: string, textToDisplay: string, type: HyperlinkType): Hyperlink;
    appendHyperlink(target: string, picture: Picture, type: HyperlinkType): Hyperlink;
    // from src/features/images/index.ts
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

    // from src/features/notes/index.ts
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

    // from src/features/numbering/index.ts
    /**
     * Assign a list by numbering instance id (escape hatch). Prefer {@link Paragraph.listFormat}.
     * @deprecated Prefer `listFormat` for customer-facing list authoring.
     */
    numbering: {
        numId: number;
        level?: number;
    };
    // listFormat is declared directly on the Paragraph class getter
    // (see Paragraph.listFormat in paragraph.ts); intentionally not
    // re-declared here to avoid TS2687/TS2717 conflicting-declaration
    // errors under TS 3.3.1.
    /**
     * Resolved list label for this paragraph (empty when not in a list).
     * Read-only; does not mutate numbering counters.
     */
    readonly listString: string;

    // from src/features/ole-object/index.ts
    /**
     * Append an embedded or linked OLE object. Internal feature surface —
     * not part of the public `@syncfusion/ej2-docx` / `@syncfusion/ej2-docx/all` API.
     *
     * @private
     */
    appendOleObject(options: AppendOleObjectOptions): OleObject;

    // from src/features/styles/index.ts
    style: string | undefined;
  }

  // from src/features/sections/index.ts — always-on Section accessors.
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
     * @param width - Column width in points.
     * @param spacing - Spacing after the column in points (default from library).
     * @returns The appended {@link Column}.
     *
     * @public
     */
    addColumn(width: number, spacing?: number): Column;
  }
}

declare module './document' {
  interface WordDocument {
    // from src/features/properties/index.ts
    /** Built-in document properties (title, author, dates, statistics, ...). */
    readonly builtinDocumentProperties: BuiltinDocumentProperties;
    /** User defined (custom) document properties. */
    readonly customDocumentProperties: CustomDocumentProperties;
    // from src/features/comments/index.ts
    /**
     * Gets the comments defined in this document.
     * The collection contains the comment bodies associated with document comment ranges.
      * @private
     */
    readonly comments: CommentCollection;

    // from src/features/bookmarks/index.ts
    /**
     * Paired bookmarks in document order (`BookmarkCollection`).
     * Orphan markers remain in the DOM but are omitted from this collection.
      * @private
     */
    readonly bookmarks: BookmarkCollection;

    // from src/features/font-table/index.ts
    /**
     * Primary → alternate font name dictionary (`w:font/@w:name` →
     * `w:altName/@w:val`, ECMA-376-1 §17.8.3.1).
     *
     * **Preferred public API** for font substitutions (TASK-8067). Map-style
     * methods (`set` / `get` / `has` / `delete` / `clear`, iteration). Same
     * object identity on every access for this document. Mutations dirty the
     * font table part; save emits `word/fontTable.xml` when dirty.
     *
     * Requires the font-table feature (via `@syncfusion/ej2-docx/font-table`, styles, or
     * {@link registerFontTableFeature}). Does not require calling
     * {@link fontTableFor} — that helper remains for full `CT_Font` catalog
     * metadata only.
     * @private
     */
    readonly fontSubstitutionTable: FontSubstitutionTable;

    // from src/features/mail-merge/index.ts
    /**
     * @private
     */
    readonly mailMerge: MailMergeCatalog;

    // from src/features/notes/index.ts
    /**
     * Document-level footnotes manager. Stable identity; enumerates interned
     * {@link Footnote} bodies referenced from the main story.
      * @private
     */
    readonly footnotes: Footnotes;
    /**
     * Document-level endnotes manager. Stable identity; enumerates interned
     * {@link Endnote} bodies referenced from the main story.
      * @private
     */
    readonly endnotes: Endnotes;


    // from src/features/styles/index.ts
    /**
     * @public
     * Document-owned live styles collection. */
    readonly styles: StyleCollection;
    /**
     * Create a custom table style and add it to this document's styles collection.
     *
     * @param name Display name used to derive a deterministic style id.
     * @returns Live table style owned by this document.
     */
    addTableStyle(name: string): TableStyle;
    /**
     * Create a custom list (numbering) style and add it to this document.
     *
     * @param listType Bulleted or numbered list category.
     * @param styleName Display name; must be unique among document styles.
     * @returns Live list style owned by this document.
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

    // from src/features/settings/document-settings-facades.ts
    /**
     * View preferences for this document (`w:settings` view / zoom).
     * Same object identity on every access.
      * @private
     */
    readonly viewSetup: ViewSetup;
    /**
     * Document settings facade (`compatibility`, protection-adjacent surface).
     * Same object identity on every access.
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
      * @private
     */
    readonly attachedTemplate: AttachedTemplate | undefined;

    // from src/features/watermark/index.ts
    /**
     * Gets or sets the document watermark.
     * Assign `undefined` to clear.
      * @private
     */
    watermark: Watermark | undefined;
  }
  interface Body {
    // from src/features/content-controls/index.ts
    /**
     * Appends a block-level content control (`w:sdt`) to this body.
     *
     * @param type - Authorable content-control kind.
     * @returns The appended {@link BlockContentControl}.
     */
    addBlockContentControl(type: ContentControlType): BlockContentControl;

    // from src/features/tables/index.ts
    /**
     * Appends a 1×1 table to the first section body. Resize with {@link Table.resetCells}.
     *
     * Discover existing tables by walking {@link Body.items} with
     * {@link isTableBlock} (no document-order list accessor on the body).
     *
     * @returns The appended {@link Table}.
     */
    appendTable(): Table;
  }
}
declare module './paragraph' {
  interface Paragraph {
    // from src/features/bookmarks/index.ts
    /**
     * Append a bookmark start marker (`w:bookmarkStart`) at the end of this paragraph.
     *
     * @param name - Bookmark name (`w:name`); must be non-empty / not whitespace-only.
     * @returns The authored start marker (pending id until save).
     * @public
     */
    appendBookmarkStart(name: string): BookmarkStart;
    /**
     * Append a bookmark end marker (`w:bookmarkEnd`) that pairs with a prior start marker.
     *
     * @param name - Bookmark name to close; must match a prior start marker.
     * @returns The authored end marker.
     * @public
     */
    appendBookmarkEnd(name: string): BookmarkEnd;

    // from src/features/comments/index.ts
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

    // from src/features/content-controls/index.ts
    /**
     * Appends a run-level content control (`w:sdt`) to this paragraph.
     *
     * @param type - Authorable content-control kind.
     * @returns The appended {@link InlineContentControl}.
     */
    appendInlineContentControl(type: ContentControlType): InlineContentControl;

    // from src/features/drawing/index.ts
    /**
     * Append a DrawingML preset shape as dual MC AlternateContent
     * (Choice `wps` + Fallback VML stub). Default placement is anchor.
     */
    appendShape(autoShapeType: AutoShapeType, width: number, height: number): Shape;
    /**
     * Append an empty wordprocessing group as dual MC AlternateContent
     * (Choice `wpg` + Fallback VML stub). Nest children via
     * {@link GroupShape.appendShape} on the returned group (TASK-8051).
     * Default placement is anchor.
      * @private
     */
    appendGroup(options: GroupOptions): GroupShape;

    // from src/features/editable-ranges/index.ts
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

    // from src/features/fields/index.ts
    /**
     * Append a supported Word field (PAGE, NUMPAGES, IF, MERGEFIELD, HYPERLINK).
     *
     * @param fieldName - Logical name (merge field name, or placeholder for PAGE/NUMPAGES/IF/HYPERLINK).
     * @param fieldType - Supported FieldType.
     */
    appendField(fieldName: string, fieldType: FieldType): Field;

    // from src/features/fields/index.ts
    appendHyperlink(target: string, textToDisplay: string, type: HyperlinkType): Hyperlink;
    appendHyperlink(target: string, picture: Picture, type: HyperlinkType): Hyperlink;
    // from src/features/images/index.ts
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

    // from src/features/notes/index.ts
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

    // from src/features/numbering/index.ts
    /**
     * Assign a list by numbering instance id (escape hatch). Prefer {@link Paragraph.listFormat}.
     * @deprecated Prefer `listFormat` for customer-facing list authoring.
     */
    numbering: {
        numId: number;
        level?: number;
    };
    // listFormat is declared directly on the Paragraph class getter
    // (see Paragraph.listFormat in paragraph.ts); intentionally not
    // re-declared here to avoid TS2687/TS2717 conflicting-declaration
    // errors under TS 3.3.1.
    /**
     * Resolved list label for this paragraph (empty when not in a list).
     * Read-only; does not mutate numbering counters.
     */
    readonly listString: string;

    // from src/features/ole-object/index.ts
    /**
     * Append an embedded or linked OLE object. Internal feature surface —
     * not part of the public `@syncfusion/ej2-docx` / `@syncfusion/ej2-docx/all` API.
     *
     * @private
     */
    appendOleObject(options: AppendOleObjectOptions): OleObject;

    // from src/features/styles/index.ts
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
     * @param width - Column width in points.
     * @param spacing - Spacing after the column in points.
     * @returns The appended column.
     *
     * @public
     */
    addColumn(width: number, spacing?: number): Column;
  }
}

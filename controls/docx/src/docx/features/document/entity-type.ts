/**
 * Public document-entity discriminant (DocIO-aligned).
 *
 * Prefer {@link EntityType} on modeled objects and projected paragraph leaves
 * instead of internal wrapper tags such as `'featureRun'`.
 *
 * @public
 */
export enum EntityType {
    WordDocument,
    Section,
    TextBody,
    HeaderFooter,
    Paragraph,
    AlternateChunk,
    BlockContentControl,
    InlineContentControl,
    RowContentControl,
    CellContentControl,
    /**
     * @deprecated Use {@link EntityType.BlockContentControl} instead.
     */
    StructureDocumentTag,
    /**
     * @deprecated Use {@link EntityType.InlineContentControl} instead.
     */
    StructureDocumentTagInline,
    /**
     * @deprecated Use {@link EntityType.RowContentControl} instead.
     */
    StructureDocumentTagRow,
    /**
     * @deprecated Use {@link EntityType.CellContentControl} instead.
     */
    StructureDocumentTagCell,
    /**
     * @deprecated Use {@link EntityType.BlockContentControl} instead.
     */
    SDTBlockContent,
    /**
     * @deprecated Use {@link EntityType.InlineContentControl} instead.
     */
    SDTInlineContent,
    /**
     * @deprecated Use {@link EntityType.RowContentControl} instead.
     */
    SDTRowContent,
    /**
     * @deprecated Use {@link EntityType.CellContentControl} instead.
     */
    SDTCellContent,
    Table,
    TableRow,
    TableCell,
    TextRange,
    Picture,
    Field,
    FieldMark,
    MergeField,
    SeqField,
    EmbededField,
    ControlField,
    TextFormField,
    DropDownFormField,
    CheckBox,
    BookmarkStart,
    BookmarkEnd,
    Shape,
    Comment,
    Footnote,
    TextBox,
    Break,
    Symbol,
    TOC,
    XmlParaItem,
    Undefined,
    Chart,
    SmartArt,
    Canvas,
    CommentMark,
    CommentEnd,
    OleObject,
    AbsoluteTab,
    AutoShape,
    EditableRangeStart,
    EditableRangeEnd,
    GroupShape,
    ChildShape,
    ChildGroupShape,
    Math,
    Ink,
}

/**
 * Public document-entity discriminant.
 *
 * Prefer {@link EntityType} on modeled objects and projected paragraph leaves
 * instead of internal wrapper tags such as `'featureRun'`.
 *
 * @public
 */
export enum EntityType {
    /** Specifies the word document type. */
    WordDocument,
    /** Specifies the section type. */
    Section,
    /** Specifies the text body type. */
    TextBody,
    /** Specifies the header footer type. */
    HeaderFooter,
    /** Specifies the paragraph type. */
    Paragraph,
    /** Specifies the alternate chunk type. */
    AlternateChunk,
    /** Specifies the block content control type. */
    BlockContentControl,
    /** Specifies the inline content control type. */
    InlineContentControl,
    /** Specifies the row content control type. */
    RowContentControl,
    /** Specifies the cell content control type. */
    CellContentControl,
    /**
     * Specifies the block content control type.
     *
     * @deprecated Use {@link EntityType.BlockContentControl} instead.
     */
    StructureDocumentTag,
    /**
     * Specifies the inline content control type.
     *
     * @deprecated Use {@link EntityType.InlineContentControl} instead.
     */
    StructureDocumentTagInline,
    /**
     * Specifies the row content control type.
     *
     * @deprecated Use {@link EntityType.RowContentControl} instead.
     */
    StructureDocumentTagRow,
    /**
     * Specifies the cell content control type.
     *
     * @deprecated Use {@link EntityType.CellContentControl} instead.
     */
    StructureDocumentTagCell,
    /**
     * Specifies the block content control type.
     *
     * @deprecated Use {@link EntityType.BlockContentControl} instead.
     */
    SDTBlockContent,
    /**
     * Specifies the inline content control type.
     *
     * @deprecated Use {@link EntityType.InlineContentControl} instead.
     */
    SDTInlineContent,
    /**
     * Specifies the row content control type.
     *
     * @deprecated Use {@link EntityType.RowContentControl} instead.
     */
    SDTRowContent,
    /**
     * Specifies the cell content control type.
     *
     * @deprecated Use {@link EntityType.CellContentControl} instead.
     */
    SDTCellContent,
    /** Specifies the table type. */
    Table,
    /** Specifies the table row type. */
    TableRow,
    /** Specifies the table cell type. */
    TableCell,
    /** Specifies the text range type. */
    TextRange,
    /** Specifies the picture type. */
    Picture,
    /** Specifies the field type. */
    Field,
    /** Specifies the field mark type. */
    FieldMark,
    /** Specifies the merge field type. */
    MergeField,
    /** Specifies the seq field type. */
    SeqField,
    /** Specifies the embeded field type. */
    EmbededField,
    /** Specifies the control field type. */
    ControlField,
    /** Specifies the text form field type. */
    TextFormField,
    /** Specifies the drop down form field type. */
    DropDownFormField,
    /** Specifies the check box type. */
    CheckBox,
    /** Specifies the bookmark start type. */
    BookmarkStart,
    /** Specifies the bookmark end type. */
    BookmarkEnd,
    /** Specifies the shape type. */
    Shape,
    /** Specifies the comment type. */
    Comment,
    /** Specifies the footnote type. */
    Footnote,
    /** Specifies the text box type. */
    TextBox,
    /** Specifies the break type. */
    Break,
    /** Specifies the symbol type. */
    Symbol,
    /** Specifies the TOC type. */
    TOC,
    /** Specifies the xml para item type. */
    XmlParaItem,
    /** Specifies the undefined type. */
    Undefined,
    /** Specifies the chart type. */
    Chart,
    /** Specifies the smart art type. */
    SmartArt,
    /** Specifies the canvas type. */
    Canvas,
    /** Specifies the comment mark type. */
    CommentMark,
    /** Specifies the comment end type. */
    CommentEnd,
    /** Specifies the ole object type. */
    OleObject,
    /** Specifies the absolute tab type. */
    AbsoluteTab,
    /** Specifies the auto shape type. */
    AutoShape,
    /** Specifies the editable range start type. */
    EditableRangeStart,
    /** Specifies the editable range end type. */
    EditableRangeEnd,
    /** Specifies the group shape type. */
    GroupShape,
    /** Specifies the child shape type. */
    ChildShape,
    /** Specifies the child group shape type. */
    ChildGroupShape,
    /** Specifies the math type. */
    Math,
    /** Specifies the ink type. */
    Ink,
}

/**
 * Enum representing the different block types available in the block editor component.
 * Each block type corresponds to a specific content format that can be used to create structured documents.
 */
export enum BlockType {
    /**
     * Represents a text block.
     * This block type is used for plain text content.
     */
    Paragraph = 'Paragraph',

    /**
     * Represents a heading block.
     * This block type is used for headings (H1).
     */
    Heading1 = 'Heading1',

    /**
     * Represents a heading block.
     * This block type is used for headings (H2).
     */
    Heading2 = 'Heading2',

    /**
     * Represents a heading block.
     * This block type is used for headings (H3).
     */
    Heading3 = 'Heading3',

    /**
     * Represents a heading block.
     * This block type is used for headings (H4).
     */
    Heading4 = 'Heading4',

    /**
     * Represents a checklist block.
     * This block type is used for creating interactive to-do lists.
     */
    CheckList = 'CheckList',

    /**
     * Represents a bullet list block.
     * This block type is used for unordered lists.
     */
    BulletList = 'BulletList',

    /**
     * Represents a numbered list block.
     * This block type is used for ordered lists.
     */
    NumberedList = 'NumberedList',

    /**
     * Represents a code block.
     * This block type is used to display formatted code with syntax highlighting.
     */
    Code = 'Code',

    /**
     * Represents a quote block.
     * This block type is used to display quotations or excerpts from a text.
     */
    Quote = 'Quote',

    /**
     * Represents a callout block.
     * This block type is used to highlight important information or warnings.
     */
    Callout = 'Callout',

    /**
     * Represents a divider block.
     * This block type is used to insert horizontal dividers to separate sections of content.
     */
    Divider = 'Divider',

    /**
     * Represents a toggle paragraph block.
     * This block type is used to display paragraphs that can be expanded or collapsed.
     */
    ToggleParagraph = 'ToggleParagraph',

    /**
     * Represents a toggle heading 1 block.
     * This block type is used to display top-level headings that can be expanded or collapsed.
     */
    ToggleHeading1 = 'ToggleHeading1',

    /**
     * Represents a toggle heading 2 block.
     * This block type is used to display second-level headings that can be expanded or collapsed.
     */
    ToggleHeading2 = 'ToggleHeading2',

    /**
     * Represents a toggle heading 3 block.
     * This block type is used to display third-level headings that can be expanded or collapsed.
     */
    ToggleHeading3 = 'ToggleHeading3',

    /**
     * Represents a toggle heading 4 block.
     * This block type is used to display fourth-level headings that can be expanded or collapsed.
     */
    ToggleHeading4 = 'ToggleHeading4',

    /**
     * Represents an image block.
     * This block type is used to display images.
     */
    Image = 'Image',

    /**
     * Represents a template block.
     * This block type is used for predefined templates.
     */
    Template = 'Template'
}

/**
 * Defines the type of content a block can hold.
 * This enum represents various content formats supported in the editor.
 */
export enum ContentType {
    /**
     * Represents plain text content.
     */
    Text = 'Text',

    /**
     * Represents a hyperlink.
     */
    Link = 'Link',

    /**
     * Represents a code snippet.
     */
    Code = 'Code',

    /**
     * Represents a user mention.
     */
    Mention = 'Mention',

    /**
     * Represents a label or tag.
     */
    Label = 'Label'
}

/**
 * Enum representing the built in items for inline toolbar.
 */
export enum BuiltInToolbar {
    Bold = 'Bold',
    Italic = 'Italic',
    Underline = 'Underline',
    Strikethrough = 'Strikethrough',
    Color = 'Color',
    BgColor = 'BgColor',
    Superscript = 'Superscript',
    Subscript = 'Subscript',
    Uppercase = 'Uppercase',
    Lowercase = 'Lowercase',
    Custom = 'Custom'
}

export enum DeletionType {
    Partial = 'partial',
    Entire = 'entire'
}

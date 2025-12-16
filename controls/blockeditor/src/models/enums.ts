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
     * This block type is used for headings such as level 1, 2, 3 or 4.
     */
    Heading = 'Heading',

    /**
     * Represents a checklist block.
     * This block type is used for creating interactive to-do lists.
     */
    Checklist = 'Checklist',

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
     * Represents a collapsible paragraph block.
     * This block type is used to display paragraphs that can be expanded or collapsed.
     */
    CollapsibleParagraph = 'CollapsibleParagraph',

    /**
     * Represents a collapsible heading 1 block.
     * This block type is used to display top-level headings that can be expanded or collapsed.
     */
    CollapsibleHeading = 'CollapsibleHeading',

    /**
     * Represents an image block.
     * This block type is used to display images.
     */
    Image = 'Image',

    /**
     * Represents a table block.
     * This block type is used to display data in a tabular format.
     */
    Table = 'Table',

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
export enum CommandName {
    Bold = 'Bold',
    Italic = 'Italic',
    Underline = 'Underline',
    Strikethrough = 'Strikethrough',
    Color = 'Color',
    BackgroundColor = 'BackgroundColor',
    Superscript = 'Superscript',
    Subscript = 'Subscript',
    Uppercase = 'Uppercase',
    Lowercase = 'Lowercase'
}

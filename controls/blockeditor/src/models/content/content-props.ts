/**
 * Union type of all possible content properties.
 */
export type ContentProperties = ITextContentSettings | ILinkContentSettings |
IMentionContentSettings | ILabelContentSettings;

export type Styles = Partial<Record<keyof StyleModel, string | boolean>>;

/**
 * Properties for content styles
 */
export interface StyleModel {

    /**
     * Specifies whether the text is bold.
     *
     * @default false
     */
    bold?: boolean;

    /**
     * Specifies whether the text is italicized.
     *
     * @default false
     */
    italic?: boolean;

    /**
     * Specifies whether the text is underlined.
     *
     * @default false
     */
    underline?: boolean;

    /**
     * Specifies whether the text has a strikethrough effect.
     *
     * @default false
     */
    strikethrough?: boolean;

    /**
     * Specifies the text color in a HEX or RGBA format.
     *
     * @default ''
     */
    color?: string;

    /**
     * Specifies the background color for the text.
     *
     * @default ''
     */
    backgroundColor?: string;

    /**
     * Specifies whether the text is displayed as superscript.
     *
     * @default false
     */
    superscript?: boolean;

    /**
     * Specifies whether the text is displayed as subscript.
     *
     * @default false
     */
    subscript?: boolean;

    /**
     * Converts the text to uppercase.
     *
     * @default false
     */
    uppercase?: boolean;

    /**
     * Converts the text to lowercase.
     *
     * @default false
     */
    lowercase?: boolean;

    /**
     * Converts the text to InlineCode.
     *
     * @default false
     */
    inlineCode?: boolean;
}

export interface BaseStylesProp {
    /**
     * Specifies style attributes for the block.
     * This property is an object of key-value pairs defining text formatting options.
     *
     * @default {}
     */
    styles?: Partial<Record<keyof StyleModel, string | boolean>>;
}

/**
 * Properties for text content
 */
export type ITextContentSettings = BaseStylesProp;

/**
 * Properties for link content
 */
export interface ILinkContentSettings extends BaseStylesProp {
    /**
     * Specifies the URL of the link.
     * This is the destination where the link will navigate to when clicked.
     *
     * @default ''
     */
    url?: string;
}

/**
 * Properties for mention content
 */
export interface IMentionContentSettings {
    /**
     * Specifies the ID associated with the corresponding user.
     * This is used to identify the user being mentioned.
     *
     * @default ''
     */
    userId?: string;
}

/**
 * Properties for label content
 */
export interface ILabelContentSettings {
    /**
     * Specifies the ID associated with the label item.
     * This is used to identify the label item.
     *
     * @default ''
     */
    labelId?: string;
}

import { ChildProperty, Property } from '@syncfusion/ej2-base';

/**
 * Interface for a class PasteSettings
 */
export interface PasteSettingsModel {

    /**
     * Specifies the allowed styles when pasting content.
     * This property holds an array of styles that can be applied to pasted content.
     *
     * @default ['font-weight', 'font-style', 'text-decoration', 'text-transform']
     */
    allowedStyles?: string[];

    /**
     * Specifies the tags that are denied when pasting content.
     * This property holds an array of tags that should be removed from pasted content.
     *
     * @default []
     */
    deniedTags?: string[];

    /**
     * Specifies whether to keep the formatting of pasted content.
     * This property determines if the formatting (e.g., bold, italics) should be preserved.
     *
     * @default true
     */
    keepFormat?: boolean;

    /**
     * Specifies whether to paste as plain text.
     * This property removes any formatting from the pasted content and pastes only the raw text.
     *
     * @default false
     */
    plainText?: boolean;

}
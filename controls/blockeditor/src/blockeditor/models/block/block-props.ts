import { SaveFormat } from '../../base/enums';
import { BlockModel } from './block-model';

// eslint-disable @typescript-eslint/no-empty-interface

/**
 * Union type of all possible block properties.
 */
export type BlockProperties = ChecklistProps | BulletListProps | NumberedListProps |
ParagraphProps | HeadingProps | QuoteProps | CollapsibleProps | CollapsibleHeadingProps | CalloutProps | DividerProps | ImageProps
| CodeProps;

/**
 * Properties for blocks that support placeholder text.
 */
export interface BasePlaceholderProp {
    /**
     * Specifies placeholder text to display when the block is empty.
     * This property provides a hint to the user about what to write.
     *
     * @default ''
     */
    placeholder?: string;
}

/**
 * Properties for blocks that support nested child blocks.
 */
export interface BaseChildrenProp {
    /**
     * Represents the child blocks.
     * This property contains an array of blocks which are considered
     * as the children of parent block, allowing for hierarchical structures.
     *
     * @default []
     */
    children?: BlockModel[];
}

/**
 * Properties for checklist blocks.
 */
export interface ChecklistProps extends BasePlaceholderProp {
    /**
     * Specifies the checked state for the block.
     * This property is applicable for blocks that support a checked state, such as checklist.
     *
     * @default false
     */
    isChecked?: boolean;
}

/**
 * Properties for heading blocks.
 */
export interface HeadingProps extends BasePlaceholderProp {
    /**
     * Heading level, from 1 to 4.
     *
     * @default 1
     */
    level?: number;
}

/**
 * Properties for bullet list blocks.
 */
export type BulletListProps = BasePlaceholderProp;

/**
 * Properties for numbered list blocks.
 */
export type NumberedListProps = BasePlaceholderProp;

/**
 * Properties for paragraph blocks.
 */
export type ParagraphProps = BasePlaceholderProp;

/**
 * Properties for quote blocks.
 */
export type QuoteProps = BasePlaceholderProp;

/**
 * Properties for collapsible blocks, such as collapsible paragraphs or headings.
 */
export interface CollapsibleProps extends BasePlaceholderProp, BaseChildrenProp {
    /**
     * Specifies whether the block is expanded or collapsed.
     * This property controls the visibility of child blocks within a hierarchical structure.
     *
     * @default false
     */
    isExpanded?: boolean;
}

/**
 * Properties for collapsible heading blocks, combining heading and collapsible features.
 */
export type CollapsibleHeadingProps = CollapsibleProps & HeadingProps;

/**
 * Properties for callout blocks with nested children.
 */
export type CalloutProps = BaseChildrenProp;

/**
 * Properties for divider blocks
 */
export type DividerProps = {};

/**
 * Configuration for a code block's language, used for syntax highlighting.
 */
export interface CodeLanguageModel {

    /**
     * Specifies the language value used for syntax highlighting.
     * For example, 'javascript', 'python', 'html', etc.
     *
     * @default ''
     */
    language?: string;

    /**
     * Specifies the label to display in the language selector dropdown.
     * This is typically a user-friendly name corresponding to the language.
     *
     * @default ''
     */
    label?: string;

}

/**
 * Properties for code blocks.
 */
export interface CodeProps {
    /**
     * Specifies the languages available for syntax highlighting.
     * This is an array of objects, each containing a language value and a label.
     *
     * @default []
     */
    languages?: CodeLanguageModel[];

    /**
     * Specifies the default language to use for syntax highlighting.
     * This is the language that will be selected by default in the language selector dropdown.
     *
     * @default 'javascript'
     */
    defaultLanguage?: string;
}

/**
 * Properties for image blocks.
 */
export interface ImageProps {
    /**
     * Specifies the format to save the image.
     * Accepts either 'base64' for inline image encoding or 'blob' for binary object representation.
     *
     * @default 'Base64'
     */
    saveFormat?: SaveFormat;

    /**
     * Specifies the image path.
     *
     * @default ''
     */
    src?: string;

    /**
     * Specifies the allowed image file types that can be uploaded.
     * Common types include '.jpg', '.jpeg', and '.png'.
     *
     * @default ['.jpg', '.jpeg', '.png']
     */
    allowedTypes?: string[];

    /**
     * Specifies the display width of the image.
     * Can be defined in pixels or percentage.
     *
     * @default ''
     */

    width?: string;

    /**
     * Specifies the display height of the image.
     * Can be defined in pixels or percentage.
     *
     * @default ''
     */
    height?: string;

    /**
     * Specifies the minimum width of the image in pixels or as a string unit.
     * Prevents the image from being resized below this value.
     *
     * @default 40
     */

    minWidth?: string | number;

    /**
     * Specifies the maximum width of the image in pixels or as a string unit.
     * Prevents the image from being resized beyond this value.
     *
     * @default ''
     */
    maxWidth?: string | number;

    /**
     * Specifies the minimum height of the image in pixels or as a string unit.
     * Prevents the image from being resized below this value.
     *
     * @default 40
     */
    minHeight?: string | number;

    /**
     * Specifies the maximum height of the image in pixels or as a string unit.
     * Prevents the image from being resized beyond this value.
     *
     * @default ''
     */
    maxHeight?: string | number;

    /**
     * Specifies the alternative text to be displayed when the image cannot be loaded.
     *
     * @default ''
     */
    altText?: string;

    /**
     * Specifies one or more CSS classes to be applied to the image element.
     * Useful for applying custom styles or themes.
     *
     * @default ''
     */
    cssClass?: string;

    /**
     * Specifies whether the image is in read-only mode.
     * In read-only mode, editing or removing the image is not allowed.
     *
     * @default false
     */
    readOnly?: boolean;
}

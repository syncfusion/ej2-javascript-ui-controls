import { TableColumnType } from '../types';
import { BlockModel } from './block-model';

/**
 * Union type of all possible block properties.
 */
export type BlockProperties = IChecklistBlockSettings | IBulletListBlockSettings | INumberedListBlockSettings |
IParagraphBlockSettings | IHeadingBlockSettings | IQuoteBlockSettings | ICollapsibleBlockSettings | ICollapsibleHeadingBlockSettings |
ICalloutBlockSettings | IDividerBlockSettings | IImageBlockSettings | ICodeBlockSettings | ITableBlockSettings;

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
export interface IChecklistBlockSettings extends BasePlaceholderProp {
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
export interface IHeadingBlockSettings extends BasePlaceholderProp {
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
export type IBulletListBlockSettings = BasePlaceholderProp;

/**
 * Properties for numbered list blocks.
 */
export type INumberedListBlockSettings = BasePlaceholderProp;

/**
 * Properties for paragraph blocks.
 */
export type IParagraphBlockSettings = BasePlaceholderProp;

/**
 * Properties for quote blocks.
 */
export type IQuoteBlockSettings = BasePlaceholderProp;

/**
 * Properties for collapsible blocks, such as collapsible paragraphs or headings.
 */
export interface ICollapsibleBlockSettings extends BasePlaceholderProp, BaseChildrenProp {
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
export type ICollapsibleHeadingBlockSettings = ICollapsibleBlockSettings & IHeadingBlockSettings;

/**
 * Properties for callout blocks with nested children.
 */
export type ICalloutBlockSettings = BaseChildrenProp;

/**
 * Properties for divider blocks
 */
export type IDividerBlockSettings = {};

/**
 * Properties for code blocks.
 */
export interface ICodeBlockSettings {

    /**
     * Specifies the default language to use for syntax highlighting.
     * This is the language that will be selected by default in the language selector dropdown.
     *
     * @default ''
     */
    language?: string;
}

/**
 * Properties for image blocks.
 */
export interface IImageBlockSettings {

    /**
     * Specifies the image path.
     *
     * @default ''
     */
    src?: string;

    /**
     * Specifies the display width of the image.
     * Can be defined in pixels or percentage.
     *
     * @default ''
     */

    width?: string | number;

    /**
     * Specifies the display height of the image.
     * Can be defined in pixels or percentage.
     *
     * @default ''
     */
    height?: string | number;

    /**
     * Specifies the alternative text to be displayed when the image cannot be loaded.
     *
     * @default ''
     */
    altText?: string;
}

/**
 * Represents a table cell's settings.
 */
export interface TableCellModel {
    /**
     * Unique identifier for the cell.
     */
    id?: string;

    /**
     * The ID of the column this cell belongs to.
     */
    columnId?: string;

    /**
     * The content of the cell, restricted by the column's type.
     *
     * @default []
     */
    blocks?: BlockModel[];
}

/**
 * Represents a table column's settings.
 */
/**
 * Represents a table column's settings.
 */
export interface TableColumnModel {
    /**
     * Unique identifier for the column.
     */
    id?: string;

    /**
     * The type of content allowed in this column's cells.
     */
    type?: TableColumnType;

    /**
     * The header cell content for this column.
     */
    headerText?: string;

    /**
     * Specifies the width for the column.
     *
     * @default ''
     */
    width?: string | number;
}

/**
 * Represents a table row's settings.
 */
export interface TableRowModel {
    /**
     * Unique identifier for the row.
     */
    id?: string;

    /**
     * The cells in this row, each tied to a column via columnId.
     */
    cells?: TableCellModel[];

    /**
     * Specifies the height for the row.
     *
     * @default ''
     */
    height?: string | number;
}

export interface ITableBlockSettings {
    /**
     * Sets the table width in percentage or pixel units (e.g., '100%', '500px').
     *
     * @default '100%'
     */
    width?: string | number;

    /**
     * Specifies whether to enable header for the table
     *
     * @default true
     */
    enableHeader?: boolean;

    /**
     * Specifies whether to enable row numbers for the table
     *
     * @default true
     */
    enableRowNumbers?: boolean;

    /**
     * Specifies whether to render the table in read-only mode, disabling edits.
     */
    readOnly?: boolean;

    /**
     * Defines the columns of the table, including their types and headers.
     *
     * @default []
     */
    columns?: TableColumnModel[];

    /**
     * Defines the rows of the table, each containing cells tied to columns.
     *
     * @default []
     */
    rows?: TableRowModel[];
}

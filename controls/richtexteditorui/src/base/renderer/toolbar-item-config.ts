/* eslint-disable security/detect-object-injection */
/* eslint-disable valid-jsdoc */
/* eslint-disable jsdoc/require-returns */
/**
 * Toolbar item configuration registry.
 *
 * Maps all 34 BuiltInToolbarItem values to their rendering metadata.
 * This is the single source of truth for built-in toolbar item properties.
 */

import { BuiltInToolbarItem, LinkQuickToolbarItem, TableQuickToolbarItem, ImageQuickToolbarItem } from '../../richtexteditor-ui/model';
import { ItemModel } from '@syncfusion/ej2-navigations';

/**
 * Keyboard shortcut configuration for a toolbar item.
 */
export interface ShortcutConfig {
    /** Shortcut key text on Windows/Linux (e.g., 'Ctrl+B') */
    windows?: string[];
    /** Shortcut key text on macOS (e.g., '⌘B') */
    mac?: string[];
}

/**
 * Sub-item used in dropdown and split-button controls.
 *
 * Extends EJ2 ItemModel with editor command metadata.
 */
export interface ToolbarSubItem extends ItemModel {
    /** Command to execute on selection. */
    command?: string;
    /** Optional value to pass to the command. */
    value?: unknown;
    /** class name to render icons. */
    iconCss?: string;
}

/**
 * Configuration metadata for a built-in toolbar item.
 */
export interface ToolbarItemConfig {
    /** Stable ID matching the BuiltInToolbarItem name */
    id: BuiltInToolbarItem | LinkQuickToolbarItem | TableQuickToolbarItem | ImageQuickToolbarItem;
    /** Editor command name to execute when item is clicked */
    command?: string;
    /** Control rendering type */
    controlType: 'button' | 'dropdown' | 'splitButton' | 'colorPicker' | 'template';
    /** Identifies the color picker variant used by the editor. Only applicable when controlType is 'colorPicker'. */
    editorColorPickerType?: 'FontColor' | 'BackgroundColor';
    /** CSS icon class */
    iconCss: string;
    /** Localization key for the tooltip text */
    tooltipKey: string;
    /**
     * Optional nested menu items for dropdown/splitButton controls.
     */
    items?: ToolbarSubItem[];
    /** Optional keyboard shortcut hints */
    shortcuts?: ShortcutConfig;
    /** Specify the rendering way for the dropdown button content */
    renderMode?: string;
}

/**
 * Registry of all built-in toolbar item configurations.
 */
export const TOOLBAR_ITEM_CONFIGS: Readonly<Record<BuiltInToolbarItem, ToolbarItemConfig>> = {
    'Undo': {
        id: 'Undo',
        command: 'undo',
        controlType: 'button',
        iconCss: 'e-icons e-undo',
        tooltipKey: 'Undo',
        shortcuts: { windows: ['Ctrl+Z'], mac: ['⌘ Z'] }
    },
    'Redo': {
        id: 'Redo',
        command: 'redo',
        controlType: 'button',
        iconCss: 'e-icons e-redo',
        tooltipKey: 'Redo',
        shortcuts: { windows: ['Ctrl+Shift+Z'], mac: ['⌘ ⇧ Z'] }
    },
    'Bold': {
        id: 'Bold',
        command: 'bold',
        controlType: 'button',
        iconCss: 'e-icons e-bold',
        tooltipKey: 'Bold',
        shortcuts: { windows: ['Ctrl+B'], mac: ['⌘ B'] }
    },
    'Italic': {
        id: 'Italic',
        command: 'italic',
        controlType: 'button',
        iconCss: 'e-icons e-italic',
        tooltipKey: 'Italic',
        shortcuts: { windows: ['Ctrl+I'], mac: ['⌘ I'] }
    },
    'Underline': {
        id: 'Underline',
        command: 'underline',
        controlType: 'button',
        iconCss: 'e-icons e-underline',
        tooltipKey: 'Underline',
        shortcuts: { windows: ['Ctrl+U'], mac: ['⌘ U'] }
    },
    'Strikethrough': {
        id: 'Strikethrough',
        command: 'strikethrough',
        controlType: 'button',
        iconCss: 'e-icons e-strikethrough',
        tooltipKey: 'Strikethrough',
        shortcuts: { windows: ['Ctrl+Shift+S'], mac: ['⌘ ⇧ S'] }
    },
    'Subscript': {
        id: 'Subscript',
        command: 'subscript',
        controlType: 'button',
        iconCss: 'e-icons e-subscript',
        tooltipKey: 'Subscript',
        shortcuts: { windows: ['Ctrl+='], mac: ['⌘ ='] }
    },
    'Superscript': {
        id: 'Superscript',
        command: 'superscript',
        controlType: 'button',
        iconCss: 'e-icons e-superscript',
        tooltipKey: 'Superscript',
        shortcuts: { windows: ['Ctrl+Shift+='], mac: ['⌘ ⇧ ='] }
    },
    'UpperCase': {
        id: 'UpperCase',
        command: 'uppercase',
        controlType: 'button',
        iconCss: 'e-icons e-upper-case',
        tooltipKey: 'uppercase',
        shortcuts: { windows: ['Ctrl+Shift+U'], mac: ['⌘ ⇧ U'] }
    },
    'LowerCase': {
        id: 'LowerCase',
        command: 'lowercase',
        controlType: 'button',
        iconCss: 'e-icons e-lower-case',
        tooltipKey: 'lowercase',
        shortcuts: { windows: ['Ctrl+Shift+L'], mac: ['⌘ ⇧ L'] }
    },
    'HorizontalLine': {
        id: 'HorizontalLine',
        command: 'horizontalRule',
        controlType: 'button',
        iconCss: 'e-horizontal-line',
        tooltipKey: 'horizontalline'
    },
    'InlineCode': {
        id: 'InlineCode',
        command: 'inlineCode',
        controlType: 'button',
        iconCss: 'e-icons e-insert-code',
        tooltipKey: 'InlineCode',
        shortcuts: { windows: ['Ctrl+E'], mac: ['⌘ E'] }
    },
    'Formats': {
        id: 'Formats',
        command: 'formats',
        controlType: 'dropdown',
        iconCss: 'e-icons e-paragraph',
        tooltipKey: 'Formats',
        renderMode: 'textContent',
        items: [
            { cssClass: 'e-paragraph', id: 'Paragraph', text: 'Paragraph', command: 'paragraph' },
            { cssClass: 'e-h1', id: 'Heading 1', text: 'Heading 1', command: 'heading1' },
            { cssClass: 'e-h2', id: 'Heading 2', text: 'Heading 2', command: 'heading2' },
            { cssClass: 'e-h3', id: 'Heading 3', text: 'Heading 3', command: 'heading3' },
            { cssClass: 'e-h4', id: 'Heading 4', text: 'Heading 4', command: 'heading4' }
        ]
    },
    'FontSize': {
        id: 'FontSize',
        command: 'fontSize',
        controlType: 'dropdown',
        iconCss: 'e-icons e-font-size',
        tooltipKey: 'FontSize',
        renderMode: 'customContent',
        items: [
            { id: 'Default', text: 'Default', command: 'setFontSize', value: {size: 'Default'}},
            { id: '8', text: '8', command: 'setFontSize', value: { size: '8px' } },
            { id: '10', text: '10', command: 'setFontSize', value: { size: '10px' } },
            { id: '12', text: '12', command: 'setFontSize', value: { size: '12px' } },
            { id: '14', text: '14', command: 'setFontSize', value: { size: '14px' } },
            { id: '16', text: '16', command: 'setFontSize', value: { size: '16px' } },
            { id: '18', text: '18', command: 'setFontSize', value: { size: '18px' } },
            { id: '24', text: '24', command: 'setFontSize', value: { size: '24px' } }
        ]
    },
    'FontColor': {
        id: 'FontColor',
        command: 'fontColor',
        controlType: 'colorPicker',
        editorColorPickerType: 'FontColor',
        iconCss: 'e-icons e-font-name',
        tooltipKey: 'FontColor'
    },
    'BackgroundColor': {
        id: 'BackgroundColor',
        command: 'backgroundColor',
        controlType: 'colorPicker',
        editorColorPickerType: 'BackgroundColor',
        iconCss: 'e-icons e-paint-bucket',
        tooltipKey: 'BackgroundColor'
    },
    'FontName': {
        id: 'FontName',
        command: 'fontName',
        controlType: 'dropdown',
        iconCss: 'e-icons e-font',
        tooltipKey: 'FontName',
        renderMode: 'customContent',
        items: [
            { cssClass: 'e-default', id: 'Default', text: 'Default', command: 'setFontFamily', value: {family: 'Default'}},
            { cssClass: 'e-arial', id: 'Arial', text: 'Arial', command: 'setFontFamily', value: { family: 'Arial' } },
            { cssClass: 'e-helvetica', id: 'Helvetica', text: 'Helvetica', command: 'setFontFamily', value: { family: 'Helvetica' } },
            { cssClass: 'e-times-new-roman', id: 'Times New Roman', text: 'Times New Roman', command: 'setFontFamily', value: { family: 'Times New Roman' } },
            { cssClass: 'e-courier-new', id: 'Courier New', text: 'Courier New', command: 'setFontFamily', value: { family: 'Courier New' } }
        ]
    },
    'BulletList': {
        id: 'BulletList',
        command: 'bulletList',
        controlType: 'button',
        iconCss: 'e-icons e-list-unordered',
        tooltipKey: 'BulletList'
    },
    'NumberedList': {
        id: 'NumberedList',
        command: 'numberedList',
        controlType: 'button',
        iconCss: 'e-icons e-list-ordered',
        tooltipKey: 'NumberedList'
    },
    'NumberFormatList': {
        id: 'NumberFormatList',
        command: 'numberedList',
        controlType: 'splitButton',
        iconCss: 'e-icons e-list-ordered',
        tooltipKey: 'NumberFormatList',
        shortcuts: { windows: ['Ctrl+Shift+O'], mac: ['⌘ ⇧ O'] },
        renderMode: 'iconContent',
        items: [
            { id: 'NumberDecimal',    text: 'Number',      command: 'setListStyle', value: { listType: 'decimal' } },
            { id: 'NumberLowerGreek', text: 'Lower Greek', command: 'setListStyle', value: { listType: 'lowerGreek' } },
            { id: 'NumberLowerRoman', text: 'Lower Roman', command: 'setListStyle', value: { listType: 'lowerRoman' } },
            { id: 'NumberUpperAlpha', text: 'Upper Alpha', command: 'setListStyle', value: { listType: 'upperAlpha' } },
            { id: 'NumberLowerAlpha', text: 'Lower Alpha', command: 'setListStyle', value: { listType: 'lowerAlpha' } },
            { id: 'NumberUpperRoman', text: 'Upper Roman', command: 'setListStyle', value: { listType: 'upperRoman' } }
        ]
    },
    'BulletFormatList': {
        id: 'BulletFormatList',
        command: 'bulletList',
        controlType: 'splitButton',
        iconCss: 'e-icons e-list-unordered',
        tooltipKey: 'BulletFormatList',
        shortcuts: { windows: ['Ctrl+Alt+O'], mac: ['⌘ ⌥ O'] },
        renderMode: 'iconContent',
        items: [
            { id: 'BulletDisc',   text: 'Disc',   command: 'setListStyle', value: { listType: 'disc' } },
            { id: 'BulletCircle', text: 'Circle', command: 'setListStyle', value: { listType: 'circle' } },
            { id: 'BulletSquare', text: 'Square', command: 'setListStyle', value: { listType: 'square' } }
        ]
    },
    'Alignment': {
        id: 'Alignment',
        command: 'alignment',
        controlType: 'dropdown',
        iconCss: 'e-icons e-align-left',
        tooltipKey: 'Alignment',
        renderMode: 'iconContent',
        items: [
            { id: 'AlignLeft', text: 'Left', command: 'setTextAlign', value: { align: 'left' }, iconCss: 'e-icons e-align-left' },
            { id: 'AlignCenter', text: 'Center', command: 'setTextAlign', value: { align: 'center' }, iconCss: 'e-icons e-align-center' },
            { id: 'AlignRight', text: 'Right', command: 'setTextAlign', value: { align: 'right' }, iconCss: 'e-icons e-align-right' },
            { id: 'AlignJustify', text: 'Justify', command: 'setTextAlign', value: { align: 'justify' }, iconCss: 'e-icons e-justify' }
        ]
    },
    'Quote': {
        id: 'Quote',
        command: 'blockQuote',
        controlType: 'button',
        iconCss: 'e-icons e-blockquote ',
        tooltipKey: 'Blockquote'
    },
    'CodeBlock': {
        id: 'CodeBlock',
        command: 'codeBlock',
        controlType: 'button',
        iconCss: 'e-icons e-code-block e-preformat-code',
        tooltipKey: 'CodeBlock',
        shortcuts: { windows: ['Ctrl+Shift+B'], mac: ['⌘ ⇧ B'] }
    },
    'Link': {
        id: 'Link',
        command: 'createLink',
        controlType: 'button',
        iconCss: 'e-icons e-link',
        tooltipKey: 'Link',
        shortcuts: { windows: ['Ctrl+K'], mac: ['⌘K'] }
    },
    'Image': {
        id: 'Image',
        command: 'image',
        controlType: 'button',
        iconCss: 'e-icons e-image',
        tooltipKey: 'Image',
        shortcuts: { windows: ['Ctrl+Shift+I'], mac: ['⌘ ⇧ I'] }
    },
    'Table': {
        id: 'Table',
        command: 'table',
        controlType: 'button',
        iconCss: 'e-icons e-table e-create-table',
        tooltipKey: 'Table',
        shortcuts: { windows: ['Ctrl+Shift+E'], mac: ['⌘ ⇧ E'] }
    },
    'ClearFormat': {
        id: 'ClearFormat',
        command: 'clearFormat',
        controlType: 'button',
        iconCss: 'e-icons e-clear-format',
        tooltipKey: 'ClearFormat',
        shortcuts: { windows: ['Ctrl+Shift+R'], mac: ['⌘ ⇧ R'] }
    },
    'Heading 1': {
        id: 'Heading 1',
        command: 'heading1',
        controlType: 'button',
        iconCss: 'e-icons e-h1',
        tooltipKey: 'Heading1'
    },
    'Heading 2': {
        id: 'Heading 2',
        command: 'heading2',
        controlType: 'button',
        iconCss: 'e-icons e-h2',
        tooltipKey: 'Heading2'
    },
    'Heading 3': {
        id: 'Heading 3',
        command: 'heading3',
        controlType: 'button',
        iconCss: 'e-icons e-h3',
        tooltipKey: 'Heading3'
    },
    'Heading 4': {
        id: 'Heading 4',
        command: 'heading4',
        controlType: 'button',
        iconCss: 'e-icons e-h4',
        tooltipKey: 'Heading4'
    },
    'Paragraph': {
        id: 'Paragraph',
        command: 'paragraph',
        controlType: 'button',
        iconCss: 'e-icons e-paragraph',
        tooltipKey: 'Paragraph'
    },
    'Indent': {
        id: 'Indent',
        command: 'indent',
        controlType: 'button',
        iconCss: 'e-icons e-indent',
        tooltipKey: 'Indent'
    },
    'Outdent': {
        id: 'Outdent',
        command: 'outdent',
        controlType: 'button',
        iconCss: 'e-icons e-outdent',
        tooltipKey: 'Outdent'
    },
    'AlignLeft': {
        id: 'AlignLeft',
        command: 'alignLeft',
        controlType: 'button',
        iconCss: 'e-icons e-align-left',
        tooltipKey: 'AlignLeft'
    },
    'AlignCenter': {
        id: 'AlignCenter',
        command: 'alignCenter',
        controlType: 'button',
        iconCss: 'e-icons e-align-center',
        tooltipKey: 'AlignCenter'
    },
    'AlignRight': {
        id: 'AlignRight',
        command: 'alignRight',
        controlType: 'button',
        iconCss: 'e-icons e-align-right',
        tooltipKey: 'AlignRight'
    },
    'AlignJustify': {
        id: 'AlignJustify',
        command: 'alignJustify',
        controlType: 'button',
        iconCss: 'e-icons e-align-justify',
        tooltipKey: 'AlignJustify'
    }
};

/**
 * Returns the configuration for a built-in toolbar item.
 *
 * @param {BuiltInToolbarItem} id - The built-in toolbar item name
 * @returns {ToolbarItemConfig} The item configuration
 */
export function getToolbarItemConfig(id: BuiltInToolbarItem): ToolbarItemConfig {
    return TOOLBAR_ITEM_CONFIGS[id as BuiltInToolbarItem];
}


export type LinkToolbarItem = Exclude<LinkQuickToolbarItem, '|'>;

export interface LinkToolbarItemConfig extends Omit<ToolbarItemConfig, 'id'> {
    id: LinkToolbarItem;
}

export const LINK_TOOLBAR_ITEM_CONFIGS: Readonly<
Record<LinkToolbarItem, LinkToolbarItemConfig>
> = {
    OpenLink: {
        id: 'OpenLink',
        command: 'openLink',
        controlType: 'button',
        iconCss: 'e-icons e-open-link',
        tooltipKey: 'OpenLink'
    },
    CopyLink: {
        id: 'CopyLink',
        command: 'copyLink',
        controlType: 'button',
        iconCss: 'e-icons e-copy',
        tooltipKey: 'CopyLink'
    },
    EditLink: {
        id: 'EditLink',
        command: 'editLink',
        controlType: 'button',
        iconCss: 'e-icons e-edit',
        tooltipKey: 'EditLink'
    },
    RemoveLink: {
        id: 'RemoveLink',
        command: 'removeLink',
        controlType: 'button',
        iconCss: 'e-icons e-remove-link',
        tooltipKey: 'RemoveLink'
    }
};

/**
 * @param id
 */
export function getLinkToolbarItemConfig(
    id: LinkToolbarItem
): LinkToolbarItemConfig {
    return LINK_TOOLBAR_ITEM_CONFIGS[id];
}

export type TableToolbarItem = Exclude<TableQuickToolbarItem, '|'>;

export interface TableToolbarItemConfig extends Omit<ToolbarItemConfig, 'id'> {
    id: TableToolbarItem;
}

export const TABLE_TOOLBAR_ITEM_CONFIGS: Readonly<
Record<TableToolbarItem, TableToolbarItemConfig>
> = {
    Row: {
        id: 'Row',
        command: 'tableRow',
        controlType: 'dropdown',
        iconCss: 'e-icons e-table-rows',
        tooltipKey: 'tableRows',
        renderMode: 'iconContent',
        items: [
            {
                id: 'InsertRowBefore',
                text: 'Insert row before',
                command: 'insertRowBefore',
                iconCss: 'e-icons e-insert-row-before'
            },
            {
                id: 'InsertRowAfter',
                text: 'Insert row after',
                command: 'insertRowAfter',
                iconCss: 'e-icons e-insert-row-after'
            },
            {
                id: 'DeleteRow',
                text: 'Delete row',
                command: 'deleteRow',
                iconCss: 'e-icons e-delete-row'
            }
        ]
    },

    Column: {
        id: 'Column',
        command: 'tableColumn',
        controlType: 'dropdown',
        iconCss: 'e-icons e-table-columns',
        tooltipKey: 'tableColumns',
        renderMode: 'iconContent',
        items: [
            {
                id: 'InsertColumnLeft',
                text: 'Insert column left',
                command: 'insertColumnBefore',
                iconCss: 'e-icons e-insert-column-left'
            },
            {
                id: 'InsertColumnRight',
                text: 'Insert column right',
                command: 'insertColumnAfter',
                iconCss: 'e-icons e-insert-column-right'
            },
            {
                id: 'DeleteColumn',
                text: 'Delete column',
                command: 'deleteColumn',
                iconCss: 'e-icons e-delete-column'
            }
        ]
    },

    Header: {
        id: 'Header',
        command: 'toggleHeaderRow',
        controlType: 'button',
        iconCss: 'e-icons e-table-header',
        tooltipKey: 'header'
    },

    CellBackgroundColor: {
        id: 'CellBackgroundColor',
        command: 'tableCellBackground',
        controlType: 'colorPicker',
        editorColorPickerType: 'BackgroundColor',
        iconCss: 'e-icons e-paint-bucket',
        tooltipKey: 'tableCellBackground'
    },

    VerticalAlign: {
        id: 'VerticalAlign',
        command: 'tableCellVerticalAlign',
        controlType: 'dropdown',
        iconCss: 'e-icons e-align-middle',
        tooltipKey: 'tableCellVerticalAlign',
        renderMode: 'iconContent',
        items: [
            {
                id: 'AlignTop',
                text: 'Align Top',
                command: 'setTableCellVerticalAlign',
                value: { attribute: 'verticalAlign', value: 'top' },
                iconCss: 'e-icons e-align-top'
            },
            {
                id: 'AlignMiddle',
                text: 'Align Middle',
                command: 'setTableCellVerticalAlign',
                value: { attribute: 'verticalAlign', value: 'middle' },
                iconCss: 'e-icons e-align-middle'
            },
            {
                id: 'AlignBottom',
                text: 'Align Bottom',
                command: 'setTableCellVerticalAlign',
                value: { attribute: 'verticalAlign', value: 'bottom' },
                iconCss: 'e-icons e-align-bottom'
            }
        ]
    },

    Align: {
        id: 'Align',
        command: 'tableCellHorizontalAlign',
        controlType: 'dropdown',
        iconCss: 'e-icons e-align-left',
        tooltipKey: 'tableCellHorizontalAlign',
        renderMode: 'iconContent',
        items: [
            {
                id: 'AlignLeft',
                text: 'Align Left',
                command: 'setTableCellHorizontalAlign',
                value: { attribute: 'align', value: 'left' },
                iconCss: 'e-icons e-align-left'
            },
            {
                id: 'AlignCenter',
                text: 'Align Center',
                command: 'setTableCellHorizontalAlign',
                value: { attribute: 'align', value: 'center' },
                iconCss: 'e-icons e-align-center'
            },
            {
                id: 'AlignRight',
                text: 'Align Right',
                command: 'setTableCellHorizontalAlign',
                value: { attribute: 'align', value: 'right' },
                iconCss: 'e-icons e-align-right'
            },
            {
                id: 'AlignJustify',
                text: 'Align Justify',
                command: 'setTableCellHorizontalAlign',
                value: { attribute: 'align', value: 'justify' },
                iconCss: 'e-icons e-justify'
            }
        ]
    },

    Delete: {
        id: 'Delete',
        command: 'deleteTable',
        controlType: 'button',
        iconCss: 'e-icons e-table-remove',
        tooltipKey: 'delete'
    }
};

/**
 * @param id
 */
export function getTableToolbarItemConfig(
    id: TableToolbarItem
): TableToolbarItemConfig {
    return TABLE_TOOLBAR_ITEM_CONFIGS[id];
}

export type ImageToolbarItem = Exclude<ImageQuickToolbarItem, '|'>;

export interface ImageToolbarItemConfig extends Omit<ToolbarItemConfig, 'id'> {
    id: ImageToolbarItem;
}

export const IMAGE_TOOLBAR_ITEM_CONFIGS: Readonly<
Record<ImageToolbarItem, ImageToolbarItemConfig>
> = {
    AltText: {
        id: 'AltText',
        command: 'altText',
        controlType: 'button',
        iconCss: 'e-icons e-caption',
        tooltipKey: 'alternativeText'
    },
    Caption: {
        id: 'Caption',
        command: 'caption',
        controlType: 'button',
        iconCss: 'e-icons e-alt-text',
        tooltipKey: 'imageCaption'
    },
    Align: {
        id: 'Align',
        command: 'alignImage',
        controlType: 'dropdown',
        iconCss: 'e-icons e-align',
        tooltipKey: 'align',
        renderMode: 'iconContent',
        items: [
            {
                id: 'JustifyLeft',
                text: 'Align Left',
                command: 'setAlignImage',
                value: { attribute: 'alignImage', value: 'left' },
                iconCss: 'e-icons e-justify-left'
            },
            {
                id: 'JustifyCenter',
                text: 'Align Center',
                command: 'setAlignImage',
                value: { attribute: 'alignImage', value: 'center' },
                iconCss: 'e-icons e-justify-center'
            },
            {
                id: 'JustifyRight',
                text: 'Align Right',
                command: 'setAlignImage',
                value: { attribute: 'alignImage', value: 'right' },
                iconCss: 'e-icons e-justify-right'
            }
        ]
    },

    Display: {
        id: 'Display',
        command: 'displayImage',
        controlType: 'dropdown',
        iconCss: 'e-icons e-display',
        tooltipKey: 'display',
        renderMode: 'iconContent',
        items: [
            {
                id: 'Inline',
                text: 'Inline',
                command: 'inlineImage'
            },
            {
                id: 'Break',
                text: 'Break',
                command: 'breakImage'
            }
        ]
    },

    WrapText: {
        id: 'WrapText',
        command: 'wrapTextImage',
        controlType: 'dropdown',
        iconCss: 'e-icons e-left-wrap',
        tooltipKey: 'wrapText',
        renderMode: 'iconContent',
        items: [
            {
                id: 'Leftwrap',
                text: 'Wrap Left',
                command: 'setWrapTextImage',
                value: { attribute: 'wrapTextImage', value: 'left' },
                iconCss: 'e-icons e-left-wrap'
            },
            {
                id: 'Rightwrap',
                text: 'Wrap Right',
                command: 'setWrapTextImage',
                value: { attribute: 'wrapTextImage', value: 'right' },
                iconCss: 'e-icons e-right-wrap'
            }
        ]
    },

    Dimension: {
        id: 'Dimension',
        command: 'dimensionImage',
        controlType: 'button',
        iconCss: 'e-icons e-img-dimension',
        tooltipKey: 'changeSize'
    },

    Replace: {
        id: 'Replace',
        command: 'replaceImage',
        controlType: 'button',
        iconCss: 'e-icons e-replace',
        tooltipKey: 'replace'
    },

    Remove: {
        id: 'Remove',
        command: 'removeImage',
        controlType: 'button',
        iconCss: 'e-icons e-remove',
        tooltipKey: 'remove'
    }
};

/**
 * @param id
 */
export function getImageToolbarItemConfig(
    id: ImageToolbarItem
): ImageToolbarItemConfig {
    return IMAGE_TOOLBAR_ITEM_CONFIGS[id];
}

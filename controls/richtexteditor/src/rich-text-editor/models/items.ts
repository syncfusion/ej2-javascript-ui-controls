/* eslint-disable */
/**
 * Export items model
 */

import { IRichTextEditor } from '../base/interface';
import { TableStyleItems } from '../../models/items';
import { IToolsItems, IDropDownItemModel } from '../../common/interface';

export let templateItems: string[] = ['alignments', 'formats', 'fontname', 'fontsize', 'fontcolor', 'backgroundcolor', 'align', 'display', 'audiolayoutoption', 'videolayoutoption', 'videoalign', 'tablerows', 'tablecolumns', 'tablecell', 'tablecellhorizontalalign', 'tablecellverticalalign', 'styles', 'numberformatlist', 'bulletformatlist', 'codeblock', 'borderstyle', 'bordercolor', 'tablebackgroundcolor'];

export let tools: { [key: string]: IToolsItems } = {
    'alignments': {
        'id': 'Alignments',
        'icon': 'e-alignments',
        'tooltip': 'Alignments',
        'command': 'Alignments',
        'subCommand': 'Alignments'
    },
    'justifyleft': {
        'id': 'JustifyLeft',
        'icon': 'e-justify-left',
        'tooltip': 'JustifyLeft',
        'command': 'Alignments',
        'subCommand': 'JustifyLeft'
    },
    'justifycenter': {
        'id': 'JustifyCenter',
        'icon': 'e-justify-center',
        'tooltip': 'JustifyCenter',
        'command': 'Alignments',
        'subCommand': 'JustifyCenter'
    },
    'justifyright': {
        'id': 'JustifyRight',
        'icon': 'e-justify-right',
        'tooltip': 'JustifyRight',
        'command': 'Alignments',
        'subCommand': 'JustifyRight'
    },
    'justifyfull': {
        'id': 'JustifyFull',
        'icon': 'e-justify-full',
        'tooltip': 'JustifyFull',
        'command': 'Alignments',
        'subCommand': 'JustifyFull'
    },
    'fontname': {
        'id': 'FontName',
        'icon': 'e-font-name',
        'tooltip': 'Font Name',
        'command': 'Font',
        'subCommand': 'FontName'
    },
    'fontsize': {
        'id': 'FontSize',
        'icon': 'e-font-size',
        'tooltip': 'Font Size',
        'command': 'Font',
        'subCommand': 'FontSize'
    },
    'fontcolor': {
        'id': 'FontColor',
        'icon': 'e-rte-font-color',
        'tooltip': 'Font Color',
        'command': 'Font',
        'subCommand': 'FontColor',
        'value': '#ff0000ff'
    },
    'backgroundcolor': {
        'id': 'BackgroundColor',
        'icon': 'e-background-color',
        'tooltip': 'Background Color',
        'command': 'Font',
        'subCommand': 'BackgroundColor',
        'value': '#ffff00ff'
    },
    'importword': {
        'id': 'ImportWord',
        'icon': 'e-rte-import-doc',
        'tooltip': 'Import from Word',
        'command': 'Import',
        'subCommand': 'ImportWord'
    },
    'exportword': {
        'id': 'ExportWord',
        'icon': 'e-rte-export-doc',
        'tooltip': 'Export to Word',
        'command': 'Export',
        'subCommand': 'ExportWord'
    },
    'exportpdf': {
        'id': 'ExportPdf',
        'icon': 'e-rte-export-pdf',
        'tooltip': 'Export to PDF',
        'command': 'Export',
        'subCommand': 'ExportPdf'
    },
    'bold': {
        'id': 'Bold',
        'icon': 'e-bold',
        'tooltip': 'Bold',
        'command': 'Style',
        'subCommand': 'Bold'
    },
    'italic': {
        'id': 'Italic',
        'icon': 'e-italic',
        'tooltip': 'Italic',
        'command': 'Style',
        'subCommand': 'Italic'
    },
    'underline': {
        'id': 'Underline',
        'icon': 'e-underline',
        'tooltip': 'Underline',
        'command': 'Style',
        'subCommand': 'Underline'
    },
    'strikethrough': {
        'id': 'StrikeThrough',
        'icon': 'e-strike-through',
        'tooltip': 'StrikeThrough',
        'command': 'Style',
        'subCommand': 'StrikeThrough'
    },
    'clearformat': {
        'id': 'ClearFormat',
        'icon': 'e-clear-format',
        'tooltip': 'Clear Format',
        'command': 'Clear',
        'subCommand': 'ClearFormat'
    },
    'clearall': {
        'id': 'ClearAll',
        'icon': 'e-clear-all',
        'tooltip': 'Clear All',
        'command': 'Clear',
        'subCommand': 'ClearAll'
    },
    'cut': {
        'id': 'Cut',
        'icon': 'e-cut',
        'tooltip': 'Cut',
        'command': 'ClipBoard',
        'subCommand': 'Cut'
    },
    'copy': {
        'id': 'Copy',
        'icon': 'e-copy',
        'tooltip': 'Copy',
        'command': 'ClipBoard',
        'subCommand': 'Copy'
    },
    'paste': {
        'id': 'Paste',
        'icon': 'e-paste',
        'tooltip': 'Paste',
        'command': 'ClipBoard',
        'subCommand': 'Paste'
    },
    'unorderedlist': {
        'id': 'UnorderedList',
        'icon': 'e-unorder-list',
        'tooltip': 'Bulleted List',
        'command': 'Lists',
        'subCommand': 'UL'
    },
    'orderedlist': {
        'id': 'OrderedList',
        'icon': 'e-order-list',
        'tooltip': 'Numbered List',
        'command': 'Lists',
        'subCommand': 'OL'
    },
    'numberformatlist': {
        'id': 'NumberFormatList',
        'icon': 'e-order-list',
        'tooltip': 'Number Format List',
        'command': 'NumberFormatList',
        'subCommand': 'NumberFormatList'
    },
    'bulletformatlist': {
        'id': 'BulletFormatList',
        'icon': 'e-unorder-list',
        'tooltip': 'Bullet Format List',
        'command': 'BulletFormatList',
        'subCommand': 'BulletFormatList'
    },
    'indent': {
        'id': 'Indent',
        'icon': 'e-indent',
        'tooltip': 'Increase Indent',
        'command': 'Indents',
        'subCommand': 'Indent'
    },
    'outdent': {
        'id': 'Outdent',
        'icon': 'e-outdent',
        'tooltip': 'Decrease Indent',
        'command': 'Indents',
        'subCommand': 'Outdent'
    },
    'undo': {
        'id': 'Undo',
        'icon': 'e-undo',
        'tooltip': 'Undo',
        'command': 'Actions',
        'subCommand': 'Undo'
    },
    'redo': {
        'id': 'Redo',
        'icon': 'e-redo',
        'tooltip': 'Redo',
        'command': 'Actions',
        'subCommand': 'Redo'
    },
    'superscript': {
        'id': 'SuperScript',
        'icon': 'e-super-script',
        'tooltip': 'Superscript',
        'command': 'Effects',
        'subCommand': 'SuperScript'
    },
    'subscript': {
        'id': 'SubScript',
        'icon': 'e-sub-script',
        'tooltip': 'Subscript',
        'command': 'Effects',
        'subCommand': 'SubScript'
    },
    'createlink': {
        'id': 'CreateLink',
        'icon': 'e-create-link',
        'tooltip': 'Insert Hyperlink',
        'command': 'Links',
        'subCommand': 'CreateLink'
    },
    'openlink': {
        'id': 'OpenLink',
        'icon': 'e-open-link',
        'tooltip': 'Open Link',
        'command': 'Links',
        'subCommand': 'OpenLink'
    },
    'editlink': {
        'id': 'EditLink',
        'icon': 'e-edit-link',
        'tooltip': 'Edit Link',
        'command': 'Links',
        'subCommand': 'EditLink'
    },
    'removelink': {
        'id': 'RemoveLink',
        'icon': 'e-remove-link',
        'tooltip': 'Remove Link',
        'command': 'Links',
        'subCommand': 'RemoveLink'
    },
    'image': {
        'id': 'Image',
        'icon': 'e-image',
        'tooltip': 'Insert Image',
        'command': 'Images',
        'subCommand': 'Image'
    },
    'audio': {
        'id': 'Audio',
        'icon': 'e-audio',
        'tooltip': 'Insert Audio',
        'command': 'Audios',
        'subCommand': 'Audio'
    },
    'video': {
        'id': 'Video',
        'icon': 'e-video',
        'tooltip': 'Insert Video',
        'command': 'Videos',
        'subCommand': 'Video'
    },
    'filemanager': {
        'id': 'FileManager',
        'icon': 'e-rte-file-manager',
        'tooltip': 'File Manager',
        'command': 'Files',
        'subCommand': 'File'
    },
    'createtable': {
        'id': 'CreateTable',
        'icon': 'e-create-table',
        'tooltip': 'Create Table',
        'command': 'Table',
        'subCommand': 'CreateTable'
    },
    'removetable': {
        'id': 'removeTable',
        'icon': 'e-remove-table',
        'tooltip': 'Remove Table',
        'command': 'removeTable',
        'subCommand': 'removeTable'
    },
    'replace': {
        'id': 'Replace',
        'icon': 'e-replace',
        'tooltip': 'Replace',
        'command': 'Images',
        'subCommand': 'Replace'
    },
    'audioreplace': {
        'id': 'AudioReplace',
        'icon': 'e-audio-replace',
        'tooltip': 'Audio Replace',
        'command': 'Audios',
        'subCommand': 'AudioReplace'
    },
    'audioremove': {
        'id': 'AudioRemove',
        'icon': 'e-audio-remove',
        'tooltip': 'Audio Remove',
        'command': 'Audios',
        'subCommand': 'AudioRemove'
    },
    'audiolayoutoption': {
        'id': 'AudioLayoutOption',
        'icon': 'e-audio-display',
        'tooltip': 'Audio LayoutOption',
        'command': 'Audios',
        'subCommand': 'AudioLayoutOption'
    },
    'videoreplace': {
        'id': 'VideoReplace',
        'icon': 'e-video-replace',
        'tooltip': 'Video Replace',
        'command': 'Videos',
        'subCommand': 'VideoReplace'
    },
    'videoalign': {
        'id': 'VideoAlign',
        'icon': 'e-video-align',
        'tooltip': 'Video Align',
        'command': 'Videos',
        'subCommand': 'VideoAlign'
    },
    'videoremove': {
        'id': 'VideoRemove',
        'icon': 'e-video-remove',
        'tooltip': 'Video Remove',
        'command': 'Videos',
        'subCommand': 'VideoRemove'
    },
    'videolayoutoption': {
        'id': 'VideoLayoutOption',
        'icon': 'e-video-display',
        'tooltip': 'Video LayoutOption',
        'command': 'Videos',
        'subCommand': 'VideoLayoutOption'
    },
    'videodimension': {
        'id': 'VideoDimension',
        'icon': 'e-video-dimension',
        'tooltip': 'Video Dimension',
        'command': 'Videos',
        'subCommand': 'VideoDimension'
    },
    'align': {
        'id': 'Align',
        'icon': 'e-align',
        'tooltip': 'Align',
        'command': 'Images',
        'subCommand': 'Align'
    },
    'caption': {
        'id': 'Caption',
        'icon': 'e-caption',
        'tooltip': 'Image Caption',
        'command': 'Images',
        'subCommand': 'Caption'
    },
    'remove': {
        'id': 'Remove',
        'icon': 'e-remove',
        'tooltip': 'Remove',
        'command': 'Images',
        'subCommand': 'Remove'
    },
    'openimagelink': {
        'id': 'OpenImageLink',
        'icon': 'e-open-link',
        'tooltip': 'Open Link',
        'command': 'Images',
        'subCommand': 'OpenImageLink'
    },
    'editimagelink': {
        'id': 'EditImageLink',
        'icon': 'e-edit-link',
        'tooltip': 'Edit Link',
        'command': 'Images',
        'subCommand': 'EditImageLink'
    },
    'removeimagelink': {
        'id': 'RemoveImageLink',
        'icon': 'e-remove-link',
        'tooltip': 'Remove Link',
        'command': 'Images',
        'subCommand': 'RemoveImageLink'
    },
    'insertlink': {
        'id': 'InsertLink',
        'icon': 'e-insert-link',
        'tooltip': 'Insert Link',
        'command': 'Images',
        'subCommand': 'InsertLink'
    },
    'display': {
        'id': 'Display',
        'icon': 'e-display',
        'tooltip': 'Display',
        'command': 'Images',
        'subCommand': 'Display'
    },
    'alttext': {
        'id': 'AltText',
        'icon': 'e-alt-text',
        'tooltip': 'Alternative Text',
        'command': 'Images',
        'subCommand': 'AltText'
    },
    'dimension': {
        'id': 'Dimension',
        'icon': 'e-img-dimension',
        'tooltip': 'Change Size',
        'command': 'Images',
        'subCommand': 'Dimension'
    },
    'fullscreen': {
        'id': 'Maximize',
        'icon': 'e-maximize',
        'tooltip': 'Maximize',
        'command': 'View',
        'subCommand': 'Maximize'
    },
    'maximize': {
        'id': 'Maximize',
        'icon': 'e-maximize',
        'tooltip': 'Maximize',
        'command': 'FullScreen',
        'subCommand': 'Maximize'
    },
    'minimize': {
        'id': 'Minimize',
        'icon': 'e-minimize',
        'tooltip': 'Minimize',
        'command': 'FullScreen',
        'subCommand': 'Minimize'
    },
    'lowercase': {
        'id': 'LowerCase',
        'icon': 'e-lower-case',
        'tooltip': 'Lower Case',
        'command': 'Casing',
        'subCommand': 'LowerCase'
    },
    'uppercase': {
        'id': 'UpperCase',
        'icon': 'e-upper-case',
        'tooltip': 'Upper Case',
        'command': 'Casing',
        'subCommand': 'UpperCase'
    },
    'print': {
        'id': 'Print',
        'icon': 'e-print',
        'tooltip': 'Print',
        'command': 'Print',
        'subCommand': 'Print'
    },
    'formats': {
        'id': 'Formats',
        'icon': 'e-formats',
        'tooltip': 'Formats',
        'command': 'Formats',
        'subCommand': 'Formats'
    },
    'sourcecode': {
        'id': 'SourceCode',
        'icon': 'e-source-code',
        'tooltip': 'Code View (Ctrl+Shift+H)',
        'command': 'SourceCode',
        'subCommand': 'SourceCode'
    },
    'preview': {
        'id': 'Preview',
        'icon': 'e-preview',
        'tooltip': 'Preview (Ctrl+Shift+H)',
        'command': 'Preview',
        'subCommand': 'Preview'
    },
    'viewside': {
        'id': 'ViewSide',
        'icon': 'e-view-side',
        'tooltip': 'ViewSide',
        'command': 'ViewSide',
        'subCommand': 'ViewSide'
    },
    'insertcode': {
        'id': 'InsertCode',
        'icon': 'e-preformat-code',
        'tooltip': 'Insert Code',
        'command': 'Formats',
        'subCommand': 'Pre'
    },
    'blockquote': {
        'id': 'Blockquote',
        'icon': 'e-blockquote',
        'tooltip': 'Blockquote',
        'command': 'Formats',
        'subCommand': 'blockquote'
    },
    'tableheader': {
        'id': 'TableHeader',
        'icon': 'e-table-header',
        'tooltip': 'Table Header',
        'command': 'Table',
        'subCommand': 'TableHeader'
    },
    'tableremove': {
        'id': 'TableRemove',
        'icon': 'e-table-remove',
        'tooltip': 'Table Remove',
        'command': 'Table',
        'subCommand': 'TableRemove'
    },
    'tablerows': {
        'id': 'TableRows',
        'icon': 'e-table-rows',
        'tooltip': 'Table Rows',
        'command': 'Table',
        'subCommand': 'TableRows'
    },
    'tablecolumns': {
        'id': 'TableColumns',
        'icon': 'e-table-columns',
        'tooltip': 'Table Columns',
        'command': 'Table',
        'subCommand': 'TableColumns'
    },
    'tablecell': {
        'id': 'TableCell',
        'icon': 'e-table-cell',
        'tooltip': 'Table Cell',
        'command': 'Table',
        'subCommand': 'TableCell'
    },
    'tablecellbackground': {
        'id': 'TableCellBackground',
        'icon': 'e-table-cell-background',
        'tooltip': 'Table Cell Background',
        'command': 'Table',
        'subCommand': 'TableCellBackground'
    },
    'tablecellhorizontalalign': {
        'id': 'TableCellHorizontalAlign',
        'icon': 'e-table-cell-horizontalAlign',
        'tooltip': 'Table Cell HorizontalAlign',
        'command': 'Table',
        'subCommand': 'TableCellHorizontalAlign'
    },
    'tablecellverticalalign': {
        'id': 'TableCellVerticalAlign',
        'icon': 'e-table-cell-verticalAlign',
        'tooltip': 'Table Cell VerticalAlign',
        'command': 'Table',
        'subCommand': 'TableCellVerticalAlign'
    },
    'tableeditproperties': {
        'id': 'TableEditProperties',
        'icon': 'e-table-edit-properties',
        'tooltip': 'Table Edit Properties',
        'command': 'Table',
        'subCommand': 'TableEditProperties'
    },
    'styles': {
        'id': 'Styles',
        'icon': 'e-table-styles',
        'tooltip': 'Styles',
        'command': 'Table',
        'subCommand': 'Styles'
    },
    'formatpainter': {
        'id': 'FormatPainter',
        'icon': 'e-rte-format-painter',
        'tooltip': 'Format Painter',
        'command': 'FormatPainter',
        'subCommand': 'FormatPainter'
    },
    'emojipicker': {
        'id': 'EmojiPicker',
        'icon': 'e-emoji',
        'tooltip': 'Emoji Icon',
        'command': 'EmojiPicker',
        'subCommand': 'EmojiPicker'
    },
    'inlinecode': {
        'id': 'inlineCode',
        'icon': 'e-inline-code',
        'tooltip': 'inlineCode',
        'command': 'Style',
        'subCommand': 'InlineCode'
    },
    'codeblock': {
        'id': 'codeBlock',
        'icon': 'e-rte-code-block',
        'tooltip': 'Insert Code Block',
        'command': 'CodeBlock',
        'subCommand': 'CodeBlock'
    },
    'horizontalline': {
        'id': 'HorizontalLine',
        'icon': 'e-horizontal-line',
        'tooltip': 'Horizontal Line',
        'command': 'InsertHTML',
        'subCommand': 'HorizontalLine'
    },
    'borderwidth': {
        'id': 'BorderWidth',
        'tooltip': 'Border Width',
        'command': 'Table',
        'subCommand': 'BorderWidth',
        'value': '1px'
    },
    'borderstyle': {
        'id': 'BorderStyle',
        'tooltip': 'Border Style',
        'command': 'Table',
        'subCommand': 'BorderStyle',
        'value': 'solid'
    },
    'bordercolor': {
        'id': 'BorderColor',
        'tooltip': 'Border Color',
        'command': 'Table',
        'subCommand': 'BorderColor',
        'value': '#0000000A'
    },
    'tablebackgroundcolor': {
        'id': 'TableBackgroundColor',
        'tooltip': 'Table Background Color',
        'command': 'Table',
        'subCommand': 'TableBackgroundColor',
        'value': '#0000000A'
    },
    'checklist': {
        'id': 'checklist',
        'icon': 'e-checklist',
        'tooltip': 'Checklist',
        'command': 'Checklist',
        'subCommand': 'Checklist'
    }
};

export const borderStyleItems: IDropDownItemModel[] = [
    { text: 'None', command: 'BorderStyle', subCommand: 'None' },
    { text: 'Solid', command: 'BorderStyle', subCommand: 'Solid' },
    { text: 'Dashed', command: 'BorderStyle', subCommand: 'Dashed' },
    { text: 'Dotted', command: 'BorderStyle', subCommand: 'Dotted' },
    { text: 'Double', command: 'BorderStyle', subCommand: 'Double' },
    { text: 'Groove', command: 'BorderStyle', subCommand: 'Groove' },
    { text: 'Ridge', command: 'BorderStyle', subCommand: 'Ridge' },
    { text: 'Inset', command: 'BorderStyle', subCommand: 'Inset' },
    { text: 'Outset', command: 'BorderStyle', subCommand: 'Outset' },
    { text: 'Hidden', command: 'BorderStyle', subCommand: 'Hidden' }
];
let borderStyleLocale: { [ket: string]: string }[] = [
    { locale: 'borderStyleNone', value: 'None' },
    { locale: 'borderStyleSolid', value: 'Solid' },
    { locale: 'borderStyleDashed', value: 'Dashed' },
    { locale: 'borderStyleDotted', value: 'Dotted' },
    { locale: 'borderStyleDouble', value: 'Double' },
    { locale: 'borderStyleGroove', value: 'Groove' },
    { locale: 'borderStyleRidge', value: 'Ridge' },
    { locale: 'borderStyleInset', value: 'Inset' },
    { locale: 'borderStyleOutset', value: 'Outset' },
    { locale: 'borderStyleHidden', value: 'Hidden' }
];


let alignmentLocale: { [ket: string]: string }[] = [
    { locale: 'alignmentsDropDownLeft', value: 'JustifyLeft' },
    { locale: 'alignmentsDropDownCenter', value: 'JustifyCenter' },
    { locale: 'alignmentsDropDownRight', value: 'JustifyRight' },
    { locale: 'alignmentsDropDownJustify', value: 'JustifyFull' }
];
export let alignmentItems: IDropDownItemModel[] = [
    { iconCss: 'e-icons e-justify-left', text: 'Align Left', command: 'Alignments', subCommand: 'JustifyLeft' },
    { iconCss: 'e-icons e-justify-center', text: 'Align Center', command: 'Alignments', subCommand: 'JustifyCenter' },
    { iconCss: 'e-icons e-justify-right', text: 'Align Right', command: 'Alignments', subCommand: 'JustifyRight' },
    { iconCss: 'e-icons e-justify-full', text: 'Align Justify', command: 'Alignments', subCommand: 'JustifyFull' }
];

export let imageAlignItems: IDropDownItemModel[] = [
    { iconCss: 'e-icons e-justify-left', command: 'Images', subCommand: 'JustifyLeft' },
    { iconCss: 'e-icons e-justify-center', command: 'Images', subCommand: 'JustifyCenter' },
    { iconCss: 'e-icons e-justify-right', command: 'Images', subCommand: 'JustifyRight' },
];

export let videoAlignItems: IDropDownItemModel[] = [
    { iconCss: 'e-icons e-justify-left', command: 'Videos', subCommand: 'JustifyLeft' },
    { iconCss: 'e-icons e-justify-center', command: 'Videos', subCommand: 'JustifyCenter' },
    { iconCss: 'e-icons e-justify-right', command: 'Videos', subCommand: 'JustifyRight' },
];

let displayLocale: { [ket: string]: string }[] = [
    { locale: 'imageDisplayDropDownInline', value: 'Inline' },
    { locale: 'imageDisplayDropDownBreak', value: 'Break' }
];

let audioLayoutOptionLocale: { [ket: string]: string }[] = [
    { locale: 'audioLayoutOptionDropDownInline', value: 'Inline' },
    { locale: 'audioLayoutOptionDropDownBreak', value: 'Break' }
];
let videoLayoutOptionLocale: { [ket: string]: string }[] = [
    { locale: 'videoLayoutOptionDropDownInline', value: 'Inline' },
    { locale: 'videoLayoutOptionDropDownBreak', value: 'Break' }
];
export let imageDisplayItems: IDropDownItemModel[] = [
    { text: 'Inline', cssClass: 'e-inline', command: 'Images', subCommand: 'Inline' },
    { text: 'Break', cssClass: 'e-break', command: 'Images', subCommand: 'Break' },
];

export let audioLayoutOptionItems: IDropDownItemModel[] = [
    { text: 'Inline', cssClass: 'e-audio-inline', command: 'Audios', subCommand: 'Inline' },
    { text: 'Break', cssClass: 'e-audio-break', command: 'Audios', subCommand: 'Break' },
];

export let videoLayoutOptionItems: IDropDownItemModel[] = [
    { text: 'Inline', cssClass: 'e-video-inline', command: 'Videos', subCommand: 'Inline' },
    { text: 'Break', cssClass: 'e-video-break', command: 'Videos', subCommand: 'Break' },
];

export let tableCellItems: IDropDownItemModel[] = [
    { iconCss: 'e-icons e-cell-merge', text: 'Merge cells', command: 'Table', subCommand: 'Merge' },
    { iconCss: 'e-icons e-cell-horizontal-split', text: 'Horizontal split', command: 'Table', subCommand: 'HorizontalSplit' },
    { iconCss: 'e-icons e-cell-vertical-split', text: 'Vertical split', command: 'Table', subCommand: 'VerticalSplit' },
];

let tableCellLocale: { [ket: string]: string }[] = [
    { locale: 'mergecells', value: 'Merge' },
    { locale: 'verticalsplit', value: 'HorizontalSplit' },
    { locale: 'horizontalsplit', value: 'VerticalSplit' }
];

let tableRowLocale: { [ket: string]: string }[] = [
    { locale: 'tableInsertRowDropDownBefore', value: 'InsertRowBefore' },
    { locale: 'tableInsertRowDropDownAfter', value: 'InsertRowAfter' },
    { locale: 'tableInsertRowDropDownDelete', value: 'DeleteRow' }
];
export let tableRowsItems: IDropDownItemModel[] = [
    { iconCss: 'e-icons e-insert-row-before', text: 'Insert row before', command: 'Table', subCommand: 'InsertRowBefore' },
    { iconCss: 'e-icons e-insert-row-after', text: 'Insert row after', command: 'Table', subCommand: 'InsertRowAfter' },
    { iconCss: 'e-icons e-delete-row', text: 'Delete row', command: 'Table', subCommand: 'DeleteRow' },
];

let tableColumnLocale: { [ket: string]: string }[] = [
    { locale: 'tableInsertColumnDropDownLeft', value: 'InsertColumnLeft' },
    { locale: 'tableInsertColumnDropDownRight', value: 'InsertColumnRight' },
    { locale: 'tableInsertColumnDropDownDelete', value: 'DeleteColumn' }
];
export let tableColumnsItems: IDropDownItemModel[] = [
    { iconCss: 'e-icons e-insert-column-left', text: 'Insert column left', command: 'Table', subCommand: 'InsertColumnLeft' },
    { iconCss: 'e-icons e-insert-column-right', text: 'Insert column right', command: 'Table', subCommand: 'InsertColumnRight' },
    { iconCss: 'e-icons e-delete-column', text: 'Delete column', command: 'Table', subCommand: 'DeleteColumn' },
];

let tableVerticalLocale: { [ket: string]: string }[] = [
    { locale: 'tableVerticalAlignDropDownTop', value: 'AlignTop' },
    { locale: 'tableVerticalAlignDropDownMiddle', value: 'AlignMiddle' },
    { locale: 'tableVerticalAlignDropDownBottom', value: 'AlignBottom' }
];
export let TableCellVerticalAlignItems: IDropDownItemModel[] = [
    { iconCss: 'e-icons e-align-top', text: 'Align Top', command: 'Table', subCommand: 'AlignTop' },
    { iconCss: 'e-icons e-align-middle', text: 'Align Middle', command: 'Table', subCommand: 'AlignMiddle' },
    { iconCss: 'e-icons e-align-bottom', text: 'Align Bottom', command: 'Table', subCommand: 'AlignBottom' },
];

let tableStyleLocale: { [ket: string]: string }[] = [
    { locale: 'tableStylesDropDownDashedBorder', value: 'Dashed' },
    { locale: 'tableStylesDropDownAlternateRows', value: 'Alternate' }
];

function getLocale(self: IRichTextEditor, localeItems: { [ket: string]: string }[], item: IDropDownItemModel): string {
    for (let i: number = 0; localeItems.length > i; i++) {
        if (localeItems[i as number].value === item.subCommand) {
            return self.localeObj.getConstant(localeItems[i as number].locale);
        }
    }
    return item.text;
}

export function updateDropDownLocale(self: IRichTextEditor): void {
    alignmentItems.forEach((item: IDropDownItemModel, i: number) => {
        alignmentItems[i as number].text = getLocale(self, alignmentLocale, alignmentItems[i as number]);
    });
    imageDisplayItems.forEach((item: IDropDownItemModel, i: number) => {
        imageDisplayItems[i as number].text = getLocale(self, displayLocale, imageDisplayItems[i as number]);
    });
    audioLayoutOptionItems.forEach((item: IDropDownItemModel, i: number) => {
        audioLayoutOptionItems[i as number].text = getLocale(self, audioLayoutOptionLocale, audioLayoutOptionItems[i as number]);
    });
    videoLayoutOptionItems.forEach((item: IDropDownItemModel, i: number) => {
        videoLayoutOptionItems[i as number].text = getLocale(self, videoLayoutOptionLocale, videoLayoutOptionItems[i as number]);
    });
    tableRowsItems.forEach((item: IDropDownItemModel, i: number) => {
        tableRowsItems[i as number].text = getLocale(self, tableRowLocale, tableRowsItems[i as number]);
    });
    tableColumnsItems.forEach((item: IDropDownItemModel, i: number) => {
        tableColumnsItems[i as number].text = getLocale(self, tableColumnLocale, tableColumnsItems[i as number]);
    });
    TableCellVerticalAlignItems.forEach((item: IDropDownItemModel, i: number) => {
        TableCellVerticalAlignItems[i as number].text = getLocale(self, tableVerticalLocale, TableCellVerticalAlignItems[i as number]);
    });
    TableStyleItems.forEach((item: IDropDownItemModel, i: number) => {
        TableStyleItems[i as number].text = getLocale(self, tableStyleLocale, TableStyleItems[i as number]);
    });
    borderStyleItems.forEach((item: IDropDownItemModel, i: number) => {
        borderStyleItems[i as number].text = getLocale(self, borderStyleLocale, borderStyleItems[i as number]);
    });
    tableCellItems.forEach((item: IDropDownItemModel, i: number) => {
        tableCellItems[i as number].text = getLocale(self, tableCellLocale, tableCellItems[i as number]);
    });
}

export let windowKeys: { [key: string]: string } = {
    'CreateLink': 'Ctrl+K',
    'Image': 'Ctrl+Shift+I',
    'CreateTable': 'Ctrl+Shift+E',
    'Undo': 'Ctrl+Z',
    'Redo': 'Ctrl+Y',
    'Copy': 'Ctrl+C',
    'Cut': 'Ctrl+X',
    'Paste': 'Ctrl+V',
    'Bold': 'Ctrl+B',
    'Italic': 'Ctrl+I',
    'Underline': 'Ctrl+U',
    'StrikeThrough': 'Ctrl+Shift+S',
    'UpperCase': 'Ctrl+Shift+U',
    'LowerCase': 'Ctrl+Shift+L',
    'SuperScript': 'Ctrl+Shift+=',
    'SubScript': 'Ctrl+=',
    'SourceCode': 'Ctrl+Shift+H',
    'Preview': 'Ctrl+Shift+H',
    'Print': 'Ctrl+P',
    'Maximize': 'Ctrl+Shift+F',
    'Minimize': 'Esc',
    'ClearFormat': 'Ctrl+Shift+R',
    'OL': 'Ctrl+Shift+O',
    'UL': 'Ctrl+Alt+O',
    'NumberFormatList': 'Ctrl+Shift+O',
    'BulletFormatList': 'Ctrl+Alt+O',
    'Audio': 'Ctrl+Shift+A',
    'Video': 'Ctrl+Alt+V',
    'Indent': 'Ctrl+]',
    'Outdent': 'Ctrl+[',
    'Decrease Fontsize': 'Ctrl+Shift+<',
    'Increase Fontsize': 'Ctrl+Shift+>',
    'JustifyCenter': 'Ctrl+E',
    'JustifyFull': 'Ctrl+J',
    'JustifyLeft': 'Ctrl+L',
    'JustifyRight': 'Ctrl+R',
    'FormatPainter': 'Alt+Shift+C, Alt+Shift+V',
    'InlineCode': 'Ctrl+`',
    'CodeBlock': 'Ctrl+Shift+B',
    'Checklist': 'Ctrl+Shift+9'
};

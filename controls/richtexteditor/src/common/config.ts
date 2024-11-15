import { IImageResizeFactor } from './interface';

/**
 * Default Markdown formats config for adapter
 */
export const markdownFormatTags: { [key: string]: string } = {
    'h6': '###### ',
    'h5': '##### ',
    'h4': '#### ',
    'h3': '### ',
    'h2': '## ',
    'h1': '# ',
    'blockquote': '> ',
    'pre': '```\n',
    'p': ''
};
/**
 * Default selection formats config for adapter
 */
export const markdownSelectionTags: { [key: string]: string } = {
    'Bold': '**',
    'Italic': '*',
    'StrikeThrough': '~~',
    'InlineCode': '`',
    'SubScript': '<sub>',
    'SuperScript': '<sup>',
    'UpperCase': 'A-Z',
    'LowerCase': 'a-z'
};
/**
 * Default Markdown lists config for adapter
 */
export const markdownListsTags: { [key: string]: string } = {
    'OL': '1. ',
    'UL': '- '
};
/**
 * Default html key config for adapter
 */
export const htmlKeyConfig: { [key: string]: string } = {
    'toolbar-focus': 'alt+f10',
    'escape': 'escape',
    'backspace': 'backspace',
    'insert-link': 'ctrl+k',
    'insert-image': 'ctrl+shift+i',
    'insert-audio': 'ctrl+shift+a',
    'insert-video': 'ctrl+alt+v',
    'insert-table': 'ctrl+shift+e',
    'undo': 'ctrl+z',
    'redo': 'ctrl+y',
    'copy': 'ctrl+c',
    'cut': 'ctrl+x',
    'paste': 'ctrl+v',
    'bold': 'ctrl+b',
    'italic': 'ctrl+i',
    'underline': 'ctrl+u',
    'strikethrough': 'ctrl+shift+s',
    'uppercase': 'ctrl+shift+u',
    'lowercase': 'ctrl+shift+l',
    'superscript': 'ctrl+shift+=',
    'subscript': 'ctrl+=',
    'indents': 'ctrl+]',
    'outdents': 'ctrl+[',
    'html-source': 'ctrl+shift+h',
    'full-screen': 'ctrl+shift+f',
    'decrease-fontsize': 'ctrl+shift+<',
    'increase-fontsize': 'ctrl+shift+>',
    'justify-center': 'ctrl+e',
    'justify-full': 'ctrl+j',
    'justify-left': 'ctrl+l',
    'justify-right': 'ctrl+r',
    'clear-format': 'ctrl+shift+r',
    'ordered-list': 'ctrl+shift+o',
    'unordered-list': 'ctrl+alt+o',
    'space': 'space',
    'enter': 'enter',
    'tab': 'tab',
    'delete': 'delete',
    'format-copy': 'alt+shift+c',
    'format-paste': 'alt+shift+v',
    'inlinecode': 'ctrl+`'
};
/**
 * Default  markdown key config for adapter
 */
export const markdownKeyConfig: { [key: string]: string } = {
    'toolbar-focus': 'alt+f10',
    'escape': '27',
    'insert-link': 'ctrl+k',
    'insert-image': 'ctrl+shift+i',
    'insert-table': 'ctrl+shift+e',
    'undo': 'ctrl+z',
    'redo': 'ctrl+y',
    'copy': 'ctrl+c',
    'cut': 'ctrl+x',
    'paste': 'ctrl+v',
    'bold': 'ctrl+b',
    'italic': 'ctrl+i',
    'strikethrough': 'ctrl+shift+s',
    'uppercase': 'ctrl+shift+u',
    'lowercase': 'ctrl+shift+l',
    'superscript': 'ctrl+shift+=',
    'subscript': 'ctrl+=',
    'full-screen': 'ctrl+shift+f',
    'ordered-list': 'ctrl+shift+o',
    'unordered-list': 'ctrl+alt+o'
};
/**
 * PasteCleanup Grouping of similar functionality tags
 */
export const pasteCleanupGroupingTags: { [key: string]: string[] } = {
    'b': ['strong'],
    'strong': ['b'],
    'i': ['emp', 'cite'],
    'emp': ['i', 'cite'],
    'cite': ['i', 'emp']
};

/**
 * PasteCleanup Grouping of similar functionality tags
 */
export const listConversionFilters: { [key: string]: string } = {
    'first': 'MsoListParagraphCxSpFirst',
    'middle': 'MsoListParagraphCxSpMiddle',
    'last': 'MsoListParagraphCxSpLast'
};

/**
 * Dom-Node Grouping of self closing tags
 *
 * @hidden
 */
export const selfClosingTags: string[] = [
    'BR',
    'IMG'
];

/**
 * Resize factor for image.
 *
 *@hidden
 *
 */
export const imageResizeFactor: IImageResizeFactor = {
    topLeft     : [-1, -1 ],
    topRight    : [ 1, -1 ],
    botRight    : [ 1,  1 ],
    botLeft     : [-1,  1 ]
};

/**
 * Mention restrict key configuration.
 *
 * @hidden
 *
 */
export const mentionRestrictKeys: string[] = [
    'ArrowUp',
    'ArrowDown',
    'Enter',
    'Tab',
    'Escape'
];

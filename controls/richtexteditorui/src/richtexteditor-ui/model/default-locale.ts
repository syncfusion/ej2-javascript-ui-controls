import { SlashCommandItems } from '../../common/types';

/**
 * Default locale strings used by the slash command popup.
 */
export const defaultLocale: { [key: string]: string } = {
    'slashCommandItemHeadingOneText': 'Heading 1',
    'slashCommandItemHeadingOneDescription': 'Large section heading',
    'slashCommandItemHeadingTwoText': 'Heading 2',
    'slashCommandItemHeadingTwoDescription': 'Medium section heading',
    'slashCommandItemHeadingThreeText': 'Heading 3',
    'slashCommandItemHeadingThreeDescription': 'Small section heading',
    'slashCommandItemHeadingFourText': 'Heading 4',
    'slashCommandItemHeadingFourDescription': 'Smaller section heading',
    'slashCommandItemParagraphText': 'Paragraph',
    'slashCommandItemParagraphDescription': 'Plain text block',
    'slashCommandItemBlockquoteText': 'Blockquote',
    'slashCommandItemBlockquoteDescription': 'Quoted block of text',
    'slashCommandItemOrderedListText': 'Numbered List',
    'slashCommandItemOrderedListDescription': 'Ordered list of items',
    'slashCommandItemUnorderedListText': 'Bulleted List',
    'slashCommandItemUnorderedListDescription': 'Bulleted list of items',
    'slashCommandItemCodeText': 'Code Block',
    'slashCommandItemCodeDescription': 'Insert a code block',
    'slashCommandItemTableText': 'Table',
    'slashCommandItemTableDescription': 'Insert a table',
    'slashCommandItemLinkText': 'Link',
    'slashCommandItemLinkDescription': 'Insert a hyperlink',
    'slashCommandItemImageText': 'Image',
    'slashCommandItemImageDescription': 'Insert an image'
};

/**
 * Maps each predefined slash command item to its localized text and description keys.
 */
type SlashCmdLocaleValue = { text: string, description: string };
type SlashCommandLocaleMap = Map<SlashCommandItems, SlashCmdLocaleValue>;
type SlashCommandLocaleEntry = [SlashCommandItems, SlashCmdLocaleValue];
const localeEntries: SlashCommandLocaleEntry[] = [
    ['Heading 1', { text: 'slashCommandItemHeadingOneText', description: 'slashCommandItemHeadingOneDescription' }],
    ['Heading 2', { text: 'slashCommandItemHeadingTwoText', description: 'slashCommandItemHeadingTwoDescription' }],
    ['Heading 3', { text: 'slashCommandItemHeadingThreeText', description: 'slashCommandItemHeadingThreeDescription' }],
    ['Heading 4', { text: 'slashCommandItemHeadingFourText', description: 'slashCommandItemHeadingFourDescription' }],
    ['Paragraph', { text: 'slashCommandItemParagraphText', description: 'slashCommandItemParagraphDescription' }],
    ['Blockquote', { text: 'slashCommandItemBlockquoteText', description: 'slashCommandItemBlockquoteDescription' }],
    ['NumberedList', { text: 'slashCommandItemOrderedListText', description: 'slashCommandItemOrderedListDescription' }],
    ['BulletList', { text: 'slashCommandItemUnorderedListText', description: 'slashCommandItemUnorderedListDescription' }],
    ['Table', { text: 'slashCommandItemTableText', description: 'slashCommandItemTableDescription' }],
    ['Link', { text: 'slashCommandItemLinkText', description: 'slashCommandItemLinkDescription' }],
    ['Image', { text: 'slashCommandItemImageText', description: 'slashCommandItemImageDescription' }]
];
export const slashCommandCommandsKey: SlashCommandLocaleMap = new Map<SlashCommandItems, SlashCmdLocaleValue>(localeEntries);

/**
 * Default English strings for the Table insertion feature.
 */
export const tableLocale: { [key: string]: string } = {
    'dialogInsert': 'Insert',
    'dialogCancel': 'Cancel',
    'tabledialogHeader': 'Insert Table',
    'inserttablebtn': 'INSERT TABLE',
    'columns': 'Number of columns',
    'rows': 'Number of rows',
    'tableRows': 'Row operations',
    'tableColumns': 'Column operations',
    'tableHeader': 'Toggle header row',
    'tableCellBackground': 'Cell background',
    'tableCellVerticalAlign': 'Vertical alignment',
    'tableCellHorizontalAlign': 'Horizontal alignment',
    'deleteTable': 'Delete table',
    'insertTable': 'Table'
};

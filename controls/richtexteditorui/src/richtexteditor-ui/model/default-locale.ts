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
    'slashCommandItemCollapsibleParagraphText': 'Collapsible Paragraph',
    'slashCommandItemCollapsibleParagraphDescription': 'Collapsible paragraph block',
    'slashCommandItemCollapsibleHeadingOneText': 'Collapsible Heading 1',
    'slashCommandItemCollapsibleHeadingOneDescription': 'Large collapsible section heading',
    'slashCommandItemCollapsibleHeadingTwoText': 'Collapsible Heading 2',
    'slashCommandItemCollapsibleHeadingTwoDescription': 'Medium collapsible section heading',
    'slashCommandItemCollapsibleHeadingThreeText': 'Collapsible Heading 3',
    'slashCommandItemCollapsibleHeadingThreeDescription': 'Small collapsible section heading',
    'slashCommandItemCollapsibleHeadingFourText': 'Collapsible Heading 4',
    'slashCommandItemCollapsibleHeadingFourDescription': 'Smaller collapsible section heading',
    'slashCommandItemBlockquoteText': 'Blockquote',
    'slashCommandItemBlockquoteDescription': 'Quoted block of text',
    'slashCommandItemCalloutInfoText': 'Info',
    'slashCommandItemCalloutInfoDescription': 'Insert Info Callout',
    'slashCommandItemCalloutWarningText': 'Warning',
    'slashCommandItemCalloutWarningDescription': 'Insert Warning Callout',
    'slashCommandItemCalloutErrorText': 'Error',
    'slashCommandItemCalloutErrorDescription': 'Insert Error Callout',
    'slashCommandItemCalloutSuccessText': 'Success',
    'slashCommandItemCalloutSuccessDescription': 'Insert Success Callout',
    'slashCommandItemCalloutNoteText': 'Note',
    'slashCommandItemCalloutNoteDescription': 'Insert Note Callout',
    'slashCommandItemOrderedListText': 'Numbered List',
    'slashCommandItemOrderedListDescription': 'Ordered list of items',
    'slashCommandItemUnorderedListText': 'Bulleted List',
    'slashCommandItemUnorderedListDescription': 'Bulleted list of items',
    'slashCommandItemChecklistText': 'Checklist',
    'slashCommandItemChecklistDescription': 'List with checkboxes for tasks',
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
    ['Collapsible Paragraph', { text: 'slashCommandItemCollapsibleParagraphText', description: 'slashCommandItemCollapsibleParagraphDescription'}],
    ['Collapsible Heading 1', { text: 'slashCommandItemCollapsibleHeadingOneText', description: 'slashCommandItemCollapsibleHeadingOneDescription' }],
    ['Collapsible Heading 2', { text: 'slashCommandItemCollapsibleHeadingTwoText', description: 'slashCommandItemCollapsibleHeadingTwoDescription' }],
    ['Collapsible Heading 3', { text: 'slashCommandItemCollapsibleHeadingThreeText', description: 'slashCommandItemCollapsibleHeadingThreeDescription' }],
    ['Collapsible Heading 4', { text: 'slashCommandItemCollapsibleHeadingFourText', description: 'slashCommandItemCollapsibleHeadingFourDescription' }],
    ['Blockquote', { text: 'slashCommandItemBlockquoteText', description: 'slashCommandItemBlockquoteDescription' }],
    ['Info', { text: 'slashCommandItemCalloutInfoText', description: 'slashCommandItemCalloutInfoDescription' }],
    ['Warning', { text: 'slashCommandItemCalloutWarningText', description: 'slashCommandItemCalloutWarningDescription' }],
    ['Error', { text: 'slashCommandItemCalloutErrorText', description: 'slashCommandItemCalloutErrorDescription' }],
    ['Success', { text: 'slashCommandItemCalloutSuccessText', description: 'slashCommandItemCalloutSuccessDescription' }],
    ['Note', { text: 'slashCommandItemCalloutNoteText', description: 'slashCommandItemCalloutNoteDescription' }],
    ['NumberedList', { text: 'slashCommandItemOrderedListText', description: 'slashCommandItemOrderedListDescription' }],
    ['BulletList', { text: 'slashCommandItemUnorderedListText', description: 'slashCommandItemUnorderedListDescription' }],
    ['Checklist', { text: 'slashCommandItemChecklistText', description: 'slashCommandItemChecklistDescription' }],
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

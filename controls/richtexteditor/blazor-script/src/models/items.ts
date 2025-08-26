/* eslint-disable */
/**
 * Export items model
 */
import { IDropDownItemModel, ICodeBlockLanguageModel, IListDropDownModel, EmojiIconsSet } from '../common/interface';

/**
 * Background color options for text formatting.
 */
export const backgroundColor: { [key: string]: string[] } = {
    'Custom': [
        '', '#000000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff0000', '#000080', '#800080', '#996633',
        '#f2f2f2', '#808080', '#ffffcc', '#b3ffb3', '#ccffff', '#ccccff', '#ffcccc', '#ccccff', '#ff80ff', '#f2e6d9',
        '#d9d9d9', '#595959', '#ffff80', '#80ff80', '#b3ffff', '#8080ff', '#ff8080', '#8080ff', '#ff00ff', '#dfbf9f',
        '#bfbfbf', '#404040', '#ffff33', '#33ff33', '#33ffff', '#3333ff', '#ff3333', '#0000b3', '#b300b3', '#c68c53',
        '#a6a6a6', '#262626', '#e6e600', '#00b300', '#009999', '#000099', '#b30000', '#000066', '#660066', '#86592d',
        '#7f7f7f', '#0d0d0d', '#999900', '#006600', '#006666', '#000066', '#660000', '#00004d', '#4d004d', '#734d26'
    ]
};

/**
 * Font color options for text formatting.
 */
export const fontColor: { [key: string]: string[] } = {
    'Custom': [
        '', '#000000', '#e7e6e6', '#44546a', '#4472c4', '#ed7d31', '#a5a5a5', '#ffc000', '#70ad47', '#ff0000',
        '#f2f2f2', '#808080', '#cfcdcd', '#d5dce4', '#d9e2f3', '#fbe4d5', '#ededed', '#fff2cc', '#e2efd9', '#ffcccc',
        '#d9d9d9', '#595959', '#aeaaaa', '#acb9ca', '#b4c6e7', '#f7caac', '#dbdbdb', '#ffe599', '#c5e0b3', '#ff8080',
        '#bfbfbf', '#404040', '#747070', '#8496b0', '#8eaadb', '#f4b083', '#c9c9c9', '#ffd966', '#a8d08d', '#ff3333',
        '#a6a6a6', '#262626', '#3b3838', '#323e4f', '#2f5496', '#c45911', '#7b7b7b', '#bf8f00', '#538135', '#b30000',
        '#7f7f7f', '#0d0d0d', '#161616', '#212934', '#1f3763', '#823b0b', '#525252', '#7f5f00', '#375623', '#660000']
};

/**
 * Font family options for rich text editor.
 */
export const fontFamily: IDropDownItemModel[] = [
    { cssClass: 'e-default', text: 'Default', command: 'Font', subCommand: 'FontName', value: '' },
    { cssClass: 'e-segoe-ui', text: 'Segoe UI', command: 'Font', subCommand: 'FontName', value: 'Segoe UI' },
    { cssClass: 'e-arial', text: 'Arial', command: 'Font', subCommand: 'FontName', value: 'Arial,Helvetica,sans-serif' },
    { cssClass: 'e-georgia', text: 'Georgia', command: 'Font', subCommand: 'FontName', value: 'Georgia,serif' },
    { cssClass: 'e-impact', text: 'Impact', command: 'Font', subCommand: 'FontName', value: 'Impact,Charcoal,sans-serif' },
    { cssClass: 'e-tahoma', text: 'Tahoma', command: 'Font', subCommand: 'FontName', value: 'Tahoma,Geneva,sans-serif' },
    { cssClass: 'e-times-new-roman', text: 'Times New Roman', command: 'Font', subCommand: 'FontName', value: 'Times New Roman,Times,serif' },
    { cssClass: 'e-verdana', text: 'Verdana', command: 'Font', subCommand: 'FontName', value: 'Verdana,Geneva,sans-serif' }
];

/**
 * Font size options for text formatting.
 */
export const fontSize: IDropDownItemModel[] = [
    { text: 'Default', value: '' },
    { text: '8 pt', value: '8pt' },
    { text: '10 pt', value: '10pt' },
    { text: '12 pt', value: '12pt' },
    { text: '14 pt', value: '14pt' },
    { text: '18 pt', value: '18pt' },
    { text: '24 pt', value: '24pt' },
    { text: '36 pt', value: '36pt' }
];

/**
 * Formatting options for rich text elements.
 */
export const formatItems: IDropDownItemModel[] = [
    { cssClass: 'e-paragraph', text: 'Paragraph', command: 'Formats', subCommand: 'P', value: 'P' },
    { cssClass: 'e-h1', text: 'Heading 1', command: 'Formats', subCommand: 'H1', value: 'H1' },
    { cssClass: 'e-h2', text: 'Heading 2', command: 'Formats', subCommand: 'H2', value: 'H2' },
    { cssClass: 'e-h3', text: 'Heading 3', command: 'Formats', subCommand: 'H3', value: 'H3' },
    { cssClass: 'e-h4', text: 'Heading 4', command: 'Formats', subCommand: 'H4', value: 'H4' },
    { cssClass: 'e-code', text: 'preformatted', command: 'Formats', subCommand: 'Pre', value: 'Pre' },
];

/**
 * Predefined toolbar items for the rich text editor.
 */
export const predefinedItems: string[] = ['Bold', 'Italic', 'Underline', '|', 'Formats', 'Alignments', 'Blockquote',
    'OrderedList', 'UnorderedList', '|', 'CreateLink', 'Image', '|', 'SourceCode', 'Undo', 'Redo'];

/**
 * Table style options for text tables.
 */
export const TableStyleItems: IDropDownItemModel[] = [
    { text: 'Dashed Borders', cssClass: 'e-dashed-borders', command: 'Table', subCommand: 'Dashed' },
    { text: 'Alternate Rows', cssClass: 'e-alternate-rows', command: 'Table', subCommand: 'Alternate' }
];

/**
 * Number format list for ordered lists.
 */
export const numberFormatList: IListDropDownModel[] = [
    { text: 'None', command: 'Lists', subCommand: 'NumberFormatList', value: 'none' },
    { text: 'Number', command: 'Lists', subCommand: 'NumberFormatList', value: 'decimal' },
    { text: 'Lower Greek', command: 'Lists', subCommand: 'NumberFormatList', value: 'lowerGreek' },
    { text: 'Lower Roman', command: 'Lists', subCommand: 'NumberFormatList', value: 'lowerRoman' },
    { text: 'Upper Alpha', command: 'Lists', subCommand: 'NumberFormatList', value: 'upperAlpha' },
    { text: 'Lower Alpha', command: 'Lists', subCommand: 'NumberFormatList', value: 'lowerAlpha' },
    { text: 'Upper Roman', command: 'Lists', subCommand: 'NumberFormatList', value: 'upperRoman' },
];

/**
 * Bullet format list for unordered lists.
 */
export const bulletFormatList: IListDropDownModel[] = [
    { text: 'None', command: 'Lists', subCommand: 'BulletFormatList', value: 'none' },
    { text: 'Disc', command: 'Lists', subCommand: 'BulletFormatList', value: 'disc' },
    { text: 'Circle', command: 'Lists', subCommand: 'BulletFormatList', value: 'circle' },
    { text: 'Square', command: 'Lists', subCommand: 'BulletFormatList', value: 'square' },
];

/**
 * List of code block languages supported by the editor.
 */
export const codeBlockList: ICodeBlockLanguageModel[] = [
    { language: 'plaintext', label: 'Plain text' },
    { language: 'c', label: 'C' },
    { language: 'csharp', label: 'C#' },
    { language: 'cpp', label: 'C++' },
    { language: 'css', label: 'CSS' },
    { language: 'diff', label: 'Diff' },
    { language: 'html', label: 'HTML' },
    { language: 'java', label: 'Java' },
    { language: 'javascript', label: 'JavaScript' },
    { language: 'php', label: 'PHP' },
    { language: 'python', label: 'Python' },
    { language: 'ruby', label: 'Ruby' },
    { language: 'sql', label: 'SQL' },
    { language: 'typescript', label: 'TypeScript' },
    { language: 'xml', label: 'XML' }
];


export const defaultEmojiIcons: EmojiIconsSet[] = [{
    name: 'Smilies & People', code: '1F600', iconCss: 'e-emoji', icons: [{ code: '1F600', desc: 'Grinning face' },
    { code: '1F603', desc: 'Grinning face with big eyes' },
    { code: '1F604', desc: 'Grinning face with smiling eyes' },
    { code: '1F606', desc: 'Grinning squinting face' },
    { code: '1F605', desc: 'Grinning face with sweat' },
    { code: '1F602', desc: 'Face with tears of joy' },
    { code: '1F923', desc: 'Rolling on the floor laughing' },
    { code: '1F60A', desc: 'Smiling face with smiling eyes' },
    { code: '1F607', desc: 'Smiling face with halo' },
    { code: '1F642', desc: 'Slightly smiling face' },
    { code: '1F643', desc: 'Upside-down face' },
    { code: '1F60D', desc: 'Smiling face with heart-eyes' },
    { code: '1F618', desc: 'Face blowing a kiss' },
    { code: '1F61B', desc: 'Face with tongue' },
    { code: '1F61C', desc: 'Winking face with tongue' },
    { code: '1F604', desc: 'Grinning face with smiling eyes' },
    { code: '1F469', desc: 'Woman' },
    { code: '1F468', desc: 'Man' },
    { code: '1F467', desc: 'Girl' },
    { code: '1F466', desc: 'Boy' },
    { code: '1F476', desc: 'Baby' },
    { code: '1F475', desc: 'Old woman' },
    { code: '1F474', desc: 'Old man' },
    { code: '1F46E', desc: 'Police officer' },
    { code: '1F477', desc: 'Construction worker' },
    { code: '1F482', desc: 'Guard' },
    { code: '1F575', desc: 'Detective' },
    { code: '1F9D1', desc: 'Cook' }]
}, {
    name: 'Animals & Nature', code: '1F435', iconCss: 'e-animals', icons: [{ code: '1F436', desc: 'Dog face' },
    { code: '1F431', desc: 'Cat face' },
    { code: '1F42D', desc: 'Mouse face' },
    { code: '1F439', desc: 'Hamster face' },
    { code: '1F430', desc: 'Rabbit face' },
    { code: '1F98A', desc: 'Fox face' },
    { code: '1F43B', desc: 'Bear face' },
    { code: '1F43C', desc: 'Panda face' },
    { code: '1F428', desc: 'Koala' },
    { code: '1F42F', desc: 'Tiger face' },
    { code: '1F981', desc: 'Lion face' },
    { code: '1F42E', desc: 'Cow face' },
    { code: '1F437', desc: 'Pig face' },
    { code: '1F43D', desc: 'Pig nose' },
    { code: '1F438', desc: 'Frog face' },
    { code: '1F435', desc: 'Monkey face' },
    { code: '1F649', desc: 'Hear-no-evil monkey' },
    { code: '1F64A', desc: 'Speak-no-evil monkey' },
    { code: '1F412', desc: 'Monkey' },
    { code: '1F414', desc: 'Chicken' },
    { code: '1F427', desc: 'Penguin' },
    { code: '1F426', desc: 'Bird' },
    { code: '1F424', desc: 'Baby chick' },
    { code: '1F986', desc: 'Duck' },
    { code: '1F985', desc: 'Eagle' }]
}, {
    name: 'Food & Drink', code: '1F347', iconCss: 'e-food-and-drinks', icons: [{ code: '1F34E', desc: 'Red apple' },
    { code: '1F34C', desc: 'Banana' },
    { code: '1F347', desc: 'Grapes' },
    { code: '1F353', desc: 'Strawberry' },
    { code: '1F35E', desc: 'Bread' },
    { code: '1F950', desc: 'Croissant' },
    { code: '1F955', desc: 'Carrot' },
    { code: '1F354', desc: 'Hamburger' },
    { code: '1F355', desc: 'Pizza' },
    { code: '1F32D', desc: 'Hot dog' },
    { code: '1F35F', desc: 'French fries' },
    { code: '1F37F', desc: 'Popcorn' },
    { code: '1F366', desc: 'Soft ice cream' },
    { code: '1F367', desc: 'Shaved ice' },
    { code: '1F36A', desc: 'Cookie' },
    { code: '1F382', desc: 'Birthday cake' },
    { code: '1F370', desc: 'Shortcake' },
    { code: '1F36B', desc: 'Chocolate bar' },
    { code: '1F369', desc: 'Donut' },
    { code: '1F36E', desc: 'Custard' },
    { code: '1F36D', desc: 'Lollipop' },
    { code: '1F36C', desc: 'Candy' },
    { code: '1F377', desc: 'Wine glass' },
    { code: '1F37A', desc: 'Beer mug' },
    { code: '1F37E', desc: 'Bottle with popping cork' }]
}, {
    name: 'Activities', code: '1F383', iconCss: 'e-activities', icons: [{ code: '26BD', desc: 'Soccer ball' },
    { code: '1F3C0', desc: 'Basketball' },
    { code: '1F3C8', desc: 'American football' },
    { code: '26BE', desc: 'Baseball' },
    { code: '1F3BE', desc: 'Tennis' },
    { code: '1F3D0', desc: 'Volleyball' },
    { code: '1F3C9', desc: 'Rugby football' },
    { code: '1F3B1', desc: 'Pool 8 ball' },
    { code: '1F3D3', desc: 'Ping pong' },
    { code: '1F3F8', desc: 'Badminton' },
    { code: '1F94A', desc: 'Boxing glove' },
    { code: '1F3CA', desc: 'Swimmer' },
    { code: '1F3CB', desc: 'Weightlifter' },
    { code: '1F6B4', desc: 'Bicyclist' },
    { code: '1F6F9', desc: 'Skateboard' },
    { code: '1F3AE', desc: 'Video game' },
    { code: '1F579', desc: 'Joystick' },
    { code: '1F3CF', desc: 'Cricket' },
    { code: '1F3C7', desc: 'Horse racing' },
    { code: '1F3AF', desc: 'Direct hit' },
    { code: '1F3D1', desc: 'Field hockey' },
    { code: '1F3B0', desc: 'Slot machine' },
    { code: '1F3B3', desc: 'Bowling' },
    { code: '1F3B2', desc: 'Game die' },
    { code: '265F', desc: 'Chess pawn' }]
}, {
    name: 'Travel & Places', code: '1F30D', iconCss: 'e-travel-and-places', icons: [{ code: '2708', desc: 'Airplane' },
    { code: '1F697', desc: 'Automobile' },
    { code: '1F695', desc: 'Taxi' },
    { code: '1F6B2', desc: 'Bicycle' },
    { code: '1F68C', desc: 'Bus' },
    { code: '1F682', desc: 'Locomotive' },
    { code: '1F6F3', desc: 'Passenger ship' },
    { code: '1F680', desc: 'Rocket' },
    { code: '1F681', desc: 'Helicopter' },
    { code: '1F6A2', desc: 'Ship' },
    { code: '1F3DF', desc: 'Stadium' },
    { code: '1F54C', desc: 'Mosque' },
    { code: '26EA', desc: 'Church' },
    { code: '1F6D5', desc: 'Hindu Temple' },
    { code: '1F3D4', desc: 'Snow-capped mountain' },
    { code: '1F3EB', desc: 'School' },
    { code: '1F30B', desc: 'Volcano' },
    { code: '1F3D6', desc: 'Beach with umbrella' },
    { code: '1F3DD', desc: 'Desert island' },
    { code: '1F3DE', desc: 'National park' },
    { code: '1F3F0', desc: 'Castle' },
    { code: '1F5FC', desc: 'Tokyo tower' },
    { code: '1F5FD', desc: 'Statue of liberty' },
    { code: '26E9', desc: 'Shinto shrine' },
    { code: '1F3EF', desc: 'Japanese castle' },
    { code: '1F3A2', desc: 'Roller coaster' }]
}, {
    name: 'Objects', code: '1F507', iconCss: 'e-objects', icons: [{ code: '1F4A1', desc: 'Light bulb' },
    { code: '1F526', desc: 'Flashlight' },
    { code: '1F4BB', desc: 'Laptop computer' },
    { code: '1F5A5', desc: 'Desktop computer' },
    { code: '1F5A8', desc: 'Printer' },
    { code: '1F4F7', desc: 'Camera' },
    { code: '1F4F8', desc: 'Camera with flash' },
    { code: '1F4FD', desc: 'Film projector' },
    { code: '1F3A5', desc: 'Movie camera' },
    { code: '1F4FA', desc: 'Television' },
    { code: '1F4FB', desc: 'Radio' },
    { code: '1F50B', desc: 'Battery' },
    { code: '231A', desc: 'Watch' },
    { code: '1F4F1', desc: 'Mobile phone' },
    { code: '260E', desc: 'Telephone' },
    { code: '1F4BE', desc: 'Floppy disk' },
    { code: '1F4BF', desc: 'Optical disk' },
    { code: '1F4C0', desc: 'Digital versatile disc' },
    { code: '1F4BD', desc: 'Computer disk' },
    { code: '1F3A7', desc: 'Headphone' },
    { code: '1F3A4', desc: 'Microphone' },
    { code: '1F3B6', desc: 'Multiple musical notes' },
    { code: '1F4DA', desc: 'Books' }]
}, {
    name: 'Symbols', code: '1F3E7', iconCss: 'e-symbols', icons: [{ code: '274C', desc: 'Cross mark' },
    { code: '2714', desc: 'Check mark' },
    { code: '26A0', desc: 'Warning sign' },
    { code: '1F6AB', desc: 'Prohibited' },
    { code: '2139', desc: 'Information' },
    { code: '267B', desc: 'Recycling symbol' },
    { code: '1F6AD', desc: 'No smoking' },
    { code: '1F4F5', desc: 'No mobile phones' },
    { code: '1F6AF', desc: 'No littering' },
    { code: '1F6B3', desc: 'No bicycles' },
    { code: '1F6B7', desc: 'No pedestrians' },
    { code: '2795', desc: 'Plus' },
    { code: '2796', desc: 'Minus' },
    { code: '2797', desc: 'Divide' },
    { code: '2716', desc: 'Multiplication' },
    { code: '1F4B2', desc: 'Dollar banknote' },
    { code: '1F4AC', desc: 'Speech balloon' },
    { code: '2755', desc: 'White exclamation mark' },
    { code: '2754', desc: 'White question mark' },
    { code: '2764', desc: 'Heart' }]
}];


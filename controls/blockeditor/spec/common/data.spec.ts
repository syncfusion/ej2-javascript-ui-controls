import { BlockModel, ContentType } from "../../src/index";

export const allBlockData: BlockModel[] = [
    {
        id: 'heading-block',
        type: 'Heading1',
        content: [{
            id: 'heading-content',
            type: ContentType.Text,
            content: 'Welcome to the Block Editor Demo!'
        }]
    },
    {
        id: 'intro-block',
        type: 'Paragraph',
        content: [{
            id: 'intro-content',
            type: ContentType.Text,
            content: 'Block Editor is a powerful rich text editor',
        }]
    },
    {
        id: 'styled-paragraph',
        type: 'Paragraph',
        content: [
            {
                id: 'styled-text-1',
                type: ContentType.Text,
                content: 'Try selecting text to see '
            },
            {
                id: 'styled-text-2',
                type: ContentType.Text,
                content: 'formatting options',
                styles: {
                    bold: true,
                    italic: true
                }
            },
            {
                id: 'styled-text-3',
                type: ContentType.Text,
                content: ', or type '
            },
            {
                id: 'styled-text-4',
                type: ContentType.Text,
                content: '"/"',
                styles: {
                    bgColor: '#F0F0F0',
                    bold: true
                }
            },
            {
                id: 'styled-text-5',
                type: ContentType.Text,
                content: ' to access the command menu.'
            }
        ]
    },
    {
        id: 'block-types-heading',
        type: 'Heading2',
        content: [{
            id: 'block-types-heading-content',
            type: ContentType.Text,
            content: 'Block Types'
        }]
    },
    {
        id: 'quote-block',
        type: 'Quote',
        content: [{
            id: 'quote-content',
            type: ContentType.Text,
            content: 'The Block Editor makes document creation a seamless experience with its intuitive block-based approach.',
            styles: {
                italic: true
            }
        }]
    },
    {
        id: 'list-types-heading',
        type: 'Heading3',
        content: [{
            id: 'list-types-heading-content',
            type: ContentType.Text,
            content: 'List Types'
        }]
    },
    {
        id: 'bullet-list-header',
        type: 'BulletList',
        content: [{
            id: 'bullet-list-header-content',
            type: ContentType.Text,
            content: 'Text blocks: Paragraph, Heading 1-4, Quote, Callout',
            styles: {
                bold: true
            }
        }]
    },
    {
        id: 'numbered-list',
        type: 'NumberedList',
        content: [{
            id: 'numbered-list-content',
            type: ContentType.Text,
            content: 'Lists: Bullet lists, Numbered lists, Check lists'
        }]
    },
    {
        id: 'check-list',
        type: 'CheckList',
        isChecked: true,
        content: [{
            id: 'check-list-content',
            type: ContentType.Text,
            content: 'Special blocks: Divider, Toggle, Code block'
        }]
    },
    {
        id: 'divider-block',
        type: 'Divider',
        content: []
    },
    {
        id: 'formatting-heading',
        type: 'Heading4',
        content: [{
            id: 'formatting-heading-content',
            type: ContentType.Text,
            content: 'Text Formatting Examples'
        }]
    },
    {
        id: 'formatting-examples',
        type: 'Paragraph',
        content: [
            {
                id: 'format-bold',
                type: ContentType.Text,
                content: 'Bold ',
                styles: {
                    bold: true
                }
            },
            {
                id: 'format-italic',
                type: ContentType.Text,
                content: 'Italic ',
                styles: {
                    italic: true
                }
            },
            {
                id: 'format-underline',
                type: ContentType.Text,
                content: 'Underline ',
                styles: {
                    underline: true
                }
            },
            {
                id: 'format-strikethrough',
                type: ContentType.Text,
                content: 'Strikethrough ',
                styles: {
                    strikethrough: true
                }
            },
            {
                id: 'format-superscript',
                type: ContentType.Text,
                content: 'Superscript ',
                styles: {
                    superscript: true
                }
            },
            {
                id: 'format-subscript',
                type: ContentType.Text,
                content: 'Subscript ',
                styles: {
                    subscript: true
                }
            },
            {
                id: 'format-uppercase',
                type: ContentType.Text,
                content: 'uppercase ',
                styles: {
                    uppercase: true
                }
            },
            {
                id: 'format-lowercase',
                type: ContentType.Text,
                content: 'LOWERCASE',
                styles: {
                    lowercase: true
                }
            }
        ]
    },
    {
        id: 'link-block',
        type: 'Paragraph',
        content: [
            {
                id: 'link-text',
                type: ContentType.Text,
                content: 'Visit '
            },
            {
                id: 'link-content',
                type: ContentType.Link,
                content: 'Syncfusion',
                linkSettings: {
                    url: 'https://www.syncfusion.com/',
                    openInNewWindow: true
                }
            },
            {
                id: 'link-text-end',
                type: ContentType.Text,
                content: ' for more information.'
            }
        ]
    },
    {
        id: 'label-block',
        type: 'Paragraph',
        content: [
            {
                id: 'label-text',
                type: ContentType.Text,
                content: 'This block contains a '
            },
            {
                id: 'progress',
                type: ContentType.Label,
            },
            {
                id: 'label-text-end',
                type: ContentType.Text,
                content: ' label.'
            }
        ]
    },
    {
        id: 'try-it-block',
        type: 'Paragraph',
        content: [{
            id: 'try-it-content',
            type: ContentType.Text,
            content: 'Try it out! Click anywhere and start typing, or type "/" to see available commands.',
            styles: {
                bold: true,
                bgColor: '#F8F9FA'
            }
        }]
    }
];

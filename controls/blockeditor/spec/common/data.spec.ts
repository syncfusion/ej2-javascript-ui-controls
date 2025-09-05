import { BlockModel, ContentType, BlockType } from "../../src/index";

export const allTypesOfBlock: BlockModel[] = [
    {
        id: 'heading-block',
        type: BlockType.Heading,
        props: { level: 1 },
        content: [{
            id: 'heading-content',
            type: ContentType.Text,
            content: 'Welcome to the Block Editor Demo!'
        }]
    },
    {
        id: 'intro-block',
        type: BlockType.Paragraph,
        content: [{
            id: 'intro-content',
            type: ContentType.Text,
            content: 'Block Editor is a powerful rich text editor',
        }]
    },
    {
        id: 'styled-paragraph',
        type: BlockType.Paragraph,
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
                props: {
                    styles: {
                        bold: true,
                        italic: true
                    }
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
                props: {
                    styles: {
                        bgColor: '#F0F0F0',
                        bold: true
                    }
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
        type: BlockType.Heading,
        props: { level: 2 },
        content: [{
            id: 'block-types-heading-content',
            type: ContentType.Text,
            content: 'Block Types'
        }]
    },
    {
        id: 'quote-block',
        type: BlockType.Quote,
        content: [{
            id: 'quote-content',
            type: ContentType.Text,
            content: 'The Block Editor makes document creation a seamless experience with its intuitive block-based approach.',
            props: {
                styles: {
                    italic: true
                }
            }
        }]
    },
    {
        id: 'list-types-heading',
        type: BlockType.Heading,
        props: { level: 3 },
        content: [{
            id: 'list-types-heading-content',
            type: ContentType.Text,
            content: 'List Types'
        }]
    },
    {
        id: 'bullet-list-header',
        type: BlockType.BulletList,
        content: [{
            id: 'bullet-list-header-content',
            type: ContentType.Text,
            content: 'Text blocks: Paragraph, Heading 1-4, Quote, Callout',
            props: {
                styles: {
                    bold: true
                }
            }
        }]
    },
    {
        id: 'numbered-list',
        type: BlockType.NumberedList,
        content: [{
            id: 'numbered-list-content',
            type: ContentType.Text,
            content: 'Lists: Bullet lists, Numbered lists, Check lists'
        }]
    },
    {
        id: 'check-list',
        type: BlockType.Checklist,
        props: { isChecked: true },
        content: [{
            id: 'check-list-content',
            type: ContentType.Text,
            content: 'Special blocks: Divider, Toggle, Code block'
        }]
    },
    {
        id: 'divider-block',
        type: BlockType.Divider,
        content: []
    },
    {
        id: 'formatting-heading',
        type: BlockType.Heading,
        props: { level: 4 },
        content: [{
            id: 'formatting-heading-content',
            type: ContentType.Text,
            content: 'Text Formatting Examples'
        }]
    },
    {
        id: 'formatting-examples',
        type: BlockType.Paragraph,
        content: [
            {
                id: 'format-bold',
                type: ContentType.Text,
                content: 'Bold ',
                props: {
                    styles: {
                        bold: true
                    }
                }
            },
            {
                id: 'format-italic',
                type: ContentType.Text,
                content: 'Italic ',
                props: {
                    styles: {
                        italic: true
                    }
                }
            },
            {
                id: 'format-underline',
                type: ContentType.Text,
                content: 'Underline ',
                props: {
                    styles: {
                        underline: true
                    }
                }
            },
            {
                id: 'format-strikethrough',
                type: ContentType.Text,
                content: 'Strikethrough ',
                props: {
                    styles: {
                        strikethrough: true
                    }
                }
            },
            {
                id: 'format-superscript',
                type: ContentType.Text,
                content: 'Superscript ',
                props: {
                    styles: {
                        superscript: true
                    }
                }
            },
            {
                id: 'format-subscript',
                type: ContentType.Text,
                content: 'Subscript ',
                props: {
                    styles: {
                        subscript: true
                    }
                }
            },
            {
                id: 'format-uppercase',
                type: ContentType.Text,
                content: 'uppercase ',
                props: {
                    styles: {
                        uppercase: true
                    }
                }
            },
            {
                id: 'format-lowercase',
                type: ContentType.Text,
                content: 'LOWERCASE',
                props: {
                    styles: {
                        lowercase: true
                    }
                }
            }
        ]
    },
    {
        id: 'link-block',
        type: BlockType.Paragraph,
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
                props: {
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
        type: BlockType.Paragraph,
        content: [
            {
                id: 'label-text',
                type: ContentType.Text,
                content: 'This block contains a '
            },
            {
                id: 'progress-label',
                type: ContentType.Label,
                props: {
                    labelId: 'progress'
                }
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
        type: BlockType.Paragraph,
        content: [{
            id: 'try-it-content',
            type: ContentType.Text,
            content: 'Try it out! Click anywhere and start typing, or type "/" to see available commands.',
            props: {
                styles: {
                    bold: true,
                    bgColor: '#F8F9FA'
                }
            }
        }]
    }
];

export const simpleArrayBlocks = [
    {
        "type": "Paragraph",
        "content": [
            {
                "id": "content-1",
                "content": "This is a simple paragraph block.",
                "type": "Text"
            }
        ]
    },
    {
        "type": "Heading",
        "content": [
            {
                "id": "content-2",
                "content": "This is a heading block",
                "type": "Text"
            }
        ]
    }
];

// 2. Object with Blocks Property
export const objectWithBlocksProperty = {
    "blocks": [
        {
            "type": "Paragraph",
            "content": [
                {
                    "id": "content-1",
                    "content": "This is a simple paragraph from an object with blocks property.",
                    "type": "Text"
                }
            ]
        },
        {
            "type": "Quote",
            "content": [
                {
                    "id": "content-2",
                    "content": "This is a quote block",
                    "type": "Text"
                }
            ]
        }
    ],
    "metadata": {
        "title": "Sample Document",
        "author": "Test User"
    }
};

// 3. Single Block Object
export const singleBlockObject = {
    "type": "Paragraph",
    "content": [
        {
            "id": "content-1",
            "content": "This is a single block object.",
            "type": "Text"
        }
    ]
};

// 4. Complex Block Structure with Nested Blocks
export const complexNestedBlocks = [
    {
        "type": "Paragraph",
        "content": [
            {
                "id": "content-1",
                "content": "This is a paragraph before a callout block.",
                "type": "Text"
            }
        ]
    },
    {
        "type": "Callout",
        "props": {
            "children": [
                {
                    "type": "Paragraph",
                    "content": [
                        {
                            "id": "nested-content-1",
                            "content": "This is a paragraph inside a callout.",
                            "type": "Text"
                        }
                    ]
                }
            ]
        }
    }
];

// 5. Blocks with Formatted Content
export const formattedContentBlocks = [
    {
        "type": "Paragraph",
        "content": [
            {
                "id": "content-1",
                "content": "This text has ",
                "type": "Text"
            },
            {
                "id": "content-2",
                "content": "bold formatting",
                "type": "Text",
                "props": {
                    "styles": { "bold": true }
                }
            },
            {
                "id": "content-3",
                "content": " and ",
                "type": "Text"
            },
            {
                "id": "content-4",
                "content": "italic text",
                "type": "Text",
                "props": {
                    "styles": { "italic": true }
                }
            },
            {
                "id": "content-5",
                "content": " as well.",
                "type": "Text"
            }
        ]
    }
];

// 6. List Block with Items
export const listBlocksWithItems = [
    {
        "type": "BulletList",
        "content": [
            {
                "id": "content-1",
                "content": "First list item",
                "type": "Text"
            }
        ]
    },
    {
        "type": "BulletList",
        "content": [
            {
                "id": "content-2",
                "content": "Second list item",
                "type": "Text"
            }
        ]
    },
    {
        "type": "BulletList",
        "content": [
            {
                "id": "content-3",
                "content": "Third list item",
                "type": "Text"
            }
        ]
    }
];

// 7. Blocks with Links
export const blocksWithLinks = [
    {
        "type": "Paragraph",
        "content": [
            {
                "id": "content-1",
                "content": "This paragraph contains a ",
                "type": "Text"
            },
            {
                "id": "content-2",
                "content": "hyperlink",
                "type": "Link",
                "props": {
                    "url": "https://example.com",
                    "openInNewWindow": true
                }
            },
            {
                "id": "content-3",
                "content": " to a website.",
                "type": "Text"
            }
        ]
    }
];

// 8. Code Block with Syntax Highlighting
export const codeBlockWithSyntaxHighlighting = [
    {
        "type": "Code",
        "content": [
            {
                "id": "content-1",
                "content": "function helloWorld() {\n  console.log('Hello, world!');\n}",
                "type": "Text"
            }
        ],
        "props": {
            "language": "javascript"
        }
    }
];

// 9. Toggle Block with Content
export const toggleBlockWithContent = [
    {
        "type": "CollapsibleParagraph",
        "content": [
            {
                "id": "toggle-title",
                "content": "Click to expand",
                "type": "Text"
            }
        ],
        "props": {
            "children": [
                {
                    "type": "Paragraph",
                    "content": [
                        {
                            "id": "toggle-content",
                            "content": "This content is inside a collapsible block.",
                            "type": "Text"
                        }
                    ]
                }
            ],
            "isExpanded": false
        }
    }
];

// 10. Mixed Block Types Document
export const mixedBlockTypesDocument = [
    {
        "type": "Heading",
        "content": [
            {
                "id": "title",
                "content": "Document Title",
                "type": "Text"
            }
        ]
    },
    {
        "type": "Paragraph",
        "content": [
            {
                "id": "intro",
                "content": "This is an introduction paragraph with multiple block types for testing.",
                "type": "Text"
            }
        ]
    },
    {
        "type": "Quote",
        "content": [
            {
                "id": "quote",
                "content": "This is a notable quote in the document.",
                "type": "Text"
            }
        ]
    },
    {
        "type": "BulletList",
        "content": [
            {
                "id": "list-item-1",
                "content": "First important point",
                "type": "Text"
            }
        ]
    },
    {
        "type": "BulletList",
        "content": [
            {
                "id": "list-item-2",
                "content": "Second important point",
                "type": "Text"
            }
        ]
    },
    {
        "type": "Divider",
        "content": []
    },
    {
        "type": "Paragraph",
        "content": [
            {
                "id": "conclusion",
                "content": "This is the conclusion paragraph.",
                "type": "Text"
            }
        ]
    }
];
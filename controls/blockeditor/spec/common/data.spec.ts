import { BlockModel } from "../../src/models/index";
import { BlockType, ContentType } from '../../src/models/enums';

export const allTypesOfBlock: BlockModel[] = [
    {
        id: 'demo-heading',
        blockType: BlockType.Heading,
        properties: { level: 2 },
        content: [
            { id: 'demo-heading-content', contentType: ContentType.Text, content: 'Welcome to the Block Editor Demo!' }
        ]
    },

    {
        id: 'demo-intro',
        blockType: BlockType.Paragraph,
        content: [
            { id: 'intro-t1', contentType: ContentType.Text, content: 'Welcome to the ' },
            { id: 'intro-bold', contentType: ContentType.Text, content: 'Block Editor', properties: { styles: { bold: true } } },
            { id: 'intro-t2', contentType: ContentType.Text, content: '! This demo highlights all supported block types and inline formatting options. Each section below explains the purpose of the block and shows how it appears in the editor.' }
        ]
    },

    {
        id: 'heading-paragraph',
        blockType: BlockType.Heading,
        properties: { level: 3 },
        content: [{ id: 'heading-paragraph-content', contentType: ContentType.Text, content: 'Paragraph' }]
    },

    {
        id: 'paragraph-explainer',
        blockType: BlockType.Paragraph,
        content: [
            { id: 'p-ex-1', contentType: ContentType.Text, content: 'Paragraph blocks are used for writing regular text. They are the most common block type and support inline formatting to enhance readability and emphasis.' }
        ]
    },

    {
        id: 'heading-inline-formatting',
        blockType: BlockType.Heading,
        properties: { level: 3 },
        content: [
            { id: 'heading-inline-formatting-content', contentType: ContentType.Text, content: 'Inline Formatting' }
        ]
    },

    // Core emphasis styles combined
    {
        id: 'inline-core-styles',
        blockType: BlockType.Paragraph,
        content: [
            { id: 'ics-1', contentType: ContentType.Text, content: 'Use ' },
            { id: 'ics-bold', contentType: ContentType.Text, content: 'bold', properties: { styles: { bold: true } } },
            { id: 'ics-2', contentType: ContentType.Text, content: ', ' },
            { id: 'ics-italic', contentType: ContentType.Text, content: 'italic', properties: { styles: { italic: true } } },
            { id: 'ics-3', contentType: ContentType.Text, content: ', and ' },
            { id: 'ics-underline', contentType: ContentType.Text, content: 'underline', properties: { styles: { underline: true } } },
            { id: 'ics-4', contentType: ContentType.Text, content: ' for emphasis; or ' },
            { id: 'ics-strike', contentType: ContentType.Text, content: 'strikethrough', properties: { styles: { strikethrough: true } } },
            { id: 'ics-5', contentType: ContentType.Text, content: ' to indicate removals or outdated text.' }
        ]
    },

    // Technical/semantic styles together
    {
        id: 'inline-technical-semantic',
        blockType: BlockType.Paragraph,
        content: [
            { id: 'its-1', contentType: ContentType.Text, content: 'Math and chemistry: E = mc' },
            { id: 'its-sup', contentType: ContentType.Text, content: '2', properties: { styles: { superscript: true } } },
            { id: 'its-2', contentType: ContentType.Text, content: ', H' },
            { id: 'its-sub', contentType: ContentType.Text, content: '2', properties: { styles: { subscript: true } } },
            { id: 'its-3', contentType: ContentType.Text, content: 'O - with superscript and subscript. Add inline code ' },
            { id: 'its-4', contentType: ContentType.Text, content: ' and helpful ' },
            { id: 'its-link', contentType: ContentType.Link, content: 'links', properties: { url: 'https://ej2.syncfusion.com/documentation/block-editor/getting-started' } },
            { id: 'its-5', contentType: ContentType.Text, content: ' for quick references.' }
        ]
    },

    // Transform and color styles, plus mention/label in one line
    {
        id: 'inline-transforms-colors',
        blockType: BlockType.Paragraph,
        content: [
            { id: 'itc-1', contentType: ContentType.Text, content: 'Transform text to ' },
            { id: 'itc-upper', contentType: ContentType.Text, content: 'uppercase', properties: { styles: { uppercase: true } } },
            { id: 'itc-2', contentType: ContentType.Text, content: ' or ' },
            { id: 'itc-lower', contentType: ContentType.Text, content: 'LOWERCASE', properties: { styles: { lowercase: true } } },
            { id: 'itc-3', contentType: ContentType.Text, content: '. Add ' },
            { id: 'itc-color', contentType: ContentType.Text, content: 'color', properties: { styles: { color: 'green' } } },
            { id: 'itc-4', contentType: ContentType.Text, content: ' or ' },
            { id: 'itc-bg', contentType: ContentType.Text, content: 'background highlights', properties: { styles: { backgroundColor: '#FEF3C7', color: '#92400E' } } },
            { id: 'itc-5', contentType: ContentType.Text, content: ' as needed. Mention ' },
            { id: 'itc-mention', contentType: ContentType.Mention, properties: { userId: 'user1' } },
            { id: 'itc-6', contentType: ContentType.Text, content: ' and tag with ' },
            { id: 'itc-label', contentType: ContentType.Label, properties: { labelId: 'progress' } },
            { id: 'itc-7', contentType: ContentType.Text, content: ' to add context.' }
        ]
    },

    {
        id: 'heading-headings',
        blockType: BlockType.Heading,
        properties: { level: 3 },
        content: [{ id: 'heading-headings-content', contentType: ContentType.Text, content: 'Headings' }]
    },
    {
        id: 'headings-paragraph',
        blockType: BlockType.Paragraph,
        content: [
            { id: 'hp-1', contentType: ContentType.Text, content: 'Headings help organize content into sections. Use different levels ' },
            { id: 'hp-2', contentType: ContentType.Text, content: '(h1, h2, h3 or h4)', properties: { styles: { bold: true } } },
            { id: 'hp-3', contentType: ContentType.Text, content: ' to create a hierarchy:' }
        ]
    },

    {
        id: 'heading-quote',
        blockType: BlockType.Heading,
        properties: { level: 3 },
        content: [{ id: 'heading-quote-content', contentType: ContentType.Text, content: 'Quote' }]
    },

    {
        id: 'quote-explainer',
        blockType: BlockType.Paragraph,
        content: [
            { id: 'q-ex-1', contentType: ContentType.Text, content: 'Use quote blocks to emphasize important statements or references.' }
        ]
    },

    {
        id: 'quote-block',
        blockType: BlockType.Quote,
        content: [
            { id: 'quote-text', contentType: ContentType.Text, content: '“Quotes are perfect for highlighting key messages or testimonials.”' }
        ]
    },

    {
        id: 'heading-callout',
        blockType: BlockType.Heading,
        properties: { level: 3 },
        content: [{ id: 'heading-callout-content', contentType: ContentType.Text, content: 'Callout' }]
    },

    {
        id: 'callout-explainer',
        blockType: BlockType.Paragraph,
        content: [
            { id: 'co-ex-1', contentType: ContentType.Text, content: 'Callouts are great for tips, warnings, or notes that need attention.' }
        ]
    },

    {
        id: 'callout-tip',
        blockType: BlockType.Callout,
        properties: {
            children: [
                {
                    id: 'callout-tip-p',
                    blockType: BlockType.Paragraph,
                    content: [
                        { id: 'co-1', contentType: ContentType.Text, content: 'Tip: ', properties: { styles: { bold: true } } },
                        { id: 'co-2', contentType: ContentType.Text, content: 'Use the ' },
                        { id: 'co-4', contentType: ContentType.Text, content: 'command to quickly insert blocks like headings, lists, or code.' }
                    ]
                }
            ]
        }
    },

    {
        id: 'heading-checklist',
        blockType: BlockType.Heading,
        properties: { level: 3 },
        content: [{ id: 'heading-checklist-content', contentType: ContentType.Text, content: 'Checklist' }]
    },

    {
        id: 'checklist-desc',
        blockType: BlockType.Paragraph,
        content: [
            { id: 'cl-d-1', contentType: ContentType.Text, content: 'Checklists help track tasks or steps:' }
        ]
    },

    {
        id: 'checklist-item-2',
        blockType: BlockType.Checklist,
        properties: { isChecked: true },
        content: [{ id: 'cli-2', contentType: ContentType.Text, content: 'Apply inline formatting' }]
    },
    {
        id: 'checklist-item-3',
        blockType: BlockType.Checklist,
        content: [
            { id: 'cli-3-t1', contentType: ContentType.Text, content: 'Invite reviewer ' },
            { id: 'cli-3-mention', contentType: ContentType.Mention, properties: { userId: 'user-john' } }
        ]
    },
    {
        id: 'checklist-item-4',
        blockType: BlockType.Checklist,
        content: [
            { id: 'cli-4-t1', contentType: ContentType.Text, content: 'Publish guide and share ' },
            { id: 'cli-4-link', contentType: ContentType.Link, content: 'the link', properties: { url: 'https://ej2.syncfusion.com/documentation/block-editor/getting-started' } }
        ]
    },

    {
        id: 'heading-lists',
        blockType: BlockType.Heading,
        properties: { level: 3 },
        content: [{ id: 'heading-lists-content', contentType: ContentType.Text, content: 'Lists' }]
    },

    {
        id: 'lists-desc',
        blockType: BlockType.Paragraph,
        content: [
            { id: 'ld-1', contentType: ContentType.Text, content: 'Lists organize information clearly:' }
        ]
    },

    {
        id: 'bullet-item-head',
        blockType: BlockType.BulletList,
        content: [{ id: 'bl-head-t', contentType: ContentType.Text, content: 'Unordered List', properties: { styles: { bold: true } } }]
    },
    {
        id: 'bullet-item-1',
        blockType: BlockType.BulletList,
        indent: 1,
        content: [{ id: 'bl-1-t', contentType: ContentType.Text, content: 'Concise points for quick scanning' }]
    },
    {
        id: 'bullet-item-2',
        blockType: BlockType.BulletList,
        indent: 1,
        content: [{ id: 'bl-2-t', contentType: ContentType.Text, content: 'Great for features or tips' }]
    },
    {
        id: 'bullet-item-3',
        blockType: BlockType.BulletList,
        indent: 1,
        content: [{ id: 'bl-3-t', contentType: ContentType.Text, content: 'Easy to reorder and nest' }]
    },

    {
        id: 'numbered-item-head',
        blockType: BlockType.NumberedList,
        content: [{ id: 'nl-head-t', contentType: ContentType.Text, content: 'Ordered List', properties: { styles: { bold: true } } }]
    },
    {
        id: 'numbered-item-1',
        blockType: BlockType.NumberedList,
        indent: 1,
        content: [{ id: 'nl-1-t', contentType: ContentType.Text, content: 'Start a new document' }]
    },
    {
        id: 'numbered-item-2',
        blockType: BlockType.NumberedList,
        indent: 1,
        content: [{ id: 'nl-2-t', contentType: ContentType.Text, content: 'Add structure with headings' }]
    },
    {
        id: 'numbered-item-3',
        blockType: BlockType.NumberedList,
        indent: 1,
        content: [{ id: 'nl-3-t', contentType: ContentType.Text, content: 'Fill in content and review' }]
    },

    {
        id: 'heading-code-block',
        blockType: BlockType.Heading,
        properties: { level: 3 },
        content: [{ id: 'heading-code-block-content', contentType: ContentType.Text, content: 'Code Block' }]
    },

    {
        id: 'code-desc',
        blockType: BlockType.Paragraph,
        content: [
            { id: 'cd-1', contentType: ContentType.Text, content: 'Use code blocks to display syntax-highlighted code snippets for technical documentation or tutorials.' }
        ]
    },

    {
        id: 'code-snippet',
        blockType: BlockType.Code,
        content: [
            {
                id: 'code-snippet-code',
                contentType: ContentType.Text,
                content: "function greet(name) {\n  return `Hello, ${name}!`;\n}"
            }
        ]
    },

    {
        id: 'heading-image',
        blockType: BlockType.Heading,
        properties: { level: 3 },
        content: [{ id: 'heading-image-content', contentType: ContentType.Text, content: 'Image Block' }]
    },

    {
        id: 'image-desc',
        blockType: BlockType.Paragraph,
        content: [
            { id: 'img-d-1', contentType: ContentType.Text, content: 'Image blocks allow you to insert visuals to support or enhance your content.' }
        ]
    },

    {
        id: 'image-block',
        blockType: BlockType.Image,
        properties: {
            src: 'https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png',
            alt: 'Block Editor Image'
        }
    },

    {
        id: 'heading-toggle',
        blockType: BlockType.Heading,
        properties: { level: 3 },
        content: [{ id: 'heading-toggle-content', contentType: ContentType.Text, content: 'Toggle Block' }]
    },

    {
        id: 'toggle-desc',
        blockType: BlockType.Paragraph,
        content: [{ id: 'tc-2', contentType: ContentType.Text, content: 'Toggle blocks are interactive and help manage long or optional content.' }]
    },

    {
        id: 'toggle-block',
        blockType: BlockType.CollapsibleParagraph,
        content: [
            { id: 'toggle-title', contentType: ContentType.Text, content: 'Click to expand', properties: { styles: { bold: true } } }
        ],
        properties: {
            isExpanded: false,
            children: [
                {
                    id: 'toggle-child-1',
                    blockType: BlockType.Paragraph,
                    content: [{ id: 'tc-1', contentType: ContentType.Text, content: 'This is a toggle block. You can hide or show content as needed. Useful for FAQs or detailed sections.' }]
                }
            ]
        }
    },

    {
        id: 'heading-divider',
        blockType: BlockType.Heading,
        properties: { level: 3 },
        content: [{ id: 'heading-divider-content', contentType: ContentType.Text, content: 'Divider' }]
    },


    {
        id: 'divider-desc',
        blockType: BlockType.Paragraph,
        content: [
            { id: 'dd-1', contentType: ContentType.Text, content: 'Dividers are horizontal lines used to separate sections or indicate a break in content.' }
        ]
    },

    { id: 'demo-divider-2', blockType: BlockType.Divider },

    { id: 'new-empty', blockType: BlockType.Paragraph },
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
        "properties": {
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
                "properties": {
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
                "properties": {
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
                "properties": {
                    "url": "https://example.com"
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
        "properties": {
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
        "properties": {
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
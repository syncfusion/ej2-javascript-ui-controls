import { WebMcpTool } from '../base/interface';

// Define the WebMCP tools for Rich Text Editor
export const webMcpTools: WebMcpTool[] = [
    {
        name: 'getContent',
        description: 'Reads the complete HTML content currently inside the Rich Text Editor as a single string. Use this tool ONLY when you need to inspect, analyze, or export the entire document - for example to summarize the content, verify a previous edit, or read the document before a large restructure. DO NOT use it to read a selection; use getSelectedHtml instead. This is a read-only tool: it never modifies content.',
        inputSchema: {
            type: 'object',
            properties: {}
        },
        outputSchema: {
            type: 'object',
            properties: {
                content: {
                    type: 'string',
                    description: 'The HTML content of the editor',
                    minLength: 0
                }
            },
            required: ['content']
        },
        annotations: { readOnlyHint: true }
    },
    {
        name: 'getSelectedHtml',
        description: 'Reads the HTML content of the current selection as a string. Use this tool when you need to inspect exactly what the user has selected. It returns an empty string when nothing is selected. DO NOT use it to read the whole document; use getContent instead.',
        inputSchema: {
            type: 'object',
            properties: {}
        },
        outputSchema: {
            type: 'object',
            properties: {
                selectedHtml: { type: 'string', description: 'The HTML content of the selected area' }
            },
            required: ['selectedHtml']
        },
        annotations: { readOnlyHint: true }
    },
    {
        name: 'selectAllContent',
        description: 'Selects all content inside the Rich Text Editor so a following bulk operation can act on the entire document - such as formatSelectedContent, clearFormatting, or insertContent replacing the selection. Use this tool ONLY when an operation explicitly requires a full-document selection.',
        inputSchema: {
            type: 'object',
            properties: {}
        },
        outputSchema: {
            type: 'object',
            properties: {}
        },
        annotations: { readOnlyHint: true }
    },
    {
        name: 'showDialog',
        description: 'Opens one of the built-in dialogs of the Rich Text Editor so the user can insert or edit an element through the UI: InsertLink, InsertImage, InsertAudio, InsertVideo, or InsertTable. Use this tool when the user should provide the details manually in the dialog instead of receiving a programmatic insertion. MODULE REQUIREMENTS: InsertLink needs the Link module, InsertImage needs the Image module, InsertAudio needs the Audio module, InsertVideo needs the Video module, and InsertTable needs the Table module. If this tool returns a [MODULE_UNAVAILABLE] error, treat it as FINAL - do NOT retry and do NOT insert that element through insertContent as a workaround. Inform the user that the required module is not injected.',
        inputSchema: {
            type: 'object',
            properties: {
                type: {
                    type: 'string',
                    description: 'The type of dialog to show (InsertLink, InsertImage, InsertAudio, InsertVideo, InsertTable). HTML5 compliant dialog types for content insertion',
                    enum: ['InsertLink', 'InsertImage', 'InsertAudio', 'InsertVideo', 'InsertTable']
                }
            },
            required: ['type']
        },
        outputSchema: {
            type: 'object',
            properties: {}
        },
        annotations: { readOnlyHint: false }
    },
    {
        name: 'closeDialog',
        description: 'Closes one of the built-in dialogs of the Rich Text Editor that is currently open: InsertLink, InsertImage, InsertAudio, InsertVideo, or InsertTable. Use this tool when a previously opened dialog must be dismissed programmatically. MODULE REQUIREMENTS: InsertLink needs the Link module, InsertImage needs the Image module, InsertAudio needs the Audio module, InsertVideo needs the Video module, and InsertTable needs the Table module. If this tool returns a [MODULE_UNAVAILABLE] error, treat it as FINAL and inform the user that the required module is not injected.',
        inputSchema: {
            type: 'object',
            properties: {
                type: {
                    type: 'string',
                    description: 'The type of dialog to close (InsertLink, InsertImage, InsertAudio, InsertVideo, InsertTable). HTML5 compliant dialog types for content insertion',
                    enum: ['InsertLink', 'InsertImage', 'InsertAudio', 'InsertVideo', 'InsertTable']
                }
            },
            required: ['type']
        },
        outputSchema: {
            type: 'object',
            properties: {}
        },
        annotations: { readOnlyHint: false }
    },
    {
        name: 'insertContent',
        description: 'Inserts new plain text or basic HTML (paragraphs, headings, spans, simple inline tags) at the current cursor position, replacing the current selection if one exists. Use this tool ONLY for simple content insertion such as writing a sentence, a paragraph, or a basic formatted fragment. DO NOT use this tool for: 1) hyperlinks or URLs - use insertLink; 2) tables - use insertTable; 3) images - use insertImage; 4) code blocks - use setCodeBlock; 5) formatting selected content - use formatSelectedContent; 6) changing block structure - use setBlockType. FALLBACK PROHIBITION: if insertLink, insertTable, insertImage, or setCodeBlock returns a [MODULE_UNAVAILABLE] error, treat it as FINAL - do NOT retry that tool and do NOT insert the same content through this tool. Specifically: never insert a URL as plain text when insertLink is unavailable; never insert table markup as HTML when insertTable is unavailable; never insert <img> tags as HTML when insertImage is unavailable; never insert code as plain text or inside <pre> tags when setCodeBlock is unavailable. Instead, stop and inform the user that the required module is not injected.',
        inputSchema: {
            type: 'object',
            properties: {
                content: {
                    type: 'string',
                    description: 'The HTML or text content to insert',
                    minLength: 1
                },
                contentType: {
                    type: 'string',
                    description: 'Specifies if content is html or text. HTML5 content type specification',
                    enum: ['html', 'text']
                }
            },
            required: ['content']
        },
        outputSchema: {
            type: 'object',
            properties: {}
        },
        annotations: { readOnlyHint: false }
    },
    {
        name: 'formatSelectedContent',
        description: 'Applies inline text formatting to the currently selected content. Use this tool to change the appearance of the selection using one of the formatType values: bold, italic, underline, strikeThrough, superscript, subscript, uppercase, or lowercase. This tool handles inline formatting only - use setBlockType for block structure (headings, paragraphs), setTextAlignment for alignment, and applyNumberedListFormat or applyBulletedListFormat for lists.',
        inputSchema: {
            type: 'object',
            properties: {
                formatType: {
                    type: 'string',
                    description: 'The type of formatting to apply. HTML5 text formatting options: bold (<b>), italic (<i>), underline (<u>), strikeThrough (<strike>), superscript (<sup>), subscript (<sub>), uppercase (CSS), lowercase (CSS)',
                    enum: ['bold', 'italic', 'underline', 'strikeThrough', 'superscript', 'subscript', 'uppercase', 'lowercase', 'fontColor', 'backColor', 'fontName', 'fontSize']
                }
            },
            required: ['formatType']
        },
        outputSchema: {
            type: 'object',
            properties: {}
        },
        annotations: { readOnlyHint: false }
    },
    {
        name: 'setBlockType',
        description: 'Changes the block element wrapping the current selection or cursor line - for example converting a paragraph into a heading, or a heading back into a paragraph. Use this tool for block-level structure: headings (H1-H6), paragraphs (P), block quotes (BlockQuote), and plain preformatted text (PRE). Use PRE ONLY when the user wants simple preformatted or monospaced text with no programming language and no syntax highlighting. When the user wants to insert actual code together with its programming language and syntax highlighting, use the setCodeBlock tool instead of this tool. DOWNGRADE RULE: if setCodeBlock returned a [MODULE_UNAVAILABLE] error, do NOT use this tool with PRE as an automatic fallback to insert that same code. Only use PRE for that content if the user explicitly accepts plain preformatted text without highlighting; otherwise inform the user that the CodeBlock module must be injected.',
        inputSchema: {
            type: 'object',
            properties: {
                blockType: {
                    type: 'string',
                    description: 'The block type to apply: P (paragraph), H1-H6 (headings), BlockQuote, or PRE (plain preformatted text with no syntax highlighting - for code with a language, use the setCodeBlock tool instead)',
                    enum: ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'PRE', 'BlockQuote']
                }
            },
            required: ['blockType']
        },
        outputSchema: {
            type: 'object',
            properties: {}
        },
        annotations: { readOnlyHint: false }
    },
    {
        name: 'setTextAlignment',
        description: 'Sets the horizontal text alignment of the selected content: justifyCenter, justifyFull, justifyLeft, or justifyRight. Use this tool when the user wants to center a title, right-align a signature, justify a paragraph, or restore left alignment.',
        inputSchema: {
            type: 'object',
            properties: {
                alignment: {
                    type: 'string',
                    description: 'The alignment to apply. HTML5 text alignment values: justifyCenter (text-align: center), justifyFull (text-align: justify), justifyLeft (text-align: left), justifyRight (text-align: right)',
                    enum: ['justifyCenter', 'justifyFull', 'justifyLeft', 'justifyRight']
                }
            },
            required: ['alignment']
        },
        outputSchema: {
            type: 'object',
            properties: {}
        },
        annotations: { readOnlyHint: false }
    },
    {
        name: 'insertLink',
        description: 'Inserts a hyperlink at the current cursor position, or converts the selected text into a hyperlink. Use this tool when the user asks to add a link, reference, citation, or navigation to an external resource. REQUIRES the Link module. If this tool returns a [MODULE_UNAVAILABLE] error, treat it as FINAL - do NOT retry, do NOT insert the URL as plain text through insertContent, and do NOT insert raw anchor markup as HTML. Inform the user that the Link module must be injected before links can be inserted.',
        inputSchema: {
            type: 'object',
            properties: {
                url: {
                    type: 'string',
                    description: 'The URL for the hyperlink',
                    format: 'uri',
                    minLength: 1
                },
                text: {
                    type: 'string',
                    description: 'The display text for the link (defaults to URL if not provided)',
                    minLength: 1
                },
                title: {
                    type: 'string',
                    description: 'The title attribute for the link',
                    minLength: 1
                },
                target: {
                    type: 'string',
                    description: 'The target attribute for the link (_blank, _self, etc.)',
                    enum: ['_blank', '_self', '_parent', '_top']
                }
            },
            required: ['url']
        },
        outputSchema: {
            type: 'object',
            properties: {}
        },
        annotations: { readOnlyHint: false }
    },
    {
        name: 'insertTable',
        description: 'Inserts a table with the specified number of rows and columns at the current cursor position. Use this tool when the user needs structured, comparative, or tabular data. The optional width parameter configures minWidth, maxWidth, and width in pixels. REQUIRES the Table module. If this tool returns a [MODULE_UNAVAILABLE] error, treat it as FINAL - do NOT retry and do NOT insert raw table markup through insertContent. Inform the user that the Table module must be injected before tables can be inserted.',
        inputSchema: {
            type: 'object',
            properties: {
                rows: {
                    type: 'integer',
                    description: 'The number of rows in the table',
                    minimum: 1,
                    maximum: 100
                },
                columns: {
                    type: 'integer',
                    description: 'The number of columns in the table',
                    minimum: 1,
                    maximum: 50
                },
                width: {
                    type: 'object',
                    description: 'The width configuration for the table',
                    properties: {
                        minWidth: {
                            type: 'integer',
                            description: 'Minimum width in pixels',
                            minimum: 0,
                            maximum: 2000
                        },
                        maxWidth: {
                            type: 'integer',
                            description: 'Maximum width in pixels',
                            minimum: 0,
                            maximum: 2000
                        },
                        width: {
                            type: 'integer',
                            description: 'Width in pixels',
                            minimum: 0,
                            maximum: 2000
                        }
                    }
                }
            },
            required: ['rows', 'columns']
        },
        outputSchema: {
            type: 'object',
            properties: {}
        },
        annotations: { readOnlyHint: false }
    },
    {
        name: 'insertImage',
        description: 'Inserts an image at the current cursor position using the given URL, with optional alt text, dimensions, and CSS classes. Use this tool when the user wants to enrich the content with a visual element. REQUIRES the Image module. If this tool returns a [MODULE_UNAVAILABLE] error, treat it as FINAL - do NOT retry and do NOT insert <img> tags or markdown image syntax through insertContent. Inform the user that the Image module must be injected before images can be inserted.',
        inputSchema: {
            type: 'object',
            properties: {
                url: {
                    type: 'string',
                    description: 'The URL of the image to insert',
                    format: 'uri',
                    minLength: 1
                },
                altText: {
                    type: 'string',
                    description: 'Alternative text for the image',
                    minLength: 1
                },
                width: {
                    type: 'object',
                    description: 'Width configuration',
                    properties: {
                        minWidth: {
                            type: 'integer',
                            description: 'Minimum width in pixels',
                            minimum: 0,
                            maximum: 2000
                        },
                        maxWidth: {
                            type: 'integer',
                            description: 'Maximum width in pixels',
                            minimum: 0,
                            maximum: 2000
                        },
                        width: {
                            type: 'integer',
                            description: 'Width in pixels',
                            minimum: 0,
                            maximum: 2000
                        }
                    }
                },
                height: {
                    type: 'object',
                    description: 'Height configuration',
                    properties: {
                        minHeight: {
                            type: 'integer',
                            description: 'Minimum height in pixels',
                            minimum: 0,
                            maximum: 2000
                        },
                        maxHeight: {
                            type: 'integer',
                            description: 'Maximum height in pixels',
                            minimum: 0,
                            maximum: 2000
                        },
                        height: {
                            type: 'integer',
                            description: 'Height in pixels',
                            minimum: 0,
                            maximum: 2000
                        }
                    }
                },
                cssClass: {
                    type: 'string',
                    description: 'CSS classes to apply to the image',
                    pattern: '^[a-zA-Z0-9-_ ]+$'
                }
            },
            required: ['url']
        },
        outputSchema: {
            type: 'object',
            properties: {}
        },
        annotations: { readOnlyHint: false }
    },
    {
        name: 'undoLastAction',
        description: 'Reverts the most recent change made in the editor. Use this tool when the user asks to undo an unwanted insertion, deletion, or formatting change. Each call steps one entry back in the undo stack; call repeatedly to undo multiple actions.',
        inputSchema: {
            type: 'object',
            properties: {}
        },
        outputSchema: {
            type: 'object',
            properties: {}
        },
        annotations: { readOnlyHint: false }
    },
    {
        name: 'redoLastAction',
        description: 'Re-applies the most recent action that was undone. Use this tool when the user asks to redo after an undo. Each call steps one entry forward in the redo stack; call repeatedly to redo multiple actions.',
        inputSchema: {
            type: 'object',
            properties: {}
        },
        outputSchema: {
            type: 'object',
            properties: {}
        },
        annotations: { readOnlyHint: false }
    },
    {
        name: 'clearFormatting',
        description: 'Removes all inline formatting from the selected content and resets it to the default style. Use this tool when the user wants to clean up inconsistent styling from pasted or heavily edited text. This tool affects inline formatting only - it does not change block structure (use setBlockType) or alignment (use setTextAlignment).',
        inputSchema: {
            type: 'object',
            properties: {
            }
        },
        outputSchema: {
            type: 'object',
            properties: {}
        },
        annotations: { readOnlyHint: false }
    },
    {
        name: 'printContent',
        description: 'Opens the browser print dialog for the Rich Text Editor content so the user can produce a physical or PDF copy. Use this tool when the user asks to print or export the document. This tool never modifies content.',
        inputSchema: {
            type: 'object',
            properties: {}
        },
        outputSchema: {
            type: 'object',
            properties: {}
        },
        annotations: { readOnlyHint: true }
    },
    {
        name: 'setCodeBlock',
        description: 'Inserts a syntax-highlighted code block at the current cursor position for the specified programming language. Use this tool whenever the user wants to insert code - a snippet, a command line, or configuration - identified with its language. REQUIRES the CodeBlock module. If the user only wants plain preformatted text without any language or syntax highlighting, use setBlockType with PRE instead. If this tool returns a [MODULE_UNAVAILABLE] error, treat it as FINAL - do NOT retry, do NOT downgrade to setBlockType with PRE, and do NOT insert the code as plain text or inside a <pre> tag through insertContent. Inform the user that the CodeBlock module must be injected; the user may then explicitly choose plain preformatted text via setBlockType with PRE as an alternative.',
        inputSchema: {
            type: 'object',
            properties: {
                language: {
                    type: 'string',
                    description: 'The programming language for syntax highlighting (e.g., JavaScript, TypeScript, Python, HTML, CSS)',
                    minLength: 1
                },
                label: {
                    type: 'string',
                    description: 'The display label for the code block (e.g., JavaScript, TypeScript, Python)',
                    minLength: 1
                }
            },
            required: ['language', 'label']
        },
        outputSchema: {
            type: 'object',
            properties: {}
        },
        annotations: { readOnlyHint: false }
    },
    {
        name: 'applyNumberedListFormat',
        description: 'Applies a numbered (ordered) list to the selected content or the current line with the chosen numbering style - for example decimal (1, 2, 3), lowerRoman (i, ii, iii), or upperAlpha (A, B, C). Use this tool when the user wants a numbered list or wants to change the numbering style of an existing one. Use the value none to remove numbered list formatting.',
        inputSchema: {
            type: 'object',
            properties: {
                style: {
                    type: 'string',
                    description: 'The numbering style to apply',
                    enum: ['decimal', 'lowergreek', 'lowerroman', 'upperalpha', 'loweralpha', 'upperroman', 'none']
                }
            },
            required: ['style']
        },
        outputSchema: {
            type: 'object',
            properties: {}
        },
        annotations: { readOnlyHint: false }
    },
    {
        name: 'applyBulletedListFormat',
        description: 'Applies a bulleted (unordered) list to the selected content or the current line with the chosen bullet style - disc, circle, or square. Use this tool when the user wants a bulleted list or wants to change the bullet style of an existing one. Use the value none to remove bulleted list formatting.',
        inputSchema: {
            type: 'object',
            properties: {
                style: {
                    type: 'string',
                    description: 'The bullet style to apply',
                    enum: ['disc', 'circle', 'square', 'none']
                }
            },
            required: ['style']
        },
        outputSchema: {
            type: 'object',
            properties: {}
        },
        annotations: { readOnlyHint: false }
    },
    {
        name: 'insertBR',
        description: 'Inserts a line break (<br>) at the current cursor position. Use this tool when the user wants to add a line break without creating a new paragraph. This creates a soft line break that preserves the current block context.',
        inputSchema: {
            type: 'object',
            properties: {}
        },
        outputSchema: {
            type: 'object',
            properties: {}
        },
        annotations: { readOnlyHint: false }
    }
];

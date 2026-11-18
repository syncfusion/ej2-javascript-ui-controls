import { WebMcpTool } from '../base/events-helper';

/**
 * WebMCP Tool Definitions for DocumentEditor
 * Contains all available tools for AI automation workflows
 * @private
 */
export const webMcpTools: WebMcpTool[] = [
    {
        name: 'saveDocument',
        annotations: { readOnlyHint: false },
        description: 'Save or export the current document to a file in the specified format. Use when the user asks to save, download, export, or generate a document file. Supports Docx, Dotx, Txt, and Sfdt formats—choose Docx for standard Word documents, Sfdt for preserving Syncfusion formatting, or Txt for plain text export. The fileName specifies the output file name and formatType determines the export format. This operation does not modify document content.',
        inputSchema: {
            type: 'object',
            properties: {
                fileName: {
                    type: 'string',
                    description: 'Output file name without extension (e.g., "report", "invoice"). The appropriate extension (.docx, .dotx, .txt, or .sfdt) will be added automatically based on formatType. Required.'
                },
                formatType: {
                    type: 'string',
                    enum: ['Docx', 'Dotx', 'Txt', 'Sfdt'],
                    description: 'Export format: "Docx" for standard Microsoft Word (.docx), "Dotx" for Word template (.dotx), "Txt" for plain text (.txt), or "Sfdt" for Syncfusion format (.sfdt). Use Docx for most cases; use Sfdt to preserve all Syncfusion-specific formatting and metadata; use Txt for simple text extraction.'
                }
            },
            required: ['fileName']
        },
        outputSchema: {
            type: 'object',
            properties: {
                action: { type: 'string', description: 'Echoes "saveDocument".' },
                message: { type: 'string', description: 'Human-readable status message or error details.' }
            },
            required: []
        }
    },
    {
        name: 'getDocumentBookmarks',
        annotations: { readOnlyHint: true },
        description: 'Retrieve all bookmark names available in the current document. Use when the user asks to view bookmarks, inspect document structure, identify navigation points, or locate bookmarked content anchors. Returns a list of bookmark names. This operation does not modify the document.',
        inputSchema: {
            type: 'object',
            properties: {},
            description: 'No input parameters required. Returns all available bookmarks in the current document.',
            required: []
        },
        outputSchema: {
            type: 'object',
            properties: {
                action: { type: 'string', description: 'Echoes "getDocumentBookmarks".' },
                bookmarks: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'List of bookmark names available in the document. Empty array if no bookmarks exist.'
                },
                message: { type: 'string', description: 'Status message indicating successful retrieval or error details.' }
            },
            required: ['bookmarks']
        }
    },
    {
        name: 'configureDocumentEditorSettings',
        annotations: { readOnlyHint: false },
        description: 'Configure DocumentEditor appearance and behavior settings. Use when the user asks to customize the editor, show/hide UI elements, adjust display options, or manage editor preferences. Supports settings like showRuler, showBookmarks, showHiddenMarks, showNavigationPane, fontFamilies, and optimizeSfdt. Returns success confirmation. This operation modifies editor settings but not document content.',
        inputSchema: {
            type: 'object',
            properties: {
                showRuler: {
                    type: 'boolean',
                    description: 'When true, display horizontal and vertical rulers on the editor canvas for measurement/alignment. When false, hide rulers. Affects editor UI appearance only, not content.'
                },
                showBookmarks: {
                    type: 'boolean',
                    description: 'When true, display square brackets [ ] around all bookmarked content for visual identification. When false, hide bracket indicators. Useful for previewing document structure.'
                },
                showHiddenMarks: {
                    type: 'boolean',
                    description: 'When true, display hidden paragraph marks as ¶. When false, hide these marks. Use for inspecting invisible formatting or troubleshooting layout.'
                },
                showNavigationPane: {
                    type: 'boolean',
                    description: 'When true, display the navigation pane panel showing document structure (headings). When false, hide the pane. Useful for large document navigation.'
                },
                fontFamilies: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Array of font family names to display in the editor font selector (e.g., ["Arial", "Calibri", "Georgia"]). Use to limit available fonts or customize the font menu. Omit to use default system fonts.'
                },
                optimizeSfdt: {
                    type: 'boolean',
                    description: 'When true, minimize SFDT file size by compressing content during save/export. Reduces file size but may impact compatibility with some editors. Use for distribution or storage optimization.'
                }
            },
            description: 'All settings are optional. Pass only properties you want to change; omitted properties keep their current state.'
        },
        outputSchema: {
            type: 'object',
            properties: {
                action: { type: 'string', description: 'Echoes "configureDocumentEditorSettings".' },
                message: { type: 'string', description: 'Confirmation message or error details.' }
            },
            required: []
        }
    },
    {
        name: 'find',
        annotations: { readOnlyHint: true },
        description: 'Search for the next occurrence of specified text within the current document. Use when the user asks to find, search, locate, navigate to, or highlight specific content. Supports optional case-sensitive and whole-word matching for precise searches. Returns matching result information and location. This operation does not modify the document. Prefer findAll when all occurrences are needed.',
        inputSchema: {
            type: 'object',
            properties: {
                text: {
                    type: 'string',
                    description: 'Search text to find in the document. Can be a single word, phrase, or partial string. Required. Matching is substring-based by default.'
                },
                matchCase: {
                    type: 'boolean',
                    description: 'When true, search requires exact letter casing ("PDF" will not match "pdf"). When false or omitted, matching is case-insensitive (default). Use true only when casing is semantically important.'
                },
                wholeWord: {
                    type: 'boolean',
                    description: 'When true, match complete words only—"find" will not match within "finding". When false or omitted, matches anywhere (substring match, default). Use true for precise term matching.'
                }
            },
            required: ['text'],
            description: 'Required: text. Optional: matchCase (default false), wholeWord (default false). Finds the next occurrence from the current cursor position.'
        },
        outputSchema: {
            type: 'object',
            properties: {
                action: { type: 'string', description: 'Echoes "find".' },
                message: { type: 'string', description: 'Result message (e.g., "Match found at position X" or "No matches found").' }
            },
            required: ['results']
        }
    },
    {
        name: 'findAll',
        annotations: { readOnlyHint: true },
        description: 'Search for all occurrences of specified text throughout the document. Use when the user asks to highlight, count, review, inspect, analyze, or report every match of a word or phrase. Supports optional case-sensitive and whole-word matching for refined searches. Returns all matching locations, occurrence count, and match information. This operation does not modify document content.',
        inputSchema: {
            type: 'object',
            properties: {
                text: {
                    type: 'string',
                    description: 'Search text to find throughout the entire document. Can be a word, phrase, or pattern. Required. Matching is substring-based by default. Returns all occurrences.'
                },
                matchCase: {
                    type: 'boolean',
                    description: 'When true, match exact letter casing. When false or omitted, matching is case-insensitive (default). Use true when casing distinguishes different terms.'
                },
                wholeWord: {
                    type: 'boolean',
                    description: 'When true, match complete words only. When false or omitted, substring matches are returned (default). Use true to avoid partial word matches.'
                }
            },
            required: ['text'],
            description: 'Required: text. Optional: matchCase (default false), wholeWord (default false). Finds ALL occurrences throughout the document.'
        },
        outputSchema: {
            type: 'object',
            properties: {
                action: { type: 'string', description: 'Echoes "findAll".' },
                message: { type: 'string', description: 'Status message with count (e.g., "Found 5 matches").' }
            },
            required: []
        }
    },
    {
        name: 'replaceAll',
        annotations: { readOnlyHint: false },
        description: 'Replace all occurrences of specified text throughout the document with replacement text. Use when the user asks to replace words, update repeated content, correct terms globally, perform bulk text edits, or standardize terminology. Supports optional case-sensitive and whole-word matching. Returns the number of replacements performed. This operation modifies document content permanently.',
        inputSchema: {
            type: 'object',
            properties: {
                replaceText: {
                    type: 'string',
                    description: 'Replacement text that will substitute every match of findText. Required. Can be empty string to delete/remove the found text.'
                }
            },
            required: ['replaceText'],
            description: 'This is a destructive operation—all matches are replaced. Consider using find/findAll first to review matches. Does not support regex patterns in this implementation.'
        },
        outputSchema: {
            type: 'object',
            properties: {
                action: { type: 'string', description: 'Echoes "replaceAll".' },
                message: { type: 'string', description: 'Operation summary (e.g., "Replaced 5 occurrences").' }
            },
            required: []
        }
    },
    {
        name: 'insertText',
        annotations: { readOnlyHint: false },
        description: 'Insert plain text at the current cursor or selection position. Use when the user asks to type, add, append, insert, generate, or compose content inside the document. The provided text becomes part of the document at the cursor location without formatting. For formatted content with styles and structure, use paste with SFDT instead. This operation modifies the document content and replaces any selected text.',
        inputSchema: {
            type: 'object',
            properties: {
                text: {
                    type: 'string',
                    description: 'Plain text content to insert at the cursor position. Required. Text is inserted as-is without formatting. For multi-line input, include newline characters (\\n). For formatted content, use paste with SFDT instead.'
                }
            },
            required: ['text'],
            description: 'Inserts plain text at the current cursor location. Use for simple text insertion. Replaces any selected content if text is currently selected. No formatting is applied; use paste for formatted content.'
        },
        outputSchema: {
            type: 'object',
            properties: {
                action: { type: 'string', description: 'Echoes "insertText".' },
                message: { type: 'string', description: 'Confirmation message (e.g., "Text inserted successfully") or error details.' }
            },
            required: ['action', 'message']
        }
    },
    {
        name: 'paste',
        annotations: { readOnlyHint: false },
        description: 'Paste formatted SFDT content at the current cursor position with optional formatting control. Use when the user asks to insert formatted content, paste documents, combine content with formatting preserved, or insert structured document fragments. SFDT (Syncfusion Format) preserves formatting, styles, and document structure. Optional pasteOption/defaultPasteOption parameters control how content is merged; omitting them applies default merge behavior. This operation modifies document content and can add formatting.',
        inputSchema: {
            type: 'object',
            properties: {
                sfdt: {
                    type: 'string',
                    description: 'Formatted content in SFDT (Syncfusion Format) serialization. Required. Typically obtained from getSelectionSfdt or prior SFDT export. SFDT preserves formatting, styles, tables, images, and all document structure during paste.'
                },
                pasteOption: {
                    type: 'string',
                    description: 'Controls how pasted content merges with existing content. Optional. Valid values may include "KeepSourceFormatting", "MatchDestinationFormatting", or similar depending on implementation. If both pasteOption and defaultPasteOption are provided, pasteOption takes precedence. Omit for default paste behavior.'
                },
                defaultPasteOption: {
                    type: 'string',
                    description: 'Alternative parameter name for paste options (same as pasteOption). Supports "KeepSourceFormatting", "MatchDestinationFormatting", etc. Optional. Used if pasteOption is not provided. Omit both for default merge behavior.'
                }
            },
            required: ['sfdt'],
            description: 'Pastes formatted SFDT content at cursor position, replacing any active selection. Preserves all source formatting and structure unless merge options override. Pass pasteOption or defaultPasteOption to control merge behavior; omit both for default behavior.'
        },
        outputSchema: {
            type: 'object',
            properties: {
                action: { type: 'string', description: 'Echoes "paste".' },
                message: { type: 'string', description: 'Confirmation message (e.g., "Content pasted successfully") or error details.' }
            },
            required: ['action', 'message']
        }
    },
    {
        name: 'insertBookmark',
        annotations: { readOnlyHint: false },
        description: 'Create a named bookmark at the current cursor position for navigation and referencing. Use when the user asks to add bookmarks, create document anchors, mark important sections, or enable navigation points. Bookmarks enable fast navigation via selectBookmark and appear in document navigation panes. The name parameter specifies the bookmark identifier. This operation modifies document structure.',
        inputSchema: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'Unique bookmark name/identifier to create (e.g., "ChapterOne", "SignatureBlock"). Required. Must be a valid identifier; use alphanumeric and underscores. Duplicate names may overwrite previous bookmarks.'
                }
            },
            required: ['name'],
            description: 'Creates a named anchor at the current cursor position. Bookmarks enable fast navigation and can be referenced by selectBookmark or in hyperlinks.'
        },
        outputSchema: {
            type: 'object',
            properties: {
                action: { type: 'string', description: 'Echoes "insertBookmark".' },
                message: { type: 'string', description: 'Confirmation message with bookmark name, or error details.' }
            },
            required: ['action', 'message']
        }
    },
    {
        name: 'selectBookmark',
        annotations: { readOnlyHint: true },
        description: 'Navigate to and select a previously defined bookmark by name. Use when the user asks to jump to a bookmark, navigate to a section, or focus on a marked location. Supports optional excludeBookmarkStartEnd parameter to control whether bookmark boundary markers are included in the selection. Bookmarks must exist (created via insertBookmark or present in the document). Selection provides context for subsequent operations. This operation does not modify document content but changes the cursor position.',
        inputSchema: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'Name of an existing bookmark to navigate to and select. Required. The bookmark must have been created via insertBookmark or already exist in the document. Case-sensitive matching.'
                },
                excludeBookmarkStartEnd: {
                    type: 'boolean',
                    description: 'When true, exclude the bookmark boundary markers from the selection. When false or omitted, include boundary markers in the selection (default). Use true to select only the bookmark content, false to include the surrounding bookmark delimiters.'
                }
            },
            required: ['name'],
            description: 'Navigates to and selects the named bookmark. Optionally controls whether bookmark boundary markers are included. Useful for jumping to document sections or preparing for further operations on bookmarked content.'
        },
        outputSchema: {
            type: 'object',
            properties: {
                action: { type: 'string', description: 'Echoes "selectBookmark".' },
                message: { type: 'string', description: 'Navigation confirmation or error (e.g., "Bookmark not found").' }
            },
            required: ['action', 'message']
        }
    },
    {
        name: 'select',
        annotations: { readOnlyHint: true },
        description: 'Select content between specified start and end positions using logical indices or coordinates. Use when the user asks to select a range, highlight content, focus on a section, or prepare content for formatting/deletion. Supports two selection modes: logical indices (for precise text positions) or coordinate-based (for visual positioning). Useful for applying formatting, deletion, or preparation for other operations. This operation does not modify content but changes selection state.',
        inputSchema: {
            type: 'object',
            properties: {
                start: {
                    oneOf: [
                        {
                            type: 'string',
                            description: 'Start position as logical index string (e.g., "0;0;1" = section;block;inline). Precise text-level positioning.'
                        },
                        {
                            type: 'object',
                            description: 'Start position as coordinate object { x: number, y: number, extend?: boolean }. Visual positioning in document canvas.',
                            properties: {
                                x: { type: 'number', description: 'X-coordinate (horizontal pixel position in document).' },
                                y: { type: 'number', description: 'Y-coordinate (vertical pixel position in document).' },
                                extend: { type: 'boolean', description: 'When true, extend selection from cursor. When false, start new selection.' }
                            }
                        }
                    ],
                    description: 'Start selection position. Can be logical index string or coordinate object. Required.'
                },
                end: {
                    oneOf: [
                        {
                            type: 'string',
                            description: 'End position as logical index string (e.g., "0;0;5"). Use with string start.'
                        },
                        {
                            type: 'object',
                            description: 'End position as coordinate object. Use with coordinate start.',
                            properties: {
                                x: { type: 'number' },
                                y: { type: 'number' }
                            }
                        }
                    ],
                    description: 'End selection position. Must match start format. Required.'
                }
            },
            required: ['start', 'end'],
            description: 'Mode 1 (Logical Indices): { start: "0;0;1", end: "0;0;5" } selects from inline 1 to inline 5 of the same block. Mode 2 (Coordinates): { start: { x: 100, y: 200 }, end: { x: 300, y: 200 } } selects based on canvas pixel positions.'
        },
        outputSchema: {
            type: 'object',
            properties: {
                action: { type: 'string', description: 'Echoes "select".' },
                message: { type: 'string', description: 'Confirmation message with selection mode and range details.' }
            },
            required: ['action', 'message']
        }
    },
    {
        name: 'print',
        annotations: { readOnlyHint: true },
        description: 'Print the current document to a connected printer or print dialog. Use when the user asks to print, generate hardcopy, or output the document. Opens the system print dialog allowing printer selection and print settings configuration. This operation does not modify document content but initiates printing workflow.',
        inputSchema: {
            type: 'object',
            properties: {},
            description: 'No input parameters required. Initiates the system print dialog for the current document.'
        },
        outputSchema: {
            type: 'object',
            properties: {
                action: { type: 'string', description: 'Echoes "print".' },
                message: { type: 'string', description: 'Status message (print dialog opening is async; confirmation only indicates dialog launch).' }
            },
            required: ['action', 'message']
        }
    },
    {
        name: 'enforceProtection',
        annotations: { readOnlyHint: false },
        description: 'Protect the document with a password and restrict editing capabilities. Use when the user asks to secure, lock, protect, or restrict editing of the document. protectionType determines which features are restricted (e.g., comments-only, forms-only, tracking). Password is required for unprotection. This operation modifies document security settings and affects user editing capabilities.',
        inputSchema: {
            type: 'object',
            properties: {
                password: {
                    type: 'string',
                    description: 'Password required to enforce protection. Required. Users must provide this password to remove protection later via stopProtection. Use a strong password for security-sensitive documents.'
                },
                protectionType: {
                    type: 'string',
                    description: 'Type of protection to enforce (e.g., "ReadOnly", "CommentsOnly", "FormOnly", "TrackChangesOnly"). Optional. Omit to apply default full protection. Controls what editing operations are restricted.'
                }
            },
            required: ['password'],
            description: 'Locks the document and restricts editing until stopProtection is called with the same password. This is NOT encryption—use for workflow control, not cryptographic security.'
        },
        outputSchema: {
            type: 'object',
            properties: {
                action: { type: 'string', description: 'Echoes "enforceProtection".' },
                message: { type: 'string', description: 'Confirmation message including protection type applied.' }
            },
            required: ['action', 'message']
        }
    },
    {
        name: 'stopProtection',
        annotations: { readOnlyHint: false },
        description: 'Remove document protection and restore full editing capabilities. Use when the user asks to unlock, unprotect, remove restrictions, or enable full editing. Requires the correct password used during enforceProtection. After successful removal, document becomes fully editable. This operation permanently removes document security restrictions.',
        inputSchema: {
            type: 'object',
            properties: {
                password: {
                    type: 'string',
                    description: 'Password used to enforce protection (via enforceProtection). Required. Must match exactly for successful removal. Case-sensitive.'
                }
            },
            required: ['password'],
            description: 'Removes document protection and restores full editing. The password must be correct; wrong passwords fail silently or with error message.'
        },
        outputSchema: {
            type: 'object',
            properties: {
                action: { type: 'string', description: 'Echoes "stopProtection".' },
                message: { type: 'string', description: 'Confirmation message or error (incorrect password, not protected, etc.).' }
            },
            required: ['action', 'message']
        }
    },
    {
        name: 'insertField',
        annotations: { readOnlyHint: false },
        description: 'Insert a dynamic field at the current cursor position with optional custom display text. Use when the user asks to add fields, insert dynamic content, create merge fields, add page numbers, or embed time/date fields. fieldCode specifies the field code (e.g., "MERGEFIELD", "PAGE", "NUMPAGES", "DOCVARIABLE") and optional result parameter controls the field\'s display text. Fields update automatically when document is opened or refreshed. This operation adds dynamic content to the document.',
        inputSchema: {
            type: 'object',
            properties: {
                fieldCode: {
                    type: 'string',
                    description: 'Field code instruction (e.g.,  "MERGEFIELD  username  \\* MERGEFORMAT"). Required. This controls what dynamic value is displayed and updated automatically. For MERGEFIELD and DOCVARIABLE, auto-generates placeholder display text if result is omitted.'
                },
                result: {
                    type: 'string',
                    description: 'Optional display text shown for the field in the document. Optional. If omitted, the editor auto-generates display text based on field type (e.g., PAGE shows "1", MERGEFIELD shows field name in brackets). Use to customize field appearance or provide context-specific text.'
                }
            },
            required: ['fieldCode'],
            description: 'Inserts a dynamic field that updates when the document is opened or refreshed. Use for page numbers, dates, merge fields, etc. Fields are typically shown with gray background during editing. Auto-generates appropriate display text if result is not provided.'
        },
        outputSchema: {
            type: 'object',
            properties: {
                action: { type: 'string', description: 'Echoes "insertField".' },
                message: { type: 'string', description: 'Confirmation message (e.g., "Field inserted successfully").' }
            },
            required: ['action', 'message']
        }
    },
    {
        name: 'goToPage',
        annotations: { readOnlyHint: true },
        description: 'Navigate to a specific page number in a multi-page document. Use when the user asks to go to page, navigate to page number, or focus on a specific page. pageNumber must be between 1 and total document pages. Cursor and view port update to display the target page. This operation does not modify content but changes view position.',
        inputSchema: {
            type: 'object',
            properties: {
                pageNumber: {
                    type: 'number',
                    description: '1-based page number to navigate to (1 = first page, 2 = second page, etc.). Required. Must be a valid page number in the loaded document (1 to total page count). Out-of-range values fail or remain on current page.'
                }
            },
            required: ['pageNumber'],
            description: 'Scrolls the editor to display the target page. Useful for multi-page documents or after page count queries.'
        },
        outputSchema: {
            type: 'object',
            properties: {
                action: { type: 'string', description: 'Echoes "goToPage".' },
                message: { type: 'string', description: 'Navigation confirmation or error (e.g., "Page number out of range").' }
            },
            required: ['action', 'message']
        }
    },
    {
        name: 'selectAll',
        annotations: { readOnlyHint: true },
        description: 'Select all content throughout the entire document. Use when the user asks to select all, select everything, or prepare entire document for operations like copying, deleting, or formatting. Includes all text, images, tables, and document elements. Useful preparation for bulk operations or document-wide formatting. This operation does not modify content.',
        inputSchema: {
            type: 'object',
            properties: {},
            description: 'No input parameters required. Selects all content in the entire document.'
        },
        outputSchema: {
            type: 'object',
            properties: {
                action: { type: 'string', description: 'Echoes "selectAll".' },
                message: { type: 'string', description: 'Confirmation message.' }
            },
            required: ['action', 'message']
        }
    },
    {
        name: 'selectCurrentWord',
        annotations: { readOnlyHint: true },
        description: 'Select the word containing or nearest to the current cursor position. Use when the user asks to select current word, highlight word, or prepare a word for formatting or deletion. Identifies word boundaries and selects complete word. Useful for quick word-level operations like formatting or replacement. This operation does not modify content.',
        inputSchema: {
            type: 'object',
            properties: {},
            description: 'No input parameters required. Selects the word at or nearest to the cursor position.'
        },
        outputSchema: {
            type: 'object',
            properties: {
                action: { type: 'string', description: 'Echoes "selectCurrentWord".' },
                message: { type: 'string', description: 'Confirmation message with selected word or error (no word at cursor).' }
            },
            required: ['action', 'message']
        }
    },
    {
        name: 'selectParagraph',
        annotations: { readOnlyHint: true },
        description: 'Select the entire paragraph containing the current cursor position. Use when the user asks to select paragraph, highlight paragraph, or prepare paragraph for formatting, deletion, or reordering. Identifies paragraph boundaries including line breaks. Useful for paragraph-level operations like indentation, alignment, or style application. This operation does not modify content.',
        inputSchema: {
            type: 'object',
            properties: {},
            description: 'No input parameters required. Selects the paragraph containing the cursor position.'
        },
        outputSchema: {
            type: 'object',
            properties: {
                action: { type: 'string', description: 'Echoes "selectParagraph".' },
                message: { type: 'string', description: 'Confirmation message or error (no paragraph found).' }
            },
            required: ['action', 'message']
        }
    },
    {
        name: 'pageCount',
        annotations: { readOnlyHint: true },
        description: 'Get the total number of pages in the current document. Use when the user asks for page count, total pages, document length, or needs to validate page numbers for navigation. Returns the integer page count which updates as content is added or removed. Useful for document statistics and validation. This operation does not modify the document.',
        inputSchema: {
            type: 'object',
            properties: {},
            description: 'No input parameters required. Returns current total page count.'
        },
        outputSchema: {
            type: 'object',
            properties: {
                action: { type: 'string', description: 'Echoes "pageCount".' },
                pageCount: { type: 'number', description: 'Total number of pages in the current document.' },
                message: { type: 'string', description: 'Status message with page count.' }
            },
            required: ['pageCount']
        }
    },
    {
        name: 'getSelectionText',
        annotations: { readOnlyHint: true },
        description: 'Retrieve the plain text content of the current selection. Use when the user asks to get selected text, copy selection, inspect content, or extract selected words. Returns the text content without formatting. If no text is selected, returns empty string. Useful for analyzing, auditing, or reporting on selected content. This operation does not modify the document.',
        inputSchema: {
            type: 'object',
            properties: {},
            description: 'No input parameters required. Extracts text from the current selection.'
        },
        outputSchema: {
            type: 'object',
            properties: {
                action: { type: 'string', description: 'Echoes "getSelectionText".' },
                text: { type: 'string', description: 'Plain text content of the current selection. Empty string if no text is selected.' },
                message: { type: 'string', description: 'Status message with character count or "No text selected".' }
            },
            required: ['text']
        }
    },
    {
        name: 'getSelectionSfdt',
        annotations: { readOnlyHint: true },
        description: 'Retrieve the current selection in SFDT (Syncfusion Format) with all formatting preserved. Use when the user asks to export selection, copy formatted content, save selection, or get structured content. SFDT includes formatting, styles, tables, images, and document structure. Returns the selection as SFDT string suitable for paste operations. This operation does not modify the document.',
        inputSchema: {
            type: 'object',
            properties: {},
            description: 'No input parameters required. Exports current selection in SFDT format with formatting preserved.'
        },
        outputSchema: {
            type: 'object',
            properties: {
                action: { type: 'string', description: 'Echoes "getSelectionSfdt".' },
                sfdt: { type: 'string', description: 'Selection serialized in SFDT format including all formatting, styles, and structure. Empty string if no content is selected.' },
                message: { type: 'string', description: 'Status message with SFDT size or "No content selected".' }
            },
            required: ['sfdt']
        }
    },
    {
        name: 'insertEditingRegion',
        annotations: { readOnlyHint: false },
        description: 'Define an editable region for specific users while restricting document editing elsewhere. Use when the user asks to create restricted areas, allow specific edits, protect parts of the document, or enable collaborative controlled editing. user specifies who can edit this region (defaults to "Everyone"). Edits outside regions are restricted. This operation adds document structure constraints.',
        inputSchema: {
            type: 'object',
            properties: {
                user: {
                    type: 'string',
                    description: 'User identifier or name allowed to edit this region (e.g., "john.doe@example.com", "Editor1", "Everyone"). Optional; defaults to "Everyone" if omitted. Used for collaborative editing controls.'
                }
            },
            required: ['user'],
            description: 'User parameter is optional. Creates an editing restriction zone at the cursor position. Outside regions remain protected.'
        },
        outputSchema: {
            type: 'object',
            properties: {
                action: { type: 'string', description: 'Echoes "insertEditingRegion".' },
                message: { type: 'string', description: 'Confirmation with region user assignment or error details.' }
            },
            required: ['action', 'message']
        }
    },
    {
        name: 'formatCharacter',
        annotations: { readOnlyHint: false },
        description: 'Apply character formatting (font, color, effects) to the current selection. Use when the user asks to make text bold, italic, underlined, change font size or family, adjust text color or highlighting, apply text effects, or modify character appearance. All formatting properties are optional; only specified properties are applied. If no text is selected, formatting applies to the current cursor position for future typing. This operation modifies character-level formatting of selected or future text.',
        inputSchema: {
            type: 'object',
            properties: {
                bold: {
                    type: 'boolean',
                    description: 'When true, make text bold. When false, remove bold. Optional.'
                },
                italic: {
                    type: 'boolean',
                    description: 'When true, make text italic (slanted). When false, remove italics. Optional.'
                },
                underline: {
                    type: 'boolean',
                    description: 'When true, underline text. When false, remove underline. Optional.'
                },
                strikethrough: {
                    type: 'boolean',
                    description: 'When true, draw a line through text. When false, remove strikethrough. Optional.'
                },
                fontSize: {
                    type: 'number',
                    description: 'Font size in points (e.g., 12, 14, 16). Optional. Common sizes: 10-14pt for body, 18+ for headings.'
                },
                fontFamily: {
                    type: 'string',
                    description: 'Font name (e.g., "Arial", "Calibri", "Times New Roman", "Courier New"). Optional. Must be an installed system font.'
                },
                color: {
                    type: 'string',
                    description: 'Text color as hex code (e.g., "#FF0000" for red, "#000000" for black) or color name. Optional.'
                },
                highlightColor: {
                    type: 'string',
                    description: 'Text highlighting/background color as hex code or color name (e.g., "#FFFF00" for yellow, "#00FF00" for green). Optional.'
                },
                baselineAlignment: {
                    type: 'string',
                    enum: ['Normal', 'Superscript', 'Subscript'],
                    description: 'Text baseline: "Normal" for standard, "Superscript" for raised text, "Subscript" for lowered text. Optional.'
                },
                allCaps: {
                    type: 'boolean',
                    description: 'When true, display all characters as uppercase. When false, remove all-caps formatting. Optional.'
                },
                superscript: {
                    type: 'boolean',
                    description: 'When true, raise text above baseline. When false, normalize baseline. Optional. Alternative to baselineAlignment.'
                },
                subscript: {
                    type: 'boolean',
                    description: 'When true, lower text below baseline. When false, normalize baseline. Optional. Alternative to baselineAlignment.'
                }
            },
            description: 'All properties are optional. Apply only the specified properties to the current selection. If no selection exists, formatting applies to the cursor position for subsequent typing.'
        },
        outputSchema: {
            type: 'object',
            properties: {
                action: { type: 'string', description: 'Echoes "formatCharacter".' },
                message: { type: 'string', description: 'Confirmation message or error details.' }
            },
            required: ['action', 'message']
        }
    },
    {
        name: 'formatParagraph',
        annotations: { readOnlyHint: false },
        description: 'Apply paragraph formatting (alignment, indentation, spacing, line spacing) to the current selection or paragraph. Use when the user asks to center text, left/right align, adjust indentation, add spacing before/after, change line spacing. All formatting properties are optional; only specified properties are applied. Affects the entire paragraph containing the cursor or selection. This operation modifies paragraph-level formatting.',
        inputSchema: {
            type: 'object',
            properties: {
                alignment: {
                    type: 'string',
                    enum: ['Left', 'Center', 'Right', 'Justify'],
                    description: 'Paragraph alignment: "Left" for left-align (default), "Center" for center, "Right" for right-align, "Justify" for justified. Optional.'
                },
                leftIndent: {
                    type: 'number',
                    description: 'Left indentation in points or twips (1/20pt unit). Optional. Positive values indent from left margin.'
                },
                rightIndent: {
                    type: 'number',
                    description: 'Right indentation in points or twips. Optional. Positive values indent from right margin.'
                },
                firstLineIndent: {
                    type: 'number',
                    description: 'First-line indentation in points or twips. Optional. Positive values indent first line, negative values create hanging indent.'
                },
                beforeSpacing: {
                    type: 'number',
                    description: 'Space before paragraph in points or twips. Optional. Adds blank space above the paragraph.'
                },
                afterSpacing: {
                    type: 'number',
                    description: 'Space after paragraph in points or twips. Optional. Adds blank space below the paragraph.'
                },
                lineSpacing: {
                    type: 'number',
                    description: 'Line spacing value (magnitude depends on lineSpacingType). Optional. Example: 1.5 for 1.5x spacing, 2 for double spacing.'
                },
                lineSpacingType: {
                    type: 'string',
                    description: 'Line spacing unit type (e.g., "Single", "Multiple", "AtLeast", "Exactly"). Optional. Controls how lineSpacing is interpreted.'
                }
            },
            description: 'All properties are optional. Apply only the specified properties to the current paragraph. Affects the entire paragraph containing the cursor.'
        },
        outputSchema: {
            type: 'object',
            properties: {
                action: { type: 'string', description: 'Echoes "formatParagraph".' },
                message: { type: 'string', description: 'Confirmation message or error details.' }
            },
            required: ['action', 'message']
        }
    },
    {
        name: 'insertImage',
        annotations: { readOnlyHint: false },
        description: 'Insert an image at the current cursor position with optional sizing and alternate text. Use when the user asks to add pictures, insert graphics, embed images, upload photos, or add visual content to the document. Supports Base64-encoded images, URLs, and file paths. Optional parameters: width and height specify image dimensions in pixels or twips; alternateText provides accessible text displayed when images are disabled. Image is inserted at cursor, replacing any selection. This operation modifies document content.',
        inputSchema: {
            type: 'object',
            properties: {
                imageString: {
                    type: 'string',
                    description: 'Image source: Base64-encoded string (e.g., "data:image/png;base64,..."), web URL (http/https), or file path. Required. Base64 is self-contained; URLs must be accessible from client.'
                },
                width: {
                    type: 'number',
                    description: 'Image width in pixels or twips (1/20pt). Optional. If omitted or not specified with height, original image width is used.'
                },
                height: {
                    type: 'number',
                    description: 'Image height in pixels or twips (1/20pt). Optional. If omitted or not specified with width, original image height is used.'
                },
                alternateText: {
                    type: 'string',
                    description: 'Alternative text (alt text) for accessibility and image fallback display (e.g., "Company logo", "Product photo"). Optional. Displayed when image is disabled or unavailable. Improves document accessibility.'
                }
            },
            required: ['imageString'],
            description: 'Insert image at cursor. Specify width/height to resize; omit for original dimensions. Provide alternateText for accessibility.'
        },
        outputSchema: {
            type: 'object',
            properties: {
                action: { type: 'string', description: 'Echoes "insertImage".' },
                message: { type: 'string', description: 'Confirmation message or error details.' }
            },
            required: ['action', 'message']
        }
    },
    {
        name: 'insertHyperlink',
        annotations: { readOnlyHint: false },
        description: 'Insert a clickable hyperlink at the current cursor position or on selected text. Use when the user asks to add links, insert URLs, create navigation references, link to web pages, email addresses, or documents. The address parameter specifies the link target (URL, email, file path). Optional displayText shows as link text; optional screenTip appears on hover. If no text is selected, creates link at cursor. If text is selected, converts selection to link. This operation modifies document content.',
        inputSchema: {
            type: 'object',
            properties: {
                address: {
                    type: 'string',
                    description: 'Link target: web URL (http://example.com or https://example.com), email (mailto:email@example.com), file path, or bookmark reference. Required. URLs must include protocol (http:// or https://).'
                },
                displayText: {
                    type: 'string',
                    description: 'Visible hyperlink text (e.g., "Click here", "Learn more", "Visit website"). Optional. If omitted, the address is used as displayed text. Use short, descriptive text for clarity.'
                },
                screenTip: {
                    type: 'string',
                    description: 'Tooltip text shown on hover (e.g., "Open company website", "Send email to support"). Optional. Improves user experience by explaining link purpose.'
                }
            },
            required: ['address'],
            description: 'Create hyperlink at cursor or on selected text. Specify displayText and screenTip for user-friendly links.'
        },
        outputSchema: {
            type: 'object',
            properties: {
                action: { type: 'string', description: 'Echoes "insertHyperlink".' },
                message: { type: 'string', description: 'Confirmation message or error details.' }
            },
            required: ['action', 'message']
        }
    }];

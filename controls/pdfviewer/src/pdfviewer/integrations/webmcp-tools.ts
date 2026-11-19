import { WebMcpTool } from '../index';

/**
 * @private
 */
export const pdfViewerWebMcpTools: WebMcpTool[] = [
    {
        name: 'navigateToPage',
        description: 'Move the PDF viewer to a target page so the agent can continue multi-page workflows, reviews, or form fills. Use whenever the user asks to open, jump to, go to, show, or move to a page, or to step next/previous/first/last. Prefer "goto" with pageNumber for absolute jumps; use next/previous for sequential scanning; use first/last to bound a document. Returns current page, total pages, and whether navigation succeeded. Does not change zoom, annotations, or form values.',
        annotations: {
            readOnlyHint: true
        },
        inputSchema: {
            type: 'object',
            properties: {
                navigationAction: {
                    type: 'string',
                    enum: ['next', 'previous', 'first', 'last', 'goto'],
                    description: 'How to navigate. "next" advances one page; "previous" goes back one page; "first" jumps to page 1; "last" jumps to the final page; "goto" jumps to an absolute pageNumber. Required. Use "goto" for prompts like "open page 12"; use next/previous for walkthroughs.'
                },
                pageNumber: {
                    type: 'number',
                    description: 'Absolute 1-based page number to open when navigationAction is "goto" (1 = first page). Required for "goto"; ignored for next/previous/first/last. Out-of-range values typically keep the current page and report navigation failure.'
                }
            },
            required: ['navigationAction']
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: {
                    type: 'object',
                    properties: {
                        currentPage: { type: 'number' },
                        totalPages: { type: 'number' },
                        pageNavigated: { type: 'boolean' }
                    }
                },
                message: { type: 'string' }
            }
        }
    },
    {
        name: 'searchAndNavigate',
        description: 'Find text in the loaded PDF and jump to the first match so the agent can locate clauses, labels, keywords, or placeholders without manual scrolling. Use when the user asks to find, search, locate, look for, or go to text (section titles, "Confidential", invoice numbers, signature labels, etc.). Supports one query string or multiple queries in one call, optional case sensitivity, and optional single-page scope. Returns match pages, bounds (x/y/width/height), first match page, and whether navigation to the first hit succeeded. Prefer this before extractTextContent when the goal is locate-and-jump rather than full-page reading. Use returned bounds for addAnnotation/addRedaction placement.',
        annotations: {
            readOnlyHint: true
        },
        inputSchema: {
            type: 'object',
            properties: {
                searchText: {
                    oneOf: [
                        { type: 'string' },
                        { type: 'array', items: { type: 'string' } }
                    ],
                    description: 'Text to find. Pass a single string for one query, or a string array to search multiple terms in one call (e.g. ["Total Due", "Invoice #"]). Matching is substring-based against page text. Required.'
                },
                caseSensitive: {
                    type: 'boolean',
                    description: 'When true, match exact letter casing ("PDF" will not match "pdf"). When false or omitted, matching is case-insensitive. Default: false. Use true only when casing distinguishes meaning.'
                },
                pageIndex: {
                    type: 'number',
                    description: 'Optional 0-based page index that restricts search to one page (0 = first page). Omit to search the entire document. Use after navigateToPage when the user wants matches only on the current or a known page.'
                }
            },
            required: ['searchText']
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: {
                    type: 'object',
                    properties: {
                        searchResults: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    pageIndex: { type: 'number' },
                                    bounds: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                x: { type: 'number' },
                                                y: { type: 'number' },
                                                width: { type: 'number' },
                                                height: { type: 'number' }
                                            }
                                        }
                                    },
                                    matchCount: { type: 'number' }
                                }
                            }
                        },
                        firstMatchPage: { type: 'number' },
                        navigationSuccessful: { type: 'boolean' }
                    }
                },
                message: { type: 'string' }
            }
        }
    },
    {
        name: 'extractTextContent',
        description: 'Read text from one page or a contiguous page range for analysis, summarization, validation, or downstream form/annotation placement. Use when the user asks to read, extract, get text, summarize, or inspect page content. startPage is 0-based and required; endPage is inclusive 0-based (omit or equal startPage for a single page). Returns concatenated pageText, pageCount, and extractedPages. Does not modify the document.',
        annotations: {
            readOnlyHint: true
        },
        inputSchema: {
            type: 'object',
            properties: {
                startPage: {
                    type: 'number',
                    description: '0-based starting page index to extract (0 = first page). Required. Must be within the loaded document page range.'
                },
                endPage: {
                    type: 'number',
                    description: '0-based inclusive ending page index. Omit or set equal to startPage to extract a single page. Must be >= startPage and within document bounds. Use a range for multi-page invoices, contracts, or bulk scans.'
                }
            },
            required: ['startPage']
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: {
                    type: 'object',
                    properties: {
                        pageText: { type: 'string' },
                        pageCount: { type: 'number' },
                        extractedPages: { type: 'array', items: { type: 'number' } }
                    }
                },
                message: { type: 'string' }
            }
        }
    },
    {
        name: 'getPageMetadata',
        description: 'Fetch structural metadata for a single page—width, height, rotation, total document pages, and dimension unit—so the agent can size annotations, form fields, redactions, or layout checks correctly. Use before placing shapes/fields, validating page size, or answering questions about page dimensions/orientation. pageIndex is 0-based. Read-only; does not change the view or document content.',
        annotations: {
            readOnlyHint: true
        },
        inputSchema: {
            type: 'object',
            properties: {
                pageIndex: {
                    type: 'number',
                    description: '0-based page index whose metadata should be returned (0 = first page). Required. Must exist in the loaded document.'
                }
            },
            required: ['pageIndex']
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: {
                    type: 'object',
                    properties: {
                        pageIndex: { type: 'number' },
                        width: { type: 'number' },
                        height: { type: 'number' },
                        rotation: { type: 'number' },
                        totalPages: { type: 'number' },
                        dimensionsUnit: { type: 'string' }
                    }
                },
                message: { type: 'string' }
            }
        }
    },
    {
        name: 'retrieveFormFields',
        description: 'List interactive AcroForm fields with id, name, type, value, required/read-only state, page, and checkbox state so the agent can inspect, validate, or prepare fill/edit workflows. Use whenever the user asks to show fields, list form controls, check what is filled/missing, or BEFORE editFormField/resetFormField/deleteFormField. Optionally scope to one 1-based pageNumber; omit to return the whole document. Returns fieldCount, filledFieldCount, and requiredFieldsMissing. Read-only snapshot of current form state.',
        annotations: {
            readOnlyHint: true
        },
        inputSchema: {
            type: 'object',
            properties: {
                pageNumber: {
                    type: 'number',
                    description: 'Optional 1-based page number that limits results to fields on that page. Omit to retrieve every form field in the document. Use after navigateToPage when working only on the visible page.'
                }
            }
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: {
                    type: 'object',
                    properties: {
                        formFields: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    name: { type: 'string' },
                                    type: { type: 'string' },
                                    value: { oneOf: [{ type: 'string' }, { type: 'null' }] },
                                    isRequired: { type: 'boolean' },
                                    pageNumber: { type: 'number' },
                                    isReadOnly: { type: 'boolean' },
                                    isChecked: { type: 'boolean' }
                                }
                            }
                        },
                        fieldCount: { type: 'number' },
                        filledFieldCount: { type: 'number' },
                        requiredFieldsMissing: { type: 'array', items: { type: 'string' } }
                    }
                },
                message: { type: 'string' }
            }
        }
    },
    {
        name: 'getBookmarksAndNavigate',
        description: 'Read the PDF outline (bookmarks) or jump to a bookmark destination so the agent can map document structure and open sections by outline location. Use bookmarkAction "get" to list outline entries and destinations; use "navigate" with destination x/y (from a prior get) to scroll/jump to that bookmark target. Prefer this for table-of-contents style requests ("open chapter 3 bookmark", "list outline"). Returns bookmarks, bookmarkCount, and destination coordinates (X, Y, PageIndex, Zoom) when available.',
        annotations: {
            readOnlyHint: true
        },
        inputSchema: {
            type: 'object',
            properties: {
                bookmarkAction: {
                    type: 'string',
                    enum: ['get', 'navigate'],
                    description: 'Operation to run. "get" returns the full bookmark/outline tree and destinations without requiring x/y. "navigate" jumps the viewer to a bookmark destination using x and y from a previous get result. Required.'
                },
                x: {
                    type: 'number',
                    description: 'Horizontal destination coordinate for bookmarkAction "navigate", taken from bookmarksDestination.X (or equivalent) of a prior get. Required for accurate navigate; ignored for get.'
                },
                y: {
                    type: 'number',
                    description: 'Vertical destination coordinate for bookmarkAction "navigate", taken from bookmarksDestination.Y (or equivalent) of a prior get. Required for accurate navigate; ignored for get.'
                }
            },
            required: ['bookmarkAction']
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: {
                    type: 'object',
                    properties: {
                        bookmarks: {
                            type: 'array',
                            items: { type: 'object' }
                        },
                        bookmarkCount: { type: 'number' },
                        bookmarksDestination: {
                            type: 'array',
                            properties: {
                                X: { type: 'number' },
                                PageIndex: { type: 'number' },
                                Y: { type: 'number' },
                                Zoom: { type: 'number'}
                            }
                        }
                    }
                },
                message: { type: 'string' }
            }
        }
    },
    {
        name: 'addAnnotation',
        description: 'Create a new annotation on a PDF page for review markup, shapes, measurements, free text, or stamps. Use when the user asks to highlight, underline, strike through, draw a shape, measure distance/area, add a comment box, or stamp a page. Supported annotationType: Highlight, Underline, Strikethrough, Squiggly (text markup — supply bounds from search/extract); Rectangle, Circle, Arrow, Line, Polygon (shapes — supply offset/width/height or vertexPoints); Distance, Perimeter, Area, Radius, Volume (measurements — supply vertexPoints); FreeText (content + position/size/font); Stamp (stampType/stampValue). pageNumber is 1-based and required. Optional style: color, opacity, thickness. Prefer editAnnotation to change an existing mark; prefer addRedaction for irreversible sensitive-content masking.',
        annotations: {
            readOnlyHint: false
        },
        inputSchema: {
            type: 'object',
            properties: {
                annotationType: {
                    type: 'string',
                    enum: ['Highlight', 'Underline', 'Strikethrough', 'Squiggly', 'Rectangle', 'Circle', 'Arrow', 'Line', 'Polygon', 'Distance', 'Perimeter', 'Area', 'Radius', 'Volume', 'FreeText', 'Stamp', 'Link', 'StickyNotes', 'Ink'],
                    description: 'Kind of annotation to create. Text markup: Highlight, Underline, Strikethrough, Squiggly. Shapes: Rectangle, Circle, Arrow, Line, Polygon. Measurements: Distance, Perimeter, Area, Radius, Volume. Other: FreeText, Stamp, Link, StickyNotes, Ink. Required. Map user intent.'
                },
                pageNumber: {
                    type: 'number',
                    description: '1-based page number that receives the annotation (1 = first page). Required. Must exist in the loaded document.'
                },
                bounds: {
                    type: 'array',
                    description: 'Array of text-region rectangles for text markup annotations (Highlight, Underline, Strikethrough, Squiggly). Each item should include x, y, width, height in page coordinates—typically from searchAndNavigate or extractTextContent bounds. Required for reliable text markup placement.'
                },
                offset: {
                    type: 'object',
                    properties: {
                        x: { type: 'number' },
                        y: { type: 'number' }
                    },
                    description: 'Top-left position { x, y } in page coordinates for shape (Rectangle, Circle, Arrow, Line, Polygon, Distance, Perimeter, Area, Radius, Volume), FreeText, or Stamp annotations. x increases right; y increases down in viewer page space.'
                },
                width: {
                    type: 'number',
                    description: 'Annotation width in page units for rectangular placements (Rectangle, Circle bounding box, FreeText, Stamp). Pair with offset and height.'
                },
                height: {
                    type: 'number',
                    description: 'Annotation height in page units for rectangular placements (Rectangle, Circle bounding box, FreeText, Stamp). Pair with offset and width.'
                },
                vertexPoints: {
                    type: 'array',
                    description: 'Ordered point list for multi-point shapes and measurement annotations such as Line, Arrow, Polygon, Distance, Perimeter, and Area. Each point must contain x and y coordinates in page coordinates.'
                },
                path: {
                    type: 'string',
                    description: 'Path data for Ink annotations. Contains a JSON-serialized array of drawing commands representing the stroke geometry. Each command includes a drawing operation (for example M = MoveTo, L = LineTo) and page coordinates (x, y). Required for Ink annotation type.'
                },
                fontColor: {
                    type: 'string',
                    description: 'Font color as string (e.g. "#FFFF00", "red", "rgb(255,0,0)"). Applies to free text when supported.'
                },
                fillColor: {
                    type: 'string',
                    description: 'Fill color as string (e.g. "#FFFF00", "red", "rgb(255,0,0)") for shape annotations such as Rectangle, Circle, Polygon, Area, and Radius and Textmarkup annotations like Highlight, Underline, Strikethrough, Squiggly.'
                },
                strokeColor: {
                    type: 'string',
                    description: 'Border/stroke color as string (e.g. "#FFFF00", "red", "rgb(255,0,0)") for shapes, lines, arrows, and measurement annotations.'
                },
                url: {
                    type: 'string',
                    description: 'Target URL for WebLink annotations.'
                },
                destinationPageIndex: {
                    type: 'number',
                    description: 'Destination page index for DocumentLink annotations.'
                },
                opacity: {
                    type: 'number',
                    description: 'Opacity from 0 (transparent) to 1 (opaque). Use lower values (e.g. 0.3–0.5) for highlights so underlying text remains readable.'
                },
                thickness: {
                    type: 'number',
                    description: 'Border or stroke thickness in points/pixels for lines, shapes, and underlines. Larger values produce thicker strokes.'
                },
                author: {
                    type: 'string',
                    description: 'Author/creator name for the Sticky Notes annotation.'
                },
                content: {
                    type: 'string',
                    description: 'Visible text body for FreeText annotations. Required for meaningful FreeText; ignored by pure shape/markup types.'
                },
                fontSize: {
                    type: 'number',
                    description: 'Font size for FreeText content (typically in points). Ignored for non-text annotation types.'
                },
                fontFamily: {
                    type: 'string',
                    description: 'Font family for FreeText content (e.g. "Helvetica", "Arial"). Ignored for non-text annotation types.'
                },
                stampType: {
                    type: 'string',
                    description: 'Category of stamp to apply when annotationType is "Stamp". Supported categories: Dynamic, SignHere, and StandardBusiness. Use together with stampValue to specify the exact stamp.'
                },
                stampValue: {
                    type: 'string',
                    description: 'Specific stamp name within the selected stamp category. Supported values: Dynamic (Revised, Reviewed, Received, Approved, Confidential, NotApproved), SignHere (Witness, InitialHere, SignHere, Accepted, Rejected), StandardBusiness (Approved, NotApproved, Draft, Final, Completed, Confidential, ForPublicRelease, NotForPublicRelease, ForComment, Void, PreliminaryResults, InformationOnly).'
                }
            },
            required: ['annotationType', 'pageNumber']
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: {
                    type: 'object',
                    properties: {
                        annotationType: { type: 'string' },
                        pageNumber: { type: 'number' }
                    }
                },
                message: { type: 'string' }
            }
        }
    },
    {
        name: 'editAnnotation',
        description: 'Update an existing annotation identified by annotationId—position, size, color, opacity, content, or other supported attributes—without recreating it. Use when the user asks to change, move, resize, recolor, or restyle a mark already on the page. Obtain annotationId from a prior addAnnotation (or viewer annotation list). Pass only the properties to change inside updates. Returns the annotationId, applied updatedProperties, and updateTimestamp. Prefer deleteAnnotation to remove; prefer updateRedaction for redaction-specific properties.',
        annotations: {
            readOnlyHint: false
        },
        inputSchema: {
            type: 'object',
            properties: {
                annotationId: {
                    type: 'string',
                    description: 'Unique id of the annotation to modify, as returned by addAnnotation (or an existing annotation collection). Required. Wrong ids fail the update.'
                },
                updates: {
                    type: 'object',
                    description: 'Partial property bag of fields to change only (e.g. { color: "#00FF00", opacity: 0.4, content: "Revised note" }, or bounds/offset/width/height/thickness as applicable). Required. Unspecified properties remain unchanged.'
                }
            },
            required: ['annotationId', 'updates']
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: {
                    type: 'object',
                    properties: {
                        annotationId: { type: 'string' },
                        updatedProperties: { type: 'object' },
                        updateTimestamp: { type: 'string' }
                    }
                },
                message: { type: 'string' }
            }
        }
    },
    {
        name: 'retrieveAnnotations',
        description: 'Retrieve all annotations currently present in the PDF document. Returns the complete annotation collection along with the total annotation count. Use whenever the user asks to list annotations, inspect annotations, highlights, markups, drawings, notes, or review existing annotations before annotation edit or delete operations.',
        annotations: {
            readOnlyHint: true
        },
        inputSchema: {
            type: 'object',
            properties: {}
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: {
                    type: 'object',
                    properties: {
                        annotations: {
                            type: 'array',
                            items: { type: 'object' }
                        },
                        annotationCount: { type: 'number' }
                    }
                },
                message: { type: 'string' }
            }
        }
    },
    {
        name: 'deleteAnnotation',
        description: 'Permanently remove one or many annotations from the document by id. Use when the user asks to delete, remove, or clear highlights, shapes, stamps, or other marks. Pass a single annotationId string or an array of ids from prior add/list operations. Returns deletedCount, deletedAnnotationIds, and remainingAnnotationCount. Destructive write; does not affect form fields. Prefer undoRedoActions if the user wants to reverse the last edit instead of targeting by id.',
        annotations: {
            readOnlyHint: false
        },
        inputSchema: {
            type: 'object',
            properties: {
                annotationIds: {
                    oneOf: [
                        { type: 'string' },
                        { type: 'array', items: { type: 'string' } }
                    ],
                    description: 'Annotation id to delete, or an array of ids for bulk delete. Required. Use ids returned by addAnnotation or known existing annotation identifiers. Missing ids are skipped or reported via the result message.'
                }
            },
            required: ['annotationIds']
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: {
                    type: 'object',
                    properties: {
                        deletedCount: { type: 'number' },
                        deletedAnnotationIds: { type: 'array', items: { type: 'string' } },
                        remainingAnnotationCount: { type: 'number' }
                    }
                },
                message: { type: 'string' }
            }
        }
    },
    {
        name: 'addFormField',
        description: 'Insert a new interactive form field on a page so users or agents can capture data later. Use when the user asks to add a textbox, password field, checkbox, radio button, dropdown, list box, signature field, or initial field. Required: fieldType, unique name, 1-based pageNumber, and bounds { x, y, width, height }. Optional: isRequired, defaultValue, options (for DropDown/ListBox/Radio choices), tooltip, maxLength. Call retrieveFormFields afterward to verify. Prefer editFormField to change an existing field value/properties; prefer deleteFormField to remove.',
        annotations: {
            readOnlyHint: false
        },
        inputSchema: {
            type: 'object',
            properties: {
                fieldType: {
                    type: 'string',
                    enum: ['Textbox', 'Password', 'CheckBox', 'RadioButton', 'DropDown', 'ListBox', 'SignatureField', 'InitialField'],
                    description: 'Control type to create. Textbox/Password for typed input; CheckBox/RadioButton for binary/grouped choices; DropDown/ListBox for selectable lists (supply options); SignatureField/InitialField for signing. Required.'
                },
                name: {
                    type: 'string',
                    description: 'Unique field name/identifier used by the form model and later edit/reset/delete calls (e.g. "customerEmail"). Required. Avoid duplicate names unless intentionally grouping radios.'
                },
                pageNumber: {
                    type: 'number',
                    description: '1-based page number where the field is placed (1 = first page). Required.'
                },
                bounds: {
                    type: 'object',
                    description: 'Field rectangle on the page as { X, Y, Width, Height } in page coordinates. Required. Property names are case-sensitive and must be provided exactly as X, Y, Width, and Height (capitalized). Use getPageMetadata and/or extractTextContent bounds to align with labels.'
                },
                isRequired: {
                    type: 'boolean',
                    description: 'When true, the field is marked required for form completion validation. Default behavior follows viewer defaults when omitted.'
                },
                defaultValue: {
                    type: 'string',
                    description: 'Initial value shown in the field (text for Textbox/Password/DropDown, or checked-state representation for applicable types). Omit to leave empty.'
                },
                options: {
                    type: 'array',
                    items: {
                        itemValue: {
                            type: 'string',
                            description: 'Underlying value stored in the form when this option is selected. This value is used for data processing, export, and form submission.'
                        },
                        itemName: {
                            type: 'string',
                            description: 'Display text shown to users in the DropDown or ListBox. This is the visible label presented in the UI.'
                        }
                    }
                },
                tooltip: {
                    type: 'string',
                    description: 'Hover/help text describing the field purpose to end users (e.g. "Enter work email").'
                },
                maxLength: {
                    type: 'number',
                    description: 'Maximum character count for text-entry fields (Textbox/Password). Omit for unlimited (subject to viewer limits).'
                },
                isReadOnly: {
                    type: 'boolean',
                    description: 'When true, the field value can be viewed but cannot be modified by users. Useful for displaying pre-filled or locked information.'
                },
                visibility: {
                    type: 'string',
                    description: 'Controls field visibility. Common values include Visible, Hidden, VisibleNotPrintable, and HiddenPrintable.'
                },
                isPrint: {
                    type: 'boolean',
                    description: 'When true, the form field is included when the document is printed. Default behavior follows viewer settings when omitted.'
                },
                thickness: {
                    type: 'number',
                    description: 'Border thickness of the form field in points/pixels. Larger values produce thicker borders.'
                },
                borderColor: {
                    type: 'string',
                    description: 'Border color of the form field as a CSS color string (e.g. "#000000", "blue", "rgb(0,0,0)").'
                },
                isMultiline: {
                    type: 'boolean',
                    description: 'Applicable to Textbox fields. When true, users can enter multiple lines of text; otherwise input is restricted to a single line.'
                },
                isChecked: {
                    type: 'boolean',
                    description: 'Applicable to CheckBox fields. Sets the initial checked state when the field is created.'
                },
                isSelected: {
                    type: 'boolean',
                    description: 'Applicable to RadioButton fields and list-based controls. Sets the option as selected by default when the field is created.'
                }
            },
            required: ['fieldType', 'name', 'pageNumber', 'bounds']
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: {
                    type: 'object',
                    properties: {
                        fieldName: { type: 'string' },
                        fieldType: { type: 'string' },
                        pageNumber: { type: 'number' }
                    }
                },
                message: { type: 'string' }
            }
        }
    },
    {
        name: 'editFormField',
        description: 'Change an existing form field value or properties (value, required flag, options, tooltip, bounds, read-only, etc.) identified by fieldId. Use to fill forms, correct entries, or restyle fields AFTER retrieveFormFields / addFormField. Pass only properties to change in updates. Returns fieldId, fieldName, updatedProperties, and updateTimestamp. Prefer resetFormField to restore defaults/clear; prefer deleteFormField to remove the control entirely.',
        annotations: {
            readOnlyHint: false
        },
        inputSchema: {
            type: 'object',
            properties: {
                fieldId: {
                    type: 'string',
                    description: 'Target field id (or stable identifier) from retrieveFormFields / addFormField. Required. Must match an existing field.'
                },
                updates: {
                    type: 'object',
                    description: 'Partial property bag of changes only (e.g. { value: "Jane Doe", isRequired: true } or bounds/options/tooltip/maxLength as supported). Required. Unspecified properties stay the same.'
                }
            },
            required: ['fieldId', 'updates']
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: {
                    type: 'object',
                    properties: {
                        fieldId: { type: 'string' },
                        fieldName: { type: 'string' },
                        updatedProperties: { type: 'object' },
                        updateTimestamp: { type: 'string' }
                    }
                },
                message: { type: 'string' }
            }
        }
    },
    {
        name: 'resetFormField',
        description: 'Restore form fields to their default values or wipe them empty. Use when the user asks to reset, clear, or blank the form (all fields or specific ids). Omit fieldIds to reset every field; pass a string or string array to target specific controls from retrieveFormFields. Set clearCompletely true to empty values instead of restoring designed defaults. Returns resetCount, resetFieldIds, and timestamp. Non-destructive to field structure (unlike deleteFormField).',
        annotations: {
            readOnlyHint: false
        },
        inputSchema: {
            type: 'object',
            properties: {
                fieldIds: {
                    oneOf: [
                        { type: 'string' },
                        { type: 'array', items: { type: 'string' } }
                    ],
                    description: 'Optional single field id or array of ids to reset. Omit to reset all form fields in the document. Use ids from retrieveFormFields for precise targeting.'
                },
                clearCompletely: {
                    type: 'boolean',
                    description: 'When true, clear values to empty/unchecked rather than restoring each field defaultValue. When false or omitted, restore designed defaults. Use true for "blank the form"; false for "restore defaults".'
                }
            }
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: {
                    type: 'object',
                    properties: {
                        resetCount: { type: 'number' },
                        resetFieldIds: { type: 'array', items: { type: 'string' } },
                        timestamp: { type: 'string' }
                    }
                },
                message: { type: 'string' }
            }
        }
    },
    {
        name: 'deleteFormField',
        description: 'Remove one or more form fields from the document structure entirely (not just clear values). Use when the user asks to delete or remove a textbox, checkbox, signature field, or other control. Pass a single field id or an array of ids from retrieveFormFields/addFormField. Returns deletedCount, deletedFieldIds, and remainingFieldCount. Destructive; prefer resetFormField if the goal is only to clear values.',
        annotations: {
            readOnlyHint: false
        },
        inputSchema: {
            type: 'object',
            properties: {
                fieldIds: {
                    oneOf: [
                        { type: 'string' },
                        { type: 'array', items: { type: 'string' } }
                    ],
                    description: 'Field id or array of field ids to delete. Required. Obtain ids from retrieveFormFields or addFormField results.'
                }
            },
            required: ['fieldIds']
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: {
                    type: 'object',
                    properties: {
                        deletedCount: { type: 'number' },
                        deletedFieldIds: { type: 'array', items: { type: 'string' } },
                        remainingFieldCount: { type: 'number' }
                    }
                },
                message: { type: 'string' }
            }
        }
    },
    {
        name: 'extractPages',
        description: 'Extract selected pages from the current PDF document and create a new PDF document. Accepts page numbers as a comma-separated string or an array of page indices. The extracted pages are loaded into a new PDF document in the viewer and metadata about the extraction operation is returned.',
        annotations: {
            readOnlyHint: false
        },
        inputSchema: {
            type: 'object',
            properties: {
                pageRange: {
                    type: 'string',
                    description: 'Required. Page selection using 1-based page numbers and ranges. Examples: "1", "1,3,5", "1-5", "1,3,5-7".'
                }
            },
            required: ['pageRange']
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: {
                    type: 'object',
                    properties: {
                        operation: { type: 'string' },
                        extractedPageNumbers: { type: 'array' },
                        loadingMessage: { type: 'string' }
                    }
                },
                message: { type: 'string' }
            }
        }
    },
    {
        name: 'zoomAndView',
        description: 'Adjust PDF zoom and fit modes so content is readable or fully visible during review. Use "absolute" with zoomValue (percentage) for exact zoom; "increment"/"decrement" to step zoom in/out; "fitPage", "fitWidth", or "fitHeight" to auto-fit the viewport. Use for prompts like "zoom to 150%", "zoom in", "fit width". Returns previousZoom, currentZoom, zoomAction, and zoomMode. Does not change page number; pair with navigateToPage when both page and zoom should change.',
        annotations: {
            readOnlyHint: false
        },
        inputSchema: {
            type: 'object',
            properties: {
                zoomAction: {
                    type: 'string',
                    enum: ['absolute', 'increment', 'decrement', 'fitPage', 'fitWidth', 'fitHeight'],
                    description: 'Zoom behavior. "absolute" sets an exact percentage via zoomValue; "increment"/"decrement" steps zoom relative to current level; "fitPage" fits the whole page; "fitWidth" fits page width; "fitHeight" fits page height. Required.'
                },
                zoomValue: {
                    type: 'number',
                    description: 'Target zoom percentage for zoomAction "absolute" (e.g. 100 = 100%, 150 = 150%). Required for absolute; typically ignored for fit* and optional for increment/decrement depending on viewer step handling.'
                }
            },
            required: ['zoomAction']
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: {
                    type: 'object',
                    properties: {
                        zoomAction: { type: 'string' },
                        previousZoom: { type: 'number' },
                        currentZoom: { type: 'number' },
                        zoomMode: { type: 'string' }
                    }
                },
                message: { type: 'string' }
            }
        }
    },
    {
        name: 'downloadDocument',
        description: 'Download the current PDF to the client. Use when the user asks to save, download, export, or get the PDF file. Returns success status, file name, and message.',
        annotations: {
            readOnlyHint: false
        },
        inputSchema: {
            type: 'object',
            properties: {}
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: {
                    type: 'object',
                    properties: {
                        fileName: { type: 'string' }
                    }
                },
                message: { type: 'string' }
            }
        }
    },
    {
        name: 'printDocument',
        description: 'Open the print dialog for the current PDF. Use when the user asks to print or send to printer. Returns success status, file name, and message. Does not submit to a device—delegates to browser print flow.',
        annotations: {
            readOnlyHint: false
        },
        inputSchema: {
            type: 'object',
            properties: {}
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: {
                    type: 'object',
                    properties: {
                        fileName: { type: 'string' }
                    }
                },
                message: { type: 'string' }
            }
        }
    },
    {
        name: 'undoRedoActions',
        description: 'Walk the viewer edit history one step backward (undo) or forward (redo) for annotations, form edits, redaction markers, and other tracked changes. Use when the user says undo, redo, reverse the last change, or restore the previous state. action "undo" reverts the latest applied change; "redo" reapplies the last undone change. Returns action, actionApplied, and currentState. Prefer this over delete/edit when the user wants chronological reverse rather than targeting a specific id. No effect when the history stack is empty.',
        annotations: {
            readOnlyHint: false
        },
        inputSchema: {
            type: 'object',
            properties: {
                action: {
                    type: 'string',
                    enum: ['undo', 'redo'],
                    description: 'History direction. "undo" reverses the most recent tracked modification; "redo" re-applies the most recently undone modification. Required. Only one step per call—invoke repeatedly for multi-step history walks.'
                }
            },
            required: ['action']
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: {
                    type: 'object',
                    properties: {
                        action: { type: 'string' },
                        actionApplied: { type: 'boolean' },
                        currentState: { type: 'string' }
                    }
                },
                message: { type: 'string' }
            }
        }
    },
    {
        name: 'addRedaction',
        description: 'Create redaction markers that cover sensitive content for later permanent burn-in via applyRedaction. Use when the user asks to redact, black out, mask PII, hide SSN/account numbers, or cover regions. redactionAction "single" needs bound + pageNumber (1-based); "page" needs pageNumbers[] to mark whole pages; "search" needs searchText (optional caseSensitive) to mark all matches. Optional styling: markerFillColor, markerBorderColor, fillColor, overlayText, fontColor, fontFamily, fontSize, beforeRedactionsApplied. Returns annotationId/redactedPages/redactionCount. IMPORTANT sequence: addRedaction (preview markers) → optionally updateRedaction → user confirms → applyRedaction (irreversible). Prefer searchAndNavigate/extractTextContent bounds when placing single regions precisely.',
        annotations: {
            readOnlyHint: false
        },
        inputSchema: {
            type: 'object',
            properties: {
                redactionAction: {
                    type: 'string',
                    enum: ['single', 'page', 'search'],
                    description: 'Placement mode. "single" redacts one rectangle on one page (bound + pageNumber); "page" redacts entire page(s) via pageNumbers; "search" finds searchText and redacts each match. Required. Map "black out this box" → single; "redact page 2" → page; "redact all SSNs" → search.'
                },
                bound: {
                    type: 'object',
                    properties: {
                        x: { type: 'number' },
                        y: { type: 'number' },
                        width: { type: 'number' },
                        height: { type: 'number' }
                    },
                    description: 'Rectangle { x, y, width, height } in page coordinates for redactionAction "single". Required for single; ignored for page/search. Prefer bounds from search/extract for text-aligned coverage.'
                },
                pageNumber: {
                    type: 'number',
                    description: '1-based page number for redactionAction "single" (1 = first page). Required for single; ignored for page/search.'
                },
                pageNumbers: {
                    type: 'array',
                    items: { type: 'number' },
                    description: '1-based page numbers to fully mark when redactionAction is "page" (e.g. [1, 3, 5]). Required for page; ignored otherwise.'
                },
                searchText: {
                    type: 'string',
                    description: 'Literal text to find and redact on matching occurrences when redactionAction is "search". Required for search. Useful for emails, phone numbers, keywords, or repeated PII strings.'
                },
                caseSensitive: {
                    type: 'boolean',
                    description: 'When true, search redaction matches exact casing. When false or omitted, case-insensitive. Only applies to redactionAction "search".'
                },
                markerFillColor: {
                    type: 'string',
                    description: 'Fill color of the on-screen redaction marker before apply (CSS color, e.g. "#000000" or "black"). Controls preview appearance.'
                },
                markerBorderColor: {
                    type: 'string',
                    description: 'Border color of the redaction marker preview (CSS color). Helps distinguish markers during review.'
                },
                fillColor: {
                    type: 'string',
                    description: 'Final redaction fill color used when content is burned in (typically black). CSS color string.'
                },
                overlayText: {
                    type: 'string',
                    description: 'Optional label drawn on the redaction area after apply (e.g. "REDACTED", "CONFIDENTIAL"). Empty/omit for solid fill only.'
                },
                fontColor: {
                    type: 'string',
                    description: 'Color of overlayText (CSS color). Only relevant when overlayText is set.'
                },
                fontFamily: {
                    type: 'string',
                    description: 'Font family for overlayText (e.g. "Helvetica"). Only relevant when overlayText is set.'
                },
                fontSize: {
                    type: 'number',
                    description: 'Font size for overlayText in points/pixels. Only relevant when overlayText is set.'
                },
                beforeRedactionsApplied: {
                    type: 'boolean',
                    description: 'Advanced ordering flag controlling whether this redaction is processed before other pending redactions when applying. Leave default unless stacking order matters.'
                }
            },
            required: ['redactionAction']
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: {
                    type: 'object',
                    properties: {
                        annotationId: { type: 'string' },
                        pageNumber: { type: 'number' },
                        redactedPages: {
                            type: 'array',
                            items: { type: 'number' },
                            description: 'Page numbers that received a redaction marker from this call (same numbering convention as addRedaction pageNumber).'
                        },
                        redactionCount: { type: 'number' },
                        message: { type: 'string' }
                    }
                },
                message: { type: 'string' }
            }
        }
    },
    {
        name: 'updateRedaction',
        description: 'Change style or overlay properties of an existing redaction marker before permanent apply. Use when the user wants to retint, relabel, realign, or tweak a pending redaction. Requires annotationId from addRedaction and a partial updates object. Does NOT burn content—call applyRedaction after the user confirms the final set of markers. Prefer editAnnotation for non-redaction marks.',
        annotations: {
            readOnlyHint: false
        },
        inputSchema: {
            type: 'object',
            properties: {
                annotationId: {
                    type: 'string',
                    description: 'Id of the redaction annotation to modify, as returned by addRedaction. Required.'
                },
                updates: {
                    type: 'object',
                    properties: {
                        overlayText: {
                            type: 'string',
                            description: 'New label drawn on the redaction (e.g. "REDACTED"). Empty string clears overlay text.'
                        },
                        markerFillColor: {
                            type: 'string',
                            description: 'Preview marker fill color shown before applyRedaction (CSS color string, e.g. "#FF0000" or "red"). Does not change burned-in fillColor.'
                        },
                        markerBorderColor: {
                            type: 'string',
                            description: 'Preview marker border/stroke color before apply (CSS color). Visual-only until applyRedaction.'
                        },
                        isRepeat: {
                            type: 'boolean',
                            description: 'When true, tile/repeat overlayText across the redaction area; when false, place a single label. Use true for large regions that need repeated "REDACTED" stamps.'
                        },
                        fillColor: {
                            type: 'string',
                            description: 'Permanent burn-in fill color used when applyRedaction runs (typically "#000000" / black). Choose carefully—this becomes the irreversible cover color.'
                        },
                        fontColor: {
                            type: 'string',
                            description: 'Color of overlayText drawn on the redaction (CSS color). Should contrast with fillColor for legibility after apply.'
                        },
                        fontSize: {
                            type: 'number',
                            description: 'Font size in points/pixels for overlayText. Increase for large redaction boxes; keep readable relative to bounds.'
                        },
                        fontFamily: {
                            type: 'string',
                            description: 'Font family for overlayText (e.g. "Helvetica", "Arial"). Subject to viewer/PDF font availability.'
                        },
                        textAlign: {
                            type: 'string',
                            description: 'Horizontal alignment of overlayText within the redaction area (e.g. "Left", "Center", "Right") as supported by the viewer.'
                        },
                        beforeRedactionsApplied: {
                            type: 'boolean',
                            description: 'Advanced ordering flag for apply-time processing relative to other pending redactions. Leave default unless stacking order matters.'
                        }
                    },
                    description: 'Partial bag of redaction properties to change. Required. Include only fields that should change; omit the rest. Supported keys: overlayText, markerFillColor, markerBorderColor, isRepeat, fillColor, fontColor, fontSize, fontFamily, textAlign, beforeRedactionsApplied.'
                }
            },
            required: ['annotationId', 'updates']
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: {
                    type: 'object',
                    properties: {
                        updatedAnnotationId: { type: 'string' },
                        updatedProperties: { type: 'object' },
                        message: { type: 'string' }
                    }
                },
                message: { type: 'string' }
            }
        }
    },
    {
        name: 'applyRedaction',
        description: 'Permanently burn all pending redaction markers into the PDF, removing underlying text/content so it cannot be recovered from the exported file. Use ONLY after addRedaction (and optional updateRedaction) and explicit user confirmation—this is irreversible content destruction. No input parameters. Follow with exportPDFDocument if the user needs a downloadable redacted file. Prefer undo only if the viewer still allows pre-apply undo of markers; after apply, content is gone.',
        annotations: {
            readOnlyHint: false
        },
        inputSchema: {
            type: 'object',
            properties: {}
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                },
                message: { type: 'string' }
            }
        }
    },
    {
        name: 'copyText',
        description: 'Copy the current text selection in the PDF viewer to the system clipboard. Use when the user asks to copy selected text, put the selection on the clipboard, or after they have highlighted a range in the UI. No input parameters—operates on the active selection only. Returns textCopied true when clipboard write succeeded. Prefer extractTextContent when the agent needs text programmatically without relying on UI selection; prefer searchAndNavigate to locate text before asking the user to select.',
        annotations: {
            readOnlyHint: true
        },
        inputSchema: {
            type: 'object',
            properties: {}
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                        textCopied: { type: 'boolean' }
                    }
                },
                message: { type: 'string' }
            }
        }
    }
];

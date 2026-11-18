/**
 * WebMCP Adapter for TreeGrid
 *
 * Provides WebMCP (Web Model Context Protocol) integration for the TreeGrid component.
 * Exposes 39 commonly-used TreeGrid APIs as WebMCP tools with JSON schemas and execution handlers.
 *
 * Supports:
 * - 9 Read-Only tools for data retrieval
 * - 19 Non-Destructive write tools for UI manipulation
 * - 8 Destructive tools with confirmation workflows
 * - 3 Export tools
 *
 * @hidden
 */
/* eslint-disable @typescript-eslint/no-explicit-any, valid-jsdoc, jsdoc/require-param-description, jsdoc/require-param-type, jsdoc/require-returns */
import { WebMcpTool, WebMcpToolResponse, WebMcpToolExecuteEventArgs, ITreeData } from '../base/interface';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import * as events from '../base/constant';
/**
 * Tool Definitions Array
 * Contains all 39 WebMCP tools with their schemas and metadata.
 * Tools are categorized by safety level for proper confirmation handling.
 */
const webMcpTools: WebMcpTool[] = [
    // ========================================================================
    // 🔵 READ-ONLY TOOLS (9) - No confirmation needed
    // ========================================================================
    {
        name: 'getViewRecords',
        annotations: { readOnlyHint: true },
        description: 'Retrieves the current flattened tree view records including all expanded/collapsed rows',
        inputSchema: { type: 'object', properties: {}, required: [] },
        outputSchema: { type: 'array', items: { type: 'object' } }
    },
    {
        name: 'getRows',
        annotations: { readOnlyHint: true },
        description: 'Gets all row HTML elements currently rendered in the TreeGrid',
        inputSchema: { type: 'object', properties: {}, required: [] },
        outputSchema: { type: 'array', items: { type: 'object' } }
    },
    {
        name: 'getSelectedData',
        annotations: { readOnlyHint: true },
        description: 'Retrieves the data of all selected rows in the TreeGrid',
        inputSchema: { type: 'object', properties: {}, required: [] },
        outputSchema: { type: 'array', items: { type: 'object' } }
    },
    {
        name: 'getSelectedRowElements',
        annotations: { readOnlyHint: true },
        description: 'Gets the HTML row elements for all selected rows',
        inputSchema: { type: 'object', properties: {}, required: [] },
        outputSchema: { type: 'array', items: { type: 'object' } }
    },
    {
        name: 'getSelectedRowIndices',
        annotations: { readOnlyHint: true },
        description: 'Returns an array of the indices of all selected rows',
        inputSchema: { type: 'object', properties: {}, required: [] },
        outputSchema: { type: 'array', items: { type: 'number' } }
    },
    {
        name: 'getSelectedCellIndices',
        annotations: { readOnlyHint: true },
        description: 'Gets the indices of all selected cells as an array of { rowIndex, cellIndex } objects',
        inputSchema: { type: 'object', properties: {}, required: [] },
        outputSchema: { type: 'array', items: { type: 'object' } }
    },
    {
        name: 'getCheckedData',
        annotations: { readOnlyHint: true },
        description: 'Retrieves all data rows that are currently checked (when checkboxes are enabled)',
        inputSchema: { type: 'object', properties: {}, required: [] },
        outputSchema: { type: 'array', items: { type: 'object' } }
    },
    {
        name: 'getCheckedRowIndices',
        annotations: { readOnlyHint: true },
        description: 'Returns indices of all checked rows',
        inputSchema: { type: 'object', properties: {}, required: [] },
        outputSchema: { type: 'array', items: { type: 'number' } }
    },
    {
        name: 'getVisibleData',
        annotations: { readOnlyHint: true },
        description: 'Gets all visible records currently displayed in the TreeGrid (respects filters, pagination)',
        inputSchema: { type: 'object', properties: {}, required: [] },
        outputSchema: { type: 'array', items: { type: 'object' } }
    },
    // ========================================================================
    // 🟢 NON-DESTRUCTIVE WRITE TOOLS (19) - Can be confirmed by AI
    // ========================================================================
    // Sorting Tools (3)
    {
        name: 'sortByColumn',
        annotations: { readOnlyHint: false },
        description: 'Sorts the TreeGrid by the specified column in ascending or descending order',
        inputSchema: {
            type: 'object',
            properties: {
                columnName: { type: 'string', description: 'Field name of the column to sort' },
                direction: { type: 'string', enum: ['Ascending', 'Descending'], description: 'Sort direction' },
                isMultiSort: { type: 'boolean', description: 'Whether to add to existing sorts (multi-sort) or replace' }
            },
            required: ['columnName', 'direction']
        },
        outputSchema: { type: 'object', properties: { success: { type: 'boolean' } } }
    },
    {
        name: 'clearAllSorts',
        annotations: { readOnlyHint: false },
        description: 'Removes all sorting from the TreeGrid and restores natural order',
        inputSchema: { type: 'object', properties: {}, required: [] },
        outputSchema: { type: 'object', properties: { success: { type: 'boolean' } } }
    },
    {
        name: 'removeSortFromColumn',
        annotations: { readOnlyHint: false },
        description: 'Removes the sort state from a specific column while keeping other sorts',
        inputSchema: {
            type: 'object',
            properties: {
                field: { type: 'string', description: 'Field name of the column to unsort' }
            },
            required: ['field']
        },
        outputSchema: { type: 'object', properties: { success: { type: 'boolean' } } }
    },
    // Filtering Tools (2)
    {
        name: 'filterByColumn',
        annotations: { readOnlyHint: false },
        description: 'Applies a filter to the TreeGrid for the specified column with optional operator',
        inputSchema: {
            type: 'object',
            properties: {
                columnName: { type: 'string', description: 'Column field name to filter' },
                filterValue: { type: 'string', description: 'Value to filter by' },
                operator: { type: 'string', description: 'Filter operator (startswith, endswith, contains, equals, etc)' }
            },
            required: ['columnName', 'filterValue']
        },
        outputSchema: { type: 'object', properties: { success: { type: 'boolean' }, rowsFiltered: { type: 'number' } } }
    },
    {
        name: 'clearAllFilters',
        annotations: { readOnlyHint: false },
        description: 'Removes all active filters from the TreeGrid and displays all rows',
        inputSchema: { type: 'object', properties: {}, required: [] },
        outputSchema: { type: 'object', properties: { success: { type: 'boolean' } } }
    },
    // Hierarchy/Expand/Collapse Tools (2)
    {
        name: 'expandAllRows',
        annotations: { readOnlyHint: false },
        description: 'Expands all parent rows in the TreeGrid to show all children at all levels',
        inputSchema: { type: 'object', properties: {}, required: [] },
        outputSchema: { type: 'object', properties: { success: { type: 'boolean' }, expandedCount: { type: 'number' } } }
    },
    {
        name: 'collapseAllRows',
        annotations: { readOnlyHint: false },
        description: 'Collapses all parent rows in the TreeGrid to hide their children',
        inputSchema: { type: 'object', properties: {}, required: [] },
        outputSchema: { type: 'object', properties: { success: { type: 'boolean' }, collapsedCount: { type: 'number' } } }
    },
    // Selection Tools (5)
    {
        name: 'selectRow',
        annotations: { readOnlyHint: false },
        description: 'Selects a single row by its index, optionally clearing other selections',
        inputSchema: {
            type: 'object',
            properties: {
                rowIndex: { type: 'number', description: 'Index of the row to select' },
                clearExisting: { type: 'boolean', description: 'Whether to deselect other rows' }
            },
            required: ['rowIndex']
        },
        outputSchema: { type: 'object', properties: { success: { type: 'boolean' } } }
    },
    {
        name: 'selectMultipleRows',
        annotations: { readOnlyHint: false },
        description: 'Selects multiple rows by their indices',
        inputSchema: {
            type: 'object',
            properties: {
                rowIndices: { type: 'array', items: { type: 'number' }, description: 'Array of row indices to select' },
                clearExisting: { type: 'boolean', description: 'Whether to deselect other rows first' }
            },
            required: ['rowIndices']
        },
        outputSchema: { type: 'object', properties: { success: { type: 'boolean' }, selectedCount: { type: 'number' } } }
    },
    {
        name: 'selectCell',
        annotations: { readOnlyHint: false },
        description: 'Selects a specific cell by row index and column index',
        inputSchema: {
            type: 'object',
            properties: {
                rowIndex: { type: 'number', description: 'Row index of the cell' },
                columnIndex: { type: 'number', description: 'Column index of the cell' }
            },
            required: ['rowIndex', 'columnIndex']
        },
        outputSchema: { type: 'object', properties: { success: { type: 'boolean' } } }
    },
    {
        name: 'checkRows',
        annotations: { readOnlyHint: false },
        description: 'Checks (marks checkboxes for) rows by their indices when checkbox selection is enabled',
        inputSchema: {
            type: 'object',
            properties: {
                rowIndices: { type: 'array', items: { type: 'number' }, description: 'Array of row indices to check' }
            },
            required: ['rowIndices']
        },
        outputSchema: { type: 'object', properties: { success: { type: 'boolean' }, checkedCount: { type: 'number' } } }
    },
    {
        name: 'clearAllSelection',
        annotations: { readOnlyHint: false },
        description: 'Clears all row, cell, and checkbox selections in the TreeGrid',
        inputSchema: { type: 'object', properties: {}, required: [] },
        outputSchema: { type: 'object', properties: { success: { type: 'boolean' } } }
    },
    // Column Visibility & Layout Tools (4)
    {
        name: 'showColumns',
        annotations: { readOnlyHint: false },
        description: 'Shows (makes visible) columns that were previously hidden',
        inputSchema: {
            type: 'object',
            properties: {
                fields: { type: 'array', items: { type: 'string' }, description: 'Array of column field names to show' }
            },
            required: ['fields']
        },
        outputSchema: { type: 'object', properties: { success: { type: 'boolean' }, shownCount: { type: 'number' } } }
    },
    {
        name: 'hideColumns',
        annotations: { readOnlyHint: false },
        description: 'Hides (makes invisible) the specified columns',
        inputSchema: {
            type: 'object',
            properties: {
                fields: { type: 'array', items: { type: 'string' }, description: 'Array of column field names to hide' }
            },
            required: ['fields']
        },
        outputSchema: { type: 'object', properties: { success: { type: 'boolean' }, hiddenCount: { type: 'number' } } }
    },
    {
        name: 'autoFitColumns',
        annotations: { readOnlyHint: false },
        description: 'Automatically adjusts column widths to fit their content',
        inputSchema: {
            type: 'object',
            properties: {
                fields: { type: 'array', items: { type: 'string' }, description: 'Array of column field names (empty = all columns)' }
            },
            required: []
        },
        outputSchema: { type: 'object', properties: { success: { type: 'boolean' } } }
    },
    {
        name: 'reorderColumns',
        annotations: { readOnlyHint: false },
        description: 'Changes the order of columns by moving a column to a new position',
        inputSchema: {
            type: 'object',
            properties: {
                fromField: { type: 'string', description: 'Field name of column to move' },
                toIndex: { type: 'number', description: 'Target column index position' }
            },
            required: ['fromField', 'toIndex']
        },
        outputSchema: { type: 'object', properties: { success: { type: 'boolean' } } }
    },
    // Navigation Tools (3)
    {
        name: 'searchRecords',
        annotations: { readOnlyHint: false },
        description: 'Searches the TreeGrid for records matching the search key across all columns',
        inputSchema: {
            type: 'object',
            properties: {
                searchKey: { type: 'string', description: 'Search string to find in grid rows' }
            },
            required: ['searchKey']
        },
        outputSchema: { type: 'object', properties: { success: { type: 'boolean' }, matchCount: { type: 'number' } } }
    },
    {
        name: 'goToPage',
        annotations: { readOnlyHint: false },
        description: 'Navigates to a specific page in the TreeGrid (when paging is enabled)',
        inputSchema: {
            type: 'object',
            properties: {
                pageNumber: { type: 'number', description: 'Page number to navigate to (1-based)' }
            },
            required: ['pageNumber']
        },
        outputSchema: { type: 'object', properties: { success: { type: 'boolean' }, currentPage: { type: 'number' } } }
    },
    {
        name: 'isFrozenGrid',
        annotations: { readOnlyHint: false },
        description: 'Toggles or sets the frozen column state of the TreeGrid',
        inputSchema: {
            type: 'object',
            properties: {
                frozenColumns: { type: 'number', description: 'Number of columns to freeze (0 = unfreeze)' }
            },
            required: ['frozenColumns']
        },
        outputSchema: { type: 'object', properties: { success: { type: 'boolean' }, frozenCount: { type: 'number' } } }
    },
    // ========================================================================
    // 🟠 DESTRUCTIVE WRITE TOOLS (8) - REQUIRE USER CONFIRMATION
    // ========================================================================
    // Data Manipulation (5)
    {
        name: 'addRecord',
        annotations: { readOnlyHint: false },
        description: 'Adds a new record to the TreeGrid with optional parent/position',
        inputSchema: {
            type: 'object',
            properties: {
                record: { type: 'object', description: 'The new record data object' },
                index: { type: 'number', description: 'Optional: row index to insert at' },
                parentUniqueID: { type: 'string', description: 'Optional: parent ID for hierarchy' }
            },
            required: ['record']
        },
        outputSchema: { type: 'object', properties: { success: { type: 'boolean' }, recordUID: { type: 'string' } } }
    },
    {
        name: 'updateCell',
        annotations: { readOnlyHint: false },
        description: 'Updates the value of a specific cell in the TreeGrid',
        inputSchema: {
            type: 'object',
            properties: {
                rowIndex: { type: 'number', description: 'Row index of the cell to update' },
                field: { type: 'string', description: 'Column field name' },
                newValue: { description: 'New value for the cell' }
            },
            required: ['rowIndex', 'field', 'newValue']
        },
        outputSchema: { type: 'object', properties: { success: { type: 'boolean' }, oldValue: {} } }
    },
    {
        name: 'updateRow',
        annotations: { readOnlyHint: false },
        description: 'Updates all fields of a row record in the TreeGrid',
        inputSchema: {
            type: 'object',
            properties: {
                rowIndex: { type: 'number', description: 'Row index to update' },
                record: { type: 'object', description: 'Record object with updated field values' }
            },
            required: ['rowIndex', 'record']
        },
        outputSchema: { type: 'object', properties: { success: { type: 'boolean' } } }
    },
    {
        name: 'deleteRecord',
        annotations: { readOnlyHint: false },
        description: 'Permanently deletes a row record from the TreeGrid',
        inputSchema: {
            type: 'object',
            properties: {
                rowIndex: { type: 'number', description: 'Index of the row to delete' }
            },
            required: ['rowIndex']
        },
        outputSchema: { type: 'object', properties: { success: { type: 'boolean' }, deletedRecord: { type: 'object' } } }
    },
    {
        name: 'setCellValue',
        annotations: { readOnlyHint: false },
        description: 'Sets a cell value using field name and row index',
        inputSchema: {
            type: 'object',
            properties: {
                rowIndex: { type: 'number', description: 'Row index' },
                field: { type: 'string', description: 'Column field name' },
                value: { description: 'New cell value' }
            },
            required: ['rowIndex', 'field', 'value']
        },
        outputSchema: { type: 'object', properties: { success: { type: 'boolean' } } }
    },
    // Hierarchy Manipulation (3)
    {
        name: 'reorderRows',
        annotations: { readOnlyHint: false },
        description: 'Reorders rows by moving a row from one position to another',
        inputSchema: {
            type: 'object',
            properties: {
                fromRowIndex: { type: 'number', description: 'Current row index' },
                toRowIndex: { type: 'number', description: 'Target row index' }
            },
            required: ['fromRowIndex', 'toRowIndex']
        },
        outputSchema: { type: 'object', properties: { success: { type: 'boolean' } } }
    },
    {
        name: 'indent',
        annotations: { readOnlyHint: false },
        description: 'Increases the hierarchy level of a row (makes it a child)',
        inputSchema: {
            type: 'object',
            properties: {
                rowIndex: { type: 'number', description: 'Row index to indent' }
            },
            required: ['rowIndex']
        },
        outputSchema: { type: 'object', properties: { success: { type: 'boolean' } } }
    },
    {
        name: 'outdent',
        annotations: { readOnlyHint: false },
        description: 'Decreases the hierarchy level of a row (makes it less nested)',
        inputSchema: {
            type: 'object',
            properties: {
                rowIndex: { type: 'number', description: 'Row index to outdent' }
            },
            required: ['rowIndex']
        },
        outputSchema: { type: 'object', properties: { success: { type: 'boolean' } } }
    },
    // ========================================================================
    // 📤 EXPORT TOOLS (3) - Non-destructive, user confirms file download
    // ========================================================================
    {
        name: 'pdfExport',
        annotations: { readOnlyHint: false },
        description: 'Exports the current TreeGrid data to a PDF file',
        inputSchema: {
            type: 'object',
            properties: {
                fileName: { type: 'string', description: 'Name of the PDF file to save' },
                orientation: { type: 'string', enum: ['Portrait', 'Landscape'], description: 'PDF page orientation' }
            },
            required: []
        },
        outputSchema: { type: 'object', properties: { success: { type: 'boolean' }, downloadUrl: { type: 'string' } } }
    },
    {
        name: 'csvExport',
        annotations: { readOnlyHint: false },
        description: 'Exports the current TreeGrid data to a CSV file',
        inputSchema: {
            type: 'object',
            properties: {
                fileName: { type: 'string', description: 'Name of the CSV file to save' }
            },
            required: []
        },
        outputSchema: { type: 'object', properties: { success: { type: 'boolean' }, downloadUrl: { type: 'string' } } }
    },
    {
        name: 'excelExport',
        annotations: { readOnlyHint: false },
        description: 'Exports the current TreeGrid data to an Excel file',
        inputSchema: {
            type: 'object',
            properties: {
                fileName: { type: 'string', description: 'Name of the Excel file to save' }
            },
            required: []
        },
        outputSchema: { type: 'object', properties: { success: { type: 'boolean' }, downloadUrl: { type: 'string' } } }
    }
];
/**
 * WebMcpTreegrid — Integrates TreeGrid with WebMCP protocol.
 *
 * Provides tool registration and execution management for AI model access to TreeGrid APIs.
 * Handles event-based tool invocation, confirmation workflows, and response formatting.
 *
 * Instance created when TreeGrid.enableWebMcp is true.
 */
export class WebMcpTreegrid {
    private parent: any;
    private webMcpAbortController: AbortController | null = null;
    /**
     * Initializes the WebMCP adapter for a TreeGrid instance.
     *
     * @param parent
     */
    constructor(parent: any) {
        this.parent = parent;
        this.addEventListener();
    }
    /**
     * Attaches event listeners for WebMCP communication with the TreeGrid.
     */
    private addEventListener(): void {
        this.parent.on(events.getWebMcpTools, this.getTools, this);
        this.parent.on(events.registerWebMcpTools, this.registerTools, this);
    }
    /**
     * Removes event listeners when component is destroyed.
     */
    private removeEventListener(): void {
        if (this.parent && !this.parent.isDestroyed) {
            this.parent.off(events.getWebMcpTools, this.getTools);
            this.parent.off(events.registerWebMcpTools, this.registerTools);
        }
    }
    /**
     * Applies webMcpSettings include/exclude filters to the tools array.
     * Also triggers onBeforeToolRegister callback if configured.
     *
     * @param tools
     */
    private applyWebMcpSettingsFilters(tools: WebMcpTool[]): WebMcpTool[] {
        const settings: any = this.parent.webMcpSettings;
        // If settings are not configured, return all tools
        if (!settings) {
            return tools;
        }
        // Check if WebMCP settings are globally disabled
        if (settings.enabled === false) {
            return [];
        }
        // Apply include filter (whitelist)
        if (settings.includeTools && Array.isArray(settings.includeTools) && settings.includeTools.length > 0) {
            tools = tools.filter((tool: WebMcpTool) => settings.includeTools.indexOf(tool.name) !== -1);
        }
        // Apply exclude filter (blacklist)
        if (settings.excludeTools && Array.isArray(settings.excludeTools) && settings.excludeTools.length > 0) {
            tools = tools.filter((tool: WebMcpTool) => settings.excludeTools.indexOf(tool.name) === -1);
        }
        // Apply onBeforeToolRegister callback
        if (settings.onBeforeToolRegister && typeof settings.onBeforeToolRegister === 'function') {
            tools = tools.filter((tool: WebMcpTool) => {
                try {
                    return settings.onBeforeToolRegister(tool) !== false;
                } catch (e) {
                    console.error('Error in onBeforeToolRegister callback:', e);
                    return true; // Continue if callback fails
                }
            });
        }

        return tools;
    }
    /**
     * Retrieves available tools, optionally filtered by names.
     * Returns deep copies of tool definitions to prevent external modification.
     * Applies webMcpSettings include/exclude filters if configured.
     *
     * @param args
     * @param args.toolNames
     * @param args.tools
     */
    private getTools(args: { toolNames?: string[]; tools?: WebMcpTool[] }): WebMcpTool[] {
        const toolNames: string[] = args.toolNames || [];
        let tools: WebMcpTool[] = [];
        if (toolNames && toolNames.length !== 0) {
            tools = webMcpTools
                .filter((tool: WebMcpTool) => toolNames.indexOf(tool.name) !== -1)
                .map((tool: WebMcpTool) => this.cloneTool(tool));
        } else {
            tools = webMcpTools.map((tool: WebMcpTool) => this.cloneTool(tool));
        }
        // Apply webMcpSettings filtering
        tools = this.applyWebMcpSettingsFilters(tools);
        args.tools = tools;
        return args.tools;
    }
    /**
     * Clones a tool definition to prevent external mutation.
     *
     * @param tool
     */
    private cloneTool(tool: WebMcpTool): WebMcpTool {
        return {
            name: tool.name,
            description: tool.description,
            inputSchema: JSON.parse(JSON.stringify(tool.inputSchema)),
            outputSchema: JSON.parse(JSON.stringify(tool.outputSchema)),
            annotations: JSON.parse(JSON.stringify(tool.annotations))
        };
    }
    /**
     * Registers tools with document.modelContext for AI access.
     * Sets up execute handlers and signal management for tool lifecycle.
     *
     * @param args
     * @param args.prefix
     * @param args.tools
     * @param args.exposedTo
     */
    private registerTools(args: { prefix?: string; tools?: string[] | WebMcpTool[]; exposedTo?: string[] }): void {
        const modelContext: any = (document as any).modelContext;
        if (!modelContext || typeof modelContext.registerTool !== 'function') {
            return;
        }
        this.webMcpAbortController = new AbortController();
        const toolPrefix: string = isNullOrUndefined(args.prefix) ? this.parent.element.id : (args.prefix as string);
        const tools: WebMcpTool[] =
            args.tools && Array.isArray(args.tools) && args.tools.length && typeof args.tools[0] === 'object'
                ? (args.tools as WebMcpTool[])
                : this.getTools({ toolNames: args.tools as string[] });
        tools.forEach((tool: WebMcpTool): void => {
            const prefixedTool: WebMcpTool = this.cloneTool(tool);
            prefixedTool.name = `${toolPrefix}_${prefixedTool.name}`;
            prefixedTool.execute = prefixedTool.execute || (async (toolArgs: object) => this.executeHandler(tool.name, toolArgs || {}));
            modelContext.registerTool(prefixedTool, {
                signal: this.webMcpAbortController!.signal,
                exposedTo: args.exposedTo
            });
        });
    }
    /**
     * Executes a WebMCP tool handler based on command name.
     * Fires beforeWebMcpToolExecute event to allow cancellation and confirmation.
     * Applies webMcpSettings callbacks and confirmation workflow.
     *
     * @param command
     * @param args
     */
    private async executeHandler(command: string, args: object): Promise<WebMcpToolResponse> {
        // Apply webMcpSettings onBeforeToolExecute callback
        const settings: any = this.parent.webMcpSettings;
        if (settings && settings.onBeforeToolExecute && typeof settings.onBeforeToolExecute === 'function') {
            try {
                const result: boolean | void = settings.onBeforeToolExecute(command, args);
                if (result === false) {

                    return this.message({
                        action: command,
                        cancelled: true,
                        message: '[USER_CANCELLED] Tool execution was cancelled by webMcpSettings.onBeforeToolExecute'
                    });
                }
            } catch (e) {
                console.error('[TreeGrid WebMCP] Error in onBeforeToolExecute callback:', e);
            }
        }
        const eventArgs: WebMcpToolExecuteEventArgs = { toolName: command, toolArgs: args };
        this.parent.trigger('beforeWebMcpToolExecute', eventArgs);
        // Check if tool execution was cancelled by the event handler
        if (eventArgs.cancel) {
            return this.message({
                action: command,
                cancelled: true,
                message: eventArgs.cancellationResponse || `[USER_CANCELLED] Tool "${command}" was cancelled. This is final. Do NOT retry.`
            });
        }
        // Route to tool handler
        try {
            switch (command) {
            // Read-Only Tools
            case 'getViewRecords': return this.handleGetViewRecords(args);
            case 'getRows': return this.handleGetRows(args);
            case 'getSelectedData': return this.handleGetSelectedData(args);
            case 'getSelectedRowElements': return this.handleGetSelectedRowElements(args);
            case 'getSelectedRowIndices': return this.handleGetSelectedRowIndices(args);
            case 'getSelectedCellIndices': return this.handleGetSelectedCellIndices(args);
            case 'getCheckedData': return this.handleGetCheckedData(args);
            case 'getCheckedRowIndices': return this.handleGetCheckedRowIndices(args);
            case 'getVisibleData': return this.handleGetVisibleData(args);
                // Non-Destructive Write Tools
            case 'sortByColumn': return await this.handleSortByColumn(args);
            case 'clearAllSorts': return await this.handleClearAllSorts(args);
            case 'removeSortFromColumn': return await this.handleRemoveSortFromColumn(args);
            case 'filterByColumn': return await this.handleFilterByColumn(args);
            case 'clearAllFilters': return await this.handleClearAllFilters(args);
            case 'expandAllRows': return await this.handleExpandAllRows(args);
            case 'collapseAllRows': return await this.handleCollapseAllRows(args);
            case 'selectRow': return await this.handleSelectRow(args);
            case 'selectMultipleRows': return await this.handleSelectMultipleRows(args);
            case 'selectCell': return await this.handleSelectCell(args);
            case 'checkRows': return await this.handleCheckRows(args);
            case 'clearAllSelection': return await this.handleClearAllSelection(args);
            case 'showColumns': return await this.handleShowColumns(args);
            case 'hideColumns': return await this.handleHideColumns(args);
            case 'autoFitColumns': return await this.handleAutoFitColumns(args);
            case 'reorderColumns': return await this.handleReorderColumns(args);
            case 'searchRecords': return await this.handleSearchRecords(args);
            case 'goToPage': return await this.handleGoToPage(args);
            case 'isFrozenGrid': return await this.handleIsFrozenGrid(args);
                // Destructive Write Tools (Direct Execution - No Confirmation)
            case 'addRecord': return await this.handleAddRecord(args);
            case 'updateCell': return await this.handleUpdateCell(args);
            case 'updateRow': return await this.handleUpdateRow(args);
            case 'deleteRecord': return await this.handleDeleteRecord(args);
            case 'setCellValue': return await this.handleSetCellValue(args);
            case 'reorderRows': return await this.handleReorderRows(args);
            case 'indent': return await this.handleIndent(args);
            case 'outdent': return await this.handleOutdent(args);
                // Export Tools
            case 'pdfExport': return await this.handlePdfExport(args);
            case 'csvExport': return await this.handleCsvExport(args);
            case 'excelExport': return await this.handleExcelExport(args);
            default:
                return this.error(`Tool "${command}" not found in WebMCP adapter.`);
            }
        } catch (error) {
            return this.error(`Error executing tool "${command}": ${error.message}`);
        }
    }
    // ======================================================================
    // DESTRUCTIVE WRITE TOOL HANDLERS (8) - Direct Execution (No Confirmation)
    // ======================================================================
    // Safe array access helper to avoid object injection vulnerabilities
    private safeGetRecord: (array: any[], index: number) => any = (array: any[], index: number): any => {
        if (typeof index === 'number' && index >= 0 && index < array.length) {
            return array.slice(index, index + 1)[0];
        }
        return null;
    };
    private async handleAddRecord(args: any): Promise<WebMcpToolResponse> {
        try {
            const { data, index, position } = (args as any);
            this.parent.addRecord(data, index, position);
            return this.message({ success: true, action: 'addRecord', message: 'Record added successfully' });
        } catch (error) {
            return this.error(`Failed to add record: ${error.message}`);
        }
    }
    private async handleUpdateCell(args: any): Promise<WebMcpToolResponse> {
        try {
            const { key, field, value } = (args as any);
            this.parent.updateCell(key, field, value);
            return this.message({ success: true, action: 'updateCell', message: 'Cell updated successfully' });
        } catch (error) {
            return this.error(`Failed to update cell: ${error.message}`);
        }
    }
    private async handleUpdateRow(args: any): Promise<WebMcpToolResponse> {
        try {
            const { rowIndex, data } = (args as any);
            const records: ITreeData[] = this.parent.getCurrentViewRecords();
            if (typeof rowIndex === 'number' && rowIndex >= 0 && rowIndex < records.length) {
                const currentRecord: ITreeData = this.safeGetRecord(records, rowIndex) as ITreeData;
                if (currentRecord && data) {
                    Object.assign(currentRecord, data);
                    this.parent.refresh();
                }
            } else {
                return this.error('Invalid rowIndex: must be non-negative and within range');
            }
            return this.message({ success: true, action: 'updateRow', message: 'Row updated successfully' });
        } catch (error) {
            return this.error(`Failed to update row: ${error.message}`);
        }
    }
    private async handleDeleteRecord(args: any): Promise<WebMcpToolResponse> {
        try {
            const { fieldName, data } = (args as any);
            this.parent.deleteRecord(fieldName, data);
            return this.message({ success: true, action: 'deleteRecord', message: 'Record deleted successfully' });
        } catch (error) {
            return this.error(`Failed to delete record: ${error.message}`);
        }
    }
    private async handleSetCellValue(args: any): Promise<WebMcpToolResponse> {
        try {
            const { key, field, value } = (args as any);
            this.parent.setCellValue(key, field, value);
            return this.message({ success: true, action: 'setCellValue', message: 'Cell value set successfully' });
        } catch (error) {
            return this.error(`Failed to set cell value: ${error.message}`);
        }
    }
    private async handleReorderRows(args: any): Promise<WebMcpToolResponse> {
        try {
            const { fromIndexes, toIndex, position } = (args as any);
            this.parent.reorderRows(fromIndexes, toIndex, position || 'below');
            return this.message({ success: true, action: 'reorderRows', message: 'Rows reordered successfully' });
        } catch (error) {
            return this.error(`Failed to reorder rows: ${error.message}`);
        }
    }
    private async handleIndent(args: any): Promise<WebMcpToolResponse> {
        try {
            const { rowIndex } = (args as any);
            const records: ITreeData[] = this.parent.getCurrentViewRecords();
            if (typeof rowIndex === 'number' && rowIndex >= 0 && rowIndex < records.length) {
                const record: ITreeData = this.safeGetRecord(records, rowIndex) as ITreeData;
                if (record && this.parent.indent) {
                    this.parent.indent(record);
                }
            } else {
                return this.error('Invalid rowIndex: must be non-negative and within range');
            }
            return this.message({ success: true, action: 'indent', message: 'Row indented successfully' });
        } catch (error) {
            return this.error(`Failed to indent row: ${error.message}`);
        }
    }
    private async handleOutdent(args: any): Promise<WebMcpToolResponse> {
        try {
            const { rowIndex } = (args as any);
            const records: ITreeData[] = this.parent.getCurrentViewRecords();
            if (typeof rowIndex === 'number' && rowIndex >= 0 && rowIndex < records.length) {
                const record: ITreeData = this.safeGetRecord(records, rowIndex) as ITreeData;
                if (record && this.parent.outdent) {
                    this.parent.outdent(record);
                }
            } else {
                return this.error('Invalid rowIndex: must be non-negative and within range');
            }
            return this.message({ success: true, action: 'outdent', message: 'Row outdented successfully' });
        } catch (error) {
            return this.error(`Failed to outdent row: ${error.message}`);
        }
    }
    public destroy(): void {
        this.removeEventListener();
        if (this.webMcpAbortController) {
            this.webMcpAbortController.abort();
            this.webMcpAbortController = null;
        }
        this.parent = null;
    }
    /**
     * Returns module name for identification.
     */
    public getModuleName(): string {
        return 'WebMcpTreegrid';
    }
    /**
     * Formats a successful response in WebMCP standard format.
     *
     * @param data
     */
    private message(data: any): WebMcpToolResponse {
        return {
            content: [{
                type: 'text',
                text: JSON.stringify(data)
            }]
        };
    }
    /**
     * Formats an error response in WebMCP standard format.
     *
     * @param text
     */
    private error(text: string): WebMcpToolResponse {
        return {
            content: [{
                type: 'text',
                text
            }],
            isError: true
        };
    }
    /**
     * Request user confirmation before executing operations.
     *
     * @param command
     * @param args
     * @param message
     */
    private handleGetViewRecords(args: any): WebMcpToolResponse {
        try {
            const records: ITreeData[] = this.parent.getCurrentViewRecords();
            return this.message({ success: true, records: records, count: (records && records.length) || 0 });
        } catch (error) {
            return this.error(`Failed to get view records: ${error.message}`);
        }
    }
    private handleGetRows(args: any): WebMcpToolResponse {
        try {
            const rows: HTMLTableRowElement[] = this.parent.getRows();
            return this.message({ success: true, rows: (rows && rows.length) || 0 });
        } catch (error) {
            return this.error(`Failed to get rows: ${error.message}`);
        }
    }
    private handleGetSelectedData(args: any): WebMcpToolResponse {
        try {
            const data: any[] = this.parent.getSelectedData();
            return this.message({ success: true, data, count: (data && data.length) || 0 });
        } catch (error) {
            return this.error(`Failed to get selected data: ${error.message}`);
        }
    }
    private handleGetSelectedRowElements(args: any): WebMcpToolResponse {
        try {
            const elements: HTMLTableRowElement[] = this.parent.getSelectedRowElements();
            return this.message({ success: true, elementCount: (elements && elements.length) || 0 });
        } catch (error) {
            return this.error(`Failed to get selected row elements: ${error.message}`);
        }
    }
    private handleGetSelectedRowIndices(args: any): WebMcpToolResponse {
        try {
            const indices: number[] = this.parent.getSelectedRowIndices();
            return this.message({ success: true, indices });
        } catch (error) {
            return this.error(`Failed to get selected row indices: ${error.message}`);
        }
    }
    private handleGetSelectedCellIndices(args: any): WebMcpToolResponse {
        try {
            const indices: any[] = this.parent.getSelectedCellIndices();
            return this.message({ success: true, indices });
        } catch (error) {
            return this.error(`Failed to get selected cell indices: ${error.message}`);
        }
    }
    private handleGetCheckedData(args: any): WebMcpToolResponse {
        try {
            const data: any[] = this.parent.getCheckedData();
            return this.message({ success: true, data, count: (data && data.length) || 0 });
        } catch (error) {
            return this.error(`Failed to get checked data: ${error.message}`);
        }
    }
    private handleGetCheckedRowIndices(args: any): WebMcpToolResponse {
        try {
            const indices: number[] = this.parent.getCheckedRowIndices();
            return this.message({ success: true, indices });
        } catch (error) {
            return this.error(`Failed to get checked row indices: ${error.message}`);
        }
    }
    private handleGetVisibleData(args: any): WebMcpToolResponse {
        try {
            const data: any[] = this.parent.getCurrentViewRecords(); // Visible records
            return this.message({ success: true, data, count: (data && data.length) || 0 });
        } catch (error) {
            return this.error(`Failed to get visible data: ${error.message}`);
        }
    }
    // ======================================================================
    // NON-DESTRUCTIVE WRITE TOOL HANDLERS (19)
    // ======================================================================
    private async handleSortByColumn(args: any): Promise<WebMcpToolResponse> {
        try {
            const { columnName, direction, isMultiSort } = args;
            this.parent.sortByColumn(columnName, direction, isMultiSort);
            return this.message({ success: true, message: `Sorted by ${columnName} ${direction}` });
        } catch (error) {
            return this.error(`Sort failed: ${error.message}`);
        }
    }
    private async handleClearAllSorts(args: any): Promise<WebMcpToolResponse> {
        try {
            this.parent.clearSorting();
            return this.message({ success: true, message: 'All sorts cleared' });
        } catch (error) {
            return this.error(`Clear sorting failed: ${error.message}`);
        }
    }
    private async handleRemoveSortFromColumn(args: any): Promise<WebMcpToolResponse> {
        try {
            const { field } = args;
            this.parent.removeSortColumn(field);
            return this.message({ success: true, message: `Sort removed from ${field}` });
        } catch (error) {
            return this.error(`Remove sort failed: ${error.message}`);
        }
    }
    private async handleFilterByColumn(args: any): Promise<WebMcpToolResponse> {
        try {
            const { columnName, filterValue, operator } = args;
            this.parent.filterByColumn(columnName, operator || 'contains', filterValue);
            const filtered: any[] = this.parent.getCurrentViewRecords();
            return this.message({ success: true, message: 'Filter applied', rowsFiltered: (filtered && filtered.length) || 0 });
        } catch (error) {
            return this.error(`Filter failed: ${error.message}`);
        }
    }
    private async handleClearAllFilters(args: any): Promise<WebMcpToolResponse> {
        try {
            this.parent.clearFiltering();
            return this.message({ success: true, message: 'All filters cleared' });
        } catch (error) {
            return this.error(`Clear filtering failed: ${error.message}`);
        }
    }
    private async handleExpandAllRows(args: any): Promise<WebMcpToolResponse> {
        try {
            this.parent.expandAll();
            return this.message({ success: true, message: 'All rows expanded' });
        } catch (error) {
            return this.error(`Expand all failed: ${error.message}`);
        }
    }
    private async handleCollapseAllRows(args: any): Promise<WebMcpToolResponse> {
        try {
            this.parent.collapseAll();
            return this.message({ success: true, message: 'All rows collapsed' });
        } catch (error) {
            return this.error(`Collapse all failed: ${error.message}`);
        }
    }
    private async handleSelectRow(args: any): Promise<WebMcpToolResponse> {
        try {
            const { rowIndex, clearExisting } = args;
            if (clearExisting) {this.parent.clearSelection(); }
            this.parent.selectRow(rowIndex);
            return this.message({ success: true, message: `Row ${rowIndex} selected` });
        } catch (error) {
            return this.error(`Select row failed: ${error.message}`);
        }
    }
    private async handleSelectMultipleRows(args: any): Promise<WebMcpToolResponse> {
        try {
            const { rowIndices, clearExisting } = args;
            if (clearExisting) {this.parent.clearSelection(); }
            this.parent.selectRows(rowIndices);
            return this.message({ success: true, message: `${rowIndices.length} rows selected` });
        } catch (error) {
            return this.error(`Select multiple rows failed: ${error.message}`);
        }
    }
    private async handleSelectCell(args: any): Promise<WebMcpToolResponse> {
        try {
            const { rowIndex, columnIndex } = args;
            this.parent.selectCell([rowIndex, columnIndex]);
            return this.message({ success: true, message: `Cell at [${rowIndex}, ${columnIndex}] selected` });
        } catch (error) {
            return this.error(`Select cell failed: ${error.message}`);
        }
    }
    private async handleCheckRows(args: any): Promise<WebMcpToolResponse> {
        try {
            const { rowIndices } = args;
            this.parent.checkboxSelection(rowIndices);
            return this.message({ success: true, message: `${rowIndices.length} rows checked` });
        } catch (error) {
            return this.error(`Check rows failed: ${error.message}`);
        }
    }
    private async handleClearAllSelection(args: any): Promise<WebMcpToolResponse> {
        try {
            this.parent.clearSelection();
            return this.message({ success: true, message: 'All selections cleared' });
        } catch (error) {
            return this.error(`Clear selection failed: ${error.message}`);
        }
    }
    private async handleShowColumns(args: any): Promise<WebMcpToolResponse> {
        try {
            const { fields } = args;
            this.parent.showColumns(fields);
            return this.message({ success: true, message: `${fields.length} columns shown` });
        } catch (error) {
            return this.error(`Show columns failed: ${error.message}`);
        }
    }
    private async handleHideColumns(args: any): Promise<WebMcpToolResponse> {
        try {
            const { fields } = args;
            this.parent.hideColumns(fields);
            return this.message({ success: true, message: `${fields.length} columns hidden` });
        } catch (error) {
            return this.error(`Hide columns failed: ${error.message}`);
        }
    }
    private async handleAutoFitColumns(args: any): Promise<WebMcpToolResponse> {
        try {
            const { fields } = args;
            this.parent.autoFitColumns(fields || []);
            return this.message({ success: true, message: 'Columns auto-fitted' });
        } catch (error) {
            return this.error(`Auto-fit columns failed: ${error.message}`);
        }
    }
    private async handleReorderColumns(args: any): Promise<WebMcpToolResponse> {
        try {
            const { fromField, toIndex } = args;
            this.parent.reorderColumns(fromField, toIndex);
            return this.message({ success: true, message: `${fromField} reordered to position ${toIndex}` });
        } catch (error) {
            return this.error(`Reorder columns failed: ${error.message}`);
        }
    }
    private async handleSearchRecords(args: any): Promise<WebMcpToolResponse> {
        try {
            const { searchKey } = args;
            this.parent.search(searchKey);
            const results: any[] = this.parent.getCurrentViewRecords();
            return this.message({ success: true, message: `Search for "${searchKey}" completed`, matchCount: (results && results.length) || 0 });
        } catch (error) {
            return this.error(`Search failed: ${error.message}`);
        }
    }
    private async handleGoToPage(args: any): Promise<WebMcpToolResponse> {
        try {
            const { pageNumber } = args;
            this.parent.goToPage(pageNumber);
            return this.message({ success: true, message: `Navigated to page ${pageNumber}`, currentPage: pageNumber });
        } catch (error) {
            return this.error(`Go to page failed: ${error.message}`);
        }
    }
    private async handleIsFrozenGrid(args: any): Promise<WebMcpToolResponse> {
        try {
            const { frozenColumns } = args;
            this.parent.frozenColumns = frozenColumns;
            return this.message({ success: true, message: `Frozen columns set to ${frozenColumns}`, frozenCount: frozenColumns });
        } catch (error) {
            return this.error(`Set frozen columns failed: ${error.message}`);
        }
    }
    // ======================================================================
    // EXPORT TOOL HANDLERS (3)
    // ======================================================================
    private async handlePdfExport(args: any): Promise<WebMcpToolResponse> {
        try {
            const { fileName, orientation } = args;
            this.parent.pdfExport(fileName, orientation);
            return this.message({ success: true, message: 'PDF export initiated', fileName });
        } catch (error) {
            return this.error(`PDF export failed: ${error.message}`);
        }
    }
    private async handleCsvExport(args: any): Promise<WebMcpToolResponse> {
        try {
            const { fileName } = args;
            this.parent.csvExport(fileName);
            return this.message({ success: true, message: 'CSV export initiated', fileName });
        } catch (error) {
            return this.error(`CSV export failed: ${error.message}`);
        }
    }
    private async handleExcelExport(args: any): Promise<WebMcpToolResponse> {
        try {
            const { fileName } = args;
            this.parent.excelExport(fileName);
            return this.message({ success: true, message: 'Excel export initiated', fileName });
        } catch (error) {
            return this.error(`Excel export failed: ${error.message}`);
        }
    }
}

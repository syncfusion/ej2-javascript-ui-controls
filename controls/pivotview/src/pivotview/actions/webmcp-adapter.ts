/**
 * WebMCP tool adapter for PivotView operations.
 */
import { PivotView } from '../base/pivotview';
import {
    WebMcpTool,
    WebMcpToolResponse,
    WebMcpToolExecuteEventArgs,
    WebMcpSetDataSourceArgs,
    WebMcpFieldAxisArgs,
    WebMcpMoveFieldBetweenAxesArgs,
    WebMcpApplyFilteringArgs,
    WebMcpApplySortingArgs,
    WebMcpApplyValueSortingArgs,
    WebMcpManageCalculatedFieldArgs,
    WebMcpExportToFileArgs,
    WebMcpSetChartTypeArgs,
    WebMcpToggleViewModeArgs,
    WebMcpApplyNumberFormatArgs,
    WebMcpApplyConditionalFormattingArgs,
    WebMcpExportProperties,
    WebMcpChartSettings
} from '../../common/base/interface';
import { getWebMcpTools, registerWebMcpTools, executeWebMcpTool } from '../../common/base/constant';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { CalculatedFieldSettingsModel, ConditionalFormatSettingsModel, DataSourceSettingsModel, FilterModel, FormatSettingsModel, SortModel, ValueSortSettingsModel } from '../../model/datasourcesettings-model';
import { IFieldOptions } from '../../base/engine';
import { DataSourceType } from '../../base/types';
import { ConditionalFormatSettings } from '../../model/datasourcesettings';
import { DisplayOptionModel } from '../base/pivotview-model';
import { ChartSeriesType, View } from '../../common/base/enum';

const webMcpTools: WebMcpTool[] = [
    {
        name: 'setDataSource',
        annotations: {
            readOnlyHint: false
        },
        description: 'Load a new dataset into the pivot table. Supports JSON data (array of objects), CSV data (array of arrays), or URL to data source.',
        inputSchema: {
            type: 'object',
            properties: {
                dataSource: {
                    type: 'array',
                    description: 'The new data source to load into the pivot table. Can be an array of objects (JSON) or array of arrays (CSV).'
                },
                url: {
                    type: 'string',
                    description: 'URL to the data source. Can be JSON or CSV data.'
                },
                type: {
                    type: 'string',
                    description: 'Explicitly specify the data type (JSON or CSV). If not provided, type will be inferred from file extension.'
                }
            },
            required: ['dataSource']
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: { type: 'object' },
                message: { type: 'string' }
            },
            required: ['success', 'data', 'message']
        }
    },
    {
        name: 'addFieldToAxis',
        annotations: {
            readOnlyHint: false
        },
        description: 'Add a field to a specific axis (rows, columns, values, or filters)',
        inputSchema: {
            type: 'object',
            properties: {
                fieldName: { type: 'string', description: 'The name of the field to add' },
                axis: { type: 'string', description: 'The axis to add the field to (rows, columns, values, or filters)' }
            },
            required: ['fieldName', 'axis']
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: { type: 'object' },
                message: { type: 'string' }
            },
            required: ['success', 'data', 'message']
        }
    },
    {
        name: 'removeFieldFromAxis',
        annotations: {
            readOnlyHint: false
        },
        description: 'Remove a field from a specific axis',
        inputSchema: {
            type: 'object',
            properties: {
                fieldName: { type: 'string', description: 'The name of the field to remove' },
                axis: { type: 'string', description: 'The axis to remove the field from (rows, columns, values, or filters)' }
            },
            required: ['fieldName', 'axis']
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: { type: 'object' },
                message: { type: 'string' }
            },
            required: ['success', 'data', 'message']
        }
    },
    {
        name: 'moveFieldBetweenAxes',
        annotations: {
            readOnlyHint: false
        },
        description: 'Move a field from one axis to another',
        inputSchema: {
            type: 'object',
            properties: {
                fieldName: { type: 'string', description: 'The name of the field to move' },
                fromAxis: { type: 'string', description: 'The axis to move the field from' },
                toAxis: { type: 'string', description: 'The axis to move the field to' }
            },
            required: ['fieldName', 'fromAxis', 'toAxis']
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: { type: 'object' },
                message: { type: 'string' }
            },
            required: ['success', 'data', 'message']
        }
    },
    {
        name: 'applyFiltering',
        annotations: {
            readOnlyHint: false
        },
        description: 'Apply various types of filters to the data including member filters, label filters, and value filters',
        inputSchema: {
            type: 'object',
            properties: {
                filters: {
                    type: 'array',
                    description: 'Array of filter objects',
                    items: {
                        type: 'object',
                        properties: {
                            name: { type: 'string', description: 'The field name to apply filtering to' },
                            type: { type: 'string', description: 'The filter type (Include, Exclude, Label, Date, Number, Value)' },
                            items: {
                                type: 'array',
                                description: 'Array of field members to include/exclude',
                                items: { type: 'string' }
                            },
                            condition: { type: 'string', description: 'The condition operator for conditional filtering (Equals, NotEquals, GreaterThan, etc.)' },
                            value1: { type: ['string', 'number'], description: 'The first value for comparison' },
                            value2: { type: ['string', 'number'], description: 'The second value for comparison (used with Between and NotBetween conditions)' }
                        },
                        required: ['name']
                    }
                }
            },
            required: ['filters']
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: { type: 'object' },
                message: { type: 'string' }
            },
            required: ['success', 'data', 'message']
        }
    },
    {
        name: 'applySorting',
        annotations: {
            readOnlyHint: false
        },
        description: 'Sort data by specific fields in ascending or descending order',
        inputSchema: {
            type: 'object',
            properties: {
                sortSettings: {
                    type: 'array',
                    description: 'Array of sort objects',
                    items: {
                        type: 'object',
                        properties: {
                            name: { type: 'string', description: 'The field name to apply sorting to' },
                            order: { type: 'string', description: 'The sort order (Ascending, Descending, None)', enum: ['Ascending', 'Descending', 'None'] }
                        },
                        required: ['name', 'order']
                    }
                }
            },
            required: ['sortSettings']
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: { type: 'object' },
                message: { type: 'string' }
            },
            required: ['success', 'data', 'message']
        }
    },
    {
        name: 'applyValueSorting',
        annotations: {
            readOnlyHint: false
        },
        description: 'Sort data based on value measures rather than field names. Requires enableValueSorting property to be set to true.',
        inputSchema: {
            type: 'object',
            properties: {
                valueSortSettings: {
                    type: 'object',
                    description: 'Value sort settings object',
                    properties: {
                        headerText: { type: 'string', description: 'The header text of the value to sort by' },
                        headerDelimiter: { type: 'string', description: 'Delimiter used in the header text' },
                        sortOrder: { type: 'string', description: 'The sort order (Ascending, Descending)', enum: ['Ascending', 'Descending'] },
                        columnHeaderText: { type: 'string', description: 'The column header text for multiple axis sorting' },
                        columnSortOrder: { type: 'string', description: 'The column sort order for multiple axis sorting', enum: ['Ascending', 'Descending'] },
                        rowHeaderText: { type: 'string', description: 'The row header text for multiple axis sorting' },
                        rowSortOrder: { type: 'string', description: 'The row sort order for multiple axis sorting', enum: ['Ascending', 'Descending'] }
                    },
                    required: ['headerText', 'sortOrder']
                }
            },
            required: ['valueSortSettings']
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: { type: 'object' },
                message: { type: 'string' }
            },
            required: ['success', 'data', 'message']
        }
    },
    {
        name: 'clearAllFilters',
        annotations: {
            readOnlyHint: false
        },
        description: 'Remove all applied filters to see the complete dataset',
        inputSchema: {
            type: 'object',
            properties: {}
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: { type: 'object' },
                message: { type: 'string' }
            },
            required: ['success', 'data', 'message']
        }
    },
    {
        name: 'applyConditionalFormatting',
        annotations: {
            readOnlyHint: false
        },
        description: 'Apply visual formatting rules to highlight cells based on their values. Requires allowConditionalFormatting property to be set to true and ConditionalFormatting module to be injected.',
        inputSchema: {
            type: 'object',
            properties: {
                formatRules: {
                    type: 'array',
                    description: 'Array of conditional formatting rules',
                    items: {
                        type: 'object',
                        properties: {
                            measure: { type: 'string', description: 'The value field name to apply formatting to (optional - if not provided, applies to all fields)' },
                            conditions: {
                                type: 'string',
                                description: 'The condition operator (e.g., LessThan, GreaterThan, Equals, Between, etc.)'
                            },
                            value1: { type: 'number', description: 'The first value for comparison' },
                            value2: { type: 'number', description: 'The second value for comparison (used with Between and NotBetween conditions)' },
                            style: {
                                type: 'object',
                                description: 'The styling to apply',
                                properties: {
                                    backgroundColor: { type: 'string', description: 'Background color' },
                                    color: { type: 'string', description: 'Font color' },
                                    fontFamily: { type: 'string', description: 'Font family' },
                                    fontSize: { type: 'string', description: 'Font size' }
                                }
                            },
                            applyGrandTotals: { type: 'boolean', description: 'Whether to apply formatting to grand totals' }
                        },
                        required: ['conditions', 'value1', 'style']
                    }
                }
            },
            required: ['formatRules']
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: { type: 'object' },
                message: { type: 'string' }
            },
            required: ['success', 'data', 'message']
        }
    },
    {
        name: 'manageCalculatedField',
        annotations: {
            readOnlyHint: false
        },
        description: 'Create, update, or delete a calculated field using formulas based on existing fields',
        inputSchema: {
            type: 'object',
            properties: {
                action: {
                    type: 'string',
                    enum: ['create', 'update', 'delete'],
                    description: 'The action to perform on the calculated field'
                },
                fieldName: { type: 'string', description: 'The name of the calculated field (auto-generated if not provided by user)' },
                formula: { type: 'string', description: 'The formula for the calculated field (required for create/update)' }
            },
            required: ['action', 'fieldName']
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: { type: 'object' },
                message: { type: 'string' }
            },
            required: ['success', 'data', 'message']
        }
    },
    {
        name: 'clearSorting',
        annotations: {
            readOnlyHint: false
        },
        description: 'Clear all applied sorting to restore default ordering',
        inputSchema: {
            type: 'object',
            properties: {}
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: { type: 'object' },
                message: { type: 'string' }
            },
            required: ['success', 'data', 'message']
        }
    },
    {
        name: 'clearConditionalFormatting',
        annotations: {
            readOnlyHint: false
        },
        description: 'Remove all applied conditional formatting rules',
        inputSchema: {
            type: 'object',
            properties: {}
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: { type: 'object' },
                message: { type: 'string' }
            },
            required: ['success', 'data', 'message']
        }
    },
    {
        name: 'clearNumberFormatting',
        annotations: {
            readOnlyHint: false
        },
        description: 'Remove all applied number formatting to restore default formatting',
        inputSchema: {
            type: 'object',
            properties: {}
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: { type: 'object' },
                message: { type: 'string' }
            },
            required: ['success', 'data', 'message']
        }
    },
    {
        name: 'exportToExcel',
        annotations: {
            readOnlyHint: false
        },
        description: 'Export the pivot table data to an Excel file for further analysis. Requires allowExcelExport property to be set to true and ExcelExport module to be injected.',
        inputSchema: {
            type: 'object',
            properties: {
                exportProperties: {
                    type: 'object',
                    description: 'Additional properties for Excel export, including fileName',
                    properties: {
                        fileName: { type: 'string', description: 'The name of the exported file' }
                    }
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
                        filePath: { type: 'string' }
                    }
                },
                message: { type: 'string' }
            },
            required: ['success', 'data', 'message']
        }
    },
    {
        name: 'exportToPDF',
        annotations: {
            readOnlyHint: false
        },
        description: 'Export the pivot table to a PDF document for sharing or printing. Requires allowPdfExport property to be set to true and PDFExport module to be injected.',
        inputSchema: {
            type: 'object',
            properties: {
                exportProperties: {
                    type: 'object',
                    description: 'Additional properties for PDF export, including fileName',
                    properties: {
                        fileName: { type: 'string', description: 'The name of the exported file' }
                    }
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
                        filePath: { type: 'string' }
                    }
                },
                message: { type: 'string' }
            },
            required: ['success', 'data', 'message']
        }
    },
    {
        name: 'exportToCSV',
        annotations: {
            readOnlyHint: false
        },
        description: 'Export the pivot table data to a CSV file for import into other systems. Requires allowExcelExport property to be set to true and ExcelExport module to be injected.',
        inputSchema: {
            type: 'object',
            properties: {
                exportProperties: {
                    type: 'object',
                    description: 'Additional properties for CSV export, including fileName',
                    properties: {
                        fileName: { type: 'string', description: 'The name of the exported file' }
                    }
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
                        filePath: { type: 'string' }
                    }
                },
                message: { type: 'string' }
            },
            required: ['success', 'data', 'message']
        }
    },
    {
        name: 'drillDownField',
        annotations: {
            readOnlyHint: false
        },
        description: 'Expand a specific hierarchical field to see more detailed data.',
        inputSchema: {
            type: 'object',
            properties: {
                fieldName: { type: 'string', description: 'The name of the field to drill down' },
                axis: { type: 'string', description: 'The axis containing the field (rows or columns)' },
                drillMembers: {
                    type: 'array',
                    description: 'Optional list of specific members to expand for this field using drilledMembers.',
                    items: { type: 'string' }
                },
                delimiter: {
                    type: 'string',
                    description: 'Optional delimiter for hierarchical member items used in drillMembers. Default: **'
                }
            },
            required: ['fieldName', 'axis']
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: { type: 'object' },
                message: { type: 'string' }
            },
            required: ['success', 'data', 'message']
        }
    },
    {
        name: 'drillUpField',
        annotations: {
            readOnlyHint: false
        },
        description: 'Collapse a specific hierarchical field to see less detailed data.',
        inputSchema: {
            type: 'object',
            properties: {
                fieldName: { type: 'string', description: 'The name of the field to drill up' },
                axis: { type: 'string', description: 'The axis containing the field (rows or columns)' },
                drillMembers: {
                    type: 'array',
                    description: 'Optional list of specific members to collapse for this field using drilledMembers.',
                    items: { type: 'string' }
                },
                delimiter: {
                    type: 'string',
                    description: 'Optional delimiter for hierarchical member items used in drillMembers. Default: **'
                }
            },
            required: ['fieldName', 'axis']
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: { type: 'object' },
                message: { type: 'string' }
            },
            required: ['success', 'data', 'message']
        }
    },
    {
        name: 'expandAllHeaders',
        annotations: {
            readOnlyHint: false
        },
        description: 'Expand all hierarchical fields at once to see detailed data across all dimensions.',
        inputSchema: {
            type: 'object',
            properties: {}
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: { type: 'object' },
                message: { type: 'string' }
            },
            required: ['success', 'data', 'message']
        }
    },
    {
        name: 'collapseAllHeaders',
        annotations: {
            readOnlyHint: false
        },
        description: 'Collapse all hierarchical fields at once to see summarized data only.',
        inputSchema: {
            type: 'object',
            properties: {}
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: { type: 'object' },
                message: { type: 'string' }
            },
            required: ['success', 'data', 'message']
        }
    },
    {
        name: 'setChartType',
        annotations: {
            readOnlyHint: false
        },
        description: 'Change the visualization type of the pivot chart',
        inputSchema: {
            type: 'object',
            properties: {
                chartType: { type: 'string', description: 'The type of chart to display (e.g., column, line, pie)' }
            },
            required: ['chartType']
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: { type: 'object' },
                message: { type: 'string' }
            },
            required: ['success', 'data', 'message']
        }
    },
    {
        name: 'toggleViewMode',
        annotations: {
            readOnlyHint: false
        },
        description: 'Switch between table view and chart view to better analyze the data',
        inputSchema: {
            type: 'object',
            properties: {
                viewMode: { type: 'string', description: 'The view mode to switch to (table or chart or Both)' }
            },
            required: ['viewMode']
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: { type: 'object' },
                message: { type: 'string' }
            },
            required: ['success', 'data', 'message']
        }
    },
    {
        name: 'applyNumberFormat',
        annotations: {
            readOnlyHint: false
        },
        description: 'Format numbers in a specific way (e.g., display currency with $ symbol and 2 decimal places). Requires allowNumberFormatting property to be set to true and NumberFormatting module to be injected.',
        inputSchema: {
            type: 'object',
            properties: {
                formatSettings: {
                    type: 'array',
                    description: 'Array of format settings with properties: name, format, useGrouping, currency, etc.',
                    items: {
                        type: 'object',
                        properties: {
                            name: { type: 'string', description: 'The field name to apply formatting to' },
                            format: { type: 'string', description: 'The format string (e.g., C2 for currency with 2 decimals, P for percentage)' },
                            useGrouping: { type: 'boolean', description: 'Whether to use grouping separators' },
                            currency: { type: 'string', description: 'Currency code for currency formatting' }
                        },
                        required: ['name']
                    }
                }
            },
            required: ['formatSettings']
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: { type: 'object' },
                message: { type: 'string' }
            },
            required: ['success', 'data', 'message']
        }
    }
];

export class WebMcpPivotView {
    private parent: PivotView;
    private webMcpAbortController: AbortController | null = null;

    constructor(parent: PivotView) {
        this.parent = parent;
        this.parent.webMcpAdapterModule = this;
        this.addEventListener();
    }

    private addEventListener(): void {
        this.parent.on(getWebMcpTools, this.getTools, this);
        this.parent.on(registerWebMcpTools, this.registerTools, this);
        this.parent.on(executeWebMcpTool, this.executeTool, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(getWebMcpTools, this.getTools);
            this.parent.off(registerWebMcpTools, this.registerTools);
            this.parent.off(executeWebMcpTool, this.executeTool);
        }
    }

    private getTools(args: { toolNames?: string[]; tools?: WebMcpTool[] }): WebMcpTool[] {
        const toolNames: string[] = <string[]>args.toolNames;
        if (toolNames && toolNames.length !== 0) {
            args.tools = webMcpTools.filter((webMcpTool: WebMcpTool) => toolNames.indexOf(webMcpTool.name) !== -1)
                .map((webMcpTool: WebMcpTool) => ({ ...webMcpTool }));
        } else {
            args.tools = webMcpTools.map((webMcpTool: WebMcpTool) => ({ ...webMcpTool }));
        }
        return args.tools;
    }

    private registerTools(args: { prefix?: string, tools?: string[] | WebMcpTool[], exposedTo?: string[] }): void {
        const modelContext: { registerTool: Function } =
            <{ registerTool: Function }>(document as { modelContext?: { registerTool: Function } }).modelContext;
        if (!modelContext || typeof modelContext.registerTool !== 'function') {
            console.warn('WebMCP: document.modelContext not available. Tools will not be registered. ' +
                         'This is expected in standard browser environments without WebMCP framework.');
            return;
        }
        this.webMcpAbortController = new AbortController();
        const toolPrefix: string = (isNullOrUndefined(args.prefix) ? this.parent.element.id : args.prefix) as string;
        const tools: WebMcpTool[] = args.tools && args.tools.length && typeof args.tools[0] === 'object' ? <WebMcpTool[]>args.tools :
            this.getTools({ toolNames: <string[]>args.tools });
        tools.forEach((tool: WebMcpTool): void => {
            tool.name = `${toolPrefix}_${tool.name}`;
            tool.execute = async (args: object) => {
                const eventArgs: { toolName: string, toolArgs: object, response?: Promise<object> } = { toolName: tool.name,
                    toolArgs: args || {} };
                this.parent.notify(executeWebMcpTool, eventArgs);
                return eventArgs.response || Promise.reject('WebMcpTools module is not loaded.');
            };
            const registerOptions: { signal: AbortSignal; exposedTo?: string[] } = {
                signal: (<AbortController>this.webMcpAbortController).signal
            };
            if (Array.isArray(args.exposedTo) && args.exposedTo.length > 0) {
                registerOptions.exposedTo = args.exposedTo;
            }
            modelContext.registerTool(tool, registerOptions);
        });
    }

    private async executeTool(eventArgs: { toolName: string, toolArgs: object, response?: Promise<object> }): Promise<void> {
        try {
            eventArgs.response = this.executeHandler(eventArgs.toolName, eventArgs.toolArgs || {});
        } catch (error) {
            eventArgs.response = Promise.reject(error);
        }
    }

    private async executeHandler(command: string, args: object): Promise<WebMcpToolResponse> {
        const baseCommand: string = command.includes('_') ? command.substring(command.indexOf('_') + 1) : command;
        const eventArgs: WebMcpToolExecuteEventArgs = { toolName: command, toolArgs: args };
        this.parent.trigger('beforeWebMcpToolExecute', eventArgs);


        if (eventArgs.cancel) {
            return this.message({
                action: command,
                cancelled: true,
                message: eventArgs.cancellationResponse ||
                    `[USER_CANCELLED] Tool "${command}" was cancelled. This is final. Do NOT retry.`
            });
        }
        switch (baseCommand) {
        case 'addFieldToAxis': return this.handleAddFieldToAxis(args as WebMcpFieldAxisArgs);
        case 'removeFieldFromAxis': return this.handleRemoveFieldFromAxis(args as WebMcpFieldAxisArgs);
        case 'moveFieldBetweenAxes': return this.handleMoveFieldBetweenAxes(args as WebMcpMoveFieldBetweenAxesArgs);
        case 'manageCalculatedField': return this.handleManageCalculatedField(args as WebMcpManageCalculatedFieldArgs);
        case 'clearSorting': return this.handleClearSorting();
        case 'clearConditionalFormatting': return this.handleClearConditionalFormatting();
        case 'clearNumberFormatting': return this.handleClearNumberFormatting();
        case 'setDataSource': return this.handleSetDataSource(args as WebMcpSetDataSourceArgs);
        case 'applyFiltering': return this.handleApplyFiltering(args as WebMcpApplyFilteringArgs);
        case 'applySorting': return this.handleApplySorting(args as WebMcpApplySortingArgs);
        case 'applyValueSorting': return this.handleApplyValueSorting(args as WebMcpApplyValueSortingArgs);
        case 'clearAllFilters': return this.handleClearAllFilters();
        case 'applyConditionalFormatting': return this.handleApplyConditionalFormatting(args as WebMcpApplyConditionalFormattingArgs);
        case 'exportToExcel': return this.handleExportToExcel(args as WebMcpExportToFileArgs);
        case 'exportToPDF': return this.handleExportToPDF(args as WebMcpExportToFileArgs);
        case 'exportToCSV': return this.handleExportToCSV(args as WebMcpExportToFileArgs);
        case 'drillDownField': return this.handleDrillDownField(args as WebMcpFieldAxisArgs);
        case 'drillUpField': return this.handleDrillUpField(args as WebMcpFieldAxisArgs);
        case 'expandAllHeaders': return this.handleExpandAllHeaders();
        case 'collapseAllHeaders': return this.handleCollapseAllHeaders();
        case 'setChartType': return this.handleSetChartType(args as WebMcpSetChartTypeArgs);
        case 'toggleViewMode': return this.handleToggleViewMode(args as WebMcpToggleViewModeArgs);
        case 'applyNumberFormat': return this.handleApplyNumberFormat(args as WebMcpApplyNumberFormatArgs);
        default: {
            if (eventArgs.showConfirmationDialog) {
                const summary: string = this.buildConfirmationMessage(baseCommand, args);
                const approved: boolean = await this.requestConfirmation(baseCommand, args, summary);
                if (!approved) {
                    return this.message({
                        action: baseCommand,
                        cancelled: true,
                        message: eventArgs.cancellationResponse ||
                            `[USER_CANCELLED] User denied: "${summary}". This is final. Do NOT retry.`
                    });
                }
            }
            return this.error(`Tool "${baseCommand}" not yet implemented.`);
        }
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

    public getModuleName(): string {
        return 'WebMcpPivotView';
    }

    private message(data: unknown): WebMcpToolResponse {
        return { content: [{ type: 'text', text: JSON.stringify(data) }] };
    }

    private error(text: string): WebMcpToolResponse {
        return { content: [{ type: 'text', text }], isError: true };
    }

    private getOrCreateAxisArray(dataSourceSettings: DataSourceSettingsModel, axisProperty: string): IFieldOptions[] {
        if (axisProperty === 'rows') {
            if (dataSourceSettings.rows) {
                return dataSourceSettings.rows;
            }
            dataSourceSettings.rows = [];
            return dataSourceSettings.rows;
        }
        if (axisProperty === 'columns') {
            if (dataSourceSettings.columns) {
                return dataSourceSettings.columns;
            }
            dataSourceSettings.columns = [];
            return dataSourceSettings.columns;
        }
        if (axisProperty === 'values') {
            if (dataSourceSettings.values) {
                return dataSourceSettings.values;
            }
            dataSourceSettings.values = [];
            return dataSourceSettings.values;
        }
        if (axisProperty === 'filters') {
            if (dataSourceSettings.filters) {
                return dataSourceSettings.filters;
            }
            dataSourceSettings.filters = [];
            return dataSourceSettings.filters;
        }
        return [];
    }

    private findFieldIndex(axisArray: IFieldOptions[], fieldName: string): number {
        for (let i: number = 0; i < axisArray.length; i++) {
            if (axisArray[i as number].name === fieldName) {
                return i;
            }
        }
        return -1;
    }

    private upsertModelByName<T extends { name?: string }>(models: T[], item: T): void {
        const existingIndex: number = this.findModelIndexByName(models, item.name);
        if (existingIndex !== -1) {
            models[existingIndex as number] = { ...models[existingIndex as number], ...item } as T;
        } else {
            models.push(item);
        }
    }

    private findModelIndexByName<T extends { name?: string }>(models: T[], name: string): number {
        for (let i: number = 0; i < models.length; i++) {
            if (models[i as number].name === name) {
                return i;
            }
        }
        return -1;
    }

    private buildConfirmationMessage(command: string, args: object): string {
        switch (command) {
        case 'addFieldToAxis':
            return `Add field "${(args as WebMcpFieldAxisArgs).fieldName}" to ${(args as WebMcpFieldAxisArgs).axis} axis`;
        case 'removeFieldFromAxis':
            return `Remove field "${(args as WebMcpFieldAxisArgs).fieldName}" from ${(args as WebMcpFieldAxisArgs).axis} axis`;
        case 'moveFieldBetweenAxes':
            return `Move field "${(args as WebMcpMoveFieldBetweenAxesArgs).fieldName}" from ${(args as WebMcpMoveFieldBetweenAxesArgs).fromAxis} to ${(args as WebMcpMoveFieldBetweenAxesArgs).toAxis} axis`;
        case 'setDataSource':
            if ((args as WebMcpSetDataSourceArgs).dataSource) {
                if (Array.isArray((args as WebMcpSetDataSourceArgs).dataSource) &&
                                  (args as WebMcpSetDataSourceArgs).dataSource.length > 0 &&
                                   Array.isArray((args as WebMcpSetDataSourceArgs).dataSource[0])) {
                    return `Load CSV data with ${(args as WebMcpSetDataSourceArgs).dataSource.length} rows`;
                } else {
                    return `Load JSON data with ${
                        Array.isArray((args as WebMcpSetDataSourceArgs).dataSource)
                            ? (args as WebMcpSetDataSourceArgs).dataSource.length
                            : 'unknown'
                    } records`;
                }
            } else if ((args as WebMcpSetDataSourceArgs).url) {
                return `Load data from URL: ${(args as WebMcpSetDataSourceArgs).url}`;
            }
            return 'Load new data source';
        case 'applyFiltering':
            return 'Apply filtering to data';
        case 'applySorting':
            return 'Apply sorting to fields';
        case 'applyValueSorting':
            if ((args as WebMcpApplyValueSortingArgs).valueSortSettings) {
                return `Apply value sorting with headerText: ${(args as WebMcpApplyValueSortingArgs).valueSortSettings.headerText}`;
            }
            return 'Apply value sorting';
        case 'clearAllFilters':
            return 'Clear all applied filters';
        case 'applyConditionalFormatting':
            return 'Apply conditional formatting';
        case 'manageCalculatedField':
            return `${(args as WebMcpManageCalculatedFieldArgs).action} calculated field "${(args as WebMcpManageCalculatedFieldArgs).fieldName}"`;
        case 'clearSorting':
            return 'Clear all applied sorting';
        case 'clearConditionalFormatting':
            return 'Clear all conditional formatting';
        case 'clearNumberFormatting':
            return 'Clear all number formatting';
        case 'exportToExcel': {
            const excelFileName: string =
                (((args as WebMcpExportToFileArgs).exportProperties && (args as WebMcpExportToFileArgs).exportProperties.fileName) ||
                    (args as WebMcpExportToFileArgs).fileName ||
                    'pivot-export.xlsx');
            return `Export to Excel file (${excelFileName})`;
        }
        case 'exportToPDF': {
            const pdfFileName: string =
                (((args as WebMcpExportToFileArgs).exportProperties && (args as WebMcpExportToFileArgs).exportProperties.fileName) ||
                    (args as WebMcpExportToFileArgs).fileName ||
                    'pivot-export.pdf');
            return `Export to PDF file (${pdfFileName})`;
        }
        case 'exportToCSV': {
            const csvFileName: string =
                (((args as WebMcpExportToFileArgs).exportProperties && (args as WebMcpExportToFileArgs).exportProperties.fileName) ||
                    (args as WebMcpExportToFileArgs).fileName ||
                    'pivot-export.csv');
            return `Export to CSV file (${csvFileName})`;
        }
        case 'drillDownField':
            return `Drill down field "${(args as WebMcpFieldAxisArgs).fieldName}"`;
        case 'drillUpField':
            return `Drill up field "${(args as WebMcpFieldAxisArgs).fieldName}"`;
        case 'expandAllHeaders':
            return 'Expand all headers';
        case 'collapseAllHeaders':
            return 'Collapse all headers';
        case 'setChartType':
            return `Set chart type to ${(args as WebMcpSetChartTypeArgs).chartType}`;
        case 'toggleViewMode':
            return `Switch view mode to ${(args as WebMcpToggleViewModeArgs).viewMode}`;
        case 'applyNumberFormat':
            return 'Apply number formatting';
        default:
            return `Confirm: ${command}`;
        }
    }

    private async requestConfirmation(command: string, args: object, message: string): Promise<boolean> {
        console.warn(`WebMCP Tool Confirmation: ${message}`);
        return true;
    }

    private handleAddFieldToAxis(args: WebMcpFieldAxisArgs): WebMcpToolResponse {
        try {
            if (!args.fieldName || !args.axis) {
                return this.error('Missing required parameters: fieldName and axis are required');
            }
            const axisMap: { [key: string]: string } = {
                'rows': 'rows',
                'columns': 'columns',
                'values': 'values',
                'filters': 'filters'
            };
            const axisProperty: string = axisMap[args.axis.toLowerCase()];
            if (!axisProperty) {
                return this.error(`Invalid axis: ${args.axis}. Valid axes are: rows, columns, values, filters`);
            }
            const dataSourceSettings: DataSourceSettingsModel = this.parent.dataSourceSettings || {};
            const axisArray: IFieldOptions[] = this.getOrCreateAxisArray(dataSourceSettings, axisProperty);
            if (this.findFieldIndex(axisArray, args.fieldName) !== -1) {
                return this.message({
                    success: true,
                    data: {},
                    message: `Field "${args.fieldName}" already exists in ${args.axis} axis`
                });
            }
            axisArray.push({ name: args.fieldName });
            this.parent.setProperties({ dataSourceSettings: dataSourceSettings }, false);
            return this.message({
                success: true,
                data: {},
                message: `Field "${args.fieldName}" successfully added to ${args.axis} axis`
            });
        } catch (error) {
            return this.error(`Failed to add field to axis: ${error.message}`);
        }
    }

    private handleMoveFieldBetweenAxes(args: WebMcpMoveFieldBetweenAxesArgs): WebMcpToolResponse {
        try {
            if (!args.fieldName || !args.fromAxis || !args.toAxis) {
                return this.error('Missing required parameters: fieldName, fromAxis, and toAxis are required');
            }
            const axisMap: { [key: string]: string } = {
                'rows': 'rows',
                'columns': 'columns',
                'values': 'values',
                'filters': 'filters'
            };
            const fromAxisProperty: string = axisMap[args.fromAxis.toLowerCase()];
            const toAxisProperty: string = axisMap[args.toAxis.toLowerCase()];
            if (!fromAxisProperty) {
                return this.error(`Invalid fromAxis: ${args.fromAxis}. Valid axes are: rows, columns, values, filters`);
            }
            if (!toAxisProperty) {
                return this.error(`Invalid toAxis: ${args.toAxis}. Valid axes are: rows, columns, values, filters`);
            }
            const dataSourceSettings: DataSourceSettingsModel = this.parent.dataSourceSettings || {};
            const fromAxisArray: IFieldOptions[] = this.getOrCreateAxisArray(dataSourceSettings, fromAxisProperty);
            const toAxisArray: IFieldOptions[] = this.getOrCreateAxisArray(dataSourceSettings, toAxisProperty);

            const fieldIndex: number = this.findFieldIndex(fromAxisArray, args.fieldName);
            if (fieldIndex === -1) {
                return this.error(`Field "${args.fieldName}" not found in ${args.fromAxis} axis`);
            }
            const [field] = fromAxisArray.splice(fieldIndex, 1);
            if (this.findFieldIndex(toAxisArray, args.fieldName) === -1) {
                toAxisArray.push(field);
                this.parent.setProperties({ dataSourceSettings: dataSourceSettings }, false);
                return this.message({
                    success: true,
                    data: {},
                    message: `Field "${args.fieldName}" successfully moved from ${args.fromAxis} to ${args.toAxis} axis`
                });
            } else {
                return this.message({
                    success: true,
                    data: {},
                    message: `Field "${args.fieldName}" already exists in ${args.toAxis} axis`
                });
            }
        } catch (error) {
            return this.error(`Failed to move field between axes: ${error.message}`);
        }
    }

    private handleRemoveFieldFromAxis(args: WebMcpFieldAxisArgs): WebMcpToolResponse {
        try {
            if (!args.fieldName || !args.axis) {
                return this.error('Missing required parameters: fieldName and axis are required');
            }
            const axisMap: { [key: string]: string } = {
                'rows': 'rows',
                'columns': 'columns',
                'values': 'values',
                'filters': 'filters'
            };
            const axisProperty: string = axisMap[args.axis.toLowerCase()];
            if (!axisProperty) {
                return this.error(`Invalid axis: ${args.axis}. Valid axes are: rows, columns, values, filters`);
            }
            const dataSourceSettings: DataSourceSettingsModel = this.parent.dataSourceSettings || {};
            const axisArray: IFieldOptions[] = this.getOrCreateAxisArray(dataSourceSettings, axisProperty);

            const fieldIndex: number = this.findFieldIndex(axisArray, args.fieldName);
            if (fieldIndex === -1) {
                return this.error(`Field "${args.fieldName}" not found in ${args.axis} axis`);
            }
            axisArray.splice(fieldIndex, 1);
            this.parent.setProperties({ dataSourceSettings: dataSourceSettings }, false);
            return this.message({
                success: true,
                data: {},
                message: `Field "${args.fieldName}" successfully removed from ${args.axis} axis`
            });
        } catch (error) {
            return this.error(`Failed to remove field from axis: ${error.message}`);
        }
    }

    private handleManageCalculatedField(args: WebMcpManageCalculatedFieldArgs): WebMcpToolResponse {
        try {
            if (!this.parent.calculatedFieldModule) {
                return this.error('Calculated field module is not enabled. Set allowCalculatedField to true.');
            }
            const action: string = args.action;
            let fieldName: string | undefined = args.fieldName;
            const formula: string | undefined = args.formula;
            const dataSourceSettings: DataSourceSettingsModel = this.parent.dataSourceSettings || {};
            if (!fieldName) {
                const fieldCount: number =
                    dataSourceSettings.calculatedFieldSettings ? dataSourceSettings.calculatedFieldSettings.length : 0;
                fieldName = `CalculatedField${fieldCount + 1}`;
            }
            if (!dataSourceSettings.calculatedFieldSettings) {
                dataSourceSettings.calculatedFieldSettings = [];
            }
            const calculatedFieldSettings: CalculatedFieldSettingsModel[] = dataSourceSettings.calculatedFieldSettings;
            const existingFieldIndex: number = calculatedFieldSettings.findIndex(
                (field: CalculatedFieldSettingsModel) => field.name === fieldName
            );
            let response: WebMcpToolResponse;
            switch (action) {
            case 'create': {
                if (!formula) {
                    return this.error('Formula is required for creating a calculated field');
                }
                if (existingFieldIndex !== -1) {
                    return this.error(`Calculated field "${fieldName}" already exists`);
                }
                calculatedFieldSettings.push({
                    name: fieldName,
                    formula: formula
                });
                response = this.message({
                    success: true,
                    data: {},
                    message: `Successfully created calculated field "${fieldName}" with formula "${formula}"`
                });
                break;
            }
            case 'update': {
                if (!formula) {
                    return this.error('Formula is required for updating a calculated field');
                }
                if (existingFieldIndex === -1) {
                    return this.error(`Calculated field "${fieldName}" does not exist`);
                }
                calculatedFieldSettings[existingFieldIndex as number].formula = formula;
                response = this.message({
                    success: true,
                    data: {},
                    message: `Successfully updated calculated field "${fieldName}" with formula "${formula}"`
                });
                break;
            }
            case 'delete': {
                if (existingFieldIndex === -1) {
                    return this.error(`Calculated field "${fieldName}" does not exist`);
                }
                calculatedFieldSettings.splice(existingFieldIndex, 1);
                response = this.message({
                    success: true,
                    data: {},
                    message: `Successfully deleted calculated field "${fieldName}"`
                });
                break;
            }
            default:
                return this.error('Invalid action. Use "create", "update", or "delete"');
            }
            this.parent.setProperties({ dataSourceSettings: dataSourceSettings }, false);
            return response;
        } catch (error) {
            return this.error(`Failed to manage calculated field: ${error.message}`);
        }
    }

    private handleClearSorting(): WebMcpToolResponse {
        try {
            const dataSourceSettings: DataSourceSettingsModel = this.parent.dataSourceSettings || ({} as DataSourceSettingsModel);
            if (!dataSourceSettings.enableSorting) {
                return this.error('Sorting is not enabled. Please set enableSorting property to true.');
            }
            dataSourceSettings.sortSettings = [];
            this.parent.setProperties({ dataSourceSettings: dataSourceSettings }, false);
            return this.message({
                success: true,
                data: {},
                message: 'All sorting successfully cleared'
            });
        } catch (error) {
            return this.error(`Failed to clear sorting: ${error.message}`);
        }
    }

    private handleClearConditionalFormatting(): WebMcpToolResponse {
        try {
            if (!this.parent.allowConditionalFormatting) {
                return this.error('Conditional formatting is not enabled. Please set allowConditionalFormatting property to true.');
            }
            if (!this.parent.conditionalFormattingModule) {
                return this.error('Conditional formatting module is not injected. Please ensure the ConditionalFormatting module is included in the requiredModules.');
            }
            const dataSourceSettings: DataSourceSettingsModel = this.parent.dataSourceSettings || {};
            dataSourceSettings.conditionalFormatSettings = [];
            this.parent.setProperties({ dataSourceSettings: dataSourceSettings }, false);
            return this.message({
                success: true,
                data: {},
                message: 'All conditional formatting successfully cleared'
            });
        } catch (error) {
            return this.error(`Failed to clear conditional formatting: ${error.message}`);
        }
    }

    private handleClearNumberFormatting(): WebMcpToolResponse {
        try {
            if (!this.parent.allowNumberFormatting) {
                return this.error('Number formatting is not enabled. Please set allowNumberFormatting property to true.');
            }
            if (!this.parent.numberFormattingModule) {
                return this.error('Number formatting module is not injected. Please ensure the NumberFormatting module is included in the requiredModules.');
            }
            const dataSourceSettings: DataSourceSettingsModel = this.parent.dataSourceSettings || {};
            dataSourceSettings.formatSettings = [];
            this.parent.setProperties({ dataSourceSettings: dataSourceSettings }, false);
            return this.message({
                success: true,
                data: {},
                message: 'All number formatting successfully cleared'
            });
        } catch (error) {
            return this.error(`Failed to clear number formatting: ${error.message}`);
        }
    }

    private handleSetDataSource(args: WebMcpSetDataSourceArgs): WebMcpToolResponse {
        try {
            if (!args.dataSource && !args.url) {
                return this.error('Either dataSource or url is required');
            }
            const dataSourceSettings: DataSourceSettingsModel = this.parent.dataSourceSettings || {};
            if (args.dataSource) {
                if (Array.isArray(args.dataSource) && args.dataSource.length > 0 && Array.isArray(args.dataSource[0])) {
                    dataSourceSettings.dataSource = args.dataSource;
                    dataSourceSettings.type = 'CSV';
                } else {
                    dataSourceSettings.dataSource = args.dataSource;
                    dataSourceSettings.type = 'JSON';
                }
            }
            if (args.url) {
                dataSourceSettings.url = args.url;
                if (args.type) {
                    dataSourceSettings.type = args.type as DataSourceType;
                } else if (args.url.toLowerCase().endsWith('.csv')) {
                    dataSourceSettings.type = 'CSV';
                } else {
                    dataSourceSettings.type = 'JSON';
                }
            }
            this.parent.setProperties({ dataSourceSettings: dataSourceSettings }, false);
            return this.message({
                success: true,
                data: {},
                message: 'Data source successfully updated'
            });
        } catch (error) {
            return this.error(`Failed to set data source: ${error.message}`);
        }
    }

    private handleApplyFiltering(args: WebMcpApplyFilteringArgs): WebMcpToolResponse {
        try {
            if (!args.filters || !Array.isArray(args.filters)) {
                return this.error('Filters array is required');
            }
            const dataSourceSettings: DataSourceSettingsModel = this.parent.dataSourceSettings || {};
            if (!dataSourceSettings.filterSettings) {
                dataSourceSettings.filterSettings = [];
            }
            args.filters.forEach((newFilter: FilterModel) => {
                const fieldName: string = newFilter.name;
                if (!fieldName) {
                    return;
                }

                this.upsertModelByName<FilterModel>(
                    dataSourceSettings.filterSettings as FilterModel[],
                    newFilter as FilterModel
                );
            });
            this.parent.setProperties({ dataSourceSettings: dataSourceSettings }, false);
            return this.message({
                success: true,
                data: {},
                message: 'Filters successfully applied'
            });
        } catch (error) {
            return this.error(`Failed to apply filtering: ${error.message}`);
        }
    }

    private handleApplySorting(args: WebMcpApplySortingArgs): WebMcpToolResponse {
        try {
            if (!args.sortSettings || !Array.isArray(args.sortSettings)) {
                return this.error('SortSettings array is required');
            }
            if (!this.parent.dataSourceSettings.enableSorting) {
                return this.error('Sorting is not enabled. Please set enableSorting property to true.');
            }
            const dataSourceSettings: DataSourceSettingsModel = this.parent.dataSourceSettings || {};
            if (!dataSourceSettings.sortSettings) {
                dataSourceSettings.sortSettings = [];
            }
            args.sortSettings.forEach((newSort: SortModel) => {
                const fieldName: string = newSort.name;
                if (!fieldName) {
                    return;
                }

                this.upsertModelByName<SortModel>(
                    dataSourceSettings.sortSettings as SortModel[],
                    newSort as SortModel
                );
            });
            this.parent.setProperties({ dataSourceSettings: dataSourceSettings }, false);
            return this.message({
                success: true,
                data: {},
                message: 'Sorting successfully applied'
            });
        } catch (error) {
            return this.error(`Failed to apply sorting: ${error.message}`);
        }
    }

    private handleApplyValueSorting(args: WebMcpApplyValueSortingArgs): WebMcpToolResponse {
        try {
            if (!args.valueSortSettings) {
                return this.error('valueSortSettings is required');
            }
            const { headerText, sortOrder } = args.valueSortSettings;
            if (!headerText || !sortOrder) {
                return this.error('headerText and sortOrder are required in valueSortSettings');
            }
            if (!this.parent.enableValueSorting) {
                return this.error('Value sorting is not enabled. Please set enableValueSorting property to true.');
            }
            const dataSourceSettings: DataSourceSettingsModel = this.parent.dataSourceSettings || {};
            if (!dataSourceSettings.valueSortSettings) {
                dataSourceSettings.valueSortSettings = {};
            }
            dataSourceSettings.valueSortSettings = {
                ...dataSourceSettings.valueSortSettings,
                ...args.valueSortSettings
            } as ValueSortSettingsModel;
            this.parent.setProperties({ dataSourceSettings: dataSourceSettings }, false);
            return this.message({
                success: true,
                data: {},
                message: 'Value sorting successfully applied'
            });
        } catch (error) {
            return this.error(`Failed to apply value sorting: ${error.message}`);
        }
    }

    private handleClearAllFilters(): WebMcpToolResponse {
        try {
            const dataSourceSettings: DataSourceSettingsModel = this.parent.dataSourceSettings || {};
            dataSourceSettings.filterSettings = [];
            this.parent.setProperties({ dataSourceSettings: dataSourceSettings }, false);

            return this.message({
                success: true,
                data: {},
                message: 'All filters successfully cleared'
            });
        } catch (error) {
            return this.error(`Failed to clear all filters: ${error.message}`);
        }
    }

    private handleApplyConditionalFormatting(args: WebMcpApplyConditionalFormattingArgs): WebMcpToolResponse {
        try {
            if (!args.formatRules || !Array.isArray(args.formatRules)) {
                return this.error('FormatRules array is required');
            }
            const dataSourceSettings: DataSourceSettingsModel = this.parent.dataSourceSettings || {};
            if (!dataSourceSettings.conditionalFormatSettings) {
                dataSourceSettings.conditionalFormatSettings = [];
            }
            args.formatRules.forEach((newRule: ConditionalFormatSettingsModel) => {
                dataSourceSettings.conditionalFormatSettings.push(newRule as ConditionalFormatSettings);
            });
            this.parent.setProperties({ dataSourceSettings: dataSourceSettings }, false);
            return this.message({
                success: true,
                data: {},
                message: 'Conditional formatting successfully applied'
            });
        } catch (error) {
            return this.error(`Failed to apply conditional formatting: ${error.message}`);
        }
    }

    private handleExportToExcel(args: WebMcpExportToFileArgs): WebMcpToolResponse {
        try {
            if (!this.parent.allowExcelExport) {
                return this.error('Excel export is not enabled. Please set allowExcelExport property to true.');
            }
            if (!this.parent.excelExportModule) {
                return this.error('Excel export module is not injected. Please ensure the ExcelExport module is included in the requiredModules.');
            }
            const exportProperties: WebMcpExportProperties = args.exportProperties || {};
            if (args.fileName && !exportProperties.fileName) {
                exportProperties.fileName = args.fileName;
            }
            this.parent.excelExport(exportProperties);
            return this.message({
                success: true,
                data: { fileName: exportProperties.fileName || 'pivot-export.xlsx' },
                message: 'Excel export initiated'
            });
        } catch (error) {
            return this.error(`Failed to export to Excel: ${error.message}`);
        }
    }

    private handleExportToPDF(args: WebMcpExportToFileArgs): WebMcpToolResponse {
        try {
            if (!this.parent.allowPdfExport) {
                return this.error('PDF export is not enabled. Please set allowPdfExport property to true.');
            }
            if (!this.parent.pdfExportModule) {
                return this.error('PDF export module is not injected. Please ensure the PDFExport module is included in the requiredModules.');
            }
            const exportProperties: WebMcpExportProperties = args.exportProperties || {};
            if (args.fileName && !exportProperties.fileName) {
                exportProperties.fileName = args.fileName;
            }
            this.parent.pdfExport(exportProperties);
            return this.message({
                success: true,
                data: { fileName: exportProperties.fileName || 'pivot-export.pdf' },
                message: 'PDF export initiated'
            });
        } catch (error) {
            return this.error(`Failed to export to PDF: ${error.message}`);
        }
    }

    private handleExportToCSV(args: WebMcpExportToFileArgs): WebMcpToolResponse {
        try {
            if (!this.parent.allowExcelExport) {
                return this.error('CSV export is not enabled. Please set allowExcelExport property to true.');
            }
            if (!this.parent.excelExportModule) {
                return this.error('Excel export module is not injected. Please ensure the ExcelExport module is included in the requiredModules.');
            }
            const exportProperties: WebMcpExportProperties = args.exportProperties || {};
            if (args.fileName && !exportProperties.fileName) {
                exportProperties.fileName = args.fileName;
            }
            this.parent.csvExport(exportProperties);
            return this.message({
                success: true,
                data: { fileName: exportProperties.fileName || 'pivot-export.csv' },
                message: 'CSV export initiated'
            });
        } catch (error) {
            return this.error(`Failed to export to CSV: ${error.message}`);
        }
    }

    private handleDrillDownField(args: WebMcpFieldAxisArgs): WebMcpToolResponse {
        try {
            if (!args.fieldName || !args.axis) {
                return this.error('fieldName and axis are required');
            }
            const axisMap: { [key: string]: string } = {
                'rows': 'rows',
                'columns': 'columns'
            };
            const axisProperty: string = axisMap[args.axis.toLowerCase()];
            if (!axisProperty) {
                return this.error(`Invalid axis: ${args.axis}. Valid axes are: rows, columns`);
            }
            const dataSourceSettings: DataSourceSettingsModel = this.parent.dataSourceSettings || {};
            let axisArray: IFieldOptions[] = [];
            if (axisProperty === 'rows') {
                if (!dataSourceSettings.rows) {
                    return this.error(`Axis ${args.axis} is not configured`);
                }
                axisArray = dataSourceSettings.rows;
            } else if (axisProperty === 'columns') {
                if (!dataSourceSettings.columns) {
                    return this.error(`Axis ${args.axis} is not configured`);
                }
                axisArray = dataSourceSettings.columns;
            }
            const fieldIndex: number = this.findFieldIndex(axisArray, args.fieldName);
            if (fieldIndex === -1) {
                return this.error(`Field "${args.fieldName}" not found in ${args.axis} axis`);
            }
            const drillMembers: string[] | undefined = (args as unknown as {
                drillMembers?: string[]
            }).drillMembers;
            const delimiter: string | undefined = (args as unknown as {
                delimiter?: string
            }).delimiter;
            if (!drillMembers || drillMembers.length === 0) {
                dataSourceSettings.expandAll = false;
                dataSourceSettings.drilledMembers = [];
                axisArray[fieldIndex as number].expandAll = true;
            } else {
                dataSourceSettings.expandAll = false;
                dataSourceSettings.drilledMembers = [
                    {
                        name: args.fieldName,
                        items: drillMembers,
                        delimiter: delimiter || '**'
                    }
                ];
                axisArray[fieldIndex as number].expandAll = false;
            }
            this.parent.setProperties({ dataSourceSettings: dataSourceSettings }, false);
            return this.message({
                success: true,
                data: {},
                message: `Field "${args.fieldName}" successfully drilled down`
            });
        } catch (error) {
            return this.error(`Failed to drill down field: ${error.message}`);
        }
    }

    private handleDrillUpField(args: WebMcpFieldAxisArgs): WebMcpToolResponse {
        try {
            if (!args.fieldName || !args.axis) {
                return this.error('fieldName and axis are required');
            }
            const axisMap: { [key: string]: string } = {
                'rows': 'rows',
                'columns': 'columns'
            };
            const axisProperty: string = axisMap[args.axis.toLowerCase()];
            if (!axisProperty) {
                return this.error(`Invalid axis: ${args.axis}. Valid axes are: rows, columns`);
            }
            const dataSourceSettings: DataSourceSettingsModel = this.parent.dataSourceSettings || {};
            let axisArray: IFieldOptions[] = [];
            if (axisProperty === 'rows') {
                if (!dataSourceSettings.rows) {
                    return this.error(`Axis ${args.axis} is not configured`);
                }
                axisArray = dataSourceSettings.rows;
            } else if (axisProperty === 'columns') {
                if (!dataSourceSettings.columns) {
                    return this.error(`Axis ${args.axis} is not configured`);
                }
                axisArray = dataSourceSettings.columns;
            }
            const fieldIndex: number = this.findFieldIndex(axisArray, args.fieldName);
            if (fieldIndex === -1) {
                return this.error(`Field "${args.fieldName}" not found in ${args.axis} axis`);
            }
            const drillMembers: string[] | undefined = (args as unknown as {
                drillMembers?: string[]
            }).drillMembers;
            const delimiter: string | undefined = (args as unknown as {
                delimiter?: string
            }).delimiter;
            if (!drillMembers || drillMembers.length === 0) {
                dataSourceSettings.expandAll = false;
                dataSourceSettings.drilledMembers = [];
                axisArray[fieldIndex as number].expandAll = false;
            } else {
                dataSourceSettings.expandAll = true;
                dataSourceSettings.drilledMembers = [
                    {
                        name: args.fieldName,
                        items: drillMembers,
                        delimiter: delimiter || '**'
                    }
                ];
                axisArray[fieldIndex as number].expandAll = true;
            }
            this.parent.setProperties({ dataSourceSettings: dataSourceSettings }, false);
            return this.message({
                success: true,
                data: {},
                message: `Field "${args.fieldName}" successfully drilled up`
            });
        } catch (error) {
            return this.error(`Failed to drill up field: ${error.message}`);
        }
    }

    private handleExpandAllHeaders(): WebMcpToolResponse {
        try {
            const dataSourceSettings: DataSourceSettingsModel = this.parent.dataSourceSettings || {};
            dataSourceSettings.expandAll = true;
            dataSourceSettings.drilledMembers = [];
            this.parent.setProperties({ dataSourceSettings: dataSourceSettings }, false);
            return this.message({
                success: true,
                data: {},
                message: 'All headers successfully expanded'
            });
        } catch (error) {
            return this.error(`Failed to expand all headers: ${error.message}`);
        }
    }

    private handleCollapseAllHeaders(): WebMcpToolResponse {
        try {
            const dataSourceSettings: DataSourceSettingsModel = this.parent.dataSourceSettings || {};
            dataSourceSettings.expandAll = false;
            dataSourceSettings.drilledMembers = [];
            this.parent.setProperties({ dataSourceSettings: dataSourceSettings }, false);
            return this.message({
                success: true,
                data: {},
                message: 'All headers successfully collapsed'
            });
        } catch (error) {
            return this.error(`Failed to collapse all headers: ${error.message}`);
        }
    }

    private handleSetChartType(args: WebMcpSetChartTypeArgs): WebMcpToolResponse {
        try {
            if (!args.chartType) {
                return this.error('chartType is required');
            }
            const chartSettings: WebMcpChartSettings = this.parent.chartSettings || {};
            if (!chartSettings.chartSeries) {
                chartSettings.chartSeries = {};
            }
            chartSettings.chartSeries.type = args.chartType as ChartSeriesType;
            this.parent.setProperties({ chartSettings: chartSettings }, false);
            return this.message({
                success: true,
                data: {},
                message: `Chart type successfully set to ${args.chartType}`
            });
        } catch (error) {
            return this.error(`Failed to set chart type: ${error.message}`);
        }
    }

    private handleToggleViewMode(args: WebMcpToggleViewModeArgs): WebMcpToolResponse {
        try {
            if (!args.viewMode) {
                return this.error('viewMode is required');
            }
            const validViewModes: string[] = ['Table', 'Chart', 'Both'];
            if (validViewModes.indexOf(args.viewMode) === -1) {
                return this.error(`Invalid viewMode: ${args.viewMode}. Valid values are: Table, Chart`);
            }
            const displayOption: DisplayOptionModel = this.parent.displayOption || {};
            displayOption.view = args.viewMode as View;
            this.parent.setProperties({ displayOption: displayOption }, false);
            return this.message({
                success: true,
                data: {},
                message: `View mode successfully switched to ${args.viewMode}`
            });
        } catch (error) {
            return this.error(`Failed to toggle view mode: ${error.message}`);
        }
    }

    private handleApplyNumberFormat(args: WebMcpApplyNumberFormatArgs): WebMcpToolResponse {
        try {
            if (!args.formatSettings || !Array.isArray(args.formatSettings)) {
                return this.error('formatSettings array is required');
            }
            const dataSourceSettings: DataSourceSettingsModel = this.parent.dataSourceSettings || {};
            if (!dataSourceSettings.formatSettings) {
                dataSourceSettings.formatSettings = [];
            }
            args.formatSettings.forEach((newFormat: FormatSettingsModel) => {
                const fieldName: string = newFormat.name;
                if (!fieldName) {
                    return;
                }
                this.upsertModelByName<FormatSettingsModel>(
                    dataSourceSettings.formatSettings as FormatSettingsModel[],
                    newFormat as FormatSettingsModel
                );
            });
            this.parent.setProperties({ dataSourceSettings: dataSourceSettings }, false);
            return this.message({
                success: true,
                data: {},
                message: 'Number formatting successfully applied'
            });
        } catch (error) {
            return this.error(`Failed to apply number formatting: ${error.message}`);
        }
    }
}

import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Gantt } from '../base/gantt';
import { WebMcpToolExecuteEventArgs, WebMcpTool, WebMcpToolResponse, IGanttData, PdfExportProperties, IGanttTaskInfo } from '../base/interface';
import { ExcelExportProperties } from '@syncfusion/ej2-grids';
import { RowPosition, SortDirection } from '../base/enum';
import { ColumnModel } from '../models/column';

type ToolArgs = Record<string, unknown>;

const EVENT_GET_TOOLS: string = 'getWebMcpTools';
const EVENT_REGISTER_TOOLS: string = 'registerWebMcpTools';
const EVENT_BEFORE_EXECUTE: string = 'beforeWebMcpToolExecute';

// 🟠 Component-specific WebMCP tool definitions
// These tool schemas match the generated tool spec in webmcptoolconfirmation.md.
const webMcpTools: WebMcpTool[] = [
    {
        name: 'getProjectTasks',
        description: 'Returns the current project task set from the Gantt after the latest view state is applied.',
        annotations: { readOnlyHint: true },
        inputSchema: { type: 'object', properties: {}, required: [] },
        outputSchema: {
            type: 'object',
            properties: {
                tasks: { type: 'array', items: { type: 'object' } }
            },
            required: ['tasks']
        }
    },
    {
        name: 'getTaskDetails',
        description: 'Retrieves scheduling/geometry details and derived flags for a specific task.',
        annotations: { readOnlyHint: true },
        inputSchema: {
            type: 'object',
            properties: {
                taskId: { type: 'string' }
            },
            required: ['taskId']
        },
        outputSchema: {
            type: 'object',
            properties: {
                taskInfo: { type: 'object' }
            },
            required: ['taskInfo']
        }
    },
    {
        name: 'manageHierarchy',
        description: 'Controls hierarchy expansion/collapse state to prepare deterministic task extraction and reporting.',
        annotations: { readOnlyHint: false },
        inputSchema: {
            type: 'object',
            properties: {
                action: { type: 'string', enum: ['expandAll', 'collapseAll', 'expandByID', 'expandByIndex'] },
                id: { type: ['number', 'string'] },
                index: {
                    anyOf: [
                        { type: 'number' },
                        { type: 'array', items: { type: 'number' } }
                    ]
                }
            },
            required: ['action']
        },
        outputSchema: { type: 'object', properties: {}, required: [] }
    },
    {
        name: 'getCriticalTasks',
        description: 'Returns tasks flagged as critical when critical path is enabled.',
        annotations: { readOnlyHint: true },
        inputSchema: { type: 'object', properties: {}, required: [] },
        outputSchema: {
            type: 'object',
            properties: {
                criticalTasks: { type: 'array', items: { type: 'object' } }
            },
            required: ['criticalTasks']
        }
    },
    {
        name: 'createTask',
        description: 'Creates one or more new tasks (optionally positioned within the hierarchy).',
        annotations: { readOnlyHint: false },
        inputSchema: {
            type: 'object',
            properties: {
                data: { type: 'object' },
                rowPosition: { type: 'string' },
                rowIndex: { type: 'number' }
            },
            required: ['data']
        },
        outputSchema: { type: 'object', properties: {}, required: [] }
    },
    {
        name: 'updateTask',
        description: 'Applies updates to a specific task record based on a record payload.',
        annotations: { readOnlyHint: false },
        inputSchema: {
            type: 'object',
            properties: {
                data: { type: 'object' }
            },
            required: ['data']
        },
        outputSchema: { type: 'object', properties: {}, required: [] }
    },
    {
        name: 'deleteTask',
        description: 'Deletes one or more tasks by id/index/record selection.',
        annotations: { readOnlyHint: false },
        inputSchema: {
            type: 'object',
            properties: {
                taskDetail: {
                    anyOf: [
                        { type: 'number' },
                        { type: 'string' },
                        { type: 'array', items: { type: 'number' } },
                        { type: 'array', items: { type: 'string' } },
                        { type: 'object' }, // IGanttData
                        { type: 'array', items: { type: 'object' } } // IGanttData[]
                    ]
                }
            },
            required: ['taskDetail']
        },
        outputSchema: { type: 'object', properties: {}, required: [] }
    },
    {
        name: 'splitTask',
        description: 'Splits a task into multiple segments at one or more split dates.',
        annotations: { readOnlyHint: false },
        inputSchema: {
            type: 'object',
            properties: {
                taskId: { type: ['number', 'string'] },
                splitDate: {}
            },
            required: ['taskId', 'splitDate']
        },
        outputSchema: { type: 'object', properties: {}, required: [] }
    },
    {
        name: 'manageTaskDependencies',
        description: 'Adds, updates, or removes predecessor dependencies for a task.',
        annotations: { readOnlyHint: false },
        inputSchema: {
            type: 'object',
            properties: {
                taskId: { type: ['number', 'string'] },
                operation: { type: 'string', enum: ['add', 'update', 'remove'] },
                predecessorString: { type: 'string' }
            },
            required: ['taskId', 'operation']
        },
        outputSchema: { type: 'object', properties: {}, required: [] }
    },
    {
        name: 'updateProjectDates',
        description: 'Updates project start/end dates and applies timeline rounding rules.',
        annotations: { readOnlyHint: false },
        inputSchema: {
            type: 'object',
            properties: {
                startDate: { type: 'string' },
                endDate: { type: 'string' },
                isTimelineRoundOff: { type: 'boolean' },
                isFrom: { type: 'string' }
            },
            required: ['startDate', 'endDate', 'isTimelineRoundOff']
        },
        outputSchema: { type: 'object', properties: {}, required: [] }
    },
    {
        name: 'getVisibleTasksHierarchy',
        description: 'Computes the visible/expanded task set for a hierarchy without requiring UI navigation.',
        annotations: { readOnlyHint: true },
        inputSchema: {
            type: 'object',
            properties: {
                records: { type: 'array', items: { type: 'object' } }
            },
            required: []
        },
        outputSchema: {
            type: 'object',
            properties: {
                visibleRecords: { type: 'array', items: { type: 'object' } }
            },
            required: ['visibleRecords']
        }
    },
    {
        name: 'undo',
        description: 'Rolls back the most recent change made through the component.',
        annotations: { readOnlyHint: false },
        inputSchema: { type: 'object', properties: {}, required: [] },
        outputSchema: { type: 'object', properties: {}, required: [] }
    },
    {
        name: 'redo',
        description: 'Reapplies the most recently undone change.',
        annotations: { readOnlyHint: false },
        inputSchema: { type: 'object', properties: {}, required: [] },
        outputSchema: { type: 'object', properties: {}, required: [] }
    },
    {
        name: 'excelExport',
        description: 'Exports the current Gantt content to an Excel-compatible output.',
        annotations: { readOnlyHint: true },
        inputSchema: {
            type: 'object',
            properties: {
                exportProperties: { type: 'object' },
                isMultipleExport: { type: 'boolean' },
                workbook: { type: 'object' },
                isBlob: { type: 'boolean' }
            },
            required: ['exportProperties']
        },
        outputSchema: {
            type: 'object',
            properties: {
                exportResult: {}
            },
            required: ['exportResult']
        }
    },
    {
        name: 'pdfExport',
        description: 'Exports the current Gantt content to a PDF output.',
        annotations: { readOnlyHint: true },
        inputSchema: {
            type: 'object',
            properties: {
                exportProperties: { type: 'object' },
                isMultipleExport: { type: 'boolean' },
                pdfDoc: { type: 'object' },
                isBlob: { type: 'boolean' }
            },
            required: []
        },
        outputSchema: {
            type: 'object',
            properties: {
                exportResult: {}
            },
            required: ['exportResult']
        }
    },
    {
        name: 'csvExport',
        description: 'Exports the current Gantt data to a CSV-compatible output.',
        annotations: { readOnlyHint: true },
        inputSchema: {
            type: 'object',
            properties: {
                exportProperties: { type: 'object' },
                isMultipleExport: { type: 'boolean' },
                workbook: { type: 'object' },
                isBlob: { type: 'boolean' }
            },
            required: ['exportProperties']
        },
        outputSchema: {
            type: 'object',
            properties: {
                exportResult: {}
            },
            required: ['exportResult']
        }
    },
    {
        name: 'searchTasks',
        description: 'Searches for tasks based on a keyword across all task fields.',
        annotations: { readOnlyHint: true },
        inputSchema: {
            type: 'object',
            properties: {
                keyword: { type: 'string' }
            },
            required: ['keyword']
        },
        outputSchema: {
            type: 'object',
            properties: {
                searchResults: { type: 'array', items: { type: 'object' } }
            },
            required: ['searchResults']
        }
    },
    {
        name: 'filterTasks',
        description: 'Filters tasks based on specified field criteria.',
        annotations: { readOnlyHint: true },
        inputSchema: {
            type: 'object',
            properties: {
                fieldName: { type: 'string' },
                filterOperator: { type: 'string' },
                filterValue: {
                    anyOf: [
                        { type: 'string' }, // includes serialized Date
                        { type: 'number' },
                        { type: 'boolean' },
                        { type: 'object' }, // includes Date objects
                        { type: 'array', items: { type: 'number' } },
                        { type: 'array', items: { type: 'string' } }, // includes Date[]
                        { type: 'array', items: { type: 'boolean' } },
                        { type: 'array', items: { type: 'object' } } // includes Date[] objects
                    ]
                }
            },
            required: ['fieldName', 'filterOperator', 'filterValue']
        },
        outputSchema: {
            type: 'object',
            properties: {
                filteredTasks: { type: 'array', items: { type: 'object' } }
            },
            required: ['filteredTasks']
        }
    },
    {
        name: 'sortTasks',
        description: 'Sorts tasks based on specified field and direction.',
        annotations: { readOnlyHint: true },
        inputSchema: {
            type: 'object',
            properties: {
                columnName: { type: 'string' },
                direction: { type: 'string', enum: ['Ascending', 'Descending'] }
            },
            required: ['columnName', 'direction']
        },
        outputSchema: {
            type: 'object',
            properties: {
                sortedTasks: { type: 'array', items: { type: 'object' } }
            },
            required: ['sortedTasks']
        }
    },
    {
        name: 'indentTask',
        description: 'Indents a task to make it a child of the task above it.',
        annotations: { readOnlyHint: false },
        inputSchema: {
            type: 'object',
            properties: {
                taskId: { type: ['number', 'string'] }
            },
            required: ['taskId']
        },
        outputSchema: { type: 'object', properties: {}, required: [] }
    },
    {
        name: 'outdentTask',
        description: 'Outdents a task to make it a sibling of its parent task.',
        annotations: { readOnlyHint: false },
        inputSchema: {
            type: 'object',
            properties: {
                taskId: { type: ['number', 'string'] }
            },
            required: ['taskId']
        },
        outputSchema: { type: 'object', properties: {}, required: [] }
    },

    {
        name: 'getTaskById',
        description: 'Retrieves a specific task by its unique identifier.',
        annotations: { readOnlyHint: true },
        inputSchema: {
            type: 'object',
            properties: {
                taskId: { type: ['number', 'string'] }
            },
            required: ['taskId']
        },
        outputSchema: {
            type: 'object',
            properties: {
                task: { type: 'object' }
            },
            required: ['task']
        }
    },
    {
        name: 'reorderColumns',
        description: 'Reorders columns in the Gantt grid view.',
        annotations: { readOnlyHint: false },
        inputSchema: {
            type: 'object',
            properties: {
                fromFieldName: {
                    anyOf: [
                        { type: 'string' },
                        { type: 'array', items: { type: 'string' } }
                    ]
                },
                toFieldName: { type: 'string' }
            },
            required: ['fromFieldName', 'toFieldName']
        },
        outputSchema: { type: 'object', properties: {}, required: [] }
    },
    {
        name: 'zoomTimeline',
        description: 'Adjusts the timeline zoom level to focus on different time periods.',
        annotations: { readOnlyHint: false },
        inputSchema: {
            type: 'object',
            properties: {
                action: { type: 'string', enum: ['zoomIn', 'zoomOut', 'zoomToFit'] }
            },
            required: ['action']
        },
        outputSchema: { type: 'object', properties: {}, required: [] }
    },
    {
        name: 'convertToMilestone',
        description: 'Converts a task to a milestone by removing its duration.',
        annotations: { readOnlyHint: false },
        inputSchema: {
            type: 'object',
            properties: {
                taskId: { type: ['number', 'string'] }
            },
            required: ['taskId']
        },
        outputSchema: { type: 'object', properties: {}, required: [] }
    },
    {
        name: 'mergeTask',
        description: 'Merges task segments into a single continuous task.',
        annotations: { readOnlyHint: false },
        inputSchema: {
            type: 'object',
            properties: {
                taskId: { type: ['number', 'string'] },
                segmentIndexes: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            firstSegmentIndex: { type: 'number' },
                            secondSegmentIndex: { type: 'number' }
                        },
                        required: ['firstSegmentIndex', 'secondSegmentIndex']
                    }
                }
            },
            required: ['taskId', 'segmentIndexes']
        },
        outputSchema: { type: 'object', properties: {}, required: [] }
    },

    {
        name: 'reorderRows',
        description: 'Reorders rows in the Gantt grid by moving tasks to different positions.',
        annotations: { readOnlyHint: false },
        inputSchema: {
            type: 'object',
            properties: {
                fromIndexes: {
                    type: 'array',
                    items: { type: 'number' }
                },
                toIndex: { type: 'number' },
                position: { type: 'string' }
            },
            required: ['fromIndexes', 'toIndex', 'position']
        },
        outputSchema: { type: 'object', properties: {}, required: [] }
    },
    {
        name: 'getRecordByID',
        description: 'Retrieves a specific record by its unique identifier.',
        annotations: { readOnlyHint: true },
        inputSchema: {
            type: 'object',
            properties: {
                recordId: { type: ['number', 'string'] }
            },
            required: ['recordId']
        },
        outputSchema: {
            type: 'object',
            properties: {
                record: { type: 'object' }
            },
            required: ['record']
        }
    },
    {
        name: 'getGanttColumns',
        description: 'Retrieves the current column configuration of the Gantt chart.',
        annotations: { readOnlyHint: true },
        inputSchema: { type: 'object', properties: {}, required: [] },
        outputSchema: {
            type: 'object',
            properties: {
                columns: { type: 'array', items: { type: 'object' } }
            },
            required: ['columns']
        }
    },
    {
        name: 'getGridColumns',
        description: 'Retrieves the current column configuration of the TreeGrid portion.',
        annotations: { readOnlyHint: true },
        inputSchema: { type: 'object', properties: {}, required: [] },
        outputSchema: {
            type: 'object',
            properties: {
                columns: { type: 'array', items: { type: 'object' } }
            },
            required: ['columns']
        }
    },

    {
        name: 'clearFiltering',
        description: 'Clears all applied filters from the Gantt chart.',
        annotations: { readOnlyHint: false },
        inputSchema: {
        },
        outputSchema: { type: 'object', properties: {}, required: [] }
    },
    {
        name: 'clearSorting',
        description: 'Clears all applied sorting from the Gantt chart.',
        annotations: { readOnlyHint: false },
        inputSchema: { type: 'object', properties: {}, required: [] },
        outputSchema: { type: 'object', properties: {}, required: [] }
    },
    {
        name: 'getUndoActions',
        description: 'Retrieves the list of actions available for undo operations.',
        annotations: { readOnlyHint: true },
        inputSchema: { type: 'object', properties: {}, required: [] },
        outputSchema: {
            type: 'object',
            properties: {
                actions: { type: 'array', items: { type: 'object' } }
            },
            required: ['actions']
        }
    },
    {
        name: 'getRedoActions',
        description: 'Retrieves the list of actions available for redo operations.',
        annotations: { readOnlyHint: true },
        inputSchema: { type: 'object', properties: {}, required: [] },
        outputSchema: {
            type: 'object',
            properties: {
                actions: { type: 'array', items: { type: 'object' } }
            },
            required: ['actions']
        }
    },
    {
        name: 'clearUndoCollection',
        description: 'Clears the entire undo collection, removing all undo capabilities.',
        annotations: { readOnlyHint: false },
        inputSchema: { type: 'object', properties: {}, required: [] },
        outputSchema: { type: 'object', properties: {}, required: [] }
    },
    {
        name: 'clearRedoCollection',
        description: 'Clears the entire redo collection, removing all redo capabilities.',
        annotations: { readOnlyHint: false },
        inputSchema: { type: 'object', properties: {}, required: [] },
        outputSchema: { type: 'object', properties: {}, required: [] }
    },
    {
        name: 'scrollToTask',
        description: 'Scrolls the view to bring a specific task into view.',
        annotations: { readOnlyHint: false },
        inputSchema: {
            type: 'object',
            properties: {
                taskId: { type: ['number', 'string'] }
            },
            required: ['taskId']
        },
        outputSchema: { type: 'object', properties: {}, required: [] }
    },
    {
        name: 'scrollToDate',
        description: 'Scrolls the timeline view to bring a specific date into view.',
        annotations: { readOnlyHint: false },
        inputSchema: {
            type: 'object',
            properties: {
                date: { type: 'string' }
            },
            required: ['date']
        },
        outputSchema: { type: 'object', properties: {}, required: [] }
    }
];

export class WebMcpAdapter {
    private parent: Gantt;
    private webMcpAbortController: AbortController | null = null;

    constructor(parent: Gantt) {
        this.parent = parent;
        this.addEventListener();
    }

    private addEventListener(): void {
        this.parent.on(EVENT_GET_TOOLS, this.getTools, this);
        this.parent.on(EVENT_REGISTER_TOOLS, this.registerTools, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(EVENT_GET_TOOLS, this.getTools);
            this.parent.off(EVENT_REGISTER_TOOLS, this.registerTools);
        }
    }

    private getTools(args: { toolNames?: string[]; tools?: WebMcpTool[] }): WebMcpTool[] {
        const toolNames: string[] = args.toolNames;
        if (!isNullOrUndefined(toolNames) && toolNames.length !== 0) {
            args.tools = webMcpTools
                .filter((tool: WebMcpTool) => toolNames.indexOf(tool.name) !== -1)
                .map((tool: WebMcpTool) => {
                    const clonedTool: WebMcpTool = {} as WebMcpTool;
                    Object.assign(clonedTool, tool);
                    return clonedTool;
                });
        } else {
            args.tools = webMcpTools.map((tool: WebMcpTool) => {
                const clonedTool: WebMcpTool = {} as WebMcpTool;
                Object.assign(clonedTool, tool);
                return clonedTool;
            });
        }
        return args.tools;
    }

    private registerTools(args: { prefix?: string; tools?: string[] | WebMcpTool[]; exposedTo?: string[] }): void {
        const modelContext: { registerTool?: Function } = (document as any).modelContext;
        if (!modelContext || typeof modelContext.registerTool !== 'function') {
            return;
        }

        this.webMcpAbortController = new AbortController();

        const toolPrefix: string = (isNullOrUndefined(args.prefix) ? this.parent.element.id : args.prefix) as string;
        const tools: WebMcpTool[] =
            args.tools && args.tools.length && typeof args.tools[0] === 'object'
                ? (args.tools as WebMcpTool[])
                : this.getTools({ toolNames: args.tools as string[] });

        tools.forEach((tool: WebMcpTool): void => {
            tool.name = `${toolPrefix}_${tool.name}`;
            tool.execute = tool.execute || (async (toolArgs: ToolArgs) => this.executeHandler(tool.name, toolArgs || {}));
            modelContext.registerTool(tool, {
                signal: (this.webMcpAbortController as AbortController).signal,
                exposedTo: args.exposedTo
            });
        });
    }

    private async executeHandler(command: string, args: ToolArgs): Promise<WebMcpToolResponse> {
        try {
            const baseCommand: string = command.includes('_') ? command.substring(command.indexOf('_') + 1) : command;
            const toolDef: WebMcpTool | undefined = webMcpTools.find((t: WebMcpTool) => t.name === baseCommand);
            const eventArgs: WebMcpToolExecuteEventArgs = { toolName: command, toolArgs: args };

            this.parent.trigger(EVENT_BEFORE_EXECUTE, eventArgs);

            if (eventArgs.cancel) {
                return this.message({
                    action: baseCommand,
                    cancelled: true,
                    message: eventArgs.cancellationResponse || `[USER_CANCELLED] Tool "${baseCommand}" was cancelled. This is final. Do NOT retry.`
                });
            }

            const readOnlyHint: boolean = !!(toolDef && toolDef.annotations && toolDef.annotations.readOnlyHint);
            if (!readOnlyHint && eventArgs.showConfirmationDialog) {
                const summary: string = this.buildConfirmationMessage(baseCommand, args);
                const approved: boolean = await this.requestConfirmation(baseCommand, args, summary);
                if (!approved) {
                    return this.message({
                        action: baseCommand,
                        cancelled: true,
                        message: eventArgs.cancellationResponse || `[USER_CANCELLED] User denied: "${summary}". This is final. Do NOT retry.`
                    });
                }
            }

            switch (baseCommand) {
            case 'getProjectTasks':
                return this.message({ record: this.parent.getCurrentViewData() });
            case 'getTaskDetails':
                return this.message({ record: this.parent.getTaskInfo(args.taskId as string) });
            case 'manageHierarchy': {
                const action: string = args.action as string;
                const id: number | string = args.id as number | string;
                const index: number[] | number = args.index as number[] | number;

                switch (action) {
                case 'expandAll':
                    this.parent.expandAll();
                    break;
                case 'collapseAll':
                    this.parent.collapseAll();
                    break;
                case 'expandByID':
                    this.parent.expandByID(id);
                    break;
                case 'expandByIndex':
                    this.parent.expandByIndex(index);
                    break;
                default:
                    return this.error(`Unknown hierarchy action: "${action}"`);
                }
                return this.message({});
            }
            case 'getCriticalTasks':
                return this.message({ record: this.parent.getCriticalTasks() });
            case 'createTask':
                this.parent.addRecord(args.data as Object[] | IGanttData | Object,
                                      args.rowPosition as RowPosition, args.rowIndex as number);
                return this.message({});
            case 'updateTask':
                this.parent.updateRecordByID(args.data as Object);
                return this.message({});
            case 'deleteTask':
                this.parent.deleteRecord(args.taskDetail as number | string | number[] | string[] | IGanttData | IGanttData[]);
                return this.message({});
            case 'splitTask': {
                const taskId: number | string = args.taskId as number | string;
                const splitDateRaw: Date | Date[] = args.splitDate as Date | Date[];
                /* eslint-disable-next-line */
                const splitDate: Date | Date[] = Array.isArray(splitDateRaw)
                    ? (splitDateRaw).map((d: Date) => new Date(d as Date))
                    : new Date(splitDateRaw);
                this.parent.splitTask(taskId, splitDate);
                return this.message({});
            }
            case 'manageTaskDependencies': {
                const taskId: number | string = args.taskId as number | string;
                const operation: string = args.operation as string;
                const predecessorString: string = args.predecessorString as string;

                switch (operation) {
                case 'add':
                    this.parent.addPredecessor(taskId, predecessorString);
                    break;
                case 'update':
                    this.parent.updatePredecessor(taskId, predecessorString);
                    break;
                case 'remove':
                    this.parent.removePredecessor(taskId);
                    break;
                default:
                    return this.error(`Unknown dependency operation: "${operation}"`);
                }
                return this.message({});
            }
            case 'updateProjectDates': {
                const startDate: Date = new Date(args.startDate as Date);
                const endDate: Date = new Date(args.endDate as Date);
                const isTimelineRoundOff: boolean = args.isTimelineRoundOff as boolean;
                const isFrom: string = args.isFrom as string;
                this.parent.updateProjectDates(startDate, endDate, isTimelineRoundOff, isFrom);
                return this.message({});
            }
            case 'getVisibleTasksHierarchy': {
                const records: IGanttData[] = (args.records as IGanttData[]) || (this.parent.getCurrentViewData() as IGanttData[]);
                const record: IGanttData[] = this.parent.getExpandedRecords(records);
                return this.message({ record });
            }
            case 'undo':
                this.parent.undo();
                return this.message({});
            case 'redo':
                this.parent.redo();
                return this.message({});
            case 'excelExport': {
                /* eslint-disable-next-line */
                const exportProperties: ExcelExportProperties =
                    args.exportProperties && typeof args.exportProperties === 'object' && !Array.isArray(args.exportProperties)
                        ? Object.keys(args.exportProperties as ExcelExportProperties).length
                            ? (args.exportProperties as ExcelExportProperties)
                            : null
                        : (args.exportProperties as ExcelExportProperties);
                /* eslint-disable-next-line */
                const workbook: any =
                    args.workbook && typeof args.workbook === 'object' && !Array.isArray(args.workbook)
                    /* eslint-disable-next-line */
                        ? Object.keys(args.workbook as any).length ? (args.workbook as any) : null : (args.workbook as any);
                /* eslint-disable-next-line */
                const record: any  = await this.parent.excelExport(
                    exportProperties,
                    args.isMultipleExport as boolean,
                    workbook,
                    args.isBlob as boolean
                );
                return this.message({ record });
            }
            case 'pdfExport': {
                const exportProperties: PdfExportProperties =
                    args.exportProperties && typeof args.exportProperties === 'object' && !Array.isArray(args.exportProperties)
                        ? Object.keys(args.exportProperties as PdfExportProperties).length
                            ? (args.exportProperties as PdfExportProperties)
                            : null
                        : (args.exportProperties as PdfExportProperties);

                const pdfDoc: Object =
                    args.pdfDoc && typeof args.pdfDoc === 'object' && !Array.isArray(args.pdfDoc)
                        ? Object.keys(args.pdfDoc as Object).length
                            ? (args.pdfDoc as Object)
                            : null
                        : (args.pdfDoc as Object);
                /* eslint-disable-next-line */
                const record: any = await this.parent.pdfExport(
                    exportProperties,
                    args.isMultipleExport as boolean,
                    pdfDoc,
                    args.isBlob as boolean
                );
                return this.message({ record });
            }
            case 'csvExport': {
                const record: ExcelExportProperties = await this.parent.csvExport(
                    args.exportProperties as ExcelExportProperties,
                    args.isMultipleExport as boolean,
                    /* eslint-disable-next-line */
                    args.workbook as any,
                    args.isBlob as boolean
                );
                return this.message({ record });
            }
            case 'searchTasks': {
                this.parent.search(args.keyword as string);
                // Note: search doesn't return results directly, would need to get current view data
                return this.message({ record: this.parent.getCurrentViewData() });
            }
            case 'filterTasks': {
                this.parent.filterByColumn(args.fieldName as string, args.filterOperator as string, args.filterValue as string);
                return this.message({ record: this.parent.getCurrentViewData() });
            }
            case 'sortTasks': {
                this.parent.sortColumn(args.columnName as string, args.direction as SortDirection);
                return this.message({ record: this.parent.getCurrentViewData() });
            }
            case 'indentTask': {
                // Select the task first, then indent
                const taskId: string = args.taskId as string;
                const record: IGanttData = this.parent.getRecordByID(taskId as string);
                if (record) {
                    this.parent.selectRow(record.index);
                    this.parent.indent();
                }
                return this.message({});
            }
            case 'outdentTask': {
                // Select the task first, then outdent
                const taskId: string = args.taskId as string;
                const record: IGanttData = this.parent.getRecordByID(taskId as string);
                if (record) {
                    this.parent.selectRow(record.index);
                    this.parent.outdent();
                }
                return this.message({});
            }
            case 'getTaskById': {
                const record: IGanttTaskInfo = this.parent.getTaskInfo(args.taskId as string);
                return this.message({ record });
            }
            case 'reorderColumns': {
                const fromFieldName: string | string[] = args.fromFieldName as string | string[];
                const toFieldName: string = args.toFieldName as string;
                if (Array.isArray(fromFieldName)) {
                    this.parent.reorderColumns(fromFieldName, toFieldName as string);
                } else {
                    this.parent.reorderColumns(fromFieldName as string, toFieldName as string);
                }
                return this.message({});
            }
            case 'zoomTimeline': {
                const action: string = args.action as string;
                switch (action) {
                case 'zoomIn':
                    this.parent.zoomIn();
                    break;
                case 'zoomOut':
                    this.parent.zoomOut();
                    break;
                case 'zoomToFit':
                    this.parent.fitToProject();
                    break;
                }
                return this.message({});
            }
            case 'convertToMilestone': {
                this.parent.convertToMilestone(args.taskId as string);
                return this.message({});
            }
            case 'mergeTask': {
                const taskId: string | number = args.taskId as string | number;
                const segmentIndexes: { firstSegmentIndex: number, secondSegmentIndex: number }[]  =
                    args.segmentIndexes as { firstSegmentIndex: number, secondSegmentIndex: number }[];
                if (Array.isArray(segmentIndexes) && segmentIndexes.length) {
                    this.parent.mergeTask(taskId, segmentIndexes);
                }

                return this.message({});
            }

            case 'reorderRows': {
                const fromIndexes: number[] = args.fromIndexes as number[];
                const toIndex: number = args.toIndex as number;
                const position: string = args.position as string;
                this.parent.reorderRows(fromIndexes, toIndex, position);
                return this.message({});
            }
            case 'getRecordByID': {
                const record: IGanttData = this.parent.getRecordByID(args.recordId as string);
                return this.message({ record });
            }
            case 'getGanttColumns': {
                const record: ColumnModel[] = this.parent.getGanttColumns();
                return this.message({ record });
            }
            case 'getGridColumns': {
                const record: ColumnModel[] = this.parent.getGridColumns();
                return this.message({ record });
            }
            case 'clearFiltering': {
                const fields: string[] = args.fields as string[];
                this.parent.clearFiltering(fields);
                return this.message({});
            }
            case 'clearSorting': {
                this.parent.clearSorting();
                return this.message({});
            }
            case 'getUndoActions': {
                const actions: Object[] = this.parent.getUndoActions();
                return this.message({ actions });
            }
            case 'getRedoActions': {
                const record: Object[] = this.parent.getRedoActions();
                return this.message({ record });
            }
            case 'clearUndoCollection': {
                this.parent.clearUndoCollection();
                return this.message({});
            }
            case 'clearRedoCollection': {
                this.parent.clearRedoCollection();
                return this.message({});
            }
            case 'scrollToTask': {
                this.parent.scrollToTask(args.taskId as string);
                return this.message({});
            }
            case 'scrollToDate': {
                this.parent.scrollToDate(args.date as string);
                return this.message({});
            }
            default:
                return this.error(`Tool "${baseCommand}" not found.`);
            }
        } catch (e) {
            return this.error(e.message ? String(e.message) : 'Tool execution failed');
        }
    }

    private buildConfirmationMessage(command: string, args: ToolArgs): string {
        return `Confirm: ${command} with args: ${JSON.stringify(args || {})}`;
    }

    private async requestConfirmation(_command: string, _args: ToolArgs, _message: string): Promise<boolean> {
        // No UI integration in this repo; assume approval.
        return true;
    }

    private message(data: any): WebMcpToolResponse {
        return {
            content: [{
                type: 'text', text: JSON.stringify(
                    {
                        records: data.record
                    }
                )
            }]
        };
    }

    private error(text: string): WebMcpToolResponse {
        return { content: [{ type: 'text', text }], isError: true };
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
        return 'WebMcpAdapter';
    }
}

import { SanitizeHtmlHelper, extend, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Chart } from '../chart';
import { webMcpBeforeExecute, webMcpGetTools, webMcpRegisterTools } from '../../common/model/constants';
import { AxisModel } from '../axis/axis-model';
import { Series } from '../series/chart-series';
import { SeriesModel } from '../series/chart-series-model';
import { ExportType } from '../../common/utils/enum';
import { IndexesModel } from '../../common/model/base-model';
import {
    AddChartAnnotationArgs,
    AppendChartDataArgs,
    ChartPointArgs,
    ChartPointPositionArgs,
    ConfigureChartZoomArgs,
    GetChartLocalizationArgs,
    GetChartStriplinesArgs,
    ModelContext,
    RemoveChartAnnotationArgs,
    RemoveChartAxisArgs,
    RemoveChartPointsArgs,
    ResetChartZoomArgs,
    UpdateChartArgs,
    UpdateChartPointArgs,
    UpdateChartSeriesArgs,
    WebMcpTool,
    WebMcpToolExecuteEventArgs,
    WebMcpToolExecutionArgs,
    WebMcpToolRegistrationArgs,
    WebMcpToolResponse
} from '../model/chart-interface';

const outputSchema: object = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        data: { type: 'object' },
        message: { type: 'string' }
    },
    required: ['success', 'data', 'message']
};

/*
 * Defines the WebMCP tools exposed by the chart component. Read-only tools set
 * `readOnlyHint` to true so they skip the confirmation dialog; mutating tools
 * keep `readOnlyHint` false and always request user confirmation.
 */
const webMcpTools: WebMcpTool[] = [
    {
        name: 'inspectChart',
        description:
            'Returns the current Chart configuration and series information.',
        inputSchema: {
            type: 'object',
            properties: {
                includeSeries: {
                    type: 'boolean',
                    description: 'Include per-series metadata. Defaults to true.'
                }
            },
            required: []
        },
        outputSchema,
        annotations: {
            readOnlyHint: true,
            untrustedContentHint: true
        }
    },
    {
        name: 'getSeriesData',
        description: 'Returns data points from a Chart series.',
        inputSchema: {
            type: 'object',
            properties: {
                seriesIndex: {
                    type: 'integer',
                    minimum: 0,
                    description: 'Zero-based chart series index.'
                },
                maxPoints: {
                    type: 'integer',
                    minimum: 1,
                    maximum: 10000,
                    description: 'Maximum number of points to return. Defaults to 100.'
                },
                includeHiddenPoints: {
                    type: 'boolean',
                    description: 'Include points marked invisible. Defaults to false.'
                }
            },
            required: ['seriesIndex']
        },
        outputSchema,
        annotations: {
            readOnlyHint: true,
            untrustedContentHint: true
        }
    },
    {
        name: 'addChartSeries',
        description: 'Adds one or more series to the Chart.',
        inputSchema: {
            type: 'object',
            properties: {
                series: {
                    type: 'array',
                    items: { type: 'object' },
                    description: 'SeriesModel definitions.'
                }
            },
            required: ['series']
        },
        outputSchema,
        annotations: {
            readOnlyHint: false,
            untrustedContentHint: false
        }
    },
    {
        name: 'removeChartSeries',
        description: 'Removes a series from the Chart.',
        inputSchema: {
            type: 'object',
            properties: {
                seriesIndex: {
                    type: 'integer',
                    minimum: 0,
                    description: 'Zero-based chart series index.'
                }
            },
            required: ['seriesIndex']
        },
        outputSchema,
        annotations: {
            readOnlyHint: false,
            untrustedContentHint: false
        }
    },
    {
        name: 'clearChartSeries',
        description: 'Removes all series from the Chart.',
        inputSchema: {
            type: 'object',
            properties: {},
            required: []
        },
        outputSchema,
        annotations: {
            readOnlyHint: false,
            untrustedContentHint: false
        }
    },
    {
        name: 'updateChartAnnotation',
        description: 'Updates an existing Chart annotation.',
        inputSchema: {
            type: 'object',
            properties: {
                annotationIndex: {
                    type: 'integer',
                    minimum: 0,
                    description: 'Zero-based annotation index.'
                },
                content: {
                    type: 'string',
                    description: 'New annotation content.'
                }
            },
            required: ['annotationIndex', 'content']
        },
        outputSchema,
        annotations: {
            readOnlyHint: false,
            untrustedContentHint: false
        }
    },
    {
        name: 'showChartTooltip',
        description: 'Displays the Chart Tooltip.',
        inputSchema: {
            type: 'object',
            properties: {
                x: {
                    type: ['number', 'string'],
                    description: 'Point x value or chart-local x coordinate.'
                },
                y: {
                    type: 'number',
                    description: 'Point y value or chart-local y coordinate.'
                },
                isPoint: {
                    type: 'boolean',
                    description: 'Treat x and y as data-point values.'
                }
            },
            required: ['x', 'y']
        },
        outputSchema,
        annotations: {
            readOnlyHint: true,
            untrustedContentHint: false
        }
    },
    {
        name: 'showChartCrosshair',
        description: 'Displays the Chart crosshair.',
        inputSchema: {
            type: 'object',
            properties: {
                x: {
                    type: 'number',
                    description: 'Chart-local horizontal coordinate.'
                },
                y: {
                    type: 'number',
                    description: 'Chart-local vertical coordinate.'
                }
            },
            required: ['x', 'y']
        },
        outputSchema,
        annotations: {
            readOnlyHint: true,
            untrustedContentHint: false
        }
    },
    {
        name: 'exportChart',
        description: 'Exports the Chart to a file format. **Supported formats:** `PNG`, `JPEG`, `SVG`, `PDF`, `XLSX`, `CSV`.',
        inputSchema: {
            type: 'object',
            properties: {
                type: {
                    type: 'string',
                    enum: ['PNG', 'JPEG', 'SVG', 'PDF', 'XLSX', 'CSV'],
                    description: 'Export format (PNG, JPEG, SVG, PDF, XLSX, or CSV).'
                },
                fileName: {
                    type: 'string',
                    minLength: 1,
                    maxLength: 255,
                    description: 'Safe output file name without path separators.'
                }
            },
            required: ['type', 'fileName']
        },
        outputSchema,
        annotations: {
            readOnlyHint: false,
            untrustedContentHint: false
        }
    },
    {
        name: 'printChart',
        description: 'Prints the Chart.',
        inputSchema: {
            type: 'object',
            properties: {
                elementIds: {
                    description: 'Optional chart element ID or array of element IDs.'
                }
            },
            required: []
        },
        outputSchema,
        annotations: {
            readOnlyHint: false,
            untrustedContentHint: false
        }
    },

    {
        name: 'updateChartDataSource',
        description:
            'Updates the Chart data source or series data source.',
        inputSchema: {
            type: 'object',
            properties: {
                dataSource: {
                    type: 'array',
                    items: { type: 'object' },
                    description: 'Optional chart-level data records.'
                },
                series: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            index: {
                                type: 'integer',
                                minimum: 0,
                                description: 'Zero-based series index.'
                            },
                            dataSource: {
                                type: 'array',
                                items: { type: 'object' },
                                description: 'Data records for the selected series.'
                            }
                        },
                        required: ['index', 'dataSource']
                    },
                    description: 'Optional targeted series data-source updates.'
                }
            },
            required: [],
            anyOf: [{ required: ['dataSource'] }, { required: ['series'] }]
        },
        outputSchema,
        annotations: {
            readOnlyHint: false,
            untrustedContentHint: false
        }
    },
    {
        name: 'toggleChartSeriesVisibility',
        description: 'Shows or hides a Chart series.',
        inputSchema: {
            type: 'object',
            properties: {
                seriesIndex: {
                    type: 'integer',
                    minimum: 0,
                    description: 'Zero-based chart series index.'
                },
                visible: {
                    type: 'boolean',
                    description: 'Desired visibility state.'
                }
            },
            required: ['seriesIndex', 'visible']
        },
        outputSchema,
        annotations: {
            readOnlyHint: false,
            untrustedContentHint: false
        }
    },
    {
        name: 'configureChartZoom',
        description: 'Updates Chart zoom settings.',
        inputSchema: {
            type: 'object',
            properties: {
                axis: {
                    type: 'string',
                    enum: ['x', 'y'],
                    description: 'Primary-axis orientation or secondary-axis orientation.'
                },
                axisName: {
                    type: 'string',
                    minLength: 1,
                    maxLength: 255,
                    description: 'Optional secondary-axis name. Omit it to update the selected primary axis.'
                },
                zoomFactor: {
                    type: 'number',
                    minimum: 0,
                    maximum: 1,
                    description: 'Visible proportion.'
                },
                zoomPosition: {
                    type: 'number',
                    minimum: 0,
                    maximum: 1,
                    description: 'Start position.'
                }
            },
            required: ['axis', 'zoomFactor', 'zoomPosition']
        },
        outputSchema,
        annotations: {
            readOnlyHint: false,
            untrustedContentHint: false
        }
    },
    {
        name: 'resetChartZoom',
        description: 'Resets Chart zoom settings.',
        inputSchema: {
            type: 'object',
            properties: {
                axis: {
                    type: 'string',
                    enum: ['x', 'y'],
                    description: 'Optional primary axis to reset when axisName is not provided.'
                },
                axisName: {
                    type: 'string',
                    minLength: 1,
                    maxLength: 255,
                    description: 'Optional named secondary axis to reset.'
                }
            },
            required: []
        },
        outputSchema,
        annotations: {
            readOnlyHint: false,
            untrustedContentHint: false
        }
    },
    {
        name: 'selectChartPoints',
        description: 'Selects Chart data points.',
        inputSchema: {
            type: 'object',
            properties: {
                indexes: {
                    type: 'array',
                    items: { type: 'object' },
                    description: 'Objects containing series and point indexes.'
                },
                selectionMode: {
                    type: 'string',
                    enum: ['Point', 'Series', 'Cluster'],
                    description: 'Optional compatible selection mode.'
                }
            },
            required: ['indexes']
        },
        outputSchema,
        annotations: {
            readOnlyHint: false,
            untrustedContentHint: false
        }
    },
    {
        name: 'clearChartSelection',
        description: 'Clears all Chart selections.',
        inputSchema: {
            type: 'object',
            properties: {},
            required: []
        },
        outputSchema,
        annotations: {
            readOnlyHint: false,
            untrustedContentHint: false
        }
    },
    {
        name: 'addChartAxis',
        description: 'Adds secondary axes to the Chart.',
        inputSchema: {
            type: 'object',
            properties: {
                axes: {
                    type: 'array',
                    minItems: 1,
                    items: { type: 'object' },
                    description: 'AxisModel definitions. Every secondary axis must have a unique name.'
                }
            },
            required: ['axes']
        },
        outputSchema,
        annotations: {
            readOnlyHint: false,
            untrustedContentHint: false
        }
    },
    {
        name: 'updateChartAxis',
        description:
            'Updates Chart axis properties.',
        inputSchema: {
            type: 'object',
            properties: {
                axis: {
                    type: 'string',
                    enum: ['x', 'y'],
                    description: 'Selects the x-axis or y-axis.'
                },
                axisName: {
                    type: 'string',
                    description: 'Optional secondary axis name, such as webmcpAxis.'
                },
                properties: {
                    type: 'object',
                    description: 'Axis properties such as title, minimum, maximum, interval, opposedPosition, or labelIntersectAction.'
                }
            },
            required: ['axis', 'properties']
        },
        outputSchema,
        annotations: {
            readOnlyHint: false,
            untrustedContentHint: false
        }
    },
    {
        name: 'updateChartTitle',
        description: 'Updates the Chart title and subtitle.',
        inputSchema: {
            type: 'object',
            properties: {
                title: {
                    type: 'string',
                    maxLength: 500,
                    description: 'New chart title.'
                },
                subTitle: {
                    type: 'string',
                    maxLength: 500,
                    description: 'New subtitle or an empty string.'
                }
            },
            required: ['title']
        },
        outputSchema,
        annotations: {
            readOnlyHint: false,
            untrustedContentHint: false
        }
    },
    {
        name: 'hideChartTooltip',
        description: 'Hides the currently displayed chart tooltip.',
        inputSchema: {
            type: 'object',
            properties: {},
            required: []
        },
        outputSchema,
        annotations: {
            readOnlyHint: true,
            untrustedContentHint: false
        }
    },
    {
        name: 'hideChartCrosshair',
        description: 'Hides the currently displayed chart crosshair.',
        inputSchema: {
            type: 'object',
            properties: {},
            required: []
        },
        outputSchema,
        annotations: {
            readOnlyHint: true,
            untrustedContentHint: false
        }
    },

    {
        name: 'updateChartProperties',
        description:
            'Updates supported Chart properties.',
        inputSchema: {
            type: 'object',
            properties: {
                properties: {
                    type: 'object',
                    minProperties: 1,
                    description: 'Supported Chart properties to apply.'
                }
            },
            required: ['properties']
        },
        outputSchema,
        annotations: { readOnlyHint: false, untrustedContentHint: false }
    },
    {
        name: 'updateChartSeries',
        description:
            'Updates properties of an existing Chart series.',
        inputSchema: {
            type: 'object',
            properties: {
                seriesIndex: { type: 'integer', minimum: 0, description: 'Zero-based series index.' },
                properties: { type: 'object', minProperties: 1, description: 'Supported SeriesModel properties to apply.' }
            },
            required: ['seriesIndex', 'properties']
        },
        outputSchema,
        annotations: { readOnlyHint: false, untrustedContentHint: false }
    },
    {
        name: 'updateChartPoint',
        description: 'Updates a data point in a Chart series.',
        inputSchema: {
            type: 'object',
            properties: {
                seriesIndex: { type: 'integer', minimum: 0, description: 'Zero-based series index.' },
                pointIndex: { type: 'integer', minimum: 0, description: 'Zero-based point index.' },
                properties: { type: 'object', minProperties: 1, description: 'Data-record fields to update.' }
            },
            required: ['seriesIndex', 'pointIndex', 'properties']
        },
        outputSchema,
        annotations: { readOnlyHint: false, untrustedContentHint: false }
    },
    {
        name: 'appendChartData',
        description: 'Adds data records to a Chart series and optionally limits the number of retained records.',
        inputSchema: {
            type: 'object',
            properties: {
                seriesIndex: { type: 'integer', minimum: 0, description: 'Zero-based series index.' },
                data: { type: 'array', minItems: 1, items: { type: 'object' }, description: 'Data records to append.' },
                maxPoints: { type: 'integer', minimum: 1, maximum: 100000, description: 'Maximum records to retain.' }
            },
            required: ['seriesIndex', 'data']
        },
        outputSchema,
        annotations: { readOnlyHint: false, untrustedContentHint: false }
    },
    {
        name: 'removeChartPoints',
        description: 'Removes data points from a Chart series.',
        inputSchema: {
            type: 'object',
            properties: {
                seriesIndex: { type: 'integer', minimum: 0, description: 'Zero-based series index.' },
                startIndex: { type: 'integer', minimum: 0, description: 'First data-record index to remove.' },
                count: { type: 'integer', minimum: 1, description: 'Number of records to remove.' }
            },
            required: ['seriesIndex', 'startIndex', 'count']
        },
        outputSchema,
        annotations: { readOnlyHint: false, untrustedContentHint: false }
    },
    {
        name: 'getChartPoint',
        description: 'Returns information about a specific Chart point.',
        inputSchema: {
            type: 'object',
            properties: {
                seriesIndex: { type: 'integer', minimum: 0, description: 'Zero-based series index.' },
                pointIndex: { type: 'integer', minimum: 0, description: 'Zero-based point index.' }
            },
            required: ['seriesIndex', 'pointIndex']
        },
        outputSchema,
        annotations: { readOnlyHint: true, untrustedContentHint: true }
    },

    {
        name: 'getSelectedChartData',
        description: 'Returns the currently selected Chart data points.',
        inputSchema: { type: 'object', properties: {}, required: [] },
        outputSchema,
        annotations: { readOnlyHint: true, untrustedContentHint: true }
    },

    {
        name: 'getChartAxes',
        description: 'Returns Chart axis information.',
        inputSchema: { type: 'object', properties: {}, required: [] },
        outputSchema,
        annotations: { readOnlyHint: true, untrustedContentHint: true }
    },
    {
        name: 'getChartIndicators',
        description: 'Returns configured Chart indicators.',
        inputSchema: { type: 'object', properties: {}, required: [] },
        outputSchema,
        annotations: { readOnlyHint: true, untrustedContentHint: true }
    },
    {
        name: 'getChartStriplines',
        description: 'Returns Chart stripline information.',
        inputSchema: {
            type: 'object',
            properties: {
                axisName: {
                    type: 'string',
                    minLength: 1,
                    maxLength: 255,
                    description: 'Optional primaryXAxis, primaryYAxis, or secondary-axis name.'
                }
            },
            required: []
        },
        outputSchema,
        annotations: { readOnlyHint: true, untrustedContentHint: true }
    },
    {
        name: 'removeChartAxis',
        description: 'Removes a secondary Chart axis.',
        inputSchema: {
            type: 'object',
            properties: {
                axisName: { type: 'string', minLength: 1, maxLength: 255, description: 'Optional secondary-axis name.' },
                axisIndex: { type: 'integer', minimum: 0, description: 'Optional zero-based secondary-axis index.' },
                resetSeriesBindings: { type: 'boolean', description: 'Reset affected bindings. Defaults to true.' }
            },
            required: [],
            oneOf: [{ required: ['axisName'] }, { required: ['axisIndex'] }]
        },
        outputSchema,
        annotations: { readOnlyHint: false, untrustedContentHint: false }
    },
    {
        name: 'getChartAnnotations',
        description: 'Returns all Chart annotations.',
        inputSchema: { type: 'object', properties: {}, required: [] },
        outputSchema,
        annotations: { readOnlyHint: true, untrustedContentHint: true }
    },
    {
        name: 'addChartAnnotation',
        description: 'Adds one or more annotations to the Chart.',
        inputSchema: {
            type: 'object',
            properties: {
                annotations: { type: 'array', minItems: 1, items: { type: 'object' }, description: 'Annotations to add.' }
            },
            required: ['annotations']
        },
        outputSchema,
        annotations: { readOnlyHint: false, untrustedContentHint: false }
    },
    {
        name: 'removeChartAnnotation',
        description: 'Removes a Chart annotation.',
        inputSchema: {
            type: 'object',
            properties: {
                annotationIndex: { type: 'integer', minimum: 0, description: 'Zero-based annotation index.' }
            },
            required: ['annotationIndex']
        },
        outputSchema,
        annotations: { readOnlyHint: false, untrustedContentHint: false }
    },
    {
        name: 'animateChart',
        description: 'Starts Chart animation with an optional duration in milliseconds (defaults to 1000 ms).',
        inputSchema: {
            type: 'object',
            properties: {
                duration: {
                    type: 'integer',
                    minimum: 0,
                    maximum: 60000,
                    description: 'Animation duration in milliseconds. Defaults to 1000 if not specified.'
                },
                seriesIndexes: {
                    type: 'array',
                    items: { type: 'integer', minimum: 0 },
                    description: 'Optional array of zero-based series indices to animate. If omitted, all series are animated.'
                }
            },
            required: []
        },
        outputSchema,
        annotations: {
            readOnlyHint: true,
            untrustedContentHint: false
        }
    },
    {
        name: 'getChartLegend',
        description: 'Returns Chart legend information.',
        inputSchema: {
            type: 'object',
            properties: {},
            required: []
        },
        outputSchema,
        annotations: {
            readOnlyHint: true,
            untrustedContentHint: true
        }
    }
];

export class WebMcpChart {
    private parent: Chart;
    private webMcpAbortController: AbortController | null = null;

    constructor(parent: Chart) {
        this.parent = parent;
        this.addEventListener();
    }

    private addEventListener(): void {
        this.parent.on(webMcpGetTools, this.getTools, this);
        this.parent.on(webMcpRegisterTools, this.registerTools, this);
    }

    private removeEventListener(): void {
        if (!this.parent || this.parent.isDestroyed) {
            return;
        }

        this.parent.off(webMcpGetTools, this.getTools);
        this.parent.off(webMcpRegisterTools, this.registerTools);
    }

    private getTools(args: WebMcpToolExecutionArgs): WebMcpTool[] {
        const toolNames: string[] = args.toolNames || [];

        args.tools = toolNames.length
            ? webMcpTools
                .filter((tool: WebMcpTool): boolean => toolNames.indexOf(tool.name) !== -1)
                .map((tool: WebMcpTool): WebMcpTool => this.createExecutableToolCopy(tool))
            : webMcpTools.map((tool: WebMcpTool): WebMcpTool => this.createExecutableToolCopy(tool));

        return args.tools;
    }

    /**
     * Creates a deep copy of a built-in tool definition with an `execute`
     * handler bound to this adapter, so consumers can run the tool directly
     * without going through the model-context registration flow. Deep-copying
     * also prevents consumers from mutating the shared schema definitions.
     * @private
     * @param {WebMcpTool} tool - Optional tool allowlist or custom definitions.
     * @returns {WebMcpTool} - The copy of tool.
     */
    private createExecutableToolCopy(tool: WebMcpTool): WebMcpTool {
        const copy: WebMcpTool = JSON.parse(JSON.stringify(tool)) as WebMcpTool;
        copy.execute = this.createBuiltInExecuteHandler(tool.name);
        return copy;
    }
    private createBuiltInExecuteHandler(command: string): (input: object) => Promise<WebMcpToolResponse> {
        const chart: Chart = this.getActiveChart();
        return async (input: object): Promise<WebMcpToolResponse> => {
            if (!chart || chart.isDestroyed) {
                return this.createUnavailableChartResponse(command);
            }
            const adapter: WebMcpChart = chart.webMcpChartModule;
            if (!adapter) {
                return this.createUnavailableChartResponse(command);
            }
            return adapter.executeHandler(command, input || {});
        };
    }
    private createUnavailableChartResponse(command: string): WebMcpToolResponse {
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({
                        success: false,
                        data: {},
                        message: `Tool "${command}" failed: The chart instance is unavailable.`
                    })
                }
            ],
            isError: true
        };
    }

    private registerTools(args: WebMcpToolRegistrationArgs): void {
        const chart: Chart = this.getActiveChart();
        const modelContext: ModelContext | undefined = (document as { modelContext?: ModelContext }).modelContext;

        if (!modelContext || typeof modelContext.registerTool !== 'function') {
            return;
        }

        // Abort the previous registration so stale tool names do not linger
        // on the model context when settings change.
        if (this.webMcpAbortController) {
            this.webMcpAbortController.abort();
            this.webMcpAbortController = null;
        }

        // An explicit empty allowlist is a request to clear prior tools.
        if (args.tools && args.tools.length === 0) {
            return;
        }

        const abortController: AbortController = new AbortController();
        this.webMcpAbortController = abortController;

        const registerOptions: {
            signal: AbortSignal;
            exposedTo?: string[];
        } = {
            signal: abortController.signal
        };

        if (Array.isArray(args.exposedTo) && args.exposedTo.length > 0) {
            registerOptions.exposedTo = args.exposedTo;
        }

        // Treat a null/undefined/empty prefix as "use the chart element id".
        const toolPrefix: string = (isNullOrUndefined(args.prefix) || args.prefix === '')
            ? chart.element.id
            : args.prefix;

        const tools: WebMcpTool[] = args.tools && args.tools.length && typeof args.tools[0] === 'object'
            ? args.tools as WebMcpTool[]
            : this.getTools({ toolNames: args.tools as string[] });

        tools.forEach((tool: WebMcpTool): void => {
            const baseName: string = tool.name;
            const builtInTool: boolean = webMcpTools.some((item: WebMcpTool): boolean => item.name === baseName);
            const execute: Function | undefined = builtInTool ? this.createBuiltInExecuteHandler(baseName) : tool.execute;

            if (typeof execute !== 'function') {
                return;
            }

            const registeredTool: WebMcpTool = {
                ...tool,
                inputSchema: tool.inputSchema ? JSON.parse(JSON.stringify(tool.inputSchema)) : tool.inputSchema,
                outputSchema: tool.outputSchema ? JSON.parse(JSON.stringify(tool.outputSchema)) : tool.outputSchema,
                name: `${toolPrefix}_${baseName}`,
                execute
            };

            try {
                modelContext.registerTool(registeredTool, registerOptions);
            } catch (error) {
                // Registration errors are isolated so one failure cannot prevent
                // other tools from being registered.
            }
        });
    }

    private async executeHandler(command: string, args: object): Promise<WebMcpToolResponse> {
        // Tools are registered with `${name}_${baseName}` so consumers can
        // distinguish tool families. Strip the prefix so we can route the
        // call to the chart-side handler by base name only.
        const baseCommand: string = command.indexOf('_') !== -1 ? command.substring(command.indexOf('_') + 1) : command;
        try {
            const tool: WebMcpTool | undefined = webMcpTools.filter(
                (item: WebMcpTool): boolean => item.name === baseCommand
            )[0];

            if (!tool) {
                return this.error(`Tool "${baseCommand}" not found.`);
            }

            const eventArgs: WebMcpToolExecuteEventArgs = {
                toolName: command,
                toolArgs: args
            };

            this.parent.trigger(webMcpBeforeExecute, eventArgs);

            if (eventArgs.cancel) {
                return this.message({
                    action: baseCommand,
                    cancelled: true,
                    message:
                        eventArgs.cancellationResponse ||
                        `[USER_CANCELLED] Tool "${baseCommand}" was cancelled. This is final. Do NOT retry.`
                });
            }

            // Default the confirmation flag from the tool's read-only hint,
            const readOnlyHint: boolean = !!(tool && (tool.annotations as { readOnlyHint?: boolean }).readOnlyHint);
            if (!readOnlyHint && eventArgs.showConfirmationDialog) {
                const summary: string = this.buildConfirmationMessage(baseCommand, args);

                if (!(await this.requestConfirmation(baseCommand, args, summary))) {
                    return this.message({
                        action: baseCommand,
                        cancelled: true,
                        message:
                            eventArgs.cancellationResponse ||
                            `[USER_CANCELLED] User denied: "${summary}". This is final. Do NOT retry.`
                    });
                }
            }
            switch (baseCommand) {
            case 'inspectChart':
                return this.handleInspectChart(args as { includeSeries?: boolean });

            case 'getSeriesData':
                return this.handleGetSeriesData(args as { seriesIndex: number; maxPoints?: number; includeHiddenPoints?: boolean });

            case 'addChartSeries':
                return this.handleAddChartSeries(args as { series: SeriesModel[] });

            case 'removeChartSeries':
                return this.handleRemoveChartSeries(args as { seriesIndex: number });

            case 'clearChartSeries':
                return this.handleClearChartSeries();

            case 'updateChartAnnotation':
                return this.handleUpdateChartAnnotation(args as { annotationIndex: number; content: string });

            case 'showChartTooltip':
                return this.handleShowChartTooltip(args as { x: number | string; y: number; isPoint?: boolean });

            case 'showChartCrosshair':
                return this.handleShowChartCrosshair(args as { x: number; y: number });

            case 'exportChart':
                return this.handleExportChart(args as { type: ExportType; fileName: string });

            case 'printChart':
                return this.handlePrintChart(args as { elementIds?: string | string[] });

            case 'updateChartDataSource':
                return this.handleUpdateChartDataSource(
                    args as { dataSource?: Object[]; series?: { index: number; dataSource: Object[] }[] }
                );

            case 'updateChartProperties':
                return this.handleUpdateChart(args as UpdateChartArgs);

            case 'updateChartSeries':
                return this.handleUpdateChartSeries(args as UpdateChartSeriesArgs);

            case 'updateChartPoint':
                return this.handleUpdateChartPoint(args as UpdateChartPointArgs);

            case 'appendChartData':
                return this.handleAppendChartData(args as AppendChartDataArgs);

            case 'removeChartPoints':
                return this.handleRemoveChartPoints(args as RemoveChartPointsArgs);

            case 'getChartPoint':
                return this.handleGetChartPoint(args as ChartPointArgs);

            case 'getSelectedChartData':
                return this.handleGetSelectedChartData();
            case 'getChartLegend':
                return this.handleGetChartLegend();
            case 'getChartAxes':
                return this.handleGetChartAxes();
            case 'getChartIndicators':
                return this.handleGetChartIndicators();
            case 'getChartStriplines':
                return this.handleGetChartStriplines(args as GetChartStriplinesArgs);

            case 'removeChartAxis':
                return this.handleRemoveChartAxis(args as RemoveChartAxisArgs);

            case 'getChartAnnotations':
                return this.handleGetChartAnnotations();

            case 'addChartAnnotation':
                return this.handleAddChartAnnotation(args as AddChartAnnotationArgs);

            case 'removeChartAnnotation':
                return this.handleRemoveChartAnnotation(args as RemoveChartAnnotationArgs);

            case 'toggleChartSeriesVisibility':
                return this.handleToggleChartSeriesVisibility(args as { seriesIndex: number; visible: boolean });

            case 'configureChartZoom':
                return this.handleConfigureChartZoom(args as ConfigureChartZoomArgs);

            case 'resetChartZoom':
                return this.handleResetChartZoom(args as ResetChartZoomArgs);

            case 'selectChartPoints':
                return this.handleSelectChartPoints(args as { indexes: IndexesModel[]; selectionMode?: string });

            case 'clearChartSelection':
                return this.handleClearChartSelection();

            case 'addChartAxis':
                return this.handleAddChartAxis(args as { axes: AxisModel[] });

            case 'updateChartAxis':
                return this.handleUpdateChartAxis(args as { axis: 'x' | 'y'; axisName?: string; properties: { [key: string]: any } });

            case 'updateChartTitle':
                return this.handleUpdateChartTitle(args as { title: string; subTitle?: string });

            case 'hideChartTooltip':
                return this.handleHideChartTooltip();

            case 'hideChartCrosshair':
                return this.handleHideChartCrosshair();

            case 'animateChart':
                return this.handleAnimateChart(args as { duration?: number; seriesIndexes?: number[] });

            default:
                return this.error(`Tool "${baseCommand}" not found.`);
            }
        } catch (error) {
            const message: string = error instanceof Error ? error.message : 'The operation failed.';
            return this.error(`Tool "${baseCommand}" failed: ${message}`);
        }
    }

    public destroy(): void {
        this.removeEventListener();

        if (this.webMcpAbortController) {
            this.webMcpAbortController.abort();
            this.webMcpAbortController = null;
        }

        this.parent = null as any;
    }

    public getModuleName(): string {
        return 'webMcpChart';
    }

    private message(data: Object): WebMcpToolResponse {
        return { content: [{ type: 'text', text: JSON.stringify(data) }] };
    }

    private error(text: string): WebMcpToolResponse {
        return {
            content: [{ type: 'text', text: JSON.stringify({ success: false, data: {}, message: text }) }],
            isError: true
        };
    }

    private buildConfirmationMessage(command: string, args: object): string {
        let details: string = '';

        try {
            details = JSON.stringify(args).substring(0, 300);
        } catch (error) {
            details = '[arguments unavailable]';
        }

        return `Confirm chart operation "${command}"${details ? ` with ${details}` : ''}`;
    }

    private async requestConfirmation(command: string, args: object, message: string): Promise<boolean> {
        if (typeof window === 'undefined' || typeof window.confirm !== 'function') {
            return false;
        }

        return window.confirm(message);
    }
    private handleInspectChart(args: { includeSeries?: boolean }): WebMcpToolResponse {
        const chart: Chart = this.getActiveChart();
        const includeSeries: boolean = args.includeSeries !== false;
        const series: Object[] = includeSeries
            ? chart.series.map((item: any, index: number): Object => ({
                index: isNullOrUndefined(item.index) ? index : item.index,
                name: item.name,
                type: item.type,
                visible: item.visible,
                xName: item.xName,
                yName: item.yName,
                pointCount: item.points ? item.points.length : 0
            }))
            : [];

        return this.success(
            {
                id: chart.element && chart.element.id,
                title: chart.title,
                subTitle: chart.subTitle,
                width: chart.width,
                height: chart.height,
                theme: chart.theme,
                enableCanvas: chart.enableCanvas,
                enableExport: chart.enableExport,
                allowExport: chart.allowExport,
                tooltipEnabled: chart.tooltip && chart.tooltip.enable,
                crosshairEnabled: chart.crosshair && chart.crosshair.enable,
                legendVisible: chart.legendSettings && chart.legendSettings.visible,
                highlightEnabled: chart.highlightMode !== 'None',
                highlightMode: chart.highlightMode,
                selectionMode: chart.selectionMode,
                selectedDataCount: chart.selectedDataIndexes ? chart.selectedDataIndexes.length : 0,
                indicatorCount: chart.indicators ? chart.indicators.length : 0,
                rangeColorSettingsCount: chart.rangeColorSettings ? chart.rangeColorSettings.length : 0,
                hasStriplines: this.hasChartStriplines(chart),
                zoomSettings: chart.zoomSettings
                    ? {
                        enableSelectionZooming: chart.zoomSettings.enableSelectionZooming,
                        enablePinchZooming: chart.zoomSettings.enablePinchZooming,
                        enableMouseWheelZooming: chart.zoomSettings.enableMouseWheelZooming,
                        enablePan: chart.zoomSettings.enablePan,
                        mode: chart.zoomSettings.mode
                    }
                    : null,
                primaryXAxis: this.serializeAxis(chart.primaryXAxis),
                primaryYAxis: this.serializeAxis(chart.primaryYAxis),
                secondaryAxisCount: chart.axes ? chart.axes.length : 0,
                series
            },
            'Chart snapshot retrieved successfully.'
        );
    }

    private handleGetSeriesData(args: { seriesIndex: number; maxPoints?: number; includeHiddenPoints?: boolean }): WebMcpToolResponse {
        const chart: Chart = this.getActiveChart();

        this.validateIndex(args.seriesIndex, chart.series.length, 'seriesIndex');

        const series: any = chart.series[args.seriesIndex];
        const maxPoints: number = isNullOrUndefined(args.maxPoints) ? 100 : (args.maxPoints as number);

        if (!this.isInteger(maxPoints) || maxPoints < 1 || maxPoints > 10000) {
            throw new Error('maxPoints must be an integer between 1 and 10000.');
        }

        const allPoints: any[] = series.points || [];
        const visiblePoints: any[] = args.includeHiddenPoints
            ? allPoints
            : allPoints.filter((point: any): boolean => point.visible !== false);

        const points: Object[] = visiblePoints.slice(0, maxPoints).map((point: any, index: number): Object => ({
            index: isNullOrUndefined(point.index) ? index : point.index,
            x: point.x,
            xValue: point.xValue,
            y: point.y,
            yValue: point.yValue,
            high: point.high,
            low: point.low,
            open: point.open,
            close: point.close,
            visible: point.visible
        }));

        return this.success(
            {
                seriesIndex: args.seriesIndex,
                name: series.name,
                type: series.type,
                visible: series.visible,
                totalPoints: visiblePoints.length,
                points,
                truncated: visiblePoints.length > points.length
            },
            'Series data retrieved successfully.'
        );
    }

    private handleAddChartSeries(args: { series: SeriesModel[] }): WebMcpToolResponse {
        this.validateObjectArray(args.series, 'series');

        const chart: Chart = this.getActiveChart();
        const addedCount: number = args.series.length;
        const response: WebMcpToolResponse = this.success(
            {
                addedCount,
                seriesCount: chart.series.length + addedCount
            },
            'Chart series added successfully.'
        );

        chart.addSeries(args.series);

        return response;
    }

    private handleRemoveChartSeries(args: { seriesIndex: number }): WebMcpToolResponse {
        const chart: Chart = this.getActiveChart();

        this.validateIndex(args.seriesIndex, chart.series.length, 'seriesIndex');

        const response: WebMcpToolResponse = this.success(
            {
                removedIndex: args.seriesIndex,
                seriesCount: chart.series.length - 1
            },
            'Chart series removed successfully.'
        );

        chart.removeSeries(args.seriesIndex);

        return response;
    }

    private handleClearChartSeries(): WebMcpToolResponse {
        const chart: Chart = this.getActiveChart();
        const clearedCount: number = chart.series.length;
        const response: WebMcpToolResponse = this.success(
            {
                clearedCount,
                seriesCount: 0,
                visibleSeriesCount: 0
            },
            'Chart series cleared successfully.'
        );

        chart.clearSeries();

        return response;
    }

    private getActiveChart(): Chart {
        if (!this.parent || this.parent.isDestroyed) {
            throw new Error('The chart instance is unavailable.');
        }

        return this.parent;
    }

    private handleUpdateChartAnnotation(args: { annotationIndex: number; content: string }): WebMcpToolResponse {
        const chart: Chart = this.getActiveChart();

        this.validateIndex(args.annotationIndex, chart.annotations.length, 'annotationIndex');

        if (typeof args.content !== 'string') {
            throw new Error('content must be a string.');
        }

        if (!chart.annotationModule) {
            throw new Error('The annotation module is not enabled.');
        }

        chart.setAnnotationValue(args.annotationIndex, SanitizeHtmlHelper.sanitize(args.content));

        return this.success(
            {
                annotationIndex: args.annotationIndex,
                contentUpdated: true
            },
            'Chart annotation updated successfully.'
        );
    }

    private handleShowChartTooltip(args: { x: number | string; y: number; isPoint?: boolean }): WebMcpToolResponse {
        const chart: Chart = this.getActiveChart();

        if (!chart.tooltipModule || !chart.markerRender) {
            throw new Error('The tooltip module is not enabled.');
        }

        this.validateFiniteNumber(args.y, 'y');

        if (!args.isPoint && typeof args.x !== 'number') {
            throw new Error('x must be a number when isPoint is false.');
        }

        if (typeof args.x === 'number') {
            this.validateFiniteNumber(args.x, 'x');
        }

        chart.showTooltip(args.x, args.y, args.isPoint === true);

        return this.success(
            {
                isPoint: args.isPoint === true,
                tooltipRequested: true
            },
            'Chart tooltip requested successfully.'
        );
    }

    private handleShowChartCrosshair(args: { x: number; y: number }): WebMcpToolResponse {
        const chart: Chart = this.getActiveChart();

        if (!chart.crosshairModule || !chart.chartAxisLayoutPanel) {
            throw new Error('The crosshair module is not enabled.');
        }

        this.validateFiniteNumber(args.x, 'x');
        this.validateFiniteNumber(args.y, 'y');
        chart.showCrosshair(args.x, args.y);

        return this.success(
            {
                x: args.x,
                y: args.y,
                crosshairRequested: true
            },
            'Chart crosshair requested successfully.'
        );
    }

    private handleExportChart(args: { type: ExportType; fileName: string }): WebMcpToolResponse {
        const chart: Chart = this.getActiveChart();

        if (!chart.exportModule || (!chart.enableExport && !chart.allowExport)) {
            throw new Error('The export module is not enabled.');
        }

        const supportedTypes: string[] = ['PNG', 'JPEG', 'SVG', 'PDF', 'XLSX', 'CSV'];

        if (supportedTypes.indexOf(args.type) === -1) {
            throw new Error('type must be PNG, JPEG, SVG, PDF, XLSX, or CSV.');
        }

        this.validateFileName(args.fileName);

        chart.export(args.type, args.fileName);

        return this.success(
            {
                type: args.type,
                fileName: args.fileName,
                exportRequested: true
            },
            'Chart export requested successfully.'
        );
    }

    private handlePrintChart(args: { elementIds?: string | string[] }): WebMcpToolResponse {
        const chart: Chart = this.getActiveChart();

        if (!isNullOrUndefined(args.elementIds)) {
            if (typeof args.elementIds !== 'string' && !Array.isArray(args.elementIds)) {
                throw new Error('elementIds must be a string or an array of strings.');
            }

            const ids: string[] = typeof args.elementIds === 'string' ? [args.elementIds] : args.elementIds;

            if (ids.some((id: string): boolean => typeof id !== 'string' || !id || id.length > 255)) {
                throw new Error('elementIds must contain non-empty strings of 255 characters or fewer.');
            }
        }

        chart.print(args.elementIds as string | string[]);

        return this.success({ printRequested: true }, 'Chart print requested successfully.');
    }

    private handleRefreshChartData(): WebMcpToolResponse {
        const chart: Chart = this.getActiveChart();

        chart.refreshLiveData();

        return this.success({ refreshed: true }, 'Chart data refreshed successfully.');
    }

    private handleUpdateChartDataSource(args: {
        dataSource?: Object[];
        series?: { index: number; dataSource: Object[] }[];
    }): WebMcpToolResponse {
        const chart: Chart = this.getActiveChart();
        const dataSource: Object[] | undefined = args.dataSource;

        if (isNullOrUndefined(dataSource) && !args.series) {
            throw new Error('dataSource or series must be provided.');
        }

        if (!isNullOrUndefined(dataSource)) {
            this.validateObjectArray(dataSource as Object[], 'dataSource', true);
        }

        if (args.series) {
            this.validateObjectArray(args.series as Object[], 'series');

            const indexes: number[] = [];

            for (const update of args.series) {
                this.validateIndex(update.index, chart.series.length, 'series index');

                if (indexes.indexOf(update.index) !== -1) {
                    throw new Error(`Series index ${update.index} is duplicated.`);
                }

                this.validateObjectArray(update.dataSource, `series.${update.index}.dataSource`, true);
                indexes.push(update.index);
            }
        }

        if (!isNullOrUndefined(dataSource)) {
            chart.dataSource = dataSource as Object[];
        }

        let updatedSeriesCount: number = 0;

        if (args.series) {
            for (const update of args.series) {
                chart.series[update.index].dataSource = update.dataSource;
                updatedSeriesCount++;
            }
        }

        chart.dataBind();

        return this.success(
            {
                recordCount: dataSource ? dataSource.length : 0,
                updatedSeriesCount
            },
            'Chart data source updated successfully.'
        );
    }

    private handleUpdateChart(args: UpdateChartArgs): WebMcpToolResponse {
        const chart: Chart = this.getActiveChart();
        this.validateProperties(args.properties, 'properties');
        const allowedProperties: string[] = [
            'title',
            'subTitle',
            'titleStyle',
            'subTitleStyle',
            'width',
            'height',
            'background',
            'backgroundImage',
            'theme',
            'margin',
            'border',
            'chartArea',
            'primaryXAxis',
            'primaryYAxis',
            'rows',
            'columns',
            'axes',
            'annotations',
            'tooltip',
            'crosshair',
            'legendSettings',
            'zoomSettings',
            'selectionMode',
            'highlightMode',
            'selectedDataIndexes',
            'isMultiSelect',
            'enableAnimation',
            'animationMode',
            'enableCanvas',
            'enableExport',
            'allowExport',
            'enableAutoIntervalOnBothAxis',
            'enableSideBySidePlacement',
            'enableRtl',
            'locale',
            'currencyCode',
            'useGroupingSeparator',
            'description',
            'tabIndex',
            'highlightColor',
            'highlightPattern',
            'selectionPattern',
            'indicators',
            'rangeColorSettings'
        ];
        const updatedProperties: string[] = this.validateAllowedProperties(args.properties, allowedProperties, 'Chart');
        const properties: { [key: string]: any } = this.cloneProperties(args.properties);
        if (!isNullOrUndefined(properties.title)) {
            this.validateString(properties.title, 'title', 500, true);
            properties.title = SanitizeHtmlHelper.sanitize(properties.title as string);
        }
        if (!isNullOrUndefined(properties.subTitle)) {
            this.validateString(properties.subTitle, 'subTitle', 500, true);
            properties.subTitle = SanitizeHtmlHelper.sanitize(properties.subTitle as string);
        }
        if (Array.isArray(properties.annotations)) {
            properties.annotations = properties.annotations.map((annotation: { [key: string]: any }): Object => {
                const copy: { [key: string]: any } = { ...annotation };
                if (typeof copy.content === 'string') {
                    copy.content = SanitizeHtmlHelper.sanitize(copy.content);
                }
                return copy;
            });
        }
        if (Array.isArray(properties.indicators)) {
            properties.indicators = properties.indicators.map((indicator: { [key: string]: any }): Object => {
                const copy: { [key: string]: any } = { ...indicator };
                if (typeof copy.seriesName === 'string') {
                    copy.seriesName = SanitizeHtmlHelper.sanitize(copy.seriesName);
                }
                return copy;
            });
        }
        const response: WebMcpToolResponse = this.success({ updatedProperties }, 'Chart configuration updated successfully.');
        chart.setProperties(properties, true);
        chart.refresh();
        return response;
    }
    private handleUpdateChartSeries(args: UpdateChartSeriesArgs): WebMcpToolResponse {
        const chart: Chart = this.getActiveChart();
        this.validateIndex(args.seriesIndex, chart.series.length, 'seriesIndex');
        this.validateProperties(args.properties, 'properties');
        const allowedProperties: string[] = [
            'type',
            'name',
            'dataSource',
            'xName',
            'yName',
            'high',
            'low',
            'open',
            'close',
            'volume',
            'size',
            'fill',
            'width',
            'opacity',
            'dashArray',
            'visible',
            'xAxisName',
            'yAxisName',
            'zOrder',
            'marker',
            'dataLabel',
            'animation',
            'border',
            'cornerRadius',
            'columnWidth',
            'columnSpacing',
            'emptyPointSettings',
            'errorBar',
            'trendlines',
            'tooltipMappingName',
            'pointColorMapping',
            'selectionStyle',
            'unSelectedStyle',
            'enableTooltip',
            'legendShape',
            'legendImageUrl',
            'minRadius',
            'maxRadius',
            'splineType',
            'cardinalSplineTension',
            'step',
            'binInterval',
            'showNormalDistribution',
            'connector',
            'neckWidth',
            'neckHeight',
            'gapRatio',
            'groupMode',
            'groupTo',
            'explode',
            'explodeIndex',
            'explodeOffset',
            'explodeAll',
            'startAngle',
            'endAngle',
            'radius',
            'innerRadius',
            'pyramidMode',
            'drawType'
        ];
        const updatedProperties: string[] = this.validateAllowedProperties(args.properties, allowedProperties, 'Series');
        const properties: { [key: string]: any } = this.cloneProperties(args.properties);
        if (!isNullOrUndefined(properties.name)) {
            this.validateString(properties.name, 'name', 500, true);
            properties.name = SanitizeHtmlHelper.sanitize(properties.name as string);
        }
        if (!isNullOrUndefined(properties.xAxisName)) {
            this.validateAxisName(properties.xAxisName as string, 'xAxisName', chart);
        }
        if (!isNullOrUndefined(properties.yAxisName)) {
            this.validateAxisName(properties.yAxisName as string, 'yAxisName', chart);
        }
        if (!isNullOrUndefined(properties.dataSource)) {
            this.validateObjectArray(properties.dataSource as Object[], 'dataSource', true);
        }
        const response: WebMcpToolResponse = this.success(
            {
                seriesIndex: args.seriesIndex,
                updatedProperties
            },
            'Chart series updated successfully.'
        );
        const series: SeriesModel = chart.series[args.seriesIndex];
        extend(series, properties, null, true);
        chart.refresh();
        return response;
    }
    private handleUpdateChartPoint(args: UpdateChartPointArgs): WebMcpToolResponse {
        const chart: Chart = this.getActiveChart();
        this.validateIndex(args.seriesIndex, chart.series.length, 'seriesIndex');
        this.validateProperties(args.properties, 'properties');
        const series: any = chart.series[args.seriesIndex];
        const dataSource: Object[] = this.getSeriesDataSource(series, chart);
        this.validateIndex(args.pointIndex, dataSource.length, 'pointIndex');
        const updatedProperties: string[] = Object.keys(args.properties);
        const currentRecord: { [key: string]: any } = dataSource[args.pointIndex] as { [key: string]: any };
        const properties: { [key: string]: any } = this.cloneProperties(args.properties);
        for (const key of updatedProperties) {
            this.validateSafePropertyName(key, 'Point');
            Object.defineProperty(currentRecord, key, {
                configurable: true,
                enumerable: true,
                writable: true,
                value: Object.prototype.hasOwnProperty.call(properties, key) ? properties[key as string] : undefined
            });
        }
        const response: WebMcpToolResponse = this.success(
            {
                seriesIndex: args.seriesIndex,
                pointIndex: args.pointIndex,
                updatedProperties
            },
            'Chart point updated successfully.'
        );
        series.dataSource = dataSource;
        chart.refresh();
        return response;
    }
    private handleAppendChartData(args: AppendChartDataArgs): WebMcpToolResponse {
        const chart: Chart = this.getActiveChart();
        this.validateIndex(args.seriesIndex, chart.series.length, 'seriesIndex');
        this.validateObjectArray(args.data, 'data');
        if (!isNullOrUndefined(args.maxPoints) && (!this.isInteger(args.maxPoints as number) || (args.maxPoints as number) < 1)) {
            throw new Error('maxPoints must be a positive integer.');
        }
        const series: any = chart.series[args.seriesIndex];
        const dataSource: Object[] = this.getSeriesDataSource(series, chart);
        const appendedData: Object[] = this.cloneProperties(args.data);
        dataSource.push(...appendedData);
        let removedCount: number = 0;
        if (!isNullOrUndefined(args.maxPoints) && dataSource.length > (args.maxPoints as number)) {
            removedCount = dataSource.length - (args.maxPoints as number);
            dataSource.splice(0, removedCount);
        }
        const response: WebMcpToolResponse = this.success(
            {
                seriesIndex: args.seriesIndex,
                appendedCount: appendedData.length,
                removedCount,
                totalPoints: dataSource.length
            },
            'Chart data appended successfully.'
        );
        series.dataSource = dataSource;
        chart.refresh();
        return response;
    }
    private handleRemoveChartPoints(args: RemoveChartPointsArgs): WebMcpToolResponse {
        const chart: Chart = this.getActiveChart();
        this.validateIndex(args.seriesIndex, chart.series.length, 'seriesIndex');
        const series: any = chart.series[args.seriesIndex];
        const dataSource: Object[] = this.getSeriesDataSource(series, chart);
        this.validateIndex(args.startIndex, dataSource.length, 'startIndex');
        if (!this.isInteger(args.count) || args.count < 1) {
            throw new Error('count must be a positive integer.');
        }
        const removedCount: number = Math.min(args.count, dataSource.length - args.startIndex);
        dataSource.splice(args.startIndex, removedCount);
        const response: WebMcpToolResponse = this.success(
            {
                seriesIndex: args.seriesIndex,
                startIndex: args.startIndex,
                removedCount,
                totalPoints: dataSource.length
            },
            'Chart points removed successfully.'
        );
        series.dataSource = dataSource;
        chart.refresh();
        return response;
    }
    private handleGetChartPoint(args: ChartPointArgs): WebMcpToolResponse {
        const chart: Chart = this.getActiveChart();
        this.validateIndex(args.seriesIndex, chart.series.length, 'seriesIndex');
        const series: any = chart.series[args.seriesIndex];
        const points: any[] = series.points || [];
        this.validateIndex(args.pointIndex, points.length, 'pointIndex');
        return this.success(
            {
                seriesIndex: args.seriesIndex,
                pointIndex: args.pointIndex,
                seriesName: series.name,
                seriesType: series.type,
                point: this.serializePoint(points[args.pointIndex])
            },
            'Chart point retrieved successfully.'
        );
    }

    private handleGetSelectedChartData(): WebMcpToolResponse {
        const chart: Chart = this.getActiveChart();
        const selectedPoints: Object[] = [];
        for (const index of chart.selectedDataIndexes as any[]) {
            if (!this.isInteger(index.series) || !this.isInteger(index.point) || index.series < 0 || index.point < 0) {
                continue;
            }
            if (index.series >= chart.series.length) {
                continue;
            }
            const series: any = chart.series[index.series];
            const points: any[] = series.points || [];
            if (index.point >= points.length) {
                continue;
            }
            selectedPoints.push({
                seriesIndex: index.series,
                pointIndex: index.point,
                seriesName: series.name,
                seriesType: series.type,
                point: this.serializePoint(points[index.point])
            });
        }
        return this.success({ selectedCount: selectedPoints.length, selectedPoints }, 'Selected chart data retrieved successfully.');
    }
    private handleGetChartLegend(): WebMcpToolResponse {
        const chart: Chart = this.getActiveChart();
        const legendModule: any = chart.legendModule;
        const legendCollections: any[] =
            legendModule && Array.isArray(legendModule.legendCollections) ? legendModule.legendCollections : [];
        const items: Object[] = legendCollections.map((item: any, index: number): Object => ({
            index,
            text: item.text,
            fill: item.fill,
            shape: item.shape,
            visible: item.visible,
            seriesIndex: item.seriesIndex,
            pointIndex: item.pointIndex
        }));
        return this.success(
            {
                visible: chart.legendSettings.visible,
                position: chart.legendSettings.position,
                alignment: chart.legendSettings.alignment,
                title: chart.legendSettings.title,
                itemCount: items.length,
                items
            },
            'Chart legend retrieved successfully.'
        );
    }
    private handleGetChartLocalization(args: GetChartLocalizationArgs): WebMcpToolResponse {
        const chart: Chart = this.getActiveChart();
        this.validateString(args.key, 'key', 255);
        return this.success(
            { key: args.key, value: chart.getLocalizedLabel(args.key) },
            'Chart localization label retrieved successfully.'
        );
    }
    private handleGetChartAxes(): WebMcpToolResponse {
        const chart: Chart = this.getActiveChart();
        const primaryXAxis: Object = { isSecondary: false, ...(this.serializeAxis(chart.primaryXAxis) as Object) };
        const primaryYAxis: Object = { isSecondary: false, ...(this.serializeAxis(chart.primaryYAxis) as Object) };
        const secondaryAxes: Object[] = chart.axes.map((axis: AxisModel, index: number): Object => ({
            index,
            isSecondary: true,
            ...this.serializeAxis(axis)
        }));
        return this.success({ primaryXAxis, primaryYAxis, secondaryAxes }, 'Chart axes retrieved successfully.');
    }
    private handleGetChartIndicators(): WebMcpToolResponse {
        const chart: Chart = this.getActiveChart();
        const indicators: Object[] = (chart.indicators || []).map((indicator: any, index: number): Object => ({
            index,
            type: indicator.type,
            seriesName: indicator.seriesName,
            xName: indicator.xName,
            open: indicator.open,
            high: indicator.high,
            low: indicator.low,
            close: indicator.close,
            volume: indicator.volume,
            period: indicator.period,
            field: indicator.field,
            fastPeriod: indicator.fastPeriod,
            slowPeriod: indicator.slowPeriod,
            macdType: indicator.macdType,
            standardDeviation: indicator.standardDeviation,
            overBought: indicator.overBought,
            overSold: indicator.overSold,
            visible: indicator.visible,
            xAxisName: indicator.xAxisName,
            yAxisName: indicator.yAxisName,
            fill: indicator.fill,
            width: indicator.width,
            dashArray: indicator.dashArray
        }));
        return this.success({ indicatorCount: indicators.length, indicators }, 'Chart indicators retrieved successfully.');
    }
    private handleGetChartStriplines(args: GetChartStriplinesArgs): WebMcpToolResponse {
        const chart: Chart = this.getActiveChart();
        const axes: { name: string; axis: any }[] = [];
        if (!isNullOrUndefined(args.axisName)) {
            this.validateString(args.axisName as string, 'axisName', 255);
            const axis: any = this.getAxisByName(chart, args.axisName as string);
            axes.push({ name: args.axisName as string, axis });
        } else {
            axes.push({ name: 'primaryXAxis', axis: chart.primaryXAxis });
            axes.push({ name: 'primaryYAxis', axis: chart.primaryYAxis });
            for (let index: number = 0; index < chart.axes.length; index++) {
                axes.push({ name: chart.axes[index as number].name || `secondaryAxis${index}`, axis: chart.axes[index as number] });
            }
        }
        const striplineAxes: Object[] = [];
        let striplineCount: number = 0;
        for (const axisEntry of axes) {
            const stripLines: any[] = axisEntry.axis && Array.isArray(axisEntry.axis.stripLines) ? axisEntry.axis.stripLines : [];
            const striplines: Object[] = stripLines.map((stripline: any, index: number): Object =>
                this.serializeStripline(stripline, index)
            );
            striplineCount += striplines.length;
            striplineAxes.push({ axisName: axisEntry.name, striplineCount: striplines.length, striplines });
        }
        return this.success({ striplineCount, axes: striplineAxes }, 'Chart striplines retrieved successfully.');
    }
    private handleRemoveChartAxis(args: RemoveChartAxisArgs): WebMcpToolResponse {
        const chart: Chart = this.getActiveChart();
        const hasAxisName: boolean = !isNullOrUndefined(args.axisName);
        const hasAxisIndex: boolean = !isNullOrUndefined(args.axisIndex);
        if (hasAxisName === hasAxisIndex) {
            throw new Error('Provide exactly one of axisName or axisIndex.');
        }
        let axisIndex: number;
        if (hasAxisName) {
            this.validateString(args.axisName as string, 'axisName', 255);
            axisIndex = -1;

            for (let index: number = 0; index < chart.axes.length; index++) {
                if (chart.axes[index as number].name === args.axisName) {
                    axisIndex = index;
                    break;
                }
            }
            if (axisIndex === -1) {
                throw new Error(`Axis "${args.axisName}" was not found.`);
            }
        } else {
            this.validateIndex(args.axisIndex as number, chart.axes.length, 'axisIndex');
            axisIndex = args.axisIndex as number;
        }
        const targetAxis: AxisModel = chart.axes.slice(axisIndex, axisIndex + 1)[0];
        const axisName: string = targetAxis.name;
        const resetBindings: boolean = args.resetSeriesBindings !== false;
        const affectedSeriesIndexes: number[] = [];
        chart.series.forEach((series: any, index: number): void => {
            const usesXAxis: boolean = series.xAxisName === axisName;
            const usesYAxis: boolean = series.yAxisName === axisName;
            if (!usesXAxis && !usesYAxis) {
                return;
            }
            if (!resetBindings) {
                throw new Error(`Axis "${axisName}" is used by series index ${index}.`);
            }
            if (usesXAxis) {
                series.xAxisName = '';
            }
            if (usesYAxis) {
                series.yAxisName = '';
            }
            affectedSeriesIndexes.push(index);
        });
        const response: WebMcpToolResponse = this.success(
            { removedAxisName: axisName, removedAxisIndex: axisIndex, affectedSeriesIndexes, axisCount: chart.axes.length - 1 },
            'Chart axis removed successfully.'
        );
        chart.axes.splice(axisIndex, 1);
        chart.refresh();
        return response;
    }
    private handleGetChartAnnotations(): WebMcpToolResponse {
        const chart: Chart = this.getActiveChart();
        const annotations: Object[] = chart.annotations.map((annotation: any, index: number): Object => ({
            index,
            ...this.serializeAnnotation(annotation)
        }));
        return this.success({ annotationCount: annotations.length, annotations }, 'Chart annotations retrieved successfully.');
    }
    private handleAddChartAnnotation(args: AddChartAnnotationArgs): WebMcpToolResponse {
        const chart: Chart = this.getActiveChart();
        this.validateObjectArray(args.annotations, 'annotations');
        const annotations: Object[] = this.cloneProperties(args.annotations);
        for (const annotation of annotations as { [key: string]: any }[]) {
            if (typeof annotation.content === 'string') {
                annotation.content = SanitizeHtmlHelper.sanitize(annotation.content);
            }
        }
        const existingAnnotations: Object[] = chart.annotations.map((annotation: any): Object => this.serializeAnnotation(annotation));
        const response: WebMcpToolResponse = this.success(
            {
                addedCount: annotations.length,
                annotationCount: existingAnnotations.length + annotations.length
            },
            'Chart annotations added successfully.'
        );
        chart.setProperties({ annotations: [...existingAnnotations, ...annotations] }, true);
        chart.refresh();
        return response;
    }
    private handleRemoveChartAnnotation(args: RemoveChartAnnotationArgs): WebMcpToolResponse {
        const chart: Chart = this.getActiveChart();
        this.validateIndex(args.annotationIndex, chart.annotations.length, 'annotationIndex');
        const annotations: Object[] = chart.annotations.map((annotation: any): Object => this.serializeAnnotation(annotation));
        annotations.splice(args.annotationIndex, 1);
        const response: WebMcpToolResponse = this.success(
            {
                removedIndex: args.annotationIndex,
                annotationCount: annotations.length
            },
            'Chart annotation removed successfully.'
        );
        chart.setProperties({ annotations }, true);
        chart.refresh();
        return response;
    }
    private handleToggleChartSeriesVisibility(args: { seriesIndex: number; visible: boolean }): WebMcpToolResponse {
        const chart: Chart = this.getActiveChart();

        this.validateIndex(args.seriesIndex, chart.series.length, 'seriesIndex');

        if (typeof args.visible !== 'boolean') {
            throw new Error('visible must be a boolean.');
        }

        chart.series[args.seriesIndex].visible = args.visible;
        chart.dataBind();

        return this.success(
            {
                seriesIndex: args.seriesIndex,
                visible: args.visible
            },
            'Series visibility updated successfully.'
        );
    }

    private handleConfigureChartZoom(args: ConfigureChartZoomArgs): WebMcpToolResponse {
        const chart: Chart = this.getActiveChart();
        if (args.axis !== 'x' && args.axis !== 'y') {
            throw new Error('axis must be x or y.');
        }
        this.validateRange(args.zoomFactor, 'zoomFactor');
        this.validateRange(args.zoomPosition, 'zoomPosition');
        const axis: any = this.getZoomAxis(chart, args.axis, args.axisName);
        axis.zoomFactor = args.zoomFactor;
        axis.zoomPosition = args.zoomPosition;
        chart.dataBind();
        return this.success(
            {
                axis: args.axis,
                axisName: args.axisName || (args.axis === 'x' ? 'primaryXAxis' : 'primaryYAxis'),
                zoomFactor: args.zoomFactor,
                zoomPosition: args.zoomPosition
            },
            'Chart zoom updated successfully.'
        );
    }
    private handleResetChartZoom(args: ResetChartZoomArgs): WebMcpToolResponse {
        const chart: Chart = this.getActiveChart();
        const resetAxisNames: string[] = [];
        if (!isNullOrUndefined(args.axis) && args.axis !== 'x' && args.axis !== 'y') {
            throw new Error('axis must be x or y.');
        }
        if (!isNullOrUndefined(args.axisName)) {
            const axis: any = this.getZoomAxis(chart, args.axis || 'x', args.axisName);
            axis.zoomFactor = 1;
            axis.zoomPosition = 0;
            resetAxisNames.push(args.axisName as string);
        } else if (args.axis) {
            const axis: any = this.getZoomAxis(chart, args.axis);
            axis.zoomFactor = 1;
            axis.zoomPosition = 0;
            resetAxisNames.push(args.axis === 'x' ? 'primaryXAxis' : 'primaryYAxis');
        } else {
            const axes: any[] = [chart.primaryXAxis, chart.primaryYAxis, ...chart.axes];
            for (let index: number = 0; index < axes.length; index++) {
                axes[index as number].zoomFactor = 1;
                axes[index as number].zoomPosition = 0;
                resetAxisNames.push(
                    index === 0 ? 'primaryXAxis' : index === 1 ? 'primaryYAxis' : axes[index as number].name || `secondaryAxis${index - 2}`
                );
            }
        }
        chart.dataBind();
        return this.success({ resetAxisNames, resetCount: resetAxisNames.length }, 'Chart zoom reset successfully.');
    }
    private handleSelectChartPoints(args: { indexes: IndexesModel[]; selectionMode?: string }): WebMcpToolResponse {
        const chart: Chart = this.getActiveChart();

        this.validateObjectArray(args.indexes, 'indexes');

        const validModes: string[] = ['Point', 'Series', 'Cluster'];

        if (args.selectionMode && validModes.indexOf(args.selectionMode) === -1) {
            throw new Error('selectionMode must be Point, Series, or Cluster.');
        }

        for (const item of args.indexes as any[]) {
            if (!this.isInteger(item.series) || !this.isInteger(item.point) || item.series < 0 || item.point < 0) {
                throw new Error('Each selection index must contain non-negative integer series and point values.');
            }

            this.validateIndex(item.series, chart.series.length, 'selection series index');

            const points: any[] = (chart.series[item.series] as any).points || [];
            this.validateIndex(item.point, points.length, 'selection point index');
        }

        if (args.selectionMode) {
            chart.selectionMode = args.selectionMode as any;
        }

        chart.selectedDataIndexes = args.indexes;
        chart.dataBind();

        return this.success({ selectedCount: args.indexes.length }, 'Chart points selected successfully.');
    }

    private handleClearChartSelection(): WebMcpToolResponse {
        const chart: Chart = this.getActiveChart();
        const clearedCount: number = chart.selectedDataIndexes ? chart.selectedDataIndexes.length : 0;
        chart.selectedDataIndexes = [];
        chart.dataBind();
        return this.success({ clearedCount, selectedCount: 0 }, 'Chart selection cleared successfully.');
    }

    private handleAddChartAxis(args: { axes: AxisModel[] }): WebMcpToolResponse {
        this.validateObjectArray(args.axes, 'axes');
        const chart: Chart = this.getActiveChart();
        const existingAxisNames: string[] = chart.axes
            .map((axis: AxisModel): string => axis.name)
            .filter((name: string): boolean => !!name);
        const newAxisNames: string[] = [];
        for (const axisModel of args.axes) {
            if (typeof axisModel.name !== 'string' || !axisModel.name.trim()) {
                throw new Error('Each secondary axis must have a non-empty name.');
            }
            if (existingAxisNames.indexOf(axisModel.name) !== -1 || newAxisNames.indexOf(axisModel.name) !== -1) {
                throw new Error(`Axis "${axisModel.name}" already exists.`);
            }
            newAxisNames.push(axisModel.name);
        }
        const response: WebMcpToolResponse = this.success(
            {
                addedCount: args.axes.length,
                axisCount: chart.axes.length + args.axes.length,
                addedAxisNames: newAxisNames
            },
            'Chart axes added successfully.'
        );
        chart.addAxes(args.axes);
        return response;
    }
    private handleUpdateChartAxis(args: { axis: 'x' | 'y'; axisName?: string; properties: { [key: string]: any } }): WebMcpToolResponse {
        if (args.axis !== 'x' && args.axis !== 'y') {
            throw new Error('axis must be x or y.');
        }

        if (!args.properties || typeof args.properties !== 'object' || Array.isArray(args.properties)) {
            throw new Error('properties must be an object.');
        }

        const chart: Chart = this.getActiveChart();
        const targetAxis: any = args.axisName
            ? chart.axes.filter((axis: AxisModel): boolean => axis.name === args.axisName)[0]
            : args.axis === 'x'
                ? chart.primaryXAxis
                : chart.primaryYAxis;
        const axisName: string = args.axisName || (args.axis === 'x' ? 'primaryXAxis' : 'primaryYAxis');

        if (!targetAxis) {
            throw new Error(`Axis "${axisName}" was not found.`);
        }

        const allowedProperties: string[] = [
            'title',
            'minimum',
            'maximum',
            'interval',
            'opposedPosition',
            'isInversed',
            'labelIntersectAction',
            'labelRotation',
            'edgeLabelPlacement',
            'majorGridLines',
            'minorGridLines',
            'lineStyle',
            'plotOffset',
            'rowIndex',
            'columnIndex',
            'span',
            'labelPlacement',
            'valueType',
            'crossesAt',
            'labelFormat',
            'visible'
        ];
        const updatedProperties: string[] = [];

        for (const key of Object.keys(args.properties)) {
            this.validateSafePropertyName(key, 'Axis');
            if (allowedProperties.indexOf(key) === -1) {
                throw new Error(`Axis property "${key}" is not supported.`);
            }

            Object.defineProperty(targetAxis, key, {
                configurable: true,
                enumerable: true,
                writable: true,
                value: Object.prototype.hasOwnProperty.call(args.properties, key) ? args.properties[key as string] : undefined
            });
            updatedProperties.push(key);
        }

        const response: WebMcpToolResponse = this.success(
            {
                axis: args.axis,
                axisName,
                updatedProperties
            },
            'Chart axis updated successfully.'
        );

        chart.refresh();

        return response;
    }

    private handleUpdateChartTitle(args: { title: string; subTitle?: string }): WebMcpToolResponse {
        const chart: Chart = this.getActiveChart();

        if (typeof args.title !== 'string' || args.title.length > 500) {
            throw new Error('title must be a string of 500 characters or fewer.');
        }

        if (!isNullOrUndefined(args.subTitle) && (typeof args.subTitle !== 'string' || args.subTitle.length > 500)) {
            throw new Error('subTitle must be a string of 500 characters or fewer.');
        }

        chart.title = SanitizeHtmlHelper.sanitize(args.title);

        if (!isNullOrUndefined(args.subTitle)) {
            chart.subTitle = SanitizeHtmlHelper.sanitize(args.subTitle as string);
        }

        chart.dataBind();

        return this.success(
            {
                title: chart.title,
                subTitle: chart.subTitle
            },
            'Chart title updated successfully.'
        );
    }

    private handleHideChartTooltip(): WebMcpToolResponse {
        const chart: Chart = this.getActiveChart();

        if (!chart.tooltipModule) {
            throw new Error('The tooltip module is not enabled.');
        }

        chart.hideTooltip();

        return this.success({ hidden: true }, 'Chart tooltip hidden successfully.');
    }

    private handleHideChartCrosshair(): WebMcpToolResponse {
        const chart: Chart = this.getActiveChart();

        if (!chart.crosshairModule) {
            throw new Error('The crosshair module is not enabled.');
        }

        chart.hideCrosshair();

        return this.success({ hidden: true }, 'Chart crosshair hidden successfully.');
    }

    private handleGetChartPersistedState(): WebMcpToolResponse {
        const chart: Chart = this.getActiveChart();

        return this.success({ persistedState: chart.getPersistData() }, 'Persisted chart state retrieved successfully.');
    }

    private handleRefreshChartSize(): WebMcpToolResponse {
        const chart: Chart = this.getActiveChart();
        chart.chartResize();
        return this.success(
            { resized: true, width: chart.availableSize.width, height: chart.availableSize.height },
            'Chart size refreshed successfully.'
        );
    }
    private handleAnimateChart(args: { duration?: number; seriesIndexes?: number[] }): WebMcpToolResponse {
        const chart: Chart = this.getActiveChart();
        const duration: number | undefined = args.duration;
        const seriesIndexes: number[] | undefined = args.seriesIndexes;

        if (typeof duration === 'number' && (!this.isInteger(duration) || duration < 0 || duration > 60000)) {
            throw new Error('duration must be an integer between 0 and 60000.');
        }

        if (!isNullOrUndefined(seriesIndexes)) {
            if (!Array.isArray(seriesIndexes)) {
                throw new Error('seriesIndexes must be an array.');
            }
            for (const index of seriesIndexes) {
                if (!this.isInteger(index) || index < 0) {
                    throw new Error('Each seriesIndex must be a non-negative integer.');
                }
                if (index >= chart.series.length) {
                    throw new Error(`Series index ${index} is out of range.`);
                }
            }
            for (const seriesIndex of seriesIndexes) {
                const series: any = chart.series[seriesIndex as number];
                if (series) {
                    series.animationDuration = isNullOrUndefined(duration) ? 1000 : duration;
                }
            }
            chart.refresh();
        } else {
            chart.animate(duration);
        }

        const animatedSeriesCount: number = seriesIndexes ? seriesIndexes.length : chart.series.length;

        return this.success(
            {
                duration: isNullOrUndefined(duration) ? 1000 : duration,
                animatedSeriesCount,
                animatedAll: isNullOrUndefined(seriesIndexes),
                seriesIndexes: seriesIndexes || 'all'
            },
            'Chart animation replayed successfully.'
        );
    }

    private getZoomAxis(chart: Chart, axis: 'x' | 'y', axisName?: string): any {
        if (!isNullOrUndefined(axisName)) {
            this.validateString(axisName as string, 'axisName', 255);
            return this.getAxisByName(chart, axisName as string);
        }
        return axis === 'x' ? chart.primaryXAxis : chart.primaryYAxis;
    }

    private getAxisByName(chart: Chart, axisName: string): any {
        if (axisName === 'primaryXAxis') {
            return chart.primaryXAxis;
        }
        if (axisName === 'primaryYAxis') {
            return chart.primaryYAxis;
        }
        for (let index: number = 0; index < chart.axes.length; index++) {
            if (chart.axes[index as number].name === axisName) {
                return chart.axes[index as number];
            }
        }
        throw new Error(`Axis "${axisName}" was not found.`);
    }

    private hasChartStriplines(chart: Chart): boolean {
        const axes: any[] = [chart.primaryXAxis, chart.primaryYAxis, ...chart.axes];
        return axes.some((axis: any): boolean => !!(axis && axis.stripLines && axis.stripLines.length));
    }

    private serializeStripline(stripline: any, index: number): Object {
        return {
            index,
            start: stripline.start,
            end: stripline.end,
            size: stripline.size,
            isRepeat: stripline.isRepeat,
            repeatEvery: stripline.repeatEvery,
            repeatUntil: stripline.repeatUntil,
            color: stripline.color,
            opacity: stripline.opacity,
            visible: stripline.visible,
            text: stripline.text,
            rotation: stripline.rotation,
            horizontalAlignment: stripline.horizontalAlignment,
            verticalAlignment: stripline.verticalAlignment,
            startFromAxis: stripline.startFromAxis,
            zIndex: stripline.zIndex
        };
    }

    private serializeRange(range: any): Object | null {
        if (!range) {
            return null;
        }
        return { min: range.min, max: range.max, interval: range.interval, delta: range.delta };
    }
    private serializeAxis(axis: any): Object | null {
        if (!axis) {
            return null;
        }

        return {
            name: axis.name,
            valueType: axis.valueType,
            title: axis.title,
            minimum: axis.minimum,
            maximum: axis.maximum,
            interval: axis.interval,
            zoomFactor: axis.zoomFactor,
            zoomPosition: axis.zoomPosition,
            isInversed: axis.isInversed,
            opposedPosition: axis.opposedPosition,
            visible: axis.visible,
            actualRange: this.serializeRange(axis.actualRange),
            visibleRange: this.serializeRange(axis.visibleRange)
        };
    }

    private success(data: any, message: string): WebMcpToolResponse {
        return this.message({ success: true, data, message });
    }

    private validateIndex(value: number, length: number, name: string): void {
        if (!this.isInteger(value) || value < 0 || value >= length) {
            throw new Error(`${name} must be an integer between 0 and ${Math.max(length - 1, 0)}.`);
        }
    }

    private validateFiniteNumber(value: number, name: string): void {
        if (typeof value !== 'number' || !isFinite(value)) {
            throw new Error(`${name} must be a finite number.`);
        }
    }

    private isInteger(value: number): boolean {
        return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
    }

    private validateRange(value: number, name: string): void {
        this.validateFiniteNumber(value, name);

        if (value < 0 || value > 1) {
            throw new Error(`${name} must be between 0 and 1.`);
        }
    }

    private validateObjectArray(value: Object[], name: string, allowEmpty: boolean = false): void {
        const hasInvalidItem: boolean =
            Array.isArray(value) && value.some((item: Object): boolean => !item || typeof item !== 'object' || Array.isArray(item));

        if (!Array.isArray(value) || (!allowEmpty && value.length === 0) || hasInvalidItem) {
            throw new Error(`${name} must be an array of objects${allowEmpty ? '' : ' with at least one item'}.`);
        }
    }

    private validateProperties(properties: { [key: string]: any }, name: string): void {
        if (!properties || typeof properties !== 'object' || Array.isArray(properties)) {
            throw new Error(`${name} must be an object.`);
        }
        if (Object.keys(properties).length === 0) {
            throw new Error(`${name} must contain at least one property.`);
        }
    }
    private validateAllowedProperties(properties: { [key: string]: any }, allowedProperties: string[], target: string): string[] {
        const propertyNames: string[] = Object.keys(properties);
        for (const propertyName of propertyNames) {
            this.validateSafePropertyName(propertyName, target);
            if (allowedProperties.indexOf(propertyName) === -1) {
                throw new Error(`${target} property "${propertyName}" is not supported.`);
            }
        }
        return propertyNames;
    }
    private validateSafePropertyName(propertyName: string, target: string): void {
        if (propertyName === '__proto__' || propertyName === 'prototype' || propertyName === 'constructor') {
            throw new Error(`${target} property "${propertyName}" is not allowed.`);
        }
    }
    private validateSafeObject(value: any, target: string): void {
        if (!value || typeof value !== 'object') {
            return;
        }
        Object.keys(value).forEach((propertyName: string): void => {
            this.validateSafePropertyName(propertyName, target);
            const propertyValue: any = Object.prototype.hasOwnProperty.call(value, propertyName)
                ? value[propertyName as string]
                : undefined;
            if (propertyValue && typeof propertyValue === 'object') {
                this.validateSafeObject(propertyValue, target);
            }
        });
    }
    private cloneProperties<T>(properties: T): T {
        this.validateSafeObject(properties, 'Input');
        try {
            return JSON.parse(JSON.stringify(properties)) as T;
        } catch (error) {
            throw new Error('The supplied value must contain only JSON-serializable data.');
        }
    }
    private validateString(value: string, name: string, maximumLength: number, allowEmpty: boolean = false): void {
        if (typeof value !== 'string' || (!allowEmpty && !value.trim()) || value.length > maximumLength) {
            throw new Error(`${name} must be a ${allowEmpty ? '' : 'non-empty '}string of ${maximumLength} characters or fewer.`);
        }
    }
    private validateAxisName(axisName: string, propertyName: string, chart: Chart): void {
        if (typeof axisName !== 'string') {
            throw new Error(`${propertyName} must be a string.`);
        }
        if (!axisName) {
            return;
        }
        if (!chart.axes.some((axis: AxisModel): boolean => axis.name === axisName)) {
            throw new Error(`Axis "${axisName}" was not found.`);
        }
    }
    private getSeriesDataSource(series: any, chart: Chart): Object[] {
        const seriesSource: Object[] = series.dataSource as Object[];
        const chartSource: Object[] = chart.dataSource as Object[];
        const source: Object[] = Array.isArray(seriesSource) && seriesSource.length ? seriesSource : chartSource;
        if (!Array.isArray(source)) {
            throw new Error('The selected series does not use an array data source.');
        }
        return this.cloneProperties(source);
    }
    private serializePoint(point: any): Object {
        return {
            index: point.index,
            x: point.x,
            xValue: point.xValue,
            y: point.y,
            yValue: point.yValue,
            high: point.high,
            low: point.low,
            open: point.open,
            close: point.close,
            volume: point.volume,
            size: point.size,
            color: point.color,
            visible: point.visible
        };
    }
    private serializeAnnotation(annotation: any): Object {
        return {
            content: annotation.content,
            x: annotation.x,
            y: annotation.y,
            coordinateUnits: annotation.coordinateUnits,
            region: annotation.region,
            horizontalAlignment: annotation.horizontalAlignment,
            verticalAlignment: annotation.verticalAlignment,
            description: annotation.description
        };
    }
    private validateFileName(fileName: string): void {
        if (
            typeof fileName !== 'string' ||
            !fileName ||
            fileName.length > 255 ||
            /[\\/\0\r\n]/.test(fileName) ||
            fileName === '.' ||
            fileName === '..'
        ) {
            throw new Error('fileName must be a safe file name without path separators or control characters.');
        }
    }
}

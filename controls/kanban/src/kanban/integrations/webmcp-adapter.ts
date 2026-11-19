/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kanban } from '../base/kanban';
import { WebMcpTool } from '../base/interface';

/**
 * WebMCP Adapter for Kanban component
 * Provides tools that allow AI agents to interact with the Kanban board
 */
export class WebMcpAdapter {
    private parent: Kanban;
    private registeredTools: WebMcpTool[] = [];
    private registrationTimer: number;
    private registrationController: AbortController;

    constructor(parent: Kanban) {
        this.parent = parent;
        this.registrationController = typeof AbortController !== 'undefined' ? new AbortController() : undefined;
        this.bindEvents();
        this.registerAutomatically();
    }

    /**
     * Returns the injected module name used by the EJ2 module loader.
     *
     * @returns {string} Module name.
     */
    public getModuleName(): string {
        return 'WebMcpAdapter';
    }

    private registerAutomatically(attempt: number = 0): void {
        if (this.getModelContext()) {
            this.parent.notify('registerWebMcpTools', { prefix: '', tools: [], exposedTo: [] });
            return;
        }
        if (attempt < 100 && typeof window !== 'undefined') {
            this.registrationTimer = window.setTimeout(() => this.registerAutomatically(attempt + 1), 100);
        }
    }

    private getModelContext(): any {
        if (typeof window !== 'undefined' && (window.navigator as any).modelContext) {
            return (window.navigator as any).modelContext;
        }
        if (typeof document !== 'undefined') {
            return (document as any).modelContext;
        }
        return undefined;
    }

    private bindEvents(): void {
        this.parent.on('getWebMcpTools', this.getWebMcpTools, this);
        this.parent.on('registerWebMcpTools', this.registerWebMcpTools, this);
    }

    private getWebMcpTools(args: { toolNames?: string[], tools?: WebMcpTool[] }): void {
        const availableTools: WebMcpTool[] = this.getAvailableTools();
        if (args.toolNames && args.toolNames.length > 0) {
            const toolNames: string[] = args.toolNames;
            args.tools = availableTools.filter((tool: WebMcpTool) => toolNames.indexOf(tool.name) !== -1);        } else {
            args.tools = availableTools;
        }
        args.tools = this.filterConfiguredTools(args.tools);
    }

    private filterConfiguredTools(tools: WebMcpTool[]): WebMcpTool[] {
        const settings: { tools?: string[] | WebMcpTool[] } = this.parent.webMcpSettings;
        const configuredTools: string[] | WebMcpTool[] = settings && settings.tools;
        if (!configuredTools || configuredTools.length === 0 || typeof configuredTools[0] !== 'string') {
            return tools;
        }
        const toolNames: string[] = configuredTools as string[];
        if (!toolNames || toolNames.length === 0) {
            return tools;
        }
        return tools.filter((tool: WebMcpTool) => toolNames.indexOf(tool.name) !== -1);
    }

    private registerWebMcpTools(args: {
        prefix?: string,
        tools?: string[] | WebMcpTool[],
        exposedTo?: string[]
    }): void {
        // Check if WebMCP is available
        const modelContext: any = this.getModelContext();
        if (!modelContext) {
            console.warn('WebMCP is not available in this environment');
            return;
        }

        const settings: any = this.parent.webMcpSettings;
        if (args.tools === undefined && settings && settings.tools) {
            args.tools = settings.tools;
        }
        if (args.exposedTo === undefined && settings && settings.exposedTo) {
            args.exposedTo = settings.exposedTo;
        }

        // Determine prefix
        let prefix: string = '';
        if (args.prefix === undefined && this.parent.element.id) {
            prefix = (settings && settings.name ? settings.name : this.parent.element.id) + '_';
        } else if (args.prefix) {
            prefix = args.prefix + '_';
        }

        // Get tools to register
        let toolsToRegister: WebMcpTool[] = [];
        if (Array.isArray(args.tools)) {
            if (args.tools.length === 0 || typeof args.tools[0] === 'string') {
                // String array - filter by tool names
                const toolNames: string[] = args.tools as string[];
                const availableTools: WebMcpTool[] = this.getAvailableTools();
                if (toolNames.length === 0) {
                    toolsToRegister = availableTools;
                } else {
                    toolsToRegister = availableTools.filter((tool: WebMcpTool) =>
                        toolNames.length === 0 || toolNames.indexOf(tool.name) !== -1
                    );
                }
            } else {
                // WebMcpTool array - use as-is
                toolsToRegister = args.tools as WebMcpTool[];
            }
        } else {
            // No tools specified - register all available tools
            toolsToRegister = this.getAvailableTools();
        }
        toolsToRegister = this.filterConfiguredTools(toolsToRegister);

        // Register each tool with the WebMCP context
        toolsToRegister.forEach((tool: WebMcpTool): void => {
            const toolName: string = prefix + tool.name;

            const registrationResult: any = modelContext.registerTool({
                name: toolName,
                title: tool.title,
                description: tool.description,
                inputSchema: tool.inputSchema,
                execute: function(input: Record<string, any>): Promise<any> {
                    return new Promise(function(resolve: (value: any) => void, reject: (reason?: any) => void): void {
                        try {
                            // Execute the tool
                            const result: Promise<any> | any = tool.execute(input);
                            // Handle both Promise and synchronous results
                            if (result && typeof result.then === 'function') {
                                result.then(resolve).catch(reject);
                            } else {
                                resolve(result);
                            }
                        } catch (error) {
                            reject(error);
                        }
                    });
                },
                annotations: tool.annotations
            }, this.registrationController ? { signal: this.registrationController.signal } : undefined);
            if (registrationResult && typeof registrationResult.catch === 'function') {
                registrationResult.catch(function(error: any): void {
                    console.error('Failed to register tool ' + toolName + ':', error);
                });
            }
        });

        this.registeredTools = toolsToRegister;
    }

    private getAvailableTools(): WebMcpTool[] {
        return [
            {
                name: 'getCardDetails',
                title: 'Get Card Details',
                description: 'Returns the card details based on card ID from the board.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        targetId: {
                            type: 'string',
                            description: 'The ID of the card to get details for'
                        }
                    },
                    required: ['targetId']
                },
                execute: (input: { targetId: string }) => {
                    // Find card element by data-id attribute
                    const cardElement: Element = this.parent.element.querySelector('[data-id="' + input.targetId + '"]');
                    if (cardElement) {
                        return this.parent.getCardDetails(cardElement);
                    }
                    throw new Error('Card with ID ' + input.targetId + ' not found');
                }
            },
            {
                name: 'getColumnData',
                title: 'Get Column Data',
                description: 'Returns the column data based on column key input.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        columnKey: {
                            type: 'string',
                            description: 'The key of the column to get data for'
                        }
                    },
                    required: ['columnKey']
                },
                execute: (input: { columnKey: string }) => {
                    return this.parent.getColumnData(input.columnKey);
                }
            },
            {
                name: 'getSelectedCards',
                title: 'Get Selected Cards',
                description: 'Gets the list of selected cards from the board.',
                inputSchema: {
                    type: 'object',
                    properties: {}
                },
                execute: () => {
                    const selectedCards: HTMLElement[] = this.parent.getSelectedCards();
                    return selectedCards.map((card: HTMLElement) => {
                        const id: string | null = card.getAttribute('data-id');
                        return this.parent.getCardDetails(card) || { id };
                    });
                }
            },
            {
                name: 'getSwimlaneData',
                title: 'Get Swimlane Data',
                description: 'Returns the cards that belong to the specified swimlane key.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        keyField: {
                            type: 'string',
                            description: 'The swimlane key whose cards should be returned'
                        }
                    },
                    required: ['keyField']
                },
                execute: (input: { keyField: string }) => {
                    return this.parent.getSwimlaneData(input.keyField);
                }
            },
            {
                name: 'openDialog',
                title: 'Open Dialog',
                description: 'Opens the Kanban dialog for adding or editing a card.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        action: {
                            type: 'string',
                            enum: ['Add', 'Edit'],
                            description: 'The dialog action to perform'
                        },
                        data: {
                            type: 'object',
                            description: 'Optional card data to edit'
                        }
                    },
                    required: ['action']
                },
                execute: (input: { action: 'Add' | 'Edit', data?: Record<string, any> }) => {
                    this.parent.openDialog(input.action, input.data);
                    return { success: true, message: 'Dialog opened successfully' };
                },
                annotations: {
                    readOnlyHint: false
                }
            },
            {
                name: 'closeDialog',
                title: 'Close Dialog',
                description: 'Closes the currently open Kanban dialog.',
                inputSchema: {
                    type: 'object',
                    properties: {}
                },
                execute: () => {
                    this.parent.closeDialog();
                    return { success: true, message: 'Dialog closed successfully' };
                },
                annotations: {
                    readOnlyHint: false
                }
            },
            {
                name: 'addCard',
                title: 'Add Card',
                description: 'Adds the new card to the data source of Kanban and layout.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        cardData: {
                            type: 'object',
                            description: 'The card data to add'
                        },
                        index: {
                            type: 'number',
                            description: 'Optional index to insert the card at'
                        }
                    },
                    required: ['cardData']
                },
                execute: (input: { cardData: Record<string, any>, index?: number }) => {
                    this.parent.addCard(input.cardData, input.index);
                    return { success: true, message: 'Card added successfully' };
                },
                annotations: {
                    readOnlyHint: false
                }
            },
            {
                name: 'updateCard',
                title: 'Update Card',
                description: 'Updates the changes made in the card object by passing it as a parameter to the data source.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        cardData: {
                            type: 'object',
                            description: 'The card data to update'
                        },
                        index: {
                            type: 'number',
                            description: 'Optional index to update the card at'
                        }
                    },
                    required: ['cardData']
                },
                execute: (input: { cardData: Record<string, any>, index?: number }) => {
                    this.parent.updateCard(input.cardData, input.index);
                    return { success: true, message: 'Card updated successfully' };
                },
                annotations: {
                    readOnlyHint: false
                }
            },
            {
                name: 'deleteCard',
                title: 'Delete Card',
                description: 'Deletes the card based on the provided ID or card collection in the argument list.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        cardData: {
                            oneOf: [
                                { type: 'string', description: 'The ID of the card to delete' },
                                { type: 'number', description: 'The ID of the card to delete' },
                                { type: 'object', description: 'Single card object to delete' },
                                { type: 'array', items: { type: 'object' }, description: 'Collection of card objects to delete' }
                            ],
                            description: 'The card data to delete'
                        }
                    },
                    required: ['cardData']
                },
                execute: (input: { cardData: string | number | Record<string, any> | Record<string, any>[] }) => {
                    this.parent.deleteCard(input.cardData);
                    return { success: true, message: 'Card deleted successfully' };
                },
                annotations: {
                    readOnlyHint: false
                }
            },
            {
                name: 'addColumn',
                title: 'Add Column',
                description: 'Add the column to Kanban board dynamically based on the provided column options and index.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        columnOptions: {
                            type: 'object',
                            description: 'The properties to new column that are going to be added in the board'
                        },
                        index: {
                            type: 'number',
                            description: 'The index of column to add the new column'
                        }
                    },
                    required: ['columnOptions', 'index']
                },
                execute: (input: { columnOptions: Record<string, any>, index: number }) => {
                    this.parent.addColumn(input.columnOptions, input.index);
                    return { success: true, message: 'Column added successfully' };
                },
                annotations: {
                    readOnlyHint: false
                }
            },
            {
                name: 'deleteColumn',
                title: 'Delete Column',
                description: 'Deletes the column based on the provided index value.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        index: {
                            type: 'number',
                            description: 'The index of column to delete the existing column from Kanban board'
                        }
                    },
                    required: ['index']
                },
                execute: (input: { index: number }) => {
                    this.parent.deleteColumn(input.index);
                    return { success: true, message: 'Column deleted successfully' };
                },
                annotations: {
                    readOnlyHint: false
                }
            },
            {
                name: 'showColumn',
                title: 'Show Column',
                description: 'Shows the column from hidden based on the provided key in the columns.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        key: {
                            oneOf: [
                                { type: 'string' },
                                { type: 'number' }
                            ],
                            description: 'The hidden column key name to be shown from the hidden state in board'
                        }
                    },
                    required: ['key']
                },
                execute: (input: { key: string | number }) => {
                    this.parent.showColumn(input.key);
                    return { success: true, message: 'Column shown successfully' };
                },
                annotations: {
                    readOnlyHint: false
                }
            },
            {
                name: 'hideColumn',
                title: 'Hide Column',
                description: 'Hides the column from Kanban board based on the provided key in the columns.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        key: {
                            oneOf: [
                                { type: 'string' },
                                { type: 'number' }
                            ],
                            description: 'The visible column key name to be hidden from the board'
                        }
                    },
                    required: ['key']
                },
                execute: (input: { key: string | number }) => {
                    this.parent.hideColumn(input.key);
                    return { success: true, message: 'Column hidden successfully' };
                },
                annotations: {
                    readOnlyHint: false
                }
            }
        ];
    }
    /**
     * Destroys the WebMCP adapter and removes event listeners.
     *
     * @returns {void}
     */
    public destroy(): void {
        if (this.registrationTimer) {
            window.clearTimeout(this.registrationTimer);
        }
        if (this.registrationController && !this.registrationController.signal.aborted) {
            this.registrationController.abort();
        }
        this.parent.off('getWebMcpTools', this.getWebMcpTools);
        this.parent.off('registerWebMcpTools', this.registerWebMcpTools);
    }
}

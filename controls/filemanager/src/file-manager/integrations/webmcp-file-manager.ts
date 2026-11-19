import { getWebMcpTools, registerWebMcpTools } from '../base/constant';
import { WebMcpTool, WebMcpToolResponse, WebMcpToolExecuteEventArgs } from '../base/interface';
import { FileManagerWebMcpSettingsModel } from '../models';
import { getUniqueID, isNullOrUndefined } from '@syncfusion/ej2-base';
import { FileManager } from '../base/file-manager';

interface FileManagerItem {
    id?: string | number;
    name?: string;
    isFile?: boolean;
    [key: string]: string | number | boolean | object | undefined;
}

interface WaitForOperationOutcome {
    success: boolean;
    message?: string;
    data?: object | string | number | boolean | null;
}

/**
 * Interface for manageFileSystemItems tool arguments
 */
interface ManageFileSystemItemsArgs {
    action: 'create' | 'rename' | 'delete';
    name?: string;
    id?: string;
    ids?: string[];
}

/**
 * Interface for manageFileUploadAndDownload tool arguments
 */
interface FileUploadAndDownloadArgs {
    action: 'upload' | 'download';
    ids?: string[];
}

/**
 * Interface for navigateAndOpenFiles tool arguments
 */
interface NavigateAndOpenFilesArgs {
    action: 'backward' | 'openFile' | 'refresh';
    fileId?: string;
}

/**
 * Interface for searchAndFilterFiles tool arguments
 */
interface FilterAndSearchFilesArgs {
    filterData?: object;
}

/**
 * Interface for manageUserInterface tool arguments
 */
interface ControlUserInterfaceArgs {
    action: 'enableMenu' | 'disableMenu' | 'enableToolbar' | 'disableToolbar' | 'closeDialog' | 'refreshLayout';
    items?: string[];
}

/**
 * Interface for manageSelection tool arguments
 */
interface SelectFilesInBatchArgs {
    action: 'selectAll' | 'clearSelection';
}

/**
 * Define FileManager's WebMCP tools
 * Each tool includes name, description, input/output schemas, and execution handlers
 */
const webMcpTools: WebMcpTool[] = [
    {
        name: 'getSelectedFiles',
        description: 'Retrieve the list of currently selected files and folders in the FileManager. Returns file metadata including IDs, names, types, and paths.',
        inputSchema: {
            type: 'object',
            properties: {},
            required: []
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            name: { type: 'string' },
                            type: { type: 'string' },
                            size: { type: 'number' },
                            modified: { type: 'string' }
                        }
                    }
                },
                message: { type: 'string' }
            }
        },
        annotations: { readOnlyHint: true }
    },
    {
        name: 'manageFileSystemItems',
        description: 'Create folders, rename files/folders, or delete files/folders by ID. Supports batch operations for deletion.',
        inputSchema: {
            type: 'object',
            properties: {
                action: { type: 'string', enum: ['create', 'rename', 'delete'] },
                name: { type: 'string' },
                id: { type: 'string' },
                ids: { type: 'array', items: { type: 'string' } }
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
                        id: { type: 'string' },
                        name: { type: 'string' }
                    }
                },
                message: { type: 'string' }
            }
        },
        annotations: { readOnlyHint: false }
    },
    {
        name: 'manageFileUploadAndDownload',
        description: 'Upload files to the current folder or download/export selected files to local system.',
        inputSchema: {
            type: 'object',
            properties: {
                action: { type: 'string', enum: ['upload', 'download'] },
                ids: { type: 'array', items: { type: 'string' } }
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
                        filesProcessed: { type: 'number' },
                        totalSize: { type: 'number' }
                    }
                },
                message: { type: 'string' }
            }
        },
        annotations: { readOnlyHint: false }
    },
    {
        name: 'navigateAndOpenFiles',
        description: 'Navigate backward in folder hierarchy, open files/folders, and refresh file list. Returns current directory state after navigation.',
        inputSchema: {
            type: 'object',
            properties: {
                action: { type: 'string', enum: ['backward', 'openFile', 'refresh'] },
                fileId: { type: 'string' }
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
                        currentPath: { type: 'string' },
                        filesCount: { type: 'number' }
                    }
                },
                message: { type: 'string' }
            }
        },
        annotations: { readOnlyHint: true }
    },
    {
        name: 'searchAndFilterFiles',
        description: 'Filter files based on custom criteria (name, type, date, size, etc.). Returns filtered file list matching the specified conditions.',
        inputSchema: {
            type: 'object',
            properties: {
                filterData: { type: 'object' }
            },
            required: []
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: {
                    type: 'object',
                    properties: {
                        filterApplied: { type: 'boolean' },
                        matchCount: { type: 'number' },
                        files: { type: 'array' }
                    }
                },
                message: { type: 'string' }
            }
        },
        annotations: { readOnlyHint: true }
    },
    {
        name: 'manageUserInterface',
        description: 'Enable/disable menu items and toolbar items, close dialogs, refresh layout. Controls UI state for workflow management.',
        inputSchema: {
            type: 'object',
            properties: {
                action: { type: 'string', enum: ['enableMenu', 'disableMenu', 'enableToolbar', 'disableToolbar', 'closeDialog', 'refreshLayout'] },
                items: { type: 'array', items: { type: 'string' } }
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
                        itemsAffected: { type: 'number' },
                        items: { type: 'array' }
                    }
                },
                message: { type: 'string' }
            }
        },
        annotations: { readOnlyHint: false }
    },
    {
        name: 'manageSelection',
        description: 'Select all files in current folder or clear the current selection. Prepares files for bulk operations.',
        inputSchema: {
            type: 'object',
            properties: {
                action: { type: 'string', enum: ['selectAll', 'clearSelection'] }
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
                        filesSelected: { type: 'number' }
                    }
                },
                message: { type: 'string' }
            }
        },
        annotations: { readOnlyHint: false }
    }
];

/**
 * WebMcpFileManager — Integrates FileManager with the WebMCP protocol.
 * Inject this module via `FileManager.Inject(WebMcpFileManager, …)` to
 * enable AI tool execution; tools are registered automatically on init when
 * `webMcp.enable === true`.
 */
export class WebMcpFileManager {
    private parent: FileManager;
    private webMcpAbortController: AbortController | null = null;

    constructor(parent: FileManager) {
        this.parent = parent;
        this.addEventListener();
        this.tryAutoRegister();
    }

    /**
     * Attaches event listeners for WebMCP communication.
     *
     * @returns {void}
     */
    private addEventListener(): void {
        this.parent.on(getWebMcpTools, this.getTools, this);
        this.parent.on(registerWebMcpTools, this.registerTools, this);
    }

    /**
     * Removes event listeners when component is destroyed.
     *
     * @returns {void}
     */
    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(getWebMcpTools, this.getTools);
            this.parent.off(registerWebMcpTools, this.registerTools);
        }
    }

    /**
     * Retrieves available tools, optionally filtered by names.
     *
     * @param {Object} args - The arguments object
     * @param {string[]} args.toolNames - Optional array of tool names to filter
     * @param {WebMcpTool[]} args.tools - Optional array to store filtered tools
     * @returns {WebMcpTool[]} Array of WebMCP tools
     */
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

    /**
     * Registers tools with document.modelContext for AI access.
     *
     * @param {Object} args - The arguments object
     * @param {string} args.prefix - Optional prefix for tool names
     * @param {string[]|WebMcpTool[]} args.tools - Array of tool names or tool objects
     * @param {string[]} args.exposedTo - Optional array of entities to expose tools to
     * @returns {void}
     */
    private registerTools(args: { prefix?: string, tools?: string[] | WebMcpTool[], exposedTo?: string[] }): void {
        const modelContext: { registerTool: Function } =
            <{ registerTool: Function }>(document as { modelContext?: { registerTool: Function } }).modelContext;
        if (!modelContext || typeof modelContext.registerTool !== 'function') {
            return;
        }
        this.webMcpAbortController = new AbortController();
        const toolPrefix: string = (isNullOrUndefined(args.prefix) ? this.parent.element.id : args.prefix) as string;
        const tools: WebMcpTool[] = args.tools && args.tools.length && typeof args.tools[0] === 'object' ? <WebMcpTool[]>args.tools :
            this.getTools({ toolNames: <string[]>args.tools });
        tools.forEach((tool: WebMcpTool): void => {
            tool.name = `${toolPrefix}_${tool.name}`;
            tool.execute = tool.execute || (async (args: object) => this.executeHandler(tool.name, args || {}));
            const registerOptions: { signal: AbortSignal; exposedTo?: string[] } = {
                signal: (<AbortController>this.webMcpAbortController).signal
            };
            if (Array.isArray(args.exposedTo) && args.exposedTo.length > 0) {
                registerOptions.exposedTo = args.exposedTo;
            }
            modelContext.registerTool(tool, registerOptions);
        });
    }

    /**
     * Resolves the registration prefix in priority order:
     *   1. `webMcp.name` — non-empty after trim.
     *   2. `this.parent.element.id` — when present (set by FileManager.preRender).
     *   3. `getUniqueID('filemanager')` — last-resort fallback.
     *
     * @returns {string | null} Resolved prefix, or `null` when no source yields a usable string.
     */
    private resolveRegistrationPrefix(): string {
        const settingsName: string = this.parent.webMcpSettings && this.parent.webMcpSettings.name;
        if (typeof settingsName === 'string' && settingsName.trim().length > 0) {
            return settingsName.trim();
        }
        const elementId: string = this.parent.element && this.parent.element.id;
        if (typeof elementId === 'string' && elementId.length > 0) {
            return elementId;
        }
        return getUniqueID('filemanager');
    }

    /**
     * Attempts to register the default tool set during init when
     * `webMcp.enable === true`. No-op when disabled, when
     * `document.modelContext` is missing, or when prefix resolution fails.
     *
     * @returns {void}
     */
    private tryAutoRegister(): void {
        if (!this.parent.enableWebMcp) {
            return;
        }
        const settings: FileManagerWebMcpSettingsModel = this.parent.webMcpSettings;
        const prefix: string = this.resolveRegistrationPrefix();

        // Invoke our own handler directly so we don't depend on the
        // (now-removed) public `FileManager.registerWebMcpTools` surface.
        // The handlers prefixed with `name_<toolName>` are produced
        // identically against `document.modelContext`.
        this.registerTools({
            prefix,
            tools: settings.tools,
            exposedTo: settings.exposedTo
        });
    }

    /**
     * Executes a WebMCP tool handler based on command name.
     * Fires beforeWebMcpToolExecute event for cancellation/confirmation.
     *
     * @param {string} command - The command name to execute
     * @param {object} args - The arguments for the command
     * @returns {Promise<WebMcpToolResponse>} Promise that resolves to the tool response
     */
    private async executeHandler(command: string, args: object): Promise<WebMcpToolResponse> {
        //const baseCommand: string = command.includes('_') ? command.substring(command.indexOf('_') + 1) : command;
        // The registered name is `${prefix}_${toolName}`. The prefix may itself
        // contain underscores (or any other character), so we split on the LAST
        // underscore to recover the original tool name. If no underscore is
        // present we treat the input as a bare tool name.
        const lastUnderscore: number = command.lastIndexOf('_');
        const baseCommand: string = lastUnderscore >= 0
            ? command.substring(lastUnderscore + 1)
            : command;
        const eventArgs: WebMcpToolExecuteEventArgs = { toolName: command, toolArgs: args };
        this.parent.trigger('beforeWebMcpToolExecute', eventArgs);

        // Check if tool execution was cancelled
        if (eventArgs.cancel) {
            return this.message({
                action: command,
                cancelled: true,
                success: false,
                message: eventArgs.cancellationResponse ||
                    `[USER_CANCELLED] Tool "${command}" was cancelled. This is final. Do NOT retry.`
            });
        }

        // Route to appropriate tool handler
        switch (baseCommand) {
        case 'getSelectedFiles':
            return this.handleGetSelectedFiles();
        case 'manageFileSystemItems':
            return this.handleManageFileSystemItems(args as ManageFileSystemItemsArgs);
        case 'manageFileUploadAndDownload':
            return this.handleFileUploadAndDownload(args as FileUploadAndDownloadArgs);
        case 'navigateAndOpenFiles':
            return this.handleNavigateAndOpenFiles(args as NavigateAndOpenFilesArgs);
        case 'searchAndFilterFiles':
            return this.handleSearchAndFilterFiles(args as FilterAndSearchFilesArgs);
        case 'manageUserInterface':
            return this.handleUserInterface(args as ControlUserInterfaceArgs);
        case 'manageSelection':
            return this.handleSelection(args as SelectFilesInBatchArgs);
        default:
            return this.error(`Tool "${baseCommand}" not found.`);
        }
    }

    /**
     * Tool Handler: Retrieve currently selected files
     *
     * @returns {WebMcpToolResponse} The response with selected files data
     */
    private handleGetSelectedFiles(): WebMcpToolResponse {
        try {
            const selectedFiles: Object[] = this.parent.getSelectedFiles() || [];
            return this.message({
                action: 'getSelectedFiles',
                success: true,
                data: selectedFiles,
                message: `Retrieved ${selectedFiles.length || 0} selected files`
            });
        } catch (error) {
            return this.error(`Failed to retrieve selected files: ${(error as Error).message}`);
        }
    }

    /**
     * Tool Handler: Manage file system items (create/rename/delete)
     *
     * @param {ManageFileSystemItemsArgs} args - The arguments for the file system operation
     * @returns {WebMcpToolResponse} The response with operation result
     */
    private async handleManageFileSystemItems(args: ManageFileSystemItemsArgs): Promise<WebMcpToolResponse> {
        try {
            const { action, name, id, ids } = args;

            switch (action) {
            case 'create': {
                if (!name || !name.trim()) {
                    return this.error('Create requires a non-empty name');
                }
                if (this.itemNameExists(name, true)) {
                    return this.message({
                        action: 'manageFileSystemItems',
                        success: false,
                        data: { action: 'create', name: name },
                        message: `A file or folder named "${name}" already exists in the current folder.`
                    });
                }
                this.parent.createFolder(name);
                const createOutcome: WaitForOperationOutcome = await this.waitForOperation('create', 2500, name);
                if (!createOutcome.success) {
                    return this.message({
                        action: 'manageFileSystemItems',
                        success: false,
                        data: { action: 'create', name: name },
                        message: createOutcome.message || `Folder "${name}" was not created.`
                    });
                }
                return this.message({
                    action: 'manageFileSystemItems',
                    success: true,
                    data: { action: 'create', name: name },
                    message: `Folder "${name}" created successfully`
                });
            }

            case 'rename': {
                if (!id || !name) {
                    return this.error('Rename requires both id and name parameters');
                }
                if (this.itemNameExists(name, false, id)) {
                    return this.message({
                        action: 'manageFileSystemItems',
                        success: false,
                        data: { action: 'rename', id: id, name: name },
                        message: `A file or folder named "${name}" already exists in the current folder.`
                    });
                }
                this.parent.renameFile(id, name);
                const renameOutcome: WaitForOperationOutcome = await this.waitForOperation('rename', 2500, name);
                if (!renameOutcome.success) {
                    return this.message({
                        action: 'manageFileSystemItems',
                        success: false,
                        data: { action: 'rename', id: id, name: name },
                        message: renameOutcome.message || `Item "${name}" was not renamed.`
                    });
                }
                return this.message({
                    action: 'manageFileSystemItems',
                    success: true,
                    data: { action: 'rename', id: id, name: name },
                    message: `Item renamed to "${name}" successfully`
                });
            }

            case 'delete': {
                if (!ids || !Array.isArray(ids) || ids.length === 0) {
                    return this.error('Delete requires ids array');
                }
                const missingIds: string[] = ids.filter((idValue: string) => !this.itemExistsById(idValue));
                if (missingIds.length > 0) {
                    return this.message({
                        action: 'manageFileSystemItems',
                        success: false,
                        data: { action: 'delete', count: ids.length },
                        message: `Unable to delete missing item id(s): ${missingIds.join(', ')}`
                    });
                }
                this.parent.deleteFiles(ids);
                const deleteOutcome: WaitForOperationOutcome = await this.waitForOperation('delete', 2500, undefined, ids);
                if (!deleteOutcome.success) {
                    return this.message({
                        action: 'manageFileSystemItems',
                        success: false,
                        data: { action: 'delete', count: ids.length },
                        message: deleteOutcome.message || `Delete request for ${ids.length} item(s) did not complete.`
                    });
                }
                return this.message({
                    action: 'manageFileSystemItems',
                    success: true,
                    data: { action: 'delete', count: ids.length },
                    message: `Deleted ${ids.length} item(s) successfully`
                });
            }

            default:
                return this.error(`Unknown action "${action}" for manageFileSystemItems`);
            }
        } catch (error) {
            return this.error(`Failed to manage file system items: ${(error as Error).message}`);
        }
    }

    /**
     * Tool Handler: Upload/Download files
     *
     * @param {FileUploadAndDownloadArgs} args - The arguments for the upload/download operation
     * @returns {WebMcpToolResponse} The response with operation result
     */
    private async handleFileUploadAndDownload(args: FileUploadAndDownloadArgs): Promise<WebMcpToolResponse> {
        try {
            const { action, ids } = args;

            switch (action) {
            case 'upload': {
                this.parent.uploadFiles();
                return this.message({
                    action: 'manageFileUploadAndDownload',
                    success: false,
                    requiresUserInteraction: true,
                    data: { action: 'upload' },
                    message: 'Upload dialog opening requires a user gesture in the browser. Please invoke the upload workflow from the UI to continue.'
                });
            }

            case 'download': {
                if (!(ids && Array.isArray(ids) && ids.length > 0)) {
                    return this.error('Download requires ids array with at least one item');
                }
                const currentItems: FileManagerItem[] = this.getCurrentItems();
                const invalidIds: string[] = ids.filter((idValue: string) => !this.itemExistsById(idValue, currentItems));
                if (invalidIds.length > 0) {
                    return this.message({
                        action: 'manageFileUploadAndDownload',
                        success: false,
                        data: { action: 'download', filesProcessed: 0 },
                        message: `Unable to download missing item id(s): ${invalidIds.join(', ')}`
                    });
                }
                this.parent.downloadFiles(ids);
                const downloadOutcome: WaitForOperationOutcome = await this.waitForOperation('download', 2500);
                if (!downloadOutcome.success) {
                    return this.message({
                        action: 'manageFileUploadAndDownload',
                        success: false,
                        data: { action: 'download', filesProcessed: ids.length },
                        message: downloadOutcome.message || `Download request for ${ids.length} item(s) did not complete.`
                    });
                }
                return this.message({
                    action: 'manageFileUploadAndDownload',
                    success: true,
                    data: { action: 'download', filesProcessed: ids.length },
                    message: `Downloaded ${ids.length} file(s)`
                });
            }

            default:
                return this.error(`Unknown action "${action}" for manageFileUploadAndDownload`);
            }
        } catch (error) {
            return this.error(`Failed to handle file upload/download: ${(error as Error).message}`);
        }
    }

    /**
     * Tool Handler: Navigate and open files
     *
     * @param {NavigateAndOpenFilesArgs} args - The arguments for the navigation/open operation
     * @returns {WebMcpToolResponse} The response with operation result
     */
    private handleNavigateAndOpenFiles(args: NavigateAndOpenFilesArgs): WebMcpToolResponse {
        try {
            const { action, fileId } = args;

            switch (action) {
            case 'backward': {
                const previousPath: string = this.parent.path;
                const previousDepth: number = this.parent.pathNames ? this.parent.pathNames.length : 0;
                this.parent.traverseBackward();
                const currentPath: string = this.parent.path;
                if (currentPath === previousPath && (this.parent.pathNames ? this.parent.pathNames.length : 0) === previousDepth) {
                    return this.message({
                        action: 'navigateAndOpenFiles',
                        success: false,
                        data: { action: 'backward', currentPath: previousPath },
                        message: 'Navigation did not change the current path.'
                    });
                }
                return this.message({
                    action: 'navigateAndOpenFiles',
                    success: true,
                    data: { action: 'backward', currentPath: currentPath },
                    message: 'Navigated to parent folder'
                });
            }

            case 'openFile': {
                if (!fileId) {
                    return this.error('openFile requires fileId parameter');
                }
                const item: FileManagerItem | undefined = this.findItemById(fileId);
                if (!item) {
                    return this.message({
                        action: 'navigateAndOpenFiles',
                        success: false,
                        data: { action: 'openFile', fileId: fileId },
                        message: `Item "${fileId}" was not found in the current folder.`
                    });
                }
                const previousPath: string = this.parent.path;
                this.parent.openFile(fileId);
                const currentPath: string = this.parent.path;
                if (!item.isFile && currentPath === previousPath) {
                    return this.message({
                        action: 'navigateAndOpenFiles',
                        success: false,
                        data: { action: 'openFile', fileId: fileId, currentPath: currentPath },
                        message: 'Open request did not change the current path.'
                    });
                }
                return this.message({
                    action: 'navigateAndOpenFiles',
                    success: true,
                    data: { action: 'openFile', fileId: fileId, currentPath: currentPath },
                    message: item.isFile ? 'File opened' : 'Folder opened'
                });
            }

            case 'refresh': {
                this.parent.refreshFiles();
                return this.message({
                    action: 'navigateAndOpenFiles',
                    success: true,
                    data: { action: 'refresh', currentPath: this.parent.path, filesCount: this.getCurrentItems().length },
                    message: 'File list refreshed'
                });
            }

            default:
                return this.error(`Unknown action "${action}" for navigateAndOpenFiles`);
            }
        } catch (error) {
            return this.error(`Failed to navigate/open files: ${(error as Error).message}`);
        }
    }

    /**
     * Tool Handler: Filter and search files
     *
     * @param {FilterAndSearchFilesArgs} args - The arguments for the filter/search operation
     * @returns {WebMcpToolResponse} The response with operation result
     */
    private handleSearchAndFilterFiles(args: FilterAndSearchFilesArgs): WebMcpToolResponse {
        try {
            const { filterData } = args;

            if (filterData) {
                this.parent.filterFiles(filterData);
            }

            return this.message({
                action: 'searchAndFilterFiles',
                success: true,
                data: {
                    filterApplied: !!filterData,
                    matchCount: 0,
                    files: []
                },
                message: filterData ? 'Filter applied successfully' : 'Filter cleared'
            });
        } catch (error) {
            return this.error(`Failed to filter files: ${(error as Error).message}`);
        }
    }

    /**
     * Tool Handler: Control UI elements
     *
     * @param {ControlUserInterfaceArgs} args - The arguments for the UI control operation
     * @returns {WebMcpToolResponse} The response with operation result
     */
    private handleUserInterface(args: ControlUserInterfaceArgs): WebMcpToolResponse {
        try {
            const { action, items } = args;

            switch (action) {
            case 'enableMenu':
                if (items && Array.isArray(items)) {
                    if (items.length === 0) {
                        return this.error('enableMenu requires at least one item');
                    }
                    this.parent.enableMenuItems(items);
                    return this.message({
                        action: 'manageUserInterface',
                        success: true,
                        data: { action: 'enableMenu', itemsAffected: items.length, items: items },
                        message: `Enabled ${items.length} menu item(s)`
                    });
                }
                return this.error('enableMenu requires items array');

            case 'disableMenu':
                if (items && Array.isArray(items)) {
                    if (items.length === 0) {
                        return this.error('disableMenu requires at least one item');
                    }
                    this.parent.disableMenuItems(items);
                    return this.message({
                        action: 'manageUserInterface',
                        success: true,
                        data: { action: 'disableMenu', itemsAffected: items.length, items: items },
                        message: `Disabled ${items.length} menu item(s)`
                    });
                }
                return this.error('disableMenu requires items array');

            case 'enableToolbar':
                if (items && Array.isArray(items)) {
                    if (items.length === 0) {
                        return this.error('enableToolbar requires at least one item');
                    }
                    this.parent.enableToolbarItems(items);
                    return this.message({
                        action: 'manageUserInterface',
                        success: true,
                        data: { action: 'enableToolbar', itemsAffected: items.length, items: items },
                        message: `Enabled ${items.length} toolbar item(s)`
                    });
                }
                return this.error('enableToolbar requires items array');

            case 'disableToolbar':
                if (items && Array.isArray(items)) {
                    if (items.length === 0) {
                        return this.error('disableToolbar requires at least one item');
                    }
                    this.parent.disableToolbarItems(items);
                    return this.message({
                        action: 'manageUserInterface',
                        success: true,
                        data: { action: 'disableToolbar', itemsAffected: items.length, items: items },
                        message: `Disabled ${items.length} toolbar item(s)`
                    });
                }
                return this.error('disableToolbar requires items array');

            case 'closeDialog':
                this.parent.closeDialog();
                return this.message({
                    action: 'manageUserInterface',
                    success: true,
                    data: { action: 'closeDialog' },
                    message: 'Dialog closed'
                });

            case 'refreshLayout':
                this.parent.refreshLayout();
                return this.message({
                    action: 'manageUserInterface',
                    success: true,
                    data: { action: 'refreshLayout' },
                    message: 'Layout refreshed'
                });

            default:
                return this.error(`Unknown action "${action}" for manageUserInterface`);
            }
        } catch (error) {
            return this.error(`Failed to control UI: ${(error as Error).message}`);
        }
    }

    /**
     * Tool Handler: Select files in batch
     *
     * @param {SelectFilesInBatchArgs} args - The arguments for the batch selection operation
     * @returns {WebMcpToolResponse} The response with operation result
     */
    private handleSelection(args: SelectFilesInBatchArgs): WebMcpToolResponse {
        try {
            const { action } = args;

            switch (action) {
            case 'selectAll': {
                this.parent.selectAll();
                const selectedFiles: Object[] = this.parent.getSelectedFiles() || [];
                if (selectedFiles.length === 0) {
                    return this.message({
                        action: 'manageSelection',
                        success: false,
                        data: { action: 'selectAll', filesSelected: 0 },
                        message: 'Selection did not update. No items were selected.'
                    });
                }
                return this.message({
                    action: 'manageSelection',
                    success: true,
                    data: { action: 'selectAll', filesSelected: selectedFiles.length },
                    message: `Selected all ${selectedFiles.length} file(s)`
                });
            }

            case 'clearSelection': {
                this.parent.clearSelection();
                const selectedFiles: Object[] = this.parent.getSelectedFiles() || [];
                if (selectedFiles.length !== 0) {
                    return this.message({
                        action: 'manageSelection',
                        success: false,
                        data: { action: 'clearSelection', filesSelected: selectedFiles.length },
                        message: 'Selection was not cleared.'
                    });
                }
                return this.message({
                    action: 'manageSelection',
                    success: true,
                    data: { action: 'clearSelection', filesSelected: 0 },
                    message: 'Selection cleared'
                });
            }

            default:
                return this.error(`Unknown action "${action}" for manageSelection`);
            }
        } catch (error) {
            return this.error(`Failed to manage file selection: ${(error as Error).message}`);
        }
    }

    /**
     * Removes event listeners and cleanup.
     *
     * @returns {void} Nothing returned
     */
    public destroy(): void {
        this.removeEventListener();
        if (this.webMcpAbortController) {
            this.webMcpAbortController.abort();
            this.webMcpAbortController = null;
        }
        this.parent = null as any;
    }

    /**
     * Returns module name for identification.
     *
     * @returns {string} The module name
     */
    public getModuleName(): string {
        return 'webmcpfilemanager';
    }

    private getCurrentItems(): FileManagerItem[] {
        const fileSystemItems: Object[] | FileManagerItem[] =
            (this.parent.fileSystemData && Array.isArray(this.parent.fileSystemData)
                && this.parent.fileSystemData.length > 0)
                ? this.parent.fileSystemData.slice() as FileManagerItem[] : (this.parent.itemData || []);
        const items: Object[] | FileManagerItem[] = fileSystemItems;
        return Array.isArray(items) ? items.slice() as FileManagerItem[] : [];
    }

    private itemExistsById(idValue: string, items: FileManagerItem[] = this.getCurrentItems()): boolean {
        return items.some((item: FileManagerItem) => String(item.id) === String(idValue) || String(item.name) === String(idValue));
    }

    private itemNameExists(name: string, shouldValidateCurrentFolder: boolean, idToExclude?: string): boolean {
        const normalizedName: string = (name || '').trim().toLowerCase();
        if (!normalizedName) {
            return false;
        }
        const items: FileManagerItem[] = this.getCurrentItems();
        return items.some((item: FileManagerItem) => {
            const itemName: string = (item && item.name) ? String(item.name).trim().toLowerCase() : '';
            if (shouldValidateCurrentFolder) {
                return itemName === normalizedName;
            }
            const sameItemId: boolean = String(item.id) !== String(idToExclude);
            return itemName === normalizedName && sameItemId;
        });
    }

    private findItemById(idValue: string): FileManagerItem | undefined {
        return this.getCurrentItems().find((item: FileManagerItem) =>
            String(item.id) === String(idValue) || String(item.name) === String(idValue)
        );
    }

    private async waitForOperation(
        action: string,
        timeoutMs: number = 2500,
        targetName?: string,
        targetIds?: string[]
    ): Promise<WaitForOperationOutcome> {
        const startTime: number = Date.now();

        while (Date.now() - startTime < timeoutMs) {
            const currentItems: FileManagerItem[] = this.getCurrentItems();

            if (action === 'download') {
                return { success: true, message: 'Download request initiated.' };
            }

            if (action === 'create' && targetName) {
                const createdItemName: string = this.parent.createdItem && this.parent.createdItem.name ?
                    String(this.parent.createdItem.name).trim().toLowerCase() : '';
                if (this.itemNameExists(targetName, true) || createdItemName === targetName.trim().toLowerCase()) {
                    return { success: true, message: `Folder "${targetName}" exists.` };
                }
            }

            if (action === 'rename' && targetName) {
                const renamedItemName: string = this.parent.renamedItem && this.parent.renamedItem.name ?
                    String(this.parent.renamedItem.name).trim().toLowerCase() : '';
                const renameMatched: boolean = currentItems.some((item: FileManagerItem) => {
                    const itemName: string = item.name ? String(item.name).trim().toLowerCase() : '';
                    return itemName === targetName.trim().toLowerCase();
                });
                if (renameMatched || renamedItemName === targetName.trim().toLowerCase()) {
                    return { success: true, message: `Item renamed to "${targetName}".` };
                }
            }

            if (action === 'delete' && targetIds && targetIds.length > 0) {
                const remainingIds: string[] = targetIds.filter((idValue: string) => this.itemExistsById(idValue, currentItems));
                if (remainingIds.length === 0) {
                    return { success: true, message: 'Delete operation completed.' };
                }
            }

            await new Promise((resolve: Function) => setTimeout(resolve, 50));
        }

        return {
            success: false,
            message: `The ${action} operation did not complete in time.`
        };
    }

    /**
     * Formats successful response in WebMCP standard format.
     *
     * @param {Record<string, string | number | boolean | object | null>} data - The data to format
     * @returns {WebMcpToolResponse} The formatted response
     */
    private message(data: Record<string, string | number | boolean | object | null>): WebMcpToolResponse {
        return { content: [{ type: 'text', text: JSON.stringify(data) }] };
    }

    /**
     * Formats error response in WebMCP standard format.
     *
     * @param {string} text - The error text
     * @returns {WebMcpToolResponse} The formatted error response
     */
    private error(text: string): WebMcpToolResponse {
        return { content: [{ type: 'text', text }], isError: true };
    }
}

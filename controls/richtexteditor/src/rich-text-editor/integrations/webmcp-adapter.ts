import { RichTextEditor } from '../base/rich-text-editor';
import { ModuleDeclaration, isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import { getWebMcpTools, registerWebMcpTools, destroy } from '../base/constant';
import { WebMcpTool, WebMcpToolResponse, WebMcpToolExecuteEventArgs, CommandResult } from '../base/interface';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { DialogType, CommandName } from '../../common/enum';
import { ILinkCommandsArgs, IImageCommandsArgs, ITableCommandsArgs, ExecuteCommandOption } from '../../common/interface';
import { DialogModel, Dialog } from '@syncfusion/ej2-popups';
import { DialogRenderer } from '../renderer/dialog-renderer';
import { webMcpTools } from './webmcp-tools';
import { NodeSelection } from '../../selection/selection';

/**
 * WebMcpAdapter — Integrates RichTextEditor with WebMCP protocol.
 * Inject this module to enable AI tool execution capabilities.
 */
export class WebMcpAdapter {
    private parent: RichTextEditor;
    private webMcpAbortController: AbortController | null = null;

    constructor(parent: RichTextEditor) {
        this.parent = parent;
        this.addEventListener();
    }

    //  Attaches event listeners for WebMCP communication.
    private addEventListener(): void {
        this.parent.on(getWebMcpTools, this.getTools, this);
        this.parent.on(registerWebMcpTools, this.registerTools, this);
        this.parent.on(destroy, this.destroy, this);
    }

    // Removes event listeners when component is destroyed.
    private removeEventListener(): void {
        this.parent.off(getWebMcpTools, this.getTools);
        this.parent.off(registerWebMcpTools, this.registerTools);
        this.parent.off(destroy, this.destroy);
    }

    // Retrieves available tools, optionally filtered by names.
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

    // Registers tools with document.modelContext for AI access.
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
            modelContext.registerTool(tool, { signal: (<AbortController>this.webMcpAbortController).signal, exposedTo: args.exposedTo });
        });
    }

    //  Executes a WebMCP tool handler based on command name.
    //  Fires beforeWebMcpToolExecute event for cancellation/confirmation.
    private async executeHandler(command: string, args: object): Promise<WebMcpToolResponse> {
        const baseCommand: string = command.includes('_') ? command.substring(command.indexOf('_') + 1) : command;
        const eventArgs: WebMcpToolExecuteEventArgs = { toolName: command, toolArgs: args };
        this.parent.trigger('beforeWebMcpToolExecute', eventArgs);

        // Check if tool execution was cancelled
        if (eventArgs.cancel) {
            return this.message({
                action: command,
                cancelled: true,
                message: eventArgs.cancellationResponse ||
                    `[USER_CANCELLED] Tool "${command}" was cancelled. This is final. Do NOT retry.`
            });
        }

        // Route to appropriate tool handler
        switch (baseCommand) {
        case 'getContent': return this.handleGetContent(args);
        case 'getSelectedHtml': return this.handleGetSelectedHtml(args);
        case 'selectAllContent': return this.handleSelectAllContent(args);
        case 'showDialog': {
            const { type } = args as { type: string };
            const dialogType: DialogType = type as DialogType;
            if (dialogType === 'InsertImage' && (isNOU(this.parent.imageModule))) {
                return this.error('Image module is not injected. Please inject the Image module to use this dialog.');
            }

            if (dialogType === 'InsertTable' && (isNOU(this.parent.tableModule))) {
                return this.error('Table module is not injected. Please inject the Table module to use this dialog.');
            }

            if (dialogType === 'InsertLink' && (isNOU(this.parent.linkModule))) {
                return this.error('Link module is not injected. Please inject the Link module to use this dialog.');
            }
            if (dialogType === 'InsertAudio' && (isNOU(this.parent.audioModule))) {
                return this.error('Audio module is not injected. Please inject the Audio module to use this dialog.');
            }
            if (dialogType === 'InsertVideo' && (isNOU(this.parent.videoModule))) {
                return this.error('Video module is not injected. Please inject the Video module to use this dialog.');
            }
            const summary: string = this.buildConfirmationMessage(baseCommand, args);
            const approved: boolean = await this.requestConfirmation(baseCommand, args, summary);
            if (!approved) {
                return this.message({
                    action: baseCommand,
                    cancelled: true,
                    message: `[USER_CANCELLED] User denied: "${summary}". This is final. Do NOT retry.`
                });
            }
            return this.handleShowDialog(args);
        }
        case 'closeDialog': {
            const { type } = args as { type: string };
            const dialogType: DialogType = type as DialogType;
            if (dialogType === 'InsertImage' && (isNOU(this.parent.imageModule))) {
                return this.error('Image module is not injected. Please inject the Image module to use this dialog.');
            }

            if (dialogType === 'InsertTable' && (isNOU(this.parent.tableModule))) {
                return this.error('Table module is not injected. Please inject the Table module to use this dialog.');
            }

            if (dialogType === 'InsertLink' && (isNOU(this.parent.linkModule))) {
                return this.error('Link module is not injected. Please inject the Link module to use this dialog.');
            }
            if (dialogType === 'InsertAudio' && (isNOU(this.parent.audioModule))) {
                return this.error('Audio module is not injected. Please inject the Audio module to use this dialog.');
            }
            if (dialogType === 'InsertVideo' && (isNOU(this.parent.videoModule))) {
                return this.error('Video module is not injected. Please inject the Video module to use this dialog.');
            }
            const summary: string = this.buildConfirmationMessage(baseCommand, args);
            const approved: boolean = await this.requestConfirmation(baseCommand, args, summary);
            if (!approved) {
                return this.message({
                    action: baseCommand,
                    cancelled: true,
                    message: `[USER_CANCELLED] User denied: "${summary}". This is final. Do NOT retry.`
                });
            }
            return this.handleCloseDialog(args);
        }
        case 'insertContent': {
            const payload: any = args as { content?: string };
            const summary: string = this.buildConfirmationMessage(baseCommand, args);
            const approved: boolean = await this.requestConfirmation(baseCommand, args, summary);
            if (!approved) {
                return this.message({
                    action: baseCommand,
                    cancelled: true,
                    message: `[USER_CANCELLED] User denied: "${summary}". This is final. Do NOT retry.`
                });
            }
            return this.handleInsertContent(args);
        }
        case 'formatSelectedContent': {
            const summary: string = this.buildConfirmationMessage(baseCommand, args);
            const approved: boolean = await this.requestConfirmation(baseCommand, args, summary);
            if (!approved) {
                return this.message({
                    action: baseCommand,
                    cancelled: true,
                    message: `[USER_CANCELLED] User denied: "${summary}". This is final. Do NOT retry.`
                });
            }
            return this.handleFormatSelectedContent(args);
        }
        case 'setBlockType': {
            // Check if trying to set PRE block without CodeBlock module
            const summary: string = this.buildConfirmationMessage(baseCommand, args);
            const approved: boolean = await this.requestConfirmation(baseCommand, args, summary);
            if (!approved) {
                return this.message({
                    action: baseCommand,
                    cancelled: true,
                    message: `[USER_CANCELLED] User denied: "${summary}". This is final. Do NOT retry.`
                });
            }
            return this.handleSetBlockType(args);
        }
        case 'setTextAlignment': {
            const summary: string = this.buildConfirmationMessage(baseCommand, args);
            const approved: boolean = await this.requestConfirmation(baseCommand, args, summary);
            if (!approved) {
                return this.message({
                    action: baseCommand,
                    cancelled: true,
                    message: `[USER_CANCELLED] User denied: "${summary}". This is final. Do NOT retry.`
                });
            }
            return this.handleSetTextAlignment(args);
        }
        case 'insertLink': {
            // Check if Link module is injected
            if (isNOU(this.parent.linkModule)) {
                return this.error('Link module is not injected. Please inject the Link module to use this tool.');
            }
            const summary: string = this.buildConfirmationMessage(baseCommand, args);
            const approved: boolean = await this.requestConfirmation(baseCommand, args, summary);
            if (!approved) {
                return this.message({
                    action: baseCommand,
                    cancelled: true,
                    message: `[USER_CANCELLED] User denied: "${summary}". This is final. Do NOT retry.`
                });
            }
            return this.handleInsertLink(args);
        }
        case 'insertTable': {
            // Check if Table module is injected
            if (isNOU(this.parent.tableModule)) {
                return this.error('Table module is not injected. Please inject the Table module to use this tool.');
            }
            const summary: string = this.buildConfirmationMessage(baseCommand, args);
            const approved: boolean = await this.requestConfirmation(baseCommand, args, summary);
            if (!approved) {
                return this.message({
                    action: baseCommand,
                    cancelled: true,
                    message: `[USER_CANCELLED] User denied: "${summary}". This is final. Do NOT retry.`
                });
            }
            return this.handleInsertTable(args);
        }
        case 'insertImage': {
            // Check if Image module is injected
            if (isNOU(this.parent.imageModule)) {
                return this.error('Image module is not injected. Please inject the Image module to use this tool.');
            }
            const summary: string = this.buildConfirmationMessage(baseCommand, args);
            const approved: boolean = await this.requestConfirmation(baseCommand, args, summary);
            if (!approved) {
                return this.message({
                    action: baseCommand,
                    cancelled: true,
                    message: `[USER_CANCELLED] User denied: "${summary}". This is final. Do NOT retry.`
                });
            }
            return this.handleInsertImage(args);
        }
        case 'undoLastAction': {
            const summary: string = this.buildConfirmationMessage(baseCommand, args);
            const approved: boolean = await this.requestConfirmation(baseCommand, args, summary);
            if (!approved) {
                return this.message({
                    action: baseCommand,
                    cancelled: true,
                    message: `[USER_CANCELLED] User denied: "${summary}". This is final. Do NOT retry.`
                });
            }
            return this.handleUndoLastAction(args);
        }
        case 'redoLastAction': {
            const summary: string = this.buildConfirmationMessage(baseCommand, args);
            const approved: boolean = await this.requestConfirmation(baseCommand, args, summary);
            if (!approved) {
                return this.message({
                    action: baseCommand,
                    cancelled: true,
                    message: `[USER_CANCELLED] User denied: "${summary}". This is final. Do NOT retry.`
                });
            }
            return this.handleRedoLastAction(args);
        }
        case 'clearFormatting': {
            const summary: string = this.buildConfirmationMessage(baseCommand, args);
            const approved: boolean = await this.requestConfirmation(baseCommand, args, summary);
            if (!approved) {
                return this.message({
                    action: baseCommand,
                    cancelled: true,
                    message: `[USER_CANCELLED] User denied: "${summary}". This is final. Do NOT retry.`
                });
            }
            return this.handleClearFormatting(args);
        }
        case 'printContent': return this.handlePrintContent(args);
        case 'setCodeBlock': {
            if (isNOU(this.parent.codeBlockModule)) {
                return this.error('CodeBlock module is not injected. Please inject the CodeBlock module to use this tool.');
            }
            const summary: string = this.buildConfirmationMessage(baseCommand, args);
            const approved: boolean = await this.requestConfirmation(baseCommand, args, summary);
            if (!approved) {
                return this.message({
                    action: baseCommand,
                    cancelled: true,
                    message: `[USER_CANCELLED] User denied: "${summary}". This is final. Do NOT retry.`
                });
            }
            return this.handleSetCodeBlock(args);
        }
        case 'applyNumberedListFormat': {
            const summary: string = this.buildConfirmationMessage(baseCommand, args);
            const approved: boolean = await this.requestConfirmation(baseCommand, args, summary);
            if (!approved) {
                return this.message({
                    action: baseCommand,
                    cancelled: true,
                    message: `[USER_CANCELLED] User denied: "${summary}". This is final. Do NOT retry.`
                });
            }
            return this.handleApplyNumberedListFormat(args);
        }
        case 'applyBulletedListFormat': {
            const summary: string = this.buildConfirmationMessage(baseCommand, args);
            const approved: boolean = await this.requestConfirmation(baseCommand, args, summary);
            if (!approved) {
                return this.message({
                    action: baseCommand,
                    cancelled: true,
                    message: `[USER_CANCELLED] User denied: "${summary}". This is final. Do NOT retry.`
                });
            }
            return this.handleApplyBulletedListFormat(args);
        }
        case 'insertBR': {
            const summary: string = this.buildConfirmationMessage(baseCommand, args);
            const approved: boolean = await this.requestConfirmation(baseCommand, args, summary);
            if (!approved) {
                return this.message({
                    action: baseCommand,
                    cancelled: true,
                    message: `[USER_CANCELLED] User denied: "${summary}". This is final. Do NOT retry.`
                });
            }
            return this.handleInsertBR(args);
        }
        default: {
            // Handle custom tools with confirmation dialog by checking the readOnlyHint from the tool
            const toolDefinition: WebMcpTool | undefined = webMcpTools.find((tool: any) => tool.name === baseCommand);
            const isWriteOperation: boolean = toolDefinition && toolDefinition.annotations &&
            (toolDefinition.annotations as any).readOnlyHint === false;
            if (isWriteOperation) {
                const summary: string = this.buildConfirmationMessage(baseCommand, args);
                const approved: boolean = await this.requestConfirmation(baseCommand, args, summary);
                if (!approved) {
                    return this.message({
                        action: baseCommand,
                        cancelled: true,
                        message: `[USER_CANCELLED] User denied: "${summary}". This is final. Do NOT retry.`
                    });
                }
            }
            return this.error(`Tool "${baseCommand}" not found.`);
        }
        }
    }

    // Removes event listeners and cleanup.
    public destroy(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.removeEventListener();
        if (this.webMcpAbortController) {
            this.webMcpAbortController.abort();
            this.webMcpAbortController = null;
        }
    }

    // Returns module name for identification.
    public getModuleName(): string {
        return 'WebMcpAdapter';
    }

    //  Formats successful response in WebMCP standard format.
    private message(data: unknown): WebMcpToolResponse {
        return { content: [{ type: 'text', text: JSON.stringify(data) }] };
    }

    //  Formats error response in WebMCP standard format.
    private error(text: string): WebMcpToolResponse {
        return { content: [{ type: 'text', text }], isError: true };
    }

    //  Build human-readable confirmation message for write operations.
    private buildConfirmationMessage(command: string, args: object): string {
        return `Confirm: ${command}`;
    }

    // Request user confirmation before executing write operations.
    private async requestConfirmation(command: string, args: object, message: string): Promise<boolean> {
        if (this.parent.isDestroyed || !this.parent.element || !this.parent.rootContainer) {
            return true;
        }

        const parentElement: HTMLElement = this.parent.element;

        return new Promise((resolve: (value: boolean) => void) => {
            try {
                const msg: string = message || this.buildConfirmationMessage(command, args);
                const renderer: DialogRenderer = new DialogRenderer(this.parent);
                const dialogEle: HTMLElement = this.parent.createElement('div', {
                    className: 'e-webmcp-confirm-wrapper'
                });

                this.parent.rootContainer.appendChild(dialogEle);

                const dialogModel: DialogModel = {
                    header: 'AI Action Request',
                    content: msg,
                    cssClass: 'e-webmcp-confirm-dlg',
                    enableRtl: this.parent.enableRtl || false,
                    showCloseIcon: true,
                    isModal: true,
                    width: '375px',
                    position: { X: 'center', Y: 'top' },
                    target: parentElement,
                    buttons: [
                        {
                            buttonModel: { content: 'Ok', isPrimary: true },
                            click: (): void => {
                                dialogInst.hide();
                                dialogInst.destroy();
                                dialogEle.remove();
                                resolve(true);
                            }
                        },
                        {
                            buttonModel: { content: 'Cancel' },
                            click: (): void => {
                                dialogInst.hide();
                                dialogInst.destroy();
                                dialogEle.remove();
                                resolve(false);
                            }
                        }
                    ],
                    close: (): void => {
                        resolve(false);
                        if (dialogInst) {
                            dialogInst.hide();
                            dialogInst.destroy();
                            dialogEle.remove();
                        }
                    }
                };

                const dialogInst: Dialog = renderer.render(dialogModel);
                dialogInst.createElement = this.parent.createElement;
                dialogInst.appendTo(dialogEle);
                dialogInst.show();
            } catch (error) {
                resolve(true);
            }
        });
    }

    // Tool handler methods
    private handleGetContent(args: any): WebMcpToolResponse {
        const content: string = this.parent.value;
        return this.message({
            success: true,
            data: { content: content || '' },
            message: 'Successfully retrieved content'
        });
    }

    private handleGetSelectedHtml(args: any): WebMcpToolResponse {
        const selectedHtml: string = this.parent.getSelectedHtml();
        return this.message({
            success: true,
            data: { selectedHtml: selectedHtml || '' },
            message: 'Successfully retrieved selected HTML'
        });
    }

    private handleSelectAllContent(args: any): WebMcpToolResponse {
        this.parent.selectAll();
        return this.message({
            success: true,
            message: 'Successfully selected all content'
        });
    }

    private handleShowDialog(args: any): WebMcpToolResponse {
        const { type } = args;
        const dialogType: DialogType = type as DialogType;
        this.parent.showDialog(dialogType);
        return this.message({
            success: true,
            message: `Successfully showed ${type} dialog`
        });
    }

    private handleCloseDialog(args: any): WebMcpToolResponse {
        const { type } = args;
        const dialogType: DialogType = type as DialogType;
        this.parent.closeDialog(dialogType);
        return this.message({
            success: true,
            message: `Successfully closed ${type} dialog`
        });
    }

    private handleInsertContent(args: any): WebMcpToolResponse {
        const { content, contentType } = args;

        if (contentType === 'text') {
            this.parent.executeCommand('insertText', content, { undo: true });
        } else {
            this.parent.executeCommand('insertHTML', content, { undo: true });
        }

        return this.message({
            success: true,
            message: 'Successfully inserted content'
        });
    }

    private handleFormatSelectedContent(args: any): WebMcpToolResponse {
        const { formatType, fontfamily, fontsize, backgroundcolor, fontcolor } = args;

        // Handle value-based formatting
        switch (formatType) {
        case 'fontfamily':
            if (fontfamily) {
                this.parent.executeCommand('fontName', fontfamily as string, { undo: true });
            }
            break;
        case 'fontsize':
            if (fontsize) {
                this.parent.executeCommand('fontSize', fontsize as string, { undo: true });
            }
            break;
        case 'backgroundcolor':
            if (backgroundcolor) {
                this.parent.executeCommand('backColor', backgroundcolor as string, { undo: true });
            }
            break;
        case 'fontcolor':
            if (fontcolor) {
                this.parent.executeCommand('fontColor', fontcolor as string, { undo: true });
            }
            break;
        default:
            // Handle toggle-based formatting
            this.parent.executeCommand(formatType, null, { undo: true });
            break;
        }

        return this.message({
            success: true,
            message: `Successfully applied ${formatType} formatting`
        });
    }

    private handleSetBlockType(args: any): WebMcpToolResponse {
        const { blockType } = args;

        if (blockType.startsWith('H')) {
            this.parent.executeCommand('heading', blockType, { undo: true });
        } else {
            this.parent.executeCommand('formatBlock', blockType, { undo: true });
        }

        return this.message({
            success: true,
            message: `Successfully set block type to ${blockType}`
        });
    }

    private handleSetTextAlignment(args: any): WebMcpToolResponse {
        const { alignment } = args;
        const commandName: CommandName = alignment as CommandName;

        this.parent.executeCommand(commandName, null, { undo: true });

        return this.message({
            success: true,
            message: `Successfully set text alignment to ${alignment}`
        });
    }

    private handleInsertLink(args: any): WebMcpToolResponse {
        const { url, text, title, target } = args;
        const linkArgs: ILinkCommandsArgs = { url, text, title, target };

        this.parent.executeCommand('createLink', linkArgs, { undo: true });

        return this.message({
            success: true,
            message: 'Successfully inserted link'
        });
    }

    private handleInsertTable(args: any): WebMcpToolResponse {
        // Default to a 3x3 table when the caller omits dimensions.
        let rows: number = isNOU(args.rows) ? 3 : Number(args.rows);
        let columns: number = isNOU(args.columns) ? 3 : Number(args.columns);

        // Fall back to defaults when the values are invalid (per schema bounds).
        if (isNaN(rows) || rows < 1 || rows > 100) { rows = 3; }
        if (isNaN(columns) || columns < 1 || columns > 50) { columns = 3; }

        // Fall back to the editor's tableSettings when the optional width model is omitted or partial.
        const rawWidth: any = (args.width && typeof args.width === 'object') ? args.width : {};
        const widthModel: any = {
            width: !isNOU(rawWidth.width) ? rawWidth.width : this.parent.tableSettings.width,
            minWidth: !isNOU(rawWidth.minWidth) ? rawWidth.minWidth : this.parent.tableSettings.minWidth,
            maxWidth: !isNOU(rawWidth.maxWidth) ? rawWidth.maxWidth : this.parent.tableSettings.maxWidth
        };
        const currentSelection: NodeSelection = this.parent.formatter.editorManager.nodeSelection;
        const tableArgs: ITableCommandsArgs = { rows, columns, width: widthModel, selection: currentSelection };
        this.parent.executeCommand('insertTable', tableArgs, { undo: true });

        return this.message({
            success: true,
            data: { rows: rows, columns: columns },
            message: `Successfully inserted ${rows}x${columns} table`
        });
    }

    private handleInsertImage(args: any): WebMcpToolResponse {
        const { url, altText, width, height, cssClass } = args;
        const imageArgs: IImageCommandsArgs = { url, altText, width, height, cssClass };

        this.parent.executeCommand('insertImage', imageArgs, { undo: true });

        return this.message({
            success: true,
            message: 'Successfully inserted image'
        });
    }

    private handleUndoLastAction(args: any): WebMcpToolResponse {
        this.parent.executeCommand('undo');
        return this.message({
            success: true,
            message: 'Successfully undid last action'
        });
    }

    private handleRedoLastAction(args: any): WebMcpToolResponse {
        this.parent.executeCommand('redo');
        return this.message({
            success: true,
            message: 'Successfully redid last action'
        });
    }

    private handleClearFormatting(args: any): WebMcpToolResponse {

        this.parent.executeCommand('removeFormat', null, { undo: true });

        return this.message({
            success: true,
            message: 'Successfully cleared formatting'
        });
    }

    private handlePrintContent(args: any): WebMcpToolResponse {
        this.parent.print();
        return this.message({
            success: true,
            message: 'Successfully initiated print'
        });
    }

    private handleSetCodeBlock(args: any): WebMcpToolResponse {
        const { language, label } = args;
        const codeBlockArgs: any = { language, label };
        this.parent.executeCommand('insertCodeBlock', codeBlockArgs, { undo: true });

        return this.message({
            success: true,
            message: `Successfully inserted code block with ${label} syntax highlighting`
        });
    }

    private handleApplyNumberedListFormat(args: any): WebMcpToolResponse {
        const { style } = args;
        // Then apply the specific numbering style
        this.parent.executeCommand('numberFormatList', style, { undo: true });
        return this.message({
            success: true,
            message: `Successfully applied numbered list format: ${style}`
        });
    }

    private handleApplyBulletedListFormat(args: any): WebMcpToolResponse {
        const { style } = args;
        // Then apply the specific bullet style
        this.parent.executeCommand('bulletFormatList', style, { undo: true });
        return this.message({
            success: true,
            message: `Successfully applied bulleted list format: ${style}`
        });
    }

    private handleInsertBR(args: any): WebMcpToolResponse {
        this.parent.executeCommand('insertBrOnReturn', null, { undo: true });
        return this.message({
            success: true,
            message: 'Successfully inserted line break'
        });
    }
}

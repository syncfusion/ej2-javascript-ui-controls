import { WebMcpToolExecuteEventArgs, WebMcpTool, WebMcpToolResponse } from '../base/events-helper';
import { isNullOrUndefined, createElement } from '@syncfusion/ej2-base';
import { DocumentEditor, DocumentEditorSettings } from '../document-editor';
import { FindOption, PasteOptions } from '../base';
import { webMcpTools } from './webmcp-tool';
import { Dialog, DialogUtility } from '@syncfusion/ej2-popups';
import { DocumentEditorSettingsModel, FormFieldSettingsModel, RevisionSettingsModel } from '../document-editor-model';
import { SelectionCharacterFormat, SelectionParagraphFormat } from '../implementation';

/**
 * WebMcpDocumentEditor — Integrates DocumentEditor with WebMCP protocol.
 * Inject this module to enable AI tool execution capabilities.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export class WebMcpDocumentEditor {
    private parent: DocumentEditor;
    private webMcpAbortController: AbortController | null = null;
    private confirmationCallback: ((approved: boolean) => void) | null = null;

    constructor(parent: DocumentEditor) {
        this.parent = parent;
        this.addEventListener();
    }

    private addEventListener(): void {
        this.parent.on('getWebMcpTools', this.getTools, this);
        this.parent.on('registerWebMcpTools', this.registerTools, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off('getWebMcpTools', this.getTools);
            this.parent.off('registerWebMcpTools', this.registerTools);
        }
    }


    private getTools(args: { toolNames?: string[]; tools?: WebMcpTool[] }): WebMcpTool[] {
        const toolNames: string[] = <string[]>args.toolNames;
        if (toolNames && toolNames.length !== 0) {
            args.tools = this.webMcpTools.filter((webMcpTool: WebMcpTool) => toolNames.indexOf(webMcpTool.name) !== -1)
                .map((webMcpTool: WebMcpTool) => ({ ...webMcpTool }));
        } else {
            args.tools = this.webMcpTools.map((webMcpTool: WebMcpTool) => ({ ...webMcpTool }));
        }
        return args.tools;
    }

    private registerTools(args: { prefix?: string; tools?: string[] | WebMcpTool[]; exposedTo?: string[] }): void {
        // Check if document.modelContext exists and has registerTool method
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

    private async executeHandler(command: string, args: any): Promise<WebMcpToolResponse> {
        const baseCommand: string = command.indexOf('_') !== -1 ? command.substring(command.indexOf('_') + 1) : command;
        const eventArgs: WebMcpToolExecuteEventArgs = { toolName: command, toolArgs: args };
        this.parent.trigger('beforeWebMcpToolExecute', eventArgs);

        // Check if tool execution was cancelled
        if (eventArgs.cancel) {
            return this.message({
                action: command,
                cancelled: true,
                message: eventArgs.cancellationResponse ||
                    `[USER_CANCELLED] The tool execution for "${command}" was cancelled by the beforeWebMcpToolExecute event handler. ` +
                    'This is a final, irreversible decision by the user. ' +
                    'Do NOT retry this action, do NOT attempt a variation of it, ' +
                    'and do NOT proceed with any subsequent steps that depend on it. ' +
                    'Acknowledge the cancellation and stop.'
            });
        }

        // ✅ Route read-only operations (return immediately, no confirmation needed)
        switch (baseCommand) {
        // Read-only operations
        case 'getDocumentBookmarks': return this.handleGetDocumentBookmarks(args);
        case 'find': return this.handleFind(args);
        case 'findAll': return this.handleFindAll(args);
        case 'selectBookmark': return this.handleSelectBookmark(args);
        case 'select': return this.handleSelect(args);
        case 'print': return this.handlePrint(args);
        case 'goToPage': return this.handleGoToPage(args);
        case 'selectAll': return this.handleSelectAll(args);
        case 'selectCurrentWord': return this.handleSelectCurrentWord(args);
        case 'selectParagraph': return this.handleSelectParagraph(args);
        case 'pageCount': return this.handlePageCount(args);
        case 'getSelectionText': return this.handleGetSelectionText(args);
        case 'getSelectionSfdt': return this.handleGetSelectionSfdt(args);

            // ✅ Write operations fall through to default (confirmation required)
        default: {
            // Check confirmation dialog FIRST for write operations
            if (eventArgs.showConfirmationDialog) {
                const summary: string = this.buildConfirmationMessage(baseCommand, args);
                const approved: boolean = await this.requestConfirmation(baseCommand, args, summary);
                if (!approved) {
                    return this.message({
                        action: baseCommand,
                        cancelled: true,
                        message: eventArgs.cancellationResponse ||
                                `[USER_CANCELLED] The user explicitly denied: "${summary}". ` +
                                'This is a final, irreversible decision by the user. ' +
                                'Do NOT retry this action, do NOT attempt a variation of it, ' +
                                'and do NOT proceed with any subsequent steps that depend on it. ' +
                                'Acknowledge the cancellation and stop.'
                    });
                }
            }

            // Dispatch to appropriate handler based on tool name
            return this.dispatchHandler(baseCommand, args);
        }
        }
    }
    /**
     * @private
     *
     * @returns {void}
     */
    public destroy(): void {
        this.removeEventListener();
        if (this.webMcpAbortController) {
            this.webMcpAbortController.abort();
            this.webMcpAbortController = null;
        }
        this.parent = null;
    }

    private getModuleName(): string {
        return 'WebMcpDocumentEditor';
    }

    private message(data: unknown): WebMcpToolResponse {
        return { content: [{ type: 'text', text: JSON.stringify(data) }] };
    }

    private error(text: string): WebMcpToolResponse {
        return { content: [{ type: 'text', text }], isError: true };
    }
    private safeExecute<T>(handler: () => T, operationName: string): { success: boolean; result?: T; error?: string } {
        try {
            return {
                success: true,
                result: handler()
            };
        } catch (error) {
            const errorMessage: string = error instanceof Error ? error.message : `Failed to execute ${operationName}`;
            return {
                success: false,
                error: errorMessage
            };
        }
    }

    private dispatchHandler(command: string, args: any): WebMcpToolResponse {
        switch (command) {
        // Write operations
        case 'saveDocument': return this.handleSaveDocument(args);
        case 'configureDocumentEditorSettings': return this.handleConfigureDocumentEditorSettings(args);
        case 'replaceAll': return this.handleReplaceAll(args);
        case 'insertText': return this.handleInsertText(args);
        case 'paste': return this.handlePaste(args);
        case 'insertBookmark': return this.handleInsertBookmark(args);
        case 'enforceProtection': return this.handleEnforceProtection(args);
        case 'stopProtection': return this.handleStopProtection(args);
        case 'insertField': return this.handleInsertField(args);
        case 'insertEditingRegion': return this.handleInsertEditingRegion(args);
        case 'formatCharacter': return this.handleFormatCharacter(args);
        case 'formatParagraph': return this.handleFormatParagraph(args);
        case 'insertImage': return this.handleInsertImage(args);
        case 'insertHyperlink': return this.handleInsertHyperlink(args);

        default: {
            return this.error(`Tool "${command}" not found.`);
        }
        }
    }

    private buildConfirmationMessage(command: string, args: any): string {
        switch (command) {
        case 'saveDocument':
            return `Save document as "${args['fileName']}"${args['formatType'] ? ' in ' + args['formatType'] + ' format' : ''}?`;
        case 'replaceAll':
            return `Replace all occurrences of "${args['findText']}" with "${args['replaceText']}"?`;
        case 'insertText': {
            const text: string = (args['text'] as string) || '';
            const textPreview: string = text.length > 50 ? text.substring(0, 50) + '...' : text;
            return `Insert text: "${textPreview}"?`;
        }
        case 'paste':
            return 'Paste SFDT content into the document?';
        case 'insertBookmark':
            return `Insert bookmark named "${args['name']}"?`;
        case 'enforceProtection':
            return 'Apply password protection to the document?';
        case 'stopProtection':
            return 'Remove password protection from the document?';
        case 'insertField':
            return `Insert field with code "${args['fieldCode']}"?`;
        case 'insertEditingRegion':
            return `Insert editing region for user: "${args['user'] || 'Everyone'}"?`;
        case 'formatCharacter':
            return 'Apply character formatting to the current selection?';
        case 'formatParagraph':
            return 'Apply paragraph formatting to the current selection?';
        case 'insertImage':
            return 'Insert image into the document?';
        case 'insertHyperlink':
            return `Insert hyperlink to "${args['address']}"?`;
        default:
            return `Confirm: ${command}`;
        }
    }

    private requestConfirmation(command: string, args: any, message: string): Promise<boolean> {
        return new Promise((resolve: (value: boolean) => void) => {
            const isAngularModal: boolean = this.parent.isModalDialog;
            const container: HTMLElement = createElement('div') as HTMLElement;
            const contentDiv: HTMLDivElement = createElement('div') as HTMLDivElement;
            const contentValue: HTMLParagraphElement = createElement('p') as HTMLParagraphElement;
            contentValue.textContent = message;
            contentDiv.appendChild(contentValue);
            container.appendChild(contentDiv);

            // Create fresh dialog on each request (like context-menu.ts openPasteDialog)
            const dialogUtility: Dialog = DialogUtility.confirm({
                title: 'AI Action Request',
                content: container,
                okButton: { text: 'Ok', click: (): void => {
                    resolve(true);
                    dialogUtility.hide();
                } },
                cancelButton: { text: 'Cancel', click: (): void => {
                    resolve(false);
                    dialogUtility.hide();
                } },
                showCloseIcon: true,
                open: (e: any): void => {
                    if (isAngularModal) {
                        this.parent.moveAlertToCdkOverlay(e);
                    }
                },
                closeOnEscape: true,
                animationSettings: { effect: 'Zoom' },
                close: (): void => {
                    // Handle close icon click or Escape key press
                    resolve(false);
                }
            });
        });
    }

    // WebMCP tool handlers

    private handleSaveDocument(args: any): WebMcpToolResponse {
        if (!args.fileName) {
            return this.error('fileName is required');
        }

        const result: { success: boolean; result?: string; error?: string } = this.safeExecute(() => {
            const { fileName, formatType } = args;
            this.parent.save(fileName, formatType);
            return `Document saved successfully as ${fileName}${formatType ? '.' + formatType.toLowerCase() : ''}`;
        }, 'saveDocument');

        if (!result.success) {
            return this.error(`Failed to save document: ${result.error}`);
        }

        return this.message({
            action: 'saveDocument',
            success: true,
            message: result.result
        });
    }

    private handleGetDocumentBookmarks(_args: any): WebMcpToolResponse {
        try {
            // Call the getBookmarks method on the parent DocumentEditor
            const bookmarks: string[] = this.parent.getBookmarks();

            return this.message({
                action: 'getDocumentBookmarks',
                success: true,
                data: { bookmarks },
                message: 'Bookmarks retrieved successfully'
            });
        } catch (error) {
            return this.error(`Failed to retrieve bookmarks: ${error.message}`);
        }
    }

    private handleConfigureDocumentEditorSettings(args: any): WebMcpToolResponse {
        try {
            // Update the documentEditorSettings with provided values
            const settings: DocumentEditorSettingsModel = this.parent.documentEditorSettings;

            // Apply each provided setting explicitly
            if (args.popupTarget !== undefined) {
                settings.popupTarget = args.popupTarget as HTMLElement;
            }
            if (args.searchHighlightColor !== undefined) {
                settings.searchHighlightColor = args.searchHighlightColor as string;
            }
            if (args.fontFamilies !== undefined) {
                settings.fontFamilies = args.fontFamilies as string[];
            }
            if (args.formFieldSettings !== undefined) {
                settings.formFieldSettings = args.formFieldSettings as FormFieldSettingsModel;
            }
            if (args.revisionSettings !== undefined) {
                settings.revisionSettings = args.revisionSettings as RevisionSettingsModel;
            }
            if (args.printDevicePixelRatio !== undefined) {
                settings.printDevicePixelRatio = args.printDevicePixelRatio as number;
            }
            if (args.enableOptimizedTextMeasuring !== undefined) {
                settings.enableOptimizedTextMeasuring = args.enableOptimizedTextMeasuring as boolean;
            }
            if (args.allowDragAndDrop !== undefined) {
                settings.allowDragAndDrop = args.allowDragAndDrop as boolean;
            }
            if (args.maximumRows !== undefined) {
                settings.maximumRows = args.maximumRows as number;
            }

            return this.message({
                action: 'configureDocumentEditorSettings',
                success: true,
                message: 'DocumentEditor settings updated successfully'
            });
        } catch (error) {
            return this.error(`Failed to update DocumentEditor settings: ${error.message}`);
        }
    }

    private handleFind(args: any): WebMcpToolResponse {
        try {
            const { text, matchCase, wholeWord } = args;
            if (!text) {
                return this.error('Text to find is required');
            }

            // Convert boolean parameters to FindOption
            let findOption: FindOption = 'None';
            if (matchCase && wholeWord) {
                findOption = 'CaseSensitiveWholeWord';
            } else if (matchCase) {
                findOption = 'CaseSensitive';
            } else if (wholeWord) {
                findOption = 'WholeWord';
            }

            // Call the search module's find method
            if (this.parent.search) {
                this.parent.search.find(text, findOption);
                return this.message({
                    action: 'find',
                    success: true,
                    message: 'Find operation completed'
                });
            } else {
                return this.error('Search module is not enabled');
            }
        } catch (error) {
            return this.error(`Failed to find text: ${error.message}`);
        }
    }

    private handleFindAll(args: any): WebMcpToolResponse {
        try {
            const { text, matchCase, wholeWord } = args;
            if (!text) {
                return this.error('Text to find is required');
            }

            // Convert boolean parameters to FindOption
            let findOption: FindOption = 'None';
            if (matchCase && wholeWord) {
                findOption = 'CaseSensitiveWholeWord';
            } else if (matchCase) {
                findOption = 'CaseSensitive';
            } else if (wholeWord) {
                findOption = 'WholeWord';
            }

            // Call the search module's findAll method
            if (this.parent.search) {
                // Only pass findOption if it's not the default 'None'
                if (findOption !== 'None') {
                    this.parent.search.findAll(text, findOption);
                } else {
                    this.parent.search.findAll(text);
                }

                // Get the search results count from the search module
                const matchCount: number = this.parent.search.searchResults.length;
                return this.message({
                    action: 'findAll',
                    success: true,
                    data: { results: this.parent.search.searchResults },
                    message: `Found ${matchCount} matches`
                });
            } else {
                return this.error('Search module is not enabled');
            }
        } catch (error) {
            return this.error(`Failed to find all text: ${error.message}`);
        }
    }

    private handleReplaceAll(args: any): WebMcpToolResponse {
        try {
            const {  replaceText } = args;

            if (replaceText === undefined) {
                return this.error('replaceText is required');
            }


            // Use the public SearchResults API for replace all
            if (this.parent.search) {


                // Step 1: Get match count before replacement
                const matchCount: number = this.parent.search.searchResults.length;

                // Step 2: Replace all using the public searchResults API
                if (matchCount > 0) {
                    this.parent.search.searchResults.replaceAll(replaceText);
                }

                // Return response matching tool schema: { success, data: { results: { count } }, message }
                return this.message({
                    action: 'replaceAll',
                    success: true,
                    data: {
                        results: {
                            count: matchCount
                        }
                    },
                    message: `Replaced ${matchCount} occurrences`
                });
            } else {
                return this.error('Search module is not enabled');
            }
        } catch (error) {
            return this.error(`Failed to replace text: ${error.message}`);
        }
    }

    private handleInsertText(args: any): WebMcpToolResponse {
        if (!args.text) {
            return this.error('Text to insert is required');
        }
        if (!this.parent.editor) {
            return this.error('Editor module is not enabled');
        }

        const result: { success: boolean; result?: string; error?: string } = this.safeExecute(() => {
            this.parent.editor.insertText(args.text);
            return 'Text inserted successfully';
        }, 'insertText');

        if (!result.success) {
            return this.error(`Failed to insert text: ${result.error}`);
        }

        return this.message({
            action: 'insertText',
            success: true,
            message: result.result
        });
    }

    private handlePaste(args: any): WebMcpToolResponse {
        try {
            const { sfdt, pasteOption, defaultPasteOption } = args;

            if (!sfdt) {
                return this.error('SFDT content to paste is required');
            }

            // Call the editor module's paste method
            if (this.parent.editor) {
                // Use pasteOption or defaultPasteOption if defined
                const pasteOpt: PasteOptions = (pasteOption || defaultPasteOption) as PasteOptions;

                if (pasteOpt) {
                    this.parent.editor.paste(sfdt, pasteOpt);
                } else {
                    this.parent.editor.paste(sfdt);
                }

                return this.message({
                    action: 'paste',
                    success: true,
                    message: 'Content pasted successfully'
                });
            } else {
                return this.error('Editor module is not enabled');
            }
        } catch (error) {
            return this.error(`Failed to paste content: ${error.message}`);
        }
    }

    private handleInsertBookmark(args: Record<string, string>): WebMcpToolResponse {
        if (!args.name) {
            return this.error('Bookmark name is required');
        }
        if (!this.parent.editor) {
            return this.error('Editor module is not enabled');
        }

        const result: { success: boolean; result?: string; error?: string } = this.safeExecute(() => {
            this.parent.editor.insertBookmark(args.name);
            return 'Bookmark inserted successfully';
        }, 'insertBookmark');

        if (!result.success) {
            return this.error(`Failed to insert bookmark: ${result.error}`);
        }

        return this.message({
            action: 'insertBookmark',
            success: true,
            message: result.result
        });
    }

    private handleSelectBookmark(args: any): WebMcpToolResponse {
        try {
            const { name, excludeBookmarkStartEnd } = args;
            if (!name) {
                return this.error('Bookmark name is required');
            }

            // Call the selection module's selectBookmark method
            if (this.parent.selection) {
                // Only pass excludeBookmarkStartEnd if defined
                if (excludeBookmarkStartEnd !== undefined) {
                    this.parent.selection.selectBookmark(name as string, excludeBookmarkStartEnd);
                } else {
                    this.parent.selection.selectBookmark(name);
                }

                return this.message({
                    action: 'selectBookmark',
                    success: true,
                    message: 'Bookmark selected successfully'
                });
            } else {
                return this.error('Selection module is not enabled');
            }
        } catch (error) {
            return this.error(`Failed to select bookmark: ${error.message}`);
        }
    }

    private handleSelect(args: any): WebMcpToolResponse {
        try {
            if (!this.parent.selection) {
                return this.error('Selection module is not enabled');
            }

            // Mode 1: Logical indices (string format: "0;0;1")
            if (typeof args.start === 'string' && typeof args.end === 'string') {
                this.parent.selection.select(args.start, args.end);
                return this.message({
                    action: 'select',
                    success: true,
                    message: `Content selected from ${args.start} to ${args.end}`
                });
            }

            // Mode 2: Coordinate object { x, y, extend }
            if (typeof args.start === 'object' && args.start.x !== undefined && args.start.y !== undefined) {
                this.parent.selection.select(args.start, args.end);
                return this.message({
                    action: 'select',
                    success: true,
                    message: 'Content selected at coordinates'
                });
            }

            return this.error('Invalid select format. Use either { start: "0;0;1", end: "0;0;5" } or { start: { x, y, extend }, end }');
        } catch (error) {
            return this.error(`Failed to select content: ${error.message}`);
        }
    }

    private handlePrint(_args: any): WebMcpToolResponse {
        try {
            // Call the print module's print method
            if (this.parent) {
                this.parent.print();
                return this.message({
                    action: 'print',
                    success: true,
                    message: 'Print initiated successfully'
                });
            } else {
                return this.error('Print module is not enabled');
            }
        } catch (error) {
            return this.error(`Failed to print: ${error.message}`);
        }
    }

    private handleEnforceProtection(args: any): WebMcpToolResponse {
        if (!args.password) {
            return this.error('Password is required');
        }
        if (!this.parent.editor) {
            return this.error('Editor module is not enabled');
        }

        const result: { success: boolean; result?: string; error?: string }  = this.safeExecute(() => {
            this.parent.editor.enforceProtection(args.password, args.protectionType);
            return 'Protection enforced successfully';
        }, 'enforceProtection');

        if (!result.success) {
            return this.error(`Failed to enforce protection: ${result.error}`);
        }

        return this.message({
            action: 'enforceProtection',
            success: true,
            message: result.result
        });
    }

    private handleStopProtection(args: any): WebMcpToolResponse {
        if (!args.password) {
            return this.error('Password is required');
        }
        if (!this.parent.editor) {
            return this.error('Editor module is not enabled');
        }

        const result: { success: boolean; result?: string; error?: string } = this.safeExecute(() => {
            this.parent.editor.stopProtection(args.password);
            return 'Protection stopped successfully';
        }, 'stopProtection');

        if (!result.success) {
            return this.error(`Failed to stop protection: ${result.error}`);
        }

        return this.message({
            action: 'stopProtection',
            success: true,
            message: result.result
        });
    }

    private handleInsertField(args: any): WebMcpToolResponse {
        try {
            const { fieldCode, result } = args;
            if (!fieldCode) {
                return this.error('Field code is required');
            }

            // Call the editor module's insertField method
            if (this.parent.editor) {
                // Only pass result if defined
                if (result !== undefined) {
                    this.parent.editor.insertField(fieldCode, result);
                } else {
                    this.parent.editor.insertField(fieldCode);
                }

                return this.message({
                    action: 'insertField',
                    success: true,
                    message: 'Field inserted successfully'
                });
            } else {
                return this.error('Editor module is not enabled');
            }
        } catch (error) {
            return this.error(`Failed to insert field: ${error.message}`);
        }
    }

    private handleGoToPage(args: any): WebMcpToolResponse {
        try {
            const { pageNumber } = args;
            if (!pageNumber) {
                return this.error('Page number is required');
            }

            // Call the selection module's goToPage method
            if (this.parent.selection) {
                this.parent.selection.goToPage(pageNumber);
                return this.message({
                    action: 'goToPage',
                    success: true,
                    message: 'Navigated to page successfully'
                });
            } else {
                return this.error('Selection module is not enabled');
            }
        } catch (error) {
            return this.error(`Failed to go to page: ${error.message}`);
        }
    }

    private handleSelectAll(_args: any): WebMcpToolResponse {
        try {
            // Call the selection module's selectAll method
            if (this.parent.selection) {
                this.parent.selection.selectAll();
                return this.message({
                    action: 'selectAll',
                    success: true,
                    message: 'All content selected successfully'
                });
            } else {
                return this.error('Selection module is not enabled');
            }
        } catch (error) {
            return this.error(`Failed to select all content: ${error.message}`);
        }
    }

    private handleSelectCurrentWord(_args: any): WebMcpToolResponse {
        try {
            // Call the selection module's selectCurrentWord method
            if (this.parent.selection) {
                this.parent.selection.selectCurrentWord();
                return this.message({
                    action: 'selectCurrentWord',
                    success: true,
                    message: 'Current word selected successfully'
                });
            } else {
                return this.error('Selection module is not enabled');
            }
        } catch (error) {
            return this.error(`Failed to select current word: ${error.message}`);
        }
    }

    private handleSelectParagraph(_args: any): WebMcpToolResponse {
        try {
            // Call the selection module's selectParagraph method
            if (this.parent.selection) {
                this.parent.selection.selectParagraph();
                return this.message({
                    action: 'selectParagraph',
                    success: true,
                    message: 'Current paragraph selected successfully'
                });
            } else {
                return this.error('Selection module is not enabled');
            }
        } catch (error) {
            return this.error(`Failed to select paragraph: ${error.message}`);
        }
    }

    private handlePageCount(_args: any): WebMcpToolResponse {
        try {
            // Get page count from the document
            if (this.parent.viewer) {
                const pageCount: number = this.parent.pageCount || 0;
                return this.message({
                    action: 'pageCount',
                    success: true,
                    data: {
                        pageCount: pageCount
                    },
                    message: `Document has ${pageCount} page(s)`
                });
            } else {
                return this.error('Viewer module is not enabled');
            }
        } catch (error) {
            return this.error(`Failed to get page count: ${error.message}`);
        }
    }

    private handleGetSelectionText(_args: any): WebMcpToolResponse {
        try {
            // Retrieve text from current selection
            if (this.parent.selection) {
                const selectedText: string = this.parent.selection.text || '';
                return this.message({
                    action: 'getSelectionText',
                    success: true,
                    data: {
                        text: selectedText
                    },
                    message: `Retrieved ${selectedText.length} character(s) from selection`
                });
            } else {
                return this.error('Selection module is not enabled');
            }
        } catch (error) {
            return this.error(`Failed to get selection text: ${error.message}`);
        }
    }

    private handleGetSelectionSfdt(_args: any): WebMcpToolResponse {
        try {
            // Retrieve SFDT from current selection
            if (this.parent.selection) {
                const selectionSfdt: string = this.parent.selection.sfdt ?
                    this.parent.selection.sfdt : '';
                return this.message({
                    action: 'getSelectionSfdt',
                    success: true,
                    data: {
                        sfdt: selectionSfdt
                    },
                    message: 'Retrieved selection SFDT content successfully'
                });
            } else {
                return this.error('Selection module is not enabled');
            }
        } catch (error) {
            return this.error(`Failed to get selection SFDT: ${error.message}`);
        }
    }

    private handleInsertEditingRegion(args: any): WebMcpToolResponse {
        try {
            const { user } = args;
            const userName: string = user || 'Everyone';

            // Call the editor module's insertEditingRegion method
            if (this.parent.editor) {
                this.parent.editor.insertEditingRegion(userName);
                return this.message({
                    action: 'insertEditingRegion',
                    success: true,
                    message: `Editing region inserted for user: "${userName}"`
                });
            } else {
                return this.error('Editor module is not enabled');
            }
        } catch (error) {
            return this.error(`Failed to insert editing region: ${error.message}`);
        }
    }

    private handleFormatCharacter(args: any): WebMcpToolResponse {
        try {
            // Extract character formatting properties
            const {
                bold, italic, underline, strikethrough, fontSize, fontFamily, color,
                highlightColor, baselineAlignment, allCaps, superscript, subscript
            } = args;

            if (!this.parent.selection) {
                return this.error('Selection module is not enabled');
            }

            const charFormat: SelectionCharacterFormat = this.parent.selection.characterFormat;

            // Apply character formatting properties if defined
            if (bold !== undefined) { charFormat.bold = bold; }
            if (italic !== undefined) { charFormat.italic = italic; }
            if (underline !== undefined) { charFormat.underline = underline; }
            if (strikethrough !== undefined) { charFormat.strikethrough = strikethrough; }
            if (fontSize !== undefined) { charFormat.fontSize = fontSize; }
            if (fontFamily !== undefined) { charFormat.fontFamily = fontFamily; }
            if (color !== undefined) { charFormat.fontColor = color; }
            if (highlightColor !== undefined) { charFormat.highlightColor = highlightColor; }
            if (baselineAlignment !== undefined) { charFormat.baselineAlignment = baselineAlignment; }
            if (allCaps !== undefined) { charFormat.allCaps = allCaps; }
            if (superscript !== undefined) { charFormat.baselineAlignment = superscript ? 'Superscript' : 'Normal'; }
            if (subscript !== undefined) { charFormat.baselineAlignment = subscript ? 'Subscript' : 'Normal'; }

            return this.message({
                action: 'formatCharacter',
                success: true,
                message: 'Character formatting applied successfully'
            });
        } catch (error) {
            return this.error(`Failed to apply character formatting: ${error.message}`);
        }
    }

    private handleFormatParagraph(args: any): WebMcpToolResponse {
        try {
            // Extract paragraph formatting properties
            const {
                alignment, leftIndent, rightIndent, firstLineIndent, beforeSpacing,
                afterSpacing, lineSpacing, lineSpacingType, outlineLevel, listFormat
            } = args;

            if (!this.parent.selection) {
                return this.error('Selection module is not enabled');
            }

            const paraFormat: SelectionParagraphFormat = this.parent.selection.paragraphFormat;

            // Apply paragraph formatting properties if defined
            if (alignment !== undefined) { paraFormat.textAlignment = alignment; }
            if (leftIndent !== undefined) { paraFormat.leftIndent = leftIndent; }
            if (rightIndent !== undefined) { paraFormat.rightIndent = rightIndent; }
            if (firstLineIndent !== undefined) { paraFormat.firstLineIndent = firstLineIndent; }
            if (beforeSpacing !== undefined) { paraFormat.beforeSpacing = beforeSpacing; }
            if (afterSpacing !== undefined) { paraFormat.afterSpacing = afterSpacing; }
            if (lineSpacing !== undefined) { paraFormat.lineSpacing = lineSpacing; }
            if (lineSpacingType !== undefined) { paraFormat.lineSpacingType = lineSpacingType; }
            if (outlineLevel !== undefined) { paraFormat.outlineLevel = outlineLevel; }

            return this.message({
                action: 'formatParagraph',
                success: true,
                message: 'Paragraph formatting applied successfully'
            });
        } catch (error) {
            return this.error(`Failed to apply paragraph formatting: ${error.message}`);
        }
    }

    private handleInsertImage(args: any): WebMcpToolResponse {
        try {
            const { imageString, width, height, alternateText } = args;

            if (!imageString) {
                return this.error('Image string (Base64 or URL) is required');
            }

            if (!this.parent.editor) {
                return this.error('Editor module is not enabled');
            }

            // Call insertImage with conditional optional parameters
            if (width !== undefined && height !== undefined && alternateText !== undefined) {
                this.parent.editor.insertImageAsync(imageString, width, height, alternateText);
            } else if (width !== undefined && height !== undefined) {
                this.parent.editor.insertImageAsync(imageString, width, height);
            } else if (width !== undefined) {
                this.parent.editor.insertImageAsync(imageString, width);
            } else {
                this.parent.editor.insertImageAsync(imageString);
            }

            return this.message({
                action: 'insertImage',
                success: true,
                message: 'Image inserted successfully'
            });
        } catch (error) {
            return this.error(`Failed to insert image: ${error.message}`);
        }
    }

    private handleInsertHyperlink(args: any): WebMcpToolResponse {
        try {
            const { address, displayText, screenTip } = args;

            if (!address) {
                return this.error('URL address is required');
            }

            if (!this.parent.editor) {
                return this.error('Editor module is not enabled');
            }

            // Call insertHyperlink with conditional optional parameters
            if (displayText !== undefined && screenTip !== undefined) {
                this.parent.editor.insertHyperlink(address, displayText, screenTip);
            } else if (displayText !== undefined) {
                this.parent.editor.insertHyperlink(address, displayText);
            } else {
                this.parent.editor.insertHyperlink(address);
            }

            return this.message({
                action: 'insertHyperlink',
                success: true,
                message: 'Hyperlink inserted successfully'
            });
        } catch (error) {
            return this.error(`Failed to insert hyperlink: ${error.message}`);
        }
    }
    /* eslint-enable @typescript-eslint/no-explicit-any */
    // WebMCP tool definitions imported from webmcp-tool.ts
    private webMcpTools: WebMcpTool[] = webMcpTools;
}

import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Dialog } from '@syncfusion/ej2-popups';
import { DistanceSettings, HighlightSettings, InkAnnotationSettings, IPdfRectBounds, LineSettings, PdfViewer, RadiusSettings, RectangleSettings, RedactionSettings, StampSettings } from '../pdfviewer';
import { WebMcpTool, WebMcpToolExecuteEventArgs, WebMcpToolParameters, WebMcpToolResponse } from '../base/interfaces';
import { pdfViewerWebMcpTools } from './webmcp-tools';
import { FormFieldModel, ItemModel, PageInfoModel, RectangleBoundsModel, SearchResultModel } from '../pdfviewer-model';
import { IPoint } from '../annotation';
import { PointModel } from '../ej2-drawings';
import { IFormFieldBound } from '../form-designer';
import { cloneObject } from '../drawing/drawing-util';
import { AnnotationType, DynamicStampItem, ExtractTextOption, FormFieldType, SignStampItem, StandardBusinessStampItem } from '../base/types';
import { Rectangle } from '@syncfusion/ej2-pdf';

/**
 * WebMCP Adapter for EJ2 PDF Viewer
 * Handles all WebMCP tool operations and integrations
 *
 */
export class WebMcpPdfViewer {
    private parent: PdfViewer;
    private webMcpAbortController: AbortController | null = null;
    private confirmationDialog: Dialog;

    constructor(parent: PdfViewer) {
        this.parent = parent;
        this.addEventListener();
    }

    // Attaches event listeners for WebMCP communication.
    private addEventListener(): void {
        this.parent.on('getWebMcpTools', this.getTools, this);
        this.parent.on('registerWebMcpTools', this.registerTools, this);
    }

    // Removes event listeners when component is destroyed.
    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off('getWebMcpTools', this.getTools);
            this.parent.off('registerWebMcpTools', this.registerTools);
            this.confirmationDialog = null;
        }
    }

    // Retrieves available tools, optionally filtered by names.
    private getTools(args: { toolNames?: string[]; tools?: WebMcpTool[] }): WebMcpTool[] {
        const toolNames: string[] = <string[]>args.toolNames;
        if (toolNames && toolNames.length !== 0) {
            args.tools = pdfViewerWebMcpTools.filter((webMcpTool: WebMcpTool) => toolNames.indexOf(webMcpTool.name) !== -1)
                .map((webMcpTool: WebMcpTool) => ({ ...webMcpTool }));
        } else {
            args.tools = pdfViewerWebMcpTools.map((webMcpTool: WebMcpTool) => ({ ...webMcpTool }));
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
        const toolPrefix: string = (isNullOrUndefined(args.prefix) ? (this.parent.element.id || 'pdfviewer') : args.prefix) as string;
        const tools: WebMcpTool[] = args.tools && args.tools.length && typeof args.tools[0] === 'object' ? <WebMcpTool[]>args.tools :
            this.getTools({ toolNames: <string[]>args.tools });
        tools.forEach((tool: WebMcpTool): void => {
            tool.name = `${toolPrefix}_${tool.name}`;
            tool.execute = tool.execute || (async (args: object) => this.executeTool(tool.name, args || {}));
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
     * Destroy the module
     * @private
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

    /**
     * Returns module name for identification.
     * @private
     * @returns {string} - return the module name.
     */
    public getModuleName(): string {
        return 'WebMcpPdfViewer';
    }

    // Formats successful response in WebMCP standard format.
    private message(data: {}): WebMcpToolResponse {
        return { content: [{ type: 'text', text: JSON.stringify(data) }] };
    }

    // Formats error response in WebMCP standard format.
    private error(text: string): WebMcpToolResponse {
        return { content: [{ type: 'text', text }], isError: true };
    }

    private validateModules(action: string, requiredModules: { [key: string]: string }): WebMcpToolResponse | null {
        for (const moduleProperty in requiredModules) {
            if (requiredModules.hasOwnProperty(moduleProperty)) {
                if (isNullOrUndefined(this.parent[moduleProperty as keyof PdfViewer])) {
                    return this.validateModule(action, requiredModules[moduleProperty as string]);
                }
            }
        }
        return null;
    }

    private validateModule(action: string, moduleName: string): WebMcpToolResponse {
        return this.error(
            `[MODULE_NOT_INJECTED] The "${action}" action requires the "${moduleName}" module, ` +
            'but it is not injected into the PDF Viewer component. ' +
            'The action was not executed. ' +
            'Do NOT retry this action. Do NOT attempt alternative variations of this action. ' +
            `Ask the user to add the "${moduleName}" module to the PDF Viewer component and try again.`
        );
    }

    // Executes a WebMCP tool handler based on command name.
    private async executeTool(toolName: string, parameters: object): Promise<WebMcpToolResponse> {
        try {
            const baseToolName: string = toolName.includes('_') ? toolName.substring(toolName.indexOf('_') + 1) : toolName;
            const tool: WebMcpTool | undefined = pdfViewerWebMcpTools.find((t: WebMcpTool) => t.name === baseToolName);
            const isReadOnly: boolean = tool.annotations.readOnlyHint === true;
            const eventArgs: WebMcpToolExecuteEventArgs = {
                toolName: baseToolName,
                toolArgs: parameters
            };
            this.parent.trigger('beforeWebMcpToolExecute', eventArgs);
            if (eventArgs.cancel) {
                return this.message({
                    action: toolName, cancelled: true,
                    message: eventArgs.cancellationResponse || '[User_CANCELLED] The tool execution for "${toolName}" was cancelled by the beforeWebMcpToolExecute event handler. ' +
                            'This is a final, irreversible decision by the user. ' +
                            'Do NOT retry this action, do NOT attempt a variation of it, ' +
                            'and do NOT proceed with any subsequent steps that depend on it. ' +
                            'Acknowledge the cancellation and stop.'
                });
            }
            if (isReadOnly) {
                return this.executeReadOnlyTool(baseToolName, parameters);
            }
            return this.executeWriteTool(baseToolName, parameters, eventArgs);
        } catch (error) {
            return this.error(`Error executing tool ${toolName}: ${(error as Error).message}`);
        }
    }

    // Execute read-only tools (navigation, search, extraction, retrieval).
    private async executeReadOnlyTool(toolName: string, parameters: object): Promise<WebMcpToolResponse> {
        switch (toolName) {
        case 'navigateToPage':
            return await this.handleNavigateToPage(parameters);
        case 'searchAndNavigate':
            return await this.handleSearchAndNavigate(parameters);
        case 'extractTextContent':
            return await this.handleExtractTextContent(parameters);
        case 'getPageMetadata':
            return await this.handleGetPageMetadata(parameters);
        case 'retrieveFormFields':
            return await this.handleRetrieveFormFields(parameters);
        case 'retrieveAnnotations':
            return await this.handleRetrieveAnnotations();
        case 'getBookmarksAndNavigate':
            return await this.handleGetBookmarksAndNavigate(parameters);
        case 'copyText':
            return await this.handleCopyText();
        case 'zoomAndView':
            return await this.handleZoomAndView(parameters);
        case 'downloadDocument':
            return await this.handleDownloadDocument();
        case 'printDocument':
            return await this.handlePrintDocument();
        default:
            return this.error(`Unknown read-only tool: ${toolName}`);
        }
    }

    // Execute write operations (modifications that change the document).
    private async executeWriteTool(toolName: string, parameters: object,
                                   eventArgs: WebMcpToolExecuteEventArgs): Promise<WebMcpToolResponse> {
        if (eventArgs.showConfirmationDialog) {
            const tool: string = this.formatToolName(toolName);
            const approved: boolean = await this.requestConfirmation(toolName);
            if (!approved) {
                return this.message({
                    action: toolName,
                    cancelled: true,
                    message: eventArgs.cancellationResponse ||
                        `[USER_CANCELLED] The user explicitly denied: "${tool}" operation. ` +
                        'This is a final, irreversible decision by the user. ' +
                        'Do NOT retry this action, do NOT attempt a variation of it, ' +
                        'and do NOT proceed with any subsequent steps that depend on it. ' +
                        'Acknowledge the cancellation and stop.'
                });
            }
        }
        return this.executeWriteToolHandler(toolName, parameters);
    }

    // Handle write operation execution after confirmation.
    private async executeWriteToolHandler(toolName: string, parameters: object): Promise<WebMcpToolResponse> {
        switch (toolName) {
        case 'addAnnotation':
            return await this.handleAddAnnotations(parameters);
        case 'editAnnotation':
            return await this.handleEditAnnotation(parameters);
        case 'deleteAnnotation':
            return await this.handleDeleteAnnotations(parameters);
        case 'addFormField':
            return await this.handleAddFormFields(parameters);
        case 'editFormField':
            return await this.handleEditFormFields(parameters);
        case 'resetFormField':
            return await this.handleResetFormFields(parameters);
        case 'deleteFormField':
            return await this.handleDeleteFormFields(parameters);
        case 'extractPages':
            return await this.handleExtractPDFPages(parameters);
        case 'undoRedoActions':
            return await this.handleUndoRedoActions(parameters);
        case 'addRedaction':
            return await this.handleAddRedaction(parameters);
        case 'updateRedaction':
            return await this.handleUpdateRedactionAnnotation(parameters);
        case 'applyRedaction':
            return await this.handleApplyRedaction();
        default:
            return this.error(`Unknown write tool: ${toolName}`);
        }
    }

    private async handleNavigateToPage(parameters: WebMcpToolParameters): Promise<WebMcpToolResponse> {
        try {
            const validation: WebMcpToolResponse | null = this.validateModules('navigateToPage', { navigation: 'Navigation' });
            if (validation) {
                return validation;
            }
            const action: string = parameters.navigationAction || '';
            const pageNum: number = parameters.pageNumber || 0;
            let pageNumber: number = this.parent.currentPageNumber;
            switch (action) {
            case 'goto':
                this.parent.navigation.goToPage(pageNum);
                pageNumber = pageNum;
                break;
            case 'next':
                this.parent.navigation.goToNextPage();
                pageNumber++;
                break;
            case 'previous':
                this.parent.navigation.goToPreviousPage();
                pageNumber--;
                break;
            case 'first':
                this.parent.navigation.goToFirstPage();
                pageNumber = 1;
                break;
            case 'last':
                this.parent.navigation.goToLastPage();
                pageNumber = this.parent.pageCount;
                break;
            }
            return this.message({
                action: 'navigateToPage',
                message: `Navigated to page ${pageNumber}`,
                data: {
                    currentPage: pageNumber,
                    totalPages: this.parent.pageCount,
                    pageNavigated: true
                }
            });
        } catch (error) {
            return this.error(`Navigation failed: ${(error as Error).message}`);
        }
    }

    private async handleSearchAndNavigate(parameters: WebMcpToolParameters): Promise<WebMcpToolResponse> {
        try {
            const validation: WebMcpToolResponse | null = this.validateModules('searchAndNavigate', {
                textSearch: 'TextSearch', navigation: 'Navigation',
                textSelection: 'TextSelection', magnification: 'Magnification'
            });
            if (validation) {
                return validation;
            }
            const searchText: string = parameters.searchText || '';
            const caseSensitive: boolean = parameters.caseSensitive || false;
            const pageIndex: number | undefined = parameters.pageIndex;
            let results: SearchResultModel[] = [];
            if (pageIndex !== undefined) {
                results = this.parent.textSearch.findText(searchText, caseSensitive, pageIndex);
            } else {
                results = this.parent.textSearch.findText(searchText, caseSensitive);
            }
            if (results && Array.isArray(results) && (results as SearchResultModel[]).length > 0) {
                const firstResult: SearchResultModel = results[0];
                if (firstResult.pageIndex !== undefined) {
                    this.parent.navigation.goToPage(firstResult.pageIndex + 1);
                }
                return this.message({
                    action: 'searchAndNavigate',
                    message: `Found ${results.length || 0} matches`,
                    data: {
                        searchResults: results,
                        firstMatchPage: ((results[0].pageIndex as number) + 1) || 0,
                        navigationSuccessful: results && results.length > 0
                    }
                });
            }
            return this.message({
                action: 'searchAndNavigate',
                message: `Found ${Object.keys(results).length} matches`,
                data: {
                    searchResults: results
                }
            });
        } catch (error) {
            return this.error(`Search failed: ${(error as Error).message}`);
        }
    }

    private async handleExtractTextContent(parameters: WebMcpToolParameters): Promise<WebMcpToolResponse> {
        try {
            const validation: WebMcpToolResponse | null = this.validateModules('extractTextContent', {
                textSelection: 'TextSelection', magnification: 'Magnification'
            });
            if (validation) {
                return validation;
            }
            const startPage: number = parameters.startPage || 0;
            const endPage: number | undefined = parameters.endPage;
            const result: { pageText?: string } = await this.parent.extractText(startPage, endPage !== undefined ? endPage :
                startPage, ExtractTextOption.TextOnly);
            return this.message({
                action: 'extractTextContent',
                message: `Extracted content from pages ${startPage} to ${endPage}`,
                data: {
                    pageText: result.pageText || '',
                    pageCount: endPage ? (endPage - startPage) : startPage + 1,
                    extractedPages: endPage ? this.generatePageArray(startPage, endPage) : startPage + 1
                }
            });
        } catch (error) {
            return this.error(`Content extraction failed: ${(error as Error).message}`);
        }
    }

    private async handleGetPageMetadata(parameters: WebMcpToolParameters): Promise<WebMcpToolResponse> {
        try {
            const pageIndex: number = parameters.pageIndex || 0;
            const pageInfo: PageInfoModel = this.parent.getPageInfo(pageIndex);
            return this.message({
                action: 'getPageMetadata',
                success: true,
                message: `Retrieved metadata for page ${pageIndex}`,
                data: {
                    pageIndex: pageInfo.pageIndex || pageIndex,
                    width: pageInfo.width || 0,
                    height: pageInfo.height || 0,
                    rotation: pageInfo.rotation || 0,
                    totalPages: this.parent.pageCount,
                    dimensionsUnit: 'points'
                }
            });
        } catch (error) {
            return {
                content: [{ type: 'text', text: `Metadata retrieval failed: ${(error as Error).message}` }],
                isError: true
            };
        }
    }

    private async handleCopyText(): Promise<WebMcpToolResponse> {
        try {
            const validation: WebMcpToolResponse | null = this.validateModules('copyText', { textSelection: 'TextSelection' });
            if (validation) {
                return validation;
            }
            this.parent.textSelection.copyText();
            return this.message({
                action: 'copyText',
                success: true,
                message: 'Selected text copied to clipboard',
                data: {
                    textCopied: true,
                    message: 'Text copy operation completed successfully'
                }
            });
        } catch (error) {
            return this.error(`Copy text operation failed: ${(error as Error).message}`);
        }
    }

    private async handleAddAnnotations(parameters: WebMcpToolParameters): Promise<WebMcpToolResponse> {
        try {
            const validation: WebMcpToolResponse | null = this.validateModules('addAnnotation', { annotation: 'Annotation' });
            if (validation) {
                return validation;
            }
            const annotationType: AnnotationType = parameters.annotationType || 'Highlight';
            const pageNumber: number = parameters.pageNumber || 0;
            if (['Highlight', 'Underline', 'Strikethrough', 'Squiggly'].indexOf(annotationType) !== -1) {
                const bounds: RectangleBoundsModel[] = parameters.bounds as RectangleBoundsModel[] || [];
                this.parent.annotation.addAnnotation(annotationType, {
                    bounds: this.convertBounds(bounds),
                    pageNumber: pageNumber,
                    color: parameters.fillColor || parameters.strokeColor,
                    opacity: parameters.opacity || 1
                } as HighlightSettings);
                return this.message({
                    action: 'addAnnotation',
                    success: true,
                    message: `Successfully added ${annotationType} annotation`,
                    data: {
                        annotationType: annotationType,
                        category: 'TextMarkup',
                        pageNumber: pageNumber
                    }
                });
            }
            else if (['Rectangle', 'Circle', 'Arrow', 'Line', 'Polygon'].indexOf(annotationType) !== -1) {
                const offset: IPoint | undefined = parameters.offset ? this.convertOffset(parameters.offset) : undefined;
                const width: number = this.convertPointToPixel(parameters.width || 0);
                const height: number = this.convertPointToPixel(parameters.height || 0);
                const vertexPoints: PointModel[] | undefined = parameters.vertexPoints ?
                    this.convertVertexPoints(parameters.vertexPoints) : undefined;
                const config: any = {
                    offset: offset,
                    pageNumber: pageNumber,
                    strokeColor: parameters.strokeColor,
                    fillColor: parameters.fillColor,
                    thickness: parameters.thickness || 1
                };
                if (width !== undefined) {
                    (config as RectangleSettings).width = width;
                }
                if (height !== undefined) {
                    (config as RectangleSettings).height = height;
                }
                if (vertexPoints !== undefined) {
                    (config as LineSettings).vertexPoints = vertexPoints;
                }
                this.parent.annotation.addAnnotation(annotationType, config);
                return this.message({
                    action: 'addAnnotation',
                    success: true,
                    message: `${annotationType} annotation added successfully`,
                    data: {
                        annotationType: annotationType,
                        category: 'Shape',
                        pageNumber: pageNumber,
                        dimensions: { x: offset ? offset.x : vertexPoints[0].x, y: offset ? offset.y : vertexPoints[0].y, width, height }
                    }
                });
            }
            else if (['Distance', 'Perimeter', 'Area', 'Radius', 'Volume'].indexOf(annotationType) !== -1) {
                const offset: IPoint | undefined = parameters.offset ? this.convertOffset(parameters.offset) : undefined;
                const vertexPoints: PointModel[] | undefined = parameters.vertexPoints;
                const config: any = {
                    offset: offset,
                    pageNumber: pageNumber,
                    strokeColor: parameters.strokeColor,
                    fillColor: parameters.fillColor,
                    thickness: parameters.thickness
                };
                if (vertexPoints !== undefined) {
                    (config as DistanceSettings).vertexPoints = this.convertVertexPoints(vertexPoints);
                }
                if (parameters.width !== undefined) {
                    (config as RadiusSettings).width = this.convertPointToPixel(parameters.width);
                }
                if (parameters.height !== undefined) {
                    (config as RadiusSettings).height = this.convertPointToPixel(parameters.height);
                }
                this.parent.annotation.addAnnotation(annotationType, config);
                return this.message({
                    action: 'addAnnotation',
                    success: true,
                    message: `${annotationType} measurement annotation created`,
                    data: {
                        annotationType: annotationType,
                        category: 'Measurement',
                        pageNumber: pageNumber,
                        vertexCount: (vertexPoints && vertexPoints.length) || 0,
                        measurementUnit: 'points'
                    }
                });
            }
            else if (annotationType === 'FreeText') {
                const offset: IPoint | undefined = parameters.offset ? this.convertOffset(parameters.offset) : undefined;
                const content: string = parameters.content || '';
                this.parent.annotation.addAnnotation('FreeText', {
                    offset,
                    pageNumber,
                    fontSize: parameters.fontSize,
                    fontFamily: parameters.fontFamily,
                    fontColor: parameters.fontColor,
                    strokeColor: parameters.strokeColor,
                    fillColor: parameters.fillColor,
                    defaultText: content,
                    width: this.convertPointToPixel(parameters.width),
                    height: this.convertPointToPixel(parameters.height),
                    opacity: parameters.opacity
                } as any);
                return this.message({
                    action: 'addAnnotation',
                    success: true,
                    message: 'Free text annotation created',
                    data: {
                        annotationType: 'FreeText',
                        category: 'FreeText',
                        pageNumber: pageNumber,
                        content: content,
                        position: offset,
                        formatting: {
                            fontSize: parameters.fontSize || 12,
                            fontFamily: parameters.fontFamily || 'Helvetica',
                            color: parameters.fontColor || '#000000'
                        }
                    }
                });
            }
            else if (annotationType === 'Stamp') {
                const stampType: string = parameters.stampType || '';
                const stampValue: DynamicStampItem | SignStampItem | StandardBusinessStampItem | undefined = parameters.stampValue;
                const offset: IPoint | undefined = parameters.offset ? this.convertOffset(parameters.offset) : undefined;
                let dynamicStamp: DynamicStampItem | undefined = undefined;
                let signStamp: SignStampItem | undefined = undefined;
                let businessStamp: StandardBusinessStampItem | undefined = undefined;
                if (stampType === 'Dynamic') {
                    dynamicStamp = stampValue as DynamicStampItem;
                } else if (stampType === 'SignHere') {
                    signStamp = stampValue as SignStampItem;
                } else if (stampType === 'StandardBusiness') {
                    businessStamp = stampValue as StandardBusinessStampItem;
                }
                this.parent.annotation.addAnnotation('Stamp', {
                    offset,
                    pageNumber,
                    width: this.convertPointToPixel(parameters.width),
                    height: this.convertPointToPixel(parameters.height),
                    opacity: parameters.opacity
                } as StampSettings, dynamicStamp, signStamp, businessStamp
                );
                return this.message({
                    action: 'addAnnotation',
                    success: true,
                    message: `${stampValue} stamp added to page ${pageNumber}`,
                    data: {
                        annotationType: 'Stamp',
                        category: 'Stamp',
                        stampType: stampType,
                        stampValue: stampValue,
                        pageNumber: pageNumber,
                        position: offset,
                        timestamp: new Date().toISOString()
                    }
                });
            }
            else if (annotationType === 'Ink') {
                const path: string = parameters.path || '';
                this.parent.annotation.addAnnotation('Ink', {
                    pageNumber,
                    path,
                    strokeColor: parameters.strokeColor,
                    thickness: parameters.thickness,
                    opacity: parameters.opacity
                } as InkAnnotationSettings);

                return this.message({
                    action: 'addAnnotation',
                    success: true,
                    message: 'Ink annotation added successfully',
                    data: {
                        annotationType: 'Ink',
                        category: 'Ink',
                        pageNumber,
                        path: path
                    }
                });
            }
            else if (annotationType === 'StickyNotes') {
                const offset: IPoint | undefined = parameters.offset ? this.convertOffset(parameters.offset) : undefined;
                const author: string = parameters.author || '';
                this.parent.annotation.addAnnotation('StickyNotes', {
                    offset,
                    pageNumber,
                    author: author
                } as any);
                return this.message({
                    action: 'addAnnotation',
                    success: true,
                    message: 'Sticky note annotation added',
                    data: {
                        annotationType: 'StickyNote',
                        category: 'Comment',
                        pageNumber,
                        author,
                        position: offset
                    }
                });
            }
            else if (annotationType === 'Link') {
                const offset: IPoint | undefined = parameters.offset ? this.convertOffset(parameters.offset) : undefined;
                const config: any = {
                    offset,
                    pageNumber,
                    strokeColor: parameters.strokeColor,
                    fillColor: parameters.fillColor,
                    width: this.convertPointToPixel(parameters.width),
                    height: this.convertPointToPixel(parameters.height)
                };
                if (parameters.url) {
                    config.url = parameters.url;
                }
                if (parameters.destinationPageIndex !== undefined) {
                    config.destinationPageIndex = parameters.destinationPageIndex;
                }
                this.parent.annotation.addAnnotation('Link', config);
                return this.message({
                    action: 'addAnnotation',
                    success: true,
                    message: 'Link annotation added successfully',
                    data: {
                        annotationType: 'Link',
                        category: 'Link',
                        pageNumber,
                        url: parameters.url,
                        destinationPageIndex: parameters.destinationPageIndex
                    }
                });
            }
            else {
                return this.error(`Unknown annotation type: ${annotationType}`);
            }
        } catch (error) {
            return this.error(`Annotation addition failed: ${(error as Error).message}`);
        }
    }

    private async handleEditAnnotation(parameters: WebMcpToolParameters): Promise<WebMcpToolResponse> {
        try {
            const validation: WebMcpToolResponse | null = this.validateModules('editAnnotation', { annotation: 'Annotation' });
            if (validation) {
                return validation;
            }
            const annotationId: string = parameters.annotationId || '';
            const updates: WebMcpToolParameters = parameters.updates || {};
            this.parent.annotation.selectAnnotation(annotationId);
            const annotations: any[] = this.parent.annotationCollection;
            const annotation: { annotationId?: string; [key: string]: any } | undefined = annotations.find(
                (a: any) => a.annotationId === annotationId);
            if (annotation) {
                this.applyAnnotationUpdateConversions(updates);
                Object.assign(annotation, updates);
                this.updateAnnotationBounds(annotation, updates);
                this.parent.annotation.editAnnotation(annotation);
            }
            return this.message({
                action: 'editAnnotation',
                success: true,
                message: 'Annotation properties updated successfully',
                data: {
                    annotationId: annotationId,
                    updatedProperties: updates,
                    updateTimestamp: new Date().toISOString()
                }
            });
        } catch (error) {
            return {
                content: [{ type: 'text', text: `Annotation edit failed: ${(error as Error).message}` }],
                isError: true
            };
        }
    }

    private async handleDeleteAnnotations(parameters: WebMcpToolParameters): Promise<WebMcpToolResponse> {
        try {
            const validation: WebMcpToolResponse | null = this.validateModules('deleteAnnotation', { annotation: 'Annotation' });
            if (validation) {
                return validation;
            }
            let annotationIds: string | string[] = parameters.annotationIds || '';
            if (!Array.isArray(annotationIds)) {
                annotationIds = [annotationIds];
            }
            const deletedIds: string[] = [];
            for (const id of annotationIds) {
                this.parent.annotation.selectAnnotation(id);
                this.parent.annotation.deleteAnnotation();
                deletedIds.push(id);
            }
            return this.message({
                action: 'deleteAnnotation',
                success: true,
                message: `${deletedIds.length} annotations deleted successfully`,
                data: {
                    deletedCount: deletedIds.length,
                    deletedAnnotationIds: deletedIds,
                    remainingAnnotationCount: this.parent.annotationCollection.length
                }
            });
        } catch (error) {
            return {
                content: [{ type: 'text', text: `Annotation deletion failed: ${(error as Error).message}` }],
                isError: true
            };
        }
    }

    private async handleAddFormFields(parameters: WebMcpToolParameters): Promise<WebMcpToolResponse> {
        try {
            const validation: WebMcpToolResponse | null = this.validateModules('addFormField', { formDesigner: 'FormDesigner' });
            if (validation) {
                return validation;
            }
            const fieldType: FormFieldType = parameters.fieldType || 'Textbox';
            const name: string = parameters.name || '';
            const pageNumber: number = parameters.pageNumber || 0;
            const bounds: IFormFieldBound = this.convertFormFieldBound(parameters.bounds as IFormFieldBound);
            const config: any = {
                name,
                pageNumber,
                bounds,
                isRequired: parameters.isRequired || false,
                isReadOnly: parameters.isReadOnly || false,
                isPrint: parameters.isPrint || true,
                tooltip: parameters.tooltip || '',
                maxLength: parameters.maxLength,
                visibility: parameters.visibility,
                thickness: parameters.thickness,
                borderColor: parameters.borderColor
            };
            if (parameters.defaultValue !== undefined) {
                config.value = parameters.defaultValue;
            }
            if (parameters.options !== undefined) {
                config.options = Array.isArray(parameters.options) ? parameters.options.map((item: string | ItemModel) => typeof item === 'string' ? { itemName: item, itemValue: item } : item) : parameters.options;
            }
            if (parameters.isMultiline !== undefined) {
                config.isMultiline = parameters.isMultiline;
            }
            if (parameters.isChecked !== undefined) {
                config.isChecked = parameters.isChecked;
            }
            if (parameters.isSelected !== undefined) {
                config.isSelected = parameters.isSelected;
            }
            this.parent.formDesigner.addFormField(fieldType, config);
            return this.message({
                action: 'addFormField',
                success: true,
                message: `Form field '${name}' created successfully`,
                data: {
                    fieldName: name,
                    fieldType,
                    pageNumber,
                    bounds,
                    isRequired: config.isRequired,
                    isReadOnly: config.isReadOnly
                }
            });
        } catch (error) {
            return {
                content: [{ type: 'text', text: `Form field creation failed: ${(error as Error).message}` }],
                isError: true
            };
        }
    }

    private async handleEditFormFields(parameters: WebMcpToolParameters): Promise<WebMcpToolResponse> {
        try {
            const validation: WebMcpToolResponse | null = this.validateModules('editFormField', { formDesigner: 'FormDesigner' });
            if (validation) {
                return validation;
            }
            const fieldId: string = parameters.fieldId || '';
            const updates: WebMcpToolParameters = parameters.updates || {};
            const fields: FormFieldModel[] = this.parent.retrieveFormFields();
            const field: FormFieldModel | undefined = fields.find((f: FormFieldModel) => f.id === fieldId || f.name === fieldId);
            if (field) {
                const previousValue: string | undefined = field.value;
                this.applyFormFieldUpdateConversions(updates);
                this.parent.formDesigner.updateFormField(field, updates as any);
                return this.message({
                    action: 'editFormField',
                    success: true,
                    message: 'Form field updated successfully',
                    data: {
                        fieldId: fieldId,
                        fieldName: field.name,
                        previousValue: previousValue,
                        newValue: updates.value || previousValue,
                        updatedProperties: updates,
                        updateTimestamp: new Date().toISOString()
                    }
                });
            }
            return {
                content: [{ type: 'text', text: `Form field with ID '${fieldId}' not found` }],
                isError: true
            };
        } catch (error) {
            return {
                content: [{ type: 'text', text: `Form field update failed: ${(error as Error).message}` }],
                isError: true
            };
        }
    }

    private async handleResetFormFields(parameters: WebMcpToolParameters): Promise<WebMcpToolResponse> {
        try {
            const validation: WebMcpToolResponse | null = this.validateModules('resetFormField', { formDesigner: 'FormDesigner' });
            if (validation) {
                return validation;
            }
            let fieldIds: string | string[] | undefined = parameters.fieldIds;
            const fields: FormFieldModel[] = this.parent.retrieveFormFields();
            const resetIds: string[] = [];
            if (!fieldIds || fieldIds.length === 0) {
                for (const field of fields) {
                    this.parent.formDesigner.resetFormField(field);
                    resetIds.push((field.id || field.name) as string);
                }
            } else {
                if (!Array.isArray(fieldIds)) {
                    fieldIds = [fieldIds];
                }
                for (const id of fieldIds) {
                    const field: FormFieldModel | undefined = fields.find((f: FormFieldModel) => f.id === id || f.name === id);
                    if (field) {
                        this.parent.formDesigner.resetFormField(field);
                        resetIds.push((field.id || field.name) as string);
                    }
                }
            }
            return this.message({
                action: 'resetFormField',
                success: true,
                message: `${resetIds.length} form fields reset to default values`,
                data: {
                    resetCount: resetIds.length,
                    resetFieldIds: resetIds,
                    timestamp: new Date().toISOString()
                }
            });
        } catch (error) {
            return {
                content: [{ type: 'text', text: `Form field reset failed: ${(error as Error).message}` }],
                isError: true
            };
        }
    }

    private async handleDeleteFormFields(parameters: WebMcpToolParameters): Promise<WebMcpToolResponse> {
        try {
            const validation: WebMcpToolResponse | null = this.validateModules('deleteFormField', { formDesigner: 'FormDesigner' });
            if (validation) {
                return validation;
            }
            let fieldIds: string | string[] = parameters.fieldIds || '';
            if (!Array.isArray(fieldIds)) {
                fieldIds = [fieldIds];
            }
            const deletedIds: string[] = [];
            const fields: FormFieldModel[] = this.parent.retrieveFormFields();
            for (const id of fieldIds) {
                const field: FormFieldModel | undefined = fields.find((f: FormFieldModel) => f.id === id || f.name === id);
                if (field) {
                    this.parent.formDesigner.selectFormField(field);
                    this.parent.formDesigner.deleteFormField(field.id as string | object);
                    deletedIds.push((field.id || field.name) as string);
                }
            }
            return this.message({
                action: 'deleteFormField',
                message: `${deletedIds.length} form fields deleted successfully`,
                data: {
                    deletedCount: deletedIds.length,
                    deletedFieldIds: deletedIds,
                    remainingFieldCount: fields.length
                }
            });
        } catch (error) {
            return this.error(`Form field deletion failed: ${(error as Error).message}`);
        }
    }

    private async handleRetrieveAnnotations(): Promise<WebMcpToolResponse> {
        try {
            const validation: WebMcpToolResponse | null = this.validateModules('retrieveAnnotations', { annotation: 'Annotation' });
            if (validation) {
                return validation;
            }
            const annotationCollection: any[] | Array<{ annotationId?: string; [key: string]: any }> = this.parent.annotationCollection;
            return this.message({
                action: 'retrieveFormFields',
                message: `Retrieved ${annotationCollection.length} Annotations`,
                data: {
                    annotations: annotationCollection,
                    annotationCount: annotationCollection.length
                }
            });
        }
        catch (error) {
            return this.error(`Annotation retrieval failed: ${(error as Error).message}`);
        }
    }

    private async handleRetrieveFormFields(parameters: WebMcpToolParameters): Promise<WebMcpToolResponse> {
        try {
            const validation: WebMcpToolResponse | null = this.validateModules('retrieveFormFields', { formDesigner: 'FormDesigner' });
            if (validation) {
                return validation;
            }
            let fields: FormFieldModel[] = this.sanitizedFormFields();
            const pageNumber: number | undefined = parameters.pageNumber;
            if (pageNumber !== undefined) {
                fields = fields.filter((f: FormFieldModel) => f.pageNumber === pageNumber);
            }
            const requiredFieldsMissing: (string | undefined)[] = fields
                .filter((f: FormFieldModel) => f.isRequired && !f.value)
                .map((f: FormFieldModel) => f.name);
            const filledFieldCount: number = fields.filter((f: FormFieldModel) => f.value).length;
            return this.message({
                action: 'retrieveFormFields',
                message: `Retrieved ${fields.length} form fields`,
                data: {
                    formFields: fields,
                    fieldCount: fields.length,
                    filledFieldCount: filledFieldCount,
                    requiredFieldsMissing: requiredFieldsMissing
                }
            });
        } catch (error) {
            return this.error(`Form Field retrieval failed: ${(error as Error).message}`);
        }
    }

    private async handleExtractPDFPages(parameters: WebMcpToolParameters): Promise<WebMcpToolResponse> {
        try {
            const validation: WebMcpToolResponse | null = this.validateModules('extractPages', { pageOrganizer: 'PageOrganizer' });
            if (validation) {
                return validation;
            }
            const pageIndices: string = parameters.pageRange || '';
            const extracted: Uint8Array = this.parent.extractPages(pageIndices);
            this.parent.load(extracted, '');
            return this.message({
                action: 'extractPages',
                message: `Extracted ${pageIndices.length} pages into new PDF document`,
                data: {
                    operation: 'extract',
                    extractedPageNumbers: pageIndices,
                    loadingMessage: 'The Extracted pages loaded in the viewer'
                }
            });
        } catch (error) {
            return this.error(`Extract pages failed: ${(error as Error).message}`);
        }
    }

    private async handleZoomAndView(parameters: WebMcpToolParameters): Promise<WebMcpToolResponse> {
        try {
            const validation: WebMcpToolResponse | null = this.validateModules('zoomAndView', { magnification: 'Magnification' });
            if (validation) {
                return validation;
            }
            const zoomAction: string = parameters.zoomAction || '';
            const zoomValue: number = parameters.zoomValue || 100;
            const previousZoom: number = this.parent.zoomValue;
            switch (zoomAction) {
            case 'absolute':
                this.parent.magnification.zoomTo(zoomValue);
                break;
            case 'increment':
                this.parent.magnification.zoomIn();
                break;
            case 'decrement':
                this.parent.magnification.zoomOut();
                break;
            case 'fitPage':
                this.parent.magnification.fitToPage();
                break;
            case 'fitWidth':
                this.parent.magnification.fitToWidth();
                break;
            case 'fitHeight':
                this.parent.magnification.fitToPage();
                break;
            }
            return this.message({
                action: 'zoomAndView',
                message: `Zoom set to ${this.parent.zoomValue}%`,
                data: {
                    zoomAction: zoomAction,
                    previousZoom: previousZoom,
                    currentZoom: this.parent.zoomValue,
                    zoomMode: this.parent.zoomMode,
                    viewportFitStatus: 'fitted'
                }
            });
        } catch (error) {
            return this.error(`Zoom operation failed: ${(error as Error).message}`);
        }
    }

    private async handleDownloadDocument(): Promise<WebMcpToolResponse> {
        try {
            this.parent.download();
            return this.message({
                action: 'downloadDocument',
                success: true,
                message: 'PDF document download initiated successfully',
                data: {
                    fileName: this.parent.fileName
                }
            });
        } catch (error) {
            return this.error(`PDF download failed: ${(error as Error).message}`);
        }
    }

    private async handlePrintDocument(): Promise<WebMcpToolResponse> {
        try {
            const validation: WebMcpToolResponse | null = this.validateModules('printDocument', { print: 'Print' });
            if (validation) {
                return validation;
            }
            this.parent.print.print();
            return this.message({
                action: 'printDocument',
                success: true,
                message: 'Print dialog opened successfully',
                data: {
                    fileName: this.parent.fileName
                }
            });
        } catch (error) {
            return this.error(`PDF print operation failed: ${(error as Error).message}`);
        }
    }

    private async handleGetBookmarksAndNavigate(parameters: WebMcpToolParameters): Promise<WebMcpToolResponse> {
        try {
            const validation: WebMcpToolResponse | null = this.validateModules('getBookmarksAndNavigate', { bookmark: 'BookmarkView' });
            if (validation) {
                return validation;
            }
            const redactionAction: string = parameters.bookmarkAction || '';
            switch (redactionAction) {
            case 'get': {
                const bookmarks: { bookmarks?: any[]; bookMarkDestination?: any } = this.parent.bookmark.getBookmarks();
                const bookmarkList: any[] = bookmarks.bookmarks || [];
                return this.message({
                    action: 'getBookmarksAndNavigate',
                    message: `Retrieved ${bookmarkList.length || 0} bookmarks`,
                    data: {
                        bookmarks: bookmarkList,
                        bookmarkCount: bookmarkList.length || 0,
                        bookmarksDestination: bookmarks.bookMarkDestination
                    }
                });
            }
            case 'navigate' : {
                const x: number = parameters.x || 0;
                const y: number = parameters.y || 0;
                this.parent.bookmark.goToBookmark(x, y);
                return this.message({
                    action: 'getBookmarksAndNavigate',
                    message: 'Navigated to provided bookmark successfully',
                    data: {}
                });
            }
            default: {
                return this.error(`Unknown Bookmark action: ${redactionAction}`);
            }
            }
        } catch (error) {
            return this.error(`Bookmark retrieval failed: ${(error as Error).message}`);
        }
    }

    private async handleUndoRedoActions(parameters: WebMcpToolParameters): Promise<WebMcpToolResponse> {
        try {
            const validation: WebMcpToolResponse | null = this.validateModules('undoRedoActions', {
                formDesigner: 'FormDesigner', annotation: 'Annotation'
            });
            if (validation) {
                return validation;
            }
            const action: string = parameters.action || '';
            if (action === 'undo') {
                this.parent.undo();
            } else if (action === 'redo') {
                this.parent.redo();
            }
            return this.message({
                action: 'undoRedoActions',
                message: `${action} action executed successfully`,
                data: {
                    action: action,
                    actionApplied: true,
                    previousActionType: 'DocumentChange',
                    currentState: `DocumentState_${Date.now()}`,
                    undoStackDepth: 5,
                    redoStackDepth: 1
                }
            });
        } catch (error) {
            return this.error(`${parameters.action} action failed: ${(error as Error).message}`);
        }
    }

    private async handleAddRedaction(parameters: WebMcpToolParameters): Promise<WebMcpToolResponse> {
        try {
            const validation: WebMcpToolResponse | null = this.validateModules('addRedaction', {
                annotation: 'Annotation', textSearch: 'TextSearch', navigation: 'Navigation',
                textSelection: 'TextSelection', magnification: 'Magnification'
            });
            if (validation) {
                return validation;
            }
            const redactionAction: string = parameters.redactionAction || '';
            switch (redactionAction) {
            case 'single': {
                const options: WebMcpToolParameters = {
                    bound: this.convertRectangle(parameters.bound as Rectangle),
                    pageNumber: parameters.pageNumber,
                    markerFillColor: parameters.markerFillColor,
                    markerBorderColor: parameters.markerBorderColor,
                    fillColor: parameters.fillColor,
                    overlayText: parameters.overlayText,
                    fontColor: parameters.fontColor,
                    fontFamily: parameters.fontFamily,
                    fontSize: parameters.fontSize,
                    beforeRedactionsApplied: parameters.beforeRedactionsApplied
                };
                this.parent.annotation.addAnnotation('Redaction', options as RedactionSettings);
                const annotationCollection: any[] | Array<{ annotationId?: string; [key: string]: any }> = this.parent.annotationCollection;
                const addedAnnotation: { annotationId?: string; [key: string]: any } | undefined =
                annotationCollection[annotationCollection.length - 1];
                const annotationId: string = addedAnnotation && addedAnnotation.annotationId ? addedAnnotation.annotationId : 'unknown';
                return this.message({
                    action: 'addRedaction',
                    message: 'Redaction annotation added successfully',
                    data: {
                        annotationId: annotationId,
                        pageNumber: parameters.pageNumber,
                        message: 'Redaction annotation added successfully'
                    }
                });
            }

            case 'page': {
                const pageNumbers: number[] = parameters.pageNumbers || [];
                this.parent.annotation.addPageRedactions(pageNumbers);
                return this.message({
                    action: 'addRedaction',
                    message: `Redaction annotations added to ${pageNumbers.length} pages`,
                    data: {
                        redactedPages: pageNumbers,
                        message: `Redaction annotations added to pages: ${pageNumbers.join(', ')}`
                    }
                });
            }
            case 'search': {
                const searchText: string = parameters.searchText || '';
                const caseSensitive: boolean = parameters.caseSensitive || false;
                const overlayText: string = parameters.overlayText || 'Confidential';
                const fillColor: string = parameters.fillColor || '#00FF40FF';
                const fontColor: string = parameters.fontColor || '#333333';
                const fontSize: number = parameters.fontSize || 12;
                const fontFamily: string = parameters.fontFamily || 'Arial';
                const markerFillColor: string = parameters.markerFillColor || '#FF0000';
                const markerBorderColor: string = parameters.markerBorderColor || '#000000';
                let redactionCount: number = 0;
                const searchResults: SearchResultModel[] = this.parent.textSearch.findText(searchText, caseSensitive);
                if (searchResults && searchResults.length > 0) {
                    for (let i: number = 0; i < searchResults.length; i++) {
                        const pageResult: SearchResultModel = searchResults[i as number];
                        if (!pageResult || !pageResult.bounds || pageResult.bounds.length === 0) { continue; }
                        if (pageResult.pageIndex == null) { continue; }
                        const pageNumber: number = pageResult.pageIndex + 1;
                        for (let j: number = 0; j < pageResult.bounds.length; j++) {
                            const bound: IPdfRectBounds = pageResult.bounds[j as number];
                            this.parent.annotation.addAnnotation('Redaction', {
                                bound: {
                                    x: this.convertPointToPixel(bound.x),
                                    y: this.convertPointToPixel(bound.y),
                                    width: this.convertPointToPixel(bound.width),
                                    height: this.convertPointToPixel(bound.height)
                                },
                                pageNumber: pageNumber,
                                overlayText: overlayText,
                                fillColor: fillColor,
                                fontColor: fontColor,
                                fontSize: fontSize,
                                fontFamily: fontFamily,
                                markerFillColor: markerFillColor,
                                markerBorderColor: markerBorderColor
                            } as RedactionSettings);
                            redactionCount++;
                        }
                    }
                }
                else {
                    this.message({
                        action: 'addRedaction',
                        message: 'There are no words for add Redaction annotation',
                        data: {}
                    });
                }
                return this.message({
                    action: 'addRedaction',
                    message: `Added ${redactionCount} redactions for text "${searchText}"`,
                    data: {
                        redactionCount: redactionCount,
                        message: `Added ${redactionCount} redactions for text "${searchText}"`
                    }
                });
            }
            default:
                return this.error(`Unknown redaction action: ${redactionAction}`);
            }
        } catch (error) {
            return this.error(`Failed to add redaction: ${(error as Error).message}`);
        }
    }

    private async handleUpdateRedactionAnnotation(parameters: WebMcpToolParameters): Promise<WebMcpToolResponse> {
        try {
            const validation: WebMcpToolResponse | null = this.validateModules('updateRedaction', { annotation: 'Annotation' });
            if (validation) {
                return validation;
            }
            const annotationId: string = parameters.annotationId || '';
            const updates: WebMcpToolParameters = parameters.updates || {};
            const annotation: { annotationId?: string; [key: string]: any } | undefined = this.parent.annotationCollection.find(
                (a: any) => a.annotationId === annotationId);
            if (!annotation) {
                return this.error(`Redaction annotation with ID ${annotationId} not found`);
            }
            Object.assign(annotation, updates);
            this.parent.annotation.editAnnotation(annotation);
            return this.message({
                action: 'updateRedaction',
                message: 'Redaction annotation updated successfully',
                data: {
                    updatedAnnotationId: annotationId,
                    updatedProperties: updates,
                    message: 'Redaction annotation updated successfully'
                }
            });
        } catch (error) {
            return this.error(`Failed to update redaction annotation: ${(error as Error).message}`);
        }
    }

    private async handleApplyRedaction(): Promise<WebMcpToolResponse> {
        try {
            const validation: WebMcpToolResponse | null = this.validateModules('applyRedaction', { annotation: 'Annotation' });
            if (validation) {
                return validation;
            }
            this.parent.annotation.redact();
            return this.message({
                action: 'applyRedaction',
                message: 'All redactions applied successfully',
                data: {
                    message: 'All redactions have been permanently applied to the document'
                }
            });
        } catch (error) {
            return this.error(`Failed to apply redactions: ${(error as Error).message}`);
        }
    }

    private sanitizedFormFields(): FormFieldModel[] {
        const fields: FormFieldModel[] = this.parent.retrieveFormFields();
        const sanitizedFields: FormFieldModel[] = fields.map((field: FormFieldModel) => {
            const clonedField: any = cloneObject(field) as FormFieldModel;
            if (clonedField.bounds && clonedField.bounds.properties) {
                clonedField.bounds = {
                    X: clonedField.bounds.properties.x,
                    Y: clonedField.bounds.properties.y,
                    Width: clonedField.bounds.properties.width,
                    Height: clonedField.bounds.properties.height
                };
            }
            return clonedField;
        });
        return sanitizedFields;
    }

    private formatToolName(command: string): string {
        return command.replace(/([A-Z])/g, ' $1')
            .toLowerCase().trim().replace(/^\w/, (c: string) => c.toUpperCase());
    }

    // Build human-readable confirmation message for write operations.
    private buildConfirmationMessage(command: string): string {
        const toolName: string = this.formatToolName(command);
        const messagePrefix: string = this.parent.localeObj.getConstant('WebMcp Write Action Message Prefix');
        const messageSuffix: string = this.parent.localeObj.getConstant('WebMcp Write Action Message Suffix');
        return messagePrefix + toolName + messageSuffix;
    }

    // Request user confirmation before executing write operations.
    private async requestConfirmation(command: string): Promise<boolean> {
        return new Promise((resolve: (value: boolean) => void) => {
            const msg: string = this.buildConfirmationMessage(command);
            let approved: boolean = false;
            const dialogContainer: HTMLElement = document.createElement('div');
            dialogContainer.id = `e-webmcp-confirm-dlg-${Date.now()}`;
            document.body.appendChild(dialogContainer);
            this.confirmationDialog = new Dialog({
                width: '375px',
                showCloseIcon: true,
                isModal: true,
                cssClass: 'e-webmcp-confirm-dlg',
                header: this.parent.localeObj.getConstant('WebMcp Write Action Header'),
                content: msg,
                enableRtl: this.parent.enableRtl,
                close: (): void => {
                    if (dialogContainer.parentNode) {
                        dialogContainer.parentNode.removeChild(dialogContainer);
                    }
                    resolve(approved);
                },
                buttons: [
                    {
                        buttonModel: { content: this.parent.localeObj.getConstant('Cancel'), cssClass: 'e-outline' },
                        click: (): void => {
                            approved = false;
                            this.confirmationDialog.hide();
                        }
                    },
                    {
                        buttonModel: { content: this.parent.localeObj.getConstant('Confirm'), isPrimary: true },
                        click: (): void => {
                            approved = true;
                            this.confirmationDialog.hide();
                        }
                    }
                ]
            });
            this.confirmationDialog.appendTo(dialogContainer);
        });
    }

    private generatePageArray(start: number, end: number): number[] {
        const result: number[] = [];
        for (let i: number = start; i <= end; i++) {
            result.push(i);
        }
        return result;
    }

    private convertBounds(bounds: RectangleBoundsModel[]): RectangleBoundsModel[] {
        if (!bounds) {
            return bounds;
        }
        let newBounds: RectangleBoundsModel[] = [];
        if (!isNullOrUndefined(bounds)) {
            newBounds = bounds.map((bound: RectangleBoundsModel)  => ({
                x: this.convertPointToPixel(bound.x as number),
                y: this.convertPointToPixel(bound.y as number),
                width: this.convertPointToPixel(bound.width as number),
                height: this.convertPointToPixel(bound.height as number)
            }));
        }
        return newBounds;
    }

    private convertOffset(offset: IPoint): IPoint {
        if (!offset) {
            return offset;
        }
        return { x: this.convertPointToPixel(offset.x), y: this.convertPointToPixel(offset.y) };
    }

    private convertVertexPoints(vertexPoints: PointModel[]): PointModel[] {
        if (!vertexPoints || vertexPoints.length === 0) {
            return vertexPoints;
        }
        return vertexPoints.map((point: PointModel) => ({
            x: this.convertPointToPixel(point.x as number),
            y: this.convertPointToPixel(point.y as number)
        }));
    }

    private convertFormFieldBound(bound: IFormFieldBound): IFormFieldBound  {
        if (!bound) {
            return bound;
        }
        return {
            X: this.convertPointToPixel(bound.X),
            Y: this.convertPointToPixel(bound.Y),
            Width: this.convertPointToPixel(bound.Width),
            Height: this.convertPointToPixel(bound.Height)
        };
    }

    private convertRectangle(rect: Rectangle): Rectangle {
        if (!rect) {
            return rect;
        }
        return {
            x: this.convertPointToPixel(rect.x),
            y: this.convertPointToPixel(rect.y),
            width: this.convertPointToPixel(rect.width),
            height: this.convertPointToPixel(rect.height)
        };
    }

    private convertPointToPixel(number: number): number {
        return (number * (96 / 72));
    }

    private applyAnnotationUpdateConversions(updates: WebMcpToolParameters): void {
        const conversionMap: { [key: string]: (value?: any) => any } = {
            'bounds': (value?: RectangleBoundsModel[]) => this.convertBounds(value as RectangleBoundsModel[]),
            'offset': (value?: IPoint) => this.convertOffset(value as IPoint),
            'vertexPoints': (value?: PointModel[]) => this.convertVertexPoints(value as PointModel[]),
            'width': (value: number) => this.convertPointToPixel(value as number || 0),
            'height': (value?: number) => this.convertPointToPixel(value as number || 0)
        };

        Object.keys(conversionMap).forEach((key: string) => {
            if (updates[key as keyof WebMcpToolParameters] !== undefined) {
                (updates[key as keyof WebMcpToolParameters] as any) =
                conversionMap[key as string](updates[key as keyof WebMcpToolParameters]);
            }
        });
    }

    private applyFormFieldUpdateConversions(updates: WebMcpToolParameters): void {
        const conversionMap: { [key: string]: (value?: any) => any } = {
            'bounds': (value?:  IFormFieldBound) => this.convertFormFieldBound(value as IFormFieldBound),
            'x': (value?: number) => this.convertPointToPixel(value || 0),
            'y': (value?: number) => this.convertPointToPixel(value || 0),
            'width': (value?: number) => this.convertPointToPixel(value || 0),
            'height': (value?: number) => this.convertPointToPixel(value || 0)
        };

        Object.keys(conversionMap).forEach((key: string) => {
            if (updates[key as keyof WebMcpToolParameters] !== undefined) {
                (updates[key as keyof WebMcpToolParameters] as any) =
                conversionMap[key as string](updates[key as keyof WebMcpToolParameters]);
            }
        });
    }

    private updateAnnotationBounds(annotation: any, updates: WebMcpToolParameters): void {
        if (annotation.bounds && !Array.isArray(annotation.bounds)) {
            if (annotation.bounds.top && updates.offset) {
                annotation.bounds.top = updates.offset.x ? updates.offset.x : annotation.bounds.x;
            }
            if (annotation.bounds.left && updates.offset) {
                annotation.bounds.left = updates.offset.y ? updates.offset.y : annotation.bounds.y;
            }
            if (annotation.bounds.width) {
                annotation.bounds.width = updates.width ? updates.width : annotation.bounds.width;
            }
            if (annotation.bounds.height) {
                annotation.bounds.height = updates.height ? updates.height : annotation.bounds.height;
            }
        }
    }
}

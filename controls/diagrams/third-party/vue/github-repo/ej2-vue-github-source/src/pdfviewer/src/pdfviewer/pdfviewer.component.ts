import { ComponentBase, gh, getProps, isExecute, vueDefineComponent, DefineVueComponent } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined, getValue } from '@syncfusion/ej2-base';

import { PdfViewer, PdfViewerModel } from '@syncfusion/ej2-pdfviewer';


export const properties: string[] = ['isLazyUpdate', 'plugins', 'DropdownFieldSettings', 'ajaxRequestSettings', 'annotationDrawingOptions', 'annotationSelectorSettings', 'annotationSettings', 'annotations', 'areaSettings', 'arrowSettings', 'checkBoxFieldSettings', 'circleSettings', 'commandManager', 'contextMenuOption', 'contextMenuSettings', 'currentPageNumber', 'customContextMenuItems', 'customFonts', 'customStamp', 'customStampSettings', 'customTextStamps', 'dateTimeFormat', 'designerMode', 'disableContextMenuItems', 'disableDefaultContextMenu', 'distanceSettings', 'documentLinkSettings', 'documentPath', 'downloadFileName', 'drawingObject', 'enableAccessibilityTags', 'enableAnnotation', 'enableAnnotationToolbar', 'enableAutoComplete', 'enableBookmark', 'enableBookmarkStyles', 'enableCollaborativeEditing', 'enableCommentPanel', 'enableDesktopMode', 'enableDownload', 'enableFormDesigner', 'enableFormDesignerToolbar', 'enableFormFields', 'enableFormFieldsValidation', 'enableFreeText', 'enableHandwrittenSignature', 'enableHtmlSanitizer', 'enableHyperlink', 'enableImportAnnotationMeasurement', 'enableInkAnnotation', 'enableInkEraser', 'enableLinkAnnotation', 'enableLocalStorage', 'enableMagnification', 'enableMeasureAnnotation', 'enableMultiLineOverlap', 'enableMultiPageAnnotation', 'enableNavigation', 'enableNavigationToolbar', 'enablePageOrganizer', 'enablePersistence', 'enablePinchZoom', 'enablePrint', 'enablePrintRotation', 'enableRedactionToolbar', 'enableRtl', 'enableShapeAnnotation', 'enableShapeLabel', 'enableStampAnnotations', 'enableStickyNotesAnnotation', 'enableTextMarkupAnnotation', 'enableTextMarkupResizer', 'enableTextSearch', 'enableTextSelection', 'enableThumbnail', 'enableToolbar', 'enableWebMcp', 'enableZoomOptimization', 'exportAnnotationFileName', 'extractTextOption', 'formFieldCollections', 'formFields', 'freeTextSettings', 'handWrittenSignatureSettings', 'height', 'hideEmptyDigitalSignatureFields', 'hideSaveSignature', 'highlightSettings', 'hyperlinkOpenState', 'initialDialogSettings', 'initialFieldSettings', 'initialRenderPages', 'inkAnnotationSettings', 'inkEraserSize', 'interactionMode', 'isAnnotationToolbarOpen', 'isAnnotationToolbarVisible', 'isBookmarkPanelOpen', 'isCommandPanelOpen', 'isDocumentEdited', 'isExtractText', 'isFormDesignerToolbarVisible', 'isFormFieldDocument', 'isInitialFieldToolbarSelection', 'isMaintainSelection', 'isPageOrganizerOpen', 'isRedactionToolbarVisible', 'isSignatureEditable', 'isThumbnailViewOpen', 'isValidFreeText', 'lineSettings', 'listBoxFieldSettings', 'locale', 'maxZoom', 'measurementSettings', 'minZoom', 'pageCount', 'pageOrganizerSettings', 'passwordFieldSettings', 'perimeterSettings', 'polygonSettings', 'printMode', 'printScaleFactor', 'radioButtonFieldSettings', 'radiusSettings', 'rectangleSettings', 'redactionSettings', 'resourceUrl', 'restrictZoomRequest', 'retryCount', 'retryStatusCodes', 'retryTimeout', 'scrollSettings', 'selectedItems', 'serverActionSettings', 'serviceUrl', 'shapeLabelSettings', 'showCustomContextMenuBottom', 'showDigitalSignatureAppearance', 'showNotificationDialog', 'signatureDialogSettings', 'signatureFieldSettings', 'signatureFitMode', 'squigglySettings', 'stampSettings', 'stickyNotesSettings', 'strikethroughSettings', 'textFieldSettings', 'textSearchColorSettings', 'tileRenderingSettings', 'toolbarSettings', 'underlineSettings', 'volumeSettings', 'webLinkSettings', 'width', 'zoomMode', 'zoomValue', 'addSignature', 'ajaxRequestFailed', 'ajaxRequestInitiate', 'ajaxRequestSuccess', 'annotationAdd', 'annotationChanged', 'annotationDoubleClick', 'annotationMouseLeave', 'annotationMouseover', 'annotationMove', 'annotationMoving', 'annotationPropertiesChange', 'annotationRemove', 'annotationResize', 'annotationSelect', 'annotationUnSelect', 'beforeAddFreeText', 'beforeWebMcpToolExecute', 'bookmarkClick', 'buttonFieldClick', 'commentAdd', 'commentDelete', 'commentEdit', 'commentSelect', 'commentStatusChanged', 'created', 'customContextMenuBeforeOpen', 'customContextMenuSelect', 'documentChanged', 'documentLoad', 'documentLoadFailed', 'documentUnload', 'downloadEnd', 'downloadStart', 'exportFailed', 'exportStart', 'exportSuccess', 'extractTextCompleted', 'formFieldAdd', 'formFieldChanged', 'formFieldClick', 'formFieldDoubleClick', 'formFieldFocusOut', 'formFieldMouseLeave', 'formFieldMouseover', 'formFieldMove', 'formFieldPropertiesChange', 'formFieldRemove', 'formFieldResize', 'formFieldSelect', 'formFieldUnselect', 'hyperlinkClick', 'hyperlinkMouseOver', 'importFailed', 'importStart', 'importSuccess', 'keyboardCustomCommands', 'moveSignature', 'pageChange', 'pageClick', 'pageMouseover', 'pageOrganizerSaveAs', 'pageOrganizerSaved', 'pageRenderComplete', 'pageRenderInitiate', 'printEnd', 'printStart', 'removeSignature', 'resizeSignature', 'resourcesLoaded', 'signaturePropertiesChange', 'signatureSelect', 'signatureUnselect', 'textSearchComplete', 'textSearchHighlight', 'textSearchStart', 'textSelectionEnd', 'textSelectionStart', 'thumbnailClick', 'toolbarClick', 'validateFormFields', 'zoomChange', 'pageOrganizerZoomChanged'];
export const modelProps: string[] = [];

export const testProp: any = getProps({props: properties});
export const props = testProp[0], watch = testProp[1], emitProbs: any = Object.keys(watch);
emitProbs.push('modelchanged', 'update:modelValue');
for (let props of modelProps) { emitProbs.push('update:'+props) }

/**
 * `ejs-pdfviewer` represents the VueJS PdfViewer Component.
 * ```html
 * <ejs-pdfviewer></ejs-pdfviewer>
 * ```
 */
export let PdfViewerComponent: DefineVueComponent<PdfViewerModel> =  vueDefineComponent({
    name: 'PdfViewerComponent',
    mixins: [ComponentBase],
    props: props,
    watch: watch,
    emits: emitProbs,
    provide() { return { custom: this.custom } },
    data() {
        return {
            ej2Instances: new PdfViewer({}) as any,
            propKeys: properties as string[],
            models: modelProps as string[],
            hasChildDirective: false as boolean,
            hasInjectedModules: true as boolean,
            tagMapper: {} as { [key: string]: Object },
            tagNameMapper: {} as Object,
            isVue3: !isExecute as boolean,
            templateCollection: {} as any,
        }
    },
    created() {

        this.bindProperties();
        this.ej2Instances._setProperties = this.ej2Instances.setProperties;
        this.ej2Instances.setProperties = this.setProperties;
        this.ej2Instances.clearTemplate = this.clearTemplate;
        this.updated = this.updated;
    },
    render(createElement: any) {
        let h: any = !isExecute ? gh : createElement;
        let slots: any = null;
        if(!isNullOrUndefined((this as any).$slots.default)) {
            slots = !isExecute ? (this as any).$slots.default() : (this as any).$slots.default;
        }
        return h('div', slots);
    },
    methods: {
        clearTemplate(templateNames?: string[]): any {
            if (!templateNames){ templateNames = Object.keys(this.templateCollection || {}) }
            if (templateNames.length &&  this.templateCollection) {
                for (let tempName of templateNames){
                    let elementCollection: any = this.templateCollection[tempName];
                    if(elementCollection && elementCollection.length) {
                        for(let ele of elementCollection) {
                            this.destroyPortals(ele);
                        }
                        delete this.templateCollection[tempName];
                    }
                }
            }
        },
        setProperties(prop: any, muteOnChange: boolean): void {
            if(this.isVue3) { this.models = !this.models ? this.ej2Instances.referModels : this.models }
            if (this.ej2Instances && this.ej2Instances._setProperties) {
                this.ej2Instances._setProperties(prop, muteOnChange);
            }
            if (prop && this.models && this.models.length) {
                Object.keys(prop).map((key: string): void => {
                    this.models.map((model: string): void => {
                        if ((key === model) && !(/datasource/i.test(key))) {
                            if (this.isVue3) {
                                this.ej2Instances.vueInstance.$emit('update:' + key, prop[key]);
                            } else {
                                (this as any).$emit('update:' + key, prop[key]);
                                (this as any).$emit('modelchanged', prop[key]);
                            }
                        }
                    });
                });
            }
        },
        custom(): void {
            this.updated();
        },
        addAnnotation(annotation: any): void {
            return this.ej2Instances.addAnnotation(annotation);
        },
        addCustomMenu(menuItems: Object[], disableDefaultItems?: boolean, appendToEnd?: boolean): void {
            return this.ej2Instances.addCustomMenu(menuItems, disableDefaultItems, appendToEnd);
        },
        applyPageOrganizerActions(actions: string, showPopup: boolean): void {
            return this.ej2Instances.applyPageOrganizerActions(actions, showPopup);
        },
        clearFormFields(formField?: any): void {
            return this.ej2Instances.clearFormFields(formField);
        },
        convertClientPointToPagePoint(clientPoint: Object, pageNumber: number): Object {
            return this.ej2Instances.convertClientPointToPagePoint(clientPoint, pageNumber);
        },
        convertPagePointToClientPoint(pagePoint: Object, pageNumber: number): Object {
            return this.ej2Instances.convertPagePointToClientPoint(pagePoint, pageNumber);
        },
        convertPagePointToScrollingPoint(pagePoint: Object, pageNumber: number): Object {
            return this.ej2Instances.convertPagePointToScrollingPoint(pagePoint, pageNumber);
        },
        deleteAnnotations(): void {
            return this.ej2Instances.deleteAnnotations();
        },
        destroy(): void {
            return this.ej2Instances.destroy();
        },
        download(): void {
            return this.ej2Instances.download();
        },
        exportAnnotation(annotationDataFormat?: Object): void {
            return this.ej2Instances.exportAnnotation(annotationDataFormat);
        },
        exportAnnotationsAsBase64String(annotationDataFormat: Object): Object {
            return this.ej2Instances.exportAnnotationsAsBase64String(annotationDataFormat);
        },
        exportAnnotationsAsObject(annotationDataFormat: Object): Object {
            return this.ej2Instances.exportAnnotationsAsObject(annotationDataFormat);
        },
        exportFormFields(data?: string, formFieldDataFormat?: Object): void {
            return this.ej2Instances.exportFormFields(data, formFieldDataFormat);
        },
        exportFormFieldsAsObject(formFieldDataFormat: Object): Object {
            return this.ej2Instances.exportFormFieldsAsObject(formFieldDataFormat);
        },
        extractPages(value: string): Object {
            return this.ej2Instances.extractPages(value);
        },
        extractText(pageIndex: number, options: Object): Object {
            return this.ej2Instances.extractText(pageIndex, options);
        },
        focusFormField(field: any): void {
            return this.ej2Instances.focusFormField(field);
        },
        getPageInfo(pageIndex: number): Object {
            return this.ej2Instances.getPageInfo(pageIndex);
        },
        getPageNumberFromClientPoint(clientPoint: Object): number {
            return this.ej2Instances.getPageNumberFromClientPoint(clientPoint);
        },
        getWebMcpTools(toolNames?: string[]): Object[] {
            return this.ej2Instances.getWebMcpTools(toolNames);
        },
        importAnnotation(importData: any, annotationDataFormat?: Object): void {
            return this.ej2Instances.importAnnotation(importData, annotationDataFormat);
        },
        importFormFields(data?: string, formFieldDataFormat?: Object): void {
            return this.ej2Instances.importFormFields(data, formFieldDataFormat);
        },
        load(document: string | Object, password: string): void {
            return this.ej2Instances.load(document, password);
        },
        redo(): void {
            return this.ej2Instances.redo();
        },
        registerWebMcpTools(prefix?: string, tools?: string[] | Object[], exposedTo?: string[]): void {
            return this.ej2Instances.registerWebMcpTools(prefix, tools, exposedTo);
        },
        removeSemanticTextCompare(targetViewer: Object): Object {
            return this.ej2Instances.removeSemanticTextCompare(targetViewer);
        },
        requiredModules(): Object[] {
            return this.ej2Instances.requiredModules();
        },
        resetFormFields(): void {
            return this.ej2Instances.resetFormFields();
        },
        retrieveFormFields(): Object[] {
            return this.ej2Instances.retrieveFormFields();
        },
        saveAsBlob(): Object {
            return this.ej2Instances.saveAsBlob();
        },
        semanticTextCompare(targetViewer: Object, options?: Object): Object {
            return this.ej2Instances.semanticTextCompare(targetViewer, options);
        },
        setJsonData(jsonData: any): void {
            return this.ej2Instances.setJsonData(jsonData);
        },
        showNotificationPopup(errorString: string): void {
            return this.ej2Instances.showNotificationPopup(errorString);
        },
        syncViewers(targetViewer: Object, enable: boolean): void {
            return this.ej2Instances.syncViewers(targetViewer, enable);
        },
        undo(): void {
            return this.ej2Instances.undo();
        },
        unload(): void {
            return this.ej2Instances.unload();
        },
        updateFormFields(formFields: any): void {
            return this.ej2Instances.updateFormFields(formFields);
        },
        updateFormFieldsValue(fieldValue: any): void {
            return this.ej2Instances.updateFormFieldsValue(fieldValue);
        },
        updateViewerContainer(): void {
            return this.ej2Instances.updateViewerContainer();
        },
        zoomToRect(rectangle: Object): void {
            return this.ej2Instances.zoomToRect(rectangle);
        },
    }
});

export type PdfViewerComponent = typeof ComponentBase & {
    ej2Instances: PdfViewer;
    isVue3: boolean;
    isLazyUpdate: Boolean;
    plugins: any[];
    propKeys: string[];
    models: string[];
    hasChildDirective: boolean;
    tagMapper: {
        [key: string]: Object;
    };
    tagNameMapper: Object;
    setProperties(prop: any, muteOnChange: boolean): void;
    trigger(eventName: string, eventProp: {
        [key: string]: Object;
    }, successHandler?: Function): void;
    addAnnotation(annotation: any): void;
    addCustomMenu(menuItems: Object[], disableDefaultItems?: boolean, appendToEnd?: boolean): void;
    applyPageOrganizerActions(actions: string, showPopup: boolean): void;
    clearFormFields(formField?: any): void;
    convertClientPointToPagePoint(clientPoint: Object, pageNumber: number): Object;
    convertPagePointToClientPoint(pagePoint: Object, pageNumber: number): Object;
    convertPagePointToScrollingPoint(pagePoint: Object, pageNumber: number): Object;
    deleteAnnotations(): void;
    destroy(): void;
    download(): void;
    exportAnnotation(annotationDataFormat?: Object): void;
    exportAnnotationsAsBase64String(annotationDataFormat: Object): Object;
    exportAnnotationsAsObject(annotationDataFormat: Object): Object;
    exportFormFields(data?: string, formFieldDataFormat?: Object): void;
    exportFormFieldsAsObject(formFieldDataFormat: Object): Object;
    extractPages(value: string): Object;
    extractText(pageIndex: number, options: Object): Object;
    focusFormField(field: any): void;
    getPageInfo(pageIndex: number): Object;
    getPageNumberFromClientPoint(clientPoint: Object): number;
    getWebMcpTools(toolNames?: string[]): Object[];
    importAnnotation(importData: any, annotationDataFormat?: Object): void;
    importFormFields(data?: string, formFieldDataFormat?: Object): void;
    load(document: string | Object, password: string): void;
    redo(): void;
    registerWebMcpTools(prefix?: string, tools?: string[] | Object[], exposedTo?: string[]): void;
    removeSemanticTextCompare(targetViewer: Object): Object;
    requiredModules(): Object[];
    resetFormFields(): void;
    retrieveFormFields(): Object[];
    saveAsBlob(): Object;
    semanticTextCompare(targetViewer: Object, options?: Object): Object;
    setJsonData(jsonData: any): void;
    showNotificationPopup(errorString: string): void;
    syncViewers(targetViewer: Object, enable: boolean): void;
    undo(): void;
    unload(): void;
    updateFormFields(formFields: any): void;
    updateFormFieldsValue(fieldValue: any): void;
    updateViewerContainer(): void;
    zoomToRect(rectangle: Object): void
};

export const PdfViewerPlugin = {
    name: 'ejs-pdfviewer',
    install(Vue: any) {
        Vue.component(PdfViewerPlugin.name, PdfViewerComponent);

    }
}
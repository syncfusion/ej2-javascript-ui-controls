import { ComponentBase, gh, getProps, isExecute, vueDefineComponent, DefineVueComponent } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined, getValue } from '@syncfusion/ej2-base';

import { DocumentEditor, DocumentEditorModel } from '@syncfusion/ej2-documenteditor';


export const properties: string[] = ['isLazyUpdate', 'plugins', 'acceptTab', 'autoResizeOnVisibilityChange', 'currentUser', 'defaultPasteOption', 'documentEditorSettings', 'documentName', 'documentSettings', 'enableAutoFocus', 'enableBookmarkDialog', 'enableBordersAndShadingDialog', 'enableCollaborativeEditing', 'enableColumnsDialog', 'enableComment', 'enableContextMenu', 'enableCursorOnReadOnly', 'enableEditor', 'enableEditorHistory', 'enableFontDialog', 'enableFootnoteAndEndnoteDialog', 'enableFormField', 'enableHyperlinkDialog', 'enableImageResizer', 'enableLayout', 'enableListDialog', 'enableLocalPaste', 'enableLockAndEdit', 'enableOptionsPane', 'enablePageSetupDialog', 'enableParagraphDialog', 'enablePersistence', 'enablePrint', 'enableRtl', 'enableSearch', 'enableSelection', 'enableSfdtExport', 'enableSpellCheck', 'enableStyleDialog', 'enableTableDialog', 'enableTableOfContentsDialog', 'enableTableOptionsDialog', 'enableTablePropertiesDialog', 'enableTextExport', 'enableTrackChanges', 'enableWordExport', 'headers', 'height', 'isReadOnly', 'layoutType', 'locale', 'pageGap', 'pageOutline', 'serverActionSettings', 'serviceUrl', 'showComments', 'showRevisions', 'useCtrlClickToFollowHyperlink', 'userColor', 'width', 'zIndex', 'zoomFactor', 'actionComplete', 'afterFormFieldFill', 'beforeAcceptRejectChanges', 'beforeCommentAction', 'beforeFileOpen', 'beforeFormFieldFill', 'beforePaneSwitch', 'beforePaste', 'commentBegin', 'commentDelete', 'commentEnd', 'contentChange', 'contentControl', 'created', 'customContextMenuBeforeOpen', 'customContextMenuSelect', 'destroyed', 'documentChange', 'keyDown', 'requestNavigate', 'searchResultsChange', 'selectionChange', 'serviceFailure', 'trackChange', 'unsupportedBorderStyleClick', 'viewChange', 'zoomFactorChange', 'beforeXmlHttpRequestSend', 'documentLoadFailed'];
export const modelProps: string[] = [];

export const testProp: any = getProps({props: properties});
export const props = testProp[0], watch = testProp[1], emitProbs: any = Object.keys(watch);
emitProbs.push('modelchanged', 'update:modelValue');
for (let props of modelProps) { emitProbs.push('update:'+props) }

/**
 * Represents the Essential JS 2 VueJS Document Editor Component
 * ```html
 * <ejs-documenteditor id='container'></ejs-documenteditor>
 * ```
 */
export let DocumentEditorComponent: DefineVueComponent<DocumentEditorModel> =  vueDefineComponent({
    name: 'DocumentEditorComponent',
    mixins: [ComponentBase],
    props: props,
    watch: watch,
    emits: emitProbs,
    provide() { return { custom: this.custom } },
    data() {
        return {
            ej2Instance: new DocumentEditor({}) as any,
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
        destroy(): void {
            return this.ej2Instances.destroy();
        },
        enableAllModules(): void {
            return this.ej2Instances.enableAllModules();
        },
        exportAsImage(pageNumber: number, format: Object): Object {
            return this.ej2Instances.exportAsImage(pageNumber, format);
        },
        exportContentControlData(isExportRichTextData?: boolean): Object[] {
            return this.ej2Instances.exportContentControlData(isExportRichTextData);
        },
        exportFormData(): Object[] {
            return this.ej2Instances.exportFormData();
        },
        fitPage(pageFitType?: Object): void {
            return this.ej2Instances.fitPage(pageFitType);
        },
        focusIn(): void {
            return this.ej2Instances.focusIn();
        },
        getBookmarks(): string[] {
            return this.ej2Instances.getBookmarks();
        },
        getComments(): Object[] {
            return this.ej2Instances.getComments();
        },
        getDefaultCharacterFormat(): Object {
            return this.ej2Instances.getDefaultCharacterFormat();
        },
        getDefaultParagraphFormat(): Object {
            return this.ej2Instances.getDefaultParagraphFormat();
        },
        getDefaultSectionFormat(): Object {
            return this.ej2Instances.getDefaultSectionFormat();
        },
        getDocumentCharacterFormat(): Object {
            return this.ej2Instances.getDocumentCharacterFormat();
        },
        getDocumentParagraphFormat(): Object {
            return this.ej2Instances.getDocumentParagraphFormat();
        },
        getFormFieldInfo(name: string): Object | Object | Object {
            return this.ej2Instances.getFormFieldInfo(name);
        },
        getFormFieldNames(): string[] {
            return this.ej2Instances.getFormFieldNames();
        },
        getStyleNames(styleType?: Object): string[] {
            return this.ej2Instances.getStyleNames(styleType);
        },
        getStyles(styleType?: Object): Object[] {
            return this.ej2Instances.getStyles(styleType);
        },
        importContentControlData(contentControlInfo: Object[]): Object[] {
            return this.ej2Instances.importContentControlData(contentControlInfo);
        },
        importFormData(formData: Object[]): void {
            return this.ej2Instances.importFormData(formData);
        },
        open(inputData: string): void {
            return this.ej2Instances.open(inputData);
        },
        openAsync(inputData: string): Object {
            return this.ej2Instances.openAsync(inputData);
        },
        openBlank(): void {
            return this.ej2Instances.openBlank();
        },
        print(printWindow?: Object): void {
            return this.ej2Instances.print(printWindow);
        },
        resetContentControlData(contentControInfo: Object[]): void {
            return this.ej2Instances.resetContentControlData(contentControInfo);
        },
        resetFormFields(name?: string): void {
            return this.ej2Instances.resetFormFields(name);
        },
        resize(width?: number, height?: number): void {
            return this.ej2Instances.resize(width, height);
        },
        save(fileName: string, formatType?: Object): void {
            return this.ej2Instances.save(fileName, formatType);
        },
        saveAsBlob(formatType?: Object): Object {
            return this.ej2Instances.saveAsBlob(formatType);
        },
        scrollToPage(pageNumber: number): boolean {
            return this.ej2Instances.scrollToPage(pageNumber);
        },
        serialize(): string {
            return this.ej2Instances.serialize();
        },
        setCustomFonts(fonts: string | object[]): void {
            return this.ej2Instances.setCustomFonts(fonts);
        },
        setDefaultCharacterFormat(characterFormat: Object): void {
            return this.ej2Instances.setDefaultCharacterFormat(characterFormat);
        },
        setDefaultParagraphFormat(paragraphFormat: Object): void {
            return this.ej2Instances.setDefaultParagraphFormat(paragraphFormat);
        },
        setDefaultSectionFormat(sectionFormat: Object): void {
            return this.ej2Instances.setDefaultSectionFormat(sectionFormat);
        },
        setDocumentCharacterFormat(characterFormat: Object): void {
            return this.ej2Instances.setDocumentCharacterFormat(characterFormat);
        },
        setDocumentParagraphFormat(paragraphFormat: Object): void {
            return this.ej2Instances.setDocumentParagraphFormat(paragraphFormat);
        },
        setFormFieldInfo(name: string, formFieldInfo: Object | Object | Object): void {
            return this.ej2Instances.setFormFieldInfo(name, formFieldInfo);
        },
        showDialog(dialogType: Object): void {
            return this.ej2Instances.showDialog(dialogType);
        },
        showOptionsPane(): void {
            return this.ej2Instances.showOptionsPane();
        },
        showRestrictEditingPane(show?: boolean): void {
            return this.ej2Instances.showRestrictEditingPane(show);
        },
        showXmlPane(): void {
            return this.ej2Instances.showXmlPane();
        },
        updateFields(): void {
            return this.ej2Instances.updateFields();
        },
        verbalizeFromCursorLocation(): void {
            return this.ej2Instances.verbalizeFromCursorLocation();
        },
    }
});

export type DocumentEditorComponent = typeof ComponentBase & {
    ej2Instance: DocumentEditor;
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
    destroy(): void;
    enableAllModules(): void;
    exportAsImage(pageNumber: number, format: Object): Object;
    exportContentControlData(isExportRichTextData?: boolean): Object[];
    exportFormData(): Object[];
    fitPage(pageFitType?: Object): void;
    focusIn(): void;
    getBookmarks(): string[];
    getComments(): Object[];
    getDefaultCharacterFormat(): Object;
    getDefaultParagraphFormat(): Object;
    getDefaultSectionFormat(): Object;
    getDocumentCharacterFormat(): Object;
    getDocumentParagraphFormat(): Object;
    getFormFieldInfo(name: string): Object | Object | Object;
    getFormFieldNames(): string[];
    getStyleNames(styleType?: Object): string[];
    getStyles(styleType?: Object): Object[];
    importContentControlData(contentControlInfo: Object[]): Object[];
    importFormData(formData: Object[]): void;
    open(inputData: string): void;
    openAsync(inputData: string): Object;
    openBlank(): void;
    print(printWindow?: Object): void;
    resetContentControlData(contentControInfo: Object[]): void;
    resetFormFields(name?: string): void;
    resize(width?: number, height?: number): void;
    save(fileName: string, formatType?: Object): void;
    saveAsBlob(formatType?: Object): Object;
    scrollToPage(pageNumber: number): boolean;
    serialize(): string;
    setCustomFonts(fonts: string | object[]): void;
    setDefaultCharacterFormat(characterFormat: Object): void;
    setDefaultParagraphFormat(paragraphFormat: Object): void;
    setDefaultSectionFormat(sectionFormat: Object): void;
    setDocumentCharacterFormat(characterFormat: Object): void;
    setDocumentParagraphFormat(paragraphFormat: Object): void;
    setFormFieldInfo(name: string, formFieldInfo: Object | Object | Object): void;
    showDialog(dialogType: Object): void;
    showOptionsPane(): void;
    showRestrictEditingPane(show?: boolean): void;
    showXmlPane(): void;
    updateFields(): void;
    verbalizeFromCursorLocation(): void
};

export const DocumentEditorPlugin = {
    name: 'ejs-documenteditor',
    install(Vue: any) {
        Vue.component(DocumentEditorPlugin.name, DocumentEditorComponent);

    }
}
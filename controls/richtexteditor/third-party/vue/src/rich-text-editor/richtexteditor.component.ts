import { ComponentBase, gh, getProps, isExecute, vueDefineComponent, DefineVueComponent } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined, getValue } from '@syncfusion/ej2-base';
import { isUndefined } from '@syncfusion/ej2-base';

import { RichTextEditor, RichTextEditorModel } from '@syncfusion/ej2-richtexteditor';


export const properties: string[] = ['isLazyUpdate', 'plugins', 'aiAssistantSettings', 'autoSaveOnIdle', 'backgroundColor', 'bulletFormatList', 'codeBlockSettings', 'cssClass', 'editorMode', 'emojiPickerSettings', 'enableAutoUrl', 'enableClipboardCleanup', 'enableHtmlEncode', 'enableHtmlSanitizer', 'enableMarkdownAutoFormat', 'enablePersistence', 'enableResize', 'enableRtl', 'enableTabKey', 'enableWebMcp', 'enableXhtml', 'enabled', 'enterKey', 'exportPdf', 'exportWord', 'fileManagerSettings', 'floatingToolbarOffset', 'fontColor', 'fontFamily', 'fontSize', 'format', 'formatPainterSettings', 'formatter', 'height', 'htmlAttributes', 'iframeSettings', 'importWord', 'inlineMode', 'insertAudioSettings', 'insertImageSettings', 'insertVideoSettings', 'keyConfig', 'lineHeight', 'locale', 'maxLength', 'numberFormatList', 'pasteCleanupSettings', 'placeholder', 'quickToolbarSettings', 'readonly', 'saveInterval', 'shiftEnterKey', 'showCharCount', 'showTooltip', 'slashMenuSettings', 'tableSettings', 'toolbarSettings', 'undoRedoSteps', 'undoRedoTimer', 'value', 'valueTemplate', 'width', 'actionBegin', 'actionComplete', 'afterImageDelete', 'afterMediaDelete', 'afterPasteCleanup', 'aiAssistantPromptRequest', 'aiAssistantStopRespondingClick', 'aiAssistantToolbarClick', 'beforeClipboardWrite', 'beforeDialogClose', 'beforeDialogOpen', 'beforeFileUpload', 'beforeImageDrop', 'beforeImageUpload', 'beforeMediaDrop', 'beforePasteCleanup', 'beforePopupClose', 'beforePopupOpen', 'beforeQuickToolbarOpen', 'beforeSanitizeHtml', 'beforeWebMcpToolExecute', 'blur', 'change', 'created', 'destroyed', 'dialogClose', 'dialogOpen', 'documentExporting', 'fileRemoving', 'fileSelected', 'fileUploadFailed', 'fileUploadSuccess', 'fileUploading', 'focus', 'imageRemoving', 'imageSelected', 'imageUploadFailed', 'imageUploadSuccess', 'imageUploading', 'quickToolbarClose', 'quickToolbarOpen', 'resizeStart', 'resizeStop', 'resizing', 'selectionChanged', 'slashMenuItemSelect', 'toolbarClick', 'toolbarStatusUpdate', 'updatedToolbarStatus', 'wordImporting'];
export const modelProps: string[] = ['value'];

export const testProp: any = getProps({props: properties});
export const props = testProp[0], watch = testProp[1], emitProbs: any = Object.keys(watch);
emitProbs.push('modelchanged', 'update:modelValue');
for (let props of modelProps) { emitProbs.push('update:'+props) }

/**
 * `ejs-richtexteditor` represents the VueJS RichTextEditor Component.
 * ```ts
 * <ejs-richtexteditor></ejs-richtexteditor>
 * ```
 */
export let RichTextEditorComponent: DefineVueComponent<RichTextEditorModel> =  vueDefineComponent({
    name: 'RichTextEditorComponent',
    mixins: [ComponentBase],
    props: props,
    watch: watch,
    emits: emitProbs,
    model: { event: 'modelchanged' },
    provide() { return { custom: this.custom } },
    data() {
        return {
            ej2Instances: new RichTextEditor({}) as any,
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
        this.ej2Instances._trigger = this.ej2Instances.trigger;
        this.ej2Instances.trigger = this.trigger;
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
        return h('textarea', slots);
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
        trigger(eventName: string, eventProp: {[key:string]:Object}, successHandler?: Function): void {
            if(!isExecute) { this.models = !this.models ? this.ej2Instances.referModels : this.models }
            if ((eventName === 'change' || eventName === 'input') && this.models && (this.models.length !== 0)) {
                let key: string[] = this.models.toString().match(/checked|value/) || [];
                let propKey: string = key[0];
                if (eventProp && key && !isUndefined(eventProp[propKey])) {
                    if (!isExecute) {
                        this.ej2Instances.vueInstance.$emit('update:' + propKey, eventProp[propKey]);
                        this.ej2Instances.vueInstance.$emit('modelchanged', eventProp[propKey]);
                        this.ej2Instances.vueInstance.$emit('update:modelValue', eventProp[propKey]);
                    } else {
                        if (eventName === 'change' || ((this as any).$props && !(this as any).$props.isLazyUpdate)) {
                            (this as any).$emit('update:'+ propKey, eventProp[propKey]);
                            (this as any).$emit('modelchanged', eventProp[propKey]);
                        }
                    }
                }
            } else if ((eventName === 'actionBegin' && eventProp.requestType === 'dateNavigate') && this.models && (this.models.length !== 0)) {
                let key: string[] = this.models.toString().match(/currentView|selectedDate/) || [];
                let propKey: string = key[0];
                if (eventProp && key && !isUndefined(eventProp[propKey])) {
                    if (!isExecute) {
                        this.ej2Instances.vueInstance.$emit('update:' + propKey, eventProp[propKey]);
                        this.ej2Instances.vueInstance.$emit('modelchanged', eventProp[propKey]);
                    } else {
                        (this as any).$emit('update:'+ propKey, eventProp[propKey]);
                        (this as any).$emit('modelchanged', eventProp[propKey]);
                    }
                }
            }
            if ((this.ej2Instances && this.ej2Instances._trigger)) {
                this.ej2Instances._trigger(eventName, eventProp, successHandler); 
            }
        },

        custom(): void {
            this.updated();
        },
        addAIPromptResponse(outputResponse: string | Object, isFinalUpdate?: boolean): void {
            return this.ej2Instances.addAIPromptResponse(outputResponse, isFinalUpdate);
        },
        addAnchorAriaLabel(value: string): string {
            return this.ej2Instances.addAnchorAriaLabel(value);
        },
        cleanList(e: Object): void {
            return this.ej2Instances.cleanList(e);
        },
        clearAIPromptHistory(): void {
            return this.ej2Instances.clearAIPromptHistory();
        },
        clearUndoRedo(): void {
            return this.ej2Instances.clearUndoRedo();
        },
        closeDialog(type: Object): void {
            return this.ej2Instances.closeDialog(type);
        },
        destroy(): void {
            return this.ej2Instances.destroy();
        },
        disableToolbarItem(items: string | string[], muteToolbarUpdate?: boolean): void {
            return this.ej2Instances.disableToolbarItem(items, muteToolbarUpdate);
        },
        enableToolbarItem(items: string | string[], muteToolbarUpdate?: boolean): void {
            return this.ej2Instances.enableToolbarItem(items, muteToolbarUpdate);
        },
        executeAIPrompt(prompt: string): void {
            return this.ej2Instances.executeAIPrompt(prompt);
        },
        executeCommand(commandName: Object, value?: string | Object | Object | Object | Object | Object | Object | Object | Object, option?: Object): void {
            return this.ej2Instances.executeCommand(commandName, value, option);
        },
        focusIn(): void {
            return this.ej2Instances.focusIn();
        },
        focusOut(): void {
            return this.ej2Instances.focusOut();
        },
        getAIPromptHistory(): Object[] {
            return this.ej2Instances.getAIPromptHistory();
        },
        getCharCount(): number {
            return this.ej2Instances.getCharCount();
        },
        getContent(): Object {
            return this.ej2Instances.getContent();
        },
        getHtml(): string {
            return this.ej2Instances.getHtml();
        },
        getRange(): Object {
            return this.ej2Instances.getRange();
        },
        getSelectedHtml(): string {
            return this.ej2Instances.getSelectedHtml();
        },
        getSelection(): string {
            return this.ej2Instances.getSelection();
        },
        getText(): string {
            return this.ej2Instances.getText();
        },
        getWebMcpTools(toolNames?: string[]): Object[] {
            return this.ej2Instances.getWebMcpTools(toolNames);
        },
        getXhtml(): string {
            return this.ej2Instances.getXhtml();
        },
        hideAIAssistantPopup(): void {
            return this.ej2Instances.hideAIAssistantPopup();
        },
        hideInlineToolbar(): void {
            return this.ej2Instances.hideInlineToolbar();
        },
        print(): void {
            return this.ej2Instances.print();
        },
        refreshUI(): void {
            return this.ej2Instances.refreshUI();
        },
        registerWebMcpTools(prefix?: string, tools?: string[] | Object[], exposedTo?: string[]): void {
            return this.ej2Instances.registerWebMcpTools(prefix, tools, exposedTo);
        },
        removeToolbarItem(items: string | string[]): void {
            return this.ej2Instances.removeToolbarItem(items);
        },
        renderTemplates(callBack: any): void {
            return this.ej2Instances.renderTemplates(callBack);
        },
        sanitizeHtml(value: string): string {
            return this.ej2Instances.sanitizeHtml(value);
        },
        selectAll(): void {
            return this.ej2Instances.selectAll();
        },
        selectRange(range: Object): void {
            return this.ej2Instances.selectRange(range);
        },
        showAIAssistantPopup(): void {
            return this.ej2Instances.showAIAssistantPopup();
        },
        showDialog(type: Object): void {
            return this.ej2Instances.showDialog(type);
        },
        showEmojiPicker(x?: number, y?: number): void {
            return this.ej2Instances.showEmojiPicker(x, y);
        },
        showFullScreen(): void {
            return this.ej2Instances.showFullScreen();
        },
        showInlineToolbar(): void {
            return this.ej2Instances.showInlineToolbar();
        },
        showSourceCode(): void {
            return this.ej2Instances.showSourceCode();
        },
    }
});

export type RichTextEditorComponent = typeof ComponentBase & {
    ej2Instances: RichTextEditor;
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
    addAIPromptResponse(outputResponse: string | Object, isFinalUpdate?: boolean): void;
    addAnchorAriaLabel(value: string): string;
    cleanList(e: Object): void;
    clearAIPromptHistory(): void;
    clearUndoRedo(): void;
    closeDialog(type: Object): void;
    destroy(): void;
    disableToolbarItem(items: string | string[], muteToolbarUpdate?: boolean): void;
    enableToolbarItem(items: string | string[], muteToolbarUpdate?: boolean): void;
    executeAIPrompt(prompt: string): void;
    executeCommand(commandName: Object, value?: string | Object | Object | Object | Object | Object | Object | Object | Object, option?: Object): void;
    focusIn(): void;
    focusOut(): void;
    getAIPromptHistory(): Object[];
    getCharCount(): number;
    getContent(): Object;
    getHtml(): string;
    getRange(): Object;
    getSelectedHtml(): string;
    getSelection(): string;
    getText(): string;
    getWebMcpTools(toolNames?: string[]): Object[];
    getXhtml(): string;
    hideAIAssistantPopup(): void;
    hideInlineToolbar(): void;
    print(): void;
    refreshUI(): void;
    registerWebMcpTools(prefix?: string, tools?: string[] | Object[], exposedTo?: string[]): void;
    removeToolbarItem(items: string | string[]): void;
    renderTemplates(callBack: any): void;
    sanitizeHtml(value: string): string;
    selectAll(): void;
    selectRange(range: Object): void;
    showAIAssistantPopup(): void;
    showDialog(type: Object): void;
    showEmojiPicker(x?: number, y?: number): void;
    showFullScreen(): void;
    showInlineToolbar(): void;
    showSourceCode(): void
};

export const RichTextEditorPlugin = {
    name: 'ejs-richtexteditor',
    install(Vue: any) {
        Vue.component(RichTextEditorPlugin.name, RichTextEditorComponent);

    }
}
import { ComponentBase, gh, getProps, isExecute, vueDefineComponent, DefineVueComponent } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined, getValue } from '@syncfusion/ej2-base';
import { isUndefined } from '@syncfusion/ej2-base';

import { RichTextEditorUI, RichTextEditorUIModel } from '@syncfusion/ej2-richtexteditor-ui';


export const properties: string[] = ['isLazyUpdate', 'plugins', 'backgroundColor', 'cssClass', 'enable', 'enableAutoSave', 'enableHtmlSanitizer', 'enablePersistence', 'enableRtl', 'fontColor', 'fontFamily', 'fontSize', 'format', 'height', 'htmlAttributes', 'imageSettings', 'interactionSettings', 'linkSettings', 'listSettings', 'locale', 'placeholder', 'quickToolbarSettings', 'readonly', 'saveInterval', 'slashCommandSettings', 'tableSettings', 'toolbarSettings', 'undoRedoSteps', 'undoRedoTimer', 'value', 'valueFormat', 'width', 'slashCommanditemSelect', 'actionBegin', 'actionComplete', 'beforeDialogClose', 'beforeDialogOpen', 'beforeFileDrop', 'beforeFileUpload', 'beforePopupClose', 'beforePopupOpen', 'blurred', 'change', 'created', 'destroyed', 'fileRemoving', 'fileSelected', 'fileUploadFailed', 'fileUploadSuccess', 'fileUploading', 'focused', 'itemClick', 'resize', 'resizeStop', 'resizing', 'updatedToolbarStatus'];
export const modelProps: string[] = ['value'];

export const testProp: any = getProps({props: properties});
export const props = testProp[0], watch = testProp[1], emitProbs: any = Object.keys(watch);
emitProbs.push('modelchanged', 'update:modelValue');
for (let props of modelProps) { emitProbs.push('update:'+props) }

/**
 * `ejs-richtexteditor-ui` represents the Vue Rich Text Editor UI component.
 * ```vue
 * <ejs-richtexteditor-ui></ejs-richtexteditor-ui>
 * ```
 */
export let RichTextEditorUIComponent: DefineVueComponent<RichTextEditorUIModel> =  vueDefineComponent({
    name: 'RichTextEditorUIComponent',
    mixins: [ComponentBase],
    props: props,
    watch: watch,
    emits: emitProbs,
    model: { event: 'modelchanged' },
    provide() { return { custom: this.custom } },
    data() {
        return {
            ej2Instances: new RichTextEditorUI({}) as any,
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
        blur(): void {
            return this.ej2Instances.blur();
        },
        commands(): Object {
            return this.ej2Instances.commands();
        },
        destroy(): void {
            return this.ej2Instances.destroy();
        },
        focus(): void {
            return this.ej2Instances.focus();
        },
        getDocument(): Object | null {
            return this.ej2Instances.getDocument();
        },
        getHtml(): string {
            return this.ej2Instances.getHtml();
        },
        getText(): string {
            return this.ej2Instances.getText();
        },
        print(): void {
            return this.ej2Instances.print();
        },
        requiredModules(): Object[] {
            return this.ej2Instances.requiredModules();
        },
        save(): void {
            return this.ej2Instances.save();
        },
        triggerUpdatedToolbarStatus(state: Object): void {
            return this.ej2Instances.triggerUpdatedToolbarStatus(state);
        },
        updateToolbarItems(updates: Object[]): void {
            return this.ej2Instances.updateToolbarItems(updates);
        },
        uploadFile(fileType: string, blobData: Object): void {
            return this.ej2Instances.uploadFile(fileType, blobData);
        },
    }
});

export type RichTextEditorUIComponent = typeof ComponentBase & {
    ej2Instances: RichTextEditorUI;
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
    blur(): void;
    commands(): Object;
    destroy(): void;
    focus(): void;
    getDocument(): Object | null;
    getHtml(): string;
    getText(): string;
    print(): void;
    requiredModules(): Object[];
    save(): void;
    triggerUpdatedToolbarStatus(state: Object): void;
    updateToolbarItems(updates: Object[]): void;
    uploadFile(fileType: string, blobData: Object): void
};

export const RichTextEditorUIPlugin = {
    name: 'ejs-richtexteditorui',
    install(Vue: any) {
        Vue.component(RichTextEditorUIPlugin.name, RichTextEditorUIComponent);

    }
}
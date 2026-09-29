import { ComponentBase, gh, getProps, isExecute, vueDefineComponent, DefineVueComponent } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined, getValue } from '@syncfusion/ej2-base';

import { DocumentEditorContainer, DocumentEditorContainerModel } from '@syncfusion/ej2-documenteditor';


export const properties: string[] = ['isLazyUpdate', 'plugins', 'autoResizeOnVisibilityChange', 'backstageMenu', 'currentUser', 'documentEditorSettings', 'documentSettings', 'enableAutoFocus', 'enableComment', 'enableCsp', 'enableLocalPaste', 'enableLockAndEdit', 'enablePersistence', 'enableRtl', 'enableSpellCheck', 'enableToolbar', 'enableTrackChanges', 'fileMenuItems', 'headers', 'height', 'layoutType', 'locale', 'restrictEditing', 'ribbonLayout', 'serverActionSettings', 'serviceUrl', 'showPropertiesPane', 'toolbarItems', 'toolbarMode', 'userColor', 'width', 'zIndex', 'beforeAcceptRejectChanges', 'beforeCommentAction', 'beforePaneSwitch', 'beforePaste', 'commentDelete', 'contentChange', 'contentControl', 'created', 'customContextMenuBeforeOpen', 'customContextMenuSelect', 'destroyed', 'documentChange', 'fileMenuItemClick', 'selectionChange', 'serviceFailure', 'toolbarClick', 'trackChange', 'beforeXmlHttpRequestSend'];
export const modelProps: string[] = [];

export const testProp: any = getProps({props: properties});
export const props = testProp[0], watch = testProp[1], emitProbs: any = Object.keys(watch);
emitProbs.push('modelchanged', 'update:modelValue');
for (let props of modelProps) { emitProbs.push('update:'+props) }

/**
 * Represents the Essential JS 2 VueJS Document Editor Container
 * ```html
 * <ejs-documenteditor-container id='container'></ejs-documenteditor-container>
 * ```
 */
export let DocumentEditorContainerComponent: DefineVueComponent<DocumentEditorContainerModel> =  vueDefineComponent({
    name: 'DocumentEditorContainerComponent',
    mixins: [ComponentBase],
    props: props,
    watch: watch,
    emits: emitProbs,
    provide() { return { custom: this.custom } },
    data() {
        return {
            ej2Instance: new DocumentEditorContainer({}) as any,
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
        resize(width?: number, height?: number): void {
            return this.ej2Instances.resize(width, height);
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
    }
});

export type DocumentEditorContainerComponent = typeof ComponentBase & {
    ej2Instance: DocumentEditorContainer;
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
    getDefaultCharacterFormat(): Object;
    getDefaultParagraphFormat(): Object;
    getDefaultSectionFormat(): Object;
    getDocumentCharacterFormat(): Object;
    getDocumentParagraphFormat(): Object;
    resize(width?: number, height?: number): void;
    setDefaultCharacterFormat(characterFormat: Object): void;
    setDefaultParagraphFormat(paragraphFormat: Object): void;
    setDefaultSectionFormat(sectionFormat: Object): void;
    setDocumentCharacterFormat(characterFormat: Object): void;
    setDocumentParagraphFormat(paragraphFormat: Object): void
};

export const DocumentEditorContainerPlugin = {
    name: 'ejs-documenteditorcontainer',
    install(Vue: any) {
        Vue.component(DocumentEditorContainerPlugin.name, DocumentEditorContainerComponent);

    }
}
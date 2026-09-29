import { ComponentBase, gh, getProps, isExecute, vueDefineComponent, DefineVueComponent } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined, getValue } from '@syncfusion/ej2-base';
import { isUndefined } from '@syncfusion/ej2-base';

import { BlockEditor, BlockEditorModel } from '@syncfusion/ej2-blockeditor';


export const properties: string[] = ['isLazyUpdate', 'plugins', 'backgroundColorSettings', 'blockActionMenuSettings', 'blocks', 'codeBlockSettings', 'collaborationSettings', 'commandMenuSettings', 'contextMenuSettings', 'cssClass', 'currentUserId', 'enableDragAndDrop', 'enableHtmlEncode', 'enableHtmlSanitizer', 'enablePersistence', 'enableRtl', 'fontColorSettings', 'height', 'imageBlockSettings', 'inlineToolbarSettings', 'keyConfig', 'labelSettings', 'locale', 'pasteCleanupSettings', 'readOnly', 'transformSettings', 'undoRedoStack', 'users', 'width', 'afterPasteCleanup', 'beforeFileUpload', 'beforePasteCleanup', 'blockChanged', 'blockDragStart', 'blockDragging', 'blockDropped', 'blur', 'created', 'fileUploadFailed', 'fileUploadSuccess', 'fileUploading', 'focus', 'selectionChanged'];
export const modelProps: string[] = ['blocks'];

export const testProp: any = getProps({props: properties});
export const props = testProp[0], watch = testProp[1], emitProbs: any = Object.keys(watch);
emitProbs.push('modelchanged', 'update:modelValue');
for (let props of modelProps) { emitProbs.push('update:'+props) }

/**
 * Represents the Essential JS 2 VueJS BlockEditor Component
 * ```vue
 * <ejs-blockeditor></ejs-blockeditor>
 * ```
 */
export let BlockEditorComponent: DefineVueComponent<BlockEditorModel> =  vueDefineComponent({
    name: 'BlockEditorComponent',
    mixins: [ComponentBase],
    props: props,
    watch: watch,
    emits: emitProbs,
    model: { event: 'modelchanged' },
    provide() { return { custom: this.custom } },
    data() {
        return {
            ej2Instances: new BlockEditor({}) as any,
            propKeys: properties as string[],
            models: modelProps as string[],
            hasChildDirective: true as boolean,
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
        addBlock(block: Object, targetId?: string, isAfter?: boolean): void {
            return this.ej2Instances.addBlock(block, targetId, isAfter);
        },
        destroy(): void {
            return this.ej2Instances.destroy();
        },
        disableToolbarItems(itemId: string | string[]): void {
            return this.ej2Instances.disableToolbarItems(itemId);
        },
        enableToolbarItems(itemId: string | string[]): void {
            return this.ej2Instances.enableToolbarItems(itemId);
        },
        executeToolbarAction(action: Object, value?: string): void {
            return this.ej2Instances.executeToolbarAction(action, value);
        },
        focusIn(): void {
            return this.ej2Instances.focusIn();
        },
        focusOut(): void {
            return this.ej2Instances.focusOut();
        },
        getBlock(blockId: string): Object | null {
            return this.ej2Instances.getBlock(blockId);
        },
        getBlockCount(): number {
            return this.ej2Instances.getBlockCount();
        },
        getDataAsHtml(blockId?: string): string {
            return this.ej2Instances.getDataAsHtml(blockId);
        },
        getDataAsJson(blockId?: string): Object | Object[] {
            return this.ej2Instances.getDataAsJson(blockId);
        },
        getRange(): Object | null {
            return this.ej2Instances.getRange();
        },
        getSelectedBlocks(): Object[] | null {
            return this.ej2Instances.getSelectedBlocks();
        },
        getVersionHistory(): Object {
            return this.ej2Instances.getVersionHistory();
        },
        moveBlock(fromBlockId: string, toBlockId: string): void {
            return this.ej2Instances.moveBlock(fromBlockId, toBlockId);
        },
        parseHtmlToBlocks(html: string): Object[] {
            return this.ej2Instances.parseHtmlToBlocks(html);
        },
        print(): void {
            return this.ej2Instances.print();
        },
        removeBlock(blockId: string): void {
            return this.ej2Instances.removeBlock(blockId);
        },
        renderBlocksFromJson(json: object | string, replace: boolean, targetBlockId?: string): boolean {
            return this.ej2Instances.renderBlocksFromJson(json, replace, targetBlockId);
        },
        selectAllBlocks(): void {
            return this.ej2Instances.selectAllBlocks();
        },
        selectBlock(blockId: string): void {
            return this.ej2Instances.selectBlock(blockId);
        },
        selectRange(range: Object): void {
            return this.ej2Instances.selectRange(range);
        },
        setCursorPosition(blockId: string, position: number): void {
            return this.ej2Instances.setCursorPosition(blockId, position);
        },
        setSelection(node: Object, startIndex: number, endIndex: number): void {
            return this.ej2Instances.setSelection(node, startIndex, endIndex);
        },
        updateBlock(blockId: string, properties: Object): boolean {
            return this.ej2Instances.updateBlock(blockId, properties);
        },
    }
});

export type BlockEditorComponent = typeof ComponentBase & {
    ej2Instances: BlockEditor;
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
    addBlock(block: Object, targetId?: string, isAfter?: boolean): void;
    destroy(): void;
    disableToolbarItems(itemId: string | string[]): void;
    enableToolbarItems(itemId: string | string[]): void;
    executeToolbarAction(action: Object, value?: string): void;
    focusIn(): void;
    focusOut(): void;
    getBlock(blockId: string): Object | null;
    getBlockCount(): number;
    getDataAsHtml(blockId?: string): string;
    getDataAsJson(blockId?: string): Object | Object[];
    getRange(): Object | null;
    getSelectedBlocks(): Object[] | null;
    getVersionHistory(): Object;
    moveBlock(fromBlockId: string, toBlockId: string): void;
    parseHtmlToBlocks(html: string): Object[];
    print(): void;
    removeBlock(blockId: string): void;
    renderBlocksFromJson(json: object | string, replace: boolean, targetBlockId?: string): boolean;
    selectAllBlocks(): void;
    selectBlock(blockId: string): void;
    selectRange(range: Object): void;
    setCursorPosition(blockId: string, position: number): void;
    setSelection(node: Object, startIndex: number, endIndex: number): void;
    updateBlock(blockId: string, properties: Object): boolean
};

export const BlockEditorPlugin = {
    name: 'ejs-blockeditor',
    install(Vue: any) {
        Vue.component(BlockEditorPlugin.name, BlockEditorComponent);

    }
}
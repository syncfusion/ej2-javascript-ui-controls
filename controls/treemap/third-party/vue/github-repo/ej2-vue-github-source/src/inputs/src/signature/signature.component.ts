import { ComponentBase, gh, getProps, isExecute, vueDefineComponent, DefineVueComponent } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined, getValue } from '@syncfusion/ej2-base';

import { Signature, SignatureModel } from '@syncfusion/ej2-inputs';


export const properties: string[] = ['isLazyUpdate', 'plugins', 'backgroundColor', 'backgroundImage', 'disabled', 'enablePersistence', 'enableRtl', 'isReadOnly', 'locale', 'maxStrokeWidth', 'minStrokeWidth', 'saveWithBackground', 'strokeColor', 'velocity', 'beforeSave', 'change', 'created'];
export const modelProps: string[] = [];

export const testProp: any = getProps({props: properties});
export const props = testProp[0], watch = testProp[1], emitProbs: any = Object.keys(watch);
emitProbs.push('modelchanged', 'update:modelValue');
for (let props of modelProps) { emitProbs.push('update:'+props) }

/**
 * Represents the Essential JS 2 VueJS Signature Component
 * ```html
 * <ejs-signature></ejs-signature>
 * ```
 */
export let SignatureComponent: DefineVueComponent<SignatureModel> =  vueDefineComponent({
    name: 'SignatureComponent',
    mixins: [ComponentBase],
    props: props,
    watch: watch,
    emits: emitProbs,
    provide() { return { custom: this.custom } },
    data() {
        return {
            ej2Instances: new Signature({}) as any,
            propKeys: properties as string[],
            models: modelProps as string[],
            hasChildDirective: false as boolean,
            hasInjectedModules: false as boolean,
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
        return h('canvas', slots);
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
        canRedo(): boolean {
            return this.ej2Instances.canRedo();
        },
        canUndo(): boolean {
            return this.ej2Instances.canUndo();
        },
        clear(): void {
            return this.ej2Instances.clear();
        },
        destroy(): void {
            return this.ej2Instances.destroy();
        },
        draw(text: string, fontFamily?: string, fontSize?: number, x?: number, y?: number): void {
            return this.ej2Instances.draw(text, fontFamily, fontSize, x, y);
        },
        getBlob(url: string): Object {
            return this.ej2Instances.getBlob(url);
        },
        getSignature(type?: Object): string {
            return this.ej2Instances.getSignature(type);
        },
        initialize(): void {
            return this.ej2Instances.initialize();
        },
        isEmpty(): boolean {
            return this.ej2Instances.isEmpty();
        },
        load(signature: string, width?: number, height?: number): void {
            return this.ej2Instances.load(signature, width, height);
        },
        redo(): void {
            return this.ej2Instances.redo();
        },
        refresh(): void {
            return this.ej2Instances.refresh();
        },
        save(type?: Object, fileName?: string): void {
            return this.ej2Instances.save(type, fileName);
        },
        saveAsBlob(): Object {
            return this.ej2Instances.saveAsBlob();
        },
        undo(): void {
            return this.ej2Instances.undo();
        },
    }
});

export type SignatureComponent = typeof ComponentBase & {
    ej2Instances: Signature;
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
    canRedo(): boolean;
    canUndo(): boolean;
    clear(): void;
    destroy(): void;
    draw(text: string, fontFamily?: string, fontSize?: number, x?: number, y?: number): void;
    getBlob(url: string): Object;
    getSignature(type?: Object): string;
    initialize(): void;
    isEmpty(): boolean;
    load(signature: string, width?: number, height?: number): void;
    redo(): void;
    refresh(): void;
    save(type?: Object, fileName?: string): void;
    saveAsBlob(): Object;
    undo(): void
};

export const SignaturePlugin = {
    name: 'ejs-signature',
    install(Vue: any) {
        Vue.component(SignaturePlugin.name, SignatureComponent);

    }
}
import { ComponentBase, gh, getProps, isExecute, vueDefineComponent, DefineVueComponent } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined, getValue } from '@syncfusion/ej2-base';

import { DropDownButton, DropDownButtonModel } from '@syncfusion/ej2-splitbuttons';
import { DropDownButtonItemsDirective, DropDownButtonItemDirective, DropDownButtonItemsPlugin, DropDownButtonItemPlugin } from './items.directive'


export const properties: string[] = ['isLazyUpdate', 'plugins', 'animationSettings', 'closeActionEvents', 'content', 'createPopupOnClick', 'cssClass', 'disabled', 'enableHtmlSanitizer', 'enablePersistence', 'enableRtl', 'iconCss', 'iconPosition', 'itemTemplate', 'items', 'locale', 'popupWidth', 'target', 'beforeClose', 'beforeItemRender', 'beforeOpen', 'close', 'created', 'open', 'select'];
export const modelProps: string[] = [];

export const testProp: any = getProps({props: properties});
export const props = testProp[0], watch = testProp[1], emitProbs: any = Object.keys(watch);
emitProbs.push('modelchanged', 'update:modelValue');
for (let props of modelProps) { emitProbs.push('update:'+props) }

/**
 * Represents the Essential JS 2 VueJS DropDownButton Component
 * ```html
 * <ejs-dropdownbutton>DropDownButton</ejs-dropdownbutton>
 * ```
 */
export let DropDownButtonComponent: DefineVueComponent<DropDownButtonModel> =  vueDefineComponent({
    name: 'DropDownButtonComponent',
    mixins: [ComponentBase],
    props: props,
    watch: watch,
    emits: emitProbs,
    provide() { return { custom: this.custom } },
    data() {
        return {
            ej2Instances: new DropDownButton({}) as any,
            propKeys: properties as string[],
            models: modelProps as string[],
            hasChildDirective: true as boolean,
            hasInjectedModules: false as boolean,
            tagMapper: {"e-dropdownbuttonitems":"e-dropdownbuttonitem"} as { [key: string]: Object },
            tagNameMapper: {"e-dropdownbuttonitems":"e-items"} as Object,
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
        return h('button', slots);
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
        addItems(items: Object[], text?: string): void {
            return this.ej2Instances.addItems(items, text);
        },
        destroy(): void {
            return this.ej2Instances.destroy();
        },
        focusIn(): void {
            return this.ej2Instances.focusIn();
        },
        removeItems(items: string[], isUniqueId?: boolean): void {
            return this.ej2Instances.removeItems(items, isUniqueId);
        },
        toggle(): void {
            return this.ej2Instances.toggle();
        },
    }
});

export type DropDownButtonComponent = typeof ComponentBase & {
    ej2Instances: DropDownButton;
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
    addItems(items: Object[], text?: string): void;
    destroy(): void;
    focusIn(): void;
    removeItems(items: string[], isUniqueId?: boolean): void;
    toggle(): void
};

export const DropDownButtonPlugin = {
    name: 'ejs-dropdownbutton',
    install(Vue: any) {
        Vue.component(DropDownButtonPlugin.name, DropDownButtonComponent);
        Vue.component(DropDownButtonItemPlugin.name, DropDownButtonItemDirective);
        Vue.component(DropDownButtonItemsPlugin.name, DropDownButtonItemsDirective);

    }
}
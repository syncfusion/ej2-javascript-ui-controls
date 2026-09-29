import { ComponentBase, gh, getProps, isExecute, vueDefineComponent, DefineVueComponent } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined, getValue } from '@syncfusion/ej2-base';

import { ContextMenu, ContextMenuModel } from '@syncfusion/ej2-navigations';


export const properties: string[] = ['isLazyUpdate', 'plugins', 'animationSettings', 'cssClass', 'enableHtmlSanitizer', 'enablePersistence', 'enableRtl', 'enableScrolling', 'fields', 'filter', 'hoverDelay', 'itemTemplate', 'items', 'locale', 'showItemOnClick', 'target', 'template', 'beforeClose', 'beforeItemRender', 'beforeOpen', 'created', 'onClose', 'onOpen', 'select'];
export const modelProps: string[] = [];

export const testProp: any = getProps({props: properties});
export const props = testProp[0], watch = testProp[1], emitProbs: any = Object.keys(watch);
emitProbs.push('modelchanged', 'update:modelValue');
for (let props of modelProps) { emitProbs.push('update:'+props) }

/**
 * Represents the Essential JS 2 VueJS ContextMenu Component.
 * ```html
 * <div id='target'>Right click / Touch hold to open the ContextMenu</div>
 * <ejs-contextmenu target='#target' :items='menuItems'></ejs-contextmenu>
 * ```
 */
export let ContextMenuComponent: DefineVueComponent<ContextMenuModel> =  vueDefineComponent({
    name: 'ContextMenuComponent',
    mixins: [ComponentBase],
    props: props,
    watch: watch,
    emits: emitProbs,
    provide() { return { custom: this.custom } },
    data() {
        return {
            ej2Instances: new ContextMenu({}) as any,
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
        return h('ul', slots);
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
        close(): void {
            return this.ej2Instances.close();
        },
        destroy(): void {
            return this.ej2Instances.destroy();
        },
        enableItems(items: string[], enable: boolean, isUniqueId?: boolean): void {
            return this.ej2Instances.enableItems(items, enable, isUniqueId);
        },
        getItemIndex(item: Object | string, isUniqueId?: boolean): number[] {
            return this.ej2Instances.getItemIndex(item, isUniqueId);
        },
        getMenuWidth(menuElement: Object, width: number, isRtl: boolean): number {
            return this.ej2Instances.getMenuWidth(menuElement, width, isRtl);
        },
        hideItems(items: string[], isUniqueId?: boolean): void {
            return this.ej2Instances.hideItems(items, isUniqueId);
        },
        insertAfter(items: Object[], text: string, isUniqueId?: boolean): void {
            return this.ej2Instances.insertAfter(items, text, isUniqueId);
        },
        insertBefore(items: Object[], text: string, isUniqueId?: boolean): void {
            return this.ej2Instances.insertBefore(items, text, isUniqueId);
        },
        open(top: number, left: number, target?: Object): void {
            return this.ej2Instances.open(top, left, target);
        },
        removeItems(items: string[], isUniqueId?: boolean): void {
            return this.ej2Instances.removeItems(items, isUniqueId);
        },
        setItem(item: Object, id?: string, isUniqueId?: boolean): void {
            return this.ej2Instances.setItem(item, id, isUniqueId);
        },
        showItems(items: string[], isUniqueId?: boolean): void {
            return this.ej2Instances.showItems(items, isUniqueId);
        },
    }
});

export type ContextMenuComponent = typeof ComponentBase & {
    ej2Instances: ContextMenu;
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
    close(): void;
    destroy(): void;
    enableItems(items: string[], enable: boolean, isUniqueId?: boolean): void;
    getItemIndex(item: Object | string, isUniqueId?: boolean): number[];
    getMenuWidth(menuElement: Object, width: number, isRtl: boolean): number;
    hideItems(items: string[], isUniqueId?: boolean): void;
    insertAfter(items: Object[], text: string, isUniqueId?: boolean): void;
    insertBefore(items: Object[], text: string, isUniqueId?: boolean): void;
    open(top: number, left: number, target?: Object): void;
    removeItems(items: string[], isUniqueId?: boolean): void;
    setItem(item: Object, id?: string, isUniqueId?: boolean): void;
    showItems(items: string[], isUniqueId?: boolean): void
};

export const ContextMenuPlugin = {
    name: 'ejs-contextmenu',
    install(Vue: any) {
        Vue.component(ContextMenuPlugin.name, ContextMenuComponent);

    }
}
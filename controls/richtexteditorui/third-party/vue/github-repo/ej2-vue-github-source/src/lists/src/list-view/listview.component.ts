import { ComponentBase, gh, getProps, isExecute, vueDefineComponent, DefineVueComponent } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined, getValue } from '@syncfusion/ej2-base';

import { ListView, ListViewModel } from '@syncfusion/ej2-lists';


export const properties: string[] = ['isLazyUpdate', 'plugins', 'animation', 'checkBoxPosition', 'cssClass', 'dataSource', 'disableHtmlEncode', 'enable', 'enableHtmlSanitizer', 'enablePersistence', 'enableRtl', 'enableVirtualization', 'enabled', 'fields', 'groupTemplate', 'headerTemplate', 'headerTitle', 'height', 'htmlAttributes', 'locale', 'query', 'showCheckBox', 'showHeader', 'showIcon', 'sortOrder', 'template', 'width', 'actionBegin', 'actionComplete', 'actionFailure', 'scroll', 'select'];
export const modelProps: string[] = [];

export const testProp: any = getProps({props: properties});
export const props = testProp[0], watch = testProp[1], emitProbs: any = Object.keys(watch);
emitProbs.push('modelchanged', 'update:modelValue');
for (let props of modelProps) { emitProbs.push('update:'+props) }

/**
 * Represents VueJS ListView Component
 * ```
 * <ejs-listview :dataSource='data'></ejs-listview>
 * ```
 */
export let ListViewComponent: DefineVueComponent<ListViewModel> =  vueDefineComponent({
    name: 'ListViewComponent',
    mixins: [ComponentBase],
    props: props,
    watch: watch,
    emits: emitProbs,
    provide() { return { custom: this.custom } },
    data() {
        return {
            ej2Instances: new ListView({}) as any,
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
        addItem(data: undefined[], fields: Object, index?: number): void {
            return this.ej2Instances.addItem(data, fields, index);
        },
        back(): void {
            return this.ej2Instances.back();
        },
        checkAllItems(): void {
            return this.ej2Instances.checkAllItems();
        },
        checkItem(item: Object | Object | Object): void {
            return this.ej2Instances.checkItem(item);
        },
        destroy(): void {
            return this.ej2Instances.destroy();
        },
        disableItem(item: Object | Object | Object): void {
            return this.ej2Instances.disableItem(item);
        },
        enableItem(item: Object | Object | Object): void {
            return this.ej2Instances.enableItem(item);
        },
        findItem(item: Object | Object | Object): Object {
            return this.ej2Instances.findItem(item);
        },
        getSelectedItems(): Object | Object | Object | Object {
            return this.ej2Instances.getSelectedItems();
        },
        hideItem(item: Object | Object | Object): void {
            return this.ej2Instances.hideItem(item);
        },
        refreshItemHeight(): void {
            return this.ej2Instances.refreshItemHeight();
        },
        removeItem(item: Object | Object | Object): void {
            return this.ej2Instances.removeItem(item);
        },
        removeMultipleItems(item: Object[] | Object[] | Object[]): void {
            return this.ej2Instances.removeMultipleItems(item);
        },
        requiredModules(): Object[] {
            return this.ej2Instances.requiredModules();
        },
        selectItem(item: Object | Object | Object): void {
            return this.ej2Instances.selectItem(item);
        },
        selectMultipleItems(item: Object[] | Object[] | Object[]): void {
            return this.ej2Instances.selectMultipleItems(item);
        },
        showItem(item: Object | Object | Object): void {
            return this.ej2Instances.showItem(item);
        },
        uncheckAllItems(): void {
            return this.ej2Instances.uncheckAllItems();
        },
        uncheckItem(item: Object | Object | Object): void {
            return this.ej2Instances.uncheckItem(item);
        },
        unselectItem(item?: Object | Object | Object): void {
            return this.ej2Instances.unselectItem(item);
        },
    }
});

export type ListViewComponent = typeof ComponentBase & {
    ej2Instances: ListView;
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
    addItem(data: undefined[], fields: Object, index?: number): void;
    back(): void;
    checkAllItems(): void;
    checkItem(item: Object | Object | Object): void;
    destroy(): void;
    disableItem(item: Object | Object | Object): void;
    enableItem(item: Object | Object | Object): void;
    findItem(item: Object | Object | Object): Object;
    getSelectedItems(): Object | Object | Object | Object;
    hideItem(item: Object | Object | Object): void;
    refreshItemHeight(): void;
    removeItem(item: Object | Object | Object): void;
    removeMultipleItems(item: Object[] | Object[] | Object[]): void;
    requiredModules(): Object[];
    selectItem(item: Object | Object | Object): void;
    selectMultipleItems(item: Object[] | Object[] | Object[]): void;
    showItem(item: Object | Object | Object): void;
    uncheckAllItems(): void;
    uncheckItem(item: Object | Object | Object): void;
    unselectItem(item?: Object | Object | Object): void
};

export const ListViewPlugin = {
    name: 'ejs-listview',
    install(Vue: any) {
        Vue.component(ListViewPlugin.name, ListViewComponent);

    }
}
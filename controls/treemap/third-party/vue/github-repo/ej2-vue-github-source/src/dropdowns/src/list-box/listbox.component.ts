import { ComponentBase, gh, getProps, isExecute, vueDefineComponent, DefineVueComponent } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined, getValue } from '@syncfusion/ej2-base';
import { isUndefined } from '@syncfusion/ej2-base';

import { ListBox, ListBoxModel } from '@syncfusion/ej2-dropdowns';


export const properties: string[] = ['isLazyUpdate', 'plugins', 'actionFailureTemplate', 'allowDragAndDrop', 'allowFiltering', 'cssClass', 'dataSource', 'enablePersistence', 'enableRtl', 'enabled', 'fields', 'filterBarPlaceholder', 'filterType', 'groupTemplate', 'height', 'ignoreAccent', 'ignoreCase', 'itemTemplate', 'locale', 'maximumSelectionLength', 'noRecordsTemplate', 'query', 'scope', 'selectionSettings', 'sortOrder', 'toolbarSettings', 'value', 'zIndex', 'actionBegin', 'actionComplete', 'actionFailure', 'beforeDrop', 'beforeItemRender', 'change', 'created', 'dataBound', 'destroyed', 'drag', 'dragStart', 'drop', 'filtering', 'select'];
export const modelProps: string[] = ['value'];

export const testProp: any = getProps({props: properties});
export const props = testProp[0], watch = testProp[1], emitProbs: any = Object.keys(watch);
emitProbs.push('modelchanged', 'update:modelValue');
for (let props of modelProps) { emitProbs.push('update:'+props) }

/**
 * ListBox component allows the user to select values from the predefined list of values.
 * ```html
 * <ejs-listbox :dataSource='data'></ejs-listbox>
 * ```
 */
export let ListBoxComponent: DefineVueComponent<ListBoxModel> =  vueDefineComponent({
    name: 'ListBoxComponent',
    mixins: [ComponentBase],
    props: props,
    watch: watch,
    emits: emitProbs,
    model: { event: 'modelchanged' },
    provide() { return { custom: this.custom } },
    data() {
        return {
            ej2Instances: new ListBox({}) as any,
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
        return h('input', slots);
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
        addItems(items: Object[] | Object, itemIndex?: number): void {
            return this.ej2Instances.addItems(items, itemIndex);
        },
        destroy(): void {
            return this.ej2Instances.destroy();
        },
        enableItems(items: string[], enable: boolean, isValue?: boolean): void {
            return this.ej2Instances.enableItems(items, enable, isValue);
        },
        filter(dataSource: undefined[] | Object | string[] | number[] | boolean[], query?: Object, fields?: Object): void {
            return this.ej2Instances.filter(dataSource, query, fields);
        },
        getDataByValue(value: string | number | boolean | object): Object | string | number | boolean {
            return this.ej2Instances.getDataByValue(value);
        },
        getDataByValues(value: string[] | number[] | boolean[]): undefined[] {
            return this.ej2Instances.getDataByValues(value);
        },
        getDataList(): undefined[] | string[] | boolean[] | number[] {
            return this.ej2Instances.getDataList();
        },
        getItems(): Object[] {
            return this.ej2Instances.getItems();
        },
        getSortedList(): undefined[] | string[] | boolean[] | number[] {
            return this.ej2Instances.getSortedList();
        },
        hideSpinner(): void {
            return this.ej2Instances.hideSpinner();
        },
        moveAllTo(targetId?: string, index?: number): void {
            return this.ej2Instances.moveAllTo(targetId, index);
        },
        moveBottom(value?: string[] | number[] | boolean[]): void {
            return this.ej2Instances.moveBottom(value);
        },
        moveDown(value?: string[] | number[] | boolean[]): void {
            return this.ej2Instances.moveDown(value);
        },
        moveTo(value?: string[] | number[] | boolean[], index?: number, targetId?: string): void {
            return this.ej2Instances.moveTo(value, index, targetId);
        },
        moveTop(value?: string[] | number[] | boolean[]): void {
            return this.ej2Instances.moveTop(value);
        },
        moveUp(value?: string[] | number[] | boolean[]): void {
            return this.ej2Instances.moveUp(value);
        },
        removeItem(items?: undefined[] | undefined | string | boolean | number | string[] | boolean[] | number[], itemIndex?: number): void {
            return this.ej2Instances.removeItem(items, itemIndex);
        },
        removeItems(items?: Object[] | Object, itemIndex?: number): void {
            return this.ej2Instances.removeItems(items, itemIndex);
        },
        requiredModules(): Object[] {
            return this.ej2Instances.requiredModules();
        },
        selectAll(state: boolean): void {
            return this.ej2Instances.selectAll(state);
        },
        selectItems(items: string[], state: boolean, isValue?: boolean): void {
            return this.ej2Instances.selectItems(items, state, isValue);
        },
        showSpinner(): void {
            return this.ej2Instances.showSpinner();
        },
    }
});

export type ListBoxComponent = typeof ComponentBase & {
    ej2Instances: ListBox;
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
    addItems(items: Object[] | Object, itemIndex?: number): void;
    destroy(): void;
    enableItems(items: string[], enable: boolean, isValue?: boolean): void;
    filter(dataSource: undefined[] | Object | string[] | number[] | boolean[], query?: Object, fields?: Object): void;
    getDataByValue(value: string | number | boolean | object): Object | string | number | boolean;
    getDataByValues(value: string[] | number[] | boolean[]): undefined[];
    getDataList(): undefined[] | string[] | boolean[] | number[];
    getItems(): Object[];
    getSortedList(): undefined[] | string[] | boolean[] | number[];
    hideSpinner(): void;
    moveAllTo(targetId?: string, index?: number): void;
    moveBottom(value?: string[] | number[] | boolean[]): void;
    moveDown(value?: string[] | number[] | boolean[]): void;
    moveTo(value?: string[] | number[] | boolean[], index?: number, targetId?: string): void;
    moveTop(value?: string[] | number[] | boolean[]): void;
    moveUp(value?: string[] | number[] | boolean[]): void;
    removeItem(items?: undefined[] | undefined | string | boolean | number | string[] | boolean[] | number[], itemIndex?: number): void;
    removeItems(items?: Object[] | Object, itemIndex?: number): void;
    requiredModules(): Object[];
    selectAll(state: boolean): void;
    selectItems(items: string[], state: boolean, isValue?: boolean): void;
    showSpinner(): void
};

export const ListBoxPlugin = {
    name: 'ejs-listbox',
    install(Vue: any) {
        Vue.component(ListBoxPlugin.name, ListBoxComponent);

    }
}
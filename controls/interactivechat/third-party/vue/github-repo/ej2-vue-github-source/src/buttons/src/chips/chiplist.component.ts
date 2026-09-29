import { ComponentBase, gh, getProps, isExecute, vueDefineComponent, DefineVueComponent } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined, getValue } from '@syncfusion/ej2-base';

import { ChipList, ChipListModel } from '@syncfusion/ej2-buttons';
import { ChipsDirective, ChipDirective, ChipsPlugin, ChipPlugin } from './chips.directive'


export const properties: string[] = ['isLazyUpdate', 'plugins', 'allowDragAndDrop', 'avatarIconCss', 'avatarText', 'chips', 'cssClass', 'dragArea', 'enableDelete', 'enablePersistence', 'enableRtl', 'enabled', 'htmlAttributes', 'leadingIconCss', 'leadingIconUrl', 'locale', 'selectedChips', 'selection', 'text', 'trailingIconCss', 'trailingIconUrl', 'beforeClick', 'click', 'created', 'delete', 'deleted', 'dragStart', 'dragStop', 'dragging'];
export const modelProps: string[] = [];

export const testProp: any = getProps({props: properties});
export const props = testProp[0], watch = testProp[1], emitProbs: any = Object.keys(watch);
emitProbs.push('modelchanged', 'update:modelValue');
for (let props of modelProps) { emitProbs.push('update:'+props) }

/**
 * Represents the Essential JS 2 VueJS ChipList Component.
 * ```html
 * <ejs-chiplist></ejs-chiplist>
 * ```
 */
export let ChipListComponent: DefineVueComponent<ChipListModel> =  vueDefineComponent({
    name: 'ChipListComponent',
    mixins: [ComponentBase],
    props: props,
    watch: watch,
    emits: emitProbs,
    provide() { return { custom: this.custom } },
    data() {
        return {
            ej2Instances: new ChipList({}) as any,
            propKeys: properties as string[],
            models: modelProps as string[],
            hasChildDirective: true as boolean,
            hasInjectedModules: false as boolean,
            tagMapper: {"e-chips":"e-chip"} as { [key: string]: Object },
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
        add(chipsData: string[] | number[] | Object[] | string | number | Object): void {
            return this.ej2Instances.add(chipsData);
        },
        destroy(): void {
            return this.ej2Instances.destroy();
        },
        find(fields: number | Object): Object {
            return this.ej2Instances.find(fields);
        },
        getSelectedChips(): Object | Object | undefined {
            return this.ej2Instances.getSelectedChips();
        },
        remove(fields: number | number[] | Object | Object[]): void {
            return this.ej2Instances.remove(fields);
        },
        select(fields: number | number[] | Object | Object[] | string[], selectionType?: Object): void {
            return this.ej2Instances.select(fields, selectionType);
        },
    }
});

export type ChipListComponent = typeof ComponentBase & {
    ej2Instances: ChipList;
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
    add(chipsData: string[] | number[] | Object[] | string | number | Object): void;
    destroy(): void;
    find(fields: number | Object): Object;
    getSelectedChips(): Object | Object | undefined;
    remove(fields: number | number[] | Object | Object[]): void;
    select(fields: number | number[] | Object | Object[] | string[], selectionType?: Object): void
};

export const ChipListPlugin = {
    name: 'ejs-chiplist',
    install(Vue: any) {
        Vue.component(ChipListPlugin.name, ChipListComponent);
        Vue.component(ChipPlugin.name, ChipDirective);
        Vue.component(ChipsPlugin.name, ChipsDirective);

    }
}
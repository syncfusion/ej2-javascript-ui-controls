import { ComponentBase, gh, getProps, isExecute, vueDefineComponent, DefineVueComponent } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined, getValue } from '@syncfusion/ej2-base';

import { Kanban, KanbanModel } from '@syncfusion/ej2-kanban';
import { ColumnsDirective, ColumnDirective, ColumnsPlugin, ColumnPlugin } from './columns.directive'
import { StackedHeadersDirective, StackedHeaderDirective, StackedHeadersPlugin, StackedHeaderPlugin } from './stackedheaders.directive'


export const properties: string[] = ['isLazyUpdate', 'plugins', 'allowColumnDragAndDrop', 'allowDragAndDrop', 'allowKeyboard', 'cardHeight', 'cardSettings', 'columns', 'constraintType', 'cssClass', 'dataSource', 'dialogSettings', 'enableHtmlSanitizer', 'enablePersistence', 'enableRtl', 'enableTooltip', 'enableVirtualization', 'externalDropId', 'height', 'keyField', 'locale', 'query', 'showEmptyColumn', 'sortSettings', 'stackedHeaders', 'swimlaneSettings', 'tooltipTemplate', 'width', 'actionBegin', 'actionComplete', 'actionFailure', 'cardClick', 'cardDoubleClick', 'cardRendered', 'columnDrag', 'columnDragStart', 'columnDrop', 'created', 'dataBinding', 'dataBound', 'dataSourceChanged', 'dataStateChange', 'dialogClose', 'dialogOpen', 'drag', 'dragStart', 'dragStop', 'queryCellInfo'];
export const modelProps: string[] = [];

export const testProp: any = getProps({props: properties});
export const props = testProp[0], watch = testProp[1], emitProbs: any = Object.keys(watch);
emitProbs.push('modelchanged', 'update:modelValue');
for (let props of modelProps) { emitProbs.push('update:'+props) }

/**
 * `ej-kanban` represents the VueJS Kanban Component.
 * ```
 * <ejs-kanban></ejs-kanban>
 * ```
 */
export let KanbanComponent: DefineVueComponent<KanbanModel> =  vueDefineComponent({
    name: 'KanbanComponent',
    mixins: [ComponentBase],
    props: props,
    watch: watch,
    emits: emitProbs,
    provide() { return { custom: this.custom } },
    data() {
        return {
            ej2Instances: new Kanban({}) as any,
            propKeys: properties as string[],
            models: modelProps as string[],
            hasChildDirective: true as boolean,
            hasInjectedModules: false as boolean,
            tagMapper: {"e-columns":"e-column","e-stackedHeaders":"e-stackedHeader"} as { [key: string]: Object },
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
        addCard(cardData: Object | Object[], index?: number): void {
            return this.ej2Instances.addCard(cardData, index);
        },
        addColumn(columnOptions: Object, index: number): void {
            return this.ej2Instances.addColumn(columnOptions, index);
        },
        closeDialog(): void {
            return this.ej2Instances.closeDialog();
        },
        deleteCard(cardData: string | number | Object | Object[]): void {
            return this.ej2Instances.deleteCard(cardData);
        },
        deleteColumn(index: number): void {
            return this.ej2Instances.deleteColumn(index);
        },
        destroy(): void {
            return this.ej2Instances.destroy();
        },
        getCardDetails(target: Object): Object {
            return this.ej2Instances.getCardDetails(target);
        },
        getColumnData(columnKey: string | number, dataSource?: Object[]): Object[] {
            return this.ej2Instances.getColumnData(columnKey, dataSource);
        },
        getSelectedCards(): Object[] {
            return this.ej2Instances.getSelectedCards();
        },
        getSwimlaneData(keyField: string): Object[] {
            return this.ej2Instances.getSwimlaneData(keyField);
        },
        hideColumn(key: string | number): void {
            return this.ej2Instances.hideColumn(key);
        },
        hideSpinner(): void {
            return this.ej2Instances.hideSpinner();
        },
        openDialog(action: Object, data?: Object): void {
            return this.ej2Instances.openDialog(action, data);
        },
        refreshHeader(): void {
            return this.ej2Instances.refreshHeader();
        },
        refreshUI(args: Object, index?: number): void {
            return this.ej2Instances.refreshUI(args, index);
        },
        renderTemplates(): void {
            return this.ej2Instances.renderTemplates();
        },
        resetTemplates(templates?: string[]): void {
            return this.ej2Instances.resetTemplates(templates);
        },
        showColumn(key: string | number): void {
            return this.ej2Instances.showColumn(key);
        },
        showSpinner(): void {
            return this.ej2Instances.showSpinner();
        },
        templateParser(template: string | Object): any {
            return this.ej2Instances.templateParser(template);
        },
        unwireColumnDragEvent(): void {
            return this.ej2Instances.unwireColumnDragEvent();
        },
        updateCard(cardData: Object | Object[], index?: number): void {
            return this.ej2Instances.updateCard(cardData, index);
        },
        wireColumnDragEvent(): void {
            return this.ej2Instances.wireColumnDragEvent();
        },
    }
});

export type KanbanComponent = typeof ComponentBase & {
    ej2Instances: Kanban;
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
    addCard(cardData: Object | Object[], index?: number): void;
    addColumn(columnOptions: Object, index: number): void;
    closeDialog(): void;
    deleteCard(cardData: string | number | Object | Object[]): void;
    deleteColumn(index: number): void;
    destroy(): void;
    getCardDetails(target: Object): Object;
    getColumnData(columnKey: string | number, dataSource?: Object[]): Object[];
    getSelectedCards(): Object[];
    getSwimlaneData(keyField: string): Object[];
    hideColumn(key: string | number): void;
    hideSpinner(): void;
    openDialog(action: Object, data?: Object): void;
    refreshHeader(): void;
    refreshUI(args: Object, index?: number): void;
    renderTemplates(): void;
    resetTemplates(templates?: string[]): void;
    showColumn(key: string | number): void;
    showSpinner(): void;
    templateParser(template: string | Object): any;
    unwireColumnDragEvent(): void;
    updateCard(cardData: Object | Object[], index?: number): void;
    wireColumnDragEvent(): void
};

export const KanbanPlugin = {
    name: 'ejs-kanban',
    install(Vue: any) {
        Vue.component(KanbanPlugin.name, KanbanComponent);
        Vue.component(ColumnPlugin.name, ColumnDirective);
        Vue.component(ColumnsPlugin.name, ColumnsDirective);
        Vue.component(StackedHeaderPlugin.name, StackedHeaderDirective);
        Vue.component(StackedHeadersPlugin.name, StackedHeadersDirective);

    }
}
import { ComponentBase, gh, getProps, isExecute, vueDefineComponent, DefineVueComponent } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined, getValue } from '@syncfusion/ej2-base';

import { QueryBuilder, QueryBuilderModel } from '@syncfusion/ej2-querybuilder';
import { ColumnsDirective, ColumnDirective, ColumnsPlugin, ColumnPlugin } from './columns.directive'


export const properties: string[] = ['isLazyUpdate', 'plugins', 'addRuleToNewGroups', 'allowDragAndDrop', 'allowValidation', 'autoSelectField', 'autoSelectOperator', 'columns', 'cssClass', 'dataSource', 'displayMode', 'enableNotCondition', 'enablePersistence', 'enableRtl', 'enableSeparateConnector', 'fieldMode', 'fieldModel', 'headerTemplate', 'height', 'immediateModeDelay', 'locale', 'matchCase', 'maxGroupCount', 'operatorModel', 'readonly', 'rule', 'separator', 'showButtons', 'sortDirection', 'summaryView', 'valueModel', 'width', 'actionBegin', 'beforeChange', 'change', 'created', 'dataBound', 'destroyed', 'ruleChange', 'drag', 'dragStart', 'drop'];
export const modelProps: string[] = [];

export const testProp: any = getProps({props: properties});
export const props = testProp[0], watch = testProp[1], emitProbs: any = Object.keys(watch);
emitProbs.push('modelchanged', 'update:modelValue');
for (let props of modelProps) { emitProbs.push('update:'+props) }

/**
 * Represents the VueJS QueryBuilder Component.
 * ```html
 * <ejs-querybuilder></ejs-querybuilder>
 * ```
 */
export let QueryBuilderComponent: DefineVueComponent<QueryBuilderModel> =  vueDefineComponent({
    name: 'QueryBuilderComponent',
    mixins: [ComponentBase],
    props: props,
    watch: watch,
    emits: emitProbs,
    provide() { return { custom: this.custom } },
    data() {
        return {
            ej2Instances: new QueryBuilder({}) as any,
            propKeys: properties as string[],
            models: modelProps as string[],
            hasChildDirective: true as boolean,
            hasInjectedModules: true as boolean,
            tagMapper: {"e-columns":"e-column"} as { [key: string]: Object },
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
        addGroups(groups: Object[], groupID: string): void {
            return this.ej2Instances.addGroups(groups, groupID);
        },
        addRules(rule: Object[], groupID: string): void {
            return this.ej2Instances.addRules(rule, groupID);
        },
        cloneGroup(groupID: string, parentGroupID: string, index: number): void {
            return this.ej2Instances.cloneGroup(groupID, parentGroupID, index);
        },
        cloneRule(ruleID: string, groupID: string, index: number): void {
            return this.ej2Instances.cloneRule(ruleID, groupID, index);
        },
        deleteGroup(target: Object | string): void {
            return this.ej2Instances.deleteGroup(target);
        },
        deleteGroups(groupIdColl: string[]): void {
            return this.ej2Instances.deleteGroups(groupIdColl);
        },
        deleteRules(ruleIdColl: string[]): void {
            return this.ej2Instances.deleteRules(ruleIdColl);
        },
        destroy(): void {
            return this.ej2Instances.destroy();
        },
        getDataManagerQuery(rule: Object): Object {
            return this.ej2Instances.getDataManagerQuery(rule);
        },
        getFilteredRecords(): Object | object {
            return this.ej2Instances.getFilteredRecords();
        },
        getGroup(target: Object | string): Object {
            return this.ej2Instances.getGroup(target);
        },
        getMongoQuery(rule?: Object): string {
            return this.ej2Instances.getMongoQuery(rule);
        },
        getOperators(field: string): undefined[] {
            return this.ej2Instances.getOperators(field);
        },
        getParameterizedNamedSql(rule?: Object): Object {
            return this.ej2Instances.getParameterizedNamedSql(rule);
        },
        getParameterizedSql(rule?: Object): Object {
            return this.ej2Instances.getParameterizedSql(rule);
        },
        getPredicate(rule: Object): Object {
            return this.ej2Instances.getPredicate(rule);
        },
        getRule(elem: string | Object): Object {
            return this.ej2Instances.getRule(elem);
        },
        getRules(): Object {
            return this.ej2Instances.getRules();
        },
        getRulesFromSql(sqlString: string, sqlLocale?: boolean): Object {
            return this.ej2Instances.getRulesFromSql(sqlString, sqlLocale);
        },
        getSqlFromRules(rule?: Object, allowEscape?: boolean, sqlLocale?: boolean): string {
            return this.ej2Instances.getSqlFromRules(rule, allowEscape, sqlLocale);
        },
        getValidRules(currentRule?: Object): Object {
            return this.ej2Instances.getValidRules(currentRule);
        },
        getValues(field: string): object[] {
            return this.ej2Instances.getValues(field);
        },
        lockGroup(groupID: string): void {
            return this.ej2Instances.lockGroup(groupID);
        },
        lockRule(ruleID: string): void {
            return this.ej2Instances.lockRule(ruleID);
        },
        notifyChange(value: string | number | boolean | Object | string[] | number[] | Object[], element: Object, type?: string): void {
            return this.ej2Instances.notifyChange(value, element, type);
        },
        requiredModules(): Object[] {
            return this.ej2Instances.requiredModules();
        },
        reset(): void {
            return this.ej2Instances.reset();
        },
        setMongoQuery(mongoQuery: string, mongoLocale?: boolean): void {
            return this.ej2Instances.setMongoQuery(mongoQuery, mongoLocale);
        },
        setParameterizedNamedSql(sqlQuery: Object): void {
            return this.ej2Instances.setParameterizedNamedSql(sqlQuery);
        },
        setParameterizedSql(sqlQuery: Object): void {
            return this.ej2Instances.setParameterizedSql(sqlQuery);
        },
        setRules(rule: Object): void {
            return this.ej2Instances.setRules(rule);
        },
        setRulesFromSql(sqlString: string, sqlLocale?: boolean): void {
            return this.ej2Instances.setRulesFromSql(sqlString, sqlLocale);
        },
        validateFields(): boolean {
            return this.ej2Instances.validateFields();
        },
    }
});

export type QueryBuilderComponent = typeof ComponentBase & {
    ej2Instances: QueryBuilder;
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
    addGroups(groups: Object[], groupID: string): void;
    addRules(rule: Object[], groupID: string): void;
    cloneGroup(groupID: string, parentGroupID: string, index: number): void;
    cloneRule(ruleID: string, groupID: string, index: number): void;
    deleteGroup(target: Object | string): void;
    deleteGroups(groupIdColl: string[]): void;
    deleteRules(ruleIdColl: string[]): void;
    destroy(): void;
    getDataManagerQuery(rule: Object): Object;
    getFilteredRecords(): Object | object;
    getGroup(target: Object | string): Object;
    getMongoQuery(rule?: Object): string;
    getOperators(field: string): undefined[];
    getParameterizedNamedSql(rule?: Object): Object;
    getParameterizedSql(rule?: Object): Object;
    getPredicate(rule: Object): Object;
    getRule(elem: string | Object): Object;
    getRules(): Object;
    getRulesFromSql(sqlString: string, sqlLocale?: boolean): Object;
    getSqlFromRules(rule?: Object, allowEscape?: boolean, sqlLocale?: boolean): string;
    getValidRules(currentRule?: Object): Object;
    getValues(field: string): object[];
    lockGroup(groupID: string): void;
    lockRule(ruleID: string): void;
    notifyChange(value: string | number | boolean | Object | string[] | number[] | Object[], element: Object, type?: string): void;
    requiredModules(): Object[];
    reset(): void;
    setMongoQuery(mongoQuery: string, mongoLocale?: boolean): void;
    setParameterizedNamedSql(sqlQuery: Object): void;
    setParameterizedSql(sqlQuery: Object): void;
    setRules(rule: Object): void;
    setRulesFromSql(sqlString: string, sqlLocale?: boolean): void;
    validateFields(): boolean
};

export const QueryBuilderPlugin = {
    name: 'ejs-querybuilder',
    install(Vue: any) {
        Vue.component(QueryBuilderPlugin.name, QueryBuilderComponent);
        Vue.component(ColumnPlugin.name, ColumnDirective);
        Vue.component(ColumnsPlugin.name, ColumnsDirective);

    }
}
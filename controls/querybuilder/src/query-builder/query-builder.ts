/**
 * Query Builder Source
 */
import { Component, INotifyPropertyChanged, NotifyPropertyChanges, getComponent, MouseEventArgs, Browser } from '@syncfusion/ej2-base';
import { Property, ChildProperty, Complex, L10n, closest, extend, isNullOrUndefined, Collection, cldrData } from '@syncfusion/ej2-base';
import { getInstance, addClass, removeClass, rippleEffect, detach, classList, isBlazor } from '@syncfusion/ej2-base';
import { Internationalization, DateFormatOptions, KeyboardEventArgs, getUniqueID, select } from '@syncfusion/ej2-base';
import { QueryBuilderModel, ShowButtonsModel, ColumnsModel, RuleModel } from './query-builder-model';
import { Button, RadioButton, ChangeEventArgs as ButtonChangeEventArgs, CheckBox } from '@syncfusion/ej2-buttons';
import { DropDownList, ChangeEventArgs as DropDownChangeEventArgs, FieldSettingsModel, CheckBoxSelection } from '@syncfusion/ej2-dropdowns';
import { MultiSelect, MultiSelectChangeEventArgs, PopupEventArgs  } from '@syncfusion/ej2-dropdowns';
import { EmitType, Event, EventHandler, getValue, Animation, BaseEventArgs } from '@syncfusion/ej2-base';
import { Query, Predicate, DataManager, Deferred, UrlAdaptor } from '@syncfusion/ej2-data';
import { TextBox, NumericTextBox, InputEventArgs, ChangeEventArgs as InputChangeEventArgs } from '@syncfusion/ej2-inputs';
import { DatePicker, ChangeEventArgs as CalendarChangeEventArgs } from '@syncfusion/ej2-calendars';
import { DropDownButton, ItemModel, MenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { Tooltip, createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import { resetBlazorTemplate, updateBlazorTemplate, blazorTemplates, compile as templateCompiler } from '@syncfusion/ej2-base';

type ReturnType = { result: Object[], count: number, aggregates?: Object };
type ruleObj = { condition: string, not: boolean };

/**
 * Defines the Columns of Query Builder
 */
export class Columns extends ChildProperty<Columns> {
    /**
     * Specifies the fields in columns.
     * @default null
     */
    @Property(null)
    public field: string;
    /**
     * Specifies the labels name in columns
     * @default null
     */
    @Property(null)
    public label: string;
    /**
     * Specifies the types in columns field
     * @default null
     */
    @Property(null)
    public type: string;
    /**
     * Specifies the values in columns or bind the values from sub controls.
     * @default null
     */
    @Property(null)
    public values: string[] | number[] | boolean[];
    /**
     * Specifies the operators in columns.
     * @default null
     */
    @Property(null)
    public operators: { [key: string]: Object }[];
    /**
     * Specifies the rule template for the field with any other widgets.
     */
    @Property()
    public ruleTemplate: string;

    /**
     * Specifies the template for value field such as slider or any other widgets.
     * @default null
     */
    @Property(null)
    public template: TemplateColumn | string;
    /**
     * Specifies the validation for columns (text, number and date).
     * @default  { isRequired: true , min: 0, max: Number.MAX_VALUE }
     */
    @Property({ isRequired: true , min: 0, max: Number.MAX_VALUE })
    public validation: Validation;
    /**
     * Specifies the date format for columns.
     * @aspType string
     * @blazorType string
     * @default null
     */
    @Property(null)
    public format: string | FormatObject;
    /**
     * Specifies the step value(numeric textbox) for columns.
     * @default null
     */
    @Property(null)
    public step: number;
    /**
     * Specifies the default value for columns.
     * @default null
     */
    @Property(null)
    public value:  string[] | number[] | string | number | boolean | Date;
    /**
     * Specifies the category for columns.
     * @default null
     */
    @Property(null)
    public category: string;
}
/**
 * Defines the rule of Query Builder
 */
export class Rule extends ChildProperty<Rule> {
    /**
     * Specifies the condition value in group.
     * @default null
     */
    @Property(null)
    public condition: string;
    /**
     * Specifies the rules in group.
     * @default []
     */
    @Collection<RuleModel>([], Rule)
    public rules: RuleModel[];
    /**
     * Specifies the field value in group.
     * @default null
     */
    @Property(null)
    public field: string;
    /**
     * Specifies the label value in group.
     * @default null
     */
    @Property(null)
    public label: string;
    /**
     * Specifies the type value in group.
     * @default null
     */
    @Property(null)
    public type: string;
    /**
     * Specifies the operator value in group.
     * @default null
     */
    @Property(null)
    public operator: string;
    /**
     * Specifies the sub controls value in group.
     * @default null
     */
    @Property(null)
    public value: string[] | number[] | string | number | boolean;
    /**
     * Specifies whether not condition is true/false.
     * @default false
     */
    @Property(false)
    public not: boolean;
}
/**
 * Defines the ruleDelete, groupInsert, and groupDelete options of Query Builder.
 */
export class ShowButtons extends ChildProperty<ShowButtons> {
    /**
     * Specifies the boolean value in ruleDelete that the enable/disable the buttons in rule.
     * @default true
     */
    @Property(true)
    public ruleDelete: boolean;
    /**
     * Specifies the boolean value in groupInsert that the enable/disable the buttons in group.
     * @default true
     */
    @Property(true)
    public groupInsert: boolean;
    /**
     * Specifies the boolean value in groupDelete that the enable/disable the buttons in group.
     * @default true
     */
    @Property(true)
    public groupDelete: boolean;
}
export interface FormatObject {
    /**
     * Specifies the format in which the date format will process
     */
    skeleton?: string;
}
/** 
 * Specify Specifies the displayMode as Horizontal or Vertical.
 */
export type DisplayMode =
    /**  Display the Horizontal UI */
    'Horizontal' |
    /**  Display the Vertical UI */
    'Vertical';
/** 
 * Specifies the sort direction of the field names. They are
 * * Default
 * * Ascending
 * * Descending
 */
export type SortDirection =
    /**  Show the field names in default */
    'Default' |
    /**  Show the field names in Ascending */
    'Ascending' |
    /**  Show the field names in Descending */
    'Descending';

@NotifyPropertyChanges

export class QueryBuilder extends Component<HTMLDivElement> implements INotifyPropertyChanged {
    private groupIdCounter: number;
    private ruleIdCounter: number;
    private btnGroupId: number;
    private levelColl: Level;
    private isImportRules: boolean;
    private isPublic: boolean;
    private parser: string[][];
    private defaultLocale: Object;
    private l10n: L10n;
    private intl: Internationalization;
    private items: ItemModel[];
    private customOperators: Object;
    private operators: Object;
    private ruleElem: Element;
    private groupElem: Element;
    private dataColl: object[];
    private dataManager: DataManager;
    private selectedColumn: ColumnsModel;
    private previousColumn: ColumnsModel;
    private actionButton: Element;
    private isInitialLoad: boolean;
    private timer: number;
    private isReadonly: boolean = true;
    private fields: Object = { text: 'label', value: 'field' };
    private columnTemplateFn: Function;
    private target: Element;
    private updatedRule: ruleObj = { not: false, condition: 'and' };
    private ruleTemplateFn: Function;
    private isLocale: boolean = false;
    private isRefreshed: boolean = false;
    /** 
     * Triggers when the component is created.
     * @event
     * @blazorProperty 'Created'
     */
    @Event()
    public created: EmitType<Event>;
    /**
     * Triggers when field, operator, value is change.
     * @event
     * @blazorProperty 'OnActionBegin'
     */
    @Event()
    public actionBegin: EmitType<ActionEventArgs>;
    /**
     * Triggers before the condition (And/Or), field, operator, value is changed.
     * @event
     * @blazorProperty 'OnValueChange'
     */
    @Event()
    public beforeChange: EmitType<ChangeEventArgs>;
    /**
     * Triggers when changing the condition(AND/OR), field, value, operator is changed
     * @event
     * @blazorProperty 'Changed'
     */
    @Event()
    public change: EmitType<ChangeEventArgs>;
    /**
     * Triggers when changing the condition(AND/OR), field, value, operator is changed
     * @event
     * @blazorProperty 'RuleChanged'
     */
    @Event()
    public ruleChange: EmitType<RuleChangeEventArgs>;
    /**
     * Specifies the showButtons settings of the query builder component.
     * The showButtons can be enable Enables or disables the ruleDelete, groupInsert, and groupDelete buttons.
     * @default { ruleDelete: true , groupInsert: true, groupDelete: true }
     */
    @Property({ ruleDelete: true, groupInsert: true, groupDelete: true })
    public showButtons: ShowButtonsModel;
    /**
     * Shows or hides the filtered query.
     * @default false
     */
    @Property(false)
    public summaryView: boolean;
    /**
     * Enables or disables the validation.
     * @default false
     */
    @Property(false)
    public allowValidation: boolean;
    /**
     * Specifies columns to create filters.
     * @default {}
     */
    @Property([])
    public columns: ColumnsModel[];
    /**
     * Defines class or multiple classes, which are separated by a space in the QueryBuilder element.
     * You can add custom styles to the QueryBuilder using the cssClass property.
     * @default ''
     */
    @Property('')
    public cssClass: string;
    /**
     * Binds the column name from data source in query-builder.
     * The `dataSource` is an array of JavaScript objects.
     * @default []
     */
    @Property([])
    public dataSource: Object[] | Object | DataManager;
    /**
     * Specifies the displayMode as Horizontal or Vertical.
     * @default 'Horizontal'
     */
    @Property('Horizontal')
    public displayMode: DisplayMode;
    /**
     * Enable or disable persisting component's state between page reloads. 
     * If enabled, filter states will be persisted.
     * @default false.
     */
    @Property(false)
    public enablePersistence: boolean;
    /**
     * Specifies the sort direction of the field names.
     * @default 'Default'
     */
    @Property('Default')
    public sortDirection: SortDirection;
    /**
     * Specifies the maximum group count or restricts the group count.
     * @default 5
     */
    @Property(5)
    public maxGroupCount: number;
    /**
     * Specifies the height of the query builder.
     * @default 'auto'
     */
    @Property('auto')
    public height: string;
    /**
     * Specifies the width of the query builder.
     * @default 'auto'
     */
    @Property('auto')
    public width: string;
    /**
     * If match case is set to true, the grid filters the records with exact match. 
     * if false, it filters case insensitive records (uppercase and lowercase letters treated the same).
     * @default false
     */
    @Property(false)
    public matchCase: boolean;
    /**
     * If immediateModeDelay is set by particular number, the rule Change event is triggered after that period.
     * @default 0
     */
    @Property(0)
    public immediateModeDelay: number;
    /**
     * Enables/Disables the not group condition in query builder.
     * @default false
     */
    @Property(false)
    public enableNotCondition: boolean;
    /**
     * When set to true, the user interactions on the component are disabled.
     * @default false
     */
    @Property(false)
    public readonly: boolean;
    /**
     * Specifies the separator string for column.
     * @default ''
     */
    @Property('')
    public separator: string;
    /**
     * Defines rules in the QueryBuilder.
     * Specifies the initial rule, which is JSON data.
     * @default {}
     */
    @Complex<RuleModel>({ condition: 'and', rules: [] }, Rule)
    public rule: RuleModel;

    constructor(options?: QueryBuilderModel, element?: string | HTMLDivElement) {
        super(options, <string | HTMLDivElement>element);
        MultiSelect.Inject(CheckBoxSelection);
    }

    protected getPersistData(): string {
        return this.addOnPersist(['rule']);
    }
    /**
     * Clears the rules without root rule.
     * @returns void.
     */
    public reset(): void {
        this.isImportRules = false;
        let bodeElem: Element = this.element.querySelector('.e-group-body');
        bodeElem.innerHTML = '';
        if (this.enableNotCondition) {
            removeClass(this.element.querySelectorAll('.e-qb-toggle'), 'e-active-toggle');
        }
        bodeElem.appendChild(this.createElement('div', { attrs: { class: 'e-rule-list' } }));
        this.levelColl[this.element.id + '_group0'] = [0];
        this.rule = { condition: 'and', not: false, rules: [] };
        this.disableRuleCondition(bodeElem.parentElement);
    }
    private getWrapper(): Element {
        return this.element;
    }
    protected getModuleName(): string {
        return 'query-builder';
    }
    private initialize(): void {
        if (this.dataColl.length) {
            let columnKeys: string[] = Object.keys(this.dataColl[0]);
            let cols: ColumnsModel[] = []; let categories: string[] = [];
            let type: string; let groupBy: boolean = false;
            let isDate: boolean = false; let value: string | number | boolean | Object;
            let validateObj: Validation = {isRequired: true, min: 0, max: Number.MAX_VALUE};
            if (this.columns.length) {
                this.columnSort();
                let columns: ColumnsModel[] = this.columns;
                for (let i: number = 0, len: number = columns.length; i < len; i++) {
                    this.updateCustomOperator(columns[i]);
                    if (!columns[i].type) {
                        if (columnKeys.indexOf(columns[i].field) > -1) {
                            value = this.dataColl[0][columns[i].field];
                            type = typeof value;
                            if (type === 'string') {
                                isDate = !isNaN(Date.parse(value as string));
                            } else if (type === 'object') {
                                isDate = value instanceof Date && !isNaN(value.getTime());
                                type = 'string';
                            }
                            columns[i].type = type;
                            isDate = false;
                        }
                        type = 'string';
                    }
                    if (!columns[i].validation) {
                        columns[i].validation = validateObj;
                    }
                    if (columns[i].category) {
                        groupBy = true;
                    } else {
                        columns[i].category = this.l10n.getConstant('OtherFields');
                    }
                    if (categories.indexOf(columns[i].category) < 0) {
                        categories.push(columns[i].category);
                    }
                    if (!columns[i].operators || this.isLocale) {
                        columns[i].operators = this.customOperators[columns[i].type + 'Operator'];
                    }
                }
                if (groupBy && (categories.length > 1 || categories[0] !== this.l10n.getConstant('OtherFields'))) {
                    this.fields = { text: 'label', value: 'field', groupBy: 'category' };
                }
            } else {
                for (let i: number = 0, len: number = columnKeys.length; i < len; i++) {
                    value = this.dataColl[0][columnKeys[i]];
                    type = typeof value;
                    if (type === 'string') {
                        isDate = !isNaN(Date.parse(value as string));
                    } else if (type === 'object') {
                        isDate = value instanceof Date && !isNaN(value.getTime());
                        type = 'string';
                    }
                    cols[i] = { 'field': columnKeys[i], 'label': columnKeys[i], 'type': isDate ? 'date' : type,
                    'validation': validateObj } as Columns;
                    isDate = false;
                    cols[i].operators = this.customOperators[cols[i].type + 'Operator'];
                }
                this.columns = cols as Columns[];
            }
        } else if (this.columns.length) {
            let columns: ColumnsModel[] = this.columns;
            for (let i: number = 0, len: number = columns.length; i < len; i++) {
                if (columns[i].category) {
                    this.fields = { text: 'label', value: 'field', groupBy: 'category' };
                } else {
                    columns[i].category = this.l10n.getConstant('OtherFields');
                }
                this.updateCustomOperator(columns[i]);
                if (!columns[i].operators || this.isLocale) {
                    columns[i].operators = this.customOperators[columns[i].type + 'Operator'];
                }
            }
        }
    }

    private updateCustomOperator(column: ColumnsModel): void {
        if (column.operators) {
            for (let j: number = 0; j < column.operators.length; j++) {
                let sqlIdx: number = Object.keys(column.operators[j]).indexOf('sqlOperator');
                if (sqlIdx > -1) {
                    let operator: { [key: string]: object } = column.operators[j];
                    let operColl: string[] = Object.keys(operator);
                    let values: string[] = operColl.map((key: string) => operator[key]).join(',').split(',');
                    let valueIdx: number = operColl.indexOf('value');
                    this.operators[values[valueIdx]] = values[sqlIdx];
                }
            }
        }
    }

    private focusEventHandler(event: MouseEventArgs): void {
        this.target = event.target as Element;
    }

    private clickEventHandler(event: MouseEventArgs): void {
        let target: Element = event.target as Element; let args: ChangeEventArgs;
        this.isImportRules = false; let groupID: string;
        if (target.tagName === 'SPAN') {
            target = target.parentElement;
        }
        if (target.className.indexOf('e-collapse-rule') > -1) {
            let animation: Animation = new Animation({ duration: 1000, delay: 0 });
            if (this.element.querySelectorAll('.e-summary-content').length < 1) {
                this.renderSummary();
            }
            let summaryElem: HTMLElement =  document.getElementById(this.element.id + '_summary_content');
            let txtareaElem: HTMLElement = summaryElem.querySelector('.e-summary-text');
            animation.animate('.e-query-builder', { name: 'SlideLeftIn' });
            let groupElem: HTMLElement = this.element.querySelector('.e-group-container') as HTMLElement;
            groupElem.style.display = 'none';
            txtareaElem.textContent = this.getSqlFromRules(this.rule);
            summaryElem.style.display = 'block';
            txtareaElem.style.height = txtareaElem.scrollHeight + 'px';
        }
        if (target.tagName === 'BUTTON' && target.className.indexOf('e-qb-toggle') < 0) {
            if (target.className.indexOf('e-removerule') > -1) {
                this.actionButton = target;
                this.deleteRule(target);
            } else if (target.className.indexOf('e-deletegroup') > -1) {
                this.actionButton = target;
                this.deleteGroup(closest(target, '.e-group-container'));
            } else if (target.className.indexOf('e-edit-rule') > -1) {
                let animation: Animation = new Animation({ duration: 1000, delay: 0 });
                animation.animate('.e-query-builder' , { name: 'SlideLeftIn' });
                document.getElementById(this.element.id + '_summary_content').style.display = 'none';
                if (this.element.querySelectorAll('.e-group-container').length < 1) {
                    this.addGroupElement(false, this.element, this.rule.condition);
                    let mRules: RuleModel = extend({}, this.rule, {}, true);
                    this.setGroupRules(mRules);
                    this.renderSummaryCollapse();
                } else {
                    let groupElem: HTMLElement = this.element.querySelector('.e-group-container') as HTMLElement;
                    if (groupElem.querySelectorAll('.e-collapse-rule').length < 1) {
                        this.renderSummaryCollapse();
                    }
                    groupElem.style.display = 'block';
                }
            }
        } else if ((target.tagName === 'LABEL' && target.parentElement.className.indexOf('e-btn-group') > -1) ||
        target.className.indexOf('e-qb-toggle') > -1) {
            let element: Element = closest(target, '.e-group-container');
            let forIdValue: string = target.getAttribute('for');
            let targetValue: string;
            if (forIdValue) {
                targetValue = document.getElementById(forIdValue).getAttribute('value');
            }
            groupID = element.id.replace(this.element.id + '_', '');
            let group: RuleModel = this.getGroup(groupID);
            let ariaChecked: boolean;
            if (this.enableNotCondition) {
                if (target.className.indexOf('e-qb-toggle') > -1) {
                    let toggleElem: Element = element.getElementsByClassName('e-qb-toggle')[0];
                    if (toggleElem.className.indexOf('e-active-toggle') > -1) {
                        removeClass([toggleElem], 'e-active-toggle');
                        ariaChecked = false;
                    } else {
                        addClass([toggleElem], 'e-active-toggle');
                        ariaChecked = true;
                    }
                    targetValue = group.condition;
                } else {
                    ariaChecked = group.not;
                }
            }
            args = { groupID: groupID, cancel: false, type: 'condition', value: targetValue.toLowerCase() };
            if (this.enableNotCondition) {
                args = { groupID: groupID, cancel: false, type: 'condition', value: targetValue.toLowerCase(),
                'not': ariaChecked };
            }
            if (!this.isImportRules) {
                this.trigger('beforeChange', args, (observedChangeArgs: ChangeEventArgs) => {
                    this.beforeSuccessCallBack(observedChangeArgs, target);
                });
            } else {
                this.beforeSuccessCallBack(args, target);
            }
        }
        this.target = target;
    }
    private beforeSuccessCallBack(args: ChangeEventArgs, target: Element): void {
        if (!args.cancel) {
            let element: Element = closest(target, '.e-group-container');
            let groupID: string =  element.id.replace(this.element.id + '_', '');
            let beforeRules: RuleModel = this.getValidRules(this.rule);
            let rule: RuleModel = this.getParentGroup(element);
            rule.condition = args.value as string;
            if (this.enableNotCondition) {
                rule.not = args.not;
            }
            if (!this.isImportRules) {
                this.trigger('change', { groupID: groupID, type: 'condition', value: rule.condition });
            }
            this.filterRules(beforeRules, this.getValidRules(this.rule), 'condition');
        }
    }

    private selectBtn(target: Element, event: MenuEventArgs): void {
        if (event.name === 'beforeOpen') {
            if (this.showButtons.groupInsert) {
                removeClass([event.element.querySelector('li span.e-addgroup').parentElement], 'e-button-hide');
            } else {
                addClass([event.element.querySelector('li span.e-addgroup').parentElement], 'e-button-hide');
            }
        } else if (event.element.children[0].className.indexOf('e-addrule') > -1) {
            this.addRuleElement(closest(target, '.e-group-container'), {});
        } else if (event.element.children[0].className.indexOf('e-addgroup') > -1) {
            this.addGroupElement(true, closest(target, '.e-group-container'), '', true);
        }
    }
    private appendRuleElem(
        target: Element, column: ColumnsModel, type: string, parentId: string, action: string, rule?: RuleModel): Element {
        let ruleElem: Element; let elem: Element; let ruleListElem: Element = target.querySelector('.e-rule-list');
        let args: ActionEventArgs;
        if (type === 'change') {
            ruleElem = select('#' + parentId, target);
        } else {
            ruleElem = this.createElement('div', { attrs: { class: 'e-rule-container' } });
            ruleElem.setAttribute('id', target.id + '_rule' + this.ruleIdCounter);
            ruleListElem.appendChild(ruleElem); this.ruleIdCounter++;
        }
        if (column && column.ruleTemplate) {
            args = { requestType: 'template-initialize', ruleID: ruleElem.id, action: action, fields: this.fields, rule: rule };
            this.trigger('actionBegin', args);
            this.ruleTemplateFn = this.templateParser(column.ruleTemplate);
            let templateID: string = this.element.id + column.field; let template: Element[];
            args.fields = this.fields; args.columns = this.columns;
            args.operators = this.getOperators(rule.field);
            args.operatorFields = { text: 'key', value: 'value' };
            // tslint:disable
            if ((this as any).isReact || (this as any).isAngular) {
                template = this.ruleTemplateFn(args, this, ruleElem.id, templateID);
            } else {
                template = this.ruleTemplateFn(args, this, 'Template', templateID);
            }
            elem = template[0]; elem.className += ' e-rule-field';
        } else {
            elem = this.ruleElem.querySelector('.e-rule-field').cloneNode(true) as Element;
        }
        ruleElem.appendChild(elem);
        if (column && column.ruleTemplate) { this.renderReactTemplates(); }
        return ruleElem;
    }
    private addRuleElement(
        target: Element, rule?: RuleModel, column?: ColumnsModel, action?: string, parentId?: string, isRuleTemplate?: boolean): void {
        if (!target) {
            return;
        }
        let args: ChangeEventArgs = { groupID: target.id.replace(this.element.id + '_', ''), cancel: false, type: 'insertRule' };
        if (!this.isImportRules && !this.isInitialLoad) {
            this.trigger('beforeChange', args, (observedChangeArgs: ChangeEventArgs) => {
                this.addRuleSuccessCallBack(observedChangeArgs, target, rule, column, action, parentId, isRuleTemplate);
            });
        } else {
            this.isInitialLoad = false;
            this.addRuleSuccessCallBack(args, target, rule, column, action, parentId, isRuleTemplate);
        }
    }

    private addRuleSuccessCallBack(
        args: ChangeEventArgs, trgt: Element, rule: RuleModel, col?: ColumnsModel, act?: string, pId?: string, isRlTmp?: boolean): void {
        let height: string = (this.element.className.indexOf('e-device') > -1) ? '250px' : '200px'; let ruleID: string;
        let column: ColumnsModel = (rule && rule.field) ? this.getColumn(rule.field) : col ? col : this.columns[0];
        let operators: { [key: string]: Object }[]; let dropDownList: DropDownList; let ruleElem: Element;
        let newRule: RuleModel = { 'label': '', 'field': '', 'type': '', 'operator': '' };
        if (!args.cancel) {
            if (column && column.ruleTemplate) {
                this.selectedColumn = column; operators = this.selectedColumn.operators;
                newRule = {'label': column.label, 'field': column.field, 'type': column.type, 'operator': operators[0].value as string};
                let passedRule: RuleModel = Object.keys(rule).length ? rule : newRule;
                ruleElem = this.appendRuleElem(trgt, column, act, pId, 'field', passedRule);
                let args: ActionEventArgs = { requestType: 'template-create', action: 'insert-rule', ruleID: ruleElem.id,
                fields: this.fields, rule: passedRule };
                this.trigger('actionBegin', args);

            } else {
                ruleElem = this.appendRuleElem(trgt, column, act, pId, 'field');
                ruleElem.querySelector('.e-filter-input').setAttribute('id', ruleElem.id + '_filterkey');
                let element: Element = ruleElem.querySelector('button');
                if (this.element.className.indexOf('e-device') > -1 || this.displayMode === 'Vertical') {
                    element.textContent = this.l10n.getConstant('Remove');
                    addClass([element], 'e-flat'); addClass([element], 'e-primary');
                } else {
                    addClass([element], 'e-round'); addClass([element], 'e-icon-btn');
                    let tooltip: Tooltip = new Tooltip({ content: this.l10n.getConstant('DeleteRule') });
                    tooltip.appendTo(element as HTMLElement);
                    element = this.createElement('span', { attrs: { class: 'e-btn-icon e-icons e-delete-icon' } });
                    ruleElem.querySelector('button').appendChild(element);
                }
            }
            if (this.displayMode === 'Vertical' || this.element.className.indexOf('e-device') > -1) {
                ruleElem.className = 'e-rule-container e-vertical-mode';
            } else {
                ruleElem.className = 'e-rule-container e-horizontal-mode';
            }
            if (ruleElem.previousElementSibling && ruleElem.previousElementSibling.className.indexOf('e-rule-container') > -1) {
                if (ruleElem.className.indexOf('e-joined-rule') < 0) {
                    ruleElem.className += ' e-joined-rule';
                }
                if (ruleElem.previousElementSibling.className.indexOf('e-prev-joined-rule') < 0) {
                    ruleElem.previousElementSibling.className += ' e-prev-joined-rule';
                }
            }
            if (ruleElem.previousElementSibling && ruleElem.previousElementSibling.className.indexOf('e-group-container') > -1 &&
                ruleElem.className.indexOf('e-separate-rule') < 0) {
                ruleElem.className += ' e-separate-rule';
            }
            if (!this.isImportRules) {
                this.updateAddedRule(trgt, rule, newRule, isRlTmp);
            }
            if (!column || (column && !column.ruleTemplate)) {
                dropDownList = new DropDownList({
                    dataSource: this.columns as { [key: string]: Object }[], // tslint:disable-line
                    fields: this.fields, placeholder: this.l10n.getConstant('SelectField'),
                    popupHeight: ((this.columns.length > 5) ? height : 'auto'),
                    change: this.changeField.bind(this), value: rule ? rule.field : null
                });
                dropDownList.appendTo('#' + ruleElem.id + '_filterkey');
                this.selectedColumn = dropDownList.getDataByValue(dropDownList.value) as ColumnsModel;
                if (Object.keys(rule).length) {
                    this.changeRule(rule, {
                        element: dropDownList.element,
                        itemData: this.selectedColumn as FieldSettingsModel
                    } as DropDownChangeEventArgs);
                }
            }
            ruleID = ruleElem.id.replace(this.element.id + '_', '');
            if (!this.isImportRules) {
                this.trigger('change', { groupID: trgt.id.replace(this.element.id + '_', ''), ruleID: ruleID, type: 'insertRule' });
            }
        }
    }
    private updateAddedRule(target: Element, rule: RuleModel, newRule: RuleModel, isRuleTemplate?: boolean): void {
        let groupElem: Element = closest(target, '.e-group-container');
        let rules: RuleModel = this.getParentGroup(groupElem);
        let ruleElem: Element = closest(target, '.e-rule-container');
        let index: number = 0;
        while (ruleElem && ruleElem.previousElementSibling !== null) {
            ruleElem = ruleElem.previousElementSibling;
            index++;
        }
        if (isRuleTemplate) {
            rules.rules[index] = rule;
        } else {
            if (Object.keys(rule).length) {
                rules.rules.push({
                    'field': rule.field, 'type': rule.type, 'label': rule.label, 'operator': rule.operator, value: rule.value
                });
            } else {
                rules.rules.push(newRule);
            }
        }
        this.disableRuleCondition(target, rules);
    }

    // tslint:disable-next-line:no-any
    private changeRuleTemplate(column: ColumnsModel, element: Element, rule: RuleModel, type: string): void {
        let operVal: { [key: string]: Object }[] = this.selectedColumn.operators;
        if (column.ruleTemplate) {
            return ;
        } else {
            let parentId: string = closest(element, '.e-rule-container').id;
            if (this.previousColumn && this.previousColumn.ruleTemplate ) {
                detach(element.closest('[id="' + parentId + '"]').querySelector('.e-rule-field'));
                this.clearQBTemplate([parentId]);
            }
            if (column) {
                let rule: RuleModel = {field: column.field, label: column.label, operator: operVal[0].value as string, value: ''};
                this.addRuleElement(this.element.querySelector('.e-group-container'), rule, column, 'change', parentId, true);
            }
        }
    }

    private renderToolTip(element: HTMLElement): void {
        let tooltip: Tooltip = new Tooltip({ content: this.l10n.getConstant('ValidationMessage'),
        position: 'BottomCenter', cssClass: 'e-querybuilder-error' });
        tooltip.appendTo(element);
        tooltip.open(element);
    }
    /**
     * Validate the conditions and it display errors for invalid fields.
     * @returns boolean.
     */
    public validateFields(): boolean {
        let isValid: boolean = true;
        if (this.allowValidation) {
            let excludeOprs: string [] = ['isnull', 'isnotnull', 'isempty', 'isnotempty'];
            let i: number; let len: number; let fieldElem: Element; let indexElem: Element; let valArray: string[] | number[] = [];
            let groupElem: Element; let index: number; let dropDownObj: DropDownList; let tempElem: Element; let rule: RuleModel;
            let ruleElemCln: NodeListOf<Element> = this.element.querySelectorAll('.e-rule-container'); let validateRule: Validation;
            for (i = 0, len = ruleElemCln.length; i < len; i++) {
                groupElem = closest(ruleElemCln[i], '.e-group-container');
                rule = this.getParentGroup(groupElem); index = 0; indexElem = tempElem = ruleElemCln[i];
                dropDownObj = getComponent(ruleElemCln[i].querySelector('.e-rule-field input.e-control') as HTMLElement, 'dropdownlist');
                this.selectedColumn = dropDownObj.getDataByValue(dropDownObj.value) as ColumnsModel;
                validateRule = !isNullOrUndefined(dropDownObj.index) && (this.selectedColumn as ColumnsModel).validation;
                fieldElem = tempElem.querySelector('.e-rule-field input.e-control');
                if (validateRule && validateRule.isRequired) {
                    while (indexElem && indexElem.previousElementSibling !== null) {
                        indexElem = indexElem.previousElementSibling;
                        index++;
                    }
                    fieldElem = tempElem.querySelector('.e-rule-field input.e-control');
                    if (!rule.rules[index].field) {
                        if (fieldElem.parentElement.className.indexOf('e-tooltip') < 0) {
                            this.renderToolTip(fieldElem.parentElement);
                        }
                        isValid = false;
                    }
                    fieldElem = tempElem.querySelector('.e-rule-operator input.e-control');
                    if (!rule.rules[index].operator) {
                        if (fieldElem.parentElement.className.indexOf('e-tooltip') < 0) {
                            this.renderToolTip(fieldElem.parentElement);
                        }
                        isValid = false;
                    }
                    if (rule.rules[index].value instanceof Array) {
                        valArray = rule.rules[index].value as string[] | number[];
                    }
                    if (excludeOprs.indexOf(rule.rules[index].operator) < 0 && (isNullOrUndefined(rule.rules[index].value) &&
                    rule.rules[index].type !== 'date') || rule.rules[index].value === '' ||
                    (rule.rules[index].value instanceof Array && valArray.length < 1)) {
                        let valElem: NodeListOf<Element> = tempElem.querySelectorAll('.e-rule-value input.e-control');
                        isValid = false; let j: number = 0;
                        for (let j: number = 0, jLen: number = valElem.length; j < jLen; j++) {
                            let element: Element = valElem[j]; let elem: Element;
                            if (element.parentElement.className.indexOf('e-searcher') > -1) {
                                elem = closest(element, '.e-multi-select-wrapper');
                                if (elem.className.indexOf('e-tooltip') < 0) {
                                    this.renderToolTip(elem as HTMLElement);
                                }
                            } else if (valElem[j].parentElement.className.indexOf('e-tooltip') < 0) {
                                this.renderToolTip(valElem[j].parentElement);
                            }
                            j++;
                        }
                    }
                } else if (dropDownObj.element && isNullOrUndefined(dropDownObj.index)) {
                    if (fieldElem.parentElement.className.indexOf('e-tooltip') < 0) {
                        this.renderToolTip(fieldElem.parentElement);
                    }
                    isValid = false;
                }
            }
        }
        return isValid;
    }
    private refreshLevelColl(): void {
        this.levelColl = {};
        let groupElem: Element = this.element.querySelector('.e-group-container');
        this.levelColl[groupElem.id] = [0];
        let obj: LevelColl = {groupElement: groupElem, level: [0]};
        this.refreshLevel(obj);
    }
    private refreshLevel(obj: LevelColl): LevelColl | void {
        let ruleList: HTMLCollection = obj.groupElement.querySelector('.e-rule-list').children;
        let childElem: Element;
        let groupElem: Element = obj.groupElement;
        let i: number; let iLen: number = ruleList.length;
        let groupCount: number = 0;
        for (i = 0; i < iLen; i++ ) {
            childElem = (ruleList[i] as Element);
            if (childElem.className.indexOf('e-group-container') > -1) {
                obj.level.push(groupCount);
                this.levelColl[childElem.id] = obj.level.slice();
                groupCount++;
                obj.groupElement = childElem;
                obj = this.refreshLevel(obj) as LevelColl;
            }
        }
        let ruleListElem: Element = closest(groupElem, '.e-rule-list');
        obj.groupElement = ruleListElem ? closest(ruleListElem, '.e-group-container') : groupElem;
        obj.level = this.levelColl[obj.groupElement.id].slice();
        return obj;
    }
    private groupTemplate(): Element {
        let groupElem: Element; let grpBodyElem: Element; let groupHdrElem: Element;
        let rulesElem: Element; let glueElem: Element; let inputElem: Element;
        let labelElem: Element; let grpActElem: Element; let groupBtn: HTMLElement;
        groupElem = this.createElement('div', { attrs: { class: 'e-group-container' } });
        groupHdrElem = this.createElement('div', { attrs: { class: 'e-group-header' } });
        grpBodyElem = this.createElement('div', { attrs: { class: 'e-group-body' } });
        rulesElem = this.createElement('div', { attrs: { class: 'e-rule-list' } });
        groupElem.appendChild(groupHdrElem);
        grpBodyElem.appendChild(rulesElem);
        groupElem.appendChild(grpBodyElem);
        // create button group in OR and AND process
        glueElem = this.createElement('div', { attrs: { class: 'e-lib e-btn-group' } });
        if (this.enableNotCondition) {
            inputElem = this.createElement('button', { attrs: { type: 'button', class: 'e-qb-toggle' }});
            glueElem.appendChild(inputElem);
        }
        inputElem = this.createElement('input', { attrs: { type: 'radio', class: 'e-btngroup-and', value: 'AND' } });
        inputElem.setAttribute('checked', 'true');
        glueElem.appendChild(inputElem);
        labelElem = this.createElement('label', { attrs: { class: 'e-lib e-btn e-btngroup-and-lbl e-small' },
        innerHTML: this.l10n.getConstant('AND') });
        glueElem.appendChild(labelElem);
        inputElem = this.createElement('input', { attrs: { type: 'radio', class: 'e-btngroup-or', value: 'OR' } });
        glueElem.appendChild(inputElem);
        labelElem = this.createElement('label', { attrs: { class: 'e-lib e-btn e-btngroup-or-lbl e-small' },
        innerHTML: this.l10n.getConstant('OR') });
        glueElem.appendChild(labelElem);
        groupHdrElem.appendChild(glueElem);
        grpActElem = this.createElement('div', { attrs: { class: 'e-group-action' } });
        groupBtn = this.createElement('button', { attrs: { type: 'button', class: 'e-add-btn' } });
        grpActElem.appendChild(groupBtn);
        groupHdrElem.appendChild(grpActElem);
        return groupElem;
    }

    private ruleTemplate(): Element {
        let ruleElem: Element; let filterElem: Element; let tempElem: Element; let delBtnElem: HTMLElement; let fieldElem: Element;
        let clsName: string;
        ruleElem = this.createElement('div');
        fieldElem = this.createElement('div', { attrs: { class: 'e-rule-field' } });
        tempElem = this.createElement('div', { attrs: { class: 'e-rule-filter' } });
        filterElem = this.createElement('input', { attrs: { type: 'text', class: 'e-filter-input' } });
        tempElem.appendChild(filterElem);
        fieldElem.appendChild(tempElem);
        tempElem = this.createElement('div', { attrs: { class: 'e-rule-operator' } });
        fieldElem.appendChild(tempElem);
        tempElem = this.createElement('div', { attrs: { class: 'e-rule-value' } });
        fieldElem.appendChild(tempElem);
        tempElem = this.createElement('div', { attrs: { class: 'e-rule-value-delete' } });
        if (this.showButtons.ruleDelete) {
            clsName = 'e-removerule e-rule-delete e-css e-btn e-small';
        } else {
            clsName = 'e-removerule e-rule-delete e-css e-btn e-small e-button-hide';
        }
        delBtnElem = this.createElement('button', { attrs: { class: clsName } });
        tempElem.appendChild(delBtnElem);
        fieldElem.appendChild(tempElem);
        ruleElem.appendChild(fieldElem);
        return ruleElem;
    }
    private addGroupElement(isGroup: boolean, target: Element, condition?: string, isBtnClick?: boolean): void {
        let args: ChangeEventArgs = { groupID: target.id.replace(this.element.id + '_', ''), cancel: false, type: 'insertGroup' };
        if (!this.isImportRules && !this.isInitialLoad) {
            this.trigger('beforeChange', args, (observedChangeArgs: ChangeEventArgs) => {
                this.addGroupSuccess(observedChangeArgs, isGroup, target, condition, isBtnClick);
            });
        } else {
            this.isInitialLoad = false;
            this.addGroupSuccess(args, isGroup, target, condition, isBtnClick);
        }
    }

    private addGroupSuccess(args: ChangeEventArgs, isGroup : boolean, eventTarget: Element, condition: string, isBtnClick: boolean): void {
        if (!args.cancel && (this.element.querySelectorAll('.e-group-container').length <= this.maxGroupCount)) {
            let target: Element = eventTarget; let dltGroupBtn: HTMLElement;
            let groupElem: Element = this.groupElem.cloneNode(true) as Element;
            groupElem.setAttribute('id', this.element.id + '_group' + this.groupIdCounter);
            this.groupIdCounter++;
            let andInpElem: Element = groupElem.querySelector('.e-btngroup-and');
            let orInpElem: Element = groupElem.querySelector('.e-btngroup-or');
            let andLblElem: Element = groupElem.querySelector('.e-btngroup-and-lbl');
            let orLblElem: Element = groupElem.querySelector('.e-btngroup-or-lbl');
            let notElem: HTMLElement = groupElem.querySelector('.e-qb-toggle');
            andInpElem.setAttribute('id', this.element.id + '_and' + this.btnGroupId);
            orInpElem.setAttribute('id', this.element.id + '_or' + this.btnGroupId);
            andInpElem.setAttribute('name', this.element.id + '_and' + this.btnGroupId);
            orInpElem.setAttribute('name', this.element.id + '_and' + this.btnGroupId);
            andLblElem.setAttribute('for', this.element.id + '_and' + this.btnGroupId);
            orLblElem.setAttribute('for', this.element.id + '_or' + this.btnGroupId);
            this.btnGroupId++;
            if (isGroup) {
                let clsName: string = this.showButtons.groupDelete ? 'e-deletegroup' : 'e-deletegroup e-button-hide';
                dltGroupBtn = this.createElement('button', { attrs: { class: clsName } });
                let button: Button = new Button({ iconCss: 'e-icons e-delete-icon', cssClass: 'e-small e-round' });
                button.appendTo(dltGroupBtn);
                let tooltip: Tooltip = new Tooltip({ content: this.l10n.getConstant('DeleteGroup') });
                tooltip.appendTo(dltGroupBtn as HTMLElement);
                rippleEffect(dltGroupBtn, { selector: '.deletegroup' });
                groupElem.querySelector('.e-group-action').appendChild(dltGroupBtn);
                let ruleList: Element = target.querySelector('.e-rule-list');
                let childElems: HTMLCollection = ruleList.children;
                let grpLen: number = 0;
                for (let j: number = 0, jLen: number = childElems.length; j < jLen; j++) {
                    if (childElems[j].className.indexOf('e-group-container') > -1) {
                        grpLen += 1;
                    }
                }
                ruleList.appendChild(groupElem); let level: number[] = this.levelColl[target.id].slice(0);
                level.push(grpLen); this.levelColl[groupElem.id] = level;
                if (!this.isImportRules) {
                    this.addGroups([], target.id.replace(this.element.id + '_', ''));
                    if (isBtnClick) {
                        this.addRuleElement(groupElem, {});
                    }
                }
            } else {
                target.appendChild(groupElem); this.levelColl[groupElem.id] = [0];
            }
            if (this.enableNotCondition) {
                let tglBtn: Button = new Button({ content: this.l10n.getConstant('NOT'), cssClass: 'e-btn e-small' });
                tglBtn.appendTo(notElem);
                groupElem.querySelector('.e-btngroup-and-lbl').classList.add('e-not');
                if (this.updatedRule && this.updatedRule.not) {
                    addClass([notElem], 'e-active-toggle');
                }
            }
            this.updatedRule = null;
            let groupBtn: HTMLElement = groupElem.querySelector('.e-add-btn') as HTMLElement;
            let btnObj: DropDownButton = new DropDownButton({
                items: this.items,
                cssClass: 'e-round e-small e-caret-hide e-addrulegroup',
                iconCss: 'e-icons e-add-icon',
                beforeOpen: this.selectBtn.bind(this, groupBtn),
                select: this.selectBtn.bind(this, groupBtn)
            });
            btnObj.appendTo(groupBtn);
            if (!this.isImportRules) {
                let grpId: string = target.id.replace(this.element.id + '_', '');
                let chgrpId: string = groupElem.id.replace(this.element.id + '_', '');
                this.trigger('change', { groupID: grpId, type: 'insertGroup', childGroupID: chgrpId });
            }
        }
    }
    /**
     * notify the changes to component.
     * @returns void.
     */
    public notifyChange(value: string | number | boolean | Date | string[] | number[] | Date[], element: Element, type?: string): void {
        let grpElement: Element = closest(element, '.e-group-container');
        let rules: RuleModel = this.getParentGroup(grpElement);
        let ruleElement: Element = closest(element, '.e-rule-container'); let index: number = 0;
        while (ruleElement && ruleElement.previousElementSibling !== null) {
            ruleElement = ruleElement.previousElementSibling;
            index++;
        }
        let rule: RuleModel = rules.rules[index]; let column: ColumnsModel = this.getColumn(rule.field);
        let format: DateFormatOptions = this.getFormat(column.format);
        if (column.type === 'date') {
            if (value instanceof Date) {
                value = this.intl.formatDate(value as Date , format) as string;
            } else if (value instanceof Array) {
                for (let i: number = 0; i < value.length; i++) {
                    if (value[i] && value[i] instanceof Date) {
                        value[i] = this.intl.formatDate(value[i] as Date, format) as string;
                    }
                }
            }
        }
        if (column.ruleTemplate) {
            this.templateChange(element, value as string | number | boolean | string[] | number[], type);
        } else {
            let tempColl: NodeListOf<Element> = closest(element, '.e-rule-value').querySelectorAll('.e-template');
            let filterElem: HTMLElement = closest(element, '.e-rule-container').querySelector('.e-filter-input');
            let dropDownObj: DropDownList = getComponent(filterElem, 'dropdownlist') as DropDownList;
            column = dropDownObj.getDataByValue(dropDownObj.value) as ColumnsModel;
            let valueColl: string[] = [];
            for (let i: number = 0, iLen: number = tempColl.length; i < iLen; i++) {
                if (tempColl.length > 1 && column.type === 'date' && value[i] && value[i] instanceof Date) {
                    valueColl.push(this.intl.formatDate(value[i], format));
                } else {
                    valueColl = value as string[];
                }
            }
            this.updateRules(element, (tempColl.length > 1) ? valueColl : value);
        }
    }

    // tslint:disable-next-line:no-any
    private templateChange(
        element: Element, value: string | number | boolean | string[] | number[], type?: string): void {
        let grpElem: Element = closest(element, '.e-group-container');
        let rules: RuleModel = this.getParentGroup(grpElem);
        let ruleElem: Element = closest(element, '.e-rule-container'); let index: number = 0;
        while (ruleElem && ruleElem.previousElementSibling !== null) {
            ruleElem = ruleElem.previousElementSibling;
            index++;
        }
        let rule: RuleModel = rules.rules[index];
        if (type === 'field') {
            this.selectedColumn = this.getColumn(value as string);
        } else if (rule) {
            this.selectedColumn = this.getColumn(rule.field);
        }
        let operVal: { [key: string]: Object }[];
        this.previousColumn = this.getColumn(rule.field); let beforeRules: RuleModel = this.getValidRules(this.rule);
        if (this.selectedColumn) {
            if (this.selectedColumn.operators) {
                operVal = this.selectedColumn.operators;
            } else {
                operVal = this.customOperators[this.selectedColumn.type + 'Operator'];
            }
        }
        let arrOper: string[] = ['in', 'notin', 'between', 'notbetween']; let prevOper: string;
        switch (type) {
            case 'field':
                rule.field = value as string; rule.label = this.selectedColumn.label;
                rule.type = this.selectedColumn.type; rule.value = '';
                rule.operator = operVal[0].value as string;
                break;
            case 'operator':
                prevOper = rule.operator; rule.operator = value as string;
                if (arrOper.indexOf(rule.operator) > -1) {
                    rule.value = [];
                } else if (arrOper.indexOf(prevOper) > -1) {
                    rule.value = '';
                }
                break;
            case 'value':
                rule.value = value;
        }
        this.changeRuleTemplate(this.selectedColumn, element, rule, type);
        this.filterRules(beforeRules, this.getValidRules(this.rule), type);
        if (this.selectedColumn && this.selectedColumn.ruleTemplate) {
            if (type === 'field' || type === 'operator') {
                let grpEle: Element = closest(element, '.e-rule-container');
                this.destroyControls(grpEle, true);
                detach(grpEle.querySelector('.e-rule-field'));
                let ruleElement: Element = this.appendRuleElem(
                    closest(grpEle, '.e-group-container'), this.selectedColumn, 'change', grpEle.id, type, rule);
                if (this.displayMode === 'Vertical' || this.element.className.indexOf('e-device') > -1) {
                    ruleElement.className = 'e-rule-container e-vertical-mode';
                } else {
                    ruleElement.className = 'e-rule-container e-horizontal-mode';
                }
                if (ruleElement.previousElementSibling && ruleElement.previousElementSibling.className.indexOf('e-rule-container') > -1) {
                    if (ruleElement.className.indexOf('e-joined-rule') < 0) {
                        ruleElement.className += ' e-joined-rule';
                    }
                    if (ruleElement.previousElementSibling.className.indexOf('e-prev-joined-rule') < 0) {
                        ruleElement.previousElementSibling.className += ' e-prev-joined-rule';
                    }
                }
                if (ruleElement.previousElementSibling && ruleElement.previousElementSibling.className.indexOf('e-group-container') > -1 &&
                    ruleElement.className.indexOf('e-separate-rule') < 0) {
                        ruleElement.className += ' e-separate-rule';
                }
                let args: ActionEventArgs = { requestType: 'template-create', action: type, ruleID: grpEle.id,
                fields: this.fields, rule: rule };
                this.trigger('actionBegin', args);
            }
        }
    }
    private changeValue(i: number, args: ButtonChangeEventArgs | InputEventArgs | InputChangeEventArgs | CalendarChangeEventArgs): void {
        let groupID: string; let ruleID: string;
        let element: Element;
        if (args.event) {
            element = args.event.target as Element;
        } else {
            let multiSelectArgs: MultiSelectChangeEventArgs = args as MultiSelectChangeEventArgs;
            element = multiSelectArgs.element as Element;
        }
        if (element.className.indexOf('e-day') > -1 || element.className.indexOf('e-cell') > -1) {
            let calenderArgs: CalendarChangeEventArgs = args as CalendarChangeEventArgs;
            element = calenderArgs.element;
        }
        let groupElem: Element = closest(element, '.e-group-container');
        let ruleElem: Element = closest(element, '.e-rule-container');
        groupID = groupElem && groupElem.id.replace(this.element.id + '_', '');
        ruleID = ruleElem.id.replace(this.element.id + '_', '');
        let dateElement: CalendarChangeEventArgs = args as CalendarChangeEventArgs;
        if (dateElement.element && dateElement.element.className.indexOf('e-datepicker') > -1) {
            element = dateElement.element;
        }
        let value: string | number | Date | boolean | string[];
        let rbValue: number; let dropDownObj: DropDownList;
        if (element.className.indexOf('e-radio') > -1) {
            rbValue = parseInt(element.id.split('valuekey')[1], 0);
            dropDownObj =
            getComponent(closest(element, '.e-rule-container').querySelector('.e-filter-input') as HTMLElement, 'dropdownlist');
            this.selectedColumn =  dropDownObj.getDataByValue(dropDownObj.value) as ColumnsModel;
            if (this.selectedColumn.values) {
                value = this.selectedColumn.values[rbValue];
            } else {
                let valColl: boolean[] = [true, false];
                value = valColl[rbValue];
            }
        } else if (element.className.indexOf('e-multiselect') > -1) {
            value = (getComponent(element as HTMLElement, 'multiselect') as MultiSelect).value as string[];
        } else {
            value = (<InputEventArgs | InputChangeEventArgs | CalendarChangeEventArgs>args).value;
        }
        if ((args as InputChangeEventArgs).name === 'input' && this.immediateModeDelay) {
            window.clearInterval(this.timer);
            this.timer = window.setInterval(
                () => { this.filterValue(groupID, ruleID, value, i, element); }, this.immediateModeDelay );
        } else {
            this.filterValue(groupID, ruleID, value, i, element);
        }
    }

    private filterValue(grID: string, rlID: string, value: string | number | Date | boolean | string[], i: number, ele: Element): void {
        let eventsArgs: ChangeEventArgs = { groupID: grID, ruleID: rlID, value: value, cancel: false, type: 'value' };
        window.clearInterval(this.timer);
        if (!this.isImportRules) {
            this.trigger('beforeChange', eventsArgs, (observedChangeArgs: ChangeEventArgs) => {
                this.changeValueSuccessCallBack(observedChangeArgs, ele, i, grID, rlID);
            });
        } else {
            this.changeValueSuccessCallBack(eventsArgs, ele, i, grID, rlID);
        }
    }

    private changeValueSuccessCallBack(args: ChangeEventArgs, element: Element, i: number, groupID: string, ruleID: string): void {
        if (!args.cancel) {
            this.updateRules(element, args.value, i);
            if (!this.isImportRules) {
                this.trigger('change', { groupID: groupID, ruleID: ruleID, value: args.value, cancel: false, type: 'value' });
            }
        }
    }

    private changeField(args: DropDownChangeEventArgs): void {
        if (args.isInteracted) {
            let column: ColumnsModel = this.getColumn(args.value as string);
            if (column && column.ruleTemplate) {
                this.templateChange(args.element, column.field as string, 'field');
            } else {
                let groupElem: Element = closest(args.element, '.e-group-container');
                let rules: RuleModel = this.getParentGroup(groupElem);
                let ruleElem: Element = closest(args.element, '.e-rule-container');
                let index: number = 0;
                while (ruleElem && ruleElem.previousElementSibling !== null) {
                    ruleElem = ruleElem.previousElementSibling;
                    index++;
                }
                this.changeRule(rules.rules[index], args);
            }
        }
    }

    private changeRule(rule: RuleModel, ddlArgs: DropDownChangeEventArgs): void {
        if (!ddlArgs.itemData) {
            return;
        }
        let tempRule: RuleModel = {}; let filterElem: Element = closest(ddlArgs.element, '.e-rule-filter');
        let ddlObj: DropDownList = getComponent(ddlArgs.element, 'dropdownlist') as DropDownList;
        let element: Element = closest(ddlArgs.element, '.e-group-container');
        let groupID: string = element.id.replace(this.element.id + '_', '');
        this.changeFilter(filterElem, ddlObj, groupID, rule, tempRule, ddlArgs);
    }
    private changeFilter(
        flt: Element, dl: DropDownList, grID: string, rl: RuleModel, tmpRl: RuleModel, dArg: DropDownChangeEventArgs): void {
        if (flt) {
            this.selectedColumn = dl.getDataByValue(dl.value) as ColumnsModel;
            let ruleElem: Element = closest(flt, '.e-rule-container'); let eventsArgs: ChangeEventArgs;
            let ruleID: string = ruleElem.id.replace(this.element.id + '_', '');
            eventsArgs = { groupID: grID, ruleID: ruleID, selectedField: dl.value as string, cancel: false, type: 'field' };
            if (!this.isImportRules) {
                this.trigger('beforeChange', eventsArgs, (observedChangeArgs: ChangeEventArgs) => {
                    this.fieldChangeSuccess(observedChangeArgs, tmpRl, flt, rl, dArg);
                });
            } else {
                this.fieldChangeSuccess(eventsArgs, tmpRl, flt, rl, dArg);
            }
        } else {
            let operatorElem: Element = closest(dArg.element, '.e-rule-operator');
            this.changeOperator(flt, operatorElem, dl, grID, rl, tmpRl, dArg);
        }
    }
    private changeOperator(
        flt: Element, opr: Element, dl: DropDownList, grID: string, rl: RuleModel, tmpRl: RuleModel, dArg: DropDownChangeEventArgs): void {
        let ruleElem: Element; let ruleID: string; let eventsArgs: ChangeEventArgs;
        if (opr) {
            ruleElem = closest(opr, '.e-rule-container'); ruleID = ruleElem.id.replace(this.element.id + '_', '');
            eventsArgs = { groupID: grID, ruleID: ruleID, selectedIndex: dl.index, cancel: false, type: 'operator' };
            if (!this.isImportRules) {
                this.trigger('beforeChange', eventsArgs, (observedChangeArgs: ChangeEventArgs) => {
                    this.operatorChangeSuccess(observedChangeArgs, flt, tmpRl, rl, dArg);
                });
            } else {
                this.operatorChangeSuccess(eventsArgs, flt, tmpRl, rl, dArg);
            }
        } else {
            this.changeRuleValues(flt, rl, tmpRl, dArg);
        }
    }
    private fieldChangeSuccess(
        args: ChangeEventArgs, tempRule: RuleModel, filterElem: Element, rule: RuleModel, ddlArgs: DropDownChangeEventArgs): void {
        let ruleElem: Element = closest(filterElem, '.e-rule-container');
        let operatorElem: Element = closest(ddlArgs.element, '.e-rule-operator');
        let element: Element = closest(ddlArgs.element, '.e-group-container');
        let groupID: string = element.id.replace(this.element.id + '_', '');
        let ddlObj: DropDownList = getComponent(ddlArgs.element, 'dropdownlist') as DropDownList;
        let tooltipElem: NodeListOf<Element> = ruleElem.querySelectorAll('.e-tooltip.e-input-group');
        for (let i: number = 0; i < tooltipElem.length; i++) {
            (getComponent(tooltipElem[i] as HTMLElement, 'tooltip') as Tooltip).destroy();
        }
        if (!args.cancel) {
            tempRule.type = this.selectedColumn.type;
            if (ruleElem.querySelector('.e-template')) {
                rule.value = '';
            }
            this.changeOperator(filterElem, operatorElem, ddlObj, groupID, rule, tempRule, ddlArgs);
        } else {
             this.changeOperator(filterElem, operatorElem, ddlObj, groupID, rule, tempRule, ddlArgs);
        }
    }

    private operatorChangeSuccess(
        eventsArgs: ChangeEventArgs, filterElem: Element, tempRule: RuleModel, rule: RuleModel, ddlArgs: DropDownChangeEventArgs): void {
        if (!eventsArgs.cancel) {
            let operatorElem: Element = closest(ddlArgs.element, '.e-rule-operator');
            let valElem: Element = operatorElem.nextElementSibling;
            let dropDownObj: DropDownList = getComponent(ddlArgs.element, 'dropdownlist') as DropDownList;
            let prevOper: string = rule.operator ? rule.operator.toString().toLowerCase() : '';
            tempRule.operator = dropDownObj.value.toString();
            let currOper: string = tempRule.operator.toLowerCase();
            if (tempRule.operator.toLowerCase().indexOf('between') > -1 || (tempRule.operator.toLowerCase().indexOf('in') > -1
                && tempRule.operator.toLowerCase().indexOf('contains') < 0)) {
                filterElem = operatorElem.previousElementSibling;
                tempRule.type = rule.type;
                if (tempRule.operator.toLowerCase().indexOf('in') < 0 || prevOper.indexOf('in') < 0) {
                    rule.value = [];
                }
            } else if (typeof rule.value === 'object' && rule.value != null) {
                rule.value = rule.value.length > 0 ? rule.value[0] : '';
            }
            if (ddlArgs.previousItemData) {
                let prevValue: string = ddlArgs.previousItemData.value.toString().toLowerCase();
                if ((prevValue.indexOf('between') > -1 || (prevValue.indexOf('in') > -1 || (prevValue.indexOf('null') > -1)
                || (prevValue.indexOf('empty') > -1)) && prevValue.indexOf('contains') < 0)) {
                    filterElem = operatorElem.previousElementSibling; tempRule.type = rule.type;
                }
            }
            if ((prevOper.indexOf('in') > -1 && prevOper.indexOf('in') < 5) && (currOper.indexOf('in') > -1
                && currOper.indexOf('in') < 5)) {
                filterElem = null;
            }
            if (tempRule.operator.indexOf('null') > -1 || (tempRule.operator.indexOf('empty') > -1 )) {
                let parentElem: HTMLElement = operatorElem.parentElement.querySelector('.e-rule-value') as HTMLElement;
                let tooltipElem: HTMLElement = parentElem.querySelector('.e-tooltip.e-input-group');
                if (tooltipElem) {
                    (getComponent( tooltipElem, 'tooltip') as Tooltip).destroy();
                }
                removeClass([parentElem], 'e-show'); addClass([parentElem], 'e-hide');
            }
            if (valElem && valElem.querySelector('.e-template')) {
                filterElem = operatorElem.previousElementSibling;
            }
            this.changeRuleValues(filterElem, rule, tempRule, ddlArgs);
        }
    }

    private changeRuleValues(filterElem: Element, rule: RuleModel, tempRule: RuleModel, ddlArgs: DropDownChangeEventArgs): void {
        let operatorElem: Element = closest(ddlArgs.element, '.e-rule-operator');
        let ddlObj: DropDownList; let operatorList: { [key: string]: Object }[]; let oprElem: Element;
        if (filterElem) {
            operatorElem = filterElem.nextElementSibling;
            addClass([operatorElem], 'e-operator');
            if (operatorElem.childElementCount) {
                ddlObj = getComponent(operatorElem.querySelector('.e-dropdownlist') as HTMLElement, 'dropdownlist') as DropDownList;
                tempRule.operator = ddlObj.value as string;
                let itemData: ColumnsModel = ddlArgs.itemData as ColumnsModel;
                this.renderValues(
                    operatorElem, itemData, ddlArgs.previousItemData as ColumnsModel, true, rule, tempRule, ddlArgs.element);
            } else {
                let ruleId: string = closest(operatorElem, '.e-rule-container').id;
                oprElem = this.createElement('input', { attrs: { type: 'text', id: ruleId + '_operatorkey' } });
                operatorElem.appendChild(oprElem);
                if (this.selectedColumn.operators) {
                    operatorList = this.selectedColumn.operators;
                } else if (ddlArgs.itemData) {
                    operatorList = this.customOperators[this.selectedColumn.type + 'Operator'];
                }
                let height: string = (this.element.className.indexOf('e-device') > -1) ? '250px' : '200px';
                let value: string = operatorList[0].value as string;
                value = rule ? (rule.operator !== '' ? rule.operator : value) : value;
                let dropDownList: DropDownList = new DropDownList({
                    dataSource: operatorList,
                    fields: { text: 'key', value: 'value' },
                    placeholder: this.l10n.getConstant('SelectOperator'),
                    popupHeight: ((operatorList.length > 5) ? height : 'auto'),
                    change: this.changeField.bind(this),
                    index: 0,
                    value: value
                });
                dropDownList.appendTo('#' + ruleId + '_operatorkey');
                tempRule.operator = (rule && rule.operator !== '') ? rule.operator : operatorList[0].value as string;
                if (this.isImportRules) {
                    tempRule.type = this.selectedColumn.type;
                    tempRule.operator = rule.operator;
                }
                this.renderValues(
                    operatorElem, this.selectedColumn, ddlArgs.previousItemData as ColumnsModel,
                    false, rule, tempRule, ddlArgs.element);
            }
        }
        if (!this.isImportRules) {
            this.updateRules(ddlArgs.element, ddlArgs.item);
        }
    }

    // tslint:disable-next-line:no-any
    private destroyControls(target: Element, isRuleTemplate?: boolean): void {
        let element: Element = isRuleTemplate ? target : target.nextElementSibling;
        let inputElement: NodeListOf<HTMLElement>;
        inputElement = element.querySelectorAll('input.e-control') as NodeListOf<HTMLElement>;
        let divElement: NodeListOf<HTMLElement>;
        divElement = element.querySelectorAll('div.e-control:not(.e-handle)');
        let columns: ColumnsModel[] = this.columns;
        for (let i: number = 0, len: number = inputElement.length; i < len; i++) {
            if (inputElement[i].classList.contains('e-textbox')) {
                (getComponent(inputElement[i], 'textbox') as TextBox).destroy();
                detach(select('input#' + inputElement[i].id, element));
            } else if (inputElement[i].classList.contains('e-dropdownlist')) {
                if (this.allowValidation && inputElement[i].parentElement.className.indexOf('e-tooltip') > -1) {
                    (getComponent(inputElement[i].parentElement, 'tooltip') as Tooltip).destroy();
                }
                (getComponent(inputElement[i], 'dropdownlist') as DropDownList).destroy();
            } else if (inputElement[i].classList.contains('e-radio')) {
                (getComponent(inputElement[i], 'radio') as RadioButton).destroy();
            } else if (inputElement[i].classList.contains('e-numerictextbox')) {
                (getComponent(inputElement[i], 'numerictextbox') as NumericTextBox).destroy();
                detach(select('input#' + inputElement[i].id, element));
            } else if (inputElement[i].classList.contains('e-datepicker')) {
                (getComponent(inputElement[i], 'datepicker') as DatePicker).destroy();
            } else if (inputElement[i].classList.contains('e-multiselect')) {
                (getComponent(inputElement[i], 'multiselect') as MultiSelect).destroy();
            } else if (inputElement[i].className.indexOf('e-template') > -1) {
                let clsName: string = inputElement[i].className;
                for (let j: number = 0, jLen: number = columns.length; j < jLen; j++) {
                    if (columns[j].template && clsName.indexOf(columns[j].field) > -1) {
                        this.templateDestroy(columns[j], inputElement[i].id);
                        break;
                    }
                }
            }
            if (document.getElementById(inputElement[i].id)) {
                detach(inputElement[i]);
            }
        }
        for (let i: number = 0, len: number = divElement.length; i < len; i++) {
            if (divElement[i].className.indexOf('e-template') > -1) {
                let clsName: string = divElement[i].className;
                for (let j: number = 0, jLen: number = columns.length; j < jLen; j++) {
                    if (columns[j].template && clsName.indexOf(columns[j].field) > -1) {
                        this.templateDestroy(columns[j], divElement[i].id);
                        break;
                    }
                }
            }
            detach(divElement[i]);
        }
        let templateElement: NodeListOf<HTMLElement>;
        templateElement = element.querySelectorAll('.e-template:not(.e-control)') as NodeListOf<HTMLElement>;
        for (let i: number = 0, len: number = templateElement.length; i < len; i++) {
            detach(templateElement[i]);
        }
    }
    private templateDestroy(column: ColumnsModel, elemId: string): void {
        let template: TemplateColumn;
        if (typeof column.template !== 'string' || (column.template as TemplateColumn).destroy === undefined) {
            template = column.template as TemplateColumn;
        } else {
            return;
        }
        let temp: Function = template.destroy as Function;
        if (template.destroy) {
            let templateElements: NodeListOf<Element>;
            if (document.getElementById(elemId)) {
                templateElements = closest(document.getElementById(elemId), '.e-rule-field').querySelectorAll('.e-template');
            }
            if (typeof temp === 'string') {
                temp = getValue(temp, window);
                temp({ field: column.field, elementId: elemId, elements: templateElements });
            } else {
                (template.destroy as Function)({ field: column.field, elementId: elemId, elements: templateElements });
            }
        }
    }
    /**
     * return values bound to the column.
     * @returns object[].
     */
    public getValues(field: string): object[] {
        let original: object = {}; let result: object[] = []; let value: string; let fieldColl: string[] = [];
        if (this.separator.length > 0) {
            fieldColl = field.split(this.separator);
        }
        let dataSource: object[] = this.dataColl;
        if (this.dataColl[1]) {
            for (let i: number = 0, iLen: number = dataSource.length; i < iLen; i++) {
                let data: object = {};
                if (fieldColl.length > 1) {
                    let dataObj: object = dataSource[i]; let fieldStr: string;
                    for (let j: number = 0, jLen: number = fieldColl.length; j < jLen; j++) {
                        fieldStr = fieldColl[j];
                        if (fieldColl.length === (j + 1)) {
                            value = dataObj[fieldStr];
                            if (Number(dataObj[fieldStr]) === dataObj[fieldStr] && dataObj[fieldStr] % 1 !== 0) {
                                value = dataObj[fieldStr].toString();
                            }
                        } else {
                            dataObj = dataObj[fieldStr];
                        }
                    }
                } else {
                    value = dataSource[i][field];
                    if (Number(dataSource[i][field]) === dataSource[i][field] && dataSource[i][field] % 1 !== 0) {
                        value = dataSource[i][field].toString();
                    }
                }
                if (!(value in original)) {
                    original[value] = 1;
                    if (fieldColl.length > 1) {
                       this.createNestedObject(data, fieldColl, value);
                    } else {
                        data[field] = value;
                    }
                    result.push(data);
                }
            }
        }
        return result;
    }

    private createNestedObject(obj: object, fieldColl: string[], value: string | number): void {
        let key: string; let lastIndex: number = fieldColl.length - 1;
        for (let k: number = 0; k < lastIndex; ++ k) {
            key = fieldColl[k];
            if (!(key in obj)) {
                obj[key] = {};
            }
            obj = obj[key];
        }
        obj[fieldColl[lastIndex]] = value;
    }

    private getDistinctValues(dataSource: object[], field: string): object[] {
        let original: object = {};
        let result: object[] = [];
        for (let i: number = 0, iLen: number = dataSource.length; i < iLen; i++) {
            let value: string = dataSource[i][field];
            if (Number(dataSource[i][field]) === dataSource[i][field] && dataSource[i][field] % 1 !== 0) {
                value = dataSource[i][field].toString();
            }
            let data: object = {};
            if (!(value in original)) {
                original[value] = 1;
                data[field] = value;
                result.push(data);
            }
        }
        return result;
    }
    private renderMultiSelect(rule: ColumnsModel, parentId: string, i: number, selectedValue: string[] | number[], values:
        string[] | number[] | boolean[]): void {
        let isFetched: boolean = false; let ds: object[]; let isValues: boolean = false;
        if (this.dataColl[1]) {
            if (Object.keys(this.dataColl[1]).indexOf(rule.field) > -1) {
                isFetched = true;
                ds = this.getDistinctValues(this.dataColl, rule.field);
            }
        }
        if (!this.dataColl.length && values.length) {
            isValues = true;
        }
        let multiSelectObj: MultiSelect = new MultiSelect({
            dataSource: isValues ? values : (isFetched ? ds as { [key: string]: object }[] : this.dataManager),
            query: new Query([rule.field]),
            fields: { text: rule.field, value: rule.field },
            placeholder: this.l10n.getConstant('SelectValue'),
            value: selectedValue,
            mode: 'CheckBox',
            width: '100%',
            change: this.changeValue.bind(this, i),
            close: this.closePopup.bind(this, i),
            actionBegin: this.multiSelectOpen.bind(this, parentId + '_valuekey' + i)
        });
        multiSelectObj.appendTo('#' + parentId + '_valuekey' + i);
        this.updateRules(multiSelectObj.element, selectedValue, 0);
    }
    private multiSelectOpen(parentId: string, args: PopupEventArgs): void {
        if (this.dataSource instanceof DataManager) {
            let element: Element = document.getElementById(parentId);
            let dropDownObj: DropDownList =
            getComponent(closest(element, '.e-rule-container').querySelector('.e-filter-input') as HTMLElement, 'dropdownlist');
            this.selectedColumn =  dropDownObj.getDataByValue(dropDownObj.value) as ColumnsModel;
            let value: string = this.selectedColumn.field; let isFetched: boolean = false;
            if (this.dataColl[1]) {
                if (Object.keys(this.dataColl[1]).indexOf(value) > -1) {
                    isFetched = true;
                }
            }
            if (!isFetched) {
                args.cancel = true;
                if (isBlazor()) {
                    this.bindBlazorMultiSelectData(element, value);
                } else {
                    this.bindMultiSelectData(element, value);
                }
            }
        }
    }
    private async bindBlazorMultiSelectData(element: Element, value: string): Promise<void> {
        await this.getMultiSelectData(element, value);
        return;
    }
    private bindMultiSelectData(element: Element, value: string): void {
        this.getMultiSelectData(element, value);
    }
    private getMultiSelectData(element: Element, value: string): void {
        let dummyData: Object[]; let deferred: Deferred = new Deferred();
        let data: Promise<Object> = this.dataManager.executeQuery(new Query().select(value)) as Promise<Object>;
        let multiselectObj: MultiSelect = (getComponent(element as HTMLElement, 'multiselect') as MultiSelect);
        multiselectObj.hideSpinner();
        this.createSpinner(closest(element, '.e-multi-select-wrapper').parentElement);
        showSpinner(closest(element, '.e-multi-select-wrapper').parentElement as HTMLElement);
        data.then((e: {actual: {result: Object[], count: number}, result: Object[]}) => {
            if (e.actual && e.actual.result) {
                dummyData = e.actual.result;
            } else {
                dummyData = e.result;
            }
            this.dataColl = extend(this.dataColl, dummyData, [], true) as object [];
            multiselectObj.dataSource = this.getDistinctValues(this.dataColl, value) as {[key: string]: object}[];
            hideSpinner(closest(element, '.e-multi-select-wrapper').parentElement as HTMLElement);
        }).catch((e: ReturnType) => {
            deferred.reject(e);
        });
    }
    private createSpinner(element: Element): void {
        let spinnerElem: HTMLElement = this.createElement('span', { attrs: { class: 'e-qb-spinner' } });
        element.appendChild(spinnerElem);
        createSpinner({target: spinnerElem, width: Browser.isDevice ? '16px' : '14px' });
    }
    private closePopup(i: number, args: PopupEventArgs): void {
        let element: Element = document.getElementById(args.popup.element.id.replace('_popup', ''));
        let value: string[] = (getComponent(element as HTMLElement, 'multiselect') as MultiSelect).value as string[];
        this.updateRules(element, value, i);
    }
    private processTemplate(target: Element, itemData: ColumnsModel, rule: RuleModel, tempRule: RuleModel): void {
        let container: Element = closest(target, '.e-rule-container'); let ddlObj: DropDownList;
        let tempElements: NodeListOf<Element> = container.querySelectorAll('.e-template');
        ddlObj = (getComponent(container.querySelector('.e-rule-filter .e-filter-input') as HTMLElement, 'dropdownlist') as DropDownList);
        let column: ColumnsModel = this.getColumn(ddlObj.value as string);
        if (typeof itemData.template === 'string' || (itemData.template as TemplateColumn).write === undefined) {
            let args: ActionEventArgs = { rule: rule, ruleID: container.id, operator: tempRule.operator, field: column.field,
            requestType: 'value-template-create' };
            this.trigger('actionBegin', args);
        } else {
            let template: TemplateColumn = itemData.template as TemplateColumn;
            if (typeof template.write === 'string') {
                getValue(template.write, window)({ elements: tempElements.length > 1 ? tempElements : tempElements[0], values: rule.value,
                    operator: tempRule.operator, field: column.field, dataSource: column.values });
            } else {
                (itemData.template.write as Function)({ elements: tempElements.length > 1 ? tempElements : tempElements[0],
                    values: rule.value, operator: tempRule.operator, field: column.field, dataSource: column.values });
            }
        }
    }
    private getItemData(parentId: string): ColumnsModel {
        let fieldObj: DropDownList = getComponent(document.getElementById(parentId + '_filterkey'), 'dropdownlist') as DropDownList;
        return this.getColumn(fieldObj.value as string);
    }
     private setDefaultValue(parentId?: string, isArryValue?: boolean, isNumber?: boolean):
     string[] | number[] | string | number | boolean | Date {
        let itemData: ColumnsModel = this.getItemData(parentId);
        if (isNullOrUndefined(itemData.value)) {
            return isNumber ? isArryValue ? [0, 0] : 0 : isArryValue ? [] : '';
        }
        if (isArryValue) {
           if (!(itemData.value instanceof Array)) {
                 return [itemData.value] as string[] | number[];
           }
        } else {
            if (itemData.value instanceof Array) {
                return itemData.value[0];
          }
        }
       // this.updateRules(ruleValElem, itemData.defaultValue, idx);
        return itemData.value;
     }
    private renderStringValue(parentId: string, rule: RuleModel, operator: string, idx: number, ruleValElem: HTMLElement): void {
        let selectedVal: string[]; let columnData: ColumnsModel = this.getItemData(parentId); let selectedValue: string;
        if (this.isImportRules || this.isPublic) {
            selectedValue = rule.value as string;
        } else {
            selectedValue = this.setDefaultValue(parentId, false, false) as string;
        }
        if ((operator === 'in' || operator === 'notin') && (this.dataColl.length || columnData.values )) {
            selectedVal = this.isImportRules ? rule.value as string[] : this.setDefaultValue(parentId, true, false) as string[];
            this.renderMultiSelect(columnData, parentId, idx, selectedVal, columnData.values);
            if (this.displayMode === 'Vertical' || this.element.className.indexOf('e-device') > -1) {
                ruleValElem.style.width = '100%';
            } else {
                ruleValElem.style.width = null;
                ruleValElem.style.minWidth = '200px';
            }
        } else {
            if (operator === 'in' || operator === 'notin') {
                selectedVal = this.isImportRules ? rule.value as string[] : this.setDefaultValue(parentId, true, false) as string[];
                selectedValue = selectedVal.join(',');
            }
            let inputobj: TextBox = new TextBox({
                placeholder: this.l10n.getConstant('SelectValue'),
                input: this.changeValue.bind(this, idx)
            });
            inputobj.appendTo('#' + parentId + '_valuekey' + idx);
            inputobj.value = selectedValue;
            inputobj.dataBind();
        }
    }
    private renderNumberValue(
        parentId: string, rule: RuleModel, operator: string, idx: number, ruleValElem: HTMLElement, itemData: ColumnsModel,
        length: number): void {
        let columnData: ColumnsModel = this.getItemData(parentId);
        let selectedVal: number | number[] =
        (this.isImportRules || this.isPublic) ? rule.value as number : this.setDefaultValue(parentId, false, true) as number;
        if ((operator === 'in' || operator === 'notin') && (this.dataColl.length || columnData.values)) {
            selectedVal = this.isImportRules ? rule.value as number[] : this.setDefaultValue(parentId, true, false) as number[];
            this.renderMultiSelect(columnData, parentId, idx, selectedVal, columnData.values);
            if (this.element.className.indexOf('e-device') > -1 || this.displayMode === 'Vertical') {
                ruleValElem.style.width = '100%';
            } else {
                ruleValElem.style.minWidth = '200px';
                ruleValElem.style.width = null;
            }
        } else if (operator === 'in' || operator === 'notin') {
            selectedVal = this.isImportRules ? rule.value as number[] : this.setDefaultValue(parentId, true, false) as number[];
            let selVal: string = selectedVal.join(',');
            let inputobj: TextBox = new TextBox({
                placeholder: this.l10n.getConstant('SelectValue'),
                input: this.changeValue.bind(this, idx)
            });
            inputobj.appendTo('#' + parentId + '_valuekey' + idx);
            inputobj.value = selVal;
            inputobj.dataBind();
        } else {
            let fieldObj: DropDownList = getComponent(document.getElementById(parentId + '_filterkey'), 'dropdownlist') as DropDownList;
            itemData = this.getColumn(fieldObj.value as string);
            let min: number = (itemData.validation && itemData.validation.min) ? itemData.validation.min : 0;
            let max: number =
                (itemData.validation && itemData.validation.max) ? itemData.validation.max : Number.MAX_VALUE;
            let format: string | FormatObject = itemData.format ? itemData.format : 'n';
            if (length > 1 && rule) {
                selectedVal = rule.value[idx] ? rule.value[idx] : this.setDefaultValue(parentId, true, true) as number;
            }
            let numeric: NumericTextBox = new NumericTextBox({
                value: (selectedVal instanceof Array) ? selectedVal[idx] : selectedVal as number,
                format: format as string, min: min, max: max, width: '100%',
                step: itemData.step ? itemData.step : 1,
                change: this.changeValue.bind(this, idx)
            });
            numeric.appendTo('#' + parentId + '_valuekey' + idx);
        }
    }
    private processValueString(value: string, type: string): string[] | number[] {
        let numArr: number[] = []; let strArr: string[] = value.split(',');
        if (type === 'string') {
            return strArr;
        } else {
            for (let k: number = 0, kLen: number = strArr.length; k < kLen; k++) {
                numArr.push(Number(strArr[k]));
            }
            return numArr;
        }
    }
    private parseDate(value: string, format?: string | FormatObject): Date {
        let formatOpt: DateFormatOptions; let selectedValue: Date;
        if (format) {
            let dParser: Function = this.intl.getDateParser({ skeleton: 'full', type: 'dateTime' });
            formatOpt = this.getFormat(format);
            selectedValue = dParser(value);
            if (isNullOrUndefined(selectedValue)) {
                selectedValue = this.intl.parseDate(value, formatOpt);
            }
        } else {
            selectedValue = new Date(value);
        }
        return selectedValue;
    }
    private renderControls(target: Element, itemData: ColumnsModel, rule: RuleModel, tempRule: RuleModel): void {
        addClass([target.parentElement.querySelector('.e-rule-value')], 'e-value');
        removeClass([target.parentElement.querySelector('.e-rule-value')], 'e-hide');
        addClass([target.parentElement.querySelector('.e-rule-value')], 'e-show');
        if (itemData.template) {
            this.processTemplate(target, itemData, rule, tempRule);
        } else {
            let length: number;
            if (tempRule.type === 'boolean') {
                length = this.selectedColumn.values ? this.selectedColumn.values.length : 2;
            } else {
                length = tempRule.operator && tempRule.operator.toString().toLowerCase().indexOf('between') > -1 ? 2 : 1;
            }
            let parentId: string = closest(target, '.e-rule-container').id; let ruleValElem: HTMLElement; let operator: string;
            operator = tempRule.operator.toString();
            if (target.className.indexOf('e-rule-operator') > -1 || target.className.indexOf('e-rule-filter') > -1) {
                ruleValElem = target.parentElement.querySelector('.e-rule-value') as HTMLElement;
                if (this.element.className.indexOf('e-device') > -1 || this.displayMode === 'Vertical') {
                    ruleValElem.style.width = '100%';
                } else {
                    if (operator !== 'in' && operator !== 'notin') {
                        addClass([ruleValElem], 'e-custom-value');
                    } else {
                        removeClass([ruleValElem], 'e-custom-value');
                    }
                }
                for (let i: number = 0; i < length; i++) {
                    switch (tempRule.type) {
                        case 'string': {
                            this.renderStringValue(parentId, rule, operator, i, ruleValElem);
                        }
                            break;
                        case 'number': {
                            this.renderNumberValue(parentId, rule, operator, i, ruleValElem, itemData, length);
                        }
                            break;
                        case 'boolean':
                            this.processBoolValues(itemData, rule, parentId, i);
                            break;
                        case 'date': {
                            let selectedValue: Date = new Date(); let selVal: string; let column: ColumnsModel;
                            let format: string | FormatObject = itemData.format; let datepick: DatePicker;
                            let place: string = this.l10n.getConstant('SelectValue');
                            if (itemData.value) {
                                if (itemData.value instanceof Date) {
                                    selectedValue = itemData.value as Date;
                                } else if (itemData.value instanceof Number) {
                                    selectedValue = new Date(itemData.value as number) as Date;
                                } else {
                                    selectedValue = this.parseDate(itemData.value as string, itemData.format);
                                }
                            }
                            if ((this.isImportRules || this.isPublic) && rule) {
                                column = this.getColumn(rule.field);
                                format = column.format;
                                if (rule.value) {
                                    selVal = (length > 1) ? rule.value[i] as string : rule.value as string;
                                    selectedValue = this.parseDate(selVal, column.format);
                                } else {
                                    selectedValue = rule.value as null;
                                }
                            }
                            if (format) {
                                let formatObj: DateFormatOptions = this.getFormat(format);
                                if (formatObj.skeleton) {
                                    datepick = new DatePicker({ locale: this.getLocale(), value: selectedValue,
                                        placeholder: place, format: formatObj, change: this.changeValue.bind(this, i) });
                                } else {
                                    datepick = new DatePicker({ value: selectedValue, locale: this.getLocale(),
                                        placeholder: place, format: formatObj.format, change: this.changeValue.bind(this, i) });
                                }
                            } else {
                                datepick = new DatePicker({ locale: this.getLocale(),
                                    value: selectedValue, placeholder: place, change: this.changeValue.bind(this, i) });
                            }
                            datepick.appendTo('#' + parentId + '_valuekey' + i);
                            if (!rule.value) {
                                this.updateRules(document.getElementById(parentId + '_valuekey' + i), selectedValue);
                            }
                        }
                        break;
                    }
                }
            }
        }
    }

    private processBoolValues(itemData: ColumnsModel, rule: RuleModel, parentId: string, i: number): void {
        let isCheck: boolean = false; let value: string; let orgValue: string | boolean;
        if (isNullOrUndefined(rule.type) && itemData) {
            rule.type = itemData.type;
        }
        let label: string;
        if (itemData.values) {
            let values: string[] = itemData.values as string[];
            if (rule.type === 'boolean' && !isNullOrUndefined(rule.value)) {
                isCheck = values[i].toLowerCase() === rule.value.toString().toLowerCase();
            } else if (itemData.value) {
                isCheck = values[i].toLowerCase() === itemData.value.toString().toLowerCase();
            } else if (i === 0) {
                isCheck = true;
            }
            orgValue = value = label = values[i];
        } else {
            let values: boolean[] = [true, false];
            if (rule.type === 'boolean' && !isNullOrUndefined(rule.value)) {
                isCheck = values[i].toString().toLowerCase() === rule.value.toString().toLowerCase();
            } else if (itemData.value) {
                isCheck = values[i].toString().toLowerCase() === itemData.value.toString().toLowerCase();
            } else if (i === 0) {
                isCheck = true;
            }
            value = values[i].toString(); orgValue = values[i]; label = this.l10n.getConstant(['True', 'False'][i]);
        }
        let radiobutton: RadioButton = new RadioButton({
            label: label, name: parentId + 'default', checked: isCheck, value: value,
            change: this.changeValue.bind(this, i)
        });
        radiobutton.appendTo('#' + parentId + '_valuekey' + i);
        if (isCheck) {
            this.updateRules(radiobutton.element, orgValue, 0);
        }
    }
    private getOperatorIndex(ddlObj: DropDownList, rule: RuleModel): number {
        let i: number;
        let dataSource: { [key: string]: Object; }[] = ddlObj.dataSource as { [key: string]: Object; }[];
        let len: number = dataSource.length;
        for (i = 0; i < len; i++) {
            if (rule.operator === ddlObj.dataSource[i].value) {
                return i;
            }
        }
        return 0;
    }
    private getPreviousItemData(prevItemData: ColumnsModel, column: ColumnsModel): ColumnsModel {
        if (column.template && prevItemData && Object.keys(prevItemData).length < 4) {
            prevItemData.template = column.template;
        }
        return prevItemData;
    }

    private renderValues(
        target: Element, itemData: ColumnsModel, prevItemData: ColumnsModel, isRender: boolean, rule: RuleModel,
        tempRule: RuleModel, element: Element): void {
        let filtElem: HTMLElement = document.getElementById(element.id.replace('operatorkey', 'filterkey'));
        let filtObj: DropDownList = getComponent(filtElem, 'dropdownlist') as DropDownList;
        let column: ColumnsModel = this.getColumn(filtObj.value as string);
        if (isRender) {
            let ddlObj: DropDownList = getComponent(target.querySelector('input'), 'dropdownlist') as DropDownList;
            if (itemData.operators) {
                ddlObj.value = null; ddlObj.dataBind(); ddlObj.dataSource = itemData.operators;
                ddlObj.index = this.getOperatorIndex(ddlObj, rule);
                ddlObj.value = tempRule.operator = ddlObj.dataSource[ddlObj.index].value as string;
                ddlObj.dataBind();
            } else if (itemData.type) {
                ddlObj.value = null; ddlObj.dataBind(); ddlObj.dataSource = this.customOperators[itemData.type + 'Operator'];
                ddlObj.index = this.getOperatorIndex(ddlObj, rule);
                ddlObj.value = tempRule.operator = ddlObj.dataSource[ddlObj.index].value as string;
                ddlObj.dataBind();
            }
        }
        let operator: string = tempRule.operator.toString();
        if (!(operator.indexOf('null') > -1 || operator.indexOf('empty') > -1)) {
        let parentId: string = closest(target, '.e-rule-container').id;
        prevItemData = this.getPreviousItemData(prevItemData, column);
        if (prevItemData && prevItemData.template) {
            this.templateDestroy(prevItemData, parentId + '_valuekey0');
            if (isBlazor()) {
                if (!(prevItemData.field === itemData.field)) {
                    blazorTemplates[this.element.id + prevItemData.field] = [];
                    resetBlazorTemplate(this.element.id + prevItemData.field, 'Template');
                    detach(target.nextElementSibling.querySelector('.e-blazor-template'));
                }
            } else {
                let elem: Element = select('#' + parentId + '_valuekey0', target.nextElementSibling);
                if (elem && !elem.classList.contains('e-control')) {
                    detach(select('#' + parentId + '_valuekey0', target.nextElementSibling));
                }
            }
            if (typeof prevItemData.template === 'string' || (prevItemData.template as TemplateColumn).create === undefined) {
                target.nextElementSibling.innerHTML = '';
                this.clearQBTemplate([parentId]);
            }
        }
        if (isRender) {
            this.validatValue(rule, closest(target, '.e-rule-container'));
            if (isBlazor() && !prevItemData.template) {
                this.destroyControls(target);
            } else if (!isBlazor()) {
                this.destroyControls(target);
            }
        }
        itemData.template = column.template;
        if (itemData.template) {
            if (isBlazor() && itemData.field) {
                this.columnTemplateFn = this.templateParser(itemData.template as string);
                let templateID: string = this.element.id + itemData.field;
                let template: Element[] = this.columnTemplateFn(itemData, this, 'Template', templateID);
                target.nextElementSibling.appendChild(template[0]);
                updateBlazorTemplate(templateID, 'Template', column, false);
            }
            addClass([target.nextElementSibling], 'e-template-value'); itemData.template = column.template;
            this.setColumnTemplate(itemData, parentId, column.field, itemData.value as string || operator, target, rule);
            let parentElem: HTMLElement = target.parentElement.querySelector('.e-rule-value') as HTMLElement;
            if (this.element.className.indexOf('e-device') > -1 || this.displayMode === 'Vertical') {
                parentElem.style.width = '100%';
            } else {
                parentElem.style.width = '200px';
            }
        } else {
            removeClass([target.nextElementSibling], 'e-template-value'); let inputLen: number = 1;
            if (tempRule.type === 'boolean') {
                inputLen = this.selectedColumn.values ? this.selectedColumn.values.length : 2;
            } else {
                inputLen = (operator && operator.toLowerCase().indexOf('between') > -1) ? 2 : 1;
            }
            for (let i: number = 0; i < inputLen; i++) {
                let valElem: HTMLElement;
                valElem = this.createElement('input', { attrs: { type: 'text', id: parentId + '_valuekey' + i } });
                target.nextElementSibling.appendChild(valElem);
            }
        }
        this.renderControls(target, itemData, rule, tempRule);
        } else {
            let parentElem: HTMLElement = target.parentElement.querySelector('.e-rule-value') as HTMLElement;
            if (parentElem) { removeClass([parentElem], 'e-show'); addClass([parentElem], 'e-hide'); }
        }
    }
    private setColumnTemplate(itemData: ColumnsModel, ruleID: string, field: string, operator: string, target: Element, rule: RuleModel)
    : void {
        let valElem: Element | Element []; let args: ActionEventArgs;
        if (itemData.template) {
            if (typeof itemData.template === 'string' || (itemData.template as TemplateColumn).create === undefined) {
                args = { requestType: 'value-template-initialize', ruleID: ruleID, field: field, operator: operator, rule: rule };
                this.trigger('actionBegin', args);
                this.columnTemplateFn = this.templateParser(itemData.template as string);
                let templateID: string = this.element.id + field;
                // tslint:disable
                if ((this as any).isReact || (this as any).isAngular) {
                    valElem = this.columnTemplateFn(args, this, ruleID, templateID)[0];
                } else {
                    valElem = this.columnTemplateFn(args, this, 'Template', templateID)[0];
                }
                target.nextElementSibling.appendChild(valElem as Element);
                this.renderReactTemplates();
            } else {
                let template: TemplateColumn = itemData.template as TemplateColumn;
                if (typeof template.create === 'string') {
                    valElem = getValue(template.create, window)({ field: field, operator: operator });
                } else {
                    valElem = (template.create as Function)({ field: field, operator: operator });
                }
                if (valElem instanceof Element) {  
                    valElem.id = ruleID + '_valuekey0'; addClass([valElem], 'e-template');
                    addClass([valElem], 'e-' + field); target.nextElementSibling.appendChild(valElem);
                } else if (valElem instanceof Array) {
                    addClass(valElem, 'e-template');
                    for (let i: number = 0, iLen: number = valElem.length; i < iLen; i++) {
                        valElem[i].id = ruleID + '_valuekey' + i; target.nextElementSibling.appendChild(valElem[i]);
                    }
                }
            }
        }
    }
    private updateValues(element: HTMLElement, rule: RuleModel): void {
        let idx: number = 1;
        if (element.className.indexOf('e-template') > -1) {
            idx = 3;
        }
        let controlName: string = element.className.split(' e-')[idx];
        let i: number = parseInt(element.id.slice(-1), 2) as number;
        switch (controlName) {
            case 'checkbox':
                let value: string = (getComponent(element, controlName) as CheckBox).value;
                rule.value = (value !== '') ? value : undefined;
                break;
            case 'textbox':
                rule.value = (getComponent(element, controlName) as TextBox).value;
                break;
            case 'dropdownlist':
                rule.value = (getComponent(element, controlName) as DropDownList).value as string;
                break;
            case 'radio':
                let radioBtnObj: RadioButton = getComponent(element, controlName) as RadioButton;
                if (radioBtnObj.checked) {
                    if (typeof rule.value === 'boolean') {
                        rule.value = radioBtnObj.value === 'true';
                    } else {
                        if (this.getColumn(rule.field).values) {
                            rule.value = radioBtnObj.value;
                        } else {
                            rule.value = radioBtnObj.value === 'true';
                        }
                    }
                }
                radioBtnObj.refresh();
                break;
            case 'numerictextbox':
                if (rule.operator.indexOf('between') > -1) {
                    if (typeof rule.value === 'string' ) {
                        rule.value = [];
                    }
                    rule.value[i] = (getComponent(element, controlName) as NumericTextBox).value;
                } else {
                    rule.value = (getComponent(element, controlName) as NumericTextBox).value;
                }
                break;
            case 'datepicker':
                let column: ColumnsModel = this.getColumn(rule.field);
                let format: DateFormatOptions = this.getFormat(column.format);
                let selectedDate: Date = (getComponent(element, controlName) as DatePicker).value;
                if (rule.operator.indexOf('between') > -1) {
                    if (typeof rule.value === 'string' ) {
                        rule.value = [];
                    }
                    rule.value[i] = selectedDate;
                } else if (isNullOrUndefined(format.format) && selectedDate) {
                    rule.value = this.intl.formatDate(selectedDate);
                } else if (selectedDate) {
                    rule.value = this.intl.formatDate(selectedDate, format);
                } else {
                    rule.value = selectedDate as null;
                }
                break;
            case 'multiselect':
                rule.value = (getComponent(element, controlName) as MultiSelect).value as number[] | string[];
                break;
        }
    }
    private updateRules(
        target: Element, selectedValue: string | number | Date | boolean | string[] | number[] | Date[] | Element, i?: number): void {
        let groupElem: Element = closest(target, '.e-group-container'); let rule: RuleModel = this.getParentGroup(groupElem);
        let ruleElem: Element = closest(target, '.e-rule-container'); let index: number = 0; let dropDownObj: DropDownList;
        let eventsArgs: ChangeEventArgs; let groupID: string = groupElem.id.replace(this.element.id + '_', ''); let ruleID: string;
        let beforeRules: RuleModel = this.getValidRules(this.rule);
        while (ruleElem && ruleElem.previousElementSibling !== null) {
            ruleElem = ruleElem.previousElementSibling;
            index++;
        }
        let operator: string = rule.rules[index].operator.toString();
        ruleElem = closest(target, '.e-rule-container'); ruleID = ruleElem.id.replace(this.element.id + '_', '');
        if (closest(target, '.e-rule-filter')) {
            dropDownObj = getComponent(target as HTMLElement, 'dropdownlist') as DropDownList;
            let column: ColumnsModel = this.getColumn(dropDownObj.value as string);
            if (!this.isImportRules && rule.rules[index].field.toLowerCase() !== column.field.toLowerCase()) {
                if (!(ruleElem.querySelectorAll('.e-template')) && !(operator.indexOf('null') > -1 )
                || (operator.indexOf('empty') > -1 )) {
                rule.rules[index].value = '';
                }
            }
            this.selectedColumn = dropDownObj.getDataByValue(dropDownObj.value) as ColumnsModel;
            rule.rules[index].field = this.selectedColumn.field; rule.rules[index].type = this.selectedColumn.type;
            rule.rules[index].label = this.selectedColumn.label;
            let ruleElement: Element = closest(target, '.e-rule-filter');
            let element: HTMLElement = ruleElement.nextElementSibling.querySelector('input.e-control') as HTMLElement;
            operator = (getComponent(element, 'dropdownlist') as DropDownList).value.toString();
            rule.rules[index].operator = operator;
            // Value Fields
            let valueContainer: HTMLElement = ruleElement.nextElementSibling.nextElementSibling as HTMLElement;
            let elementCln: NodeListOf<HTMLElement> = valueContainer.querySelectorAll('input.e-control');
            if (elementCln.length < 1) {
                elementCln = valueContainer.querySelectorAll('.e-template');
            }
            for (let i: number = 0; i < elementCln.length; i++) {
                if (!elementCln[i]) {
                    elementCln[i] = ruleElement.nextElementSibling.nextElementSibling.querySelector('div.e-control') as HTMLElement;
                }
                if (!elementCln[i]) {
                    elementCln[i] = ruleElement.nextElementSibling.nextElementSibling.querySelector('.e-template');
                }
                eventsArgs = { groupID: groupID, ruleID: ruleID, value: rule.rules[index].field, type: 'field' };
                if (operator.indexOf('null') > -1 || operator.indexOf('empty') > -1) {
                    rule.rules[index].value = null;
                    continue;
                }
                this.updateValues(elementCln[i], rule.rules[index]);
            }
            if (!this.isImportRules) {
                this.trigger('change', eventsArgs);
            }
            if (this.allowValidation && rule.rules[index].field && target.parentElement.className.indexOf('e-tooltip') > -1) {
                (getComponent(target.parentElement as HTMLElement, 'tooltip') as Tooltip).destroy();
            }
            this.filterRules(beforeRules, this.getValidRules(this.rule), 'field');
        } else if (closest(target, '.e-rule-operator')) {
            dropDownObj = getComponent(target as HTMLElement, 'dropdownlist') as DropDownList;
            rule.rules[index].operator = dropDownObj.value.toString();
            let inputElem: NodeListOf<HTMLElement>; let parentElem: HTMLElement = target.parentElement;
            inputElem = ruleElem.querySelectorAll('.e-rule-value input.e-control') as NodeListOf<HTMLElement>;
            eventsArgs = { groupID: groupID, ruleID: ruleID, value: dropDownObj.value, type: 'operator'};
            if (this.allowValidation && rule.rules[index].operator && target.parentElement.className.indexOf('e-tooltip') > -1) {
                (getComponent(target.parentElement as HTMLElement, 'tooltip') as Tooltip).destroy();
            }
            if (inputElem.length > 1 && !(inputElem[0].className.indexOf('e-template') > -1)) {
                rule.rules[index].value = [];
            }
            for (let i: number = 0; i < inputElem.length; i++) {
                if (rule.rules[index].operator.indexOf('null') > -1 || rule.rules[index].operator.indexOf('empty') > -1) {
                    rule.rules[index].value = null;
                    continue;
                } else if (inputElem[i].classList.contains('e-template')) {
                    continue;
                }
                this.updateValues(inputElem[i], rule.rules[index]);
            }
            if (!this.isImportRules) {
                this.trigger('change', eventsArgs);
            }
            this.filterRules(beforeRules, this.getValidRules(this.rule), 'operator');
        } else if (closest(target, '.e-rule-value')) {
            this.ruleValueUpdate(target, selectedValue, rule, index, groupElem, ruleElem, i);
            this.filterRules(beforeRules, this.getValidRules(this.rule), 'value');
        }
    }
    private filterRules(beforeRule: RuleModel, afterRule: RuleModel, type: string): void {
        let beforeRuleStr: string = JSON.stringify({condition: beforeRule.condition, not: beforeRule.not, rule: beforeRule.rules});
        let afetrRuleStr: string = JSON.stringify({condition: afterRule.condition, not: afterRule.not, rule: afterRule.rules});
        if (beforeRuleStr !== afetrRuleStr) {
            if (!this.isImportRules) {
                this.trigger('ruleChange', { previousRule: beforeRule, rule: afterRule, type: type });
            }
        }
    }
    private ruleValueUpdate(
        target: Element, selectedValue: string | number | Date | boolean | string[] | number[] | Date[] | Element,
        rule: RuleModel, index: number, groupElem: Element, ruleElem: Element, i: number): void {
        let eventsArgs: ChangeEventArgs; let oper: string;
        let arrOperator: string [] = ['in', 'between', 'notin', 'notbetween'];
        if (rule.rules[index].operator) {
            oper = rule.rules[index].operator.toString().toLowerCase();
        }
        if (selectedValue !== null) {
            if (target.className.indexOf('e-multiselect') > -1 && rule.rules[index].type === 'number' &&
            !(target.className.indexOf('e-template') > -1)) {
                let selVal: number[] = []; let dupSelectedValue: string[] | number[] = selectedValue as number[] | string[];
                for (let k: number = 0, kLen: number = dupSelectedValue.length; k < kLen; k++) {
                    if (typeof dupSelectedValue[k] === 'string') {
                        selVal.push(parseFloat(dupSelectedValue[k] as string) as number);
                    }
                }
                if (selVal.length) {
                    selectedValue = selVal as number[];
                }
            }
            if (target.classList.contains('e-blazor-template') || target.className.indexOf('e-template') > -1) {
                rule.rules[index].value = selectedValue as string | number | string[] | number[];
                eventsArgs = { groupID: groupElem.id, ruleID: ruleElem.id, value: rule.rules[index].value as string, type: 'value'};
                if (!this.isImportRules) {
                    this.trigger('change', eventsArgs);
                }
            } else if (target.className.indexOf('e-spin') > -1 || target.className.indexOf('e-numeric') > -1) {
                if (arrOperator.indexOf(oper) > -1) {
                    rule.rules[index].value[i] = selectedValue as string | number;
                } else {
                    rule.rules[index].value = selectedValue as string | number;
                }
            } else if (target.className.indexOf('e-radio') > -1) {
                rule.rules[index].value = selectedValue as string | number;
            } else if (target.className.indexOf('e-multiselect') > -1) {
                rule.rules[index].value = selectedValue as string[];
            } else if (target.className.indexOf('e-textbox') > -1) {
                if (oper === 'in' || oper === 'notin') {
                    if (rule.rules[index].type === 'string') {
                        rule.rules[index].value = this.processValueString(selectedValue as string, rule.rules[index].type) as string[];
                    } else {
                        rule.rules[index].value = this.processValueString(selectedValue as string, rule.rules[index].type) as number[];
                    }
                } else {
                    rule.rules[index].value = selectedValue as string | number;
                }
            } else if (target.className.indexOf('e-datepicker') > -1) {
                let ddlInst: DropDownList =
                    getInstance(ruleElem.querySelector('.e-rule-filter input') as HTMLElement, DropDownList) as DropDownList;
                let format: DateFormatOptions = this.getFormat(this.getColumn(ddlInst.value as string).format);
                if ((<DateFormatOptions>format).type) {
                    if (arrOperator.indexOf(oper) > -1) {
                        if (typeof rule.rules[index].value === 'string') {
                            rule.rules[index].value = [];
                        }
                        rule.rules[index].value[i] = this.intl.formatDate(selectedValue as Date, format);
                    } else {
                        rule.rules[index].value = this.intl.formatDate(selectedValue as Date, format);
                    }
                }
            }
            this.validatValue(rule, ruleElem, index);
        } else {
            if (target.className.indexOf('e-datepicker') > -1) {
                if (arrOperator.indexOf(oper) > -1) {
                    if (typeof rule.rules[index].value === 'string') {
                        rule.rules[index].value = [];
                    }
                    rule.rules[index].value[i] = selectedValue as null;
                } else {
                    rule.rules[index].value = selectedValue as null;
                }
            } else {
                rule.rules[index].value = selectedValue as null;
            }
        }
    }
    private validatValue(rule: RuleModel, ruleElem: Element, index?: number): void {
        if (!isNullOrUndefined(index)) {
            rule = rule.rules[index];
        }
        let isObject: boolean = typeof(rule.value) === 'object';
        if (this.allowValidation && (isNullOrUndefined(index) || (isObject ? (rule.value as string []).length > 0 : rule.value))) {
            let valElem: NodeListOf<Element> = ruleElem.querySelectorAll('.e-rule-value .e-control');
            if (valElem[0].className.indexOf('e-tooltip') > -1) {
                (getComponent(valElem[0] as HTMLElement, 'tooltip') as Tooltip).destroy();
            } else if (valElem[0].parentElement.className.indexOf('e-tooltip') > -1) {
                (getComponent(valElem[0].parentElement as HTMLElement, 'tooltip') as Tooltip).destroy();
            }
            if (valElem[1] && valElem[1].parentElement.className.indexOf('e-tooltip') > -1) {
                (getComponent(valElem[1].parentElement as HTMLElement, 'tooltip') as Tooltip).destroy();
            }
        }

    }
    private getFormat(format: string | FormatObject): DateFormatOptions {
        let formatOptions: DateFormatOptions;
        if (format) {
            if (typeof(format) === 'string') {
                formatOptions = { type: 'dateTime', format: format } as DateFormatOptions;
                if (format === 'short') {
                    formatOptions.skeleton = format;
                }
            } else {
                formatOptions = { type: 'dateTime', skeleton: format.skeleton } as DateFormatOptions;
            }
        } else {
            formatOptions = { type: 'dateTime', skeleton: 'yMd' } as DateFormatOptions;
        }
        return formatOptions;
    }
    private findGroupByIdx(groupIdx: number, rule:  RuleModel, isRoot: boolean): RuleModel {
        let ruleColl: RuleModel[] = rule.rules;
        let dupRuleColl: RuleModel[] = [];
        if (!isRoot) {
            for (let j: number = 0, jLen: number = ruleColl.length; j < jLen; j++) {
                rule = ruleColl[j];
                if (rule.rules) {
                    dupRuleColl.push(rule);
                }
            }
            return dupRuleColl[groupIdx];
        }
        return rule;
    }
    /**
     * Removes the component from the DOM and detaches all its related event handlers.
     * Also it maintains the initial input element from the DOM.
     * @method destroy
     * @return {void}
     */
    public destroy(): void {
        let queryElement: Element = this.element;
        if (!queryElement) { return; }
        let element: NodeListOf<HTMLElement>; let i: number; let len: number; let tooltip: NodeListOf<HTMLElement>;
        super.destroy();
        element = this.element.querySelectorAll('.e-addrulegroup') as NodeListOf<HTMLElement>;
        len = element.length;
        for (i = 0; i < len; i++) {
            (getComponent(element[i], 'dropdown-btn') as DropDownButton).destroy();
            detach(element[i]);
        }
        tooltip = this.element.querySelectorAll('.e-rule-filter .e-control.e-tooltip') as NodeListOf<HTMLElement>;
        for (i = 0; i < tooltip.length; i++) {
            (getComponent(tooltip[i], 'tooltip') as Tooltip).destroy();
        }
        element = this.element.querySelectorAll('.e-rule-filter .e-control:not(.e-tooltip)') as NodeListOf<HTMLElement>;
        len = element.length;
        for (i = 0; i < len; i++) {
            (getComponent(element[i], 'dropdownlist') as DropDownList).destroy();
            detach(element[i]);
        }
        tooltip = this.element.querySelectorAll('.e-rule-operator .e-control.e-tooltip') as NodeListOf<HTMLElement>;
        for (i = 0; i < tooltip.length; i++) {
            (getComponent(tooltip[i], 'tooltip') as Tooltip).destroy();
        }
        element = this.element.querySelectorAll('.e-rule-operator .e-control:not(.e-tooltip)') as NodeListOf<HTMLElement>;
        len = element.length;
        for (i = 0; i < len; i++) {
            (getComponent(element[i], 'dropdownlist') as DropDownList).destroy();
            detach(element[i]);
        }
        tooltip = this.element.querySelectorAll('.e-rule-value .e-control.e-tooltip') as NodeListOf<HTMLElement>;
        for (i = 0; i < tooltip.length; i++) {
            (getComponent(tooltip[i], 'tooltip') as Tooltip).destroy();
        }
        this.isImportRules = false;
        this.unWireEvents();
        this.levelColl[this.element.id + '_group0'] = [0];
        this.element.innerHTML = '';
        // tslint:disable
        if ((this as any).portals && (this as any).portals.length) { this.clearQBTemplate(); }
        classList(this.element, [], ['e-rtl', 'e-responsive', 'e-device']);
    }
    /**
     * Adds single or multiple rules.
     * @returns void.
     */
    public addRules(rule: RuleModel[], groupID: string): void {
        groupID = this.element.id + '_' + groupID;
        this.isPublic = true;
        for (let i: number = 0, len: number = rule.length; i < len; i++) {
            this.addRuleElement(document.getElementById(groupID), rule[i]);
        }
        this.isPublic = false;
    }
    /**
     * Adds single or multiple groups, which contains the collection of rules.
     * @returns void.
     */
    public addGroups(groups: RuleModel[], groupID: string): void {
        groupID = this.element.id + '_' + groupID;
        let groupElem: Element = document.getElementById(groupID);
        let rule: RuleModel = this.getParentGroup(groupElem); let grouplen: number = groups.length;
        if (grouplen) {
            this.isPublic = true;
            for (let i: number = 0, len: number = groups.length; i < len; i++) {
                this.updatedRule = {condition: groups[i].condition, not: groups[i].not};
                this.importRules(groups[i], groupElem);
            }
            this.isPublic = false;
        } else {
            let condition: string = 'and'; let not: boolean = false;
            if (this.updatedRule) {
                condition = this.updatedRule.condition;
                not = this.updatedRule.not;
            }
            if (this.enableNotCondition) {
                rule.rules.push({ 'condition': condition, 'not': not, rules: [] });
            } else {
                rule.rules.push({ 'condition': condition, rules: [] });
            }
        }
        let andElem: HTMLInputElement = groupElem.querySelector('.e-btngroup-and');
        let orElem: HTMLInputElement = groupElem.querySelector('.e-btngroup-or');
        if (andElem.disabled) {
            andElem.removeAttribute('disabled');
            andElem.checked = true;
            orElem.removeAttribute('disabled');
        }
    }
    private initWrapper(): void {
        this.isInitialLoad = true;
        if (this.cssClass) {
            addClass([this.element], this.cssClass);
        }
        if (this.enableRtl) {
            addClass([this.element], 'e-rtl');
        }
        if (this.width) {
            this.element.style.width = this.width;
        }
        if (this.height) {
            this.element.style.height = this.height;
        }
        if (this.rule.rules.length) {
            this.isImportRules = true;
        } else {
            this.addGroupElement(false, this.element);
        }
        if (Browser.isDevice || this.displayMode === 'Vertical') {
            if (Browser.isDevice) {
                this.element.style.width = '100%';
                this.element.classList.add('e-device');
            }
            removeClass(this.element.querySelectorAll('.e-rule-container'), 'e-horizontal-mode');
            addClass(this.element.querySelectorAll('.e-rule-container'), 'e-vertical-mode');
            this.displayMode = 'Vertical';
        } else {
            this.displayMode = 'Horizontal';
        }
        if (this.summaryView) {
            if (this.isImportRules) {
                this.renderSummary();
            } else {
                this.renderSummaryCollapse();
            }
        } else {
            if (this.columns.length && this.isImportRules) {
                this.addGroupElement(false, this.element, this.rule.condition);
                let mRules: RuleModel = extend({}, this.rule, {}, true);
                this.isRefreshed = true;
                this.setGroupRules(mRules as RuleModel);
                this.isRefreshed = false;
            } else if (this.columns.length) {
                this.addRuleElement(this.element.querySelector('.e-group-container'), {});
            }
            this.notGroupRtl();
            if (this.readonly) {
                this.enableReadonly();
            }
            let buttons: NodeListOf<Element> = this.element.querySelectorAll('label.e-btn');
            let button: HTMLElement;
            for (let i: number = 0; i < buttons.length; i++) {
                button = buttons.item(i) as HTMLElement;
                rippleEffect(button, { selector: '.e-btn' });
            }
        }
    }
    private renderSummary(): void {
        let contentElem: Element = this.createElement('div', {
            attrs: {
                class: 'e-summary-content',
                id: this.element.id + '_summary_content'
            }
        });
        let textElem: Element =
        this.createElement('textarea', { attrs: { class: 'e-summary-text', readonly: 'true' }, styles: 'max-height:500px' });
        let editElem: Element = this.createElement('button', { attrs: { class: 'e-edit-rule e-css e-btn e-small e-flat e-primary' } });
        let divElem: Element = this.createElement('div', { attrs: { class: 'e-summary-btndiv' } });
        contentElem.appendChild(textElem);
        textElem.textContent = this.getSqlFromRules(this.rule);
        editElem.textContent = this.l10n.getConstant('Edit');
        divElem.appendChild(editElem);
        contentElem.appendChild(divElem);
        this.element.appendChild(contentElem);
    }
    private renderSummaryCollapse(): void {
        let collapseElem: Element = this.createElement('div', {
            attrs: {
                class: 'e-collapse-rule e-icons',
                title: this.l10n.getConstant('SummaryViewTitle')
            }
        });
        this.element.querySelector('.e-group-header').appendChild(collapseElem);
    }
    private columnSort(): void {
        if (this.sortDirection.toLowerCase() === 'descending') {
            this.columns = new DataManager(this.columns).executeLocal(new Query().sortByDesc('field'));
        } else if (this.sortDirection.toLowerCase() === 'ascending') {
            this.columns = new DataManager(this.columns).executeLocal(new Query().sortBy('field'));
        }
    }
    private onChangeNotGroup(): void {
        this.element.innerHTML = '';
        this.groupIdCounter = 0;
        if (this.enableNotCondition) {
            if (this.enableNotCondition) {
                let inputElem: HTMLElement = this.createElement('button', { attrs: { type: 'button', class: 'e-qb-toggle' }});
                this.groupElem.querySelector('.e-btn-group').insertBefore(inputElem, this.groupElem.querySelector('.e-btngroup-and'));
            }
        } else {
            this.groupElem.querySelector('.e-qb-toggle').remove();
        }
        this.rule = this.checkNotGroup(this.rule);
        this.initWrapper();
    }
    private notGroupRtl(): void {
        if (this.enableRtl) {
            addClass(this.element.querySelectorAll('.e-btn-group'), 'e-rtl');
        } else {
            removeClass(this.element.querySelectorAll('.e-btn-group'), 'e-rtl');
        }
    }
    private checkNotGroup(rule: RuleModel): RuleModel {
        let orgRule: RuleModel;
        if (rule.rules) {
            for (let i: number = 0; i < rule.rules.length; i++) {
                orgRule = rule.rules[i];
                orgRule = this.checkNotGroup(orgRule);
                rule.rules[i] = orgRule;
            }
        }
        if (!isNullOrUndefined(rule.not)) {
            if (this.enableNotCondition) {
                rule.not = false;
            }
            delete rule.not;
        } else if (this.enableNotCondition && !isNullOrUndefined(rule.condition)) {
            rule.not = false;
        }
        return rule;
    }
    // tslint:disable-next-line:max-func-body-length
    public onPropertyChanged(newProp: QueryBuilderModel, oldProp: QueryBuilderModel): void {
        let properties: string[] = Object.keys(newProp);
        for (let prop of properties) {
            switch (prop) {
                case 'summaryView':
                    let groupElem: HTMLElement = this.element.querySelector('.e-group-container') as HTMLElement;
                    let summaryElem: HTMLElement = this.element.querySelector('.e-summary-content') as HTMLElement;
                    if (newProp.summaryView) {
                        groupElem.style.display = 'none';
                        if (this.element.querySelectorAll('.e-summary-content').length < 1) {
                            this.renderSummary();
                            summaryElem = this.element.querySelector('.e-summary-content') as HTMLElement;
                        } else {
                            this.element.querySelector('.e-summary-text').textContent = this.getSqlFromRules(this.rule);
                        }
                        summaryElem.style.display = 'block';
                    } else {
                        if (groupElem.querySelectorAll('.e-collapse-rule').length > -1) {
                            this.renderSummaryCollapse();
                        }
                        groupElem.style.display = 'block'; summaryElem.style.display = 'none';
                    }
                    break;
                case 'displayMode':
                    this.refresh();
                    break;
                case 'showButtons':
                    if (newProp.showButtons.ruleDelete) {
                        removeClass(this.element.querySelectorAll('.e-rule-delete'), 'e-button-hide');
                    } else {
                        addClass(this.element.querySelectorAll('.e-rule-delete'), 'e-button-hide');
                    }
                    if (newProp.showButtons.groupDelete) {
                        removeClass(this.element.querySelectorAll('.e-deletegroup'), 'e-button-hide');
                    } else {
                        addClass(this.element.querySelectorAll('.e-deletegroup'), 'e-button-hide');
                    }
                    break;
                case 'cssClass':
                    if (oldProp.cssClass) {
                        removeClass([this.element], oldProp.cssClass.split(' '));
                    }
                    if (newProp.cssClass) {
                        addClass([this.element], newProp.cssClass.split(' '));
                    }
                    break;
                case 'enableRtl':
                    if (newProp.enableRtl) {
                        addClass([this.element], 'e-rtl'); this.notGroupRtl();
                    } else {
                        removeClass([this.element], 'e-rtl'); this.notGroupRtl();
                    }
                    break;
                case 'enablePersistence':
                    this.enablePersistence = newProp.enablePersistence;
                    break;
                case 'dataSource':
                    this.dataSource = newProp.dataSource; this.refresh();
                    break;
                case 'columns':
                    if (isBlazor()) {
                        let columnIndex: string = Object.keys(newProp.columns).toString();
                        let columnValue: string | number | boolean | string[] | number[] = newProp.columns[columnIndex].values;
                        while (!this.target.classList.contains('e-blazor-template')) {
                            this.target = this.target.parentElement;
                        }
                        this.updateRules(this.target, columnValue);
                    } else {
                        this.columns = newProp.columns;
                    }
                    this.columnSort();
                    break;
                case 'sortDirection':
                    this.sortDirection = newProp.sortDirection;
                    this.columnSort();
                    break;
                case 'maxGroupCount':
                    this.maxGroupCount = newProp.maxGroupCount;
                    break;
                case 'height':
                    this.height = newProp.height;
                    this.element.style.height = this.height;
                    break;
                case 'rule':
                    this.rule = newProp.rule;
                    newProp.rule = this.getRuleCollection(this.rule, false);
                    break;
                case 'width':
                    this.width = newProp.width;
                    this.element.style.width = this.width;
                    break;
                case 'locale':
                    this.locale = newProp.locale; this.intl = new Internationalization(this.locale);
                    this.isLocale = true; this.refresh(); this.isLocale = false; break;
                case 'enableNotCondition':
                    this.onChangeNotGroup();
                    break;
                case 'readonly':
                    this.isReadonly = newProp.readonly;
                    this.enableReadonly();
                    break;
            }
        }
    }
    protected preRender(): void {
        this.element.id = this.element.id || getUniqueID('ej2-querybuilder');
        this.defaultLocale = {
            StartsWith: 'Starts With',
            EndsWith: 'Ends With',
            Contains: 'Contains',
            Equal: 'Equal',
            NotEqual: 'Not Equal',
            LessThan: 'Less Than',
            LessThanOrEqual: 'Less Than Or Equal',
            GreaterThan: 'Greater Than',
            GreaterThanOrEqual: 'Greater Than Or Equal',
            Between: 'Between',
            NotBetween: 'Not Between',
            In: 'In',
            NotIn: 'Not In',
            Remove: 'REMOVE',
            SelectField: 'Select a field',
            SelectOperator: 'Select operator',
            DeleteRule: 'Remove this condition',
            DeleteGroup: 'Delete group',
            AddGroup: 'Add Group',
            AddCondition: 'Add Condition',
            Edit: 'EDIT',
            ValidationMessage: 'This field is required',
            SummaryViewTitle: 'Summary View',
            OtherFields: 'Other Fields',
            AND: 'AND',
            OR: 'OR',
            NOT: 'NOT',
            SelectValue: 'Enter Value',
            IsEmpty: 'Is Empty',
            IsNotEmpty: 'Is Not Empty',
            IsNull: 'Is Null',
            IsNotNull: 'Is Not Null',
            True: 'true',
            False: 'false'
        };
        this.l10n = new L10n('querybuilder', this.defaultLocale, this.locale);
        this.intl = new Internationalization(this.locale);
        this.groupIdCounter = 0;
        this.ruleIdCounter = 0;
        this.btnGroupId = 0;
        this.isImportRules = false;
        this.parser = [];
        this.customOperators = {
            stringOperator: [
                { value: 'startswith', key: this.l10n.getConstant('StartsWith') },
                { value: 'endswith', key: this.l10n.getConstant('EndsWith') },
                { value: 'contains', key: this.l10n.getConstant('Contains') },
                { value: 'equal', key: this.l10n.getConstant('Equal') },
                { value: 'notequal', key: this.l10n.getConstant('NotEqual') },
                { value: 'in', key: this.l10n.getConstant('In') },
                { value: 'notin', key: this.l10n.getConstant('NotIn') },
                { value: 'isempty', key: this.l10n.getConstant('IsEmpty') },
                { value: 'isnotempty', key: this.l10n.getConstant('IsNotEmpty') }],
            dateOperator: [
                { value: 'equal', key: this.l10n.getConstant('Equal') },
                { value: 'greaterthan', key: this.l10n.getConstant('GreaterThan') },
                { value: 'greaterthanorequal', key: this.l10n.getConstant('GreaterThanOrEqual') },
                { value: 'lessthan', key: this.l10n.getConstant('LessThan') },
                { value: 'lessthanorequal', key: this.l10n.getConstant('LessThanOrEqual') },
                { value: 'notequal', key: this.l10n.getConstant('NotEqual') }],
            booleanOperator: [
                { value: 'equal', key: this.l10n.getConstant('Equal') },
                { value: 'notequal', key: this.l10n.getConstant('NotEqual') }],
            numberOperator: [
                { value: 'equal', key: this.l10n.getConstant('Equal') },
                { value: 'greaterthanorequal', key: this.l10n.getConstant('GreaterThanOrEqual') },
                { value: 'greaterthan', key: this.l10n.getConstant('GreaterThan') },
                { value: 'between', key: this.l10n.getConstant('Between') },
                { value: 'lessthan', key: this.l10n.getConstant('LessThan') },
                { value: 'notbetween', key: this.l10n.getConstant('NotBetween') },
                { value: 'lessthanorequal', key: this.l10n.getConstant('LessThanOrEqual') },
                { value: 'notequal', key: this.l10n.getConstant('NotEqual') },
                { value: 'in', key: this.l10n.getConstant('In') },
                { value: 'notin', key: this.l10n.getConstant('NotIn') }],
        };
        this.operators = {
            equal: '=', notequal: '!=', greaterthan: '>', greaterthanorequal: '>=', lessthan: '<', in: 'IN', notin: 'NOT IN',
            lessthanorequal: '<=', startswith: 'LIKE', endswith: 'LIKE', between: 'BETWEEN', notbetween: 'NOT BETWEEN', contains: 'LIKE',
            isnull: 'IS NULL', isnotnull: 'IS NOT NULL', isempty: 'IS EMPTY', isnotempty: 'IS NOT EMPTY', notstartswith: 'NOT LIKE',
            notendswith: 'NOT LIKE', notcontains: 'NOT LIKE'
        };
        if (!this.fields) {
            this.fields = { text: 'label', value: 'field'};
        }
    }

    protected render(): void {
        this.levelColl = {};
        this.items = [
            {
                text: this.l10n.getConstant('AddGroup'),
                iconCss: 'e-icons e-add-icon e-addgroup'
            },
            {
                text: this.l10n.getConstant('AddCondition'),
                iconCss: 'e-icons e-add-icon e-addrule',
            }];
        this.ruleElem = this.ruleTemplate();
        this.groupElem = this.groupTemplate();
        if (!isBlazor()) {
            let stringOper: object[] = [
                { value: 'isnull', key: this.l10n.getConstant('IsNull') },
                { value: 'isnotnull', key: this.l10n.getConstant('IsNotNull') }
            ];
            let numberOper: object[] = [
                { value: 'isnull', key: this.l10n.getConstant('IsNull') },
                { value: 'isnotnull', key: this.l10n.getConstant('IsNotNull') }
            ];
            this.customOperators['stringOperator'] = this.customOperators['stringOperator'].concat(stringOper); // tslint:disable-line
            this.customOperators['numberOperator'] = this.customOperators['numberOperator'].concat(numberOper); // tslint:disable-line
        }
        if (this.dataSource instanceof DataManager) {
            this.dataManager = this.dataSource as DataManager;
            this.executeDataManager(new Query().take(1));
        } else {
            this.dataManager = new DataManager(this.dataSource as object[]);
            this.dataColl = this.dataManager.executeLocal(new Query());
            this.initControl();
        }
        this.renderComplete();
    }

    private templateParser(template: string): Function {
        if (template) {
            try {
                if (document.querySelectorAll(template).length) {
                    return templateCompiler(document.querySelector(template).innerHTML.trim());
                }
            } catch (error) {
                return templateCompiler(template);
            }
        }
        return undefined;
    }

    private executeDataManager(query: Query): void {
        let data: Promise<Object> = this.dataManager.executeQuery(query) as Promise<Object>;
        let deferred: Deferred = new Deferred();
        data.then((e: {actual: {result: Object[], count: number}, result: Object[]}) => {
            if (e.actual && e.actual.result) {
                this.dataColl = e.actual.result;
            } else {
                this.dataColl = e.result;
            }
            this.initControl();
        }).catch((e: ReturnType) => {
            deferred.reject(e);
        });
    }
    private initControl(): void {
        this.initialize();
        this.initWrapper();
        this.wireEvents();
    }
    protected wireEvents(): void {
        let wrapper: Element = this.getWrapper();
        EventHandler.add(wrapper, 'click', this.clickEventHandler, this);
        EventHandler.add(wrapper, 'focusout', this.focusEventHandler, this);
        EventHandler.add(wrapper, 'focusin', this.focusEventHandler, this);
        EventHandler.add(this.element, 'keydown', this.keyBoardHandler, this);
    }
    protected unWireEvents(): void {
        let wrapper: Element = this.getWrapper();
        EventHandler.remove(wrapper, 'click', this.clickEventHandler);
        EventHandler.remove(wrapper, 'focusout', this.focusEventHandler);
        EventHandler.remove(wrapper, 'focusin', this.focusEventHandler);
        EventHandler.remove(this.element, 'keydown', this.keyBoardHandler);
    }
    private getParentGroup(target: Element| string, isParent ?: boolean): RuleModel {
        let groupLevel: number[] = (target instanceof Element) ? this.levelColl[target.id] : this.levelColl[target];
        let len: number = isParent ? groupLevel.length - 1 : groupLevel.length;
        let rule: RuleModel = this.rule;
        for (let i: number = 0; i < len; i++) {
            rule = this.findGroupByIdx(groupLevel[i], rule, i === 0);
        }
        return rule;
    }
    private deleteGroup(target: Element): void {
        let groupElem: Element = target; let groupId: string = groupElem.id.replace(this.element.id + '_', '');
        let args: ChangeEventArgs = { groupID: groupId, cancel: false, type: 'deleteGroup' };
        if (!this.isImportRules) {
            this.trigger('beforeChange', args, (observedChangeArgs: ChangeEventArgs) => {
                this.deleteGroupSuccessCallBack(observedChangeArgs, target);
            });
        } else {
            this.deleteGroupSuccessCallBack(args, target);
        }
    }

    private deleteGroupSuccessCallBack(args: ChangeEventArgs, target: Element): void {
        if (!args.cancel) {
            if (this.actionButton) {
                (getComponent(this.actionButton as HTMLElement, 'tooltip') as Tooltip).destroy();
            }
            let groupElem: Element = target; let rule: RuleModel = this.getParentGroup(groupElem, true);
            let index: number = 0; let i: number; let len: number; let beforeRules: RuleModel = this.getValidRules(this.rule);
            let nextElem: Element = groupElem.nextElementSibling; let prevElem: Element = groupElem.previousElementSibling;
            let element: NodeListOf<Element> = groupElem.querySelectorAll('.e-group-container');
            let valElem: NodeListOf<Element> = groupElem.querySelectorAll('.e-tooltip');
            len = valElem.length;
            for (i = 0; i < len; i++) {
                (getComponent(valElem[i] as HTMLElement, 'tooltip') as Tooltip).destroy();
            }
            for (i = 0, len = element.length; i < len; i++) {
                delete this.levelColl[element[i].id];
            }
            while (groupElem.previousElementSibling !== null) {
                groupElem = groupElem.previousElementSibling;
                index++;
            }
            if (nextElem && nextElem.className.indexOf('e-separate-rule') > -1) {
                removeClass([nextElem], 'e-separate-rule');
                addClass([nextElem], 'e-joined-rule');
                if (prevElem && prevElem.className.indexOf('e-rule-container') > -1) {
                    addClass([prevElem], 'e-prev-joined-rule');
                }
            }
            let elem: Element = groupElem.parentElement.parentElement.parentElement; let removeString: string[] = [];
            // tslint:disable
            if ((this as any).isReact || (this as any).isAngular) {
                let remRule: RuleModel = rule.rules[index];
                let ruleElemColl: NodeListOf<Element> = target.querySelectorAll('.e-rule-container');
                if (remRule && remRule.rules) {
                    for (let r: number = 0; r < remRule.rules.length; r++) {
                        let column: ColumnsModel = this.getColumn(remRule.rules[r].field);
                        if (column && (column.ruleTemplate || this.isPlatformTemplate(column))) {
                            removeString.push(ruleElemColl[r].id);
                        }
                    }
                }
            }
            detach(target);
            if (removeString.length) { this.clearQBTemplate(removeString); }
            rule.rules.splice(index, 1);
            delete this.levelColl[args.groupID];
            this.refreshLevelColl();
            this.disableRuleCondition(elem, rule);
            if (!this.isImportRules) {
                this.trigger('change', args);
            }
            this.filterRules(beforeRules, this.getValidRules(this.rule), 'deleteGroup');
        }
    }

    private isPlatformTemplate(column: ColumnsModel): boolean {
        let isTemp: boolean = false;
        isTemp = column.template && (typeof column.template === 'string' || (column.template as TemplateColumn).create === undefined);
        return isTemp;
    }

    private deleteRule(target: Element): void {
        let groupElem: Element = closest(target, '.e-group-container'); let ruleID: string; let groupID: string;
        groupID = groupElem.id.replace(this.element.id + '_', '');
        ruleID = closest(target, '.e-rule-container').id.replace(this.element.id + '_', '');
        let args: ChangeEventArgs = { groupID: groupID, ruleID: ruleID, cancel: false, type: 'deleteRule' };
        if (!this.isImportRules) {
            this.trigger('beforeChange', args, (observedChangeArgs: ChangeEventArgs) => {
                this.deleteRuleSuccessCallBack(observedChangeArgs, target);
            });
        } else {
            this.deleteRuleSuccessCallBack(args, target);
        }
    }

    private deleteRuleSuccessCallBack(args: ChangeEventArgs, target: Element): void {
        if (!args.cancel) {
            if (this.actionButton && this.actionButton.className.indexOf('e-tooltip') > -1) {
                (getComponent(this.actionButton as HTMLElement, 'tooltip') as Tooltip).destroy();
            }
            let groupElem: Element = closest(target, '.e-group-container');
            let rule: RuleModel = this.getParentGroup(groupElem); let ruleElem: Element = closest(target, '.e-rule-container');
            let beforeRules: RuleModel = this.getValidRules(this.rule);
            let clnruleElem: Element = ruleElem; let nextElem: Element = ruleElem.nextElementSibling;
            let prevElem: Element = ruleElem.previousElementSibling; let index: number = 0;
            let valElem: NodeListOf<Element> = ruleElem.querySelectorAll('.e-tooltip');
            let i: number; let len: number = valElem.length; let column: ColumnsModel;
            for (i = 0; i < len; i++) {
                (getComponent(valElem[i] as HTMLElement, 'tooltip') as Tooltip).destroy();
            }
            while (ruleElem.previousElementSibling !== null) {
                ruleElem = ruleElem.previousElementSibling;
                index++;
            }
            column = this.getColumn(rule.rules[index].field);
            if (column && column.template && clnruleElem.querySelector('.e-template')) {
                this.templateDestroy(column, clnruleElem.querySelector('.e-template').id);
            }
            if (!prevElem || prevElem.className.indexOf('e-rule-container') < 0) {
                if (nextElem) {
                    removeClass([nextElem], 'e-joined-rule');
                }
            }
            if (!nextElem || nextElem.className.indexOf('e-rule-container') < 0) {
                if (prevElem) {
                    removeClass([prevElem], 'e-prev-joined-rule');
                }
            }
            detach(clnruleElem);
			if (column && column.ruleTemplate) {
				this.clearQBTemplate([ruleElem.id]);
            }
            if (column && this.isPlatformTemplate(column)) {
                this.clearQBTemplate([clnruleElem.id]);
            }
            rule.rules.splice(index, 1);
            if (!(rule.rules[0] && rule.rules[0].rules)) {
                this.disableRuleCondition(groupElem, rule);
            }
            if (!this.isImportRules) {
                this.trigger('change', args);
            }
            this.filterRules(beforeRules, this.getValidRules(this.rule), 'deleteRule');
        }
    }

    private setGroupRules(rule: RuleModel): void {
        this.reset();
        this.groupIdCounter = 1;
        this.ruleIdCounter = 0;
        this.isImportRules = true;
        this.rule = rule;
        rule = this.getRuleCollection(this.rule, false);
        this.importRules(this.rule, this.element.querySelector('.e-group-container'), true);
        this.isImportRules = false;
    }

    private keyBoardHandler(e: KeyboardEventArgs): void {
        if (this.readonly && (e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 13)) {
            e.preventDefault();
        }
    }

    private clearQBTemplate(ruleElemColl?: string[]): void {
        // tslint:disable
        if ((this as any).isReact || (this as any).isAngular) {
            this.clearTemplate(ruleElemColl);
        }
    }

    private disableRuleCondition(groupElem: Element, rules?: RuleModel): void {
        if (this.readonly) {
            return;
        }
        let count: number = groupElem.querySelector('.e-rule-list').childElementCount;
        let andElem: HTMLInputElement = groupElem.querySelector('.e-btngroup-and');
        let orElem: HTMLInputElement = groupElem.querySelector('.e-btngroup-or');
        if (count > 1) {
            andElem.disabled = false;
            orElem.disabled = false;
            if (orElem.nextElementSibling.classList.contains('e-btn-disable') ||
            andElem.nextElementSibling.classList.contains('e-btn-disable')) {
                orElem.nextElementSibling.classList.remove('e-btn-disable');
                andElem.nextElementSibling.classList.remove('e-btn-disable');
            }
            rules && rules.condition === 'or' ? orElem.checked = true : andElem.checked = true;
        } else {
            andElem.checked = false; andElem.disabled = true;
            orElem.checked = false; orElem.disabled = true;
            if (rules) {
                orElem.nextElementSibling.classList.add('e-btn-disable');
                andElem.nextElementSibling.classList.add('e-btn-disable');
            }
        }
    }

    /**
     * return the valid rule or rules collection.
     * @returns RuleModel.
     */
    public getValidRules(currentRule?: RuleModel): RuleModel {
        if (!currentRule) {
            currentRule = this.getRules();
        }
        let ruleCondtion: string = currentRule.condition;
        let notCondition: boolean = currentRule.not;
        let ruleColl: RuleModel [] = extend([], currentRule.rules, [], true) as RuleModel [];
        let rule: RuleModel = this.getRuleCollection({condition: ruleCondtion, rules: ruleColl, not: notCondition}, true);
        return rule;
    }
    private getRuleCollection(rule: RuleModel, isValidRule: boolean): RuleModel {
        let orgRule: RuleModel;
        if (rule.rules && rule.rules.length && (Object.keys(rule.rules[0]).length > 6 || isValidRule)) {
            let jLen: number = rule.rules.length;
            for (let j: number = 0; j < jLen; j++) {
                orgRule = rule.rules[j];
                orgRule = this.getRuleCollection(orgRule, isValidRule);
                rule.rules[j] = orgRule;
                if (Object.keys(orgRule).length < 1 && isValidRule) {
                    rule.rules.splice(j, 1); j--; jLen--;
                }
            }
        }
        if (!rule.condition && rule.condition !== '') {
            if (rule.operator) {
                if (rule.operator.toString().indexOf('null') > -1 || rule.operator.toString().indexOf('empty') > -1) {
                    rule.value = null;
                }
            }
            if ((this.isRefreshed && this.enablePersistence) || (this.rule.field !== '' && rule.operator !== '' && (rule.value !== '' &&
            rule.value !== undefined))) {
                // tslint:disable-next-line:no-any
                let customObj: Object = (rule as any).custom;
                rule = {
                    'label': rule.label, 'field': rule.field, 'operator': rule.operator, 'type': rule.type, 'value': rule.value
                };
                if (customObj) {
                    // tslint:disable-next-line:no-any
                    (rule as any).custom = customObj;
                }
            } else {
                rule = {};
            }
        } else {
            if (this.enableNotCondition) {
                rule = { 'condition': rule.condition, 'rules': rule.rules, 'not': rule.not };
            } else {
                rule = { 'condition': rule.condition, 'rules': rule.rules };
            }
        }
        return rule;
    }
    /**
     * Set the rule or rules collection.
     * @returns void.
     */
    public setRules(rule: RuleModel): void {
        let mRules: RuleModel = extend({}, rule, {}, true);
        this.setGroupRules(mRules);
    }
    /**
     * Gets the rule or rule collection.
     * @returns object.
     */
    public getRules(): RuleModel {
        if (this.enableNotCondition) {
            return {condition: this.rule.condition, rules: this.rule.rules, not: this.rule.not};
        } else {
            return {condition: this.rule.condition, rules: this.rule.rules};
        }
    }
    /**
     * Gets the rule.
     * @returns object.
     */
    public getRule(elem: string | HTMLElement): RuleModel {
        let ruleElem: Element; let ruleId: string; let index: number = 0;
        if (elem instanceof HTMLElement) {
            ruleElem = closest(elem, '.e-rule-container');
        } else {
            ruleId = this.element.id + '_' + elem;
            ruleElem = document.getElementById(ruleId);
        }
        let groupElem: Element = closest(ruleElem, '.e-group-container');
        let rule: RuleModel = this.getParentGroup(groupElem);
        while (ruleElem.previousElementSibling !== null) {
            ruleElem = ruleElem.previousElementSibling;
            index++;
       }
        return rule.rules[index];
    }
    /**
     * Gets the group.
     * @returns object.
     */
    public getGroup(target: Element | string): RuleModel {
        if (target instanceof Element && target.className.indexOf('e-group-container') < 1) {
            target = closest(target, '.e-group-container');
        }
        let groupId: string = (target instanceof Element) ? target.id : this.element.id + '_' + target;
        let rule: RuleModel = this.getParentGroup(groupId);
        if (this.enableNotCondition) {
            return { rules: rule.rules, condition: rule.condition, not: rule.not };
        } else {
            return { rules: rule.rules, condition: rule.condition };
        }
    }
    /**
     * Deletes the group or groups based on the group ID.
     * @returns void.
     */
    public deleteGroups(groupIdColl: string[]): void {
        let i: number; let len: number = groupIdColl.length; let groupID: string;
        for (i = 0; i < len; i++) {
            groupID = this.element.id + '_' + groupIdColl[i];
            this.deleteGroup(document.getElementById(groupID));
        }
    }
    /**
     * return the Query from current rules collection.
     * @returns Promise.
     * @blazorType object
     */
    public getFilteredRecords(): Promise<Object> | object {
        let predicate: Predicate = this.getPredicate(this.getValidRules(this.rule));
        let dataManagerQuery: Query;
        dataManagerQuery = isNullOrUndefined(predicate) ? new Query() : new Query().where(predicate);
        if (isBlazor()) {
            let adaptr: UrlAdaptor = new UrlAdaptor();
            let dm: DataManager = new DataManager({ url: '', adaptor: new UrlAdaptor });
            let state: { data?: string, pvtData?: Object[] } = adaptr.processQuery(dm, dataManagerQuery);
            let data: Object = JSON.parse(state.data);
            return Object.keys(data).length ? data : null;
        } else {
            return this.dataManager.executeQuery(dataManagerQuery);
        }
    }
    /**
     * Deletes the rule or rules based on the rule ID.
     * @returns void.
     */
    public deleteRules(ruleIdColl: string[]): void {
        let i: number; let len: number = ruleIdColl.length; let ruleID: string;
        for (i = 0; i < len; i++) {
            ruleID = this.element.id + '_' + ruleIdColl[i];
            this.deleteRule(document.getElementById(ruleID));
        }
    }
    /**
     * Gets the query for Data Manager.
     * @returns string.
     */
    public getDataManagerQuery(rule: RuleModel): Query {
        let predicate: Predicate = this.getPredicate(rule);
        let query: Query; let fields: string[] = [];
        for (let i: number = 0, len: string[] = Object.keys(this.columns); i < len.length; i++) {
            fields.push(this.columns[i].field);
        }
        if (rule.rules.length) {
            query = new Query().select(fields).where(predicate);
        } else {
            query = new Query().select(fields);
        }
        return query;
    }
    /**   
     * Get the predicate from collection of rules.   
     * @returns null
     */
    public getPredicate(rule: RuleModel): Predicate {
        let ruleColl: RuleModel[] = rule.rules; let pred: Predicate; let pred2: Predicate; let date: Date;
        let ruleValue: string | number | Date; let ignoreCase: boolean = false; let column: ColumnsModel;
        let ignoreOper: string[] = ['notcontains', 'notstartswith', 'notendswith'];
        if (!ruleColl) {
            return pred;
        }
        for (let i: number = 0, len: number = ruleColl.length; i < len; i++) {
            let keys: string[] = Object.keys(ruleColl[i]);
            ignoreCase = false;
            if (keys.indexOf('rules') > -1 && ruleColl[i].rules) {
                pred2 = this.getPredicate(ruleColl[i]);
                if (pred2) {
                    if (pred) {
                        if (rule.condition === 'and') {
                            pred = pred.and(pred2);
                        } else {
                            pred = pred.or(pred2);
                        }
                    } else {
                        pred = pred2;
                    }
                }
            } else if (ruleColl[i].operator.length) {
                let oper: string = ruleColl[i].operator.toLowerCase(); let isDateFilter: boolean = false;
                let dateOperColl: string[] = ['equal', 'notequal', 'greaterthan', 'lessthanorequal'];
                if (ruleColl[i].type === 'string') {
                    ignoreCase = this.matchCase ? false : true;
                }
                if (ruleColl[i].type === 'date' && dateOperColl.indexOf(oper) > -1) {
                    ignoreCase = true;
                }
                column = this.getColumn(ruleColl[i].field);
                if (oper.indexOf('null') > -1 || oper.indexOf('empty') > -1) {
                    ruleColl[i].value = null;
                } else if (ruleColl[i].type === 'date' && !(ruleColl[i].value instanceof Array)) {
                    let format: DateFormatOptions = this.getFormat(column.format);
                    ruleValue = this.getDate(ruleColl[i].value as string, format);
                    if (dateOperColl.indexOf(oper) > -1) {
                        isDateFilter = true;
                    }
                } else {
                    ruleValue = ruleColl[i].value as string | number;
                }
                if (i === 0) {
                    if (isDateFilter || (oper.indexOf('in') > -1 || oper.indexOf('between') > -1 || oper.indexOf('null') > -1 ||
                    oper.indexOf('empty') > -1 ) && oper.indexOf('contains') < 0) {
                        pred = isDateFilter ? this.datePredicate(ruleColl[i], ruleValue as Date) : this.arrayPredicate(ruleColl[i]);
                    } else {
                        let value: string | number | Date = ruleValue as string | number | Date;
                        if (value !== '' && ignoreOper.indexOf(oper) < 0) {
                            pred = new Predicate(ruleColl[i].field, ruleColl[i].operator, ruleValue as string | number | Date, ignoreCase);
                        }
                    }
                } else {
                    if (ignoreOper.indexOf(oper) > -1) {
                        continue;
                    }
                    if (isDateFilter || (oper.indexOf('in') > -1 || oper.indexOf('between') > -1 ||
                    oper.indexOf('null') > -1 || oper.indexOf('empty') > -1 ) && oper.indexOf('contains') < 0) {
                        pred = isDateFilter ? this.datePredicate(ruleColl[i], ruleValue as Date, pred, rule.condition) :
                        this.arrayPredicate(ruleColl[i], pred, rule.condition);
                    } else {
                        if (rule.condition === 'and') {
                            let value: string | number | Date = ruleValue as string | number | Date;
                            if (pred && value !== '') {
                                pred
                                = pred.and(ruleColl[i].field, ruleColl[i].operator, ruleValue as string | number | Date, ignoreCase);
                            } else if (value !== '') {
                                pred = new Predicate(
                                    ruleColl[i].field, ruleColl[i].operator, ruleValue as string | number | Date, ignoreCase);
                                }
                        } else {
                            let value: string | number = ruleValue as string | number;
                            if (pred && value !== '') {
                                pred = pred.or(ruleColl[i].field, ruleColl[i].operator, ruleValue as string | number, ignoreCase);
                            } else if (value !== '') {
                                pred = new Predicate(
                                ruleColl[i].field, ruleColl[i].operator, ruleValue as string | number | Date, ignoreCase);
                            }
                        }
                    }
                }
            }
        }
        return pred;
    }
    private getLocale(): string {
        let gregorianFormat: string = isBlazor() ? '.dates.days.short' : '.dates.calendars.gregorian.days.format.short';
        let localeString: string = this.locale;
        let mainVal: string = isBlazor() ? '' : 'main.';
        let cultureObj: object = getValue(mainVal + '' + this.locale + gregorianFormat, cldrData);
        if (!cultureObj) {
            localeString = 'en';
        }
        return localeString;
    }
    private getColumn(field: string): ColumnsModel {
        if (this.separator.length > 0) {
            field = field.split(this.separator)[0];
        }
        let columns: ColumnsModel[] = this.columns; let column: ColumnsModel;
        for (let i: number = 0, iLen: number = columns.length; i < iLen; i++) {
            if (columns[i].field === field) {
                column = columns[i];
            }
        }
        return column;
    }

    /**
     * return the operator bound to the column.
     * @returns {[key: string]: Object}[].
     */
    public getOperators(field: string): {[key: string]: Object}[] {
        let column: ColumnsModel = this.getColumn(field);
        return column.operators;
    }
    private datePredicate(ruleColl: RuleModel, value: Date, predicate?: Predicate, condition?: string): Predicate {
        let pred: Predicate; let dummyDate: Date = new Date(value.getTime());
        let nextDate: Date = new Date(dummyDate.setDate(dummyDate.getDate() + 1));
        switch (ruleColl.operator) {
            case 'equal':
                pred = new Predicate(ruleColl.field, 'greaterthanorequal', value);
                pred = pred.and(ruleColl.field, 'lessthan', nextDate);
                break;
            case 'notequal':
                pred = new Predicate(ruleColl.field, 'lessthan', value);
                pred = pred.or(ruleColl.field, 'greaterthanorequal', nextDate);
                break;
            case 'greaterthan':
                pred = new Predicate(ruleColl.field, 'greaterthanorequal', nextDate);
                break;
            case 'lessthanorequal':
                pred = new Predicate(ruleColl.field, 'lessthan', nextDate);
                break;
        }
        if (pred) {
            if (predicate) {
                if (condition === 'and') {
                    predicate = predicate.and(pred);
                } else if (condition === 'or') {
                    predicate = predicate.or(pred);
                }
            } else {
                predicate = pred;
            }
        }
        return predicate;
    }
    private arrayPredicate(ruleColl: RuleModel, predicate?: Predicate, condition?: string): Predicate {
        let value: number[] | string[] = ruleColl.value as number[] | string[];
        let operator: string = ruleColl.operator.toString();
        let nullValue: number = ruleColl.value as number; let format: DateFormatOptions;
        let pred: Predicate; let column: ColumnsModel = this.getColumn(ruleColl.field);
        format = this.getFormat(column.format);
        if (operator.indexOf('null') > -1 || operator.indexOf('empty') > -1) {
            switch (operator) {
                case 'isnull':
                    pred = new Predicate(ruleColl.field, 'isnull', nullValue);
                    break;
                case 'isnotnull':
                    pred = new Predicate(ruleColl.field, 'notnull', nullValue);
                    break;
                case 'isempty':
                    pred = new Predicate(ruleColl.field, 'equal', '');
                    break;
                case 'isnotempty':
                    pred = new Predicate(ruleColl.field, 'notequal', '');
                    break;
            }
        }
        if (!(operator.indexOf('null') > -1 || operator.indexOf('empty') > -1)) {
        for (let j: number = 0, jLen: number = value.length; j < jLen; j++) {
            if (value[j] !== '') {
                if (j === 0) {
                    let gte: string = 'greaterthanorequal'; let lt: string = 'lessthan';
                    switch (operator) {
                        case 'between':
                            if (column.type === 'date') {
                                pred = new Predicate(ruleColl.field, gte, value[j] ? this.getDate(value[j] as string, format): null);
                            } else {
                                pred = new Predicate(ruleColl.field, gte, value[j]);
                            }
                            break;
                        case 'notbetween':
                            if (column.type === 'date') {
                                pred = new Predicate(ruleColl.field, lt, value[j] ? this.getDate(value[j] as string, format): null);
                            } else {
                                pred = new Predicate(ruleColl.field, lt, value[j]);
                            }
                            break;
                        case 'in':
                            pred = new Predicate(ruleColl.field, 'equal', value[j]);
                            break;
                        case 'notin':
                            pred = new Predicate(ruleColl.field, 'notequal', value[j]);
                            break;
                    }
                } else {
                    let gt: string = 'greaterthan';
                    switch (ruleColl.operator) {
                        case 'between':
                        if (column.type === 'date') {
                            if (value[j]) {
                                let currDate: Date = this.getDate(value[j] as string, format);
                                let nextDate: Date = new Date(currDate.setDate(currDate.getDate() + 1));
                                pred = pred.and(ruleColl.field, 'lessthan', nextDate);
                            } else {
                                pred = pred.and(ruleColl.field, 'lessthan', value[j]);
                            }
                        } else {
                            pred = pred.and(ruleColl.field, 'lessthanorequal', value[j]);
                        }
                            break;
                        case 'notbetween':
                            if (column.type === 'date') {
                                pred = pred.or(ruleColl.field, gt, value[j] ? this.getDate(value[j] as string, format): value[j]);
                            } else {
                                pred = pred.or(ruleColl.field, 'greaterthan', value[j]);
                            }
                            break;
                        case 'in':
                            pred = pred.or(ruleColl.field, 'equal', value[j]);
                            break;
                        case 'notin':
                            pred = pred.and(ruleColl.field, 'notequal', value[j]);
                            break;
                    }
                }
            }
        }
    }
        if (pred) {
            if (predicate) {
                if (condition === 'and') {
                    predicate = predicate.and(pred);
                } else if (condition === 'or') {
                    predicate = predicate.or(pred);
                }
            } else {
                predicate = pred;
            }
        }
        return predicate;
    }
    private getDate(value: string, format: DateFormatOptions): Date {
        let currDate: Date = this.intl.parseDate(value as string, format);
        if ((value as string).indexOf(':') > -1 && ((value as string).indexOf('/') < 0 || (value as string).indexOf(',') < 0)) {
            currDate.setDate(new Date().getDate());
        }
        return currDate;
    }
    private importRules(rule: RuleModel, parentElem?: Element, isReset?: boolean): Element {
        if (!isReset) {
            parentElem = this.renderGroup(rule.condition, parentElem);
        } else {
            if (rule.rules.length > 1) {
                // enable/disable conditions when rule group is added
                let orElem: HTMLInputElement = parentElem.querySelector('.e-btngroup-or');
                let andElem: HTMLInputElement = parentElem.querySelector('.e-btngroup-and');
                orElem.disabled = false;
                andElem.disabled = false;
                if (rule.condition === 'or') {
                    orElem.checked = true;
                } else {
                    andElem.checked = true;
                }
            } else {
                // enable/disable conditions when rule condition is added
                this.disableRuleCondition(parentElem);
            }
            if (this.enableNotCondition) {
                let tglBtnElem: Element = parentElem.querySelector('.e-qb-toggle');
                if (rule.not) {
                    addClass([tglBtnElem], 'e-active-toggle');
                } else {
                    removeClass([tglBtnElem], 'e-active-toggle');
                }
            }
        }
        let ruleColl: RuleModel[] = rule.rules;
        if (!isNullOrUndefined(ruleColl)) {
            for (let i: number = 0, len: number = ruleColl.length; i < len; i++) {
                let keys: string[] = Object.keys(ruleColl[i]);
                if (!isNullOrUndefined(ruleColl[i].rules) && keys.indexOf('rules') > -1) {
                    parentElem = this.renderGroup(ruleColl[i].condition, parentElem);
                    parentElem = this.importRules(ruleColl[i], parentElem, true);
                } else {
                    this.renderRule(ruleColl[i], parentElem);
                }
            }
        }
        parentElem = closest(parentElem, '.e-rule-list');
        if (parentElem) {
            parentElem = closest(parentElem, '.e-group-container');
        }
        return parentElem;
    }
    private renderGroup(condition: string, parentElem?: Element): Element {
        this.addGroupElement(true, parentElem, condition); //Child group
        let element: NodeListOf<Element> = parentElem.querySelectorAll('.e-group-container');
        return element[element.length - 1];
    }
    private renderRule(rule: RuleModel, parentElem?: Element): void {
        if (parentElem.className.indexOf('e-group-container') > -1) {
            this.addRuleElement(parentElem, rule); //Create rule
        } else {
            this.addRuleElement(parentElem.querySelector('.e-group-container'), rule); //Create group
        }
    }
    private enableReadonly(): void {
        let target: Element = this.element;
        let elem: NodeListOf<Element> =
        target.querySelectorAll('.e-dropdownlist, .e-numerictextbox, .e-textbox, .e-datepicker, .e-multiselect .e-lib, .e-radio');
        for (let i: number = 0; i < elem.length; i++ ) {
            if (elem[i].classList.contains('e-dropdownlist')) {
                let dropDownObj: DropDownList = getInstance(elem[i] as HTMLElement, DropDownList) as DropDownList;
                dropDownObj.readonly = this.isReadonly;
            } else if (elem[i].classList.contains('e-numerictextbox')) {
                let numericTextBoxObj: NumericTextBox = getInstance(elem[i] as HTMLElement, NumericTextBox) as NumericTextBox;
                numericTextBoxObj.readonly = this.isReadonly;
            } else if (elem[i].classList.contains('e-textbox')) {
                let textBoxObj: TextBox = getInstance(elem[i] as HTMLElement, TextBox) as TextBox;
                textBoxObj.readonly = this.isReadonly;
            } else if (elem[i].classList.contains('e-datepicker')) {
                let datePickerObj: DatePicker = getInstance(elem[i] as HTMLElement, DatePicker) as DatePicker;
                datePickerObj.readonly = this.isReadonly;
            } else if (elem[i].classList.contains('e-multiselect')) {
                let multiSelectObj: MultiSelect = getInstance(elem[i] as HTMLElement, MultiSelect) as MultiSelect;
                multiSelectObj.readonly = this.isReadonly;
            } else if (elem[i].classList.contains('e-radio')) {
                let radioButtonObj: RadioButton = getInstance(elem[i] as HTMLElement, RadioButton) as RadioButton;
                if (!radioButtonObj.checked) {
                    if (this.isReadonly) {
                        elem[i].parentElement.style.display = 'none';
                    } else {
                        elem[i].parentElement.style.display = 'inherit';
                    }
                }
            }
        }
        let deleteGroupElems: NodeListOf<Element> = this.element.querySelectorAll('.e-deletegroup');
        let addRuleGroupElems: NodeListOf<Element> = this.element.querySelectorAll('.e-addrulegroup');
        let removeRuleElems: NodeListOf<Element> = this.element.querySelectorAll('.e-removerule');
        if (!this.isReadonly && this.ruleElem.classList.contains('e-readonly')) {
            this.ruleElem.classList.remove('e-readonly');
        }
        let elems: NodeListOf<Element>[] = [deleteGroupElems, addRuleGroupElems, removeRuleElems];
        for (let i: number = 0; i < elems.length; i++) {
            elems[i].forEach((elem: Element) => {
                if (elem.classList.contains('e-readonly')) {
                    elem.classList.remove('e-readonly');
                } else {
                    elem.classList.add('e-readonly');
                }
            });
        }
        this.enableBtnGroup();
    }
    private enableBtnGroup(): void {
        let elems: NodeListOf<Element> = this.element.querySelectorAll('.e-btngroup-and-lbl, .e-btngroup-or-lbl, .e-qb-toggle');
        let not: boolean = false;
        elems.forEach((elem: Element) => {
            if (elem.classList.contains('e-qb-toggle') && !elem.classList.contains('e-active-toggle')
            && !elem.classList.contains('e-readonly')) {
                elem.classList.add('e-readonly');
                not = false;
            } else if (elem.classList.contains('e-qb-toggle') && elem.classList.contains('e-not-readonly')) {
                elem.classList.remove('e-not-readonly');
            } else if (elem.classList.contains('e-qb-toggle') && elem.classList.contains('e-readonly')) {
                elem.classList.remove('e-readonly');
            } else if (elem.classList.contains('e-active-toggle')) {
                elem.classList.add('e-not-readonly');
                not = true;
            } else if ((elem.previousElementSibling as HTMLInputElement).checked || elem.classList.contains('e-readonly')) {
                elem.classList.remove('e-readonly');
                if (not) {
                    if (elem.textContent === 'AND') {
                        elem.classList.add('e-readonly-and');
                    } else {
                        elem.classList.add('e-readonly-or');
                    }
                } else {
                    if (elem.textContent === 'AND' && this.isReadonly) {
                        elem.classList.remove('e-not');
                        elem.classList.add('e-readonly-and');
                    } else {
                        if (this.enableNotCondition) { elem.classList.add('e-not'); }
                        elem.classList.remove('e-readonly-and');
                    }
                    if (elem.textContent === 'OR' && this.isReadonly) {
                        elem.classList.add('e-readonly-or-not');
                    } else {
                        elem.classList.remove('e-readonly-or-not');
                    }
                }
            } else if (elem.classList.contains('e-btn-disable')) {
                // do nothing
            } else {
                elem.classList.add('e-readonly');
            }
        });
    }
    private getSqlString(rules: RuleModel, enableEscape?: boolean, queryStr?: string): string {
        let isRoot: boolean = false;
        if (!queryStr && queryStr !== '') {
            queryStr = '';
            isRoot = true;
        } else {
            queryStr += '(';
        }
        let condition: string = rules.condition;
        if (rules.not) {
            if (isRoot) {
                queryStr += 'NOT (';
            } else {
                queryStr += ' NOT (';
            }
        }
        for (let j: number = 0, jLen: number = rules.rules.length; j < jLen; j++) {
            if (rules.rules[j].rules) {
                queryStr = this.getSqlString(rules.rules[j], enableEscape, queryStr);
            } else {
                let rule: RuleModel = rules.rules[j]; let valueStr: string = '';
                if (rule.value instanceof Array) {
                    if (rule.operator.toString().indexOf('between') > -1) {
                        if (rule.type === 'date') {
                            valueStr += '"' + rule.value[0] + '" AND "' + rule.value[1] + '"';
                        } else {
                            valueStr += rule.value[0] + ' AND ' + rule.value[1];
                        }
                    } else {
                        if (typeof rule.value[0] === 'string' && rule.value !== null) {
                            valueStr += '("' + rule.value[0] + '"';
                            for (let k: number = 1, kLen: number = rule.value.length; k < kLen; k++) {
                                valueStr += ',"' + rule.value[k] + '"';
                            }
                            valueStr += ')';
                        } else {
                            valueStr += '(' + rule.value + ')';
                        }
                    }
                } else {
                    if (rule.operator.toString().indexOf('startswith') > -1) {
                        valueStr += rule.value ? '("' + rule.value + '%")' : '(' + rule.value + ')';
                    } else if (rule.operator.toString().indexOf('endswith') > -1) {
                        valueStr += rule.value ? '("%' + rule.value + '")' : '(' + rule.value + ')';
                    } else if (rule.operator.toString().indexOf('contains') > -1) {
                        valueStr += rule.value ? '("%' + rule.value + '%")' : '(' + rule.value + ')';
                    } else {
                        if (rule.type === 'number' || typeof rule.value === 'boolean' || rule.value === null) {
                            valueStr += rule.value;
                        } else {
                            valueStr += '"' + rule.value + '"';
                        }
                    }
                }
                if (rule.operator.toString().indexOf('null') > -1 || (rule.operator.toString().indexOf('empty') > -1)) {
                    if (enableEscape) {
                        rule.field = '`' + rule.field + '`';
                    }
                    queryStr += rule.field + ' ' + this.operators[rule.operator];
                } else {
                    if (enableEscape) {
                        rule.field = '`' + rule.field + '`';
                    }
                    queryStr += rule.field + ' ' + this.operators[rule.operator] + ' ' + valueStr;
                }
            }
            if (j !== jLen - 1) {
                queryStr += ' ' + condition.toUpperCase() + ' ';
            }
        }
        if (!isRoot) {
            queryStr += ')';
        }
        if (rules.not) {
            queryStr += ')';
        }
        return queryStr;
    }
    /**
     * Sets the rules from the sql query.
     */
    public setRulesFromSql(sqlString: string): void {
        sqlString = sqlString.replace(/`/g, '');
        let ruleModel: RuleModel = this.getRulesFromSql(sqlString);
        this.setRules({ condition: ruleModel.condition, not: ruleModel.not, rules: ruleModel.rules });
    }
    /**
     * Get the rules from SQL query.
     * @returns object.
     */
    public getRulesFromSql(sqlString: string): RuleModel {
        this.parser = [];
        this.sqlParser(sqlString);
        this.rule = { condition: 'and', not: false, rules: [] };
        let rule: RuleModel = this.processParser(this.parser, this.rule, [0]);
        if (this.enableNotCondition) {
            return {condition: rule.condition, not: rule.not, rules: rule.rules};
        } else {
            return {condition: rule.condition, rules: rule.rules};
        }
    }
    /**
     * Gets the sql query from rules.
     * @returns object.
     */
    public getSqlFromRules(rule?: RuleModel, allowEscape?: boolean): string {
        if (!rule) {
            rule = this.getValidRules();
        }
        rule = this.getRuleCollection(rule, false);
        return this.getSqlString(this.getValidRules(rule), allowEscape).replace(/"/g, '\'');
    }
    private sqlParser(sqlString: string): string[][] {
        let st: number = 0;
        let str: string;
        do {
            str = sqlString.slice(st);
            st += this.parseSqlStrings(str);
        } while (str !== '');
        return this.parser;
    }
    private parseSqlStrings(sqlString: string): number {
        let operators: string[] = ['=', '!=', '<=', '>=', '<', '>'];
        let conditions: string[] = ['AND', 'OR', 'NOT'];
        let subOp: string[] = ['IN', 'NOT IN', 'LIKE', 'NOT LIKE', 'BETWEEN', 'NOT BETWEEN', 'IS NULL', 'IS NOT NULL',
        'IS EMPTY', 'IS NOT EMPTY'];
        let regexStr: string; let regex: RegExp; let matchValue: string;
        for (let i: number = 0, iLen: number = operators.length; i < iLen; i++) {
            regexStr = /^\w+$/.test(operators[i]) ? '\\b' : '';
            regex = new RegExp('^(' + operators[i] + ')' + regexStr, 'ig');
            if (regex.exec(sqlString)) {
                this.parser.push(['Operators', operators[i].toLowerCase()]);
                return operators[i].length;
            }
        }
        let lastPasrser: string[] = this.parser[this.parser.length - 1];
        if (!lastPasrser || (lastPasrser && lastPasrser[0] !== 'Literal')) {
            for (let i: number = 0, iLen: number = conditions.length; i < iLen; i++) {
                regexStr = /^\w+$/.test(conditions[i]) ? '\\b' : '';
                regex = new RegExp('^(' + conditions[i] + ')' + regexStr, 'ig');
                if (regex.exec(sqlString)) {
                    this.parser.push(['Conditions', conditions[i].toLowerCase()]);
                    return conditions[i].length;
                }
            }
        }
        for (let i: number = 0, iLen: number = subOp.length; i < iLen; i++) {
            regexStr = /^\w+$/.test(subOp[i]) ? '\\b' : '';
            regex = new RegExp('^(' + subOp[i] + ')' + regexStr, 'ig');
            if (regex.exec(sqlString)) {
                this.parser.push(['SubOperators', subOp[i].toLowerCase()]);
                return subOp[i].length;
            }
        }
        //Left Parenthesis
        if (/^\(/.exec(sqlString)) {
            this.parser.push(['Left', '(']);
            return 1;
        }
        //Right Parenthesis
        if (/^\)/.exec(sqlString)) {
            this.parser.push(['Right', ')']);
            return 1;
        }
        //Boolean
        if (/^(true|false)/.exec(sqlString)) {
            matchValue = /^(true|false)/.exec(sqlString)[0];
            this.parser.push(['String', matchValue]);
            return matchValue.length;
        }
        //Null
        if (/^null/.exec(sqlString)) {
            matchValue = /^null/.exec(sqlString)[0];
            this.parser.push(['String', null]);
            return matchValue.length;
        }
        //Literals
        if (/^`?([a-z_][a-z0-9_.\[\]\(\)]{0,}(\:(number|float|string|date|boolean))?)`?/i.exec(sqlString)) {
            matchValue = /^`?([a-z_][a-z0-9_.\[\]\(\)]{0,}(\:(number|float|string|date|boolean))?)`?/i.exec(sqlString)[1];
            this.parser.push(['Literal', matchValue]);
            return matchValue.length;
        }
        //String
        if (/^'((?:[^\\']+?|\\.|'')*)'(?!')/.exec(sqlString)) {
            matchValue = /^'((?:[^\\']+?|\\.|'')*)'(?!')/.exec(sqlString)[0];
            this.parser.push(['String', matchValue]);
            return matchValue.length;
        }
        //Double String
        if (/^"([^\\"]*(?:\\.[^\\"]*)*)"/.exec(sqlString)) {
            matchValue = /^"([^\\"]*(?:\\.[^\\"]*)*)"/.exec(sqlString)[0];
            this.parser.push(['DoubleString', matchValue]);
            return matchValue.length;
        }
        //Number
        if (/^[0-9]+(\.[0-9]+)?/.exec(sqlString)) {
            matchValue = /^[0-9]+(\.[0-9]+)?/.exec(sqlString)[0];
            this.parser.push(['Number', matchValue]);
            return matchValue.length;
        }
        //Negative Number
        if (/^-?[0-9]+(\.[0-9]+)?/.exec(sqlString)) {
            matchValue = /^-?[0-9]+(\.[0-9]+)?/.exec(sqlString)[0];
            this.parser.push(['Number', matchValue]);
            return matchValue.length;
        }
        return 1;
    }
    private getOperator(value: string, operator: string): string {
        let operators: object = {
            '=': 'equal', '!=': 'notequal', '<': 'lessthan', '>': 'greaterthan', '<=': 'lessthanorequal',
            '>=': 'greaterthanorequal', 'in': 'in', 'not in': 'notin', 'between': 'between', 'not between': 'notbetween',
            'is empty': 'isempty', 'is null': 'isnull', 'is not null': 'isnotnull', 'is not empty': 'isnotempty'
        };
        if (value) {
            if (value.indexOf('%') === 0 && value[value.length - 1] === '%') {
                return (operator === 'not like') ? 'notcontains' : 'contains';
            } else if (value.indexOf('%') !== 0 && value.indexOf('%') === value.length - 1) {
                return (operator === 'not like') ? 'notstartswith' : 'startswith';
            } else if (value.indexOf('%') === 0 && value.indexOf('%') !== value.length - 1) {
                return (operator === 'not like') ? 'notendswith' : 'endswith';
            }
        } else {
            if (operator === 'not like') {
                return 'notequal';
            } else if (operator === 'like') {
                return 'equal';
            }
        }
        return operators[operator];
    }

    private getTypeFromColumn(rules: RuleModel): string {
        let columnData: ColumnsModel[] = this.columns;
        for ( let i: number = 0; i < columnData.length; i++ ) {
            if (columnData[i].field === rules.field) {
                rules.type = columnData[i].type;
                break;
            }
        }
        return rules.type;
    }

    private processParser(parser: string[][], rules: RuleModel, levelColl: number[]): RuleModel {
        let j: number; let jLen: number; let rule: RuleModel; let subRules: RuleModel; let numVal: number[] = []; let strVal: string[] = [];
        let k: number; let kLen: number; let l: number; let lLen: number; let grpCount: number; let operator: string;
        for (let i: number = 0, iLen: number = parser.length; i < iLen; i++) {
            if (parser[i][0] === 'Literal') {
                rule = { label: parser[i][1], field: parser[i][1] };
                if (parser[i + 1][0] === 'SubOperators') {
                    if (parser[i + 1][1].indexOf('null') > -1 || parser[i + 1][1].indexOf('empty') > -1) {
                        rule.operator = this.getOperator(' ', parser[i + 1][1]);
                        rule.value = null; rule.type = this.getTypeFromColumn(rule);
                    } else {
                        let oper: string = parser[i + 3][1] ? parser[i + 3][1].replace(/'/g, '') : parser[i + 3][1];
                        rule.operator = this.getOperator(oper, parser[i + 1][1]); }
                    operator = parser[i + 1][1]; i++; j = i + 1; jLen = iLen;
                    for (j = i + 1; j < jLen; j++) {
                        if (parser[j][0] === 'Right') {
                            i = j;
                            break;
                        } else {
                            if (operator.indexOf('null') > -1 || operator.indexOf('empty') > -1) {
                                break;
                            }
                            if (operator.indexOf('like') > -1 && parser[j][0] === 'String') {
                                let val: string = parser[j][1] ? parser[j][1].replace(/'/g, '').replace(/%/g, ''): parser[j][1];
                                rule.value = val; rule.type = 'string';
                            } else if (operator.indexOf('between') > -1) {
                                if (parser[j][0] === 'Literal' || parser[j][0] === 'Left') {
                                    break;
                                }
                                if (parser[j][0] === 'Number') {
                                    numVal.push(Number(parser[j][1]));
                                } else if (parser[j][0] === 'String') {
                                    strVal.push(parser[j][1].replace(/'/g, ''));
                                }
                            } else {
                                if (parser[j][0] === 'Number') {
                                    numVal.push(Number(parser[j][1]));
                                } else if (parser[j][0] === 'String') {
                                    strVal.push(parser[j][1].replace(/'/g, ''));
                                }
                            }
                            rule.type = this.getTypeFromColumn(rule);
                        }
                    }
                    if (operator.indexOf('like') < 0) {
                        if (parser[j - 1][0] === 'Number') {
                            rule.value = numVal; rule.type = 'number';
                        } else if (parser[j - 1][0] === 'String') {
                            rule.value = strVal; rule.type = 'string';
                        } else if (operator.indexOf('between') > -1 && parser[j - 1][0] === 'Conditions') {
                            rule.value = numVal; rule.type = 'number';
                        }
                        numVal = []; strVal = []; rule.type = this.getTypeFromColumn(rule);
                    }
                } else if (parser[i + 1][0] === 'Operators') {
                    rule.operator = this.getOperator(parser[i + 2][1], parser[i + 1][1]);
                    if (parser[i + 2][0] === 'Number') {
                        rule.type = 'number'; rule.value = Number(parser[i + 2][1]);
                    } else {
                        rule.type = 'string'; rule.value = parser[i + 2][1] ? parser[i + 2][1].replace(/'/g, ''): parser[i + 2][1];
                    }
                    rule.type = this.getTypeFromColumn(rule);
                }
                rules.rules.push(rule);
            } else if (parser[i][0] === 'Left') {
                if (!(parser[0][0] === 'Left') && parser[i - 1][1] === 'not') { continue; }
                this.parser = parser.splice(i + 1, iLen - (i + 1));
                if (this.enableNotCondition) {
                    subRules = { condition: 'and', rules: [], not: false };
                } else {
                    subRules = { condition: 'and', rules: [] };
                }
                grpCount = 0; kLen = rules.rules.length;
                for (k = 0; k < kLen; k++) {   //To get the group position
                    if (rules.rules[k].rules) {
                        grpCount++;
                    }
                }
                levelColl.push(grpCount); rules.rules.push(subRules); subRules = this.processParser(this.parser, subRules, levelColl);
                return rules;
            } else if (parser[i][0] === 'Conditions') {
                if (parser[i][1] === 'not') {
                    rules.not = true;
                } else {
                    rules.condition = parser[i][1];
                }
            } else if (parser[i][0] === 'Right') {
                this.parser = parser.splice(i + 1, iLen - (i + 1));
                levelColl.pop();   //To get the parent Group
                rules = this.rule; lLen = levelColl.length;
                for (l = 0; l < lLen; l++) {
                    rules = this.findGroupByIdx(levelColl[l], rules, l === 0);
                }
                return this.processParser(this.parser, rules, levelColl);
            }
        }
        return rules;
    }
}

class LevelColl {
    public groupElement: Element;
    public level: number[];
}

export interface Level {
    [key: string]: number[];
}
/**
 * Creates the custom component of Query Builder
 */
export interface TemplateColumn {
    /**
     * Creates the custom component.
     * @default null
     */
    create?: Element | Function | string;
    /**
     * Wire events for the custom component.
     * @default null
     */
    write?: void | Function | string;
    /**
     * Destroy the custom component.
     * @default null
     */
    destroy?: Function | string;
}
/**
 * Defines the validation of Query Builder.
 */
export interface Validation {
    /**
     * Specifies the minimum value in textbox validation.
     * @default 2
     */
    min?: number;
    /**
     * Specifies the maximum value in textbox validation.
     * @default 10
     */
    max?: number;
    /**
     * Specifies whether the value is required or not
     * @default true
     */
    isRequired: boolean;
}

/**
 * Interface for change event.
 */
export interface ChangeEventArgs extends BaseEventArgs {
    groupID: string;
    ruleID?: string;
    childGroupID?: string;
    value?: string | number | Date | boolean | string[];
    selectedIndex?: number;
    selectedField?: string;
    cancel?: boolean;
    type?: string;
    not?: boolean;
}
/**
 * Interface for rule change event arguments.
 */
export interface RuleChangeEventArgs extends BaseEventArgs {
    previousRule?: RuleModel;
    rule: RuleModel;
    type?: string;
}
/**
 * Interface for action begin and action complete event args
 */
export interface ActionEventArgs extends BaseEventArgs {
    ruleID: string;
    requestType?: string;
    action?: string;
    rule?: RuleModel;
    fields?: Object;
    columns?: ColumnsModel[];
    operators?: { [key: string]: Object }[];
    operatorFields?: Object;
    field?: string;
    operator?: string;
}
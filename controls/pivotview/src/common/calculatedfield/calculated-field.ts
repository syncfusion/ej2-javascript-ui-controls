import { Dialog, OffsetPosition, BeforeOpenEventArgs, Tooltip, ButtonPropsModel } from '@syncfusion/ej2-popups';
import { Droppable, createElement, extend, remove, addClass, closest, getInstance } from '@syncfusion/ej2-base';
import { prepend, append, KeyboardEvents, KeyboardEventArgs, removeClass } from '@syncfusion/ej2-base';
import { IDataOptions, IFieldOptions, ICalculatedFields } from '../../base/engine';
import { PivotView } from '../../pivotview/base/pivotview';
import { Button, RadioButton, CheckBox, ChangeArgs } from '@syncfusion/ej2-buttons';
import { MaskedTextBox } from '@syncfusion/ej2-inputs';
import * as cls from '../../common/base/css-constant';
import {
    TreeView, DragAndDropEventArgs, NodeExpandEventArgs, BeforeOpenCloseMenuEventArgs,
    NodeClickEventArgs, MenuEventArgs, DrawNodeEventArgs, ExpandEventArgs, NodeSelectEventArgs
} from '@syncfusion/ej2-navigations';
import { ContextMenu as Menu, MenuItemModel, ContextMenuModel } from '@syncfusion/ej2-navigations';
import { IAction } from '../../common/base/interface';
import * as events from '../../common/base/constant';
import { PivotFieldList } from '../../pivotfieldlist/base/field-list';
import { Tab, Accordion, AccordionItemModel } from '@syncfusion/ej2-navigations';
import { DropDownList, ChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import { PivotUtil } from '../../base/util';
import { IOlapField, OlapEngine } from '../../base/olap/engine';

/**
 * Module to render Calculated Field Dialog
 */

const COUNT: string = 'Count';
const AVG: string = 'Avg';
const MIN: string = 'Min';
const MAX: string = 'Max';
const SUM: string = 'Sum';
const DISTINCTCOUNT: string = 'DistinctCount';
const PRODUCT: string = 'Product';
const STDEV: string = 'SampleStDev';
const STDEVP: string = 'PopulationStDev';
const VAR: string = 'SampleVar';
const VARP: string = 'PopulationVar';
const CALC: string = 'CalculatedField';
const AGRTYPE: string = 'AggregateType';

/** @hidden */
export class CalculatedField implements IAction {
    public parent: PivotView | PivotFieldList;
    /** @hidden */
    public isFormula: boolean = false;

    /**
     * Internal variables.
     */
    private dialog: Dialog;
    private treeObj: TreeView;
    private inputObj: MaskedTextBox;
    private droppable: Droppable;
    private menuObj: Menu;
    private newFields: ICalculatedFields[];
    private curMenu: Element;
    private isFieldExist: boolean;
    private parentID: string;
    private existingReport: IDataOptions;
    private formulaText: string;
    private fieldText: string;
    private keyboardEvents: KeyboardEvents;
    private isEdit: boolean;
    private currentFieldName: string;
    private confirmPopUp: Dialog;
    private field: string;

    /** Constructor for calculatedfield module */
    constructor(parent: PivotView | PivotFieldList) {
        this.parent = parent;
        this.existingReport = null;
        this.parent.calculatedFieldModule = this;
        this.removeEventListener();
        this.addEventListener();
        this.parentID = this.parent.element.id;
        this.dialog = null;
        this.inputObj = null;
        this.treeObj = null;
        this.droppable = null;
        this.menuObj = null;
        this.newFields = null;
        this.isFieldExist = true;
        this.formulaText = null;
        this.fieldText = null;
        this.isEdit = false;
        this.currentFieldName = null;
        this.confirmPopUp = null;
    }

    /**
     * To get module name.
     * @returns string
     */
    protected getModuleName(): string {
        return 'calculatedfield';
    }

    private keyActionHandler(e: KeyboardEventArgs): void {
        let node: HTMLElement = (e.currentTarget as HTMLElement).querySelector('.e-hover.e-node-focus') as HTMLElement;
        if (node) {
            switch (e.action) {
                case 'moveRight':
                    if (this.parent.dataType === 'pivot') {
                        this.displayMenu(node.previousSibling as HTMLElement);
                    }
                    break;
                case 'enter':
                    let field: string = node.getAttribute('data-field');
                    let type: string = node.getAttribute('data-type');
                    let dropField: HTMLTextAreaElement =
                        this.dialog.element.querySelector('#' + this.parentID + 'droppable') as HTMLTextAreaElement;
                    if (this.parent.dataType === 'pivot') {
                        if (dropField.value === '') {
                            if (type === CALC) {
                                dropField.value = node.getAttribute('data-uid');
                            } else {
                                dropField.value = '"' + type + '(' + field + ')' + '"';
                            }
                        } else if (dropField.value !== '') {
                            if (type === CALC) {
                                dropField.value = dropField.value + node.getAttribute('data-uid');
                            } else {
                                dropField.value = dropField.value + '"' + type + '(' + field + ')' + '"';
                            }
                        }
                    } else {
                        if (this.parent.olapEngineModule && this.parent.olapEngineModule.fieldList[field] &&
                            this.parent.olapEngineModule.fieldList[field].isCalculatedField) {
                            field = this.parent.olapEngineModule.fieldList[field].tag;
                        }
                        if (dropField.value === '') {
                            dropField.value = field;
                        } else if (dropField.value !== '') {
                            dropField.value = dropField.value + field;
                        }
                    }
                    break;
            }
        }
    }

    /**
     * Trigger while click treeview icon.
     * @param  {MouseEvent} e
     * @returns void
     */
    private fieldClickHandler(e: NodeClickEventArgs): void {
        let node: HTMLElement = (e.event.target as HTMLElement).parentElement;
        if ((e.event.target as HTMLElement).classList.contains(cls.FORMAT) ||
            (e.event.target as HTMLElement).classList.contains(cls.CALC_EDIT) ||
            (e.event.target as HTMLElement).classList.contains(cls.CALC_EDITED)) {
            this.displayMenu(node.parentElement);
        }
    }

    private clearFormula(): void {
        if (this.treeObj && this.treeObj.element.querySelector('li')) {
            removeClass(this.treeObj.element.querySelectorAll('li'), 'e-active');
            this.displayMenu(this.treeObj.element.querySelector('li'));
        }
    }

    /**
     * To display context menu.
     * @param  {HTMLElement} node
     * @returns void
     */
    private displayMenu(node: HTMLElement): void {
        if (this.parent.dataType === 'pivot' && document.querySelector('.' + this.parentID + 'calculatedmenu') !== null &&
            node.querySelector('.e-list-icon').classList.contains(cls.ICON) &&
            !node.querySelector('.e-list-icon').classList.contains(cls.CALC_EDITED) &&
            !node.querySelector('.e-list-icon').classList.contains(cls.CALC_EDIT) && node.tagName === 'LI') {
            this.menuObj.close();
            this.curMenu = (node.querySelector('.' + cls.LIST_TEXT_CLASS) as HTMLElement);
            this.openContextMenu();
        } else if (node.tagName === 'LI' && (node.querySelector('.e-list-icon').classList.contains(cls.CALC_EDIT) ||
            (this.parent.dataType === 'olap' && node.getAttribute('data-type') === CALC && node.classList.contains('e-active')))) {
            this.isEdit = true;
            let fieldName: string = node.getAttribute('data-field');
            let caption: string = node.getAttribute('data-caption');
            this.currentFieldName = fieldName;
            this.inputObj.value = caption;
            this.inputObj.dataBind();
            if (this.parent.dataType === 'olap') {
                let memberType: string = node.getAttribute('data-membertype');
                let parentHierarchy: string = node.getAttribute('data-hierarchy');
                let expression: string = node.getAttribute('data-formula');
                let formatString: string = node.getAttribute('data-formatString');
                let customString: string = node.getAttribute('data-customString');
                let dialogElement: HTMLElement = this.dialog.element;
                /* tslint:disable */
                let fieldTitle: HTMLElement = dialogElement.querySelector('#' + this.parentID + '_' + 'FieldNameTitle');
                let customFormat: MaskedTextBox = getInstance(dialogElement.querySelector('#' + this.parentID + 'Custom_Format_Element') as HTMLElement, MaskedTextBox) as MaskedTextBox;
                let memberTypeDrop: DropDownList = getInstance(dialogElement.querySelector('#' + this.parentID + 'Member_Type_Div') as HTMLElement, DropDownList) as DropDownList;
                let hierarchyDrop: DropDownList = getInstance(dialogElement.querySelector('#' + this.parentID + 'Hierarchy_List_Div') as HTMLElement, DropDownList) as DropDownList;
                let formatDrop: DropDownList = getInstance(dialogElement.querySelector('#' + this.parentID + 'Format_Div') as HTMLElement, DropDownList) as DropDownList;
                /* tslint:enable */
                fieldTitle.innerHTML = this.parent.localeObj.getConstant('caption');
                (document.querySelector('#' + this.parentID + 'droppable') as HTMLTextAreaElement).value = expression;
                memberTypeDrop.readonly = true;
                memberTypeDrop.value = memberType;
                memberTypeDrop.dataBind();
                if (memberType === 'Dimension') {
                    hierarchyDrop.value = parentHierarchy;
                }
                if (formatString !== '') {
                    formatDrop.value = formatString;
                    formatDrop.dataBind();
                }
                customFormat.value = customString;
                customFormat.dataBind();
            } else {
                addClass([node.querySelector('.e-list-icon')], cls.CALC_EDITED);
                removeClass([node.querySelector('.e-list-icon')], cls.CALC_EDIT);
                node.querySelector('.' + cls.CALC_EDITED).setAttribute('title', this.parent.localeObj.getConstant('clear'));
                (document.querySelector('#' + this.parentID + 'droppable') as HTMLTextAreaElement).value = node.getAttribute('data-uid');
            }
        } else if (node.tagName === 'LI' && (node.querySelector('.e-list-icon').classList.contains(cls.CALC_EDITED) ||
            (this.parent.dataType === 'olap' && !node.classList.contains('e-active')))) {
            this.isEdit = false;
            this.inputObj.value = '';
            this.inputObj.dataBind();
            if (this.parent.dataType === 'olap') {
                let dialogElement: HTMLElement = this.dialog.element;
                /* tslint:disable */
                let hierarchyDrop: DropDownList = getInstance(dialogElement.querySelector('#' + this.parentID + 'Hierarchy_List_Div') as HTMLElement, DropDownList) as DropDownList;
                let formatDrop: DropDownList = getInstance(dialogElement.querySelector('#' + this.parentID + 'Format_Div') as HTMLElement, DropDownList) as DropDownList;
                let customFormat: MaskedTextBox = getInstance(dialogElement.querySelector('#' + this.parentID + 'Custom_Format_Element') as HTMLElement, MaskedTextBox) as MaskedTextBox;
                let memberTypeDrop: DropDownList = getInstance(dialogElement.querySelector('#' + this.parentID + 'Member_Type_Div') as HTMLElement, DropDownList) as DropDownList;
                let fieldTitle: HTMLElement = dialogElement.querySelector('#' + this.parentID + '_' + 'FieldNameTitle');
                /* tslint:enable */
                fieldTitle.innerHTML = this.parent.localeObj.getConstant('fieldTitle');
                hierarchyDrop.index = 0;
                hierarchyDrop.dataBind();
                formatDrop.index = 0;
                formatDrop.dataBind();
                customFormat.value = '';
                customFormat.dataBind();
                memberTypeDrop.index = 0;
                memberTypeDrop.readonly = false;
                memberTypeDrop.dataBind();
            } else {
                addClass([node.querySelector('.e-list-icon')], cls.CALC_EDIT);
                removeClass([node.querySelector('.e-list-icon')], cls.CALC_EDITED);
                node.querySelector('.' + cls.CALC_EDIT).setAttribute('title', this.parent.localeObj.getConstant('edit'));
            }
            (document.querySelector('#' + this.parentID + 'droppable') as HTMLTextAreaElement).value = '';
        }
    }

    /**
     * To set position for context menu.
     * @returns void
     */
    private openContextMenu(): void {
        let pos: OffsetPosition = this.curMenu.getBoundingClientRect();
        if (this.parent.enableRtl) {
            this.menuObj.open(pos.top + 30, pos.left - 100);
        } else {
            this.menuObj.open(pos.top + 30, pos.left + 150);
        }
    }

    /**
     * Triggers while select menu.
     * @param  {MenuEventArgs} menu
     * @returns void
     */
    private selectContextMenu(menu: MenuEventArgs): void {
        if (menu.element.textContent !== null) {
            let field: string = closest(this.curMenu, '.e-list-item').getAttribute('data-caption');
            closest(this.curMenu, '.e-list-item').setAttribute('data-type', menu.element.id.split(this.parent.element.id + '_')[1]);
            this.curMenu.textContent = field + ' (' + menu.element.id.split(this.parent.element.id + '_')[1] + ')';
            addClass([this.curMenu.parentElement.parentElement], ['e-node-focus', 'e-hover']);
            this.curMenu.parentElement.parentElement.setAttribute('tabindex', '-1');
            this.curMenu.parentElement.parentElement.focus();
        }
    }

    /**
     * To create context menu.
     * @returns void
     */
    private createMenu(): void {
        let menuItems: MenuItemModel[] = [
            { id: this.parent.element.id + '_Sum', text: this.parent.localeObj.getConstant('Sum') },
            { id: this.parent.element.id + '_Count', text: this.parent.localeObj.getConstant('Count') },
            { id: this.parent.element.id + '_DistinctCount', text: this.parent.localeObj.getConstant('DistinctCount') },
            { id: this.parent.element.id + '_Avg', text: this.parent.localeObj.getConstant('Avg') },
            { id: this.parent.element.id + '_Min', text: this.parent.localeObj.getConstant('Min') },
            { id: this.parent.element.id + '_Max', text: this.parent.localeObj.getConstant('Max') },
            { id: this.parent.element.id + '_Product', text: this.parent.localeObj.getConstant('Product') },
            { id: this.parent.element.id + '_SampleStDev', text: this.parent.localeObj.getConstant('SampleStDev') },
            { id: this.parent.element.id + '_SampleVar', text: this.parent.localeObj.getConstant('SampleVar') },
            { id: this.parent.element.id + '_PopulationStDev', text: this.parent.localeObj.getConstant('PopulationStDev') },
            { id: this.parent.element.id + '_PopulationVar', text: this.parent.localeObj.getConstant('PopulationVar') }];
        let menuOptions: ContextMenuModel = {
            cssClass: this.parentID + 'calculatedmenu',
            items: menuItems,
            enableRtl: this.parent.enableRtl,
            beforeOpen: this.beforeMenuOpen.bind(this),
            select: this.selectContextMenu.bind(this)
        };
        let contextMenu: HTMLElement = createElement('ul', {
            id: this.parentID + 'contextmenu'
        });
        this.parent.element.appendChild(contextMenu);
        this.menuObj = new Menu(menuOptions);
        this.menuObj.isStringTemplate = true;
        this.menuObj.appendTo(contextMenu);
    }

    /* tslint:disable */
    /**
     * Triggers while click OK button.
     * @returns void
     */
    private applyFormula(): void {
        let currentObj: CalculatedField = this;
        let isExist: boolean = false;
        removeClass([document.getElementById(this.parentID + 'ddlelement')], cls.EMPTY_FIELD);
        if (currentObj.parent.dataType === 'olap') {
            let field: string = currentObj.inputObj.value;
            if (currentObj.parent.olapEngineModule.fieldList[field] &&
                currentObj.parent.olapEngineModule.fieldList[field].type !== 'CalculatedField') {
                isExist = true;
            }
        } else {
            Object.keys(currentObj.parent.engineModule.fieldList).forEach((key: string, index: number) => {
                if (currentObj.inputObj.value && currentObj.inputObj.value === key &&
                    currentObj.parent.engineModule.fieldList[key].aggregateType !== 'CalculatedField') {
                    isExist = true;
                }
            });
        }
        if (isExist) {
            currentObj.parent.pivotCommon.errorDialog.createErrorDialog(
                currentObj.parent.localeObj.getConstant('error'), currentObj.parent.localeObj.getConstant('fieldExist'));
            return;
        }
        this.newFields =
            extend([], (this.parent.dataSourceSettings as IDataOptions).calculatedFieldSettings, null, true) as ICalculatedFields[];
        this.existingReport = extend({}, this.parent.dataSourceSettings, null, true) as IDataOptions;
        let report: IDataOptions = this.parent.dataSourceSettings as IDataOptions;
        let dropField: HTMLTextAreaElement = document.querySelector('#' + this.parentID + 'droppable') as HTMLTextAreaElement;
        if (this.inputObj.value !== null && this.inputObj.value !== '' && dropField.value !== '') {
            let field: ICalculatedFields;
            if (this.parent.dataType === 'olap') {
                let dialogElement: HTMLElement = this.parent.isAdaptive ? (this.parent as PivotFieldList).dialogRenderer.adaptiveElement.element : this.dialog.element;
                let memberTypeDrop: DropDownList = getInstance(dialogElement.querySelector('#' + this.parentID + 'Member_Type_Div') as HTMLElement, DropDownList) as DropDownList;
                let customFormat: MaskedTextBox = getInstance(dialogElement.querySelector('#' + this.parentID + 'Custom_Format_Element') as HTMLElement, MaskedTextBox) as MaskedTextBox;
                let hierarchyDrop: DropDownList = getInstance(dialogElement.querySelector('#' + this.parentID + 'Hierarchy_List_Div') as HTMLElement, DropDownList) as DropDownList;
                let formatDrop: DropDownList = getInstance(dialogElement.querySelector('#' + this.parentID + 'Format_Div') as HTMLElement, DropDownList) as DropDownList;
                field = {
                    name: this.inputObj.value,
                    formula: dropField.value,
                    formatString: (formatDrop.value === 'Custom' ? customFormat.value : formatDrop.value as string)
                };
                if (memberTypeDrop.value === 'Dimension') {
                    field.hierarchyUniqueName = hierarchyDrop.value as string;
                }
                this.isFieldExist = false;
                if (!this.isEdit) {
                    for (let i: number = 0; i < report.calculatedFieldSettings.length; i++) {
                        if (report.calculatedFieldSettings[i].name === field.name) {
                            this.createConfirmDialog(
                                currentObj.parent.localeObj.getConstant('alert'),
                                currentObj.parent.localeObj.getConstant('confirmText'));
                            return;
                        }
                    }
                } else {
                    for (let i: number = 0; i < report.calculatedFieldSettings.length; i++) {
                        if (report.calculatedFieldSettings[i].name === this.currentFieldName && this.isEdit) {
                            if (memberTypeDrop.value === 'Dimension') {
                                report.calculatedFieldSettings[i].hierarchyUniqueName = field.hierarchyUniqueName;
                            }
                            this.parent.olapEngineModule.fieldList[this.currentFieldName].caption = this.inputObj.value;
                            report.calculatedFieldSettings[i].formatString = field.formatString;
                            report.calculatedFieldSettings[i].formula = field.formula;
                            field = report.calculatedFieldSettings[i];
                            this.isFieldExist = true;
                            break;
                        }
                    }
                    let axisFields: IFieldOptions[][] = [report.rows, report.columns, report.values, report.filters];
                    let isFieldExist: boolean = false;
                    for (let fields of axisFields) {
                        for (let item of fields) {
                            if (item.isCalculatedField && this.currentFieldName !== null &&
                                item.name === this.currentFieldName && this.isEdit) {
                                item.caption = this.inputObj.value;
                                this.isFieldExist = true;
                                isFieldExist = true;
                                break;
                            }
                        }
                        if (isFieldExist) {
                            break;
                        }
                    }
                }
                if (!this.isFieldExist) {
                    report.calculatedFieldSettings.push(field);
                }
                this.parent.lastCalcFieldInfo = field;
            } else {
                field = {
                    name: this.inputObj.value,
                    type: 'CalculatedField'
                } as IFieldOptions;
                let cField: ICalculatedFields = {
                    name: this.inputObj.value,
                    formula: dropField.value
                };
                this.isFieldExist = true;
                if (!this.isEdit) {
                    for (let i: number = 0; i < report.values.length; i++) {
                        if (report.values[i].type === CALC && report.values[i].name === field.name) {
                            for (let j: number = 0; j < report.calculatedFieldSettings.length; j++) {
                                if (report.calculatedFieldSettings[j].name === field.name) {
                                    this.createConfirmDialog(
                                        currentObj.parent.localeObj.getConstant('alert'),
                                        currentObj.parent.localeObj.getConstant('confirmText'));
                                    return;
                                }
                            }
                            this.isFieldExist = false;
                        }
                    }
                } else {
                    for (let i: number = 0; i < report.values.length; i++) {
                        if (report.values[i].type === CALC && this.currentFieldName !== null &&
                            report.values[i].name === this.currentFieldName && this.isEdit) {
                            for (let j: number = 0; j < report.calculatedFieldSettings.length; j++) {
                                if (report.calculatedFieldSettings[j].name === this.currentFieldName) {
                                    report.values[i].caption = this.inputObj.value;
                                    report.calculatedFieldSettings[j].formula = dropField.value;
                                    this.parent.engineModule.fieldList[this.currentFieldName].caption = this.inputObj.value;
                                    this.isFieldExist = false;
                                }
                            }
                        }
                    }
                }
                if (this.isFieldExist) {
                    report.values.push(field);
                    report.calculatedFieldSettings.push(cField);
                }
                this.parent.lastCalcFieldInfo = cField;
            }
            this.addFormula(report, field.name);
        } else {
            if (this.inputObj.value === null || this.inputObj.value === '') {
                addClass([document.getElementById(this.parentID + 'ddlelement')], cls.EMPTY_FIELD);
                document.getElementById(this.parentID + 'ddlelement').focus();
            } else {
                this.parent.pivotCommon.errorDialog.createErrorDialog(
                    this.parent.localeObj.getConstant('error'), this.parent.localeObj.getConstant('invalidFormula'));
            }
        }
    }
    /* tslint:enable */

    private addFormula(report: IDataOptions, field: string): void {
        this.isFormula = true;
        this.field = field;
        this.parent.setProperties({ dataSourceSettings: report }, true);
        if (this.parent.getModuleName() === 'pivotfieldlist' && this.parent.allowDeferLayoutUpdate) {
            (this.parent as PivotFieldList).isRequiredUpdate = false;
        }
        try {
            this.parent.updateDataSource(false);
            let thisObj: CalculatedField = this;
            //setTimeout(() => {
            thisObj.isEdit = false;
            if (thisObj.dialog) {
                thisObj.dialog.close();
            } else {
                thisObj.inputObj.value = '';
                thisObj.formulaText = null;
                thisObj.fieldText = null;
                ((thisObj.parent as PivotFieldList).
                    dialogRenderer.parentElement.querySelector('.' + cls.CALCINPUT) as HTMLInputElement).value = '';
                ((thisObj.parent as PivotFieldList).
                    dialogRenderer.parentElement.querySelector('#' + thisObj.parentID + 'droppable') as HTMLTextAreaElement).value = '';
            }
            //});
        } catch (exception) {
            this.showError();
        }
    }

    /** @hidden */
    public showError(): void {
        if (this.parent.engineModule.fieldList[this.field]) {
            delete this.parent.engineModule.fieldList[this.field];
        }
        this.parent.pivotCommon.errorDialog.createErrorDialog(
            this.parent.localeObj.getConstant('error'), this.parent.localeObj.getConstant('invalidFormula'));
        this.parent.setProperties({ dataSourceSettings: this.existingReport }, true);
        this.parent.lastCalcFieldInfo = {};
        this.parent.updateDataSource(false);
        this.isFormula = false;
    }

    /**
     * To get treeview data
     * @param  {PivotGrid|PivotFieldList} parent
     * @returns Object
     */
    private getFieldListData(parent: PivotView | PivotFieldList): { [key: string]: Object }[] {
        let fields: { [key: string]: Object }[] = [];
        if (this.parent.dataType === 'olap') {
            fields = PivotUtil.getClonedData(parent.olapEngineModule.fieldListData as { [key: string]: Object }[]);
            for (let item of fields as IOlapField[]) {
                if (item.spriteCssClass &&
                    (item.spriteCssClass.indexOf('e-attributeCDB-icon') > -1 ||
                        item.spriteCssClass.indexOf('e-level-members') > -1)) {
                    item.hasChildren = true;
                } else if (item.spriteCssClass &&
                    (item.spriteCssClass.indexOf('e-namedSetCDB-icon') > -1)) {
                    item.hasChildren = false;
                }
            }
        } else {
            Object.keys(parent.engineModule.fieldList).forEach((key: string) => {
                let type: string = null;
                if (parent.engineModule.fieldList[key].type === 'string' || parent.engineModule.fieldList[key].type === 'include' ||
                    parent.engineModule.fieldList[key].type === 'exclude') {
                    type = COUNT;
                } else {
                    type = parent.engineModule.fieldList[key].aggregateType !== undefined ?
                        parent.engineModule.fieldList[key].aggregateType : SUM;
                }
                fields.push({
                    index: parent.engineModule.fieldList[key].index,
                    name: parent.engineModule.fieldList[key].caption + ' (' + type + ')',
                    type: type,
                    icon: cls.FORMAT + ' ' + cls.ICON,
                    formula: parent.engineModule.fieldList[key].formula,
                    field: key,
                    caption: parent.engineModule.fieldList[key].caption ? parent.engineModule.fieldList[key].caption : key
                });
            });
        }
        return fields;
    }

    /**
     * Triggers before menu opens.
     * @param  {BeforeOpenCloseMenuEventArgs} args
     * @returns void
     */
    private beforeMenuOpen(args: BeforeOpenCloseMenuEventArgs): void {
        args.element.style.zIndex = (this.dialog.zIndex + 1).toString();
        args.element.style.display = 'inline';
    }

    /**
     * Trigger while drop node in formula field.
     * @param  {DragAndDropEventArgs} args
     * @returns void
     */
    private fieldDropped(args: DragAndDropEventArgs): void {
        args.cancel = true;
        let dropField: HTMLTextAreaElement = this.dialog.element.querySelector('#' + this.parentID + 'droppable') as HTMLTextAreaElement;
        removeClass([dropField], 'e-copy-drop');
        removeClass([args.draggedNode.querySelector('.' + cls.LIST_TEXT_CLASS)], cls.SELECTED_NODE_CLASS);
        let field: string = args.draggedNode.getAttribute('data-field');
        if (this.parent.dataType === 'olap') {
            if (this.parent.olapEngineModule.fieldList[field] &&
                this.parent.olapEngineModule.fieldList[field].isCalculatedField) {
                field = this.parent.olapEngineModule.fieldList[field].tag;
            }
            if (args.target.id === this.parentID + 'droppable' && dropField.value === '') {
                dropField.value = field;
                dropField.focus();
            } else if (args.target.id === (this.parentID + 'droppable') && dropField.value !== '') {
                let textCovered: string;
                let currentValue: string = dropField.value;
                let cursorPos: number = dropField.selectionStart;
                let textAfterText: string = currentValue.substring(cursorPos, currentValue.length);
                let textBeforeText: string = currentValue.substring(0, cursorPos);
                textCovered = textBeforeText + field;
                dropField.value = textBeforeText + field + textAfterText;
                dropField.focus();
                dropField.setSelectionRange(textCovered.length, textCovered.length);
            } else {
                args.cancel = true;
            }
        } else {
            let type: string = args.draggedNode.getAttribute('data-type');
            if (args.target.id === this.parentID + 'droppable' && dropField.value === '') {
                if (type === CALC) {
                    dropField.value = args.draggedNodeData.id.toString();
                } else {
                    dropField.value = '"' + type + '(' + field + ')' + '"';
                }
                dropField.focus();
            } else if (args.target.id === (this.parentID + 'droppable') && dropField.value !== '') {
                let textCovered: string;
                let cursorPos: number = dropField.selectionStart;
                let currentValue: string = dropField.value;
                let textBeforeText: string = currentValue.substring(0, cursorPos);
                let textAfterText: string = currentValue.substring(cursorPos, currentValue.length);
                if (type === CALC) {
                    textCovered = textBeforeText + args.draggedNodeData.id.toString();
                    dropField.value = textBeforeText + args.draggedNodeData.id.toString() + textAfterText;
                } else {
                    textCovered = textBeforeText + '"' + type + '(' + field + ')' + '"';
                    dropField.value = textBeforeText + '"' + type + '(' + field + ')' + '"' + textAfterText;
                }
                dropField.focus();
                dropField.setSelectionRange(textCovered.length, textCovered.length);
            } else {
                args.cancel = true;
            }
        }
    }

    /**
     * To create dialog.
     * @returns void
     */
    private createDialog(): void {
        if (document.querySelector('#' + this.parentID + 'calculateddialog') !== null) {
            remove(document.querySelector('#' + this.parentID + 'calculateddialog'));
        }
        this.parent.element.appendChild(createElement('div', {
            id: this.parentID + 'calculateddialog',
            className: cls.CALCDIALOG + ' ' + (this.parent.dataType === 'olap' ? cls.OLAP_CALCDIALOG : '')
        }));
        let calcButtons: ButtonPropsModel[] = [
            {
                click: this.applyFormula.bind(this),
                buttonModel: {
                    content: this.parent.localeObj.getConstant('ok'),
                    isPrimary: true
                }
            },
            {
                click: this.cancelClick.bind(this),
                buttonModel: {
                    content: this.parent.localeObj.getConstant('cancel')
                }
            }
        ];
        if (this.parent.dataType === 'olap') {
            let clearButton: ButtonPropsModel = {
                click: this.clearFormula.bind(this),
                buttonModel: {
                    cssClass: 'e-calc-clear-btn',
                    content: this.parent.localeObj.getConstant('clear'),
                }
            };
            calcButtons.splice(0, 0, clearButton);
        }
        this.dialog = new Dialog({
            allowDragging: true,
            position: { X: 'center', Y: 'center' },
            buttons: calcButtons,
            close: this.closeDialog.bind(this),
            beforeOpen: this.beforeOpen.bind(this),
            open: () => {
                if (this.dialog.element.querySelector('#' + this.parentID + 'ddlelement')) {
                    (this.dialog.element.querySelector('#' + this.parentID + 'ddlelement') as HTMLElement).focus();
                }
            },
            animationSettings: { effect: 'Zoom' },
            width: '25%',
            isModal: false,
            closeOnEscape: true,
            enableRtl: this.parent.enableRtl,
            showCloseIcon: true,
            header: this.parent.localeObj.getConstant('createCalculatedField'),
            target: document.body
        });
        this.dialog.isStringTemplate = true;
        this.dialog.appendTo('#' + this.parentID + 'calculateddialog');
    }

    private cancelClick(): void {
        this.dialog.close();
        this.isEdit = false;
    }

    private beforeOpen(args: BeforeOpenEventArgs): void {
        // this.dialog.element.querySelector('.e-dlg-header').innerHTML = this.parent.localeObj.getConstant('createCalculatedField');
        this.dialog.element.querySelector('.e-dlg-header').
            setAttribute('title', this.parent.localeObj.getConstant('createCalculatedField'));
    }

    private closeDialog(args: Object): void {
        if (this.parent.getModuleName() === 'pivotfieldlist') {
            this.parent.axisFieldModule.render();
            if ((this.parent as PivotFieldList).renderMode !== 'Fixed') {
                addClass([this.parent.element.querySelector('.' + cls.TOGGLE_FIELD_LIST_CLASS)], cls.ICON_HIDDEN);
                (this.parent as PivotFieldList).dialogRenderer.fieldListDialog.show();
            }
        }
        this.treeObj.destroy();
        this.dialog.destroy();
        this.newFields = null;
        remove(document.getElementById(this.parentID + 'calculateddialog'));
        remove(document.querySelector('.' + this.parentID + 'calculatedmenu'));
    }

    /* tslint:disable */
    /**
     * To render dialog elements.
     * @returns void
     */
    private renderDialogElements(): HTMLElement {
        let outerDiv: HTMLElement = createElement('div', {
            id: this.parentID + 'outerDiv',
            className: (this.parent.dataType === 'olap' ? cls.OLAP_CALCOUTERDIV + ' ' : '') + cls.CALCOUTERDIV
        });
        let olapFieldTreeDiv: HTMLElement = createElement('div', { id: this.parentID + 'Olap_Tree_Div', className: 'e-olap-field-tree-div' });
        let olapCalcDiv: HTMLElement = createElement('div', { id: this.parentID + 'Olap_Calc_Div', className: 'e-olap-calculated-div' });
        if (this.parent.getModuleName() === 'pivotfieldlist' && (this.parent as PivotFieldList).
            dialogRenderer.parentElement.querySelector('.' + cls.FORMULA) !== null && this.parent.isAdaptive) {
            let accordDiv: HTMLElement = createElement('div', { id: this.parentID + 'accordDiv', className: cls.CALCACCORD });
            outerDiv.appendChild(accordDiv);
            let buttonDiv: HTMLElement = createElement('div', { id: this.parentID + 'buttonDiv', className: cls.CALCBUTTONDIV });
            let addBtn: HTMLElement = createElement('button', {
                id: this.parentID + 'addBtn', innerHTML: this.parent.localeObj.getConstant('add'),
                className: cls.CALCADDBTN
            });
            let cancelBtn: HTMLElement = createElement('button', {
                id: this.parentID + 'cancelBtn', innerHTML: this.parent.localeObj.getConstant('cancel'),
                className: cls.CALCCANCELBTN
            });
            buttonDiv.appendChild(cancelBtn);
            buttonDiv.appendChild(addBtn);
            outerDiv.appendChild(buttonDiv);
        } else {
            if (!this.parent.isAdaptive && this.parent.dataType === 'olap') {
                let formulaTitle: HTMLElement = createElement('div', {
                    className: cls.PIVOT_FIELD_TITLE_CLASS, id: this.parentID + '_' + 'FieldNameTitle',
                    innerHTML: this.parent.localeObj.getConstant('fieldTitle')
                });
                olapCalcDiv.appendChild(formulaTitle);
            }
            let inputDiv: HTMLElement = createElement('div', { id: this.parentID + 'outerDiv', className: cls.CALCINPUTDIV });
            let inputObj: HTMLInputElement = createElement('input', {
                id: this.parentID + 'ddlelement',
                attrs: { 'type': 'text' },
                className: cls.CALCINPUT
            }) as HTMLInputElement;
            inputDiv.appendChild(inputObj);
            (this.parent.dataType === 'olap' && !this.parent.isAdaptive ? olapCalcDiv.appendChild(inputDiv) : outerDiv.appendChild(inputDiv));
            let wrapDiv: HTMLElement = createElement('div', { id: this.parentID + 'control_wrapper', className: cls.TREEVIEWOUTER });
            if (!this.parent.isAdaptive) {
                let fieldTitle: HTMLElement = createElement('div', {
                    className: cls.PIVOT_ALL_FIELD_TITLE_CLASS,
                    innerHTML: (this.parent.dataType === 'olap' ? this.parent.localeObj.getConstant('allFields') :
                        this.parent.localeObj.getConstant('formulaField'))
                });
                if (this.parent.dataType === 'olap') {
                    let headerWrapperDiv: HTMLElement = createElement('div', { className: cls.PIVOT_ALL_FIELD_TITLE_CLASS + '-wrapper' });
                    headerWrapperDiv.appendChild(fieldTitle);
                    let spanElement: HTMLElement = createElement('span', {
                        attrs: {
                            'tabindex': '0',
                            'aria-disabled': 'false',
                            'aria-label': this.parent.localeObj.getConstant('fieldTooltip'),
                        },
                        className: cls.ICON + ' ' + cls.CALC_INFO
                    });
                    headerWrapperDiv.appendChild(spanElement);
                    let tooltip: Tooltip = new Tooltip({
                        content: this.parent.localeObj.getConstant('fieldTooltip'),
                        position: (this.parent.enableRtl ? 'RightCenter' : 'LeftCenter'),
                        target: '.' + cls.CALC_INFO,
                        offsetY: (this.parent.enableRtl ? -10 : -10),
                        width: 220
                    });
                    tooltip.appendTo(headerWrapperDiv);
                    wrapDiv.appendChild(headerWrapperDiv);
                } else {
                    outerDiv.appendChild(fieldTitle)
                }
            }
            let treeOuterDiv: HTMLElement = createElement('div', { className: cls.TREEVIEW + '-outer-div' })
            wrapDiv.appendChild(treeOuterDiv);
            treeOuterDiv.appendChild(createElement('div', { id: this.parentID + 'tree', className: cls.TREEVIEW }));
            (this.parent.dataType === 'olap' && !this.parent.isAdaptive ? olapFieldTreeDiv.appendChild(wrapDiv) : outerDiv.appendChild(wrapDiv));
            if (!this.parent.isAdaptive) {
                let formulaTitle: HTMLElement = createElement('div', {
                    className: cls.PIVOT_FORMULA_TITLE_CLASS,
                    innerHTML: (this.parent.dataType === 'olap' ? this.parent.localeObj.getConstant('expressionField') :
                        this.parent.localeObj.getConstant('formula'))
                });
                (this.parent.dataType === 'olap' ? olapCalcDiv.appendChild(formulaTitle) : outerDiv.appendChild(formulaTitle));
            }
            let dropDiv: HTMLElement = createElement('textarea', {
                id: this.parentID + 'droppable',
                className: cls.FORMULA,
                attrs: {
                    'placeholder': this.parent.isAdaptive ? this.parent.localeObj.getConstant('dropTextMobile') :
                        (this.parent.dataType === 'olap' ? this.parent.localeObj.getConstant('olapDropText') :
                            this.parent.localeObj.getConstant('dropText'))
                }
            });
            (this.parent.dataType === 'olap' && !this.parent.isAdaptive ? olapCalcDiv.appendChild(dropDiv) : outerDiv.appendChild(dropDiv));
            if (this.parent.isAdaptive) {
                let buttonDiv: HTMLElement = createElement('div', { id: this.parentID + 'buttonDiv', className: cls.CALCBUTTONDIV });
                let okBtn: HTMLElement = createElement('button', {
                    id: this.parentID + 'okBtn', innerHTML: this.parent.localeObj.getConstant('apply'),
                    className: cls.CALCOKBTN
                });
                buttonDiv.appendChild(okBtn);
                outerDiv.appendChild(buttonDiv);
            }
            if (this.parent.dataType === 'olap') {
                if (!this.parent.isAdaptive) {
                    let memberTypeTitle: HTMLElement = createElement('div', {
                        className: cls.OLAP_MEMBER_TITLE_CLASS,
                        innerHTML: this.parent.localeObj.getConstant('memberType')
                    });
                    olapCalcDiv.appendChild(memberTypeTitle);
                }
                let memberTypeDrop: HTMLElement = createElement('div', { id: this.parentID + 'Member_Type_Div', className: cls.CALC_MEMBER_TYPE_DIV });
                (this.parent.isAdaptive ? outerDiv.appendChild(memberTypeDrop) : olapCalcDiv.appendChild(memberTypeDrop));
                if (!this.parent.isAdaptive) {
                    let hierarchyTitle: HTMLElement = createElement('div', {
                        className: cls.OLAP_HIERARCHY_TITLE_CLASS,
                        innerHTML: this.parent.localeObj.getConstant('selectedHierarchy')
                    });
                    olapCalcDiv.appendChild(hierarchyTitle);
                }
                let hierarchyDrop: HTMLElement = createElement('div', { id: this.parentID + 'Hierarchy_List_Div', className: cls.CALC_HIERARCHY_LIST_DIV });
                (this.parent.isAdaptive ? outerDiv.appendChild(hierarchyDrop) : olapCalcDiv.appendChild(hierarchyDrop));
                if (!this.parent.isAdaptive) {
                    let formatTitle: HTMLElement = createElement('div', {
                        className: cls.OLAP_FORMAT_TITLE_CLASS,
                        innerHTML: this.parent.localeObj.getConstant('formatString')
                    });
                    olapCalcDiv.appendChild(formatTitle);
                }
                let formatDrop: HTMLElement = createElement('div', { id: this.parentID + 'Format_Div', className: cls.CALC_FORMAT_TYPE_DIV });
                (this.parent.isAdaptive ? outerDiv.appendChild(formatDrop) : olapCalcDiv.appendChild(formatDrop));
                let customFormatDiv: HTMLElement = createElement('div', { id: this.parentID + 'custom_Format_Div', className: cls.CALC_CUSTOM_FORMAT_INPUTDIV });
                let customFormatObj: HTMLInputElement = createElement('input', {
                    id: this.parentID + 'Custom_Format_Element',
                    attrs: { 'type': 'text' },
                    className: cls.CALC_FORMAT_INPUT
                }) as HTMLInputElement;
                customFormatDiv.appendChild(customFormatObj);
                olapCalcDiv.appendChild(customFormatDiv);
                (this.parent.isAdaptive ? outerDiv.appendChild(customFormatDiv) : olapCalcDiv.appendChild(customFormatDiv));
                if (this.parent.getModuleName() === 'pivotfieldlist' && (this.parent as PivotFieldList).
                    dialogRenderer.parentElement.querySelector('.' + cls.FORMULA) === null && this.parent.isAdaptive) {
                    let okBtn: HTMLElement = outerDiv.querySelector('.' + cls.CALCOKBTN);
                    outerDiv.appendChild(okBtn);
                } else {
                    outerDiv.appendChild(olapFieldTreeDiv);
                    outerDiv.appendChild(olapCalcDiv);
                }
            }
        }
        return outerDiv;
    }
    /* tslint:enable */

    /**
     * To create calculated field adaptive layout.
     * @returns void
     */
    private renderAdaptiveLayout(): void {
        if (document.querySelector('#' + this.parentID + 'droppable')) {
            this.formulaText = (document.querySelector('#' + this.parentID + 'droppable') as HTMLTextAreaElement).value;
            this.fieldText = this.inputObj.value;
        }
        this.renderMobileLayout((this.parent as PivotFieldList).dialogRenderer.adaptiveElement);
    }

    /**
     * To create treeview.
     * @returns void
     */
    private createOlapDropElements(): void {
        let dialogElement: HTMLElement = (this.parent.isAdaptive ?
            (this.parent as PivotFieldList).dialogRenderer.parentElement : this.dialog.element);
        let mData: { [key: string]: Object }[] = [];
        let fData: { [key: string]: Object }[] = [];
        let fieldData: { [key: string]: Object }[] = [];
        let memberTypeData: string[] = ['Measure', 'Dimension'];
        let formatStringData: string[] = ['Standard', 'Currency', 'Percent', 'Custom'];
        for (let type of memberTypeData) {
            mData.push({ value: type, text: this.parent.localeObj.getConstant(type) });
        }
        for (let format of formatStringData) {
            fData.push({ value: format, text: this.parent.localeObj.getConstant(format) });
        }
        let fields: { [key: string]: Object }[] =
            PivotUtil.getClonedData(this.parent.olapEngineModule.fieldListData as { [key: string]: Object }[]);
        for (let item of fields as IOlapField[]) {
            if (item.spriteCssClass &&
                (item.spriteCssClass.indexOf('e-attributeCDB-icon') > -1 ||
                    item.spriteCssClass.indexOf('e-hierarchyCDB-icon') > -1)) {
                fieldData.push({ value: item.id, text: item.caption });
            }
        }
        let memberTypeObj: DropDownList = new DropDownList({
            dataSource: mData, enableRtl: this.parent.enableRtl,
            fields: { value: 'value', text: 'text' }, index: 0,
            cssClass: cls.MEMBER_OPTIONS_CLASS, width: '100%',
            change(args: ChangeEventArgs): void {
                hierarchyListObj.enabled = args.value === 'Dimension' ? true : false;
                hierarchyListObj.dataBind();
            }
        });
        memberTypeObj.isStringTemplate = true;
        memberTypeObj.appendTo(dialogElement.querySelector('#' + this.parentID + 'Member_Type_Div') as HTMLElement);
        let hierarchyListObj: DropDownList = new DropDownList({
            dataSource: fieldData, enableRtl: this.parent.enableRtl,
            allowFiltering: true, enabled: false,
            filterBarPlaceholder: this.parent.localeObj.getConstant('example') + ' ' + fieldData[0].text.toString(),
            fields: { value: 'value', text: 'text' }, index: 0,
            cssClass: cls.MEMBER_OPTIONS_CLASS, width: '100%'
        });
        hierarchyListObj.isStringTemplate = true;
        hierarchyListObj.appendTo(dialogElement.querySelector('#' + this.parentID + 'Hierarchy_List_Div') as HTMLElement);
        let formatStringObj: DropDownList = new DropDownList({
            dataSource: fData, enableRtl: this.parent.enableRtl,
            fields: { value: 'value', text: 'text' }, index: 0,
            cssClass: cls.MEMBER_OPTIONS_CLASS, width: '100%',
            change(args: ChangeEventArgs): void {
                customerFormatObj.enabled = args.value === 'Custom' ? true : false;
                customerFormatObj.dataBind();
            }
        });
        formatStringObj.isStringTemplate = true;
        formatStringObj.appendTo(dialogElement.querySelector('#' + this.parentID + 'Format_Div') as HTMLElement);
        let customerFormatObj: MaskedTextBox = new MaskedTextBox({
            placeholder: this.parent.localeObj.getConstant('customFormat'),
            enabled: false
        });
        customerFormatObj.isStringTemplate = true;
        customerFormatObj.appendTo('#' + this.parentID + 'Custom_Format_Element');
    }
    /**
     * To create treeview.
     * @returns void
     */
    private createTreeView(): void {
        if (this.parent.dataType === 'olap') {
            this.treeObj = new TreeView({
                /* tslint:disable-next-line:max-line-length */
                fields: { dataSource: this.getFieldListData(this.parent), id: 'id', text: 'caption', parentID: 'pid', iconCss: 'spriteCssClass' },
                allowDragAndDrop: true,
                enableRtl: this.parent.enableRtl,
                nodeDragStart: this.dragStart.bind(this),
                nodeDragging: (e: DragAndDropEventArgs) => {
                    if (e.event.target && (e.event.target as HTMLElement).classList.contains(cls.FORMULA)) {
                        removeClass([e.clonedNode], cls.NO_DRAG_CLASS);
                        addClass([(e.event.target as HTMLElement)], 'e-copy-drop');
                    } else {
                        addClass([e.clonedNode], cls.NO_DRAG_CLASS);
                        removeClass([(e.event.target as HTMLElement)], 'e-copy-drop');
                        e.dropIndicator = 'e-no-drop';
                        addClass([e.clonedNode.querySelector('.' + cls.ICON)], 'e-icon-expandable');
                        removeClass([e.clonedNode.querySelector('.' + cls.ICON)], 'e-list-icon');
                    }
                },
                nodeClicked: this.fieldClickHandler.bind(this),
                nodeSelected: (args: NodeSelectEventArgs) => {
                    if (args.node.getAttribute('data-type') === CALC) {
                        this.displayMenu(args.node);
                    } else {
                        removeClass([args.node], 'e-active');
                        args.cancel = true;
                    }
                },
                nodeDragStop: this.fieldDropped.bind(this),
                drawNode: this.drawTreeNode.bind(this),
                nodeExpanding: this.updateNodeIcon.bind(this),
                nodeCollapsed: this.updateNodeIcon.bind(this),
                sortOrder: 'None',
            });
        } else {
            this.treeObj = new TreeView({
                fields: { dataSource: this.getFieldListData(this.parent), id: 'formula', text: 'name', iconCss: 'icon' },
                allowDragAndDrop: true,
                enableRtl: this.parent.enableRtl,
                nodeCollapsing: this.nodeCollapsing.bind(this),
                nodeDragStart: this.dragStart.bind(this),
                nodeClicked: this.fieldClickHandler.bind(this),
                nodeDragStop: this.fieldDropped.bind(this),
                drawNode: this.drawTreeNode.bind(this),
                sortOrder: 'Ascending'
            });
        }
        this.treeObj.isStringTemplate = true;
        this.treeObj.appendTo('#' + this.parentID + 'tree');
    }
    private updateNodeIcon(args: NodeExpandEventArgs): void {
        if (args.node && args.node.querySelector('.e-list-icon') &&
            args.node.querySelector('.e-icon-expandable.e-process') &&
            (args.node.querySelector('.e-list-icon').className.indexOf('e-folderCDB-icon') > -1)) {
            let node: HTMLElement = args.node.querySelector('.e-list-icon');
            removeClass([node], 'e-folderCDB-icon');
            addClass([node], 'e-folderCDB-open-icon');
        } else if (args.node && args.node.querySelector('.e-list-icon') &&
            args.node.querySelector('.e-icon-expandable') &&
            (args.node.querySelector('.e-list-icon').className.indexOf('e-folderCDB-open-icon') > -1)) {
            let node: HTMLElement = args.node.querySelector('.e-list-icon');
            removeClass([node], 'e-folderCDB-open-icon');
            addClass([node], 'e-folderCDB-icon');
        } else {
            let curTreeData: { [key: string]: Object }[] = (this.treeObj.fields.dataSource as { [key: string]: Object }[]);
            let fieldListData: IOlapField[] = curTreeData as IOlapField[];
            let childNodes: IOlapField[] = [];
            for (let item of fieldListData) {
                if (item.pid === args.nodeData.id.toString()) {
                    childNodes.push(item);
                }
            }
            if (childNodes.length === 0) {
                this.parent.olapEngineModule.calcChildMembers = [];
                this.parent.olapEngineModule.getCalcChildMembers(this.parent.dataSourceSettings, args.nodeData.id.toString());
                childNodes = this.parent.olapEngineModule.calcChildMembers;
                this.parent.olapEngineModule.calcChildMembers = [];
                for (let node of childNodes) {
                    node.pid = args.nodeData.id.toString();
                    node.hasChildren = false;
                    node.spriteCssClass = 'e-level-members';
                    node.caption = (node.caption === '' ? this.parent.localeObj.getConstant('blank') : node.caption);
                    curTreeData.push(node as { [key: string]: Object });
                }
                this.treeObj.addNodes(childNodes as { [key: string]: Object }[], args.node);
            } else {
                return;
            }
        }
    }
    private nodeCollapsing(args: NodeExpandEventArgs): void {
        args.cancel = true;
    }

    private dragStart(args: DragAndDropEventArgs): void {
        let isDrag: boolean = false;
        let dragItem: HTMLElement = args.clonedNode;
        if (dragItem && ((this.parent.dataType === 'olap' &&
            (dragItem.querySelector('.e-calc-dimension-icon,.e-calc-measure-icon,.e-measure-icon') ||
                dragItem.querySelector('.e-dimensionCDB-icon,.e-attributeCDB-icon,.e-hierarchyCDB-icon') ||
                dragItem.querySelector('.e-level-members,.e-namedSetCDB-icon'))) || (this.parent.dataType === 'pivot' &&
                    (args.event.target as HTMLElement).classList.contains(cls.DRAG_CLASS)))) {
            isDrag = true;
        }
        if (isDrag) {
            addClass([args.draggedNode.querySelector('.' + cls.LIST_TEXT_CLASS)], cls.SELECTED_NODE_CLASS);
            addClass([dragItem], cls.PIVOTCALC);
            dragItem.style.zIndex = (this.dialog.zIndex + 1).toString();
            dragItem.style.display = 'inline';
        } else {
            args.cancel = true;
        }
    }

    /**
     * Trigger before treeview text append.
     * @param  {DrawNodeEventArgs} args
     * @returns void
     */
    private drawTreeNode(args: DrawNodeEventArgs): void {
        if (this.parent.dataType === 'olap') {
            if (args.node.querySelector('.e-measure-icon')) {
                (args.node.querySelector('.e-list-icon') as HTMLElement).style.display = 'none';
            }
            let field: IOlapField = args.nodeData;
            args.node.setAttribute('data-field', field.id);
            args.node.setAttribute('data-caption', field.caption);
            let liTextElement: HTMLElement = args.node.querySelector('.' + cls.TEXT_CONTENT_CLASS);
            if (args.nodeData && args.nodeData.type === CALC &&
                liTextElement && args.node.querySelector('.e-list-icon.e-calc-member')) {
                args.node.setAttribute('data-type', field.type);
                args.node.setAttribute('data-membertype', field.fieldType);
                args.node.setAttribute('data-hierarchy', field.parentHierarchy ? field.parentHierarchy : '');
                args.node.setAttribute('data-formula', field.formula);
                let formatStringData: string[] = ['Standard', 'Currency', 'Percent'];
                let formatString: string;
                formatString = (field.formatString ? formatStringData.indexOf(field.formatString) > -1 ?
                    field.formatString : 'Custom' : '');
                args.node.setAttribute('data-formatString', formatString);
                args.node.setAttribute('data-customString', (formatString === 'Custom' ? field.formatString : ''));
                // if (!this.parent.isAdaptive) {
                //     let editElement: Node = args.node.querySelector('.e-list-icon.e-calc-member').cloneNode(true);
                //     let calcClasses: string[] = ['e-calc-measure-icon', 'e-calc-dimension-icon', 'e-calc-member'];
                //     removeClass([editElement as Element], calcClasses);
                //     addClass([editElement as Element], cls.CALC_EDIT);
                //     (editElement as Element).setAttribute('title', this.parent.localeObj.getConstant('edit'));
                //     liTextElement.insertBefore(editElement, args.node.querySelector('.e-list-icon'));
                // }
            }
            if (this.parent.isAdaptive) {
                let liTextElement: HTMLElement = args.node.querySelector('.' + cls.TEXT_CONTENT_CLASS);
                if (args.node && args.node.querySelector('.e-list-icon') && liTextElement) {
                    let liIconElement: HTMLElement = args.node.querySelector('.e-list-icon');
                    liTextElement.insertBefore(liIconElement, args.node.querySelector('.e-list-text'));
                }
                if (args.node && args.node.querySelector('.e-calcMemberGroupCDB,.e-measureGroupCDB-icon,.e-folderCDB-icon')) {
                    (args.node.querySelector('.e-checkbox-wrapper') as HTMLElement).style.display = 'none';
                }
                if (args.node && args.node.querySelector('.e-level-members')) {
                    (args.node.querySelector('.e-list-icon') as HTMLElement).style.display = 'none';
                }
            }
        } else {
            let field: string = args.nodeData.field as string;
            args.node.setAttribute('data-field', field);
            args.node.setAttribute('data-caption', args.nodeData.caption as string);
            args.node.setAttribute('data-type', args.nodeData.type as string);
            let dragElement: Element = createElement('span', {
                attrs: { 'tabindex': '-1', 'aria-disabled': 'false', 'title': this.parent.localeObj.getConstant('dragField') },
                className: cls.ICON + ' e-drag'
            });
            prepend([dragElement], args.node.querySelector('.' + cls.TEXT_CONTENT_CLASS) as HTMLElement);
            append([args.node.querySelector('.' + cls.FORMAT)], args.node.querySelector('.' + cls.TEXT_CONTENT_CLASS) as HTMLElement);
            if (this.parent.engineModule.fieldList[field].type !== 'number' &&
                this.parent.engineModule.fieldList[field].aggregateType !== CALC) {
                removeClass([args.node.querySelector('.' + cls.FORMAT)], cls.ICON);
            } else {
                args.node.querySelector('.' + cls.FORMAT).setAttribute('title', this.parent.localeObj.getConstant('format'));
            }
            if (this.parent.engineModule.fieldList[field].aggregateType === CALC) {
                args.node.querySelector('.' + cls.FORMAT).setAttribute('title', this.parent.localeObj.getConstant('edit'));
                addClass([args.node.querySelector('.' + cls.FORMAT)], cls.CALC_EDIT);
                removeClass([args.node.querySelector('.' + cls.FORMAT)], cls.FORMAT);
            }
        }
    }

    /**
     * To create radio buttons.
     * @param  {string} key
     * @returns HTMLElement
     */
    private createTypeContainer(key: string): HTMLElement {
        let wrapDiv: HTMLElement = createElement('div', { id: this.parentID + 'control_wrapper', className: cls.TREEVIEWOUTER });
        let type: string[] = [SUM, COUNT, AVG, MIN, MAX, DISTINCTCOUNT, PRODUCT, STDEV, STDEVP, VAR, VARP];
        for (let i: number = 0; i < type.length; i++) {
            let input: HTMLInputElement = createElement('input', {
                id: this.parentID + 'radio' + type[i],
                attrs: { 'type': 'radio', 'data-ftxt': key },
                className: cls.CALCRADIO
            }) as HTMLInputElement;
            wrapDiv.appendChild(input);
        }
        return wrapDiv;
    }

    /**
     * To get Accordion Data.
     * @param  {PivotView | PivotFieldList} parent
     * @returns AccordionItemModel
     */
    private getAccordionData(parent: PivotView | PivotFieldList): AccordionItemModel[] {
        let data: AccordionItemModel[] = [];
        Object.keys(parent.engineModule.fieldList).forEach((key: string, index: number) => {
            data.push({
                header: '<input id=' + this.parentID + '_' + index + ' class=' + cls.CALCCHECK + ' type="checkbox" data-field=' +
                    key + ' data-caption=' + this.parent.engineModule.fieldList[key].caption + ' data-type=' +
                    this.parent.engineModule.fieldList[key].type + '/>',
                content: parent.engineModule.fieldList[key].aggregateType === CALC ||
                    this.parent.engineModule.fieldList[key].type !== 'number' ? '' : this.createTypeContainer(key).outerHTML
            });
        });
        return data;
    }

    /**
     * To render mobile layout.
     * @param  {Tab} tabObj
     * @returns void
     */
    private renderMobileLayout(tabObj?: Tab): void {
        tabObj.items[4].content = this.renderDialogElements().outerHTML;
        tabObj.dataBind();
        if (this.parent.dataType === 'olap' && this.parent.isAdaptive) {
            this.createOlapDropElements();
        }
        let cancelBtn: Button = new Button({ cssClass: cls.FLAT, isPrimary: true });
        cancelBtn.isStringTemplate = true;
        cancelBtn.appendTo('#' + this.parentID + 'cancelBtn');
        if (cancelBtn.element) {
            cancelBtn.element.onclick = this.cancelBtnClick.bind(this);
        }
        if ((this.parent as PivotFieldList).
            dialogRenderer.parentElement.querySelector('.' + cls.FORMULA) !== null && this.parent.isAdaptive) {
            let okBtn: Button = new Button({ cssClass: cls.FLAT + ' ' + cls.OUTLINE_CLASS, isPrimary: true });
            okBtn.isStringTemplate = true;
            okBtn.appendTo('#' + this.parentID + 'okBtn');
            this.inputObj = new MaskedTextBox({
                placeholder: this.parent.localeObj.getConstant('fieldName')
            });
            this.inputObj.isStringTemplate = true;
            this.inputObj.appendTo('#' + this.parentID + 'ddlelement');
            if (this.formulaText !== null && (this.parent as PivotFieldList).
                dialogRenderer.parentElement.querySelector('#' + this.parentID + 'droppable') !== null) {
                let drop: HTMLTextAreaElement = (this.parent as PivotFieldList).
                    dialogRenderer.parentElement.querySelector('#' + this.parentID + 'droppable') as HTMLTextAreaElement;
                drop.value = this.formulaText;
            }
            if (this.fieldText !== null && (this.parent as PivotFieldList).
                dialogRenderer.parentElement.querySelector('.' + cls.CALCINPUT) !== null) {
                ((this.parent as PivotFieldList).
                    dialogRenderer.parentElement.querySelector('.' + cls.CALCINPUT) as HTMLInputElement).value = this.fieldText;
                this.inputObj.value = this.fieldText;
            }
            if (okBtn.element) {
                okBtn.element.onclick = this.applyFormula.bind(this);
            }
        } else if (this.parent.isAdaptive) {
            let addBtn: Button = new Button({ cssClass: cls.FLAT, isPrimary: true });
            addBtn.isStringTemplate = true;
            addBtn.appendTo('#' + this.parentID + 'addBtn');
            if (this.parent.dataType === 'olap') {
                this.treeObj = new TreeView({
                    /* tslint:disable-next-line:max-line-length */
                    fields: { dataSource: this.getFieldListData(this.parent), id: 'id', text: 'caption', parentID: 'pid', iconCss: 'spriteCssClass' },
                    showCheckBox: true,
                    autoCheck: false,
                    sortOrder: 'None',
                    enableRtl: this.parent.enableRtl,
                    drawNode: this.drawTreeNode.bind(this),
                    nodeExpanding: this.updateNodeIcon.bind(this),
                    nodeCollapsed: this.updateNodeIcon.bind(this)
                });
                this.treeObj.isStringTemplate = true;
                this.treeObj.appendTo('#' + this.parentID + 'accordDiv');
            } else {
                let accordion: Accordion = new Accordion({
                    items: this.getAccordionData(this.parent),
                    enableRtl: this.parent.enableRtl,
                    expanding: this.accordionExpand.bind(this),
                });
                accordion.isStringTemplate = true;
                accordion.appendTo('#' + this.parentID + 'accordDiv');
                Object.keys(this.parent.engineModule.fieldList).forEach(this.updateType.bind(this));
            }
            if (addBtn.element) {
                addBtn.element.onclick = this.addBtnClick.bind(this);
            }
        }
    }

    private accordionExpand(args: ExpandEventArgs): void {
        if (args.element.querySelectorAll('.e-radio-wrapper').length === 0) {
            Object.keys(this.parent.engineModule.fieldList).forEach((key: string) => {
                let type: string[] = [SUM, COUNT, AVG, MIN, MAX, DISTINCTCOUNT, PRODUCT, STDEV, STDEVP, VAR, VARP];
                let radiobutton: RadioButton;
                if (key === args.element.querySelector('[data-field').getAttribute('data-field')) {
                    for (let i: number = 0; i < type.length; i++) {
                        radiobutton = new RadioButton({
                            label: this.parent.localeObj.getConstant(type[i]),
                            name: AGRTYPE + key,
                            change: this.onChange.bind(this),
                        });
                        radiobutton.isStringTemplate = true;
                        radiobutton.appendTo('#' + this.parentID + 'radio' + type[i]);
                    }
                }
            });
        }
    }

    private onChange(args: ChangeArgs): void {
        let type: string = (args.event.target as HTMLElement).id.split(this.parent.element.id + 'radio')[1];
        let field: string = (args.event.target as HTMLElement).closest('.e-acrdn-item').
            querySelector('[data-field').getAttribute('data-caption');
        ((args.event.target as HTMLElement).
            closest('.e-acrdn-item').querySelector('.e-label') as HTMLElement).
            innerText = field + ' (' + type + ')';
        (args.event.target as HTMLElement).closest('.e-acrdn-item').
            querySelector('[data-type').setAttribute('data-type', type);
    }

    private updateType(key: string, index: number): void {
        let type: string = null;
        if (this.parent.engineModule.fieldList[key].type === 'string' ||
            this.parent.engineModule.fieldList[key].type === 'include' ||
            this.parent.engineModule.fieldList[key].type === 'exclude') {
            type = COUNT;
        } else {
            type = this.parent.engineModule.fieldList[key].aggregateType !== undefined ?
                this.parent.engineModule.fieldList[key].aggregateType : SUM;
        }
        let checkbox: CheckBox = new CheckBox({
            label: this.parent.engineModule.fieldList[key].caption + ' (' + type + ')'
        });
        checkbox.isStringTemplate = true;
        checkbox.appendTo('#' + this.parentID + '_' + index);
        document.querySelector('#' + this.parentID + '_' + index).setAttribute('data-field', key);
        document.querySelector('#' + this.parentID + '_' + index).setAttribute('data-type', type);
    }

    /**
     * Trigger while click cancel button.
     * @returns void
     */
    private cancelBtnClick(): void {
        this.renderMobileLayout((this.parent as PivotFieldList).dialogRenderer.adaptiveElement);
    }

    /**
     * Trigger while click add button.
     * @returns void
     */
    private addBtnClick(): void {
        let fieldText: string = '';
        let field: string = null;
        let type: string = null;
        if (this.parent.dataType === 'pivot') {
            let node: NodeListOf<Element> = document.querySelectorAll('.e-accordion .e-check');
            for (let i: number = 0; i < node.length; i++) {
                field = node[i].parentElement.querySelector('[data-field]').getAttribute('data-field');
                type = node[i].parentElement.querySelector('[data-field]').getAttribute('data-type');
                if (type.indexOf(CALC) === -1) {
                    fieldText = fieldText + ('"' + type + '(' + field + ')' + '"');
                } else {
                    for (let j: number = 0; j < this.parent.dataSourceSettings.calculatedFieldSettings.length; j++) {
                        if (this.parent.dataSourceSettings.calculatedFieldSettings[j].name === field) {
                            fieldText = fieldText + this.parent.dataSourceSettings.calculatedFieldSettings[j].formula;
                            break;
                        }
                    }
                }
            }
        } else {
            let nodes: string[] = this.treeObj.getAllCheckedNodes();
            let olapEngine: OlapEngine = this.parent.olapEngineModule;
            for (let item of nodes) {
                fieldText = fieldText + (olapEngine.fieldList[item] &&
                    olapEngine.fieldList[item].type === CALC ? olapEngine.fieldList[item].tag : item);
            }
        }
        this.formulaText = this.formulaText !== null ? (this.formulaText + fieldText) : fieldText;
        this.renderMobileLayout((this.parent as PivotFieldList).dialogRenderer.adaptiveElement);
    }

    /**
     * To create calculated field dialog elements.
     * @returns void
     * @hidden
     */
    public createCalculatedFieldDialog(): void {
        if (this.parent.isAdaptive && this.parent.getModuleName() === 'pivotfieldlist') {
            this.renderAdaptiveLayout();
        } else if (!this.parent.isAdaptive) {
            this.renderDialogLayout();
            this.dialog.element.style.top = parseInt(this.dialog.element.style.top, 10) < 0 ? '0px' : this.dialog.element.style.top;
        }
    }

    /**
     * To create calculated field desktop layout.
     * @returns void
     */
    private renderDialogLayout(): void {
        this.newFields =
            extend([], (this.parent.dataSourceSettings as IDataOptions).calculatedFieldSettings, null, true) as ICalculatedFields[];
        this.createDialog();
        this.dialog.content = this.renderDialogElements();
        this.dialog.refresh();
        this.inputObj = new MaskedTextBox({
            placeholder: this.parent.localeObj.getConstant('fieldName')
        });
        this.inputObj.isStringTemplate = true;
        this.inputObj.appendTo('#' + this.parentID + 'ddlelement');
        if (this.parent.dataType === 'olap' && !this.parent.isAdaptive) {
            this.createOlapDropElements();
        }
        this.createTreeView();
        this.createMenu();
        this.droppable = new Droppable(this.dialog.element.querySelector('#' + this.parentID + 'droppable') as HTMLElement);
        this.keyboardEvents = new KeyboardEvents(this.parent.calculatedFieldModule.dialog.element, {
            keyAction: this.keyActionHandler.bind(this),
            keyConfigs: { moveRight: 'rightarrow', enter: 'enter' },
            eventName: 'keydown'
        });
    }

    /**
     * Creates the error dialog for the unexpected action done.
     * @method createConfirmDialog
     * @return {void}
     * @hidden
     */
    private createConfirmDialog(title: string, description: string): void {
        let errorDialog: HTMLElement = createElement('div', {
            id: this.parentID + '_ErrorDialog',
            className: cls.ERROR_DIALOG_CLASS
        });
        this.parent.element.appendChild(errorDialog);
        this.confirmPopUp = new Dialog({
            animationSettings: { effect: 'Fade' },
            allowDragging: false,
            showCloseIcon: true,
            enableRtl: this.parent.enableRtl,
            width: 'auto',
            height: 'auto',
            position: { X: 'center', Y: 'center' },
            buttons: [
                {
                    click: this.replaceFormula.bind(this),
                    buttonModel: {
                        cssClass: cls.OK_BUTTON_CLASS + ' ' + cls.OUTLINE_CLASS,
                        content: this.parent.localeObj.getConstant('ok'), isPrimary: true
                    }
                },
                {
                    click: this.removeErrorDialog.bind(this),
                    buttonModel: {
                        cssClass: cls.CANCEL_BUTTON_CLASS,
                        content: this.parent.localeObj.getConstant('cancel'), isPrimary: true
                    }
                }
            ],
            header: title,
            content: description,
            isModal: true,
            visible: true,
            closeOnEscape: true,
            target: document.body,
            close: this.removeErrorDialog.bind(this),
        });
        this.confirmPopUp.isStringTemplate = true;
        this.confirmPopUp.appendTo(errorDialog);
        // this.confirmPopUp.element.querySelector('.e-dlg-header').innerHTML = title;
    }

    private replaceFormula(): void {
        let report: IDataOptions = this.parent.dataSourceSettings as IDataOptions;
        let dropField: HTMLTextAreaElement = document.querySelector('#' + this.parentID + 'droppable') as HTMLTextAreaElement;
        if (this.parent.dataType === 'olap') {
            let dialogElement: HTMLElement = this.dialog.element;
            /* tslint:disable */
            let customFormat: MaskedTextBox = getInstance(dialogElement.querySelector('#' + this.parentID + 'Custom_Format_Element') as HTMLElement, MaskedTextBox) as MaskedTextBox;
            let formatDrop: DropDownList = getInstance(dialogElement.querySelector('#' + this.parentID + 'Format_Div') as HTMLElement, DropDownList) as DropDownList;
            let memberTypeDrop: DropDownList = getInstance(dialogElement.querySelector('#' + this.parentID + 'Member_Type_Div') as HTMLElement, DropDownList) as DropDownList;
            let hierarchyDrop: DropDownList = getInstance(dialogElement.querySelector('#' + this.parentID + 'Hierarchy_List_Div') as HTMLElement, DropDownList) as DropDownList;
            /* tslint:enable */
            for (let j: number = 0; j < report.calculatedFieldSettings.length; j++) {
                if (report.calculatedFieldSettings[j].name === this.inputObj.value) {
                    if (memberTypeDrop.value === 'Dimension') {
                        report.calculatedFieldSettings[j].hierarchyUniqueName = hierarchyDrop.value as string;
                    }
                    report.calculatedFieldSettings[j].formatString =
                        (formatDrop.value === 'Custom' ? customFormat.value : formatDrop.value as string);
                    report.calculatedFieldSettings[j].formula = dropField.value;
                    this.parent.lastCalcFieldInfo = report.calculatedFieldSettings[j];
                    break;
                }
            }
        } else {
            for (let i: number = 0; i < report.values.length; i++) {
                if (report.values[i].type === CALC && report.values[i].name === this.inputObj.value) {
                    for (let j: number = 0; j < report.calculatedFieldSettings.length; j++) {
                        if (report.calculatedFieldSettings[j].name === this.inputObj.value) {
                            report.calculatedFieldSettings[j].formula = dropField.value;
                            this.parent.lastCalcFieldInfo = report.calculatedFieldSettings[j];
                        }
                    }
                }
            }
        }
        this.addFormula(report, this.inputObj.value);
        this.removeErrorDialog();
    }

    private removeErrorDialog(): void {
        if (document.getElementById(this.parentID + '_ErrorDialog')) {
            remove(document.getElementById(this.parentID + '_ErrorDialog').parentElement);
        }
    }

    /**
     * To add event listener.
     * @returns void
     * @hidden
     */
    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.initCalculatedField, this.createCalculatedFieldDialog, this);
    }

    /**
     * To remove event listener.
     * @returns void
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.initCalculatedField, this.createCalculatedFieldDialog);
    }

    /**
     * To destroy the calculated field dialog
     * @returns void
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
    }
}
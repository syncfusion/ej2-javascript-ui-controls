import { Dialog, OffsetPosition, Tooltip, ButtonPropsModel } from '@syncfusion/ej2-popups';
import { Droppable, createElement, extend, remove, addClass, closest, getInstance, select, SanitizeHtmlHelper } from '@syncfusion/ej2-base';
import { prepend, append, KeyboardEvents, KeyboardEventArgs, removeClass, isNullOrUndefined } from '@syncfusion/ej2-base';
import { IDataOptions, IFieldOptions, ICalculatedFields, IFormatSettings, PivotEngine, IField } from '../../base/engine';
import { PivotView } from '../../pivotview/base/pivotview';
import { Button, RadioButton, CheckBox, ChangeArgs } from '@syncfusion/ej2-buttons';
import { MaskedTextBox, MaskChangeEventArgs } from '@syncfusion/ej2-inputs';
import * as cls from '../../common/base/css-constant';
import {
    TreeView, DragAndDropEventArgs, NodeExpandEventArgs, NodeClickEventArgs, MenuEventArgs,
    DrawNodeEventArgs, ExpandEventArgs, NodeSelectEventArgs, NodeKeyPressEventArgs
} from '@syncfusion/ej2-navigations';
import { ContextMenu as Menu, MenuItemModel, ContextMenuModel } from '@syncfusion/ej2-navigations';
import { IAction, CalculatedFieldCreateEventArgs, AggregateMenuOpenEventArgs, PivotActionInfo } from '../../common/base/interface';
import * as events from '../../common/base/constant';
import { PivotFieldList } from '../../pivotfieldlist/base/field-list';
import { Tab, Accordion, AccordionItemModel, AccordionClickArgs } from '@syncfusion/ej2-navigations';
import { DropDownList, ChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import { PivotUtil } from '../../base/util';
import { IOlapField, OlapEngine } from '../../base/olap/engine';
import { FormatSettingsModel, CalculatedFieldSettingsModel, DataSourceSettingsModel } from '../../model/datasourcesettings-model';
import { AggregateTypes } from '../base/enum';

/**
 * Module to render Calculated Field Dialog
 */

const COUNT: string = 'Count';
const AVG: string = 'Avg';
const MEDIAN: string = 'Median';
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
    /** @hidden */
    public parent: PivotView | PivotFieldList;
    /** @hidden */
    public isFormula: boolean = false;
    /** @hidden */
    public isRequireUpdate: boolean = false;
    /** @hidden */
    public buttonCall: boolean;
    /** @hidden */
    public field: string;

    /**
     * Internal variables.
     */
    private treeObj: TreeView;
    private droppable: Droppable;
    private newFields: ICalculatedFields[];
    private curMenu: Element;
    private isFieldExist: boolean;
    private parentID: string;
    private existingReport: IDataOptions;
    private formulaText: string;
    private fieldText: string;
    private formatType: string;
    private formatText: string;
    private fieldType: string;
    private parentHierarchy: string;
    private keyboardEvents: KeyboardEvents;
    private isEdit: boolean;
    private currentFieldName: string;
    private currentFormula: string;
    private formatTypes: string[] = ['Standard', 'Currency', 'Percent', 'Custom', 'None'];

    /**
     * Constructor for calculatedfield module.
     *
     * @param {PivotView | PivotFieldList} parent - It represent the parent.
     */
    constructor(parent: PivotView | PivotFieldList) {
        this.parent = parent;
        this.existingReport = null;
        this.parent.calculatedFieldModule = this;
        this.removeEventListener();
        this.addEventListener();
        this.parentID = this.parent.element.id;
        this.treeObj = null;
        this.droppable = null;
        this.newFields = null;
        this.isFieldExist = true;
        this.formulaText = null;
        this.fieldText = null;
        this.formatText = null;
        this.formatType = null;
        this.fieldType = null;
        this.parentHierarchy = null;
        this.isEdit = false;
        this.currentFieldName = null;
    }

    /**
     * To get module name.
     *
     * @returns {string} - It returns the Module name.
     */
    protected getModuleName(): string {
        return 'calculatedField';
    }

    private keyActionHandler(e: KeyboardEventArgs): void {
        const node: HTMLElement = (e.currentTarget as HTMLElement).querySelector('.e-node-focus') as HTMLElement;
        if (node) {
            switch (e.action) {
            case 'moveRight':
            case 'shiftE':
                if (this.parent.dataType === 'pivot') {
                    this.displayMenu(node);
                }
                break;
            case 'delete':
                if (node.tagName === 'LI' && !node.querySelector('.e-list-icon.e-format') && !node.querySelector('.e-list-icon').classList.contains('.e-icons') && (node.querySelector('.' + cls.GRID_REMOVE) &&
                    node.querySelector('.' + cls.GRID_REMOVE).classList.contains('e-list-icon'))) {
                    this.createConfirmDialog(
                        this.parent.localeObj.getConstant('alert'),
                        this.parent.localeObj.getConstant('removeCalculatedField'), {}, true, node);
                }
                break;
            case 'enter':
                {
                    let field: string = node.getAttribute('data-field');
                    const dialog: Dialog = getInstance(select('#' + this.parentID + 'calculateddialog', document) as HTMLElement, Dialog) as Dialog;
                    const type: string = node.getAttribute('data-type');
                    const dropField: HTMLTextAreaElement =
                        select('#' + this.parentID + 'droppable', dialog.element) as HTMLTextAreaElement;
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
                        if (this.parent.olapEngineModule && this.parent.olapEngineModule.fieldList[field as string] &&
                            this.parent.olapEngineModule.fieldList[field as string].isCalculatedField) {
                            field = this.parent.olapEngineModule.fieldList[field as string].tag;
                        }
                        if (dropField.value === '') {
                            dropField.value = field;
                        } else if (dropField.value !== '') {
                            dropField.value = dropField.value + field;
                        }
                    }
                }
                break;
            }
        }
    }
    /**
     * Trigger while click treeview icon.
     *
     * @param  {NodeClickEventArgs} e - Click event argument.
     * @returns {void}
     */
    private fieldClickHandler(e: NodeClickEventArgs): void {
        const node: HTMLElement = closest(e.event.target as Element, 'li') as HTMLElement;
        if ((e.event.target as HTMLElement).classList.contains(cls.FORMAT) ||
            (e.event.target as HTMLElement).classList.contains(cls.CALC_EDIT) ||
            (e.event.target as HTMLElement).classList.contains(cls.CALC_EDITED) ||
            (e.event.target as HTMLElement).classList.contains(cls.GRID_REMOVE)) {
            if (!this.parent.isAdaptive) {
                this.displayMenu(node, e.node, e.event.target as HTMLElement);
            } else if (this.parent.dataType === 'olap' && this.parent.isAdaptive) {
                if (node.tagName === 'LI' && node.querySelector('.e-list-edit-icon').classList.contains(cls.CALC_EDIT) && (e.event.target as HTMLElement).classList.contains(cls.CALC_EDIT)) {
                    this.isEdit = true;
                    this.currentFieldName = node.getAttribute('data-field');
                    this.fieldText = node.getAttribute('data-caption');
                    this.formulaText = node.getAttribute('data-formula');
                    this.formatType = node.getAttribute('data-formatString');
                    this.formatText = this.formatType === 'Custom' ? node.getAttribute('data-customformatstring') : null;
                    this.fieldType = node.getAttribute('data-membertype');
                    this.parentHierarchy = this.fieldType === 'Dimension' ? node.getAttribute('data-hierarchy') : null;
                    addClass([node.querySelector('.e-list-edit-icon')], cls.CALC_EDITED);
                    removeClass([node.querySelector('.e-list-edit-icon')], cls.CALC_EDIT);
                    this.renderMobileLayout((this.parent as PivotFieldList).dialogRenderer.adaptiveElement);
                } else if (node.tagName === 'LI' && node.querySelector('.e-list-edit-icon').classList.contains(cls.CALC_EDITED) && (e.event.target as HTMLElement).classList.contains(cls.CALC_EDITED)) {
                    this.isEdit = false;
                    this.fieldText = this.formatText = this.formulaText = this.currentFieldName = null;
                    this.parentHierarchy = this.fieldType = this.formatType = null;
                    addClass([node.querySelector('.e-list-edit-icon')], cls.CALC_EDIT);
                    removeClass([node.querySelector('.e-list-edit-icon')], cls.CALC_EDITED);
                } else if (node.tagName === 'LI' && node.querySelector('.' + cls.GRID_REMOVE).classList.contains('e-icons') && (e.event.target as HTMLElement).classList.contains(cls.GRID_REMOVE)) {
                    this.createConfirmDialog(
                        this.parent.localeObj.getConstant('alert'),
                        this.parent.localeObj.getConstant('removeCalculatedField'), {}, true, e.node);
                }
            }
        }
    }
    /**
     * Trigger while click treeview icon.
     *
     * @param  {AccordionClickArgs} e - Click event argument.
     * @returns {void}
     */
    private accordionClickHandler(e: AccordionClickArgs): void {
        if (e.item && e.item.iconCss.indexOf('e-list-icon') !== -1 &&
            closest(e.originalEvent.target as Element, '.e-acrdn-header-icon')) {
            const node: HTMLElement = closest(e.originalEvent.target as Element, '.e-acrdn-header').querySelector('.' + cls.CALCCHECK);
            const fieldName: string = node.getAttribute('data-field');
            const captionName: string = node.getAttribute('data-caption');
            const formatObj: IFormatSettings = PivotUtil.getFieldByName(fieldName, this.parent.dataSourceSettings.formatSettings);
            const optionElement: HTMLElement = closest(e.originalEvent.target as Element, '.e-acrdn-header-icon') as HTMLElement;
            if (formatObj) {
                const pivotFormat: string = this.getFormat(formatObj.format);
                const formatString: string = (pivotFormat ? this.formatTypes.indexOf(pivotFormat) > -1 ?
                    formatObj.format : 'Custom' : 'None');
                this.formatType = formatString;
            }
            if (optionElement.querySelector('.' + cls.CALC_EDIT) && (e.originalEvent.target as Element).classList.contains(cls.CALC_EDIT)) {
                this.isEdit = true;
                this.currentFieldName = fieldName;
                this.fieldText = captionName ? captionName : fieldName;
                this.formulaText = this.parent.engineModule.fieldList[fieldName as string].formula;
                this.formatText = formatObj ? formatObj.format : '';
                addClass([optionElement.querySelector('.e-list-icon')], cls.CALC_EDITED);
                removeClass([optionElement.querySelector('.e-list-icon')], cls.CALC_EDIT);
                this.renderMobileLayout((this.parent as PivotFieldList).dialogRenderer.adaptiveElement);
            } else if (optionElement.querySelector('.' + cls.CALC_EDITED) &&
                (e.originalEvent.target as Element).classList.contains(cls.CALC_EDITED)) {
                this.isEdit = false;
                this.fieldText = this.formatText = this.formulaText = this.currentFieldName = null;
                addClass([optionElement.querySelector('.e-list-icon')], cls.CALC_EDIT);
                removeClass([optionElement.querySelector('.e-list-icon')], cls.CALC_EDITED);
            } else if (optionElement.querySelector('.' + cls.GRID_REMOVE) &&
                (e.originalEvent.target as Element).classList.contains(cls.GRID_REMOVE)) {
                this.createConfirmDialog(
                    this.parent.localeObj.getConstant('alert'),
                    this.parent.localeObj.getConstant('removeCalculatedField'), {}, true, node);
            }
        }
    }

    private accordionCreated(): void {
        const accordion: Accordion = getInstance(select('#' + this.parentID + 'accordDiv', document) as HTMLElement, Accordion) as Accordion;
        const allElement: NodeListOf<Element> = accordion.element.querySelectorAll('.e-acrdn-item');
        for (let i: number = 0; i < allElement.length; i++) {
            if (allElement[i as number].querySelector('.' + cls.CALC_EDIT) || allElement[i as number].querySelector('.' + cls.CALC_EDITED)) {
                const element: HTMLElement = createElement('span', {
                    className: 'e-list-icon ' + cls.GRID_REMOVE + ' e-icons'
                });
                append([element], allElement[i as number].querySelector('.e-acrdn-header-icon') as HTMLElement);
                addClass([allElement[i as number]], cls.SELECT_CLASS);
            }
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
     *
     * @param  {HTMLElement} node - It contains the value of node.
     * @param  {HTMLElement} treeNode - It contains the value of tree Node.
     * @param  {HTMLElement} target - It represent the target.
     * @returns {void}
     */
    private displayMenu(node: HTMLElement, treeNode?: HTMLElement, target?: HTMLElement): void {
        const edit: boolean = target ? target.classList.contains(cls.CALC_EDIT) : true;
        const edited: boolean = target ? target.classList.contains(cls.CALC_EDITED) : true;
        const dialog: Dialog = getInstance(select('#' + this.parentID + 'calculateddialog', document) as HTMLElement, Dialog) as Dialog;
        const inputObj: MaskedTextBox = getInstance(
            select('#' + this.parentID + 'ddlelement', document) as HTMLElement, MaskedTextBox) as MaskedTextBox;
        try {
            if (this.parent.dataType === 'pivot' && node.querySelector('.e-list-icon.e-format') &&
                node.querySelector('.e-list-icon.e-format').classList.contains(cls.ICON) &&
                !node.querySelector('.e-list-icon').classList.contains(cls.CALC_EDITED) &&
                !node.querySelector('.e-list-icon').classList.contains(cls.GRID_REMOVE) &&
                !node.querySelector('.e-list-icon').classList.contains(cls.CALC_EDIT) && node.tagName === 'LI') {
                const menuObj: Menu = select('#' + this.parentID + 'CalcContextmenu', document) ?
                    getInstance(select('#' + this.parentID + 'CalcContextmenu', document) as HTMLElement, Menu) as Menu : null;
                if (menuObj && !menuObj.isDestroyed) {
                    menuObj.destroy();
                }
                this.curMenu = (node.querySelector('.' + cls.LIST_TEXT_CLASS) as HTMLElement);
                this.openContextMenu(node);
            } else if (node.tagName === 'LI' && (node.querySelector('.' + cls.CALC_EDIT) &&
                node.querySelector('.' + cls.CALC_EDIT).classList.contains('e-list-icon') && edit ||
                (this.parent.dataType === 'olap' && node.getAttribute('data-type') === CALC && node.classList.contains('e-active') && ((target && !target.classList.contains(cls.GRID_REMOVE)) || !target)))) {
                this.isEdit = true;
                const fieldName: string = node.getAttribute('data-field');
                const caption: string = node.getAttribute('data-caption');
                this.currentFieldName = fieldName;
                inputObj.value = caption;
                inputObj.dataBind();
                const formatString: string = node.getAttribute('data-formatString');
                const dialogElement: HTMLElement = dialog.element;
                const ddlFormatTypes: DropDownList = getInstance(select('#' + this.parentID + 'Format_Div', dialogElement) as HTMLElement, DropDownList) as DropDownList;
                const customFormat: MaskedTextBox = getInstance(select('#' + this.parentID + 'Custom_Format_Element', dialogElement) as HTMLElement, MaskedTextBox) as MaskedTextBox;
                const customFormatString: string = node.getAttribute('data-customformatstring');
                if (this.parent.dataType === 'olap') {
                    const memberType: string = node.getAttribute('data-membertype');
                    const parentHierarchy: string = node.getAttribute('data-hierarchy');
                    const expression: string = node.getAttribute('data-formula');
                    const fieldTitle: HTMLElement = select('#' + this.parentID + '_' + 'FieldNameTitle', dialogElement);
                    const memberTypeDrop: DropDownList = getInstance(select('#' + this.parentID + 'Member_Type_Div', dialogElement) as HTMLElement, DropDownList) as DropDownList;
                    const hierarchyDrop: DropDownList = getInstance(select('#' + this.parentID + 'Hierarchy_List_Div', dialogElement) as HTMLElement, DropDownList) as DropDownList;
                    fieldTitle.innerText = this.parent.localeObj.getConstant('caption');
                    (select('#' + this.parentID + 'droppable', document) as HTMLTextAreaElement).value = expression;
                    memberTypeDrop.readonly = true;
                    memberTypeDrop.value = memberType;
                    memberTypeDrop.dataBind();
                    if (memberType === 'Dimension') {
                        hierarchyDrop.value = parentHierarchy;
                    }
                } else {
                    addClass(this.treeObj.element.querySelectorAll('.' + cls.CALC_EDITED), cls.CALC_EDIT);
                    removeClass(this.treeObj.element.querySelectorAll('.' + cls.CALC_EDITED), cls.CALC_EDITED);
                    addClass([node.querySelector('.e-list-icon')], cls.CALC_EDITED);
                    removeClass([node.querySelector('.e-list-icon')], cls.CALC_EDIT);
                    node.querySelector('.' + cls.CALC_EDITED).setAttribute('title', this.parent.localeObj.getConstant('clearCalculatedField'));
                    (select('#' + this.parentID + 'droppable', document) as HTMLTextAreaElement).value = node.getAttribute('data-uid');
                }
                if (formatString !== '') {
                    ddlFormatTypes.value = formatString;
                    ddlFormatTypes.dataBind();
                }
                customFormat.value = customFormatString;
                customFormat.dataBind();
            } else if (node.tagName === 'LI' && (node.querySelector('.' + cls.CALC_EDITED) &&
                node.querySelector('.' + cls.CALC_EDITED).classList.contains('e-list-icon') && edited ||
                (this.parent.dataType === 'olap' && !node.classList.contains('e-active')))) {
                this.isEdit = false;
                inputObj.value = '';
                inputObj.dataBind();
                const dialogElement: HTMLElement = dialog.element;
                const customFormat: MaskedTextBox = getInstance(select('#' + this.parentID + 'Custom_Format_Element', dialogElement) as HTMLElement, MaskedTextBox) as MaskedTextBox;
                customFormat.value = '';
                customFormat.dataBind();
                if (this.parent.dataType === 'olap') {
                    const hierarchyDrop: DropDownList = getInstance(select('#' + this.parentID + 'Hierarchy_List_Div', dialogElement) as HTMLElement, DropDownList) as DropDownList;
                    const ddlFormatTypes: DropDownList = getInstance(select('#' + this.parentID + 'Format_Div', dialogElement) as HTMLElement, DropDownList) as DropDownList;
                    const memberTypeDrop: DropDownList = getInstance(select('#' + this.parentID + 'Member_Type_Div', dialogElement) as HTMLElement, DropDownList) as DropDownList;
                    const fieldTitle: HTMLElement = select('#' + this.parentID + '_' + 'FieldNameTitle', dialogElement);
                    fieldTitle.innerText = this.parent.localeObj.getConstant('fieldTitle');
                    hierarchyDrop.index = 0;
                    hierarchyDrop.dataBind();
                    ddlFormatTypes.index = 0;
                    ddlFormatTypes.dataBind();
                    memberTypeDrop.index = 0;
                    memberTypeDrop.readonly = false;
                    memberTypeDrop.dataBind();
                } else {
                    addClass(this.treeObj.element.querySelectorAll('.' + cls.CALC_EDITED), cls.CALC_EDIT);
                    removeClass(this.treeObj.element.querySelectorAll('.' + cls.CALC_EDITED), cls.CALC_EDITED);
                    node.querySelector('.' + cls.CALC_EDIT).setAttribute('title', this.parent.localeObj.getConstant('edit'));
                }
                (select('#' + this.parentID + 'droppable', document) as HTMLTextAreaElement).value = '';
            } else if (node.tagName === 'LI' && (node.querySelector('.' + cls.GRID_REMOVE) &&
                node.querySelector('.' + cls.GRID_REMOVE).classList.contains('e-list-icon')) && !edit && !edited) {
                this.parent.actionObj.actionName = events.removeField;
                if (this.parent.actionBeginMethod()) {
                    return;
                }
                const dropField: HTMLTextAreaElement = select('#' + this.parentID + 'droppable', document) as HTMLTextAreaElement;
                const field: ICalculatedFields = {
                    name: this.isEdit ? this.currentFieldName : inputObj.value,
                    caption: inputObj.value,
                    formula: dropField.value
                };
                this.createConfirmDialog(
                    this.parent.localeObj.getConstant('alert'),
                    this.parent.localeObj.getConstant('removeCalculatedField'), field, true, treeNode);
            }
        } catch (execption) {
            this.parent.actionFailureMethod(execption);
        }
    }

    private removeCalcField(node: Element): void {
        const dataSourceSettings: DataSourceSettingsModel = this.parent.dataSourceSettings;
        const fieldName: string = node.getAttribute('data-field');
        const calcfields: CalculatedFieldSettingsModel[] = dataSourceSettings.calculatedFieldSettings;
        let engineModule: PivotEngine | OlapEngine;
        if (this.parent.dataType === 'pivot') {
            if (!this.parent.isAdaptive) {
                this.treeObj.removeNodes([node]);
            } else {
                const index: number = parseInt(node.getAttribute('id').split(this.parentID + '_')[1], 10);
                if (typeof index === 'number') {
                    const accordion: Accordion = getInstance(
                        select('#' + this.parentID + 'accordDiv', document) as HTMLElement, Accordion) as Accordion;
                    accordion.hideItem(index);
                }
            }
        }
        for (let i: number = 0; i < calcfields.length; i++) {
            if (calcfields[i as number] && calcfields[i as number].name === fieldName) {
                calcfields.splice(i, 1);
                break;
            }
        }

        if (this.parent.dataType === 'olap') {
            engineModule = this.parent.olapEngineModule;
            const fields: { [key: string]: Object }[] = engineModule.fieldListData ?
                engineModule.fieldListData as { [key: string]: Object }[] : [];
            for (const item of Object.keys(fields) as string[]) {
                if (fields[parseInt(item, 10)].name === fieldName) {
                    const index: number = parseInt(item, 10);
                    if (typeof (index) === 'number') {
                        fields.splice(index, 1);
                        break;
                    }
                }
            }
            const parentID: string = this.treeObj.getNode(node).parentID as string;
            this.treeObj.removeNodes([node]);
            if (calcfields.length <= 0) {
                this.treeObj.removeNodes([parentID]);
            }
        } else {
            engineModule = this.parent.engineModule;
        }
        if (engineModule.fields) {
            for (let i: number = 0; i < engineModule.fields.length; i++) {
                if (engineModule.fields[i as number] === fieldName) {
                    engineModule.fields.splice(i, 1);
                    break;
                }
            }
        }
        if (engineModule.savedFieldList && engineModule.savedFieldList[fieldName as string]) {
            delete engineModule.savedFieldList[fieldName as string];
        }
        if (engineModule.fieldList && engineModule.fieldList[fieldName as string]) {
            delete engineModule.fieldList[fieldName as string];
        }
        const formatFields: FormatSettingsModel[] = dataSourceSettings.formatSettings;
        for (let i: number = 0; i < formatFields.length; i++) {
            if (formatFields[i as number] && formatFields[i as number].name === fieldName) {
                formatFields.splice(i, 1);
                break;
            }
        }
        const fields: IFieldOptions[][] =
            [dataSourceSettings.values, dataSourceSettings.rows, dataSourceSettings.columns, dataSourceSettings.filters];
        for (let i: number = 0, n: number = fields.length; i < n; i++) {
            for (let j: number = 0, length: number = fields[i as number].length; j < length; j++) {
                if (fields[i as number][j as number].name === fieldName) {
                    fields[i as number].splice(j, 1);
                    break;
                }
            }
        }
        if (this.isEdit && this.currentFieldName === fieldName) {
            const inputObj: MaskedTextBox = getInstance(
                select('#' + this.parentID + 'ddlelement', document) as HTMLElement, MaskedTextBox) as MaskedTextBox;
            this.isEdit = false;
            inputObj.value = '';
            this.currentFieldName = this.formatText = this.fieldText = this.formatType = null;
            this.formulaText = this.fieldType = this.parentHierarchy = null;
        }
        if ((!isNullOrUndefined((this.parent as PivotFieldList).isDeferLayoutUpdate) &&
            !(this.parent as PivotFieldList).isDeferLayoutUpdate) || ((this.parent as PivotFieldList).pivotGridModule &&
                !(this.parent as PivotFieldList).pivotGridModule.pivotDeferLayoutUpdate) || this.parent.getModuleName() !== 'pivotfieldlist') {
            this.parent.updateDataSource();
        }
        this.closeErrorDialog();
    }
    /**
     * To set position for context menu.
     *
     * @param {HTMLElement} node - It contains the value of node.
     * @returns {void}
     */
    private openContextMenu(node: HTMLElement): void {
        const fieldName: string = node.getAttribute('data-field');
        const type: string = this.parent.engineModule.fieldList[fieldName as string].type !== 'number' ? 'string' : 'number';
        const validSummaryTypes: AggregateTypes[] = (type === 'string' ? this.getValidSummaryType().slice(0, 2) : this.getValidSummaryType());
        const eventArgs: AggregateMenuOpenEventArgs = {
            cancel: false, fieldName: fieldName,
            aggregateTypes: [...this.getMenuItems(type)]
        };
        const control: PivotView | PivotFieldList =
            this.parent.getModuleName() === 'pivotfieldlist' && (this.parent as PivotFieldList).isPopupView ?
                (this.parent as PivotFieldList).pivotGridModule : this.parent;
        control.trigger(events.aggregateMenuOpen, eventArgs, (observedArgs: AggregateMenuOpenEventArgs) => {
            if (!observedArgs.cancel) {
                const duplicateTypes: string[] = [];
                const items: MenuItemModel[] = [];
                for (const option of observedArgs.aggregateTypes) {
                    if (validSummaryTypes.indexOf(option) > -1 && duplicateTypes.indexOf(option) === -1) {
                        duplicateTypes.push(option);
                        items.push({
                            id: this.parent.element.id + 'Calc_' + option,
                            text: this.parent.localeObj.getConstant(option)
                        });
                    }
                }
                this.createMenu(items, node);
                const pos: OffsetPosition = node.getBoundingClientRect();
                const offset: number = window.scrollY || document.documentElement.scrollTop;
                const menuObj: Menu = getInstance(select('#' + this.parentID + 'CalcContextmenu', document) as HTMLElement, Menu) as Menu;
                if (this.parent.enableRtl) {
                    menuObj.open(pos.top + offset, pos.left - 100);
                } else {
                    menuObj.open(pos.top + offset, pos.left + 150);
                }
            }
        });
    }

    /**
     * Triggers while select menu.
     *
     * @param  {MenuEventArgs} menu - It represent the menu.
     * @returns {void}
     */
    private selectContextMenu(menu: MenuEventArgs): void {
        if (menu.element.textContent !== null) {
            const field: string = closest(this.curMenu, '.e-list-item').getAttribute('data-caption');
            closest(this.curMenu, '.e-list-item').setAttribute('data-type', menu.element.id.split('_').pop());
            this.curMenu.textContent = field + ' (' + menu.element.textContent + ')';
            addClass([this.curMenu.parentElement.parentElement], ['e-node-focus', 'e-hover']);
            this.curMenu.parentElement.parentElement.setAttribute('tabindex', '0');
            this.curMenu.parentElement.parentElement.focus();
        }
    }

    /**
     * To create context menu.
     *
     * @param {MenuItemModel[]} menuItems - It represent the menuItems.
     * @param {HTMLElement} node - It represent the node data.
     * @returns {void}
     */
    private createMenu(menuItems: MenuItemModel[], node: HTMLElement): void {
        const menuOptions: ContextMenuModel = {
            cssClass: this.parentID + 'calculatedmenu' + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''),
            items: menuItems,
            enableRtl: this.parent.enableRtl,
            locale: this.parent.locale,
            // beforeOpen: this.beforeMenuOpen.bind(this),
            select: this.selectContextMenu.bind(this),
            onClose: () => {
                this.treeObj.element.focus();
                addClass([node], ['e-hover', 'e-node-focus']);
            }

        };
        let contextMenu: HTMLElement;
        if (select('#' + this.parentID + 'CalcContextmenu', document)) {
            contextMenu = select('#' + this.parentID + 'CalcContextmenu', document);
        } else {
            contextMenu = createElement('ul', {
                id: this.parentID + 'CalcContextmenu'
            });
        }
        const dialog: Dialog = getInstance(select('#' + this.parentID + 'calculateddialog', document) as HTMLElement, Dialog) as Dialog;
        dialog.element.appendChild(contextMenu);
        const menuObj: Menu = new Menu(menuOptions);
        menuObj.isStringTemplate = true;
        menuObj.appendTo(contextMenu);
    }

    /**
     * Triggers while click OK button.
     *
     * @returns {void}
     */
    private applyFormula(): void {
        const currentObj: CalculatedField = this as CalculatedField;
        let isExist: boolean = false;
        removeClass([document.getElementById(this.parentID + 'ddlelement')], cls.EMPTY_FIELD);
        const inputObj: MaskedTextBox = getInstance(
            select('#' + this.parentID + 'ddlelement', document) as HTMLElement, MaskedTextBox) as MaskedTextBox;
        this.newFields =
            extend([], (this.parent.dataSourceSettings as IDataOptions).calculatedFieldSettings, null, true) as ICalculatedFields[];
        const eventArgs: CalculatedFieldCreateEventArgs = {
            fieldName: this.isEdit ? this.currentFieldName : inputObj.value,
            calculatedField: this.getCalculatedFieldInfo(),
            calculatedFieldSettings: PivotUtil.cloneCalculatedFieldSettings(this.parent.dataSourceSettings.calculatedFieldSettings),
            cancel: false
        };
        const control: PivotView | PivotFieldList = this.parent.getModuleName() === 'pivotfieldlist' &&
            (this.parent as PivotFieldList).isPopupView ? (this.parent as PivotFieldList).pivotGridModule : this.parent;
        control.trigger(events.calculatedFieldCreate, eventArgs, (observedArgs: CalculatedFieldCreateEventArgs) => {
            if (!observedArgs.cancel) {
                const calcInfo: ICalculatedFields = observedArgs.calculatedField;
                if (!this.isEdit) {
                    if (currentObj.parent.dataType === 'olap') {
                        const field: string = calcInfo.name;
                        if (currentObj.parent.olapEngineModule.fieldList[field as string] &&
                            currentObj.parent.olapEngineModule.fieldList[field as string].type !== 'CalculatedField') {
                            isExist = true;
                        }
                    } else {
                        for (const key of Object.keys(currentObj.parent.engineModule.fieldList)) {
                            if (calcInfo.name && calcInfo.name === key &&
                                currentObj.parent.engineModule.fieldList[key as string].aggregateType !== 'CalculatedField') {
                                isExist = true;
                            }
                        }
                    }
                }
                if (isExist) {
                    currentObj.parent.pivotCommon.errorDialog.createErrorDialog(
                        currentObj.parent.localeObj.getConstant('error'), currentObj.parent.localeObj.getConstant('fieldExist'));
                    return;
                }
                this.existingReport = extend({}, this.parent.dataSourceSettings, null, true) as IDataOptions;
                const report: IDataOptions = this.parent.dataSourceSettings as IDataOptions;
                if (!isNullOrUndefined(calcInfo.name) && calcInfo.name !== '' &&
                    !isNullOrUndefined(calcInfo.caption) && calcInfo.caption !== '' && calcInfo.formula && calcInfo.formula !== '') {
                    let field: ICalculatedFields;
                    if (this.parent.dataType === 'olap') {
                        field = {
                            name: calcInfo.name,
                            formula: calcInfo.formula,
                            formatString: calcInfo.formatString
                        };
                        if (!isNullOrUndefined(calcInfo.hierarchyUniqueName)) {
                            field.hierarchyUniqueName = calcInfo.hierarchyUniqueName;
                        }
                        this.isFieldExist = false;
                        if (!this.isEdit) {
                            for (let i: number = 0; i < report.calculatedFieldSettings.length; i++) {
                                if (report.calculatedFieldSettings[i as number].name === field.name) {
                                    this.createConfirmDialog(
                                        currentObj.parent.localeObj.getConstant('alert'),
                                        currentObj.parent.localeObj.getConstant('confirmText'), calcInfo);
                                    return;
                                }
                            }
                        } else {
                            for (let i: number = 0; i < report.calculatedFieldSettings.length; i++) {
                                if (report.calculatedFieldSettings[i as number].name === field.name && this.isEdit) {
                                    report.calculatedFieldSettings[i as number].hierarchyUniqueName = calcInfo.hierarchyUniqueName;
                                    this.parent.olapEngineModule.fieldList[field.name].caption = calcInfo.caption;
                                    report.calculatedFieldSettings[i as number].formatString = field.formatString;
                                    report.calculatedFieldSettings[i as number].formula = field.formula;
                                    field = report.calculatedFieldSettings[i as number];
                                    this.updateFormatSettings(report, field.name, calcInfo.formatString);
                                    this.parent.olapEngineModule.getFormattedFields(report.formatSettings);
                                    if (this.parent.olapEngineModule.formatFields[field.name]) {
                                        if (this.parent.olapEngineModule.formatFields[field.name].format) {
                                            this.parent.olapEngineModule.formatFields[field.name].format =
                                                this.getFormat(field.formatString);
                                        } else {
                                            delete this.parent.olapEngineModule.formatFields[field.name];
                                        }
                                    }
                                    this.isFieldExist = true;
                                    break;
                                }
                            }
                            const axisFields: IFieldOptions[][] = [report.rows, report.columns, report.values, report.filters];
                            let isFieldExist: boolean = false;
                            for (const fields of axisFields) {
                                for (const item of fields) {
                                    if (item.isCalculatedField && field.name !== null &&
                                        item.name === field.name && this.isEdit) {
                                        item.caption = calcInfo.caption;
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
                            this.updateFormatSettings(report, field.name, calcInfo.formatString);
                            this.parent.olapEngineModule.getFormattedFields(report.formatSettings);
                            if (this.parent.olapEngineModule.formatFields[field.name]) {
                                if (this.parent.olapEngineModule.formatFields[field.name].format) {
                                    this.parent.olapEngineModule.formatFields[field.name].format = this.getFormat(field.formatString);
                                } else {
                                    delete this.parent.olapEngineModule.formatFields[field.name];
                                }
                            }
                        }
                        this.parent.lastCalcFieldInfo = field;
                    } else {
                        field = {
                            name: calcInfo.name,
                            caption: calcInfo.caption,
                            type: 'CalculatedField'
                        } as IFieldOptions;
                        const cField: ICalculatedFields = {
                            name: calcInfo.name,
                            formula: calcInfo.formula
                        };
                        if (!isNullOrUndefined(calcInfo.formatString)) {
                            cField.formatString = calcInfo.formatString;
                        }
                        this.isFieldExist = true;
                        if (!this.isEdit) {
                            for (let i: number = 0; i < report.values.length; i++) {
                                if (report.values[i as number].type === CALC && report.values[i as number].name === field.name) {
                                    for (let j: number = 0; j < report.calculatedFieldSettings.length; j++) {
                                        if (report.calculatedFieldSettings[j as number].name === field.name) {
                                            this.createConfirmDialog(
                                                currentObj.parent.localeObj.getConstant('alert'),
                                                currentObj.parent.localeObj.getConstant('confirmText'), calcInfo);
                                            return;
                                        }
                                    }
                                    this.isFieldExist = false;
                                }
                            }
                        } else {
                            for (let i: number = 0; i < report.values.length; i++) {
                                if (report.values[i as number].type === CALC && field.name !== null &&
                                    report.values[i as number].name === field.name && this.isEdit) {
                                    for (let j: number = 0; j < report.calculatedFieldSettings.length; j++) {
                                        if (report.calculatedFieldSettings[j as number].name === field.name) {
                                            report.values.splice(i, 1);
                                            report.values.splice(i, 0, field);
                                            this.currentFormula = report.calculatedFieldSettings[j as number].formula;
                                            report.calculatedFieldSettings.splice(j, 1);
                                            report.calculatedFieldSettings.splice(j, 0, cField);
                                            this.updateFormatSettings(report, field.name, calcInfo.formatString);
                                            this.isFieldExist = false;
                                        }
                                    }
                                }
                            }
                        }
                        if (this.isFieldExist) {
                            report.values.push(field);
                            report.calculatedFieldSettings.push(cField);
                            this.updateFormatSettings(report, field.name, calcInfo.formatString);
                        }
                        this.parent.lastCalcFieldInfo = cField;
                    }
                    this.addFormula(report, field.name);
                } else {
                    if (isNullOrUndefined(calcInfo.name) || calcInfo.name === '' ||
                        isNullOrUndefined(calcInfo.caption) || calcInfo.caption === '') {
                        const inputObj: MaskedTextBox = getInstance(
                            select('#' + this.parentID + 'ddlelement', document) as HTMLElement, MaskedTextBox) as MaskedTextBox;
                        inputObj.value = '';
                        addClass([document.getElementById(this.parentID + 'ddlelement')], cls.EMPTY_FIELD);
                        document.getElementById(this.parentID + 'ddlelement').focus();
                    } else {
                        this.parent.pivotCommon.errorDialog.createErrorDialog(
                            this.parent.localeObj.getConstant('error'), this.parent.localeObj.getConstant('invalidFormula'));
                    }
                }
            } else {
                this.endDialog();
                this.parent.lastCalcFieldInfo = {};
                this.isFormula = false;
            }
        });
    }
    private getCalculatedFieldInfo(): ICalculatedFields {
        const element: HTMLElement = select('#' + this.parentID + 'calculateddialog', document);
        const dialog: Dialog = element ? getInstance(element, Dialog) as Dialog : undefined;
        const inputObj: MaskedTextBox = getInstance(
            select('#' + this.parentID + 'ddlelement', document) as HTMLElement, MaskedTextBox) as MaskedTextBox;
        const dropField: HTMLTextAreaElement = select('#' + this.parentID + 'droppable', document) as HTMLTextAreaElement;
        const dialogElement: HTMLElement = this.parent.isAdaptive ?
            (this.parent as PivotFieldList).dialogRenderer.adaptiveElement.element : dialog.element;
        const customFormat: MaskedTextBox = getInstance(select('#' + this.parentID + 'Custom_Format_Element', dialogElement) as HTMLElement, MaskedTextBox) as MaskedTextBox;
        const field: ICalculatedFields = {
            name: this.isEdit ? this.currentFieldName : inputObj.value,
            caption: inputObj.value,
            formula: dropField.value
        };
        const ddlFormatTypes: DropDownList = getInstance(select('#' + this.parentID + 'Format_Div', dialogElement) as HTMLElement, DropDownList) as DropDownList;
        field.formatString = (ddlFormatTypes.value === 'Custom' ? customFormat.value : (ddlFormatTypes.value === 'None' ? null : ddlFormatTypes.value as string));
        if (this.parent.dataType === 'olap') {
            const memberTypeDrop: DropDownList = getInstance(select('#' + this.parentID + 'Member_Type_Div', dialogElement) as HTMLElement, DropDownList) as DropDownList;
            const hierarchyDrop: DropDownList = getInstance(select('#' + this.parentID + 'Hierarchy_List_Div', dialogElement) as HTMLElement, DropDownList) as DropDownList;
            if (memberTypeDrop.value === 'Dimension') {
                field.hierarchyUniqueName = hierarchyDrop.value as string;
            }
        }
        return field;
    }
    private updateFormatSettings(report: IDataOptions, fieldName: string, formatString: string): void {
        const newFormat: FormatSettingsModel = { name: fieldName, format: formatString, useGrouping: true };
        let isFormatExist: boolean = false;
        for (let i: number = 0; i < report.formatSettings.length; i++) {
            if (report.formatSettings[i as number].name === fieldName) {
                if (formatString === 'undefined' || formatString === undefined || formatString === '') {
                    report.formatSettings.splice(i, 1);
                    isFormatExist = true;
                    break;
                } else {
                    const formatObj: FormatSettingsModel = (<{ [key: string]: Object }>report.formatSettings[i as number]).properties ?
                        (<{ [key: string]: Object }>report.formatSettings[i as number]).properties : report.formatSettings[i as number];
                    formatObj.format = formatString;
                    report.formatSettings.splice(i, 1, formatObj);
                    isFormatExist = true;
                    break;
                }
            }
        }
        if (!isFormatExist && formatString !== '' && !isNullOrUndefined(formatString)) {
            report.formatSettings.push(newFormat);
        }
    }

    private addFormula(report: IDataOptions, field: string): void {
        this.isFormula = true;
        this.field = field;
        this.parent.setProperties({ dataSourceSettings: report }, true);
        if (this.parent.getModuleName() === 'pivotfieldlist' && ((this.parent as PivotFieldList).isDeferLayoutUpdate ||
            ((this.parent as PivotFieldList).pivotGridModule && (this.parent as PivotFieldList).pivotGridModule.pivotDeferLayoutUpdate))) {
            (this.parent as PivotFieldList).isRequiredUpdate = false;
        }
        try {
            const actionInfo: PivotActionInfo = {
                calculatedFieldInfo: this.parent.lastCalcFieldInfo
            };
            this.parent.actionObj.actionInfo = actionInfo;
            const actionName: string = (this.parent.actionObj.actionName === events.editCalculatedField) ?
                events.calculatedFieldEdited : events.calculatedFieldApplied;
            this.parent.actionObj.actionName = actionName;
            this.parent.updateDataSource(false);
            const pivot: PivotView = (this.parent.getModuleName() === 'pivotfieldlist' && (this.parent as PivotFieldList).pivotGridModule) ?
                (this.parent as PivotFieldList).pivotGridModule : (this.parent as PivotView);
            if (pivot && pivot.dataSourceSettings.mode !== 'Server') {
                this.endDialog();
            } else {
                this.isRequireUpdate = true;
            }
            if (this.parent.getModuleName() === 'pivotfieldlist' &&
                (this.parent as PivotFieldList).renderMode === 'Fixed' && (this.parent as PivotFieldList).isDeferLayoutUpdate) {
                (this.parent as PivotFieldList).pivotChange = true;
            }
        } catch (exception) {
            this.showError();
        }
    }

    /**
     *
     * @returns {void}
     * @hidden */
    public endDialog(): void {
        this.isEdit = false;
        const element: HTMLElement = select('#' + this.parentID + 'calculateddialog', document);
        const dialog: Dialog = element ? getInstance(element, Dialog) as Dialog : undefined;
        if (dialog) {
            dialog.close();
        } else {
            const inputObj: MaskedTextBox = getInstance(
                select('#' + this.parentID + 'ddlelement', document) as HTMLElement, MaskedTextBox) as MaskedTextBox;
            inputObj.value = '';
            this.currentFieldName = this.formatText = this.fieldText = this.formatType = null;
            this.formulaText = this.fieldType = this.parentHierarchy = null;
            const dialogElement: HTMLElement =
                this.parent.isAdaptive ?
                    (this.parent as PivotFieldList).dialogRenderer.parentElement : dialog.element;
            ((this.parent as PivotFieldList).dialogRenderer.parentElement.querySelector('.' + cls.CALCINPUT) as HTMLInputElement).value = '';
            (select('#' + this.parentID + 'droppable', (this.parent as PivotFieldList).dialogRenderer.parentElement) as HTMLTextAreaElement).value = '';
            (select('#' + this.parentID + 'Custom_Format_Element', (this.parent as PivotFieldList).dialogRenderer.parentElement) as HTMLTextAreaElement).value = '';
            if (this.parent.dataType === 'olap') {
                const memberTypeDrop: DropDownList = getInstance(select('#' + this.parentID + 'Member_Type_Div', dialogElement) as HTMLElement, DropDownList) as DropDownList;
                const hierarchyDrop: DropDownList = getInstance(select('#' + this.parentID + 'Hierarchy_List_Div', dialogElement) as HTMLElement, DropDownList) as DropDownList;
                memberTypeDrop.index = 0;
                memberTypeDrop.readonly = false;
                memberTypeDrop.dataBind();
                hierarchyDrop.index = 0;
                hierarchyDrop.enabled = false;
                hierarchyDrop.dataBind();
            }
            const customFormat: MaskedTextBox = getInstance(select('#' + this.parentID + 'Custom_Format_Element', dialogElement) as HTMLElement, MaskedTextBox) as MaskedTextBox;
            const ddlFormatTypes: DropDownList = getInstance(select('#' + this.parentID + 'Format_Div', dialogElement) as HTMLElement, DropDownList) as DropDownList;
            ddlFormatTypes.index = this.parent.dataType === 'olap' ? 0 : 4;
            ddlFormatTypes.dataBind();
            customFormat.enabled = false;
            customFormat.dataBind();
        }
    }

    /**
     *
     * @returns {void}
     * @hidden */
    public showError(): void {
        if (this.parent.engineModule.fieldList[this.field]) {
            delete this.parent.engineModule.fieldList[this.field];
        }
        this.parent.pivotCommon.errorDialog.createErrorDialog(
            this.parent.localeObj.getConstant('error'), this.parent.localeObj.getConstant('invalidFormula'));
        this.parent.setProperties({ dataSourceSettings: this.existingReport }, true);
        if (this.isEdit) {
            const calcFields: CalculatedFieldSettingsModel[] = this.parent.dataSourceSettings.calculatedFieldSettings;
            for (let i: number = 0; calcFields && i < calcFields.length; i++) {
                if (calcFields[i as number].name === this.field) {
                    calcFields[i as number].formula = this.currentFormula;
                    break;
                }
            }
        } else if (this.parent.engineModule.fields) {
            for (let i: number = 0; i < this.parent.engineModule.fields.length; i++) {
                if (this.parent.engineModule.fields[i as number] === this.field) {
                    this.parent.engineModule.fields.splice(i, 1);
                    break;
                }
            }
        }
        this.parent.lastCalcFieldInfo = {};
        this.parent.updateDataSource(false);
        this.isFormula = false;
    }

    /**
     * To get treeview data
     *
     * @param  {PivotView | PivotFieldList} parent - It represent the parent.
     * @returns {any} - Field List Data.
     */
    private getFieldListData(parent: PivotView | PivotFieldList): { [key: string]: Object }[] {
        let fields: { [key: string]: Object }[] = [];
        if (this.parent.dataType === 'olap') {
            fields =
                PivotUtil.getClonedData(parent.olapEngineModule.fieldListData ?
                    parent.olapEngineModule.fieldListData as { [key: string]: Object }[] : []);
            for (const item of fields as IOlapField[]) {
                if (item.spriteCssClass &&
                    (item.spriteCssClass.indexOf('e-attributeCDB-icon') > -1 ||
                        item.spriteCssClass.indexOf('e-level-members') > -1)) {
                    item.hasChildren = true;
                } else if (item.spriteCssClass &&
                    (item.spriteCssClass.indexOf('e-namedSetCDB-icon') > -1)) {
                    item.hasChildren = false;
                } else if (item.spriteCssClass &&
                    (item.spriteCssClass.indexOf('e-calcMemberGroupCDB') > -1)) {
                    item.expanded = this.isEdit;
                }
            }
        } else {
            for (const key of (parent.engineModule.fieldList ? Object.keys(parent.engineModule.fieldList) : [])) {
                let type: string = null;
                let typeVal: string = null;
                const field: IField = parent.engineModule.fieldList[key as string];
                if ((field.type !== 'number' || parent.engineModule.fieldList[key as string].type === 'include' || parent.engineModule.fieldList[key as string].type === 'exclude') && field.aggregateType !== 'DistinctCount') {
                    typeVal = COUNT;
                } else {
                    typeVal = field.aggregateType !== undefined ?
                        (field.aggregateType) : SUM;
                }
                type = this.parent.localeObj.getConstant(typeVal);
                fields.push({
                    index: field.index,
                    name: (this.parent.enableHtmlSanitizer ?
                        SanitizeHtmlHelper.sanitize(field.caption) : field.caption) + ' (' + type + ')',
                    type: typeVal,
                    icon: cls.FORMAT + ' ' + cls.ICON,
                    formula: (this.parent.enableHtmlSanitizer ?
                        SanitizeHtmlHelper.sanitize(field.formula) : field.formula),
                    field: (this.parent.enableHtmlSanitizer ?
                        SanitizeHtmlHelper.sanitize(key) : key),
                    caption: this.parent.enableHtmlSanitizer ?
                        SanitizeHtmlHelper.sanitize(field.caption ? field.caption : key) : field.caption ? field.caption : key
                });
            }
        }
        return fields;
    }

    /**
     * Trigger while drop node in formula field.
     *
     * @param {DragAndDropEventArgs} args - It contains the value of args.
     * @returns {void}
     */
    private fieldDropped(args: DragAndDropEventArgs): void {
        args.cancel = true;
        const dialog: Dialog = getInstance(select('#' + this.parentID + 'calculateddialog', document) as HTMLElement, Dialog) as Dialog;
        const dropField: HTMLTextAreaElement = select('#' + this.parentID + 'droppable', dialog.element) as HTMLTextAreaElement;
        removeClass([dropField], 'e-copy-drop');
        removeClass([args.draggedNode.querySelector('.' + cls.LIST_TEXT_CLASS)], cls.SELECTED_NODE_CLASS);
        let field: string = args.draggedNode.getAttribute('data-field');
        if (this.parent.dataType === 'olap') {
            if (this.parent.olapEngineModule.fieldList[field as string] &&
                this.parent.olapEngineModule.fieldList[field as string].isCalculatedField) {
                field = this.parent.olapEngineModule.fieldList[field as string].tag;
            }
            if (args.target.id === this.parentID + 'droppable' && dropField.value === '') {
                dropField.value = field;
                dropField.focus();
            } else if (args.target.id === (this.parentID + 'droppable') && dropField.value !== '') {
                const currentValue: string = dropField.value;
                const cursorPos: number = dropField.selectionStart;
                const textAfterText: string = currentValue.substring(cursorPos, currentValue.length);
                const textBeforeText: string = currentValue.substring(0, cursorPos);
                const textCovered: string = textBeforeText + field;
                dropField.value = textBeforeText + field + textAfterText;
                dropField.focus();
                dropField.setSelectionRange(textCovered.length, textCovered.length);
            } else {
                args.cancel = true;
            }
        } else {
            const type: string = args.draggedNode.getAttribute('data-type');
            if (args.target.id === this.parentID + 'droppable' && dropField.value === '') {
                if (type === CALC) {
                    dropField.value = args.draggedNodeData.id.toString();
                } else {
                    dropField.value = '"' + type + '(' + field + ')' + '"';
                }
                dropField.focus();
            } else if (args.target.id === (this.parentID + 'droppable') && dropField.value !== '') {
                let textCovered: string;
                const cursorPos: number = dropField.selectionStart;
                const currentValue: string = dropField.value;
                const textBeforeText: string = currentValue.substring(0, cursorPos);
                const textAfterText: string = currentValue.substring(cursorPos, currentValue.length);
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
     *
     * @returns {void}
     */
    private createDialog(): void {
        if (select('#' + this.parentID + 'calculateddialog', document) !== null) {
            remove(select('#' + this.parentID + 'calculateddialog', document));
            while (!isNullOrUndefined(document.querySelector('.' + this.parentID + 'calculatedmenu'))) {
                remove(document.querySelector('.' + this.parentID + 'calculatedmenu'));
            }
        }
        const calculatedFieldElement: HTMLElement = createElement('div', {
            id: this.parentID + 'calculateddialog',
            className: cls.CALCDIALOG + ' ' + (this.parent.dataType === 'olap' ? cls.OLAP_CALCDIALOG : '')
        });
        this.parent.element.appendChild(calculatedFieldElement);
        const calcButtons: ButtonPropsModel[] = [
            {
                click: this.applyFormula.bind(this),
                isFlat: false,
                buttonModel: {
                    content: this.parent.localeObj.getConstant('ok'),
                    isPrimary: true,
                    cssClass: this.parent.cssClass
                }
            },
            {
                click: this.cancelClick.bind(this),
                isFlat: false,
                buttonModel: {
                    content: this.parent.localeObj.getConstant('cancel'),
                    cssClass: this.parent.cssClass
                }
            }
        ];
        if (this.parent.dataType === 'olap') {
            const clearButton: ButtonPropsModel = {
                click: this.clearFormula.bind(this),
                isFlat: false,
                buttonModel: {
                    cssClass: 'e-calc-clear-btn' + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''),
                    content: this.parent.localeObj.getConstant('clear')
                }
            };
            calcButtons.splice(0, 0, clearButton);
        }
        const dialog: Dialog = new Dialog({
            allowDragging: true,
            position: { X: 'center', Y: 'center' },
            buttons: calcButtons,
            close: this.closeDialog.bind(this),
            beforeOpen: this.beforeOpen.bind(this),
            open: () => {
                if (select('#' + this.parentID + 'ddlelement', dialog.element)) {
                    (select('#' + this.parentID + 'ddlelement', dialog.element) as HTMLElement).focus();
                }
            },
            animationSettings: { effect: 'Zoom' },
            width: '25%',
            isModal: true,
            closeOnEscape: true,
            enableRtl: this.parent.enableRtl,
            locale: this.parent.locale,
            enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
            showCloseIcon: true,
            header: this.parent.localeObj.getConstant('createCalculatedField'),
            target: document.body,
            cssClass: this.parent.cssClass
        });
        dialog.isStringTemplate = true;
        dialog.appendTo(calculatedFieldElement);
    }

    private cancelClick(): void {
        const dialog: Dialog = getInstance(
            select('#' + this.parentID + 'calculateddialog', document), Dialog) as Dialog;
        dialog.close();
        this.isEdit = false;
    }

    private beforeOpen(): void {
        const dialog: Dialog = getInstance(
            select('#' + this.parentID + 'calculateddialog', document) as HTMLElement, Dialog) as Dialog;
        // dialog.element.querySelector('.e-dlg-header').innerText = this.parent.localeObj.getConstant('createCalculatedField');
        dialog.element.querySelector('.e-dlg-header').setAttribute('title', this.parent.localeObj.getConstant('createCalculatedField'));
    }

    private closeDialog(): void {
        if (this.parent.getModuleName() === 'pivotfieldlist') {
            this.parent.axisFieldModule.render();
            if ((this.parent as PivotFieldList).renderMode !== 'Fixed') {
                addClass([this.parent.element.querySelector('.' + cls.TOGGLE_FIELD_LIST_CLASS)], cls.ICON_HIDDEN);
                (this.parent as PivotFieldList).dialogRenderer.fieldListDialog.show();
            }
        }
        this.destroy();
        if (!isNullOrUndefined(document.getElementById(this.parentID + 'calculateddialog'))) {
            remove(document.getElementById(this.parentID + 'calculateddialog'));
        }
        if (!isNullOrUndefined(document.querySelector('.' + this.parentID + 'calculatedmenu'))) {
            remove(document.querySelector('.' + this.parentID + 'calculatedmenu'));
        }
        const timeOut: number = ((this.parent.getModuleName() === 'pivotview') ||
            ((this.parent.getModuleName() === 'pivotfieldlist') &&
                (this.parent as PivotFieldList).renderMode === 'Fixed')) ? 0 : 500;
        if (this.buttonCall) {
            this.buttonCall = false;
            setTimeout(this.setFocus.bind(this), timeOut);
        }
    }

    private setFocus(): void {
        let parentElement: HTMLElement;
        if (this.parent.getModuleName() === 'pivotview' && this.parent.element) {
            parentElement = this.parent.element;
        } else if (document.getElementById(this.parent.element.id + '_Container')) {
            parentElement = document.getElementById(this.parent.element.id + '_Container');
        }
        if (parentElement) {
            const pivotButtons: HTMLElement[] = [].slice.call(parentElement.querySelectorAll('.e-pivot-button'));
            for (const item of pivotButtons) {
                if (item.getAttribute('data-uid') === this.currentFieldName) {
                    item.focus();
                    break;
                }
            }
        }
    }
    /**
     * To render dialog elements.
     *
     * @returns {void}
     */
    private renderDialogElements(): HTMLElement {
        const outerDiv: HTMLElement = createElement('div', {
            id: this.parentID + 'outerDiv',
            className: (this.parent.dataType === 'olap' ? cls.OLAP_CALCOUTERDIV + ' ' : '') + cls.CALCOUTERDIV
        });
        const olapFieldTreeDiv: HTMLElement = createElement('div', { id: this.parentID + 'Olap_Tree_Div', className: 'e-olap-field-tree-div' });
        const pivotCalcDiv: HTMLElement = createElement('div', { id: this.parentID + 'Pivot_Calc_Div', className: 'e-pivot-calculated-div' });
        if (this.parent.getModuleName() === 'pivotfieldlist' && (this.parent as PivotFieldList).
            dialogRenderer.parentElement.querySelector('.' + cls.FORMULA) !== null && this.parent.isAdaptive) {
            const accordDiv: HTMLElement = createElement('div', { id: this.parentID + 'accordDiv', className: cls.CALCACCORD });
            outerDiv.appendChild(accordDiv);
            const buttonDiv: HTMLElement = createElement('div', { id: this.parentID + 'buttonDiv', className: cls.CALCBUTTONDIV });
            const addBtn: HTMLElement = createElement('button', {
                id: this.parentID + 'addBtn',
                className: cls.CALCADDBTN, attrs: { 'type': 'button' }
            });
            addBtn.innerText = this.parent.localeObj.getConstant('add');
            const cancelBtn: HTMLElement = createElement('button', {
                id: this.parentID + 'cancelBtn',
                className: cls.CALCCANCELBTN, attrs: { 'type': 'button' }
            });
            cancelBtn.innerText = this.parent.localeObj.getConstant('cancel');
            buttonDiv.appendChild(cancelBtn);
            buttonDiv.appendChild(addBtn);
            outerDiv.appendChild(buttonDiv);
        } else {
            if (!this.parent.isAdaptive && this.parent.dataType === 'olap') {
                const formulaTitle: HTMLElement = createElement('div', {
                    className: cls.PIVOT_FIELD_TITLE_CLASS, id: this.parentID + '_' + 'FieldNameTitle'
                });
                formulaTitle.innerText = this.parent.localeObj.getConstant('fieldTitle');
                pivotCalcDiv.appendChild(formulaTitle);
            }
            const inputDiv: HTMLElement = createElement('div', { id: this.parentID + 'innerDiv', className: cls.CALCINPUTDIV });
            const inputObj: HTMLInputElement = createElement('input', {
                id: this.parentID + 'ddlelement',
                attrs: { 'type': 'text' },
                className: cls.CALCINPUT
            }) as HTMLInputElement;
            inputDiv.appendChild(inputObj);
            if (this.parent.dataType === 'olap' && !this.parent.isAdaptive) {
                pivotCalcDiv.appendChild(inputDiv);
            } else {
                outerDiv.appendChild(inputDiv);
            }
            const wrapDiv: HTMLElement = createElement('div', { id: this.parentID + 'control_container', className: cls.TREEVIEWOUTER });
            if (!this.parent.isAdaptive) {
                const fieldTitle: HTMLElement = createElement('div', {
                    className: cls.PIVOT_ALL_FIELD_TITLE_CLASS
                });
                fieldTitle.innerText = (this.parent.dataType === 'olap' ? this.parent.localeObj.getConstant('allFields') :
                    this.parent.localeObj.getConstant('formulaField'));
                if (this.parent.dataType === 'olap') {
                    const headerWrapperDiv: HTMLElement = createElement('div', { className: cls.PIVOT_ALL_FIELD_TITLE_CLASS + '-container' });
                    headerWrapperDiv.appendChild(fieldTitle);
                    const spanElement: HTMLElement = createElement('span', {
                        attrs: {
                            'tabindex': '0',
                            'aria-disabled': 'false',
                            'aria-label': this.parent.localeObj.getConstant('fieldTooltip'),
                            'role': 'button'
                        },
                        className: cls.ICON + ' ' + cls.CALC_INFO
                    });
                    headerWrapperDiv.appendChild(spanElement);
                    const tooltip: Tooltip = new Tooltip({
                        content: this.parent.localeObj.getConstant('fieldTooltip'),
                        position: (this.parent.enableRtl ? 'RightCenter' : 'LeftCenter'),
                        target: '.' + cls.CALC_INFO,
                        offsetY: (this.parent.enableRtl ? -10 : -10),
                        locale: this.parent.locale,
                        enableRtl: this.parent.enableRtl,
                        enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
                        width: 220,
                        cssClass: this.parent.cssClass
                    });
                    tooltip.appendTo(headerWrapperDiv);
                    wrapDiv.appendChild(headerWrapperDiv);
                } else {
                    outerDiv.appendChild(fieldTitle);
                }
            }
            const treeOuterDiv: HTMLElement = createElement('div', { className: cls.TREEVIEW + '-outer-div' });
            wrapDiv.appendChild(treeOuterDiv);
            const treeElement: HTMLElement = createElement('div', { id: this.parentID + 'tree', className: cls.TREEVIEW });
            treeOuterDiv.appendChild(treeElement);
            if (this.parent.dataType === 'olap' && !this.parent.isAdaptive) {
                olapFieldTreeDiv.appendChild(wrapDiv);
            } else {
                outerDiv.appendChild(wrapDiv);
            }
            if (!this.parent.isAdaptive) {
                const formulaTitle: HTMLElement = createElement('div', {
                    className: cls.PIVOT_FORMULA_TITLE_CLASS
                });
                formulaTitle.innerText = (this.parent.dataType === 'olap' ? this.parent.localeObj.getConstant('expressionField') :
                    this.parent.localeObj.getConstant('formula'));
                if (this.parent.dataType === 'olap') {
                    pivotCalcDiv.appendChild(formulaTitle);
                } else {
                    outerDiv.appendChild(formulaTitle);
                }
            }
            const dropDiv: HTMLElement = createElement('textarea', {
                id: this.parentID + 'droppable',
                className: cls.FORMULA + ' e-control e-textbox e-input',
                attrs: {
                    'placeholder': this.parent.isAdaptive ? this.parent.localeObj.getConstant('dropTextMobile') :
                        (this.parent.dataType === 'olap' ? this.parent.localeObj.getConstant('olapDropText') :
                            this.parent.localeObj.getConstant('dropText'))
                }
            });
            if (this.parent.dataType === 'olap' && !this.parent.isAdaptive) {
                pivotCalcDiv.appendChild(dropDiv);
            } else {
                outerDiv.appendChild(dropDiv);
            }
            if (this.parent.isAdaptive) {
                const buttonDiv: HTMLElement = createElement('div', { id: this.parentID + 'buttonDiv', className: cls.CALCBUTTONDIV });
                const okBtn: HTMLElement = createElement('button', {
                    id: this.parentID + 'okBtn',
                    className: cls.CALCOKBTN, attrs: { 'type': 'button' }
                });
                okBtn.innerText = this.parent.localeObj.getConstant('apply');
                buttonDiv.appendChild(okBtn);
                outerDiv.appendChild(buttonDiv);
            }
            if (this.parent.dataType === 'olap') {
                if (!this.parent.isAdaptive) {
                    const memberTypeTitle: HTMLElement = createElement('div', {
                        className: cls.OLAP_MEMBER_TITLE_CLASS
                    });
                    memberTypeTitle.innerText = this.parent.localeObj.getConstant('memberType');
                    pivotCalcDiv.appendChild(memberTypeTitle);
                }
                const memberTypeDrop: HTMLElement = createElement('div', { id: this.parentID + 'Member_Type_Div', className: cls.CALC_MEMBER_TYPE_DIV });
                if (this.parent.isAdaptive) {
                    outerDiv.appendChild(memberTypeDrop);
                } else {
                    pivotCalcDiv.appendChild(memberTypeDrop);
                    const hierarchyTitle: HTMLElement = createElement('div', {
                        className: cls.OLAP_HIERARCHY_TITLE_CLASS
                    });
                    hierarchyTitle.innerText = this.parent.localeObj.getConstant('selectedHierarchy');
                    pivotCalcDiv.appendChild(hierarchyTitle);
                }
                const hierarchyDrop: HTMLElement = createElement('div', {
                    id: this.parentID + 'Hierarchy_List_Div', className: cls.CALC_HIERARCHY_LIST_DIV
                });
                if (this.parent.isAdaptive) {
                    outerDiv.appendChild(hierarchyDrop);
                } else {
                    pivotCalcDiv.appendChild(hierarchyDrop);
                }
            }
            if (!this.parent.isAdaptive) {
                const formatTitle: HTMLElement = createElement('div', {
                    className: cls.PIVOT_FORMAT_TITLE_CLASS
                });
                formatTitle.innerText = this.parent.localeObj.getConstant('formatString');
                pivotCalcDiv.appendChild(formatTitle);
            }
            const ddlFormatTypes: HTMLElement = createElement('div', {
                id: this.parentID + 'Format_Div', className: cls.CALC_FORMAT_TYPE_DIV
            });
            if (this.parent.isAdaptive) {
                outerDiv.appendChild(ddlFormatTypes);
            } else {
                pivotCalcDiv.appendChild(ddlFormatTypes);
            }
            const customFormatDiv: HTMLElement = createElement('div', {
                id: this.parentID + 'custom_Format_Div',
                className: cls.PIVOT_CALC_CUSTOM_FORMAT_INPUTDIV
            });
            const customFormatObj: HTMLInputElement = createElement('input', {
                id: this.parentID + 'Custom_Format_Element',
                attrs: { 'type': 'text' },
                className: cls.CALC_FORMAT_INPUT
            }) as HTMLInputElement;
            customFormatDiv.appendChild(customFormatObj);
            pivotCalcDiv.appendChild(customFormatDiv);
            if (this.parent.isAdaptive) {
                outerDiv.appendChild(customFormatDiv);
            } else {
                pivotCalcDiv.appendChild(customFormatDiv);
            }
            if (this.parent.getModuleName() === 'pivotfieldlist' && (this.parent as PivotFieldList).
                dialogRenderer.parentElement.querySelector('.' + cls.FORMULA) === null && this.parent.isAdaptive) {
                const okBtn: HTMLElement = outerDiv.querySelector('.' + cls.CALCOKBTN);
                outerDiv.appendChild(okBtn);
            } else {
                if (this.parent.dataType === 'olap') {
                    outerDiv.appendChild(olapFieldTreeDiv);
                }
                outerDiv.appendChild(pivotCalcDiv);
            }
        }
        return outerDiv;
    }

    /**
     * To create calculated field adaptive layout.
     *
     * @param {boolean} isEdit - It contains the value of isEdit
     * @returns {void}
     */
    private renderAdaptiveLayout(isEdit: boolean): void {
        const dialogElement: Tab = (this.parent as PivotFieldList).dialogRenderer.adaptiveElement;
        if (isEdit) {
            if (select('#' + this.parentID + 'droppable', dialogElement.element)) {
                const inputObj: MaskedTextBox = getInstance(
                    select('#' + this.parentID + 'ddlelement', document) as HTMLElement, MaskedTextBox) as MaskedTextBox;
                this.formulaText = (select('#' + this.parentID + 'droppable', document) as HTMLTextAreaElement).value;
                this.fieldText = inputObj.value;
            }
            if (dialogElement.element.querySelector('.' + cls.CALC_MEMBER_TYPE_DIV) as HTMLTextAreaElement) {
                const memberTypeDrop: DropDownList = getInstance(select('#' + this.parentID + 'Member_Type_Div', dialogElement.element) as HTMLElement, DropDownList) as DropDownList;
                this.fieldType = memberTypeDrop.value as string;
            }
            if (dialogElement.element.querySelector('.' + cls.CALC_HIERARCHY_LIST_DIV) as HTMLTextAreaElement) {
                const hierarchyDrop: DropDownList = getInstance(select('#' + this.parentID + 'Hierarchy_List_Div', dialogElement.element) as HTMLElement, DropDownList) as DropDownList;
                this.parentHierarchy = this.fieldType === 'Dimension' ? hierarchyDrop.value as string : null;
            }
            if (dialogElement.element.querySelector('.' + cls.CALC_FORMAT_TYPE_DIV) as HTMLTextAreaElement) {
                const ddlFormatTypes: DropDownList = getInstance(select('#' + this.parentID + 'Format_Div', dialogElement.element) as HTMLElement, DropDownList) as DropDownList;
                this.formatType = ddlFormatTypes.value as string;
            }
            if (dialogElement.element.querySelector('.' + cls.CALC_FORMAT_INPUT) as HTMLTextAreaElement) {
                const customFormat: MaskedTextBox = getInstance(select('#' + this.parentID + 'Custom_Format_Element', dialogElement.element) as HTMLElement, MaskedTextBox) as MaskedTextBox;
                this.formatText = (this.parent.dataType === 'olap' ? this.formatType : this.getFormat(this.formatType)) === 'Custom' ? customFormat.value : null;
            }
        } else {
            this.currentFieldName = this.formulaText = this.fieldText = this.formatText = null;
            this.fieldType = this.formatType = this.parentHierarchy = null;
        }
        this.renderMobileLayout(dialogElement);
    }

    /**
     * To update calculated field info in adaptive layout.
     *
     * @param {boolean} isEdit - isEdit.
     * @param {string} fieldName - fieldName.
     * @returns {void}
     * @hidden
     */
    public updateAdaptiveCalculatedField(isEdit: boolean, fieldName?: string): void {
        const dialogElement: HTMLElement = (this.parent as PivotFieldList).dialogRenderer.adaptiveElement.element;
        this.isEdit = isEdit;
        const calcInfo: IOlapField = (isEdit ? (this.parent.dataType === 'pivot' ?
            this.parent.engineModule.fieldList[fieldName as string] : this.parent.olapEngineModule.fieldList[fieldName as string]) :
            {
                id: null, caption: null, formula: null, fieldType: 'Measure',
                formatString: (this.parent.dataType === 'pivot' ? null : 'Standard'), parentHierarchy: null
            });
        this.currentFieldName = calcInfo.id;
        const inputObj: MaskedTextBox = getInstance(
            select('#' + this.parentID + 'ddlelement', document) as HTMLElement, MaskedTextBox) as MaskedTextBox;
        if (select('#' + this.parentID + 'droppable', document)) {
            this.formulaText = (select('#' + this.parentID + 'droppable', document) as HTMLTextAreaElement).value = calcInfo.formula;
            this.fieldText = inputObj.value = calcInfo.caption;
            inputObj.dataBind();
        }
        if (dialogElement.querySelector('.' + cls.CALC_MEMBER_TYPE_DIV) as HTMLTextAreaElement) {
            const memberTypeDrop: DropDownList = getInstance(select('#' + this.parentID + 'Member_Type_Div', dialogElement) as HTMLElement, DropDownList) as DropDownList;
            this.fieldType = memberTypeDrop.value = calcInfo.fieldType;
            memberTypeDrop.readonly = isEdit ? true : false;
            memberTypeDrop.dataBind();
        }
        if (dialogElement.querySelector('.' + cls.CALC_HIERARCHY_LIST_DIV) as HTMLTextAreaElement) {
            const hierarchyDrop: DropDownList = getInstance(select('#' + this.parentID + 'Hierarchy_List_Div', dialogElement) as HTMLElement, DropDownList) as DropDownList;
            if (this.fieldType === 'Dimension') {
                this.parentHierarchy = hierarchyDrop.value = calcInfo.parentHierarchy;
            } else {
                this.parentHierarchy = null;
                hierarchyDrop.index = 0;
            }
            hierarchyDrop.dataBind();
        }
        if (dialogElement.querySelector('.' + cls.CALC_FORMAT_TYPE_DIV) as HTMLTextAreaElement) {
            const ddlFormatTypes: DropDownList = getInstance(select('#' + this.parentID + 'Format_Div', dialogElement) as HTMLElement, DropDownList) as DropDownList;
            this.formatType = ddlFormatTypes.value = (this.formatTypes.indexOf(calcInfo.formatString) > -1 ? calcInfo.formatString : 'Custom');
        }
        if (dialogElement.querySelector('.' + cls.CALC_FORMAT_INPUT) as HTMLTextAreaElement) {
            const customFormat: MaskedTextBox = getInstance(select('#' + this.parentID + 'Custom_Format_Element', dialogElement) as HTMLElement, MaskedTextBox) as MaskedTextBox;
            const formatObj: IFormatSettings =
                PivotUtil.getFieldByName(fieldName, this.parent.dataSourceSettings.formatSettings) as IFormatSettings;
            if (this.parent.dataType === 'pivot') {
                this.formatText = customFormat.value = formatObj ? formatObj.format : null;
            } else {
                this.formatText = customFormat.value = (this.formatType === 'Custom' ? calcInfo.formatString : null);
            }
            customFormat.dataBind();
        }
    }

    /**
     * To create treeview.
     *
     * @returns {void}
     */
    private createDropElements(): void {
        const dialog: Dialog = select('#' + this.parentID + 'calculateddialog', document) ? getInstance(
            select('#' + this.parentID + 'calculateddialog', document) as HTMLElement, Dialog) as Dialog : null;
        const dialogElement: HTMLElement = (this.parent.isAdaptive ?
            (this.parent as PivotFieldList).dialogRenderer.parentElement : dialog.element);
        const fData: { [key: string]: Object }[] = [];
        const fieldData: { [key: string]: Object }[] = [];
        for (const format of this.formatTypes) {
            fData.push({ value: (this.parent.dataType === 'pivot' ? this.getFormat(format) : format), text: this.parent.localeObj.getConstant(format) });
        }
        if (this.parent.dataType === 'olap') {
            const mData: { [key: string]: Object }[] = [];
            const memberTypeData: string[] = ['Measure', 'Dimension'];
            for (const type of memberTypeData) {
                mData.push({ value: type, text: this.parent.localeObj.getConstant(type) });
            }
            const fields: { [key: string]: Object }[] =
                PivotUtil.getClonedData(this.parent.olapEngineModule.fieldListData as { [key: string]: Object }[]);
            for (const item of fields as IOlapField[]) {
                if (item.spriteCssClass &&
                    (item.spriteCssClass.indexOf('e-attributeCDB-icon') > -1 ||
                        item.spriteCssClass.indexOf('e-hierarchyCDB-icon') > -1)) {
                    fieldData.push({ value: item.id, text: item.caption });
                }
            }
            const memberTypeObj: DropDownList = new DropDownList({
                dataSource: mData, enableRtl: this.parent.enableRtl, locale: this.parent.locale,
                fields: { value: 'value', text: 'text' },
                value: this.fieldType !== null ? this.fieldType : mData[0].value as string,
                readonly: this.isEdit,
                cssClass: cls.MEMBER_OPTIONS_CLASS + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''), width: '100%',
                change: (args: ChangeEventArgs) => {
                    hierarchyListObj.enabled = args.value === 'Dimension' ? true : false;
                    this.fieldType = args.value as string;
                    this.formulaText = (select('#' + this.parentID + 'droppable', document) as HTMLTextAreaElement).value;
                    hierarchyListObj.dataBind();
                }
            });
            memberTypeObj.isStringTemplate = true;
            memberTypeObj.appendTo(select('#' + this.parentID + 'Member_Type_Div', dialogElement) as HTMLElement);
            const hierarchyListObj: DropDownList = new DropDownList({
                dataSource: fieldData, enableRtl: this.parent.enableRtl, locale: this.parent.locale,
                allowFiltering: true,
                enabled: memberTypeObj.value === 'Dimension' ? true : false,
                filterBarPlaceholder: this.parent.localeObj.getConstant('example') + ' ' + fieldData[0].text.toString(),
                fields: { value: 'value', text: 'text' },
                value: this.parentHierarchy !== null && memberTypeObj.value === 'Dimension' ?
                    this.parentHierarchy : fieldData[0].value as string,
                cssClass: cls.MEMBER_OPTIONS_CLASS + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''), width: '100%',
                change: (args: ChangeEventArgs) => {
                    this.parentHierarchy = args.value as string;
                    this.formulaText = (select('#' + this.parentID + 'droppable', document) as HTMLTextAreaElement).value;
                }
            });
            hierarchyListObj.isStringTemplate = true;
            hierarchyListObj.appendTo(select('#' + this.parentID + 'Hierarchy_List_Div', dialogElement) as HTMLElement);
        }
        const formatStringObj: DropDownList = new DropDownList({
            dataSource: fData, enableRtl: this.parent.enableRtl, locale: this.parent.locale,
            fields: { value: 'value', text: 'text' },
            value: this.parent.isAdaptive && this.formatType !== null ? this.formatType as string
                : this.parent.dataType === 'olap' ? fData[0].value as string : fData[4].value as string,
            cssClass: cls.MEMBER_OPTIONS_CLASS + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''), width: '100%',
            change: (args: ChangeEventArgs) => {
                customerFormatObj.enabled = args.value === 'Custom' ? true : false;
                this.formatType = args.value as string;
                this.formulaText = (select('#' + this.parentID + 'droppable', document) as HTMLTextAreaElement).value;
                customerFormatObj.dataBind();
            }
        });
        formatStringObj.isStringTemplate = true;
        formatStringObj.appendTo(select('#' + this.parentID + 'Format_Div', dialogElement) as HTMLElement);
        const customerFormatObj: MaskedTextBox = new MaskedTextBox({
            placeholder: this.parent.localeObj.getConstant('customFormat'),
            locale: this.parent.locale, enableRtl: this.parent.enableRtl,
            value: this.formatText !== null && formatStringObj.value === 'Custom' ? this.formatText : null,
            enabled: formatStringObj.value === 'Custom' ? true : false,
            change: (args: MaskChangeEventArgs) => {
                this.formatText = args.value;
                this.formulaText = (select('#' + this.parentID + 'droppable', document) as HTMLTextAreaElement).value;
            },
            cssClass: this.parent.cssClass
        });
        customerFormatObj.isStringTemplate = true;
        customerFormatObj.appendTo(select('#' + this.parentID + 'Custom_Format_Element', dialogElement) as HTMLElement);
    }
    private getFormat(pivotFormat: string): string {
        let format: string = pivotFormat;
        if (this.parent.dataType !== 'olap') {
            switch (format) {
            case 'Standard':
                format = 'N';
                break;
            case 'Currency':
                format = 'C';
                break;
            case 'Percent':
                format = 'P';
                break;
            case 'N':
                format = 'Standard';
                break;
            case 'C':
                format = 'Currency';
                break;
            case 'P':
                format = 'Percent';
                break;
            }
        } else {
            switch (format) {
            case 'Standard':
                format = 'N';
                break;
            case 'Currency':
                format = 'C';
                break;
            case 'Percent':
                format = 'P';
                break;
            }
        }
        return format;
    }
    /**
     * To create treeview.
     *
     * @returns {void}
     */
    private createTreeView(): void {
        const dialog: Dialog = select('#' + this.parentID + 'calculateddialog', document) ? getInstance(
            select('#' + this.parentID + 'calculateddialog', document) as HTMLElement, Dialog) as Dialog : null;
        const dialogElement: HTMLElement = (this.parent.isAdaptive ?
            (this.parent as PivotFieldList).dialogRenderer.parentElement : dialog.element);
        if (this.parent.dataType === 'olap') {
            this.treeObj = new TreeView({
                fields: { dataSource: this.getFieldListData(this.parent), id: 'id', text: 'caption', parentID: 'pid', iconCss: 'spriteCssClass' },
                allowDragAndDrop: true,
                enableRtl: this.parent.enableRtl,
                enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
                locale: this.parent.locale,
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
                cssClass: this.parent.cssClass
            });
        } else {
            this.treeObj = new TreeView({
                fields: { dataSource: this.getFieldListData(this.parent), id: 'formula', text: 'name', iconCss: 'icon' },
                allowDragAndDrop: true,
                enableRtl: this.parent.enableRtl,
                enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
                locale: this.parent.locale,
                cssClass: this.parent.cssClass,
                nodeCollapsing: this.nodeCollapsing.bind(this),
                nodeDragStart: this.dragStart.bind(this),
                nodeClicked: this.fieldClickHandler.bind(this),
                nodeDragStop: this.fieldDropped.bind(this),
                drawNode: this.drawTreeNode.bind(this),
                keyPress: (args: NodeKeyPressEventArgs) => {
                    if (args.event.keyCode === 39) {
                        args.cancel = true;
                    }
                },
                sortOrder: 'Ascending'
            });
        }
        this.treeObj.isStringTemplate = true;
        this.treeObj.appendTo(select('#' + this.parentID + 'tree', dialogElement) as HTMLElement);
    }
    private updateNodeIcon(args: NodeExpandEventArgs): void {
        if (args.node && args.node.querySelector('.e-list-icon') &&
            args.node.querySelector('.e-icon-expandable.e-process') &&
            (args.node.querySelector('.e-list-icon').className.indexOf('e-folderCDB-icon') > -1)) {
            const node: HTMLElement = args.node.querySelector('.e-list-icon');
            removeClass([node], 'e-folderCDB-icon');
            addClass([node], 'e-folderCDB-open-icon');
        } else if (args.node && args.node.querySelector('.e-list-icon') &&
            args.node.querySelector('.e-icon-expandable') &&
            (args.node.querySelector('.e-list-icon').className.indexOf('e-folderCDB-open-icon') > -1)) {
            const node: HTMLElement = args.node.querySelector('.e-list-icon');
            removeClass([node], 'e-folderCDB-open-icon');
            addClass([node], 'e-folderCDB-icon');
        } else {
            const curTreeData: { [key: string]: Object }[] = (this.treeObj.fields.dataSource as { [key: string]: Object }[]);
            const fieldListData: IOlapField[] = curTreeData as IOlapField[];
            let childNodes: IOlapField[] = [];
            for (const item of fieldListData) {
                if (item.pid === args.nodeData.id.toString()) {
                    childNodes.push(item);
                }
            }
            if (childNodes.length === 0) {
                this.parent.olapEngineModule.calcChildMembers = [];
                this.parent.olapEngineModule.getCalcChildMembers(this.parent.dataSourceSettings, args.nodeData.id.toString());
                childNodes = this.parent.olapEngineModule.calcChildMembers;
                this.parent.olapEngineModule.calcChildMembers = [];
                for (const node of childNodes) {
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
        const dragItem: HTMLElement = args.clonedNode;
        if (dragItem && ((this.parent.dataType === 'olap' &&
            (dragItem.querySelector('.e-calc-dimension-icon,.e-calc-measure-icon,.e-measure-icon') ||
                dragItem.querySelector('.e-attributeCDB-icon,.e-hierarchyCDB-icon') ||
                dragItem.querySelector('.e-level-members,.e-namedSetCDB-icon'))) || (this.parent.dataType === 'pivot' &&
                    (args.event.target as HTMLElement).classList.contains(cls.DRAG_CLASS)))) {
            isDrag = true;
        }
        if (isDrag) {
            addClass([args.draggedNode.querySelector('.' + cls.LIST_TEXT_CLASS)], cls.SELECTED_NODE_CLASS);
            addClass([dragItem], cls.PIVOTCALC);
            const dialog: Dialog = getInstance(select('#' + this.parentID + 'calculateddialog', document) as HTMLElement, Dialog) as Dialog;
            dragItem.style.zIndex = (dialog.zIndex + 1).toString();
            dragItem.style.display = 'inline';
        } else {
            args.cancel = true;
        }
    }

    /**
     * Trigger before treeview text append.
     *
     * @param {DrawNodeEventArgs} args - args.
     * @returns {void}
     */
    private drawTreeNode(args: DrawNodeEventArgs): void {
        if (this.parent.dataType === 'olap') {
            if (args.node.querySelector('.e-measure-icon')) {
                (args.node.querySelector('.e-list-icon') as HTMLElement).style.display = 'none';
            }
            const field: IOlapField = args.nodeData;
            args.node.setAttribute('data-field', field.id);
            args.node.setAttribute('data-caption', field.caption);
            const liTextElement: HTMLElement = args.node.querySelector('.' + cls.TEXT_CONTENT_CLASS);
            if (args.nodeData && args.nodeData.type === CALC &&
                liTextElement && args.node.querySelector('.e-list-icon.e-calc-member')) {
                args.node.setAttribute('data-type', field.type);
                args.node.setAttribute('data-membertype', field.fieldType);
                args.node.setAttribute('data-hierarchy', field.parentHierarchy ? field.parentHierarchy : '');
                args.node.setAttribute('data-formula', field.formula);
                const formatString: string = (field.formatString ? this.formatTypes.indexOf(field.formatString) > -1 ?
                    field.formatString : 'Custom' : 'None');
                args.node.setAttribute('data-formatString', formatString);
                args.node.setAttribute('data-customformatstring', (formatString === 'Custom' ? field.formatString : ''));
                const removeElement: Element = createElement('span', {
                    className: cls.GRID_REMOVE + ' e-icons e-list-icon'
                });
                liTextElement.classList.add('e-calcfieldmember');
                if (this.parent.isAdaptive) {
                    const editElement: Element = createElement('span', {
                        className: 'e-list-edit-icon' + (this.isEdit && this.currentFieldName === field.id ?
                            ' e-edited ' : ' e-edit ') + cls.ICON
                    });
                    const editWrapper: HTMLElement = createElement('div', { className: 'e-list-header-icon' });
                    editWrapper.appendChild(editElement);
                    editWrapper.appendChild(removeElement);
                    liTextElement.appendChild(editWrapper);
                } else {
                    liTextElement.appendChild(removeElement);
                }
            }
            if (this.parent.isAdaptive) {
                const liTextElement: HTMLElement = args.node.querySelector('.' + cls.TEXT_CONTENT_CLASS);
                if (args.node && args.node.querySelector('.e-list-icon') && liTextElement) {
                    const liIconElement: HTMLElement = args.node.querySelector('.e-list-icon');
                    liTextElement.insertBefore(liIconElement, args.node.querySelector('.e-list-text'));
                }
                if (args.node && args.node.querySelector('.e-calcMemberGroupCDB,.e-measureGroupCDB-icon,.e-folderCDB-icon')) {
                    (args.node.querySelector('.' + cls.CHECKBOX_CONTAINER) as HTMLElement).style.display = 'none';
                }
                if (args.node && args.node.querySelector('.e-level-members')) {
                    (args.node.querySelector('.e-list-icon') as HTMLElement).style.display = 'none';
                }
            }
            if (args.node.querySelector('.e-calc-dimension-icon,.e-calc-measure-icon,.e-measure-icon') ||
            args.node.querySelector('.e-attributeCDB-icon,.e-hierarchyCDB-icon') ||
            args.node.querySelector('.e-level-members,.e-namedSetCDB-icon')) {
                addClass([args.node], cls.BUTTON_DRAGGABLE);
            }
        } else {
            const field: string = args.nodeData.field as string;
            args.node.setAttribute('data-field', field);
            args.node.setAttribute('data-caption', args.nodeData.caption as string);
            args.node.setAttribute('data-type', args.nodeData.type as string);
            const formatObj: IFormatSettings =
                PivotUtil.getFieldByName(field, this.parent.dataSourceSettings.formatSettings) as IFormatSettings;
            args.node.setAttribute('data-formatString', formatObj ? formatObj.format : '');
            if (formatObj) {
                const pivotFormat: string = this.getFormat(formatObj.format);
                const formatString: string = (pivotFormat ? this.formatTypes.indexOf(pivotFormat) > -1 ?
                    formatObj.format : 'Custom' : 'None');
                args.node.setAttribute('data-customformatstring', (formatString === 'Custom' ? pivotFormat : ''));
                args.node.setAttribute('data-formatString', formatObj ? formatString : '');
            }
            const dragElement: Element = createElement('span', {
                attrs: { 'tabindex': '-1', 'aria-disabled': 'false', 'title': this.parent.localeObj.getConstant('dragField') },
                className: cls.ICON + ' e-drag'
            });
            const spaceElement: Element = createElement('div', {
                className: ' e-iconspace'
            });
            prepend([dragElement], args.node.querySelector('.' + cls.TEXT_CONTENT_CLASS) as HTMLElement);
            append([spaceElement, args.node.querySelector('.' + cls.FORMAT)], args.node.querySelector('.' + cls.TEXT_CONTENT_CLASS) as HTMLElement);
            if (this.getMenuItems(this.parent.engineModule.fieldList[field as string].type).length <= 0) {
                removeClass([args.node.querySelector('.' + cls.FORMAT)], cls.ICON);
            } else {
                args.node.querySelector('.' + cls.FORMAT).setAttribute('title', this.parent.localeObj.getConstant('format'));
            }
            if (this.parent.engineModule.fieldList[field as string].aggregateType === CALC) {
                args.node.querySelector('.' + cls.FORMAT).setAttribute('title', this.parent.localeObj.getConstant('remove'));
                addClass([args.node.querySelector('.' + cls.FORMAT)], cls.GRID_REMOVE);
                addClass([args.node.querySelector('.' + 'e-iconspace')], [cls.CALC_EDIT, cls.ICON, 'e-list-icon']);
                args.node.querySelector('.' + cls.CALC_EDIT).setAttribute('title', this.parent.localeObj.getConstant('edit'));
                args.node.querySelector('.' + cls.CALC_EDIT).setAttribute('aria-disabled', 'false');
                args.node.querySelector('.' + cls.CALC_EDIT).setAttribute('tabindex', '-1');
                removeClass([args.node.querySelector('.' + cls.FORMAT)], cls.FORMAT);
                removeClass([args.node.querySelector('.e-iconspace')], 'e-iconspace');
            }
        }
    }

    /**
     * To create radio buttons.
     *
     * @param {string} key - key.
     * @returns {HTMLElement} - createTypeContainer
     */
    private createTypeContainer(key: string): HTMLElement {
        const wrapDiv: HTMLElement = createElement('div', { id: this.parentID + 'control_container', className: cls.TREEVIEWOUTER });
        const type: AggregateTypes[] = this.getMenuItems(this.parent.engineModule.fieldList[key as string].type);
        for (let i: number = 0; i < type.length; i++) {
            const input: HTMLInputElement = createElement('input', {
                id: this.parentID + 'radio' + key + type[i as number],
                attrs: { 'type': 'radio', 'data-ftxt': key, 'data-value': type[i as number] },
                className: cls.CALCRADIO
            }) as HTMLInputElement;
            wrapDiv.appendChild(input);
        }
        return wrapDiv;
    }
    private getMenuItems(fieldType: string, summaryType?: AggregateTypes[]): AggregateTypes[] {
        const menuItems: AggregateTypes[] = !isNullOrUndefined(summaryType) ? summaryType : this.parent.aggregateTypes;
        const type: AggregateTypes[] = [];
        const menuTypes: AggregateTypes[] = this.getValidSummaryType();
        for (let i: number = 0; i < menuItems.length; i++) {
            if ((menuTypes.indexOf(menuItems[i as number]) > -1) && (type.indexOf(menuItems[i as number]) < 0)) {
                if (((menuItems[i as number] === COUNT || menuItems[i as number] === DISTINCTCOUNT) && fieldType !== 'number')
                    || (fieldType === 'number')) {
                    type.push(menuItems[i as number]);
                }
            }
        }
        return type;
    }
    private getValidSummaryType(): AggregateTypes[] {
        return [COUNT as AggregateTypes, DISTINCTCOUNT as AggregateTypes,
            SUM as AggregateTypes, AVG as AggregateTypes, MEDIAN as AggregateTypes,
            MIN as AggregateTypes, MAX as AggregateTypes, PRODUCT as AggregateTypes,
            STDEV as AggregateTypes, STDEVP as AggregateTypes,
            VAR as AggregateTypes, VARP as AggregateTypes];
    }
    /**
     * To get Accordion Data.
     *
     * @param  {PivotView | PivotFieldList} parent - parent.
     * @returns {AccordionItemModel[]} - Accordion Data.
     */
    private getAccordionData(parent: PivotView | PivotFieldList): AccordionItemModel[] {
        const data: AccordionItemModel[] = [];
        const keys: string[] = Object.keys(parent.engineModule.fieldList);
        for (let index: number = 0, i: number = keys.length; index < i; index++) {
            const key: string = keys[index as number];
            data.push({
                header: '<input id=' + this.parentID + '_' + index + ' class=' + cls.CALCCHECK + ' type="checkbox" data-field=' +
                    key + ' data-caption="' + this.parent.engineModule.fieldList[key as string].caption + '" data-type=' +
                    this.parent.engineModule.fieldList[key as string].type + '/>',
                content: (this.parent.engineModule.fieldList[key as string].aggregateType === CALC ||
                    (this.getMenuItems(this.parent.engineModule.fieldList[key as string].type).length < 1)) ? '' :
                    this.createTypeContainer(key).outerHTML,
                iconCss: this.parent.engineModule.fieldList[key as string].aggregateType === CALC ? 'e-list-icon' + ' ' +
                    (this.isEdit && this.currentFieldName === key ? 'e-edited' : 'e-edit') : ''
            });
        }
        return data;
    }
    /**
     * To render mobile layout.
     *
     * @param {Tab} tabObj - tabObj
     * @returns {void}
     */
    private renderMobileLayout(tabObj?: Tab): void {
        tabObj.items[4].content = this.renderDialogElements().outerHTML;
        tabObj.dataBind();
        const dialog: Dialog = select('#' + this.parentID + 'calculateddialog', document) ? getInstance(
            select('#' + this.parentID + 'calculateddialog', document) as HTMLElement, Dialog) as Dialog : null;
        const dialogElement: HTMLElement = (this.parent.isAdaptive ?
            (this.parent as PivotFieldList).dialogRenderer.parentElement : dialog.element);
        if (this.parent.isAdaptive && (this.parent as PivotFieldList).
            dialogRenderer.parentElement.querySelector('.' + cls.FORMULA) !== null) {
            this.createDropElements();
        }
        const cancelBtn: Button = new Button({
            cssClass: this.parent.cssClass, locale: this.parent.locale, enableRtl: this.parent.enableRtl,
            enableHtmlSanitizer: this.parent.enableHtmlSanitizer
        });
        cancelBtn.isStringTemplate = true;
        cancelBtn.appendTo(select('#' + this.parentID + 'cancelBtn', dialogElement) as HTMLElement);
        if (cancelBtn.element) {
            cancelBtn.element.onclick = this.cancelBtnClick.bind(this);
        }
        if ((this.parent as PivotFieldList).
            dialogRenderer.parentElement.querySelector('.' + cls.FORMULA) !== null && this.parent.isAdaptive) {
            const okBtn: Button = new Button({
                cssClass: this.parent.cssClass, isPrimary: true, locale: this.parent.locale, enableRtl: this.parent.enableRtl,
                enableHtmlSanitizer: this.parent.enableHtmlSanitizer
            });
            okBtn.isStringTemplate = true;
            okBtn.appendTo(select('#' + this.parentID + 'okBtn', dialogElement) as HTMLElement);
            const inputObj: MaskedTextBox = new MaskedTextBox({
                placeholder: this.parent.localeObj.getConstant('fieldName'),
                locale: this.parent.locale, enableRtl: this.parent.enableRtl,
                change: (args: MaskChangeEventArgs) => {
                    this.fieldText = args.value;
                    this.formulaText = (select('#' + this.parentID + 'droppable', document) as HTMLTextAreaElement).value;
                },
                cssClass: this.parent.cssClass
            });
            inputObj.isStringTemplate = true;
            inputObj.appendTo(select('#' + this.parentID + 'ddlelement', dialogElement) as HTMLElement);
            if (this.formulaText !== null && select('#' + this.parentID + 'droppable', (this.parent as PivotFieldList).dialogRenderer.parentElement) !== null) {
                const drop: HTMLTextAreaElement = select('#' + this.parentID + 'droppable', (this.parent as PivotFieldList).dialogRenderer.parentElement) as HTMLTextAreaElement;
                drop.value = this.formulaText;
            }
            if (this.fieldText !== null && (this.parent as PivotFieldList).
                dialogRenderer.parentElement.querySelector('.' + cls.CALCINPUT) !== null) {
                ((this.parent as PivotFieldList).
                    dialogRenderer.parentElement.querySelector('.' + cls.CALCINPUT) as HTMLInputElement).value = this.fieldText;
                inputObj.value = this.fieldText;
            }
            if (okBtn.element) {
                okBtn.element.onclick = this.applyFormula.bind(this);
            }
        } else if (this.parent.isAdaptive) {
            const addBtn: Button = new Button({
                cssClass: this.parent.cssClass, isPrimary: true, locale: this.parent.locale, enableRtl: this.parent.enableRtl,
                enableHtmlSanitizer: this.parent.enableHtmlSanitizer
            });
            addBtn.isStringTemplate = true;
            addBtn.appendTo(select('#' + this.parentID + 'addBtn', dialogElement) as HTMLElement);
            if (this.parent.dataType === 'olap') {
                this.treeObj = new TreeView({
                    fields: { dataSource: this.getFieldListData(this.parent), id: 'id', text: 'caption', parentID: 'pid', iconCss: 'spriteCssClass' },
                    showCheckBox: true,
                    autoCheck: false,
                    sortOrder: 'None',
                    enableRtl: this.parent.enableRtl,
                    locale: this.parent.locale,
                    enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
                    nodeClicked: this.fieldClickHandler.bind(this),
                    drawNode: this.drawTreeNode.bind(this),
                    nodeExpanding: this.updateNodeIcon.bind(this),
                    nodeCollapsed: this.updateNodeIcon.bind(this),
                    nodeSelected: (args: NodeSelectEventArgs) => {
                        removeClass([args.node], 'e-active');
                        args.cancel = true;
                    },
                    cssClass: this.parent.cssClass
                });
                this.treeObj.isStringTemplate = true;
                this.treeObj.appendTo(select('#' + this.parentID + 'accordDiv', dialogElement) as HTMLElement);
            } else {
                const accordion: Accordion = new Accordion({
                    items: this.getAccordionData(this.parent),
                    enableRtl: this.parent.enableRtl,
                    locale: this.parent.locale,
                    enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
                    expanding: this.accordionExpand.bind(this),
                    clicked: this.accordionClickHandler.bind(this),
                    created: this.accordionCreated.bind(this)
                });
                accordion.isStringTemplate = true;
                accordion.appendTo(select('#' + this.parentID + 'accordDiv', dialogElement) as HTMLElement);
                this.updateType();
            }
            if (addBtn.element) {
                addBtn.element.onclick = this.addBtnClick.bind(this);
            }
        }
    }

    private accordionExpand(args: ExpandEventArgs): void {
        if (args.element.querySelectorAll('.e-radio-wrapper').length === 0) {
            const keys: string[] = Object.keys(this.parent.engineModule.fieldList);
            for (let index: number = 0, i: number = keys.length; index < i; index++) {
                const key: string = keys[index as number];
                const type: string[] = this.parent.engineModule.fieldList[key as string].type !== 'number' ? [COUNT, DISTINCTCOUNT] :
                    [SUM, COUNT, AVG, MEDIAN, MIN, MAX, DISTINCTCOUNT, PRODUCT, STDEV, STDEVP, VAR, VARP];
                let radiobutton: RadioButton;
                if (key === args.element.querySelector('[data-field').getAttribute('data-field')) {
                    for (let i: number = 0; i < type.length; i++) {
                        radiobutton = new RadioButton({
                            label: this.parent.localeObj.getConstant(type[i as number]),
                            name: AGRTYPE + key,
                            checked: args.element.querySelector('[data-type').getAttribute('data-type') === type[i as number],
                            change: this.onChange.bind(this),
                            locale: this.parent.locale, enableRtl: this.parent.enableRtl,
                            enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
                            cssClass: this.parent.cssClass
                        });
                        radiobutton.isStringTemplate = true;
                        radiobutton.appendTo(select('#' + this.parentID + 'radio' + key + type[i as number], args.element));
                    }
                }
            }
        }
    }

    private onChange(args: ChangeArgs): void {
        const type: string =
            ((args.event.target as HTMLElement).parentElement.querySelector('.e-label') as HTMLElement)
                .innerText;
        const field: string = (args.event.target as HTMLElement).closest('.e-acrdn-item').
            querySelector('[data-field').getAttribute('data-caption');
        ((args.event.target as HTMLElement).
            closest('.e-acrdn-item').querySelector('.e-label') as HTMLElement).
            innerText = field + ' (' + type + ')';
        (args.event.target as HTMLElement).closest('.e-acrdn-item').
            querySelector('[data-type').setAttribute('data-type', (args.event.target as HTMLElement).getAttribute('data-value'));
    }

    private updateType(): void {
        const keys: string[] = Object.keys(this.parent.engineModule.fieldList);
        const dialog: Dialog = select('#' + this.parentID + 'calculateddialog', document) ? getInstance(
            select('#' + this.parentID + 'calculateddialog', document) as HTMLElement, Dialog) as Dialog : null;
        const dialogElement: HTMLElement = (this.parent.isAdaptive ?
            (this.parent as PivotFieldList).dialogRenderer.parentElement : dialog.element);
        for (let index: number = 0, i: number = keys.length; index < i; index++) {
            const key: string = keys[index as number];
            let type: string = null;
            if ((this.parent.engineModule.fieldList[key as string].type !== 'number' ||
                this.parent.engineModule.fieldList[key as string].type === 'include' ||
                this.parent.engineModule.fieldList[key as string].type === 'exclude') &&
                (this.parent.engineModule.fieldList[key as string].aggregateType !== 'DistinctCount')) {
                type = COUNT;
            } else {
                type = this.parent.engineModule.fieldList[key as string].aggregateType !== undefined ?
                    this.parent.engineModule.fieldList[key as string].aggregateType : SUM;
            }
            const checkbox: CheckBox = new CheckBox({
                label: this.parent.engineModule.fieldList[key as string].caption + ' (' + this.parent.localeObj.getConstant(type) + ')',
                locale: this.parent.locale, enableRtl: this.parent.enableRtl, enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
                cssClass: this.parent.cssClass
            });
            checkbox.isStringTemplate = true;
            checkbox.appendTo(select('#' + this.parentID + '_' + index, dialogElement) as HTMLElement);
            select('#' + this.parentID + '_' + index, dialogElement).setAttribute('data-field', key);
            select('#' + this.parentID + '_' + index, dialogElement).setAttribute('data-type', type);
        }
    }

    /**
     * Trigger while click cancel button.
     *
     * @returns {void}
     */
    private cancelBtnClick(): void {
        this.renderMobileLayout((this.parent as PivotFieldList).dialogRenderer.adaptiveElement);
    }

    /**
     * Trigger while click add button.
     *
     * @returns {void}
     */
    private addBtnClick(): void {
        let fieldText: string = '';
        let field: string = null;
        let type: string = null;
        if (this.parent.dataType === 'pivot') {
            const node: NodeListOf<Element> = document.querySelectorAll('.e-accordion .e-check');
            for (let i: number = 0; i < node.length; i++) {
                field = node[i as number].parentElement.querySelector('[data-field]').getAttribute('data-field');
                type = node[i as number].parentElement.querySelector('[data-field]').getAttribute('data-type');
                if (type.indexOf(CALC) === -1) {
                    fieldText = fieldText + ('"' + type + '(' + field + ')' + '"');
                } else {
                    for (let j: number = 0; j < this.parent.dataSourceSettings.calculatedFieldSettings.length; j++) {
                        if (this.parent.dataSourceSettings.calculatedFieldSettings[j as number].name === field) {
                            fieldText = fieldText + this.parent.dataSourceSettings.calculatedFieldSettings[j as number].formula;
                            break;
                        }
                    }
                }
            }
        } else {
            const nodes: string[] = this.treeObj.getAllCheckedNodes();
            const olapEngine: OlapEngine = this.parent.olapEngineModule;
            for (const item of nodes) {
                fieldText = fieldText + (olapEngine.fieldList[item as string] &&
                    olapEngine.fieldList[item as string].type === CALC ? olapEngine.fieldList[item as string].tag : item);
            }
        }
        this.formulaText = this.formulaText !== null ? (this.formulaText + fieldText) : fieldText;
        this.renderMobileLayout((this.parent as PivotFieldList).dialogRenderer.adaptiveElement);
    }

    /**
     * To create calculated field dialog elements.
     *
     * @param {any} args - It contains the args value.
     * @param {boolean} args.edit - It contains the value of edit under args.
     * @param {string} args.fieldName - It contains the value of fieldName under args.
     * @returns {void}
     * @hidden
     */
    public createCalculatedFieldDialog(args?: { edit: boolean, fieldName: string }): void {
        if (this.parent.isAdaptive && this.parent.getModuleName() === 'pivotfieldlist') {
            this.renderAdaptiveLayout(args && args.edit !== undefined ? args.edit : true);
            this.isEdit = (args && args.edit !== undefined ? args.edit : this.isEdit);
        } else if (!this.parent.isAdaptive) {
            this.isEdit = (args && args.edit !== undefined ? args.edit : false);
            this.renderDialogLayout();
            if (args && args.edit) {
                const target: HTMLElement = this.treeObj.element.querySelector('li[data-field="' + args.fieldName + '"]');
                if (target) {
                    addClass([target], ['e-active', 'e-node-focus']);
                    target.setAttribute('aria-selected', 'true');
                    target.id = this.treeObj.element.id + '_active';
                    if (this.parent.dataType === 'pivot') {
                        const e: NodeClickEventArgs = { event: { target: target.querySelector('.e-list-icon.e-edit.e-icons') as EventTarget } } as NodeClickEventArgs;
                        this.fieldClickHandler(e);
                    } else {
                        this.displayMenu(target);
                    }
                }
            }
            const dialog: Dialog = getInstance(select('#' + this.parentID + 'calculateddialog', document) as HTMLElement, Dialog) as Dialog;
            dialog.element.style.top = parseInt(dialog.element.style.top, 10) < 0 ? '0px' : dialog.element.style.top;
        }
    }

    /**
     * To create calculated field desktop layout.
     *
     * @returns {void}
     */
    private renderDialogLayout(): void {
        this.newFields =
            extend([], (this.parent.dataSourceSettings as IDataOptions).calculatedFieldSettings, null, true) as ICalculatedFields[];
        this.createDialog();
        const dialog: Dialog = getInstance(select('#' + this.parentID + 'calculateddialog', document) as HTMLElement, Dialog) as Dialog;
        dialog.content = this.renderDialogElements();
        dialog.refresh();
        const inputObj: MaskedTextBox = new MaskedTextBox({
            placeholder: this.parent.localeObj.getConstant('fieldName'),
            locale: this.parent.locale, enableRtl: this.parent.enableRtl,
            cssClass: this.parent.cssClass
        });
        inputObj.isStringTemplate = true;
        inputObj.appendTo(select('#' + this.parentID + 'ddlelement', dialog.element) as HTMLElement);
        this.createDropElements();
        this.createTreeView();
        this.droppable = new Droppable(select('#' + this.parentID + 'droppable', dialog.element) as HTMLElement);
        this.keyboardEvents = new KeyboardEvents(dialog.element, {
            keyAction: this.keyActionHandler.bind(this),
            keyConfigs: { moveRight: 'rightarrow', enter: 'enter', shiftE: 'shift+E', delete: 'delete' },
            eventName: 'keydown'
        });
    }

    private createConfirmDialog(title: string, description: string, calcInfo: ICalculatedFields, isRemove?: boolean, node?: Element): void {
        const errorDialog: HTMLElement = createElement('div', {
            id: this.parentID + '_CalculatedFieldErrorDialog',
            className: cls.ERROR_DIALOG_CLASS
        });
        this.parent.element.appendChild(errorDialog);
        const confirmPopUp: Dialog = new Dialog({
            animationSettings: { effect: 'Fade' },
            allowDragging: false,
            showCloseIcon: true,
            enableRtl: this.parent.enableRtl,
            locale: this.parent.locale,
            enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
            width: 'auto',
            height: 'auto',
            position: { X: 'center', Y: 'center' },
            buttons: [
                {
                    click: isRemove ? this.removeCalcField.bind(this, node) : this.replaceFormula.bind(this, calcInfo),
                    isFlat: false,
                    buttonModel: {
                        cssClass: cls.OK_BUTTON_CLASS + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''),
                        content: isRemove ? this.parent.localeObj.getConstant('yes') : this.parent.localeObj.getConstant('ok'), isPrimary: true
                    }
                },
                {
                    click: this.closeErrorDialog.bind(this),
                    isFlat: false,
                    buttonModel: {
                        cssClass: cls.CANCEL_BUTTON_CLASS + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''),
                        content: isRemove ? this.parent.localeObj.getConstant('no') : this.parent.localeObj.getConstant('cancel')
                    }
                }
            ],
            header: title,
            content: description,
            isModal: true,
            visible: true,
            closeOnEscape: true,
            target: document.body,
            cssClass: this.parent.cssClass,
            close: this.removeErrorDialog.bind(this)
        });
        confirmPopUp.isStringTemplate = true;
        confirmPopUp.appendTo(errorDialog);
        // confirmPopUp.element.querySelector('.e-dlg-header').innerText = title;
    }

    private replaceFormula(calcInfo: ICalculatedFields): void {
        const report: IDataOptions = this.parent.dataSourceSettings as IDataOptions;
        if (this.parent.dataType === 'olap') {
            for (let j: number = 0; j < report.calculatedFieldSettings.length; j++) {
                if (report.calculatedFieldSettings[j as number].name === calcInfo.name) {
                    if (!isNullOrUndefined(calcInfo.hierarchyUniqueName)) {
                        report.calculatedFieldSettings[j as number].hierarchyUniqueName = calcInfo.hierarchyUniqueName;
                    }
                    report.calculatedFieldSettings[j as number].formatString = calcInfo.formatString;
                    report.calculatedFieldSettings[j as number].formula = calcInfo.formula;
                    this.parent.lastCalcFieldInfo = report.calculatedFieldSettings[j as number];
                    break;
                }
            }
        } else {
            for (let i: number = 0; i < report.values.length; i++) {
                if (report.values[i as number].type === CALC && report.values[i as number].name === calcInfo.name) {
                    for (let j: number = 0; j < report.calculatedFieldSettings.length; j++) {
                        if (report.calculatedFieldSettings[j as number].name === calcInfo.name) {
                            report.calculatedFieldSettings[j as number].formula = calcInfo.formula;
                            this.parent.lastCalcFieldInfo = report.calculatedFieldSettings[j as number];
                            this.updateFormatSettings(report, calcInfo.name, calcInfo.formatString);
                        }
                    }
                }
            }
        }
        this.addFormula(report, calcInfo.name);
        this.removeErrorDialog();
    }

    private removeErrorDialog(): void {
        const element: HTMLElement = select('#' + this.parentID + '_CalculatedFieldErrorDialog', document);
        const confirmPopUp: Dialog = element ? getInstance(element, Dialog) as Dialog : null;
        if (confirmPopUp && !confirmPopUp.isDestroyed) {
            confirmPopUp.destroy();
        }
        if (select('#' + this.parentID + '_CalculatedFieldErrorDialog', document) !== null) {
            remove(select('#' + this.parentID + '_CalculatedFieldErrorDialog', document));
        }
    }

    private closeErrorDialog(): void {
        const confirmPopUp: Dialog = getInstance(
            select('#' + this.parentID + '_CalculatedFieldErrorDialog', document) as HTMLElement, Dialog) as Dialog;
        confirmPopUp.close();
    }

    /**
     * To add event listener.
     *
     * @returns {void}
     * @hidden
     */
    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.initCalculatedField, this.createCalculatedFieldDialog, this);
    }

    /**
     * To remove event listener.
     *
     * @returns {void}
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.initCalculatedField, this.createCalculatedFieldDialog);
    }

    /**
     * To destroy the calculated field dialog
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        if (this.treeObj && !this.treeObj.isDestroyed) {
            this.treeObj.destroy();
        }
        if (this.treeObj) {
            this.treeObj = null;
        }
        if (this.newFields) {
            this.newFields = null;
        }
        if (this.curMenu) {
            this.curMenu = null;
        }
        if (this.droppable) {
            this.droppable = null;
        }
        if (this.keyboardEvents) {
            this.keyboardEvents = null;
        }
        let element: HTMLElement = select('#' + this.parentID + 'ddlelement', document);
        if (element) { /* inputObj */
            (getInstance(element, MaskedTextBox) as MaskedTextBox).destroy();
        }
        element = select('#' + this.parentID + 'calculateddialog', document);
        if (element) { /* dialog */
            (getInstance(element, Dialog) as Dialog).destroy();
        }
        element = select('#' + this.parentID + 'CalcContextmenu', document);
        if (element) { /* menuObj */
            (getInstance(element, Menu) as Menu).destroy();
        }
        element = select('#' + this.parentID + 'accordDiv', document);
        if (element) { /* accordion */
            (getInstance(element, Accordion) as Accordion).destroy();
        }
        element = select('#' + this.parentID + '_CalculatedFieldErrorDialog', document);
        if (element) { /* confirmPopUp */
            (getInstance(element, Dialog) as Dialog).destroy();
        }
    }
}

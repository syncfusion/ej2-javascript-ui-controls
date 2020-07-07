import { Dialog, OffsetPosition, BeforeOpenEventArgs, Tooltip, ButtonPropsModel } from '@syncfusion/ej2-popups';
import { Droppable, createElement, extend, remove, addClass, closest, getInstance, isBlazor } from '@syncfusion/ej2-base';
import { prepend, append, KeyboardEvents, KeyboardEventArgs, removeClass, isNullOrUndefined } from '@syncfusion/ej2-base';
import { IDataOptions, IFieldOptions, ICalculatedFields, IFormatSettings, PivotEngine } from '../../base/engine';
import { PivotView } from '../../pivotview/base/pivotview';
import { Button, RadioButton, CheckBox, ChangeArgs } from '@syncfusion/ej2-buttons';
import { MaskedTextBox, MaskChangeEventArgs } from '@syncfusion/ej2-inputs';
import * as cls from '../../common/base/css-constant';
import {
    TreeView, DragAndDropEventArgs, NodeExpandEventArgs, BeforeOpenCloseMenuEventArgs,
    NodeClickEventArgs, MenuEventArgs, DrawNodeEventArgs, ExpandEventArgs, NodeSelectEventArgs, NodeKeyPressEventArgs
} from '@syncfusion/ej2-navigations';
import { ContextMenu as Menu, MenuItemModel, ContextMenuModel } from '@syncfusion/ej2-navigations';
import { IAction, CalculatedFieldCreateEventArgs, AggregateMenuOpenEventArgs } from '../../common/base/interface';
import * as events from '../../common/base/constant';
import { PivotFieldList } from '../../pivotfieldlist/base/field-list';
import { Tab, Accordion, AccordionItemModel, AccordionClickArgs } from '@syncfusion/ej2-navigations';
import { DropDownList, ChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import { PivotUtil } from '../../base/util';
import { IOlapField, OlapEngine } from '../../base/olap/engine';
import { FormatSettingsModel, CalculatedFieldSettingsModel, DataSourceSettingsModel } from '../../pivotview/model/datasourcesettings-model';
import { AggregateTypes } from '../base/enum';

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
    /** @hidden */
    public isRequireUpdate: boolean = false;
    /** @hidden */
    public buttonCall: boolean;

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
    private formatType: string;
    private formatText: string;
    private fieldType: string;
    private parentHierarchy: string;
    private keyboardEvents: KeyboardEvents;
    private isEdit: boolean;
    private currentFieldName: string;
    private currentFormula: string;
    private confirmPopUp: Dialog;
    private field: string;
    private accordion: Accordion;

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
        this.formatText = null;
        this.formatType = null;
        this.fieldType = null;
        this.parentHierarchy = null;
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
    /* tslint:disable:max-line-length */
    /**
     * Trigger while click treeview icon.
     * @param  {NodeClickEventArgs} e
     * @returns void
     */
    private fieldClickHandler(e: NodeClickEventArgs): void {
        let node: HTMLElement = closest(e.event.target as Element, 'li') as HTMLElement;
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
                    this.formatText = this.formatType === 'Custom' ? node.getAttribute('data-customString') : null;
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
    /* tslint:enable:max-line-length */
    /**
     * Trigger while click treeview icon.
     * @param  {AccordionClickArgs} e
     * @returns void
     */
    private accordionClickHandler(e: AccordionClickArgs): void {
        if (e.item && e.item.iconCss.indexOf('e-list-icon') !== -1 &&
            closest(e.originalEvent.target as Element, '.e-acrdn-header-icon')) {
            let node: HTMLElement = closest(e.originalEvent.target as Element, '.e-acrdn-header').querySelector('.' + cls.CALCCHECK);
            let fieldName: string = node.getAttribute('data-field');
            let formatObj: IFormatSettings = PivotUtil.getFieldByName(fieldName, this.parent.dataSourceSettings.formatSettings);
            let optionElement: HTMLElement = closest(e.originalEvent.target as Element, '.e-acrdn-header-icon') as HTMLElement;
            if (optionElement.querySelector('.' + cls.CALC_EDIT) && (e.originalEvent.target as Element).classList.contains(cls.CALC_EDIT)) {
                this.isEdit = true;
                this.currentFieldName = this.fieldText = fieldName;
                this.formulaText = this.parent.engineModule.fieldList[fieldName].formula;
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
        let allElement: NodeListOf<Element> = this.accordion.element.querySelectorAll('.e-acrdn-item');
        for (let i: number = 0; i < allElement.length; i++) {
            if (allElement[i].querySelector('.' + cls.CALC_EDIT) || allElement[i].querySelector('.' + cls.CALC_EDITED)) {
                let element: HTMLElement = createElement('span', {
                    className: 'e-list-icon ' + cls.GRID_REMOVE + ' e-icons',
                });
                append([element], allElement[i].querySelector('.e-acrdn-header-icon') as HTMLElement);
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
     * @param  {HTMLElement} node
     * @returns void
     */
    /* tslint:disable:max-func-body-length */
    private displayMenu(node: HTMLElement, treeNode?: HTMLElement, target?: HTMLElement): void {
        let edit: boolean = target ? target.classList.contains(cls.CALC_EDIT) : true;
        let edited: boolean = target ? target.classList.contains(cls.CALC_EDITED) : true;
        /* tslint:disable:max-line-length */
        if (this.parent.dataType === 'pivot' && node.querySelector('.e-list-icon.e-format') &&
            node.querySelector('.e-list-icon.e-format').classList.contains(cls.ICON) &&
            !node.querySelector('.e-list-icon').classList.contains(cls.CALC_EDITED) &&
            !node.querySelector('.e-list-icon').classList.contains(cls.GRID_REMOVE) &&
            !node.querySelector('.e-list-icon').classList.contains(cls.CALC_EDIT) && node.tagName === 'LI') {
            if (this.menuObj && !this.menuObj.isDestroyed) {
                this.menuObj.destroy();
            }
            this.curMenu = (node.querySelector('.' + cls.LIST_TEXT_CLASS) as HTMLElement);
            this.openContextMenu(node);
        } else if (node.tagName === 'LI' && (node.querySelector('.' + cls.CALC_EDIT) &&
            node.querySelector('.' + cls.CALC_EDIT).classList.contains('e-list-icon') && edit ||
            (this.parent.dataType === 'olap' && node.getAttribute('data-type') === CALC && node.classList.contains('e-active') && ((target && !target.classList.contains(cls.GRID_REMOVE)) || !target)))) {
            this.isEdit = true;
            let fieldName: string = node.getAttribute('data-field');
            let caption: string = node.getAttribute('data-caption');
            this.currentFieldName = fieldName;
            this.inputObj.value = caption;
            this.inputObj.dataBind();
            let formatString: string = node.getAttribute('data-formatString');
            let dialogElement: HTMLElement = this.dialog.element;
            let customFormat: MaskedTextBox = getInstance(dialogElement.querySelector('#' + this.parentID + 'Custom_Format_Element') as HTMLElement, MaskedTextBox) as MaskedTextBox;
            if (this.parent.dataType === 'olap') {
                let memberType: string = node.getAttribute('data-membertype');
                let parentHierarchy: string = node.getAttribute('data-hierarchy');
                let expression: string = node.getAttribute('data-formula');
                let customString: string = node.getAttribute('data-customString');
                let fieldTitle: HTMLElement = dialogElement.querySelector('#' + this.parentID + '_' + 'FieldNameTitle');
                let memberTypeDrop: DropDownList = getInstance(dialogElement.querySelector('#' + this.parentID + 'Member_Type_Div') as HTMLElement, DropDownList) as DropDownList;
                let hierarchyDrop: DropDownList = getInstance(dialogElement.querySelector('#' + this.parentID + 'Hierarchy_List_Div') as HTMLElement, DropDownList) as DropDownList;
                let formatDrop: DropDownList = getInstance(dialogElement.querySelector('#' + this.parentID + 'Format_Div') as HTMLElement, DropDownList) as DropDownList;
                /* tslint:enable:max-line-length */
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
            } else {
                customFormat.value = formatString;
                addClass(this.treeObj.element.querySelectorAll('.' + cls.CALC_EDITED), cls.CALC_EDIT);
                removeClass(this.treeObj.element.querySelectorAll('.' + cls.CALC_EDITED), cls.CALC_EDITED);
                addClass([node.querySelector('.e-list-icon')], cls.CALC_EDITED);
                removeClass([node.querySelector('.e-list-icon')], cls.CALC_EDIT);
                node.querySelector('.' + cls.CALC_EDITED).setAttribute('title', this.parent.localeObj.getConstant('clearCalculatedField'));
                (document.querySelector('#' + this.parentID + 'droppable') as HTMLTextAreaElement).value = node.getAttribute('data-uid');
            }
            customFormat.dataBind();
        } else if (node.tagName === 'LI' && (node.querySelector('.' + cls.CALC_EDITED) &&
            node.querySelector('.' + cls.CALC_EDITED).classList.contains('e-list-icon') && edited ||
            (this.parent.dataType === 'olap' && !node.classList.contains('e-active')))) {
            this.isEdit = false;
            this.inputObj.value = '';
            this.inputObj.dataBind();
            let dialogElement: HTMLElement = this.dialog.element;
            /* tslint:disable:max-line-length */
            let customFormat: MaskedTextBox = getInstance(dialogElement.querySelector('#' + this.parentID + 'Custom_Format_Element') as HTMLElement, MaskedTextBox) as MaskedTextBox;
            customFormat.value = '';
            customFormat.dataBind();
            if (this.parent.dataType === 'olap') {
                let hierarchyDrop: DropDownList = getInstance(dialogElement.querySelector('#' + this.parentID + 'Hierarchy_List_Div') as HTMLElement, DropDownList) as DropDownList;
                let formatDrop: DropDownList = getInstance(dialogElement.querySelector('#' + this.parentID + 'Format_Div') as HTMLElement, DropDownList) as DropDownList;
                let memberTypeDrop: DropDownList = getInstance(dialogElement.querySelector('#' + this.parentID + 'Member_Type_Div') as HTMLElement, DropDownList) as DropDownList;
                let fieldTitle: HTMLElement = dialogElement.querySelector('#' + this.parentID + '_' + 'FieldNameTitle');
                /* tslint:enable:max-line-length */
                fieldTitle.innerHTML = this.parent.localeObj.getConstant('fieldTitle');
                hierarchyDrop.index = 0;
                hierarchyDrop.dataBind();
                formatDrop.index = 0;
                formatDrop.dataBind();
                memberTypeDrop.index = 0;
                memberTypeDrop.readonly = false;
                memberTypeDrop.dataBind();
            } else {
                addClass(this.treeObj.element.querySelectorAll('.' + cls.CALC_EDITED), cls.CALC_EDIT);
                removeClass(this.treeObj.element.querySelectorAll('.' + cls.CALC_EDITED), cls.CALC_EDITED);
                node.querySelector('.' + cls.CALC_EDIT).setAttribute('title', this.parent.localeObj.getConstant('edit'));
            }
            (document.querySelector('#' + this.parentID + 'droppable') as HTMLTextAreaElement).value = '';
        } else if (node.tagName === 'LI' && (node.querySelector('.' + cls.GRID_REMOVE) &&
            node.querySelector('.' + cls.GRID_REMOVE).classList.contains('e-list-icon')) && !edit && !edited) {
            let dropField: HTMLTextAreaElement = document.querySelector('#' + this.parentID + 'droppable') as HTMLTextAreaElement;
            let field: ICalculatedFields = {
                name: this.isEdit ? this.currentFieldName : this.inputObj.value,
                caption: this.inputObj.value,
                formula: dropField.value
            };
            this.createConfirmDialog(
                this.parent.localeObj.getConstant('alert'),
                this.parent.localeObj.getConstant('removeCalculatedField'), field, true, treeNode);
        }
    }

    private removeCalcField(node: Element): void {
        let dataSourceSettings: DataSourceSettingsModel = this.parent.dataSourceSettings;
        let fieldName: string = node.getAttribute('data-field');
        let calcfields: CalculatedFieldSettingsModel[] = dataSourceSettings.calculatedFieldSettings;
        let engineModule: PivotEngine | OlapEngine;
        if (this.parent.dataType === 'pivot') {
            if (!this.parent.isAdaptive) {
                this.treeObj.removeNodes([node]);
            } else {
                let index: number = parseInt(node.getAttribute('id').split(this.parentID + '_')[1], 10);
                if (typeof index === 'number') {
                    this.accordion.removeItem(index);
                }
            }
        }
        for (let i: number = 0; i < calcfields.length; i++) {
            if (calcfields[i] && calcfields[i].name === fieldName) {
                calcfields.splice(i, 1);
                break;
            }
        }

        /* tslint:disable:max-line-length */
        if (this.parent.dataType === 'olap') {
            engineModule = this.parent.olapEngineModule;
            let fields: { [key: string]: Object }[] = engineModule.fieldListData ? engineModule.fieldListData as { [key: string]: Object }[] : [];
            /* tslint:disable:no-any */
            for (let item of Object.keys(fields) as string[]) {
                if (fields[item as any].name === fieldName) {
                    let index: number = parseInt(item, 10);
                    if (typeof (index) === 'number') {
                        fields.splice(index, 1);
                        break;
                    }
                }
            }
            /* tslint:enable:no-any */
            let parentID: string = this.treeObj.getNode(node).parentID as string;
            this.treeObj.removeNodes([node]);
            if (calcfields.length <= 0) {
                this.treeObj.removeNodes([parentID]);
            }
        } else {
            engineModule = this.parent.engineModule;
        }
        if (engineModule.fields) {
            for (let i: number = 0; i < engineModule.fields.length; i++) {
                if (engineModule.fields[i] === fieldName) {
                    engineModule.fields.splice(i, 1);
                    break;
                }
            }
        }
        if (engineModule.savedFieldList && engineModule.savedFieldList[fieldName]) {
            delete engineModule.savedFieldList[fieldName];
        }
        if (engineModule.fieldList && engineModule.fieldList[fieldName]) {
            delete engineModule.fieldList[fieldName];
        }
        let formatFields: FormatSettingsModel[] = dataSourceSettings.formatSettings;
        for (let i: number = 0; i < formatFields.length; i++) {
            if (formatFields[i] && formatFields[i].name === fieldName) {
                formatFields.splice(i, 1);
                break;
            }
        }
        let fields: IFieldOptions[][] = [dataSourceSettings.values, dataSourceSettings.rows, dataSourceSettings.columns, dataSourceSettings.filters];
        for (let i: number = 0, n: number = fields.length; i < n; i++) {
            for (let j: number = 0, length: number = fields[i].length; j < length; j++) {
                if (fields[i][j].name === fieldName) {
                    fields[i].splice(j, 1);
                    break;
                }
            }
        }
        /* tslint:enable:max-line-length */
        if (this.isEdit && this.currentFieldName === fieldName) {
            this.isEdit = false;
            this.inputObj.value = '';
            this.currentFieldName = this.formatText = this.fieldText = this.formatType = null;
            this.formulaText = this.fieldType = this.parentHierarchy = null;
        }
        if (!this.parent.allowDeferLayoutUpdate || this.parent.getModuleName() !== 'pivotfieldlist') {
            this.parent.updateDataSource();
        }
        this.removeErrorDialog();
    }
    /**
     * To set position for context menu.
     * @returns void
     */
    private openContextMenu(node: HTMLElement): void {
        let fieldName: string = node.getAttribute('data-field');
        let type: string = this.parent.engineModule.fieldList[fieldName].type !== 'number' ? 'string' : 'number';
        let validSummaryTypes: AggregateTypes[] = (type === 'string' ? this.getValidSummaryType().slice(0, 2) : this.getValidSummaryType());
        let eventArgs: AggregateMenuOpenEventArgs = {
            cancel: false, fieldName: fieldName,
            aggregateTypes: [...this.getMenuItems(type)]
        };
        let control: PivotView | PivotFieldList =
            this.parent.getModuleName() === 'pivotfieldlist' && (this.parent as PivotFieldList).isPopupView ?
                (this.parent as PivotFieldList).pivotGridModule : this.parent;
        control.trigger(events.aggregateMenuOpen, eventArgs, (observedArgs: AggregateMenuOpenEventArgs) => {
            if (!observedArgs.cancel) {
                let duplicateTypes: string[] = [];
                let items: MenuItemModel[] = [];
                for (let option of observedArgs.aggregateTypes) {
                    if (validSummaryTypes.indexOf(option) > -1 && duplicateTypes.indexOf(option) === -1) {
                        duplicateTypes.push(option);
                        items.push({
                            id: this.parent.element.id + 'Calc_' + option,
                            text: this.parent.localeObj.getConstant(option)
                        });
                    }
                }
                this.createMenu(items, node);
                let pos: OffsetPosition = node.getBoundingClientRect();
                let offset: number = window.scrollY || document.documentElement.scrollTop;
                if (this.parent.enableRtl) {
                    this.menuObj.open(pos.top + offset, pos.left - 100);
                } else {
                    this.menuObj.open(pos.top + offset, pos.left + 150);
                }
            }
        });
    }

    /**
     * Triggers while select menu.
     * @param  {MenuEventArgs} menu
     * @returns void
     */
    private selectContextMenu(menu: MenuEventArgs): void {
        if (menu.element.textContent !== null) {
            let field: string = closest(this.curMenu, '.e-list-item').getAttribute('data-caption');
            closest(this.curMenu, '.e-list-item').setAttribute('data-type', menu.element.id.split('_').pop());
            this.curMenu.textContent = field + ' (' + menu.element.textContent + ')';
            addClass([this.curMenu.parentElement.parentElement], ['e-node-focus', 'e-hover']);
            this.curMenu.parentElement.parentElement.setAttribute('tabindex', '-1');
            this.curMenu.parentElement.parentElement.focus();
        }
    }

    /**
     * To create context menu.
     * @returns void
     */
    private createMenu(menuItems: MenuItemModel[], node: HTMLElement): void {
        let menuOptions: ContextMenuModel = {
            cssClass: this.parentID + 'calculatedmenu',
            items: menuItems,
            enableRtl: this.parent.enableRtl,
            // beforeOpen: this.beforeMenuOpen.bind(this),
            select: this.selectContextMenu.bind(this),
            onClose: () => {
                this.treeObj.element.focus();
                addClass([node], ['e-hover', 'e-node-focus']);
            }

        };
        let contextMenu: HTMLElement;
        if (document.querySelector('#' + this.parentID + 'CalcContextmenu')) {
            contextMenu = document.querySelector('#' + this.parentID + 'CalcContextmenu');
        } else {
            contextMenu = createElement('ul', {
                id: this.parentID + 'CalcContextmenu'
            });
        }
        this.dialog.element.appendChild(contextMenu);
        this.menuObj = new Menu(menuOptions);
        this.menuObj.isStringTemplate = true;
        this.menuObj.appendTo(contextMenu);
    }

    /**
     * Triggers while click OK button.
     * @returns void
     */
    /* tslint:disable:max-func-body-length */
    private applyFormula(): void {
        let currentObj: CalculatedField = this;
        let isExist: boolean = false;
        removeClass([document.getElementById(this.parentID + 'ddlelement')], cls.EMPTY_FIELD);
        this.newFields =
            extend([], (this.parent.dataSourceSettings as IDataOptions).calculatedFieldSettings, null, true) as ICalculatedFields[];

        let eventArgs: CalculatedFieldCreateEventArgs = {
            fieldName: this.isEdit ? this.currentFieldName : this.inputObj.value,
            calculatedField: this.getCalculatedFieldInfo(),
            calculatedFieldSettings: PivotUtil.cloneCalculatedFieldSettings(this.parent.dataSourceSettings.calculatedFieldSettings),
            cancel: false
        };
        let control: PivotView | PivotFieldList = this.parent.getModuleName() === 'pivotfieldlist' &&
            /* tslint:disable-next-line:max-line-length */
            (this.parent as PivotFieldList).isPopupView ? (this.parent as PivotFieldList).pivotGridModule : this.parent;
        control.trigger(events.calculatedFieldCreate, eventArgs, (observedArgs: CalculatedFieldCreateEventArgs) => {
            if (!observedArgs.cancel) {
                let calcInfo: ICalculatedFields = observedArgs.calculatedField;
                if (!this.isEdit) {
                    if (currentObj.parent.dataType === 'olap') {
                        let field: string = calcInfo.name;
                        if (currentObj.parent.olapEngineModule.fieldList[field] &&
                            currentObj.parent.olapEngineModule.fieldList[field].type !== 'CalculatedField') {
                            isExist = true;
                        }
                    } else {
                        for (let key of Object.keys(currentObj.parent.engineModule.fieldList)) {
                            if (calcInfo.name && calcInfo.name === key &&
                                currentObj.parent.engineModule.fieldList[key].aggregateType !== 'CalculatedField') {
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
                let report: IDataOptions = this.parent.dataSourceSettings as IDataOptions;
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
                                if (report.calculatedFieldSettings[i].name === field.name) {
                                    this.createConfirmDialog(
                                        currentObj.parent.localeObj.getConstant('alert'),
                                        currentObj.parent.localeObj.getConstant('confirmText'), calcInfo);
                                    return;
                                }
                            }
                        } else {
                            for (let i: number = 0; i < report.calculatedFieldSettings.length; i++) {
                                if (report.calculatedFieldSettings[i].name === field.name && this.isEdit) {
                                    report.calculatedFieldSettings[i].hierarchyUniqueName = calcInfo.hierarchyUniqueName;
                                    this.parent.olapEngineModule.fieldList[field.name].caption = calcInfo.caption;
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
                        }
                        this.parent.lastCalcFieldInfo = field;
                    } else {
                        field = {
                            name: calcInfo.name,
                            caption: calcInfo.caption,
                            type: 'CalculatedField'
                        } as IFieldOptions;
                        let cField: ICalculatedFields = {
                            name: calcInfo.name,
                            formula: calcInfo.formula
                        };
                        if (!isNullOrUndefined(calcInfo.formatString)) {
                            cField.formatString = calcInfo.formatString;
                        }
                        this.isFieldExist = true;
                        if (!this.isEdit) {
                            for (let i: number = 0; i < report.values.length; i++) {
                                if (report.values[i].type === CALC && report.values[i].name === field.name) {
                                    for (let j: number = 0; j < report.calculatedFieldSettings.length; j++) {
                                        if (report.calculatedFieldSettings[j].name === field.name) {
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
                                if (report.values[i].type === CALC && field.name !== null &&
                                    report.values[i].name === field.name && this.isEdit) {
                                    for (let j: number = 0; j < report.calculatedFieldSettings.length; j++) {
                                        if (report.calculatedFieldSettings[j].name === field.name) {
                                            report.values[i].caption = calcInfo.caption;
                                            this.currentFormula = report.calculatedFieldSettings[j].formula;
                                            report.calculatedFieldSettings[j].formula = calcInfo.formula;
                                            this.parent.engineModule.fieldList[field.name].caption = calcInfo.caption;
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
                        this.inputObj.value = '';
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
    /* tslint:disable:max-line-length */
    private getCalculatedFieldInfo(): ICalculatedFields {
        let field: ICalculatedFields;
        let dropField: HTMLTextAreaElement = document.querySelector('#' + this.parentID + 'droppable') as HTMLTextAreaElement;
        let dialogElement: HTMLElement = this.parent.isAdaptive ? (this.parent as PivotFieldList).dialogRenderer.adaptiveElement.element : this.dialog.element;
        let customFormat: MaskedTextBox = getInstance(dialogElement.querySelector('#' + this.parentID + 'Custom_Format_Element') as HTMLElement, MaskedTextBox) as MaskedTextBox;
        field = {
            name: this.isEdit ? this.currentFieldName : this.inputObj.value,
            caption: this.inputObj.value,
            formula: dropField.value
        };
        if (this.parent.dataType === 'olap') {
            let formatDrop: DropDownList = getInstance(dialogElement.querySelector('#' + this.parentID + 'Format_Div') as HTMLElement, DropDownList) as DropDownList;
            let memberTypeDrop: DropDownList = getInstance(dialogElement.querySelector('#' + this.parentID + 'Member_Type_Div') as HTMLElement, DropDownList) as DropDownList;
            let hierarchyDrop: DropDownList = getInstance(dialogElement.querySelector('#' + this.parentID + 'Hierarchy_List_Div') as HTMLElement, DropDownList) as DropDownList;
            field.formatString = (formatDrop.value === 'Custom' ? customFormat.value : formatDrop.value as string);
            if (memberTypeDrop.value === 'Dimension') {
                field.hierarchyUniqueName = hierarchyDrop.value as string;
            }
        } else {
            field.formatString = customFormat.value;
        }
        return field;
    }
    /* tslint:enable:max-line-length */
    private updateFormatSettings(report: IDataOptions, fieldName: string, formatString: string): void {
        let newFormat: FormatSettingsModel = { name: fieldName, format: formatString, useGrouping: true };
        let isFormatExist: boolean = false;
        for (let i: number = 0; i < report.formatSettings.length; i++) {
            if (report.formatSettings[i].name === fieldName) {
                if (formatString === 'undefined' || formatString === undefined || formatString === '') {
                    report.formatSettings.splice(i, 1);
                    isFormatExist = true;
                    break;
                } else {
                    let formatObj: FormatSettingsModel = (<{ [key: string]: Object }>report.formatSettings[i]).properties ?
                        (<{ [key: string]: Object }>report.formatSettings[i]).properties : report.formatSettings[i];
                    formatObj.format = formatString;
                    report.formatSettings.splice(i, 1, formatObj);
                    isFormatExist = true;
                    break;
                }
            }
        }
        if (!isFormatExist && formatString !== '') {
            report.formatSettings.push(newFormat);
        }
    }

    private addFormula(report: IDataOptions, field: string): void {
        this.isFormula = true;
        this.field = field;
        if (isBlazor()) {
            PivotUtil.updateDataSourceSettings(this.parent, PivotUtil.getClonedDataSourceSettings(report));
        } else {
            this.parent.setProperties({ dataSourceSettings: report }, true);
        }
        if (this.parent.getModuleName() === 'pivotfieldlist' && this.parent.allowDeferLayoutUpdate) {
            (this.parent as PivotFieldList).isRequiredUpdate = false;
        }
        try {
            this.parent.updateDataSource(false);
            let pivot: PivotView = this.parent.getModuleName() === 'pivotfieldlist' ?
                (this.parent as PivotFieldList).pivotGridModule : (this.parent as PivotView);
            if (!(isBlazor() && pivot && pivot.enableVirtualization)) {
                this.endDialog();
            } else {
                this.isRequireUpdate = true;
            }
            if (this.parent.getModuleName() === 'pivotfieldlist' &&
                (this.parent as PivotFieldList).renderMode === 'Fixed' && this.parent.allowDeferLayoutUpdate) {
                (this.parent as PivotFieldList).pivotChange = true;
            }
        } catch (exception) {
            this.showError();
        }
    }

    /** @hidden */
    public endDialog(): void {
        this.isEdit = false;
        if (this.dialog) {
            this.dialog.close();
        } else {
            this.inputObj.value = '';
            this.currentFieldName = this.formatText = this.fieldText = this.formatType = null;
            this.formulaText = this.fieldType = this.parentHierarchy = null;
            /* tslint:disable:max-line-length */
            let dialogElement: HTMLElement = this.parent.isAdaptive ? (this.parent as PivotFieldList).dialogRenderer.parentElement : this.dialog.element;
            ((this.parent as PivotFieldList).dialogRenderer.parentElement.querySelector('.' + cls.CALCINPUT) as HTMLInputElement).value = '';
            ((this.parent as PivotFieldList).dialogRenderer.parentElement.querySelector('#' + this.parentID + 'droppable') as HTMLTextAreaElement).value = '';
            ((this.parent as PivotFieldList).dialogRenderer.parentElement.querySelector('#' + this.parentID + 'Custom_Format_Element') as HTMLTextAreaElement).value = '';
            if (this.parent.dataType === 'olap') {
                let customFormat: MaskedTextBox = getInstance(dialogElement.querySelector('#' + this.parentID + 'Custom_Format_Element') as HTMLElement, MaskedTextBox) as MaskedTextBox;
                let formatDrop: DropDownList = getInstance(dialogElement.querySelector('#' + this.parentID + 'Format_Div') as HTMLElement, DropDownList) as DropDownList;
                let memberTypeDrop: DropDownList = getInstance(dialogElement.querySelector('#' + this.parentID + 'Member_Type_Div') as HTMLElement, DropDownList) as DropDownList;
                let hierarchyDrop: DropDownList = getInstance(dialogElement.querySelector('#' + this.parentID + 'Hierarchy_List_Div') as HTMLElement, DropDownList) as DropDownList;
                formatDrop.index = 0;
                formatDrop.dataBind();
                memberTypeDrop.index = 0;
                memberTypeDrop.readonly = false;
                memberTypeDrop.dataBind();
                hierarchyDrop.index = 0;
                hierarchyDrop.enabled = false;
                hierarchyDrop.dataBind();
                customFormat.enabled = false;
                customFormat.dataBind();
            }
            /* tslint:enable:max-line-length */
        }
    }

    /** @hidden */
    public showError(): void {
        if (this.parent.engineModule.fieldList[this.field]) {
            delete this.parent.engineModule.fieldList[this.field];
        }
        this.parent.pivotCommon.errorDialog.createErrorDialog(
            this.parent.localeObj.getConstant('error'), this.parent.localeObj.getConstant('invalidFormula'));
        if (isBlazor()) {
            PivotUtil.updateDataSourceSettings(this.parent, PivotUtil.getClonedDataSourceSettings(this.existingReport));
        } else {
            this.parent.setProperties({ dataSourceSettings: this.existingReport }, true);
        }
        if (this.isEdit) {
            let calcFields: CalculatedFieldSettingsModel[] = this.parent.dataSourceSettings.calculatedFieldSettings;
            for (let i: number = 0; calcFields && i < calcFields.length; i++) {
                if (calcFields[i].name === this.field) {
                    calcFields[i].formula = this.currentFormula;
                    break;
                }
            }
        } else if (this.parent.engineModule.fields) {
            for (let i: number = 0; i < this.parent.engineModule.fields.length; i++) {
                if (this.parent.engineModule.fields[i] === this.field) {
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
     * @param  {PivotGrid|PivotFieldList} parent
     * @returns Object
     */
    private getFieldListData(parent: PivotView | PivotFieldList): { [key: string]: Object }[] {
        let fields: { [key: string]: Object }[] = [];
        if (this.parent.dataType === 'olap') {
            /* tslint:disable-next-line:max-line-length */
            fields = PivotUtil.getClonedData(parent.olapEngineModule.fieldListData ? parent.olapEngineModule.fieldListData as { [key: string]: Object }[] : []);
            for (let item of fields as IOlapField[]) {
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
            for (let key of (parent.engineModule.fieldList ? Object.keys(parent.engineModule.fieldList) : [])) {
                let type: string = null;
                let typeVal: string = null;
                if ((parent.engineModule.fieldList[key].type !== 'number' || parent.engineModule.fieldList[key].type === 'include' ||
                    parent.engineModule.fieldList[key].type === 'exclude') &&
                    (parent.engineModule.fieldList[key].aggregateType !== 'DistinctCount')) {
                    typeVal = COUNT;
                } else {
                    typeVal = parent.engineModule.fieldList[key].aggregateType !== undefined ?
                        (parent.engineModule.fieldList[key].aggregateType) : SUM;
                }
                type = this.parent.localeObj.getConstant(typeVal);
                fields.push({
                    index: parent.engineModule.fieldList[key].index,
                    name: parent.engineModule.fieldList[key].caption + ' (' + type + ')',
                    type: typeVal,
                    icon: cls.FORMAT + ' ' + cls.ICON,
                    formula: parent.engineModule.fieldList[key].formula,
                    field: key,
                    caption: parent.engineModule.fieldList[key].caption ? parent.engineModule.fieldList[key].caption : key
                });
            }
        }
        return fields;
    }

    /**
     * Triggers before menu opens.
     * @param  {BeforeOpenCloseMenuEventArgs} args
     * @returns void
     */

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
            while (!isNullOrUndefined(document.querySelector('.' + this.parentID + 'calculatedmenu'))) {
                remove(document.querySelector('.' + this.parentID + 'calculatedmenu'));
            }
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
        if (this.menuObj && !this.menuObj.isDestroyed) {
            this.menuObj.destroy();
        }
        remove(document.getElementById(this.parentID + 'calculateddialog'));
        if (!isNullOrUndefined(document.querySelector('.' + this.parentID + 'calculatedmenu'))) {
            remove(document.querySelector('.' + this.parentID + 'calculatedmenu'));
        }
        let timeOut: number = ((this.parent.getModuleName() === 'pivotview') ||
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
        } else if (document.getElementById(this.parent.element.id + '_Wrapper')) {
            parentElement = document.getElementById(this.parent.element.id + '_Wrapper');
        }
        if (parentElement) {
            let pivotButtons: HTMLElement[] = [].slice.call(parentElement.querySelectorAll('.e-pivot-button'));
            for (let item of pivotButtons) {
                if (item.getAttribute('data-uid') === this.currentFieldName) {
                    item.focus();
                    break;
                }
            }
        }
    }
    /* tslint:disable:max-line-length */
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
                className: cls.CALCADDBTN, attrs: { 'type': 'button' }
            });
            let cancelBtn: HTMLElement = createElement('button', {
                id: this.parentID + 'cancelBtn', innerHTML: this.parent.localeObj.getConstant('cancel'),
                className: cls.CALCCANCELBTN, attrs: { 'type': 'button' }
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
                    outerDiv.appendChild(fieldTitle);
                }
            }
            let treeOuterDiv: HTMLElement = createElement('div', { className: cls.TREEVIEW + '-outer-div' });
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
                    className: cls.CALCOKBTN, attrs: { 'type': 'button' }
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
                let customFormatDiv: HTMLElement = createElement('div', { id: this.parentID + 'custom_Format_Div', className: cls.OLAP_CALC_CUSTOM_FORMAT_INPUTDIV });
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
            } else {
                let customFormatDiv: HTMLElement = createElement('div', { id: this.parentID + 'custom_Format_Div', className: cls.CALC_CUSTOM_FORMAT_INPUTDIV });
                if (!this.parent.isAdaptive) {
                    let formatTitle: HTMLElement = createElement('div', {
                        className: cls.OLAP_FORMAT_TITLE_CLASS,
                        innerHTML: this.parent.localeObj.getConstant('formatString')
                    });
                    customFormatDiv.appendChild(formatTitle);
                }
                let customFormatObj: HTMLInputElement = createElement('input', {
                    id: this.parentID + 'Custom_Format_Element',
                    attrs: { 'type': 'text' },
                    className: cls.CALC_FORMAT_INPUT
                }) as HTMLInputElement;
                customFormatDiv.appendChild(customFormatObj);
                (this.parent.isAdaptive ? outerDiv.insertBefore(customFormatDiv, outerDiv.querySelector('#' + this.parentID + 'buttonDiv')) : outerDiv.appendChild(customFormatDiv));
            }
        }
        return outerDiv;
    }

    /**
     * To create calculated field adaptive layout.
     * @returns void
     */
    private renderAdaptiveLayout(isEdit: boolean): void {
        let dialogElement: Tab = (this.parent as PivotFieldList).dialogRenderer.adaptiveElement;
        if (isEdit) {
            if (dialogElement.element.querySelector('#' + this.parentID + 'droppable')) {
                this.formulaText = (document.querySelector('#' + this.parentID + 'droppable') as HTMLTextAreaElement).value;
                this.fieldText = this.inputObj.value;
            }
            if (dialogElement.element.querySelector('.' + cls.CALC_MEMBER_TYPE_DIV) as HTMLTextAreaElement) {
                let memberTypeDrop: DropDownList = getInstance(dialogElement.element.querySelector('#' + this.parentID + 'Member_Type_Div') as HTMLElement, DropDownList) as DropDownList;
                this.fieldType = memberTypeDrop.value as string;
            }
            if (dialogElement.element.querySelector('.' + cls.CALC_HIERARCHY_LIST_DIV) as HTMLTextAreaElement) {
                let hierarchyDrop: DropDownList = getInstance(dialogElement.element.querySelector('#' + this.parentID + 'Hierarchy_List_Div') as HTMLElement, DropDownList) as DropDownList;
                this.parentHierarchy = this.fieldType === 'Dimension' ? hierarchyDrop.value as string : null;
            }
            if (dialogElement.element.querySelector('.' + cls.CALC_FORMAT_TYPE_DIV) as HTMLTextAreaElement) {
                let formatDrop: DropDownList = getInstance(dialogElement.element.querySelector('#' + this.parentID + 'Format_Div') as HTMLElement, DropDownList) as DropDownList;
                this.formatType = formatDrop.value as string;
            }
            if (dialogElement.element.querySelector('.' + cls.CALC_FORMAT_INPUT) as HTMLTextAreaElement) {
                let customFormat: MaskedTextBox = getInstance(dialogElement.element.querySelector('#' + this.parentID + 'Custom_Format_Element') as HTMLElement, MaskedTextBox) as MaskedTextBox;
                this.formatText = this.parent.dataType === 'olap' ? this.formatType === 'Custom' ? customFormat.value : null : customFormat.value;
            }
        } else {
            this.currentFieldName = this.formulaText = this.fieldText = this.formatText = null;
            this.fieldType = this.formatType = this.parentHierarchy = null;
        }
        this.renderMobileLayout(dialogElement);
    }

    /**
     * To update calculated field info in adaptive layout.
     * @returns void
     */
    private updateAdaptiveCalculatedField(isEdit: boolean, fieldName?: string): void {
        let dialogElement: HTMLElement = (this.parent as PivotFieldList).dialogRenderer.adaptiveElement.element;
        this.isEdit = isEdit;
        let calcInfo: IOlapField = (isEdit ? (this.parent.dataType === 'pivot' ?
            this.parent.engineModule.fieldList[fieldName] : this.parent.olapEngineModule.fieldList[fieldName]) :
            {
                id: null, caption: null, formula: null, fieldType: 'Measure',
                formatString: (this.parent.dataType === 'pivot' ? null : 'Standard'), parentHierarchy: null
            });
        this.currentFieldName = calcInfo.id;
        if (dialogElement.querySelector('#' + this.parentID + 'droppable')) {
            this.formulaText = (document.querySelector('#' + this.parentID + 'droppable') as HTMLTextAreaElement).value = calcInfo.formula;
            this.fieldText = this.inputObj.value = calcInfo.caption;
            this.inputObj.dataBind();
        }
        if (dialogElement.querySelector('.' + cls.CALC_MEMBER_TYPE_DIV) as HTMLTextAreaElement) {
            let memberTypeDrop: DropDownList = getInstance(dialogElement.querySelector('#' + this.parentID + 'Member_Type_Div') as HTMLElement, DropDownList) as DropDownList;
            this.fieldType = memberTypeDrop.value = calcInfo.fieldType;
            memberTypeDrop.readonly = isEdit ? true : false;
            memberTypeDrop.dataBind();
        }
        if (dialogElement.querySelector('.' + cls.CALC_HIERARCHY_LIST_DIV) as HTMLTextAreaElement) {
            let hierarchyDrop: DropDownList = getInstance(dialogElement.querySelector('#' + this.parentID + 'Hierarchy_List_Div') as HTMLElement, DropDownList) as DropDownList;
            if (this.fieldType === 'Dimension') {
                this.parentHierarchy = hierarchyDrop.value = calcInfo.parentHierarchy;
            } else {
                this.parentHierarchy = null;
                hierarchyDrop.index = 0;
            }
            hierarchyDrop.dataBind();
        }
        if (dialogElement.querySelector('.' + cls.CALC_FORMAT_TYPE_DIV) as HTMLTextAreaElement) {
            let formatStringData: string[] = ['Standard', 'Currency', 'Percent'];
            let formatDrop: DropDownList = getInstance(dialogElement.querySelector('#' + this.parentID + 'Format_Div') as HTMLElement, DropDownList) as DropDownList;
            this.formatType = formatDrop.value = (formatStringData.indexOf(calcInfo.formatString) > -1 ? calcInfo.formatString : 'Custom');
        }
        if (dialogElement.querySelector('.' + cls.CALC_FORMAT_INPUT) as HTMLTextAreaElement) {
            let customFormat: MaskedTextBox = getInstance(dialogElement.querySelector('#' + this.parentID + 'Custom_Format_Element') as HTMLElement, MaskedTextBox) as MaskedTextBox;
            let formatObj: IFormatSettings = PivotUtil.getFieldByName(fieldName, this.parent.dataSourceSettings.formatSettings) as IFormatSettings;
            if (this.parent.dataType === 'pivot') {
                this.formatText = customFormat.value = formatObj ? formatObj.format : null;
            } else {
                this.formatText = customFormat.value = (this.formatType === 'Custom' ? calcInfo.formatString : null);
            }
            customFormat.dataBind();
        }
    }
    /* tslint:enable:max-line-length */

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
            fields: { value: 'value', text: 'text' },
            value: this.fieldType !== null ? this.fieldType : mData[0].value as string,
            readonly: this.isEdit,
            cssClass: cls.MEMBER_OPTIONS_CLASS, width: '100%',
            change: (args: ChangeEventArgs) => {
                hierarchyListObj.enabled = args.value === 'Dimension' ? true : false;
                this.fieldType = args.value as string;
                this.formulaText = (document.querySelector('#' + this.parentID + 'droppable') as HTMLTextAreaElement).value;
                hierarchyListObj.dataBind();
            }
        });
        memberTypeObj.isStringTemplate = true;
        memberTypeObj.appendTo(dialogElement.querySelector('#' + this.parentID + 'Member_Type_Div') as HTMLElement);
        let hierarchyListObj: DropDownList = new DropDownList({
            dataSource: fieldData, enableRtl: this.parent.enableRtl,
            allowFiltering: true,
            enabled: memberTypeObj.value === 'Dimension' ? true : false,
            filterBarPlaceholder: this.parent.localeObj.getConstant('example') + ' ' + fieldData[0].text.toString(),
            fields: { value: 'value', text: 'text' },
            value: this.parentHierarchy !== null && memberTypeObj.value === 'Dimension' ?
                this.parentHierarchy : fieldData[0].value as string,
            cssClass: cls.MEMBER_OPTIONS_CLASS, width: '100%',
            change: (args: ChangeEventArgs) => {
                this.parentHierarchy = args.value as string;
                this.formulaText = (document.querySelector('#' + this.parentID + 'droppable') as HTMLTextAreaElement).value;
            }
        });
        hierarchyListObj.isStringTemplate = true;
        hierarchyListObj.appendTo(dialogElement.querySelector('#' + this.parentID + 'Hierarchy_List_Div') as HTMLElement);
        let formatStringObj: DropDownList = new DropDownList({
            dataSource: fData, enableRtl: this.parent.enableRtl,
            fields: { value: 'value', text: 'text' },
            value: this.formatType !== null ? this.formatType : fData[0].value as string,
            cssClass: cls.MEMBER_OPTIONS_CLASS, width: '100%',
            change: (args: ChangeEventArgs) => {
                customerFormatObj.enabled = args.value === 'Custom' ? true : false;
                this.formatType = args.value as string;
                this.formulaText = (document.querySelector('#' + this.parentID + 'droppable') as HTMLTextAreaElement).value;
                customerFormatObj.dataBind();
            }
        });
        formatStringObj.isStringTemplate = true;
        formatStringObj.appendTo(dialogElement.querySelector('#' + this.parentID + 'Format_Div') as HTMLElement);
        let customerFormatObj: MaskedTextBox = new MaskedTextBox({
            placeholder: this.parent.localeObj.getConstant('customFormat'),
            value: this.formatText !== null && formatStringObj.value === 'Custom' ? this.formatText : null,
            enabled: formatStringObj.value === 'Custom' ? true : false,
            change: (args: MaskChangeEventArgs) => {
                this.formatText = args.value;
                this.formulaText = (document.querySelector('#' + this.parentID + 'droppable') as HTMLTextAreaElement).value;
            }
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
                sortOrder: 'None'
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
                keyPress: (args: NodeKeyPressEventArgs) => {
                    if (args.event.keyCode === 39) {
                        args.cancel = true;
                    }
                },
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
                let removeElement: Element = createElement('span', {
                    className: cls.GRID_REMOVE + ' e-icons e-list-icon'
                });
                liTextElement.classList.add('e-calcfieldmember');
                if (this.parent.isAdaptive) {
                    let editElement: Element = createElement('span', {
                        className: 'e-list-edit-icon' + (this.isEdit && this.currentFieldName === field.id ?
                            ' e-edited ' : ' e-edit ') + cls.ICON
                    });
                    let editWrapper: HTMLElement = createElement('div', { className: 'e-list-header-icon' });
                    editWrapper.appendChild(editElement);
                    editWrapper.appendChild(removeElement);
                    liTextElement.appendChild(editWrapper);
                } else {
                    liTextElement.appendChild(removeElement);
                }
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
            let formatObj: IFormatSettings =
                PivotUtil.getFieldByName(field, this.parent.dataSourceSettings.formatSettings) as IFormatSettings;
            args.node.setAttribute('data-formatString', formatObj ? formatObj.format : '');
            let dragElement: Element = createElement('span', {
                attrs: { 'tabindex': '-1', 'aria-disabled': 'false', 'title': this.parent.localeObj.getConstant('dragField') },
                className: cls.ICON + ' e-drag'
            });
            let spaceElement: Element = createElement('div', {
                className: ' e-iconspace'
            });
            prepend([dragElement], args.node.querySelector('.' + cls.TEXT_CONTENT_CLASS) as HTMLElement);
            /* tslint:disable-next-line:max-line-length */
            append([spaceElement, args.node.querySelector('.' + cls.FORMAT)], args.node.querySelector('.' + cls.TEXT_CONTENT_CLASS) as HTMLElement);
            if (this.getMenuItems(this.parent.engineModule.fieldList[field].type).length <= 0) {
                removeClass([args.node.querySelector('.' + cls.FORMAT)], cls.ICON);
            } else {
                args.node.querySelector('.' + cls.FORMAT).setAttribute('title', this.parent.localeObj.getConstant('format'));
            }
            if (this.parent.engineModule.fieldList[field].aggregateType === CALC) {
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
     * @param  {string} key
     * @returns HTMLElement
     */
    private createTypeContainer(key: string): HTMLElement {
        let wrapDiv: HTMLElement = createElement('div', { id: this.parentID + 'control_wrapper', className: cls.TREEVIEWOUTER });
        let type: AggregateTypes[] = this.getMenuItems(this.parent.engineModule.fieldList[key].type);
        for (let i: number = 0; i < type.length; i++) {
            let input: HTMLInputElement = createElement('input', {
                id: this.parentID + 'radio' + key + type[i],
                attrs: { 'type': 'radio', 'data-ftxt': key, 'data-value': type[i] },
                className: cls.CALCRADIO
            }) as HTMLInputElement;
            wrapDiv.appendChild(input);
        }
        return wrapDiv;
    }
    private getMenuItems(fieldType: string, summaryType?: AggregateTypes[]): AggregateTypes[] {
        let menuItems: AggregateTypes[] = !isNullOrUndefined(summaryType) ? summaryType : this.parent.aggregateTypes;
        let type: AggregateTypes[] = [];
        let menuTypes: AggregateTypes[] = this.getValidSummaryType();
        for (let i: number = 0; i < menuItems.length; i++) {
            if ((menuTypes.indexOf(menuItems[i]) > -1) && (type.indexOf(menuItems[i]) < 0)) {
                if (((menuItems[i] === COUNT || menuItems[i] === DISTINCTCOUNT) && fieldType !== 'number')
                    || (fieldType === 'number')) {
                    type.push(menuItems[i]);
                }
            }
        }
        return type;
    }
    private getValidSummaryType(): AggregateTypes[] {
        return [COUNT as AggregateTypes, DISTINCTCOUNT as AggregateTypes, SUM as AggregateTypes, AVG as AggregateTypes,
        MIN as AggregateTypes, MAX as AggregateTypes, PRODUCT as AggregateTypes, STDEV as AggregateTypes, STDEVP as AggregateTypes,
        VAR as AggregateTypes, VARP as AggregateTypes];
    }
    /**
     * To get Accordion Data.
     * @param  {PivotView | PivotFieldList} parent
     * @returns AccordionItemModel
     */
    private getAccordionData(parent: PivotView | PivotFieldList): AccordionItemModel[] {
        let data: AccordionItemModel[] = [];
        let keys: string[] = Object.keys(parent.engineModule.fieldList);
        for (let index: number = 0, i: number = keys.length; index < i; index++) {
            let key: string = keys[index];
            data.push({
                header: '<input id=' + this.parentID + '_' + index + ' class=' + cls.CALCCHECK + ' type="checkbox" data-field=' +
                    key + ' data-caption=' + this.parent.engineModule.fieldList[key].caption + ' data-type=' +
                    this.parent.engineModule.fieldList[key].type + '/>',
                content: (this.parent.engineModule.fieldList[key].aggregateType === CALC ||
                    (this.getMenuItems(this.parent.engineModule.fieldList[key].type).length < 1)) ? '' :
                    this.createTypeContainer(key).outerHTML,
                iconCss: this.parent.engineModule.fieldList[key].aggregateType === CALC ? 'e-list-icon' + ' ' +
                    (this.isEdit && this.currentFieldName === key ? 'e-edited' : 'e-edit') : ''
            });
        }
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
        if (this.parent.dataType === 'olap' && this.parent.isAdaptive && (this.parent as PivotFieldList).
            dialogRenderer.parentElement.querySelector('.' + cls.FORMULA) !== null) {
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
                placeholder: this.parent.localeObj.getConstant('fieldName'),
                change: (args: MaskChangeEventArgs) => {
                    this.fieldText = args.value;
                    this.formulaText = (document.querySelector('#' + this.parentID + 'droppable') as HTMLTextAreaElement).value;
                }
            });
            this.inputObj.isStringTemplate = true;
            this.inputObj.appendTo('#' + this.parentID + 'ddlelement');
            if (this.parent.dataType === 'pivot') {
                let formatInputObj: MaskedTextBox = new MaskedTextBox({
                    placeholder: this.parent.localeObj.getConstant('numberFormatString'),
                    change: (args: MaskChangeEventArgs) => {
                        this.formatText = args.value;
                        this.formulaText = (document.querySelector('#' + this.parentID + 'droppable') as HTMLTextAreaElement).value;
                    }
                });
                formatInputObj.isStringTemplate = true;
                formatInputObj.appendTo('#' + this.parentID + 'Custom_Format_Element');
                if (this.formatText !== null && (this.parent as PivotFieldList).
                    dialogRenderer.parentElement.querySelector('.' + cls.CALC_FORMAT_INPUT) !== null) {
                    ((this.parent as PivotFieldList).
                        /* tslint:disable-next-line:max-line-length */
                        dialogRenderer.parentElement.querySelector('.' + cls.CALC_FORMAT_INPUT) as HTMLInputElement).value = this.formatText;
                    formatInputObj.value = this.formatText;
                }
            }
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
                    nodeClicked: this.fieldClickHandler.bind(this),
                    drawNode: this.drawTreeNode.bind(this),
                    nodeExpanding: this.updateNodeIcon.bind(this),
                    nodeCollapsed: this.updateNodeIcon.bind(this),
                    nodeSelected: (args: NodeSelectEventArgs) => {
                        removeClass([args.node], 'e-active');
                        args.cancel = true;
                    }
                });
                this.treeObj.isStringTemplate = true;
                this.treeObj.appendTo('#' + this.parentID + 'accordDiv');
            } else {
                this.accordion = new Accordion({
                    items: this.getAccordionData(this.parent),
                    enableRtl: this.parent.enableRtl,
                    expanding: this.accordionExpand.bind(this),
                    clicked: this.accordionClickHandler.bind(this),
                    created: this.accordionCreated.bind(this)
                });
                this.accordion.isStringTemplate = true;
                this.accordion.appendTo('#' + this.parentID + 'accordDiv');
                this.updateType();
            }
            if (addBtn.element) {
                addBtn.element.onclick = this.addBtnClick.bind(this);
            }
        }
    }

    private accordionExpand(args: ExpandEventArgs): void {
        if (args.element.querySelectorAll('.e-radio-wrapper').length === 0) {
            let keys: string[] = Object.keys(this.parent.engineModule.fieldList);
            for (let index: number = 0, i: number = keys.length; index < i; index++) {
                let key: string = keys[index];
                let type: string[] = this.parent.engineModule.fieldList[key].type !== 'number' ? [COUNT, DISTINCTCOUNT] :
                    [SUM, COUNT, AVG, MIN, MAX, DISTINCTCOUNT, PRODUCT, STDEV, STDEVP, VAR, VARP];
                let radiobutton: RadioButton;
                if (key === args.element.querySelector('[data-field').getAttribute('data-field')) {
                    for (let i: number = 0; i < type.length; i++) {
                        radiobutton = new RadioButton({
                            label: this.parent.localeObj.getConstant(type[i]),
                            name: AGRTYPE + key,
                            checked: args.element.querySelector('[data-type').getAttribute('data-type') === type[i],
                            change: this.onChange.bind(this),
                        });
                        radiobutton.isStringTemplate = true;
                        radiobutton.appendTo('#' + this.parentID + 'radio' + key + type[i]);
                    }
                }
            }
        }
    }

    private onChange(args: ChangeArgs): void {
        let type: string =
            ((args.event.target as HTMLElement).parentElement.querySelector('.e-label') as HTMLElement)
                .innerText;
        let field: string = (args.event.target as HTMLElement).closest('.e-acrdn-item').
            querySelector('[data-field').getAttribute('data-caption');
        ((args.event.target as HTMLElement).
            closest('.e-acrdn-item').querySelector('.e-label') as HTMLElement).
            innerText = field + ' (' + type + ')';
        (args.event.target as HTMLElement).closest('.e-acrdn-item').
            querySelector('[data-type').setAttribute('data-type', (args.event.target as HTMLElement).getAttribute('data-value'));
    }

    private updateType(): void {
        let keys: string[] = Object.keys(this.parent.engineModule.fieldList);
        for (let index: number = 0, i: number = keys.length; index < i; index++) {
            let key: string = keys[index];
            let type: string = null;
            if ((this.parent.engineModule.fieldList[key].type !== 'number' ||
                this.parent.engineModule.fieldList[key].type === 'include' ||
                this.parent.engineModule.fieldList[key].type === 'exclude') &&
                (this.parent.engineModule.fieldList[key].aggregateType !== 'DistinctCount')) {
                type = COUNT;
            } else {
                type = this.parent.engineModule.fieldList[key].aggregateType !== undefined ?
                    this.parent.engineModule.fieldList[key].aggregateType : SUM;
            }
            let checkbox: CheckBox = new CheckBox({
                label: this.parent.engineModule.fieldList[key].caption + ' (' + this.parent.localeObj.getConstant(type) + ')'
            });
            checkbox.isStringTemplate = true;
            checkbox.appendTo('#' + this.parentID + '_' + index);
            document.querySelector('#' + this.parentID + '_' + index).setAttribute('data-field', key);
            document.querySelector('#' + this.parentID + '_' + index).setAttribute('data-type', type);
        }
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
    public createCalculatedFieldDialog(args?: { edit: boolean, fieldName: string }): void {
        if (this.parent.isAdaptive && this.parent.getModuleName() === 'pivotfieldlist') {
            this.renderAdaptiveLayout(args && args.edit !== undefined ? args.edit : true);
            this.isEdit = (args && args.edit !== undefined ? args.edit : this.isEdit);
        } else if (!this.parent.isAdaptive) {
            this.isEdit = (args && args.edit !== undefined ? args.edit : false);
            this.renderDialogLayout();
            if (args && args.edit) {
                let target: HTMLElement = this.treeObj.element.querySelector('li[data-field="' + args.fieldName + '"]');
                if (target) {
                    addClass([target], ['e-active', 'e-node-focus']);
                    target.setAttribute('aria-selected', 'true');
                    target.id = this.treeObj.element.id + '_active';
                    if (this.parent.dataType === 'pivot') {
                        /* tslint:disable-next-line */
                        let e: any = { event: { target: target.querySelector('.e-list-icon.e-edit.e-icons') as EventTarget } } as NodeClickEventArgs;
                        this.fieldClickHandler(e);
                    } else {
                        this.displayMenu(target);
                    }
                }
            }
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
        if (this.parent.dataType === 'pivot') {
            let customerFormatObj: MaskedTextBox = new MaskedTextBox({
                placeholder: this.parent.localeObj.getConstant('numberFormatString')
            });
            customerFormatObj.isStringTemplate = true;
            customerFormatObj.appendTo('#' + this.parentID + 'Custom_Format_Element');
        }
        if (this.parent.dataType === 'olap' && !this.parent.isAdaptive) {
            this.createOlapDropElements();
        }
        this.createTreeView();
        this.droppable = new Droppable(this.dialog.element.querySelector('#' + this.parentID + 'droppable') as HTMLElement);
        this.keyboardEvents = new KeyboardEvents(this.parent.calculatedFieldModule.dialog.element, {
            keyAction: this.keyActionHandler.bind(this),
            keyConfigs: { moveRight: 'rightarrow', enter: 'enter', shiftE: 'shift+E', delete: 'delete' },
            eventName: 'keydown'
        });
    }

    /**
     * Creates the error dialog for the unexpected action done.
     * @method createConfirmDialog
     * @return {void}
     * @hidden
     */
    private createConfirmDialog(title: string, description: string, calcInfo: ICalculatedFields, isRemove?: boolean, node?: Element): void {
        let errorDialog: HTMLElement = createElement('div', {
            id: this.parentID + '_ErrorDialog',
            className: cls.ERROR_DIALOG_CLASS
        });
        /* tslint:disable:max-line-length */
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
                    click: isRemove ? this.removeCalcField.bind(this, node) : this.replaceFormula.bind(this, calcInfo),
                    buttonModel: {
                        cssClass: cls.OK_BUTTON_CLASS + ' ' + cls.FLAT_CLASS,
                        content: isRemove ? this.parent.localeObj.getConstant('yes') : this.parent.localeObj.getConstant('ok'), isPrimary: true
                    }
                },
                {
                    click: this.removeErrorDialog.bind(this),
                    buttonModel: {
                        cssClass: cls.CANCEL_BUTTON_CLASS,
                        content: isRemove ? this.parent.localeObj.getConstant('no') : this.parent.localeObj.getConstant('cancel'), isPrimary: true
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
        /* tslint:enable:max-line-length */
        this.confirmPopUp.isStringTemplate = true;
        this.confirmPopUp.appendTo(errorDialog);
        // this.confirmPopUp.element.querySelector('.e-dlg-header').innerHTML = title;
    }

    private replaceFormula(calcInfo: ICalculatedFields): void {
        let report: IDataOptions = this.parent.dataSourceSettings as IDataOptions;
        if (this.parent.dataType === 'olap') {
            for (let j: number = 0; j < report.calculatedFieldSettings.length; j++) {
                if (report.calculatedFieldSettings[j].name === calcInfo.name) {
                    if (!isNullOrUndefined(calcInfo.hierarchyUniqueName)) {
                        report.calculatedFieldSettings[j].hierarchyUniqueName = calcInfo.hierarchyUniqueName;
                    }
                    report.calculatedFieldSettings[j].formatString = calcInfo.formatString;
                    report.calculatedFieldSettings[j].formula = calcInfo.formula;
                    this.parent.lastCalcFieldInfo = report.calculatedFieldSettings[j];
                    break;
                }
            }
        } else {
            for (let i: number = 0; i < report.values.length; i++) {
                if (report.values[i].type === CALC && report.values[i].name === calcInfo.name) {
                    for (let j: number = 0; j < report.calculatedFieldSettings.length; j++) {
                        if (report.calculatedFieldSettings[j].name === calcInfo.name) {
                            report.calculatedFieldSettings[j].formula = calcInfo.formula;
                            this.parent.lastCalcFieldInfo = report.calculatedFieldSettings[j];
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
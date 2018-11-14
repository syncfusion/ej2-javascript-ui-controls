import { Dialog, OffsetPosition, BeforeOpenEventArgs } from '@syncfusion/ej2-popups';
import { Droppable, createElement, extend, remove, addClass, closest } from '@syncfusion/ej2-base';
import { prepend, append, KeyboardEvents, KeyboardEventArgs, removeClass } from '@syncfusion/ej2-base';
import { IDataOptions, IFieldOptions, ICalculatedFields } from '../../base/engine';
import { PivotView } from '../../pivotview/base/pivotview';
import { Button, RadioButton, CheckBox, ChangeArgs } from '@syncfusion/ej2-buttons';
import { MaskedTextBox } from '@syncfusion/ej2-inputs';
import * as cls from '../../common/base/css-constant';
import {
    TreeView, DragAndDropEventArgs, NodeExpandEventArgs, BeforeOpenCloseMenuEventArgs,
    NodeClickEventArgs, MenuEventArgs, DrawNodeEventArgs, ExpandEventArgs
} from '@syncfusion/ej2-navigations';
import { ContextMenu as Menu, MenuItemModel, ContextMenuModel } from '@syncfusion/ej2-navigations';
import { IAction } from '../../common/base/interface';
import * as events from '../../common/base/constant';
import { PivotFieldList } from '../../pivotfieldlist/base/field-list';
import { Tab, Accordion, AccordionItemModel } from '@syncfusion/ej2-navigations';

/**
 * Module to render Calculated Field Dialog
 */

const COUNT: string = 'Count';
const AVG: string = 'Avg';
const MIN: string = 'Min';
const MAX: string = 'Max';
const SUM: string = 'Sum';
const CALC: string = 'CalculatedField';
const AGRTYPE: string = 'AggregateType';

/** @hidden */
export class CalculatedField implements IAction {
    public parent: PivotView | PivotFieldList;

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
                    this.displayMenu(node.previousSibling as HTMLElement);
                    break;
                case 'enter':
                    let field: string = node.getAttribute('data-field');
                    let type: string = node.getAttribute('data-type');
                    let dropField: HTMLTextAreaElement =
                        this.dialog.element.querySelector('#' + this.parentID + 'droppable') as HTMLTextAreaElement;
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

    /**
     * To display context menu.
     * @param  {HTMLElement} node
     * @returns void
     */
    private displayMenu(node: HTMLElement): void {
        if (document.querySelector('.' + this.parentID + 'calculatedmenu') !== null &&
            node.querySelector('.e-list-icon').classList.contains(cls.ICON) &&
            !node.querySelector('.e-list-icon').classList.contains(cls.CALC_EDITED) &&
            !node.querySelector('.e-list-icon').classList.contains(cls.CALC_EDIT) && node.tagName === 'LI') {
            this.menuObj.close();
            this.curMenu = (node.querySelector('.' + cls.LIST_TEXT_CLASS) as HTMLElement);
            this.openContextMenu();
        } else if (node.querySelector('.e-list-icon').classList.contains(cls.CALC_EDIT) && node.tagName === 'LI') {
            addClass([node.querySelector('.e-list-icon')], cls.CALC_EDITED);
            removeClass([node.querySelector('.e-list-icon')], cls.CALC_EDIT);
            node.querySelector('.' + cls.CALC_EDITED).setAttribute('title', this.parent.localeObj.getConstant('clear'));
            this.isEdit = true;
            this.currentFieldName = node.getAttribute('data-field');
            this.inputObj.value = node.getAttribute('data-caption');
            (this.dialog.element.querySelector('.' + cls.CALCINPUT) as HTMLInputElement).value = node.getAttribute('data-caption');
            (document.querySelector('#' + this.parentID + 'droppable') as HTMLTextAreaElement).value = node.getAttribute('data-uid');
        } else if (node.querySelector('.e-list-icon').classList.contains(cls.CALC_EDITED) && node.tagName === 'LI') {
            addClass([node.querySelector('.e-list-icon')], cls.CALC_EDIT);
            removeClass([node.querySelector('.e-list-icon')], cls.CALC_EDITED);
            node.querySelector('.' + cls.CALC_EDIT).setAttribute('title', this.parent.localeObj.getConstant('edit'));
            this.isEdit = false;
            this.inputObj.value = '';
            (this.dialog.element.querySelector('.' + cls.CALCINPUT) as HTMLInputElement).value = '';
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
            closest(this.curMenu, '.e-list-item').setAttribute('data-type', menu.element.textContent);
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
    private createMenu(): void {
        let menuItems: MenuItemModel[] = [
            {
                text: COUNT,
            },
            {
                text: AVG
            },
            {
                text: MIN
            },
            {
                text: MAX
            },
            {
                text: SUM
            }];
        let menuOptions: ContextMenuModel = {
            cssClass: this.parentID + 'calculatedmenu',
            items: menuItems,
            enableRtl: this.parent.enableRtl,
            beforeOpen: this.beforeMenuOpen.bind(this),
            select: this.selectContextMenu.bind(this)
        };
        this.parent.element.appendChild(createElement('ul', {
            id: this.parentID + 'contextmenu'
        }));
        this.menuObj = new Menu(menuOptions);
        this.menuObj.appendTo('#' + this.parentID + 'contextmenu');
    }

    /**
     * Triggers while click OK button.
     * @returns void
     */
    private applyFormula(): void {
        let currentObj: CalculatedField = this;
        let isExist: boolean = false;
        removeClass([document.getElementById(this.parentID + 'ddlelement')], cls.EMPTY_FIELD);
        Object.keys(currentObj.parent.engineModule.fieldList).forEach((key: string, index: number) => {
            if (currentObj.inputObj.value && currentObj.inputObj.value === key &&
                currentObj.parent.engineModule.fieldList[key].aggregateType !== 'CalculatedField') {
                isExist = true;
            }
        });
        if (isExist) {
            currentObj.parent.pivotCommon.errorDialog.createErrorDialog(
                currentObj.parent.localeObj.getConstant('error'), currentObj.parent.localeObj.getConstant('fieldExist'));
            return;
        }
        this.newFields = extend([], (this.parent.dataSource as IDataOptions).calculatedFieldSettings, null, true) as ICalculatedFields[];
        this.existingReport = extend({}, this.parent.dataSource, null, true) as IDataOptions;
        let report: IDataOptions = this.parent.dataSource;
        let dropField: HTMLTextAreaElement = document.querySelector('#' + this.parentID + 'droppable') as HTMLTextAreaElement;
        if (this.inputObj.value !== null && this.inputObj.value !== '' && dropField.value !== '') {
            let field: IFieldOptions = {
                name: this.inputObj.value,
                type: 'CalculatedField'
            };
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

    private addFormula(report: IDataOptions, field: string): void {
        try {
            this.parent.setProperties({ dataSource: report }, true);
            this.parent.updateDataSource(false);
            this.isEdit = false;
            if (this.dialog) {
                this.dialog.close();
            } else {
                this.inputObj.value = '';
                this.formulaText = null;
                this.fieldText = null;
                ((this.parent as PivotFieldList).
                    dialogRenderer.parentElement.querySelector('.' + cls.CALCINPUT) as HTMLInputElement).value = '';
                ((this.parent as PivotFieldList).
                    dialogRenderer.parentElement.querySelector('#' + this.parentID + 'droppable') as HTMLTextAreaElement).value = '';
            }
        } catch (exception) {
            if (this.parent.engineModule.fieldList[field]) {
                delete this.parent.engineModule.fieldList[field];
            }
            this.parent.pivotCommon.errorDialog.createErrorDialog(
                this.parent.localeObj.getConstant('error'), this.parent.localeObj.getConstant('invalidFormula'));
            this.parent.setProperties({ dataSource: this.existingReport }, true);
            this.parent.updateDataSource(false);
        }
    }

    /**
     * To get treeview data
     * @param  {PivotGrid|PivotFieldList} parent
     * @returns Object
     */
    private getFieldListData(parent: PivotView | PivotFieldList): { [key: string]: Object }[] {
        let fields: { [key: string]: Object }[] = [];
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
        let field: string = args.draggedNode.getAttribute('data-field');
        let type: string = args.draggedNode.getAttribute('data-type');
        let dropField: HTMLTextAreaElement = this.dialog.element.querySelector('#' + this.parentID + 'droppable') as HTMLTextAreaElement;
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
            className: cls.CALCDIALOG
        }));
        this.dialog = new Dialog({
            allowDragging: true,
            position: { X: 'center', Y: 'center' },
            buttons: [
                {
                    'click': () => this.applyFormula(),
                    buttonModel: {
                        content: this.parent.localeObj.getConstant('ok'),
                        isPrimary: true
                    }
                },
                {
                    'click': () => {
                        this.dialog.close();
                        this.isEdit = false;
                    },
                    buttonModel: {
                        content: this.parent.localeObj.getConstant('cancel')
                    }
                }
            ],
            close: (args: Object) => {
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
            },
            beforeOpen: (args: BeforeOpenEventArgs) => {
                this.dialog.element.querySelector('.e-dlg-header').
                    setAttribute('title', this.parent.localeObj.getConstant('createCalculatedField'));
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
        this.dialog.appendTo('#' + this.parentID + 'calculateddialog');
    }

    /**
     * To render dialog elements.
     * @returns void
     */
    private renderDialogElements(): HTMLElement {
        let outerDiv: HTMLElement = createElement('div', { id: this.parentID + 'outerDiv', className: cls.CALCOUTERDIV });
        if (this.parent.getModuleName() === 'pivotfieldlist' && (this.parent as PivotFieldList).
            dialogRenderer.parentElement.querySelector('.' + cls.FORMULA) !== null && this.parent.isAdaptive) {
            let accordDiv: HTMLElement = createElement('div', { id: this.parentID + 'accordDiv', className: cls.CALCACCORD });
            outerDiv.appendChild(accordDiv);
            let buttonDiv: HTMLElement = createElement('div', { id: this.parentID + 'buttonDiv', className: cls.CALCBUTTONDIV });
            let addBtn: HTMLElement = createElement('button', {
                id: this.parentID + 'addBtn', innerHTML: 'ADD',
                className: cls.CALCADDBTN
            });
            let cancelBtn: HTMLElement = createElement('button', {
                id: this.parentID + 'cancelBtn', innerHTML: 'CANCEL',
                className: cls.CALCCANCELBTN
            });
            buttonDiv.appendChild(cancelBtn);
            buttonDiv.appendChild(addBtn);
            outerDiv.appendChild(buttonDiv);
        } else {
            let inputDiv: HTMLElement = createElement('div', { id: this.parentID + 'outerDiv', className: cls.CALCINPUTDIV });
            let inputObj: HTMLInputElement = createElement('input', {
                id: this.parentID + 'ddlelement',
                attrs: { 'type': 'text', 'tabindex': '1' },
                className: cls.CALCINPUT
            }) as HTMLInputElement;
            inputDiv.appendChild(inputObj);
            outerDiv.appendChild(inputDiv);
            if (!this.parent.isAdaptive) {
                let fieldTitle: HTMLElement = createElement('div', {
                    className: cls.PIVOT_ALL_FIELD_TITLE_CLASS,
                    innerHTML: this.parent.localeObj.getConstant('formulaField')
                });
                outerDiv.appendChild(fieldTitle);
            }
            let wrapDiv: HTMLElement = createElement('div', { id: this.parentID + 'control_wrapper', className: cls.TREEVIEWOUTER });
            wrapDiv.appendChild(createElement('div', { id: this.parentID + 'tree', className: cls.TREEVIEW }));
            outerDiv.appendChild(wrapDiv);
            if (!this.parent.isAdaptive) {
                let formulaTitle: HTMLElement = createElement('div', {
                    className: cls.PIVOT_FORMULA_TITLE_CLASS,
                    innerHTML: this.parent.localeObj.getConstant('formula')
                });
                outerDiv.appendChild(formulaTitle);
            }
            let dropDiv: HTMLElement = createElement('textarea', {
                id: this.parentID + 'droppable',
                className: cls.FORMULA,
                attrs: {
                    'placeholder': this.parent.isAdaptive ? this.parent.localeObj.getConstant('dropTextMobile') :
                        this.parent.localeObj.getConstant('dropText')
                }
            });
            outerDiv.appendChild(dropDiv);
            if (this.parent.isAdaptive) {
                let buttonDiv: HTMLElement = createElement('div', { id: this.parentID + 'buttonDiv', className: cls.CALCBUTTONDIV });
                let okBtn: HTMLElement = createElement('button', {
                    id: this.parentID + 'okBtn', innerHTML: this.parent.localeObj.getConstant('apply'),
                    className: cls.CALCOKBTN
                });
                buttonDiv.appendChild(okBtn);
                outerDiv.appendChild(buttonDiv);
            }
        }
        return outerDiv;
    }


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
    private createTreeView(): void {
        this.treeObj = new TreeView({
            fields: { dataSource: this.getFieldListData(this.parent), id: 'formula', text: 'name', iconCss: 'icon' },
            allowDragAndDrop: true,
            enableRtl: this.parent.enableRtl,
            nodeCollapsing: (args: NodeExpandEventArgs) => {
                args.cancel = true;
            },
            nodeDragStart: (args: DragAndDropEventArgs) => {
                if ((args.event.target as HTMLElement).classList.contains(cls.DRAG_CLASS)) {
                    let dragItem: HTMLElement = document.querySelector('.e-drag-item.e-treeview') as HTMLElement;
                    addClass([dragItem], cls.PIVOTCALC);
                    dragItem.style.zIndex = (this.dialog.zIndex + 1).toString();
                    dragItem.style.display = 'inline';
                } else {
                    args.cancel = true;
                }
            },
            nodeClicked: this.fieldClickHandler.bind(this),
            nodeDragStop: this.fieldDropped.bind(this),
            drawNode: this.drawTreeNode.bind(this),
            sortOrder: 'Ascending'
        });
        this.treeObj.appendTo('#' + this.parentID + 'tree');
    }

    /**
     * Trigger before treeview text append.
     * @param  {DrawNodeEventArgs} args
     * @returns void
     */
    private drawTreeNode(args: DrawNodeEventArgs): void {
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

    /**
     * To create radio buttons.
     * @param  {string} key
     * @returns HTMLElement
     */
    private createTypeContainer(key: string): HTMLElement {
        let wrapDiv: HTMLElement = createElement('div', { id: this.parentID + 'control_wrapper', className: cls.TREEVIEWOUTER });
        let type: string[] = [SUM, COUNT, AVG, MIN, MAX];
        for (let i: number = 0; i < 5; i++) {
            let input: HTMLInputElement = createElement('input', {
                id: this.parentID + 'radio' + key + type[i],
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
        let cancelBtn: Button = new Button({ cssClass: cls.FLAT, isPrimary: true });
        cancelBtn.appendTo('#' + this.parentID + 'cancelBtn');
        if (cancelBtn.element) {
            cancelBtn.element.onclick = this.cancelBtnClick.bind(this);
        }
        if ((this.parent as PivotFieldList).
            dialogRenderer.parentElement.querySelector('.' + cls.FORMULA) !== null && this.parent.isAdaptive) {
            let okBtn: Button = new Button({ cssClass: cls.FLAT + ' ' + cls.OUTLINE_CLASS, isPrimary: true });
            okBtn.appendTo('#' + this.parentID + 'okBtn');
            this.inputObj = new MaskedTextBox({
                placeholder: this.parent.localeObj.getConstant('fieldName')
            });
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
            let accordion: Accordion = new Accordion({
                items: this.getAccordionData(this.parent),
                enableRtl: this.parent.enableRtl,
                expanding: (args: ExpandEventArgs) => {
                    if (args.element.querySelectorAll('.e-radio-wrapper').length === 0) {
                        Object.keys(this.parent.engineModule.fieldList).forEach((key: string) => {
                            let type: string[] = [SUM, COUNT, AVG, MIN, MAX];
                            let radiobutton: RadioButton;
                            if (key === args.element.querySelector('[data-field').getAttribute('data-field')) {
                                for (let i: number = 0; i < 5; i++) {
                                    radiobutton = new RadioButton({
                                        label: type[i],
                                        name: AGRTYPE + key,
                                        change: (args: ChangeArgs) => {
                                            let type: string =
                                                ((args.event.target as HTMLElement).parentElement.querySelector('.e-label') as HTMLElement).
                                                    innerText;
                                            let field: string = (args.event.target as HTMLElement).closest('.e-acrdn-item').
                                                querySelector('[data-field').getAttribute('data-caption');
                                            ((args.event.target as HTMLElement).
                                                closest('.e-acrdn-item').querySelector('.e-label') as HTMLElement).
                                                innerText = field + ' (' + type + ')';
                                            (args.event.target as HTMLElement).closest('.e-acrdn-item').
                                                querySelector('[data-type').setAttribute('data-type', type);
                                        },
                                    });
                                    radiobutton.appendTo('#' + this.parentID + 'radio' + key + type[i]);
                                }
                            }
                        });
                    }
                },
            });
            let addBtn: Button = new Button({ cssClass: cls.FLAT, isPrimary: true });
            addBtn.appendTo('#' + this.parentID + 'addBtn');
            accordion.appendTo('#' + this.parentID + 'accordDiv');
            Object.keys(this.parent.engineModule.fieldList).forEach((key: string, index: number) => {
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
                checkbox.appendTo('#' + this.parentID + '_' + index);
                document.querySelector('#' + this.parentID + '_' + index).setAttribute('data-field', key);
                document.querySelector('#' + this.parentID + '_' + index).setAttribute('data-type', type);
            });
            if (addBtn.element) {
                addBtn.element.onclick = this.addBtnClick.bind(this);
            }
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
        let node: NodeListOf<Element> = document.querySelectorAll('.e-accordion .e-check');
        let fieldText: string = '';
        let field: string = null;
        let type: string = null;
        for (let i: number = 0; i < node.length; i++) {
            field = node[i].parentElement.querySelector('[data-field]').getAttribute('data-field');
            type = node[i].parentElement.querySelector('[data-field]').getAttribute('data-type');
            if (type.indexOf(CALC) === -1) {
                fieldText = fieldText + ('"' + type + '(' + field + ')' + '"');
            } else {
                for (let j: number = 0; j < this.parent.dataSource.calculatedFieldSettings.length; j++) {
                    if (this.parent.dataSource.calculatedFieldSettings[j].name === field) {
                        fieldText = fieldText + this.parent.dataSource.calculatedFieldSettings[j].formula;
                        break;
                    }
                }
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
        this.newFields = extend([], (this.parent.dataSource as IDataOptions).calculatedFieldSettings, null, true) as ICalculatedFields[];
        this.createDialog();
        this.dialog.content = this.renderDialogElements();
        this.dialog.refresh();
        this.inputObj = new MaskedTextBox({
            placeholder: this.parent.localeObj.getConstant('fieldName')
        });
        this.inputObj.appendTo('#' + this.parentID + 'ddlelement');
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
            close: this.removeErrorDialog.bind(this)
        });
        this.confirmPopUp.appendTo(errorDialog);
    }

    private replaceFormula(): void {
        let report: IDataOptions = this.parent.dataSource;
        let dropField: HTMLTextAreaElement = document.querySelector('#' + this.parentID + 'droppable') as HTMLTextAreaElement;
        for (let i: number = 0; i < report.values.length; i++) {
            if (report.values[i].type === CALC && report.values[i].name === this.inputObj.value) {
                for (let j: number = 0; j < report.calculatedFieldSettings.length; j++) {
                    if (report.calculatedFieldSettings[j].name === this.inputObj.value) {
                        report.calculatedFieldSettings[j].formula = dropField.value;
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
import { createElement, isNullOrUndefined, addClass, removeClass } from '@syncfusion/ej2-base';
import { EventHandler, setStyleAttribute, extend } from '@syncfusion/ej2-base';
import { PivotFieldList } from '../base/field-list';
import * as cls from '../../common/base/css-constant';
import { Dialog, ButtonPropsModel } from '@syncfusion/ej2-popups';
import { Button, CheckBox, ChangeEventArgs } from '@syncfusion/ej2-buttons';
import { Tab, SelectEventArgs, TabItemModel } from '@syncfusion/ej2-navigations';
import * as events from '../../common/base/constant';
import { IDataOptions, IFieldListOptions } from '../../base/engine';

/**
 * Module to render Pivot Field List Dialog
 */
/** @hidden */
export class DialogRenderer {
    public parent: PivotFieldList;
    /** @hidden */
    public parentElement: HTMLElement;
    /** @hidden */
    public fieldListDialog: Dialog;
    /** @hidden */
    public adaptiveElement: Tab;

    private deferUpdateApplyButton: Button;
    private deferUpdateCancelButton: Button;

    /** Constructor for render module */
    constructor(parent: PivotFieldList) {
        this.parent = parent;
    }
    /**
     * Initialize the field list layout rendering
     * @returns void
     * @private
     */
    public render(): void {
        let fieldListWrappper: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_Wrapper',
            className: cls.WRAPPER_CLASS,
            styles: 'width:' + this.parent.element.style.width
        });
        if (this.parent.isAdaptive) {
            addClass([fieldListWrappper], cls.DEVICE);
        } else {
            removeClass([fieldListWrappper], cls.DEVICE);
        }
        if (this.parent.enableRtl) {
            addClass([fieldListWrappper], cls.RTL);
        } else {
            removeClass([fieldListWrappper], cls.RTL);
        }
        if (this.parent.cssClass) {
            addClass([fieldListWrappper], this.parent.cssClass);
        }
        this.parentElement = createElement('div', { className: cls.CONTAINER_CLASS });
        this.parent.element.appendChild(fieldListWrappper);
        if (this.parent.isAdaptive) {
            fieldListWrappper.removeAttribute('style');
            this.parentElement = createElement('div', { className: cls.ADAPTIVE_CONTAINER_CLASS });
            this.renderAdaptiveLayout(fieldListWrappper);
        }
        if (this.parent.renderMode === 'Popup') {
            this.renderFieldListDialog(fieldListWrappper);
            this.unWireDialogEvent(this.parent.element.querySelector('.' + cls.TOGGLE_FIELD_LIST_CLASS));
            this.wireDialogEvent(this.parent.element.querySelector('.' + cls.TOGGLE_FIELD_LIST_CLASS));
        } else {
            this.renderStaticLayout(fieldListWrappper);
        }
    }
    private renderStaticLayout(fieldListWrappper: HTMLElement): void {
        if (!this.parent.isAdaptive) {
            let layoutHeader: HTMLElement = createElement('div', {
                className: cls.FIELD_LIST_TITLE_CLASS
            });
            let headerContent: HTMLElement = createElement('div', {
                className: cls.FIELD_LIST_TITLE_CONTENT_CLASS,
                innerHTML: this.parent.localeObj.getConstant('staticFieldList')
            });
            layoutHeader.appendChild(headerContent);
            layoutHeader.appendChild(this.createCalculatedButton());
            addClass([fieldListWrappper], cls.STATIC_FIELD_LIST_CLASS);
            fieldListWrappper.appendChild(layoutHeader);
            fieldListWrappper.appendChild(this.parentElement);
            addClass([fieldListWrappper], cls.STATIC_FIELD_LIST_CLASS);
            if (this.parent.allowDeferLayoutUpdate) {
                fieldListWrappper.appendChild(this.createDeferUpdateButtons());
                this.renderDeferUpdateButtons();
            }
        }
    }

    private renderDeferUpdateButtons(): void {
        if (this.parent.allowDeferLayoutUpdate) {
            let checkBoxObj: CheckBox = new CheckBox({
                label: this.parent.localeObj.getConstant('deferLayoutUpdate'),
                checked: true,
                enableRtl: this.parent.enableRtl,
                change: this.onCheckChange.bind(this)
            });
            checkBoxObj.appendTo('#' + this.parent.element.id + 'DeferUpdateCheckBox');
            this.deferUpdateApplyButton = new Button({
                cssClass: cls.DEFER_APPLY_BUTTON + ' ' + cls.DEFER_UPDATE_BUTTON + (this.parent.renderMode === 'Popup' ?
                (' ' + cls.BUTTON_FLAT_CLASS) : ''),
                content: this.parent.localeObj.getConstant('apply'),
                enableRtl: this.parent.enableRtl,
                isPrimary: true
            });
            this.deferUpdateApplyButton.appendTo('#' + this.parent.element.id + '_DeferUpdateButton1');
            this.deferUpdateApplyButton.element.onclick = this.parent.renderMode === 'Fixed' ? this.applyButtonClick.bind(this) :
                this.onDeferUpdateClick.bind(this);
        }
        this.deferUpdateCancelButton = new Button({
            cssClass: cls.DEFER_CANCEL_BUTTON + ' ' + cls.CANCEL_BUTTON_CLASS + (this.parent.renderMode === 'Popup' ?
            (' ' + cls.BUTTON_FLAT_CLASS) : ''),
            content: this.parent.allowDeferLayoutUpdate ? this.parent.localeObj.getConstant('cancel') :
                this.parent.localeObj.getConstant('close'),
            enableRtl: this.parent.enableRtl, isPrimary: !this.parent.allowDeferLayoutUpdate
        });
        this.deferUpdateCancelButton.appendTo('#' + this.parent.element.id + '_DeferUpdateButton2');
        this.deferUpdateCancelButton.element.onclick = this.parent.renderMode === 'Fixed' ? this.cancelButtonClick.bind(this) :
            this.onCloseFieldList.bind(this);
    }

    private createDeferUpdateButtons(): HTMLElement {
        let layoutFooter: HTMLElement = createElement('div', {
            className: cls.LAYOUT_FOOTER
        });
        if (this.parent.allowDeferLayoutUpdate) {
            let checkBoxLayout: HTMLElement = createElement('div', {
                className: cls.CHECKBOX_LAYOUT
            });
            let deferUpdateCheckBox: HTMLElement = createElement('input', {
                id: this.parent.element.id + 'DeferUpdateCheckBox'
            });
            checkBoxLayout.appendChild(deferUpdateCheckBox);
            layoutFooter.appendChild(checkBoxLayout);
        }
        let buttonLayout: HTMLElement = createElement('div', {
            className: cls.BUTTON_LAYOUT
        });
        if (this.parent.allowDeferLayoutUpdate) {
            let deferUpdateButton1: HTMLElement = createElement('button', {
                id: this.parent.element.id + '_DeferUpdateButton1'
            });
            buttonLayout.appendChild(deferUpdateButton1);
        }
        let deferUpdateButton2: HTMLElement = createElement('button', {
            id: this.parent.element.id + '_DeferUpdateButton2'
        });
        buttonLayout.appendChild(deferUpdateButton2);
        layoutFooter.appendChild(buttonLayout);
        return layoutFooter;
    }
    private onCheckChange(args: ChangeEventArgs): void {
        if (args.checked) {
            this.parent.clonedDataSource = extend({}, this.parent.dataSource, null, true) as IDataOptions;
            this.parent.clonedFieldList = extend({}, this.parent.pivotFieldList, null, true) as IFieldListOptions;
        }
        this.parent.allowDeferLayoutUpdate = !this.parent.allowDeferLayoutUpdate;
        if (this.parent.renderMode === 'Fixed') {
            this.deferUpdateApplyButton.setProperties({ disabled: !this.parent.allowDeferLayoutUpdate });
            this.deferUpdateCancelButton.setProperties({ disabled: !this.parent.allowDeferLayoutUpdate });
        } else {
            if (this.parent.allowDeferLayoutUpdate) {
                this.deferUpdateApplyButton.element.style.display = '';
                this.deferUpdateCancelButton.setProperties({ content: this.parent.localeObj.getConstant('cancel')});
                this.deferUpdateCancelButton.isPrimary = false;
            } else {
                this.deferUpdateApplyButton.element.style.display = 'none';
                this.deferUpdateCancelButton.setProperties({ content: this.parent.localeObj.getConstant('close')});
                this.deferUpdateCancelButton.isPrimary = true;
            }
        }
        this.cancelButtonClick();
    }
    private applyButtonClick(): void {
        this.parent.updateDataSource(false);
        this.parent.clonedDataSource = extend({}, this.parent.dataSource, null, true) as IDataOptions;
        this.parent.clonedFieldList = extend({}, this.parent.pivotFieldList, null, true) as IFieldListOptions;
    }
    private cancelButtonClick(): void {
        this.parent.
            setProperties({ dataSource: (<{ [key: string]: Object }>this.parent.clonedDataSource).properties as IDataOptions }, true);
        this.parent.engineModule.fieldList = extend({}, this.parent.clonedFieldList, null, true) as IFieldListOptions;
        this.parent.updateDataSource(false, true);
    }
    private renderFieldListDialog(fieldListWrappper: HTMLElement): void {
        let toggleFieldList: HTMLElement = createElement('div', {
            className: cls.TOGGLE_FIELD_LIST_CLASS + ' ' + cls.ICON + ' ' + cls.TOGGLE_SELECT_CLASS,
            attrs: {
                'tabindex': '0',
                title: this.parent.localeObj.getConstant('fieldList'),
                'aria-disabled': 'false',
                'aria-label': this.parent.localeObj.getConstant('fieldList')
            }
        });
        this.parent.element.appendChild(toggleFieldList);
        if (this.parent.isAdaptive) {
            let buttons: ButtonPropsModel[] = [{
                click: this.showFieldListDialog.bind(this),
                buttonModel: {
                    cssClass: cls.ADAPTIVE_FIELD_LIST_BUTTON_CLASS + ' ' + cls.BUTTON_SMALL_CLASS + ' ' + cls.BUTTON_ROUND_CLASS,
                    iconCss: cls.ICON + ' ' + cls.ADD_ICON_CLASS,
                    isPrimary: true
                }
            }, {
                click: this.showCalculatedField.bind(this),
                buttonModel: {
                    cssClass: cls.ADAPTIVE_CALCULATED_FIELD_BUTTON_CLASS +
                        ' ' + cls.BUTTON_SMALL_CLASS + ' ' + cls.BUTTON_ROUND_CLASS + ' ' + cls.ICON_DISABLE,
                    iconCss: cls.ICON + ' ' + cls.ADD_ICON_CLASS, enableRtl: this.parent.enableRtl,
                    isPrimary: true
                }
            }, {
                click: this.onDeferUpdateClick.bind(this),
                buttonModel: {
                    content: this.parent.localeObj.getConstant('apply'), enableRtl: this.parent.enableRtl,
                    cssClass: cls.DEFER_APPLY_BUTTON + ' ' + cls.DEFER_UPDATE_BUTTON + ' ' + cls.BUTTON_FLAT_CLASS,
                    isPrimary: true
                }
            }, {
                click: this.onCloseFieldList.bind(this),
                buttonModel: {
                    cssClass: cls.DEFER_CANCEL_BUTTON + ' ' + cls.CANCEL_BUTTON_CLASS + ' ' + cls.BUTTON_FLAT_CLASS,
                    content: this.parent.allowDeferLayoutUpdate ? this.parent.localeObj.getConstant('cancel') :
                        this.parent.localeObj.getConstant('close'),
                    enableRtl: this.parent.enableRtl
                }
            }];
            if (!this.parent.allowDeferLayoutUpdate) {
                buttons.splice(2, 1);
            }
            this.fieldListDialog = new Dialog({
                animationSettings: { effect: 'Zoom' },
                content: this.parentElement,
                isModal: true,
                showCloseIcon: false,
                visible: false,
                allowDragging: false,
                closeOnEscape: false,
                enableRtl: this.parent.enableRtl,
                width: '100%',
                height: '100%',
                position: { X: 'center', Y: 'center' },
                buttons: buttons,
                target: document.body,
                close: this.removeFieldListIcon.bind(this)
            });
            this.fieldListDialog.appendTo(fieldListWrappper);
            setStyleAttribute(fieldListWrappper.querySelector('#' + fieldListWrappper.id + '_dialog-content') as HTMLElement, {
                'padding': '0'
            });
            let footer: Element = fieldListWrappper.querySelector('.' + cls.FOOTER_CONTENT_CLASS);
            addClass([footer], cls.FIELD_LIST_FOOTER_CLASS);
            removeClass([footer.querySelector('.' + cls.ADAPTIVE_CALCULATED_FIELD_BUTTON_CLASS) as Element], cls.BUTTON_FLAT_CLASS);
            removeClass([footer.querySelector('.' + cls.ADAPTIVE_FIELD_LIST_BUTTON_CLASS)], cls.BUTTON_FLAT_CLASS);
        } else {
            let template: string = this.createDeferUpdateButtons().outerHTML;
            let headerTemplate: string = '<div class=' + cls.TITLE_HEADER_CLASS + '><div class=' +
                cls.TITLE_CONTENT_CLASS + '>' + this.parent.localeObj.getConstant('fieldList') + '</div></div>';
            this.fieldListDialog = new Dialog({
                animationSettings: { effect: 'Zoom' },
                header: headerTemplate,
                content: this.parentElement,
                isModal: false,
                showCloseIcon: false,
                visible: false,
                allowDragging: true,
                enableRtl: this.parent.enableRtl,
                width: this.parent.element.style.width,
                position: { X: 'center', Y: this.parent.element.offsetTop },
                footerTemplate: template,
                closeOnEscape: true,
                target: !isNullOrUndefined(this.parent.target) ? ((typeof this.parent.target) === 'string') ?
                    <HTMLElement>document.querySelector(<string>this.parent.target) : <HTMLElement>this.parent.target : document.body,
                close: this.removeFieldListIcon.bind(this)
            });
            this.fieldListDialog.appendTo(fieldListWrappper);
            this.renderDeferUpdateButtons();
            setStyleAttribute(fieldListWrappper.querySelector('#' + fieldListWrappper.id + '_title') as HTMLElement, { 'width': '100%' });
            fieldListWrappper.querySelector('.' + cls.TITLE_HEADER_CLASS).appendChild(this.createCalculatedButton());
        }
    }

    /**
     * Called internally if any of the field added to axis.
     * @hidden
     */
    public updateDataSource(selectedNodes: string[]): void {
        let axis: string[] = ['filters', 'columns', 'rows', 'values'];
        for (let field of selectedNodes) {
            let fieldName: string = field;
            let droppedClass: string = axis[this.adaptiveElement.selectedItem];
            this.parent.pivotCommon.dataSourceUpdate.control = this.parent.getModuleName() === 'pivotview' ?
                this.parent : ((this.parent as PivotFieldList).pivotGridModule ?
                    (this.parent as PivotFieldList).pivotGridModule : this.parent);
            this.parent.pivotCommon.dataSourceUpdate.updateDataSource(fieldName, droppedClass, -1);
        }
        this.parent.axisFieldModule.render();
        if (!this.parent.allowDeferLayoutUpdate) {
            this.parent.updateDataSource(true);
        } else {
            this.parent.triggerPopulateEvent();
        }
    }
    private onDeferUpdateClick(): void {
        this.parent.updateDataSource();
        this.parent.dialogRenderer.fieldListDialog.hide();
    }
    private renderAdaptiveLayout(fieldListWrappper: HTMLElement): void {
        let layoutFooter: HTMLElement = createElement('div', {
            className: cls.FIELD_LIST_FOOTER_CLASS
        });
        fieldListWrappper.appendChild(this.parentElement);
        let items: TabItemModel[] = [
            {
                header: { 'text': this.parent.localeObj.getConstant('filters') },
                content: this.createAxisTable('filters')
            },
            {
                header: { 'text': this.parent.localeObj.getConstant('columns') },
                content: this.createAxisTable('columns')
            },
            {
                header: { 'text': this.parent.localeObj.getConstant('rows') },
                content: this.createAxisTable('rows')
            },
            {
                header: { 'text': this.parent.localeObj.getConstant('values') },
                content: this.createAxisTable('values')
            },
            {
                header: { 'text': this.parent.localeObj.getConstant('createCalculatedField') },
                content: 'Calculated Field Related UI'
            }
        ];
        if (!this.parent.allowCalculatedField) {
            items.pop();
        }
        this.adaptiveElement = new Tab({
            heightAdjustMode: 'Auto',
            items: items,
            height: '100%',
            enableRtl: this.parent.enableRtl,
            selected: (e: SelectEventArgs) => {
                if (fieldListWrappper.querySelector('.' + cls.ADAPTIVE_FIELD_LIST_BUTTON_CLASS)) {
                    if (e.selectedIndex !== 4) {
                        addClass([fieldListWrappper.querySelector('.' + cls.ADAPTIVE_CALCULATED_FIELD_BUTTON_CLASS)], cls.ICON_DISABLE);
                        removeClass([fieldListWrappper.querySelector('.' + cls.ADAPTIVE_FIELD_LIST_BUTTON_CLASS)], cls.ICON_DISABLE);
                    } else {
                        removeClass([fieldListWrappper.querySelector('.' + cls.ADAPTIVE_CALCULATED_FIELD_BUTTON_CLASS)], cls.ICON_DISABLE);
                        addClass([fieldListWrappper.querySelector('.' + cls.ADAPTIVE_FIELD_LIST_BUTTON_CLASS)], cls.ICON_DISABLE);
                    }
                }
                if (e.selectedIndex === 4) {
                    this.adaptiveElement.items[4].content = '';
                    this.adaptiveElement.dataBind();
                    this.parent.notify(events.initCalculatedField, {});
                } else {
                    this.parent.axisFieldModule.render();
                }
            }
        });
        if (this.parent.renderMode === 'Fixed') {
            layoutFooter.appendChild(this.createAddButton());
            addClass([fieldListWrappper], cls.STATIC_FIELD_LIST_CLASS);
            this.adaptiveElement.appendTo(this.parentElement);
            this.parentElement.appendChild(layoutFooter);
        } else {
            this.adaptiveElement.appendTo(this.parentElement);
        }
    }
    private createCalculatedButton(): HTMLElement {
        let calculatedButton: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_CalculatedField'
        });
        let calculateField: Button = new Button({
            cssClass: cls.CALCULATED_FIELD_CLASS + ' ' + cls.ICON_DISABLE,
            content: this.parent.localeObj.getConstant('calculatedField'),
            enableRtl: this.parent.enableRtl
        });
        calculateField.appendTo(calculatedButton);
        if (this.parent.calculatedFieldModule) {
            removeClass([calculatedButton], cls.ICON_DISABLE);
        }
        calculateField.element.onclick = this.showCalculatedField.bind(this);
        return calculatedButton;
    }
    private createAddButton(): HTMLElement {
        let footerContainer: HTMLElement = createElement('div', {
            className: cls.FIELD_LIST_FOOTER_CLASS + '-content'
        });
        let fieldListButton: HTMLElement = createElement('div', {});
        let calculatedButton: HTMLElement = createElement('div', {});
        let calculateField: Button = new Button({
            cssClass: cls.ADAPTIVE_CALCULATED_FIELD_BUTTON_CLASS +
                ' ' + cls.BUTTON_SMALL_CLASS + ' ' + cls.BUTTON_ROUND_CLASS + ' ' + cls.ICON_DISABLE,
            iconCss: cls.ICON + ' ' + cls.ADD_ICON_CLASS,
            enableRtl: this.parent.enableRtl
        });
        let fieldList: Button = new Button({
            cssClass: cls.ADAPTIVE_FIELD_LIST_BUTTON_CLASS + ' ' + cls.BUTTON_SMALL_CLASS + ' ' + cls.BUTTON_ROUND_CLASS,
            iconCss: cls.ICON + ' ' + cls.ADD_ICON_CLASS,
            enableRtl: this.parent.enableRtl
        });
        fieldList.appendTo(fieldListButton);
        calculateField.appendTo(calculatedButton);
        footerContainer.appendChild(fieldListButton);
        footerContainer.appendChild(calculatedButton);
        calculateField.element.onclick = this.showCalculatedField.bind(this);
        fieldList.element.onclick = this.showFieldListDialog.bind(this);
        return footerContainer;
    }

    private createAxisTable(axis: String): HTMLElement {
        let axisWrapper: HTMLElement = createElement('div', {
            className: cls.FIELD_LIST_CLASS + '-' + axis
        });
        let axisContent: HTMLElement = createElement('div', { className: cls.AXIS_CONTENT_CLASS + ' ' + 'e-' + axis });
        let axisPrompt: HTMLElement = createElement('span', {
            className: cls.AXIS_PROMPT_CLASS,
            innerHTML: this.parent.localeObj.getConstant('addPrompt')
        });
        axisWrapper.appendChild(axisContent);
        axisWrapper.appendChild(axisPrompt);
        return axisWrapper;
    }

    private showCalculatedField(event: Event): void {
        if (!this.parent.isAdaptive) {
            if (this.parent.dialogRenderer.fieldListDialog) {
                this.parent.dialogRenderer.fieldListDialog.hide();
                addClass([this.parent.element.querySelector('.' + cls.TOGGLE_FIELD_LIST_CLASS)], cls.ICON_HIDDEN);
            }
        }
        this.parent.notify(events.initCalculatedField, {});
    }

    private showFieldListDialog(event: Event): void {
        let activeindex: number = this.adaptiveElement.selectedItem;
        this.parent.treeViewModule.render(activeindex);
    }

    private onShowFieldList(): void {
        if (this.parent.allowDeferLayoutUpdate) {
            if (this.parent.isAdaptive) {
                this.parent.axisFieldModule.render();
            }
            this.parent.clonedDataSource = extend({}, this.parent.dataSource, null, true) as IDataOptions;
            this.parent.clonedFieldList = extend({}, this.parent.pivotFieldList, null, true) as IFieldListOptions;
        }
        addClass([this.parent.element.querySelector('.' + cls.TOGGLE_FIELD_LIST_CLASS)], cls.ICON_HIDDEN);
        this.parent.dialogRenderer.fieldListDialog.show();
        this.parent.dialogRenderer.fieldListDialog.element.style.top =
            parseInt(this.parent.dialogRenderer.fieldListDialog.element.style.top, 10) < 0 ?
                '0px' : this.parent.dialogRenderer.fieldListDialog.element.style.top;
    }

    private onCloseFieldList(): void {
        if (this.parent.allowDeferLayoutUpdate) {
            this.parent.dataSource =
                extend({}, (<{ [key: string]: Object }>this.parent.clonedDataSource).properties, null, true) as IDataOptions;
            this.parent.pivotGridModule.engineModule = this.parent.engineModule;
            this.parent.pivotGridModule.
                setProperties({ dataSource: (<{ [key: string]: Object }>this.parent.clonedDataSource).properties as IDataOptions }, true);
            this.parent.engineModule.fieldList = extend({}, this.parent.clonedFieldList, null, true) as IFieldListOptions;
            this.parent.pivotGridModule.notify(events.uiUpdate, this);
            this.parent.pivotGridModule.notify(events.contentReady, this);
        }
        this.parent.dialogRenderer.fieldListDialog.hide();
    }

    private removeFieldListIcon(): void {
        if (!document.getElementById(this.parent.element.id + 'calculateddialog')) {
            removeClass([this.parent.element.querySelector('.' + cls.TOGGLE_FIELD_LIST_CLASS)], cls.ICON_HIDDEN);
        }
    }

    private keyPress(e: KeyboardEvent): void {
        let target: Element = (e.target as HTMLElement);
        if (e.keyCode === 13 && e.target) {
            (e.target as HTMLElement).click();
            e.preventDefault();
            return;
        }
    }

    private wireDialogEvent(element: Element): void {
        EventHandler.add(element, 'keydown', this.keyPress, this);
        EventHandler.add(element, 'click', this.onShowFieldList, this);
    }

    private unWireDialogEvent(element: Element): void {
        EventHandler.remove(element, 'keydown', this.keyPress);
        EventHandler.remove(element, 'click', this.onShowFieldList);
    }
}
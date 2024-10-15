import { createElement, isNullOrUndefined, addClass, removeClass, closest, select, remove, MouseEventArgs } from '@syncfusion/ej2-base';
import { EventHandler, setStyleAttribute} from '@syncfusion/ej2-base';
import { PivotFieldList } from '../base/field-list';
import * as cls from '../../common/base/css-constant';
import { Dialog, ButtonPropsModel } from '@syncfusion/ej2-popups';
import { Button, CheckBox, ChangeEventArgs } from '@syncfusion/ej2-buttons';
import { Tab, SelectEventArgs, TabItemModel } from '@syncfusion/ej2-navigations';
import * as events from '../../common/base/constant';
import { IOlapField } from '../../base/olap/engine';
import { PivotUtil } from '../../base/util';

/**
 * Module to render Pivot Field List Dialog
 */
/** @hidden */
export class DialogRenderer {
    /** @hidden */
    public parent: PivotFieldList;
    /** @hidden */
    public parentElement: HTMLElement;
    /** @hidden */
    public fieldListDialog: Dialog;
    /** @hidden */
    public deferUpdateCheckBox: CheckBox;
    /** @hidden */
    public adaptiveElement: Tab;
    private deferUpdateApplyButton: Button;
    private deferUpdateCancelButton: Button;
    private lastTabIndex: number;

    /** Constructor for render module
     *
     * @param {PivotFieldList} parent - Instance of field list.
     */
    constructor(parent: PivotFieldList) {
        this.parent = parent;
    }
    /**
     * Initialize the field list layout rendering
     *
     * @returns {void}
     * @private
     */
    public render(): void {
        const fieldListWrappper: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_Container',
            className: cls.WRAPPER_CLASS + ' ' + (this.parent.dataType === 'olap' ? cls.OLAP_WRAPPER_CLASS : ''),
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
            addClass([fieldListWrappper], this.parent.cssClass.split(' '));
        }
        if (this.parent.enableFieldSearching) {
            addClass([fieldListWrappper], cls.FIELD_LIST_SEARCH_MODE_CLASS);
        } else {
            removeClass([fieldListWrappper], cls.FIELD_LIST_SEARCH_MODE_CLASS);
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
            const layoutHeader: HTMLElement = createElement('div', {
                className: cls.FIELD_LIST_TITLE_CLASS
            });
            const headerContent: HTMLElement = createElement('div', {
                className: cls.FIELD_LIST_TITLE_CONTENT_CLASS
            });
            headerContent.innerText = this.parent.localeObj.getConstant('staticFieldList');
            layoutHeader.appendChild(headerContent);
            layoutHeader.appendChild(this.createCalculatedButton());
            addClass([fieldListWrappper], cls.STATIC_FIELD_LIST_CLASS);
            fieldListWrappper.appendChild(layoutHeader);
            fieldListWrappper.appendChild(this.parentElement);
            addClass([fieldListWrappper], cls.STATIC_FIELD_LIST_CLASS);
            if (this.parent.allowDeferLayoutUpdate) {
                fieldListWrappper.appendChild(this.createDeferUpdateButtons());
                this.renderDeferUpdateButtons(fieldListWrappper);
            }
        }
    }

    private renderDeferUpdateButtons(fieldListWrappper: HTMLElement): void {
        if (this.parent.allowDeferLayoutUpdate) {
            this.deferUpdateCheckBox = new CheckBox({
                label: this.parent.localeObj.getConstant('deferLayoutUpdate'),
                checked: (this.parent.isPopupView && this.parent.pivotGridModule) ?
                    (isNullOrUndefined(this.parent.pivotGridModule.pivotDeferLayoutUpdate) ? true :
                        this.parent.pivotGridModule.pivotDeferLayoutUpdate) : (isNullOrUndefined(this.parent.isDeferLayoutUpdate) ? true :
                        this.parent.isDeferLayoutUpdate),
                enableRtl: this.parent.enableRtl,
                enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
                locale: this.parent.locale,
                change: this.onCheckChange.bind(this),
                cssClass: this.parent.cssClass
            });
            this.deferUpdateCheckBox.isStringTemplate = true;
            this.deferUpdateCheckBox.appendTo(select('#' + this.parent.element.id + 'DeferUpdateCheckBox', fieldListWrappper) as HTMLElement);
            this.deferUpdateApplyButton = new Button({
                cssClass: cls.DEFER_APPLY_BUTTON + ' ' + cls.DEFER_UPDATE_BUTTON + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''),
                content: this.parent.localeObj.getConstant('apply'),
                enableRtl: this.parent.enableRtl,
                locale: this.parent.locale,
                enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
                isPrimary: true,
                disabled: (this.parent.isPopupView && this.parent.pivotGridModule) ?
                    (!isNullOrUndefined(this.parent.pivotGridModule.pivotDeferLayoutUpdate) ?
                        !this.parent.pivotGridModule.pivotDeferLayoutUpdate : false) :
                    (!isNullOrUndefined(this.parent.isDeferLayoutUpdate) ? !this.parent.isDeferLayoutUpdate : false)
            });
            this.deferUpdateApplyButton.isStringTemplate = true;
            this.deferUpdateApplyButton.appendTo(select('#' + this.parent.element.id + '_DeferUpdateButton1', fieldListWrappper) as HTMLElement);
            this.deferUpdateApplyButton.element.onclick = this.parent.renderMode === 'Fixed' ? this.applyButtonClick.bind(this) :
                this.onDeferUpdateClick.bind(this);
        }
        this.deferUpdateCancelButton = new Button({
            cssClass: cls.DEFER_CANCEL_BUTTON + ' ' + cls.CANCEL_BUTTON_CLASS + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''),
            content: this.parent.allowDeferLayoutUpdate ? this.parent.localeObj.getConstant('cancel') :
                this.parent.localeObj.getConstant('close'),
            enableRtl: this.parent.enableRtl, isPrimary: !this.parent.allowDeferLayoutUpdate,
            locale: this.parent.locale, enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
            disabled: (this.parent.isPopupView && this.parent.pivotGridModule && this.parent.pivotGridModule['refreshing']) ?
                (this.parent.allowDeferLayoutUpdate && !isNullOrUndefined(this.parent.pivotGridModule.pivotDeferLayoutUpdate) ?
                    !this.parent.pivotGridModule.pivotDeferLayoutUpdate : false) : ((this.parent['refreshing'] &&
                        !isNullOrUndefined(this.parent.isDeferLayoutUpdate) && this.parent.allowDeferLayoutUpdate) ?
                    !this.parent.isDeferLayoutUpdate : false)
        });
        this.deferUpdateCancelButton.isStringTemplate = true;
        this.deferUpdateCancelButton.appendTo(select('#' + this.parent.element.id + '_DeferUpdateButton2', fieldListWrappper) as HTMLElement);
        if (this.parent.allowDeferLayoutUpdate && ((!this.parent.isDeferLayoutUpdate && this.parent.renderMode === 'Popup' &&
            this.parent['refreshing']) || (this.parent.isPopupView && this.parent.pivotGridModule &&
                !this.parent.pivotGridModule.pivotDeferLayoutUpdate && this.parent.pivotGridModule['refreshing']))) {
            this.deferUpdateApplyButton.element.style.display = 'none';
            this.deferUpdateCancelButton.setProperties({ content: this.parent.localeObj.getConstant('close') });
            this.deferUpdateCancelButton.isPrimary = true;
            this.deferUpdateApplyButton.disabled = this.parent.isPopupView ? this.parent.pivotGridModule.pivotDeferLayoutUpdate
                : this.parent.isDeferLayoutUpdate;
            this.deferUpdateCancelButton.disabled = this.parent.isPopupView ? this.parent.pivotGridModule.pivotDeferLayoutUpdate
                : this.parent.isDeferLayoutUpdate;
        }
        this.deferUpdateCancelButton.element.onclick = this.onCloseFieldList.bind(this);
    }

    private createDeferUpdateButtons(): HTMLElement {
        const layoutFooter: HTMLElement = createElement('div', {
            className: cls.LAYOUT_FOOTER
        });
        if (this.parent.allowDeferLayoutUpdate) {
            const checkBoxLayout: HTMLElement = createElement('div', {
                className: cls.CHECKBOX_LAYOUT,
                attrs: { 'title': this.parent.localeObj.getConstant('deferLayoutUpdate') }
            });
            const deferUpdateCheckBox: HTMLElement = createElement('input', {
                id: this.parent.element.id + 'DeferUpdateCheckBox'
            });
            checkBoxLayout.appendChild(deferUpdateCheckBox);
            layoutFooter.appendChild(checkBoxLayout);
        }
        const buttonLayout: HTMLElement = createElement('div', {
            className: cls.BUTTON_LAYOUT
        });
        if (this.parent.allowDeferLayoutUpdate) {
            const deferUpdateButton1: HTMLElement = createElement('button', {
                id: this.parent.element.id + '_DeferUpdateButton1', attrs: { 'type': 'button', 'title': this.parent.localeObj.getConstant('apply') }
            });
            buttonLayout.appendChild(deferUpdateButton1);
        }
        const deferUpdateButton2: HTMLElement = createElement('button', {
            id: this.parent.element.id + '_DeferUpdateButton2', attrs: { 'type': 'button', 'title': this.parent.localeObj.getConstant('cancel') }
        });
        buttonLayout.appendChild(deferUpdateButton2);
        layoutFooter.appendChild(buttonLayout);
        return layoutFooter;
    }
    private onCheckChange(args: ChangeEventArgs): void {
        if (args.checked) {
            this.parent.clonedDataSource = PivotUtil.getClonedDataSourceSettings(this.parent.dataSourceSettings);
            if (this.parent.dataType === 'olap') {
                this.parent.clonedFieldListData = PivotUtil.cloneOlapFieldSettings(this.parent.olapEngineModule.fieldListData);
            }
            this.parent.clonedFieldList = PivotUtil.getClonedFieldList(this.parent.pivotFieldList);
        }
        this.parent.isDeferLayoutUpdate = args.checked;
        if (this.parent.isPopupView && this.parent.pivotGridModule) {
            this.parent.pivotGridModule.pivotDeferLayoutUpdate = args.checked;
        }
        if (this.parent.renderMode === 'Fixed') {
            this.deferUpdateApplyButton.setProperties({ disabled: !args.checked });
            this.deferUpdateCancelButton.setProperties({ disabled: !args.checked });
        } else {
            if (this.parent.allowDeferLayoutUpdate && args.checked) {
                this.deferUpdateApplyButton.element.style.display = '';
                this.deferUpdateCancelButton.setProperties({ content: this.parent.localeObj.getConstant('cancel') });
                this.deferUpdateCancelButton.isPrimary = false;
            } else {
                this.deferUpdateApplyButton.element.style.display = 'none';
                this.deferUpdateCancelButton.setProperties({ content: this.parent.localeObj.getConstant('close') });
                this.deferUpdateCancelButton.isPrimary = true;
            }
        }
        if ((Object.keys(this.parent.clonedFieldList).length !== Object.keys(this.parent.pivotFieldList).length) &&
            this.parent.calculatedFieldModule && this.parent.calculatedFieldModule.field && this.parent.dataType === 'pivot') {
            this.parent.engineModule.fields = Object.keys(this.parent.clonedFieldList);
        }
        this.onCloseFieldList(null, true);
    }
    private applyButtonClick(): void {
        if (this.parent.getModuleName() === 'pivotfieldlist' && this.parent.allowDeferLayoutUpdate) {
            (this.parent as PivotFieldList).pivotChange = false;
        }
        this.parent.isDeferUpdateApplied = true;
        this.parent.updateDataSource(false);
        const parent: PivotFieldList = this.parent;
        parent.axisFieldModule.render();
        parent.clonedDataSource = PivotUtil.getClonedDataSourceSettings(parent.dataSourceSettings);
        if (this.parent.dataType === 'olap') {
            this.parent.clonedFieldListData = PivotUtil.cloneOlapFieldSettings(this.parent.olapEngineModule.fieldListData);
        }
        parent.clonedFieldList = PivotUtil.getClonedFieldList(parent.pivotFieldList);
    }
    private onCloseFieldList(args?: MouseEventArgs, isDeferLayoutEnabled?: boolean): void {
        if ((this.parent.allowDeferLayoutUpdate || isDeferLayoutEnabled) && (!this.parent.isPopupView ||
            (this.parent.pivotGridModule && this.parent.pivotGridModule.actionObj.actionName !== '') || this.parent.actionObj.actionName !== '')) {
            this.parent.
                setProperties({
                    dataSourceSettings: this.parent.clonedDataSource
                }, true);
            if (this.parent.dataType === 'olap') {
                this.parent.olapEngineModule.fieldList = PivotUtil.getClonedFieldList(this.parent.clonedFieldList);
                this.parent.olapEngineModule.fieldListData = PivotUtil.cloneOlapFieldSettings(this.parent.clonedFieldListData);
                if (!this.parent.isPopupView) {
                    for (const name of Object.keys(this.parent.clonedFieldList)) {
                        const item: IOlapField = this.parent.clonedFieldList[name as string];
                        this.parent.olapEngineModule.updateFieldlistData(item.id, item.isSelected);
                    }
                } else if (this.parent.isPopupView && this.parent.clonedFieldListData &&
                    Object.keys(this.parent.clonedFieldListData).length > 0) {
                    this.parent.olapEngineModule.fieldListData = this.parent.clonedFieldListData as IOlapField[];
                }
            } else {
                this.parent.engineModule.fieldList = PivotUtil.getClonedFieldList(this.parent.clonedFieldList);
            }
            this.parent.updateDataSource(false, true);
        }
        if ((!this.parent.isDeferLayoutUpdate || ((this.parent as PivotFieldList).pivotGridModule
            && !(this.parent as PivotFieldList).pivotGridModule.pivotDeferLayoutUpdate)) && isDeferLayoutEnabled) {
            (this.parent as PivotFieldList).pivotChange = false;
        }
        if (this.parent.allowDeferLayoutUpdate && this.parent.isPopupView && this.parent.pivotGridModule && !this.parent.isAdaptive) {
            this.parent.pivotGridModule.actionObj.actionName = '';
            this.parent.pivotGridModule.engineModule = this.parent.engineModule;
            this.parent.pivotGridModule.olapEngineModule = this.parent.olapEngineModule;
            this.parent.pivotGridModule.setProperties({
                dataSourceSettings: this.parent.clonedDataSource
            }, true);
        }
        if (this.parent.allowDeferLayoutUpdate && this.parent.allowCalculatedField &&
            this.parent.dataType === 'pivot' && !this.parent.isAdaptive) {
            this.parent.engineModule.fieldList = this.parent.pivotFieldList = PivotUtil.getClonedFieldList(this.parent.clonedFieldList);
            const clonedField: string[] = Object.keys(this.parent.engineModule.fieldList);
            if (this.parent.allowCalculatedField && clonedField.length !== this.parent.engineModule.fields.length) {
                const fields: string[] =  [];
                this.parent.engineModule.fields.forEach((field: string) => {
                    if (clonedField.indexOf(field) !== -1) {
                        fields[fields.length] = field;
                    }
                });
                this.parent.engineModule.fields = fields;
            }
        }
        if (this.parent.renderMode === 'Popup' && !isDeferLayoutEnabled) {
            this.parent.dialogRenderer.fieldListDialog.hide();
            this.parent.actionObj.actionName = events.closeFieldlist;
        } else {
            this.parent.actionObj.actionName = events.actionDropped;
        }
        if (this.parent.actionObj.actionName) {
            this.parent.actionCompleteMethod();
        }
    }
    private renderFieldListDialog(fieldListWrappper: HTMLElement): void {
        const toggleFieldList: HTMLElement = createElement('div', {
            className: cls.TOGGLE_FIELD_LIST_CLASS + ' ' + cls.ICON + ' ' + cls.TOGGLE_SELECT_CLASS,
            attrs: {
                'tabindex': '0',
                title: this.parent.localeObj.getConstant('fieldList'),
                'aria-disabled': 'false',
                'aria-label': this.parent.localeObj.getConstant('fieldList'),
                'role': 'button'
            }
        });
        this.parent.element.appendChild(toggleFieldList);
        if (this.parent.isAdaptive) {
            const headerTemplate: string = '<div class=' + cls.TITLE_MOBILE_HEADER + '><span class="' + cls.ICON + ' ' +
                cls.BACK_ICON + '"></span><div class=' + cls.TITLE_MOBILE_CONTENT + '>' + this.parent.localeObj.getConstant('fieldList') +
                '</div></div>';
            const buttons: ButtonPropsModel[] = [{
                click: this.showFieldListDialog.bind(this),
                isFlat: false,
                buttonModel: {
                    cssClass: cls.ADAPTIVE_FIELD_LIST_BUTTON_CLASS + ' ' + cls.BUTTON_SMALL_CLASS + ' ' + cls.BUTTON_ROUND_CLASS + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''),
                    iconCss: cls.ICON + ' ' + cls.ADD_ICON_CLASS,
                    isPrimary: true
                }
            }, {
                click: this.showCalculatedField.bind(this),
                isFlat: false,
                buttonModel: {
                    cssClass: cls.ADAPTIVE_CALCULATED_FIELD_BUTTON_CLASS +
                        ' ' + cls.BUTTON_SMALL_CLASS + ' ' + cls.BUTTON_ROUND_CLASS + ' ' + cls.ICON_DISABLE + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''),
                    iconCss: cls.ICON + ' ' + cls.ADD_ICON_CLASS, enableRtl: this.parent.enableRtl,
                    isPrimary: true
                }
            }];
            this.fieldListDialog = new Dialog({
                animationSettings: { effect: this.parent.enableRtl ? 'SlideRight' : 'SlideLeft' },
                header: headerTemplate,
                content: this.parentElement,
                isModal: true,
                showCloseIcon: false,
                visible: false,
                allowDragging: false,
                closeOnEscape: false,
                enableRtl: this.parent.enableRtl,
                locale: this.parent.locale,
                enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
                width: '100%',
                height: '100%',
                position: { X: 'center', Y: 'center' },
                buttons: buttons,
                target: document.body,
                cssClass: this.parent.cssClass,
                close: this.removeFieldListIcon.bind(this),
                open: this.dialogOpen.bind(this)
            });
            this.fieldListDialog.isStringTemplate = true;
            this.fieldListDialog.appendTo(fieldListWrappper);
            // this.fieldListDialog.element.querySelector('.e-dlg-header').innerHTML = headerTemplate;
            setStyleAttribute(select('#' + fieldListWrappper.id + '_dialog-content', fieldListWrappper) as HTMLElement, {
                'padding': '0'
            });
            const footer: Element = fieldListWrappper.querySelector('.' + cls.FOOTER_CONTENT_CLASS);
            addClass([footer], cls.FIELD_LIST_FOOTER_CLASS);
            removeClass([footer.querySelector('.' + cls.ADAPTIVE_CALCULATED_FIELD_BUTTON_CLASS) as Element], cls.BUTTON_FLAT_CLASS);
            removeClass([footer.querySelector('.' + cls.ADAPTIVE_FIELD_LIST_BUTTON_CLASS)], cls.BUTTON_FLAT_CLASS);
            (this.fieldListDialog.element.querySelector('.' + cls.BACK_ICON) as HTMLElement).onclick =
                this.parent.allowDeferLayoutUpdate ? this.onDeferUpdateClick.bind(this) : this.onCloseFieldList.bind(this);
        } else {
            const template: string = this.createDeferUpdateButtons().outerHTML;
            const headerTemplate: string = '<div class=' + cls.TITLE_HEADER_CLASS + '><div class=' +
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
                locale: this.parent.locale,
                enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
                width: this.parent.element.style.width,
                position: { X: 'center', Y: this.parent.element.offsetTop },
                footerTemplate: template,
                closeOnEscape: false,
                cssClass: this.parent.cssClass,
                target: !isNullOrUndefined(this.parent.target) ? ((typeof this.parent.target) === 'string') ?
                    <HTMLElement>document.querySelector(<string>this.parent.target) : <HTMLElement>this.parent.target : document.body,
                close: this.removeFieldListIcon.bind(this)
            });
            this.fieldListDialog.isStringTemplate = true;
            this.fieldListDialog.appendTo(fieldListWrappper);
            // this.fieldListDialog.element.querySelector('.e-dlg-header').innerHTML = headerTemplate;
            // this.fieldListDialog.element.querySelector('.e-footer-content').innerHTML = template;
            this.renderDeferUpdateButtons(fieldListWrappper);
            setStyleAttribute(select('#' + fieldListWrappper.id + '_title', fieldListWrappper) as HTMLElement, { 'width': '100%' });
            fieldListWrappper.querySelector('.' + cls.TITLE_HEADER_CLASS).appendChild(this.createCalculatedButton());
        }
    }

    private dialogOpen(): void {
        if (this.lastTabIndex === 4) {
            this.adaptiveElement.items[this.lastTabIndex].content = '';
            this.adaptiveElement.dataBind();
            this.parent.notify(events.initCalculatedField, {});
        } else {
            this.adaptiveElement.refresh();
        }
    }

    /**
     * Called internally if any of the field added to axis.
     *
     * @param {string[]} selectedNodes - selectedNodes
     * @returns {void}
     * @hidden
     */
    public updateDataSource(selectedNodes: string[]): void {
        const axis: string[] = ['filters', 'columns', 'rows', 'values'];
        for (const field of selectedNodes) {
            const fieldName: string = field;
            const droppedClass: string = axis[this.adaptiveElement.selectedItem];
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
        const layoutFooter: HTMLElement = createElement('div', {
            className: cls.FIELD_LIST_FOOTER_CLASS
        });
        fieldListWrappper.appendChild(this.parentElement);
        const items: TabItemModel[] = [
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
            enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
            locale: this.parent.locale,
            selected: this.tabSelect.bind(this),
            cssClass: this.parent.cssClass
        });
        if (this.parent.renderMode === 'Fixed') {
            layoutFooter.appendChild(this.createAddButton());
            addClass([fieldListWrappper], cls.STATIC_FIELD_LIST_CLASS);
            this.adaptiveElement.isStringTemplate = true;
            this.adaptiveElement.appendTo(this.parentElement);
            this.parentElement.appendChild(layoutFooter);
        } else {
            this.adaptiveElement.isStringTemplate = true;
            this.adaptiveElement.appendTo(this.parentElement);
        }
    }
    private tabSelect(e: SelectEventArgs): void {
        const fieldWrapper: HTMLElement = closest(this.parentElement, '.' + cls.WRAPPER_CLASS) as HTMLElement;
        this.lastTabIndex = e.selectedIndex;
        if (fieldWrapper && fieldWrapper.querySelector('.' + cls.ADAPTIVE_FIELD_LIST_BUTTON_CLASS)) {
            if (e.selectedIndex !== 4) {
                addClass(
                    [fieldWrapper.querySelector('.' + cls.ADAPTIVE_CALCULATED_FIELD_BUTTON_CLASS)],
                    cls.ICON_DISABLE);
                removeClass(
                    [fieldWrapper.querySelector('.' + cls.ADAPTIVE_FIELD_LIST_BUTTON_CLASS)],
                    cls.ICON_DISABLE);
            } else {
                removeClass(
                    [fieldWrapper.querySelector('.' + cls.ADAPTIVE_CALCULATED_FIELD_BUTTON_CLASS)],
                    cls.ICON_DISABLE);
                addClass(
                    [fieldWrapper.querySelector('.' + cls.ADAPTIVE_FIELD_LIST_BUTTON_CLASS)],
                    cls.ICON_DISABLE);
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
    private createCalculatedButton(): HTMLElement {
        const calculatedButton: HTMLElement = createElement('button', {
            id: this.parent.element.id + '_CalculatedField',
            attrs: {
                'type': 'button',
                'tabindex': '0',
                'aria-disabled': 'false',
                'aria-label': this.parent.localeObj.getConstant('CalculatedField')
            }
        });
        const calculateField: Button = new Button({
            cssClass: cls.CALCULATED_FIELD_CLASS + ' ' + cls.ICON_DISABLE + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''),
            content: this.parent.localeObj.getConstant('CalculatedField'),
            enableRtl: this.parent.enableRtl, locale: this.parent.locale, enableHtmlSanitizer: this.parent.enableHtmlSanitizer
        });
        calculateField.isStringTemplate = true;
        calculateField.appendTo(calculatedButton);
        if (this.parent.calculatedFieldModule) {
            removeClass([calculatedButton], cls.ICON_DISABLE);
        }
        calculateField.element.onclick = this.showCalculatedField.bind(this);
        return calculatedButton;
    }
    private createAddButton(): HTMLElement {
        const footerContainer: HTMLElement = createElement('div', {
            className: cls.FIELD_LIST_FOOTER_CLASS + '-content'
        });
        const fieldListButton: HTMLElement = createElement('div', {});
        const calculatedButton: HTMLElement = createElement('div', {});
        const calculateField: Button = new Button({
            cssClass: cls.ADAPTIVE_CALCULATED_FIELD_BUTTON_CLASS +
                ' ' + cls.BUTTON_SMALL_CLASS + ' ' + cls.BUTTON_ROUND_CLASS + ' ' + cls.ICON_DISABLE + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''),
            iconCss: cls.ICON + ' ' + cls.ADD_ICON_CLASS,
            enableRtl: this.parent.enableRtl, locale: this.parent.locale, enableHtmlSanitizer: this.parent.enableHtmlSanitizer
        });
        const fieldList: Button = new Button({
            cssClass: cls.ADAPTIVE_FIELD_LIST_BUTTON_CLASS + ' ' + cls.BUTTON_SMALL_CLASS + ' ' + cls.BUTTON_ROUND_CLASS + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''),
            iconCss: cls.ICON + ' ' + cls.ADD_ICON_CLASS,
            enableRtl: this.parent.enableRtl, locale: this.parent.locale, enableHtmlSanitizer: this.parent.enableHtmlSanitizer
        });
        fieldList.isStringTemplate = true;
        fieldList.appendTo(fieldListButton);
        calculateField.isStringTemplate = true;
        calculateField.appendTo(calculatedButton);
        footerContainer.appendChild(fieldListButton);
        footerContainer.appendChild(calculatedButton);
        calculateField.element.onclick = this.showCalculatedField.bind(this);
        fieldList.element.onclick = this.showFieldListDialog.bind(this);
        return footerContainer;
    }

    private createAxisTable(axis: string): HTMLElement {
        const axisWrapper: HTMLElement = createElement('div', {
            className: cls.FIELD_LIST_CLASS + '-' + axis
        });
        const axisContent: HTMLElement = createElement('div', { className: cls.AXIS_CONTENT_CLASS + ' ' + 'e-' + axis });
        const axisPrompt: HTMLElement = createElement('span', {
            className: cls.AXIS_PROMPT_CLASS
        });
        axisPrompt.innerText = this.parent.localeObj.getConstant('addPrompt');
        axisWrapper.appendChild(axisContent);
        axisWrapper.appendChild(axisPrompt);
        return axisWrapper;
    }

    private showCalculatedField(): void {
        try {
            if (!this.parent.isAdaptive) {
                this.parent.actionObj.actionName = events.openCalculatedField;
                if (this.parent.actionBeginMethod()) {
                    return;
                }
                if (this.parent.dialogRenderer.fieldListDialog) {
                    this.parent.dialogRenderer.fieldListDialog.hide();
                    addClass([this.parent.element.querySelector('.' + cls.TOGGLE_FIELD_LIST_CLASS)], cls.ICON_HIDDEN);
                }
            }
            this.parent.notify(events.initCalculatedField, {});
        } catch (execption) {
            this.parent.actionFailureMethod(execption);
        }
    }

    private showFieldListDialog(): void {
        const activeindex: number = this.adaptiveElement.selectedItem;
        this.parent.treeViewModule.render(activeindex);
    }

    /**  @hidden */

    public onShowFieldList(): void {
        this.parent.actionObj.actionName = events.showFieldList;
        if (this.parent.actionBeginMethod()) {
            return;
        }
        this.parent.actionObj.actionName = '';
        try {
            if (this.parent.allowDeferLayoutUpdate) {
                if (this.parent.isAdaptive) {
                    this.parent.axisFieldModule.render();
                }
                this.parent.clonedDataSource = PivotUtil.getClonedDataSourceSettings(this.parent.dataSourceSettings);
                if (this.parent.dataType === 'olap') {
                    this.parent.clonedFieldListData = PivotUtil.cloneOlapFieldSettings(this.parent.olapEngineModule.fieldListData);
                }
                this.parent.clonedFieldList = PivotUtil.getClonedFieldList(this.parent.pivotFieldList);
            }
            addClass([this.parent.element.querySelector('.' + cls.TOGGLE_FIELD_LIST_CLASS)], cls.ICON_HIDDEN);
            this.parent.dialogRenderer.fieldListDialog.show();
            this.parent.dialogRenderer.fieldListDialog.element.style.top =
                parseInt(this.parent.dialogRenderer.fieldListDialog.element.style.top, 10) < 0 ?
                    '0px' : this.parent.dialogRenderer.fieldListDialog.element.style.top;
        } catch (execption) {
            this.parent.actionFailureMethod(execption);
        }
    }

    private removeFieldListIcon(): void {
        if (this.parent.isAdaptive && this.parent.allowCalculatedField && this.parent.calculatedFieldModule) {
            if (this.adaptiveElement && this.adaptiveElement.selectedItem === 4) {
                if (select('#' + this.parent.element.id + 'droppable', this.adaptiveElement.element)) {
                    this.parent.calculatedFieldModule.updateAdaptiveCalculatedField(false);
                } else {
                    this.parent.notify(events.initCalculatedField, { edit: false });
                }
            }
        }
        if (!document.getElementById(this.parent.element.id + 'calculateddialog')) {
            removeClass([this.parent.element.querySelector('.' + cls.TOGGLE_FIELD_LIST_CLASS)], cls.ICON_HIDDEN);
        }
    }

    private keyPress(e: KeyboardEvent): void {
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

    /**
     * Destroys the Field Table component.
     *
     * @function destroy
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        if (this.parent.renderMode === 'Popup') {
            this.unWireDialogEvent(this.parent.element.querySelector('.' + cls.TOGGLE_FIELD_LIST_CLASS));
        }
        if (this.deferUpdateCheckBox && !this.deferUpdateCheckBox.isDestroyed) {
            this.deferUpdateCheckBox.destroy();
            this.deferUpdateCheckBox = null;
        }
        if (this.deferUpdateApplyButton && !this.deferUpdateApplyButton.isDestroyed) {
            this.deferUpdateApplyButton.destroy();
            this.deferUpdateApplyButton = null;
        }
        if (this.deferUpdateCancelButton && !this.deferUpdateCancelButton.isDestroyed) {
            this.deferUpdateCancelButton.destroy();
            this.deferUpdateCancelButton = null;
        }
        if (this.adaptiveElement && !this.adaptiveElement.isDestroyed) {
            this.adaptiveElement.destroy();
            this.adaptiveElement = null;
        }
        if (this.parent.renderMode === 'Popup') {
            if (this.fieldListDialog && !this.fieldListDialog.isDestroyed) {
                this.fieldListDialog.destroy();
                this.fieldListDialog = null;
            }
            if (document.getElementById(this.parent.element.id + '_Container')) {
                remove(document.getElementById(this.parent.element.id + '_Container'));
            }
        }
    }
}

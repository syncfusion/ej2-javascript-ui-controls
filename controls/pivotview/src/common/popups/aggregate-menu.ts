import { createElement, remove, extend, getInstance } from '@syncfusion/ej2-base';
import { MouseEventArgs } from '@syncfusion/ej2-base';
import { PivotView } from '../../pivotview/base/pivotview';
import { PivotFieldList } from '../../pivotfieldlist/base/field-list';
import * as cls from '../../common/base/css-constant';
import { MenuEventArgs, BeforeOpenCloseMenuEventArgs } from '@syncfusion/ej2-navigations';
import { OffsetPosition } from '@syncfusion/ej2-popups';
import { ContextMenu as Menu, MenuItemModel, ContextMenuModel } from '@syncfusion/ej2-navigations';
import { SummaryTypes } from '../../base/types';
import { IFieldOptions, IDataOptions } from '../../base/engine';
import { Dialog } from '@syncfusion/ej2-popups';
import { MaskedTextBox } from '@syncfusion/ej2-inputs';
import { DropDownList, ChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import * as events from '../../common/base/constant';

/**
 * `AggregateMenu` module to create aggregate type popup.
 */
/** @hidden */
export class AggregateMenu {
    public parent: PivotView | PivotFieldList;
    private menuInfo: Menu;
    private parentElement: HTMLElement;
    private currentMenu: Element;
    private valueDialog: Dialog;

    /**
     * Constructor for the rener action.
     * @hidden
     */
    constructor(parent?: PivotView | PivotFieldList) {
        this.parent = parent;
    }

    /**
     * Initialize the pivot table rendering
     * @returns void
     * @private
     */
    public render(args: MouseEventArgs, parentElement: HTMLElement): void {
        this.parentElement = parentElement;
        this.openContextMenu(args);
    }
    private openContextMenu(args: MouseEventArgs): void {
        if (this.menuInfo === undefined) {
            this.createContextMenu();
        }
        this.currentMenu = args.currentTarget as Element;
        let pos: OffsetPosition = this.currentMenu.getBoundingClientRect();
        if (this.parent.enableRtl) {
            this.menuInfo.open(pos.top, pos.left - 105);
        } else {
            this.menuInfo.open(pos.top, pos.left);
        }
    }
    private createContextMenu(): void {
        let menuItems: MenuItemModel[] = [
            { text: 'Sum', id: 'Sum' },
            { text: 'Count', id: 'Count' },
            { text: 'Distinct Count', id: 'DistinctCount' },
            { text: 'Product', id: 'Product' },
            { text: 'Avg', id: 'Avg' },
            { text: 'Min', id: 'Min' },
            { text: 'Max', id: 'Max' },
            { text: 'More...', id: 'MoreOption' }];
        let menuOptions: ContextMenuModel = {
            items: menuItems,
            enableRtl: this.parent.enableRtl,
            beforeOpen: this.beforeMenuOpen.bind(this),
            select: this.selectOptionInContextMenu.bind(this)
        };
        let removeContextMenu: HTMLElement = document.getElementById(this.parent.element.id + 'valueFieldContextMenu');
        if (removeContextMenu !== null) {
            removeContextMenu.innerHTML = '';
        }
        let contextMenu: HTMLElement = createElement('ul', {
            id: this.parent.element.id + 'valueFieldContextMenu'
        });
        this.parent.element.appendChild(contextMenu);
        this.menuInfo = new Menu(menuOptions);
        this.menuInfo.isStringTemplate = true;
        this.menuInfo.appendTo(contextMenu);
    }
    private beforeMenuOpen(args: BeforeOpenCloseMenuEventArgs): void {
        args.element.style.zIndex = (this.menuInfo.element.style.zIndex + 3).toString();
        args.element.style.display = 'inline';
    }
    /** @hidden */
    public createValueSettingsDialog(target: HTMLElement, parentElement: HTMLElement): void {
        this.parentElement = parentElement;
        let valueDialog: HTMLElement = createElement('div', {
            id: this.parentElement.id + '_ValueDialog',
            className: 'e-value-field-settings',
            attrs: { 'data-field': target.id }
        });
        this.parentElement.appendChild(valueDialog);
        this.valueDialog = new Dialog({
            animationSettings: { effect: 'Fade' },
            allowDragging: true,
            header: this.parent.localeObj.getConstant('valueFieldSettings'),
            content: this.createFieldOptions(target),
            isModal: true,
            visible: true,
            showCloseIcon: true,
            enableRtl: this.parent.enableRtl,
            width: 'auto',
            height: 'auto',
            position: { X: 'center', Y: 'center' },
            buttons: [
                {
                    click: this.updateValueSettings.bind(this),
                    buttonModel: { cssClass: cls.OK_BUTTON_CLASS, content: this.parent.localeObj.getConstant('ok'), isPrimary: true }
                },
                {
                    click: () => { this.valueDialog.hide(); },
                    buttonModel: { cssClass: cls.CANCEL_BUTTON_CLASS, content: this.parent.localeObj.getConstant('cancel') }
                }
            ],
            closeOnEscape: true,
            target: this.parentElement,
            overlayClick: () => { this.removeDialog(); },
            close: this.removeDialog.bind(this)
        });
        this.valueDialog.isStringTemplate = true;
        this.valueDialog.appendTo(valueDialog);
        this.valueDialog.element.querySelector('.e-dlg-header').innerHTML = this.parent.localeObj.getConstant('valueFieldSettings');
    }
    /* tslint:disable:all */
    private createFieldOptions(buttonElement: HTMLElement): HTMLElement {
        let fieldCaption: string = buttonElement.getAttribute('data-caption');
        let summaryType: string = buttonElement.getAttribute('data-type');
        let baseField: string = buttonElement.getAttribute('data-basefield');
        let baseItem: string = buttonElement.getAttribute('data-baseitem');
        summaryType = (summaryType.toString() !== 'undefined' ? summaryType : 'Sum');
        let summaryDataSource: { [key: string]: Object }[] = [
            { value: 'Sum', text: 'Sum' },
            { value: 'Count', text: 'Count' },
            { value: 'DistinctCount', text: 'Distinct Count' },
            { value: 'Product', text: 'Product' },
            { value: 'Avg', text: 'Avg' },
            { value: 'Min', text: 'Min' },
            { value: 'Max', text: 'Max' },
            { value: 'Index', text: 'Index' },
            { value: 'SampleStDev', text: 'Sample StDev' },
            { value: 'PopulationStDev', text: 'Population StDev' },
            { value: 'SampleVar', text: 'Sample Var' },
            { value: 'PopulationVar', text: 'Population Var' },
            { value: 'RunningTotals', text: 'Running Totals' },
            { value: 'DifferenceFrom', text: 'Difference From' },
            { value: 'PercentageOfDifferenceFrom', text: '% of Difference From' },
            { value: 'PercentageOfGrandTotal', text: '% of Grand Total' },
            { value: 'PercentageOfColumnTotal', text: '% of Column Total' },
            { value: 'PercentageOfRowTotal', text: '% of Row Total' },
            { value: 'PercentageOfParentTotal', text: '% of Parent Total' },
            { value: 'PercentageOfParentColumnTotal', text: '% of Parent Column Total' },
            { value: 'PercentageOfParentRowTotal', text: '% of Parent Row Total' },
        ];
        let baseItemTypes: string[] = ['DifferenceFrom', 'PercentageOfDifferenceFrom'];
        let baseFieldTypes: string[] = ['DifferenceFrom', 'PercentageOfDifferenceFrom', 'PercentageOfParentTotal'];
        let dataFields: IFieldOptions[] = extend([], this.parent.dataSourceSettings.rows, null, true) as IFieldOptions[];
        dataFields = dataFields.concat(this.parent.dataSourceSettings.columns);
        let fieldDataSource: { [key: string]: Object }[] = [];
        let fieldItemDataSource: string[] = [];
        // let summaryDataSource: { [key: string]: Object }[] = [];
        // for (let type of summaryTypes) {
        //     summaryDataSource.push({ value: type, text: type });
        // }
        for (let field of dataFields) {
            let value: string = field.name;
            let text: string = (field.caption ? field.caption : field.name);
            fieldDataSource.push({ value: value, text: text });
        }
        baseField = (baseField.toString() !== 'undefined' ? baseField : fieldDataSource[0].value as string);
        fieldItemDataSource = Object.keys(this.parent.engineModule.fieldList[(baseField.toString() !== 'undefined' ?
            baseField : fieldDataSource[0].value as string)].formattedMembers);
        baseItem = (baseItem.toString() !== 'undefined' ? baseItem : fieldItemDataSource[0]);
        let mainDiv: HTMLElement = createElement('div', {
            className: 'e-value-field-div-content', id: this.parentElement.id + '_field_div_content',
            attrs: { 'data-type': summaryType, 'data-caption': fieldCaption, 'data-basefield': baseField, 'data-baseitem': baseItem }
        });
        let textWrappper: HTMLElement = createElement('div', { className: 'e-field-name-text-wrapper', });
        let filterWrapperDiv1: HTMLElement = createElement('div', { className: 'e-field-option-wrapper' });
        let optionWrapperDiv1: HTMLElement = createElement('div', { className: 'e-type-option-wrapper' });
        let optionWrapperDiv2: HTMLElement = createElement('div', { className: 'e-base-field-option-wrapper' });
        let optionWrapperDiv3: HTMLElement = createElement('div', { className: 'e-base-item-option-wrapper' });
        let texttitle: HTMLElement = createElement('div', { className: 'e-field-name-title', innerHTML: this.parent.localeObj.getConstant('sourceName') + '&nbsp;' });
        let textContent: HTMLElement = createElement('div', { className: 'e-field-name-content', innerHTML: buttonElement.id.toString() });
        let inputTextDiv1: HTMLElement = createElement('div', {
            className: 'e-type-option-text', innerHTML: this.parent.localeObj.getConstant('sourceCaption')
        });
        let optionTextDiv1: HTMLElement = createElement('div', {
            className: 'e-base-field-option-text', innerHTML: this.parent.localeObj.getConstant('summarizeValuesBy')
        });
        let optionTextDiv2: HTMLElement = createElement('div', {
            className: 'e-base-item-option-text', innerHTML: this.parent.localeObj.getConstant('baseField')
        });
        let optionTextDiv3: HTMLElement = createElement('div', {
            className: 'e-type-option-text', innerHTML: this.parent.localeObj.getConstant('baseItem')
        });
        let inputDiv1: HTMLElement = createElement('div', { className: 'e-caption-input-wrapper' });
        let dropOptionDiv1: HTMLElement = createElement('div', { id: this.parentElement.id + '_type_option' });
        let dropOptionDiv2: HTMLElement = createElement('div', { id: this.parentElement.id + '_base_field_option' });
        let dropOptionDiv3: HTMLElement = createElement('div', { id: this.parentElement.id + '_base_item_option' });
        let inputField1: HTMLInputElement = createElement('input', {
            id: this.parentElement.id + 'type_input_option',
            className: 'e-caption-input-text',
            attrs: { 'type': 'text' }
        }) as HTMLInputElement;
        textWrappper.appendChild(texttitle);
        textWrappper.appendChild(textContent);
        inputDiv1.appendChild(inputTextDiv1);
        inputDiv1.appendChild(inputField1);
        optionWrapperDiv1.appendChild(optionTextDiv1);
        optionWrapperDiv2.appendChild(optionTextDiv2);
        optionWrapperDiv3.appendChild(optionTextDiv3);
        optionWrapperDiv1.appendChild(dropOptionDiv1);
        optionWrapperDiv2.appendChild(dropOptionDiv2);
        optionWrapperDiv3.appendChild(dropOptionDiv3);
        filterWrapperDiv1.appendChild(textWrappper);
        filterWrapperDiv1.appendChild(inputDiv1);
        filterWrapperDiv1.appendChild(optionWrapperDiv1);
        filterWrapperDiv1.appendChild(optionWrapperDiv2);
        filterWrapperDiv1.appendChild(optionWrapperDiv3);
        mainDiv.appendChild(filterWrapperDiv1);
        let popupInstance: AggregateMenu = this;
        let optionWrapper1: DropDownList = new DropDownList({
            dataSource: summaryDataSource,
            fields: { value: 'value', text: 'text' },
            value: summaryType,
            // popupWidth: 'auto',
            cssClass: cls.VALUE_OPTIONS_CLASS, width: '100%',
            change(args: ChangeEventArgs): void {
                optionWrapper2.enabled = baseFieldTypes.indexOf(args.value as string) !== -1 ? true : false;
                optionWrapper3.enabled = baseItemTypes.indexOf(args.value as string) !== -1 ? true : false;
                if (optionWrapper3.enabled && (optionWrapper3.dataSource as string[]).length === 1) {
                    optionWrapper3.dataSource = fieldItemDataSource;
                    optionWrapper3.dataBind();
                }
            }
        });
        optionWrapper1.isStringTemplate = true;
        optionWrapper1.appendTo(dropOptionDiv1);
        let optionWrapper2: DropDownList = new DropDownList({
            dataSource: fieldDataSource, enableRtl: this.parent.enableRtl,
            fields: { value: 'value', text: 'text' },
            value: baseField,
            // popupWidth: 'auto',
            enabled: (baseFieldTypes.indexOf(summaryType) !== -1 ? true : false),
            cssClass: cls.VALUE_OPTIONS_CLASS, width: '100%',
            change(args: ChangeEventArgs): void {
                fieldItemDataSource = Object.keys(popupInstance.parent.engineModule.fieldList[args.value as string].formattedMembers);
                optionWrapper3.dataSource = fieldItemDataSource;
                optionWrapper3.value = fieldItemDataSource[0];
                optionWrapper3.filterBarPlaceholder = popupInstance.parent.localeObj.getConstant('example') + ' ' + fieldItemDataSource[0];
                optionWrapper3.dataBind();
            }
        });
        optionWrapper2.isStringTemplate = true;
        optionWrapper2.appendTo(dropOptionDiv2);
        let optionWrapper3: DropDownList = new DropDownList({
            dataSource: [fieldItemDataSource[0]], enableRtl: this.parent.enableRtl,
            value: baseItem,
            // popupWidth: 'auto',
            allowFiltering: true,
            filterBarPlaceholder: this.parent.localeObj.getConstant('example') + ' ' + fieldItemDataSource[0],
            enabled: (baseItemTypes.indexOf(summaryType) !== -1 ? true : false),
            cssClass: cls.FILTER_OPERATOR_CLASS, width: '100%',
        });
        optionWrapper3.isStringTemplate = true;
        optionWrapper3.appendTo(dropOptionDiv3);

        let inputObj1: MaskedTextBox = new MaskedTextBox({
            placeholder: 'Enter field caption',
            // floatLabelType: 'Auto',
            enableRtl: this.parent.enableRtl,
            value: fieldCaption, width: '100%'
        });
        inputObj1.isStringTemplate = true;
        inputObj1.appendTo(inputField1);
        return mainDiv;
    }
    /* tslint:enable:all */
    private selectOptionInContextMenu(menu: MenuEventArgs): void {
        if (menu.item.text !== null) {
            let buttonElement: HTMLElement = this.currentMenu.parentElement as HTMLElement;
            if (menu.item.id === 'MoreOption') {
                this.createValueSettingsDialog(buttonElement, this.parentElement);
            } else {
                let field: string = buttonElement.getAttribute('data-uid');
                let valuefields: IFieldOptions[] = this.parent.dataSourceSettings.values;
                let contentElement: HTMLElement = buttonElement.querySelector('.e-content') as HTMLElement;
                let captionName: string = menu.item.text + ' ' + 'of' + ' ' + this.parent.engineModule.fieldList[field].caption;
                contentElement.innerHTML = captionName;
                contentElement.setAttribute('title', captionName);
                buttonElement.setAttribute('data-type', menu.item.id as string);
                for (let vCnt: number = 0; vCnt < this.parent.dataSourceSettings.values.length; vCnt++) {
                    if (this.parent.dataSourceSettings.values[vCnt].name === field) {
                        let dataSourceItem: IFieldOptions = (<{ [key: string]: IFieldOptions }>valuefields[vCnt]).properties ?
                            (<{ [key: string]: IFieldOptions }>valuefields[vCnt]).properties : valuefields[vCnt];
                        dataSourceItem.type = menu.item.id as SummaryTypes;
                        this.parent.lastAggregationInfo = dataSourceItem;
                        /* tslint:disable-next-line:no-any */

                    }
                }
                this.updateDataSource();
            }
        }
    }
    private updateDataSource(isRefreshed?: boolean): void {
        if (!this.parent.allowDeferLayoutUpdate || this.parent.getModuleName() === 'pivotview') {
            this.parent.updateDataSource(isRefreshed);
        } else {
            if (this.parent.getModuleName() === 'pivotfieldlist' && (this.parent as PivotFieldList).renderMode === 'Popup') {
                /* tslint:disable:align */
                (this.parent as PivotFieldList).pivotGridModule.setProperties({
                    dataSourceSettings: (<{ [key: string]: Object }>this.parent.dataSourceSettings).properties as IDataOptions
                }, true);
                (this.parent as PivotFieldList).pivotGridModule.notify(events.uiUpdate, this);
                (this.parent as PivotFieldList).pivotGridModule.engineModule = (this.parent as PivotFieldList).engineModule;
            } else {
                (this.parent as PivotFieldList).triggerPopulateEvent();
            }
        }
    }
    private updateValueSettings(): void {
        let dialogElement: HTMLElement = this.valueDialog.element;
        let captionInstance: MaskedTextBox = getInstance('#' + this.parentElement.id + 'type_input_option', MaskedTextBox) as MaskedTextBox;
        let summaryInstance: DropDownList = getInstance('#' + this.parentElement.id + '_type_option', DropDownList) as DropDownList;
        let baseFieldInstance: DropDownList = getInstance('#' + this.parentElement.id + '_base_field_option', DropDownList) as DropDownList;
        let baseItemInstance: DropDownList = getInstance('#' + this.parentElement.id + '_base_item_option', DropDownList) as DropDownList;
        let fieldName: string = dialogElement.getAttribute('data-field');
        let buttonElement: HTMLElement;
        if (this.parentElement.querySelector('.' + cls.PIVOT_BUTTON_CLASS)) {
            buttonElement = this.parentElement.
                querySelector('.' + cls.PIVOT_BUTTON_CLASS + '.' + fieldName.replace(/[^A-Z0-9]/ig, '')) as HTMLElement;
        }
        if (buttonElement) {
            let contentElement: HTMLElement = buttonElement.querySelector('.e-content') as HTMLElement;
            let captionName: string =
                this.parent.localeObj.getConstant(summaryInstance.value as string) + ' ' + 'of' + ' ' + captionInstance.value;
            contentElement.innerHTML = captionName;
            contentElement.setAttribute('title', captionName);
            buttonElement.setAttribute('data-type', summaryInstance.value as string);
            buttonElement.setAttribute('data-caption', captionInstance.value);
            buttonElement.setAttribute('data-basefield', baseFieldInstance.value as string);
            buttonElement.setAttribute('data-baseitem', baseItemInstance.value as string);
        }
        let selectedField: IFieldOptions =
            this.parent.pivotCommon.eventBase.getFieldByName(fieldName, this.parent.dataSourceSettings.values);
        selectedField = (<{ [key: string]: Object }>selectedField).properties ?
            (<{ [key: string]: Object }>selectedField).properties : selectedField;
        selectedField.caption = captionInstance.value;
        selectedField.type = summaryInstance.value as SummaryTypes;
        selectedField.baseField = baseFieldInstance.value as string;
        selectedField.baseItem = baseItemInstance.value as string;
        this.valueDialog.close();
        // this.parent.axisFieldModule.render();
        this.parent.lastAggregationInfo = selectedField;
        this.updateDataSource(true);
    }
    private removeDialog(): void {
        if (this.valueDialog && !this.valueDialog.isDestroyed) { this.valueDialog.destroy(); }
        if (document.getElementById(this.parentElement.id + '_ValueDialog')) {
            remove(document.getElementById(this.parentElement.id + '_ValueDialog'));
        }
    }

    /**
     * To destroy the pivot button event listener
     * @return {void}
     * @hidden
     */
    public destroy(): void {
        if (this.parent.isDestroyed) { return; }
        if (this.menuInfo && !this.menuInfo.isDestroyed) {
            this.menuInfo.destroy();
        } else {
            return;
        }
    }
}
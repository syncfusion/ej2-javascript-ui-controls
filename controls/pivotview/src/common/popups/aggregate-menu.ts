import { createElement, remove, extend, getInstance, select, isNullOrUndefined } from '@syncfusion/ej2-base';
import { MouseEventArgs, SanitizeHtmlHelper } from '@syncfusion/ej2-base';
import { PivotView } from '../../pivotview/base/pivotview';
import { PivotFieldList } from '../../pivotfieldlist/base/field-list';
import * as cls from '../../common/base/css-constant';
import { MenuEventArgs, BeforeOpenCloseMenuEventArgs } from '@syncfusion/ej2-navigations';
import { OffsetPosition } from '@syncfusion/ej2-popups';
import { ContextMenu as Menu, MenuItemModel, ContextMenuModel } from '@syncfusion/ej2-navigations';
import { SummaryTypes } from '../../base/types';
import { IFieldOptions, IDataOptions, FieldItemInfo, IAxisSet, PivotEngine, IField } from '../../base/engine';
import { Dialog } from '@syncfusion/ej2-popups';
import { MaskedTextBox } from '@syncfusion/ej2-inputs';
import { DropDownList, ChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { ADJACENT_PREVIOUS, ADJACENT_NEXT, isAdjacentToken } from '../../base/adjacent-difference';
import * as events from '../../common/base/constant';
import { PivotUtil } from '../../base/util';
import { AggregateTypes } from '../base/enum';
import { AggregateMenuOpenEventArgs } from '../base/interface';

/**
 * `AggregateMenu` module to create aggregate type popup.
 */
/** @hidden */
export class AggregateMenu {
    /** @hidden */
    public parent: PivotView | PivotFieldList;
    /** @hidden */
    public stringAggregateTypes: AggregateTypes[] = ['Count', 'DistinctCount'];
    /** @hidden */
    public dateAggregateTypes: AggregateTypes[] = ['Min', 'Max', 'Count', 'DistinctCount'];
    private menuInfo: Menu[] = [];
    private parentElement: HTMLElement;
    private buttonElement: HTMLElement;
    private currentMenu: Element;
    private activeInstanceId: string = '';

    /**
     * Constructor for the rener action.
     *
     * @param {PivotView | PivotFieldList} parent - It contains the value of parent.
     * @hidden
     */
    constructor(parent?: PivotView | PivotFieldList) {
        this.parent = parent;
    }

    /**
     * Initialize the pivot table rendering
     *
     * @param {MouseEventArgs} args - It contains the args value
     * @param {HTMLElement} parentElement - It contains the value of parentElement
     * @returns {void}
     * @private
     */
    public render(args: MouseEventArgs, parentElement: HTMLElement): void {
        this.parentElement = parentElement;
        this.openContextMenu(args);
    }
    private openContextMenu(args: MouseEventArgs): void {
        const selectedButton: HTMLElement = (args.target as HTMLElement).closest('.' + cls.PIVOT_BUTTON_CLASS) as HTMLElement;
        const fieldName: string = selectedButton.getAttribute('data-uid');
        const fieldInfo: FieldItemInfo = PivotUtil.getFieldInfo(fieldName, this.parent);
        this.buttonElement = selectedButton;
        this.activeInstanceId = selectedButton.getAttribute('data-instance-id') || '';
        const fieldType: string = this.parent.engineModule.fieldList[fieldName as string].type;
        // 0: numeric field (full summary list), 1: string/other non-date field
        // (Count/DistinctCount), 2: date-typed field (Min/Max/Count/DistinctCount,
        // PIVOT-MINMAX-003/008).
        const isStringField: number = fieldType !== 'number' ? (fieldType === 'date' || fieldType === 'datetime' ? 2 : 1) : 0;
        let summaryTypes: AggregateTypes[] = [...this.getMenuItem(isStringField)];
        const eventArgs: AggregateMenuOpenEventArgs = {
            cancel: false, fieldName: fieldName, aggregateTypes: summaryTypes, displayMenuCount: 7
        };
        const control: PivotView | PivotFieldList =
            this.parent.getModuleName() === 'pivotfieldlist' && (this.parent as PivotFieldList).isPopupView ?
                (this.parent as PivotFieldList).pivotGridModule : this.parent;
        try {
            control.trigger(events.aggregateMenuOpen, eventArgs, (observedArgs: AggregateMenuOpenEventArgs) => {
                if (!observedArgs.cancel) {
                    summaryTypes = observedArgs.aggregateTypes;
                    this.createContextMenu(isStringField, summaryTypes, observedArgs.displayMenuCount);
                    this.currentMenu = args.target as Element;
                    const pos: OffsetPosition = this.currentMenu.getBoundingClientRect();
                    if (this.parent.enableRtl) {
                        this.menuInfo[isStringField as number].open(
                            pos.top + (window.scrollY || document.documentElement.scrollTop), pos.left - 105);
                    } else {
                        this.menuInfo[isStringField as number].open(pos.top +
                            (window.scrollY || document.documentElement.scrollTop), pos.left);
                    }
                }
            });
        } catch (execption) {
            this.parent.actionFailureMethod(execption);
        }
    }

    private createContextMenu(isStringField: number, summaryTypes: AggregateTypes[], displayMenuCount?: number): void {
        const menuItems: MenuItemModel[][] = [];
        menuItems[isStringField  as number] = [];
        if (this.menuInfo[isStringField as number] && !this.menuInfo[isStringField as number].isDestroyed) {
            this.menuInfo[isStringField as number].destroy();
        }
        const checkDuplicates: AggregateTypes[] = [];
        const allowedTypes: AggregateTypes[] = isStringField === 2 ? this.dateAggregateTypes :
            (isStringField ? this.stringAggregateTypes : this.parent.getAllSummaryType());
        for (let i: number = 0; i < summaryTypes.length; i++) {
            const key: AggregateTypes = summaryTypes[i as number] as AggregateTypes;
            if (isStringField) {
                if ((allowedTypes.indexOf(key) > -1) && (checkDuplicates.indexOf(key) < 0)) {
                    menuItems[isStringField as number].push(
                        { text: this.parent.localeObj.getConstant(key), id: this.parent.element.id + 'StringMenu_' + key });
                    checkDuplicates.push(key);
                }
            } else {
                if ((this.parent.getAllSummaryType().indexOf(key) > -1) && (checkDuplicates.indexOf(key) < 0)) {
                    menuItems[isStringField as number].push({ text: this.parent.localeObj.getConstant(key), id: this.parent.element.id + '_' + key });
                    checkDuplicates.push(key);
                }
            }
        }
        if (menuItems[isStringField as number].length > displayMenuCount) {
            menuItems[isStringField as number].splice(displayMenuCount);
            menuItems[isStringField as number].push(
                {
                    text: this.parent.localeObj.getConstant('MoreOption'),
                    id: this.parent.element.id + '_' + 'MoreOption'
                });
        }
        const menuOptions: ContextMenuModel = {
            items: menuItems[isStringField as number],
            enableRtl: this.parent.enableRtl,
            locale: this.parent.locale,
            cssClass: this.parent.cssClass,
            beforeOpen: this.beforeMenuOpen.bind(this, isStringField),
            onClose: () => {
                this.focusValueButton(this.activeInstanceId);
            },
            select: this.selectOptionInContextMenu.bind(this)
        };
        let contextMenu: HTMLElement =
            document.getElementById(this.parent.element.id + (isStringField ? 'valueFieldStringContextMenu' : 'valueFieldContextMenu'));
        if (contextMenu !== null) {
            contextMenu.innerHTML = '';
        } else {
            contextMenu = createElement('ul', {
                id: this.parent.element.id + (isStringField ? 'valueFieldStringContextMenu' : 'valueFieldContextMenu')
            });
        }
        this.parent.element.appendChild(contextMenu);
        this.menuInfo[isStringField as number] = new Menu(menuOptions);
        this.menuInfo[isStringField as number].isStringTemplate = true;
        this.menuInfo[isStringField as number].isAngular = this.parent.isModalDialog;
        this.menuInfo[isStringField as number].appendTo(contextMenu);
    }
    private getMenuItem(isStringField: number): AggregateTypes[] {
        const menuItems: AggregateTypes[] = [];
        for (let i: number = 0; i < this.parent.aggregateTypes.length; i++) {
            const key: AggregateTypes = this.parent.aggregateTypes[i as number] as AggregateTypes;
            if (this.parent.dataSourceSettings.mode === 'Server' && key === 'PercentageOfRunningTotals') {
                continue;
            }
            if (isStringField === 2) {
                if ((this.dateAggregateTypes.indexOf(key) > -1) && (menuItems.indexOf(key) === -1)) {
                    menuItems.push(key);
                }
            } else if (isStringField) {
                if ((this.stringAggregateTypes.indexOf(key) > -1) && (menuItems.indexOf(key) === -1)) {
                    menuItems.push(key);
                }
            } else {
                if ((this.parent.getAllSummaryType().indexOf(key) > -1) && (menuItems.indexOf(key) === -1)) {
                    menuItems.push(key);
                }
            }
        }
        return menuItems;
    }
    private beforeMenuOpen(isString: number, args: BeforeOpenCloseMenuEventArgs): void {
        if (PivotUtil.invokeActionMethod(this.parent, events.actionBegin, events.aggregateContextMenuOpen)) {
            args.cancel = true;
            return;
        }
        args.element.style.zIndex = (this.menuInfo[isString as number].element.style.zIndex + 3).toString();
        args.element.style.display = 'inline';
    }
    /**
     * create Value Settings Dialog
     *
     * @param {HTMLElement} target - It represent the target element.
     * @param {HTMLElement} parentElement - It represent the parentElement.
     * @param {string} type -It represent the type.
     * @returns {void}
     * @hidden */
    public createValueSettingsDialog(target: HTMLElement, parentElement: HTMLElement, type?: string): void {
        if (PivotUtil.invokeActionMethod(this.parent, events.actionBegin, events.openValueSettingsDialog)) {
            return;
        }
        this.parentElement = parentElement;
        const valueDialogElement: HTMLElement = createElement('div', {
            id: this.parentElement.id + '_ValueDialog',
            className: 'e-value-field-settings',
            attrs: { 'data-field': target.getAttribute('data-uid') ? target.getAttribute('data-uid') : target.getAttribute('data-field') }
        });
        this.parentElement.appendChild(valueDialogElement);
        const valueDialog: Dialog = new Dialog({
            animationSettings: { effect: 'Fade' },
            allowDragging: true,
            header: this.parent.localeObj.getConstant('valueFieldSettings'),
            content: this.createFieldOptions(target, type),
            isModal: true,
            visible: true,
            showCloseIcon: true,
            enableRtl: this.parent.enableRtl,
            locale: this.parent.locale,
            enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
            width: '320px',
            height: 'auto',
            position: { X: 'center', Y: 'center' },
            buttons: [
                {
                    click: this.updateValueSettings.bind(this),
                    isFlat: false,
                    buttonModel: { cssClass: cls.OK_BUTTON_CLASS + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''), content: this.parent.localeObj.getConstant('ok'), isPrimary: true }
                },
                {
                    click: () => {
                        PivotUtil.invokeActionMethod(this.parent, events.actionComplete, events.valueSettingsDialogClosed, {});
                        valueDialog.hide();
                    },
                    isFlat: false,
                    buttonModel: { cssClass: cls.CANCEL_BUTTON_CLASS + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''), content: this.parent.localeObj.getConstant('cancel') }
                }
            ],
            closeOnEscape: (this.parent.getModuleName() === 'pivotfieldlist' && (this.parent as PivotFieldList).renderMode === 'Popup') ? false : true,
            target: this.parentElement,
            close: this.removeDialog.bind(this),
            cssClass: this.parent.cssClass
        });
        valueDialog.isStringTemplate = true;
        valueDialog.isAngular = this.parent.isModalDialog;
        valueDialog.appendTo(valueDialogElement);
        // this.valueDialog.element.querySelector('.e-dlg-header').innerText = this.parent.localeObj.getConstant('valueFieldSettings');
    }
    private createFieldOptions(buttonElement: HTMLElement, type?: string): HTMLElement {
        const fieldCaption: string = buttonElement.getAttribute('data-caption');
        let summaryType: string = (type && type !== 'MoreOption') ? type : buttonElement.getAttribute('data-type');
        let baseField: string = buttonElement.getAttribute('data-basefield');
        let baseItem: string = buttonElement.getAttribute('data-baseitem');
        const allowCrossGroup: boolean = buttonElement.getAttribute('data-allowcrossgroup') === 'true';
        summaryType = (summaryType.toString() !== 'undefined' ? summaryType : 'Sum');
        const summaryDataSource: { [key: string]: Object }[] = [];
        const summaryItems: AggregateTypes[] = this.parent.aggregateTypes;
        const checkDuplicates: AggregateTypes[] = [];
        // A date-typed value field offers only Min, Max, Count and DistinctCount
        // in the Value Settings dialog too (PIVOT-MINMAX-008).
        const fieldType: string = this.parent.engineModule.fieldList[fieldCaption as string] ?
            this.parent.engineModule.fieldList[fieldCaption as string].type : undefined;
        const dialogAllowed: AggregateTypes[] = (fieldType === 'date' || fieldType === 'datetime') ?
            this.dateAggregateTypes : this.parent.getAllSummaryType();
        for (let i: number = 0; i < summaryItems.length; i++) {
            const summaryType: AggregateTypes = summaryItems[i as number] as AggregateTypes;
            if (this.parent.dataSourceSettings.mode === 'Server' && summaryType === 'PercentageOfRunningTotals') {
                continue;
            }
            if (dialogAllowed.indexOf(summaryType) > -1 && checkDuplicates.indexOf(summaryType) < 0) {
                summaryDataSource.push({
                    value: summaryType,
                    text: this.parent.localeObj.getConstant(summaryType) });
                checkDuplicates.push(summaryType);
            }
        }
        const baseItemTypes: string[] = ['DifferenceFrom', 'PercentageOfDifferenceFrom'];
        const baseFieldTypes: string[] = ['DifferenceFrom', 'PercentageOfDifferenceFrom', 'PercentageOfParentTotal'];
        let dataFields: IFieldOptions[] = extend([], this.parent.dataSourceSettings.rows, null, true) as IFieldOptions[];
        dataFields = dataFields.concat(this.parent.dataSourceSettings.columns);
        const fieldDataSource: { [key: string]: Object }[] = [];
        let fieldItemDataSource: string[] = [];
        // let summaryDataSource: { [key: string]: Object }[] = [];
        // for (let type of summaryTypes) {
        //     summaryDataSource.push({ value: type, text: type });
        // }
        for (const field of dataFields) {
            const value: string = field.name;
            const text: string = (field.caption ? field.caption : field.name);
            fieldDataSource.push({ value: value, text: text });
        }
        if (Object.keys(fieldDataSource).length === 0) {
            fieldDataSource.push({ value: '', text: '' });
            baseField = '';
            fieldItemDataSource = [];
        }
        else {
            baseField = (baseField && (baseField.toString() !== 'undefined' && baseField.toString() !== 'null') ? baseField : fieldDataSource[0].value as string);
            const fieldName: string = baseField.toString() !== 'undefined' ? baseField : fieldDataSource[0].value as string;
            const isDateField: boolean = PivotUtil.isDateField(fieldName as string, this.parent.engineModule as PivotEngine);
            fieldItemDataSource = (this.parent.engineModule.fieldList[fieldName as string].dateMember).map((item: IAxisSet) =>
                isDateField ? item.formattedText :
                    this.parent.engineModule.getFormattedValue(item.actualText, fieldName).formattedText
            );
        }
        baseItem = (baseItem.toString() !== 'undefined' ? baseItem : fieldItemDataSource[0]);
        const getBaseItemDataSource: (members: string[]) => { value: string; text: string }[] = (members: string[]) => {
            return [
                { value: ADJACENT_PREVIOUS, text: this.parent.localeObj.getConstant('previousItem') },
                { value: ADJACENT_NEXT, text: this.parent.localeObj.getConstant('nextItem') }
            ].concat(members.map((member: string) => ({ value: member, text: member })));
        };
        const mainDiv: HTMLElement = createElement('div', {
            className: 'e-value-field-div-content', id: this.parentElement.id + '_field_div_content',
            attrs: { 'data-type': summaryType, 'data-caption': fieldCaption, 'data-basefield': baseField, 'data-baseitem': baseItem }
        });
        const textWrappper: HTMLElement = createElement('div', { className: 'e-field-name-text-container' });
        const filterWrapperDiv1: HTMLElement = createElement('div', { className: 'e-field-option-container' });
        const optionWrapperDiv1: HTMLElement = createElement('div', { className: 'e-type-option-container' });
        const optionWrapperDiv2: HTMLElement = createElement('div', { className: 'e-base-field-option-container' });
        const optionWrapperDiv3: HTMLElement = createElement('div', { className: 'e-base-item-option-container' });
        const optionWrapperDiv4: HTMLElement = createElement('div', { className: 'e-cross-group-option-container' });
        const texttitle: HTMLElement = createElement('div', { className: 'e-field-name-title' });
        texttitle.innerHTML = this.parent.localeObj.getConstant('sourceName') + '&nbsp;';
        const textContent: HTMLElement = createElement('div', { className: 'e-field-name-content' });
        textContent.innerText = this.parent.enableHtmlSanitizer ? SanitizeHtmlHelper.sanitize(buttonElement.getAttribute('data-uid') ?
            buttonElement.getAttribute('data-uid') : buttonElement.getAttribute('data-field')) :
            (buttonElement.getAttribute('data-uid') ? buttonElement.getAttribute('data-uid') : buttonElement.getAttribute('data-field'));
        this.buttonElement =
            this.buttonElement ? this.buttonElement : document.getElementsByClassName(textContent.innerText)[0] as HTMLElement;
        const inputTextDiv1: HTMLElement = createElement('div', {
            className: 'e-type-option-text'
        });
        inputTextDiv1.innerText = this.parent.localeObj.getConstant('sourceCaption');
        const optionTextDiv1: HTMLElement = createElement('div', {
            className: 'e-base-field-option-text'
        });
        optionTextDiv1.innerText = this.parent.localeObj.getConstant('summarizeValuesBy');
        const optionTextDiv2: HTMLElement = createElement('div', {
            className: 'e-base-item-option-text'
        });
        optionTextDiv2.innerText = this.parent.localeObj.getConstant('baseField');
        const optionTextDiv3: HTMLElement = createElement('div', {
            className: 'e-type-option-text'
        });
        optionTextDiv3.innerText = this.parent.localeObj.getConstant('baseItem');
        const inputDiv1: HTMLElement = createElement('div', { className: 'e-caption-input-container' });
        const dropOptionDiv1: HTMLElement = createElement('div', { id: this.parentElement.id + '_type_option' });
        const dropOptionDiv2: HTMLElement = createElement('div', { id: this.parentElement.id + '_base_field_option' });
        const dropOptionDiv3: HTMLElement = createElement('div', { id: this.parentElement.id + '_base_item_option' });
        const crossGroupInput: HTMLInputElement = createElement('input', {
            id: this.parentElement.id + '_cross_group_option', attrs: { 'type': 'checkbox' }
        }) as HTMLInputElement;
        const inputField1: HTMLInputElement = createElement('input', {
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
        optionWrapperDiv4.appendChild(crossGroupInput);
        filterWrapperDiv1.appendChild(textWrappper);
        filterWrapperDiv1.appendChild(inputDiv1);
        filterWrapperDiv1.appendChild(optionWrapperDiv1);
        filterWrapperDiv1.appendChild(optionWrapperDiv2);
        filterWrapperDiv1.appendChild(optionWrapperDiv3);
        filterWrapperDiv1.appendChild(optionWrapperDiv4);
        mainDiv.appendChild(filterWrapperDiv1);
        const popupInstance: AggregateMenu = this as AggregateMenu;
        const optionWrapper1: DropDownList = new DropDownList({
            dataSource: summaryDataSource, enableRtl: this.parent.enableRtl, locale: this.parent.locale,
            fields: { value: 'value', text: 'text' },
            value: summaryType,
            // popupWidth: 'auto',
            cssClass: cls.VALUE_OPTIONS_CLASS + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''), width: '100%',
            change: (args: ChangeEventArgs) => {
                optionWrapper2.enabled = baseFieldTypes.indexOf(args.value as string) !== -1 ? true : false;
                optionWrapper3.enabled = baseItemTypes.indexOf(args.value as string) !== -1 ? true : false;
                if (optionWrapper3.enabled && (optionWrapper3.dataSource as object[]).length === 3) {
                    optionWrapper3.dataSource = getBaseItemDataSource(fieldItemDataSource);
                    optionWrapper3.dataBind();
                }
                updateCrossGroup();
            }
        });
        optionWrapper1.isStringTemplate = true;
        optionWrapper1.isAngular = this.parent.isModalDialog;
        optionWrapper1.appendTo(dropOptionDiv1);
        const optionWrapper2: DropDownList = new DropDownList({
            dataSource: fieldDataSource, enableRtl: this.parent.enableRtl, locale: this.parent.locale,
            fields: { value: 'value', text: 'text' },
            value: baseField,
            // popupWidth: 'auto',
            enabled: (baseFieldTypes.indexOf(summaryType) !== -1 ? true : false),
            cssClass: cls.VALUE_OPTIONS_CLASS + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''), width: '100%',
            change: (args: ChangeEventArgs) => {
                const isDateField: boolean = PivotUtil.isDateField(args.value as string, this.parent.engineModule as PivotEngine);
                fieldItemDataSource = (popupInstance.parent.engineModule.fieldList[args.value as string].dateMember).map((item: IAxisSet) =>
                    isDateField ?  item.formattedText :
                        this.parent.engineModule.getFormattedValue(item.actualText, args.value as string).formattedText
                );
                optionWrapper3.dataSource = getBaseItemDataSource(fieldItemDataSource);
                optionWrapper3.value = fieldItemDataSource[0];
                optionWrapper3.filterBarPlaceholder = popupInstance.parent.localeObj.getConstant('example') + ' ' + fieldItemDataSource[0];
                optionWrapper3['itemData'] = null;
                optionWrapper3.dataBind();
            }
        });
        optionWrapper2.isStringTemplate = true;
        optionWrapper2.isAngular = this.parent.isModalDialog;
        optionWrapper2.appendTo(dropOptionDiv2);
        const updateCrossGroup: () => void = () => {
            crossGroupWrapper.disabled = !(baseItemTypes.indexOf(optionWrapper1.value as string) !== -1 &&
                isAdjacentToken(optionWrapper3.value as string));
            if (crossGroupWrapper.disabled) {
                crossGroupWrapper.checked = false;
            }
            // Apply now: a deferred update would run against a destroyed checkbox when the dialog closes first.
            crossGroupWrapper.dataBind();
        };
        const optionWrapper3: DropDownList = new DropDownList({
            dataSource: getBaseItemDataSource(fieldItemDataSource), enableRtl: this.parent.enableRtl, locale: this.parent.locale,
            fields: { value: 'value', text: 'text' },
            value: baseItem,
            // popupWidth: 'auto',
            allowFiltering: true,
            filterBarPlaceholder: this.parent.localeObj.getConstant('example') + ' ' + fieldItemDataSource[0],
            enabled: (baseItemTypes.indexOf(summaryType) !== -1 ? true : false),
            cssClass: cls.FILTER_OPERATOR_CLASS + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''), width: '100%',
            change: () => { updateCrossGroup(); }
        });
        optionWrapper3.isStringTemplate = true;
        optionWrapper3.isAngular = this.parent.isModalDialog;
        optionWrapper3.appendTo(dropOptionDiv3);
        const crossGroupWrapper: CheckBox = new CheckBox({
            label: this.parent.localeObj.getConstant('crossGroupComparison'), enableRtl: this.parent.enableRtl,
            locale: this.parent.locale, checked: allowCrossGroup && isAdjacentToken(baseItem),
            disabled: !(baseItemTypes.indexOf(summaryType) !== -1 && isAdjacentToken(baseItem)),
            cssClass: this.parent.cssClass
        });
        crossGroupWrapper.appendTo(crossGroupInput);
        const inputObj1: MaskedTextBox = new MaskedTextBox({
            placeholder: 'Enter field caption',
            // floatLabelType: 'Auto',
            enableRtl: this.parent.enableRtl,
            locale: this.parent.locale,
            value: fieldCaption, width: '100%',
            cssClass: this.parent.cssClass
        });
        inputObj1.isStringTemplate = true;
        inputObj1.appendTo(inputField1);
        return mainDiv;
    }
    private selectOptionInContextMenu(menu: MenuEventArgs): void {
        if (menu.item.text !== null) {
            const buttonElement: HTMLElement = this.currentMenu.closest('.' + cls.PIVOT_BUTTON_CLASS) as HTMLElement;
            const fieldInfo: FieldItemInfo = PivotUtil.getFieldInfo((buttonElement ?
                buttonElement.getAttribute('data-uid') : ''), this.parent);
            this.parent.actionObj.fieldInfo = fieldInfo.fieldItem;
            const type: string = menu.item.id.split('_').pop();
            try {
                if (type === 'MoreOption' || type === 'PercentageOfDifferenceFrom'
                    || type === 'PercentageOfParentTotal' || type === 'DifferenceFrom') {
                    this.createValueSettingsDialog(buttonElement, this.parentElement, type);
                } else {
                    this.parent.actionObj.actionName = events.aggregateField;
                    if (PivotUtil.invokeActionMethod(this.parent, events.actionBegin, events.aggregateField)) {
                        return;
                    }
                    const field: string = buttonElement.getAttribute('data-uid');
                    const valuefields: IFieldOptions[] = this.parent.dataSourceSettings.values;
                    const contentElement: HTMLElement = buttonElement.querySelector('.' + cls.PIVOT_BUTTON_CONTENT_CLASS) as HTMLElement;
                    const fieldCaption: string = (!isNullOrUndefined(this.parent) && !isNullOrUndefined(this.parent.engineModule) &&
                        !isNullOrUndefined(this.parent.engineModule.fieldList[field as string])) ?
                        this.parent.engineModule.fieldList[field as string].caption : '';
                    let captionName: string = menu.item.text + ' ' + this.parent.localeObj.getConstant('of') + ' ' +
                        fieldCaption;
                    captionName = this.parent.enableHtmlSanitizer ? SanitizeHtmlHelper.sanitize(captionName) : captionName;
                    if (this.parent.dataSourceSettings.showAggregationOnValueField) {
                        contentElement.innerText = captionName;
                    }
                    contentElement.setAttribute('title', captionName);
                    buttonElement.setAttribute('data-type', type as string);
                    const instanceId: string = buttonElement.getAttribute('data-instance-id');
                    for (let vCnt: number = 0; vCnt < this.parent.dataSourceSettings.values.length; vCnt++) {
                        if (instanceId ? (this.parent.dataSourceSettings.values[vCnt as number] as IFieldOptions).instanceId === instanceId
                            : this.parent.dataSourceSettings.values[vCnt as number].name === field) {
                            const dataSourceItem: IFieldOptions =
                            extend({}, (<{ [key: string]: IFieldOptions }>valuefields[vCnt as number]).properties ?
                                (<{ [key: string]: IFieldOptions }>valuefields[vCnt as number]).properties :
                                valuefields[vCnt as number], null, true);
                            dataSourceItem.type = type as SummaryTypes;
                            // Preserve the value-field instance identity through the aggregation
                            // update; the engine derives instance ids from name+type+caption when
                            // absent, which would otherwise change the button's data-instance-id.
                            dataSourceItem.instanceId = instanceId;
                            if (instanceId && this.parent.dataType === 'pivot') {
                                const instanceField: IField = (this.parent.engineModule as PivotEngine)
                                    .getValueInstanceFieldListEntry(instanceId) as IField;
                                if (instanceField) {
                                    instanceField.aggregateType = type;
                                }
                            } else {
                                this.parent.engineModule.fieldList[field as string].aggregateType = type;
                            }
                            valuefields.splice(vCnt, 1, dataSourceItem);
                            this.parent.lastAggregationInfo = dataSourceItem;
                        }
                    }
                    this.setAggregateActionInfo(type as SummaryTypes, field, fieldCaption);
                    this.parent.actionObj.actionName = events.fieldAggregated;
                    this.updateDataSource();
                    // The value-field instanceId is preserved across the data source update
                    // (cloneFieldSettings carries it through), so the id captured before the
                    // update still identifies the updated button.
                    this.activeInstanceId = instanceId;
                    this.focusValueButton(instanceId);
                }
            } catch (execption) {
                this.parent.actionFailureMethod(execption);
            }
        }
    }
    private updateDataSource(isRefreshed?: boolean): void {
        if ((this.parent as PivotFieldList).isDeferLayoutUpdate === false || ((this.parent as PivotFieldList).pivotGridModule &&
            (this.parent as PivotFieldList).pivotGridModule.pivotDeferLayoutUpdate === false)
            || this.parent.getModuleName() === 'pivotview' || (this.parent.isAdaptive && this.parent.getModuleName() === 'pivotfieldlist'
                && (this.parent as PivotFieldList).renderMode === 'Popup')) {
            this.parent.updateDataSource(isRefreshed);
        } else {
            if (this.parent.getModuleName() === 'pivotfieldlist' && (this.parent as PivotFieldList).renderMode === 'Popup') {
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
        const valueDialog: Dialog = getInstance(select('#' + this.parentElement.id + '_ValueDialog', document) as HTMLElement, Dialog) as Dialog;
        const dialogElement: HTMLElement = valueDialog.element;
        const captionInstance: MaskedTextBox = getInstance(select('#' + this.parentElement.id + 'type_input_option'), MaskedTextBox) as MaskedTextBox;
        const summaryInstance: DropDownList = getInstance(select('#' + this.parentElement.id + '_type_option'), DropDownList) as DropDownList;
        const baseFieldInstance: DropDownList = getInstance(select('#' + this.parentElement.id + '_base_field_option'), DropDownList) as DropDownList;
        const baseItemInstance: DropDownList = getInstance(select('#' + this.parentElement.id + '_base_item_option'), DropDownList) as DropDownList;
        const crossGroupInstance: CheckBox = getInstance(select('#' + this.parentElement.id + '_cross_group_option'), CheckBox) as CheckBox;
        const allowCrossGroup: boolean = !crossGroupInstance.disabled && crossGroupInstance.checked;
        const fieldName: string = dialogElement.getAttribute('data-field');
        let buttonElement: HTMLElement;
        const selectedInstanceId: string = this.activeInstanceId;
        if (this.parentElement.querySelector('.' + cls.PIVOT_BUTTON_CLASS)) {
            buttonElement = selectedInstanceId ? this.parentElement.querySelector(
                '.' + cls.PIVOT_BUTTON_CLASS + '[data-instance-id="' + selectedInstanceId + '"]'
            ) as HTMLElement : this.parentElement.getElementsByClassName(
                `${cls.PIVOT_BUTTON_CLASS} ${fieldName.replace(/[^A-Z0-9]/ig, '')}`)[0] as HTMLElement;
        }
        if (buttonElement) {
            const contentElement: HTMLElement = buttonElement.querySelector('.' + cls.PIVOT_BUTTON_CONTENT_CLASS) as HTMLElement;
            let captionName: string = this.parent.dataSourceSettings.showAggregationOnValueField
                ? (this.parent.localeObj.getConstant(summaryInstance.value as string) + ' ' +
                this.parent.localeObj.getConstant('of') + ' ' + captionInstance.value)
                : captionInstance.value;
            captionName = this.parent.enableHtmlSanitizer ? SanitizeHtmlHelper.sanitize(captionName) : captionName;
            contentElement.innerText = captionName;
            contentElement.setAttribute('title', captionName);
            buttonElement.setAttribute('data-type', summaryInstance.value as string);
            buttonElement.setAttribute('data-caption', captionInstance.value);
            buttonElement.setAttribute('data-basefield', baseFieldInstance.value as string);
            buttonElement.setAttribute('data-baseitem', baseItemInstance.value as string);
            buttonElement.setAttribute('data-allowcrossgroup', allowCrossGroup ? 'true' : 'false');
        }
        let selectedField: IFieldOptions = selectedInstanceId ?
            this.parent.dataSourceSettings.values.filter((val: IFieldOptions) => val.instanceId === selectedInstanceId)[0] as IFieldOptions
            : PivotUtil.getFieldByName(fieldName, this.parent.dataSourceSettings.values) as IFieldOptions;
        if (!selectedField) {
            selectedField = PivotUtil.getFieldByName(fieldName, this.parent.dataSourceSettings.values) as IFieldOptions;
        }
        if (!selectedField) {
            this.parent.actionFailureMethod(new Error('Unable to find the value field "' + fieldName + '" in the data source settings.'));
            return;
        }
        const fieldProperties: { [key: string]: Object } = selectedField as { [key: string]: Object };
        selectedField = fieldProperties.properties ? fieldProperties.properties as IFieldOptions : selectedField;
        selectedField.caption = captionInstance.value;
        selectedField.type = summaryInstance.value as SummaryTypes;
        selectedField.baseField = baseFieldInstance.value as string;
        selectedField.baseItem = baseItemInstance.value as string;
        selectedField.allowCrossGroupCalculation = allowCrossGroup;
        // When the same field is added multiple times to the values axis, the
        // shared field-level aggregate type must not change; only the selected
        // instance's aggregation is updated.
        if (!selectedInstanceId || !this.parent.dataSourceSettings.values.some((val: IFieldOptions) =>
            val !== selectedField && val.name === selectedField.name)) {
            this.parent.engineModule.fieldList[fieldName as string].aggregateType = selectedField.type;
        }
        valueDialog.close();
        // this.parent.axisFieldModule.render();
        this.parent.lastAggregationInfo = selectedField;
        const isDifferenceFromAggregateType: boolean = (selectedField.type === 'PercentageOfDifferenceFrom' ||
            selectedField.type === 'PercentageOfParentTotal' || selectedField.type === 'DifferenceFrom');
        this.parent.actionObj.actionName = events.fieldAggregated;
        this.setAggregateActionInfo(
            selectedField.type, selectedField.name, selectedField.caption,
            isDifferenceFromAggregateType ? selectedField.baseField : undefined,
            isDifferenceFromAggregateType ? selectedField.baseItem : undefined
        );
        if (this.parent && this.parent.allowDeferLayoutUpdate) {
            if (PivotUtil.invokeActionMethod(this.parent, events.actionComplete, events.fieldAggregated)) {
                return;
            }
        }
        this.updateDataSource(true);
        this.focusValueButton(selectedInstanceId);
    }

    private focusValueButton(instanceId: string): void {
        if (!instanceId || !this.parentElement) {
            return;
        }
        const focus: () => void = () => {
            const button: HTMLElement = this.parentElement.querySelector(
                '.' + cls.PIVOT_BUTTON_CLASS + '[data-instance-id="' + instanceId + '"]'
            ) as HTMLElement;
            if (button) {
                button.focus();
            }
        };
        setTimeout(focus);
    }
    private removeDialog(): void {
        this.focusValueButton(this.activeInstanceId);
        const element: HTMLElement = select('#' + this.parentElement.id + '_ValueDialog', document);
        const valueDialog: Dialog = element ? getInstance(element, Dialog) as Dialog : null;
        if (valueDialog && !valueDialog.isDestroyed) { valueDialog.destroy(); }
        if (document.getElementById(this.parentElement.id + '_ValueDialog')) {
            remove(document.getElementById(this.parentElement.id + '_ValueDialog'));
        }
    }

    /**
     * To destroy the pivot button event listener
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        if (this.parent && this.parent.isDestroyed) {
            return;
        }
        this.cleanupMenuInstances();
        this.cleanupDialogs();
        this.cleanupDOMElements();
        this.currentMenu = null;
        this.buttonElement = null;
    }

    /**
     * Cleans up all menu instances
     *
     * @private
     * @returns {void}
     */
    private cleanupMenuInstances(): void {
        if (this.menuInfo) {
            for (let i: number = 0; i < this.menuInfo.length; i++) {
                if (this.menuInfo[i as number] && !this.menuInfo[i as number].isDestroyed) {
                    this.menuInfo[i as number].destroy();
                }
            }
            this.menuInfo = [];
        }
        const menuElements: HTMLElement[] = [
            document.getElementById(this.parent.element.id + 'valueFieldContextMenu'),
            document.getElementById(this.parent.element.id + 'valueFieldStringContextMenu')
        ];
        for (const element of menuElements) {
            if (element) {
                remove(element);
            }
        }
    }

    /**
     * Cleans up any open dialogs
     *
     * @private
     * @returns {void}
     */
    private cleanupDialogs(): void {
        if (!this.parentElement) {
            return;
        }
        const valueDialogElement: HTMLElement = select('#' + this.parentElement.id + '_ValueDialog', document) as HTMLElement;
        if (valueDialogElement) {
            const valueDialog: Dialog = getInstance(valueDialogElement, Dialog) as Dialog;
            if (valueDialog && !valueDialog.isDestroyed) {
                this.cleanupDialogComponents(valueDialogElement);
                valueDialog.destroy();
            }
            remove(valueDialogElement);
        }
    }

    /**
     * Cleans up components inside a dialog
     *
     * @private
     * @param {HTMLElement} dialogElement - The dialog element
     * @returns {void}
     */
    private cleanupDialogComponents(dialogElement: HTMLElement): void {
        if (!dialogElement || !this.parentElement) {
            return;
        }
        const captionInput: HTMLElement = select('#' + this.parentElement.id + 'type_input_option', dialogElement) as HTMLElement;
        if (captionInput) {
            const maskedTextBox: MaskedTextBox = getInstance(captionInput, MaskedTextBox) as MaskedTextBox;
            if (maskedTextBox && !maskedTextBox.isDestroyed) {
                maskedTextBox.destroy();
            }
        }
        const dropdownSelectors: string[] = [
            '#' + this.parentElement.id + '_type_option',
            '#' + this.parentElement.id + '_base_field_option',
            '#' + this.parentElement.id + '_base_item_option'
        ];
        for (const selector of dropdownSelectors) {
            const dropdownElement: HTMLElement = select(selector, dialogElement) as HTMLElement;
            if (dropdownElement) {
                const dropdown: DropDownList = getInstance(dropdownElement, DropDownList) as DropDownList;
                if (dropdown && !dropdown.isDestroyed) {
                    dropdown.destroy();
                }
            }
        }
    }

    /**
     * Cleans up DOM elements created by this class
     *
     * @private
     * @returns {void}
     */
    private cleanupDOMElements(): void {
        const elementIds: string[] = [
            this.parent.element.id + 'valueFieldContextMenu',
            this.parent.element.id + 'valueFieldStringContextMenu'
        ];
        for (const id of elementIds) {
            const element: HTMLElement = document.getElementById(id);
            if (element) {
                remove(element);
            }
        }
    }

    /**
     * Sets the aggregate action info for the action object
     *
     * @private
     * @param {SummaryTypes} aggregateType - The aggregate type
     * @param {string} fieldName - The field name
     * @param {string} fieldCaption - The field caption
     * @param {string} baseField - The base field (optional)
     * @param {string} baseItem - The base item (optional)
     * @returns {void}
     */
    private setAggregateActionInfo(
        aggregateType: SummaryTypes, fieldName: string, fieldCaption: string, baseField?: string, baseItem?: string
    ): void {
        this.parent.actionObj.actionInfo = {
            aggregateInfo: {
                aggregateType: aggregateType,
                fieldName: fieldName,
                fieldCaption: fieldCaption,
                baseField: baseField || undefined,
                baseItem: baseItem || undefined
            }
        };
    }
}

import {
    createElement, removeClass, addClass, remove, isNullOrUndefined,
    setStyleAttribute, closest, EventHandler, getInstance
} from '@syncfusion/ej2-base';
import { PivotCommon } from '../base/pivot-common';
import * as cls from '../base/css-constant';
import {IGroupSettings, PivotEngine } from '../../base/engine';
import {
    TreeView, NodeCheckEventArgs, Tab, TabItemModel, NodeClickEventArgs,
    NodeExpandEventArgs, NodeSelectEventArgs,
    NodeKeyPressEventArgs
} from '@syncfusion/ej2-navigations';
import { Dialog } from '@syncfusion/ej2-popups';
import { MaskedTextBox, MaskChangeEventArgs, NumericTextBox, ChangeEventArgs as NumericChangeEventArgs } from '@syncfusion/ej2-inputs';
import { setStyleAndAttributes } from '@syncfusion/ej2-grids';
import { DropDownList, ChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import { IFilter, IFieldOptions, IFormatSettings, IField } from '../../base/engine';
import { Operators, FilterType, Sorting, TopBottomMode } from '../../base/types';
import { ChangedEventArgs, DateTimePicker } from '@syncfusion/ej2-calendars';
import { ItemModel, DropDownButton, BeforeOpenCloseMenuEventArgs, MenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { OlapEngine, IOlapField } from '../../base/olap/engine';
import { PivotUtil } from '../../base/util';
import * as events from '../base/constant';
import { MemberEditorOpenEventArgs, HeadersSortEventArgs } from '../base/interface';
import { PivotView } from '../../pivotview/base/pivotview';
import { PivotFieldList } from '../../pivotfieldlist/base/field-list';
import { Button, CheckBox, ChangeEventArgs as CheckBoxChangeEventArgs } from '@syncfusion/ej2-buttons';

/**
 * `FilterDialog` module to create filter dialog.
 */
/** @hidden */
export class FilterDialog {
    /** @hidden */
    public parent: PivotCommon;
    /** @hidden */
    public dropMenu: DropDownButton;
    /** @hidden */
    public memberTreeView: TreeView;
    /** @hidden */
    public allMemberSelect: TreeView;
    /** @hidden */
    public editorSearch: MaskedTextBox;
    /** @hidden */
    public dialogPopUp: Dialog;
    /** @hidden */
    public tabObj: Tab;
    /** @hidden */
    public allowExcelLikeFilter: boolean;
    /** @hidden */
    public isSearchEnabled: boolean;
    /** @hidden */
    public filterObject: IFilter;
    /** @hidden */
    public appendControlsWrapper: HTMLElement;
    /** @hidden */
    public isAppendMode: boolean;
    /** @hidden */
    public appendCheckbox: CheckBox;
    private timeOutObj: ReturnType<typeof setTimeout>;

    /**
     * Constructor for the dialog action.
     *
     * @param {PivotCommon} parent - parent
     * @hidden
     */
    constructor(parent?: PivotCommon) {
        this.parent = parent;
        this.isAppendMode = false;
    }

    /**
     * Creates the member filter dialog for the selected field.
     *
     * @function createFilterDialog
     * @param {any} treeData -treeData.
     * @param {string} fieldName -fieldName.
     * @param {string} fieldCaption -fieldCaption.
     * @param {HTMLElement} target -target.
     * @returns {void}
     * @hidden
     */
    public createFilterDialog(treeData: { [key: string]: Object }[], fieldName: string, fieldCaption: string, target: HTMLElement): void {
        const editorDialog: HTMLElement = createElement('div', {
            id: this.parent.parentID + '_EditorTreeView',
            className: cls.MEMBER_EDITOR_DIALOG_CLASS + ' ' + (this.parent.dataType === 'olap' ? 'e-olap-editor-dialog' : '') + (this.parent.isDataOverflow ? ' ' + cls.PIVOT_FILTER_MEMBER_LIMIT : ''),
            attrs: { 'data-fieldName': fieldName, 'aria-label': fieldCaption }
        });
        const filterCaption: string = this.parent.engineModule.fieldList[fieldName as string].caption;
        const headerTemplate: string = this.parent.localeObj.getConstant('filter') + ' ' +
            '"' + fieldCaption + '"' + ' ' + this.parent.localeObj.getConstant('by');
        this.filterObject = this.getFilterObject(fieldName);
        this.isAppendMode = false;
        this.isSearchEnabled = false;
        this.allowExcelLikeFilter = this.isExcelFilter(fieldName);
        this.parent.element.appendChild(editorDialog);
        this.dialogPopUp = new Dialog({
            animationSettings: { effect: (this.allowExcelLikeFilter ? 'None' : 'Fade') },
            allowDragging: false,
            header: (this.allowExcelLikeFilter ? headerTemplate : filterCaption),
            // content: (this.allowExcelLikeFilter ? '' : this.createTreeView(treeData, fieldCaption, fieldName)),
            content: '',
            isModal: true,
            visible: true,
            showCloseIcon: this.allowExcelLikeFilter ? true : false,
            enableRtl: this.parent.enableRtl,
            enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
            width: '320px',
            position: { X: 'center', Y: 'center' },
            buttons: [
                {
                    isFlat: false,
                    buttonModel: {
                        cssClass: 'e-clear-filter-button' + (this.allowExcelLikeFilter ? '' : ' ' + cls.ICON_DISABLE) + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''),
                        iconCss: 'e-icons e-clear-filter-icon', enableRtl: this.parent.enableRtl,
                        content: this.parent.localeObj.getConstant('clearFilter'), disabled: (this.filterObject ? false : true)
                    }
                },
                {
                    isFlat: false,
                    buttonModel: {
                        cssClass: cls.OK_BUTTON_CLASS + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''), content: this.parent.localeObj.getConstant('ok'), isPrimary: true
                    }
                },
                {
                    click: this.closeFilterDialog.bind(this),
                    isFlat: false,
                    buttonModel: { cssClass: cls.CANCEL_BUTTON_CLASS + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''), content: this.parent.localeObj.getConstant('cancel') }
                }],
            closeOnEscape: this.parent.renderMode === 'Popup' ? false : true,
            target: target,
            cssClass: `${this.parent.cssClass} ${this.parent.isDataOverflow ? cls.FILTER_DIALOG_OVERFLOW : ''}`.trim(),
            close: this.removeFilterDialog.bind(this)
        });
        this.dialogPopUp.isStringTemplate = true;
        this.dialogPopUp.isAngular = this.parent.control.isModalDialog;
        this.dialogPopUp.appendTo(editorDialog);
        const filterArgs: MemberEditorOpenEventArgs = {
            cancel: false,
            fieldName: fieldName,
            fieldMembers: this.parent.dataSourceSettings.allowMemberFilter ? treeData : [],
            filterSetting: this.filterObject
        };
        const control: PivotView | PivotFieldList =
            this.parent.moduleName === 'pivotfieldlist' && (this.parent.control as PivotFieldList).isPopupView ?
                (this.parent.control as PivotFieldList).pivotGridModule : this.parent.control;
        control.trigger(events.memberEditorOpen, filterArgs, (observedArgs: MemberEditorOpenEventArgs) => {
            if (!observedArgs.cancel) {
                treeData = observedArgs.fieldMembers;
                if (this.allowExcelLikeFilter) {
                    this.createTabMenu(treeData, fieldCaption, fieldName);
                    addClass([this.dialogPopUp.element], 'e-excel-filter');
                    this.updateCheckedState();
                } else {
                    this.dialogPopUp.content = this.createTreeView(treeData, fieldCaption, fieldName);
                    this.updateCheckedState();
                }
                setStyleAttribute(this.dialogPopUp.element, { 'visibility': 'visible' });
                if (this.allowExcelLikeFilter) {
                    (this.dialogPopUp.element.querySelector('.e-dlg-closeicon-btn') as HTMLElement).focus();
                }
                this.memberTreeView.nodeChecked =
                    this.parent.control.pivotButtonModule.nodeStateModified.bind(this.parent.control.pivotButtonModule);
                this.allMemberSelect.nodeChecked =
                    this.parent.control.pivotButtonModule.nodeStateModified.bind(this.parent.control.pivotButtonModule);
            } else {
                this.dialogPopUp.close();
                this.dialogPopUp = undefined;
            }
        });
    }
    private createTreeView(treeData: { [key: string]: Object }[], fieldCaption: string, fieldName?: string): HTMLElement {
        const editorTreeWrapper: HTMLElement = createElement('div', {
            id: this.parent.parentID + 'EditorDiv',
            className: cls.EDITOR_TREE_WRAPPER_CLASS + (this.allowExcelLikeFilter ? ' e-excelfilter' : '')
        });
        const levelWrapper: HTMLElement = createElement('button', {
            id: this.parent.parentID + '_LevelDiv',
            className: 'e-level-container-class', attrs: { 'type': 'button' }
        });
        const searchWrapper: HTMLElement = createElement('div', {
            id: this.parent.parentID + '_SearchDiv', attrs: { 'tabindex': '-1' },
            className: cls.EDITOR_SEARCH_WRAPPER_CLASS
        });
        const filterCaption: string = this.parent.engineModule.fieldList[fieldName as string].caption;
        const editorSearch: HTMLInputElement = createElement('input', {
            attrs: { 'type': 'text', className: cls.EDITOR_SEARCH__INPUT_CLASS }
        }) as HTMLInputElement;
        const nodeLimitText: string = this.parent.isDataOverflow ?
            ((this.parent.currentTreeItems.length - this.parent.control.maxNodeLimitInMemberEditor) +
                this.parent.control.localeObj.getConstant('editorDataLimitMsg')) : '';
        const labelWrapper: HTMLElement = createElement('div', {
            id: this.parent.parentID + '_LabelDiv',
            attrs: { 'tabindex': '-1', 'title': nodeLimitText },
            className: cls.EDITOR_LABEL_WRAPPER_CLASS
        });
        this.parent.editorLabelElement = createElement('label', { className: cls.EDITOR_LABEL_CLASS }) as HTMLLabelElement;
        this.parent.editorLabelElement.innerText = nodeLimitText;
        labelWrapper.style.display = this.parent.isDataOverflow ? 'block' : 'none';
        labelWrapper.appendChild(this.parent.editorLabelElement);
        searchWrapper.appendChild(editorSearch);
        this.createSortOptions(fieldName, searchWrapper, treeData);
        const selectAllWrapper: HTMLElement = createElement('div', {
            id: this.parent.parentID + '_AllDiv', attrs: { 'tabindex': '-1' },
            className: cls.SELECT_ALL_WRAPPER_CLASS
        });
        const selectAllContainer: HTMLElement = createElement('div', { id: this.parent.parentID + '_SelectAllContainer', className: cls.SELECT_ALL_CLASS });
        const treeOuterDiv: HTMLElement = createElement('div', { className: cls.EDITOR_TREE_CONTAINER_CLASS + '-outer-div' });
        const treeViewContainer: HTMLElement = createElement('div', { className: cls.EDITOR_TREE_CONTAINER_CLASS });
        const promptDiv: HTMLElement = createElement('div', {
            className: cls.EMPTY_MEMBER_CLASS + ' ' + cls.ICON_DISABLE
        });
        promptDiv.innerText = this.parent.localeObj.getConstant('noMatches');
        if (this.parent.dataType === 'olap' && this.parent.control.loadOnDemandInMemberEditor &&
            !(this.parent.engineModule as OlapEngine).fieldList[fieldName as string].isHierarchy &&
            !(this.parent.engineModule as OlapEngine).fieldList[fieldName as string].isNamedSets) {
            searchWrapper.appendChild(levelWrapper);
            this.createLevelWrapper(levelWrapper, fieldName);
        }
        selectAllWrapper.appendChild(selectAllContainer);
        editorTreeWrapper.appendChild(searchWrapper);
        editorTreeWrapper.appendChild(selectAllWrapper);
        editorTreeWrapper.appendChild(promptDiv);
        this.editorSearch = new MaskedTextBox({
            placeholder: this.parent.localeObj.getConstant('search') + ' ' + '"' + filterCaption + '"',
            enableRtl: this.parent.enableRtl,
            cssClass: cls.EDITOR_SEARCH_CLASS + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''),
            showClearButton: true,
            change: (e: MaskChangeEventArgs) => {
                if (this.parent.dataType === 'olap') {
                    this.searchOlapTreeView(e, promptDiv);
                } else {
                    this.parent.eventBase.searchTreeNodes(e, this.memberTreeView, false);
                    const filterDialog: Element = this.dialogPopUp.element;
                    const liList: HTMLElement[] = [].slice.call(this.memberTreeView.element.querySelectorAll('li')) as HTMLElement[];
                    if (liList.length === 0) {
                        this.allMemberSelect.disableNodes([this.allMemberSelect.element.querySelector('li')]);
                        filterDialog.querySelector('.' + cls.OK_BUTTON_CLASS).setAttribute('disabled', 'disabled');
                        removeClass([promptDiv], cls.ICON_DISABLE);
                    } else {
                        this.allMemberSelect.enableNodes([this.allMemberSelect.element.querySelector('li')]);
                        filterDialog.querySelector('.' + cls.OK_BUTTON_CLASS).removeAttribute('disabled');
                        addClass([promptDiv], cls.ICON_DISABLE);
                    }
                    this.updateCheckedState();
                }
                this.updateAppendWrapperVisibility(e.value);
            }
        });
        this.editorSearch.isStringTemplate = true;
        this.editorSearch.appendTo(editorSearch);
        const nodeAttr: { [key: string]: string } = { 'data-fieldName': fieldName, 'data-memberId': 'all' };
        const data: { [key: string]: Object }[] = [{ id: 'all', name: this.parent.localeObj.getConstant('all'), isSelected: true, htmlAttributes: nodeAttr }];
        this.allMemberSelect = new TreeView({
            fields: { dataSource: data, id: 'id', text: 'name', isChecked: 'isSelected' },
            showCheckBox: true,
            expandOn: 'None',
            enableRtl: this.parent.enableRtl,
            enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
            nodeClicked: this.nodeCheck.bind(this, true),
            keyPress: this.nodeCheck.bind(this, true),
            nodeSelected: (args: NodeSelectEventArgs) => {
                removeClass([args.node], 'e-active');
                args.cancel = true;
            },
            cssClass: this.parent.cssClass
        });
        this.allMemberSelect.isStringTemplate = true;
        this.allMemberSelect.isAngular = this.parent.control.isModalDialog;
        if (!isNullOrUndefined(this.parent.currentTreeItems)) {
            for (let i: number = 0; i < this.parent.currentTreeItems.length; i++) {
                if ((this.parent.currentTreeItems[i as number].id as string).indexOf('\n') ||
                    (this.parent.currentTreeItems[i as number].id as string).indexOf('\n') === 0) {
                    this.parent.currentTreeItems[i as number].id = (this.parent.currentTreeItems[i as number].id as string).replace('\n', ' ');
                }
            }
        }
        this.allMemberSelect.appendTo(selectAllContainer);
        treeOuterDiv.appendChild(treeViewContainer);
        if (this.filterObject && (this.filterObject.type === 'Include' || this.filterObject.type === 'Exclude')) {
            this.appendControlsWrapper = createElement('div', {
                className: 'e-append-filter-wrapper',
                id: this.parent.parentID + '_AppendWrapper'
            });
            addClass([this.appendControlsWrapper], cls.ICON_DISABLE);
            const appendCheckboxContainer: HTMLElement = createElement('div', {
                className: 'e-append-checkbox-container'
            });
            const appendCheckboxInput: HTMLInputElement = createElement('input', {
                id: this.parent.parentID + '_append_checkbox',
                className: 'e-append-checkbox-input',
                attrs: { 'type': 'checkbox' }
            }) as HTMLInputElement;
            appendCheckboxContainer.appendChild(appendCheckboxInput);
            this.appendCheckbox = new CheckBox({
                label: this.parent.localeObj.getConstant('addCurrentSelection'),
                checked: false,
                enableRtl: this.parent.enableRtl,
                locale: this.parent.control.locale,
                enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
                cssClass: 'e-append-checkbox',
                change: (args: CheckBoxChangeEventArgs) => {
                    this.isAppendMode = args.checked as boolean;
                }
            });
            this.appendCheckbox.isStringTemplate = true;
            this.appendCheckbox.appendTo(appendCheckboxInput);
            this.appendControlsWrapper.appendChild(appendCheckboxContainer);
        } else if (this.appendControlsWrapper && !this.appendControlsWrapper.classList.contains(cls.ICON_DISABLE)) {
            addClass([this.appendControlsWrapper], cls.ICON_DISABLE);
        }
        editorTreeWrapper.appendChild(selectAllWrapper);
        if (this.appendControlsWrapper) {
            editorTreeWrapper.appendChild(this.appendControlsWrapper);
        }
        editorTreeWrapper.appendChild(promptDiv);
        editorTreeWrapper.appendChild(treeOuterDiv);
        this.memberTreeView = new TreeView({
            fields: { dataSource: treeData, id: 'id', text: 'name', isChecked: 'isSelected', parentID: 'pid' },
            showCheckBox: true,
            enableRtl: this.parent.enableRtl,
            enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
            nodeChecking: this.validateTreeNode.bind(this),
            nodeClicked: this.nodeCheck.bind(this, false),
            keyPress: this.nodeCheck.bind(this, false),
            nodeExpanding: this.updateChildNodes.bind(this),
            nodeSelected: (args: NodeSelectEventArgs) => {
                removeClass([args.node], 'e-active');
                args.cancel = true;
            },
            expandOn: 'None',
            cssClass: this.parent.cssClass
        });
        this.memberTreeView.isStringTemplate = true;
        this.memberTreeView.isAngular = this.parent.control.isModalDialog;
        this.memberTreeView.appendTo(treeViewContainer);
        if (this.parent.isDataOverflow && (this.parent.control.maxNodeLimitInMemberEditor < this.parent.currentTreeItems.length)) {
            editorTreeWrapper.appendChild(labelWrapper);
        }
        return editorTreeWrapper;
    }
    private createSortOptions(fieldName: string, target: HTMLElement, treeData: { [key: string]: Object }[]): void {
        if (this.parent.dataType === 'pivot' && treeData && treeData.length > 0) {
            const sortOrder: string = this.parent.engineModule.fieldList[fieldName as string].sort;
            const sortWrapper: HTMLElement = createElement('div', {
                className: cls.FILTER_SORT_CLASS + ' e-btn-group' + (this.parent.enableRtl ? ' ' + cls.RTL : '') + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''),
                id: this.parent.element.id + '_Member_Sort'
            });
            this.parent.element.appendChild(sortWrapper);
            const sortAscendElement: HTMLElement = createElement('button', {
                className: (sortOrder === 'Ascending' ? cls.SORT_SELECTED_CLASS + ' ' : '') + cls.MEMBER_SORT_CLASS,
                id: this.parent.element.id + '_Sort_Ascend', attrs: { 'type': 'button', 'aria-label': 'button' }
            });
            const sortDescendElement: HTMLElement = createElement('button', {
                className: (sortOrder === 'Descending' ? cls.SORT_SELECTED_CLASS + ' ' : '') + cls.MEMBER_SORT_CLASS,
                id: this.parent.element.id + '_Sort_Descend', attrs: { 'type': 'button', 'aria-label': 'button' }
            });
            let sortBtnElement: Button = new Button({
                iconCss: cls.ICON + ' ' + cls.SORT_ASCEND_ICON_CLASS, enableRtl: this.parent.enableRtl, cssClass: this.parent.cssClass,  enableHtmlSanitizer: this.parent.enableHtmlSanitizer
            });
            sortBtnElement.appendTo(sortAscendElement);
            sortBtnElement = new Button({
                iconCss: cls.ICON + ' ' + cls.SORT_DESCEND_ICON_CLASS, enableRtl: this.parent.enableRtl, cssClass: this.parent.cssClass,  enableHtmlSanitizer: this.parent.enableHtmlSanitizer
            });
            sortBtnElement.appendTo(sortDescendElement);
            sortWrapper.appendChild(sortAscendElement);
            sortWrapper.appendChild(sortDescendElement);
            target.appendChild(sortWrapper);
            this.unWireEvent(sortAscendElement);
            this.unWireEvent(sortDescendElement);
            this.wireEvent(sortAscendElement, fieldName);
            this.wireEvent(sortDescendElement, fieldName);
        }
    }
    private createLevelWrapper(levelWrapper: HTMLElement, fieldName: string): void {
        const engineModule: OlapEngine = this.parent.engineModule as OlapEngine;
        const levels: IOlapField[] = engineModule.fieldList[fieldName as string].levels;
        const levelCount: number = engineModule.fieldList[fieldName as string].levelCount;
        const items: ItemModel[] = [];
        for (let i: number = 0, cnt: number = levels.length; i < cnt; i++) {
            items.push({ id: levels[i as number].id, text: levels[i as number].name });
        }
        this.dropMenu = new DropDownButton({
            cssClass: 'e-level-drop e-caret-hide' + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''),
            items: items, iconCss: 'e-icons e-dropdown-icon',
            disabled: (levelCount === levels.length),
            enableRtl: this.parent.enableRtl,
            enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
            beforeOpen: (args: BeforeOpenCloseMenuEventArgs) => {
                const items: HTMLLIElement[] = [].slice.call(args.element.querySelectorAll('li'));
                const engineModule: OlapEngine = this.parent.engineModule as OlapEngine;
                const levelCount: number = engineModule.fieldList[fieldName as string].levelCount;
                removeClass(items, cls.MENU_DISABLE);
                for (let i: number = 0, cnt: number = items.length; i < cnt; i++) {
                    if (i < levelCount) {
                        addClass([items[i as number]], cls.MENU_DISABLE);
                    }
                }
            },
            select: (args: MenuEventArgs) => {
                const fieldName: string = this.dialogPopUp.element.getAttribute('data-fieldname');
                const engineModule: OlapEngine = this.parent.engineModule as OlapEngine;
                let selectedLevel: number;
                for (let i: number = 0, cnt: number = items.length; i < cnt; i++) {
                    if (items[i as number].id === args.item.id) {
                        selectedLevel = i;
                    }
                }
                engineModule.getFilterMembers(this.parent.dataSourceSettings, fieldName, selectedLevel + 1, false, true);
            },
            close: () => {
                const engineModule: OlapEngine = this.parent.engineModule as OlapEngine;
                const levels: IOlapField[] = engineModule.fieldList[fieldName as string].levels;
                const levelCount: number = engineModule.fieldList[fieldName as string].levelCount;
                if (levelCount === levels.length) {
                    this.dropMenu.disabled = true;
                    this.dropMenu.dataBind();
                } else {
                    this.dropMenu.disabled = false;
                }
            }
        });
        this.dropMenu.appendTo(levelWrapper);
    }
    private searchOlapTreeView(e: MaskChangeEventArgs, promptDiv: HTMLElement): void {
        const popupInstance: FilterDialog = this as FilterDialog;
        clearTimeout(this.timeOutObj);
        this.timeOutObj = setTimeout(function (): void {
            const engineModule: OlapEngine = popupInstance.parent.engineModule as OlapEngine;
            const filterDialog: Element = popupInstance.dialogPopUp.element;
            const fieldName: string = filterDialog.getAttribute('data-fieldname');
            const nodeLimit: number = popupInstance.parent.control.maxNodeLimitInMemberEditor ?
                popupInstance.parent.control.maxNodeLimitInMemberEditor : 5000;
            if (!engineModule.fieldList[fieldName as string].isHierarchy) {
                if (popupInstance.dropMenu && e.value !== '') {
                    popupInstance.dropMenu.disabled = true;
                } else {
                    popupInstance.dropMenu.disabled = false;
                }
                if (!popupInstance.parent.control.loadOnDemandInMemberEditor) {
                    engineModule.getSearchMembers(
                        popupInstance.parent.dataSourceSettings, fieldName, e.value.toLowerCase(), nodeLimit, true);
                } else {
                    const levelCount: number = engineModule.fieldList[fieldName as string].levelCount ?
                        engineModule.fieldList[fieldName as string].levelCount : 1;
                    engineModule.getSearchMembers(
                        popupInstance.parent.dataSourceSettings, fieldName, e.value.toLowerCase(), nodeLimit, false, levelCount);
                }
                popupInstance.parent.eventBase.searchTreeNodes(e, popupInstance.memberTreeView, false, false);
            } else {
                popupInstance.parent.eventBase.searchTreeNodes(e, popupInstance.memberTreeView, false, true);
            }
            const liList: HTMLElement[] = [].slice.call(popupInstance.memberTreeView.element.querySelectorAll('li')) as HTMLElement[];
            // for (let element of liList) {
            //     if (element.querySelector('.interaction')) {
            //         setStyleAttribute(element.querySelector('.interaction'), { display: 'none' });
            //     }
            // }
            if (liList.length === 0) {
                popupInstance.allMemberSelect.disableNodes([popupInstance.allMemberSelect.element.querySelector('li')]);
                filterDialog.querySelector('.' + cls.OK_BUTTON_CLASS).setAttribute('disabled', 'disabled');
                removeClass([promptDiv], cls.ICON_DISABLE);
            } else {
                popupInstance.allMemberSelect.enableNodes([popupInstance.allMemberSelect.element.querySelector('li')]);
                filterDialog.querySelector('.' + cls.OK_BUTTON_CLASS).removeAttribute('disabled');
                addClass([promptDiv], cls.ICON_DISABLE);
            }
            popupInstance.updateCheckedState();
            popupInstance.updateAppendWrapperVisibility(e.value);
        }, 500);
    }
    private updateAppendWrapperVisibility(searchValue: string): void {
        if (this.appendControlsWrapper) {
            const liList: HTMLElement[] = [].slice.call(this.memberTreeView.element.querySelectorAll('li')) as HTMLElement[];
            const hasSearchResults: boolean = liList.length > 0;
            if (searchValue && searchValue.trim() !== '' && hasSearchResults) {
                removeClass([this.appendControlsWrapper], cls.ICON_DISABLE);
            } else {
                addClass([this.appendControlsWrapper], cls.ICON_DISABLE);
            }
        }
    }
    private nodeCheck(isAllMember: boolean, args: NodeClickEventArgs | NodeKeyPressEventArgs): void {
        const checkedNode: HTMLElement[] = [args.node];
        const target: Element = args.event.target as Element;
        if (target.classList.contains('e-fullrow') || (args.event as KeyboardEvent).key === 'Enter') {
            const memberObj: TreeView = isAllMember ? this.allMemberSelect : this.memberTreeView;
            const getNodeDetails: { [key: string]: Object } = memberObj.getNode(args.node);
            if (getNodeDetails.isChecked === 'true') {
                memberObj.uncheckAll(checkedNode);
            } else {
                memberObj.checkAll(checkedNode);
            }
        } else if ((args.event as KeyboardEvent).keyCode === 38 && !isAllMember) {
            removeClass(this.memberTreeView.element.querySelectorAll('li.e-prev-active-node'), 'e-prev-active-node');
            addClass(checkedNode, 'e-prev-active-node');
        }
    }
    private applySorting(fieldName: string, args: Event): void {
        const target: Element = closest(args.target as Element, '.' + cls.MEMBER_SORT_CLASS) as Element;
        if (target) {
            const sortElements: Element[] =
                [].slice.call(closest(target, '.' + cls.FILTER_SORT_CLASS).querySelectorAll('.' + cls.MEMBER_SORT_CLASS));
            if (target.querySelector('.' + cls.SORT_ASCEND_ICON_CLASS) && !target.classList.contains(cls.SORT_SELECTED_CLASS)) {
                this.updateFilterMembers('Ascending', fieldName);
                addClass([target], cls.SORT_SELECTED_CLASS);
                removeClass([sortElements[1]], cls.SORT_SELECTED_CLASS);
            } else if (target.querySelector('.' + cls.SORT_DESCEND_ICON_CLASS) && !target.classList.contains(cls.SORT_SELECTED_CLASS)) {
                this.updateFilterMembers('Descending', fieldName);
                addClass([target], cls.SORT_SELECTED_CLASS);
                removeClass([sortElements[0]], cls.SORT_SELECTED_CLASS);
            } else {
                this.updateFilterMembers('None', fieldName);
                removeClass(sortElements, cls.SORT_SELECTED_CLASS);
            }
        }
    }

    private updateFilterMembers(order: string, fieldName: string): void {
        const fieldInfo: IField = this.parent.engineModule.fieldList[fieldName as string];
        let members: { [key: string]: Object; }[] = order === 'None' ?
            PivotUtil.getClonedData(fieldInfo.dateMember as []) :
            [...this.parent.currentTreeItems];
        const sortType: string | boolean = fieldInfo.isAlphanumeric ? true : undefined;
        let isHeaderSortByDefault: boolean = false;
        const membersInfo: string[] | number[] = fieldInfo && fieldInfo.membersOrder ?
            [...fieldInfo.membersOrder] as string[] | number[] : [];
        const sortDetails: HeadersSortEventArgs = {
            fieldName: fieldName,
            sortOrder: order as Sorting,
            members: membersInfo && membersInfo.length > 0 ? membersInfo : Object.keys(members),
            IsOrderChanged: false
        };
        if (membersInfo && membersInfo.length > 0) {
            members = PivotUtil.applyCustomSort(sortDetails, members, sortType) as { [key: string]: Object; }[];
        }
        else {
            const groupField: IGroupSettings[] = this.parent.dataSourceSettings.groupSettings.filter((field: IGroupSettings) => {
                return field.name === fieldName && field.type.toLocaleLowerCase() === 'number';
            });
            const isNumberGroupSorting: boolean = !isNullOrUndefined(groupField) && groupField.length > 0 ? true : false;
            members =
                PivotUtil.applyHeadersSort(members, sortDetails.sortOrder, sortType, isNumberGroupSorting) as { [key: string]: Object; }[];
            isHeaderSortByDefault = true;
        }
        const control: PivotView | PivotFieldList =
            this.parent.moduleName === 'pivotfieldlist' && (this.parent.control as PivotFieldList).isPopupView ?
                (this.parent.control as PivotFieldList).pivotGridModule : this.parent.control;

        if (isHeaderSortByDefault) {
            const copyOrder: string[] | number[] = [];
            for (let m: number = 0, n: number = 0; m < members.length; m++) {
                if (members[m as number].actualText !== 'Grand Total') {
                    copyOrder[n++] = members[m as number].actualText as string | number;
                }
            }
            sortDetails.members = copyOrder as string[];
        }
        control.trigger(events.onHeadersSort, sortDetails);
        if (sortDetails.IsOrderChanged) {
            members = PivotUtil.applyCustomSort(sortDetails, members, sortType, true) as { [key: string]: Object; }[];
        }
        this.parent.currentTreeItems = [];
        this.parent.searchTreeItems = [];
        const treeData: { [key: string]: Object; }[] = [];
        const modifiedFieldName: string = fieldName.replace(/[^a-zA-Z0-9 ]/g, '_');
        const engineModule: PivotEngine = this.parent.engineModule as PivotEngine;
        for (let i: number = 0, lnt: number = members.length; i < lnt; i++) {
            if (order === 'None') {
                const memberName: string = members[i as number].actualText.toString();
                const nodeAttr: { [key: string]: string } = { 'data-fieldName': fieldName, 'data-memberId': memberName };
                const obj: { [key: string]: Object } = {
                    id: modifiedFieldName + '_' + (i + 1),
                    htmlAttributes: nodeAttr,
                    actualText: members[i as number].actualText,
                    name: this.parent.isDateField ? members[i as number].formattedText :
                        engineModule.getFormattedValue(memberName as string, fieldName).formattedText,
                    isSelected: this.parent.currentTreeItemsPos[members[i as number].actualText as string].isSelected
                };
                this.parent.currentTreeItems.push(obj);
                if (this.editorSearch.value !== '') {
                    if ((obj.name as string).toLowerCase().indexOf(this.editorSearch.value.toLowerCase()) > -1) {
                        this.parent.searchTreeItems.push(obj);
                        treeData.push(obj);
                    }
                } else {
                    this.parent.searchTreeItems.push(obj);
                    treeData.push(obj);
                }
            } else {
                this.parent.currentTreeItems.push(members[i as number]);
                if (this.editorSearch.value !== '') {
                    if ((members[i as number].name as string).toLowerCase().indexOf(this.editorSearch.value.toLowerCase()) > -1) {
                        this.parent.searchTreeItems.push(members[i as number]);
                        treeData.push(members[i as number]);
                    }
                } else {
                    this.parent.searchTreeItems.push(members[i as number]);
                    treeData.push(members[i as number]);
                }
            }
            this.parent.currentTreeItemsPos[members[i as number].actualText as string].index = i;
        }
        const dataCount: number = (this.memberTreeView.fields.dataSource as []).length;
        this.memberTreeView.fields = { dataSource: treeData.slice(0, dataCount), id: 'id', text: 'name', isChecked: 'isSelected', parentID: 'pid' };
        this.memberTreeView.dataBind();
    }
    private updateChildNodes(args: NodeExpandEventArgs): void {
        if (this.parent.dataType === 'olap') {
            const engineModule: OlapEngine = this.parent.engineModule as OlapEngine;
            const fieldName: string = args.node.getAttribute('data-fieldname');
            const fieldList: IOlapField = engineModule.fieldList[fieldName as string];
            let filterItems: string[] = [];
            if (fieldList && fieldList.filterMembers.length > 0 && !this.isSearchEnabled &&
                !fieldList.members[args.nodeData.id as string].isNodeExpand) {
                let childNodes: IOlapField[] = [];
                for (const item of fieldList.filterMembers) {
                    if (item.pid === args.nodeData.id.toString()) {
                        childNodes.push(item);
                    }
                }
                if (childNodes.length === 0) {
                    fieldList.childMembers = [];
                    engineModule.getChildMembers(this.parent.dataSourceSettings, args.nodeData.id.toString(), fieldName);
                    childNodes = fieldList.childMembers;
                    fieldList.childMembers = [];
                }
                let treeData: { [key: string]: Object }[] = PivotUtil.getClonedData(childNodes as { [key: string]: Object }[]);
                const curTreeData: { [key: string]: Object }[] = (this.memberTreeView.fields.dataSource as { [key: string]: Object }[]);
                let isInclude: boolean = false;
                if (!isNullOrUndefined(this.filterObject)) {
                    isInclude = this.filterObject.type === 'Include' ? true : false;
                    filterItems = this.filterObject.items ? this.filterObject.items : [];
                }
                treeData = this.updateChildData(isInclude, treeData, filterItems, fieldName, args.nodeData);
                treeData = this.parent.eventBase.sortOlapFilterData(treeData, engineModule.fieldList[fieldName as string].sort);
                for (const node of treeData) {
                    curTreeData.push(node);
                }
                fieldList.members[args.nodeData.id as string].isNodeExpand = true;
                this.memberTreeView.addNodes(treeData, args.node);
            }
        }
    }
    private updateChildData(
        isInclude: boolean, members: { [key: string]: Object }[], filterItems: string[], fieldName: string,
        parentNode: { [key: string]: Object }): { [key: string]: Object }[] {
        let memberCount: number = Object.keys(this.parent.currentTreeItemsPos).length;
        const fieldList: IOlapField = this.parent.engineModule.fieldList[fieldName as string];
        const list: { [key: string]: Object }[] = [];
        let childMemberCount: number = 1;
        for (const member of members) {
            const obj: { [key: string]: Object } = member;
            const memberName: string = member.id.toString();
            fieldList.members[memberName as string].isNodeExpand = false;
            member.isSelected = (parentNode.isChecked === 'true');
            if (childMemberCount <= this.parent.control.maxNodeLimitInMemberEditor) {
                list.push(obj);
            }
            this.parent.currentTreeItems.push(obj);
            this.parent.searchTreeItems.push(obj);
            this.parent.currentTreeItemsPos[memberName as string] = { index: memberCount, isSelected: obj.isSelected as boolean };
            memberCount++;
            childMemberCount++;
        }
        this.parent.isDataOverflow = false;
        return list;
    }
    private createTabMenu(treeData: { [key: string]: Object }[], fieldCaption: string, fieldName: string): void {
        const wrapper: HTMLElement = createElement('div', {
            id: this.parent.parentID + '_FilterTabContainer',
            className: cls.PIVOT_FILTER_TAB_CONTAINER,
            attrs: {
                'tabindex': '-1'
            }
        });
        this.dialogPopUp.content = wrapper;
        this.dialogPopUp.dataBind();
        const types: FilterType[] = ['Label', 'Value', 'Include', 'Exclude'];
        const regx: string = '((-|\\+)?[0-9]+(\\.[0-9]+)?)+';
        const member: string = Object.keys(this.parent.engineModule.fieldList[fieldName as string].members)[0];
        const fieldType: string = this.parent.engineModule.fieldList[fieldName as string].type;
        const formatObj: IFormatSettings =
            PivotUtil.getFieldByName(fieldName, this.parent.dataSourceSettings.formatSettings) as IFormatSettings;
        const items: TabItemModel[] = [
            {
                header: {
                    text: this.parent.localeObj.getConstant('member'),
                    iconCss: (this.filterObject && types.indexOf(this.filterObject.type) > 1 ? cls.SELECTED_OPTION_ICON_CLASS : '')
                },
                content: this.createTreeView(treeData, fieldCaption, fieldName)
            }
        ];
        for (const type of types) {
            if (((type === 'Label') && this.parent.dataSourceSettings.allowLabelFilter) ||
                (type === 'Value' && this.parent.dataSourceSettings.allowValueFilter)) {
                const filterType: FilterType = (type === 'Label' && member && ((member).match(regx) &&
                    (member).match(regx)[0].length === (member).length) && fieldType === 'number') ? 'Number' :
                    (type === 'Label' && member && (new Date(member).toString() !== 'Invalid Date') &&
                        ((formatObj && formatObj.type) || (this.filterObject && this.filterObject.type === 'Date'))) ? 'Date' : type;
                const item: TabItemModel = {
                    header: {
                        text: (filterType === 'Number' ? this.parent.localeObj.getConstant('label') :
                            this.parent.localeObj.getConstant(filterType.toLowerCase())),
                        iconCss: (this.filterObject && this.filterObject.type === filterType ? cls.SELECTED_OPTION_ICON_CLASS : '')
                    },
                    content: this.createCustomFilter(
                        fieldName, (this.filterObject && this.filterObject.type === filterType ? this.filterObject :
                            undefined), filterType.toLowerCase())
                };
                items.push(item);
            }
        }
        let selectedIndex: number =
            (this.filterObject ? ((['Label', 'Date', 'Number'] as FilterType[]).indexOf(this.filterObject.type) >= 0) ?
                1 : this.filterObject.type === 'Value' ?
                    (this.parent.dataSourceSettings.allowLabelFilter && this.parent.dataSourceSettings.allowValueFilter) ? 2 : 1 : 0 : 0);
        selectedIndex = (!this.parent.dataSourceSettings.allowMemberFilter && selectedIndex === 0) ? 1 : selectedIndex;
        this.tabObj = new Tab({
            heightAdjustMode: 'Auto',
            items: items,
            height: '100%',
            selectedItem: selectedIndex,
            enableRtl: this.parent.enableRtl,
            enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
            cssClass: this.parent.cssClass
        });
        this.tabObj.isStringTemplate = true;
        this.tabObj.appendTo(wrapper);
        if (!this.parent.dataSourceSettings.allowMemberFilter) {
            this.tabObj.hideTab(0);
        }
        if (selectedIndex > 0) {
            addClass([this.dialogPopUp.element.querySelector('.e-filter-div-content' + '.' + (selectedIndex === 1 && this.parent.dataSourceSettings.allowLabelFilter ? 'e-label-filter' : 'e-value-filter'))], 'e-selected-tab');
        }

    }
    private createCustomFilter(fieldName: string, filterObject: IFilter, type: string): HTMLElement {
        const dataSource: { [key: string]: Object }[] = [];
        const valueOptions: { [key: string]: Object }[] = [];
        const levelOptions: { [key: string]: Object }[] = [];
        const measures: IFieldOptions[] = this.parent.dataSourceSettings.values;
        let selectedOption: string = 'DoesNotEquals';
        let selectedValueIndex: number = 0;
        let selectedLevelIndex: number = 0;
        const options: { label: string[], value: string[], date: string[] } = {
            label: ['Equals', 'DoesNotEquals', 'BeginWith', 'DoesNotBeginWith', 'EndsWith',
                'DoesNotEndsWith', 'Contains', 'DoesNotContains', 'GreaterThan',
                'GreaterThanOrEqualTo', 'LessThan', 'LessThanOrEqualTo', 'Between', 'NotBetween'],
            date: ['Equals', 'DoesNotEquals', 'Before', 'BeforeOrEqualTo', 'After', 'AfterOrEqualTo',
                'Between', 'NotBetween'],
            value: ['Equals', 'DoesNotEquals', 'GreaterThan', 'GreaterThanOrEqualTo', 'LessThan',
                'LessThanOrEqualTo', 'Between', 'NotBetween', 'Top', 'Bottom']
        };
        const betweenOperators: Operators[] = ['Between', 'NotBetween'];
        const topBottomOperators: string[] = ['Top', 'Bottom'];
        const operatorCollection: string[] = (type === 'label' ? options.label : type === 'date' ? options.date : options.value);
        for (const operator of operatorCollection) {
            selectedOption = ((filterObject && operator === filterObject.condition) ?
                operatorCollection.indexOf(filterObject.condition) >= 0 ?
                    filterObject.condition : operatorCollection[0] : selectedOption);
            if (!(type === 'value' && this.parent.dataSourceSettings.mode === 'Server' &&
                (operator === 'Top' || operator === 'Bottom'))) {
                dataSource.push({ value: operator, text: this.parent.localeObj.getConstant(operator) });
            }
        }
        // When the same field is added multiple times to the values axis, key the
        // measure option by instance id so the filter targets the selected
        // instance; the engine resolves instance ids first.
        const hasDuplicateValues: boolean = this.parent.dataSourceSettings.values.filter((value: IFieldOptions) =>
            value.name === measures[0 as number].name).length > 1;
        const getMeasureKey: (value: IFieldOptions) => string = (value: IFieldOptions): string => hasDuplicateValues ?
            (value.instanceId || value.name) : value.name;
        let len: number = measures.length;
        while (len--) {
            valueOptions.unshift({ value: getMeasureKey(measures[len as number]), text: (measures[len as number].caption ?
                measures[len as number].caption : measures[len as number].name) });
            selectedValueIndex = filterObject && filterObject.type === 'Value' &&
                filterObject.measure === getMeasureKey(measures[len as number]) &&
                filterObject.condition === selectedOption ? len : selectedValueIndex;
        }
        if (this.parent.dataType === 'olap') {
            const engineModule: OlapEngine = this.parent.engineModule as OlapEngine;
            const levels: IOlapField[] = engineModule.fieldList[fieldName as string].levels;
            if ((this.parent.engineModule as OlapEngine).fieldList[fieldName as string].isHierarchy) {
                let levelObj: IOlapField;
                const fieldlistData: IOlapField[] = (this.parent.engineModule as OlapEngine).fieldListData;
                for (const item of fieldlistData) {
                    if (item && item.pid === fieldName) {
                        levelObj = item;
                        break;
                    }
                }
                levelOptions.push({
                    value: levelObj ? levelObj.id : fieldName,
                    text: levelObj ? levelObj.caption : engineModule.fieldList[fieldName as string].name
                });
                selectedLevelIndex = 0;
                if (filterObject && filterObject.name === fieldName && filterObject.type.toLowerCase() === type) {
                    levelOptions[levelOptions.length - 1]['iconClass'] = cls.ICON + ' ' + cls.SELECTED_LEVEL_ICON_CLASS;
                }
            } else {
                for (let i: number = 0, cnt: number = levels.length; i < cnt; i++) {
                    selectedLevelIndex = (filterObject &&
                        filterObject.selectedField === levels[i as number].id ? i : selectedLevelIndex);
                    levelOptions.push({ value: levels[i as number].id, text: levels[i as number].name });
                    for (const field of this.parent.dataSourceSettings.filterSettings) {
                        if (field.name === fieldName && field.selectedField === levels[i as number].id &&
                            field.type.toLowerCase() === type) {
                            levelOptions[levelOptions.length - 1]['iconClass'] = cls.ICON + ' ' + cls.SELECTED_LEVEL_ICON_CLASS;
                            break;
                        }
                    }
                }
            }
        }
        const isTopBottom: boolean = type === 'value' && topBottomOperators.indexOf(selectedOption) >= 0;
        const mainDiv: HTMLElement = createElement('div', {
            className: cls.FILTER_DIV_CONTENT_CLASS + ' e-' + ((['date', 'number']).indexOf(type) >= 0 ? 'label' : type) + '-filter' + (this.parent.isDataOverflow ? ' ' + cls.PIVOT_FILTER_MEMBER_LIMIT : ''),
            id: this.parent.parentID + '_' + type + '_filter_div_content',
            attrs: {
                'data-type': type, 'data-fieldName': fieldName, 'data-operator': selectedOption,
                'data-selectedField': (this.parent.dataType === 'olap' &&
                    levelOptions.length > 0 ? levelOptions[selectedLevelIndex as number].value.toString() : ''),
                'data-measure': (this.parent.dataSourceSettings.values.length > 0 ?
                    getMeasureKey(this.parent.dataSourceSettings.values[selectedValueIndex as number]) : ''),
                'data-value1': (filterObject && selectedOption === filterObject.condition ?
                    filterObject.value1 ? filterObject.value1.toString() : '' : ''),
                'data-value2': (filterObject && selectedOption === filterObject.condition ?
                    filterObject.value2 ? filterObject.value2.toString() : '' : ''),
                'data-mode': (type === 'value' && filterObject && selectedOption === filterObject.condition &&
                    topBottomOperators.indexOf(selectedOption) >= 0 && filterObject.mode) ? filterObject.mode : 'Items'
            }
        });
        const textContentdiv: HTMLElement = createElement('div', {
            className: cls.FILTER_TEXT_DIV_CLASS
        });
        textContentdiv.innerText = this.parent.localeObj.getConstant(type + 'TextContent');
        const betweenTextContentdiv: HTMLElement = createElement('div', {
            className: cls.BETWEEN_TEXT_DIV_CLASS + ' ' +
                (betweenOperators.indexOf(selectedOption as Operators) === -1 ? cls.ICON_DISABLE : '')
        });
        betweenTextContentdiv.innerText = this.parent.localeObj.getConstant('And');
        const separatordiv: HTMLElement = createElement('div', { className: cls.SEPARATOR_DIV_CLASS });
        const filterWrapperDiv1: HTMLElement = createElement('div', { className: cls.FILTER_OPTION_WRAPPER_1_CLASS });
        const levelWrapperDiv: HTMLElement = createElement('div', {
            className: 'e-level-option-container' + ' ' +
                (this.parent.dataType === 'olap' ? '' : cls.ICON_DISABLE)
        });
        const optionWrapperDiv1: HTMLElement = createElement('div', {
            className: 'e-measure-option-container' + ' ' + (((['label', 'date', 'number']).indexOf(type) >= 0) ? cls.ICON_DISABLE : '')
        });
        const optionWrapperDiv2: HTMLElement = createElement('div', { className: 'e-condition-option-container' });
        const optionWrapperDiv3: HTMLElement = createElement('div', {
            className: 'e-mode-option-container' + ' ' + (!isTopBottom ? cls.ICON_DISABLE : '')
        });
        const filterWrapperDiv2: HTMLElement = createElement('div', { className: cls.FILTER_OPTION_WRAPPER_2_CLASS });
        const levelDropOption: HTMLElement = createElement('div', { id: this.parent.parentID + '_' + type + '_level_option_container' });
        const dropOptionDiv1: HTMLElement = createElement('div', { id: this.parent.parentID + '_' + type + '_measure_option_container' });
        const dropOptionDiv2: HTMLElement = createElement('div', { id: this.parent.parentID + '_' + type + '_contition_option_container' });
        const dropOptionDiv3: HTMLElement = createElement('div', { id: this.parent.parentID + '_' + type + '_mode_option_container' });
        const inputDiv1: HTMLElement = createElement('div', { className: cls.FILTER_INPUT_DIV_1_CLASS });
        const inputDiv2: HTMLElement = createElement('div', {
            className: cls.FILTER_INPUT_DIV_2_CLASS + ' ' +
                (betweenOperators.indexOf(selectedOption as Operators) === -1 ? cls.ICON_DISABLE : '')
        });
        const inputField1: HTMLInputElement = createElement('input', {
            id: this.parent.parentID + '_' + type + '_input_option_1', attrs: { 'type': 'text' }
        }) as HTMLInputElement;
        const inputField2: HTMLInputElement = createElement('input', {
            id: this.parent.parentID + '_' + type + '_input_option_2', attrs: { 'type': 'text' }
        }) as HTMLInputElement;
        inputDiv1.appendChild(inputField1);
        inputDiv2.appendChild(inputField2);
        levelWrapperDiv.appendChild(levelDropOption);
        levelWrapperDiv.appendChild(separatordiv.cloneNode(true));
        optionWrapperDiv1.appendChild(dropOptionDiv1);
        optionWrapperDiv1.appendChild(separatordiv);
        optionWrapperDiv2.appendChild(dropOptionDiv2);
        const conditionSeparatorDiv: HTMLElement = separatordiv.cloneNode(true) as HTMLElement;
        conditionSeparatorDiv.style.display = isTopBottom ? '' : 'none';
        optionWrapperDiv2.appendChild(conditionSeparatorDiv);
        optionWrapperDiv3.appendChild(dropOptionDiv3);
        filterWrapperDiv1.appendChild(levelWrapperDiv);
        filterWrapperDiv1.appendChild(optionWrapperDiv1);
        filterWrapperDiv1.appendChild(optionWrapperDiv2);
        filterWrapperDiv1.appendChild(optionWrapperDiv3);
        filterWrapperDiv2.appendChild(inputDiv1);
        filterWrapperDiv2.appendChild(betweenTextContentdiv);
        filterWrapperDiv2.appendChild(inputDiv2);
        this.createElements(
            filterObject, betweenOperators, topBottomOperators, dropOptionDiv1, dropOptionDiv2, dropOptionDiv3, inputField1, inputField2,
            valueOptions, dataSource, selectedValueIndex, selectedOption, type, levelDropOption, levelOptions, selectedLevelIndex);
        mainDiv.appendChild(textContentdiv);
        mainDiv.appendChild(filterWrapperDiv1);
        mainDiv.appendChild(filterWrapperDiv2);
        return mainDiv;
    }
    private createElements(
        filterObj: IFilter, operators: Operators[], topBottomOps: string[], optionDiv1: HTMLElement,
        optionDiv2: HTMLElement, optionDiv3: HTMLElement, inputDiv1: HTMLInputElement, inputDiv2: HTMLInputElement,
        vDataSource: { [key: string]: Object }[],
        oDataSource: { [key: string]: Object }[], valueIndex: number, option: string, type: string, levelDropOption: HTMLElement,
        lDataSource: { [key: string]: Object }[], levelIndex: number): void {
        const popupInstance: FilterDialog = this as FilterDialog;
        if (this.parent.dataType === 'olap') {
            const levelWrapper: DropDownList = new DropDownList({
                dataSource: lDataSource, enableRtl: this.parent.enableRtl,
                fields: { value: 'value', text: 'text', iconCss: 'iconClass' },
                index: levelIndex,
                cssClass: cls.LEVEL_OPTIONS_CLASS + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''), width: '100%',
                change: (args: ChangeEventArgs) => {
                    const element: Element = popupInstance.dialogPopUp.element.querySelector('.e-selected-tab');
                    const fieldName: string = element.getAttribute('data-fieldName');
                    const type: string = element.getAttribute('data-type');
                    if (!isNullOrUndefined(element)) {
                        popupInstance.updateInputValues(element, type, inputDiv1, inputDiv2);
                        setStyleAndAttributes(element, { 'data-selectedField': args.value });
                        let filterObj: IFilter;
                        for (const field of popupInstance.parent.dataSourceSettings.filterSettings) {
                            if (field.name === fieldName && field.selectedField === args.value) {
                                filterObj = field;
                                break;
                            }
                        }
                        if (filterObj) {
                            if (type === 'value' && filterObj.measure && filterObj.measure !== '') {
                                optionWrapper1.value = filterObj.measure ? filterObj.measure : vDataSource[0].value as string;
                            }
                            if (filterObj.condition) {
                                optionWrapper.value = filterObj.condition ? filterObj.condition : 'DoesNotEquals';
                            } else {
                                optionWrapper.value = 'DoesNotEquals';
                            }
                            let inputObj1: MaskedTextBox | NumericTextBox;
                            let inputObj2: MaskedTextBox | NumericTextBox;
                            if (type === 'value') {
                                inputObj1 = getInstance(<HTMLElement>inputDiv1 as HTMLInputElement, NumericTextBox) as NumericTextBox;
                                inputObj2 = getInstance(<HTMLElement>inputDiv2 as HTMLInputElement, NumericTextBox) as NumericTextBox;
                                if (inputObj1) {
                                    inputObj1.value = filterObj.value1 ? parseInt(filterObj.value1 as string, 10) : undefined;
                                }
                                if (inputObj2) {
                                    inputObj2.value = filterObj.value2 ? parseInt(filterObj.value2 as string, 10) : undefined;
                                }
                            } else {
                                inputObj1 = getInstance(<HTMLElement>inputDiv1 as HTMLInputElement, MaskedTextBox) as MaskedTextBox;
                                inputObj2 = getInstance(<HTMLElement>inputDiv2 as HTMLInputElement, MaskedTextBox) as MaskedTextBox;
                                if (inputObj1) {
                                    inputObj1.value = filterObj.value1 ? filterObj.value1 as string : '';
                                }
                                if (inputObj2) {
                                    inputObj2.value = filterObj.value2 ? filterObj.value2 as string : '';
                                }
                            }
                        }
                        popupInstance.updateInputValues(element, type, inputDiv1, inputDiv2);
                    } else {
                        return;
                    }
                }
            });
            levelWrapper.isStringTemplate = true;
            levelWrapper.isAngular = this.parent.control.isModalDialog;
            levelWrapper.appendTo(levelDropOption);
        }
        const optionWrapper1: DropDownList = new DropDownList({
            dataSource: vDataSource, enableRtl: this.parent.enableRtl,
            fields: { value: 'value', text: 'text' }, index: valueIndex,
            cssClass: cls.VALUE_OPTIONS_CLASS + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''), width: '100%',
            change: (args: ChangeEventArgs) => {
                const element: Element = popupInstance.dialogPopUp.element.querySelector('.e-selected-tab');
                if (!isNullOrUndefined(element)) {
                    popupInstance.updateInputValues(element, type, inputDiv1, inputDiv2);
                    setStyleAndAttributes(element, { 'data-measure': args.value });
                } else {
                    return;
                }
            }
        });
        optionWrapper1.isStringTemplate = true;
        optionWrapper1.isAngular = this.parent.control.isModalDialog;
        optionWrapper1.appendTo(optionDiv1);
        const optionWrapper: DropDownList = new DropDownList({
            dataSource: oDataSource, enableRtl: this.parent.enableRtl,
            fields: { value: 'value', text: 'text' }, value: option,
            cssClass: cls.FILTER_OPERATOR_CLASS + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''), width: '100%',
            change: (args: ChangeEventArgs) => {
                const element: Element = popupInstance.dialogPopUp.element.querySelector('.e-selected-tab');
                if (!isNullOrUndefined(element)) {
                    popupInstance.updateInputValues(element, type, inputDiv1, inputDiv2);
                    const disabledClasses: string[] = [cls.BETWEEN_TEXT_DIV_CLASS, cls.FILTER_INPUT_DIV_2_CLASS];
                    for (const className of disabledClasses) {
                        const shouldShow: boolean = (operators.indexOf(args.value as Operators) >= 0) &&
                            (topBottomOps.indexOf(args.value as string) === -1);
                        if (shouldShow) {
                            removeClass([element.querySelector('.' + className)], cls.ICON_DISABLE);
                        } else {
                            addClass([element.querySelector('.' + className)], cls.ICON_DISABLE);
                        }
                    }
                    if (type === 'value') {
                        updateModeDropDown(element, args.value as string);
                        if (topBottomOps.indexOf(args.value as string) >= 0) {
                            const firstInputObj: NumericTextBox = getInstance(
                                <HTMLElement>inputDiv1 as HTMLInputElement,
                                NumericTextBox
                            ) as NumericTextBox;
                            if (firstInputObj) {
                                if (!filterObj || filterObj.condition !== args.value) {
                                    if (isNullOrUndefined(firstInputObj.value)) {
                                        firstInputObj.value = 10;
                                        setStyleAndAttributes(element, { 'data-value1': '10', 'data-value2': '10' });
                                    }
                                }
                                popupInstance.validateTopBottomOKButton(inputDiv1, args.value as string, topBottomOps);
                            }
                        } else {
                            const filterDialog: Element = popupInstance.dialogPopUp.element;
                            const okButton: Element = filterDialog.querySelector('.' + cls.OK_BUTTON_CLASS);
                            if (okButton) {
                                okButton.removeAttribute('disabled');
                            }
                        }
                    }
                    setStyleAndAttributes(element, { 'data-operator': args.value as Operators });
                } else {
                    return;
                }
            }
        });
        optionWrapper.isStringTemplate = true;
        optionWrapper.isAngular = this.parent.control.isModalDialog;
        optionWrapper.appendTo(optionDiv2);
        // Mode drop-down (Items, Percent, Sum) - enabled only for the Top and Bottom operators (FR-015).
        // The mode chosen earlier is remembered while the dialog is open, even when the operator
        // changes to a non-Top/Bottom operator and the drop-down shows Items disabled (BR-19).
        const initialMode: TopBottomMode = (type === 'value' && filterObj && topBottomOps.indexOf(filterObj.condition as string) >= 0 &&
            filterObj.mode) ? filterObj.mode : 'Items';
        const rememberedMode: { value: TopBottomMode } = { value: initialMode };
        const modeDataSource: { [key: string]: Object }[] = [];
        for (const modeOption of (['Items', 'Percent', 'Sum'] as TopBottomMode[])) {
            modeDataSource.push({ value: modeOption, text: this.parent.localeObj.getConstant(modeOption) });
        }
        const updateModeDropDown: Function = (element: Element, operator: string): void => {
            const isTopBottom: boolean = topBottomOps.indexOf(operator) >= 0;
            const separator: HTMLElement = element.querySelector(
                '.e-condition-option-container .' + cls.SEPARATOR_DIV_CLASS) as HTMLElement;
            if (separator) {
                separator.style.display = isTopBottom ? '' : 'none';
            }
            const modeWrapper: HTMLElement = element.querySelector('.' + cls.FILTER_MODE_CLASS) ?
                element.querySelector('.' + cls.FILTER_MODE_CLASS).parentElement : null;
            if (modeWrapper) {
                if (isTopBottom) {
                    removeClass([modeWrapper], cls.ICON_DISABLE);
                    optionWrapper2.value = rememberedMode.value;
                    optionWrapper2.enabled = true;
                } else {
                    addClass([modeWrapper], cls.ICON_DISABLE);
                    optionWrapper2.value = 'Items';
                    optionWrapper2.enabled = false;
                }
            }
        };
        const optionWrapper2: DropDownList = new DropDownList({
            dataSource: modeDataSource, enableRtl: this.parent.enableRtl,
            fields: { text: 'text', value: 'value' }, placeholder: 'Items',
            value: (topBottomOps.indexOf(option) >= 0 ? initialMode : 'Items'),
            enabled: (topBottomOps.indexOf(option) >= 0), cssClass: cls.FILTER_MODE_CLASS,
            change: (args: ChangeEventArgs) => {
                const element: Element = popupInstance.dialogPopUp.element.querySelector('.e-selected-tab');
                if (!isNullOrUndefined(element)) {
                    rememberedMode.value = args.value as TopBottomMode;
                    if (topBottomOps.indexOf(element.getAttribute('data-operator') as string) >= 0) {
                        setStyleAndAttributes(element, { 'data-mode': rememberedMode.value });
                        popupInstance.validateTopBottomOKButton(inputDiv1, element.getAttribute('data-operator'), topBottomOps);
                    }
                }
            }
        });
        optionWrapper2.isStringTemplate = true;
        optionWrapper2.isAngular = this.parent.control.isModalDialog;
        optionWrapper2.appendTo(optionDiv3);
        const modeInputElement: HTMLInputElement = optionDiv3.querySelector('input') as HTMLInputElement;
        if (modeInputElement) {
            modeInputElement.setAttribute('aria-label', this.parent.localeObj.getConstant('topBottomMode'));
            modeInputElement.setAttribute('title', this.parent.localeObj.getConstant('topBottomMode'));
        }
        if (type === 'date') {
            const inputObj1: DateTimePicker = new DateTimePicker({
                placeholder: this.parent.localeObj.getConstant('chooseDate'),
                enableRtl: this.parent.enableRtl,
                format: 'dd/MM/yyyy hh:mm:ss a',
                showClearButton: true,
                value: (filterObj && option === filterObj.condition ?
                    (typeof (filterObj.value1) === 'string' ? new Date(filterObj.value1) : filterObj.value1) : null),
                change: (e: ChangedEventArgs) => {
                    const element: Element = popupInstance.dialogPopUp.element.querySelector('.e-selected-tab');
                    if (!isNullOrUndefined(element)) {
                        setStyleAndAttributes(element, { 'data-value1': e.value, 'data-value2': inputObj2.value });
                    } else {
                        return;
                    }
                },
                width: '100%',
                cssClass: this.parent.cssClass
            });
            const inputObj2: DateTimePicker = new DateTimePicker({
                placeholder: this.parent.localeObj.getConstant('chooseDate'),
                enableRtl: this.parent.enableRtl,
                format: 'dd/MM/yyyy hh:mm:ss a',
                showClearButton: true,
                value: (filterObj && option === filterObj.condition ?
                    (typeof (filterObj.value2) === 'string' ? new Date(filterObj.value2) : filterObj.value2) : null),
                change: (e: ChangedEventArgs) => {
                    const element: Element = popupInstance.dialogPopUp.element.querySelector('.e-selected-tab');
                    if (!isNullOrUndefined(element)) {
                        setStyleAndAttributes(element, { 'data-value1': inputObj1.value, 'data-value2': e.value });
                    } else {
                        return;
                    }
                },
                width: '100%',
                cssClass: this.parent.cssClass
            });
            inputObj1.isStringTemplate = true;
            inputObj1.appendTo(inputDiv1);
            inputObj2.isStringTemplate = true;
            inputObj2.appendTo(inputDiv2);
        } else if (type === 'value') {
            const isTopBottomFilter: boolean = topBottomOps.indexOf(option as string) >= 0;
            const defaultValue: number = isTopBottomFilter && (!filterObj || filterObj.condition !== option) ? 10 :
                (filterObj && option === filterObj.condition ? parseInt(filterObj.value1 as string, 10) : undefined);
            const inputObj1: NumericTextBox = new NumericTextBox({
                placeholder: this.parent.localeObj.getConstant('enterValue'),
                enableRtl: this.parent.enableRtl,
                showClearButton: true,
                format: '###.##',
                step: isTopBottomFilter ? 1 : undefined,
                value: defaultValue,
                change: (e: NumericChangeEventArgs) => {
                    const element: Element = popupInstance.dialogPopUp.element.querySelector('.e-selected-tab');
                    const filterDialog: Element = popupInstance.dialogPopUp.element;
                    const currentOperator: string = element.getAttribute('data-operator');
                    const okButton: Element = filterDialog.querySelector('.' + cls.OK_BUTTON_CLASS);
                    if (!isNullOrUndefined(element)) {
                        const value1: string = (inputObj1.value !== null && inputObj1.value !== undefined) ? inputObj1.value.toString() : '0';
                        const actualValue: number = e.value !== null && e.value !== undefined ? e.value : 0;
                        const value2: string = actualValue.toString();
                        setStyleAndAttributes(element, {
                            'data-value1': value1,
                            'data-value2': value2
                        });
                        if (topBottomOps.indexOf(currentOperator as string) >= 0) {
                            popupInstance.validateTopBottomOKButton(inputDiv1, currentOperator, topBottomOps);
                        }
                    } else {
                        return;
                    }
                },
                width: '100%',
                cssClass: this.parent.cssClass
            });
            const inputObj2: NumericTextBox = new NumericTextBox({
                placeholder: this.parent.localeObj.getConstant('enterValue'),
                enableRtl: this.parent.enableRtl,
                showClearButton: true,
                format: '###.##',
                value: (filterObj && option === filterObj.condition ? parseInt(filterObj.value2 as string, 10) : undefined),
                change: (e: NumericChangeEventArgs) => {
                    const element: Element = popupInstance.dialogPopUp.element.querySelector('.e-selected-tab');
                    if (!isNullOrUndefined(element)) {
                        setStyleAndAttributes(element, {
                            'data-value1': (inputObj1.value ? inputObj1.value.toString() : '0'),
                            'data-value2': (e.value ? e.value.toString() : '0')
                        });
                    } else {
                        return;
                    }
                },
                width: '100%',
                cssClass: this.parent.cssClass
            });
            inputObj1.isStringTemplate = true;
            inputObj1.appendTo(inputDiv1);
            inputObj2.isStringTemplate = true;
            inputObj2.appendTo(inputDiv2);
            setTimeout(() => {
                popupInstance.validateTopBottomOKButton(inputDiv1, option, topBottomOps);
            }, 0);
        } else {
            const inputObj1: MaskedTextBox = new MaskedTextBox({
                placeholder: this.parent.localeObj.getConstant('enterValue'),
                enableRtl: this.parent.enableRtl,
                showClearButton: true,
                value: (filterObj && option === filterObj.condition ? filterObj.value1 as string : ''),
                change: (e: MaskChangeEventArgs) => {
                    const element: Element = popupInstance.dialogPopUp.element.querySelector('.e-selected-tab');
                    if (!isNullOrUndefined(element)) {
                        setStyleAndAttributes(element, { 'data-value1': e.value, 'data-value2': inputObj2.value });
                    } else {
                        return;
                    }
                },
                width: '100%',
                cssClass: this.parent.cssClass
            });
            const inputObj2: MaskedTextBox = new MaskedTextBox({
                placeholder: this.parent.localeObj.getConstant('enterValue'),
                enableRtl: this.parent.enableRtl,
                showClearButton: true,
                value: (filterObj && option === filterObj.condition ? filterObj.value2 as string : ''),
                change: (e: MaskChangeEventArgs) => {
                    const element: Element = popupInstance.dialogPopUp.element.querySelector('.e-selected-tab');
                    if (!isNullOrUndefined(element)) {
                        setStyleAndAttributes(element, { 'data-value1': inputObj1.value, 'data-value2': e.value });
                    } else {
                        return;
                    }
                },
                width: '100%',
                cssClass: this.parent.cssClass
            });
            inputObj1.isStringTemplate = true;
            inputObj1.appendTo(inputDiv1);
            inputObj2.isStringTemplate = true;
            inputObj2.appendTo(inputDiv2);
        }
    }
    private updateInputValues(element: Element, type: string, inputDiv1: HTMLInputElement, inputDiv2: HTMLInputElement): void {
        const inputObj1: NumericTextBox | MaskedTextBox | DateTimePicker = getInstance(
            <HTMLElement>inputDiv1 as HTMLInputElement,
            type === 'date' ? DateTimePicker : type === 'value' ? NumericTextBox : MaskedTextBox
        ) as NumericTextBox | MaskedTextBox | DateTimePicker;
        const inputObj2: NumericTextBox | MaskedTextBox | DateTimePicker = getInstance(
            <HTMLElement>inputDiv2 as HTMLInputElement,
            type === 'date' ? DateTimePicker : type === 'value' ? NumericTextBox : MaskedTextBox
        ) as NumericTextBox | MaskedTextBox | DateTimePicker;
        const value1: string = !isNullOrUndefined(inputObj1.value) ? inputObj1.value.toString() : '';
        const value2: string = !isNullOrUndefined(inputObj2.value) ? inputObj2.value.toString() : '';
        setStyleAndAttributes(element, { 'data-value1': value1, 'data-value2': value2 });
    }
    private validateTreeNode(e: NodeCheckEventArgs): void {
        if (e.node.classList.contains(cls.ICON_DISABLE)) {
            e.cancel = true;
        } else {
            return;
        }
    }

    /**
     * Update filter state while Member check/uncheck.
     *
     * @returns {void}
     * @hidden
     */
    public updateCheckedState(): void {
        const filterDialog: Element = this.dialogPopUp.element;
        const list: HTMLElement[] = [].slice.call(this.memberTreeView.element.querySelectorAll('li')) as HTMLElement[];
        const fieldName: string = filterDialog.getAttribute('data-fieldname');
        const uncheckedNodes: number = this.getUnCheckedNodes(fieldName);
        const checkedNodes: number = this.getCheckedNodes(fieldName);
        const firstNode: Element =
            this.allMemberSelect.element.querySelector('li').querySelector('span.' + cls.CHECK_BOX_FRAME_CLASS);
        if (list.length > 0) {
            if (checkedNodes > 0) {
                if (uncheckedNodes > 0) {
                    removeClass([firstNode], cls.NODE_CHECK_CLASS);
                    addClass([firstNode], cls.NODE_STOP_CLASS);
                    const checkBoxNodes: Element = this.allMemberSelect.element.querySelector('li');
                    checkBoxNodes.setAttribute('aria-checked', 'false');
                } else if (uncheckedNodes === 0) {
                    removeClass([firstNode], cls.NODE_STOP_CLASS);
                    addClass([firstNode], cls.NODE_CHECK_CLASS);
                }
                this.setOKButtonState(true);
            } else if (uncheckedNodes > 0 && checkedNodes === 0) {
                removeClass([firstNode], [cls.NODE_CHECK_CLASS, cls.NODE_STOP_CLASS]);
                if (this.getCheckedNodes(fieldName) === checkedNodes) {
                    this.setOKButtonState(false);
                }
            }
        } else {
            this.setOKButtonState(false);
        }
    }
    private getCheckedNodes(fieldName: string): number {
        const engineModule: OlapEngine = this.parent.engineModule as OlapEngine;
        let nodeList: string[] = [];
        const checkeNodes: { [key: string]: object }[] = [];
        if (this.parent.dataType === 'olap' && engineModule &&
            !engineModule.fieldList[fieldName as string].isHierarchy) {
            nodeList = this.memberTreeView.getAllCheckedNodes();
            return nodeList.length;
        } else {
            for (const item of this.parent.searchTreeItems) {
                if (item.isSelected) {
                    checkeNodes.push(item);
                }
            }
            return checkeNodes.length;
        }
    }
    private getUnCheckedNodes(fieldName: string): number {
        const unCheckeNodes: { [key: string]: object }[] = [];
        let nodeList: string[] = [];
        const engineModule: OlapEngine = this.parent.engineModule as OlapEngine;
        if (this.parent.dataType === 'olap' && engineModule && !engineModule.fieldList[fieldName as string].isHierarchy) {
            nodeList = this.memberTreeView.getAllCheckedNodes();
            return ((this.memberTreeView.fields.dataSource as { [key: string]: object }[]).length - nodeList.length);
        } else {
            // unCheckeNodes = this.parent.searchTreeItems.filter((item: { [key: string]: object }) => {
            //     return !item.isSelected;
            // });
            for (const item of this.parent.searchTreeItems) {
                if (!item.isSelected) {
                    unCheckeNodes.push(item);
                }
            }
            return unCheckeNodes.length;
        }
    }
    private isExcelFilter(fieldName: string): boolean {
        let isFilterField: boolean = false;
        for (const field of this.parent.dataSourceSettings.filters) {
            if (field.name === fieldName) {
                isFilterField = true;
                break;
            }
        }
        if (!isFilterField && (this.parent.dataSourceSettings.allowLabelFilter || this.parent.dataSourceSettings.allowValueFilter)) {
            return true;
        } else {
            return false;
        }
    }

    private setOKButtonState(enabled: boolean): void {
        const filterDialog: Element = this.dialogPopUp.element;
        const okButton: Element = filterDialog.querySelector('.' + cls.OK_BUTTON_CLASS);
        if (okButton) {
            if (enabled) {
                okButton.removeAttribute('disabled');
            } else {
                okButton.setAttribute('disabled', 'disabled');
            }
        }
        if (this.dialogPopUp.buttons && this.dialogPopUp.buttons[0]) {
            this.dialogPopUp.buttons[0].buttonModel.disabled = !enabled;
        }
    }

    private validateTopBottomOKButton(inputDiv: HTMLElement, operator: string, topBottomOps: string[]): void {
        if (topBottomOps.indexOf(operator as string) >= 0) {
            const inputObj: NumericTextBox = getInstance(inputDiv as HTMLInputElement, NumericTextBox) as NumericTextBox;
            const filterDialog: Element = this.dialogPopUp.element;
            const element: Element = filterDialog.querySelector('.e-selected-tab');
            const mode: string = element ? (element.getAttribute('data-mode') || 'Items') : 'Items';
            const okButton: Element = filterDialog.querySelector('.' + cls.OK_BUTTON_CLASS);
            if (inputObj) {
                const value: number = inputObj.value !== null && inputObj.value !== undefined ? inputObj.value : 0;
                let isValid: boolean = true;
                if (mode === 'Percent') {
                    // Percent range is validated on OK through the common error dialog.
                    isValid = true;
                } else if (mode === 'Sum') {
                    isValid = !isNaN(value) && value > 0;
                } else {
                    isValid = value > 0;
                }
                if (okButton) {
                    if (!isValid) {
                        okButton.setAttribute('disabled', 'disabled');
                    } else {
                        okButton.removeAttribute('disabled');
                    }
                }
            }
        }
    }
    private getFilterObject(fieldName: string): IFilter {
        const filterObj: IFilter = PivotUtil.getFilterItemByName(
            fieldName, PivotUtil.cloneFilterSettings(this.parent.dataSourceSettings.filterSettings));
        if (filterObj && ((((['Label', 'Date', 'Number'] as FilterType[]).indexOf(filterObj.type) >= 0) &&
            this.parent.dataSourceSettings.allowLabelFilter) ||
            (filterObj.type === 'Value' && this.parent.dataSourceSettings.allowValueFilter) ||
            ((['Include', 'Exclude'] as FilterType[]).indexOf(filterObj.type) >= 0 &&
                this.parent.eventBase.isValidFilterItemsAvail(fieldName, filterObj)))) {
            return filterObj;
        }
        return undefined;
    }
    private wireEvent(element: HTMLElement, fieldName: string): void {
        EventHandler.add(element, 'click', this.applySorting.bind(this, fieldName), this);
    }
    private unWireEvent(element: HTMLElement): void {
        EventHandler.remove(element, 'click', this.applySorting);
    }
    /**
     * To close filter dialog.
     *
     * @returns {void}
     * @hidden
     */
    public closeFilterDialog(): void {
        this.dialogPopUp.close();
    }
    private removeFilterDialog(): void {
        if (this.editorSearch && !this.editorSearch.isDestroyed) {
            this.editorSearch.destroy();
            this.editorSearch = null;
        }
        if (this.allowExcelLikeFilter) {
            if (this.tabObj && !this.tabObj.isDestroyed) {
                this.tabObj.destroy();
                this.tabObj = null;
            }
        }
        if (this.dropMenu && !this.dropMenu.isDestroyed) {
            this.dropMenu.destroy();
            this.dropMenu = null;
        }
        if (this.memberTreeView && !this.memberTreeView.isDestroyed) {
            this.memberTreeView.destroy();
            this.memberTreeView = null;
        }
        if (this.allMemberSelect && !this.allMemberSelect.isDestroyed) {
            this.allMemberSelect.destroy();
            this.allMemberSelect = null;
        }
        if (document.getElementById(this.parent.parentID + '_LevelDiv-popup')) {
            remove(document.getElementById(this.parent.parentID + '_LevelDiv-popup'));
        }
        if (this.dialogPopUp && !this.dialogPopUp.isDestroyed) {
            this.dialogPopUp.destroy();
            this.dialogPopUp = null;
            setTimeout(this.setFocus.bind(this));
        }
        if (document.getElementById(this.parent.parentID + '_EditorTreeView')) {
            remove(document.getElementById(this.parent.parentID + '_EditorTreeView'));
        }
    }

    /** @hidden */

    public setFocus(): void {
        if (this.parent.control.pivotButtonModule.parentElement) {
            const pivotButtons: HTMLElement[] = [].slice.call(this.parent.control.pivotButtonModule.parentElement.querySelectorAll('.e-pivot-button'));
            for (const item of pivotButtons) {
                if (item.getAttribute('data-uid') === this.parent.control.pivotButtonModule.fieldName) {
                    item.focus();
                    break;
                }
            }
        }
    }
}

/// <reference path='../drop-down-base/drop-down-base-model.d.ts'/>
import { Input, InputObject } from '@syncfusion/ej2-inputs';
import { DropDownBase, dropDownBaseClasses, FilteringEventArgs, SelectEventArgs } from '../drop-down-base/drop-down-base';
import { FieldSettingsModel } from '../drop-down-base/drop-down-base-model';
import { EventHandler, closest, removeClass, addClass, Complex, Property, ChildProperty, BaseEventArgs, L10n } from '@syncfusion/ej2-base';
import { ModuleDeclaration, NotifyPropertyChanges, getComponent, EmitType, Event, extend, detach, attributes } from '@syncfusion/ej2-base';
import { getUniqueID, Browser, formatUnit, isNullOrUndefined, getValue } from '@syncfusion/ej2-base';
import { prepend, append , isBlazor, BlazorDragEventArgs, resetBlazorTemplate} from '@syncfusion/ej2-base';
import { cssClass, Sortable, moveTo, } from '@syncfusion/ej2-lists';
import { SelectionSettingsModel, ListBoxModel, ToolbarSettingsModel } from './list-box-model';
import { Button } from '@syncfusion/ej2-buttons';
import { createSpinner, showSpinner, hideSpinner, getZindexPartial } from '@syncfusion/ej2-popups';
import { DataManager, Query } from '@syncfusion/ej2-data';
/**
 * Defines the selection mode of List Box.
 */
export type SelectionMode = 'Multiple' | 'Single';
/**
 * Defines the toolbar position of List Box.
 */
export type ToolBarPosition = 'Left' | 'Right';
/**
 * Defines the checkbox position of List Box.
 */
export type CheckBoxPosition = 'Left' | 'Right';

type dataType = { [key: string]: object } | string | boolean | number;
type obj = { [key: string]: object };
const ITEMTEMPLATE_PROPERTY: string = 'ItemTemplate';
/**
 * Defines the Selection settings of List Box.
 */
export class SelectionSettings extends ChildProperty<SelectionSettings> {
    /**
     * Specifies the selection modes. The possible values are
     * * `Single`: Allows you to select a single item in the ListBox.
     * * `Multiple`: Allows you to select more than one item in the ListBox.
     * @default 'Multiple'
     */
    @Property('Multiple')
    public mode: SelectionMode;

    /**
     * If 'showCheckbox' is set to true, then 'checkbox' will be visualized in the list item.
     * @default false
     */
    @Property(false)
    public showCheckbox: boolean;

    /**
     * Allows you to either show or hide the selectAll option on the component.
     * @default false
     */
    @Property(false)
    public showSelectAll: boolean;

    /**
     * Set the position of the checkbox.
     * @default 'Left'
     */
    @Property('Left')
    public checkboxPosition: CheckBoxPosition;
}
/**
 * Defines the toolbar settings of List Box.
 */
export class ToolbarSettings extends ChildProperty<ToolbarSettings> {
    /** 
     * Specifies the list of tools for dual ListBox.
     * The predefined tools are 'moveUp', 'moveDown', 'moveTo', 'moveFrom', 'moveAllTo', and 'moveAllFrom'.
     * @default []
     */
    @Property([])
    public items: string[];

    /** 
     * Positions the toolbar before/after the ListBox.
     * The possible values are:
     * * Left: The toolbar will be positioned to the left of the ListBox.
     * * Right: The toolbar will be positioned to the right of the ListBox.
     * @default 'Right'
     */
    @Property('Right')
    public position: ToolBarPosition;
}

/**
 * The ListBox is a graphical user interface component used to display a list of items.
 * Users can select one or more items in the list using a checkbox or by keyboard selection.
 * It supports sorting, grouping, reordering and drag and drop of items.
 * ```html
 * <select id="listbox">
 *      <option value='1'>Badminton</option>
 *      <option value='2'>Basketball</option>
 *      <option value='3'>Cricket</option>
 *      <option value='4'>Football</option>
 *      <option value='5'>Tennis</option>
 * </select>
 * ```
 * ```typescript
 * <script>
 *   var listObj = new ListBox();
 *   listObj.appendTo("#listbox");
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class ListBox extends DropDownBase {
    private prevSelIdx: number;
    private listCurrentOptions: FieldSettingsModel;
    private allowDragAll: boolean;
    private checkBoxSelectionModule: { onDocumentClick: Function, checkAllParent: HTMLElement, clearIconElement: HTMLElement };
    private tBListBox: ListBox;
    private initLoad: boolean;
    private spinner: HTMLElement;
    private initialSelectedOptions: string[] | number[] | boolean[];
    private showSelectAll: boolean;
    private selectAllText: string;
    private unSelectAllText: string;
    private popupWrapper: Element;
    private targetInputElement: HTMLInputElement | string;
    private isValidKey: boolean = false;
    private isFiltered: boolean;
    private clearFilterIconElem: Element;
    private remoteFilterAction: boolean;
    private mainList: HTMLElement;
    private remoteCustomValue: boolean;
    private filterParent: HTMLElement;
    protected inputString: string;
    protected filterInput: HTMLInputElement;
    protected isCustomFiltering: boolean;
    private jsonData: { [key: string]: Object }[] | string[] | boolean[] | number[];
    private toolbarAction: string;
    /**
     * Sets the CSS classes to root element of this component, which helps to customize the
     * complete styles.
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Sets the specified item to the selected state or gets the selected item in the ListBox.
     * @default []
     * @aspType object
     * @isGenericType true
     */
    @Property([])
    public value: string[] | number[] | boolean[];

    /**
     * Sets the height of the ListBox component.
     * @default ''
     */
    @Property('')
    public height: number | string;

    /**
     * If 'allowDragAndDrop' is set to true, then you can perform drag and drop of the list item.
     * ListBox contains same 'scope' property enables drag and drop between multiple ListBox.
     * @default false
     */
    @Property(false)
    public allowDragAndDrop: boolean;

    /**
     * Sets limitation to the value selection.
     * based on the limitation, list selection will be prevented.
     * @default 1000
     */
    @Property(1000)
    public maximumSelectionLength: number;

    /** 
     * To enable the filtering option in this component. 
     * Filter action performs when type in search box and collect the matched item through `filtering` event.
     * If searching character does not match, `noRecordsTemplate` property value will be shown.
     * @default false
     */
    @Property(false)
    public allowFiltering: boolean;

    /**
     * Defines the scope value to group sets of draggable and droppable ListBox.
     * A draggable with the same scope value will be accepted by the droppable.
     * @default ''
     */
    @Property('')
    public scope: string;

    /**
     * When set to ‘false’, consider the `case-sensitive` on performing the search to find suggestions.
     * By default consider the casing.
     * @default true
     * @private
     */
    @Property(true)
    public ignoreCase: boolean;

    /**
     * Accepts the value to be displayed as a watermark text on the filter bar. 
     * @default null
     */
    @Property(null)
    public filterBarPlaceholder: string;

    /**
     * Triggers while rendering each list item.
     * @event
     * @blazorProperty 'OnItemRender'
     */
    @Event()
    public beforeItemRender: EmitType<BeforeItemRenderEventArgs>;

    /**
     * Triggers on typing a character in the component.
     * @event
     * @blazorProperty 'ItemSelected'
     */
    @Event()
    public filtering: EmitType<FilteringEventArgs>;

    /**
     * Triggers when an item in the popup is selected by the user either with mouse/tap or with keyboard navigation.
     * @event
     * @private
     */
    @Event()
    public select: EmitType<SelectEventArgs>;

    /**
     * Adds a new item to the popup list. By default, new item appends to the list as the last item,
     * but you can insert based on the index parameter.
     * @param  { Object[] } items - Specifies an array of JSON data or a JSON data.
     * @param { number } itemIndex - Specifies the index to place the newly added item in the popup list.
     * @return {void}.
     * @private
     */
    public addItem(
        items: { [key: string]: Object }[] | { [key: string]: Object } | string | boolean | number | string[] | boolean[] | number[],
        itemIndex?: number): void {
        super.addItem(items, itemIndex);
    }

    /**
     * Triggers while select / unselect the list item.
     * @event
     * @blazorProperty 'ValueChange'
     */
    @Event()
    public change: EmitType<ListBoxChangeEventArgs>;

    /**
     * Triggers before dropping the list item on another list item.
     * @event
     * @blazorProperty 'OnDrop'
     */
    @Event()
    public beforeDrop: EmitType<DropEventArgs>;

    /**
     * Triggers after dragging the list item.
     * @event
     * @blazorProperty 'DragStart'
     */
    @Event()
    public dragStart: EmitType<DragEventArgs>;

    /**
     * Triggers while dragging the list item.
     * @event
     * @blazorProperty 'Dragging'
     */
    @Event()
    public drag: EmitType<DragEventArgs>;

    /**
     * Triggers before dropping the list item on another list item.
     * @event
     * @blazorProperty 'Dropped'
     */
    @Event()
    public drop: EmitType<DragEventArgs>;

    /**
     * Triggers when data source is populated in the list.
     * @event
     * @private
     */
    @Event()
    public dataBound: EmitType<Object>;

    /**
     * Accepts the template design and assigns it to the group headers present in the list.
     * @default null
     * @private
     */
    @Property(null)
    public groupTemplate: string;
    /**
     * Accepts the template design and assigns it to list of component
     * when no data is available on the component.
     * @default 'No records found'
     * @private
     */
    @Property('No records found')
    public noRecordsTemplate: string;
    /**
     * Accepts the template and assigns it to the list content of the ListBox component
     * when the data fetch request from the remote server fails.
     * @default 'Request Failed'
     * @private
     */
    @Property('Request failed')
    public actionFailureTemplate: string;

    /**
     * specifies the z-index value of the component popup element.
     * @default 1000
     * @private
     */
    @Property(1000)
    public zIndex: number;
    /**
     * ignoreAccent set to true, then ignores the diacritic characters or accents when filtering.
     * @private
     */
    @Property(false)
    public ignoreAccent: boolean;

    /**
     * Specifies the toolbar items and its position.
     * @default { items: [], position: 'Right' }
     */
    @Complex<ToolbarSettingsModel>({}, ToolbarSettings)
    public toolbarSettings: ToolbarSettingsModel;

    /**
     * Specifies the selection mode and its type.
     * @default { mode: 'Multiple', type: 'Default' }
     */
    @Complex<SelectionSettingsModel>({}, SelectionSettings)
    public selectionSettings: SelectionSettingsModel;

    /**
     * Constructor for creating the ListBox component.
     */
    constructor(options?: ListBoxModel, element?: string | HTMLElement) {
        super(options, element);
    };

    /**
     * Build and render the component
     * @private
     */
    public render(): void {
        this.inputString = '';
        this.initLoad = true;
        this.isCustomFiltering = false;
        this.initialSelectedOptions = this.value;
        if (isBlazor() && this.isServerRendered) {
            this.list = this.element.parentElement;
            this.liCollections = <HTMLElement[] & NodeListOf<Element>>this.list.querySelectorAll('.' + cssClass.li);
            this.mainList = this.ulElement = this.list.querySelector('ul');
            this.setSelection(this.value);
            if (this.allowFiltering) {
                this.setFiltering();
            }
            this.initToolbarAndStyles();
            this.updateSelectionSettings();
            this.wireEvents();
            this.initDraggable();
            this.initLoad = false;
        } else {
            super.render();
        }
        this.renderComplete();
    }

    private updateBlazorListData(
        data: { [key: string]: Object }[] | string[] | boolean[] | number[], isDataSource: boolean, select?: boolean): void {
        if (isDataSource) {
            this.liCollections = <HTMLElement[] & NodeListOf<Element>>this.list.querySelectorAll('.' + cssClass.li);
            this.mainList = this.ulElement = this.list.querySelector('ul');
            if (this.allowDragAndDrop && !this.ulElement.classList.contains('e-sortable')) {
                this.initDraggable();
            }
            if (select) { this.selectItems(this.listData as string[], false); }
        }
        if (!isNullOrUndefined(data)) {
            this.sortedData = this.jsonData = this.listData = data;
        }
    }
    private initWrapper(): void {
        let hiddenSelect: Element = this.createElement('select', { className: 'e-hidden-select', attrs: { 'multiple': '' } });
        this.list.classList.add('e-listbox-wrapper');
        if (this.itemTemplate) {
            this.list.classList.add('e-list-template');
        }
        this.list.classList.add('e-wrapper');
        if (this.element.tagName === 'EJS-LISTBOX') {
            this.element.setAttribute('tabindex', '0');
            if (this.initLoad) {
                this.element.appendChild(this.list);
            }
        } else {
            if (this.initLoad) {
                this.element.parentElement.insertBefore(this.list, this.element);
            }
            this.list.insertBefore(this.element, this.list.firstChild);
            this.element.style.display = 'none';
        }
        this.list.insertBefore(hiddenSelect, this.list.firstChild);
        if (this.list.getElementsByClassName('e-list-item')[0]) {
            this.list.getElementsByClassName('e-list-item')[0].classList.remove(dropDownBaseClasses.focus);
        }
        removeClass([this.list], [dropDownBaseClasses.content, dropDownBaseClasses.root]);
        this.validationAttribute(this.element as HTMLInputElement, hiddenSelect as HTMLSelectElement);
        this.list.setAttribute('role', 'listbox');
        attributes(this.list, { 'role': 'listbox', 'aria-multiselectable': this.selectionSettings.mode === 'Multiple' ? 'true' : 'false' });
        this.updateSelectionSettings();
    }

    private updateSelectionSettings(): void {
        if (this.selectionSettings.showCheckbox && this.selectionSettings.showSelectAll && this.liCollections.length) {
            let l10nSelect: L10n = new L10n(
                this.getModuleName(), { selectAllText: 'Select All', unSelectAllText: 'Unselect All' }, this.locale);
            this.showSelectAll = true;
            this.selectAllText = l10nSelect.getConstant('selectAllText');
            this.unSelectAllText = l10nSelect.getConstant('unSelectAllText');
            this.popupWrapper = this.list;
            this.checkBoxSelectionModule.checkAllParent = null;
            this.notify('selectAll', {});
        }
    }

    private initDraggable(): void {
        if (this.ulElement) {
            this.ulElement.id = this.element.id + '_parent';
        }
        if (this.allowDragAndDrop) {
            new Sortable(this.ulElement, {
                scope: this.scope,
                itemClass: 'e-list-item',
                dragStart: this.triggerDragStart.bind(this),
                drag: this.triggerDrag.bind(this),
                beforeDrop: this.beforeDragEnd.bind(this),
                drop: this.dragEnd.bind(this),
                placeHolder: () => { return this.createElement('span', { className: 'e-placeholder' }); },
                helper: (e: { sender: Element }) => {
                    let wrapper: HTMLElement = this.list.cloneNode() as HTMLElement;
                    let ele: HTMLElement = e.sender.cloneNode(true) as HTMLElement;
                    wrapper.appendChild(ele);
                    let refEle: HTMLElement = this.getItems()[0] as HTMLElement;
                    wrapper.style.width = refEle.offsetWidth + 'px';
                    wrapper.style.height = refEle.offsetHeight + 'px';
                    if ((this.value && this.value.length) > 1 && this.isSelected(ele)) {
                        ele.appendChild(this.createElement('span', {
                            className: 'e-list-badge', innerHTML: this.value.length + ''
                        }));
                    }
                    wrapper.style.zIndex = getZindexPartial(this.element) + '';
                    return wrapper;
                }
            }
            );
        }
    }

    protected updateActionCompleteData(li: HTMLElement, item: { [key: string]: Object }): void {
        (this.jsonData as { [key: string]: Object }[]).push(item);
    }

    private initToolbar(): void {
        let scope: string; let pos: string = this.toolbarSettings.position;
        let prevScope: string = this.element.getAttribute('data-value');
        if (this.toolbarSettings.items.length) {
            let toolElem: Element = this.createElement('div', { className: 'e-listbox-tool', attrs: { 'role': 'toolbar' } });
            let wrapper: Element = this.createElement('div', {
                className: 'e-listboxtool-wrapper e-' + pos.toLowerCase()
            });
            this.list.parentElement.insertBefore(wrapper, this.list);
            wrapper.appendChild(pos === 'Right' ? this.list : toolElem);
            wrapper.appendChild(pos === 'Right' ? toolElem : this.list);
            this.createButtons(toolElem);
            if (!this.element.id) {
                this.element.id = getUniqueID('e-' + this.getModuleName());
            }
            if (this.scope) {
                document.querySelector(this.scope).setAttribute('data-value', this.element.id);
            } else {
                this.updateToolBarState();
            }
        }
        scope = this.element.getAttribute('data-value');
        if (prevScope && scope && (prevScope !== scope)) {
            this.tBListBox = getComponent(document.getElementById(prevScope), this.getModuleName());
            this.tBListBox.updateToolBarState();
        } else if (scope) {
            this.tBListBox = getComponent(document.getElementById(scope), this.getModuleName());
            this.tBListBox.updateToolBarState();
        }
    }

    private createButtons(toolElem: Element): void {
        let btn: Button;
        let ele: HTMLButtonElement;
        let title: string;
        let l10n: L10n = new L10n(
            this.getModuleName(),
            {
                moveUp: 'Move Up', moveDown: 'Move Down', moveTo: 'Move To',
                moveFrom: 'Move From', moveAllTo: 'Move All To', moveAllFrom: 'Move All From'
            },
            this.locale
        );
        this.toolbarSettings.items.forEach((value: string) => {
            title = l10n.getConstant(value);
            ele = this.createElement('button', {
                attrs: {
                    'type': 'button',
                    'data-value': value,
                    'title': title,
                    'aria-label': title
                }
            }) as HTMLButtonElement;
            toolElem.appendChild(ele);
            btn = new Button({ iconCss: 'e-icons e-' + value.toLowerCase() }, ele);
            btn.createElement = this.createElement;
        });
    }

    protected validationAttribute(input: HTMLInputElement, hiddenSelect: HTMLSelectElement): void {
        super.validationAttribute(input, hiddenSelect);
        hiddenSelect.required = input.required;
        input.required = false;
    }

    private setHeight(): void {
        let ele: HTMLElement = this.toolbarSettings.items.length ? this.list.parentElement : this.list;
        ele.style.height = formatUnit(this.height);
        if (this.allowFiltering && this.height.toString().indexOf('%') < 0) {
            addClass([this.list], 'e-filter-list');
        } else {
            removeClass([this.list], 'e-filter-list');
        }
    }

    private setCssClass(): void {
        let wrap: Element = this.toolbarSettings.items.length ? this.list.parentElement : this.list;
        if (this.cssClass) {
            addClass([wrap], this.cssClass.split(' '));
        }
        if (this.enableRtl) {
            addClass([wrap], 'e-rtl');
        }
    }

    private setEnable(): void {
        let ele: Element = this.toolbarSettings.items.length ? this.list.parentElement : this.list;
        if (this.enabled) {
            removeClass([ele], cssClass.disabled);
        } else {
            addClass([ele], cssClass.disabled);
            if (isBlazor() && this.isServerRendered && this.toolbarSettings.items.length) {
                removeClass([this.list], cssClass.disabled);
            }
        }
    }

    protected showSpinner(): void {
        if (!this.spinner) {
            this.spinner = this.createElement('div', { className: 'e-listbox-wrapper' });
        }
        this.spinner.style.height = formatUnit(this.height);
        this.element.parentElement.insertBefore(this.spinner, this.element.nextSibling);
        createSpinner({ target: this.spinner }, this.createElement);
        showSpinner(this.spinner);
    }

    protected hideSpinner(): void {
        if (this.spinner.querySelector('.e-spinner-pane')) {
            hideSpinner(this.spinner);
        }
        if (this.spinner.parentElement) {
            detach(this.spinner);
        }
    }

    private onInput(): void {
        if (this.keyDownStatus) {
            this.isValidKey = true;
        } else {
            this.isValidKey = false;
        }
        this.keyDownStatus = false;
        this.refreshClearIcon();
    }

    private clearText(): void {
        this.filterInput.value = '';
        this.refreshClearIcon();
        let event: KeyboardEvent = document.createEvent('KeyboardEvent');
        this.isValidKey = true;
        this.KeyUp(event);
    }

    private refreshClearIcon(): void {
        if (this.filterInput.parentElement.querySelector('.' + listBoxClasses.clearIcon)) {
            let clearElement: HTMLElement = <HTMLElement>this.filterInput.parentElement.querySelector('.' + listBoxClasses.clearIcon);
            clearElement.style.visibility = this.filterInput.value === '' ? 'hidden' : 'visible';
        }
    }

    protected onActionComplete(
        ulElement: HTMLElement,
        list: obj[] | boolean[] | string[] | number[],
        e?: Object): void {
        let searchEle: Element;
        if (this.allowFiltering && this.list.getElementsByClassName('e-filter-parent')[0]) {
            if (isBlazor() && this.isServerRendered) {
                searchEle = this.list.getElementsByClassName('e-filter-parent')[0];
            } else {
                searchEle = this.list.getElementsByClassName('e-filter-parent')[0].cloneNode(true) as Element;
            }
        }
        super.onActionComplete(ulElement, list, e);
        if (this.allowFiltering && !isNullOrUndefined(searchEle)) {
            this.list.insertBefore(searchEle, this.list.firstElementChild);
            if (!isBlazor() && !this.isServerRendered) {
                this.filterParent = this.list.getElementsByClassName('e-filter-parent')[0] as HTMLElement;
                this.filterWireEvents(searchEle);
            }
        }
        this.initWrapper();
        this.setSelection();
        this.initDraggable();
        this.mainList = this.ulElement;
        if (this.initLoad) {
            this.jsonData = []; extend(this.jsonData, list, []);
            this.initToolbarAndStyles();
            this.wireEvents();
            if (this.showCheckbox) {
                this.setCheckboxPosition();
            }
            if (this.allowFiltering) {
                this.setFiltering();
            }
        } else {
            if (this.allowFiltering) {
                let filterElem: HTMLInputElement = (this.list.getElementsByClassName('e-input-filter')[0] as HTMLInputElement);
                let txtLength: number = this.filterInput.value.length;
                filterElem.selectionStart = txtLength;
                filterElem.selectionEnd = txtLength;
                filterElem.focus();
            }
        }
        this.initLoad = false;
    }

    private initToolbarAndStyles(): void {
        this.initToolbar();
        this.setCssClass();
        this.setEnable();
        this.setHeight();
    }

    private triggerDragStart(args: DragEventArgs & BlazorDragEventArgs): void {
        let badge: Element;
        args = extend(this.getDragArgs(args), { dragSelected: true }) as DragEventArgs & BlazorDragEventArgs;
        if (Browser.isIos) {
            this.list.style.overflow = 'hidden';
        }
        this.trigger('dragStart', args, (dragEventArgs: DragEventArgs) => {
            this.allowDragAll = dragEventArgs.dragSelected;
            if (!this.allowDragAll) {
                badge = this.ulElement.getElementsByClassName('e-list-badge')[0];
                if (badge) { detach(badge); }
            }
            if (isBlazor()) {
                args.bindEvents(args.dragElement);
            }

        });
    }

    private triggerDrag(args: DragEventArgs): void {
        this.trigger('drag', this.getDragArgs(args as DragEventArgs & BlazorDragEventArgs));
        let listObj: ListBox = this.getComponent(args.target);
        if (listObj && listObj.listData.length === 0) {
            let noRecElem: Element = listObj.ulElement.getElementsByClassName('e-list-nrt')[0];
            if (noRecElem) {
                listObj.ulElement.removeChild(noRecElem);
            }
        }
    }

    private beforeDragEnd(args: DropEventArgs): void {
        let dragValue: string = args.droppedElement.getAttribute('data-value');
        if ((this.value as string[]).indexOf(dragValue) > -1) {
            args.items = this.getDataByValues(this.value);
        } else {
            args.items = this.getDataByValues([dragValue]);
        }
        this.trigger('beforeDrop', args);
    }

    // tslint:disable-next-line:max-func-body-length
    private dragEnd(args: DropEventArgs): void {
        let listData: dataType[]; let liColl: HTMLElement[]; let jsonData: dataType[]; let droppedData: dataType;
        let selectedOptions: (string | boolean | number)[]; let sortedData: dataType[];
        let dropValue: string | number | boolean = this.getFormattedValue(args.droppedElement.getAttribute('data-value'));
        let listObj: ListBox = this.getComponent(args.droppedElement);
        let getArgs: Object = this.getDragArgs({ target: args.droppedElement } as DragEventArgs & BlazorDragEventArgs, true);
        let sourceArgs: Object = { previousData: this.dataSource }; let destArgs: Object = { previousData: listObj.dataSource };
        let dragArgs: Object = extend({}, getArgs, { target: args.target, source: { previousData: this.dataSource } });
        if (listObj !== this) {
            let sourceArgs1: Object = extend( sourceArgs, {currentData: this.listData});
            dragArgs = extend(dragArgs, { source: sourceArgs1, destination: destArgs} );
        }
        if (Browser.isIos) {
            this.list.style.overflow = '';
        }
        if (listObj === this) {
            let ul: Element = this.ulElement;
            listData = [].slice.call(this.listData); liColl = [].slice.call(this.liCollections);
            jsonData = [].slice.call(this.jsonData); sortedData = [].slice.call(this.sortedData);
            let toSortIdx: number = args.currentIndex;
            let toIdx: number = args.currentIndex = this.getCurIdx(this, args.currentIndex);
            let rIdx: number = listData.indexOf(this.getDataByValue(dropValue));
            let jsonIdx: number = jsonData.indexOf(this.getDataByValue(dropValue));
            let sIdx: number = sortedData.indexOf(this.getDataByValue(dropValue));
            listData.splice(toIdx, 0, listData.splice(rIdx, 1)[0] as obj);
            sortedData.splice(toSortIdx, 0, sortedData.splice(sIdx, 1)[0] as obj);
            jsonData.splice(toIdx, 0, jsonData.splice(jsonIdx, 1)[0] as obj);
            if (!isBlazor()) { liColl.splice(toIdx, 0, liColl.splice(rIdx, 1)[0] as HTMLElement); }
            if (this.allowDragAll) {
                selectedOptions = this.value && Array.prototype.indexOf.call(this.value, dropValue) > -1 ? this.value : [dropValue];
                selectedOptions.forEach((value: string) => {
                    if (value !== dropValue) {
                        let idx: number = listData.indexOf(this.getDataByValue(value));
                        let jsonIdx: number = jsonData.indexOf(this.getDataByValue(value));
                        let sIdx: number = sortedData.indexOf(this.getDataByValue(value));
                        if (idx > toIdx) {
                            toIdx++;
                        }
                        jsonData.splice(toIdx, 0, jsonData.splice(jsonIdx, 1)[0] as obj);
                        listData.splice(toIdx, 0, listData.splice(idx, 1)[0] as obj);
                        sortedData.splice(toSortIdx, 0, sortedData.splice(sIdx, 1)[0] as obj);
                        if (!isBlazor()) {
                            liColl.splice(toIdx, 0, liColl.splice(idx, 1)[0] as HTMLElement);
                            ul.insertBefore(this.getItems()[this.getIndexByValue(value)], ul.getElementsByClassName('e-placeholder')[0]);
                        }
                    } else if (isBlazor()) {
                        let lists: HTMLElement[] = [].slice.call(this.ulElement.getElementsByClassName(cssClass.li));
                        let refChild: HTMLElement = this.ulElement.removeChild(lists[args.currentIndex]);
                        lists.splice(args.currentIndex, 1);
                        this.ulElement.insertBefore(refChild, lists[args.previousIndex]);
                    }
                });
            }
            (this.listData as dataType[]) = listData; (this.jsonData as dataType[]) = jsonData;
            (this.sortedData as dataType[]) = sortedData; this.liCollections = liColl;
            if (isBlazor()) {
                let value: string[] | number[] | boolean[] = this.value;
                // tslint:disable-next-line:no-any
                (<any>this).interopAdaptor.invokeMethodAsync('UpdateListData', this.listData).then((): void => {
                    this.updateBlazorListData(null, true);
                    this.selectItems(this.listData as string[], false);
                    this.selectItems(value as string[]);
                });
            }
        } else {
            let li: Element; let fLiColl: HTMLElement[] = [].slice.call(this.liCollections);
            let currIdx: number = args.currentIndex = this.getCurIdx(listObj, args.currentIndex); let ul: Element = listObj.ulElement;
            listData = [].slice.call(listObj.listData); liColl = [].slice.call(listObj.liCollections);
            jsonData = [].slice.call(listObj.jsonData); sortedData = [].slice.call(listObj.sortedData);
            selectedOptions = (this.value && Array.prototype.indexOf.call(this.value, dropValue) > -1 && this.allowDragAll)
            ? this.value : [dropValue];
            let fListData: dataType[] = [].slice.call(this.listData); let fSortData: dataType[] = [].slice.call(this.sortedData);
            selectedOptions.forEach((value: string, index: number) => {
                droppedData = this.getDataByValue(value);
                let srcIdx: number = (this.listData as dataType[]).indexOf(droppedData);
                let jsonSrcIdx: number = (this.jsonData as dataType[]).indexOf(droppedData);
                let sortIdx: number = (this.sortedData as dataType[]).indexOf(droppedData);
                fListData.splice(srcIdx, 1); this.jsonData.splice(jsonSrcIdx, 1);
                fSortData.splice(sortIdx, 1); (this.listData as dataType[]) = fListData; (this.sortedData as dataType[]) = fSortData;
                let destIdx: number = value === dropValue ? args.currentIndex : currIdx;
                listData.splice(destIdx, 0, droppedData); jsonData.splice(destIdx, 0, droppedData);
                sortedData.splice(destIdx, 0, droppedData);
                if (!isBlazor()) {
                    liColl.splice(destIdx, 0, fLiColl.splice(srcIdx, 1)[0]);
                }
                if (!value) {
                    let liCollElem: Element[] = this.getItems();
                    for (let i: number = 0; i < liCollElem.length; i++ ) {
                        if (liCollElem[i].getAttribute('data-value') === null && liCollElem[i].classList.contains('e-list-item')) {
                            li = liCollElem[i];
                            break;
                        }
                    }
                } else {
                    li = this.getItems()[this.getIndexByValue(value)];
                }
                if (!li) { li = args.helper; }
                this.removeSelected(this, value === dropValue ? [args.droppedElement] : [li]);
                if (isBlazor()) {
                    if (index === 0) {
                        this.ulElement.insertBefore(
                            ul.getElementsByClassName(cssClass.li)[args.currentIndex],
                            this.ulElement.getElementsByClassName(cssClass.li)[args.previousIndex]);
                    }
                } else {
                    ul.insertBefore(li, ul.getElementsByClassName('e-placeholder')[0]);
                }
                currIdx++;
            });
            if (isBlazor()) {
                // tslint:disable
                (<any>this).interopAdaptor.invokeMethodAsync('UpdateListData', this.listData).then((): void => {
                    this.updateSelectedOptions();
                    if (this.fields.groupBy) { this.setSelection(); }
                    this.updateBlazorListData(null, true, this.value == null || !this.value.length);
                });
                (<any>listObj).interopAdaptor.invokeMethodAsync('UpdateListData', listData).then((): void => {
                    if (listObj.sortOrder !== 'None' || this.selectionSettings.showCheckbox
                        !== listObj.selectionSettings.showCheckbox || listObj.fields.groupBy) {
                            listObj.setSelection();
                    }
                    listObj.updateBlazorListData(null, true, listObj.value == null || !listObj.value.length);
                });
                // tslint:enable
            } else {
                if (this.fields.groupBy) {
                    this.ulElement.innerHTML = this.renderItems(this.listData as obj[], this.fields).innerHTML;
                    this.setSelection();
                }
                if (listObj.sortOrder !== 'None' || this.selectionSettings.showCheckbox
                    !== listObj.selectionSettings.showCheckbox || listObj.fields.groupBy) {
                    let sortabale: { placeHolderElement: Element } = getComponent(ul as HTMLElement, 'sortable');
                    ul.innerHTML = listObj.renderItems(listData as obj[], listObj.fields).innerHTML;
                    if (sortabale.placeHolderElement) {
                        ul.appendChild(sortabale.placeHolderElement);
                    }
                    ul.appendChild(args.helper); listObj.setSelection();
                }
                this.liCollections = fLiColl; listObj.liCollections = liColl;
            }
            (listObj.jsonData as dataType[]) = extend([], [], jsonData, false) as dataType[];
            (listObj.listData as dataType[]) = extend([], [], listData, false) as dataType[];
            (listObj.sortedData as dataType[]) = extend([], [], sortedData, false) as dataType[];
            if (this.listData.length === 0) {
                this.l10nUpdate();
            }
        }
        if (this === listObj) {
            let sourceArgs1: Object = extend( sourceArgs, {currentData: listData});
            dragArgs = extend(dragArgs, {source: sourceArgs1});
        } else {
            let dragArgs1: Object = extend(destArgs, {currentData: listData});
            dragArgs = extend(dragArgs, { destination: dragArgs1 });
        }
        this.trigger('drop', dragArgs);
    }

    private removeSelected(listObj: ListBox, elems: Element[]): void {
        if (listObj.selectionSettings.showCheckbox) {
            elems.forEach((ele: Element) => { ele.getElementsByClassName('e-frame')[0].classList.remove('e-check'); });
        } else {
            removeClass(elems, cssClass.selected);
        }
    }

    private getCurIdx(listObj: ListBox, idx: number): number {
        if (listObj.fields.groupBy) {
            idx -= [].slice.call(listObj.ulElement.children).slice(0, idx)
                .filter((ele: Element) => ele.classList.contains(cssClass.group)).length;
        }
        return idx;
    }

    private getComponent(li: Element): ListBox {
        let listObj: ListBox;
        let ele: HTMLElement = (this.element.tagName === 'EJS-LISTBOX' ? closest(li, '.e-listbox')
            : closest(li, '.e-listbox-wrapper') && closest(li, '.e-listbox-wrapper').querySelector('.e-listbox')) as HTMLElement;
        if (ele) {
            listObj = getComponent(ele, this.getModuleName());
        }
        return listObj;
    }

    protected listOption(
        dataSource: obj[] | string[] | number[] | boolean[],
        fields: FieldSettingsModel): FieldSettingsModel {
        this.listCurrentOptions = super.listOption(dataSource, fields);
        this.listCurrentOptions = extend({}, this.listCurrentOptions, { itemCreated: this.triggerBeforeItemRender.bind(this) }, true);
        this.notify('listoption', { module: 'CheckBoxSelection' });
        return this.listCurrentOptions;
    }

    private triggerBeforeItemRender(e: { item: Element, curData: obj }): void {
        e.item.setAttribute('tabindex', '-1');
        this.trigger('beforeItemRender', { element: e.item, item: e.curData });
    }

    public requiredModules(): ModuleDeclaration[] {
        let modules: ModuleDeclaration[] = [];
        if (this.selectionSettings.showCheckbox) {
            modules.push({
                member: 'CheckBoxSelection',
                args: [this]
            });
        }
        return modules;
    }

    /**
     * This method is used to enable or disable the items in the ListBox based on the items and enable argument.
     * @param items Text items that needs to be enabled/disabled.
     * @param enable Set `true`/`false` to enable/disable the list items.
     * @param isValue - Set `true` if `items` parameter is a array of unique values.
     * @returns void
     */
    public enableItems(items: string[], enable: boolean = true, isValue?: boolean): void {
        let li: HTMLElement;
        items.forEach((item: string) => {
            let text: string;
            if (isBlazor() && typeof(item) === 'object') {
                text = getValue(isValue ? this.fields.value : this.fields.text, item);
                if (isNullOrUndefined(text)) { return; }
            } else {
                text = item;
            }
            li = this.findListElement(this.list, 'li', 'data-value', isValue ? text : this.getValueByText(text));
            if (!li) { return; }
            if (enable) {
                removeClass([li], cssClass.disabled);
                li.removeAttribute('aria-disabled');
            } else {
                addClass([li], cssClass.disabled);
                li.setAttribute('aria-disabled', 'true');
            }
        });
    }

    /**
     * Based on the state parameter, specified list item will be selected/deselected.
     * @param items Array of text value of the item.
     * @param state Set `true`/`false` to select/un select the list items.
     * @param isValue - Set `true` if `items` parameter is a array of unique values.
     * @returns void
     */
    public selectItems(items: string[], state: boolean = true, isValue?: boolean): void {
        this.setSelection(items, state, !isValue);
        this.updateSelectedOptions();
    }

    /**
     * Based on the state parameter, entire list item will be selected/deselected.
     * @param state Set `true`/`false` to select/un select the entire list items.
     * @returns void
     */
    public selectAll(state: boolean = true): void {
        this.selectAllItems(state);
    }

    /**
     * Adds a new item to the list. By default, new item appends to the list as the last item,
     * but you can insert based on the index parameter.
     * @param  { Object[] } items - Specifies an array of JSON data or a JSON data.
     * @param { number } itemIndex - Specifies the index to place the newly added item in the list.
     * @returns {void}.
     */
    public addItems(items: obj[] | obj, itemIndex?: number): void {
        super.addItem(items, itemIndex);
    }
    /**
     * Removes a item from the list. By default, removed the last item in the list,
     * but you can remove based on the index parameter.
     * @param  { Object[] } items - Specifies an array of JSON data or a JSON data.
     * @param { number } itemIndex - Specifies the index to remove the item from the list.
     * @returns {void}.
     */
    public removeItems(items?: obj[] | obj, itemIndex?: number): void {
        this.removeItem(items, itemIndex);
    }
    /**
     * Removes a item from the list. By default, removed the last item in the list,
     * but you can remove based on the index parameter.
     * @param  { Object[] } items - Specifies an array of JSON data or a JSON data.
     * @param { number } itemIndex - Specifies the index to remove the item from the list.
     * @returns {void}.
     */
    public removeItem(
        items?: { [key: string]: Object }[] | { [key: string]: Object } | string | boolean | number | string[] | boolean[] | number[],
        itemIndex?: number): void {
        let liCollections: HTMLElement[] = [];
        let liElement: HTMLElement[] | NodeListOf<HTMLLIElement> = this.list.querySelectorAll('.' + dropDownBaseClasses.li);
        if (items) {
            items = (items instanceof Array ? items : [items]) as { [key: string]: Object }[] | string[] | boolean[] | number[];
            let fields: FieldSettingsModel = this.fields; let dataValue: string; let objValue: string;
            let dupData: {[key: string]: Object }[] = []; let itemIdx: number;
            extend(dupData, [], this.listData as { [key: string]: Object }[]);
            let removeIdxes: number [] = []; let removeLiIdxes: number [] = [];
            for (let j: number = 0; j < items.length; j++) {
                if (items[j] instanceof Object) {
                    dataValue = getValue(fields.value, items[j]);
                } else {
                    dataValue = items[j].toString();
                }
                for (let i: number = 0, len: number = dupData.length; i < len; i++) {
                    if (dupData[i] instanceof Object) {
                        objValue = getValue(fields.value, dupData[i]);
                    } else {
                        objValue = dupData[i].toString();
                    }
                    if (objValue === dataValue) {
                        itemIdx = this.getIndexByValue(dataValue);
                        liCollections.push(liElement[itemIdx]);
                        removeIdxes.push(i);
                        removeLiIdxes.push(itemIdx);
                    }
                }
            }
            for (let k: number = removeIdxes.length - 1; k > 0; k--) {
                (this.listData as { [key: string]: Object }[]).splice(removeIdxes[k], 1);
            }
            for (let k: number = removeLiIdxes.length - 1; k > 0; k--) {
                this.liCollections.splice(removeLiIdxes[k], 1);
            }
        } else {
            itemIndex = itemIndex ? itemIndex : 0;
            liCollections.push(liElement[itemIndex]);
            (this.listData as { [key: string]: Object }[]).splice(itemIndex, 1);
            this.updateLiCollection(itemIndex);
        }
        for (let i: number = 0; i < liCollections.length; i++) {
            this.ulElement.removeChild(liCollections[i]);
        }
        if (this.listData.length === 0) {
            this.l10nUpdate();
        }
    }
    /**
     * Gets the array of data Object that matches the given array of values. 
     * @param  { string[] | number[] | boolean[] } value - Specifies the array value of the list item.
     * @returns object[].
     */
    public getDataByValues(value: string[] | number[] | boolean[] ): { [key: string]: Object }[] {
        let data: string | number | boolean | { [key: string]: Object }[] = [];
        for (let i: number = 0; i < value.length; i++) {
            data.push(this.getDataByValue(value[i]) as { [key: string]: Object });
        }
        return data;
    }
    /**
     * Moves the given value(s) / selected value(s) upwards.  
     * @param  { string[] | number[] | boolean[] } value - Specifies the value(s).
     * @returns {void}
     */
    public moveUp(value?: string[] | number[] | boolean[]): void {
        let elem: Element[] = (value) ? this.getElemByValue(value) : this.getSelectedItems();
        this.moveUpDown(true, false, elem);
    }
    /**
     * Moves the given value(s) / selected value(s) downwards.
     * @param  { string[] | number[] | boolean[] } value - Specifies the value(s).
     * @returns {void}
     */
    public moveDown(value?: string[] | number[] | boolean[]): void {
        let elem: Element[] = (value) ? this.getElemByValue(value) : this.getSelectedItems();
        this.moveUpDown(false, false, elem);
    }
    /**
     * Moves the given value(s) / selected value(s) to the given / default scoped ListBox.  
     * @param  { string[] | number[] | boolean[] } value - Specifies the value or array value of the list item.
     * @returns {void}
     */
    public moveTo(value?: string[] | number[] | boolean[], index?: number, targetId?: string): void {
        let elem: Element[] = (value) ? this.getElemByValue(value) : this.getSelectedItems();
        let tlistbox: ListBox = (targetId) ? getComponent(targetId, ListBox) : this.getScopedListBox();
        this.moveData(this, tlistbox, false, elem, index);
    }
    /**
     * Moves all the values from one ListBox to the scoped ListBox.
     * @param  { string } targetId - Specifies the scoped ListBox ID.
     * @param  { string } index - Specifies the index to where the items moved.
     * @returns {void}
     */
    public moveAllTo(targetId?: string, index?: number): void {
        let tlistbox: ListBox = (targetId) ? getComponent(targetId, ListBox) : this.getScopedListBox();
        this.moveAllData(this, tlistbox, false, index);
    }
    /**
     * Returns the updated dataSource in ListBox
     * @returns {{ [key: string]: Object }[] | string[] | boolean[] | number[]}
     */
    public getDataList(): { [key: string]: Object }[] | string[] | boolean[] | number[] {
        return this.jsonData;
    }
    /**
     * Returns the sorted Data in ListBox
     * @returns {{ [key: string]: Object }[] | string[] | boolean[] | number[]}
     */
    public getSortedList(): { [key: string]: Object }[] | string[] | boolean[] | number[] {
        let sortData: dataType[]; let tempData: { [key: string]: Object }[] | string[] | boolean[] | number[];
        sortData = tempData = this.sortedData;
        if (this.fields.groupBy) {
            sortData = [];
            for (let i: number = 0; i < tempData.length; i++) {
                if ((tempData[i] as { [key: string]: Object }).isHeader) {
                    continue;
                }
                sortData.push(tempData[i]);
            }
        }
        return sortData as { [key: string]: Object }[] | string[] | boolean[] | number[];
    }
    private getElemByValue(value: string[] | number[] | boolean[]): Element[] {
        let elem: Element[] = [];
        for (let i: number = 0; i < value.length; i++) {
            elem.push(this.ulElement.querySelector('[data-value ="' + value[i] + '"]'));
        }
        return elem;
    }
    private updateLiCollection(index: number): void {
        let tempLi: HTMLElement[] = [].slice.call(this.liCollections);
        tempLi.splice(index, 1);
        this.liCollections = tempLi;
    }
    private selectAllItems(state: boolean, event?: MouseEvent): void {
        [].slice.call(this.getItems()).forEach((li: Element) => {
            if (!li.classList.contains(cssClass.disabled)) {
                if (this.selectionSettings.showCheckbox) {
                    let ele: Element = li.getElementsByClassName('e-check')[0];
                    if ((!ele && state) || (ele && !state)) {
                        this.notify('updatelist', { li: li, module: 'listbox' });
                        if (this.maximumSelectionLength >= this.list.querySelectorAll('.e-list-item span.e-check').length) {
                            this.checkMaxSelection();
                        }
                    }
                } else {
                    if (state) {
                        li.classList.add(cssClass.selected);
                    } else {
                        li.classList.remove(cssClass.selected);
                    }
                }
            }
        });
        this.updateSelectedOptions();
        if (this.allowFiltering && this.selectionSettings.showCheckbox) {
            let liEle: HTMLCollectionOf<HTMLLIElement> = this.list.getElementsByTagName('li') as HTMLCollectionOf<HTMLLIElement>;
            let index: number = 0;
            if (state) {
                for (index = 0; index < liEle.length; index++) {
                    let dataValue1: string = this.getFormattedValue(liEle[index].getAttribute('data-value')) as string;
                    if (!(this.value as string[]).some((e: string) => e === dataValue1)) {
                        (this.value as string[]).push(this.getFormattedValue(liEle[index].getAttribute('data-value')) as string);
                    }
                }
            } else {
                for (index = 0; index < liEle.length; index++) {
                    let dataValue2: string = this.getFormattedValue(liEle[index].getAttribute('data-value')) as string;
                    this.value = (this.value as string[]).filter((e: string) => e !== dataValue2);
                }
            }
            if (document.querySelectorAll('ul').length < 2) {
                this.updateMainList();
            }
        }
        this.triggerChange(this.getSelectedItems(), event);
    }

    private updateMainList(): void {
        let mainList: NodeListOf<Element> = this.mainList.querySelectorAll('.e-list-item');
        let ulList: NodeListOf<Element> = this.ulElement.querySelectorAll('.e-list-item');
        let mainCount: number = mainList.length; let ulEleCount: number = ulList.length;
        if (this.selectionSettings.showCheckbox || (document.querySelectorAll('ul').length > 1 || mainCount !== ulEleCount)) {
            let listindex: number = 0;
            let valueindex: number = 0;
            let count: number = 0;
            for (listindex; listindex < mainCount; ) {
                if (this.value) {
                    for (valueindex; valueindex < this.value.length; valueindex++) {
                        if (mainList[listindex].getAttribute('data-value') === this.value[valueindex]) {
                            count++;
                        }
                    }
                }
                if (!count && this.selectionSettings.showCheckbox) {
                    mainList[listindex].getElementsByClassName('e-frame')[0].classList.remove('e-check');
                }
                if (document.querySelectorAll('ul').length > 1 && count && mainCount !== ulEleCount) {
                    this.mainList.removeChild(this.mainList.getElementsByTagName('li')[listindex]);
                    listindex = 0;
                } else {
                    listindex++;
                }
                count = 0;
                valueindex = 0;
            }
        }
    }

    private wireEvents(): void {
        let form: Element = closest(this.element, 'form');
        let wrapper: Element = this.element.tagName === 'EJS-LISTBOX' ? this.element : this.list;
        EventHandler.add(this.list, 'click', this.clickHandler, this);
        EventHandler.add(wrapper, 'keydown', this.keyDownHandler, this);
        EventHandler.add(wrapper, 'focusout', this.focusOutHandler, this);
        this.wireToolbarEvent();
        if (this.selectionSettings.showCheckbox) {
            EventHandler.remove(document, 'mousedown', this.checkBoxSelectionModule.onDocumentClick);
        }
        if (this.fields.groupBy || this.element.querySelector('select>optgroup')) {
            EventHandler.remove(this.list, 'scroll', this.setFloatingHeader);
        }
        if (form) {
            EventHandler.add(form, 'reset', this.formResetHandler, this);
        }
    }

    private wireToolbarEvent(): void {
        if (this.toolbarSettings.items.length) {
            EventHandler.add(this.getToolElem(), 'click', this.toolbarClickHandler, this);
        }
    }

    private unwireEvents(): void {
        let form: Element = closest(this.element, 'form');
        let wrapper: Element = this.element.tagName === 'EJS-LISTBOX' ? this.element : this.list;
        EventHandler.remove(this.list, 'click', this.clickHandler);
        EventHandler.remove(wrapper, 'keydown', this.keyDownHandler);
        EventHandler.remove(wrapper, 'focusout', this.focusOutHandler);
        if (this.allowFiltering && this.clearFilterIconElem) {
            EventHandler.remove(this.clearFilterIconElem, 'click', this.clearText);
        }
        if (this.toolbarSettings.items.length) {
            EventHandler.remove(this.getToolElem(), 'click', this.toolbarClickHandler);
        }
        if (form) {
            EventHandler.remove(form, 'reset', this.formResetHandler);
        }
    }

    private clickHandler(e: MouseEvent): void {
        this.selectHandler(e);
    };

    private checkSelectAll(): void {
        let searchCount: number = 0;
        let liItems: NodeListOf<Element> = this.list.querySelectorAll('li.' + dropDownBaseClasses.li);
        for (let i: number = 0; i < liItems.length; i++) {
            if (!liItems[i].classList.contains('e-disabled')) {
                searchCount++;
            }
        }
        let len: number = this.getSelectedItems().length;
        if (this.showSelectAll && searchCount) {
            this.notify('checkSelectAll', { module: 'CheckBoxSelection',
                    value: (searchCount === len) ? 'check' : (len === 0) ? 'uncheck' : 'indeterminate'});
        }
    }

    protected getQuery(query: Query): Query {
        let filterQuery: Query = query ? query.clone() : this.query ? this.query.clone() : new Query();
        if (this.allowFiltering) {
            let filterType: string = this.inputString === '' ? 'contains' : this.filterType;
            let dataType: string = <string>this.typeOfData(this.dataSource as { [key: string]: Object; }[]).typeof;
            if (!(this.dataSource instanceof DataManager) && dataType === 'string' || dataType === 'number') {
                filterQuery.where('', filterType, this.inputString, this.ignoreCase, this.ignoreAccent);
            } else {
                let fields: string = (this.fields.text) ? this.fields.text : '';
                filterQuery.where(fields, filterType, this.inputString, this.ignoreCase, this.ignoreAccent);
            }
        } else {
            filterQuery = query ? query : this.query ? this.query : new Query();
        }
        return filterQuery;
    }

    private setFiltering(): InputObject | void {
        let filterInputObj: InputObject;
        if (isNullOrUndefined(this.filterParent)) {
            if (isBlazor() && this.isServerRendered) {
                this.filterParent = this.list.querySelector('.e-filter-parent');
                this.filterInput = this.list.querySelector('.e-input-filter');
            } else {
                this.filterParent = this.createElement('span', {
                    className: listBoxClasses.filterParent
                });
                this.filterInput = <HTMLInputElement>this.createElement('input', {
                    attrs: { type: 'text' },
                    className: listBoxClasses.filterInput
                });
                this.element.parentNode.insertBefore(this.filterInput, this.element);
                let backIcon: boolean = false;
                if (Browser.isDevice) {
                    backIcon = true;
                }
                filterInputObj = Input.createInput(
                    {
                        element: this.filterInput,
                        buttons: [listBoxClasses.filterBarClearIcon],
                        properties: { placeholder: this.filterBarPlaceholder }
                    },
                    this.createElement
                );
                append([filterInputObj.container], this.filterParent);
                prepend([this.filterParent], this.list);
                attributes(this.filterInput, {
                    'aria-disabled': 'false',
                    'aria-owns': this.element.id + '_options',
                    'role': 'listbox',
                    'aria-activedescendant': null,
                    'autocomplete': 'off',
                    'autocorrect': 'off',
                    'autocapitalize': 'off',
                    'spellcheck': 'false'
                });
            }
            if (this.height.toString().indexOf('%') < 0) {
                addClass([this.list], 'e-filter-list');
            }
            this.inputString = this.filterInput.value;
            this.filterWireEvents();
            return filterInputObj;
        }
    }

    private filterWireEvents(filterElem?: Element): void {
        if (filterElem) {
            this.filterInput = filterElem.querySelector('.e-input-filter');
        }
        this.clearFilterIconElem = this.filterInput.parentElement.querySelector('.' + listBoxClasses.clearIcon);
        if (this.clearFilterIconElem) {
            EventHandler.add(this.clearFilterIconElem, 'click', this.clearText, this);
            if (!filterElem) {
                (this.clearFilterIconElem as HTMLElement).style.visibility = 'hidden';
            }
        }
        EventHandler.add(this.filterInput, 'input', this.onInput, this);
        EventHandler.add(this.filterInput, 'keyup', this.KeyUp, this);
        EventHandler.add(this.filterInput, 'keydown', this.onKeyDown, this);
    }

    private selectHandler(e: MouseEvent | { target: EventTarget, ctrlKey?: boolean, shiftKey?: boolean }, isKey?: boolean): void {
        let isSelect: boolean = true;
        let currSelIdx: number;
        let li: Element = closest(e.target as Element, '.' + 'e-list-item');
        let selectedLi: Element[] = [li];
        if (li) {
            currSelIdx = [].slice.call(li.parentElement.children).indexOf(li);
            if (!this.selectionSettings.showCheckbox) {
                if ((e.ctrlKey || Browser.isDevice) && this.isSelected(li)) {
                    li.classList.remove(cssClass.selected);
                    li.removeAttribute('aria-selected');
                    isSelect = false;
                } else if (!(this.selectionSettings.mode === 'Multiple' && (e.ctrlKey || Browser.isDevice))) {
                    this.getSelectedItems().forEach((ele: Element) => {
                        ele.removeAttribute('aria-selected');
                    });
                    removeClass(this.getSelectedItems(), cssClass.selected);
                }
            } else {
                isSelect = !li.getElementsByClassName('e-frame')[0].classList.contains('e-check');
            }
            if (e.shiftKey && !this.selectionSettings.showCheckbox && this.selectionSettings.mode !== 'Single') {
                selectedLi = [].slice.call(li.parentElement.children)
                    .slice(Math.min(currSelIdx, this.prevSelIdx), Math.max(currSelIdx, this.prevSelIdx) + 1)
                    .filter((ele: Element) => { return ele.classList.contains('e-list-item'); });
            } else {
                this.prevSelIdx = [].slice.call(li.parentElement.children).indexOf(li);
            }
            if (isSelect) {
                if (!this.selectionSettings.showCheckbox) {
                    addClass(selectedLi, cssClass.selected);
                }
                selectedLi.forEach((ele: Element) => {
                    ele.setAttribute('aria-selected', 'true');
                });
                this.list.setAttribute('aria-activedescendant', li.id);
            }
            if (!isKey && (this.maximumSelectionLength > (this.value && this.value.length) || !isSelect) &&
                (this.maximumSelectionLength >= (this.value && this.value.length) || !isSelect) &&
                !(this.maximumSelectionLength < (this.value && this.value.length))) {
                this.notify('updatelist', { li: li, e: e, module: 'listbox' });
            }
            if (this.allowFiltering && !isKey) {
                let liDataValue: string = this.getFormattedValue(li.getAttribute('data-value')) as string;
                if (!isSelect) {
                    this.value = (this.value as string[]).filter((value1: string) =>
                        value1 !== liDataValue);
                } else {
                    let values: string[] = [];
                    extend(values, this.value); values.push(liDataValue);
                    this.value = values;
                }
                if (document.querySelectorAll('ul').length < 2) {
                    this.updateMainList();
                }
            }
            this.updateSelectedOptions();
            this.triggerChange(this.getSelectedItems(), e as MouseEvent);
            this.checkMaxSelection();
        }
    }

    private triggerChange(selectedLis: Element[], event: MouseEvent): void {
        this.trigger('change', { elements: selectedLis, items: this.getDataByElements(selectedLis), value: this.value, event: event });
    }

    private getDataByElems(elems: Element[]): Object[] {
        let data: Object[] = [];
        for (let i: number = 0, len: number = elems.length; i < len; i++) {
            data.push(this.getDataByValue(this.getFormattedValue(elems[i].getAttribute('data-value'))));
        }
        return data;
    }
    private getDataByElements(elems: Element[]): Object[] {
        let data: Object[] = []; let value: string | number | boolean; let sIdx: number = 0;
        if (!isNullOrUndefined(this.listData)) {
            let type: string = this.typeOfData(this.listData).typeof as string;
            if (type === 'string' || type === 'number' || type === 'boolean') {
                for (let item of this.listData) {
                    for (let i: number = sIdx, len: number = elems.length; i < len; i++) {
                        value = this.getFormattedValue((elems[i] as Element).getAttribute('data-value'));
                        if (!isNullOrUndefined(item) && item === value as Object) {
                            sIdx = i; data.push(item); break;
                        }
                    }
                    if (elems.length === data.length) {
                        break;
                    }
                }
            } else {
                for (let item of this.listData) {
                    for (let i: number = sIdx, len: number = elems.length; i < len; i++) {
                        value = this.getFormattedValue((elems[i] as Element).getAttribute('data-value'));
                        if (!isNullOrUndefined(item) && getValue((this.fields.value ? this.fields.value : 'value'), item) === value) {
                            sIdx = i; data.push(item); break;
                        }
                    }
                    if (elems.length === data.length) {
                        break;
                    }
                }
            }
            return data;
        }
        return null;
    }
    private checkMaxSelection(): InputObject | void {
        let limit: number = this.list.querySelectorAll('.e-list-item span.e-check').length;
        if (this.selectionSettings.showCheckbox) {
            let index: number = 0;
            let liCollElem: HTMLCollectionOf<HTMLLIElement>;
            liCollElem = this.list.getElementsByClassName('e-list-item') as HTMLCollectionOf<HTMLLIElement>;
            for (index; index < liCollElem.length; index++) {
                if (!liCollElem[index].querySelector('.e-frame.e-check')) {
                    if (limit === this.maximumSelectionLength) {
                        liCollElem[index].classList.add('e-disable');
                    } else if (liCollElem[index].classList.contains('e-disable')) {
                        liCollElem[index].classList.remove('e-disable');
                    }
                }
            }
        }
    }

    private toolbarClickHandler(e: MouseEvent): void {
        let btn: Element = closest(e.target as Element, 'button');
        if (btn) {
            this.toolbarAction = btn.getAttribute('data-value');
            if ((btn as HTMLButtonElement).disabled) {
                return;
            }
            switch (this.toolbarAction) {
                case 'moveUp':
                    this.moveUpDown(true);
                    break;
                case 'moveDown':
                    this.moveUpDown();
                    break;
                case 'moveTo':
                    this.moveItemTo();
                    break;
                case 'moveFrom':
                    this.moveItemFrom();
                    break;
                case 'moveAllTo':
                    this.moveAllItemTo();
                    break;
                case 'moveAllFrom':
                    this.moveAllItemFrom();
                    break;
            }
        }
    }

    private moveUpDown(isUp?: boolean, isKey?: boolean, value?: Element[]): void {
        let elems: Element[] = this.getSelectedItems();
        let tempItems: Object[];
        if (value) {
            elems = value;
        }
        if (((isUp && this.isSelected(this.ulElement.firstElementChild))
            || (!isUp && this.isSelected(this.ulElement.lastElementChild))) && !value ) {
            return;
        }
        tempItems = this.getDataByElems(elems);
        let localDataArgs: { [key: string]: Object } = { cancel: false, items: tempItems, eventName: this.toolbarAction };
        this.trigger('actionBegin', localDataArgs);
        if (localDataArgs.cancel) {
            return;
        }
        (isUp ? elems : elems.reverse()).forEach((ele: Element) => {
            let jsonToIdx: number = Array.prototype.indexOf.call(this.ulElement.querySelectorAll('.e-list-item'), ele);
            let idx: number = Array.prototype.indexOf.call(this.ulElement.children, ele);
            moveTo(this.ulElement, this.ulElement, [idx], isUp ? idx - 1 : idx + 2);
            this.changeData(idx, isUp ? idx - 1 : idx + 1, isUp ? jsonToIdx - 1 : jsonToIdx + 1, ele);
        });
        this.trigger('actionComplete', { items: tempItems, eventName: this.toolbarAction });
        (elems[0] as HTMLElement).focus();
        if (!isKey && this.toolbarSettings.items.length) {
            (this.getToolElem().querySelector('[data-value=' + (isUp ? 'moveUp' : 'moveDown') + ']') as HTMLElement).focus();
        }
        this.updateToolBarState();
    }

    private moveItemTo(): void {
        this.moveData(this, this.getScopedListBox());
    }

    private moveItemFrom(): void {
        this.moveData(this.getScopedListBox(), this);
    }

    /**
     * Called internally if any of the property value changed.
     * @returns void
     * @private
     */
    // tslint:disable-next-line:max-func-body-length
    private moveData(fListBox: ListBox, tListBox: ListBox, isKey?: boolean, value?: Element[], index?: number): void {
        let idx: number[] = []; let dataIdx: number[] = []; let jsonIdx: number[] = []; let sortIdx: number[] = [];
        let listData: dataType[] = [].slice.call(fListBox.listData); let tListData: dataType[] = [].slice.call(tListBox.listData);
        let sortData: dataType[] = [].slice.call(fListBox.sortedData); let tSortData: dataType[] = [].slice.call(tListBox.sortedData);
        let fliCollections: HTMLElement[] = [].slice.call(fListBox.liCollections); let dataLiIdx: number[] = [];
        let tliCollections: HTMLElement[] = [].slice.call(tListBox.liCollections);
        let tempItems: dataType[] = [];
        let data: dataType[] = []; let elems: Element[] = fListBox.getSelectedItems();
        if (value) {
            elems = value;
        }
        let isRefresh: boolean | string = tListBox.sortOrder !== 'None' ||
            (tListBox.selectionSettings.showCheckbox !== fListBox.selectionSettings.showCheckbox) || tListBox.fields.groupBy;
        fListBox.value = [];
        if (elems.length) {
            this.removeSelected(fListBox, elems);
            elems.forEach((ele: Element, i: number) => {
                idx.push(Array.prototype.indexOf.call(fListBox.ulElement.children, ele)); // update sortable elem
                // To update lb view data
                dataLiIdx.push(Array.prototype.indexOf.call(fListBox.ulElement.querySelectorAll('.e-list-item'), ele));
                // To update lb listdata data
                dataIdx.push(Array.prototype.indexOf.call(fListBox.listData, fListBox.getDataByElems([ele])[0]));
                // To update lb sorted data
                sortIdx.push(Array.prototype.indexOf.call(fListBox.sortedData, fListBox.getDataByElems([ele])[0]));
                // To update lb original data
                jsonIdx.push(Array.prototype.indexOf.call(fListBox.jsonData, fListBox.getDataByElems([ele])[0]));
            });
            if (this.sortOrder !== 'None') {
                sortIdx.forEach((i: number) => {
                    tempItems.push(fListBox.sortedData[i]);
                });
            } else {
                jsonIdx.forEach((i: number) => {
                    tempItems.push(fListBox.jsonData[i]);
                });
            }
            let localDataArgs: { [key: string]: Object } = { cancel: false, items: tempItems, eventName: this.toolbarAction };
            fListBox.trigger('actionBegin', localDataArgs);
            if (localDataArgs.cancel) {
            return;
            }
            if (!isBlazor()) {
                let rLiCollection: HTMLElement[] = [];
                dataLiIdx.sort((n1: number, n2: number) => n1 - n2).reverse().forEach((i: number) => {
                    rLiCollection.push(fliCollections.splice(i, 1)[0]);
                });
                fListBox.liCollections = fliCollections;
                if (index) {
                    let toColl: HTMLElement[] = tliCollections.splice(0, index);
                    tListBox.liCollections = toColl.concat(rLiCollection.reverse()).concat(tliCollections);
                } else {
                    tListBox.liCollections = tliCollections.concat(rLiCollection.reverse());
                }
                if (tListBox.listData.length === 0) {
                    let noRecElem: Element = tListBox.ulElement.getElementsByClassName('e-list-nrt')[0];
                    if (noRecElem) {
                        tListBox.ulElement.removeChild(noRecElem);
                    }
                }
            }
            dataIdx.sort((n1: number, n2: number) => n2 - n1).forEach((i: number) => {
                listData.splice(i, 1)[0];
            });
            sortIdx.sort((n1: number, n2: number) => n2 - n1).forEach((i: number) => {
                sortData.splice(i, 1)[0];
            });
            jsonIdx.slice().reverse().forEach((i: number) => {
                data.push(fListBox.jsonData.splice(i, 1)[0]);
            });
            if (!isBlazor()) {
                if (isRefresh) {
                    if (fListBox.fields.groupBy) {
                        fListBox.ulElement.innerHTML = fListBox.renderItems(listData as obj[], fListBox.fields).innerHTML;
                    } else {
                        elems.forEach((ele: Element) => { detach(ele); });
                    }
                } else {
                    moveTo(fListBox.ulElement, tListBox.ulElement, idx, index);
                    fListBox.trigger('actionComplete', { items: tempItems, eventName: this.toolbarAction });
                }
                if (tListBox.mainList.childElementCount !== tListBox.jsonData.length) {
                    tListBox.mainList = tListBox.ulElement;
                }
                fListBox.updateMainList();
            }
            let tJsonData: dataType[] = [].slice.call(tListBox.jsonData);
            tSortData = [].slice.call(tListBox.sortedData);
            if (!isBlazor()) { this.selectNextList(elems, dataLiIdx, dataIdx, fListBox); }
            if (isKey) { this.list.focus(); }
            (fListBox.listData as dataType[]) = listData;
            (fListBox.sortedData as dataType[]) = sortData;
            index = (index) ? index : tListData.length;
            for (let i: number = tempItems.length - 1; i >= 0; i--) {
                tListData.splice(index, 0, tempItems[i]);
                tJsonData.splice(index, 0, tempItems[i]);
                tSortData.splice(index, 0, tempItems[i]);
            }
            (tListBox.listData as dataType[]) = tListData;
            tListBox.jsonData = tJsonData as {[key: string]: object}[];
            tListBox.sortedData = tSortData as {[key: string]: object}[];
            if (isBlazor()) {
                // tslint:disable
                (<any>fListBox).interopAdaptor.invokeMethodAsync('UpdateListData', fListBox.listData).then((): void => {
                    fListBox.updateBlazorListData(null, true);
                    this.selectNextList(elems, dataLiIdx, dataIdx, fListBox);
                    fListBox.updateSelectedOptions();
                });
                (<any>tListBox).interopAdaptor.invokeMethodAsync('UpdateListData', tListBox.listData).then((): void => {
                    if (isRefresh) { tListBox.setSelection(); }
                    tListBox.updateBlazorListData(null, true);
                    fListBox.trigger('actionComplete', { items: tempItems, eventName: this.toolbarAction });
                });
                // tslint:enable
            } else {
                if (isRefresh) {
                    tListBox.ulElement.innerHTML = tListBox.renderItems(tListData as obj[], tListBox.fields).innerHTML;
                    tListBox.setSelection();
                }
                fListBox.updateSelectedOptions();
            }
            if (fListBox.listData.length === 0) {
                // tslint:disable-next-line
                fListBox.l10nUpdate();
            }
        }
        if (fListBox.value.length === 1 && fListBox.getSelectedItems().length) {
            fListBox.value[0] = fListBox.getFormattedValue(fListBox.getSelectedItems()[0].getAttribute('data-value'));
        }
    }

    private selectNextList(elems: Element[], dataLiIdx: number[], dataIdx: number[], inst: ListBox): void {
        let childCnt: number = inst.ulElement.querySelectorAll('.e-list-item').length;
        let ele: Element; let liIdx: number;
        let validIdx: number = -1;
        if (elems.length === 1 && childCnt && !inst.selectionSettings.showCheckbox) {
                liIdx = childCnt <= dataLiIdx[0] ? childCnt - 1 : dataLiIdx[0];
                ele = inst.ulElement.querySelectorAll('.e-list-item')[liIdx];
                validIdx = inst.getValidIndex(ele, liIdx, childCnt === dataIdx[0] ? 38 : 40);
                if (validIdx > -1) {
                    (inst.ulElement.querySelectorAll('.e-list-item')[validIdx].classList.add(cssClass.selected));
                }
            }
    }

    private moveAllItemTo(): void {
        this.moveAllData(this, this.getScopedListBox());
    }

    private moveAllItemFrom(): void {
        this.moveAllData(this.getScopedListBox(), this);
    }

    private moveAllData(fListBox: ListBox, tListBox: ListBox, isKey?: boolean, index?: number): void {
        type sortedType = dataType | { isHeader: boolean };
        let listData: dataType[] = [].slice.call(tListBox.listData);
        let jsonData: {[key: string]: object}[] = [].slice.call(tListBox.jsonData);
        let isRefresh: boolean | string = tListBox.sortOrder !== 'None' ||
            (tListBox.selectionSettings.showCheckbox !== fListBox.selectionSettings.showCheckbox) || tListBox.fields.groupBy;
        this.removeSelected(fListBox, fListBox.getSelectedItems());
        let tempItems: Object[] = [].slice.call(fListBox.jsonData);
        let localDataArgs: { [key: string]: Object } = { cancel: false, items: tempItems, eventName: this.toolbarAction };
        fListBox.trigger('actionBegin', localDataArgs);
        if (localDataArgs.cancel) {
            return;
        }
        if (!isBlazor()) {
            if (tListBox.listData.length === 0) {
                let noRecElem: Element = tListBox.ulElement.getElementsByClassName('e-list-nrt')[0];
                if (noRecElem) {
                    tListBox.ulElement.removeChild(noRecElem);
                }
            }
            if (isRefresh) {
                let noRecElem: Element = fListBox.ulElement.getElementsByClassName('e-list-nrt')[0];
                if (noRecElem) {
                    fListBox.ulElement.removeChild(noRecElem);
                }
            } else {
                moveTo(
                    fListBox.ulElement,
                    tListBox.ulElement,
                    Array.apply(null, { length: fListBox.ulElement.childElementCount }).map(Number.call, Number), index);
                this.trigger('actionComplete', { items: tempItems, eventName: this.toolbarAction });
            }
        }
        if (isKey) { this.list.focus(); }
        index = (index) ? index : listData.length;
        for (let i: number = 0; i < fListBox.listData.length; i++) {
            listData.splice(index + i, 0, fListBox.listData[i]);
        }
        for (let i: number = 0; i < fListBox.jsonData.length; i++) {
            jsonData.splice(index + i, 0, fListBox.jsonData[i] as {[key: string]: object});
        }
        if (!isBlazor()) {
            let fliCollections: HTMLElement[] = [].slice.call(fListBox.liCollections);
            let tliCollections: HTMLElement[] = [].slice.call(tListBox.liCollections);
            fListBox.liCollections = [];
            if (index) {
                let toColl: HTMLElement[] = tliCollections.splice(0, index);
                tListBox.liCollections = toColl.concat(fliCollections).concat(tliCollections);
            } else {
                tListBox.liCollections = tliCollections.concat(fliCollections);
            }
        }
        fListBox.value = [];
        (listData as sortedType[]) = (listData as sortedType[])
        .filter((data: sortedType) => (data as { isHeader: boolean }).isHeader !== true);
        (tListBox.listData as dataType[]) = listData;
        tListBox.jsonData = jsonData;
        fListBox.listData = fListBox.sortedData = fListBox.jsonData = [];
        if (isBlazor()) {
            if (!isRefresh) { (tListBox.sortedData as dataType[]) = listData; }
            // tslint:disable
            (<any>fListBox).interopAdaptor.invokeMethodAsync('UpdateListData', fListBox.listData).then((): void => {
                fListBox.updateBlazorListData(null, true);
                fListBox.updateSelectedOptions();
            });
            (<any>tListBox).interopAdaptor.invokeMethodAsync('UpdateListData', tListBox.listData).then((): void => {
                tListBox.updateBlazorListData(null, true);
                fListBox.updateSelectedOptions();
                fListBox.trigger('actionComplete', { items: tempItems, eventName: this.toolbarAction });
            });
            // tslint:enable
        } else {
            if (isRefresh) {
                tListBox.ulElement.innerHTML = tListBox.renderItems(listData as obj[], tListBox.fields).innerHTML;
                this.trigger('actionComplete', { items: tempItems, eventName: this.toolbarAction });
            } else {
                (tListBox.sortedData as dataType[]) = listData;
            }
            fListBox.updateSelectedOptions();
        }
        if (fListBox.listData.length === 0) {
            // tslint:disable-next-line
            fListBox.l10nUpdate();
        }
    }

    private changeData(fromIdx: number, toIdx: number, jsonToIdx: number, ele: Element): void {
        let listData: obj[] = [].slice.call(this.listData);
        let jsonData: obj[] = [].slice.call(this.jsonData);
        let sortData: obj[] = [].slice.call(this.sortedData);
        let jsonIdx: number = Array.prototype.indexOf.call(this.jsonData, this.getDataByElems([ele])[0]);
        let sortIdx: number = Array.prototype.indexOf.call(this.sortedData, this.getDataByElems([ele])[0]);
        let liColl: HTMLElement[] = [].slice.call(this.liCollections);
        listData.splice(toIdx, 0, listData.splice(fromIdx, 1)[0] as obj);
        jsonData.splice(jsonToIdx, 0, jsonData.splice(jsonIdx, 1)[0] as obj);
        sortData.splice(toIdx, 0, sortData.splice(sortIdx, 1)[0] as obj);
        liColl.splice(toIdx, 0, liColl.splice(fromIdx, 1)[0] as HTMLElement);
        this.listData = listData;
        this.jsonData = jsonData;
        this.liCollections = liColl;
        this.sortedData = sortData;
    }

    private getSelectedItems(): Element[] {
        let ele: Element[] = [];
        if (this.selectionSettings.showCheckbox) {
            [].slice.call(this.ulElement.getElementsByClassName('e-check')).forEach((cbox: Element) => {
                ele.push(closest(cbox, '.' + 'e-list-item'));
            });
        } else {
            ele = [].slice.call(this.ulElement.getElementsByClassName(cssClass.selected));
        }
        return ele;
    }

    private getScopedListBox(): ListBox {
        let listObj: ListBox;
        if (this.scope) {
            [].slice.call(document.querySelectorAll(this.scope)).forEach((ele: Element) => {
                if (getComponent(ele as HTMLElement, this.getModuleName())) {
                    listObj = getComponent(ele as HTMLElement, this.getModuleName());
                }
            });
        }
        return listObj;
    }

    private getDragArgs(args: DragEventArgs & BlazorDragEventArgs, isDragEnd?: boolean): DragEventArgs & BlazorDragEventArgs {
        let elems: Element[] = this.getSelectedItems();
        if (elems.length) {
            elems.pop();
            if (isDragEnd) {
                elems.push(args.target);
            }
        } else {
            elems = [args.target];
        }
        if (isBlazor()) {
            return { elements: elems, items: this.getDataByElems(elems), bindEvents: args.bindEvents,
                dragElement: args.dragElement };
        } else {
            return { elements: elems, items: this.getDataByElems(elems) } as DragEventArgs & BlazorDragEventArgs;
        }
    }

    private onKeyDown(e: KeyboardEvent): void {
        this.keyDownHandler(e);
        event.stopPropagation();
    }

    private keyDownStatus: boolean = false;

    private keyDownHandler(e: KeyboardEvent): void {
        if ([32, 35, 36, 37, 38, 39, 40, 65].indexOf(e.keyCode) > -1 && !this.allowFiltering) {
            e.preventDefault();
            if (e.keyCode === 32 && this.ulElement.children.length) {
                this.selectHandler({
                    target: this.ulElement.getElementsByClassName('e-focused')[0],
                    ctrlKey: e.ctrlKey, shiftKey: e.shiftKey
                });
            } else if (e.keyCode === 65 && e.ctrlKey) {
                this.selectAll();
            } else if ((e.keyCode === 38 || e.keyCode === 40) && e.ctrlKey && e.shiftKey) {
                this.moveUpDown(e.keyCode === 38 ? true : false, true);
            } else if ((this.toolbarSettings.items.length || this.tBListBox) && (e.keyCode === 39 || e.keyCode === 37) && e.ctrlKey) {
                let listObj: ListBox = this.tBListBox || this.getScopedListBox();
                if (e.keyCode === 39) {
                    e.shiftKey ? this.moveAllData(this, listObj, true) : this.moveData(this, listObj, true);
                } else {
                    e.shiftKey ? this.moveAllData(listObj, this, true) : this.moveData(listObj, this, true);
                }
            } else if (e.keyCode !== 37 && e.keyCode !== 39) {
                this.upDownKeyHandler(e);
            }
        } else if (this.allowFiltering) {
            if (e.keyCode === 40 || e.keyCode === 38) {
                this.upDownKeyHandler(e);
            }
        }
    }

    private upDownKeyHandler(e: KeyboardEvent): void {
        let ul: Element = this.ulElement;
        let defaultIdx: number = (e.keyCode === 40 || e.keyCode === 36) ? 0 : ul.childElementCount - 1;
        let fliIdx: number = defaultIdx;
        let fli: Element = ul.getElementsByClassName('e-focused')[0] || ul.getElementsByClassName(cssClass.selected)[0];
        if (fli) {
            if (e.keyCode !== 35 && e.keyCode !== 36) {
                fliIdx = Array.prototype.indexOf.call(ul.children, fli);
                e.keyCode === 40 ? fliIdx++ : fliIdx--;
                if (fliIdx < 0 || fliIdx > ul.childElementCount - 1) {
                    return;
                }
            }
            removeClass([fli], 'e-focused');
        }
        let cli: Element = ul.children[fliIdx];
        if (cli) {
            fliIdx = this.getValidIndex(cli, fliIdx, e.keyCode);
            if (fliIdx === -1) {
                addClass([fli], 'e-focused');
                return;
            }
            (ul.children[fliIdx] as HTMLElement).focus();
            ul.children[fliIdx].classList.add('e-focused');
            if (!e.ctrlKey) {
                this.selectHandler({ target: ul.children[fliIdx], ctrlKey: e.ctrlKey, shiftKey: e.shiftKey }, true);
            }
        }
    }

    private KeyUp(e: KeyboardEvent): void {
        let char: string = String.fromCharCode(e.keyCode);
        let isWordCharacter: Object = char.match(/\w/);
        if (!isNullOrUndefined(isWordCharacter)) {
            this.isValidKey = true;
        }
        this.isValidKey = (e.keyCode === 8) || this.isValidKey;
        if (this.isValidKey) {
            this.isValidKey = false;
            switch (e.keyCode) {
                default:
                    let text: string = this.targetElement();
                    let keyCode: number = e.keyCode;
                    if (this.allowFiltering) {
                        let eventArgsData: { [key: string]: Object } = {
                            preventDefaultAction: false,
                            text: this.targetElement(),
                            updateData: (
                                dataSource: {
                                    [key: string]: Object
                                }[] | DataManager | string[] | number[], query?: Query, fields?: FieldSettingsModel) => {
                                if (eventArgsData.cancel) { return; }
                                this.isFiltered = true;
                                this.remoteFilterAction = true;
                                this.dataUpdater(dataSource, query, fields);
                            },
                            event: e,
                            cancel: false
                        };
                        this.trigger('filtering', eventArgsData, (args: FilteringEventArgs) => {
                            this.isDataFetched = false;
                            if (eventArgsData.cancel || (this.filterInput.value !== '' && this.isFiltered)) {
                                return;
                            }
                            if (!eventArgsData.cancel && !this.isCustomFiltering && !eventArgsData.preventDefaultAction) {
                                this.inputString = this.filterInput.value;
                                this.filteringAction(this.jsonData, new Query(), this.fields);
                            }
                            if (!this.isFiltered && !this.isCustomFiltering && !eventArgsData.preventDefaultAction) {
                                this.dataUpdater(this.jsonData, new Query(), this.fields);
                            }
                        });
                    }
            }
        }
    }
    /**
     * To filter the data from given data source by using query
     * @param  {Object[] | DataManager } dataSource - Set the data source to filter.
     * @param  {Query} query - Specify the query to filter the data.
     * @param  {FieldSettingsModel} fields - Specify the fields to map the column in the data table.
     * @return {void}.
     */
    public filter(
        dataSource: { [key: string]: Object }[] | DataManager | string[] | number[] | boolean[],
        query?: Query, fields?: FieldSettingsModel): void {
        this.isCustomFiltering = true;
        this.filteringAction(dataSource, query, fields);
    }

    private filteringAction(
        dataSource: { [key: string]: Object }[] | DataManager | string[] | number[] | boolean[],
        query?: Query, fields?: FieldSettingsModel): void {
            this.resetList(dataSource, fields, query);
    }


    protected targetElement(): string {
        this.targetInputElement = this.list.getElementsByClassName('e-input-filter')[0] as HTMLInputElement;
        return this.targetInputElement.value;
    }

    private dataUpdater(
        dataSource: { [key: string]: Object }[] | DataManager | string[] | number[] | boolean[],
        query?: Query, fields?: FieldSettingsModel): void {
        this.isDataFetched = false;
        let backCommand: boolean = true;
        if (this.targetElement().trim() === '') {
            let list: HTMLElement = this.mainList.cloneNode ? <HTMLElement>this.mainList.cloneNode(true) : this.mainList;
            if (backCommand) {
                this.remoteCustomValue = false;
                this.onActionComplete(list, this.jsonData as { [key: string]: Object }[] | string[] | number[] | boolean[]);
                this.notify('reOrder', { module: 'CheckBoxSelection', enable: this.selectionSettings.showCheckbox, e: this });
            }
        } else {
            this.resetList(dataSource, fields, query);
        }
    }

    private focusOutHandler(): void {
        let ele: Element = this.list.getElementsByClassName('e-focused')[0];
        if (ele) {
            ele.classList.remove('e-focused');
        }
        if (this.allowFiltering) {
            this.refreshClearIcon();
        }
    }

    private getValidIndex(cli: Element, index: number, keyCode: number): number {
        let cul: Element = this.ulElement;
        if (cli.classList.contains('e-disabled') || cli.classList.contains(cssClass.group)) {
            (keyCode === 40 || keyCode === 36) ? index++ : index--;
        }
        if (index < 0 || index === cul.childElementCount) {
            return -1;
        }
        cli = cul.querySelectorAll('.e-list-item')[index];
        if (cli.classList.contains('e-disabled') || cli.classList.contains(cssClass.group)) {
            index = this.getValidIndex(cli, index, keyCode);
        }
        return index;
    }

    private updateSelectedOptions(): void {
        let selectedOptions: string[] = [];
        let values: string[] = [];
        extend(values, this.value as string[]);
        this.getSelectedItems().forEach((ele: Element) => {
            if (!ele.classList.contains('e-grabbed')) {
                selectedOptions.push(this.getFormattedValue(ele.getAttribute('data-value')) as string);
            }
        });
        if (this.mainList.childElementCount === this.ulElement.childElementCount) {
            if (this.allowFiltering && this.selectionSettings.showCheckbox) {
                for (let i: number = 0; i < selectedOptions.length; i++) {
                    if (values.indexOf(selectedOptions[i]) > -1) {
                        continue;
                    } else {
                        values.push(selectedOptions[i]);
                    }
                }
                this.setProperties({ value: values }, true);
            } else {
                this.setProperties({ value: selectedOptions }, true);
            }

        }
        this.updateSelectTag();
        this.updateToolBarState();
        if (this.tBListBox) {
            this.tBListBox.updateToolBarState();
        }
    }

    private clearSelection(values: (string | number | boolean)[] = this.value): void {
        if (this.selectionSettings.showCheckbox) {
            let dvalue: string | number | boolean;
            this.getSelectedItems().forEach((li: Element) => {
                dvalue = this.getFormattedValue(li.getAttribute('data-value'));
                if (values.indexOf(dvalue) < 0) {
                    li.getElementsByClassName('e-check')[0].classList.remove('e-check');
                    li.getElementsByClassName('e-checkbox-wrapper')[0].removeAttribute('aria-checked');
                    li.removeAttribute('aria-selected');
                }
            });
        }
    };

    private setSelection(
        values: (string | boolean | number | object)[] = this.value, isSelect: boolean = true, isText: boolean = false): void {
        let li: Element;
        let liselect: boolean;
        if (values) {
            values.forEach((value: string) => {
                let text: string | number | boolean;
                if (isText) {
                    if (isBlazor() && typeof(value) === 'object') {
                        text = (value as { [key: string]: string })[this.fields.text || 'text'];
                        if (isNullOrUndefined(text)) { return; }
                        text = this.getValueByText(text);
                    } else {
                        text = this.getValueByText(value);
                    }
                } else {
                    text = value;
                }
                li = this.list.querySelector('[data-value="' + text + '"]');
                if (li) {
                    if (this.selectionSettings.showCheckbox) {
                        liselect = li.getElementsByClassName('e-frame')[0].classList.contains('e-check');
                    } else {
                        liselect = li.classList.contains('e-selected');
                    }
                    if (!isSelect && liselect || isSelect && !liselect && li) {
                        if (this.selectionSettings.showCheckbox) {
                            this.notify('updatelist', { li: li, module: 'listbox' });
                        } else {
                            if (isSelect) {
                                li.classList.add(cssClass.selected);
                                li.setAttribute('aria-selected', 'true');
                            } else {
                                li.classList.remove(cssClass.selected);
                                li.removeAttribute('aria-selected');
                            }
                        }
                    }
                }
            });
        }
        this.updateSelectTag();
    }

    private updateSelectTag(): void {
        let ele: Element = this.getSelectTag(); let innerHTML: string = '';
        ele.innerHTML = '';
        if (this.value) {
            for (let i: number = 0, len: number = this.value.length; i < len; i++) {
                innerHTML += '<option selected value="' + this.value[i] + '"></option>';
            }
            ele.innerHTML += innerHTML;
        }
        this.checkSelectAll();
    }

    private checkDisabledState(inst: ListBox): boolean {
        return (isBlazor() ? inst.ulElement.querySelectorAll('.' + cssClass.li).length : inst.ulElement.childElementCount) === 0;
    }

    private updateToolBarState(): void {
        if (this.toolbarSettings.items.length) {
            let listObj: ListBox = this.getScopedListBox();
            let wrap: Element = this.list.parentElement.getElementsByClassName('e-listbox-tool')[0];
            this.toolbarSettings.items.forEach((value: string) => {
                let btn: HTMLButtonElement = wrap.querySelector('[data-value="' + value + '"]');
                switch (value) {
                    case 'moveAllTo':
                        btn.disabled = this.checkDisabledState(this);
                        break;
                    case 'moveAllFrom':
                        btn.disabled = this.checkDisabledState(listObj);
                        break;
                    case 'moveFrom':
                        btn.disabled = listObj.value && listObj.value.length ? false : true;
                        break;
                    case 'moveUp':
                        btn.disabled = this.value && this.value.length
                            && !this.isSelected(this.ulElement.children[0]) ? false : true;
                        break;
                    case 'moveDown':
                        btn.disabled = this.value && this.value.length
                            && !this.isSelected(this.ulElement.children[this.ulElement.childElementCount - 1]) ? false : true;
                        break;
                    default:
                        btn.disabled = this.value && this.value.length ? false : true;
                        break;
                }
            });
        }
    }

    private setCheckboxPosition(): void {
        let listWrap: HTMLElement = this.list;
        if (!this.initLoad && this.selectionSettings.checkboxPosition === 'Left') {
            listWrap.classList.remove('e-right');
        }
        if (this.selectionSettings.checkboxPosition === 'Right') {
            listWrap.classList.add('e-right');
        }
    }

    private showCheckbox(showCheckbox: boolean): void {
        let index: number = 0;
        let liColl: NodeListOf<Element> = this.list.lastElementChild.querySelectorAll('li');
        let liCollLen: number = this.list.lastElementChild.getElementsByClassName('e-list-item').length;
        if (showCheckbox) {
            if (!isBlazor()) {
                this.ulElement = this.renderItems(this.listData as obj[], this.fields);
                this.mainList = this.ulElement;
                this.list.removeChild(this.list.getElementsByTagName('ul')[0]);
                this.list.appendChild(this.ulElement);
            }
            if (this.selectionSettings.showSelectAll && !this.list.getElementsByClassName('e-selectall-parent')[0]) {
                let l10nShow: L10n = new L10n(
                    this.getModuleName(), { selectAllText: 'Select All', unSelectAllText: 'Unselect All' }, this.locale);
                this.showSelectAll = true;
                this.selectAllText = l10nShow.getConstant('selectAllText');
                this.unSelectAllText = l10nShow.getConstant('unSelectAllText');
                this.popupWrapper = this.list;
                this.checkBoxSelectionModule.checkAllParent = null;
                this.notify('selectAll', {});
                this.checkSelectAll();
            }
        } else {
            if (this.list.getElementsByClassName('e-selectall-parent')[0]) {
                this.list.removeChild(this.list.getElementsByClassName('e-selectall-parent')[0]);
            }
            if (!isBlazor()) {
                for (index; index < liCollLen; index++) {
                    if (liColl[index].classList.contains('e-list-item')) {
                        liColl[index].removeChild(liColl[index].getElementsByClassName('e-checkbox-wrapper')[0]);
                    }
                    if (liColl[index].hasAttribute('aria-selected')) {
                        liColl[index].removeAttribute('aria-selected');
                    }
                }
                this.mainList = this.ulElement;
            }
        }
        this.value = [];
    }

    private isSelected(ele: Element): boolean {
        if (!isNullOrUndefined(ele)) {
            return ele.classList.contains(cssClass.selected) || ele.querySelector('.e-check') !== null;
        } else {
            return false;
        }
    }

    private getSelectTag(): Element {
        return this.list.getElementsByClassName('e-hidden-select')[0];
    }

    private getToolElem(): Element {
        return this.list.parentElement.getElementsByClassName('e-listbox-tool')[0];
    }

    private formResetHandler(): void {
        this.value = this.initialSelectedOptions;
    }

    /**
     * Return the module name.
     * @private
     */
    public getModuleName(): string {
        return 'listbox';
    }

    /**
     * Get the properties to be maintained in the persisted state.
     */
    protected getPersistData(): string {
        return this.addOnPersist(['value']);
    }

    protected getLocaleName(): string {
        return 'listbox';
    };

    public destroy(): void {
        if (this.itemTemplate) {
            resetBlazorTemplate(`${this.element.id}${ITEMTEMPLATE_PROPERTY}`, ITEMTEMPLATE_PROPERTY);
        }
        this.unwireEvents();
        if (this.element.tagName === 'EJS-LISTBOX') {
            this.element.innerHTML = '';
        } else {
            if (!isBlazor() || (isBlazor() && !this.isServerRendered)) {
                this.element.style.display = 'inline-block';
                if (this.toolbarSettings.items.length) {
                    this.list.parentElement.parentElement.insertBefore(this.list, this.list.parentElement);
                    detach(this.list.nextElementSibling);
                }
                this.list.parentElement.insertBefore(this.element, this.list);
            }
        }
        if (!isBlazor() || (isBlazor() && !this.isServerRendered)) {
            super.destroy();
        }
    }

    /**
     * Called internally if any of the property value changed.
     * @returns void
     * @private
     */
    // tslint:disable-next-line:max-func-body-length
    public onPropertyChanged(newProp: ListBoxModel, oldProp: ListBoxModel): void {
        let wrap: Element = this.toolbarSettings.items.length ? this.list.parentElement : this.list;
        super.onPropertyChanged(newProp, oldProp);
        this.setUpdateInitial(['fields', 'query', 'dataSource'], newProp as { [key: string]: string; });
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'cssClass':
                    if (oldProp.cssClass) {
                        removeClass([wrap], oldProp.cssClass.split(' '));
                    }
                    if (newProp.cssClass) {
                        addClass([wrap], newProp.cssClass.split(' '));
                    }
                    break;
                case 'enableRtl':
                    if (newProp.enableRtl) {
                        wrap.classList.add('e-rtl');
                    } else {
                        wrap.classList.remove('e-rtl');
                    }
                    break;
                case 'value':
                    removeClass(this.list.querySelectorAll('.' + cssClass.selected), cssClass.selected);
                    this.clearSelection(this.value);
                    this.setSelection();
                    break;
                case 'height':
                    this.setHeight();
                    break;
                case 'enabled':
                    this.setEnable();
                    break;
                case 'allowDragAndDrop':
                    if (newProp.allowDragAndDrop) {
                        this.initDraggable();
                    } else {
                        (getComponent(this.ulElement, 'sortable') as Sortable).destroy();
                    }
                    break;
                case 'allowFiltering':
                    if (this.allowFiltering) {
                        this.setFiltering();
                    } else {
                        this.list.removeChild(this.list.getElementsByClassName('e-filter-parent')[0]);
                        this.filterParent = null;
                        removeClass([this.list], 'e-filter-list');
                    }
                    break;
                case 'filterBarPlaceholder':
                    if (this.allowFiltering) {
                        if (this.filterInput) { Input.setPlaceholder(newProp.filterBarPlaceholder, this.filterInput as HTMLInputElement); }
                    }
                    break;
                case 'scope':
                    if (this.allowDragAndDrop) {
                        (getComponent(this.ulElement, 'sortable') as Sortable).scope = newProp.scope;
                    }
                    if (this.toolbarSettings.items.length) {
                        if (oldProp.scope) {
                            (getComponent(document.querySelector(oldProp.scope) as HTMLElement, this.getModuleName()) as ListBox)
                                .tBListBox = null;
                        }
                        if (newProp.scope) {
                            (getComponent(document.querySelector(newProp.scope) as HTMLElement, this.getModuleName()) as ListBox)
                                .tBListBox = this;
                        }
                    }
                    break;
                case 'toolbarSettings':
                    let ele: Element;
                    let pos: string = newProp.toolbarSettings.position;
                    let toolElem: Element = this.getToolElem();
                    if (pos) {
                        removeClass([wrap], ['e-right', 'e-left']);
                        wrap.classList.add('e-' + pos.toLowerCase());
                        if (pos === 'Left') {
                            wrap.insertBefore(toolElem, this.list);
                        } else {
                            wrap.appendChild(toolElem);
                        }
                    }
                    if (newProp.toolbarSettings.items) {
                        if (oldProp.toolbarSettings.items.length) {
                            ele = this.list.parentElement;
                            ele.parentElement.insertBefore(this.list, ele);
                            detach(ele);
                        }
                        this.initToolbarAndStyles();
                        this.wireToolbarEvent();
                    }
                    break;
                case 'selectionSettings':
                    let showSelectAll: boolean = newProp.selectionSettings.showSelectAll;
                    let showCheckbox: boolean = newProp.selectionSettings.showCheckbox;
                    if (!isNullOrUndefined(showSelectAll)) {
                        this.showSelectAll = showSelectAll;
                        if (this.showSelectAll) {
                            let l10nSel: L10n = new L10n(
                                this.getModuleName(), { selectAllText: 'Select All', unSelectAllText: 'Unselect All' }, this.locale);
                            this.checkBoxSelectionModule.checkAllParent = null;
                            this.showSelectAll = true;
                            this.selectAllText = l10nSel.getConstant('selectAllText');
                            this.unSelectAllText = l10nSel.getConstant('selectAllText');
                            this.popupWrapper = this.list;
                        }
                        this.notify('selectAll', {});
                        this.checkSelectAll();
                    }
                    if (!isNullOrUndefined(showCheckbox)) {
                        this.showCheckbox(showCheckbox);
                    }
                    if (this.selectionSettings.showCheckbox) {
                        this.setCheckboxPosition();
                    }
                    break;
                case 'dataSource':
                    this.jsonData = [].slice.call(this.dataSource);
                    break;
            }
        }
    }
}

/**
 * Interface for before item render event.
 */
export interface BeforeItemRenderEventArgs extends BaseEventArgs {
    element: Element;
    item: { [key: string]: Object };
}

/**
 * Interface for drag and drop event args.
 */
export interface SourceDestinationModel {
    previousData?: string[] | boolean[] | number[] | { [key: string]: Object; }[] | DataManager;
    currentData?: string[] | boolean[] | number[] | { [key: string]: Object; }[] | DataManager;
}

/**
 * Interface for drag and drop event.
 */
export interface DragEventArgs {
    elements: Element[];
    items: Object[];
    target?: Element;
    dragSelected?: boolean;
    previousItem?: object[];
    source?: SourceDestinationModel;
    destination?: SourceDestinationModel;
}

/**
 * Interface for change event args.
 */
export interface ListBoxChangeEventArgs extends BaseEventArgs {
    elements: Element[];
    items: Object[];
    value: number | string | boolean;
    event: Event;
}

/**
 * Interface for change event args.
 */
export interface DropEventArgs {
    previousIndex: number;
    currentIndex: number;
    droppedElement: Element;
    target: Element;
    helper: Element;
    cancel?: boolean;
    items?: Object[];
}
interface ListBoxClassList {
    backIcon: string;
    filterBarClearIcon: string;
    filterInput: string;
    filterParent: string;
    clearIcon: string;
}
const listBoxClasses: ListBoxClassList = {
    backIcon: 'e-input-group-icon e-back-icon e-icons',
    filterBarClearIcon: 'e-input-group-icon e-clear-icon e-icons',
    filterInput: 'e-input-filter',
    filterParent: 'e-filter-parent',
    clearIcon: 'e-clear-icon',
};
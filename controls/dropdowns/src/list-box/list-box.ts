
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path='../drop-down-base/drop-down-base-model.d.ts'/>
import { Input, InputObject } from '@syncfusion/ej2-inputs';
import { DropDownBase, dropDownBaseClasses, FilteringEventArgs, SelectEventArgs } from '../drop-down-base/drop-down-base';
import { FieldSettingsModel } from '../drop-down-base/drop-down-base-model';
import { EventHandler, closest, removeClass, addClass, Complex, Property, ChildProperty, BaseEventArgs, L10n, setValue } from '@syncfusion/ej2-base';
import { ModuleDeclaration, NotifyPropertyChanges, getComponent, EmitType, Event, extend, detach, attributes } from '@syncfusion/ej2-base';
import { getUniqueID, Browser, formatUnit, isNullOrUndefined, getValue } from '@syncfusion/ej2-base';
import { prepend, append } from '@syncfusion/ej2-base';
import { cssClass, Sortable, moveTo, SortOrder } from '@syncfusion/ej2-lists';
import { SelectionSettingsModel, ListBoxModel, ToolbarSettingsModel } from './list-box-model';
import { Button } from '@syncfusion/ej2-buttons';
import { createSpinner, showSpinner, hideSpinner, getZindexPartial } from '@syncfusion/ej2-popups';
import { DataManager, Query } from '@syncfusion/ej2-data';
/**
 * Defines the selection mode in ListBox component.
 * ```props
 * Multiple :- Specifies that the ListBox should allow multiple item selection.
 * Single :- Specifies that the ListBox should allow single item selection.
 * ```
 */
export type SelectionMode = 'Multiple' | 'Single';
/**
 * Defines the position of the toolbar in ListBox component.
 * ```props
 * Left :- Specifies that the toolbar should be positioned to the left of the ListBox.
 * Right :- Specifies that the toolbar should be positioned to the right of the ListBox.
 * ```
 */
export type ToolBarPosition = 'Left' | 'Right';
/**
 * Defines the position of the checkbox in ListBox component.
 * ```props
 * Left :- Specifies that the checkbox should be positioned to the left of the ListBox.
 * Right :- Specifies that the checkbox should be positioned to the right of the ListBox.
 * ```
 */
export type CheckBoxPosition = 'Left' | 'Right';

type dataType = { [key: string]: object } | string | boolean | number;
type obj = { [key: string]: object };
/**
 * Defines the Selection settings of List Box.
 */
export class SelectionSettings extends ChildProperty<SelectionSettings> {
    /**
     * Specifies the selection modes. The possible values are
     * * `Single`: Allows you to select a single item in the ListBox.
     * * `Multiple`: Allows you to select more than one item in the ListBox.
     *
     * @default 'Multiple'
     */
    @Property('Multiple')
    public mode: SelectionMode;

    /**
     * If 'showCheckbox' is set to true, then 'checkbox' will be visualized in the list item.
     *
     * @default false
     */
    @Property(false)
    public showCheckbox: boolean;

    /**
     * Allows you to either show or hide the selectAll option on the component.
     *
     * @default false
     */
    @Property(false)
    public showSelectAll: boolean;

    /**
     * Set the position of the checkbox.
     *
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
     *
     * @default []
     */
    @Property([])
    public items: string[];

    /**
     * Positions the toolbar before/after the ListBox.
     * The possible values are:
     * * Left: The toolbar will be positioned to the left of the ListBox.
     * * Right: The toolbar will be positioned to the right of the ListBox.
     *
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
    private isDataSourceUpdate: boolean = false;
    private dragValue: string;
    private customDraggedItem: Object[];
    private timer: number;
    private inputFormName: string;
    /**
     * Sets the CSS classes to root element of this component, which helps to customize the
     * complete styles.
     *
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Sets the specified item to the selected state or gets the selected item in the ListBox.
     *
     * @default []
     * @aspType object
     * @isGenericType true
     */
    @Property([])
    public value: string[] | number[] | boolean[];

    /**
     * Sets the height of the ListBox component.
     *
     * @default ''
     */
    @Property('')
    public height: number | string;

    /**
     * Specifies a value that indicates whether the component is enabled or not.
     *
     * @default true
     * @deprecated
     */
    @Property(true)
    public enabled: boolean;

    /**
     * Enable or disable persisting component's state between page reloads.
     * If enabled, following list of states will be persisted.
     * 1. value
     *
     * @default false
     * @deprecated
     */
    @Property(false)
    public enablePersistence: boolean;

    /**
     * If 'allowDragAndDrop' is set to true, then you can perform drag and drop of the list item.
     * ListBox contains same 'scope' property enables drag and drop between multiple ListBox.
     *
     * @default false
     */
    @Property(false)
    public allowDragAndDrop: boolean;

    /**
     * Sets limitation to the value selection.
     * based on the limitation, list selection will be prevented.
     *
     * @default 1000
     */
    @Property(1000)
    public maximumSelectionLength: number;

    /**
     * To enable the filtering option in this component.
     * Filter action performs when type in search box and collect the matched item through `filtering` event.
     * If searching character does not match, `noRecordsTemplate` property value will be shown.
     *
     * @default false
     */
    @Property(false)
    public allowFiltering: boolean;

    /**
     * Defines the scope value to group sets of draggable and droppable ListBox.
     * A draggable with the same scope value will be accepted by the droppable.
     *
     * @default ''
     */
    @Property('')
    public scope: string;

    /**
     * When set to ‘false’, consider the `case-sensitive` on performing the search to find suggestions.
     * By default consider the casing.
     *
     * @default true
     * @private
     */
    @Property(true)
    public ignoreCase: boolean;

    /**
     * Accepts the value to be displayed as a watermark text on the filter bar.
     *
     * @default null
     */
    @Property(null)
    public filterBarPlaceholder: string;

    /**
     * Specifies the `sortOrder` to sort the data source. The available type of sort orders are
     * * `None` - The data source is not sorting.
     * * `Ascending` - The data source is sorting with ascending order.
     * * `Descending` - The data source is sorting with descending order.
     *
     * @default null
     * @asptype object
     * @aspjsonconverterignore
     */
    @Property<SortOrder>('None')
    public sortOrder: SortOrder;

    /**
     * Triggers while rendering each list item.
     *
     * @event beforeItemRender
     * @blazorProperty 'OnItemRender'
     */
    @Event()
    public beforeItemRender: EmitType<BeforeItemRenderEventArgs>;

    /**
     * Triggers on typing a character in the component.
     *
     * @event filtering
     * @blazorProperty 'ItemSelected'
     */
    @Event()
    public filtering: EmitType<FilteringEventArgs>;

    /**
     * Triggers when an item in the popup is selected by the user either with mouse/tap or with keyboard navigation.
     *
     * @event select
     * @private
     */
    @Event()
    public select: EmitType<SelectEventArgs>;

    /**
     * Adds a new item to the popup list. By default, new item appends to the list as the last item,
     * but you can insert based on the index parameter.
     *
     * @param  { Object[] } items - Specifies an array of JSON data or a JSON data.
     * @param { number } itemIndex - Specifies the index to place the newly added item in the popup list.
     * @returns {void}.
     * @private
     */
    public addItem(
        items: { [key: string]: Object }[] | { [key: string]: Object } | string | boolean | number | string[] | boolean[] | number[],
        itemIndex?: number): void {
        super.addItem(items, itemIndex);
        if (this.allowFiltering && this.filterInput.value !== '') {
            this.filteringAction(this.jsonData, new Query(), this.fields);
        }
    }

    /**
     * Triggers while select / unselect the list item.
     *
     * @event change
     * @blazorProperty 'ValueChange'
     */
    @Event()
    public change: EmitType<ListBoxChangeEventArgs>;

    /**
     * Triggers before dropping the list item on another list item.
     *
     * @event beforeDrop
     * @blazorProperty 'OnDrop'
     */
    @Event()
    public beforeDrop: EmitType<DropEventArgs>;

    /**
     * Triggers after dragging the list item.
     *
     * @event dragStart
     * @blazorProperty 'DragStart'
     */
    @Event()
    public dragStart: EmitType<DragEventArgs>;

    /**
     * Triggers while dragging the list item.
     *
     * @event drag
     * @blazorProperty 'Dragging'
     */
    @Event()
    public drag: EmitType<DragEventArgs>;

    /**
     * Triggers before dropping the list item on another list item.
     *
     * @event drop
     * @blazorProperty 'Dropped'
     */
    @Event()
    public drop: EmitType<DragEventArgs>;

    /**
     * Triggers when data source is populated in the list.
     *
     * @event dataBound
     */
    @Event()
    public dataBound: EmitType<Object>;

    /**
     * Accepts the template design and assigns it to the group headers present in the list.
     *
     * @default null
     * @private
     */
    @Property(null)
    public groupTemplate: string;
    /**
     * Accepts the template and assigns it to the list content of the ListBox component
     * when the data fetch request from the remote server fails.
     *
     * @default 'Request Failed'
     * @private
     */
    @Property('Request failed')
    public actionFailureTemplate: string;

    /**
     * specifies the z-index value of the component popup element.
     *
     * @default 1000
     * @private
     */
    @Property(1000)
    public zIndex: number;
    /**
     * ignoreAccent set to true, then ignores the diacritic characters or accents when filtering.
     *
     * @private
     */
    @Property(false)
    public ignoreAccent: boolean;

    /**
     * Specifies the toolbar items and its position.
     *
     * @default { items: [], position: 'Right' }
     */
    @Complex<ToolbarSettingsModel>({}, ToolbarSettings)
    public toolbarSettings: ToolbarSettingsModel;

    /**
     * Specifies the selection mode and its type.
     *
     * @default { mode: 'Multiple', type: 'Default' }
     */
    @Complex<SelectionSettingsModel>({}, SelectionSettings)
    public selectionSettings: SelectionSettingsModel;

    /**
     * Constructor for creating the ListBox component.
     *
     * @param {ListBoxModel} options - Specifies ListBox model
     * @param {string | HTMLElement} element - Specifies the element.
     */
    constructor(options?: ListBoxModel, element?: string | HTMLElement) {
        super(options, element);
    }

    /**
     * Build and render the component.
     *
     * @private
     * @returns {void}
     */
    public render(): void {
        if (this.isAngular && this.allowFiltering) {
            const originalElement: HTMLElement = this.element;
            const clonedElement: HTMLElement = originalElement.cloneNode(true) as HTMLElement;
            originalElement.parentNode.replaceChild(clonedElement, originalElement);
            this.element = clonedElement;
            setValue('ej2_instances', [this], this.element);
        }
        this.inputString = '';
        this.initLoad = true;
        this.isCustomFiltering = false;
        this.initialSelectedOptions = this.value;
        this.inputFormName = this.element.getAttribute('name');
        super.render();
        this.setEnabled();
        this.renderComplete();
    }

    private initWrapper(): void {
        const hiddenSelect: HTMLElement = this.createElement('select', { className: 'e-hidden-select', attrs: { 'multiple': '' } });
        hiddenSelect.style.visibility = 'hidden';
        this.list.classList.add('e-listbox-wrapper');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this.list.querySelector('.e-list-parent') as any).setAttribute('role', 'presentation');
        const groupHdrs: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>this.list.querySelectorAll('.e-list-group-item');
        for (let i: number = 0; i < groupHdrs.length; i++) {
            groupHdrs[i as number].removeAttribute('tabindex');
            groupHdrs[i as number].setAttribute('role', 'option');
        }
        if (this.itemTemplate) {
            this.list.classList.add('e-list-template');
        }
        this.list.classList.add('e-wrapper');
        this.list.classList.add('e-lib');
        if (this.element.tagName === 'EJS-LISTBOX') {
            this.element.setAttribute('tabindex', '0');
            if (this.initLoad) {
                this.element.appendChild(this.list);
            }
        } else {
            if (this.initLoad && this.element.parentElement) {
                this.element.parentElement.insertBefore(this.list, this.element);
            }
            this.list.insertBefore(this.element, this.list.firstChild);
            this.element.style.display = 'none';
        }
        this.list.insertBefore(hiddenSelect, this.list.firstChild);
        if (this.list.getElementsByClassName('e-list-item')[0]) {
            this.list.getElementsByClassName('e-list-item')[0].classList.remove(dropDownBaseClasses.focus);
        }
        if (this.itemTemplate) { this.renderReactTemplates(); }
        removeClass([this.list], [dropDownBaseClasses.content, dropDownBaseClasses.root]);
        this.validationAttribute(this.element as HTMLInputElement, hiddenSelect as HTMLSelectElement);
        this.list.setAttribute('role', 'listbox');
        attributes(this.list, { 'role': 'listbox', 'aria-label': 'listbox', 'aria-multiselectable': this.selectionSettings.mode === 'Multiple' ? 'true' : 'false' });
        this.updateSelectionSettings();
    }

    private updateSelectionSettings(): void {
        if (this.selectionSettings.showCheckbox && this.selectionSettings.showSelectAll && this.liCollections.length) {
            const l10nSelect: L10n = new L10n(
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
                beforeDragStart: this.triggerDragStart.bind(this),
                drag: this.triggerDrag.bind(this),
                beforeDrop: this.beforeDragEnd.bind(this),
                drop: this.dragEnd.bind(this),
                placeHolder: () => { return this.createElement('span', { className: 'e-placeholder' }); },
                helper: (e: { sender: Element }) => {
                    const wrapper: HTMLElement = this.list.cloneNode() as HTMLElement;
                    const ele: HTMLElement = e.sender.cloneNode(true) as HTMLElement;
                    wrapper.appendChild(ele);
                    const refEle: HTMLElement = this.getItems()[0] as HTMLElement;
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

    protected updateActionCompleteData(li: HTMLElement, item: { [key: string]: Object }, index: number): void {
        (this.jsonData as { [key: string]: Object }[]).splice(index === null ? this.jsonData.length : index, 0, item);
    }

    private initToolbar(): void {
        const pos: string = this.toolbarSettings.position;
        const prevScope: string = this.element.getAttribute('data-value');
        this.toolbarSettings.items = isNullOrUndefined(this.toolbarSettings.items) ? [] : this.toolbarSettings.items;
        if (this.toolbarSettings.items.length) {
            const toolElem: Element = this.createElement('div', { className: 'e-listbox-tool', attrs: { 'role': 'toolbar' } });
            const wrapper: Element = this.createElement('div', {
                className: 'e-listboxtool-wrapper e-lib e-' + pos.toLowerCase()
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
        const scope: string = this.element.getAttribute('data-value');
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
        const l10n: L10n = new L10n(
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
        if (this.inputFormName) { input.setAttribute('name', this.inputFormName); }
        super.validationAttribute(input, hiddenSelect);
        hiddenSelect.required = input.required;
        input.required = false;
    }

    private setHeight(): void {
        const ele: HTMLElement = this.toolbarSettings.items.length ? this.list.parentElement : this.list;
        ele.style.height = formatUnit(this.height);
        if (this.allowFiltering && this.height.toString().indexOf('%') < 0) {
            addClass([this.list], 'e-filter-list');
        } else {
            removeClass([this.list], 'e-filter-list');
        }
    }

    private setCssClass(): void {
        const wrap: Element = this.toolbarSettings.items.length ? this.list.parentElement : this.list;
        if (this.cssClass) {
            addClass([wrap], this.cssClass.replace(/\s+/g, ' ').trim().split(' '));
        }
        if (this.enableRtl) {
            addClass([this.list], 'e-rtl');
        }
    }

    private setEnable(): void {
        const ele: Element = this.toolbarSettings.items.length ? this.list.parentElement : this.list;
        if (this.enabled) {
            removeClass([ele], cssClass.disabled);
        } else {
            addClass([ele], cssClass.disabled);
        }
    }

    public showSpinner(): void {
        if (!this.spinner) {
            this.spinner = this.createElement('div', { className: 'e-listbox-wrapper' });
        }
        this.spinner.style.height = formatUnit(this.height);
        if (this.element.parentElement) {
            this.element.parentElement.insertBefore(this.spinner, this.element.nextSibling);
        }
        createSpinner({ target: this.spinner }, this.createElement);
        showSpinner(this.spinner);
    }

    public hideSpinner(): void {
        if (this.spinner.querySelector('.e-spinner-pane')) {
            hideSpinner(this.spinner);
        }
        if (this.spinner.parentElement) {
            detach(this.spinner);
        }
    }

    private onInput(): void {
        this.isDataSourceUpdate = false;
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
        const event: KeyboardEvent = document.createEvent('KeyboardEvent');
        this.isValidKey = true;
        this.KeyUp(event);
    }

    private refreshClearIcon(): void {
        if (this.filterInput.parentElement.querySelector('.' + listBoxClasses.clearIcon)) {
            const clearElement: HTMLElement = <HTMLElement>this.filterInput.parentElement.querySelector('.' + listBoxClasses.clearIcon);
            clearElement.style.visibility = this.filterInput.value === '' ? 'hidden' : 'visible';
        }
    }

    protected onActionComplete(
        ulElement: HTMLElement,
        list: obj[] | boolean[] | string[] | number[],
        e?: Object): void {
        let searchEle: Element; let filterElem: HTMLInputElement; let txtLength: number;
        if (this.allowFiltering && this.list.getElementsByClassName('e-filter-parent')[0]) {
            searchEle = this.list.getElementsByClassName('e-filter-parent')[0].cloneNode(true) as Element;
        }
        if (list.length === 0) {
            const noRecElem: Element = ulElement.childNodes[0] as Element;
            if (noRecElem) {
                ulElement.removeChild(noRecElem);
            }
        }
        if (this.allowFiltering) {
            filterElem = (this.list.getElementsByClassName('e-input-filter')[0] as HTMLInputElement);
            if (filterElem) {
                txtLength = filterElem.selectionStart;
            }
        }
        super.onActionComplete(ulElement, list, e);
        if (this.allowFiltering && !isNullOrUndefined(searchEle)) {
            this.list.insertBefore(searchEle, this.list.firstElementChild);
            this.filterParent = this.list.getElementsByClassName('e-filter-parent')[0] as HTMLElement;
            this.filterWireEvents(searchEle);
            const inputSearch: HTMLElement = searchEle.querySelector('.e-input-filter');
            if (inputSearch) {
                inputSearch.addEventListener('focus', function(): void {
                    if (!(searchEle.childNodes[0] as HTMLElement).classList.contains('e-input-focus')) {
                        (searchEle.childNodes[0] as HTMLElement).classList.add('e-input-focus');
                    }
                });
                inputSearch.addEventListener('blur', function(): void {
                    if ((searchEle.childNodes[0] as HTMLElement).classList.contains('e-input-focus')) {
                        (searchEle.childNodes[0] as HTMLElement).classList.remove('e-input-focus');
                    }
                });
            }
        }
        this.initWrapper();
        this.setSelection(this.value, true, false, !this.isRendered);
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
            if (this.isDataSourceUpdate) {
                this.jsonData = []; extend(this.jsonData, list, []);
                this.isDataSourceUpdate = false;
            }
            if (this.allowFiltering) {
                filterElem = (this.list.getElementsByClassName('e-input-filter')[0] as HTMLInputElement);
                if (isNullOrUndefined(filterElem)) { return; }
                filterElem.selectionStart = txtLength;
                filterElem.selectionEnd = txtLength;
                if (filterElem.value !== '') {
                    filterElem.focus();
                }
            }
        }
        if (this.toolbarSettings.items.length && this.scope && this.scope.indexOf('#') > -1 && !isNullOrUndefined(e)) {
            const scope: string = this.scope.replace('#', '');
            const scopedLB: ListBox = getComponent(document.getElementById(scope), this.getModuleName());
            scopedLB.initToolbar();
        }
        this.initLoad = false;
    }

    private initToolbarAndStyles(): void {
        this.initToolbar();
        this.setCssClass();
        this.setEnable();
        this.setHeight();
    }

    private triggerDragStart(args: DragEventArgs ): void {
        let badge: Element;
        const extendedArgs: any = extend(this.getDragArgs(args), { dragSelected: true }, {cancel: false}) as DragEventArgs;
        if (Browser.isIos) {
            this.list.style.overflow = 'hidden';
        }
        this.trigger('dragStart', extendedArgs, (dragEventArgs: DragEventArgs) => {
            this.allowDragAll = dragEventArgs.dragSelected;
            if (!this.allowDragAll) {
                badge = this.ulElement.getElementsByClassName('e-list-badge')[0];
                if (badge) { detach(badge); }
            }
            if (dragEventArgs.cancel) {
                args.cancel = true;
            }
        });
    }

    private triggerDrag(args: DragEventArgs): void {
        let scrollParent: HTMLElement; let boundRect: DOMRect; const scrollMoved: number = 36;
        let scrollHeight: number = 10;
        if (this.itemTemplate && args.target) {
            if (args.target && args.target.closest('.e-list-item')) {
                scrollHeight = args.target.closest('.e-list-item').scrollHeight;
            } else {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const listItem: HTMLElement = (args as any).element.querySelector('.e-list-item');
                if (listItem) {
                    scrollHeight = listItem.scrollHeight;
                }
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const event: any = (args as any).event; let wrapper: HTMLElement; this.stopTimer();
        if (args.target && (args.target.classList.contains('e-listbox-wrapper') || args.target.classList.contains('e-list-item')
        || args.target.classList.contains('e-filter-parent') || args.target.classList.contains('e-input-group')
        || args.target.closest('.e-list-item'))) {
            if (args.target.classList.contains('e-list-item') || args.target.classList.contains('e-filter-parent')
            || args.target.classList.contains('e-input-group')
            || args.target.closest('.e-list-item')) {
                wrapper = args.target.closest('.e-listbox-wrapper') as HTMLElement;
            } else {
                wrapper = args.target as HTMLElement;
            }
            if (this.allowFiltering) {
                scrollParent = wrapper.querySelector('.e-list-parent');
            } else {
                scrollParent = wrapper;
            }
            if (scrollParent) {
                boundRect = scrollParent.getBoundingClientRect() as DOMRect;
                if ((boundRect.y + scrollParent.offsetHeight) - (event.clientY + scrollMoved) < 1) {
                    this.timer = window.setInterval(() => { this.setScrollDown(scrollParent, scrollHeight, true); }, 70);
                }
                else if ((event.clientY - scrollMoved) - boundRect.y < 1) {
                    this.timer = window.setInterval(() => { this.setScrollDown(scrollParent, scrollHeight, false); }, 70);
                }
            }
        }
        if (args.target === null) {
            return;
        }
        this.trigger('drag', this.getDragArgs(args as DragEventArgs));
    }

    private setScrollDown(scrollElem: Element, scrollPixel: number, isScrollDown: boolean): void {
        if (isScrollDown) {
            scrollElem.scrollTop = scrollElem.scrollTop + scrollPixel;
        } else {
            scrollElem.scrollTop = scrollElem.scrollTop - scrollPixel;
        }
    }

    private stopTimer(): void {
        window.clearInterval(this.timer);
    }

    private beforeDragEnd(args: DropEventArgs): void {
        this.stopTimer();
        const items: object[] = [];
        this.dragValue = this.getFormattedValue(args.droppedElement.getAttribute('data-value')) as string;
        if ((this.value as string[]).indexOf(this.dragValue) > -1) {
            args.items = this.getDataByValues(this.value);
        } else {
            args.items = this.getDataByValues([this.dragValue]);
        }
        extend(items, args.items);
        this.trigger('beforeDrop', args);
        if (JSON.stringify(args.items) !== JSON.stringify(items)) {
            this.customDraggedItem = args.items;
        }
    }

    private dragEnd(args: DropEventArgs): void {
        let listData: dataType[]; let liColl: HTMLElement[]; let jsonData: dataType[]; let droppedData: dataType;
        let selectedOptions: (string | boolean | number)[]; let sortedData: dataType[];
        const dropValue: string | number | boolean = this.getFormattedValue(args.droppedElement.getAttribute('data-value'));
        const listObj: ListBox = this.getComponent(args.droppedElement);
        const getArgs: Object = this.getDragArgs({ target: args.droppedElement } as DragEventArgs , true);
        const sourceArgs: Object = { previousData: this.dataSource }; const destArgs: Object = { previousData: listObj.dataSource };
        let dragArgs: Object = extend({}, getArgs, { target: args.target, source: { previousData: this.dataSource },
            previousIndex: args.previousIndex, currentIndex: args.currentIndex });
        if (listObj !== this) {
            const sourceArgs1: Object = extend( sourceArgs, {currentData: this.listData});
            dragArgs = extend(dragArgs, { source: sourceArgs1, destination: destArgs} );
        }
        if (Browser.isIos) {
            this.list.style.overflow = '';
        }
        const targetListObj: ListBox = this.getComponent(args.target);
        if (targetListObj && targetListObj.listData.length === 0) {
            const noRecElem: Element = targetListObj.ulElement.childNodes[0] as Element;
            if (noRecElem) {
                targetListObj.ulElement.removeChild(noRecElem);
            }
        }
        if (listObj === this) {
            const ul: Element = this.ulElement;
            listData = [].slice.call(this.listData); liColl = [].slice.call(this.liCollections);
            jsonData = [].slice.call(this.jsonData); sortedData = [].slice.call(this.sortedData);
            const toSortIdx: number = args.currentIndex;
            let toIdx: number = args.currentIndex = this.getCurIdx(this, args.currentIndex);
            const rIdx: number = listData.indexOf(this.getDataByValue(dropValue));
            const jsonIdx: number = jsonData.indexOf(this.getDataByValue(dropValue));
            const sIdx: number = sortedData.indexOf(this.getDataByValue(dropValue));
            listData.splice(toIdx, 0, listData.splice(rIdx, 1)[0] as obj);
            sortedData.splice(toSortIdx, 0, sortedData.splice(sIdx, 1)[0] as obj);
            jsonData.splice(toIdx, 0, jsonData.splice(jsonIdx, 1)[0] as obj);
            liColl.splice(toIdx, 0, liColl.splice(rIdx, 1)[0] as HTMLElement);
            if (this.allowDragAll) {
                selectedOptions = this.value && Array.prototype.indexOf.call(this.value, dropValue) > -1 ? this.value : [dropValue];
                if (!isNullOrUndefined(this.customDraggedItem)) {
                    selectedOptions = [];
                    this.customDraggedItem.forEach((item: object) => {
                        selectedOptions.push(getValue(this.fields.value, item));
                    });
                }
                selectedOptions.forEach((value: string) => {
                    if (value !== dropValue) {
                        const idx: number = listData.indexOf(this.getDataByValue(value));
                        const jsonIdx: number = jsonData.indexOf(this.getDataByValue(value));
                        const sIdx: number = sortedData.indexOf(this.getDataByValue(value));
                        if (idx > toIdx) {
                            toIdx++;
                        }
                        jsonData.splice(toIdx, 0, jsonData.splice(jsonIdx, 1)[0] as obj);
                        listData.splice(toIdx, 0, listData.splice(idx, 1)[0] as obj);
                        sortedData.splice(toSortIdx, 0, sortedData.splice(sIdx, 1)[0] as obj);
                        liColl.splice(toIdx, 0, liColl.splice(idx, 1)[0] as HTMLElement);
                        ul.insertBefore(this.getItems()[this.getIndexByValue(value)], ul.getElementsByClassName('e-placeholder')[0]);
                    }
                });
            }
            (this.listData as dataType[]) = listData; (this.jsonData as dataType[]) = jsonData;
            (this.sortedData as dataType[]) = sortedData; this.liCollections = liColl;
        } else {
            let li: Element; const fLiColl: HTMLElement[] = [].slice.call(this.liCollections);
            let currIdx: number = args.currentIndex = this.getCurIdx(listObj, args.currentIndex); const ul: Element = listObj.ulElement;
            listData = [].slice.call(listObj.listData); liColl = [].slice.call(listObj.liCollections);
            jsonData = [].slice.call(listObj.jsonData); sortedData = [].slice.call(listObj.sortedData);
            selectedOptions = (this.value && Array.prototype.indexOf.call(this.value, dropValue) > -1 && this.allowDragAll)
                ? this.value : [dropValue];
            if (!isNullOrUndefined(this.customDraggedItem)) {
                selectedOptions = [];
                this.customDraggedItem.forEach((item: object) => {
                    selectedOptions.push(getValue(this.fields.value, item));
                });
            }
            const fListData: dataType[] = [].slice.call(this.listData); const fSortData: dataType[] = [].slice.call(this.sortedData);
            selectedOptions.forEach((value: string) => {
                droppedData = this.getDataByValue(value);
                const srcIdx: number = (this.listData as dataType[]).indexOf(droppedData);
                const jsonSrcIdx: number = (this.jsonData as dataType[]).indexOf(droppedData);
                const sortIdx: number = (this.sortedData as dataType[]).indexOf(droppedData);
                fListData.splice(srcIdx, 1); this.jsonData.splice(jsonSrcIdx, 1);
                fSortData.splice(sortIdx, 1); (this.listData as dataType[]) = fListData; (this.sortedData as dataType[]) = fSortData;
                const destIdx: number = value === dropValue ? args.currentIndex : currIdx;
                listData.splice(destIdx, 0, droppedData); jsonData.splice(destIdx, 0, droppedData);
                sortedData.splice(destIdx, 0, droppedData);
                liColl.splice(destIdx, 0, fLiColl.splice(srcIdx, 1)[0]);
                if (!value) {
                    const liCollElem: Element[] = this.getItems();
                    for (let i: number = 0; i < liCollElem.length; i++ ) {
                        if (liCollElem[i as number].getAttribute('data-value') === null && liCollElem[i as number].classList.contains('e-list-item')) {
                            li = liCollElem[i as number];
                            break;
                        }
                    }
                } else {
                    li = this.getItems()[this.getIndexByValue(value)];
                }
                if (!li) { li = args.helper; }
                this.removeSelected(this, value === dropValue ? [args.droppedElement] : [li]);
                ul.insertBefore(li, ul.getElementsByClassName('e-placeholder')[0]);
                currIdx++;
            });
            if (this.fields.groupBy) {
                const sourceElem: HTMLElement = this.renderItems(this.listData as obj[], this.fields);
                this.updateListItems(sourceElem, this.ulElement); this.setSelection();
            }
            if (listObj.sortOrder !== 'None' || this.selectionSettings.showCheckbox
                !== listObj.selectionSettings.showCheckbox || listObj.fields.groupBy || listObj.itemTemplate || this.itemTemplate) {
                const sortable: { placeHolderElement: Element } = getComponent(ul as HTMLElement, 'sortable');
                const sourceElem: HTMLElement = listObj.renderItems(listData as obj[], listObj.fields);
                listObj.updateListItems(sourceElem, ul as HTMLElement); this.setSelection();
                if (sortable.placeHolderElement) {
                    ul.appendChild(sortable.placeHolderElement);
                }
                ul.appendChild(args.helper); listObj.setSelection();
            }
            this.liCollections = fLiColl; listObj.liCollections = liColl;
            (listObj.jsonData as dataType[]) = extend([], [], jsonData, false) as dataType[];
            (listObj.listData as dataType[]) = extend([], [], listData, false) as dataType[];
            if (listObj.sortOrder === 'None') {
                (listObj.sortedData as dataType[]) = extend([], [], sortedData, false) as dataType[];
            }
            if (this.listData.length === 0) {
                this.l10nUpdate();
            }
        }
        if (this === listObj) {
            const sourceArgs1: Object = extend( sourceArgs, {currentData: listData});
            dragArgs = extend(dragArgs, {source: sourceArgs1});
        } else {
            const dragArgs1: Object = extend(destArgs, {currentData: listData});
            dragArgs = extend(dragArgs, { destination: dragArgs1 });
        }
        if (!isNullOrUndefined(this.customDraggedItem)) {
            (dragArgs as DragEventArgs).items = this.customDraggedItem;
        }
        this.trigger('drop', dragArgs);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const liCollElem: NodeListOf<Element> = (dragArgs as any).elements;
        if (liCollElem.length) {
            for (let i: number = 0; i < liCollElem.length; i++) {
                liCollElem[i as number].classList.remove('e-grabbed');
            }
        }
        if (this.toolbarSettings.items.length > 0 ) {
            this.updateToolBarState();
        }
        else if (this.tBListBox && this.tBListBox.toolbarSettings.items.length > 0 ) {
            this.tBListBox.updateToolBarState();
        }
    }

    private updateListItems(sourceElem: HTMLElement, destElem: HTMLElement): void {
        destElem.innerHTML = '';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        destElem.append(...sourceElem.childNodes as any);
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
        const ele: HTMLElement = (this.element.tagName === 'EJS-LISTBOX' ? closest(li, '.e-listbox')
            : closest(li, '.e-listbox-wrapper') && closest(li, '.e-listbox-wrapper').querySelector('.e-listbox')) as HTMLElement;
        if (ele) {
            listObj = getComponent(ele, this.getModuleName());
        }
        return listObj;
    }

    /**
     * Sets the enabled state to DropDownBase.
     *
     * @returns {void}
     */
    protected setEnabled(): void {
        this.element.setAttribute('aria-disabled', (this.enabled) ? 'false' : 'true');
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
        const modules: ModuleDeclaration[] = [];
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
     *
     * @param {string[]} items - Text items that needs to be enabled/disabled.
     * @param {boolean} enable - Set `true`/`false` to enable/disable the list items.
     * @param {boolean} isValue - Set `true` if `items` parameter is a array of unique values.
     * @returns {void}
     */
    public enableItems(items: string[], enable: boolean = true, isValue?: boolean): void {
        let li: HTMLElement;
        items.forEach((item: string) => {
            const text: string = item;
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
        if (this.allowFiltering && this.filterInput && this.filterInput.value !== '' && this.toolbarSettings.items.length > 0) {
            let canDisable: boolean = false;
            this.ulElement.childNodes.forEach((li: HTMLLIElement) => { if (!li.classList.contains('e-disabled')) { canDisable = true; }});
            if (!canDisable) {
                const wrap: Element = this.list.parentElement.getElementsByClassName('e-listbox-tool')[0];
                const btn: HTMLButtonElement = wrap.querySelector('[data-value="moveAllTo"]');
                btn.disabled = true;
            }
        }
    }

    /**
     * Based on the state parameter, specified list item will be selected/deselected.
     *
     * @param {string[]} items - Array of text value of the item.
     * @param {boolean} state - Set `true`/`false` to select/un select the list items.
     * @param {boolean} isValue - Set `true` if `items` parameter is a array of unique values.
     * @returns {void}
     */
    public selectItems(items: string[], state: boolean = true, isValue?: boolean): void {
        if (state && !this.selectionSettings.showCheckbox && this.selectionSettings.mode === 'Single') {
            this.getSelectedItems().forEach((li: Element) => {
                li.classList.remove('e-active');
                li.removeAttribute('aria-selected');
                removeClass([li], cssClass.selected);
            });
        }
        this.setSelection(items, state, !isValue);
        this.updateSelectedOptions();
        const selElems: Element[] = [];
        for (let i: number = 0; i < items.length; i++) {
            const liColl: NodeListOf<Element> = this.list.querySelectorAll('[aria-selected="true"]');
            for (let j: number = 0; j < liColl.length; j++) {
                if (items[i as number] === this.getFormattedValue(liColl[j as number].getAttribute('data-value')) as string) {
                    selElems.push(liColl[j as number]);
                }
            }
        }
        this.triggerChange(selElems, null);
    }

    /**
     * Based on the state parameter, entire list item will be selected/deselected.
     *
     * @param {boolean} state - Set `true`/`false` to select/un select the entire list items.
     * @returns {void}
     */
    public selectAll(state: boolean = true): void {
        this.selectAllItems(state);
    }

    /**
     * Adds a new item to the list. By default, new item appends to the list as the last item,
     * but you can insert based on the index parameter.
     *
     * @param  { Object[] } items - Specifies an array of JSON data or a JSON data.
     * @param { number } itemIndex - Specifies the index to place the newly added item in the list.
     * @returns {void}.
     */
    public addItems(items: obj[] | obj, itemIndex?: number): void {
        super.addItem(items, itemIndex);
        if (this.allowFiltering && this.filterInput.value !== '') {
            this.filteringAction(this.jsonData, new Query(), this.fields);
        }
    }
    /**
     * Removes a item from the list. By default, removed the last item in the list,
     * but you can remove based on the index parameter.
     *
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
     *
     * @param  { Object[] } items - Specifies an array of JSON data or a JSON data.
     * @param { number } itemIndex - Specifies the index to remove the item from the list.
     * @returns {void}.
     */
    public removeItem(
        items?: { [key: string]: Object }[] | { [key: string]: Object } | string | boolean | number | string[] | boolean[] | number[],
        itemIndex?: number): void {
        const liCollections: HTMLElement[] = [];
        const liElement: HTMLElement[] | NodeListOf<HTMLLIElement> = this.list.querySelectorAll('.' + dropDownBaseClasses.li);
        if (items) {
            items = (items instanceof Array ? items : [items]) as { [key: string]: Object }[] | string[] | boolean[] | number[];
            const fields: FieldSettingsModel = this.fields; let dataValue: string; const objValue: { [key: string]: number } = {};
            const dupData: {[key: string]: Object }[] = [];
            extend(dupData, [], this.jsonData as { [key: string]: Object }[]);
            const removeIdxes: number [] = []; const removeLiIdxes: number [] = [];
            for (let i: number = 0; i < dupData.length; i++) {
                const value: any = (dupData[i as number] instanceof Object) ? dupData[i as number][fields.value] :
                    dupData[i as number].toString();
                objValue[value as any] = i;
            }
            for (let j: number = 0; j < items.length; j++) {
                dataValue = (items[j as number] instanceof Object) ? (items[j as number] as any)[fields.value] :
                    items[j as number].toString();
                if (Object.prototype.hasOwnProperty.call(objValue, dataValue)) {
                    const idx: number = objValue[dataValue as string];
                    liCollections.push(liElement[idx as number]);
                    removeIdxes.push(idx);
                    removeLiIdxes.push(idx);
                }
            }
            const validRemoveIdxes: number[] = removeIdxes.sort((a: number, b: number) => b - a);
            validRemoveIdxes.forEach((idx: number) => {
                this.listData.splice(idx, 1);
                this.jsonData.splice(idx, 1);
            });
            for (let k: number = removeLiIdxes.length - 1; k >= 0; k--) {
                this.updateLiCollection(removeLiIdxes[k as number]);
            }
        } else {
            itemIndex = itemIndex ? itemIndex : 0;
            liCollections.push(liElement[itemIndex as number]);
            (this.listData as { [key: string]: Object }[]).splice(itemIndex, 1);
            (this.jsonData as { [key: string]: Object }[]).splice(itemIndex, 1);
            this.updateLiCollection(itemIndex);
        }
        for (let i: number = 0; i < liCollections.length; i++) {
            this.ulElement.removeChild(liCollections[i as number]);
        }
        if (this.listData.length === 0) {
            this.l10nUpdate();
        }
        if (this.listData.length !== this.sortedData.length) { this.sortedData = this.listData; }
        this.value = [];
        this.updateToolBarState();
    }
    /**
     * Gets the array of data Object that matches the given array of values.
     *
     * @param  { string[] | number[] | boolean[] } value - Specifies the array value of the list item.
     * @returns {object[]}.
     */
    public getDataByValues(value: string[] | number[] | boolean[] ): { [key: string]: Object }[] {
        const data: string | number | boolean | { [key: string]: Object }[] = [];
        for (let i: number = 0; i < value.length; i++) {
            data.push(this.getDataByValue(value[i as number]) as { [key: string]: Object });
        }
        return data;
    }
    /**
     * Moves the given value(s) / selected value(s) upwards.
     *
     * @param  { string[] | number[] | boolean[] } value - Specifies the value(s).
     * @returns {void}
     */
    public moveUp(value?: string[] | number[] | boolean[]): void {
        const elem: Element[] = (value) ? this.getElemByValue(value) : this.getSelectedItems();
        this.moveUpDown(true, false, elem);
    }
    /**
     * Moves the given value(s) / selected value(s) downwards.
     *
     * @param  { string[] | number[] | boolean[] } value - Specifies the value(s).
     * @returns {void}
     */
    public moveDown(value?: string[] | number[] | boolean[]): void {
        const elem: Element[] = (value) ? this.getElemByValue(value) : this.getSelectedItems();
        this.moveUpDown(false, false, elem);
    }
    /**
     * Moves the given value(s) / selected value(s) in Top of the list.
     *
     * @param  { string[] | number[] | boolean[] } value - Specifies the value(s).
     * @returns {void}
     */
    public moveTop(value?: string[] | number[] | boolean[]): void {
        const elem: Element[] = (value) ? this.getElemByValue(value) : this.getSelectedItems();
        this.moveUpDown(null, false, elem, true);
    }
    /**
     * Moves the given value(s) / selected value(s) in bottom of the list.
     *
     * @param  { string[] | number[] | boolean[] } value - Specifies the value(s).
     * @returns {void}
     */
    public moveBottom(value?: string[] | number[] | boolean[]): void {
        const elem: Element[] = (value) ? this.getElemByValue(value) : this.getSelectedItems();
        this.moveUpDown(true, false, elem, false, true);
    }
    /**
     * Moves the given value(s) / selected value(s) to the given / default scoped ListBox.
     *
     * @param  { string[] | number[] | boolean[] } value - Specifies the value or array value of the list item.
     * @param {number} index - Specifies the index.
     * @param {string} targetId - Specifies the target id.
     * @returns {void}
     */
    public moveTo(value?: string[] | number[] | boolean[], index?: number, targetId?: string): void {
        const elem: Element[] = (value) ? this.getElemByValue(value) : this.getSelectedItems();
        const tlistbox: ListBox = (targetId) ? getComponent(targetId, ListBox) : this.getScopedListBox();
        this.moveData(this, tlistbox, false, elem, index);
    }
    /**
     * Moves all the values from one ListBox to the scoped ListBox.
     *
     * @param  { string } targetId - Specifies the scoped ListBox ID.
     * @param  { string } index - Specifies the index to where the items moved.
     * @returns {void}
     */
    public moveAllTo(targetId?: string, index?: number): void {
        this.toolbarAction = 'moveAllTo';
        if (this.listData.length > 0) {
            const tlistbox: ListBox = (targetId) ? getComponent(targetId, ListBox) : this.getScopedListBox();
            this.moveAllData(this, tlistbox, false, index);
        }
    }
    /* eslint-disable */
    /**
     * Gets the updated dataSource in ListBox.
     *
     * @returns {{ [key: string]: Object }[] | string[] | boolean[] | number[]} - Updated DataSource.
     */
    /* eslint-enable */
    public getDataList(): { [key: string]: Object }[] | string[] | boolean[] | number[] {
        return this.jsonData;
    }
    /* eslint-disable */
    /**
     * Returns the sorted Data in ListBox.
     *
     * @returns {{ [key: string]: Object }[] | string[] | boolean[] | number[]} - Sorted data
     */
    /* eslint-enable */
    public getSortedList(): { [key: string]: Object }[] | string[] | boolean[] | number[] {
        let sortData: dataType[]; let tempData: { [key: string]: Object }[] | string[] | boolean[] | number[];
        sortData = tempData = this.sortedData;
        if (this.fields.groupBy) {
            sortData = [];
            for (let i: number = 0; i < tempData.length; i++) {
                if ((tempData[i as number] as { [key: string]: Object }).isHeader) {
                    continue;
                }
                sortData.push(tempData[i as number]);
            }
        }
        return sortData as { [key: string]: Object }[] | string[] | boolean[] | number[];
    }
    private getElemByValue(value: string[] | number[] | boolean[]): Element[] {
        const elem: Element[] = [];
        for (let i: number = 0; i < value.length; i++) {
            elem.push(this.ulElement.querySelector('[data-value ="' + value[i as number] + '"]'));
        }
        return elem;
    }
    private updateLiCollection(index: number): void {
        const tempLi: HTMLElement[] = [].slice.call(this.liCollections);
        tempLi.splice(index, 1);
        this.liCollections = tempLi;
    }
    private selectAllItems(state: boolean, event?: MouseEvent): void {
        [].slice.call(this.getItems()).forEach((li: Element) => {
            if (!li.classList.contains(cssClass.disabled)) {
                if (this.selectionSettings.showCheckbox) {
                    const ele: Element = li.getElementsByClassName('e-check')[0];
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
            const liEle: HTMLCollectionOf<HTMLLIElement> = this.list.getElementsByTagName('li') as HTMLCollectionOf<HTMLLIElement>;
            let index: number = 0;
            if (state) {
                for (index = 0; index < liEle.length; index++) {
                    const dataValue1: string = this.getFormattedValue(liEle[index as number].getAttribute('data-value')) as string;
                    if (!(this.value as string[]).some((e: string) => e === dataValue1)) {
                        (this.value as string[]).push(this.getFormattedValue(liEle[index as number].getAttribute('data-value')) as string);
                    }
                }
            } else {
                for (index = 0; index < liEle.length; index++) {
                    const dataValue2: string = this.getFormattedValue(liEle[index as number].getAttribute('data-value')) as string;
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
        const mainList: NodeListOf<Element> = this.mainList.querySelectorAll('.e-list-item');
        const ulList: NodeListOf<Element> = this.ulElement.querySelectorAll('.e-list-item');
        const mainCount: number = mainList.length; const ulEleCount: number = ulList.length;
        if (this.selectionSettings.showCheckbox || (document.querySelectorAll('ul').length > 1 || mainCount !== ulEleCount)) {
            let listindex: number = 0;
            let valueindex: number = 0;
            let count: number = 0;
            for (listindex; listindex < mainCount; ) {
                if (this.value) {
                    for (valueindex; valueindex < this.value.length; valueindex++) {
                        if (mainList[listindex as number].getAttribute('data-value') === this.value[valueindex as number]) {
                            count++;
                        }
                    }
                }
                if (!count && this.selectionSettings.showCheckbox) {
                    mainList[listindex as number].getElementsByClassName('e-frame')[0].classList.remove('e-check');
                }
                if (document.querySelectorAll('ul').length > 1 && count && mainCount !== ulEleCount) {
                    this.mainList.removeChild(this.mainList.getElementsByTagName('li')[listindex as number]);
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
        const form: Element = closest(this.element, 'form');
        const wrapper: Element = this.element.tagName === 'EJS-LISTBOX' ? this.element : this.list;
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
        window.addEventListener('resize', this.resizeHandler.bind(this));
    }

    private wireToolbarEvent(): void {
        if (this.toolbarSettings.items.length) {
            EventHandler.add(this.getToolElem(), 'click', this.toolbarClickHandler, this);
        }
    }

    private unwireEvents(): void {
        const form: Element = closest(this.element, 'form');
        const wrapper: Element = this.element.tagName === 'EJS-LISTBOX' ? this.element : this.list;
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
        window.removeEventListener('resize', this.resizeHandler.bind(this));
    }

    private clickHandler(e: MouseEvent): void {
        const li: Element = closest(e.target as Element, '.' + 'e-list-item');
        if (isNullOrUndefined(li)) {
            return;
        }
        this.selectHandler(e);
    }

    private checkSelectAll(): void {
        let searchCount: number = 0;
        const liItems: NodeListOf<Element> = this.list.querySelectorAll('li.' + dropDownBaseClasses.li);
        for (let i: number = 0; i < liItems.length; i++) {
            if (!liItems[i as number].classList.contains('e-disabled')) {
                searchCount++;
            }
        }
        const len: number = this.getSelectedItems().length;
        if (this.showSelectAll && searchCount) {
            this.notify('checkSelectAll', { module: 'CheckBoxSelection',
                value: (searchCount === len) ? 'check' : (len === 0) ? 'uncheck' : 'indeterminate'});
        }
    }

    protected getQuery(query: Query): Query {
        let filterQuery: Query = query ? query.clone() : this.query ? this.query.clone() : new Query();
        if (this.allowFiltering) {
            const filterType: string = this.inputString === '' ? 'contains' : this.filterType;
            let dataType: string = <string>this.typeOfData(this.dataSource as { [key: string]: Object; }[]).typeof;
            if (dataType === null) {
                dataType = <string>this.typeOfData(this.jsonData as { [key: string]: Object; }[]).typeof;
            }
            if (!(this.dataSource instanceof DataManager) && dataType === 'string' || dataType === 'number') {
                filterQuery.where('', filterType, this.inputString, this.ignoreCase, this.ignoreAccent);
            } else {
                const fields: string = (this.fields.text) ? this.fields.text : '';
                filterQuery.where(fields, filterType, this.inputString, this.ignoreCase, this.ignoreAccent);
            }
        } else {
            filterQuery = query ? query : this.query ? this.query : new Query();
        }
        return filterQuery;
    }

    private setFiltering(): InputObject | void {
        let filterInputObj: InputObject;
        if (this.initLoad || isNullOrUndefined(this.filterParent)) {
            this.filterParent = this.createElement('span', {
                className: listBoxClasses.filterParent
            });
            this.filterInput = <HTMLInputElement>this.createElement('input', {
                attrs: { type: 'text' },
                className: listBoxClasses.filterInput
            });
            this.element.parentNode.insertBefore(this.filterInput, this.element);
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
                'aria-label': 'search list item',
                'autocomplete': 'off',
                'autocorrect': 'off',
                'autocapitalize': 'off',
                'spellcheck': 'false',
                'role': 'textbox'
            });
            if (this.height.toString().indexOf('%') < 0) {
                addClass([this.list], 'e-filter-list');
            } else if (this.height.toString().indexOf('%') > 0) {
                this.ulElement.style.height = (this.ulElement.offsetHeight - this.filterParent.offsetHeight) + 'px';
            }
            this.inputString = this.filterInput.value;
            this.filterWireEvents();
            this.ulElement.style.setProperty('height', 'calc(100% - ' + (this.filterParent.offsetHeight) + 'px)', 'important');
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

    private selectHandler(e: MouseEvent | { target: EventTarget, ctrlKey?: boolean, shiftKey?: boolean,
        metaKey?: boolean}, isKey?: boolean): void {
        let isSelect: boolean = true;
        let currSelIdx: number;
        const li: Element = closest(e.target as Element, '.' + 'e-list-item');
        let selectedLi: Element[] = [li];
        if (li && li.parentElement) {
            currSelIdx = [].slice.call(li.parentElement.children).indexOf(li);
            if (!this.selectionSettings.showCheckbox) {
                if ((e.ctrlKey || e.metaKey || Browser.isDevice) && this.isSelected(li)) {
                    li.classList.remove(cssClass.selected);
                    li.removeAttribute('aria-selected');
                    isSelect = false;
                } else if (!(this.selectionSettings.mode === 'Multiple' && (e.ctrlKey || e.metaKey || Browser.isDevice))) {
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
            } else {
                selectedLi.forEach((ele: Element) => {
                    ele.setAttribute('aria-selected', 'false');
                });
            }
            if (!isKey && (this.maximumSelectionLength > (this.value && this.value.length) || !isSelect) &&
                (this.maximumSelectionLength >= (this.value && this.value.length) || !isSelect) &&
                !(this.maximumSelectionLength < (this.value && this.value.length))) {
                this.notify('updatelist', { li: li, e: e, module: 'listbox' });
            }
            if (this.allowFiltering && !isKey) {
                const liDataValue: string = this.getFormattedValue(li.getAttribute('data-value')) as string;
                if (!isSelect) {
                    this.value = (this.value as string[]).filter((value1: string) =>
                        value1 !== liDataValue);
                } else {
                    const values: string[] = [];
                    extend(values, this.value); values.push(liDataValue);
                    this.value = values;
                }
                if (document.querySelectorAll('ul').length < 2) {
                    this.updateMainList();
                }
            }
            this.updateSelectedOptions();
            this.triggerChange(this.getSelectedItems(), e as MouseEvent);
            if (this.list) {
                this.checkMaxSelection();
            }
        }
    }

    private triggerChange(selectedLis: Element[], event: MouseEvent): void {
        this.trigger('change', { elements: selectedLis, items: this.getDataByElements(selectedLis), value: this.value, event: event });
    }

    private getDataByElems(elems: Element[]): Object[] {
        const data: Object[] = [];
        const len: number = elems.length;
        for (let i: number = 0; i < len; i++) {
            const elem: Element = elems[i as number];
            const value: string = elem.getAttribute('data-value');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const formattedValue: any = this.getFormattedValue(value as any);
            data.push(this.getDataByValue(formattedValue));
        }
        return data;
    }
    private getDataByElements(elems: Element[]): Object[] {
        const data: Object[] = []; let value: string | number | boolean; let sIdx: number = 0;
        if (!isNullOrUndefined(this.listData)) {
            const type: string = this.typeOfData(this.listData).typeof as string;
            if (type === 'string' || type === 'number' || type === 'boolean') {
                for (const item of this.listData) {
                    for (let i: number = sIdx, len: number = elems.length; i < len; i++) {
                        value = this.getFormattedValue((elems[i as number] as Element).getAttribute('data-value'));
                        if (!isNullOrUndefined(item) && item === value as Object) {
                            sIdx = i; data.push(item); break;
                        }
                    }
                    if (elems.length === data.length) {
                        break;
                    }
                }
            } else {
                for (const item of this.listData) {
                    for (let i: number = sIdx, len: number = elems.length; i < len; i++) {
                        value = this.getFormattedValue((elems[i as number] as Element).getAttribute('data-value'));
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
        const limit: number = this.list.querySelectorAll('.e-list-item span.e-check').length;
        if (this.selectionSettings.showCheckbox) {
            let index: number = 0;
            const liCollElem: HTMLCollectionOf<HTMLLIElement> = this.list.getElementsByClassName('e-list-item') as HTMLCollectionOf<HTMLLIElement>;
            for (index; index < liCollElem.length; index++) {
                if (!liCollElem[index as number].querySelector('.e-frame.e-check')) {
                    if (limit === this.maximumSelectionLength) {
                        liCollElem[index as number].classList.add('e-disable');
                    } else if (liCollElem[index as number].classList.contains('e-disable')) {
                        liCollElem[index as number].classList.remove('e-disable');
                    }
                }
            }
        }
    }

    private toolbarClickHandler(e: MouseEvent): void {
        const btn: Element = closest(e.target as Element, 'button');
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
            default:
                this.trigger('actionBegin', { cancel: false, items: this.getDataByElems(this.getSelectedItems()),
                    eventName: this.toolbarAction });
                break;
            }
        }
    }

    private moveUpDown(isUp?: boolean, isKey?: boolean, value?: Element[], isTop?: boolean, isBottom?: boolean): void {
        let elems: Element[] = this.getSelectedItems();
        if (value) {
            elems = value;
        }
        if (((isUp && this.isSelected(this.ulElement.firstElementChild))
            || (!isUp && this.isSelected(this.ulElement.lastElementChild))) && !value ) {
            return;
        }
        const tempItems: Object[] = this.getDataByElems(elems);
        const localDataArgs: { [key: string]: Object } = { cancel: false, items: tempItems, eventName: this.toolbarAction };
        this.trigger('actionBegin', localDataArgs);
        if (localDataArgs.cancel) {
            return;
        }
        (isUp ? elems : elems.reverse()).forEach((ele: Element) => {
            const jsonToIdx: number = Array.prototype.indexOf.call(this.ulElement.querySelectorAll('.e-list-item'), ele);
            const idx: number = Array.prototype.indexOf.call(this.ulElement.children, ele);
            if (isTop) {
                moveTo(this.ulElement, this.ulElement, [idx], 0);
                this.changeData(idx, 0 , jsonToIdx, ele);
            }
            else if (isBottom) {
                moveTo(this.ulElement, this.ulElement, [idx], this.ulElement.querySelectorAll('.e-list-item').length);
                this.changeData(idx, this.ulElement.querySelectorAll('.e-list-item').length, jsonToIdx, ele);
            }
            else {
                moveTo(this.ulElement, this.ulElement, [idx], isUp ? idx - 1 : idx + 2);
                this.changeData(idx, isUp ? idx - 1 : idx + 1, isUp ? jsonToIdx - 1 : jsonToIdx + 1, ele);
            }
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
     *
     * @param {ListBox} fListBox - Specifies the from listbox.
     * @param {ListBox} tListBox - Specifies the to listbox.
     * @param {boolean} isKey - Specifies the key.
     * @param {Element[]} value - Specifies the value.
     * @param {number} index - Specifies the index.
     * @returns {void}
     * @private
     */
    private moveData(fListBox: ListBox, tListBox: ListBox, isKey?: boolean, value?: Element[], index?: number): void {
        const idx: number[] = []; const dataIdx: number[] = []; const jsonIdx: number[] = []; const sortIdx: number[] = [];
        const listData: dataType[] = [].slice.call(fListBox.listData); const tListData: dataType[] = [].slice.call(tListBox.listData);
        const sortData: dataType[] = [].slice.call(fListBox.sortedData); let tSortData: dataType[] = [].slice.call(tListBox.sortedData);
        const fliCollections: HTMLElement[] = [].slice.call(fListBox.liCollections); const dataLiIdx: number[] = [];
        const tliCollections: HTMLElement[] = [].slice.call(tListBox.liCollections);
        const tempItems: dataType[] = [];
        const data: dataType[] = []; let elems: Element[] = fListBox.getSelectedItems();
        if (value) {
            elems = value;
        }
        const isRefresh: boolean | string | Function = tListBox.sortOrder !== 'None' || (tListBox.selectionSettings.showCheckbox !==
            fListBox.selectionSettings.showCheckbox) || tListBox.fields.groupBy || tListBox.itemTemplate || fListBox.itemTemplate;
        fListBox.value = [];
        if (elems.length) {
            this.removeSelected(fListBox, elems);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const ulChildren: any = Array.prototype.slice.call(fListBox.ulElement.children);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const listItems: any = Array.prototype.slice.call(fListBox.ulElement.querySelectorAll('.e-list-item'));
            const lData: dataType[] = fListBox.listData;
            const sData: dataType[] = fListBox.sortedData;
            const jData: dataType[] = fListBox.jsonData;
            let eData: object;
            const listDataMap: { [key: string]: object } = {};
            if (elems.length > 199) {
                for (const item of fListBox.listData) {
                    if (!isNullOrUndefined(item)) {
                        const key: string | number | boolean = fListBox.getFormattedValue(getValue((fListBox.fields.value ? fListBox.fields.value : 'value'), item));
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        listDataMap[key as any] = item as object;
                    }
                }
            }
            elems.forEach((ele: Element) => {
                if (elems.length < 200) {
                    eData = fListBox.getDataByElems([ele])[0];
                } else {
                    const value: string = ele.getAttribute('data-value');
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const formattedValue: any = fListBox.getFormattedValue(value as any);
                    eData = listDataMap[formattedValue as any];
                }
                idx.push(ulChildren.indexOf(ele));
                dataLiIdx.push(listItems.indexOf(ele));
                dataIdx.push(lData.indexOf(eData as dataType));
                sortIdx.push(sData.indexOf(eData as dataType));
                jsonIdx.push(jData.indexOf(eData as dataType));
            });
            if (this.sortOrder !== 'None') {
                sortIdx.forEach((i: number) => {
                    tempItems.push(fListBox.sortedData[i as number]);
                });
            } else {
                jsonIdx.forEach((i: number) => {
                    tempItems.push(fListBox.jsonData[i as number]);
                });
            }
            const localDataArgs: { [key: string]: Object } = { cancel: false, items: tempItems, eventName: this.toolbarAction };
            fListBox.trigger('actionBegin', localDataArgs);
            if (localDataArgs.cancel) {
                return;
            }
            const rLiCollection: HTMLElement[] = [];
            dataLiIdx.sort((n1: number, n2: number) => n1 - n2).reverse().forEach((i: number) => {
                rLiCollection.push(fliCollections.splice(i, 1)[0]);
            });
            fListBox.liCollections = fliCollections;
            if (index) {
                const toColl: HTMLElement[] = tliCollections.splice(0, index);
                tListBox.liCollections = toColl.concat(rLiCollection.reverse()).concat(tliCollections);
            } else {
                tListBox.liCollections = tliCollections.concat(rLiCollection.reverse());
            }
            if (tListBox.listData.length === 0) {
                const noRecElem: Element = tListBox.ulElement.childNodes[0] as Element;
                if (noRecElem) {
                    tListBox.ulElement.removeChild(noRecElem);
                }
            }
            dataIdx.sort((n1: number, n2: number) => n2 - n1).forEach((i: number) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                listData.splice(i, 1)[0];
            });
            sortIdx.sort((n1: number, n2: number) => n2 - n1).forEach((i: number) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                sortData.splice(i, 1)[0];
            });
            jsonIdx.slice().reverse().forEach((i: number) => {
                data.push(fListBox.jsonData.splice(i, 1)[0]);
            });
            if (isRefresh) {
                if (fListBox.fields.groupBy) {
                    const sourceElem: HTMLElement = fListBox.renderItems(listData as obj[], fListBox.fields);
                    fListBox.updateListItems(sourceElem, fListBox.ulElement);
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
            const tJsonData: dataType[] = [].slice.call(tListBox.jsonData);
            tSortData = [].slice.call(tListBox.sortedData);
            this.selectNextList(elems, dataLiIdx, dataIdx, fListBox);
            if (isKey) { this.list.focus(); }
            (fListBox.listData as dataType[]) = listData;
            (fListBox.sortedData as dataType[]) = sortData;
            index = (index) ? index : tListData.length;
            for (let i: number = tempItems.length - 1; i >= 0; i--) {
                tListData.splice(index, 0, tempItems[i as number]);
                tJsonData.splice(index, 0, tempItems[i as number]);
                tSortData.splice(index, 0, tempItems[i as number]);
            }
            (tListBox.listData as dataType[]) = tListData;
            tListBox.jsonData = tJsonData as {[key: string]: object}[];
            tListBox.sortedData = tSortData as {[key: string]: object}[];
            if (isRefresh) {
                const sourceElem: HTMLElement = tListBox.renderItems(tListData as obj[], tListBox.fields);
                tListBox.updateListItems(sourceElem, tListBox.ulElement);
                tListBox.setSelection();
                fListBox.trigger('actionComplete', { items: tempItems, eventName: this.toolbarAction });
            }
            fListBox.updateSelectedOptions();
            if (fListBox.listData.length === 0) {
                fListBox.l10nUpdate();
            }
        }
        if (fListBox.value.length === 1 && fListBox.getSelectedItems().length) {
            fListBox.value[0] = fListBox.getFormattedValue(fListBox.getSelectedItems()[0].getAttribute('data-value'));
        }
        if (fListBox.liCollections.length === fListBox.ulElement.querySelectorAll('.e-disabled').length && this.toolbarAction) {
            const wrap: Element = this.list.parentElement.getElementsByClassName('e-listbox-tool')[0];
            const toolbarAction: string = this.toolbarAction === 'moveFrom' ? 'moveAllFrom' : 'moveAllTo';
            if (wrap) {
                const btn: HTMLButtonElement = wrap.querySelector('[data-value="' + toolbarAction + '"]');
                btn.disabled = true;
            }
        }
    }

    private selectNextList(elems: Element[], dataLiIdx: number[], dataIdx: number[], inst: ListBox): void {
        const childCnt: number = inst.ulElement.querySelectorAll('.e-list-item').length;
        let ele: Element; let liIdx: number;
        let validIdx: number = -1;
        if (elems.length === 1 && childCnt && !inst.selectionSettings.showCheckbox) {
            liIdx = childCnt <= dataLiIdx[0] ? childCnt - 1 : dataLiIdx[0];
            ele = inst.ulElement.querySelectorAll('.e-list-item')[liIdx as number];
            validIdx = inst.getValidIndex(ele, liIdx, childCnt === dataIdx[0] ? 38 : 40);
            if (validIdx > -1) {
                (inst.ulElement.querySelectorAll('.e-list-item')[validIdx as number].classList.add(cssClass.selected));
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
        const jsonData: {[key: string]: object}[] = [].slice.call(tListBox.jsonData);
        const isRefresh: boolean | string | Function = tListBox.sortOrder !== 'None' || (tListBox.selectionSettings.showCheckbox !==
            fListBox.selectionSettings.showCheckbox) || tListBox.fields.groupBy || tListBox.itemTemplate || fListBox.itemTemplate;
        const tempLiColl: HTMLElement[] = []; const tempData: { [key: string]: Object }[] = []; let flistboxarray: number[] = [];
        this.removeSelected(fListBox, fListBox.getSelectedItems());
        const tempItems: Object[] = [].slice.call(fListBox.listData);
        const localDataArgs: { [key: string]: Object } = { cancel: false, items: tempItems, eventName: this.toolbarAction };
        fListBox.trigger('actionBegin', localDataArgs);
        if (localDataArgs.cancel) {
            return;
        }
        if (tListBox.listData.length === 0) {
            const noRecElem: Element = tListBox.ulElement.childNodes[0] as Element;
            if (noRecElem) {
                tListBox.ulElement.removeChild(noRecElem);
            }
        }
        if (fListBox.listData.length > 0) {
            // eslint-disable-next-line prefer-spread
            flistboxarray = Array.apply(null, { length: fListBox.ulElement.childElementCount }).map(Number.call, Number);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const childNodes: any = fListBox.ulElement.childNodes;
        const childElementCount: number = fListBox.ulElement.childElementCount;
        const newFlistboxArray: number[] = [];
        for (let i: number = 0; i < childElementCount; i++) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const childNode: any = childNodes[i as number] as HTMLElement;
            if (childNode.classList.contains('e-disabled')) {
                tempLiColl.push(childNode);
                if (this.sortOrder != null) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    tempData.push(fListBox.sortedData[i as number] as any);
                } else {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    tempData.push(fListBox.listData[i as number] as any);
                }
            } else {
                newFlistboxArray.push(i);
            }
        }
        flistboxarray = newFlistboxArray;
        moveTo(fListBox.ulElement, tListBox.ulElement, flistboxarray, index);
        fListBox.trigger('actionComplete', { items: tempItems, eventName: this.toolbarAction });
        if (isKey) { this.list.focus(); }
        index = (index) ? index : listData.length;
        for (let i: number = 0; i < flistboxarray.length; i++) {
            if (this.sortOrder != null) {
                listData.splice(index + i, 0, fListBox.sortedData[flistboxarray[i as number]]);
            } else {
                listData.splice(index + i, 0, fListBox.listData[flistboxarray[i as number]]);
            }
        }
        for (let i: number = 0; i < flistboxarray.length; i++) {
            jsonData.splice(index + i, 0, fListBox.jsonData[flistboxarray[i as number]] as {[key: string]: object});
        }
        let fliCollections: HTMLElement[] = [];
        if (tempLiColl.length > 0) {
            fListBox.liCollections = tempLiColl;
            fliCollections = [].slice.call(fListBox.liCollections);
        } else {
            fliCollections = [].slice.call(fListBox.liCollections);
            fListBox.liCollections = [];
        }
        const tliCollections: HTMLElement[] = [].slice.call(tListBox.liCollections);
        if (index) {
            const toColl: HTMLElement[] = tliCollections.splice(0, index);
            tListBox.liCollections = toColl.concat(fliCollections).concat(tliCollections);
        } else {
            tListBox.liCollections = tliCollections.concat(fliCollections);
        }
        fListBox.value = [];
        (listData as sortedType[]) = (listData as sortedType[]).filter((data: sortedType) => (data !== undefined));
        (listData as sortedType[]) = (listData as sortedType[])
            .filter((data: sortedType) => (data as { isHeader: boolean }).isHeader !== true);
        const sortedData: dataType[] = listData.filter(function(val: dataType): dataType {
            return (tListBox.jsonData as dataType[]).indexOf(val) === -1;
        });
        for (let i: number = 0; i < sortedData.length; i++) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            tListBox.jsonData.splice(index + i, 0, sortedData[i as number] as any);
        }
        (tListBox.listData as dataType[]) = listData;
        if (fListBox.listData.length === fListBox.jsonData.length) {
            fListBox.listData = fListBox.sortedData = fListBox.jsonData = tempData;
        } else if (fListBox.allowFiltering) {
            const disabledData: { [key: string]: Object }[] = [];
            if (tempLiColl.length > 0) {
                for (let i: number = 0; i < tempLiColl.length; i++) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    disabledData.push(fListBox.getDataByValue(tempLiColl[i as number].getAttribute('data-value')) as any);
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                fListBox.listData = (fListBox as any).listData.filter((obj1: any) =>
                    !disabledData.some((obj2: any) => obj1 === obj2)) as any;
            }
            for (let i: number = 0; i < fListBox.listData.length; i++) {
                for (let j: number = 0; j < fListBox.jsonData.length; j++) {
                    if (fListBox.listData[i as number] === fListBox.jsonData[j as number]) {
                        fListBox.jsonData.splice(j, 1);
                    }
                }
            }
            if (tempLiColl.length > 0) {
                fListBox.listData = disabledData;
                fListBox.sortedData = [];
            } else {
                fListBox.listData = fListBox.sortedData = [];
            }
        }
        if (isRefresh) {
            const sourceElem: HTMLElement = tListBox.renderItems(listData as obj[], tListBox.fields);
            tListBox.updateListItems(sourceElem, tListBox.ulElement);
        } else {
            (tListBox.sortedData as dataType[]) = listData;
        }
        fListBox.updateSelectedOptions();
        if (tempLiColl.length > 0) {
            const wrap: Element = this.list.parentElement.getElementsByClassName('e-listbox-tool')[0];
            const btn: HTMLButtonElement = wrap.querySelector('[data-value="' + this.toolbarAction + '"]');
            btn.disabled = true;
        }
        if (fListBox.listData.length === 0 && tempLiColl.length === 0) {
            fListBox.l10nUpdate();
        }
    }

    private changeData(fromIdx: number, toIdx: number, jsonToIdx: number, ele: Element): void {
        const listData: obj[] = [].slice.call(this.listData);
        const jsonData: obj[] = [].slice.call(this.jsonData);
        const sortData: obj[] = [].slice.call(this.sortedData);
        const jsonIdx: number = Array.prototype.indexOf.call(this.jsonData, this.getDataByElems([ele])[0]);
        const sortIdx: number = Array.prototype.indexOf.call(this.sortedData, this.getDataByElems([ele])[0]);
        const liColl: HTMLElement[] = [].slice.call(this.liCollections);
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

    private getGrabbedItems(args: DragEventArgs): Element[] {
        let grabbItems : boolean = false;
        for (let i: number = 0; i < this.value.length; i++) {
            if (this.value[i as number] === this.getFormattedValue(args.target.getAttribute('data-value')) as string) {
                grabbItems = true;
                break;
            }
        }
        if (grabbItems) {
            for (let i: number = 0; i < this.value.length; i++) {
                const liColl: NodeListOf<Element> = this.list.querySelectorAll('[aria-selected="true"]');
                for (let j: number = 0; j < liColl.length; j++) {
                    if (this.value[i as number] === this.getFormattedValue(liColl[j as number].getAttribute('data-value')) as string) {
                        liColl[j as number].classList.add('e-grabbed');
                    }
                }
            }
        }
        let elems: Element[];
        if (this.isAngular) {
            elems = Array.prototype.slice.call(this.element.getElementsByClassName('e-list-parent')[0].querySelectorAll('.e-grabbed'));
        } else {
            elems = Array.prototype.slice.call(this.element.nextElementSibling.querySelectorAll('.e-grabbed'));
        }
        return elems;
    }

    private getDragArgs(args: DragEventArgs , isDragEnd?: boolean): DragEventArgs {
        let elems: Element[] = this.getGrabbedItems(args);
        if (elems.length) {
            if (isDragEnd) {
                elems.push(args.target);
            }
        } else {
            elems = [args.target];
        }
        return { elements: elems, event: args.event, items: this.getDataByElems(elems) } as DragEventArgs;
    }

    private onKeyDown(e: KeyboardEvent): void {
        this.keyDownHandler(e);
        e.stopPropagation();
    }

    private keyDownStatus: boolean = false;

    private keyDownHandler(e: KeyboardEvent): void {
        if ([32, 35, 36, 37, 38, 39, 40, 65].indexOf(e.keyCode) > -1 && (!this.allowFiltering ||
            (this.allowFiltering && e.target !== this.filterInput))) {
            if (e.target && (e.target as Element).className.indexOf('e-edit-template') > -1) {
                return;
            }
            e.preventDefault();
            if (e.keyCode === 32 && this.ulElement.children.length) {
                this.selectHandler({
                    target: this.ulElement.getElementsByClassName('e-focused')[0],
                    ctrlKey: e.ctrlKey, shiftKey: e.shiftKey
                });
            } else if (e.keyCode === 65 && e.ctrlKey && this.selectionSettings.mode === 'Multiple') {
                this.selectAll();
            } else if ((e.keyCode === 38 || e.keyCode === 40) && e.ctrlKey && e.shiftKey) {
                this.moveUpDown(e.keyCode === 38 ? true : false, true);
            } else if ((this.toolbarSettings.items.length || this.tBListBox) && (e.keyCode === 39 || e.keyCode === 37) && e.ctrlKey) {
                const listObj: ListBox = this.tBListBox || this.getScopedListBox();
                if (e.keyCode === 39) {
                    if (e.shiftKey) {
                        this.moveAllData(this, listObj, true);
                    } else {
                        this.moveData(this, listObj, true);
                    }
                } else {
                    if (e.shiftKey) {
                        this.moveAllData(listObj, this, true);
                    } else {
                        this.moveData(listObj, this, true);
                    }
                }
            } else if (e.keyCode !== 37 && e.keyCode !== 39 && e.code !== 'KeyA') {
                this.upDownKeyHandler(e);
            }
        } else if (this.allowFiltering) {
            if (e.keyCode === 40 || e.keyCode === 38) {
                this.upDownKeyHandler(e);
            }
        }
    }

    private upDownKeyHandler(e: KeyboardEvent): void {
        const ul: Element = this.ulElement;
        const defaultIdx: number = (e.keyCode === 40 || e.keyCode === 36) ? 0 : ul.childElementCount - 1;
        let fliIdx: number = defaultIdx;
        const fli: Element = ul.getElementsByClassName('e-focused')[0] || ul.getElementsByClassName(cssClass.selected)[0];
        if (fli) {
            if (e.keyCode !== 35 && e.keyCode !== 36) {
                fliIdx = Array.prototype.indexOf.call(ul.children, fli);
                if (e.keyCode === 40) {
                    fliIdx++;
                } else {
                    fliIdx--;
                }
                if (fliIdx < 0 || fliIdx > ul.childElementCount - 1) {
                    return;
                }
            }
            removeClass([fli], 'e-focused');
        }
        const cli: Element = ul.children[fliIdx as number];
        if (cli) {
            fliIdx = this.getValidIndex(cli, fliIdx, e.keyCode);
            if (fliIdx === -1) {
                addClass([fli], 'e-focused');
                return;
            }
            (ul.children[fliIdx as number] as HTMLElement).focus();
            ul.children[fliIdx as number].classList.add('e-focused');
            if (!e.ctrlKey || !this.selectionSettings.showCheckbox && e.shiftKey && (e.keyCode === 36 || e.keyCode === 35)) {
                this.selectHandler({ target: ul.children[fliIdx as number], ctrlKey: e.ctrlKey, shiftKey: e.shiftKey }, true);
            }
            if (this.selectionSettings.showCheckbox && e.ctrlKey && e.shiftKey && (e.keyCode === 36 || e.keyCode === 35)) {
                const selectedidx : number = Array.prototype.indexOf.call(ul.children, fli);
                const sidx : number = e.code === 'Home' ? 0 : selectedidx;
                const eidx : number = e.code === 'Home' ? selectedidx : ul.children.length - 1;
                for (let i: number = sidx; i <= eidx; i++) {
                    const item: Element = ul.children[i as number];
                    this.notify('updatelist', { li: item, e: {
                        target: this.ulElement.getElementsByClassName('e-focused')[0],
                        ctrlKey: e.ctrlKey, shiftKey: e.shiftKey
                    }, module: 'listbox' });
                }
            }
        }
    }

    private KeyUp(e: KeyboardEvent): void {
        if (this.allowFiltering && ((e.ctrlKey && e.keyCode === 65) || (e.keyCode === 8 && !this.filterInput.value))) {
            e.preventDefault(); return;
        }
        const char: string = String.fromCharCode(e.keyCode);
        const isWordCharacter: Object = char.match(/\w/);
        if (!isNullOrUndefined(isWordCharacter)) {
            this.isValidKey = true;
        }
        this.isValidKey = (e.keyCode === 8) || (e.keyCode === 46) || this.isValidKey;
        if (this.isValidKey) {
            this.isValidKey = false;
            switch (e.keyCode) {
            default:
                if (this.allowFiltering) {
                    const eventArgsData: { [key: string]: Object } = {
                        preventDefaultAction: false,
                        text: this.targetElement(),
                        updateData: (
                            dataSource: {
                                [key: string]: Object
                            }[] | DataManager | string[] | number[], query?: Query, fields?: FieldSettingsModel) => {
                            if (eventArgsData.cancel) { return; }
                            this.isFiltered = true;
                            this.remoteFilterAction = true;
                            this.preventDefActionFilter = eventArgsData.preventDefaultAction as boolean;
                            this.dataUpdater(dataSource, query, fields);
                            this.preventDefActionFilter = false;
                        },
                        event: e,
                        cancel: false
                    };
                    this.trigger('filtering', eventArgsData, (args: FilteringEventArgs) => {
                        this.isDataFetched = false;
                        if (args.cancel || (this.filterInput.value !== '' && this.isFiltered)) {
                            return;
                        }
                        this.preventDefActionFilter = false;
                        if (!args.cancel && !this.isCustomFiltering && !args.preventDefaultAction) {
                            this.inputString = this.filterInput.value;
                            this.filteringAction(this.jsonData, new Query(), this.fields);
                            if (this.toolbarSettings.items.length > 0) { this.updateToolBarState(); }
                        }
                        if (!this.isFiltered && !this.isCustomFiltering && !args.preventDefaultAction) {
                            this.dataUpdater(this.jsonData, new Query(), this.fields);
                        }
                    });
                }
            }
        }
    }
    /**
     * To filter the data from given data source by using query.
     *
     * @param  {Object[] | DataManager } dataSource - Set the data source to filter.
     * @param  {Query} query - Specify the query to filter the data.
     * @param  {FieldSettingsModel} fields - Specify the fields to map the column in the data table.
     * @returns {void}.
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
        return isNullOrUndefined(this.targetInputElement) ? null : this.targetInputElement.value;
    }

    private dataUpdater(
        dataSource: { [key: string]: Object }[] | DataManager | string[] | number[] | boolean[],
        query?: Query, fields?: FieldSettingsModel): void {
        this.isDataFetched = false;
        const backCommand: boolean = true;
        if (this.targetElement() && this.targetElement().trim() === '') {
            let list: HTMLElement = this.mainList.cloneNode ? <HTMLElement>this.mainList.cloneNode(true) : this.mainList;
            if (backCommand) {
                this.remoteCustomValue = false;
                if (this.isAngular && this.itemTemplate) {
                    list = this.renderItems(this.listData as obj[], fields);
                }
                this.onActionComplete(list, this.jsonData as { [key: string]: Object }[] | string[] | number[] | boolean[]);
                this.notify('reOrder', { module: 'CheckBoxSelection', enable: this.selectionSettings.showCheckbox, e: this });
            }
        } else {
            this.resetList(dataSource, fields, query);
        }
    }

    private focusOutHandler(): void {
        const ele: Element = this.list.getElementsByClassName('e-focused')[0];
        if (ele) {
            ele.classList.remove('e-focused');
        }
        if (this.allowFiltering) {
            this.refreshClearIcon();
        }
    }

    private resizeHandler(): void {
        if (this.list && !(this.cssClass && this.cssClass.indexOf('e-horizontal-listbox') > -1)) {
            if (this.list.getElementsByClassName('e-filter-parent').length > 0 && this.allowFiltering) {
                this.ulElement.style.setProperty('height', 'calc(100% - ' + (this.filterParent.offsetHeight) + 'px)', 'important');
            }
        }
    }

    private getValidIndex(cli: Element, index: number, keyCode: number): number {
        const cul: Element = this.ulElement;
        if (cli.classList.contains('e-disabled') || cli.classList.contains(cssClass.group)) {
            if (keyCode === 40 || keyCode === 36) {
                index++;
            } else {
                index--;
            }
        }
        if (index < 0 || index === cul.childElementCount) {
            return -1;
        }
        cli = (cul.childNodes as NodeListOf<Element>)[index as number];
        if (cli.classList.contains('e-disabled') || cli.classList.contains(cssClass.group)) {
            index = this.getValidIndex(cli, index, keyCode);
        }
        return index;
    }

    private updateSelectedOptions(): void {
        const selectedOptions: string[] = [];
        const values: string[] = [];
        extend(values, this.value as string[]);
        this.getSelectedItems().forEach((ele: Element) => {
            if (!ele.classList.contains('e-grabbed')) {
                selectedOptions.push(this.getFormattedValue(ele.getAttribute('data-value')) as string);
            }
        });
        if (this.mainList.childElementCount === this.ulElement.childElementCount) {
            if (this.allowFiltering && this.selectionSettings.showCheckbox) {
                for (let i: number = 0; i < selectedOptions.length; i++) {
                    if (values.indexOf(selectedOptions[i as number]) > -1) {
                        continue;
                    } else {
                        values.push(selectedOptions[i as number]);
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
                    li.removeAttribute('aria-selected');
                }
            });
        }
    }

    private setSelection(
        // eslint-disable-next-line max-len
        values: (string | boolean | number | object)[] = this.value, isSelect: boolean = true, isText: boolean = false, canFocus: boolean = true): void {
        let li: Element;
        let liselect: boolean;
        if (values) {
            values.forEach((value: string) => {
                let text: string | number | boolean;
                if (isText) {
                    text = this.getValueByText(value);
                } else {
                    text = value;
                }
                if (typeof(text) === 'string') {
                    text = text.split('\\').join('\\\\');
                    li = this.list.querySelector('[data-value="' + text.replace(/"/g, '\\"') + '"]');
                } else {
                    li = this.list.querySelector('[data-value="' + text + '"]');
                }
                if (li) {
                    if (this.selectionSettings.showCheckbox && !li.classList.contains('e-disabled')) {
                        liselect = li.getElementsByClassName('e-frame')[0].classList.contains('e-check');
                    } else {
                        liselect = li.classList.contains('e-selected');
                    }
                    if (!isSelect && liselect || isSelect && !liselect && li) {
                        if (this.selectionSettings.showCheckbox && !li.classList.contains('e-disabled')) {
                            this.notify('updatelist', { li: li, module: 'listbox' });
                            if (canFocus) { (li as HTMLElement).focus(); }
                        } else {
                            if (isSelect && !li.classList.contains('e-disabled')) {
                                li.classList.add(cssClass.selected);
                                li.setAttribute('aria-selected', 'true');
                                if (canFocus) { (li as HTMLElement).focus(); }
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
        const ele: Element = this.getSelectTag(); let innerHTML: string = '';
        if (isNullOrUndefined(ele)) { return; }
        ele.innerHTML = '';
        if (this.value) {
            for (let i: number = 0, len: number = this.value.length; i < len; i++) {
                innerHTML += '<option selected>' + this.value[i as number] + '</option>';
            }
            ele.innerHTML += innerHTML;
            for (let i: number = 0, len: number = ele.childNodes.length; i < len; i++) {
                (ele.childNodes[i as number] as HTMLElement).setAttribute('value', this.value[i as number].toString());
            }
        }
        this.checkSelectAll();
    }

    private checkDisabledState(inst: ListBox): boolean {
        if (isNullOrUndefined(inst.ulElement)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (!isNullOrUndefined(this.dataSource) && isNullOrUndefined((this.dataSource as any).length)) {
                return false;
            } else {
                return true;
            }
        } else {
            if (inst.ulElement.querySelectorAll('.e-disabled').length > 0) {
                return inst.liCollections.length === inst.ulElement.querySelectorAll('.e-disabled').length;
            }
            return inst.ulElement.querySelectorAll('.' + cssClass.li).length === 0;
        }
    }

    private updateToolBarState(): void {
        if (this.toolbarSettings.items.length) {
            const listObj: ListBox = this.getScopedListBox();
            const wrap: Element = this.list.parentElement.getElementsByClassName('e-listbox-tool')[0];
            this.toolbarSettings.items.forEach((value: string) => {
                const btn: HTMLButtonElement = wrap.querySelector('[data-value="' + value + '"]');
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
        const listWrap: HTMLElement = this.list;
        if (!this.initLoad && this.selectionSettings.checkboxPosition === 'Left') {
            listWrap.classList.remove('e-right');
        }
        if (this.selectionSettings.checkboxPosition === 'Right') {
            listWrap.classList.add('e-right');
        }
    }

    private showCheckbox(showCheckbox: boolean): void {
        let index: number = 0;
        const liColl: NodeListOf<Element> = this.list.lastElementChild.querySelectorAll('li');
        const liCollLen: number = this.list.lastElementChild.getElementsByClassName('e-list-item').length;
        if (showCheckbox) {
            this.ulElement = this.renderItems(this.listData as obj[], this.fields);
            this.mainList = this.ulElement;
            this.list.removeChild(this.list.getElementsByTagName('ul')[0]);
            this.list.appendChild(this.ulElement);
            if (this.selectionSettings.showSelectAll && !this.list.getElementsByClassName('e-selectall-parent')[0]) {
                const l10nShow: L10n = new L10n(
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
            for (index; index < liCollLen; index++) {
                if (liColl[index as number].classList.contains('e-list-item')) {
                    liColl[index as number].removeChild(liColl[index as number].getElementsByClassName('e-checkbox-wrapper')[0]);
                }
                if (liColl[index as number].hasAttribute('aria-selected')) {
                    liColl[index as number].removeAttribute('aria-selected');
                }
            }
            this.mainList = this.ulElement;
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
     *
     * @private
     * @returns {string} - Module name
     */
    public getModuleName(): string {
        return 'listbox';
    }

    /**
     * Get the properties to be maintained in the persisted state.
     *
     * @returns {string} - Persist data
     */
    protected getPersistData(): string {
        return this.addOnPersist(['value']);
    }

    protected getLocaleName(): string {
        return 'listbox';
    }

    public destroy(): void {
        this.unwireEvents();
        if (this.element.tagName === 'EJS-LISTBOX') {
            this.element.innerHTML = '';
        } else {
            this.element.style.display = 'inline-block';
            if (this.toolbarSettings.items.length) {
                this.list.parentElement.parentElement.insertBefore(this.list, this.list.parentElement);
                detach(this.list.nextElementSibling);
            }
            this.list.parentElement.insertBefore(this.element, this.list);
        }
        super.destroy();
        this.enableRtlElements = []; this.liCollections = null; this.list = null; this.ulElement = null;
        this.mainList = null; this.spinner = null; this.rippleFun = null;
        if (this.itemTemplate) { this.clearTemplate(); }
    }

    /**
     * Called internally if any of the property value changed.
     *
     * @param {ListBoxModel} newProp - Specifies the new properties.
     * @param {ListBoxModel} oldProp - Specifies the old properties.
     * @returns {void}
     * @private
     */
    public onPropertyChanged(newProp: ListBoxModel, oldProp: ListBoxModel): void {
        const wrap: Element = this.toolbarSettings.items.length ? this.list.parentElement : this.list;
        super.onPropertyChanged(newProp, oldProp);
        this.setUpdateInitial(['fields', 'query', 'dataSource'], newProp as { [key: string]: string; });
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'cssClass':
                if (oldProp.cssClass) {
                    removeClass([wrap], oldProp.cssClass.split(' '));
                }
                if (newProp.cssClass) {
                    addClass([wrap], newProp.cssClass.replace(/\s+/g, ' ').trim().split(' '));
                }
                break;
            case 'enableRtl':
                if (newProp.enableRtl) {
                    this.list.classList.add('e-rtl');
                } else {
                    this.list.classList.remove('e-rtl');
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
                    if (this.ulElement.classList.contains('e-sortable')) {
                        (getComponent(this.ulElement, 'sortable') as Sortable).destroy();
                    }
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
            case 'toolbarSettings': {
                let ele: Element;
                const pos: string = newProp.toolbarSettings.position;
                const toolElem: Element = this.getToolElem();
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
                    oldProp.toolbarSettings.items = isNullOrUndefined(oldProp.toolbarSettings.items) ? [] : oldProp.toolbarSettings.items;
                    if (oldProp.toolbarSettings && oldProp.toolbarSettings.items.length) {
                        ele = this.list.parentElement;
                        ele.parentElement.insertBefore(this.list, ele);
                        detach(ele);
                    }
                    this.initToolbarAndStyles();
                    this.wireToolbarEvent();
                }
                break;
            }
            case 'selectionSettings': {
                const showSelectAll: boolean = newProp.selectionSettings.showSelectAll;
                const showCheckbox: boolean = newProp.selectionSettings.showCheckbox;
                if (!isNullOrUndefined(showSelectAll)) {
                    this.showSelectAll = showSelectAll;
                    if (this.showSelectAll) {
                        const l10nSel: L10n = new L10n(
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
            }
            case 'dataSource':
                this.isDataSourceUpdate = true;
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
    /**
     * Returns the list element before rendering.
     */
    element: Element;
    /**
     * Returns the list item before rendering.
     */
    item: { [key: string]: Object };
}

/**
 * Interface for drag and drop event args.
 */
export interface SourceDestinationModel {
    /**
     * Specifies the list items before  drag or drop in the ListBox.
     */
    previousData?: string[] | boolean[] | number[] | { [key: string]: Object; }[] | DataManager;
    /**
     * Specifies the list items after drag or drop in the ListBox.
     */
    currentData?: string[] | boolean[] | number[] | { [key: string]: Object; }[] | DataManager;
}

/**
 * Interface for drag and drop event.
 */
export interface DragEventArgs {
    /**
     * Returns the previous index of the selected list item.
     */
    previousIndex?: number;
    /**
     * Returns the current index of the selected list item.
     */
    currentIndex?: number;
    /**
     * Returns the selected list element.
     */
    elements: Element[];
    /**
     * Returns the selected list items.
     */
    items: Object[];
    /**
     * Returns the target list element where the selected list element to be dropped.
     */
    target?: Element;
    /**
     * Returns true if the list element is dragged from ListBox. Otherwise, it remains false.
     */
    dragSelected?: boolean;
    /**
     * Returns the previous list item.
     */
    previousItem?: object[];
    /**
     * Returns the previous  and current list items of the source list box.
     */
    source?: SourceDestinationModel;
    /**
     * Returns the previous and current list items of the destination list box.
     */
    destination?: SourceDestinationModel;
    /**
     * Specifies the event.
     */
    event: Event;
    /**
     * Illustrates whether the current action needs to be prevented or not.
     */
    cancel?: boolean;
}

/**
 * Interface for change event args.
 */
export interface ListBoxChangeEventArgs extends BaseEventArgs {
    /**
     * Returns the selected list elements.
     */
    elements: Element[];
    /**
     * Returns the selected list items.
     */
    items: Object[];
    /**
     * Returns the selected state or selected list item in the ListBox.
     */
    value: number[] | string[] | boolean[];
    /**
     * Specifies the event.
     */
    event: Event;
}

/**
 * Interface for Drop event args.
 */
export interface DropEventArgs {
    /**
     * Returns the previous index of the selected list item.
     */
    previousIndex: number;
    /**
     * Returns the current index of the selected list item.
     */
    currentIndex: number;
    /**
     * Returns the selected list element to be dropped.
     */
    droppedElement: Element;
    /**
     * Returns the target list element where the selected list element to be dropped.
     */
    target: Element;
    /**
     * Returns the dragged list element.
     */
    helper: Element;
    /**
     * Illustrates whether the current action needs to be prevented or not.
     */
    cancel?: boolean;
    /**
     * Returns the selected list items.
     */
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
    clearIcon: 'e-clear-icon'
};

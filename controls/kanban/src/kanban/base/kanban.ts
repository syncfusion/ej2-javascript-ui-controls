/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ModuleDeclaration, NotifyPropertyChanges, Property, Complex, Collection, detach } from '@syncfusion/ej2-base';
import { addClass, classList, removeClass, compile, formatUnit, L10n, Browser, Event, EmitType } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { createSpinner, hideSpinner, showSpinner } from '@syncfusion/ej2-popups';
import { Data } from './data';
import { KanbanModel } from './kanban-model';
import { SwimlaneSettings } from '../models/swimlane-settings';
import { CardSettings } from '../models/card-settings';
import { DialogSettings } from '../models/dialog-settings';
import { Columns } from '../models/columns';
import { StackedHeaders } from '../models/stacked-headers';
import { SortSettings } from '../models/sort-settings';
import { CardSettingsModel, ColumnsModel, SwimlaneSettingsModel, StackedHeadersModel, DialogSettingsModel } from '../models/index';
import { SortSettingsModel } from '../models/index';
import { ActionEventArgs, CardClickEventArgs, CardRenderedEventArgs, DragEventArgs, ScrollPosition } from './interface';
import { QueryCellInfoEventArgs, DialogEventArgs, DataStateChangeEventArgs, DataSourceChangedEventArgs } from './interface';
import { ReturnType, ConstraintType, CurrentAction } from './type';
import { Action } from '../actions/action';
import { Crud } from '../actions/crud';
import { DragAndDrop } from '../actions/drag';
import { KanbanDialog } from '../actions/dialog';
import { Keyboard } from '../actions/keyboard';
import { KanbanTooltip } from '../actions/tooltip';
import { KanbanTouch } from '../actions/touch';
import { LayoutRender } from './layout-render';
import * as events from '../base/constant';
import * as cls from './css-constant';

/**
 * The Kanban component is an efficient way to visually depict various stages of a process using cards with transparent workflows.
 * The component has rich set of APIs, methods, and events used to enable or disable its features and customize them.
 * ```html
 * <div id="kanban"></div>
 * ```
 * ```typescript
 * <script>
 *   var kanbanObj = new Kanban();
 *   kanbanObj.appendTo("#kanban");
 * </script>
 * ```
 */

@NotifyPropertyChanges
export class Kanban extends Component<HTMLElement> {
    public isAdaptive: boolean;
    public crudModule: Crud;
    public dataModule: Data;
    public layoutModule: LayoutRender;
    public actionModule: Action;
    public dragAndDropModule: DragAndDrop;
    public dialogModule: KanbanDialog;
    public keyboardModule: Keyboard;
    public tooltipModule: KanbanTooltip;
    public touchModule: KanbanTouch;
    public kanbanData: Record<string, any>[];
    public activeCardData: CardClickEventArgs;
    public localeObj: L10n;
    public swimlaneToggleArray: string[];
    public scrollPosition: ScrollPosition;
    public isInitialRender: boolean;
    public externalDropObj: Kanban;
    public isExternalKanbanDrop: boolean;

    // Kanban Options

    /**
     * It is used to customize the Kanban, which accepts custom CSS class names that defines specific user-defined
     * styles and themes to be applied on the Kanban element.
     *
     * @default null
     */
    @Property()
    public cssClass: string;

    /**
     * Sets the `width` of the Kanban component, accepting both string and number values.
     * The string value can be either pixel or percentage format.
     * When set to `auto`, the Kanban width gets auto-adjusted and display its content related to the viewable screen size.
     *
     * @default 'auto'
     */
    @Property('auto')
    public width: string | number;

    /**
     * Sets the `height` of the Kanban component, accepting both string and number values.
     * The string type includes either pixel or percentage values.
     * When `height` is set with specific pixel value, then the Kanban will be rendered to that specified space.
     * In case, if `auto` value is set, then the height of the Kanban gets auto-adjusted within the given container.
     *
     * @default 'auto'
     */
    @Property('auto')
    public height: string | number;

    /**
     * With this property, the card data will be bound to Kanban.
     * The card data can be passed either as an array of JavaScript objects,
     * or else can create an instance of [`DataManager`](http://ej2.syncfusion.com/documentation/data/api-dataManager.html)
     * in case of processing remote data and can be assigned to the `dataSource` property.
     * With the remote data assigned to dataSource, check the available
     *  [adaptors](http://ej2.syncfusion.com/documentation/data/adaptors.html) to customize the data processing.
     *
     * @default []
     * @isGenericType true
     */
    @Property([])
    public dataSource: Record<string, any>[] | DataManager;

    /**
     * Defines the external [`query`](http://ej2.syncfusion.com/documentation/data/api-query.html)
     * that will be executed along with the data processing.
     *
     * @default null
     */
    @Property()
    public query: Query;

    /**
     * Defines the key field of Kanban board. The Kanban renders its layout based on this key field.
     *
     * @default null
     */
    @Property()
    public keyField: string;

    /**
     * Defines the constraint type used to apply validation based on column or swimlane. The possible values are:
     * * Column
     * * Swimlane
     *
     * @default column
     */
    @Property('Column')
    public constraintType: ConstraintType;

    /**
     * Defines the ID of drop component on which drop should occur.
     *
     * @default []
     */
    @Property([])
    public externalDropId: string[];

    /**
     * Defines the Kanban board columns and their properties such as header text, key field, template, allow toggle,
     * expand or collapse state, min or max count, and show or hide item count.
     *
     * @default []
     */
    @Collection<ColumnsModel>([], Columns)
    public columns: ColumnsModel[];

    /**
     * When this property is set to true, it allows the keyboard interaction in Kanban.
     *
     * @default true
     */
    @Property(true)
    public allowKeyboard: boolean;

    /**
     * Determine whether to prevent cross-site scripting code in Kanban data entry fields.
     *
     * @default true
     */
    @Property(true)
    public enableHtmlSanitizer: boolean;

    /**
     * Defines the stacked header for Kanban columns with text and key fields.
     *
     * @default []
     */
    @Collection<StackedHeadersModel>([], StackedHeaders)
    public stackedHeaders: StackedHeadersModel[];

    /**
     * Defines the swimlane settings to Kanban board such as key field, text field, template, allow drag-and-drop,
     * show or hide empty row, show or hide items count, and more.
     *
     * @default {}
     */
    @Complex<SwimlaneSettingsModel>({}, SwimlaneSettings)
    public swimlaneSettings: SwimlaneSettingsModel;

    /**
     * Defines the Kanban board related settings such as header field, content field, template,
     * show or hide header, and single or multiple selection.
     *
     * @default {}
     */
    @Complex<CardSettingsModel>({}, CardSettings)
    public cardSettings: CardSettingsModel;

    /**
     * Defines the sort settings such as field and direction.
     *
     * @default {}
     */
    @Complex<SortSettingsModel>({}, SortSettings)
    public sortSettings: SortSettingsModel;

    /**
     * Defines the dialog settings such as template and fields.
     *
     * @default {}
     */
    @Complex<DialogSettingsModel>({}, DialogSettings)
    public dialogSettings: DialogSettingsModel;

    /**
     * Enables or disables the drag and drop actions in Kanban.
     *
     * @default true
     */
    @Property(true)
    public allowDragAndDrop: boolean;

    /**
     * Enables or disables the tooltip in Kanban board. The property relates to the tooltipTemplate property.
     *
     * @default false
     */
    @Property(false)
    public enableTooltip: boolean;

    /**
     * Enable or disable the columns when empty dataSource.
     *
     * @default false
     */
    @Property(false)
    public showEmptyColumn: boolean;

    /**
     * Enables or disables the persisting component's state between page reloads.
     * If enabled, columns, dataSource properties will be persisted in kanban.
     *
     * @default false
     */
    @Property(false)
    public enablePersistence: boolean;

    /**
     * Defines the template content to card’s tooltip. The property works by enabling the ‘enableTooltip’ property.
     *
     * @default null
     */
    @Property()
    public tooltipTemplate: string;

    /**
     * Triggers on beginning of every Kanban action.
     *
     * @event 'actionBegin'
     */
    @Event()
    public actionBegin: EmitType<ActionEventArgs>;
    /**
     * Triggers on successful completion of the Kanban actions.
     *
     * @event 'actionComplete'
     */
    @Event()
    public actionComplete: EmitType<ActionEventArgs>;
    /**
     * Triggers when a Kanban action gets failed or interrupted and an error information will be returned.
     *
     * @event 'actionFailure'
     */
    @Event()
    public actionFailure: EmitType<ActionEventArgs>;
    /**
     * Triggers after the kanban component is created.
     *
     * @event 'created'
     */
    @Event()
    public created: EmitType<Record<string, any>>;
    /**
     * Triggers before the data binds to the Kanban.
     *
     * @event 'dataBinding'
     */
    @Event()
    public dataBinding: EmitType<ReturnType>;
    /**
     * Triggers once the event data is bound to the Kanban.
     *
     * @event 'dataBound'
     */
    @Event()
    public dataBound: EmitType<ReturnType>;
    /**
     * Triggers on single-clicking the Kanban cards.
     *
     * @event 'cardClick'
     */
    @Event()
    public cardClick: EmitType<CardClickEventArgs>;
    /**
     * Triggers on double-clicking the Kanban cards.
     *
     * @event 'cardDoubleClick'
     */
    @Event()
    public cardDoubleClick: EmitType<CardClickEventArgs>;
    /**
     * Triggers before each column of the Kanban rendering on the page.
     *
     * @event 'queryCellInfo'
     */
    @Event()
    public queryCellInfo: EmitType<QueryCellInfoEventArgs>;
    /**
     * Triggers before each card of the Kanban rendering on the page.
     *
     * @event 'cardRendered'
     */
    @Event()
    public cardRendered: EmitType<CardRenderedEventArgs>;
    /**
     * Triggers when the card drag actions starts.
     *
     * @event 'dragStart'
     */
    @Event()
    public dragStart: EmitType<DragEventArgs>;
    /**
     * Triggers when the card is dragging to other stage or other swimlane.
     *
     * @event 'drag'
     */
    @Event()
    public drag: EmitType<DragEventArgs>;
    /**
     * Triggers when the card drag actions stops.
     *
     * @event 'dragStop'
     */
    @Event()
    public dragStop: EmitType<DragEventArgs>;
    /**
     * Triggers before the dialog opens.
     *
     * @event 'dialogOpen'
     */
    @Event()
    public dialogOpen: EmitType<DialogEventArgs>;
    /**
     * Triggers before the dialog closes.
     *
     * @event 'dialogClose'
     */
    @Event()
    public dialogClose: EmitType<DialogEventArgs>;

    /**
     * Triggers when the grid actions such as Sorting, Paging, Grouping etc., are done.
     * In this event,the current view data and total record count should be assigned to the `dataSource` based on the action performed.
     *
     * @event dataStateChange
     */
    @Event()
    public dataStateChange: EmitType<DataStateChangeEventArgs>;

    /**
     * Triggers when the grid data is added, deleted and updated.
     *
     * Invoke the done method from the argument to start render after edit operation.
     *
     * @event dataSourceChanged
     */
    @Event()
    public dataSourceChanged: EmitType<DataSourceChangedEventArgs>;
    protected needsID: boolean;

    /**
     * Constructor for creating the Kanban widget
     *
     * @param {KanbanModel} options Accepts the kanban properties to render the component.
     * @param {string | HTMLElement} element Accepts the DOM element reference as either selector or element to render the component.
     */
    constructor(options?: KanbanModel, element?: string | HTMLElement) {
        super(options, element);
        this.needsID = true;
    }

    /**
     * Initializes the values of private members.
     *
     * @returns {void}
     * @private
     */
    protected preRender(): void {
        this.isAdaptive = Browser.isDevice as boolean;
        this.kanbanData = [];
        if (!this.enablePersistence || !this.swimlaneToggleArray) {
            this.swimlaneToggleArray = [];
        }
        this.activeCardData = { data: null, element: null };
        const defaultLocale: Record<string, string> = {
            items: 'items',
            min: 'Min',
            max: 'Max',
            cardsSelected: 'Cards Selected',
            addTitle: 'Add New Card',
            editTitle: 'Edit Card Details',
            deleteTitle: 'Delete Card',
            deleteContent: 'Are you sure you want to delete this card?',
            save: 'Save',
            delete: 'Delete',
            cancel: 'Cancel',
            yes: 'Yes',
            no: 'No',
            close: 'Close',
            noCard: 'No cards to display',
            unassigned: 'Unassigned'
        };
        this.localeObj = new L10n(this.getModuleName(), defaultLocale, this.locale);
        this.scrollPosition = { content: { left: 0, top: 0 }, column: {} };
        this.isInitialRender = true;
    }

    /**
     * To provide the array of modules needed for control rendering
     *
     * @returns {ModuleDeclaration[]} Returns the declared modules.
     * @private
     */
    public requiredModules(): ModuleDeclaration[] {
        const modules: ModuleDeclaration[] = [];
        return modules;
    }

    /**
     * Returns the properties to be maintained in the persisted state.
     *
     * @returns {string} Returns the persistance state.
     * @private
     */
    protected getPersistData(): string {
        if ((this.dataSource as Record<string, any>[]).length > 0) {
            return this.addOnPersist(['columns', 'dataSource', 'swimlaneToggleArray']);
        } else {
            return this.addOnPersist(['columns', 'kanbanData', 'swimlaneToggleArray']);
        }
    }

    /**
     * Core method to return the component name.
     *
     * @returns {string} Returns the module name.
     * @private
     */
    public getModuleName(): string {
        return 'kanban';
    }

    /**
     * Core method that initializes the control rendering.
     *
     * @returns {void}
     * @private
     */
    public render(): void {
        const addClasses: string[] = [cls.ROOT_CLASS];
        const removeClasses: string[] = [];
        if (this.enableRtl) {
            addClasses.push(cls.RTL_CLASS);
        } else {
            removeClasses.push(cls.RTL_CLASS);
        }
        if (this.isAdaptive) {
            addClasses.push(cls.DEVICE_CLASS);
        } else {
            removeClasses.push(cls.DEVICE_CLASS);
        }
        if (this.cssClass) {
            addClasses.push(this.cssClass);
        }
        this.element.setAttribute('role', 'main');
        classList(this.element, addClasses, removeClasses);
        this.element.style.width = formatUnit(this.width);
        this.element.style.height = formatUnit(this.height);
        createSpinner({ target: this.element });
        this.showSpinner();
        this.initializeModules();
    }

    /**
     * Called internally, if any of the property value changed.
     *
     * @param {KanbanModel} newProp Gets the updated values
     * @param {KanbanModel} oldProp Gets the previous values
     * @returns {void}
     * @private
     */
    public onPropertyChanged(newProp: KanbanModel, oldProp: KanbanModel): void {
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'cssClass':
                if (oldProp.cssClass) { removeClass([this.element], oldProp.cssClass); }
                if (newProp.cssClass) { addClass([this.element], newProp.cssClass); }
                break;
            case 'enableRtl':
            case 'locale':
                this.refresh();
                break;
            case 'width':
                this.element.style.width = formatUnit(newProp.width);
                (this.element.querySelector('.' + cls.HEADER_CLASS).firstElementChild as HTMLElement).style.width = 'auto';
                this.notify(events.contentReady, {});
                break;
            case 'height':
                this.element.style.height = formatUnit(newProp.height);
                (this.element.querySelector('.' + cls.CONTENT_CLASS) as HTMLElement).style.height = 'auto';
                this.notify(events.contentReady, {});
                break;
            case 'dataSource':
            case 'query':
                if (this.dataModule) {
                    this.dataModule.setState({ isDataChanged: false });
                }
                this.dataModule = new Data(this);
                break;
            case 'columns':
            case 'constraintType':
                this.notify(events.dataReady, { processedData: this.kanbanData });
                break;
            case 'swimlaneSettings':
                this.onSwimlaneSettingsPropertyChanged(newProp.swimlaneSettings, oldProp.swimlaneSettings);
                break;
            case 'cardSettings':
                this.onCardSettingsPropertyChanged(newProp.cardSettings, oldProp.cardSettings);
                break;
            case 'allowDragAndDrop':
                if (newProp.allowDragAndDrop) {
                    this.layoutModule.wireDragEvent();
                } else {
                    this.layoutModule.unWireDragEvent();
                }
                break;
            case 'enableTooltip':
                if (this.tooltipModule) {
                    this.tooltipModule.destroy();
                    this.tooltipModule = null;
                }
                if (newProp.enableTooltip) {
                    this.tooltipModule = new KanbanTooltip(this);
                    this.layoutModule.refreshCards();
                }
                break;
            case 'dialogSettings':
                if (newProp.dialogSettings) {
                    this.dialogModule = new KanbanDialog(this);
                }
                break;
            case 'allowKeyboard':
                if (this.keyboardModule) {
                    this.keyboardModule.destroy();
                    this.keyboardModule = null;
                }
                if (newProp.allowKeyboard) {
                    this.keyboardModule = new Keyboard(this);
                }
                break;
            case 'stackedHeaders':
                this.layoutModule.refreshHeaders();
                break;
            case 'sortSettings':
                this.notify(events.dataReady, { processedData: this.kanbanData });
                break;
            default:
                break;
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private onSwimlaneSettingsPropertyChanged(newProp: SwimlaneSettingsModel, _oldProp: SwimlaneSettingsModel): void {
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'keyField':
            case 'textField':
            case 'showEmptyRow':
            case 'showItemCount':
            case 'template':
            case 'sortDirection':
                this.notify(events.dataReady, { processedData: this.kanbanData });
                break;
            case 'enableFrozenRows':
                if (this.layoutModule.frozenSwimlaneRow && !this.swimlaneSettings.enableFrozenRows) {
                    this.layoutModule.removeFrozenRows();
                }
                break;
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private onCardSettingsPropertyChanged(newProp: CardSettingsModel, _oldProp: CardSettingsModel): void {
        let cards: HTMLElement[] = [];
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'showHeader':
            case 'headerField':
            case 'contentField':
            case 'template':
            case 'tagsField':
            case 'grabberField':
            case 'footerCssField':
                this.layoutModule.refreshCards();
                break;
            case 'selectionType':
                cards = this.getSelectedCards();
                if (cards.length > 0) {
                    removeClass(cards, cls.CARD_SELECTION_CLASS);
                    this.layoutModule.disableAttributeSelection(cards);
                }
                break;
            }
        }
    }

    private initializeModules(): void {
        this.dataModule = new Data(this);
        this.layoutModule = new LayoutRender(this);
        if (this.allowKeyboard) {
            this.keyboardModule = new Keyboard(this);
        }
        this.actionModule = new Action(this);
        this.crudModule = new Crud(this);
        this.dragAndDropModule = new DragAndDrop(this);
        this.dialogModule = new KanbanDialog(this);
        if (this.enableTooltip) {
            this.tooltipModule = new KanbanTooltip(this);
        }
        if (Browser.isDevice || Browser.isTouch) {
            this.touchModule = new KanbanTouch(this);
        }
    }

    public renderTemplates(): void {
        if ((this as any).isReact) {
            this.renderReactTemplates();
        }
    }

    public resetTemplates(templates?: string[]): void {
        if ((this as any).isReact) {
            this.clearTemplate(templates);
        }
    }

    private destroyModules(): void {
        if (this.layoutModule) {
            this.layoutModule.destroy();
            this.layoutModule = null;
        }
        if (this.keyboardModule) {
            this.keyboardModule.destroy();
            this.keyboardModule = null;
        }
        if (this.touchModule) {
            this.touchModule.destroy();
            this.touchModule = null;
        }
        this.dialogModule = null;
        this.actionModule = null;
        this.crudModule = null;
        this.dataModule = null;
        this.dragAndDropModule = null;
    }

    public templateParser(template: string): any {
        if (template) {
            try {
                if (document.querySelectorAll(template).length) {
                    return compile(document.querySelector(template).innerHTML.trim());
                } else {
                    return compile(template);
                }
            } catch (error) {
                return compile(template);
            }
        }
        return undefined;
    }

    /**
     * Returns the card details based on card ID from the board.
     *
     * @function getCardDetails
     * @param {Element} target Accepts the card element to get the details.
     * @returns {Object} Returns the card details based on given target.
     */
    public getCardDetails(target: Element): Record<string, any> {
        const isNumeric: boolean = typeof (this.kanbanData[0])[this.cardSettings.headerField] === 'number';
        const targetId: string | number = isNumeric ? parseInt(target.getAttribute('data-id'), 10) : target.getAttribute('data-id');
        const cardObj: Record<string, any> = this.kanbanData.filter((data: Record<string, any>) =>
            data[this.cardSettings.headerField] === targetId)[0] as Record<string, any>;
        return cardObj;
    }

    /**
     * Returns the column data based on column key input.
     *
     * @function getColumnData
     * @param {string | number} columnKey Accepts the column key to get the objects.
     * @param {Object[]} dataSource Accepts the collection of objects to get the results based on given columnKey.
     * @returns {Object[]} Returns the collection of card objects based on given inputs.
     */
    public getColumnData(columnKey: string | number, dataSource?: Record<string, any>[]): Record<string, any>[] {
        return this.layoutModule.getColumnCards(dataSource)[`${columnKey}`] as Record<string, any>[] || [];
    }

    /**
     * Returns the swimlane column data based on swimlane keyField input.
     *
     * @function getSwimlaneData
     * @param {string} keyField Accepts the swimlane keyField to get the objects.
     * @returns {Object[]} Returns the collection of card objects based on given inputs.
     */
    public getSwimlaneData(keyField: string): Record<string, any>[] {
        return this.layoutModule.getSwimlaneCards()[`${keyField}`] as Record<string, any>[] || [];
    }

    /**
     * Gets the list of selected cards from the board.
     *
     * @function getSelectedCards
     * @returns {HTMLElement[]} Returns the card elements based on selection.
     */
    public getSelectedCards(): HTMLElement[] {
        return [].slice.call(this.element.querySelectorAll('.' + cls.CARD_CLASS + '.' + cls.CARD_SELECTION_CLASS));
    }

    /**
     * Allows you to show the spinner on Kanban at the required scenarios.
     *
     * @function showSpinner
     * @returns {void}
     */
    public showSpinner(): void {
        showSpinner(this.element);
    }

    /**
     * When the spinner is shown manually using the showSpinner method, it can be hidden using this `hideSpinner` method.
     *
     * @function hideSpinner
     * @returns {void}
     */
    public hideSpinner(): void {
        hideSpinner(this.element);
    }

    /**
     * To manually open the dialog.
     *
     * @function openDialog
     * @param {CurrentAction} action Accepts the action for which the dialog needs to be opened such as either for new card creation or
     *  editing of existing cards. The applicable action names are `Add` and `Edit`.
     * @param {Object} data It can be card data.
     * @returns {void}
     */
    public openDialog(action: CurrentAction, data?: Record<string, any>): void {
        this.dialogModule.openDialog(action, data as Record<string, any>);
    }

    /**
     * To manually close the dialog.
     *
     * @function closeDialog
     * @returns {void}
     */
    public closeDialog(): void {
        this.dialogModule.closeDialog();
    }

    /**
     * Adds the new card to the data source of Kanban and layout.
     *
     * @function addCard
     * @param {Object | Object[]} cardData Accepts Single card object or Collection of card objects to be added into Kanban.
     * @param {number} index Accepts the index to insert the card in column.
     * @returns {void}
     */
    public addCard(cardData: Record<string, any> | Record<string, any>[], index?: number): void {
        this.crudModule.addCard(cardData, index);
    }

    /**
     * Updates the changes made in the card object by passing it as a parameter to the data source.
     *
     * @function updateCard
     * @param {Object | Object[]} cardData Accepts Single card object or Collection of card objects to be updated into Kanban.
     * @param {number} index Accepts the index to update the card in column.
     * @returns {void}
     */
    public updateCard(cardData: Record<string, any> | Record<string, any>[], index?: number): void {
        this.crudModule.updateCard(cardData, index);
    }

    /**
     * Deletes the card based on the provided ID or card collection in the argument list.
     *
     * @function deleteCard
     * @param {string | number | Object | Object[]} cardData Accepts the ID of the remove card in string or number type or
     * Single card object or Collection of card objects to be removed from Kanban
     * @returns {void}
     */
    public deleteCard(cardData: string | number | Record<string, any> | Record<string, any>[]): void {
        this.crudModule.deleteCard(cardData);
    }

    /**
     * Add the column to Kanban board dynamically based on the provided column options and index in the argument list.
     *
     * @function addColumn
     * @param {ColumnsModel} columnOptions Accepts the properties to new column that are going to be added in the board.
     * @param {number} index Accepts the index of column to add the new column.
     * @returns {void}
     */
    public addColumn(columnOptions: ColumnsModel, index: number): void {
        this.actionModule.addColumn(columnOptions, index);
    }

    /**
     * Deletes the column based on the provided index value.
     *
     * @function deleteColumn
     * @param {number} index Accepts the index of column to delete the existing column from Kanban board.
     * @returns {void}
     */
    public deleteColumn(index: number): void {
        this.actionModule.deleteColumn(index);
    }

    /**
     * Shows the column from hidden based on the provided key in the columns.
     *
     * @function showColumn
     * @param {string | number} key Accepts the hidden column key name to be shown from the hidden state in board.
     * @returns {void}
     */
    public showColumn(key: string | number): void {
        this.actionModule.showColumn(key);
    }

    /**
     * Hides the column from Kanban board based on the provided key in the columns.
     *
     * @function hideColumn
     * @param {string | number} key Accepts the visible column key name to be hidden from the board.
     * @returns {void}
     */
    public hideColumn(key: string | number): void {
        this.actionModule.hideColumn(key);
    }

    /**
     * Method to refresh the Kanban UI based on modified records.
     *
     * @function refreshUI
     * @param {ActionEventArgs} args Accepts the added, changed or deleted data.
     * @param {number} index Accepts the index of the changed items.
     * @returns {void}
     */
    public refreshUI(args: ActionEventArgs, index?: number): void {
        index = index ? index : 0;
        this.dataModule.refreshUI(args, index);
    }

    /**
     * Method to refresh the column header.
     *
     * @method refreshHeader
     * @returns {void}
     */
    public refreshHeader(): void {
        this.resetTemplates(['columnTemplate']);
        if (this.layoutModule) {
            this.layoutModule.refreshHeaders();
        }
        this.renderTemplates();
    }

    /**
     * Removes the control from the DOM and detaches all its related event handlers. Also, it removes the attributes and classes.
     *
     * @function destroy
     * @returns {void}
     */
    public destroy(): void {
        this.destroyModules();
        [].slice.call(this.element.childNodes).forEach((node: HTMLElement) => { detach(node); });
        let removeClasses: string[] = [cls.ROOT_CLASS];
        if (this.cssClass) {
            removeClasses = removeClasses.concat(this.cssClass.split(' '));
        }
        removeClass([this.element], removeClasses);
        super.destroy();
    }
}

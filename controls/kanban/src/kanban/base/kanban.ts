import { Component, ModuleDeclaration, NotifyPropertyChanges, Property, Complex, Collection, detach } from '@syncfusion/ej2-base';
import { addClass, classList, removeClass, compile, formatUnit, L10n, Browser, Event, EmitType } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { createSpinner, hideSpinner, showSpinner } from '@syncfusion/ej2-popups';
import { Data } from './data';
import { KanbanModel } from './kanban-model';
import { SwimlaneSettings } from '../models/swimlane-settings';
import { CardSettings } from '../models/card-settings';
import { Columns } from '../models/columns';
import { StackedHeaders } from '../models/stacked-headers';
import { CardSettingsModel, ColumnsModel, SwimlaneSettingsModel, StackedHeadersModel } from '../models/index';
import { ActionEventArgs, CardClickEventArgs, CardRenderedEventArgs, DragEventArgs, ColumnRenderedEventArgs } from './interface';
import { ReturnType, ConstraintType } from './type';
import { Action } from '../actions/action';
import { Crud } from '../actions/crud';
import { DragAndDrop } from '../actions/drag';
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
    public isAdaptive: Boolean;
    public crudModule: Crud;
    public dataModule: Data;
    public layoutModule: LayoutRender;
    public actionModule: Action;
    public dragAndDropModule: DragAndDrop;
    public keyboardModule: Keyboard;
    public tooltipModule: KanbanTooltip;
    public touchModule: KanbanTouch;
    public kanbanData: Object[];
    public activeCardData: CardClickEventArgs;
    public localeObj: L10n;
    public swimlaneToggleArray: string[];

    // Kanban Options

    /**
     * It is used to customize the Kanban, which accepts custom CSS class names that defines specific user-defined
     *  styles and themes to be applied on the Kanban element.
     * @default null
     */
    @Property()
    public cssClass: string;

    /**
     * Sets the `width` of the Kanban component, accepting both string and number values.
     * The string value can be either pixel or percentage format.
     * When set to `auto`, the Kanban width gets auto-adjusted and display its content related to the viewable screen size.
     * @default 'auto'
     */
    @Property('auto')
    public width: string | number;

    /**
     * Sets the `height` of the Kanban component, accepting both string and number values.
     * The string type includes either pixel or percentage values.
     * When `height` is set with specific pixel value, then the Kanban will be rendered to that specified space.
     * In case, if `auto` value is set, then the height of the Kanban gets auto-adjusted within the given container.
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
     * @default []
     */
    @Property([])
    public dataSource: Object[] | DataManager;

    /**
     * Defines the external [`query`](http://ej2.syncfusion.com/documentation/data/api-query.html)
     * that will be executed along with the data processing.
     * @default null
     */
    @Property()
    public query: Query;

    /**
     * Defines the key field of Kanban board. The Kanban renders its layout based on this key field.
     * @default null
     */
    @Property()
    public keyField: string;

    /**
     * Defines the constraint type used to apply validation based on column or swimlane.
     * @default column
     */
    @Property('Column')
    public constraintType: ConstraintType;

    /**
     * Defines the Kanban board columns and their properties such as header text, key field, template, allow toggle,
     * expand or collapse state, min or max count, and show or hide item count.
     * @default []
     */
    @Collection<ColumnsModel>([], Columns)
    public columns: ColumnsModel[];

    /**
     * When this property is set to true, it allows the keyboard interaction in Kanban.
     * @default true
     */
    @Property(true)
    public allowKeyboard: boolean;

    /**
     * Defines the stacked header for Kanban columns with text and key fields.
     * @default []
     */
    @Collection<StackedHeadersModel>([], StackedHeaders)
    public stackedHeaders: StackedHeadersModel[];

    /**
     * Defines the swimlane settings to Kanban board such as key field, text field, template, allow drag-and-drop, 
     * show or hide empty row, show or hide items count, and more.
     * @default {}
     */
    @Complex<SwimlaneSettingsModel>({}, SwimlaneSettings)
    public swimlaneSettings: SwimlaneSettingsModel;

    /**
     * Defines the Kanban board related settings such as header field, content field, template, 
     * show or hide header, and single or multiple selection.
     * @default {}
     */
    @Complex<CardSettingsModel>({}, CardSettings)
    public cardSettings: CardSettingsModel;

    /**
     * Enables or disables the drag and drop actions in Kanban.
     * @default true
     */
    @Property(true)
    public allowDragAndDrop: boolean;

    /**
     * Enables or disables the tooltip in Kanban board. The property relates to the tooltipTemplate property.
     * @default false
     */
    @Property(false)
    public enableTooltip: boolean;

    /**
     * Defines the template content to card’s tooltip. The property works by enabling the ‘enableTooltip’ property.
     * @default null
     */
    @Property()
    public tooltipTemplate: string;

    /**
     * Triggers on beginning of every Kanban action.
     * @event
     */
    @Event()
    public actionBegin: EmitType<ActionEventArgs>;
    /**
     * Triggers on successful completion of the Kanban actions.
     * @event
     */
    @Event()
    public actionComplete: EmitType<ActionEventArgs>;
    /**
     * Triggers when a Kanban action gets failed or interrupted and an error information will be returned.
     * @event
     */
    @Event()
    public actionFailure: EmitType<ActionEventArgs>;
    /**
     * Triggers after the kanban component is created.
     * @event
     */
    @Event()
    public created: EmitType<Object>;
    /**
     * Triggers before the data binds to the Kanban.
     * @event
     */
    @Event()
    public dataBinding: EmitType<ReturnType>;
    /**
     * Triggers once the event data is bound to the Kanban.
     * @event
     */
    @Event()
    public dataBound: EmitType<ReturnType>;
    /**
     * Triggers on single-clicking the Kanban cards.
     * @event
     */
    @Event()
    public cardClick: EmitType<CardClickEventArgs>;
    /**
     * Triggers on double-clicking the Kanban cards.
     * @event
     */
    @Event()
    public cardDoubleClick: EmitType<CardClickEventArgs>;
    /**
     * Triggers before each column of the Kanban rendering on the page.
     * @event
     */
    @Event()
    public columnRendered: EmitType<ColumnRenderedEventArgs>;
    /**
     * Triggers before each card of the Kanban rendering on the page.
     * @event
     */
    @Event()
    public cardRendered: EmitType<CardRenderedEventArgs>;
    /**
     * Triggers when the card drag actions starts.
     * @event
     */
    @Event()
    public dragStart: EmitType<DragEventArgs>;
    /**
     * Triggers when the card is dragging to other stage or other swimlane.
     * @event
     */
    @Event()
    public drag: EmitType<DragEventArgs>;
    /**
     * Triggers when the card drag actions stops.
     * @event
     */
    @Event()
    public dragStop: EmitType<DragEventArgs>;

    /**
     * Constructor for creating the Kanban widget
     * @hidden
     */
    constructor(options?: KanbanModel, element?: string | HTMLElement) {
        super(options, element);
    }

    /**
     * Initializes the values of private members.
     * @private
     */
    protected preRender(): void {
        this.isAdaptive = Browser.isDevice;
        this.kanbanData = [];
        if (!this.enablePersistence || !this.swimlaneToggleArray) {
            this.swimlaneToggleArray = [];
        }
        this.activeCardData = { data: null, element: null };
        let defaultLocale: Object = {
            items: 'items',
            min: 'Min',
            max: 'Max',
            cardsSelected: 'Cards Selected'
        };
        this.localeObj = new L10n(this.getModuleName(), defaultLocale, this.locale);
    }

    /**
     * To provide the array of modules needed for control rendering
     * @return {ModuleDeclaration[]}
     * @hidden
     */
    public requiredModules(): ModuleDeclaration[] {
        let modules: ModuleDeclaration[] = [];
        return modules;
    }

    /**
     * Returns the properties to be maintained in the persisted state.
     * @private
     */
    protected getPersistData(): string {
        return this.addOnPersist(['columns', 'dataSource', 'swimlaneToggleArray']);
    }

    /**
     * Core method to return the component name.
     * @private
     */
    public getModuleName(): string {
        return 'kanban';
    }

    /**
     * Core method that initializes the control rendering.
     * @private
     */
    public render(): void {
        let addClasses: string[] = [cls.ROOT_CLASS];
        let removeClasses: string[] = [];
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
        classList(this.element, addClasses, removeClasses);
        this.element.style.width = formatUnit(this.width);
        this.element.style.height = formatUnit(this.height);
        createSpinner({ target: this.element });
        this.showSpinner();
        this.initializeModules();
    }

    /**
     * Called internally, if any of the property value changed.
     * @private
     */
    public onPropertyChanged(newProp: KanbanModel, oldProp: KanbanModel): void {
        for (let prop of Object.keys(newProp)) {
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
                default:
                    break;
            }
        }
    }

    private onSwimlaneSettingsPropertyChanged(newProp: SwimlaneSettingsModel, oldProp: SwimlaneSettingsModel): void {
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'keyField':
                case 'textField':
                case 'showEmptyRow':
                case 'showItemCount':
                case 'template':
                case 'sortBy':
                    this.notify(events.dataReady, { processedData: this.kanbanData });
                    break;
            }
        }
    }

    private onCardSettingsPropertyChanged(newProp: CardSettingsModel, oldProp: CardSettingsModel): void {
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'showHeader':
                case 'headerField':
                case 'contentField':
                case 'template':
                    this.layoutModule.refreshCards();
                    break;
                case 'selectionType':
                    let cards: HTMLElement[] = this.getSelectedCards();
                    if (cards.length > 0) {
                        removeClass(cards, cls.CARD_SELECTION_CLASS);
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
        if (this.enableTooltip) {
            this.tooltipModule = new KanbanTooltip(this);
        }
        if (Browser.isDevice || Browser.isTouch) {
            this.touchModule = new KanbanTouch(this);
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
        this.actionModule = null;
        this.crudModule = null;
        this.dataModule = null;
        this.dragAndDropModule = null;
    }

    /** @private */
    public templateParser(template: string): Function {
        if (template) {
            try {
                if (document.querySelectorAll(template).length) {
                    return compile(document.querySelector(template).innerHTML.trim());
                }
            } catch (error) {
                return compile(template);
            }
        }
        return undefined;
    }

    /**
     * Returns the card details based on card ID from the board.
     * @method getCardDetails
     * @param {Element} target Accepts the card element to get the details.
     * @returns {{[key: string]: Object}}
     */
    public getCardDetails(target: Element): { [key: string]: Object } {
        let isNumeric: boolean = typeof (this.kanbanData[0] as { [key: string]: Object })[this.cardSettings.headerField] === 'number';
        let targetId: string | number = isNumeric ? parseInt(target.getAttribute('data-id'), 10) : target.getAttribute('data-id');
        let cardObj: { [key: string]: Object } = this.kanbanData.filter((data: { [key: string]: Object }) =>
            data[this.cardSettings.headerField] === targetId)[0] as { [key: string]: Object };
        return cardObj;
    }

    /**
     * Returns the column data based on column key input.
     * @method getColumnData
     * @param {string} columnKey Accepts the column key to get the objects.
     * @returns {Object[]}
     */
    public getColumnData(columnKey: string, dataSource?: Object[]): Object[] {
        return this.layoutModule.getColumnCards(dataSource)[columnKey] || [];
    }

    /**
     * Returns the swimlane column data based on swimlane keyField input.
     * @method getSwimlaneData
     * @param {string} keyField Accepts the swimlane keyField to get the objects.
     * @returns {Object[]}
     */
    public getSwimlaneData(keyField: string): Object[] {
        return this.layoutModule.getSwimlaneCards()[keyField] || [];
    }

    /**
     * Gets the list of selected cards from the board.
     * @method getSelectedCards
     * @returns {HTMLElement[]}
     */
    public getSelectedCards(): HTMLElement[] {
        return [].slice.call(this.element.querySelectorAll('.' + cls.CARD_CLASS + '.' + cls.CARD_SELECTION_CLASS));
    }

    /**
     * Allows you to show the spinner on Kanban at the required scenarios.
     * @method showSpinner
     * @returns {void}
     */
    public showSpinner(): void {
        showSpinner(this.element);
    }

    /**
     * When the spinner is shown manually using the showSpinner method, it can be hidden using this `hideSpinner` method.
     * @method hideSpinner
     * @returns {void}
     */
    public hideSpinner(): void {
        hideSpinner(this.element);
    }

    /**
     * Adds the new card to the data source of Kanban and layout.
     * @method addCard
     * @param {{[key: string]: Object}} cardData Single card objects to be added into Kanban.
     * @param {{[key: string]: Object}[]} cardData Collection of card objects to be added into Kanban.
     * @returns {void}
     */
    public addCard(cardData: { [key: string]: Object } | { [key: string]: Object }[]): void {
        this.crudModule.addCard(cardData);
    }

    /**
     * Updates the changes made in the card object by passing it as a parameter to the data source.
     * @method updateCard
     * @param {{[key: string]: Object}} cardData Single card object to be updated into Kanban.
     * @param {{[key: string]: Object}[]} cardData Collection of card objects to be updated into Kanban.
     * @returns {void}
     */
    public updateCard(cardData: { [key: string]: Object } | { [key: string]: Object }[]): void {
        this.crudModule.updateCard(cardData);
    }

    /**
     * Deletes the card based on the provided ID or card collection in the argument list.
     * @method deleteCard
     * @param {{[key: string]: Object}} id Single card to be removed from the Kanban.
     * @param {{[key: string]: Object }[]} id Collection of cards to be removed from the Kanban.
     * @param {number} id Accepts the ID of the card in integer type which needs to be removed from the Kanban.
     * @param {string} id Accepts the ID of the card in string type which needs to be removed from the Kanban.
     * @returns {void}
     */
    public deleteCard(cardData: string | number | { [key: string]: Object } | { [key: string]: Object }[]): void {
        this.crudModule.deleteCard(cardData);
    }

    /**
     * Add the column to Kanban board dynamically based on the provided column options and index in the argument list.
     * @method addColumn
     * @param {ColumnsModel} columnOptions Defines the properties to new column that are going to be added in the board.
     * @param {number} index Defines the index of column to add the new column.
     * @returns {void}
     */
    public addColumn(columnOptions: ColumnsModel, index: number): void {
        this.actionModule.addColumn(columnOptions, index);
    }

    /**
     * Deletes the column based on the provided index value.
     * @method deleteColumn
     * @param {number} index Defines the index of column to delete the existing column from Kanban board.
     * @returns {void}
     */
    public deleteColumn(index: number): void {
        this.actionModule.deleteColumn(index);
    }

    /**
     * Shows the column from hidden based on the provided key in the columns.
     * @method showColumn
     * @param {string} key Accepts the hidden column key name to be shown from the hidden state in board.
     * @returns {void}
     */
    public showColumn(key: string): void {
        this.actionModule.showColumn(key);
    }

    /**
     * Hides the column from Kanban board based on the provided key in the columns.
     * @method hideColumn
     * @param {string} key Accepts the visible column key name to be hidden from the board.
     * @returns {void}
     */
    public hideColumn(key: string): void {
        this.actionModule.hideColumn(key);
    }

    /**
     * Removes the control from the DOM and detaches all its related event handlers. Also, it removes the attributes and classes.
     * @method destroy
     * @return {void}
     */
    public destroy(): void {
        this.destroyModules();
        [].slice.call(this.element.childNodes).forEach((node: HTMLElement) => detach(node));
        let removeClasses: string[] = [cls.ROOT_CLASS];
        if (this.cssClass) {
            removeClasses = removeClasses.concat(this.cssClass.split(' '));
        }
        removeClass([this.element], removeClasses);
        super.destroy();
    }

}

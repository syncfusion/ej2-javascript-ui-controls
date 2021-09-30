import { Component, ModuleDeclaration, NotifyPropertyChanges, Property, Complex, Collection, detach, remove } from '@syncfusion/ej2-base';import { addClass, classList, removeClass, compile, formatUnit, L10n, Browser, Event, EmitType } from '@syncfusion/ej2-base';import { DataManager, Query } from '@syncfusion/ej2-data';import { createSpinner, hideSpinner, showSpinner } from '@syncfusion/ej2-popups';import { Data } from './data';import { SwimlaneSettings } from '../models/swimlane-settings';import { CardSettings } from '../models/card-settings';import { DialogSettings } from '../models/dialog-settings';import { Columns } from '../models/columns';import { StackedHeaders } from '../models/stacked-headers';import { SortSettings } from '../models/sort-settings';import { CardSettingsModel, ColumnsModel, SwimlaneSettingsModel, StackedHeadersModel, DialogSettingsModel } from '../models/index';import { SortSettingsModel } from '../models/index';import { ActionEventArgs, CardClickEventArgs, CardRenderedEventArgs, DragEventArgs, ScrollPosition } from './interface';import { QueryCellInfoEventArgs, DialogEventArgs, DataStateChangeEventArgs, DataSourceChangedEventArgs } from './interface';import { ReturnType, ConstraintType, CurrentAction } from './type';import { Action } from '../actions/action';import { Crud } from '../actions/crud';import { DragAndDrop } from '../actions/drag';import { KanbanDialog } from '../actions/dialog';import { Keyboard } from '../actions/keyboard';import { KanbanTooltip } from '../actions/tooltip';import { KanbanTouch } from '../actions/touch';import { LayoutRender } from './layout-render';import * as events from '../base/constant';import * as cls from './css-constant';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class Kanban
 */
export interface KanbanModel extends ComponentModel{

    /**
     * It is used to customize the Kanban, which accepts custom CSS class names that defines specific user-defined
     * styles and themes to be applied on the Kanban element.
     *
     * @default null
     */
    cssClass?: string;

    /**
     * Sets the `width` of the Kanban component, accepting both string and number values.
     * The string value can be either pixel or percentage format.
     * When set to `auto`, the Kanban width gets auto-adjusted and display its content related to the viewable screen size.
     *
     * @default 'auto'
     */
    width?: string | number;

    /**
     * Sets the `height` of the Kanban component, accepting both string and number values.
     * The string type includes either pixel or percentage values.
     * When `height` is set with specific pixel value, then the Kanban will be rendered to that specified space.
     * In case, if `auto` value is set, then the height of the Kanban gets auto-adjusted within the given container.
     *
     * @default 'auto'
     */
    height?: string | number;

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
    dataSource?: Record<string, any>[] | DataManager;

    /**
     * Defines the external [`query`](http://ej2.syncfusion.com/documentation/data/api-query.html)
     * that will be executed along with the data processing.
     *
     * @default null
     */
    query?: Query;

    /**
     * Defines the key field of Kanban board. The Kanban renders its layout based on this key field.
     *
     * @default null
     */
    keyField?: string;

    /**
     * Defines the constraint type used to apply validation based on column or swimlane. The possible values are:
     * * Column
     * * Swimlane
     *
     * @default column
     */
    constraintType?: ConstraintType;

    /**
     * Defines the ID of drop component on which drop should occur.
     *
     * @default []
     */
    externalDropId?: string[];

    /**
     * Defines the Kanban board columns and their properties such as header text, key field, template, allow toggle,
     * expand or collapse state, min or max count, and show or hide item count.
     *
     * @default []
     */
    columns?: ColumnsModel[];

    /**
     * When this property is set to true, it allows the keyboard interaction in Kanban.
     *
     * @default true
     */
    allowKeyboard?: boolean;

    /**
     * Defines the stacked header for Kanban columns with text and key fields.
     *
     * @default []
     */
    stackedHeaders?: StackedHeadersModel[];

    /**
     * Defines the swimlane settings to Kanban board such as key field, text field, template, allow drag-and-drop,
     * show or hide empty row, show or hide items count, and more.
     *
     * @default {}
     */
    swimlaneSettings?: SwimlaneSettingsModel;

    /**
     * Defines the Kanban board related settings such as header field, content field, template,
     * show or hide header, and single or multiple selection.
     *
     * @default {}
     */
    cardSettings?: CardSettingsModel;

    /**
     * Defines the sort settings such as field and direction.
     *
     * @default {}
     */
    sortSettings?: SortSettingsModel;

    /**
     * Defines the dialog settings such as template and fields.
     *
     * @default {}
     */
    dialogSettings?: DialogSettingsModel;

    /**
     * Enables or disables the drag and drop actions in Kanban.
     *
     * @default true
     */
    allowDragAndDrop?: boolean;

    /**
     * Enables or disables the tooltip in Kanban board. The property relates to the tooltipTemplate property.
     *
     * @default false
     */
    enableTooltip?: boolean;

    /**
     * Enable or disable the columns when empty dataSource.
     *
     * @default false
     */
    showEmptyColumn?: boolean;

    /**
     * Enables or disables the persisting component's state between page reloads.
     * If enabled, columns, dataSource properties will be persisted in kanban.
     *
     * @default false
     */
    enablePersistence?: boolean;

    /**
     * Defines the template content to card’s tooltip. The property works by enabling the ‘enableTooltip’ property.
     *
     * @default null
     */
    tooltipTemplate?: string;

    /**
     * Triggers on beginning of every Kanban action.
     *
     * @event 'actionBegin'
     */
    actionBegin?: EmitType<ActionEventArgs>;

    /**
     * Triggers on successful completion of the Kanban actions.
     *
     * @event 'actionComplete'
     */
    actionComplete?: EmitType<ActionEventArgs>;

    /**
     * Triggers when a Kanban action gets failed or interrupted and an error information will be returned.
     *
     * @event 'actionFailure'
     */
    actionFailure?: EmitType<ActionEventArgs>;

    /**
     * Triggers after the kanban component is created.
     *
     * @event 'created'
     */
    created?: EmitType<Record<string, any>>;

    /**
     * Triggers before the data binds to the Kanban.
     *
     * @event 'dataBinding'
     */
    dataBinding?: EmitType<ReturnType>;

    /**
     * Triggers once the event data is bound to the Kanban.
     *
     * @event 'dataBound'
     */
    dataBound?: EmitType<ReturnType>;

    /**
     * Triggers on single-clicking the Kanban cards.
     *
     * @event 'cardClick'
     */
    cardClick?: EmitType<CardClickEventArgs>;

    /**
     * Triggers on double-clicking the Kanban cards.
     *
     * @event 'cardDoubleClick'
     */
    cardDoubleClick?: EmitType<CardClickEventArgs>;

    /**
     * Triggers before each column of the Kanban rendering on the page.
     *
     * @event 'queryCellInfo'
     */
    queryCellInfo?: EmitType<QueryCellInfoEventArgs>;

    /**
     * Triggers before each card of the Kanban rendering on the page.
     *
     * @event 'cardRendered'
     */
    cardRendered?: EmitType<CardRenderedEventArgs>;

    /**
     * Triggers when the card drag actions starts.
     *
     * @event 'dragStart'
     */
    dragStart?: EmitType<DragEventArgs>;

    /**
     * Triggers when the card is dragging to other stage or other swimlane.
     *
     * @event 'drag'
     */
    drag?: EmitType<DragEventArgs>;

    /**
     * Triggers when the card drag actions stops.
     *
     * @event 'dragStop'
     */
    dragStop?: EmitType<DragEventArgs>;

    /**
     * Triggers before the dialog opens.
     *
     * @event 'dialogOpen'
     */
    dialogOpen?: EmitType<DialogEventArgs>;

    /**
     * Triggers before the dialog closes.
     *
     * @event 'dialogClose'
     */
    dialogClose?: EmitType<DialogEventArgs>;

    /**
     * Triggers when the grid actions such as Sorting, Paging, Grouping etc., are done.
     * In this event,the current view data and total record count should be assigned to the `dataSource` based on the action performed.
     *
     * @event dataStateChange
     */
    dataStateChange?: EmitType<DataStateChangeEventArgs>;

    /**
      * Triggers when the grid data is added, deleted and updated.
      * Invoke the done method from the argument to start render after edit operation.
      *
      * @event dataSourceChanged
      */
    dataSourceChanged?: EmitType<DataSourceChangedEventArgs>;

}
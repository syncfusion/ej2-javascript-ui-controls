import { Component, ModuleDeclaration, NotifyPropertyChanges, Property, Complex, Collection } from '@syncfusion/ej2-base';import { addClass, classList, removeClass, compile, formatUnit, L10n, Browser, Event, EmitType } from '@syncfusion/ej2-base';import { DataManager, Query } from '@syncfusion/ej2-data';import { createSpinner, hideSpinner, showSpinner } from '@syncfusion/ej2-popups';import { Data } from './data';import { SwimlaneSettings } from '../models/swimlane-settings';import { CardSettings } from '../models/card-settings';import { Columns } from '../models/columns';import { StackedHeaders } from '../models/stacked-headers';import { CardSettingsModel, ColumnsModel, SwimlaneSettingsModel, StackedHeadersModel } from '../models/index';import { ActionEventArgs, CardClickEventArgs, CardRenderedEventArgs, DragEventArgs } from './interface';import { ReturnType, ConstraintType } from './type';import { Action } from '../actions/action';import { Crud } from '../actions/crud';import { DragAndDrop } from '../actions/drag';import { Keyboard } from '../actions/keyboard';import { KanbanTooltip } from '../actions/tooltip';import { KanbanTouch } from '../actions/touch';import { LayoutRender } from './layout-render';import * as events from '../base/constant';import * as cls from './css-constant';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class Kanban
 */
export interface KanbanModel extends ComponentModel{

    /**
     * It is used to customize the Kanban, which accepts custom CSS class names that defines specific user-defined
     *  styles and themes to be applied on the Kanban element.
     * @default null
     */
    cssClass?: string;

    /**
     * Sets the `width` of the Kanban component, accepting both string and number values.
     * The string value can be either pixel or percentage format.
     * When set to `auto`, the Kanban width gets auto-adjusted and display its content related to the viewable screen size.
     * @default 'auto'
     */
    width?: string | number;

    /**
     * Sets the `height` of the Kanban component, accepting both string and number values.
     * The string type includes either pixel or percentage values.
     * When `height` is set with specific pixel value, then the Kanban will be rendered to that specified space.
     * In case, if `auto` value is set, then the height of the Kanban gets auto-adjusted within the given container.
     * @default 'auto'
     */
    height?: string | number;

    /**
     * With this property, the event data will be bound to Kanban.
     * The event data can be passed either as an array of JavaScript objects,
     * or else can create an instance of [`DataManager`](http://ej2.syncfusion.com/documentation/data/api-dataManager.html)
     * in case of processing remote data and can be assigned to the `dataSource` property.
     * With the remote data assigned to dataSource, check the available
     *  [adaptors](http://ej2.syncfusion.com/documentation/data/adaptors.html) to customize the data processing.
     * @default []
     */
    dataSource?: Object[] | DataManager;

    /**
     * Defines the external [`query`](http://ej2.syncfusion.com/documentation/data/api-query.html)
     * that will be executed along with the data processing.
     * @default null
     */
    query?: Query;

    /**
     * Defines the key field of Kanban board. The Kanban renders its layout based on this key field.
     * @default null
     */
    keyField?: string;

    /**
     * Defines the constraint type used to apply validation based on column or swimlane.
     * @default column
     */
    constraintType?: ConstraintType;

    /**
     * Defines the Kanban board columns and their properties such as header text, key field, template, allow toggle,
     * expand or collapse state, min or max count, and show or hide item count.
     * @default []
     */
    columns?: ColumnsModel[];

    /**
     * When this property is set to true, it allows the keyboard interaction in Kanban.
     * @default true
     */
    allowKeyboard?: boolean;

    /**
     * Defines the stacked header for Kanban columns with text and key fields.
     * @default []
     */
    stackedHeaders?: StackedHeadersModel[];

    /**
     * Defines the swimlane settings to Kanban board such as key field, text field, template, allow drag-and-drop, 
     * show or hide empty row, show or hide items count, and more.
     * @default {}
     */
    swimlaneSettings?: SwimlaneSettingsModel;

    /**
     * Defines the Kanban board related settings such as header field, content field, template, 
     * show or hide header, and single or multiple selection.
     * @default {}
     */
    cardSettings?: CardSettingsModel;

    /**
     * Enables or disables the drag and drop actions in Kanban.
     * @default true
     */
    allowDragAndDrop?: boolean;

    /**
     * Enables or disables the tooltip in Kanban board. The property relates to the tooltipTemplate property.
     * @default false
     */
    enableTooltip?: boolean;

    /**
     * Defines the template content to card’s tooltip. The property works by enabling the ‘enableTooltip’ property.
     * @default null
     */
    tooltipTemplate?: string;

    /**
     * Triggers on beginning of every Kanban action.
     * @event
     */
    actionBegin?: EmitType<ActionEventArgs>;

    /**
     * Triggers on successful completion of the Kanban actions.
     * @event
     */
    actionComplete?: EmitType<ActionEventArgs>;

    /**
     * Triggers when a Kanban action gets failed or interrupted and an error information will be returned.
     * @event
     */
    actionFailure?: EmitType<ActionEventArgs>;

    /**
     * Triggers after the kanban component is created.
     * @event
     */
    created?: EmitType<Object>;

    /**
     * Triggers before the data binds to the Kanban.
     * @event
     */
    dataBinding?: EmitType<ReturnType>;

    /**
     * Triggers once the event data is bound to the Kanban.
     * @event
     */
    dataBound?: EmitType<ReturnType>;

    /**
     * Triggers on single-clicking the Kanban cards.
     * @event
     */
    cardClick?: EmitType<CardClickEventArgs>;

    /**
     * Triggers on double-clicking the Kanban cards.
     * @event
     */
    cardDoubleClick?: EmitType<CardClickEventArgs>;

    /**
     * Triggers before each column of the Kanban rendering on the page.
     * @event
     */
    columnRendered?: EmitType<CardRenderedEventArgs>;

    /**
     * Triggers before each card of the Kanban rendering on the page.
     * @event
     */
    cardRendered?: EmitType<CardRenderedEventArgs>;

    /**
     * Triggers when the card drag actions starts.
     * @event
     */
    dragStart?: EmitType<DragEventArgs>;

    /**
     * Triggers when the card is dragging to other stage or other swimlane.
     * @event
     */
    drag?: EmitType<DragEventArgs>;

    /**
     * Triggers when the card drag actions stops.
     * @event
     */
    dragStop?: EmitType<DragEventArgs>;

}
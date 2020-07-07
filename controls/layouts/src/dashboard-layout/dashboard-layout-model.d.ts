import { Component, Property, NotifyPropertyChanges, INotifyPropertyChanged, isUndefined, BlazorDragEventArgs } from '@syncfusion/ej2-base';import { Collection, Draggable, isNullOrUndefined, DragEventArgs, append, updateBlazorTemplate, setValue } from '@syncfusion/ej2-base';import { EmitType, Event, formatUnit, ChildProperty, compile, closest, isBlazor, SanitizeHtmlHelper, getValue } from '@syncfusion/ej2-base';import { setStyleAttribute as setStyle, addClass, detach, removeClass, EventHandler, Browser, extend } from '@syncfusion/ej2-base';
import {ChangeEventArgs,DragStartArgs,DraggedEventArgs,DragStopArgs,ResizeArgs} from "./dashboard-layout";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class Panel
 */
export interface PanelModel {

    /**
     * Defines the id of the panel.
     * @default ''
     */
    id?: string;

    /**
     * Defines the CSS class name that can be appended with each panel element.
     * @default ''
     */
    cssClass?: string;

    /**
     * Defines the template value that should be displayed as the panel's header.
     * @blazorType RenderFragment
     */
    header?: string | HTMLElement;

    /**
     * Defines the template value that should be displayed as the panel's content. 
     * @blazorType RenderFragment
     */
    content?: string | HTMLElement;

    /**
     * Defines whether to the panel should be enabled or not.
     * @default true
     */
    enabled?: boolean;

    /**
     * Defines a row value where the panel should be placed.
     * @default 0
     * @aspType int
     * @blazorType int
     */
    row?: number;

    /**
     * Defines the column value where the panel to be placed.
     * @default 0
     * @aspType int
     * @blazorType int
     */
    col?: number;

    /**
     * Specifies the width of the panel in the layout in cells count.
     *
     * @default 1
     * @blazorType int
     */
    sizeX?: number;

    /**
     * Specifies the height of the panel in the layout in cells count.
     *
     * @default 1
     * @blazorType int
     */
    sizeY?: number;

    /**
     * Specifies the minimum height of the panel in cells count.
     * 
     * @default 1
     * @blazorType int
     */
    minSizeY?: number;

    /**
     * Specifies the minimum width of the panel in cells count.
     * *
     * @default 1
     * @blazorType int
     */
    minSizeX?: number;

    /**
     * Specifies the maximum height of the panel in cells count.
     * *
     * @default null
     * @aspType int
     * @blazorType int?
     *
     */
    maxSizeY?: number;

    /**
     * Specifies the maximum width of the panel in cells count.
     * *
     * @default null
     * @aspType int
     * @blazorType int?
     */
    maxSizeX?: number;

    /**
     * Specifies the z-index of the panel
     * *
     * @default 1000
     * @aspType double
     * @blazorType double
     */
    zIndex?: number;

}

/**
 * Interface for a class DashboardLayout
 */
export interface DashboardLayoutModel extends ComponentModel{

    /**
     * If allowDragging is set to true, then the DashboardLayout allows you to drag and reorder the panels.
     * *
     * @default true
     */
    allowDragging?: boolean;

    /**
     * If allowResizing is set to true, then the DashboardLayout allows you to resize the panels.
     * @default false
     */
    allowResizing?: boolean;

    /**
     * If pushing is set to true, then the DashboardLayout allow to push the panels when panels collide
     * while dragging or resizing the panels.
     * *
     * @default true
     * @private
     */
    allowPushing?: boolean;

    /**
     * Defines whether to allow the cross-scripting site or not.
     * @default true
     */
    enableHtmlSanitizer?: boolean;

    /**
     * If allowFloating is set to true, then the DashboardLayout automatically move the panels upwards to fill the empty available 
     * cells while dragging or resizing the panels.
     * *
     * @default true
     */
    allowFloating?: boolean;

    /**
     * Defines the cell aspect ratio of the panel. 
     * @default 1
     */
    cellAspectRatio?: number;

    /**
     * Defines the spacing between the panels.
     * *
     * @default [5,5]
     */
    cellSpacing?: number[];

    /**
     * Defines the number of columns to be created in the DashboardLayout. 
     * @default 1
     * @blazorType int
     */
    columns?: number;

    /**
     * Enables or disables the grid lines for the Dashboard Layout panels.
     * *
     * @default false
     */
    showGridLines?: boolean;

    /**
     * Defines the draggable handle selector which will act as dragging handler for the panels.
     * *
     * @default null
     */
    draggableHandle?: string;

    /**
     * Locale property.
     * This is not a dashboard layout property.
     * @default 'en-US'
     * @private
     */
    locale?: string;

    /**
     * Defines the media query value where the dashboardlayout becomes stacked layout when the resolution meets.
     * @default 'max-width:600px'
     */
    mediaQuery?: string;

    /**
     *
     * Defines the panels property of the DashboardLayout component.
     *
     * @default null
     */
    panels?: PanelModel[];

    /**
     * Defines the resizing handles directions used for resizing the panels.
     * @default 'e-south-east'
     * 
     */
    resizableHandles?: string[];

    /**
     * Triggers whenever the panels positions are changed.
     * @event
     * @blazorProperty 'Changed'
     */
    change?: EmitType<ChangeEventArgs>;

    /**
     * Triggers when a panel is about to drag.
     * @event
     * @blazorProperty 'OnDragStart'
     */
    dragStart?: EmitType<DragStartArgs>;

    /**
     * Triggers while a panel is dragged continuously.
     * @event
     * @blazorProperty 'Dragging'
     */
    drag?: EmitType<DraggedEventArgs>;

    /**
     * Triggers when a dragged panel is dropped.
     * @event
     * @blazorProperty 'OnDragStop'
     */
    dragStop?: EmitType<DragStopArgs>;

    /**
     * Triggers when a panel is about to resize.
     * @event
     * @blazorProperty 'OnResizeStart'
     */
    resizeStart?: EmitType<ResizeArgs>;

    /**
     * Triggers when a panel is being resized continuously.
     * @event
     * @blazorProperty 'Resizing'
     */
    resize?: EmitType<ResizeArgs>;

    /**
     * Triggers when a panel resize ends.
     * @event
     * @blazorProperty 'OnResizeStop'
     */
    resizeStop?: EmitType<ResizeArgs>;

    /**
     * Triggers when Dashboard Layout is created.
     * @event 
     * @blazorproperty 'Created'
     */
    created?: EmitType<Object>;

    /**
     * Triggers when Dashboard Layout is destroyed.
     * @event 
     * @blazorproperty 'Destroyed'
     */
    destroyed?: EmitType<Object>;

}
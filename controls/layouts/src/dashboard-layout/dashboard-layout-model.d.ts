import { Component, Property, NotifyPropertyChanges, INotifyPropertyChanged, isUndefined, BlazorDragEventArgs } from '@syncfusion/ej2-base';import { Collection, Draggable, isNullOrUndefined, DragEventArgs, append, updateBlazorTemplate } from '@syncfusion/ej2-base';import { EmitType, Event, formatUnit, ChildProperty, compile, closest, isBlazor } from '@syncfusion/ej2-base';import { setStyleAttribute as setStyle, addClass, detach, removeClass, EventHandler, Browser } from '@syncfusion/ej2-base';
import {ChangeEventArgs,DragStartArgs,DraggedEventArgs,DragStopArgs,ResizeArgs} from "./dashboard-layout";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class Panel
 */
export interface PanelModel {

    /**
     * Defines the id of the panel.

     */
    id?: string;

    /**
     * Defines the CSS class name that can be appended with each panel element.

     */
    cssClass?: string;

    /**
     * Defines the template value that should be displayed as the panel's header. 
     */
    header?: string | HTMLElement;

    /**
     * Defines the template value that should be displayed as the panel's content. 
     */
    content?: string | HTMLElement;

    /**
     * Defines whether to the panel should be enabled or not.

     */
    enabled?: boolean;

    /**
     * Defines a row value where the panel should be placed.



     */
    row?: number;

    /**
     * Defines the column value where the panel to be placed.



     */
    col?: number;

    /**
     * Specifies the width of the panel in the layout in cells count.
     *

     */
    sizeX?: number;

    /**
     * Specifies the height of the panel in the layout in cells count.
     *

     */
    sizeY?: number;

    /**
     * Specifies the minimum height of the panel in cells count.
     * 

     */
    minSizeY?: number;

    /**
     * Specifies the minimum width of the panel in cells count.
     * *

     */
    minSizeX?: number;

    /**
     * Specifies the maximum height of the panel in cells count.
     * *



     *
     */
    maxSizeY?: number;

    /**
     * Specifies the maximum width of the panel in cells count.
     * *



     */
    maxSizeX?: number;

    /**
     * Specifies the z-index of the panel
     * *



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

     */
    allowDragging?: boolean;

    /**
     * If allowResizing is set to true, then the DashboardLayout allows you to resize the panels.

     */
    allowResizing?: boolean;

    /**
     * If pushing is set to true, then the DashboardLayout allow to push the panels when panels collide
     * while dragging or resizing the panels.
     * *

     * @private
     */
    allowPushing?: boolean;

    /**
     * If allowFloating is set to true, then the DashboardLayout automatically move the panels upwards to fill the empty available 
     * cells while dragging or resizing the panels.
     * *

     */
    allowFloating?: boolean;

    /**
     * Defines the cell aspect ratio of the panel. 

     */
    cellAspectRatio?: number;

    /**
     * Defines the spacing between the panels.
     * *

     */
    cellSpacing?: number[];

    /**
     * Defines the number of columns to be created in the DashboardLayout. 

     */
    columns?: number;

    /**
     * 
     * *

     */
    showGridLines?: boolean;

    /**
     * Defines the draggable handle selector which will act as dragging handler for the panels.
     * *

     */
    draggableHandle?: string;

    /**
     * Locale property.
     * This is not a dashboard layout property.

     * @private
     */
    locale?: string;

    /**
     * Defines the media query value where the dashboardlayout becomes stacked layout when the resolution meets.

     */
    mediaQuery?: string;

    /**
     *
     * Defines the panels property of the DashboardLayout component.
     *

     */
    panels?: PanelModel[];

    /**
     * Defines the resizing handles directions used for resizing the panels.

     * 
     */
    resizableHandles?: string[];

    /**
     * Triggers whenever the panels positions are changed.
     * @event

     */
    change?: EmitType<ChangeEventArgs>;

    /**
     * Triggers when a panel is about to drag.
     * @event

     */
    dragStart?: EmitType<DragStartArgs>;

    /**
     * Triggers while a panel is dragged continuously.
     * @event

     */
    drag?: EmitType<DraggedEventArgs>;

    /**
     * Triggers when a dragged panel is dropped.
     * @event

     */
    dragStop?: EmitType<DragStopArgs>;

    /**
     * Triggers when a panel is about to resize.
     * @event

     */
    resizeStart?: EmitType<ResizeArgs>;

    /**
     * Triggers when a panel is being resized continuously.
     * @event

     */
    resize?: EmitType<ResizeArgs>;

    /**
     * Triggers when a panel resize ends.
     * @event

     */
    resizeStop?: EmitType<ResizeArgs>;

    /**
     * Triggers when Dashboard Layout is created.
     * @event 

     */
    created?: EmitType<Object>;

    /**
     * Triggers when Dashboard Layout is destroyed.
     * @event 

     */
    destroyed?: EmitType<Object>;

}
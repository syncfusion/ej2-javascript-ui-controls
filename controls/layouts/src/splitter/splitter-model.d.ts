import { Component, Property, setStyleAttribute, ChildProperty, compile, isBlazor } from '@syncfusion/ej2-base';import { NotifyPropertyChanges, addClass, Collection, isNullOrUndefined, updateBlazorTemplate } from '@syncfusion/ej2-base';import { Event, EmitType, EventHandler, selectAll, removeClass, select, Browser, detach, formatUnit } from '@syncfusion/ej2-base';
import {Orientation,ResizeEventArgs,ResizingEventArgs,BeforeExpandEventArgs,ExpandedEventArgs} from "./splitter";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class PaneProperties
 */
export interface PanePropertiesModel {

    /**
     * Configures the properties for each pane.

     */
    size?: string;

    /**
     * Specifies whether a pane is collapsible or not collapsible.

     */
    collapsible?: boolean;

    /**
     * Specifies whether a pane is collapsed or not collapsed at the initial rendering of splitter.

     */
    collapsed?: boolean;

    /**
     * Specifies the value whether a pane is resizable. By default, the Splitter is resizable in all panes.
     * You can disable this for any specific panes using this property.

     */
    resizable?: boolean;

    /**
     * Specifies the minimum size of a pane. The pane cannot be resized if it is less than the specified minimum size.

     */
    min?: string;

    /**
     * Specifies the maximum size of a pane. The pane cannot be resized if it is more than the specified maximum limit.

     */
    max?: string;

    /**
     * Specifies the content of split pane as plain text, HTML markup, or any other JavaScript controls.


     */
    content?: string | HTMLElement;

}

/**
 * Interface for a class Splitter
 */
export interface SplitterModel extends ComponentModel{

    /**
     * Specifies the height of the Splitter component that accepts both string and number values.

     */
    height?: string;

    /**
     * Specifies the width of the Splitter control, which accepts both string and number values as width.
     * The string value can be either in pixel or percentage format.

     */
    width?: string;

    /**
     * Configures the individual pane behaviors such as content, size, resizable, minimum, maximum validation, collapsible and collapsed.

     */
    paneSettings?: PanePropertiesModel[];

    /**
     * Specifies a value that indicates whether to align the split panes horizontally or vertically.
     *  * Set the orientation property as "Horizontal" to create a horizontal splitter that aligns the panes left-to-right.
     *  * Set the orientation property as "Vertical" to create a vertical splitter that aligns the panes top-to-bottom.

     */
    orientation?: Orientation;

    /**
     * Specifies the CSS class names that defines specific user-defined
     * styles and themes to be appended on the root element of the Splitter.
     * It is used to customize the Splitter control.
     * One or more custom CSS classes can be specified to the Splitter.

     */
    cssClass?: string;

    /**
     * Specifies boolean value that indicates whether the component is enabled or disabled.
     * The Splitter component does not allow to interact when this property is disabled.

     */
    enabled?: boolean;

    /**
     * Specifies the size of the separator line for both horizontal or vertical orientation.
     * The separator is used to separate the panes by lines.

     */
    separatorSize?: number;

    /**
     * Triggers after creating the splitter component with its panes.
     * @event

     */
    created?: EmitType<Object>;

    /**
     * Triggers when the split pane is started to resize.
     * @event

     */
    resizeStart?: EmitType<ResizeEventArgs>;

    /**
     * Triggers when a split pane is being resized.
     * @event

     */
    resizing?: EmitType<ResizingEventArgs>;

    /**
     * Triggers when the resizing of split pane is stopped.
     * @event

     */
    resizeStop?: EmitType<ResizingEventArgs>;

    /**
     * Triggers when before panes get collapsed.
     * @event 

     */
    beforeCollapse?: EmitType<BeforeExpandEventArgs>;

    /**
     * Triggers when before panes get expanded.
     * @event 

     */
    beforeExpand?: EmitType<BeforeExpandEventArgs>;

    /**
     * Triggers when after panes get collapsed.
     * @event 

     */
    collapsed?: EmitType<ExpandedEventArgs>;

    /**
     * Triggers when after panes get expanded.
     * @event 

     */
    expanded?: EmitType<ExpandedEventArgs>;

}
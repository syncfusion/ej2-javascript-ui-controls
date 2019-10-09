import { Component, formatUnit, EventHandler, Event, isNullOrUndefined, closest, isBlazor } from '@syncfusion/ej2-base';import { Property, EmitType, NotifyPropertyChanges, INotifyPropertyChanged, Browser } from '@syncfusion/ej2-base';import { setStyleAttribute as setStyle, addClass, removeClass, createElement, Touch, SwipeEventArgs } from '@syncfusion/ej2-base';
import {SidebarPosition,SidebarType,EventArgs,ChangeEventArgs} from "./sidebar";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class Sidebar
 */
export interface SidebarModel extends ComponentModel{

    /**
     * Specifies the size of the Sidebar in dock state.
     * > For more details about dockSize refer to 
     * [`Dock`](https://ej2.syncfusion.com/documentation/sidebar/docking-sidebar/) documentation.
     * @default 'auto'
     */
    dockSize?: string | number;

    /**
     * Specifies the media query string for resolution, which when met opens the Sidebar.
     * ```typescript
     *   let defaultSidebar: Sidebar = new Sidebar({
     *       mediaQuery:'(min-width: 600px)' 
     *   });
     * ```
     * > For more details about mediaQuery refer to 
     * [`Auto Close`](https://ej2.syncfusion.com/documentation/sidebar/auto-close/) documentation.
     * @default null
     * @aspType string
     * @blazorType string
     */
    mediaQuery?: string | MediaQueryList;

    /**
     * Specifies the docking state of the component.
     * > For more details about enableDock refer to 
     * [`Dock`](https://ej2.syncfusion.com/documentation/sidebar/docking-sidebar/) documentation.
     * @default false
     */
    enableDock?: boolean;

    /**
     * Enables the expand or collapse while swiping in touch devices.
     * This is not a sidebar property.
     * @default 'en-US'
     * @private
     */
    locale?: string;

    /**
     * Enable or disable persisting component's state between page reloads. If enabled, following list of states will be persisted.
     * 1. Position
     * 2. Type
     * @default false
     */
    enablePersistence?: boolean;

    /**
     * Enables the expand or collapse while swiping in touch devices.
     * @default true
     */
    enableGestures?: boolean;

    /**
     * Gets or sets the Sidebar component is open or close. 
     * > When the Sidebar type is set to `Auto`,
     * the component will be expanded in the desktop and collapsed in the mobile mode regardless of the isOpen property.
     * @default false
     */
    isOpen?: boolean;

    /**
     * Specifies the Sidebar in RTL mode that displays the content in the right-to-left direction.
     * @default false
     */
    enableRtl?: boolean;

    /**
     * Enable or disable the animation transitions on expanding or collapsing the Sidebar.
     * @default true
     */
    animate?: boolean;

    /**
     * Specifies the height of the Sidebar.
     * @default 'auto'
     * @private
     */
    height?: string | number;

    /**
     * Specifies whether the Sidebar need to be closed or not when document area is clicked.
     * @default false
     */
    closeOnDocumentClick?: boolean;

    /**
     * Specifies the position of the Sidebar (Left/Right) corresponding to the main content.
     * > For more details about SidebarPosition refer to 
     * [`position`](https://ej2.syncfusion.com/documentation/sidebar/getting-started/#position) documentation.
     * @default 'Left'
     */
    position?: SidebarPosition;

    /**
     * Allows to place the sidebar inside the target element.
     * > For more details about target refer to 
     * [`Custom Context`](https://ej2.syncfusion.com/documentation/sidebar/custom-context/) documentation.
     * @default null
     */
    target?: HTMLElement | string;

    /**
     * Specifies the whether to apply overlay options to main content when the Sidebar is in an open state.
     * > For more details about showBackdrop refer to 
     * [`Backdrop`](https://ej2.syncfusion.com/documentation/sidebar/getting-started/#enable-backdrop) documentation.
     * @default false
     */
    showBackdrop?: boolean;

    /**
     * Specifies the expanding types of the Sidebar.
     * * `Over` - The sidebar floats over the main content area.
     * * `Push` - The sidebar pushes the main content area to appear side-by-side, and shrinks the main content within the screen width.
     * * `Slide` - The sidebar translates the x and y positions of main content area based on the sidebar width. 
     * The main content area will not be adjusted within the screen width.
     * * `Auto` - Sidebar with `Over` type in mobile resolution and `Push` type in other higher resolutions.
     * > For more details about SidebarType refer to 
     * [`SidebarType`](./variations.html#types) documentation.
     * @default 'Auto'
     */
    type?: SidebarType;

    /**
     * Specifies the width of the Sidebar. By default, the width of the Sidebar sets based on the size of its content.
     * Width can also be set in pixel values.
     * @default 'auto'
     */
    width?: string | number;

    /**
     * Specifies the z-index of the Sidebar. It is applicable only when sidebar act as overlay type.
     * @default 1000
     * @aspType double
     * @blazorType double
     */
    zIndex?: string | number;

    /**
     * Triggers when component is created.
     * @event 
     * @blazorproperty 'Created'
     */
    created?: EmitType<Object>;

    /**
     * Triggers when component is closed.
     * @event 
     * @blazorproperty 'OnClose'
     * @blazorType Syncfusion.EJ2.Blazor.Navigations.EventArgs
     */
    close?: EmitType<EventArgs>;

    /**
     * Triggers when component is opened.
     * @event 
     * @blazorproperty 'OnOpen'
     * @blazorType Syncfusion.EJ2.Blazor.Navigations.EventArgs
     */
    open?: EmitType<EventArgs>;

    /**
     * Triggers when the state(expand/collapse) of the component is changed.
     * @event 
     * @blazorproperty 'Changed'
     */
    change?: EmitType<ChangeEventArgs>;

    /**
     * Triggers when component gets destroyed.
     * @event 
     * @blazorproperty 'Destroyed'
     */
    destroyed?: EmitType<Object>;

}
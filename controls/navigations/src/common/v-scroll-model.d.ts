import { Touch, ScrollEventArgs, TouchEventArgs, Component, EventHandler, selectAll, getUniqueID, removeClass } from '@syncfusion/ej2-base';import { NotifyPropertyChanges, INotifyPropertyChanged, Property, Browser, detach, createElement as buildTag } from '@syncfusion/ej2-base';import { classList, SwipeEventArgs, isNullOrUndefined } from '@syncfusion/ej2-base';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class VScroll
 */
export interface VScrollModel extends ComponentModel{

    /**
     * Specifies the up or down scrolling distance of the vertical scrollbar moving.
     *
     * @default null
     */
    scrollStep?: number;

}
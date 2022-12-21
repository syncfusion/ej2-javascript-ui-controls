import { addClass, Event, attributes, BaseEventArgs, compile, Component, EmitType, EventHandler, getUniqueID, INotifyPropertyChanged, select } from '@syncfusion/ej2-base';import { isNullOrUndefined, KeyboardEventArgs, KeyboardEvents, MouseEventArgs, NotifyPropertyChanges, Property, remove, removeClass } from '@syncfusion/ej2-base';import { Tooltip } from '@syncfusion/ej2-popups';
import {LabelPosition,PrecisionType,RatingItemEventArgs,RatingHoverEventArgs,RatingChangedEventArgs} from "./rating";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class Rating
 */
export interface RatingModel extends ComponentModel{

    /**
     * Defines whether to show or hide the reset button.
     * If min is not zero, then reset button won’t be displayed regardless of allowReset value.
     *
     * @default false
     */
    allowReset?: boolean;

    /**
     * Defines the CSS class to customize the rating appearance.
     *
     * @default ''
     */
    cssClass?: string;

    /**
     * Defines whether the rating is enabled or disabled.
     *
     * @default false
     */
    disabled?: boolean;

    /**
     * Defines whether to add animation when an item is hovered.
     *
     * @default true
     */
    enableAnimation?: boolean;

    /**
     * Defines the template content for each item when it is not selected.
     * The template context will contain the current item value for customization.
     *
     * @default ''
     */
    emptyTemplate?: string;

    /**
     * Defines whether to enable single selection like radio button or not.
     * If not enabled all the items before the selected item will also be in the selected state.
     *
     * @default false
     */
    enableSingleSelection?: boolean;

    /**
     * Defines the template content for each item when it is selected.
     * The template context will contain the current item value for customization.
     *
     * @default ''
     */
    fullTemplate?: string;

    /**
     * Defines the number of rating items.
     *
     * @default 5
     * @aspType int
     */
    itemsCount?: number;

    /**
     * Defines the position of the label in the rating.
     * *Top
     * *Bottom
     * *Left
     * *Right
     *
     * @isenumeration true
     * @default LabelPosition.Right
     * @asptype LabelPosition
     */
    labelPosition?: string | LabelPosition;

    /**
     * Defines the template content for the label.
     * The template context will contain the current value and maximum value for customization.
     *
     * @default ''
     */
    labelTemplate?: string;

    /**
     * Defines the minimum value of the rating.
     *
     * @default 0.0
     * @aspType double
     */
    min?: number;

    /**
     * Defines the minimum increase in the value.
     * *Full
     * *Half
     * *Quarter
     * *Exact
     *
     * @isenumeration true
     * @default PrecisionType.Full
     * @asptype PrecisionType
     */
    precision?: string | PrecisionType;

    /**
     * Defines whether the read only mode is enabled or not where interaction is disabled without any UI change.
     *
     * @default false
     */
    readOnly?: boolean;

    /**
     * Defines whether to show a label which display the current value.
     *
     * @default false
     */
    showLabel?: boolean;

    /**
     * Defines whether to show tooltip for the items.
     *
     * @default true
     */
    showTooltip?: boolean;

    /**
     * Defines the template content for the tooltip.
     * The template context will contain the current value for customization.
     *
     * @default ''
     */
    tooltipTemplate?: string;

    /**
     * Defines the rating value.
     *
     * @default 0.0
     * @aspType double
     */
    value?: number;

    /**
     * Defines whether the rating is visible or hidden.
     *
     * @default true
     */
    visible?: boolean;

    /**
     * Event triggers before rendering each item.
     *
     * @event beforeItemRender
     */
    beforeItemRender?: EmitType<RatingItemEventArgs>;

    /**
     * Event triggers after the creation of Rating.
     *
     * @event created
     */
    created?: EmitType<Event>;

    /**
     * Event triggers whenever a new item is hovered.
     *
     * @event onItemHover
     */
    onItemHover?: EmitType<RatingHoverEventArgs>;

    /**
     * Event triggers whenever the value changes.
     *
     * @event valueChanged
     */
    valueChanged?: EmitType<RatingChangedEventArgs>;

}
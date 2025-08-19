import { Component, INotifyPropertyChanged, ChildProperty, Collection, BaseEventArgs, Event, EmitType, NotifyPropertyChanges, Property, getUniqueID, attributes, select, compile, remove, removeClass, append, isNullOrUndefined } from '@syncfusion/ej2-base';
import {TimelineOrientation,TimelineAlign,TimelineRenderingEventArgs} from "./timeline";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class TimelineItem
 */
export interface TimelineItemModel {

    /**
     * Defines one or more CSS classes to include an icon or image in the Timeline item.
     *
     * @default ''
     */
    dotCss?: string;

    /**
     * Defines the text content or template for the Timeline item. The current itemIndex passed as context to build the content.
     *
     * @default ''
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    content?: string | Function;

    /**
     * Defines the additional text content or template to be displayed opposite side of the item. The current itemIndex passed as context to build the content.
     *
     * @default ''
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    oppositeContent?: string | Function;

    /**
     * Defines whether to enable or disable the timeline item.
     *
     * @default false
     */
    disabled?: boolean;

    /**
     * Defines the CSS class to customize the Timeline item appearance.
     *
     * @default ''
     */
    cssClass?: string;

}

/**
 * Interface for a class Timeline
 */
export interface TimelineModel extends ComponentModel{

    /**
     * Defines the orientation type of the Timeline.
     *
     * The possible values are:
     * * Horizontal
     * * vertical
     *
     * {% codeBlock src='timeline/orientation/index.md' %}{% endcodeBlock %}
     *
     * @isenumeration true
     * @default TimelineOrientation.Vertical
     * @asptype TimelineOrientation
     */
    orientation?: string | TimelineOrientation;

    /**
     * Defines the alignment of item content within the Timeline.
     *
     * The possible values are:
     * * Before
     * * After
     * * Alternate
     * * AlternateReverse
     *
     * {% codeBlock src='timeline/align/index.md' %}{% endcodeBlock %}
     *
     * @isenumeration true
     * @default TimelineAlign.After
     * @asptype TimelineAlign
     */
    align?: string | TimelineAlign;

    /**
     * Defines the list of items.
     *
     * @default []
     */
    items?: TimelineItemModel[];

    /**
     * Defines the CSS class to customize the Timeline appearance.
     *
     * @default ''
     */
    cssClass?: string;

    /**
     * Defines whether to show the timeline items in reverse order or not.
     *
     * @default false
     */
    reverse?: boolean;

    /**
     * Defines the template content for each timeline item. The template context will contain the item model.
     *
     * {% codeBlock src='timeline/template/index.md' %}{% endcodeBlock %}
     *
     * @default ''
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    template?: string | Function;

    /**
     * Event callback that is raised after rendering the timeline.
     *
     * @event created
     */
    created?: EmitType<Event>;

    /**
     * Event triggers before rendering each item.
     *
     * @event beforeItemRender
     */
    beforeItemRender?: EmitType<TimelineRenderingEventArgs>;

}
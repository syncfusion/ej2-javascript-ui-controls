import { Component, Property, ChildProperty, Event, BaseEventArgs, append, compile } from '@syncfusion/ej2-base';import { EventHandler, EmitType, Touch, TapEventArgs, Browser, Animation as PopupAnimation, animationMode } from '@syncfusion/ej2-base';import { isNullOrUndefined, getUniqueID, formatUnit, select, selectAll } from '@syncfusion/ej2-base';import { attributes, closest, removeClass, addClass, remove } from '@syncfusion/ej2-base';import { NotifyPropertyChanges, INotifyPropertyChanged, Complex, SanitizeHtmlHelper } from '@syncfusion/ej2-base';import { Popup } from '../popup/popup';import { OffsetPosition, calculatePosition } from '../common/position';import { isCollide, fit } from '../common/collision';
import {TooltipAnimationSettings,Position,TipPointerPosition,TooltipEventArgs} from "./tooltip";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class Animation
 */
export interface AnimationModel {

    /**
     * Animation settings to be applied on the Tooltip, while it is being shown over the target.
     */
    open?: TooltipAnimationSettings;

    /**
     * Animation settings to be applied on the Tooltip, when it is closed.
     */
    close?: TooltipAnimationSettings;

}

/**
 * Interface for a class Tooltip
 */
export interface TooltipModel extends ComponentModel{

    /**
     * It is used to set the width of Tooltip component which accepts both string and number values.
     * When set to auto, the Tooltip width gets auto adjusted to display its content within the viewable screen.
     *
     * @default 'auto'
     */
    width?: string | number;

    /**
     * It is used to set the height of Tooltip component which accepts both string and number values.
     * When Tooltip content gets overflow due to height value then the scroll mode will be enabled.
     * Refer the documentation [here](https://ej2.syncfusion.com/documentation/tooltip/setting-dimension/)
     *  to know more about this property with demo.
     *
     * @default 'auto'
     */
    height?: string | number;

    /**
     * It is used to display the content of Tooltip which can be both string and HTML Elements.
     * Refer the documentation [here](https://ej2.syncfusion.com/documentation/tooltip/content/)
     *  to know more about this property with demo.
     *
     * {% codeBlock src="tooltip/content-api/index.ts" %}{% endcodeBlock %}
     *
     * @aspType string
     */
    content?: string | HTMLElement | Function;

    /**
     * It is used to set the container element in which the Tooltip’s pop-up will be appended. It accepts value as both string and HTML Element.
     * It's default value is `body`, in which the Tooltip’s pop-up will be appended.
     *
     */
    container?: string | HTMLElement;

    /**
     * It is used to denote the target selector where the Tooltip need to be displayed.
     * The target element is considered as parent container.
     *
     * {% codeBlock src="tooltip/target-api/index.ts" %}{% endcodeBlock %}
     */
    target?: string;

    /**
     * It is used to set the position of Tooltip element, with respect to Target element.
     *
     * {% codeBlock src="tooltip/position-api/index.ts" %}{% endcodeBlock %}
     *
     */
    position?: Position;

    /**
     * It sets the space between the target and Tooltip element in X axis.
     *
     * {% codeBlock src="tooltip/offsetX-api/index.ts" %}{% endcodeBlock %}
     * {% codeBlock src="tooltip/offsetx/index.md" %}{% endcodeBlock %}
     *
     * @default 0
     */
    offsetX?: number;

    /**
     * It sets the space between the target and Tooltip element in Y axis.
     *
     * {% codeBlock src="tooltip/offsetX-api/index.ts" %}{% endcodeBlock %}
     * {% codeBlock src="tooltip/offsety/index.md" %}{% endcodeBlock %}
     *
     * @default 0
     */
    offsetY?: number;

    /**
     * It is used to show or hide the tip pointer of Tooltip.
     *
     * {% codeBlock src="tooltip/offsetX-api/index.ts" %}{% endcodeBlock %}
     * {% codeBlock src="tooltip/showtippointer/index.md" %}{% endcodeBlock %}
     *
     * @default true
     */
    showTipPointer?: boolean;

    /**
     * It enables or disables the parsing of HTML string content into HTML DOM elements for Tooltip.
     * If the value of the property is set to false, the tooltip content will be displayed as HTML string instead of HTML DOM elements.
     *
     * @default true
     */
    enableHtmlParse?: boolean;

    /**
     * It is used to set the collision target element as page viewport (window) or Tooltip element, when using the target.
     * If this property is enabled, tooltip will perform the collision calculation between the target elements
     * and viewport(window) instead of Tooltip element.
     *
     * @default false
     */
    windowCollision?: boolean;

    /**
     * It is used to set the position of tip pointer on tooltip.
     * When it sets to auto, the tip pointer auto adjusts within the space of target's length
     *  and does not point outside.
     * Refer the documentation
     *  [here](https://ej2.syncfusion.com/documentation/tooltip/position.html?lang=typescript#tip-pointer-positioning)
     *  to know more about this property with demo.
     * 
     * {% codeBlock src="tooltip/tippointerposition/index.md" %}{% endcodeBlock %}
     *
     * @default 'Auto'
     */
    tipPointerPosition?: TipPointerPosition;

    /**
     * It is used to determine the device mode to display the Tooltip content.
     * If it is in desktop, it will show the Tooltip content when hovering on the target element.
     * If it is in touch device, it will show the Tooltip content when tap and holding on the target element.
     * 
     * {% codeBlock src="tooltip/openson/index.md" %}{% endcodeBlock %}
     * {% codeBlock src="tooltip/opensOn-api/index.ts" %}{% endcodeBlock %}
     *
     * @default 'Auto'
     */
    opensOn?: string;

    /**
     * It allows the Tooltip to follow the mouse pointer movement over the specified target element.
     * Refer the documentation [here](https://ej2.syncfusion.com/documentation/tooltip/position/#mouse-trailing)
     *  to know more about this property with demo.
     * 
     * {% codeBlock src="tooltip/mousetrail/index.md" %}{% endcodeBlock %}
     * {% codeBlock src="tooltip/offsetX-api/index.ts" %}{% endcodeBlock %}
     *
     * @default false
     */
    mouseTrail?: boolean;

    /**
     * It is used to display the Tooltip in an open state until closed by manually.
     * Refer the documentation [here](https://ej2.syncfusion.com/documentation/tooltip/open-mode/#sticky-mode)
     *  to know more about this property with demo.
     * 
     * {% codeBlock src="tooltip/issticky/index.md" %}{% endcodeBlock %}
     *
     * @default false
     */
    isSticky?: boolean;

    /**
     * We can set the same or different animation option to Tooltip while it is in open or close state.
     * Refer the documentation [here](https://ej2.syncfusion.com/documentation/tooltip/animation/)
     *  to know more about this property with demo.
     * 
     * {% codeBlock src="tooltip/animation/index.md" %}{% endcodeBlock %}
     * {% codeBlock src="tooltip/animation-api/index.ts" %}{% endcodeBlock %}
     *
     * @default { open: { effect: 'FadeIn', duration: 150, delay: 0 }, close: { effect: 'FadeOut', duration: 150, delay: 0 } }
     */
    animation?: AnimationModel;

    /**
     * It is used to open the Tooltip after the specified delay in milliseconds.
     *
     * @default 0
     */
    openDelay?: number;

    /**
     * It is used to close the Tooltip after a specified delay in milliseconds.
     *
     * @default 0
     */
    closeDelay?: number;

    /**
     * It is used to customize the Tooltip which accepts custom CSS class names that
     *  defines specific user-defined styles and themes to be applied on the Tooltip element.
     *
     * @default null
     */
    cssClass?: string;

    /**
     * Defines whether to allow the cross-scripting site or not.
     *
     * @default false
     */
    enableHtmlSanitizer?: boolean;

    /**
     * Allows additional HTML attributes such as tabindex, title, name, etc. to root element of the Tooltip popup, and
     * accepts n number of attributes in a key-value pair format.
     * 
     * {% codeBlock src='tooltip/htmlAttributes/index.md' %}{% endcodeBlock %}
     *
     * @default {}
     */
    htmlAttributes?: { [key: string]: string };

    /**
     * We can trigger `beforeRender` event before the Tooltip and its contents are added to the DOM.
     * When one of its arguments `cancel` is set to true, the Tooltip can be prevented from rendering on the page.
     * This event is mainly used for the purpose of customizing the Tooltip before it shows up on the screen.
     * For example, to load the AJAX content or to set new animation effects on the Tooltip, this event can be opted.
     * Refer the documentation
     *  [here](https://ej2.syncfusion.com/documentation/tooltip/content/#dynamic-content-via-ajax)
     *  to know more about this property with demo.
     *
     * @event
     */
    beforeRender?: EmitType<TooltipEventArgs>;

    /**
     * We can trigger `beforeOpen` event before the Tooltip is displayed over the target element.
     * When one of its arguments `cancel` is set to true, the Tooltip display can be prevented.
     * This event is mainly used for the purpose of refreshing the Tooltip positions dynamically or to
     *  set customized styles in it and so on.
     * 
     * {% codeBlock src="tooltip/beforeOpen/index.md" %}{% endcodeBlock %}
     *
     * @event
     */
    beforeOpen?: EmitType<TooltipEventArgs>;

    /**
     * We can trigger `afterOpen` event after the Tooltip Component gets opened.
     * 
     * {% codeBlock src="tooltip/afterOpen/index.md" %}{% endcodeBlock %}
     *
     * @event
     */
    afterOpen?: EmitType<TooltipEventArgs>;

    /**
     * We can trigger `beforeClose` event before the Tooltip hides from the screen. If returned false, then the Tooltip is no more hidden.
     * 
     * {% codeBlock src="tooltip/beforeClose/index.md" %}{% endcodeBlock %}
     *
     * @event
     */
    beforeClose?: EmitType<TooltipEventArgs>;

    /**
     * We can trigger `afterClose` event when the Tooltip Component gets closed.
     * 
     * {% codeBlock src="tooltip/afterClose/index.md" %}{% endcodeBlock %}
     *
     * @event
     */
    afterClose?: EmitType<TooltipEventArgs>;

    /**
     * We can trigger `beforeCollision` event for every collision fit calculation.
     * 
     * {% codeBlock src="tooltip/beforeCollision/index.md" %}{% endcodeBlock %}
     *
     * @event
     */
    beforeCollision?: EmitType<TooltipEventArgs>;

    /**
     * We can trigger `created` event after the Tooltip component is created.
     *
     * @event
     */
    created?: EmitType<Object>;

    /**
     * We can trigger `destroyed` event when the Tooltip component is destroyed.
     *
     * @event
     */
    destroyed?: EmitType<Object>;

}
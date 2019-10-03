import { Component, EventHandler, Property, Event, EmitType, AnimationModel, KeyboardEvents, rippleEffect } from '@syncfusion/ej2-base';import { KeyboardEventArgs, BaseEventArgs, Effect, getUniqueID, compile as templateCompiler } from '@syncfusion/ej2-base';import { isVisible, closest, attributes, detach, select, isBlazor, addClass, append } from '@syncfusion/ej2-base';import { INotifyPropertyChanged, NotifyPropertyChanges, ChildProperty, Collection, Animation } from '@syncfusion/ej2-base';import { setStyleAttribute as setStyle, Complex, updateBlazorTemplate } from '@syncfusion/ej2-base';import { isNullOrUndefined as isNOU, formatUnit, selectAll } from '@syncfusion/ej2-base';
import {ExpandMode,AccordionClickArgs,ExpandEventArgs,ExpandedEventArgs} from "./accordion";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class AccordionActionSettings
 */
export interface AccordionActionSettingsModel {

    /**
   * Specifies the type of animation.



   */
    effect?: 'None' | Effect;

    /**
   * Specifies the duration to animate.

   */
    duration?: number;

    /**
   * Specifies the animation timing function.

   */
    easing?: string;

}

/**
 * Interface for a class AccordionAnimationSettings
 */
export interface AccordionAnimationSettingsModel {

    /**
   * Specifies the animation to appear while collapsing the Accordion item.

   */
    collapse?: AccordionActionSettingsModel;

    /**
   * Specifies the animation to appear while expanding the Accordion item.

   */
    expand?: AccordionActionSettingsModel;

}

/**
 * Interface for a class AccordionItem
 */
export interface AccordionItemModel {

    /**
     * Sets the text content to be displayed for the Accordion item.
     * You can set the content of the Accordion item using `content` property.
     * It also supports to include the title as `HTML element`, `string`, or `query selector`.
     * ```typescript
     *   let accordionObj: Accordion = new Accordion( { 
     *        items: [ 
     *          { header: 'Accordion Header', content: 'Accordion Content' },
     *          { header: '<div>Accordion Header</div>', content: '<div>Accordion Content</div' },
     *          { header: '#headerContent', content: '#panelContent' }]
     *        });
     *   accordionObj.appendTo('#accordion');
     * ```

     */
    content?: string;

    /**
     * Sets the header text to be displayed for the Accordion item.
     * You can set the title of the Accordion item using `header` property.
     * It also supports to include the title as `HTML element`, `string`, or `query selector`.
     * ```typescript
     *   let accordionObj: Accordion = new Accordion( { 
     *        items: [ 
     *          { header: 'Accordion Header', content: 'Accordion Content' },
     *          { header: '<div>Accordion Header</div>', content: '<div>Accordion Content</div' },
     *          { header: '#headerContent', content: '#panelContent' }]
     *        });
     *   accordionObj.appendTo('#accordion');
     * ```

     */
    header?: string;

    /**
     * Defines single/multiple classes (separated by a space) are to be used for Accordion item customization.

     */
    cssClass?: string;

    /**
     * Defines an icon with the given custom CSS class that is to be rendered before the header text.
     * Add the css classes to the `iconCss` property and write the css styles to the defined class to set images/icons.
     * Adding icon is applicable only to the header.
     * ```typescript
     *   let accordionObj: Accordion = new Accordion( { 
     *        items: [ 
     *          { header: 'Accordion Header', iconCss: 'e-app-icon' }]
     *        });
     *   accordionObj.appendTo('#accordion');
     * ```
     * ```css
     * .e-app-icon::before {
     *   content: "\e710";
     * }
     * ```

     */
    iconCss?: string;

    /**
     * Sets the expand (true) or collapse (false) state of the Accordion item. By default, all the items are in a collapsed state.

     */
    expanded?: Boolean;

}

/**
 * Interface for a class Accordion
 */
export interface AccordionModel extends ComponentModel{

    /**
     * An array of item that is used to specify Accordion items.
     * ```typescript
     *   let accordionObj: Accordion = new Accordion( { 
     *        items: [ 
     *          { header: 'Accordion Header', content: 'Accordion Content' }]
     *        });
     *   accordionObj.appendTo('#accordion');
     * ```

     */
    items?: AccordionItemModel[];

    /**
     * Specifies the datasource for the accordion items.


     */
    dataSource?: Object[];

    /**
     * Specifies the template option for accordion items.

     */
    itemTemplate?: string;

    /**
     * Specifies the header title template option for accordion items.

     */
    headerTemplate?: string;

    /**
     * Specifies the width of the Accordion in pixels/number/percentage. Number value is considered as pixels.

     */
    width?: string | number;

    /**
     * Specifies the height of the Accordion in pixels/number/percentage. Number value is considered as pixels.

     */
    height?: string | number;

    /**
     * Specifies the options to expand single or multiple panel at a time.
     * The possible values are:
     * - Single: Sets to expand only one Accordion item at a time.
     * - Multiple: Sets to expand more than one Accordion item at a time.

     */
    expandMode?: ExpandMode;

    /**
     * Specifies the animation configuration settings for expanding and collapsing the panel.

     * collapse: { effect: 'SlideUp', duration: 400, easing: 'linear' }}
     */
    animation?: AccordionAnimationSettingsModel;

    /**
     * The event will be fired while clicking anywhere within the Accordion.
     * @event

     */
    clicked?: EmitType<AccordionClickArgs>;

    /**
     * The event will be fired before the item gets collapsed/expanded.
     * @event

     */
    expanding?: EmitType<ExpandEventArgs>;

    /**
     * The event will be fired after the item gets collapsed/expanded.
     * @event

     */
    expanded?: EmitType<ExpandedEventArgs>;

    /**
     * The event will be fired once the control rendering is completed.
     * @event

     */
    created?: EmitType<Event>;

    /**
     * The event will be fired when the control gets destroyed.
     * @event

     */
    destroyed?: EmitType<Event>;

}
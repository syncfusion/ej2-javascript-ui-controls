import { BaseEventArgs, EmitType, Event, ChildProperty, Collection, Complex, Component, INotifyPropertyChanged, NotifyPropertyChanges, Property, getUniqueID, EventHandler, isRippleEnabled, removeClass, addClass, attributes } from '@syncfusion/ej2-base';import { select, extend, deleteObject, KeyboardEvents, append, rippleEffect, remove, closest, selectAll, KeyboardEventArgs, isNullOrUndefined, compile, formatUnit, Animation, AnimationModel, Effect as baseEffect } from '@syncfusion/ej2-base';import { Fab, FabPosition } from './../floating-action-button/index';import { IconPosition } from './../button/index';
import {SpeedDialAnimationEffect,RadialDirection,LinearDirection,SpeedDialMode,SpeedDialBeforeOpenCloseEventArgs,SpeedDialItemEventArgs,SpeedDialOpenCloseEventArgs} from "./speed-dial";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class SpeedDialAnimationSettings
 */
export interface SpeedDialAnimationSettingsModel {

    /**
     * Defines  the type of animation effect used for opening and closing of the Speed Dial items.
     *
     * @isenumeration true
     * @default SpeedDialAnimationEffect.Fade
     * @asptype SpeedDialAnimationEffect
     */
    effect?: string | SpeedDialAnimationEffect;

    /**
     * Defines the duration in milliseconds that the animation takes to open or close the popup.
     *
     * @default 400
     * @aspType int
     */
    duration?: number;

    /**
     * Defines the delay before starting the animation.
     *
     * @default 0
     * @aspType int
     */
    delay?: number;

}

/**
 * Interface for a class RadialSettings
 */
export interface RadialSettingsModel {

    /**
     * Defines speed dial action items placement order.
     * The possible values are
     * * Clockwise
     * * AntiClockwise
     * * Auto
     *
     * @isenumeration true
     * @default RadialDirection.Auto
     * @asptype RadialDirection
     */
    direction?: string | RadialDirection;

    /**
     * Defines end angle of speed dial items placement. The accepted value range is 0 to 360.
     * When a value is outside the accepted value range, then the provided value is ignored, and the angle is calculated based on the position.
     *
     * @default -1
     * @aspType int
     */
    endAngle?: number;

    /**
     * Defines distance of speed dial items placement from the button of Speed Dial.
     *
     * @default '100px'
     * @aspType string
     */
    offset?: string | number;

    /**
     * Defines start angle of speed dial items placement. The accepted value range is 0 to 360.
     * When a value is outside the accepted value range, then the provided value is ignored, and the angle is calculated based on the position.
     *
     * @default -1
     * @aspType int
     */
    startAngle?: number;

}

/**
 * Interface for a class SpeedDialItem
 */
export interface SpeedDialItemModel {

    /**
     * Defines one or more CSS classes to include an icon or image in speed dial item.
     *
     * @default ''
     */
    iconCss?: string;

    /**
     * Defines a unique value for the SpeedDialItem which can be used to identify the item in event args.
     *
     * @default ''
     */
    id?: string;

    /**
     * Defines the text content of SpeedDialItem.
     * Text won't be visible when mode is Radial.
     * Also, in Linear mode, text won't be displayed when direction is Left or Right.
     *
     * @default ''
     */
    text?: string;

    /**
     * Defines the title of SpeedDialItem to display tooltip.
     *
     * @default ''
     */
    title?: string;

    /**
     * Defines whether to enable or disable the SpeedDialItem.
     *
     * @default false
     */
    disabled?: boolean;

}

/**
 * Interface for a class SpeedDial
 */
export interface SpeedDialModel extends ComponentModel{

    /**
     * Provides options to customize the animation applied while opening and closing the popup of speed dial
     * {% codeBlock src='speeddial/animation/index.md' %}{% endcodeBlock %}
     *
     * @default { effect: 'Fade', duration: 400, delay: 0 }
     */
    animation?: SpeedDialAnimationSettingsModel;

    /**
     * Defines the content for the button of SpeedDial.
     *
     * @default ''
     */
    content?: string;

    /**
     * Defines one or more CSS classes to include an icon or image to denote the speed dial is opened and displaying menu items.
     *
     * @default ''
     */
    closeIconCss?: string;

    /**
     * Defines one or more CSS classes to customize the appearance of SpeedDial.
     *
     * @default ''
     */
    cssClass?: string;

    /**
     * Defines the speed dial item display direction when mode is linear .
     * The possible values are
     * * Up
     * * Down
     * * Left
     * * Right
     * * Auto
     *
     * @isenumeration true
     * @default LinearDirection.Auto
     * @asptype LinearDirection
     */
    direction?: string | LinearDirection;

    /**
     * Defines whether to enable or disable the SpeedDial.
     *
     * @default false.
     */
    disabled?: boolean;

    /**
     * Defines the position of icon in the button of speed dial.
     * The possible values are:
     * * Left
     * * Right
     *
     * @isenumeration true
     * @default IconPosition.Left
     * @asptype IconPosition
     */
    iconPosition?: string | IconPosition;

    /**
     * Defines the list of SpeedDial items.
     *
     * @default []
     */
    items?: SpeedDialItemModel[];

    /**
     * Defines the template content for the speed dial item.
     * {% codeBlock src='speeddial/itemTemplate/index.md' %}{% endcodeBlock %}
     *
     * @default ''
     */
    itemTemplate?: string;

    /**
     * Defines the display mode of speed dial action items.
     * The possible values are:
     * * Linear
     * * Radial
     * {% codeBlock src='speeddial/mode/index.md' %}{% endcodeBlock %}
     *
     * @isenumeration true
     * @default SpeedDialMode.Linear
     * @asptype SpeedDialMode
     */
    mode?: string | SpeedDialMode;

    /**
     * Defines one or more CSS classes to include an icon or image for the button of SpeedDial when it's closed.
     *
     * @default ''
     */
    openIconCss?: string;

    /**
     * Defines whether to open the popup when the button of SpeedDial is hovered.
     * By default, SpeedDial opens popup on click action.
     *
     * @default false
     */
    opensOnHover?: boolean;

    /**
     * Defines the position of the button of Speed Dial relative to target.
     * Defines the position of the FAB relative to target.
     * The possible values are:
     * * TopLeft: Positions the FAB at the target's top left corner.
     * * TopCenter: Positions the FAB at the target's top left corner.
     * * TopRight: Positions the FAB at the target's top left corner.
     * * MiddleLeft: Positions the FAB at the target's top left corner.
     * * MiddleCenter: Positions the FAB at the target's top left corner.
     * * MiddleRight: Positions the FAB at the target's top left corner.
     * * BottomLeft: Positions the FAB at the target's top left corner.
     * * BottomCenter: Places the FAB on the bottom-center position of the target.
     * * BottomRight: Positions the FAB at the target's bottom right corner.
     *
     *  To refresh the position of FAB on target resize, use refreshPosition method.
     *  The position will be refreshed automatically when browser resized.
     *
     * @isenumeration true
     * @default FabPosition.BottomRight
     * @asptype FabPosition
     */
    position?: string | FabPosition;

    /**
     * Defines whether the speed dial popup can be displayed as modal or modal less.
     * When enabled, the Speed dial creates an overlay that disables interaction with other elements other than speed dial items.
     * If user clicks anywhere other than speed dial items then popup will get closed.
     *
     * @default false.
     */
    modal?: boolean;

    /**
     * Defines a template content for popup of SpeedDial.
     *
     * @default ''
     */
    popupTemplate?: string;

    /**
     * Provides the options to customize the speed dial action buttons when mode of speed dial is radial
     * {% codeBlock src='speeddial/radialSettings/index.md' %}{% endcodeBlock %}
     *
     * @default { startAngle: null, endAngle: null, direction: 'Auto' }
     */
    radialSettings?: RadialSettingsModel;

    /**
     * Defines the selector that points to the element in which the button of SpeedDial will be positioned.
     * By default button is positioned based on viewport of browser.
     * The target element must have relative position, else Button will get positioned based on the closest element which has relative position.
     *
     * @default ''
     */
    target?: string | HTMLElement;

    /**
     * Defines whether the SpeedDial is visible or hidden.
     *
     * @default true.
     */
    visible?: boolean;

    /**
     * Event callback that is raised before the speed dial popup is closed.
     *
     * @event beforeClose
     */
    beforeClose?: EmitType<SpeedDialBeforeOpenCloseEventArgs>;

    /**
     * Event callback that is raised before rendering the speed dial item.
     *
     * @event beforeItemRender
     */
    beforeItemRender?: EmitType<SpeedDialItemEventArgs>;

    /**
     * Event callback that is raised before the speed dial popup is opened.
     *
     * @event beforeOpen
     */
    beforeOpen?: EmitType<SpeedDialBeforeOpenCloseEventArgs>;

    /**
     * Event callback that is raised after rendering the speed dial.
     *
     * @event created
     */
    created?: EmitType<Event>;

    /**
     * Event callback that is raised when a speed dial action item is clicked.
     *
     * @event clicked
     */
    clicked?: EmitType<SpeedDialItemEventArgs>;

    /**
     * Event callback that is raised when the SpeedDial popup is closed.
     *
     * @event onClose
     */
    onClose?: EmitType<SpeedDialOpenCloseEventArgs>;

    /**
     * Event callback that is raised when the SpeedDial popup is opened.
     *
     * @event onOpen
     */
    onOpen?: EmitType<SpeedDialOpenCloseEventArgs>;

}
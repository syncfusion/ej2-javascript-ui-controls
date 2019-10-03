import { setStyleAttribute, addClass, removeClass, ChildProperty, Complex } from '@syncfusion/ej2-base';import { isNullOrUndefined, formatUnit } from '@syncfusion/ej2-base';import { Browser } from '@syncfusion/ej2-base';import { calculatePosition, OffsetPosition, calculateRelativeBasedPosition } from '../common/position';import { Animation, AnimationModel, Property, Event, EmitType, Component } from '@syncfusion/ej2-base';import { NotifyPropertyChanges, INotifyPropertyChanged } from '@syncfusion/ej2-base';import { EventHandler } from '@syncfusion/ej2-base';import { flip, fit, isCollide , CollisionCoordinates } from '../common/collision';
import {TargetType,CollisionAxis,ActionOnScrollType} from "./popup";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class PositionData
 */
export interface PositionDataModel {

    /**
     * specify the offset left value

     */
    X?: string | number;

    /**
     * specify the offset top value.

     */
    Y?: string | number;

}

/**
 * Interface for a class Popup
 */
export interface PopupModel extends ComponentModel{

    /**
     * Specifies the height of the popup element. 

     */
    height?: string | number;

    /**
     * Specifies the height of the popup element.

     */
    width?: string | number;

    /**
     * Specifies the content of the popup element, it can be string or HTMLElement.

     */
    content?: string | HTMLElement;

    /**
     * Specifies the relative element type of the component.

     */
    targetType?: TargetType;

    /**
     * Specifies the collision detectable container element of the component.

     */
    viewPortElement?: HTMLElement;

    /**
     * Specifies the collision handler settings of the component.

     */
    collision?: CollisionAxis;

    /**
     * Specifies the relative container element of the popup element.Based on the relative element, popup element will be positioned.
     * 

     */
    relateTo?: HTMLElement | string;

    /**
     * Specifies the popup element position, respective to the relative element.

     */
    position?: PositionDataModel;

    /**
     * specifies the popup element offset-x value, respective to the relative element.

     */
    offsetX?: number;

    /**
     * specifies the popup element offset-y value, respective to the relative element.

     */
    offsetY?: number;

    /**
     * specifies the z-index value of the popup element.

     */
    zIndex?: number;

    /**
     * specifies the rtl direction state of the popup element.

     */
    enableRtl?: boolean;

    /**
     * specifies the action that should happen when scroll the target-parent container.
     * This property should define either `reposition` or `hide`. 
     * when set `reposition` to this property, the popup position will refresh when scroll any parent container.
     * when set `hide` to this property, the popup will be closed when scroll any parent container. 

     */
    actionOnScroll?: ActionOnScrollType;

    /**
     * specifies the animation that should happen when popup open.

     */
    showAnimation?: AnimationModel;

    /**
     * specifies the animation that should happen when popup closes.

     */
    hideAnimation?: AnimationModel;

    /**
     * Triggers the event once opened the popup.
     * @event
     */
    open?: EmitType<Object>;

    /**
     * Trigger the event once closed the popup.
     * @event
     */
    close?: EmitType<Object>;

    /**
     * Triggers the event when target element hide from view port on scroll.
     * @event
     */
    targetExitViewport?: EmitType<Object>;

}
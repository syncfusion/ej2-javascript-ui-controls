import { Property, ChildProperty, Event, BaseEventArgs, append, compile, createElement } from '@syncfusion/ej2-base';import { Touch, Browser, Animation as tooltipAnimation, AnimationModel as tooltipAnimationModel } from '@syncfusion/ej2-base';import { isNullOrUndefined, formatUnit } from '@syncfusion/ej2-base';import { attributes, removeClass, addClass, remove, updateBlazorTemplate } from '@syncfusion/ej2-base';import { OffsetPosition, calculatePosition } from './position';import { isCollide, fit } from './collision';import { Diagram } from '../diagram';import { Position } from '@syncfusion/ej2-popups';import { Effect } from '@syncfusion/ej2-base';
import {TooltipAnimationSettings} from "./blazor-Tooltip";

/**
 * Interface for a class BlazorAnimation
 * @private
 */
export interface BlazorAnimationModel {

    /**
     * Animation settings to be applied on the Tooltip, while it is being shown over the target.
     * @ignoreapilink
     */
    open?: TooltipAnimationSettings;

    /**
     * Animation settings to be applied on the Tooltip, when it is closed.
     * @ignoreapilink
     */
    close?: TooltipAnimationSettings;

}

/**
 * Interface for a class BlazorTooltip
 * @private
 */
export interface BlazorTooltipModel {

}
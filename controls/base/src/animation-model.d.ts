import { createElement, selectAll, closest } from './dom';import { Base, EmitType } from './base';import { Browser } from './browser';import { EventHandler } from './event-handler';import { Property, NotifyPropertyChanges, INotifyPropertyChanged, Event } from './notify-property-change';
import {Effect,AnimationOptions} from "./animation";

/**
 * Interface for a class Animation
 */
export interface AnimationModel {

    /**
     * Specify the type of animation
     * @default : 'FadeIn';
     */
    name?: Effect;

    /**
     * Specify the duration to animate
     * @default : 400;
     */
    duration?: number;

    /**
     * Specify the animation timing function
     * @default : 'ease';
     */
    timingFunction?: string;

    /**
     * Specify the delay to start animation
     * @default : 0;
     */
    delay?: number;

    /**
     * Triggers when animation is in-progress
     * @event
     */
    progress?: EmitType<AnimationOptions>;

    /**
     * Triggers when the animation is started
     * @event
     */
    begin?: EmitType<AnimationOptions>;

    /**
     * Triggers when animation is completed
     * @event
     */
    end?: EmitType<AnimationOptions>;

    /**
     * Triggers when animation is failed due to any scripts
     * @event
     */
    fail?: EmitType<AnimationOptions>;

}
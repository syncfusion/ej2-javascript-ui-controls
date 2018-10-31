import { Base } from './base';import { Browser } from './browser';import { isVisible, matches } from './dom';import { Property, NotifyPropertyChanges, INotifyPropertyChanged, Event } from './notify-property-change';import { EventHandler } from './event-handler';import { compareElementParent } from './util';import {Coordinates, DropInfo} from './draggable';
import {DropEventArgs} from "./droppable";

/**
 * Interface for a class Droppable
 */
export interface DroppableModel {

    /**
     * Defines the selector for draggable element to be accepted by the droppable.
     */
    accept?: string;

    /**
     * Defines the scope value to group sets of draggable and droppable items. 
     * A draggable with the same scope value will only be accepted by the droppable.
     */
    scope?: string;

    /**
     * Specifies the callback function, which will be triggered while drag element is dropped in droppable.
     * @event
     */
    drop?: (args: DropEventArgs) => void;

    /**
     * Specifies the callback function, which will be triggered while drag element is moved over droppable element.
     * @event
     */
    over?: Function;

    /**
     * Specifies the callback function, which will be triggered while drag element is moved out of droppable element.
     * @event
     */
    out?: Function;

}
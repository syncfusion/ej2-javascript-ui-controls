import { Base } from './base';
import { Browser } from './browser';
import { isVisible, matches } from './dom';
import { Property, NotifyPropertyChanges, INotifyPropertyChanged, Event } from './notify-property-change';
import { EventHandler } from './event-handler';
import { compareElementParent } from './util';
import { DroppableModel } from './droppable-model';
import {Coordinates, DropInfo} from './draggable';
/**
 * Droppable arguments in drop callback.
 * @private
 */
export interface DropData {
    /**
     * Specifies that current element can be dropped.
     */
    canDrop: boolean;
    /**
     * Specifies target to drop.
     */
    target: HTMLElement;
}
export interface DropEvents extends MouseEvent, TouchEvent {
    dropTarget?: HTMLElement;
}
/**
 * Interface for drop event args 
 */
export interface DropEventArgs {
    /**
     * Specifies the original mouse or touch  event arguments.
     */
    event?: MouseEvent & TouchEvent;
    /**
     * Specifies the target element.
     */
    target?: HTMLElement;
    /**
     *  Specifies the dropped element.
     */
    droppedElement?: HTMLElement;
    /**
     * Specifies the dragData 
     */
    dragData?: DropInfo;
}
/**
 * Droppable Module provides support to enable droppable functionality in Dom Elements.
 * ```html
 * <div id='drop'>Droppable</div>
 * <script>
 * let ele:HTMLElement = document.getElementById('drop');
 * var drag:Droppable = new Droppable(ele,{
 *     accept:'.drop',
 *     drop: function(e) {
 *      //drop handler code.
 *     }
 * });
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class Droppable extends Base<HTMLElement> implements INotifyPropertyChanged {
    /**
     * Defines the selector for draggable element to be accepted by the droppable.
     */
    @Property()
    public accept: string;
    /**
     * Defines the scope value to group sets of draggable and droppable items. 
     * A draggable with the same scope value will only be accepted by the droppable.
     */
    @Property('default')
    public scope: string;
    /**
     * Specifies the callback function, which will be triggered while drag element is dropped in droppable.
     * @event
     */
    @Event()
    public drop: (args: DropEventArgs) => void;
    /**
     * Specifies the callback function, which will be triggered while drag element is moved over droppable element.
     * @event
     */
    @Event()
    public over: Function;
    /**
     * Specifies the callback function, which will be triggered while drag element is moved out of droppable element.
     * @event
     */
    @Event()
    public out: Function;
    private mouseOver: boolean = false;
    public dragData: { [key: string]: DropInfo } = {};
    constructor(element: HTMLElement, options?: DroppableModel) {
        super(options, element);
        this.bind();
    }
    protected bind(): void {
        this.wireEvents();
    }
    private wireEvents(): void {
        EventHandler.add(this.element, Browser.touchEndEvent, this.intDrop, this);
    }
    // triggers when property changed
    public onPropertyChanged(newProp: DroppableModel, oldProp: DroppableModel): void {
        //No Code to handle
    }
    public getModuleName(): string {
        return 'droppable';
    }
    private dragStopCalled: boolean = false;
    public intOver(event: MouseEvent & TouchEvent, element?: Element): void {
        if (!this.mouseOver) {
            let drag: DropInfo = this.dragData[this.scope];
            this.trigger('over', { event: event, target: element, dragData: drag });
            this.mouseOver = true;
        }
    }
    public intOut(event: MouseEvent & TouchEvent, element?: Element): void {
        if (this.mouseOver) {
            this.trigger('out', { evt: event, target: element });
            this.mouseOver = false;
        }
    }
    private intDrop(evt: MouseEvent & TouchEvent, element?: HTMLElement): void {
        if (!this.dragStopCalled) {
            return;
        } else {
            this.dragStopCalled = false;
        }
        let accept: boolean = true;
        let drag: DropInfo = this.dragData[this.scope];
        let isDrag: Boolean = drag ? (drag.helper && isVisible(drag.helper)) : false;
        let area: DropData;
        if (isDrag ) {
             area = this.isDropArea(evt, drag.helper, element);
             if (this.accept) {
                 accept = matches(drag.helper, this.accept);
             }
        }
        if (isDrag && this.drop && area.canDrop && accept) {
            this.trigger('drop', { event: evt, target: area.target, droppedElement: drag.helper, dragData: drag });
        }
        this.mouseOver = false;
    }
    private isDropArea(evt: MouseEvent & TouchEvent, helper: HTMLElement, element?: HTMLElement): DropData {
        let area: DropData = { canDrop: true, target: element || (<HTMLElement>evt.target) };
        let isTouch: boolean = evt.type === 'touchend';
        if ( isTouch || area.target === helper) {
            helper.style.display = 'none';
            let coord: Coordinates = isTouch ? (evt.changedTouches[0]) : evt;
            let ele: Element = document.elementFromPoint(coord.clientX, coord.clientY);
            area.canDrop = false;
            area.canDrop = compareElementParent(ele, this.element);
            if (area.canDrop) {
                area.target = <HTMLElement>ele;
            }
            helper.style.display = '';
        }
        return area;
    }
    public destroy(): void {
          EventHandler.remove(this.element, Browser.touchEndEvent, this.intDrop);
          super.destroy();
    }
}
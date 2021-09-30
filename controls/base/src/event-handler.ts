import { debounce, extend } from './util';
import { Browser } from './browser';

/**
 * EventHandler class provides option to add, remove, clear and trigger events to a HTML DOM element
 * ```html
 * <div id="Eventdiv">  </div>
 * <script>
 *   let node: HTMLElement = document.querySelector("#Eventdiv");
 *   EventHandler.addEventListener(node, "click", function(){
 *       // click handler function code
 *   });
 *   EventHandler.addEventListener(node, "onmouseover", function(){
 *       // mouseover handler function code
 *   });
 *   EventHandler.removeEventListener(node, "click", function(){
 *       // click handler function code
 *   });
 *   eventObj.clearEvents();
 * </script>
 * ```
 */
export class EventHandler {

    // to get the event data based on element
    private static addOrGetEventData(element: Element | HTMLElement | Document): EventOptions[] {
        if ('__eventList' in element) {
            return (<EventData>element).__eventList.events;
        } else {
            (<EventData>element).__eventList = {};
            return (<EventData>element).__eventList.events = [];
        }
    }

    /**
     * Add an event to the specified DOM element.
     *
     * @param {any} element - Target HTML DOM element
     * @param {string} eventName - A string that specifies the name of the event
     * @param {Function} listener - Specifies the function to run when the event occurs
     * @param {Object} bindTo - A object that binds 'this' variable in the event handler
     * @param {number} intDebounce - Specifies at what interval given event listener should be triggered.
     * @returns {Function} ?
     */
    public static add(
        element: Element | HTMLElement | Document,
        eventName: string,
        listener: Function,
        bindTo?: Object,
        intDebounce?: number): Function {
        const eventData: EventOptions[] = EventHandler.addOrGetEventData(element);
        let debounceListener: Function;
        if (intDebounce) {
            debounceListener = debounce(listener, intDebounce);
        } else {
            debounceListener = listener;
        }
        if (bindTo) {
            debounceListener = debounceListener.bind(bindTo);
        }
        const event: string[] = eventName.split(' ');
        for (let i: number = 0; i < event.length; i++) {
            eventData.push({
                name: event[i],
                listener: listener,
                debounce: debounceListener
            });
            if (Browser.isIE) {
                element.addEventListener(event[i], <EventListener>debounceListener);
            } else {
                element.addEventListener(event[i], <EventListener>debounceListener, { passive: false });
            }
        }
        return debounceListener;
    }

    /**
     * Remove an event listener that has been attached before.
     *
     * @param {any} element - Specifies the target html element to remove the event
     * @param {string} eventName - A string that specifies the name of the event to remove
     * @param {Function} listener - Specifies the function to remove
     * @returns {void} ?
     */
    public static remove(element: Element | HTMLElement | Document, eventName: string, listener: Function): void {
        const eventData: EventOptions[] = EventHandler.addOrGetEventData(element);
        const event: string[] = eventName.split(' ');
        for (let j: number = 0; j < event.length; j++) {
            let index: number = -1;
            let debounceListener: Function;
            if (eventData && eventData.length !== 0) {
                eventData.some((x: EventOptions, i: number) => {
                    return x.name === event[j] && x.listener === listener ?
                        (index = i, debounceListener = x.debounce, true) : false;
                });
            }
            if (index !== -1) {
                eventData.splice(index, 1);
            }
            if (debounceListener) {
                element.removeEventListener(event[j], <EventListener>debounceListener);
            }
        }
    }

    /**
     * Clear all the event listeners that has been previously attached to the element.
     *
     * @param {any} element - Specifies the target html element to clear the events
     * @returns {void} ?
     */
    public static clearEvents(element: Element): void {
        let eventData: EventOptions[];
        let copyData: EventOptions[];
        // eslint-disable-next-line
        eventData = EventHandler.addOrGetEventData(element);
        // eslint-disable-next-line
        copyData = extend([], copyData, eventData) as EventOptions[];
        for (let i: number = 0; i < copyData.length; i++) {
            element.removeEventListener(<string>copyData[i].name, <EventListener>copyData[i].debounce);
            eventData.shift();
        }
    }

    /**
     * Trigger particular event of the element.
     *
     * @param {any} element - Specifies the target html element to trigger the events
     * @param {string} eventName - Specifies the event to trigger for the specified element.
     * Can be a custom event, or any of the standard events.
     * @param {any} eventProp - Additional parameters to pass on to the event properties
     * @returns {void} ?
     */
    public static trigger(element: HTMLElement, eventName: string, eventProp?: Object): void {
        const eventData: EventOptions[] = EventHandler.addOrGetEventData(element);
        for (const event of eventData) {
            if (event.name === eventName) {
                event.debounce.call(this, eventProp);
            }
        }
    }
}

interface EventData extends Element {
    __eventList: EventList;
}

interface EventList {
    events?: EventOptions[];
}

interface EventOptions {
    name: string;
    listener: Function;
    debounce?: Function;
}

/**
 * Common Event argument for all base Essential JavaScript 2 Events.
 *
 * @private
 */
export interface BaseEventArgs {
    /**
     * Specifies name of the event.
     */
    name?: string;
}

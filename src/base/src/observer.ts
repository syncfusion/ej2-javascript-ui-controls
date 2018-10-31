
import { isNullOrUndefined, getValue } from './util';
/**
 * Observer is used to perform event handling based the object.
 * ```
 * //Creating observer instance.
 * let observer:Observer = Observer(this);
 * let handler: Function = (a:number, b: number): number => {return a + b; }
 * //add handler to event.
 * observe.on('eventname', handler);
 * //remove handler from event.
 * observe.off('eventname', handler);
 * //notify the handlers in event.
 * observe.notify('eventname');
 * ```
 * 
 */
export interface BoundOptions {
    handler?: Function;
    context?: Object;
    event?: string;
    id?: string;
}
export class Observer {
    private context: Object;
    private ranArray: string[] = [];
    private boundedEvents: { [key: string]: [BoundOptions] } = {};
    constructor(context?: Object) {
        if (isNullOrUndefined(context)) {
            return;
        }
        this.context = context;
    };
    /**
     * To attach handler for given property in current context.
     * @param {string} property - specifies the name of the event.
     * @param {Function} handler - Specifies the handler function to be called while event notified.
     * @param {Object} context - Specifies the context binded to the handler.
     * @param {string} id - specifies the random generated id.
     * @return {void}
     */
    public on(property: string, handler: Function, context?: Object, id?: string): void {
        if (isNullOrUndefined(handler)) {
            return;
        }
        let cntxt: Object = context || this.context;
        if (this.notExist(property)) {
            this.boundedEvents[property] = [{ handler: handler, context: cntxt }];
            return;
        }
        if (!isNullOrUndefined(id)) {
            if (this.ranArray.indexOf(id) === -1) {
                this.ranArray.push(id);
                this.boundedEvents[property].push({ handler: handler, context: cntxt, id: id });
            }
        } else if (!this.isHandlerPresent(this.boundedEvents[property], handler)) {
            this.boundedEvents[property].push({ handler: handler, context: cntxt });
        }
    }

    /**
     * To remove handlers from a event attached using on() function.
     * @param {string} eventName - specifies the name of the event.
     * @param {Function} handler - Optional argument specifies the handler function to be called while event notified.
     * @param {string} id - specifies the random generated id.
     * @return {void}
     */
    public off(property: string, handler?: Function, id?: string): void {
        if (this.notExist(property)) {
            return;
        }
        let curObject: BoundOptions[] = getValue(property, this.boundedEvents);
        if (handler) {
            for (let i: number = 0; i < curObject.length; i++) {
                if (id) {
                    if (curObject[i].id === id) {
                        curObject.splice(i, 1);
                        let indexLocation: number = this.ranArray.indexOf(id);
                        if (indexLocation !== -1) {
                            this.ranArray.splice(indexLocation, 1);
                        }
                        break;
                    }
                } else if (handler === curObject[i].handler) {
                    curObject.splice(i, 1);
                    break;
                }
            }
        } else {
            delete this.boundedEvents[property];
        }
    }

    /**
     * To notify the handlers in the specified event.
     * @param {string} property - Specifies the event to be notify.
     *  @param {Object} args - Additional parameters to pass while calling the handler.
     * @return {void}
     */
    public notify(property: string, argument?: Object): void {
        if (this.notExist(property)) {
            return;
        }
        if (argument) {
            (<{ name: string }>argument).name = property;
        }
        let curObject: BoundOptions[] = getValue(property, this.boundedEvents).slice(0);
        for (let cur of curObject) {
            cur.handler.call(cur.context, argument);
        }
    }
    /**
     * To destroy handlers in the event
     */
    public destroy(): void {
        this.boundedEvents = this.context = undefined;
    }
    /**
     * Returns if the property exists. 
     */
    private notExist(prop: string): boolean {
        return this.boundedEvents.hasOwnProperty(prop) === false;
    }
    /**
     * Returns if the handler is present.
     */
    private isHandlerPresent(boundedEvents: BoundOptions[], handler: Function): boolean {
        for (let cur of boundedEvents) {
            if (cur.handler === handler) {
                return true;
            }
        }
        return false;
    }
}

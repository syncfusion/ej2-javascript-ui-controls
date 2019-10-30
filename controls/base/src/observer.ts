import { isNullOrUndefined, getValue, extend, isBlazor } from './util';
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
     * @param {Object} args - Additional parameters to pass while calling the handler.
     * @param {Function} successHandler - this function will invoke after event successfully triggered
     * @param {Function} errorHandler - this function will invoke after event if it was failure to call.
     * @return {void}
     */
    public notify(property: string, argument?: Object, successHandler?: Function, errorHandler?: Function): void | Object {
        if (this.notExist(property)) {
            if (successHandler) {
                successHandler.call(this, argument);
            }
            return;
        }
        if (argument) {
            (<{ name: string }>argument).name = property;
        }
        let blazor: string = 'Blazor';
        let curObject: BoundOptions[] = getValue(property, this.boundedEvents).slice(0);
        if (isBlazor()) {
           return this.blazorCallback(curObject, argument, successHandler, errorHandler, 0);
        } else {
            for (let cur of curObject) {
                cur.handler.call(cur.context, argument);
            }
            if (successHandler) {
                successHandler.call(this, argument);
            }
        }
    }

    private blazorCallback(
        objs: BoundOptions[],
        argument: object,
        successHandler: Function,
        errorHandler: Function,
        index: number): void | object {
        let isTrigger: boolean = index === objs.length - 1;
        if (index < objs.length) {
            let obj: BoundOptions = objs[index];
            let promise: Promise<object> = obj.handler.call(obj.context, argument);
            if (promise && typeof promise.then === 'function') {
                if (!successHandler) {
                    return promise;
                }
                promise.then((data: object) => {
                    data = typeof data === 'string' && this.isJson(data) ? JSON.parse(data as string) : data;
                    extend(argument, argument, data, true);
                    if (successHandler && isTrigger) {
                        successHandler.call(obj.context, argument);
                    } else {
                        return this.blazorCallback(objs, argument, successHandler, errorHandler, index + 1);
                    }
                }).catch((data: object) => {
                    if (errorHandler) {
                        errorHandler.call(obj.context, typeof data === 'string' && this.isJson(data) ? JSON.parse(data) : data);
                    }
                });
            } else if (successHandler && isTrigger) {
                successHandler.call(obj.context, argument);
            } else {
                return this.blazorCallback(objs, argument, successHandler, errorHandler, index + 1);
            }
        }
    }

    public isJson(value: string): boolean {
        try {
            JSON.parse(value);
        } catch (e) {
            return false;
        }
        return true;
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
        return this.boundedEvents.hasOwnProperty(prop) === false || this.boundedEvents[prop].length <= 0;
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

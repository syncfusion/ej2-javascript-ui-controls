/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types */
import { EventEmitter } from '@angular/core';
import { isNullOrUndefined } from '@syncfusion/ej2-base';

/**
 * Angular Utility Module
 *
 * @param {Function} derivedClass The derived class to which mixins are applied.
 * @param {Function[]} baseClass An array of base classes whose methods are applied as mixins.
 * @returns {void}
 */
export function applyMixins(derivedClass: any, baseClass: any[]): void {
    baseClass.forEach((baseClass: any) => {
        Object.getOwnPropertyNames(baseClass.prototype).forEach((name: string) => {
            if (!Object.prototype.hasOwnProperty.call(derivedClass.prototype, name) || (baseClass.isFormBase && name !== 'constructor')) {
                derivedClass.prototype[`${name}`] = baseClass.prototype[`${name}`];
            }
        });
    });
}

/**
 * Decorator function to apply mixins to a derived class.
 *
 * @param {Function[]} baseClass - An array of mixin classes to be applied to the derived class.
 * @returns {ClassDecorator} The decorator function.
 */
export function ComponentMixins(baseClass: Function[]): ClassDecorator {
    return function (derivedClass: Function): void {
        applyMixins(derivedClass, baseClass);
    };
}

/**
 * Registers events.
 *
 * @private
 * @param {string[]} eventList - The list of events to register.
 * @param {any} obj - The object on which to register the events.
 * @param {boolean} [direct] - Whether to register events directly on the object or not.
 * @returns {void}
 */
export function registerEvents(eventList: string[], obj: any, direct?: boolean): void {
    const ngEventsEmitter: { [key: string]: Object } = {};
    if (eventList && eventList.length) {
        for (const event of eventList) {
            if (direct === true) {
                obj.propCollection[`${event}`] = new EventEmitter(false);
                obj[`${event}`] = obj.propCollection[`${event}`];
            } else {
                ngEventsEmitter[`${event}`] = new EventEmitter(false);
            }
        }
        if (direct !== true) {
            obj.setProperties(ngEventsEmitter, true);
        }
    }
}

/**
 * Clears registered templates.
 *
 * @private
 * @param {any} _this - The context object.
 * @param {string[]} [templateNames] - Optional. An array of template names to clear.
 * @param {any[]} [index] - Optional. An array of indices specifying templates to clear.
 * @returns {void}
 */
export function clearTemplate(_this: any, templateNames?: string[], index?: any): void {
    const regTemplates: string[] = Object.keys(_this.registeredTemplate);
    if (regTemplates.length) {
        /* istanbul ignore next */
        const regProperties: string[] = templateNames && templateNames.filter(
            (val: string) => {
                return (/\./g.test(val) ? false : true);
            });
        const tabaccordionTemp: boolean = /tab|accordion|toolbar/.test(_this.getModuleName?.());
        for (const registeredTemplate of (regProperties && regProperties || regTemplates)) {
            /* istanbul ignore next */
            if (index && index.length) {
                for (let e: number = 0; e < index.length; e++) {
                    if (tabaccordionTemp) {
                        for (let m: number = 0; m < _this.registeredTemplate[`${registeredTemplate}`].length; m++) {
                            const value: any = _this.registeredTemplate[`${registeredTemplate}`][parseInt(m.toString(), 10)];
                            if (value && value === index[`${e}`]) {
                                value.destroy();
                                _this.registeredTemplate[`${registeredTemplate}`].splice(m, 1);
                            }
                        }
                    } else {
                        for (let m: number = 0; m < _this.registeredTemplate.template.length; m++) {
                            const value: any = _this.registeredTemplate.template[parseInt(m.toString(), 10)].rootNodes[0];
                            if (value === index[`${e}`]) {
                                const rt: any = _this.registeredTemplate[`${registeredTemplate}`];
                                rt[parseInt(m.toString(), 10)].destroy();
                            }
                        }
                    }
                }
            } else {
                if (_this.registeredTemplate[`${registeredTemplate}`]) {
                    for (const rt of _this.registeredTemplate[`${registeredTemplate}`]) {
                        if (!rt.destroyed) {
                            if (rt._view) {
                                const pNode: any = rt._view.renderer.parentNode(rt.rootNodes[0]);
                                if (!isNullOrUndefined(pNode)) {
                                    for (let m: number = 0; m < rt.rootNodes.length; m++) {
                                        pNode.appendChild(rt.rootNodes[parseInt(m.toString(), 10)]);
                                    }
                                }
                            }
                            rt.destroy();
                        }
                    }
                }
            }
            if (!tabaccordionTemp || !index) {
                delete _this.registeredTemplate[`${registeredTemplate}`];
            }
        }
    }
    for (const tagObject of _this.tagObjects) {
        if (tagObject.instance) {
            /* istanbul ignore next */
            tagObject.instance.clearTemplate((templateNames && templateNames.filter(
                (val: string) => {
                    const regExp: RegExpConstructor = RegExp;
                    return (new regExp(tagObject.name).test(val) ? true : false);
                })));
        }
    }
}

/**
 * To set value for the nameSpace in desired object.
 *
 * @param {string} nameSpace - String value to get the inner object.
 * @param {any} value - Value that you need to set.
 * @param {any} object - Object to get the inner object value.
 * @returns {void}
 * @private
 */
export function setValue(nameSpace: string, value: any, object: any): any {
    const keys: string[] = nameSpace.replace(/\[/g, '.').replace(/\]/g, '').split('.');
    /* istanbul ignore next */
    let fromObj: any = object || {};
    for (let i: number = 0; i < keys.length; i++) {
        const key: string = keys[parseInt(i.toString(), 10)];
        if (i + 1 === keys.length) {
            fromObj[`${key}`] = value === undefined ? {} : value;
        } else if (fromObj[`${key}`] === undefined) {
            fromObj[`${key}`] = {};
        }
        fromObj = fromObj[`${key}`];
    }
    return fromObj;
}




export interface PropertyCollectionInfo {
    props: PropertyDetails[];
    complexProps: PropertyDetails[];
    colProps: PropertyDetails[];
    events: PropertyDetails[];
    propNames: string[];
    complexPropNames: string[];
    colPropNames: string[];
    eventNames: string[];
}

export interface PropertyDetails {
    propertyName: string;
    type: FunctionConstructor | Object;
    defaultValue: Object;
}

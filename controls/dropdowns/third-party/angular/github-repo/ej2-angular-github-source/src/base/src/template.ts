/* eslint-disable @typescript-eslint/no-explicit-any */
import { ViewContainerRef, EmbeddedViewRef, ElementRef, TemplateRef } from '@angular/core';
import { setTemplateEngine, getTemplateEngine } from '@syncfusion/ej2-base';
import { setValue, getValue } from '@syncfusion/ej2-base';

const stringCompiler: (template: string | Function, helper?: object) => (data: Object | JSON) => string = getTemplateEngine();

/**
 * Angular Template Compiler
 *
 * @param {AngularElementType} templateEle - The element representing the template.
 * @param {Object} [helper] - Optional helper object.
 * @returns {Function} A function that compiles the template.
 */
export function compile(templateEle: AngularElementType, helper?: Object):

(data: Object | JSON, component?: any, propName?: any) => Object {
    if (typeof templateEle === 'string' || (typeof templateEle === 'function' && (templateEle as Function).prototype && (templateEle as Function).prototype.CSPTemplate)) {
        return stringCompiler(templateEle, helper);
    } else {
        const contRef: ViewContainerRef = templateEle.elementRef.nativeElement._viewContainerRef;
        const pName: string = templateEle.elementRef.nativeElement.propName;
        return (data: Object, component?: any, propName?: any): Object => {
            const context: Object = { $implicit: data };
            /* istanbul ignore next */
            const conRef: ViewContainerRef = contRef ? contRef : component.viewContainerRef;
            const viewRef: EmbeddedViewRef<Object> = conRef.createEmbeddedView(templateEle as TemplateRef<Object>, context);
            if (/EJS-MENTION|EJS-DROPDOWNLIST/.test(getValue('currentInstance.element.nodeName', conRef)) ||
            (/E-TABITEM/.test(getValue('element.nativeElement.nodeName', conRef)) &&
            getValue('currentInstance.headerTemplateRef', conRef))) {
                viewRef.detectChanges();
            } else {
                viewRef.markForCheck();
            }
            /* istanbul ignore next */
            const viewCollection: { [key: string]: EmbeddedViewRef<Object>[] } = (component && component.registeredTemplate) ?
                component.registeredTemplate : getValue('currentInstance.registeredTemplate', conRef);
            propName = (propName && component.registeredTemplate) ? propName : pName;
            if (typeof viewCollection[`${propName}`] === 'undefined') {
                viewCollection[`${propName}`] = [];
            }
            viewCollection[`${propName}`].push(viewRef);
            return viewRef.rootNodes;
        };
    }
}

/**
 * Property decorator for angular.
 *
 * @param {Object} [defaultValue] - Default value for the property.
 * @returns {PropertyDecorator} The decorator function.
 */
export function Template(defaultValue?: Object): PropertyDecorator {
    return (target: Object, key: string) => {
        const propertyDescriptor: Object = {
            set: setter(key),
            get: getter(key, defaultValue),
            enumerable: true,
            configurable: true
        };
        Object.defineProperty(target, key, propertyDescriptor);
    };
}

/**
 * Creates a setter function for a given property key.
 *
 * @param {string} key - The property key.
 * @returns {Function} The setter function.
 */
function setter(key: string): Function {
    return function (val: any): void {
        if (val === undefined) { return; }
        setValue(key + 'Ref', val, this);
        if (typeof val !== 'string' && !(typeof val === 'function' && (val as Function).prototype && (val as Function).prototype.CSPTemplate)) {
            (val as any).elementRef.nativeElement._viewContainerRef = this.viewContainerRef;
            (val as any).elementRef.nativeElement.propName = key;
        } else {
            if (this.saveChanges) {
                this.saveChanges(key, val, undefined);
                this.dataBind();
            }
        }
    };
}

/**
 * Returns a getter function for the specified key and default value.
 *
 * @param {string} key - The key for the property.
 * @param {Object} defaultValue - The default value for the property.
 * @returns {Function} The getter function.
 */
function getter(key: string, defaultValue: Object): Function {
    return function (): Object {
        /* istanbul ignore next */
        return getValue(key + 'Ref', this) || defaultValue;
    };
}

export interface AngularElementType {
    elementRef: ElementRef;
}


setTemplateEngine({ compile: (compile as any) });

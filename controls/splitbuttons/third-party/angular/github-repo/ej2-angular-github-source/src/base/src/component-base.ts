/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types */
/**
 * Angular Component Base Module
 */
import { getValue, isUndefined, setValue, isNullOrUndefined, attributes, createElement } from '@syncfusion/ej2-base';
import { EventEmitter, EmbeddedViewRef, Renderer2, ElementRef } from '@angular/core';
import { clearTemplate, registerEvents } from './util';

export interface IComponentBase {
    registerEvents: (eventList: string[]) => void;
    addTwoWay: (propList: string[]) => void;
}

interface Tag {
    hasChanges: boolean;
    getProperties?: Function;
    isInitChanges: boolean;
    hasNewChildren: boolean;
    list: TagList[];
    clearTemplate?: (arg: string[]) => void;
}

interface TagList {
    getProperties: Function;
    hasChanges: boolean;
    isUpdated: boolean;
}

export class ComponentBase<T> {
    public element: HTMLElement;
    public tags: string[];
    private ngAttr: string;
    private srenderer: Renderer2;
    protected isProtectedOnChange: boolean = true;
    private isAngular: boolean;
    private isFormInit: boolean = true;
    private componentType: T;
    public preventChange: boolean;
    public isPreventChange: boolean;
    protected oldProperties: { [key: string]: Object };
    protected changedProperties: { [key: string]: Object };
    protected finalUpdate: Function;
    protected isUpdated: boolean;
    public ngEle: ElementRef;

    private tagObjects: { name: string, instance: Tag }[];
    public onPropertyChanged: (newProp: Object, oldProp: Object) => void;
    public appendTo: (ele: string | HTMLElement) => void;
    public setProperties: (obj: Object, muteOnChange: boolean) => void;
    public properties: Object;
    public dataBind: Function;
    private createElement: Function;
    protected saveChanges(key: string, newValue: Object, oldValue: Object): void {
        if (this.isProtectedOnChange) { return; }
        this.oldProperties[`${key}`] = oldValue;
        this.changedProperties[`${key}`] = newValue;
        this.finalUpdate();
        const changeTime: any = setTimeout(this.dataBind.bind(this));
        const clearUpdate: Function = () => {
            clearTimeout(changeTime);
        };
        this.finalUpdate = clearUpdate;
    }

    public destroy: Function;
    private registeredTemplate: { [key: string]: EmbeddedViewRef<Object>[] };
    private complexTemplate: string[];

    private ngBoundedEvents: { [key: string]: Map<object, object> };
    public ngOnInit(isTempRef?: any): void {
        const tempOnThis: any = isTempRef || this;
        tempOnThis.registeredTemplate = {};
        tempOnThis.ngBoundedEvents = {};
        tempOnThis.isAngular = true;
        tempOnThis.isFormInit = true;
        /* istanbul ignore next */
        if (isTempRef) {
            this.tags = isTempRef.tags;
        }
        tempOnThis.tags = this.tags || [];
        tempOnThis.complexTemplate = this.complexTemplate || [];
        tempOnThis.tagObjects = [];
        tempOnThis.ngAttr = this.getAngularAttr(tempOnThis.element);
        /* istanbul ignore next */
        tempOnThis.createElement = (tagName: string, prop?:
        { id?: string, className?: string, innerHTML?: string, styles?: string, attrs?: { [key: string]: string } }) => {
            const ele: Element = tempOnThis.srenderer ? tempOnThis.srenderer.createElement(tagName) : createElement(tagName);
            if (typeof (prop) === 'undefined') {
                return <HTMLElement>ele;
            }
            ele.innerHTML = (prop.innerHTML ? prop.innerHTML : '');

            if (prop.className !== undefined) {
                ele.className = prop.className;
            }
            if (prop.id !== undefined) {
                ele.id = prop.id;
            }
            if (prop.styles !== undefined) {
                ele.setAttribute('style', prop.styles);
            }
            if (tempOnThis.ngAttr !== undefined) {
                ele.setAttribute(tempOnThis.ngAttr, '');
            }
            if (prop.attrs !== undefined) {
                attributes(ele, prop.attrs);
            }
            return <HTMLElement>ele;
        };
        for (const tag of tempOnThis.tags) {
            const tagObject: { name: string, instance: Tag } = {
                instance: getValue('child' + tag.substring(0, 1).toUpperCase() + tag.substring(1), tempOnThis),
                name: tag
            };
            tempOnThis.tagObjects.push(tagObject);
        }

        let complexTemplates: string[] = Object.keys(tempOnThis);
        for (let i: number = 0; i < complexTemplates.length; i++) {
            const compProp: any = getValue(complexTemplates[parseInt(i.toString(), 10)], tempOnThis);
            if (typeof compProp === 'object' && compProp && compProp.elementRef) {
                if (typeof compProp === 'object' && compProp && compProp.elementRef && complexTemplates[parseInt(i.toString(), 10)].indexOf('_') !== -1 && complexTemplates[parseInt(i.toString(), 10)].indexOf('Ref') === -1) {
                    setValue(complexTemplates[parseInt(i.toString(), 10)] + 'Ref', compProp, tempOnThis);
                }
                if (tempOnThis.viewContainerRef && !getValue('_viewContainerRef', compProp.elementRef.nativeElement) && !getValue('propName', compProp.elementRef.nativeElement)) {
                    setValue('_viewContainerRef', tempOnThis.viewContainerRef, compProp.elementRef.nativeElement);
                    setValue('propName', complexTemplates[parseInt(i.toString(), 10)].replace('Ref', ''), compProp.elementRef.nativeElement);
                }
            }
        }
        complexTemplates = Object.keys(tempOnThis);
        complexTemplates = complexTemplates.filter((val: string): boolean => {
            return /Ref$/i.test(val) && /_/i.test(val);
        });
        for (const tempName of complexTemplates) {
            const propName: string = tempName.replace('Ref', '');
            const val: Object = {};
            setValue(propName.replace('_', '.'), getValue(propName, tempOnThis), val);
            tempOnThis.setProperties(val, true);
        }
    }

    public getAngularAttr(ele: Element): string {
        const attributes: NamedNodeMap = ele.attributes;
        const length: number = attributes.length;
        let ngAr: string;
        for (let i: number = 0; i < length; i++) {
            /* istanbul ignore next */
            if (/_ngcontent/g.test(attributes[parseInt(i.toString(), 10)].name)) {
                ngAr = attributes[parseInt(i.toString(), 10)].name;
            }
        }
        return ngAr;
    }

    public ngAfterViewInit(isTempRef?: any): void {
        const tempAfterViewThis: any = isTempRef || this;
        const regExp: RegExp = /ejs-tab|ejs-accordion/g;
        /* istanbul ignore next */
        if (regExp.test(tempAfterViewThis.ngEle.nativeElement.outerHTML)) {
            tempAfterViewThis.ngEle.nativeElement.style.visibility = 'hidden';
        }

        /**
         * Root level template properties are not getting rendered,
         * Due to ngonchanges not get triggered.
         * so that we have set template value for root level template properties,
         * for example: refer below syntax
         * ```html
         * <ejs-grid>
         * <e-column></e-column>
         * <ng-template #editSettingsTemplate></ng-template>
         * </ejs-grid>
         * ```
         */
        let templateProperties: string[] = Object.keys(tempAfterViewThis);
        templateProperties = templateProperties.filter((val: string): boolean => {
            return /Ref$/i.test(val);
        });
        const ngtempRef: boolean = tempAfterViewThis.getModuleName() === 'DocumentEditor';
        for (const tempName of templateProperties) {
            const propName: string = tempName.replace('Ref', '');
            setValue(propName.replace('_', '.'), getValue(propName + 'Ref', tempAfterViewThis), tempAfterViewThis);
        }
        // Used setTimeout for template binding
        // Refer Link: https://github.com/angular/angular/issues/6005
        const appendToComponent: any = (tempAfterViewThis: any) => {
            /* istanbul ignore else  */
            if (typeof window !== 'undefined' && tempAfterViewThis.element) {
                tempAfterViewThis.appendTo(tempAfterViewThis.element);
                tempAfterViewThis.ngEle.nativeElement.style.visibility = '';
            }
        };
        if (!ngtempRef && !tempAfterViewThis.getModuleName().includes('btn')) {
            setTimeout(() => {
                appendToComponent(tempAfterViewThis);
            });
        } else {
            appendToComponent(tempAfterViewThis);
        }
    }

    public baseDestroy(isTempRef?: any): void {
        const tempOnDestroyThis: any = isTempRef || this;
        /* istanbul ignore else  */
        setTimeout(() => {
            if (typeof window !== 'undefined' && (tempOnDestroyThis.element.classList.contains('e-control'))) {
                if (tempOnDestroyThis.ngOnFocus !== undefined && tempOnDestroyThis.ngOnBlur !== undefined) {
                    const ele: HTMLElement = tempOnDestroyThis.inputElement || tempOnDestroyThis.element;
                    ele.removeEventListener('focus', tempOnDestroyThis.ngOnFocusBound);
                    ele.removeEventListener('blur', tempOnDestroyThis.ngOnBlurBound);
                    tempOnDestroyThis.ngOnFocusBound = null;
                    tempOnDestroyThis.ngOnBlurBound = null;
                }
                tempOnDestroyThis.destroy();
                tempOnDestroyThis.clearTemplate(null);
                // removing bounded events and tagobjects from component after destroy
                setTimeout(function (): any {
                    for (const key of Object.keys(tempOnDestroyThis)) {
                        const value: any = tempOnDestroyThis[`${key}`];
                        if (value && /object/.test(typeof value) && Object.keys(value).length !== 0) {
                            if (/properties|changedProperties|childChangedProperties|oldProperties|moduleLoader/.test(key)) {
                                for (const propKey of Object.keys(tempOnDestroyThis[`${key}`])) {
                                    const propValue: any = value[`${propKey}`];
                                    if (propValue && /object/.test(typeof propValue) && Object.keys(propValue).length !== 0 && (propValue.parent || propValue.parentObj)) {
                                        tempOnDestroyThis[`${key}`][`${propKey}`] = null;
                                    }
                                }
                            }
                            else {
                                if (value.parent || value.parentObj) {
                                    tempOnDestroyThis[`${key}`] = null;
                                }
                            }
                        }
                    }
                });
            }
        });
    }


    public ngOnDestroy(isTempRef?: any): void {
        this.baseDestroy(isTempRef);
    }

    public clearTemplate(templateNames?: string[], index?: any): void {
        clearTemplate(this, templateNames, index);
    }

    public ngAfterContentChecked(isTempRef?: any): void {
        const tempAfterContentThis: any = isTempRef || this;
        for (const tagObject of tempAfterContentThis.tagObjects) {
            if (!isUndefined(tagObject.instance) &&
                (tagObject.instance.isInitChanges || tagObject.instance.hasChanges || tagObject.instance.hasNewChildren)) {
                const propObj: { [key: string]: Object } = {};
                if (tagObject.instance.isInitChanges) {
                    // For angular 9 compatibility
                    // Not able to get complex directive properties reference ni Onint hook
                    // So we have constructed property here and used
                    let complexDirProps: any;
                    const list: any = getValue('instance.list', tagObject);
                    if (list && list.length) {
                        complexDirProps = list[0].directivePropList;
                    }
                    let skip: any = true;
                    if ((tempAfterContentThis as any).getModuleName && (tempAfterContentThis as any).getModuleName() === 'gantt') {
                        skip = false;
                    }
                    if (complexDirProps && skip && complexDirProps.indexOf(tagObject.instance.propertyName) === -1) {
                        const compDirPropList: any = Object.keys(tagObject.instance.list[0].propCollection);
                        for (let h: number = 0; h < tagObject.instance.list.length; h++) {
                            tagObject.instance.list[`${h}`].propCollection[tagObject.instance.propertyName] = [];
                            const obj: any = {};
                            for (let k: number = 0; k < compDirPropList.length; k++) {
                                const complexPropName: any = compDirPropList[parseInt(k.toString(), 10)];
                                obj[`${complexPropName}`] = tagObject.instance.list[`${h}`].propCollection[`${complexPropName}`];
                            }
                            for (let i: number = 0; i < tagObject.instance.list[`${h}`].tags.length; i++) {
                                const tag: any = tagObject.instance.list[`${h}`].tags[parseInt(i.toString(), 10)];
                                const childObj: any = getValue('child' + tag.substring(0, 1).toUpperCase() + tag.substring(1), tagObject.instance.list[`${h}`]);
                                if (childObj) {
                                    const innerchildObj: any = tagObject.instance.list[`${h}`]['child' + tag.substring(0, 1).toUpperCase() + tag.substring(1)];
                                    // Update the inner child tag objects
                                    const updateChildTag: any = (innerchild: any) => {
                                        const innerLevelTag: any = [];
                                        if (innerchild) {
                                            for (let j: number = 0; j < innerchild.list.length; j++) {
                                                const innerTag: any = innerchild.list[0].tags[0];
                                                if (innerTag) {
                                                    const innerchildTag: any = getValue('child' + innerTag.substring(0, 1).toUpperCase() + innerTag.substring(1), innerchild.list[parseInt(j.toString(), 10)]);
                                                    if (innerchildTag) {
                                                        innerchild.list[parseInt(j.toString(), 10)].tagObjects
                                                            .push({ instance: innerchildTag, name: innerTag });
                                                        innerLevelTag.push(innerchildTag);
                                                    }
                                                }
                                            }
                                        }
                                        // check for inner level tag
                                        if (innerLevelTag.length !== 0) {
                                            for (let l: number = 0; l < innerLevelTag.length; l++) {
                                                updateChildTag(innerLevelTag[parseInt(l.toString(), 10)]);
                                            }
                                        }
                                    };
                                    updateChildTag(innerchildObj);
                                    tagObject.instance.list[`${h}`].tagObjects.push({ instance: childObj, name: tag });
                                }
                            }
                            tagObject.instance.list[`${h}`].propCollection[tagObject.instance.propertyName].push(obj);
                        }
                    }
                    // End angular 9 compatibility
                    propObj[tagObject.name] = tagObject.instance.getProperties();
                    tempAfterContentThis.setProperties(propObj, tagObject.instance.isInitChanges);
                } else {
                    /* istanbul ignore next */
                    let hasDiffLength: boolean = false;
                    if ((tempAfterContentThis[tagObject.name].length !== tagObject.instance.list.length) || (/diagram|DashboardLayout/.test(tempAfterContentThis.getModuleName()))) {
                        tempAfterContentThis[tagObject.name] = tagObject.instance.list;
                        hasDiffLength = true;
                    }
                    for (const list of tagObject.instance.list) {
                        if (list.tags) {
                            for (const tag of list.tags) {
                                const innerChild: any = getValue('child' + tag.substring(0, 1).toUpperCase() + tag.substring(1), list);
                                if (innerChild) {
                                    list.tagObjects.push({ instance: innerChild, name: tag });
                                }
                            }
                        }
                        const curIndex: number = tagObject.instance.list.indexOf(list);
                        const curChild: any = getValue(tagObject.name, tempAfterContentThis)[`${curIndex}`];
                        let complexTemplates: string[] = Object.keys(curChild);
                        complexTemplates = complexTemplates.filter((val: string): boolean => {
                            return /Ref$/i.test(val);
                        });
                        if (curChild.properties && Object.keys(curChild.properties).length !== 0){
                            for (let complexPropName of complexTemplates) {
                                complexPropName = complexPropName.replace(/Ref/, '');
                                curChild.properties[`${complexPropName}`] = !curChild.properties[`${complexPropName}`] ?
                                    curChild.propCollection[`${complexPropName}`] : curChild.properties[`${complexPropName}`];
                            }
                        }
                        if (!isUndefined(curChild) && !isUndefined(curChild.setProperties)) {
                            if (/diagram|DashboardLayout/.test(tempAfterContentThis.getModuleName())) {
                                curChild.setProperties(list.getProperties(), true);
                            } else {
                                curChild.setProperties(list.getProperties());
                            }
                        }
                        list.isUpdated = true;
                    }
                    if ((/grid/.test(tempAfterContentThis.getModuleName()) && hasDiffLength) || /chart/.test(tempAfterContentThis.getModuleName())) {
                        propObj[tagObject.name] = tagObject.instance.getProperties();
                        tempAfterContentThis.setProperties(propObj, tagObject.instance.isInitChanges);
                    }
                }
            }
        }
    }

    protected registerEvents(eventList: string[]): void {
        registerEvents(eventList, this);
    }

    protected twoWaySetter(newVal: Object, prop: string): void {
        const oldVal: Object = getValue(prop, this.properties);
        if (oldVal === newVal) {
            return;
        }
        this.saveChanges(prop, newVal, oldVal);
        setValue(prop, (isNullOrUndefined(newVal) ? null : newVal), this.properties);
        getValue(prop + 'Change', this).emit(newVal);
    }

    protected addTwoWay(propList: string[]): void {
        for (const prop of propList) {
            getValue(prop, this);
            Object.defineProperty(this, prop, {
                get: () => {
                    return getValue(prop, this.properties);
                },
                set: (newVal: Object) => this.twoWaySetter(newVal, prop)
            });
            setValue(prop + 'Change', new EventEmitter(), this);
        }
    }

    public addEventListener(eventName: string, handler: Function): void {
        const eventObj: EventEmitter<Object> = getValue(eventName, this);
        if (!isUndefined(eventObj)) {
            if (!this.ngBoundedEvents[`${eventName}`]) {
                this.ngBoundedEvents[`${eventName}`] = new Map();
            }
            this.ngBoundedEvents[`${eventName}`].set(handler, eventObj.subscribe(handler));
        }
    }

    public removeEventListener(eventName: string, handler: Function): void {
        const eventObj: EventEmitter<Object> = getValue(eventName, this);
        if (!isUndefined(eventObj)) {
            (<EventEmitter<object>>this.ngBoundedEvents[`${eventName}`].get(handler)).unsubscribe();
        }
    }

    public trigger(eventName: string, eventArgs: Object, success?: Function): void {

        const eventObj: { next: Function } = getValue(eventName, this);

        const prevDetection: boolean = this.isProtectedOnChange;
        this.isProtectedOnChange = false;

        if (eventArgs) {
            (<{ name: string }>eventArgs).name = eventName;
        }

        if (!isUndefined(eventObj)) {
            eventObj.next(eventArgs);
        }
        const localEventObj: Function = getValue('local' + eventName.charAt(0).toUpperCase() + eventName.slice(1), this);
        if (!isUndefined(localEventObj)) {
            localEventObj.call(this, eventArgs);
        }

        this.isProtectedOnChange = prevDetection;
        /* istanbul ignore else  */
        if (success) {
            this.preventChange = this.isPreventChange;
            success.call(this, eventArgs);
        }
        this.isPreventChange = false;

    }

}

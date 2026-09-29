/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryList, SimpleChanges, SimpleChange, EmbeddedViewRef } from '@angular/core';
import { getValue, setValue, isNullOrUndefined } from '@syncfusion/ej2-base';
import { clearTemplate, registerEvents } from './util';

const refRegex: RegExp = /Ref$/;

/**
 * Complex Array Base module
 */

export interface IChildChange {
    dirIndex: number;
    change: Object;
}

interface Tag {
    hasChanges: boolean;
    getProperties: Function;
    isInitChanges: boolean;
    clearTemplate?: (args: string[]) => void;
}

export class ComplexBase<T> {
    public isUpdated: boolean;
    public hasChanges?: boolean = false;
    public dirIndex?: number;
    public propCollection?: { [key: string]: Object } = {};
    public dataSource?: { [key: string]: Object } = {};
    public property?: string;
    public tags?: string[] = [];
    public isInitChanges: boolean;
    private tagObjects?: { name: string, instance: Tag }[] = [];
    private registeredTemplate: { [key: string]: EmbeddedViewRef<Object>[] };
    private componentType: T;
    public directivePropList: any;
    public ngOnInit(): void {
        this.registeredTemplate = {};
        for (const tag of this.tags) {
            const objInstance: Tag = getValue('child' + tag.substring(0, 1).toUpperCase() + tag.substring(1), this);
            if (objInstance) {
                this.tagObjects.push({ instance: objInstance, name: tag });
            }
        }
        let templateProperties: string[] = Object.keys(this);
        for (let i: number = 0; i < templateProperties.length; i++) {
            const tempProp: any = getValue(templateProperties[parseInt(i.toString(), 10)], this);
            if (typeof tempProp === 'object' && tempProp && tempProp.elementRef) {
                if (!getValue(templateProperties[parseInt(i.toString(), 10)].indexOf('Ref') !== -1 ? templateProperties[parseInt(i.toString(), 10)] : templateProperties[parseInt(i.toString(), 10)] + 'Ref', this)) {
                    setValue(templateProperties[parseInt(i.toString(), 10)].indexOf('Ref') !== -1 ? templateProperties[parseInt(i.toString(), 10)] : templateProperties[parseInt(i.toString(), 10)] + 'Ref', tempProp, this);
                }
                if (getValue('viewContainerRef', this) && !getValue('_viewContainerRef', tempProp.elementRef.nativeElement) && !getValue('propName', tempProp.elementRef.nativeElement)) {
                    setValue('_viewContainerRef', getValue('viewContainerRef', this), tempProp.elementRef.nativeElement);
                    setValue('propName', templateProperties[parseInt(i.toString(), 10)].replace('Ref', ''), tempProp.elementRef.nativeElement);
                }
            }
        }
        templateProperties = Object.keys(this);
        templateProperties = templateProperties.filter((val: string): boolean => {
            return /Ref$/i.test(val);
        });
        for (const tempName of templateProperties) {
            const propName: string = tempName.replace('Ref', '');
            setValue(propName.replace('_', '.'), getValue(propName, this), this.propCollection);
        }

        // Angular 9 compatibility to overcome ngOnchange not get triggered issue
        // To Update properties to "this.propCollection"
        const propList: string[] = Object.keys(this);
        /* istanbul ignore next */
        if (this.directivePropList) {
            for (let k: number = 0; k < this.directivePropList.length; k++) {
                const dirPropName: string = this.directivePropList[parseInt(k.toString(), 10)];
                if (propList.indexOf(dirPropName) !== -1  && (getValue(dirPropName, this) === false || getValue(dirPropName, this))) {
                    setValue(dirPropName, getValue(dirPropName, this), this.propCollection);
                }
            }
            this.hasChanges = true;
        }
        this.isInitChanges = true;
    }

    protected registerEvents(eventList: string[]): void {
        registerEvents(eventList, this, true);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        for (const propName of Object.keys(changes)) {
            const changedVal: SimpleChange = changes[`${propName}`];
            this.propCollection[`${propName}`] = changedVal.currentValue;
        }
        this.isUpdated = false;
        this.hasChanges = true;
    }
    /* istanbul ignore next */
    public clearTemplate(templateNames: string[]): void {
        clearTemplate(this, templateNames);
    }

    public getProperties(): { [key: string]: Object } {
        /* istanbul ignore next */
        for (const tagObject of this.tagObjects) {
            this.propCollection[tagObject.name] = tagObject.instance.getProperties();
        }
        return this.propCollection;
    }

    public isChanged(): boolean {
        let result: boolean = this.hasChanges;
        if (!isNullOrUndefined(this.propCollection[this.property])) {
            const tempProps: any = this.propCollection[this.property];
            const props: string[] = Object.keys(tempProps[0]);
            for (let d: number = 0; d < props.length; d++) {
                if (!isNullOrUndefined(this.propCollection[props[parseInt(d.toString(), 10)]])) {
                    const val: any = getValue(props[parseInt(d.toString(), 10)], this);
                    const propVal: any = (this.propCollection[this.property] as any)[0][props[parseInt(d.toString(), 10)]];
                    if (!isNullOrUndefined(val) && this.propCollection[props[parseInt(d.toString(), 10)]] !== val
                    && propVal !== val) {
                        setValue(props[parseInt(d.toString(), 10)], val, (this.propCollection[this.property] as any)[0]);
                        setValue(props[parseInt(d.toString(), 10)], val, this.propCollection);
                        this.hasChanges = true;
                        this.isUpdated = false;
                    }

                }
            }
        }
        /* istanbul ignore next */
        for (const item of this.tagObjects) {
            result = result || item.instance.hasChanges;
        }
        return result || this.hasChanges;
    }

    public ngAfterContentChecked(): void {
        this.hasChanges = this.isChanged();
        if (this.isInitChanges || this.hasChanges){
            let templateProperties: string[] = Object.keys(this);
            templateProperties = templateProperties.filter((val: string) => {
                return refRegex.test(val);
            });
            for (const tempName of templateProperties) {
                const propName: string = tempName.replace('Ref', '');
                setValue(propName.replace('_', '.'), getValue(propName, this), this.propCollection);
            }
        }
    }

    public ngAfterViewChecked(): void {
        /* istanbul ignore next */
        if (this.isUpdated) {
            this.hasChanges = false;
        }
    }

    public ngAfterViewInit(): void {
        /* istanbul ignore next */
        this.isInitChanges = false;
    }

    public ngOnDestroy(): void {
        /* istanbul ignore next */
        this.directivePropList = [];
    }

}

export class ArrayBase<T> {
    public isInitChanges: boolean;
    public list: T[] & ComplexBase<T>[] = [];
    public children: QueryList<T>;
    public hasChanges: boolean = false;
    private propertyName: string;
    public hasNewChildren: boolean;

    constructor(propertyName: string) {
        this.propertyName = propertyName;
    }

    public ngOnInit(): void {
        this.isInitChanges = true;
    }

    public ngAfterContentInit(): void {
        let index: number = 0;
        /* istanbul ignore next */
        this.list = this.children.map((child: T & ComplexBase<T>) => {
            child.dirIndex = index++;
            child.property = this.propertyName;
            return child;
        });
        this.hasChanges = true;
    }

    public getProperties(): Object[] {
        const onlyProp: Object[] = [];
        for (const item of this.list) {
            onlyProp.push((<{ getProperties: Function }>item).getProperties());
        }
        return onlyProp;
    }

    public isChanged(): boolean {
        let result: boolean = false;
        let index: number = 0;
        let isSourceChanged: boolean = false;
        const childrenDataSource: any = this.children.map(
            (child: T & ComplexBase<T>) => {
                return child;
            }
        );

        // Check if any child in list is no longer in children (stale reference detection)
        // For column properties where *ngIf can cause stale references
        let hasStaleChildren: boolean = false;
        const isRelevantProperty: boolean = this.propertyName && (this.propertyName === 'columns' ||
                                                       this.propertyName === 'aggregates');
        if (this.list.length > 0 && isRelevantProperty) {
            for (let s: number = 0; s < this.list.length; s++) {
                let childExists: boolean = false;
                for (let t: number = 0; t < this.children.length; t++) {
                    if (this.list[parseInt(s.toString(), 10)] === this.children.toArray()[parseInt(t.toString(), 10)]) {
                        childExists = true;
                        break;
                    }
                }
                if (!childExists) {
                    hasStaleChildren = true;
                    break;
                }
            }
        }

        /* istanbul ignore next */
        if (this.list.length === this.children.length) {
            for (let i: number = 0; i < this.list.length; i++) {
                if (this.list[parseInt(i.toString(), 10)].propCollection.dataSource) {
                    if (this.list[parseInt(i.toString(), 10)].dataSource &&
                        this.list[parseInt(i.toString(), 10)].propCollection.dataSource
                        !== this.list[parseInt(i.toString(), 10)].dataSource) {
                        this.list[parseInt(i.toString(), 10)].propCollection.dataSource = this.list[parseInt(i.toString(), 10)].dataSource;
                        this.list[parseInt(i.toString(), 10)].hasChanges = true;
                    }
                    if (this.list[parseInt(i.toString(), 10)].property !== 'series') {
                        isSourceChanged = (JSON.stringify(this.list[parseInt(i.toString(), 10)].propCollection.dataSource) !==
                        JSON.stringify(childrenDataSource[parseInt(i.toString(), 10)].propCollection.dataSource));
                    }
                }
                isSourceChanged = this.list[parseInt(i.toString(), 10)].hasChanges
                                    !== childrenDataSource[parseInt(i.toString(), 10)].hasChanges;
            }
        }

        this.hasNewChildren = (this.list.length !== this.children.length || isSourceChanged || hasStaleChildren) ? true : null;
        if (this.hasNewChildren) {
            this.list = this.children.map((child: T & ComplexBase<T>) => {
                child.dirIndex = index++;
                child.property = this.propertyName;
                return child;
            });
        }
        /* istanbul ignore end */
        for (const item of this.list) {
            result = result || (<{ hasChanges: boolean }>item).hasChanges;
        }
        return !!this.list.length && result;
    }

    public clearTemplate(templateNames: string[]): void {
        /* istanbul ignore next */
        for (const item of this.list) {
            (<{ clearTemplate: Function }>item).clearTemplate(templateNames && templateNames.map((val: string): string => {
                const regExp: RegExpConstructor = RegExp;
                return new regExp(this.propertyName).test(val) ? val.replace(this.propertyName + '.', '') : val;
            }));
        }
    }

    public ngAfterContentChecked(): void {
        this.hasChanges = this.isChanged();
        for (let i: number = 0; i < this.list.length; i++) {
            if (getValue('childColumns', this.list[parseInt(i.toString(), 10)]) && getValue('property', this.list[parseInt(i.toString(), 10)]) === 'columns') {
                setValue('columns', getValue('childColumns', this.list[parseInt(i.toString(), 10)]).getProperties(), this.list[parseInt(i.toString(), 10)].propCollection);
            }
            this.list[parseInt(i.toString(), 10)].isUpdated = true;
        }
    }

    public ngAfterViewInit(): void {
        this.isInitChanges = false;
    }

    public ngOnDestroy(): void {
        this.list = [];
    }

}

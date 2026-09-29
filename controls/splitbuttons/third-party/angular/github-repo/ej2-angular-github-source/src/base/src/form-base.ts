/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types */
import { EventEmitter, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { getValue, setValue, isNullOrUndefined, isObject } from '@syncfusion/ej2-base';
import { ControlValueAccessor } from '@angular/forms';
import { ComponentBase } from './component-base';

/**
 * Angular Form Base Module
 */
export class FormBase<T> implements ControlValueAccessor, OnDestroy {
    public value: T;
    public checked: boolean;
    private skipFromEvent: boolean;
    static readonly isFormBase: boolean = true;

    public propagateChange(_?: T): void { return; }
    public propagateTouch(): void { return; }
    public enabled: Object;
    public disabled: Object;
    public angularValue: T;
    private isFormInit: boolean;
    public objCheck: boolean;
    public duplicateValue: string;
    public duplicateAngularValue: string;

    public element: HTMLElement;
    public inputElement: HTMLInputElement;
    private ngEle: ElementRef;
    public appendTo: (ele: string | HTMLElement) => void;

    public focus: EventEmitter<Object>;
    public blur: EventEmitter<Object>;
    public preventChange: boolean;
    public isUpdated: boolean;
    public oldValue: any;
    public cdr: ChangeDetectorRef;
    public ngOnBlurBound?: (e: Event) => void;
    public ngOnFocusBound?: (e: Event) => void;
    public destroy?: Function;
    public localChange(e: { value?: T, checked?: T }): void {
        const value: T | any = (e.checked === undefined ? e.value : e.checked);
        this.objCheck = isObject(value);
        if (this.isUpdated === true) {
            this.angularValue = this.oldValue;
        }
        if (this.objCheck === true) {
            this.duplicateValue = JSON.stringify(value);
            this.duplicateAngularValue = JSON.stringify(this.angularValue);
            if (this.duplicateValue !== this.duplicateAngularValue && this.propagateChange !== undefined && value !== undefined) {
                // Update angular from our control
                this.propagateChange(value);
                this.angularValue = value;
            }
        } else {
            if (value !== this.angularValue && this.propagateChange !== undefined && value !== undefined) {
                // While reset form using reset() method ng-dirty not get updated, so while value is empty just update angularValue only
                if (value !== '' && value !== null) {
                    // Update angular from our control
                    this.propagateChange(value);
                    this.angularValue = value;
                } else {
                    const optionalValue: any = value;
                    this.propagateChange(optionalValue);
                    this.angularValue = value;
                }
            }
        }
        this.cdr.markForCheck();
    }

    public properties: Object;
    public saveChanges: Function;


    public registerOnChange(registerFunction: (_: T) => void): void {
        this.propagateChange = registerFunction;
    }

    public registerOnTouched(registerFunction: () => void): void {
        this.propagateTouch = registerFunction;
    }
    public twoWaySetter(newVal: Object, prop: string): void {
        const oldVal: Object = this.oldValue || getValue(prop, this.properties);
        const ele: HTMLElement = this.inputElement || this.element;
        if (ele && oldVal === newVal && this.value === newVal &&
            ((<HTMLInputElement>ele).value === undefined || (<HTMLInputElement>ele).value === '')) {
            return;
        }
        this.saveChanges(prop, newVal, oldVal);
        setValue(prop, (isNullOrUndefined(newVal) ? null : newVal), this.properties);
        getValue(prop + 'Change', this).emit(newVal);
    }

    public ngAfterViewInit(isTempRef?: any): void {
        const tempFormAfterViewThis: any = isTempRef || this;
        // Used setTimeout for template binding
        // Refer Link: https://github.com/angular/angular/issues/6005
        // Removed setTimeout, Because we have called markForCheck() method in Angular Template Compiler
        /* istanbul ignore else */
        this.ngOnBlurBound = this.ngOnBlur.bind(this);
        this.ngOnFocusBound = this.ngOnFocus.bind(this);
        if (typeof window !== 'undefined') {
            if ((tempFormAfterViewThis.getModuleName()).includes('dropdowntree')) {
                setTimeout(function (): any {
                    tempFormAfterViewThis.appendTo(tempFormAfterViewThis.element);
                });
            }
            else {
                tempFormAfterViewThis.appendTo(tempFormAfterViewThis.element);
            }
            const ele: HTMLElement = tempFormAfterViewThis.inputElement || tempFormAfterViewThis.element;
            ele.addEventListener('focus', this.ngOnFocusBound);
            ele.addEventListener('blur', this.ngOnBlurBound);
        }
        this.isFormInit = false;
    }
    public setDisabledState(disabled: boolean): void {
        this.enabled = !disabled;
        this.disabled = disabled;
    }

    public writeValue(value: T): void {
        const regExp: RegExp = /ejs-radiobutton/g;
        //update control value from angular
        if (this.checked === undefined) {
            this.value = value;
        } else {
            // To resolve boolean type formControl value is not working for radio button control.
            /* istanbul ignore next */
            if (this.ngEle) {
                if (typeof value === 'boolean') {
                    if (regExp.test(this.ngEle.nativeElement.outerHTML)) {
                        this.checked = value === this.value;
                    } else {
                        this.checked = value;
                    }
                } else {
                    this.checked = value === this.value;
                }
            }
        }
        const isNullValue: boolean = this.angularValue == null;
        this.angularValue = value;
        this.isUpdated = true;
        // When binding Html textbox value to syncfusion textbox, change event triggered dynamically.
        // To prevent change event, trigger change in component side based on `preventChange` value
        this.preventChange = this.isFormInit ? false : true;
        this.cdr.markForCheck();
        if (value === null) {
            if (isNullValue) {
                this.preventChange = false;
            }
            return;
        }

    }

    public ngOnFocus(e: Event): void {
        /* istanbul ignore else */
        if (this.skipFromEvent !== true) {
            this.focus.emit(e);
        }
        this.cdr.markForCheck();
    }

    public ngOnBlur(e: Event): void {
        this.propagateTouch();
        /* istanbul ignore else */
        if (this.skipFromEvent !== true) {
            this.blur.emit(e);
        }
        this.cdr.markForCheck();
    }
    // Add ngOnDestroy to clean
    public ngOnDestroy(): void {
        // Call ComponentBase.ngOnDestroy to ensure full cleanup
        ComponentBase.prototype.baseDestroy.call(this);
    }
}

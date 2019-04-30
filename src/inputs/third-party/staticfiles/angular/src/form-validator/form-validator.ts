import { AbstractControl, ValidatorFn } from '@angular/forms';
import { FormValidator } from '@syncfusion/ej2-inputs';

export class FormValidators {

    //max validation

    public static max(number: number|Date): ValidatorFn {
        let max: number|Date = number;
        return (control: AbstractControl): { [key: string]: boolean } | null => {
            //tslint:disable-next-line
            let result: boolean = (FormValidator as any).checkValidator.max({ value: control.value, param: max });
            if (result === true) {
                return null;
            } else {
                return { 'max': true };
            }
        };
    }

    // min validation

    public static min(number: number|Date): ValidatorFn {
        let min: number|Date = number;
        return (control: AbstractControl): { [key: string]: boolean } | null => {
            //tslint:disable-next-line
            let result: boolean = (FormValidator as any).checkValidator.min({ value: control.value, param: min });
            if (result === true) {
                return null;
            } else {
                return { 'min': true };
            }
        };
    }

    // Credit card validation

    public static creditcard(control: AbstractControl): { [key: string]: boolean } | null {
        //tslint:disable-next-line
        let result: boolean = (FormValidator as any).checkValidator.creditcard({ value: control.value });
        if (result === true) {
            return null;
        } else {
            return { 'cardno': true };
        }
    }

    // date validation

    public static date(control: AbstractControl): { [key: string]: boolean } | null {
        //tslint:disable-next-line
        let result: boolean = (FormValidator as any).checkValidator.date({ value: control.value });
        if (result === true) {
            return null;
        } else {
            return { 'date': true };
        }
    }

    // Date-ISO validation

    public static dateIso(control: AbstractControl): { [key: string]: boolean } | null {
        //tslint:disable-next-line
        let result: boolean = (FormValidator as any).checkValidator.dateIso({ value: control.value });
        if (result === true) {
            return null;
        } else {
            return { 'dateiso': true };
        }
    }

    // Digit validation

    public static digits(control: AbstractControl): { [key: string]: boolean } | null {
        //tslint:disable-next-line
        let result: boolean = (FormValidator as any).checkValidator.digits({ value: control.value });
        if (result === true) {
            return null;
        } else {
            return { 'digit': true };
        }
    }

    // Email validation

    public static email(control: AbstractControl): { [key: string]: boolean } | null {
        //tslint:disable-next-line
        let result: boolean = (FormValidator as any).checkValidator.email({ value: control.value });
        if (result === true) {
            return null;
        } else {
            return { 'email': true };
        }
    }

    //maxlength validation

    public static maxLength(number: number): ValidatorFn {
        let maxlength: number = number;
        return (control: AbstractControl): { [key: string]: boolean } | null => {
            //tslint:disable-next-line
            let result: boolean = (FormValidator as any).checkValidator.maxLength({ value: control.value, param: maxlength });
            if (result === true) {
                return null;
            } else {
                return { 'maxlength': true };
            }
        };
    }

    //minlength validation

    public static minLength(number: number): ValidatorFn {
        let minlength: number = number;
        return (control: AbstractControl): { [key: string]: boolean } | null => {
            //tslint:disable-next-line
            let result: boolean = (FormValidator as any).checkValidator.minLength({ value: control.value, param: minlength });
            if (result === true) {
                return null;
            } else {
                return { 'minlength': true };
            }
        };
    }

    //number validation

    public static number(control: AbstractControl): { [key: string]: boolean } | null {
        //tslint:disable-next-line
        let result: boolean = (FormValidator as any).checkValidator.number({ value: control.value });
        if (result === true) {
            return null;
        } else {
            return { 'number': true };
        }
    }

    // required validation

    public static required(control: AbstractControl): { [key: string]: boolean } | null {
        //tslint:disable-next-line
        let result: boolean = (control.value === null) ? false : (FormValidator as any).checkValidator.required({ value: control.value });
        if (result === true) {
            return null;
        }
        else {
            return { 'required': true };
        }
    }

    // Telephone number validation

    public static tel(control: AbstractControl): { [key: string]: boolean } | null {
        //tslint:disable-next-line
        let result: boolean = (FormValidator as any).checkValidator.tel({ value: control.value });
        if (result === true) {
            return null;
        } else {
            return { 'telno': true };
        }
    }

    // Url validation

    public static url(control: AbstractControl): { [key: string]: boolean } | null {
        //tslint:disable-next-line
        let result: boolean = (FormValidator as any).checkValidator.url({ value: control.value });
        if (result === true) {
            return null;
        } else {
            return { 'url': true };
        }
    }

    // RangeLength validation

    public static rangeLength(number1: number, number2: number): ValidatorFn {
        let minRL: number = number1;
        let maxRL: number = number2;
        //tslint:disable-next-line
        let param: any = [minRL, maxRL];
        return (control: AbstractControl): { [key: string]: boolean } | null => {
            //tslint:disable-next-line
            let result: boolean = (FormValidator as any).checkValidator.rangeLength({ value: control.value, param: param });
            if (result === true) {
                return null;
            } else {
                return { 'rangelength': true };
            }
        };
    }

    // Range validation

    public static range(number1: number, number2: number): ValidatorFn {
        let minR: number = number1;
        let maxR: number = number2;
        //tslint:disable-next-line
        let param1: any = [minR, maxR];
        return (control: AbstractControl): { [key: string]: boolean } | null => {
            //tslint:disable-next-line
            let result: boolean = (FormValidator as any).checkValidator.range({ value: control.value, param: param1 });
            if (result === true) {
                return null;
            } else {
                return { 'range': true };
            }
        };
    }
}
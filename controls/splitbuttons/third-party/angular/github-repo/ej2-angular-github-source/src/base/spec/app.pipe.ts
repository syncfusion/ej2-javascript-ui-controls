import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'check' })
export class check implements PipeTransform {
    transform(value: boolean): boolean {
        if (value === true) {
            return false;
        } else {
            return true;
        }
    }
}

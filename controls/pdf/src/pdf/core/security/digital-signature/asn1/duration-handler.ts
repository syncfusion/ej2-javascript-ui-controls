import { _validateDateTimeComponent } from './syntax-verifier';
export class _PdfDurationEquivalent {
    _years: number;
    _months: number;
    _weeks: number;
    _days: number;
    _hours: number;
    _minutes: number;
    _seconds: number;
    _fractionalPart: { numberOfDigits: number; fractionalValue: number };
    constructor(
        years?: number,
        months?: number,
        weeks?: number,
        days?: number,
        hours?: number,
        minutes?: number,
        seconds?: number,
        fractionalPart?: {numberOfDigits: number; fractionalValue: number }) {
        if (typeof weeks !== 'undefined' && weeks !== null && (years || months || days || hours || minutes || seconds)) {
            throw new Error(
                'Duration equivalent may not combine week components and date-time components.'
            );
        }
        if (years) {
            _validateDateTimeComponent('year', 0, Number.MAX_SAFE_INTEGER)('Duration equivalent', years);
        }
        if (months) {
            _validateDateTimeComponent('month', 0, Number.MAX_SAFE_INTEGER)('Duration equivalent', months);
        }
        if (weeks) {
            _validateDateTimeComponent('week', 0, Number.MAX_SAFE_INTEGER)('Duration equivalent', weeks);
        }
        if (days) {
            _validateDateTimeComponent('day', 0, Number.MAX_SAFE_INTEGER)('Duration equivalent', days);
        }
        if (hours) {
            _validateDateTimeComponent('hour', 0, Number.MAX_SAFE_INTEGER)('Duration equivalent', hours);
        }
        if (minutes) {
            _validateDateTimeComponent('minute', 0, Number.MAX_SAFE_INTEGER)('Duration equivalent', minutes);
        }
        if (seconds) {
            _validateDateTimeComponent('second', 0, Number.MAX_SAFE_INTEGER)('Duration equivalent', seconds);
        }
        if (fractionalPart && !Number.isSafeInteger(fractionalPart.fractionalValue)) {
            throw new Error('The fractional part of the duration is incorrectly formatted');
        }
        this._years = years;
        this._months = months;
        this._weeks = weeks;
        this._days = days;
        this._hours = hours;
        this._minutes = minutes;
        this._seconds = seconds;
        this._fractionalPart = fractionalPart;
    }
    _toString(): string {
        let result: string = 'DURATION { ';
        if (typeof this._years !== 'undefined' && this._years !== null) {
            result += `years ${this._years} `;
        }
        if (typeof this._months !== 'undefined' && this._months !== null) {
            result += `months ${this._months} `;
        }
        if (typeof this._days !== 'undefined' && this._days !== null) {
            result += `days ${this._days} `;
        }
        if (typeof this._hours !== 'undefined' && this._hours !== null) {
            result += `hours ${this._hours} `;
        }
        if (typeof this._minutes !== 'undefined' && this._minutes !== null) {
            result += `minutes ${this._minutes} `;
        }
        if (typeof this._seconds !== 'undefined' && this._seconds !== null) {
            result += `seconds ${this._seconds} `;
        }
        result += '}';
        return result;
    }
    _toJson(): any { // eslint-disable-line
        return {
            years: this._years,
            months: this._months,
            weeks: this._weeks,
            days: this._days,
            hours: this._hours,
            minutes: this._minutes,
            seconds: this._seconds,
            fractionalPart: this._fractionalPart
                ? {
                    numberOfDigits: this._fractionalPart.numberOfDigits,
                    fractionalValue: this._fractionalPart.fractionalValue
                }
                : undefined
        };
    }
}

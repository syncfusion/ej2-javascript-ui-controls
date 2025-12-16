import { _PdfAbstractSyntaxElement } from '../asn1/abstract-syntax';
export class _PdfX509Time {
    private _time: _PdfAbstractSyntaxElement;
    constructor(time: _PdfAbstractSyntaxElement) {
        this._time = time;
    }
    _getUniversalTime(): string {
        if (this._time._getTagNumber() === 23) {
            const val: any = this._time._getValue();// eslint-disable-line
            if (typeof val === 'string') {
                return val.trim();
            }
            if (val instanceof Uint8Array) {
                const charCodes: number[] = [];
                for (let i: number = 0; i < val.length; i++) {
                    charCodes.push(val[<number>i]);
                }
                return String.fromCharCode.apply(null, charCodes).trim();
            }
        }
        return undefined;
    }
    _toDate(): Date {
        const str: string = this._getUniversalTime();
        if (str) {
            let m: RegExpMatchArray = str.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})Z$/);
            if (!m) {
                m = str.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})Z$/);
            }
            if (m) {
                let year: number = parseInt(m[1], 10);
                year += (year < 50) ? 2000 : 1900;
                const month: number = parseInt(m[2], 10) - 1;
                const day: number = parseInt(m[3], 10);
                const hour: number = parseInt(m[4], 10);
                const minute: number = parseInt(m[5], 10);
                const second: number = m.length > 6 && typeof m[6] !== 'undefined' ? parseInt(m[6], 10) : 0;
                return new Date(Date.UTC(year, month, day, hour, minute, second));
            }
        }
        return undefined;
    }
}

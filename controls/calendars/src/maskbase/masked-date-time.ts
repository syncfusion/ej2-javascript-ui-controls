import {IMaskedDateTime} from '../maskbase/interface';
import { L10n, getValue, getDefaultDateObject, cldrData, KeyboardEventArgs, Browser} from '@syncfusion/ej2-base';

const ARROWLEFT: string = 'ArrowLeft';
const ARROWRIGHT: string = 'ArrowRight';
const ARROWUP: string = 'ArrowUp';
const ARROWDOWN: string = 'ArrowDown';
const TAB: string = 'Tab';
const SHIFTTAB: string = 'shiftTab';
const END: string = 'End';
const HOME: string = 'Home';

export class MaskedDateTime {
    private parent : IMaskedDateTime;
    private dateformat : string;
    private mask : string = '';
    private l10n : L10n;
    private defaultConstant : {
        [x : string]: Object;
    } = {
        day: 'day',
        month: 'month',
        year: 'year',
        hour: 'hour',
        minute: 'minute',
        second: 'second',
        dayOfTheWeek: 'day of the week'
    };
    private objectString : string[];
    private hiddenMask : string = '';
    private validCharacters : string = 'dMyhmHfasz';
    private maskDateValue : Date;
    private previousValue : string;
    private previousHiddenMask : string;
    private isDayPart : boolean = false;
    private isMonthPart : boolean = false;
    private isYearPart : boolean = false;
    private isHourPart : boolean = false;
    private isMinutePart : boolean = false;
    private isSecondsPart : boolean = false;
    private isMilliSecondsPart : boolean = false;
    private monthCharacter : string = '';
    private hour : number;
    private periodCharacter : string = '';
    private isHiddenMask : boolean = false;
    private isComplete : boolean = false;
    private previousDate : Date;
    private isNavigate : boolean = false;
    private navigated : boolean = false;
    private isBlur : boolean = false;
    private formatRegex : RegExp = /EEEEE|EEEE|EEE|EE|E|cccc|ccc|dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yyy|yy|y|HH|H|hh|h|mm|m|fff|ff|f|aa|a|ss|s|zzzz|zzz|zz|z|'[^']*'|'[^']*'/g;
    private isDeletion: boolean = false;
    private isShortYear: boolean = false;
    private isDeleteKey: boolean = false;
    private isDateZero: boolean = false;
    private isMonthZero: boolean = false;
    private isYearZero: boolean = false;
    private isLeadingZero: boolean = false;
    private dayTypeCount: number = 0;
    private monthTypeCount: number = 0;
    private hourTypeCount: number = 0;
    private minuteTypeCount: number = 0;
    private secondTypeCount: number = 0;
    public constructor(parent? : IMaskedDateTime) {
        this.parent = parent;
        this.dateformat = this.getCulturedFormat();
        this.maskDateValue = this.parent.value != null ? new Date(+this.parent.value) : new Date();
        this.maskDateValue.setMonth(0);
        this.maskDateValue.setHours(0);
        this.maskDateValue.setMinutes(0);
        this.maskDateValue.setSeconds(0);
        this.previousDate = new Date(this.maskDateValue.getFullYear(), this.maskDateValue.getMonth(),
                                     this.maskDateValue.getDate(), this.maskDateValue.getHours(),
                                     this.maskDateValue.getMinutes(), this.maskDateValue.getSeconds());
        this.removeEventListener();
        this.addEventListener();
    }
    public getModuleName(): string {
        return 'MaskedDateTime';
    }
    public addEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on('createMask', this.createMask, this);
        this.parent.on('setMaskSelection', this.validCharacterCheck, this);
        this.parent.on('inputHandler', this.maskInputHandler, this);
        this.parent.on('keyDownHandler', this.maskKeydownHandler, this);
        this.parent.on('clearHandler', this.clearHandler, this);
        this.parent.on('maskPasteInputHandler', this.maskPasteInputHandler, this);
    }

    public removeEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('createMask', this.createMask);
        this.parent.off('setMaskSelection', this.validCharacterCheck);
        this.parent.off('inputHandler', this.maskInputHandler);
        this.parent.off('keyDownHandler', this.maskKeydownHandler);
        this.parent.off('clearHandler', this.clearHandler);
        this.parent.off('maskPasteInputHandler', this.maskPasteInputHandler);
    }

    private createMask(mask: events): void {
        this.isDayPart = this.isMonthPart = this.isYearPart = this.isHourPart = this.isMinutePart = this.isSecondsPart = false;
        this.dateformat = this.getCulturedFormat();

        if (this.parent.maskPlaceholder.day){
            this.defaultConstant['day'] = this.parent.maskPlaceholder.day; }


        if (this.parent.maskPlaceholder.month){
            this.defaultConstant['month'] = this.parent.maskPlaceholder.month; }


        if (this.parent.maskPlaceholder.year){
            this.defaultConstant['year'] = this.parent.maskPlaceholder.year; }


        if (this.parent.maskPlaceholder.hour){
            this.defaultConstant['hour'] = this.parent.maskPlaceholder.hour; }


        if (this.parent.maskPlaceholder.minute){
            this.defaultConstant['minute'] = this.parent.maskPlaceholder.minute; }


        if (this.parent.maskPlaceholder.second){
            this.defaultConstant['second'] = this.parent.maskPlaceholder.second; }


        if (this.parent.maskPlaceholder.dayOfTheWeek){
            this.defaultConstant['dayOfTheWeek'] = this.parent.maskPlaceholder.dayOfTheWeek.toString(); }

        this.getCUltureMaskFormat();
        const inputValue: string = this.dateformat.replace(this.formatRegex, this.formatCheck());
        this.isHiddenMask = true;
        this.hiddenMask = this.dateformat.replace(this.formatRegex, this.formatCheck());
        this.isHiddenMask = false;
        this.previousHiddenMask = this.hiddenMask;
        this.mask = this.previousValue = inputValue;
        this.parent.maskedDateValue = this.mask;
        if (this.parent.value) {
            this.navigated = true;
            this.isBlur = mask.isBlur;
            this.setDynamicValue();
        }
    }

    private getCUltureMaskFormat(): void {
        this.l10n = new L10n(this.parent.moduleName, this.defaultConstant, this.parent.locale);
        this.objectString = Object.keys(this.defaultConstant);
        for (let i: number = 0; i < this.objectString.length; i++) {
            this.defaultConstant[this.objectString[i as number].toString()] =
            this.l10n.getConstant(this.objectString[i as number].toString());
        }
    }

    private validCharacterCheck(): void {
        let start: number = this.parent.inputElement.selectionStart;

        if (this.parent.moduleName !== 'timepicker') {
            if (start === this.hiddenMask.length && this.mask === this.parent.inputElement.value) {
                start = 0;
            }
        }

        for (let i: number = start, j: number = start - 1; i < this.hiddenMask.length || j >= 0; i++, j --) {
            if (i < this.hiddenMask.length && this.validCharacters.indexOf(this.hiddenMask[i as number]) !== -1) {
                this.setSelection(this.hiddenMask[i as number]);
                return;
            }
            if (j >= 0 && this.validCharacters.indexOf(this.hiddenMask[j as number]) !== -1) {
                this.setSelection(this.hiddenMask[j as number]);
                return;
            }
        }
    }
    private setDynamicValue(): void {
        this.maskDateValue = new Date(+this.parent.value);
        this.isDayPart = this.isMonthPart = this.isYearPart = this.isHourPart = this.isMinutePart = this.isSecondsPart = true;
        this.updateValue();
        if (!this.isBlur)
        {
            this.validCharacterCheck();
        }
    }
    private setSelection(validChar : string): void {
        let start: number = -1;
        let end: number = 0;
        for (let i: number = 0; i < this.hiddenMask.length; i++) {
            if (this.hiddenMask[i as number] === validChar) {
                end = i + 1;
                if (start === -1) {
                    start = i;
                }
            }
        }
        if (start < 0) {
            start = 0;
        }
        this.parent.inputElement.setSelectionRange(start, end);
    }

    private maskKeydownHandler(args : events): void {
        if (args.e.key === 'Backspace') {
            const start: number = this.parent.inputElement.selectionStart;
            let formatText: string = '';
            if (this.validCharacters.indexOf(this.hiddenMask[start as number]) !== -1) {
                formatText = this.hiddenMask[start as number];
            }
            switch (formatText) {
            case 'd':
                this.dayTypeCount = Math.max(this.dayTypeCount - 1, 0);
                break;
            case 'M':
                this.monthTypeCount = Math.max(this.monthTypeCount - 1, 0);
                break;
            case 'H':
            case 'h':
                this.hourTypeCount = Math.max(this.hourTypeCount - 1, 0);
                break;
            case 'm':
                this.minuteTypeCount = Math.max(this.minuteTypeCount - 1, 0);
                break;
            case 's':
                this.secondTypeCount = Math.max(this.secondTypeCount - 1, 0);
                break;
            default:
                break;
            }
            return;
        }
        this.dayTypeCount = this.monthTypeCount = this.hourTypeCount = this.minuteTypeCount = this.secondTypeCount = 0;
        if (args.e.key === 'Delete')
        {
            this.isDeleteKey = true;
            return;
        }
        if ((!args.e.altKey && !args.e.ctrlKey) && (args.e.key === ARROWLEFT || args.e.key === ARROWRIGHT
             || args.e.key === SHIFTTAB || args.e.key === TAB || args.e.action === SHIFTTAB ||
            args.e.key === END || args.e.key === HOME)) {
            const start: number = this.parent.inputElement.selectionStart;
            const end: number = this.parent.inputElement.selectionEnd;
            const length: number = this.parent.inputElement.value.length;
            if ((start === 0 && end === length) && ( args.e.key === TAB || args.e.action === SHIFTTAB))
            {
                const index: number = args.e.action === SHIFTTAB ? end : 0;
                this.parent.inputElement.selectionStart = this.parent.inputElement.selectionEnd =  index;
            }
            if (args.e.key === END || args.e.key === HOME )
            {
                const range: number = args.e.key === END ? length : 0;
                this.parent.inputElement.selectionStart = this.parent.inputElement.selectionEnd =  range;
            }
            this.navigateSelection(args.e.key === ARROWLEFT || args.e.action === SHIFTTAB || args.e.key === END ? true : false);
        }
        if ((!args.e.altKey && !args.e.ctrlKey) && (args.e.key === ARROWUP || args.e.key === ARROWDOWN)) {
            let start: number = this.parent.inputElement.selectionStart;
            let formatText: string = '';
            if (this.validCharacters.indexOf(this.hiddenMask[start as number]) !== -1) {
                formatText = this.hiddenMask[start as number];
            }
            this.dateAlteration(args.e.key === ARROWDOWN ? true : false);
            const inputValue: string = this.dateformat.replace(this.formatRegex, this.formatCheck());
            this.isHiddenMask = true;
            this.hiddenMask = this.dateformat.replace(this.formatRegex, this.formatCheck());
            this.isHiddenMask = false;
            this.previousHiddenMask = this.hiddenMask;
            this.previousValue = inputValue;
            this.parent.inputElement.value = inputValue;
            for (let i: number = 0; i < this.hiddenMask.length; i++){
                if (formatText === this.hiddenMask[i as number]){
                    start = i;
                    break;
                }
            }
            this.parent.inputElement.selectionStart = start;
            this.validCharacterCheck();
        }
    }

    private isPersist(): boolean
    {
        const isPersist: boolean = this.parent.isFocused || this.navigated;
        return isPersist;
    }

    private differenceCheck(): void {
        const start: number = this.parent.inputElement.selectionStart;
        const inputValue: string = this.parent.inputElement.value;
        const previousVal: string = this.previousValue.substring(0, start + this.previousValue.length - inputValue.length);
        const newVal: string = inputValue.substring(0, start);
        const newDateValue: Date = new Date(+this.maskDateValue);

        const maxDate: number = new Date(newDateValue.getFullYear(), newDateValue.getMonth() + 1, 0).getDate();
        if (previousVal.indexOf(newVal) === 0 && (newVal.length === 0 ||
            this.previousHiddenMask[newVal.length - 1] !== this.previousHiddenMask[newVal.length])) {
            for (let i: number = newVal.length; i < previousVal.length; i++) {
                if (this.previousHiddenMask[i as number] !== '' && this.validCharacters.indexOf(this.previousHiddenMask[i as number]) >= 0) {
                    this.isDeletion = this.handleDeletion(this.previousHiddenMask[i as number], false);
                }
            }
            if (this.isDeletion) {
                return;
            }
        }
        switch (this.previousHiddenMask[start - 1]) {
        case 'd':
        {
            let date: number = (this.isDayPart && newDateValue.getDate().toString().length < 2 &&
            !this.isPersist() ? newDateValue.getDate() * 10 : 0) + parseInt(newVal[start - 1], 10);
            this.isDateZero = (newVal[start - 1] === '0' );
            this.parent.isFocused = this.parent.isFocused ? false : this.parent.isFocused;
            this.navigated = this.navigated ? false : this.navigated;
            if (isNaN(date)) {
                return;
            }
            for (let i: number = 0; date > maxDate; i++) {
                date = parseInt(date.toString().slice(1), 10);
            }
            if (date >= 1) {
                newDateValue.setDate(date);
                this.isNavigate = date.toString().length === 2;
                this.previousDate = new Date(newDateValue.getFullYear(), newDateValue.getMonth(), newDateValue.getDate());
                if (newDateValue.getMonth() !== this.maskDateValue.getMonth()) {
                    return;
                }
                this.isDayPart = true;
                const maxDaysInMonth: number = new Date(newDateValue.getFullYear(), newDateValue.getMonth() + 1, 0).getDate();
                this.dayTypeCount += (this.dayTypeCount === 0 && (parseInt(date + '0', 10) > maxDaysInMonth)) ? 2 : 1;
            } else {
                this.isDayPart = false;
                if (!(this.dayTypeCount === 1 && this.isDateZero)) {
                    this.dayTypeCount += this.isDateZero ? 1 : 0;
                }
            }
            break;
        }
        case 'M':
        {
            let month: number;
            if (newDateValue.getMonth().toString().length < 2 && !this.isPersist())
            {
                month = (this.isMonthPart ? (newDateValue.getMonth() + 1) * 10 : 0) + parseInt(newVal[start - 1], 10);
            }
            else
            {
                month = parseInt(newVal[start - 1], 10);
            }
            this.parent.isFocused = this.parent.isFocused ? false : this.parent.isFocused;
            this.navigated = this.navigated ? false : this.navigated;
            this.isMonthZero = (newVal[start - 1] === '0' );
            if (!isNaN(month)) {
                while (month > 12) {
                    month = parseInt(month.toString().slice(1), 10);
                }
                if (month >= 1) {
                    newDateValue.setMonth(month - 1);
                    if (month >= 10 || month === 1) {
                        if ( this.isLeadingZero && month === 1) {
                            this.isNavigate = month.toString().length === 1;
                            this.isLeadingZero = false;
                        }
                        else {
                            this.isNavigate = month.toString().length === 2;
                        }
                    }
                    else {
                        this.isNavigate = month.toString().length === 1;
                    }
                    if (newDateValue.getMonth() !== month - 1) {
                        newDateValue.setDate(1);
                        newDateValue.setMonth(month - 1);
                    }
                    if (this.isDayPart) {
                        const previousMaxDate: number = new Date(this.previousDate.getFullYear(),
                                                                 this.previousDate.getMonth() + 1, 0).getDate();
                        const currentMaxDate: number = new Date(newDateValue.getFullYear(), newDateValue.getMonth() + 1, 0).getDate();
                        if (this.previousDate.getDate() === previousMaxDate && currentMaxDate <= previousMaxDate) {
                            newDateValue.setDate(currentMaxDate);
                        }
                    }
                    this.previousDate = new Date(newDateValue.getFullYear(), newDateValue.getMonth(), newDateValue.getDate());
                    this.isMonthPart = true;
                    this.monthTypeCount = this.monthTypeCount + 1;
                    this.isLeadingZero = false;
                } else {
                    newDateValue.setMonth(0);
                    this.isLeadingZero = true;
                    this.isMonthPart = false;
                    if (!(this.monthTypeCount === 1 && this.isMonthZero)) {
                        this.monthTypeCount += this.isMonthZero ? 1 : 0;
                    }
                }
            } else {
                const monthString: string[] = <string[]>(this.getCulturedValue('months[stand-alone].wide'));
                const monthValue: string[] = Object.keys(monthString);
                this.monthCharacter += newVal[start - 1].toLowerCase();
                while (this.monthCharacter.length > 0) {
                    let i: number = 1;
                    for (const months of monthValue) {
                        if (monthString[i as number].toLowerCase().indexOf(this.monthCharacter) === 0) {
                            newDateValue.setMonth(i - 1);
                            this.isMonthPart = true;
                            this.maskDateValue = newDateValue;
                            return;
                        }
                        i++;
                    }
                    this.monthCharacter = this.monthCharacter.substring(1, this.monthCharacter.length);
                }
            }
            break;
        }
        case 'y':
        {
            let year: number = (this.isYearPart && (newDateValue.getFullYear().toString().length < 4
            && !this.isShortYear) ? newDateValue.getFullYear() * 10 : 0) + parseInt(newVal[start - 1], 10);
            let yearValue: number = (this.dateformat.match(/y/g) || []).length;
            yearValue = yearValue !== 2 ? 4 : yearValue;
            this.isShortYear = false;
            this.isYearZero = (newVal[start - 1] === '0' );
            if (isNaN(year)) {
                return;
            }
            while (year > 9999) {
                year = parseInt(year.toString().slice(1), 10);
            }
            if (year < 1) {
                this.isYearPart = false;
            } else {
                newDateValue.setFullYear(year);
                if (year.toString().length === yearValue)
                {
                    this.isNavigate = true;
                }
                this.previousDate = new Date(newDateValue.getFullYear(), newDateValue.getMonth(), newDateValue.getDate());
                this.isYearPart = true;
            }
            break;
        }
        case 'h':
            this.hour = (this.isHourPart && (newDateValue.getHours() % 12 || 12).toString().length < 2
             && !this.isPersist()  ? (newDateValue.getHours() % 12 || 12) * 10 : 0) + parseInt(newVal[start - 1], 10);
            this.parent.isFocused = this.parent.isFocused ? false : this.parent.isFocused;
            this.navigated = this.navigated ? false : this.navigated;
            if (isNaN(this.hour)) {
                return;
            }
            while (this.hour > 12) {
                this.hour = parseInt(this.hour.toString().slice(1), 10);
            }
            newDateValue.setHours(Math.floor(newDateValue.getHours() / 12) * 12 + (this.hour % 12));
            this.isNavigate = this.hour.toString().length === 2;
            this.isHourPart = true;
            this.hourTypeCount = (this.hourTypeCount === 0 && this.hour && (parseInt(this.hour + '0', 10) > 12)) ? 2 : this.hourTypeCount + 1;
            break;
        case 'H':
            this.hour = (this.isHourPart && newDateValue.getHours().toString().length < 2 &&
             !this.isPersist() ? newDateValue.getHours() * 10 : 0) + parseInt(newVal[start - 1], 10);
            this.parent.isFocused = this.parent.isFocused ? false : this.parent.isFocused;
            this.navigated = this.navigated ? false : this.navigated;
            if (isNaN(this.hour)) {
                return;
            }
            for (let i: number = 0; this.hour > 23; i++) {
                this.hour = parseInt(this.hour.toString().slice(1), 10);
            }
            newDateValue.setHours(this.hour);
            this.isNavigate = this.hour.toString().length === 2;
            this.isHourPart = true;
            this.hourTypeCount = (this.hourTypeCount === 0 && this.hour && (parseInt(this.hour + '0', 10) > 23)) ? 2 : this.hourTypeCount + 1;
            break;
        case 'm':
        {
            let minutes: number = (this.isMinutePart && newDateValue.getMinutes().toString().length < 2
             && !this.isPersist() ? newDateValue.getMinutes() * 10 : 0) + parseInt(newVal[start - 1], 10);
            this.parent.isFocused = this.parent.isFocused ? false : this.parent.isFocused;
            this.navigated = this.navigated ? false : this.navigated;
            if (isNaN(minutes)) {
                return;
            }
            for (let i: number = 0; minutes > 59; i++) {
                minutes = parseInt(minutes.toString().slice(1), 10);
            }
            newDateValue.setMinutes(minutes);
            this.isNavigate = minutes.toString().length === 2;
            this.isMinutePart = true;
            this.minuteTypeCount = (this.minuteTypeCount === 0 && (parseInt(minutes + '0', 10) > 59)) ? 2 : this.minuteTypeCount + 1;
            break;
        }
        case 's':
        {
            let seconds: number = (this.isSecondsPart && newDateValue.getSeconds().toString().length < 2 &&
             !this.isPersist() ? newDateValue.getSeconds() * 10 : 0) + parseInt(newVal[start - 1], 10);
            this.parent.isFocused = this.parent.isFocused ? false : this.parent.isFocused;
            this.navigated = this.navigated ? false : this.navigated;
            if (isNaN(seconds)) {
                return;
            }
            for (let i: number = 0; seconds > 59; i++) {
                seconds = parseInt(seconds.toString().slice(1), 10);
            }
            newDateValue.setSeconds(seconds);
            this.isNavigate = seconds.toString().length === 2;
            this.isSecondsPart = true;
            this.secondTypeCount = (this.secondTypeCount === 0 && (parseInt(seconds + '0', 10) > 59)) ? 2 : this.secondTypeCount + 1;
            break;
        }
        case 'a':
        {
            this.periodCharacter += newVal[start - 1].toLowerCase();
            const periodString: string[] = <string[]>(this.getCulturedValue('dayPeriods.format.wide'));
            const periodkeys: string[] = Object.keys(periodString);
            for (let i: number = 0; this.periodCharacter.length > 0; i++) {
                if ((periodString[periodkeys[0] as unknown as number].toLowerCase().indexOf(this.periodCharacter) === 0
                 && newDateValue.getHours() >= 12) || (periodString[periodkeys[1] as unknown as number].toLowerCase().
                    indexOf(this.periodCharacter) === 0 && newDateValue.getHours() < 12)) {
                    newDateValue.setHours((newDateValue.getHours() + 12) % 24);
                    this.maskDateValue = newDateValue;
                }
                this.periodCharacter = this.periodCharacter.substring(1, this.periodCharacter.length);
            }
            break;
        }
        default:
            break;
        }
        this.maskDateValue = newDateValue;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private formatCheck(): any {
        const proxy: this = null || this;
        function formatValueSpecifier(formattext: string): string {
            let result: string;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const daysAbbreviated: any = proxy.getCulturedValue('days[stand-alone].abbreviated');
            const dayKeyAbbreviated: string[] = Object.keys(daysAbbreviated);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const daysWide: any = <string[]>(proxy.getCulturedValue('days[stand-alone].wide'));
            const dayKeyWide: string[] = Object.keys(daysWide);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const daysNarrow: any = <string[]>(proxy.getCulturedValue('days[stand-alone].narrow'));
            const dayKeyNarrow: string[] = Object.keys(daysNarrow);
            const monthAbbreviated: string[] = <string[]>(proxy.getCulturedValue('months[stand-alone].abbreviated'));
            const monthWide: string[] = <string[]>(proxy.getCulturedValue('months[stand-alone].wide'));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const periodString: any = <string[]>(proxy.getCulturedValue('dayPeriods.format.wide'));
            const periodkeys: string[] = Object.keys(periodString);
            let milliseconds: number;
            let dateOptions: object;
            switch (formattext) {
            case 'ddd':
            case 'dddd':
            case 'd':
                result = proxy.isDayPart ? proxy.maskDateValue.getDate().toString() :  proxy.defaultConstant['day'].toString();
                result = proxy.zeroCheck(proxy.isDateZero , proxy.isDayPart , result );
                if (proxy.dayTypeCount === 2)
                {
                    proxy.isNavigate = true;
                    proxy.dayTypeCount = 0;
                }
                break;
            case 'dd':
                result = proxy.isDayPart ? proxy.roundOff(proxy.maskDateValue.getDate(), 2) :  proxy.defaultConstant['day'].toString();
                result = proxy.zeroCheck(proxy.isDateZero , proxy.isDayPart , result );
                if ( proxy.dayTypeCount === 2)
                {
                    proxy.isNavigate = true;
                    proxy.dayTypeCount = 0;
                }
                break;
            case 'E' :
            case 'EE':
            case 'EEE':
            case 'ccc':
                result = proxy.isDayPart && proxy.isMonthPart && proxy.isYearPart ? daysAbbreviated[dayKeyAbbreviated[proxy.maskDateValue.getDay()]].toString() :  proxy.defaultConstant['dayOfTheWeek'].toString();
                break;
            case 'EEEE':
            case 'cccc':
                result = proxy.isDayPart && proxy.isMonthPart && proxy.isYearPart ? daysWide[dayKeyWide[proxy.maskDateValue.getDay()]].toString() :  proxy.defaultConstant['dayOfTheWeek'].toString();
                break;
            case 'EEEEE':
                result = proxy.isDayPart && proxy.isMonthPart && proxy.isYearPart ? daysNarrow[dayKeyNarrow[proxy.maskDateValue.getDay()]].toString() :  proxy.defaultConstant['dayOfTheWeek'].toString();
                break;
            case 'M':
                result = proxy.isMonthPart ? (proxy.maskDateValue.getMonth() + 1).toString() :  proxy.defaultConstant['month'].toString();
                result = proxy.zeroCheck(proxy.isMonthZero , proxy.isMonthPart , result );
                if ( proxy.monthTypeCount === 2)
                {
                    proxy.isNavigate = true;
                    proxy.monthTypeCount = 0;
                }

                break;
            case 'MM':
                result = proxy.isMonthPart ? proxy.roundOff(proxy.maskDateValue.getMonth() + 1, 2) :  proxy.defaultConstant['month'].toString();
                result = proxy.zeroCheck(proxy.isMonthZero , proxy.isMonthPart , result );
                if ( proxy.monthTypeCount === 2)
                {
                    proxy.isNavigate = true;
                    proxy.monthTypeCount = 0;
                }

                break;
            case 'MMM':
                result = proxy.isMonthPart ? monthAbbreviated[proxy.maskDateValue.getMonth() + 1] :  proxy.defaultConstant['month'].toString();
                break;
            case 'MMMM':
                result = proxy.isMonthPart ? monthWide[proxy.maskDateValue.getMonth() + 1] :  proxy.defaultConstant['month'].toString();
                break;
            case 'yy':
                result = proxy.isYearPart ? proxy.roundOff(proxy.maskDateValue.getFullYear() % 100, 2) :  proxy.defaultConstant['year'].toString();
                result = proxy.zeroCheck(proxy.isYearZero , proxy.isYearPart , result );
                break;
            case 'y':
            case 'yyy':
            case 'yyyy':
                result = proxy.isYearPart ? proxy.roundOff(proxy.maskDateValue.getFullYear(), 4) :  proxy.defaultConstant['year'].toString();
                result = proxy.zeroCheck(proxy.isYearZero , proxy.isYearPart , result );
                break;
            case 'h':
                result = proxy.isHourPart ? (proxy.maskDateValue.getHours() % 12 || 12).toString() :  proxy.defaultConstant['hour'].toString();
                if ( proxy.hourTypeCount === 2)
                {
                    proxy.isNavigate = true;
                    proxy.hourTypeCount = 0;
                }
                break;
            case 'hh':
                result = proxy.isHourPart ? proxy.roundOff(proxy.maskDateValue.getHours() % 12 || 12, 2) :  proxy.defaultConstant['hour'].toString();
                if ( proxy.hourTypeCount === 2)
                {
                    proxy.isNavigate = true;
                    proxy.hourTypeCount = 0;
                }
                break;
            case 'H':
                result = proxy.isHourPart ? proxy.maskDateValue.getHours().toString() :  proxy.defaultConstant['hour'].toString();
                if ( proxy.hourTypeCount === 2)
                {
                    proxy.isNavigate = true;
                    proxy.hourTypeCount = 0;
                }
                break;
            case 'HH':
                result = proxy.isHourPart ? proxy.roundOff(proxy.maskDateValue.getHours(), 2) :  proxy.defaultConstant['hour'].toString() ;
                if ( proxy.hourTypeCount === 2)
                {
                    proxy.isNavigate = true;
                    proxy.hourTypeCount = 0;
                }
                break;
            case 'm':
                result = proxy.isMinutePart ? proxy.maskDateValue.getMinutes().toString() :  proxy.defaultConstant['minute'].toString() ;
                if ( proxy.minuteTypeCount === 2)
                {
                    proxy.isNavigate = true;
                    proxy.minuteTypeCount = 0;
                }
                break;
            case 'mm':
                result = proxy.isMinutePart ? proxy.roundOff(proxy.maskDateValue.getMinutes(), 2) :  proxy.defaultConstant['minute'].toString() ;
                if ( proxy.minuteTypeCount === 2)
                {
                    proxy.isNavigate = true;
                    proxy.minuteTypeCount = 0;
                }
                break;
            case 's':
                result = proxy.isSecondsPart ? proxy.maskDateValue.getSeconds().toString() :  proxy.defaultConstant['second'].toString() ;
                if ( proxy.secondTypeCount === 2)
                {
                    proxy.isNavigate = true;
                    proxy.secondTypeCount = 0;
                }
                break;
            case 'ss':
                result = proxy.isSecondsPart ? proxy.roundOff(proxy.maskDateValue.getSeconds(), 2) :  proxy.defaultConstant['second'].toString();
                if ( proxy.secondTypeCount === 2)
                {
                    proxy.isNavigate = true;
                    proxy.secondTypeCount = 0;
                }
                break;
            case 'f':
                result = Math.floor(proxy.maskDateValue.getMilliseconds() / 100).toString();
                break;
            case 'ff':
                milliseconds = proxy.maskDateValue.getMilliseconds();
                if (proxy.maskDateValue.getMilliseconds() > 99) {
                    milliseconds = Math.floor(proxy.maskDateValue.getMilliseconds() / 10);
                }
                result = proxy.roundOff(milliseconds, 2);
                break;
            case 'fff':
                result = proxy.roundOff(proxy.maskDateValue.getMilliseconds(), 3);
                break;
            case 'a':
            case 'aa':
                result =  proxy.maskDateValue.getHours() < 12 ? periodString['am'] : periodString['pm'] ;
                break;
            case 'z':
            case 'zz':
            case 'zzz':
            case 'zzzz':
                dateOptions = {
                    format: formattext,
                    type: 'dateTime', skeleton: 'yMd', calendar: proxy.parent.calendarMode
                };
                result = proxy.parent.globalize.formatDate(proxy.maskDateValue, dateOptions);
                break;
            }
            result = result !== undefined ? result : formattext.slice(1, formattext.length - 1);
            if (proxy.isHiddenMask) {
                let hiddenChar: string = '';
                for (let i: number = 0; i < result.length; i++) {
                    hiddenChar += formattext[0];
                }
                return hiddenChar;
            } else {
                return result;
            }
        }
        return formatValueSpecifier;
    }

    private isValidDate(dateString: string): boolean {
        const date: Date = new Date(dateString);
        // Return true if the date is valid, false otherwise
        return !isNaN(date.getTime());
    }

    private maskPasteInputHandler(): void {
        if (this.isValidDate(this.parent.inputElement.value)) {
            this.maskDateValue = new Date(this.parent.inputElement.value);
            this.isDayPart = this.isMonthPart = this.isYearPart = this.isHourPart = this.isMinutePart = this.isSecondsPart = true;
            this.updateValue();
            if (!this.isBlur) {
                this.validCharacterCheck();
            }
            return;
        }
        else {
            this.maskInputHandler();
        }
    }

    private maskInputHandler(): void {
        let start: number = this.parent.inputElement.selectionStart;
        let formatText: string = '';
        if (this.validCharacters.indexOf(this.hiddenMask[start as number]) !== -1) {
            formatText = this.hiddenMask[start as number];
        }
        this.differenceCheck();
        const inputValue: string = this.dateformat.replace(this.formatRegex, this.formatCheck());
        this.isHiddenMask = true;
        this.hiddenMask = this.dateformat.replace(this.formatRegex, this.formatCheck());
        this.isDateZero = this.isMonthZero = this.isYearZero = false;
        this.isHiddenMask = false;
        this.previousHiddenMask = this.hiddenMask;
        this.previousValue = inputValue;
        this.parent.inputElement.value = inputValue;
        for (let i: number = 0; i < this.hiddenMask.length; i++){
            if (formatText === this.hiddenMask[i as number]){
                start = i;
                break;
            }
        }
        let scrollPositionY: number;
        if (Browser.isDevice && (Browser.isIos || Browser.isIos7)) {
            const scrollableParent: HTMLElement | null = this.findScrollableParent(this.parent.inputElement);
            scrollPositionY = scrollableParent ? scrollableParent.getBoundingClientRect().top : window.scrollY;
        }
        this.parent.inputElement.selectionStart = start;
        this.validCharacterCheck();
        if ((this.isNavigate || this.isDeletion) && !this.isDeleteKey ) {
            const isbackward: boolean = this.isNavigate ? false : true;
            this.isNavigate = this.isDeletion = false;
            this.navigateSelection(isbackward);
            if (Browser.isDevice && (Browser.isIos || Browser.isIos7)) {
                setTimeout(() => {
                    window.scrollTo(0, scrollPositionY);
                }, 0);
            }
        }
        if (this.isDeleteKey)
        {
            this.isDeletion = false;
        }
        this.isDeleteKey = false;
    }
    private findScrollableParent(element: HTMLElement | null): HTMLElement | null {
        while (element) {
            if (this.isScrollable(element)) {
                return element;
            }
            element = element.parentElement;
        }
        return null;
    }
    private isScrollable(element: HTMLElement): boolean {
        const overflowY: string = window.getComputedStyle(element).overflowY;
        return element.scrollHeight > element.clientHeight && (overflowY === 'auto' || overflowY === 'scroll');
    }
    private navigateSelection(isbackward : boolean): void {
        const start: number = this.parent.inputElement.selectionStart;
        const end: number = this.parent.inputElement.selectionEnd;
        let formatIndex: number = isbackward ? start - 1 : end;
        this.navigated = true;
        while (formatIndex < this.hiddenMask.length && formatIndex >= 0) {
            if (this.validCharacters.indexOf(this.hiddenMask[formatIndex as number]) >= 0) {
                this.setSelection(this.hiddenMask[formatIndex as number]);
                break;
            }
            formatIndex = formatIndex + (isbackward ? -1 : 1);
        }
    }
    private roundOff(val : number, count : number): string {
        const valueText: string = val.toString();
        const length: number = count - valueText.length;
        let result: string = '';
        for (let i: number = 0; i < length; i++) {
            result += '0';
        }
        return result + valueText;
    }

    private zeroCheck(isZero: boolean , isDayPart: boolean, resultValue: string): string {
        let result: string = resultValue;
        if (isZero && !isDayPart)
        {
            result = '0';
        }
        return result;
    }


    private handleDeletion(format : string, isSegment : boolean): boolean {
        switch (format) {
        case 'd':
            this.isDayPart = isSegment;
            break;
        case 'M':
            this.isMonthPart = isSegment;
            if (!isSegment) {
                this.maskDateValue.setMonth(0);
                this.monthCharacter = '';
            }
            break;
        case 'y':
            this.isYearPart = isSegment;
            break;
        case 'H':
        case 'h':
            this.isHourPart = isSegment;
            if (!isSegment) {
                this.periodCharacter = '';
            }
            break;
        case 'm':
            this.isMinutePart = isSegment;
            break;
        case 's':
            this.isSecondsPart = isSegment;
            break;
        default:
            return false;
        }
        return true;
    }

    private dateAlteration(isDecrement : boolean): void {
        const start: number = this.parent.inputElement.selectionStart;
        let formatText: string = '';
        if (this.validCharacters.indexOf(this.hiddenMask[start as number]) !== -1) {
            formatText = this.hiddenMask[start as number];
        } else {
            return;
        }
        const newDateValue: Date = new Date(this.maskDateValue.getFullYear(), this.maskDateValue.getMonth(),
                                            this.maskDateValue.getDate(), this.maskDateValue.getHours(),
                                            this.maskDateValue.getMinutes(), this.maskDateValue.getSeconds());
        this.previousDate = new Date(this.maskDateValue.getFullYear(), this.maskDateValue.getMonth(),
                                     this.maskDateValue.getDate(), this.maskDateValue.getHours(),
                                     this.maskDateValue.getMinutes(), this.maskDateValue.getSeconds());
        const incrementValue: number = isDecrement ? -1 : 1;
        switch (formatText) {
        case 'd':
            newDateValue.setDate(newDateValue.getDate() + incrementValue);
            break;
        case 'M':
        {
            const newMonth: number = newDateValue.getMonth() + incrementValue;
            newDateValue.setDate(1);
            newDateValue.setMonth(newMonth);
            if (this.isDayPart) {
                const previousMaxDate: number = new Date(this.previousDate.getFullYear(), this.previousDate.getMonth() + 1, 0).getDate();
                const currentMaxDate: number = new Date(newDateValue.getFullYear(), newDateValue.getMonth() + 1, 0).getDate();
                if (this.previousDate.getDate() === previousMaxDate && currentMaxDate <= previousMaxDate) {
                    newDateValue.setDate(currentMaxDate);
                }
                else
                {
                    newDateValue.setDate(this.previousDate.getDate());
                }
            }
            else
            {
                newDateValue.setDate(this.previousDate.getDate());
            }
            this.previousDate = new Date(newDateValue.getFullYear(), newDateValue.getMonth(), newDateValue.getDate());
            break;
        }
        case 'y':
            newDateValue.setFullYear(newDateValue.getFullYear() + incrementValue);
            break;
        case 'H':
        case 'h':
            newDateValue.setHours(newDateValue.getHours() + incrementValue);
            break;
        case 'm':
            newDateValue.setMinutes(newDateValue.getMinutes() + incrementValue);
            break;
        case 's':
            newDateValue.setSeconds(newDateValue.getSeconds() + incrementValue);
            break;
        case 'a':
            newDateValue.setHours((newDateValue.getHours() + 12) % 24);
            break;
        default:
            break;
        }
        this.maskDateValue = newDateValue.getFullYear() > 0 ? newDateValue : this.maskDateValue;
        if (this.validCharacters.indexOf(this.hiddenMask[start as number]) !== -1) {
            this.handleDeletion(this.hiddenMask[start as number], true);
        }
    }
    private getCulturedValue(format : string): object {
        const locale: string = this.parent.locale;
        let result: object;
        if (locale === 'en' || locale === 'en-US') {
            result = getValue(format, getDefaultDateObject());
        } else {
            result = getValue('main.' + '' + locale + ('.dates.calendars.gregorian.' + format), cldrData);
        }
        return result;
    }

    private getCulturedFormat(): string{
        let formatString: string = (this.getCulturedValue('dateTimeFormats[availableFormats].yMd')).toString();
        if (this.parent.moduleName === 'datepicker')
        {
            formatString = (this.getCulturedValue('dateTimeFormats[availableFormats].yMd')).toString();
            if (this.parent.format && this.parent.formatString)
            {
                formatString = this.parent.formatString;
            }
        }
        if (this.parent.moduleName === 'datetimepicker')
        {
            formatString = (this.getCulturedValue('dateTimeFormats[availableFormats].yMd')).toString();
            if (this.parent.dateTimeFormat)
            {
                formatString = this.parent.dateTimeFormat;
            }
        }
        if (this.parent.moduleName === 'timepicker')
        {
            formatString = this.parent.cldrTimeFormat();
        }
        return formatString;
    }

    private clearHandler(): void {

        this.isDayPart = this.isMonthPart = this.isYearPart = this.isHourPart = this.isMinutePart = this.isSecondsPart = false;
        this.updateValue();
        if (this.parent.inputElement && this.parent.inputElement.value === this.parent.maskedDateValue && this.parent.inputWrapper && this.parent.inputWrapper.clearButton && !this.parent.inputWrapper.clearButton.classList.contains('e-clear-icon-hide')) {
            this.parent.inputWrapper.clearButton.classList.add('e-clear-icon-hide');
        }
    }

    private updateValue(): void {
        this.monthCharacter = this.periodCharacter = '';
        const inputValue: string = this.dateformat.replace(this.formatRegex, this.formatCheck());
        this.isHiddenMask = true;
        this.hiddenMask = this.dateformat.replace(this.formatRegex, this.formatCheck());
        this.isHiddenMask = false;
        this.previousHiddenMask = this.hiddenMask;
        this.previousValue = inputValue;
        this.parent.updateInputValue(inputValue);
        if (this.parent.strictMode && (this.dayTypeCount !== 0 || this.monthTypeCount !== 0)) {
            this.isLeadingZero = false;
        }
        this.dayTypeCount = 0;
        this.monthTypeCount = 0;
    }

    public destroy(): void {
        this.removeEventListener();
    }
}

export interface events {
    module: string;
    e: KeyboardEventArgs;
    isBlur: boolean;
}


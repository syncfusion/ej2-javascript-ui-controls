import {IMaskedDateTime} from '../maskbase/interface';
import { Internationalization, L10n, getValue, getDefaultDateObject, cldrData, KeyboardEventArgs} from '@syncfusion/ej2-base';

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
        dayOfTheWeek: 'day of the week',
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
    private formatRegex : RegExp = /EEEEE|EEEE|EEE|EE|E|dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|y|HH|H|hh|h|mm|m|fff|ff|f|aa|a|ss|s|zzzz|zzz|zz|z|'[^']*'|'[^']*'/g;
    private isDeletion: boolean = false;
    private isShortYear: boolean = false;
    private isDeleteKey: boolean = false;
    private isDateZero: boolean = false;
    private isMonthZero: boolean = false;
    private isYearZero: boolean = false;
    private dayTypeCount: number = 0;
    private monthTypeCount: number = 0;
    public constructor(parent? : IMaskedDateTime) {
        this.parent = parent;
        this.dateformat = this.getCulturedFormat();
        this.maskDateValue = this.parent.value != null ? new Date(+this.parent.value) : new Date();
        this.maskDateValue.setMonth(0);
        this.maskDateValue.setHours(0);
        this.maskDateValue.setMinutes(0);
        this.maskDateValue.setSeconds(0);
        this.previousDate = new Date(this.maskDateValue.getFullYear(), this.maskDateValue.getMonth(), this.maskDateValue.getDate(),this.maskDateValue.getHours(),
        this.maskDateValue.getMinutes(),this.maskDateValue.getSeconds());
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
    }

    private createMask(dateformat : string): void {
        this.isDayPart = this.isMonthPart = this.isYearPart = this.isHourPart = this.isMinutePart = this.isSecondsPart = false;
        this.dateformat = this.getCulturedFormat();
        
    if (this.parent.maskPlaceholder.day) 
        this.defaultConstant['day'] = this.parent.maskPlaceholder.day;
    

    if (this.parent.maskPlaceholder.month) 
        this.defaultConstant['month'] = this.parent.maskPlaceholder.month;
    

    if (this.parent.maskPlaceholder.year) 
        this.defaultConstant['year'] = this.parent.maskPlaceholder.year;
    

    if (this.parent.maskPlaceholder.hour) 
        this.defaultConstant['hour'] = this.parent.maskPlaceholder.hour;
    

    if (this.parent.maskPlaceholder.minute) 
        this.defaultConstant['minute'] = this.parent.maskPlaceholder.minute;
    

    if (this.parent.maskPlaceholder.second) 
        this.defaultConstant['second'] = this.parent.maskPlaceholder.second;
    

    if (this.parent.maskPlaceholder.dayOfTheWeek) 
        this.defaultConstant['dayOfTheWeek'] = this.parent.maskPlaceholder.dayOfTheWeek.toString();

        this.getCUltureMaskFormat();
        let inputValue: string = this.dateformat.replace(this.formatRegex, this.formatCheck());
        this.isHiddenMask = true;
        this.hiddenMask = this.dateformat.replace(this.formatRegex, this.formatCheck());
        this.isHiddenMask = false;
        this.previousHiddenMask = this.hiddenMask;
        this.mask = this.previousValue = inputValue;
        this.parent.maskedDateValue = this.mask;
        if (this.parent.value) {
            this.setDynamicValue();
        }
    }

    private getCUltureMaskFormat(): void {
        this.l10n = new L10n(this.parent.moduleName, this.defaultConstant, this.parent.locale);
        this.objectString = Object.keys(this.defaultConstant);
        for (let i: number = 0; i < this.objectString.length; i++) {
            this.defaultConstant[this.objectString[i].toString()] = this.l10n.getConstant(this.objectString[i].toString());
        }
    }

    private validCharacterCheck() {
        let start: number = this.parent.inputElement.selectionStart;

        for (let i: number = start, j = start - 1; i < this.hiddenMask.length || j >= 0; i++, j --) {
            if (i < this.hiddenMask.length && this.validCharacters.indexOf(this.hiddenMask[i]) !== -1) {
                this.setSelection(this.hiddenMask[i]);
                return;
            }
            if (j >= 0 && this.validCharacters.indexOf(this.hiddenMask[j]) !== -1) {
                this.setSelection(this.hiddenMask[j]);
                return;
            }
        }
    }
    private setDynamicValue(): void {
        this.maskDateValue = this.parent.value;
        this.isDayPart = this.isMonthPart = this.isYearPart = this.isHourPart = this.isMinutePart = this.isSecondsPart = true
        this.updateValue();
        // this.parent.inputElement.selectionStart = start;
        // this.validCharacterCheck();
    }
    private setSelection(validChar : string): void {
        let start: number = -1;
        let end: number = 0;
        for (let i: number = 0; i < this.hiddenMask.length; i++) {
            if (this.hiddenMask[i] === validChar) {
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
        if(args.e.key === 'Delete')
        {
        this.isDeleteKey = true;
        return;
        }
        if ((!args.e.altKey && !args.e.ctrlKey) && (args.e.key === ARROWLEFT || args.e.key === ARROWRIGHT || args.e.key === SHIFTTAB || args.e.key === TAB || args.e.action === SHIFTTAB ||
            args.e.key === END || args.e.key === HOME)) {
            let start: number = this.parent.inputElement.selectionStart;
                let end: number = this.parent.inputElement.selectionEnd;
                let length: number = this.parent.inputElement.value.length;
                if((start == 0 && end == length) && ( args.e.key === TAB || args.e.action === SHIFTTAB))
                {
                    let index: number = args.e.action === SHIFTTAB ? end : 0;
                    this.parent.inputElement.selectionStart = this.parent.inputElement.selectionEnd =  index;
                }
                if(args.e.key ===END || args.e.key === HOME )
                {
                    let range: number = args.e.key ===END ? length : 0;
                    this.parent.inputElement.selectionStart = this.parent.inputElement.selectionEnd =  range;
                }
            this.navigateSelection(args.e.key === ARROWLEFT || args.e.action === SHIFTTAB || args.e.key ===END ? true : false);
        }
        if ((!args.e.altKey && !args.e.ctrlKey) && (args.e.key === ARROWUP || args.e.key === ARROWDOWN)) {
            let start: number = this.parent.inputElement.selectionStart;
            this.dateAlteration(args.e.key === ARROWDOWN ? true : false);
            let inputValue: string = this.dateformat.replace(this.formatRegex, this.formatCheck());
            this.isHiddenMask = true;
            this.hiddenMask = this.dateformat.replace(this.formatRegex, this.formatCheck());
            this.isHiddenMask = false;
            this.previousHiddenMask = this.hiddenMask;
            this.previousValue = inputValue;
            this.parent.inputElement.value = inputValue;
            this.parent.inputElement.selectionStart = start;
            this.validCharacterCheck();
        }
    }

    private differenceCheck(): void {
        let start: number = this.parent.inputElement.selectionStart;
        let inputValue: string = this.parent.inputElement.value;
        let previousVal: string = this.previousValue.substring(0, start + this.previousValue.length - inputValue.length);
        let newVal: string = inputValue.substring(0, start);
        let newDateValue: Date = this.maskDateValue;
        
        let maxDate: number = new Date(newDateValue.getFullYear(), newDateValue.getMonth() + 1, 0).getDate();
        if (previousVal.indexOf(newVal) === 0 && (newVal.length === 0 || this.previousHiddenMask[newVal.length - 1] !== this.previousHiddenMask[newVal.length])) {
            for (let i: number = newVal.length; i < previousVal.length; i++) {
                if (this.previousHiddenMask[i] !== '' && this.validCharacters.indexOf(this.previousHiddenMask[i]) >= 0) {
                    this.isDeletion = this.handleDeletion(this.previousHiddenMask[i], false);
                }
            }
            if (this.isDeletion) {
                return;
            }
        }
        switch (this.previousHiddenMask[start - 1]) {
            case 'd':
                let date: number = (this.isDayPart && newDateValue.getDate().toString().length < 2 ? newDateValue.getDate() * 10 : 0) + parseInt(newVal[start - 1], 10);
                this.isDateZero = (newVal[start - 1] == '0' );
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
                    this.dayTypeCount = this.dayTypeCount + 1;
                } else {
                    this.isDayPart = false;
                    this.dayTypeCount = this.isDateZero ? this.dayTypeCount + 1 : this.dayTypeCount
                }
                break;
            case 'M':
                let month: number;
                if(newDateValue.getMonth().toString().length < 2)
                {
                month= (this.isMonthPart ? (newDateValue.getMonth() + 1) * 10 : 0) + parseInt(newVal[start - 1], 10);
                }
                else
                {
                    month = parseInt(newVal[start - 1], 10);
                }
                this.isMonthZero = (newVal[start - 1] == '0' );
                if (!isNaN(month)) {
                    while (month > 12) {
                        month = parseInt(month.toString().slice(1), 10);
                    }
                    if (month >= 1) {
                        newDateValue.setMonth(month - 1);
                        this.isNavigate = month.toString().length === 2;
                        if (newDateValue.getMonth() !== month - 1) {
                            newDateValue.setDate(1);
                            newDateValue.setMonth(month - 1);
                        }
                        if (this.isDayPart) {
                            let previousMaxDate: number = new Date(this.previousDate.getFullYear(), this.previousDate.getMonth() + 1, 0).getDate();
                            let currentMaxDate: number = new Date(newDateValue.getFullYear(), newDateValue.getMonth() + 1, 0).getDate();
                            if (this.previousDate.getDate() == previousMaxDate && currentMaxDate <= previousMaxDate) {
                                newDateValue.setDate(currentMaxDate);
                            }
                        }
                        this.previousDate = new Date(newDateValue.getFullYear(), newDateValue.getMonth(), newDateValue.getDate());
                        this.isMonthPart = true;
                        this.monthTypeCount = this.monthTypeCount + 1;
                    } else {
                        newDateValue.setMonth(0);
                        this.isMonthPart = false;
                         this.monthTypeCount = this.isMonthZero ? this.monthTypeCount + 1 : this.monthTypeCount
                    }
                } else { // let monthString: string[] = <string[]>(getValue('months[stand-alone].wide', getDefaultDateObject()));
                    let monthString: string[] = <string[]>(this.getCulturedValue('months[stand-alone].wide'));
                    let monthValue = Object.keys(monthString);
                    this.monthCharacter += newVal[start - 1].toLowerCase();
                    while (this.monthCharacter.length > 0) {
                        let i: number = 1;
                        for (let months of monthValue) {
                            if (monthString[i].toLowerCase().indexOf(this.monthCharacter) === 0) {
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
            case 'y':
                let year: number = (this.isYearPart && (newDateValue.getFullYear().toString().length < 4 && !this.isShortYear) ? newDateValue.getFullYear() * 10 : 0) + parseInt(newVal[start - 1], 10);
                this.isShortYear = false;
                this.isYearZero = (newVal[start - 1] == '0' );
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
                    if(year.toString().length === 4)
                    {
                        this.isNavigate = true;
                    }
                    this.previousDate = new Date(newDateValue.getFullYear(), newDateValue.getMonth(), newDateValue.getDate());
                    this.isYearPart = true;
                }
                break;
            case 'h':
                this.hour = (this.isHourPart && (newDateValue.getHours() % 12 || 12).toString().length < 2  ? (newDateValue.getHours() % 12 || 12) * 10 : 0) + parseInt(newVal[start - 1], 10);
                if (isNaN(this.hour)) {
                    return;
                }
                while (this.hour > 12) {
                    this.hour = parseInt(this.hour.toString().slice(1), 10);
                }
                newDateValue.setHours(Math.floor(newDateValue.getHours() / 12) * 12 + (this.hour % 12));
                this.isNavigate = this.hour.toString().length === 2;
                this.isHourPart = true;
                break;
            case 'H':
                this.hour = (this.isHourPart && newDateValue.getHours().toString().length < 2 ? newDateValue.getHours() * 10 : 0) + parseInt(newVal[start - 1], 10);
                if (isNaN(this.hour)) {
                    return;
                }
                for (let i: number = 0; this.hour > 23; i++) {
                    this.hour = parseInt(this.hour.toString().slice(1), 10);
                }
                newDateValue.setHours(this.hour);
                this.isNavigate = this.hour.toString().length === 2;
                this.isHourPart = true;
                break;
            case 'm':
                let minutes: number = (this.isMinutePart && newDateValue.getMinutes().toString().length < 2 ? newDateValue.getMinutes() * 10 : 0) + parseInt(newVal[start - 1], 10);
                if (isNaN(minutes)) {
                    return;
                }
                for (let i: number = 0; minutes > 59; i++) {
                    minutes = parseInt(minutes.toString().slice(1), 10);
                }
                newDateValue.setMinutes(minutes);
                this.isNavigate = minutes.toString().length === 2;
                this.isMinutePart = true;
                break;
            case 's':
                let seconds: number = (this.isSecondsPart && newDateValue.getSeconds().toString().length < 2 ? newDateValue.getSeconds() * 10 : 0) + parseInt(newVal[start - 1], 10);
                if (isNaN(seconds)) {
                    return;
                }
                for (let i: number = 0; seconds > 59; i++) {
                    seconds = parseInt(seconds.toString().slice(1), 10);
                }
                newDateValue.setSeconds(seconds);
                this.isNavigate = seconds.toString().length === 2;
                this.isSecondsPart = true;
                break;
            case 'a':
                    this.periodCharacter += newVal[start - 1].toLowerCase();
                    // let periodString: string[] = <string[]>(getValue('dayPeriods.format.wide', getDefaultDateObject()));;
                    let periodString: any = <string[]>(this.getCulturedValue('dayPeriods.format.wide'));
                    let periodkeys: string[] = Object.keys(periodString);
                    //periodString[periodkeys[0]] : periodString[periodkeys[1]] : periodString[periodkeys[0]];
                    for (let i: number = 0; this.periodCharacter.length > 0; i++) {
                        if ((periodString[periodkeys[0]].toLowerCase().indexOf(this.periodCharacter) === 0 && newDateValue.getHours() >= 12) || (periodString[periodkeys[1]].toLowerCase().indexOf(this.periodCharacter) === 0 && newDateValue.getHours() < 12)) {
                            newDateValue.setHours((newDateValue.getHours() + 12) % 24);
                            this.maskDateValue = newDateValue;
                        }
                        this.periodCharacter = this.periodCharacter.substring(1, this.periodCharacter.length);
                        // Object.values()
                    }
                break;
            default:
                break;
        }
        this.maskDateValue = newDateValue;
    }

    private formatCheck(): any {
        const proxy: this = this;
        function formatValueSpecifier(formattext: string): string {
            let isSymbol: boolean;
            let result: string;
            let daysAbbreviated: any = proxy.getCulturedValue('days[stand-alone].abbreviated');
            let dayKeyAbbreviated: string[] = Object.keys(daysAbbreviated);
            let daysWide: any = <string[]>(proxy.getCulturedValue('days[stand-alone].wide'));
            let dayKeyWide: string[] = Object.keys(daysWide);
            let daysNarrow: any = <string[]>(proxy.getCulturedValue('days[stand-alone].narrow'));
            let dayKeyNarrow: string[] = Object.keys(daysNarrow);
            let monthAbbreviated: string[] = <string[]>(proxy.getCulturedValue('months[stand-alone].abbreviated'));
            let monthWide: string[] = <string[]>(proxy.getCulturedValue('months[stand-alone].wide'));
            let periodString: any = <string[]>(proxy.getCulturedValue('dayPeriods.format.wide'));
            let periodkeys: string[] = Object.keys(periodString);
            let milliseconds: number;
            let dateOptions: object;
            switch (formattext) {
                case 'ddd':
                case 'dddd':
                case 'd': result = proxy.isDayPart ? proxy.maskDateValue.getDate().toString() :  proxy.defaultConstant['day'].toString();
                          result = proxy.zeroCheck(proxy.isDateZero , proxy.isDayPart , result );
                    break;
                case 'dd': result = proxy.isDayPart ? proxy.roundOff(proxy.maskDateValue.getDate(), 2) :  proxy.defaultConstant['day'].toString();
                            result = proxy.zeroCheck(proxy.isDateZero , proxy.isDayPart , result )
                                if ( proxy.dayTypeCount == 2)
                                {
                                    proxy.isNavigate = true;
                                    proxy.dayTypeCount = 0;
                                }
                            
                                break;
                case 'E' :
                case 'EE':
                case 'EEE': result = proxy.isDayPart && proxy.isMonthPart && proxy.isYearPart ? daysAbbreviated[dayKeyAbbreviated[proxy.maskDateValue.getDay()]].toString() :  proxy.defaultConstant['dayOfTheWeek'].toString();
                    break;
                case 'EEEE': result = proxy.isDayPart && proxy.isMonthPart && proxy.isYearPart ? daysWide[dayKeyWide[proxy.maskDateValue.getDay()]].toString() :  proxy.defaultConstant['dayOfTheWeek'].toString();
                    break;
                case 'EEEEE':
                    result = proxy.isDayPart && proxy.isMonthPart && proxy.isYearPart ? daysNarrow[dayKeyNarrow[proxy.maskDateValue.getDay()]].toString() :  proxy.defaultConstant['dayOfTheWeek'].toString();
                    break;
                case 'M': result = proxy.isMonthPart ? (proxy.maskDateValue.getMonth() + 1).toString() :  proxy.defaultConstant['month'].toString();
                          result = proxy.zeroCheck(proxy.isMonthZero , proxy.isMonthPart , result )
                    break;
                case 'MM': result = proxy.isMonthPart ? proxy.roundOff(proxy.maskDateValue.getMonth() + 1, 2) :  proxy.defaultConstant['month'].toString();
                           result = proxy.zeroCheck(proxy.isMonthZero , proxy.isMonthPart , result )
                           if ( proxy.monthTypeCount == 2)
                           {
                               proxy.isNavigate = true;
                               proxy.monthTypeCount = 0;
                           }

                break;
                case 'MMM': result = proxy.isMonthPart ? monthAbbreviated[proxy.maskDateValue.getMonth() + 1] :  proxy.defaultConstant['month'].toString();
                    break;
                case 'MMMM': result = proxy.isMonthPart ? monthWide[proxy.maskDateValue.getMonth() + 1] :  proxy.defaultConstant['month'].toString();
                    break;
                case 'yy': result = proxy.isYearPart ? proxy.roundOff(proxy.maskDateValue.getFullYear() % 100, 2) :  proxy.defaultConstant['year'].toString();
                     result = proxy.zeroCheck(proxy.isYearZero , proxy.isYearPart , result )
                    if (proxy.isYearPart) {
                        proxy.isNavigate = proxy.isShortYear = (proxy.maskDateValue.getFullYear() % 100).toString().length === 2;
                    }
                    break;
                case 'y':
                case 'yyyy': result = proxy.isYearPart ? proxy.roundOff(proxy.maskDateValue.getFullYear(), 4) :  proxy.defaultConstant['year'].toString();
                             result = proxy.zeroCheck(proxy.isYearZero , proxy.isYearPart , result )
                break;
                case 'h': result = proxy.isHourPart ? (proxy.maskDateValue.getHours() % 12 || 12).toString() :  proxy.defaultConstant['hour'].toString();
                    break;
                case 'hh': result = proxy.isHourPart ? proxy.roundOff(proxy.maskDateValue.getHours() % 12 || 12, 2) :  proxy.defaultConstant['hour'].toString();
                    break;
                case 'H': result = proxy.isHourPart ? proxy.maskDateValue.getHours().toString() :  proxy.defaultConstant['hour'].toString();
                    break;
                case 'HH': result = proxy.isHourPart ? proxy.roundOff(proxy.maskDateValue.getHours(), 2) :  proxy.defaultConstant['hour'].toString() ;
                    break;
                case 'm': result = proxy.isMinutePart ? proxy.maskDateValue.getMinutes().toString() :  proxy.defaultConstant['minute'].toString() ;
                    break;
                case 'mm': result = proxy.isMinutePart ? proxy.roundOff(proxy.maskDateValue.getMinutes(), 2) :  proxy.defaultConstant['minute'].toString() ;
                    break;
                case 's': result = proxy.isSecondsPart ? proxy.maskDateValue.getSeconds().toString() :  proxy.defaultConstant['second'].toString() ;
                    break;
                case 'ss': result = proxy.isSecondsPart ? proxy.roundOff(proxy.maskDateValue.getSeconds(), 2) :  proxy.defaultConstant['second'].toString();
                    break;
                case 'f': result = Math.floor(proxy.maskDateValue.getMilliseconds() / 100).toString();
                    break;
                case 'ff': milliseconds = proxy.maskDateValue.getMilliseconds();
                    if (proxy.maskDateValue.getMilliseconds() > 99) {
                        milliseconds = Math.floor(proxy.maskDateValue.getMilliseconds() / 10);
                    }
                    result = proxy.roundOff(milliseconds, 2);
                    break;
                case 'fff': result = proxy.roundOff(proxy.maskDateValue.getMilliseconds(), 3);
                    break;
                case 'a':    
                case 'aa': result =  proxy.maskDateValue.getHours() < 12 ? periodString[periodkeys[0]] : periodString[periodkeys[1]] ;
                    break;
                case 'z':
                case 'zz':
                case 'zzz':
                case 'zzzz':
                    dateOptions = {
                        format: formattext,
                        type: 'dateTime', skeleton: 'yMd', calendar: proxy.parent.calendarMode
                    };
                   result = proxy.parent.globalize.formatDate(proxy.maskDateValue,dateOptions);
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

    private maskInputHandler(): void {
        let start: number = this.parent.inputElement.selectionStart;
        let selectionChar: string = this.previousHiddenMask[start - 1];
        let inputValue: string;
        this.differenceCheck();
        inputValue = this.dateformat.replace(this.formatRegex, this.formatCheck());
        this.isHiddenMask = true;
        this.hiddenMask = this.dateformat.replace(this.formatRegex, this.formatCheck());
        this.isDateZero = this.isMonthZero = this.isYearZero = false;
        this.isHiddenMask = false;
        this.previousHiddenMask = this.hiddenMask;
        this.previousValue = inputValue;
        this.parent.inputElement.value = inputValue;
        this.parent.inputElement.selectionStart = start;
        this.validCharacterCheck();
        if ((this.isNavigate || this.isDeletion) && !this.isDeleteKey ) {
          let isbackward: boolean = this.isNavigate ? false : true;
            this.isNavigate = this.isDeletion = false;
            this.navigateSelection(isbackward);
        }
        this.isDeleteKey = false;
        // this.setSelection(selectionChar);
        // this.navigateSelection(inputValue);
    }
    private navigateSelection(isbackward : boolean): void {
        let start: number = this.parent.inputElement.selectionStart;
        let end: number = this.parent.inputElement.selectionEnd;
        let formatIndex: number = isbackward ? start - 1 : end + 1;
        while (formatIndex < this.hiddenMask.length && formatIndex >= 0) {
            if (this.validCharacters.indexOf(this.hiddenMask[formatIndex]) >= 0) {
                this.setSelection(this.hiddenMask[formatIndex]);
                break;
            }
            formatIndex = formatIndex + (isbackward ? -1 : 1);
        }
    }
    private roundOff(val : number, count : number): string {
        let valueText: string = val.toString();
        let length: number = count - valueText.length;
        let result: string = '';
        for (let i: number = 0; i < length; i++) {
            result += '0';
        }
        return result + valueText;
    }

    private zeroCheck(isZero: boolean , isDayPart: boolean, resultValue: string): string {
        let result: string = resultValue;
        if(isZero && !isDayPart)
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

    private dateAlteration(isDecrement : boolean) {
        let start: number = this.parent.inputElement.selectionStart;
        let formatText: string = '';
        if (this.validCharacters.indexOf(this.hiddenMask[start]) !== -1) {
            formatText = this.hiddenMask[start];
        } else {
            return;
        }
        let newDateValue: Date = new Date(this.maskDateValue.getFullYear(), this.maskDateValue.getMonth(), this.maskDateValue.getDate(),this.maskDateValue.getHours(),
        this.maskDateValue.getMinutes(),this.maskDateValue.getSeconds());
        this.previousDate = new Date(this.maskDateValue.getFullYear(), this.maskDateValue.getMonth(), this.maskDateValue.getDate(),this.maskDateValue.getHours(),
        this.maskDateValue.getMinutes(),this.maskDateValue.getSeconds());
        let incrementValue: number = isDecrement ? -1 : 1;
        switch (formatText) {
            case 'd': newDateValue.setDate(newDateValue.getDate() + incrementValue);
                break;
            case 'M':
                let newMonth: number = newDateValue.getMonth() + incrementValue;
                newDateValue.setDate(1);
                newDateValue.setMonth(newMonth);
                if (this.isDayPart) {
                    let previousMaxDate: number = new Date(this.previousDate.getFullYear(), this.previousDate.getMonth() + 1, 0).getDate();
                    let currentMaxDate: number = new Date(newDateValue.getFullYear(), newDateValue.getMonth() + 1, 0).getDate();
                    if (this.previousDate.getDate() == previousMaxDate && currentMaxDate <= previousMaxDate) {
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
            case 'y': newDateValue.setFullYear(newDateValue.getFullYear() + incrementValue);
                break;
            case 'H':
            case 'h': newDateValue.setHours(newDateValue.getHours() + incrementValue);
                break;
            case 'm': newDateValue.setMinutes(newDateValue.getMinutes() + incrementValue);
                break;
            case 's': newDateValue.setSeconds(newDateValue.getSeconds() + incrementValue);
                break;
            case 'a': newDateValue.setHours((newDateValue.getHours() + 12) % 24);
                break;
            default:
                break;
        }
        this.maskDateValue = newDateValue.getFullYear() > 0 ? newDateValue : this.maskDateValue;
        if (this.validCharacters.indexOf(this.hiddenMask[start]) !== -1) {
            this.handleDeletion(this.hiddenMask[start], true);
        }
    }
    private getCulturedValue(format : string): object {
        let locale: string = this.parent.locale;
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
        if(this.parent.moduleName == 'datepicker')
        {
            formatString = (this.getCulturedValue('dateTimeFormats[availableFormats].yMd')).toString();
            if(this.parent.format && this.parent.formatString)
            {
                formatString = this.parent.formatString
            }
        }
        if(this.parent.moduleName == 'datetimepicker')
        {
            formatString = (this.getCulturedValue('dateTimeFormats[availableFormats].yMd')).toString();
            if(this.parent.dateTimeFormat)
            {
            formatString = this.parent.dateTimeFormat;
            }
        }
        if(this.parent.moduleName == 'timepicker')
        {
            formatString = this.parent.cldrTimeFormat();
        }
        return formatString;
    }

    private clearHandler(): void {

        this.isDayPart = this.isMonthPart = this.isYearPart = this.isHourPart = this.isMinutePart = this.isSecondsPart = false
        this.updateValue();
    }

    private updateValue(): void {
      this.monthCharacter = this.periodCharacter = '';
      let inputValue: string = this.dateformat.replace(this.formatRegex, this.formatCheck());
      this.isHiddenMask = true;
      this.hiddenMask = this.dateformat.replace(this.formatRegex, this.formatCheck());
      this.isHiddenMask = false;
      this.previousHiddenMask = this.hiddenMask;
      this.previousValue = inputValue;
      this.parent.updateInputValue(inputValue);
      //this.parent.inputElement.value = inputValue;
    }

    public destroy(): void {
        this.removeEventListener();
    }
}

export interface events {
    module: string;
    e: KeyboardEventArgs;
}


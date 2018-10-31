import { Component, Property, NotifyPropertyChanges, INotifyPropertyChanged, Event, Browser } from '@syncfusion/ej2-base';
import { EmitType, getDefaultDateObject, getValue, cldrData, L10n, isNullOrUndefined, removeClass, addClass } from '@syncfusion/ej2-base';
import { DropDownList, ChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { DatePicker, ChangedEventArgs } from '@syncfusion/ej2-calendars';
import { Button, RadioButton } from '@syncfusion/ej2-buttons';
import { EventHandler, MouseEventArgs, classList } from '@syncfusion/ej2-base';
import { EJ2Instance } from '../schedule/base/interface';
import { RecRule, extractObjectFromRule, generate, generateSummary, getRecurrenceStringFromDate } from './date-generator';
import { RecurrenceEditorModel } from './recurrence-editor-model';

const HEADER: string = 'e-editor';
const INPUTWARAPPER: string = 'e-input-wrapper';
const INPUTWARAPPERSIDE: string = 'e-input-wrapper-side';
const REPEATELEMENT: string = 'e-repeat-element';
const REPEATINTERVAL: string = 'e-repeat-interval';
const INTERVALCLASS: string = 'e-interval';
const DAYWRAPPER: string = 'e-days';
const WEEKWRAPPER: string = 'e-non-week';
const WEEKPOSITION: string = 'e-week-position';
const YEAREXPANDERWRAPPER: string = 'e-year-expander';
const YEAREXPANDERELEMENT: string = 'e-year-expander-element';
const MONETHEXPANDERWRAPPER: string = 'e-month-expander';
const MONETHEXPANDWRAPPER: string = 'e-month-expand-wrapper';
const MONTHEXPANDERELEMENT: string = 'e-month-expander-element';
const MONTHEXPANDERCHECKBOXWRAPPER: string = 'e-month-expander-checkbox-wrapper';
const FORMLEFT: string = 'e-form-left';
const FORMRIGHT: string = 'e-form-right';
const MONTHDAYWRAPPER: string = 'e-month-day';
const MONTHEXPANNDERELEM: string = 'e-month-expander-wrapper';
const MONTHPOS: string = 'e-month-pos';
const MONTHWEEK: string = 'e-month-week';
const ENDON: string = 'e-end-on';
const MONTHEXPANDERLABEL: string = 'e-month-expander-label';
const WEEKEXPANDERLABEL: string = 'e-week-expander-label';
const ENDONLABEL: string = 'e-end-on-label';
const ENDONLEFT: string = 'e-end-on-left';
const MONTHDAYELEMENT: string = 'e-monthday-element';
const ENDONELEMENT: string = 'e-end-on-element';
const ENDONDATE: string = 'e-end-on-date';
const UNTILDATE: string = 'e-until-date';
const ENDONCOUNTWRAPPER: string = 'e-end-on-count';
const ENDONCOUNT: string = 'e-recurrence-count';
const HIDEWRAPPER: string = 'e-hide-recurrence-element';
const RTLCLASS: string = 'e-rtl';
const PRIMARY: string = 'e-primary';
const ACTIVE: string = 'e-active';
const RECURRENCETABLE: string = 'e-recurrence-table';
const REPEATCONTENT: string = 'e-repeat-content';
const REPEATCONTENTWRAPPER: string = 'e-repeat-content-wrapper';
const NONE: string = 'none';
const DAILY: string = 'daily';
const WEEKLY: string = 'weekly';
const MONTHLY: string = 'monthly';
const YEARLY: string = 'yearly';
const NEVER: string = 'never';
const UNTIL: string = 'until';
const COUNT: string = 'count';
const TEXTFIELD: string = 'text';
const VALUEFIELD: string = 'value';
const LAST: string = 'last';
const REPEAT: string = 'repeat';
const REPEATEVERY: string = 'repeatEvery';
const ON: string = 'on';
const END: string = 'end';
const RADIOLABEL: string = 'onDay';
const RULEUNTIL: string = 'UNTIL';
const RULEBYDAY: string = 'BYDAY';
const RULEBYMONTHDAY: string = 'BYMONTHDAY';
const RULEBYMONTH: string = 'BYMONTH';
const RULEINTERVAL: string = 'INTERVAL';
const RULECOUNT: string = 'COUNT';
const RULESETPOS: string = 'BYSETPOS';
const RULEFREQ: string = 'FREQ';
const RULEDAILY: string = 'DAILY';
const RULEWEEKLY: string = 'WEEKLY';
const RULEMONTHLY: string = 'MONTHLY';
const RULEYEARLY: string = 'YEARLY';
const RULESUNDAY: string = 'SU';
const RULEMONDAY: string = 'MO';
const RULETUESDAY: string = 'TU';
const RULEWEDNESDAY: string = 'WE';
const RULETHURSDAY: string = 'TH';
const RULEFRIDAY: string = 'FR';
const RULESATURDAY: string = 'SA';
const KEYSUNDAY: string = 'sun';
const KEYMONDAY: string = 'mon';
const KEYTUESDAY: string = 'tue';
const KEYWEDNESDAY: string = 'wed';
const KEYTHURSDAY: string = 'thu';
const KEYFRIDAY: string = 'fri';
const KEYSATURDAY: string = 'sat';
const EQUAL: string = '=';
const SEMICOLON: string = ';';
const COMMA: string = ',';
const FIRST: string = 'first';
const SECOND: string = 'second';
const THIRD: string = 'third';
const FOURTH: string = 'fourth';
let contentType: { [key: string]: string } = {
    none: '',
    daily: 'days',
    weekly: 'weeks',
    monthly: 'months',
    yearly: 'years'
};
let valueData: { [key: string]: string } = {
    'sun': RULESUNDAY,
    'mon': RULEMONDAY,
    'tue': RULETUESDAY,
    'wed': RULEWEDNESDAY,
    'thu': RULETHURSDAY,
    'fri': RULEFRIDAY,
    'sat': RULESATURDAY
};

let neverClassList: string[] = [DAYWRAPPER, WEEKWRAPPER, ENDON, INTERVALCLASS, YEAREXPANDERWRAPPER, MONETHEXPANDERWRAPPER];
let weekClassList: string[] = [WEEKWRAPPER];
let monthClassList: string[] = [DAYWRAPPER, YEAREXPANDERWRAPPER];
let yearClassList: string[] = [DAYWRAPPER];
let dailyClassList: string[] = [DAYWRAPPER, WEEKWRAPPER, YEAREXPANDERWRAPPER, MONETHEXPANDERWRAPPER];
let noEndClassList: string[] = [ENDONDATE, ENDONCOUNTWRAPPER];
let endOnCountClassList: string[] = [ENDONDATE];
let endOnDateClassList: string[] = [ENDONCOUNTWRAPPER];

/**
 * Represents the RecurrenceEditor component.
 * ```html
 * <div id="recurrence"></div>
 * ```
 * ```typescript
 * <script>
 *   var recObj = new RecurrenceEditor();
 *   recObj.appendTo("#recurrence");
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class RecurrenceEditor extends Component<HTMLElement> implements INotifyPropertyChanged {
    // RecurrenceEditor Options
    /**
     * Sets the recurrence pattern on the editor.
     * @default ['none', 'daily', 'weekly', 'monthly', 'yearly']
     */
    @Property(['none', 'daily', 'weekly', 'monthly', 'yearly'])
    public frequencies: RepeatType[];
    /**
     * Sets the first day of the week.
     * @default 0
     */
    @Property(0)
    public firstDayOfWeek: number;
    /**
     * Sets the start date on recurrence editor.
     * @default new Date()
     */
    @Property(new Date())
    public startDate: Date;
    /**
     * Sets the user specific date format on recurrence editor.
     * @default null
     */
    @Property()
    public dateFormat: string;
    /**
     * Sets the locale to be applied on recurrence editor.
     * @default true
     */
    @Property('en-US')
    public locale: string;
    /**
     * Allows styling with custom class names.
     * @default null
     */
    @Property()
    public cssClass: string;
    /**
     * Allows recurrence editor to render in RTL mode.
     * @default false
     */
    @Property(false)
    public enableRtl: boolean;
    /**
     * Sets the recurrence rule as its output values.
     * @default null
     */
    @Property()
    public value: String;
    /**
     * Sets the minimum date on recurrence editor.
     * @default new Date(1900, 1, 1)
     */
    @Property(new Date(1900, 1, 1))
    public minDate: Date;
    /**
     * Sets the maximum date on recurrence editor.
     * @default new Date(2099, 12, 31)
     */
    @Property(new Date(2099, 12, 31))
    public maxDate: Date;
    /**
     * Sets the current repeat type to be set on the recurrence editor.
     * @default 0
     */
    @Property(0)
    public selectedType: Number;
    /**
     * Triggers for value changes on every sub-controls rendered within the recurrence editor.
     * @event
     */
    @Event()
    public change: EmitType<RecurrenceEditorChangeEventArgs>;
    /**
     * Constructor for creating the widget
     * @param  {object} options?
     */
    constructor(options?: RecurrenceEditorModel, element?: string | HTMLButtonElement) {
        super(options, <string | HTMLButtonElement>element);
    }
    public localeObj: L10n;
    private defaultLocale: Object = {
        none: 'None',
        daily: 'Daily',
        weekly: 'Weekly',
        monthly: 'Monthly',
        month: 'Month',
        yearly: 'Yearly',
        never: 'Never',
        until: 'Until',
        count: 'Count',
        first: 'First',
        second: 'Second',
        third: 'Third',
        fourth: 'Fourth',
        last: 'Last',
        repeat: 'Repeat',
        repeatEvery: 'Repeat every',
        on: 'Repeat On',
        end: 'End',
        onDay: 'Day',
        days: 'Day(s)',
        weeks: 'Week(s)',
        months: 'Month(s)',
        years: 'Year(s)',
        every: 'every',
        summaryTimes: 'time(s)',
        summaryOn: 'on',
        summaryUntil: 'until',
        summaryRepeat: 'Repeats',
        summaryDay: 'day(s)',
        summaryWeek: 'week(s)',
        summaryMonth: 'month(s)',
        summaryYear: 'year(s)',
        monthWeek: 'Month Week',
        monthPosition: 'Month Position',
        monthExpander: 'Month Expander',
        yearExpander: 'Year Expander',
        repeatInterval: 'Repeat Interval'
    };
    private renderStatus: boolean = false;
    private ruleObject: RecRule;
    private recurrenceCount: NumericTextBox;
    private monthDate: NumericTextBox;
    private repeatInterval: NumericTextBox;
    private untilDateObj: DatePicker;
    private repeatType: DropDownList;
    private endType: DropDownList;
    private monthWeekPos: DropDownList;
    private monthWeekDays: DropDownList;
    private monthValue: DropDownList;
    private onMonthDay: RadioButton;
    private onWeekDay: RadioButton;
    private dayButtons: Button[] = [];
    private monthButtons: RadioButton[] = [];
    private startState(freq: string, endOn: string, startDate: Date): void {
        this.showFormElement();
        this.updateForm(freq);
        this.freshOnEndForm();
        this.updateEndOnForm(endOn);
        this.selectMonthDay(startDate);
        this.updateUntilDate(startDate);
        this.onMonthDay.setProperties({ checked: true });
    }
    protected preRender(): void {
        this.localeObj = new L10n(this.getModuleName(), this.defaultLocale, this.locale);
        // pre render code snippets
    }
    private applyCustomClass(cssClass: string): void {
        if (cssClass) {
            addClass([this.element], cssClass);
        }
    }
    private initialize(): void {
        this.renderComponent();
        if (!isNullOrUndefined(this.value)) {
            this.setRecurrenceRule(this.value as string);
        } else {
            this.startState(this.repeatType.value.toString().toUpperCase(), NEVER, this.startDate);
            this.updateForm(this.repeatType.value.toString());
            if (this.selectedType > 0) {
                this.setProperties({ value: this.getRecurrenceRule() }, false);
            }
        }
        this.applyCustomClass(this.cssClass);
    }
    private triggerChangeEvent(): void {
        if (this.renderStatus) {
            let value: string = this.getRecurrenceRule();
            this.trigger('change', { value: value });
            this.setProperties({ value: value }, false);
        }
    }
    private resetDayButton(): void {
        let elements: HTMLElement[] = [].slice.call(this.element.querySelectorAll('.' + DAYWRAPPER + ' button'));
        elements.forEach((element: HTMLElement) => removeClass([element], [ACTIVE, PRIMARY]));
    }
    private daySelection(dayIndex: number): void {
        this.resetDayButton();
        let days: number[] = [0, 1, 2, 3, 4, 5, 6];
        this.rotateArray(days, this.firstDayOfWeek);
        let element: Element = this.element.querySelector('.' + DAYWRAPPER + ' button[data-index="' + days.indexOf(dayIndex) + '"]');
        if (element) {
            addClass([element], [ACTIVE, PRIMARY]);
        }
    }
    private rtlClass(status: boolean): void {
        if (status) {
            addClass([this.element], RTLCLASS);
        } else {
            removeClass([this.element], RTLCLASS);
        }
    }
    private updateUntilDate(date: Date): void {
        let tempDate: Date = new Date(date.getTime());
        tempDate.setDate(tempDate.getDate() + 60);
        this.untilDateObj.setProperties({ value: tempDate });
    }
    private selectMonthDay(date: Date): void {
        let weekday: string[] = [KEYSUNDAY, KEYMONDAY, KEYTUESDAY, KEYWEDNESDAY, KEYTHURSDAY, KEYFRIDAY, KEYSATURDAY];
        this.monthDate.setProperties({ value: date.getDate() });
        this.monthWeekDays.setProperties({ value: valueData[weekday[date.getDay()]] });
        this.monthValue.setProperties({ value: '' + (date.getMonth() + 1) });
        this.monthWeekPos.setProperties({ value: this.getDayPosition(date) });
        this.daySelection(date.getDay());
    }
    private updateForm(state: string): void {
        this.repeatType.setProperties({ value: state });
        let end: Element = this.element.querySelector('.' + ENDON);
        if (state === DAILY) {
            classList(end, [FORMLEFT], [FORMRIGHT]);
        } else {
            classList(end, [FORMRIGHT], [FORMLEFT]);
        }
        switch (state) {
            case NONE:
                neverClassList.forEach((className: string) => addClass([this.element.querySelector('.' + className)], HIDEWRAPPER));
                break;
            case WEEKLY:
                weekClassList.forEach((className: string) => addClass([this.element.querySelector('.' + className)], HIDEWRAPPER));
                break;
            case MONTHLY:
                monthClassList.forEach((className: string) => addClass([this.element.querySelector('.' + className)], HIDEWRAPPER));
                break;
            case YEARLY:
                yearClassList.forEach((className: string) => addClass([this.element.querySelector('.' + className)], HIDEWRAPPER));
                break;
            case DAILY:
                dailyClassList.forEach((className: string) => addClass([this.element.querySelector('.' + className)], HIDEWRAPPER));
                break;

        }
    }
    private updateEndOnForm(state: string): void {
        this.endType.setProperties({ value: state });
        switch (state) {
            case NEVER:
                noEndClassList.forEach((className: string) => addClass([this.element.querySelector('.' + className)], HIDEWRAPPER));
                break;
            case UNTIL:
                endOnDateClassList.forEach((className: string) => addClass([this.element.querySelector('.' + className)], HIDEWRAPPER));
                break;
            case COUNT:
                endOnCountClassList.forEach((className: string) => addClass([this.element.querySelector('.' + className)], HIDEWRAPPER));
                break;
        }
    }
    private freshOnEndForm(): void {
        noEndClassList.forEach((className: string) => {
            let element: Element = this.element.querySelector('.' + className);
            if (element) {
                removeClass([element], HIDEWRAPPER);
            }
        });
    }
    private showFormElement(): void {
        neverClassList.forEach((className: string) => removeClass([this.element.querySelector('.' + className)], HIDEWRAPPER));
    }
    private renderDropdowns(): void {
        let self: RecurrenceEditor = this;
        this.repeatType = new DropDownList({
            //set the data to dataSource property
            dataSource: this.getRepeatData(),
            floatLabelType: 'Always',
            enableRtl: this.enableRtl,
            index: (<number>this.selectedType),
            fields: {
                text: TEXTFIELD,
                value: VALUEFIELD
            },
            placeholder: this.localeObj.getConstant(REPEAT),
            htmlAttributes: { 'title': this.localeObj.getConstant(REPEAT) },
            change: (args: ChangeEventArgs) => {
                self.setProperties({ selectedType: args.value }, false);
                self.element.querySelector('.' + REPEATCONTENT).innerHTML =
                    self.localeObj.getConstant(contentType[args.value as number | string]);
                self.showFormElement();
                self.updateForm(<string>args.value);
                self.resetFormValues();
                self.triggerChangeEvent();
            }
        });
        // set placeholder to DropDownList input element
        this.repeatType.appendTo(<HTMLElement>this.element.querySelector('.' + REPEATELEMENT));

        this.endType = new DropDownList({
            dataSource: this.getEndData(),
            popupWidth: this.getPopupWidth(),
            enableRtl: this.enableRtl,
            index: 1,
            fields: {
                text: TEXTFIELD,
                value: VALUEFIELD
            },
            change: (args: ChangeEventArgs) => {
                self.freshOnEndForm();
                self.updateEndOnForm(<string>args.value);
                self.resetFormValues();
                self.triggerChangeEvent();
            }
        });
        this.endType.appendTo(<HTMLElement>this.element.querySelector('.' + ENDONELEMENT));

        let renderDropDownList: Function = (dropDownData: [{ [key: string]: string | number }]) => {
            return new DropDownList({
                dataSource: dropDownData,
                popupWidth: this.getPopupWidth(),
                enableRtl: this.enableRtl,
                fields: {
                    text: TEXTFIELD,
                    value: VALUEFIELD
                },
                index: 1,
                change: (args: ChangeEventArgs) => {
                    self.onWeekDay.setProperties({ checked: true });
                    self.resetFormValues();
                    self.triggerChangeEvent();
                }
            });
        };

        this.monthWeekPos = renderDropDownList(this.getMonthPosData());
        this.monthWeekPos.appendTo(<HTMLElement>this.element.querySelector('.' + MONTHPOS));

        this.monthWeekDays = renderDropDownList(this.getDayData('wide'));
        this.monthWeekDays.appendTo(<HTMLElement>this.element.querySelector('.' + MONTHWEEK));

        this.monthValue = new DropDownList({
            dataSource: this.getMonthData(),
            fields: {
                text: TEXTFIELD,
                value: VALUEFIELD
            },
            floatLabelType: 'Always',
            enableRtl: this.enableRtl,
            index: 7,
            change: (args: ChangeEventArgs) => {
                self.resetFormValues();
                self.triggerChangeEvent();
            }
        });
        this.monthValue.appendTo(<HTMLElement>this.element.querySelector('.' + YEAREXPANDERELEMENT));
    }

    private setDefaultValue(): void {
        let formelement: HTMLElement[] = [].slice.call(this.element.querySelectorAll('.e-control .e-numerictextbox'));
        for (let element of formelement) {
            let instance: NumericTextBox = ((element as EJ2Instance).ej2_instances[0] as NumericTextBox);
            if (instance.element.classList.contains(REPEATINTERVAL)) {
                instance.value = 1;
                instance.dataBind();
            } else if (instance.element.classList.contains(ENDONCOUNT)) {
                instance.value = 10;
                instance.dataBind();
            }
        }
    }

    private resetFormValues(): void {
        let recurreneElement: HTMLElement[] = [].slice.call(this.element.querySelectorAll('.e-control [type="text"]'));
        for (let element of recurreneElement) {
            let instance: DatePicker | DropDownList | NumericTextBox;
            if (element.classList.contains('e-datepicker')) {
                instance = (element as EJ2Instance).ej2_instances[0] as DatePicker;
                if (instance.value) {
                    instance.value = instance.value;
                    instance.dataBind();
                } else {
                    this.updateUntilDate(this.startDate);
                }
            } else if (element.classList.contains('e-dropdownlist')) {
                instance = (element as EJ2Instance).ej2_instances[0] as DropDownList;
                instance.index = instance.index || 0;
                instance.dataBind();
            } else if (element.classList.contains('e-numerictextbox')) {
                instance = (element as EJ2Instance).ej2_instances[0] as NumericTextBox;
                let value: number;
                if (instance.element.classList.contains(REPEATINTERVAL)) {
                    value = 1;
                } else if (instance.element.classList.contains(ENDONCOUNT)) {
                    value = 10;
                } else {
                    value = this.startDate.getDate();
                }
                instance.value = instance.value || value;
                instance.dataBind();
            }
        }
    }

    private getPopupWidth(): string {
        return Browser.isDevice ? '100%' : 'auto';
    }
    private renderDatePickers(): void {
        let self: RecurrenceEditor = this;
        this.untilDateObj = new DatePicker({
            enableRtl: this.enableRtl,
            min: this.minDate,
            max: this.maxDate,
            change: (args: ChangedEventArgs) => {
                if (args.value) {
                    self.triggerChangeEvent();
                }
            }
        });
        this.untilDateObj.appendTo(<HTMLElement>this.element.querySelector('.' + UNTILDATE));
    }
    private dayButtonRender(): void {
        let btns: HTMLButtonElement[] = [].slice.call(this.element.querySelectorAll('.' + DAYWRAPPER + ' button'));
        let self: RecurrenceEditor = this;
        for (let btn of btns) {
            let button: Button = new Button({ isToggle: true, enableRtl: this.enableRtl }, btn);
            this.dayButtons.push(button);
            EventHandler.add(btn, 'click', (args: MouseEventArgs) => {
                let btns: HTMLElement[] = [].slice.call(this.element.querySelectorAll('.' + DAYWRAPPER + ' button.' + PRIMARY));
                let element: HTMLElement = <HTMLElement>args.target;
                if (!element.classList.contains(PRIMARY)) {
                    addClass([element], PRIMARY);
                    self.triggerChangeEvent();
                } else if (btns.length > 1) {
                    removeClass([element], PRIMARY);
                    self.triggerChangeEvent();
                }
            });
        }
    }
    private radioButtonRender(): void {
        let self: RecurrenceEditor = this;
        this.onMonthDay = new RadioButton({
            label: this.localeObj.getConstant(RADIOLABEL),
            enableRtl: this.enableRtl,
            name: 'monthType',
            value: 'day',
            change: (args: object) => {
                self.resetFormValues();
                self.triggerChangeEvent();
            }
        });
        this.onMonthDay.appendTo(<HTMLElement>this.element.querySelector('.' + MONTHEXPANDERELEMENT));
        this.monthButtons.push(this.onMonthDay);
        this.onWeekDay = new RadioButton({
            label: '',
            name: 'monthType',
            enableRtl: this.enableRtl,
            value: 'daypos',
            change: (args: object) => {
                self.resetFormValues();
                self.triggerChangeEvent();
            }
        });
        this.onWeekDay.appendTo(<HTMLElement>this.element.querySelector('.' + MONTHEXPANNDERELEM));
        this.monthButtons.push(this.onWeekDay);
    }
    private numericTextboxRender(): void {
        let self: RecurrenceEditor = this;
        this.recurrenceCount = new NumericTextBox({
            value: 10,
            format: '#',
            enableRtl: this.enableRtl,
            floatLabelType: 'Always',
            min: 1,
            change: (args: object) => {
                self.triggerChangeEvent();
            }
        });
        this.recurrenceCount.appendTo(<HTMLElement>this.element.querySelector('.' + ENDONCOUNT));

        this.monthDate = new NumericTextBox({
            value: 1,
            format: '#',
            enableRtl: this.enableRtl,
            min: 1,
            max: 31,
            change: (args: object) => {
                self.onMonthDay.setProperties({ checked: true });
                self.triggerChangeEvent();
            }
        });
        this.monthDate.appendTo(<HTMLElement>this.element.querySelector('.' + MONTHDAYWRAPPER));
        this.repeatInterval = new NumericTextBox({
            value: 1,
            format: '#',
            min: 1,
            enableRtl: this.enableRtl,
            floatLabelType: 'Always',
            placeholder: this.localeObj.getConstant(REPEATEVERY),
            change: (args: object) => {
                self.triggerChangeEvent();
            }
        });
        this.repeatInterval.appendTo(<HTMLElement>this.element.querySelector('.' + REPEATINTERVAL));
    }
    private renderComponent(): void {
        this.setTemplate();
        this.renderDropdowns();
        this.renderDatePickers();
        this.dayButtonRender();
        this.radioButtonRender();
        this.numericTextboxRender();
    }
    private rotateArray(data: (string | number)[], count: number): void {
        let temp: string | number;
        for (let index: number = 0; index < count; index++) {
            temp = data.shift();
            data.push(temp);
        }
    }
    private getEndData(): { [key: string]: string }[] {
        let endData: string[] = [NEVER, UNTIL, COUNT];
        let self: RecurrenceEditor = this;
        let dataSource: { [key: string]: string }[] = [];
        endData.forEach((data: string) => {
            dataSource.push({ text: self.localeObj.getConstant(data), value: data });
        });
        return dataSource;
    }
    private getDayPosition(date: Date): number {
        let temp: Date = new Date(date.getTime());
        let endDate: Date = new Date(date.getTime());
        let day: number = date.getDay();
        let positionCollection: number[] = [];
        temp.setDate(1);
        endDate.setDate(1);
        endDate.setMonth(endDate.getMonth() + 1);
        while (temp < endDate) {
            if (temp.getDay() === day) {
                positionCollection.push(temp.getTime());
            }
            temp.setDate(temp.getDate() + 1);
        }
        if (positionCollection.indexOf(date.getTime()) === positionCollection.length - 1) {
            return -1;
        }
        return (positionCollection.indexOf(date.getTime()) + 1);
    }
    private getRepeatData(): { [key: string]: string }[] {
        let data: { [key: string]: string }[] = [];
        let self: RecurrenceEditor = this;
        this.frequencies.forEach((element: string) => {
            let textValue: string = (element === NONE) ? NEVER : element;
            data.push({ text: self.localeObj.getConstant(textValue), value: element });
        });
        return data;
    }
    private getMonthPosData(): { [key: string]: string | number }[] {
        let monthpos: string[] = [FIRST, SECOND, THIRD, FOURTH, LAST];
        let monthposValue: { [key: string]: number } = {
            first: 1,
            second: 2,
            third: 3,
            fourth: 4,
            last: -1
        };
        let self: RecurrenceEditor = this;
        let dataSource: { [key: string]: string | number }[] = [];
        monthpos.forEach((data: string) => {
            dataSource.push({ text: self.localeObj.getConstant(data), value: monthposValue[data] });
        });
        return dataSource;
    }
    private getDayData(format: DayFormateType): { [key: string]: string }[] {
        let weekday: string[] = [KEYSUNDAY, KEYMONDAY, KEYTUESDAY, KEYWEDNESDAY, KEYTHURSDAY, KEYFRIDAY, KEYSATURDAY];
        let dayData: { [key: string]: string }[] = [];
        let cldrObj: string[];
        this.rotateArray(weekday, this.firstDayOfWeek);
        if (this.locale === 'en' || this.locale === 'en-US') {
            cldrObj = <string[]>(getValue('days.stand-alone.' + format, getDefaultDateObject()));
        } else {
            cldrObj = <string[]>(getValue('main.' + '' + this.locale + '.dates.calendars.gregorian.days.stand-alone.' + format, cldrData));
        }
        for (let obj of weekday) {
            dayData.push({ text: getValue(obj, cldrObj), value: valueData[obj] });
        }
        return dayData;
    }
    private getMonthData(): { [key: string]: string }[] {
        let monthData: { [key: string]: string }[] = [];
        let cldrObj: string[];
        if (this.locale === 'en' || this.locale === 'en-US') {
            cldrObj = <string[]>(getValue('months.stand-alone.wide', getDefaultDateObject()));
        } else {
            cldrObj = <string[]>(getValue('main.' + '' + this.locale + '.dates.calendars.gregorian.months.stand-alone.wide', cldrData));
        }
        for (let obj of Object.keys(cldrObj)) {
            monthData.push({
                text: (<string>getValue(obj, cldrObj)),
                value: obj
            });
        }
        return monthData;
    }
    private setTemplate(): void {
        let dayData: { [key: string]: string }[] = this.getDayData('narrow');
        let fullDay: { [key: string]: string }[] = this.getDayData('wide');
        this.element.innerHTML = '<div class="' + HEADER + '">' +
            '<div class="' + INPUTWARAPPER + ' ' + FORMLEFT + '">' +
            '<input type="text" tabindex="0" class="' + REPEATELEMENT +
            '"label="' + REPEATELEMENT.substr(2) + '" />' +
            '</div><div class="' + INPUTWARAPPER + ' ' +
            INTERVALCLASS + ' ' + FORMRIGHT + '"><table  class="' + RECURRENCETABLE + ' ' + REPEATCONTENTWRAPPER + '"><tr>' +
            '<td><input type="text" tabindex="0" class="' + REPEATINTERVAL +
            '"title="' + this.localeObj.getConstant('repeatInterval') + '" /></td>' +
            '<td><span class="' + REPEATCONTENT + '"></span></td>' +
            '</tr></table></div><div class="' + INPUTWARAPPERSIDE + ' ' + DAYWRAPPER + ' ' + FORMLEFT + '">' +
            '<div class=' + WEEKEXPANDERLABEL + '>' + this.localeObj.getConstant(ON) + '</div>' +
            '<button type="button" class="e-round" data-index="0" title="' + fullDay[0].text + '">' + dayData[0].text + '</button>' +
            '<button type="button" class="e-round" data-index="1" title="' + fullDay[1].text + '">' + dayData[1].text + '</button>' +
            '<button type="button" class="e-round" data-index="2" title="' + fullDay[2].text + '">' + dayData[2].text + '</button>' +
            '<button type="button" class="e-round" data-index="3" title="' + fullDay[3].text + '">' + dayData[3].text + '</button>' +
            '<button type="button" class="e-round" data-index="4" title="' + fullDay[4].text + '">' + dayData[4].text + '</button>' +
            '<button type="button" class="e-round" data-index="5" title="' + fullDay[5].text + '">' + dayData[5].text + '</button>' +
            '<button type="button" class="e-round" data-index="6" title="' + fullDay[6].text + '">' + dayData[6].text + '</button></div>' +
            '<div class="' + INPUTWARAPPERSIDE + ' ' + WEEKWRAPPER + ' ' + FORMLEFT + '">' +
            '<div class=' + MONTHEXPANDERLABEL + '>' + this.localeObj.getConstant(ON) + '</div>' +
            '<div class="' + YEAREXPANDERWRAPPER + '">' +
            '<input class="' + YEAREXPANDERELEMENT + '" type="text" tabindex="0" title="' +
            this.localeObj.getConstant('yearExpander') + '"/>' +
            '</div>' +
            '<div class="' + MONETHEXPANDERWRAPPER + '">' +
            '<table class="' + RECURRENCETABLE + ' ' + MONETHEXPANDWRAPPER + '"><tr><td>' +
            '<div class="' + INPUTWARAPPER + ' ' + MONTHEXPANDERCHECKBOXWRAPPER + '">' +
            '<input class="' + MONTHEXPANDERELEMENT + '"title="' + this.localeObj.getConstant('monthExpander') + '" type="radio">' +
            '</div></td>' +
            '<td colspan="2"><div class="' + INPUTWARAPPER + ' ' + MONTHDAYELEMENT + '">' +
            '<input type="text" tabindex="0" class="' + MONTHDAYWRAPPER + '"title="' +
            this.localeObj.getConstant('monthExpander') + '" />' +
            '</div></td></tr>' +
            '<tr><td>' +
            '<div class="' + INPUTWARAPPER + ' ' + MONTHEXPANDERCHECKBOXWRAPPER + '" style="min-width: 30px;margin-bottom:18px;">' +
            '<input class="' + MONTHEXPANNDERELEM + '"title="' + this.localeObj.getConstant('monthExpander') + '" type="radio">' +
            '</div></td>' +
            '<td><div class="' + INPUTWARAPPER + ' ' + WEEKPOSITION + '" >' +
            '<input type="text" tabindex="0" class="' + MONTHPOS + '"title="' + this.localeObj.getConstant('monthPosition') + '" />' +
            '</div></td>' +
            '<td><div class="' + INPUTWARAPPER + '" >' +
            '<input type="text" tabindex="0" class="' + MONTHWEEK + '"title="' + this.localeObj.getConstant('monthWeek') + '" />' +
            '</div></td></tr></table>' +
            '</div></div>' +
            '<div class="' + INPUTWARAPPERSIDE + ' ' + ENDON + ' ' + FORMRIGHT + '">' +
            '<div class=' + ENDONLABEL + '>' + this.localeObj.getConstant(END) + '</div>' +
            '<div class="' + INPUTWARAPPER + ' ' + ENDONLEFT + '">' +
            '<input type="text" tabindex="0" class="' + ENDONELEMENT + '"title="' + this.localeObj.getConstant(END) + '" />' +
            '</div>' +
            '<div class="' + INPUTWARAPPER + ' ' + ENDONDATE + '" >' +
            '<input type="text" tabindex="0" class="' + UNTILDATE + '"title="' + this.localeObj.getConstant(UNTIL) + '" />' +
            '</div>' +
            '<div class="' + INPUTWARAPPER + ' ' + ENDONCOUNTWRAPPER + '">' +
            '<input type="text" tabindex="0" class="' + ENDONCOUNT + '"title="' + this.localeObj.getConstant(COUNT) + '" />' +
            '</div></div>' +
            '</div></div>';
    }
    private getSelectedDaysData(): string {
        let ruleData: string = RULEBYDAY + EQUAL;
        let elements: NodeListOf<Element> = this.element.querySelectorAll('.' + DAYWRAPPER + ' button.' + PRIMARY);
        let weekday: string[] = [RULESUNDAY, RULEMONDAY, RULETUESDAY, RULEWEDNESDAY, RULETHURSDAY, RULEFRIDAY, RULESATURDAY];
        this.rotateArray(weekday, this.firstDayOfWeek);
        for (let index: number = 0; index < elements.length; index++) {
            ruleData += weekday[parseInt(elements[index].getAttribute('data-index'), 10)] + (index === (elements.length - 1) ? '' : COMMA);
        }
        return ruleData + SEMICOLON;
    }
    private getSelectedMonthData(): string {
        let ruleData: string;
        if (this.onWeekDay.checked) {
            ruleData = RULEBYDAY + EQUAL + this.monthWeekDays.value + SEMICOLON
                + RULESETPOS + EQUAL + this.monthWeekPos.value + SEMICOLON;
        } else {
            ruleData = RULEBYMONTHDAY + EQUAL + this.monthDate.value + SEMICOLON;
        }
        return ruleData;
    }
    private getIntervalData(): string {
        return RULEINTERVAL + EQUAL + this.repeatInterval.value + SEMICOLON;
    }
    private getEndOnCount(): string {
        return RULECOUNT + EQUAL + this.recurrenceCount.value + SEMICOLON;
    }
    private getYearMonthRuleData(): string {
        return RULEBYMONTH + EQUAL + this.monthValue.value + SEMICOLON;
    }
    private updateWeekButton(keys: string[]): void {
        let weekday: string[] = [RULESUNDAY, RULEMONDAY, RULETUESDAY, RULEWEDNESDAY, RULETHURSDAY, RULEFRIDAY, RULESATURDAY];
        this.rotateArray(weekday, this.firstDayOfWeek);
        for (let obj of this.dayButtons) {
            let index: number = parseInt(obj.element.getAttribute('data-index'), 10);
            if (keys.indexOf(weekday[index]) !== -1) {
                obj.setProperties({ isPrimary: true });
            } else {
                obj.setProperties({ isPrimary: false });
            }
        }
    }
    private updateMonthUI(): void {
        if (this.ruleObject.monthDay.length) {
            this.monthDate.setProperties({ value: this.ruleObject.monthDay[0] });
            this.onMonthDay.setProperties({ checked: true });
        } else {
            this.onWeekDay.setProperties({ checked: true });
            this.monthWeekPos.setProperties({ value: this.ruleObject.setPosition });
            for (let key of Object.keys(valueData)) {
                if (valueData[key] === this.ruleObject.day[0]) {
                    this.monthWeekDays.setProperties({ value: this.ruleObject.day[0] });
                    break;
                }
            }
        }
    }
    private updateUI(repeat: string, state: string): void {
        this.repeatInterval.setProperties({ value: this.ruleObject.interval });
        switch (state) {
            case UNTIL:
                this.untilDateObj.setProperties({ value: this.ruleObject.until });
                break;
            case COUNT:
                this.recurrenceCount.setProperties({ value: this.ruleObject.count });
                break;
        }
        switch (repeat) {
            case WEEKLY:
                this.updateWeekButton(this.ruleObject.day);
                break;
            case YEARLY:
                this.monthValue.setProperties({ index: (this.ruleObject.month[0] - 1) });
                this.updateMonthUI();
                break;
            case MONTHLY:
                this.updateMonthUI();
                break;
        }
    }
    private getUntilData(): string {
        let tempStr: string = getRecurrenceStringFromDate(this.untilDateObj.value);
        return RULEUNTIL + EQUAL + tempStr + SEMICOLON;
    }
    private destroyComponents(): void {
        if (!this.recurrenceCount.isDestroyed) {
            this.recurrenceCount.destroy();
        }
        if (!this.monthDate.isDestroyed) {
            this.monthDate.destroy();
        }
        if (!this.repeatInterval.isDestroyed) {
            this.repeatInterval.destroy();
        }
        if (!this.untilDateObj.isDestroyed) {
            this.untilDateObj.destroy();
        }
        if (!this.repeatType.isDestroyed) {
            this.repeatType.destroy();
        }
        if (!this.endType.isDestroyed) {
            this.endType.destroy();
        }
        if (!this.monthWeekPos.isDestroyed) {
            this.monthWeekPos.destroy();
        }
        if (!this.monthWeekDays.isDestroyed) {
            this.monthWeekDays.destroy();
        }
        if (!this.monthValue.isDestroyed) {
            this.monthValue.destroy();
        }
        this.dayButtons.forEach((element: Button) => {
            if (!element.isDestroyed) {
                element.destroy();
            }
        });
        this.dayButtons = [];
        this.monthButtons.forEach((element: RadioButton) => {
            if (!element.isDestroyed) {
                element.destroy();
            }
        });
        this.monthButtons = [];
    }

    public resetFields(): void {
        this.startState(NONE, NEVER, this.startDate);
        this.setDefaultValue();
    }

    public getRuleSummary(rule: string = this.getRecurrenceRule()): string {
        return generateSummary(rule, this.localeObj, this.locale);
    }
    public getRecurrenceDates(startDate: Date, rule: string, excludeDate?: string, maximumCount?: number, viewDate?: Date): number[] {
        viewDate = isNullOrUndefined(viewDate) ? this.startDate : viewDate;
        return generate(startDate, rule, excludeDate, this.firstDayOfWeek, maximumCount, viewDate);
    }
    public getRecurrenceRule(): string {
        let ruleData: string = RULEFREQ + EQUAL;
        switch (this.repeatType.value) {
            case DAILY:
                ruleData += RULEDAILY + SEMICOLON;
                break;
            case WEEKLY:
                ruleData += RULEWEEKLY + SEMICOLON + this.getSelectedDaysData();
                break;
            case MONTHLY:
                ruleData += RULEMONTHLY + SEMICOLON + this.getSelectedMonthData();
                break;
            case YEARLY:
                ruleData += RULEYEARLY + SEMICOLON + this.getSelectedMonthData() + this.getYearMonthRuleData();
                break;
            case NONE:
                return '';
        }
        ruleData += this.getIntervalData();
        switch (this.endType.value) {
            case UNTIL:
                ruleData += this.getUntilData();
                break;
            case COUNT:
                ruleData += this.getEndOnCount();
                break;
        }
        return ruleData;
    }
    public setRecurrenceRule(rule: string, startDate: Date = this.startDate): void {
        if (!rule) {
            this.repeatType.setProperties({ value: NONE });
        }
        this.ruleObject = extractObjectFromRule(rule);
        let endon: string = this.ruleObject.count ? COUNT : (this.ruleObject.until ? UNTIL : NEVER);
        switch (this.ruleObject.freq) {
            case RULEDAILY:
                this.startState(DAILY, endon, startDate);
                this.updateUI(DAILY, endon);
                break;
            case RULEWEEKLY:
                this.startState(WEEKLY, endon, startDate);
                this.updateUI(WEEKLY, endon);
                break;
            case RULEMONTHLY:
                this.startState(MONTHLY, endon, startDate);
                this.updateUI(MONTHLY, endon);
                break;
            case RULEYEARLY:
                this.startState(YEARLY, endon, startDate);
                this.updateUI(YEARLY, endon);
                break;
        }
    }
    /**
     * Destroys the widget.
     * @returns void
     */
    public destroy(): void {
        this.destroyComponents();
        super.destroy();
        let removeClasses: string[] = ['e-' + this.getModuleName()];
        if (this.cssClass) {
            removeClasses = removeClasses.concat(this.cssClass.split(' '));
        }
        removeClass([this.element], removeClasses);
        this.element.innerHTML = '';
    }

    /**
     * Get component name.
     * @returns string
     * @private
     */
    public getModuleName(): string {
        return 'recurrenceeditor';
    }

    /**
     * Get the properties to be maintained in the persisted state.
     * @returns string
     */
    public getPersistData(): string {
        return this.addOnPersist([]);
    }
    /**
     * Initialize the control rendering
     * @returns void
     * @private
     */
    public render(): void {
        this.initialize();
        this.rtlClass(this.enableRtl);
        this.renderStatus = true;
    }
    /**
     * Called internally, if any of the property value changed.
     * @private
     */
    public onPropertyChanged(newProp: RecurrenceEditorModel, oldProp: RecurrenceEditorModel): void {
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'startDate':
                    this.selectMonthDay(newProp.startDate);
                    this.updateUntilDate(newProp.startDate);
                    this.endType.setProperties({ index: 0 });
                    break;
                case 'enableRtl':
                    this.rtlClass(newProp.enableRtl);
                    break;
                case 'cssClass':
                    this.applyCustomClass(newProp.cssClass);
                    break;
                case 'selectedType':
                    this.repeatType.setProperties({ index: this.selectedType });
                    break;
                case 'minDate':
                    this.untilDateObj.setProperties({ minDate: this.minDate });
                    break;
                case 'maxDate':
                    this.untilDateObj.setProperties({ maxDate: this.maxDate });
                    break;
                case 'value':
                    if (this.getRecurrenceRule() !== this.value) {
                        this.setRecurrenceRule(this.value as string);
                    }
                    break;
                case 'locale':
                case 'frequencies':
                case 'firstDayOfWeek':
                    this.refresh();
                    break;
            }
        }
    }
}

export interface RecurrenceEditorChangeEventArgs {
    value: string;
}
type DayFormateType = 'wide' | 'narrow';
export type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
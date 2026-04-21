import { Component, Property, NotifyPropertyChanges, INotifyPropertyChanged, Event, Browser, detach } from '@syncfusion/ej2-base';
import { EmitType, getDefaultDateObject, getValue, cldrData, L10n, isNullOrUndefined, removeClass, addClass } from '@syncfusion/ej2-base';
import { DropDownList, ChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { DatePicker, ChangedEventArgs } from '@syncfusion/ej2-calendars';
import { Button, RadioButton } from '@syncfusion/ej2-buttons';
import { EventHandler, MouseEventArgs, classList } from '@syncfusion/ej2-base';
import { EJ2Instance } from '../schedule/base/interface';
import { RecRule, extractObjectFromRule, generate, generateSummary, getRecurrenceStringFromDate, getCalendarUtil } from './date-generator';
import { RecurrenceEditorModel } from './recurrence-editor-model';
import { CalendarUtil, CalendarType } from '../common/calendar-util';
import { capitalizeFirstWord } from '../schedule/base/util';

const HEADER: string = 'e-editor';
const INPUTWARAPPER: string = 'e-input-wrapper';
const INPUTWARAPPERSIDE: string = 'e-input-wrapper-side';
const REPEATELEMENT: string = 'e-repeat-element';
const REPEATINTERVAL: string = 'e-repeat-interval';
const INTERVALCLASS: string = 'e-interval';
const DAYWRAPPER: string = 'e-days';
const WEEKWRAPPER: string = 'e-non-week';
const WEEKPOSITION: string = 'e-week-position';
const DAYPOSITION: string = 'e-day-position';
const YEAREXPANDERWRAPPER: string = 'e-year-expander';
const YEAREXPANDERELEMENT: string = 'e-year-expander-element';
const MONETHEXPANDERWRAPPER: string = 'e-month-expander';
const MONETHEXPANDWRAPPER: string = 'e-month-expand-wrapper';
const MONTHEXPANDERELEMENT: string = 'e-month-expander-element';
const MONTHEXPANDERCHECKBOXWRAPPER: string = 'e-month-expander-checkbox-wrapper';
const REPEATONWEEKSELECTOR: string = 'e-repeat-on-week-selector';
const FORMLEFT: string = 'e-form-left';
const FORMRIGHT: string = 'e-form-right';
const MONTHDAYWRAPPER: string = 'e-month-day';
const MONTHEXPANNDERELEM: string = 'e-month-expander-wrapper';
const MONTHPOS: string = 'e-month-pos';
const MONTHWEEK: string = 'e-month-week';
const ENDON: string = 'e-end-on';
const MONTHEXPANDERLABEL: string = 'e-month-expander-label';
const WEEKEXPANDERLABEL: string = 'e-week-expander-label';
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
const contentType: { [key: string]: string } = {
    none: '',
    daily: 'days',
    weekly: 'weeks',
    monthly: 'months',
    yearly: 'years'
};
const valueData: { [key: string]: string } = {
    'sun': RULESUNDAY,
    'mon': RULEMONDAY,
    'tue': RULETUESDAY,
    'wed': RULEWEDNESDAY,
    'thu': RULETHURSDAY,
    'fri': RULEFRIDAY,
    'sat': RULESATURDAY
};
const neverClassList: string[] = [DAYWRAPPER, WEEKWRAPPER, ENDON, INTERVALCLASS, YEAREXPANDERWRAPPER, MONETHEXPANDERWRAPPER];
const weekClassList: string[] = [WEEKWRAPPER];
const monthClassList: string[] = [DAYWRAPPER, YEAREXPANDERWRAPPER];
const yearClassList: string[] = [DAYWRAPPER];
const dailyClassList: string[] = [DAYWRAPPER, WEEKWRAPPER, YEAREXPANDERWRAPPER, MONETHEXPANDERWRAPPER];
const noEndClassList: string[] = [ENDONDATE, ENDONCOUNTWRAPPER];
const endOnCountClassList: string[] = [ENDONDATE];
const endOnDateClassList: string[] = [ENDONCOUNTWRAPPER];

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
     *
     * @default ['none', 'daily', 'weekly', 'monthly', 'yearly']
     */
    @Property(['none', 'daily', 'weekly', 'monthly', 'yearly'])
    public frequencies: RepeatType[];

    /**
     * Sets the type of recurrence end for the recurrence pattern on the editor.
     *
     * @default ['never', 'until', 'count']
     */
    @Property(['never', 'until', 'count'])
    public endTypes: EndType[];

    /**
     * Sets the first day of the week.
     *
     * @default 0
     */
    @Property(0)
    public firstDayOfWeek: number;

    /**
     * Sets the start date on recurrence editor.
     *
     * @default new Date()
     * @aspDefaultValue DateTime.Now
     */
    @Property(new Date())
    public startDate: Date;

    /**
     * Sets the user specific date format on recurrence editor.
     *
     * @default null
     */
    @Property()
    public dateFormat: string;

    /**
     * Sets the specific calendar type to be applied on recurrence editor.
     *
     * @default 'Gregorian'
     */
    @Property('Gregorian')
    public calendarMode: CalendarType;

    /**
     * Allows styling with custom class names.
     *
     * @default null
     */
    @Property()
    public cssClass: string;

    /**
     * Sets the recurrence rule as its output values.
     *
     * @default null
     */
    @Property()
    public value: string;

    /**
     * Sets the minimum date on recurrence editor.
     *
     * @default new Date(1900, 0, 1)
     * @aspDefaultValue new DateTime(1900, 1, 1)
     */
    @Property(new Date(1900, 0, 1))
    public minDate: Date;

    /**
     * Sets the maximum date on recurrence editor.
     *
     * @default new Date(2099, 11, 31)
     * @aspDefaultValue new DateTime(2099, 12, 31)
     */
    @Property(new Date(2099, 11, 31))
    public maxDate: Date;

    /**
     * Sets the current repeat type to be set on the recurrence editor.
     *
     * @default 0
     * @aspType int
     */
    @Property(0)
    public selectedType: number;

    /**
     * Triggers for value changes on every sub-controls rendered within the recurrence editor.
     *
     * @event 'change'
     */
    @Event()
    public change: EmitType<RecurrenceEditorChangeEventArgs>;

    /**
     * Triggers when the component is created.
     *
     * @event 'created'
     */
    @Event()
    public created: EmitType<Object>;

    /**
     * Triggers when the component is destroyed.
     *
     * @event 'destroyed'
     */
    @Event()
    public destroyed: EmitType<Object>;

    /**
     * Constructor for creating the widget
     *
     * @param {RecurrenceEditorModel} options Accepts the recurrence editor model properties to initiate the rendering
     * @param {string | HTMLElement} element Accepts the DOM element reference
     */
    constructor(options?: RecurrenceEditorModel, element?: string | HTMLElement) {
        super(options, <string | HTMLElement>element);
    }

    public localeObj: L10n;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private defaultLocale: Record<string, any> = {
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
    private calendarUtil: CalendarUtil;
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
        this.calendarUtil = getCalendarUtil(this.calendarMode);
    }
    private applyCustomClass(cssClass: string): void {
        if (cssClass) {
            addClass([this.element], cssClass.split(' '));
        }
    }
    private initialize(): void {
        addClass([this.element], 'e-' + this.getModuleName());
        this.renderComponent();
        if (typeof this.startDate === 'string') {
            this.setProperties({ startDate: new Date(this.startDate) }, false);
        }
        if (!isNullOrUndefined(this.value) && this.value !== '') {
            this.setRecurrenceRule(this.value as string);
        } else {
            if (!isNullOrUndefined(this.repeatType.value)) {
                this.startState(this.repeatType.value.toString().toUpperCase(), this.endTypes[0], this.startDate);
                this.updateForm(this.repeatType.value.toString());
            }
            if (this.selectedType > 0) {
                this.setProperties({ value: this.getRecurrenceRule() }, false);
            }
        }
        this.applyCustomClass(this.cssClass);
    }
    private triggerChangeEvent(): void {
        if (this.renderStatus) {
            const value: string = this.getRecurrenceRule();
            this.trigger('change', { value: value }, (args: { [key: string]: string }) => this.setProperties({ value: args.value }, false));
        }
    }
    private resetDayButton(): void {
        const elements: HTMLElement[] = [].slice.call(this.element.querySelectorAll('.' + DAYWRAPPER + ' button'));
        elements.forEach((element: HTMLElement) => removeClass([element], [ACTIVE, PRIMARY]));
    }
    private daySelection(dayIndex: number): void {
        this.resetDayButton();
        const days: number[] = [0, 1, 2, 3, 4, 5, 6];
        this.rotateArray(days, this.firstDayOfWeek);
        const element: Element = this.element.querySelector('.' + DAYWRAPPER + ' button[data-index="' + days.indexOf(dayIndex) + '"]');
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
        const tempDate: Date = new Date(date.getTime());
        tempDate.setDate(tempDate.getDate() + 60);
        this.untilDateObj.setProperties({ value: tempDate });
    }
    private selectMonthDay(date: Date): void {
        const weekday: string[] = [KEYSUNDAY, KEYMONDAY, KEYTUESDAY, KEYWEDNESDAY, KEYTHURSDAY, KEYFRIDAY, KEYSATURDAY];
        this.monthDate.setProperties({ value: this.calendarUtil.getDate(date) });
        this.monthWeekDays.setProperties({ value: valueData[weekday[date.getDay()]] });
        this.monthValue.setProperties({ value: '' + this.calendarUtil.getMonth(date) });
        this.monthWeekPos.setProperties({ value: this.getDayPosition(date) });
        this.daySelection(date.getDay());
    }
    private updateForm(state: string): void {
        this.repeatType.setProperties({ value: state });
        const end: Element = this.element.querySelector('.' + ENDON);
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
            const element: Element = this.element.querySelector('.' + className);
            if (element) {
                removeClass([element], HIDEWRAPPER);
            }
        });
    }
    private showFormElement(): void {
        neverClassList.forEach((className: string) => {
            const hideElement: HTMLElement = this.element.querySelector('.' + className);
            if (hideElement) {
                removeClass([hideElement], HIDEWRAPPER);
            }
        });
    }
    private renderDropdowns(): void {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self: RecurrenceEditor = this;
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
                self.setProperties({ selectedType: this.frequencies.indexOf(args.value as RepeatType) }, false);
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
            floatLabelType: 'Always',
            placeholder: this.localeObj.getConstant(END),
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

        const renderDropDownList: Function = (dropDownData: [{ [key: string]: string | number }]) => {
            return new DropDownList({
                dataSource: dropDownData,
                popupWidth: this.getPopupWidth(),
                enableRtl: this.enableRtl,
                fields: {
                    text: TEXTFIELD,
                    value: VALUEFIELD
                },
                index: 1,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
            enableRtl: this.enableRtl,
            index: 7,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            change: (args: ChangeEventArgs) => {
                self.resetFormValues();
                self.triggerChangeEvent();
            }
        });
        this.monthValue.appendTo(<HTMLElement>this.element.querySelector('.' + YEAREXPANDERELEMENT));
    }

    private setDefaultValue(): void {
        const formelement: HTMLElement[] = [].slice.call(this.element.querySelectorAll('.e-control .e-numerictextbox'));
        for (const element of formelement) {
            const instance: NumericTextBox = ((element as EJ2Instance).ej2_instances[0] as NumericTextBox);
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
        const recurreneElement: HTMLElement[] = [].slice.call(this.element.querySelectorAll('.e-control [type="text"]'));
        for (const element of recurreneElement) {
            let instance: DatePicker | DropDownList | NumericTextBox;
            if (element.classList.contains('e-datepicker')) {
                instance = (element as EJ2Instance).ej2_instances[0] as DropDownList;
                if (instance.value) {
                    // eslint-disable-next-line no-self-assign
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
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self: RecurrenceEditor = this;
        this.untilDateObj = new DatePicker({
            firstDayOfWeek: this.firstDayOfWeek,
            enableRtl: this.enableRtl,
            locale: this.locale,
            min: this.minDate,
            max: this.maxDate,
            format: (isNullOrUndefined(this.dateFormat) ? this.getFormat('dateFormats') : this.dateFormat),
            change: (args: ChangedEventArgs) => {
                if (args.value) {
                    self.triggerChangeEvent();
                }
            }
        });
        this.untilDateObj.appendTo(<HTMLElement>this.element.querySelector('.' + UNTILDATE));
    }
    private getFormat(formatType: string): string {
        let format: string;
        if (this.locale === 'en' || this.locale === 'en-US') {
            format = getValue(formatType + '.short', getDefaultDateObject(this.getCalendarMode()));
        } else {
            format = getValue('main.' + '' + this.locale + '.dates.calendars.' + this.getCalendarMode() + '.' + formatType + '.short', cldrData);
        }
        return format;
    }
    private dayButtonRender(): void {
        const btns: HTMLButtonElement[] = [].slice.call(this.element.querySelectorAll('.' + DAYWRAPPER + ' button'));
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self: RecurrenceEditor = this;
        for (const btn of btns) {
            const button: Button = new Button({ isToggle: true, enableRtl: this.enableRtl }, btn);
            this.dayButtons.push(button);
            EventHandler.add(btn, 'click', (args: MouseEventArgs) => {
                const btns: HTMLElement[] = [].slice.call(this.element.querySelectorAll('.' + DAYWRAPPER + ' button.' + PRIMARY));
                const element: HTMLElement = <HTMLElement>args.target;
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
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self: RecurrenceEditor = this;
        this.onMonthDay = new RadioButton({
            label: this.localeObj.getConstant(RADIOLABEL),
            enableRtl: this.enableRtl,
            name: 'monthType',
            value: 'day',
            change: () => {
                self.resetFormValues();
                self.triggerChangeEvent();
            }
        });
        this.onMonthDay.appendTo(<HTMLElement>this.element.querySelector('.' + MONTHEXPANDERELEMENT));
        this.monthButtons.push(this.onMonthDay);
        this.onWeekDay = new RadioButton({
            label: this.localeObj.getConstant('monthExpander'),
            cssClass: 'e-month-type',
            name: 'monthType',
            enableRtl: this.enableRtl,
            value: 'daypos',
            change: () => {
                self.resetFormValues();
                self.triggerChangeEvent();
            }
        });
        this.onWeekDay.appendTo(<HTMLElement>this.element.querySelector('.' + MONTHEXPANNDERELEM));
        this.monthButtons.push(this.onWeekDay);
    }
    private numericTextboxRender(): void {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self: RecurrenceEditor = this;
        this.recurrenceCount = new NumericTextBox({
            value: 10,
            format: '#',
            enableRtl: this.enableRtl,
            min: 1,
            max: 999,
            change: () => {
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
            change: () => {
                self.onMonthDay.setProperties({ checked: true });
                self.triggerChangeEvent();
            }
        });
        this.monthDate.appendTo(<HTMLElement>this.element.querySelector('.' + MONTHDAYWRAPPER));
        this.repeatInterval = new NumericTextBox({
            value: 1,
            format: '#',
            min: 1,
            max: 999,
            enableRtl: this.enableRtl,
            floatLabelType: 'Always',
            placeholder: this.localeObj.getConstant(REPEATEVERY),
            change: () => {
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
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self: RecurrenceEditor = this;
        const dataSource: { [key: string]: string }[] = [];
        this.endTypes.forEach((data: string) => {
            dataSource.push({ text: self.localeObj.getConstant(data), value: data });
        });
        return dataSource;
    }
    private getDayPosition(date: Date): number {
        let temp: Date = new Date(date.getTime());
        let endDate: Date = new Date(date.getTime());
        const day: number = date.getDay();
        const positionCollection: number[] = [];
        temp = this.calendarUtil.getMonthStartDate(temp);
        endDate = this.calendarUtil.getMonthEndDate(endDate);
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
        const data: { [key: string]: string }[] = [];
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self: RecurrenceEditor = this;
        this.frequencies.forEach((element: string) => {
            const textValue: string = (element === NONE) ? NEVER : element;
            data.push({ text: self.localeObj.getConstant(textValue), value: element });
        });
        return data;
    }
    private getMonthPosData(): { [key: string]: string | number }[] {
        const monthpos: string[] = [FIRST, SECOND, THIRD, FOURTH, LAST];
        const monthposValue: { [key: string]: number } = {
            first: 1,
            second: 2,
            third: 3,
            fourth: 4,
            last: -1
        };
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self: RecurrenceEditor = this;
        const dataSource: { [key: string]: string | number }[] = [];
        monthpos.forEach((data: string) => {
            dataSource.push({ text: self.localeObj.getConstant(data), value: monthposValue[`${data}`] });
        });
        return dataSource;
    }
    private getDayData(format: DayFormateType): { [key: string]: string }[] {
        const weekday: string[] = [KEYSUNDAY, KEYMONDAY, KEYTUESDAY, KEYWEDNESDAY, KEYTHURSDAY, KEYFRIDAY, KEYSATURDAY];
        const dayData: { [key: string]: string }[] = [];
        let cldrObj: string[];
        this.rotateArray(weekday, this.firstDayOfWeek);
        if (this.locale === 'en' || this.locale === 'en-US') {
            const nameSpaceString: string = 'days.stand-alone.';
            cldrObj = <string[]>(getValue(nameSpaceString + format, getDefaultDateObject(this.getCalendarMode())));
        } else {
            const nameSpaceString: string =
                'main.' + '' + this.locale + '.dates.calendars.' + this.getCalendarMode() + '.days.stand-alone.' + format;
            cldrObj = <string[]>(getValue(nameSpaceString, cldrData));
        }
        for (const obj of weekday) {
            const day: string = getValue(obj, cldrObj);
            dayData.push({ text: format === 'narrow' ? day : capitalizeFirstWord(day, 'single'), value: valueData[`${obj}`] });
        }
        return dayData;
    }
    private getMonthData(): { [key: string]: string }[] {
        const monthData: { [key: string]: string }[] = [];
        let cldrObj: string[];
        if (this.locale === 'en' || this.locale === 'en-US') {
            const nameSpaceString: string = 'months.stand-alone.wide';
            cldrObj = <string[]>(getValue(nameSpaceString, getDefaultDateObject(this.getCalendarMode())));
        } else {
            const nameSpaceString: string =
                'main.' + '' + this.locale + '.dates.calendars.' + this.getCalendarMode() + '.months.stand-alone.wide';
            cldrObj = <string[]>(getValue(nameSpaceString, cldrData));
        }
        for (const obj of Object.keys(cldrObj)) {
            monthData.push({
                text: capitalizeFirstWord(<string>getValue(obj, cldrObj), 'single'),
                value: obj
            });
        }
        return monthData;
    }
    private setTemplate(): void {
        const dayData: { [key: string]: string }[] = this.getDayData('narrow');
        const fullDay: { [key: string]: string }[] = this.getDayData('wide');
        this.element.innerHTML = '<div class="' + HEADER + '">' +
            '<div class="' + INPUTWARAPPER + ' ' + FORMLEFT + '">' +
            '<input type="text" tabindex="0" class="' + REPEATELEMENT +
            '"label="' + REPEATELEMENT.substr(2) + '" />' +
            '</div><div class="' + INPUTWARAPPER + ' ' +
            INTERVALCLASS + ' ' + FORMRIGHT + '"><table  class="' + RECURRENCETABLE + ' ' + REPEATCONTENTWRAPPER + '"  role="none"><tr>' +
            '<td><input type="text" tabindex="0" id="' + this.element.id + '_' + REPEATINTERVAL + '" class="' + REPEATINTERVAL +
            '"title="' + this.localeObj.getConstant('repeatEvery') + '" /></td>' +
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
            '<table class="' + RECURRENCETABLE + ' ' + MONETHEXPANDWRAPPER + '" role="none"><tr><td>' +
            '<div class="' + INPUTWARAPPER + ' ' + MONTHEXPANDERCHECKBOXWRAPPER + '">' +
            '<input class="' + MONTHEXPANDERELEMENT + '"title="' + this.localeObj.getConstant('monthExpander') + '" type="radio">' +
            '</div></td>' +
            '<td colspan="2"><div class="' + INPUTWARAPPER + ' ' + MONTHDAYELEMENT + '">' +
            '<input type="text" tabindex="0" id="' + this.element.id + '_' + MONTHDAYWRAPPER + '" class="' + MONTHDAYWRAPPER + '"title="' +
            this.localeObj.getConstant('on') + '" />' +
            '</div></td></tr>' +
            '<tr><td>' +
            '<div class="' + INPUTWARAPPER + ' ' + MONTHEXPANDERCHECKBOXWRAPPER + ' ' + REPEATONWEEKSELECTOR + '">' +
            '<input class="' + MONTHEXPANNDERELEM + '"title="' + this.localeObj.getConstant('monthExpander') + '" type="radio">' +
            '</div></td>' +
            '<td><div class="' + INPUTWARAPPER + ' ' + WEEKPOSITION + '" >' +
            '<input type="text" tabindex="0" class="' + MONTHPOS + '"title="' + this.localeObj.getConstant('monthPosition') + '" />' +
            '</div></td>' +
            '<td><div class="' + INPUTWARAPPER + ' ' + DAYPOSITION + '">' +
            '<input type="text" tabindex="0" class="' + MONTHWEEK + '"title="' + this.localeObj.getConstant('monthWeek') + '" />' +
            '</div></td></tr></table>' +
            '</div></div>' +
            '<div class="' + INPUTWARAPPERSIDE + ' ' + ENDON + ' ' + FORMRIGHT + '">' +
            '<div class="' + INPUTWARAPPER + ' ' + ENDONLEFT + '">' +
            '<input type="text" tabindex="0" class="' + ENDONELEMENT + '"title="' + this.localeObj.getConstant(END) + '" />' +
            '</div>' +
            '<div class="' + INPUTWARAPPER + ' ' + ENDONDATE + '" >' +
            '<input type="text" tabindex="0" class="' + UNTILDATE + '"title="' + this.localeObj.getConstant(UNTIL) + '" />' +
            '</div>' +
            '<div class="' + INPUTWARAPPER + ' ' + ENDONCOUNTWRAPPER + '">' +
            '<input type="text" tabindex="0" id="' + this.element.id + '_' + ENDONCOUNT + '" class="' + ENDONCOUNT + '"title="' + this.localeObj.getConstant(COUNT) + '" />' +
            '</div></div>' +
            '</div></div>';
    }
    private getSelectedDaysData(): string {
        let ruleData: string = RULEBYDAY + EQUAL;
        const elements: HTMLElement[] = [].slice.call(this.element.querySelectorAll('.' + DAYWRAPPER + ' button.' + PRIMARY));
        const weekday: string[] = [RULESUNDAY, RULEMONDAY, RULETUESDAY, RULEWEDNESDAY, RULETHURSDAY, RULEFRIDAY, RULESATURDAY];
        this.rotateArray(weekday, this.firstDayOfWeek);
        for (let index: number = 0; index < elements.length; index++) {
            ruleData += weekday[parseInt(elements[parseInt(index.toString(), 10)].getAttribute('data-index'), 10)] + (index === (elements.length - 1) ? '' : COMMA);
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
        const weekday: string[] = [RULESUNDAY, RULEMONDAY, RULETUESDAY, RULEWEDNESDAY, RULETHURSDAY, RULEFRIDAY, RULESATURDAY];
        this.rotateArray(weekday, this.firstDayOfWeek);
        for (const obj of this.dayButtons) {
            const index: number = parseInt(obj.element.getAttribute('data-index'), 10);
            if (keys.indexOf(weekday[parseInt(index.toString(), 10)]) !== -1) {
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
            for (const key of Object.keys(valueData)) {
                if (valueData[`${key}`] === this.ruleObject.day[0]) {
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
        if (!this.untilDateObj.value) {
            return '';
        }
        const tempStr: string = getRecurrenceStringFromDate(this.untilDateObj.value);
        return RULEUNTIL + EQUAL + tempStr + SEMICOLON;
    }
    private destroyComponents(): void {
        if (!this.recurrenceCount.isDestroyed) {
            this.recurrenceCount.destroy();
            this.recurrenceCount = null;
        }
        if (!this.monthDate.isDestroyed) {
            this.monthDate.destroy();
            this.monthDate = null;
        }
        if (!this.repeatInterval.isDestroyed) {
            this.repeatInterval.destroy();
            this.repeatInterval = null;
        }
        if (!this.untilDateObj.isDestroyed) {
            this.untilDateObj.destroy();
            this.untilDateObj = null;
        }
        if (!this.repeatType.isDestroyed) {
            this.repeatType.destroy();
            this.repeatType = null;
        }
        if (!this.endType.isDestroyed) {
            this.endType.destroy();
            this.endType = null;
        }
        if (!this.monthWeekPos.isDestroyed) {
            this.monthWeekPos.destroy();
            this.monthWeekPos = null;
        }
        if (!this.monthWeekDays.isDestroyed) {
            this.monthWeekDays.destroy();
            this.monthWeekDays = null;
        }
        if (!this.monthValue.isDestroyed) {
            this.monthValue.destroy();
            this.monthValue = null;
        }

        if (!this.onMonthDay.isDestroyed) {
            this.onMonthDay.destroy();
            this.onMonthDay = null;
        }

        if (!this.onWeekDay.isDestroyed) {
            this.onWeekDay.destroy();
            this.onWeekDay = null;
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
        this.startState(NONE, this.endTypes[0], this.startDate);
        this.setDefaultValue();
    }
    public updateRuleUntilDate(startDate: Date): void {
        if (this.untilDateObj.value && startDate) {
            const untilDate: Date = this.untilDateObj.value;
            const newUntilDate: Date = new Date(
                untilDate.getFullYear(), untilDate.getMonth(), untilDate.getDate(), startDate.getHours(),
                startDate.getMinutes(), startDate.getMilliseconds());
            this.untilDateObj.setProperties({ value: newUntilDate });
        }
    }
    private getCalendarMode(): string {
        return !isNullOrUndefined(this.calendarMode) ? this.calendarMode.toLowerCase() : 'gregorian';
    }
    public getRuleSummary(rule: string = this.getRecurrenceRule()): string {
        return generateSummary(rule, this.localeObj, this.locale, this.calendarMode);
    }
    public getRecurrenceDates(startDate: Date, rule: string, excludeDate?: string, maximumCount?: number, viewDate?: Date): number[] {
        viewDate = isNullOrUndefined(viewDate) ? this.startDate : viewDate;
        return generate(startDate, rule, excludeDate, this.firstDayOfWeek, maximumCount, viewDate, this.calendarMode);
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
            return;
        }
        this.renderStatus = false;
        this.ruleObject = extractObjectFromRule(rule);
        const endon: string = this.ruleObject.count ? COUNT : (this.ruleObject.until ? UNTIL : NEVER);
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
        this.renderStatus = true;
        this.triggerChangeEvent();
    }

    private detachInputs(): void {
        const inputElements: HTMLInputElement[] = [].slice.call(this.element.querySelectorAll('input'));
        for (const element of inputElements) {
            detach(element);
        }
    }

    /**
     * Destroys the widget.
     *
     * @returns {void}
     */
    public destroy(): void {
        if (!this.isDestroyed) {
            this.destroyComponents();
            super.destroy();
            let removeClasses: string[] = ['e-' + this.getModuleName()];
            if (this.cssClass) {
                removeClasses = removeClasses.concat(this.cssClass.split(' '));
            }
            removeClass([this.element], removeClasses);
            this.detachInputs();
            while (this.element.firstElementChild) {
                this.element.removeChild(this.element.firstElementChild);
            }
        }
    }

    /**
     * Get component name.
     *
     * @returns {string} Returns the module name
     * @private
     */
    public getModuleName(): string {
        return 'recurrenceeditor';
    }

    /**
     * Get the properties to be maintained in the persisted state.
     *
     * @returns {string} Returns the persisted state
     */
    public getPersistData(): string {
        return this.addOnPersist([]);
    }

    /**
     * Initialize the control rendering
     *
     * @returns {void}
     * @private
     */
    public render(): void {
        this.initialize();
        this.rtlClass(this.enableRtl);
        this.renderStatus = true;
        this.renderComplete();
    }

    /**
     * Called internally, if any of the property value changed.
     *
     * @param {RecurrenceEditorModel} newProp Accepts the changed properties new values
     * @param {RecurrenceEditorModel} oldProp Accepts the changed properties old values
     * @returns {void}
     * @private
     */
    public onPropertyChanged(newProp: RecurrenceEditorModel, oldProp: RecurrenceEditorModel): void {
        for (const prop of Object.keys(newProp)) {
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
                if (oldProp.cssClass) { removeClass([this.element], oldProp.cssClass.split(' ')); }
                if (newProp.cssClass) { addClass([this.element], newProp.cssClass.split(' ')); }
                break;
            case 'selectedType':
                this.repeatType.setProperties({ index: this.selectedType });
                break;
            case 'minDate':
                this.untilDateObj.setProperties({ min: this.minDate });
                break;
            case 'maxDate':
                this.untilDateObj.setProperties({ max: this.maxDate });
                break;
            case 'value':
                if (this.getRecurrenceRule() !== this.value) {
                    this.setRecurrenceRule(this.value as string);
                }
                break;
            case 'calendarMode':
                this.calendarMode = newProp.calendarMode;
                this.calendarUtil = getCalendarUtil(newProp.calendarMode);
                break;
            case 'locale':
            case 'frequencies':
            case 'firstDayOfWeek':
            case 'endTypes' :
                this.refresh();
                break;
            case 'dateFormat':
                this.untilDateObj.setProperties({ format: newProp.dateFormat });
                break;
            }
        }
    }
}

/**
 * Interface that holds the option on changing the rule in the recurrence editor.
 */
export interface RecurrenceEditorChangeEventArgs {
    /** Returns the current recurrence rule. */
    value: string;
}
type DayFormateType = 'wide' | 'narrow' | 'short';

/**
 * Defines the repeat type of the recurrence editor.
 * ```props
 * none :- Denotes no repetition.
 * daily :- Denotes repetition every day.
 * weekly :- Denotes repetition every week.
 * monthly :- Denotes repetition every month.
 * yearly :- Denotes repetition every year.
 * ```
 */
export type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

/**
 * Defines the available types of recurrence end for the recurrence editor.
 * ```props
 * The following options are available:
 *
 * never :- Denotes that the recurrence has no end date and continues indefinitely.
 * until :- Denotes that the recurrence ends on a specified date.
 * count :- Denotes that the recurrence ends after a specified number of occurrences.
 * ```
 */
export type EndType = 'never' | 'until' | 'count';

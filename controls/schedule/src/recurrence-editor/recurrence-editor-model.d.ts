import { Component, Property, NotifyPropertyChanges, INotifyPropertyChanged, Event, Browser } from '@syncfusion/ej2-base';import { EmitType, getDefaultDateObject, getValue, cldrData, L10n, isNullOrUndefined, removeClass, addClass } from '@syncfusion/ej2-base';import { DropDownList, ChangeEventArgs } from '@syncfusion/ej2-dropdowns';import { NumericTextBox } from '@syncfusion/ej2-inputs';import { DatePicker, ChangedEventArgs } from '@syncfusion/ej2-calendars';import { Button, RadioButton } from '@syncfusion/ej2-buttons';import { EventHandler, MouseEventArgs, classList } from '@syncfusion/ej2-base';import { EJ2Instance } from '../schedule/base/interface';import { RecRule, extractObjectFromRule, generate, generateSummary, getRecurrenceStringFromDate, getCalendarUtil } from './date-generator';import { CalendarUtil, CalendarType } from '../common/calendar-util';import { capitalizeFirstWord } from '../schedule/base/util';
import {RepeatType,RecurrenceEditorChangeEventArgs} from "./recurrence-editor";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class RecurrenceEditor
 */
export interface RecurrenceEditorModel extends ComponentModel{

    /**
     * Sets the recurrence pattern on the editor.
     *
     * @default ['none', 'daily', 'weekly', 'monthly', 'yearly']
     */
    frequencies?: RepeatType[];

    /**
     * Sets the first day of the week.
     *
     * @default 0
     */
    firstDayOfWeek?: number;

    /**
     * Sets the start date on recurrence editor.
     *
     * @default new Date()
     * @aspDefaultValue DateTime.Now
     */
    startDate?: Date;

    /**
     * Sets the user specific date format on recurrence editor.
     *
     * @default null
     */
    dateFormat?: string;

    /**
     * Sets the specific calendar type to be applied on recurrence editor.
     *
     * @default 'Gregorian'
     */
    calendarMode?: CalendarType;

    /**
     * Allows styling with custom class names.
     *
     * @default null
     */
    cssClass?: string;

    /**
     * Sets the recurrence rule as its output values.
     *
     * @default null
     */
    value?: string;

    /**
     * Sets the minimum date on recurrence editor.
     *
     * @default new Date(1900, 0, 1)
     * @aspDefaultValue new DateTime(1900, 1, 1)
     */
    minDate?: Date;

    /**
     * Sets the maximum date on recurrence editor.
     *
     * @default new Date(2099, 11, 31)
     * @aspDefaultValue new DateTime(2099, 12, 31)
     */
    maxDate?: Date;

    /**
     * Sets the current repeat type to be set on the recurrence editor.
     *
     * @default 0
     * @aspType int
     */
    selectedType?: number;

    /**
     * Triggers for value changes on every sub-controls rendered within the recurrence editor.
     *
     * @event 'change'
     */
    change?: EmitType<RecurrenceEditorChangeEventArgs>;

}
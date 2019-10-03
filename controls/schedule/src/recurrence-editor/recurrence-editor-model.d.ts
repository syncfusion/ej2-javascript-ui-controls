import { Component, Property, NotifyPropertyChanges, INotifyPropertyChanged, Event, Browser, isBlazor } from '@syncfusion/ej2-base';import { EmitType, getDefaultDateObject, getValue, cldrData, L10n, isNullOrUndefined, removeClass, addClass } from '@syncfusion/ej2-base';import { DropDownList, ChangeEventArgs } from '@syncfusion/ej2-dropdowns';import { NumericTextBox } from '@syncfusion/ej2-inputs';import { DatePicker, ChangedEventArgs } from '@syncfusion/ej2-calendars';import { Button, RadioButton } from '@syncfusion/ej2-buttons';import { EventHandler, MouseEventArgs, classList } from '@syncfusion/ej2-base';import { EJ2Instance } from '../schedule/base/interface';import { RecRule, extractObjectFromRule, generate, generateSummary, getRecurrenceStringFromDate, getCalendarUtil } from './date-generator';import { CalendarUtil, CalendarType } from '../common/calendar-util';
import {RepeatType,RecurrenceEditorChangeEventArgs} from "./recurrence-editor";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class RecurrenceEditor
 */
export interface RecurrenceEditorModel extends ComponentModel{

    /**
     * Sets the recurrence pattern on the editor.

     */
    frequencies?: RepeatType[];

    /**
     * Sets the first day of the week.

     */
    firstDayOfWeek?: number;

    /**
     * Sets the start date on recurrence editor.



     */
    startDate?: Date;

    /**
     * Sets the user specific date format on recurrence editor.

     */
    dateFormat?: string;

    /**
     * Sets the specific calendar type to be applied on recurrence editor.

     */
    calendarMode?: CalendarType;

    /**
     * Allows styling with custom class names.

     */
    cssClass?: string;

    /**
     * Sets the recurrence rule as its output values.

     */
    value?: String;

    /**
     * Sets the minimum date on recurrence editor.



     */
    minDate?: Date;

    /**
     * Sets the maximum date on recurrence editor.



     */
    maxDate?: Date;

    /**
     * Sets the current repeat type to be set on the recurrence editor.

     */
    selectedType?: Number;

    /**
     * Triggers for value changes on every sub-controls rendered within the recurrence editor.
     * @event

     */
    change?: EmitType<RecurrenceEditorChangeEventArgs>;

}
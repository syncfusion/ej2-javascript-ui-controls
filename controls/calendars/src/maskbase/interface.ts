import { Component, L10n,Internationalization } from '@syncfusion/ej2-base';
import { CalendarType } from '../calendar/calendar';

/**
 * Specifies mulitselct interfaces.
 *
 * @hidden
 */


export interface IMaskedDateTime extends Component<HTMLElement> {
    format?: string;
    maskPlaceholder: { [x: string]: Object };
    maskedDateValue: string;
    locale: string;
    inputElement: HTMLInputElement;
    value: Date;
    updateInputValue(value?: string): void
    dateTimeFormat: string
    formatString: string
    moduleName: string
    cldrTimeFormat(): string
    calendarMode: CalendarType;
    globalize: Internationalization;
}

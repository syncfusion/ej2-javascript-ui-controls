import { Component, L10n } from '@syncfusion/ej2-base';

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
}

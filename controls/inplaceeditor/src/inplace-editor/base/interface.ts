import { ButtonModel } from '@syncfusion/ej2-buttons';
import { ColorPicker, Slider } from '@syncfusion/ej2-inputs';
import { RichTextEditor } from '@syncfusion/ej2-richtexteditor';
import { DateRangePicker, TimePicker } from '@syncfusion/ej2-calendars';
import { AutoComplete, ComboBox, MultiSelect } from '@syncfusion/ej2-dropdowns';
import { RenderMode } from './inplace-editor';

/**
 * Defines component types that can be used in the In-place Editor.
 * @hidden
 */

export type Component = AutoComplete | ColorPicker | ComboBox | DateRangePicker | MultiSelect | RichTextEditor | Slider | TimePicker;

/**
 * Provides information about a Notify.
 */
export interface NotifyParams {
    type?: string;
    module: string;
    target?: HTMLElement | HTMLInputElement;
}

/**
 * Provides information about a Component.
 */
export interface IComponent {
    showPopup?(): void;
    compObj: Component;
    render(e: NotifyParams): void;
    focus(): void;
    updateValue(e: NotifyParams): void;
    refresh?(): void;
    getRenderValue?(): void;
}

/**
 * Provides information about a Button.
 */
export interface IButton {
    type: string;
    constant: string;
    title: Object;
    className: string;
    model: ButtonModel;
    container: HTMLElement;
}

/**
 * Provides information about a ActionBegin event.
 */
export interface ActionBeginEventArgs {
    /** Defines the name of the field */
    data: { [key: string]: string | number };
    /** Prevent the submit action. */
    cancel?: boolean;
}

/**
 * Provides information about a Action event.
 */
export interface ActionEventArgs {
    /** Prevents the current value render in the editor. */
    cancel?: boolean;
    /** Defines the data manager action result. */
    data: Object;
    /** Defines the current editor value */
    value: string;
}

/**
 * Provides information about a Form event.
 */
export interface FormEventArgs {
    inputName: string;
    message: string;
    element: HTMLInputElement;
    status?: string;
    errorElement?: HTMLElement;
}

/**
 * Provides information about a Validate event.
 */
export interface ValidateEventArgs extends ActionBeginEventArgs {
    /** Defines form validation error message. */
    errorMessage: string;
}

/**
 * Provides information about a BeginEdit event.
 */
export interface BeginEditEventArgs {
    /** Specifies whether to cancel the open action of the editor. */
    cancel?: boolean;
    /** Specifies whether to cancel the focus action, before open a editor. */
    cancelFocus?: boolean;
    /** Defines the current editor mode. */
    mode?: RenderMode;
}
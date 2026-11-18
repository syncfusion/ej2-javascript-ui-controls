import { Property, ChildProperty } from '@syncfusion/ej2-base';import { SelectionMode } from '../common/index';

/**
 * Interface for a class ScrollSettings
 */
export interface ScrollSettingsModel {

    /**
     * By default, the scroll mode is infinite. Set it to `true` to make it as finite.
     *
     * @default false
     */
    isFinite?: boolean;

    /**
     * If `enableVirtualization` is set to true, then the spreadsheet will render only the rows and columns visible within the view-port
     * and load subsequent rows and columns based on scrolling.
     *
     * @default true
     */
    enableVirtualization?: boolean;

}

/**
 * Interface for a class SelectionSettings
 */
export interface SelectionSettingsModel {

    /**
     * Specifies the selection mode. The possible values are
     *
     * * `None`: It disables UI selection.
     * * `Single`: It allows single selection of cell / row / column and disables multiple selection.
     * * `Multiple`: It allows single / multiple selection of cell / row / column.
     *
     * @default 'Multiple'
     */
    mode?: SelectionMode;

}

/**
 * Interface for a class AIAssistSettings
 */
export interface AIAssistSettingsModel {

    /**
     * Specifies the service endpoint URL where the Spreadsheet AI assist sends chat requests and receives responses.
     *
     * @default null
     */
    requestUrl?: string;

    /**
     * Specifies the placeholder text displayed in the AI assist chat input box.
     *
     * @default null
     */
    placeholder?: string;

    /**
     * Specifies a list of sample prompts displayed in the AI assist chat to help users initiate a conversation.
     *
     * @default null
     */
    promptSuggestions?: string[];

}
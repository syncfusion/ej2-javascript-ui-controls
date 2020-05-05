import { Property, ChildProperty } from '@syncfusion/ej2-base';import { SelectionType } from '../base/type';

/**
 * Interface for a class CardSettings
 */
export interface CardSettingsModel {

    /**
     * Show or hide the card header
     * @default true
     */
    showHeader?: boolean;

    /**
     * Defines the card header text
     * @default null
     */
    headerField?: string;

    /**
     * Defines the card content text
     * @default null
     */
    contentField?: string;

    /**
     * Defines the card template
     * @default null
     * @deprecated
     */
    template?: string;

    /**
     * Defines the card order
     * @default null
     * @deprecated
     */
    priority?: string;

    /**
     * It defines the card selection type, which accepts either of the following values.
     * * Single
     * * Multiple
     * * None
     * @default 'Single'
     */
    selectionType?: SelectionType;

}
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
     */
    template?: string;

    /**
     * Defines the card selection type.
     * @default 'Single'
     */
    selectionType?: SelectionType;

}
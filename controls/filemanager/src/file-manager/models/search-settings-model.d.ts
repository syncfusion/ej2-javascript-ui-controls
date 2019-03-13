import { Property, ChildProperty } from '@syncfusion/ej2-base';
import {FilterType} from "./search-settings";

/**
 * Interface for a class SearchSettings
 */
export interface SearchSettingsModel {

    /**
     * Enable or disable the allowSearchOnTyping.
     * @default true
     */
    allowSearchOnTyping?: boolean;

    /**
     * Specifies the filter type while searching the content.
     * @default 'contains'
     */
    filterType?: FilterType;

    /**
     *  Enable or disable the case sensitive.
     * @default true
     */
    ignoreCase?: boolean;

}
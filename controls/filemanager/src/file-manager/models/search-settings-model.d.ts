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
     * If ignoreCase is set to false, searches files that match exactly, 
     * else searches files that are case insensitive(uppercase and lowercase letters treated the same).
     * @default true
     */
    ignoreCase?: boolean;

}
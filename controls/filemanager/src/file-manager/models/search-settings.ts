import { Property, ChildProperty } from '@syncfusion/ej2-base';
export type FilterType = 'contains' | 'startsWith' | 'endsWith';

/**
 * Specifies the Search settings of the File Manager.
 */
export class SearchSettings extends ChildProperty<SearchSettings> {
    /**
     * Enables or disables the allowSearchOnTyping.

     */
    @Property(true)
    public allowSearchOnTyping: boolean;

    /**
     * Specifies the filter type while searching the content. The available filter types are:
     * * `contains`
     * * `startsWith`
     * * `endsWith`

     */
    @Property('contains')
    public filterType: FilterType;

    /**
     * If ignoreCase is set to false, searches files that match exactly,
     * else searches files that are case insensitive(uppercase and lowercase letters treated the same).

     */
    @Property(true)
    public ignoreCase: boolean;
}


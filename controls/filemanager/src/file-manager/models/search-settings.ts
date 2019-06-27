import { Property, ChildProperty } from '@syncfusion/ej2-base';
export type FilterType = 'contains' | 'startsWith' | 'endsWith';

/**
 * Specifies the Search settings of the File Manager.
 */
export class SearchSettings extends ChildProperty<SearchSettings> {
    /**
     * Enables or disables the allowSearchOnTyping.
     * @default true
     */
    @Property(true)
    public allowSearchOnTyping: boolean;

    /**
     * Specifies the filter type while searching the content. The available filter types are:
     * * `contains`
     * * `startsWith`
     * * `endsWith`
     * @default 'contains'
     */
    @Property('contains')
    public filterType: FilterType;

    /**
     * If ignoreCase is set to false, searches files that match exactly,
     * else searches files that are case insensitive(uppercase and lowercase letters treated the same).
     * @default true
     */
    @Property(true)
    public ignoreCase: boolean;
}


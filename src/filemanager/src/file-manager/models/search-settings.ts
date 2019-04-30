import { Property, ChildProperty } from '@syncfusion/ej2-base';

export type FilterType = 'contains' | 'startWith' | 'endsWith';

/**
 * Specifies the Ajax settings of the File Manager.
 */
export class SearchSettings extends ChildProperty<SearchSettings> {
    /**
     * Enable or disable the allowSearchOnTyping.
     * @default true
     */
    @Property(true)
    public allowSearchOnTyping: boolean;

    /**
     * Specifies the filter type while searching the content.
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


import { Property, ChildProperty } from '@syncfusion/ej2-base';
/**
 * Specifies the filter type for Search settings of the File Manager.
 */
export type FilterType = 
/**
 * It will only show files and folders whose names contain the entered word.
 */
'contains' | 
/**
 * It will only show files and folders whose names start with entered word.
 */
'startsWith' | 
/**
 * It will only show files and folders whose names end with entered word.
 */
'endsWith';

/**
 * Specifies the Search settings of the File Manager.
 */
export class SearchSettings extends ChildProperty<SearchSettings> {
    /**
     * Enables or disables the allowSearchOnTyping.
     *
     * @default true
     */
    @Property(true)
    public allowSearchOnTyping: boolean;

    /**
     * Specifies the filter type while searching the content. The available filter types are:
     * * `contains`
     * * `startsWith`
     * * `endsWith`
     *
     * @default 'contains'
     */
    @Property('contains')
    public filterType: FilterType;

    /**
     * If ignoreCase is set to false, searches files that match exactly,
     * else searches files that are case insensitive(uppercase and lowercase letters treated the same).
     *
     * @default true
     */
    @Property(true)
    public ignoreCase: boolean;

    /**
     * Specifies the placeholder value to the search input of the File Manager component.
     * It accepts string.
     *
     * @default null
     */
    @Property(null)
    public placeholder: string;
}


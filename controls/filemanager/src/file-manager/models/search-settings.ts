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
     *  Enable or disable the case sensitive.
     * @default true
     */
    @Property(true)
    public ignoreCase: boolean;
}


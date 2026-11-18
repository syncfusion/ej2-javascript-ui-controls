import { ChildProperty, Property } from '@syncfusion/ej2-base';

/**
 * Interface for a class FindSettings
 */
export interface FindSettingsModel {
    /**
     * Specifies the current Find text. An empty string clears Find state.
     *
     * @default ''
     */
    key?: string;

    /**
     * If true, letter case must match.
     *
     * @default false
     */
    caseSensitive?: boolean;

    /**
     * If true, Find candidates are restricted to the current page.
     *
     * @default false
     */
    currentPageOnly?: boolean;

}

/**
 * Configures the Find behavior of the Grid.
 * Find highlights and navigates cell text occurrences. It does not filter records.
 */
export class FindSettings extends ChildProperty<FindSettings> {
    /**
     * Specifies the current Find text. An empty string clears Find state.
     * The value is not trimmed or numerically normalized.
     *
     * @default ''
     */
    @Property('')
    public key: string;

    /**
     * If `caseSensitive` is true, letter case must match. The default is case-insensitive.
     * Matching is accent-sensitive.
     *
     * @default false
     */
    @Property(false)
    public caseSensitive: boolean;

    /**
     * If `currentPageOnly` is true, Find candidates are restricted to the current page.
     * When false, Find covers all client-enumerable filtered records and navigation may change the page.
     *
     * @default false
     */
    @Property(false)
    public currentPageOnly: boolean;

}

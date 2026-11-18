import { ChildProperty, Property } from '@syncfusion/ej2-base';

/**
 * Interface for a class FindSettings
 */
export interface FindSettingsModel {

    /**
     * Specifies the current Find text. An empty string clears Find state.
     * The value is not trimmed or numerically normalized.
     *
     * @default ''
     */
    key?: string;

    /**
     * If `caseSensitive` is true, letter case must match. The default is case-insensitive.
     * Matching is accent-sensitive.
     *
     * @default false
     */
    caseSensitive?: boolean;

    /**
     * If `currentPageOnly` is true, Find candidates are restricted to the current page.
     * When false, Find covers all client-enumerable filtered records and navigation may change the page.
     *
     * @default false
     */
    currentPageOnly?: boolean;

}
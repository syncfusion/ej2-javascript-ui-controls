import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Interface for a class ColumnChooserSettings
 */
export interface ColumnChooserSettingsModel {

    /**
     * Defines the search operator for Column Chooser.
     *
     * @default 'startsWith'
     * @blazorType Syncfusion.Blazor.Operator
     * @blazorDefaultValue Syncfusion.Blazor.Operator.StartsWith
     */
    operator?: string;

    /**
     * If ignoreAccent set to true, then ignores the diacritic characters or accents while searching in column chooser dialog.
     *
     * @default false
     */
    ignoreAccent?: boolean;

}
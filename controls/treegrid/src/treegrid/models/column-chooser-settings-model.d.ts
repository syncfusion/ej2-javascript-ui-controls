import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Interface for a class ColumnChooserSettings
 */
export interface ColumnChooserSettingsModel {

    /**
     * Defines the search operator for column chooser.
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

    /**
     * Defines the custom header elements for the column chooser header template.
     *
     * @default null
     * @aspType string
     */
    headerTemplate?: string | Function;

    /**
     * Defines the custom content elements for the column chooser content template.
     *
     * @default null
     * @aspType string
     */
    template?: string | Function;

    /**
     * Defines the custom footer elements for the column chooser footer template.
     *
     * @default null
     * @aspType string
     */
    footerTemplate?: string | Function;

    /**
     * Enables or disables the search option in the column chooser.
     *
     * @default true
     */
    enableSearching?: boolean;

    /**
     * Renders a custom component to replace or extend the default column chooser UI.
     * @param target - The target HTML element where the custom component will be appended in the column chooser dialog.
     * @aspType string
     */
    renderCustomColumnChooser?: string | Function;

}
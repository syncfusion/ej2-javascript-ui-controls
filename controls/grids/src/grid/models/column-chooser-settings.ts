import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Configures the column chooser behavior of the Grid.
 */
export class ColumnChooserSettings extends ChildProperty<ColumnChooserSettings> {
    /**
     * Defines the search operator for column chooser.
     *
     * @default 'startsWith'
     * @blazorType Syncfusion.Blazor.Operator
     * @blazorDefaultValue Syncfusion.Blazor.Operator.StartsWith
     */
    @Property('startsWith')
    public operator: string;

    /**
     * If ignoreAccent set to true, then ignores the diacritic characters or accents while searching in column chooser dialog.
     *
     * @default false
     */
    @Property(false)
    public ignoreAccent: boolean;

    /**
     * Defines the custom header elements for the column chooser header template.
     *
     * @default null
     * @aspType string
     */
    @Property(null)
    public headerTemplate: string | Function;

    /**
     * Defines the custom content elements for the column chooser content template.
     *
     * @default null
     * @aspType string
     */
    @Property(null)
    public template: string | Function;

    /**
     * Defines the custom footer elements for the column chooser footer template.
     *
     * @default null
     * @aspType string
     */
    @Property(null)
    public footerTemplate: string | Function;

    /**
     * Enables or disables the search option in the column chooser.
     *
     * @default true
     */
    @Property(true)
    public enableSearching: boolean;

    /**
     * Renders a custom component to replace or extend the default column chooser UI.
     * @param target - The target HTML element where the custom component will be appended in the column chooser dialog.
     * @aspType string
     */
    @Property(null)
    public renderCustomColumnChooser: string | Function;
}

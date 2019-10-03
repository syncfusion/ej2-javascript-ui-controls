import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Specifies the navigationpane settings of the File Manager.
 */
export class NavigationPaneSettings extends ChildProperty<NavigationPaneSettings> {
    /**
     * Specifies the maximum width of navigationpane.

     */
    @Property('650px')
    public maxWidth: string | number;

    /**
     * Specifies the minimum width of navigationpane.

     */
    @Property('240px')
    public minWidth: string | number;

    /**
     * Enables or disables the navigation pane.

     */
    @Property(true)
    public visible: boolean;
}


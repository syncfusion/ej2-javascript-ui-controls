import { Property, ChildProperty } from '@syncfusion/ej2-base';
import { ToolPanelPosition, ToolPanelDisplayType, ToolPanelType } from '../base/enum';
import { ToolPanelModel } from '../base/interface';

/**
 * Configures the sidebar tool panel of the Grid.
 */
export class ToolpanelSettings extends ChildProperty<ToolpanelSettings> {
    /**
     * Defines the edge of the Grid where the side bar is docked. The position is mirrored in RTL mode.
     *
     * @default 'Right'
     */
    @Property('Right')
    public position: ToolPanelPosition;

    /**
     * Defines whether the opened panel pushes the Grid content (`Push`) or overlays it (`Over`).
     *
     * @default 'Push'
     */
    @Property('Push')
    public type: ToolPanelDisplayType;

    /**
     * Defines the width of the opened tool panel.
     *
     * @default '280px'
     */
    @Property('280px')
    public width: string | number;

    /**
     * Hides the whole side bar until `toggleSideBar` is called.
     *
     * @default false
     */
    @Property(false)
    public hiddenByDefault: boolean;

    /**
     * Defines the id of the panel that is opened on initial render.
     *
     * @default ''
     */
    @Property('')
    public defaultToolPanel: string;

    /**
     * Defines the panels shown in the side bar. The order defines the button order.
     * Built-in panels can be given by name (`'Columns'`, `'Filters'`, `'Edit'`) or configured as `ToolPanelModel`.
     *
     * @default ['Columns', 'Filters', 'Edit']
     */
    @Property(['Columns', 'Filters', 'Edit'])
    public toolPanels: (ToolPanelType | ToolPanelModel)[];
}

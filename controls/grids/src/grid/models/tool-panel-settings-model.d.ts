import { Property, ChildProperty } from '@syncfusion/ej2-base';import { ToolPanelPosition, ToolPanelDisplayType, ToolPanelType } from '../base/enum';import { ToolPanelModel } from '../base/interface';

/**
 * Interface for a class ToolpanelSettings
 */
export interface ToolpanelSettingsModel {

    /**
     * Defines the edge of the Grid where the side bar is docked. The position is mirrored in RTL mode.
     *
     * @default 'Right'
     */
    position?: ToolPanelPosition;

    /**
     * Defines whether the opened panel pushes the Grid content (`Push`) or overlays it (`Over`).
     *
     * @default 'Push'
     */
    type?: ToolPanelDisplayType;

    /**
     * Defines the width of the opened tool panel.
     *
     * @default '280px'
     */
    width?: string | number;

    /**
     * Hides the whole side bar until `toggleSideBar` is called.
     *
     * @default false
     */
    hiddenByDefault?: boolean;

    /**
     * Defines the id of the panel that is opened on initial render.
     *
     * @default ''
     */
    defaultToolPanel?: string;

    /**
     * Defines the panels shown in the side bar. The order defines the button order.
     * Built-in panels can be given by name (`'Columns'`, `'Filters'`, `'Edit'`) or configured as `ToolPanelModel`.
     *
     * @default ['Columns', 'Filters', 'Edit']
     */
    toolPanels?: (ToolPanelType | ToolPanelModel)[];

}
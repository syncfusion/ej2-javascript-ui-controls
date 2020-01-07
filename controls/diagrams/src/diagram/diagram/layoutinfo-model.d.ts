import { Property, ChildProperty } from '@syncfusion/ej2-base';import { Orientation } from '@syncfusion/ej2-navigations';import { SubTreeAlignments } from '../enum/enum';

/**
 * Interface for a class LayoutInfo
 */
export interface LayoutInfoModel {

    /**
     * Defines the orientation of the layout
     * @default'Horizontal'
     */
    orientation?: Orientation;

    /**
     * Defines the type for the subtree 
     * @default'Center'
     * @blazorDefaultValue 'Center'
     * @isEnumeration true
     */
    type?: SubTreeAlignments;

    /**
     * Defines the offset value
     * @default undefined
     */
    offset?: number;

    /**
     * Defines the routing for the layout
     * @default false
     */
    enableRouting?: boolean;

    /**
     * Defines the children for the layout
     * @default []
     */
    children?: string[];

    /**
     * Defines assistant for the layout
     * @blazorDefaultValueIgnore
     * @default ''
     * @aspDefaultValueIgnore
     * @isBlazorNullableType true
     */
    assistants?: Orientation;

    /**
     * Defines the level for the layout
     * @blazorDefaultValueIgnore
     */
    level?: number;

    /**
     * Defines the subtree for the layout
     * @blazorDefaultValueIgnore
     */
    hasSubTree?: boolean;

    /**
     * Defines the row for the layout
     * @blazorDefaultValueIgnore
     */
    rows?: number;

}
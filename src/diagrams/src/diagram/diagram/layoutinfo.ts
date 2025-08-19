import { Property, ChildProperty } from '@syncfusion/ej2-base';
import { Orientation } from '@syncfusion/ej2-navigations';
import { SubTreeAlignments } from '../enum/enum';


/**
 * A collection of JSON objects where each object represents a layer.
 * Layer is a named category of diagram shapes.
 */

export class LayoutInfo extends ChildProperty<LayoutInfo> {
    /* eslint-disable */
    /**
     * Defines the orientation of the layout
     *
     * @default'Horizontal'
     */
    @Property('Horizontal')
    public orientation: Orientation;



    /**
     * Defines the type for the subtree
     *
     * @default'Center'
     * @blazorDefaultValue 'Center'
     * @isEnumeration true
     */
    @Property('Center')
    public type: SubTreeAlignments;
    /* eslint-enable */



    /**
     * Defines the offset value
     *
     * @default undefined
     */
    @Property(undefined)
    public offset: number;

    /**
     * Defines the routing for the layout
     *
     * @default false
     */
    @Property(false)
    public enableRouting: boolean;
    /**
     * Defines the children for the layout
     *
     * @default []
     */
    @Property([])
    public children: string[];

    /**
     * Defines assistant for the layout
     *
     * @default ''
     * @aspDefaultValueIgnore
     * @isBlazorNullableType true
     */
    @Property('')
    public assistants: Orientation;

    /**
     * Defines the level for the layout
     *
     */
    @Property('')
    public level: number;

    /**
     * Defines the subtree for the layout
     *
     */
    @Property('')
    public hasSubTree: boolean;

    /**
     * Defines the row for the layout
     *
     */
    @Property('')
    public rows: number;

}






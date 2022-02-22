import { Property, Complex, ChildProperty } from '@syncfusion/ej2-base';
import { Margin } from '../core/appearance';
import { MarginModel } from '../core/appearance-model';
import { DiagramTooltipModel } from './tooltip-model';
import { DiagramTooltip } from './tooltip';
import { FlipDirection, FlipMode } from '../enum/enum';
import { SymbolPaletteInfoModel } from './preview-model';
import { SymbolPaletteInfo } from './preview';



/**
 * Defines the common behavior of nodes, connectors and groups
 */

export abstract class NodeBase extends ChildProperty<NodeBase> {
    /**
     * Represents the unique id of nodes/connectors
     *
     * @default ''
     */
    @Property('')
    public id: string;

    /**
     * Defines the visual order of the node/connector in DOM
     *
     * @default -1
     */
    @Property(-1)
    public zIndex: number;

    /**
     * Defines the space to be left between the node and its immediate parent
     *
     * @default {}
     */
    @Complex<MarginModel>({}, Margin)
    public margin: MarginModel;

    /**
     * Sets the visibility of the node/connector
     *
     * @default true
     */
    @Property(true)
    public visible: boolean;

    /**
     * defines the tooltip for the node
     *
     * @default {}
     */
    @Complex<DiagramTooltipModel>({}, DiagramTooltip)
    public tooltip: DiagramTooltipModel;

    /**
     * Defines whether the node should be automatically positioned or not. Applicable, if layout option is enabled.
     *
     * @default false
     */
    @Property(false)
    public excludeFromLayout: boolean;

    /**
     * Allows the user to save custom information/data about a node/connector
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public addInfo: Object;

    /**
     * Flip the element in Horizontal/Vertical directions
     *
     * @aspDefaultValueIgnore
     * @default None
     */
    @Property('None')
    public flip: FlipDirection;

    /**
     * Allows you to flip only the node or along with port and label
     *
     * @aspDefaultValueIgnore
     * @default All
     */
     @Property('All')
     public flipMode: FlipMode;

    /**
     * Defines the symbol info of a connector
     *
     * @aspDefaultValueIgnore
     * @default undefined
     * @ignoreapilink
     */
    @Complex<SymbolPaletteInfoModel>({}, SymbolPaletteInfo)
    public symbolInfo: SymbolPaletteInfoModel;
}


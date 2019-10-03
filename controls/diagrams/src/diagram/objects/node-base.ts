import { Property, Complex, ChildProperty, Collection } from '@syncfusion/ej2-base';
import { Margin } from '../core/appearance';
import { PointPortModel } from './port-model';
import { MarginModel } from '../core/appearance-model';
import { DiagramTooltipModel } from './tooltip-model';
import { IconShape } from './icon';
import { IconShapeModel } from './icon-model';
import { DiagramTooltip } from './tooltip';
import { PointPort } from './port';
import { FlipDirection } from '../enum/enum';



/**
 * Defines the common behavior of nodes, connectors and groups
 */

export abstract class NodeBase extends ChildProperty<NodeBase> {
    /**
     * Represents the unique id of nodes/connectors

     */
    @Property('')
    public id: string;

    /**
     * Defines the visual order of the node/connector in DOM

     */
    @Property(-1)
    public zIndex: number;

    /**
     * Defines the space to be left between the node and its immediate parent

     */
    @Complex<MarginModel>({}, Margin)
    public margin: MarginModel;

    /**
     * Sets the visibility of the node/connector

     */
    @Property(true)
    public visible: boolean;

    /**
     * Defines the collection of connection points of nodes/connectors



     */
    @Collection<PointPortModel>([], PointPort)
    public ports: PointPortModel[];

    /**
     * Defines whether the node is expanded or not

     */
    @Property(true)
    public isExpanded: boolean;

    /** 
     * defines the tooltip for the node

     */
    @Complex<DiagramTooltipModel>({}, DiagramTooltip)
    public tooltip: DiagramTooltipModel;

    /**
     * Defines the expanded state of a node

     */
    @Complex<IconShapeModel>({}, IconShape)
    public expandIcon: IconShapeModel;

    /**
     * Defines the collapsed state of a node

     */
    @Complex<IconShapeModel>({}, IconShape)
    public collapseIcon: IconShapeModel;

    /**
     * Defines whether the node should be automatically positioned or not. Applicable, if layout option is enabled.

     */
    @Property(false)
    public excludeFromLayout: boolean;

    /**
     * Allows the user to save custom information/data about a node/connector



     */
    @Property()
    public addInfo: Object;

    /**
     * Flip the element in Horizontal/Vertical directions



     */
    @Property('None')
    public flip: FlipDirection;
}


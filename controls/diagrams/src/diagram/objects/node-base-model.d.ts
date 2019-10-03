import { Property, Complex, ChildProperty, Collection } from '@syncfusion/ej2-base';import { Margin } from '../core/appearance';import { PointPortModel } from './port-model';import { MarginModel } from '../core/appearance-model';import { DiagramTooltipModel } from './tooltip-model';import { IconShape } from './icon';import { IconShapeModel } from './icon-model';import { DiagramTooltip } from './tooltip';import { PointPort } from './port';import { FlipDirection } from '../enum/enum';

/**
 * Interface for a class NodeBase
 */
export interface NodeBaseModel {

    /**
     * Represents the unique id of nodes/connectors

     */
    id?: string;

    /**
     * Defines the visual order of the node/connector in DOM

     */
    zIndex?: number;

    /**
     * Defines the space to be left between the node and its immediate parent

     */
    margin?: MarginModel;

    /**
     * Sets the visibility of the node/connector

     */
    visible?: boolean;

    /**
     * Defines the collection of connection points of nodes/connectors



     */
    ports?: PointPortModel[];

    /**
     * Defines whether the node is expanded or not

     */
    isExpanded?: boolean;

    /**
     * defines the tooltip for the node

     */
    tooltip?: DiagramTooltipModel;

    /**
     * Defines the expanded state of a node

     */
    expandIcon?: IconShapeModel;

    /**
     * Defines the collapsed state of a node

     */
    collapseIcon?: IconShapeModel;

    /**
     * Defines whether the node should be automatically positioned or not. Applicable, if layout option is enabled.

     */
    excludeFromLayout?: boolean;

    /**
     * Allows the user to save custom information/data about a node/connector



     */
    addInfo?: Object;

    /**
     * Flip the element in Horizontal/Vertical directions



     */
    flip?: FlipDirection;

}
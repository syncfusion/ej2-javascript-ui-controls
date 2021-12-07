import { Property, Complex, ChildProperty } from '@syncfusion/ej2-base';import { Margin } from '../core/appearance';import { MarginModel } from '../core/appearance-model';import { Point } from '../primitives/point';import { PointModel } from '../primitives/point-model';import { FixedUserHandleAlignment } from '../enum/enum';

/**
 * Interface for a class FixedUserHandle
 * @private
 */
export interface FixedUserHandleModel {

    /**
     * Specifies the unique id of the fixed user handle
     *
     * @default ''
     */
    id?: string;

    /**
     * Specifies the fill color of the fixed user handle
     *
     * @default 'transparent'
     */
    fill?: string;

    /**
     * Specifies the stroke color of the fixed user handle
     *
     * @default 'transparent'
     */
    iconStrokeColor?: string;

    /**
     * Specifies the stroke width of the fixed user handle
     *
     * @default 0
     */
    iconStrokeWidth?: number;

    /**
     * Specifies the visibility of the fixed user handle
     *
     * @default true
     */
    visibility?: boolean;

    /**
     * Specifies the width of the fixed user handle
     *
     * @default 10
     */
    width?: number;

    /**
     * Specifies the height of the fixed user handle
     *
     * @default 10
     */
    height?: number;

    /**
     * Specifies the stroke color of the fixed user handle container
     *
     * @default ''
     */
    handleStrokeColor?: string;

    /**
     * Specifies the stroke width of the fixed user handle container
     *
     * @default 1
     */
    handleStrokeWidth?: number;

    /**
     * Specifies the shape information for fixed user handle
     *
     * @default ''
     */
    pathData?: string;

    /**
     * Specifies the cornerRadius for fixed user handle container
     *
     * @default 0
     */
    cornerRadius?: number;

    /**
     * Specifies the space between the fixed user handle and container
     *
     * @default new Margin(0,0,0,0)
     */
    padding?: MarginModel;

}

/**
 * Interface for a class NodeFixedUserHandle
 */
export interface NodeFixedUserHandleModel extends FixedUserHandleModel{

    /**
     * Specifies the position of the node fixed user handle
     *
     * @default { x: 0, y: 0 }
     */
    offset?: PointModel;

    /**
     * Specifies the space that the fixed user handle has to be moved from its actual position
     *
     * @default new Margin(0,0,0,0)
     */
    margin?: MarginModel;

}

/**
 * Interface for a class ConnectorFixedUserHandle
 */
export interface ConnectorFixedUserHandleModel extends FixedUserHandleModel{

    /**
     * Specifies the position of the connector fixed user handle
     *
     * @default 0.5
     */
    offset?: number;

    /**
     * Specifies the segment alignment of the fixed user handle
     *  * Center - Aligns the annotation at the center of a connector segment
     *  * Before - Aligns the annotation before a connector segment
     *  * After - Aligns the annotation after a connector segment
     *
     * @default Center
     */
    alignment?: FixedUserHandleAlignment;

    /**
     * Specifies the displacement of an fixed user handle from its actual position
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    displacement?: PointModel;

}
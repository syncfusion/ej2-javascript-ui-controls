import { Property, Complex, ChildProperty } from '@syncfusion/ej2-base';
import { Margin } from '../core/appearance';
import { MarginModel } from '../core/appearance-model';
import { Point } from '../primitives/point';
import { PointModel } from '../primitives/point-model';
import { FixedUserHandleAlignment } from '../enum/enum';


/**
 * Specifies the behavior of fixedUserHandles
 */
/** @private */
export class FixedUserHandle extends ChildProperty<FixedUserHandle> {

    /**
     * Specifies the unique id of the fixed user handle
     *
     * @default ''
     */
    @Property('')
    public id: string;
    /**
     * Specifies the fill color of the fixed user handle
     *
     * @default 'transparent'
     */
    @Property('transparent')
    public fill: string;

    /**
     * Specifies the stroke color of the fixed user handle
     *
     * @default 'transparent'
     */
    @Property('black')
    public iconStrokeColor: string;


    /**
     * Specifies the stroke width of the fixed user handle
     *
     * @default 0
     */
    @Property(0)
    public iconStrokeWidth: number;

    /**
     * Specifies the visibility of the fixed user handle
     *
     * @default true
     */
    @Property(true)
    public visibility: boolean;

    /**
     * Specifies the width of the fixed user handle
     *
     * @default 10
     */
    @Property(10)
    public width: number;

    /**
     * Specifies the height of the fixed user handle
     *
     * @default 10
     */
    @Property(10)
    public height: number;

    /**
     * Specifies the stroke color of the fixed user handle container
     *
     * @default ''
     */
    @Property('transparent')
    public handleStrokeColor: string;

    /**
     * Specifies the stroke width of the fixed user handle container
     *
     * @default 1
     */
    @Property(1)
    public handleStrokeWidth: number;


    /**
     * Specifies the shape information for fixed user handle
     *
     * @default ''
     */
    @Property('')
    public pathData: string;

    /**
     * Specifies the cornerRadius for fixed user handle container
     *
     * @default 0
     */
    @Property(0)
    public cornerRadius: number;


    /**
     * Specifies the space between the fixed user handle and container
     *
     * @default new Margin(0,0,0,0)
     */
    @Complex<MarginModel>({ left: 0, right: 0, top: 0, bottom: 0 }, Margin)
    public padding: MarginModel;
}
/**
 * Defines the node Fixed User Handle
 */
export class NodeFixedUserHandle extends FixedUserHandle {
    /**
     * Specifies the position of the node fixed user handle
     *
     * @default { x: 0, y: 0 }
     */
    @Complex<PointModel>({ x: 0, y: 0 }, Point)
    public offset: PointModel;

    /**
     * Specifies the space that the fixed user handle has to be moved from its actual position
     *
     * @default new Margin(0,0,0,0)
     */
    @Complex<MarginModel>({}, Margin)
    public margin: MarginModel;
}
/**
 * Defines the connector Fixed User Handle
 */
export class ConnectorFixedUserHandle extends FixedUserHandle {
    /**
     * Specifies the position of the connector fixed user handle
     *
     * @default 0.5
     */
    @Property(0.5)
    public offset: number;
    /**
     * Specifies the segment alignment of the fixed user handle
     *  * Center - Aligns the annotation at the center of a connector segment
     *  * Before - Aligns the annotation before a connector segment
     *  * After - Aligns the annotation after a connector segment
     *
     * @default Center
     */
    @Property('Center')
    public alignment: FixedUserHandleAlignment;

    /**
     * Specifies the displacement of an fixed user handle from its actual position
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Complex<PointModel>({ x: 0, y: 0 }, Point)
    public displacement: PointModel;
}

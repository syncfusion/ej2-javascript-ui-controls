import { Property, ChildProperty } from '@syncfusion/ej2-base';
import { INumberIndex, IDataSet, IAxisSet, IPivotValues } from '../../base/engine';
import { AxisSetModel } from './pivotvalues-model';

/** 
 * Configures the properties in pivotvalues fields. 
 */
/** @hidden */
export class AxisSet extends ChildProperty<AxisSet> implements IAxisSet {

    /**
     * Specifies header name.
     */
    @Property()
    public formattedText: string;

    /**
     * Specifies header type.
     */
    @Property()
    public type: string;

    /**
     * Specifies the drilled state of the header.
     */
    @Property()
    public isDrilled: boolean;

    /**
     * Specifies the field whether it has child or not.
     */
    @Property()
    public hasChild: boolean;

    /**
     * Specifies its child members.
     */
    @Property()
    public members: this[];

    /**
     * Specifies its position collections in data source.
     */
    @Property()
    public index: number[];

    /**
     * Specifies its position collections in data source with indexed object.
     */
    @Property()
    public indexObject: INumberIndex;

    /**
     * Specifies its position in its field.
     */
    @Property()
    public ordinal: number;

    /**
     * Specifies its level.
     */
    @Property()
    public level: number;

    /**
     * Specifies its axis where it is plotted.
     */
    @Property()
    public axis: string;

    /**
     * Specifies its value.
     */
    @Property()
    public value: number;

    /**
     * Specifies its column span.
     */
    @Property()
    public colSpan: number;

    /**
     * Specifies its row span.
     */
    @Property()
    public rowSpan: number;

    /**
     * Specifies the data collection which is to be framed for value sorted members.
     */
    @Property()
    public valueSort: IDataSet;

    /**
     * Specifies whether the cell is summary or not.
     */
    @Property()
    public isSum: boolean;
}

/**
 * @hidden
 */
export interface PivotValues extends IPivotValues {
    [key: number]: {
        [key: number]: number | string | Object | AxisSetModel;
        length: number;
    };
    length: number;
}
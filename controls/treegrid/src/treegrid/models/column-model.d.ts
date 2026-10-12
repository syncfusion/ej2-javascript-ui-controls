import { TextAlign, ClipMode, ValueAccessor, IFilter, IFilterUI, IEditCell, CommandModel, freezeDirection } from '@syncfusion/ej2-grids';import { NumberFormatOptions, DateFormatOptions, merge, Property } from '@syncfusion/ej2-base';import { ITreeGridCellFormatter } from '../base/interface';import { SortComparer} from '@syncfusion/ej2-grids';import { TreeGrid } from '..';
import {ColumnModel} from "./column";

/**
 * Interface for a class Column
 */
export interface ColumnModel {

}

/**
 * Interface for a class TreeGridColumn
 */
export interface TreeGridColumnModel extends ColumnModel{

    /**
     * Defines stacked columns
     *
     * @default null
     */
    columns?: string[] | ColumnModel[];

}

/**
 * Interface for a class StackedColumn
 */
export interface StackedColumnModel extends TreeGridColumnModel{

}
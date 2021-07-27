import { merge, isNullOrUndefined, extend, Property } from '@syncfusion/ej2-base';import { NumberFormatOptions, DateFormatOptions } from '@syncfusion/ej2-base';import { DataManager, Query, DataUtil } from '@syncfusion/ej2-data';import { ICellFormatter, IFilterUI, IEditCell, CommandModel, IFilter, CommandButtonOptions, DataResult, IGrid } from '../base/interface';import { TextAlign, ClipMode, Action, SortDirection, CommandButtonType, freezeDirection, freezeTable } from '../base/enum';import { PredicateModel } from '../base/grid-model';import { ValueFormatter } from '../services/value-formatter';import { ValueAccessor, SortComparer, HeaderValueAccessor } from '../base/type';import { getUid, templateCompiler, getForeignData, getObject } from '../base/util';

/**
 * Interface for a class Column
 */
export interface ColumnModel {

}

/**
 * Interface for a class CommandColumnModel
 */
export interface CommandColumnModelModel {

    /**
     * Define the command Button tooltip.
     */
    title?: string;

    /**
     * Define the command Button type.
     */
    type?: CommandButtonType;

    /**
     * Define the button model
     */
    buttonOption?: CommandButtonOptions;

}
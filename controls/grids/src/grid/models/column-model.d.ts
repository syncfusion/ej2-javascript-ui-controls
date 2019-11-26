import { merge, isNullOrUndefined, extend, Property } from '@syncfusion/ej2-base';import { NumberFormatOptions, DateFormatOptions, isBlazor } from '@syncfusion/ej2-base';import { DataManager, Query, DataUtil } from '@syncfusion/ej2-data';import { ICellFormatter, IFilterUI, IEditCell, CommandModel, IFilter, CommandButtonOptions } from '../base/interface';import { TextAlign, ClipMode, Action, SortDirection, EditType, ColumnType, CommandButtonType } from '../base/enum';import { PredicateModel } from '../base/grid-model';import { ValueFormatter } from '../services/value-formatter';import { ValueAccessor, SortComparer } from '../base/type';import { getUid, templateCompiler, getForeignData, getObject } from '../base/util';

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
     * @blazorDefaultValue none
     */
    type?: CommandButtonType;

    /**
     * Define the button model
     */
    buttonOption?: CommandButtonOptions;

}
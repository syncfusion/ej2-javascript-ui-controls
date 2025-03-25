import { getValue, INotifyPropertyChanged, EmitType, Event, NotifyPropertyChanges, Base, isNullOrUndefined, isUndefined } from '@syncfusion/ej2-base';import { BasicFormulas } from './../formulas/index';import { CommonErrors, FormulasErrorsStrings } from '../common/enum';import { IFormulaColl, FailureEventArgs, StoredCellInfo } from '../common/interface';import { Parser } from './parser';import { getRangeIndexes, getCellIndexes, getCellAddress, isDateTime, workbookFormulaOperation, SheetModel, isHiddenRow, isHiddenCol } from '../../workbook/index';import { getSheetIndexByName } from '../../workbook/index';import { DataUtil } from '@syncfusion/ej2-data';

/**
 * Interface for a class Calculate
 */
export interface CalculateModel {

    /**
     * Triggers when the calculation caught any errors.
     *
     * @event anEvent
     */
    onFailure?: EmitType<FailureEventArgs>;

}

/**
 * Interface for a class FormulaError
 */
export interface FormulaErrorModel {

}

/**
 * Interface for a class FormulaInfo
 */
export interface FormulaInfoModel {

}

/**
 * Interface for a class CalcSheetFamilyItem
 */
export interface CalcSheetFamilyItemModel {

}

/**
 * Interface for a class ValueChangedArgs
 */
export interface ValueChangedArgsModel {

}
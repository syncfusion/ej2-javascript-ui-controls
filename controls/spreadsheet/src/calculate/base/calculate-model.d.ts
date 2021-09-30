import { getValue, INotifyPropertyChanged, EmitType, Event, ModuleDeclaration, NotifyPropertyChanges, Base, Property, isNullOrUndefined, isUndefined, Internationalization } from '@syncfusion/ej2-base';import { BasicFormulas } from './../formulas/index';import { getModules, ModuleLoader } from '../common/index';import { CommonErrors, FormulasErrorsStrings } from '../common/enum';import { IFormulaColl, FailureEventArgs, StoredCellInfo } from '../common/interface';import { Parser } from './parser';

/**
 * Interface for a class Calculate
 */
export interface CalculateModel {

    /**
     * Specifies a value that indicates whether the basic formulas need to be included.
     *
     * @default true
     */
    includeBasicFormulas?: boolean;

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
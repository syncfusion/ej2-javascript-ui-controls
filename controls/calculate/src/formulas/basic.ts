import { getValue } from '@syncfusion/ej2-base';
import { Calculate } from '../base/index';
import { IBasicFormula } from '../common/index';
import { FormulaOwner } from './formula-owner';
import { MathAggregateFormulas } from './math-aggregate';
import { MathRoundingFormulas } from './math-rounding';
import { MathMiscFormulas } from './math-misc';
import { MathTrigFormulas } from './math-trig';
import { MathTrigHyperbolicFormulas } from './math-trig-hyperbolic';
import { MathCombinatoricsFormulas } from './math-combinatorics';
import { MathNumberFormulas } from './math-number';
import { MatrixFormulas } from './matrix';
import { EngineeringBaseFormulas } from './engineering-base';
import { EngineeringMiscFormulas } from './engineering-misc';
import { EngineeringConvertFormulas } from './engineering-convert';
import { EngineeringBesselFormulas } from './engineering-bessel';
import { FinancialAnnuityFormulas } from './financial-annuity';
import { FinancialDepreciationFormulas } from './financial-depreciation';
import { FinancialRatesFormulas } from './financial-rates';
import { FinancialCashflowFormulas } from './financial-cashflow';
import { FinancialSecuritiesFormulas } from './financial-securities';
import { StatisticalFormulas } from './statistical';
import { StatisticalAdvancedFormulas } from './statistical-advanced';
import { StatisticalDispersionFormulas } from './statistical-dispersion';
import { StatisticalMomentsFormulas } from './statistical-moments';
import { StatisticalCorrelationFormulas } from './statistical-correlation';
import { StatisticalPercentileFormulas } from './statistical-percentile';
import { StatisticalDistributionFormulas } from './statistical-distribution';
import { StatisticalIfsFormulas } from './statistical-ifs';
import { StatisticalExtendedFormulas } from './statistical-extended';
import { StatisticalDistributionExtendedFormulas } from './statistical-distribution-extended';
import { ComplexNumbersFormulas } from './complex-numbers';
import { DateTimeFormulas } from './date-time';
import { DateTimeExtraFormulas } from './date-time-extra';
import { LogicalFormulas } from './logical';
import { LogicalExtraFormulas } from './logical-extra';
import { LookupFormulas } from './lookup';
import { LookupRefFormulas } from './lookup-ref';
import { LookupRefExtraFormulas } from './lookup-ref-extra';
import { LookupArrayFormulas } from './lookup-array';
import { ArrayFormulas } from './array';
import { TextFormulas } from './text';
import { TextExtraFormulas } from './text-extra';
import { TextAdvancedFormulas } from './text-advanced';
import { InformationFormulas } from './information';
import { InformationExtraFormulas } from './information-extra';
import { InformationAdvancedFormulas } from './information-advanced';
import { DateTimeIntlFormulas } from './date-time-intl';
import { MathCeilingEcmaFormulas } from './math-ceiling-ecma';
import { InformationEcmaFormulas } from './information-ecma';
import { TextEcmaFormulas } from './text-ecma';
import { FinancialCouponsFormulas } from './financial-coupons';
import { FinancialAmortizationEcmaFormulas } from './financial-amortization-ecma';
import { StatisticalEcmaFormulas } from './statistical-ecma';
import { DatabaseFormulas } from './database';
import { RegressionEcmaFormulas } from './regression-ecma';

/**
 * Central registry that composes all built-in formula category modules and binds them to the Calculate engine.
 *
 * Instantiated by the {@link Calculate} constructor. Each category module contributes
 * `formulas` metadata and `Compute*` handlers that are registered into
 * {@link Calculate.getLibraryFormulas}.
 *
 * @example
 * ```ts
 * // Constructed automatically:
 * const engine = new Calculate();
 * engine.getFunction('SUM'); // bound ComputeSUM handler
 * ```
 * @hidden
 */
export class BasicFormulas implements FormulaOwner {
    public parent: Calculate;
    /** Catalog of built-in formula metadata and bound Compute handlers. */
    public formulas: IBasicFormula[] = [];
    /** @hidden */
    public isConcat: boolean = false;

    // Bound Compute* handlers are assigned dynamically from category modules.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;

    /**
     * @param {Object} parent - Calculate engine instance that owns formula registration.
     */
    constructor(parent?: Calculate) {
        this.parent = parent as Calculate;
        const modules: { formulas: IBasicFormula[] }[] = [
            new MathAggregateFormulas(this),
            new MathRoundingFormulas(this),
            new MathMiscFormulas(this),
            new MathTrigFormulas(this),
            new MathTrigHyperbolicFormulas(this),
            new MathCombinatoricsFormulas(this),
            new MathNumberFormulas(this),
            new MatrixFormulas(this),
            new EngineeringBaseFormulas(this),
            new EngineeringMiscFormulas(this),
            new EngineeringConvertFormulas(this),
            new EngineeringBesselFormulas(this),
            new FinancialAnnuityFormulas(this),
            new FinancialDepreciationFormulas(this),
            new FinancialRatesFormulas(this),
            new FinancialCashflowFormulas(this),
            new FinancialSecuritiesFormulas(this),
            new StatisticalFormulas(this),
            new StatisticalAdvancedFormulas(this),
            new StatisticalDispersionFormulas(this),
            new StatisticalMomentsFormulas(this),
            new StatisticalCorrelationFormulas(this),
            new StatisticalPercentileFormulas(this),
            new StatisticalDistributionFormulas(this),
            new StatisticalIfsFormulas(this),
            new StatisticalExtendedFormulas(this),
            new StatisticalDistributionExtendedFormulas(this),
            new ComplexNumbersFormulas(this),
            new DateTimeFormulas(this),
            new DateTimeExtraFormulas(this),
            new LogicalFormulas(this),
            new LogicalExtraFormulas(this),
            new LookupFormulas(this),
            new LookupRefFormulas(this),
            new LookupRefExtraFormulas(this),
            new LookupArrayFormulas(this),
            new ArrayFormulas(this),
            new TextFormulas(this),
            new TextExtraFormulas(this),
            new TextAdvancedFormulas(this),
            new InformationFormulas(this),
            new InformationExtraFormulas(this),
            new InformationAdvancedFormulas(this),
            new DateTimeIntlFormulas(this),
            new MathCeilingEcmaFormulas(this),
            new InformationEcmaFormulas(this),
            new TextEcmaFormulas(this),
            new FinancialCouponsFormulas(this),
            new FinancialAmortizationEcmaFormulas(this),
            new StatisticalEcmaFormulas(this),
            new DatabaseFormulas(this),
            new RegressionEcmaFormulas(this)
        ];
        for (let m: number = 0; m < modules.length; m++) {
            const mod: { formulas: IBasicFormula[] } = modules[m as number];
            for (let i: number = 0; i < mod.formulas.length; i++) {
                const formula: IBasicFormula = mod.formulas[i as number];
                this.formulas.push(formula);
                const methodName: string = 'Compute' + formula.formulaName;
                const handler: Function = formula.formulaName.indexOf('.') > -1
                    // eslint-disable-next-line security/detect-object-injection
                    ? (mod as unknown as Record<string, Function>)[methodName] as Function
                    : getValue(methodName, mod) as Function;
                if (handler) {
                    // eslint-disable-next-line security/detect-object-injection
                    this[methodName] = handler.bind(mod);
                }
            }
        }
        this.init();
    }
    /**
     * init helper.
     *
     * @returns {void} - init result.
     */
    private init(): void {
        for (let i: number = 0; i < this.formulas.length; i++) {
            const formula: IBasicFormula = this.formulas[i as number];
            const fn: Function = this['Compute' + formula.formulaName] as Function;
            this.addFormulaCollection(
                formula.formulaName.toUpperCase(), fn, formula.category, formula.description, formula.syntax);
        }
    }

    /**
     * Registers one formula handler on the parent Calculate engine.
     *
     * @param {string} formulaName - Uppercase formula name key.
     * @param {Function} functionName - Bound Compute handler.
     * @param {string} formulaCategory - Formula category label.
     * @param {string} description - Human-readable formula description.
     * @param {string} syntax - Formula syntax shown in formula UI.
     * @returns {void}
     * @internal
     */
    private addFormulaCollection(
        formulaName: string, functionName: Function, formulaCategory: string, description: string, syntax: string): void {
        this.parent.libraryFormulas = {
            fName: formulaName, handler: functionName as Function, category: formulaCategory,
            description: description, syntax: syntax
        };
    }
}

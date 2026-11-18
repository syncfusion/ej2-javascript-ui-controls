import { FormulasErrorsStrings, CommonErrors, IBasicFormula } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { FormulaOwner } from './formula-owner';
import { FormulaModuleBase } from './formula-module-base';

/**
 * Conditional statistical aggregates (AVERAGEIFS, SUMIFS) over multi-criteria ranges.
 *
 * Registered functions: MAXIFS, MINIFS.
 *
 * @hidden
 */
export class StatisticalIfsFormulas extends FormulaModuleBase {
    /** Formula definitions registered with {@link BasicFormulas}. */
    public formulas: IBasicFormula[] = [
        { formulaName: 'MAXIFS', category: 'Statistical', description: 'Returns the maximum value among cells specified by criteria.', syntax: 'MAXIFS(max_range, criteria_range1, criteria1, [criteria_range2, criteria2], ...)' },
        { formulaName: 'MINIFS', category: 'Statistical', description: 'Returns the minimum value among cells specified by criteria.', syntax: 'MINIFS(min_range, criteria_range1, criteria1, [criteria_range2, criteria2], ...)' }
    ];

    /**
     * @hidden
     * @param {FormulaOwner} owner - Formula registration owner ({@link BasicFormulas}).
     */
    constructor(owner: FormulaOwner) {
        super(owner);
    }

    /**
     * Returns the maximum value among cells specified by criteria.
     *
     * Excel: `MAXIFS(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     *
     * @example
     * ```ts
     * engine.computeFormula('=MAXIFS(1)');
     * ```
     */
    public ComputeMAXIFS(...args: string[]): string | number {
        return this.aggregateIfs(args, true);
    }

    /**
     * Returns the minimum value among cells specified by criteria.
     *
     * Excel: `MINIFS(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeMINIFS(...args: string[]): string | number {
        return this.aggregateIfs(args, false);
    }

    private aggregateIfs(args: string[], isMax: boolean): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length < 3 || args.length % 2 === 0) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const valueRange: string = args[0];
        const valueCells: string[] | string = this.parent.getCellCollection(valueRange);
        const values: string[] = Array.isArray(valueCells) ? valueCells : [valueCells];
        const criteriaPairs: string[][] = [];
        for (let i: number = 1; i < args.length; i += 2) {
            criteriaPairs.push([args[i as number], args[i + 1]]);
        }
        const criteriaCellsList: string[][] = [];
        for (let p: number = 0; p < criteriaPairs.length; p++) {
            const cells: string[] | string = this.parent.getCellCollection(criteriaPairs[p as number][0]);
            const list: string[] = Array.isArray(cells) ? cells : [cells];
            if (list.length !== values.length) {
                return errCollection[CommonErrors.Value];
            }
            criteriaCellsList.push(list);
        }
        let result: number | null = null;
        let matched: boolean = false;
        for (let i: number = 0; i < values.length; i++) {
            let ok: boolean = true;
            for (let p: number = 0; p < criteriaPairs.length; p++) {
                const cellVal: string = this.parent.getValueFromArg(criteriaCellsList[p as number][i as number]);
                if (!this.matchesCriteria(cellVal, criteriaPairs[p as number][1])) {
                    ok = false;
                    break;
                }
            }
            if (!ok) {
                continue;
            }
            const valStr: string = this.parent.getValueFromArg(values[i as number]);
            if (errCollection.indexOf(valStr) > -1) {
                return valStr;
            }
            if (valStr === '' || !this.parent.isNumber(valStr)) {
                continue;
            }
            const num: number = this.parent.parseFloat(valStr);
            matched = true;
            if (result === null) {
                result = num;
            } else if (isMax ? num > result : num < result) {
                result = num;
            }
        }
        if (!matched || result === null) {
            return '0';
        }
        return result.toString();
    }

    private matchesCriteria(cellVal: string, criteriaArg: string): boolean {
        let criteria: string = criteriaArg.trim();
        const isStringVal: boolean = criteria.startsWith(this.parent.tic) && criteria.endsWith(this.parent.tic);
        if (isStringVal) {
            criteria = this.parent.removeTics(criteria);
        } else if (this.parent.isCellReference(criteria)) {
            criteria = this.parent.getValueFromArg(criteria);
        } else {
            criteria = this.parent.getValueFromArg(criteria);
            if (!this.parent.isCellReference(criteriaArg)) {
                criteria = this.parent.removeTics(criteria);
            }
        }
        let op: string = 'equal';
        if (criteria.startsWith('<=')) {
            op = 'lessEq';
            criteria = criteria.substring(2);
        } else if (criteria.startsWith('>=')) {
            op = 'greaterEq';
            criteria = criteria.substring(2);
        } else if (criteria.startsWith('<>')) {
            op = 'notEq';
            criteria = criteria.substring(2);
        } else if (criteria.startsWith('<')) {
            op = 'less';
            criteria = criteria.substring(1);
        } else if (criteria.startsWith('>')) {
            op = 'greater';
            criteria = criteria.substring(1);
        } else if (criteria.startsWith('=')) {
            op = 'equal';
            criteria = criteria.substring(1);
        }
        criteria = criteria.trim();
        if (criteria.startsWith(this.parent.tic)) {
            criteria = this.parent.removeTics(criteria);
        }
        return this.parent.processLogical([cellVal.toLowerCase(), criteria.toLowerCase()], op) === this.parent.trueValue;
    }
}

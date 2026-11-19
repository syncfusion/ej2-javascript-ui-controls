import { FormulasErrorsStrings, CommonErrors } from '../common/index';
import { FormulaModuleBase } from './formula-module-base';

/**
 * Shared sample collection for statistical formula modules.
 *
 * @hidden
 */
export class StatisticalSampleBase extends FormulaModuleBase {
    protected collectSample(args: string[], includeTextAsZero: boolean = false): number[] | string {
        const errCollection: string[] = this.parent.getErrorStrings();
        const nums: number[] = [];
        for (let i: number = 0; i < args.length; i++) {
            const arg: string = args[i as number];
            if (arg === '') {
                continue;
            }
            if (this.parent.isCellReference(arg) && arg.indexOf(':') > -1) {
                const cells: string[] | string = this.parent.getCellCollection(arg);
                const list: string[] = Array.isArray(cells) ? cells : [cells];
                for (let c: number = 0; c < list.length; c++) {
                    const val: string = this.parent.getValueFromArg(list[c as number]);
                    if (errCollection.indexOf(val) > -1) {
                        return val;
                    }
                    if (val === '') {
                        continue;
                    }
                    const upper: string = val.toUpperCase();
                    if (upper === this.parent.trueValue) {
                        nums.push(1);
                    } else if (upper === this.parent.falseValue) {
                        nums.push(0);
                    } else if (this.parent.isNumber(val)) {
                        nums.push(this.parent.parseFloat(val));
                    } else if (includeTextAsZero) {
                        nums.push(0);
                    }
                }
            } else {
                const val: string = this.parent.getValueFromArg(arg);
                if (errCollection.indexOf(val) > -1) {
                    return val;
                }
                const upper: string = val.toUpperCase();
                if (upper === this.parent.trueValue) {
                    nums.push(1);
                } else if (upper === this.parent.falseValue) {
                    nums.push(0);
                } else if (val === '') {
                    continue;
                } else if (this.parent.isNumber(this.parent.removeTics(val))) {
                    nums.push(this.parent.parseFloat(this.parent.removeTics(val)));
                } else if (includeTextAsZero) {
                    nums.push(0);
                } else {
                    return errCollection[CommonErrors.Value];
                }
            }
        }
        return nums;
    }

    protected collectPair(args: string[]): { x: number[], y: number[] } | string {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (args.length !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const xCells: string[] | string = this.parent.getCellCollection(args[0]);
        const yCells: string[] | string = this.parent.getCellCollection(args[1]);
        const xList: string[] = Array.isArray(xCells) ? xCells : [xCells];
        const yList: string[] = Array.isArray(yCells) ? yCells : [yCells];
        if (xList.length !== yList.length) {
            return errCollection[CommonErrors.NA];
        }
        const x: number[] = [];
        const y: number[] = [];
        for (let i: number = 0; i < xList.length; i++) {
            const xv: string = this.parent.getValueFromArg(xList[i as number]);
            const yv: string = this.parent.getValueFromArg(yList[i as number]);
            if (errCollection.indexOf(xv) > -1) { return xv; }
            if (errCollection.indexOf(yv) > -1) { return yv; }
            if (xv !== '' && yv !== '' && this.parent.isNumber(xv) && this.parent.isNumber(yv)) {
                x.push(this.parent.parseFloat(xv));
                y.push(this.parent.parseFloat(yv));
            }
        }
        return { x, y };
    }

    protected mean(nums: number[]): number {
        return nums.reduce((a: number, b: number) => a + b, 0) / nums.length;
    }
}

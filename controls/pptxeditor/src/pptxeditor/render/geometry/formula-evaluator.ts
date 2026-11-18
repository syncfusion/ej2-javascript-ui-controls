/**
 * @internal
 */
export interface FormulaBounds {
    readonly width: number;
    readonly height: number;
}

/**
 * @internal
 */
export type FormulaGuideMap = Readonly<Record<string, string>>;

/**
 * ports `FormulaValues.GetFormulaValues`.
 * @param {FormulaBounds} bounds - bounds
 * @param {FormulaGuideMap} formulae - formulae
 * @param {FormulaGuideMap} adjustments - adjustments
 * @returns {Object} result
 * @internal
 */
export function evaluateFormulae(
    bounds: FormulaBounds,
    formulae: FormulaGuideMap,
    adjustments: FormulaGuideMap = {}
): Readonly<Record<string, number>> {
    const values: Record<string, number> = {};
    const adjustmentValues: Record<string, number> = {};
    for (const name of Object.keys(adjustments)) {
        adjustmentValues[name] = evaluateFormula(bounds, adjustments[name], adjustmentValues, {});
    }
    for (const name of Object.keys(formulae)) {
        values[name] = evaluateFormula(bounds, formulae[name], values, adjustmentValues);
    }
    return values;
}

/**
 * ports `FormulaValues.GetOperandValues` and `FormulaValues.GetResultValue`.
 * @param {FormulaBounds} bounds - bounds
 * @param {string} formula - formula
 * @param {Object} values - values
 * @param {Object} adjustments - adjustments
 * @returns {number} result
 * @internal
 */
export function evaluateFormula(
    bounds: FormulaBounds,
    formula: string,
    values: Readonly<Record<string, number>> = {},
    adjustments: Readonly<Record<string, number>> = {}
): number {
    const parts: string[] = formula.trim().split(/\s+/);
    if (parts.length < 2) {
        return 0;
    }
    const operands: number[] = parts.slice(1).map((operand: string): number => {
        const numeric: number = Number(operand);
        if (!Number.isNaN(numeric)) {
            return numeric;
        }
        if (Object.prototype.hasOwnProperty.call(adjustments, operand)) {
            return adjustments[operand];
        }
        if (Object.prototype.hasOwnProperty.call(values, operand)) {
            return values[operand];
        }
        return presetOperand(bounds, operand);
    });
    const operator: string = parts[0];
    if (operator.length > 1 && /^[*/+-]+$/.test(operator)) {
        let result: number = operands[0];
        for (let index: number = 0; index < operator.length; index++) {
            const next: number = operands[index + 1];
            if (operator[index] === '*' && next !== 0) {
                result *= next;
            } else if (operator[index] === '/' && next !== 0) {
                result /= next;
            } else if (operator[index] === '+') {
                result += next;
            } else if (operator[index] === '-') {
                result -= next;
            }
        }
        return result;
    }
    switch (operator) {
    case '?:': return operands[0] > 0 ? operands[1] : operands[2];
    case 'abs': return Math.abs(operands[0]);
    case 'at2': return Math.atan(operands[1] / operands[0]);
    case 'cat2': return operands[0] * Math.cos(Math.atan(operands[2] / operands[1]));
    case 'cos': return operands[0] * Math.cos(operands[1] * Math.PI / 180);
    case 'max': return Math.max(operands[0], operands[1]);
    case 'min': return Math.min(operands[0], operands[1]);
    case 'mod': return Math.sqrt(operands[0] ** 2 + operands[1] ** 2 + operands[2] ** 2);
    case 'pin': return Math.min(Math.max(operands[1], operands[0]), operands[2]);
    case 'sat2': return operands[0] * Math.sin(Math.atan(operands[2] / operands[1]));
    case 'sin': return operands[0] * Math.sin(operands[1] * Math.PI / 180);
    case 'sqrt': return Math.sqrt(operands[0]);
    case 'tan': return operands[0] * Math.tan(operands[1] * Math.PI / 180);
    case 'val': return operands[0];
    default: return operands[0];
    }
}

/**
 * ports `FormulaValues.GetPresetOperandValue`.
 * @param {FormulaBounds} bounds - bounds
 * @param {string} name - name
 * @returns {number} result
 */
function presetOperand(bounds: FormulaBounds, name: string): number {
    const width: number = bounds.width;
    const height: number = bounds.height;
    const shortSide: number = Math.min(width, height);
    const values: Record<string, number> = {
        '3cd4': 270, '3cd8': 135, '5cd8': 225, '7cd8': 315,
        b: height, cd2: 180, cd4: 90, cd8: 45, h: height, hc: width / 2,
        hd2: height / 2, hd3: height / 3, hd4: height / 4, hd5: height / 5,
        hd6: height / 6, hd8: height / 8, l: 0, ls: Math.max(width, height),
        r: width, ss: shortSide, ssd2: shortSide / 2, ssd4: shortSide / 4,
        ssd6: shortSide / 6, ssd8: shortSide / 8, t: 0, vc: height / 2,
        w: width, wd2: width / 2, wd3: width / 3, wd4: width / 4,
        wd5: width / 5, wd6: width / 6, wd8: width / 8, wd10: width / 10
    };
    return values[name] === undefined ? 0 : values[name];
}

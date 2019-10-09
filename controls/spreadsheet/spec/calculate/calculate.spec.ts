import { createElement } from '@syncfusion/ej2-base';
import { Calculate, FormulaInfo, Parser, FailureEventArgs } from '../../src/calculate/index';

describe('Calculate basic flow', () => {
    let input1: any = createElement('input', { id: 'input1' });
    input1.value = '23';
    document.body.appendChild(input1);
    let input2: any = createElement('input', { id: 'input2' });
    input2.value = '7';
    document.body.appendChild(input2);
    let formula: any = createElement('input', { id: 'formula' });
    formula.value = '=A+B';
    document.body.appendChild(formula);
    let calculate: Calculate = new Calculate();
    it('Set key value', () => {
        calculate.setKeyValue('A', input1.value);
        calculate.setKeyValue('B', input2.value);
        calculate.setKeyValue('C', formula.value);
        expect(calculate.storedData.get('A') instanceof FormulaInfo).toBeTruthy;
        expect(calculate.storedData.get('A').getFormulaText() === input1.value).toBeTruthy;
        expect(calculate.storedData.get('B') instanceof FormulaInfo).toBeTruthy;
        expect(calculate.storedData.get('B').getFormulaText() === input2.value).toBeTruthy;
        expect(calculate.storedData.get('C') instanceof FormulaInfo).toBeTruthy;
        expect(calculate.storedData.get('C').getFormulaText() === formula.value).toBeTruthy;
    });
    it('Set key value', () => {
        let result: string | number = calculate.getKeyValue('C');
        expect(calculate.storedData.get('C') instanceof FormulaInfo).toBeTruthy;
        expect(calculate.storedData.get('C').getFormulaValue() === '30').toBeTruthy;
    });
    afterAll(() => {
        calculate.dispose();
        calculate = null;
    });
});

describe('Autocorrection with arithmetic formulas', () => {
    let forceCalc: boolean = false;
    let formula: any;
    let result: string | number;
    let calculate: Calculate = new Calculate();
    calculate.onFailure = (exp: FailureEventArgs) => {
        exp.computeForceCalculate = forceCalc;
    }
    beforeEach(() => {
        formula = createElement('input', { id: 'formula' });
    });
    afterEach(() => {
        document.body.querySelectorAll('input').forEach((elem: HTMLInputElement) => elem.remove() );
    });
    it('calculate worst case using numbers', () => {
        forceCalc = true;
        formula.value = '=2+++-++/*+6+8';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === '4').toBeTruthy;
    });
    it('calculate worst case using numbers with multiple numbers', () => {
        forceCalc = true;
        formula.value = '=*++2+++-++/*+6+8+45';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(result === '49').toBeTruthy;
    });
    it('calculate worst case using sum formula with multiple numbers', () => {
        forceCalc = true;
        formula.value = '=2+sum(sum(2++++3****4++++5)+2+3****4++++5)++++7';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(result === '47').toBeTruthy;
    });
    it('calculate worst case using special symbol @', () => {
        forceCalc = false;
        formula.value = '=2+@';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(result === 'invalid expression').toBeTruthy;
    });
    it('calculate worst case using special symbol &', () => {
        forceCalc = false;
        formula.value = '=2+&';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(result === 'invalid expression').toBeTruthy;
    });
    it('calculate worst case using special symbol &', () => {
        forceCalc = true;
        formula.value = '=5&';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(result === '5').toBeTruthy;
    });
    it('Check worst case', () => {
        forceCalc = true;
        formula.value = '=++++++5&+++6';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(result === '56').toBeTruthy;
    });
    it('calculate worst case using special symbol !', () => {
        forceCalc = false;
        formula.value = '=++!3+9-8';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(result === 'invalid expression').toBeTruthy;
    });
    it('calculate worst case using special symbol @', () => {
        forceCalc = false;
        formula.value = '=++@3+9/////+++8';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(result === 'invalid expression').toBeTruthy;
    });
    it('calculate worst case using special symbol #', () => {
        forceCalc = false;
        formula.value = '=++---+++#3+9-8//78';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(result === 'invalid expression').toBeTruthy;
    });
    it('calculate worst case using special symbol $', () => {
        forceCalc = false;
        formula.value = '=+++$3+9-8//78++***6';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(result === 'invalid expression').toBeTruthy;
    });
    it('check worstcase using sum ', () => {
        forceCalc = false;
        formula.value = '=sum(2+/+90+*/+++@-78+/90+*+8)';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(result === 'improper formula').toBeTruthy;
    });
    it('calculate worst case using sum', () => {
        forceCalc = true;
        formula.value = '=sum(2+++-++/*+6+8)';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === 4).toBeTruthy;
    });
    it('calculate worst case using sum', () => {
        forceCalc = false;
        formula.value = '=sum(2+++-++/*+6+8)';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === 'improper formula').toBeTruthy;
    });
});
describe('Cell dependency handling', () => {
    let calculate: Calculate = new Calculate();
    it('Check multiple cell dependency', () => {
        let sheetId: number = 1;
        let cellRef1: string = calculate.sheetToken + sheetId + calculate.sheetToken + 'A1';
        calculate.updateDependentCell(cellRef1);
        calculate.getDependentCells().set(cellRef1,['10']);
        let cellRef2: string= calculate.sheetToken + sheetId + calculate.sheetToken + 'A2';
        calculate.updateDependentCell(cellRef2);
        calculate.getDependentCells().set(cellRef2,['A1']);
        let cellRef3: string= calculate.sheetToken + sheetId + calculate.sheetToken + 'A3';
        calculate.updateDependentCell(cellRef3);
        calculate.getDependentCells().set(cellRef3,['A2']);
        expect(calculate.getDependentCells().get(cellRef1).toString() === '10').toBeTruthy;
        expect(calculate.getDependentCells().get(cellRef2).toString() === '10').toBeTruthy;
        expect(calculate.getDependentCells().get(cellRef3).toString() === '10').toBeTruthy;
        calculate.getDependentCells().get(cellRef1)
        });
});
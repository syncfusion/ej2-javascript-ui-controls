import { createElement } from '@syncfusion/ej2-base';
import { Calculate, FormulaInfo } from '../../src/calculate/index';
describe('Calculate SUM Formula', () => {
    let input1: any;
    let input2: any;
    let input3: any;
    let input4: any;
    let formula: any;
    let calculate: Calculate;
    let result: string | number;
    let trueValue: string = 'TRUE';
    let falseValue: string = 'FALSE'
    beforeEach(() => {
        calculate = new Calculate();
        input1 = createElement('input', { id: 'input1' });
        input1.value = '10';
        document.body.appendChild(input1);
        input2 = createElement('input', { id: 'input2' });
        input2.value = '15';
        document.body.appendChild(input2);
        input3 = createElement('input', { id: 'input3' });
        input3.value = '20';
        document.body.appendChild(input3);
        input4 = createElement('input', { id: 'input4' });
        input4.value = '25';
        document.body.appendChild(input4);
        formula = createElement('input', { id: 'formula' });
        calculate.setKeyValue('A', input1.value);
        calculate.setKeyValue('B', input2.value);
        calculate.setKeyValue('C', input3.value);
        calculate.setKeyValue('D', input4.value);
    });
    afterEach(() => {
        calculate.dispose();
        calculate = null;
        document.body.querySelectorAll('input').forEach((elem: HTMLInputElement) => elem.remove() );
    });

    it('Simple formula using key values ', () => {
        formula.value = '=A+B+C+D';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        expect(calculate.storedData.get('A') instanceof FormulaInfo).toBeTruthy;
        expect(calculate.storedData.get('B') instanceof FormulaInfo).toBeTruthy;
        expect(calculate.storedData.get('C') instanceof FormulaInfo).toBeTruthy;
        expect(calculate.storedData.get('D') instanceof FormulaInfo).toBeTruthy;
        expect(calculate.storedData.get('F') instanceof FormulaInfo).toBeTruthy;
        expect(calculate.storedData.get('A').getFormulaText() === input1.value).toBeTruthy;
        expect(calculate.storedData.get('B').getFormulaText() === input2.value).toBeTruthy;
        expect(calculate.storedData.get('C').getFormulaText() === input3.value).toBeTruthy;
        expect(calculate.storedData.get('D').getFormulaText() === input4.value).toBeTruthy;
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === '70').toBeTruthy;
    });
    it('Simple formula using key values ', () => {
        formula.value = '=A+B';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === '25').toBeTruthy;
    });
    it('calculate numbers using method ', () => {
        formula.value = '=2+4+6+8';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '20').toBeTruthy;
    });
    it('calculate numbers using sum function', () => {
        formula.value = '=sum(2,4,6,8)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value).toString();
        expect(result === '20').toBeTruthy;
    });
    it('calculate numbers using sum function with negative values', () => {
        formula.value = '=sum(2,4,(-6),-(-8))';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value).toString();
        expect(result === '8').toBeTruthy;
    });
    it('Simple formula calculated using method ', () => {
        formula.value = '=5+sum(2,4,6,8)+5';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '30').toBeTruthy;
    });
    it('Simple formula calculated using method', () => {
        formula.value = '=sum(2+4)+5+6';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '17').toBeTruthy;
    });
    it('Simple formula calculated using method', () => {
        formula.value = '=5+sum(2+4+6+8)+5';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '30').toBeTruthy;
    });
    it('complex formula calculated using method ', () => {
        formula.value = '=sum(sum(sum(2+4+6+8)+5)+4)+6';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '35').toBeTruthy;
    });
    it('check name manager', () => {
        formula.value = '=addname1+addname2';
        document.body.appendChild(formula);
        calculate.addNamedRange('addname1', '5');
        calculate.addNamedRange('addname2', '10');
        result = calculate.computeFormula(formula.value);
        expect(result === '15').toBeTruthy;
    });
    it('check name manager using sum formula', () => {
        formula.value = '=addname1+sum(addname1+addname2)+addname2';
        document.body.appendChild(formula);
        calculate.addNamedRange('addname1', '5');
        calculate.addNamedRange('addname2', '10');
        result = calculate.computeFormula(formula.value);
        expect(result === '30').toBeTruthy;
    });
    it('check name manager  and key values using sum formula', () => {
        formula.value = '=A+sum(addname1+addname2+B)+C';
        document.body.appendChild(formula);
        calculate.addNamedRange('addname1', '5');
        calculate.addNamedRange('addname2', '10');
        result = calculate.computeFormula(formula.value);
        expect(result === '60').toBeTruthy;
    });
    it('check arithmetic operator', () => {
        formula.value = '=2+3*4-8/4';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '12').toBeTruthy;
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(result === '12').toBeTruthy;
    });
    it('check arithmetic operator using sum formulas', () => {
        formula.value = '=sum(2+3*4-8/4)+9-5';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '16').toBeTruthy;
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(result === '16').toBeTruthy;
    });
    it('check arithmetic operator  name manager with key values using sum formulas', () => {
        formula.value = '=A+sum(2+3*4-8/4)+9-5+addname1';
        document.body.appendChild(formula);
        calculate.addNamedRange('addname1', '5');
        result = calculate.computeFormula(formula.value);
        expect(result === '31').toBeTruthy;
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(result === '31').toBeTruthy;
    });
    it('check (greater)logical operator', () => {
        formula.value = '=5>1';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === trueValue).toBeTruthy;
        formula.value = '=5>8';
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(result === falseValue).toBeTruthy;
    });
    it('check (less)logical operator', () => {
        formula.value = '=5<3';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === falseValue).toBeTruthy;
        calculate.setKeyValue('F', formula.value);
        formula.value = '=5<8';
        result = calculate.getKeyValue('F');
        expect(result === trueValue).toBeTruthy;
    });
    it('check (greater than)logical operator', () => {
        formula.value = '=5>=3';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === trueValue).toBeTruthy;
        formula.value = '=3>=3';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === trueValue).toBeTruthy;
        calculate.setKeyValue('F', formula.value);
        formula.value = '=5>=8';
        result = calculate.getKeyValue('F');
        expect(result === falseValue).toBeTruthy;
    });
    it('check (less than)logical operator', () => {
        formula.value = '=5<=6';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === trueValue).toBeTruthy;
        formula.value = '=3<=3';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === trueValue).toBeTruthy;
        calculate.setKeyValue('F', formula.value);
        formula.value = '=5>=8';
        result = calculate.getKeyValue('F');
        expect(result === falseValue).toBeTruthy;
    });
    it('check (equal)logical operator', () => {
        formula.value = '=5=3';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === falseValue).toBeTruthy;
        calculate.setKeyValue('F', formula.value);
        formula.value = '=3=3';
        result = calculate.getKeyValue('F');
        expect(result === trueValue).toBeTruthy;
    });
    it('Valid error', () => {
        formula.value = '=sum(2+two)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === "#NAME?").toBeTruthy;
    });
    it('Using Cell range', () => {
        let result1: string | number;
        formula.value = '=sum(A1:A4)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        calculate.setKeyValue('F', formula.value);
        result1 = calculate.getKeyValue('F');
        expect(result === result1).toBeTruthy;
    });
    it('Using boolean value in formula', () => {
        formula.value = '=sum(2,true)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '3').toBeTruthy;
    });
    it('Using boolean value in formula', () => {
        formula.value = '=sum(2,false)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '2').toBeTruthy;
    });
    it('check invalid error', () => {
        formula.value = '=sum()';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'invalid_arguments').toBeTruthy;
    });
    it('check invalid error', () => {
        formula.value = '=sum(3+"value")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'invalid_arguments').toBeTruthy;
    });
    it('check Cell range using sum ', () => {
        formula.value = '=sum(E1:E4)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value).toString();
        expect(result === '70').toBeTruthy;
    });
    it('check Cell range using sum ', () => {
        formula.value = '=sum(E1:E4,H1:H4,J1:J4)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value).toString();
        expect(result === '210').toBeTruthy;
    });

    it('Simple product formula', () => {
        formula.value = '=sum(mnop)';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === '#NAME?').toBeTruthy;
    });

});
describe('Calculate PRODUCT Formula', () => {
    let input1: any;
    let input2: any;
    let input3: any;
    let input4: any;
    let formula: any;
    let calculate: Calculate;
    let result: string | number;
    beforeEach(() => {
        calculate = new Calculate();
        input1 = createElement('input', { id: 'input1' });
        input1.value = '10';
        document.body.appendChild(input1);
        input2 = createElement('input', { id: 'input2' });
        input2.value = '15';
        document.body.appendChild(input2);
        input3 = createElement('input', { id: 'input3' });
        input3.value = '20';
        document.body.appendChild(input3);
        input4 = createElement('input', { id: 'input4' });
        input4.value = '25';
        document.body.appendChild(input4);
        formula = createElement('input', { id: 'formula' });
        calculate.setKeyValue('A', input1.value);
        calculate.setKeyValue('B', input2.value);
        calculate.setKeyValue('C', input3.value);
        calculate.setKeyValue('D', input4.value);
    });
    afterEach(() => {
        calculate.dispose();
        calculate = null;
        document.body.querySelectorAll('input').forEach((elem: HTMLInputElement) => elem.remove() );
    });

    it('Simple formula using key values ', () => {
        formula.value = '=A*B*C*D';
        document.body.appendChild(formula);
        expect(calculate.storedData.get('A').getFormulaText() === input1.value).toBeTruthy;
        expect(calculate.storedData.get('B').getFormulaText() === input2.value).toBeTruthy;
        expect(calculate.storedData.get('C').getFormulaText() === input3.value).toBeTruthy;
        expect(calculate.storedData.get('D').getFormulaText() === input4.value).toBeTruthy;
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(result === '75000').toBeTruthy;
    });
    it('Simple formula using key values ', () => {
        formula.value = '=A*B';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === '150').toBeTruthy;
    });
    it('calculate numbers using method ', () => {
        formula.value = '=2*4*6*8';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value).toString();
        expect(result === '384').toBeTruthy;
    });
    it('calculate numbers using product function', () => {
        formula.value = '=product(2*4*6*8)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value).toString();
        expect(result === '384').toBeTruthy;
    });
    it('calculate numbers using method', () => {
        formula.value = '=product(2*4*(-8))';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value).toString();
        expect(result === '-64').toBeTruthy;
    });
    it('Simple formula calculated using method ', () => {
        formula.value = '=5*product(2*4*6*8)*5';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '9600').toBeTruthy;
    });
    it('Simple formula calculated using method ', () => {
        formula.value = '=product(2*4)*5*6';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '240').toBeTruthy;
    });
    it('Simple formula calculated using method ', () => {
        formula.value = '=product(product(product(2*4*6*8)*5)*4)*6';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '46080').toBeTruthy;
    });
    it('check name manager', () => {
        formula.value = '=addname1*addname2';
        document.body.appendChild(formula);
        calculate.addNamedRange('addname1', '5');
        calculate.addNamedRange('addname2', '10');
        result = calculate.computeFormula(formula.value);
        expect(result === '50').toBeTruthy;
    });
    it('check name manager using sum formula', () => {
        formula.value = '=addname1*product(addname1*addname2)*addname2';
        document.body.appendChild(formula);
        calculate.addNamedRange('addname1', '5');
        calculate.addNamedRange('addname2', '10');
        result = calculate.computeFormula(formula.value);
        expect(result === '2500').toBeTruthy;
    });
    it('check name manager  and key values using sum formula', () => {
        formula.value = '=A*product(addname1*addname2*B)*C';
        document.body.appendChild(formula);
        calculate.addNamedRange('addname1', '5');
        calculate.addNamedRange('addname2', '10');
        result = calculate.computeFormula(formula.value);
        expect(result === '187500').toBeTruthy;
    });
    it('check arithmetic operator', () => {
        formula.value = '=2+3*4-8/4';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '12').toBeTruthy;
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(result === '12').toBeTruthy;
    });
    it('check arithmetic operator using sum formulas', () => {
        formula.value = '=product(2+3*4-8/4)+9-5';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '16').toBeTruthy;
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(result === '16').toBeTruthy;
    });
    it('Valid error', () => {
        formula.value = '=product(2+two)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === "#NAME?").toBeTruthy;
    });
    it('check Cell range using sum ', () => {
        formula.value = '=product(E1:E4)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '75000').toBeTruthy;
    });
    it('Using boolean value in formula', () => {
        formula.value = '=product(2*true)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '3').toBeTruthy;
    });
    it('Using boolean value in formula', () => {
        formula.value = '=product(2*false)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '2').toBeTruthy;
    });
    it('check invalid error', () => {
        formula.value = '=product()';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'invalid_arguments').toBeTruthy;
    });
    it('check invalid error', () => {
        formula.value = '=product(3*"value")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'invalid_arguments').toBeTruthy;
    });
    it('Simple product formula', () => {
        formula.value = '=product("mnop")';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === '#VALUE!').toBeTruthy;
    });
    it('Simple product formula', () => {
        formula.value = '=product(mnop)';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === '#NAME?').toBeTruthy;
    });
});
describe('Calculate COUNT Formula ', () => {
    let input1: any;
    let input2: any;
    let input3: any;
    let input4: any;
    let formula: any;
    let calculate: Calculate;
    let result: string | number;
    beforeEach(() => {
        calculate = new Calculate();
        input1 = createElement('input', { id: 'input1' });
        input1.value = '10';
        document.body.appendChild(input1);
        input2 = createElement('input', { id: 'input2' });
        input2.value = '15';
        document.body.appendChild(input2);
        input3 = createElement('input', { id: 'input3' });
        input3.value = 'count';
        document.body.appendChild(input3);
        input4 = createElement('input', { id: 'input4' });
        input4.value = '';
        document.body.appendChild(input4);
        formula = createElement('input', { id: 'formula' });
        calculate.setKeyValue('A', input1.value);
        calculate.setKeyValue('B', input2.value);
        calculate.setKeyValue('C', input3.value);
        calculate.setKeyValue('D', input4.value);
    });
    afterEach(() => {
        calculate.dispose();
        calculate = null;
        document.body.querySelectorAll('input').forEach((elem: HTMLInputElement) => elem.remove() );
    });

    it('Simple formula using key values ', () => {
        formula.value = '=count(A,B,C,D)';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        expect(calculate.storedData.get('A') instanceof FormulaInfo).toBeTruthy;
        expect(calculate.storedData.get('B') instanceof FormulaInfo).toBeTruthy;
        expect(calculate.storedData.get('C') instanceof FormulaInfo).toBeTruthy;
        expect(calculate.storedData.get('D') instanceof FormulaInfo).toBeTruthy;
        expect(calculate.storedData.get('F') instanceof FormulaInfo).toBeTruthy;
        expect(calculate.storedData.get('A').getFormulaText() === input1.value).toBeTruthy;
        expect(calculate.storedData.get('B').getFormulaText() === input2.value).toBeTruthy;
        expect(calculate.storedData.get('C').getFormulaText() === input3.value).toBeTruthy;
        expect(calculate.storedData.get('D').getFormulaText() === input4.value).toBeTruthy;
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === '2').toBeTruthy;
    });
    it('count the two numbers in key values', () => {
        formula.value = '=count(A,B)';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === '2').toBeTruthy;
    });
    it('check string and empty cell values count ', () => {
        formula.value = '=count(C,D)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '0').toBeTruthy;
    });
    it('count input values in formula', () => {
        formula.value = '=count(2,3,6,8)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '4').toBeTruthy;
    });

    it('check  boolean values in count formula', () => {
        formula.value = '=count(2,true,5,false)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '4').toBeTruthy;
    });
    it('Using Cell range', () => {
        formula.value = '=count(E1:E4)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        calculate.setKeyValue('F', formula.value);
        expect(result === 2).toBeTruthy;
    });
    it('check  boolean values with tic  in count formula', () => {
        formula.value = '=count(2,"true",5,"false")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '2').toBeTruthy;
    });
    it('check the invalid arguments', () => {
        formula.value = '=count()';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'wrong number of arguments').toBeTruthy;
    });
});
describe('Calculate COUNTA Formula', () => {
    let input1: any;
    let input2: any;
    let input3: any;
    let input4: any;
    let formula: any;
    let calculate: Calculate;
    let result: string | number;
    beforeEach(() => {
        calculate = new Calculate();
        input1 = createElement('input', { id: 'input1' });
        input1.value = '10';
        document.body.appendChild(input1);
        input2 = createElement('input', { id: 'input2' });
        input2.value = 'true';
        document.body.appendChild(input2);
        input3 = createElement('input', { id: 'input3' });
        input3.value = 'count';
        document.body.appendChild(input3);
        input4 = createElement('input', { id: 'input4' });
        input4.value = 'false';
        document.body.appendChild(input4);
        formula = createElement('input', { id: 'formula' });
        calculate.setKeyValue('A', input1.value);
        calculate.setKeyValue('B', input2.value);
        calculate.setKeyValue('C', input3.value);
        calculate.setKeyValue('D', input4.value);
    });
    afterEach(() => {
        calculate.dispose();
        calculate = null;
        document.body.querySelectorAll('input').forEach((elem: HTMLInputElement) => elem.remove() );
    });

    it('Simple formula using key values ', () => {
        formula.value = '=counta(A,B,C,D)';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === '4').toBeTruthy;
    });
    it('count the two numbers in key values', () => {
        formula.value = '=counta(A,B)';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === '2').toBeTruthy;
    });
    it('check string and empty cell values count ', () => {
        formula.value = '=counta(C,D)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '2').toBeTruthy;
    });
    it('count input values in formula', () => {
        formula.value = '=counta(2,3,6,8)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '4').toBeTruthy;
    });

    it('check boolean values in count formula', () => {
        formula.value = '=counta(2,true,5,false)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '4').toBeTruthy;
    });
    it('Using Cell range', () => {
        let result1: string | number;
        formula.value = '=counta(A1:A4)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        calculate.setKeyValue('F', formula.value);
        result1 = calculate.getKeyValue('F');
        expect(result === result1).toBeTruthy;
    });
    it('check  boolean values with tic  in count formula', () => {
        formula.value = '=counta(2,"true",5,"false")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '4').toBeTruthy;
    });
    it('check the invalid arguments', () => {
        formula.value = '=counta(3,true," ")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'wrong number of arguments').toBeTruthy;
    });
    it('check the invalid arguments', () => {
        formula.value = '=counta()';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'wrong number of arguments').toBeTruthy;
    });
    it('check the invalid arguments', () => {
        formula.value = '=counta(E1:E4)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '4').toBeTruthy;
    });
});
describe('Calculate IF Formula', () => {
    let input1: any;
    let input2: any;
    let formula: any;
    let calculate: Calculate;
    let result: string | number;
    beforeEach(() => {
        calculate = new Calculate();
        input1 = createElement('input', { id: 'input1' });
        input1.value = '10';
        document.body.appendChild(input1);
        input2 = createElement('input', { id: 'input2' });
        input2.value = '15';
        document.body.appendChild(input2);
        formula = createElement('input', { id: 'formula' });
        calculate.setKeyValue('A', input1.value);
        calculate.setKeyValue('B', input2.value);
    });
    afterEach(() => {
        calculate.dispose();
        calculate = null;
        document.body.querySelectorAll('input').forEach((elem: HTMLInputElement) => elem.remove() );
    });

    it('Simple formula using key values ', () => {
        formula.value = '=if(A>B, true, false)';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        expect(calculate.storedData.get('A') instanceof FormulaInfo).toBeTruthy;
        expect(calculate.storedData.get('B') instanceof FormulaInfo).toBeTruthy;
        expect(calculate.storedData.get('F') instanceof FormulaInfo).toBeTruthy;
        expect(calculate.storedData.get('A').getFormulaText() === input1.value).toBeTruthy;
        expect(calculate.storedData.get('B').getFormulaText() === input2.value).toBeTruthy;
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === 'FALSE').toBeTruthy;
    });
    it('Invalid arguments', () => {
        formula.value = '=if(A<B)';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === 'wrong number of arguments').toBeTruthy;
    });
    it('Using Key values ', () => {
        formula.value = '=if(5>4,A,B)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '10').toBeTruthy;
    });
    it('Using Key with valid error ', () => {
        formula.value = '=if(5>name,A,B)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '#NAME?').toBeTruthy;
    });
    it('check number with and without  tic', () => {
        formula.value = '=if(5=4,"4","5")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '5').toBeTruthy;
        formula.value = '=if(5>=4,4,5)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '4').toBeTruthy;
    });
    it('check more than three arguments', () => {
        formula.value = '=if(5<=4,4,5,7)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'wrong number of arguments').toBeTruthy;
    });
    it('check Invalid error', () => {
        formula.value = '=if()';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'invalid arguments').toBeTruthy;
    });
    it('check Valid error', () => {
        formula.value = '=if("")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '#VALUE!').toBeTruthy;
    });
    it('check empty arguments', () => {
        formula.value = '=if(5>=4,,)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '0').toBeTruthy;
    });
    it('check string arguments', () => {
        formula.value = '=if("APPLE"="APPLE","apple","banana")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'apple').toBeTruthy;
    });
    it('check string arguments Valid error', () => {
        formula.value = '=if("APPLE"="APPLE",apple,banana)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '#NAME?').toBeTruthy;
    });
    it('check string arguments Valid error', () => {
        formula.value = '=if(false,5,8)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '8').toBeTruthy;
    });
    it('check string arguments Valid error', () => {
        formula.value = 'if(true,5,8)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '5').toBeTruthy;
    });
    it('check string arguments Valid error', () => {
        formula.value = 'if(false,8)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'FALSE').toBeTruthy;
    });
    it('check string arguments Valid error', () => {
        formula.value = 'if(3>name)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '#NAME?').toBeTruthy;
    });
    it('check string arguments Valid error', () => {
        formula.value = 'if("value",3,4)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'requires 3 arguments').toBeTruthy;
    });
});
describe('Calculate ABS Formula', () => {
    let input1: any;
    let formula: any;
    let calculate: Calculate;
    let result: string | number;
    beforeEach(() => {
        calculate = new Calculate();
        input1 = createElement('input', { id: 'input1' });
        input1.value = '10';
        document.body.appendChild(input1);
        formula = createElement('input', { id: 'formula' });
        calculate.setKeyValue('A', input1.value);
    });
    afterEach(() => {
        calculate.dispose();
        calculate = null;
        document.body.querySelectorAll('input').forEach((elem: HTMLInputElement) => elem.remove() );
    });

    it('positive arguments with Key value', () => {
        formula.value = '=ABS(A)';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        expect(calculate.storedData.get('A') instanceof FormulaInfo).toBeTruthy;
        expect(calculate.storedData.get('F') instanceof FormulaInfo).toBeTruthy;
        expect(calculate.storedData.get('A').getFormulaText() === input1.value).toBeTruthy;
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === '10').toBeTruthy;
    });
    it('Negative arguments with Key value', () => {
        formula.value = '=ABS(-A)';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === '10').toBeTruthy;
    });
    it('positive arguments', () => {
        formula.value = '=ABS(8)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '8').toBeTruthy;
    });
    it('Negative arguments', () => {
        formula.value = '=ABS(-8)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '8').toBeTruthy;
    });
    it('Without arguments', () => {
        formula.value = '=ABS()';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'wrong number of arguments').toBeTruthy;
    });
    it('Empty string arguments', () => {
        formula.value = '=ABS("")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '#VALUE!').toBeTruthy;
    });
    it('String arguments', () => {
        formula.value = '=ABS("8")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '8').toBeTruthy;
    });
    it('String arguments', () => {
        formula.value = '=ABS("name")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === "#NAME?").toBeTruthy;
    });
});
describe('Calculate MIN Formula', () => {
    let input1: any;
    let input2: any;
    let input3: any;
    let input4: any;
    let formula: any;
    let calculate: Calculate;
    let result: string | number;
    beforeEach(() => {
        calculate = new Calculate();
        input1 = createElement('input', { id: 'input1' });
        input1.value = '10';
        document.body.appendChild(input1);
        input2 = createElement('input', { id: 'input2' });
        input2.value = '15';
        document.body.appendChild(input2);
        input3 = createElement('input', { id: 'input3' });
        input3.value = '20';
        document.body.appendChild(input3);
        input4 = createElement('input', { id: 'input4' });
        input4.value = '25';
        document.body.appendChild(input4);
        formula = createElement('input', { id: 'formula' });
        calculate.setKeyValue('A', input1.value);
        calculate.setKeyValue('B', input2.value);
        calculate.setKeyValue('C', input3.value);
        calculate.setKeyValue('D', input4.value);
    });
    afterEach(() => {
        calculate.dispose();
        calculate = null;
        document.body.querySelectorAll('input').forEach((elem: HTMLInputElement) => elem.remove() );
    });

    it('Find Minimum value using given Key values', () => {
        formula.value = '=Min(A,B,C,D)';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === '10').toBeTruthy;
    });
    it('Find Minimum value', () => {
        formula.value = '=Min(100,253,54,66)';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === '54').toBeTruthy;
    });
    it('Negative arguments', () => {
        formula.value = '=Min(100,-253,54,66)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '-253').toBeTruthy;
    });
    it('Negative arguments', () => {
        formula.value = '=MIN(100,-253,54,66,name)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '#NAME?').toBeTruthy;
    });
    it('check Invalid error', () => {
        formula.value = '=Min()';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'wrong number of arguments').toBeTruthy;
    });
    it('check Valid error', () => {
        formula.value = '=Min("")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '#VALUE!').toBeTruthy;
    });
});
describe('Calculate MAX Formula', () => {
    let input1: any;
    let input2: any;
    let input3: any;
    let input4: any;
    let formula: any;
    let calculate: Calculate;
    let result: string | number;
    beforeEach(() => {
        calculate = new Calculate();
        input1 = createElement('input', { id: 'input1' });
        input1.value = '10';
        document.body.appendChild(input1);
        input2 = createElement('input', { id: 'input2' });
        input2.value = '15';
        document.body.appendChild(input2);
        input3 = createElement('input', { id: 'input3' });
        input3.value = '20';
        document.body.appendChild(input3);
        input4 = createElement('input', { id: 'input4' });
        input4.value = '25';
        document.body.appendChild(input4);
        formula = createElement('input', { id: 'formula' });
        calculate.setKeyValue('A', input1.value);
        calculate.setKeyValue('B', input2.value);
        calculate.setKeyValue('C', input3.value);
        calculate.setKeyValue('D', input4.value);
    });
    afterEach(() => {
        calculate.dispose();
        calculate = null;
        document.body.querySelectorAll('input').forEach((elem: HTMLInputElement) => elem.remove() );
    });

    it('Find Maximum value using given Key values', () => {
        formula.value = '=Max(A,B,C,D)';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === '25').toBeTruthy;
    });
    it('Find Maximum value', () => {
        formula.value = '=Max(100,253,54,66)';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === '253').toBeTruthy;
    });
    it('Negative arguments', () => {
        formula.value = '=Max(100,-253,54,66)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '-100').toBeTruthy;
    });
    it('Negative arguments', () => {
        formula.value = '=Max(100,-253,54,66,name)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '#NAME?').toBeTruthy;
    });
    it('Without arguments', () => {
        formula.value = '=Max()';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'wrong number of arguments').toBeTruthy;
    });
    it('Empty string arguments', () => {
        formula.value = '=Max("")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '#VALUE!').toBeTruthy;
    });
});
describe('Calculate AND Formula', () => {
    let input1: any;
    let input2: any;
    let input3: any;
    let input4: any;
    let formula: any;
    let calculate: Calculate;
    let result: string | number;
    beforeEach(() => {
        calculate = new Calculate();
        input1 = createElement('input', { id: 'input1' });
        input1.value = '10';
        document.body.appendChild(input1);
        input2 = createElement('input', { id: 'input2' });
        input2.value = '15';
        document.body.appendChild(input2);
        input3 = createElement('input', { id: 'input3' });
        input3.value = '20';
        document.body.appendChild(input3);
        input4 = createElement('input', { id: 'input4' });
        input4.value = '';
        document.body.appendChild(input4);
        formula = createElement('input', { id: 'formula' });
        calculate.setKeyValue('A', input1.value);
        calculate.setKeyValue('B', input2.value);
        calculate.setKeyValue('C', input3.value);
        calculate.setKeyValue('D', input4.value);
    });
    afterEach(() => {
        calculate.dispose();
        calculate = null;
        document.body.querySelectorAll('input').forEach((elem: HTMLInputElement) => elem.remove() );
    });

    it('Check AND using given Key values', () => {
        formula.value = '=AND(A<B,B<C)';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === 'TRUE').toBeTruthy;
    });
    it('Check AND using given Key values', () => {
        formula.value = '=AND(A<B,B<C,C<D,D<A)';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === 'FALSE').toBeTruthy;
    });
    it('check AND conditions', () => {
        formula.value = '=AND(3=3,4=4)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'TRUE').toBeTruthy;
    });
    it('check AND conditions', () => {
        formula.value = '=AND(3=3,2>7,4=4)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'FALSE').toBeTruthy;
    });
    it('check AND conditions with boolean', () => {
        formula.value = '=AND(true,false)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'FALSE').toBeTruthy;
        formula.value = '=AND(TRUE,TRUE)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'TRUE').toBeTruthy;
    });
    it('check AND conditions with boolean', () => {
        formula.value = '=AND("true","false")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'FALSE').toBeTruthy;
        formula.value = '=AND("TRUE","TRUE")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'TRUE').toBeTruthy;
    });
    it('check AND conditions using cell', () => {
        formula.value = '=AND(A3=3,A4>7,A2=4)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'FALSE').toBeTruthy;
    });
    it('check Valid error', () => {
        formula.value = '=AND(" ")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '#VALUE!').toBeTruthy;
    });
    it('check Invalid error', () => {
        formula.value = '=AND(3+val,4-value)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '#NAME?').toBeTruthy;
    });
    it('check Invalid error', () => {
        formula.value = '=AND()';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'wrong number of arguments').toBeTruthy;
    });
    it('check Date in AND function', () => {
        formula.value = '=AND(3-4-2018)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'TRUE').toBeTruthy;
    });
    it('check AND function', () => {
        formula.value = '=AND(E1:E4,E2:E4)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'TRUE').toBeTruthy;
    });
    it('check Valid error', () => {
        formula.value = '=And("two" & "one")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '#VALUE!').toBeTruthy;
    });
});
describe('Calculate RAND Formula', () => {
    let formula: any;
    let calculate: Calculate;
    let result: string | number;
    beforeEach(() => {
        calculate = new Calculate();
        formula = createElement('input', { id: 'formula' });
    });
    afterEach(() => {
        calculate.dispose();
        calculate = null;
        document.body.querySelectorAll('input').forEach((elem: HTMLInputElement) => elem.remove() );
    });

    it('check rand formula', () => {
        formula.value = '=Rand()';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === result).toBeTruthy;
    });
    it('check rand formula', () => {
        formula.value = '=Rand(3,4)';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === "wrong_number_arguments").toBeTruthy;
    });
});
describe('Calculate DATE Formula', () => {
    let formula: any;
    let calculate: Calculate;
    let result: string | number;
    beforeEach(() => {
        calculate = new Calculate();
        formula = createElement('input', { id: 'formula' });
    });
    afterEach(() => {
        calculate.dispose();
        calculate = null;
        document.body.querySelectorAll('input').forEach((elem: HTMLInputElement) => elem.remove() );
    });
    it('check the date in formula', () => {
        formula.value = '=DATE(2019,10,9)';
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(result === '2019/10/09').toBeTruthy;
    });
    it('check the date in  formula', () => {
        formula.value = '=DATE(2019+3,10,9)';
        result = calculate.computeFormula(formula.value);
        expect(result === '2022/10/09').toBeTruthy;
        formula.value = '=DATE(2019+1,10-8,9+7)';
        result = calculate.computeFormula(formula.value);
        expect(result === '2020/02/16').toBeTruthy;
    });
    it('check Invalid error', () => {
        formula.value = '=DATE(2019/10/9)';
        result = calculate.computeFormula(formula.value);
        expect(result === 'wrong number of arguments').toBeTruthy;
    });
    it('check boolean value in Date formula', () => {
        formula.value = '=DATE(true,10,9)';
        result = calculate.computeFormula(formula.value);
        expect(result === '1901/10/09').toBeTruthy;
    });
    it('check boolean value with tic in Date formula', () => {
        formula.value = '=DATE("true",10,9)';
        result = calculate.computeFormula(formula.value);
        expect(result === '#VALUE!').toBeTruthy;
    });
    it('check Date formula', () => {
        formula.value = '=DATE("2019","10","9")';
        result = calculate.computeFormula(formula.value);
        expect(result === '2019/10/09').toBeTruthy;
    });
    it('check Date formula', () => {
        formula.value = '=DATE(2019-10-9)';
        result = calculate.computeFormula(formula.value);
        expect(result === 'wrong number of arguments').toBeTruthy;
    });
    it('check Date formula', () => {
        formula.value = '=DATE(09-10-2019)';
        result = calculate.computeFormula(formula.value);
        expect(result === 'wrong number of arguments').toBeTruthy;
    });
    it('check Date formula', () => {
        formula.value = '=DATE(0,0,0)';
        result = calculate.computeFormula(formula.value);
        expect(result === '#NUM!').toBeTruthy;
    });
    it('check Date formula', () => {
        formula.value = '=DATE(0,10,9)';
        result = calculate.computeFormula(formula.value);
        expect(result === '1900/10/09').toBeTruthy;
    });
    it('check Date formula', () => {
        formula.value = '=DATE()';
        result = calculate.computeFormula(formula.value);
        expect(result === 'wrong number of arguments').toBeTruthy;
    });

});
describe('Calculate AVERAGE Formula', () => {
    let input1: any;
    let input2: any;
    let input3: any;
    let input4: any;
    let formula: any;
    let calculate: Calculate;
    let result: string | number;
    beforeEach(() => {
        calculate = new Calculate();
        input1 = createElement('input', { id: 'input1' });
        input1.value = '10';
        document.body.appendChild(input1);
        input2 = createElement('input', { id: 'input2' });
        input2.value = '15';
        document.body.appendChild(input2);
        input3 = createElement('input', { id: 'input3' });
        input3.value = '20';
        document.body.appendChild(input3);
        input4 = createElement('input', { id: 'input4' });
        input4.value = '25';
        document.body.appendChild(input4);
        formula = createElement('input', { id: 'formula' });
        calculate.setKeyValue('A', input1.value);
        calculate.setKeyValue('B', input2.value);
        calculate.setKeyValue('C', input3.value);
        calculate.setKeyValue('D', input4.value);
    });
    afterEach(() => {
        calculate.dispose();
        calculate = null;
        document.body.querySelectorAll('input').forEach((elem: HTMLInputElement) => elem.remove() );
    });
    it('Simple formula using key values ', () => {
        formula.value = '=Average(A,B,C,D)';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === '17.5').toBeTruthy;
    });
    it('calculate numbers using method', () => {
        formula.value = '=Average(2,4,name,8)';
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === '#NAME?').toBeTruthy;
    });
    it('calculate numbers using method', () => {
        formula.value = '=Average(2,4,"value",8)';
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === '#VALUE!').toBeTruthy;
    });
    it('Simple formula calculated using method ', () => {
        formula.value = '=Average(2,4,6,8)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '5').toBeTruthy;
    });
    it('Simple formula calculated using method ', () => {
        formula.value = '=Average(E1:E4)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '17.5').toBeTruthy;
    });
    it('Simple formula calculated using method ', () => {
        formula.value = '=Average("2","4","6","8")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '5').toBeTruthy;
    });
    it('Simple formula calculated using method ', () => {
        formula.value = '=AVERAGE(2+5,7+4,3+6,28)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '13.75').toBeTruthy;
    });
    it('Simple formula calculated using method ', () => {
        formula.value = '=AVERAGE(2,4,6,8)+Average(2,4,6,8)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '10').toBeTruthy;
    });

    it('check Valid Error', () => {
        formula.value = '=AVERAGE(2,4,"value",8)+Average(2,4,6,8)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '#VALUE!').toBeTruthy;
    });
    it('Without arguments', () => {
        formula.value = '=Average()';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'invalid arguments').toBeTruthy;
    });
    it('Empty string arguments', () => {
        formula.value = '=Average("")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '#VALUE!').toBeTruthy;
    });
    it('Empty string arguments', () => {
        formula.value = '=Average("mnop")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '#VALUE!').toBeTruthy;
    });
    it('Empty string arguments', () => {
        formula.value = '=Average("mnop")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '#NAME!').toBeTruthy;
    });
    it('Single arguments', () => {
        formula.value = '=Average(8)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '8').toBeTruthy;
    });
    it('Empty string arguments', () => {
        formula.value = '=Average(2,4, ,8)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '3.75').toBeTruthy;
    });
    it('check Cell range using average ', () => {
        formula.value = '=average(E1:E4,H1:H4,J1:J4)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value).toString();
        expect(result === '17.5').toBeTruthy;
    });
});

describe('Calculate FIND Formula', () => {
    let calculate: Calculate;
    let formula: any;
    let result: string | number;
    beforeEach(() => {
        calculate = new Calculate();
        formula = createElement('input', { id: 'formula' });
    });
    afterEach(() => {
        calculate.dispose();
        calculate = null;
        document.body.querySelectorAll('input').forEach((elem: HTMLInputElement) => elem.remove() );
    });
    it('Simple formula using key values ', () => {
        formula.value = '=find("M",A1)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '1').toBeTruthy;
    });
    it('calculate numbers using method', () => {
        formula.value = '=find("m",A1)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '6').toBeTruthy;
    });
    it('calculate numbers using method', () => {
        formula.value = '=find("G","Miriam McGovern")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '10').toBeTruthy;
    });
    it('calculate numbers using method', () => {
        formula.value = '=find("G","Miriam McGovern",12)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '#VALUE!').toBeTruthy;
    });
    it('Simple formula calculated using method ', () => {
        formula.value = '=FIND("G","Miriam McGovern",9)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '10').toBeTruthy;
    });
    it('Simple formula calculated using method ', () => {
        formula.value = '=FIND("G","Miriam McGovern",10)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '10').toBeTruthy;
    });
    it('Simple formula calculated using method ', () => {
        formula.value = '=FIND("G","Miriam McGovern",9,8)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'wrong number of arguments').toBeTruthy;
    });

    it('check Valid error', () => {
        formula.value = '=FIND("G","Miriam McGovern",0)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '#VALUE!').toBeTruthy;
    });
    it('Without arguments', () => {
        formula.value = '=FIND("G","Miriam McGovern",-1)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '#VALUE!').toBeTruthy;
    });
    it('Empty string arguments', () => {
        formula.value = '=FIND("")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'wrong number of arguments').toBeTruthy;
    });
    it('Empty string arguments', () => {
        formula.value = '=FIND()';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'wrong number of arguments').toBeTruthy;
    });
});
describe('Calculate IFS Formula', () => {
    let input1: any;
    let input2: any;
    let input3: any;
    let input4: any;
    let formula: any;
    let calculate: Calculate;
    let result: string | number;
    beforeEach(() => {
        calculate = new Calculate();
        input1 = createElement('input', { id: 'input1' });
        input1.value = '10';
        document.body.appendChild(input1);
        input2 = createElement('input', { id: 'input2' });
        input2.value = '15';
        document.body.appendChild(input2);
        input3 = createElement('input', { id: 'input2' });
        input3.value = 'name';
        document.body.appendChild(input2);
        input4 = createElement('input', { id: 'input2' });
        input4.value = 'value';
        document.body.appendChild(input2);
        formula = createElement('input', { id: 'formula' });
        calculate.setKeyValue('A', input1.value);
        calculate.setKeyValue('B', input2.value);
        calculate.setKeyValue('C', input3.value);
        calculate.setKeyValue('D', input4.value);
    });
    afterEach(() => {
        calculate.dispose();
        calculate = null;
        document.body.querySelectorAll('input').forEach((elem: HTMLInputElement) => elem.remove() );
    });
    it('Simple formula using key values ', () => {
        formula.value = '=ifs(A<5,"A",B>6,"B",C<9,"C",D>7,"D")';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === 'D').toBeTruthy;
    });
    it('Simple ifs formula', () => {
        formula.value = '=ifs(4<5,"A",5>6,"B",7<9,"C")';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === 'A').toBeTruthy;
    });
    it('Invalid arguments', () => {
        formula.value = '=ifS(A>B, true, false)';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === 'wrong number of arguments').toBeTruthy;
    });
    it('Check Ifs condition ', () => {
        formula.value = '=ifs(3=1,"A",4=2,"3",2=3,"4",2=4,"5",2=5,"6",2=2,"7",3=7,"8")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '7').toBeTruthy;
    });
    it('Using Key with valid error ', () => {
        formula.value = '=ifs(5>name,A,B)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '#NAME?').toBeTruthy;
    });
    it('check all condition is false', () => {
        formula.value = '=ifs(3=1,"A",4=2,"3",2=3,"4",2=4,"5",2=5,"6",2=5,"7",3=7,"8")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '	#N/A').toBeTruthy;
    });
    it('check more than three arguments', () => {
        formula.value = '=ifs(5<=4,4,5,7)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '#VALUE!').toBeTruthy;
    });
    it('check Invalid error', () => {
        formula.value = '=ifs()';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'wrong number of arguments').toBeTruthy;
    });
    it('check Valid error', () => {
        formula.value = '=ifs("")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '#VALUE!').toBeTruthy;
    });
    it('check string arguments', () => {
        formula.value = '=ifs("APPLE"="APPLE","apple","banana")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'apple').toBeTruthy;
    });
    it('check string arguments Valid error', () => {
        formula.value = '=ifs("APPLE"="APPLE","APPLE",2=6,"banana")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'APPLE').toBeTruthy;
    });
    it('check string arguments Valid error', () => {
        formula.value = '=ifs(false,"4",true,"6")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '8').toBeTruthy;
    });
    it('check string arguments Valid error', () => {
        formula.value = '=ifs(false,"4",false,"6")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '#N/A').toBeTruthy;
    });
    it('check string arguments Valid error', () => {
        formula.value = '=ifs(true,true,"6")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'TRUE').toBeTruthy;
    });
    it('check string arguments Valid error', () => {
        formula.value = '=ifs(false,true,"6")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '#VALUE!').toBeTruthy;
    });
});
describe('Calculate CONCATENATE Formula', () => {
    let input1: any;
    let input2: any;
    let formula: any;
    let calculate: Calculate;
    let result: string | number;
    beforeEach(() => {
        calculate = new Calculate();
        input1 = createElement('input', { id: 'input1' });
        input1.value = '20';
        document.body.appendChild(input1);
        input2 = createElement('input', { id: 'input2' });
        input2.value = '10';
        document.body.appendChild(input2);
        formula = createElement('input', { id: 'formula' });
        calculate.setKeyValue('A', input1.value);
        calculate.setKeyValue('B', input2.value);
    });
    afterEach(() => {
        calculate.dispose();
        calculate = null;
        document.body.querySelectorAll('input').forEach((elem: HTMLInputElement) => elem.remove() );
    });
    it('Simple formula using key values ', () => {
        formula.value = '=CONCATENATE("Hello ""World")';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === 'Hello World').toBeTruthy;
    });
    it('Simple concatenate formula', () => {
        formula.value = '=CONCATENATE()';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === 'invalid arguments').toBeTruthy;
    });
    it('Simple concatenate formula', () => {
        formula.value = '=CONCATENATE("The"," ","sun"," ","will"," ","come"," ","up"," ","tomorrow.")';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === 'The sun will come up tomorrow.').toBeTruthy;
    });
    it('Simple concatenate formula', () => {
        formula.value = '=CONCATENATE(3>8)';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === result).toBeTruthy;
    });
    it('Simple concatenate formula', () => {
        formula.value = '=CONCATENATE("Please Enter the value ",B," to ",A)';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === 'Please Enter the value 10 to 20').toBeTruthy;
    });
    it('Simple concatenate formula', () => {
        formula.value = '=CONCATENATE("Please Enter the value ",E2," to ",E1)';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === 'Please Enter the value 10 to 20').toBeTruthy;
    });
    it('Simple concatenate formula', () => {
        formula.value = '=CONCATENATE("mnop")';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === 'mnop').toBeTruthy;
    });
    it('Simple concatenate formula', () => {
        formula.value = '=CONCATENATE(mnop)';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === '#NAME?').toBeTruthy;
    });
});
describe('Calculate CONCAT Formula', () => {
    let input1: any;
    let input2: any;
    let input3: any;
    let input4: any;
    let formula: any;
    let result: any;
    let calculate: Calculate;
    beforeEach(() => {
        calculate = new Calculate();
        input1 = createElement('input', { id: 'input1' });
        input1.value = '10';
        document.body.appendChild(input1);
        input2 = createElement('input', { id: 'input2' });
        input2.value = '20';
        input3 = createElement('input', { id: 'input3' });
        input3.value = 'Hello';
        document.body.appendChild(input1);
        input4 = createElement('input', { id: 'input4' });
        input4.value = 'World';
        document.body.appendChild(input2);
        formula = createElement('input', { id: 'formula' });
        calculate.setKeyValue('A', input1.value);
        calculate.setKeyValue('B', input2.value);
    });
    afterEach(() => {
        calculate.dispose();
        calculate = null;
        document.body.querySelectorAll('input').forEach((elem: HTMLInputElement) => elem.remove() );
    });
    it('Simple formula using key values ', () => {
        formula.value = '=CONCAT("Hello ""World")';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === 'Hello World').toBeTruthy;
    });
    it('Simple concat formula', () => {
        formula.value = '=CONCAT()';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === 'invalid arguments').toBeTruthy;
    });
    it('Simple concatenate formula', () => {
        formula.value = '=CONCAT("The"," ","sun"," ","will"," ","come"," ","up"," ","tomorrow.")';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === 'The sun will come up tomorrow.').toBeTruthy;
    });
    it('Simple concatenate formula', () => {
        formula.value = '=CONCAT(3>8)';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === "FALSE").toBeTruthy;
    });
    it('Simple concatenate formula', () => {
        formula.value = '=CONCAT("Please Enter the value ",B," to ",A)';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === 'Please Enter the value 10 to 20').toBeTruthy;
    });
    it('Simple concatenate formula', () => {
        formula.value = '=CONCAT("Please Enter the value ",E1," to ",E2)';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === 'Please Enter the value 10 to 20').toBeTruthy;
    });
    it('Simple concatenate formula', () => {
        formula.value = '=CONCAT(E3:E4)';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === 'HelloWorld').toBeTruthy;
    });
    it('Simple concatenate formula', () => {
        formula.value = '=concat("mnop")';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === 'mnop').toBeTruthy;
    });
    it('Simple concatenate formula', () => {
        formula.value = '=concat(mnop)';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === '#NAME?').toBeTruthy;
    });
});
describe('Calculate IFERROR Formula', () => {
    let input1: any;
    let input2: any;
    let input3: any;
    let input4: any;
    let formula: any;
    let calculate: Calculate;
    let result: string | number;
    beforeEach(() => {
        calculate = new Calculate();
        input1 = createElement('input', { id: 'input1' });
        input1.value = '6';
        document.body.appendChild(input1);
        input2 = createElement('input', { id: 'input2' });
        input2.value = '3';
        document.body.appendChild(input2);
        input3 = createElement('input', { id: 'input3' });
        input3.value = '2';
        document.body.appendChild(input2);
        input4 = createElement('input', { id: 'input4' });
        input4.value = 'value';
        document.body.appendChild(input2);
        formula = createElement('input', { id: 'formula' });
        calculate.setKeyValue('A', input1.value);
        calculate.setKeyValue('B', input2.value);
        calculate.setKeyValue('C', input3.value);
        calculate.setKeyValue('D', input4.value);
    });
    afterEach(() => {
        calculate.dispose();
        calculate = null;
        document.body.querySelectorAll('input').forEach((elem: HTMLInputElement) => elem.remove() );
    });
    it('Simple formula using key values ', () => {
        formula.value = '=IFERROR(A2/B2, "Error in calculation")';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === 'Error in calculation').toBeTruthy;
    });
    it('Simple ifs formula', () => {
        formula.value = '=IFERROR(A/B/C, "Error in calculation")';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === '1').toBeTruthy;
    });
    it('Invalid arguments', () => {
        formula.value = '=IFERROR(A1/B1/C1, "Error in calculation")';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === 'Error in calculation').toBeTruthy;
    });
    it('Check Ifs condition ', () => {
        formula.value = '=IFERROR(A/B, "Error in calculation")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '2').toBeTruthy;
    });
    it('Check Ifs condition ', () => {
        formula.value = '=IFERROR(A/D, "Error in calculation")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'Error in calculation').toBeTruthy;
    });
    it('check all condition is false', () => {
        formula.value = '=IFERROR(3/0)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'wrong number of arguments').toBeTruthy;
    });
    it('check all condition is false', () => {
        formula.value = '=IFERROR(3/0,"Not divided by zero")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'wrong number of arguments').toBeTruthy;
    });
    it('check more than three arguments', () => {
        formula.value = '=IFERROR()';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'invalid arguments').toBeTruthy;
    });
    it('check string arguments Valid error', () => {
        formula.value = '=IFERROR(false,false)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'FALSE').toBeTruthy;
    });
    it('check string arguments Valid error', () => {
        formula.value = '=IFERROR(true, "false")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'TRUE').toBeTruthy;
    });
});
describe('Calculate SUMIF Formula', () => {
    let input1: any;
    let input2: any;
    let input3: any;
    let input4: any;
    let formula: any;
    let calculate: Calculate;
    let result: string | number;
    beforeEach(() => {
        calculate = new Calculate();
        input1 = createElement('input', { id: 'input1' });
        input1.value = 'java';
        document.body.appendChild(input1);
        input2 = createElement('input', { id: 'input2' });
        input2.value = '15';
        document.body.appendChild(input2);
        input3 = createElement('input', { id: 'input3' });
        input3.value = 'java';
        document.body.appendChild(input3);
        input4 = createElement('input', { id: 'input4' });
        input4.value = '15';
        document.body.appendChild(input4);
        formula = createElement('input', { id: 'formula' });
        calculate.setKeyValue('A', input1.value);
        calculate.setKeyValue('B', input2.value);
        calculate.setKeyValue('C', input3.value);
        calculate.setKeyValue('D', input4.value);
    });
    afterEach(() => {
        calculate.dispose();
        calculate = null;
        document.body.querySelectorAll('input').forEach((elem: HTMLInputElement) => elem.remove() );
    });

    it('Simple formula using key values ', () => {
        formula.value = '=sumif("")';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === 'improper formula').toBeTruthy;
    });
    it('Simple sumif formula', () => {
        formula.value = '=sumif()';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === 'improper formula').toBeTruthy;
    });
    it('Invalid arguments', () => {
        formula.value = '=sumif(E1:E4,"java")';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === '0').toBeTruthy;
    });
    it('Check sumif condition ', () => {
        formula.value = '=sumif(E1:E4,"15")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '30').toBeTruthy;
    });
    it('Check sumif condition ', () => {
        formula.value = '=sumif(E1:E4,">15",E1:E3)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '0').toBeTruthy;
    });
    it('Check sumif condition ', () => {
        formula.value = '=sumif(E1:E4,">10",E1:E4)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '0').toBeTruthy;
    });
});
describe('Calculate AVERAGEIF Formula', () => {
    let input1: any;
    let input2: any;
    let input3: any;
    let input4: any;
    let formula: any;
    let calculate: Calculate;
    let result: string | number;
    beforeEach(() => {
        calculate = new Calculate();
        input1 = createElement('input', { id: 'input1' });
        input1.value = '4';
        document.body.appendChild(input1);
        input2 = createElement('input', { id: 'input2' });
        input2.value = '15';
        document.body.appendChild(input2);
        input3 = createElement('input', { id: 'input3' });
        input3.value = '6';
        document.body.appendChild(input3);
        input4 = createElement('input', { id: 'input4' });
        input4.value = '15';
        document.body.appendChild(input4);
        formula = createElement('input', { id: 'formula' });
        calculate.setKeyValue('A', input1.value);
        calculate.setKeyValue('B', input2.value);
        calculate.setKeyValue('C', input3.value);
        calculate.setKeyValue('D', input4.value);
    });
    afterEach(() => {
        calculate.dispose();
        calculate = null;
        document.body.querySelectorAll('input').forEach((elem: HTMLInputElement) => elem.remove() );
    });
    it('Invalid arguments ', () => {
        formula.value = '=averageif("")';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === 'improper formula').toBeTruthy;
    });
    it('Invalid arguments', () => {
        formula.value = '=averageif()';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === 'improper formula').toBeTruthy;
    });
    it('Check averageif condition', () => {
        formula.value = '=averageif(E1:E4,"15")';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === '15').toBeTruthy;
    });
    it('Check averageif condition ', () => {
        formula.value = '=averageif(E1:E4,"15",E1:E4)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '15').toBeTruthy;
    });
    it('Check averageif condition ', () => {
        formula.value = '=AverageIF(E1:E4,">5",H1:H4)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '12').toBeTruthy;
    });
    it('Check averageif condition ', () => {
        formula.value = '=AverageIF(E1:E4,"<5",H1:H4)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '4').toBeTruthy;
    });
});
describe('Calculate COUNTIF Formula', () => {
    let input1: any;
    let input2: any;
    let input3: any;
    let input4: any;
    let formula: any;
    let calculate: Calculate;
    let result: string | number;
    beforeEach(() => {
        calculate = new Calculate();
        input1 = createElement('input', { id: 'input1' });
        input1.value = '10';
        document.body.appendChild(input1);
        input2 = createElement('input', { id: 'input2' });
        input2.value = '15';
        document.body.appendChild(input2);
        input3 = createElement('input', { id: 'input3' });
        input3.value = 'true';
        document.body.appendChild(input3);
        input4 = createElement('input', { id: 'input4' });
        input4.value = 'false';
        document.body.appendChild(input4);
        formula = createElement('input', { id: 'formula' });
        calculate.setKeyValue('A', input1.value);
        calculate.setKeyValue('B', input2.value);
        calculate.setKeyValue('C', input3.value);
        calculate.setKeyValue('D', input4.value);
    });
    afterEach(() => {
        calculate.dispose();
        calculate = null;
        document.body.querySelectorAll('input').forEach((elem: HTMLInputElement) => elem.remove() );
    });
    it('Check invalid arguments ', () => {
        formula.value = '=countif()';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === 'improper formula').toBeTruthy;
    });
    it('Check countif arguments', () => {
        formula.value = '=countif(E1:E4,"=10")';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === '0').toBeTruthy;
    });
    it('Check countif invalid arguments ', () => {
        formula.value = '=countif(E1:E4,">=10",H1:H4)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'wrong number of arguments').toBeTruthy;
    });
    it('Check countif less than equal condition ', () => {
        formula.value = '=countif(E1:E4,"<=50")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'wrong number of arguments').toBeTruthy;
    });
    it('Check countif less than equal condition', () => {
        formula.value = '=countif(E1:E4,">=2010",H1:H4)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'wrong number of arguments').toBeTruthy;
    });
    it('Check countif not equal condition ', () => {
        formula.value = '=countif(E1:E4,"<>2010",H1:H4)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'wrong number of arguments').toBeTruthy;
    });
    it('Check countif less than condition', () => {
        formula.value = '=countif(E1:E4,"<2010",H1:H4)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'wrong number of arguments').toBeTruthy;
    });
    it('Check countif greater than equal condition', () => {
        formula.value = '=countif(E1:E4,">2010",H1:H4)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'wrong number of arguments').toBeTruthy;
    });
    it('Check countif equal condition', () => {
        formula.value = '=countif(E1:E4,"=2010",H1:H4)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'wrong number of arguments').toBeTruthy;

    });
});
describe('Calculate AVERAGEA Formula', () => {
    let input1: any;
    let input2: any;
    let input3: any;
    let input4: any;
    let formula: any;
    let calculate: Calculate;
    let result: string | number;
    beforeEach(() => {
        calculate = new Calculate();
        input1 = createElement('input', { id: 'input1' });
        input1.value = '10';
        document.body.appendChild(input1);
        input2 = createElement('input', { id: 'input2' });
        input2.value = '15';
        document.body.appendChild(input2);
        input3 = createElement('input', { id: 'input3' });
        input3.value = 'true';
        document.body.appendChild(input3);
        input4 = createElement('input', { id: 'input4' });
        input4.value = 'false';
        document.body.appendChild(input4);
        formula = createElement('input', { id: 'formula' });
        calculate.setKeyValue('A', input1.value);
        calculate.setKeyValue('B', input2.value);
        calculate.setKeyValue('C', input3.value);
        calculate.setKeyValue('D', input4.value);
    });
    afterEach(() => {
        calculate.dispose();
        calculate = null;
        document.body.querySelectorAll('input').forEach((elem: HTMLInputElement) => elem.remove() );
    });
    it('Simple formula using key values ', () => {
        formula.value = '=Averagea(A,B,C,D)';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === '6.5').toBeTruthy;
    });
    it('check Valid Error', () => {
        formula.value = '=Averagea(2,4,name,8)';
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === '#NAME?').toBeTruthy;
    });
    it('check Valid Error', () => {
        formula.value = '=Average(2,4,"value",8)';
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === '#VALUE!').toBeTruthy;
    });
    it('Simple formula calculated using method ', () => {
        formula.value = '=Averagea(2,4,6,8)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '5').toBeTruthy;
    });
    it('Simple formula calculated using method ', () => {
        formula.value = '=Averagea("2","4","6","8")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '5').toBeTruthy;
    });
    it('Simple formula calculated using method ', () => {
        formula.value = '=Averagea(2+5,7+4,3+6,28)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '13.75').toBeTruthy;
    });
    it('Simple formula calculated using method ', () => {
        formula.value = '=Averagea(2,4,6,8)+Averagea(2,4,6,8)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '10').toBeTruthy;
    });
    it('check Valid Error', () => {
        formula.value = '=Averagea(2,4,"value",8)+Average(2,4,6,8)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '#VALUE!').toBeTruthy;
    });
    it('Without arguments', () => {
        formula.value = '=Averagea()';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'wrong number of arguments').toBeTruthy;
    });
    it('Empty string arguments', () => {
        formula.value = '=Averagea("")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '#VALUE!').toBeTruthy;
    });
    it('Single arguments', () => {
        formula.value = '=Averagea(8)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '8').toBeTruthy;
    });
    it('Empty string arguments', () => {
        formula.value = '=Averagea(2,4, ,8, , , )';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '2').toBeTruthy;
    });
    it('Using boolean arguments', () => {
        formula.value = '=Averagea(2,4,true,8)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '3.75').toBeTruthy;
    });
    it('Using boolean arguments', () => {
        formula.value = '=Averagea(2,4,8,false)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '3.5').toBeTruthy;
    });
    it('Find Averagea using cell range ', () => {
        formula.value = '=Averagea(E1:E2)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '12.5').toBeTruthy;
    });
    it('Find Averagea using cell range ', () => {
        formula.value = '=Averagea(E1:E3)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '8.666666666666666').toBeTruthy;
    });
    it('Using boolean arguments', () => {
        formula.value = '=averagea(E1:E4)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '6.5').toBeTruthy;
    });
});
describe('Calculate CHOOSE Formula', () => {
    let input1: any;
    let input2: any;
    let input3: any;
    let input4: any;
    let formula: any;
    let calculate: Calculate;
    let result: string | number;
    beforeEach(() => {
        calculate = new Calculate();
        input1 = createElement('input', { id: 'input1' });
        input1.value = '10';
        document.body.appendChild(input1);
        input2 = createElement('input', { id: 'input2' });
        input2.value = '15';
        document.body.appendChild(input2);
        input3 = createElement('input', { id: 'input3' });
        input3.value = 'true';
        document.body.appendChild(input3);
        input4 = createElement('input', { id: 'input4' });
        input4.value = '8';
        document.body.appendChild(input4);
        formula = createElement('input', { id: 'formula' });
        calculate.setKeyValue('A', input1.value);
        calculate.setKeyValue('B', input2.value);
        calculate.setKeyValue('C', input3.value);
        calculate.setKeyValue('D', input4.value);
    });
    afterEach(() => {
        calculate.dispose();
        calculate = null;
        document.body.querySelectorAll('input').forEach((elem: HTMLInputElement) => elem.remove() );
    });
    it('Simple formula using key values ', () => {
        formula.value = '=choose(2,A,B,C,D)';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === '15').toBeTruthy;
    });
    it('calculate numbers using method', () => {
        formula.value = '=choose(4,10,15,true,"9/10/2019")';
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === '9/10/2019').toBeTruthy;
    });
    it('calculate numbers using method', () => {
        formula.value = '=choose(2,10,15,true,"9/10/2019")';
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === '15').toBeTruthy;
    });
    it('Check Valid Eroor ', () => {
        formula.value = '=choose(-8,4,6,8)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '#VALUE!').toBeTruthy;
    });
    it('Simple formula calculated using method ', () => {
        formula.value = '=choose("2","4","6","8")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '6').toBeTruthy;
    });
    it('Simple formula calculated using method ', () => {
        formula.value = '=choose(2+1,7+4,3+6,28)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '28').toBeTruthy;
    });
    it('Simple formula calculated using method ', () => {
        formula.value = '=choose(2,4,6,8)+choose(2,4,6,8)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '12').toBeTruthy;
    });

    it('check Valid Error', () => {
        formula.value = '=choose(8,4,6,8)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '#VALUE!').toBeTruthy;
    });
    it('Without arguments', () => {
        formula.value = '=choose()';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'invalid arguments').toBeTruthy;
    });
    it('Empty string arguments', () => {
        formula.value = '=choose("")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'wrong number of arguments').toBeTruthy;
    });
    it('Single arguments', () => {
        formula.value = '=choose(8)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'wrong number of arguments').toBeTruthy;
    });
    it('Empty string arguments', () => {
        formula.value = '=choose(2,4, ,8, , , )';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '0').toBeTruthy;
    });
    it('Using boolean arguments', () => {
        formula.value = '=choose(2,4,true,8)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'TRUE').toBeTruthy;
    });
    it('Using boolean arguments', () => {
        formula.value = '=choose(2,4,8,false)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '3.5').toBeTruthy;
    });
    it('Find Averagea using cell range ', () => {
        formula.value = '=choose(2,E1,E2,E3,E4)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '15').toBeTruthy;
    });
    it('Using boolean arguments', () => {
        formula.value = '=choose(2,E1:E4)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '#VALUE!').toBeTruthy;
    });
    it('Using boolean arguments', () => {
        formula.value = '=choose(E1:E4,2)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '#VALUE!').toBeTruthy;
    });

});
describe('Calculate SUMIFS Formula', () => {
    let input1: any;
    let input2: any;
    let input3: any;
    let input4: any;
    let formula: any;
    let calculate: Calculate;
    let result: string | number;
    beforeEach(() => {
        calculate = new Calculate();
        input1 = createElement('input', { id: 'input1' });
        input1.value = 'java';
        document.body.appendChild(input1);
        input2 = createElement('input', { id: 'input2' });
        input2.value = '15';
        document.body.appendChild(input2);
        input3 = createElement('input', { id: 'input3' });
        input3.value = 'java';
        document.body.appendChild(input3);
        input4 = createElement('input', { id: 'input4' });
        input4.value = '15';
        document.body.appendChild(input4);
        formula = createElement('input', { id: 'formula' });
        calculate.setKeyValue('A', input1.value);
        calculate.setKeyValue('B', input2.value);
        calculate.setKeyValue('C', input3.value);
        calculate.setKeyValue('D', input4.value);
    });
    afterEach(() => {
        calculate.dispose();
        calculate = null;
        document.body.querySelectorAll('input').forEach((elem: HTMLInputElement) => elem.remove() );
    });

    it('Invalid arguments', () => {
        formula.value = '=sumifs("")';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === 'wrong number of arguments').toBeTruthy;
    });
    it('Invalid arguments', () => {
        formula.value = '=sumifs()';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === 'wrong number of arguments').toBeTruthy;
    });
    it('Check sumif condition', () => {
        formula.value = '=sumifs(E1:E4,E1:E4,"<>Bananas",H1:H4,"Tom")';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === '0').toBeTruthy;
    });
    it('Check sumif condition ', () => {
        formula.value = '=SUMIFS(E1:E4,H1:H4,"<>Bananas")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '0').toBeTruthy;
    });
    it('Invalid arguments', () => {
        formula.value = '=sumifs(E1:E4)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'wrong number of arguments').toBeTruthy;
    });
});
describe('Calculate AVERAGEIFS Formula', () => {
    let input1: any;
    let input2: any;
    let input3: any;
    let input4: any;
    let formula: any;
    let calculate: Calculate;
    let result: string | number;
    beforeEach(() => {
        calculate = new Calculate();
        input1 = createElement('input', { id: 'input1' });
        input1.value = 'java';
        document.body.appendChild(input1);
        input2 = createElement('input', { id: 'input2' });
        input2.value = '15';
        document.body.appendChild(input2);
        input3 = createElement('input', { id: 'input3' });
        input3.value = 'java';
        document.body.appendChild(input3);
        input4 = createElement('input', { id: 'input4' });
        input4.value = '15';
        document.body.appendChild(input4);
        formula = createElement('input', { id: 'formula' });
        calculate.setKeyValue('A', input1.value);
        calculate.setKeyValue('B', input2.value);
        calculate.setKeyValue('C', input3.value);
        calculate.setKeyValue('D', input4.value);
    });
    afterEach(() => {
        calculate.dispose();
        calculate = null;
        document.body.querySelectorAll('input').forEach((elem: HTMLInputElement) => elem.remove() );
    });

    it('Invalid arguments ', () => {
        formula.value = '=averageifs("")';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === 'wrong number of arguments').toBeTruthy;
    });
    it('Invalid arguments', () => {
        formula.value = '=averageifs()';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === 'wrong number of arguments').toBeTruthy;
    });
    it('Check averageifs condition', () => {
        formula.value = '=averageifs(E1:E4,E1:E4,"<>Bananas",H1:H4,"Tom")';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === '0').toBeTruthy;
    });
    it('Check averageifs condition ', () => {
        formula.value = '=averageifs(E1:E4,H1:H4,"<>Bananas")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '0').toBeTruthy;
    });
    it('Invalid arguments', () => {
        formula.value = '=averageifs(E1:E4)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'wrong number of arguments').toBeTruthy;
    });
});
describe('Calculate COUNTIFS Formula', () => {
    let input1: any;
    let input2: any;
    let input3: any;
    let input4: any;
    let formula: any;
    let calculate: Calculate;
    let result: string | number;
    beforeEach(() => {
        calculate = new Calculate();
        input1 = createElement('input', { id: 'input1' });
        input1.value = 'java';
        document.body.appendChild(input1);
        input2 = createElement('input', { id: 'input2' });
        input2.value = '15';
        document.body.appendChild(input2);
        input3 = createElement('input', { id: 'input3' });
        input3.value = 'java';
        document.body.appendChild(input3);
        input4 = createElement('input', { id: 'input4' });
        input4.value = '15';
        document.body.appendChild(input4);
        formula = createElement('input', { id: 'formula' });
        calculate.setKeyValue('A', input1.value);
        calculate.setKeyValue('B', input2.value);
        calculate.setKeyValue('C', input3.value);
        calculate.setKeyValue('D', input4.value);
    });
    afterEach(() => {
        calculate.dispose();
        calculate = null;
        document.body.querySelectorAll('input').forEach((elem: HTMLInputElement) => elem.remove() );
    });

    it('Invalid arguments ', () => {
        formula.value = '=countifs("")';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === 'wrong number of arguments').toBeTruthy;
    });
    it('Invalid arguments', () => {
        formula.value = '=countifs()';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === 'wrong number of arguments').toBeTruthy;
    });
    it('Check countifs condition', () => {
        formula.value = '=countifs(E1:E4,E1:E4,"<>Bananas",H1:H4,"Tom")';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === '0').toBeTruthy;
    });
    it('Check countifs condition ', () => {
        formula.value = '=countifs(E1:E4,H1:H4,"<>Bananas")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '0').toBeTruthy;
    });
    it('Invalid arguments', () => {
        formula.value = '=countifs(E1:E4)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'wrong number of arguments').toBeTruthy;
    });
});
describe('Calculate INDEX Formula', () => {
    let input1: any;
    let input2: any;
    let input3: any;
    let input4: any;
    let formula: any;
    let calculate: Calculate;
    let result: string | number;
    beforeEach(() => {
        calculate = new Calculate();
        input1 = createElement('input', { id: 'input1' });
        input1.value = '2';
        document.body.appendChild(input1);
        input2 = createElement('input', { id: 'input2' });
        input2.value = '3';
        document.body.appendChild(input2);
        input3 = createElement('input', { id: 'input3' });
        input3.value = '4';
        document.body.appendChild(input3);
        input4 = createElement('input', { id: 'input4' });
        input4.value = '5';
        document.body.appendChild(input4);
        formula = createElement('input', { id: 'formula' });
        calculate.setKeyValue('A', input1.value);
        calculate.setKeyValue('B', input2.value);
        calculate.setKeyValue('C', input3.value);
        calculate.setKeyValue('D', input4.value);
    });
    afterEach(() => {
        calculate.dispose();
        calculate = null;
        document.body.querySelectorAll('input').forEach((elem: HTMLInputElement) => elem.remove() );
    });
    it('check the index in formula', () => {
        formula.value = '=index(E2:H4,2,3)';
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(result === '4').toBeTruthy;
    });
    it('check valid error', () => {
        formula.value = '=index(E2:H4,A,D)';
        result = calculate.computeFormula(formula.value);
        expect(result === '#REF!').toBeTruthy;
    });
    it('check valid error', () => {
        formula.value = '=index(E2:H4,2)';
        result = calculate.computeFormula(formula.value);
        expect(result === '#REF!').toBeTruthy;
    });
    it('check valid error', () => {
        formula.value = '=index(E2:H4,row,col)';
        result = calculate.computeFormula(formula.value);
        expect(result === '#NAME?').toBeTruthy;
    });
    it('check Invalid error', () => {
        formula.value = '=index()';
        result = calculate.computeFormula(formula.value);
        expect(result === 'wrong number of arguments').toBeTruthy;
    });

    it('check boolean value with tic in index formula', () => {
        formula.value = '=INDEX((E1:I4, E2:H4),2,2,2)';
        result = calculate.computeFormula(formula.value);
        expect(result === '#NAME?').toBeFalsy;
    });
    it('check boolean value with tic in index formula', () => {
        formula.value = '=INDEX((E1:I4,E2:H4),2,2)';
        result = calculate.computeFormula(formula.value);
        expect(result === '#NAME?').toBeFalsy;
    });
});
describe('Calculate FLOOR Formula', () => {
    let input1: any;
    let input2: any;
    let input3: any;
    let input4: any;
    let formula: any;
    let calculate: Calculate;
    let result: string | number;
    beforeEach(() => {
        calculate = new Calculate();
        input1 = createElement('input', { id: 'input1' });
        input1.value = '12.6';
        document.body.appendChild(input1);
        input2 = createElement('input', { id: 'input2' });
        input2.value = '3';
        document.body.appendChild(input2);
        input3 = createElement('input', { id: 'input1' });
        input3.value = '6';
        document.body.appendChild(input3);
        input4 = createElement('input', { id: 'input1' });
        input4.value = '7';
        document.body.appendChild(input4);
        formula = createElement('input', { id: 'formula' });
        calculate.setKeyValue('A', input1.value);
        calculate.setKeyValue('B', input2.value);
    });
    afterEach(() => {
        calculate.dispose();
        calculate = null;
        document.body.querySelectorAll('input').forEach((elem: HTMLInputElement) => elem.remove() );
    });
    it('check the floor in formula using key values', () => {
        formula.value = '=floor(A,B)';
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(result === '12').toBeTruthy;
    });
    it('check the floor in formula using key values', () => {
        formula.value = '=floor(A,C)';
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(result === '12').toBeTruthy;
    });
    it('check the floor in formula using key values', () => {
        formula.value = '=floor(A,D)';
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(result === '7').toBeTruthy;
    });
    it('check the floor in formula using key values', () => {
        formula.value = '=floor(A,-2)';
        result = calculate.computeFormula(formula.value);
        expect(result === '#NUM!').toBeTruthy;
    });
    it('check the floor in formula', () => {
        formula.value = '=floor(-3,-2)';
        result = calculate.computeFormula(formula.value);
        expect(result === '-2').toBeTruthy;
    });
    it('check the floor in formula', () => {
        formula.value = '=floor(-13,-2)';
        result = calculate.computeFormula(formula.value);
        expect(result === '').toBeTruthy;
    });
    it('check Invalid error', () => {
        formula.value = '=floor()';
        result = calculate.computeFormula(formula.value);
        expect(result === 'invalid arguments').toBeTruthy;
    });
    it('check Invalid error', () => {
        formula.value = '=floor(4)';
        result = calculate.computeFormula(formula.value);
        expect(result === 'wrong number of arguments').toBeFalsy;
    });
    it('check the floor in formula', () => {
        formula.value = '=floor(124.4,7)';
        result = calculate.computeFormula(formula.value);
        expect(result === '119').toBeFalsy;
    });
    it('check Valid error', () => {
        formula.value = '=floor(two,4)';
        result = calculate.computeFormula(formula.value);
        expect(result === '#NAME?').toBeFalsy;
    });
    it('check Valid error', () => {
        formula.value = '=floor(67two,4)';
        result = calculate.computeFormula(formula.value);
        expect(result === '#NAME?').toBeFalsy;
    });
    it('check Valid error', () => {
        formula.value = '=floor("name",2)';
        result = calculate.computeFormula(formula.value);
        expect(result === '#VALUE!').toBeFalsy;
    });
    it('check boolean in floor formula', () => {
        formula.value = '=floor(17.8,true)';
        result = calculate.computeFormula(formula.value);
        expect(result === '17').toBeFalsy;
    });
    it('check boolean in floor formula', () => {
        formula.value = '=floor(17.8,false)';
        result = calculate.computeFormula(formula.value);
        expect(result === '#DIV/0!').toBeFalsy;
    });
    it('check boolean in floor formula', () => {
        formula.value = '=floor(17.8,0)';
        result = calculate.computeFormula(formula.value);
        expect(result === '#DIV/0!').toBeFalsy;
    });
});
describe('Calculate CEILING Formula', () => {
    let input1: any;
    let input2: any;
    let input3: any;
    let input4: any;
    let formula: any;
    let calculate: Calculate;
    let result: string | number;
    beforeEach(() => {
        calculate = new Calculate();
        input1 = createElement('input', { id: 'input1' });
        input1.value = '12.6';
        document.body.appendChild(input1);
        input2 = createElement('input', { id: 'input2' });
        input2.value = '3';
        document.body.appendChild(input2);
        input3 = createElement('input', { id: 'input1' });
        input3.value = '6';
        document.body.appendChild(input3);
        input4 = createElement('input', { id: 'input1' });
        input4.value = '7';
        document.body.appendChild(input4);
        formula = createElement('input', { id: 'formula' });
        calculate.setKeyValue('A', input1.value);
        calculate.setKeyValue('B', input2.value);
    });
    afterEach(() => {
        calculate.dispose();
        calculate = null;
        document.body.querySelectorAll('input').forEach((elem: HTMLInputElement) => elem.remove() );
    });
    it('check the ceiling in formula using key values', () => {
        formula.value = '=ceiling(A,B)';
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(result === '15').toBeTruthy;
    });
    it('check the ceiling in formula using key values', () => {
        formula.value = '=ceiling(A,C)';
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(result === '18').toBeTruthy;
    });
    it('check the ceiling in formula using key values', () => {
        formula.value = '=ceiling(A,D)';
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(result === '14').toBeTruthy;
    });
    it('check the ceiling in formula using key values', () => {
        formula.value = '=ceiling(A,-2)';
        result = calculate.computeFormula(formula.value);
        expect(result === '#NUM!').toBeTruthy;
    });
    it('check the ceiling in formula', () => {
        formula.value = '=ceiling(-3,-2)';
        result = calculate.computeFormula(formula.value);
        expect(result === '-4').toBeTruthy;
    });
    it('check the ceiling in formula', () => {
        formula.value = '=ceiling(-13,-2)';
        result = calculate.computeFormula(formula.value);
        expect(result === '-14').toBeTruthy;
    });
    it('check Invalid error', () => {
        formula.value = '=ceiling()';
        result = calculate.computeFormula(formula.value);
        expect(result === 'invalid arguments').toBeTruthy;
    });
    it('check Invalid error', () => {
        formula.value = '=ceiling(4)';
        result = calculate.computeFormula(formula.value);
        expect(result === 'wrong number of arguments').toBeFalsy;
    });
    it('check the floor in formula', () => {
        formula.value = '=ceiling(124.4,7)';
        result = calculate.computeFormula(formula.value);
        expect(result === '126').toBeFalsy;
    });
    it('check Valid error', () => {
        formula.value = '=ceiling(two,4)';
        result = calculate.computeFormula(formula.value);
        expect(result === '#NAME?').toBeFalsy;
    });
    it('check Valid error', () => {
        formula.value = '=ceiling(67two,4)';
        result = calculate.computeFormula(formula.value);
        expect(result === '#NAME?').toBeFalsy;
    });
    it('check Valid error', () => {
        formula.value = '=ceiling("name",2)';
        result = calculate.computeFormula(formula.value);
        expect(result === '#VALUE!').toBeFalsy;
    });
    it('check boolean in ceiling formula', () => {
        formula.value = '=ceiling(17.8,true)';
        result = calculate.computeFormula(formula.value);
        expect(result === '17').toBeFalsy;
    });
    it('check boolean in ceiling formula', () => {
        formula.value = '=ceiling(17.8,false)';
        result = calculate.computeFormula(formula.value);
        expect(result === '0').toBeFalsy;
    });
    it('check boolean in ceiling formula', () => {
        formula.value = '=ceiling(17.8,0)';
        result = calculate.computeFormula(formula.value);
        expect(result === '0').toBeFalsy;
    });
});
describe('Calculate DAYS Formula', () => {
    let formula: any;
    let calculate: Calculate;
    let result: string | number;
    beforeEach(() => {
        calculate = new Calculate();
        formula = createElement('input', { id: 'formula' });
    });
    afterEach(() => {
        calculate.dispose();
        calculate = null;
        document.body.querySelectorAll('input').forEach((elem: HTMLInputElement) => elem.remove() );
    });
    it('check the days in formula', () => {
        formula.value = '=DAYS("3/15/11","2/1/11")';
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(result === '42').toBeTruthy;
    });
    it('check the days in formula using key values', () => {
        formula.value = '=DAYS("3/15/11","2/1/11")';
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(result === '18').toBeTruthy;
    });
    it('check Invalid error', () => {
        formula.value = '=days()';
        result = calculate.computeFormula(formula.value);
        expect(result === 'wrong number of arguments').toBeTruthy;
    });
    it('check Invalid error', () => {
        formula.value = '=DAYS("3/15/11")';
        result = calculate.computeFormula(formula.value);
        expect(result === 'wrong number of arguments').toBeTruthy;
    });
});
describe('Calculate DAYS Formula', () => {
    let formula: any;
    let calculate: Calculate;
    let result: string | number;
    beforeEach(() => {
        calculate = new Calculate();
        formula = createElement('input', { id: 'formula' });
    });
    afterEach(() => {
        calculate.dispose();
        calculate = null;
        document.body.querySelectorAll('input').forEach((elem: HTMLInputElement) => elem.remove() );
    });
    it('check Invalid error', () => {
        formula.value = '=DAY("3/15/11")';
        result = calculate.computeFormula(formula.value);
        expect(result === '15').toBeTruthy;
    });
    it('check the days in formula', () => {
        formula.value = '=DAY("3/15/11","2/1/11")';
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(result === 'wrong number of arguments').toBeTruthy;
    });
    it('check the days in formula using key values', () => {
        formula.value = '=DAY("3/15/11","2/1/11")';
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(result === '18').toBeTruthy;
    });
    it('check Invalid error', () => {
        formula.value = '=day()';
        result = calculate.computeFormula(formula.value);
        expect(result === 'invalid arguments').toBeTruthy;
    });
});
describe('Calculate OR Formula', () => {
    let input1: any;
    let input2: any;
    let input3: any;
    let input4: any;
    let formula: any;
    let calculate: Calculate;
    let result: string | number;
    beforeEach(() => {
        calculate = new Calculate();
        input1 = createElement('input', { id: 'input1' });
        input1.value = '10';
        document.body.appendChild(input1);
        input2 = createElement('input', { id: 'input2' });
        input2.value = '15';
        document.body.appendChild(input2);
        input3 = createElement('input', { id: 'input3' });
        input3.value = '20';
        document.body.appendChild(input3);
        input4 = createElement('input', { id: 'input4' });
        input4.value = '';
        document.body.appendChild(input4);
        formula = createElement('input', { id: 'formula' });
        calculate.setKeyValue('A', input1.value);
        calculate.setKeyValue('B', input2.value);
        calculate.setKeyValue('C', input3.value);
        calculate.setKeyValue('D', input4.value);
    });
    afterEach(() => {
        calculate.dispose();
        calculate = null;
        document.body.querySelectorAll('input').forEach((elem: HTMLInputElement) => elem.remove() );
    });

    it('Check OR using given Key values', () => {
        formula.value = '=or(A<B,B<C,C<D)';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === 'TRUE').toBeTruthy;
    });
    it('Check OR using given Key values', () => {
        formula.value = '=or(A<B,B<C,C<D,D<A)';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === 'FALSE').toBeFalsy;
    });
    it('Check OR using given Key values', () => {
        formula.value = '=or(A<B,B<C,C<D,D<A)';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === 'TRUE').toBeTruthy;
    });
    it('Check OR using given Key values', () => {
        formula.value = '=or(A=B,B=C,C=D,D=A)';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === 'FALSE').toBeTruthy;
    });
    it('check OR conditions', () => {
        formula.value = '=or(3=3,4=4)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'TRUE').toBeTruthy;
    });
    it('check OR conditions', () => {
        formula.value = '=or(3=3,2>7,4=4)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'TRUE').toBeTruthy;
    });
    it('check OR conditions', () => {
        formula.value = '=or(mnop>8)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '#NAME?').toBeTruthy;
    });
    it('check OR conditions with boolean', () => {
        formula.value = '=or(true,false)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'TRUE').toBeTruthy;
        formula.value = '=or(TRUE,TRUE)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'TRUE').toBeTruthy;
    });
    it('check OR conditions with boolean', () => {
        formula.value = '=or("true","false")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'FALSE').toBeTruthy;
        formula.value = '=or("TRUE","TRUE")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'TRUE').toBeTruthy;
    });
    it('check Valid error', () => {
        formula.value = '=or(" ")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '#VALUE!').toBeTruthy;
    });
    it('check Invalid error', () => {
        formula.value = '=or(3+val,4-value)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '#NAME?').toBeTruthy;
    });
    it('check Invalid error', () => {
        formula.value = '=or()';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'wrong number of arguments').toBeTruthy;
    });
    it('check Date in OR function', () => {
        formula.value = '=or(3-4-2018)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'TRUE').toBeTruthy;
    });
    it('check OR function', () => {
        formula.value = '=or(E1:E4,E2:E4)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'FALSE').toBeTruthy;
    });
    it('check Valid error', () => {
        formula.value = '=or("two" & "one")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '#VALUE!').toBeTruthy;
    });
});
describe('Calculate LOOKUP Formula', () => {
    let input1: any;
    let input2: any;
    let input3: any;
    let input4: any;
    let formula: any;
    let calculate: Calculate;
    let result: string | number;
    beforeEach(() => {
        calculate = new Calculate();
        input1 = createElement('input', { id: 'input1' });
        input1.value = '5.4';
        document.body.appendChild(input1);
        input2 = createElement('input', { id: 'input2' });
        input2.value = '2.5';
        document.body.appendChild(input2);
        input3 = createElement('input', { id: 'input3' });
        input3.value = '3.6';
        document.body.appendChild(input3);
        input4 = createElement('input', { id: 'input4' });
        input4.value = '7.6';
        document.body.appendChild(input4);
        formula = createElement('input', { id: 'formula' });
        calculate.setKeyValue('A', input1.value);
        calculate.setKeyValue('B', input2.value);
        calculate.setKeyValue('C', input3.value);
        calculate.setKeyValue('D', input4.value);
    });
    afterEach(() => {
        calculate.dispose();
        calculate = null;
        document.body.querySelectorAll('input').forEach((elem: HTMLInputElement) => elem.remove() );
    });

    it('Simple formula using key values ', () => {
        formula.value = '=lookup(B,E1:E4,H1:H4)';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === '2.5').toBeTruthy;
    });
    it('Invalid arguments', () => {
        formula.value = '=lookup()';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === 'wrong number of arguments').toBeTruthy;
    });
    it('Check lookup condition', () => {
        formula.value = '=lookup(B,E1:E4)';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === '2.5').toBeTruthy;
    });
    it('Check lookup condition', () => {
        formula.value = '=lookup(3.6,E1:E4,H1:H4)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '3.6').toBeTruthy;
    });
    it('Check lookup condition ', () => {
        formula.value = '=lookup(8,E1:E4,H1:H4)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '7.6').toBeTruthy;
    });
    it('Valid arguments', () => {
        formula.value = '=lookup(0,E1:E4,H1:H4)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '	#N/A').toBeTruthy;
    });
    it('Valid arguments', () => {
        formula.value = '=lookup(2,E1:E4,H1:H4)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '#N/A').toBeTruthy;
    });
});
describe('Calculate MATCH Formula', () => {
    let input1: any;
    let input2: any;
    let input3: any;
    let input4: any;
    let formula: any;
    let calculate: Calculate;
    let result: string | number;
    beforeEach(() => {
        calculate = new Calculate();
        input1 = createElement('input', { id: 'input1' });
        input1.value = '5.4';
        document.body.appendChild(input1);
        input2 = createElement('input', { id: 'input2' });
        input2.value = 'javascript';
        document.body.appendChild(input2);
        input3 = createElement('input', { id: 'input3' });
        input3.value = 'scriptjava';
        document.body.appendChild(input3);
        input4 = createElement('input', { id: 'input4' });
        input4.value = '7.6';
        document.body.appendChild(input4);
        formula = createElement('input', { id: 'formula' });
        calculate.setKeyValue('A', input1.value);
        calculate.setKeyValue('B', input2.value);
        calculate.setKeyValue('C', input3.value);
        calculate.setKeyValue('D', input4.value);
    });
    afterEach(() => {
        calculate.dispose();
        calculate = null;
        document.body.querySelectorAll('input').forEach((elem: HTMLInputElement) => elem.remove() );
    });

    it('Simple formula using key values ', () => {
        formula.value = '=match(A,E1:E4)';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === '1').toBeTruthy;
    });
    it('Invalid Error', () => {
        formula.value = '=match()';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === 'wrong number of arguments').toBeTruthy;
    });
    it('Check match condition', () => {
        formula.value = '=match(7.6,E1:E4)';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === 4).toBeTruthy;
    });
    it('Valid Error', () => {
        formula.value = '=match(3.6,E1:E4,1)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '#N/A').toBeTruthy;
    });
    it('Valid Error', () => {
        formula.value = '=match(3.6,E1:E4,0)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '	#N/A').toBeTruthy;
    });
    it('Check match condition', () => {
        formula.value = '=match("*script",E1:E4,0)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '2').toBeTruthy;
    });
    it('Check match condition', () => {
        formula.value = '=match("script*",E1:E4,0)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '3').toBeTruthy;
    });
    it('Valid Error', () => {
        formula.value = '=match(8,E1:E4,-1)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '	#N/A').toBeTruthy;
    });
    it('Check match condition', () => {
        formula.value = '=match(7.8,E1:E4,true)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 4).toBeTruthy;
    });
    it('Check match condition', () => {
        formula.value = '=match(8.7,E1:E4,true)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 4).toBeTruthy;
    });
    it('Check match condition', () => {
        formula.value = '=match(3.6,E1:E4,false)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 3).toBeTruthy;
    });
    it('Check match condition', () => {
        formula.value = '=match("scriptjava",E1:E4,false)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '3').toBeTruthy;
    });
    it('Valid arguments', () => {
        formula.value = '=match(2,E1:E4,5)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '#N/A').toBeTruthy;
    });
});
describe('Calculate VLOOKUP Formula', () => {
    let input1: any;
    let input2: any;
    let input3: any;
    let input4: any;
    let formula: any;
    let calculate: Calculate;
    let result: string | number;
    beforeEach(() => {
        calculate = new Calculate();
        input1 = createElement('input', { id: 'input1' });
        input1.value = '20';
        document.body.appendChild(input1);
        input2 = createElement('input', { id: 'input2' });
        input2.value = '30';
        document.body.appendChild(input2);
        input3 = createElement('input', { id: 'input3' });
        input3.value = '40';
        document.body.appendChild(input3);
        input4 = createElement('input', { id: 'input4' });
        input4.value = '50';
        document.body.appendChild(input4);
        formula = createElement('input', { id: 'formula' });
        calculate.setKeyValue('A', input1.value);
        calculate.setKeyValue('B', input2.value);
        calculate.setKeyValue('C', input3.value);
        calculate.setKeyValue('D', input4.value);
    });
    afterEach(() => {
        calculate.dispose();
        calculate = null;
        document.body.querySelectorAll('input').forEach((elem: HTMLInputElement) => elem.remove() );
    });

    it('Simple formula using key values ', () => {
        formula.value = '=Vlookup(E2,E1:E4,2,false)';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === '#N/A').toBeTruthy;
    });
    it('Invalid arguments', () => {
        formula.value = '=Vlookup()';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === 'wrong number of arguments').toBeTruthy;
    });
    it('Check lookup condition', () => {
        formula.value = '=Vlookup(E2:E3,E1:E4,2,false)';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === '#VALUE!').toBeTruthy;
    });
    // it('Check lookup condition', () => {
    //     formula.value = '=Vlookup(E2,E1:H4,2,true)';
    //     document.body.appendChild(formula);
    //     result = calculate.computeFormula(formula.value);
    //     expect(result === '#N/A').toBeTruthy;
    // });
    it('Check lookup condition', () => {
        formula.value = '=Vlookup(E2,E1:H4,13,true)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '#N/A').toBeTruthy;
    });
    it('Check lookup condition', () => {
        formula.value = '=Vlookup(E2,E1:L4,0,true)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '	#N/A').toBeTruthy;
    });
    it('Check lookup condition', () => {
        formula.value = '=Vlookup(E2,E1:H4,2,false)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '50').toBeTruthy;
    });
    it('Check lookup condition', () => {
        formula.value = '=Vlookup(E2,E1:H4,13,false)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '#N/A').toBeTruthy;
    });
    it('Check lookup condition', () => {
        formula.value = '=Vlookup(E2,E1:H4,0,true)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '#N/A').toBeTruthy;
    });
});
describe('Calculate SUBTOTAL Formula', () => {
    let input1: any;
    let input2: any;
    let input3: any;
    let input4: any;
    let formula: any;
    let calculate: Calculate;
    let result: string | number;
    beforeEach(() => {
        calculate = new Calculate();
        input1 = createElement('input', { id: 'input1' });
        input1.value = '3';
        document.body.appendChild(input1);
        input2 = createElement('input', { id: 'input2' });
        input2.value = '5';
        document.body.appendChild(input2);
        input3 = createElement('input', { id: 'input3' });
        input3.value = '7';
        document.body.appendChild(input3);
        input4 = createElement('input', { id: 'input4' });
        input4.value = '10/09/2019';
        document.body.appendChild(input4);
        formula = createElement('input', { id: 'formula' });
        calculate.setKeyValue('A', input1.value);
        calculate.setKeyValue('B', input2.value);
        calculate.setKeyValue('C', input3.value);
        calculate.setKeyValue('D', input4.value);
    });
    afterEach(() => {
        calculate.dispose();
        calculate = null;
        document.body.querySelectorAll('input').forEach((elem: HTMLInputElement) => elem.remove() );
    });
    it('Simple formula using key values ', () => {
        formula.value = '=subtotal()';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === 'wrong number of arguments').toBeTruthy;
    });
    it('check Valid Error', () => {
        formula.value = '=subtotal(A,E1:E4)';
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === 4).toBeTruthy;
    });
    it('Simple formula calculated using method ', () => {
        formula.value = '=subtotal(0,E1:E4)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '#VALUE!').toBeTruthy;
    });
    it('Simple formula calculated using method ', () => {
        formula.value = '=subtotal(2, E1:E4)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 3).toBeTruthy;
    });
    it('Simple formula calculated using method ', () => {
        formula.value = '=subtotal(12,E1:E4)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '#VALUE!').toBeTruthy;
    });
    it('Using boolean arguments', () => {
        formula.value = '=subtotal(E1:E4)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'wrong number of arguments').toBeTruthy;
    });
    it('Using boolean arguments', () => {
        formula.value = '=subtotal(7, E4)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 9).toBeTruthy;
    });
});
describe('Calculate RADIANS Formula', () => {
    let input1: any;
    let formula: any;
    let calculate: Calculate;
    let result: string | number;
    beforeEach(() => {
        calculate = new Calculate();
        input1 = createElement('input', { id: 'input1' });
        input1.value = '20';
        document.body.appendChild(input1);
        formula = createElement('input', { id: 'formula' });
        calculate.setKeyValue('A', input1.value);
    });
    afterEach(() => {
        calculate.dispose();
        calculate = null;
        document.body.querySelectorAll('input').forEach((elem: HTMLInputElement) => elem.remove() );
    });

    it('Arguments with Key value', () => {
        formula.value = '=radians(A)';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        expect(calculate.storedData.get('A') instanceof FormulaInfo).toBeTruthy;
        expect(calculate.storedData.get('F') instanceof FormulaInfo).toBeTruthy;
        expect(calculate.storedData.get('A').getFormulaValue() === input1.value).toBeTruthy;
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === 0.3490658503988659).toBeTruthy;
    });
    it('Negative arguments with Key value', () => {
        formula.value = '=radians(-A)';
        document.body.appendChild(formula);
        calculate.setKeyValue('F', formula.value);
        result = calculate.getKeyValue('F');
        expect(calculate.storedData.get('F').getFormulaValue() === -0.3490658503988659).toBeTruthy;
    });
    it('positive arguments', () => {
        formula.value = '=radians(8)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 0.13962634015954636).toBeTruthy;
    });
    it('Negative arguments', () => {
        formula.value = '=radians(-8)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === -0.13962634015954636).toBeTruthy;
    });
    it('Without arguments', () => {
        formula.value = '=radians()';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 'wrong number of arguments').toBeTruthy;
    });
    it('Empty string arguments', () => {
        formula.value = '=radians("")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '#VALUE!').toBeTruthy;
    });
    it('Number arguments in string value', () => {
        formula.value = '=radians("30")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === 0.5235987755982988).toBeTruthy;
    });
    it('String arguments', () => {
        formula.value = '=radians("name")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '#VALUE!').toBeTruthy;
    });
    it('Cell range arguments', () => {
        formula.value = '=radians(A1:A3)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '#VALUE!').toBeTruthy;
    });
    it('Combined numbers and string arguments', () => {
        formula.value = '=radians("ak96")';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '#VALUE!').toBeTruthy;
    });
    it('string arguments', () => {
        formula.value = '=radians(abcd)';
        document.body.appendChild(formula);
        result = calculate.computeFormula(formula.value);
        expect(result === '#NAME?').toBeTruthy;
    });
});


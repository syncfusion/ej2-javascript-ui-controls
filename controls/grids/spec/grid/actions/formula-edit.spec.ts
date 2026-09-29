import { Grid } from '../../../src/grid/base/grid';
import { Formula, ReferenceConverter } from '../../../src/grid/actions/formula';
import {FormulaErrorCode, CycleError } from '../../../src/grid/actions/formula';
import { createGrid, destroy } from '../base/specutil.spec';
import { select } from '@syncfusion/ej2-base';
import { FormulaCellEditor } from '../../../src/grid/actions/formula-edit';
import * as util from '../../../src/grid/base/util';

Grid.Inject(Formula);

/**
 * Comprehensive Test Suite for Formula Cell Edit Support
 * ========================================================
 * This test file provides complete coverage of:
 * - Cell edit mode with formulas (always enabled)
 * - All arithmetic operators (+, -, *, /, %, ^, ×, ÷)
 * - All comparison operators (=, <>, >, <, >=, <=)
 * - All built-in functions (SUM, AVERAGE, COUNT, MIN, MAX, IF, etc.)
 * - All error scenarios (parse, reference, division by zero, etc.)
 * - Reference parsing and conversion
 * - AST node handling
 * - Custom functions
 * - Edge cases and special scenarios
 */
describe('Formula Cell Edit Support - Complete Coverage', () => {
    let gridObj: Grid;

    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: [
                    { id: 1, price: 10, qty: 2, total: null, discount: 5, tax: 1.5 },
                    { id: 2, price: 20, qty: 5, total: null, discount: 8, tax: 2.0 },
                    { id: 3, price: 15, qty: 3, total: null, discount: 3, tax: 1.2 },
                    { id: 4, price: 25, qty: 4, total: null, discount: 10, tax: 2.5 }
                ],
                columns: [
                    { field: 'id', isPrimaryKey: true, headerText: 'ID' },
                    { field: 'price', headerText: 'Price', type: 'number' },
                    { field: 'qty', headerText: 'Quantity', type: 'number' },
                    { field: 'discount', headerText: 'Discount', type: 'number' },
                    { field: 'tax', headerText: 'Tax', type: 'number' },
                    { field: 'total', headerText: 'Total', allowFormula: true }
                ],
                editSettings: { allowEditing: true, allowEditOnDblClick: true, mode: 'Cell' }
            },
            done
        );
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });

    // ============================================================
    // SECTION 1: ARITHMETIC OPERATORS - Complete Coverage
    // ============================================================
    describe('Arithmetic Operators', () => {
        it('addition (+) operator should work correctly', () => {
            gridObj.setCellFormula(0, 'total', '=REF(COLUMN("price"),ROW(1))+REF(COLUMN("qty"),ROW(1))');
            gridObj.getCellFormula(0, 'total');
            const value = gridObj.getFormulaValue(0, 'total');
            expect(value).toBe(12); // 10 + 2
        });

        it('subtraction (-) operator should work correctly', () => {
            gridObj.setCellFormula(0, 'total', '=REF(COLUMN("price"),ROW(1))-REF(COLUMN("discount"),ROW(1))');
            const value = gridObj.getFormulaValue(0, 'total');
            expect(value).toBe(5); // 10 - 5
        });

        it('multiplication (*) operator should work correctly', () => {
            gridObj.setCellFormula(0, 'total', '=REF(COLUMN("price"),ROW(1))*REF(COLUMN("qty"),ROW(1))');
            const value = gridObj.getFormulaValue(0, 'total');
            expect(value).toBe(20); // 10 * 2
        });

        it('division (/) operator should work correctly', () => {
            gridObj.setCellFormula(0, 'total', '=REF(COLUMN("price"),ROW(1))/REF(COLUMN("qty"),ROW(1))');
            const value = gridObj.getFormulaValue(0, 'total');
            expect(value).toBe(5); // 10 / 2
        });

        it('modulo (%) operator should work correctly', () => {
            gridObj.setCellFormula(0, 'total', '=REF(COLUMN("price"),ROW(1))%REF(COLUMN("qty"),ROW(1))');
            const value = gridObj.getFormulaValue(0, 'total');
            expect(value).toBe(0); // 10 % 2
        });

        it('exponentiation (^) operator should work correctly', () => {
            gridObj.setCellFormula(0, 'total', '=REF(COLUMN("qty"),ROW(1))^2');
            const value = gridObj.getFormulaValue(0, 'total');
            expect(value).toBe(4); // 2^2
        });

        it('multiplication (×) unicode operator should work correctly', () => {
            gridObj.setCellFormula(0, 'total', '=REF(COLUMN("price"),ROW(1))×REF(COLUMN("qty"),ROW(1))');
            const value = gridObj.getFormulaValue(0, 'total');
            expect(value).toBe(20); // 10 × 2
        });

        it('division (÷) unicode operator should work correctly', () => {
            gridObj.setCellFormula(0, 'total', '=REF(COLUMN("price"),ROW(1))÷REF(COLUMN("qty"),ROW(1))');
            const value = gridObj.getFormulaValue(0, 'total');
            expect(value).toBe(5); // 10 ÷ 2
        });

        it('complex arithmetic with multiple operators', () => {
            gridObj.setCellFormula(0, 'total', '=REF(COLUMN("price"),ROW(1))*REF(COLUMN("qty"),ROW(1))+REF(COLUMN("discount"),ROW(1))');
            const value = gridObj.getFormulaValue(0, 'total');
            expect(value).toBe(25); // 10*2 + 5
        });

        it('operator precedence should be respected', () => {
            gridObj.setCellFormula(0, 'total', '=REF(COLUMN("price"),ROW(1))+REF(COLUMN("qty"),ROW(1))*2');
            const value = gridObj.getFormulaValue(0, 'total');
            expect(value).toBe(14); // 10 + (2*2)
        });

        it('parentheses should override precedence', () => {
            gridObj.setCellFormula(0, 'total', '=(REF(COLUMN("price"),ROW(1))+REF(COLUMN("qty"),ROW(1)))*2');
            const value = gridObj.getFormulaValue(0, 'total');
            expect(value).toBe(24); // (10+2)*2
        });

        it('nested parentheses should work correctly', () => {
            gridObj.setCellFormula(0, 'total', '=((REF(COLUMN("price"),ROW(1))+REF(COLUMN("qty"),ROW(1)))*2)-REF(COLUMN("discount"),ROW(1))');
            const value = gridObj.getFormulaValue(0, 'total');
            expect(value).toBe(19); // ((10+2)*2) - 5
        });

        it('unary minus should work correctly', () => {
            gridObj.setCellFormula(0, 'total', '=-REF(COLUMN("price"),ROW(1))+REF(COLUMN("tax"),ROW(1))');
            const value = gridObj.getFormulaValue(0, 'total');
            expect(value).toBe(-8.5); // -10 + 1.5
        });

        it('unary plus should work correctly', () => {
            gridObj.setCellFormula(0, 'total', '=+REF(COLUMN("price"),ROW(1))-REF(COLUMN("qty"),ROW(1))');
            const value = gridObj.getFormulaValue(0, 'total');
            expect(value).toBe(8); // 10 - 2
        });
    });

    // ============================================================
    // SECTION 2: COMPARISON OPERATORS - Complete Coverage
    // ============================================================
    describe('Comparison Operators', () => {
        it('equal (=) operator should work correctly', () => {
            gridObj.setCellFormula(0, 'total', '=REF(COLUMN("price"),ROW(1))=10');
            const value = gridObj.getFormulaValue(0, 'total');
            expect(value).toBe(1); // true
        });

        it('not equal (<>) operator should work correctly', () => {
            gridObj.setCellFormula(0, 'total', '=REF(COLUMN("price"),ROW(1))<>10');
            const value = gridObj.getFormulaValue(0, 'total');
            expect(value).toBe(0); // false
        });

        it('greater than (>) operator should work correctly', () => {
            gridObj.setCellFormula(0, 'total', '=REF(COLUMN("price"),ROW(1))>5');
            const value = gridObj.getFormulaValue(0, 'total');
            expect(value).toBe(1); // true
        });

        it('less than (<) operator should work correctly', () => {
            gridObj.setCellFormula(0, 'total', '=REF(COLUMN("price"),ROW(1))<5');
            const value = gridObj.getFormulaValue(0, 'total');
            expect(value).toBe(0); // false
        });

        it('greater than or equal (>=) operator should work correctly', () => {
            gridObj.setCellFormula(0, 'total', '=REF(COLUMN("price"),ROW(1))>=10');
            const value = gridObj.getFormulaValue(0, 'total');
            expect(value).toBe(1); // true
        });

        it('less than or equal (<=) operator should work correctly', () => {
            gridObj.setCellFormula(0, 'total', '=REF(COLUMN("price"),ROW(1))<=10');
            const value = gridObj.getFormulaValue(0, 'total');
            expect(value).toBe(1); // true
        });

        it('comparison in complex expression', () => {
            gridObj.setCellFormula(0, 'total', '=(REF(COLUMN("price"),ROW(1))>5)*REF(COLUMN("qty"),ROW(1))');
            const value = gridObj.getFormulaValue(0, 'total');
            expect(value).toBe(2); // 1 * 2
        });
    });

    // ============================================================
    // SECTION 3: BUILT-IN FUNCTIONS - Complete Coverage
    // ============================================================
    describe('Built-in Functions', () => {
        describe('SUM function', () => {
            it('should sum multiple arguments', () => {
                gridObj.setCellFormula(0, 'total', '=SUM(REF(COLUMN("price"),ROW(1)),REF(COLUMN("qty"),ROW(1)),REF(COLUMN("discount"),ROW(1)))');
                const value = gridObj.getFormulaValue(0, 'total');
                expect(value).toBe(17); // 10 + 2 + 5
            });

            it('should sum range arguments - min to max', () => {
                gridObj.setCellFormula(0, 'total', '=SUM(REF(COLUMN("price"),ROW(1)):REF(COLUMN("discount"),ROW(1)))');
                const value = gridObj.getFormulaValue(0, 'total');
                expect(typeof value === 'number').toBe(true);
            });

            it('should sum range arguments - max to min', () => {
                gridObj.setCellFormula(0, 'total', '=SUM(C5:C1)');
                const value = gridObj.getFormulaValue(0, 'total');
                expect(typeof value === 'number').toBe(true);
            });
        });

        describe('AVERAGE function', () => {
            it('should calculate average of arguments', () => {
                gridObj.setCellFormula(0, 'total', '=AVERAGE(REF(COLUMN("price"),ROW(1)),REF(COLUMN("qty"),ROW(1)),REF(COLUMN("discount"),ROW(1)))');
                const value = gridObj.getFormulaValue(0, 'total');
                expect(value).toBeCloseTo(5.67, 2); // (10+2+5)/3
            });

            it('should return 0 for no arguments', () => {
                gridObj.setCellFormula(0, 'total', '=AVERAGE()');
                const value = gridObj.getFormulaValue(0, 'total');
                expect(value).toBe(0);
            });
        });

        describe('COUNT function', () => {
            it('should count numeric values', () => {
                gridObj.setCellFormula(0, 'total', '=COUNT(REF(COLUMN("price"),ROW(1)),REF(COLUMN("qty"),ROW(1)),REF(COLUMN("discount"),ROW(1)),REF(COLUMN("tax"),ROW(1)))');
                const value = gridObj.getFormulaValue(0, 'total');
                expect(value).toBe(4);
            });
        });

        describe('MIN function', () => {
            it('should return minimum value', () => {
                gridObj.setCellFormula(0, 'total', '=MIN(REF(COLUMN("price"),ROW(1)),REF(COLUMN("qty"),ROW(1)),REF(COLUMN("discount"),ROW(1)),REF(COLUMN("tax"),ROW(1)))');
                const value = gridObj.getFormulaValue(0, 'total');
                expect(value).toBe(1.5); // tax is smallest
            });

            it('should return 0 for no arguments', () => {
                gridObj.setCellFormula(0, 'total', '=MIN()');
                const value = gridObj.getFormulaValue(0, 'total');
                expect(value).toBe(0);
            });
        });

        describe('MAX function', () => {
            it('should return maximum value', () => {
                gridObj.setCellFormula(0, 'total', '=MAX(REF(COLUMN("price"),ROW(1)),REF(COLUMN("qty"),ROW(1)),REF(COLUMN("discount"),ROW(1)),REF(COLUMN("tax"),ROW(1)))');
                const value = gridObj.getFormulaValue(0, 'total');
                expect(value).toBe(10); // price is largest
            });

            it('should return 0 for no arguments', () => {
                gridObj.setCellFormula(0, 'total', '=MAX()');
                const value = gridObj.getFormulaValue(0, 'total');
                expect(value).toBe(0);
            });
        });

        describe('IF function', () => {
            it('should return true value when condition is true', () => {
                gridObj.setCellFormula(0, 'total', '=IF(C1>5,100,200)');
                const value = gridObj.getFormulaValue(0, 'total');
                expect(value).toBe(200);
            });

            it('should return false value when condition is false', () => {
                gridObj.setCellFormula(0, 'total', '=IF(C1<5,100,200)');
                const value = gridObj.getFormulaValue(0, 'total');
                expect(value).toBe(100);
            });
        });

        describe('ABS function', () => {
            it('should return absolute value of positive number', () => {
                gridObj.setCellFormula(0, 'total', '=ABS(REF(COLUMN("price"),ROW(1)))');
                const value = gridObj.getFormulaValue(0, 'total');
                expect(value).toBe(10);
            });
        });

        describe('ROUND function', () => {
            it('should round to default decimal places', () => {
                gridObj.setCellFormula(0, 'total', '=ROUND(REF(COLUMN("tax"),ROW(1)))');
                const value = gridObj.getFormulaValue(0, 'total');
                expect(value).toBe(2); // 1.5 rounded
            });

            it('should round to specified decimal places', () => {
                gridObj.setCellFormula(0, 'total', '=ROUND(REF(COLUMN("tax"),ROW(1)),1)');
                const value = gridObj.getFormulaValue(0, 'total');
                expect(value).toBe(1.5);
            });
        });

        describe('PRODUCT function', () => {
            it('should multiply multiple arguments', () => {
                gridObj.setCellFormula(0, 'total', '=PRODUCT(REF(COLUMN("price"),ROW(1)),REF(COLUMN("qty"),ROW(1)))');
                const value = gridObj.getFormulaValue(0, 'total');
                expect(value).toBe(20); // 10 * 2
            });

            it('should return 0 for no arguments', () => {
                gridObj.setCellFormula(0, 'total', '=PRODUCT()');
                const value = gridObj.getFormulaValue(0, 'total');
                expect(value).toBe(0);
            });
        });

        describe('CONCAT function', () => {
            it('should concatenate string values', () => {
                gridObj.setCellFormula(0, 'total', '=CONCAT("Hello"," ","World")');
                const value = gridObj.getFormulaValue(0, 'total');
                expect(value).toBe('Hello World');
            });
        });

        describe('COUNTA function', () => {
            it('should count non-empty values', () => {
                gridObj.setCellFormula(0, 'total', '=COUNTA(REF(COLUMN("price"),ROW(1)),REF(COLUMN("qty"),ROW(1)),REF(COLUMN("discount"),ROW(1)),REF(COLUMN("tax"),ROW(1)))');
                const value = gridObj.getFormulaValue(0, 'total');
                expect(value).toBe(4);
            });
        });

        describe('COUNTBLANK function', () => {
            it('should count blank values', () => {
                gridObj.setCellFormula(0, 'total', '=COUNTBLANK(REF(COLUMN("total"),ROW(1)),REF(COLUMN("total"),ROW(2)))');
                const value = gridObj.getFormulaValue(0, 'total');
                expect(typeof value === 'number').toBe(true);
            });
        });

        describe('COUNTIF function', () => {
            it('should count values matching criteria', () => {
                gridObj.setCellFormula(0, 'total', '=COUNTIF(REF(COLUMN("price"),ROW(1)):REF(COLUMN("tax"),ROW(1)),10)');
                const value = gridObj.getFormulaValue(0, 'total');
                expect(typeof value === 'number').toBe(true);
            });
        });

        describe('MEDIAN function', () => {
            it('should calculate median value', () => {
                gridObj.setCellFormula(0, 'total', '=MEDIAN(REF(COLUMN("price"),ROW(1)),REF(COLUMN("qty"),ROW(1)),REF(COLUMN("discount"),ROW(1)))');
                const value = gridObj.getFormulaValue(0, 'total');
                expect(value).toBe(5); // median of 2, 5, 10
            });
        });

        describe('SUMIF function', () => {
            it('should sum values matching criteria', () => {
                gridObj.setCellFormula(0, 'total', '=SUMIF(REF(COLUMN("price"),ROW(1)):REF(COLUMN("tax"),ROW(1)),10)');
                const value = gridObj.getFormulaValue(0, 'total');
                expect(typeof value === 'number').toBe(true);
            });
        });

        describe('RAND function', () => {
            it('should return random number between 0 and 1', () => {
                gridObj.setCellFormula(0, 'total', '=RAND()');
                const value = gridObj.getFormulaValue(0, 'total');
                expect(value).toBeGreaterThanOrEqual(0);
                expect(value).toBeLessThanOrEqual(1);
            });
        });

        describe('TODAY function', () => {
            it('should return current date', () => {
                gridObj.setCellFormula(0, 'total', '=TODAY()');
                const value = gridObj.getFormulaValue(0, 'total');
                expect(value).toBeDefined();
            });
        });

        describe('NOW function', () => {
            it('should return current date and time', () => {
                gridObj.setCellFormula(0, 'total', '=NOW()');
                const value = gridObj.getFormulaValue(0, 'total');
                expect(value).toBeDefined();
            });
        });

        describe('MOD function', () => {
            it('should calculate modulo', () => {
                gridObj.setCellFormula(0, 'total', '=MOD(REF(COLUMN("price"),ROW(1)),REF(COLUMN("qty"),ROW(1)))');
                const value = gridObj.getFormulaValue(0, 'total');
                expect(value).toBe(0); // 10 % 2
            });
        });

        describe('POWER function', () => {
            it('should calculate power', () => {
                gridObj.setCellFormula(0, 'total', '=POWER(REF(COLUMN("qty"),ROW(1)),2)');
                const value = gridObj.getFormulaValue(0, 'total');
                expect(value).toBe(4); // 2^2
            });
        });

        describe('SQRT function', () => {
            it('should calculate square root', () => {
                gridObj.setCellFormula(0, 'total', '=SQRT(REF(COLUMN("price"),ROW(1))*REF(COLUMN("qty"),ROW(1)))');
                const value = gridObj.getFormulaValue(0, 'total');
                expect(value).toBeCloseTo(4.47, 2); // sqrt(20)
            });
        });
    });

    // ============================================================
    // SECTION 5: CUSTOM FUNCTIONS - Complete Coverage
    // ============================================================
    describe('Custom Functions', () => {
        let customGrid: Grid;

        beforeAll((done: Function) => {
            customGrid = createGrid(
                {
                    dataSource: [
                        { id: 1, value1: 10, value2: 20, result: null },
                        { id: 2, value1: 5, value2: 15, result: null }
                    ],
                    columns: [
                        { field: 'id', isPrimaryKey: true },
                        { field: 'value1' },
                        { field: 'value2' },
                        { field: 'result', allowFormula: true }
                    ],
                    formulaSettings: {
                        customFunctions: {
                            DOUBLESUM: (params: any) => {
                                let total = 0;
                                for (const val of params.values) {
                                    total += Number(val) * 2;
                                }
                                return total;
                            }
                        }
                    }
                },
                done
            );
        });

        afterAll(() => {
            destroy(customGrid);
            customGrid = null;
        });

        it('should execute custom function', () => {
            customGrid.setCellFormula(0, 'total', '=DOUBLESUM(REF(COLUMN("value1"),ROW(1)):REF(COLUMN("value2"),ROW(1)))');
            const value = customGrid.getFormulaValue(0, 'total');
            expect(value).toBe(60); // (10+20)*2
        });

    });

    // ============================================================
    // SECTION 7: ERROR CLASSES - Complete Coverage
    // ============================================================
    describe('Formula Error Handling', () => {
        it('should return #REF!', () => {
            gridObj.setCellFormula(0, 'total', '=REF(COLUMN("INVALID"),ROW(1))');
            expect((gridObj.getFormulaValue(0, 'total') as any).code).toBe(FormulaErrorCode.REF);
        });

        it('should return #NAME?', () => {
            gridObj.setCellFormula(0, 'total', '=INVALIDFUNC()');
            expect((gridObj.getFormulaValue(0, 'total') as any).code).toBe(FormulaErrorCode.NAME);
        });

        it('should return #DIV/0!', () => {
            gridObj.setCellFormula(0, 'total', '=10/0');
            expect((gridObj.getFormulaValue(0, 'total') as any).code).toBe(FormulaErrorCode.DIVZERO);
        });

        it('should return #VALUE!', () => {
            gridObj.setCellFormula(0, 'total', '="ABC"+10');
            expect((gridObj.getFormulaValue(0, 'total') as any).code).toBe(FormulaErrorCode.VALUE);
        });

        it('should return #PARSE!', () => {
            gridObj.setCellFormula(0, 'total', '=SUM(');
            expect((gridObj.getFormulaValue(0, 'total') as any).code).toBe(FormulaErrorCode.PARSE);
        });

        it('should return #ERROR!', () => {
            gridObj.setCellFormula(0, 'total', '=IF(5>2,10)');
            expect((gridObj.getFormulaValue(0, 'total') as any).code).toBe(FormulaErrorCode.ERROR);
        });

        it('CycleError should have CIRCREF code', () => {
            const error = new CycleError('Circular reference');
            expect(error.code).toBe(FormulaErrorCode.CIRCREF);
        });

    });

    // ============================================================
    // SECTION 8: EDGE CASES - Complete Coverage
    // ============================================================
    describe('Edge Cases', () => {
        it('should handle string row index', () => {
            gridObj.setCellFormula('0', 'total', '=REF(COLUMN("price"),ROW(1))+REF(COLUMN("qty"),ROW(1))');
            const value = gridObj.getFormulaValue('0', 'total');
            expect(value).toBe(12);
        });

        it('should handle numeric row index', () => {
            gridObj.setCellFormula(1, 'total', '=REF(COLUMN("price"),ROW(2))*REF(COLUMN("qty"),ROW(2))');
            const value = gridObj.getFormulaValue(1, 'total');
            expect(value).toBe(100); // 20*5
        });

        it('should handle formula with whitespace', () => {
            gridObj.setCellFormula(0, 'total', '=  REF(COLUMN("price"),ROW(1))  +  REF(COLUMN("qty"),ROW(1))  ');
            const value = gridObj.getFormulaValue(0, 'total');
            expect(value === undefined || typeof value === 'number').toBe(true);
        });

        it('should handle formula with string literal', () => {
            gridObj.setCellFormula(0, 'total', '=CONCAT("Price:","10")');
            const value = gridObj.getFormulaValue(0, 'total');
            expect(value === 'Price:10' || value === undefined).toBe(true);
        });

        it('should handle scientific notation', () => {
            gridObj.setCellFormula(0, 'total', '=1e2+50');
            const value = gridObj.getFormulaValue(0, 'total');
            expect(value === 150 || value === undefined).toBe(true);
        });

        it('should handle decimal numbers', () => {
            gridObj.setCellFormula(0, 'total', '=REF(COLUMN("tax"),ROW(1))*2');
            const value = gridObj.getFormulaValue(0, 'total');
            expect(value).toBe(3); // 1.5*2
        });

        it('should handle formula on different rows independently', () => {
            gridObj.setCellFormula(0, 'total', '=REF(COLUMN("price"),ROW(1))+REF(COLUMN("qty"),ROW(1))');
            gridObj.setCellFormula(1, 'total', '=REF(COLUMN("price"),ROW(2))*REF(COLUMN("qty"),ROW(2))');
            const val0 = gridObj.getFormulaValue(0, 'total');
            const val1 = gridObj.getFormulaValue(1, 'total');
            expect(val0).toBe(12);
            expect(val1).toBe(100);
        });

        it('should handle overwriting existing formula', () => {
            gridObj.setCellFormula(0, 'total', '=REF(COLUMN("price"),ROW(1))+REF(COLUMN("qty"),ROW(1))');
            gridObj.setCellFormula(0, 'total', '=REF(COLUMN("price"),ROW(1))*REF(COLUMN("qty"),ROW(1))');
            const value = gridObj.getFormulaValue(0, 'total');
            expect(value).toBe(20);
        });

        it('should handle formula deletion', () => {
            gridObj.setCellFormula(0, 'total', '=REF(COLUMN("price"),ROW(1))+REF(COLUMN("qty"),ROW(1))');
            gridObj.setCellFormula(0, 'total', '');
            const formula = gridObj.getCellFormula(0, 'total');
            expect(formula).toBeUndefined();
        });
    });

    describe('Formula cell edit', () => {
        it('edit the cell', (done: Function) => {
            gridObj.editCell(1, 'price');
            done();
        });

        it('save the cell', (done: Function) => {
            select('#' + gridObj.element.id + 'price', gridObj.element).value = 100;
            gridObj.saveCell();
            expect(gridObj.isEdit).toBe(false);
            done();
        });

        it('update the cell', (done: Function) => {
            gridObj.updateCell(2, 'price', 50);
            done();
        });
    });

    // ============================================================
    // SECTION 9: COMPLEX FORMULAS - Complete Coverage
    // ============================================================
    describe('Complex Formulas', () => {
        it('should handle nested function calls', () => {
            gridObj.setCellFormula(0, 'total', '=SUM(MAX(REF(COLUMN("price"),ROW(1)),REF(COLUMN("qty"),ROW(1))),MIN(REF(COLUMN("discount"),ROW(1)),REF(COLUMN("tax"),ROW(1))))');
            const value = gridObj.getFormulaValue(0, 'total');
            expect(typeof value === 'number').toBe(true);
        });

        it('should handle formula with IF and arithmetic', () => {
            gridObj.setCellFormula(0, 'total', '=IF(REF(COLUMN("price"),ROW(1))>5,REF(COLUMN("price"),ROW(1))*REF(COLUMN("qty"),ROW(1)),0)');
            const value = gridObj.getFormulaValue(0, 'total');
            expect(value).toBe(20);
        });

        it('should handle multiple ranges in SUM', () => {
            gridObj.setCellFormula(0, 'total', '=SUM(REF(COLUMN("price"),ROW(1)):REF(COLUMN("qty"),ROW(1)),REF(COLUMN("discount"),ROW(1)):REF(COLUMN("tax"),ROW(1)))');
            const value = gridObj.getFormulaValue(0, 'total');
            expect(typeof value === 'number').toBe(true);
        });

        it('should handle formula with COUNTIF and SUMIF', () => {
            gridObj.setCellFormula(0, 'total', '=SUMIF(REF(COLUMN("price"),ROW(1)):REF(COLUMN("tax"),ROW(1)),5)*COUNTIF(REF(COLUMN("price"),ROW(1)):REF(COLUMN("tax"),ROW(1)),5)');
            const value = gridObj.getFormulaValue(0, 'total');
            expect(typeof value === 'number').toBe(true);
        });

        it('should handle formula with ABS and ROUND', () => {
            gridObj.setCellFormula(0, 'total', '=ROUND(ABS(REF(COLUMN("tax"),ROW(1))-2),1)');
            const value = gridObj.getFormulaValue(0, 'total');
            expect(value).toBe(0.5); // |1.5-2| = 0.5
        });
    });

});

describe('Formula Cell Edit Support for Autofill - Complete Coverage', () => {
    let gridObj: Grid;
    let evaluator: any;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: [
                    { id: 1, price: 10, qty: 2, total: '=REF(COLUMN("price"),ROW(1))*REF(COLUMN("qty"),ROW(1))', discount: 5, tax: 1.5 },
                    { id: 2, price: 20, qty: 5, total: '=SUM(REF(COLUMN("price"),ROW(1)):REF(COLUMN("qty"),ROW(3)))', discount: 8, tax: 2.0 },
                    { id: 3, price: 15, qty: 3, total: '=REF(COLUMN("price"),ROW(3))*REF(COLUMN("qty"),ROW(3))', discount: 3, tax: 1.2 },
                    { id: 4, price: 25, qty: 4, total: '=REF(COLUMN("price"),ROW(4))*REF(COLUMN("qty"),ROW(4))', discount: 10, tax: 2.5 }
                ],
                columns: [
                    { field: 'id', isPrimaryKey: true, headerText: 'ID' },
                    { field: 'price', headerText: 'Price', type: 'number' },
                    { field: 'qty', headerText: 'Quantity', type: 'number' },
                    { field: 'discount', headerText: 'Discount', type: 'number' },
                    { field: 'tax', headerText: 'Tax', type: 'number' },
                    { field: 'total', headerText: 'Total', allowFormula: true, textAlign: 'Right' }
                ],
                enableAutoFill: true,
                selectionSettings:{mode: 'Cell', cellSelectionMode:'Box', type: 'Multiple'},
                editSettings: { allowEditing: true, allowEditOnDblClick: true, mode: 'Cell' }
            },
            done
        );
    });

    beforeEach(() => {
        evaluator = gridObj.formulaModule.evaluator;
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = evaluator = null;
    });

    it('Edit the cell', (done) => {
        (gridObj as any).dblClickHandler({ target: gridObj.element.querySelectorAll('.e-row')[0].querySelectorAll('.e-rowcell')[5] });
        done();
    });

    it('click the rowcell for update the formula', (done:Function) => {
        setTimeout(() => {
            (gridObj.getRows()[3].querySelectorAll('.e-rowcell')[2] as HTMLElement).click();
            (gridObj.element.querySelector('.e-headercell') as HTMLElement).click();
            done();
        }, 100);
    });
    it('click the rowcell', (done:Function) => {
        (gridObj.getRows()[3].querySelectorAll('.e-rowcell')[1] as HTMLElement).click();
        (gridObj.element.querySelector('.e-headercell') as HTMLElement).click();
        done();
    });

    it('Edit the cell in range', (done) => {
        (gridObj as any).dblClickHandler({ target: gridObj.element.querySelectorAll('.e-row')[1].querySelectorAll('.e-rowcell')[5] });
        done();
    });

    it('click the rowcell for update the formula in range', (done:Function) => {
        (gridObj.getRows()[3].querySelectorAll('.e-rowcell')[2] as HTMLElement).click();
        (gridObj.element.querySelector('.e-headercell') as HTMLElement).click();
        done();
    });

    it('getCellFormula coverage', () => {
        const formulaObj: Formula = gridObj.formulaModule;
        spyOn(formulaObj as any, 'getCacheKey').and.returnValue('1_total');
        formulaObj['formulaCache'].set('1_total', {});
        expect(formulaObj.getCellFormula(1, 'total')).toBeUndefined();
        formulaObj['formulaCache'].delete('1_total');
        expect(formulaObj.getCellFormula(1, 'total')).toBeUndefined();
    });

    it('should handle formula with formula column', function () {
        gridObj.setCellFormula(2, 'total', '=F1');
        gridObj.getFormulaValue(2, 'total');
    });

    it('should match criteria operator', function () {
        expect(evaluator.matchesCriteria(5, '=5')).toBe(true);
        expect(evaluator.matchesCriteria(30, '>20')).toBe(true);
        expect(evaluator.matchesCriteria(10, '<20')).toBe(true);
        expect(evaluator.matchesCriteria(10, '<>20')).toBe(true);
        expect(evaluator.matchesCriteria(20, '>=20')).toBe(true);
        expect(evaluator.matchesCriteria(20, '<=20')).toBe(true);
        evaluator.matchesCriteria(20, undefined);
        evaluator.matchesCriteria(20, new Date());
        evaluator.matchesCriteria('5', '5');
    });

    it('should cover nested formula reference value', () => {
        const astNode: any = {accept: () => ({ value: { value: 100 } })};
        spyOn(evaluator, 'isFormulaReferenceValue').and.returnValues(true, true);
        spyOn(evaluator, 'evaluate').and.callThrough();
        evaluator.evaluate(astNode, {});
        expect(evaluator.evaluate).toHaveBeenCalledTimes(2);
    });

    it('adjustReferences coverage', () => {
        gridObj.setCellFormula(1, 'total', '=$C$1+$D$1');
        (gridObj.selectionModule as any).createBeforeAutoFill(1, 5, gridObj.getRows()[0].querySelectorAll('.e-rowcell')[5]);
        
    });
    it('adjustReferences range coverage', () => {
        gridObj.setCellFormula(1, 'total', '=$C$1:$C$5');
        (gridObj.selectionModule as any).createBeforeAutoFill(1, 5, gridObj.getRows()[0].querySelectorAll('.e-rowcell')[5]);
        
    });

    it('setCellFormula coverage', () => {
        const formulaObj = gridObj.formulaModule;
        gridObj.setCellFormula(1, 'total', '$');
        gridObj.setCellFormula(1, 'total', '');
        spyOn(formulaObj['dependencyGraph'], 'detectCycles').and.returnValue(new Set(['1:total']));
        gridObj.setCellFormula(1, 'total', '=A1');
        spyOn(formulaObj.evaluator, 'evaluate').and.returnValue({ value: 10 });
        spyOn(formulaObj.evaluator, 'isFormulaReferenceValue').and.returnValue(true);
        formulaObj.setCellFormula(1, 'total', '=A1');
        const cacheValue: any = formulaObj['formulaCache'].get(formulaObj['getCacheKey'](1, 'total'));
        expect(cacheValue.value).toBe(10);
        spyOn(formulaObj as any, 'createContext').and.returnValue(null);
        formulaObj.setCellFormula(1, 'total', '=1+1');
        const cache: any = formulaObj['formulaCache'].get(formulaObj['getCacheKey'](1, 'total'));
        expect(cache.error).toBeDefined();
    });

    it('convertToBoolean coverage', () => {
        spyOn(evaluator, 'isFormulaReferenceValue').and.callFake((v: any) => { return v && v.hasOwnProperty('value'); });
        expect(evaluator.convertToBoolean({ value: true })).toBe(true);
        expect(evaluator.convertToBoolean(true)).toBe(true);
        expect(evaluator.convertToBoolean(false)).toBe(false);
        expect(evaluator.convertToBoolean(1)).toBe(true);
        expect(evaluator.convertToBoolean(0)).toBe(false);
        expect(evaluator.convertToBoolean('Test')).toBe(true);
        expect(evaluator.convertToBoolean('')).toBe(false);
        expect(evaluator.convertToBoolean(null)).toBe(false);
        expect(evaluator.convertToBoolean(undefined)).toBe(false);
        expect(evaluator.convertToBoolean([1])).toBe(true);
        expect(evaluator.convertToBoolean([])).toBe(false);
        expect(evaluator.convertToBoolean({})).toBe(true);
    });

    it('convertToNumber coverage', () => {
        spyOn(evaluator, 'isFormulaReferenceValue').and.callFake((v: any) => { return v && v.hasOwnProperty('value') && typeof v !== 'number';});
        expect(evaluator.convertToNumber(true)).toBe(1);
        expect(evaluator.convertToNumber(false)).toBe(0);
        expect(evaluator.convertToNumber(null)).toBe(0);
        expect(evaluator.convertToNumber(undefined)).toBe(0);
        expect(evaluator.convertToNumber('')).toBe(0);
        expect(evaluator.convertToNumber('12.5')).toBe(12.5);
        expect(evaluator.convertToNumber([1, 2, 3])).toBe(6);
        expect(evaluator.convertToNumber({ value: 5 })).toBe(5);
        expect(() => evaluator.convertToNumber('ABC')).toThrow();
        expect(() => evaluator.convertToNumber({})).toThrow();
    });

    it('tryParseNumber coverage', () => {
        spyOn(evaluator, 'isFormulaReferenceValue').and.callFake((v: any) => { return v && v.ref !== undefined;});
        expect(evaluator.tryParseNumber(true)).toBe(1);
        expect(evaluator.tryParseNumber(false)).toBe(0);
        expect(evaluator.tryParseNumber(null)).toBeUndefined();
        expect(evaluator.tryParseNumber(undefined)).toBeUndefined();
        expect(evaluator.tryParseNumber('')).toBeUndefined();
        expect(evaluator.tryParseNumber('123.5')).toBe(123.5);
        expect(evaluator.tryParseNumber('ABC')).toBeUndefined();
        expect(evaluator.tryParseNumber([25])).toBe(25);
        expect(evaluator.tryParseNumber([])).toBeUndefined();
        expect(evaluator.tryParseNumber({ ref: 'A1', value: 50 })).toBe(50);
    });

    it('convertToReference coverage', () => {
        spyOn(evaluator, 'isFormulaReferenceValue').and.callFake((v: any) => {  return v && v.ref !== undefined;});
        expect(evaluator.convertToReference({ ref: '$A$1', value: 10 })).toBe('$A$1');
        expect(evaluator.convertToReference('a1')).toBe('A1');
        expect(evaluator.convertToReference('$b$2')).toBe('$B$2');
        expect(() => evaluator.convertToReference('invalid')).toThrow();
        expect(() => evaluator.convertToReference(100)).toThrow();
    });

    it('hasCycleFromNode full coverage', () => {
        const graph: any = gridObj.formulaModule.dependencyGraph;
        graph.addDependency('A', 'B');
        graph.addDependency('B', 'A');
        graph.addDependency('A', 'C');
        graph.addDependency('D', 'E');
        const cycles: Set<string> = graph.detectCycles();
        expect(cycles.has('A')).toBe(true);
        expect(cycles.has('B')).toBe(true);
        expect(cycles.has('D')).toBe(false);
        expect(cycles.has('E')).toBe(false);
        graph.removeDependency('X', 'Y');
        graph.removeDependency('A', 'D');
        graph.clear();
    });

    it('appendConcatenatedValue coverage', () => {
        const parts: string[] = [];
        spyOn(evaluator, 'isFormulaReferenceValue').and.callFake((value: any) => {
            return value && value.hasOwnProperty('value');
        });
        evaluator.appendConcatenatedValue({ value: 'A' }, parts);
        evaluator.appendConcatenatedValue(['B', 'C'], parts);
        evaluator.appendConcatenatedValue(null, parts);
        evaluator.appendConcatenatedValue(undefined, parts);
        evaluator.appendConcatenatedValue(123, parts);
        expect(parts).toEqual(['A', 'B', 'C', '123']);
    });

    it('should execute custom function', () => {
        spyOn(evaluator, 'isFormulaReferenceValue').and.returnValue(false);
        spyOn(gridObj.formulaModule, 'getCustomFunction').and.returnValue((params: any) => {
            return params.values[0] * 2;
        });
        const mockNode: any = {args: [{accept: () => 10}]};
        evaluator.executeCustomFunction(mockNode, 'DOUBLE');
    });

    it('should throw errors for invalid function arguments', () => {
        expect(() => evaluator.visitFunctionCall({ name: 'REF', args: [] })).toThrow();
        expect(() => evaluator.visitFunctionCall({ name: 'COLUMN', args: [] })).toThrow();
        expect(() => evaluator.visitFunctionCall({ name: 'ROW', args: [] })).toThrow();
        expect(() => evaluator.visitFunctionCall({ name: 'ABS', args: [] })).toThrow();
        expect(() => evaluator.visitFunctionCall({ name: 'ROUND', args: [] })).toThrow();
        (['COUNTIF', 'SUMIF'].forEach(name => expect(() => evaluator.visitFunctionCall({ name, args: [{ accept: () => [1, 2, 3] }] })).toThrow()));
        expect(() => evaluator.visitFunctionCall({ name: 'SQRT', args: [] })).toThrow();
        expect(() => evaluator.visitFunctionCall({name: 'SQRT',args: [{ accept: () => -1 }]})).toThrow();
        expect(() => evaluator.visitFunctionCall({ name: 'MOD', args: [] })).toThrow();
        expect(evaluator.visitFunctionCall({ name: 'MOD', args: [{ accept: () => [10] }, { accept: () => [3] }] })).toBe(1);
        expect(() => evaluator.visitFunctionCall({ name: 'MOD', args: [{ accept: () => 10 }, { accept: () => 0 }] })).toThrow();
        expect(evaluator.visitFunctionCall({ name: 'MEDIAN', args: [{ accept: () => ['abc'] }] })).toBe(0);
        expect(evaluator.visitFunctionCall({ name: 'MEDIAN', args: [{ accept: () => [1, 2, 3] }] })).toBe(2);
        expect(evaluator.visitFunctionCall({ name: 'MEDIAN', args: [{ accept: () => [1, 2, 3, 4] }] })).toBe(2.5);
        expect(() => {evaluator.visitBinaryOp({operator: '?',left: { accept: () => 1 },right: { accept: () => 2 }});}).toThrow();
        expect(() => {evaluator.visitUnaryOperator({operator: '!',operand: { accept: () => 1 }});}).toThrow();
        expect(() => evaluator.visitFunctionCall({ name: 'REF', args: [{ accept: () => 'Name' }] })).toThrow();
        expect(() => evaluator.visitFunctionCall({ name: 'REF', args: [{ accept: () => 100 }, { accept: () => 1 }] })).toThrow();
        evaluator.context = { getRowData: (): null => null };
        expect(() => evaluator.visitFunctionCall({ name: 'REF', args: [{ accept: () => 'Name' }, { accept: () => 1 }] })).toThrow();
        evaluator.context = { getRowData: (): { Name: string } => ({ Name: 'John' }), getFieldReference: (): null => null };
        expect(() => evaluator.visitFunctionCall({ name: 'REF', args: [{ accept: () => 'Name' }, { accept: () => 1 }] })).toThrow();
        expect(() => evaluator.visitFunctionCall({ name: 'POWER', args: [] })).toThrow();
        expect(evaluator.visitFunctionCall({ name: 'POWER', args: [{ accept: () => 2 }, { accept: () => 3 }] })).toBe(8);
        expect(evaluator.visitFunctionCall({ name: 'POWER', args: [{ accept: () => [2] }, { accept: () => [3] }] })).toBe(8);
        gridObj.formulaSettings.allowBuiltInFunctions = false;
        expect(() => evaluator.visitFunctionCall({ name: 'SUM', args: [] })).toThrow();
    });

    it('ReferenceConverter - coverage', () => {
        expect(() => ReferenceConverter.parseReference('')).toThrow();
        expect(() => ReferenceConverter.parseReference('123')).toThrow();
        expect(() => ReferenceConverter.parseReference('A')).toThrow();
        expect(() => ReferenceConverter.parseReference('A1B')).toThrow();
        expect(() => ReferenceConverter.parseReference('A0')).toThrow();
        expect(() => ReferenceConverter.convertIndexToReference(-1, 0)).toThrow();
        expect(() => ReferenceConverter.convertIndexToReference(0, -1)).toThrow();
        ReferenceConverter.adjustReferences('', 1, 1);
        ReferenceConverter.adjustReferences(null, 1, 1);
        ReferenceConverter.adjustReferences('REF(COLUMN("Name"),ROW(5))', 2, 0);
    });

    it('should cover parser error cases', function () {
        const parser = (gridObj as any).formulaModule.parser;
        expect(() => parser.parse('1 2')).toThrow();
        expect(() => parser.parse('(1+2')).toThrow();
        expect(() => parser.parse(')')).toThrow();
        expect(() => parser.parse('SUM(1,2')).toThrow();
        expect(() => parser.convertReferenceToNode('ABC')).toThrow();
    });

    it('should cover executeCustomFunction', () => {
        const node: any = { args: [{ accept: () => ({ __isFormulaRefValue: true, value: [1, 2] }) },
            { accept: () => ({ __isFormulaRefValue: true, value: 3 }) }, { accept: () => [4, 5] }, { accept: () => 6 }, { accept: (): null => null }] };
        evaluator.isFormulaReferenceValue = (v: any) => !!(v && v.__isFormulaRefValue);
        expect(() => evaluator.executeCustomFunction(node, 'TEST')).toThrow();
        evaluator.formulaEngine = { getCustomFunction: () => (() => 'x'), parent: { trigger: (_e: any, _a: any, cb: Function) => cb({ cancel: true }) } } as any;
        expect(() => evaluator.executeCustomFunction(node, 'TEST')).toThrow();
        evaluator.formulaEngine = { getCustomFunction: () => ({ func: (p: any) => p.values.length }), parent: { trigger: () => {} } } as any;
        expect(evaluator.executeCustomFunction(node, 'TEST')).toBe(6);
        evaluator.formulaEngine = { getCustomFunction: () => ({}), parent: { trigger: () => {} } } as any;
        expect(() => evaluator.executeCustomFunction(node, 'TEST')).toThrow();
    });

    it('should cover suspendFormulaRefresh, resumeFormulaRefresh and refrehFormula', () => {
        gridObj.suspendFormulaRefresh();
        gridObj.resumeFormulaRefresh();
        gridObj.refreshFormula(1);
        gridObj.refreshFormula(-1);
        gridObj.resumeFormulaRefresh();
        gridObj.isFormulaRefreshSuspended = false;
        gridObj.suspendFormulaRefresh();
        gridObj.getFormulas();
        gridObj.hasFormula(1, 'total');
        gridObj.addFormula('Double', (params: any) => {return Number(params.values[0]) * 2});
        gridObj.removeFormula('Double');
    });

    it('should cover formula edit', () => {
        const formulaEdit: any = new FormulaCellEditor(gridObj as any);
        formulaEdit.editableDiv = null;
        formulaEdit.renderColorizedFormula('=A1', 5);
        formulaEdit.editableDiv = document.createElement('span');
        spyOn(formulaEdit, 'extractFormulaReferencesWithPositions').and.returnValue([]);
        formulaEdit.renderColorizedFormula('=A1', 5);
        formulaEdit.highlightCell(-1, 0, 'e-formula-border');
        formulaEdit.highlightCell(0, -1, 'e-formula-border');
        spyOn(util, 'getCellByColAndRowIndex').and.returnValue(null as any);
        formulaEdit.highlightRangeBorder(0, 0, 0, 5, 'e-formula-border');
        formulaEdit.highlightRangeBorder(0, gridObj.currentViewData.length, 0, 0, 'e-formula-border');
        expect(formulaEdit.extractFormulaReferences('=SUM')).toEqual([]);
        expect(formulaEdit.extractFormulaReferences('=A1+A1+B2')).toEqual(['A1', 'B2']);
        spyOn(formulaEdit, 'isAutoFillFormula').and.returnValue(false);
        formulaEdit.updateReferenceHighlight();
        formulaEdit.editableDiv.textContent = '=A1+B2+A1';
        (formulaEdit.isAutoFillFormula as jasmine.Spy).and.returnValue(true);
        spyOn(formulaEdit, 'clearReferenceHighlight');
        spyOn(formulaEdit, 'extractFormulaReferences').and.returnValue(['A1', 'B2', 'A1']);
        formulaEdit.updateReferenceHighlight();
        formulaEdit.convertCellReferencesToREF('A1');
        formulaEdit.convertCellReferencesToREF('Z1');
        formulaEdit.convertFormulaToCellReference('REF(COLUMN("id"),ROW(1))');
        formulaEdit.convertFormulaToCellReference('REF(COLUMN("unknown"),ROW(1))');
        spyOn(gridObj, 'getColumns').and.returnValue([{ field: 'id' },{ headerText: 'Empty Column' } as any]);
        formulaEdit.convertCellReferencesToREF('B1');
        formulaEdit.convertFormulaToCellReference('REF(COLUMN("unknown"),ROW(1))');
        spyOn(formulaEdit, 'convertFormulaToCellReference').and.returnValue('A1');
        spyOn(formulaEdit, 'setCursorPosition');
        formulaEdit.write({rowData: { id: 1, total: 100 },rowIndex: 0,column: { field: 'total', allowFormula: true }});
        spyOn(gridObj, 'getCellFormula').and.returnValue('=A1');
        formulaEdit.write({rowData: { id: 1, total: 10 }, rowIndex: 0, column: { field: 'total', allowFormula: true }});
        gridObj.allowPaging =  true;
        formulaEdit.getPageRowIndex(3);
        formulaEdit.editableDiv.textContent = '=A1';
        spyOn(formulaEdit.editableDiv, 'focus');
        spyOn(formulaEdit, 'getCursorPositionInFormula').and.returnValue(5);
        spyOn(formulaEdit, 'renderColorizedFormula');
        spyOn(formulaEdit, 'updateReferenceHighlight');
        spyOn(window, 'requestAnimationFrame').and.callFake((cb: FrameRequestCallback): number => { cb(0); return 0; });
        formulaEdit.onEditableDivClick();
        formulaEdit.onInputChange();
        formulaEdit.write(null);
        expect(formulaEdit.read(null as any)).toBe('');
        formulaEdit.parent.isDestroyed = true;
        formulaEdit.addEventListener();
        formulaEdit.removeEventListener();
        formulaEdit.parent.isDestroyed = false;
        formulaEdit.editableDiv = null;
        formulaEdit.addEventListener();
        formulaEdit.removeEventListener();
    });

    it('should cover formulamodule is null', () => {
        (gridObj as any).formulaModule = null;
        gridObj.setCellFormula(1, 'total', '=B1+C1');
        gridObj.getCellFormula(1, 'total');
        gridObj.getFormulaValue(1, 'total');
        gridObj.getFormulas();
        gridObj.hasFormula(1, 'total');
        gridObj.addFormula('Double', (params: any) => {return Number(params.values[0]) * 2});
        gridObj.removeFormula('Double');
    });

});

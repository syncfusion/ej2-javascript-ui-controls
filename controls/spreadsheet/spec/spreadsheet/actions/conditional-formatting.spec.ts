import { SpreadsheetHelper } from "../util/spreadsheethelper.spec";
import { defaultData } from '../util/datasource.spec';


describe('Conditional formatting ->', () => {
    let helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');

    describe('API Checking ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{
                conditionalFormats: [
                  { type: "ContainsText", cFColor: "RedFT", value:'shoes', range: 'A2:A11' },
                  { type: "DateOccur", cFColor: "YellowFT", value:'7/22/2014', range: 'B2:B11' },
                  { type: "GreaterThan", cFColor: "GreenFT", value:'11:26:32 AM', range: 'C2:C11' },
                  { type: "LessThan", cFColor: "RedF", value:'20', range: 'D2:D11' },
                ],
                ranges: [{
                    dataSource: defaultData
                }],
            }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('', (done: Function) => {
            let td: HTMLElement = helper.invoke('getCell', [1, 0]);
            expect(td.style.backgroundColor).toBe('rgb(255, 199, 206)');
            expect(td.style.color).toBe('rgb(156, 0, 85)');
            td = helper.invoke('getCell', [4, 0]);
            expect(td.style.backgroundColor).toBe('');
            expect(td.style.color).toBe('');
            done();
        });
    });

    describe('Public Method ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{
                ranges: [{
                    dataSource: defaultData
                }],
            }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('', (done: Function) => {
            helper.invoke('conditionalFormat', [{ type: "RYGColorScale", range: 'E2:E11' }]);
            expect(helper.invoke('getCell', [1, 4]).style.backgroundColor).toBe('rgb(250, 157, 117)');
            expect(helper.invoke('getCell', [2, 4]).style.backgroundColor).toBe('rgb(248, 105, 107)');
            expect(helper.invoke('getCell', [4, 4]).style.backgroundColor).toBe('rgb(250, 157, 117)');
            expect(helper.invoke('getCell', [5, 4]).style.backgroundColor).toBe('rgb(223, 226, 130)');
            helper.edit('E2', '10');
            expect(helper.invoke('getCell', [1, 4]).style.backgroundColor).toBe('rgb(255, 235, 132)');
            helper.invoke('clearConditionalFormat', ['E2:E11']);
            expect(helper.invoke('getCell', [1, 4]).style.backgroundColor).toBe('rgb(255, 255, 255)');

            helper.invoke('conditionalFormat', [{ type: "GreaterThan", cFColor: 'RedFT', value: '300', range: 'F2:F11' }]);
            expect(helper.invoke('getCell', [1, 5]).style.backgroundColor).toBe('');
            expect(helper.invoke('getCell', [2, 5]).style.backgroundColor).toBe('rgb(255, 199, 206)');
            expect(helper.invoke('getCell', [2, 5]).style.color).toBe('rgb(156, 0, 85)');

            helper.invoke('conditionalFormat', [{ type: 'Top10Items', value: '1', format: { style: { color: '#ffffff', backgroundColor: '#009999', fontStyle: 'italic', textDecoration: 'line-through', fontWeight: 'bold'}}, range: 'G2:G11' }]);
            expect(helper.invoke('getCell', [6, 6]).style.backgroundColor).toBe('rgb(0, 153, 153)');
            expect(helper.invoke('getCell', [6, 6]).style.color).toBe('rgb(255, 255, 255)');
            expect(helper.invoke('getCell', [6, 6]).style.fontWeight).toBe('bold');

            helper.invoke('conditionalFormat', [{ type: 'BlueDataBar', range: 'H2:H11' }]);
            expect(helper.invoke('getCell', [1, 7]).getElementsByClassName('e-databar')[1].style.width).toBe('7%');
            expect(helper.invoke('getCell', [1, 7]).getElementsByClassName('e-databar')[1].style.height).toBe('17px');
            expect(helper.invoke('getCell', [9, 7]).getElementsByClassName('e-databar')[1].style.width).toBe('100%');

            helper.invoke('conditionalFormat', [{ type: 'Bottom10Percentage', range: 'H2:H11', value: "30" }]);
            expect(helper.invoke('getCell', [1, 7]).style.backgroundColor).toBe('rgb(255, 199, 206)');
            expect(helper.invoke('getCell', [1, 7]).style.color).toBe('rgb(156, 0, 85)');
            expect(helper.invoke('getCell', [2, 7]).style.backgroundColor).toBe('');

            helper.invoke('conditionalFormat', [{ type: 'ThreeArrows', range: 'D2:D11' }]);
            expect(helper.invoke('getCell', [1, 3]).children[0].classList).toContain('e-3arrows-3');
            expect(helper.invoke('getCell', [5, 3]).children[0].classList).toContain('e-3arrows-2');
            expect(helper.invoke('getCell', [6, 3]).children[0].classList).toContain('e-3arrows-1');

            helper.invoke('conditionalFormat', [{ type: 'Top10Percentage', cFColor: 'GreenFT', range: 'B2:B11', value: "15" }]);
            expect(helper.invoke('getCell', [4, 1]).style.backgroundColor).toBe('rgb(198, 239, 206)');
            expect(helper.invoke('getCell', [4, 1]).style.color).toBe('rgb(0, 97, 0)');
            expect(helper.invoke('getCell', [8, 1]).style.backgroundColor).toBe('rgb(198, 239, 206)');

            helper.invoke('clearConditionalFormat', ['B2:B11']);
            helper.invoke('conditionalFormat', [{ type: 'BelowAverage', range: 'B2:B11' }]);
            expect(helper.invoke('getCell', [1, 1]).style.backgroundColor).toBe('rgb(255, 199, 206)');
            expect(helper.invoke('getCell', [1, 1]).style.color).toBe('rgb(156, 0, 85)');
            expect(helper.invoke('getCell', [3, 1]).style.backgroundColor).toBe('rgb(255, 255, 255)');

            helper.invoke('conditionalFormat', [{ type: 'Duplicate', range: 'D2:D11' }]);
            expect(helper.invoke('getCell', [2, 3]).style.backgroundColor).toBe('rgb(255, 199, 206)');
            expect(helper.invoke('getCell', [2, 3]).style.color).toBe('rgb(156, 0, 85)');
            expect(helper.invoke('getCell', [3, 3]).style.backgroundColor).toBe('rgb(255, 199, 206)');

            helper.invoke('clearConditionalFormat', ['E2:E11']);
            helper.invoke('conditionalFormat', [{ type: 'Unique', range: 'E2:E11' }]);
            expect(helper.invoke('getCell', [3, 4]).style.backgroundColor).toBe('rgb(255, 199, 206)');
            expect(helper.invoke('getCell', [3, 4]).style.color).toBe('rgb(156, 0, 85)');
            expect(helper.invoke('getCell', [4, 4]).style.color).toBe('rgb(0, 0, 0)');

            helper.invoke('clearConditionalFormat', ['E2:E11']);
            helper.invoke('conditionalFormat', [{ type: 'Bottom10Percentage', range: 'E2:E11', value: "30" }]);
            expect(helper.invoke('getCell', [1, 4]).style.backgroundColor).toBe('rgb(255, 199, 206)');
            expect(helper.invoke('getCell', [1, 4]).style.color).toBe('rgb(156, 0, 85)');
            expect(helper.invoke('getCell', [2, 4]).style.backgroundColor).toBe('rgb(255, 255, 255)');

            helper.invoke('clearConditionalFormat', ['E2:E11']);
            helper.invoke('conditionalFormat', [{ type: "Between", cFColor: 'RedT', value: '16,30', range: 'E2:E11' }]);
            expect(helper.invoke('getCell', [2, 4]).style.backgroundColor).toBe('rgb(255, 255, 255)');
            expect(helper.invoke('getCell', [2, 4]).style.color).toBe('rgb(156, 0, 85)');
            expect(helper.invoke('getCell', [3, 4]).style.color).toBe('rgb(0, 0, 0)');

            helper.invoke('clearConditionalFormat', ['E2:E11']);
            helper.invoke('conditionalFormat', [{ type: "EqualTo", cFColor: 'YellowFT', value: '15', range: 'E2:E11' }]);
            expect(helper.invoke('getCell', [3, 4]).style.backgroundColor).toBe('rgb(255, 235, 156)');
            expect(helper.invoke('getCell', [3, 4]).style.color).toBe('rgb(156, 101, 0)');

            helper.invoke('clear', [{ type: 'Clear All', range: 'F2:G11' }]);
            expect(helper.invoke('getCell', [2, 5]).style.backgroundColor).toBe('');
            expect(helper.invoke('getCell', [6, 6]).style.backgroundColor).toBe('');
            done();
        });
    });

    describe('UI Interaction ->', () => {
        
    });
});
import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';
import { defaultData, InventoryList } from '../util/datasource.spec';
import { Spreadsheet, UsedRangeModel, clearViewer, DialogBeforeOpenEventArgs, CellModel, ConditionalFormatEventArgs, NoteModel } from '../../../src/index';
import { EmitType, getComponent } from '@syncfusion/ej2-base';


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
            expect(helper.invoke('getCell', [1, 4]).style.backgroundColor).toBe('');

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

            helper.invoke('conditionalFormat', [{ type: 'GreenDataBar', range: 'J2:J7' }]);
            helper.edit('J2', '10');
            helper.edit('J3', '20');
            expect(helper.invoke('getCell', [1, 9]).getElementsByClassName('e-databar')[1].style.width).toBe('50%');
            expect(helper.invoke('getCell', [1, 9]).getElementsByClassName('e-databar')[1].style.height).toBe('17px');
            expect(helper.invoke('getCell', [2, 9]).getElementsByClassName('e-databar')[1].style.width).toBe('100%');
            expect(helper.invoke('getCell', [2, 9]).getElementsByClassName('e-databar')[1].style.height).toBe('17px');

            helper.invoke('conditionalFormat', [{ type: 'Bottom10Percentage', range: 'H1:H200', value: "30" }]);
            expect(helper.invoke('getCell', [1, 7]).style.backgroundColor).toBe('rgb(255, 199, 206)');
            expect(helper.invoke('getCell', [1, 7]).style.color).toBe('rgb(156, 0, 85)');
            expect(helper.invoke('getCell', [2, 7]).style.backgroundColor).toBe('');
            expect(helper.invoke('getCell', [3, 7]).style.backgroundColor).toBe('rgb(255, 199, 206)');
            expect(helper.invoke('getCell', [3, 7]).style.color).toBe('rgb(156, 0, 85)');
            expect(helper.invoke('getCell', [4, 7]).style.backgroundColor).toBe('');
            expect(helper.invoke('getCell', [5, 7]).style.backgroundColor).toBe('');
            expect(helper.invoke('getCell', [6, 7]).style.backgroundColor).toBe('');

            helper.invoke('clearConditionalFormat', ['H1:H200']);
            helper.invoke('conditionalFormat', [{ type: 'Bottom10Percentage', range: 'H2:H6', value: "10" }]);
            expect(helper.invoke('getCell', [1, 7]).style.backgroundColor).toBe('rgb(255, 199, 206)');
            expect(helper.invoke('getCell', [1, 7]).style.color).toBe('rgb(156, 0, 85)');
            expect(helper.invoke('getCell', [2, 7]).style.backgroundColor).toBe('');
            expect(helper.invoke('getCell', [3, 7]).style.backgroundColor).toBe('');
            expect(helper.invoke('getCell', [3, 7]).style.color).toBe('');
            expect(helper.invoke('getCell', [4, 7]).style.backgroundColor).toBe('');
            expect(helper.invoke('getCell', [5, 7]).style.backgroundColor).toBe('');
            expect(helper.invoke('getCell', [6, 7]).style.backgroundColor).toBe('');

            helper.invoke('conditionalFormat', [{ type: 'ThreeArrows', range: 'D2:D11' }]);
            expect(helper.invoke('getCell', [1, 3]).children[0].classList).toContain('e-3arrows-3');
            expect(helper.invoke('getCell', [5, 3]).children[0].classList).toContain('e-3arrows-2');
            expect(helper.invoke('getCell', [6, 3]).children[0].classList).toContain('e-3arrows-1');

            helper.invoke('conditionalFormat', [{ type: 'Top10Percentage', cFColor: 'GreenFT', range: 'B1:B200', value: "15" }]);
            expect(helper.invoke('getCell', [1, 1]).style.backgroundColor).toBe('');
            expect(helper.invoke('getCell', [1, 1]).style.color).toBe('');
            expect(helper.invoke('getCell', [4, 1]).style.backgroundColor).toBe('');
            expect(helper.invoke('getCell', [5, 1]).style.backgroundColor).toBe('');
            expect(helper.invoke('getCell', [8, 1]).style.backgroundColor).toBe('rgb(198, 239, 206)');
            expect(helper.invoke('getCell', [8, 1]).style.color).toBe('rgb(0, 97, 0)');

            helper.invoke('clearConditionalFormat', ['B1:B200']);
            helper.invoke('conditionalFormat', [{ type: 'Top10Percentage', cFColor: 'GreenFT', range: 'B2:B6', value: "15" }]);
            expect(helper.invoke('getCell', [1, 1]).style.backgroundColor).toBe('');
            expect(helper.invoke('getCell', [1, 1]).style.color).toBe('');
            expect(helper.invoke('getCell', [4, 1]).style.backgroundColor).toBe('rgb(198, 239, 206)');
            expect(helper.invoke('getCell', [4, 1]).style.color).toBe('rgb(0, 97, 0)');
            expect(helper.invoke('getCell', [5, 1]).style.backgroundColor).toBe('');

            helper.invoke('clearConditionalFormat', ['B2:B11']);
            helper.invoke('conditionalFormat', [{ type: 'BelowAverage', range: 'B2:B11' }]);
            expect(helper.invoke('getCell', [1, 1]).style.backgroundColor).toBe('rgb(255, 199, 206)');
            expect(helper.invoke('getCell', [1, 1]).style.color).toBe('rgb(156, 0, 85)');
            expect(helper.invoke('getCell', [3, 1]).style.backgroundColor).toBe('');

            helper.invoke('conditionalFormat', [{ type: 'Duplicate', range: 'D2:D11' }]);
            expect(helper.invoke('getCell', [2, 3]).style.backgroundColor).toBe('rgb(255, 199, 206)');
            expect(helper.invoke('getCell', [2, 3]).style.color).toBe('rgb(156, 0, 85)');
            expect(helper.invoke('getCell', [3, 3]).style.backgroundColor).toBe('rgb(255, 199, 206)');

            helper.invoke('clearConditionalFormat', ['E2:E11']);
            helper.invoke('conditionalFormat', [{ type: 'Unique', range: 'E2:E11' }]);
            expect(helper.invoke('getCell', [3, 4]).style.backgroundColor).toBe('rgb(255, 199, 206)');
            expect(helper.invoke('getCell', [3, 4]).style.color).toBe('rgb(156, 0, 85)');
            expect(helper.invoke('getCell', [4, 4]).style.color).toBe('');

            helper.invoke('clearConditionalFormat', ['E2:E11']);
            helper.invoke('conditionalFormat', [{ type: 'Bottom10Percentage', range: 'E2:E11', value: "30" }]);
            expect(helper.invoke('getCell', [1, 4]).style.backgroundColor).toBe('rgb(255, 199, 206)');
            expect(helper.invoke('getCell', [1, 4]).style.color).toBe('rgb(156, 0, 85)');
            expect(helper.invoke('getCell', [2, 4]).style.backgroundColor).toBe('');

            helper.invoke('clearConditionalFormat', ['E2:E11']);
            helper.invoke('conditionalFormat', [{ type: "Between", cFColor: 'RedT', value: '16,30', range: 'E2:E11' }]);
            expect(helper.invoke('getCell', [2, 4]).style.backgroundColor).toBe('');
            expect(helper.invoke('getCell', [2, 4]).style.color).toBe('rgb(156, 0, 85)');
            expect(helper.invoke('getCell', [3, 4]).style.color).toBe('');
            expect(helper.invoke('getCell', [4, 4]).style.color).toBe('rgb(156, 0, 85)');
            expect(helper.invoke('getCell', [6, 4]).style.color).toBe('rgb(156, 0, 85)');

            helper.invoke('clearConditionalFormat', ['E2:E11']);
            helper.invoke(
                'conditionalFormat', [{ type: 'Between', value: '30,16', range: 'E2:E11',
                    format: { style: { backgroundColor: '#FFFF00' } } }]);
            let cell: HTMLElement = helper.invoke('getCell', [2, 4]);
            expect(cell.style.backgroundColor).toBe('rgb(255, 255, 0)');
            expect(cell.style.color).toBe('');
            cell = helper.invoke('getCell', [4, 4]);
            expect(cell.style.backgroundColor).toBe('rgb(255, 255, 0)');
            expect(cell.style.color).toBe('');
            cell = helper.invoke('getCell', [6, 4]);
            expect(cell.style.backgroundColor).toBe('rgb(255, 255, 0)');
            expect(cell.style.color).toBe('');
            cell = helper.invoke('getCell', [3, 4]);
            expect(cell.style.backgroundColor).toBe('');
            expect(helper.invoke('getCell', [3, 4]).style.color).toBe('');

            helper.invoke('clearConditionalFormat', ['B2:B11']);
            helper.invoke('conditionalFormat', [{ type: "Between", cFColor: 'RedT', value: '02/14/2014,02/04/2014', range: 'B2:B11' }]);
            expect(helper.invoke('getCell', [1, 1]).style.backgroundColor).toBe('');
            expect(helper.invoke('getCell', [1, 1]).style.color).toBe('rgb(156, 0, 85)');
            expect(helper.invoke('getCell', [2, 1]).style.color).toBe('');
            expect(helper.invoke('getCell', [3, 1]).style.color).toBe('');
            expect(helper.invoke('getCell', [7, 1]).style.color).toBe('rgb(156, 0, 85)');

            helper.invoke('clearConditionalFormat', ['B2:B11']);
            helper.invoke('conditionalFormat', [{ type: "Between", cFColor: 'RedT', value: '02/04/2014,02/14/2014', range: 'B2:B11' }]);
            expect(helper.invoke('getCell', [1, 1]).style.backgroundColor).toBe('');
            expect(helper.invoke('getCell', [1, 1]).style.color).toBe('rgb(156, 0, 85)');
            expect(helper.invoke('getCell', [2, 1]).style.color).toBe('');
            expect(helper.invoke('getCell', [3, 1]).style.color).toBe('');
            expect(helper.invoke('getCell', [7, 1]).style.color).toBe('rgb(156, 0, 85)');

            helper.invoke('clearConditionalFormat', ['E2:E11']);
            helper.invoke('conditionalFormat', [{ type: "EqualTo", cFColor: 'YellowFT', value: '15', range: 'E2:E11' }]);
            expect(helper.invoke('getCell', [3, 4]).style.backgroundColor).toBe('rgb(255, 235, 156)');
            expect(helper.invoke('getCell', [3, 4]).style.color).toBe('rgb(156, 101, 0)');

            helper.invoke('clear', [{ type: 'Clear All', range: 'F2:G11' }]);
            expect(helper.invoke('getCell', [2, 5]).style.backgroundColor).toBe('');
            expect(helper.invoke('getCell', [6, 6]).style.backgroundColor).toBe('');

            helper.invoke('clearConditionalFormat', ['H2:H11']);
            helper.invoke('conditionalFormat', [{ type: 'LightBlueDataBar', range: 'H2:H11' }]);
            expect(helper.invoke('getCell', [1, 7]).getElementsByClassName('e-databar')[1].style.width).toBe('7%');
            expect(helper.invoke('getCell', [1, 7]).getElementsByClassName('e-databar')[1].style.height).toBe('17px');
            expect(helper.invoke('getCell', [1, 7]).getElementsByClassName('e-databar')[1].style.backgroundColor).toBe('rgb(0, 138, 239)');
            expect(helper.invoke('getCell', [9, 7]).getElementsByClassName('e-databar')[1].style.width).toBe('100%');

            helper.invoke('conditionalFormat', [{ type: 'OrangeDataBar', range: 'H2:H11' }]);
            expect(helper.invoke('getCell', [1, 7]).getElementsByClassName('e-databar')[1].style.width).toBe('7%');
            expect(helper.invoke('getCell', [1, 7]).getElementsByClassName('e-databar')[1].style.height).toBe('17px');
            expect(helper.invoke('getCell', [1, 7]).getElementsByClassName('e-databar')[1].style.backgroundColor).toBe('rgb(255, 182, 40)');
            expect(helper.invoke('getCell', [9, 7]).getElementsByClassName('e-databar')[1].style.width).toBe('100%');

            helper.invoke('conditionalFormat', [{ type: 'PurpleDataBar', range: 'H2:H11' }]);
            expect(helper.invoke('getCell', [1, 7]).getElementsByClassName('e-databar')[1].style.width).toBe('7%');
            expect(helper.invoke('getCell', [1, 7]).getElementsByClassName('e-databar')[1].style.height).toBe('17px');
            expect(helper.invoke('getCell', [1, 7]).getElementsByClassName('e-databar')[1].style.backgroundColor).toBe('rgb(214, 0, 123)');
            expect(helper.invoke('getCell', [9, 7]).getElementsByClassName('e-databar')[1].style.width).toBe('100%');

            helper.invoke('clearConditionalFormat', ['E2:E11']);
            helper.invoke('conditionalFormat', [{ type: 'ThreeTriangles', range: 'E2:E11' }]);
            expect(helper.invoke('getCell', [1, 4]).children[0].classList).toContain('e-3triangles-3');
            expect(helper.invoke('getCell', [2, 4]).children[0].classList).toContain('e-3triangles-1');
            expect(helper.invoke('getCell', [4, 4]).children[0].classList).toContain('e-3triangles-2');
            
            helper.invoke('conditionalFormat', [{ type: 'FourArrows', range: 'E2:E11' }]);
            expect(helper.invoke('getCell', [1, 4]).children[0].classList).toContain('e-4arrows-4');
            expect(helper.invoke('getCell', [2, 4]).children[0].classList).toContain('e-4arrows-1');
            expect(helper.invoke('getCell', [3, 4]).children[0].classList).toContain('e-4arrows-3');
            expect(helper.invoke('getCell', [4, 4]).children[0].classList).toContain('e-4arrows-2');

            helper.invoke('conditionalFormat', [{ type: 'FiveArrows', range: 'E2:E11' }]);
            expect(helper.invoke('getCell', [1, 4]).children[0].classList).toContain('e-5arrows-5');
            expect(helper.invoke('getCell', [2, 4]).children[0].classList).toContain('e-5arrows-1');
            expect(helper.invoke('getCell', [3, 4]).children[0].classList).toContain('e-5arrows-4');
            expect(helper.invoke('getCell', [4, 4]).children[0].classList).toContain('e-5arrows-3');

            helper.invoke('conditionalFormat', [{ type: 'ThreeArrowsGray', range: 'E2:E11' }]);
            expect(helper.invoke('getCell', [1, 4]).children[0].classList).toContain('e-3arrowsgray-3');
            expect(helper.invoke('getCell', [2, 4]).children[0].classList).toContain('e-3arrowsgray-1');
            expect(helper.invoke('getCell', [4, 4]).children[0].classList).toContain('e-3arrowsgray-2');

            helper.invoke('conditionalFormat', [{ type: 'FourArrowsGray', range: 'E2:E11' }]);
            expect(helper.invoke('getCell', [1, 4]).children[0].classList).toContain('e-4arrowsgray-4');
            expect(helper.invoke('getCell', [2, 4]).children[0].classList).toContain('e-4arrowsgray-1');
            expect(helper.invoke('getCell', [3, 4]).children[0].classList).toContain('e-4arrowsgray-3');
            expect(helper.invoke('getCell', [4, 4]).children[0].classList).toContain('e-4arrowsgray-2');

            helper.invoke('conditionalFormat', [{ type: 'FiveArrowsGray', range: 'E2:E11' }]);
            expect(helper.invoke('getCell', [1, 4]).children[0].classList).toContain('e-5arrowsgray-5');
            expect(helper.invoke('getCell', [2, 4]).children[0].classList).toContain('e-5arrowsgray-1');
            expect(helper.invoke('getCell', [3, 4]).children[0].classList).toContain('e-5arrowsgray-4');
            expect(helper.invoke('getCell', [4, 4]).children[0].classList).toContain('e-5arrowsgray-3');

            helper.invoke('conditionalFormat', [{ type: 'ThreeTrafficLights1', range: 'E2:E11' }]);
            expect(helper.invoke('getCell', [1, 4]).children[0].classList).toContain('e-3trafficlights-3');
            expect(helper.invoke('getCell', [2, 4]).children[0].classList).toContain('e-3trafficlights-1');
            expect(helper.invoke('getCell', [4, 4]).children[0].classList).toContain('e-3trafficlights-2');

            helper.invoke('conditionalFormat', [{ type: 'ThreeSigns', range: 'E2:E11' }]);
            expect(helper.invoke('getCell', [1, 4]).children[0].classList).toContain('e-3signs-3');
            expect(helper.invoke('getCell', [2, 4]).children[0].classList).toContain('e-3signs-1');
            expect(helper.invoke('getCell', [4, 4]).children[0].classList).toContain('e-3signs-2');

            helper.invoke('conditionalFormat', [{ type: 'FourRedToBlack', range: 'E2:E11' }]);
            expect(helper.invoke('getCell', [1, 4]).children[0].classList).toContain('e-4redtoblack-4');
            expect(helper.invoke('getCell', [2, 4]).children[0].classList).toContain('e-4redtoblack-1');
            expect(helper.invoke('getCell', [3, 4]).children[0].classList).toContain('e-4redtoblack-3');
            expect(helper.invoke('getCell', [4, 4]).children[0].classList).toContain('e-4redtoblack-2');

            helper.invoke('conditionalFormat', [{ type: 'ThreeTrafficLights2', range: 'E2:E11' }]);
            expect(helper.invoke('getCell', [1, 4]).children[0].classList).toContain('e-3rafficlights2-3');
            expect(helper.invoke('getCell', [2, 4]).children[0].classList).toContain('e-3rafficlights2-1');
            expect(helper.invoke('getCell', [4, 4]).children[0].classList).toContain('e-3rafficlights2-2');

            helper.invoke('conditionalFormat', [{ type: 'FourTrafficLights', range: 'E2:E11' }]);
            expect(helper.invoke('getCell', [1, 4]).children[0].classList).toContain('e-4trafficlights-4');
            expect(helper.invoke('getCell', [2, 4]).children[0].classList).toContain('e-4trafficlights-1');
            expect(helper.invoke('getCell', [3, 4]).children[0].classList).toContain('e-4trafficlights-3');
            expect(helper.invoke('getCell', [4, 4]).children[0].classList).toContain('e-4trafficlights-2');

            helper.invoke('conditionalFormat', [{ type: 'ThreeSymbols', range: 'E2:E11' }]);
            expect(helper.invoke('getCell', [1, 4]).children[0].classList).toContain('e-3symbols-3');
            expect(helper.invoke('getCell', [2, 4]).children[0].classList).toContain('e-3symbols-1');
            expect(helper.invoke('getCell', [4, 4]).children[0].classList).toContain('e-3symbols-2');

            helper.invoke('conditionalFormat', [{ type: 'ThreeFlags', range: 'E2:E11' }]);
            expect(helper.invoke('getCell', [1, 4]).children[0].classList).toContain('e-3flags-3');
            expect(helper.invoke('getCell', [2, 4]).children[0].classList).toContain('e-3flags-1');
            expect(helper.invoke('getCell', [4, 4]).children[0].classList).toContain('e-3flags-2');

            helper.invoke('conditionalFormat', [{ type: 'ThreeSymbols2', range: 'E2:E11' }]);
            expect(helper.invoke('getCell', [1, 4]).children[0].classList).toContain('e-3symbols2-3');
            expect(helper.invoke('getCell', [2, 4]).children[0].classList).toContain('e-3symbols2-1');
            expect(helper.invoke('getCell', [4, 4]).children[0].classList).toContain('e-3symbols2-2');

            helper.invoke('conditionalFormat', [{ type: 'ThreeStars', range: 'E2:E11' }]);
            expect(helper.invoke('getCell', [1, 4]).children[0].classList).toContain('e-3stars-3');
            expect(helper.invoke('getCell', [2, 4]).children[0].classList).toContain('e-3stars-1');
            expect(helper.invoke('getCell', [4, 4]).children[0].classList).toContain('e-3stars-2');

            helper.invoke('conditionalFormat', [{ type: 'FourRating', range: 'E2:E11' }]);
            expect(helper.invoke('getCell', [1, 4]).children[0].classList).toContain('e-4rating-1');
            expect(helper.invoke('getCell', [2, 4]).children[0].classList).toContain('e-4rating-4');
            expect(helper.invoke('getCell', [3, 4]).children[0].classList).toContain('e-4rating-2');
            expect(helper.invoke('getCell', [4, 4]).children[0].classList).toContain('e-4rating-3');

            helper.invoke('conditionalFormat', [{ type: 'FiveQuarters', range: 'E2:E11' }]);
            expect(helper.invoke('getCell', [1, 4]).children[0].classList).toContain('e-5quarters-5');
            expect(helper.invoke('getCell', [2, 4]).children[0].classList).toContain('e-5quarters-1');
            expect(helper.invoke('getCell', [3, 4]).children[0].classList).toContain('e-5quarters-4');
            expect(helper.invoke('getCell', [4, 4]).children[0].classList).toContain('e-5quarters-3');

            helper.invoke('conditionalFormat', [{ type: 'FiveRating', range: 'E2:E11' }]);
            expect(helper.invoke('getCell', [1, 4]).children[0].classList).toContain('e-5rating-1');
            expect(helper.invoke('getCell', [2, 4]).children[0].classList).toContain('e-5rating-5');
            expect(helper.invoke('getCell', [3, 4]).children[0].classList).toContain('e-5rating-2');
            expect(helper.invoke('getCell', [4, 4]).children[0].classList).toContain('e-5rating-3');

            helper.invoke('conditionalFormat', [{ type: 'FiveBoxes', range: 'E2:E11' }]);
            expect(helper.invoke('getCell', [1, 4]).children[0].classList).toContain('e-5boxes-5');
            expect(helper.invoke('getCell', [2, 4]).children[0].classList).toContain('e-5boxes-1');
            expect(helper.invoke('getCell', [3, 4]).children[0].classList).toContain('e-5boxes-4');
            expect(helper.invoke('getCell', [4, 4]).children[0].classList).toContain('e-5boxes-3');
            done();
        });
    });

    describe('Undo Redo for Conditional Formatting->', () => {
        let spreadsheet: any;
        beforeAll((done: Function) => { 
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        }); 
        it('undo after one Conditional Formatting Applied->', (done: Function) => {
            helper.invoke('conditionalFormat', [{ type: 'BlueDataBar', range: 'H2:H11' }]);
            const cellEle: any = helper.invoke('getCell', [1, 7]);
            expect(cellEle.getElementsByClassName('e-databar')[1].style.width).toBe('7%');
            expect(cellEle.getElementsByClassName('e-databar')[1].style.height).toBe('17px');
            expect(helper.invoke('getCell', [9, 7]).getElementsByClassName('e-databar')[1].style.width).toBe('100%');
            spreadsheet = helper.getInstance();
            helper.invoke('numberFormat', ['0.00', 'H2:H11']);
            let cell: any = spreadsheet.sheets[0].rows[1].cells[7];
            expect(cell.format).toBe('0.00');
            expect(cell.value).toBe(10);
            expect(cell.formattedText).toBe('10.00');
            expect(cellEle.textContent).toBe('10.00');
            spreadsheet.notify(clearViewer, { options: { type: 'Clear Formats', range: 'H2:H11' }, isAction: true });
            expect(cellEle.querySelector('.e-databar')).toBeNull();
            expect(helper.invoke('getCell', [9, 7]).querySelector('.e-databar')).toBeNull();
            expect(cell.value).toBe(10);
            expect(cell.format).toBeUndefined();
            expect(cell.formattedText).toBeUndefined();
            expect(cellEle.textContent).toBe('10');
            helper.invoke('undo');
            expect(cellEle.getElementsByClassName('e-databar')[1].style.width).toBe('7%');
            expect(cellEle.getElementsByClassName('e-databar')[1].style.height).toBe('17px');
            expect(helper.invoke('getCell', [9, 7]).getElementsByClassName('e-databar')[1].style.width).toBe('100%');
            cell = spreadsheet.sheets[0].rows[1].cells[7];
            expect(cell.format).toBe('0.00');
            expect(cell.value).toBe(10);
            expect(cell.formattedText).toBe('10.00');
            expect(cellEle.textContent).toBe('10.00');
            done();
        });

        it('undo and Redo after Conditional Formatting Applied->', (done: Function) => {
            helper.invoke('conditionalFormat', [{ type: "RYGColorScale", range: 'H2:H11' }]);
            expect(helper.invoke('getCell', [1, 7]).style.backgroundColor).toBe('rgb(99, 190, 123)');
            expect(helper.invoke('getCell', [2, 7]).style.backgroundColor).toBe('rgb(255, 235, 132)');
            expect(helper.invoke('getCell', [4, 7]).style.backgroundColor).toBe('rgb(250, 157, 117)');
            expect(helper.invoke('getCell', [5, 7]).style.backgroundColor).toBe('rgb(249, 131, 112)');
            spreadsheet.notify(clearViewer, { options: { type: 'Clear Formats', range: 'H2:H11' }, isAction: true });
            expect(helper.invoke('getCell', [1, 7]).querySelector('.e-databar')).toBeNull();
            expect(helper.invoke('getCell', [1, 7]).querySelector('.e-databar')).toBeNull();
            expect(helper.invoke('getCell', [9, 7]).querySelector('.e-databar')).toBeNull();
            expect(helper.invoke('getCell', [1, 7]).style.backgroundColor).toBeNull;
            expect(helper.invoke('getCell', [2, 7]).style.backgroundColor).toBeNull;
            expect(helper.invoke('getCell', [4, 7]).style.backgroundColor).toBeNull;
            expect(helper.invoke('getCell', [5, 7]).style.backgroundColor).toBeNull;
            helper.invoke('undo');
            expect(helper.invoke('getCell', [1, 7]).getElementsByClassName('e-databar')[1].style.width).toBe('7%');
            expect(helper.invoke('getCell', [1, 7]).getElementsByClassName('e-databar')[1].style.height).toBe('17px');
            expect(helper.invoke('getCell', [9, 7]).getElementsByClassName('e-databar')[1].style.width).toBe('100%');
            expect(helper.invoke('getCell', [1, 7]).style.backgroundColor).toBe('rgb(99, 190, 123)');
            expect(helper.invoke('getCell', [2, 7]).style.backgroundColor).toBe('rgb(255, 235, 132)');
            expect(helper.invoke('getCell', [4, 7]).style.backgroundColor).toBe('rgb(250, 157, 117)');
            expect(helper.invoke('getCell', [5, 7]).style.backgroundColor).toBe('rgb(249, 131, 112)');
            helper.invoke('redo');
            expect(helper.invoke('getCell', [1, 7]).querySelector('.e-databar')).toBeNull();
            expect(helper.invoke('getCell', [1, 7]).querySelector('.e-databar')).toBeNull();
            expect(helper.invoke('getCell', [9, 7]).querySelector('.e-databar')).toBeNull();
            expect(helper.invoke('getCell', [1, 7]).style.backgroundColor).toBeNull;
            expect(helper.invoke('getCell', [2, 7]).style.backgroundColor).toBeNull;
            expect(helper.invoke('getCell', [4, 7]).style.backgroundColor).toBeNull;
            expect(helper.invoke('getCell', [5, 7]).style.backgroundColor).toBeNull;
            helper.invoke('undo');
            expect(helper.invoke('getCell', [1, 7]).getElementsByClassName('e-databar')[1].style.width).toBe('7%');
            expect(helper.invoke('getCell', [1, 7]).getElementsByClassName('e-databar')[1].style.height).toBe('17px');
            expect(helper.invoke('getCell', [9, 7]).getElementsByClassName('e-databar')[1].style.width).toBe('100%');
            expect(helper.invoke('getCell', [1, 7]).style.backgroundColor).toBe('rgb(99, 190, 123)');
            expect(helper.invoke('getCell', [2, 7]).style.backgroundColor).toBe('rgb(255, 235, 132)');
            expect(helper.invoke('getCell', [4, 7]).style.backgroundColor).toBe('rgb(250, 157, 117)');
            expect(helper.invoke('getCell', [5, 7]).style.backgroundColor).toBe('rgb(249, 131, 112)');
            done();
        });

        it('Clear Iconset->', (done: Function) => {
            helper.invoke('conditionalFormat', [{ type: 'ThreeArrows', range: 'D2:D11' }]);
            expect(helper.invoke('getCell', [1, 3]).children[0].classList).toContain('e-3arrows-3');
            expect(helper.invoke('getCell', [5, 3]).children[0].classList).toContain('e-3arrows-2');
            expect(helper.invoke('getCell', [6, 3]).children[0].classList).toContain('e-3arrows-1');
            spreadsheet.notify(clearViewer, { options: { type: 'Clear Formats', range: 'D2:D11' }, isAction: true });
            expect(helper.invoke('getCell', [1, 3]).querySelector('e-3arrows-3')).toBeNull();
            expect(helper.invoke('getCell', [5, 3]).querySelector('e-3arrows-3')).toBeNull();
            expect(helper.invoke('getCell', [6, 3]).querySelector('e-3arrows-3')).toBeNull();
            done();
        });

        it('Apply DataBars for Negative Values->', (done: Function) => {
            helper.edit('F2', '-200');
            helper.edit('F3', '-600');
            helper.edit('F4', '-300');
            helper.invoke('conditionalFormat', [{ type: 'BlueDataBar', range: 'F2:F4' }]);
            expect(helper.invoke('getCell', [1, 5]).getElementsByClassName('e-databar')[1].style.width).toBe('34%');
            expect(helper.invoke('getCell', [1, 5]).getElementsByClassName('e-databar')[1].style.height).toBe('17px');
            expect(helper.invoke('getCell', [1, 5]).getElementsByClassName('e-databar')[1].style.backgroundColor).toBe('rgb(248, 105, 107)');
            expect(helper.invoke('getCell', [2, 5]).getElementsByClassName('e-databar')[1].style.width).toBe('100%');
            expect(helper.invoke('getCell', [2, 5]).getElementsByClassName('e-databar')[1].style.height).toBe('17px');
            expect(helper.invoke('getCell', [2, 5]).getElementsByClassName('e-databar')[1].style.backgroundColor).toBe('rgb(248, 105, 107)');
            expect(helper.invoke('getCell', [3, 5]).getElementsByClassName('e-databar')[1].style.width).toBe('50%');
            expect(helper.invoke('getCell', [3, 5]).getElementsByClassName('e-databar')[1].style.height).toBe('17px');
            expect(helper.invoke('getCell', [3, 5]).getElementsByClassName('e-databar')[1].style.backgroundColor).toBe('rgb(248, 105, 107)');
            done();
        });

        it('Apply DataBars for Negative and Positive Values->', (done: Function) => {
            helper.invoke('clear', [{ type: 'Clear Formats', range: 'F2:F4' }]);
            helper.edit('F3', '600');
            helper.edit('F4', '300');
            helper.invoke('conditionalFormat', [{ type: 'BlueDataBar', range: 'F2:F3' }]);
            expect(helper.invoke('getCell', [1, 5]).getElementsByClassName('e-databar')[1].style.width).toBe('');
            expect(helper.invoke('getCell', [1, 5]).getElementsByClassName('e-databar')[1].style.height).toBe('');
            expect(helper.invoke('getCell', [1, 5]).getElementsByClassName('e-databar')[1].style.backgroundColor).toBe('');
            expect(helper.invoke('getCell', [2, 5]).getElementsByClassName('e-databar')[1].style.width).toBe('75%');
            expect(helper.invoke('getCell', [2, 5]).getElementsByClassName('e-databar')[1].style.height).toBe('17px');
            expect(helper.invoke('getCell', [2, 5]).getElementsByClassName('e-databar')[1].style.backgroundColor).toBe('rgb(90, 138, 198)');
            done();
        });

        it('Apply Greater Than for Regular Expressions->', (done: Function) => {
            helper.invoke('clear', [{ type: 'Clear Formats', range: 'H2:H11' }]);
            helper.invoke('conditionalFormat', [{ type: "GreaterThan", cFColor: 'RedFT', value: '10^1', range: 'H2:H11' }]);
            expect(helper.invoke('getCell', [2, 7]).style.backgroundColor).toBe('rgb(255, 199, 206)');
            expect(helper.invoke('getCell', [2, 7]).style.color).toBe('rgb(156, 0, 85)');
            expect(helper.invoke('getCell', [3, 7]).style.backgroundColor).toBe('rgb(255, 199, 206)');
            expect(helper.invoke('getCell', [3, 7]).style.color).toBe('rgb(156, 0, 85)');
            done();
        });

        it('Apply Between for Date Values->', (done: Function) => {
            helper.invoke('conditionalFormat', [{ type: "Between", cFColor: 'RedFT', value: '4/20/2014,9/16/2014', range: 'B2:B11' }]);
            expect(helper.invoke('getCell', [2, 1]).style.backgroundColor).toBe('rgb(255, 199, 206)');
            expect(helper.invoke('getCell', [2, 1]).style.color).toBe('rgb(156, 0, 85)');
            expect(helper.invoke('getCell', [3, 1]).style.backgroundColor).toBe('rgb(255, 199, 206)');
            expect(helper.invoke('getCell', [3, 1]).style.color).toBe('rgb(156, 0, 85)');
            done();
        });

        it('Apply Between for Regular Expressions->', (done: Function) => {
            helper.invoke('clear', [{ type: 'Clear Formats', range: 'H2:H11' }]);
            helper.invoke('conditionalFormat', [{ type: "Between", cFColor: 'RedFT', value: '50^1,70^1', range: 'H2:H11' }]);
            expect(helper.invoke('getCell', [4, 7]).style.backgroundColor).toBe('rgb(255, 199, 206)');
            expect(helper.invoke('getCell', [4, 7]).style.color).toBe('rgb(156, 0, 85)');
            expect(helper.invoke('getCell', [5, 7]).style.backgroundColor).toBe('rgb(255, 199, 206)');
            expect(helper.invoke('getCell', [5, 7]).style.color).toBe('rgb(156, 0, 85)');
            done();
        });

        it('Apply Equal to for Date Values->', (done: Function) => {
            helper.invoke('clear', [{ type: 'Clear Formats', range: 'B2:B11' }]);
            helper.invoke('conditionalFormat', [{ type: "EqualTo", cFColor: 'YellowFT', value: '07/22/2014', range: 'B2:B11' }]);
            expect(helper.invoke('getCell', [6, 1]).style.backgroundColor).toBe('rgb(255, 235, 156)');
            expect(helper.invoke('getCell', [6, 1]).style.color).toBe('rgb(156, 101, 0)');
            done();
        });

        it('Apply Equal to for Regular Expressions->', (done: Function) => {
            helper.invoke('clear', [{ type: 'Clear Formats', range: 'H2:H11' }]);
            helper.invoke('conditionalFormat', [{ type: "EqualTo", cFColor: 'YellowFT', value: '10^1', range: 'H2:H11' }]);
            expect(helper.invoke('getCell', [1, 7]).style.backgroundColor).toBe('');
            expect(helper.invoke('getCell', [1, 7]).style.color).toBe('');
            done();
        });

        it('EJ2-907556 - Greater than CF is not applied to string value', (done: Function) => {
            const cell1: any = helper.invoke('getCell', [0, 3]);
            expect(cell1.textContent).toBe('Quantity');
            expect(cell1.style.backgroundColor).toBe('');
            helper.invoke('conditionalFormat', [{ type: "GreaterThan", cFColor: "RedFT", range: "D1:D200", value: '20' }]);
            expect(cell1.style.backgroundColor).toBe('');
            const cell2: any = helper.invoke('getCell', [1, 3]);
            expect(cell2.style.backgroundColor).toBe('');
            helper.edit('D2', 'Check CF in string');
            expect(cell2.textContent).toBe('Check CF in string');
            expect(cell2.style.backgroundColor).toBe('');
            done();
        });
    });

    describe('UI Interaction->', () => {
        beforeAll((done: Function) => { 
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }], selectedRange: 'F2:F11' }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Apply Greater Than->', (done: Function) => {
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-menu-item');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#cf_greaterthan_dlg').click();
            setTimeout((): void => {
                helper.setAnimationToNone('.e-conditionalformatting-dlg.e-dialog');
                const btn: HTMLButtonElement = helper.getElement('#' + helper.id + ' .e-conditionalformatting-dlg .e-primary.e-btn')
                expect(btn.disabled).toBeTruthy();
                const input: HTMLInputElement = helper.getElement('#' + helper.id + ' .e-conditionalformatting-dlg .e-cfmain .e-input') as HTMLInputElement;
                input.value = '300';
                const evt: Event = document.createEvent('Event');
                evt.initEvent('input', true, true); input.dispatchEvent(evt);
                btn.click();
                expect(helper.invoke('getCell', [1, 5]).style.backgroundColor).toBe('');
                expect(helper.invoke('getCell', [2, 5]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                expect(helper.invoke('getCell', [2, 5]).style.color).toBe('rgb(156, 0, 85)');
                expect(helper.invoke('getCell', [6, 5]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                expect(helper.invoke('getCell', [6, 5]).style.color).toBe('rgb(156, 0, 85)');
                done();
            });
        });

        it('Apply Less Than->', (done: Function) => {
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-menu-item');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#cf_lessthan_dlg').click();
            setTimeout((): void => {
                helper.setAnimationToNone('.e-conditionalformatting-dlg.e-dialog');
                let Color: any = helper.getElements('.e-conditionalformatting-dlg .e-cfsub .e-dropdownlist')[0];
                Color.ej2_instances[0].value = 'Yellow Fill with Dark Yellow Text';
                Color.ej2_instances[0].dataBind();
                const input: HTMLInputElement = helper.getElement('#' + helper.id + ' .e-conditionalformatting-dlg .e-cfmain .e-input') as HTMLInputElement;
                input.value = '300';
                const evt: Event = document.createEvent('Event');
                evt.initEvent('input', true, true);
                input.dispatchEvent(evt);
                helper.click(' .e-conditionalformatting-dlg .e-footer-content button:nth-child(1)');
                expect(helper.invoke('getCell', [1, 5]).style.backgroundColor).toBe('rgb(255, 235, 156)');
                expect(helper.invoke('getCell', [1, 5]).style.color).toBe('rgb(156, 101, 0)');
                done();
            });
        });

        it('Apply Between->', (done: Function) => {
            helper.invoke('selectRange', ['G2:G11']);
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-menu-item');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#cf_between_dlg').click();
            setTimeout((): void => {
                helper.setAnimationToNone('.e-conditionalformatting-dlg.e-dialog');
                let Color: any = helper.getElements('.e-conditionalformatting-dlg .e-cfsub .e-dropdownlist')[0];
                Color.ej2_instances[0].value = 'Green Fill with Dark Green Text';
                Color.ej2_instances[0].dataBind();
                helper.getElements('.e-conditionalformatting-dlg .e-cfmain .e-input')[0].value = '5';
                const input: HTMLInputElement = helper.getElements('.e-conditionalformatting-dlg .e-cfmain .e-input')[1] as HTMLInputElement;
                input.value = '15';
                const evt: Event = document.createEvent('Event'); evt.initEvent('input', true, true); input.dispatchEvent(evt);
                helper.click(' .e-conditionalformatting-dlg .e-footer-content button:nth-child(1)');
                expect(helper.invoke('getCell', [2, 6]).style.backgroundColor).toBe('rgb(198, 239, 206)');
                expect(helper.invoke('getCell', [2, 6]).style.color).toBe('rgb(0, 97, 0)');
                expect(helper.invoke('getCell', [3, 6]).style.backgroundColor).toBe('rgb(198, 239, 206)');
                expect(helper.invoke('getCell', [3, 6]).style.color).toBe('rgb(0, 97, 0)');
                done();
            });
        });

        it('Apply Equal to->', (done: Function) => {
            helper.invoke('selectRange', ['F2:F11']);
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-menu-item');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#cf_eqaulto_dlg').click();
            setTimeout((): void => {
                helper.setAnimationToNone('.e-conditionalformatting-dlg.e-dialog');
                let Color: any = helper.getElements('.e-conditionalformatting-dlg .e-cfsub .e-dropdownlist')[0];
                Color.ej2_instances[0].value = 'Red Fill';
                Color.ej2_instances[0].dataBind();
                const input: HTMLInputElement = helper.getElement('#' + helper.id + ' .e-conditionalformatting-dlg .e-cfmain .e-input') as HTMLInputElement;
                input.value = '300';
                const evt: Event = document.createEvent('Event'); evt.initEvent('input', true, true); input.dispatchEvent(evt);
                helper.click(' .e-conditionalformatting-dlg .e-footer-content button:nth-child(1)');
                expect(helper.invoke('getCell', [3, 5]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                expect(helper.invoke('getCell', [3, 5]).style.color).toBe('');
                expect(helper.invoke('getCell', [4, 5]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                expect(helper.invoke('getCell', [4, 5]).style.color).toBe('');
                done();
            });
        });

        it('Apply Date->', (done: Function) => {
            helper.invoke('selectRange', ['B2:B11']);
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-menu-item');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#cf_adateoccuring_dlg').click();
            setTimeout((): void => {
                helper.setAnimationToNone('.e-conditionalformatting-dlg.e-dialog');
                const input: HTMLInputElement = helper.getElement('#' + helper.id + ' .e-conditionalformatting-dlg .e-cfmain .e-input') as HTMLInputElement;
                input.value = '7/22/2014';
                const evt: Event = document.createEvent('Event'); evt.initEvent('input', true, true); input.dispatchEvent(evt);
                helper.click(' .e-conditionalformatting-dlg .e-footer-content button:nth-child(1)');
                expect(helper.invoke('getCell', [5, 1]).style.backgroundColor).toBe('');
                expect(helper.invoke('getCell', [6, 1]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                expect(helper.invoke('getCell', [6, 1]).style.color).toBe('rgb(156, 0, 85)');
                done();
            });
        });

        it('Apply Top 10 Items->', (done: Function) => {
            helper.invoke('selectRange', ['E2:E11']);
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-topbottomrules');
            (getComponent(target.parentElement.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#cf_top10items_dlg').click();
            setTimeout((): void => {
                helper.setAnimationToNone('.e-conditionalformatting-dlg.e-dialog');
                helper.getElements('.e-conditionalformatting-dlg .e-cfmain .e-input .e-numerictextbox').value = '5';
                helper.click(' .e-conditionalformatting-dlg .e-footer-content button:nth-child(1)');
                expect(helper.invoke('getCell', [1, 4]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                expect(helper.invoke('getCell', [1, 4]).style.color).toBe('rgb(156, 0, 85)');
                expect(helper.invoke('getCell', [2, 4]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                expect(helper.invoke('getCell', [2, 4]).style.color).toBe('rgb(156, 0, 85)');
                done();
            });
        });

        it('Apply Bottom 10 Items->', (done: Function) => {
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-topbottomrules');
            (getComponent(target.parentElement.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#cf_bottom10items_dlg').click();
            setTimeout((): void => {
                helper.setAnimationToNone('.e-conditionalformatting-dlg.e-dialog');
                let Color: any = helper.getElements('.e-conditionalformatting-dlg .e-cfsub .e-dropdownlist')[0];
                Color.ej2_instances[0].value = 'Yellow Fill with Dark Yellow Text';
                Color.ej2_instances[0].dataBind();
                helper.getElements('.e-conditionalformatting-dlg .e-cfmain .e-input .e-numerictextbox').value = '5';
                helper.click(' .e-conditionalformatting-dlg .e-footer-content button:nth-child(1)');
                expect(helper.invoke('getCell', [3, 4]).style.backgroundColor).toBe('rgb(255, 235, 156)');
                expect(helper.invoke('getCell', [3, 4]).style.color).toBe('rgb(156, 101, 0)');
                expect(helper.invoke('getCell', [5, 4]).style.backgroundColor).toBe('rgb(255, 235, 156)');
                expect(helper.invoke('getCell', [5, 4]).style.color).toBe('rgb(156, 101, 0)');
                done();
            });
        });

        it('Apply Top 10 Percentage->', (done: Function) => {
            helper.invoke('selectRange', ['H2:H11']);
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-topbottomrules');
            (getComponent(target.parentElement.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#cf_top10_dlg').click();
            setTimeout((): void => {
                helper.setAnimationToNone('.e-conditionalformatting-dlg.e-dialog');
                helper.click(' .e-conditionalformatting-dlg .e-footer-content button:nth-child(1)');
                expect(helper.invoke('getCell', [9, 7]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                expect(helper.invoke('getCell', [9, 7]).style.color).toBe('rgb(156, 0, 85)');
                done();
            });
        });

        it('Apply Bottom 10 Percentage->', (done: Function) => {
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-topbottomrules');
            (getComponent(target.parentElement.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#cf_bottom10_dlg').click();
            setTimeout((): void => {
                helper.setAnimationToNone('.e-conditionalformatting-dlg.e-dialog');
                let Color: any = helper.getElements('.e-conditionalformatting-dlg .e-cfsub .e-dropdownlist')[0];
                Color.ej2_instances[0].value = 'Yellow Fill with Dark Yellow Text';
                Color.ej2_instances[0].dataBind();
                helper.click(' .e-conditionalformatting-dlg .e-footer-content button:nth-child(1)');
                expect(helper.invoke('getCell', [1, 7]).style.backgroundColor).toBe('rgb(255, 235, 156)');
                expect(helper.invoke('getCell', [1, 7]).style.color).toBe('rgb(156, 101, 0)');
                done();
            });
        });

        it('Apply Above Average->', (done: Function) => {
            helper.invoke('selectRange', ['D2:D11']);
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-topbottomrules');
            (getComponent(target.parentElement.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#cf_aboveaverage_dlg').click();
            setTimeout((): void => {
                helper.setAnimationToNone('.e-conditionalformatting-dlg.e-dialog');
                helper.click(' .e-conditionalformatting-dlg .e-footer-content button:nth-child(1)');
                expect(helper.invoke('getCell', [5, 3]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                expect(helper.invoke('getCell', [5, 3]).style.color).toBe('rgb(156, 0, 85)');
                expect(helper.invoke('getCell', [6, 3]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                expect(helper.invoke('getCell', [6, 3]).style.color).toBe('rgb(156, 0, 85)');
                done();
            });
        });

        it('Apply Below Average->', (done: Function) => {
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-topbottomrules');
            (getComponent(target.parentElement.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#cf_belowaverage_dlg').click();
            setTimeout((): void => {
                helper.setAnimationToNone('.e-conditionalformatting-dlg.e-dialog');
                let Color: any = helper.getElements('.e-conditionalformatting-dlg .e-cfsub .e-dropdownlist')[0];
                Color.ej2_instances[0].value = 'Yellow Fill with Dark Yellow Text';
                Color.ej2_instances[0].dataBind();
                helper.click(' .e-conditionalformatting-dlg .e-footer-content button:nth-child(1)');
                expect(helper.invoke('getCell', [1, 3]).style.backgroundColor).toBe('rgb(255, 235, 156)');
                expect(helper.invoke('getCell', [1, 3]).style.color).toBe('rgb(156, 101, 0)');
                expect(helper.invoke('getCell', [2, 3]).style.backgroundColor).toBe('rgb(255, 235, 156)');
                expect(helper.invoke('getCell', [2, 3]).style.color).toBe('rgb(156, 101, 0)');
                done();
            });
        });

        it('Input Value with "(" for Between Condition ->', (done: Function) => {
            helper.invoke('selectRange', ['H2:H11']);
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-menu-item');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#cf_between_dlg').click();
            setTimeout((): void => {
                helper.setAnimationToNone('.e-conditionalformatting-dlg.e-dialog');
                helper.getElements('.e-conditionalformatting-dlg .e-cfmain .e-input')[0].value = '10(1)';
                const input: HTMLInputElement = helper.getElements('.e-conditionalformatting-dlg .e-cfmain .e-input')[1] as HTMLInputElement;
                input.value = '100';
                const evt: Event = document.createEvent('Event'); evt.initEvent('input', true, true); input.dispatchEvent(evt);
                helper.click(' .e-conditionalformatting-dlg .e-footer-content button:nth-child(1)');
                expect(helper.invoke('getCell', [2, 7]).style.backgroundColor).toBe('');
                expect(helper.invoke('getCell', [2, 7]).style.color).toBe('');
                expect(helper.invoke('getCell', [3, 7]).style.backgroundColor).toBe('');
                expect(helper.invoke('getCell', [3, 7]).style.color).toBe('');
                done();
            });
        });

        it('Apply Duplicate->', (done: Function) => {
            helper.invoke('clear', [{ type: 'Clear Formats', range: 'E2:E11' }]);
            helper.invoke('selectRange', ['E2:E11']);
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-menu-item');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#cf_duplicatevalues_dlg').click();
            setTimeout((): void => {
                helper.setAnimationToNone('.e-conditionalformatting-dlg.e-dialog');
                let Color: any = helper.getElements('.e-conditionalformatting-dlg .e-cfsub .e-dropdownlist')[0];
                Color.ej2_instances[0].value = 'Red Text';
                Color.ej2_instances[0].dataBind();
                helper.click(' .e-conditionalformatting-dlg .e-footer-content button:nth-child(1)');
                expect(helper.invoke('getCell', [1, 4]).style.backgroundColor).toBe('');
                expect(helper.invoke('getCell', [1, 4]).style.color).toBe('rgb(156, 0, 85)');
                expect(helper.invoke('getCell', [2, 4]).style.backgroundColor).toBe('');
                expect(helper.invoke('getCell', [2, 4]).style.color).toBe('rgb(156, 0, 85)');
                done();
            });
        });

        it('Redo after clear Conditional Formats->', (done: Function) => {
            helper.invoke('selectRange', ['E2:E11']);
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-menu-item:nth-child(6)');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#cf_cr_cells').click();
            expect(helper.invoke('getCell', [1, 4]).style.color).toBe('');
            expect(helper.invoke('getCell', [2, 4]).style.color).toBe('');
            helper.click('#spreadsheet_undo');
            expect(helper.invoke('getCell', [1, 4]).style.color).toBe('rgb(156, 0, 85)');
            expect(helper.invoke('getCell', [2, 4]).style.color).toBe('rgb(156, 0, 85)');
            helper.click('#spreadsheet_redo');
            expect(helper.invoke('getCell', [1, 4]).style.color).toBe('');
            expect(helper.invoke('getCell', [2, 4]).style.color).toBe('');
            done();
        });
        it('914946-Issue while applying the conditional formatting for readonly cells,  need to throw edit alert when selected Cells are in read for Greater Than->', function (done) {
            var spreadsheet = helper.getInstance();
            spreadsheet.setRangeReadOnly(true, 'A1:H11', 0);
            helper.invoke('selectRange', ['F2:F11']);
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-menu-item');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#cf_greaterthan_dlg').click();
            helper.setAnimationToNone('.e-conditionalformatting-dlg.e-dialog');
            const btn: HTMLButtonElement = helper.getElement('#' + helper.id + ' .e-conditionalformatting-dlg .e-primary.e-btn')
            expect(btn.disabled).toBeTruthy();
            const input: HTMLInputElement = helper.getElement('#' + helper.id + ' .e-conditionalformatting-dlg .e-cfmain .e-input') as HTMLInputElement;
            input.value = '100';
            const evt: Event = document.createEvent('Event');
            evt.initEvent('input', true, true); input.dispatchEvent(evt);
            btn.click();
            const dialog = helper.getElement('.e-readonly-alert-dlg.e-dialog');
            expect(dialog.querySelector('.e-dlg-content').textContent).toBe("You are trying to modify a cell that is in read-only mode. To make changes, please disable the read-only status.");
            helper.click('.e-dialog .e-primary');
            done();
        });
    });

    describe('UI Interaction->', () => { 
        beforeAll((done: Function) => { 
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }], selectedRange: 'H2:H11' }, { }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Apply Undo in one sheet and Redo in another Sheet', (done: Function) => {
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const databars: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-menu-item[aria-label="Data Bars"]');
            (getComponent(databars.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: databars.getBoundingClientRect().left + 5, y: databars.getBoundingClientRect().top + 5 }, document, databars);
            helper.getElement('#BlueDataBar').click();
            expect(helper.invoke('getCell', [1, 7]).getElementsByClassName('e-databar')[1].style.width).toBe('7%');
            expect(helper.invoke('getCell', [1, 7]).getElementsByClassName('e-databar')[1].style.height).toBe('17px');
            expect(helper.invoke('getCell', [9, 7]).getElementsByClassName('e-databar')[1].style.width).toBe('100%');
            helper.click('#spreadsheet_undo');
            expect(helper.invoke('getCell', [1, 7]).querySelector('.e-databar')).toBeNull();
            expect(helper.invoke('getCell', [1, 7]).querySelector('.e-databar')).toBeNull();
            expect(helper.invoke('getCell', [9, 7]).querySelector('.e-databar')).toBeNull();
            helper.invoke('goTo', ['Sheet2!A1']);
            setTimeout(() => {
                helper.click('#spreadsheet_redo');
                setTimeout(() => {
                    expect(helper.invoke('getCell', [1, 7]).getElementsByClassName('e-databar')[1].style.width).toBe('7%');
                    expect(helper.invoke('getCell', [1, 7]).getElementsByClassName('e-databar')[1].style.height).toBe('17px');
                    expect(helper.invoke('getCell', [9, 7]).getElementsByClassName('e-databar')[1].style.width).toBe('100%');
                    done();
                });
            });
        });
        it('Apply Clear CF in one sheet and Undo in another Sheet', (done: Function) => {
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const clearrules: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-menu-item[aria-label="Clear Rules"]');
            (getComponent(clearrules.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: clearrules.getBoundingClientRect().left + 5, y: clearrules.getBoundingClientRect().top + 5 }, document, clearrules);
            helper.getElement('#cf_cr_cells').click();
            expect(helper.invoke('getCell', [1, 7]).querySelector('.e-databar')).toBeNull();
            expect(helper.invoke('getCell', [1, 7]).querySelector('.e-databar')).toBeNull();
            expect(helper.invoke('getCell', [9, 7]).querySelector('.e-databar')).toBeNull();
            helper.invoke('goTo', ['Sheet2!A1']);
            setTimeout(() => {
                helper.click('#spreadsheet_undo');
                setTimeout(() => {
                    expect(helper.invoke('getCell', [1, 7]).getElementsByClassName('e-databar')[1].style.width).toBe('7%');
                    expect(helper.invoke('getCell', [1, 7]).getElementsByClassName('e-databar')[1].style.height).toBe('17px');
                    expect(helper.invoke('getCell', [9, 7]).getElementsByClassName('e-databar')[1].style.width).toBe('100%');
                    done();
                });
            });
        });
        it('Apply Clear CF in half Cells and undo', (done: Function) => {
            helper.invoke('selectRange', ['H2:H5']);
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const clearrules: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-menu-item[aria-label="Clear Rules"]');
            (getComponent(clearrules.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: clearrules.getBoundingClientRect().left + 5, y: clearrules.getBoundingClientRect().top + 5 }, document, clearrules);
            helper.getElement('#cf_cr_cells').click();
            expect(helper.invoke('getCell', [1, 7]).querySelector('.e-databar')).toBeNull();
            expect(helper.invoke('getCell', [1, 7]).querySelector('.e-databar')).toBeNull();
            expect(helper.invoke('getCell', [2, 7]).querySelector('.e-databar')).toBeNull();
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                expect(helper.invoke('getCell', [1, 7]).getElementsByClassName('e-databar')[1].style.width).toBe('7%');
                expect(helper.invoke('getCell', [1, 7]).getElementsByClassName('e-databar')[1].style.height).toBe('17px');
                expect(helper.invoke('getCell', [9, 7]).getElementsByClassName('e-databar')[1].style.width).toBe('100%');
                helper.getElement('#' + helper.id + '_conditionalformatting').click();
                const clearrules: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-menu-item[aria-label="Clear Rules"]');
                (getComponent(clearrules.parentElement, 'menu') as any).animationSettings.effect = 'None';
                helper.triggerMouseAction('mouseover', { x: clearrules.getBoundingClientRect().left + 5, y: clearrules.getBoundingClientRect().top + 5 }, document, clearrules);
                helper.getElement('#cf_cr_sheet').click();
                done();
            });
        });
        it('Clear CF from Top to Bottom Selection - I', (done: Function) => {
            helper.invoke('selectRange', ['D2:H11']);
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const databars: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-menu-item[aria-label="Data Bars"]');
            (getComponent(databars.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: databars.getBoundingClientRect().left + 5, y: databars.getBoundingClientRect().top + 5 }, document, databars);
            helper.getElement('#BlueDataBar').click();
            helper.invoke('selectRange', ['F2:F11']);
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const clearrules: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-menu-item[aria-label="Clear Rules"]');
            (getComponent(clearrules.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: clearrules.getBoundingClientRect().left + 5, y: clearrules.getBoundingClientRect().top + 5 }, document, clearrules);
            helper.getElement('#cf_cr_cells').click();
            setTimeout(() => {
                expect(helper.invoke('getCell', [1, 5]).querySelector('.e-databar')).toBeNull();
                expect(helper.invoke('getCell', [1, 5]).querySelector('.e-databar')).toBeNull();
                expect(helper.invoke('getCell', [2, 5]).querySelector('.e-databar')).toBeNull();
                done();
            });
        });
        it('Clear CF from Top to Bottom Selection with empty cell - I', (done: Function) => {
            helper.invoke('selectRange', ['E1:E12']);
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const clearrules: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-menu-item[aria-label="Clear Rules"]');
            (getComponent(clearrules.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: clearrules.getBoundingClientRect().left + 5, y: clearrules.getBoundingClientRect().top + 5 }, document, clearrules);
            helper.getElement('#cf_cr_cells').click();
            setTimeout(() => {
                expect(helper.invoke('getCell', [1, 4]).querySelector('.e-databar')).toBeNull();
                expect(helper.invoke('getCell', [1, 4]).querySelector('.e-databar')).toBeNull();
                expect(helper.invoke('getCell', [2, 4]).querySelector('.e-databar')).toBeNull();
                helper.click('#spreadsheet_undo');
                done();
            });
        });
        it('Clear CF from Top to Bottom Selection with empty cell - II', (done: Function) => {
            helper.invoke('selectRange', ['D1:D12']);
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const clearrules: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-menu-item[aria-label="Clear Rules"]');
            (getComponent(clearrules.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: clearrules.getBoundingClientRect().left + 5, y: clearrules.getBoundingClientRect().top + 5 }, document, clearrules);
            helper.getElement('#cf_cr_cells').click();
            setTimeout(() => {
                expect(helper.invoke('getCell', [1, 3]).querySelector('.e-databar')).toBeNull();
                expect(helper.invoke('getCell', [1, 3]).querySelector('.e-databar')).toBeNull();
                expect(helper.invoke('getCell', [2, 3]).querySelector('.e-databar')).toBeNull();
                helper.click('#spreadsheet_undo');
                done();
            });
        });
        it('Clear CF from Top to Bottom Selection in middle of CF appliedcells', (done: Function) => {
            helper.invoke('selectRange', ['E3:E10']);
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const clearrules: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-menu-item[aria-label="Clear Rules"]');
            (getComponent(clearrules.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: clearrules.getBoundingClientRect().left + 5, y: clearrules.getBoundingClientRect().top + 5 }, document, clearrules);
            helper.getElement('#cf_cr_cells').click();
            setTimeout(() => {
                expect(helper.invoke('getCell', [2, 4]).querySelector('.e-databar')).toBeNull();
                expect(helper.invoke('getCell', [3, 4]).querySelector('.e-databar')).toBeNull();
                expect(helper.invoke('getCell', [4, 4]).querySelector('.e-databar')).toBeNull();
                helper.click('#spreadsheet_undo');
                done();
            });
        });
        it('Clear CF from Top to Bottom Selection with empty cell - III', (done: Function) => {
            helper.invoke('selectRange', ['D1:D10']);
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const clearrules: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-menu-item[aria-label="Clear Rules"]');
            (getComponent(clearrules.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: clearrules.getBoundingClientRect().left + 5, y: clearrules.getBoundingClientRect().top + 5 }, document, clearrules);
            helper.getElement('#cf_cr_cells').click();
            setTimeout(() => {
                expect(helper.invoke('getCell', [2, 3]).querySelector('.e-databar')).toBeNull();
                expect(helper.invoke('getCell', [3, 3]).querySelector('.e-databar')).toBeNull();
                expect(helper.invoke('getCell', [4, 3]).querySelector('.e-databar')).toBeNull();
                helper.click('#spreadsheet_undo');
                done();
            });
        });
        it('Clear CF from Top to Bottom Selection with empty cell - IV', (done: Function) => {
            helper.invoke('selectRange', ['D3:D12']);
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const clearrules: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-menu-item[aria-label="Clear Rules"]');
            (getComponent(clearrules.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: clearrules.getBoundingClientRect().left + 5, y: clearrules.getBoundingClientRect().top + 5 }, document, clearrules);
            helper.getElement('#cf_cr_cells').click();
            setTimeout(() => {
                expect(helper.invoke('getCell', [2, 3]).querySelector('.e-databar')).toBeNull();
                expect(helper.invoke('getCell', [3, 3]).querySelector('.e-databar')).toBeNull();
                expect(helper.invoke('getCell', [4, 3]).querySelector('.e-databar')).toBeNull();
                done();
            });
        });
        it('Apply Undo in active sheet after clear CF and Redo in another sheet', (done: Function) => {
            helper.click('#spreadsheet_undo');
            expect(helper.invoke('getCell', [2, 3]).querySelector('.e-databar')).not.toBeNull();
            expect(helper.invoke('getCell', [3, 3]).querySelector('.e-databar')).not.toBeNull();
            expect(helper.invoke('getCell', [4, 3]).querySelector('.e-databar')).not.toBeNull();
            helper.invoke('goTo', ['Sheet2!A1']);
            setTimeout(() => {
                helper.click('#spreadsheet_redo');
                setTimeout(() => {
                    expect(helper.invoke('getCell', [2, 3]).querySelector('.e-databar')).toBeNull();
                    expect(helper.invoke('getCell', [3, 3]).querySelector('.e-databar')).toBeNull();
                    expect(helper.invoke('getCell', [4, 3]).querySelector('.e-databar')).toBeNull();
                    done();
                }); 
            });
        });
    });
    
    describe('Conditional formatting on clipboard actions ->', () => {
        let spreadsheet: Spreadsheet;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{
                conditionalFormats: [
                  { type: "ContainsText", cFColor: "RedFT", value:'shoes', range: 'A2:A11' },
                  { type: "DateOccur", cFColor: "YellowFT", value:'7/22/2014', range: 'B2:B11' },
                  { type: "GreaterThan", cFColor: "GreenFT", value:'11:26:32 AM', range: 'C2:C11' },
                  { type: "LessThan", cFColor: "RedF", value:'20', range: 'D2:D11' },
                ],
                ranges: [{ dataSource: defaultData }],
            }, {}] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Copy / paste to othet sheet', (done: Function) => {
            helper.invoke('copy', ['A1:H11']).then((): void => {
                spreadsheet = helper.getInstance();
                spreadsheet.activeSheetIndex = 1;
                spreadsheet.dataBind();
                setTimeout((): void => {
                    helper.invoke('paste');
                    expect(spreadsheet.sheets[1].conditionalFormats.length).toBe(4);
                    let cell: HTMLElement = helper.invoke('getCell', [1, 0]);
                    expect(cell.style.backgroundColor).toBe('rgb(255, 199, 206)');
                    expect(cell.style.color).toBe('rgb(156, 0, 85)');
                    cell = helper.invoke('getCell', [6, 1]);
                    expect(cell.style.backgroundColor).toBe('rgb(255, 235, 156)');
                    expect(cell.style.color).toBe('rgb(156, 101, 0)');
                    cell = helper.invoke('getCell', [9, 2]);
                    expect(cell.style.backgroundColor).toBe('rgb(198, 239, 206)');
                    expect(cell.style.color).toBe('rgb(0, 97, 0)');
                    cell = helper.invoke('getCell', [1, 3]);
                    expect(cell.style.backgroundColor).toBe('rgb(255, 199, 206)');
                    helper.invoke('selectRange', ['A15']);
                    helper.invoke('paste', ['A15', 'Values']);
                    expect(spreadsheet.sheets[1].conditionalFormats.length).toBe(4);
                    done();
                });
            });
        });
    });

    describe('EJ2-60930, EJ2-831846, EJ2-878093 ->', () => {
        beforeEach((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: InventoryList }] }] }, done);
        });
        afterEach(() => {
            helper.invoke('destroy');
        });
        it('Color Scales w.r.t Conditional Formatting not working properly', (done: Function) => {
            helper.getInstance().conditionalFormat({ type: 'GYRColorScale', range: 'D1:D15' });
            let cell1: HTMLElement = helper.invoke('getCell', [1, 3]);
            let cell2: HTMLElement = helper.invoke('getCell', [2, 3]);
            expect(cell1.textContent).not.toBe(cell2.textContent);
            expect(cell1.style.backgroundColor).not.toBe(cell2.style.backgroundColor);
            done();
        });
        it('Conditional formatting is not pasted correctly to another cell or range', (done: Function) => {
            helper.invoke('conditionalFormat', [{ type: 'BlueDataBar', range: 'H2:H6' }]);
            helper.invoke('copy', ['H3:H5']).then(function () {
                helper.invoke('paste', ['J2']);
                expect(helper.invoke('getCell', [1, 9]).querySelector('.e-databar')).not.toBeNull();
                expect(helper.invoke('getCell', [1, 9]).getElementsByClassName('e-databar')[1].style.width).toBe('95%');
                done();
            });
        });
        it('Issue in CF-dialog before open event', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            const previousValue: EmitType<DialogBeforeOpenEventArgs> = spreadsheet.dialogBeforeOpen;
            spreadsheet.dialogBeforeOpen = (args: DialogBeforeOpenEventArgs): void => {
                args.cancel = true;
            };
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-menu-item');
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#cf_lessthan_dlg').click();
            setTimeout(() => {
                expect(helper.getElementFromSpreadsheet('.e-conditionalformatting-dlg.e-dialog')).toBeNull();
                spreadsheet.dialogBeforeOpen = previousValue;
                done();
            });
        });
    });

    describe('CR-Issues ->', () => {
        describe('fb22057, FB24222, FB23945 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ cellStyle: { color: '#0000FF' }, sheets: [{ conditionalFormats: [{ type: 'ContainsText', value: '1', cFColor: 'GreenFT',
                range: 'A1:A1' }, { type: 'ContainsText', value: '2', cFColor: 'RedF', range: 'A1:A1' }, { type: 'ContainsText', value:
                '3', cFColor: 'YellowFT', range: 'A1:A1' }], rows: [{ cells:[{ index: 2, value: 'Romona Heaslip' }, { value: 'Eamon Traise' }, { value: 'Julius Gorner'}] }] }] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Conditional Formatting not properly working while more than one condition applied', (done: Function) => {
                const cell: HTMLElement = helper.invoke('getCell', [0, 0]);
                helper.invoke('updateCell', [{ value: '1' }]);
                expect(cell.classList).toContain('e-greenft');
                helper.invoke('updateCell', [{ value: '2' }]);
                expect(cell.classList).toContain('e-redf');
                helper.invoke('updateCell', [{ value: '3' }]);
                expect(cell.classList).toContain('e-yellowft');
                done();
            });

            it('Conditional Formatting font color changed to default color', (done: Function) => {
                helper.invoke('addDataValidation', [{ type: "List", operator: "Between", value1: "a,b,c" }, 'B1']);
                helper.invoke('conditionalFormat', [{ type: "ContainsText", cFColor: "YellowFT", value: "a", range: "B1" }]);
                helper.invoke('selectRange', ['B1']);
                const td: HTMLElement = helper.invoke('getCell', [0, 1]);
                (td.querySelector('.e-dropdownlist') as any).ej2_instances[0].dropDownClick({ preventDefault: function () { }, target: td.children[0] });
                setTimeout(() => {
                    helper.click('.e-ddl.e-popup li:nth-child(1)');
                    expect(helper.invoke('getCell', [0, 1]).style.color).toBe('rgb(156, 101, 0)');
                    (td.querySelector('.e-dropdownlist') as any).ej2_instances[0].dropDownClick({ preventDefault: function () { }, target: td.children[0] });
                    setTimeout(() => {
                        helper.click('.e-ddl.e-popup li:nth-child(2)');
                        expect(helper.invoke('getCell', [0, 1]).style.color).toBe('rgb(0, 0, 255)');
                        done();
                    });
                });
            });

            it('Conditional Formatting does not work when range is selected from right to left', (done: Function) => {
                helper.invoke('selectRange', ['E1:C1'])
                helper.invoke('conditionalFormat', [{ type: 'ContainsText', cFColor: 'RedFT', value: 'Ju' }]);
                expect(helper.invoke('getCell', [0, 4]).classList).toContain('e-redft');
                expect(helper.getInstance().sheets[0].conditionalFormats[4].range).toBe('C1:E1');
                done();
            });
        });
        describe('I304843 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({}, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            // it('Conditional Formatting not properly working while more than one condition applied', (done: Function) => {
            //     const spreadsheet: Spreadsheet = helper.getInstance();
            //     spreadsheet.openFromJson({ file: { "Workbook": { "sheets": [{ "conditionalFormats": [{ "format": { "style": { "backgroundColor": "#FFFF00" } },
            //         "range": "H7:BP40", "value": "IF(COUNT(H7)<1,NOT(ISBLANK(H7)),FALSE),", "type": "GreaterThan", "cFColor": "RedFT" }],
            //         "protectSettings": { "selectCells": true, "formatCells": false, "insertLink": false, "formatColumns": false, "formatRows": false },
            //         "isProtected": true, "name": "CA55", "rowCount": 240, "selectedRange": "A4:A6", "usedRange": { "rowIndex": 239, "colIndex": 68 }, "activeCell": "A4",
            //         "rows": [{ "cells": [{ "index": 3, "isLocked": true, "colSpan": 7,
            //             "style": { "fontFamily": "Arial", "backgroundColor": "#FFC000", "fontSize": "12pt", "fontWeight": "Bold", "textAlign": "Center", "verticalAlign": "Middle" },
            //             "value": "Please ensure date entered on the STL is the same as the visit date entered in EDC." }], "height": 71 },
            //         { "index": 3, "cells": [{ "rowSpan": 3, "value": "Initials" }, { "rowSpan": 3, "value": "Subject Number" },
            //         { "rowSpan": 3, "value": "Source of Subject Referral\n(Please select from list)" },
            //         { "rowSpan": 3, "value": "Date Consent Signed" }, { "rowSpan": 3, "value": "# of Amendments to Consent" },
            //         { "rowSpan": 3, "value": "Visit 1\nScreening" }, { "rowSpan": 3, "value": "Screening\nUrine Preg Test" },
            //         { "rowSpan": 3, "value": "Visit 2\nBaseline\n(BSV)" }, { "rowSpan": 3, "value": "Baseline\nUrine Preg Test" },
            //         { "rowSpan": 3, "value": "Visit 3 \nDay 1\nRandomization" }, { "rowSpan": 3, "value": "Day 1\nUrine Preg Test" },
            //         { "rowSpan": 3, "value": "Visit 4\n4 Weeks" }, { "rowSpan": 3, "value": "4 Weeks\nUrine Preg Test" },
            //         { "rowSpan": 3, "value": "Phone Call 1" }, { "rowSpan": 3, "value": "Phone Call 2" },
            //         { "rowSpan": 3, "value": "Visit 5\n27 Weeks" }, { "rowSpan": 3, "value": "27 Weeks\nUrine Preg Test" },
            //         { "rowSpan": 3, "value": "Visit 6\n44-49 Weeks" }, { "rowSpan": 3, "value": "44-49 Weeks\nUrine Preg Test" },
            //         { "rowSpan": 3, "value": "Visit 7\n52-57 Weeks" }, { "rowSpan": 3, "value": "52-57 Weeks\nUrine Preg Test" },
            //         { "rowSpan": 3, "value": "Phone Call 3\nFollow Up" }, { "rowSpan": 3, "value": "SAE" },
            //         { "rowSpan": 3, "value": "Unscheduled Visit" }, { "rowSpan": 3, "value": "Unscheduled Visit" },
            //         { "rowSpan": 3, "value": "COMMENTS" }], "height": 115 }] }] } } });
            //     setTimeout((): void => {
            //         spreadsheet.cellFormat({ fontFamily: 'Arial', fontSize: '10pt', fontWeight: 'bold', textAlign: 'center', verticalAlign: 'middle' }, 'A2:G2');
            //         spreadsheet.cellFormat({
            //             fontFamily: 'Arial', backgroundColor: '#FFFF99', border: '1px solid #000000', fontSize: '9pt', fontWeight: 'bold', textAlign: 'center', verticalAlign: 'middle'
            //         }, 'A4:Z4');
            //         spreadsheet.wrap('A4:Z4');
            //         spreadsheet.cellFormat({
            //             fontFamily: 'Arial', border: '1px solid #000000', fontSize: '9pt', fontWeight: 'bold', textAlign: 'center', verticalAlign: 'middle'
            //         }, 'A7:BQ40');
            //         spreadsheet.cellFormat({ backgroundColor: '#B8CCE4' }, 'E7:E40');
            //         spreadsheet.addDataValidation({ type: 'List', value1: '=$A$200:$A$205' }, 'E7:E40');
            //         spreadsheet.numberFormat('mm-dd-yyyy', 'F7:F40');
            //         spreadsheet.addDataValidation({ type: 'Date', value1: '5/26/2020', value2: 'TODAY()' }, 'F7:F40');
            //         spreadsheet.addDataValidation({ value1: '0', value2: '5' }, 'G7:G40');
            //         spreadsheet.numberFormat('mm-dd-yyyy', 'D7:Z40');
            //         spreadsheet.addDataValidation({ type: 'Date', value1: '5/26/2020', value2: 'TODAY()' }, 'H7:Z40');
            //         setTimeout((): void => {
            //             expect(spreadsheet.sheets[0].rows[6].cells[4].validation.type).toBe('List');
            //             expect(spreadsheet.sheets[0].rows[7].cells[5].validation.type).toBe('Date');
            //             expect(spreadsheet.sheets[0].rows[8].cells[6].validation.type).toBeUndefined();
            //             done();
            //         });
            //     });
            // });
        });
        describe('fb24298, EJ2-58351 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet(
                    { sheets: [{ rows: [{ cells: [{ value: '7' }] }, { cells: [{ value: '35' }] }, { cells: [{ value: '20' }] }],
                    selectedRange: 'A1:A3' }] }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Cells are getting highlighted even if no value for conditional formatting is applied', (done: Function) => {
                helper.getElement('#' + helper.id + '_conditionalformatting').click();
                const target: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-menu-item');
                (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
                helper.triggerMouseAction(
                    'mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document,
                    target);
                helper.getElement('#cf_greaterthan_dlg').click();
                setTimeout((): void => {
                    helper.setAnimationToNone('.e-conditionalformatting-dlg.e-dialog');
                    const btn: HTMLButtonElement = helper.getElement('#' + helper.id + ' .e-conditionalformatting-dlg .e-primary.e-btn');
                    expect(btn.disabled).toBeTruthy();
                    let input: HTMLInputElement = helper.getElement('#' + helper.id + ' .e-conditionalformatting-dlg .e-cfmain .e-input');
                    let evt: Event;
                    ['1', ''].forEach((text: string): void => {
                        input.value = text;
                        evt = document.createEvent('Event'); evt.initEvent('input', true, true); input.dispatchEvent(evt);
                        if (text === '1') {
                            expect(btn.disabled).toBeFalsy();
                        } else {
                            expect(btn.disabled).toBeTruthy();
                        }
                    });
                    btn.click();
                    done();
                });
            });
            it('Conditional formatting DataBars do not have cleared after clearing content', (done: Function) => {
                helper.invoke('conditionalFormat', [{ type: 'BlueDataBar', range: 'A1:A3' }]);
                expect(helper.invoke('getCell', [0, 0]).getElementsByClassName('e-databar')[1].style.width).toBe('20%');
                expect(helper.invoke('getCell', [1, 0]).getElementsByClassName('e-databar')[1].style.width).toBe('100%');
                expect(helper.invoke('getCell', [2, 0]).getElementsByClassName('e-databar')[1].style.width).toBe('58%');
                helper.click('#spreadsheet_clear');
                helper.click('#spreadsheet_clear-popup ul li:nth-child(3)');
                expect(helper.invoke('getCell', [0, 0]).querySelector('.e-databar')).toBeNull();
                expect(helper.invoke('getCell', [1, 0]).querySelector('.e-databar')).toBeNull();
                expect(helper.invoke('getCell', [2, 0]).querySelector('.e-databar')).toBeNull();
                done();
            });
        });

        describe('F171297 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet(
                    {
                        sheets: [{
                            rows: [{ cells: [{ value: '444' }, { formula: '=SUM(A1,A2)' }, { formula: '=SUM(B1,B2)' }, { formula: '=SUM(C1,C2)' }, { value: '2/4/2014' }, { value: '8/27/1994' }] },
                                { cells: [{ value: '555' }, { formula: '=A2+A3' }, { formula: '=B2+B3' }, { formula: '=C2+C3' }, { value: '5/24/2014' }, { value: '3/18/1994' }] },
                                { cells: [{ value: '666' }, { value: '777' }, { value: '2109' }, { value: '4329' }, { value: '7/18/2014' }, { value: '7/26/2023' }] }
                            ],
                            conditionalFormats: [
                                { range: 'A1:A3', value: '444,', type: 'GreaterThan', cFColor: 'RedFT' },
                                { type: 'GYRColorScale', range: 'B1:B3', cFColor: 'RedFT', value: '' },
                                { type: 'LightBlueDataBar', range: 'C1:C3', cFColor: 'RedFT', value: '' },
                                { type: 'ThreeArrows', range: 'D1:D3', cFColor: 'RedFT', value: '' },
                                { type: 'Between', cFColor: 'RedFT', value: '4/20/2014,9/16/2014', range: 'E2:E3' },
                                { type: 'EqualTo', cFColor: 'RedFT', value: '8/27/1994', range: 'F1:F3' }
                            ]
                        }]
                    }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Importing excel having CF with formulas throws script error', (done: Function) => {
                expect(helper.invoke('getCell', [1, 0]).classList).toContain('e-redft');
                expect(helper.invoke('getCell', [0, 1]).style.backgroundColor).toContain('rgb(255, 235, 132)');
                expect(helper.invoke('getCell', [0, 2]).querySelector('.e-databar')).not.toBeNull();
                expect(helper.invoke('getCell', [0, 3]).querySelector('.e-3arrows-2')).not.toBeNull();
                expect(helper.invoke('getCell', [0, 4]).style.backgroundColor).toBe('');
                expect(helper.invoke('getCell', [1, 4]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                expect(helper.invoke('getCell', [0, 5]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                expect(helper.invoke('getCell', [2, 5]).style.backgroundColor).toBe('');
                done();
            });
            it('Adding multiple databar, colorscale, and iconsets', (done: Function) => {
                helper.invoke('conditionalFormat', [{ type: 'BWRColorScale', range: 'B1:B3', cFColor: 'RedFT', value: '' }]);
                expect(helper.invoke('getCell', [1, 1]).style.backgroundColor).toContain('rgb(90, 138, 198)');
                helper.invoke('conditionalFormat', [{ type: 'GreenDataBar', range: 'C1:C3', cFColor: 'RedFT', value: '' }]);
                expect(helper.invoke('getCell', [0, 2]).querySelectorAll('.e-databar')[1].style.backgroundColor).toBe('rgb(99, 190, 123)');
                helper.invoke('conditionalFormat', [{ type: 'ThreeTrafficLights1', range: 'D1:D3', cFColor: 'RedFT', value: '' }]);
                expect(helper.invoke('getCell', [0, 3]).querySelector('.e-3trafficlights-2')).not.toBeNull();
                helper.invoke('resize');
                setTimeout(() => {
                    expect(helper.invoke('getCell', [1, 1]).style.backgroundColor).toContain('rgb(90, 138, 198)');
                    expect(helper.invoke('getCell', [0, 2]).querySelectorAll('.e-databar')[1].style.backgroundColor).toBe('rgb(99, 190, 123)');
                    expect(helper.invoke('getCell', [0, 3]).querySelector('.e-3trafficlights-2')).not.toBeNull();
                    done();
                });
            });
            it('Editing with invalid value on CF applied cells', (done: Function) => {
                helper.edit('B2', 'Test');
                const cellEle: HTMLElement = helper.invoke('getCell', [1, 1]);
                expect(cellEle.style.backgroundColor).toBe('');
                helper.invoke('cellFormat', [{ backgroundColor: '#4dff00' }, 'B2']);
                expect(cellEle.style.backgroundColor).toBe('rgb(77, 255, 0)');
                helper.edit('B2', '555');
                expect(cellEle.style.backgroundColor).toContain('rgb(248, 105, 107)');
                helper.edit('B2', 'text');
                expect(cellEle.style.backgroundColor).toBe('rgb(77, 255, 0)');
                done();
            });
        });
        describe('SF-364570 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: [] }] }] }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Conditional formatting is not working after vol 4 release', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.dataSourceChanged = (): void => {
                    spreadsheet.conditionalFormat({ type: 'GWRColorScale', range: 'D3:H5' });
                    expect(helper.invoke('getCell', [2, 3]).style.backgroundColor).toBe('rgb(244, 250, 246)');
                    setTimeout((): void => {
                        expect(helper.invoke('getCell', [2, 3]).style.backgroundColor).toBe('rgb(244, 250, 246)');
                        expect(helper.invoke('getCell', [2, 5]).style.backgroundColor).toBe('rgb(99, 190, 123)');
                        expect(helper.invoke('getCell', [3, 6]).style.backgroundColor).toBe('rgb(249, 145, 146)');
                        expect(helper.invoke('getCell', [4, 7]).style.backgroundColor).toBe('rgb(161, 216, 175)');
                        done();
                    });
                };
                spreadsheet.sheets[0].ranges = [{ dataSource: defaultData }];
                spreadsheet.dataBind();
            });
        });
        describe('I327232, EJ2-55014, fb25069, EJ2-48232, EJ2-48541, EJ2-48148, EJ2-51527, EJ2-55991 ->' , () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{  dataSource: defaultData}] }] },done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('I327232, EJ2-55014 - Paste action for conditional formatting applied cell ->', (done: Function) => {
                helper.invoke('conditionalFormat', [{ type: 'ContainsText', cFColor: 'RedFT', value: 'It', Range: 'A1' }]);
                expect(helper.invoke('getCell', [0, 0]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                helper.invoke('copy', ['A1']).then(function () {
                    helper.invoke('paste', ['B1']);
                    expect(helper.invoke('getCell', [0, 1]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                    done();
                });
            });

            it('fb25069 - Unable to add More than 4 characters in the conditional formatting input feild ->', (done: Function) => {
                helper.invoke('selectRange', ['A3'])
                helper.getElement('#' + helper.id + '_conditionalformatting').click();
                const target: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-menu-item');
                (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
                helper.triggerMouseAction(
                    'mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document,
                    target);
                helper.getElement('#cf_textcontains_dlg').click();
                setTimeout((): void => {
                    helper.setAnimationToNone('.e-conditionalformatting-dlg.e-dialog');
                    const btn: HTMLButtonElement = helper.getElement('#' + helper.id + ' .e-conditionalformatting-dlg .e-primary.e-btn');
                    expect(btn.disabled).toBeTruthy();
                    let input: HTMLInputElement = helper.getElement('#' + helper.id + ' .e-conditionalformatting-dlg .e-cfmain .e-input');
                    let evt: Event;
                    ['Sports Shoes'].forEach((text: string): void => {
                        input.value = text;
                        evt = document.createEvent('Event'); evt.initEvent('input', true, true); input.dispatchEvent(evt);
                    });
                    btn.click();
                    expect(helper.invoke('getCell', [2, 0]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                    done();
                });
            });

            it('EJ2-48232 - Font Color is changed to default when data validation and conditional formatting is applied', (done: Function) => {
                helper.invoke('addDataValidation', [{ type: "List", operator: "Between", value1: "a,b,c" }, 'C1']);
                helper.invoke('selectRange', ['C1']);
                const td: HTMLElement = helper.invoke('getCell', [0, 2]);
                (td.querySelector('.e-dropdownlist') as any).ej2_instances[0].dropDownClick({ preventDefault: function () { }, target: td.children[0] });
                setTimeout(() => {
                    helper.click('.e-ddl.e-popup li:nth-child(1)');
                    setTimeout(() => {
                        helper.invoke('conditionalFormat', [{ type: 'ContainsText', cFColor: 'RedFT', value: 'a', Range: 'C1' }]);
                        expect(helper.invoke('getCell', [0, 2]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                        done();
                    });
                });
            });

            it('EJ2-48541 - Conditional formatting is not getting refreshed in a cell with formula after editing argument values', (done: Function) => {
                helper.invoke('selectRange', ['I2']);
                helper.invoke('updateCell', [{ formula: '=SUM(H2:H3)' }, 'I2']);
                helper.invoke('conditionalFormat', [{ type: 'ContainsText', cFColor: 'RedFT', value: '60', Range: 'I2' }]);
                expect(helper.invoke('getCell', [1, 8]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                helper.edit('H2', '5');
                expect(helper.invoke('getCell', [1, 8]).style.backgroundColor).toBe('');
                done();
            });

            it('EJ2-48148 - Conditional Formatting doesnot work when range selected from down to up/left to right', (done: Function) => {
                helper.invoke('selectRange', ['A10:A8'])
                helper.invoke('conditionalFormat', [{ type: 'ContainsText', cFColor: 'RedFT', value: 'Shoes', Range: 'A10:A8' }]);
                expect(helper.invoke('getCell', [7, 0]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                expect(helper.invoke('getCell', [9, 0]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                done();
            });

            it('EJ2-51527 - Cells are getting highlighted even if no range for formatting is applied', (done: Function) => {
                helper.invoke('selectRange', ['H2:H11']);
                helper.invoke('conditionalFormat', [{ type: 'ContainsText', cFColor: 'RedFT', value: ' ', Range: 'H2:H11' }]);
                expect(helper.invoke('getCell', [7, 7]).style.backgroundColor).toBe('');
                expect(helper.invoke('getCell', [10, 7]).style.backgroundColor).toBe('');
                done();
            });

            it('EJ2-55991 - Need to fix the conditional formatting issue with the negative values for lesser than condition->', (done: Function) => {
                helper.invoke('updateCell', [{ value: '-103' }, 'J2']);
                helper.invoke('updateCell', [{ value: '-112' }, 'J3']);
                helper.invoke('updateCell', [{ value: '107' }, 'J4']);
                helper.invoke('updateCell', [{ value: '-108' }, 'J5']);
                helper.invoke('updateCell', [{ value: '120' }, 'J6']);
                helper.invoke('selectRange', ['J2:J6']);
                helper.invoke('conditionalFormat', [{ type: 'LessThan', cFColor: 'RedFT', value: '-100', range: 'J2:K13' }]);
                expect(helper.invoke('getCell', [1, 9]).style.backgroundColor).toContain('rgb(255, 199, 206)');
                expect(helper.invoke('getCell', [2, 9]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                expect(helper.invoke('getCell', [3, 9]).style.backgroundColor).toBe('');
                const usedRange: UsedRangeModel = helper.getInstance().sheets[0].usedRange;
                expect(usedRange.rowIndex).toBe(12);
                expect(usedRange.colIndex).toBe(10);
                done();
            });
        }); 
        describe('EJ2-62888 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: defaultData }] }]
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Issue in applying conditional formatting for the same selected range->', (done: Function) => {
                helper.invoke('selectRange', ['D2:E4']);
                helper.invoke('conditionalFormat', [{ type: "GreaterThan", cFColor: "RedFT", range: "D2:E4", value: '15' }]);
                helper.invoke('conditionalFormat', [{ type: "LessThan", cFColor: "RedFT", range: "D2:E4", value: '15' }]);
                setTimeout(() => {
                    expect(helper.invoke('getCell', [1, 3]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                    expect(helper.invoke('getCell', [2, 4]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                    expect(helper.invoke('getCell', [3, 4]).style.backgroundColor).toBe('');
                    helper.edit('D2', '30');
                    helper.edit('E3', '15');
                    helper.edit('E4', '10');
                    setTimeout((): void => {
                        expect(helper.invoke('getCell', [1, 3]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                        expect(helper.invoke('getCell', [2, 4]).style.backgroundColor).toBe('');
                        expect(helper.invoke('getCell', [3, 4]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                        done();
                    });
                });
            });
        });
        describe('EJ2-72118 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: defaultData }] }]
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Console error on highlighting duplicate values in localization', (done: Function) => {
                helper.edit('H5', '27');
                helper.edit('H8', '66');
                helper.invoke('conditionalFormat', [{ type: 'Duplicate', cFColor: "RedFT", range: 'H2:H11' }]);
                expect(helper.invoke('getCell', [4, 7]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                expect(helper.invoke('getCell', [4, 7]).style.color).toBe('rgb(156, 0, 85)');
                expect(helper.invoke('getCell', [7, 7]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                expect(helper.invoke('getCell', [7, 7]).style.color).toBe('rgb(156, 0, 85)');
                helper.edit('G5', '7');
                helper.edit('G8', '13');
                helper.invoke('conditionalFormat', [{ type: 'Duplicate', cFColor: "YellowFT", range: 'G2:G11' }]);
                expect(helper.invoke('getCell', [3, 7]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                expect(helper.invoke('getCell', [3, 7]).style.color).toBe('rgb(156, 0, 85)');
                expect(helper.invoke('getCell', [6, 7]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                expect(helper.invoke('getCell', [6, 7]).style.color).toBe('rgb(156, 0, 85)');
                helper.edit('A3', 'Casual Shoes');
                helper.edit('A10', 'Loafers');
                helper.invoke('conditionalFormat', [{ type: 'Duplicate', cFColor: "GreenFT", range: 'A2:A11' }]);
                expect(helper.invoke('getCell', [2, 0]).style.backgroundColor).toBe('rgb(198, 239, 206)');
                expect(helper.invoke('getCell', [2, 0]).style.color).toBe('rgb(0, 97, 0)');
                expect(helper.invoke('getCell', [9, 0]).style.backgroundColor).toBe('rgb(198, 239, 206)');
                expect(helper.invoke('getCell', [9, 0]).style.color).toBe('rgb(0, 97, 0)');
                helper.invoke('conditionalFormat', [{ type: 'Unique', cFColor: "GreenFT", range: 'E2:E11' }]);
                expect(helper.invoke('getCell', [3, 4]).style.backgroundColor).toBe('rgb(198, 239, 206)');
                expect(helper.invoke('getCell', [3, 4]).style.color).toBe('rgb(0, 97, 0)');
                helper.invoke('conditionalFormat', [{ type: 'Unique', cFColor: "GreenFT", range: 'D2:D11' }]);
                expect(helper.invoke('getCell', [1, 3]).style.backgroundColor).toBe('rgb(198, 239, 206)');
                expect(helper.invoke('getCell', [1, 3]).style.color).toBe('rgb(0, 97, 0)');
                done();
            });
        });
        describe('EJ2-872953 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: defaultData }] }]
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Duplicate Values conditional formatting is not working correctly with empty cells.', (done: Function) => {
                helper.invoke('conditionalFormat', [{ type: 'Duplicate', cFColor: "RedFT", range: 'F2:F13' }]);
                expect(helper.invoke('getCell', [1, 5]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                expect(helper.invoke('getCell', [1, 5]).style.color).toBe('rgb(156, 0, 85)');
                expect(helper.invoke('getCell', [7, 5]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                expect(helper.invoke('getCell', [7, 5]).style.color).toBe('rgb(156, 0, 85)');
                helper.invoke('selectRange', ['F3']);
                helper.invoke('startEdit');
                helper.getInstance().editModule.editCellData.oldValue = helper.getInstance().sheets[0].rows[2].cells[5].value;
                helper.getInstance().editModule.editCellData.value = '';
                helper.invoke('endEdit');
                helper.invoke('selectRange', ['F8']);
                helper.invoke('startEdit');
                helper.getInstance().editModule.editCellData.oldValue = helper.getInstance().sheets[0].rows[7].cells[5].value;
                helper.getInstance().editModule.editCellData.value = '';
                helper.invoke('endEdit');
                expect(helper.invoke('getCell', [1, 5]).style.backgroundColor).toBe('');
                expect(helper.invoke('getCell', [1, 5]).style.color).toBe('');
                expect(helper.invoke('getCell', [7, 5]).style.backgroundColor).toBe('');
                expect(helper.invoke('getCell', [7, 5]).style.color).toBe('');
                expect(helper.invoke('getCell', [11, 5]).style.backgroundColor).toBe('');
                expect(helper.invoke('getCell', [11, 5]).style.color).toBe('');
                expect(helper.invoke('getCell', [12, 5]).style.backgroundColor).toBe('');
                expect(helper.invoke('getCell', [12, 5]).style.color).toBe('');
                helper.click('#spreadsheet_undo');
                expect(helper.invoke('getCell', [1, 5]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                expect(helper.invoke('getCell', [1, 5]).style.color).toBe('rgb(156, 0, 85)');
                expect(helper.invoke('getCell', [7, 5]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                expect(helper.invoke('getCell', [7, 5]).style.color).toBe('rgb(156, 0, 85)');
                helper.invoke('selectRange', ['F8']);
                helper.triggerKeyNativeEvent(46);
                expect(helper.invoke('getCell', [1, 5]).style.backgroundColor).toBe('');
                expect(helper.invoke('getCell', [1, 5]).style.color).toBe('');
                expect(helper.invoke('getCell', [7, 5]).style.backgroundColor).toBe('');
                expect(helper.invoke('getCell', [7, 5]).style.color).toBe('');
                done();
            });
        });

        describe('EJ2-910610 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{
                        conditionalFormats: [
                            {
                                type: "LessThan", cFColor: "GreenFT", value: '26', range: 'E1:E11',
                                format: {
                                    style: {
                                        backgroundColor: '#ffffff', color: '#000000', fontWeight: 'normal',
                                        fontStyle: 'normal', textDecoration: 'none'
                                    },
                                },
                            },
                            { type: "LessThan", cFColor: "RedF", value: '20', range: 'D2:D11' },
                        ], ranges: [{ dataSource: defaultData }]
                    }]
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Color scales back color and font color not updated properly while exporting the imported CF applied excel.', (done: Function) => {
                const spreadsheet: any = helper.getInstance();
                expect(spreadsheet.sheets[0].conditionalFormats[0].format).toBeDefined();
                // saveAsJson operation codes are used to replicate the case, since CI will not compatible with Worker task so invoking getStringifyObject method directly.
                const skipProps: string[] = ['dataSource', 'startCell', 'query', 'showFieldAsHeader'];
                for (let i: number = 0, sheetCount: number = spreadsheet.sheets.length; i < sheetCount; i++) {
                    spreadsheet.workbookSaveModule.getStringifyObject(spreadsheet.sheets[i], skipProps, i);
                }
                done();
            });
        });
    });
    describe('Apply conditional formatting with args.cancel in actionBegin event ->', () => {
        beforeEach((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ ranges: [{ dataSource: defaultData }] }], actionBegin: (args: {
                    args: {
                        eventArgs: any; cancel: boolean
                    }
                }) => {
                    args.args.eventArgs.cancel = true;
                },
            }, done);
        });
        afterEach(() => {
            helper.invoke('destroy');
        });
        it('Apply conditional formatting with args.cancel in actionBegin event. ->', (done: Function) => {
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-menu-item');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#cf_greaterthan_dlg').click();
            setTimeout((): void => {
                helper.setAnimationToNone('.e-conditionalformatting-dlg.e-dialog');
                const btn: HTMLButtonElement = helper.getElement('#' + helper.id + ' .e-conditionalformatting-dlg .e-primary.e-btn')
                expect(btn.disabled).toBeTruthy();
                const input: HTMLInputElement = helper.getElement('#' + helper.id + ' .e-conditionalformatting-dlg .e-cfmain .e-input') as HTMLInputElement;
                input.value = '300';
                const evt: Event = document.createEvent('Event');
                evt.initEvent('input', true, true); input.dispatchEvent(evt);
                btn.click();
                expect(helper.invoke('getCell', [1, 5]).style.backgroundColor).toBe('');
                expect(helper.invoke('getCell', [2, 5]).style.backgroundColor).toBe('');
                expect(helper.invoke('getCell', [2, 5]).style.color).toBe('');
                expect(helper.invoke('getCell', [6, 5]).style.backgroundColor).toBe('');
                expect(helper.invoke('getCell', [6, 5]).style.color).toBe('');
                done();
            });
        });
    });

    describe('EJ2-907552 ->', () => {
        beforeEach((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ ranges: [{ dataSource: defaultData }] }]
            }, done);
        });
        afterEach(() => {
            helper.invoke('destroy');
        });
        it('The icon set gets removed when applying the data bar to the same cells.', (done: Function) => {
            helper.invoke('conditionalFormat', [{ type: 'ThreeArrows', range: 'D2:D11' }]);
            expect(helper.invoke('getCell', [1, 3]).children[0].classList).toContain('e-3arrows-3');
            expect(helper.invoke('getCell', [5, 3]).children[0].classList).toContain('e-3arrows-2');
            expect(helper.invoke('getCell', [6, 3]).children[0].classList).toContain('e-3arrows-1');
            helper.invoke('conditionalFormat', [{ type: 'BlueDataBar', range: 'D2:D11' }]);
            expect(helper.invoke('getCell', [1, 3]).children[0].classList).toContain('e-3arrows-3');
            expect(helper.invoke('getCell', [5, 3]).children[0].classList).toContain('e-3arrows-2');
            expect(helper.invoke('getCell', [6, 3]).children[0].classList).toContain('e-3arrows-1');
            helper.invoke('selectRange', ['D2:D11']);
            helper.getElement('#' + helper.id + '_number_format').click();
            helper.getElement('#' + helper.id + '_Accounting').click();
            expect(helper.invoke('getCell', [1, 3]).children[0].classList).toContain('e-3arrows-3');
            expect(helper.invoke('getCell', [5, 3]).children[0].classList).toContain('e-3arrows-2');
            expect(helper.invoke('getCell', [6, 3]).children[0].classList).toContain('e-3arrows-1');
            done();
        });
        it('Equal to condition does not accept string values in Conditional formatting', (done: Function) => {
            helper.invoke('conditionalFormat', [{ type: "EqualTo", cFColor: 'RedFT', value: 'Quantity', range: 'D1:D12' }]);
            expect(helper.invoke('getCell', [0, 3]).style.color).toBe('rgb(156, 0, 85)');
            expect(helper.invoke('getCell', [11, 3]).style.color).toBe('');
            helper.invoke('updateCell', [{ value: '0' }, 'E21']);
            helper.invoke('conditionalFormat', [{ type: "EqualTo", cFColor: 'RedFT', value: '0', range: 'E1:E13' }]);
            expect(helper.invoke('getCell', [11, 4]).style.color).toBe('rgb(156, 0, 85)');
            expect(helper.invoke('getCell', [12, 4]).style.color).toBe('rgb(156, 0, 85)');
            helper.invoke('conditionalFormat', [{ type: "EqualTo", cFColor: 'RedFT', value: '1210', range: 'F1:F12' }]);
            expect(helper.invoke('getCell', [9, 5]).style.color).toBe('rgb(156, 0, 85)');
            helper.invoke('conditionalFormat', [{ type: "EqualTo", cFColor: 'RedFT', value: '', range: 'G1:G12' }]);
            expect(helper.invoke('getCell', [0, 6]).style.color).toBe('');
            expect(helper.invoke('getCell', [1, 6]).style.color).toBe('');
            expect(helper.invoke('getCell', [11, 6]).style.color).toBe('');
            done();
        });
    });

    describe('Cf applied for text format ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ ranges: [{ dataSource: defaultData }] }]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('icon sets cf', (done: Function) => {
            helper.invoke('selectRange', ['H1:H11']);
            helper.getElement('#' + helper.id + '_number_format').click();
            helper.getElement('#' + helper.id + '_Text').click();
            setTimeout(() => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[1].cells[7].value.toString()).toBe('10');
                expect(spreadsheet.sheets[0].rows[1].cells[7].format).toBe('@');
                helper.getElement('#' + helper.id + '_conditionalformatting').click();
                const target: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-iconsets');
                (getComponent(target.parentElement.parentElement, 'menu') as any).animationSettings.effect = 'None';
                helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
                setTimeout(() => {
                    helper.getElement('#ThreeArrows').click();
                    expect(helper.invoke('getCell', [1, 7]).children.length === 0);
                    done();
                }, 100);
            });
        });
        it('icon sets cf with number format', (done: Function) => {
            helper.invoke('selectRange', ['H6']);
            helper.getElement('#' + helper.id + '_number_format').click();
            helper.getElement('#' + helper.id + '_Number').click();
            setTimeout(() => {
                expect(helper.invoke('getCell', [5, 7]).children[0].classList.contains('e-3arrows-1'));
                expect(helper.invoke('getCell', [1, 7]).children.length === 0);
                helper.invoke('selectRange', ['H2']);
                helper.getElement('#' + helper.id + '_number_format').click();
                helper.getElement('#' + helper.id + '_General').click();
                setTimeout(() => {
                    expect(helper.invoke('getCell', [1, 7]).children[0].classList.contains('e-3arrows-3'));
                    done();
                });
            });
        });
        it('icon sets cf with number format-1', (done: Function) => {
            helper.invoke('selectRange', ['H1:H11']);
            helper.getElement('#' + helper.id + '_number_format').click();
            helper.getElement('#' + helper.id + '_Currency').click();
            setTimeout(() => {
                expect(helper.invoke('getCell', [9, 7]).children[0].classList.contains('e-3arrows-1'));
                helper.invoke('selectRange', ['H10']);
                helper.getElement('#' + helper.id + '_number_format').click();
                helper.getElement('#' + helper.id + '_Text').click();
                setTimeout(() => {
                    expect(helper.invoke('getCell', [9, 7]).children.length === 0);
                    done();
                });
            });
        });
        it('Data bars cf', (done: Function) => {
            helper.invoke('clear', [{ type: 'Clear Formats', range: 'H1:H11' }]);
            helper.invoke('selectRange', ['F1:F11']);
            helper.getElement('#' + helper.id + '_number_format').click();
            helper.getElement('#' + helper.id + '_Text').click();
            setTimeout(() => {
                helper.getElement('#' + helper.id + '_conditionalformatting').click();
                const target: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-databars');
                (getComponent(target.parentElement.parentElement, 'menu') as any).animationSettings.effect = 'None';
                helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
                setTimeout(() => {
                    helper.getElement('#BlueDataBar').click();
                    expect(helper.invoke('getCell', [1, 5]).querySelector('.e-databar')).toBeNull();
                    done();
                });
            });
        });
        it('Data bars cf with number format', (done: Function) => {
            helper.invoke('selectRange', ['F7']);
            helper.getElement('#' + helper.id + '_number_format').click();
            helper.getElement('#' + helper.id + '_Number').click();
            setTimeout(() => {
                expect(helper.invoke('getCell', [6, 5]).getElementsByClassName('e-databar')[1].style.backgroundColor).toBe('rgb(90, 138, 198)');
                helper.invoke('selectRange', ['F4']);
                helper.getElement('#' + helper.id + '_number_format').click();
                helper.getElement('#' + helper.id + '_General').click();
                setTimeout(() => {
                    expect(helper.invoke('getCell', [3, 5]).getElementsByClassName('e-databar')[1].style.backgroundColor).toBe('rgb(90, 138, 198)');
                    helper.invoke('selectRange', ['F7']);
                    helper.getElement('#' + helper.id + '_number_format').click();
                    helper.getElement('#' + helper.id + '_Text').click();
                    setTimeout(() => {
                        expect(helper.invoke('getCell', [6, 5]).querySelector('.e-databar')).toBeNull();
                        done();
                    });
                });
            });
        });
        it('Top 10 Items cf->', (done: Function) => {
            helper.invoke('clear', [{ type: 'Clear Formats', range: 'F1:F11' }]);
            helper.invoke('selectRange', ['B1:B11']);
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-topbottomrules');
            (getComponent(target.parentElement.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#cf_top10items_dlg').click();
            setTimeout((): void => {
                helper.setAnimationToNone('.e-conditionalformatting-dlg.e-dialog');
                helper.getElements('.e-conditionalformatting-dlg .e-cfmain .e-input .e-numerictextbox').value = '10';
                helper.click(' .e-conditionalformatting-dlg .e-footer-content button:nth-child(1)');
                expect(helper.invoke('getCell', [2, 1]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                expect(helper.invoke('getCell', [8, 1]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                done();
            });
        });
        it('Top 10 Items with number format', (done: Function) => {
            helper.getElement('#' + helper.id + '_number_format').click();
            helper.getElement('#' + helper.id + '_Text').click();
            setTimeout(() => {
                expect(helper.invoke('getCell', [2, 1]).style.backgroundColor).toBe('');
                expect(helper.invoke('getCell', [8, 1]).style.backgroundColor).toBe('');
                done();
            });
        });
    });

    describe('EJ2-907559 ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{
                    conditionalFormats: [
                        { type: "LessThan", cFColor: "RedFT", value: '1000', range: 'F1:F100' },
                        { type: 'GYRColorScale', range: 'F1:F100' }
                    ],
                    ranges: [{ dataSource: defaultData }],
                }, {}]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('The colorscale and Less than CF applied to the same range not working properly', (done: Function) => {
            expect(helper.invoke('getCell', [7, 5]).style.backgroundColor).toBe('rgb(250, 157, 117)');
            expect(helper.invoke('getCell', [9, 5]).style.backgroundColor).toBe('rgb(99, 190, 123)');
            expect(helper.invoke('getCell', [10, 5]).style.backgroundColor).toBe('rgb(192, 217, 128)');
            expect(helper.invoke('getCell', [11, 5]).style.backgroundColor).toBe('rgb(255, 199, 206)');
            expect(helper.invoke('getCell', [11, 5]).style.backgroundColor).toBe('rgb(255, 199, 206)');
            expect(helper.invoke('getCell', [11, 5]).style.backgroundColor).toBe('rgb(255, 199, 206)');
            expect(helper.invoke('getCell', [12, 5]).style.backgroundColor).toBe('rgb(255, 199, 206)');
            expect(helper.invoke('getCell', [13, 5]).style.backgroundColor).toBe('rgb(255, 199, 206)');
            expect(helper.invoke('getCell', [14, 5]).style.backgroundColor).toBe('rgb(255, 199, 206)');
            expect(helper.invoke('getCell', [15, 5]).style.backgroundColor).toBe('rgb(255, 199, 206)');
            done();
        });
        it('The colorscale and Less than CF applied to the same range not working properly - 1', (done: Function) => {
            helper.invoke('goTo', ['Sheet1!F70']);
            setTimeout(() => {
                expect(helper.invoke('getCell', [69, 5]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                expect(helper.invoke('getCell', [70, 5]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                expect(helper.invoke('getCell', [71, 5]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                done();
            }, 100);
        });
        it('The colorscale and Less than CF applied to the same range not working properly - 1', (done: Function) => {
            helper.invoke('goTo', ['Sheet1!F1']);
            setTimeout(() => {
                expect(helper.invoke('getCell', [7, 5]).style.backgroundColor).toBe('rgb(250, 157, 117)');
                expect(helper.invoke('getCell', [9, 5]).style.backgroundColor).toBe('rgb(99, 190, 123)');
                expect(helper.invoke('getCell', [10, 5]).style.backgroundColor).toBe('rgb(192, 217, 128)');
                expect(helper.invoke('getCell', [11, 5]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                expect(helper.invoke('getCell', [11, 5]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                expect(helper.invoke('getCell', [11, 5]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                expect(helper.invoke('getCell', [12, 5]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                expect(helper.invoke('getCell', [13, 5]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                expect(helper.invoke('getCell', [14, 5]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                expect(helper.invoke('getCell', [15, 5]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                helper.edit('F14', '200');
                helper.edit('F15', '1210');
                helper.edit('F16', '200');
                helper.edit('F17', '500');
                expect(helper.invoke('getCell', [13, 5]).style.backgroundColor).toBe('rgb(251, 179, 121)');
                expect(helper.invoke('getCell', [14, 5]).style.backgroundColor).toBe('rgb(99, 190, 123)');
                expect(helper.invoke('getCell', [15, 5]).style.backgroundColor).toBe('rgb(251, 179, 121)');
                expect(helper.invoke('getCell', [16, 5]).style.backgroundColor).toBe('rgb(188, 215, 128)');
                done();
            }, 100);
        });
    });

    describe('Cf with bg-color ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ ranges: [{ dataSource: defaultData }] }]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Apply color scales cf', (done: Function) => {
            helper.invoke('selectRange', ['H1:H15']);
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-colorscales');
            (getComponent(target.parentElement.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            setTimeout((): void => {
                helper.getElement('#GYRColorScale').click();
                expect(helper.invoke('getCell', [0, 7]).style.backgroundColor).toBe('');
                expect(helper.invoke('getCell', [4, 7]).style.backgroundColor).toBe('rgb(161, 208, 126)');
                expect(helper.invoke('getCell', [11, 7]).style.backgroundColor).toBe('');
                done();
            });
        });
        it('color scales cf with fill color', (done: Function) => {
            helper.click('_fill_color_picker .e-dropdown-btn');
            helper.click('.e-colorpicker-popup.e-popup-open span[aria-label="#00ff00ff"]');
            setTimeout((): void => {
                expect(helper.invoke('getCell', [0, 7]).style.backgroundColor).toBe('rgb(0, 255, 0)');
                expect(helper.invoke('getCell', [4, 7]).style.backgroundColor).toBe('rgb(161, 208, 126)');
                expect(helper.invoke('getCell', [11, 7]).style.backgroundColor).toBe('rgb(0, 255, 0)');
                done();
            });
        });
    });

    describe('875062-Cf with resizing ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ ranges: [{ dataSource: defaultData }] }]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('check red Databars cf height ', (done: Function) => {
            helper.invoke('selectRange', ['H1:H11']);
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-databars');
            (getComponent(target.parentElement.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            setTimeout(() => {
                helper.getElement('#RedDataBar').click();
                expect(helper.invoke('getCell', [1, 7]).getElementsByClassName('e-databar')[1].style.height).toBe('17px');
                expect(helper.invoke('getCell', [1, 7]).getElementsByClassName('e-databar')[1].style.width).toBe('7%');
                expect(helper.invoke('getCell', [5, 7]).getElementsByClassName('e-databar')[1].style.height).toBe('17px');
                expect(helper.invoke('getCell', [5, 7]).getElementsByClassName('e-databar')[1].style.width).toBe('43%');
                done();
            });
        });
        it('check blue Databars cf height ', (done: Function) => {
            helper.invoke('selectRange', ['F4:F11']);
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-databars');
            (getComponent(target.parentElement.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            setTimeout(() => {
                helper.getElement('#BlueDataBar').click();
                expect(helper.invoke('getCell', [3, 5]).getElementsByClassName('e-databar')[1].style.height).toBe('17px');
                expect(helper.invoke('getCell', [3, 5]).getElementsByClassName('e-databar')[1].style.width).toBe('25%');
                expect(helper.invoke('getCell', [6, 5]).getElementsByClassName('e-databar')[1].style.height).toBe('17px');
                expect(helper.invoke('getCell', [6, 5]).getElementsByClassName('e-databar')[1].style.width).toBe('67%');
                done();
            });
        });
        it('Resize the cf rows', (done: Function) => {
            helper.invoke('selectRange', ['A3']);
            const spreadsheet: Spreadsheet = helper.getInstance();
            const rowHdr: HTMLElement = helper.invoke('getRowHeaderTable').rows[2].cells[0];
            const rowHdrPanel: HTMLElement = helper.invoke('getRowHeaderContent');
            const offset: DOMRect = rowHdr.getBoundingClientRect() as DOMRect;
            helper.triggerMouseAction('mousemove', { x: offset.top + 0.5, y: offset.left + 1, offsetY: 3 }, rowHdrPanel, rowHdr);
            helper.triggerMouseAction('mousedown', { x: offset.left + 1, y: offset.top + 0.5, offsetY: 3 }, rowHdrPanel, rowHdr);
            helper.triggerMouseAction('mousemove', { x: offset.left + 1, y: offset.top + 50, offsetY: 3 }, spreadsheet.element, rowHdr);
            helper.triggerMouseAction('mouseup', { x: offset.left + 1, y: offset.top + 50, offsetY: 3 }, document, rowHdr);
            setTimeout(() => {
                expect(helper.invoke('getCell', [1, 7]).getElementsByClassName('e-databar')[1].style.height).toBe('66px');
                expect(helper.invoke('getCell', [1, 7]).getElementsByClassName('e-databar')[1].style.width).toBe('7%');
                done();
            });
        });
        it(' Hide and show the cf rows.', function (done) {
            var spreadsheet = helper.getInstance();
            spreadsheet.hideRow(3, 3, true);
            var rowHdr = helper.invoke('getRowHeaderTable').rows[3].cells[0];
            var rowHdrPanel = helper.invoke('getRowHeaderContent');
            var offset = rowHdr.getBoundingClientRect();
            helper.triggerMouseAction('mousemove', { x: offset.top - 0.5, y: offset.left - 1, offsetY: 3 }, rowHdrPanel, rowHdr);
            helper.triggerMouseAction('mousedown', { x: offset.left - 1, y: offset.top - 0.5, offsetY: 3 }, rowHdrPanel, rowHdr);
            helper.triggerMouseAction('mousemove', { x: offset.left - 1, y: offset.top + 60, offsetY: 7 }, spreadsheet.element, rowHdr);
            helper.triggerMouseAction('mouseup', { x: offset.left - 1, y: offset.top + 60, offsetY: 7 }, document, rowHdr);
            setTimeout(function () {
                expect(helper.invoke('getCell', [3, 5]).getElementsByClassName('e-databar')[1].style.height).toBe('77px');
                expect(helper.invoke('getCell', [3, 5]).getElementsByClassName('e-databar')[1].style.width).toBe('25%');
                expect(helper.invoke('getCell', [3, 7]).getElementsByClassName('e-databar')[1].style.height).toBe('77px');
                expect(helper.invoke('getCell', [3, 7]).getElementsByClassName('e-databar')[1].style.width).toBe('17%');
                done();
            });
        });
    });
    
    describe('EJ2-907552 ->', () => {
        beforeEach((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ ranges: [{ dataSource: defaultData }] }]
            }, done);
        });
        afterEach(() => {
            helper.invoke('destroy');
        });
        it('The icon set gets removed when applying the data bar to the same cells.', (done: Function) => {
            helper.invoke('conditionalFormat', [{ type: 'ThreeArrows', range: 'D2:D11' }]);
            expect(helper.invoke('getCell', [1, 3]).children[0].classList).toContain('e-3arrows-3');
            expect(helper.invoke('getCell', [5, 3]).children[0].classList).toContain('e-3arrows-2');
            expect(helper.invoke('getCell', [6, 3]).children[0].classList).toContain('e-3arrows-1');
            helper.invoke('conditionalFormat', [{ type: 'BlueDataBar', range: 'D2:D11' }]);
            expect(helper.invoke('getCell', [1, 3]).children[0].classList).toContain('e-3arrows-3');
            expect(helper.invoke('getCell', [5, 3]).children[0].classList).toContain('e-3arrows-2');
            expect(helper.invoke('getCell', [6, 3]).children[0].classList).toContain('e-3arrows-1');
            helper.invoke('selectRange', ['D2:D11']);
            helper.getElement('#' + helper.id + '_number_format').click();
            helper.getElement('#' + helper.id + '_Accounting').click();
            expect(helper.invoke('getCell', [1, 3]).children[0].classList).toContain('e-3arrows-3');
            expect(helper.invoke('getCell', [5, 3]).children[0].classList).toContain('e-3arrows-2');
            expect(helper.invoke('getCell', [6, 3]).children[0].classList).toContain('e-3arrows-1');
            done();
        });
        it('EJ2-923136 - Less than conditional formatting not applied for string', (done: Function) => {
            helper.invoke('conditionalFormat', [{ type: 'LessThan', cFColor: 'RedFT', value: 'Sync', range: 'H2' }]);
            expect(helper.invoke('getCell', [1, 7]).style.backgroundColor).toContain('rgb(255, 199, 206)');
            helper.invoke('conditionalFormat', [{ type: 'LessThan', cFColor: 'RedFT', value: 'Fusion', range: 'I1' }]);
            expect(helper.invoke('getCell', [0, 8]).style.backgroundColor).toContain('rgb(255, 199, 206)');
            helper.invoke('conditionalFormat', [{ type: 'LessThan', cFColor: 'RedFT', value: '1', range: 'I2' }]);
            expect(helper.invoke('getCell', [1, 8]).style.backgroundColor).toContain('rgb(255, 199, 206)');
            helper.invoke('conditionalFormat', [{ type: 'LessThan', cFColor: 'RedFT', value: '11:00:00', range: 'G1' }]);
            helper.invoke('conditionalFormat', [{ type: 'LessThan', cFColor: 'RedFT', value: 'Syncfusion', range: 'H1' }]);
            expect(helper.invoke('getCell', [0, 7]).style.backgroundColor).toContain('rgb(255, 199, 206)');
            done();
        });
    });
    
    describe(' Check cf apply for text ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ ranges: [{ dataSource: defaultData }] }]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Apply icon sets conditional format', (done: Function) => {
            helper.edit('A2', '7 Series');
            helper.edit('A3', '4Runner');
            expect(helper.invoke('getCell', [1, 0]).textContent).toBe('7 Series');
            helper.invoke('selectRange', ['A1:H11']);
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-iconsets');
            (getComponent(target.parentElement.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            setTimeout((): void => {
                helper.getElement('#ThreeArrows').click();
                expect(helper.invoke('getCell', [1, 0]).children.length === 0);
                expect(helper.invoke('getCell', [2, 0]).children.length === 0);
                expect(helper.invoke('getCell', [1, 1]).children[0].classList.contains('e-iconsetspan'));
                done();
            });
        });
        it('Apply color scales conditional format', (done: Function) => {
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-colorscales');
            (getComponent(target.parentElement.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            setTimeout((): void => {
                helper.getElement('#GYRColorScale').click();
                expect(helper.invoke('getCell', [1, 0]).children.length === 0);
                expect(helper.invoke('getCell', [2, 0]).children.length === 0);
                expect(helper.invoke('getCell', [1, 3]).style.backgroundColor).toBe('rgb(252, 190, 123)');
                done();
            });
        });
        it('Apply Top 10 Items->', (done: Function) => {
            helper.invoke('clear', [{ type: 'Clear Formats', range: 'A1:H11' }]);
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-topbottomrules');
            (getComponent(target.parentElement.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#cf_top10items_dlg').click();
            setTimeout((): void => {
                helper.setAnimationToNone('.e-conditionalformatting-dlg.e-dialog');
                helper.getElements('.e-conditionalformatting-dlg .e-cfmain .e-input .e-numerictextbox').value = '10';
                helper.click(' .e-conditionalformatting-dlg .e-footer-content button:nth-child(1)');
                expect(helper.invoke('getCell', [1, 0]).style.backgroundColor).toBe('');
                expect(helper.invoke('getCell', [2, 0]).style.backgroundColor).toBe('');
                expect(helper.invoke('getCell', [1, 1]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                done();
            });
        });
        it('Apply Below Average->', (done: Function) => {
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-topbottomrules');
            (getComponent(target.parentElement.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#cf_belowaverage_dlg').click();
            setTimeout((): void => {
                helper.setAnimationToNone('.e-conditionalformatting-dlg.e-dialog');
                helper.click(' .e-conditionalformatting-dlg .e-footer-content button:nth-child(1)');
                expect(helper.invoke('getCell', [1, 0]).style.backgroundColor).toBe('');
                expect(helper.invoke('getCell', [2, 0]).style.backgroundColor).toBe('');
                expect(helper.invoke('getCell', [3, 3]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                done();
            });
        });
    });

    describe('831832 - Cf with hyperlink->', () => {
        let spreadsheet: any;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ ranges: [{ dataSource: defaultData }] }]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Apply cf - color scale ->', (done: Function) => {
            helper.invoke('selectRange', ['H1:H11']);
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-colorscales');
            (getComponent(target.parentElement.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            setTimeout((): void => {
                helper.getElement('#GYRColorScale').click();
                expect(helper.invoke('getCell', [1, 7]).style.backgroundColor).toBe('rgb(248, 105, 107)');
                done();
            });
        });
        it('Insert hyperlink', (done: Function) => {
            helper.switchRibbonTab(2);
            helper.getElementFromSpreadsheet('#' + helper.id + '_hyperlink').click();
            setTimeout(() => {
                helper.getElements('.e-hyperlink-dlg .e-webpage input')[1].value = 'www.google.com';
                helper.triggerKeyEvent('keyup', 88, null, null, null, helper.getElements('.e-hyperlink-dlg .e-webpage input')[1]);
                helper.setAnimationToNone('.e-hyperlink-dlg.e-dialog');
                helper.click('.e-hyperlink-dlg .e-footer-content button:nth-child(1)');
                spreadsheet = helper.getInstance();
                let sheet: any = spreadsheet.sheets[0];
                expect(sheet.rows[1].cells[7].hyperlink.address).toBe('http://www.google.com');
                const td: HTMLElement = helper.invoke('getCell', [1, 7]).children[0];
                expect(td.classList).toContain('e-hyperlink');
                expect(td.classList).toContain('e-hyperlink-style');
                expect(td.tagName).toBe('A');
                expect(td.getAttribute('href')).toBe('http://www.google.com');
                done();
            });
        });
        it('Cf with Undo action', (done: Function) => {
            helper.switchRibbonTab(1);
            spreadsheet = helper.getInstance();
            helper.getElement('#' + helper.id + '_undo').click();
            expect(helper.invoke('getCell', [1, 7]).style.backgroundColor).toBe('rgb(248, 105, 107)');
            expect(helper.invoke('getCell', [1, 7]).children.length).toBe(0);
            done();
        });
        it('cf with Redo action', (done: Function) => {
            spreadsheet = helper.getInstance();
            helper.getElement('#' + helper.id + '_redo').click();
            expect(helper.invoke('getCell', [1, 7]).style.backgroundColor).toBe('rgb(248, 105, 107)');
            let sheet: any = spreadsheet.sheets[0];
            expect(sheet.rows[1].cells[7].hyperlink.address).toBe('http://www.google.com');
            const td: HTMLElement = helper.invoke('getCell', [1, 7]).children[0];
            expect(td.classList).toContain('e-hyperlink');
            expect(td.classList).toContain('e-hyperlink-style');
            expect(td.tagName).toBe('A');
            expect(td.getAttribute('href')).toBe('http://www.google.com');
            done();
        });
    });

    describe('Cf with find and replace ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ ranges: [{ dataSource: defaultData }] }]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('find and replaceAll with icon sets cf', (done: Function) => {
            helper.invoke('selectRange', ['H1:H11']);
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-iconsets');
            (getComponent(target.parentElement.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            setTimeout(() => {
                helper.getElement('#ThreeArrows').click();
                expect(helper.invoke('getCell', [9, 7]).children[0].classList.contains('e-3arrows-1'));
                done();
            });
        });
        it('find and replaceAll with icon sets cf-1', (done: Function) => {
            helper.click('#' + helper.id + '_findbtn');
            setTimeout(() => {
                helper.click('.e-findtool-dlg .e-findRib-more');
                setTimeout(() => {
                    helper.setAnimationToNone('.e-find-dlg.e-dialog');
                    const findTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-find-dlg .e-text-findNext') as HTMLInputElement;
                    findTxtBox.value = '166';
                    helper.triggerKeyEvent('keyup', 88, null, null, null, findTxtBox);
                    const replaceTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-find-dlg .e-text-replaceInp') as HTMLInputElement;
                    replaceTxtBox.value = '6000';
                    helper.triggerKeyEvent('keyup', 88, null, null, null, replaceTxtBox);
                    let target: any = helper.getElements('.e-find-dlg .e-search-within .e-dropdownlist')[0];
                    target.ej2_instances[0].value = 'Sheet';
                    target.ej2_instances[0].dataBind();
                    setTimeout(() => {
                        helper.click('.e-find-dlg .e-findnreplace-checkmatch');
                        helper.click('.e-find-dlg .e-btn-replaceAll');
                        setTimeout(() => {
                            const spreadsheet: Spreadsheet = helper.getInstance();
                            expect(spreadsheet.sheets[0].rows[9].cells[7].value.toString()).toBe('6000');
                            expect(helper.invoke('getCell', [9, 7]).children[0].classList.contains('e-3arrows-1'));
                            done();
                        }, 200);
                    });
                });
            });
        });
        it('find and replace with icon sets cf', (done: Function) => {
            const findTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-find-dlg .e-text-findNext') as HTMLInputElement;
            findTxtBox.value = '67';
            helper.triggerKeyEvent('keyup', 88, null, null, null, findTxtBox);
            const replaceTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-find-dlg .e-text-replaceInp') as HTMLInputElement;
            replaceTxtBox.value = '5000';
            helper.triggerKeyEvent('keyup', 88, null, null, null, replaceTxtBox);
            helper.click('.e-find-dlg .e-btn-replace');
            setTimeout(() => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[4].cells[7].value.toString()).toBe('5000');
                expect(helper.invoke('getCell', [4, 7]).children[0].classList.contains('e-3arrows-1'));
                helper.click('.e-find-dlg .e-dlg-closeicon-btn');
                done();
            });
        });
        it('find and replaceAll with color scales cf', (done: Function) => {
            helper.invoke('selectRange', ['F1:F11']);
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-colorscales');
            (getComponent(target.parentElement.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            setTimeout((): void => {
                helper.getElement('#GYRColorScale').click();
                expect(helper.invoke('getCell', [6, 5]).style.backgroundColor).toBe('rgb(130, 199, 124)');
                done();
            });
        });
        it('find and replaceAll with color scales cf-1', (done: Function) => {
            helper.click('#' + helper.id + '_findbtn');
            setTimeout(() => {
                helper.click('.e-findtool-dlg .e-findRib-more');
                setTimeout(() => {
                    helper.setAnimationToNone('.e-find-dlg.e-dialog');
                    const findTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-find-dlg .e-text-findNext') as HTMLInputElement;
                    findTxtBox.value = '800';
                    helper.triggerKeyEvent('keyup', 88, null, null, null, findTxtBox);
                    const replaceTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-find-dlg .e-text-replaceInp') as HTMLInputElement;
                    replaceTxtBox.value = '8000';
                    helper.triggerKeyEvent('keyup', 88, null, null, null, replaceTxtBox);
                    let target: any = helper.getElements('.e-find-dlg .e-search-within .e-dropdownlist')[0];
                    target.ej2_instances[0].value = 'Sheet';
                    target.ej2_instances[0].dataBind();
                    setTimeout(() => {
                        helper.click('.e-find-dlg .e-findnreplace-checkmatch');
                        helper.click('.e-find-dlg .e-btn-replaceAll');
                        setTimeout(() => {
                            const spreadsheet: Spreadsheet = helper.getInstance();
                            expect(spreadsheet.sheets[0].rows[6].cells[5].value.toString()).toBe('8000');
                            expect(helper.invoke('getCell', [6, 5]).style.backgroundColor).toBe('rgb(99, 190, 123)');
                            done();
                        }, 200);
                    });
                });
            });
        });
        it('find and replace with color scales cf', (done: Function) => {
            const findTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-find-dlg .e-text-findNext') as HTMLInputElement;
            findTxtBox.value = '1210';
            helper.triggerKeyEvent('keyup', 88, null, null, null, findTxtBox);
            const replaceTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-find-dlg .e-text-replaceInp') as HTMLInputElement;
            replaceTxtBox.value = '2000';
            helper.triggerKeyEvent('keyup', 88, null, null, null, replaceTxtBox);
            helper.click('.e-find-dlg .e-btn-replace');
            setTimeout(() => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[9].cells[5].value.toString()).toBe('2000');
                expect(helper.invoke('getCell', [9, 5]).style.backgroundColor).toBe('rgb(130, 199, 124)');
                helper.click('.e-find-dlg .e-dlg-closeicon-btn');
                done();
            });
        });
        it('find and replace with EqualTo cf', (done: Function) => {
            helper.invoke('selectRange', ['D1:D11']);
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-menu-item');
            (getComponent(target.parentElement, 'menu')as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#cf_eqaulto_dlg').click();
            setTimeout((): void => {
                helper.setAnimationToNone('.e-conditionalformatting-dlg.e-dialog');
                const btn: HTMLButtonElement = helper.getElement('#' + helper.id + ' .e-conditionalformatting-dlg .e-primary.e-btn')
                expect(btn.disabled).toBeTruthy();
                const input: HTMLInputElement = helper.getElement('#' + helper.id + ' .e-conditionalformatting-dlg .e-cfmain .e-input') as HTMLInputElement;
                input.value = '41';
                const evt: Event = document.createEvent('Event');
                evt.initEvent('input', true, true); input.dispatchEvent(evt);
                btn.click();
                expect(helper.invoke('getCell', [9, 3]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                done();
            });
        });
        it('find and replace with EqualTo cf-1', (done: Function) => {
            helper.click('#' + helper.id + '_findbtn');
            setTimeout(() => {
                helper.click('.e-findtool-dlg .e-findRib-more');
                setTimeout(() => {
                    helper.setAnimationToNone('.e-find-dlg.e-dialog');
                    const findTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-find-dlg .e-text-findNext') as HTMLInputElement;
                    findTxtBox.value = '41';
                    helper.triggerKeyEvent('keyup', 88, null, null, null, findTxtBox);
                    const replaceTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-find-dlg .e-text-replaceInp') as HTMLInputElement;
                    replaceTxtBox.value = '1810';
                    helper.triggerKeyEvent('keyup', 88, null, null, null, replaceTxtBox);
                    let target: any = helper.getElements('.e-find-dlg .e-search-within .e-dropdownlist')[0];
                    target.ej2_instances[0].value = 'Sheet';
                    target.ej2_instances[0].dataBind();
                    setTimeout(() => {
                        helper.click('.e-find-dlg .e-btn-replace');
                        const spreadsheet: Spreadsheet = helper.getInstance();
                        expect(spreadsheet.sheets[0].rows[9].cells[3].value.toString()).toBe('1810');
                        expect(helper.invoke('getCell', [9, 3]).style.backgroundColor).toBe('');
                        done();
                    });
                });
            });
        });
        it('find and replace with EqualTo cf-2', (done: Function) => {
            const findTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-find-dlg .e-text-findNext') as HTMLInputElement;
            findTxtBox.value = '1810';
            helper.triggerKeyEvent('keyup', 88, null, null, null, findTxtBox);
            const replaceTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-find-dlg .e-text-replaceInp') as HTMLInputElement;
            replaceTxtBox.value = '41';
            helper.triggerKeyEvent('keyup', 88, null, null, null, replaceTxtBox);
            helper.click('.e-find-dlg .e-btn-replace');
            setTimeout(() => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[9].cells[3].value.toString()).toBe('41');
                expect(helper.invoke('getCell', [9, 3]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                done();
            });
        });
    });

    describe(' AutoFill with conditional formatting ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{
                conditionalFormats: [
                  { type: "GreaterThan", cFColor: "GreenFT", value:'55', range: 'H1:H11' },
                ],
                ranges: [{
                    dataSource: defaultData
                }],
            }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Apply autoFill', (done: Function) => {
            helper.invoke('selectRange', ['H11']);
            const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
            let td: HTMLElement = helper.invoke('getCell', [14, 7]);
            let coords = td.getBoundingClientRect();
            let autoFillCoords = autoFill.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
            helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
            helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
            helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
            const instance: any = helper.getInstance();
            expect(instance.selectionModule.dAutoFillCell).toBe('H11:H11');
            expect(helper.invoke('getCell', [11, 7]).textContent).toBe('56');
            helper.click('#spreadsheet_autofilloptionbtn');
            helper.click('.e-dragfill-ddb ul li:nth-child(1)');
            td = helper.invoke('getCell', [13, 7]);
            expect(td.textContent).toBe('55');
            done();
        });
        it('Undo action', () => {
            helper.getElement('#' + helper.id + '_undo').click();
            expect(helper.invoke('getCell', [14, 7]).textContent).toBe('');
        });
        it('Redo action', () => {
            helper.getElement('#' + helper.id + '_redo').click();
            expect(helper.invoke('getCell', [14, 7]).textContent).toBe('55');
        });
    });

    describe(' AutoFill with conditional formatting for same cells ->', () => {
        let spreadsheet: Spreadsheet;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{
                conditionalFormats: [
                  { type: "GreaterThan", cFColor: "GreenFT", value:'20', range: 'H1:H11' },
                ],
                ranges: [{
                    dataSource: defaultData
                }],
            }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Value check', () => {
            expect(helper.invoke('getCell', [3, 7]).style.backgroundColor).toBe('rgb(198, 239, 206)');
        });
        it('Apply autoFill', (done: Function) => {
            helper.invoke('conditionalFormat', [{ type: "GreaterThan", cFColor: 'RedFT', value: '20', range: 'H2:H10' }]);
            expect(helper.invoke('getCell', [3, 7]).style.backgroundColor).toBe('rgb(255, 199, 206)');
            helper.invoke('selectRange', ['H10']);
            const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
            let td: HTMLElement = helper.invoke('getCell', [15, 7]);
            let coords = td.getBoundingClientRect();
            let autoFillCoords = autoFill.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
            helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
            helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
            helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
            const instance: any = helper.getInstance();
            expect(instance.selectionModule.dAutoFillCell).toBe('H10:H10');
            expect(helper.invoke('getCell', [14, 7]).style.backgroundColor).toBe('rgb(255, 199, 206)');
            helper.click('#spreadsheet_autofilloptionbtn');
            helper.click('.e-dragfill-ddb ul li:nth-child(1)');
            td = helper.invoke('getCell', [13, 7]);
            expect(td.textContent).toBe('166');
            done();
        });
        it('Undo action', () => {
            helper.getElement('#' + helper.id + '_undo').click();
            expect(helper.invoke('getCell', [14, 7]).textContent).toBe('');
        });
        it('Redo action', () => {
            helper.getElement('#' + helper.id + '_redo').click();
            expect(helper.invoke('getCell', [14, 7]).textContent).toBe('166');
        });
        it('Undo action-1', () => {
            helper.getElement('#' + helper.id + '_undo').click();
            expect(helper.invoke('getCell', [14, 7]).textContent).toBe('');
        });
        it('Apply autoFill-1', (done: Function) => {
            helper.invoke('selectRange', ['H11']);
            const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
            let td: HTMLElement = helper.invoke('getCell', [15, 7]);
            let coords = td.getBoundingClientRect();
            let autoFillCoords = autoFill.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
            helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
            helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
            helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
            const instance: any = helper.getInstance();
            expect(instance.selectionModule.dAutoFillCell).toBe('H11:H11');
            expect(helper.invoke('getCell', [14, 7]).style.backgroundColor).toBe('rgb(198, 239, 206)');
            helper.click('#spreadsheet_autofilloptionbtn');
            helper.click('.e-dragfill-ddb ul li:nth-child(1)');
            td = helper.invoke('getCell', [13, 7]);
            expect(td.textContent).toBe('55');
            done();
        });
        it('Apply CF', (done: Function) => {
            spreadsheet = helper.getInstance();
            spreadsheet.activeSheetIndex = 0;
            spreadsheet.dataBind();
            helper.invoke('conditionalFormat', [{ type: "GreaterThan", cFColor: 'YellowFT', value: '20', range: 'H12:H15' }]);
            expect(helper.invoke('getCell', [13, 7]).style.backgroundColor).toBe('rgb(255, 235, 156)');
            expect(spreadsheet.sheets[0].conditionalFormats.length).toBe(4);
            done();
        });
    });

    describe('916989 - Insert column/row and perform undo/redo with cf->', () => {
        let spreadsheet: any;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ ranges: [{ dataSource: defaultData }] }]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Apply cf - color scale ->', (done: Function) => {
            helper.invoke('selectRange', ['E1:E11']);
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-colorscales');
            (getComponent(target.parentElement.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            setTimeout((): void => {
                helper.getElement('#GYRColorScale').click();
                expect(helper.invoke('getCell', [2, 4]).style.backgroundColor).toBe('rgb(99, 190, 123)');
                done();
            });
        });
        it('Apply cf - icon sets', (done: Function) => {
            helper.invoke('selectRange', ['A8:H8']);
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-iconsets');
            (getComponent(target.parentElement.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            setTimeout(() => {
                helper.getElement('#ThreeArrows').click();
                expect(helper.invoke('getCell', [7, 3]).children[0].classList.contains('e-3arrows-3'));
                done();
            });
        });
        it('Insert Column-After->', (done: Function) => {
            helper.invoke('selectRange', ['E1']);
            helper.openAndClickCMenuItem(0, 4, [6, 2], false, true);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].conditionalFormats[0].range).toBe('E1:F11');
                helper.edit('F8', '12');
                expect(helper.invoke('getCell', [7, 5]).children[0].classList.contains('e-3arrows-3'));
                expect(helper.invoke('getCell', [7, 5]).style.backgroundColor).toBe('rgb(254, 223, 129)');
                done();
            });
        });
        it('Insert Column-Before->', (done: Function) => {
            helper.invoke('selectRange', ['E1']);
            helper.openAndClickCMenuItem(0, 4, [6, 1], false, true);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].conditionalFormats[0].range).toBe('E1:G11');
                done();
            });
        });
        it('Insert Row-after->', (done: Function) => {
            helper.invoke('selectRange', ['A8']);
            helper.openAndClickCMenuItem(7, 0, [6, 2], true);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].conditionalFormats[1].range).toBe('A8:J9');
                done();
            });
        });
        it('Insert Row-Before->', (done: Function) => {
            helper.invoke('selectRange', ['A8']);
            helper.setAnimationToNone('#' + helper.id + '_contextmenu');
            helper.openAndClickCMenuItem(7, 0, [6, 1], true);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].conditionalFormats[1].range).toBe('A8:J10');
                done();
            });
        });
        it('Cf with Undo action', (done: Function) => {
            spreadsheet = helper.getInstance();
            helper.getElement('#' + helper.id + '_undo').click();
            helper.getElement('#' + helper.id + '_undo').click();
            helper.getElement('#' + helper.id + '_undo').click();
            helper.getElement('#' + helper.id + '_undo').click();
            helper.getElement('#' + helper.id + '_undo').click();
            expect(spreadsheet.sheets[0].conditionalFormats[0].range).toBe('E1:E11');
            expect(spreadsheet.sheets[0].conditionalFormats[1].range).toBe('A8:H8');
            done();
        });
        it('cf with Redo action', (done: Function) => {
            spreadsheet = helper.getInstance();
            helper.getElement('#' + helper.id + '_redo').click();
            helper.getElement('#' + helper.id + '_redo').click();
            helper.getElement('#' + helper.id + '_redo').click();
            helper.getElement('#' + helper.id + '_redo').click();
            helper.getElement('#' + helper.id + '_redo').click();
            expect(helper.getInstance().sheets[0].conditionalFormats[0].range).toBe('E1:G13');
            expect(helper.getInstance().sheets[0].conditionalFormats[1].range).toBe('A8:J10');
            done();
        });
    });

    describe('931114 - CF && Notes with undo/redo->', () => {
        let spreadsheet: any;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ ranges: [{ dataSource: defaultData }] }]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Apply color scale cf ->', (done: Function) => {
            helper.invoke('selectRange', ['H1:H11']);
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-colorscales');
            (getComponent(target.parentElement.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            setTimeout((): void => {
                helper.getElement('#GYRColorScale').click();
                expect(helper.invoke('getCell', [1, 7]).style.backgroundColor).toBe('rgb(248, 105, 107)');
                done();
            });
        });
        it('Added Note to H2 cell', (done: Function) => {
            helper.invoke('selectRange', ['H2']);
            helper.setAnimationToNone('#spreadsheet_contextmenu');
            helper.openAndClickCMenuItem(1, 7, [10]);
            setTimeout(() => {
                helper.getElements('.e-addNoteContainer')[0].value = 'Note Added';
                let td: HTMLElement = helper.invoke('getCell', [4, 4]);
                let coords = td.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: coords.left + 3, y: coords.top + 2 }, null, td);
                helper.triggerMouseAction('mouseup', { x: coords.left + 3, y: coords.top + 2 }, document, td);
                spreadsheet = helper.getInstance();
                expect((spreadsheet.sheets[0].rows[1].cells[7].notes as NoteModel).text).toBe('Note Added');
                expect(helper.invoke('getCell', [1, 7]).style.backgroundColor).toBe('rgb(248, 105, 107)');
                done();
            });
        });
        it('Notes with undo/redo->', (done: Function) => {
            helper.getElement('#' + helper.id + '_undo').click();
            expect((spreadsheet.sheets[0].rows[1].cells[7].notes as NoteModel)).toBeUndefined();
            expect(helper.invoke('getCell', [1, 7]).style.backgroundColor).toBe('rgb(248, 105, 107)');
            helper.getElement('#' + helper.id + '_redo').click();
            expect((spreadsheet.sheets[0].rows[1].cells[7].notes as NoteModel).text).toBe('Note Added');
            expect(helper.invoke('getCell', [1, 7]).style.backgroundColor).toBe('rgb(248, 105, 107)');
            done();
        });
        it('Edited Note in H2 cell', (done: Function) => {
            helper.invoke('selectRange', ['H2']);
            helper.setAnimationToNone('#spreadsheet_contextmenu');
            helper.openAndClickCMenuItem(0, 4, [9]);
            setTimeout(() => {
                helper.getElements('.e-addNoteContainer')[0].value = 'Note Edited';
                let td: HTMLElement = helper.invoke('getCell', [4, 4]);
                let coords = td.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: coords.left + 3, y: coords.top + 2 }, null, td);
                helper.triggerMouseAction('mouseup', { x: coords.left + 3, y: coords.top + 2 }, document, td);
                spreadsheet = helper.getInstance();
                expect((spreadsheet.sheets[0].rows[1].cells[7].notes as NoteModel).text).toBe('Note Edited');
                expect(helper.invoke('getCell', [1, 7]).style.backgroundColor).toBe('rgb(248, 105, 107)');
                done();
            });
        });
        it('Edited notes with undo/redo->', (done: Function) => {
            helper.getElement('#' + helper.id + '_undo').click();
            expect((spreadsheet.sheets[0].rows[1].cells[7].notes as NoteModel).text).toBe('Note Added');
            expect(helper.invoke('getCell', [1, 7]).style.backgroundColor).toBe('rgb(248, 105, 107)');
            helper.getElement('#' + helper.id + '_redo').click();
            expect((spreadsheet.sheets[0].rows[1].cells[7].notes as NoteModel).text).toBe('Note Edited');
            expect(helper.invoke('getCell', [1, 7]).style.backgroundColor).toBe('rgb(248, 105, 107)');
            done();
        });
    });

    describe('931120 - iconsets CF with merge and unmerge->', () => {
        let spreadsheet: any;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{
                    conditionalFormats: [
                        { type: 'GYRColorScale', range: 'G1:G11' },
                        { type: "ThreeArrows", range: 'H1:H11' }
                    ],
                    ranges: [{ dataSource: defaultData }],
                }, {}]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Merge cf applied cells ->', (done: Function) => {
            let spreadsheet: Spreadsheet = helper.getInstance();
            expect(helper.invoke('getCell', [2, 6]).style.backgroundColor).toBe('rgb(252, 183, 122)');
            expect(helper.invoke('getCell', [2, 7]).children[0].classList).toContain('e-3arrows-3');
            helper.invoke('merge', ['G2:H4']);
            expect(spreadsheet.sheets[0].rows[1].cells[6].rowSpan).toBe(3);
            expect(spreadsheet.sheets[0].rows[1].cells[6].colSpan).toBe(2);
            expect(helper.invoke('getCell', [5, 6]).style.backgroundColor).toBe('rgb(216, 223, 129)');
            expect(helper.invoke('getCell', [5, 7]).children[0].classList).toContain('e-3arrows-2');
            helper.invoke('merge', ['G6:H7', 'Horizontally']);
            expect(spreadsheet.sheets[0].rows[5].cells[6].rowSpan).toBeUndefined();
            expect(spreadsheet.sheets[0].rows[5].cells[6].colSpan).toBe(2);
            expect(helper.invoke('getCell', [9, 6]).style.backgroundColor).toBe('rgb(138, 201, 125)');
            expect(helper.invoke('getCell', [9, 7]).children[0].classList).toContain('e-3arrows-1');
            helper.invoke('merge', ['G9:H11', 'Vertically']);
            expect(spreadsheet.sheets[0].rows[8].cells[6].rowSpan).toBe(3);
            expect(spreadsheet.sheets[0].rows[8].cells[7].rowSpan).toBe(3);
            done();
        });
        it('Unmerge cf applied cells ->', (done: Function) => {
            helper.invoke('selectRange', ['G2']);
            helper.click('#' + helper.id + '_merge');
            expect(helper.invoke('getCell', [2, 7]).children.length).toBe(0);
            helper.invoke('selectRange', ['G6:G7']);
            helper.click('#' + helper.id + '_merge');
            expect(helper.invoke('getCell', [5, 7]).style.backgroundColor).toBe('');
            expect(helper.invoke('getCell', [6, 7]).children.length).toBe(0);
            helper.invoke('selectRange', ['G9:H9']);
            helper.click('#' + helper.id + '_merge');
            expect(helper.invoke('getCell', [9, 6]).children.length).toBe(0);
            expect(helper.invoke('getCell', [9, 7]).children.length).toBe(0);
            done();
        });
    });

    describe('875102- check the text alignment with databars cf->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ ranges: [{ dataSource: defaultData }] }]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('check red Databars cf applied', (done: Function) => {
            helper.invoke('selectRange', ['H1:H11']);
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-databars');
            (getComponent(target.parentElement.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            setTimeout(() => {
                helper.getElement('#RedDataBar').click();
                expect(helper.invoke('getCell', [1, 7]).getElementsByClassName('e-databar')[1].style.backgroundColor).toBe('rgb(248, 105, 107)');
                done();
            });
        });
        it('Check the vertical align with databars', (done: Function) => {
            helper.invoke('selectRange', ['H2']);
            helper.getElement('#' + helper.id + '_vertical_align').click();
            helper.getElement('#' + helper.id + '_vertical_align-popup').querySelectorAll('.e-item')[1].click();
            setTimeout(() => {
                expect(helper.invoke('getCell', [1, 7]).style.verticalAlign).toBe('middle');
                expect(helper.invoke('getCell', [1, 7]).querySelector('.e-databar-value').style.alignItems).toBe('center');
                done();
            });
        });
        it('Check the text decorations with databars', (done: Function) => {
            helper.invoke('selectRange', ['H3:H5']);
            helper.click(`#${helper.id}_line-through`);
            helper.click(`#${helper.id}_underline`);
            expect(helper.getInstance().sheets[0].rows[2].cells[7].style.textDecoration).toBe('underline line-through');
            expect(helper.getInstance().sheets[0].rows[3].cells[7].style.textDecoration).toBe('underline line-through');
            expect(helper.getInstance().sheets[0].rows[4].cells[7].style.textDecoration).toBe('underline line-through');
            expect(helper.invoke('getCell', [1, 7]).getElementsByClassName('e-databar')[1].style.backgroundColor).toBe('rgb(248, 105, 107)');
            done();
        });
    });

    describe('931118- Conditional format with Notes->', () => {
        let spreadsheet: any;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ ranges: [{ dataSource: defaultData }] }]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Add Note to cell', (done: Function) => {
            helper.invoke('selectRange', ['F2']);
            helper.setAnimationToNone('#spreadsheet_contextmenu');
            helper.openAndClickCMenuItem(0, 4, [10]);
            setTimeout(() => {
                helper.getElements('.e-addNoteContainer')[0].value = 'Added Note';
                let td: HTMLElement = helper.invoke('getCell', [4, 4]);
                let coords = td.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: coords.left + 3, y: coords.top + 2 }, null, td);
                helper.triggerMouseAction('mouseup', { x: coords.left + 3, y: coords.top + 2 }, document, td);
                spreadsheet = helper.getInstance();
                expect((spreadsheet.sheets[0].rows[1].cells[5].notes as NoteModel).text).toBe('Added Note');
                done();
            });
        });
        it('Databars cf with notes->', (done: Function) => {
            helper.invoke('selectRange', ['F1:F11']);
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-databars');
            (getComponent(target.parentElement.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            setTimeout(() => {
                helper.getElement('#RedDataBar').click();
                expect((spreadsheet.sheets[0].rows[1].cells[5].notes as NoteModel).text).toBe('Added Note');
                expect(helper.invoke('getCell', [1, 5]).getElementsByClassName('e-databar')[1].style.backgroundColor).toBe('rgb(248, 105, 107)');
                done();
            });
        });
        it('Notes with clear Content->', (done: Function) => {
            helper.invoke('selectRange', ['F1:F11']);
            helper.click('#spreadsheet_clear');
            helper.click('#spreadsheet_clear-popup ul li:nth-child(3)');
            setTimeout(() => {
                expect((spreadsheet.sheets[0].rows[1].cells[5].notes as NoteModel).text).toBe('Added Note');
                expect(helper.invoke('getCell', [1, 5]).querySelector('.e-databar')).toBeNull();
                expect(helper.invoke('getCell', [1, 5]).textContent).toBe('');
                helper.getElement('#' + helper.id + '_undo').click();
                expect((spreadsheet.sheets[0].rows[1].cells[5].notes as NoteModel).text).toBe('Added Note');
                expect(helper.invoke('getCell', [1, 5]).getElementsByClassName('e-databar')[1].style.backgroundColor).toBe('rgb(248, 105, 107)');
                done();
            });
        });
        it('Edit with notes and Dbars->', (done: Function) => {
            helper.invoke('selectRange', ['F2']);
            helper.edit('F2', '180');
            expect((spreadsheet.sheets[0].rows[1].cells[5].notes as NoteModel).text).toBe('Added Note');
            done();
        });
        it('Hide and show row with note and cf', function (done) {
            helper.invoke('selectRange', ['A2']);
            var spreadsheet = helper.getInstance();
            spreadsheet.hideRow(1, 1, true);
            var rowHdr = helper.invoke('getRowHeaderTable').rows[1].cells[0];
            var rowHdrPanel = helper.invoke('getRowHeaderContent');
            var offset = rowHdr.getBoundingClientRect();
            helper.triggerMouseAction('mousemove', { x: offset.top - 0.5, y: offset.left - 1, offsetY: 3 }, rowHdrPanel, rowHdr);
            helper.triggerMouseAction('mousedown', { x: offset.left - 1, y: offset.top - 0.5, offsetY: 3 }, rowHdrPanel, rowHdr);
            helper.triggerMouseAction('mousemove', { x: offset.left - 1, y: offset.top + 60, offsetY: 7 }, spreadsheet.element, rowHdr);
            helper.triggerMouseAction('mouseup', { x: offset.left - 1, y: offset.top + 60, offsetY: 7 }, document, rowHdr);
            setTimeout(function () {
                expect((spreadsheet.sheets[0].rows[1].cells[5].notes as NoteModel).text).toBe('Added Note');
                helper.invoke('selectRange', ['F2']);
                helper.edit('F2', '');
                expect((spreadsheet.sheets[0].rows[1].cells[5].notes as NoteModel).text).toBe('Added Note');
                done();
            });
        });
    });

    describe('916237- Perform undo/redo with cf->', () => {
        let spreadsheet: any;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ ranges: [{ dataSource: defaultData }] }]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Apply cf - greater than ->', (done: Function) => {
            helper.invoke('selectRange', ['H1:H11']);
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-menu-item');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#cf_greaterthan_dlg').click();
            setTimeout((): void => {
                helper.setAnimationToNone('.e-conditionalformatting-dlg.e-dialog');
                const btn: HTMLButtonElement = helper.getElement('#' + helper.id + ' .e-conditionalformatting-dlg .e-primary.e-btn')
                expect(btn.disabled).toBeTruthy();
                const input: HTMLInputElement = helper.getElement('#' + helper.id + ' .e-conditionalformatting-dlg .e-cfmain .e-input') as HTMLInputElement;
                input.value = '20';
                const evt: Event = document.createEvent('Event');
                evt.initEvent('input', true, true); input.dispatchEvent(evt);
                btn.click();
                expect(helper.invoke('getCell', [2, 7]).classList.contains('e-redft'));
                done();
            });
        });
        it('Apply cf - greater than-1 ->', (done: Function) => {
            helper.invoke('selectRange', ['H1:H11']);
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-menu-item');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#cf_greaterthan_dlg').click();
            setTimeout((): void => {
                helper.setAnimationToNone('.e-conditionalformatting-dlg.e-dialog');
                const btn: HTMLButtonElement = helper.getElement('#' + helper.id + ' .e-conditionalformatting-dlg .e-primary.e-btn')
                expect(btn.disabled).toBeTruthy();
                const input: HTMLInputElement = helper.getElement('#' + helper.id + ' .e-conditionalformatting-dlg .e-cfmain .e-input') as HTMLInputElement;
                input.value = '20';
                const evt: Event = document.createEvent('Event');
                evt.initEvent('input', true, true); input.dispatchEvent(evt);
                let Color: any = helper.getElements('.e-conditionalformatting-dlg .e-cfsub .e-dropdownlist')[0];
                Color.ej2_instances[0].value = 'Yellow Fill with Dark Yellow Text';
                Color.ej2_instances[0].dataBind();
                btn.click();
                expect(helper.invoke('getCell', [2, 7]).classList.contains('e-yellowft'));
                done();
            });
        });
        it('Cf with Undo action', (done: Function) => {
            spreadsheet = helper.getInstance();
            expect(spreadsheet.sheets[0].conditionalFormats.length).toBe(2);
            helper.getElement('#' + helper.id + '_undo').click();
            expect(spreadsheet.sheets[0].conditionalFormats.length).toBe(1);
            expect(helper.invoke('getCell', [2, 7]).classList.contains('e-redft'));
            helper.getElement('#' + helper.id + '_undo').click();
            expect(spreadsheet.sheets[0].conditionalFormats.length).toBe(0);
            expect(helper.invoke('getCell', [2, 7]).style.backgroundColor).toBe('');
            done();
        });
        it('cf with Redo action', (done: Function) => {
            spreadsheet = helper.getInstance();
            helper.getElement('#' + helper.id + '_redo').click();
            expect(spreadsheet.sheets[0].conditionalFormats.length).toBe(1);
            expect(helper.invoke('getCell', [2, 7]).classList.contains('e-redft'));
            helper.getElement('#' + helper.id + '_redo').click();
            expect(spreadsheet.sheets[0].conditionalFormats.length).toBe(2);
            expect(helper.invoke('getCell', [2, 7]).classList.contains('e-yellowft'));
            done();
        });
        it('EJ2-876151 - Incorrect Data Bar Position in RTL Mode with Conditional Formatting', (done: Function) => {
            helper.setModel('enableRtl', true);
            setTimeout((): void => {
                helper.invoke('conditionalFormat', [{ type: 'GreenDataBar', range: 'H2:H4' }]);
                const cell1 = helper.invoke('getCell', [1, 7]);
                expect(cell1.getElementsByClassName('e-databar')[1].style.width).toBe('20%');
                expect(cell1.getElementsByClassName('e-databar')[1].style.height).toBe('17px');
                expect(cell1.getElementsByClassName('e-databar')[1].style.backgroundColor).toBe('rgb(99, 190, 123)');
                expect(cell1.getElementsByClassName('e-databar')[1].style.right).toBe('0px');
                helper.edit('H5', '-1');
                helper.edit('H6', '-2');
                helper.edit('H7', '-3');
                helper.invoke('conditionalFormat', [{ type: 'GreenDataBar', range: 'H5:H7' }]);
                const cell2 = helper.invoke('getCell', [4, 7]);
                expect(cell2.getElementsByClassName('e-databar')[1].style.width).toBe('34%');
                expect(cell2.getElementsByClassName('e-databar')[1].style.height).toBe('17px');
                expect(cell2.getElementsByClassName('e-databar')[1].style.backgroundColor).toBe('rgb(248, 105, 107)');
                expect(cell2.getElementsByClassName('e-databar')[1].style.right).toBe('0px');
                helper.edit('H8', '-144');
                helper.edit('H9', '-166');
                helper.invoke('conditionalFormat', [{ type: 'GreenDataBar', range: 'H8:H11' }]);
                const cell3 = helper.invoke('getCell', [8, 7]);
                const cell4 = helper.invoke('getCell', [9, 7]);
                expect(cell3.getElementsByClassName('e-databar')[0].style.width).toBe('50%');
                expect(cell3.getElementsByClassName('e-databar')[0].style.height).toBe('17px');
                expect(cell3.getElementsByClassName('e-databar')[0].style.backgroundColor).toBe('rgb(248, 105, 107)');
                expect(cell3.getElementsByClassName('e-databar')[0].style.right).toBe('0px');
                expect(cell4.getElementsByClassName('e-databar')[1].style.width).toBe('50%');
                expect(cell4.getElementsByClassName('e-databar')[1].style.height).toBe('17px');
                expect(cell4.getElementsByClassName('e-databar')[1].style.backgroundColor).toBe('rgb(99, 190, 123)');
                expect(cell4.getElementsByClassName('e-databar')[1].style.right).toBe('50%');
                done();
            });
        });
    });

    describe('920691 - Edited values not updated when note added in cell->', () => {
        let spreadsheet: any;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{
                    conditionalFormats: [
                        { type: "BlueDataBar", range: 'H1:H11' },
                        { type: "ThreeArrows", range: 'G1:G11' }
                    ],
                    ranges: [{ dataSource: defaultData }],
                    rows: [{ index: 0, cells: [{ index: 7, notes: { text: 'Note Added' } }] },
                    { index: 3, cells: [{ index: 7, notes: { text: 'Note Added' } }] },
                    { index: 4, cells: [{ index: 6, notes: { text: 'Note Added' } }] }]
                }, {}]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Edit with filter icon, note and cf ->', (done: Function) => {
            helper.invoke('selectRange', ['H2']);
            spreadsheet = helper.getInstance();
            helper.invoke('applyFilter');
            expect(helper.invoke('getCell', [0, 7]).children[0].classList).toContain('e-filter-btn');
            expect((spreadsheet.sheets[0].rows[0].cells[7].notes as NoteModel).text).toBe('Note Added');
            expect(helper.invoke('getCell', [3, 7]).getElementsByClassName('e-databar')[1].style.backgroundColor).toBe('rgb(90, 138, 198)');
            expect((spreadsheet.sheets[0].rows[3].cells[7].notes as NoteModel).text).toBe('Note Added');
            expect((spreadsheet.sheets[0].rows[4].cells[6].notes as NoteModel).text).toBe('Note Added');
            expect(helper.invoke('getCell', [4, 6]).children[0].classList).toContain('e-3arrows-1');
            helper.edit('H1', 'Edited');
            expect(spreadsheet.sheets[0].rows[0].cells[7].value).toBe('Edited');
            expect(helper.invoke('getCell', [0, 7]).textContent).toBe('Edited');
            helper.edit('H4', '30');
            expect(spreadsheet.sheets[0].rows[3].cells[7].value).toBe(30);
            expect(helper.invoke('getCell', [3, 7]).textContent).toBe('30');
            helper.edit('G5', '20');
            expect(spreadsheet.sheets[0].rows[4].cells[6].value).toBe(20);
            expect(helper.invoke('getCell', [4, 6]).textContent).toBe('20');
            done();
        });
    });

    describe('931133- Editing with cf and hyperlink ->', () => {
        let spreadsheet: any;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{
                    conditionalFormats: [
                        { type: 'GYRColorScale', range: 'G1:G11' },
                        { type: "ThreeArrows", range: 'H1:H11' },
                        { type: "RedDataBar", range: 'G1:G11' }
                    ],
                    ranges: [{ dataSource: defaultData }],
                }, {}]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Checked cf applied ->', (done: Function) => {
            expect(helper.invoke('getCell', [2, 6]).getElementsByClassName('e-databar')[1].style.backgroundColor).toBe('rgb(248, 105, 107)');
            expect(helper.invoke('getCell', [2, 6]).style.backgroundColor).toBe('rgb(252, 183, 122)');
            expect(helper.invoke('getCell', [4, 7]).children[0].classList.contains('e-3arrows-2'));
            done();
        });
        it('Insert hyperlink - 1', (done: Function) => {
            helper.invoke('selectRange', ['G1:G11']);
            helper.switchRibbonTab(2);
            helper.getElementFromSpreadsheet('#' + helper.id + '_hyperlink').click();
            setTimeout(() => {
                helper.getElements('.e-hyperlink-dlg .e-webpage input')[1].value = 'www.google.com';
                helper.triggerKeyEvent('keyup', 88, null, null, null, helper.getElements('.e-hyperlink-dlg .e-webpage input')[1]);
                helper.setAnimationToNone('.e-hyperlink-dlg.e-dialog');
                helper.click('.e-hyperlink-dlg .e-footer-content button:nth-child(1)');
                spreadsheet = helper.getInstance();
                let sheet: any = spreadsheet.sheets[0];
                expect(sheet.rows[2].cells[6].hyperlink.address).toBe('http://www.google.com');
                const td: HTMLElement = helper.invoke('getCell', [2, 6]);
                expect(td.querySelector('.e-hyperlink').textContent).toBe('5');
                done();
            });
        });
        it('Insert hyperlink - 2', (done: Function) => {
            helper.invoke('selectRange', ['H1:H11']);
            helper.getElementFromSpreadsheet('#' + helper.id + '_hyperlink').click();
            setTimeout(() => {
                helper.getElements('.e-hyperlink-dlg .e-webpage input')[1].value = 'www.google.com';
                helper.triggerKeyEvent('keyup', 88, null, null, null, helper.getElements('.e-hyperlink-dlg .e-webpage input')[1]);
                helper.setAnimationToNone('.e-hyperlink-dlg.e-dialog');
                helper.click('.e-hyperlink-dlg .e-footer-content button:nth-child(1)');
                spreadsheet = helper.getInstance();
                let sheet: any = spreadsheet.sheets[0];
                expect(sheet.rows[4].cells[7].hyperlink.address).toBe('http://www.google.com');
                const td: HTMLElement = helper.invoke('getCell', [4, 7]);
                expect(td.querySelector('.e-hyperlink').textContent).toBe('67');
                done();
            });
        });
        it('Cell edit', (done: Function) => {
            helper.switchRibbonTab(1);
            helper.edit('G3', '10');
            expect(spreadsheet.sheets[0].rows[2].cells[6].value).toBe(10);
            expect(helper.invoke('getCell', [2, 6]).getElementsByClassName('e-databar')[1].style.backgroundColor).toBe('rgb(248, 105, 107)');
            expect(helper.invoke('getCell', [2, 6]).style.backgroundColor).toBe('rgb(192, 217, 128)');
            const td: HTMLElement = helper.invoke('getCell', [2, 6]);
            expect(td.querySelector('.e-hyperlink').textContent).toBe('10');
            helper.edit('H5', '50');
            expect(spreadsheet.sheets[0].rows[4].cells[7].value).toBe(50);
            expect(helper.invoke('getCell', [4, 7]).children[0].classList.contains('e-3arrows-3'));
            const td1: HTMLElement = helper.invoke('getCell', [4, 7]);
            expect(td1.querySelector('.e-hyperlink').textContent).toBe('50');
            done();
        });
    });

    describe('885424- Clear cf based on selected range->', () => {
        let spreadsheet: any;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ ranges: [{ dataSource: defaultData }] }]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Apply cf - Databars ->', (done: Function) => {
            helper.invoke('selectRange', ['H1:H11']);
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-databars');
            (getComponent(target.parentElement.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            setTimeout(() => {
                helper.getElement('#RedDataBar').click();
                expect(helper.invoke('getCell', [1, 7]).getElementsByClassName('e-databar')[1].style.backgroundColor).toBe('rgb(248, 105, 107)');
                expect(helper.invoke('getCell', [5, 7]).getElementsByClassName('e-databar')[1].style.backgroundColor).toBe('rgb(248, 105, 107)');
                done();
            });
        });
        it('Apply cf - color scale ->', (done: Function) => {
            helper.invoke('selectRange', ['A6:H6']);
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-colorscales');
            (getComponent(target.parentElement.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            setTimeout((): void => {
                helper.getElement('#GYRColorScale').click();
                expect(helper.invoke('getCell', [5, 2]).style.backgroundColor).toBe('rgb(248, 105, 107)');
                expect(helper.invoke('getCell', [5, 1]).style.backgroundColor).toBe('rgb(99, 190, 123)');
                done();
            });
        });
        it('Clear databars cf ->', (done: Function) => {
            helper.invoke('selectRange', ['H6:H1']);
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const clearrules: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-menu-item[aria-label="Clear Rules"]');
            (getComponent(clearrules.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: clearrules.getBoundingClientRect().left + 5, y: clearrules.getBoundingClientRect().top + 5 }, document, clearrules);
            helper.getElement('#cf_cr_cells').click();
            setTimeout(() => {
                expect(helper.invoke('getCell', [1, 7]).querySelector('.e-databar')).toBeNull();
                expect(helper.invoke('getCell', [5, 7]).querySelector('.e-databar')).toBeNull();
                expect(helper.invoke('getCell', [6, 7]).getElementsByClassName('e-databar')[1].style.backgroundColor).toBe('rgb(248, 105, 107)');
                done();
            });
        });
        it('Clear color scale cf ->', (done: Function) => {
            helper.invoke('clear', [{ type: 'Clear Formats', range: 'D6:A6' }]);
            expect(helper.invoke('getCell', [5, 2]).style.backgroundColor).toBe('');
            expect(helper.invoke('getCell', [5, 1]).style.backgroundColor).toBe('');
            done();
        });
        it('Clear entire cf ->', (done: Function) => {
            helper.invoke('selectRange', ['H1']);
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const clearrules: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-menu-item[aria-label="Clear Rules"]');
            (getComponent(clearrules.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: clearrules.getBoundingClientRect().left + 5, y: clearrules.getBoundingClientRect().top + 5 }, document, clearrules);
            helper.getElement('#cf_cr_sheet').click();
            setTimeout(() => {
                expect(helper.invoke('getCell', [9, 7]).querySelector('.e-databar')).toBeNull();
                expect(helper.invoke('getCell', [5, 5]).style.backgroundColor).toBe('');
                done();
            });
        });
    });

    describe('EJ2-877355, EJ2-932574 ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{
                    conditionalFormats: [{ type: "Unique", cFColor: "GreenFT", range: 'E1:E20' },
                    { type: 'BlueDataBar', range: 'G1:G11' }],
                    ranges: [{ dataSource: defaultData }]
                }]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Checking Unique High light cell rules with empty cells', (done: Function) => {
            expect(helper.invoke('getCell', [3, 4]).style.backgroundColor).toBe('rgb(198, 239, 206)');
            expect(helper.invoke('getCell', [3, 4]).style.color).toBe('rgb(0, 97, 0)');
            expect(helper.invoke('getCell', [12, 4]).style.backgroundColor).toBe('');
            expect(helper.invoke('getCell', [12, 4]).style.color).toBe('');
            helper.invoke('conditionalFormat', [{ type: 'Unique', cFColor: "GreenFT", range: 'H1:H20' }]);
            expect(helper.invoke('getCell', [3, 7]).style.backgroundColor).toBe('rgb(198, 239, 206)');
            expect(helper.invoke('getCell', [3, 7]).style.color).toBe('rgb(0, 97, 0)');
            expect(helper.invoke('getCell', [12, 7]).style.backgroundColor).toBe('');
            expect(helper.invoke('getCell', [12, 7]).style.color).toBe('');
            done();
        });

        it('Selected value from list data validation drop-down is not updated properly with conditional formatting', (done: Function) => {
            const spreadsheet: any = helper.getInstance();
            expect(helper.invoke('getCell', [2, 6]).getElementsByClassName('e-databar')[1].style.backgroundColor).toBe('rgb(90, 138, 198)');
            expect(helper.invoke('getCell', [2, 6]).textContent).toBe('5');
            helper.invoke('addDataValidation', [{ type: 'List', value1: '12,13,14' }, 'G1:G11']);
            const cell: CellModel = spreadsheet.sheets[0].rows[2].cells[6];
            expect(JSON.stringify(cell.validation)).toBe('{"type":"List","value1":"12,13,14"}');
            helper.invoke('selectRange', ['G3']);
            const td: HTMLElement = helper.invoke('getCell', [2, 6]).children[0];
            expect(td.classList).toContain('e-validation-list');
            const coords: ClientRect = td.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: coords.left, y: coords.top }, document, td);
            helper.triggerMouseAction('mousedup', { x: coords.left, y: coords.top }, document, td);
            (td.querySelector('.e-dropdownlist') as any).ej2_instances[0].dropDownClick({ preventDefault: function () { }, target: td.children[0] });
            setTimeout(() => {
                helper.click('.e-ddl.e-popup li:nth-child(2)');
                expect(helper.getInstance().sheets[0].rows[2].cells[6].value).toBe(13);
                expect(helper.invoke('getCell', [2, 6]).innerText).toBe('13');
                expect(helper.invoke('getCell', [2, 6]).innerText).not.toBe('1313');
                done();
            }, 10);
        });
    });

    describe('931145 - Cut/paste action with cf ->', () => {
        let spreadsheet: any;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{
                    conditionalFormats: [
                        { type: 'BlueDataBar', range: 'H1:H11' },
                        { type: 'GreaterThan', cFColor: 'RedFT', value: '10', range: 'H1:H11' },
                        { type: 'Top10Items', cFColor: 'RedFT', value: '10', range: 'G1:G11' }
                    ],
                    ranges: [{ dataSource: defaultData }],
                }, {}]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Check the conditional format - 1', (done: Function) => {
            expect(helper.invoke('getCell', [1, 6]).style.backgroundColor).toBe('rgb(255, 199, 206)');
            expect(helper.invoke('getCell', [2, 7]).style.backgroundColor).toBe('rgb(255, 199, 206)');
            expect(helper.invoke('getCell', [2, 7]).getElementsByClassName('e-databar')[1].style.backgroundColor).toBe('rgb(90, 138, 198)');
            done();
        });
        it('Cut/paste the cf applied cells - 1->', (done: Function) => {
            spreadsheet = helper.getInstance();
            helper.invoke('cut', ['H2:H6']).then(() => {
                helper.invoke('paste', ['J2']);
                expect(spreadsheet.sheets[0].conditionalFormats.length).toBe(5);
                expect(helper.invoke('getCell', [2, 7]).style.backgroundColor).toBe('');
                expect(helper.getInstance().sheets[0].rows[2].cells[7]).toBeNull();
                expect(helper.invoke('getCell', [2, 9]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                expect(helper.invoke('getCell', [2, 9]).getElementsByClassName('e-databar')[1].style.backgroundColor).toBe('rgb(90, 138, 198)');
                expect(helper.getInstance().sheets[0].rows[2].cells[9].value.toString()).toBe('50');
                done();
            });
        });
        it('Undo/Redo action - 1', (done: Function) => {
            helper.getElement('#' + helper.id + '_undo').click();
            setTimeout((): void => {
                helper.getElement('#' + helper.id + '_redo').click();
                setTimeout((): void => {
                    helper.getElement('#' + helper.id + '_undo').click();
                    setTimeout((): void => {
                        helper.getElement('#' + helper.id + '_redo').click();
                        setTimeout((): void => {
                            helper.getElement('#' + helper.id + '_undo').click();
                            done();
                        });
                    });
                });
            });
        });
        it('Check the conditional format - 2', (done: Function) => {
            expect(spreadsheet.sheets[0].conditionalFormats.length).toBe(3);
            expect(helper.invoke('getCell', [2, 7]).style.backgroundColor).toBe('rgb(255, 199, 206)');
            expect(helper.getInstance().sheets[0].rows[2].cells[7].value.toString()).toBe('50');
            expect(helper.invoke('getCell', [2, 7]).getElementsByClassName('e-databar')[1].style.backgroundColor).toBe('rgb(90, 138, 198)');
            expect(helper.invoke('getCell', [2, 9]).style.backgroundColor).toBe('');
            expect(helper.invoke('getCell', [2, 9]).getElementsByClassName('e-databar')[1]).toBeUndefined();
            expect(helper.getInstance().sheets[0].rows[2].cells[9].value).toBe('');
            done();
        });

        it('EJ2-931129 - The height of data bars conditional formatting is not set correctly when cells are merged', (done: Function) => {
            spreadsheet = helper.getInstance();
            expect(helper.invoke('getCell', [1, 7]).getElementsByClassName('e-databar')[1].style.height).toBe('17px');
            expect(helper.invoke('getCell', [3, 7]).getElementsByClassName('e-databar')[1].style.height).toBe('17px');
            expect(helper.invoke('getCell', [5, 7]).getElementsByClassName('e-databar')[1].style.height).toBe('17px');
            expect(helper.invoke('getCell', [6, 7]).getElementsByClassName('e-databar')[1].style.height).toBe('17px');
            expect(helper.invoke('getCell', [8, 7]).getElementsByClassName('e-databar')[1].style.height).toBe('17px');
            helper.invoke('merge', ['H2:H3']);
            helper.invoke('merge', ['H4:I6']);
            helper.invoke('merge', ['H7:K10']);
            expect(helper.invoke('getCell', [1, 7]).getElementsByClassName('e-databar')[1].style.height).toBe('37px');
            expect(helper.invoke('getCell', [3, 7]).getElementsByClassName('e-databar')[1].style.height).toBe('57px');
            expect(helper.invoke('getCell', [6, 7]).getElementsByClassName('e-databar')[1].style.height).toBe('77px');
            spreadsheet.setRowsHeight(50,['1:10']);
            expect(helper.invoke('getCell', [1, 7]).getElementsByClassName('e-databar')[1].style.height).toBe('97px');
            expect(helper.invoke('getCell', [3, 7]).getElementsByClassName('e-databar')[1].style.height).toBe('147px');
            expect(helper.invoke('getCell', [6, 7]).getElementsByClassName('e-databar')[1].style.height).toBe('197px');
            done();
        });
    });

    describe('Iconset cf with Databar cf ->', () => {
        let spreadsheet: any;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet(
                { sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Set cell height', (done: Function) => {
            spreadsheet = helper.getInstance();
            helper.invoke('selectRange', ['F2']);
            spreadsheet.setColWidth(260, 5);
            spreadsheet.setRowHeight(160, 1);
            setTimeout((): void => {
                expect(spreadsheet.sheets[0].rows[1].height).toBe(160);
                done();
            }, 50);
        });
        it('Apply databars', (done: Function) => {
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-databars');
            (getComponent(target.parentElement.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            setTimeout((): void => {
                helper.getElement('#OrangeDataBar').click();
                setTimeout((): void => {
                    let cellEle: HTMLElement = helper.getElements('.e-cf-databar')[0];
                    expect(cellEle.style.height).toEqual('159px');
                    done();
                });
            });
        });
        it('Apply iconset', (done: Function) => {
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-iconsets');
            (getComponent(target.parentElement.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            setTimeout((): void => {
                helper.getElement('#ThreeTrafficLights1').click();
                setTimeout((): void => {
                    let cellEle: HTMLElement = helper.getElements('.e-iconsetspan')[0];
                    expect(cellEle.style.height).toBe('159px');
                    expect(cellEle.parentElement.querySelector('.e-cf-icon-end')).not.toBeNull();
                    done();
                });
            });
        });
        it('Apply accounting type', (done: Function) => {
            helper.getElement('#' + helper.id + '_number_format').click();
            helper.getElement('#' + helper.id + '_Accounting').click();
            setTimeout((): void => {
                let cellEle: HTMLElement = helper.getElements('.e-cf-currency')[0];
                expect(cellEle.style.alignItems).toBe('end');
                done();
            });
        });
        it('Apply align action for top', (done: Function) => {
            helper.getElement('#' + helper.id + '_vertical_align').click();
            setTimeout((): void => {
                helper.getElement('#' + helper.id + '_vertical_align-popup .e-top-icon').click();
                setTimeout((): void => {
                    let cellEle: HTMLElement = helper.getElements('.e-iconsetspan')[0];
                    expect(cellEle.parentElement.querySelector('.e-cf-icon-top')).not.toBeNull();
                    expect(helper.getElements('.e-cf-currency')[0].style.alignItems).toBe('start');
                    done();
                });
            });
        });
        it('Apply align action for middle', (done: Function) => {
            helper.getElement('#' + helper.id + '_vertical_align').click();
            setTimeout((): void => {
                helper.getElement('#' + helper.id + '_vertical_align-popup .e-middle-icon').click();
                setTimeout((): void => {
                    let cellEle: HTMLElement = helper.getElements('.e-iconsetspan')[0];
                    expect(cellEle.parentElement.querySelector('.e-cf-icon-middle')).not.toBeNull();
                    expect(helper.getElements('.e-cf-currency')[0].style.alignItems).toBe('center');
                    done();
                });
            });
        });
        it('Apply text align action for left', (done: Function) => {
            helper.getElement('#' + helper.id + '_text_align').click();
            setTimeout((): void => {
                helper.getElement('#' + helper.id + '_text_align-popup .e-left-icon').click();
                setTimeout((): void => {
                    let cellEle: HTMLElement = helper.getElements('.e-iconsetspan')[0];
                    expect(cellEle.parentElement.style.textAlign).toBe('left');
                    done();
                });
            });
        });
        it('Apply text align action for center', (done: Function) => {
            helper.getElement('#' + helper.id + '_text_align').click();
            setTimeout((): void => {
                helper.getElement('#' + helper.id + '_text_align-popup .e-center-icon').click();
                setTimeout((): void => {
                    let cellEle: HTMLElement = helper.getElements('.e-iconsetspan')[0];
                    expect(cellEle.parentElement.style.textAlign).toBe('center');
                    done();
                });
            });
        });
        it('Apply Clear All', (done: Function) => {
            helper.click('#' + helper.id + '_clear');
            helper.click('#spreadsheet_clear-popup ul li:nth-child(1)');
            setTimeout((): void => {
                expect(helper.invoke('getCell', [1, 5]).textContent).toBe('');
                done();
            });
        });
        it('Undo action', (done: Function) => {
            helper.getElement('#' + helper.id + '_undo').click();
            setTimeout((): void => {
                expect(helper.getElements('.e-iconsetspan')[0].parentElement.style.textAlign).toBe('center');
                done();
            });
        });
        it('Undo action-1', (done: Function) => {
            helper.getElement('#' + helper.id + '_undo').click();
            setTimeout((): void => {
                expect(helper.getElements('.e-iconsetspan')[0].parentElement.style.textAlign).toBe('left');
                done();
            });
        });
        it('Undo action-2', (done: Function) => {
            helper.getElement('#' + helper.id + '_undo').click();
            setTimeout((): void => {
                expect(helper.getElements('.e-iconsetspan')[0].parentElement.style.textAlign).toBe('');
                done();
            });
        });
        it('Undo action-3', (done: Function) => {
            helper.getElement('#' + helper.id + '_undo').click();
            setTimeout((): void => {
                let cellEle: HTMLElement = helper.getElements('.e-iconsetspan')[0];
                expect(cellEle.parentElement.querySelector('.e-cf-icon-top')).not.toBeNull();
                done();
            });
        });
        it('Undo action-4', (done: Function) => {
            helper.getElement('#' + helper.id + '_undo').click();
            setTimeout((): void => {
                let cellEle: HTMLElement = helper.getElements('.e-iconsetspan')[0];
                expect(cellEle.parentElement.querySelector('.e-cf-icon-end')).not.toBeNull();
                done();
            });
        });
        it('Undo action-5', (done: Function) => {
            helper.getElement('#' + helper.id + '_undo').click();
            setTimeout((): void => {
                expect(helper.getElements('.e-cf-currency')[0]).toBeUndefined();
                done();
            });
        });
        it('Undo action-6', (done: Function) => {
            helper.getElement('#' + helper.id + '_undo').click();
            setTimeout((): void => {
                expect(helper.getElements('.e-iconsetspan')[0]).toBeUndefined();
                done();
            });
        });
        it('Undo action-7', (done: Function) => {
            helper.getElement('#' + helper.id + '_undo').click();
            setTimeout((): void => {
                expect(helper.getElements('.e-iconsetspan').length).toBe(0);
                expect(helper.getElements('.e-cf-databar')[0]).toBeUndefined();
                done();
            });
        });
        it('Redo action', (done: Function) => {
            helper.getElement('#' + helper.id + '_redo').click();
            setTimeout((): void => {
                expect(helper.getElements('.e-cf-databar')).not.toBeNull();
                done();
            });
        });
        it('Redo action-1', (done: Function) => {
            helper.getElement('#' + helper.id + '_redo').click();
            setTimeout((): void => {
                expect(helper.getElements('.e-iconsetspan').length).toBe(1);
                done();
            });
        });
        it('Redo action-2', (done: Function) => {
            helper.getElement('#' + helper.id + '_redo').click();
            setTimeout((): void => {
                expect(helper.getElements('.e-cf-currency').length).toBe(1);
                done();
            });
        });
        it('Redo action-3', (done: Function) => {
            helper.getElement('#' + helper.id + '_redo').click();
            setTimeout((): void => {
                let cellEle: HTMLElement = helper.getElements('.e-iconsetspan')[0];
                expect(cellEle.parentElement.querySelector('.e-cf-icon-top')).not.toBeNull();
                done();
            });
        });
        it('Redo action-4', (done: Function) => {
            helper.getElement('#' + helper.id + '_redo').click();
            setTimeout((): void => {
                let cellEle: HTMLElement = helper.getElements('.e-iconsetspan')[0];
                expect(cellEle.parentElement.querySelector('.e-cf-icon-middle')).not.toBeNull();
                done();
            });
        });
        it('Redo action-5', (done: Function) => {
            helper.getElement('#' + helper.id + '_redo').click();
            setTimeout((): void => {
                expect(helper.getElements('.e-iconsetspan')[0].parentElement.style.textAlign).toBe('left');
                done();
            });
        });
        it('Redo action-6', (done: Function) => {
            helper.getElement('#' + helper.id + '_redo').click();
            setTimeout((): void => {
                expect(helper.getElements('.e-iconsetspan')[0].parentElement.style.textAlign).toBe('center');
                done();
            });
        });
        it('Redo action-7', (done: Function) => {
            helper.getElement('#' + helper.id + '_redo').click();
            setTimeout((): void => {
                expect(helper.invoke('getCell', [1, 5]).textContent).toBe('');
                done();
            });
        });
    });

    describe('875051- Cf applied for Long date->', () => {
        let spreadsheet: any;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{
                    conditionalFormats: [
                        { type: 'Between', value: '"Friday, February 14, 2014", "Wednesday, June 11, 2014"', range: 'B1:B20' },
                    ],
                    ranges: [{ dataSource: defaultData }],
                }, {}]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Checking Between condition->', (done: Function) => {
            expect(helper.invoke('getCell', [14, 1]).style.backgroundColor).toBe('');
            expect(helper.invoke('getCell', [1, 1]).style.backgroundColor).toBe('rgb(255, 199, 206)');
            expect(helper.invoke('getCell', [2, 1]).style.backgroundColor).toBe('rgb(255, 199, 206)');
            expect(helper.invoke('getCell', [6, 1]).style.backgroundColor).toBe('');
            done();
        });
        it('Number format - Long Date ', (done: Function) => {
            helper.getElement('#' + helper.id + '_number_format').click();
            helper.getElement('#' + helper.id + '_LongDate').click();
            setTimeout(() => {
                expect(helper.invoke('getCell', [1, 1]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                done();
            });
        });
        it('Apply cf - DateOccurs ->', (done: Function) => {
            helper.invoke('selectRange', ['B1:B20']);
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-menu-item');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#cf_adateoccuring_dlg').click();
            setTimeout((): void => {
                helper.setAnimationToNone('.e-conditionalformatting-dlg.e-dialog');
                const input: HTMLInputElement = helper.getElement('#' + helper.id + ' .e-conditionalformatting-dlg .e-cfmain .e-input') as HTMLInputElement;
                input.value = 'Monday, June 23, 2014';
                const evt: Event = document.createEvent('Event'); evt.initEvent('input', true, true); input.dispatchEvent(evt);
                helper.click(' .e-conditionalformatting-dlg .e-footer-content button:nth-child(1)');
                expect(helper.invoke('getCell', [13, 1]).style.backgroundColor).toBe('');
                expect(helper.invoke('getCell', [5, 1]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                done();
            });
        });
        it('Apply cf - Between ->', (done: Function) => {
            helper.invoke('selectRange', ['B1:B20']);
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-menu-item');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#cf_between_dlg').click();
            setTimeout((): void => {
                helper.setAnimationToNone('.e-conditionalformatting-dlg.e-dialog');
                let Color: any = helper.getElements('.e-conditionalformatting-dlg .e-cfsub .e-dropdownlist')[0];
                Color.ej2_instances[0].value = 'Green Fill with Dark Green Text';
                Color.ej2_instances[0].dataBind();
                helper.getElements('.e-conditionalformatting-dlg .e-cfmain .e-input')[0].value = 'Tuesday, July 22, 2014';
                const input: HTMLInputElement = helper.getElements('.e-conditionalformatting-dlg .e-cfmain .e-input')[1] as HTMLInputElement;
                input.value = 'Sunday, November 30, 2014';
                const evt: Event = document.createEvent('Event'); evt.initEvent('input', true, true); input.dispatchEvent(evt);
                helper.click(' .e-conditionalformatting-dlg .e-footer-content button:nth-child(1)');
                expect(helper.invoke('getCell', [6, 1]).style.backgroundColor).toBe('rgb(198, 239, 206)');
                expect(helper.invoke('getCell', [6, 1]).style.color).toBe('rgb(0, 97, 0)');
                expect(helper.invoke('getCell', [8, 1]).style.backgroundColor).toBe('rgb(198, 239, 206)');
                expect(helper.invoke('getCell', [8, 1]).style.color).toBe('rgb(0, 97, 0)');
                done();
            });
        });
    });

    describe('896806 - CF with clear hyperlink option ->', () => {
        let spreadsheet: any;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{
                    conditionalFormats: [
                        { type: "ThreeArrows", range: 'E1:E11' },
                        { type: 'GreaterThan', cFColor: 'RedFT', value: '10', range: 'E1:E11' },
                    ],
                    ranges: [{ dataSource: defaultData }],
                }, {}]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Apply hyperlink - 1', (done: Function) => {
            helper.switchRibbonTab(2);
            helper.invoke('selectRange', ['E1:E11']);
            helper.getElementFromSpreadsheet('#' + helper.id + '_hyperlink').click();
            setTimeout(() => {
                helper.getElements('.e-hyperlink-dlg .e-webpage input')[1].value = 'www.google.com';
                helper.triggerKeyEvent('keyup', 88, null, null, null, helper.getElements('.e-hyperlink-dlg .e-webpage input')[1]);
                helper.setAnimationToNone('.e-hyperlink-dlg.e-dialog');
                helper.click('.e-hyperlink-dlg .e-footer-content button:nth-child(1)');
                spreadsheet = helper.getInstance();
                let sheet: any = spreadsheet.sheets[0];
                expect(sheet.rows[3].cells[4].hyperlink.address).toBe('http://www.google.com');
                const td: HTMLElement = helper.invoke('getCell', [3, 4]);
                expect(td.querySelector('.e-hyperlink').textContent).toBe('15');
                done();
            });
        });
        it('Clear hyperlink', (done: Function) => {
            helper.switchRibbonTab(1);
            expect(helper.invoke('getCell', [3, 4]).style.backgroundColor).toBe('rgb(255, 199, 206)');
            expect(helper.invoke('getCell', [3, 4]).children[0].classList.contains('e-3arrows-3'));
            helper.invoke('selectRange', ['E2:E6']);
            setTimeout((): void => {
                helper.click('#' + helper.id + '_clear');
                helper.click('#spreadsheet_clear-popup ul li:nth-child(4)');
                setTimeout((): void => {
                    spreadsheet = helper.getInstance();
                    expect(spreadsheet.sheets[0].rows[3].cells[4].hyperlink).toBeUndefined();
                    expect(helper.invoke('getCell', [3, 4]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                    expect(helper.invoke('getCell', [3, 4]).children[0].classList.contains('e-3arrows-3'));
                    expect(helper.invoke('getCell', [5, 4]).children[0].classList.contains('e-3arrows-3'));
                    done();
                });
            });
        });
        it('Undo action', (done: Function) => {
            helper.getElement('#' + helper.id + '_undo').click();
            setTimeout((): void => {
                spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[3].cells[4].hyperlink.address).toBe('http://www.google.com');
                expect(helper.invoke('getCell', [3, 4]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                expect(helper.invoke('getCell', [3, 4]).children[0].classList.contains('e-3arrows-3'));
                done();
            });
        });
        it('Redo action', (done: Function) => {
            helper.getElement('#' + helper.id + '_redo').click();
            setTimeout((): void => {
                spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[3].cells[4].hyperlink).toBeUndefined();
                expect(helper.invoke('getCell', [3, 4]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                expect(helper.invoke('getCell', [3, 4]).children[0].classList.contains('e-3arrows-3'));
                done();
            });
        });
    });
    describe('allowconditionalformat: false ->', () => {
        let spreadsheet: any;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                allowConditionalFormat: false, 
                sheets: [{
                    conditionalFormats: [{ type: "GreaterThan", cFColor: "GreenFT", value:'20', range: 'H1:H11' }],
                    ranges: [{dataSource: defaultData}],
            }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('ConditionalFormat button removed and cell data binding value check', (done: Function) => {
            expect(helper.getElement('#' + helper.id + '_conditionalformatting')).toBeNull();
            spreadsheet = helper.getInstance().sheets[0];
            expect(spreadsheet.rows[3].cells[7].backgroundColor).toBeUndefined();
            expect(helper.invoke('getCell', [3, 7]).style.backgroundColor).toBe('');
            done();
        });
        it('Should not apply conditionalFormat', (done: Function) => {
            helper.invoke('conditionalFormat', [{ type: "GreaterThan", cFColor: 'YellowFT', value: '20', range: 'H12:H15' }]);
            expect(helper.invoke('getCell', [10, 7]).style.backgroundColor).toBe('');
            spreadsheet = helper.getInstance().sheets[0];
            expect(spreadsheet.rows[10].cells[7].backgroundColor).toBeUndefined();
            done();
        });
    });
    describe('beforeConditionalFormat event ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }]}, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Should trigger beforeConditionalFormat event', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            let beforeConditionalFormatCalled: boolean = false;
            let beforeConditionalFormatArgs: string = '';
            spreadsheet.beforeConditionalFormat = (args) => {
                beforeConditionalFormatCalled = true;
                beforeConditionalFormatArgs = JSON.stringify(args);
            };
            helper.invoke('conditionalFormat', [{ type: 'GreaterThan', cFColor: 'RedFT', value: '10', range: 'D2:D11' }]);
            expect(beforeConditionalFormatCalled).toBeTruthy();
            expect(beforeConditionalFormatArgs).toBe('{"conditionalFormat":{"type":"GreaterThan","cFColor":"RedFT","value":"10","range":"D2:D11"},"cell":{"value":50},"element":{},"apply":true,"address":"D11","name":"beforeConditionalFormat"}');
            spreadsheet.beforeConditionalFormat = undefined;
            done();
        });
    });
    describe('EJ2-970855 -> Red font color is applied for the range C11:X11 in imported file ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Red font should not be applied for the range with special characters', (done: Function) => {
            helper.edit('I11', '&123');
            helper.edit('J11', '#sdfb');
            helper.edit('K11', '!sd');
            helper.edit('L11', '-89');
            helper.edit('M11', 'abcd');
            helper.invoke('selectRange', ['C11:X11']);
            helper.invoke('conditionalFormat', [{ type: 'LessThan', cFColor: 'RedFT', value: '0', range: 'C11:X11' }]);
            expect(helper.invoke('getCell', [10, 11]).style.color).toBe('rgb(156, 0, 85)');
            expect(helper.invoke('getCell', [10, 11]).style.backgroundColor).toBe('rgb(255, 199, 206)');
            expect(helper.invoke('getCell', [9, 11]).style.color).not.toBe('rgb(156, 0, 85)');
            expect(helper.invoke('getCell', [9, 11]).style.backgroundColor).not.toBe('rgb(255, 199, 206)');
            expect(helper.invoke('getCell', [8, 11]).style.color).not.toBe('rgb(156, 0, 85)');
            expect(helper.invoke('getCell', [8, 11]).style.backgroundColor).not.toBe('rgb(255, 199, 206)');
            expect(helper.invoke('getCell', [7, 11]).style.color).not.toBe('rgb(156, 0, 85)');
            expect(helper.invoke('getCell', [7, 11]).style.backgroundColor).not.toBe('rgb(255, 199, 206)');
            expect(helper.invoke('getCell', [11, 11]).style.color).not.toBe('rgb(156, 0, 85)');
            expect(helper.invoke('getCell', [11, 11]).style.backgroundColor).not.toBe('rgb(255, 199, 206)');
            done();
        });
    });
    describe('EJ2- 972192: Icon Set Duplication and Script Error on Hyperlinked Accounting-Formatted Cell -> ', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Icon Set should not get duplicated on setting hyperlink to the cell', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('numberFormat', ['_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)', 'H2:H11']);
            helper.invoke('conditionalFormat', [{ type: 'ThreeTrafficLights1', range: 'H2:H11', cFColor: 'RedFT', value: '' }]);
            helper.invoke('addHyperlink', ['www.google.com', 'H2:H11']);
            expect(helper.invoke('getCell', [1, 7]).children[0].classList).toContain('e-icon');
            expect(helper.invoke('getCell', [1, 7]).children[1].classList).toContain('e-hyperlink');
            done();
        });
        it('Script error should not occur while adding wrap to Accounting formatted cell', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.setRowHeight('75', 1, 0);
            spreadsheet.wrap('H2:H11');
            setTimeout(() => {
                expect(spreadsheet.sheets[0].rows[1].height).toBe(75);
                let wrapCnt: HTMLElement = helper.invoke('getCell', [1, 7]).children[0];
                expect(wrapCnt.classList).toContain('e-wrap-content');
                expect(wrapCnt.children[0].classList).toContain('e-icon');
                done();
            });
        });
        it('Clear CF should not affect Accounting Format', (done: Function) => {
            helper.invoke('clearConditionalFormat', ['H2:H11']);
            let wrapCnt: HTMLElement = helper.invoke('getCell', [1, 7]).querySelector('.e-wrap-content');
            expect(wrapCnt.children[0].classList).toContain('e-hyperlink');
            let hyperlinkElement: HTMLElement = wrapCnt.firstChild as HTMLElement;
            expect(hyperlinkElement.children[0].classList).toContain('e-fill-before');
            expect(hyperlinkElement.children[1].classList).toContain('e-fill');
            expect(hyperlinkElement.children[2].classList).toContain('e-fill-sec');
            done();
        });
    });
});
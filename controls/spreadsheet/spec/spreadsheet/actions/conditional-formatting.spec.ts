import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';
import { defaultData, InventoryList } from '../util/datasource.spec';
import { Spreadsheet, clearViewer } from '../../../src/index';
import { getComponent } from '@syncfusion/ej2-base';


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
            helper.invoke('conditionalFormat', [{ type: "Between", cFColor: 'RedT', value: '30,16', range: 'E2:E11' }]);
            expect(helper.invoke('getCell', [2, 4]).style.backgroundColor).toBe('');
            expect(helper.invoke('getCell', [2, 4]).style.color).toBe('rgb(156, 0, 85)');
            expect(helper.invoke('getCell', [4, 4]).style.color).toBe('rgb(156, 0, 85)');
            expect(helper.invoke('getCell', [6, 4]).style.color).toBe('rgb(156, 0, 85)');
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
            expect(helper.invoke('getCell', [1, 4]).children[0].classList).toContain('e-4rating-4');
            expect(helper.invoke('getCell', [2, 4]).children[0].classList).toContain('e-4rating-1');
            expect(helper.invoke('getCell', [3, 4]).children[0].classList).toContain('e-4rating-3');
            expect(helper.invoke('getCell', [4, 4]).children[0].classList).toContain('e-4rating-2');

            helper.invoke('conditionalFormat', [{ type: 'FiveQuarters', range: 'E2:E11' }]);
            expect(helper.invoke('getCell', [1, 4]).children[0].classList).toContain('e-5quarters-5');
            expect(helper.invoke('getCell', [2, 4]).children[0].classList).toContain('e-5quarters-1');
            expect(helper.invoke('getCell', [3, 4]).children[0].classList).toContain('e-5quarters-4');
            expect(helper.invoke('getCell', [4, 4]).children[0].classList).toContain('e-5quarters-3');

            helper.invoke('conditionalFormat', [{ type: 'FiveRating', range: 'E2:E11' }]);
            expect(helper.invoke('getCell', [1, 4]).children[0].classList).toContain('e-5rating-5');
            expect(helper.invoke('getCell', [2, 4]).children[0].classList).toContain('e-5rating-1');
            expect(helper.invoke('getCell', [3, 4]).children[0].classList).toContain('e-5rating-4');
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
            expect(helper.invoke('getCell', [1, 7]).getElementsByClassName('e-databar')[1].style.width).toBe('7%');
            expect(helper.invoke('getCell', [1, 7]).getElementsByClassName('e-databar')[1].style.height).toBe('17px');
            expect(helper.invoke('getCell', [9, 7]).getElementsByClassName('e-databar')[1].style.width).toBe('100%');
            spreadsheet = helper.getInstance();
            spreadsheet.notify(clearViewer, { options: { type: 'Clear Formats', range: 'H2:H11' }, isAction: true });
            expect(helper.invoke('getCell', [1, 7]).querySelector('.e-databar')).toBeNull();
            expect(helper.invoke('getCell', [1, 7]).querySelector('.e-databar')).toBeNull();
            expect(helper.invoke('getCell', [9, 7]).querySelector('.e-databar')).toBeNull();
            helper.invoke('undo');
            expect(helper.invoke('getCell', [1, 7]).getElementsByClassName('e-databar')[1].style.width).toBe('7%');
            expect(helper.invoke('getCell', [1, 7]).getElementsByClassName('e-databar')[1].style.height).toBe('17px');
            expect(helper.invoke('getCell', [9, 7]).getElementsByClassName('e-databar')[1].style.width).toBe('100%');
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

    describe('EJ2-60930 ->', () => {
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
                            rows: [{ cells: [{ value: '444' }, { formula: '=SUM(A1,A2)' }, { formula: '=SUM(B1,B2)' }, { formula: '=SUM(C1,C2)' }] },
                            { cells: [{ value: '555' }, { formula: '=A2+A3' }, { formula: '=B2+B3' }, { formula: '=C2+C3' }] },
                            { cells: [{ value: '666' }, { value: '777' }, { value: '2109' }, { value: '4329' }] }
                            ],
                            conditionalFormats: [
                                { range: 'A1:A3', value: '444,', type: 'GreaterThan', cFColor: 'RedFT' },
                                { type: 'GYRColorScale', range: 'B1:B3', cFColor: 'RedFT', value: '' },
                                { type: 'LightBlueDataBar', range: 'C1:C3', cFColor: 'RedFT', value: '' },
                                { type: 'ThreeArrows', range: 'D1:D3', cFColor: 'RedFT', value: '' }
                            ]
                        },
                        ]
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
                helper.invoke('conditionalFormat', [{ type: "LessThan", cFColor: "RedFT", value: "-100", range: "J2:J6" }]);
                expect(helper.invoke('getCell', [1, 9]).style.backgroundColor).toContain('rgb(255, 199, 206)');
                expect(helper.invoke('getCell', [2, 9]).style.backgroundColor).toBe('rgb(255, 199, 206)');
                expect(helper.invoke('getCell', [3, 9]).style.backgroundColor).toBe('');
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
    });
});
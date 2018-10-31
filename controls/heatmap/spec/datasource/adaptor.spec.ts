import { createElement, L10n, remove, EmitType } from '@syncfusion/ej2-base';
import { HeatMap } from '../../src/heatmap/heatmap';
import { Title } from '../../src/heatmap/model/base';
import { ILoadedEventArgs } from '../../src/heatmap/model/interface'
import { Adaptor } from '../../src/heatmap/index';
import { Legend } from '../../src/heatmap/index';
import { Tooltip } from '../../src/heatmap/index';
HeatMap.Inject(Adaptor, Legend, Tooltip);

export class MouseEvents {
    public mousemoveEvent(element: Element, sx: number, sy: number, cx: number, cy: number): void {
        let mousemove: MouseEvent = document.createEvent('MouseEvent');
        mousemove.initMouseEvent('mousemove', true, false, window, 1, sx, sy, cx, cy, false, false, false, false, 0, null);
        element.dispatchEvent(mousemove);
    }
}

describe('Heatmap Control', () => {
    describe('Heatmap Adaptor properties and its behavior', () => {
        let heatmap: HeatMap;
        let ele: HTMLElement;
        let tempElement: HTMLElement;
        let created: EmitType<ILoadedEventArgs>;
        let trigger: MouseEvents = new MouseEvents();

        let cellNumericData = [[0, 0, null], [0, 1, null], [0, 2, 8], [0, 3, 24], [0, 4, 67],
        [1, 0, 92], [1, 1, 58], [1, 2, 78], [1, 3, 117], [1, 4, 48],
        [2, 0, 35], [2, 1, 15], [2, 2, 123], [2, 3, 64], [2, 4, null],
        [3, 0, 72], [3, 1, 132], [3, 2, null], [3, 3, 19], [3, 4, 16],
        [4, 0, 38], [4, 1, 5], [4, 2, 8], [4, 3, 117], [4, 4, 115],
        [5, 0, 88], [5, 1, 32], [5, 2, 12], [5, 3, 6], [5, 4, 120],
        [6, 0, 13], [6, 1, 44], [6, 2, null], [6, 3, 98], [6, 4, 96],
        [7, 0, 31], [7, 1, 1], [7, 2, 82], [7, 3, 32], [7, 4, 30],
        [8, 0, 85], [8, 1, 97], [8, 2, 123], [8, 3, 64], [8, 4, 84],
        [9, 0, 47], [9, 1, 114], [9, 2, 31], [9, 3, 48], [9, 4, 91]]

        let adaptorData: Object = {
            data: [[10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
            [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
            [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]],
            isJsonData: false,
            adaptorType: "Table",
        };
        // let trigger: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            heatmap = new HeatMap({
                width: "100%",
                height: "300px",
                xAxis: {
                    title: { text: "Weekdays" },
                },
                yAxis: {
                    title: { text: "YAxis" },
                },
                dataSource: adaptorData,
                paletteSettings: {
                    palette: [{ 'value': 100, 'color': "rgb(255, 255, 153)" },
                    { 'color': "rgb(153, 255, 187)" },
                    { 'value': 20, 'color': "rgb(153, 153, 255)" },
                    { 'value': 0, 'color': "rgb(255, 159, 128)" },
                    ],
                    type: "Fixed"
                },
                legendSettings: {
                    visible: false
                },
            });
        });

        afterAll((): void => {
            heatmap.destroy();
        });
        it('Checking heatmap instance creation', (done: Function) => {
            created = (args: Object): void => {
                expect(heatmap != null).toBe(true);
                done();
            }
            heatmap.created = created;
            heatmap.appendTo('#container');
        });
        it('Check twoDImentional table dataSource', () => {
            expect(heatmap.clonedDataSource.length).toBe(10);
            expect(heatmap.clonedDataSource[0].length).toBe(3);
            expect(heatmap.dataSourceMaxValue).toBe(100);
            expect(heatmap.dataSourceMinValue).toBe(10);
        });
        it('Check twoDImentional table dataSource with min and max value', () => {
            heatmap.yAxis.minimum = 2;
            heatmap.xAxis.minimum = 1;
            heatmap.yAxis.maximum = 2;
            heatmap.xAxis.maximum = 5;
            heatmap.xAxis.isInversed = true;
            heatmap.yAxis.isInversed = true;
            heatmap.refresh();
            expect(heatmap.clonedDataSource.length).toBe(1);
            expect(heatmap.clonedDataSource[0].length).toBe(5);
            expect(heatmap.dataSourceMaxValue).toBe(100);
            expect(heatmap.dataSourceMinValue).toBe(30);
        });

        it('Check cell dataSource with x-axis & y-axis as catagory', () => {

            adaptorData = {
                data: cellNumericData,
                isJsonData: false,
                adaptorType: "Cell",
            };
            heatmap.yAxis.minimum = null;
            heatmap.xAxis.minimum = null;
            heatmap.yAxis.maximum = null;
            heatmap.xAxis.maximum = null;
            heatmap.xAxis.isInversed = false;
            heatmap.yAxis.isInversed = false;
            heatmap.dataSource = adaptorData;
            heatmap.dataBind();
            expect(heatmap.clonedDataSource.length).toBe(5);
            expect(heatmap.clonedDataSource[0].length).toBe(10);
            expect(heatmap.dataSourceMaxValue).toBe(132);
            expect(heatmap.dataSourceMinValue).toBe(1);
        });

        it('Check cell dataSource with x-axis & y-axis as catagory', () => {
            heatmap.xAxis.minimum = 2;
            heatmap.xAxis.maximum = 8;
            heatmap.dataBind();
            expect(heatmap.clonedDataSource.length).toBe(5);
            expect(heatmap.clonedDataSource[0].length).toBe(7);
            expect(heatmap.dataSourceMaxValue).toBe(132);
            expect(heatmap.dataSourceMinValue).toBe(1);
        });

        it('Check cell dataSource with x-axis & y-axis as catagory', () => {

            adaptorData = {
                data: null,
                isJsonData: false,
                adaptorType: "Cell",
            };
            heatmap.dataSource = adaptorData;
            heatmap.refresh();
            expect(heatmap.clonedDataSource.length).toBe(1);
            expect(heatmap.clonedDataSource[0].length).toBe(7);
            expect(heatmap.dataSourceMaxValue).toBe(0);
            expect(heatmap.dataSourceMinValue).toBe(0);
        });

        it('Check cell dataSource with x-axis as numeric & y-axis as catagory', () => {

            adaptorData = {
                data: cellNumericData,
                isJsonData: false,
                adaptorType: "Cell",
            };
            heatmap.dataSource = adaptorData;
            heatmap.xAxis.minimum = null;
            heatmap.xAxis.maximum = null;
            heatmap.xAxis.valueType = 'Numeric';
            heatmap.dataBind();
            expect(heatmap.clonedDataSource.length).toBe(5);
            expect(heatmap.clonedDataSource[0].length).toBe(10);
            expect(heatmap.dataSourceMaxValue).toBe(132);
            expect(heatmap.dataSourceMinValue).toBe(1);
        });

        it('Check cell dataSource with x-axis as catagory & y-axis as numeric', () => {

            adaptorData = {
                data: cellNumericData,
                isJsonData: false,
                adaptorType: "Cell",
            };
            heatmap.dataSource = adaptorData;
            heatmap.yAxis.valueType = 'Numeric';
            heatmap.yAxis.minimum = 2;
            heatmap.xAxis.maximum = 5;
            heatmap.xAxis.labels = [];
            heatmap.yAxis.labels = [];
            heatmap.refresh();
            expect(heatmap.clonedDataSource.length).toBe(3);
            expect(heatmap.clonedDataSource[0].length).toBe(6);
            expect(heatmap.dataSourceMaxValue).toBe(123);
            expect(heatmap.dataSourceMinValue).toBe(6);
        });

        it('Check cell dataSource with x-axis as numeric & y-axis as numeric', () => {

            adaptorData = {
                data: cellNumericData,
                isJsonData: false,
                adaptorType: "Cell",
            };
            heatmap.yAxis.maximum = 2;
            heatmap.xAxis.minimum = 5;
            heatmap.yAxis.minimum = null;
            heatmap.xAxis.maximum = null;
            heatmap.xAxis.labels = [];
            heatmap.yAxis.labels = [];
            heatmap.dataSource = adaptorData;
            heatmap.xAxis.valueType = 'Numeric';
            heatmap.yAxis.valueType = 'Numeric';
            heatmap.refresh();
            expect(heatmap.clonedDataSource.length).toBe(3);
            expect(heatmap.clonedDataSource[0].length).toBe(5);
            expect(heatmap.dataSourceMaxValue).toBe(123);
            expect(heatmap.dataSourceMinValue).toBe(1);
        });

        it('Check cell dataSource with x-axis as DateTime & y-axis as DateTime', () => {
            let cellDateData = [[new Date(2018, 1, 1), new Date(2018, 2, 1), 10], [new Date(2018, 1, 1), new Date(2018, 2, 2), null], [new Date(2018, 1, 1), new Date(2018, 2, 3), 8], [new Date(2018, 1, 1), new Date(2018, 2, 4), 24], [new Date(2018, 1, 1), new Date(2018, 2, 5), 67],
            [new Date(2018, 1, 2), new Date(2018, 2, 1), 92], [new Date(2018, 1, 2), new Date(2018, 2, 2), 58], [new Date(2018, 1, 2), new Date(2018, 2, 3), 78], [new Date(2018, 1, 2), new Date(2018, 2, 4), 117], [new Date(2018, 1, 2), new Date(2018, 2, 5), 48]]

            adaptorData = {
                data: cellDateData,
                isJsonData: false,
                adaptorType: "Cell",
            };
            heatmap.yAxis.maximum = null;
            heatmap.xAxis.minimum = null;
            heatmap.yAxis.minimum = null;
            heatmap.xAxis.maximum = null;
            heatmap.xAxis.valueType = 'DateTime';
            heatmap.yAxis.valueType = 'DateTime';
            heatmap.xAxis.labels = [];
            heatmap.yAxis.labels = [];
            heatmap.dataSource = adaptorData;
            heatmap.refresh();
            expect(heatmap.clonedDataSource.length).toBe(5);
            expect(heatmap.clonedDataSource[0].length).toBe(2);
            expect(heatmap.dataSourceMaxValue).toBe(117);
            expect(heatmap.dataSourceMinValue).toBe(8);
        });

        // it('Check cell dataSource with x-axis as DateTime & y-axis as DateTime', () => {
        //     heatmap.xAxis.intervalType = null;
        //     heatmap.yAxis.intervalType = null;
        //     heatmap.refresh();
        //     expect(heatmap.clonedDataSource.length).toBe(5);
        //     expect(heatmap.clonedDataSource[0].length).toBe(2);
        //     expect(heatmap.dataSourceMaxValue).toBe(117);
        //     expect(heatmap.dataSourceMinValue).toBe(8);
        // });

        it('Check cell dataSource Json Table dataSource', () => {
            let jsonTableData = [{
                "Region": "Pacific",
                "Jan": 1,
                "Feb": 0,
                "Mar": 23,
                "Apr": 12,
                "May": 54,
                "Jun": 27,
            },
            {
                "Region": "Moutain",
                "Jan": 45,
                "Feb": 33,
                "Apr": 65,
                "May": 90,
                "Jun": 47,
            },
            {
                "Region": "TestUnknown",
                "Jan": 45,
                "Feb": 33,
                "Mar": 5,
                "Apr": 65,
                "May": 90,
                "Jun": 47,
            }
            ]

            adaptorData = {
                data: jsonTableData,
                isJsonData: true,
                adaptorType: "Table",
                xDataMapping: "Region",
            };
            heatmap.xAxis.labels = ['TestX1', 'Pacific', 'TestX2', 'Moutain', 'TestX3'];
            heatmap.yAxis.labels = ['TestY1', 'Jan', 'Feb', 'Mar', 'TestY2', 'Apr', 'May', 'Jun', 'TestY3'];
            heatmap.dataSource = adaptorData;

            heatmap.refresh();
            expect(heatmap.clonedDataSource.length).toBe(8);
            expect(heatmap.clonedDataSource[0].length).toBe(4);
            expect(heatmap.dataSourceMaxValue).toBe(90);
            expect(heatmap.dataSourceMinValue).toBe(0);
        });

        it('Check cell dataSource Json Table dataSource', () => {

            heatmap.xAxis.labels = null;
            heatmap.yAxis.labels = null;
            heatmap.refresh();
            expect(heatmap.clonedDataSource.length).toBe(1);
            expect(heatmap.clonedDataSource[0].length).toBe(1);
            expect(heatmap.dataSourceMaxValue).toBe(0);
            expect(heatmap.dataSourceMinValue).toBe(0);
        });

        it('Check cell dataSource Json Table dataSource', () => {

            adaptorData = {
                data: [],
                isJsonData: true,
                adaptorType: "Table",
                xDataMapping: "Region",
            };
            heatmap.dataSource = adaptorData;

            heatmap.refresh();
            expect(heatmap.clonedDataSource.length).toBe(1);
            expect(heatmap.clonedDataSource[0].length).toBe(1);
            expect(heatmap.dataSourceMaxValue).toBe(0);
            expect(heatmap.dataSourceMinValue).toBe(0);
        });

        it('Check cell dataSource with Json Cell dataSource', () => {
            let jsonCellData = [
                {
                    "rowid": "TestX1",
                    "columnid": "Jan",
                    "value": "21"
                },
                {
                    "rowid": "Moutain",
                    "columnid": "Feb",
                    "value": "24"
                },
                {
                    "rowid": "Moutain",
                    "columnid": "TestY2",
                    "value": "24"
                },
                {
                    "rowid": "TestX2",
                    "columnid": "Mar",
                    "value": "25"
                },
                {
                    "rowid": "Pacific",
                    "columnid": "Apr",
                    "value": "27"
                },
                {
                    "rowid": "Pacific",
                    "columnid": "TestY1",
                    "value": "27"
                },
                {
                    "rowid": "TestX3",
                    "columnid": "May",
                    "value": "32"
                },
                {
                    "rowid": "TestX3",
                    "columnid": "Jun",
                    "value": "34"
                }
            ];
            adaptorData = {
                data: jsonCellData,
                isJsonData: true,
                adaptorType: "Cell",
                xDataMapping: "rowid",
                yDataMapping: "columnid",
                valueMapping: "value"
            };
            heatmap.xAxis.labels = ['TestX1', 'Pacific', 'TestX2', 'Moutain', 'TestX3'];
            heatmap.yAxis.labels = ['TestY1', 'Jan', 'Feb', 'Mar', 'TestY2', 'Apr', 'May', 'Jun', 'TestY3'];
            heatmap.dataSource = adaptorData;
            heatmap.refresh();
            expect(heatmap.clonedDataSource.length).toBe(8);
            expect(heatmap.clonedDataSource[0].length).toBe(5);
            expect(heatmap.dataSourceMaxValue).toBe(34);
            expect(heatmap.dataSourceMinValue).toBe(21);
        });
        it('Check cell dataSource with Json Cell dataSource', () => {
            heatmap.xAxis.labels = null;
            heatmap.yAxis.labels = null;
            heatmap.refresh();
            expect(heatmap.clonedDataSource.length).toBe(1);
            expect(heatmap.clonedDataSource[0].length).toBe(1);
            expect(heatmap.dataSourceMaxValue).toBe(0);
            expect(heatmap.dataSourceMinValue).toBe(0);
        });
        it('Check cell dataSource with Json Cell dataSource', () => {
            adaptorData = {
                data: [],
                isJsonData: true,
                adaptorType: "Cell",
                xDataMapping: "rowid",
                yDataMapping: "columnid",
                valueMapping: "value"
            };
            heatmap.dataSource = adaptorData;
            heatmap.refresh();
            expect(heatmap.clonedDataSource.length).toBe(1);
            expect(heatmap.clonedDataSource[0].length).toBe(1);
            expect(heatmap.dataSourceMaxValue).toBe(0);
            expect(heatmap.dataSourceMinValue).toBe(0);
        });
        it('Check json cell complex dataSource behaviour', () => {
            let jsonCellComplexData: Object = [
                { 'rowid': { 'row1': 'France' }, 'columnid': { 'col1': { 'col2': '2010' } }, 'Men': { 'son1': '77.6' }, 'Women': { 'women1': { 'son1': '34' } } },
                { 'rowid': { 'row1': 'France' }, 'columnid': { 'col1': { 'col2': '2011' } }, 'Men': { 'son1': '79.4' }, 'Women': { 'women1': { 'son1': '54' } } },
                { 'rowid': { 'row1': 'France' }, 'columnid': { 'col1': { 'col2': '2012' } }, 'Men': { 'son1': '80.8' }, 'Women': { 'women1': { 'son1': '23' } } },
                { 'rowid': { 'row1': 'France' }, 'columnid': { 'col1': { 'col2': '2013' } }, 'Men': { 'son1': '86.6' }, 'Women': { 'women1': { 'son1': '65' } } },
                { 'rowid': { 'row2': 'France' }, 'columnid': { 'col1': { 'col2': '2014' } }, 'Men': { 'son1': '83.7' }, 'Women': { 'women1': { 'son1': '12' } } },
                { 'rowid': { 'row1': 'France' }, 'columnid': { 'col1': { 'col2': '2015' } }, 'Men': { 'son1': '84.5' }, 'Women': { 'women1': { 'son1': '0' } } },
                { 'rowid': { 'row1': 'France' }, 'columnid': { 'col1': { col2: '2016' } }, 'Men': { 'son1': '82.6' }, 'Women': { 'women1': { 'son1': '34' } } },
                { 'rowid': { 'row1': 'USA' }, 'columnid': { 'col1': { 'col2': '2010' } }, 'Men': { 'son1': '60.6' }, 'Women': { 'women1': { 'son1': '' } } },
                { 'rowid': { 'row1': 'USA' }, 'columnid': { 'col1': { 'col2': '2011' } }, 'Men': { 'son1': '' }, 'Women': { 'women1': { 'son1': '87' } } },
                { 'rowid': { 'row1': 'USA' }, 'columnid': { 'col1': { 'col1': '2012' } }, 'Men': { 'son1': '70.8' }, 'Women': { 'women1': { 'son1': '23' } } },
                { 'rowid': { 'row1': 'USA' }, 'columnid': { 'col1': { 'col2': '2013' } }, 'Men': { 'son1': '73.8' }, 'Women': { 'women1': { 'son1': null } } },
                { 'rowid': { 'row1': 'USA' }, 'columnid': { 'col1': { 'col2': '2014' } }, 'Men': { 'son1': '75.3' }, 'Women': { 'women1': { 'son1': '54' } } },
                { 'rowid': { 'row1': 'USA' }, 'columnid': { 'col1': '2015' }, 'Men': { 'son1': '77.5' }, 'Women': { 'women1': { 'son1': '32' } } },
                { 'rowid': { 'row1': 'USA' }, 'columnid': { 'col1': { 'col2': '2016' } }, 'Men': { 'son1': '77.6' }, 'Women': { 'women1': { 'son1': '23' } } },
                { 'rowid': { 'row1': 'Spain' }, 'columnid': { 'col1': { 'col2': '2010' } }, 'Men': { 'son1': '64.9' }, 'Women': { 'women1': { 'son1': '4' } } },
                { 'rowid': { 'row1': 'Spain' }, 'columnid': { 'col1': { 'col2': '2011' } }, 'Men': { 'son1': '52.6' }, 'Women': { 'women1': { 'son1': '56' } } },
                { 'rowid': { 'row1': 'Spain' }, 'columnid': { 'col1': { 'col2': '2012' } }, 'Men': { 'son1': '60.8' }, 'Women': { 'women1': { 'son1': '12' } } },
                { 'rowid': { 'row1': 'Spain' }, 'columnid': { 'col1': { 'col2': '2013' } }, 'Men': { 'son1': '65.6' }, 'Women': { 'women1': { 'son1': '56' } } },
                { 'rowid': { 'row1': 'Spain' }, 'columnid': { 'col1': { 'col2': '2014' } }, 'Men': { 'son1': '52.6' }, 'Women': { 'women1': { 'son1': '67' } } },
                { 'rowid': { 'row1': 'Spain' }, 'columnid': { 'col1': { 'col2': '2015' } }, 'Men': { 'son1': '68.5' }, 'Women': { 'women1': { 'son1': '' } } },
                { 'rowid': { 'row1': 'Spain' }, 'columnid': { 'col1': { 'col2': '2016' } }, 'Men': { 'son1': '75.6' }, 'Women': { 'women1': { 'son1': '34' } } },
                { 'rowid': { 'row1': 'China' }, 'columnid': { 'col1': { 'col2': '2010' } }, 'Men': { 'son1': '55.6' }, 'Women': { 'women1': { 'son1': '53' } } },
                { 'rowid': { 'row1': 'China' }, 'columnid': { 'col1': { 'col2': '2011' } }, 'Men': { 'son1': '52.3' }, 'Women': { 'women1': { 'son1': '13' } } },
                { 'rowid': { 'row1': 'China' }, 'columnid': { 'col1': { 'col2': '2012' } }, 'Men': { 'son1': null }, 'Women': { 'women1': { 'son1': '6' } } },
                { 'rowid': { 'row1': 'China' }, 'columnid': { 'col1': { 'col2': '2013' } }, 'Men': { 'son1': '51.1' }, 'Women': { 'women1': { 'son1': null } } },
                { 'rowid': { 'row1': 'China' }, 'columnid': { 'col1': { 'col2': '2014' } }, 'Men': { 'son1': '55.6' }, 'Women': { 'women1': { 'son1': '54' } } },
                { 'rowid': { 'row1': 'China' }, 'columnid': { 'col1': { 'col2': '2015' } }, 'Men': { 'son1': '56.9' }, 'Women': { 'women1': '12' } },
                { 'rowid': { 'row1': 'China' }, 'columnid': { 'col1': { 'col2': '2016' } }, 'Men': { 'son1': '59.3' }, 'Women': { 'women1': { 'son1': '22' } } },
                { 'rowid': { 'row1': 'Italy' }, 'columnid': { 'col1': { 'col2': '2010' } }, 'Men': { 'son1': '43.6' }, 'Women': { 'women3': { 'son1': '4' } } },
                { 'rowid': { 'row1': 'Italy' }, 'columnid': { 'col1': { 'col2': '2011' } }, 'Men': { 'son1': '43.2' }, 'Women': { 'women1': { 'son1': '12' } } },
                { 'rowid': { 'row1': 'Italy' }, 'columnid': { 'col1': { 'col2': '2012' } }, 'Men': { 'son1': 55.8 }, 'Women': { 'women1': { 'son1': '45' } } },
                { 'rowid': { 'row1': 'Italy' }, 'columnid': { 'col1': { 'col2': '2013' } }, 'Men': { 'son1': '50.1' }, 'Women': { 'women1': { 'son1': '76' } } },
                { 'rowid': { 'row1': 'Italy' }, 'columnid': { 'col1': { 'col2': '2014' } }, 'Men': { 'son1': '48.5' }, 'Women': { 'women1': { 'son1': '22' } } },
                { 'rowid': { 'row1': 'Italy' }, 'columnid': { 'col1': { 'col2': '2015' } }, 'Men': { 'son1': '50.7' }, 'Women': { 'women1': { 'son1': '45' } } },
                { 'rowid': { 'row1': 'Italy' }, 'columnid': { 'col1': { 'col2': '2016' } }, 'Men': { 'son1': '52.4' }, 'Women': { 'women1': { 'son1': '65' } } },
                { 'rowid': { 'row1': 'UK' }, 'columnid': { 'col1': { 'col2': '2010' } }, 'Men': { 'son1': '28.2' }, 'Women': { 'women1': { 'son1': '12' } } },
                { 'rowid': { 'row1': 'UK' }, 'columnid': { 'col1': { 'col2': '2011' } }, 'Men': { 'son1': '31.6' }, 'Women': { 'women1': { 'son1': 45 } } },
                { 'rowid': { 'row1': 'UK' }, 'columnid': { 'col1': { 'col2': '2012' } }, 'Men': { 'son1': '29.8' }, 'Women': { 'women1': { 'son1': 65 } } },
                { 'rowid': { 'row1': 'UK' }, 'columnid': { 'col1': { 'col2': '2013' } }, 'Men': { 'son1': '33.1' }, 'Women': { 'women1': { 'son1': '23' } } },
                { 'rowid': { 'row1': 'UK' }, 'columnid': { 'col1': { 'col2': '2014' } }, 'Men': { 'son1': '32.6' }, 'Women': { 'women1': { 'son1': '54' } } },
                { 'rowid': { 'row1': 'UK' }, 'columnid': { 'col1': { 'col2': '2015' } }, 'Men': { 'son1': '34.4' }, 'Women': { 'women1': { 'son3': '22' } } },
                { 'rowid': 'UK', 'columnid': { 'col1': { 'col2': '2016' } }, 'Men': { 'son1': '35.8' }, 'Women': { 'women1': { 'son1': '55' } } },
                { 'rowid': { 'row1': 'Germany' }, 'columnid': { 'col1': { 'col2': '2010' } }, 'Men': { 'son1': '26.8' }, 'Women': { 'women1': { 'son1': '13' } } },
                { 'rowid': { 'row1': 'Germany' }, 'columnid': { 'col1': { 'col2': '2011' } }, 'Men': { son1: '29' }, 'Women': { 'women1': { 'son1': '65' } } },
                { 'rowid': { 'row1': 'Germany' }, 'columnid': { 'col1': { 'col2': '2012' } }, 'Men': { 'son1': '26.8' }, 'Women': { 'women1': { 'son1': '23' } } },
                { 'rowid': { 'row1': 'Germany' }, 'columnid': { 'col1': { 'col2': '2013' } }, 'Men': { 'son1': '27.6' }, 'Women': { 'women1': { 'son1': '55' } } },
                { 'rowid': { 'row1': 'Germany' }, 'columnid': { 'col1': { 'col2': '2014' } }, 'Men': { 'son1': '33' }, 'Women': { 'women1': { 'son1': '42' } } },
                { 'rowid': { 'row1': 'Germany' }, 'columnid': { 'col1': { 'col2': '2015' } }, 'Men': { 'son1': '35' }, 'Women': { 'women1': { 'son1': '62' } } },
                { 'rowid': { 'row1': 'Germany' }, 'columnid': { 'col1': { 'col2': '2016' } }, 'Men': { 'son1': '35.6' }, 'Women': { 'women1': { son1: '25' } } },
                { 'rowid': { 'row1': 'Mexico' }, 'columnid': { 'col1': { 'col2': '2010' } }, 'Men': { 'son1': '23.2' }, 'Women': { 'women1': { 'son1': '29' } } },
                { 'rowid': { 'row1': 'Mexico' }, 'columnid': { 'col1': { 'col2': '2011' } }, 'Men': { 'son1': '24.9' }, 'Women': { 'women1': { 'son1': '43' } } },
                { 'rowid': { 'row1': 'Mexico' }, 'columnid': { 'col1': { 'col2': '2012' } }, 'Men': { 'son1': '30.1' }, 'Women': { 'women1': { 'son1': '11' } } },
                { 'rowid': { 'row1': 'Mexico' }, 'columnid': { 'col1': { 'col2': '2013' } }, 'Men': { 'son1': '22.2' }, 'Women': { 'women1': { 'son1': '22' } } },
                { 'rowid': { 'row1': 'Mexico' }, 'columnid': { 'col1': { 'col2': '2014' } }, 'Men': { 'son1': '29.3' }, 'Women': { 'women1': { 'son1': '34' } } },
                { 'rowid': { 'row1': 'Mexico' }, 'columnid': { 'col1': { 'col2': '2015' } }, 'Men': { 'son1': '32.1' }, 'Women': { 'women1': { 'son1': '5' } } },
                { 'rowid': { 'row1': 'Mexico' }, 'columnid': { 'col1': { 'col2': '2016' } }, 'Men': { 'son1': '35' }, 'Women': { 'women1': { 'son1': '67' } } },
                { 'rowid': { 'row1': 'Thailand' }, 'columnid': { 'col1': { 'col2': '2010' } }, 'Men': { 'son1': '15.9' }, 'Women': { 'women1': { 'son1': '34' } } },
                { 'rowid': { 'row1': 'Thailand' }, 'columnid': { 'col1': { 'col2': '2011' } }, 'Men': { 'son1': '19.8' }, 'Women': { 'women1': { 'son1': '24' } } },
                { 'rowid': { 'row1': 'Thailand' }, 'columnid': { 'col1': { 'col2': '2012' } }, 'Men': { 'son1': '21.8' }, 'Women': { 'women1': { 'son1': '65' } } },
                { 'rowid': { 'row1': 'Thailand' }, 'columnid': { 'col1': { 'col2': '2013' } }, 'Men': { 'son1': '23.5' }, 'Women': { 'women1': { 'son1': '23' } } },
                { 'rowid': { 'row1': 'Thailand' }, 'columnid': { 'col1': { 'col2': '2014' } }, 'Men': { 'son1': '24.8' }, 'Women': { 'women1': { 'son1': '66' } } },
                { 'rowid': { 'row1': 'Thailand' }, 'columnid': { 'col1': { 'col2': '2015' } }, 'Men': { 'son1': '29.9' }, 'Women': { 'women1': { 'son1': '11' } } },
                { 'rowid': { 'row1': 'Thailand' }, 'columnid': { 'col1': { 'col2': '2016' } }, 'Men': { 'son1': '32.6' }, 'Women': { 'women1': { 'son1': '65' } } },
                { 'rowid': { 'row1': 'Austria' }, 'columnid': { 'col1': { 'col2': '2010' } }, 'Men': { 'son1': '22' }, 'Women': { 'women1': { 'son1': '28' } } },
                { 'rowid': { 'row1': 'Austria' }, 'columnid': { 'col1': { 'col2': '2011' } }, 'Men': { 'son1': '21.3' }, 'Women': { 'women1': { 'son1': '97' } } },
                { 'rowid': { 'row1': 'Austria' }, 'columnid': { 'col1': { 'col2': '2012' } }, 'Men': { 'son1': '24.2' }, 'Women': { 'women1': { 'son1': '76' } } },
                { 'rowid': { 'row1': 'Austria' }, 'columnid': { 'col1': { 'col2': '2013' } }, 'Men': { 'son1': '23.2' }, 'Women': { 'women1': { 'son2': '87' } } },
                { 'rowid': { 'row1': 'Austria' }, 'columnid': { 'col1': { 'col2': '2014' } }, 'Men': { 'son1': '25' }, 'Women': { 'women1': { 'son1': '24' } } },
                { 'rowid': { 'row1': 'Austria' }, 'columnid': { 'col1': { 'col2': '2015' } }, 'Men': { 'son1': '26.7' }, 'Women': { 'women1': { 'son1': '98' } } },
                { 'rowid': { 'row1': 'Austria' }, 'columnid': { 'col1': { 'col2': '2016' } }, 'Men': { 'son1': '28.1' }, 'Women': { 'women1': { 'son1': '100' } } },
            ];
            adaptorData = {
                data: jsonCellComplexData,
                isJsonData: true,
                adaptorType: 'Cell',
                xDataMapping: 'rowid.row1',
                yDataMapping: 'columnid.col1.col2',
                valueMapping: 'Men.son1',
                bubbleDataMapping: { size: 'Men.son1', color: 'Women.women1.son1' }
            };
            heatmap.xAxis.labels = ['Austria', 'China', 'France', 'Germany', 'Italy', 'Mexico', 'Spain', 'Thailand', 'UK', 'USA'];
            heatmap.yAxis.labels = ['2010', '2011', '2012', '2013', '2014', '2015', '2016'];
            heatmap.dataSource = adaptorData;
            heatmap.refresh();
            expect(heatmap.clonedDataSource.length).toBe(7);
            expect(heatmap.clonedDataSource[0].length).toBe(10);
            expect(heatmap.dataSourceMaxValue).toBe(86.6);
            expect(heatmap.dataSourceMinValue).toBe(15.9);
        });
        it('Check complex dataSource with size and color bubble cell', () => {
            heatmap.cellSettings.tileType = 'Bubble';
            heatmap.cellSettings.bubbleType = 'SizeAndColor';
            heatmap.dataBind();
            expect(heatmap.clonedDataSource.length).toBe(7);
            expect(heatmap.clonedDataSource[0].length).toBe(10);
            expect(heatmap.dataSourceMaxValue).toBe(86.6);
            expect(heatmap.dataSourceMinValue).toBe(15.9);
            expect(heatmap.maxColorValue).toBe(100);
            expect(heatmap.minColorValue).toBe(0);
        });
        it('Check complex json table dataSource with size and color bubble cell', () => {
            let jsonTableComplexData: Object = [
                { split1: { 'split2': { 'Region': 'USA', '2000': [93, 54], '2004': [101, 36], '2008': [112, 54], '2012': [103, 45], '2016': [121, 22] } } },
                { split1: { 'split1': { 'Region': 'GBR', '2000': [28, 72], '2004': [30, 65], '2008': [49, 22], '2012': [65, 76], '2016': [67, 75] } } },
                { split1: { 'split2': { 'Region': 'China', '2000': [58, 47], '2004': 63, '2008': [100, ''], '2012': [91, 32], '2016': [70, 89] } } },
                { split1: { 'split2': { 'Region': 'Russia', '2000': [89, 35], '2004': [90, 34], '2008': [60, null], '2012': [69, 24], '2016': [55, 23] } } },
                { split1: { 'split2': { 'Region': 'Germany', '2000': 56, '2004': [49, 65], '2008': [41, 87], '2012': [44, 77], '2016': [42, 45] } } },
                { split3: { 'split2': { 'Region': 'Japan', '2000': [18, 62], '2004': [37, 37], '2008': [25, 83], '2012': [38, 84], '2016': [41, 77] } } },
                { split1: { 'split2': { 'Region': 'France', '2000': [38, 13], '2004': [33, 67], '2008': [43, 22], '2012': [null, 35], '2016': null } } },
                { split1: { 'split2': { 'Region': 'KOR', '2000': [28, 78], '2004': [30, 72], '2008': [32, 55], '2012': [30, 23], '2016': [21, 23] } } },
                { split1: { 'split2': { 'Region': 'Italy', '2000': [34, 77], '2004': [32, 24], '2008': [27, 66], '2012': [28, 56], '2016': [28, ''] } } }
            ];
            heatmap.xAxis.labels = ['China', 'France', 'GBR', 'Germany', 'Italy', 'Japan', 'KOR', 'Russia', 'USA'];
            heatmap.yAxis.labels = ['2000', '2004', '2008', '2012', '2016'];
            heatmap.dataSource = {
                data: jsonTableComplexData,
                isJsonData: true,
                adaptorType: 'Table',
                xDataMapping: 'split1.split2.Region',
            };
            heatmap.refresh();
            expect(heatmap.clonedDataSource.length).toBe(5);
            expect(heatmap.clonedDataSource[0].length).toBe(9);
            expect(heatmap.dataSourceMaxValue).toBe(121);
            expect(heatmap.dataSourceMinValue).toBe(21);
            expect(heatmap.maxColorValue).toBe(89);
            expect(heatmap.minColorValue).toBe(13);
        });
        it('Check complex dataSource with Rect cell', () => {
            heatmap.cellSettings.tileType = 'Rect';
            heatmap.dataBind();
            expect(heatmap.clonedDataSource.length).toBe(5);
            expect(heatmap.clonedDataSource[0].length).toBe(9);
            expect(heatmap.dataSourceMaxValue).toBe(121);
            expect(heatmap.dataSourceMinValue).toBe(21);
        });
        it('Check dataSource without inject Adaptor', () => {
            heatmap.adaptorModule = null;
            heatmap.dataBind();
            expect(heatmap.adaptorModule).toBe(null);
        });
    });
});
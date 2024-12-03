import { createElement, L10n, remove, EmitType } from '@syncfusion/ej2-base';
import { HeatMap } from '../../src/heatmap/heatmap';
import { Title } from '../../src/heatmap/model/base';
import { ILoadedEventArgs, ICellEventArgs } from '../../src/heatmap/model/interface'
import { Adaptor } from '../../src/heatmap/index';
import { MouseEvents } from '../base/event.spec';
import { profile , inMB, getMemoryProfile } from '../../spec/common.spec';
HeatMap.Inject(Adaptor);

describe('Heatmap Control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Heatmap series properties and its behavior', () => {
        let heatmap: HeatMap;
        let ele: HTMLElement;
        let tempElement: HTMLElement;
        let tooltipElement: HTMLElement;
        let created: EmitType<Object>;
        let trigger: MouseEvents = new MouseEvents();
        let adaptorData: Object = {};
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
                dataSource: [[10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]],
                paletteSettings: {
                    palette: [{ 'value': 100, 'color': "rgb(255, 255, 153)" },
                    { 'value': 50, 'color': "rgb(153, 255, 187)" },
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
        it('Change the xAxis in oposit position', () => {
            heatmap.cellSettings.border.width = 2;
            heatmap.cellSettings.border.radius = 2;
            heatmap.yAxis.opposedPosition = true;
            heatmap.dataBind();
            tempElement = document.getElementById('container_HeatMapRect_0');
            expect(tempElement.getAttribute('x') == '11' || tempElement.getAttribute('y') == '10').toBe(true);
        });
        it('Check enableCellHighlighting property', () => {
            heatmap.cellSettings.enableCellHighlighting = false;
            heatmap.refresh();
            tempElement = document.getElementById('container_HeatMapRectLabels_0');
            trigger.mousemoveEvent(tempElement, 0, 0, 5, 5, false);
            tempElement = document.getElementById('container_HeatMapRect_0');
            expect(tempElement.getAttribute('opacity')).toBe("1");
        });
        it('Check enableCellHighlighting property', () => {
            heatmap.cellSettings.enableCellHighlighting = true;
            heatmap.refresh();
            tempElement = document.getElementById('container_HeatMapRectLabels_0');
            trigger.mousemoveEvent(tempElement, 0, 0, 5, 5, false);
            tempElement = document.getElementById('container_HeatMapRect_0');
            expect(tempElement.getAttribute('opacity')).toBe("0.65");
        });
        it('Check format property', () => {
            heatmap.cellSettings.format = "{value}$";
            heatmap.refresh();
            tempElement = document.getElementById('container_HeatMapRectLabels_0');
            expect(tempElement.innerHTML == '100$').toBe(true);
        });
        it('Check showlable property', () => {
            heatmap.cellSettings.showLabel = false;
            heatmap.cellSettings.border.width = 0;
            heatmap.refresh();
            tempElement = document.getElementById('container_HeatMapRectLabels_0');
            expect(tempElement).toBe(null);
        });
        it('Check cell color for a particular cell',() => {
            heatmap.cellSettings.showLabel = true;
            heatmap.cellRender = function (args: ICellEventArgs) {
                if (args.xLabel == '0' && args.yLabel == '9') {
                    args.cellColor = '#898b2b';
                }
            }
            heatmap.refresh();
            tempElement = document.getElementById('container_HeatMapRect_0');
            expect(tempElement.getAttribute('fill') == '#898b2b').toBe(true);
        });
        it('Check enableCanvasRendering property', () => {
            heatmap.renderingMode = "Canvas";
            heatmap.emptyPointColor = "blue";
            heatmap.dataBind();
            tempElement = document.getElementById('container_canvas');
            expect(tempElement).not.toBe(null);
        });
        it('Check bubble type heatmap', (done: Function) => {
            heatmap.renderingMode = "SVG";
            heatmap.cellSettings.tileType = "Bubble";
            heatmap.height = '100%';
            heatmap.showTooltip = true;
            heatmap.dataSource = [[10, 20, 30, 40],
                [10, 20, 30, 40],
                [10, 20, 30, 40]];
            heatmap.cellSettings.showLabel = true;
            heatmap.dataBind();
            tempElement = document.getElementById('container_HeatMapRect_0');
            trigger.mousemoveEvent(tempElement, 0, 0, 0, 20, false);
            trigger.mousemoveEvent(tempElement, 0, 0, 60, 20, false);
            expect(tempElement.getAttribute('opacity')).toBe("0.65");
            tooltipElement = document.getElementById('containerCelltooltipcontainer_svg');
            expect(tooltipElement).not.toBe(null);
            setTimeout(done, 1600);
        });
        it('Check bubble(size) type heatmap', (done: Function) => {
            heatmap.renderingMode = "SVG";
            heatmap.cellSettings.tileType = "Bubble";
            heatmap.cellSettings.bubbleType = "Size";
            heatmap.showTooltip = true;
            heatmap.dataBind();
            tempElement = document.getElementById('container_HeatMapRect_0');
            trigger.mousemoveEvent(tempElement, 0, 0, 0, 20, false);
            trigger.mousemoveEvent(tempElement, 0, 0, 60, 20, false);
            tooltipElement = document.getElementById('containerCelltooltipcontainer_svg');
            expect(tooltipElement).not.toBe(null);
            setTimeout(done, 1600);
        });
        it('Check minimum size option for bubble(size) type heatmap', (done: Function) => {
            heatmap.renderingMode = "SVG";
            heatmap.cellSettings.tileType = "Bubble";
            heatmap.cellSettings.bubbleType = "Size";
            heatmap.cellSettings.bubbleSize.minimum = "50%";
            heatmap.showTooltip = true;
            heatmap.dataBind();
            tempElement = document.getElementById('container_HeatMapRect_0');
            expect(tempElement.getAttribute('r') == "45.25" || tempElement.getAttribute('r') == "45.5");
            setTimeout(done, 1600);
        });
        it('Check maximum size option for bubble(size) type heatmap', (done: Function) => {
            heatmap.renderingMode = "SVG";
            heatmap.cellSettings.tileType = "Bubble";
            heatmap.cellSettings.bubbleType = "Size";
            heatmap.cellSettings.bubbleSize.maximum = "80%";
            heatmap.showTooltip = true;
            heatmap.dataBind();
            tempElement = document.getElementById('container_HeatMapRect_0');
            expect(tempElement.getAttribute('r') == "36.2" || tempElement.getAttribute('r') == "36.4");            setTimeout(done, 1600);
        });
        it('Check minimum size(minimum value) option for bubble(size) type heatmap', (done: Function) => {
            heatmap.renderingMode = "SVG";
            heatmap.cellSettings.tileType = "Bubble";
            heatmap.cellSettings.bubbleType = "Size";
            heatmap.cellSettings.bubbleSize.minimum = "0%";
            heatmap.showTooltip = true;
            heatmap.dataBind();
            tempElement = document.getElementById('container_HeatMapRect_0');
            expect(tempElement.getAttribute('r') == "45.25" || tempElement.getAttribute('r') == "45.5");
            setTimeout(done, 1600);
        });
        it('Check maximum size(maximum value) option for bubble(size) type heatmap', (done: Function) => {
            heatmap.renderingMode = "SVG";
            heatmap.cellSettings.tileType = "Bubble";
            heatmap.cellSettings.bubbleType = "Size";
            heatmap.cellSettings.bubbleSize.maximum = "100%";
            heatmap.showTooltip = true;
            heatmap.dataBind();
            tempElement = document.getElementById('container_HeatMapRect_0');
            expect(tempElement.getAttribute('r') == "36.2" || tempElement.getAttribute('r') == "36.4");            setTimeout(done, 1600);
        });
        it('Check bubble(sector) type heatmap', (done: Function) => {
            heatmap.renderingMode = "SVG";
            heatmap.cellSettings.tileType = "Bubble";
            heatmap.cellSettings.bubbleType = "Sector";
            heatmap.showTooltip = true;
            heatmap.dataBind();
            tempElement = document.getElementById('container_HeatMapRect_0');
            trigger.mousemoveEvent(tempElement, 0, 0, 0, 20, false);
            trigger.mousemoveEvent(tempElement, 0, 0, 60, 20, false);
            tooltipElement = document.getElementById('containerCelltooltipcontainer_svg');
            expect(tooltipElement).not.toBe(null);
            tempElement = document.getElementById('container_HeatMapRectLabels_0');
            expect(tempElement).toBe(null);
            setTimeout(done, 1600);
        });
        it('Check bubble(sector) type heatmap in Canvas mode', (done: Function) => {
            heatmap.renderingMode = "Canvas";
            heatmap.dataBind();
            tempElement = document.getElementById('container');
            heatmap.heatMapMouseMove(<PointerEvent>trigger.onTouchStart(tempElement, null, null, null, null, 0, 80));
            heatmap.heatMapMouseMove(<PointerEvent>trigger.onTouchStart(tempElement, null, null, null, null, 50, 80));
            tempElement = document.getElementById('containerCelltooltipcontainer');
            expect(tempElement.style.visibility).toBe("visible");
            setTimeout(done, 1600);
        });
        it('Check bubble(size) type heatmap in Canvas mode', (done: Function) => {
            heatmap.cellSettings.tileType = "Bubble";
            heatmap.cellSettings.bubbleType = "Size";
            heatmap.cellSettings.border.width = 1;
            heatmap.cellSettings.border.color = 'red';
            heatmap.dataBind();
            tempElement = document.getElementById('container');
            heatmap.heatMapMouseMove(<PointerEvent>trigger.onTouchStart(tempElement, null, null, null, null, 0, 80));
            heatmap.heatMapMouseMove(<PointerEvent>trigger.onTouchStart(tempElement, null, null, null, null, 50, 80));
            tempElement = document.getElementById('containerCelltooltipcontainer');
            expect(tempElement.style.visibility).toBe("visible");
            setTimeout(done, 1600);
        });
        it('Check bubble(size) type heatmap in Canvas mode', (done: Function) => {
            heatmap.cellSettings.tileType = "Bubble";
            heatmap.cellSettings.bubbleType = "Size";
            heatmap.cellSettings.border.width = 1;
            heatmap.cellSettings.border.color = 'red';
            heatmap.dataBind();
            tempElement = document.getElementById('container');
            heatmap.heatMapMouseMove(<PointerEvent>trigger.onTouchStart(tempElement, null, null, null, null, 0, 80));
            heatmap.heatMapMouseMove(<PointerEvent>trigger.onTouchStart(tempElement, null, null, null, null, 50, 80));
            tempElement = document.getElementById('containerCelltooltipcontainer');
            expect(tempElement.style.visibility).toBe("visible");
            setTimeout(done, 1600);
        });
        it('Check bubble(color) type heatmap in Canvas mode', (done: Function) => {
            heatmap.cellSettings.tileType = "Bubble";
            heatmap.cellSettings.bubbleType = "Color";
            heatmap.dataBind();
            tempElement = document.getElementById('container');
            heatmap.heatMapMouseMove(<PointerEvent>trigger.onTouchStart(tempElement, null, null, null, null, 0, 80));
            heatmap.heatMapMouseMove(<PointerEvent>trigger.onTouchStart(tempElement, null, null, null, null, 50, 80));
            tempElement = document.getElementById('containerCelltooltipcontainer');
            expect(tempElement.style.visibility).toBe("visible");
            setTimeout(done, 1600);
        });
        it('Check SizeAndColor type heatmap in Canvas mode', (done: Function) => {
            heatmap.cellSettings.tileType = "Bubble";
            heatmap.cellSettings.bubbleType = "SizeAndColor";
            heatmap.dataSource = [
                [[0, 320], [40, 360]],
                [[80, 240, 40], [120, 280]],
                [['', 240], [120, '']],
                [[160, 160], [200, 200]],
                [[160, null], ['', '']],
                [[240, 80], [280, 120]],
                [[null, 240], 120],
                [[320, 40], [360, 0]],
                [[null, null], [360, 0]]
            ];
            heatmap.refresh();
            tempElement = document.getElementById('container');
            heatmap.heatMapMouseMove(<PointerEvent>trigger.onTouchStart(tempElement, null, null, null, null, 0, 80));
            heatmap.heatMapMouseMove(<PointerEvent>trigger.onTouchStart(tempElement, null, null, null, null, 50, 80));
            tempElement = document.getElementById('containerCelltooltipcontainer');
            expect(tempElement.style.visibility).toBe("visible");
            setTimeout(done, 1600);
        });
        it('Check SizeAndColor type heatmap in Canvas mode', (done: Function) => {
            heatmap.renderingMode = "SVG";
            heatmap.paletteSettings.type = 'Gradient';
            heatmap.legendSettings.showGradientPointer = true;
            heatmap.legendSettings.visible = true;
            heatmap.refresh();
            tempElement = document.getElementById('container');
            tempElement = document.getElementById('container_HeatMapRect_0');
            trigger.mousemoveEvent(tempElement, 0, 0, 0, 20, false);
            trigger.mousemoveEvent(tempElement, 0, 0, 60, 20, false);
            tooltipElement = document.getElementById('containerCelltooltipcontainer_svg');
            expect(tooltipElement).not.toBe(null);
            tempElement = document.getElementById('container_HeatMapRectLabels_0');
            expect(tempElement).toBe(null);
            setTimeout(done, 1600);
        });
        it('Check SizeAndColor type heatmap in cell dataSource with Json Cell dataSource', (done: Function) => {
            let jsonCellData = [
                {
                    "rowid": "TestX1",
                    "columnid": "Jan",
                    "value": "21",
                    "Men": "21",
                    "Women": "11"
                },
                {
                    "rowid": "Moutain",
                    "columnid": "Feb",
                    "value": "24",
                    "Men": null,
                    "Women": "41"
                },
                {
                    "rowid": "Moutain",
                    "columnid": "TestY2",
                    "value": "24",
                    "Men": "41",
                    "Women": "28"
                },
                {
                    "rowid": "TestX2",
                    "columnid": "Mar",
                    "value": "25"
                },
                {
                    "rowid": "Pacific",
                    "columnid": "Apr",
                    "value": "27",
                    "Men": "81",
                    "Women": "14"
                },
                {
                    "rowid": "Pacific",
                    "columnid": "TestY1",
                    "value": "27",
                    "Men": "",
                    "Women": null
                },
                {
                    "rowid": "TestX3",
                    "columnid": "May",
                    "value": "32",
                    "Men": "",
                    "Women": "19"
                },
                {
                    "rowid": "TestX3",
                    "columnid": "Jun",
                    "value": "34"
                },
                {
                    "rowid": "TestX1",
                    "columnid": "Jun",
                    "value": "34",
                    "Men": "50",
                    "Women": "13"
                }
            ];
            adaptorData = {
                isJsonData: true,
                adaptorType: "Cell",
                xDataMapping: "rowid",
                yDataMapping: "columnid",
                valueMapping: "value",
                bubbleDataMapping: { size: 'Men', color: 'Women' }
            };
            
            heatmap.xAxis.labels = ['TestX1', 'Pacific', 'TestX2', 'Moutain', 'TestX3'];
            heatmap.yAxis.labels = ['TestY1', 'Jan', 'Feb', 'Mar', 'TestY2', 'Apr', 'May', 'Jun', 'TestY3'];
            heatmap.dataSource = jsonCellData;
            heatmap.dataSourceSettings = adaptorData;
            heatmap.refresh();
            tempElement = document.getElementById('container_HeatMapRect_0');
            trigger.mousemoveEvent(tempElement, 0, 0, 0, 20, false);
            trigger.mousemoveEvent(tempElement, 0, 0, 60, 20, false);
            tooltipElement = document.getElementById('containerCelltooltipcontainer_svg');
            expect(tooltipElement).not.toBe(null);
            expect(heatmap.tooltipModule.tooltipObject.content[0]).toBe("Weekdays : TestX1<br/>YAxis : Jun<br/>Men : 50$<br/>Women : 13$");
            setTimeout(done, 1600);
        });
        it('Checking cell rendering event', (done: Function) => {
            heatmap.cellSettings = {
                format: '',
                bubbleType: 'Size',
            },
                heatmap.cellRender = function (args: ICellEventArgs) {
                    if (args.value >= 30) {
                        args.displayText = 'test'
                    }
                },
                heatmap.refresh();
            tempElement = document.getElementById('container_HeatMapRectLabels_0');
            expect(tempElement.textContent).toBe("test");
            done();
    });
    });

    describe('Heatmap label template and its behavior', () => {
        let heatmap: HeatMap;
        let ele: HTMLElement;
        let tempElement: HTMLElement;
        let created: EmitType<object>; 
        let adaptorData: object = {};
        beforeAll((): void => {
            ele = createElement('div', { id: 'chart' });
            document.body.appendChild(ele);
            heatmap = new HeatMap({
                cellSettings: {
                    showLabel: true,
                    labelTemplate: '<div>${value}</div>'
                },
                xAxis: {
                    labels: ['China', 'Australia', 'Mexico', 'Canada', 'Brazil', 'USA',
                        'UK', 'Germany', 'Russia', 'France', 'Japan'],
                },
                yAxis: {
                    labels: ['2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017']
                }, paletteSettings: {
                    palette: [
                        { value: -1, color: '#F0D6AD' },
                        { value: 0, color: '#9da49a' },
                        { value: 3.5, color: '#d7c7a7' },
                        { value: 6.0, color: '#6e888f' },
                        { value: 7.5, color: '#466f86' },
                        { value: 10, color: '#19547B' },
                    ],
                },
                dataSource: [
                    [9.5, 2.2, 4.2, 8.2, -0.5, 3.2, 5.4, 7.4, 6.2, 1.4],
                    [4.3, 8.9, 10.8, 6.5, 5.1, 6.2, 7.6, 7.5, 6.1, 7.6],
                    [3.9, 2.7, 2.5, 3.7, 2.6, 5.1, 5.8, 2.9, 4.5, 5.1],
                    [2.4, -3.7, 4.1, 6.0, 5.0, 2.4, 3.3, 4.6, 4.3, 2.7],
                    [2.0, 7.0, -4.1, 8.9, 2.7, 5.9, 5.6, 1.9, -1.7, 2.9],
                    [5.4, 1.1, 6.9, 4.5, 2.9, 3.4, 1.5, -2.8, -4.6, 1.2],
                    [-1.3, 3.9, 3.5, 6.6, 5.2, 7.7, 1.4, -3.6, 6.6, 4.3],
                    [-1.6, 2.3, 2.9, -2.5, 1.3, 4.9, 10.1, 3.2, 4.8, 2.0],
                    [10.8, -1.6, 4.0, 6.0, 7.7, 2.6, 5.6, -2.5, 3.8, -1.9],
                    [6.2, 9.8, -1.5, 2.0, -1.5, 4.3, 6.7, 3.8, -1.2, 2.4],
                    [1.2, 10.9, 4.0, -1.4, 2.2, 1.6, -2.6, 2.3, 1.7, 2.4],
                    [5.1, -2.4, 8.2, -1.1, 3.5, 6.0, -1.3, 7.2, 9.0, 4.2]
                ],
                showTooltip: true
            });
        });

        afterAll((): void => {
            heatmap.destroy();
        });
        it('Checking heatmap cell template creation', (done: Function) => {
            created = (args: object): void => {
                expect(heatmap != null).toBe(true);
                done();
            }
            heatmap.created = created;
            heatmap.appendTo('#chart');
            setTimeout(done, 1600);
        });
        it('Check data render', (done: Function) => {
            tempElement = document.getElementById('chart_LabelTemplate_0');
            expect(tempElement.textContent).toBe("1.4");
            heatmap.appendTo('#chart');
            setTimeout(done, 1600);
        });
        it('Check intial render', (done: Function) => {
            heatmap.cellSettings.labelTemplate = 'HI';
            heatmap.refresh();
            tempElement = document.getElementById('chart_LabelTemplate_0');
            expect(tempElement).toBe(null);
            heatmap.appendTo('#chart');
            setTimeout(done, 1600);
        });
        it('Check Numeric render', (done: Function) => {
            heatmap.xAxis.valueType = 'Numeric';
            heatmap.yAxis.valueType = 'Numeric';
            adaptorData = {
                isJsonData: true,
                adaptorType: 'Table',
                xDataMapping: 'Region',
            };     
            heatmap.xAxis.labels = ['China', 'France', 'GBR', 'Germany', 'Italy', 'Japan', 'KOR', 'Russia', 'USA'],
            heatmap.yAxis.labels = ['2000', '2004', '2008', '2012', '2016'],
            heatmap.dataSourceSettings = adaptorData,
            heatmap.dataSource =  [
                { 'Region': 'USA', '2000': 93, '2004': 101, '2008': 112, '2012': 103, '2016': 121 },
                { 'Region': 'GBR', '2000': 28, '2004': 30, '2008': 49, '2012': 65, '2016': 67 },
                { 'Region': 'China', '2000': 58, '2004': 63, '2008': 100, '2012': 91, '2016': 70 },
                { 'Region': 'Russia', '2000': 89, '2004': 90, '2008': 60, '2012': 69, '2016': 55 },
                { 'Region': 'Germany', '2000': 56, '2004': 49, '2008': 41, '2012': 44, '2016': 42 },
                { 'Region': 'Japan', '2000': 18, '2004': 37, '2008': 25, '2012': 38, '2016': 41 },
                { 'Region': 'France', '2000': 38, '2004': 33, '2008': 43, '2012': 35, '2016': 42 },
                { 'Region': 'KOR', '2000': 28, '2004': 30, '2008': 32, '2012': 30, '2016': 21 },
                { 'Region': 'Italy', '2000': 34, '2004': 32, '2008': 27, '2012': 28, '2016': 28 }
            ],
            heatmap.cellSettings.labelTemplate= '<div>${Region}</div>'
            heatmap.refresh();
            tempElement = document.getElementById('chart_LabelTemplate_0');
            expect(tempElement.textContent).toBe("China");
            heatmap.appendTo('#chart');
            setTimeout(done, 1600);
        });
        it('Check Category render', (done: Function) => {
            heatmap.xAxis.valueType = 'Category';
            heatmap.yAxis.valueType = 'Category';
            adaptorData = {
                isJsonData: true,
                adaptorType: 'Cell',           
                xDataMapping: 'rowid',
                yDataMapping: 'columnid',
                valueMapping: 'value'
            };     
            heatmap.xAxis.labels = ['Austria', 'China', 'France', 'Germany', 'Italy', 'Mexico', 'Spain', 'Thailand', 'UK', 'USA'],
            heatmap.yAxis.labels = ['2010', '2011', '2012', '2013', '2014', '2015', '2016'],
            heatmap.dataSourceSettings = adaptorData,
            heatmap.dataSource =  [
                { 'rowid': 'France', 'columnid': '2010', 'value': '77.6' },
                { 'rowid': 'France', 'columnid': '2011', 'value': '79.4' },
                { 'rowid': 'France', 'columnid': '2012', 'value': '80.8' },
                { 'rowid': 'France', 'columnid': '2013', 'value': '86.6' },
                { 'rowid': 'France', 'columnid': '2014', 'value': '83.7' },
                { 'rowid': 'France', 'columnid': '2015', 'value': '84.5' },
                { 'rowid': 'France', 'columnid': '2016', 'value': '82.6' },
                { 'rowid': 'USA', 'columnid': '2010', 'value': '60.6' },
                { 'rowid': 'USA', 'columnid': '2011', 'value': '65.4' },
                { 'rowid': 'USA', 'columnid': '2012', 'value': '70.8' },
                { 'rowid': 'USA', 'columnid': '2013', 'value': '73.8' },
                { 'rowid': 'USA', 'columnid': '2014', 'value': '75.3' },
                { 'rowid': 'USA', 'columnid': '2015', 'value': '77.5' },
                { 'rowid': 'USA', 'columnid': '2016', 'value': '77.6' },
                { 'rowid': 'Spain', 'columnid': '2010', 'value': '64.9' },
                { 'rowid': 'Spain', 'columnid': '2011', 'value': '52.6' },
                { 'rowid': 'Spain', 'columnid': '2012', 'value': '60.8' },
                { 'rowid': 'Spain', 'columnid': '2013', 'value': '65.6' },
                { 'rowid': 'Spain', 'columnid': '2014', 'value': '52.6' },
                { 'rowid': 'Spain', 'columnid': '2015', 'value': '68.5' },
                { 'rowid': 'Spain', 'columnid': '2016', 'value': '75.6' },
                { 'rowid': 'China', 'columnid': '2010', 'value': '55.6' },
                { 'rowid': 'China', 'columnid': '2011', 'value': '52.3' },
                { 'rowid': 'China', 'columnid': '2012', 'value': '54.8' },
                { 'rowid': 'China', 'columnid': '2013', 'value': '51.1' },
                { 'rowid': 'China', 'columnid': '2014', 'value': '55.6' },
                { 'rowid': 'China', 'columnid': '2015', 'value': '56.9' },
                { 'rowid': 'China', 'columnid': '2016', 'value': '59.3' },
                { 'rowid': 'Italy', 'columnid': '2010', 'value': '43.6' },
                { 'rowid': 'Italy', 'columnid': '2011', 'value': '43.2' },
                { 'rowid': 'Italy', 'columnid': '2012', 'value': '55.8' },
                { 'rowid': 'Italy', 'columnid': '2013', 'value': '50.1' },
                { 'rowid': 'Italy', 'columnid': '2014', 'value': '48.5' },
                { 'rowid': 'Italy', 'columnid': '2015', 'value': '50.7' },
                { 'rowid': 'Italy', 'columnid': '2016', 'value': '52.4' },
                { 'rowid': 'UK', 'columnid': '2010', 'value': '28.2' },
                { 'rowid': 'UK', 'columnid': '2011', 'value': '31.6' },
                { 'rowid': 'UK', 'columnid': '2012', 'value': '29.8' },
                { 'rowid': 'UK', 'columnid': '2013', 'value': '33.1' },
                { 'rowid': 'UK', 'columnid': '2014', 'value': '32.6' },
                { 'rowid': 'UK', 'columnid': '2015', 'value': '34.4' },
                { 'rowid': 'UK', 'columnid': '2016', 'value': '35.8' },
                { 'rowid': 'Germany', 'columnid': '2010', 'value': '26.8' },
                { 'rowid': 'Germany', 'columnid': '2011', 'value': '29' },
                { 'rowid': 'Germany', 'columnid': '2012', 'value': '26.8' },
                { 'rowid': 'Germany', 'columnid': '2013', 'value': '27.6' },
                { 'rowid': 'Germany', 'columnid': '2014', 'value': '33' },
                { 'rowid': 'Germany', 'columnid': '2015', 'value': '35' },
                { 'rowid': 'Germany', 'columnid': '2016', 'value': '35.6' },
                { 'rowid': 'Mexico', 'columnid': '2010', 'value': '23.2' },
                { 'rowid': 'Mexico', 'columnid': '2011', 'value': '24.9' },
                { 'rowid': 'Mexico', 'columnid': '2012', 'value': '30.1' },
                { 'rowid': 'Mexico', 'columnid': '2013', 'value': '22.2' },
                { 'rowid': 'Mexico', 'columnid': '2014', 'value': '29.3' },
                { 'rowid': 'Mexico', 'columnid': '2015', 'value': '32.1' },
                { 'rowid': 'Mexico', 'columnid': '2016', 'value': '35' },
                { 'rowid': 'Thailand', 'columnid': '2010', 'value': '15.9' },
                { 'rowid': 'Thailand', 'columnid': '2011', 'value': '19.8' },
                { 'rowid': 'Thailand', 'columnid': '2012', 'value': '21.8' },
                { 'rowid': 'Thailand', 'columnid': '2013', 'value': '23.5' },
                { 'rowid': 'Thailand', 'columnid': '2014', 'value': '24.8' },
                { 'rowid': 'Thailand', 'columnid': '2015', 'value': '29.9' },
                { 'rowid': 'Thailand', 'columnid': '2016', 'value': '32.6' },
                { 'rowid': 'Austria', 'columnid': '2010', 'value': '22' },
                { 'rowid': 'Austria', 'columnid': '2011', 'value': '21.3' },
                { 'rowid': 'Austria', 'columnid': '2012', 'value': '24.2' },
                { 'rowid': 'Austria', 'columnid': '2013', 'value': '23.2' },
                { 'rowid': 'Austria', 'columnid': '2014', 'value': '25' },
                { 'rowid': 'Austria', 'columnid': '2015', 'value': '26.7' },
                { 'rowid': 'Austria', 'columnid': '2016', 'value': '28.1' },
            ],
            heatmap.cellSettings.labelTemplate= '<div>${rowid}</div>'
            heatmap.refresh();
            tempElement = document.getElementById('chart_LabelTemplate_0');
            expect(tempElement.textContent).toBe("Austria");
            heatmap.appendTo('#chart');
            setTimeout(done, 1600);
        });
    });

    it('memory leak', () => {     
        profile.sample();
        let average: any = inMB(profile.averageChange)
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile())
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    })
});
import { createElement, L10n, remove, EmitType } from '@syncfusion/ej2-base';
import { HeatMap } from '../../src/heatmap/heatmap';
import { Title } from '../../src/heatmap/model/base';
import { ILoadedEventArgs } from '../../src/heatmap/model/interface'
import { Adaptor } from '../../src/heatmap/index';
import { MouseEvents } from '../base/event.spec';
HeatMap.Inject(Adaptor);

describe('Heatmap Control', () => {
    describe('Heatmap series properties and its behavior', () => {
        let heatmap: HeatMap;
        let ele: HTMLElement;
        let tempElement: HTMLElement;
        let tooltipElement: HTMLElement;
        let created: EmitType<ILoadedEventArgs>;
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
            trigger.mousemoveEvent(tempElement, 0, 0, 5, 5);
            tempElement = document.getElementById('container_HeatMapRect_0');
            expect(tempElement.style.opacity).toBe("");
        });
        it('Check enableCellHighlighting property', () => {
            heatmap.cellSettings.enableCellHighlighting = true;
            heatmap.refresh();
            tempElement = document.getElementById('container_HeatMapRectLabels_0');
            trigger.mousemoveEvent(tempElement, 0, 0, 5, 5);
            tempElement = document.getElementById('container_HeatMapRect_0');
            expect(tempElement.style.opacity).toBe("0.65");
        });
        it('Check format property', () => {
            heatmap.cellSettings.format = "{value}$";
            heatmap.refresh();
            tempElement = document.getElementById('container_HeatMapRectLabels_0');
            expect(tempElement.getAttribute('text') == '100$').toBe(true);
        });
        it('Check showlable property', () => {
            heatmap.cellSettings.showLabel = false;
            heatmap.cellSettings.border.width = 0;
            heatmap.refresh();
            tempElement = document.getElementById('container_HeatMapRectLabels_0');
            expect(tempElement).toBe(null);
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
            trigger.mousemoveEvent(tempElement, 0, 0, 0, 20);
            trigger.mousemoveEvent(tempElement, 0, 0, 60, 20);
            expect(tempElement.style.opacity).toBe("0.65");
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
            trigger.mousemoveEvent(tempElement, 0, 0, 0, 20);
            trigger.mousemoveEvent(tempElement, 0, 0, 60, 20);
            tooltipElement = document.getElementById('containerCelltooltipcontainer_svg');
            expect(tooltipElement).not.toBe(null);
            setTimeout(done, 1600);
        });
        it('Check bubble(sector) type heatmap', (done: Function) => {
            heatmap.renderingMode = "SVG";
            heatmap.cellSettings.tileType = "Bubble";
            heatmap.cellSettings.bubbleType = "Sector";
            heatmap.showTooltip = true;
            heatmap.dataBind();
            tempElement = document.getElementById('container_HeatMapRect_0');
            trigger.mousemoveEvent(tempElement, 0, 0, 0, 20);
            trigger.mousemoveEvent(tempElement, 0, 0, 60, 20);
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
            trigger.mousemoveEvent(tempElement, 0, 0, 0, 20);
            trigger.mousemoveEvent(tempElement, 0, 0, 60, 20);
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
                data: jsonCellData,
                isJsonData: true,
                adaptorType: "Cell",
                xDataMapping: "rowid",
                yDataMapping: "columnid",
                valueMapping: "value",
                bubbleDataMapping: { size: 'Men', color: 'Women' }
            };
            heatmap.xAxis.labels = ['TestX1', 'Pacific', 'TestX2', 'Moutain', 'TestX3'];
            heatmap.yAxis.labels = ['TestY1', 'Jan', 'Feb', 'Mar', 'TestY2', 'Apr', 'May', 'Jun', 'TestY3'];
            heatmap.dataSource = adaptorData;
            heatmap.refresh();
            tempElement = document.getElementById('container_HeatMapRect_0');
            trigger.mousemoveEvent(tempElement, 0, 0, 0, 20);
            trigger.mousemoveEvent(tempElement, 0, 0, 60, 20);
            tooltipElement = document.getElementById('containerCelltooltipcontainer_svg');
            expect(tooltipElement).not.toBe(null);
            expect(heatmap.tooltipModule.tooltipObject.content[0]).toBe("Weekdays : TestX1<br/>YAxis : Jun<br/>Men : 50$<br/>Women : 13$");
            setTimeout(done, 1600);
        });
    });
});
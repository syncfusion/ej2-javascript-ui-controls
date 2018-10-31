import { createElement, L10n, remove, EmitType } from '@syncfusion/ej2-base';
import { HeatMap } from '../../src/heatmap/heatmap';
import { Title } from '../../src/heatmap/model/base';
import { ILoadedEventArgs } from '../../src/heatmap/model/interface'
import { Adaptor } from '../../src/heatmap/index';
import { Legend } from '../../src/heatmap/index';
import { Tooltip } from '../../src/heatmap/index';
import { MouseEvents } from './event.spec';
HeatMap.Inject(Adaptor, Legend, Tooltip);

describe('Heatmap Control', () => {
    describe('Heatmap direct properties and its behavior', () => {
        let heatmap: HeatMap;
        let ele: HTMLElement;
        let text: HTMLElement;
        let created: EmitType<ILoadedEventArgs>;
        let data: number[][] = [
            [1, 2, 3, 4, 5],
            [1, 2, 3, 4, 5],
            [1, 2, 3, 4, 5],
            [1, 2, 3, 4, 5],
            [1, 2, 3, 4, 5],
        ]
        let trigger: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            heatmap = new HeatMap({
                dataSource: data,
                legendSettings: {
                    visible: false
                }
            });
        });

        afterAll((): void => {
            heatmap.destroy();
        });
        it('Checking module name', () => {
            expect(heatmap.getModuleName()).toBe('heatmap');
        });
        it('Checking heatmap instance creation', (done: Function) => {
            created = (args: Object): void => {
                expect(heatmap != null).toBe(true);
                done();
            }
            heatmap.created = created;
            heatmap.appendTo('#container');
        });

        it('Checking with  title', () => {
            heatmap.titleSettings.text = "Heat Map";
            heatmap.refresh();
            text = document.getElementById('container_HeatmapTitle');
            expect(text.textContent == 'Heat Map').toBe(true);
            expect(text.getAttribute('x') == '383.5' || text.getAttribute('y') == '22.75').toBe(true);
        });
        it('Check title with text alignment', () => {
            heatmap.titleSettings.text = "Heat Map";
            heatmap.titleSettings.textStyle.textAlignment = "Far";
            heatmap.refresh();
            text = document.getElementById('container_HeatmapTitle');
            expect(text.textContent == 'Heat Map').toBe(true);
            expect(text.getAttribute('x') == '757' || text.getAttribute('x') == '759' || text.getAttribute('y') == '25' || text.getAttribute('y') == '22.75').toBe(true);
        });
        it('Check title with text alignment', () => {
            heatmap.titleSettings.text = "Heat Map";
            heatmap.titleSettings.textStyle.textAlignment = "Near";
            heatmap.refresh();
            text = document.getElementById('container_HeatmapTitle');
            expect(text.textContent == 'Heat Map').toBe(true);
            expect(text.getAttribute('x') == '10' && (text.getAttribute('y') == '25' || text.getAttribute('y') == '22.75')).toBe(true);
        });
        it('Check the heat map with out title', () => {
            heatmap.titleSettings.text = "";
            heatmap.dataBind();
            text = document.getElementById('container_HeatmapTitle');
            expect(text == undefined).toBe(true);
        });
        it('Check title with text wrap', () => {
            heatmap.titleSettings.text = "A heat map is a graphical representation of data where the values contained in a matrix are represented as colors. The user defined data should be plotted against the horizontal and vertical labels to a grid like UI with color varying for each data value";
            heatmap.titleSettings.textStyle.textOverflow = "Wrap"
            heatmap.refresh();
            text = document.getElementById('container_HeatmapTitle1');
            expect(text.getAttribute('x') == '10' && (text.getAttribute('y') == '45' || text.getAttribute('y') == '39.75')).toBe(true);
        });

        it('Check title with text wrap in canvas', () => {
            heatmap.titleSettings.text = "A heat map is a graphical representation of data where the values contained in a matrix are represented as colors. The user defined data should be plotted against the horizontal and vertical labels to a grid like UI with color varying for each data value";
            heatmap.titleSettings.textStyle.textOverflow = "Wrap"
            heatmap.renderingMode = "Canvas";
            heatmap.refresh();
            expect(heatmap.tooltipCollection.length == 0).toBe(true);
        });

        it('Check heat map with empty data source', () => {
            heatmap.dataSource = [];
            heatmap.renderingMode = "SVG";
            heatmap.refresh();
            expect(heatmap.axisCollections[0].maxLength == 0 && heatmap.axisCollections[1].maxLength == 0).toBe(true);
        });
        it('Check heat map with different legnth data', () => {
            heatmap.dataSource = [
                [1, 2, 3],
                [4, 5, 6, 7],
                [8, 9],
            ];
            heatmap.refresh();
            expect(heatmap.axisCollections[0].maxLength == 2 && heatmap.axisCollections[1].maxLength == 3).toBe(true);
        });
        it('Check cellClick client side event', (done: Function) => {
            heatmap.dataSource = [
                [1, 2, 3],
                [4, 5, 6, 7],
                [8, 9],
            ];
            heatmap.cellClick = function (args) {
                expect(args.value == 7).toBe(true);
                done()
            }
            heatmap.refresh();
            let element: Element = document.getElementById("container_HeatMapRect_1");
            let region: ClientRect = element.getBoundingClientRect();
            trigger.clickEvent(element, 0, 0, region.left + 10, region.top + 10);
        });

        it('Check cellClick client side event', (done: Function) => {
            heatmap.dataSource = [
                [1, 2, 3],
                [4, 5, 6, 7],
                [8, 9],
            ];
            heatmap.cellClick = function (args) {
                expect(args.value == 7).toBe(true);
                done()
            }
            heatmap.refresh();
            let element: Element = document.getElementById("container_HeatMapRect_1");
            let region: ClientRect = element.getBoundingClientRect();
            heatmap.heatMapMouseClick(<PointerEvent>trigger.onTouchStart(element, null, null, null, null, region.left + 10, region.top + 10));
        });

        //title tooltip
        it('Check title tool tip', (done: Function) => {
            heatmap.dataSource = [
                [1, 2, 3],
                [4, 5, 6, 7],
                [8, 9],
            ];
            heatmap.renderingMode = "SVG";
            heatmap.titleSettings.text = "A heat map is a graphical representation of data where the values contained in a matrix are represented as colors. A heat map is a graphical representation of data where the values contained in a matrix are represented as colors.";
            heatmap.titleSettings.textStyle.textOverflow = "Trim";
            heatmap.refresh();
            let element: Element = document.getElementById("container_HeatmapTitle");
            let region: ClientRect = element.getBoundingClientRect();
            trigger.mousemoveEvent(element, 0, 0, region.left + 10, region.top + 5);
            let tooltipElement: Element = document.getElementById("container_Title_Tooltip");
            expect(tooltipElement.textContent == 'A heat map is a graphical representation of data where the values contained in a matrix are represented as colors. A heat map is a graphical representation of data where the values contained in a matrix are represented as colors.').toBe(true);
            trigger.mousemoveEvent(element, 0, 0, region.left + 15, region.top + 5);
            element = document.getElementById("container_Title_Tooltip");
            expect(tooltipElement.textContent == 'A heat map is a graphical representation of data where the values contained in a matrix are represented as colors. A heat map is a graphical representation of data where the values contained in a matrix are represented as colors.').toBe(true);
            done();
        });

        it('Check title tool tip in touch', (done: Function) => {
            heatmap.titleSettings.textStyle.textOverflow = "Trim";
            heatmap.refresh();
            let element: Element = document.getElementById("container_HeatmapTitle");
            let region: ClientRect = element.getBoundingClientRect();
            heatmap.heatMapMouseMove(<PointerEvent>trigger.onTouchStart(element, null, null, null, null, region.left + 10, region.top + 5));
            let tooltipElement: Element = document.getElementById("container_Title_Tooltip");
            expect(tooltipElement.textContent == 'A heat map is a graphical representation of data where the values contained in a matrix are represented as colors. A heat map is a graphical representation of data where the values contained in a matrix are represented as colors.').toBe(true);
            setTimeout(done, 1600);
        });

        it('Check title tool tip without trim', (done: Function) => {
            heatmap.dataSource = [
                [1, 2, 3],
                [4, 5, 6, 7],
                [8, 9],
            ];
            heatmap.titleSettings.text = "A heat map is a graphical representation of data where the values contained in a matrix are represented as colors.";
            heatmap.titleSettings.textStyle.textOverflow = "None";
            heatmap.refresh();
            let element: Element = document.getElementById("container_HeatmapTitle");
            let region: ClientRect = element.getBoundingClientRect();
            trigger.mousemoveEvent(element, 0, 0, region.left + 10, region.top + 5);
            element = document.getElementById("container_Title_Tooltip");
            expect(element == null).toBe(true);
            done();
        });

        it('Check title tool tip remove when title not trimmed', (done: Function) => {
            heatmap.dataSource = [
                [1, 2, 3],
                [4, 5, 6, 7],
                [8, 9],
            ];
            heatmap.titleSettings.text = "Heat map";
            heatmap.titleSettings.textStyle.textOverflow = "Trim";
            heatmap.refresh();
            let element: Element = document.getElementById("container_HeatmapTitle");
            let region: ClientRect = element.getBoundingClientRect();
            trigger.mousemoveEvent(element, 0, 0, region.left + 10, region.top + 5);
            element = document.getElementById("container_Title_Tooltip");
            expect(element == null).toBe(true);
            done();
        });

        it('Checking heatmap instance creation - canvas', (done: Function) => {
            remove(heatmap.svgObject);
            created = (args: Object): void => {
                expect(heatmap != null).toBe(true);
                done();
            }
            heatmap.renderingMode = "Canvas";
            heatmap.created = created;
            heatmap.dataBind();
        });
        it('Check title tool tip', (done: Function) => {
            heatmap.dataSource = [
                [1, 2, 3],
                [4, 5, 6, 7],
                [8, 9],
            ];
            heatmap.renderingMode = "Canvas";
            heatmap.titleSettings.text = "A heat map is a graphical representation of data where the values contained in a matrix are represented as colors. A heat map is a graphical representation of data where the values contained in a matrix are represented as colors.";
            heatmap.titleSettings.textStyle.textOverflow = "Trim";
            heatmap.titleSettings.textStyle.size = '15';
            heatmap.titleSettings.textStyle.fontWeight = 'regular';
            heatmap.yAxis.title.text = "yAxis";
            heatmap.refresh();
            let element: Element = document.getElementById("container_canvas");
            trigger.mousemoveEvent(element, 0, 0, 28, 27);
            element = document.getElementById("container_canvas_Tooltip");
            expect(element.textContent == 'A heat map is a graphical representation of data where the values contained in a matrix are represented as colors. A heat map is a graphical representation of data where the values contained in a matrix are represented as colors.').toBe(true);
            done();
        });
        it('Check title tooltip remove', () => {
            let tempElement : Element = document.getElementById('container');
            heatmap.heatMapMouseLeave(<PointerEvent>trigger.onTouchStart(tempElement, null, null, null, null, 0, 0));
            let element : Element = document.getElementById('container_canvas_Tooltip');
            expect(element == null).toBe(true);
        });
        it('Check title tooltip remove in SVG', () => {
            heatmap.renderingMode = "SVG";
            heatmap.refresh();
            let tempElement : Element = document.getElementById('container');
            heatmap.heatMapMouseLeave(<PointerEvent>trigger.onTouchStart(tempElement, null, null, null, null, 0, 0));
            let element : Element = document.getElementById('container_Title_Tooltip');
            expect(element == null).toBe(true);
        });
        it('Check title tool tip', (done: Function) => {
            heatmap.dataSource = [
                [1, 2, 3],
                [4, 5, 6, 7],
                [8, 9],
            ];
            heatmap.renderingMode = "Canvas";
            heatmap.titleSettings.text = "A heat map is a graphical representation of data where the values contained in a matrix are represented as colors.A heat map is a graphical representation of data where the values contained in a matrix are represented as colors.";
            heatmap.titleSettings.textStyle.textOverflow = "Trim";
            heatmap.yAxis.title.text = "yAxis";
            heatmap.refresh();
            let element: Element = document.getElementById("container_canvas");
            trigger.mousemoveEvent(element, 0, 0, 28, 57);
            element = document.getElementById("container_canvas_Tooltip");
            expect(element == null).toBe(true);
            done();
        });

        it('Check axis label tool tip', (done: Function) => {
            heatmap.dataSource = [
                [1, 2, 3],
                [4, 5, 6, 7],
                [8, 9],
            ];
            heatmap.renderingMode = "SVG";
            heatmap.titleSettings.text = "";
            heatmap.titleSettings.textStyle.textOverflow = "Trim";
            heatmap.yAxis.title.text = "yAxis";
            heatmap.xAxis.labels = ["This my new testing for heat map axis labels This my new testing for heat map axis labels", "testing1", "testing2"]
            heatmap.xAxis.textStyle.textOverflow = "Trim";
            heatmap.refresh();
            let element: Element = document.getElementById("container_XAxis_Label0");
            let region: ClientRect = element.getBoundingClientRect();
            trigger.mousemoveEvent(element, 0, 0, region.left + 5, region.height + 5);
            element = document.getElementById("container_axis_Tooltip");
            expect(element.textContent == "This my new testing for heat map axis labels This my new testing for heat map axis labels").toBe(true);
            done();
        });

        it('check with empty data source', (done: Function) => {
            heatmap.dataSource = [];
            heatmap.titleSettings.text = "";
            heatmap.yAxis.title.text = "yAxis";
            heatmap.xAxis.labels = ["testing", "testing1", "testing2"]
            heatmap.xAxis.textStyle.textOverflow = "Trim";
            heatmap.paletteSettings.palette = [];
            heatmap.paletteSettings.type = "Gradient";
            heatmap.legendSettings.visible = true;
            heatmap.refresh();
            expect(heatmap.dataSourceMinValue == 0).toBe(true);
            done();
        });

        it('check getPersistData returns value', () => {
            var returnString = heatmap.getPersistData();
            expect(returnString).toBe("");
            heatmap.paletteSettings.type = "Gradient";
            heatmap.dataBind();
            expect(heatmap.dataSourceMinValue == 0).toBe(true);
        });

        it('check heatmap resize action', (done: Function) => {
            heatmap.heatMapResize(event);
            expect(heatmap.dataSourceMinValue == 0).toBe(true);
            setTimeout(done, 1600);
        });
        it('check heatmap resize action', (done: Function) => {
            heatmap.heatMapResize(event);
            heatmap.isDestroyed = true;
            expect(heatmap.dataSourceMinValue == 0).toBe(true);
            setTimeout(done, 1600);
        });
        it('check heatmap resize action', (done: Function) => {
            heatmap.heatMapResize(event);
            heatmap.heatMapResize(event);
            expect(heatmap.dataSourceMinValue == 0).toBe(true);
            setTimeout(done, 1600);
        });
        it('check heatmap resize action', (done: Function) => {
            heatmap.heatMapResize(event);
            expect(heatmap.dataSourceMinValue == 0).toBe(true);
            setTimeout(done, 1600);
        });
        it('Check legend tooltip visibility', (done: Function) => {
            heatmap.dataSource = [
                [1, 2, 3],
                [4, 5, 6, 7],
                [8, 9],
            ];
            heatmap.paletteSettings.type = 'Fixed';
            heatmap.legendSettings.enableSmartLegend = true;
            heatmap.legendSettings.labelDisplayType = 'None'
            heatmap.dataBind();
            let element: Element = document.getElementById("container_Smart_Legend1");
            let region: ClientRect = element.getBoundingClientRect();
            trigger.mousemoveEvent(element, 5, 5, region.left +5, region.top + 5);
            heatmap.heatMapMouseLeave(<PointerEvent>trigger.onTouchStart(element, null, null, null, null, 0, 0));
            let tooltip: HTMLElement = document.getElementById('containerlegendLabelTooltipContainer');
            setTimeout(done, 1600);
            expect(tooltip.style.visibility).toBe("visible");
      });
        it('Check heat map with minimum height and width', () => {
            heatmap.dataSource = [
                [1, 2, 3],
                [4, 5, 6, 7],
                [8, 9],
            ];
            heatmap.height = "50px";
            heatmap.width = "50px";
            heatmap.paletteSettings.type = 'Gradient';
            heatmap.legendSettings.visible = true;
            heatmap.legendSettings.position = "Right";
            heatmap.dataBind();     
            expect((heatmap.initialClipRect.height === 4 || heatmap.initialClipRect.height === 5) && (heatmap.initialClipRect.width === -62 || heatmap.initialClipRect.width === -61)).toBe(true);
        });
        it('Check heat map with minimum height and width', () => {
            heatmap.dataSource = [
                [1, 2, 3],
                [4, 5, 6, 7],
                [8, 9],
            ];
            heatmap.height = "50px";
            heatmap.width = "50px";
            heatmap.paletteSettings.type = 'Gradient';
            heatmap.legendSettings.visible = true;
            heatmap.legendSettings.position = "Bottom";
            heatmap.titleSettings.text = "";
            heatmap.dataBind();
            expect((heatmap.initialClipRect.height === -54 || heatmap.initialClipRect.height === -52) && (heatmap.initialClipRect.width === -12 || heatmap.initialClipRect.width === -11)).toBe(true);
        });
        it('Check heat map with minimum height and width', () => {
            heatmap.dataSource = [
                [1, 2, 3],
                [4, 5, 6, 7],
                [8, 9],
            ];
            heatmap.height = "20px";
            heatmap.width = "20px";
            heatmap.paletteSettings.type = 'Gradient';
            heatmap.legendSettings.visible = true;
            heatmap.legendSettings.position = "Right";
            heatmap.titleSettings.text = "Testing";
            heatmap.dataBind();
            expect((heatmap.initialClipRect.height === -62 || heatmap.initialClipRect.height === -58) && (heatmap.initialClipRect.width === -92 || heatmap.initialClipRect.width === -91)).toBe(true);
        });
    });
});
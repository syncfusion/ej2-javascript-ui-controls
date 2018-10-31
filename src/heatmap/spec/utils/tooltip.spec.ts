import { createElement, L10n, remove, EmitType } from '@syncfusion/ej2-base';
import { HeatMap } from '../../src/heatmap/heatmap';
import { Title } from '../../src/heatmap/model/base';
import { ILoadedEventArgs, ITooltipEventArgs } from '../../src/heatmap/model/interface'
import { Adaptor } from '../../src/heatmap/index';
import { Legend } from '../../src/heatmap/index';
import { Tooltip } from '../../src/heatmap/index';
import { MouseEvents } from '../base/event.spec';
HeatMap.Inject(Adaptor, Legend, Tooltip);

describe('Heatmap Control', () => {
    describe('Heatmap tooltip properties and its behavior', () => {
        let heatmap: HeatMap;
        let ele: HTMLElement;
        let tempElement: HTMLElement;
        let created: EmitType<ILoadedEventArgs>;
        let trigger: MouseEvents = new MouseEvents();
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
                dataSource: [[10, "", 30, 40, 50, 60, 70, 80, 90, 100],
                [10, 20, 30, null, 50, 60, 70, 80, 90, 100],
                [10, 20, 30, 0, 50, 60, 70, 80, 90, 100]],
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
                showTooltip: true,
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
        it('Check tooltip visibility for a null cell', () => {
            tempElement = document.getElementById('container_HeatMapRect_24');
            trigger.mousemoveEvent(tempElement, 0, 0, 60, 220);
            tempElement = document.getElementById('containerCelltooltipcontainer_svg');
            expect(tempElement).toBe(null);
        });
        it('Check tooltip visibility for a value exist cell', () => {
            heatmap.cellSettings.enableCellHighlighting = true;
            heatmap.refresh();
            tempElement = document.getElementById('container_HeatMapRect_24');
            trigger.mousemoveEvent(tempElement, 0, 0, 60, 20);
            tempElement = document.getElementById('containerCelltooltipcontainer_svg');
            expect(tempElement).not.toBe(null);
        });
        it('Check tooltip visibility for a value exist cell and move to another cell', () => {
            tempElement = document.getElementById('container_HeatMapRect_24');
            trigger.mousemoveEvent(tempElement, 0, 0, 60, 20);
            tempElement = document.getElementById('container_HeatMapRect_24');
            trigger.mousemoveEvent(tempElement, 0, 0, 60, 60);
            tempElement = document.getElementById('containerCelltooltipcontainer_svg');
            expect(tempElement).not.toBe(null);
        });
        it('Check tooltip visibility for a value exist cell and move to outer and come back', () => {
            tempElement = document.getElementById('container_HeatMapRect_24');
            trigger.mousemoveEvent(tempElement, 0, 0, 60, 20);
            tempElement = document.getElementById('container_HeatMapRect_24');
            trigger.mousemoveEvent(tempElement, 0, 0, 60, 0);
            tempElement = document.getElementById('container_HeatMapRect_24');
            trigger.mousemoveEvent(tempElement, 0, 0, 60, 60);
            tempElement = document.getElementById('containerCelltooltipcontainer_svg');
            expect(tempElement).not.toBe(null);
        });
        it('Check tooltip template visibility', () => {
            heatmap.tooltipRender = function (args: ITooltipEventArgs) {
                args.content = [args.xLabel + "-" + args.yLabel + "=" + parseInt(args.value.toString()) * 10];
            };
            heatmap.refresh();
            tempElement = document.getElementById('container_HeatMapRect_1');
            trigger.mousemoveEvent(tempElement, 0, 0, 60, 20);
            tempElement = document.getElementById('containerCelltooltipcontainer_svg');
            expect(tempElement).not.toBe(null);
        });
        it('Check tooltip template visibility in empty text cell', () => {
            tempElement = document.getElementById('container_HeatMapRect_24');
            trigger.mousemoveEvent(tempElement, 0, 0, 60, 220);
            tempElement = document.getElementById('containerCelltooltipcontainer');
            expect(tempElement.style.visibility).toBe("hidden");
        });
        it('Check tooltip visibility beyond heatmap container', () => {
            tempElement = document.getElementById('container');
            heatmap.heatMapMouseLeave(<PointerEvent>trigger.onTouchStart(tempElement, null, null, null, null, 0, 0));
            tempElement = document.getElementById('containerCelltooltipcontainer');
            expect(tempElement.style.visibility).toBe("hidden");
        });
        it('Check tooltip visibility on touch', (done: Function) => {
            tempElement = document.getElementById('container_HeatMapRect_1');
            heatmap.heatMapMouseMove(<PointerEvent>trigger.onTouchStart(tempElement, null, null, null, null, 70, 80));
            tempElement = document.getElementById('containerCelltooltipcontainer');
            expect(tempElement.style.visibility).toBe("visible");
            setTimeout(done, 1600);
        });
        it('Check tooltip visibility on touch', (done: Function) => {
            tempElement = document.getElementById('container_HeatMapRect_2');
            heatmap.heatMapMouseMove(<PointerEvent>trigger.onTouchStart(tempElement, null, null, null, null, 70, 80));
            tempElement = document.getElementById('container_HeatMapRect_3');
            heatmap.heatMapMouseMove(<PointerEvent>trigger.onTouchStart(tempElement, null, null, null, null, 170, 80));
            tempElement = document.getElementById('containerCelltooltipcontainer');
            expect(tempElement.style.visibility).toBe("visible");
            setTimeout(done, 1600);
        });
        it('Check tooltip visibility on touch', (done: Function) => {
            heatmap.paletteSettings.type = 'Gradient';
            heatmap.legendSettings.showGradientPointer = true;
            heatmap.legendSettings.visible = true;
            heatmap.refresh();
            tempElement = document.getElementById('container_HeatMapRect_2');
            heatmap.heatMapMouseLeave(<PointerEvent>trigger.onTouchStart(tempElement, null, null, null, null, 70, 80));
            expect(tempElement.style.visibility).toBe('');
            setTimeout(done, 1600);
        });
        it('Check tooltip visibility on touch', (done: Function) => {
            heatmap.renderingMode = 'Canvas';
            heatmap.refresh();
            tempElement = document.getElementById('container');
            heatmap.heatMapMouseMove(<PointerEvent>trigger.onTouchStart(tempElement, null, null, null, null, 70, 80));
            tempElement = document.getElementById('container');
            heatmap.heatMapMouseMove(<PointerEvent>trigger.onTouchStart(tempElement, null, null, null, null, 170, 80));
            tempElement = document.getElementById('containerCelltooltipcontainer');
            expect(tempElement.style.visibility).toBe("visible");
            setTimeout(done, 1600);
        });
        it('Check tooltip visibility on touch', (done: Function) => {
            tempElement = document.getElementById('container');
            heatmap.heatMapMouseLeave(<PointerEvent>trigger.onTouchStart(tempElement, null, null, null, null, 70, 80));
            expect(tempElement.style.visibility).toBe('');
            setTimeout(done, 1600);
        });
        it('Check tooltip template visibility while cancel it', () => {
            heatmap.tooltipRender = function (args: ITooltipEventArgs) {
                args.cancel = true;
            };
            heatmap.renderingMode = 'SVG';
            heatmap.refresh();
            tempElement = document.getElementById('container_HeatMapRect_1');
            trigger.mousemoveEvent(tempElement, 0, 0, 60, 20);
            tempElement = document.getElementById('containerCelltooltipcontainer_svg');
            expect(tempElement).toBe(null);
        });
    });
});
import { createElement, L10n, remove, EmitType } from '@syncfusion/ej2-base';
import { HeatMap } from '../../src/heatmap/heatmap';
import { Title } from '../../src/heatmap/model/base';
import { ILoadedEventArgs } from '../../src/heatmap/model/interface'
import { Legend } from '../../src/heatmap/index';
import { MouseEvents } from '../base/event.spec';
HeatMap.Inject( Legend);

describe('Heatmap Control', () => {
    describe('Heatmap series properties and its behavior', () => {
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
                showTooltip: false,
                renderingMode: "Auto",
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
        it('Change the width and height of heatmap', () => {
            heatmap.width = "300px",
            heatmap.height = "400px",
            heatmap.margin.top = 100,
            heatmap.dataBind();
            tempElement = document.getElementById('container_svg');
            expect(tempElement.getAttribute('width') == '300' && tempElement.getAttribute('height') == '400').toBe(true);
        });
        it('Change the width and height of heatmap', () => {
            heatmap.width = "100%",
            heatmap.height = "100%",
            heatmap.dataBind();
            tempElement = document.getElementById('container_svg');
            expect((tempElement.getAttribute('width') == '767' || tempElement.getAttribute('width') == '769') && tempElement.getAttribute('height') == '450').toBe(true);
        });
        it('Change the width and height of heatmap', () => {
            heatmap.theme = "Highcontrast",
            heatmap.dataBind();
            tempElement = document.getElementById('container_HeatmapBorder');
            expect(tempElement.getAttribute('fill') == '#000000').toBe(true);
        });
    });
});
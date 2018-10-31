import { createElement, L10n, remove, EmitType } from '@syncfusion/ej2-base';
import { HeatMap } from '../../src/heatmap/heatmap';
import { Title } from '../../src/heatmap/model/base';
import { ILoadedEventArgs } from '../../src/heatmap/model/interface'
import { Adaptor } from '../../src/heatmap/index';
import { Legend } from '../../src/heatmap/index';
import { Tooltip } from '../../src/heatmap/index';
HeatMap.Inject(Adaptor, Legend, Tooltip);

describe('Heatmap Control', () => {
    describe('Heatmap series properties and its behavior', () => {
        let heatmap: HeatMap;
        let ele: HTMLElement;
        let tempElement: HTMLElement;
        let created: EmitType<ILoadedEventArgs>;
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
                    type: "Gradient"
                },
                legendSettings: {
                    visible: false
                },
            });
        });

        afterAll((): void => {
            heatmap.destroy();
            ele.remove();
        });
        it('Checking heatmap instance creation', (done: Function) => {
            created = (args: Object): void => {
                expect(heatmap != null).toBe(true);
                done();
            }
            heatmap.created = created;
            heatmap.appendTo('#container');
        });
        it('Check paletteSettings type property', () => {
            tempElement = document.getElementById('container_HeatMapRect_0');
            expect(tempElement.getAttribute('fill') == '#ffff99').toBe(true);
            heatmap.paletteSettings.type = "Fixed";
            heatmap.refresh();
            tempElement = document.getElementById('container_HeatMapRect_0');
            expect(tempElement.getAttribute('fill') == 'rgb(255, 255, 153)').toBe(true);
        });
        it('Check paletteSettings palette property', () => {
            heatmap.paletteSettings.palette = [{ 'value': 100, 'color': "rgb(255, 255, 153)" },
            { 'color': "rgb(153, 255, 187)" },
            { 'value': 20, 'color': "rgb(153, 153, 255)" },
            { 'value': 0, 'color': "rgb(255, 159, 128)" },
            ];
            heatmap.dataBind();
            tempElement = document.getElementById('container_HeatMapRect_0');
            expect(tempElement.getAttribute('fill') == "rgb(153, 153, 255)").toBe(true);
            heatmap.paletteSettings.type = "Gradient";
            heatmap.refresh();
            tempElement = document.getElementById('container_HeatMapRect_0');
            expect(tempElement.getAttribute('fill') == '#9999ff').toBe(true);
        });
        it('Check paletteSettings palette property', () => {
            heatmap.paletteSettings.palette = [{ 'value': 80, 'color': "rgb(255, 255, 153)" },
            { 'value': 50, 'color': "rgb(153, 255, 187)" },
            { 'value': 40, 'color': "rgb(153, 153, 255)" },
            { 'value': 20, 'color': "rgb(255, 159, 128)" },
            ];
            heatmap.refresh();
            tempElement = document.getElementById('container_HeatMapRect_0');
            expect(tempElement.getAttribute('fill') == "rgb(255, 255, 153)").toBe(true);
            tempElement = document.getElementById('container_HeatMapRect_27');
            expect(tempElement.getAttribute('fill') == "rgb(255, 159, 128)").toBe(true);
            heatmap.paletteSettings.type = "Gradient";
            heatmap.refresh();
            tempElement = document.getElementById('container_HeatMapRect_0');
            expect(tempElement.getAttribute('fill') == "rgb(255, 255, 153)").toBe(true);
            tempElement = document.getElementById('container_HeatMapRect_27');
            expect(tempElement.getAttribute('fill') == "rgb(255, 159, 128)").toBe(true);
        });
    });
});
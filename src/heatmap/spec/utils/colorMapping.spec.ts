import { createElement, L10n, remove, EmitType } from '@syncfusion/ej2-base';
import { HeatMap } from '../../src/heatmap/heatmap';
import { Title } from '../../src/heatmap/model/base';
import { ILoadedEventArgs } from '../../src/heatmap/model/interface'
import { Adaptor } from '../../src/heatmap/index';
import { Legend } from '../../src/heatmap/index';
import { Tooltip } from '../../src/heatmap/index';
import { profile , inMB, getMemoryProfile } from '../../spec/common.spec';
HeatMap.Inject(Adaptor, Legend, Tooltip);

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
        let created: EmitType<Object>;
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
        it('Overall color Range support', function () {
            heatmap.paletteSettings.palette = [
                { 'startValue': 0,'endValue': 30, 'color': "rgb(153, 255, 187)", minColor: '#ff0000', maxColor: '#00FF00' },
                { 'startValue': 30,'endValue': 60, 'color': "rgb(153, 153, 255)", minColor: '#0000FF', maxColor: '#008000' },
                { 'startValue': 60,'endValue': 80, 'color': "rgb(255, 159, 128)", minColor: '#808080', maxColor: '#ffa500' },
                ];
            heatmap.legendSettings.position = 'Top';
            heatmap.legendSettings.enableSmartLegend = false;
            heatmap.renderingMode = 'SVG';
            heatmap.paletteSettings.type = 'Gradient';
            heatmap.refresh();
            tempElement = document.getElementById('container_HeatMapRect_0');
            expect(tempElement.getAttribute('fill') == heatmap.paletteSettings.fillColor.maxColor).toBe(true);
            heatmap.renderingMode = 'Canvas';
            heatmap.refresh();
        });
        it('color Range support testing', () => {
            heatmap.paletteSettings.palette = [
            
            { 'startValue': 15,'endValue': 30, 'color': "rgb(255, 159, 128)", minColor: '#808080', maxColor: '#ffa500' },
            { 'startValue': 40,'endValue': 60, 'color': "rgb(153, 153, 255)", minColor: '#0000FF', maxColor: '#008000' },
            { 'startValue': 70,'endValue': 95, 'color': "rgb(153, 255, 187)", minColor: '#ff0000', maxColor: '#00FF00' },
            ];
            heatmap.renderingMode = 'SVG';
            heatmap.legendSettings.visible = true;
            heatmap.legendSettings.position = 'Top';
            heatmap.refresh();
            tempElement = document.getElementById('container_HeatMapRect_0');
            expect(tempElement.getAttribute('fill') == heatmap.paletteSettings.fillColor.maxColor).toBe(true);
            heatmap.renderingMode = 'Canvas';
            heatmap.legendSettings.position = 'Right';
            heatmap.refresh();
        });
        it('color Range support testing for fixed type', () => {
            heatmap.legendSettings.visible = true;
            heatmap.legendSettings.position = 'Top';
            heatmap.renderingMode = 'SVG';
            heatmap.paletteSettings.type = 'Fixed';
            heatmap.refresh();
            tempElement = document.getElementById('container_HeatMapRect_0');
            expect(tempElement.getAttribute('fill') == heatmap.paletteSettings.fillColor.minColor).toBe(true);
            heatmap.legendSettings.enableSmartLegend = true;
            heatmap.refresh();
            expect(tempElement.getAttribute('fill') == heatmap.paletteSettings.fillColor.minColor).toBe(true);
                heatmap.paletteSettings.palette = [
                    { 'startValue': 10,'endValue': 30, 'color': "rgb(255, 159, 128)", minColor: '#808080', maxColor: '#ffa500' },
                    { 'startValue': 30,'endValue': 60, 'color': "rgb(153, 153, 255)", minColor: '#0000FF', maxColor: '#008000' },
                    { 'startValue': 60,'endValue': 100, 'color': "rgb(153, 255, 187)", minColor: '#ff0000', maxColor: '#00FF00' },
                    ];
                    heatmap.paletteSettings.type = 'Fixed';
                    heatmap.legendSettings.position= null;
                heatmap.refresh();
                heatmap.paletteSettings.type = 'Gradient';
                heatmap.refresh();
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
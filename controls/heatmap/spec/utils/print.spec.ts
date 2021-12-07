/**
 * Specifies the heatmap print spec.
 */
import { HeatMap } from '../../src/heatmap/heatmap';
import { createElement, remove, EmitType } from '@syncfusion/ej2-base';
import { Adaptor } from '../../src/heatmap/index';
import { Legend } from '../../src/heatmap/index';
import { Tooltip } from '../../src/heatmap/index';
import  {profile , inMB, getMemoryProfile} from '../../spec/common.spec';
HeatMap.Inject(Adaptor, Legend, Tooltip);
//tslint:disable

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
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            (<any>window).open = () => {
                return {
                    document: { write: () => { }, close: () => { } },
                    close: () => { }, print: () => { }, focus: () => { }, moveTo: () => { }, resizeTo: () => { }
                };
            };
            let template: Element = createElement('div', { id: 'template', styles: 'display: none;border: 2px solid red' });
            document.body.appendChild(template);
            template.innerHTML = "<div id='templateWrap' style='background-color:#4472c4;border-radius: 3px;'>" +
                "<img src='../base/spec/img/img1.jpg' style='border-radius: 0px;width: 24px;height: 24px;padding: 2px;' />" +
                "<div style='color:white;float: right;padding: 2px;line-height: 20px; text-align: center; font-family:Roboto; font-style: medium; fontp-size:14px;'><span>Print</span></div></div>";
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
                loaded: (args: Object): void => {
                    heatmap.print();
                }
            });
            heatmap.appendTo('#container')
        });
        afterAll((): void => {
            heatmap.destroy();
            ele.remove();
            remove(document.getElementById('template'));
        });
    it('Checking heatmap print content with SVG mode', () => { 
    heatmap.renderingMode = 'SVG';
    heatmap.refresh();
    heatmap.print();
    heatmap.refresh();
    });
    it('Checking heatmap print content with Canvas mode', () => { 
    heatmap.renderingMode = 'Canvas';
    heatmap.refresh();
    heatmap.print();
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
import { createElement, L10n, remove, EmitType } from '@syncfusion/ej2-base';
import { HeatMap } from '../../src/heatmap/heatmap';
import { Title } from '../../src/heatmap/model/base';
import { ILoadedEventArgs } from '../../src/heatmap/model/interface'
import { Legend } from '../../src/heatmap/index';
import { MouseEvents } from '../base/event.spec';
import { profile , inMB, getMemoryProfile } from '../../spec/common.spec';
HeatMap.Inject( Legend);

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
        it('Check the heat map with HighContrast light theme', () => {
            heatmap.theme = "HighContrastLight",
            heatmap.dataBind();
            tempElement = document.getElementById('container_HeatmapBorder');
            expect(tempElement.getAttribute('fill') == '#000000').toBe(true);
        });
        it('Check the heat map with Material dark theme', () => {
            heatmap.theme = "MaterialDark",
            heatmap.dataBind();
            tempElement = document.getElementById('container_HeatmapBorder');
            expect(tempElement.getAttribute('fill') == '#000000').toBe(true);
        });
    });
    describe('Heatmap with Tailwind theme', () => {
        let heatmap: HeatMap;
        let ele: HTMLElement;
        let tempElement: SVGTextElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            heatmap = new HeatMap({
                titleSettings: {
                    text: 'Heatmap component',
                },
                width: "100%",
                height: "300px",
                dataSource: [[10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]],
                theme: "Tailwind"
            });
            heatmap.appendTo('#container');
        });
        afterAll((): void => {
            heatmap.destroy();
        });
        it('Checking title font-family on Heatmap component using Tailwind theme', () => {
            tempElement = document.getElementById("container_svg").querySelector("text");
            expect(tempElement.getAttribute('fill') == '#374151').toBe(true);
            expect(tempElement.getAttribute('font-family') == 'Inter').toBe(true);
        });
    });
    describe('Heatmap with TailwindDark theme', () => {
        let heatmap: HeatMap;
        let ele: HTMLElement;
        let tempElement: SVGTextElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            heatmap = new HeatMap({
                titleSettings: {
                    text: 'Heatmap component',
                },
                width: "100%",
                height: "300px",
                dataSource: [[10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]],
                load: function(args: ILoadedEventArgs): void {
                   args.heatmap.theme = "TailwindDark"
                }
            });
            heatmap.appendTo('#container');
        });
        afterAll((): void => {
            heatmap.destroy();
        });
        it('Checking title font-family on Heatmap component using TailwindDark theme', () => {
            tempElement = document.getElementById("container_svg").querySelector("text");
            expect(tempElement.getAttribute('fill') == '#D1D5DB').toBe(true);
            expect(tempElement.getAttribute('font-family') == 'Inter').toBe(true);
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
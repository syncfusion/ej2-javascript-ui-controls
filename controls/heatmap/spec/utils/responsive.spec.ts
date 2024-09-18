import { createElement, L10n, remove, EmitType } from '@syncfusion/ej2-base';
import { HeatMap } from '../../src/heatmap/heatmap';
import { Title } from '../../src/heatmap/model/base';
import { ILoadedEventArgs, ISelectedEventArgs } from '../../src/heatmap/model/interface'
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
            expect((tempElement.getAttribute('width') == '769' || tempElement.getAttribute('width') == '758') && tempElement.getAttribute('height') == '450').toBe(true);
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
    describe('Heatmap with Material3 theme', () => {
        let heatmap: HeatMap;
        let ele: HTMLElement;
        let tempElement: SVGTextElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container', attrs: {'align': 'center'} },);            
            document.body.appendChild(ele);
            heatmap = new HeatMap({
                titleSettings: {
                    text: 'Heatmap component',
                },
                backgroundColor: 'red',
                width: "100%",
                height: "300px",
                allowSelection: true,
                multiSelection: true,
                showTooltip: true,
                enableMultiSelection: true,
                
                dataSource: [[10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]],
                theme: "Material3"
            });
            heatmap.appendTo('#container');
        });
        afterAll((): void => {
            heatmap.destroy();
        });
        it('Checking title font-family on Heatmap component using Material3 theme', () => {
            tempElement = document.getElementById("container_svg").querySelector("text");
            expect(tempElement.getAttribute('fill')).toBe('#1C1B1F');
            expect(tempElement.getAttribute('font-family')).toBe('Roboto');
        });
        it('should trigger mouse-leave', () => {
            let element: Element = document.getElementById('container_HeatMapRect_28');
            let eventObj: Object = {
                target: element,
                type: 'mouseup',
                which: 4,
                clientX: element.getBoundingClientRect().left,
                clientY: (element.getBoundingClientRect().top + 10)
            }
            heatmap.multiSelection = true;
            heatmap.enableMultiSelect = false;
            heatmap.cellSelected = function(args: any): void {
                args.cancel = true;
            }
            heatmap.heatMapMouseLeave(<PointerEvent>eventObj);
        });
        it('should trigger mouse-leave', () => {
            let element: Element = document.getElementById('container_HeatMapRect_27');
            let eventObj: Object = {
                target: element,
                type: 'touchend',
                which: 4,
                changedTouches: [{ clientX: element.getBoundingClientRect().left, clientY: element.getBoundingClientRect().top }]
            }
            heatmap.multiSelection = true;
            heatmap.enableMultiSelect = false;
            heatmap.heatMapMouseLeave(<PointerEvent>eventObj);
            heatmap.cellSelected = function(args: any): void {
                args.cancel = true;
            }
        });
        it('should trigger mouse-leave and enableCellHighlighting', () => {
            let element: Element = document.getElementById('container_HeatMapRect_27');
            let eventObj: Object = {
                target: element,
                type: 'mouseup',
                which: 4,
                ctrlKey: false,                
                clientX: element.getBoundingClientRect().left,
                clientY: (element.getBoundingClientRect().top + 10),
                changedTouches: [{ clientX: element.getBoundingClientRect().left, clientY: element.getBoundingClientRect().top }]
            }
            heatmap.multiSelection = true;
            heatmap.cellSettings.enableCellHighlighting = false;
            //heatmap.enableMultiSelect = true;
            heatmap.cellSelected = function(args: any): void {
                args.cancel = true;
            }
            heatmap.heatMapMouseLeave(<PointerEvent>eventObj);
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
    describe('Heatmap with Bootstrap5 theme', () => {
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
                   args.heatmap.theme = "Bootstrap5"
                }
            });
            heatmap.appendTo('#container');
        });
        afterAll((): void => {
            heatmap.destroy();
        });
        it('Checking title font-family on Heatmap component using Bootstrap5 theme', () => {
            tempElement = document.getElementById("container_svg").querySelector("text");
            expect(tempElement.getAttribute('fill') == '#212529').toBe(true);
            expect(tempElement.getAttribute('font-family') == 'Segoe UI').toBe(true);
        });
    });
    describe('Heatmap with Bootstrap5Dark theme', () => {
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
                   args.heatmap.theme = "Bootstrap5Dark"
                }
            });
            heatmap.appendTo('#container');
        });
        afterAll((): void => {
            heatmap.destroy();
        });
        it('Checking title font-family on Heatmap component using Bootstrap5Dark theme', () => {
            tempElement = document.getElementById("container_svg").querySelector("text");
            expect(tempElement.getAttribute('fill') == '#DEE2E6').toBe(true);
            expect(tempElement.getAttribute('font-family') == 'Segoe UI').toBe(true);
        });
    });
    describe('Heatmap with FluentUI theme', () => {
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
                   args.heatmap.theme = "Fluent"
                }
            });
            heatmap.appendTo('#container');
        });
        afterAll((): void => {
            heatmap.destroy();
        });
        it('Checking title font-family on Heatmap component using FluentUI theme', () => {
            tempElement = document.getElementById("container_svg").querySelector("text");
            expect(tempElement.getAttribute('fill') == '#201F1E').toBe(true);
            expect(tempElement.getAttribute('font-family') == '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica Neue", sans-serif').toBe(true);
        });
    });

    describe('Heatmap with FluentUI Dark theme', () => {
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
                   args.heatmap.theme = "FluentDark"
                }
            });
            heatmap.appendTo('#container');
        });
        afterAll((): void => {
            heatmap.destroy();
        });
        it('Checking title font-family on Heatmap component using FluentUIDark theme', () => {
            tempElement = document.getElementById("container_svg").querySelector("text");
            expect(tempElement.getAttribute('fill') == '#F3F2F1').toBe(true);
            expect(tempElement.getAttribute('font-family') == '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica Neue", sans-serif').toBe(true);
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
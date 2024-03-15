/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/tslint/config */
import { EmitType, createElement } from '@syncfusion/ej2-base';
import { Chart3D } from '../../../src/chart3d/chart3D';
import { Chart3DLoadedEventArgs  } from '../../../src/chart3d/model/chart3d-Interface';
import { MouseEvents } from './events.spec';
import { Category3D } from '../../../src/chart3d/axis/category-axis';
import { DataLabel3D} from '../../../src/chart3d/series/data-label';
import { Legend3D } from '../../../src/chart3d/legend/legend';
import { ColumnSeries3D } from '../../../src/chart3d/series/column-series';
import { Tooltip3D } from '../../../src/chart3d/user-interaction/tooltip';
import { getMemoryProfile, inMB, profile } from '../../common.spec';
import { Selection3D } from '../../../src/chart3d/user-interaction/selection';
import { Highlight3D } from '../../../src/chart3d/user-interaction/high-light';
import { DateTime3D } from '../../../src/chart3d/axis/date-time-axis';
import { Double3D } from '../../../src/chart3d/axis/double-axis';

Chart3D.Inject(ColumnSeries3D, Double3D, DataLabel3D, DateTime3D, Legend3D, Selection3D, Highlight3D, Category3D, Tooltip3D);
export const categoryData: object[] = [{ x: 'USA', y: 50 }, { x: 'China', y: 40 },
    { x: 'Japan', y: 70 }, { x: 'Australia', y: 60 },
    { x: 'France', y: 50 }, { x: 'Germany', y: null },
    { x: 'Italy', y: 40 }, { x: 'Sweden', y: 30 }];

export const categoryData1: object[] = [{ x: 'USA', y: 70 }, { x: 'China', y: 60 },
    { x: 'Japan', y: 60 }, { x: 'Australia', y: 56 },
    { x: 'France1', y: 45 }, { x: 'Germany1', y: 30 },
    { x: 'Italy', y: 35 }, { x: 'Sweden', y: 25 }];
describe('Chart Control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Chart direct properties and its behavior', () => {
        let chart: Chart3D;
        let ele: HTMLElement;
        let svg: HTMLElement;
        let text: HTMLElement;
        const trigger: MouseEvents = new MouseEvents();
        let loaded: EmitType<Chart3DLoadedEventArgs>;
        beforeAll((): void => {
            ele = createElement('div', { id: 'Chart3d' });
            document.body.appendChild(ele);
            chart = new Chart3D();
        });

        afterAll((): void => {
            chart.destroy();
            ele.remove();
        });
        it('Checking chart instance creation', (done: Function) => {
            loaded = (args: Object): void => {
                expect(chart != null).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.appendTo('#Chart3d');
        });
        it('Checking with empty options', () => {
            const className: string = document.getElementById('Chart3d').className;
            expect(className).toEqual('e-control e-chart3d e-lib e-chart-focused e-touch');
        });
        it('Checking module name', () => {
            expect(chart.getModuleName()).toBe('chart3d');
        });
        it('Checking with empty size property', () => {
            svg = document.getElementById('Chart3d_svg');
            expect(svg.getAttribute('width') != null).toBe(true);
        });
        it('Checking the null height of the chart', () => {
            svg = document.getElementById('Chart3d_svg');
            expect(svg.getAttribute('height')).toEqual('450');
        });
        it('Checking the null width of the chart', (done: Function) => {
            chart.width = null;
            ele.setAttribute('style', 'width:600px');
            chart.loaded = (args: Object) => {
                svg = document.getElementById('Chart3d_svg');
                expect(svg.getAttribute('width')).toEqual('600');
                done();
            };
            chart.getPersistData();
            chart.refresh();

        });
        it('Checking the percentage size of the chart', (done: Function) => {
            chart.width = '50%';
            ele.setAttribute('style', 'width:900px');
            chart.loaded = (args: Object) => {
                svg = document.getElementById('Chart3d_svg');
                expect(svg.getAttribute('width')).toEqual('450');
                done();
            };
            chart.refresh();

        });
        it('Checking the width of the chart', () => {
            chart.width = '500';
            chart.loaded = null;
            chart.dataBind();

            svg = document.getElementById('Chart3d_svg');
            expect(svg.getAttribute('width')).toEqual('500');
        });
        it('Checking the height of the chart', () => {
            chart.height = '500';
            chart.dataBind();

            svg = document.getElementById('Chart3d_svg');
            expect(svg.getAttribute('height')).toEqual('500');
        });
        it('Checking both height and width of the chart', () => {
            chart.width = '500';
            chart.height = '300';
            chart.dataBind();

            svg = document.getElementById('Chart3d_svg');
            expect(svg.getAttribute('width')).toEqual('500');
            expect(svg.getAttribute('height')).toEqual('300');
        });
        it('Checking with empty title', () => {
            text = document.getElementById('Chart3d-chart-title');
            expect(text == null).toBe(true);
        });
        it('Checking with title', () => {
            chart.title = 'Syncfusion Chart Title';
            chart.dataBind();
            text = document.getElementById('Chart3d-chart-title');
            expect(text.textContent === 'Syncfusion Chart Title').toBe(true);
            expect(text.getAttribute('y') === '25' || text.getAttribute('y') === '23.5').toBe(true);
        });
        it('Checking textoverflow title none', () => {
            chart.width = '100px';
            chart.title = 'Efficiency of oil-fired power production';
            chart.titleStyle.textOverflow = 'None';
            chart.dataBind();
            text = document.getElementById('Chart3d-chart-title');
            expect(text.getAttribute('text-anchor')).toBe('middle');
            expect(text.getAttribute('y') === '25' || text.getAttribute('y') === '23.5').toBe(true);
        });
        it('Checking textoverflow title wrap', () => {
            chart.titleStyle.textOverflow = 'Wrap';
            chart.dataBind();
            text = document.getElementById('Chart3d-chart-title');
            expect(text.getAttribute('y') === '25' || text.getAttribute('y') === '23.5').toBe(true);
            expect(text.childNodes.length === 4).toBe(true);

        });
        it('Checking textoverflow title wrapwithtrim', () => {
            chart.title = 'Efficiency of oil-fired power productionchart';
            chart.dataBind();
            text = document.getElementById('Chart3d-chart-title');
            expect(text.textContent.indexOf('...') !== -1).toBe(true);
            expect(text.getAttribute('y') === '25' || text.getAttribute('y') === '23.5').toBe(true);
        });

        it('Checking textoverflow title trim', () => {
            chart.titleStyle.textOverflow = 'Trim';
            chart.dataBind();
            text = document.getElementById('Chart3d-chart-title');
            expect(text.textContent.indexOf('...') !== -1).toBe(true);
            expect(text.getAttribute('text-anchor')).toBe('middle');
            expect(text.getAttribute('y') === '25' || text.getAttribute('y') === '23.5').toBe(true);
        });
        it('Checking title trim', () => {
            chart.title = 'candidate joined in a year syncfusion Chart Title';
            chart.width = '100';
            chart.dataBind();

            text = document.getElementById('Chart3d-chart-title');
            expect(text.textContent.indexOf('...') !== -1).toBe(true);
        });

        it('Trimmed text and mouse over and out', (done: Function) => {
            loaded = (args: Object): void => {
                chart.loaded = null;
                text = document.getElementById('Chart3d-chart-title');
                trigger.mousemoveEvent(text, 0, 0, 77, 25);
                let tooltip: Element = document.getElementById('Chart3d-EJ2-title-tooltip');
                expect(tooltip.textContent).toBe('candidate joined in a year syncfusion Chart Title');
                expect(text.textContent.split('...').length).toEqual(2);
                tooltip.remove();
                chart.mouseEnd(<PointerEvent>trigger.onTouchEnd(text, 0, 0, null, null, 77, 25));
                tooltip = document.getElementById('Chart3d-EJ2-title-tooltip');
                expect(tooltip.textContent).toBe('candidate joined in a year syncfusion Chart Title');
                expect(text.textContent.split('...').length).toEqual(2);
                tooltip.remove();
                //document.body.removeChild(tooltip);
                done();
            };
            chart.width = '80';
            chart.title = 'candidate joined in a year syncfusion Chart Title';
            chart.loaded = loaded;
            chart.refresh();
        });

        it('Trimmed text and mouse over and out for subtitle', (done: Function) => {
            loaded = (args: Object): void => {
                chart.loaded = null;
                text = document.getElementById('Chart3d-chart-sub-title');
                trigger.mousemoveEvent(text, 0, 0, 77, 25);
                const tooltip: Element = document.getElementById('Chart3d-EJ2-title-tooltip');
                expect(tooltip.textContent).toBe('syncfusion Chart SubTitle');
                tooltip.remove();
                done();
            };
            chart.subTitleStyle.textOverflow = 'Trim';
            chart.width = '80';
            chart.subTitle = 'syncfusion Chart SubTitle';
            chart.isTouch = false;
            chart.loaded = loaded;
            chart.refresh();
        });

        it('Checking the title font size', () => {
            chart.title = 'Chart Title';
            chart.titleStyle.size = '24px';
            chart.dataBind();
            text = document.getElementById('Chart3d-chart-title');
            expect(text.getAttribute('font-size')).toEqual('24px');
        });
        it('Checking with subtitle', function () {
            chart.width = '500px';
            chart.subTitle = 'Chart SubTitle';
            chart.dataBind();
            text = document.getElementById('Chart3d-chart-sub-title');
            expect(text.textContent === 'Chart SubTitle').toBe(true);
            expect(text.getAttribute('y') === '52' || text.getAttribute('y') === '49.25').toBe(true);
        });

        it('Checking textoverflow subtitle none', function () {
            chart.subTitle = 'SubTitle';
            chart.titleStyle.textOverflow = 'None';
            chart.dataBind();
            text = document.getElementById('Chart3d-chart-sub-title');
            expect(text.textContent === 'SubTitle').toBe(true);
            expect(text.getAttribute('y') === '52' || text.getAttribute('y') === '49.25').toBe(true);
        });

        it('Checking textoverflow subtitle trim', function () {
            chart.width = '100px';
            chart.subTitle = 'Syncfusion Chart SubTitle';
            chart.subTitleStyle.textOverflow = 'Trim';
            chart.dataBind();
            text = document.getElementById('Chart3d-chart-sub-title');
            expect(text.textContent.indexOf('...') !== -1).toBe(true);
            expect(text.getAttribute('y') === '52' || text.getAttribute('y') === '49.25').toBe(true);
        });

        it('Checking textoverflow subtitle wrap', function () {
            chart.subTitleStyle.textOverflow = 'Wrap';
            chart.dataBind();
            text = document.getElementById('Chart3d-chart-sub-title');
            expect(text.childNodes.length === 2).toBe(true);
            expect(text.getAttribute('y') === '52' || text.getAttribute('y') === '49.25').toBe(true);
        });

        it('Checking textAlignment subtitle center and subtitle is in Title width', function () {
            chart.width = '500px';
            chart.title = 'Syncfusion Chart SubTitle';
            chart.subTitle = 'Checking Syncfusion Chart SubTitle width should be in Chart Title width';
            chart.subTitleStyle.textOverflow = 'Trim';
            chart.titleStyle.textOverflow = 'Wrap';
            chart.dataBind();
            text = document.getElementById('Chart3d-chart-sub-title');
            expect(text.textContent.indexOf('...') !== -1).toBe(true);
            expect(text.getAttribute('text-anchor')).toBe('middle');
        });

        it('Checking textAlignment subtitle Far', function () {
            chart.subTitleStyle.textAlignment = 'Far';
            chart.dataBind();
            text = document.getElementById('Chart3d-chart-sub-title');
            expect(text.getAttribute('text-anchor')).toBe('end');
        });

        it('Checking textAlignment subtitle Near', function () {
            chart.subTitleStyle.textAlignment = 'Near';
            chart.dataBind();
            text = document.getElementById('Chart3d-chart-sub-title');
            expect(text.getAttribute('text-anchor')).toBe('start');
        });

        it('Checking the subtitle font size', () => {
            chart.subTitleStyle.size = '20px';
            chart.dataBind();
            text = document.getElementById('Chart3d-chart-sub-title');
            expect(text.getAttribute('font-size')).toEqual('20px');
        });

        it('Checking with empty subtitle', function () {
            chart.subTitle = '';
            chart.dataBind();
            text = document.getElementById('Chart3d-chart-sub-title');
            expect(text == null).toBe(true);
        });

        it('Checking the border color', () => {
            chart.border.width = 2;
            chart.border.color = 'green';
            chart.dataBind();
            svg = document.getElementById('Chart3d-chart-border');
            expect(svg.getAttribute('stroke') === 'green').toBe(true);
            expect(svg.getAttribute('stroke-width') === '2').toBe(true);
        });
        it('Checking the Chart background', () => {
            chart.background = 'yellow';
            chart.dataBind();
            svg = document.getElementById('Chart3d-chart-border');
            expect(svg.getAttribute('fill') === 'yellow').toBe(true);
        });

        it('Checking context menu event', () => {
            const menu: Event = document.createEvent('MouseEvent');
            menu.initEvent('contextmenu', true, false);
            ele.dispatchEvent(menu);
            expect(ele).not.toBe(null);
        });

        it('checking with title alignment default', (done: Function) => {
            loaded = (args: Chart3DLoadedEventArgs) => {
                text = document.getElementById('Chart3d-chart-title');
                expect(text.getAttribute('text-anchor')).toBe('middle');
                expect(text.getAttribute('x') === text.children[0].getAttribute('x')).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.title = 'EfficiencyChart of oil power productionchart';
            chart.titleStyle.textOverflow = 'Wrap';
            chart.width = '300';
            chart.refresh();
        });
        it('checking with title alignment Far', () => {
            chart.titleStyle.textAlignment = 'Far';
            chart.loaded = null;
            chart.dataBind();
            text = document.getElementById('Chart3d-chart-title');
            expect(text.getAttribute('text-anchor')).toBe('end');
            expect(text.getAttribute('x') === text.children[0].getAttribute('x')).toBe(true);
        });
        it('checking with title alignment Near', () => {
            chart.titleStyle.textAlignment = 'Near';
            chart.dataBind();
            text = document.getElementById('Chart3d-chart-title');
            expect(text.getAttribute('text-anchor')).toBe('start');
            expect(text.getAttribute('x') === text.children[0].getAttribute('x')).toBe(true);
        });
        it('checking chart background image', (done: Function) => {
            setTimeout(() => {
                const background: HTMLElement = document.getElementById('Chart3d-chart-background');
                expect(background.getAttribute('href') != null).toBe(true);
                done();
            }, 500);
            chart.backgroundImage = 'https://cdn.syncfusion.com/content/images/freetrials/essential-studio.png?v=03102019101652';
            chart.refresh();
        });
        it('Checking with title poisition bottom', () => {
            chart.title = 'Syncfusion Chart Title';
            chart.subTitle = 'Chart SubTitle';
            chart.titleStyle.position = 'Bottom';
            chart.refresh();
            text = document.getElementById('Chart3d-chart-title');
            expect(text.textContent === 'Syncfusion Chart Title').toBe(true);
            expect(text.getAttribute('y') === '253').toBe(true);
        });
        it('Checking with position bottom and textAlignment Far', function () {
            chart.titleStyle.textAlignment = 'Far';
            chart.refresh();
            text = document.getElementById('Chart3d-chart-sub-title');
            expect(text.getAttribute('text-anchor')).toBe('start');
        });

        it('Checking width position bottom and textAlignment Near', function () {
            chart.titleStyle.textAlignment = 'Near';
            chart.refresh();
            text = document.getElementById('Chart3d-chart-sub-title');
            expect(text.getAttribute('text-anchor')).toBe('start');
        });
        it('Checking with title poisition left', () => {
            chart.title = 'Syncfusion Chart Title';
            chart.subTitle = 'Chart SubTitle';
            chart.titleStyle.position = 'Left';
            chart.refresh();
            text = document.getElementById('Chart3d-chart-title');
            expect(text.textContent === 'Syncfusion Chart Title').toBe(true);
            expect(text.getAttribute('y') === '12').toBe(true);
        });
        it('Checking with position left and textAlignment Far', function () {
            chart.titleStyle.textAlignment = 'Far';
            chart.refresh();
            text = document.getElementById('Chart3d-chart-sub-title');
            expect(text.getAttribute('text-anchor')).toBe('start');
        });
        it('Checking width position left and textAlignment Near', function () {
            chart.titleStyle.textAlignment = 'Near';
            chart.refresh();
            text = document.getElementById('Chart3d-chart-sub-title');
            expect(text.getAttribute('text-anchor')).toBe('start');
        });
        it('Checking with title poisition right', () => {
            chart.title = 'Syncfusion Chart Title';
            chart.subTitle = 'Chart SubTitle';
            chart.titleStyle.position = 'Right';
            chart.refresh();
            text = document.getElementById('Chart3d-chart-title');
            expect(text.textContent === 'Syncfusion Chart Title').toBe(true);
            expect(text.getAttribute('y') === '12').toBe(true);
        });
        it('Checking with position right and textAlignment Far', function () {
            chart.titleStyle.textAlignment = 'Far';
            chart.refresh();
            text = document.getElementById('Chart3d-chart-sub-title');
            expect(text.getAttribute('text-anchor')).toBe('start');
        });
        it('Checking width position right and textAlignment Near', function () {
            chart.titleStyle.textAlignment = 'Near';
            chart.refresh();
            text = document.getElementById('Chart3d-chart-sub-title');
            expect(text.getAttribute('text-anchor')).toBe('start');
        });

    });
    describe('DataBind', () => {
        let chart: Chart3D;
        let ele: HTMLElement;
        let loaded: EmitType<Chart3DLoadedEventArgs>;
        let element: Element;
        const trigger: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            ele = createElement('div', { id: 'seriesData' });
            document.body.appendChild(ele);
            chart = new Chart3D(
                {
                    primaryXAxis: { valueType: 'Category', rangePadding: 'Normal' },
                    primaryYAxis: { title: 'PrimaryYAxis' },
                    series: [{ dataSource: categoryData, xName: 'x', yName: 'y', name: 'Gold', fill: 'red', animation: { enable: false }, type: 'Column' }],
                    height: '400', width: '900',
                    legendSettings: { visible: true, position: 'Right' },
                    enableSideBySidePlacement: false,
                });
        });

        afterAll((): void => {
            chart.destroy();
            ele.remove();
        });
        it('checking default fill property', (done: Function) => {
            loaded = (args: Chart3DLoadedEventArgs) => {
                element = document.getElementById('seriesData-svg-0-region-series-0-point-0');
                expect(element.getAttribute('fill')).toEqual('#ff0000');
                done();
            };
            chart.loaded = loaded;
            chart.appendTo('#seriesData');
        });
        it('checking with changing fill', (done: Function) => {
            loaded = (args: Chart3DLoadedEventArgs) => {
                element = document.getElementById('seriesData-svg-0-region-series-0-point-0');
                expect(element.getAttribute('fill')).toEqual('#0000ff');
                done();
            };
            chart.loaded = loaded;
            chart.series[0].fill = 'blue';
            chart.dataBind();
        });
        it('checking before the legend name chage', () => {
            element = document.getElementById('seriesData_chart_legend_element');
            expect(element.getAttribute('x') === '826' || element.getAttribute('x') === '830').toBe(true);
            element = document.getElementById('seriesData_chart_legend_text_0');
            expect(element.textContent).toEqual('Gold');
        });
        it('checking with changing name', (done: Function) => {
            loaded = (args: Chart3DLoadedEventArgs) => {
                element = document.getElementById('seriesData_chart_legend_element');
                expect(element.getAttribute('x') === '733' || element.getAttribute('x') === '749').toBe(true);
                element = document.getElementById('seriesData_chart_legend_text_0');
                expect(element.textContent).toEqual('Olymbic gold medal');
                done();
            };
            chart.loaded = loaded;
            chart.series[0].name = 'Olymbic gold medal';
            chart.dataBind();
        });
        it('checking materialDark', (done: Function) => {
            loaded = (args: Chart3DLoadedEventArgs) => {
                element = document.getElementById('seriesData-svg-0-region-series-0-point-0');
                expect(element.getAttribute('fill')).toEqual('#0000ff');
                done();
            };
            chart.loaded = loaded;
            chart.theme = 'MaterialDark';
            chart.refresh();
        });
        it('checking fabricDark', (done: Function) => {
            loaded = (args: Chart3DLoadedEventArgs) => {
                element = document.getElementById('seriesData-svg-0-region-series-0-point-0');
                expect(element.getAttribute('fill')).toEqual('#0000ff');
                done();
            };
            chart.loaded = loaded;
            chart.theme = 'FabricDark';
            chart.refresh();
        });
        it('checking bootstrapDark', (done: Function) => {
            loaded = (args: Chart3DLoadedEventArgs) => {
                element = document.getElementById('seriesData-svg-0-region-series-0-point-0');
                expect(element.getAttribute('fill')).toEqual('#0000ff');
                done();
            };
            chart.loaded = loaded;
            chart.theme = 'BootstrapDark';
            chart.refresh();
        });
    });
    describe('Check the RTL behaviour for title', () => {
        let chart: Chart3D;
        let ele: HTMLElement;
        let loaded: EmitType<Chart3DLoadedEventArgs>;
        let element: Element;
        beforeAll((): void => {
            ele = createElement('div', { id: 'RTLcontainer' });
            document.body.appendChild(ele);
            chart = new Chart3D(
                {
                    primaryXAxis: { valueType: 'Category', rangePadding: 'Normal' },
                    primaryYAxis: { title: 'PrimaryYAxis' },
                    series: [{ dataSource: categoryData, xName: 'x', yName: 'y', fill: 'red', animation: { enable: false } }],
                    height: '400px', width: '900px',
                    title: 'Syncfusion Chart',
                    titleStyle: {
                        textAlignment: 'Near'
                    },
                    subTitle: 'Since 2012',
                    subTitleStyle: {
                        textAlignment: 'Far'
                    }
                });

        });
        afterAll((): void => {
            chart.destroy();
            ele.remove();
        });
        it('Checking the title with out RTL', (done: Function) => {
            loaded = (args: Object): void => {
                element = document.getElementById('RTLcontainer-chart-title');
                expect(element.getAttribute('text-anchor') === 'start').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.appendTo('#RTLcontainer');
        });
        it('Checking the SubTitle with out RTL', (done: Function) => {
            loaded = (args: Object): void => {
                element = document.getElementById('RTLcontainer-chart-sub-title');
                expect(element.getAttribute('text-anchor') === 'end').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.appendTo('#RTLcontainer');
        });
        it('Checking the title with RTL', (done: Function) => {
            loaded = (args: Object): void => {
                element = document.getElementById('RTLcontainer-chart-title');
                expect(element.getAttribute('text-anchor') === 'end').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.enableRtl = true;
            chart.appendTo('#RTLcontainer');
        });
        it('Checking the SubTitle with RTL', (done: Function) => {
            loaded = (args: Object): void => {
                element = document.getElementById('RTLcontainer-chart-sub-title');
                expect(element.getAttribute('text-anchor') === 'start').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.appendTo('#RTLcontainer');
        });
        it('Checking the title with RTL and bottom position', (done: Function) => {
            loaded = (args: Object): void => {
                const titleElement: Element = document.getElementById('RTLcontainer-chart-title');
                const subTitleElement: Element = document.getElementById('RTLcontainer-chart-sub-title');
                expect(titleElement.getAttribute('y')).toBe('365');
                expect(subTitleElement.getAttribute('y')).toBe('387');
                done();
            };
            chart.loaded = loaded;
            chart.titleStyle.position = 'Bottom';
            chart.refresh();
        });
        it('Checking the title with RTL and bottom position and alignement as near', (done: Function) => {
            loaded = (args: Object): void => {
                const titleElement: Element = document.getElementById('RTLcontainer-chart-title');
                const subTitleElement: Element = document.getElementById('RTLcontainer-chart-sub-title');
                expect(titleElement.getAttribute('y')).toBe('365');
                expect(subTitleElement.getAttribute('y')).toBe('387');
                done();
            };
            chart.loaded = loaded;
            chart.titleStyle.position = 'Bottom';
            chart.titleStyle.textAlignment = 'Near';
            chart.refresh();
        });
        it('Checking the title with RTL and bottom position and alignement as Far', (done: Function) => {
            loaded = (args: Object): void => {
                const titleElement: Element = document.getElementById('RTLcontainer-chart-title');
                const subTitleElement: Element = document.getElementById('RTLcontainer-chart-sub-title');
                expect(titleElement.getAttribute('y')).toBe('365');
                expect(subTitleElement.getAttribute('y')).toBe('387');
                done();
            };
            chart.loaded = loaded;
            chart.titleStyle.position = 'Bottom';
            chart.titleStyle.textAlignment = 'Far';
            chart.refresh();
        });
        it('Checking the title with RTL and left position', (done: Function) => {
            loaded = (args: Object): void => {
                const titleElement: Element = document.getElementById('RTLcontainer-chart-title');
                const subTitleElement: Element = document.getElementById('RTLcontainer-chart-sub-title');
                expect(titleElement.getAttribute('x')).toBe('23.5');
                expect(subTitleElement.getAttribute('x')).toBe('89.5');
                done();
            };
            chart.loaded = loaded;
            chart.titleStyle.position = 'Left';
            chart.titleStyle.textAlignment = 'Center';
            chart.refresh();
        });
        it('Checking the title with RTL and left position and alignement as near', (done: Function) => {
            loaded = (args: Object): void => {
                const titleElement: Element = document.getElementById('RTLcontainer-chart-title');
                const subTitleElement: Element = document.getElementById('RTLcontainer-chart-sub-title');
                expect(titleElement.getAttribute('x')).toBe('23.5');
                expect(subTitleElement.getAttribute('x')).toBe('23.5');
                done();
            };
            chart.loaded = loaded;
            chart.titleStyle.position = 'Left';
            chart.titleStyle.textAlignment = 'Near';
            chart.refresh();
        });
        it('Checking the title with RTL and left position and alignement as Far', (done: Function) => {
            loaded = (args: Object): void => {
                const titleElement: Element = document.getElementById('RTLcontainer-chart-title');
                const subTitleElement: Element = document.getElementById('RTLcontainer-chart-sub-title');
                expect(titleElement.getAttribute('x')).toBe('23.5');
                expect(subTitleElement.getAttribute('x')).toBe('154');
                done();
            };
            chart.loaded = loaded;
            chart.titleStyle.position = 'Left';
            chart.titleStyle.textAlignment = 'Far';
            chart.refresh();
        });
        it('Checking the title with RTL and right position', (done: Function) => {
            loaded = (args: Object): void => {
                const titleElement: Element = document.getElementById('RTLcontainer-chart-title');
                const subTitleElement: Element = document.getElementById('RTLcontainer-chart-sub-title');
                expect(titleElement.getAttribute('x')).toBe('876.5');
                expect(subTitleElement.getAttribute('x')).toBe('942.5');
                done();
            };
            chart.loaded = loaded;
            chart.titleStyle.position = 'Right';
            chart.titleStyle.textAlignment = 'Center';
            chart.refresh();
        });
        it('Checking the title with RTL and right position and alignement as near', (done: Function) => {
            loaded = (args: Object): void => {
                const titleElement: Element = document.getElementById('RTLcontainer-chart-title');
                const subTitleElement: Element = document.getElementById('RTLcontainer-chart-sub-title');
                expect(titleElement.getAttribute('x')).toBe('876.5');
                expect(subTitleElement.getAttribute('x')).toBe('1008.5');
                done();
            };
            chart.loaded = loaded;
            chart.titleStyle.position = 'Right';
            chart.titleStyle.textAlignment = 'Near';
            chart.refresh();
        });
        it('Checking the title with RTL and right position and alignement as Far', (done: Function) => {
            loaded = (args: Object): void => {
                const titleElement: Element = document.getElementById('RTLcontainer-chart-title');
                const subTitleElement: Element = document.getElementById('RTLcontainer-chart-sub-title');
                expect(titleElement.getAttribute('x')).toBe('876.5');
                expect(subTitleElement.getAttribute('x')).toBe('876.5');
                done();
            };
            chart.loaded = loaded;
            chart.titleStyle.position = 'Right';
            chart.titleStyle.textAlignment = 'Far';
            chart.refresh();
        });
        it('Checking width custome position', (done: Function) => {
            loaded = (args: Object): void => {
                const titleElement: Element = document.getElementById('RTLcontainer-chart-title');
                const subTitleElement: Element = document.getElementById('RTLcontainer-chart-sub-title');
                expect(titleElement.getAttribute('x')).toBe('100');
                expect(subTitleElement.getAttribute('x')).toBe('166');
                expect(titleElement.getAttribute('y')).toBe('100');
                done();
            };
            chart.loaded = loaded;
            chart.enableRtl = false;
            chart.titleStyle.position = 'Custom';
            chart.titleStyle.x = 100;
            chart.titleStyle.y = 100;
            chart.titleStyle.textAlignment = 'Center';
            chart.refresh();
        });
    });
    describe('OnProperty Changed', () => {
        let chart: Chart3D;
        let ele: HTMLElement;
        let loaded: EmitType<Chart3DLoadedEventArgs>;
        let element: Element;
        const trigger: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            ele = createElement('div', { id: 'chartContainer' });
            document.body.appendChild(ele);
            chart = new Chart3D(
                {
                    primaryXAxis: { valueType: 'Category', rangePadding: 'Normal' },
                    wallColor: 'transparent',
                    primaryYAxis: { title: 'PrimaryYAxis' },
                    series: [{ dataSource: categoryData, xName: 'x', yName: 'y', name: 'Gold', type: 'Column' }],
                    height: '400', width: '900',
                    legendSettings: { visible: true, position: 'Right' },
                    enableSideBySidePlacement: false,
                });
        });

        afterAll((): void => {
            chart.destroy();
            ele.remove();
        });
        it('checking series fill', (done: Function) => {
            loaded = (args: Chart3DLoadedEventArgs) => {
                element = document.getElementById('chartContainer-svg-0-region-series-0-point-0');
                expect(element.getAttribute('fill')).toEqual('#6355C7');
                done();
            };
            chart.loaded = loaded;
            chart.appendTo('#chartContainer');
        });
        it('checking with legend settings', (done: Function) => {
            loaded = (args: Chart3DLoadedEventArgs) => {
                const legendElement: Element = document.getElementById('chartContainer_chart_legend_g_0');
                expect(legendElement === null).toBe(true);
                done();
            };
            chart.legendSettings.visible = false;
            chart.loaded = loaded;
            chart.dataBind();
        });
        it('change palettes', (done: Function) => {
            loaded = (args: Chart3DLoadedEventArgs) => {
                const seriesElement: Element = document.getElementById('chartContainer-svg-0-region-series-0-point-0');
                const seriesElement1: Element = document.getElementById('chartContainer-svg-4-region-series-0-point-2');
                expect(seriesElement.getAttribute('fill') === '#ee82ee').toBe(true);
                expect(seriesElement1.getAttribute('fill') === '#A65BA6').toBe(true);
                done();
            };
            chart.palettes = ['violet'];
            chart.loaded = loaded;
            chart.dataBind();
        });
        it('change tilt', (done: Function) => {
            loaded = (args: Chart3DLoadedEventArgs) => {
                const seriesElement: Element = document.getElementById('chartContainer-svg-0-region-series-0-point-0');
                expect(seriesElement.getAttribute('d')).toBe( 'M 73.11964319257858 158.09941129426952 L 73.11964319257858 158.09941129426952 L 145.52034331610952 158.09941129426952 L 168.47770177006993 337.56098063763574 L 101.5359175004123 337.56098063763574 ');
                done();
            };
            chart.tilt = 30;
            chart.loaded = loaded;
            chart.dataBind();
        });
        it('change rotation', (done: Function) => {
            loaded = (args: Chart3DLoadedEventArgs) => {
                const seriesElement: Element = document.getElementById('chartContainer-svg-0-region-series-0-point-0');
                expect(seriesElement.getAttribute('d')).toBe('M 163.3258675105575 152.12689207847362 L 163.3258675105575 152.12689207847362 L 211.86701397446078 150.99420450732765 L 211.86701397446078 345.2671794961359 L 163.3258675105575 341.909569910239 ');
                done();
            };
            chart.tilt = 0;
            chart.rotation = 30;
            chart.loaded = loaded;
            chart.dataBind();
        });
        it('change depth', (done: Function) => {
            loaded = (args: Chart3DLoadedEventArgs) => {
                const seriesElement: Element = document.getElementById('chartContainer-svg-0-region-series-0-point-0');
                expect(seriesElement.getAttribute('d') === 'M 104.54545454545456 149.0909090909091 L 104.54545454545456 149.0909090909091 L 170.90909090909093 149.0909090909091 L 170.90909090909093 350.9090909090909 L 104.54545454545456 350.9090909090909 ').toBe(true);
                done();
            };
            chart.rotation = 0;
            chart.depth = 200;
            chart.loaded = loaded;
            chart.dataBind();
        });
        it('change perspective angle', (done: Function) => {
            loaded = (args: Chart3DLoadedEventArgs) => {
                const seriesElement: Element = document.getElementById('chartContainer-svg-0-region-series-0-point-0');
                expect(seriesElement.getAttribute('d') === 'M 75.66976196895152 144.83554386910865 L 75.66976196895152 144.83554386910865 L 147.58057085386346 144.83554386910865 L 147.58057085386346 363.52320924514225 L 75.66976196895152 363.52320924514225 ').toBe(true);
                done();
            };
            chart.depth = 100;
            chart.perspectiveAngle = 30;
            chart.loaded = loaded;
            chart.dataBind();
        });
        it('change enableSideBySidePlacement', (done: Function) => {
            loaded = (args: Chart3DLoadedEventArgs) => {
                const seriesElement: Element = document.getElementById('chartContainer-svg-0-region-series-0-point-0');
                expect(seriesElement.getAttribute('d')).toBe('M 92.16949152542375 146.84745762711864 L 92.16949152542375 146.84745762711864 L 154.8135593220339 146.84745762711864 L 154.8135593220339 357.5593220338984 L 92.16949152542375 357.5593220338984 ');
                done();
            };
            chart.perspectiveAngle = 90;
            chart.enableSideBySidePlacement = true;
            chart.loaded = loaded;
            chart.dataBind();
        });
        it('change enableRotation', (done: Function) => {
            loaded = (args: Chart3DLoadedEventArgs) => {
                const seriesElement: Element = document.getElementById('chartContainer-svg-0-region-series-0-point-0');
                expect(seriesElement.getAttribute('d')).toBe('M 92.16949152542375 146.84745762711864 L 92.16949152542375 146.84745762711864 L 154.8135593220339 146.84745762711864 L 154.8135593220339 357.5593220338984 L 92.16949152542375 357.5593220338984 ');
                done();
            };
            chart.enableRotation = true;
            chart.loaded = loaded;
            chart.dataBind();
        });
        it('change tooltip', (done: Function) => {
            loaded = (args: Chart3DLoadedEventArgs) => {
                const seriesElement: Element = document.getElementById('chartContainer-svg-0-region-series-0-point-0');
                expect(seriesElement.getAttribute('d')).toBe('M 92.16949152542375 146.84745762711864 L 92.16949152542375 146.84745762711864 L 154.8135593220339 146.84745762711864 L 154.8135593220339 357.5593220338984 L 92.16949152542375 357.5593220338984 ');
                done();
            };
            chart.enableRotation = false;
            chart.tooltip.enable = true;
            chart.loaded = loaded;
            chart.dataBind();
        });
        it('Checking addSeries method', (done: Function) => {
            loaded = (args: Chart3DLoadedEventArgs) => {
                const seriesElement: Element = document.getElementById('chartContainer-svg-0-region-series-1-point-0');
                expect(seriesElement.getAttribute('d')).toBe('M 125.38983050847459 146.84745762711864 L 125.38983050847459 146.84745762711864 L 156.71186440677968 146.84745762711864 L 156.71186440677968 357.5593220338984 L 125.38983050847459 357.5593220338984 ');
                done();
            };
            chart.loaded = loaded;
            chart.addSeries([{ dataSource: categoryData, xName: 'x', yName: 'y', fill: 'red', type: 'Column' }]);
        });
        it('Checking removeSeries method', (done: Function) => {
            loaded = (args: Chart3DLoadedEventArgs) => {
                const seriesElement: Element = document.getElementById('chartContainer-svg-0-region-series-1-point-0');
                expect(seriesElement === null).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.removeSeries(1);
        });
        it('change data source', (done: Function) => {
            loaded = (args: Chart3DLoadedEventArgs) => {
                const seriesElement: Element = document.getElementById('chartContainer-svg-0-region-series-0-point-0');
                expect(seriesElement.getAttribute('d')).toBe('M 92.16949152542375 62.37288135593221 L 92.16949152542375 62.37288135593221 L 154.8135593220339 62.37288135593221 L 154.8135593220339 357.5593220338984 L 92.16949152542375 357.5593220338984 ');
                done();
            };
            chart.series[0].dataSource = categoryData1;
            chart.loaded = loaded;
            chart.dataBind();
        });
        it('Selected Data Indexes', (done: Function) => {
            loaded = (args: Chart3DLoadedEventArgs) => {
                const seriesElement: Element = document.getElementById('chartContainer-svg-0-region-series-0-point-0');
                expect(seriesElement.getAttribute('class') === 'chartContainer_ej2_chart_selection_series_0').toBe(true);
                done();
            };
            chart.selectedDataIndexes = [{ series: 0, point: 0 }];
            chart.selectionMode = 'Point';
            chart.selectionPattern = 'Box';
            chart.highlightPattern = 'Box';
            chart.highlightMode = 'Point';
            chart.isMultiSelect = true;
            chart.loaded = loaded;
            chart.dataBind();
        });
        it('change axis', (done: Function) => {
            loaded = (args: Chart3DLoadedEventArgs) => {
                const seriesElement: Element = document.getElementById('chartContainer-svg-0-region-series-0-point-0');
                expect(seriesElement !== null).toBe(true);
                done();
            };
            chart.primaryXAxis.opposedPosition = true;
            chart.primaryYAxis.opposedPosition = true;
            chart.loaded = loaded;
            chart.dataBind();
        });
        it('Change chart data source', (done: Function) => {
            loaded = (args: Chart3DLoadedEventArgs) => {
                const seriesElement: Element = document.getElementById('chartContainer-svg-0-region-series-0-point-0');
                expect(seriesElement !== null).toBe(true);
                done();
            };
            chart.series[0].dataSource = null;
            chart.selectedDataIndexes = null;
            chart.selectionMode = 'None';
            chart.highlightMode = 'None';
            chart.isMultiSelect = false;
            chart.primaryXAxis.labelPlacement = 'BetweenTicks';
            chart.dataSource = categoryData;
            chart.loaded = loaded;
            chart.dataBind();
        });

    });
    describe('Checking Wall Brush', () => {
        let chart: Chart3D;
        let ele: HTMLElement;
        let loaded: EmitType<Chart3DLoadedEventArgs>;
        let element: Element;
        const trigger: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            ele = createElement('div', { id: 'chartContainer' });
            document.body.appendChild(ele);
            chart = new Chart3D(
                {
                    primaryXAxis: {
                        title: 'Year',
                        valueType: 'DateTime'

                    },
                    primaryYAxis: {
                        minimum: 20, maximum: 40, interval: 5,
                        title: 'Efficiency',
                        valueType: 'Double',
                        labelFormat: '{value}%'
                    },
                    axes: [{
                        name: 'yAxis',
                        title: 'Efficiency',
                        valueType: 'DateTime',
                        majorGridLines: { width: 0 },
                        opposedPosition: true
                    }],
                    series: [{
                        dataSource: [{ x: new Date(2018, 0, 1), y: 28 }],
                        xName: 'x', yName: 'y',
                        xAxisName: 'yAxis',
                        name: 'India',
                        dataLabel: {
                            visible: true, position: 'Top'
                        },
                        type: 'Column', animation: { enable: false }, columnWidth: 0.7,
                        fill: '#E94649'
                    }],
                    legendSettings: {
                        visible: true
                    },
                    wallColor: 'transparent',
                    title: 'Efficiency of oil-fired power production',
                    width: '830px'
                });
        });

        afterAll((): void => {
            chart.destroy();
            ele.remove();
        });
        it('checking Back wall', (done: Function) => {
            loaded = (args: Chart3DLoadedEventArgs) => {
                element = document.getElementById('chartContainer-svg-1-back-wall-brush');
                expect(element.getAttribute('d')).toEqual('M 83.68327402135232 95.3131672597865 L 83.68327402135232 95.3131672597865 L 798.3807829181495 95.3131672597865 L 798.3807829181495 354.68683274021356 L 83.68327402135232 354.68683274021356 ');
                done();
            };
            chart.loaded = loaded;
            chart.appendTo('#chartContainer');
        });
    });
    it('memory leak', () => {
        profile.sample();
        const average: any = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        const memory: any = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});

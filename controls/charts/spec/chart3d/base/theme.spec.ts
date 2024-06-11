/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Column Series Spec
 */
import { EmitType, createElement } from '@syncfusion/ej2-base';
import { Chart3D } from '../../../src/chart3d/chart3D';
import { Chart3DLoadedEventArgs } from '../../../src/chart3d/model/chart3d-Interface';
import { ColumnSeries3D } from '../../../src/chart3d/series/column-series';
import { Category3D } from '../../../src/chart3d/axis/category-axis';
import { DateTime3D } from '../../../src/chart3d/axis/date-time-axis';
import { DateTimeCategory3D } from '../../../src/chart3d/axis/date-time-category-axis';
import { DataLabel3D } from '../../../src/chart3d/series/data-label';
import { profile, inMB, getMemoryProfile } from '../../common.spec';
import { Logarithmic3D } from '../../../src/chart3d/axis/logarithmic-axis';
import { Legend3D } from '../../../src/chart3d/legend/legend';
import { MouseEvents } from './events.spec';
Chart3D.Inject(ColumnSeries3D, Category3D, DataLabel3D, Legend3D, DateTime3D, DateTimeCategory3D, Logarithmic3D);

describe('Chart control thems', () => {

    let element: HTMLElement;

    describe('Themes', () => {
        let chartObj: Chart3D;
        const trigger: MouseEvents = new MouseEvents();
        let loaded: EmitType<Chart3DLoadedEventArgs>;
        const element: Element = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(element);
            chartObj = new Chart3D(
                {
                    primaryXAxis: { valueType: 'Category', labelPlacement:'BetweenTicks', interval: 1, majorGridLines: { width: 0 }, majorTickLines: { width: 0 }, minorTickLines: { width: 0 } },
                    primaryYAxis: { title: 'Medal Count', majorTickLines: { width: 0 }, maximum: 50, interval: 10 },
                    axes: [{
                        title: 'Medal Count', name: 'yAxis', majorTickLines: { width: 0 }, maximum: 50, interval: 10
                    }],
                    series: [{
                        name: 'Gold',
                        dataSource: [{ x: 'GBR', y: 27, tooltipMappingName: 'Great Britain' },
                            { x: 'CHN', y: 26, tooltipMappingName: 'China' },
                            { x: 'AUS', y: 8, tooltipMappingName: 'Australia' },
                            { x: 'RUS', y: 19, tooltipMappingName: 'Russia' },
                            { x: 'GER', y: 17, tooltipMappingName: 'Germany' },
                            { x: 'UA', y: 2, tooltipMappingName: 'Ukraine' },
                            { x: 'ES', y: 7, tooltipMappingName: 'Spain' },
                            { x: 'UZB', y: 4, tooltipMappingName: 'Uzbekistan' },
                            { x: 'JPN', y: 12, tooltipMappingName: 'Japan' },
                            { x: 'NL', y: 8, tooltipMappingName: 'NetherLand' },
                            { x: 'USA', y: 46, tooltipMappingName: 'United States' }],
                        xName: 'x', yName: 'y',
                        dataLabel: { visible: true, position: 'Top', name: 'text', template: '<div>${point.y}</div>' },
                        type: 'Column'
                    },
                    {
                        name: 'Gold',
                        dataSource: [{ x: 'GBR', y: 27, tooltipMappingName: 'Great Britain' },
                            { x: 'CHN', y: 26, tooltipMappingName: 'China' }],
                        xName: 'x', yName: 'y',
                        type: 'Column',
                        dataLabel: { visible: true, position: 'Top', name: 'text', template: '<div>${point.y}</div>' },
                        yAxisName: 'yAxis'
                    }
                    ],
                    width: '800', tooltip: { enable: true }, legendSettings: { visible: true },
                    title: 'Olympic Medal Counts - RIO', loaded: loaded
                });
            chartObj.appendTo('#container');
        });

        afterAll((): void => {
            chartObj.destroy();
            document.getElementById('container').remove();
        });

        it('Checking default theme', (done: Function) => {
            loaded = (args: Object): void => {
                const fill: string = document.getElementById('container-svg-0-region-series-0-point-1').getAttribute('fill');
                expect(fill).toBe('#6355C7');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking High contarst', (done: Function) => {
            loaded = (args: Object): void => {
                const fill: string = document.getElementById('container-svg-0-region-series-0-point-1').getAttribute('fill');
                expect(fill).toBe('#41E4FF');
                done();
            };
            chartObj.theme = 'HighContrast';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking High contarst light', (done: Function) => {
            loaded = (args: Object): void => {
                const fill: string = document.getElementById('container-svg-0-region-series-0-point-1').getAttribute('fill');
                expect(fill).toBe('#41E4FF');
                done();
            };
            chartObj.theme = 'HighContrastLight';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking MaterialDark', (done: Function) => {
            loaded = (args: Object): void => {
                const fill: string = document.getElementById('container-svg-0-region-series-0-point-1').getAttribute('fill');
                expect(fill).toBe('#55C75A');
                done();
            };
            chartObj.theme = 'MaterialDark';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking FabricDark', (done: Function) => {
            loaded = (args: Object): void => {
                const fill: string = document.getElementById('container-svg-0-region-series-0-point-1').getAttribute('fill');
                expect(fill).toBe('#41E4FF');
                done();
            };
            chartObj.theme = 'FabricDark';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking Fabric', (done: Function) => {
            loaded = (args: Object): void => {
                const fill: string = document.getElementById('container-svg-0-region-series-0-point-1').getAttribute('fill');
                expect(fill).toBe('#06DCFF');
                done();
            };
            chartObj.theme = 'Fabric';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking BootstrapDark', (done: Function) => {
            loaded = (args: Object): void => {
                const fill: string = document.getElementById('container-svg-0-region-series-0-point-1').getAttribute('fill');
                expect(fill).toBe('#BC43F4');
                done();
            };
            chartObj.theme = 'BootstrapDark';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking Bootstrap4', (done: Function) => {
            loaded = (args: Object): void => {
                const fill: string = document.getElementById('container-svg-0-region-series-0-point-1').getAttribute('fill');
                expect(fill).toBe('#9B43F4');
                done();
            };
            chartObj.theme = 'Bootstrap4';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking Tailwind', (done: Function) => {
            loaded = (args: Object): void => {
                const fill: string = document.getElementById('container-svg-0-region-series-0-point-1').getAttribute('fill');
                expect(fill).toBe('#5C43F4');
                done();
            };
            chartObj.theme = 'Tailwind';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking TailwindDark', (done: Function) => {
            loaded = (args: Object): void => {
                const fill: string = document.getElementById('container-svg-0-region-series-0-point-1').getAttribute('fill');
                expect(fill).toBe('#00C2FF');
                done();
            };
            chartObj.theme = 'TailwindDark';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking Bootstrap5', (done: Function) => {
            loaded = (args: Object): void => {
                const fill: string = document.getElementById('container-svg-0-region-series-0-point-1').getAttribute('fill');
                expect(fill).toBe('#6355C7');
                done();
            };
            chartObj.theme = 'Bootstrap5';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking Bootstrap5Dark', (done: Function) => {
            loaded = (args: Object): void => {
                const fill: string = document.getElementById('container-svg-0-region-series-0-point-1').getAttribute('fill');
                expect(fill).toBe('#A598FF');
                done();
            };
            chartObj.theme = 'Bootstrap5Dark';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking Fluent', (done: Function) => {
            loaded = (args: Object): void => {
                const fill: string = document.getElementById('container-svg-0-region-series-0-point-1').getAttribute('fill');
                expect(fill).toBe('#2196F5');
                done();
            };
            chartObj.theme = 'Fluent';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking FluentDark', (done: Function) => {
            loaded = (args: Object): void => {
                const fill: string = document.getElementById('container-svg-0-region-series-0-point-1').getAttribute('fill');
                expect(fill).toBe('#41E4FF');
                done();
            };
            chartObj.theme = 'FluentDark';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking Material3', (done: Function) => {
            loaded = (args: Object): void => {
                const fill: string = document.getElementById('container-svg-0-region-series-0-point-1').getAttribute('fill');
                expect(fill).toBe('#6A56FF');
                done();
            };
            chartObj.theme = 'Material3';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking Material3Dark', (done: Function) => {
            loaded = (args: Object): void => {
                const fill: string = document.getElementById('container-svg-0-region-series-0-point-1').getAttribute('fill');
                expect(fill).toBe('#00C2FF');
                done();
            };
            chartObj.theme = 'Material3Dark';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking Material', (done: Function) => {
            loaded = (args: Object): void => {
                const fill: string = document.getElementById('container-svg-0-region-series-0-point-1').getAttribute('fill');
                expect(fill).toBe('#6355C7');
                done();
            };
            chartObj.theme = 'Material';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('change Axis Position', (done: Function) => {
            loaded = (args: Object): void => {
                const fill: string = document.getElementById('container-svg-0-region-series-0-point-1').getAttribute('fill');
                expect(fill).toBe('#6355C7');
                done();
            };
            chartObj.axes[0].opposedPosition = true;
            chartObj.loaded = loaded;
            chartObj.dataBind();
        });
        it('Checking Fluent2 theme', (done: Function) => {
            loaded = (args: Object): void => {
                const fill: string = document.getElementById('container-svg-0-region-series-0-point-1').getAttribute('fill');
                expect(fill).toBe('#6200EE');
                done();
            };
            chartObj.theme = 'Fluent2';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking Fluent2 Dark theme', (done: Function) => {
            loaded = (args: Object): void => {
                const fill: string = document.getElementById('container-svg-0-region-series-0-point-1').getAttribute('fill');
                expect(fill).toBe('#9BB449');
                done();
            };
            chartObj.theme = 'Fluent2Dark';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('checking legend click event', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                const legendElement: Element = document.getElementById('container_chart_legend_shape_0');
                trigger.clickEvent(legendElement);
                expect(legendElement.getAttribute('d').split('L').length).toBe(10);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
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

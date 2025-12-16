/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/tslint/config */

import { EmitType, createElement } from '@syncfusion/ej2-base';
import { CircularChart3D } from '../../../src/circularchart3d/circularchart3d';
import { removeElement } from '../../../src/common/utils/helper';
import { PieSeries3D } from '../../../src/circularchart3d/renderer/series';
import { CircularChartLegend3D } from '../../../src/circularchart3d/legend/legend';
import { CircularChartDataLabel3D } from '../../../src/circularchart3d/renderer/dataLabel';
import { CircularChart3DLoadedEventArgs } from '../../../src/circularchart3d/model/pie-interface';
import { CircularChartHighlight3D } from '../../../src/circularchart3d/user-interaction/high-light';
import { CircularChartSelection3D } from '../../../src/circularchart3d/user-interaction/selection';
import { getMemoryProfile, inMB, profile } from '../../common.spec';
import { MouseEvents } from '../../chart3d/base/events.spec';

CircularChart3D.Inject(PieSeries3D, CircularChartLegend3D, CircularChartDataLabel3D, CircularChartSelection3D, CircularChartHighlight3D);

export const piedata: Object[] = [
    { y: 18, x: 1, name: 'Bald Eagle', text: 'Bald Eagle : 18' }, { y: 23, x: 2, name: 'Bison', text: 'Bison : 23' },
    { y: 30, x: 3, name: 'Brown Bear', text: 'Brown Bear : 30' }, { y: 44, x: 4, name: 'Elk', text: 'Elk : 44' },
    { y: 52, x: 5, name: 'Pronghorn', text: 'Pronghorn : 52' }, { y: 62, x: 6, name: 'Turkey', text: 'Turkey : 62' },
    { y: 74, x: 7, name: 'Alligator', text: 'Alligator : 74' }, { y: 85, x: 8, name: 'Prairie Dog', text: 'Prairie Dog : 85' },
    { y: 96, x: 9, name: 'Mountain Lion', text: 'Mountain Lion : 96' }, { y: 102, x: 10, name: 'Beaver', text: 'Beaver : 102' }
];

describe('Circular3D Chart Control', () => {
    beforeAll(() => {
        const isDef = (o: unknown) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Checking Onproerty change', () => {
        const trigger: MouseEvents = new MouseEvents();
        let ele: HTMLElement;
        const id: string = 'ej2container';
        let pie: CircularChart3D;
        let datalabel: Element;
        let element: Element;
        let loaded: EmitType<CircularChart3DLoadedEventArgs>;
        beforeAll((): void => {
            ele = createElement('div', { id: id });
            document.body.appendChild(ele);
            pie = new CircularChart3D({
                series: [
                    {
                        dataSource: piedata,
                        dataLabel: { visible: false, name: 'text' },
                        animation: { enable: false }, xName: 'x', yName: 'y'
                    }
                ], width: '600', height: '400', legendSettings: { visible: false }
            });
            pie.appendTo('#' + id);
        });

        afterAll((): void => {
            pie.loaded = null;
            pie.destroy();
            removeElement(id);
        });
        it('checking series fill', (done: Function) => {
            pie.loaded = (args: CircularChart3DLoadedEventArgs) => {
                element = document.getElementById('ej2container-svg-0-region-series-0-point-0');
                expect(element.getAttribute('fill')).toEqual('#00AA9C');
                done();
            };
            pie.appendTo('#ej2container');
        });
        it('checking with title', (done: Function) => {
            loaded = (args: CircularChart3DLoadedEventArgs) => {
                const element: Element = document.getElementById(id + '-title');
                expect(element.textContent).toBe('Chart TS Title');
                done();
            };
            pie.title = 'Chart TS Title';
            pie.loaded = loaded;
            pie.dataBind();
        });
        it('checking with sub title', (done: Function) => {
            loaded = (args: CircularChart3DLoadedEventArgs) => {
                const element: Element = document.getElementById(id + '-sub-title');
                expect(element.textContent).toBe('Chart TS Title');
                done();
            };
            pie.subTitle = 'Chart TS Title';
            pie.loaded = loaded;
            pie.dataBind();
        });
        it('checking with legend settings', (done: Function) => {
            loaded = (args: CircularChart3DLoadedEventArgs) => {
                const legendElement: Element = document.getElementById(id + '_chart_legend_g_0');
                expect(legendElement !== null).toBe(true);
                done();
            };
            pie.legendSettings.visible = true;
            pie.loaded = loaded;
            pie.dataBind();
        });
        it('change tilt', (done: Function) => {
            loaded = (args: CircularChart3DLoadedEventArgs) => {
                const seriesElement: Element = document.getElementById('ej2container-svg-0-region-series-0-point-0');
                expect(seriesElement.getAttribute('d')).toBe('M 437.00800000000004 227.22243186433545 L 437.00800000000004 227.22243186433545 L 437.00800000000004 202.22243186433545 L 436.3473137094999 214.07176637439036 L 436.3473137094999 239.07176637439036 ');
                done();
            };
            pie.tilt = 30;
            pie.loaded = loaded;
            pie.dataBind();
        });
        it('change rotation', (done: Function) => {
            loaded = (args: CircularChart3DLoadedEventArgs) => {
                const seriesElement: Element = document.getElementById('ej2container-svg-0-region-series-0-point-0');
                expect(seriesElement.getAttribute('d')).toBe('M 406.15240852169836 217 L 406.15240852169836 217 L 431.15240852169836 217 L 430.5802374101932 230.6824329381963 L 405.5802374101932 230.6824329381963 ');
                done();
            };
            pie.tilt = 0;
            pie.rotation = 30;
            pie.loaded = loaded;
            pie.dataBind();
        });
        it('change depth', (done: Function) => {
            loaded = (args: CircularChart3DLoadedEventArgs) => {
                const seriesElement: Element = document.getElementById('ej2container-svg-0-region-series-0-point-0');
                expect(seriesElement.getAttribute('d')).toBe('M 437.00800000000004 217 L 437.00800000000004 217 L 437.00800000000004 217 L 436.3473137094999 230.6824329381963 L 436.3473137094999 230.6824329381963 ');
                done();
            };
            pie.rotation = 0;
            pie.depth = 200;
            pie.loaded = loaded;
            pie.dataBind();
        });
        it('change enableRotation', (done: Function) => {
            loaded = (args: CircularChart3DLoadedEventArgs) => {
                const seriesElement: Element = document.getElementById('ej2container-svg-0-region-series-0-point-0');
                expect(seriesElement.getAttribute('d')).toBe('M 437.00800000000004 217 L 437.00800000000004 217 L 437.00800000000004 217 L 436.3473137094999 230.6824329381963 L 436.3473137094999 230.6824329381963 ');
                done();
            };
            pie.enableRotation = true;
            pie.loaded = loaded;
            pie.dataBind();
        });
        it('change tooltip', (done: Function) => {
            loaded = (args: CircularChart3DLoadedEventArgs) => {
                const seriesElement: Element = document.getElementById('ej2container-svg-0-region-series-0-point-0');
                expect(seriesElement.getAttribute('d')).toBe('M 437.00800000000004 217 L 437.00800000000004 217 L 437.00800000000004 217 L 436.3473137094999 230.6824329381963 L 436.3473137094999 230.6824329381963 ');
                done();
            };
            pie.enableRotation = false;
            pie.tooltip.enable = true;
            pie.tooltip.template = '<div>${point.x}</div>';
            pie.loaded = loaded;
            pie.dataBind();
        });
        it('change data source', (done: Function) => {
            loaded = (args: CircularChart3DLoadedEventArgs) => {
                const seriesElement: Element = document.getElementById('ej2container-svg-0-region-series-0-point-0');
                expect(seriesElement.getAttribute('d')).toBe('M 437.00800000000004 217 L 437.00800000000004 217 L 437.00800000000004 217 L 436.3473137094999 230.6824329381963 L 436.3473137094999 230.6824329381963 ');
                done();
            };
            pie.dataSource = [{ x: 'America', y: 18 }, { x: 'England', y: 14 }, { x: 'Germany', y: 12 }];
            pie.loaded = loaded;
            pie.dataBind();
        });
        it('change RTL', (done: Function) => {
            loaded = (args: CircularChart3DLoadedEventArgs) => {
                const seriesElement: Element = document.getElementById('ej2container-svg-0-region-series-0-point-0');
                expect(seriesElement.getAttribute('d')).toBe('M 437.00800000000004 217 L 437.00800000000004 217 L 437.00800000000004 217 L 436.3473137094999 230.6824329381963 L 436.3473137094999 230.6824329381963 ');
                done();
            };
            pie.enableRtl = true;
            pie.loaded = loaded;
            pie.dataBind();
        });
        it('change series data label', (done: Function) => {
            loaded = (args: CircularChart3DLoadedEventArgs) => {
                element = document.getElementById('ej2container-svg-data-label-text-0');
                expect(element !== null).toBe(true);
                done();
            };
            pie.series[0].dataLabel.visible = true;
            pie.titleStyle.textAlignment = 'Near';
            pie.loaded = loaded;
            pie.dataBind();
        });
        it('change series explode and selection', (done: Function) => {
            loaded = (args: CircularChart3DLoadedEventArgs) => {
                element = document.getElementById('ej2container-svg-3-region-series-0-point-3');
                trigger.clickEvent(element);
                expect(element.getAttribute('class')).toBe('ej2container_ej2_chart_selection_series_0_point_3');
                done();
            };
            pie.series[0].explode = true;
            pie.series[0].explodeOffset = '20%';
            pie.series[0].explodeIndex = 1;
            pie.series[0].dataLabel.visible = false;
            pie.isMultiSelect = true;
            pie.selectedDataIndexes = [{ series: 0, point: 0 }];
            pie.selectionMode = 'Point';
            pie.loaded = loaded;
            pie.dataBind();
        });
    });
    // it('memory leak', () => {
    //     profile.sample();
    //     const average: number = inMB(profile.averageChange);
    //     //Check average change in memory samples to not be over 10MB
    //     expect(average).toBeLessThan(10);
    //     const memory: number = inMB(getMemoryProfile());
    //     //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
    //     expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    // });

});

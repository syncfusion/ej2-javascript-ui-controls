/**
 * Chart spec document
 */

import { createElement } from '@syncfusion/ej2-base';
import { ColumnSeries3D } from '../../../src/chart3d/series/column-series';
import { Category3D } from '../../../src/chart3d/axis/category-axis';
import { DateTime3D } from '../../../src/chart3d/axis/date-time-axis';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { EmitType } from '@syncfusion/ej2-base';
import { Logarithmic3D } from '../../../src/chart3d/axis/logarithmic-axis';
import { Chart3D } from '../../../src/chart3d/chart3D';
import { getMemoryProfile, inMB, profile } from '../../common.spec';
import { Chart3DLoadedEventArgs } from '../../../src/chart3d/model/chart3d-Interface';
Chart3D.Inject(Category3D, ColumnSeries3D, DateTime3D, Logarithmic3D);



describe('Chart Control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    let ele: HTMLElement;
    let svg: HTMLElement;
    let text: HTMLElement;
    let Position: string[];
    let loaded: EmitType<Chart3DLoadedEventArgs>;
    describe(' Logarithmic Axis Behavior', () => {
        let chartObj: Chart3D;
        beforeAll((): void => {
            ele = createElement('div', { id: 'chartContainer' });
            document.body.appendChild(ele);
            chartObj = new Chart3D(
                {
                    primaryXAxis: { valueType: 'Logarithmic' },
                    loaded: loaded, legendSettings: { visible: true },
                    enableSideBySidePlacement: false
                }
            ); chartObj.appendTo('#chartContainer');
        });

        afterAll((): void => {
            chartObj.destroy();
            ele.remove();
        });
        it('Checking bottom wall brushes', (done: Function) => {
            loaded = (args: Object): void => {
                let axis = document.getElementById('chartContainer-svg-2-bottom-wall-brush');
                expect(parseFloat(axis.getAttribute('d').split(' ')[5]) === parseFloat(axis.getAttribute('d').split(' ')[2])).toBe(true);
                axis = document.getElementById('chartContainer-svg-1-bottom-wall-brush-back');
                expect(parseFloat(axis.getAttribute('d').split(' ')[5]) === parseFloat(axis.getAttribute('d').split(' ')[2])).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking left wall brushes', (done: Function) => {
            loaded = (args: Object): void => {
                let axis = document.getElementById('chartContainer-svg-1-left-wall-brush-back');
                expect(parseFloat(axis.getAttribute('d').split(' ')[5]) === parseFloat(axis.getAttribute('d').split(' ')[2])).toBe(true);
                axis = document.getElementById('chartContainer-svg-0-left-wall-brush-back');
                expect(parseFloat(axis.getAttribute('d').split(' ')[5]) === parseFloat(axis.getAttribute('d').split(' ')[2])).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking Xaxis title default position', (done: Function) => {
            loaded = (args: Object): void => {
                let area: HTMLElement = document.getElementById('chartContainer-svg-axis-title-0');
                expect(parseInt(area.getAttribute('y'))).toBe(439);
                expect(parseInt(area.getAttribute('x'))).toBe(397);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.title = 'Xaxis';
            chartObj.refresh();
        });
        it('Checking Yaxis title default position', (done: Function) => {
            loaded = (args: Object): void => {
                let area: HTMLElement = document.getElementById('chartContainer-svg-axis-title-1');
                expect(parseInt(area.getAttribute('y'))).toBe(202);
                expect(parseInt(area.getAttribute('x'))).toBe(21);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.title = 'Yaxis';
            chartObj.refresh();
        });
        it('Checking Xaxis title default styles', (done: Function) => {
            loaded = (args: Object): void => {
                let area: HTMLElement = document.getElementById('chartContainer-svg-axis-title-0');
                expect(area.getAttribute('font-size') == '14px').toBe(true);
                expect(area.getAttribute('font-weight') == '600').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking Yaxis title default styles', (done: Function) => {
            loaded = (args: Object): void => {
                let area: HTMLElement = document.getElementById('chartContainer-svg-axis-title-1');
                expect(area.getAttribute('font-size') == '14px').toBe(true);
                expect(area.getAttribute('font-weight') == '600').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking Xaxis label default positions', (done: Function) => {
            loaded = (args: Object): void => {
                let label = document.getElementById('chartContainer-0-axis-label-0');
                expect(parseInt(label.getAttribute('x'))).toBe(64);
                expect(parseInt(label.getAttribute('y'))).toBe(413);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking Yaxis label default positions', (done: Function) => {
            loaded = (args: Object): void => {
                let label = document.getElementById('chartContainer-1-axis-label-0');
                expect(parseInt(label.getAttribute('x'))).toBe(52);
                expect(parseInt(label.getAttribute('y'))).toBe(395);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking Xaxis title Rotation', (done: Function) => {
            loaded = (args: Object): void => {
                let area: HTMLElement = document.getElementById('chartContainer-svg-axis-title-0');
                expect(area.getAttribute('transform')).toBe('rotate(90,408.0363214837712,430.9428129829984)');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.title = 'Xaxis';
            chartObj.primaryXAxis.titleRotation = 90;
            chartObj.refresh();
        });
        it('Checking Yaxis title Rotation', (done: Function) => {
            loaded = (args: Object): void => {
                let area: HTMLElement = document.getElementById('chartContainer-svg-axis-title-1');
                expect(area.getAttribute('transform')).toBe('rotate(90,12.82225656877898,194.1085780525502)');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.title = 'Yaxis';
            chartObj.primaryYAxis.titleRotation = 90;
            chartObj.refresh();
        });
        it('Checking Xaxis title custom styles', (done: Function) => {
            loaded = (args: Object): void => {
                let area: HTMLElement = document.getElementById('chartContainer-svg-axis-title-0');
                expect(area.getAttribute('font-size') == '20').toBe(true);
                expect(area.getAttribute('font-weight') == '900').toBe(true);
                expect(area.getAttribute('font-family') == 'Cusive').toBe(true);
                expect(area.getAttribute('font-style') == 'Italic').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.titleStyle.fontFamily = 'Cusive';
            chartObj.primaryXAxis.titleStyle.fontWeight = '900';
            chartObj.primaryXAxis.titleStyle.fontStyle = 'Italic';
            chartObj.primaryXAxis.titleStyle.size = '20';
            chartObj.primaryXAxis.title = 'Xaxis';
            chartObj.refresh();
        });
        it('Checking Yaxis title custom styles', (done: Function) => {
            loaded = (args: Object): void => {
                let area: HTMLElement = document.getElementById('chartContainer-svg-axis-title-1');
                expect(area.getAttribute('font-size') == '20').toBe(true);
                expect(area.getAttribute('font-weight') == '900').toBe(true);
                expect(area.getAttribute('font-family') == 'Cusive').toBe(true);
                expect(area.getAttribute('font-style') == 'Italic').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.titleStyle.fontFamily = 'Cusive';
            chartObj.primaryYAxis.titleStyle.fontWeight = '900';
            chartObj.primaryYAxis.titleStyle.fontStyle = 'Italic';
            chartObj.primaryYAxis.titleStyle.size = '20';
            chartObj.primaryYAxis.title = 'Yaxis';
            chartObj.refresh();
        });
        it('Checking Xaxis label rotation', (done: Function) => {
            loaded = (args: Object): void => {
                let label = document.getElementById('chartContainer-0-axis-label-0');
                expect(label.getAttribute('transform')).toBe('rotate(45,60.385239567233384,380.7814883375094)');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.labelRotation = 45;
            chartObj.refresh();
        });
        it('Checking Yaxis label rotation', (done: Function) => {
            loaded = (args: Object): void => {
                let label = document.getElementById('chartContainer-1-axis-label-0');
                expect(label.getAttribute('transform')).toBe('rotate(45,60.52462913595727,357.3918083462133)');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.labelRotation = 45;
            chartObj.refresh();
        });
        it('Checking secondary Xaxis position oposite', (done: Function) => {
            loaded = (args: Object): void => {
                let label = document.getElementById('chartContainer-2-axis-label-0');
                expect(parseInt(label.getAttribute('x'))).toBe(754);
                expect(parseInt(label.getAttribute('y'))).toBe(357);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.labelRotation = 45;
            chartObj.axes = [{
                opposedPosition: true,
                name: 'Yaxis'
            }];
            chartObj.series[0].yAxisName = 'Yaxis';
            chartObj.refresh();
        });
        it('checking minor gridlines', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                let tick: Element = document.getElementById('chartContainer-1-grid-lines-3');
                expect(tick.getBoundingClientRect().top == 304.3954162597656 || tick.getBoundingClientRect().top == 193.7574462890625).toBe(true);
                done();
            };
            chartObj.primaryXAxis.minorTicksPerInterval = 1;
            chartObj.primaryXAxis.minorTickLines.width = 8;
            chartObj.primaryXAxis.minorGridLines.width = 8;
            chartObj.refresh();
        });
        it('Checking with series', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                let tick: Element = document.getElementById('chartContainer-0-axis-label-0');
                expect(parseInt(tick.getAttribute('x')) == 158 || parseInt(tick.getAttribute('x')) == 73).toBe(true);
                done();
            };
            chartObj.series[0].dataSource = [  { y: 18, x: 1 }, { y: 29, x: 2 }, { y: 30, x: 3 }, { y: 41, x: 4 },
                { y: 52, x: 5 }, { y: 62, x: 6 },
                { y: 74, x: 7 }, { y: 85, x: 8 }, { y: 96, x: 9 }, { y: 102, x: 10 }];
            chartObj.primaryXAxis = {  title: 'Year',valueType: 'Logarithmic'};
            chartObj.series[0].xName = 'x';
            chartObj.series[0].yName = 'y';
            chartObj.series[0].dataSource[0].y = -20;
            chartObj.primaryYAxis.rangePadding = 'None';
            chartObj.refresh();
        });
    });
    it('memory leak', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});

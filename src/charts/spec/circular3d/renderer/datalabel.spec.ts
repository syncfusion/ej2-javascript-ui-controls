/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/tslint/config */

import { createElement } from '@syncfusion/ej2-base';
import { CircularChart3D } from '../../../src/circularchart3d/circularchart3d';
import { removeElement } from '../../../src/common/utils/helper';
import { PieSeries3D } from '../../../src/circularchart3d/renderer/series';
import { CircularChartLegend3D } from '../../../src/circularchart3d/legend/legend';
import { CircularChartDataLabel3D} from '../../../src/circularchart3d/renderer/dataLabel';
import { CircularChart3DLoadedEventArgs, CircularChart3DTextRenderEventArgs } from '../../../src/circularchart3d/model/pie-interface';
import { getMemoryProfile, inMB, profile } from '../../common.spec';

CircularChart3D.Inject(PieSeries3D, CircularChartLegend3D, CircularChartDataLabel3D);

export const piedata: Object[] = [
    { y: 18, x: 1, name: 'Bald Eagle', text: 'Bald Eagle : 18' }, { y: 23, x: 2, name: 'Bison', text: 'Bison : 23' },
    { y: 30, x: 3, name: 'Brown Bear', text: 'Brown Bear : 30' }, { y: 44, x: 4, name: 'Elk', text: 'Elk : 44' },
    { y: 52, x: 5, name: 'Pronghorn', text: 'Pronghorn : 52' }, { y: 62, x: 6, name: 'Turkey', text: 'Turkey : 62' },
    { y: 74, x: 7, name: 'Alligator', text: 'Alligator : 74' }, { y: 85, x: 8, name: 'Prairie Dog', text: 'Prairie Dog : 85' },
    { y: 96, x: 9, name: 'Mountain Lion', text: 'Mountain Lion : 96' }, { y: 102, x: 10, name: 'Beaver', text: 'Beaver : 102' }
];

describe('Accumulation Chart Control', () => {
    beforeAll(() => {
        const isDef = (o: unknown) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Checking Circular 3D Pie series and Donut Datalabel', () => {
        let ele: HTMLElement;
        const id: string = 'ej2container';
        let pie: CircularChart3D;
        let datalabel: Element;
        beforeAll((): void => {
            ele = createElement('div', { id: id });
            document.body.appendChild(ele);
            pie = new CircularChart3D({
                series: [
                    {
                        dataSource: piedata,
                        dataLabel: { visible: false, name: 'text' },
                        animation: { enable: true }, xName: 'x', yName: 'y'
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
        it('Datalabel visibility false checking', (done: Function) => {
            pie.loaded = (args: CircularChart3DLoadedEventArgs) => {
                datalabel = document.getElementById(id + '-svg-data-label-text-0');
                expect(datalabel).toBe(null);
                done();
            };
            pie.refresh();
        });
        it('Datalabel visibility checking', (done: Function) => {
            pie.loaded = (args: CircularChart3DLoadedEventArgs) => {
                datalabel = document.getElementById(id + '-svg-data-label-text-0');
                expect(datalabel !== null).toBe(true);
                expect(datalabel.textContent === 'Bald Eagle : 18').toBe(true);
                done();
            };
            pie.series[0].dataLabel.visible = true;
            pie.refresh();
        });
        it('Datalabel common options', (done: Function) => {
            pie.loaded = (args: CircularChart3DLoadedEventArgs) => {
                datalabel = document.getElementById(id + '-svg-data-label-text-1');
                expect(datalabel.getAttribute('fill')).toBe('#ffffff');
                expect(datalabel.getAttribute('font-size')).toBe('18px');
                expect(datalabel.getAttribute('font-family')).toBe('courier');
                expect(datalabel.getAttribute('font-style')).toBe('italic');
                expect(datalabel.getAttribute('font-weight')).toBe('bold');
                datalabel = document.getElementById(id + '-svg-data-label-series-0-shape-2');
                expect(datalabel.getAttribute('fill')).toBe('blue');
                expect(datalabel.getAttribute('stroke')).toBe('red');
                expect(datalabel.getAttribute('stroke-width')).toBe('2');
                done();
            };
            pie.series[0].dataLabel = {
                border: { color: 'red', width: 2 }, fill: 'blue',
                font: {
                    color: '#ffffff',
                    size: '18px',
                    fontFamily: 'courier',
                    fontStyle: 'italic',
                    fontWeight: 'bold'
                }
            };
            pie.refresh();
        });
        it('Datalabel Inside checking', (done: Function) => {
            pie.loaded = (args: CircularChart3DLoadedEventArgs) => {
                datalabel = document.getElementById(id + '-svg-data-label-text-0');
                expect(datalabel.getAttribute('x')).toBe('383.23896924016384');
                expect(datalabel.getAttribute('y')).toBe('213.47673931048976');
                done();
            };
            pie.series[0].dataLabel.border = { color: '', width: 1 };
            pie.series[0].dataLabel.font = {};
            pie.series[0].dataLabel.position = 'Inside';
            pie.refresh();
        });
        it('Datalabel Outside checking', (done: Function) => {
            pie.loaded = (args: CircularChart3DLoadedEventArgs) => {
                datalabel = document.getElementById(id + '-svg-data-label-text-0');
                expect(datalabel.getAttribute('x')).toBe('581.3848893154216');
                expect(datalabel.getAttribute('y')).toBe('225.38047328863155');
                done();
            };
            pie.series[0].dataLabel.position = 'Outside';
            pie.refresh();
        });
        it('Datalabel Outside connector line length', (done: Function) => {
            pie.loaded = (args: CircularChart3DLoadedEventArgs) => {
                datalabel = document.getElementById(id + '-datalabel-series-0-connector-1');
                expect(datalabel.getAttribute('d')).toBe('M 447.500786277918 248.2758536682261 L 466.5086195611548 254.4969688316573 M 466.5086195611548 254.4969688316573 L 476.5086195611548 254.4969688316573 ');
                done();
            };
            pie.series[0].dataLabel.connectorStyle = { length: '20' };
            pie.series[0].dataLabel.position = 'Outside';
            pie.refresh();
        });
        it('Datalabel Outside connector with and fill', (done: Function) => {
            pie.loaded = (args: CircularChart3DLoadedEventArgs) => {
                datalabel = document.getElementById(id + '-datalabel-series-0-connector-1');
                expect(datalabel.getAttribute('d')).toBe('M 447.500786277918 248.2758536682261 L 466.5086195611548 254.4969688316573 M 466.5086195611548 254.4969688316573 L 476.5086195611548 254.4969688316573 ');
                expect(datalabel.getAttribute('stroke')).toBe('brown');
                expect(datalabel.getAttribute('stroke-width')).toBe('3');
                datalabel = document.getElementById(id + '-datalabel-series-0-connector-3');
                expect(datalabel.getAttribute('d')).toBe('M 384.22536733858567 330.3576905927698 L 395.0791517894344 347.1563620609103 M 395.0791517894344 347.1563620609103 L 405.0791517894344 347.1563620609103 ');
                expect(datalabel.getAttribute('stroke')).toBe('brown');
                expect(datalabel.getAttribute('stroke-width')).toBe('3');
                done();
            };
            pie.series[0].dataLabel.connectorStyle = { width: 3, color: 'brown' };
            pie.refresh();
        });
        it('Datalabel Outside connector dasharray', (done: Function) => {
            pie.loaded = (args: CircularChart3DLoadedEventArgs) => {
                datalabel = document.getElementById(id + '-datalabel-series-0-connector-1');
                expect(datalabel.getAttribute('d')).toBe('M 447.500786277918 248.2758536682261 L 466.5086195611548 254.4969688316573 M 466.5086195611548 254.4969688316573 L 476.5086195611548 254.4969688316573 ');
                expect(datalabel.getAttribute('stroke-dasharray')).toBe('2,1');
                datalabel = document.getElementById(id + '-datalabel-series-0-connector-3');
                expect(datalabel.getAttribute('d')).toBe('M 384.22536733858567 330.3576905927698 L 395.0791517894344 347.1563620609103 M 395.0791517894344 347.1563620609103 L 405.0791517894344 347.1563620609103 ');
                expect(datalabel.getAttribute('stroke-dasharray')).toBe('2,1');
                done();
            };
            pie.series[0].dataLabel.connectorStyle = { dashArray: '2,1' };
            pie.refresh();
        });
        it('Datalabel angle checking', (done: Function) => {
            pie.loaded = (args: CircularChart3DLoadedEventArgs) => {
                datalabel = document.getElementById(id + '-svg-data-label-text-0');
                expect(datalabel.getAttribute('transform')).toBe('rotate(45,581.3848893154216,225.38047328863155)');
                done();
            };
            pie.series[0].dataLabel.angle = 45;
            pie.series[0].dataLabel.enableRotation = true;
            pie.refresh();
        });
        it('Datalabel angle checking with enable rotation', (done: Function) => {
            pie.loaded = (args: CircularChart3DLoadedEventArgs) => {
                datalabel = document.getElementById(id + '-svg-data-label-text-0');
                expect(datalabel.getAttribute('transform')).toBe('');
                done();
            };
            pie.series[0].dataLabel.angle = 0;
            pie.series[0].dataLabel.enableRotation = true;
            pie.refresh();
        });
        it('Datalabel format checking', (done: Function) => {
            pie.loaded = (args: CircularChart3DLoadedEventArgs) => {
                datalabel = document.getElementById(id + '-svg-data-label-text-0');
                expect(datalabel.textContent).toBe('1800.0%');
                done();
            };
            pie.series[0].dataLabel.format = 'p1';
            pie.series[0].dataLabel.angle = 0;
            pie.series[0].dataLabel.enableRotation = false;
            pie.series[0].dataLabel.name = '';
            pie.refresh();
        });
        it('Datalabel template checking with inside position', (done: Function) => {
            pie.loaded = (args: CircularChart3DLoadedEventArgs) => {
                datalabel = document.getElementById(id + '-series-0-data-label-1');
                expect(datalabel.textContent).toBe('2');
                done();
            };
            pie.series[0].dataLabel.format = '';
            pie.series[0].dataLabel.position = 'Inside';
            pie.series[0].dataLabel.template = '<div>${point.x}</div>';
            pie.refresh();
        });
        it('Datalabel template checking with outside position', (done: Function) => {
            pie.loaded = (args: CircularChart3DLoadedEventArgs) => {
                datalabel = document.getElementById(id + '-series-0-data-label-1');
                expect(datalabel.textContent).toBe('2');
                done();
            };
            pie.series[0].dataLabel.format = '';
            pie.series[0].dataLabel.position = 'Outside';
            pie.series[0].dataLabel.template = '<div>${point.x}</div>';
            pie.refresh();
        });
        it('Datalabel text render event checking', (done: Function) => {
            pie.loaded = (args: CircularChart3DLoadedEventArgs) => {
                datalabel = document.getElementById(id + '-svg-data-label-text-0');
                expect(datalabel.textContent).toBe('18');
                done();
            };
            pie.textRender = (args: CircularChart3DTextRenderEventArgs) => {
                if (args.point.index === 1) {
                    args.text = args.point.x + ' ' + args.point.y;
                }
            };
            pie.series[0].dataLabel.template = null;
            pie.refresh();
        });
    });
    describe('Checking Circular 3D Donut series and Donut Datalabel', () => {
        let ele: HTMLElement;
        const id: string = 'ej2container';
        let pie: CircularChart3D;
        let datalabel: Element;
        beforeAll((): void => {
            ele = createElement('div', { id: id });
            document.body.appendChild(ele);
            pie = new CircularChart3D({
                series: [
                    {
                        dataSource: piedata,
                        innerRadius: '40%',
                        dataLabel: { visible: false, name: 'text' },
                        animation: { enable: true }, xName: 'x', yName: 'y'
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
        it('Datalabel visibility false checking', (done: Function) => {
            pie.loaded = (args: CircularChart3DLoadedEventArgs) => {
                datalabel = document.getElementById(id + '-svg-data-label-text-0');
                expect(datalabel).toBe(null);
                done();
            };
            pie.refresh();
        });
        it('Datalabel visibility checking', (done: Function) => {
            pie.loaded = (args: CircularChart3DLoadedEventArgs) => {
                datalabel = document.getElementById(id + '-svg-data-label-text-0');
                expect(datalabel !== null).toBe(true);
                expect(datalabel.textContent === 'Bald Eagle : 18').toBe(true);
                done();
            };
            pie.series[0].dataLabel.visible = true;
            pie.refresh();
        });
        it('Datalabel common options', (done: Function) => {
            pie.loaded = (args: CircularChart3DLoadedEventArgs) => {
                datalabel = document.getElementById(id + '-svg-data-label-text-1');
                expect(datalabel.getAttribute('fill')).toBe('#ffffff');
                expect(datalabel.getAttribute('font-size')).toBe('18px');
                expect(datalabel.getAttribute('font-family')).toBe('courier');
                expect(datalabel.getAttribute('font-style')).toBe('italic');
                expect(datalabel.getAttribute('font-weight')).toBe('bold');
                datalabel = document.getElementById(id + '-svg-data-label-series-0-shape-2');
                expect(datalabel.getAttribute('fill')).toBe('blue');
                expect(datalabel.getAttribute('stroke')).toBe('red');
                expect(datalabel.getAttribute('stroke-width')).toBe('2');
                done();
            };
            pie.series[0].dataLabel = {
                border: { color: 'red', width: 2 }, fill: 'blue',
                font: {
                    color: '#ffffff',
                    size: '18px',
                    fontFamily: 'courier',
                    fontStyle: 'italic',
                    fontWeight: 'bold'
                }
            };
            pie.refresh();
        });
        it('Datalabel Inside checking', (done: Function) => {
            pie.loaded = (args: CircularChart3DLoadedEventArgs) => {
                datalabel = document.getElementById(id + '-svg-data-label-text-0');
                expect(datalabel.getAttribute('x')).toBe('414.1345569362294');
                expect(datalabel.getAttribute('y')).toBe('216.46743503468568');
                done();
            };
            pie.series[0].dataLabel.border = {};
            pie.series[0].dataLabel.font = {};
            pie.series[0].dataLabel.position = 'Inside';
            pie.refresh();
        });
        it('Datalabel Outside checking', (done: Function) => {
            pie.loaded = (args: CircularChart3DLoadedEventArgs) => {
                datalabel = document.getElementById(id + '-svg-data-label-text-0');
                expect(datalabel.getAttribute('x')).toBe('581.3848893154216');
                expect(datalabel.getAttribute('y')).toBe('225.38047328863155');
                done();
            };
            pie.series[0].dataLabel.position = 'Outside';
            pie.refresh();
        });
        it('Datalabel Outside connector line length', (done: Function) => {
            pie.loaded = (args: CircularChart3DLoadedEventArgs) => {
                datalabel = document.getElementById(id + '-datalabel-series-0-connector-1');
                expect(datalabel.getAttribute('d')).toBe('M 447.500786277918 248.2758536682261 L 466.5086195611548 254.4969688316573 M 466.5086195611548 254.4969688316573 L 476.5086195611548 254.4969688316573 ');
                done();
            };
            pie.series[0].dataLabel.connectorStyle = { length: '20' };
            pie.series[0].dataLabel.position = 'Outside';
            pie.refresh();
        });
        it('Datalabel Outside connector with and fill', (done: Function) => {
            pie.loaded = (args: CircularChart3DLoadedEventArgs) => {
                datalabel = document.getElementById(id + '-datalabel-series-0-connector-1');
                expect(datalabel.getAttribute('d')).toBe('M 447.500786277918 248.2758536682261 L 466.5086195611548 254.4969688316573 M 466.5086195611548 254.4969688316573 L 476.5086195611548 254.4969688316573 ');
                expect(datalabel.getAttribute('stroke')).toBe('brown');
                expect(datalabel.getAttribute('stroke-width')).toBe('3');
                datalabel = document.getElementById(id + '-datalabel-series-0-connector-3');
                expect(datalabel.getAttribute('d')).toBe('M 384.22536733858567 330.3576905927698 L 395.0791517894344 347.1563620609103 M 395.0791517894344 347.1563620609103 L 405.0791517894344 347.1563620609103 ');
                expect(datalabel.getAttribute('stroke')).toBe('brown');
                expect(datalabel.getAttribute('stroke-width')).toBe('3');
                done();
            };
            pie.series[0].dataLabel.connectorStyle = { width: 3, color: 'brown' };
            pie.refresh();
        });
        it('Datalabel Outside connector dasharray', (done: Function) => {
            pie.loaded = (args: CircularChart3DLoadedEventArgs) => {
                datalabel = document.getElementById(id + '-datalabel-series-0-connector-1');
                expect(datalabel.getAttribute('d')).toBe('M 447.500786277918 248.2758536682261 L 466.5086195611548 254.4969688316573 M 466.5086195611548 254.4969688316573 L 476.5086195611548 254.4969688316573 ');
                expect(datalabel.getAttribute('stroke-dasharray')).toBe('2,1');
                datalabel = document.getElementById(id + '-datalabel-series-0-connector-3');
                expect(datalabel.getAttribute('d')).toBe('M 384.22536733858567 330.3576905927698 L 395.0791517894344 347.1563620609103 M 395.0791517894344 347.1563620609103 L 405.0791517894344 347.1563620609103 ');
                expect(datalabel.getAttribute('stroke-dasharray')).toBe('2,1');
                done();
            };
            pie.series[0].dataLabel.connectorStyle = { dashArray: '2,1' };
            pie.refresh();
        });
        it('Datalabel angle checking', (done: Function) => {
            pie.loaded = (args: CircularChart3DLoadedEventArgs) => {
                datalabel = document.getElementById(id + '-svg-data-label-text-0');
                expect(datalabel.getAttribute('transform')).toBe('rotate(45,581.3848893154216,225.38047328863155)');
                done();
            };
            pie.series[0].dataLabel.angle = 45;
            pie.series[0].dataLabel.enableRotation = true;
            pie.refresh();
        });
        it('Datalabel angle checking with enable rotation', (done: Function) => {
            pie.loaded = (args: CircularChart3DLoadedEventArgs) => {
                datalabel = document.getElementById(id + '-svg-data-label-text-0');
                expect(datalabel.getAttribute('transform')).toBe('');
                done();
            };
            pie.series[0].dataLabel.angle = 0;
            pie.series[0].dataLabel.enableRotation = true;
            pie.refresh();
        });
        it('Datalabel format checking', (done: Function) => {
            pie.loaded = (args: CircularChart3DLoadedEventArgs) => {
                datalabel = document.getElementById(id + '-svg-data-label-text-0');
                expect(datalabel.textContent).toBe('1800.0%');
                done();
            };
            pie.series[0].dataLabel.format = 'p1';
            pie.series[0].dataLabel.angle = 0;
            pie.series[0].dataLabel.enableRotation = false;
            pie.series[0].dataLabel.name = '';
            pie.refresh();
        });
        it('Datalabel template checking with inside position', (done: Function) => {
            pie.loaded = (args: CircularChart3DLoadedEventArgs) => {
                datalabel = document.getElementById(id + '-series-0-data-label-1');
                expect(datalabel.textContent).toBe('2');
                done();
            };
            pie.series[0].dataLabel.format = '';
            pie.series[0].dataLabel.position = 'Inside';
            pie.series[0].dataLabel.template = '<div>${point.x}</div>';
            pie.refresh();
        });
        it('Datalabel template checking with outside position', (done: Function) => {
            pie.loaded = (args: CircularChart3DLoadedEventArgs) => {
                datalabel = document.getElementById(id + '-series-0-data-label-1');
                expect(datalabel.textContent).toBe('2');
                done();
            };
            pie.series[0].dataLabel.format = '';
            pie.series[0].dataLabel.position = 'Outside';
            pie.series[0].dataLabel.template = '<div>${point.x}</div>';
            pie.refresh();
        });
        it('Datalabel text render event checking', (done: Function) => {
            pie.loaded = (args: CircularChart3DLoadedEventArgs) => {
                datalabel = document.getElementById(id + '-svg-data-label-text-0');
                expect(datalabel.textContent).toBe('18');
                done();
            };
            pie.textRender = (args: CircularChart3DTextRenderEventArgs) => {
                if (args.point.index === 1) {
                    args.text = args.point.x + ' ' + args.point.y;
                }
            };
            pie.series[0].dataLabel.template = null;
            pie.refresh();
        });
        it('Datalabel with enable rotation', (done: Function) => {
            pie.loaded = (args: CircularChart3DLoadedEventArgs) => {
                datalabel = document.getElementById(id + '-svg-data-label-text-0');
                expect(datalabel.textContent).toBe('Bald Eagle : 18');
                done();
            };
            pie.series[0].dataLabel ={
                name: 'text', 
                visible: true, 
                fill: 'Red', 
                position: 'Inside', 
                enableRotation: true ,
            },
            pie.refresh();
        });
        it('Datalabel with legend', (done: Function) => {
            pie.loaded = (args: CircularChart3DLoadedEventArgs) => {
                datalabel = document.getElementById(id + '-svg-data-label-text-4');
                expect(datalabel.textContent !== null).toBe(true);
                done();
            };
            pie.series[0].dataLabel ={
                name: 'text', 
                visible: true,
                position: 'Outside', 
                connectorStyle: { length: '40px' }
            },
            pie.width = "500"
            pie.legendSettings = { visible: true, position: 'Right' }
            pie.refresh();
        });
    });
    it('memory leak', () => {
        profile.sample();
        const average: number = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        const memory: number = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});

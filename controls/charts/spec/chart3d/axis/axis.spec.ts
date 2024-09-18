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
import { Chart3DLoadedEventArgs, Chart3DAxisLabelRenderEventArgs } from '../../../src/chart3d/model/chart3d-Interface';
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
    let chartData = [{ x: 2005, y: 28 }, { x: 2006, y: 25 }, { x: 2007, y: 26 }, { x: 2008, y: 27 },
    { x: 2009, y: 32 }, { x: 2010, y: 35 }, { x: 2011, y: 30 }];
    let axisLabelRender: EmitType<Chart3DAxisLabelRenderEventArgs>;

    describe('Axis Behavior', () => {
        let chartObj: Chart3D;
        let loaded: EmitType<Chart3DLoadedEventArgs>;
        beforeAll((): void => {
            ele = createElement('div', { id: 'chartContainer' });
            document.body.appendChild(ele);
            chartObj = new Chart3D(
                {
                    loaded: loaded, legendSettings: { visible: true }
                }
            );
            chartObj.appendTo('#chartContainer');
        });

        afterAll((): void => {
            chartObj.destroy();
            document.getElementById('chartContainer').remove();
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
                expect(parseInt(area.getAttribute('y'))).toBe(438);
                expect(parseInt(area.getAttribute('x'))).toBe(396);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.title = 'Xaxis';
            chartObj.refresh();
        });
        it('Checking Yaxis title default position', (done: Function) => {
            loaded = (args: Object): void => {
                let area: HTMLElement = document.getElementById('chartContainer-svg-axis-title-1');
                expect(parseInt(area.getAttribute('y'))).toBe(201);
                expect(parseInt(area.getAttribute('x'))).toBe(23);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.title = 'Yaxis';
            chartObj.refresh();
        });
        it('Checking Xaxis title default styles', (done: Function) => {
            loaded = (args: Object): void => {
                let area: HTMLElement = document.getElementById('chartContainer-svg-axis-title-0');
                expect(area.getAttribute('font-size')).toBe('16px');
                expect(area.getAttribute('font-weight')).toBe('700');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking Yaxis title default styles', (done: Function) => {
            loaded = (args: Object): void => {
                let area: HTMLElement = document.getElementById('chartContainer-svg-axis-title-1');
                expect(area.getAttribute('font-size') ).toBe('16px');
                expect(area.getAttribute('font-weight')).toBe( '700');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking Xaxis label default positions', (done: Function) => {
            loaded = (args: Object): void => {
                let label = document.getElementById('chartContainer-0-axis-label-0');
                let content = label.textContent;
                expect(parseInt(label.getAttribute('x'))).toBe(64);
                expect(parseInt(label.getAttribute('y'))).toBe(410);
                expect(content == '0').toBe(true);
                label = document.getElementById('chartContainer-0-axis-label-1');
                content = label.textContent;
                expect(parseInt(label.getAttribute('x'))).toBe(132);
                expect(parseInt(label.getAttribute('y'))).toBe(410);
                expect(content == '0.5').toBe(true);
                label = document.getElementById('chartContainer-0-axis-label-2');
                content = label.textContent;
                expect(parseInt(label.getAttribute('x'))).toBe(201);
                expect(parseInt(label.getAttribute('y'))).toBe(410);
                expect(content == '1').toBe(true);
                label = document.getElementById('chartContainer-0-axis-label-3');
                content = label.textContent;
                expect(parseInt(label.getAttribute('x'))).toBe(270);
                expect(parseInt(label.getAttribute('y'))).toBe(410);
                expect(content == '1.5').toBe(true);
                label = document.getElementById('chartContainer-0-axis-label-4');
                content = label.textContent;
                expect(parseInt(label.getAttribute('x'))).toBe(338);
                expect(parseInt(label.getAttribute('y'))).toBe(410);
                expect(content == '2').toBe(true);
                label = document.getElementById('chartContainer-0-axis-label-5');
                content = label.textContent;
                expect(parseInt(label.getAttribute('x'))).toBe(408);
                expect(parseInt(label.getAttribute('y'))).toBe(410);
                expect(content == '2.5').toBe(true);
                label = document.getElementById('chartContainer-0-axis-label-6');
                content = label.textContent;
                expect(parseInt(label.getAttribute('x'))).toBe(477);
                expect(parseInt(label.getAttribute('y'))).toBe(410);
                expect(content == '3').toBe(true);
                label = document.getElementById('chartContainer-0-axis-label-7');
                content = label.textContent;
                expect(parseInt(label.getAttribute('x'))).toBe(545);
                expect(parseInt(label.getAttribute('y'))).toBe(410);
                expect(content == '3.5').toBe(true);
                label = document.getElementById('chartContainer-0-axis-label-8');
                content = label.textContent;
                expect(parseInt(label.getAttribute('x'))).toBe(614);
                expect(parseInt(label.getAttribute('y'))).toBe(410);
                expect(content == '4').toBe(true);
                label = document.getElementById('chartContainer-0-axis-label-9');
                content = label.textContent;
                expect(parseInt(label.getAttribute('x'))).toBe(683);
                expect(parseInt(label.getAttribute('y'))).toBe(410);
                expect(content == '4.5').toBe(true);
                label = document.getElementById('chartContainer-0-axis-label-10');
                content = label.textContent;
                expect(parseInt(label.getAttribute('x'))).toBe(751);
                expect(parseInt(label.getAttribute('y'))).toBe(410);
                expect(content === '5').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking Yaxis label default positions', (done: Function) => {
            loaded = (args: Object): void => {
                let label = document.getElementById('chartContainer-1-axis-label-0');
                let content = label.textContent;
                expect(parseInt(label.getAttribute('x'))).toBe(52);
                expect(parseInt(label.getAttribute('y'))).toBe(392);
                expect(content == '0').toBe(true);
                label = document.getElementById('chartContainer-1-axis-label-1');
                content = label.textContent;
                expect(parseInt(label.getAttribute('x'))).toBe(52);
                expect(parseInt(label.getAttribute('y'))).toBe(358);
                expect(content == '0.5').toBe(true);
                label = document.getElementById('chartContainer-1-axis-label-2');
                content = label.textContent;
                expect(parseInt(label.getAttribute('x'))).toBe(52);
                expect(parseInt(label.getAttribute('y'))).toBe(324);
                expect(content == '1').toBe(true);
                label = document.getElementById('chartContainer-1-axis-label-3');
                content = label.textContent;
                expect(parseInt(label.getAttribute('x'))).toBe(52);
                expect(parseInt(label.getAttribute('y'))).toBe(290);
                expect(content == '1.5').toBe(true);
                label = document.getElementById('chartContainer-1-axis-label-4');
                content = label.textContent;
                expect(parseInt(label.getAttribute('x'))).toBe(52);
                expect(parseInt(label.getAttribute('y'))).toBe(256);
                expect(content == '2').toBe(true);
                label = document.getElementById('chartContainer-1-axis-label-5');
                content = label.textContent;
                expect(parseInt(label.getAttribute('x'))).toBe(52);
                expect(parseInt(label.getAttribute('y'))).toBe(222);
                expect(content == '2.5').toBe(true);
                label = document.getElementById('chartContainer-1-axis-label-6');
                content = label.textContent;
                expect(parseInt(label.getAttribute('x'))).toBe(52);
                expect(parseInt(label.getAttribute('y'))).toBe(187);
                expect(content == '3').toBe(true);
                label = document.getElementById('chartContainer-1-axis-label-7');
                content = label.textContent;
                expect(parseInt(label.getAttribute('x'))).toBe(52);
                expect(parseInt(label.getAttribute('y'))).toBe(154);
                expect(content == '3.5').toBe(true);
                label = document.getElementById('chartContainer-1-axis-label-8');
                content = label.textContent;
                expect(parseInt(label.getAttribute('x'))).toBe(52);
                expect(parseInt(label.getAttribute('y'))).toBe(120);
                expect(content == '4').toBe(true);
                label = document.getElementById('chartContainer-1-axis-label-9');
                content = label.textContent;
                expect(parseInt(label.getAttribute('x'))).toBe(52);
                expect(parseInt(label.getAttribute('y'))).toBe(85);
                expect(content == '4.5').toBe(true);
                label = document.getElementById('chartContainer-1-axis-label-10');
                content = label.textContent;
                expect(parseInt(label.getAttribute('x'))).toBe(52);
                expect(parseInt(label.getAttribute('y'))).toBe(51);
                expect(content == '5').toBe(true);
                label = document.getElementById('chartContainer-1-axis-label-11');
                content = label.textContent;
                expect(parseInt(label.getAttribute('x'))).toBe(52);
                expect(parseInt(label.getAttribute('y'))).toBe(18);
                expect(content == '5.5').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking Xaxis title custom styles', (done: Function) => {
            loaded = (args: Object): void => {
                let area: HTMLElement = document.getElementById('chartContainer-svg-axis-title-0');
                expect(area.getAttribute('font-size')).toBe( '20');
                expect(area.getAttribute('font-weight') ).toBe('900');
                expect(area.getAttribute('font-family') ).toBe('Cusive');
                expect(area.getAttribute('font-style')).toBe('Italic');
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
                expect(area.getAttribute('font-size')).toBe( '20');
                expect(area.getAttribute('font-weight') ).toBe('900');
                expect(area.getAttribute('font-family') ).toBe('Cusive');
                expect(area.getAttribute('font-style')).toBe('Italic');
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
        it('Checking Xaxis title Rotation', (done: Function) => {
            loaded = (args: Object): void => {
                let area: HTMLElement = document.getElementById('chartContainer-svg-axis-title-0');
                expect(area.getAttribute('transform')).toBe('rotate(90,402.1522411128284,424.12881040499417)');
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
                expect(area.getAttribute('transform')).toBe('rotate(90,16.25463678516229,186.80423544363407)');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.title = 'Yaxis';
            chartObj.primaryYAxis.titleRotation = 90;
            chartObj.refresh();
        });
        it('Checking Xaxis label rotation', (done: Function) => {
            loaded = (args: Object): void => {
                let label = document.getElementById('chartContainer-0-axis-label-0');
                expect(label.getAttribute('transform')).toBe('rotate(45,59.40455950540958,377.660978252405)');
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
        it('Checking secondary Yaxis position oposite', (done: Function) => {
            loaded = (args: Object): void => {
                let label = document.getElementById('chartContainer-2-axis-label-0');
                expect(label.getAttribute('x')).toBe('755.6874034003091');
                expect(label.getAttribute('y')).toBe('357.3918083462133');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.labelRotation = 45;
            chartObj.axes = [{
                opposedPosition: true,
                name: 'Yaxis'
            }];
            chartObj.series[0].yAxisName = 'Yaxis'
            chartObj.refresh();
        });
        it('checking axis label format with series', (done: Function) => {
            chartObj.loaded = () => {
                let label: Element = document.getElementById('chartContainer-0-axis-label-0');
                expect(label.textContent === '$0.5%').toBe(true);
                label = document.getElementById('chartContainer-0-axis-label-10');
                expect(label.textContent === '$5.5%').toBe(true);
                done();
            }
            chartObj.primaryXAxis = {
                title: 'Sales Across Years', intervalType: 'Years', labelFormat: '${value}%'
            },
                chartObj.primaryYAxis = { title: 'Sales Amount in millions(USD)', rangePadding: 'Round' },
                chartObj.series = [
                    {
                        type: 'Column', xName: 'x', yName: 'y',
                        dataSource: [{ x: 1, y: 46 }, { x: 2, y: 27 }, { x: 3, y: 26 }, { x: 4, y: 16 }, { x: 5, y: 31 }],
                    }
                ],
                chartObj.refresh();
        });
    });

    describe('Checking the Axis Lines', () => {
        let chartObj: Chart3D;
        let loaded: EmitType<Chart3DLoadedEventArgs>;
        const element: Element = createElement('div', { id: 'chartContainer1' });
        beforeAll((): void => {
            document.body.appendChild(element);
            chartObj = new Chart3D(
                {
                    loaded: loaded, legendSettings: { visible: true }
                }
            );
            chartObj.appendTo('#chartContainer1');
        });

        afterAll((): void => {
            chartObj.destroy();
            document.getElementById('chartContainer1').remove();
        });

        it('Checking Major GridLine and Tick Lines', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('chartContainer1-0-grid-lines-0');
                expect(svg.getAttribute('stroke') == '#C2C924').toBe(true);
                expect(svg.getAttribute('stroke-width') == '2').toBe(true);

                svg = document.getElementById('chartContainer1-0-major-tick-lines-0');
                expect(svg.getAttribute('stroke') == '#0AA368').toBe(true);
                expect(svg.getAttribute('stroke-width') == '1.5').toBe(true);

                svg = document.getElementById('chartContainer1-1-grid-lines-0');
                expect(svg.getAttribute('stroke') == '#B4D072').toBe(true);
                expect(svg.getAttribute('stroke-width') == '2').toBe(true);

                svg = document.getElementById('chartContainer1-1-major-tick-lines-1');
                expect(svg.getAttribute('stroke') == '#C2C924').toBe(true);
                expect(svg.getAttribute('stroke-width') == '1.5').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.majorGridLines = { color: '#C2C924', width: 2 };
            chartObj.primaryXAxis.majorTickLines = { color: '#0AA368', width: 1.5, height: 20 };
            chartObj.primaryYAxis.majorGridLines = { color: '#B4D072', width: 2 };
            chartObj.primaryYAxis.majorTickLines = { color: '#C2C924', width: 1.5, height: 20 };
            chartObj.refresh();
        });

        it('Checking Minor Grid Line and Tick Line', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('chartContainer1-0-minor-grid-lines-0-0');
                expect(svg.getAttribute('stroke') == '#C2C924').toBe(true);
                expect(svg.getAttribute('stroke-width') == '1').toBe(true);

                svg = document.getElementById('chartContainer1-0-minor-tick-lines-0-0');
                expect(svg.getAttribute('stroke') == '#0AA368').toBe(true);
                expect(svg.getAttribute('stroke-width') == '1').toBe(true);

                svg = document.getElementById('chartContainer1-1-minor-grid-lines-0-0');
                expect(svg.getAttribute('stroke') == '#B4D072').toBe(true);
                expect(svg.getAttribute('stroke-width') == '1').toBe(true);

                svg = document.getElementById('chartContainer1-1-minor-tick-lines-0-0');
                expect(svg.getAttribute('stroke') == '#C2C924').toBe(true);
                expect(svg.getAttribute('stroke-width') == '1').toBe(true);
                done();
            }
            chartObj.loaded = loaded;
            chartObj.primaryXAxis = {
                minorGridLines: { color: '#C2C924', width: 1 },
                minorTickLines: { color: '#0AA368', width: 1, height: 3 },
                minorTicksPerInterval: 4,
                labelRotation: 0
            };
            chartObj.primaryYAxis = {
                minorGridLines: { color: '#B4D072', width: 1 },
                minorTickLines: { color: '#C2C924', width: 1, height: 3 },
                minorTicksPerInterval: 4
            };
            chartObj.refresh();
        });

        it('Checking Major GridLine and Tick Lines with opposed position', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('chartContainer1-0-parallel-grid-lines-0');
                expect(svg.getAttribute('stroke') == '#C2C924').toBe(true);
                expect(svg.getAttribute('stroke-width') == '2').toBe(true);

                svg = document.getElementById('chartContainer1-0-major-tick-lines-0');
                expect(svg.getAttribute('stroke') == '#0AA368').toBe(true);
                expect(svg.getAttribute('stroke-width') == '1.5').toBe(true);

                svg = document.getElementById('chartContainer1-1-grid-lines-0');
                expect(svg.getAttribute('stroke') == '#B4D072').toBe(true);
                expect(svg.getAttribute('stroke-width') == '2').toBe(true);

                svg = document.getElementById('chartContainer1-1-major-tick-lines-1');
                expect(svg.getAttribute('stroke') == '#C2C924').toBe(true);
                expect(svg.getAttribute('stroke-width') == '1.5').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.majorGridLines = { color: '#C2C924', width: 2 };
            chartObj.primaryXAxis.majorTickLines = { color: '#0AA368', width: 1.5, height: 20 };
            chartObj.primaryYAxis.majorGridLines = { color: '#B4D072', width: 2 };
            chartObj.primaryYAxis.majorTickLines = { color: '#C2C924', width: 1.5, height: 20 };
            chartObj.primaryXAxis.opposedPosition = true;
            chartObj.primaryYAxis.opposedPosition = true;
            chartObj.refresh();
        });

        it('Checking Minor Grid Line and Tick Line with opposed position', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('chartContainer1-1-minor-tick-lines-0-0');
                expect(svg.getAttribute('stroke') == '#C2C924').toBe(true);
                expect(svg.getAttribute('stroke-width') == '1').toBe(true);

                svg = document.getElementById('chartContainer1-0-minor-tick-lines-0-0');
                expect(svg.getAttribute('stroke') == '#0AA368').toBe(true);
                expect(svg.getAttribute('stroke-width') == '1').toBe(true);

                svg = document.getElementById('chartContainer1-1-minor-grid-lines-0-0');
                expect(svg.getAttribute('stroke') == '#B4D072').toBe(true);
                expect(svg.getAttribute('stroke-width') == '1').toBe(true);

                svg = document.getElementById('chartContainer1-1-minor-tick-lines-0-0');
                expect(svg.getAttribute('stroke') == '#C2C924').toBe(true);
                expect(svg.getAttribute('stroke-width') == '1').toBe(true);
                done();
            }

            chartObj.loaded = loaded;
            chartObj.primaryXAxis = {
                minorGridLines: { color: '#C2C924', width: 1 },
                minorTickLines: { color: '#0AA368', width: 1, height: 3 },
                minorTicksPerInterval: 4,
                labelRotation: 0
            };
            chartObj.primaryYAxis = {
                minorGridLines: { color: '#B4D072', width: 1 },
                minorTickLines: { color: '#C2C924', width: 1, height: 3 },
                minorTicksPerInterval: 4
            };
            chartObj.refresh();
        });
    });

    describe('Checking the label intersect action', () => {
        let chartObj: Chart3D;
        let loaded: EmitType<Chart3DLoadedEventArgs>;
        const element: Element = createElement('div', { id: 'chartContainer2' });
        beforeAll((): void => {
            document.body.appendChild(element);
            chartObj = new Chart3D(
                {
                    series: [{ dataSource: chartData, xName: 'x', yName: 'y' }],
                    loaded: loaded,
                    legendSettings: { visible: false },
                }
            );
            chartObj.appendTo('#chartContainer2');
        });

        afterAll((): void => {
            chartObj.destroy();
            document.getElementById('chartContainer2').remove();
        });

        it('checking with label intersect action as None', (done: Function) => {
            loaded = (args: Object): void => {
                let firstLabel: HTMLElement = document.getElementById('chartContainer2-0-axis-label-0');
                expect(firstLabel.textContent).toEqual('1 custom Labels');
                let secondLabel: any = document.getElementById('chartContainer2-0-axis-label-1');
                expect(secondLabel.textContent).toEqual('2 custom Labels');
                let thirdLabel: HTMLElement = document.getElementById('chartContainer2-0-axis-label-2');
                expect(thirdLabel.textContent).toEqual('3 custom Labels');
                done();
            };
            axisLabelRender = (args: Chart3DAxisLabelRenderEventArgs) => {
                args.text = args.text + ' custom Labels';
            }
            chartObj.axisLabelRender = axisLabelRender;
            chartObj.loaded = loaded;
            chartObj.primaryXAxis = { maximum: 5, minimum: 1, interval: 1, labelIntersectAction: 'None' };
            chartObj.width = '400';
            chartObj.refresh();
        });

        it('checking with label intersect action as Hide', (done: Function) => {
            loaded = (args: Object): void => {
                let firstLabel: HTMLElement = document.getElementById('chartContainer2-0-axis-label-0');
                expect(firstLabel.textContent).toEqual('1 custom Labels');
                let secondLabel: HTMLElement = document.getElementById('chartContainer2-0-axis-label-1');
                expect(secondLabel).toEqual(null);
                let thirdLabel: HTMLElement = document.getElementById('chartContainer2-0-axis-label-2');
                expect(thirdLabel).toEqual(null);
                done();
            };
            axisLabelRender = (args: Chart3DAxisLabelRenderEventArgs) => {
                args.text = args.text + ' custom Labels';
            }
            chartObj.axisLabelRender = axisLabelRender;
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.labelIntersectAction = 'Hide';
            chartObj.refresh();
        });

        it('checking with label intersect action as Trim', (done: Function) => {
            loaded = (args: Object): void => {
                let firstLabel: HTMLElement = document.getElementById('chartContainer2-0-axis-label-0');
                expect(firstLabel.textContent.indexOf('...') > -1).toBe(true);
                expect(firstLabel.textContent.split('...').length).toEqual(2);
                done();
            };
            axisLabelRender = (args: Chart3DAxisLabelRenderEventArgs) => {
                args.text = args.text + ' custom Labels';
            }
            chartObj.axisLabelRender = axisLabelRender;
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.labelIntersectAction = 'Trim';
            chartObj.refresh();
        });

        it('checking with label intersect action as Wrap', (done: Function) => {
            loaded = (args: Object): void => {
                let firstLabel: HTMLElement = document.getElementById('chartContainer2-0-axis-label-0');
                expect(firstLabel.textContent).toEqual('1 customLabels');
                expect(firstLabel.childNodes[0].textContent).toEqual('1 custom');
                expect(firstLabel.childNodes.length).toEqual(2);
                done();
            };
            axisLabelRender = (args: Chart3DAxisLabelRenderEventArgs) => {
                args.text = args.text + ' custom Labels';
            }
            chartObj.axisLabelRender = axisLabelRender;
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.labelIntersectAction = 'Wrap';
            chartObj.refresh();
        });

        it('checking with label intersect action as Rotate45', (done: Function) => {
            loaded = (args: Object): void => {
                let firstLabel: HTMLElement = document.getElementById('chartContainer2-0-axis-label-0');
                expect(firstLabel.textContent).toEqual('1 custom Labels');
                expect(firstLabel.getAttribute('transform').indexOf('rotate(45') > -1).toBe(true);
                done();
            };
            axisLabelRender = (args: Chart3DAxisLabelRenderEventArgs) => {
                args.text = args.text + ' custom Labels';
            }
            chartObj.axisLabelRender = axisLabelRender;
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.labelIntersectAction = 'Rotate45';
            chartObj.refresh();
        });

        it('checking with label intersect action as Rotate90', (done: Function) => {
            loaded = (args: Object): void => {
                let firstLabel: HTMLElement = document.getElementById('chartContainer2-0-axis-label-0');
                expect(firstLabel.textContent).toEqual('1 custom Labels');
                expect(firstLabel.getAttribute('transform').indexOf('rotate(90') > -1).toBe(true);
                chartObj.axisLabelRender = null;
                done();
            };
            axisLabelRender = (args: Chart3DAxisLabelRenderEventArgs) => {
                args.text = args.text + ' custom Labels';
            }
            chartObj.axisLabelRender = axisLabelRender;
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.labelIntersectAction = 'Rotate90';
            chartObj.refresh();
        });

        it('checking with label intersect action as MultipleRows', (done: Function) => {
            loaded = (args: Object): void => {
                let firstLabel: HTMLElement = document.getElementById('chartContainer2-0-axis-label-0');
                let secondLabel: HTMLElement = document.getElementById('chartContainer2-0-axis-label-1');
                let thirdLabel: HTMLElement = document.getElementById('chartContainer2-0-axis-label-4');
                let fourthLabel: HTMLElement = document.getElementById('chartContainer2-0-axis-label-3');
                expect(firstLabel.getAttribute('y')).toEqual(fourthLabel.getAttribute('y'));
                expect(secondLabel.getAttribute('y')).toEqual(thirdLabel.getAttribute('y'));
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = [{ x: "South Korea custom Labels", y: 39.4 }, { x: "India custom Labels", y: 61.3 }, { x: "Pakistan custom Labels", y: 20.4 },
            { x: "Germany custom Labels", y: 65.1 }, { x: "Australia custom Labels", y: 15.8 }, { x: "Italy custom Labels", y: 29.2 }];
            chartObj.primaryXAxis = { labelIntersectAction: 'MultipleRows', valueType: 'Category', minimum: null, maximum: null, interval: null };
            chartObj.refresh();
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
    });
});
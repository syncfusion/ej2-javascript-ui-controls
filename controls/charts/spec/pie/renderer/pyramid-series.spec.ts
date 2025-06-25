/**
 * Pyramid Series Spec file
 */
import { createElement, remove } from '@syncfusion/ej2-base';
import { EmitType } from '@syncfusion/ej2-base';
import { PyramidSeries } from '../../../src/accumulation-chart/renderer/pyramid-series';
import { AccumulationChart } from '../../../src/accumulation-chart/accumulation';
import { AccumulationLegend } from '../../../src/accumulation-chart/renderer/legend';
import { AccPoints, AccumulationSeries } from '../../../src/accumulation-chart/model/acc-base';
import { getElement, removeElement } from '../../../src/common/utils/helper';
import { AccumulationDataLabel } from '../../../src/accumulation-chart/renderer/dataLabel';
import { AccumulationSelection } from '../../../src/accumulation-chart/user-interaction/selection';
import { AccumulationTooltip } from '../../../src/accumulation-chart/user-interaction/tooltip';
import { profile, inMB, getMemoryProfile } from '../../common.spec';
import { SliceOption } from '../base/util.spec';
import { MouseEvents } from '../../chart/base/events.spec';
import { IAccLoadedEventArgs, IAccTooltipRenderEventArgs } from '../../../src/accumulation-chart/model/pie-interface';
import { piedata} from '../../chart/base/data.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
AccumulationChart.Inject(PyramidSeries, AccumulationLegend, AccumulationDataLabel, AccumulationSelection, AccumulationTooltip);


/* //Pyramid size
1.default size, 
2.custom Pyramid size */

/* //points
1. without points
2. with valid points 
3. with empty and valid points
4. with only empty point
5. what will happen when a point's value is 0
 */

/* //data label
1. default label position
2. inside
3. outside left & right
4. enable smart labels
5. disable smart labels
6. outer label position when the Pyramid width is 100%
7. connector line - appearance (opacity, type)
8. smart label with inside position
9. smart label with outside position
 */

/* //legend
1. custom legend
2. default legend
 */

/*//events
 */

/* //gap
1. default gap ratio
2. custom gap ratio
 */

/* //interaction
1. explode
2. de-explode
3. selection
4. selection with explode
5. tooltip
*/
/* better to consider
1. path data of the curve
2. path of the line - when it starts from the middle segment where neck starts
*/

let data: object[] = [{ x: 'Renewed', y: 18.2, text: '18.20%' },
{ x: 'Subscribe', y: 27.3, text: '27.3%' },
{ x: 'Support', y: 55.9, text: '55.9%' },
{ x: 'Downloaded', y: 76.8, text: '76.8%' },
{ x: 'Visited', y: 100, text: '100%' }];

describe('Accumulation Chart Control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Pyramid Series checking', () => {
        let ele: HTMLElement;
        let slice: Element;
        let loaded: EmitType<IAccLoadedEventArgs>;
        let id: string = 'ej2container'; let seriesId: string = id + '_Series_0';
        let sliceid: string = id + '_Series_0' + '_Point_';
        let tooltipid: string = id + '_2_content';
        let slicepath: SliceOption;
        let y: number;
        let i: number = 0;
        let length: number;
        let chart: AccumulationChart;
        let points: AccPoints[];
        let trigger: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            ele = createElement('div', { id: id });
            document.body.appendChild(ele);
            chart = new AccumulationChart({
                series: [
                    {
                        type: 'Pyramid'
                    }
                ], width: '600', height: '400', legendSettings: { visible: false }
            });
            chart.appendTo('#' + id);
        });

        afterAll((): void => {
            chart.loaded = null;
            chart.destroy();
            remove(getElement(id));
        });

        it('Empty Pyramid series', (done: Function) => {
            chart.loaded = () => {
                let group: Element = getElement(seriesId);
                expect(group != null).toBe(true);
                expect(group.childNodes.length).toBe(0);
                done();
            };
            chart.refresh();
        });

        it('Pyramid series with points', (done: Function) => {
            chart.loaded = () => {
                //debugger//checked
                let group: Element = getElement(seriesId);
                expect(group != null).toBe(true);
                expect(group.childNodes.length).toBe(5);
                done();
            };

            chart.series[0].dataSource = data;
            chart.series[0].xName = 'x';
            chart.series[0].yName = 'y';
            chart.refresh();
        });
        it('Checking with percentage value for point', (done: Function) => {
            chart.loaded = () => {
                let point: AccPoints = chart.visibleSeries[0].points[0];
                expect(point.percentage != null).toBe(true);
                expect(point.percentage).toBe(6.54);
                done();
            }
            chart.refresh();
        });

        it('Checking default Pyramid size', (done: Function) => {
            //debugger//checked
            let group: Element = getElement(seriesId);
            let bounds: ClientRect = group.getBoundingClientRect();
            //expect((bounds.width === 464.0000305175781 || bounds.width === 464)  && (bounds.height === 304 || bounds.height === 301.312255859375)).toBe(true);
            done();
        });

        it('Checking Pyramid series without data labels', (done: Function) => {
            //debugger//checked
            let group: Element = getElement('container_datalabel_Series_0');
            expect(group).toBe(null);
            done();
        });

        it('Checking default legend position', (done: Function) => {
            chart.loaded = () => {
                //debugger//checked
                let group: Element = getElement('ej2container_chart_legend_element');
                expect(group.getAttribute('x') === '75.5' || group.getAttribute('x') === '85.5').toBe(true);
                expect(group.getAttribute('y')).toBe('11');
                expect(group.getAttribute('width') === '449' || group.getAttribute('width') === '429').toBe(true);
                expect(group.getAttribute('height') === '33' || group.getAttribute('height') === '32').toBe(true);
                done();

            };
            chart.legendSettings.visible = true;
            chart.series[0].dataLabel.visible = true;
            chart.refresh();
        });

        it('Color saturation fill as red', (done: Function) => {
            loaded = (args: Object): void => {
                let element: HTMLElement = document.getElementById('ej2container_datalabel_Series_0_text_2');
                expect(element.getAttribute('fill') == 'white').toBe(true); done();
            };
            chart.loaded = loaded;
            chart.series[0].dataLabel.fill = 'red';
            chart.refresh();
        });

        it('Checking default legend shape', (done: Function) => {
            //debugger //checked
            let group: Element = getElement('ej2container_chart_legend_shape_0');
            expect(group.getAttribute('d') == 'M 83.5 32 L 88.5 22 L 93.5 32 L 83.5 32 z' ||
                group.getAttribute('d') == 'M 93.5 32 L 98.5 22 L 103.5 32 L 93.5 32 z').toBe(true);
            done();
        });

        it('Checking default palette colors', (done: Function) => {
            //debugger //checked
            let group: Element = getElement(sliceid + '0');
            expect(group.getAttribute('fill')).toBe('#00bdae');
            group = getElement(sliceid + '1');
            expect(group.getAttribute('fill')).toBe('#404041');
            group = getElement(sliceid + '2');
            expect(group.getAttribute('fill')).toBe('#357cd2');
            group = getElement(sliceid + '3');
            expect(group.getAttribute('fill')).toBe('#e56590');
            group = getElement(sliceid + '4');
            expect(group.getAttribute('fill')).toBe('#f8b883');
            done();

        });

        //with various kind of points
        it('Pyramid series with empty and valid points', (done: Function) => {
            chart.loaded = () => {
                //debugger//checked
                let group: Element = getElement('ej2container_Series_0_Point_3');
                expect(group).toBe(null);

                //reset data source
                data.splice(3, 1);
                chart.series[0].dataSource = data;
                chart.loaded = null;
                done();
            };

            data.splice(3, 0, { x: 'A', y: null });
            chart.series[0].dataSource = data;
            chart.refresh();
        });


        it('Pyramid series with average empty point mode', (done: Function) => {
            chart.loaded = () => {
                let group: Element = getElement('ej2container_Series_0_Point_3');
                expect(group).not.toBe(null);
                expect(Math.floor(group.getBoundingClientRect().height) == 53).toBe(true);
                //reset data source
                data.splice(3, 1);
                chart.series[0].dataSource = data;
                chart.loaded = null;
                done();
            };

            data.splice(3, 0, { x: 'A', y: null });
            chart.series[0].dataSource = data;
            chart.series[0].emptyPointSettings.mode = 'Average';
            chart.refresh();
        });

        it('Pyramid series with zero empty point mode', (done: Function) => {
            chart.loaded = () => {
                let group: Element = getElement('ej2container_Series_0_Point_3');
                expect(group).not.toBe(null);
                expect(group.getBoundingClientRect().height == 0).toBe(true);
                //reset data source
                data.splice(3, 1);
                chart.series[0].dataSource = data;
                chart.loaded = null;
                done();
            };

            data.splice(3, 0, { x: 'A', y: null });
            chart.series[0].dataSource = data;
            chart.series[0].emptyPointSettings.mode = 'Zero';
            chart.refresh();
        });

        it('Pyramid series - with a value as 0', (done: Function) => {
            chart.loaded = () => {
                //debugger
                let group: Element = getElement('ej2container_Series_0_Point_3');
                expect(group.getBoundingClientRect().height).toBe(0);

                //reset data source
                data.splice(3, 1);
                chart.series[0].dataSource = data;
                chart.loaded = null;
                done();

            };

            data.splice(3, 0, { x: 'A', y: 0 });
            chart.series[0].dataSource = data;
            chart.refresh();
        });

        //gap ratio
        it('Pyramid segments with gaps', (done: Function) => {
            chart.loaded = () => {
                //debugger//checked
                let group: Element = getElement('ej2container_Series_0_Point_2');
                let bounds: ClientRect = group.getBoundingClientRect();
                expect(bounds.top == 150.496826171875 || bounds.top == 149.781494140625).toBe(true);
                expect(Math.floor(bounds.height) == 44).toBe(true);
                done();

            };
            chart.series[0].gapRatio = 0.2;
            chart.refresh();
        });

        //Pyramid size
        it('Pyramid series with custom Pyramid size', (done: Function) => {
            chart.loaded = () => {
                //debugger //checked
                let group: Element = getElement('ej2container_Series_0');
                let bounds: ClientRect = group.getBoundingClientRect();
                expect(bounds.width).toBe(290);
                expect(bounds.height == 173 || bounds.height == 173.5).toBe(true);
                done();


            };
            chart.series[0].width = '50%';
            chart.series[0].height = '50%';
            chart.refresh();
        });

        it('Pyramid series with default data label', (done: Function) => {
            chart.loaded = () => {
                //debugger
                let group: Element = getElement('ej2container_datalabel_Series_0_text_3');
                expect(group.getAttribute('x') == '291' || group.getAttribute('x') == '290.5').toBe(true);
                expect(group.getAttribute('y') == '222.44647735442126' || group.getAttribute('y') == '221.948490294752').toBe(true);
                done();

            };
            chart.series[0].width = '80%';
            chart.series[0].height = '80%';
            chart.series[0].neckWidth = chart.series[0].neckWidth = '20%';
            chart.series[0].gapRatio = 0;
            chart.series[0].dataLabel.visible = true;
            chart.refresh();
        });

        it('Pyramid series with inside labels', (done: Function) => {
            chart.loaded = () => {
                //debugger
                let group: Element = getElement('ej2container_datalabel_Series_0_text_3');
                expect(group.getAttribute('x') == '291' || group.getAttribute('x') == '290.5').toBe(true);
                expect(group.getAttribute('y') == '222.44647735442126' || group.getAttribute('y') == '221.948490294752').toBe(true);
                done();
            };
            chart.series[0].dataLabel.position = 'Inside';
            chart.refresh();
        });


        it('Pyramid series with outside labels', (done: Function) => {
            chart.loaded = () => {
                //debugger
                let group: Element = getElement('ej2container_datalabel_Series_0_text_3');
                expect(group.getAttribute('x')).toBe('545');
                expect(group.getAttribute('y') == '221.44647735442126' ||
                    group.getAttribute('y') == '220.948490294752').toBe(true);
                done();


            };
            chart.series[0].dataLabel.position = 'Outside';
            chart.refresh();
        });

        it('Check the default connector line', (done: Function) => {
            chart.loaded = () => {
                //debugger
                let group: Element = getElement('ej2container_datalabel_Series_0_connector_2');
                expect(group.getAttribute('fill')).toBe('transparent');
                expect(group.getAttribute('stroke')).toBe('#357cd2');
                expect(group.getAttribute('stroke-width')).toBe('1');
                expect(group.getAttribute('stroke-dasharray')).toBe('');
                done();


            };
            chart.refresh();
        });

        it('Data labels with connector (custom length)', (done: Function) => {
            chart.loaded = () => {
                //debugger
                let group: Element = getElement('ej2container_datalabel_Series_0_connector_2');
                expect(group.getAttribute('d') == 'M 361.2523364485981 151.68037383177568 L 402.7523364485981 151.68037383177568 L 412.7523364485981 151.68037383177568' ||
                    group.getAttribute('d') == 'M 361.2523364485981 150.99158878504673 L 402.7523364485981 150.99158878504673 L 412.7523364485981 150.99158878504673' ||
                    group.getAttribute('d') == 'M 361.2523364485981 150.99158878504673 L 403.7523364485981 150.99158878504673 L 413.7523364485981 150.99158878504673').toBe(true);
                done();



                //reset default connector style
                chart.series[0].dataLabel.connectorStyle = { length: null };
                chart.loaded = null;
            };
            chart.series[0].dataLabel.connectorStyle = { length: '40px' };
            chart.refresh();
        });

        it('Data labels with hidden connector (opacity-0)', (done: Function) => {
            chart.loaded = () => {
                //debugger
                let group: Element = getElement('ej2container_datalabel_Series_0_connector_2');
                expect(group.getAttribute('stroke-width')).toBe('0');
                done();
                chart.series[0].dataLabel.connectorStyle.width = 1;
                chart.loaded = null;
            };
            chart.series[0].dataLabel.connectorStyle.width = 0;
            chart.refresh();
        });

        it('Checking smart labels for inside position', (done: Function) => {
            chart.loaded = () => {
                //debugger
                let group: Element = getElement('ej2container_datalabel_Series_0_text_3');
                expect(group.getAttribute('x')).toBe('509.78682170542635');
                expect(group.getAttribute('y') == '221.19147286821703' ||
                    group.getAttribute('y') == '220.44147286821703').toBe(true);
                done();
            };
            //fourth label should be outside
            data[3]['y'] = 5;
            chart.series[0].dataSource = data;
            chart.series[0].dataLabel.position = 'Inside';
            chart.refresh();
        });

        it('Checking smart labels for outside position', (done: Function) => {
            chart.loaded = () => {
                //debugger
                let group: Element = getElement('ej2container_datalabel_Series_0_text_3');
                expect(group.getAttribute('x')).toBe('545');
                expect(group.getAttribute('y') == '186.14003215434082' ||
                    group.getAttribute('y') == '182.39003215434082').toBe(true);
                done();
            };
            //a label will be hidden
            data[3]['y'] = 5;
            data[2]['y'] = 5;
            chart.series[0].dataLabel.position = 'Outside';
            chart.refresh();
        });

        it('Checking overlapped labels for inside position', (done: Function) => {
            chart.loaded = () => {
                //debugger
                let group: Element = getElement('ej2container_datalabel_Series_0_text_3');
                expect(group.getAttribute('x')).toBe('298');
                expect(group.getAttribute('y') == '177.066077170418' ||
                    group.getAttribute('y') == '176.316077170418').toBe(true);
                done();


            };
            //fourth label should be outside
            data[3]['y'] = 5;
            chart.series[0].dataLabel.position = 'Inside';
            chart.enableSmartLabels = false;
            chart.refresh();
        });

        it('Checking overlapped labels for outside position', (done: Function) => {
            chart.loaded = () => {
                //debugger
                let group: Element = getElement('ej2container_datalabel_Series_0_text_3');
                expect(group.getAttribute('x')).toBe('545');
                expect(group.getAttribute('y') == '176.066077170418' ||
                    group.getAttribute('y') == '175.316077170418').toBe(true);
                done();

            };
            //a label will be hidden
            data[3]['y'] = 5;
            data[2]['y'] = 5;
            chart.series[0].dataLabel.position = 'Outside';
            chart.refresh();
        });

        it('Checking labels at outside, when Pyramid width is 100%', (done: Function) => {
            chart.loaded = () => {
                //debugger
                let group: Element = getElement('ej2container_datalabel_Series_0');

                expect(group.childNodes.length).toBe(0);
                done();
            };
            //a label will be hidden
            data[3]['y'] = 5;
            data[2]['y'] = 5;
            chart.series[0].dataLabel.position = 'Outside';
            chart.series[0].width = '100%';
            chart.enableSmartLabels = true;
            chart.refresh();
        });


        //explosion
        it('Explode a Pyramid segment', (done: Function) => {
            chart.loaded = () => {
                //debugger
                let group: Element = getElement(sliceid + '2');

                expect(group.getAttribute('transform') != '').toBe(true);
                done();

            };
            chart.series[0].width = '70%';
            chart.series[0].explode = true;
            //explodes the segment at third position
            chart.series[0].explodeIndex = 2;
            chart.enableAnimation = false;
            chart.refresh();
        });

        it('Checking default explode offset', (done: Function) => {
            chart.loaded = () => {
                let group: Element = getElement(sliceid + '2');
                expect(group.getAttribute('transform') == 'translate(25, 0)').toBe(true);
                done();
            };
            chart.refresh();
        });

        it('Checking custom explode offset', (done: Function) => {
            chart.loaded = () => {
                let group: Element = getElement(sliceid + '2');
                expect(group.getAttribute('transform') == 'translate(30, 0)').toBe(true);
                done();
            };
            //explodes the segment at third position

            chart.series[0].explodeOffset = '30px';
            chart.refresh();
        });

        //interaction
        it('Explode a segment on click', (done: Function) => {
            //debugger
            chart.loaded = () => {
                let pointElement: Element = getElement(sliceid + '3');
                trigger.clickEvent(pointElement);
                let group: Element = getElement(sliceid + '3');

                expect(group.getAttribute('transform') != '').toBe(true);
                done();
            }
            chart.series[0].explodeIndex = null;
            chart.refresh();
        });

        // it('De-Explode a segment on click', (done: Function) => {
        //     chart.loaded = () => {
        //         let pointElement: Element = getElement(sliceid + '3');
        //         trigger.clickEvent(pointElement);
        //         let group: Element = getElement(sliceid + '3');
        //         expect(group.getAttribute('transform')).toBe('translate(0, 0)');
        //         done();
        //     };
        //     chart.refresh();
        // });


        it('Select a segment on click', (done: Function) => {
            chart.loaded = () => {
                let pointElement: Element = getElement(sliceid + '3');
                trigger.clickEvent(pointElement);
                // debugger
                let group: Element = getElement(sliceid + '3');

                expect(group.getAttribute('class')).toBe('ej2container_ej2_chart_selection_series_0_point_3');
                expect(group.getAttribute('transform')).toBe(null);
                done();
            };
            chart.series[0].explode = false;
            chart.selectionMode = 'Point';
            chart.refresh();
        });

        it('Un-Select a segment on click', (done: Function) => {
            let pointElement: Element = getElement(sliceid + '3');
            trigger.clickEvent(pointElement);
            let group: Element = getElement(sliceid + '3');

            expect(group.getAttribute('class')).toBe('');
            expect(group.getAttribute('transform')).toBe(null);
            done();
        });

        it('Select and explode segment on click', (done: Function) => {
            chart.loaded = () => {
                let pointElement: Element = getElement(sliceid + '3');
                trigger.clickEvent(pointElement);
                let group: Element = getElement(sliceid + '3');
                expect(group.getAttribute('class')).toBe('ej2container_ej2_chart_selection_series_0_point_3');
                expect(group.getAttribute('transform')).toBe('translate(30, 0)');
                done();
                trigger.clickEvent(pointElement);
            };
            chart.series[0].explode = true;
            chart.selectionMode = 'Point';
            chart.refresh();
        });
        //custom legend

        it('Checking custom legend shape', (done: Function) => {
            chart.loaded = () => {
                //debugger
                let group: Element = getElement('ej2container_chart_legend_shape_0');
                expect(group.getAttribute('d') == 'M 83.5 27 L 88.5 22 L 93.5 27 L 88.5 32 L 83.5 27 z' ||
                    group.getAttribute('d') == 'M 93.5 27 L 98.5 22 L 103.5 27 L 98.5 32 L 93.5 27 z').toBe(true);
                done();
            };

            chart.series[0].legendShape = 'Diamond';
            chart.refresh();
        });

        it('Checking custom legend position', (done: Function) => {
            chart.loaded = () => {
                //debugger
                let group: Element = getElement('ej2container_chart_legend_element');
                expect(group.getAttribute('x') == '484' || group.getAttribute('x') == '490').toBe(true);
                expect(group.getAttribute('y') == '133.5' || group.getAttribute('y') == '136').toBe(true);
                expect(group.getAttribute('width') == '106' || group.getAttribute('width') == '100').toBe(true);
                expect(group.getAttribute('height') == '133' || group.getAttribute('height') == '128').toBe(true);
                done();
                done();
            };

            chart.legendSettings.position = 'Right';
            chart.refresh();
        });

        //grouping
        it('Pyramid series with group', (done: Function) => {
            chart.loaded = () => {
                let group: Element = getElement('ej2container_Series_0');
                expect(group.children.length).toBe(4);
                done();
            };
            chart.legendSettings.position = 'Top';
            chart.series[0].groupTo = '5%';
            chart.refresh();
        });


        //pyramid based on the surface
        it('Pyramid series with surface mode', (done: Function) => {
            chart.loaded = () => {
                let group: Element = getElement('ej2container_Series_0_Point_0');
                expect(group.getBoundingClientRect().height == 70.29558563232422 ||
                    group.getBoundingClientRect().height == 70.49845886230469);
                done();
            };
            chart.series[0].pyramidMode = 'Surface';
            chart.refresh();
        });

        //pyramid based on the surface
        it('Pyramid series with surface mode with empty points', (done: Function) => {
            chart.loaded = () => {
                let group: Element = getElement('ej2container_Series_0_Point_0');
                expect(group.getBoundingClientRect().height == 64.05076599121094 ||
                    group.getBoundingClientRect().height == 64.23561096191406);
                done();
            };
            chart.series[0].pyramidMode = 'Surface';
            data[1]['y'] = undefined;
            chart.series[0].dataSource = data;
            chart.refresh();
        });

        it('Pyramid with legend click', (done: Function) => {
            chart.loaded = () => {
                chart.loaded = null;
                let legendElement: Element = getElement('ej2container_chart_legend_shape_0');
                trigger.clickEvent(legendElement);
                // debugger
                let group: Element = getElement(seriesId);
                expect(group.children.length).toBe(2);
                done();
            };
            chart.refresh();
        });

        //checking tooltip
        it('Pyramid tooltip visibility', (done: Function) => {
            chart.loaded = (args: IAccLoadedEventArgs) => {
                let segement: Element = getElement(sliceid + 0);
                trigger.mousemoveEvent(segement, 0, 0, 200, 200);
                let tooltip: HTMLElement = document.getElementById('ej2container_tooltip');
                expect(tooltip != null).toBe(true);
                done();
            };
            chart.tooltip.enable = true;
            chart.tooltip.enableAnimation = false;
            chart.refresh();
        });
    });
    describe('Corner Radius', () => {
        let ele: HTMLElement;

        let id: string = 'ej2container';

        let chart: AccumulationChart;

        beforeAll((): void => {
            ele = createElement('div', { id: id });
            document.body.appendChild(ele);
            chart = new AccumulationChart({
                series: [
                    {
                        type: 'Pyramid',
                        borderRadius: 30
                    }
                ], width: '600', height: '400', legendSettings: { visible: false },

            });
            chart.appendTo('#' + id);
        });

        afterAll((): void => {
            chart.loaded = null;
            chart.destroy();
            remove(getElement(id));
        });
        it('Top', (done: Function) => {

            chart.loaded = () => {
                let group: Element = getElement('ej2container_Series_0_Point_0');
                expect(group.getAttribute('d')).toBe('M 290.0092924195622 61.091272001952944 Q300 48 309.9907075804378 61.091272001952944 L309.9907075804378 61.091272001952944 L322.94532986105986 78.06629430069916 Q332.93603744149766 91.1575663026521 332.93603744149766 91.1575663026521 L267.06396255850234 91.1575663026521 Q267.06396255850234 91.1575663026521 277.05467013894014 78.06629430069916 Z ');
                done();
            }
            chart.series[0].dataSource = data;
            chart.series[0].xName = 'x';
            chart.series[0].yName = 'y';
            chart.refresh();

        });
        it('OnePoint', (done: Function) => {

            chart.loaded = () => {
                let group: Element = getElement('ej2container_Series_0_Point_0');
                expect(group.getAttribute('d')).toBe('M 281.79980041949426 71.84853738135232 Q300 48 318.20019958050574 71.84853738135232 L318.20019958050574 71.84853738135232 L513.7998004194943 328.1514626186476 Q532 351.99999999999994 502 351.99999999999994 L98.00000000000003 351.99999999999994 Q68.00000000000003 351.99999999999994 86.20019958050575 328.1514626186476 Z ');
                done();
            }
            chart.series[0].dataSource = [{ x: 'Renewed', y: 18.2, text: '18.20%' }];
            chart.series[0].xName = 'x';
            chart.series[0].yName = 'y';
            chart.refresh();

        });
        it('Bottom', (done: Function) => {

            chart.loaded = () => {
                let group: Element = getElement('ej2container_Series_0_Point_4');
                expect(group.getAttribute('d')).toBe('M 230.76703910904186 138.71905220194515 Q248.96723868954757 114.87051482059282 248.96723868954757 114.87051482059282 L351.03276131045243 114.87051482059282 L513.7998004194943 328.15146261864766 Q532 352 502 352 L98 352 Q68 352 86.20019958050571 328.15146261864766 Z ');
                done();
            }
            chart.series[0].dataSource = data;
            chart.series[0].xName = 'x';
            chart.series[0].yName = 'y';

            chart.refresh();

        });
    });
    describe('Pyramid Series - Checking animation on data changes.', () => {
        let ele: HTMLElement;
        let pie: AccumulationChart;
        let id: string = 'ej2container';
        beforeAll((): void => {
            ele = createElement('div', { id: id });
            document.body.appendChild(ele);

            pie = new AccumulationChart({
                series: [
                    {
                        type: 'Pyramid',
                        dataLabel: { visible: true, name: 'text' },
                        dataSource: piedata, animation: { enable: false }, xName: 'x', yName: 'y'

                    }
                ], width: '450', height: '400', legendSettings: { visible: true }
            });
            pie.appendTo('#' + id);
        });

        afterAll((): void => {
            pie.loaded = null;
            pie.destroy();
            removeElement(id);
        });

        it('checking pyramid series with setdata', (done: Function) => {
            pie.loaded = (args: Object): void => {
                pie.loaded = null;
                const element: Element = document.getElementById('ej2container_Series_0_Point_1');
                expect(element.getAttribute('d') !== '').toBe(true);
                console.log('pyramid');
                done();
            };
            (pie.series[0] as AccumulationSeries).setData([{ y: 18, x: 1, name: 'Bald Eagle', text: 'Bald Eagle : 18', radius: '50%' }, { y: 23, x: 2, name: 'Bison', text: 'Bison : 23', radius: '60%' },
            { y: 30, x: 3, name: 'Brown Bear', text: 'Brown Bear : 30', radius: '70%' }, { y: 44, x: 4, name: 'Elk', text: 'Elk : 44', radius: '100%' },
            { y: 52, x: 10, name: 'Pronghorn', text: 'Pronghorn : 52', radius: '80%' }, { y: 62, x: 6, name: 'Turkey', text: 'Turkey : 62', radius: '80%' },
            { y: 74, x: 7, name: 'Alligator', text: 'Alligator : 74', radius: '80%' }, { y: 85, x: 8, name: 'Prairie Dog', text: 'Prairie Dog : 85', radius: '80%' },
            { y: 96, x: 15, name: 'Mountain Lion', text: 'Mountain Lion : 96', radius: '80%' }, { y: 102, x: 10, name: 'Beaver', text: 'Beaver : 102', radius: '80%' }])
            pie.refresh();
        });

        it('checking pyramid series with addPoint', (done: Function) => {
            pie.loaded = (args: Object): void => {
                pie.loaded = null;
                const element: Element = document.getElementById('ej2container_Series_0_Point_1');
                expect(element.getAttribute('d') !== '').toBe(true);
                done();
            };
            (pie.series[0] as AccumulationSeries).addPoint({ x: "Dog", y: 15, text: '15%' });
            pie.refresh();
        });

        it('checking pyramid series with removePoint', (done: Function) => {
            pie.loaded = (args: Object): void => {
                pie.loaded = null;
                const element: Element = document.getElementById('ej2container_Series_0_Point_1');
                expect(element.getAttribute('d') !== '').toBe(true);
                done();
            };
            (pie.series[0] as AccumulationSeries).removePoint(0);
            pie.refresh();
        });

    });
    describe('Pyramid Series - Checking datalabel with enabled wrap.', () => {
        let ele: HTMLElement;
        let pie: AccumulationChart;
        let id: string = 'ej2container';
        beforeAll((): void => {
            ele = createElement('div', { id: id });
            document.body.appendChild(ele);

            pie = new AccumulationChart({
                enableSmartLabels: true,

                series: [{
                    type: 'Pyramid', dataSource: [{ x: 'Milk, Youghnut, Cheese', y: 435, text:  'Milk, Youghnut, Cheese: 435 cal' },
                        { x: 'Vegetables', y: 470, text: 'Vegetables: 470 cal' },
                        { x: 'Meat, Poultry, Fish', y: 475, text:  'Meat, Poultry, Fish: 475 cal' },
                        { x: 'Rice, Pasta', y: 930, text: 'Rice, Pasta: 930 cal' },
                        { x: 'Fruits', y: 520, text: 'Fruits: 520 cal' }], xName: 'x', yName: 'y', width: '45%', height: '80%',
                    neckWidth: '15%', gapRatio: 0.03, name: 'Food',
                    dataLabel: {
                        textWrap: 'Wrap',
                        name: 'text', visible: true, position: 'Inside', connectorStyle: {length: '20px'}, font: {
                            fontWeight: '600'
                        }
                    }, explode: true, emptyPointSettings: { mode: 'Drop', fill: 'red' },

                }],
                legendSettings: {
                    visible: false
                },

                tooltip: { enable: true, format: '${point.x} : <b>${point.y} cal</b>',header:'' },

                title: 'Food Comparison Chart',
            });
            pie.appendTo('#' + id);
        });

        afterAll((): void => {
            pie.loaded = null;
            pie.destroy();
            removeElement(id);
        });
        it('checking pyramid series with removePoint', (done: Function) => {
            pie.loaded = (args: Object): void => {
                pie.loaded = null;
                const element: Element = document.getElementById('ej2container_datalabel_Series_0_text_0');
                expect(element.getAttribute('x')).toBe('440.06344942579506');
                expect(element.getAttribute('y')).toBe('97.52150530035335');
                expect(element.textContent).toBe('Milk, Youghnut, Cheese: 435 cal');
                done();
            };
            pie.refresh();
        });});
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

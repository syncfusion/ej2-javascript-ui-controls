/**
 * Pyramid Series Spec file
 */
import { createElement, remove } from '@syncfusion/ej2-base';
import { EmitType } from '@syncfusion/ej2-base';
import { PyramidSeries } from '../../../src/accumulation-chart/renderer/pyramid-series';
import { AccumulationChart } from '../../../src/accumulation-chart/accumulation';
import { AccumulationLegend } from '../../../src/accumulation-chart/renderer/legend';
import { AccPoints } from '../../../src/accumulation-chart/model/acc-base';
import { getElement } from '../../../src/common/utils/helper';
import { AccumulationDataLabel } from '../../../src/accumulation-chart/renderer/dataLabel';
import { AccumulationSelection } from '../../../src/accumulation-chart/user-interaction/selection';
import { AccumulationTooltip } from '../../../src/accumulation-chart/user-interaction/tooltip';

import { SliceOption } from '../base/util.spec';
import { MouseEvents } from '../../chart/base/events.spec';
import { IAccLoadedEventArgs, IAccTooltipRenderEventArgs } from '../../../src/accumulation-chart/model/pie-interface';
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
        expect(bounds.width).not.toBe(null);
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
            expect(group.getAttribute('x') === '105' || group.getAttribute('x') === '105.5' || group.getAttribute('x') === '117').toBe(true);
            expect(group.getAttribute('y')).toBe('11');
            expect(group.getAttribute('width') === '390' || group.getAttribute('width') === '389' || group.getAttribute('width') === '366').toBe(true);
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
        expect(group.getAttribute('d') == 'M 113 32.5 L 118 22.5 L 123 32.5 L 113 32.5 z' ||
            group.getAttribute('d') == 'M 113.5 31.5 L 118.5 21.5 L 123.5 31.5 L 113.5 31.5 z' ||
            group.getAttribute('d') == 'M 125 32 L 130 22 L 135 32 L 125 32 z' ||
        group.getAttribute('d') == 'M 113.5 32.5 L 118.5 22.5 L 123.5 32.5 L 113.5 32.5 z').toBe(true);
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
            expect(bounds.top == 150.496826171875 || bounds.top ==  149.781494140625).toBe(true);
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
            expect(group.getAttribute('x') == '291' || group.getAttribute('x') == '291.5').toBe(true);
            expect(group.getAttribute('y') == '222.44647735442126' || group.getAttribute('y') == '221.198490294752').toBe(true);
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
            expect(group.getAttribute('x') == '291' || group.getAttribute('x') == '291.5').toBe(true);
            expect(group.getAttribute('y') == '222.44647735442126' || group.getAttribute('y') == '221.198490294752').toBe(true);
            done();
        };
        chart.series[0].dataLabel.position = 'Inside';
        chart.refresh();
    });


    it('Pyramid series with outside labels', (done: Function) => {
        chart.loaded = () => {
            //debugger
            let group: Element = getElement('ej2container_datalabel_Series_0_text_3');
            expect(group.getAttribute('x')).toBe('535');
            expect(group.getAttribute('y') == '221.44647735442126' ||
                group.getAttribute('y') == '220.198490294752').toBe(true);
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
                group.getAttribute('d') == 'M 361.2523364485981 150.99158878504673 L 402.7523364485981 150.99158878504673 L 412.7523364485981 150.99158878504673').toBe(true);
            done();



            //reset default connector style
            chart.series[0].dataLabel.connectorStyle = { length: null };
            chart.loaded = null;
        };
        chart.series[0].dataLabel.connectorStyle = { length: '40px' };
        chart.refresh();
    });

    it('Data labels with custom connector', (done: Function) => {
        chart.loaded = () => {
            //debugger
            let group: Element = getElement('ej2container_datalabel_Series_0_connector_2');
            expect(group.getAttribute('fill')).toBe('transparent');
            expect(group.getAttribute('stroke')).toBe('red');
            expect(group.getAttribute('stroke-width')).toBe('5');
            expect(group.getAttribute('stroke-dasharray')).toBe('');
            expect(group.getAttribute('d') == 'M 361.2523364485981 151.68037383177568 L 410.7523364485981 151.68037383177568' ||
                group.getAttribute('d') == 'M 361.2523364485981 150.99158878504673 L 410.7523364485981 150.99158878504673').toBe(true);
            done();

            //reset default connector style
            chart.series[0].dataLabel.connectorStyle = { color: null, length: null, type: 'Line', width: 1 };
            chart.loaded = null;
        };
        chart.series[0].dataLabel.connectorStyle = { color: 'red', type: 'Curve', length: '40px', width: 5 };
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
            expect(group.getAttribute('x')).toBe('499.78682170542635');
            expect(group.getAttribute('y') == '221.6887596899225' ||
                group.getAttribute('y') == '220.44147286821703').toBe(true);
            done();
        };
        //fourth label should be outside
        data[3]['y'] = 5;
        chart.series[0].dataLabel.position = 'Inside';
        chart.refresh();
    });

    it('Checking smart labels for outside position', (done: Function) => {
        chart.loaded = () => {
            //debugger
            let group: Element = getElement('ej2container_datalabel_Series_0_text_3');
            expect(group.getAttribute('x')).toBe('535');
            expect(group.getAttribute('y') == '186.79308681672023' ||
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
            expect(group.getAttribute('y') == '177.69340836012861' ||
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
            expect(group.getAttribute('x')).toBe('535');
            expect(group.getAttribute('y') == '176.69340836012861' ||
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
        let group: Element = getElement(sliceid + '2');
        expect(group.getAttribute('transform') == 'translate(25, 0)').toBe(true);
        done();
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

    it('De-Explode a segment on click', (done: Function) => {
        let pointElement: Element = getElement(sliceid + '3');
        trigger.clickEvent(pointElement);
        let group: Element = getElement(sliceid + '3');
        expect(group.getAttribute('transform')).toBe('translate(0, 0)');
        done();

    });


    it('Select a segment on click', (done: Function) => {
        chart.loaded = () => {
            let pointElement: Element = getElement(sliceid + '3');
            trigger.clickEvent(pointElement);
            // debugger
            let group: Element = getElement(sliceid + '3');

            expect(group.getAttribute('class')).toBe('ej2container_ej2_chart_selection_series_0');
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
            expect(group.getAttribute('class')).toBe('ej2container_ej2_chart_selection_series_0');
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
            expect(group.getAttribute('d') == 'M 113 27.5 L 118 22.5 L 123 27.5 L 118 32.5 L 113 27.5 z' ||
                group.getAttribute('d') == 'M 125 26 L 130 21 L 135 26 L 130 31 L 125 26 z' ||
                group.getAttribute('d') == 'M 125 27 L 130 22 L 135 27 L 130 32 L 125 27 z' ||
            group.getAttribute('d') == 'M 113.5 27.5 L 118.5 22.5 L 123.5 27.5 L 118.5 32.5 L 113.5 27.5 z').toBe(true);
                done();
        };

        chart.series[0].legendShape = 'Diamond';
        chart.refresh();
    });

    it('Checking custom legend position', (done: Function) => {
        chart.loaded = () => {
            //debugger
            let group: Element = getElement('ej2container_chart_legend_element');
            expect(group.getAttribute('x') == '486' || group.getAttribute('x') == '493').toBe(true);
            expect(group.getAttribute('y') == '133.5' || group.getAttribute('y') == '136').toBe(true);
            expect(group.getAttribute('width') == '104' || group.getAttribute('width') == '97').toBe(true);
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


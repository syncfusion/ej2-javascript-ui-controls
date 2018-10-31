/**
 * Funnel Series Spec file
 */
import { createElement, remove } from '@syncfusion/ej2-base';
import { EmitType } from '@syncfusion/ej2-base';
import { FunnelSeries } from '../../../src/accumulation-chart/renderer/funnel-series';
import { AccumulationChart } from '../../../src/accumulation-chart/accumulation';
import { AccumulationLegend } from '../../../src/accumulation-chart/renderer/legend';
import { AccPoints } from '../../../src/accumulation-chart/model/acc-base';
import { getElement, removeElement } from '../../../src/common/utils/helper';
import { AccumulationDataLabel } from '../../../src/accumulation-chart/renderer/dataLabel';
import { AccumulationSelection } from '../../../src/accumulation-chart/user-interaction/selection';
import { AccumulationTooltip } from '../../../src/accumulation-chart/user-interaction/tooltip';

import { SliceOption } from '../base/util.spec';
import { MouseEvents } from '../../chart/base/events.spec';
import { IAccLoadedEventArgs, IAccTooltipRenderEventArgs,
        IAccTextRenderEventArgs } from '../../../src/accumulation-chart/model/pie-interface';
import '../../../node_modules/es6-promise/dist/es6-promise';
AccumulationChart.Inject(FunnelSeries, AccumulationLegend, AccumulationDataLabel, AccumulationSelection, AccumulationTooltip);


/* //funnel size
1.default size, 
2.custom neck size,
3.custom funnel size,
4.like inverted triangle
5.without neck (with a base)*/

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
6. outer label position when the funnel width is 100%
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

/* // grouping - missing
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

describe('Funnel Series checking', () => {
    let ele: HTMLElement;
    let slice: Element;
    let loaded: EmitType<IAccLoadedEventArgs>;
    let id: string = 'ej2container'; let seriesId: string = id + '_Series_0';
    let sliceid: string = id + '_Series_0' + '_Point_';
    let tooltipid: string = id + '_1_content';
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
                    type: 'Funnel'
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

    it('Empty funnel series', (done: Function) => {
        chart.loaded = () => {
            let group: Element = getElement(seriesId);
            expect(group != null).toBe(true);
            expect(group.childNodes.length).toBe(0);
            done();
        };
        chart.refresh();
    });

    it('Funnel series with points', (done: Function) => {
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
    it('Checking with percentage value for funnelSeries point', (done: Function) => {
        chart.loaded = () => {
        let point: AccPoints = chart.visibleSeries[0].points[2];
        expect(point.percentage != null).toBe(true);
        expect(point.percentage).toBe(20.09);
        done();
        }
        chart.refresh();
    });
    it('Checking default funnel size', (done: Function) => {
        //debugger//checked
        let group: Element = getElement(seriesId);
        let bounds: ClientRect = group.getBoundingClientRect();
        expect((bounds.width === 464 || bounds.width == 468) && (bounds.height === 304 || bounds.height === 308)).toBe(true);
        done();

    });

    it('Checking default neck size', (done: Function) => {
        //debugger//checked
        let bounds: ClientRect = document.getElementById('ej2container_Series_0_Point_0').getBoundingClientRect();
        expect(bounds.width === 116 && (bounds.height === 19.887859344482422 ||
            bounds.height === 23.899993896484375 || bounds.height == 19.887847900390625)).toBe(true);
        bounds = document.getElementById('ej2container_Series_0_Point_1').getBoundingClientRect();
        expect(bounds.width === 116 && (bounds.height === 29.831787109375 || bounds.height === 33.83178710937)).toBe(true);
        bounds = document.getElementById('ej2container_Series_0_Point_2').getBoundingClientRect();
        expect(bounds.width === 169.1215057373047 && (bounds.height === 61.0841064453125 || bounds.height === 65.0841064453125)).toBe(true);
        done();
    });

    it('Checking funnel series without data labels', (done: Function) => {
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

    it('Checking default legend shape', (done: Function) => {
        //debugger //checked
        let group: Element = getElement('ej2container_chart_legend_shape_0');
        expect(group.getAttribute('d') === 'M 123 22.5 L 118 32.5 L 113 22.5 L 123 22.5 z' ||
            group.getAttribute('d') === 'M 123.5 21.5 L 118.5 31.5 L 113.5 21.5 L 123.5 21.5 z' ||
            group.getAttribute('d') === 'M 135 22 L 130 32 L 125 22 L 135 22 z' ||
            group.getAttribute('d') == 'M 123.5 22.5 L 118.5 32.5 L 113.5 22.5 L 123.5 22.5 z').toBe(true);
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
        chart.loaded = null;
        done();

    });

    //with various kind of points

    it('Funnel series with empty and valid points', (done: Function) => {
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

    it('Funnel series with average empty point mode', (done: Function) => {
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

    it('Funnel series with zero empty point mode', (done: Function) => {
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

    it('Funnel series - with a value as 0', (done: Function) => {
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
    it('Funnel segments with gaps', (done: Function) => {
        chart.loaded = () => {
            //debugger//checked
            let group: Element = getElement('ej2container_Series_0_Point_2');
            let bounds: ClientRect = group.getBoundingClientRect();
            expect(Math.floor(bounds.top) === 255 || Math.floor(bounds.top) == 254).toBe(true);
            expect(Math.floor(bounds.height) == 44).toBe(true);
            done();

        };
        chart.series[0].gapRatio = 0.2;
        chart.refresh();
    });

    //funnel size
    it('Funnel series with custom funnel size', (done: Function) => {
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

    it('Funnel series with custom neck size', (done: Function) => {
        chart.loaded = () => {
            //debugger
            let group: Element = getElement('ej2container_Series_0_Point_2');
            let bounds: ClientRect = group.getBoundingClientRect();
            expect(Math.floor(bounds.height) == 44).toBe(true);

            group = getElement('ej2container_Series_0_Point_3');
            bounds = group.getBoundingClientRect();
            expect(Math.floor(bounds.height) == 61).toBe(true);
            done();


        };
        chart.series[0].width = '80%';
        chart.series[0].height = '80%';
        chart.series[0].neckWidth = '50%';
        chart.series[0].neckHeight = '50%';
        chart.refresh();
    });

    it('Funnel series as an inverted triangle', (done: Function) => {
        chart.loaded = () => {
            //debugger
            let group: Element = getElement(sliceid + '0');
            expect(group.getAttribute('d') === 'M284.822429906542 337.0630841121495 L315.1775700934579 337.0630841121495 L300 355.25 L300 355.25 L300 355.25 L300 355.25' ||
                group.getAttribute('d') === 'M284.822429906542 337.0630841121495 L315.1775700934579 337.0630841121495 L300 355.25 L300 355.25 L300 355.25 L300 355.25');

            done();
        };
        chart.series[0].neckWidth = '0%';
        chart.series[0].neckHeight = '0%';
        chart.series[0].gapRatio = 0;
        chart.refresh();
    });

    it('Funnel series without neck and with a base', (done: Function) => {
        chart.loaded = () => {
            //debugger
            let group: Element = getElement(sliceid + '0');
            expect(group.getAttribute('d') === 'M230.61682242990653 337.0630841121495 L369.3831775700935 337.0630841121495 L358 355.25 L358 355.25 L242 355.25 L242 355.25'
                || group.getAttribute('d') === 'M230.61682242990653 337.0630841121495 L369.3831775700935 337.0630841121495 L358 355.25 L358 355.25 L242 355.25 L242 355.25');
            done();


        };
        chart.series[0].neckWidth = '20%';
        chart.series[0].neckHeight = '0%';
        chart.refresh();
    });

    it('Funnel series with default data label', (done: Function) => {
        chart.loaded = () => {
            //debugger
            let group: Element = getElement('ej2container_datalabel_Series_0_text_3');
            expect(group.getAttribute('x') === '291' ||
                group.getAttribute('x') === '291.5');
            expect(group.getAttribute('y') === '220.80251617541336' ||
                group.getAttribute('y') === '219.55050323508266');
            done();

        };
        chart.series[0].width = '80%';
        chart.series[0].height = '80%';
        chart.series[0].neckWidth = chart.series[0].neckWidth = '20%';
        chart.series[0].gapRatio = 0;
        chart.series[0].dataLabel.visible = true;
        chart.refresh();
    });

    it('Funnel series with inside labels', (done: Function) => {
        chart.loaded = () => {
            //debugger
            let group: Element = getElement('ej2container_datalabel_Series_0_text_3');
            expect(group.getAttribute('x') === '291' ||
                group.getAttribute('x') === '291.5');
            expect(group.getAttribute('y') === '220.80251617541336' ||
                group.getAttribute('y') === '219.55050323508266');
            done();


        };
        chart.series[0].dataLabel.position = 'Inside';
        chart.refresh();
    });


    it('Funnel series with outside labels', (done: Function) => {
        chart.loaded = () => {
            //debugger
            let group: Element = getElement('ej2container_datalabel_Series_0_text_3');
            expect(group.getAttribute('x')).toBe('535');
            expect(group.getAttribute('y') === '220.0535226455787' ||
                group.getAttribute('y') === '218.801509705248').toBe(true);
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
            expect(group.getAttribute('d') == 'M 403.9392523364486 282.31962616822426 L 445.4392523364486 282.31962616822426 L 455.4392523364486 282.31962616822426' ||
                group.getAttribute('d') === 'M 403.9392523364486 282.00841121495324 L 445.4392523364486 282.00841121495324 L 455.4392523364486 282.00841121495324').toBe(true);
            done();

            //reset default connector style
            chart.series[0].dataLabel.connectorStyle = { length: null };
            chart.loaded = null;

        };

        chart.series[0].dataLabel.position = 'Outside';
        chart.series[0].dataLabel.connectorStyle = { length: '40px' };
        chart.refresh();
    });

    it('Data labels with custom connector', (done: Function) => {
        chart.loaded = () => {
            //debugger
            let group: Element = getElement('ej2container_datalabel_Series_0_connector_1');
            expect(group.getAttribute('fill')).toBe('transparent');
            expect(group.getAttribute('stroke')).toBe('red');
            expect(group.getAttribute('stroke-width')).toBe('5');
            expect(group.getAttribute('stroke-dasharray')).toBe('');
            expect(group.getAttribute('d') == 'M360.20532319391634,351.89176172370094 L363.29907319391634,350.8504383185467 L366.39282319391634,349.8091149133925 L369.48657319391634,348.76779150823836 L372.58032319391634,347.72646810308413 L375.67407319391634,346.6851446979299 L378.76782319391634,345.64382129277567 L381.86157319391634,344.60249788762155 L384.95532319391634,343.5611744824673 L388.04907319391634,342.5198510773131 L391.14282319391634,341.47852767215886 L394.23657319391634,340.4372042670047 L397.33032319391634,339.39588086185046 L400.42407319391634,338.3545574566962 L403.51782319391634,337.31323405154205 L406.61157319391634,336.2719106463879 L409.70532319391634,335.23058724123365' ||
                group.getAttribute('d') == 'M360.20532319391634,351.7816223067174 L363.29907319391634,350.9282213772708 L366.39282319391634,350.07482044782427 L369.48657319391634,349.22141951837773 L372.58032319391634,348.36801858893114 L375.67407319391634,347.5146176594846 L378.76782319391634,346.66121673003806 L381.86157319391634,345.80781580059147 L384.95532319391634,344.95441487114493 L388.04907319391634,344.1010139416984 L391.14282319391634,343.2476130122518 L394.23657319391634,342.39421208280527 L397.33032319391634,341.54081115335873 L400.42407319391634,340.68741022391214 L403.51782319391634,339.8340092944656 L406.61157319391634,338.980608365019 L409.70532319391634,338.1272074355725').toBe(true);
            done();

            //reset default connector style
            chart.series[0].dataLabel.connectorStyle = { color: null, length: null, type: 'Line', width: 1 };
            chart.loaded = null;
            //reset data source
            data[0]['y'] = 18.2;
            data[1]['y'] = 27.3;
        };
        //add curve type
        data[0]['y'] = 2;
        data[1]['y'] = 2;
        chart.series[0].dataSource = data;
        chart.series[0].dataLabel.connectorStyle = { color: 'red', type: 'Curve', length: '40px', width: 5 };
        chart.refresh();
    });

    //add one to check the curve

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
            expect(group.getAttribute('x')).toBe('528.5901162790698');
            expect(group.getAttribute('y') === '219.55988372093023'
                || group.getAttribute('y') === '218.30717054263565');
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
            expect(group.getAttribute('y') == '254.70691318327977' ||
                group.getAttribute('y') === '256.6099678456592').toBe(true);
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
            expect(group.getAttribute('y') === '265.8065916398714' ||
                group.getAttribute('y') === '264.683922829582').toBe(true);
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
            expect(group.getAttribute('y') === '264.8065916398714' ||
                group.getAttribute('y') === '263.683922829582').toBe(true);
            done();

        };
        //a label will be hidden
        data[3]['y'] = 5;
        data[2]['y'] = 5;
        chart.series[0].dataLabel.position = 'Outside';
        chart.refresh();
    });

    it('Checking labels at outside, when funnel width is 100%', (done: Function) => {
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
    it('Explode a funnel segment', (done: Function) => {
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
        };
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
            //  debugger
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
            expect(group.getAttribute('d') === 'M 113 27.5 L 118 22.5 L 123 27.5 L 118 32.5 L 113 27.5 z' ||
                group.getAttribute('d') === 'M 113.5 26.5 L 118.5 21.5 L 123.5 26.5 L 118.5 31.5 L 113.5 26.5 z' ||
                group.getAttribute('d') === 'M 125 27 L 130 22 L 135 27 L 130 32 L 125 27 z' ||
                group.getAttribute('d') == 'M 113.5 27.5 L 118.5 22.5 L 123.5 27.5 L 118.5 32.5 L 113.5 27.5 z').toBe(true);
                done();
        };
        chart.series[0].explodeOffset = null;
        chart.series[0].legendShape = 'Diamond';
        chart.refresh();
    });

    it('Checking custom legend position', (done: Function) => {
        chart.loaded = () => {            //debugger

            let group: Element = getElement('ej2container_chart_legend_element');
            expect(group.getAttribute('x') == '486' || group.getAttribute('x') == '493').toBe(true);
            expect(group.getAttribute('y') == '133.5' || group.getAttribute('y') == '136').toBe(true);
            expect(group.getAttribute('width') == '104' || group.getAttribute('width') == '97').toBe(true);
            expect(group.getAttribute('height') == '133' || group.getAttribute('height') == '128').toBe(true);
            done();
        };

        chart.legendSettings.position = 'Right';
        chart.refresh();
    });

    //grouping
    it('Funnel series with group', (done: Function) => {
        chart.loaded = () => {
            let group: Element = getElement('ej2container_Series_0');
            expect(group.children.length).toBe(4);
            done();
        };
        chart.legendSettings.position = 'Top';
        chart.series[0].groupTo = '5%';
        chart.series[0].dataLabel.position = 'Inside';
        chart.refresh();
    });

    it('Funnel with legend click', (done: Function) => {
        chart.loaded = () => {
            chart.loaded = null;
            let legendElement: Element = getElement('ej2container_chart_legend_shape_0');
            trigger.clickEvent(legendElement);
            let group: Element = getElement(seriesId);
            expect(group.children.length).toBe(3);
            trigger.clickEvent(legendElement);
            done();
        };
        chart.refresh();
    });

    //checking tooltip
    it('Funnel tooltip visibility', (done: Function) => {
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

    it('Legend click on Visible series', (done: Function) => {
        loaded = (args: Object): void => {
            chart.loaded = null;
            let legendElement: Element;
            let legendId: string = id + '_chart_legend';
            legendElement = document.getElementById(legendId + '_text_' + 0);
            trigger.clickEvent(legendElement);
            let group: Element = getElement('ej2container_datalabel_Series_0_text_2');
            expect(group.textContent).toBe('Visited : 100');
            expect(chart.series[0].visible).toBe(true);
            done();
        };
        chart.legendSettings = { visible: true };
        chart.series[0].dataLabel = { visible: true};
        chart.textRender = (args : IAccTextRenderEventArgs) : void => {
            args.text = args.point.x + ' : ' + args.text;
        };
        chart.loaded = loaded;
        chart.refresh();
    });
});


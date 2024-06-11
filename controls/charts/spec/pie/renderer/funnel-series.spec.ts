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
import { profile, inMB, getMemoryProfile } from '../../common.spec';
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

let dataPoints: object[] = [ { 'x': 'USA', y: 46, text: 'United States of America: 46' },
{ 'x': 'China', y: 26, text: 'China: 26' },
{ 'x': 'Russia', y: 19, text: 'Russia: 19' },
{ 'x': 'Germany', y: 17, text: 'Germany: 17' },
{ 'x': 'Japan', y: 12, text: 'Japan: 12' },
{ 'x': 'France', y: 10, text: 'France: 10' },
{ 'x': 'South Korea', y: 9, text: 'South Korea: 9' },
{ 'x': 'Great Britain', y: 27, text: 'Great Britain: 27' },
{ 'x': 'Australia', y: 8, text: 'Australia: 8' },
{ 'x': 'Netherlands', y: 8, text: 'Netherlands: 8' },
{ 'x': 'NewZealand', y: 4, text: 'New Zealand: 4' },
{ 'x': 'Uzbekistan', y: 4, text: 'Uzbekistan: 4' },      
{ 'x': 'Switzerland', y: 3, text: 'Switzerland: 3' },
{ 'x': 'South Africa', y: 2, text: 'South Africa: 2' }];

describe('Accumulation Chart Control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
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

    it('Checking default legend shape', (done: Function) => {
        //debugger //checked
        let group: Element = getElement('ej2container_chart_legend_shape_0');
        expect(group.getAttribute('d') === 'M 93.5 22 L 88.5 32 L 83.5 22 L 93.5 22 z' ||
            group.getAttribute('d') == 'M 103.5 22 L 98.5 32 L 93.5 22 L 103.5 22 z').toBe(true);
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
            expect(group.getAttribute('x')).toBe('545');
            expect(group.getAttribute('y') === '219.551509705248' ||
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
                group.getAttribute('d') === 'M 403.9392523364486 282.00841121495324 L 445.4392523364486 282.00841121495324 L 455.4392523364486 282.00841121495324' || 
                group.getAttribute('d') === 'M 403.9392523364486 282.00841121495324 L 446.4392523364486 282.00841121495324 L 456.4392523364486 282.00841121495324').toBe(true);
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
            expect(group.getAttribute('d') == 'M360.20532319391634,351.7816223067174 L363.61157319391634,350.7407213772708 L367.01782319391634,349.69982044782427 L370.42407319391634,348.65891951837773 L373.83032319391634,347.61801858893114 L377.23657319391634,346.5771176594846 L380.64282319391634,345.53621673003806 L384.04907319391634,344.49531580059147 L387.45532319391634,343.45441487114493 L390.86157319391634,342.4135139416984 L394.26782319391634,341.3726130122518 L397.67407319391634,340.33171208280527 L401.08032319391634,339.29081115335873 L404.48657319391634,338.24991022391214 L407.89282319391634,337.2090092944656 L411.29907319391634,336.168108365019 L414.70532319391634,335.1272074355725' ||
                group.getAttribute('d') == 'M360.20532319391634,351.7816223067174 L363.29907319391634,350.9282213772708 L366.39282319391634,350.07482044782427 L369.48657319391634,349.22141951837773 L372.58032319391634,348.36801858893114 L375.67407319391634,347.5146176594846 L378.76782319391634,346.66121673003806 L381.86157319391634,345.80781580059147 L384.95532319391634,344.95441487114493 L388.04907319391634,344.1010139416984 L391.14282319391634,343.2476130122518 L394.23657319391634,342.39421208280527 L397.33032319391634,341.54081115335873 L400.42407319391634,340.68741022391214 L403.51782319391634,339.8340092944656 L406.61157319391634,338.980608365019 L409.70532319391634,338.1272074355725' ||
                group.getAttribute('d') == 'M360.20532319391634,351.7816223067174 L363.61157319391634,350.9282213772708 L367.01782319391634,350.07482044782427 L370.42407319391634,349.22141951837773 L373.83032319391634,348.36801858893114 L377.23657319391634,347.5146176594846 L380.64282319391634,346.66121673003806 L384.04907319391634,345.80781580059147 L387.45532319391634,344.95441487114493 L390.86157319391634,344.1010139416984 L394.26782319391634,343.2476130122518 L397.67407319391634,342.39421208280527 L401.08032319391634,341.54081115335873 L404.48657319391634,340.68741022391214 L407.89282319391634,339.8340092944656 L411.29907319391634,338.980608365019 L414.70532319391634,338.1272074355725').toBe(true);
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
            expect(group.getAttribute('x')).toBe('538.5901162790698');
            expect(group.getAttribute('y') === '219.55988372093023'
                || group.getAttribute('y') === '218.30717054263565');
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
            expect(group.getAttribute('y') == '254.35996784565918' ||
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
            expect(group.getAttribute('y') === '265.433922829582' ||
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
            let group: Element = getElement('ej2container_datalabel_Series_0_text_3');
            expect(group.getAttribute('x')).toBe('545');
            expect(group.getAttribute('y') === '264.433922829582' ||
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
        };
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
            //  debugger
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
            expect(group.getAttribute('d') === 'M 83.5 27 L 88.5 22 L 93.5 27 L 88.5 32 L 83.5 27 z' ||
                group.getAttribute('d') === 'M 93.5 27 L 98.5 22 L 103.5 27 L 98.5 32 L 93.5 27 z' ||
                group.getAttribute('d') === 'M 103.5 22 L 98.5 32 L 93.5 22 L 103.5 22 z').toBe(true);
                done();
        };
        chart.series[0].explodeOffset = null;
        chart.series[0].legendShape = 'Diamond';
        chart.refresh();
    });

    it('Checking custom legend position', (done: Function) => {
        chart.loaded = () => {            //debugger

            let group: Element = getElement('ej2container_chart_legend_element');
            expect(group.getAttribute('x') == '484' || group.getAttribute('x') == '490').toBe(true);
            expect(group.getAttribute('y') == '133.5' || group.getAttribute('y') == '136').toBe(true);
            expect(group.getAttribute('width') == '106' || group.getAttribute('width') == '100').toBe(true);
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
    it('Checking overlapped labels are placed at outside left position for position as inside',(done:Function) =>{
        loaded = (args: Object): void => {
            let group: Element = getElement('ej2container_datalabel_Series_0_text_6');
            expect(group.getAttribute('x') === '47.20472756410254'|| group.getAttribute('x') === '488.79527243589746').toBe(true);
            expect(group.getAttribute('y') === '202.79615384615386' ||
                group.getAttribute('y') === '180.75128205128203' || group.getAttribute('y') === '180.51666666666668').toBe(true);
            done();
        };
        chart.series[0].dataSource = dataPoints;
        chart.series[0].groupTo = 'null';
        chart.series[0].width = '50%';
        chart.series[0].height = '50%';
        chart.series[0].neckWidth = '15%';
        chart.series[0].neckHeight = '18%';
        chart.loaded = loaded;
        chart.refresh();
    });
    it('Checking data label with Legend position',(done:Function) =>{
        loaded = (args: Object): void => {
            let group: Element = getElement('ej2container_datalabel_Series_0_text_11');
            expect(group.getAttribute('x') === '118.5' || group.getAttribute('x') === '559.0679086538461').toBe(true);
            expect(group.getAttribute('y') === '115.57051282051282' ||
                group.getAttribute('y') === '84.35897435897436').toBe(true);
            done();
        };
        chart.legendSettings.position = 'Left';
        chart.loaded = loaded;
        chart.refresh();
    });
    it('Check the default connector line at left outside', (done: Function) => {
        chart.loaded = () => {
            let group: Element = getElement('ej2container_datalabel_Series_0_connector_11');
            expect(group.getAttribute('fill')).toBe('transparent');
            expect(group.getAttribute('stroke')).toBe('#404041');
            expect(group.getAttribute('stroke-width')).toBe('1');
            expect(group.getAttribute('stroke-dasharray')).toBe('');
            done();


        };
        chart.refresh();
    });
    it('Datalabel trimmed label mouse move tooltip', () => {
        let datalabel: Element;
        datalabel = getElement('ej2container_datalabel_Series_0_text_10');
        trigger.mousemoveEvent(datalabel, 0, 0, 520, 210);
        let tooltip: Element = getElement('ej2container_EJ2_Datalabel_Tooltip');
        expect(tooltip).not.toBe(null);
        expect(tooltip.textContent).toBe('NewZealand : 4');
        removeElement('ej2container_EJ2_Datalabel_Tooltip');
    });
    it('Checking overlapped labels are placed at outside left position for position as outside ',(done:Function) =>{
        loaded = (args: Object): void => {
            let group: Element = getElement('ej2container_datalabel_Series_0_text_6');
            expect(group.getAttribute('x') === '458'|| group.getAttribute('x') === '488.79527243589746').toBe(true);
            expect(group.getAttribute('y') === '215.4' ||
                group.getAttribute('y') === '205.65615384615387' || group.getAttribute('y') === '219.47384615384613').toBe(true);
            done();
        };
        chart.series[0].dataLabel.position = 'Outside';
        chart.legendSettings.position = 'Top';
        chart.height = '450';
        chart.series[0].dataLabel.name = 'text';
        chart.title = 'Website Visitors';
        chart.loaded = loaded;
        chart.refresh();
    });
    it('Checking Funnel default explode for outside left position',(done:Function) => {
        loaded = (args: Object): void =>{
            let value: Element = getElement('ej2container_Series_0_Point_4');
            trigger.clickEvent(value);
            expect(value.getAttribute('transform') == 'translate(-25, 0)' || value.getAttribute('transform') == 'translate(25, 0)').toBe(true);
            done();  
        };
        chart.series[0].explode = true;
        chart.series[0].explodeIndex = null;
        chart.series[0].explodeOffset = '25px'
        chart.enableAnimation = false;
        chart.loaded = loaded;
        chart.refresh();
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

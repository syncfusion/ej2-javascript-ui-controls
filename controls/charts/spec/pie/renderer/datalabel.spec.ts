/**
 * AccumulationChart Datalabel Spec file
 */
import { createElement } from '@syncfusion/ej2-base';
import { EmitType } from '@syncfusion/ej2-base';
import { PieSeries } from '../../../src/accumulation-chart/renderer/pie-series';
import { AccumulationChart } from '../../../src/accumulation-chart/accumulation';
import { AccumulationLegend } from '../../../src/accumulation-chart/renderer/legend';
import { AccPoints } from '../../../src/accumulation-chart/model/acc-base';
import { isOverlap, getElement, removeElement, withInBounds, ChartLocation } from '../../../src/common/utils/helper';
import { AccumulationDataLabel } from '../../../src/accumulation-chart/renderer/dataLabel';
import { piedata, getDistance} from '../../chart/base/data.spec';
import { SliceOption, getPosition} from '../base/util.spec';
import { PyramidSeries } from '../../../src/accumulation-chart/renderer/pyramid-series';
import { MouseEvents } from '../../chart/base/events.spec';
import { IAccLoadedEventArgs } from '../../../src/accumulation-chart/model/pie-interface';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { IAccTextRenderEventArgs } from '../../../src/index';
import { profile, inMB, getMemoryProfile } from '../../common.spec';
AccumulationChart.Inject(PieSeries, AccumulationLegend, AccumulationDataLabel, PyramidSeries);


describe('Accumulation Chart Control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
describe('Data Label checking for the pie doughnut series', () => {
    let ele: HTMLElement;
    let element: HTMLElement;
    let slice: HTMLElement;
    let loaded: EmitType<IAccLoadedEventArgs>;
    let id: string = 'ej2container'; let pieGroupId: string = id + 'SeriesGroup0';
    let sliceid: string = id + '_Series_0' + '_Point_';
    let slicepath: SliceOption;
    let datalabel: Element;
    let legendId: string = id + '_chart_legend_text_';
    let y: number;
    let labelId: string = id + '_datalabel_Series_0_text_';
    let shapeId: string = id + '_datalabel_Series_0_shape_';
    let connectorId: string = id + '_datalabel_Series_0_connector_';
    let i: number = 0;
    let j: number = 0;
    let overlap: boolean;
    let variousPie: Object[] = [
        { y: 18, x: 1, name: 'Bald Eagle', text: 'Bald Eagle : 18', radius: '50%' }, { y: 23, x: 2, name: 'Bison', text: 'Bison : 23', radius: '60%'  },
        { y: 30, x: 3, name: 'Brown Bear', text: 'Brown Bear : 30', radius: '70%' }, { y: 44, x: 4, name: 'Elk', text: 'Elk : 44', radius: '100%' },
        { y: 52, x: 5, name: 'Pronghorn', text: 'Pronghorn : 52', radius:'80%' }, { y: 62, x: 6, name: 'Turkey', text: 'Turkey : 62', radius:'80%' },
        { y: 74, x: 7, name: 'Alligator', text: 'Alligator : 74', radius:'80%' }, { y: 85, x: 8, name: 'Prairie Dog', text: 'Prairie Dog : 85', radius:'80%' },
        { y: 96, x: 9, name: 'Mountain Lion', text: 'Mountain Lion : 96', radius:'80%' }, { y: 102, x: 10, name: 'Beaver', text: 'Beaver : 102', radius:'80%' }
    ];
    let accumulation: AccumulationChart; let points: AccPoints[];
    let trigger: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        ele = createElement('div', { id: id });
        let template: Element = createElement('div', { id: 'template', styles: 'display: none;' });
        document.body.appendChild(template);
        template.innerHTML = '<div>80</div>';
        let template1: Element = createElement('div', { id: 'template1', styles: 'display: none;' });
        document.body.appendChild(template1);
        template1.innerHTML = '<div>${point.y}</div>';
        let template2: Element = createElement('div', { id: 'template2', styles: 'display: none;' });
        document.body.appendChild(template2);
        template2.innerHTML = '<div>${point.label}</div>';
        document.body.appendChild(ele);
        accumulation = new AccumulationChart({
            title: 'Datalabel Spec',
            enableSmartLabels: false,
            series: [
                {
                    type: 'Pie',
                    dataLabel: { visible: false, name: 'text' },
                    dataSource: piedata, animation: { enable: false }, xName: 'x', yName: 'y'
                }
            ], width: '600', height: '400', legendSettings: { visible: true}
        });
        accumulation.appendTo('#' + id);
    });

    afterAll((): void => {
        accumulation.destroy();
        removeElement(id);
        removeElement('template');
        removeElement('template1');
    });
    it('Datalabel visibility false checking', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            datalabel = document.getElementById(id + '_datalabel_Series_0');
            expect(datalabel).toBe(null);
            done();
        };
        accumulation.refresh();
    });
    it('Datalabel visibility visible checking', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            datalabel = document.getElementById(id + '_datalabel_Series_0');
            expect(datalabel.childNodes.length).toBe(10);
            done();
        };
        accumulation.series[0].dataLabel.visible = true;
        accumulation.refresh();
    });
    it('Datalabel common options', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            datalabel = getElement(labelId + 1);
            expect(datalabel.getAttribute('fill')).toBe('#ffffff');
            expect(datalabel.getAttribute('font-size')).toBe('18px');
            expect(datalabel.getAttribute('font-family')).toBe('courier');
            expect(datalabel.getAttribute('font-style')).toBe('italic');
            expect(datalabel.getAttribute('font-weight')).toBe('bold');
            datalabel = getElement(shapeId + 1);
            expect(datalabel.getAttribute('fill')).toBe('blue');
            expect(datalabel.getAttribute('stroke')).toBe('red');
            expect(datalabel.getAttribute('stroke-width')).toBe('2');
            expect(datalabel.getAttribute('rx')).toBe('5');
            expect(datalabel.getAttribute('ry')).toBe('5');
            done();
        };
        accumulation.series[0].dataLabel = {
            border: { color: 'red', width: 2}, fill: 'blue', rx: 5, ry : 5,
            font : {
                color: '#ffffff',
                size: '18px',
                fontFamily: 'courier',
                fontStyle: 'italic',
                fontWeight: 'bold'
            }
        };
        accumulation.refresh();
    });
    it('Datalabel Inside checking', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            points = accumulation.visibleSeries[0].points;
            expect(withInBounds(
                points[3].labelRegion.x, points[3].labelRegion.y, accumulation.visibleSeries[0].accumulationBound,
                points[3].labelRegion.width, points[3].labelRegion.height)).toBe(true);
            done();
        };
        accumulation.series[0].dataLabel.position = 'Inside';
        accumulation.refresh();
    });
    it('Datalabel Outside checking', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            datalabel = document.getElementById(connectorId + 0);
            expect(datalabel).not.toBe(null);
            done();
        };
        accumulation.series[0].dataLabel.position = 'Outside';
        accumulation.refresh();
    });
    it('Datalabel Outside connector line length', () => {
        let path: string[] = document.getElementById(connectorId + 3).getAttribute('d').split(' ');
        let start: ChartLocation = new ChartLocation(+path[1], +path[2]);
        let end: ChartLocation = new ChartLocation(+path[7], +path[8]);
        expect(getDistance(start, end)).toBeGreaterThan(10);
    });
    it('Datalabel Outside connector dasharray', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            datalabel = document.getElementById(connectorId + 0);
            expect(datalabel.getAttribute('stroke-dasharray') === '5,3').toBe(true);
            done();
        };
        accumulation.series[0].dataLabel.connectorStyle.dashArray = '5,3';
        accumulation.refresh();
    });
    it('Datalabel angle checking', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            datalabel = document.getElementById(labelId + 0);
            expect(datalabel.getAttribute('labelRotation') === '45').toBe(true);
            done();
        };
        accumulation.series[0].dataLabel.angle = 45;
        accumulation.series[0].dataLabel.enableRotation = true;
        accumulation.refresh();
    });
    it('Datalabel angle checking with enable rotation', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            datalabel = document.getElementById(labelId + 0);
            expect(datalabel.getAttribute('labelRotation') !== null).toBe(true);
            done();
        };
        accumulation.series[0].dataLabel.angle = 0;
        accumulation.series[0].dataLabel.enableRotation = true;
        accumulation.refresh();
    });
    it('Datalabel checking for click on a legend point', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
          points = accumulation.visibleSeries[0].points;
          accumulation.loaded = null;
          trigger.clickEvent(getElement(legendId + 2));
          expect(points[2].labelRegion).toBe(null);
          done();
        };
        accumulation.series[0].dataLabel.connectorStyle.dashArray = '';
        accumulation.refresh();
    });
    it('Datalabel Inside Smart Labels checking with title bound', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            points = args.accumulation.visibleSeries[0].points;
            expect(isOverlap(points[0].labelRegion, points[5].labelRegion)).toBe(false);
            expect(isOverlap(points[0].labelRegion, accumulation.accumulationDataLabelModule.titleRect)).toBe(false);
            done();
        };
        accumulation.enableSmartLabels = true;
        accumulation.series[0].dataLabel.position = 'Inside';
        accumulation.refresh();
    });
    it('Datalabel Outside Smart Labels checking with title bound', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            points = args.accumulation.visibleSeries[0].points;
            expect(isOverlap(points[2].labelRegion, points[5].labelRegion)).toBe(false);
            expect(isOverlap(points[2].labelRegion, accumulation.accumulationDataLabelModule.titleRect)).toBe(false);
            done();
        };
        accumulation.series[0].dataLabel.position = 'Outside';
        accumulation.refresh();
    });
    it('Datalabel trimmed label mouse move tooltip', () => {
        datalabel = getElement(labelId + 4);
        trigger.mousemoveEvent(datalabel, 0, 0, 530, 210);
        let tooltip: Element = getElement('ej2container_EJ2_Datalabel_Tooltip');
        expect(tooltip).not.toBe(null);
        expect(tooltip.textContent).toBe('Pronghorn : 52');
        datalabel = getElement(labelId + 0);
        trigger.mousemoveEvent(datalabel, 0, 0, 400, 70);
        expect(getElement('ej2container_EJ2_Datalabel_Tooltip')).toBe(null);
        datalabel = getElement(labelId + 4);
        accumulation.accumulationMouseEnd(trigger.onTouchEnd(datalabel, 0, 0, 210, 480, 210, 480) as PointerEvent);
        tooltip = getElement('ej2container_EJ2_Datalabel_Tooltip');
        expect(tooltip).not.toBe(null);
        expect(tooltip.textContent).toBe('Pronghorn : 52');
        removeElement('ej2container_EJ2_Datalabel_Tooltip');
    });
    it('Datalabel connector length and smart label visible', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            datalabel = document.getElementById(connectorId + 2);
            expect(datalabel).not.toBe(null);
            datalabel = document.getElementById(connectorId + 0);
            expect(datalabel).toBe(null);
            done();
        };
        accumulation.series[0].dataLabel.position = 'Outside';
        accumulation.series[0].dataLabel.connectorStyle = { length: '40px'};
        accumulation.refresh();
    });
    it('Datalabel animation', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            datalabel = document.getElementById(connectorId + 2);
            expect(datalabel).not.toBe(null);
            datalabel = document.getElementById(connectorId + 0);
            expect(datalabel).toBe(null);
            done();
        };
        accumulation.series[0].dataLabel.connectorStyle = { length: '10px'};
        accumulation.series[0].animation.enable = true;
        accumulation.series[0].radius = '100%';
        accumulation.refresh();
    });
    it('Datalabel color saturation checking', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            datalabel = getElement(labelId + 2);
            expect(datalabel.getAttribute('fill')).toBe('white');
            datalabel = getElement(labelId + 0);
            expect(datalabel.getAttribute('fill')).toBe('black');
            done();
        };
        accumulation.series[0].dataLabel = {
            position: 'Inside',
            visible: true,
            fill: 'transparent',
            border: {
                width: null,
                color: null
            },
            font: {
                color: null,
                size: '12px'
            }
        };
        accumulation.background = 'black';
        accumulation.series[0].animation.enable = false;
        accumulation.series[0].radius = '60%';
        accumulation.refresh();
    });
    it('checking text render event', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs): void => {
            let element: HTMLElement = document.getElementById('ej2container_datalabel_Series_0_shape_1');
            expect(+element.getAttribute('stroke-width')).toEqual(2);
            element =  document.getElementById('ej2container_datalabel_Series_0_shape_2');
            expect(element.getAttribute('stroke-width')).toEqual('null');
            done();
        };
        accumulation.pointRender = null;
        accumulation.textRender = (args: IAccTextRenderEventArgs): void => {
            if (args.point.index === 1) {
            args.border.color = 'red'; args.border.width = 2;
            }
        };
        accumulation.refresh();
    });
    it('Checking font color change using text render event', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs): void => {
            let textElement: HTMLElement = document.getElementById('ej2container_datalabel_Series_0_text_1');
            expect(textElement.getAttribute('fill')).toEqual('green');
            expect(textElement.getAttribute('font-size')).toEqual('15px');
            expect(textElement.getAttribute('font-style')).toEqual('bold');
            expect(textElement.getAttribute('font-family')).toEqual('Segoe UI');
            expect(textElement.getAttribute('font-weight')).toEqual('400');
            textElement = document.getElementById('ej2container_datalabel_Series_0_text_2');
            expect(textElement.getAttribute('fill')).toEqual('red');
            done();
        };
        accumulation.pointRender = null;
        accumulation.series[0].dataLabel = {
            position: 'Inside',
            visible: true,
            name: 'text',
            font: {
                color: 'red',
                size: '12px',
            }
        };
        accumulation.textRender = (args: IAccTextRenderEventArgs): void => {
            if (args.text.indexOf('Bison : 23') > -1) {
                args.font.color = 'green';
                args.font.size = '15px';
                args.font.fontStyle = 'bold';
                args.font.fontWeight = '400';
                args.font.fontFamily = 'Segoe UI',
                args.color = 'yellow';
                args.border.width = 1;
                args.border.color = 'blue';
            }
        };
        accumulation.refresh();
    });
    it('checking elements counts without using template', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs): void => {
            let element: HTMLElement = document.getElementById('ej2container_datalabel_Series_0_text_0');
            expect(element != null).toBe(true);
            element = document.getElementById('ej2container_Secondary_Element');
            expect(element.childElementCount).toBe(0);
            done();
        };
        accumulation.textRender = null;
        accumulation.background = 'transparent';
        accumulation.series[0].dataLabel.font.color = 'black';
        accumulation.series[0].animation.enable = false;
        accumulation.series[0].dataLabel.visible = true;
        accumulation.refresh();
    });
    it('checking elements counts with using template without element', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs): void => {
            let element: HTMLElement = document.getElementById('ej2container_datalabel_Series_0_text_4');
            expect(element).toBe(null);
            element = document.getElementById('ej2container_Secondary_Element');
            expect(element.childElementCount).toBe(0);
            element = document.getElementById('ej2container_Series_0_DataLabelCollections');
            expect(element).toBe(null);
            done();
        };
        accumulation.series[0].dataLabel.template = 'label';
        accumulation.refresh();
    });
    it('checking elements counts and datalabel with using template as html string', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs): void => {
            let element: HTMLElement = document.getElementById('ej2container_datalabel_Series_0_text_4');
            expect(element).toBe(null);
            element = document.getElementById('ej2container_Secondary_Element');
            expect(element.childElementCount).toBe(1);
            expect(element.children[0].id).toBe('ej2container_Series_0_DataLabelCollections');
            element = document.getElementById('ej2container_Series_0_DataLabelCollections');
            expect(element.childElementCount).toBe(10);
            element = document.getElementById('ej2container_Series_0_DataLabel_5');
            expect(element.children[0].innerHTML).toBe('62');
            done();
        };
        accumulation.series[0].dataLabel.template = '<div>${point.y}</div>';
        accumulation.refresh();
    });
    it('checking template as point x value and cheecking style', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs): void => {
            let element: HTMLElement = document.getElementById('ej2container_Series_0_DataLabel_1');
            expect(element.children[0].innerHTML).toBe('2 : 23');
            expect(element.style.backgroundColor).toBe('red');
            expect(element.style.color).toBe('white');
            done();
        };
        accumulation.series[0].dataLabel.fill = 'red';
        accumulation.series[0].dataLabel.font.color = null;
        accumulation.series[0].dataLabel.template = '<div>${point.x} : ${point.y}</div>';
        accumulation.refresh();
    });
    it('checking template using script element', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs): void => {
            let element: HTMLElement = document.getElementById('ej2container_Series_0_DataLabel_1');
            expect(element.children[0].innerHTML).toBe('80');
            expect(element.style.backgroundColor).toBe('red');
            expect(element.style.color).toBe('white');
            done();
        };
        accumulation.series[0].dataLabel.template = '#template';
        accumulation.refresh();
    });
    it('checking template using script element as format', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs): void => {
            let element: HTMLElement = document.getElementById('ej2container_datalabel_Series_0_text_4');
            expect(element).toBe(null);
            element = document.getElementById('ej2container_Secondary_Element');
            expect(element.childElementCount).toBe(1);
            expect(element.children[0].id).toBe('ej2container_Series_0_DataLabelCollections');
            element = document.getElementById('ej2container_Series_0_DataLabelCollections');
            expect(element.childElementCount).toBe(10);
            element = document.getElementById('ej2container_Series_0_DataLabel_5');
            expect(element.children[0].innerHTML).toBe('62');
            done();
        };
        accumulation.series[0].dataLabel.template = '#template1';
        accumulation.series[0].animation.enable = true;
        accumulation.refresh();
    });
    it('Pie series Datalabel count with radius mapping(Datalabel inside)', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs): void => {
            let element: HTMLElement = document.getElementById('ej2container_datalabel_Series_0');
            expect(element.childElementCount == 10).toBe(true);
            done();
        };
        accumulation.series[0].dataLabel = {
            visible : true, position : 'Inside'
        };
        accumulation.series[0].dataSource = variousPie;
        accumulation.series[0].radius = 'radius';
        accumulation.enableSmartLabels = false;
        accumulation.refresh();
    });
    it('Donut series Datalabel count with radius mapping(Datalabel inside)', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs): void => {
            let element: HTMLElement = document.getElementById('ej2container_datalabel_Series_0');
            expect(element.childElementCount == 10).toBe(true);
            done();
        };
        accumulation.series[0].dataLabel = {
            visible : true, position : 'Inside'
        };
        accumulation.series[0].dataSource = piedata;
        accumulation.series[0].radius = 'radius';
        accumulation.series[0].innerRadius = '30%';
        accumulation.enableSmartLabels = false;
        accumulation.refresh();
    });
    it('Pie series Datalabel count with radius mapping(Datalabel outside)', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs): void => {
            let element: HTMLElement = document.getElementById('ej2container_datalabel_Series_0');
            expect(element.childElementCount == 10).toBe(true);
            done();
        };
        accumulation.series[0].dataLabel = {
            visible : true, position : 'Outside'
        };
        accumulation.series[0].dataSource = piedata;
        accumulation.series[0].radius = 'radius';
        accumulation.enableSmartLabels = false;
        accumulation.refresh();
    });
    it('Donut series Datalabel count with radius mapping(Datalabel outside)', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs): void => {
            let element: HTMLElement = document.getElementById('ej2container_datalabel_Series_0');
            expect(element.childElementCount == 10).toBe(true);
            done();
        };
        accumulation.series[0].dataLabel = {
            visible : true, position : 'Outside'
        };
        accumulation.series[0].dataSource = variousPie;
        accumulation.series[0].radius = 'radius';
        accumulation.series[0].innerRadius = '30%';
        accumulation.enableSmartLabels = false;
        accumulation.refresh();
    });
    it('Pie series smart label with radius mapping(Datalabel outside)', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs): void => {
            let element: HTMLElement = document.getElementById('ej2container_datalabel_Series_0');
            expect(element.childElementCount == 10).toBe(true);
            done();
        };
        accumulation.series[0].dataLabel = {
            visible : true, position : 'Outside'
        };
        accumulation.series[0].dataSource = variousPie;
        accumulation.series[0].radius = 'radius';
        accumulation.enableSmartLabels = true;
        accumulation.refresh();
    });
    it('Donut series smart label with radius mapping(Datalabel outside)', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs): void => {
            let element: HTMLElement = document.getElementById('ej2container_datalabel_Series_0');
            expect(element.childElementCount == 10).toBe(true);
            done();
        };
        accumulation.series[0].dataLabel = {
            visible : true, position : 'Outside'
        };
        accumulation.series[0].dataSource = variousPie;
        accumulation.series[0].radius = 'radius';
        accumulation.series[0].innerRadius = '30%';
        accumulation.enableSmartLabels = true;
        accumulation.refresh();
    });
    it('Datalabel bounds check with radius mapping', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            points = accumulation.visibleSeries[0].points;
            expect(withInBounds(
                points[0].labelRegion.x, points[0].labelRegion.y, accumulation.visibleSeries[0].accumulationBound,
                points[0].labelRegion.width, points[0].labelRegion.height)).toBe(true);
            done();
        };
        accumulation.series[0].dataSource = variousPie;
        accumulation.series[0].dataLabel.position = 'Inside';
        accumulation.series[0].radius = 'radius';
        accumulation.series[0].innerRadius = '30%';
        accumulation.refresh();
    });
    it('Checking datalabel text after enable group separator', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            let element: HTMLElement = document.getElementById('ej2container_datalabel_Series_0_text_0');
            expect(element.textContent).toEqual('18,000');
            let element1: HTMLElement = document.getElementById('ej2container_datalabel_Series_0_text_1');
            expect(element1.textContent).toEqual('feb: 10000');
            let element2: HTMLElement = document.getElementById('ej2container_datalabel_Series_0_text_3');
            expect(element2.textContent).toEqual('70,000');
            done();
        };
        accumulation.series = [
            {
                dataSource: [{ x: 'Labour', y: 18000 }, { x: 'Legal', y: 8000, text: 'feb: 10000' },
                { x: 'Production', y: 15000 }, { x: 'License', y: 11000, text: '70000' },
                { x: 'Facilities', y: 18000 }, { x: 'Taxes', y: 14000 },
                { x: 'Insurance', y: 16000 }],
                dataLabel: {
                    visible: true,
                    name: 'text',
                    position: 'Inside',
                    font: {
                        fontWeight: '600',
                        color: '#ffffff'
                    },
                },
                radius: '70%', xName: 'x',
                yName: 'y', startAngle: 0,
                endAngle: 360, innerRadius: '40%', name: 'Project',
                explode: true, explodeOffset: '10%', explodeIndex: 3,
            }
        ];
        accumulation.useGroupingSeparator = true;
        accumulation.refresh();
    });
    it('Checking datalabel text after enable group separator with template', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            let element: HTMLElement = document.getElementById('ej2container_Series_0_DataLabel_0');
            expect(element.children[0].innerHTML).toBe('18,000');
            done();
        };
        accumulation.series[0].dataSource = [{ x: 'Labour', y: 18000 }, { x: 'Legal', y: 8000, text: 'feb: 10000' },
        { x: 'Production', y: 15000 }, { x: 'License', y: 11000, text: '70000' },
        { x: 'Facilities', y: 18000 }, { x: 'Taxes', y: 14000 },
        { x: 'Insurance', y: 16000 }];
        accumulation.useGroupingSeparator = true;
        accumulation.series[0].dataLabel.template = '#template2';
        accumulation.refresh();
    });
    it('Checking datalabel text after enable Label Format n1 ', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            element = document.getElementById('ej2container_datalabel_Series_0_text_0');
            expect(element.textContent).toEqual('18.0');
            element = document.getElementById('ej2container_datalabel_Series_0_text_1');
            expect(element.textContent).toEqual('80.0');
            element = document.getElementById('ej2container_datalabel_Series_0_text_3');
            expect(element.textContent).toEqual('11.0');
            done();
        };
        accumulation.series = [
            {
                dataSource: [{ x: 'Labour', y: 18 }, { x: 'Legal', y: 80, text: 'feb: 10000' },
                { x: 'Production', y: 15 }, { x: 'License', y: 11, text: '70000' },
                { x: 'Facilities', y: 18 }, { x: 'Taxes', y: 14 },
                { x: 'Insurance', y: 16 }],
                dataLabel: {
                    visible: true, format: 'n1',
                    position: 'Inside',
                    font: {
                        fontWeight: '600',
                        color: '#ffffff'
                    },
                },
                xName: 'x',
                yName: 'y', startAngle: 0,
            }
        ];
        accumulation.useGroupingSeparator = true;
        accumulation.refresh();
    });
    it('Checking datalabel text after enable Label Format c1 ', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            element = document.getElementById('ej2container_datalabel_Series_0_text_0');
            expect(element.textContent).toEqual('$18.0');
            element = document.getElementById('ej2container_datalabel_Series_0_text_1');
            expect(element.textContent).toEqual('$80.0');
            element = document.getElementById('ej2container_datalabel_Series_0_text_3');
            expect(element.textContent).toEqual('$11.0');
            done();
        };
        accumulation.series = [
            {
                dataSource: [{ x: 'Labour', y: 18 }, { x: 'Legal', y: 80, text: 'feb: 10000' },
                { x: 'Production', y: 15 }, { x: 'License', y: 11, text: '70000' },
                { x: 'Facilities', y: 18 }, { x: 'Taxes', y: 14 },
                { x: 'Insurance', y: 16 }],
                dataLabel: {
                    visible: true, format: 'c1',
                    position: 'Inside',
                    font: {
                        fontWeight: '600',
                        color: '#ffffff'
                    },
                },
                xName: 'x',
                yName: 'y', startAngle: 0,
            }
        ];
        accumulation.useGroupingSeparator = true;
        accumulation.refresh();
    });
    it('Checking datalabel text after enable Label Format p1 ', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            let element: HTMLElement = document.getElementById('ej2container_datalabel_Series_0_text_0');
            expect(element.textContent).toEqual('1,800.0%');
            element = document.getElementById('ej2container_datalabel_Series_0_text_1');
            expect(element.textContent).toEqual('8,000.0%');
            element = document.getElementById('ej2container_datalabel_Series_0_text_3');
            expect(element.textContent).toEqual('1,100.0%');
            done();
        };
        accumulation.series = [
            {
                dataSource: [{ x: 'Labour', y: 18 }, { x: 'Legal', y: 80, text: 'feb: 10000' },
                { x: 'Production', y: 15 }, { x: 'License', y: 11, text: '70000' },
                { x: 'Facilities', y: 18 }, { x: 'Taxes', y: 14 },
                { x: 'Insurance', y: 16 }],
                dataLabel: {
                    visible: true, format: 'p1',
                    position: 'Inside',
                    font: {
                        fontWeight: '600',
                        color: '#ffffff'
                    },
                },
                xName: 'x',
                yName: 'y', startAngle: 0,
            }
        ];
        accumulation.useGroupingSeparator = true;
        accumulation.refresh();
    });
    it('Checking datalabel text after enable custom Label Format like ${value} ', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => { 
            element = document.getElementById('ej2container_datalabel_Series_0_text_0');
            expect(element.textContent).toEqual('$18');
            element = document.getElementById('ej2container_datalabel_Series_0_text_1');
            expect(element.textContent).toEqual('$80');
            element = document.getElementById('ej2container_datalabel_Series_0_text_3');
            expect(element.textContent).toEqual('$11');
            done();
        };
        accumulation.series = [
            {
                dataSource: [{ x: 'Labour', y: 18 }, { x: 'Legal', y: 80, text: 'feb: 10000' },
                { x: 'Production', y: 15 }, { x: 'License', y: 11, text: '70000' },
                { x: 'Facilities', y: 18 }, { x: 'Taxes', y: 14 },
                { x: 'Insurance', y: 16 }],
                dataLabel: {
                    visible: true, format: '${value}',
                    position: 'Inside',
                    font: {
                        fontWeight: '600',
                        color: '#ffffff'
                    },
                },
                xName: 'x',
                yName: 'y', startAngle: 0,
            }
        ];
        accumulation.useGroupingSeparator = true;
        accumulation.refresh();
    });
});

describe('Data label with dynamic changing legend', () =>{
    let ele: HTMLElement;
    let id: string = 'ej2-container';
    let accumulation: AccumulationChart;
    beforeAll((): void => {
        ele = createElement('div', { id: id });
        document.body.appendChild(ele);
        accumulation = new AccumulationChart({
            series: [
                {
                    type: 'Pie',
                    dataLabel: {
                        visible: true,
                        font: { color: '#636363', size: '12px' },
                        name: "text",
                        position: "Outside"
                    },
                    dataSource: [
                        {x: "Industrial", y: 554.1, text: "554  defect(s)"},
                        {x: "Engineering & Non-Residential", y: 539.1, text: "539  defect(s)"},
                        {x: "Commercial", y: 465.9, text: "466  defect(s)"},
                        {x: "Residential (New & Renovations)", y: 348.3, text: "348  defect(s)"},
                        {x: "Institutional", y: 241.2, text: "241  defect(s)"},
                        {x: "Highway", y: 207, text: "207  defect(s)"},
                        {x: "Industrial", y: 554.1, text: "554  defect(s)"},
                        {x: "Engineering & Non-Residential", y: 539.1, text: "539  defect(s)"},
                        {x: "Commercial", y: 465.9, text: "466  defect(s)"},
                        {x: "Residential (New & Renovations)", y: 348.3, text: "348  defect(s)"},
                        {x: "Institutional", y: 241.2, text: "241  defect(s)"},
                        {x: "Highway", y: 207, text: "207  defect(s)"},
                        {x: "Industrial", y: 554.1, text: "554  defect(s)"},
                        {x: "Engineering & Non-Residential", y: 539.1, text: "539  defect(s)"},
                        {x: "Commercial", y: 465.9, text: "466  defect(s)"},
                        {x: "Residential (New & Renovations)", y: 348.3, text: "348  defect(s)"},
                        {x: "Institutional", y: 241.2, text: "241  defect(s)"},
                        {x: "Highway", y: 207, text: "207  defect(s)"}], 
                        animation: { enable: false }, 
                        xName: 'x', yName: 'y',
                        
                }
            ],
            center: { x: '50%', y: '50%' }, 
            width: '400', height: '400', legendSettings: {
                title: 'Conditional Range Mode',
                visible: false,
                toggleVisibility: true,
                position: 'Left',
                enablePages: false,
                alignment: 'Center',
                mode: 'Series', padding: 10, shapePadding: 8, shapeHeight: 12, shapeWidth: 12
            }
        });
        accumulation.appendTo('#' + id);
    });

    afterAll((): void => {
        accumulation.accumulationLegendModule.destroy();
        accumulation.destroy();
        accumulation.loaded = null;
        removeElement(id);
    });
    it('Checking datalabel text without legend', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            let element: HTMLElement = document.getElementById('ej2-container_datalabel_Series_0_text_11');
            expect(element != null).toBe(true);
            done();
        };
        accumulation.refresh();
    });
    it('Checking datalabel text after enable legend', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            let element: HTMLElement = document.getElementById('ej2-container_datalabel_Series_0_text_13');
            expect(element == null).toBe(true);
            done();
        };
        accumulation.legendSettings.visible = true;
        accumulation.refresh();
    });
    it('Checking datalabel text after disble legend', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            let element: HTMLElement = document.getElementById('ej2-container_datalabel_Series_0_text_11');
            expect(element != null).toBe(true);
            done();
        };
        accumulation.legendSettings.visible = false;
        accumulation.refresh();
    });
    // it('Checking datalabel text and legend position left and pyrmaid series', (done: Function) => {
    //     accumulation.loaded = (args: IAccLoadedEventArgs) => {
    //         let element: HTMLElement = document.getElementById('ej2-container_datalabel_Series_0_text_0');
    //         console.log(element.textContent);
    //         expect(element.textContent == "5...").toBe(true);
    //         done();
    //     };
    //     accumulation.legendSettings.visible = true;
    //     accumulation.legendSettings.position = 'Left';
    //     accumulation.series[0].type = 'Pyramid';
    //     accumulation.refresh();
    // });
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
describe('Checking RTL Behaviour for datalabel', () => {
    let ele: HTMLElement;
    let id: string = 'ej2-container';
    let textEle: Element;
    let dataLableId: string = id + '_datalabel_Series_0_text_0';
    let accumulation: AccumulationChart;
    let anchor: string;
    let loaded: EmitType<IAccLoadedEventArgs>;
    beforeAll((): void => {
        ele = createElement('div', { id: id });
        document.body.appendChild(ele);
        accumulation = new AccumulationChart({
            border: { width: 1, color: 'blue' },
            series: [
                {
                    type: 'Pie',
                    dataSource: piedata, animation: { enable: false }, xName: 'x', yName: 'y',
                    dataLabel: { visible: true, position:'Outside' }
                }
            ], 
            width: '600', 
            height: '400', 
            legendSettings: { visible: false },
        });
        accumulation.appendTo('#' + id);
    });

    afterAll((): void => {
        accumulation.loaded = null;
        accumulation.destroy();
        removeElement(id);
    });
    it('Default dataLabel anchor', (done: Function) => {
        loaded = (args: IAccLoadedEventArgs) => {
            textEle = getElement(dataLableId);
            anchor = textEle.getAttribute('text-anchor');
            expect(anchor === 'start').toBe(true);
            done();
        };
        accumulation.loaded = loaded;
        accumulation.refresh();
    });
    it('DataLabel anchor With RTL', (done: Function) => {
        loaded = (args: IAccLoadedEventArgs) => {
            textEle = getElement(dataLableId);
            anchor = textEle.getAttribute('text-anchor');
            expect(anchor === 'end').toBe(true);
            done();
        };
        accumulation.loaded = loaded;
        accumulation.enableRtl = true;
        accumulation.refresh();
    });
  });
  describe('Checking Text wrap support for datalabel', () => {
    let ele: HTMLElement;
    let id: string = 'ej2-container';
    let textEle: Element;
    let accumulation: AccumulationChart;
    beforeAll((): void => {
        ele = createElement('div', { id: id });
        document.body.appendChild(ele);
        accumulation = new AccumulationChart({
            border: { width: 1, color: 'blue' },
            series: [
                {
                    type: 'Pie',
                    dataSource:  [
                    { 'x': 'China', y: 26, text: 'China: 26' },
                    {'x': 'USA', y: 46, text: 'United States of America (USA): 46' },
                    { 'x': 'Russia', y: 19, text: 'Russia: 19' },
                    { 'x': 'Germany', y: 17, text: 'Germany: 17' },
                    { 'x': 'Japan', y: 12, text: 'Japan: 12' },
                    { 'x': 'France', y: 10, text: 'France: 10' },
                    { 'x': 'South Korea', y: 9, text: 'South Korea: 9' },
                    { 'x': 'Great Britain', y: 27, text: 'Great Britain: 27' },
                    { 'x': 'Italy', y: 8, text: 'Italy: 8' },
                    { 'x': 'Australia', y: 8, text: 'Australia: 8' },
                   ], animation: { enable: false }, xName: 'x', yName: 'y',
                    dataLabel: { visible: true, position:'Outside', name: 'text' }
                }
            ], 
            width: '600', 
            height: '400', 
            legendSettings: { visible: false },
        });
        accumulation.appendTo('#' + id);
    });

    afterAll((): void => {
        accumulation.destroy();
        removeElement(id);
    });
    it('DataLabel Wrap with MaxWidth value(Datalabel outside)', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            textEle = document.getElementById('ej2-container_datalabel_Series_0_text_1');
            expect(textEle.childNodes.length == 5).toBe(true); 
            textEle = document.getElementById('ej2-container_datalabel_Series_0_text_3');
            expect(textEle.childNodes.length == 2).toBe(true);              
            done();
        };
        accumulation.series[0].dataLabel.textWrap = 'Wrap';
        accumulation.series[0].dataLabel.maxWidth = 50;
        accumulation.refresh();
    });
    it('DataLabel Wrap without MaxWidth value(Datalabel outside)', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            textEle = document.getElementById('ej2-container_datalabel_Series_0_text_1');
            expect(textEle.childNodes.length > 1).toBe(true);
            textEle = document.getElementById('ej2-container_datalabel_Series_0_text_6');
            expect(textEle.childNodes.length > 1).toBe(true);              
            done();
        };
        accumulation.series[0].dataLabel.maxWidth = 0;
        accumulation.width = '500';
        accumulation.refresh();
    });
    it('DataLabel Wrap without MaxWidth value and legend enabled(Datalabel outside)', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            textEle = document.getElementById('ej2-container_datalabel_Series_0_text_1');
            expect(textEle.childNodes.length > 1).toBe(true);
            textEle = document.getElementById('ej2-container_datalabel_Series_0_text_6');
            expect(textEle.childNodes.length > 1).toBe(true);              
            done();
        };
        accumulation.legendSettings.visible = true;
        accumulation.legendSettings.position = 'Right';
        accumulation.width = '600';
        accumulation.refresh();
    });
    it('DataLabel Wrap with MaxWidth value and legend enabled(Datalabel outside)', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            textEle = document.getElementById('ej2-container_datalabel_Series_0_text_1');
            expect(textEle.childNodes.length > 1).toBe(true); 
            textEle = document.getElementById('ej2-container_datalabel_Series_0_text_3');
            expect(textEle.childNodes.length > 1).toBe(true);              
            done();
        };
        accumulation.series[0].dataLabel.maxWidth = 50;
        accumulation.refresh();
    });
    it('DataLabel Wrap with MaxWidth(Datalabel Inside)', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            textEle = document.getElementById('ej2-container_datalabel_Series_0_text_1');
            expect(textEle.childNodes.length > 1).toBe(true); 
            textEle = document.getElementById('ej2-container_datalabel_Series_0_text_3');
            expect(textEle.childNodes.length > 1).toBe(true);              
            done();
        };
        accumulation.legendSettings.visible = false;
        accumulation.series[0].dataLabel.enableRotation = true;
        accumulation.series[0].dataLabel.position = "Inside";
        accumulation.refresh();
    });
    it('DataLabel Wrap without MaxWidth(Datalabel inside)', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            textEle = document.getElementById('ej2-container_datalabel_Series_0_text_1');
            expect(textEle.childNodes.length > 1).toBe(true);      
            done();
        };
        accumulation.series[0].dataLabel.maxWidth = 0;
        accumulation.refresh();
    });
    it('DataLabel Wrap with anywhere (Datalabel outside)', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            textEle = document.getElementById('ej2-container_datalabel_Series_0_text_1');
            expect(textEle.childNodes.length > 1).toBe(true);              
            done();
        };
        accumulation.series[0].dataLabel.textWrap = "AnyWhere";
        accumulation.series[0].dataLabel.position = 'Outside';
        accumulation.refresh();
    });
    it('DataLabel Clip(Datalabel inside)', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            textEle = document.getElementById('ej2-container_datalabel_Series_0_text_1');
            expect(textEle.childNodes.length == 1).toBe(true); 
            textEle = document.getElementById('ej2-container_datalabel_Series_0_text_3');
            expect(textEle.childNodes.length == 1).toBe(true);              
            done();
        };
        accumulation.series[0].dataLabel.textWrap = 'Normal';
        accumulation.series[0].dataLabel.position = 'Inside';
        accumulation.series[0].dataLabel.textOverflow = 'Clip';
        accumulation.refresh();
    });
    it('DataLabel Clip with MaxWidth value and legend enabled(Datalabel outside)', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            textEle = document.getElementById('ej2-container_datalabel_Series_0_text_1');
            expect(textEle.childNodes.length == 1).toBe(true); 
            textEle = document.getElementById('ej2-container_datalabel_Series_0_text_3');
            expect(textEle.childNodes.length == 1).toBe(true);              
            done();
        };
        accumulation.series[0].dataLabel.position = "Outside";
        accumulation.legendSettings.visible = true;
        accumulation.legendSettings.position = 'Left';
        accumulation.series[0].dataLabel.maxWidth = 30;
        accumulation.refresh();
    });
    it('DataLabel Clip with MaxWidth value and legend enabled(Datalabel outside)', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            textEle = document.getElementById('ej2-container_datalabel_Series_0_text_1');
            expect(textEle.childNodes.length == 1).toBe(true); 
            textEle = document.getElementById('ej2-container_datalabel_Series_0_text_3');
            expect(textEle.childNodes.length == 1).toBe(true);              
            done();
        };
        accumulation.series[0].dataLabel.position = "Outside";
        accumulation.legendSettings.visible = true;
        accumulation.legendSettings.position = 'Right';
        accumulation.series[0].dataLabel.maxWidth = 30;
        accumulation.refresh();
    });
    it('DataLabel Clip without MaxWidth value(Datalabel outside)', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            textEle = document.getElementById('ej2-container_datalabel_Series_0_text_1');
            expect(textEle.childNodes.length == 1).toBe(true); 
            textEle = document.getElementById('ej2-container_datalabel_Series_0_text_3');
            expect(textEle.childNodes.length == 1).toBe(true);              
            done();
        };
        accumulation.series[0].dataLabel.position = "Outside";
        accumulation.series[0].dataLabel.maxWidth = 0;
        accumulation.refresh();
    });
    it('DataLabel Wrap (<br> in data Label)', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            textEle = document.getElementById('ej2-container_datalabel_Series_0_text_1');
            expect(textEle.childNodes.length == 2).toBe(true); 
            textEle = document.getElementById('ej2-container_datalabel_Series_0_text_3');
            expect(textEle.childNodes.length == 2).toBe(true);              
            done();
        };
        accumulation.series[0].dataLabel.position = "Outside";
        accumulation.series[0].dataSource =[
            { 'x': 'China', y: 26, text: 'China: <br> 26' },
            {'x': 'USA', y: 46, text: 'United States of America (USA):  <br> 46' },
            { 'x': 'Russia', y: 19, text: 'Russia:  <br> 19' },
            { 'x': 'Germany', y: 17, text: 'Germany:  <br> 17' },
            { 'x': 'Japan', y: 12, text: 'Japan:  <br> 12' },
            { 'x': 'France', y: 10, text: 'France:  <br> 10' },
            { 'x': 'South Korea', y: 9, text: 'South Korea:  <br> 9' },
            { 'x': 'Great Britain', y: 27, text: 'Great Britain:  <br> 27' },
            { 'x': 'Italy', y: 8, text: 'Italy:  <br> 8' },
            { 'x': 'Australia', y: 8, text: 'Australia:  <br> 8' },
           ];
        accumulation.refresh();
    });
  });
});
/**
 * AccumulationChart Series Spec file
 */
import { createElement } from '@syncfusion/ej2-base';
import { EmitType } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { AccumulationChart} from '../../../src/accumulation-chart/accumulation';
import { AccumulationTooltip} from '../../../src/accumulation-chart/user-interaction/tooltip';
import { AccumulationDataLabel} from '../../../src/accumulation-chart/renderer/dataLabel';
import { AccPoints, AccumulationSeries} from '../../../src/accumulation-chart/model/acc-base';
import { Rect, getElement, removeElement} from '../../../src/common/utils/helper';
import { IAccLoadedEventArgs} from '../../../src/accumulation-chart/model/pie-interface';
import { data, datetimeData1} from '../../chart/base/data.spec';
import { MouseEvents} from '../../chart/base/events.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

AccumulationChart.Inject(AccumulationTooltip, AccumulationDataLabel);
describe('accumulation and Doughnut Control Checking', () => {
    let element: Element; let loaded: EmitType<IAccLoadedEventArgs>;
    let svgObject: Element;
    let text: Element;
    let id: string = 'ej2container';
    let accumulation: AccumulationChart;
    let dataManager: DataManager = new DataManager({
        url: 'http://mvc.syncfusion.com/Services/Northwnd.svc/Tasks/'
    });
    let query: Query = new Query().take(7).where('Estimate', 'greaterThan', 1, false);
    let trigger: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        element = createElement('div', { id: id });
        document.body.appendChild(element);
        accumulation = new AccumulationChart();
    });

    afterAll((): void => {
        accumulation.destroy();
        removeElement(id);
        removeElement(id + '_0_content');
    });
    it('Checking accumulation instance creation', (done: Function) => {
        accumulation.loaded = (args: Object): void => {
            expect(accumulation != null).toBe(true);
            done();
        };
        accumulation.appendTo('#' + id);
    });
    it('empty options control class names', () => {
        element = getElement(id);
        expect(element.classList.contains('e-control')).toBe(true);
        expect(element.classList.contains('e-accumulationchart')).toBe(true);
    });
    it('empty option accumulation height and width', () => {
        svgObject = getElement(id + '_svg');
        expect(svgObject.getAttribute('height')).toBe('450');
        expect(svgObject.getAttribute('width')).not.toBe(null);
    });
    it('Checking module name', () => {
        expect(accumulation.getModuleName()).toBe('accumulationchart');
    });
    it('Checking the null width of the accumulation', (done: Function) => {
        accumulation.width = null;
        element.setAttribute('style', 'width:0px');
        accumulation.loaded = (args: Object) => {
            svgObject = getElement(id + '_svg');
            expect(svgObject.getAttribute('width')).toEqual('600');
            done();
        };
        accumulation.refresh();
    });
    it('Checking the percentage size of the accumulation width', (done: Function) => {
        accumulation.width = '50%';
        element.setAttribute('style', 'width:900px');
        accumulation.loaded = (args: Object) => {
            svgObject = getElement(id + '_svg');
            expect(svgObject.getAttribute('width')).toEqual('450');
            done();
        };
        accumulation.refresh();
    });
    it('Checking the percentage size of the accumulation height', (done: Function) => {
        accumulation.height = '50%';
        element.setAttribute('style', 'height:900px');
        accumulation.loaded = (args: Object) => {
            svgObject = getElement(id + '_svg');
            expect(svgObject.getAttribute('height')).toEqual('450');
            done();
        };
        accumulation.refresh();
    });
    it('Checking the height of the accumulation', () => {
        accumulation.height = '500';
        accumulation.loaded = null;
        accumulation.dataBind();
        svgObject = getElement(id + '_svg');
        expect(svgObject.getAttribute('height')).toEqual('500');
    });
    it('Checking both height and width of the accumulation', () => {
        accumulation.width = '500';
        accumulation.height = '300';
        accumulation.dataBind();
        svgObject = getElement(id + '_svg');
        expect(svgObject.getAttribute('width')).toEqual('500');
        expect(svgObject.getAttribute('height')).toEqual('300');
    });
    it('Checking with empty title', () => {
        text = getElement(id + '_title');
        expect(text).toBeNull();
    });

    it('Checking with empty subtitle', () => {
        text = getElement(id + '_subTitle');
        expect(text).toBeNull();
    });
    it('Checking with  title', () => {
        accumulation.title = 'Syncfusion accumulation Title';
        accumulation.dataBind();
        text = getElement(id + '_title');
        expect(text.textContent).toBe('Syncfusion accumulation Title');
        expect(text.getAttribute('y') === '25' || text.getAttribute('y') === '22.75').toEqual(true);
    });

     it('Checking with  subtitle', () => {
        accumulation.subTitle = 'accumulation SubTitle';
        accumulation.dataBind();
        text = getElement(id + '_subTitle');
        expect(text.textContent).toBe('accumulation SubTitle');
        expect(text.getAttribute('y') === '45.5' || text.getAttribute('y') === '41.75').toEqual(true);
    });

    it('Checking with title', () => {
        accumulation.titleStyle.textOverflow = 'Wrap',
        accumulation.title = 'Syncfusion accumulation TitleSyncfusionaccumulationTitleSyncfusionaccumulationTitleSyncfusionaccumulation Title';
        accumulation.dataBind();
        text = getElement(id + '_title');
        expect(text.textContent.indexOf('...') > -1).toBe(true);
    });

    it('Checking with subtitle Overflow is Wrap', () => {
        accumulation.subTitleStyle.textOverflow = 'Wrap',
        accumulation.title = 'Syncfusion accumulation Title';
        accumulation.subTitle = 'Syncfusion accumulation subTitleSyncfusionaccumulationTitleSyncfusion';
        accumulation.dataBind();
        text = getElement(id + '_subTitle');
        expect(text.childNodes.length == 2).toBe(true);
    });
    it('Checking the title font size', () => {
        accumulation.title = 'accumulation Title';
        accumulation.titleStyle.size = '24px';
        accumulation.dataBind();
        text = getElement(id + '_title');
        expect(text.getAttribute('font-size')).toEqual('24px');
    });

    it('Checking the subtitle font size', () => {
        accumulation.subTitle = 'Sub Title';
        accumulation.subTitleStyle.size = '24px';
        accumulation.dataBind();
        text = getElement(id + '_subTitle');
        expect(text.getAttribute('font-size')).toEqual('24px');
    });

    it('Checking the subtitle Alingnment is Near', () => {
        accumulation.subTitleStyle.textAlignment = 'Near';
        accumulation.dataBind();
        text = getElement(id + '_subTitle');
        expect(text.getAttribute('text-anchor')).toEqual('start');
    });

    it('Checking the subtitle Alingnment is End', () => {
        accumulation.subTitleStyle.textAlignment = 'Far';
        accumulation.dataBind();
        text = getElement(id + '_subTitle');
        expect(text.getAttribute('text-anchor')).toEqual('end');
    });

    it('Checking the subtitle Trim', () => {
        accumulation.subTitle = 'Accumulation SubTitle Trim';
        accumulation.subTitleStyle.textOverflow = 'Trim';
        accumulation.dataBind();
        text = getElement(id + '_subTitle');
        expect(text.textContent.indexOf('...') != -1).toBe(true);
    });
    it('Checking the border color', () => {
        accumulation.border.width = 2;
        accumulation.border.color = 'green';
        accumulation.dataBind();
        svgObject = getElement(id + '_border');
        expect(svgObject.getAttribute('stroke')).toBe('green');
        expect(svgObject.getAttribute('stroke-width')).toBe('2');
    });
    it('Checking the accumulation background', () => {
        accumulation.background = 'yellow';
        accumulation.dataBind();
        svgObject = getElement(id + '_border');
        expect(svgObject.getAttribute('fill')).toBe('yellow');
    });
    it('Checking the accumulation Margin with out title ', () => {
        accumulation.margin = { left: 20, right: 10, top: 20, bottom: 30};
        accumulation.title = '';
        accumulation.subTitle = '';
        accumulation.dataBind();
        let rect: Rect = accumulation.initialClipRect;
        expect(rect.width).toEqual(469);
        expect(rect.height).toEqual(250);
        expect(rect.x).toEqual(20);
        expect(rect.y).toEqual(20);
    });
    it('Checking the accumulation Margin with title', () => {
        accumulation.title = 'accumulation Title';
        accumulation.dataBind();
        let rect: Rect = accumulation.initialClipRect;
        expect(rect.width).toEqual(469);
        expect(rect.height === 218 || rect.height === 223).toEqual(true);
        expect(rect.x).toEqual(20);
        expect(rect.y === 52 || rect.y === 47).toEqual(true);
    });
    it('Checking the accumulation with Series datapoints', (done: Function) => {
        loaded = (args: IAccLoadedEventArgs) => {
          let points: AccPoints[] = (<AccumulationSeries>args.accumulation.series[0]).points;
          expect(points.length).toBe(15);
          done();
        };
        accumulation.series = [{
            dataSource: data,
            xName: 'x', yName: 'y'
        }];
        accumulation.loaded = loaded;
        accumulation.refresh();
    });
    it('Checking the accumulation with DataTime Values', (done: Function) => {
        loaded = (args: IAccLoadedEventArgs) => {
          let points: AccPoints[] = (<AccumulationSeries>args.accumulation.series[0]).points;
          expect(points.length).toBe(6);
          done();
        };
        accumulation.series = [{
            dataSource: datetimeData1,
            xName: 'x', yName: 'y',
            animation: { enable: false},
            groupTo: '1'
        }];
        accumulation.loaded = loaded;
        accumulation.refresh();
    });
    it('Mouse events checking', () => {
        element = getElement(id);
        trigger.mousedownEvent(element, 100, 50, 100, 50);
        trigger.mouseupEvent(element, 100, 50, 100, 50);
        trigger.mouseoutEvent(element);
        let tapHold: Object = <Object>document.createEvent('MouseEvent');
        tapHold['pointerType'] = 'touch';
        accumulation.accumulationRightClick(tapHold as PointerEvent);
        let menu: Event = document.createEvent('MouseEvent');
        menu.initEvent('contextmenu', true, false);
        element.dispatchEvent(menu);
        accumulation.getPersistData();
    });
    it('resize checking', () => {
        window.dispatchEvent(new Event('resize'));
        svgObject = getElement(id + '_svg');
        expect(svgObject).not.toBe(null);
        expect(svgObject.getAttribute('width')).toBe('500');
        expect(svgObject.getAttribute('height')).toBe('300');
    });
    it('club points value change check', () => {
        accumulation.series[0].groupTo = '20';
        accumulation.loaded = null;
        accumulation.refreshChart();
        let points: AccPoints[] = (<AccumulationSeries>accumulation.series[0]).points;
        expect(points.length).toBe(4);
    });
    it('theme checking', () => {
        accumulation.theme = 'Fabric';
        accumulation.dataBind();
        let points: AccPoints[] = (<AccumulationSeries>accumulation.series[0]).points;
        expect(points[1].color).toBe('#404041');
    });
    it('Checking title trim', () => {
        accumulation.title = 'candidate joined in a year syncfusion Chart Title';
        accumulation.width = '80';
        accumulation.dataBind();
        text = getElement(id + '_title');
        expect(text.textContent.indexOf('...') != -1).toBe(true);
    });
    it('title tooltip feature checking', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            accumulation.loaded = null;
            text = getElement(id + '_title');
            trigger.mousemoveEvent(text, 0, 0, 75, 20);
            let tooltip: Element = getElement(id + '_EJ2_Title_Tooltip');
            expect(tooltip.textContent).toBe('Single Point legend long text trimming feature checking');
            tooltip.remove();
            done();
        };
        accumulation.title = 'Single Point legend long text trimming feature checking';
        accumulation.width = '80';
        accumulation.refresh();
    });
    it('subtitle tooltip feature checking', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            text = getElement(id + '_subTitle');
            trigger.mousemoveEvent(text, 0, 0, 75, 120);
            let tooltip: Element = getElement(id + '_EJ2_Title_Tooltip');
            expect(tooltip.textContent).toBe('subtitle text');
            tooltip.remove();
            done();
        };
        accumulation.title = 'title text';
        accumulation.subTitle = 'subtitle text';
        accumulation.width = '80';
        accumulation.refresh();
    });
    it('remote data checking', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            expect((accumulation.series[0] as AccumulationSeries).points.length).toBe(6);
            expect(getElement(id + '_Series_0_Point_3').getAttribute('opacity')).toBe('0.2');
            done();
        };
        accumulation.series[0].dataSource = dataManager;
        accumulation.series[0].xName = 'Id';
        accumulation.series[0].opacity = 0.2;
        accumulation.series[0].yName = 'Estimate';
        accumulation.series[0].query = query;
        accumulation.series[0].groupTo = null;
        accumulation.title = '';
        accumulation.refresh();
    });
   /* it('center aligned div checking tooltip', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            accumulation.loaded = null;
            let segement: Element = getElement(id + '_Series_0_Point_3');
            trigger.mousemoveEvent(segement, 0, 0, 200, 200);
            let tooltip: HTMLElement = document.getElementById('ej2container_tooltip');
            expect(tooltip != null).toBe(true);
            done();
        };
        element.setAttribute('align', 'center');
        accumulation.width = '300px';
        accumulation.series = [ {
            animation: { enable: false},
            dataSource: [{x: 1, y: 8.5}, {x: 2, y: 3.5}, {x: 3, y: 2.5}, {x: 4, y: 6.5}],
            xName: 'x', yName: 'y'
        }];
        accumulation.series[0].dataLabel = {
            visible: true,
            template: '<div>${point.y}Million</div>'
        };
        accumulation.tooltip.enable =  true;
        accumulation.title = '';
        accumulation.refresh();
    });
    it('checking with title alignment default', (done: Function) => {
        loaded = (args: IAccLoadedEventArgs) => {
            text = getElement(id + '_title');
            expect(text.getAttribute('x') == '131.5' || text.getAttribute('x') == '128.5').toBe(true);
            done();
        };
        accumulation.loaded = loaded;
        accumulation.width = '300';
        accumulation.title = 'title';
        accumulation.refresh();
    });
    it('checking with title alignment Far', () => {
        accumulation.titleStyle.textAlignment = 'Far';
        accumulation.loaded = null;
        accumulation.dataBind();
        text = getElement(id + '_title');
        expect(text.getAttribute('x') == '243' || text.getAttribute('x') == '237').toBe(true);
    });
    it('checking with title alignment Near', () => {
        accumulation.titleStyle.textAlignment = 'Near';
        accumulation.dataBind();
        text = getElement(id + '_title');
        expect(text.getAttribute('x')).toEqual('20');
    });*/

});
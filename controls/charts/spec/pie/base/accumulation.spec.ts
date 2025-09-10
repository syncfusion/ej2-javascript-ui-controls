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
import { getElement, removeElement} from '../../../src/common/utils/helper';
import { Rect } from '@syncfusion/ej2-svg-base';
import { IAccLoadedEventArgs, IAccPointRenderEventArgs } from '../../../src/accumulation-chart/model/pie-interface';
import { IMouseEventArgs } from '../../../src/chart/model/chart-interface';
import { data, datetimeData1, remoteData} from '../../chart/base/data.spec';
import { MouseEvents} from '../../chart/base/events.spec';
import { profile, inMB, getMemoryProfile } from '../../common.spec';
import { piedata } from '../../chart/base/data.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { Export } from '../../../src/chart/print-export/export';

AccumulationChart.Inject(AccumulationTooltip, AccumulationDataLabel, Export);
describe('Accumulation Chart Control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
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
        //debugger;
        accumulation.title = 'Syncfusion accumulation Title';
        accumulation.dataBind();
        text = getElement(id + '_title');
        expect(text.textContent).toBe('Syncfusion accumulation Title');
        expect(text.getAttribute('y') === '25' || text.getAttribute('y') === '23.5').toEqual(true);
    });
         
    it('checking chart title with different radius', () => {
        accumulation.title = 'Empty Point as average';
        accumulation.dataBind();
        text = getElement(id + '_title');
        expect(text.textContent).toBe('Empty Point as average');
       if (parseInt(accumulation.series[0].radius) >= 80) {
        expect(text.getAttribute('y') === '25' || text.getAttribute('y') === '23.5').toEqual(true);
       }
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

    it('checking chart title with different radius', () => {
        accumulation.title = 'Empty Point as average';
        accumulation.dataBind();
        text = getElement(id + '_title');
        expect(text.textContent).toBe('Empty Point as average');
       if(parseInt(accumulation.series[0].radius) >= 80){
        expect(text.getAttribute('y') === '25' || text.getAttribute('y') === '23.5').toEqual(true);
       }
    });

    it('Checking with subtitle Overflow is Wrap', () => {
        accumulation.subTitleStyle.textOverflow = 'Wrap',
        accumulation.title = 'Syncfusion accumulation Title';
        accumulation.subTitle = 'Syncfusion accumulation subTitleSyncfusionaccumulationTitleSyncfusion';
        accumulation.dataBind();
        text = getElement(id + '_subTitle');
        expect(text.childNodes.length == 1).toBe(true);
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
        expect(text.textContent.indexOf('...') == -1).toBe(true);
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
            expect((accumulation.series[0] as AccumulationSeries).points.length).toBe(7);
            expect(getElement(id + '_Series_0_Point_3').getAttribute('opacity')).toBe('0.2');
            done();
        };
        accumulation.series[0].dataSource = remoteData;
        accumulation.series[0].xName = 'Id';
        accumulation.series[0].opacity = 0.2;
        accumulation.series[0].yName = 'Estimate';
        accumulation.series[0].groupTo = null;
        accumulation.title = '';
        accumulation.refresh();
    });
    it('Apply accessibility to Accumulation Chart container', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            element = document.getElementById('ej2container');
            expect(element !== null).toBe(true);
            expect(element!.getAttribute('role')).toBe('region');
            expect(element!.getAttribute('aria-label')).toBe('The Accumulation Chart container');
            expect(element!.getAttribute('tabindex')).toBe('-1');
            done();
        };
        accumulation.series = [{
            dataSource: piedata,
            xName: 'x', yName: 'y'
        }];
        accumulation.accessibility.accessibilityRole = 'region';
        accumulation.accessibility.accessibilityDescription = 'The Accumulation Chart container';
        accumulation.accessibility.focusable = false;
        accumulation.refresh();
    });
    it('Background image checking', (done: Function) => {
        setTimeout(() => {
            let background: HTMLElement = document.getElementById(id + '_background');
            expect(background.getAttribute('href') != null).toBe(true);
            done();
        }, 500);
        accumulation.backgroundImage = 'https://cdn.syncfusion.com/content/images/freetrials/essential-studio.png?v=03102019101652';
        accumulation.refresh();
    });
    it('checking accumulation chart double click event', (done: Function) => {
        loaded = (args: IAccLoadedEventArgs) => {
            element = document.getElementById(args.chart.element.id);
            trigger.doubleClickEvent(element);
        };
        accumulation.chartDoubleClick = (args: IMouseEventArgs) =>{
            expect(args.name).toEqual('chartDoubleClick');
            done();
        };
        accumulation.loaded = loaded;
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

// describe('Accumulation chart with remote dataSource', () => {
//     let pie: AccumulationChart;
//     let ele: Element;
//     let loaded: EmitType<IAccLoadedEventArgs>;
//     let dataManager: DataManager = new DataManager({
//         url: 'https://mvc.syncfusion.com/Services/Northwnd.svc/Tasks/'
//     });
//     let query: Query = new Query().take(5).where('Estimate', 'lessThan', 3, false);
//     beforeAll(() => {
//         ele = createElement('div', { id: 'remote' });
//         document.body.appendChild(ele);
//         pie = new AccumulationChart(
//             {
//                 series: [
//                     {
//                         dataSource: dataManager,
//                         xName: 'Assignee', yName: 'Estimate', animation: { enable: false },
//                         name: 'Story Point',
//                     }
//                 ],
//             });
//         pie.appendTo('#remote');


//     });
//     afterAll((): void => {
//         pie.destroy();
//         ele.remove();
//     });
//     it('Checking the series without query', (done: Function) => {
//         loaded = (args: Object): void => {
//             let element: Element = getElement('remote');
//             let svgObject = getElement('remote' + '_svg');
//             expect(svgObject).not.toBe(null);
//             done();
//         };
//         pie.loaded = loaded;
//         pie.refresh();
//     });
//     it('Checking with query', (done: Function) => {
//         loaded = (args: Object): void => {
//             let element: Element = getElement('remote');
//             let svgObject = getElement('remote' + '_svg');
//             expect(svgObject).not.toBe(null);
//             done();
//         };
//         pie.loaded = loaded;
//         pie.series[0].query = query;
//         pie.refresh();
//     });
// });
it('memory leak', () => {
    profile.sample();
    let average: any = inMB(profile.averageChange)
    //Check average change in memory samples to not be over 10MB
    expect(average).toBeLessThan(10);
    let memory: any = inMB(getMemoryProfile())
    //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
    expect(memory).toBeLessThan(profile.samples[0] + 0.25);
});
    describe('Pie Chart checking no data template', () => {
        let chart: AccumulationChart;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            chart = new AccumulationChart();
            chart.appendTo('#container');
        });

        afterAll((): void => {
            chart.destroy();
            ele.remove();
        });
        it('checking no data template element', (done: Function) => {
            chart.loaded = (args: Object) => {
                chart.loaded = null;
                const templateElement: HTMLElement = document.getElementById('container_NoDataTemplate_wrapper');
                expect(templateElement != null);
                done();
            };
            chart.subTitle = null;
            chart.noDataTemplate = '<div>No data template</div>';
            chart.refresh();
        });
        it('checking with title', (done: Function) => {
            chart.loaded = (args: Object) => {
                chart.loaded = null;
                const templateElement: HTMLElement = document.getElementById('container_NoDataTemplate_wrapper');
                expect(templateElement != null);
                done();
            };
            chart.enableHtmlSanitizer = true;
            chart.title = 'Title';
            chart.subTitle = 'Title';
            chart.refresh();
        });
        it('checking with left title', (done: Function) => {
            chart.loaded = (args: Object) => {
                chart.loaded = null;
                const templateElement: HTMLElement = document.getElementById('container_NoDataTemplate_wrapper');
                expect(templateElement != null);
                done();
            };
            chart.titleStyle.position = 'Left';
            chart.enableHtmlSanitizer = false;
            chart.refresh();
        });
        it('checking with right title', (done: Function) => {
            chart.loaded = (args: Object) => {
                chart.loaded = null;
                const templateElement: HTMLElement = document.getElementById('container_NoDataTemplate_wrapper');
                expect(templateElement != null);
                done();
            };
            chart.titleStyle.position = 'Right';
            chart.refresh();
        });
        it('checking with bottom title', (done: Function) => {
            chart.loaded = (args: Object) => {
                chart.loaded = null;
                const templateElement: HTMLElement = document.getElementById('container_NoDataTemplate_wrapper');
                expect(templateElement != null);
                done();
            };
            chart.titleStyle.position = 'Bottom';
            chart.noDataTemplate = function() {
                return '<div>No data template</div>';
            };
            chart.refresh();
        });
    });
describe('Checking RTL Behaviour for Title', () => {
    let ele: HTMLElement;
    let id: string = 'ej2-container';
    let textEle: Element;
    let titleId: string = id + '_title';
    let subTitleId: string = id +'_subTitle';
    let accumulation: AccumulationChart;
    let anchor: string;
    beforeAll((): void => {
        ele = createElement('div', { id: id });
        document.body.appendChild(ele);
        accumulation = new AccumulationChart({
            border: { width: 1, color: 'blue' },
            series: [
                {
                    type: 'Pie',
                    dataSource: piedata, animation: { enable: false }, xName: 'x', yName: 'y'
                }
            ], 
            width: '600', 
            height: '400', 
            legendSettings: { visible: false },
            title: 'Syncfusion مخططات',
            subTitle: 'Since 2012',
            titleStyle: {
                textAlignment: 'Near'
            },
            subTitleStyle: {
                textAlignment: 'Far'
            }
        });
        accumulation.appendTo('#' + id);
    });

    afterAll((): void => {
        accumulation.loaded = null;
        accumulation.destroy();
        removeElement(id);
    });
    it('Default title anchor', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            textEle = getElement(titleId);
            anchor = textEle.getAttribute('text-anchor');
            expect(anchor === 'start').toBe(true);
            done();
        };
        accumulation.refresh();
    });
    it('Default subtitle anchor', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            textEle = getElement(subTitleId);
            anchor = textEle.getAttribute('text-anchor');
            expect(anchor === 'end').toBe(true);
            done();
        };
        accumulation.refresh();
    });
    it('Title anchor with RTL', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            textEle = getElement(titleId);
            anchor = textEle.getAttribute('text-anchor');
            expect(anchor === 'end').toBe(true);
            done();
        };
        accumulation.enableRtl = true;
        accumulation.refresh();
    });
    it('Subtitle anchor with RTL', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            textEle = getElement(subTitleId);
            anchor = textEle.getAttribute('text-anchor');
            expect(anchor === 'start').toBe(true);
            done();
        };
        accumulation.refresh();
    });
    it('Subtitle anchor with enableRtl as true', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            textEle = getElement(subTitleId);
            anchor = textEle.getAttribute('text-anchor');
            expect(anchor).toBe('end');
            done();
        };
        accumulation.title = 'Syncfusion';
        accumulation.subTitle = 'Since 2012';
        accumulation.subTitleStyle.textAlignment = 'Far';
        accumulation.enableRtl = false;
        accumulation.refresh();
    });
    it('Checking chart without element id', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            args.chart.isBlazor = true;
            expect(args.chart.element !== null).toBe(true);
            done();
        };
        accumulation.element.id = '';
        accumulation.isBlazor = true;
        accumulation.refresh();
    });
    it('Check accumulation chart center x and y', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            expect(accumulation !== null).toBe(true); 
            done();
        };
        accumulation.center.x = '60%';
    });
  });
  describe('Checking RTL Behaviour for CenterLabel', () => {
    let element: HTMLElement;
    let segement: Element;
    let id: string = 'ej2-container';
    let sliceid: string = id + '_Series_0' + '_Point_';
    let trigger: MouseEvents = new MouseEvents();
    let textElement: Element;
    let labelId: string = id + '_centerLabel';
    let accumulation: AccumulationChart;
    let anchor: string;
    beforeAll((): void => {
        element = createElement('div', { id: id });
        document.body.appendChild(element);
        accumulation = new AccumulationChart({
            border: { width: 1, color: 'blue' },
            series: [
                {
                    type: 'Pie',  innerRadius: '50%',
                    dataSource: piedata, animation: { enable: true }, xName: 'x', yName: 'y'
                }
            ], 
            width: '600', 
            height: '400', 
            centerLabel: {
                text: 'Syncfusion',
                textStyle: {
                    size: '11px',
                },
                hoverTextFormat: '${point.x}'
            },
            enableExport: false,
        });
        accumulation.appendTo('#' + id);
    });

    afterAll((): void => {
        accumulation.loaded = null;
        accumulation.destroy();
        removeElement(id);
    });
    it('Cheking CenterLabel text', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            let centerLabel: HTMLElement = document.getElementById('ej2-container_centerLabel');
            expect(centerLabel.children[0].innerHTML === 'Syncfusion').toBe(true);
            done();
        };
        accumulation.refresh();
    });
    it('Checking CenterLabel text on point mouse move', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            segement = getElement(sliceid + 0);
            trigger.mousemoveEvent(segement, 0, 0, 200, 200);
            let centerLabel: HTMLElement = document.getElementById('ej2-container_centerLabel');
            expect(centerLabel.children[0].innerHTML === '1').toBe(true);
            trigger.mouseleavetEvent(element, 1000, 1000);
            done();
        };
        accumulation.refresh();
    });
    it('Checking CenterLabel text-anchor', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            textElement = getElement(labelId);
            anchor = textElement.getAttribute('text-anchor');
            expect(anchor === 'middle').toBe(true);
            done();
        };
        accumulation.refresh();
    });
    it('Checking HighContrast theme', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            trigger.mousemoveEvent(element, 0, 0, 300, 300);
            expect(accumulation.themeStyle.tabColor).toBe('#FFD939');
            trigger.mouseleavetEvent(element, 200, 200);
            done();
        };
        accumulation.theme='HighContrast'
        accumulation.refresh();
    });  
    it('Checking HighContrastLight theme', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            trigger.mousemoveEvent(element, 0, 0, 300, 300);
            expect(accumulation.themeStyle.tabColor).toBe('#FFD939');
            trigger.mouseleavetEvent(element, 200, 200)
            done();
        };
        accumulation.theme='HighContrastLight'
        accumulation.refresh();
    }); 
    it('Checking Bootstrap4 theme', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            trigger.mousemoveEvent(element, 0, 0, 300, 300);
            expect(accumulation.themeStyle.tabColor).toBe('#007BFF');
            trigger.mouseleavetEvent(element, 200, 200);
            done();
        };
        accumulation.theme='Bootstrap4'
        accumulation.refresh();
    });
    it('Checking TailwindDark theme', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            trigger.mousemoveEvent(element, 0, 0, 300, 300);
            expect(accumulation.themeStyle.tabColor).toBe('#22D3EE');
            trigger.mouseleavetEvent(element, 200, 200);
            done();
        };
        accumulation.theme='TailwindDark'
        accumulation.refresh();
    });
    it('Checking Bootstrap5Dark theme', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            trigger.mousemoveEvent(element, 0, 0, 300, 300);
            expect(accumulation.themeStyle.tabColor).toBe('#0D6EFD');
            trigger.mouseleavetEvent(element, 200, 200);
            done();
        };
        accumulation.theme='Bootstrap5Dark'
        accumulation.refresh();
    });
    it('Checking FluentDark theme', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            trigger.mousemoveEvent(element, 0, 0, 300, 300);
            expect(accumulation.themeStyle.tabColor).toBe('#0078D4');
            trigger.mouseleavetEvent(element, 200, 200);
            done();
        };
        accumulation.theme='FluentDark'
        accumulation.refresh();
    });
    it('Checking MaterialDark theme', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            trigger.mousemoveEvent(element, 0, 0, 300, 300);
            expect(accumulation.themeStyle.tabColor).toBe('#00B0FF');
            trigger.mouseleavetEvent(element, 200, 200);
            done();
        };
        accumulation.theme='MaterialDark'
        accumulation.refresh();
    });
    it('Checking FabricDark theme', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            trigger.mousemoveEvent(element, 0, 0, 300, 300);
            expect(accumulation.themeStyle.tabColor).toBe('#0074CC');
            trigger.mouseleavetEvent(element, 200, 200);
            done();
        };
        accumulation.theme='FabricDark'
        accumulation.refresh();
    });
    it('Checking Bootstrap theme', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            trigger.mousemoveEvent(element, 0, 0, 300, 300);
            expect(accumulation.themeStyle.tabColor).toBe('#317AB9');
            trigger.mouseleavetEvent(element, 200, 200);
            done();
        };
        accumulation.theme='Bootstrap'
        accumulation.refresh();
    });
    it('Checking Tailwind theme', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            trigger.mousemoveEvent(element, 0, 0, 300, 300);
            expect(accumulation.themeStyle.tabColor).toBe('#4F46E5');
            trigger.mouseleavetEvent(element, 200, 200);
            done();
        };
        accumulation.theme='Tailwind'
        accumulation.refresh();
    });
    it('Checking Bootstrap5 theme', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            trigger.mousemoveEvent(element, 0, 0, 300, 300);
            expect(accumulation.themeStyle.tabColor).toBe('#0D6EFD');
            trigger.mouseleavetEvent(element, 200, 200);
            done();
        };
        accumulation.theme='Bootstrap5'
        accumulation.refresh();
    });
    it('Checking Fluent theme', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            trigger.mousemoveEvent(element, 0, 0, 300, 300);
            expect(accumulation.themeStyle.tabColor).toBe('#0078D4');
            trigger.mouseleavetEvent(element, 200, 200);
            done();
        };  
        accumulation.theme='Fluent'
        accumulation.refresh();
    });
    it('Checking Fluent2 theme', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            trigger.mousemoveEvent(element, 0, 0, 300, 300);
            expect(accumulation.themeStyle.tabColor).toBe('#0078D4');
            trigger.mouseleavetEvent(element, 200, 200);
            done();
        };  
        accumulation.centerLabel.text = 'Syncfusion deliver innovation with ease';
        accumulation.centerLabel.textStyle.size = '30px';  
        accumulation.theme='Fluent2';
        accumulation.animate(10);
        accumulation.refresh();
    });
    it('Checking Fluent2Dark theme', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            trigger.mousemoveEvent(element, 0, 0, 300, 300);
            expect(accumulation.themeStyle.tabColor).toBe('#0078D4');
            trigger.mouseleavetEvent(element, 200, 200);
            done();
        };  
        accumulation.theme='Fluent2Dark';
        accumulation.series[0].dataSource=[  {
            OrderCount: 18, EmployeeID: 1, Freight: 12, Verified: !0
        }]
        accumulation.animate(500);
        accumulation.refresh();
    });
    it('Cheking CenterLabel text with innerRadius as 0', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            let centerLabel: HTMLElement = document.getElementById('ej2-container_centerLabel');
            expect(centerLabel.children[0].innerHTML === 'Syncfusion').toBe(true);
            done();
        };
        accumulation.series[0].innerRadius = '0';
        accumulation.refresh();
    });
    it('Cheking CenterLabel text with br tag', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            let centerLabel: HTMLElement = document.getElementById('ej2-container_centerLabel');
            expect(centerLabel.children[0].innerHTML === '<b>Syncfusion</b> accumulation').toBe(false);
            done();
        };
        accumulation.centerLabel.text = "Syncfusion<br>accumulation"
        accumulation.refresh();
    });
    it('Cheking CenterLabel text with endAngle and startAngle', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            let centerLabel: HTMLElement = document.getElementById('ej2-container_centerLabel');
            expect(centerLabel.children[0].innerHTML === 'Syncfusion accumulation').toBe(false);
            done();
        };
        accumulation.series[0].startAngle = 270;
        accumulation.series[0].endAngle = 90;
        accumulation.refresh();
    });
      it('Checking chart animation with duration as zero', (done: Function) => {
          accumulation.loaded = (args: IAccLoadedEventArgs) => {
              expect(document.getElementById('ej2-container') !== null).toBe(true);
              done();
          };
          accumulation.animate(0);
          accumulation.refresh();
      });
      it('Checking accumulation chart elements', (done: Function) => {
          accumulation.loaded = (args: IAccLoadedEventArgs) => {
              accumulation.loaded = null;
              if (args.accumulation.accBaseModule) {
                  args.chart.isBlazor = true;
                  args.chart.renderElements();
                  args
                  expect(document.getElementById('ej2-container') !== null).toBe(true);
              }
              expect(document.getElementById('ej2-container') !== null).toBe(true);
              done();
          };
          accumulation.load = (args: IAccLoadedEventArgs) => {
              args.chart.isBlazor = true;
          };
          accumulation.refresh();
      });
      it('Checking accumulation checking pointColormappings', (done: Function) => {
          accumulation.loaded = (args: IAccLoadedEventArgs) => {
              if (args.chart.accBaseModule) {
                  args.chart.animate();
              }
              expect(document.getElementById('ej2-container') !== null).toBe(true);
              done();
          };
          accumulation.series[0].pointColorMapping = 'color';
          accumulation.series[0].dataSource = [{ y: 18, x: 1, name: 'Bald Eagle', color: 'red', text: 'Bald Eagle : 18', radius: '50%' }, { y: 23, x: 2, name: 'Bison', color: 'Blue', text: 'Bison : 23', radius: '60%' },
          { y: 30, x: 3, name: 'Brown Bear', color: 'yellow', text: 'Brown Bear : 30', radius: '70%' }, { y: 44, x: 4, name: 'Elk', color: 'black', text: 'Elk : 44', radius: '100%' }];
          accumulation.refresh();
      });
  });
    describe('Checking accumulation chart explode ', () => {
        let element: HTMLElement;
        let id: string = 'ej2-container';
        let accumulation: AccumulationChart;
        beforeAll((): void => {
            element = createElement('div', { id: id });
            document.body.appendChild(element);
            accumulation = new AccumulationChart({
                border: { width: 1, color: 'blue' },
                series: [
                    {
                        type: 'Pie', innerRadius: '50%',
                        dataSource: piedata, animation: { enable: true }, xName: 'x', yName: 'y'
                    }
                ],
                width: '600',
                height: '400',
                centerLabel: {
                    text: 'Syncfusion',
                    textStyle: {
                        size: '11px',
                    },
                    hoverTextFormat: '${point.x}'
                },
                enableExport: false,
            });
            accumulation.appendTo('#' + id);
        });

        afterAll((): void => {
            accumulation.loaded = null;
            accumulation.destroy();
            removeElement(id);
        });

        it('Checking accumulation checking enableAnimation', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
                expect(document.getElementById('ej2-container') !== null).toBe(true);
                done();
            };
            expect(document.getElementById('ej2-container') !== null).toBe(true);
            done();
            accumulation.series[0].name = 'Animals';
            accumulation.series[0].explode = true;
            accumulation.series[0].explodeIndex = 3;
            accumulation.dataBind();
        });
        it('Checking accumulation checking enable animation with explodeIndex', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
                expect(document.getElementById('ej2-container') !== null).toBe(true);
                done();
            };
            expect(document.getElementById('ej2-container') !== null).toBe(true);
            done();
            accumulation.series[0].name = 'Elements';
            accumulation.series[0].explode = true;
            accumulation.series[0].explodeIndex = -3;
            accumulation.dataBind();
        });
    });
    describe('Checking applyPattern', () => {
        let element: HTMLElement;
        let id: string = 'ej2-container1';
        let accumulation: AccumulationChart;
        beforeAll((): void => {
            element = createElement('div', { id: id });
            document.body.appendChild(element);
            accumulation = new AccumulationChart({
                border: { width: 1, color: 'blue' },
                series: [
                    {
                        type: 'Pie',  innerRadius: '50%',
                        dataSource: piedata, animation: { enable: true }, xName: 'x', yName: 'y'
                    }
                ], 
                width: '600', 
                height: '400', 
                centerLabel: {
                    text: 'Syncfusion',
                    textStyle: {
                        size: '11px',
                    },
                    hoverTextFormat: '${point.x}'
                }
            });
            accumulation.appendTo('#' + id);
        });
        afterAll((): void => {
            accumulation.loaded = null;
            accumulation.destroy();
            removeElement(id);
        });
        it('Different Patterns', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
                const array1: string[] = document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id.split('_')
                const array2: string[] = document.getElementById(id + '_svg').querySelectorAll('pattern')[1].id.split('_')
                expect(array1[1]).not.toBe(array2[1]);
                done();
            };
            accumulation.series[0].applyPattern=true
            accumulation.refresh();
        });
        it('Different Patterns with high number of data', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
                const array1: string[] = document.getElementById(id + '_svg').querySelectorAll('pattern')[1].id.split('_')
                const array2: string[] = document.getElementById(id + '_svg').querySelectorAll('pattern')[14].id.split('_')
                expect(array1[1]).not.toBe(array2[1]);
                done();
            };
            accumulation.series[0].dataSource= [{ x: 'English', y: 48.20, text: '18.20%' },
            { x: 'Sanskrit', y: 27.3, text: '27.3%' },
            { x: 'French', y: 27.3, text: '27.3%' },
            { x: 'Tamil', y: 55.9, text: '55.9%' },
            { x: 'Maths', y: 76.8, text: '76.8%' },
            { x: 'Chemistry', y: 86.8, text: '76.8%' },
            { x: 'Biology', y: 96.8, text: '76.8%' },
            { x: 'Physics', y: 100, text: '100%' },{ x: 'English', y: 48.20, text: '18.20%' },
            { x: 'Sanskrit', y: 27.3, text: '27.3%' },
            { x: 'French', y: 27.3, text: '27.3%' },
            { x: 'Tamil', y: 55.9, text: '55.9%' },
            { x: 'Maths', y: 76.8, text: '76.8%' },
            { x: 'Chemistry', y: 86.8, text: '76.8%' },
            { x: 'Biology', y: 96.8, text: '76.8%' },
            { x: 'Physics', y: 100, text: '100%' }]
            accumulation.series[0].applyPattern=true
            accumulation.refresh();
        });
        it('Preferred pattern', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
                const fillURL: string = document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id;
                expect(fillURL).toBe('ej2-container1_Pacman_Selection_0');
                done();
            };
            accumulation.pointRender = (args:IAccPointRenderEventArgs) =>{
                if(args.point.index==0  ){
                  args.pattern = 'Pacman'     }
              }
            accumulation.series[0].applyPattern=true
            accumulation.refresh();
        });
        it('Checking title with position - Bottom', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
                const x: string = document.getElementById('ej2-container1_title').getAttribute('x');
                const y: string = document.getElementById('ej2-container1_title').getAttribute('y');
                expect(+x).toBe(300);
                expect(+y).toBe(365);
                done();
            };
            accumulation.title = 'Pie chart title checking';
            accumulation.subTitle = 'Sub Title checking';
            accumulation.titleStyle.position = 'Bottom';
            accumulation.refresh();
        });
        it('Checking title with position - Right', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
                const x: string = document.getElementById('ej2-container1_title').getAttribute('x');
                const y: string = document.getElementById('ej2-container1_title').getAttribute('y');
                expect(+x).toBe(576.5);
                expect(+y).toBe(200);
                done();
            };
            accumulation.title = 'Pie chart title checking';
            accumulation.subTitle = 'Sub Title checking';
            accumulation.titleStyle.position = 'Right';
            accumulation.refresh();
        });
        it('Checking title with position - Left', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
                const x: string = document.getElementById('ej2-container1_title').getAttribute('x');
                const y: string = document.getElementById('ej2-container1_title').getAttribute('y');
                expect(+x).toBe(23.5);
                expect(+y).toBe(200);
                done();
            };
            accumulation.title = 'Pie chart title checking';
            accumulation.subTitle = 'Sub Title checking';
            accumulation.titleStyle.position = 'Left';
            accumulation.refresh();
        });
        it('Checking title with position - Left Near', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
                const x: string = document.getElementById('ej2-container1_title').getAttribute('x');
                const y: string = document.getElementById('ej2-container1_title').getAttribute('y');
                expect(+x).toBe(23.5);
                expect(+y).toBe(11);
                done();
            };
            accumulation.title = 'Pie chart title checking';
            accumulation.subTitle = 'Sub Title checking';
            accumulation.titleStyle.position = 'Left';
            accumulation.titleStyle.textAlignment = 'Near';
            accumulation.refresh();
        });
        it('Checking title with position - Left Far', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
                const x: string = document.getElementById('ej2-container1_title').getAttribute('x');
                const y: string = document.getElementById('ej2-container1_title').getAttribute('y');
                expect(+x).toBe(23.5);
                expect(+y).toBe(389);
                done();
            };
            accumulation.title = 'Pie chart title checking';
            accumulation.subTitle = 'Sub Title checking';
            accumulation.titleStyle.position = 'Left';
            accumulation.titleStyle.textAlignment = 'Far';
            accumulation.refresh();
        });
        it('Checking title with position - Right Near', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
                const x: string = document.getElementById('ej2-container1_title').getAttribute('x');
                const y: string = document.getElementById('ej2-container1_title').getAttribute('y');
                expect(+x).toBe(576.5);
                expect(+y).toBe(11);
                done();
            };
            accumulation.title = 'Pie chart title checking';
            accumulation.subTitle = 'Sub Title checking';
            accumulation.titleStyle.position = 'Right';
            accumulation.titleStyle.textAlignment = 'Near';
            accumulation.refresh();
        });
        it('Checking title with position - Right Far', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
                const x: string = document.getElementById('ej2-container1_title').getAttribute('x');
                const y: string = document.getElementById('ej2-container1_title').getAttribute('y');
                expect(+x).toBe(576.5);
                expect(+y).toBe(389);
                done();
            };
            accumulation.title = 'Pie chart title checking';
            accumulation.subTitle = 'Sub Title checking';
            accumulation.titleStyle.position = 'Right';
            accumulation.titleStyle.textAlignment = 'Far';
            accumulation.refresh();
        });
        it('Checking title with position - Bottom Far', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
                const x: string = document.getElementById('ej2-container1_title').getAttribute('x');
                const y: string = document.getElementById('ej2-container1_title').getAttribute('y');
                expect(+x).toBe(591);
                expect(+y).toBe(365);
                done();
            };
            accumulation.title = 'Pie chart title checking';
            accumulation.subTitle = 'Sub Title checking';
            accumulation.titleStyle.textAlignment = 'Far';
            accumulation.titleStyle.position = 'Bottom';
            accumulation.refresh();
        });
        it('Checking title with position - Bottom Near', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
                const x: string = document.getElementById('ej2-container1_title').getAttribute('x');
                const y: string = document.getElementById('ej2-container1_title').getAttribute('y');
                expect(+x).toBe(11);
                expect(+y).toBe(365);
                done();
            };
            accumulation.title = 'Pie chart title checking';
            accumulation.subTitle = 'Sub Title checking';
            accumulation.titleStyle.position = 'Bottom';
            accumulation.titleStyle.textAlignment = 'Near';
            accumulation.refresh();
        });
        it('Checking title with custom position', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
                const x: string = document.getElementById('ej2-container1_title').getAttribute('x');
                const y: string = document.getElementById('ej2-container1_title').getAttribute('y');
                expect(+x).toBe(150);
                expect(+y).toBe(150);
                done();
            };
            accumulation.title = 'Pie chart title checking';
            accumulation.subTitle = 'Sub Title checking';
            accumulation.titleStyle.position = 'Custom';
            accumulation.titleStyle.x = 150;
            accumulation.titleStyle.y = 150;
            accumulation.refresh();
        });
        it('Checking title with left position and rtl', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
                const x: string = document.getElementById('ej2-container1_title').getAttribute('x');
                const y: string = document.getElementById('ej2-container1_title').getAttribute('y');
                expect(+x).toBe(23.5);
                expect(+y).toBe(11);
                done();
            };
            accumulation.title = 'Pie chart title checking';
            accumulation.subTitle = 'Sub Title checking';
            accumulation.titleStyle.position = 'Left';
            accumulation.enableRtl = true;
            accumulation.refresh();
        });
        it('Checking title with right position and rtl', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
                const x: string = document.getElementById('ej2-container1_title').getAttribute('x');
                const y: string = document.getElementById('ej2-container1_title').getAttribute('y');
                expect(+x).toBe(576.5);
                expect(+y).toBe(11);
                done();
            };
            accumulation.title = 'Pie chart title checking';
            accumulation.subTitle = 'Sub Title checking';
            accumulation.titleStyle.position = 'Right';
            accumulation.enableRtl = true;
            accumulation.refresh();
        });
    })
});

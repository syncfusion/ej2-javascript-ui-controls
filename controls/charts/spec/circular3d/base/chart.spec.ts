/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable radix */
/* eslint-disable @typescript-eslint/tslint/config */
import { EmitType, createElement } from '@syncfusion/ej2-base';
import { CircularChart3D } from '../../../src/circularchart3d/circularchart3d';
import { CircularChart3DLoadedEventArgs } from '../../../src/circularchart3d/model/pie-interface';
import { MouseEvents } from '../../chart3d/base/events.spec';
import { Rect, removeElement } from '@syncfusion/ej2-svg-base';
import { getElement } from '../../../src/common/utils/helper';
import { CircularChart3DPoints, CircularChart3DSeries, PieSeries3D } from '../../../src/circularchart3d/renderer/series';
import { getMemoryProfile, inMB, profile } from '../../common.spec';

CircularChart3D.Inject(PieSeries3D);

export const data: Object[] = [
    {
        OrderCount: 18, EmployeeID: 1, Freight: 12, Verified: !0
    },
    {
        OrderCount: 29, EmployeeID: 2, Freight: 37, Verified: !1
    },
    {
        OrderCount: 30, EmployeeID: 3, Freight: 71, Verified: !0
    },
    {
        OrderCount: 41, EmployeeID: 4, Freight: 43, Verified: !0
    },
    {
        OrderCount: 52, EmployeeID: 5, Freight: 46, Verified: !0
    },
    {
        OrderCount: 62, EmployeeID: 6, Freight: 74, Verified: !0
    },
    {
        OrderCount: 74, EmployeeID: 7, Freight: 81, Verified: !1
    },
    {
        OrderCount: 85, EmployeeID: 8, Freight: 68, Verified: !0
    },
    {
        OrderCount: 96, EmployeeID: 9, Freight: 43, Verified: !1
    },
    {
        OrderCount: 102, EmployeeID: 10, Freight: 41, Verified: !0
    },
    {
        OrderCount: 118, EmployeeID: 11, Freight: 92, Verified: !0
    },
    {
        OrderCount: 119, EmployeeID: 12, Freight: 73, Verified: !1
    },
    {
        OrderCount: 120, EmployeeID: 13, Freight: 85, Verified: !0
    },
    {
        OrderCount: 125, EmployeeID: 14, Freight: 94, Verified: !1
    },
    {
        OrderCount: 128, EmployeeID: 15, Freight: 78, Verified: !0
    }];
export const datetimeData1: Object[] = [
    { x: new Date(2000, 3, 21), y: 10 }, { x: new Date(2000, 3, 17), y: 10 },
    { x: new Date(2000, 3, 18), y: 14 }, { x: new Date(2000, 3, 20), y: 45 },
    { x: new Date(2000, 3, 25), y: 67 }, { x: new Date(2000, 3, 30), y: 75 }
];

export const remoteData: Object[] = [
    {
        Assignee: 'Nancy Davloio',
        Estimate: 3.5,
        Id: 1,
        ImgUrl: '../content/images/kanban/1.png',
        Priority: 'Low',
        Status: 'Open',
        Summary: 'Analyze the new requirements gathered from the customer',
        Tags: 'Analyze,Customer',
        Type: 'Story'
    },
    {
        Assignee: 'Andrew Fuller',
        Estimate: 6,
        Id: 2,
        ImgUrl: '../content/images/kanban/2.png',
        Priority: 'Normal',
        Status: 'InProgress',
        Summary: 'Improve application performance',
        Tags: 'Improvement',
        Type: 'Improvement'
    },
    {
        Assignee: 'Janet Leverling',
        Estimate: 5.5,
        Id: 3,
        ImgUrl: '../content/images/kanban/3.png',
        Priority: 'Critical',
        Status: 'Open',
        Summary: 'Arrange a web meeting with the customer to get new requirements',
        Tags: 'Meeting',
        Type: 'Others'
    },
    {
        Assignee: 'Janet Leverling',
        Estimate: 2.5,
        Id: 4,
        ImgUrl: '../content/images/kanban/4.png',
        Priority: 'Release Breaker',
        Status: 'InProgress',
        Summary: 'Fix the issues reported in IE browsers',
        Tags: 'IE',
        Type: 'Bug'
    },
    {
        Assignee: 'Steven walker',
        Estimate: 3.5,
        Id: 5,
        ImgUrl: '../content/images/kanban/5.png',
        Priority: 'Low',
        Status: 'Testing',
        Summary: 'Fix the issues reported by the customer',
        Tags: 'Customer',
        Type: 'Bug'
    },
    {
        Assignee: 'Michael Suyama',
        Estimate: 2,
        Id: 6,
        ImgUrl: '../content/images/kanban/6.png',
        Priority: 'Low',
        Status: 'Close',
        Summary: 'Arrange a web meeting with the customer to get the login page requirements',
        Tags: 'Meeting',
        Type: 'Others'
    },
    {
        Assignee: 'Robert King',
        Estimate: 1.5,
        Id: 7,
        ImgUrl: '../content/images/kanban/7.png',
        Priority: 'Low',
        Status: 'Validate',
        Summary: 'Validate new requirements',
        Tags: 'Validation',
        Type: 'Improvement'
    }
];


describe('Circular 3D Chart Control', () => {
    beforeAll(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // eslint-disable-next-line no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Circular 3D Pie Control Checking', () => {
        let element: Element; let loaded: EmitType<CircularChart3DLoadedEventArgs>;
        let svgObject: Element;
        let text: Element;
        const id: string = 'ej2container';
        let pie: CircularChart3D;
        const trigger: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            element = createElement('div', { id: id });
            document.body.appendChild(element);
            pie = new CircularChart3D();
        });

        afterAll((): void => {
            pie.destroy();
            removeElement(id);
            removeElement(id + '_0_content');
        });
        it('Checking Circular 3Dinstance creation', (done: Function) => {
            pie.loaded = (args: Object): void => {
                expect(pie != null).toBe(true);
                done();
            };
            pie.appendTo('#' + id);
        });
        it('Empty options control class names', () => {
            element = getElement(id);
            expect(element.classList.contains('e-control')).toBe(true);
            expect(element.classList.contains('e-circular3dchart')).toBe(true);
        });
        it('Empty option chart height and width', () => {
            svgObject = getElement(id + '_svg');
            expect(svgObject.getAttribute('height')).toBe('450');
            expect(svgObject.getAttribute('width')).not.toBe(null);
        });
        it('Checking module name', () => {
            expect(pie.getModuleName()).toBe('circularchart3d');
        });
        it('Checking the null width of the chart', (done: Function) => {
            pie.width = null;
            element.setAttribute('style', 'width:0px');
            pie.loaded = (args: Object) => {
                svgObject = getElement(id + '_svg');
                expect(svgObject.getAttribute('width')).toEqual('600');
                done();
            };
            pie.refresh();
        });
        it('Checking the percentage size of the chart width', (done: Function) => {
            pie.width = '50%';
            element.setAttribute('style', 'width:900px');
            pie.loaded = (args: Object) => {
                svgObject = getElement(id + '_svg');
                expect(svgObject.getAttribute('width')).toEqual('450');
                done();
            };
            pie.refresh();
        });
        it('Checking the percentage size of the chart height', (done: Function) => {
            pie.height = '50%';
            element.setAttribute('style', 'height:900px');
            pie.loaded = (args: Object) => {
                svgObject = getElement(id + '_svg');
                expect(svgObject.getAttribute('height')).toEqual('450');
                done();
            };
            pie.refresh();
        });
        it('Checking the height of the chart', () => {
            pie.height = '500';
            pie.loaded = null;
            pie.dataBind();
            svgObject = getElement(id + '_svg');
            expect(svgObject.getAttribute('height')).toEqual('500');
        });
        it('Checking both height and width of the chart', () => {
            pie.width = '500';
            pie.height = '300';
            pie.dataBind();
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
            pie.title = 'Syncfusion accumulation Title';
            pie.dataBind();
            text = getElement(id + '-title');
            expect(text.textContent).toBe('Syncfusion accumulation Title');
            expect(text.getAttribute('y')).toEqual('23.5');
        });

        it('checking chart title with different radius', () => {
            pie.title = 'Empty Point as average';
            pie.dataBind();
            text = getElement(id + '-title');
            expect(text.textContent).toBe('Empty Point as average');
            if (parseInt(pie.series[0].radius) >= 80) {
                expect(text.getAttribute('y')).toEqual('23.5');
            }
        });

        it('Checking with subtitle', () => {
            pie.subTitle = 'accumulation SubTitle';
            pie.dataBind();
            text = getElement(id + '-sub-title');
            expect(text.textContent).toBe('accumulation SubTitle');
            expect(text.getAttribute('y')).toEqual('45.5');
        });

        it('Checking with title', () => {
            pie.titleStyle.textOverflow = 'Wrap';
            pie.title = 'Syncfusion accumulation TitleSyncfusionaccumulationTitleSyncfusionaccumulationTitleSyncfusionaccumulation Title';
            pie.dataBind();
            text = getElement(id + '-title');
            expect(text.textContent.indexOf('...') > -1).toBe(true);
        });

        it('checking title with different radius', () => {
            pie.title = 'Empty Point as average';
            pie.dataBind();
            text = getElement(id + '-title');
            expect(text.textContent).toBe('Empty Point as average');
            if (parseInt(pie.series[0].radius) >= 80) {
                expect(text.getAttribute('y')).toEqual('23.5');
            }
        });

        it('Checking with subtitle Overflow is Wrap', () => {
            pie.subTitleStyle.textOverflow = 'Wrap';
            pie.title = 'Syncfusion accumulation Title';
            pie.subTitle = 'Syncfusion accumulation subTitleSyncfusionaccumulationTitleSyncfusion';
            pie.dataBind();
            text = getElement(id + '-sub-title');
            expect(text.childNodes.length === 2).toBe(true);
        });

        it('Checking the title font size', () => {
            pie.title = 'accumulation Title';
            pie.titleStyle.size = '24px';
            pie.dataBind();
            text = getElement(id + '-title');
            expect(text.getAttribute('font-size')).toEqual('24px');
        });

        it('Checking the subtitle font size', () => {
            pie.subTitle = 'Sub Title';
            pie.subTitleStyle.size = '24px';
            pie.dataBind();
            text = getElement(id + '-sub-title');
            expect(text.getAttribute('font-size')).toEqual('24px');
        });

        it('Checking the subtitle Alingnment is Near', () => {
            pie.subTitleStyle.textAlignment = 'Near';
            pie.dataBind();
            text = getElement(id + '-sub-title');
            expect(text.getAttribute('text-anchor')).toEqual('start');
        });

        it('Checking the subtitle Alingnment is End', () => {
            pie.subTitleStyle.textAlignment = 'Far';
            pie.dataBind();
            text = getElement(id + '-sub-title');
            expect(text.getAttribute('text-anchor')).toEqual('end');
        });

        it('Checking the subtitle Trim', () => {
            pie.subTitle = 'Accumulation SubTitle Trim';
            pie.subTitleStyle.textOverflow = 'Trim';
            pie.dataBind();
            text = getElement(id + '-sub-title');
            expect(text.textContent.indexOf('...') !== -1).toBe(true);
        });
        it('Checking the border color', () => {
            pie.border.width = 2;
            pie.border.color = 'green';
            pie.dataBind();
            svgObject = getElement(id + '-border');
            expect(svgObject.getAttribute('stroke')).toBe('green');
            expect(svgObject.getAttribute('stroke-width')).toBe('2');
        });
        it('Checking the chart background', () => {
            pie.background = 'yellow';
            pie.dataBind();
            svgObject = getElement(id + '-border');
            expect(svgObject.getAttribute('fill')).toBe('yellow');
        });
        it('Checking the  Margin with out title ', () => {
            pie.margin = { left: 20, right: 10, top: 20, bottom: 30 };
            pie.title = '';
            pie.subTitle = '';
            pie.dataBind();
            const rect: Rect = pie.initialClipRect;
            expect(rect.width).toEqual(469);
            expect(rect.height).toEqual(250);
            expect(rect.x).toEqual(20);
            expect(rect.y).toEqual(20);
        });
        it('Checking the Margin with title', () => {
            pie.title = 'accumulation Title';
            pie.dataBind();
            const rect: Rect = pie.initialClipRect;
            expect(rect.width).toEqual(469);
            expect(rect.height).toEqual(223);
            expect(rect.x).toEqual(20);
            expect(rect.y).toEqual(47);
        });
        it('Checking with Series datapoints', (done: Function) => {
            loaded = (args: CircularChart3DLoadedEventArgs) => {
                const points: CircularChart3DPoints[] = (<CircularChart3DSeries>args.chart.series[0]).points;
                expect(points.length).toBe(15);
                done();
            };
            pie.series = [{
                dataSource: data,
                xName: 'x', yName: 'y'
            }];
            pie.loaded = loaded;
            pie.refresh();
        });
        it('Checking  with DataTime Values', (done: Function) => {
            loaded = (args: CircularChart3DLoadedEventArgs) => {
                const points: CircularChart3DPoints[] = (<CircularChart3DSeries>args.chart.series[0]).points;
                expect(points.length).toBe(6);
                done();
            };
            pie.series = [{
                dataSource: datetimeData1,
                xName: 'x', yName: 'y',
                animation: { enable: false }
            }];
            pie.loaded = loaded;
            pie.refresh();
        });
        it('resize checking', () => {
            window.dispatchEvent(new Event('resize'));
            svgObject = getElement(id + '_svg');
            expect(svgObject).not.toBe(null);
            expect(svgObject.getAttribute('width')).toBe('500');
            expect(svgObject.getAttribute('height')).toBe('300');
        });
        it('theme checking', () => {
            pie.theme = 'Fabric';
            pie.dataBind();
            const points: CircularChart3DPoints[] = (<CircularChart3DSeries>pie.series[0]).points;
            expect(points[1].color).toBe('#404041');
        });
        it('Checking title trim', () => {
            pie.title = 'candidate joined in a year syncfusion - Chart Title';
            pie.width = '80';
            pie.dataBind();
            text = getElement(id + '-title');
            expect(text.textContent.indexOf('...') !== -1).toBe(true);
        });
        it('title tooltip feature checking', (done: Function) => {
            pie.loaded = (args: CircularChart3DLoadedEventArgs) => {
                pie.loaded = null;
                text = getElement(id + '-title');
                trigger.mousemoveEvent(text, 0, 0, 75, 20);
                const tooltip: Element = getElement(id + '_EJ2_Title_Tooltip');
                expect(tooltip.textContent).toBe('Single Point legend long text trimming feature checking');
                tooltip.remove();
                done();
            };
            pie.title = 'Single Point legend long text trimming feature checking';
            pie.width = '80';
            pie.refresh();
        });
        it('subtitle tooltip feature checking', (done: Function) => {
            pie.loaded = (args: CircularChart3DLoadedEventArgs) => {
                text = getElement(id + '-sub-title');
                trigger.mousemoveEvent(text, 0, 0, 75, 120);
                const tooltip: Element = getElement(id + '_EJ2_Title_Tooltip');
                expect(tooltip.textContent).toBe('subtitle text');
                tooltip.remove();
                done();
            };
            pie.title = 'title text';
            pie.subTitle = 'subtitle text';
            pie.width = '80';
            pie.refresh();
        });
        it('remote data checking', (done: Function) => {
            pie.loaded = (args: CircularChart3DLoadedEventArgs) => {
                expect((pie.series[0] as CircularChart3DSeries).points.length).toBe(7);
                expect(getElement(id + '-svg-0-region-series-0-point-0').getAttribute('opacity')).toBe('0.2');
                done();
            };
            pie.series[0].dataSource = remoteData;
            pie.series[0].xName = 'Id';
            pie.series[0].opacity = 0.2;
            pie.series[0].yName = 'Estimate';
            pie.title = '';
            pie.refresh();
        });
        it('Background image checking', (done: Function) => {
            pie.loaded = (args: CircularChart3DLoadedEventArgs) => {
                const background: HTMLElement = document.getElementById(id + '-background');
                expect(background.getAttribute('href') != null).toBe(true);
                done();
            };
            pie.backgroundImage = 'https://cdn.syncfusion.com/content/images/freetrials/essential-studio.png?v=03102019101652';
            pie.refresh();
        });
        it('checking after resize', (done: Function) => {
            pie.loaded = (args: CircularChart3DLoadedEventArgs) => {
                expect((pie.series[0] as CircularChart3DSeries).points.length).toBe(7);
                done();
            };
            Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 500 });
            Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 500 });
            window.dispatchEvent(new Event('resize'));
            setTimeout(function () {
                pie.refresh();
            }, 500);
        });
    });

    // it('memory leak', () => {
    //     profile.sample();
    //     const average: number = inMB(profile.averageChange);
    //     //Check average change in memory samples to not be over 10MB
    //     expect(average).toBeLessThan(10);
    //     const memory: number = inMB(getMemoryProfile());
    //     //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
    //     expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    // });

});

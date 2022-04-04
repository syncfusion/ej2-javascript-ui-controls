import { Schedule, TimelineViews, TimelineMonth, TimelineYear, ScheduleModel } from '../../../src/schedule/index';
import { timelineResourceData } from '../base/datasource.spec';
import { createSchedule, destroy, triggerScrollEvent, triggerMouseEvent } from '../util.spec';
import { profile, inMB, getMemoryProfile } from '../../common.spec';

/**
 * Schedule virtual scroll module
 */

Schedule.Inject(TimelineViews, TimelineMonth, TimelineYear);

describe('Virtual scroll', () => {
    beforeAll(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const isDef: (o: any) => boolean = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // eslint-disable-next-line no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this as any).skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Timeline view', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '550px', width: '100%', currentView: 'TimelineMonth',
                views: [
                    { option: 'TimelineDay' },
                    { option: 'TimelineWeek', allowVirtualScrolling: true },
                    { option: 'TimelineMonth', allowVirtualScrolling: true },
                    { option: 'TimelineYear', displayName: 'Vertical Year', orientation: 'Vertical', allowVirtualScrolling: true }
                ],
                group: { resources: ['Floors', 'Halls', 'Rooms', 'Owners'] },
                resources: [{
                    field: 'FId', title: 'Floor', name: 'Floors', allowMultiple: false,
                    dataSource: [
                        { FloorText: 'Floor 1', Id: 1, FloorColor: '#cb6bb2', Expand: false },
                        { FloorText: 'Floor 2', Id: 2, FloorColor: '#cb6bb2' }
                    ],
                    textField: 'FloorText', idField: 'Id', colorField: 'FloorColor', expandedField: 'Expand'
                }, {
                    field: 'HallId', title: 'Hall', name: 'Halls', allowMultiple: false,
                    dataSource: [
                        { HallText: 'Hall 1', Id: 1, HallGroupId: 1, HallColor: '#cb6bb2', Expand: false },
                        { HallText: 'Hall 2', Id: 2, HallGroupId: 2, HallColor: '#56ca85' },
                        { HallText: 'Hall 3', Id: 3, HallGroupId: 2, HallColor: '#56ca85' }
                    ],
                    textField: 'HallText', idField: 'Id', groupIDField: 'HallGroupId', colorField: 'HallColor', expandedField: 'Expand'
                }, {
                    field: 'RoomId', title: 'Room', name: 'Rooms', allowMultiple: false,
                    dataSource: [
                        { RoomText: 'ROOM 1', Id: 1, RoomGroupId: 1, RoomColor: '#cb6bb2', Expand: false },
                        { RoomText: 'ROOM 2', Id: 2, RoomGroupId: 2, RoomColor: '#56ca85' },
                        { RoomText: 'ROOM 3', Id: 3, RoomGroupId: 1, RoomColor: '#56ca85' },
                        { RoomText: 'ROOM 4', Id: 4, RoomGroupId: 2, RoomColor: '#56ca85' },
                        { RoomText: 'ROOM 5', Id: 5, RoomGroupId: 3, RoomColor: '#56ca85' }
                    ],
                    textField: 'RoomText', idField: 'Id', groupIDField: 'RoomGroupId', colorField: 'RoomColor', expandedField: 'Expand'
                }, {
                    field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { OwnerText: 'Nancy', Id: 1, OwnerGroupId: 1, OwnerColor: '#ffaa00', Expand: false },
                        { OwnerText: 'Steven', Id: 2, OwnerGroupId: 2, OwnerColor: '#f8a398', Expand: false },
                        { OwnerText: 'Michael', Id: 3, OwnerGroupId: 3, OwnerColor: '#7499e1', Expand: false },
                        { OwnerText: 'Oliver', Id: 4, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'John', Id: 5, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Barry', Id: 6, OwnerGroupId: 3, OwnerColor: '#7499e1' },
                        { OwnerText: 'Felicity', Id: 7, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Cisco', Id: 8, OwnerGroupId: 3, OwnerColor: '#f8a398' },
                        { OwnerText: 'Sara', Id: 9, OwnerGroupId: 2, OwnerColor: '#7499e1' },
                        { OwnerText: 'John', Id: 10, OwnerGroupId: 4, OwnerColor: '#f8a398' },
                        { OwnerText: 'Barry', Id: 11, OwnerGroupId: 4, OwnerColor: '#7499e1' },
                        { OwnerText: 'Felicity', Id: 12, OwnerGroupId: 4, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Cisco', Id: 13, OwnerGroupId: 4, OwnerColor: '#f8a398' },
                        { OwnerText: 'Sara', Id: 14, OwnerGroupId: 4, OwnerColor: '#7499e1' },
                        { OwnerText: 'Barry', Id: 15, OwnerGroupId: 5, OwnerColor: '#7499e1' },
                        { OwnerText: 'Felicity', Id: 16, OwnerGroupId: 5, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Cisco', Id: 17, OwnerGroupId: 5, OwnerColor: '#f8a398' },
                        { OwnerText: 'Sara', Id: 18, OwnerGroupId: 5, OwnerColor: '#7499e1' }
                    ],
                    textField: 'OwnerText', idField: 'Id', groupIDField: 'OwnerGroupId',
                    colorField: 'OwnerColor', expandedField: 'Expand'
                }],
                selectedDate: new Date(2018, 4, 1)
            };
            schObj = createSchedule(model, timelineResourceData, done);
        });
        afterAll(() => {
            destroy(schObj);
        });

        it('TimelineYear - view change', () => {
            const viewElement: HTMLElement = schObj.element.querySelector('.e-toolbar-item.e-timeline-year');
            viewElement.click();
            expect(schObj.resourceBase.expandedResources.length).toEqual(19);
            expect(schObj.resourceBase.renderedResources.length).toEqual(11);
            const currentView: HTMLElement = schObj.element.querySelector('.e-toolbar-item.e-active-view');
            expect(currentView.classList.contains('e-timeline-year')).toEqual(true);
        });
        it('TimelineYear view- checking element after view change', () => {
            expect(schObj.resourceBase.expandedResources.length).toEqual(19);
            expect(schObj.resourceBase.lastResourceLevel.length).toEqual(28);
            expect(schObj.element.querySelector('.e-virtual-track').clientHeight).toEqual(
                schObj.resourceBase.expandedResources.length * 75);
            const resWrap: HTMLElement = schObj.element.querySelector('.e-resource-column-wrap table') as HTMLElement;
            expect(resWrap.querySelector('td').getAttribute('data-group-index')).toEqual('0');
            expect(resWrap.querySelector('div').classList).toContain('e-resource-expand');
            expect(resWrap.querySelector('div:nth-child(2)').innerHTML).toContain('Floor 1');
            expect(resWrap.querySelector('tr:nth-child(2)').children[0].children[1].innerHTML).toEqual('Floor 2');
        });
        it('TimelineYear view - checking elements with rowAutoHeight property', (done: DoneFn) => {
            schObj.dataBound = () => {
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(7);
                const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
                expect(moreIndicatorList.length).toEqual(0);
                done();
            };
            schObj.rowAutoHeight = true;
            schObj.dataBind();
        });
        it('TimelineYear view - checking elements without rowAutoHeight property', (done: DoneFn) => {
            schObj.dataBound = () => {
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(5);
                const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
                expect(moreIndicatorList.length).toEqual(1);
                done();
            };
            schObj.rowAutoHeight = false;
            schObj.dataBind();
        });
        it('Timeline Year View - update content on scroll', () => {
            const contentArea: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
            const resWrap: HTMLElement = schObj.element.querySelector('.e-resource-column-wrap table') as HTMLElement;
            triggerScrollEvent(contentArea, 300);
            expect(contentArea.scrollTop).toEqual(300);
            expect(schObj.resourceBase.renderedResources.length).toEqual(11);
            expect(schObj.resourceBase.renderedResources[0].groupIndex).toEqual(13);
            expect(schObj.resourceBase.renderedResources[0].resourceData.OwnerText).toEqual('Steven');
            expect(schObj.resourceBase.renderedResources[10].groupIndex).toEqual(23);
            expect(schObj.resourceBase.renderedResources[10].resourceData.RoomText).toEqual('ROOM 5');
            const contentTable: HTMLElement = contentArea.querySelector('table') as HTMLElement;
            expect(contentTable.querySelectorAll('tr').length).toEqual(11);
            expect(contentTable.querySelector('tbody tr td').getAttribute('data-group-index')).
                toEqual(resWrap.querySelector('tbody td').getAttribute('data-group-index'));
            expect(contentTable.style.transform).toEqual(resWrap.style.transform);
            expect(resWrap.querySelector('tr td').getAttribute('data-group-index')).toEqual('13');
            expect(resWrap.querySelector('div').innerText).toEqual('Steven');
            expect(resWrap.querySelector('div').style.marginLeft).toEqual('75px');
            const lastResource: HTMLElement = resWrap.querySelector('tr:nth-child(11) td');
            expect(parseInt(lastResource.getAttribute('data-group-index'), 10)).toEqual(
                schObj.resourceBase.expandedResources[14].groupIndex);
            expect((lastResource.querySelector('.e-resource-text') as HTMLElement).innerText).toEqual('ROOM 5');
            expect(schObj.resourceBase.renderedResources[10].groupIndex).toEqual(
                schObj.resourceBase.expandedResources[14].groupIndex);
            const eventWrap: HTMLElement = schObj.element.querySelector('.e-event-table') as HTMLElement;
            expect(eventWrap.style.transform).toEqual(contentTable.style.transform);
            expect(eventWrap.children.length).toEqual(11);
        });
        it('TimelineMonth - view change', (done: DoneFn) => {
            schObj.dataBound = () => done();
            const viewElement: HTMLElement = schObj.element.querySelector('.e-toolbar-item.e-timeline-month');
            viewElement.click();
            expect(schObj.resourceBase.expandedResources.length).toEqual(19);
            expect(schObj.resourceBase.renderedResources.length).toEqual(13);
            const currentView: HTMLElement = schObj.element.querySelector('.e-toolbar-item.e-active-view');
            expect(currentView.classList.contains('e-timeline-month')).toEqual(true);
            schObj.dataBind();
        });
        it('checking initial resource count', () => {
            const resourceRow: HTMLElement = schObj.element.querySelector('.e-resource-column-wrap tbody') as HTMLElement;
            expect(resourceRow.children.length).toEqual(13);
            const contentRow: HTMLElement = schObj.element.querySelector('.e-content-wrap tbody') as HTMLElement;
            expect(contentRow.children.length).toEqual(13);
            const eventRow: HTMLElement = schObj.element.querySelector('.e-event-table') as HTMLElement;
            expect(eventRow.children.length).toEqual(13);
            expect(schObj.resourceBase.expandedResources.length).toEqual(19);
            expect(schObj.resourceBase.renderedResources.length).toEqual(13);
            expect(schObj.resourceBase.lastResourceLevel.length).toEqual(28);
        });

        it('checking initial rendering', () => {
            const resWrap: HTMLElement = schObj.element.querySelector('.e-resource-column-wrap') as HTMLElement;
            const contentWrap: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
            const eventWrap: HTMLElement = schObj.element.querySelector('.e-event-table') as HTMLElement;
            expect(resWrap.scrollHeight).toEqual(780);
            const resData: HTMLTableRowElement = resWrap.querySelector('table tr td') as HTMLTableRowElement;
            expect(resData.classList).toContain('e-parent-node');
            expect(resData.children[0].classList).toContain('e-resource-expand');
            expect(resData.querySelector('.e-resource-text').innerHTML).toEqual('Floor 1');
            const resData1: HTMLElement = resWrap.querySelector('table tr:nth-child(2)') as HTMLElement;
            expect(resData1.querySelector('td').getAttribute('data-group-index')).toEqual('10');
            expect(resData1.querySelector('td').classList).toContain('e-parent-node');
            expect(resData1.querySelector('div').classList).toContain('e-resource-collapse');
            expect(resData1.querySelector('div').classList.length).toEqual(2);
            expect(resData1.querySelector('div:nth-child(2)').classList).toContain('e-resource-text');
            expect(resData1.querySelector('div:nth-child(2)').classList.length).toEqual(1);
            expect(resData1.querySelector('div:nth-child(2)').innerHTML).toEqual('Floor 2');
            const resData2: HTMLElement = resWrap.querySelector('table tr:nth-child(3) td') as HTMLElement;
            expect(resData2.classList.length).toEqual(2);
            expect(resData2.querySelector('div').classList.length).toEqual(2);
            expect(resData2.querySelector('div').classList).toContain('e-resource-collapse');
            expect(resData2.querySelector('div').getAttribute('style')).toEqual('margin-left: 25px;');
            expect(eventWrap.children[0].getAttribute('data-group-index')).toEqual('0');
            expect(eventWrap.children[1].getAttribute('data-group-index')).toEqual('10');
            expect(eventWrap.children[12].getAttribute('data-group-index')).toEqual('21');
            const event: HTMLElement = eventWrap.querySelector('.e-appointment') as HTMLElement;
            expect(event.offsetTop).toEqual(242);
            expect(event.getAttribute('data-group-index')).
                toEqual(resWrap.querySelectorAll('tbody tr:nth-child(5) td')[0].getAttribute('data-group-index'));
            expect(contentWrap.scrollHeight).toEqual(schObj.resourceBase.expandedResources.length * 60);
        });
        it('checking virtual table', () => {
            const resourceTD: HTMLElement = schObj.element.querySelector('.e-resource-column-wrap td') as HTMLElement;
            const virtualTable: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-virtual-track'));
            expect(virtualTable.length).toEqual(1);
            expect(parseInt(virtualTable[0].style.height, 10))
                .toEqual((resourceTD.offsetHeight * schObj.resourceBase.expandedResources.length));
        });
        it('update content on down scroll', () => {
            const contentArea: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
            const resWrap: HTMLElement = schObj.element.querySelector('.e-resource-column-wrap table') as HTMLElement;
            triggerScrollEvent(contentArea, 300);
            expect(contentArea.scrollTop).toEqual(300);
            expect(schObj.resourceBase.renderedResources.length).toEqual(13);
            expect(schObj.resourceBase.renderedResources[0].groupIndex).toEqual(14);
            expect(schObj.resourceBase.renderedResources[0].resourceData.OwnerText).toEqual('John');
            expect(schObj.resourceBase.renderedResources[12].groupIndex).toEqual(26);
            expect(schObj.resourceBase.renderedResources[12].resourceData.OwnerText).toEqual('Cisco');
            const contentTable: HTMLElement = contentArea.querySelector('table') as HTMLElement;
            expect(contentTable.querySelectorAll('tr').length).toEqual(13);
            expect(contentTable.querySelector('tbody tr td').getAttribute('data-group-index')).
                toEqual(resWrap.querySelector('tbody td').getAttribute('data-group-index'));
            expect(contentTable.style.transform).toEqual(resWrap.style.transform);
            expect(resWrap.querySelector('tr td').getAttribute('data-group-index')).toEqual('14');
            expect(resWrap.querySelector('div').innerText).toEqual('John');
            expect(resWrap.querySelector('div').style.marginLeft).toEqual('75px');
            const lastResource: HTMLElement = resWrap.querySelector('tr:nth-child(13) td');
            expect(parseInt(lastResource.getAttribute('data-group-index'), 10)).toEqual(
                schObj.resourceBase.expandedResources[17].groupIndex);
            expect(lastResource.querySelector('div').innerText).toEqual('Cisco');
            expect(schObj.resourceBase.renderedResources[12].groupIndex).toEqual(
                schObj.resourceBase.expandedResources[17].groupIndex);
            const eventWrap: HTMLElement = schObj.element.querySelector('.e-event-table') as HTMLElement;
            expect(eventWrap.style.transform).toEqual(contentTable.style.transform);
            expect(eventWrap.children.length).toEqual(13);
            triggerScrollEvent(contentArea, 1000);
        });
        it('before upscrolling', () => {
            expect(schObj.resourceBase.renderedResources.length).toEqual(13);
            expect(schObj.resourceBase.renderedResources[0].groupIndex).toEqual(15);
            expect(schObj.resourceBase.renderedResources[0].resourceData.OwnerText).toEqual('Sara');
            expect(schObj.resourceBase.renderedResources[12].groupIndex).toEqual(27);
            expect(schObj.resourceBase.renderedResources[12].resourceData.OwnerText).toEqual('Sara');
        });
        it('update content on upscroll', () => {
            const contentArea: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
            triggerScrollEvent(contentArea, 400);
            expect(schObj.resourceBase.renderedResources.length).toEqual(13);
            expect(schObj.resourceBase.renderedResources[0].groupIndex).toEqual(10);
            expect(schObj.resourceBase.renderedResources[0].resourceData.ClassName).toEqual('e-parent-node');
            expect(schObj.resourceBase.renderedResources[12].groupIndex).toEqual(22);
            const resWrap: HTMLElement = schObj.element.querySelector('.e-resource-column-wrap table') as HTMLElement;
            expect(resWrap.style.transform).toEqual('translateY(220px)');
            expect(resWrap.querySelector('td').getAttribute('data-group-index')).toEqual('10');
            expect(resWrap.querySelector('div').classList).toContain('e-resource-collapse');
            expect(resWrap.querySelector('div:nth-child(2)').innerHTML).toEqual('Floor 2');
            const eventWrap: HTMLElement = schObj.element.querySelector('.e-event-table') as HTMLElement;
            expect(eventWrap.style.transform).toEqual(resWrap.style.transform);
        });

        it('resource icon click testing', () => {
            const contentArea: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
            triggerScrollEvent(contentArea, 2000);
            triggerScrollEvent(contentArea, 2000);
            const resourceRow: HTMLElement = schObj.element.querySelector('.e-resource-column-wrap tbody') as HTMLElement;
            const resource: HTMLElement = resourceRow.children[7]
                .querySelector('.e-resource-cells div.e-resource-tree-icon') as HTMLElement;
            expect(resource.classList).toContain('e-resource-collapse');
            expect(resource.classList.length).toEqual(2);
            expect(schObj.resourceBase.lastResourceLevel[22].resourceData.Expand).toBeUndefined();
            expect(schObj.resourceBase.expandedResources[13].resourceData.Expand).toBeUndefined();
            resource.click();
            expect(schObj.resourceBase.lastResourceLevel[22].resourceData.Expand).toBeFalsy();
            expect(schObj.resourceBase.expandedResources[13].resourceData.Expand).toBeFalsy();
            expect(schObj.resourceBase.renderedResources[0].resourceData.Expand).toBeUndefined();
            expect(schObj.resourceBase.expandedResources.length).toEqual(14);
            expect(resource.classList).toContain('e-resource-expand');
            const firstRow: HTMLElement = resourceRow.querySelector('tr td') as HTMLElement;
            const lastRow: HTMLElement = resourceRow.querySelector('tr:nth-child(13) td') as HTMLElement;
            expect(firstRow.classList).toContain('e-parent-node');
            expect(firstRow.getAttribute('data-group-index')).toEqual('10');
            expect(firstRow.querySelector('div:nth-child(2)').getAttribute('style')).toEqual('margin-left: 0px;');
            expect(lastRow.getAttribute('data-group-index')).toEqual('22');
            expect(lastRow.children.length).toEqual(2);
            expect(lastRow.querySelector('div').classList).toContain('e-resource-expand');
            expect(lastRow.querySelector('div').classList.length).toEqual(2);
            expect(lastRow.querySelector('div:nth-child(2)').getAttribute('style')).toEqual('margin-left: 25px;');
        });

        it('quick cell popup testing', () => {
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            workCells[310].click();
            const quickPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(quickPopup.offsetTop).toBeGreaterThan(0);
            expect(quickPopup.classList.contains('e-popup-open')).toEqual(true);
            expect(quickPopup.classList.contains('e-popup-close')).toEqual(false);
            expect(quickPopup.querySelector('.e-resource-details').innerHTML).toEqual('Cisco');
            triggerMouseEvent(quickPopup.querySelector('.e-close'), 'click');
        });

        it('checking content without scroller', () => {
            const contentArea: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
            triggerScrollEvent(contentArea, 0);
            const resourceRow: HTMLElement = schObj.element.querySelector('.e-resource-column-wrap tbody') as HTMLElement;
            const resource: HTMLElement = resourceRow.children[7]
                .querySelector('.e-resource-cells div.e-resource-tree-icon') as HTMLElement;
            resource.click();
            const virtualTable: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-virtual-track'));
            expect(parseInt(virtualTable[0].style.height, 10)).toEqual(contentArea.clientHeight);
            const resource1: HTMLElement = resourceRow.children[1]
                .querySelector('.e-resource-cells div.e-resource-tree-icon') as HTMLElement;
            resource1.click();
            expect(parseInt(virtualTable[0].style.height, 10)).toEqual(contentArea.clientHeight);
        });
        it('view change', () => {
            const viewElement: HTMLElement = schObj.element.querySelector('.e-toolbar-item.e-timeline-week');
            viewElement.click();
            expect(schObj.resourceBase.expandedResources.length).toEqual(2);
            const currentView: HTMLElement = schObj.element.querySelector('.e-toolbar-item.e-active-view');
            expect(currentView.classList.contains('e-timeline-week')).toEqual(true);
        });
        it('checking element after view change', () => {
            expect(schObj.resourceBase.expandedResources.length).toEqual(2);
            expect(schObj.resourceBase.expandedResources.length).toEqual(2);
            expect(schObj.resourceBase.lastResourceLevel.length).toEqual(28);
            expect(schObj.element.querySelector('.e-virtual-track').clientHeight).toEqual(
                schObj.resourceBase.expandedResources.length * 60);
            const resWrap: HTMLElement = schObj.element.querySelector('.e-resource-column-wrap table') as HTMLElement;
            expect(resWrap.querySelector('td').getAttribute('data-group-index')).toEqual('0');
            expect(resWrap.querySelector('div').classList).toContain('e-resource-expand');
            expect(resWrap.querySelector('div:nth-child(2)').innerHTML).toContain('Floor 1');
            expect(resWrap.querySelector('tr:nth-child(2)').children[0].children[1].innerHTML).toEqual('Floor 2');
        });

        it('current time indicator checking', () => {
            const viewElement: HTMLElement = schObj.element.querySelector('.e-toolbar-item.e-today');
            viewElement.click();
            const resourceRow: HTMLElement = schObj.element.querySelector('.e-resource-column-wrap tbody') as HTMLElement;
            const resource1: HTMLElement = resourceRow.children[1]
                .querySelector('.e-resource-cells div.e-resource-tree-icon') as HTMLElement;
            resource1.click();
            const resource2: HTMLElement = resourceRow.children[0]
                .querySelector('.e-resource-cells div.e-resource-tree-icon') as HTMLElement;
            resource2.click();
            const resource3: HTMLElement = resourceRow.children[1]
                .querySelector('.e-resource-cells div.e-resource-tree-icon') as HTMLElement;
            resource3.click();
            const contentArea: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
            triggerScrollEvent(contentArea, 300);
            const indicator: HTMLElement = schObj.element.querySelector('.e-resource-column-wrap table') as HTMLElement;
            expect(indicator.style.transform).toEqual('translateY(300px)');
        });
        it('checking elements with rowAutoHeight property', (done: DoneFn) => {
            const viewElement: HTMLElement = schObj.element.querySelector('.e-toolbar-item.e-timeline-month');
            viewElement.click();
            schObj.dataBound = () => {
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(5);
                const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
                expect(eventWrapperList.length).toEqual(2);
                const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
                expect(moreIndicatorList.length).toEqual(0);
                done();
            };
            schObj.selectedDate = new Date(2018, 4, 1);
            schObj.rowAutoHeight = true;
            schObj.dataBind();
        });
        it('scroll checking with rowAutoHeight property', () => {
            const contentArea: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
            triggerScrollEvent(contentArea, 400);
            expect(schObj.resourceBase.renderedResources.length).toEqual(13);
            expect(schObj.resourceBase.renderedResources[0].groupIndex).toEqual(2);
            expect(schObj.resourceBase.renderedResources[0].resourceData.RoomText).toEqual('ROOM 1');
            expect(schObj.resourceBase.renderedResources[12].groupIndex).toEqual(22);
            expect(schObj.resourceBase.renderedResources[12].resourceData.HallText).toEqual('Hall 3');
            triggerScrollEvent(contentArea, 1000);
            const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(0);
            triggerScrollEvent(contentArea, 0);
            expect(schObj.resourceBase.renderedResources[0].groupIndex).toEqual(0);
            expect(moreIndicatorList.length).toEqual(0);
        });
        it('checking more indicator rowAutoHeight false', (done: DoneFn) => {
            schObj.dataBound = () => {
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(3);
                const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
                expect(eventWrapperList.length).toEqual(2);
                const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
                expect(moreIndicatorList.length).toEqual(4);
                done();
            };
            schObj.rowAutoHeight = false;
            schObj.dataBind();
        });
    });

    it('memory leak', () => {
        profile.sample();
        const average: number = inMB(profile.averageChange);
        expect(average).toBeLessThan(10);
        const memory: number = inMB(getMemoryProfile());
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});

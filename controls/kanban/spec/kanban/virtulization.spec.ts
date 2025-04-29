/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Kanban base spec
 */
import { Browser, createElement, remove } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { Kanban, KanbanModel, ColumnsModel, CardClickEventArgs, ActionEventArgs } from '../../src/kanban/index';
import { generateKanbanDataVirtualScroll, generateKanbanDataVirtualScrollLessData, kanbanData, generateKanbanData } from './common/kanban-data.spec';
import * as util from './common/util.spec';

Kanban.Inject();


const virtualKanbanData: any[] = generateKanbanDataVirtualScroll();
const virtualKanbanOptions: KanbanModel = {
    dataSource: generateKanbanDataVirtualScroll(),
    keyField: 'Status',
    columns: [
        { headerText: 'Backlog', keyField: 'Open'},
        { headerText: 'In Progress', keyField: 'InProgress'},
        { headerText: 'Review', keyField: 'Review' },
        { headerText: 'Testing', keyField: 'Testing'},
        { headerText: 'Done', keyField: 'Close'}
    ],
    height: '800px',
    cardHeight: '120px',
    enableVirtualization: true,
    cardSettings: {
        contentField: 'Summary',
        headerField: 'Id'
    }
};

function getColumnDataCount(resultData: Record <string, any>[], kanbanObj: any): void {
    // Filter the data and set up a count for the keyfield.
    const keyField: string = kanbanObj.keyField;
    const keyFieldArray: string[] = [];
    // Prepare the keyfield list
    for (let i: number = 0; i < resultData.length; i++) {
        const data: Record<string, any> = resultData[i as number];
        if (data[keyField as string] && keyFieldArray.indexOf(data[keyField as string]) === -1) {
            keyFieldArray.push(data[keyField as string]);
        }
    }
    // Count the each key field value from the result data
    for (let i: number = 0; i < keyFieldArray.length; i++) {
        const result: Record<string, any>[] = new DataManager(resultData).executeLocal(
            new Query().where(keyField, 'equal', keyFieldArray[i as number]));
        kanbanObj.columnDataCount[keyFieldArray[i as number] ] = result.length;
    }
}

describe('Kanban Virtual Scroll Feature', () => {
    beforeAll(() => {
        const isDef: (o: any) => boolean = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // eslint-disable-next-line no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            (this as any).skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('Basic Layout Rendering of Kanban Virtual Scroll', () => {
        let kanbanObj: Kanban;
        beforeAll(() => {
            const element: HTMLElement = createElement('div', { id: 'Kanban' });
            document.body.appendChild(element);
            // eslint-disable-next-line no-console
            const defaultOptions: KanbanModel = {
                dataSource: generateKanbanDataVirtualScroll(),
                keyField: 'Status',
                columns: [
                    { headerText: 'Backlog', keyField: 'Open'},
                    { headerText: 'In Progress', keyField: 'InProgress'},
                    { headerText: 'Review', keyField: 'Review' },
                    { headerText: 'Testing', keyField: 'Testing'},
                    { headerText: 'Done', keyField: 'Close'}
                ],
                height: '800px',
                cardHeight: '120px',
                enableVirtualization: true,
                cardSettings: {
                    contentField: 'Summary',
                    headerField: 'Id'
                }
            };
            kanbanObj = new Kanban(defaultOptions);
            kanbanObj.appendTo(element);
        });

        it('Kanban virtual element rendering testing', (done: Function) => {
            setTimeout(() => {
                expect(kanbanObj.element.querySelector('.e-kanban-content')).not.toBeNull();
                expect(kanbanObj.element.querySelector('.e-kanban-content').querySelectorAll('.e-card-wrapper')).not.toBeNull();
                const cardWrappers: NodeListOf<Element> = kanbanObj.element.querySelector('.e-kanban-content').querySelectorAll('.e-card-wrapper')
                for (let i: number = 0; i < cardWrappers.length; i++) {
                    expect(cardWrappers[i].children[0].classList.contains('e-card-virtual-wrapper')).toBe(true);
                }
                done();
            }, 500);
        });

        it('Scrolling down testing of the first column', (done: Function) => {
            setTimeout(() => {
                const cardWrapper: HTMLElement = kanbanObj.element.querySelector('.e-kanban-content').querySelector('.e-content-cells').querySelector('.e-card-wrapper');
                expect(cardWrapper.querySelector('.e-card-virtual-wrapper').children[0].getAttribute('data-id')).toBe('1');
                util.triggerScrollEvent(cardWrapper, 900);
                setTimeout(() => {
                    expect(cardWrapper.querySelector('.e-card-virtual-wrapper').children[0].getAttribute('data-id')).not.toBe('1');
                    done();
                }, 2500);
            }, 500);
        });

        it('- Dragging the card from the first column (to drop on same column) - ', (done: Function) => {
            let key: string;
            let dragElement: HTMLElement;
            setTimeout(() => {
                dragElement = (kanbanObj.element.querySelectorAll('.e-card[data-id="7"]') as NodeListOf<Element>).item(0) as HTMLElement;
                key = dragElement.getAttribute('data-key');
                util.triggerMouseEvent(dragElement, 'mousedown');
                util.triggerMouseEvent(dragElement, 'mousemove', 100, 100);
                expect(key).toEqual('Open');
                expect(dragElement.closest('.e-content-cells').classList.contains('e-dragged-column')).toBe(true);
                done();
            }, 1000);
        });

        it(' - Dropping the dragged card in the same column - ', (done: Function) => {
            setTimeout(() => {
                const element: Element = kanbanObj.element.querySelectorAll('.e-card[data-id="8"]').item(0);
                util.triggerMouseEvent(element, 'mousemove', 250, 500);
                util.triggerMouseEvent(element, 'mouseup', 250, 500);
                const droppedElem: HTMLElement = (kanbanObj.element.querySelectorAll('.e-card[data-id="7"]') as NodeListOf<Element>).item(0) as HTMLElement;
                expect(droppedElem.previousElementSibling.getAttribute('data-id')).toEqual('8');
                done();
            }, 1000);
        });

        it('- Dragging the card from the first column (to drop on another column) - ', (done: Function) => {
            let key: string;
            let dragElement: HTMLElement;
            setTimeout(() => {
                dragElement = (kanbanObj.element.querySelectorAll('.e-card[data-id="8"]') as NodeListOf<Element>).item(0) as HTMLElement;
                key = dragElement.getAttribute('data-key');
                util.triggerMouseEvent(dragElement, 'mousedown');
                util.triggerMouseEvent(dragElement, 'mousemove', 100, 100);
                expect(key).toEqual('Open');
                expect(dragElement.closest('.e-content-cells').classList.contains('e-dragged-column')).toBe(true);
                done();
            }, 1000);
        });

        it(' - Dropping the dragged card in the another column - ', (done: Function) => {
            setTimeout(() => {
                const element: Element = kanbanObj.element.querySelectorAll('.e-card[data-id="201"]').item(0);
                util.triggerMouseEvent(element, 'mousemove', 250, 500);
                util.triggerMouseEvent(element, 'mouseup', 250, 500);
                const droppedElem: HTMLElement = (kanbanObj.element.querySelectorAll('.e-card[data-id="8"]') as NodeListOf<Element>).item(0) as HTMLElement;
                expect(droppedElem.previousElementSibling.getAttribute('data-id')).toEqual('201');
                done();
            }, 1000);
        });


        it('Scrolling down testing of the second column after drag and drop', (done: Function) => {
            setTimeout(() => {
                const cardWrapper: HTMLElement = kanbanObj.element.querySelector('.e-kanban-content').querySelectorAll('.e-content-cells')[1].querySelector('.e-card-wrapper');
                expect(cardWrapper.querySelector('.e-card-virtual-wrapper').children[0].getAttribute('data-id')).toBe('201');
                util.triggerScrollEvent(cardWrapper, 2000);
                setTimeout(() => {
                    expect(cardWrapper.querySelector('.e-card-virtual-wrapper').children[0].getAttribute('data-id')).not.toBe('201');
                    done();
                }, 2500);
            }, 500);
        });


        it('Scrolling up testing of the second column after scroll down', (done: Function) => {
            setTimeout(() => {
                const cardWrapper: HTMLElement = kanbanObj.element.querySelector('.e-kanban-content').querySelectorAll('.e-content-cells')[1].querySelector('.e-card-wrapper');
                util.triggerScrollEvent(cardWrapper, 0);
                setTimeout(() => {
                    expect(cardWrapper.querySelector('.e-card-virtual-wrapper').children[0].getAttribute('data-id')).toBe('8');
                    done();
                }, 2500);
            }, 500);
        });

        afterAll(() => {
            kanbanObj.destroy();
            remove(document.getElementById(kanbanObj.element.id));
        });
    });

    describe('838077 - Kanban Virtual Scroll with less data', () => {
        let kanbanObj: Kanban;
        beforeAll(() => {
            const element: HTMLElement = createElement('div', { id: 'Kanban' });
            document.body.appendChild(element);
            // eslint-disable-next-line no-console
            const defaultOptions: KanbanModel = {
                dataSource: generateKanbanDataVirtualScrollLessData(),
                keyField: 'Status',
                columns: [
                    { headerText: 'Backlog', keyField: 'Open'},
                    { headerText: 'In Progress', keyField: 'InProgress'},
                    { headerText: 'Review', keyField: 'Review' },
                    { headerText: 'Testing', keyField: 'Testing'},
                    { headerText: 'Done', keyField: 'Close'}
                ],
                height: '800px',
                cardHeight: '120px',
                enableVirtualization: true,
                cardSettings: {
                    contentField: 'Summary',
                    headerField: 'Id'
                }
            };
            kanbanObj = new Kanban(defaultOptions);
            kanbanObj.appendTo(element);
        });

        it('Kanban virtual element rendering testing', (done: Function) => {
            setTimeout(() => {
                expect(kanbanObj.element.querySelector('.e-kanban-content')).not.toBeNull();
                expect(kanbanObj.element.querySelector('.e-kanban-content').querySelectorAll('.e-card-wrapper')).not.toBeNull();
                const cardWrappers: NodeListOf<Element> = kanbanObj.element.querySelector('.e-kanban-content').querySelectorAll('.e-card-wrapper')
                for (let i: number = 0; i < cardWrappers.length; i++) {
                    expect(cardWrappers[i].children[0].classList.contains('e-card-virtual-wrapper')).toBe(true);
                }
                done();
            }, 500);
        });

        it('- Dragging the card from the first column (to drop on another column) - ', (done: Function) => {
            let key: string;
            let dragElement: HTMLElement;
            setTimeout(() => {
                dragElement = (kanbanObj.element.querySelectorAll('.e-card[data-id="3"]') as NodeListOf<Element>).item(0) as HTMLElement;
                key = dragElement.getAttribute('data-key');
                util.triggerMouseEvent(dragElement, 'mousedown');
                util.triggerMouseEvent(dragElement, 'mousemove', 100, 100);
                expect(key).toEqual('Open');
                expect(dragElement.closest('.e-content-cells').classList.contains('e-dragged-column')).toBe(true);
                done();
            }, 1000);
        });

        it(' - Dropping the dragged card in the another column - ', (done: Function) => {
            setTimeout(() => {
                const element: Element = kanbanObj.element.querySelectorAll('.e-card[data-id="5"]').item(0);
                util.triggerMouseEvent(element, 'mousemove', 250, 500);
                util.triggerMouseEvent(element, 'mouseup', 250, 500);
                const droppedElem: HTMLElement = (kanbanObj.element.querySelectorAll('.e-card[data-id="3"]') as NodeListOf<Element>).item(0) as HTMLElement;
                expect(droppedElem.previousElementSibling.getAttribute('data-id')).toEqual('5');
                done();
            }, 1000);
        });

        afterAll(() => {
            kanbanObj.destroy();
            remove(document.getElementById(kanbanObj.element.id));
        });
    });

    describe('Bug 826595: Card drag and drop does not work after Virtual Scoll', () => {
        let kanbanObj: Kanban;
        beforeAll((done: Function) => {
            const rootElement: HTMLElement = createElement('div', { id: 'Kanban_Bug_826595' });
            document.body.appendChild(rootElement);
            // eslint-disable-next-line no-console
            const defaultOptions: KanbanModel = {
                dataSource: generateKanbanDataVirtualScroll(),
                keyField: 'Status',
                columns: [
                    { headerText: 'Backlog', keyField: 'Open'},
                    { headerText: 'In Progress', keyField: 'InProgress'},
                    { headerText: 'Review', keyField: 'Review' },
                    { headerText: 'Testing', keyField: 'Testing'},
                    { headerText: 'Done', keyField: 'Close'}
                ],
                height: '800px',
                cardHeight: '120px',
                enableVirtualization: true,
                cardSettings: {
                    contentField: 'Summary',
                    headerField: 'Id'
                }
            };
            kanbanObj = new Kanban(defaultOptions);
            kanbanObj.appendTo('#'+rootElement.id);
            setTimeout(done, 1000);
        });

        it(' - Dragging the card from the first column (to drop on another column) - checking the max height, paddingTop, paddingBottom - ', (done: Function) => {
            let key: string;
            let dragElement: HTMLElement;
            setTimeout(() => {
                const virtualWrappers : NodeList = kanbanObj.element.querySelectorAll('.e-card-virtual-wrapper');
                for (let i = 0; i < virtualWrappers.length; i++) {
                    const wrapper: HTMLElement = virtualWrappers[i] as HTMLElement;
                    expect(wrapper.style.maxHeight).toEqual('25600px');
                    expect(wrapper.style.paddingTop).toEqual('0px');
                    expect(wrapper.style.paddingBottom).toEqual('25600px');
                }
                dragElement = (kanbanObj.element.querySelectorAll('.e-card[data-id="8"]') as NodeListOf<Element>).item(0) as HTMLElement;
                key = dragElement.getAttribute('data-key');
                util.triggerMouseEvent(dragElement, 'mousedown');
                util.triggerMouseEvent(dragElement, 'mousemove', 100, 100);
                done();
            }, 1000);
        });

        it(' - Dropping the dragged card in the another column - checking the max height, paddingTop, paddingBottom- ', (done: Function) => {
            setTimeout(() => {
                const element: Element = kanbanObj.element.querySelectorAll('.e-card[data-id="201"]').item(0);
                util.triggerMouseEvent(element, 'mousemove', 250, 500);
                util.triggerMouseEvent(element, 'mouseup', 250, 500);
                const virtualWrappers : NodeList = kanbanObj.element.querySelectorAll('.e-card-virtual-wrapper');
                expect((virtualWrappers[0] as HTMLElement).style.maxHeight).toEqual('25472px');
                expect((virtualWrappers[1] as HTMLElement).style.maxHeight).toEqual('25728px');
                for (let i = 2; i < virtualWrappers.length; i++) {
                    const wrapper: HTMLElement = virtualWrappers[i] as HTMLElement;
                    expect(wrapper.style.maxHeight).toEqual('25600px');
                    expect(wrapper.style.paddingTop).toEqual('0px');
                    expect(wrapper.style.paddingBottom).toEqual('25600px');
                }
                done();
            }, 1000);
        });

        afterAll(() => {
            kanbanObj.destroy();
            remove(document.getElementById(kanbanObj.element.id));
        });
    });

    describe('Bug 827152: Unable to add new card', () => {
        let kanbanObj: Kanban;
        let rootElement: HTMLElement;
        let btnElement: HTMLElement;
        let count: number = 2000;
        beforeAll((done: Function) => {
            rootElement = createElement('div', { id: 'Kanban_Bug_826595' });
            btnElement = createElement('button', { id: 'addNewCard' , className: 'e-btn' });
            document.body.appendChild(btnElement);
            document.body.appendChild(rootElement);
            const defaultOptions: KanbanModel = {
                dataSource: generateKanbanDataVirtualScroll(),
                keyField: 'Status',
                columns: [
                    { headerText: 'Backlog', keyField: 'Open'},
                    { headerText: 'In Progress', keyField: 'InProgress'},
                    { headerText: 'Review', keyField: 'Review' },
                    { headerText: 'Testing', keyField: 'Testing'},
                    { headerText: 'Done', keyField: 'Close'}
                ],
                height: '800px',
                cardHeight: '120px',
                enableVirtualization: true,
                cardSettings: {
                    contentField: 'Summary',
                    headerField: 'Id'
                },
                sortSettings: {
                    sortBy: 'DataSourceOrder',
                    direction: 'Descending'
                },
            };
            kanbanObj = new Kanban(defaultOptions);
            kanbanObj.appendTo('#'+rootElement.id);
            document.getElementById('addNewCard').onclick = (e: Event) => {
                let curData: Object = {
                    Id: count, Status: 'Open', Assignee: 'Alice', Summary: 'Newly Added Card Summary' + count
                };
                kanbanObj.openDialog('Add', curData);
                count++;
            };
            setTimeout(done, 1000);
        });

        it('Click the add card btn and and ', (done: Function) => {
            const addCardBtn: HTMLElement = document.getElementById('addNewCard');
            addCardBtn.click();
            setTimeout(() => {
                const saveBtn: HTMLElement = document.querySelector('.e-dialog-add');
                saveBtn.click();
            }, 100);
            setTimeout(() => {
                const card: HTMLElement = document.querySelector('.e-card[data-id="2000"]');
                expect(card).toBeTruthy();
                done();
            }, 500);
        });
        
        afterAll(() => {
            (kanbanObj.virtualLayoutModule as any).windowResize();
            kanbanObj.virtualLayoutModule.parent.height = 'auto';
            (kanbanObj.virtualLayoutModule as any).windowResize();
            kanbanObj.virtualLayoutModule.removeCard({ "Id": "Task 3343" });
            kanbanObj.destroy();
            remove(document.getElementById(kanbanObj.element.id));
            remove(document.getElementById(btnElement.id));
        });
    });

    describe('Bug 827947: Total card value not updated on the while column is on collapse state', () => {
        let kanbanObj: Kanban;
        let rootElement: HTMLElement;
        let btnElement: HTMLElement;
        let count: number = 2000;
        beforeAll((done: Function) => {
            rootElement = createElement('div', { id: 'Kanban_Bug_826595' });
            btnElement = createElement('button', { id: 'addNewCard' , className: 'e-btn' });
            document.body.appendChild(btnElement);
            document.body.appendChild(rootElement);
            const defaultOptions: KanbanModel = {
                dataSource: generateKanbanDataVirtualScroll(),
                keyField: 'Status',
                columns: [
                    { headerText: 'Backlog', keyField: 'Open', allowToggle: true },
                    { headerText: 'In Progress', keyField: 'InProgress', allowToggle: true, isExpanded: false},
                    { headerText: 'Review', keyField: 'Review', allowToggle: true },
                    { headerText: 'Testing', keyField: 'Testing', allowToggle: false },
                    { headerText: 'Done', keyField: 'Close', allowToggle: true }
                ],
                height: '800px',
                cardHeight: '120px',
                enableVirtualization: true,
                cardSettings: {
                    contentField: 'Summary',
                    headerField: 'Id'
                },
            };
            kanbanObj = new Kanban(defaultOptions);
            kanbanObj.appendTo('#'+rootElement.id);
            document.getElementById('addNewCard').onclick = (e: Event) => {
                let curData: Object = {
                    Id: count, Status: 'Open', Assignee: 'Alice', Summary: 'Newly Added Card Summary' + count
                };
                kanbanObj.openDialog('Add', curData);
                count++;
            };
            setTimeout(done, 1000);
        });

        it('- Check for the item count on initial rendering ', (done: Function) => {
            const itemsELemCollection: NodeList= document.querySelectorAll('.e-item-count');
            for(let i: number = 0; i < itemsELemCollection.length; i++) {
                const itemElem: HTMLElement = itemsELemCollection[i] as HTMLElement;
                expect(itemElem.textContent).toEqual('- 200 items');
            }
            done();
        });

        it('- Check for the item count update after the collapse action ', (done: Function) => {
            const collapseElem: HTMLElement = document.querySelector('.e-column-collapse') as HTMLElement;
            const itemsELemCollection: NodeList= document.querySelectorAll('.e-item-count');
            collapseElem.click();
            for(let i: number = 0; i < itemsELemCollection.length; i++) {
                const itemElem: HTMLElement = itemsELemCollection[i] as HTMLElement;
                expect(itemElem.textContent).toEqual('- 200 items');
            }
            done();
        });
        
        afterAll(() => {
            kanbanObj.destroy();
            remove(document.getElementById(kanbanObj.element.id));
            remove(document.getElementById(btnElement.id));
        });
    });
    
    xdescribe('Testing the Virtual Scrolling for the remote sample', () => {
        const defaultOptions: KanbanModel = {
            keyField: 'Status',
            columns: [
                { headerText: 'To Do', keyField: 'Open' },
                { headerText: 'In Progress', keyField: 'InProgress' },
                { headerText: 'Testing', keyField: 'Testing' },
                { headerText: 'Done', keyField: 'Close' }
            ],
            height: '800px',
            cardHeight: '120px',
            enableVirtualization: true,
            cardSettings: {
                contentField: 'Summary',
                headerField: 'Id'
            },
        };
        let dataManager: DataManager;
        let kanbanObj: Kanban;
        let rootElement: HTMLElement;
        beforeAll((done: DoneFn) => {
            dataManager = new DataManager({
                url: 'https://ej2services.syncfusion.com/js/development/api/Kanban'
                , crossDomain: true
            });
            defaultOptions.dataSource = dataManager;
            rootElement = createElement('div', { id: 'Kanban_Bug_826595' });
            document.body.appendChild(rootElement);
            setTimeout(function () {
                kanbanObj = new Kanban(defaultOptions, rootElement);
                done();
            }, 1000);
        });
        beforeEach((done: Function) => {
            setTimeout(() => {
                getColumnDataCount(kanbanObj.kanbanData,kanbanObj);
                kanbanObj.appendTo('#Kanban_Bug_826595');
                done();
            }, 300);

        });
        it('Scrolling down testing of the first column', (done: Function) => {
            setTimeout(() => {
                const cardWrapper: HTMLElement = kanbanObj.element.querySelector('.e-card-wrapper');
                let cardCollection: NodeList = cardWrapper.querySelectorAll('.e-card');
                expect((cardCollection[cardCollection.length - 1]as HTMLElement).getAttribute('data-id')).toBe('64');
                util.triggerScrollEvent(cardWrapper, cardWrapper.scrollHeight);
                setTimeout(() => {
                    cardCollection = cardWrapper.querySelectorAll('.e-card');
                    expect((cardCollection[cardCollection.length - 1]as HTMLElement).getAttribute('data-id')).not.toBe('64');
                    done();
                }, 2500);
            }, 1000);
        });
        afterAll(() => {
            kanbanObj.destroy();
            remove(document.getElementById(kanbanObj.element.id));
        });
    });


    describe('BUG 827941: Card are not loading after all the card visible on the screen have been move to other column', () => {
        let kanbanObj: Kanban;
        let rootElement: HTMLElement;
        let count: number = 2000;
        beforeAll((done: Function) => {
            rootElement = createElement('div', { id: 'Kanban_Bug_826595' });
            document.body.appendChild(rootElement);
            const defaultOptions: KanbanModel = {
                dataSource: generateKanbanDataVirtualScroll(),
                keyField: 'Status',
                columns: [
                    { headerText: 'Backlog', keyField: 'Open',  },
                    { headerText: 'In Progress', keyField: 'InProgress', },
                    { headerText: 'Review', keyField: 'Review', },
                    { headerText: 'Testing', keyField: 'Testing',  },
                    { headerText: 'Done', keyField: 'Close', }
                ],
                height: '800px',
                cardHeight: '120px',
                enableVirtualization: true,
                cardSettings: {
                    contentField: 'Summary',
                    headerField: 'Id'
                },
            };
            kanbanObj = new Kanban(defaultOptions);
            kanbanObj.appendTo('#'+rootElement.id);
            setTimeout(done, 1000);
        });
        it(' - Check for the card count before the drag and drop action', (done: Function) => {
            const virtualWrapperElementList : NodeList = kanbanObj.element.querySelectorAll('.e-card-virtual-wrapper');
            expect(virtualWrapperElementList[0].childNodes.length).toEqual(12);
            done();
        });

        it('- 1st Time Dragging the card from the first column- ', (done: Function) => {
            let key: string;
            let dragElement: HTMLElement;
            setTimeout(() => {
                dragElement = (kanbanObj.element.querySelectorAll('.e-card[data-id="1"]') as NodeListOf<Element>).item(0) as HTMLElement;
                key = dragElement.getAttribute('data-key');
                util.triggerMouseEvent(dragElement, 'mousedown');
                util.triggerMouseEvent(dragElement, 'mousemove', 100, 100);
                expect(key).toEqual('Open');
                done();
            }, 1000);
        });

        it(' - 1st Time  Dropping the dragged card in the second column - ', (done: Function) => {
            setTimeout(() => {
                const element: Element = kanbanObj.element.querySelectorAll('.e-card[data-id="201"]').item(0);
                util.triggerMouseEvent(element, 'mousemove', 250, 500);
                util.triggerMouseEvent(element, 'mouseup', 250, 500);
                done();
            }, 1000);
        });

        it('- 2nd Time Dragging the card from the first column - ', (done: Function) => {
            let key: string;
            let dragElement: HTMLElement;
            setTimeout(() => {
                dragElement = (kanbanObj.element.querySelectorAll('.e-card[data-id="2"]') as NodeListOf<Element>).item(0) as HTMLElement;
                key = dragElement.getAttribute('data-key');
                util.triggerMouseEvent(dragElement, 'mousedown');
                util.triggerMouseEvent(dragElement, 'mousemove', 100, 100);
                expect(key).toEqual('Open');
                done();
            }, 1000);
        });

        it(' - 2nd Time Dropping the dragged card in the second column - ', (done: Function) => {
            setTimeout(() => {
                const element: Element = kanbanObj.element.querySelectorAll('.e-card[data-id="202"]').item(0);
                util.triggerMouseEvent(element, 'mousemove', 250, 500);
                util.triggerMouseEvent(element, 'mouseup', 250, 500);
                done();
            }, 1000);
        });
        it('- 3rd Time Dragging the card from the first column - ', (done: Function) => {
            let key: string;
            let dragElement: HTMLElement;
            setTimeout(() => {
                dragElement = (kanbanObj.element.querySelectorAll('.e-card[data-id="3"]') as NodeListOf<Element>).item(0) as HTMLElement;
                key = dragElement.getAttribute('data-key');
                util.triggerMouseEvent(dragElement, 'mousedown');
                util.triggerMouseEvent(dragElement, 'mousemove', 100, 100);
                expect(key).toEqual('Open');
                done();
            }, 1000);
        });

        it(' - 3rd Time Dropping the dragged card in the second column - ', (done: Function) => {
            setTimeout(() => {
                const element: Element = kanbanObj.element.querySelectorAll('.e-card[data-id="203"]').item(0);
                util.triggerMouseEvent(element, 'mousemove', 250, 500);
                util.triggerMouseEvent(element, 'mouseup', 250, 500);
                done();
            }, 1000);
        });

        it(' - Check for the card count after the drag and drop action', (done: Function) => {
            const virtualWrapperElementList : NodeList = kanbanObj.element.querySelectorAll('.e-card-virtual-wrapper');
            expect(virtualWrapperElementList[0].childNodes.length).toEqual(kanbanObj.virtualLayoutModule.scrollStatus['Open'].singleIndexCardCount * 2);
            done();
        });
        afterAll(() => {
            kanbanObj.destroy();
            remove(document.getElementById(kanbanObj.element.id));
        });
    });

    describe('Bug 830146: Card changed into dotted line while dragging multiple card', () => {
        let kanbanObj: Kanban;
        beforeAll((done: Function) => {
            const rootElement: HTMLElement = createElement('div', { id: 'Kanban_Bug_830146' });
            document.body.appendChild(rootElement);
            const defaultOptions: KanbanModel = {
                dataSource: generateKanbanDataVirtualScroll(),
                keyField: 'Status',
                columns: [
                    { headerText: 'Backlog', keyField: 'Open'},
                    { headerText: 'In Progress', keyField: 'InProgress'},
                    { headerText: 'Review', keyField: 'Review' },
                    { headerText: 'Testing', keyField: 'Testing'},
                    { headerText: 'Done', keyField: 'Close'}
                ],
                height: '800px',
                cardHeight: '120px',
                enableVirtualization: true,
                cardSettings: {
                    contentField: 'Summary',
                    headerField: 'Id',
                    selectionType: 'Multiple'
                }
            };
            kanbanObj = new Kanban(defaultOptions);
            kanbanObj.appendTo('#'+rootElement.id);
            setTimeout(done, 1000);
        });

        it('Select multiple cards', () => {
            const card1: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="1"]').item(0) as HTMLElement;
            util.triggerMouseEvent(card1, 'click');
            expect(card1.classList.contains('e-selection')).toEqual(true);
            const card2: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="3"]').item(0) as HTMLElement;
            util.triggerMouseEvent(card2, 'click', null, null, false, true);
            const card3: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="4"]').item(0) as HTMLElement;
            util.triggerMouseEvent(card3, 'click', null, null, false, true);
            expect(card1.classList.contains('e-selection')).toEqual(true);
            expect(card2.classList.contains('e-selection')).toEqual(true);
            expect(card3.classList.contains('e-selection')).toEqual(true);
        });
        it('Drag multiple cards', () => {
            const draggedElement: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="1"]').item(0) as HTMLElement;
            util.triggerMouseEvent(draggedElement, 'mousedown');
            util.triggerMouseEvent(draggedElement, 'mousemove', 250, 300);
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toEqual(3);
            const card1: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="1"]').item(0) as HTMLElement;
            expect(card1.classList.contains('e-kanban-dragged-card')).toEqual(true);
            const card2: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="3"]').item(0) as HTMLElement;
            expect(card2.classList.contains('e-kanban-dragged-card')).toEqual(true);
            const card3: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="4"]').item(0) as HTMLElement;
            expect(card3.classList.contains('e-kanban-dragged-card')).toEqual(true);
        });
        it('Dropped card to columns', () => {
            const ele: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="203"]').item(0) as HTMLElement;
            // Drop at the 203 card
            util.triggerMouseEvent(ele, 'mousemove', 250, 500);
            util.triggerMouseEvent(ele, 'mouseup', 250, 500);
            const card1: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="1"]').item(0) as HTMLElement;
            expect(card1.closest('td').getAttribute('data-key')).toEqual('InProgress');
            const card2: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="3"]').item(0) as HTMLElement;
            expect(card2.closest('td').getAttribute('data-key')).toEqual('InProgress');
            const card3: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="4"]').item(0) as HTMLElement;
            expect(card3.closest('td').getAttribute('data-key')).toEqual('InProgress');
        });
        it('After select multiple cards', () => {
            const card1: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="1"]').item(0) as HTMLElement;
            expect(card1.classList.contains('e-selection')).toEqual(true);
            const card2: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="3"]').item(0) as HTMLElement;
            const card3: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="4"]').item(0) as HTMLElement;
            expect(card1.classList.contains('e-selection')).toEqual(true);
            expect(card2.classList.contains('e-selection')).toEqual(true);
            expect(card3.classList.contains('e-selection')).toEqual(true);
            expect(card1.classList.contains('e-kanban-dragged-card')).toEqual(false);
            expect(card2.classList.contains('e-kanban-dragged-card')).toEqual(false);
            expect(card3.classList.contains('e-kanban-dragged-card')).toEqual(false);
        });

        afterAll(() => {
            kanbanObj.destroy();
            remove(document.getElementById(kanbanObj.element.id));
        });
    });

    describe('Bug 827964 Sometimes unable to drop the card at the bottom of the Column', () => {
        let kanbanObj: Kanban;
        let rootElement: HTMLElement;
        let btnElement: HTMLElement;
        beforeAll((done: Function) => {
            rootElement = createElement('div', { id: 'Kanban_Bug_827964' });
            btnElement = createElement('button', { id: 'addNewCard' , className: 'e-btn' });
            document.body.appendChild(btnElement);
            document.body.appendChild(rootElement);
            const defaultOptions: KanbanModel = {
                dataSource: generateKanbanDataVirtualScroll(),
                keyField: 'Status',
                columns: [
                    { headerText: 'Backlog', keyField: 'Open'},
                    { headerText: 'In Progress', keyField: 'InProgress'},
                    { headerText: 'Review', keyField: 'Review'},
                    { headerText: 'Testing', keyField: 'Testing'},
                    { headerText: 'Done', keyField: 'Close'}
                ],
                height: '400px',
                cardHeight: '120px',
                enableVirtualization: true,
                cardSettings: {
                    contentField: 'Summary',
                    headerField: 'Id'
                },
            };
            kanbanObj = new Kanban(defaultOptions);
            kanbanObj.appendTo('#'+rootElement.id);
            setTimeout(done, 1000);
        });

        it('- Dragging and dropping at the end of the column. ', (done: DoneFn) => {
            setTimeout(() => {
                let dragElement = (kanbanObj.element.querySelectorAll('.e-card[data-id="1"]') as NodeListOf<Element>).item(0) as HTMLElement;
                util.triggerMouseEvent(dragElement, 'mousedown');
                util.triggerMouseEvent(dragElement, 'mousemove', 100, 100);
                const element: Element = kanbanObj.element.querySelectorAll('.e-card[data-id="203"]').item(0);
                util.triggerMouseEvent(element, 'mousemove', 250, 500);
                util.triggerMouseEvent(element, 'mouseup', 250, 500);
                setTimeout(() => {
                    let dragElement = (kanbanObj.element.querySelectorAll('.e-card[data-id="1"]') as NodeListOf<Element>).item(0) as HTMLElement;
                    expect(dragElement.closest('td').getAttribute('data-key')).toEqual('InProgress');
                    done();
                }, 1000);
            }, 300);
        });

        afterAll(() => {
            kanbanObj.destroy();
            remove(document.getElementById(kanbanObj.element.id));
            remove(document.getElementById(btnElement.id));
        });
    });

    describe('Testing Kanban Public Methods', () => {
        let kanbanObj: Kanban;
        let rootElement: HTMLElement;
        let btnElement: HTMLElement;
        let count: number = 2000;
        beforeEach((done: Function) => {
            rootElement = createElement('div', { id: 'Kanban_Bug_826595' });
            btnElement = createElement('button', { id: 'addNewCard' , className: 'e-btn' });
            document.body.appendChild(btnElement);
            document.body.appendChild(rootElement);
            const defaultOptions: KanbanModel = {
                dataSource: generateKanbanDataVirtualScroll(),
                keyField: 'Status',
                columns: [
                    { headerText: 'Backlog', keyField: 'Open', showAddButton: true},
                    { headerText: 'In Progress', keyField: 'InProgress'},
                    { headerText: 'Review', keyField: 'Review' },
                    { headerText: 'Testing', keyField: 'Testing'},
                    { headerText: 'Done', keyField: 'Close'}
                ],
                height: '800px',
                cardHeight: '120px',
                enableVirtualization: true,
                cardSettings: {
                    contentField: 'Summary',
                    headerField: 'Id'
                },
                sortSettings: {
                    sortBy: 'DataSourceOrder',
                    direction: 'Descending'
                },
            };
            kanbanObj = new Kanban(defaultOptions);
            kanbanObj.appendTo('#'+rootElement.id);
            setTimeout(done, 1000);
        });

        it('dynamically updating the card settings', (done: Function) => {
            let cardHeader: HTMLElement = kanbanObj.element.querySelectorAll('.e-card-header')[0] as HTMLElement;
            expect(cardHeader.innerText).toEqual('200');
            kanbanObj.cardSettings.headerField = 'Summary';
            kanbanObj.dataBind();
            setTimeout(() => {
                cardHeader = kanbanObj.element.querySelectorAll('.e-card-header')[0] as HTMLElement;
                const cardData = kanbanObj.kanbanData[199];
                expect(cardHeader.innerText).toEqual(cardData.Summary);
                done();
            }, 500);
        });
        
        it('dynamically updating the stacked header settings', (done: Function) => {
            expect(kanbanObj.element.querySelectorAll('.e-header-text')[0].textContent).toEqual('Backlog');
            kanbanObj.stackedHeaders = [
                { text: 'Backlog', keyFields: 'Open' },
                { text: 'Development Phase', keyFields: 'InProgress, Review' },
                { text: 'Testing', keyFields: 'Testing' },
                { text: 'Done', keyFields: 'Close' }
            ],
            kanbanObj.dataBind();
            setTimeout(() => {
                expect(kanbanObj.element.querySelectorAll('.e-header-text')[0].textContent).toEqual('Backlog');
                expect(kanbanObj.element.querySelectorAll('.e-header-text')[1].textContent).toEqual('Development Phase');
                done();
            }, 500);
        });

        afterAll(() => {
            kanbanObj.destroy();
            remove(document.getElementById(kanbanObj.element.id));
            remove(document.getElementById(btnElement.id));
        });
    });

    describe('Virtual Layout Renderer Specs', () => {

        describe('Basic Virtual Layout Rendering without model', () => {
            let kanbanObj: Kanban;
            beforeAll((done: DoneFn) => {
                kanbanObj = util.createKanban({enableVirtualization: true}, virtualKanbanData, done);
            });

            afterAll(() => {
                util.destroy(kanbanObj);
            });

            it('control class testing', () => {
                expect(kanbanObj.element.classList.contains('e-kanban')).toEqual(true);
            });

            it('get component name testing', () => {
                expect(kanbanObj.getModuleName()).toEqual('kanban');
            });

            it('Kanban children testing', () => {
                expect(kanbanObj.element.childElementCount).toBe(3);
                expect(kanbanObj.element.firstElementChild.classList.contains('e-spinner-pane')).toBeTruthy();
            });
        });

        describe('Basic Virtual Layout Rendering without card data', () => {
            let kanbanObj: Kanban;
            beforeAll((done: DoneFn) => {
                kanbanObj = util.createKanban({ cssClass: 'custom-kanban-class' ,enableVirtualization: true}, [], done);
            });

            afterAll(() => {
                util.destroy(kanbanObj);
            });

            it('control class testing', () => {
                expect(kanbanObj.element.classList.contains('e-kanban')).toEqual(true);
                expect(kanbanObj.element.classList.contains('custom-kanban-class')).toEqual(true);
            });

            it('get component name testing', () => {
                expect(kanbanObj.getModuleName()).toEqual('kanban');
                expect(kanbanObj.requiredModules().length).toEqual(0);
                (kanbanObj as any).getPersistData();
            });

            it('Kanban children testing', () => {
                expect(kanbanObj.element.childElementCount).toBe(3);
                expect(kanbanObj.element.firstElementChild.classList.contains('e-spinner-pane')).toBeTruthy();
                expect(kanbanObj.element.children[1].classList.contains('e-kanban-header')).toBeTruthy();
                expect(kanbanObj.element.lastElementChild.classList.contains('e-kanban-content')).toBeTruthy();
            });

            it('Header table colgroup testing', () => {
                expect(kanbanObj.element.querySelectorAll('.e-header-table colgroup').item(0).childElementCount).toEqual(4);
            });

            it('Header table colgroup data-key testing', () => {
                const colElements: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-table colgroup col');
                kanbanObj.columns.forEach((column: ColumnsModel, index: number) => {
                    expect(colElements.item(index).getAttribute('data-key')).toEqual(column.keyField as string);
                });
            });

            it('Header row testing', () => {
                expect(kanbanObj.element.querySelector('.e-header-row').childElementCount).toEqual(4);
            });

            it('Header content cell rendering testing', () => {
                expect(kanbanObj.element.querySelectorAll('.e-header-table').length).toBe(1);
                expect(kanbanObj.element.querySelectorAll('.e-header-cells').length).toEqual(4);
            });

            it('Header table content cell data-key testing and data-role testing', () => {
                const headerCells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-cells');
                kanbanObj.columns.forEach((column: ColumnsModel, index: number) => {
                    expect(headerCells.item(index).getAttribute('data-key')).toBe(column.keyField as string);
                    expect(headerCells.item(index).getAttribute('data-role')).toBe('kanban-column');
                });
            });

            it('Header text testing', () => {
                const headerText: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-cells .e-header-text');
                kanbanObj.columns.forEach((column: ColumnsModel, index: number) => {
                    expect((headerText.item(index) as HTMLElement).innerText).toBe(column.headerText);
                });
            });

            it('Content rendering testing', () => {
                expect(kanbanObj.element.querySelectorAll('.e-content-table').length).toBe(1);
            });

            it('Content table colgroup testing', () => {
                expect(kanbanObj.element.querySelector('.e-content-table colgroup').childElementCount).toEqual(4);
            });

            it('Content table colgroup data-key testing', () => {
                const colElements: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-table colgroup col');
                kanbanObj.columns.forEach((column: ColumnsModel, index: number) => {
                    expect(colElements.item(index).getAttribute('data-key')).toBe(column.keyField as string);
                });
            });

            it('Content table data testing', () => {
                expect(kanbanObj.element.querySelector('.e-content-table tbody').childElementCount).toBe(0);
            });

            it('Datasource property and card rendering testing', () => {
                expect(kanbanObj.kanbanData.length).toEqual(0);
                expect(kanbanObj.element.querySelectorAll('.e-card').length).toEqual(0);
            });
        });
        describe('Basic Virtual Layout Rendering with card data', () => {
            let kanbanObj: Kanban;
            beforeAll((done: DoneFn) => {
                kanbanObj = util.createKanban({enableVirtualization: true}, virtualKanbanData, done);
            });

            afterAll(() => {
                util.destroy(kanbanObj);
            });

            it('control class testing', () => {
                expect(kanbanObj.element.classList.contains('e-kanban')).toEqual(true);
            });

            it('get component name testing', () => {
                expect(kanbanObj.getModuleName()).toEqual('kanban');
            });

            it('Kanban children testing', () => {
                expect(kanbanObj.element.childElementCount).toBe(3);
                expect(kanbanObj.element.firstElementChild.classList.contains('e-spinner-pane')).toBeTruthy();
                expect(kanbanObj.element.children[1].classList.contains('e-kanban-header')).toBeTruthy();
                expect(kanbanObj.element.lastElementChild.classList.contains('e-kanban-content')).toBeTruthy();
            });

            it('Header table colgroup testing', () => {
                expect(kanbanObj.element.querySelectorAll('.e-header-table colgroup').item(0).childElementCount).toEqual(4);
            });

            it('Header table colgroup data-key testing', () => {
                const colElements: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-table colgroup col');
                kanbanObj.columns.forEach((column: ColumnsModel, index: number) => {
                    expect(colElements.item(index).getAttribute('data-key')).toBe(column.keyField as string);
                });
            });

            it('Header row testing', () => {
                expect(kanbanObj.element.querySelector('.e-header-row').childElementCount).toEqual(4);
            });

            it('Header content cell rendering testing', () => {
                expect(kanbanObj.element.querySelectorAll('.e-header-table').length).toBe(1);
                expect(kanbanObj.element.querySelectorAll('.e-header-cells').length).toEqual(4);
            });

            it('Header table content cell data-key testing and data-role testing', () => {
                const headerCells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-cells');
                kanbanObj.columns.forEach((column: ColumnsModel, index: number) => {
                    expect(headerCells.item(index).getAttribute('data-key')).toBe(column.keyField as string);
                    expect(headerCells.item(index).getAttribute('data-role')).toBe('kanban-column');
                });
            });

            it('Header text testing', () => {
                const headerText: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-cells .e-header-text');
                kanbanObj.columns.forEach((column: ColumnsModel, index: number) => {
                    expect((headerText.item(index) as HTMLElement).innerText).toBe(column.headerText);
                });
            });

            it('Content rendering testing', () => {
                expect(kanbanObj.element.querySelectorAll('.e-content-table').length).toBe(1);
            });

            it('Content table colgroup testing', () => {
                expect(kanbanObj.element.querySelector('.e-content-table colgroup').childElementCount).toEqual(4);
            });

            it('Content table colgroup data-key testing', () => {
                const colElements: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-table colgroup col');
                kanbanObj.columns.forEach((column: ColumnsModel, index: number) => {
                    expect(colElements.item(index).getAttribute('data-key')).toBe(column.keyField as string);
                });
            });

            it('Content table data testing', () => {
                expect(kanbanObj.element.querySelector('.e-content-table tbody').childElementCount).toBe(1);
                expect(kanbanObj.element.querySelector('.e-content-row').childElementCount).toEqual(4);
            });

            it('Datasource property and card rendering testing', () => {
                expect((kanbanObj.dataSource as Record<string, any>[]).length).toBe(1000);
                expect(kanbanObj.element.querySelectorAll('.e-card').length).toBe(40);
            });

            it('Content table height testing', () => {
                expect((kanbanObj.element.querySelectorAll('.e-kanban-content').item(0) as HTMLElement).style.height).not.toBe('0px');
            });

            it('Content table colgroup testing', () => {
                expect(kanbanObj.element.querySelector('.e-content-table colgroup').childElementCount).toEqual(4);
            });

            it('Content table colgroup data-key testing', () => {
                const colElements: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-table colgroup col');
                kanbanObj.columns.forEach((column: ColumnsModel, index: number) => {
                    expect(colElements.item(index).getAttribute('data-key')).toBe(column.keyField as string);
                });
            });

            it('Content row testing', () => {
                expect(kanbanObj.element.querySelector('.e-content-row').childElementCount).toEqual(4);
            });

            it('Content cell rendering testing', () => {
                expect(kanbanObj.element.querySelectorAll('.e-content-row').length).toBe(1);
                expect(kanbanObj.element.querySelectorAll('.e-content-cells').length).toEqual(4);
            });

            it('Content cell data-key testing and data-role testing', () => {
                const contentCells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-cells');
                kanbanObj.columns.forEach((column: ColumnsModel, index: number) => {
                    expect(contentCells.item(index).getAttribute('data-key')).toBe(column.keyField as string);
                    expect(contentCells.item(index).getAttribute('data-role')).toBe('kanban-column');
                    expect(contentCells.item(index).lastElementChild.classList.contains('e-card-wrapper')).toBe(true);
                });
            });

            it('Card count testing', () => {
                const contentCells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-cells');
                expect(contentCells.item(0).lastElementChild.querySelector('.e-card-virtual-wrapper').childElementCount).toBe(10);
                expect(contentCells.item(1).lastElementChild.querySelector('.e-card-virtual-wrapper').childElementCount).toBe(10);
                expect(contentCells.item(2).lastElementChild.querySelector('.e-card-virtual-wrapper').childElementCount).toBe(10);
                expect(contentCells.item(3).lastElementChild.querySelector('.e-card-virtual-wrapper').childElementCount).toBe(10);
            });

            it('First column card class and inner layout testing', () => {
                const cards: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-cells:nth-child(1) .e-card');
                cards.forEach((card: HTMLElement) => {
                    expect(card.classList.contains('e-draggable')).toBe(true);
                    expect(card.classList.contains('e-card')).toBe(true);
                    expect(card.getAttribute('data-key')).toBe('Open');
                    expect(card.hasAttribute('data-id')).toBe(true);
                    expect(card.childElementCount).toBe(2);
                    expect(card.children[0].classList.contains('e-card-header')).toEqual(true);
                    expect(card.children[1].classList.contains('e-card-content')).toEqual(true);
                    expect(card.children[0].firstElementChild.classList.contains('e-card-header-caption')).toEqual(true);
                });
            });

            it('Second column card class and inner layout testing', () => {
                const cards: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-cells:nth-child(2) .e-card');
                cards.forEach((card: HTMLElement) => {
                    expect(card.classList.contains('e-draggable')).toBe(true);
                    expect(card.classList.contains('e-card')).toBe(true);
                    expect(card.getAttribute('data-key')).toBe('InProgress');
                    expect(card.hasAttribute('data-id')).toBe(true);
                    expect(card.childElementCount).toBe(2);
                    expect(card.children[0].classList.contains('e-card-header')).toEqual(true);
                    expect(card.children[1].classList.contains('e-card-content')).toEqual(true);
                    expect(card.children[0].firstElementChild.classList.contains('e-card-header-caption')).toEqual(true);
                });
            });

            it('Third column card class and inner layout testing', () => {
                const cards: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-cells:nth-child(3) .e-card');
                cards.forEach((card: HTMLElement) => {
                    expect(card.classList.contains('e-draggable')).toBe(true);
                    expect(card.classList.contains('e-card')).toBe(true);
                    expect(card.getAttribute('data-key')).toBe('Testing');
                    expect(card.hasAttribute('data-id')).toBe(true);
                    expect(card.childElementCount).toBe(2);
                    expect(card.children[0].classList.contains('e-card-header')).toEqual(true);
                    expect(card.children[1].classList.contains('e-card-content')).toEqual(true);
                    expect(card.children[0].firstElementChild.classList.contains('e-card-header-caption')).toEqual(true);
                });
            });

            it('Forth column card class and inner layout testing', () => {
                const cards: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-cells:nth-child(4) .e-card');
                cards.forEach((card: HTMLElement) => {
                    expect(card.classList.contains('e-draggable')).toBe(true);
                    expect(card.classList.contains('e-card')).toBe(true);
                    expect(card.getAttribute('data-key')).toBe('Close');
                    expect(card.hasAttribute('data-id')).toBe(true);
                    expect(card.childElementCount).toBe(2);
                    expect(card.children[0].classList.contains('e-card-header')).toEqual(true);
                    expect(card.children[1].classList.contains('e-card-content')).toEqual(true);
                    expect(card.children[0].firstElementChild.classList.contains('e-card-header-caption')).toEqual(true);
                });
            });
        });
        describe('actionFailure testing', () => {
            const actionFailedFunction: () => void = jasmine.createSpy('actionFailure');
            let kanbanObj: Kanban;
            beforeAll(() => {
                jasmine.Ajax.install();
                const dataManager: DataManager = new DataManager({ url: 'api/Kanban/Cards/' });
                const model: KanbanModel = { actionFailure: actionFailedFunction, enableVirtualization: true };
                kanbanObj = util.createKanban(model, dataManager);
            });
            beforeEach((done: DoneFn) => {
                const request: JasmineAjaxRequest = jasmine.Ajax.requests.mostRecent();
                request.respondWith({ 'status': 404, 'contentType': 'application/json', 'responseText': 'Page not found' });
                done();
            });
            it('actionFailure testing', (done: Function) => {
                setTimeout(() => {
                    expect(actionFailedFunction).toHaveBeenCalled();
                    done();
                }, 500);
            });
            afterAll(() => {
                util.destroy(kanbanObj);
                jasmine.Ajax.uninstall();
            });
        });
        describe('Virtual Layout Stacked Header Testing', () => {
            let kanbanObj: Kanban;
            beforeAll((done: DoneFn) => {
                kanbanObj = util.createKanban(
                    {
                        stackedHeaders: [
                            { text: 'Unresolved', keyFields: 'Open, InProgress, Testing, Review' },
                            { text: 'Resolved', keyFields: 'Close' }
                        ],
                        enableVirtualization: true
                    }, virtualKanbanData, done
                );
            });

            afterAll(() => {
                util.destroy(kanbanObj);
            });
            it('Stacked header class layout testing', () => {
                const element: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-row');
                for (let i: number = 0; i < element.length - 1; i++) {
                    expect(element[i].classList.contains('e-stacked-header-row')).toBe(true);
                    expect(element[i].tagName).toBe('TR');
                    expect(element[i].firstElementChild.classList.contains('e-header-cells')).toBe(true);
                    expect(element[i].firstElementChild.tagName).toBe('TH');
                    expect(element[i].firstElementChild.classList.contains('e-stacked-header-cell')).toBe(true);
                    expect(element[i].firstElementChild.hasAttribute('colspan')).toBe(true);
                    expect(element[i].firstElementChild.firstElementChild.classList.contains('e-header-text')).toBe(true);
                    expect(element[i].firstElementChild.firstElementChild.tagName).toBe('DIV');
                }
            });
            it('Stacked header colspan layout testing', () => {
                const element: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-row');
                expect(element[0].firstElementChild.getAttribute('colspan')).toBe('3');
                expect(element[0].lastElementChild.getAttribute('colspan')).toBe('1');
                expect(element[0].firstElementChild.firstElementChild.innerHTML).toBe('Unresolved');
                expect(element[0].lastElementChild.firstElementChild.innerHTML).toBe('Resolved');
            });
        });
        describe('Virtual WIP validation without swimlane', () => {
            let kanbanObj: Kanban;
            beforeAll((done: DoneFn) => {
                kanbanObj = util.createKanban(
                    {   width: 'auto',
                        columns: [
                            { headerText: 'Backlog', keyField: 'Open', allowToggle: true, showItemCount: true, minCount: 201},
                            { headerText: 'In Progress', keyField: 'InProgress', allowToggle: true, minCount: 2},
                            { headerText: 'Review', keyField: 'Review', allowToggle: true, maxCount: 3},
                            { headerText: 'Testing', keyField: 'Testing', allowToggle: true, maxCount: 2},
                            { headerText: 'Done', keyField: 'Close', allowToggle: true}
                        ],
                        stackedHeaders: [
                            { text: 'Unresolved', keyFields: 'Open, InProgress, Testing, Review' },
                            { text: 'Resolved', keyFields: 'Close' }
                        ],
                        enableVirtualization: true
                    }, virtualKanbanData, done
                );
            });

            afterAll(() => {
                util.destroy(kanbanObj);
            });
            it('min count testing', () => {
                expect(kanbanObj.element.querySelectorAll('.e-min-count').length).toEqual(2);
                expect(kanbanObj.element.querySelectorAll('.e-min-color').length).toEqual(2);
            });
            it('max count testing', () => {
                expect(kanbanObj.element.querySelectorAll('.e-max-count').length).toEqual(2);
                expect(kanbanObj.element.querySelectorAll('.e-max-color').length).toEqual(4);
            });
        });

        describe('Virtual RenderHeader using method', () => {
            let kanbanObj: Kanban;
            let dataSourceEventCalled: boolean = false;
            beforeAll((done: DoneFn) => {
                const model: KanbanModel = {
                    columns: [
                        { headerText: 'Backlog', keyField: 'Open', allowToggle: true, showItemCount: true, minCount: 201},
                        { headerText: 'In Progress', keyField: 'InProgress', allowToggle: true, minCount: 2},
                        { headerText: 'Review', keyField: 'Review', allowToggle: true, maxCount: 3},
                        { headerText: 'Testing', keyField: 'Testing', allowToggle: true, maxCount: 2},
                        { headerText: 'Done', keyField: 'Close', allowToggle: true}
                    ],
                    sortSettings: {
                        direction: 'Descending',
                        sortBy: 'DataSourceOrder'
                    },
                    dialogSettings: {
                        model: { width: 500 },
                        fields: [
                            { text: 'ID', key: 'Id', type: 'TextBox' },
                            { key: 'Status', type: 'DropDown' },
                            { key: 'Assignee', type: 'DropDown' },
                            { key: 'Estimate', type: 'Numeric', validationRules: { range: [0, 1000] } },
                            { key: 'Summary', type: 'TextArea', validationRules: { required: true } }
                        ]
                    }, enableVirtualization: true,
                    constraintType: 'Swimlane',
                    dataSourceChanged: dataSourceChangedEvent
                };
                kanbanObj = util.createKanban(model, virtualKanbanData, done);
                function dataSourceChangedEvent (args: any) {
                    dataSourceEventCalled = true;
                }
            });

            afterAll(() => {
                util.destroy(kanbanObj);
            });

            it('reRender the header using public method', () => {
                kanbanObj.refreshHeader();
            });

            it('onProperty change of dialogSettings', () => {
                expect(kanbanObj.dialogSettings.model.width === 500).toBe(true);
                kanbanObj.dialogSettings.model = { width: 1000 };
                kanbanObj.dataBind();
                expect(kanbanObj.dialogSettings.model.width === 1000).toBe(true);
            });

            it('onProperty change of sortSettings', () => {
                expect(kanbanObj.sortSettings.direction === 'Descending').toBe(true);
                kanbanObj.sortSettings.direction = 'Ascending';
                kanbanObj.dataBind();
                expect(kanbanObj.sortSettings.direction === 'Ascending').toBe(true);
            });

            it('update a card', () => {
                const card: Record<string, any> = kanbanObj.kanbanData[0];
                (card as any).Summary = 'updateCard';
                kanbanObj.updateCard(card, 0);
                expect((card as any).Summary === 'updateCard').toBe(true);
                expect(dataSourceEventCalled).toBe(true);
            });

            it('Add a new card', () => {
                const card: Record<string, any> = kanbanObj.kanbanData[0];
                const length: number = kanbanObj.kanbanData.length;
                (card as any).Id = kanbanObj.kanbanData.length + 1;
                kanbanObj.addCard(card, 0);
                expect(length + 1 === kanbanObj.kanbanData.length).toBe(true);
                expect(kanbanObj.virtualLayoutModule.columnData['Open'].length.toString() === kanbanObj.element.querySelectorAll('.e-item-count')[0].textContent.split(' ')[1]).toBe(true);
            });
        });
        describe('Virtual Card click and double click actions testing', () => {
            let kanbanObj: Kanban;
            let isCardClick: boolean = false;
            const cardDoubleClickFunction: () => void = jasmine.createSpy('cardDoubleClick');
            beforeAll((done: DoneFn) => {
                virtualKanbanOptions.cardClick = (args: CardClickEventArgs) => args.cancel = !isCardClick;
                virtualKanbanOptions.cardDoubleClick = cardDoubleClickFunction;
                kanbanObj = util.createKanban(virtualKanbanOptions, virtualKanbanData, done);
            });

            beforeEach((done: DoneFn) => done());

            afterAll(() => {
                util.destroy(kanbanObj);
            });

            it('card click action event args as false', () => {
                const card: Element = kanbanObj.element.querySelector('.e-card');
                expect(card.classList.contains('e-selection')).toEqual(false);
                util.triggerMouseEvent(card, 'click');
                expect(card.classList.contains('e-selection')).toEqual(false);
            });

            it('card click action event args as true', () => {
                isCardClick = true;
                const card: Element = kanbanObj.element.querySelector('.e-card');
                expect(card.classList.contains('e-selection')).toEqual(false);
                util.triggerMouseEvent(card, 'click');
                expect(card.classList.contains('e-selection')).toEqual(true);
            });

            it('card double click action', () => {
                const card: Element = kanbanObj.element.querySelector('.e-card[data-id="2"]');
                expect(card.classList.contains('e-selection')).toEqual(false);
                util.triggerMouseEvent(card, 'dblclick');
                expect(card.classList.contains('e-selection')).toEqual(true);
                expect(cardDoubleClickFunction).toHaveBeenCalled();
            });

            it('dialog close after card double click', () => {
                kanbanObj.closeDialog();
            });
        });

        describe('Virtual Layout column expand and collapse testing without swimlane', () => {
            let kanbanObj: Kanban;
            const dataSource: Record<string, any>[] = virtualKanbanData;
            const actionCompleteFunction: () => void = jasmine.createSpy('actionComplete');
            beforeAll((done: DoneFn) => {
                const model: KanbanModel = {
                    columns: [
                        { headerText: 'Backlog', keyField: 'Open', allowToggle: true },
                        { headerText: 'In Progress', keyField: 'InProgress', allowToggle: true },
                        { headerText: 'Testing', keyField: 'Testing', allowToggle: true },
                        { headerText: 'Done', keyField: 'Close', allowToggle: true }
                    ],
                    actionComplete: actionCompleteFunction
                };
                kanbanObj = util.createKanban(model, dataSource, done);
            });

            beforeEach((done: DoneFn) => done());

            afterAll(() => {
                util.destroy(kanbanObj);
            });

            it('action begin testing with cancel as true', () => {
                kanbanObj.actionBegin = (args: ActionEventArgs) => args.cancel = true;
                const columnHeader: HTMLElement = kanbanObj.element.querySelector('.e-header-cells') as HTMLElement;
                expect(columnHeader.classList.contains('e-toggle-header')).toEqual(true);
                expect(columnHeader.classList.contains('e-collapsed')).toEqual(false);
                expect(columnHeader.children[0].children[1].classList.contains('e-column-expand')).toEqual(true);
                expect(columnHeader.children[0].children[1].classList.contains('e-column-collapse')).toEqual(false);
                util.triggerMouseEvent(columnHeader.children[0].children[1], 'click');
                expect(columnHeader.classList.contains('e-toggle-header')).toEqual(true);
                expect(columnHeader.classList.contains('e-collapsed')).toEqual(false);
                expect(columnHeader.children[0].children[1].classList.contains('e-column-expand')).toEqual(true);
                expect(columnHeader.children[0].children[1].classList.contains('e-column-collapse')).toEqual(false);
            });

            it('action begin testing with cancel as false and column collapsed', () => {
                kanbanObj.actionBegin = (args: ActionEventArgs) => args.cancel = false;
                const columnHeader: HTMLElement = kanbanObj.element.querySelector('.e-header-cells') as HTMLElement;
                expect(columnHeader.classList.contains('e-toggle-header')).toEqual(true);
                expect(columnHeader.classList.contains('e-collapsed')).toEqual(false);
                expect(columnHeader.children[0].children[1].classList.contains('e-column-expand')).toEqual(true);
                expect(columnHeader.children[0].children[1].classList.contains('e-column-collapse')).toEqual(false);
                util.triggerMouseEvent(columnHeader.children[0].children[1], 'click');
                expect(columnHeader.classList.contains('e-toggle-header')).toEqual(true);
                expect(columnHeader.classList.contains('e-collapsed')).toEqual(true);
                expect(columnHeader.children[0].children[1].classList.contains('e-column-expand')).toEqual(false);
                expect(columnHeader.children[0].children[1].classList.contains('e-column-collapse')).toEqual(true);
            });

            it('action begin testing with cancel as false and column expanded', () => {
                const columnHeader: HTMLElement = kanbanObj.element.querySelector('.e-header-cells') as HTMLElement;
                expect(columnHeader.classList.contains('e-toggle-header')).toEqual(true);
                expect(columnHeader.classList.contains('e-collapsed')).toEqual(true);
                expect(columnHeader.children[0].children[1].classList.contains('e-column-expand')).toEqual(false);
                expect(columnHeader.children[0].children[1].classList.contains('e-column-collapse')).toEqual(true);
                util.triggerMouseEvent(columnHeader.children[0].children[1], 'click');
                expect(columnHeader.classList.contains('e-toggle-header')).toEqual(true);
                expect(columnHeader.classList.contains('e-collapsed')).toEqual(false);
                expect(columnHeader.children[0].children[1].classList.contains('e-column-expand')).toEqual(true);
                expect(columnHeader.children[0].children[1].classList.contains('e-column-collapse')).toEqual(false);
                expect(actionCompleteFunction).toHaveBeenCalled();
            });

            it('all columns collapsed together', () => {
                const columnKeys: string[] = ['Open', 'InProgress', 'Testing', 'Close'];
                const columnHeaders: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-cells');
                columnHeaders.forEach((columnHeader: HTMLElement, index: number) => {
                    expect(columnHeader.classList.contains('e-toggle-header')).toEqual(true);
                    expect(columnHeader.classList.contains('e-collapsed')).toEqual(false);
                    expect(columnHeader.children[0].classList.contains('e-header-wrap')).toEqual(true);
                    expect(columnHeader.children[0].children[1].classList.contains('e-column-expand')).toEqual(true);
                    expect(columnHeader.children[0].children[1].classList.contains('e-column-collapse')).toEqual(false);
                    expect(columnHeader.getAttribute('data-key')).toEqual(columnKeys[index]);
                    util.triggerMouseEvent(columnHeader.children[0].children[1], 'click');
                    expect(columnHeader.classList.contains('e-toggle-header')).toEqual(true);
                    expect(columnHeader.classList.contains('e-collapsed')).toEqual(true);
                    expect(columnHeader.children[0].classList.contains('e-header-wrap')).toEqual(true);
                    expect(columnHeader.children[0].children[1].classList.contains('e-column-expand')).toEqual(false);
                    expect(columnHeader.children[0].children[1].classList.contains('e-column-collapse')).toEqual(true);
                    expect(actionCompleteFunction).toHaveBeenCalled();
                });
            });
        });

        describe('Virtual Layout Allow Toggle Column', () => {
            let kanbanObj: Kanban;
            beforeAll((done: DoneFn) => {
                virtualKanbanOptions.columns = [
                    { allowToggle: false, isExpanded: true, headerText: 'Backlog', keyField: 'Open'},
                    { allowToggle: true, isExpanded: false, headerText: 'In Progress', keyField: 'InProgress'},
                    { allowToggle: false, isExpanded: true, headerText: 'Testing', keyField: 'Testing'},
                    { allowToggle: true, isExpanded: true, headerText: 'Done', keyField: 'Close'}
                ]
                kanbanObj = util.createKanban(virtualKanbanOptions, virtualKanbanData, done);
            });

            afterAll(() => {
                util.destroy(kanbanObj);
            });

            it('Particular column collapsed testing', () => {
                expect(kanbanObj.columns[0].allowToggle).toBeFalsy();
                expect(kanbanObj.columns[1].allowToggle).toBeTruthy();
                expect(kanbanObj.columns[2].allowToggle).toBeFalsy();
                expect(kanbanObj.columns[3].allowToggle).toBeTruthy();
            });

            it('Particular column expanded state testing', () => {
                expect(kanbanObj.columns[0].isExpanded).toBeTruthy();
                expect(kanbanObj.columns[1].isExpanded).toBeFalsy();
                expect(kanbanObj.columns[2].isExpanded).toBeTruthy();
                expect(kanbanObj.columns[3].isExpanded).toBeTruthy();
            });

            it('Particular column icon rendering testing', () => {
                const headerCells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-cells');
                expect(headerCells[0].children[0].lastElementChild.classList.contains('e-column-expand')).toBe(false);
                expect(headerCells[1].children[0].lastElementChild.classList.contains('e-column-collapse')).toBe(true);
                expect(headerCells[2].children[0].lastElementChild.classList.contains('e-column-expand')).toBe(false);
                expect(headerCells[3].children[0].lastElementChild.classList.contains('e-column-expand')).toBe(true);
            });
            it('Checked collapesd class added properly on header cell testing', () => {
                const headerCells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-cells');
                expect(headerCells[0].classList.contains('e-collapsed')).toBe(false);
                expect(headerCells[1].classList.contains('e-collapsed')).toBe(true);
                expect(headerCells[2].classList.contains('e-collapsed')).toBe(false);
                expect(headerCells[3].classList.contains('e-collapsed')).toBe(false);
            });

            it('Checked toggle header class added properly on header cell testing', () => {
                const headerCells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-cells');
                expect(headerCells[0].classList.contains('e-toggle-header')).toBe(false);
                expect(headerCells[1].classList.contains('e-toggle-header')).toBe(true);
                expect(headerCells[2].classList.contains('e-toggle-header')).toBe(false);
                expect(headerCells[3].classList.contains('e-toggle-header')).toBe(true);
            });

            it('Checked collapsed class added on content cell testing', () => {
                const headerCells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-cells');
                expect(headerCells[0].classList.contains('e-collapsed')).toBe(false);
                expect(headerCells[1].classList.contains('e-collapsed')).toBe(true);
                expect(headerCells[2].classList.contains('e-collapsed')).toBe(false);
                expect(headerCells[3].classList.contains('e-collapsed')).toBe(false);
            });

            it('Single column collapse testing', () => {
                const element: Element = kanbanObj.element.querySelectorAll('.e-header-cells')[3].children[0].lastElementChild;
                (<HTMLElement>element).click();
                expect(element.classList.contains('e-column-collapse')).toBe(true);
                expect(kanbanObj.element.querySelectorAll('.e-content-cells')[3].classList.contains('e-collapsed')).toBe(true);
            });

            it('Single column expand testing', () => {
                const element: Element = kanbanObj.element.querySelectorAll('.e-header-cells')[3].children[0].lastElementChild;
                (<HTMLElement>element).click();
                expect(element.classList.contains('e-column-expand')).toBe(true);
                expect(kanbanObj.element.querySelectorAll('.e-content-cells')[3].classList.contains('e-collapsed')).toBe(false);
            });

            it('Maintain single collapsed state testing - drag the card', () => {
                const headerCell: Element = kanbanObj.element.querySelectorAll('.e-header-cells')[1].children[0].lastElementChild;
                expect(headerCell.classList.contains('e-column-collapse')).toBe(true);
                expect(kanbanObj.element.querySelectorAll('.e-content-cells')[1].classList.contains('e-collapsed')).toBe(true);
                const draggedElement: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="1"]').item(0) as HTMLElement;
                util.triggerMouseEvent(draggedElement, 'mousedown');
                util.triggerMouseEvent(draggedElement, 'mousemove', 508, 110);
            });

            it('Maintain single collapsed state testing - drag the card checking values', () => {
                const draggedElement: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="1"]').item(0) as HTMLElement;
                expect(draggedElement.classList.contains('e-kanban-dragged-card')).toBeTruthy();
                expect(draggedElement.nextElementSibling.classList.contains('e-target-dragged-clone')).toBeTruthy();
                expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(1);
            });

            it('Maintain single collapsed state testing - card moved to another place', () => {
                const droppedElement: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="5"]').item(0) as HTMLElement;
                util.triggerMouseEvent(droppedElement, 'mousemove', 650, 200);
                expect(droppedElement.nextElementSibling.classList.contains('e-target-dropped-clone')).toEqual(true);
                util.triggerMouseEvent(droppedElement, 'mouseup', 650, 200);
            });

            it('Maintain single collapsed state testing - after drag stop', () => {
                expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(0);
                expect(kanbanObj.element.querySelectorAll('.e-target-dropped-clone').length).toBe(0);
                expect(kanbanObj.element.querySelectorAll('.e-card.e-cloned-card').length).toBe(0);
                expect(kanbanObj.element.querySelectorAll('.e-kanban-dragged-card').length).toBe(0);
                const headerCell: Element = kanbanObj.element.querySelectorAll('.e-header-cells')[1].children[0].lastElementChild;
                expect(headerCell.classList.contains('e-column-collapse')).toBe(true);
                expect(kanbanObj.element.querySelectorAll('.e-content-cells')[1].classList.contains('e-collapsed')).toBe(true);
            });

            it('Single Collapsed column with drag and drop behavior testing - check the column expand when cursor move', () => {
                const draggedElement: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="1"]').item(0) as HTMLElement;
                util.triggerMouseEvent(draggedElement, 'mousedown');
                util.triggerMouseEvent(draggedElement, 'mousemove', 280, 200);
                const element: Element = kanbanObj.element.querySelectorAll('.e-content-row:not(.e-swimlane-row) .e-content-cells').item(1);
                util.triggerMouseEvent(element, 'mousemove', 290, 200);
            });
            it('Single Collapsed column with drag and drop behavior testing - drop the card on collapsed column', () => {
                const droppedElement: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="5"]').item(0) as HTMLElement;
                util.triggerMouseEvent(droppedElement, 'mousemove', 290, 250);
                util.triggerMouseEvent(droppedElement, 'mouseup', 290, 250);
            });
        });
    });
    
    //Issue occuring in source level when sortting is configured as 'DataSourceOrder' Need to correct
    // describe('Virtual Scroll drag and drop with sort setting', () => {
    //     let kanbanObj: Kanban;
    //     beforeAll(() => {
    //         const element: HTMLElement = createElement('div', { id: 'Kanban' });
    //         document.body.appendChild(element);
    //         // eslint-disable-next-line no-console
    //         const defaultOptions: KanbanModel = {
    //             dataSource: generateKanbanDataVirtualScroll(),
    //             keyField: 'Status',
    //             columns: [
    //                 { headerText: 'Backlog', keyField: 'Open'},
    //                 { headerText: 'In Progress', keyField: 'InProgress'},
    //                 { headerText: 'Review', keyField: 'Review' },
    //                 { headerText: 'Testing', keyField: 'Testing'},
    //                 { headerText: 'Done', keyField: 'Close'}
    //             ],
    //             height: '800px',
    //             cardHeight: '120px',
    //             sortSettings: {
    //                 sortBy: 'DataSourceOrder'
    //             },
    //             enableVirtualization: true,
    //             cardSettings: {
    //                 contentField: 'Summary',
    //                 headerField: 'Id'
    //             }
    //         };
    //         kanbanObj = new Kanban(defaultOptions);
    //         kanbanObj.appendTo(element);
    //     });

    //     it('- Dragging the card from the first column (to drop on another column) - ', (done: Function) => {
    //         let key: string;
    //         let dragElement: HTMLElement;
    //         setTimeout(() => {
    //             dragElement = (kanbanObj.element.querySelectorAll('.e-card[data-id="1"]') as NodeListOf<Element>).item(0) as HTMLElement;
    //             key = dragElement.getAttribute('data-key');
    //             util.triggerMouseEvent(dragElement, 'mousedown');
    //             util.triggerMouseEvent(dragElement, 'mousemove', 100, 100);
    //             expect(key).toEqual('Open');
    //             expect(dragElement.closest('.e-content-cells').classList.contains('e-dragged-column')).toBe(true);
    //             done();
    //         }, 1000);
    //     });

    //     it(' - Dropping the dragged card in the another column - ', (done: Function) => {
    //         setTimeout(() => {
    //             const element: Element = kanbanObj.element.querySelectorAll('.e-card[data-id="201"]').item(0);
    //             util.triggerMouseEvent(element, 'mousemove', 250, 500);
    //             util.triggerMouseEvent(element, 'mouseup', 250, 500);
    //             const droppedElem: HTMLElement = (kanbanObj.element.querySelectorAll('.e-card[data-id="1"]') as NodeListOf<Element>).item(0) as HTMLElement;
    //             expect(droppedElem.previousElementSibling.getAttribute('data-id')).toEqual('201');
    //             done();
    //         }, 1000);
    //     });


    //     it('Scrolling down testing of the second column after drag and drop', (done: Function) => {
    //         setTimeout(() => {
    //             const cardWrapper: HTMLElement = kanbanObj.element.querySelector('.e-kanban-content').querySelectorAll('.e-content-cells')[1].querySelector('.e-card-wrapper');
    //             expect(cardWrapper.querySelector('.e-card-virtual-wrapper').children[0].getAttribute('data-id')).toBe('201');
    //             util.triggerScrollEvent(cardWrapper, 2000);
    //             setTimeout(() => {
    //                 expect(cardWrapper.querySelector('.e-card-virtual-wrapper').children[0].getAttribute('data-id')).not.toBe('201');
    //                 done();
    //             }, 2500);
    //         }, 500);
    //     });


    //     it('Scrolling up testing of the second column after scroll down', (done: Function) => {
    //         setTimeout(() => {
    //             const cardWrapper: HTMLElement = kanbanObj.element.querySelector('.e-kanban-content').querySelectorAll('.e-content-cells')[1].querySelector('.e-card-wrapper');
    //             util.triggerScrollEvent(cardWrapper, 0);
    //             setTimeout(() => {
    //                 expect(cardWrapper.querySelector('.e-card-virtual-wrapper').children[0].getAttribute('data-id')).toBe('201');
    //                 done();
    //             }, 2500);
    //         }, 500);
    //     });

    //     afterAll(() => {
    //         kanbanObj.destroy();
    //         remove(document.getElementById(kanbanObj.element.id));
    //     });
    // });

    describe('Null or undefined value testing', () => {
        let kanbanObj: Kanban;
        let model: KanbanModel;
        beforeEach((): void => {
            let Chromebrowser: string = "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36";
            Browser.userAgent = Chromebrowser;
        });
        afterEach(() => {
            document.body.innerHTML = "";
        });
        it("allowDragAndDrop", () => {
            model = {
                allowDragAndDrop: null
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.allowDragAndDrop).toBe(null);
            util.destroy(kanbanObj);
            model = {
                allowDragAndDrop: undefined
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.allowDragAndDrop).toBe(true);
            util.destroy(kanbanObj);
        });
        it("allowKeyboard", () => {
            model = {
                allowKeyboard: null
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.allowKeyboard).toBe(null);
            util.destroy(kanbanObj);
            model = {
                allowKeyboard: undefined
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.allowKeyboard).toBe(true);
            util.destroy(kanbanObj);
        });
        it("cardHeight", () => {
            model = {
                cardHeight: null
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.cardHeight).toBe(null);
            util.destroy(kanbanObj);
            model = {
                cardHeight: undefined
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.cardHeight).toBe('auto');
            util.destroy(kanbanObj);
        });
        it("cardSettings", () => {
            //contentField
            model = {
                cardSettings: {
                    contentField: null
                }
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.cardSettings.contentField).toBe(null);
            util.destroy(kanbanObj);
            model = {
                cardSettings: {
                    contentField: undefined
                }
            };
            //footerCssField
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.cardSettings.contentField).toBe(undefined);
            util.destroy(kanbanObj);
            model = {
                cardSettings: {
                    footerCssField: null
                }
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.cardSettings.footerCssField).toBe(null);
            util.destroy(kanbanObj);
            model = {
                cardSettings: {
                    footerCssField: undefined
                }
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.cardSettings.footerCssField).toBe(undefined);
            util.destroy(kanbanObj);
            //headerField
            model = {
                cardSettings: {
                    headerField: null
                }
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.cardSettings.headerField).toBe(null);
            util.destroy(kanbanObj);
            model = {
                cardSettings: {
                    headerField: undefined
                }
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.cardSettings.headerField).toBe(undefined);
            util.destroy(kanbanObj);
            //grabberField
            model = {
                cardSettings: {
                    grabberField: null
                }
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.cardSettings.grabberField).toBe(null);
            util.destroy(kanbanObj);
            model = {
                cardSettings: {
                    grabberField: undefined
                }
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.cardSettings.grabberField).toBe(undefined);
            util.destroy(kanbanObj);
        });
        it("columns", () => {
            //allowDrag
            model = {
                columns: [{allowDrag :null}]
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.columns[0].allowDrag).toBe(null);
            util.destroy(kanbanObj);
            model = {
                columns: [{allowDrag :undefined}]
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.columns[0].allowDrag).toBe(true);
            util.destroy(kanbanObj);
            //allowDrop
            model = {
                columns: [{allowDrop :null}]
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.columns[0].allowDrop).toBe(null);
            util.destroy(kanbanObj);
            model = {
                columns: [{allowDrop :undefined}]
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.columns[0].allowDrop).toBe(true);
            util.destroy(kanbanObj);
            //allowToggle
            model = {
                columns: [{allowToggle :null}]
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.columns[0].allowToggle).toBe(null);
            util.destroy(kanbanObj);
            model = {
                columns: [{allowToggle :undefined}]
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.columns[0].allowToggle).toBe(false);
            util.destroy(kanbanObj);
            //headerText
            model = {
                columns: [{headerText :null}]
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.columns[0].headerText).toBe(null);
            util.destroy(kanbanObj);
            model = {
                columns: [{headerText :undefined}]
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.columns[0].headerText).toBe(undefined);
            util.destroy(kanbanObj);
            //isExpanded
            model = {
                columns: [{isExpanded :null}]
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.columns[0].isExpanded).toBe(null);
            util.destroy(kanbanObj);
            model = {
                columns: [{isExpanded :undefined}]
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.columns[0].isExpanded).toBe(true);
            util.destroy(kanbanObj);

            //keyField
            model = {
                columns: [{keyField :null}]
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.columns[0].keyField).toBe(null);
            util.destroy(kanbanObj);
            model = {
                columns: [{keyField :undefined}]
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.columns[0].keyField).toBe(undefined);
            util.destroy(kanbanObj);

            //maxCount
            model = {
                columns: [{maxCount :null}]
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.columns[0].maxCount).toBe(null);
            util.destroy(kanbanObj);
            model = {
                columns: [{maxCount :undefined}]
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.columns[0].maxCount).toBe(undefined);
            util.destroy(kanbanObj);

            //minCount
            model = {
                columns: [{minCount :null}]
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.columns[0].minCount).toBe(null);
            util.destroy(kanbanObj);
            model = {
                columns: [{minCount :undefined}]
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.columns[0].minCount).toBe(undefined);
            util.destroy(kanbanObj);

            //showAddButton
            model = {
                columns: [{showAddButton :null}]
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.columns[0].showAddButton).toBe(null);
            util.destroy(kanbanObj);
            model = {
                columns: [{showAddButton :undefined}]
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.columns[0].showAddButton).toBe(false);
            util.destroy(kanbanObj);

            //showItemCount
            model = {
                columns: [{showItemCount :null}]
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.columns[0].showItemCount).toBe(null);
            util.destroy(kanbanObj);
            model = {
                columns: [{showItemCount :undefined}]
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.columns[0].showItemCount).toBe(true);
            util.destroy(kanbanObj);

            //template
            model = {
                columns: [{template :null}]
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.columns[0].template).toBe(null);
            util.destroy(kanbanObj);
            model = {
                columns: [{template :undefined}]
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.columns[0].template).toBe(undefined);
            util.destroy(kanbanObj);
        });
        it("constraintType", () => {
            model = {
                constraintType: null
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.constraintType).toBe(null);
            util.destroy(kanbanObj);
            model = {
                constraintType: undefined
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.constraintType).toBe('Column');
            util.destroy(kanbanObj);
        });
        it("cssClass", () => {
            model = {
                cssClass: null
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.cssClass).toBe(null);
            util.destroy(kanbanObj);
            model = {
                cssClass: undefined
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.cssClass).toBe(undefined);
            util.destroy(kanbanObj);
        });
        it("dataSource", () => {
            model = {
                dataSource: null
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.dataSource).toBe(null);
            util.destroy(kanbanObj);
            model = {
                dataSource: null
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.dataSource).toBe(null);
            util.destroy(kanbanObj);
        });
        it("dialogSettings", () => {
            model = {
                dialogSettings: {template: null}
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.dialogSettings.template).toBe(null);
            util.destroy(kanbanObj);
            model = {
                dialogSettings: {template: null}
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.dialogSettings.template).toBe(null);
            util.destroy(kanbanObj);

            //animationSettings
            model = {
                dialogSettings: {model: {animationSettings: null}}
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.dialogSettings.model.animationSettings).toBe(null);
            util.destroy(kanbanObj);
            model = {
                dialogSettings: {model: {animationSettings: null}}
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.dialogSettings.model.animationSettings).toBe(null);
            util.destroy(kanbanObj);

            //closeOnEscape
            model = {
                dialogSettings: {model: {closeOnEscape: null}}
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.dialogSettings.model.closeOnEscape).toBe(null);
            util.destroy(kanbanObj);
            model = {
                dialogSettings: {model: {closeOnEscape: undefined}}
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.dialogSettings.model.closeOnEscape).toBe(undefined);
            util.destroy(kanbanObj);

            //cssClass
            model = {
                dialogSettings: {model: {cssClass: null}}
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.dialogSettings.model.cssClass).toBe(null);
            util.destroy(kanbanObj);
            model = {
                dialogSettings: {model: {cssClass: undefined}}
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.dialogSettings.model.cssClass).toBe(undefined);
            util.destroy(kanbanObj);

            //enableResize
            model = {
                dialogSettings: {model: {enableResize: null}}
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.dialogSettings.model.enableResize).toBe(null);
            util.destroy(kanbanObj);
            model = {
                dialogSettings: {model: {enableResize: null}}
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.dialogSettings.model.enableResize).toBe(null);
            util.destroy(kanbanObj);

            //height
            model = {
                dialogSettings: {model: {height: null}}
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.dialogSettings.model.height).toBe(null);
            util.destroy(kanbanObj);
            model = {
                dialogSettings: {model: {height: undefined}}
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.dialogSettings.model.height).toBe(undefined);
            util.destroy(kanbanObj);

            //isModal
            model = {
                dialogSettings: {model: {isModal: null}}
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.dialogSettings.model.isModal).toBe(null);
            util.destroy(kanbanObj);
            model = {
                dialogSettings: {model: {isModal: null}}
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.dialogSettings.model.isModal).toBe(null);
            util.destroy(kanbanObj);

            //minHeight
            model = {
                dialogSettings: {model: {minHeight: null}}
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.dialogSettings.model.minHeight).toBe(null);
            util.destroy(kanbanObj);
            model = {
                dialogSettings: {model: {minHeight: undefined}}
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.dialogSettings.model.minHeight).toBe(undefined);
            util.destroy(kanbanObj);

            //showCloseIcon
            model = {
                dialogSettings: {model: {showCloseIcon: null}}
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.dialogSettings.model.showCloseIcon).toBe(null);
            util.destroy(kanbanObj);
            model = {
                dialogSettings: {model: {showCloseIcon: undefined}}
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.dialogSettings.model.showCloseIcon).toBe(undefined);
            util.destroy(kanbanObj);

            //target
            model = {
                dialogSettings: {model: {target: null}}
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.dialogSettings.model.target).toBe(null);
            util.destroy(kanbanObj);
            model = {
                dialogSettings: {model: {target: undefined}}
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.dialogSettings.model.target).toBe(undefined);
            util.destroy(kanbanObj);

            //width
            model = {
                dialogSettings: {model: {width: null}}
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.dialogSettings.model.width).toBe(null);
            util.destroy(kanbanObj);
            model = {
                dialogSettings: {model: {width: undefined}}
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.dialogSettings.model.width).toBe(undefined);
            util.destroy(kanbanObj);
        });
        it("enableHtmlSanitizer", () => {
            model = {
                enableHtmlSanitizer: null
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.enableHtmlSanitizer).toBe(null);
            util.destroy(kanbanObj);
            model = {
                enableHtmlSanitizer: undefined
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.enableHtmlSanitizer).toBe(true);
            util.destroy(kanbanObj);
        });
        it("enablePersistence", () => {
            model = {
                enablePersistence: null
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.enablePersistence).toBe(null);
            util.destroy(kanbanObj);
            model = {
                enablePersistence: undefined
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.enablePersistence).toBe(false);
            util.destroy(kanbanObj);
        });
        it("enableRtl", () => {
            model = {
                enableRtl: null
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.enableRtl).toBe(false);
            util.destroy(kanbanObj);
            model = {
                enableRtl: undefined
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.enableRtl).toBe(false);
            util.destroy(kanbanObj);
        });
        it("enableTooltip", () => {
            model = {
                enableTooltip: null
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.enableTooltip).toBe(null);
            util.destroy(kanbanObj);
            model = {
                enableTooltip: undefined
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.enableTooltip).toBe(false);
            util.destroy(kanbanObj);
        });
        it("enableVirtualization", () => {
            model = {
                enableVirtualization: null
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.enableVirtualization).toBe(null);
            util.destroy(kanbanObj);
            model = {
                enableVirtualization: undefined
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.enableVirtualization).toBe(undefined);
            util.destroy(kanbanObj);
        });
        it("externalDropId", () => {
            model = {
                externalDropId: null
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.externalDropId).toBe(null);
            util.destroy(kanbanObj);
            model = {
                externalDropId: undefined
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.externalDropId.length).toBe(0);
            util.destroy(kanbanObj);
        });
        it("height", () => {
            model = {
                height: null
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.height).toBe(null);
            util.destroy(kanbanObj);
            model = {
                height: undefined
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.height).toBe('auto');
            util.destroy(kanbanObj);
        });
        it("keyField", () => {
            model = {
                keyField: null
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.keyField).toBe(null);
            util.destroy(kanbanObj);
            model = {
                keyField: undefined
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.keyField).toBe(undefined);
            util.destroy(kanbanObj);
        });
        it("locale", () => {
            model = {
                locale: null
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.locale).toBe('en-US');
            util.destroy(kanbanObj);
            model = {
                locale: undefined
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.locale).toBe('en-US');
            util.destroy(kanbanObj);
        });
        it("stackedHeaders", () => {
            model = {
                stackedHeaders: [{keyFields:null}]
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.stackedHeaders[0].keyFields).toBe(null);
            util.destroy(kanbanObj);
            model = {
                stackedHeaders: [{keyFields:undefined}]
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.stackedHeaders[0].keyFields).toBe(undefined);
            util.destroy(kanbanObj);
        });
        it("swimlaneSettings", () => {
            model = {
                swimlaneSettings: {allowDragAndDrop: null}
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.swimlaneSettings.allowDragAndDrop).toBe(null);
            util.destroy(kanbanObj);
            model = {
                swimlaneSettings: {allowDragAndDrop: undefined}
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.swimlaneSettings.allowDragAndDrop).toBe(false);
            util.destroy(kanbanObj);
        });
        it("tooltipTemplate", () => {
            model = {
                tooltipTemplate: null
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.tooltipTemplate).toBe(null);
            util.destroy(kanbanObj);
            model = {
                tooltipTemplate: undefined
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.tooltipTemplate).toBe(undefined);
            util.destroy(kanbanObj);
        });
        it("width", () => {
            model = {
                width: null
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.width).toBe(null);
            util.destroy(kanbanObj);
            model = {
                width: undefined
            };
            kanbanObj = util.createKanban(model, kanbanData);
            expect(kanbanObj.width).toBe('auto');
            util.destroy(kanbanObj);
        });
    });

    describe('949142 -Kanban Item becomes blank  in small screen size when we scroll the items up and down continuously', () => {
        let kanbanObj: Kanban;
        beforeAll(() => {
            const element: HTMLElement = createElement('div', { id: 'Kanban' });
            document.body.appendChild(element);
            // eslint-disable-next-line no-console
            const defaultOptions: KanbanModel = {
                enableVirtualization: true,
                dataSource: generateKanbanData(),
                keyField: 'Status',
                columns: [
                    { headerText: 'Backlog', keyField: 'Open' },
                    { headerText: 'In Progress', keyField: 'InProgress' },
                    { headerText: 'Review', keyField: 'Review' }
                ],
                cardSettings: {
                    contentField: 'Summary',
                    headerField: 'Id'
                },
                height: '800px',
                cardHeight: '120px',
            };
            kanbanObj = new Kanban(defaultOptions);
            kanbanObj.appendTo(element);
        });
        it('Kanban minimum card testing', (done: Function) => {
            setTimeout(() => {
                const cardWrapper: HTMLElement = kanbanObj.element.querySelector('.e-kanban-content').querySelectorAll('.e-content-cells')[1].querySelector('.e-card-wrapper');
                util.triggerScrollEvent(cardWrapper, 100);
                setTimeout(() => {
                    const virtualWrapperElementList: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-card-virtual-wrapper');
                    expect(virtualWrapperElementList[0].childElementCount).toBeLessThanOrEqual(30);
                    done();
                }, 2500);
            }, 500);
        });
        afterAll(() => {
            kanbanObj.destroy();
            remove(document.getElementById(kanbanObj.element.id));
        });
    });
});
/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Kanban base spec
 */
import { closest, createElement, remove } from '@syncfusion/ej2-base';
import { Query, DataManager } from '@syncfusion/ej2-data';
import { Kanban, KanbanModel, ColumnsModel } from '../../src/kanban/index';
import { generateKanbanDataVirtualScroll } from './common/kanban-data.spec';
import { profile, inMB, getMemoryProfile } from './common/common.spec';
import * as util from './common/util.spec';

Kanban.Inject();

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
                kanbanObj.appendTo('#Kanban_Bug_826595');
                done();
            }, 1000);
        });
        it('Scrolling down testing of the first column', (done: Function) => {
            setTimeout(() => {
                const cardWrapper: HTMLElement = kanbanObj.element.querySelector('.e-card-wrapper');
                expect(cardWrapper.querySelector('.e-card-virtual-wrapper').children[0].getAttribute('data-id')).toBe('1');
                util.triggerScrollEvent(cardWrapper, cardWrapper.scrollHeight);
                setTimeout(() => {
                    expect(cardWrapper.querySelector('.e-card-virtual-wrapper').children[0].getAttribute('data-id')).not.toBe('1');
                    done();
                }, 2500);
            }, 500);
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

});
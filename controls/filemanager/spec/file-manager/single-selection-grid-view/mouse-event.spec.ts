/**
 * FileManager spec document
 */
import { FileManager } from '../../../src/file-manager/base/file-manager';
import { NavigationPane } from '../../../src/file-manager/layout/navigation-pane';
import { DetailsView } from '../../../src/file-manager/layout/details-view';
import { Toolbar } from '../../../src/file-manager/actions/toolbar';
import { extend } from '@syncfusion/ej2-grids';
import { createElement, closest } from '@syncfusion/ej2-base';
import { toolbarItems3, data1, data3, data4 } from '../data';

FileManager.Inject(Toolbar, NavigationPane, DetailsView);

function eventObject(eventType: string, eventName: string): Object {
    let tempEvent: any = document.createEvent(eventType);
    tempEvent.initEvent(eventName, true, true);
    let returnObject: any = extend({}, tempEvent);
    returnObject.preventDefault = () => { return true; };
    return returnObject;
}

describe('FileManager control single selection Grid view', () => {
    
    describe('Grid viewtesting', () => {
        let mouseEventArgs: any, tapEvent: any;
        let feObj: FileManager;
        let ele: HTMLElement;
        let originalTimeout: any;
        beforeEach((done: Function): void => {
            jasmine.Ajax.install();
            feObj = undefined;
            ele = createElement('div', { id: 'file' });
            document.body.appendChild(ele);
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                toolbarSettings: {
                    visible: true,
                    items: ['NewFolder']
                },
                allowMultiSelection: false,
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
            setTimeout(function () {
                done();
            }, 500);
            mouseEventArgs = {
                preventDefault: (): void => { },
                stopImmediatePropagation: (): void => { },
                target: null,
                type: null,
                shiftKey: false,
                ctrlKey: false,
                originalEvent: { target: null }
            };
            tapEvent = {
                originalEvent: mouseEventArgs,
                tapCount: 1
            };
        });
        afterEach((): void => {
            jasmine.Ajax.uninstall();
            if (feObj) feObj.destroy();
            ele.remove();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        it('script error for grid header sort with no sortby in toolbar', () => {
            expect(feObj.sortOrder).toBe('Ascending');
            (<HTMLElement>document.getElementsByClassName('e-sortfilterdiv')[1]).click();
            expect(feObj.sortOrder).toBe( 'Descending');
        });
    });
    describe('mouse event testing', () => {
        let mouseEventArgs: any, tapEvent: any;
        let feObj: FileManager;
        let ele: HTMLElement;
        let originalTimeout: any;
        beforeEach((done: Function): void => {
            jasmine.Ajax.install();
            feObj = undefined;
            ele = createElement('div', { id: 'file' });
            document.body.appendChild(ele);
            feObj = new FileManager({
                view: 'Details',
                allowMultiSelection: false,
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                toolbarSettings: {
                    visible: true,
                    items: toolbarItems3
                },
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
            setTimeout(function () {
                done();
            }, 500);
            mouseEventArgs = {
                preventDefault: (): void => { },
                stopImmediatePropagation: (): void => { },
                target: null,
                type: null,
                shiftKey: false,
                ctrlKey: false,
                originalEvent: { target: null }
            };
            tapEvent = {
                originalEvent: mouseEventArgs,
                tapCount: 1
            };
        });
        afterEach((): void => {
            jasmine.Ajax.uninstall();
            if (feObj) feObj.destroy();
            ele.remove();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        it('title attribute testing', () => {
            let li: Element[] = feObj.detailsviewModule.gridObj.getRows();
            for (let i: number = 0; i < li.length; i++) {
                let ele: Element = li[i].querySelector('.e-fe-text');
                expect(ele.getAttribute('title')).toBe(null);
                expect(closest(ele, 'td').getAttribute('title')).toBe(ele.textContent);
            }
            let Li :any = feObj.navigationpaneModule.treeObj.element.querySelectorAll('li');
            for (let i: number = 0; i < Li.length; i++) {
                expect(Li[i].getAttribute('title')).toBe(Li[i].querySelector('.e-list-text').textContent);
            }
        });   
        it('mouse click on TreeView text', (done: Function) => {
            var treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
            expect((li[0] as Element).classList.contains('e-active')).toBe(true);
            expect(li.length).toEqual(5);
            mouseEventArgs.target = li[0].querySelector('.e-fullrow');
            treeObj.touchClickObj.tap(tapEvent);
            let li1: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
            expect((li[0] as Element).classList.contains('e-active')).toBe(true);
            expect(li1.length).toEqual(5);
            mouseEventArgs.target = li[1].querySelector('.e-fullrow');
            treeObj.touchClickObj.tap(tapEvent);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            setTimeout(function () {
                expect(document.getElementById('file_grid').querySelector('.e-spinner-pane').classList.contains('e-spin-show')).toEqual(false);
                expect(document.getElementById('file_grid').querySelector('.e-spinner-pane').classList.contains('e-spin-hide')).toEqual(true);
                let li2: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
                expect((li[0] as Element).classList.contains('e-active')).toBe(false);
                expect((li[1] as Element).classList.contains('e-active')).toBe(true);
                expect(li2.length).toEqual(9);
                mouseEventArgs.target = li[2].querySelector('.e-fullrow');
                treeObj.touchClickObj.tap(tapEvent);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data3)
                });
                setTimeout(() => {
                    let li3: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
                    expect((li[1] as Element).classList.contains('e-active')).toBe(false);
                    expect((li[2] as Element).classList.contains('e-active')).toBe(true);
                    expect(li3.length).toEqual(9);
                    // create new folder
                    let items: any = document.getElementsByClassName('e-toolbar-item');
                    items[0].click();
                    setTimeout(function () {
                        expect((document.getElementById('file_dialog').querySelector('#newname') as any).value).toEqual("");
                        let ele: HTMLInputElement = document.getElementById('file_dialog').querySelector('#newname') as HTMLInputElement;
                        ele.value = "New folder";
                        (document.getElementById('file_dialog').querySelectorAll('.e-btn')[1] as HTMLElement).click();
                        this.request = jasmine.Ajax.requests.mostRecent();
                        this.request.respondWith({
                            status: 200,
                            responseText: JSON.stringify(data4)
                        });
                        this.request = jasmine.Ajax.requests.mostRecent();
                        this.request.respondWith({
                            status: 200,
                            responseText: JSON.stringify(data4)
                        });
                        setTimeout(function () {
                            let li1: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
                            expect(li1.length).toEqual(10);
                            expect(document.getElementById('file_grid').querySelectorAll('.e-row').length).toEqual(1);
                            mouseEventArgs.target = li[0].querySelector('.e-fullrow');
                            treeObj.touchClickObj.tap(tapEvent);
                            this.request = jasmine.Ajax.requests.mostRecent();
                            this.request.respondWith({
                                status: 200,
                                responseText: JSON.stringify(data1)
                            });
                            setTimeout(function () {
                                this.request = jasmine.Ajax.requests.mostRecent();
                                this.request.respondWith({
                                    status: 200,
                                    responseText: JSON.stringify(data1)
                                });
                                this.request = jasmine.Ajax.requests.mostRecent();
                                this.request.respondWith({
                                    status: 200,
                                    responseText: JSON.stringify(data1)
                                });
                                setTimeout(function () {
                                    expect(document.getElementById('file_grid').querySelectorAll('.e-row').length).toEqual(5);
                                    done();
                                }, 500);
                            }, 500);
                        }, 500);
                    }, 500);
                }, 500);
            }, 500);
        });
    });
});
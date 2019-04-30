/**
 * FileManager spec document
 */
import { FileManager } from '../../../src/file-manager/base/file-manager';
import {NavigationPane} from '../../../src/file-manager/layout/navigation-pane';
import {DetailsView} from '../../../src/file-manager/layout/details-view';
import { Toolbar } from '../../../src/file-manager/actions/toolbar';
import { createElement, Browser, EventHandler, isNullOrUndefined, select } from '@syncfusion/ej2-base';
import { toolbarItems, toolbarItems1, toolbarItems3, data1, data2, data3, data4, data5, data6, data7, data8, data9, data12, data13, UploadData, rename, renameExist, renameExtension, renamed_ext, renamedwithout_ext, getMultipleDetails, pastesuccess, paste1 } from '../data';
import { extend } from '@syncfusion/ej2-grids';

FileManager.Inject(Toolbar, NavigationPane, DetailsView);

function eventObject(eventType: string, eventName: string): Object {
    let tempEvent: any = document.createEvent(eventType);
    tempEvent.initEvent(eventName, true, true);
    let returnObject: any = extend({}, tempEvent);
    returnObject.preventDefault = () => { return true; };
    return returnObject;
}

describe('FileManager control single selection Grid view', () => {
    describe('toolbar items testing', () => {
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
            }, '#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
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
        it('mouse click on create new folder button', (done: Function) => {
            //create new folder
            let items: any = document.getElementsByClassName('e-toolbar-item');
            items[0].click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
                expect(li.length).toEqual(5);
                expect(document.getElementById('file_grid').querySelectorAll('.e-row').length).toEqual(5);
                expect((document.getElementById('file_dialog').querySelector('#newname') as any).value).toEqual("");
                let ele: HTMLInputElement = document.getElementById('file_dialog').querySelector('#newname') as HTMLInputElement;
                ele.value = "New folder";
                (document.getElementById('file_dialog').querySelectorAll('.e-btn')[1] as HTMLElement).click();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data4)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data5)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    let li1: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
                    expect(li1.length).toEqual(6);
                    expect(document.getElementById('file_grid').querySelectorAll('.e-row').length).toEqual(6);
                    expect(document.getElementById('file_grid').querySelectorAll('.e-row')[4].getAttribute('aria-selected')).toBe('true');
                    //create new folder with exisiting name
                    items[0].click();
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect((document.getElementById('file_dialog').querySelector('#newname') as any).value).toEqual("");
                        let ele: HTMLInputElement = document.getElementById('file_dialog').querySelector('#newname') as HTMLInputElement;
                        (document.getElementById('file_dialog').querySelectorAll('.e-btn')[1] as HTMLElement).click();
                        //expect(ele.parentElement.nextElementSibling.textContent).toEqual('The file or folder name cannot be empty.');
                        ele.value = "New folder";
                        (document.getElementById('file_dialog').querySelectorAll('.e-btn')[1] as HTMLElement).click();
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                        setTimeout(function () {
                            this.request = jasmine.Ajax.requests.mostRecent();
                            this.request.respondWith({
                                status: 200,
                                responseText: JSON.stringify(data6)
                            });
                            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                            setTimeout(function () {
                                let li2: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
                                expect(li2.length).toEqual(6);
                                expect(document.getElementById('file_grid').querySelectorAll('.e-row').length).toEqual(6);
                                expect(document.getElementById('file_dialog').querySelector('.e-dlg-header').textContent).toEqual("Error");
                                (document.getElementById('file_dialog').querySelectorAll('.e-btn')[1] as HTMLElement).click();
                                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                                setTimeout(function () {
                                    //cancel the create folder dialog
                                    items[0].click();
                                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                                    setTimeout(function () {
                                        expect((document.getElementById('file_dialog').querySelector('#newname') as any).value).toEqual("");
                                        let ele: HTMLInputElement = document.getElementById('file_dialog').querySelector('#newname') as HTMLInputElement;
                                        ele.value = "New folder";
                                        (feObj as any).dialogObj.hide();
                                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                                        setTimeout(function () {
                                            let li3: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
                                            expect(li3.length).toEqual(6);
                                            expect(document.getElementById('file_grid').querySelectorAll('.e-row').length).toEqual(6);
                                            items[0].click();
                                            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                                            setTimeout(function () {
                                                expect((document.getElementById('file_dialog').querySelector('#newname') as any).value).toEqual("");
                                                let ele: HTMLInputElement = document.getElementById('file_dialog').querySelector('#newname') as HTMLInputElement;
                                                ele.value = "New folder*";
                                                var inputEvent = new Event('input', { 'bubbles': true, 'cancelable': true });
                                                ele.dispatchEvent(inputEvent);
                                                expect(ele.parentElement.nextElementSibling.textContent).toEqual('The file or folder name "New folder*" contains invalid characters. Please use a different name. Valid file or folder names cannot end with a dot or space, and cannot contain any of the following characters: \\/:*?\"<>|');
                                                ele.onkeyup({ 'bubbles': true, 'cancelable': true, ctrlKey: true, which: 83 } as any);
                                                ele.onkeyup({ 'bubbles': true, 'cancelable': true, ctrlKey: true, charCode: 83 } as any);
                                                ele.value = "New folders";
                                                var inputEvent = new Event('input', { 'bubbles': true, 'cancelable': true });
                                                ele.dispatchEvent(inputEvent);
                                                ele.onkeyup({ 'bubbles': true, 'cancelable': true, ctrlKey: true, keyCode: 13, key: 'Enter', which: 13 } as any);
                                                this.request = jasmine.Ajax.requests.mostRecent();
                                                this.request.respondWith({
                                                    status: 200,
                                                    responseText: JSON.stringify(data4)
                                                });
                                                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                                                this.request = jasmine.Ajax.requests.mostRecent();
                                                this.request.respondWith({
                                                    status: 200,
                                                    responseText: JSON.stringify(data5)
                                                });
                                                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                                                setTimeout(function () {
                                                    let li1: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
                                                    expect(li1.length).toEqual(6);
                                                    expect(document.getElementById('file_grid').querySelectorAll('.e-row').length).toEqual(6);
                                                    done();
                                                }, 500);
                                            }, 500);
                                        }, 500);
                                    }, 500);
                                }, 500);
                            }, 500);
                        }, 500);
                    }, 500);
                }, 500);
            }, 500);
        });
        it('mouse click on refresh button', (done: Function) => {
            feObj.detailsviewModule.gridObj.selectRows([1, 2]);
            document.getElementById('file_tree').querySelectorAll('li')[1].remove();
            document.getElementById('file_grid').querySelectorAll('.e-row')[0].remove();
            document.getElementsByClassName('e-addressbar-ul')[0].querySelector('li').remove();
            let li: any = document.getElementById('file_tree').querySelectorAll('li');
            let tr: any = document.getElementById('file_grid').querySelectorAll('.e-row');
            let ar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
            expect(li.length).toEqual(4);
            expect(tr.length).toEqual(4);
            expect(ar.length).toEqual(0);
            expect(tr[0].getAttribute('aria-selected')).toBe(null);
            expect(tr[0].querySelector('.e-frame')).toBe(null);
            expect(tr[1].getAttribute('aria-selected')).toEqual('true');
            expect(tr[1].querySelector('.e-frame')).toBe(null);
            let items: any = document.getElementsByClassName('e-fe-refresh');
            items[0].click();
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                let nli: any = document.getElementById('file_tree').querySelectorAll('li');
                let ntr: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                expect(nli.length).toEqual(5);
                expect(ntr.length).toEqual(5);
                expect(nar.length).toEqual(1);
                expect(ntr[1].getAttribute('aria-selected')).toBe(null);
                expect(ntr[1].querySelector('.e-frame')).toBe(null);
                expect(ntr[2].getAttribute('aria-selected')).toEqual('true');
                expect(ntr[2].querySelector('.e-frame')).toBe(null);
                done();
            }, 500);
        });
    });
});
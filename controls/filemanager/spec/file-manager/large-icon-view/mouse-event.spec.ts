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


describe('FileManager control LargeIcons view', () => {
    describe('mouse event testing', () => {
        let mouseEventArgs: any, tapEvent: any;
        let feObj: any;
        let ele: HTMLElement;
        let originalTimeout: any;
        beforeEach((done: Function): void => {
            jasmine.Ajax.install();
            feObj = undefined;
            ele = createElement('div', { id: 'file' });
            document.body.appendChild(ele);
            feObj = new FileManager({
                view: 'LargeIcons',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
            }, '#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data12)
            });
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
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
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                done();
            }, 500);
        });
        afterEach((): void => {
            jasmine.Ajax.uninstall();
            if (feObj) feObj.destroy();
            ele.remove();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        it('mouse click on file', () => {
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li[4].classList.contains('e-active')).toBe(false);
            expect(li[4].classList.contains('e-focus')).toBe(false);
            expect(li[4].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            mouseEventArgs.target = li[4];
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            let nli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(nli[4].classList.contains('e-active')).toBe(true);
            expect(nli[4].classList.contains('e-focus')).toBe(true);
            expect(nli[4].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
        });
        it('mouse double click on file', () => {
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li[4].classList.contains('e-active')).toBe(false);
            expect(li[4].classList.contains('e-focus')).toBe(false);
            expect(li[4].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            mouseEventArgs.target = li[4];
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            tapEvent.tapCount = 2;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            let nli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(nli[4].classList.contains('e-active')).toBe(true);
            expect(nli[4].classList.contains('e-focus')).toBe(true);
            expect(nli[4].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
        });
        it('mouse click on folder', () => {
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li[0].classList.contains('e-active')).toBe(false);
            expect(li[0].classList.contains('e-focus')).toBe(false);
            expect(li[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            mouseEventArgs.target = li[0];
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            let nli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(nli[0].classList.contains('e-active')).toBe(true);
            expect(nli[0].classList.contains('e-focus')).toBe(true);
            expect(nli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            mouseEventArgs.target = nli[4];
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            let neli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(neli[0].classList.contains('e-active')).toBe(false);
            expect(neli[0].classList.contains('e-focus')).toBe(false);
            expect(neli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            expect(neli[4].classList.contains('e-active')).toBe(true);
            expect(neli[4].classList.contains('e-focus')).toBe(true);
            expect(neli[4].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
        });
        it('mouse double click on folder', (done: Function) => {
            var treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li.length).toBe(9);
            mouseEventArgs.target = li[0];
            tapEvent.tapCount = 2;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
            setTimeout(function () {
                let li1: any = document.getElementById('file_largeicons').querySelectorAll('li');
                expect(li1.length).toBe(5);
                let li2: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
                expect((li2[0] as Element).classList.contains('e-active')).toBe(false);
                expect((li2[1] as Element).classList.contains('e-active')).toBe(true);
                mouseEventArgs.target = li1[0];
                tapEvent.tapCount = 2;
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data3)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
                setTimeout(function () {
                    let li3: any = document.getElementById('file_largeicons').querySelectorAll('li');
                    expect(li3.length).toBe(0);
                    let li4: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
                    expect((li4[1] as Element).classList.contains('e-active')).toBe(false);
                    expect((li4[2] as Element).classList.contains('e-active')).toBe(true);
                    mouseEventArgs.target = li4[0].querySelector('.e-fullrow');
                    treeObj.touchClickObj.tap(tapEvent);
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify(data12)
                    });
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        let li5: any = document.getElementById('file_largeicons').querySelectorAll('li');
                        expect(li5.length).toBe(9);
                        let nli5: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
                        expect((nli5[2] as Element).classList.contains('e-active')).toBe(false);
                        expect((nli5[0] as Element).classList.contains('e-active')).toBe(true);
                        mouseEventArgs.target = li5[0];
                        tapEvent.tapCount = 2;
                        feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                        this.request = jasmine.Ajax.requests.mostRecent();
                        this.request.respondWith({
                            status: 200,
                            responseText: JSON.stringify(data1)
                        });
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
                        setTimeout(function () {
                            let li6: any = document.getElementById('file_largeicons').querySelectorAll('li');
                            expect(li6.length).toBe(5);
                            let li7: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
                            expect((li7[0] as Element).classList.contains('e-active')).toBe(false);
                            expect((li7[1] as Element).classList.contains('e-active')).toBe(true);
                            done();
                        }, 500);
                    }, 500);
                }, 500);
            }, 500);
        });
        it('mouse click on checkbox', () => {
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li[0].classList.contains('e-active')).toBe(false);
            expect(li[0].classList.contains('e-focus')).toBe(false);
            expect(li[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            mouseEventArgs.target = li[0].querySelector('.e-frame');
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            let nli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(nli[0].classList.contains('e-active')).toBe(true);
            expect(nli[0].classList.contains('e-focus')).toBe(true);
            expect(nli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            mouseEventArgs.target = nli[1].querySelector('.e-frame');
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            let neli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(neli[0].classList.contains('e-active')).toBe(true);
            expect(neli[0].classList.contains('e-focus')).toBe(false);
            expect(neli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(neli[1].classList.contains('e-active')).toBe(true);
            expect(neli[1].classList.contains('e-focus')).toBe(true);
            expect(neli[1].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            mouseEventArgs.target = neli[1].querySelector('.e-frame');
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            let newli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(newli[1].classList.contains('e-active')).toBe(false);
            expect(newli[1].classList.contains('e-focus')).toBe(true);
            expect(newli[1].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
        });
        it('mouse click on wrapper', () => {
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            let ul: any = document.getElementById('file_largeicons').querySelectorAll('ul');
            expect(li[0].classList.contains('e-active')).toBe(false);
            expect(li[0].classList.contains('e-focus')).toBe(false);
            expect(li[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            mouseEventArgs.target = ul[0];
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            let nli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(nli[0].classList.contains('e-active')).toBe(false);
            expect(nli[0].classList.contains('e-focus')).toBe(false);
            expect(nli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            mouseEventArgs.target = li[0];
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            let neli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(neli[0].classList.contains('e-active')).toBe(true);
            expect(neli[0].classList.contains('e-focus')).toBe(true);
            expect(neli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            mouseEventArgs.target = ul[0];
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            let newli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(newli[0].classList.contains('e-active')).toBe(false);
            expect(newli[0].classList.contains('e-focus')).toBe(true);
            expect(newli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
        });
        it('mouse double click on wrapper', () => {
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            let ul: any = document.getElementById('file_largeicons').querySelectorAll('ul');
            expect(li[0].classList.contains('e-active')).toBe(false);
            expect(li[0].classList.contains('e-focus')).toBe(false);
            expect(li[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            mouseEventArgs.target = ul[0];
            tapEvent.tapCount = 2;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            let nli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(nli[0].classList.contains('e-active')).toBe(false);
            expect(nli[0].classList.contains('e-focus')).toBe(false);
            expect(nli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            mouseEventArgs.target = li[0];
            tapEvent.tapCount = 1;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            let neli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(neli[0].classList.contains('e-active')).toBe(true);
            expect(neli[0].classList.contains('e-focus')).toBe(true);
            expect(neli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            mouseEventArgs.target = ul[0];
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            tapEvent.tapCount = 2;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            let newli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(newli[0].classList.contains('e-active')).toBe(false);
            expect(newli[0].classList.contains('e-focus')).toBe(true);
            expect(newli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
        });
        it('mouse click with ctrlKey', () => {
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li[4].classList.contains('e-active')).toBe(false);
            expect(li[4].classList.contains('e-focus')).toBe(false);
            expect(li[4].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            mouseEventArgs.target = li[4];
            mouseEventArgs.ctrlKey = true;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            let nli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(nli[4].classList.contains('e-active')).toBe(true);
            expect(nli[4].classList.contains('e-focus')).toBe(true);
            expect(nli[4].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            mouseEventArgs.target = nli[6];
            mouseEventArgs.ctrlKey = true;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            let neli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(neli[4].classList.contains('e-active')).toBe(true);
            expect(neli[4].classList.contains('e-focus')).toBe(false);
            expect(neli[4].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(neli[6].classList.contains('e-active')).toBe(true);
            expect(neli[6].classList.contains('e-focus')).toBe(true);
            expect(neli[6].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            mouseEventArgs.target = neli[2];
            mouseEventArgs.ctrlKey = true;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            let newli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(newli[4].classList.contains('e-active')).toBe(true);
            expect(newli[4].classList.contains('e-focus')).toBe(false);
            expect(newli[4].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(newli[6].classList.contains('e-active')).toBe(true);
            expect(newli[6].classList.contains('e-focus')).toBe(false);
            expect(newli[6].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(newli[2].classList.contains('e-active')).toBe(true);
            expect(newli[2].classList.contains('e-focus')).toBe(true);
            expect(newli[2].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            mouseEventArgs.target = newli[2];
            mouseEventArgs.ctrlKey = true;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            let newli1: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(newli1[4].classList.contains('e-active')).toBe(true);
            expect(newli1[4].classList.contains('e-focus')).toBe(false);
            expect(newli1[4].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(newli1[6].classList.contains('e-active')).toBe(true);
            expect(newli1[6].classList.contains('e-focus')).toBe(false);
            expect(newli1[6].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(newli1[2].classList.contains('e-active')).toBe(false);
            expect(newli1[2].classList.contains('e-focus')).toBe(true);
            expect(newli1[2].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            let ul: any = document.getElementById('file_largeicons').querySelectorAll('ul');
            mouseEventArgs.target = ul[0];
            mouseEventArgs.ctrlKey = true;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            let newli2: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(newli2[4].classList.contains('e-active')).toBe(false);
            expect(newli2[4].classList.contains('e-focus')).toBe(false);
            expect(newli2[4].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            expect(newli2[6].classList.contains('e-active')).toBe(false);
            expect(newli2[6].classList.contains('e-focus')).toBe(false);
            expect(newli2[6].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            expect(newli2[2].classList.contains('e-active')).toBe(false);
            expect(newli2[2].classList.contains('e-focus')).toBe(true);
            expect(newli2[2].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
        });
        it('mouse click with shiftKey', () => {
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li[4].classList.contains('e-active')).toBe(false);
            expect(li[4].classList.contains('e-focus')).toBe(false);
            expect(li[4].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            mouseEventArgs.target = li[4];
            mouseEventArgs.shiftKey = true;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            let nli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(nli[4].classList.contains('e-active')).toBe(true);
            expect(nli[4].classList.contains('e-focus')).toBe(true);
            expect(nli[4].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            mouseEventArgs.target = nli[6];
            mouseEventArgs.shiftKey = true;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            let neli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(neli[4].classList.contains('e-active')).toBe(true);
            expect(neli[4].classList.contains('e-focus')).toBe(false);
            expect(neli[4].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(neli[5].classList.contains('e-active')).toBe(true);
            expect(neli[5].classList.contains('e-focus')).toBe(false);
            expect(neli[5].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(neli[6].classList.contains('e-active')).toBe(true);
            expect(neli[6].classList.contains('e-focus')).toBe(true);
            expect(neli[6].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            mouseEventArgs.target = neli[2];
            mouseEventArgs.shiftKey = true;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            let newli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(newli[4].classList.contains('e-active')).toBe(true);
            expect(newli[4].classList.contains('e-focus')).toBe(false);
            expect(newli[4].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(newli[5].classList.contains('e-active')).toBe(false);
            expect(newli[5].classList.contains('e-focus')).toBe(false);
            expect(newli[5].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            expect(newli[3].classList.contains('e-active')).toBe(true);
            expect(newli[3].classList.contains('e-focus')).toBe(false);
            expect(newli[3].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(newli[2].classList.contains('e-active')).toBe(true);
            expect(newli[2].classList.contains('e-focus')).toBe(true);
            expect(newli[2].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            mouseEventArgs.target = newli[2];
            mouseEventArgs.shiftKey = true;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            let newli1: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(newli1[4].classList.contains('e-active')).toBe(true);
            expect(newli1[4].classList.contains('e-focus')).toBe(false);
            expect(newli1[4].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(newli1[5].classList.contains('e-active')).toBe(false);
            expect(newli1[5].classList.contains('e-focus')).toBe(false);
            expect(newli1[5].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            expect(newli1[3].classList.contains('e-active')).toBe(true);
            expect(newli1[3].classList.contains('e-focus')).toBe(false);
            expect(newli1[3].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(newli1[2].classList.contains('e-active')).toBe(true);
            expect(newli1[2].classList.contains('e-focus')).toBe(true);
            expect(newli1[2].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            let ul: any = document.getElementById('file_largeicons').querySelectorAll('ul');
            mouseEventArgs.target = ul[0];
            mouseEventArgs.shiftKey = true;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            let newli2: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(newli2[4].classList.contains('e-active')).toBe(false);
            expect(newli2[4].classList.contains('e-focus')).toBe(false);
            expect(newli2[4].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            expect(newli2[3].classList.contains('e-active')).toBe(false);
            expect(newli2[3].classList.contains('e-focus')).toBe(false);
            expect(newli2[3].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            expect(newli2[2].classList.contains('e-active')).toBe(false);
            expect(newli2[2].classList.contains('e-focus')).toBe(true);
            expect(newli2[2].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
        });
        it('mouse click with ctrlKey and shiftKey', () => {
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li[4].classList.contains('e-active')).toBe(false);
            expect(li[4].classList.contains('e-focus')).toBe(false);
            expect(li[4].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            mouseEventArgs.target = li[4];
            mouseEventArgs.ctrlKey = true;
            mouseEventArgs.shiftKey = true;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            let nli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(nli[4].classList.contains('e-active')).toBe(true);
            expect(nli[4].classList.contains('e-focus')).toBe(true);
            expect(nli[4].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            mouseEventArgs.target = nli[6];
            mouseEventArgs.ctrlKey = true;
            mouseEventArgs.shiftKey = true;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            let neli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(neli[4].classList.contains('e-active')).toBe(true);
            expect(neli[4].classList.contains('e-focus')).toBe(false);
            expect(neli[4].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(neli[5].classList.contains('e-active')).toBe(true);
            expect(neli[5].classList.contains('e-focus')).toBe(false);
            expect(neli[5].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(neli[6].classList.contains('e-active')).toBe(true);
            expect(neli[6].classList.contains('e-focus')).toBe(true);
            expect(neli[6].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            mouseEventArgs.target = neli[2];
            mouseEventArgs.ctrlKey = true;
            mouseEventArgs.shiftKey = true;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            let newli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(newli[4].classList.contains('e-active')).toBe(true);
            expect(newli[4].classList.contains('e-focus')).toBe(false);
            expect(newli[4].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(newli[5].classList.contains('e-active')).toBe(true);
            expect(newli[5].classList.contains('e-focus')).toBe(false);
            expect(newli[5].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(newli[6].classList.contains('e-active')).toBe(true);
            expect(newli[6].classList.contains('e-focus')).toBe(false);
            expect(newli[6].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(newli[3].classList.contains('e-active')).toBe(true);
            expect(newli[3].classList.contains('e-focus')).toBe(false);
            expect(newli[3].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(newli[2].classList.contains('e-active')).toBe(true);
            expect(newli[2].classList.contains('e-focus')).toBe(true);
            expect(newli[2].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            mouseEventArgs.target = newli[2];
            mouseEventArgs.ctrlKey = true;
            mouseEventArgs.shiftKey = true;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            let newli1: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(newli1[4].classList.contains('e-active')).toBe(true);
            expect(newli1[4].classList.contains('e-focus')).toBe(false);
            expect(newli1[4].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(newli1[5].classList.contains('e-active')).toBe(true);
            expect(newli1[5].classList.contains('e-focus')).toBe(false);
            expect(newli1[5].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(newli1[6].classList.contains('e-active')).toBe(true);
            expect(newli1[6].classList.contains('e-focus')).toBe(false);
            expect(newli1[6].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(newli1[3].classList.contains('e-active')).toBe(true);
            expect(newli1[3].classList.contains('e-focus')).toBe(false);
            expect(newli1[3].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(newli1[2].classList.contains('e-active')).toBe(true);
            expect(newli1[2].classList.contains('e-focus')).toBe(true);
            expect(newli1[2].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            let ul: any = document.getElementById('file_largeicons').querySelectorAll('ul');
            mouseEventArgs.target = ul[0];
            mouseEventArgs.ctrlKey = true;
            mouseEventArgs.shiftKey = true;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            let newli2: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(newli2[4].classList.contains('e-active')).toBe(false);
            expect(newli2[4].classList.contains('e-focus')).toBe(false);
            expect(newli2[4].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            expect(newli2[3].classList.contains('e-active')).toBe(false);
            expect(newli2[3].classList.contains('e-focus')).toBe(false);
            expect(newli2[3].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            expect(newli2[2].classList.contains('e-active')).toBe(false);
            expect(newli2[2].classList.contains('e-focus')).toBe(true);
            expect(newli2[2].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
        });
        it('Get multiple file details', (done: Function) => {
            var treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li[4].classList.contains('e-active')).toBe(false);
            expect(li[4].classList.contains('e-focus')).toBe(false);
            expect(li[4].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            mouseEventArgs.target = li[4];
            mouseEventArgs.ctrlKey = true;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            let nli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(nli[4].classList.contains('e-active')).toBe(true);
            expect(nli[4].classList.contains('e-focus')).toBe(true);
            expect(nli[4].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            mouseEventArgs.target = nli[6];
            mouseEventArgs.ctrlKey = true;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            let neli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(neli[4].classList.contains('e-active')).toBe(true);
            expect(neli[4].classList.contains('e-focus')).toBe(false);
            expect(neli[4].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(neli[6].classList.contains('e-active')).toBe(true);
            expect(neli[6].classList.contains('e-focus')).toBe(true);
            expect(neli[6].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            mouseEventArgs.target = neli[2];
            mouseEventArgs.ctrlKey = true;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            let item: any = document.getElementsByClassName('e-fe-details')[0];
            item.click();
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(getMultipleDetails)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 2400;
            done();
        });
        it('SortBy Descending', (done) => {
            expect(feObj.toolbarSettings.visible).toEqual(true);
            // expect(feObj.toolbarSettings.items).toEqual(toolbarItems);
            let sortbyObj: any = feObj.toolbarModule.toolbarObj.element.querySelector('#' + feObj.element.id + '_tb_sortby');
            sortbyObj.click();
            setTimeout(function () {
                sortbyObj.ej2_instances[0].dropDown.element.querySelectorAll('.e-item')[5].click();done();
            }, 200);
        });
        it('SortBy Ascending', (done) => {
            expect(feObj.toolbarSettings.visible).toEqual(true);
            // expect(feObj.toolbarSettings.items).toEqual(toolbarItems);
            let sortbyObj: any = feObj.toolbarModule.toolbarObj.element.querySelector('#' + feObj.element.id + '_tb_sortby');
            sortbyObj.click();
            setTimeout(function () {
                sortbyObj.ej2_instances[0].dropDown.element.querySelectorAll('.e-item')[4].click();done();
            }, 200);
        });

        it('rename operation for LargeIcons', function (done) {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
            setTimeout(function () {
                var a = document.getElementById('file_largeicons').querySelectorAll('li')[4];
                expect(a.classList.contains('e-active')).toBe(false);
                expect(a.classList.contains('e-focus')).toBe(false);
                expect(a.querySelector('.e-frame').classList.contains('e-check')).toBe(false);
                mouseEventArgs.target = a.querySelector('.e-frame');
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                let nli: any = document.getElementById('file_largeicons').querySelectorAll('li');
                expect(nli[4].classList.contains('e-active')).toBe(true);
                expect(nli[4].classList.contains('e-focus')).toBe(true);
                expect(nli[4].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
                let items: any = document.getElementsByClassName('e-fe-rename');
                items[0].click();
                setTimeout(function () {
                    let inputValue: any = document.getElementById('file_dialog').querySelector('#rename');
                    expect((inputValue as any).value).toEqual("Apple pie.png");
                    inputValue.value = 'orange.png';
                    (document.getElementById('file_dialog').querySelectorAll('.e-btn')[1] as HTMLElement).click();
                    done();
                }, 500);
            }, 500);
        });
        it('mouse click on the layout switch icon', (done: Function) => {            
            let grid: HTMLElement = document.getElementById('file_grid');
            let largeIcons: HTMLElement = document.getElementById('file_largeicons');
            let icon: any = document.getElementById('file_view');
            icon.click();
            let layoutObj: any = icon.ej2_instances[0];
            setTimeout(function () {
                layoutObj.dropDown.element.querySelectorAll('.e-item')[0].click();
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>largeIcons.querySelectorAll('li');                
                expect(li.length).toBe(9);
                expect(largeIcons.classList.contains('e-display-none')).toBe(false);
                document.getElementById('file_view').click();
                setTimeout(function () {
                    layoutObj.dropDown.element.querySelectorAll('.e-item')[1].click();
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify(data1)
                    });
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        let li1: Element[] = <Element[] & NodeListOf<HTMLLIElement>>grid.querySelectorAll('.e-row');
                        expect(li1.length).toBe(5);
                        expect(grid.classList.contains('e-display-none')).toBe(false);
                        expect(largeIcons.classList.contains('e-display-none')).toBe(true);
                        done();
                    }, 500);
                }, 500);
            }, 500);
        });
        it('mouse click on checkbox multi selection', (done: Function) => {
            feObj.allowMultiSelection = true;
            feObj.dataBind();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
            setTimeout(function () {
                var a = document.getElementById('file_largeicons').querySelectorAll('li')[0];
                mouseEventArgs.target = a.querySelector('.e-frame');
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                var b = document.getElementById('file_largeicons').querySelectorAll('li')[2];
                mouseEventArgs.target = b.querySelector('.e-frame');
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                var c = document.getElementById('file_largeicons').querySelectorAll('li')[4];
                mouseEventArgs.target = c.querySelector('.e-frame');
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                expect(a.querySelector('.e-frame').classList.contains('e-check')).toBe(true);
                expect(b.querySelector('.e-frame').classList.contains('e-check')).toBe(true);
                expect(c.querySelector('.e-frame').classList.contains('e-check')).toBe(true);
                feObj.allowMultiSelection = false;
                feObj.dataBind();
                this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify(data1)
                    });
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    var firstElement = document.getElementById('file_largeicons').querySelectorAll('li')[0];
                    mouseEventArgs.target = firstElement;
                    feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                    var secondElement = document.getElementById('file_largeicons').querySelectorAll('li')[2];
                    mouseEventArgs.target = secondElement;
                    feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                    var thirdElement = document.getElementById('file_largeicons').querySelectorAll('li')[4];
                    mouseEventArgs.target = thirdElement;
                    feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                    expect(firstElement.classList.contains('e-active')).toBe(false);
                    expect(secondElement.classList.contains('e-active')).toBe(false);
                    expect(thirdElement.classList.contains('e-active')).toBe(true);
                    done();
                }, 500);
            }, 500);
        });
    });
});

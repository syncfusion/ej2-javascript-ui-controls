/**
 * FileManager spec document
 */
import { FileManager } from '../../../src/file-manager/base/file-manager';
import { NavigationPane } from '../../../src/file-manager/layout/navigation-pane';
import { DetailsView } from '../../../src/file-manager/layout/details-view';
import { Toolbar } from '../../../src/file-manager/actions/toolbar';
import { createElement, Browser, EventHandler, isNullOrUndefined, select } from '@syncfusion/ej2-base';
import { toolbarItems, toolbarItems1, data1, data2, folderRename, dataSortbySize, singleSelectionDetails, rename, data3, data4, data5, dataDelete, data6, data7, data8, data9, data12, data14, UploadData, data15, data11 } from '../data';
import { extend } from '@syncfusion/ej2-grids';
import { FileOpenEventArgs } from '../../../src/file-manager/base/interface';

FileManager.Inject(Toolbar, NavigationPane, DetailsView);

function eventObject(eventType: string, eventName: string): Object {
    let tempEvent: any = document.createEvent(eventType);
    tempEvent.initEvent(eventName, true, true);
    let returnObject: any = extend({}, tempEvent);
    returnObject.preventDefault = () => { return true; };
    return returnObject;
}

describe('FileManager control LargeIcons view', () => {
    describe('context menu testing', () => {
        let i:number=0;
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
                beforeFileOpen: (args: FileOpenEventArgs) => { i++ },
                showThumbnail: false
            }, '#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
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
            setTimeout(function () {
                done();
            }, 500);
        });
        afterEach((): void => {
            i=0;
            jasmine.Ajax.uninstall();
            if (feObj) feObj.destroy();
            ele.remove();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        // it('folder context menu open process testing', (done: Function) => {
        //     let el: any = document.getElementById(feObj.element.id + '_contextmenu');
        //     let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
        //     expect(li.length).toBe(5);
        //     mouseEventArgs.target = li[0];
        //     tapEvent.tapCount = 1;
        //     feObj.largeiconsviewModule.clickObj.tap(tapEvent);
        //     expect(li[0].textContent).toBe('Documents');
        //     let sourceElement: any = el.ej2_instances[0];
        //     let evt = document.createEvent('MouseEvents')
        //     evt.initEvent('contextmenu', true, true);
        //     li[0].dispatchEvent(evt);
        //     setTimeout(function () {
        //         // sourceElement.element.querySelectorAll('li')[0].click();
        //         this.request = jasmine.Ajax.requests.mostRecent();
        //         this.request.respondWith({
        //             status: 200,
        //             responseText: JSON.stringify(data1)
        //         });
        //         jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
        //         setTimeout(function () {
        //             let li1: any = document.getElementById('file_largeicons').querySelectorAll('li');
        //             expect(li1.length).toBe(5);
        //             let li2: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
        //             expect((li2[0] as Element).classList.contains('e-active')).toBe(false);
        //             expect((li2[1] as Element).classList.contains('e-active')).toBe(true);
        //             expect((li2[1] as HTMLElement).innerText.trim()).toBe('Documents');
        //             done();
        //         }, 500);
        //     }, 500);
        // });
        it('folder context menu open process testing with (right and left click testing) mouse double click', (done: Function) => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li.length).toBe(5);
            mouseEventArgs.target = li[0];
            mouseEventArgs.which = 3;
            tapEvent.tapCount = 2;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            expect(li[0].textContent).toBe('Documents');
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            li[0].dispatchEvent(evt);
            setTimeout(function () {
                sourceElement.element.querySelectorAll('li')[0].click();
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
                    expect((li2[1] as HTMLElement).innerText.trim()).toBe('Documents');
                    done();
                }, 500);
            }, 500);
        });
        // it('mouse click on refresh button', (done: Function) => {
        //     let ele: any = document.getElementById(feObj.element.id + '_contextmenu');
        //     let menuObj: any = ele.ej2_instances[0];
        //     let lgli: any = document.getElementById('file_largeicons').querySelectorAll('li');
        //     mouseEventArgs.target = lgli[1];
        //     feObj.largeiconsviewModule.clickObj.tap(tapEvent);
        //     mouseEventArgs.ctrlKey = true;
        //     mouseEventArgs.target = lgli[2];
        //     feObj.largeiconsviewModule.clickObj.tap(tapEvent);
        //     document.getElementById('file_tree').querySelectorAll('li')[1].remove();
        //     lgli[0].remove();
        //     document.getElementsByClassName('e-addressbar-ul')[0].querySelector('li').remove();
        //     let li: any = document.getElementById('file_tree').querySelectorAll('li');
        //     let tr: any = document.getElementById('file_largeicons').querySelectorAll('li');
        //     let ar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
        //     expect(li.length).toEqual(4);
        //     expect(tr.length).toEqual(4);
        //     expect(ar.length).toEqual(0);
        //     expect(tr[0].classList.contains('e-active')).toBe(true);
        //     expect(tr[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
        //     expect(tr[1].classList.contains('e-active')).toBe(true);
        //     expect(tr[1].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
        //     let largeWrap: Element = feObj.largeiconsviewModule.element.children[0];
        //     let evt = document.createEvent('MouseEvents');
        //     evt.initEvent('contextmenu', true, true);
        //     largeWrap.dispatchEvent(evt);
        //     setTimeout(function () {
        //         // menuObj.element.querySelector('.e-fe-refresh').click();
        //         this.request = jasmine.Ajax.requests.mostRecent();
        //         this.request.respondWith({
        //             status: 200,
        //             responseText: JSON.stringify(data1)
        //         });
        //         jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //         setTimeout(function () {
        //             let nli: any = document.getElementById('file_tree').querySelectorAll('li');
        //             let ntr: any = document.getElementById('file_largeicons').querySelectorAll('li');
        //             let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
        //             expect(nli.length).toEqual(5);
        //             expect(ntr.length).toEqual(5);
        //             expect(nar.length).toEqual(1);
        //             expect(ntr[1].classList.contains('e-active')).toBe(true);
        //             expect(ntr[1].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
        //             expect(ntr[2].classList.contains('e-active')).toBe(true);
        //             expect(ntr[2].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
        //             done();
        //         }, 500);
        //     }, 100);
        // });
                
        it('non-image file context menu open process testing', (done) => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li.length).toBe(5);
            mouseEventArgs.target = li[0];
            tapEvent.tapCount = 1;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            expect(li[0].textContent).toBe('Documents');
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            li[0].dispatchEvent(evt);
            setTimeout(function () {
                expect(sourceElement.element.querySelectorAll('li')[0].innerText).toBe('Open');
                expect(sourceElement.element.querySelectorAll('li')[0].classList.contains('e-disabled')).toBe(false);
                sourceElement.element.querySelectorAll('li')[0].click();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data11)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
                setTimeout(function () {
                    li = document.getElementById('file_largeicons').querySelectorAll('li');
                    mouseEventArgs.target = li[1];
                    tapEvent.tapCount = 1;
                    feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                    expect(li[1].textContent).toBe('music.mp3');
                    let evt = document.createEvent('MouseEvents')
                    evt.initEvent('contextmenu', true, true);
                    li[1].dispatchEvent(evt);
                    setTimeout(function () {
                        expect(sourceElement.element.querySelectorAll('li')[0].innerText).toBe('Open');
                        expect(sourceElement.element.querySelectorAll('li')[0].classList.contains('e-disabled')).toBe(false);
                        sourceElement.element.querySelectorAll('li')[0].click();
                        setTimeout(function () {
                            expect(i >1).toBe(true);
                            done();
                        }, 100);
                    }, 100);
                }, 500);
            }, 500);
        });
        
        it('folder context menu in tree view open item testing', (done) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
            setTimeout(function () {
                let el: any = document.getElementById(feObj.element.id + '_contextmenu');
                let Li: Element = feObj.navigationpaneModule.treeObj.element.querySelectorAll("li")[2];
                let sourceElement: any = el.ej2_instances[0];
                let evt = document.createEvent('MouseEvents')
                evt.initEvent('contextmenu', true, true);
                Li.dispatchEvent(evt);
                setTimeout(function () {
                    expect(sourceElement.element.querySelectorAll('li')[0].innerText).toBe('Open');
                    expect(sourceElement.element.querySelectorAll('li')[0].classList.contains('e-disabled')).toBe(true);
                    done();
                }, 100);
            }, 500);
        });
    });
    describe('for LargeIcons View context menu', () => {
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
                showThumbnail: false
            }, '#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data14)
            });
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 8000;
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
        it('upload process testing', (done) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
            setTimeout(function () {
                let el: any = document.getElementById(feObj.element.id + '_contextmenu');
                let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
                mouseEventArgs.target = li[0];
                tapEvent.tapCount = 1;
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                expect(li[0].textContent).toBe('Documents');
                let sourceElement: any = el.ej2_instances[0];
                let evt = document.createEvent('MouseEvents')
                evt.initEvent('contextmenu', true, true);
                li[0].dispatchEvent(evt);
                setTimeout(function () {
                    sourceElement.element.querySelectorAll('li')[1].click();
                    let fileObj: File = new File(["Nice One"], "sample.txt", { lastModified: 0, type: "overide/mimetype" })
                    let eventArgs: any = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
                    let uploadObj: any = document.querySelector('#' + feObj.element.id + '_upload');
                    uploadObj.ej2_instances[0].onSelectFiles(eventArgs);
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify(UploadData)
                    });
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
                    setTimeout(function () {
                        let li1: any = document.getElementById('file_largeicons').querySelectorAll('li')[0];
                        mouseEventArgs.target = li1.querySelector(".e-text-content");
                        done();
                    }, 500);
                }, 500);
            }, 500);
        });
        it('folder context menu with open', (done: Function) => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li.length).toBe(3);
            mouseEventArgs.target = li[0];
            tapEvent.tapCount = 1;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            expect(li[0].textContent).toBe('Documents');
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            li[0].dispatchEvent(evt);
            setTimeout(function () {
                expect(sourceElement.element.querySelectorAll('li')[0].innerText).toBe('Open');
                expect(sourceElement.element.querySelectorAll('li')[0].classList.contains('e-disabled')).toBe(false);
                sourceElement.element.querySelectorAll('li')[0].click();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data1)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
                setTimeout(function () {
                    let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                    let li1: any = document.getElementById('file_largeicons').querySelectorAll('li');
                    expect(li1.length).toBe(5);
                    expect(document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li')[1].textContent).toBe("Documents");
                    let li2: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
                    expect((li2[0] as Element).classList.contains('e-active')).toBe(false);
                    expect((li2[1] as Element).classList.contains('e-active')).toBe(true);
                    expect((li2[1] as HTMLElement).innerText.trim()).toBe('Documents');
                    done();
                }, 500);
            }, 500);
        });

        it('folder context menu with delete', (done: Function) => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let li: any = document.getElementById('file_tree').querySelectorAll('li');
            let ntr: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li.length).toEqual(4);
            expect(ntr.length).toEqual(3);
            mouseEventArgs.target = ntr[0];
            tapEvent.tapCount = 1;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            expect(ntr[0].textContent).toBe('Documents');
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            ntr[0].dispatchEvent(evt);
            setTimeout(function () {
                sourceElement.element.querySelectorAll('li')[2].click();
                (document.getElementById('file_dialog').querySelectorAll('.e-btn')[1] as HTMLElement).click();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data1)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(dataDelete)
                });
                setTimeout(function () {
                    let nli: any = document.getElementById('file_tree').querySelectorAll('li');
                    let ntr: any = document.getElementById('file_largeicons').querySelectorAll('li');
                    let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                    expect(nli.length).toEqual(4);
                    expect(ntr.length).toEqual(4);
                    done();
                }, 500);
            }, 500);
        });
        it('folder context menu with rename', (done: Function) => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let li: any = document.getElementById('file_tree').querySelectorAll('li');
            let ntr: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li.length).toEqual(4);
            expect(ntr.length).toEqual(3);
            mouseEventArgs.target = ntr[0];
            tapEvent.tapCount = 1;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            expect(ntr[0].textContent).toBe('Documents');
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            ntr[0].dispatchEvent(evt);
            setTimeout(function () {
                sourceElement.element.querySelectorAll('li')[3].click();
                expect(ntr[0].textContent).toBe("Documents");
                (<HTMLInputElement>document.getElementById('rename')).value = "My Folder";
                (<HTMLElement>document.getElementById('file_dialog').querySelectorAll('.e-btn')[1]).click();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(folderRename)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(rename)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    let nli: any = document.getElementById('file_tree').querySelectorAll('li');
                    let ntr: any = document.getElementById('file_largeicons').querySelectorAll('li');
                    let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                    expect(nli.length).toEqual(4);
                    expect(ntr.length).toEqual(5);
                    expect(nar.length).toEqual(1);
                    expect(ntr[2].textContent).toBe("My Folder");
                    expect(nli[1].textContent).toBe("My Folder");
                    done();
                }, 500);
            }, 500);
        });
        it('folder context menu with details', (done: Function) => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let li: any = document.getElementById('file_tree').querySelectorAll('li');
            let ntr: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li.length).toEqual(4);
            expect(ntr.length).toEqual(3);
            mouseEventArgs.target = ntr[0];
            tapEvent.tapCount = 1;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            expect(ntr[0].textContent).toBe('Documents');
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            ntr[0].dispatchEvent(evt);
            setTimeout(function () {
                sourceElement.element.querySelectorAll('li')[6].click();
                expect(ntr[0].textContent).toBe("Documents");
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(singleSelectionDetails)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    let nli: any = document.getElementById('file_tree').querySelectorAll('li');
                    let ntr: any = document.getElementById('file_largeicons').querySelectorAll('li');
                    let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                    expect(nli.length).toEqual(4);
                    expect(ntr.length).toEqual(3);
                    expect(nar.length).toEqual(1);
                    expect(document.getElementById('file_dialog_title').textContent).toBe('Documents')
                    expect(document.querySelectorAll('.e-fe-value').length).toBe(4)
                    expect((<any>document.querySelectorAll('.e-fe-value')[0]).textContent).toBe('Folder')
                    // expect((<any>document.querySelectorAll('.e-fe-value')[1]).textContent).toBe('0')
                    expect((<any>document.querySelectorAll('.e-fe-value')[2]).textContent).toBe('/Documents')
                    expect((<any>document.querySelectorAll('.e-fe-value')[3]).textContent).toBe('October 16, 2018 19:43:17')
                    done();
                }, 500);
            }, 500);
        });

        it('file context menu open process testing', (done) => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li.length).toBe(3);
            mouseEventArgs.target = li[2];
            tapEvent.tapCount = 1;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            expect(li[2].textContent).toBe('Food');
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            li[2].dispatchEvent(evt);
            setTimeout(function () {
                expect(sourceElement.element.querySelectorAll('li')[0].innerText).toBe('Open');
                expect(sourceElement.element.querySelectorAll('li')[0].classList.contains('e-disabled')).toBe(false);
                sourceElement.element.querySelectorAll('li')[0].click();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data15)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
                setTimeout(function () {
                    li = document.getElementById('file_largeicons').querySelectorAll('li');
                    mouseEventArgs.target = li[0];
                    tapEvent.tapCount = 1;
                    feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                    expect(li[0].textContent).toBe('Bread.png');
                    let evt = document.createEvent('MouseEvents')
                    evt.initEvent('contextmenu', true, true);
                    li[0].dispatchEvent(evt);
                    setTimeout(function () {
                        expect(sourceElement.element.querySelectorAll('li')[0].innerText).toBe('Open');
                        expect(sourceElement.element.querySelectorAll('li')[0].classList.contains('e-disabled')).toBe(false);
                        sourceElement.element.querySelectorAll('li')[0].click();
                        done();
                    }, 500);
                }, 500);
            }, 500);
        });

        it('layout context menu with details', (done: Function) => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let li: any = document.getElementById('file_largeicons');
            mouseEventArgs.target = li;
            tapEvent.tapCount = 1;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            li.dispatchEvent(evt);
            setTimeout(function () {
                sourceElement.element.querySelectorAll('li')[7].click();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(singleSelectionDetails)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    let nli: any = document.getElementById('file_tree').querySelectorAll('li');
                    let ntr: any = document.getElementById('file_largeicons').querySelectorAll('li');
                    let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                    expect(nli.length).toEqual(4);
                    expect(ntr.length).toEqual(3);
                    expect(nar.length).toEqual(1);
                    expect(document.getElementById('file_dialog_title').textContent).toBe('Documents')
                    expect(document.querySelectorAll('.e-fe-value').length).toBe(4)
                    expect((<any>document.querySelectorAll('.e-fe-value')[0]).textContent).toBe('Folder')
                    // expect((<any>document.querySelectorAll('.e-fe-value')[1]).textContent).toBe('0')
                    expect((<any>document.querySelectorAll('.e-fe-value')[2]).textContent).toBe('/Documents')
                    expect((<any>document.querySelectorAll('.e-fe-value')[3]).textContent).toBe('October 16, 2018 19:43:17')
                    done();
                }, 500);
            }, 500);
        });
        it('layout context menu with new folder', (done: Function) => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let li: any = document.getElementById('file_largeicons');
            mouseEventArgs.target = li;
            tapEvent.tapCount = 1;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            li.dispatchEvent(evt);
            setTimeout(function () {
                let nli: any = document.getElementById('file_tree').querySelectorAll('li');
                let ntr: any = document.getElementById('file_largeicons').querySelectorAll('li');
                let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                expect(nli.length).toEqual(4);
                expect(ntr.length).toEqual(3);
                expect(nar.length).toEqual(1);
                sourceElement.element.querySelectorAll('li')[4].click();
                let items: any = document.getElementsByClassName('e-fe-newfolder');
                items[0].click();
                (<HTMLInputElement>document.getElementById('newname')).value = "New Folder";
                (<HTMLElement>document.getElementById('file_dialog').querySelectorAll('.e-btn')[1]).click();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data1)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data5)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    let nli: any = document.getElementById('file_tree').querySelectorAll('li');
                    let ntr: any = document.getElementById('file_largeicons').querySelectorAll('li');
                    let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                    expect(nli.length).toEqual(6);
                    expect(ntr.length).toEqual(6);
                    expect(nar.length).toEqual(1);
                    expect(ntr[1].classList.contains('e-active')).toBe(false);
                    expect(ntr[1].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
                    expect(ntr[2].classList.contains('e-active')).toBe(false);
                    expect(ntr[2].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
                    done();
                }, 500);
            });
        });
        it('layout context menu with refresh', (done: Function) => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let li: any = document.getElementById('file_largeicons');
            mouseEventArgs.target = li;
            tapEvent.tapCount = 1;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            li.dispatchEvent(evt);
            setTimeout(function () {
                let nli: any = document.getElementById('file_tree').querySelectorAll('li');
                let ntr: any = document.getElementById('file_largeicons').querySelectorAll('li');
                let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                expect(nli.length).toEqual(4);
                expect(ntr.length).toEqual(3);
                expect(nar.length).toEqual(1);
                sourceElement.element.querySelectorAll('li')[2].click();
                let lgli: any = document.getElementById('file_largeicons').querySelectorAll('li');
                mouseEventArgs.target = lgli[1];
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                mouseEventArgs.ctrlKey = true;
                mouseEventArgs.target = lgli[2];
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                document.getElementById('file_tree').querySelectorAll('li')[1].remove();
                lgli[0].remove();
                document.getElementsByClassName('e-addressbar-ul')[0].querySelector('li').remove();
                let li: any = document.getElementById('file_tree').querySelectorAll('li');
                let tr: any = document.getElementById('file_largeicons').querySelectorAll('li');
                let ar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                expect(li.length).toEqual(3);
                expect(tr.length).toEqual(2);
                expect(ar.length).toEqual(0);
                expect(tr[0].classList.contains('e-active')).toBe(true);
                expect(tr[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
                expect(tr[1].classList.contains('e-active')).toBe(true);
                expect(tr[1].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
                let largeWrap: Element = feObj.largeiconsviewModule.element.children[0];
                let evt = document.createEvent('MouseEvents');
                evt.initEvent('contextmenu', true, true);
                largeWrap.dispatchEvent(evt);
                setTimeout(function () {
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify(data1)
                    });
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        let nli: any = document.getElementById('file_tree').querySelectorAll('li');
                        let ntr: any = document.getElementById('file_largeicons').querySelectorAll('li');
                        let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                        expect(nli.length).toEqual(5);
                        expect(ntr.length).toEqual(5);
                        expect(nar.length).toEqual(1);
                        expect(ntr[1].classList.contains('e-active')).toBe(true);
                        expect(ntr[1].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
                        expect(ntr[2].classList.contains('e-active')).toBe(true);
                        expect(ntr[2].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
                        done();
                    }, 500);
                }, 100);
            });


        });
        it('layout context menu with selectAll', (done: Function) => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let li: any = document.getElementById('file_largeicons');
            mouseEventArgs.target = li;
            tapEvent.tapCount = 1;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            li.dispatchEvent(evt);
            setTimeout(function () {
                let nli: any = document.getElementById('file_tree').querySelectorAll('li');
                let ntr: any = document.getElementById('file_largeicons').querySelectorAll('li');
                let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                expect(nli.length).toEqual(4);
                expect(ntr.length).toEqual(3);
                expect(nar.length).toEqual(1);
                sourceElement.element.querySelectorAll('li')[9].click();
                setTimeout(function () {
                    let nli: any = document.getElementById('file_tree').querySelectorAll('li');
                    let ntr: any = document.getElementById('file_largeicons').querySelectorAll('li');
                    let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                    expect(nli.length).toEqual(4);
                    expect(ntr.length).toEqual(3);
                    expect(nar.length).toEqual(1);
                    // expect(ntr[0].classList.contains('e-active')).toBe(true);
                    // expect(ntr[1].classList.contains('e-active')).toBe(true);
                    // expect(ntr[2].classList.contains('e-active')).toBe(true);
                    // expect(feObj.selectedItems.length).toBe(3);
                    done();
                }, 500);
            });
        });

        it('layout context menu with view', (done: Function) => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let li: any = document.getElementById('file_largeicons');
            mouseEventArgs.target = li;
            tapEvent.tapCount = 1;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            li.dispatchEvent(evt);
            setTimeout(function () {
                let nli: any = document.getElementById('file_tree').querySelectorAll('li');
                let ntr: any = document.getElementById('file_largeicons').querySelectorAll('li');
                let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                expect(nli.length).toEqual(4);
                expect(ntr.length).toEqual(3);
                expect(nar.length).toEqual(1);
                sourceElement.element.querySelectorAll('li')[1].click();
                mouseEventArgs.target = sourceElement.element.querySelectorAll('li')[1];
                mouseEventArgs.type = 'mouseover';
                feObj.contextmenuModule.contextMenu.moverHandler(mouseEventArgs);
                // expect(document.getElementById('file_grid').offsetWidth == 0).toEqual(true);
                expect(document.getElementById('file_largeicons').offsetWidth != 0).toEqual(true);
                expect(document.getElementById('file_grid').offsetHeight == 0).toEqual(true);
                expect(document.getElementById('file_largeicons').offsetHeight != 0).toEqual(true);
                (<any>document.querySelector('#file_cm_detailsview')).click();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data1)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    expect(document.getElementById('file_grid').offsetWidth != 0).toEqual(true);
                    expect(document.getElementById('file_largeicons').offsetWidth == 0).toEqual(true);
                    expect(document.getElementById('file_grid').offsetHeight != 0).toEqual(true);
                    expect(document.getElementById('file_largeicons').offsetHeight == 0).toEqual(true);
                    let nli: any = document.getElementById('file_tree').querySelectorAll('li');
                    let ntr: any = document.getElementById('file_largeicons').querySelectorAll('li');
                    let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                    expect(nli.length).toEqual(4);
                    expect(ntr.length).toEqual(3);
                    expect(nar.length).toEqual(1);
                    done();
                }, 500);
            });
        });
        it('layout context menu with sortby', (done: Function) => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let li: any = document.getElementById('file_largeicons');
            mouseEventArgs.target = li;
            tapEvent.tapCount = 1;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            li.dispatchEvent(evt);
            setTimeout(function () {
                let nli: any = document.getElementById('file_tree').querySelectorAll('li');
                let ntr: any = document.getElementById('file_largeicons').querySelectorAll('li');
                let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                expect(nli.length).toEqual(4);
                // expect(ntr.length).toEqual(3);
                expect(nar.length).toEqual(1);
                sourceElement.element.querySelectorAll('li')[0].click();
                mouseEventArgs.target = sourceElement.element.querySelectorAll('li')[0];
                mouseEventArgs.type = 'mouseover';
                feObj.contextmenuModule.contextMenu.moverHandler(mouseEventArgs);
                (<any>document.querySelector('#file_cm_size')).click();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(dataSortbySize)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    let nli: any = document.getElementById('file_tree').querySelectorAll('li');
                    let ntr: any = document.getElementById('file_largeicons').querySelectorAll('li');
                    let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                    expect(nli.length).toEqual(4);
                    // expect(ntr.length).toEqual(3);
                    expect(nar.length).toEqual(1);
                    expect(ntr[0].textContent).toBe("Food");
                    expect(ntr[1].textContent).toBe("Nature");
                    expect(ntr[1].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
                    expect(ntr[2].classList.contains('e-active')).toBe(false);
                    expect(ntr[2].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
                    done();
                }, 500);
            });
        });
    });


});
/**
 * FileManager spec document
 */
import { FileManager } from '../../../src/file-manager/base/file-manager';
import { NavigationPane } from '../../../src/file-manager/layout/navigation-pane';
import { DetailsView } from '../../../src/file-manager/layout/details-view';
import { Toolbar } from '../../../src/file-manager/actions/toolbar';
import { createElement, Browser, EventHandler, isNullOrUndefined, select } from '@syncfusion/ej2-base';
import { toolbarItems, toolbarItems1, data1, data2, data3, data4, data5, data6, data7, data8, data9, data12, data14, UploadData } from '../data';
import { extend } from '@syncfusion/ej2-grids';

FileManager.Inject(Toolbar, NavigationPane, DetailsView);

function eventObject(eventType: string, eventName: string): Object {
    let tempEvent: any = document.createEvent(eventType);
    tempEvent.initEvent(eventName, true, true);
    let returnObject: any = extend({}, tempEvent);
    returnObject.preventDefault = () => { return true; };
    return returnObject;
}

describe('FileManager control Grid view', () => {
    describe('context menu testing', () => {
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
                showThumbnail: false
            }, '#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
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
        it('folder context menu open process testing', (done) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
            setTimeout(function () {
                let el: any = document.getElementById(feObj.element.id + '_contextmenu');
                feObj.detailsviewModule.gridObj.selectRows([1]);
                let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(1).getElementsByTagName('td')[2];
                let sourceElement: any = el.ej2_instances[0];
                let evt = document.createEvent('MouseEvents')
                evt.initEvent('contextmenu', true, true);
                Li.dispatchEvent(evt);
                setTimeout(function () {
                    sourceElement.element.querySelectorAll('li')[0].click();
                    done();
                }, 100);
            }, 500);
        });
        it('file context menu open process testing', (done) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
            setTimeout(function () {
                let el: any = document.getElementById(feObj.element.id + '_contextmenu');
                feObj.detailsviewModule.gridObj.selectRows([4]);
                let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(1).getElementsByTagName('td')[2];
                let sourceElement: any = el.ej2_instances[0];
                let evt = document.createEvent('MouseEvents')
                evt.initEvent('contextmenu', true, true);
                Li.dispatchEvent(evt);
                setTimeout(function () {
                    sourceElement.element.querySelectorAll('li')[0].click();
                    done();
                }, 100);
            }, 500);
        });
        it('folder context menu upload process testing', (done) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
            setTimeout(function () {
                let el: any = document.getElementById(feObj.element.id + '_contextmenu');
                feObj.detailsviewModule.gridObj.selectRows([1]);
                let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(1).getElementsByTagName('td')[2];
                let sourceElement: any = el.ej2_instances[0];
                let evt = document.createEvent('MouseEvents')
                evt.initEvent('contextmenu', true, true);
                Li.dispatchEvent(evt);
                setTimeout(function () {
                    sourceElement.element.querySelectorAll('li')[1].click();
                    done();
                }, 100);
            }, 500);
        });
        it('folder context menu cut item testing', (done) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
            setTimeout(function () {
                let el: any = document.getElementById(feObj.element.id + '_contextmenu');
                feObj.detailsviewModule.gridObj.selectRows([1]);
                let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(1).getElementsByTagName('td')[2];
                let sourceElement: any = el.ej2_instances[0];
                let evt = document.createEvent('MouseEvents')
                evt.initEvent('contextmenu', true, true);
                Li.dispatchEvent(evt);
                setTimeout(function () {
                    sourceElement.element.querySelectorAll('li')[3].click();
                    done();
                }, 100);
            }, 500);
        });
		//Functionalities disabled 
        // it('folder context menu copy item testing', (done) => {
        //     jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
        //     setTimeout(function () {
        //         let el: any = document.getElementById(feObj.element.id + '_contextmenu');
        //         feObj.detailsviewModule.gridObj.selectRows([1]);
        //         let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(1).getElementsByTagName('td')[2];
        //         let sourceElement: any = el.ej2_instances[0];
        //         let evt = document.createEvent('MouseEvents')
        //         evt.initEvent('contextmenu', true, true);
        //         Li.dispatchEvent(evt);
        //         setTimeout(function () {
        //             sourceElement.element.querySelectorAll('li')[4].click();
        //             done();
        //         }, 100);
        //     }, 500);
        // });
        it('folder context menu paste item testing', (done) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
            setTimeout(function () {
                let el: any = document.getElementById(feObj.element.id + '_contextmenu');
                feObj.detailsviewModule.gridObj.selectRows([1]);
                let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(1).getElementsByTagName('td')[2];
                let sourceElement: any = el.ej2_instances[0];
                let evt = document.createEvent('MouseEvents')
                evt.initEvent('contextmenu', true, true);
                Li.dispatchEvent(evt);
                setTimeout(function () {
                    // sourceElement.element.querySelectorAll('li')[5].click();
                    done();
                }, 100);
            }, 500);
        });
        it('folder context menu Delete item testing', (done) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
            setTimeout(function () {
                let el: any = document.getElementById(feObj.element.id + '_contextmenu');
                feObj.detailsviewModule.gridObj.selectRows([1]);
                let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(1).getElementsByTagName('td')[2];
                let sourceElement: any = el.ej2_instances[0];
                let evt = document.createEvent('MouseEvents')
                evt.initEvent('contextmenu', true, true);
                Li.dispatchEvent(evt);
                setTimeout(function () {
                    // sourceElement.element.querySelectorAll('li')[7].click();
                    done();
                }, 100);
            }, 500);
        });
        it('folder context menu Rename item testing', (done) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
            setTimeout(function () {
                let el: any = document.getElementById(feObj.element.id + '_contextmenu');
                feObj.detailsviewModule.gridObj.selectRows([1]);
                let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(1).getElementsByTagName('td')[2];
                let sourceElement: any = el.ej2_instances[0];
                let evt = document.createEvent('MouseEvents')
                evt.initEvent('contextmenu', true, true);
                Li.dispatchEvent(evt);
                setTimeout(function () {
                    // sourceElement.element.querySelectorAll('li')[8].click();
                    done();
                }, 100);
            }, 500);
        });
        it('folder context menu New folder item testing', (done) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
            setTimeout(function () {
                let el: any = document.getElementById(feObj.element.id + '_contextmenu');
                feObj.detailsviewModule.gridObj.selectRows([1]);
                let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(1).getElementsByTagName('td')[2];
                let sourceElement: any = el.ej2_instances[0];
                let evt = document.createEvent('MouseEvents')
                evt.initEvent('contextmenu', true, true);
                Li.dispatchEvent(evt);
                setTimeout(function () {
                    // sourceElement.element.querySelectorAll('li')[10].click();
                    done();
                }, 100);
            }, 500);
        });
        it('folder context menu details item testing', (done) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
            setTimeout(function () {
                let el: any = document.getElementById(feObj.element.id + '_contextmenu');
                feObj.detailsviewModule.gridObj.selectRows([1]);
                let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(1).getElementsByTagName('td')[2];
                let sourceElement: any = el.ej2_instances[0];
                let evt = document.createEvent('MouseEvents')
                evt.initEvent('contextmenu', true, true);
                Li.dispatchEvent(evt);
                setTimeout(function () {
                    // sourceElement.element.querySelectorAll('li')[12].click();
                    done();
                }, 100);
            }, 500);
        });
        it('file context menu details item testing', (done) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
            setTimeout(function () {
                let el: any = document.getElementById(feObj.element.id + '_contextmenu');
                feObj.detailsviewModule.gridObj.selectRows([0]);
                let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(0).getElementsByTagName('td')[2];
                let sourceElement: any = el.ej2_instances[0];
                let evt = document.createEvent('MouseEvents')
                evt.initEvent('contextmenu', true, true);
                Li.dispatchEvent(evt);
                setTimeout(function () {
                    //sourceElement.element.querySelectorAll('li')[0].click();
                    done();
                }, 100);
            }, 500);
        });
        it('folder context in tree view menu details item testing', (done) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
            setTimeout(function () {
                let el: any = document.getElementById(feObj.element.id + '_contextmenu');
                let Li: Element = feObj.navigationpaneModule.treeObj.element.querySelectorAll("li")[2];
                let sourceElement: any = el.ej2_instances[0];
                let evt = document.createEvent('MouseEvents')
                evt.initEvent('contextmenu', true, true);
                Li.dispatchEvent(evt);
                setTimeout(function () {
                    // sourceElement.element.querySelectorAll('li')[4].click();
                    done();
                }, 100);
            }, 500);
        });
        it('layout context in tree view menu details item testing', (done) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
            setTimeout(function () {
                let el: any = document.getElementById(feObj.element.id + '_contextmenu');
                let Li: Element = feObj.detailsviewModule.gridObj.element;
                let sourceElement: any = el.ej2_instances[0];
                let evt = document.createEvent('MouseEvents')
                evt.initEvent('contextmenu', true, true);
                Li.dispatchEvent(evt);
                setTimeout(function () {
                   // sourceElement.element.querySelectorAll('li')[0].click();
                    done();
                }, 100);
            }, 500);
        });
        it('layout context in tree view menu details item testing', (done) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
            setTimeout(function () {
                let el: any = document.getElementById(feObj.element.id + '_contextmenu');
                let Li: Element = feObj.navigationpaneModule.treeObj.element;
                let sourceElement: any = el.ej2_instances[0];
                let evt = document.createEvent('MouseEvents')
                evt.initEvent('contextmenu', true, true);
                Li.dispatchEvent(evt);
                expect(sourceElement.element.querySelectorAll('li').length).toEqual(0);
                done();
            }, 500);
        });
        it('layout context in Select All item testing', (done) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
            setTimeout(function () {
                let el: any = document.getElementById(feObj.element.id + '_contextmenu');
                let Li: Element = feObj.detailsviewModule.gridObj.element;
                let sourceElement: any = el.ej2_instances[0];
                let evt = document.createEvent('MouseEvents')
                evt.initEvent('contextmenu', true, true);
                Li.dispatchEvent(evt);
                setTimeout(function () {
                    // sourceElement.element.querySelectorAll('li')[10].click();
                    done();
                }, 100);
            }, 500);
        });
        it('mouse click on refresh item', (done) => {
            let ele: any = document.getElementById(feObj.element.id + '_contextmenu');
            let menuObj: any = ele.ej2_instances[0];
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
            expect(tr[0].getAttribute('aria-selected')).toEqual('true');
            expect(tr[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(tr[1].getAttribute('aria-selected')).toEqual('true');
            expect(tr[1].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            let grid: Element =(<any> feObj.detailsviewModule.gridObj.contentModule).contentPanel.children[0];
            let evt = document.createEvent('MouseEvents');
            evt.initEvent('contextmenu', true, true);
            grid.dispatchEvent(evt);
            setTimeout(function () {
                menuObj.element.querySelector('.e-fe-refresh').click();
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
                    expect(ntr[1].getAttribute('aria-selected')).toEqual('true');
                    expect(ntr[1].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
                    expect(ntr[2].getAttribute('aria-selected')).toEqual('true');
                    expect(ntr[2].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
                    done();
                }, 500);
            }, 100);
        });
    });
    describe('for Grid View', () => {
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
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false
            }, '#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data12)
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
        it('Grid view context menu open process testing', (done: Function) => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            feObj.detailsviewModule.gridObj.selectRows([0]);
            let li = feObj.detailsviewModule.gridObj.getRowByIndex(0).getElementsByTagName('td')[2];
            expect(li.querySelector('.e-fe-text').textContent).toBe('New folder');
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            li.dispatchEvent(evt);
            setTimeout(function () {
                sourceElement.element.querySelectorAll('li')[0].click();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data1)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
                setTimeout(function () {
                    let li1: any = document.getElementById('file_grid_content_table').querySelectorAll('tr');
                    expect(li1.length).toBe(5);
                    done();
                }, 500);
            }, 500);
        });
        it('Treeview context menu open process testing', (done: Function) => {
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let li: any = feObj.navigationpaneModule.treeObj.element.querySelectorAll("li")[1];
            mouseEventArgs.target = li.querySelector('.e-fullrow');
            tapEvent.tapCount = 1;
            treeObj.touchClickObj.tap(tapEvent);
            expect(li.textContent).toBe('New folder');
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            li.querySelector('.e-fullrow').dispatchEvent(evt);
            setTimeout(function () {
                sourceElement.element.querySelectorAll('li')[0].click();
                expect(feObj.activeModule).toEqual("navigationpane");
                expect(li.querySelector(".e-icons")).toBe(null);
                done();
            }, 500);
        });
        it('Treeview context menu upload process when select grid view item', (done: Function) => {
            let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            feObj.detailsviewModule.gridObj.selectRows([0]);
            let li = feObj.detailsviewModule.gridObj.getRowByIndex(0).getElementsByTagName('td')[2];
            expect(li.querySelector('.e-fe-text').textContent).toBe('New folder');
            let li1: any = feObj.navigationpaneModule.treeObj.element.querySelectorAll("li")[1];
            mouseEventArgs.target = li1.querySelector('.e-fullrow');
            tapEvent.tapCount = 1;
            treeObj.touchClickObj.tap(tapEvent);
            expect(li1.textContent).toBe('New folder');
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            li1.querySelector('.e-fullrow').dispatchEvent(evt);
            setTimeout(function () {
                sourceElement.element.querySelectorAll('li')[1].click();
                let fileObj: File = new File(["Nice One"], "sample.txt", { lastModified: 0, type: "overide/mimetype" })
                let eventArgs: any = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
                let uploadObj: any = document.querySelector('#' + feObj.element.id + '_upload');
                uploadObj.ej2_instances[0].onSelectFiles(eventArgs);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(fileObj)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
                done();
            }, 500);
        });
    });
});
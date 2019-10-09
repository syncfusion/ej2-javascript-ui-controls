/**
 * FileManager spec document
 */
import { FileManager } from '../../../src/file-manager/base/file-manager';
import { NavigationPane } from '../../../src/file-manager/layout/navigation-pane';
import { DetailsView } from '../../../src/file-manager/layout/details-view';
import { Toolbar } from '../../../src/file-manager/actions/toolbar';
import { createElement } from '@syncfusion/ej2-base';
import { data1 } from '../data';

FileManager.Inject(Toolbar, NavigationPane, DetailsView);

describe('FileManager control Grid view', () => {
    describe('worst case testing', () => {
        let feObj: FileManager;
        let ele: HTMLElement, fmEle: HTMLElement;
        beforeEach(() => {
            jasmine.Ajax.install();
            ele = createElement('div', { id: 'file_wrap1' });
            document.body.appendChild(ele);
            fmEle = createElement('div', { id: 'file1' });
            ele.appendChild(fmEle);
        });
        afterEach(() => {
            jasmine.Ajax.uninstall();
            if (feObj) feObj.destroy();
            fmEle.remove();
            ele.remove();
        });
        it('for window resize', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
            });
            feObj.appendTo("#file1");
            (feObj as any).resizeHandler();
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                (feObj as any).resizeHandler();
                done();
            }, 400);
        });
    });
    describe('Rare case', () => {
        let feObj: FileManager;
        let ele: HTMLElement, fmEle: HTMLElement;
        beforeEach(() => {
            jasmine.Ajax.install();
            ele = createElement('div', { id: 'file' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            jasmine.Ajax.uninstall();
            if (feObj) feObj.destroy();
            ele.remove();
        });
        it('selection removal using grid header after continuous layout change', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
            });
            feObj.appendTo("#file");
            (feObj as any).resizeHandler();
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            let mouseEventArgs: any = {
                preventDefault: (): void => { },
                stopImmediatePropagation: (): void => { },
                target: null,
                type: null,
                shiftKey: false,
                ctrlKey: false,
                originalEvent: { target: null }
            };
            let tapEvent: any = {
                originalEvent: mouseEventArgs,
                tapCount: 1
            };
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                (<HTMLElement>document.getElementById('file_tb_view')).click();
                (<HTMLElement>document.getElementById('file_ddl_large')).click();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data1)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
                setTimeout(function () {
                    let menuObj: any = (document.getElementById(feObj.element.id + '_contextmenu') as any).ej2_instances[0];
                    menuObj.animationSettings = { effect: 'None' };
                    menuObj.dataBind();
                    let el: any = document.getElementById(feObj.element.id + '_contextmenu');
                    let li: any = document.getElementById('file_largeicons');
                    mouseEventArgs.target = li;
                    tapEvent.tapCount = 1;
                    (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
                    let sourceElement: any = el.ej2_instances[0];
                    let evt = document.createEvent('MouseEvents')
                    evt.initEvent('contextmenu', true, true);
                    li.dispatchEvent(evt);
                    sourceElement.element.querySelectorAll('#file_cm_selectall')[0].click();
                    expect(feObj.selectedItems.length).toBe(5);
                    (<HTMLElement>document.getElementById('file_tb_view')).click();
                    (<HTMLElement>document.getElementById('file_ddl_details')).click();
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify(data1)
                    }); jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(feObj.selectedItems.length).toBe(5);
                        (<HTMLElement>feObj.element.getElementsByClassName('e-checkselectall')[0]).click();
                        expect(feObj.selectedItems.length).toBe(0);
                        done();
                    }, 400);
                }, 400);
            }, 400);
        });
    });
});
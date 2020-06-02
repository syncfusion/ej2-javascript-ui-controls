/**
 * FileManager spec document
 */
import { FileManager } from '../../../src/file-manager/base/file-manager';
import { NavigationPane } from '../../../src/file-manager/layout/navigation-pane';
import { DetailsView } from '../../../src/file-manager/layout/details-view';
import { Toolbar } from '../../../src/file-manager/actions/toolbar';
import { createElement } from '@syncfusion/ej2-base';
import { accessData1, accessData3 } from '../data';

FileManager.Inject(Toolbar, NavigationPane, DetailsView);

describe('FileManager control Grid view', () => {
    describe('access control mouse event testing', () => {
        let feObj: FileManager;
        let ele: HTMLElement;
        let originalTimeout: any;
        let mouseEventArgs: any, tapEvent: any;
        beforeEach((): void => {
            jasmine.Ajax.install();
            feObj = undefined;
            ele = createElement('div', { id: 'file' });
            document.body.appendChild(ele);
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
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
        it('mouse click on tree view icon', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileAccessOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(accessData1)
            });
            setTimeout(function () {
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                expect(treeLi.length).toEqual(5);
                expect(gridLi.length).toEqual(9);
                let aTreeLi: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                let aGridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row.e-fe-hidden');
                expect(aTreeLi.length).toEqual(2);
                expect(aGridLi.length).toEqual(4);
                expect(treeLi[2].classList.contains('e-fe-hidden')).toBe(true);
                expect(gridLi[1].classList.contains('e-fe-hidden')).toBe(true);
                mouseEventArgs.target = treeLi[2].querySelector('.e-icons');
                treeObj.touchClickObj.tap(tapEvent);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(accessData3)
                });
                setTimeout(function () {
                    let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                    expect(dialogObj.element.querySelector('.e-dlg-header').innerText).toEqual("Access Denied");
                    let treeLi1: any = treeObj.element.querySelectorAll('li');
                    let gridLi1: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                    expect(treeLi1.length).toEqual(5);
                    expect(gridLi1.length).toEqual(9);
                    let aTreeLi1: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                    let aGridLi1: any = document.getElementById('file_grid').querySelectorAll('.e-row.e-fe-hidden');
                    expect(aTreeLi1.length).toEqual(2);
                    expect(aGridLi1.length).toEqual(4);
                    expect(treeLi1[2].classList.contains('e-fe-hidden')).toBe(true);
                    expect(gridLi1[1].classList.contains('e-fe-hidden')).toBe(true);
                    done();
                }, 400);
            }, 400);
        });
        it('mouse click on tree view text', (done: Function) => {
            //initialize file manager
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileAccessOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(accessData1)
            });
            setTimeout(function () {
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                expect(treeLi.length).toEqual(5);
                expect(gridLi.length).toEqual(9);
                let aTreeLi: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                let aGridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row.e-fe-hidden');
                expect(aTreeLi.length).toEqual(2);
                expect(aGridLi.length).toEqual(4);
                expect(treeLi[2].classList.contains('e-fe-hidden')).toBe(true);
                expect(gridLi[1].classList.contains('e-fe-hidden')).toBe(true);
                mouseEventArgs.target = treeLi[2].querySelector('.e-fullrow');
                treeObj.touchClickObj.tap(tapEvent);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(accessData3)
                });
                setTimeout(function () {
                    let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                    expect(dialogObj.element.querySelector('.e-dlg-header').innerText).toEqual("Access Denied");
                    let treeLi1: any = treeObj.element.querySelectorAll('li');
                    let gridLi1: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                    expect(treeLi1.length).toEqual(5);
                    expect(gridLi1.length).toEqual(0);
                    let aTreeLi1: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                    let aGridLi1: any = document.getElementById('file_grid').querySelectorAll('.e-row.e-fe-hidden');
                    expect(aTreeLi1.length).toEqual(2);
                    expect(aGridLi1.length).toEqual(0);
                    expect(document.getElementById('file_grid').querySelector('.e-empty-content').innerHTML).toEqual("Access Denied");
                    expect(treeLi1[2].classList.contains('e-active')).toBe(true);
                    done();
                }, 400);
            }, 500);
        });
        it('Select the already selected tree nodes', (done: Function) => {
            //initialize file manager
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileAccessOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                selectedItems: ['Downloads']
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(accessData1)
            });
            setTimeout(function () {
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                expect(treeLi.length).toEqual(5);
                expect(gridLi.length).toEqual(9);
                expect(feObj.element.getElementsByClassName("e-toolbar-item")[0].classList.contains("e-hidden")).toBe(true);
                mouseEventArgs.target = treeLi[0].querySelector('.e-fullrow');
                treeObj.touchClickObj.tap(tapEvent);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(accessData3)
                });
                setTimeout(function () {
                    expect(feObj.element.getElementsByClassName("e-toolbar-item")[0].classList.contains("e-hidden")).toBe(false);
                    done();
                }, 400);
            }, 500);
        });
    });
});
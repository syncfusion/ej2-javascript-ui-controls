/**
 * FileManager spec document
 */
import { FileManager } from '../../../src/file-manager/base/file-manager';
import {NavigationPane} from '../../../src/file-manager/layout/navigation-pane';
import {DetailsView} from '../../../src/file-manager/layout/details-view';
import { Toolbar } from '../../../src/file-manager/actions/toolbar';
import { createElement } from '@syncfusion/ej2-base';
import { data1, accessData1, accessDetails1, accessData5, accessData4, accessData6, accessData7 } from '../data';
import { extend } from '@syncfusion/ej2-grids';

FileManager.Inject(Toolbar, NavigationPane, DetailsView);

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
            });
            feObj.appendTo('#file');
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
        // it('mouse click on create new folder button', (done: Function) => {
        //     //create new folder
        //     let items: any = document.getElementsByClassName('e-toolbar-item');
        //     items[0].click();
        //     jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //     setTimeout(function () {
        //         let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
        //         expect(li.length).toEqual(5);
        //         expect(document.getElementById('file_grid').querySelectorAll('.e-row').length).toEqual(5);
        //         expect((document.getElementById('file_dialog').querySelector('#newname') as any).value).toEqual("");
        //         let ele: HTMLInputElement = document.getElementById('file_dialog').querySelector('#newname') as HTMLInputElement;
        //         ele.value = "New folder";
        //         (document.getElementById('file_dialog').querySelectorAll('.e-btn')[1] as HTMLElement).click();
        //         this.request = jasmine.Ajax.requests.mostRecent();
        //         this.request.respondWith({
        //             status: 200,
        //             responseText: JSON.stringify(data4)
        //         });
        //         jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //         this.request = jasmine.Ajax.requests.mostRecent();
        //         this.request.respondWith({
        //             status: 200,
        //             responseText: JSON.stringify(data5)
        //         });
        //         jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //         setTimeout(function () {
        //             let li1: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
        //             expect(li1.length).toEqual(6);
        //             expect(document.getElementById('file_grid').querySelectorAll('.e-row').length).toEqual(6);
        //             expect(document.getElementById('file_grid').querySelectorAll('.e-row')[4].getAttribute('aria-selected')).toBe('true');
        //             //create new folder with exisiting name
        //             items[0].click();
        //             jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //             setTimeout(function () {
        //                 expect((document.getElementById('file_dialog').querySelector('#newname') as any).value).toEqual("");
        //                 let ele: HTMLInputElement = document.getElementById('file_dialog').querySelector('#newname') as HTMLInputElement;
        //                 (document.getElementById('file_dialog').querySelectorAll('.e-btn')[1] as HTMLElement).click();
        //                 //expect(ele.parentElement.nextElementSibling.textContent).toEqual('The file or folder name cannot be empty.');
        //                 ele.value = "New folder";
        //                 (document.getElementById('file_dialog').querySelectorAll('.e-btn')[1] as HTMLElement).click();
        //                 jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //                 setTimeout(function () {
        //                     this.request = jasmine.Ajax.requests.mostRecent();
        //                     this.request.respondWith({
        //                         status: 200,
        //                         responseText: JSON.stringify(data6)
        //                     });
        //                     jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //                     setTimeout(function () {
        //                         let li2: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
        //                         expect(li2.length).toEqual(6);
        //                         expect(document.getElementById('file_grid').querySelectorAll('.e-row').length).toEqual(6);
        //                         expect(document.getElementById('file_dialog').querySelector('.e-dlg-header').textContent).toEqual("Error");
        //                         (document.getElementById('file_dialog').querySelectorAll('.e-btn')[1] as HTMLElement).click();
        //                         jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //                         setTimeout(function () {
        //                             //cancel the create folder dialog
        //                             items[0].click();
        //                             jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //                             setTimeout(function () {
        //                                 expect((document.getElementById('file_dialog').querySelector('#newname') as any).value).toEqual("");
        //                                 let ele: HTMLInputElement = document.getElementById('file_dialog').querySelector('#newname') as HTMLInputElement;
        //                                 ele.value = "New folder";
        //                                 (feObj as any).dialogObj.hide();
        //                                 jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //                                 setTimeout(function () {
        //                                     let li3: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
        //                                     expect(li3.length).toEqual(6);
        //                                     expect(document.getElementById('file_grid').querySelectorAll('.e-row').length).toEqual(6);
        //                                     items[0].click();
        //                                     jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //                                     setTimeout(function () {
        //                                         expect((document.getElementById('file_dialog').querySelector('#newname') as any).value).toEqual("");
        //                                         let ele: HTMLInputElement = document.getElementById('file_dialog').querySelector('#newname') as HTMLInputElement;
        //                                         ele.value = "New folder*";
        //                                         var inputEvent = new Event('input', { 'bubbles': true, 'cancelable': true });
        //                                         ele.dispatchEvent(inputEvent);
        //                                         expect(ele.parentElement.nextElementSibling.textContent).toEqual('The file or folder name "New folder*" contains invalid characters. Please use a different name. Valid file or folder names cannot end with a dot or space, and cannot contain any of the following characters: \\/:*?\"<>|');
        //                                         ele.onkeyup({ 'bubbles': true, 'cancelable': true, ctrlKey: true, which: 83 } as any);
        //                                         ele.onkeyup({ 'bubbles': true, 'cancelable': true, ctrlKey: true, charCode: 83 } as any);
        //                                         ele.value = "New folders";
        //                                         var inputEvent = new Event('input', { 'bubbles': true, 'cancelable': true });
        //                                         ele.dispatchEvent(inputEvent);
        //                                         ele.onkeyup({ 'bubbles': true, 'cancelable': true, ctrlKey: true, keyCode: 13, key: 'Enter', which: 13 } as any);
        //                                         this.request = jasmine.Ajax.requests.mostRecent();
        //                                         this.request.respondWith({
        //                                             status: 200,
        //                                             responseText: JSON.stringify(data4)
        //                                         });
        //                                         jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //                                         this.request = jasmine.Ajax.requests.mostRecent();
        //                                         this.request.respondWith({
        //                                             status: 200,
        //                                             responseText: JSON.stringify(data5)
        //                                         });
        //                                         jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //                                         setTimeout(function () {
        //                                             let li1: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
        //                                             expect(li1.length).toEqual(6);
        //                                             expect(document.getElementById('file_grid').querySelectorAll('.e-row').length).toEqual(6);
        //                                             done();
        //                                         }, 500);
        //                                     }, 500);
        //                                 }, 500);
        //                             }, 500);
        //                         }, 500);
        //                     }, 500);
        //                 }, 500);
        //             }, 500);
        //         }, 500);
        //     }, 500);
        // });
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
    describe('access control toolbar items testing', () => {
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
        it('mouse click on new folder button', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                allowMultiSelection: false,
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
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
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
                document.getElementById('file_tb_newfolder').click();
                let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerHTML).toEqual("Access Denied");
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
            }, 500);
        });
        it('mouse click on new folder button with access', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                allowMultiSelection: false,
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
                responseText: JSON.stringify(accessData5)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
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
                document.getElementById('file_tb_newfolder').click();
                let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerHTML).toEqual("Folder");
                done();
            }, 500);
        });
        it('mouse click on upload button', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                allowMultiSelection: false,
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
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
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
                document.getElementById('file_tb_upload').click();
                let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerHTML).toEqual("Access Denied");
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
            }, 500);
        });
        it('mouse click on upload button with access', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                allowMultiSelection: false,
                ajaxSettings: {
                    url: '/FileAccessOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                uploadSettings: { autoUpload: false }
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(accessData1)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
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
                document.getElementById('file_tb_upload').click();
                let fileObj: File = new File(["Nice One"], "sample.txt", { lastModified: 0, type: "overide/mimetype" })
                let eventArgs: any = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
                let uploadObj: any = document.querySelector('#file_upload');
                uploadObj.ej2_instances[0].onSelectFiles(eventArgs);
                let dialogObj: any = (document.getElementById("file_upload_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerHTML).toEqual("Upload Files");
                done();
            }, 500);
        });
        it('mouse click on refresh button', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                allowMultiSelection: false,
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
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
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
                document.getElementById('file_tb_refresh').click();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(accessData1)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
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
                }, 500);
            }, 500);
        });
        it('mouse click on rename button', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                allowMultiSelection: false,
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
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
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
                feObj.detailsviewModule.gridObj.selectRows([1]);
                document.getElementById('file_tb_rename').click();
                let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerHTML).toEqual("Access Denied");
                done();
            }, 500);
        });
        it('mouse click on rename button with access', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                allowMultiSelection: false,
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
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
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
                feObj.detailsviewModule.gridObj.selectRows([2]);
                document.getElementById('file_tb_rename').click();
                let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerHTML).toEqual("Rename");
                done();
            }, 500);
        });
        it('mouse click on delete button', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                allowMultiSelection: false,
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
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
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
                feObj.detailsviewModule.gridObj.selectRows([1]);
                document.getElementById('file_tb_delete').click();
                let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerHTML).toEqual("Access Denied");
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
            }, 500);
        });
        it('mouse click on delete button with access', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                allowMultiSelection: false,
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
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
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
                feObj.detailsviewModule.gridObj.selectRows([2]);
                document.getElementById('file_tb_delete').click();
                let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerHTML).toEqual("Delete File");
                done();
            }, 500);
        });
        it('mouse click on download button', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                allowMultiSelection: false,
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
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
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
                feObj.detailsviewModule.gridObj.selectRows([1]);
                document.getElementById('file_tb_download').click();
                let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerHTML).toEqual("Access Denied");
                done();
            }, 500);
        });
        it('mouse click on details button', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                allowMultiSelection: false,
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
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
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
                feObj.detailsviewModule.gridObj.selectRows([1]);
                document.getElementById('file_tb_details').click();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(accessDetails1)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                    expect(dialogObj.element.querySelector('.e-dlg-header').innerHTML).toEqual("Downloads");
                    expect(dialogObj.element.querySelectorAll('td')[8].innerHTML).toEqual("Permission");
                    done();
                }, 500);
            }, 500);
        });
        it('mouse click on cut and paste button', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                allowMultiSelection: false,
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
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
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
                feObj.detailsviewModule.gridObj.selectRows([8]);
                document.getElementById('file_tb_cut').click();
                mouseEventArgs.target = treeLi[3].querySelector('.e-fullrow');
                treeObj.touchClickObj.tap(tapEvent);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(accessData4)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    document.getElementById('file_tb_paste').click();
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify(accessData6)
                    });
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                        expect(dialogObj.element.querySelector('.e-dlg-header').innerHTML).toEqual("Access Denied");
                        done();
                    }, 400);
                }, 500);
            }, 500);
        });
        it('mouse click on copy and paste button', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                allowMultiSelection: false,
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
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
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
                feObj.detailsviewModule.gridObj.selectRows([4]);
                document.getElementById('file_tb_cut').click();
                mouseEventArgs.target = treeLi[3].querySelector('.e-fullrow');
                treeObj.touchClickObj.tap(tapEvent);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(accessData4)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    document.getElementById('file_tb_paste').click();
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify(accessData7)
                    });
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                        expect(dialogObj.element.querySelector('.e-dlg-header').innerHTML).toEqual("Access Denied");
                        done();
                    }, 400);
                }, 500);
            }, 500);
        });
        it('mouse click on delete button with two items selected', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                allowMultiSelection: false,
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
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
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
                feObj.detailsviewModule.gridObj.selectRows([0,1]);
                document.getElementById('file_tb_delete').click();
                let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerHTML).toEqual("Access Denied");
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
            }, 500);
        });
        it('mouse click on download button with two items selected', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                allowMultiSelection: false,
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
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
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
                feObj.detailsviewModule.gridObj.selectRows([0,1]);
                document.getElementById('file_tb_download').click();
                let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerHTML).toEqual("Access Denied");
                done();
            }, 500);
        });
        it('mouse click on details button with two items selected', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                allowMultiSelection: false,
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
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
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
                feObj.detailsviewModule.gridObj.selectRows([0,1]);
                document.getElementById('file_tb_details').click();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(accessDetails1)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                    expect(dialogObj.element.querySelector('.e-dlg-header').innerHTML).toEqual("Downloads");
                    expect(dialogObj.element.querySelectorAll('td')[8].innerHTML).toEqual("Permission");
                    done();
                }, 500);
            }, 500);
        });
    });
});

/**
 * FileManager spec document
 */
import { FileManager } from '../../../src/file-manager/base/file-manager';
import { NavigationPane } from '../../../src/file-manager/layout/navigation-pane';
import { DetailsView } from '../../../src/file-manager/layout/details-view';
import { Toolbar } from '../../../src/file-manager/actions/toolbar';
import { createElement } from '@syncfusion/ej2-base';
import { data1, data4, data5, data12, UploadData, data24, data25  } from '../data';
import { FileSelectEventArgs } from '../../../src';

FileManager.Inject(Toolbar, NavigationPane, DetailsView);

describe('FileManager control Grid view', () => {
    describe('keyboard event testing', () => {
        let keyboardEventArgs: any;
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
                showThumbnail: false,
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
            keyboardEventArgs = {
                preventDefault: (): void => { },
                action: null,
                target: null,
                stopImmediatePropagation: (): void => { },
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
        it('altN key pressed', (done: Function) => {
            keyboardEventArgs.action = 'altN';
            feObj.keyActionHandler(keyboardEventArgs);
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
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data5)
                });
                setTimeout(function () {
                    let li1: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
                    expect(li1.length).toEqual(6);
                    expect(document.getElementById('file_grid').querySelectorAll('.e-row').length).toEqual(6);
                    expect(document.getElementById('file_grid').querySelectorAll('.e-row')[4].getAttribute('aria-selected')).toBe('true');
                    done();
                }, 500);
            }, 500);
        });
        it('f5 key pressed', (done: Function) => {
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
            keyboardEventArgs.action = 'f5';
            feObj.keyActionHandler(keyboardEventArgs);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
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
        });
        it('ctrl + U key pressed', (done: Function) => {
            keyboardEventArgs.action = 'ctrlU';
            feObj.keyActionHandler(keyboardEventArgs);
            expect(document.getElementById('file_grid').querySelectorAll('.e-row').length).toBe(5);
            let fileObj: File[] = [];
            fileObj[0] = new File(["Nice One"], "sample.txt", { lastModified: 0, type: "overide/mimetype" });
            let eventArgs: any = { type: 'click', target: { files: fileObj }, preventDefault: (): void => { } };
            let uploadObj: any = document.querySelector('#' + feObj.element.id + '_upload');
            uploadObj.ej2_instances[0].onSelectFiles(eventArgs);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(UploadData)
            });
            setTimeout(function () {
                expect(document.querySelector('.e-file-status').innerHTML).toBe("File uploaded successfully");
                (<HTMLElement>document.querySelector('.e-dlg-closeicon-btn')).click();
                done();
            }, 500);
        });      
    });
    describe('keyboard event testing', () => {
        let feObj: any;
        let ele: HTMLElement;
        let originalTimeout: any;
        let mouseEventArgs: any, tapEvent: any, keyboardEventArgs: any;
        beforeEach((): void => {
            jasmine.Ajax.install();
            feObj = undefined;
            ele = createElement('div', { id: 'file' });
            document.body.appendChild(ele);
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
            keyboardEventArgs = {
                preventDefault: (): void => { },
                action: null,
                target: null,
                stopImmediatePropagation: (): void => { },
            };
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
        it('key pressed for rename with exsisting file name testing', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
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
                responseText: JSON.stringify(data24)
            });
            setTimeout(function () {
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                expect(treeLi.length).toEqual(6);
                expect(gridLi.length).toEqual(7);
                feObj.detailsviewModule.gridObj.selectRows([6]);
                keyboardEventArgs.action = 'f2';
                keyboardEventArgs.target = gridLi[6];
                feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
                let val: any = document.getElementById('file_dialog').querySelector('#rename');
                expect((val as any).value).toEqual("File1.txt");
                val.value = 'File.png';
                (document.getElementById('file_dialog').querySelectorAll('.e-btn')[1] as HTMLElement).click();
                keyboardEventArgs.keyCode = 13;
                (document.getElementById('file_extn_dialog').querySelectorAll('.e-btn')[1] as HTMLElement).onkeydown(keyboardEventArgs);
                (document.getElementById('file_extn_dialog').querySelectorAll('.e-btn')[1] as HTMLElement).onkeyup(keyboardEventArgs);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data25)
                });
                setTimeout(function () {
                    expect(document.getElementsByClassName('e-fe-error')[0].textContent).toEqual('Cannot rename "File1.txt" to "File.png": destination already exists.');
                    done();
                }, 500);
            }, 500);
        });
    });
    describe('for details View', () => {
        let keyboardEventArgs: any;
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
                showThumbnail: false,
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data12)
            });
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
            keyboardEventArgs = {
                preventDefault: (): void => { },
                action: null,
                target: null,
                stopImmediatePropagation: (): void => { },
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
        it('end key testing', () => {
            let li: any = document.getElementById('file_grid').querySelectorAll('tr.e-row');
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe(null);
            keyboardEventArgs.action = 'end';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe('true');
            feObj.detailsviewModule.gridObj.selectionModule.selectRowsByRange(0, 1);
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe(null);
            expect(li[1].getAttribute('aria-selected')).toBe('true');
            keyboardEventArgs.action = 'end';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe('true');
            keyboardEventArgs.action = 'ctrlHome';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].classList.contains('e-focused')).toBe(true);
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe('true');
            keyboardEventArgs.action = 'end';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].classList.contains('e-focused')).toBe(false);
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe('true');
        });
        it('home key testing', () => {
            let li: any = document.getElementById('file_grid').querySelectorAll('tr.e-row');
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            keyboardEventArgs.action = 'home';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            feObj.detailsviewModule.gridObj.selectionModule.selectRowsByRange(li.length - 1, li.length - 2);
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe('true');
            keyboardEventArgs.action = 'home';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe(null);
            keyboardEventArgs.action = 'ctrlHome';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[li.length - 1].classList.contains('e-focused')).toBe(false);
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            keyboardEventArgs.action = 'home';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[li.length - 1].classList.contains('e-focused')).toBe(false);
            expect(li[0].getAttribute('aria-selected')).toBe('true');
        });
        it('control+end key testing', () => {
            let li: any = document.getElementById('file_grid').querySelectorAll('tr.e-row');
            expect(li[li.length - 1].classList.contains('e-focused')).toBe(false);
            keyboardEventArgs.action = 'ctrlEnd';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[li.length - 1].classList.contains('e-focused')).toBe(true);
            feObj.detailsviewModule.gridObj.selectionModule.selectRow(0);
            expect(li[li.length - 1].classList.contains('e-focused')).toBe(false);
            keyboardEventArgs.action = 'ctrlEnd';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            expect(li[li.length - 1].classList.contains('e-focused')).toBe(true);
            keyboardEventArgs.action = 'end';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            expect(li[li.length - 1].classList.contains('e-focused')).toBe(true);
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe('true');
        });
        it('control+home key testing', () => {
            let li: any = document.getElementById('file_grid').querySelectorAll('tr.e-row');
            expect(li[0].classList.contains('e-focused')).toBe(false);
            keyboardEventArgs.action = 'ctrlHome';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].classList.contains('e-focused')).toBe(true);
            feObj.detailsviewModule.gridObj.selectionModule.selectRow(li.length - 1);
            expect(li[0].classList.contains('e-focused')).toBe(false);
            keyboardEventArgs.action = 'ctrlHome';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe('true');
            expect(li[0].classList.contains('e-focused')).toBe(true);
            keyboardEventArgs.action = 'home';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe(null);
            expect(li[0].classList.contains('e-focused')).toBe(true);
            expect(li[0].getAttribute('aria-selected')).toBe('true');
        });
        it('shift+end key testing', () => {
            let li: any = document.getElementById('file_grid').querySelectorAll('tr.e-row');
            expect(li[li.length - 1].classList.contains('e-focused')).toBe(false);
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe(null);
            keyboardEventArgs.action = 'shiftEnd';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[li.length - 1].classList.contains('e-focused')).toBe(true);
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe('true');
            expect(li[li.length - 2].getAttribute('aria-selected')).toBe('true');
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            keyboardEventArgs.action = 'home';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe(null);
            keyboardEventArgs.action = 'shiftEnd';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe('true');
            expect(li[li.length - 2].getAttribute('aria-selected')).toBe('true');
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            feObj.detailsviewModule.gridObj.selectionModule.selectRow(2);
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe(null);
            keyboardEventArgs.action = 'shiftEnd';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[2].getAttribute('aria-selected')).toBe('true');
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe('true');
        });
        it('shift+home key testing', () => {
            let li: any = document.getElementById('file_grid').querySelectorAll('tr.e-row');
            expect(li[0].classList.contains('e-focused')).toBe(false);
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            keyboardEventArgs.action = 'shiftHome';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            expect(li[1].getAttribute('aria-selected')).toBe(null);
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe(null);
            keyboardEventArgs.action = 'end';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            keyboardEventArgs.action = 'shiftHome';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            expect(li[1].getAttribute('aria-selected')).toBe('true');
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe('true');
            feObj.detailsviewModule.gridObj.selectionModule.selectRow(2);
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe(null);
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            keyboardEventArgs.action = 'shiftHome';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[2].getAttribute('aria-selected')).toBe('true');
            expect(li[0].getAttribute('aria-selected')).toBe('true');
        });

        it('CS+end key testing', () => {
            let li: any = document.getElementById('file_grid').querySelectorAll('tr.e-row');
            expect(li[li.length - 1].classList.contains('e-focused')).toBe(false);
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe(null);
            keyboardEventArgs.action = 'csEnd';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[li.length - 1].classList.contains('e-focused')).toBe(true);
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe('true');
            keyboardEventArgs.action = 'ctrlUp';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[li.length - 1].classList.contains('e-focused')).toBe(false);
            expect(li[li.length - 2].classList.contains('e-focused')).toBe(false);
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe('true');
            expect(li[li.length - 2].getAttribute('aria-selected')).toBe('true');
            expect(li[li.length - 3].getAttribute('aria-selected')).toBe('true');
            expect(li[li.length - 3].classList.contains('e-focused')).toBe(true);
            feObj.detailsviewModule.gridObj.selectRow(2);
            keyboardEventArgs.action = 'ctrlDown';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            keyboardEventArgs.action = 'csEnd';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[2].getAttribute('aria-selected')).toBe('true');
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe('true');
            feObj.detailsviewModule.gridObj.selectRows([2, 4]);
            keyboardEventArgs.action = 'csEnd';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            expect(li[1].getAttribute('aria-selected')).toBe(null);
            expect(li[2].getAttribute('aria-selected')).toBe('true');
            expect(li[3].getAttribute('aria-selected')).toBe(null);
            expect(li[4].getAttribute('aria-selected')).toBe('true');
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe('true');
            feObj.detailsviewModule.gridObj.selectRows([4, 2]);
            keyboardEventArgs.action = 'csEnd';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            expect(li[1].getAttribute('aria-selected')).toBe(null);
            expect(li[2].getAttribute('aria-selected')).toBe('true');
            expect(li[3].getAttribute('aria-selected')).toBe('true');
            expect(li[4].getAttribute('aria-selected')).toBe('true');
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe('true');
        });

        it('CS+home key testing', () => {
            let li: any = document.getElementById('file_grid').querySelectorAll('tr.e-row');
            expect(li[0].classList.contains('e-focused')).toBe(false);
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            keyboardEventArgs.action = 'csHome';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].classList.contains('e-focused')).toBe(true);
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            keyboardEventArgs.action = 'ctrlDown';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].classList.contains('e-focused')).toBe(false);
            expect(li[1].classList.contains('e-focused')).toBe(false);
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            expect(li[1].getAttribute('aria-selected')).toBe(null);
            expect(li[2].getAttribute('aria-selected')).toBe(null);
            expect(li[2].classList.contains('e-focused')).toBe(true);
            feObj.detailsviewModule.gridObj.selectRow(2);
            keyboardEventArgs.action = 'ctrlDown';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            keyboardEventArgs.action = 'csHome';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[3].getAttribute('aria-selected')).toBe(null);
            expect(li[2].getAttribute('aria-selected')).toBe('true');
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            feObj.detailsviewModule.gridObj.selectRows([1, 3]);
            keyboardEventArgs.action = 'csHome';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            expect(li[2].getAttribute('aria-selected')).toBe('true');
            expect(li[1].getAttribute('aria-selected')).toBe('true');
            expect(li[3].getAttribute('aria-selected')).toBe('true');
            expect(li[4].getAttribute('aria-selected')).toBe(null);
            feObj.detailsviewModule.gridObj.selectRows([3, 1]);
            keyboardEventArgs.action = 'csHome';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            expect(li[1].getAttribute('aria-selected')).toBe('true');
            expect(li[2].getAttribute('aria-selected')).toBe(null);
            expect(li[3].getAttribute('aria-selected')).toBe('true');
        });


        it('down key testing', () => {
            let li: any = document.getElementById('file_grid').querySelectorAll('tr.e-row');
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            keyboardEventArgs.action = 'moveDown';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            keyboardEventArgs.action = 'moveDown';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            expect(li[1].getAttribute('aria-selected')).toBe('true');
            keyboardEventArgs.action = 'ctrlDown';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[3].classList.contains('e-focused')).toBe(true);
            keyboardEventArgs.action = 'moveDown';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[1].getAttribute('aria-selected')).toBe(null);
            expect(li[4].getAttribute('aria-selected')).toBe('true');
            feObj.detailsviewModule.gridObj.selectRows([0, 2]);
            expect(li[1].getAttribute('aria-selected')).toBe(null);
            expect(li[4].getAttribute('aria-selected')).toBe(null);
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            expect(li[2].getAttribute('aria-selected')).toBe('true');
            keyboardEventArgs.action = 'moveDown';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            expect(li[2].getAttribute('aria-selected')).toBe(null);
            expect(li[3].getAttribute('aria-selected')).toBe('true');
            feObj.detailsviewModule.gridObj.selectRows([2, 0]);
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            expect(li[2].getAttribute('aria-selected')).toBe('true');
            keyboardEventArgs.action = 'moveDown';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[1].getAttribute('aria-selected')).toBe('true');
            expect(li[3].getAttribute('aria-selected')).toBe(null);
        });

        it('up key testing', () => {
            let li: any = document.getElementById('file_grid').querySelectorAll('tr.e-row');
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe(null);
            keyboardEventArgs.action = 'moveUp';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe(null);
            keyboardEventArgs.action = 'end';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe('true');
            keyboardEventArgs.action = 'moveUp';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe(null);
            expect(li[li.length - 2].getAttribute('aria-selected')).toBe('true');
            keyboardEventArgs.action = 'ctrlUp';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[li.length - 4].classList.contains('e-focused')).toBe(true);
            keyboardEventArgs.action = 'moveUp';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[li.length - 4].getAttribute('aria-selected')).toBe(null);
            expect(li[li.length - 5].getAttribute('aria-selected')).toBe('true');
            feObj.detailsviewModule.gridObj.selectRows([2, 0]);
            expect(li[li.length - 4].getAttribute('aria-selected')).toBe(null);
            expect(li[li.length - 3].getAttribute('aria-selected')).toBe(null);
            expect(li[2].getAttribute('aria-selected')).toBe('true');
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            keyboardEventArgs.action = 'moveUp';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[2].getAttribute('aria-selected')).toBe('true');
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            expect(li[1].getAttribute('aria-selected')).toBe(null);
            feObj.detailsviewModule.gridObj.selectRows([1, 3]);
            expect(li[1].getAttribute('aria-selected')).toBe('true');
            expect(li[3].getAttribute('aria-selected')).toBe('true');
            keyboardEventArgs.action = 'moveUp';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[2].getAttribute('aria-selected')).toBe('true');
            expect(li[1].getAttribute('aria-selected')).toBe(null);
            expect(li[3].getAttribute('aria-selected')).toBe(null);
        });

        it('ctrl + down key testing', () => {
            let li: any = document.getElementById('file_grid').querySelectorAll('tr.e-row');
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            keyboardEventArgs.action = 'ctrlDown';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            expect(li[0].classList.contains('e-focused')).toBe(true);
            keyboardEventArgs.action = 'ctrlDown';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            expect(li[0].classList.contains('e-focused')).toBe(false);
            expect(li[1].getAttribute('aria-selected')).toBe(null);
            expect(li[1].classList.contains('e-focused')).toBe(false);
            expect(li[2].getAttribute('aria-selected')).toBe(null);
            expect(li[2].classList.contains('e-focused')).toBe(false);
            expect(li[3].getAttribute('aria-selected')).toBe(null);
            expect(li[3].classList.contains('e-focused')).toBe(true);
            feObj.detailsviewModule.gridObj.selectRows([2, 0]);
            expect(feObj.detailsviewModule.getFocusedItemIndex()).toBe(0);
            keyboardEventArgs.action = 'ctrlDown';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[2].getAttribute('aria-selected')).toBe('true');
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            expect(li[1].getAttribute('aria-selected')).toBe(null);
            expect(li[1].classList.contains('e-focused')).toBe(true);
        });

        it('ctrl + up key testing', () => {
            let li: any = document.getElementById('file_grid').querySelectorAll('tr.e-row');
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            keyboardEventArgs.action = 'ctrlUp';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            expect(li[0].classList.contains('e-focused')).toBe(true);
            keyboardEventArgs.action = 'end';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe('true');
            keyboardEventArgs.action = 'ctrlUp';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[li.length - 4].getAttribute('aria-selected')).toBe(null);
            expect(li[li.length - 4].classList.contains('e-focused')).toBe(true);
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe('true');
            expect(li[li.length - 1].classList.contains('e-focused')).toBe(false);
            expect(li[li.length - 2].classList.contains('e-focused')).toBe(false);
            expect(li[li.length - 2].getAttribute('aria-selected')).toBe(null);
            expect(li[li.length - 3].classList.contains('e-focused')).toBe(false);
            expect(li[li.length - 3].getAttribute('aria-selected')).toBe(null);
            feObj.detailsviewModule.gridObj.selectRows([0, 2]);
            // expect(feObj.detailsviewModule.getFocusedItemIndex()).toBe(2);
            keyboardEventArgs.action = 'ctrlUp';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            expect(li[2].getAttribute('aria-selected')).toBe('true');
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            expect(li[2].getAttribute('aria-selected')).toBe('true');
            expect(li[1].classList.contains('e-focused')).toBe(true);
            expect(li[1].getAttribute('aria-selected')).toBe(null);
        });

        it('shift + down key testing', () => {
            let li: any = document.getElementById('file_grid').querySelectorAll('tr.e-row');
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            keyboardEventArgs.action = 'shiftDown';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            keyboardEventArgs.action = 'shiftDown';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            expect(li[1].getAttribute('aria-selected')).toBe('true');
            expect(li[2].getAttribute('aria-selected')).toBe('true');
            expect(li[3].getAttribute('aria-selected')).toBe('true');
            feObj.detailsviewModule.gridObj.selectRow(1);
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            expect(li[1].getAttribute('aria-selected')).toBe('true');
            expect(li[2].getAttribute('aria-selected')).toBe(null);
            expect(li[3].getAttribute('aria-selected')).toBe(null);
            keyboardEventArgs.action = 'ctrlDown';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            keyboardEventArgs.action = 'shiftDown';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            expect(li[1].getAttribute('aria-selected')).toBe('true');
            expect(li[2].getAttribute('aria-selected')).toBe('true');
            expect(li[3].getAttribute('aria-selected')).toBe('true');
            expect(li[4].getAttribute('aria-selected')).toBe('true');
            feObj.detailsviewModule.gridObj.selectRow(4);
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            expect(li[1].getAttribute('aria-selected')).toBe(null);
            expect(li[2].getAttribute('aria-selected')).toBe(null);
            expect(li[3].getAttribute('aria-selected')).toBe(null);
            expect(li[4].getAttribute('aria-selected')).toBe('true');
            keyboardEventArgs.action = 'ctrlUp';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            keyboardEventArgs.action = 'shiftDown';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            expect(li[1].getAttribute('aria-selected')).toBe(null);
            expect(li[2].getAttribute('aria-selected')).toBe(null);
            expect(li[3].getAttribute('aria-selected')).toBe('true');
            expect(li[4].getAttribute('aria-selected')).toBe('true');
            feObj.detailsviewModule.gridObj.selectRows([4, 2]);
            expect(li[4].getAttribute('aria-selected')).toBe('true');
            expect(li[3].getAttribute('aria-selected')).toBe(null);
            expect(li[2].getAttribute('aria-selected')).toBe('true');
            keyboardEventArgs.action = 'shiftDown';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[3].getAttribute('aria-selected')).toBe('true');
            expect(li[2].getAttribute('aria-selected')).toBe('true');
            expect(li[1].getAttribute('aria-selected')).toBe(null);
        });

        it('shift + up key testing', () => {
            let li: any = document.getElementById('file_grid').querySelectorAll('tr.e-row');
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            keyboardEventArgs.action = 'shiftUp';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            keyboardEventArgs.action = 'shiftUp';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            // expect(feObj.detailsviewModule.gridObj.getSelectedRowIndexes().length).toBe(1);
            keyboardEventArgs.action = 'end';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe('true');
            keyboardEventArgs.action = 'shiftUp';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe('true');
            expect(li[li.length - 2].getAttribute('aria-selected')).toBe('true');
            expect(li[li.length - 3].getAttribute('aria-selected')).toBe('true');
            expect(li[li.length - 4].getAttribute('aria-selected')).toBe('true');
            feObj.detailsviewModule.gridObj.selectRow(4);
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe(null);
            expect(li[4].getAttribute('aria-selected')).toBe('true');
            keyboardEventArgs.action = 'ctrlUp';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            keyboardEventArgs.action = 'shiftUp';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            expect(li[1].getAttribute('aria-selected')).toBe('true');
            expect(li[2].getAttribute('aria-selected')).toBe('true');
            expect(li[3].getAttribute('aria-selected')).toBe('true');
            expect(li[4].getAttribute('aria-selected')).toBe('true');
            feObj.detailsviewModule.gridObj.selectRow(1);
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            expect(li[1].getAttribute('aria-selected')).toBe('true');
            expect(li[2].getAttribute('aria-selected')).toBe(null);
            expect(li[3].getAttribute('aria-selected')).toBe(null);
            expect(li[4].getAttribute('aria-selected')).toBe(null);
            keyboardEventArgs.action = 'ctrlDown';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            keyboardEventArgs.action = 'shiftUp';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            expect(li[1].getAttribute('aria-selected')).toBe('true');
            expect(li[2].getAttribute('aria-selected')).toBe('true');
            expect(li[3].getAttribute('aria-selected')).toBe(null);
            expect(li[4].getAttribute('aria-selected')).toBe(null);
            feObj.detailsviewModule.gridObj.selectRows([4, 2]);
            expect(li[2].getAttribute('aria-selected')).toBe('true');
            expect(li[3].getAttribute('aria-selected')).toBe(null);
            expect(li[4].getAttribute('aria-selected')).toBe('true');
        });

        it('shift + down and shift + Up key testing', () => {
            let li: any = document.getElementById('file_grid').querySelectorAll('tr.e-row');
            feObj.detailsviewModule.gridObj.selectRows([3, 4]);
            keyboardEventArgs.action = 'shiftDown';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[3].getAttribute('aria-selected')).toBe('true');
            expect(li[4].getAttribute('aria-selected')).toBe('true');
            expect(li[5].getAttribute('aria-selected')).toBe('true');
            expect(li[6].getAttribute('aria-selected')).toBe('true');
            keyboardEventArgs.action = 'shiftUp';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[2].getAttribute('aria-selected')).toBe(null);
            expect(li[3].getAttribute('aria-selected')).toBe('true');
            expect(li[4].getAttribute('aria-selected')).toBe('true');
            expect(li[5].getAttribute('aria-selected')).toBe('true');
            expect(li[6].getAttribute('aria-selected')).toBe(null);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[2].getAttribute('aria-selected')).toBe(null);
            expect(li[3].getAttribute('aria-selected')).toBe('true');
            expect(li[4].getAttribute('aria-selected')).toBe(null);
            expect(li[5].getAttribute('aria-selected')).toBe(null);
            expect(li[6].getAttribute('aria-selected')).toBe(null);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            expect(li[1].getAttribute('aria-selected')).toBe('true');
            expect(li[2].getAttribute('aria-selected')).toBe('true');
            expect(li[3].getAttribute('aria-selected')).toBe('true');
            expect(li[4].getAttribute('aria-selected')).toBe(null);
            keyboardEventArgs.action = 'shiftDown';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            expect(li[1].getAttribute('aria-selected')).toBe(null);
            expect(li[2].getAttribute('aria-selected')).toBe(null);
            expect(li[3].getAttribute('aria-selected')).toBe('true');
            expect(li[4].getAttribute('aria-selected')).toBe(null);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            expect(li[1].getAttribute('aria-selected')).toBe(null);
            expect(li[2].getAttribute('aria-selected')).toBe(null);
            expect(li[3].getAttribute('aria-selected')).toBe('true');
            expect(li[4].getAttribute('aria-selected')).toBe('true');
            expect(li[5].getAttribute('aria-selected')).toBe('true');
        });

        it('continous shift + Up key testing', () => {
            feObj.detailsviewModule.gridObj.selectRows([4]);
            keyboardEventArgs.action = 'shiftUp';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(feObj.detailsviewModule.gridObj.getSelectedRowIndexes().toString()).toBe("4,3");
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(feObj.detailsviewModule.gridObj.getSelectedRowIndexes().toString()).toBe("4,3,2");
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(feObj.detailsviewModule.gridObj.getSelectedRowIndexes().toString()).toBe("4,3,2,1");
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(feObj.detailsviewModule.gridObj.getSelectedRowIndexes().toString()).toBe("4,3,2,1,0");
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(feObj.detailsviewModule.gridObj.getSelectedRowIndexes().toString()).toBe("4,3,2,1,0");
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(feObj.detailsviewModule.gridObj.getSelectedRowIndexes().toString()).toBe("4,3,2,1,0");
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(feObj.detailsviewModule.gridObj.getSelectedRowIndexes().toString()).toBe("4,3,2,1,0");
        });


        it('CS + up key testing', () => {
            let li: any = document.getElementById('file_grid').querySelectorAll('tr.e-row');
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            keyboardEventArgs.action = 'csUp';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            expect(li[0].classList.contains('e-focused')).toBe(true);
            keyboardEventArgs.action = 'end';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            keyboardEventArgs.action = 'csUp';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[li.length - 1].classList.contains('e-focused')).toBe(false);
            expect(li[li.length - 2].classList.contains('e-focused')).toBe(false);
            // expect(li[li.length-3].classList.contains('e-focused')).toBe(true);
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe('true');
            expect(li[li.length - 2].getAttribute('aria-selected')).toBe('true');
            expect(li[li.length - 3].getAttribute('aria-selected')).toBe('true');
            feObj.detailsviewModule.gridObj.selectRows([4, 2]);
            keyboardEventArgs.action = 'csUp';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[1].getAttribute('aria-selected')).toBe('true');
            expect(li[2].getAttribute('aria-selected')).toBe('true');
            feObj.detailsviewModule.gridObj.selectRows([2, 4]);
            keyboardEventArgs.action = 'csDown';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[4].getAttribute('aria-selected')).toBe('true');
            expect(li[5].getAttribute('aria-selected')).toBe('true');
        });

        it('CS + down key testing', () => {
            let li: any = document.getElementById('file_grid').querySelectorAll('tr.e-row');
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            keyboardEventArgs.action = 'csDown';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            expect(li[0].classList.contains('e-focused')).toBe(true);
            keyboardEventArgs.action = 'csDown';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].classList.contains('e-focused')).toBe(false);
            expect(li[1].classList.contains('e-focused')).toBe(false);
            expect(li[2].classList.contains('e-focused')).toBe(true);
            keyboardEventArgs.action = 'moveDown';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[1].classList.contains('e-focused')).toBe(false);
            expect(li[2].getAttribute('aria-selected')).toBe(null);
            expect(li[3].getAttribute('aria-selected')).toBe('true');
            keyboardEventArgs.action = 'csDown';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[2].getAttribute('aria-selected')).toBe(null);
            expect(li[3].getAttribute('aria-selected')).toBe('true');
            expect(li[5].getAttribute('aria-selected')).toBe('true');
            expect(li[7].getAttribute('aria-selected')).toBe(null);
            feObj.detailsviewModule.gridObj.selectRows([4, 2]);
            keyboardEventArgs.action = 'csDown';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[2].getAttribute('aria-selected')).toBe('true');
            expect(li[3].getAttribute('aria-selected')).toBe('true');
            feObj.detailsviewModule.gridObj.selectRows([2, 4]);
            keyboardEventArgs.action = 'csDown';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[4].getAttribute('aria-selected')).toBe('true');
            expect(li[5].getAttribute('aria-selected')).toBe('true');
        });

        it('CS + down key testing', () => {
            let li: any = document.getElementById('file_grid').querySelectorAll('tr.e-row');
            feObj.detailsviewModule.gridObj.selectRows([1, 3]);
            keyboardEventArgs.action = 'csDown';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[3].getAttribute('aria-selected')).toBe('true');
            expect(li[4].getAttribute('aria-selected')).toBe('true');
            expect(li[5].getAttribute('aria-selected')).toBe('true');
            keyboardEventArgs.action = 'csUp';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            expect(li[2].getAttribute('aria-selected')).toBe('true');
            expect(li[3].getAttribute('aria-selected')).toBe('true');
            expect(li[4].getAttribute('aria-selected')).toBe('true');
            expect(li[5].getAttribute('aria-selected')).toBe('true');
            feObj.detailsviewModule.gridObj.selectRows([1, 3]);
            keyboardEventArgs.action = 'csUp';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[3].getAttribute('aria-selected')).toBe('true');
            expect(li[2].getAttribute('aria-selected')).toBe('true');
            expect(li[1].getAttribute('aria-selected')).toBe('true');
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            keyboardEventArgs.action = 'csDown';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            expect(li[3].getAttribute('aria-selected')).toBe('true');
            expect(li[4].getAttribute('aria-selected')).toBe('true');
            expect(li[1].getAttribute('aria-selected')).toBe('true');
            expect(li[2].getAttribute('aria-selected')).toBe('true');
        });

        it('CS + down and CS + Up key testing', () => {
            let li: any = document.getElementById('file_grid').querySelectorAll('tr.e-row');
            feObj.detailsviewModule.gridObj.selectRow(3);
            keyboardEventArgs.action = 'csDown';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[2].getAttribute('aria-selected')).toBe(null);
            expect(li[3].getAttribute('aria-selected')).toBe('true');
            expect(li[4].getAttribute('aria-selected')).toBe('true');
            keyboardEventArgs.action = 'csUp';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[2].getAttribute('aria-selected')).toBe('true');
            expect(li[3].getAttribute('aria-selected')).toBe('true');
            expect(li[4].getAttribute('aria-selected')).toBe('true');
            expect(li[5].getAttribute('aria-selected')).toBe(null);
            keyboardEventArgs.action = 'csDown';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[1].getAttribute('aria-selected')).toBe(null);
            expect(li[2].getAttribute('aria-selected')).toBe('true');
            expect(li[3].getAttribute('aria-selected')).toBe('true');
            expect(li[4].getAttribute('aria-selected')).toBe('true');
            expect(li[5].getAttribute('aria-selected')).toBe('true');
            keyboardEventArgs.action = 'csUp';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            expect(li[1].getAttribute('aria-selected')).toBe('true');
            expect(li[2].getAttribute('aria-selected')).toBe('true');
            expect(li[3].getAttribute('aria-selected')).toBe('true');
            expect(li[4].getAttribute('aria-selected')).toBe('true');
            expect(li[5].getAttribute('aria-selected')).toBe('true');
        });
        it('enter key testing', () => {
            let li: any = document.getElementById('file_grid').querySelectorAll('tr.e-row');
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            keyboardEventArgs.action = 'ctrlDown';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            expect(li[0].classList.contains('e-focused')).toBe(true);
            keyboardEventArgs.action = 'space';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            expect(li[0].classList.contains('e-focused')).toBe(true);
            keyboardEventArgs.action = 'ctrlEnd';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[li.length - 1].classList.contains('e-focused')).toBe(true);
            keyboardEventArgs.action = 'space';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe('true');

        });
        it('ctrl + space key testing', () => {
            let li: any = document.getElementById('file_grid').querySelectorAll('tr.e-row');
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            feObj.detailsviewModule.gridObj.selectRow(0);
            keyboardEventArgs.action = 'ctrlDown';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            keyboardEventArgs.action = 'ctrlSpace';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            expect(li[1].getAttribute('aria-selected')).toBe(null);
            expect(li[2].getAttribute('aria-selected')).toBe('true');
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[2].getAttribute('aria-selected')).toBe(null);
            expect(li[2].classList.contains('e-focused')).toBe(true);
            feObj.detailsviewModule.gridObj.selectRow(3);
            keyboardEventArgs.action = 'ctrlUp';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            keyboardEventArgs.action = 'ctrlSpace';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[1].getAttribute('aria-selected')).toBe('true');
            expect(li[2].getAttribute('aria-selected')).toBe(null);
            expect(li[3].getAttribute('aria-selected')).toBe('true');
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[1].getAttribute('aria-selected')).toBe(null);
            expect(li[1].classList.contains('e-focused')).toBe(true);

        });
        it('cs + space key testing', () => {
            let li: any = document.getElementById('file_grid').querySelectorAll('tr.e-row');
            feObj.detailsviewModule.gridObj.selectRow(2);
            keyboardEventArgs.action = 'ctrlUp';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            keyboardEventArgs.action = 'csSpace';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            expect(li[1].getAttribute('aria-selected')).toBe('true');
            expect(li[2].getAttribute('aria-selected')).toBe('true');
            feObj.detailsviewModule.gridObj.selectRow(0);
            keyboardEventArgs.action = 'ctrlDown';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            keyboardEventArgs.action = 'csSpace';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            expect(li[1].getAttribute('aria-selected')).toBe('true');
            expect(li[2].getAttribute('aria-selected')).toBe('true');
            expect(li[3].getAttribute('aria-selected')).toBe(null);
        });

        it('shift + space key testing', () => {
            let li: any = document.getElementById('file_grid').querySelectorAll('tr.e-row');
            feObj.detailsviewModule.gridObj.selectRow(2);
            keyboardEventArgs.action = 'ctrlUp';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            keyboardEventArgs.action = 'shiftSpace';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            expect(li[1].getAttribute('aria-selected')).toBe('true');
            expect(li[2].getAttribute('aria-selected')).toBe('true');
            feObj.detailsviewModule.gridObj.selectRow(0);
            keyboardEventArgs.action = 'ctrlDown';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            keyboardEventArgs.action = 'shiftSpace';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            expect(li[1].getAttribute('aria-selected')).toBe('true');
            expect(li[2].getAttribute('aria-selected')).toBe('true');
            expect(li[3].getAttribute('aria-selected')).toBe(null);
            feObj.detailsviewModule.gridObj.selectRows([0, 2]);
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            expect(li[1].getAttribute('aria-selected')).toBe(null);
            expect(li[2].getAttribute('aria-selected')).toBe('true');
            keyboardEventArgs.action = 'shiftSpace';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            expect(li[1].getAttribute('aria-selected')).toBe(null);
            expect(li[2].getAttribute('aria-selected')).toBe('true');
            expect(li[3].getAttribute('aria-selected')).toBe(null);
            feObj.detailsviewModule.gridObj.selectRows([2, 0]);
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            expect(li[1].getAttribute('aria-selected')).toBe(null);
            expect(li[2].getAttribute('aria-selected')).toBe('true');
            keyboardEventArgs.action = 'shiftSpace';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            expect(li[1].getAttribute('aria-selected')).toBe(null);
            expect(li[2].getAttribute('aria-selected')).toBe(null);
        });

        it('tab key testing', function () {
            let li: any = document.getElementById('file_grid').querySelectorAll('tr.e-row');
            keyboardEventArgs.action = 'tab';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].classList.contains('e-focused')).toBe(true);
        });

        it('ctrl + A key testing', () => {
            feObj.fileSelect = (args:FileSelectEventArgs) =>{
                expect(args.isInteracted).toEqual(true);
            }
            let li: any = document.getElementById('file_grid').querySelectorAll('tr.e-row');
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe(null);
            keyboardEventArgs.action = 'ctrlA';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe('true');
            expect(document.querySelector(".e-headercell .e-frame").classList.contains('e-check')).toBe(true);
        });
    });
});
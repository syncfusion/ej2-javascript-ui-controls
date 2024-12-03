/**
 * FileManager spec document
 */
import { FileManager } from '../../../src/file-manager/base/file-manager';
import { NavigationPane } from '../../../src/file-manager/layout/navigation-pane';
import { DetailsView } from '../../../src/file-manager/layout/details-view';
import { Toolbar } from '../../../src/file-manager/actions/toolbar';
import { createElement } from '@syncfusion/ej2-base';
import { data1, data12, data24, data25 } from '../data';

FileManager.Inject(Toolbar, NavigationPane, DetailsView);

describe('FileManager control single selection Grid view', () => {
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
                allowMultiSelection: false,
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                showItemCheckBoxes:false
            }, '#file');
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
            expect(tr[0].getAttribute('aria-selected')).toBe(null);
            expect(tr[0].querySelector('.e-frame')).toBe(null);
            expect(tr[1].getAttribute('aria-selected')).toEqual('true');
            expect(tr[1].querySelector('.e-frame')).toBe(null);
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
                expect(ntr[1].getAttribute('aria-selected')).toBe(null);
                expect(ntr[1].querySelector('.e-frame')).toBe(null);
                expect(ntr[2].getAttribute('aria-selected')).toEqual('true');
                expect(ntr[2].querySelector('.e-frame')).toBe(null);
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
    describe('single selection keyboard testing', () => {
        let keyboardEventArgs: any;
        let tapEvent: any;
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
                allowMultiSelection: false
            }, '#file');
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
            tapEvent = {
                originalEvent: keyboardEventArgs,
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
        it('Home key pressed', () => {
            let li: any = document.getElementById('file_grid').querySelectorAll('tr.e-row');
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            keyboardEventArgs.action = 'home';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            feObj.detailsviewModule.gridObj.selectionModule.selectRow(li.length - 1);
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe('true');
            keyboardEventArgs.action = 'home';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe(null);
        });

        it('control + Home pressed', () => {
            let li: any = document.getElementById('file_grid').querySelectorAll('tr.e-row');
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            keyboardEventArgs.action = 'ctrlHome';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            feObj.detailsviewModule.gridObj.selectionModule.selectRow(li.length - 1);
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe('true');
            keyboardEventArgs.action = 'ctrlHome';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe(null);
        });

        it('control + end key pressed', () => {
            let li: any = document.getElementById('file_grid').querySelectorAll('tr.e-row');
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe(null);
            keyboardEventArgs.action = 'ctrlEnd';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe('true');
            feObj.detailsviewModule.gridObj.selectionModule.selectRow(0);
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe(null);
            keyboardEventArgs.action = 'ctrlEnd';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe('true');
        });

        it('shift + Home pressed', () => {
            let li: any = document.getElementById('file_grid').querySelectorAll('tr.e-row');
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            keyboardEventArgs.action = 'shiftHome';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            feObj.detailsviewModule.gridObj.selectionModule.selectRow(li.length - 1);
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe('true');
            keyboardEventArgs.action = 'shiftHome';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe(null);
        });

        it('shift + end key pressed', () => {
            let li: any = document.getElementById('file_grid').querySelectorAll('tr.e-row');
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe(null);
            keyboardEventArgs.action = 'shiftEnd';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe('true');
            feObj.detailsviewModule.gridObj.selectionModule.selectRow(0);
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe(null);
            keyboardEventArgs.action = 'shiftEnd';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe('true');
        });

        it('CS + Home pressed', () => {
            let li: any = document.getElementById('file_grid').querySelectorAll('tr.e-row');
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            keyboardEventArgs.action = 'csHome';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            feObj.detailsviewModule.gridObj.selectionModule.selectRow(li.length - 1);
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe('true');
            keyboardEventArgs.action = 'csHome';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe(null);
        });

        it('CS + end key pressed', () => {
            let li: any = document.getElementById('file_grid').querySelectorAll('tr.e-row');
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe(null);
            keyboardEventArgs.action = 'csEnd';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe('true');
            feObj.detailsviewModule.gridObj.selectionModule.selectRow(0);
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe(null);
            keyboardEventArgs.action = 'csEnd';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe('true');
        });

        it('up key pressed', () => {
            let li: any = document.getElementById('file_grid').querySelectorAll('tr.e-row');
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            keyboardEventArgs.action = 'moveUp';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            feObj.detailsviewModule.gridObj.selectionModule.selectRow(3);
            expect(li[3].getAttribute('aria-selected')).toBe('true');
            keyboardEventArgs.action = 'moveUp';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[3].getAttribute('aria-selected')).toBe(null);
            expect(li[2].getAttribute('aria-selected')).toBe('true');
            expect(feObj.detailsviewModule.gridObj.getSelectedRowIndexes().length).toBe(1);
        });

        it('down key pressed', () => {
            let li: any = document.getElementById('file_grid').querySelectorAll('tr.e-row');
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            keyboardEventArgs.action = 'moveDown';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            feObj.detailsviewModule.gridObj.selectionModule.selectRow(3);
            expect(li[3].getAttribute('aria-selected')).toBe('true');
            keyboardEventArgs.action = 'moveDown';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[4].getAttribute('aria-selected')).toBe('true');
            expect(li[3].getAttribute('aria-selected')).toBe(null);
            expect(feObj.detailsviewModule.gridObj.getSelectedRowIndexes().length).toBe(1);
        });

        it('control + up key pressed', () => {
            let li: any = document.getElementById('file_grid').querySelectorAll('tr.e-row');
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            keyboardEventArgs.action = 'ctrlUp';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            feObj.detailsviewModule.gridObj.selectionModule.selectRow(3);
            expect(li[3].getAttribute('aria-selected')).toBe('true');
            keyboardEventArgs.action = 'ctrlUp';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[3].getAttribute('aria-selected')).toBe(null);
            expect(li[2].getAttribute('aria-selected')).toBe('true');
            expect(feObj.detailsviewModule.gridObj.getSelectedRowIndexes().length).toBe(1);
        });

        it('control + down key pressed', () => {
            let li: any = document.getElementById('file_grid').querySelectorAll('tr.e-row');
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            keyboardEventArgs.action = 'ctrlDown';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            feObj.detailsviewModule.gridObj.selectionModule.selectRow(3);
            expect(li[3].getAttribute('aria-selected')).toBe('true');
            keyboardEventArgs.action = 'ctrlDown';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[4].getAttribute('aria-selected')).toBe('true');
            expect(li[3].getAttribute('aria-selected')).toBe(null);
            expect(feObj.detailsviewModule.gridObj.getSelectedRowIndexes().length).toBe(1);
        });

        it('shift + up key pressed', () => {
            let li: any = document.getElementById('file_grid').querySelectorAll('tr.e-row');
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            keyboardEventArgs.action = 'shiftUp';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            feObj.detailsviewModule.gridObj.selectionModule.selectRow(3);
            expect(li[3].getAttribute('aria-selected')).toBe('true');
            keyboardEventArgs.action = 'shiftUp';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[3].getAttribute('aria-selected')).toBe(null);
            expect(li[2].getAttribute('aria-selected')).toBe('true');
            expect(feObj.detailsviewModule.gridObj.getSelectedRowIndexes().length).toBe(1);
        });

        it('shift + down key pressed', () => {
            let li: any = document.getElementById('file_grid').querySelectorAll('tr.e-row');
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            keyboardEventArgs.action = 'shiftDown';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            feObj.detailsviewModule.gridObj.selectionModule.selectRow(3);
            expect(li[3].getAttribute('aria-selected')).toBe('true');
            keyboardEventArgs.action = 'shiftDown';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[4].getAttribute('aria-selected')).toBe('true');
            expect(li[3].getAttribute('aria-selected')).toBe(null);
            expect(feObj.detailsviewModule.gridObj.getSelectedRowIndexes().length).toBe(1);
        });

        it('CS + up key pressed', () => {
            let li: any = document.getElementById('file_grid').querySelectorAll('tr.e-row');
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            keyboardEventArgs.action = 'csUp';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            feObj.detailsviewModule.gridObj.selectionModule.selectRow(3);
            expect(li[3].getAttribute('aria-selected')).toBe('true');
            keyboardEventArgs.action = 'csUp';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[3].getAttribute('aria-selected')).toBe(null);
            expect(li[2].getAttribute('aria-selected')).toBe('true');
            expect(feObj.detailsviewModule.gridObj.getSelectedRowIndexes().length).toBe(1);
        });

        it('CS + down key pressed', () => {
            let li: any = document.getElementById('file_grid').querySelectorAll('tr.e-row');
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            keyboardEventArgs.action = 'csDown';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe('true');
            feObj.detailsviewModule.gridObj.selectionModule.selectRow(3);
            expect(li[3].getAttribute('aria-selected')).toBe('true');
            keyboardEventArgs.action = 'csDown';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[4].getAttribute('aria-selected')).toBe('true');
            expect(li[3].getAttribute('aria-selected')).toBe(null);
            expect(feObj.detailsviewModule.gridObj.getSelectedRowIndexes().length).toBe(1);
        });

        it('ctrl + A key testing', () => {
            let li: any = document.getElementById('file_grid').querySelectorAll('tr.e-row');
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe(null);
            keyboardEventArgs.action = 'ctrlA';
            feObj.detailsviewModule.keyupHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            expect(li[li.length - 1].getAttribute('aria-selected')).toBe(null);
        });
    });
});
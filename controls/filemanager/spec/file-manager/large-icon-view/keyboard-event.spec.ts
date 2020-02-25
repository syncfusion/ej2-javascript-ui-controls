/**
 * FileManager spec document
 */
import { FileManager } from '../../../src/file-manager/base/file-manager';
import { NavigationPane } from '../../../src/file-manager/layout/navigation-pane';
import { DetailsView } from '../../../src/file-manager/layout/details-view';
import { Toolbar } from '../../../src/file-manager/actions/toolbar';
import { createElement } from '@syncfusion/ej2-base';
import { data1, data4, data5, data12, accessData1, accessData5, accessDetails1, accessDetails2, accessData2, UploadData, data24, data25  } from '../data';
import { FileSelectEventArgs } from '../../../src';

FileManager.Inject(Toolbar, NavigationPane, DetailsView);

describe('FileManager control LargeIcons view', () => {
    describe('keyboard event testing', () => {
        let mouseEventArgs: any, tapEvent: any;
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
                view: 'LargeIcons',
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
        it('altN key pressed', (done: Function) => {
            keyboardEventArgs.action = 'altN';
            feObj.keyActionHandler(keyboardEventArgs);
            setTimeout(function () {
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
                expect(li.length).toEqual(5);
                expect(document.getElementById('file_largeicons').querySelectorAll('li').length).toEqual(5);
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
                    let nli: any = document.getElementById('file_largeicons').querySelectorAll('li');
                    expect(nli.length).toEqual(6);
                    expect(nli[4].classList.contains('e-active')).toBe(true);
                    expect(nli[4].classList.contains('e-focus')).toBe(true);
                    expect(nli[4].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
                    done();
                }, 500);
            }, 500);
        });
        it('f5 key pressed', (done: Function) => {
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
            expect(li.length).toEqual(4);
            expect(tr.length).toEqual(4);
            expect(ar.length).toEqual(0);
            expect(tr[0].classList.contains('e-active')).toBe(true);
            expect(tr[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(tr[1].classList.contains('e-active')).toBe(true);
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
        });
        it('ctrl + U key pressed', (done: Function) => {
            keyboardEventArgs.action = 'ctrlU';
            feObj.keyActionHandler(keyboardEventArgs);
            expect(document.querySelectorAll('.e-large-icon').length).toBe(5);
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
    describe('for LargeIcons View', () => {
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
                view: 'LargeIcons',
                width: "950px",
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
        it('end key testing', () => {
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li[0].classList.contains('e-active')).toBe(false);
            expect(li[0].classList.contains('e-focus')).toBe(false);
            expect(li[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            expect(li[0].getAttribute('tabindex')).toBe(null);
            expect(document.getElementById('file_largeicons').getAttribute('tabindex')).toBe('0');
            keyboardEventArgs.action = 'end';
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let nli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(nli[8].classList.contains('e-active')).toBe(true);
            expect(nli[8].classList.contains('e-focus')).toBe(true);
            expect(nli[8].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(nli[8].getAttribute('aria-selected')).toBe('true');
            expect(nli[8].getAttribute('tabindex')).toBe('0');
            expect(document.getElementById('file_largeicons').getAttribute('tabindex')).toBe('-1');
        });
        it('ctrl + end key testing', () => {
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li[0].classList.contains('e-active')).toBe(false);
            expect(li[0].classList.contains('e-focus')).toBe(false);
            expect(li[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            expect(li[0].getAttribute('tabindex')).toBe(null);
            keyboardEventArgs.action = 'ctrlEnd';
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let nli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(nli[8].classList.contains('e-active')).toBe(false);
            expect(nli[8].classList.contains('e-focus')).toBe(true);
            expect(nli[8].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            expect(nli[8].getAttribute('aria-selected')).toBe(null);
            expect(nli[8].getAttribute('tabindex')).toBe('0');
        });
        it('shift + end key testing', () => {
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li[0].classList.contains('e-active')).toBe(false);
            expect(li[0].classList.contains('e-focus')).toBe(false);
            expect(li[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            expect(li[0].getAttribute('tabindex')).toBe(null);
            keyboardEventArgs.action = 'shiftEnd';
            keyboardEventArgs.shiftKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let nli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(nli[8].classList.contains('e-active')).toBe(true);
            expect(nli[8].classList.contains('e-focus')).toBe(true);
            expect(nli[8].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(nli[8].getAttribute('aria-selected')).toBe('true');
            expect(nli[8].getAttribute('tabindex')).toBe('0');
        });
        it('ctrl + shift + end key testing', () => {
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li[0].classList.contains('e-active')).toBe(false);
            expect(li[0].classList.contains('e-focus')).toBe(false);
            expect(li[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            expect(li[0].getAttribute('tabindex')).toBe(null);
            keyboardEventArgs.action = 'csEnd';
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.shiftKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let nli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(nli[8].classList.contains('e-active')).toBe(true);
            expect(nli[8].classList.contains('e-focus')).toBe(true);
            expect(nli[8].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(nli[8].getAttribute('aria-selected')).toBe('true');
            expect(nli[8].getAttribute('tabindex')).toBe('0');
        });
        it('home key testing', () => {
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li[0].classList.contains('e-active')).toBe(false);
            expect(li[0].classList.contains('e-focus')).toBe(false);
            expect(li[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            expect(li[0].getAttribute('tabindex')).toBe(null);
            keyboardEventArgs.action = 'home';
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let nli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(nli[0].classList.contains('e-active')).toBe(true);
            expect(nli[0].classList.contains('e-focus')).toBe(true);
            expect(nli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(nli[0].getAttribute('aria-selected')).toBe('true');
            expect(nli[0].getAttribute('tabindex')).toBe('0');
        });
        it('ctrl + home key testing', () => {
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li[0].classList.contains('e-active')).toBe(false);
            expect(li[0].classList.contains('e-focus')).toBe(false);
            expect(li[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            expect(li[0].getAttribute('tabindex')).toBe(null);
            keyboardEventArgs.action = 'ctrlHome';
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let nli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(nli[0].classList.contains('e-active')).toBe(false);
            expect(nli[0].classList.contains('e-focus')).toBe(true);
            expect(nli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            expect(nli[0].getAttribute('aria-selected')).toBe(null);
            expect(nli[0].getAttribute('tabindex')).toBe('0');
        });
        it('shift + home key testing', () => {
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li[0].classList.contains('e-active')).toBe(false);
            expect(li[0].classList.contains('e-focus')).toBe(false);
            expect(li[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            expect(li[0].getAttribute('tabindex')).toBe(null);
            keyboardEventArgs.action = 'shiftHome';
            keyboardEventArgs.shiftKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let nli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(nli[0].classList.contains('e-active')).toBe(true);
            expect(nli[0].classList.contains('e-focus')).toBe(true);
            expect(nli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(nli[0].getAttribute('aria-selected')).toBe('true');
            expect(nli[0].getAttribute('tabindex')).toBe('0');
        });
        it('ctrl + shift + home key testing', () => {
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li[0].classList.contains('e-active')).toBe(false);
            expect(li[0].classList.contains('e-focus')).toBe(false);
            expect(li[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            expect(li[0].getAttribute('tabindex')).toBe(null);
            keyboardEventArgs.action = 'csHome';
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.shiftKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let nli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(nli[0].classList.contains('e-active')).toBe(true);
            expect(nli[0].classList.contains('e-focus')).toBe(true);
            expect(nli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(nli[0].getAttribute('aria-selected')).toBe('true');
            expect(nli[0].getAttribute('tabindex')).toBe('0');
        });
        it('down arrow key testing', () => {
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li[0].classList.contains('e-active')).toBe(false);
            expect(li[0].classList.contains('e-focus')).toBe(false);
            expect(li[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            expect(li[0].getAttribute('tabindex')).toBe(null);
            keyboardEventArgs.action = 'moveDown';
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let nli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(nli[0].classList.contains('e-active')).toBe(true);
            expect(nli[0].classList.contains('e-focus')).toBe(true);
            expect(nli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(nli[0].getAttribute('aria-selected')).toBe('true');
            expect(nli[0].getAttribute('tabindex')).toBe('0');
            keyboardEventArgs.action = 'moveDown';
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let neli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(neli[0].classList.contains('e-active')).toBe(false);
            expect(neli[0].classList.contains('e-focus')).toBe(false);
            expect(neli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            expect(neli[0].getAttribute('aria-selected')).toBe('false');
            expect(neli[0].getAttribute('tabindex')).toBe(null);
            expect(neli[7].classList.contains('e-active')).toBe(true);
            expect(neli[7].classList.contains('e-focus')).toBe(true);
            expect(neli[7].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(neli[7].getAttribute('aria-selected')).toBe('true');
            expect(neli[7].getAttribute('tabindex')).toBe('0');
            keyboardEventArgs.action = 'moveDown';
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let newli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(newli[0].classList.contains('e-active')).toBe(false);
            expect(newli[0].classList.contains('e-focus')).toBe(false);
            expect(newli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            expect(newli[0].getAttribute('aria-selected')).toBe('false');
            expect(newli[0].getAttribute('tabindex')).toBe(null);
            expect(newli[7].classList.contains('e-active')).toBe(true);
            expect(newli[7].classList.contains('e-focus')).toBe(true);
            expect(newli[7].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(newli[7].getAttribute('aria-selected')).toBe('true');
            expect(newli[7].getAttribute('tabindex')).toBe('0');
        });
        it('ctrl + down arrow key testing', () => {
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li[0].classList.contains('e-active')).toBe(false);
            expect(li[0].classList.contains('e-focus')).toBe(false);
            expect(li[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            expect(li[0].getAttribute('aria-selected')).toBe(null);
            expect(li[0].getAttribute('tabindex')).toBe(null);
            keyboardEventArgs.action = 'ctrlDown';
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let nli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(nli[0].classList.contains('e-active')).toBe(false);
            expect(nli[0].classList.contains('e-focus')).toBe(true);
            expect(nli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            expect(nli[0].getAttribute('aria-selected')).toBe(null);
            expect(nli[0].getAttribute('tabindex')).toBe('0');
            keyboardEventArgs.action = 'ctrlDown';
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let neli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(neli[0].classList.contains('e-active')).toBe(false);
            expect(neli[0].classList.contains('e-focus')).toBe(false);
            expect(neli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            expect(neli[0].getAttribute('aria-selected')).toBe(null);
            expect(neli[0].getAttribute('tabindex')).toBe(null);
            expect(neli[7].classList.contains('e-active')).toBe(false);
            expect(neli[7].classList.contains('e-focus')).toBe(true);
            expect(neli[7].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            expect(neli[7].getAttribute('aria-selected')).toBe(null);
            expect(neli[7].getAttribute('tabindex')).toBe('0');
            keyboardEventArgs.action = 'ctrlDown';
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let newli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(newli[0].classList.contains('e-active')).toBe(false);
            expect(newli[0].classList.contains('e-focus')).toBe(false);
            expect(newli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            expect(newli[0].getAttribute('aria-selected')).toBe(null);
            expect(newli[0].getAttribute('tabindex')).toBe(null);
            expect(newli[7].classList.contains('e-active')).toBe(false);
            expect(newli[7].classList.contains('e-focus')).toBe(true);
            expect(newli[7].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            expect(newli[7].getAttribute('aria-selected')).toBe(null);
            expect(newli[7].getAttribute('tabindex')).toBe('0');
        });
        it('shift + down arrow key testing', () => {
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li[0].classList.contains('e-active')).toBe(false);
            expect(li[0].classList.contains('e-focus')).toBe(false);
            expect(li[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            keyboardEventArgs.action = 'shiftDown';
            keyboardEventArgs.shiftKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let nli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(nli[0].classList.contains('e-active')).toBe(true);
            expect(nli[0].classList.contains('e-focus')).toBe(true);
            expect(nli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            keyboardEventArgs.action = 'shiftDown';
            keyboardEventArgs.shiftKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let neli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(neli[0].classList.contains('e-active')).toBe(true);
            expect(neli[0].classList.contains('e-focus')).toBe(false);
            expect(neli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(document.getElementById('file_largeicons').querySelectorAll('li.e-active').length).toBe(8);
            expect(neli[7].classList.contains('e-active')).toBe(true);
            expect(neli[7].classList.contains('e-focus')).toBe(true);
            expect(neli[7].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            keyboardEventArgs.action = 'shiftDown';
            keyboardEventArgs.shiftKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let newli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(newli[0].classList.contains('e-active')).toBe(true);
            expect(newli[0].classList.contains('e-focus')).toBe(false);
            expect(newli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(document.getElementById('file_largeicons').querySelectorAll('li.e-active').length).toBe(8);
            expect(newli[7].classList.contains('e-active')).toBe(true);
            expect(newli[7].classList.contains('e-focus')).toBe(true);
            expect(newli[7].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
        });
        it('ctrl + shift + down arrow key testing', () => {
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li[0].classList.contains('e-active')).toBe(false);
            expect(li[0].classList.contains('e-focus')).toBe(false);
            expect(li[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            keyboardEventArgs.action = 'csDown';
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.shiftKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let nli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(nli[0].classList.contains('e-active')).toBe(true);
            expect(nli[0].classList.contains('e-focus')).toBe(true);
            expect(nli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            keyboardEventArgs.action = 'csDown';
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.shiftKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let neli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(neli[0].classList.contains('e-active')).toBe(true);
            expect(neli[0].classList.contains('e-focus')).toBe(false);
            expect(neli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(document.getElementById('file_largeicons').querySelectorAll('li.e-active').length).toBe(8);
            expect(neli[7].classList.contains('e-active')).toBe(true);
            expect(neli[7].classList.contains('e-focus')).toBe(true);
            expect(neli[7].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            keyboardEventArgs.action = 'csDown';
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.shiftKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let newli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(newli[0].classList.contains('e-active')).toBe(true);
            expect(newli[0].classList.contains('e-focus')).toBe(false);
            expect(newli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(document.getElementById('file_largeicons').querySelectorAll('li.e-active').length).toBe(8);
            expect(newli[7].classList.contains('e-active')).toBe(true);
            expect(newli[7].classList.contains('e-focus')).toBe(true);
            expect(newli[7].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
        });
        it('up arrow key testing', () => {
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li[0].classList.contains('e-active')).toBe(false);
            expect(li[0].classList.contains('e-focus')).toBe(false);
            expect(li[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            keyboardEventArgs.action = 'moveUp';
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let nli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(nli[0].classList.contains('e-active')).toBe(true);
            expect(nli[0].classList.contains('e-focus')).toBe(true);
            expect(nli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            keyboardEventArgs.action = 'moveUp';
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let neli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(neli[0].classList.contains('e-active')).toBe(true);
            expect(neli[0].classList.contains('e-focus')).toBe(true);
            expect(neli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(neli[7].classList.contains('e-active')).toBe(false);
            expect(neli[7].classList.contains('e-focus')).toBe(false);
            expect(neli[7].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            keyboardEventArgs.action = 'moveDown';
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let newli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(newli[0].classList.contains('e-active')).toBe(false);
            expect(newli[0].classList.contains('e-focus')).toBe(false);
            expect(newli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            expect(newli[7].classList.contains('e-active')).toBe(true);
            expect(newli[7].classList.contains('e-focus')).toBe(true);
            expect(newli[7].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            keyboardEventArgs.action = 'moveUp';
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let newli1: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(newli1[0].classList.contains('e-active')).toBe(true);
            expect(newli1[0].classList.contains('e-focus')).toBe(true);
            expect(newli1[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(newli1[7].classList.contains('e-active')).toBe(false);
            expect(newli1[7].classList.contains('e-focus')).toBe(false);
            expect(newli1[7].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
        });
        it('ctrl + up arrow key testing', () => {
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li[0].classList.contains('e-active')).toBe(false);
            expect(li[0].classList.contains('e-focus')).toBe(false);
            expect(li[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            keyboardEventArgs.action = 'ctrlUp';
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let nli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(nli[0].classList.contains('e-active')).toBe(false);
            expect(nli[0].classList.contains('e-focus')).toBe(true);
            expect(nli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            keyboardEventArgs.action = 'ctrlUp';
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let neli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(neli[0].classList.contains('e-active')).toBe(false);
            expect(neli[0].classList.contains('e-focus')).toBe(true);
            expect(neli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            expect(neli[7].classList.contains('e-active')).toBe(false);
            expect(neli[7].classList.contains('e-focus')).toBe(false);
            expect(neli[7].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            keyboardEventArgs.action = 'ctrlDown';
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let newli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(newli[0].classList.contains('e-active')).toBe(false);
            expect(newli[0].classList.contains('e-focus')).toBe(false);
            expect(newli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            expect(newli[7].classList.contains('e-active')).toBe(false);
            expect(newli[7].classList.contains('e-focus')).toBe(true);
            expect(newli[7].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            keyboardEventArgs.action = 'ctrlUp';
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let newli1: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(newli1[0].classList.contains('e-active')).toBe(false);
            expect(newli1[0].classList.contains('e-focus')).toBe(true);
            expect(newli1[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            expect(newli1[7].classList.contains('e-active')).toBe(false);
            expect(newli1[7].classList.contains('e-focus')).toBe(false);
            expect(newli1[7].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
        });
        it('shilft + up arrow key testing', () => {
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li[0].classList.contains('e-active')).toBe(false);
            expect(li[0].classList.contains('e-focus')).toBe(false);
            expect(li[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            keyboardEventArgs.action = 'shiftUp';
            keyboardEventArgs.shiftKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let nli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(nli[0].classList.contains('e-active')).toBe(true);
            expect(nli[0].classList.contains('e-focus')).toBe(true);
            expect(nli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            keyboardEventArgs.action = 'shiftUp';
            keyboardEventArgs.shiftKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let neli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(neli[0].classList.contains('e-active')).toBe(true);
            expect(neli[0].classList.contains('e-focus')).toBe(true);
            expect(neli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(neli[7].classList.contains('e-active')).toBe(false);
            expect(neli[7].classList.contains('e-focus')).toBe(false);
            expect(neli[7].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            keyboardEventArgs.action = 'moveDown';
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let newli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(newli[0].classList.contains('e-active')).toBe(false);
            expect(newli[0].classList.contains('e-focus')).toBe(false);
            expect(newli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            expect(newli[7].classList.contains('e-active')).toBe(true);
            expect(newli[7].classList.contains('e-focus')).toBe(true);
            expect(newli[7].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            keyboardEventArgs.action = 'shiftUp';
            keyboardEventArgs.shiftKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let newli1: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(newli1[0].classList.contains('e-active')).toBe(true);
            expect(newli1[0].classList.contains('e-focus')).toBe(true);
            expect(newli1[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(document.getElementById('file_largeicons').querySelectorAll('li.e-active').length).toBe(8);
            expect(newli1[7].classList.contains('e-active')).toBe(true);
            expect(newli1[7].classList.contains('e-focus')).toBe(false);
            expect(newli1[7].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
        });
        it('ctrl + shilft + up arrow key testing', () => {
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li[0].classList.contains('e-active')).toBe(false);
            expect(li[0].classList.contains('e-focus')).toBe(false);
            expect(li[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            keyboardEventArgs.action = 'csUp';
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.shiftKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let nli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(nli[0].classList.contains('e-active')).toBe(true);
            expect(nli[0].classList.contains('e-focus')).toBe(true);
            expect(nli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            keyboardEventArgs.action = 'csUp';
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.shiftKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let neli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(neli[0].classList.contains('e-active')).toBe(true);
            expect(neli[0].classList.contains('e-focus')).toBe(true);
            expect(neli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(neli[7].classList.contains('e-active')).toBe(false);
            expect(neli[7].classList.contains('e-focus')).toBe(false);
            expect(neli[7].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            keyboardEventArgs.action = 'moveDown';
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let newli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(newli[0].classList.contains('e-active')).toBe(false);
            expect(newli[0].classList.contains('e-focus')).toBe(false);
            expect(newli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            expect(newli[7].classList.contains('e-active')).toBe(true);
            expect(newli[7].classList.contains('e-focus')).toBe(true);
            expect(newli[7].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            keyboardEventArgs.action = 'csUp';
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.shiftKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let newli1: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(newli1[0].classList.contains('e-active')).toBe(true);
            expect(newli1[0].classList.contains('e-focus')).toBe(true);
            expect(newli1[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(document.getElementById('file_largeicons').querySelectorAll('li.e-active').length).toBe(8);
            expect(newli1[7].classList.contains('e-active')).toBe(true);
            expect(newli1[7].classList.contains('e-focus')).toBe(false);
            expect(newli1[7].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
        });
        it('right arrow key testing', () => {
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li[0].classList.contains('e-active')).toBe(false);
            expect(li[0].classList.contains('e-focus')).toBe(false);
            expect(li[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            keyboardEventArgs.action = 'moveRight';
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let nli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(nli[0].classList.contains('e-active')).toBe(true);
            expect(nli[0].classList.contains('e-focus')).toBe(true);
            expect(nli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            keyboardEventArgs.action = 'moveRight';
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let neli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(neli[0].classList.contains('e-active')).toBe(false);
            expect(neli[0].classList.contains('e-focus')).toBe(false);
            expect(neli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            expect(neli[1].classList.contains('e-active')).toBe(true);
            expect(neli[1].classList.contains('e-focus')).toBe(true);
            expect(neli[1].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            keyboardEventArgs.action = 'end';
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let newli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(newli[1].classList.contains('e-active')).toBe(false);
            expect(newli[1].classList.contains('e-focus')).toBe(false);
            expect(newli[1].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            expect(newli[8].classList.contains('e-active')).toBe(true);
            expect(newli[8].classList.contains('e-focus')).toBe(true);
            expect(newli[8].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            keyboardEventArgs.action = 'moveRight';
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let newli1: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(newli1[8].classList.contains('e-active')).toBe(true);
            expect(newli1[8].classList.contains('e-focus')).toBe(true);
            expect(newli1[8].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
        });
        it('ctrl + right arrow key testing', () => {
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li[0].classList.contains('e-active')).toBe(false);
            expect(li[0].classList.contains('e-focus')).toBe(false);
            expect(li[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            keyboardEventArgs.action = 'ctrlRight';
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let nli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(nli[0].classList.contains('e-active')).toBe(false);
            expect(nli[0].classList.contains('e-focus')).toBe(true);
            expect(nli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            keyboardEventArgs.action = 'ctrlRight';
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let neli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(neli[0].classList.contains('e-active')).toBe(false);
            expect(neli[0].classList.contains('e-focus')).toBe(false);
            expect(neli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            expect(neli[1].classList.contains('e-active')).toBe(false);
            expect(neli[1].classList.contains('e-focus')).toBe(true);
            expect(neli[1].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            keyboardEventArgs.action = 'moveRight';
            keyboardEventArgs.ctrlKey = false;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let newli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(newli[1].classList.contains('e-active')).toBe(false);
            expect(newli[1].classList.contains('e-focus')).toBe(false);
            expect(newli[1].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            expect(newli[2].classList.contains('e-active')).toBe(true);
            expect(newli[2].classList.contains('e-focus')).toBe(true);
            expect(newli[2].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            keyboardEventArgs.action = 'ctrlRight';
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let newli1: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(newli1[2].classList.contains('e-active')).toBe(true);
            expect(newli1[2].classList.contains('e-focus')).toBe(false);
            expect(newli1[2].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(newli1[3].classList.contains('e-active')).toBe(false);
            expect(newli1[3].classList.contains('e-focus')).toBe(true);
            expect(newli1[3].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
        });
        it('shift + right arrow key testing', () => {
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li[0].classList.contains('e-active')).toBe(false);
            expect(li[0].classList.contains('e-focus')).toBe(false);
            expect(li[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            keyboardEventArgs.action = 'shiftRight';
            keyboardEventArgs.shiftKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let nli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(nli[0].classList.contains('e-active')).toBe(true);
            expect(nli[0].classList.contains('e-focus')).toBe(true);
            expect(nli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            keyboardEventArgs.action = 'shiftRight';
            keyboardEventArgs.shiftKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let neli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(neli[0].classList.contains('e-active')).toBe(true);
            expect(neli[0].classList.contains('e-focus')).toBe(false);
            expect(neli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(neli[1].classList.contains('e-active')).toBe(true);
            expect(neli[1].classList.contains('e-focus')).toBe(true);
            expect(neli[1].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            keyboardEventArgs.action = 'moveRight';
            keyboardEventArgs.shiftKey = false;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let newli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(newli[1].classList.contains('e-active')).toBe(false);
            expect(newli[1].classList.contains('e-focus')).toBe(false);
            expect(newli[1].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            expect(newli[2].classList.contains('e-active')).toBe(true);
            expect(newli[2].classList.contains('e-focus')).toBe(true);
            expect(newli[2].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            keyboardEventArgs.action = 'shiftRight';
            keyboardEventArgs.shiftKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let newli1: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(newli1[2].classList.contains('e-active')).toBe(true);
            expect(newli1[2].classList.contains('e-focus')).toBe(false);
            expect(newli1[2].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(newli1[3].classList.contains('e-active')).toBe(true);
            expect(newli1[3].classList.contains('e-focus')).toBe(true);
            expect(newli1[3].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
        });
        it('ctrl + shift + right arrow key testing', () => {
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li[0].classList.contains('e-active')).toBe(false);
            expect(li[0].classList.contains('e-focus')).toBe(false);
            expect(li[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            keyboardEventArgs.action = 'csRight';
            keyboardEventArgs.shiftKey = true;
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let nli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(nli[0].classList.contains('e-active')).toBe(true);
            expect(nli[0].classList.contains('e-focus')).toBe(true);
            expect(nli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            keyboardEventArgs.action = 'csRight';
            keyboardEventArgs.shiftKey = true;
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let neli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(neli[0].classList.contains('e-active')).toBe(true);
            expect(neli[0].classList.contains('e-focus')).toBe(false);
            expect(neli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(neli[1].classList.contains('e-active')).toBe(true);
            expect(neli[1].classList.contains('e-focus')).toBe(true);
            expect(neli[1].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            keyboardEventArgs.action = 'moveRight';
            keyboardEventArgs.shiftKey = false;
            keyboardEventArgs.ctrlKey = false;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let newli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(newli[1].classList.contains('e-active')).toBe(false);
            expect(newli[1].classList.contains('e-focus')).toBe(false);
            expect(newli[1].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            expect(newli[2].classList.contains('e-active')).toBe(true);
            expect(newli[2].classList.contains('e-focus')).toBe(true);
            expect(newli[2].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            keyboardEventArgs.action = 'csRight';
            keyboardEventArgs.shiftKey = true;
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let newli1: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(newli1[2].classList.contains('e-active')).toBe(true);
            expect(newli1[2].classList.contains('e-focus')).toBe(false);
            expect(newli1[2].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(newli1[3].classList.contains('e-active')).toBe(true);
            expect(newli1[3].classList.contains('e-focus')).toBe(true);
            expect(newli1[3].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
        });
        it('left arrow key testing', () => {
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li[0].classList.contains('e-active')).toBe(false);
            expect(li[0].classList.contains('e-focus')).toBe(false);
            expect(li[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            keyboardEventArgs.action = 'moveLeft';
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let nli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(nli[0].classList.contains('e-active')).toBe(true);
            expect(nli[0].classList.contains('e-focus')).toBe(true);
            expect(nli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            keyboardEventArgs.action = 'moveLeft';
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let neli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(neli[0].classList.contains('e-active')).toBe(true);
            expect(neli[0].classList.contains('e-focus')).toBe(true);
            expect(neli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            keyboardEventArgs.action = 'moveRight';
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let newli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(newli[0].classList.contains('e-active')).toBe(false);
            expect(newli[0].classList.contains('e-focus')).toBe(false);
            expect(newli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            expect(newli[1].classList.contains('e-active')).toBe(true);
            expect(newli[1].classList.contains('e-focus')).toBe(true);
            expect(newli[1].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            keyboardEventArgs.action = 'moveLeft';
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let newli1: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(newli1[0].classList.contains('e-active')).toBe(true);
            expect(newli1[0].classList.contains('e-focus')).toBe(true);
            expect(newli1[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(newli1[1].classList.contains('e-active')).toBe(false);
            expect(newli1[1].classList.contains('e-focus')).toBe(false);
            expect(newli1[1].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
        });
        it('ctrl + left arrow key testing', () => {
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li[0].classList.contains('e-active')).toBe(false);
            expect(li[0].classList.contains('e-focus')).toBe(false);
            expect(li[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            keyboardEventArgs.action = 'ctrlLeft';
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let nli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(nli[0].classList.contains('e-active')).toBe(false);
            expect(nli[0].classList.contains('e-focus')).toBe(true);
            expect(nli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            keyboardEventArgs.action = 'moveRight';
            keyboardEventArgs.ctrlKey = false;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let newli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(newli[0].classList.contains('e-active')).toBe(false);
            expect(newli[0].classList.contains('e-focus')).toBe(false);
            expect(newli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            expect(newli[1].classList.contains('e-active')).toBe(true);
            expect(newli[1].classList.contains('e-focus')).toBe(true);
            expect(newli[1].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            keyboardEventArgs.action = 'ctrlRight';
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let neli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(neli[1].classList.contains('e-active')).toBe(true);
            expect(neli[1].classList.contains('e-focus')).toBe(false);
            expect(neli[1].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(neli[2].classList.contains('e-active')).toBe(false);
            expect(neli[2].classList.contains('e-focus')).toBe(true);
            expect(neli[2].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            keyboardEventArgs.action = 'ctrlLeft';
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let newli1: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(newli1[2].classList.contains('e-active')).toBe(false);
            expect(newli1[2].classList.contains('e-focus')).toBe(false);
            expect(newli1[2].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            expect(newli1[1].classList.contains('e-active')).toBe(true);
            expect(newli1[1].classList.contains('e-focus')).toBe(true);
            expect(newli1[1].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            keyboardEventArgs.action = 'ctrlLeft';
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let newli2: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(newli2[2].classList.contains('e-active')).toBe(false);
            expect(newli2[2].classList.contains('e-focus')).toBe(false);
            expect(newli2[2].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            expect(newli2[1].classList.contains('e-active')).toBe(true);
            expect(newli2[1].classList.contains('e-focus')).toBe(false);
            expect(newli2[1].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(newli2[0].classList.contains('e-active')).toBe(false);
            expect(newli2[0].classList.contains('e-focus')).toBe(true);
            expect(newli2[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
        });
        it('shift + left arrow key testing', () => {
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li[0].classList.contains('e-active')).toBe(false);
            expect(li[0].classList.contains('e-focus')).toBe(false);
            expect(li[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            keyboardEventArgs.action = 'shiftLeft';
            keyboardEventArgs.shiftKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let nli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(nli[0].classList.contains('e-active')).toBe(true);
            expect(nli[0].classList.contains('e-focus')).toBe(true);
            expect(nli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            keyboardEventArgs.action = 'moveRight';
            keyboardEventArgs.shiftKey = false;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let newli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(newli[0].classList.contains('e-active')).toBe(false);
            expect(newli[0].classList.contains('e-focus')).toBe(false);
            expect(newli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            expect(newli[1].classList.contains('e-active')).toBe(true);
            expect(newli[1].classList.contains('e-focus')).toBe(true);
            expect(newli[1].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            keyboardEventArgs.action = 'shiftRight';
            keyboardEventArgs.shiftKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let neli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(neli[1].classList.contains('e-active')).toBe(true);
            expect(neli[1].classList.contains('e-focus')).toBe(false);
            expect(neli[1].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(neli[2].classList.contains('e-active')).toBe(true);
            expect(neli[2].classList.contains('e-focus')).toBe(true);
            expect(neli[2].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            keyboardEventArgs.action = 'shiftLeft';
            keyboardEventArgs.shiftKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let newli1: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(newli1[2].classList.contains('e-active')).toBe(false);
            expect(newli1[2].classList.contains('e-focus')).toBe(false);
            expect(newli1[2].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            expect(newli1[1].classList.contains('e-active')).toBe(true);
            expect(newli1[1].classList.contains('e-focus')).toBe(true);
            expect(newli1[1].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            keyboardEventArgs.action = 'shiftLeft';
            keyboardEventArgs.shiftKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let newli2: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(newli2[2].classList.contains('e-active')).toBe(false);
            expect(newli2[2].classList.contains('e-focus')).toBe(false);
            expect(newli2[2].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            expect(newli2[1].classList.contains('e-active')).toBe(true);
            expect(newli2[1].classList.contains('e-focus')).toBe(false);
            expect(newli2[1].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(newli2[0].classList.contains('e-active')).toBe(true);
            expect(newli2[0].classList.contains('e-focus')).toBe(true);
            expect(newli2[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
        });
        it('ctrl + shift + left arrow key testing', () => {
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li[0].classList.contains('e-active')).toBe(false);
            expect(li[0].classList.contains('e-focus')).toBe(false);
            expect(li[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            keyboardEventArgs.action = 'csLeft';
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.shiftKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let nli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(nli[0].classList.contains('e-active')).toBe(true);
            expect(nli[0].classList.contains('e-focus')).toBe(true);
            expect(nli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            keyboardEventArgs.action = 'moveRight';
            keyboardEventArgs.ctrlKey = false;
            keyboardEventArgs.shiftKey = false;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let newli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(newli[0].classList.contains('e-active')).toBe(false);
            expect(newli[0].classList.contains('e-focus')).toBe(false);
            expect(newli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            expect(newli[1].classList.contains('e-active')).toBe(true);
            expect(newli[1].classList.contains('e-focus')).toBe(true);
            expect(newli[1].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            keyboardEventArgs.action = 'csRight';
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.shiftKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let neli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(neli[1].classList.contains('e-active')).toBe(true);
            expect(neli[1].classList.contains('e-focus')).toBe(false);
            expect(neli[1].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(neli[2].classList.contains('e-active')).toBe(true);
            expect(neli[2].classList.contains('e-focus')).toBe(true);
            expect(neli[2].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            keyboardEventArgs.action = 'csLeft';
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.shiftKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let newli1: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(newli1[2].classList.contains('e-active')).toBe(true);
            expect(newli1[2].classList.contains('e-focus')).toBe(false);
            expect(newli1[2].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(newli1[1].classList.contains('e-active')).toBe(true);
            expect(newli1[1].classList.contains('e-focus')).toBe(true);
            expect(newli1[1].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            keyboardEventArgs.action = 'csLeft';
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.shiftKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let newli2: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(newli2[2].classList.contains('e-active')).toBe(true);
            expect(newli2[2].classList.contains('e-focus')).toBe(false);
            expect(newli2[2].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(newli2[1].classList.contains('e-active')).toBe(true);
            expect(newli2[1].classList.contains('e-focus')).toBe(false);
            expect(newli2[1].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(newli2[0].classList.contains('e-active')).toBe(true);
            expect(newli2[0].classList.contains('e-focus')).toBe(true);
            expect(newli2[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
        });
        it('space key testing', () => {
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li[0].classList.contains('e-active')).toBe(false);
            expect(li[0].classList.contains('e-focus')).toBe(false);
            expect(li[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            keyboardEventArgs.action = 'moveRight';
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let nli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(nli[0].classList.contains('e-active')).toBe(true);
            expect(nli[0].classList.contains('e-focus')).toBe(true);
            expect(nli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            keyboardEventArgs.action = 'ctrlRight';
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let neli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(neli[0].classList.contains('e-active')).toBe(true);
            expect(neli[0].classList.contains('e-focus')).toBe(false);
            expect(neli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(neli[1].classList.contains('e-active')).toBe(false);
            expect(neli[1].classList.contains('e-focus')).toBe(true);
            expect(neli[1].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            keyboardEventArgs.action = 'space';
            keyboardEventArgs.ctrlKey = false;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let newli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(newli[0].classList.contains('e-active')).toBe(true);
            expect(newli[0].classList.contains('e-focus')).toBe(false);
            expect(newli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(newli[1].classList.contains('e-active')).toBe(true);
            expect(newli[1].classList.contains('e-focus')).toBe(true);
            expect(newli[1].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            keyboardEventArgs.action = 'space';
            keyboardEventArgs.ctrlKey = false;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let newli1: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(newli1[0].classList.contains('e-active')).toBe(true);
            expect(newli1[0].classList.contains('e-focus')).toBe(false);
            expect(newli1[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(newli1[1].classList.contains('e-active')).toBe(true);
            expect(newli1[1].classList.contains('e-focus')).toBe(true);
            expect(newli1[1].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
        });
        it('ctrl + space key testing', () => {
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li[0].classList.contains('e-active')).toBe(false);
            expect(li[0].classList.contains('e-focus')).toBe(false);
            expect(li[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            keyboardEventArgs.action = 'moveRight';
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let nli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(nli[0].classList.contains('e-active')).toBe(true);
            expect(nli[0].classList.contains('e-focus')).toBe(true);
            expect(nli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            keyboardEventArgs.action = 'ctrlRight';
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let neli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(neli[0].classList.contains('e-active')).toBe(true);
            expect(neli[0].classList.contains('e-focus')).toBe(false);
            expect(neli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(neli[1].classList.contains('e-active')).toBe(false);
            expect(neli[1].classList.contains('e-focus')).toBe(true);
            expect(neli[1].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            keyboardEventArgs.action = 'ctrlSpace';
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let newli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(newli[0].classList.contains('e-active')).toBe(true);
            expect(newli[0].classList.contains('e-focus')).toBe(false);
            expect(newli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(newli[1].classList.contains('e-active')).toBe(true);
            expect(newli[1].classList.contains('e-focus')).toBe(true);
            expect(newli[1].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            keyboardEventArgs.action = 'ctrlSpace';
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let newli1: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(newli1[0].classList.contains('e-active')).toBe(true);
            expect(newli1[0].classList.contains('e-focus')).toBe(false);
            expect(newli1[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(newli1[1].classList.contains('e-active')).toBe(false);
            expect(newli1[1].classList.contains('e-focus')).toBe(true);
            expect(newli1[1].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
        });
        it('shift + space key testing', () => {
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li[0].classList.contains('e-active')).toBe(false);
            expect(li[0].classList.contains('e-focus')).toBe(false);
            expect(li[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            keyboardEventArgs.action = 'moveRight';
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let nli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(nli[0].classList.contains('e-active')).toBe(true);
            expect(nli[0].classList.contains('e-focus')).toBe(true);
            expect(nli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            keyboardEventArgs.action = 'ctrlRight';
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let neli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(neli[0].classList.contains('e-active')).toBe(true);
            expect(neli[0].classList.contains('e-focus')).toBe(false);
            expect(neli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(neli[1].classList.contains('e-active')).toBe(false);
            expect(neli[1].classList.contains('e-focus')).toBe(true);
            expect(neli[1].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            keyboardEventArgs.action = 'shiftSpace';
            keyboardEventArgs.ctrlKey = false;
            keyboardEventArgs.shiftKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let newli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(newli[0].classList.contains('e-active')).toBe(true);
            expect(newli[0].classList.contains('e-focus')).toBe(false);
            expect(newli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(newli[1].classList.contains('e-active')).toBe(true);
            expect(newli[1].classList.contains('e-focus')).toBe(true);
            expect(newli[1].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            keyboardEventArgs.action = 'shiftSpace';
            keyboardEventArgs.ctrlKey = false;
            keyboardEventArgs.shiftKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let newli1: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(newli1[0].classList.contains('e-active')).toBe(true);
            expect(newli1[0].classList.contains('e-focus')).toBe(false);
            expect(newli1[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(newli1[1].classList.contains('e-active')).toBe(true);
            expect(newli1[1].classList.contains('e-focus')).toBe(true);
            expect(newli1[1].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
        });
        it('ctrl + shift + space key testing', () => {
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li[0].classList.contains('e-active')).toBe(false);
            expect(li[0].classList.contains('e-focus')).toBe(false);
            expect(li[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            keyboardEventArgs.action = 'moveRight';
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let nli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(nli[0].classList.contains('e-active')).toBe(true);
            expect(nli[0].classList.contains('e-focus')).toBe(true);
            expect(nli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            keyboardEventArgs.action = 'ctrlRight';
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let neli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(neli[0].classList.contains('e-active')).toBe(true);
            expect(neli[0].classList.contains('e-focus')).toBe(false);
            expect(neli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(neli[1].classList.contains('e-active')).toBe(false);
            expect(neli[1].classList.contains('e-focus')).toBe(true);
            expect(neli[1].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            keyboardEventArgs.action = 'csSpace';
            keyboardEventArgs.ctrlKey = false;
            keyboardEventArgs.shiftKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let newli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(newli[0].classList.contains('e-active')).toBe(true);
            expect(newli[0].classList.contains('e-focus')).toBe(false);
            expect(newli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(newli[1].classList.contains('e-active')).toBe(true);
            expect(newli[1].classList.contains('e-focus')).toBe(true);
            expect(newli[1].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            keyboardEventArgs.action = 'csSpace';
            keyboardEventArgs.ctrlKey = false;
            keyboardEventArgs.shiftKey = true;
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let newli1: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(newli1[0].classList.contains('e-active')).toBe(true);
            expect(newli1[0].classList.contains('e-focus')).toBe(false);
            expect(newli1[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(newli1[1].classList.contains('e-active')).toBe(true);
            expect(newli1[1].classList.contains('e-focus')).toBe(true);
            expect(newli1[1].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
        });
        it('ctrl + A key testing', () => {
            feObj.fileSelect = (args:FileSelectEventArgs) =>{
                expect(args.isInteracted).toEqual(true);
            }
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li[0].classList.contains('e-active')).toBe(false);
            expect(li[0].classList.contains('e-focus')).toBe(false);
            expect(li[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            keyboardEventArgs.action = 'ctrlA';
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let nli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(nli[0].classList.contains('e-active')).toBe(true);
            expect(nli[0].classList.contains('e-focus')).toBe(false);
            expect(nli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(document.getElementById('file_largeicons').querySelectorAll('li.e-active').length).toBe(9);
            expect(nli[8].classList.contains('e-active')).toBe(true);
            expect(nli[8].classList.contains('e-focus')).toBe(true);
            expect(nli[8].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
        });
        it('enter key testing', (done: Function) => {
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(li[8].classList.contains('e-active')).toBe(false);
            expect(li[8].classList.contains('e-focus')).toBe(false);
            expect(li[8].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            keyboardEventArgs.action = 'end';
            keyboardEventArgs.target = li[8];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let nli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(nli[8].classList.contains('e-active')).toBe(true);
            expect(nli[8].classList.contains('e-focus')).toBe(true);
            expect(nli[8].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            keyboardEventArgs.action = 'enter';
            keyboardEventArgs.target = li[8];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let neli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(neli[8].classList.contains('e-active')).toBe(true);
            expect(neli[8].classList.contains('e-focus')).toBe(true);
            expect(neli[8].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            keyboardEventArgs.action = 'home';
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            let newli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            expect(newli[0].classList.contains('e-active')).toBe(true);
            expect(newli[0].classList.contains('e-focus')).toBe(true);
            expect(newli[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            keyboardEventArgs.action = 'enter';
            keyboardEventArgs.target = li[0];
            feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            setTimeout(function () {
                let li1: any = document.getElementById('file_largeicons').querySelectorAll('li');
                expect(li1.length).toBe(5);
                let li2: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
                expect((li2[0] as Element).classList.contains('e-active')).toBe(false);
                expect((li2[1] as Element).classList.contains('e-active')).toBe(true);
                keyboardEventArgs.action = 'enter';
                keyboardEventArgs.target = li[0];
                feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
                let li3: any = document.getElementById('file_largeicons').querySelectorAll('li');
                expect(li3.length).toBe(5);
                let li4: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
                expect((li4[0] as Element).classList.contains('e-active')).toBe(false);
                expect((li4[1] as Element).classList.contains('e-active')).toBe(true);
                done();
            }, 500);
        });
        it('layout context menu with up and down arrow test case', (done: Function) => {
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            let li: any = document.getElementById('file_largeicons');
            keyboardEventArgs.target = li;
            tapEvent.tapCount = 1;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            li.dispatchEvent(evt);
            setTimeout(function () {
                keyboardEventArgs.action = "uparrow";
                feObj.contextmenuModule.keyActionHandler(keyboardEventArgs);
                // expect(el.offsetHeight !== 0).toBe(true)
                // expect(el.offsetWidth !== 0).toBe(true)
                keyboardEventArgs.action = "downarrow";
                feObj.contextmenuModule.keyActionHandler(keyboardEventArgs);
                // expect(el.offsetHeight !== 0).toBe(true)
                // expect(el.offsetWidth !== 0).toBe(true)
                done();
            });
        });
    });
    describe('access control keyboard event testing', () => {
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
        it('key pressed for new folder testing', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
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
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                expect(treeLi.length).toEqual(5);
                expect(largeLi.length).toEqual(9);
                let aTreeLi: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                let aLargeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item.e-fe-hidden');
                expect(aTreeLi.length).toEqual(2);
                expect(aLargeLi.length).toEqual(4);
                expect(treeLi[2].classList.contains('e-fe-hidden')).toBe(true);
                expect(largeLi[1].classList.contains('e-fe-hidden')).toBe(true);
                keyboardEventArgs.action = 'altN';
                feObj.keyActionHandler(keyboardEventArgs);
                let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerText).toEqual("Access Denied");
                let treeLi1: any = treeObj.element.querySelectorAll('li');
                let largeLi1: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                expect(treeLi1.length).toEqual(5);
                expect(largeLi1.length).toEqual(9);
                let aTreeLi1: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                let aLargeLi1: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item.e-fe-hidden');
                expect(aTreeLi1.length).toEqual(2);
                expect(aLargeLi1.length).toEqual(4);
                expect(treeLi1[2].classList.contains('e-fe-hidden')).toBe(true);
                expect(largeLi1[1].classList.contains('e-fe-hidden')).toBe(true);
                done();
            }, 500);
        });
        it('key pressed for new folder testing with access', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
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
            setTimeout(function () {
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                expect(treeLi.length).toEqual(5);
                expect(largeLi.length).toEqual(9);
                let aTreeLi: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                let aLargeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item.e-fe-hidden');
                expect(aTreeLi.length).toEqual(2);
                expect(aLargeLi.length).toEqual(4);
                expect(treeLi[2].classList.contains('e-fe-hidden')).toBe(true);
                expect(largeLi[1].classList.contains('e-fe-hidden')).toBe(true);
                keyboardEventArgs.action = 'altN';
                feObj.keyActionHandler(keyboardEventArgs);
                let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerHTML).toEqual("Folder");
                done();
            }, 500);
        });
        it('key pressed for refresh testing', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
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
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                expect(treeLi.length).toEqual(5);
                expect(largeLi.length).toEqual(9);
                let aTreeLi: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                let aLargeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item.e-fe-hidden');
                expect(aTreeLi.length).toEqual(2);
                expect(aLargeLi.length).toEqual(4);
                expect(treeLi[2].classList.contains('e-fe-hidden')).toBe(true);
                expect(largeLi[1].classList.contains('e-fe-hidden')).toBe(true);
                keyboardEventArgs.action = 'f5';
                feObj.keyActionHandler(keyboardEventArgs);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(accessData1)
                });
                setTimeout(function () {
                    let treeLi1: any = treeObj.element.querySelectorAll('li');
                    let largeLi1: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                    expect(treeLi1.length).toEqual(5);
                    expect(largeLi1.length).toEqual(9);
                    let aTreeLi1: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                    let aLargeLi1: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item.e-fe-hidden');
                    expect(aTreeLi1.length).toEqual(2);
                    expect(aLargeLi1.length).toEqual(4);
                    expect(treeLi1[2].classList.contains('e-fe-hidden')).toBe(true);
                    expect(largeLi1[1].classList.contains('e-fe-hidden')).toBe(true);
                    done();
                }, 500);
            }, 500);
        });
        it('key pressed for rename testing', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
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
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                expect(treeLi.length).toEqual(5);
                expect(largeLi.length).toEqual(9);
                let aTreeLi: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                let aLargeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item.e-fe-hidden');
                expect(aTreeLi.length).toEqual(2);
                expect(aLargeLi.length).toEqual(4);
                expect(treeLi[2].classList.contains('e-fe-hidden')).toBe(true);
                expect(largeLi[1].classList.contains('e-fe-hidden')).toBe(true);
                mouseEventArgs.target = largeLi[1];
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                keyboardEventArgs.action = 'f2';
                keyboardEventArgs.target = largeLi[1];
                feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
                let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerText).toEqual("Access Denied");
                done();
            }, 500);
        });
        it('key pressed for rename testing with access', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
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
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                expect(treeLi.length).toEqual(5);
                expect(largeLi.length).toEqual(9);
                let aTreeLi: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                let aLargeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item.e-fe-hidden');
                expect(aTreeLi.length).toEqual(2);
                expect(aLargeLi.length).toEqual(4);
                expect(treeLi[2].classList.contains('e-fe-hidden')).toBe(true);
                expect(largeLi[1].classList.contains('e-fe-hidden')).toBe(true);
                mouseEventArgs.target = largeLi[2];
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                keyboardEventArgs.action = 'f2';
                keyboardEventArgs.target = largeLi[2];
                feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
                let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerHTML).toEqual("Rename");
                done();
            }, 500);
        });
        it('key pressed for delete testing', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
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
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                expect(treeLi.length).toEqual(5);
                expect(largeLi.length).toEqual(9);
                let aTreeLi: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                let aLargeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item.e-fe-hidden');
                expect(aTreeLi.length).toEqual(2);
                expect(aLargeLi.length).toEqual(4);
                expect(treeLi[2].classList.contains('e-fe-hidden')).toBe(true);
                expect(largeLi[1].classList.contains('e-fe-hidden')).toBe(true);
                mouseEventArgs.target = largeLi[1];
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                keyboardEventArgs.action = 'del';
                keyboardEventArgs.target = largeLi[1];
                feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
                let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerText).toEqual("Access Denied");
                let treeLi1: any = treeObj.element.querySelectorAll('li');
                let largeLi1: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                expect(treeLi1.length).toEqual(5);
                expect(largeLi1.length).toEqual(9);
                let aTreeLi1: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                let aLargeLi1: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item.e-fe-hidden');
                expect(aTreeLi1.length).toEqual(2);
                expect(aLargeLi1.length).toEqual(4);
                expect(treeLi1[2].classList.contains('e-fe-hidden')).toBe(true);
                expect(largeLi1[1].classList.contains('e-fe-hidden')).toBe(true);
                done();
            }, 500);
        });
        it('key pressed for delete testing with access', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
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
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                expect(treeLi.length).toEqual(5);
                expect(largeLi.length).toEqual(9);
                let aTreeLi: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                let aLargeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item.e-fe-hidden');
                expect(aTreeLi.length).toEqual(2);
                expect(aLargeLi.length).toEqual(4);
                expect(treeLi[2].classList.contains('e-fe-hidden')).toBe(true);
                expect(largeLi[1].classList.contains('e-fe-hidden')).toBe(true);
                mouseEventArgs.target = largeLi[2];
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                keyboardEventArgs.action = 'del';
                keyboardEventArgs.target = largeLi[2];
                feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
                let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerHTML).toEqual("Delete File");
                done();
            }, 500);
        });
        it('key pressed for details testing', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
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
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                expect(treeLi.length).toEqual(5);
                expect(largeLi.length).toEqual(9);
                let aTreeLi: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                let aLargeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item.e-fe-hidden');
                expect(aTreeLi.length).toEqual(2);
                expect(aLargeLi.length).toEqual(4);
                expect(treeLi[2].classList.contains('e-fe-hidden')).toBe(true);
                expect(largeLi[1].classList.contains('e-fe-hidden')).toBe(true);
                mouseEventArgs.target = largeLi[1];
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                keyboardEventArgs.action = 'altEnter';
                keyboardEventArgs.target = largeLi[1];
                feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(accessDetails1)
                });
                setTimeout(function () {
                    let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                    expect(dialogObj.element.querySelector('.e-dlg-header').innerHTML).toEqual("Downloads");
                    expect(dialogObj.element.querySelectorAll('td')[8].innerHTML).toEqual("Permission");
                    done();
                }, 500);
            }, 500);
        });
        it('key pressed for delete testing with two items selected', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
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
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                expect(treeLi.length).toEqual(5);
                expect(largeLi.length).toEqual(9);
                let aTreeLi: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                let aLargeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item.e-fe-hidden');
                expect(aTreeLi.length).toEqual(2);
                expect(aLargeLi.length).toEqual(4);
                expect(treeLi[2].classList.contains('e-fe-hidden')).toBe(true);
                expect(largeLi[1].classList.contains('e-fe-hidden')).toBe(true);
                mouseEventArgs.target = largeLi[1];
                mouseEventArgs.ctrlKey = true;
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                mouseEventArgs.target = largeLi[2];
                mouseEventArgs.ctrlKey = true;
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                keyboardEventArgs.action = 'del';
                keyboardEventArgs.target = largeLi[2];
                feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
                let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerText).toEqual("Access Denied");
                let treeLi1: any = treeObj.element.querySelectorAll('li');
                let largeLi1: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                expect(treeLi1.length).toEqual(5);
                expect(largeLi1.length).toEqual(9);
                let aTreeLi1: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                let aLargeLi1: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item.e-fe-hidden');
                expect(aTreeLi1.length).toEqual(2);
                expect(aLargeLi1.length).toEqual(4);
                expect(treeLi1[2].classList.contains('e-fe-hidden')).toBe(true);
                expect(largeLi1[1].classList.contains('e-fe-hidden')).toBe(true);
                done();
            }, 500);
        });
        it('key pressed for details testing with two items selected', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
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
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                expect(treeLi.length).toEqual(5);
                expect(largeLi.length).toEqual(9);
                let aTreeLi: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                let aLargeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item.e-fe-hidden');
                expect(aTreeLi.length).toEqual(2);
                expect(aLargeLi.length).toEqual(4);
                expect(treeLi[2].classList.contains('e-fe-hidden')).toBe(true);
                expect(largeLi[1].classList.contains('e-fe-hidden')).toBe(true);
                mouseEventArgs.target = largeLi[1];
                mouseEventArgs.ctrlKey = true;
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                mouseEventArgs.target = largeLi[2];
                mouseEventArgs.ctrlKey = true;
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                keyboardEventArgs.action = 'altEnter';
                keyboardEventArgs.target = largeLi[2];
                feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(accessDetails2)
                });
                setTimeout(function () {
                    let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                    expect(dialogObj.element.querySelector('.e-dlg-header').innerHTML).toEqual("Downloads, Music.png");
                    done();
                }, 500);
            }, 500);
        });
        it('key pressed for open folder testing with non access folder/files', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
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
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                expect(treeLi.length).toEqual(5);
                expect(largeLi.length).toEqual(9);
                let aTreeLi: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                let aLargeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item.e-fe-hidden');
                expect(aTreeLi.length).toEqual(2);
                expect(aLargeLi.length).toEqual(4);
                expect(treeLi[2].classList.contains('e-fe-hidden')).toBe(true);
                expect(largeLi[1].classList.contains('e-fe-hidden')).toBe(true);
                mouseEventArgs.target = largeLi[1];
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                keyboardEventArgs.action = 'enter';
                keyboardEventArgs.target = largeLi[1];
                feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
                let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerText).toEqual("Access Denied");
                dialogObj.element.querySelector('.e-primary').click();
                mouseEventArgs.target = largeLi[7];
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                keyboardEventArgs.action = 'enter';
                keyboardEventArgs.target = largeLi[7];
                feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
                expect(dialogObj.element.querySelector('.e-dlg-header').innerText).toEqual("Access Denied");
                done();
            }, 500);
        });
        it('key pressed for open folder testing with access folder/files', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
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
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                expect(treeLi.length).toEqual(5);
                expect(largeLi.length).toEqual(9);
                let aTreeLi: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                let aLargeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item.e-fe-hidden');
                expect(aTreeLi.length).toEqual(2);
                expect(aLargeLi.length).toEqual(4);
                expect(treeLi[2].classList.contains('e-fe-hidden')).toBe(true);
                expect(largeLi[1].classList.contains('e-fe-hidden')).toBe(true);
                mouseEventArgs.target = largeLi[0];
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                keyboardEventArgs.action = 'enter';
                keyboardEventArgs.target = largeLi[0];
                feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(accessData2)
                });
                setTimeout(function () {
                    let treeLi1: any = treeObj.element.querySelectorAll('li');
                    let largeLi1: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                    expect(treeLi1.length).toEqual(7);
                    expect(largeLi1.length).toEqual(12);
                    let aTreeLi1: any = treeObj.element.querySelectorAll('li.e-fe-hidden');
                    let aLargeLi1: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item.e-fe-hidden');
                    expect(aTreeLi1.length).toEqual(2);
                    expect(aLargeLi1.length).toEqual(5);
                    expect(treeLi1[2].classList.contains('e-fe-hidden')).toBe(false);
                    expect(largeLi1[2].classList.contains('e-fe-hidden')).toBe(true);
                    mouseEventArgs.target = largeLi1[2];
                    feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                    keyboardEventArgs.action = 'enter';
                    keyboardEventArgs.target = largeLi1[2];
                    feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
                    let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                    expect(dialogObj.element.querySelector('.e-dlg-header').innerText).toEqual("Access Denied");
                    dialogObj.element.querySelector('.e-primary').click();
                    mouseEventArgs.target = largeLi1[7];
                    feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                    keyboardEventArgs.action = 'enter';
                    keyboardEventArgs.target = largeLi1[7];
                    feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
                    let dialogObj1: any = (document.getElementById("file_img_dialog") as any).ej2_instances[0];
                    expect(dialogObj1.element.querySelector('.e-dlg-header').innerHTML).toEqual("4.jpg");
                    done();
                }, 500);
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
                view: 'LargeIcons',
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
                let largeLi: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-item');
                expect(treeLi.length).toEqual(6);
                expect(largeLi.length).toEqual(7);
                mouseEventArgs.target = largeLi[6];
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                keyboardEventArgs.action = 'f2';
                keyboardEventArgs.target = largeLi[6];
                feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
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
});

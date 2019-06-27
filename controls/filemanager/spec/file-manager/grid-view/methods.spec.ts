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
    describe('methods testing', () => {
        let feObj: FileManager;
        let ele: HTMLElement;
        beforeEach(() => {
            jasmine.Ajax.install();
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
            feObj.appendTo(ele);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
        });
        afterEach(() => {
            jasmine.Ajax.uninstall();
            if (feObj) feObj.destroy();
            ele.remove();
        });
        it('for getModuleName', () => {
            expect(feObj.getModuleName()).toBe('filemanager');
        });
        it('for getPersistData', () => {
            expect(feObj.getPersistData()).toBe('{"view":"Details","path":"/","selectedItems":[]}');
        });
        it('for disableToolbarItems', () => {
            feObj.disableToolbarItems(['NewFolder']);
            expect(feObj.element.querySelectorAll(".e-toolbar-item")[0].classList.contains('e-overlay')).toEqual(true);
            feObj.disableToolbarItems(["Upload", "Details"]);
            // expect(feObj.element.querySelectorAll(".e-toolbar-item.e-overlay").length).toEqual(3);
            // expect(feObj.element.querySelectorAll(".e-toolbar-item")[1].classList.contains('e-overlay')).toEqual(true);
            // expect(feObj.element.querySelectorAll(".e-toolbar-item")[13].classList.contains('e-overlay')).toEqual(true);
            feObj.disableToolbarItems(null);
            // expect(feObj.element.querySelectorAll(".e-toolbar-item.e-overlay").length).toEqual(3);
            feObj.disableToolbarItems(["Paste1"]);
            // expect(feObj.element.querySelectorAll(".e-toolbar-item.e-overlay").length).toEqual(3);
            feObj.disableToolbarItems(["Paste2"]);
            // expect(feObj.element.querySelectorAll(".e-toolbar-item.e-overlay").length).toEqual(3);
        });
        it('for enableToolbarItems', () => {
            feObj.disableToolbarItems(["Upload", "Details", "NewFolder"]);
            // expect(feObj.element.querySelectorAll(".e-toolbar-item.e-overlay").length).toEqual(3);
            feObj.enableToolbarItems(null);
            // expect(feObj.element.querySelectorAll(".e-toolbar-item.e-overlay").length).toEqual(3);
            feObj.enableToolbarItems(["Paste1"]);
            // expect(feObj.element.querySelectorAll(".e-toolbar-item.e-overlay").length).toEqual(3);
            feObj.enableToolbarItems(["Paste2"]);
            // expect(feObj.element.querySelectorAll(".e-toolbar-item.e-overlay").length).toEqual(3);
            feObj.enableToolbarItems(['NewFolder']);
            // expect(feObj.element.querySelectorAll(".e-toolbar-item.e-overlay").length).toEqual(2);
            expect(feObj.element.querySelectorAll(".e-toolbar-item")[0].classList.contains('e-overlay')).toEqual(false);
            feObj.enableToolbarItems(["Upload", "Details"]);
            expect(feObj.element.querySelectorAll(".e-toolbar-item.e-overlay").length).toEqual(0);
            expect(feObj.element.querySelectorAll(".e-toolbar-item")[1].classList.contains('e-overlay')).toEqual(false);
            // expect(feObj.element.querySelectorAll(".e-toolbar-item")[13].classList.contains('e-overlay')).toEqual(false);
        });
        it('for refreshFiles', (done: Function) => {
            setTimeout(function () {
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
                expect(li.length).toEqual(5);
                expect(document.getElementById('file_grid').querySelectorAll('.e-row').length).toEqual(5);
                feObj.refreshFiles();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data1)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    let nli: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
                    expect(nli.length).toEqual(5);
                    expect(document.getElementById('file_grid').querySelectorAll('.e-row').length).toEqual(5);
                    done();
                }, 500);
            }, 500);
        });
        it('for destroy', () => {
            feObj.destroy();
            expect(feObj.element.querySelectorAll('.e-toolbar-item').length).toEqual(0);
            expect(feObj.element.className).toBe('');
            expect(feObj.element.childElementCount).toBe(0);
        });
    });
    describe('methods testing', () => {
        let feObj: FileManager;
        let ele: HTMLElement, fmEle: HTMLElement;
        beforeEach(() => {
            jasmine.Ajax.install();
            ele = createElement('div', { id: 'file_wrap1', styles: "display: none" });
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
        it('for refreshLayout', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
            });
            feObj.appendTo("#file1");
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                (document.getElementById('file_wrap1') as any).style = "display: block";
                expect((<any>document.getElementById("file1").getElementsByClassName('e-layout')[0]).style.height).toBe('0px');
                expect((<any>document.getElementById("file1").getElementsByClassName('e-content')[0]).style.height).toBe('0px');
                feObj.refreshLayout();
                expect((<any>document.getElementById("file1").getElementsByClassName('e-layout')[0]).style.height).not.toBe('0px');
                expect((<any>document.getElementById("file1").getElementsByClassName('e-content')[0]).style.height).not.toBe('0px');
                done();
            }, 400);
        });
    });
});
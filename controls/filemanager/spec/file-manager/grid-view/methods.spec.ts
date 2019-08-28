/**
 * FileManager spec document
 */
import { FileManager } from '../../../src/file-manager/base/file-manager';
import { NavigationPane } from '../../../src/file-manager/layout/navigation-pane';
import { DetailsView } from '../../../src/file-manager/layout/details-view';
import { Toolbar } from '../../../src/file-manager/actions/toolbar';
import { createElement } from '@syncfusion/ej2-base';
import { data1, idData1, filterData } from '../data';
import { ColumnModel } from '@syncfusion/ej2-grids';

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
    describe('methods testing', () => {
        let feObj: FileManager;
        let ele: HTMLElement;
        beforeEach(() => {
            jasmine.Ajax.install();
            ele = createElement('div', { id: 'file1' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            jasmine.Ajax.uninstall();
            if (feObj) feObj.destroy();
            ele.remove();
        });
        it('for getSelectedFiles', (done: Function) => {
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
                feObj.detailsviewModule.gridObj.selectRows([0, 4]);
                expect(feObj.selectedItems).toEqual(jasmine.arrayContaining(["Documents", "1.png"]));
                let data: any = feObj.getSelectedFiles();
                expect(data.length).toBe(2);
                expect(data[0]['name']).toBe('Documents');
                expect(data[1]['name']).toBe('1.png');
                done();
            }, 400);
        });
        it('for getSelectedFiles with id base', (done: Function) => {
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
                responseText: JSON.stringify(idData1)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                feObj.detailsviewModule.gridObj.selectRows([0, 4]);
                expect(feObj.selectedItems).toEqual(jasmine.arrayContaining(["6171", "6175"]));
                let data: any = feObj.getSelectedFiles();
                expect(data.length).toBe(2);
                expect(data[0]['name']).toBe('Documents');
                expect(data[1]['name']).toBe('Videos');
                done();
            }, 400);
        });
    });
    describe('Custom method testing', () => {
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
        it('for filterFiles', (done: Function) => {
            expect(feObj.detailsviewModule.gridObj.getRows().length).toBe(5);
            feObj.filterFiles();
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(filterData)
            });
            setTimeout(function () {
                expect(feObj.detailsviewModule.gridObj.getRows().length).toBe(4);
                let len: number = feObj.detailsviewModule.gridObj.columns.length;
                let columnData: ColumnModel[] = JSON.parse(JSON.stringify(feObj.detailsviewModule.gridObj.columns));
                expect(columnData[len - 1].field).toBe('filterPath');
                (<HTMLElement>document.getElementById('file_tb_view')).click();
                (<HTMLElement>document.getElementById('file_ddl_large')).click();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(filterData)
                }); jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
                setTimeout(function () {
                    expect(document.getElementById('file_largeicons').querySelectorAll('li').length).toBe(4);
                    done();
                }, 400);
            }, 400);
        });
    });
});
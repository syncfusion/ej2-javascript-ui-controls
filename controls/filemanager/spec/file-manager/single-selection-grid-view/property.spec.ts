/**
 * FileManager spec document
 */
import { FileManager } from '../../../src/file-manager/base/file-manager';
import { NavigationPane } from '../../../src/file-manager/layout/navigation-pane';
import { DetailsView } from '../../../src/file-manager/layout/details-view';
import { Toolbar } from '../../../src/file-manager/actions/toolbar';
import { createElement } from '@syncfusion/ej2-base';
import { data1, data16, idData1, idData2, idData3 } from '../data';

FileManager.Inject(Toolbar, NavigationPane, DetailsView);

describe('FileManager control single selection Grid view', () => {
    describe('property testing', () => {
        let feObj: FileManager;
        let ele: HTMLElement;
        let originalTimeout: any;
        beforeEach(() => {
            jasmine.Ajax.install();
            feObj = undefined;
            ele = createElement('div', { id: 'file' });
            document.body.appendChild(ele);
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
        });
        afterEach(() => {
            jasmine.Ajax.uninstall();
            if (feObj) feObj.destroy();
            ele.remove();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        it('for path', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                allowMultiSelection: false,
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                path: '/Employees/'
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data16)
            });
            setTimeout(function () {
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                expect(treeObj.selectedNodes[0]).toEqual("fe_tree_1");
                expect(treeLi.length).toEqual(6);
                expect(gridLi.length).toEqual(1);
                done();
            }, 500);
        });
        it('for path with id', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                allowMultiSelection: false,
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                path: '1/6174/6176'
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(idData1)
            });
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(idData2)
            });
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(idData3)
            });
            setTimeout(function () {
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                let addressLi: any = document.getElementById('file_breadcrumbbar').querySelectorAll('.e-address-list-item');
                expect(treeObj.selectedNodes[0]).toEqual("fe_tree_3_0");
                expect(treeLi.length).toEqual(9);
                expect(gridLi.length).toEqual(6);
                expect(addressLi.length).toEqual(3);
                expect(feObj.path).toBe('1/6174/6176/');
                expect(addressLi[0].getAttribute('data-utext')).toBe('1/');
                expect(addressLi[0].innerText).toBe('Files');
                expect((document.getElementById('file_search') as any).placeholder).toBe('Search Employees');
                done();
            }, 500);
        });
        it('for selectedItems', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                allowMultiSelection: false,
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                selectedItems: ["Documents", "1.png"]
            });
            feObj.appendTo("#file");
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            setTimeout(function () {
                expect(feObj.selectedItems).toEqual(jasmine.arrayContaining(["1.png"]));
                let li: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                expect(li[0].getAttribute('aria-selected')).toEqual(null);
                expect(li[4].getAttribute('aria-selected')).toEqual('true');
                done();
            }, 400);
        });
        it('for selectedItems with id', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                allowMultiSelection: false,
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                selectedItems: ["6171", "6175"]
            });
            feObj.appendTo("#file");
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(idData1)
            });
            setTimeout(function () {
                expect(feObj.selectedItems).toEqual(jasmine.arrayContaining(["6175"]));
                let li: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                expect(li[0].getAttribute('aria-selected')).toEqual(null);
                expect(li[4].getAttribute('aria-selected')).toEqual('true');
                done();
            }, 400);
        });
        it('for showFileExtension and custom template columns', (done) => {
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                allowMultiSelection: false,
                detailsViewSettings: {
                    columns: [
                        {field: 'size', headerText: 'File Size',minWidth: 50},
                        {field: 'name',template: '<div class="e-fe-text">${name}</div>', headerText: 'File Name', minWidth: 120}
                    ]
                },
                showFileExtension: false,
                showItemCheckBoxes:false
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            setTimeout(function () {
                expect(document.getElementById('file_grid').querySelectorAll('.e-row').length).toEqual(5);
                expect(document.getElementById('file_grid').querySelectorAll('.e-row')[4].children[2].textContent).toBe('1');
                feObj.showFileExtension = true;
                feObj.dataBind();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data1)
                });
                setTimeout(function () {
                    expect(document.getElementById('file_grid').querySelectorAll('.e-row').length).toEqual(5);
                    expect(document.getElementById('file_grid').querySelectorAll('.e-row')[4].children[2].textContent).toBe('1.png')
                    done();
                }, 500);
            }, 500);
        });
        it('for showFileExtension and custom columns', (done) => {
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                allowMultiSelection: false,
                detailsViewSettings: {
                    columns: [
                        {field: 'size', headerText: 'File Size',minWidth: 50},
                        {field: 'name', headerText: 'File Name', minWidth: 120}
                    ]
                },
                showFileExtension: false,
                showItemCheckBoxes:false
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            setTimeout(function () {
                expect(document.getElementById('file_grid').querySelectorAll('.e-row').length).toEqual(5);
                expect(document.getElementById('file_grid').querySelectorAll('.e-row')[4].children[2].textContent).toBe('1.png');
                feObj.showFileExtension = true;
                feObj.dataBind();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data1)
                });
                setTimeout(function () {
                    expect(document.getElementById('file_grid').querySelectorAll('.e-row').length).toEqual(5);
                    expect(document.getElementById('file_grid').querySelectorAll('.e-row')[4].children[2].textContent).toBe('1.png')
                    done();
                }, 500);
            }, 500);
        });
        it('for detailsViewSettings', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                allowMultiSelection: false,
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                showItemCheckBoxes:false,
                detailsViewSettings: {
                    columns: [
                        {
                            field: 'name', headerText: 'Name', minWidth: 120, width: 'auto',
                            template: '<span class="e-fe-text">${name}</span>', customAttributes: { class: 'e-fe-grid-name' }
                        },
                        {
                            field: '_fm_modified', headerText: 'DateModified', format: 'MMMM dd, yyyy HH:mm', minWidth: 120, width: '190'
                        },
                        {
                            field: 'isFile', headerText: 'Is File', minWidth: 90, width: '110', headerTextAlign: "Center", allowResizing: false, allowSorting: false
                        },
                        {
                            field: 'size', headerText: 'Size', minWidth: 90, width: '110', template: '<span class="e-fe-size">${size}</span>', format: 'n2'
                        }
                    ]
                }
            });
            feObj.appendTo("#file");
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            setTimeout(function () {
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                expect(treeLi.length).toEqual(5);
                expect(gridLi.length).toEqual(5);
                expect(document.getElementById('file_grid').querySelectorAll('.e-headercell').length).toEqual(5);
                done();
            }, 400);
        });
    });
});
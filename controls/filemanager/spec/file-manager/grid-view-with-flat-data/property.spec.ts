import { FileManager } from '../../../src/file-manager/base/file-manager';
import { NavigationPane } from '../../../src/file-manager/layout/navigation-pane';
import { DetailsView } from '../../../src/file-manager/layout/details-view';
import { Toolbar } from '../../../src/file-manager/actions/toolbar';
import { createElement } from '@syncfusion/ej2-base';
import { BeforePopupOpenCloseEventArgs } from '../../../src/file-manager/base/interface';
import { toolbarItems1, flatData, dataForSanitization1, errorData, uploadedData } from '../data';

FileManager.Inject(Toolbar, NavigationPane, DetailsView);

describe('FileManager control Grid view', () => {
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
        it('for cssClass', () => {
            feObj = new FileManager({
                view: 'Details',
                fileSystemData: flatData,
                showThumbnail: false,
                cssClass: 'custom'
            });
            feObj.appendTo('#file');
            expect(feObj.element.classList.contains('custom')).toEqual(true);
            feObj.destroy();
            expect(feObj.element.classList.contains('custom')).toEqual(false);
            feObj = new FileManager({
                view: 'Details',
                fileSystemData: flatData,
                showThumbnail: false,
                cssClass: null
            });
            feObj.appendTo('#file');
            expect(feObj.element.classList.contains('null')).toEqual(false);
        });
        it('for height', () => {
            feObj = new FileManager({
                view: 'Details',
                fileSystemData: flatData,
                showThumbnail: false,
                height: '500px'
            });
            feObj.appendTo('#file');
            expect(feObj.element.style.height).toEqual('500px');
            feObj.destroy();
            expect(feObj.element.style.height).toEqual('');
            feObj = new FileManager({
                view: 'Details',
                fileSystemData: flatData,
                showThumbnail: false,
                height: 400
            });
            feObj.appendTo('#file');
            expect(feObj.element.style.height).toEqual('400px');
            feObj.destroy();
            expect(feObj.element.style.height).toEqual('');
            feObj = new FileManager({
                view: 'Details',
                fileSystemData: flatData,
                showThumbnail: false,
                height: '100%'
            });
            feObj.appendTo('#file');
            expect(feObj.element.style.height).toEqual('100%');
            feObj.destroy();
            expect(feObj.element.style.height).toEqual('');
            feObj = new FileManager({
                view: 'Details',
                fileSystemData: flatData,
                showThumbnail: false,
                height: 'auto'
            });
            feObj.appendTo('#file');
            expect(feObj.element.style.height).toEqual('auto');
            feObj.destroy();
            expect(feObj.element.style.height).toEqual('');
            feObj = new FileManager({
                view: 'Details',
                fileSystemData: flatData,
                showThumbnail: false,
                height: null
            });
            feObj.appendTo('#file');
            expect(feObj.element.style.height).toEqual('');
            feObj.destroy();
            feObj = new FileManager({
                view: 'Details',
                fileSystemData: flatData,
                enableVirtualization: true,
                showThumbnail: false,
                height: '400px'
            });
            feObj.appendTo('#file');
            expect(feObj.element.style.height).toEqual('400px');
        });
        it('for toolbarSettings', () => {
            feObj = new FileManager({
                view: 'Details',
                fileSystemData: flatData,
                showThumbnail: false,
                toolbarSettings: { visible: false }
            });
            feObj.appendTo('#file');
            expect(document.getElementById('file_toolbar').classList.contains('e-toolbar')).toEqual(false);
            expect(feObj.element.querySelectorAll('.e-toolbar-item').length).toEqual(0);
            feObj.destroy();
            feObj = new FileManager({
                view: 'Details',
                fileSystemData: flatData,
                showThumbnail: false,
                toolbarSettings: { items: toolbarItems1 }
            });
            feObj.appendTo('#file');
            expect(document.getElementById('file_toolbar').classList.contains('e-toolbar')).toEqual(true);
            expect(feObj.element.querySelectorAll('.e-toolbar-item').length).toEqual(toolbarItems1.length);
            expect(feObj.element.querySelectorAll('.e-toolbar-item').length).toEqual(13);
            // method testing
            feObj.disableToolbarItems(["NewFolder1"]);
            expect(feObj.element.querySelectorAll(".e-toolbar-item.e-overlay").length).toEqual(1);
            expect(feObj.element.querySelectorAll(".e-toolbar-item")[0].classList.contains('e-overlay')).toEqual(true);
            feObj.enableToolbarItems(["NewFolder1"]);
            expect(feObj.element.querySelectorAll(".e-toolbar-item.e-overlay").length).toEqual(0);
            expect(feObj.element.querySelectorAll(".e-toolbar-item")[0].classList.contains('e-overlay')).toEqual(false);
        });
        it('for width', () => {
            feObj = new FileManager({
                view: 'Details',
                fileSystemData: flatData,
                showThumbnail: false,
                width: '500px'
            });
            feObj.appendTo('#file');
            expect(feObj.element.style.width).toEqual('500px');
            expect((feObj.element.querySelector('.e-toolbar') as HTMLElement).offsetWidth).toBeLessThanOrEqual(feObj.element.offsetWidth);
            feObj.destroy();
            expect(feObj.element.style.width).toEqual('');
            feObj = new FileManager({
                view: 'Details',
                fileSystemData: flatData,
                showThumbnail: false,
                width: 400
            });
            feObj.appendTo('#file');
            expect(feObj.element.style.width).toEqual('400px');
            feObj.destroy();
            expect(feObj.element.style.width).toEqual('');
            feObj = new FileManager({
                view: 'Details',
                fileSystemData: flatData,
                showThumbnail: false,
                width: '100%'
            });
            feObj.appendTo('#file');
            expect(feObj.element.style.width).toEqual('100%');
            feObj.destroy();
            expect(feObj.element.style.width).toEqual('');
            feObj = new FileManager({
                view: 'Details',
                fileSystemData: flatData,
                showThumbnail: false,
                width: 'auto'
            });
            feObj.appendTo('#file');
            expect(feObj.element.style.width).toEqual('auto');
            feObj.destroy();
            expect(feObj.element.style.width).toEqual('');
            feObj = new FileManager({
                view: 'Details',
                fileSystemData: flatData,
                showThumbnail: false,
                width: null
            });
            feObj.appendTo('#file');
            expect(feObj.element.style.width).toEqual('');
        });
        it('for rootAliasName', () => {
            feObj = new FileManager({
                view: 'Details',
                fileSystemData: flatData,
                rootAliasName: "My Drive"
            });
            feObj.appendTo('#file');
            expect((<HTMLElement>document.querySelector("#file_tree  .e-text-content .e-list-text")).innerText).toEqual('My Drive');
            feObj.destroy();

        });
        it('for enableRtl', () => {
            feObj = new FileManager({
                view: 'Details',
                fileSystemData: flatData,
                enableRtl: true
            });
            feObj.appendTo('#file');
            expect(feObj.element.classList.contains('e-rtl')).toEqual(true);
            expect(feObj.element.querySelector('.e-treeview').classList.contains('e-rtl')).toEqual(true);
            expect(feObj.element.querySelector('.e-toolbar').classList.contains('e-rtl')).toEqual(true);
            expect(feObj.element.querySelector('.e-grid').classList.contains('e-rtl')).toEqual(true);
            expect(feObj.contextmenuModule.contextMenu.element.parentElement.classList.contains('e-rtl')).toEqual(true);
            feObj.destroy();
            expect(feObj.element.classList.contains('e-rtl')).toEqual(false);
        });
        it('for enableRtl', () => {
            feObj = new FileManager({
                view: 'Details',
                fileSystemData: flatData,
                enableRtl: false
            });
            feObj.appendTo('#file');
            expect(feObj.element.classList.contains('e-rtl')).toEqual(false);
            expect(feObj.element.querySelector('.e-treeview').classList.contains('e-rtl')).toEqual(false);
            expect(feObj.element.querySelector('.e-toolbar').classList.contains('e-rtl')).toEqual(false);
            expect(feObj.element.querySelector('.e-grid').classList.contains('e-rtl')).toEqual(false);
            expect(feObj.contextmenuModule.contextMenu.element.parentElement.classList.contains('e-rtl')).toEqual(false);
            feObj.destroy();
            expect(feObj.element.classList.contains('e-rtl')).toEqual(false);
        });
        it('for sanitization', (done) => {
            feObj = new FileManager({
                view: 'Details',
                fileSystemData: dataForSanitization1,
                enableHtmlSanitizer: true
            });
            feObj.appendTo('#file');
            setTimeout(function () {
                let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                let fileName: any = gridLi[0].querySelector('.e-fe-text');
                expect(fileName.innerHTML).toBe(`'&gt;<img src="x">'txt`);
                done();
            }, 500);
        });
        it('for showFileExtension', (done) => {
            feObj = new FileManager({
                view: 'Details',
                fileSystemData: flatData,
                showFileExtension: false
            });
            feObj.appendTo('#file');
            setTimeout(function () {
                expect(document.getElementById('file_grid').querySelectorAll('.e-row').length).toEqual(6);
                expect(document.getElementById('file_grid').querySelectorAll('.e-row')[3].children[2].textContent).toBe('Adam');
                feObj.showFileExtension = true;
                feObj.dataBind();
                setTimeout(function () {
                    expect(document.getElementById('file_grid').querySelectorAll('.e-row').length).toEqual(6);
                    expect(document.getElementById('file_grid').querySelectorAll('.e-row')[3].children[2].textContent).toBe('Adam.png')
                    done();
                }, 500);
            }, 500);
        });
        it('for showFileExtension and custom template columns', (done) => {
            feObj = new FileManager({
                view: 'Details',
                fileSystemData: flatData,
                detailsViewSettings: {
                    columns: [
                        { field: 'size', headerText: 'File Size', minWidth: 50 },
                        { field: 'name', template: '<div class="e-fe-text">${name}</div>', headerText: 'File Name', minWidth: 120 }
                    ]
                },
                showFileExtension: false
            });
            feObj.appendTo('#file');
            setTimeout(function () {
                expect(document.getElementById('file_grid').querySelectorAll('.e-row').length).toEqual(6);
                expect(document.getElementById('file_grid').querySelectorAll('.e-row')[3].children[3].textContent).toBe('Adam');
                feObj.showFileExtension = true;
                feObj.dataBind();
                setTimeout(function () {
                    expect(document.getElementById('file_grid').querySelectorAll('.e-row').length).toEqual(6);
                    expect(document.getElementById('file_grid').querySelectorAll('.e-row')[3].children[3].textContent).toBe('Adam.png')
                    done();
                }, 500);
            }, 500);
        });
        it('for showFileExtension and custom columns', (done) => {
            feObj = new FileManager({
                view: 'Details',
                fileSystemData: flatData,
                detailsViewSettings: {
                    columns: [
                        { field: 'size', headerText: 'File Size', minWidth: 50 },
                        { field: 'name', headerText: 'File Name', minWidth: 120 }
                    ]
                },
                showFileExtension: false
            });
            feObj.appendTo('#file');
            setTimeout(function () {
                expect(document.getElementById('file_grid').querySelectorAll('.e-row').length).toEqual(6);
                expect(document.getElementById('file_grid').querySelectorAll('.e-row')[3].children[3].textContent).toBe('Adam');
                feObj.showFileExtension = true;
                feObj.dataBind();
                setTimeout(function () {
                    expect(document.getElementById('file_grid').querySelectorAll('.e-row').length).toEqual(6);
                    expect(document.getElementById('file_grid').querySelectorAll('.e-row')[3].children[3].textContent).toBe('Adam.png')
                    done();
                }, 500);
            }, 500);
        });
        it('for path with id', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                fileSystemData: flatData,
                path: '0/1/7/'
            });
            feObj.appendTo('#file');
            setTimeout(function () {
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                let addressLi: any = document.getElementById('file_breadcrumbbar').querySelectorAll('.e-address-list-item');
                expect(treeObj.selectedNodes[0]).toEqual("fe_tree_0_0");
                expect(treeLi.length).toEqual(5);
                expect(gridLi.length).toEqual(0);
                expect(addressLi.length).toEqual(3);
                expect(feObj.path).toBe('/1/7/');
                expect(addressLi[0].getAttribute('data-utext')).toBe('/');
                expect(addressLi[0].innerText).toBe('My Drive');
                expect((document.getElementById('file_search') as any).placeholder).toBe('Search New folder');
                done();
            }, 500);
        });
        it('for selectedItems with id', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                fileSystemData: flatData,
                showThumbnail: false,
                selectedItems: ["1", "6"] // Convert numbers to strings
            });
            feObj.appendTo("#file");
            setTimeout(function () {
                expect(feObj.selectedItems).toEqual(jasmine.arrayContaining(["1", "6"])); // Pass array of strings
                let li: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                expect(li[1].getAttribute('aria-selected')).toEqual('true');
                expect(li[3].getAttribute('aria-selected')).toEqual('true');
                done();
            }, 400);
        });
        it('for detailsViewSettings', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                fileSystemData: flatData,
                showThumbnail: false,
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
            setTimeout(function () {
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                expect(treeObj.selectedNodes[0]).toEqual("fe_tree");
                expect(treeLi.length).toEqual(4);
                expect(gridLi.length).toEqual(6);
                expect(document.getElementById('file_grid').querySelectorAll('.e-headercell').length).toEqual(6);
                done();
            }, 400);
        });
        it('for detailsviewsettings name column width', (done) => {
            feObj = new FileManager({
                view: 'Details',
                fileSystemData: flatData,
                showThumbnail: false,
                width: '700px',
                navigationPaneSettings: { visible: false },
                detailsViewSettings: {
                    columns: [
                        { field: 'name', headerText: 'File Name', minWidth: 120, customAttributes: { class: 'e-fe-grid-name' }, template: '${name}' },
                        { field: 'size', headerText: 'File Size', minWidth: 50, template: '${size}' }
                    ]
                },
                searchSettings: { allowSearchOnTyping: false }
            });
            feObj.appendTo('#file');
            setTimeout(function () {
                expect(feObj.element.style.width).toEqual('700px');
                expect((feObj.element.querySelectorAll('th.e-fe-grid-name')[0] as HTMLElement).offsetWidth).toBeGreaterThan(150);
                feObj.detailsViewSettings = {
                    columns: [
                        { field: 'name', headerText: 'File Name', minWidth: 120, width: 150, customAttributes: { class: 'e-fe-grid-name' }, template: '${name}' },
                        { field: 'size', headerText: 'File Size', minWidth: 50, template: '${size}' }
                    ]
                };
                feObj.dataBind();
                expect(feObj.element.style.width).toEqual('700px');
                expect((feObj.element.querySelectorAll('th.e-fe-grid-name')[0] as HTMLElement).offsetWidth).toEqual(150);
                (feObj as any).resizeHandler();
                expect((feObj.element.querySelectorAll('th.e-fe-grid-name')[0] as HTMLElement).offsetWidth).toEqual(150);
                let searchEle: any = feObj.element.querySelector("#file_search");
                let searchObj: any = searchEle.ej2_instances[0];
                searchEle.value = '.png';
                searchObj.value = '.png';
                let eventArgs: any = { value: '.png', container: searchEle };
                searchObj.change(eventArgs);
                setTimeout(function () {
                    expect((feObj.element.querySelectorAll('th.e-fe-grid-name')[0] as HTMLElement).offsetWidth).toEqual(150);
                    (feObj as any).resizeHandler();
                    expect((feObj.element.querySelectorAll('th.e-fe-grid-name')[0] as HTMLElement).offsetWidth).toEqual(150);
                    feObj.detailsViewSettings = {
                        columns: [
                            { field: 'name', headerText: 'File Name', minWidth: 120, customAttributes: { class: 'e-fe-grid-name' }, template: '${name}' },
                            { field: 'size', headerText: 'File Size', minWidth: 50, template: '${size}' }
                        ]
                    };
                    feObj.dataBind();
                    expect(feObj.element.style.width).toEqual('700px');
                    expect((feObj.element.querySelectorAll('th.e-fe-grid-name')[0] as HTMLElement).offsetWidth).toBeGreaterThan(150);
                    done();
                }, 400);
            }, 400);
        });

        it('for detailsviewsettings name column width initial', (done) => {
            feObj = new FileManager({
                view: 'Details',
                fileSystemData: flatData,
                showThumbnail: false,
                width: '700px',
                navigationPaneSettings: { visible: false },
                detailsViewSettings: {
                    columns: [
                        { field: 'name', headerText: 'File Name', minWidth: 120, width: 150, customAttributes: { class: 'e-fe-grid-name' }, template: '${name}' },
                        { field: 'size', headerText: 'File Size', minWidth: 50, template: '${size}' }
                    ]
                },
                searchSettings: { allowSearchOnTyping: false }
            });
            feObj.appendTo('#file');
            setTimeout(function () {
                expect(feObj.element.style.width).toEqual('700px');
                expect((feObj.element.querySelectorAll('th.e-fe-grid-name')[0] as HTMLElement).offsetWidth).toEqual(150);
                (feObj as any).resizeHandler();
                expect((feObj.element.querySelectorAll('th.e-fe-grid-name')[0] as HTMLElement).offsetWidth).toEqual(150);
                let searchEle: any = feObj.element.querySelector("#file_search");
                let searchObj: any = searchEle.ej2_instances[0];
                searchEle.value = '.png';
                searchObj.value = '.png';
                let eventArgs: any = { value: '.png', container: searchEle };
                searchObj.change(eventArgs);
                setTimeout(function () {
                    expect((feObj.element.querySelectorAll('th.e-fe-grid-name')[0] as HTMLElement).offsetWidth).toEqual(150);
                    (feObj as any).resizeHandler();
                    expect((feObj.element.querySelectorAll('th.e-fe-grid-name')[0] as HTMLElement).offsetWidth).toEqual(150);
                    done();
                }, 400);
            }, 400);
        });

        it('for sorting - Default value', (done) => {
            feObj = new FileManager({
                view: 'Details',
                fileSystemData: flatData,
                sortOrder: 'Ascending'
            });
            feObj.appendTo('#file');
            setTimeout(function () {
                let items: any = document.getElementById('file_tb_sortby');
                items.click();
                expect(document.getElementById('file_ddl_ascending').children[0].classList.contains('e-fe-tick')).toBe(true);
                expect(document.getElementById('file_grid').querySelectorAll('.e-row').length).toEqual(6);
                expect(document.getElementById('file_grid').querySelectorAll('.e-row')[0].children[2].textContent).toBe('Base');
                expect(document.getElementById('file_grid').querySelectorAll('.e-row')[1].children[2].textContent).toBe('Documents');
                done();
            }, 400);
        });

        it('for sorting - Descending value', (done) => {
            feObj = new FileManager({
                view: 'Details',
                fileSystemData: flatData,
                sortOrder: 'Descending'
            });
            feObj.appendTo('#file');
            setTimeout(function () {
                let items: any = document.getElementById('file_tb_sortby');
                items.click();
                expect(document.getElementById('file_ddl_descending').children[0].classList.contains('e-fe-tick')).toBe(true);
                expect(document.getElementById('file_grid').querySelectorAll('.e-row').length).toEqual(6);
                expect(document.getElementById('file_grid').querySelectorAll('.e-row')[0].children[2].textContent).toBe('Downloads');
                expect(document.getElementById('file_grid').querySelectorAll('.e-row')[2].children[2].textContent).toBe('Base');
                done();
            }, 400);
        });
        it('for sorting - None value', (done) => {
            feObj = new FileManager({
                view: 'Details',
                fileSystemData: flatData,
                sortOrder: 'None'
            });
            feObj.appendTo('#file');
            setTimeout(function () {
                let items: any = document.getElementById('file_tb_sortby');
                items.click();
                expect(document.getElementById('file_ddl_none').children[0].classList.contains('e-fe-tick')).toBe(true);
                expect(document.getElementById('file_grid').querySelectorAll('.e-row').length).toEqual(6);
                expect(document.getElementById('file_grid').querySelectorAll('.e-row')[0].children[2].textContent).toBe('Documents');
                expect(document.getElementById('file_grid').querySelectorAll('.e-row')[1].children[2].textContent).toBe('Downloads');
                done();
            }, 400);
        });
    });

    describe('popupTarget property testing', () => {
        let mouseEventArgs: any;
        let feObj: FileManager;
        let ele: HTMLElement;
        let j: number = 0;
        let target: any;
        let name: string = null;
        let dblclickevent: any;
        let originalTimeout: any;
        beforeEach((done) => {
            j = 0; name = null;
            jasmine.Ajax.install();
            ele = createElement('div', { id: 'file' });
            document.body.appendChild(ele);
            feObj = new FileManager({
                view: 'Details',
                fileSystemData: flatData,
                showThumbnail: false,
                popupTarget: 'BODY',
                beforePopupOpen: (args: BeforePopupOpenCloseEventArgs) => {
                    expect(args.popupName).toBe(name);
                    target = args.popupModule.target;
                    j++;
                },
            });
            feObj.appendTo('#file');
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
            dblclickevent = new MouseEvent('dblclick', {
                'view': window,
                'bubbles': true,
                'cancelable': true
            });
            setTimeout(function () {
                let menuObj: any = (document.getElementById(feObj.element.id + '_contextmenu') as any).ej2_instances[0];
                menuObj.animationSettings = { effect: 'None' };
                menuObj.dataBind();
                done();
            }, 500);
        });
        afterEach(() => {
            jasmine.Ajax.uninstall();
            if (feObj) feObj.destroy();
            ele.remove();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });

        it('for BeforeOpen cancel testing', () => {
            name = 'Create Folder';
            feObj.beforePopupOpen = (args: BeforePopupOpenCloseEventArgs) => { args.cancel = true; j++; target = args.popupModule.target; }
            let item: any = document.getElementById('file_tb_newfolder');
            item.click();
            expect(j).toBe(1);
            expect(target).toBe('BODY');
            expect(target).not.toBe('#' + feObj.element.id);
        });

        it('for create folder', () => {
            name = 'Create Folder';
            let item: any = document.getElementById('file_tb_newfolder');
            item.click();
            item = document.getElementById('file_dialog').querySelector('.e-dlg-closeicon-btn');
            item.click();
            expect(j).toBe(1);
            expect(target).toBe('BODY');
            expect(target).not.toBe('#' + feObj.element.id);
        });

        it('for Rename', () => {
            feObj.selectedItems = ['Food']
            name = 'Rename';
            let item: any = document.getElementById('file_tb_rename');
            item.click();
            item = document.getElementById('file_dialog').querySelector('.e-dlg-closeicon-btn');
            item.click();
            expect(j).toBe(1);
            expect(target).toBe('BODY');
            expect(target).not.toBe('#' + feObj.element.id);
        });

        it('for Delete', () => {
            feObj.selectedItems = ['Food']
            name = 'Delete';
            let item: any = document.getElementById('file_tb_delete');
            item.click();
            item = document.getElementById('file_dialog').querySelector('.e-dlg-closeicon-btn');
            item.click();
            expect(j).toBe(1);
            expect(target).toBe('BODY');
            expect(target).not.toBe('#' + feObj.element.id);
        });

        it('for upload and for Upload retry', (done) => {
            name = 'Upload';
            expect((<any>feObj.detailsviewModule.gridObj.contentModule).rows.length).toBe(6);
            let fileObj: File = new File(["Nice One"], "sample.txt", { lastModified: 0, type: "overide/mimetype" })
            let eventArgs: any = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
            let uploadObj: any = document.querySelector('#' + feObj.element.id + '_upload');
            uploadObj.ej2_instances[0].onSelectFiles(eventArgs);
            expect(target).toBe('BODY');
            expect(target).not.toBe('#' + feObj.element.id);
            feObj.fileSystemData = uploadedData;
            feObj.refresh();
            setTimeout(function () {
                name = 'Upload';
                (<HTMLElement>document.querySelector('.e-dlg-closeicon-btn')).click();
                expect((<any>feObj.detailsviewModule.gridObj.contentModule).rows.length).toBe(7);
                expect(j).toBe(1);
                expect(target).toBe('BODY');
                expect(target).not.toBe('#' + feObj.element.id);
                done();
            }, 500);
        });

        it('for Duplicate Items testing', (done) => {
            name = 'Duplicate Items';
            feObj.detailsviewModule.gridObj.selectRows([0, 4, 1]);
            (<HTMLElement>document.getElementsByClassName('e-fe-cut')[0]).click();
            expect(feObj.detailsviewModule.gridObj.element.querySelectorAll('.e-row')[0].classList.contains('e-blur')).toBe(true);
            expect(feObj.detailsviewModule.gridObj.element.querySelectorAll('.e-row')[4].classList.contains('e-blur')).toBe(true);
            expect(feObj.detailsviewModule.gridObj.element.querySelectorAll('.e-row')[1].classList.contains('e-blur')).toBe(true);
            feObj.detailsviewModule.gridObj.element.querySelectorAll('.e-row')[2].firstElementChild.dispatchEvent(dblclickevent);
            setTimeout(function () {
                expect(feObj.detailsviewModule.gridObj.getRows().length).toBe(0);
                (<HTMLElement>document.getElementsByClassName('e-fe-paste')[0]).click();
                setTimeout(function () {
                    expect(feObj.detailsviewModule.gridObj.getRows().length).toBe(3);
                    expect(j).toBe(0);
                    done();
                }, 500);
            }, 500);
        });

        it('for details', (done: Function) => {
            name = 'File Details';
            feObj.detailsviewModule.gridObj.selectRows([0]);
            let items: any = document.getElementById('file_tb_details');
            items.click();
            expect(target).toBe('BODY');
            expect(target).not.toBe('#' + feObj.element.id);
            setTimeout(function () {
                expect(document.getElementById('file_dialog_title').textContent).toBe('Downloads');
                expect((<any>document.querySelectorAll('.e-fe-value')[0]).textContent).toBe('Folder');
                let item: any = document.getElementById('file_dialog').querySelector('.e-dlg-closeicon-btn');
                item.click();
                expect(target).toBe('BODY');
                expect(target).not.toBe('#' + feObj.element.id);
                expect(j).toBe(1);
                done();
            }, 500);
        });

        it('for Multiple details', (done: Function) => {
            name = 'File Details';
            feObj.detailsviewModule.gridObj.selectRows([1, 2]);
            let items: any = document.getElementById('file_tb_details');
            items.click();
            setTimeout(function () {
                expect(document.getElementById('file_dialog_title').textContent).toBe('Adam.png, textDocument.doc');
                expect((<any>document.querySelectorAll('.e-fe-value')[0]).textContent).toBe('Multiple Types');
                let item: any = document.getElementById('file_dialog').querySelector('.e-dlg-closeicon-btn');
                item.click();
                expect(j).toBe(1);
                expect(target).toBe('BODY');
                expect(target).not.toBe('#' + feObj.element.id);
                done();
            }, 500);
        });

        it('for image', (done: Function) => {
            name = 'Image Preview';
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            feObj.detailsviewModule.gridObj.selectRows([1]);
            let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(1).getElementsByTagName('td')[2];
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            sourceElement.element.querySelectorAll('li')[0].click();
            expect(feObj.viewerObj.visible).toBe(true);
            feObj.viewerObj.hide();
            expect(j).toBe(1);
            expect(target).toBe('BODY');
            expect(target).not.toBe('#' + feObj.element.id);
            done();
        });

        it('for Extension', () => {
            name = 'Rename'
            feObj.detailsviewModule.gridObj.selectRows([1]);
            let items: any = document.getElementsByClassName('e-fe-rename');
            items[0].click();
            let ntr: any = document.getElementById('file_grid').querySelectorAll('.e-rowcell.e-rowcell.e-fe-grid-name');
            expect(ntr.length).toEqual(3);
            expect(ntr[1].textContent).toBe("Adam.png");
            (<HTMLInputElement>document.getElementById('rename')).value = "Adam.pnga";
            name = 'Extension Change';
            (<HTMLElement>document.getElementById('file_dialog').querySelectorAll('.e-btn')[1]).click();
            let item: any = document.getElementById('file_extn_dialog').querySelector('.e-dlg-closeicon-btn');
            item.click();
            name = 'Rename'
            item = document.getElementById('file_dialog').querySelector('.e-dlg-closeicon-btn');
            item.click();
            expect(j).toBe(2);
            expect(target).toBe('BODY');
            expect(target).not.toBe('#' + feObj.element.id);
        });

        it('for Error', (done) => {
            feObj.fileSystemData = errorData;
            name = 'Error';
            let item: any = document.getElementById('file_tb_refresh');
            item.click();
            setTimeout(function () {
                item = document.getElementById('file_dialog').querySelector('.e-dlg-closeicon-btn');
                item.click();
                expect(j).toBe(1);
                expect(target).toBe('BODY');
                expect(target).not.toBe('#' + feObj.element.id);
                done();
            }, 500);
        });

        it('for continous multiple dialogs', (done) => {
            feObj.fileSystemData = errorData;
            name = 'Error';
            let item: any = document.getElementById('file_tb_refresh');
            item.click();
            setTimeout(function () {
                item = document.getElementById('file_dialog').querySelector('.e-dlg-closeicon-btn');
                item.click();
                expect(j).toBe(1);
                expect(target).toBe('BODY');
                expect(target).not.toBe('#' + feObj.element.id);
                name = 'Create Folder';
                item = document.getElementById('file_tb_newfolder');
                item.click();
                item = document.getElementById('file_dialog').querySelector('.e-dlg-closeicon-btn');
                item.click();
                expect(j).toBe(2);
                expect(target).toBe('BODY');
                expect(target).not.toBe('#' + feObj.element.id);
                feObj.selectedItems = ['Food']
                name = 'Rename';
                item = document.getElementById('file_tb_rename');
                item.click();
                item = document.getElementById('file_dialog').querySelector('.e-dlg-closeicon-btn');
                item.click();
                expect(j).toBe(3);
                expect(target).toBe('BODY');
                expect(target).not.toBe('#' + feObj.element.id);
                feObj.selectedItems = ['Food']
                name = 'Delete';
                item = document.getElementById('file_tb_delete');
                item.click();
                item = document.getElementById('file_dialog').querySelector('.e-dlg-closeicon-btn');
                item.click();
                expect(j).toBe(4);
                expect(target).toBe('BODY');
                expect(target).not.toBe('#' + feObj.element.id);
                name = 'Rename'
                feObj.detailsviewModule.gridObj.selectRows([4]);
                let items: any = document.getElementsByClassName('e-fe-rename');
                items[0].click();
                let ntr: any = document.getElementById('file_grid').querySelectorAll('.e-rowcell.e-rowcell.e-fe-grid-name');
                expect(ntr.length).toEqual(3);
                expect(ntr[1].textContent).toBe("Adam.png");
                (<HTMLInputElement>document.getElementById('rename')).value = "Adam.pnga";
                name = 'Extension Change';
                item = document.getElementById('file_dialog').querySelector('.e-dlg-closeicon-btn');
                item.click();
                expect(j).toBe(5);
                expect(target).toBe('BODY');
                expect(target).not.toBe('#' + feObj.element.id);
                done();
            }, 500);
        });
    });
});

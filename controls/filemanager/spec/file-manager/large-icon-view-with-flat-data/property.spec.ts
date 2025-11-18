import { FileManager } from '../../../src/file-manager/base/file-manager';
import { NavigationPane } from '../../../src/file-manager/layout/navigation-pane';
import { DetailsView } from '../../../src/file-manager/layout/details-view';
import { Toolbar } from '../../../src/file-manager/actions/toolbar';
import { createElement } from '@syncfusion/ej2-base';
import { BeforePopupOpenCloseEventArgs } from '../../../src/file-manager/base/interface';
import { toolbarItems1, dataForSanitization1, errorData, uploadedData } from '../data';

FileManager.Inject(Toolbar, NavigationPane, DetailsView);

describe('FileManager control large icon view', () => {
    let flatData: any = [
        {
            dateCreated: "2023-11-15T19:02:02.3419426+05:30",
            dateModified: "2024-01-08T18:16:38.4384894+05:30",
            filterPath: "",
            hasChild: true,
            id: '0',
            isFile: false,
            name: "Files",
            parentId: null,
            size: 0,
            type: "",
        }, {
            dateCreated: "2023-11-15T19:02:02.3419426+05:30",
            dateModified: "2024-01-08T16:55:20.9464164+05:30",
            filterPath: "\\",
            hasChild: true,
            id: '1',
            isFile: false,
            name: "Documents",
            parentId: '0',
            size: 0,
            type: "",
        }, {
            dateCreated: "2023-11-15T19:02:02.3419426+05:30",
            dateModified: "2024-01-08T16:55:20.9464164+05:30",
            filterPath: "\\Documents\\",
            hasChild: false,
            id: '7',
            isFile: false,
            name: "NewFolder",
            parentId: '1',
            size: 0,
            type: "",
        }, {
            dateCreated: "2023-11-15T19:02:02.3419426+05:30",
            dateModified: "2024-01-08T16:55:20.9464164+05:30",
            filterPath: "\\",
            hasChild: false,
            id: '2',
            isFile: false,
            name: "Downloads",
            parentId: '0',
            size: 0,
            type: "",
        },
        {
            dateCreated: "2023-11-15T19:02:02.3419426+05:30",
            dateModified: "2024-01-08T16:55:20.9464164+05:30",
            filterPath: "\\",
            hasChild: false,
            id: '3',
            isFile: false,
            name: "Base",
            parentId: '0',
            size: 0,
            type: "",
        },
        {
            dateCreated: "2023-11-15T19:02:02.3419426+05:30",
            dateModified: "2024-01-08T16:55:20.9464164+05:30",
            filterPath: "\\",
            hasChild: false,
            id: '4',
            isFile: true,
            name: "newfile.txt",
            parentId: '0',
            size: 0,
            type: ".txt",
        },
        {
            dateCreated: "2023-11-15T19:02:02.3419426+05:30",
            dateModified: "2024-01-08T16:55:20.9464164+05:30",
            filterPath: "\\",
            hasChild: false,
            id: '5',
            isFile: true,
            name: "textDocument.doc",
            parentId: '0',
            size: 0,
            type: ".doc",
            showHiddenItems: false
        },
        {
            dateCreated: "2023-11-15T19:02:02.3419426+05:30",
            dateModified: "2024-01-08T16:55:20.9464164+05:30",
            filterPath: "\\",
            hasChild: false,
            id: '6',
            isFile: true,
            name: "Adam.png",
            parentId: '0',
            size: 0,
            type: ".png",
            imgUrl: "https://ej2.syncfusion.com/demos/src/treeview/images/employees/7.png"
        }
    ];
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
                fileSystemData: flatData,
                showThumbnail: false,
                cssClass: 'custom'
            });
            feObj.appendTo('#file');
            expect(feObj.element.classList.contains('custom')).toEqual(true);
            feObj.destroy();
            expect(feObj.element.classList.contains('custom')).toEqual(false);
            feObj = new FileManager({
                fileSystemData: flatData,
                showThumbnail: false,
                cssClass: null
            });
            feObj.appendTo('#file');
            expect(feObj.element.classList.contains('null')).toEqual(false);
        });
        it('for height', () => {
            feObj = new FileManager({
                fileSystemData: flatData,
                showThumbnail: false,
                height: '500px'
            });
            feObj.appendTo('#file');
            expect(feObj.element.style.height).toEqual('500px');
            feObj.destroy();
            expect(feObj.element.style.height).toEqual('');
            feObj = new FileManager({
                fileSystemData: flatData,
                showThumbnail: false,
                height: 400
            });
            feObj.appendTo('#file');
            expect(feObj.element.style.height).toEqual('400px');
            feObj.destroy();
            expect(feObj.element.style.height).toEqual('');
            feObj = new FileManager({
                fileSystemData: flatData,
                showThumbnail: false,
                height: '100%'
            });
            feObj.appendTo('#file');
            expect(feObj.element.style.height).toEqual('100%');
            feObj.destroy();
            expect(feObj.element.style.height).toEqual('');
            feObj = new FileManager({
                fileSystemData: flatData,
                showThumbnail: false,
                height: 'auto'
            });
            feObj.appendTo('#file');
            expect(feObj.element.style.height).toEqual('auto');
            feObj.destroy();
            expect(feObj.element.style.height).toEqual('');
            feObj = new FileManager({
                fileSystemData: flatData,
                showThumbnail: false,
                height: null
            });
            feObj.appendTo('#file');
            expect(feObj.element.style.height).toEqual('');
            feObj.destroy();
        });
        it('for toolbarSettings', () => {
            feObj = new FileManager({
                fileSystemData: flatData,
                showThumbnail: false,
                toolbarSettings: { visible: false }
            });
            feObj.appendTo('#file');
            expect(document.getElementById('file_toolbar').classList.contains('e-toolbar')).toEqual(false);
            expect(feObj.element.querySelectorAll('.e-toolbar-item').length).toEqual(0);
            feObj.destroy();
            feObj = new FileManager({
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
                fileSystemData: flatData,
                showThumbnail: false,
                width: 400
            });
            feObj.appendTo('#file');
            expect(feObj.element.style.width).toEqual('400px');
            feObj.destroy();
            expect(feObj.element.style.width).toEqual('');
            feObj = new FileManager({
                fileSystemData: flatData,
                showThumbnail: false,
                width: '100%'
            });
            feObj.appendTo('#file');
            expect(feObj.element.style.width).toEqual('100%');
            feObj.destroy();
            expect(feObj.element.style.width).toEqual('');
            feObj = new FileManager({
                fileSystemData: flatData,
                showThumbnail: false,
                width: 'auto'
            });
            feObj.appendTo('#file');
            expect(feObj.element.style.width).toEqual('auto');
            feObj.destroy();
            expect(feObj.element.style.width).toEqual('');
            feObj = new FileManager({
                fileSystemData: flatData,
                showThumbnail: false,
                width: null
            });
            feObj.appendTo('#file');
            expect(feObj.element.style.width).toEqual('');
        });
        it('for rootAliasName', () => {
            feObj = new FileManager({
                fileSystemData: flatData,
                rootAliasName: "My Drive"
            });
            feObj.appendTo('#file');
            expect((<HTMLElement>document.querySelector("#file_tree  .e-text-content .e-list-text")).innerText).toEqual('My Drive');
            feObj.destroy();

        });
        it('for enableRtl', () => {
            feObj = new FileManager({
                fileSystemData: flatData,
                enableRtl: true
            });
            feObj.appendTo('#file');
            expect(feObj.element.classList.contains('e-rtl')).toEqual(true);
            expect(feObj.element.querySelector('.e-treeview').classList.contains('e-rtl')).toEqual(true);
            expect(feObj.element.querySelector('.e-toolbar').classList.contains('e-rtl')).toEqual(true);
            expect(feObj.contextmenuModule.contextMenu.element.parentElement.classList.contains('e-rtl')).toEqual(true);
            feObj.destroy();
            expect(feObj.element.classList.contains('e-rtl')).toEqual(false);
        });
        it('for enableRtl', () => {
            feObj = new FileManager({
                fileSystemData: flatData,
                enableRtl: false
            });
            feObj.appendTo('#file');
            expect(feObj.element.classList.contains('e-rtl')).toEqual(false);
            expect(feObj.element.querySelector('.e-treeview').classList.contains('e-rtl')).toEqual(false);
            expect(feObj.element.querySelector('.e-toolbar').classList.contains('e-rtl')).toEqual(false);
            expect(feObj.contextmenuModule.contextMenu.element.parentElement.classList.contains('e-rtl')).toEqual(false);
            feObj.destroy();
            expect(feObj.element.classList.contains('e-rtl')).toEqual(false);
        });
        it('for sanitization', (done) => {
            feObj = new FileManager({
                fileSystemData: dataForSanitization1,
                enableHtmlSanitizer: true
            });
            feObj.appendTo('#file');
            setTimeout(function () {
                let largeLi: any = document.getElementsByClassName('e-large-icons')[0].querySelectorAll('.e-large-icon');
                let fileName: any = largeLi[0].querySelector('.e-list-text');
                done();
            }, 500);
        });
        it('for showFileExtension', (done) => {
            feObj = new FileManager({
                fileSystemData: flatData,
                showFileExtension: false
            });
            feObj.appendTo('#file');
            setTimeout(function () {
                expect(document.getElementsByClassName('e-large-icons')[0].querySelectorAll('.e-large-icon').length).toEqual(6);
                expect(document.getElementsByClassName('e-large-icons')[0].querySelectorAll('.e-large-icon')[3].children[0].textContent).toBe('Adam');
                feObj.showFileExtension = true;
                feObj.dataBind();
                setTimeout(function () {
                    expect(document.getElementsByClassName('e-large-icons')[0].querySelectorAll('.e-large-icon').length).toEqual(6);
                    expect(document.getElementsByClassName('e-large-icons')[0].querySelectorAll('.e-large-icon')[3].children[0].textContent).toBe('Adam.png');
                    done();
                }, 500);
            }, 500);
        });
        it('for path with id', (done: Function) => {
            feObj = new FileManager({
                fileSystemData: flatData,
                path: '0/1/7/'
            });
            feObj.appendTo('#file');
            setTimeout(function () {
                let treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let treeLi: any = treeObj.element.querySelectorAll('li');
                let largeLi: any = document.getElementsByClassName('e-large-icons')[0].querySelectorAll('.e-large-icon');
                let addressLi: any = document.getElementById('file_breadcrumbbar').querySelectorAll('.e-address-list-item');
                expect(treeObj.selectedNodes[0]).toEqual("fe_tree_0_0");
                expect(treeLi.length).toEqual(5);
                expect(largeLi.length).toEqual(0);
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
                fileSystemData: flatData,
                showThumbnail: false,
                selectedItems: ["1", "6"] // Convert numbers to strings
            });
            feObj.appendTo("#file");
            setTimeout(function () {
                expect(feObj.selectedItems).toEqual(jasmine.arrayContaining(["1", "6"])); // Pass array of strings
                let li: any = document.getElementsByClassName('e-large-icons')[0].querySelectorAll('.e-large-icon');
                expect(li[1].getAttribute('aria-selected')).toEqual('true');
                expect(li[3].getAttribute('aria-selected')).toEqual('true');
                done();
            }, 400);
        });

        it('for sorting - Default value', (done) => {
            feObj = new FileManager({
                fileSystemData: flatData,
                sortOrder: 'Ascending'
            });
            feObj.appendTo('#file');
            setTimeout(function () {
                let items: any = document.getElementById('file_tb_sortby');
                items.click();
                expect(document.getElementById('file_ddl_ascending').children[0].classList.contains('e-fe-tick')).toBe(true);
                expect(document.getElementsByClassName('e-large-icons')[0].querySelectorAll('.e-large-icon').length).toEqual(6);
                expect(document.getElementsByClassName('e-large-icons')[0].querySelectorAll('.e-large-icon')[0].children[0].textContent).toBe('Base');
                expect(document.getElementsByClassName('e-large-icons')[0].querySelectorAll('.e-large-icon')[1].children[0].textContent).toBe('Documents');
                done();
            }, 400);
        });

        it('for sorting - Descending value', (done) => {
            feObj = new FileManager({
                fileSystemData: flatData,
                sortOrder: 'Descending'
            });
            feObj.appendTo('#file');
            setTimeout(function () {
                let items: any = document.getElementById('file_tb_sortby');
                items.click();
                expect(document.getElementById('file_ddl_descending').children[0].classList.contains('e-fe-tick')).toBe(true);
                expect(document.getElementsByClassName('e-large-icons')[0].querySelectorAll('.e-large-icon').length).toEqual(6);
                expect(document.getElementsByClassName('e-large-icons')[0].querySelectorAll('.e-large-icon')[0].children[0].textContent).toBe('Downloads');
                expect(document.getElementsByClassName('e-large-icons')[0].querySelectorAll('.e-large-icon')[2].children[0].textContent).toBe('Base');
                done();
            }, 400);
        });
        it('for sorting - None value', (done) => {
            feObj = new FileManager({
                fileSystemData: flatData,
                sortOrder: 'None'
            });
            feObj.appendTo('#file');
            setTimeout(function () {
                let items: any = document.getElementById('file_tb_sortby');
                items.click();
                expect(document.getElementById('file_ddl_none').children[0].classList.contains('e-fe-tick')).toBe(true);
                expect(document.getElementsByClassName('e-large-icons')[0].querySelectorAll('.e-large-icon').length).toEqual(6);
                expect(document.getElementsByClassName('e-large-icons')[0].querySelectorAll('.e-large-icon')[0].children[0].textContent).toBe('Documents');
                expect(document.getElementsByClassName('e-large-icons')[0].querySelectorAll('.e-large-icon')[1].children[0].textContent).toBe('Downloads');
                done();
            }, 400);
        });
        it('for rootAliasName with single selection in dialog popup', (done) => {
            feObj = new FileManager({
                fileSystemData: flatData,
                rootAliasName: "My Drive"
            });
            feObj.appendTo('#file');
            feObj.selectedItems = ['1'];
            setTimeout(function () {
                let item: any = document.getElementById('file_tb_details');
                item.click();
                expect(document.getElementById('file_dialog_dialog-content').querySelectorAll('tr')[2].querySelector('.e-fe-value').innerHTML).toBe('My Drive' + '\\' + 'Documents');
                done();
            }, 400);
        });
        it('for rootAliasName with multiple selection in dialog popup', (done) => {
            feObj = new FileManager({
                fileSystemData: flatData,
                rootAliasName: "My Drive"
            });
            feObj.appendTo('#file');
            feObj.selectedItems = ['1', '2'];
            setTimeout(function () {
                let item: any = document.getElementById('file_tb_details');
                item.click();
                expect(document.getElementById('file_dialog_dialog-content').querySelectorAll('tr')[2].querySelector('.e-fe-value').innerHTML).not.toBe('null');
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
        let tapEvent: any;
        let originalTimeout: any;
        beforeEach((done) => {
            j = 0; name = null;
            jasmine.Ajax.install();
            ele = createElement('div', { id: 'file' });
            document.body.appendChild(ele);
            feObj = new FileManager({
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
            tapEvent = {
                originalEvent: mouseEventArgs,
                tapCount: 1
            };
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
            expect(document.getElementsByClassName('e-large-icons')[0].querySelectorAll('.e-large-icon').length).toEqual(6);
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
                expect(document.getElementsByClassName('e-large-icons')[0].querySelectorAll('.e-large-icon').length).toEqual(7);
                expect(j).toBe(1);
                expect(target).toBe('BODY');
                expect(target).not.toBe('#' + feObj.element.id);
                done();
            }, 500);
        });

        it('for Duplicate Items testing', (done) => {
            name = 'Duplicate Items';
            let Li: any = document.getElementById('file_largeicons').querySelectorAll('li')[4].querySelector('.e-frame.e-icons');
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            Li = document.getElementById('file_largeicons').querySelectorAll('li')[1].querySelector('.e-frame.e-icons');
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            Li = document.getElementById('file_largeicons').querySelectorAll('li')[0].querySelector('.e-frame.e-icons');
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            (<HTMLElement>document.getElementsByClassName('e-fe-cut')[0]).click();
            mouseEventArgs.target = document.getElementById('file_largeicons').querySelectorAll('li')[2];
            tapEvent.tapCount = 2;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            setTimeout(function () {
                expect(document.getElementById('file_largeicons').querySelectorAll('li').length).toBe(0);
                (<HTMLElement>document.getElementsByClassName('e-fe-paste')[0]).click();
                setTimeout(function () {
                    expect(document.getElementById('file_largeicons').querySelectorAll('li').length).toBe(3);
                    expect(j).toBe(0);
                    done();
                }, 500);
            }, 500);
        });

        it('for details', (done: Function) => {
            name = 'File Details';
            let Li: any = document.getElementById('file_largeicons').querySelectorAll('li')[0].querySelector('.e-frame.e-icons');
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
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
            let Li: any = document.getElementById('file_largeicons').querySelectorAll('li')[1].querySelector('.e-frame.e-icons');
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            Li = document.getElementById('file_largeicons').querySelectorAll('li')[2].querySelector('.e-frame.e-icons');
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
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
            let Li: any = document.getElementById('file_largeicons').querySelectorAll('li')[1].querySelector('.e-frame.e-icons');
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            Li = document.getElementById('file_largeicons').querySelectorAll('li')[1].firstChild;
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
            let Li: any = document.getElementById('file_largeicons').querySelectorAll('li')[1].querySelector('.e-frame.e-icons');
            mouseEventArgs.target = Li;
            tapEvent.tapCount = 1;
            (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
            let items: any = document.getElementsByClassName('e-fe-rename');
            items[0].click();
            let ntr: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-text');
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
                let Li: any = document.getElementById('file_largeicons').querySelectorAll('li')[1].querySelector('.e-frame.e-icons');
                mouseEventArgs.target = Li;
                tapEvent.tapCount = 1;
                (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);
                let items: any = document.getElementsByClassName('e-fe-rename');
                items[0].click();
                let ntr: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-text');
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
    describe('FileManager dynamic folder operations in large icons view', () => {
        let mouseEventArgs: any, tapEvent: any;
        let feObj: any;
        let ele: HTMLElement;
        let originalTimeout: any;

        beforeEach(() => {
            jasmine.Ajax.install();
            ele = createElement('div', { id: 'file' });
            document.body.appendChild(ele);
            feObj = undefined;

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

            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
            if (feObj) feObj.destroy();
            ele.remove();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });

        it('dynamically create and open folder in large icons view without error', (done) => {
            let errorOccurred = false;
            let fileOpenSuccess = false;

            feObj = new FileManager({
                fileSystemData: flatData,
                showThumbnail: false,
                view: 'LargeIcons',
                failure: (args) => {
                    errorOccurred = true;
                    console.log("Error occurred:", args.error);
                },
                fileOpen: () => {
                    fileOpenSuccess = true;
                }
            });

            feObj.appendTo('#file');

            setTimeout(function () {
                const newFolder = {
                    dateCreated: new Date().toISOString(),
                    dateModified: new Date().toISOString(),
                    filterPath: "\\",
                    hasChild: false,
                    id: '10',
                    isFile: false,
                    name: "DynamicFolder",
                    parentId: '0',
                    size: 0,
                    type: "",
                };

                feObj.fileSystemData = [...flatData, newFolder];
                feObj.refresh();

                setTimeout(function () {
                    const listItems = document.getElementById('file_largeicons').querySelectorAll('li');
                    const newFolderElement = Array.from(listItems).find(li =>
                        li.querySelector('.e-list-text') &&
                        li.querySelector('.e-list-text').textContent === 'DynamicFolder'
                    );

                    expect(newFolderElement).toBeDefined();

                    mouseEventArgs.target = newFolderElement;
                    tapEvent.tapCount = 2;
                    (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);

                    setTimeout(function () {
                        expect(errorOccurred).toBe(false);
                        expect(fileOpenSuccess).toBe(true);

                        const addressItems = document.querySelectorAll('.e-address-list-item');
                        const lastAddressItem = addressItems[addressItems.length - 1];
                        expect(lastAddressItem.textContent).toContain('DynamicFolder');

                        done();
                    }, 500);
                }, 500);
            }, 500);
        });

        it('dynamically add file to a folder and view in large icons mode', (done) => {
            let errorOccurred = false;

            feObj = new FileManager({
                fileSystemData: flatData,
                showThumbnail: false,
                view: 'LargeIcons',
                failure: (args) => {
                    errorOccurred = true;
                    console.log("Error occurred:", args.error);
                }
            });

            feObj.appendTo('#file');

            setTimeout(function () {
                // Navigate to an existing folder first
                let folderElement = Array.from(document.getElementById('file_largeicons').querySelectorAll('li')).find(li =>
                    li.querySelector('.e-list-text') &&
                    li.querySelector('.e-list-text').textContent === 'Documents'
                );

                mouseEventArgs.target = folderElement;
                tapEvent.tapCount = 2;
                (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);

                setTimeout(function () {
                    // Create a new file in the current folder
                    const newFile = {
                        dateCreated: new Date().toISOString(),
                        dateModified: new Date().toISOString(),
                        filterPath: "\\Documents\\",
                        hasChild: false,
                        id: '11',
                        isFile: true,
                        name: "DynamicFile.txt",
                        parentId: '1', // Documents folder id
                        size: 1024,
                        type: ".txt",
                    };

                    // Add the new file to the data source
                    feObj.fileSystemData = [...flatData, newFile];
                    feObj.refresh();

                    setTimeout(function () {
                        // Check if the file is visible
                        const fileElement = Array.from(document.getElementById('file_largeicons').querySelectorAll('li')).find(li =>
                            li.querySelector('.e-list-text') &&
                            li.querySelector('.e-list-text').textContent === 'DynamicFile.txt'
                        );
                        expect(errorOccurred).toBe(false);

                        // Try to double-click on the file
                        mouseEventArgs.target = fileElement;
                        tapEvent.tapCount = 2;
                        (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);

                        setTimeout(function () {
                            // Should not cause any errors
                            expect(errorOccurred).toBe(false);
                            done();
                        }, 500);
                    }, 500);
                }, 500);
            }, 500);
        });

        it('dynamically create nested folder structure and navigate through it', (done) => {
            let errorOccurred = false;

            feObj = new FileManager({
                fileSystemData: flatData,
                showThumbnail: false,
                view: 'LargeIcons',
                failure: (args) => {
                    errorOccurred = true;
                    console.log("Error occurred:", args.error);
                }
            });

            feObj.appendTo('#file');

            setTimeout(function () {
                // Create parent folder
                const parentFolder = {
                    dateCreated: new Date().toISOString(),
                    dateModified: new Date().toISOString(),
                    filterPath: "\\",
                    hasChild: true,
                    id: '12',
                    isFile: false,
                    name: "ParentFolder",
                    parentId: '0',
                    size: 0,
                    type: "",
                };

                // Create child folder
                const childFolder = {
                    dateCreated: new Date().toISOString(),
                    dateModified: new Date().toISOString(),
                    filterPath: "\\ParentFolder\\",
                    hasChild: false,
                    id: '13',
                    isFile: false,
                    name: "ChildFolder",
                    parentId: '12',
                    size: 0,
                    type: "",
                };

                // Add both folders to the data source
                feObj.fileSystemData = [...flatData, parentFolder, childFolder];
                feObj.refresh();

                setTimeout(function () {
                    // Open parent folder
                    const parentElement = Array.from(document.getElementById('file_largeicons').querySelectorAll('li')).find(li =>
                        li.querySelector('.e-list-text') &&
                        li.querySelector('.e-list-text').textContent === 'ParentFolder'
                    );

                    mouseEventArgs.target = parentElement;
                    tapEvent.tapCount = 2;
                    (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);

                    setTimeout(function () {
                        expect(errorOccurred).toBe(false);

                        // Check if child folder is visible
                        const childElement = Array.from(document.getElementById('file_largeicons').querySelectorAll('li')).find(li =>
                            li.querySelector('.e-list-text') &&
                            li.querySelector('.e-list-text').textContent === 'ChildFolder'
                        );

                        expect(childElement).toBeDefined();

                        // Open child folder
                        mouseEventArgs.target = childElement;
                        tapEvent.tapCount = 2;
                        (<any>feObj.largeiconsviewModule).clickObj.tap(tapEvent);

                        setTimeout(function () {
                            // Verify no errors occurred during the navigation
                            expect(errorOccurred).toBe(false);

                            // Check breadcrumb path
                            const addressItems = document.querySelectorAll('.e-address-list-item');
                            const breadcrumbPath = Array.from(addressItems).map(item => item.textContent).join('/');

                            expect(breadcrumbPath).toContain('ParentFolder');
                            expect(breadcrumbPath).toContain('ChildFolder');

                            done();
                        }, 500);
                    }, 500);
                }, 500);
            }, 500);
        });

        it('should show error when renaming to original name after paste conflict, then allow rename to unique name', function (done) {
            feObj = new FileManager({
                fileSystemData: flatData,
                showThumbnail: false
            });
            feObj.appendTo('#file');
            setTimeout(() => {
                const contextMenu = (document.getElementById(feObj.element.id + '_contextmenu') as any).ej2_instances[0];
                const largeIcons = document.getElementById('file_largeicons').querySelectorAll('li');
                const originalIndex = Array.from(largeIcons).findIndex(li =>
                    li.querySelector('.e-list-text') &&
                    li.querySelector('.e-list-text').textContent === 'textDocument.doc'
                );
                expect(originalIndex).toBeGreaterThan(-1);
                mouseEventArgs.target = largeIcons[originalIndex];
                tapEvent.tapCount = 1;
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                const evt = document.createEvent('MouseEvents');
                evt.initEvent('contextmenu', true, true);
                largeIcons[originalIndex].dispatchEvent(evt);
                contextMenu.element.querySelector('.e-fe-copy').click();
                mouseEventArgs.target = document.getElementById('file_largeicons');
                tapEvent.tapCount = 1;
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                const pasteEvt = document.createEvent('MouseEvents');
                pasteEvt.initEvent('contextmenu', true, true);
                document.getElementById('file_largeicons').dispatchEvent(pasteEvt);
                contextMenu.element.querySelector('.e-fe-paste').click();
                const overwriteDialog = document.getElementById('file_extn_dialog');
                expect(overwriteDialog).toBeDefined();
                const yesButton = Array.from(overwriteDialog.querySelectorAll('.e-btn')).find(btn => btn.textContent.trim() === 'Yes');
                expect(yesButton).toBeDefined();
                (yesButton as HTMLElement).click();
                const updatedItems = document.getElementById('file_largeicons').querySelectorAll('li');
                const pastedItem = Array.from(updatedItems).find(li => {
                    const textEl = li.querySelector('.e-list-text');
                    return textEl && textEl.textContent && textEl.textContent.includes('textDocument(0).doc');
                });
                expect(pastedItem).toBeDefined();
                mouseEventArgs.target = pastedItem;
                tapEvent.tapCount = 1;
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                const renameEvt = document.createEvent('MouseEvents');
                renameEvt.initEvent('contextmenu', true, true);
                pastedItem.dispatchEvent(renameEvt);
                (document.getElementById('file_cm_rename') as HTMLElement).click();
                const renameDialog  = document.getElementById('file_dialog');
                const inputField = renameDialog.querySelector('#rename');
                (inputField as HTMLInputElement).value = 'textDocument.doc';
                const inputEvent = new Event('input', { bubbles: true });
                inputField.dispatchEvent(inputEvent);
                const saveButton = Array.from(renameDialog.querySelectorAll('.e-btn')).find(btn => btn.textContent.trim() === 'Save');
                expect(saveButton).toBeDefined();
                (saveButton as HTMLElement).click();
                expect(feObj.responseData.error).not.toBeNull();
                expect(feObj.responseData.error.message).toContain('already exists');
                const renameDialog1  = document.getElementById('file_dialog');
                const inputField1 = renameDialog1.querySelector('#rename');
                (inputField1 as HTMLInputElement).value = 'textDocument_x.doc';
                inputField1.dispatchEvent(inputEvent);
                const saveButton1 = Array.from(renameDialog1.querySelectorAll('.e-btn')).find(btn => btn.textContent.trim() === 'Save');
                expect(saveButton1).toBeDefined();
                (saveButton1 as HTMLElement).click();
                setTimeout(() => {
                    const updatedItem = document.getElementById('file_largeicons').querySelectorAll('li');
                    const renamedItem = Array.from(updatedItem).find(li => {
                        const textEl = li.querySelector('.e-list-text');
                        return textEl && textEl.textContent && textEl.textContent.includes('textDocument_x.doc');
                    });
                    expect(renamedItem).toBeDefined();
                    done();
                }, 500);
            }, 500);
        })

    });
});
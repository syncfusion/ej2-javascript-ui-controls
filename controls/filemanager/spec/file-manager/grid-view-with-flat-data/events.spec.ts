/**
 * FileManager spec document
 */
import { FileManager } from '../../../src/file-manager/base/file-manager';
import { NavigationPane } from '../../../src/file-manager/layout/navigation-pane';
import { DetailsView } from '../../../src/file-manager/layout/details-view';
import { Toolbar } from '../../../src/file-manager/actions/toolbar';
import { BeforeSendEventArgs, FileLoadEventArgs, FileSelectionEventArgs, ToolbarCreateEventArgs, UploadListCreateArgs, MenuOpenEventArgs, MenuClickEventArgs, ToolbarClickEventArgs, PopupOpenCloseEventArgs, BeforePopupOpenCloseEventArgs, FolderCreateEventArgs, DeleteEventArgs, RenameEventArgs, MoveEventArgs } from '../../../src/file-manager/base/interface';
import { createElement, Browser } from '@syncfusion/ej2-base';
import { errorData, flatData2, toolbarItems2 } from '../data';

FileManager.Inject(Toolbar, NavigationPane, DetailsView);

describe('FileManager control Grid view', () => {
    describe('events testing', () => {
        let mouseEventArgs: any, tapEvent: any;
        let feObj: any;
        let ele: HTMLElement;
        let i: number = 0;
        let originalTimeout: any;
        function clickFn(): void {
            i++;
        }
        beforeEach(() => {
            jasmine.Ajax.install();
            ele = createElement('div', { id: 'file' });
            document.body.appendChild(ele);
            feObj = undefined;
            i = 0;
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
        it('for fileOpen', (done) => {
            let dblclickevent:any;
            let i: number = 0;
            feObj = new FileManager({
                view: 'Details',
                fileSystemData: flatData2,
                showThumbnail: false,
                fileOpen: () => {
                    i++;
                }
            });
            feObj.appendTo('#file');
            dblclickevent = new MouseEvent('dblclick', {
                'view': window,
                'bubbles': true,
                'cancelable': true
            });
            setTimeout(function () {
                feObj.detailsviewModule.gridObj.selectRows([2]);
                feObj.detailsviewModule.gridObj.element.querySelectorAll('.e-row')[2].firstElementChild.dispatchEvent(dblclickevent);
                setTimeout(function () {
                    expect(i).toBe(1);
                    feObj.element.getElementsByClassName('e-address-list-item')[0].click();
                    setTimeout(function () {
                        expect(i).toBe(2);
                        let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
                        mouseEventArgs.target = li[3].querySelector('.e-fullrow');
                        feObj.navigationpaneModule.treeObj.touchClickObj.tap(tapEvent);
                        setTimeout(function () {
                            expect(i).toBe(3);
                            done();
                        }, 500);
                    }, 500);
                }, 500);
            }, 500);
        });
        it('for fileSelection', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                fileSystemData: flatData2,
                showThumbnail: false,
                fileSelection: () => {
                    i++;
                }
            });
            feObj.appendTo('#file');
            setTimeout(function () {
                let obj = (feObj.detailsviewModule.gridObj as any);
                var rows = obj.getRows();
                (rows[0].querySelector('.e-rowcell') as HTMLElement).click();
                expect(i).toEqual(1);
                mouseEventArgs.shiftKey = true;
                (rows[2].querySelector('.e-rowcell') as HTMLElement).click();
                expect(i).toEqual(3);
                done();
            }, 500);
        });
        it('for fileSelection with cancel', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                fileSystemData: flatData2,
                showThumbnail: false,
                fileSelection: (args: FileSelectionEventArgs) => { i++; args.cancel = true },

            });
            feObj.appendTo('#file');
            setTimeout(function () {
                let obj = (feObj.detailsviewModule.gridObj as any);
                var rows = obj.getRows();
                (rows[0].querySelector('.e-rowcell') as HTMLElement).click();
                expect(i).toEqual(1);
                expect(rows[0].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
                expect(rows[0].classList.contains('e-active')).toBe(false);
                done();
            }, 500);
        });
        it('for menuOpen', (done) => {
            let i: number = 0;
            feObj = new FileManager({
                view: 'Details',
                fileSystemData: flatData2,
                showThumbnail: false,
                menuOpen: (args: MenuOpenEventArgs) => {
                    i++;
                    expect(args.fileDetails.length).toBe(1);
                }
            });
            feObj.appendTo('#file');
            setTimeout(function () {
                feObj.detailsviewModule.gridObj.selectRows([1, 2, 3]);
                let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(1).getElementsByTagName('td')[2];
                let evt = document.createEvent('MouseEvents')
                evt.initEvent('contextmenu', true, true);
                let el: any = document.getElementById(feObj.element.id + '_contextmenu');
                let sourceElement: any = el.ej2_instances[0];
                sourceElement.animationSettings = { duration: 0, effect: "None" };
                sourceElement.dataBind();
                Li.dispatchEvent(evt);
                expect(i).toEqual(1);
                done();
            }, 500);
        });
        it('for menuClick', (done) => {
            let i: number = 0;
            feObj = new FileManager({
                view: 'Details',
                fileSystemData: flatData2,
                showThumbnail: false,
                menuClick: (args: MenuClickEventArgs) => {
                    i++;
                    expect(args.fileDetails.length).toBe(3);
                }
            });
            feObj.appendTo('#file');
            setTimeout(function () {
                feObj.detailsviewModule.gridObj.selectRows([1, 2, 3]);
                let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(1).getElementsByTagName('td')[2];
                let evt = document.createEvent('MouseEvents')
                evt.initEvent('contextmenu', true, true);
                let el: any = document.getElementById(feObj.element.id + '_contextmenu');
                let sourceElement: any = el.ej2_instances[0];
                sourceElement.animationSettings = { duration: 0, effect: "None" };
                sourceElement.dataBind();
                Li.dispatchEvent(evt);
                sourceElement.element.querySelector('#file_cm_delete').click();
                expect(i).toEqual(1);
                done();
            }, 500);
        });
        it('for ToolbarClick', (done) => {
            let i: number = 0;
            feObj = new FileManager({
                view: 'Details',
                fileSystemData: flatData2,
                showThumbnail: false,
                toolbarClick: (args: ToolbarClickEventArgs) => {
                    i++;
                    expect(args.fileDetails.length).toBe(3);
                }
            });
            feObj.appendTo('#file');
            setTimeout(function () {
                feObj.detailsviewModule.gridObj.selectRows([1, 2, 3]);
                feObj.element.querySelector('#file_tb_delete').click();
                expect(i).toEqual(1);
                done();
            }, 500);
        });
        it('for beforeSend', () => {
            feObj = new FileManager({
                view: 'Details',
                fileSystemData: flatData2,
                showThumbnail: false,
                beforeSend: clickFn
            });
            feObj.appendTo('#file');
            expect(i).toEqual(1);
        });
        it('for beforeSend with cancel', () => {
            feObj = new FileManager({
                view: 'Details',
                fileSystemData: flatData2,
                showThumbnail: false,
                beforeSend: (args: BeforeSendEventArgs) => { args.cancel = true; },
                success: clickFn,
                failure: clickFn
            });
            feObj.appendTo('#file');
            expect(i).toEqual(0);
        });
        it('for beforeSend with custom onSuccess function', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                fileSystemData: flatData2,
                showThumbnail: false,
                beforeSend: (args: BeforeSendEventArgs) => {
                    (args.ajaxSettings as any).onSuccess = function () {
                        clickFn();
                    };
                }
            });
            feObj.appendTo('#file');
            setTimeout(function () {
                expect(i).toEqual(1);
                done();
            }, 500);
        });
        it('for success', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                fileSystemData: flatData2,
                showThumbnail: false,
                success: clickFn
            });
            feObj.appendTo('#file');
            setTimeout(function () {
                expect(i).toEqual(1);
                done();
            }, 500);
        });
        it('for error', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                fileSystemData: errorData,
                showThumbnail: false,
                failure: clickFn
            });
            feObj.appendTo('#file');
            setTimeout(function () {
                expect(i).toEqual(1);
                done();
            }, 500);
        });
        it('for fileLoad', (done: Function) => {
            let grid: number = 0;
            let tree: number = 0;
            feObj = new FileManager({
                view: 'Details',
                fileSystemData: flatData2,
                showThumbnail: false,
                fileLoad: (args: FileLoadEventArgs) => {
                    if (args.module === "DetailsView") { grid++; }
                    if (args.module === "NavigationPane") { tree++; }
                }
            });
            feObj.appendTo('#file');
            setTimeout(function () {
                expect(grid).toEqual(6);
                expect(tree).toEqual(4);
                done();
            }, 500);
        });
        it('for toolbarCreate', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                fileSystemData: flatData2,
                showThumbnail: false,
                toolbarCreate: clickFn
            });
            feObj.appendTo('#file');
            setTimeout(function () {
                expect(i).toEqual(1);
                feObj.toolbarCreate = (args: ToolbarCreateEventArgs) => {
                    clickFn();
                    let ind: number = (<FileManager>feObj).getToolbarItemIndex('Custom tool');
                    if (ind !== -1) {
                        args.items[ind].cssClass = 'e-custom';
                    }
                }
                feObj.toolbarSettings.items = toolbarItems2;
                feObj.dataBind();
                expect(i).toEqual(2);
                expect((<FileManager>feObj).toolbarModule.toolbarObj.element.querySelectorAll('.e-custom').length).toBe(1);
                done();
            }, 500);
        });
        it('for toolbarClick', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                fileSystemData: flatData2,
                showThumbnail: false,
                toolbarSettings: {
                    visible: true,
                    items: toolbarItems2
                },
                toolbarClick: clickFn
            });
            feObj.appendTo('#file');
            done();
        });
        it('for beforePopupOpen with preventing file extension', (done: Function) => {
            feObj = new FileManager({
                view: 'Details',
                fileSystemData: flatData2,
                showThumbnail: false,
                showFileExtension: false,
            });
            feObj.appendTo('#file');
            setTimeout(function () {
                feObj.detailsviewModule.gridObj.selectRows([1]);
                let items: any = document.getElementsByClassName('e-fe-rename');
                items[0].click();
                expect((<HTMLInputElement>document.getElementById('rename')).value).toBe("Documents");
                (<HTMLElement>document.getElementById('file_dialog').querySelectorAll('.e-btn')[0]).click();
                feObj.detailsviewModule.gridObj.selectRows([2]);
                items[0].click();
                expect((<HTMLInputElement>document.getElementById('rename')).value).toBe("Downloads");
                (<HTMLInputElement>document.getElementById('rename')).value = "New ";
                (<HTMLElement>document.getElementById('file_dialog').querySelectorAll('.e-btn')[1]).click();
                expect(document.getElementsByClassName("e-fe-error")[0].textContent).not.toEqual("");
                (<HTMLInputElement>document.getElementById('rename')).value = "New.";
                (<HTMLElement>document.getElementById('file_dialog').querySelectorAll('.e-btn')[1]).click();
                expect(document.getElementsByClassName("e-fe-error")[0].textContent).not.toEqual("");
                (<HTMLElement>document.getElementById('file_dialog').querySelectorAll('.e-btn')[0]).click();
                feObj.detailsviewModule.gridObj.selectRows([1]);
                items[0].click();
                expect((<HTMLInputElement>document.getElementById('rename')).value).toBe("Documents");
                (<HTMLInputElement>document.getElementById('rename')).value = "2";
                (<HTMLElement>document.getElementById('file_dialog').querySelectorAll('.e-btn')[1]).click();
                setTimeout(function () {
                    let gridLi: any = document.getElementById('file_grid').querySelectorAll('.e-row');
                    expect(gridLi.length).toEqual(6);
                    expect(gridLi[0].querySelector('.e-fe-text').innerText).toBe("2");
                    done();
                }, 500);
            }, 500);
        });
    });

    describe('events testing popup event', () => {
        let mouseEventArgs: any;
        let feObj: FileManager;
        let ele: HTMLElement;
        let i: number = 0, j: number = 0, k: number = 0;
        let name: string = null;
        let dblclickevent: any;
        let originalTimeout: any;
        beforeEach((done) => {
            i = j = k = 0; name = null;
            jasmine.Ajax.install();
            ele = createElement('div', { id: 'file' });
            document.body.appendChild(ele);
            feObj = new FileManager({
                view: 'Details',
                fileSystemData: flatData2,
                showThumbnail: false,
                popupOpen: (args: PopupOpenCloseEventArgs) => {
                    expect(args.popupName).toBe(name);
                    i++;
                },
                popupClose: (args: PopupOpenCloseEventArgs) => {
                    expect(args.popupName).toBe(name);
                    i++;
                },
                beforePopupOpen: (args: BeforePopupOpenCloseEventArgs) => {
                    expect(args.popupName).toBe(name);
                    j++;
                },
                beforePopupClose: (args: BeforePopupOpenCloseEventArgs) => {
                    expect(args.popupName).toBe(name);
                    k++;
                }
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
            feObj.beforePopupOpen = (args: BeforePopupOpenCloseEventArgs) => { args.cancel = true; j++; }
            let item: any = document.getElementById('file_tb_newfolder');
            item.click();
            expect(i).toBe(0);
            expect(j).toBe(1);
        });

        it('for BeforeClose cancel testing', () => {
            name = 'Create Folder';
            feObj.beforePopupClose = (args: BeforePopupOpenCloseEventArgs) => { args.cancel = true; k++; }
            let item: any = document.getElementById('file_tb_newfolder');
            item.click();
            item = document.getElementById('file_dialog').querySelector('.e-dlg-closeicon-btn');
            item.click();
            expect(document.getElementById('file_dialog').classList.contains('e-popup-open')).toBe(true);
            expect(i).toBe(1);
            expect(j).toBe(1);
            expect(k).toBe(1);
        });

        it('for create folder', () => {
            name = 'Create Folder';
            let item: any = document.getElementById('file_tb_newfolder');
            item.click();
            item = document.getElementById('file_dialog').querySelector('.e-dlg-closeicon-btn');
            item.click();
            expect(i).toBe(2);
            expect(j).toBe(1);
            expect(k).toBe(1);
        });

        it('for Rename', () => {
            feObj.selectedItems = ['Food']
            name = 'Rename';
            let item: any = document.getElementById('file_tb_rename');
            item.click();
            item = document.getElementById('file_dialog').querySelector('.e-dlg-closeicon-btn');
            item.click();
            expect(i).toBe(2);
            expect(j).toBe(1);
            expect(k).toBe(1);
        });

        it('for Delete', () => {
            feObj.selectedItems = ['Food']
            name = 'Delete';
            let item: any = document.getElementById('file_tb_delete');
            item.click();
            item = document.getElementById('file_dialog').querySelector('.e-dlg-closeicon-btn');
            item.click();
            expect(i).toBe(2);
            expect(j).toBe(1);
            expect(k).toBe(1);
        });

        it('for details', (done: Function) => {
            name = 'File Details';
            feObj.detailsviewModule.gridObj.selectRows([1]);
            let items: any = document.getElementById('file_tb_details');
            items.click();
            setTimeout(function () {
                expect(document.getElementById('file_dialog_title').textContent).toBe('Base');
                expect((<any>document.querySelectorAll('.e-fe-value')[0]).textContent).toBe('Folder');
                let item: any = document.getElementById('file_dialog').querySelector('.e-dlg-closeicon-btn');
                item.click();
                expect(i).toBe(2);
                expect(j).toBe(1);
                expect(k).toBe(1);
                done();
            }, 500);
        });

        it('for Multiple details', (done: Function) => {
            name = 'File Details';
            feObj.detailsviewModule.gridObj.selectRows([1, 2]);
            let items: any = document.getElementById('file_tb_details');
            items.click();
            setTimeout(function () {
                expect(document.getElementById('file_dialog_title').textContent).toBe('Base, Downloads');
                expect((<any>document.querySelectorAll('.e-fe-value')[0]).textContent).toBe('Folder');
                let item: any = document.getElementById('file_dialog').querySelector('.e-dlg-closeicon-btn');
                item.click();
                expect(i).toBe(2);
                expect(j).toBe(1);
                expect(k).toBe(1);
                done();
            }, 500);
        });

        it('for image', () => {
            name = 'Image Preview';
            let el: any = document.getElementById(feObj.element.id + '_contextmenu');
            feObj.detailsviewModule.gridObj.selectRows([3]);
            let Li: Element = feObj.detailsviewModule.gridObj.getRowByIndex(3).getElementsByTagName('td')[2];
            let sourceElement: any = el.ej2_instances[0];
            let evt = document.createEvent('MouseEvents')
            evt.initEvent('contextmenu', true, true);
            Li.dispatchEvent(evt);
            expect(sourceElement.element.querySelectorAll('li')[0].innerText).toBe('Open');
            expect(sourceElement.element.querySelectorAll('li')[0].classList.contains('e-disabled')).toBe(false);
            sourceElement.element.querySelectorAll('li')[0].click();
            expect(i === 1).toBe(true);
            expect(feObj.viewerObj.visible).toBe(true);
            feObj.viewerObj.hide();
            expect(i === 2).toBe(true);
            expect(j).toBe(1);
            expect(k).toBe(1);
        });

        it('for Extension', () => {
            name = 'Rename'
            feObj.detailsviewModule.gridObj.selectRows([3]);
            let items: any = document.getElementsByClassName('e-fe-rename');
            items[0].click();
            let ntr: any = document.getElementById('file_grid').querySelectorAll('.e-rowcell.e-rowcell.e-fe-grid-name');
            expect(ntr.length).toEqual(6);
            expect(ntr[3].textContent).toBe("Adam.png");
            (<HTMLInputElement>document.getElementById('rename')).value = "1.pnga";
            name = 'Extension Change';
            (<HTMLElement>document.getElementById('file_dialog').querySelectorAll('.e-btn')[1]).click();
            let item: any = document.getElementById('file_extn_dialog').querySelector('.e-dlg-closeicon-btn');
            item.click();
            name = 'Rename'
            item = document.getElementById('file_dialog').querySelector('.e-dlg-closeicon-btn');
            item.click();
            expect(i).toBe(4);
            expect(j).toBe(2);
            expect(k).toBe(2);
        });

        it('for Error', (done) => {
            name = 'Error';
            feObj.fileSystemData = errorData;
            let item: any = document.getElementById('file_tb_refresh');
            item.click();
            setTimeout(function () {
                expect(i).toEqual(1);
                item = document.getElementById('file_dialog').querySelector('.e-dlg-closeicon-btn');
                item.click();
                expect(i).toBe(2);
                expect(j).toBe(1);
                expect(k).toBe(1);
                done();
            }, 500);
        });

        it('for continous multiple dialogs', (done) => {
            name = 'Error';
            feObj.fileSystemData = errorData;
            let item: any = document.getElementById('file_tb_refresh');
            item.click();
            setTimeout(function () {
                expect(i).toEqual(1);
                item = document.getElementById('file_dialog').querySelector('.e-dlg-closeicon-btn');
                item.click();
                expect(i).toBe(2);
                expect(j).toBe(1);
                expect(k).toBe(1);
                name = 'Create Folder';
                item = document.getElementById('file_tb_newfolder');
                item.click();
                item = document.getElementById('file_dialog').querySelector('.e-dlg-closeicon-btn');
                item.click();
                expect(i).toBe(4);
                expect(j).toBe(2);
                expect(k).toBe(2);
                feObj.selectedItems = ['Food']
                name = 'Rename';
                item = document.getElementById('file_tb_rename');
                item.click();
                item = document.getElementById('file_dialog').querySelector('.e-dlg-closeicon-btn');
                item.click();
                expect(i).toBe(6);
                expect(j).toBe(3);
                expect(k).toBe(3);
                feObj.selectedItems = ['Food']
                name = 'Delete';
                item = document.getElementById('file_tb_delete');
                item.click();
                item = document.getElementById('file_dialog').querySelector('.e-dlg-closeicon-btn');
                item.click();
                expect(i).toBe(8);
                expect(j).toBe(4);
                expect(k).toBe(4);
                name = 'Rename'
                feObj.detailsviewModule.gridObj.selectRows([3]);
                let items: any = document.getElementsByClassName('e-fe-rename');
                items[0].click();
                let ntr: any = document.getElementById('file_grid').querySelectorAll('.e-rowcell.e-rowcell.e-fe-grid-name');
                expect(ntr.length).toEqual(6);
                expect(ntr[3].textContent).toBe("Adam.png");
                (<HTMLInputElement>document.getElementById('rename')).value = "1.pnga";
                name = 'Extension Change';
                (<HTMLElement>document.getElementById('file_dialog').querySelectorAll('.e-btn')[1]).click();
                item = document.getElementById('file_extn_dialog').querySelector('.e-dlg-closeicon-btn');
                item.click();
                name = 'Rename'
                item = document.getElementById('file_dialog').querySelector('.e-dlg-closeicon-btn');
                item.click();
                expect(i).toBe(12);
                expect(j).toBe(6);
                expect(k).toBe(6);
                done();
            }, 500);
        });

        it('for BeforeFolderCreate cancel testing', (done) => {
            name = 'Create Folder';
            feObj.beforeFolderCreate = (args: FolderCreateEventArgs) => { args.cancel = true; };
            expect(document.getElementById('file_grid').querySelectorAll('.e-row').length).toEqual(6);
            let item: any = document.getElementById('file_tb_newfolder');
            item.click();
            (<any>document.querySelector('.e-fe-popup .e-input')).value = "New folder";
            (<HTMLElement>document.querySelector('.e-fe-popup.e-btn.e-primary')).click();
            setTimeout(function () {
                expect(document.getElementById('file_grid').querySelectorAll('.e-row').length).toEqual(6);
                done();
            }, 500);
        });

        it('for BeforeFolderCreate with same name testing', (done) => {
            name = 'Create Folder';
            feObj.beforeFolderCreate = (args: FolderCreateEventArgs) => { args.cancel = false; };
            expect(document.getElementById('file_grid').querySelectorAll('.e-row').length).toEqual(6);
            let item: any = document.getElementById('file_tb_newfolder');
            item.click();
            (<any>document.querySelector('.e-fe-popup .e-input')).value = "Base";
            (<HTMLElement>document.querySelector('.e-fe-popup.e-btn.e-primary')).click();
            setTimeout(function () {
                expect(document.getElementById('file_grid').querySelectorAll('.e-row').length).toEqual(6);
                done();
            }, 500);
        });

        it('for BeforeDelete cancel testing', (done) => {
            name = 'Delete';
            feObj.beforeDelete = (args: DeleteEventArgs) => { args.cancel = true; };
            expect(document.getElementById('file_grid').querySelectorAll('.e-row').length).toEqual(6);
            feObj.detailsviewModule.gridObj.selectRows([0]);
            let item: any = document.getElementById('file_tb_delete');
            item.click();
            (<HTMLElement>document.querySelector('.e-fe-popup.e-btn.e-primary')).click();
            setTimeout(function () {
                expect(document.getElementById('file_grid').querySelectorAll('.e-row').length).toEqual(6);
                done();
            }, 500);
        });

        it('for BeforeRename cancel testing', (done) => {
            name = 'Rename';
            feObj.beforeRename = (args: RenameEventArgs) => { args.cancel = true; };
            feObj.detailsviewModule.gridObj.selectRows([0]);
            let itemName: string = (document.getElementById('file_grid').querySelectorAll('.e-row')[0].querySelector('.e-fe-text') as HTMLElement).innerText;
            let item: any = document.getElementById('file_tb_rename');
            item.click();
            (<any>document.querySelector('.e-fe-popup .e-input')).value = "New folder";
            (<HTMLElement>document.querySelector('.e-fe-popup.e-btn.e-primary')).click();
            setTimeout(function () {
                expect((document.getElementById('file_grid').querySelectorAll('.e-row')[0].querySelector('.e-fe-text') as HTMLElement).innerText).toBe(itemName);
                done();
            }, 500);
        });

        it('for BeforeRename with same name testing', (done) => {
            name = 'Rename';
            feObj.beforeRename = (args: RenameEventArgs) => { args.cancel = false; };
            feObj.detailsviewModule.gridObj.selectRows([0]);
            let itemName: string = (document.getElementById('file_grid').querySelectorAll('.e-row')[0].querySelector('.e-fe-text') as HTMLElement).innerText;
            let item: any = document.getElementById('file_tb_rename');
            item.click();
            (<any>document.querySelector('.e-fe-popup .e-input')).value = "Downloads";
            (<HTMLElement>document.querySelector('.e-fe-popup.e-btn.e-primary')).click();
            setTimeout(function () {
                expect((document.getElementById('file_grid').querySelectorAll('.e-row')[0].querySelector('.e-fe-text') as HTMLElement).innerText).toBe(itemName);
                done();
            }, 500);
        });

        it('for BeforeMove cancel testing', (done) => {
            feObj.beforeMove = (args: MoveEventArgs) => { args.cancel = true; };
            expect(document.getElementById('file_grid').querySelectorAll('.e-row').length).toEqual(6);
            feObj.detailsviewModule.gridObj.selectRows([5]);
            let item: any = document.getElementById('file_tb_copy');
            item.click();
            item = document.getElementById('file_tb_paste');
            item.click();
            done();
        });
    });
});
/**
 * FileManager spec document
 */
import { FileManager } from '../../../src/file-manager/base/file-manager';
import { NavigationPane } from '../../../src/file-manager/layout/navigation-pane';
import { DetailsView } from '../../../src/file-manager/layout/details-view';
import { Toolbar } from '../../../src/file-manager/actions/toolbar';
import { createElement, Browser, EventHandler, isNullOrUndefined, select, closest } from '@syncfusion/ej2-base';
import { toolbarItems, toolbarItems1, toolbarItems3, data1, data2, data3, data4, data5, data6, data7, data8, data9, data12, data13, UploadData, rename, renameExist, renameExtension, renamed_ext, renamedwithout_ext, getMultipleDetails, pastesuccess, paste1, data17, data18, data19, doubleClickEmpty } from '../data';
import { extend } from '@syncfusion/ej2-grids';
import { FileSelectEventArgs } from '../../../src';
import { sortComparer } from "../../../src/file-manager/common/utility";

FileManager.Inject(Toolbar, NavigationPane, DetailsView);

function eventObject(eventType: string, eventName: string): Object {
    let tempEvent: any = document.createEvent(eventType);
    tempEvent.initEvent(eventName, true, true);
    let returnObject: any = extend({}, tempEvent);
    returnObject.preventDefault = () => { return true; };
    return returnObject;
}


describe('FileManager control Grid view', () => {
    describe('mouse event testing', () => {
        let mouseEventArgs: any, tapEvent: any;
        let feObj: FileManager;
        let ele: HTMLElement;
        let dblclickevent: MouseEvent;
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
                toolbarSettings: {
                    visible: true,
                    items: toolbarItems3
                },
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
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
            dblclickevent = new MouseEvent('dblclick', {
                'view': window,
                'bubbles': true,
                'cancelable': true
            });
        });
        afterEach((): void => {
            jasmine.Ajax.uninstall();
            if (feObj) feObj.destroy();
            ele.remove();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });

        //Spec added to check the script error which occured when clicked in empty folder of grid view
        it('mouse click on empty folder', (done) => {
            feObj.detailsviewModule.gridObj.selectRows([2]);
            let args = { rowData: { "name": "Food", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\", "_fm_id": "fe_tree_2" }, rowIndex: 2 };
            feObj.detailsviewModule.gridObj.recordDoubleClick(args);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(doubleClickEmpty)
            });
            setTimeout(function () {
                expect(feObj.activeModule).toBe('detailsview');
                (<HTMLElement>(<any>feObj.detailsviewModule.gridObj.contentModule).contentPanel.firstElementChild).click();
                done();
            }, 500)
        });

        it('navigation pane folder open cancel testing', () => {
            var restrict = true;
            feObj.fileOpen = function (args) {
                args.cancel = restrict;
            };
            var treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
            expect((li[0] as Element).classList.contains('e-active')).toBe(true);
            expect(li.length).toEqual(5);
            mouseEventArgs.target = li[1].querySelector('.e-fullrow');
            treeObj.touchClickObj.tap(tapEvent);
        });

        it('mouse click on grid element with row selection', () => {
            var gridObj: any = (document.getElementById("file") as any).ej2_instances[0];
            feObj.detailsviewModule.gridObj.selectRows([2]);
            mouseEventArgs.target = (<HTMLElement>(<any>feObj.detailsviewModule.gridObj.element.querySelectorAll('.e-content')[0]));
            gridObj.detailsviewModule.clickObj.tap(tapEvent);
            expect(feObj.detailsviewModule.gridObj.getSelectedRowCellIndexes().length).toBe(0);
            expect(feObj.detailsviewModule.gridObj.element.querySelectorAll('.e-row')[2].classList.contains('e-focused')).toBe(true)
        });

        it('mouse click on TreeView text', (done: Function) => {
            var treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
            expect((li[0] as Element).classList.contains('e-active')).toBe(true);
            expect(li.length).toEqual(5);
            mouseEventArgs.target = li[0].querySelector('.e-fullrow');
            treeObj.touchClickObj.tap(tapEvent);
            let li1: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
            expect((li[0] as Element).classList.contains('e-active')).toBe(true);
            expect(li1.length).toEqual(5);
            mouseEventArgs.target = li[1].querySelector('.e-fullrow');
            treeObj.touchClickObj.tap(tapEvent);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            setTimeout(function () {
                expect(document.getElementById('file_grid').querySelector('.e-spinner-pane').classList.contains('e-spin-show')).toEqual(false);
                expect(document.getElementById('file_grid').querySelector('.e-spinner-pane').classList.contains('e-spin-hide')).toEqual(true);
                let li2: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
                expect((li[0] as Element).classList.contains('e-active')).toBe(false);
                expect((li[1] as Element).classList.contains('e-active')).toBe(true);
                expect(li2.length).toEqual(5);
                mouseEventArgs.target = li[2].querySelector('.e-fullrow');
                treeObj.touchClickObj.tap(tapEvent);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data3)
                });
                setTimeout(() => {
                    let li3: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
                    expect((li[1] as Element).classList.contains('e-active')).toBe(false);
                    expect((li[2] as Element).classList.contains('e-active')).toBe(true);
                    expect(li3.length).toEqual(5);
                    // create new folder
                    let items: any = document.getElementsByClassName('e-toolbar-item');
                    items[0].click();
                    setTimeout(function () {
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
                            responseText: JSON.stringify(data4)
                        });
                        setTimeout(function () {
                            let li1: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
                            expect(li1.length).toEqual(6);
                            expect(document.getElementById('file_grid').querySelectorAll('.e-row').length).toEqual(1);
                            mouseEventArgs.target = li[0].querySelector('.e-fullrow');
                            treeObj.touchClickObj.tap(tapEvent);
                            this.request = jasmine.Ajax.requests.mostRecent();
                            this.request.respondWith({
                                status: 200,
                                responseText: JSON.stringify(data1)
                            });
                            setTimeout(function () {
                               this.request = jasmine.Ajax.requests.mostRecent();
                                this.request.respondWith({
                                    status: 200,
                                    responseText: JSON.stringify(data1)
                                });
                                this.request = jasmine.Ajax.requests.mostRecent();
                                this.request.respondWith({
                                    status: 200,
                                    responseText: JSON.stringify(data1)
                                });
                                setTimeout(function () {
                                    expect(document.getElementById('file_grid').querySelectorAll('.e-row').length).toEqual(5);
                                    done();
                                }, 500);
                            }, 500);
                        }, 500);
                    }, 500);
                }, 500);
            }, 500);
        });
        it('mouse click on Rename button', (done: Function) => {
            //rename item operation
            setTimeout(function () {
                feObj.detailsviewModule.gridObj.selectRows([0]);
                feObj.detailsviewModule.gridObj.dataBind();
                let items: any = document.getElementsByClassName('e-fe-rename');
                items[0].click();
                setTimeout(function () {
                    let inputValue: any = document.getElementById('file_dialog').querySelector('#rename');
                    expect((inputValue as any).value).toEqual("Documents");
                    inputValue.value = 'My Folder';
                    (document.getElementById('file_dialog').querySelectorAll('.e-btn')[1] as HTMLElement).click();
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify(rename)
                    });
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify(rename)
                    });
                    setTimeout(function () {
                        let li1: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
                        expect(li1[1].textContent).toBe("My Folder")
                        feObj.detailsviewModule.gridObj.selectRows([2]);
                        //rename with exisiting name
                        items[0].click();
                        setTimeout(function () {
                            let val: any = document.getElementById('file_dialog').querySelector('#rename');
                            expect((val as any).value).toEqual("My Folder");
                            val.value = 'My Folder1';
                            (document.getElementById('file_dialog').querySelectorAll('.e-btn')[1] as HTMLElement).click();
                            this.request = jasmine.Ajax.requests.mostRecent();
                            this.request.respondWith({
                                status: 200,
                                responseText: JSON.stringify(renameExist)
                            });
                            setTimeout(function () {
                                expect(document.getElementById('file_dialog').querySelector('.e-dlg-content').textContent).toBe("Cannot create a file when that file already exists");
                                (feObj as any).dialogObj.hide();
                                feObj.detailsviewModule.gridObj.selectRows([4]);
                                //renaming the extension
                                items[0].click();
                                setTimeout(function () {
                                    let val: any = document.getElementById('file_dialog').querySelector('#rename');
                                    expect((val as any).value).toEqual("1.png");
                                    val.value = '1.jpg';
                                    (document.getElementById('file_dialog').querySelectorAll('.e-btn')[1] as HTMLElement).click();
                                    setTimeout(function () {
                                        expect(document.getElementById('file_extn_dialog').querySelector('.e-dlg-content').textContent).toBeTruthy();
                                        (document.getElementById('file_extn_dialog').querySelectorAll('.e-btn')[2] as HTMLElement).click();
                                        setTimeout(function () {
                                            items[0].click();
                                            setTimeout(function () {
                                                let val: any = document.getElementById('file_dialog').querySelector('#rename');
                                                expect((val as any).value).toEqual("1.png");
                                                val.value = '1.jpg';
                                                (document.getElementById('file_dialog').querySelectorAll('.e-btn')[1] as HTMLElement).click();
                                                setTimeout(function () {
                                                    expect(document.getElementById('file_extn_dialog').querySelector('.e-dlg-content').textContent).toBeTruthy();
                                                    (document.getElementById('file_extn_dialog').querySelectorAll('.e-btn')[1] as HTMLElement).click();
                                                    this.request = jasmine.Ajax.requests.mostRecent();
                                                    this.request.respondWith({
                                                        status: 200,
                                                        responseText: JSON.stringify(renamed_ext)
                                                    });
                                                    setTimeout(function () {
                                                        items[0].click();
                                                        setTimeout(function () {
                                                            let val: any = document.getElementById('file_dialog').querySelector('#rename');
                                                            expect((val as any).value).toEqual("1.png");
                                                            val.value = '2.png';
                                                            (document.getElementById('file_dialog').querySelectorAll('.e-btn')[1] as HTMLElement).click();
                                                            done();
                                                        }, 500);
                                                    }, 500);
                                                }, 500);
                                            }, 500);
                                        }, 500);
                                    }, 500);
                                }, 500);
                            }, 500);
                        }, 500);
                    }, 500);
                }, 500);
            }, 500);
        });
        it('mouse click on tree node rename', (done: Function) => {
            //rename operation
            setTimeout(function () {
                var treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
                mouseEventArgs.target = li[1].querySelector('.e-fullrow');
                treeObj.touchClickObj.tap(tapEvent);
                let items: any = document.getElementsByClassName('e-fe-rename');
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data3)
                });
                setTimeout(function () {
                    mouseEventArgs.target = li[4].querySelector('.e-fullrow');
                    treeObj.touchClickObj.tap(tapEvent);
                    let items: any = document.getElementsByClassName('e-fe-rename');
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify(data3)
                    });
                    items[0].click();
                    setTimeout(function () {
                        let inputValue: any = document.getElementById('file_dialog').querySelector('#rename');
                        //Need to ensure the below spec
                        // expect((inputValue as any).value).toEqual("Nature");
                        // inputValue.value = 'Elegant';
                        //(document.getElementById('file_dialog').querySelectorAll('.e-btn')[1] as HTMLElement).click();
                        setTimeout(function () {
                            var treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                            let li: any = document.getElementById('file_tree').querySelectorAll('li');
                            done();
                        }, 500);
                    }, 500);
                }, 500);
            }, 500);
        });
        it('File name validation in rename', (done: Function) => {
            //rename operation
            setTimeout(function () {
                feObj.detailsviewModule.gridObj.selectRows([0]);
                feObj.detailsviewModule.gridObj.dataBind();
                let items: any = document.getElementsByClassName('e-fe-rename');
                items[0].click();
                setTimeout(function () {
                    let inputValue: any = document.getElementById('file_dialog').querySelector('#rename');
                    expect((inputValue as any).value).toEqual("Documents");
                    inputValue.value = 'My Folder*';
                    var inputEvent = new Event('input', { 'bubbles': true, 'cancelable': true });
                    inputValue.dispatchEvent(inputEvent);
                    expect(inputValue.parentElement.nextElementSibling.textContent).toEqual('The file or folder name "My Folder*" contains invalid characters. Please use a different name. Valid file or folder names cannot end with a dot or space, and cannot contain any of the following characters: \\/:*?\"<>|');
                    inputValue.onkeyup({ 'bubbles': true, 'cancelable': true, ctrlKey: true, which: 83 } as any);
                    inputValue.onkeyup({ 'bubbles': true, 'cancelable': true, ctrlKey: true, charCode: 83 } as any);
                    inputValue.value = "My folders";
                    var inputEvent = new Event('input', { 'bubbles': true, 'cancelable': true });
                    inputValue.dispatchEvent(inputEvent);
                    inputValue.onkeyup({ 'bubbles': true, 'cancelable': true, ctrlKey: true, keyCode: 13, key: 'Enter', which: 13 } as any);
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify(rename)
                    });
                    done();
                }, 500);
            }, 500);
        });
        it('for upload element', () => {
            expect(feObj.toolbarSettings.visible).toEqual(true);
            expect(feObj.toolbarSettings.items).toEqual(toolbarItems3);
            expect(feObj.element.querySelectorAll('.e-toolbar-item').length).toEqual(toolbarItems3.length);
            expect(feObj.element.querySelectorAll('.e-toolbar-item').length).toEqual(16);
            let fileObj: File = new File(["Nice One"], "sample.txt", { lastModified: 0, type: "overide/mimetype" });
            let fileObj1: File = new File(["2nd File"], "demo.txt", { lastModified: 0, type: "overide/mimetype" });
            let eventArgs: any = { type: 'click', target: { files: [fileObj, fileObj1] }, preventDefault: (): void => { } };
            let uploadObj: any = document.querySelector('#' + feObj.element.id + '_upload');
            uploadObj.ej2_instances[0].onSelectFiles(eventArgs);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(UploadData)
            });
        });

        it('double click on folder', (done: Function) => {
            //double click
            setTimeout(function () {
                let obj = (feObj.detailsviewModule.gridObj as any);
                (obj as any).dblClickHandler({ target: obj.element.querySelectorAll('.e-row')[3].firstElementChild });
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data12)
                });
                setTimeout(function () {
                    var gridFiles = document.getElementById("file_grid").querySelectorAll('.e-row');
                    expect(gridFiles.length).toBe(9);
                    done();
                }, 500);
            }, 500);
        });
        it('mouse click on file', () => {
            let li: any = document.getElementById('file_grid').querySelectorAll('.e-row');
            expect(li[4].getAttribute('aria-selected')).toEqual(null);
            expect(li[4].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            feObj.detailsviewModule.gridObj.selectRows([4]);
            let nli: any = document.getElementById('file_grid').querySelectorAll('.e-row');
            expect(nli[4].getAttribute('aria-selected')).toEqual('true');
            expect(nli[4].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
        });
        it('mouse double click on file', () => {
            feObj.fileSelect = (args:FileSelectEventArgs) =>{
                expect(args.isInteracted).toEqual(true);
            }
            let li: any = document.getElementById('file_grid').querySelectorAll('.e-row');
            expect(li[4].getAttribute('aria-selected')).toEqual(null);
            expect(li[4].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
            let args = { rowData: { "name": "1.png", "size": 49792, "dateModified": "1/3/2018 4:07:28 PM", "dateCreated": "10/17/2018 12:57:59 PM", "hasChild": false, "isFile": true, "type": ".png" }, rowIndex: 4 };
            feObj.detailsviewModule.gridObj.recordDoubleClick(args);
            let nli: any = document.getElementById('file_grid').querySelectorAll('.e-row');
            expect(nli[4].getAttribute('aria-selected')).toEqual('true');
            expect(nli[4].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
        });
        it('mouse click on header cell of name', () => {
            let li: any = document.getElementById('file_grid').querySelectorAll('.e-row');
            expect(li.length).toEqual(5);
            expect(li[4].querySelectorAll(".e-rowcell")[2].querySelector('.e-fe-text').textContent).toBe('1.png');
            (feObj.element.querySelectorAll('.e-headercell')[2] as HTMLElement).click();
            let nli: any = document.getElementById('file_grid').querySelectorAll('.e-row');
            expect(nli.length).toEqual(5);
            expect(nli[4].querySelectorAll(".e-rowcell")[2].querySelector('.e-fe-text').textContent).toBe('1.png');
        });
        it('check box selection and allow multi selection', (done: Function) => {
            //check box render
            setTimeout(function () {
                let obj = (feObj.detailsviewModule.gridObj as any);
                expect(obj.getHeaderContent().querySelectorAll('.e-checkselectall').length).toBe(1);
                expect(obj.getContent().querySelectorAll('.e-checkselect').length).toBe(5);
                //check box selection
                var rows = obj.getRows();
                var chkAll = obj.element.querySelector('.e-checkselectall').nextElementSibling as HTMLElement;
                (rows[0].querySelector('.e-rowcell') as HTMLElement).click();
                expect(rows[0].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
                expect(rows[0].querySelectorAll('.e-check').length).toBe(1);
                expect(chkAll.classList.contains('e-stop')).toBeTruthy();
                //check box deselection
                (rows[0].querySelector('.e-rowcell') as HTMLElement).click();
                expect(rows[0].querySelectorAll('.e-check').length).toBe(0);
                expect(chkAll.classList.contains('e-uncheck')).toBeTruthy();
                feObj.allowMultiSelection = true;
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data12)
                });
                feObj.dataBind();
                (rows[0].querySelector('.e-frame') as HTMLElement).click();
                (rows[2].querySelector('.e-frame') as HTMLElement).click();
                (rows[4].querySelector('.e-frame') as HTMLElement).click();
                expect(obj.element.querySelectorAll('.e-check').length).toBe(3);
                done();
            }, 500);
        });
        it('check box selection and allow multi selection false', (done: Function) => {
            //check box render
            setTimeout(function () {
                let obj = (feObj.detailsviewModule.gridObj as any);
                expect(obj.getHeaderContent().querySelectorAll('.e-checkselectall').length).toBe(1);
                expect(obj.getContent().querySelectorAll('.e-checkselect').length).toBe(5);
                //check box selection
                var rows = obj.getRows();
                var chkAll = obj.element.querySelector('.e-checkselectall').nextElementSibling as HTMLElement;
                feObj.allowMultiSelection = true;
                (rows[0].querySelector('.e-frame') as HTMLElement).click();
                (rows[2].querySelector('.e-frame') as HTMLElement).click();
                (rows[4].querySelector('.e-frame') as HTMLElement).click();
                expect(obj.element.querySelectorAll('.e-check').length).toBe(3);
                feObj.allowMultiSelection = false; feObj.showItemCheckBoxes = false; feObj.dataBind();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data12)
                });
                setTimeout(() => {
                    expect(JSON.parse(JSON.stringify(feObj.detailsviewModule.gridObj.columns[0])).type).not.toBe('checkbox');
                    (feObj.detailsviewModule.gridObj.getRows()[0].querySelector('.e-rowcell') as HTMLElement).click();
                    (feObj.detailsviewModule.gridObj.getRows()[2].querySelector('.e-rowcell') as HTMLElement).click();
                    (feObj.detailsviewModule.gridObj.getRows()[4].querySelector('.e-rowcell') as HTMLElement).click();
                    expect(feObj.detailsviewModule.gridObj.selectedRowIndex).toBe(4);
                    expect(feObj.selectedItems.length).toBe(1);
                    done();
                }, 500);

            }, 500);
        });
        // it('Download click testing', (done) => {
        //     let items: any = document.getElementsByClassName('e-toolbar-item');
        //     jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //     setTimeout(function () {
        //         jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //         feObj.detailsviewModule.gridObj.selectRows([1, 2]);
        //         let sortbyObj: any = feObj.toolbarModule.toolbarObj.element.querySelector('#Download');
        //         sortbyObj.click();
        //         done();
        //     }, 500);
        // });
        // it('Download click testing', (done) => {
        //     let items: any = document.getElementsByClassName('e-toolbar-item');
        //     jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //     setTimeout(function () {
        //         jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //         feObj.detailsviewModule.gridObj.selectRows([1, 2]);
        //         items[9].click();
        //         done();
        //     }, 500);
        // });
        it('for sortby element click testing', (done) => {
            expect(feObj.toolbarSettings.visible).toEqual(true);
            expect(feObj.toolbarSettings.items).toEqual(toolbarItems3);
            let sortbyObj: any = feObj.toolbarModule.toolbarObj.element.querySelector('#' + feObj.element.id + '_tb_sortby');
            sortbyObj.click();
            setTimeout(function () {
                done()
            }, 200);
        });
        it('for sortby name element Descending testing', (done) => {
            expect(feObj.toolbarSettings.visible).toEqual(true);
            expect(feObj.toolbarSettings.items).toEqual(toolbarItems3);
            let sortbyObj: any = feObj.toolbarModule.toolbarObj.element.querySelector('#' + feObj.element.id + '_tb_sortby');
            sortbyObj.click();
            setTimeout(function () {
                sortbyObj.ej2_instances[0].dropDown.element.querySelectorAll('.e-item')[5].click();
                expect(feObj.detailsviewModule.gridObj.sortSettings.columns[0].field).toBe('name');
                expect(feObj.detailsviewModule.gridObj.sortSettings.columns[0].direction).toBe('Descending');
                done();
            }, 200);
        });
        it('for sortby name element Ascending testing', (done) => {
            expect(feObj.toolbarSettings.visible).toEqual(true);
            expect(feObj.toolbarSettings.items).toEqual(toolbarItems3);
            let sortbyObj: any = feObj.toolbarModule.toolbarObj.element.querySelector('#' + feObj.element.id + '_tb_sortby');
            sortbyObj.click();
            setTimeout(function () {
                sortbyObj.ej2_instances[0].dropDown.element.querySelectorAll('.e-item')[4].click();
                expect(feObj.detailsviewModule.gridObj.sortSettings.columns[0].field).toBe('name');
                expect(feObj.detailsviewModule.gridObj.sortSettings.columns[0].direction).toBe('Ascending');
                done();
            }, 200);
        });
        it('mouse click on the grid header for sorting testing', (done: Function) => {
            (document.querySelectorAll('.e-headercell')[2] as any).click();
            setTimeout(function () {
                let rows = document.getElementById('file_grid').querySelectorAll('.e-row');
                expect(rows.length).toEqual(5);
                expect(rows[0].querySelectorAll('td')[2].querySelector('.e-fe-text').textContent).toBe('Nature');
                (document.querySelectorAll('.e-headercell')[2] as any).click();
                setTimeout(function () {
                    let rows1 = document.getElementById('file_grid').querySelectorAll('.e-row');
                    expect(rows1.length).toEqual(5);
                    expect(rows1[0].querySelectorAll('td')[2].querySelector('.e-fe-text').textContent).toBe('Documents');
                    var treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
                    let li: Element[] = treeObj.element.querySelectorAll('li');
                    mouseEventArgs.target = li[1].querySelector('.e-fullrow');
                    treeObj.touchClickObj.tap(tapEvent);
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify(data13)
                    });
                    setTimeout(function () {
                        let rows2 = document.getElementById('file_grid').querySelectorAll('.e-row');
                        expect(rows2.length).toEqual(6);
                        expect(rows2[0].querySelectorAll('td')[2].querySelector('.e-fe-text').textContent).toBe('Documents');
                        expect(rows2[1].querySelectorAll('td')[2].querySelector('.e-fe-text').textContent).toBe('Employees');
                        expect(rows2[5].querySelectorAll('td')[2].querySelector('.e-fe-text').textContent).toBe('emp.png');
                        done();
                    }, 500);
                }, 500);
            }, 500);
        });
        it('for sortby size element testing', (done) => {
            expect(feObj.toolbarSettings.visible).toEqual(true);
            expect(feObj.toolbarSettings.items).toEqual(toolbarItems3);
            let sortbyObj: any = feObj.toolbarModule.toolbarObj.element.querySelector('#' + feObj.element.id + '_tb_sortby');
            sortbyObj.click();
            setTimeout(function () {
                sortbyObj.ej2_instances[0].dropDown.element.querySelectorAll('.e-item')[1].click();
                expect(feObj.detailsviewModule.gridObj.sortSettings.columns[0].field).toBe('size');
                expect(feObj.detailsviewModule.gridObj.sortSettings.columns[0].direction).toBe('Ascending');
                done();
            }, 200);
        });
        it('for sortby dateModified element testing', (done) => {
            expect(feObj.toolbarSettings.visible).toEqual(true);
            expect(feObj.toolbarSettings.items).toEqual(toolbarItems3);
            let sortbyObj: any = feObj.toolbarModule.toolbarObj.element.querySelector('#' + feObj.element.id + '_tb_sortby');
            sortbyObj.click();
            setTimeout(function () {
                sortbyObj.ej2_instances[0].dropDown.element.querySelectorAll('.e-item')[2].click();
                expect(feObj.detailsviewModule.gridObj.sortSettings.columns[0].field).toBe('_fm_modified');
                expect(feObj.detailsviewModule.gridObj.sortSettings.columns[0].direction).toBe('Ascending');
                done();
            }, 200);
        });
        it('mouse click on the layout switch icon', (done: Function) => {
            let grid: HTMLElement = document.getElementById('file_grid');
            let largeIcons: HTMLElement = document.getElementById('file_largeicons');
            let icon: any = document.getElementById('file_tb_view');
            icon.click();
            let layoutObj: any = icon.ej2_instances[0];
            setTimeout(function () {
                layoutObj.dropDown.element.querySelectorAll('.e-item')[1].click();
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>grid.querySelectorAll('.e-row');
                expect(li.length).toBe(5);
                expect(grid.classList.contains('e-display-none')).toBe(false);
                document.getElementById('file_tb_view').click();
                setTimeout(function () {
                    layoutObj.dropDown.element.querySelectorAll('.e-item')[0].click();
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify(data1)
                    });
                    setTimeout(function () {
                        let li1: Element[] = <Element[] & NodeListOf<HTMLLIElement>>largeIcons.querySelectorAll('li');
                        expect(li1.length).toBe(5);
                        expect(grid.classList.contains('e-display-none')).toBe(true);
                        expect(largeIcons.classList.contains('e-display-none')).toBe(false);
                        done();
                    }, 500);
                }, 500);
            }, 500);
        });
    });
    describe('grid settings testing', () => {
        let feObj: FileManager;
        let ele: HTMLElement;
        let originalTimeout: any;
        beforeEach((): void => {
            jasmine.Ajax.install();
            feObj = undefined;
            let ele: HTMLElement = createElement('div', { id: 'file' });
            document.body.appendChild(ele);
            feObj = new FileManager({
                view: 'Details',
                ajaxSettings: { url: '/FileOperations' },
                showThumbnail: false,
                detailsViewSettings: {
                    columnResizing: true,
                    columns: [{
                        field: 'name', headerText: 'Name', minWidth: 120, width: '120', maxWidth: 300, headerTextAlign: 'Left',
                        template: '<span class="e-fe-icon"></span>${name}'
                    },
                    { field: 'type', headerText: 'Type', width: '100', minWidth: 8, textAlign: 'Left', },
                    { field: 'size', headerText: 'Size', headerTextAlign: 'Left', minWidth: 8, width: '100', textAlign: 'Right' },
                    { field: 'hasChild', headerText: 'Has Children', minWidth: 8, width: '200', textAlign: 'Right' },
                    ]
                },
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data5)
            });
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;

        });
        afterEach((): void => {
            jasmine.Ajax.uninstall();
            if (feObj) feObj.destroy();
            if (ele) ele.remove();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });

        it('columnResizing testing', (done: Function) => {
            expect(feObj.detailsViewSettings.columnResizing).toEqual(true);
            expect(feObj.detailsViewSettings.columns.length).toEqual(4);
            expect((feObj.detailsViewSettings.columns[0] as any).headerTextAlign).toEqual("Left");
            expect((feObj.detailsViewSettings.columns[0] as any).minWidth).toEqual(120);
            expect((feObj.detailsViewSettings.columns[0] as any).maxWidth).toEqual(300);
            expect((feObj.detailsViewSettings.columns[2] as any).field).toEqual("size");
            expect((feObj.detailsViewSettings.columns[1] as any).textAlign).toEqual("Left");
            expect(document.getElementById('file_grid').classList.contains('e-grid')).toEqual(true);
            let headerText: any = document.getElementById('file_grid').querySelectorAll('.e-headertext')
            expect(headerText[3].innerText).toBe("Has Children");
            expect(document.getElementById('file_grid').classList.contains('e-resize-lines')).toEqual(true);
            expect(document.getElementById('file_grid').querySelectorAll('.e-rhandler').length).toBe(4);
            done();
        });
    });
    describe('sortComparer function', () => {
        it('should sort folders before files', (done: Function) => {
            const folderName = 'folder';
            const fileName = 'file.txt';
            expect(sortComparer(folderName, fileName)).toBeLessThan(0);
            expect(sortComparer(fileName, folderName)).toBeGreaterThan(0);
            done();
        });
        it('should sort based on natural sorting', (done: Function) => {
            const folderName1 = '2';
            const folderName2 = '10.0';
            expect(sortComparer(folderName1, folderName2)).toBeLessThan(0);
            expect(sortComparer(folderName2, folderName1)).toBeGreaterThan(0);
            done();
        });
        it('should sort based on numerical value', (done: Function) => {
            var file1 = 'file2.txt';
            var file2 = 'file10.txt';
            expect(sortComparer(file1, file2)).toBeLessThan(0);
            expect(sortComparer(file2, file1)).toBeGreaterThan(0);
            done();
        });
        it('should sort alphabetically when numerical values are the same', (done: Function) => {
            const file1 = 'file2a.txt';
            const file2 = 'file2b.txt';
            expect(sortComparer(file1, file2)).toBeLessThan(0);
            expect(sortComparer(file2, file1)).toBeGreaterThan(0);
            done();
        });
        it('should sort shorter strings before longer ones when other parts are equal', (done: Function) => {
            const file1 = 'file2.txt';
            const file2 = 'file2a.txt';
            expect(sortComparer(file1, file2)).toBeLessThan(0);
            expect(sortComparer(file2, file1)).toBeGreaterThan(0);
            done();
        });   
    });
    describe('Grid viewtesting', () => {
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
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                toolbarSettings: {
                    visible: true,
                    items: ['NewFolder']
                },
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
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
        it('script error for grid header sort with no sortby in toolbar', () => {
            expect(feObj.sortOrder).toBe('Ascending');
            (<HTMLElement>document.getElementsByClassName('e-sortfilterdiv')[2]).click();
            expect(feObj.sortOrder).toBe( 'Descending');
        });
    });
    describe('Grid viewtesting', () => {
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
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                toolbarSettings: {
                    visible: true,
                    items: toolbarItems3
                },
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
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
        it('title attribute testing', () => {
            let li: Element[] = feObj.detailsviewModule.gridObj.getRows();
            for (let i: number = 0; i < li.length; i++) {
                let ele: Element = li[i].querySelector('.e-fe-text');
                expect(ele.getAttribute('title')).toBe(null);
                expect(closest(ele, 'td').getAttribute('title')).toBe(ele.textContent);
            }
            let Li :any = feObj.navigationpaneModule.treeObj.element.querySelectorAll('li');
            for (let i: number = 0; i < Li.length; i++) {
                expect(Li[i].getAttribute('title')).toBe(Li[i].querySelector('.e-list-text').textContent);
            }
        });
        it('select item maintain by sortby testing', (done: Function) => {
            feObj.detailsviewModule.gridObj.selectRows([0]);
            let li: any = feObj.detailsviewModule.gridObj.getRowByIndex(0).getElementsByTagName('td')[2];
            expect(li.querySelector('.e-fe-text').textContent).toBe('Documents');
            expect(li.classList.contains('e-active')).toBe(true);
            let sortbyObj: any = feObj.toolbarModule.toolbarObj.element.querySelector('#' + feObj.element.id + '_tb_sortby');
            sortbyObj.click();
            sortbyObj.ej2_instances[0].dropDown.element.querySelectorAll('.e-item')[2].click();
            let li1: any = feObj.detailsviewModule.gridObj.getRowByIndex(0).getElementsByTagName('td')[2];
            expect(li1.querySelector('.e-fe-text').textContent).toBe('Documents');
            expect(li1.classList.contains('e-active')).toBe(true);
            done();
        });
    });
});
describe('Default functionality testing', () => {
    let mouseEventArgs: any, tapEvent: any;
    let keyboardEventArgs: any;
    let feObj: FileManager;
    let ele: HTMLElement;
    let originalTimeout: any;
    beforeEach((): void => {
        jasmine.Ajax.install();
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
        keyboardEventArgs = {
            preventDefault: (): void => { },
            action: null,
            target: null,
            stopImmediatePropagation: (): void => { },
        };
        ele = createElement('div', { id: 'file' });
        document.body.appendChild(ele);
        feObj = new FileManager({ view: 'Details', ajaxSettings: { url: '/FileOperations' }, showThumbnail: false, });
        feObj.appendTo('#file');
        this.request = jasmine.Ajax.requests.mostRecent();
        this.request.respondWith({
            status: 200,
            responseText: JSON.stringify(data1)
        });
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
    });
    afterEach((): void => {
        jasmine.Ajax.uninstall();
        if (feObj) feObj.destroy();
        ele.remove();
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });
    // it('Get details operation on tree nodes', (done: Function) => {
    //     var treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
    //     let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
    //     mouseEventArgs.target = li[1].querySelector('.e-fullrow');
    //     treeObj.touchClickObj.tap(tapEvent);
    //     let items: any = document.getElementsByClassName('e-toolbar-item');
    //     items[13].click();
    //     this.request = jasmine.Ajax.requests.mostRecent();
    //     this.request.respondWith({
    //         status: 200,
    //         responseText: JSON.stringify(data8)
    //     });
    //     jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    //     setTimeout(function () {
    //         expect(document.querySelector('.e-dialog') !== undefined).toBe(true);
    //         done();
    //     }, 500);
    // });
    it('Delete operation', (done: Function) => {
        var treeObj: any = (document.getElementById("file_tree") as any).ej2_instances[0];
        let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
        mouseEventArgs.target = li[1].querySelector('.e-fullrow');
        treeObj.touchClickObj.tap(tapEvent);
        keyboardEventArgs.action = 'del';
        keyboardEventArgs.target = li[2];
        (feObj.navigationpaneModule as any).keyDown(keyboardEventArgs);
        setTimeout(function () {
            let okBtn: any = document.getElementsByClassName('e-control e-btn e-primary');
            okBtn[0].click();
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data7)
            });
            setTimeout(function () {
                let activeLi: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
                expect(activeLi[0].querySelectorAll('[data-uid="filecontent/employees/documents/"]').length).toBe(0);
                done();
            }, 500);
        }, 500);
    });
});

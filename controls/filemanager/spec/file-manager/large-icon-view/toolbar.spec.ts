/**
 * FileManager spec document
 */
import { FileManager } from '../../../src/file-manager/base/file-manager';
import { NavigationPane } from '../../../src/file-manager/layout/navigation-pane';
import { DetailsView } from '../../../src/file-manager/layout/details-view';
import { Toolbar } from '../../../src/file-manager/actions/toolbar';
import { createElement } from '@syncfusion/ej2-base';
import { data1, folderRename, dataSortbySize, data4, data5, data6, rename, dataDelete, accessData1, accessDetails1, accessDetails2, accessData5, accessData4, accessData6, accessData7, getMultipleDetails, data5rename, rename1 } from '../data';
import { extend } from '@syncfusion/ej2-grids';
import { isNullOrUndefined } from '@syncfusion/ej2-base';

FileManager.Inject(Toolbar, NavigationPane, DetailsView);

function eventObject(eventType: string, eventName: string): Object {
    let tempEvent: any = document.createEvent(eventType);
    tempEvent.initEvent(eventName, true, true);
    let returnObject: any = extend({}, tempEvent);
    returnObject.preventDefault = () => { return true; };
    return returnObject;
}

describe('FileManager control LargeIcons view', () => {
    describe('toolbar items testing', () => {
        let mouseEventArgs: any, tapEvent: any;
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
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
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
        it('mouse click on create new folder & rename button', (done: Function) => {
            //create new folder
            let items: any = document.getElementsByClassName('e-toolbar-item');
            items[0].click();
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
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data5)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                let li1: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
                expect(li1.length).toEqual(6);
                expect(document.getElementById('file_largeicons').querySelectorAll('li').length).toEqual(6);
                expect(document.getElementById('file_largeicons').querySelectorAll('li')[4].classList.contains('e-active')).toBe(true);
                let items: any = document.getElementsByClassName('e-fe-rename');
                items[0].click();
                let nli: any = document.getElementById('file_tree').querySelectorAll('li');
                let ntr: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-text');
                let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                expect(nli.length).toEqual(6);
                expect(ntr.length).toEqual(6);
                expect(nar.length).toEqual(1);
                expect(ntr[4].textContent).toBe("New folder");
                (<HTMLInputElement>document.getElementById('rename')).value = "My Folder";
                (<HTMLElement>document.getElementById('file_dialog').querySelectorAll('.e-btn')[1]).click();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(folderRename)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data5rename)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    let nli: any = document.getElementById('file_tree').querySelectorAll('li');
                    let ntr: any = document.getElementById('file_largeicons').querySelectorAll('.e-list-text');
                    let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                    expect(nli.length).toEqual(6);
                    expect(ntr.length).toEqual(6);
                    expect(nar.length).toEqual(1);
                    expect(ntr[3].textContent).toBe("My Folder");
                    expect(nli[5].textContent).toBe("My Folder")
                    done();
                }, 500);
            }, 500);
        });
        it('mouse click on create new folder button', (done: Function) => {
            //create new folder
            let items: any = document.getElementsByClassName('e-toolbar-item');
            items[0].click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
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
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(data5)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    let li1: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
                    expect(li1.length).toEqual(6);
                    expect(document.getElementById('file_largeicons').querySelectorAll('li').length).toEqual(6);
                    expect(document.getElementById('file_largeicons').querySelectorAll('li')[4].classList.contains('e-active')).toBe(true);
                    //create new folder with exisiting name
                    items[0].click();
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect((document.getElementById('file_dialog').querySelector('#newname') as any).value).toEqual("");
                        let ele: HTMLInputElement = document.getElementById('file_dialog').querySelector('#newname') as HTMLInputElement;
                        (document.getElementById('file_dialog').querySelectorAll('.e-btn')[1] as HTMLElement).click();
                        //expect(ele.parentElement.nextElementSibling.textContent).toEqual('The file or folder name cannot be empty.');
                        ele.value = "New folder";
                        (document.getElementById('file_dialog').querySelectorAll('.e-btn')[1] as HTMLElement).click();
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                        setTimeout(function () {
                            this.request = jasmine.Ajax.requests.mostRecent();
                            this.request.respondWith({
                                status: 200,
                                responseText: JSON.stringify(data6)
                            });
                            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                            setTimeout(function () {
                                let li2: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
                                expect(li2.length).toEqual(6);
                                expect(document.getElementById('file_largeicons').querySelectorAll('li').length).toEqual(6);
                                expect(document.getElementById('file_dialog').querySelector('.e-dlg-header').textContent).toEqual("Error");
                                (document.getElementById('file_dialog').querySelectorAll('.e-btn')[1] as HTMLElement).click();
                                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                                setTimeout(function () {
                                    //cancel the create folder dialog
                                    items[0].click();
                                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                                    setTimeout(function () {
                                        expect((document.getElementById('file_dialog').querySelector('#newname') as any).value).toEqual("");
                                        let ele: HTMLInputElement = document.getElementById('file_dialog').querySelector('#newname') as HTMLInputElement;
                                        ele.value = "New folder";
                                        (feObj as any).dialogObj.hide();
                                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                                        setTimeout(function () {
                                            let li3: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
                                            expect(li3.length).toEqual(6);
                                            expect(document.getElementById('file_largeicons').querySelectorAll('li').length).toEqual(6);
                                            items[0].click();
                                            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                                            setTimeout(function () {
                                                expect((document.getElementById('file_dialog').querySelector('#newname') as any).value).toEqual("");
                                                let ele: HTMLInputElement = document.getElementById('file_dialog').querySelector('#newname') as HTMLInputElement;
                                                ele.value = "New folder*";
                                                var inputEvent = new Event('input', { 'bubbles': true, 'cancelable': true });
                                                ele.dispatchEvent(inputEvent);
                                                expect(ele.parentElement.nextElementSibling.textContent).toEqual('The file or folder name "New folder*" contains invalid characters. Please use a different name. Valid file or folder names cannot end with a dot or space, and cannot contain any of the following characters: \\/:*?\"<>|');
                                                ele.onkeyup({ 'bubbles': true, 'cancelable': true, ctrlKey: true, which: 83 } as any);
                                                ele.onkeyup({ 'bubbles': true, 'cancelable': true, ctrlKey: true, charCode: 83 } as any);
                                                ele.value = "New folders";
                                                var inputEvent = new Event('input', { 'bubbles': true, 'cancelable': true });
                                                ele.dispatchEvent(inputEvent);
                                                ele.onkeyup({ 'bubbles': true, 'cancelable': true, ctrlKey: true, keyCode: 13, key: 'Enter', which: 13 } as any);
                                                this.request = jasmine.Ajax.requests.mostRecent();
                                                this.request.respondWith({
                                                    status: 200,
                                                    responseText: JSON.stringify(data4)
                                                });
                                                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                                                this.request = jasmine.Ajax.requests.mostRecent();
                                                this.request.respondWith({
                                                    status: 200,
                                                    responseText: JSON.stringify(data5)
                                                });
                                                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                                                setTimeout(function () {
                                                    let li1: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('file_tree').querySelectorAll('li');
                                                    expect(li1.length).toEqual(6);
                                                    expect(document.getElementById('file_largeicons').querySelectorAll('li').length).toEqual(6);
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
        });
        it('mouse click on refresh button', (done: Function) => {
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
            let items: any = document.getElementsByClassName('e-fe-refresh');
            items[0].click();
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
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

        it('Multiple folder get details', (done: Function) => {
            (<FileManager>feObj).selectedItems = ['Documents', 'Employees'];
            let items: any = document.getElementById('file_tb_details');
            items.click();
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(getMultipleDetails)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                expect(document.getElementById('file_dialog_title').textContent).toBe('Documents, Employees');
                expect((<any>document.querySelectorAll('.e-fe-value')[0]).textContent).toBe('Folder');
                done();
            }, 500);
        });

        it('mouse click on new  button', (done: Function) => {
            let items: any = document.getElementsByClassName('e-fe-newfolder');
            items[0].click();
            (<HTMLInputElement>document.getElementById('newname')).value = "New Folder";
            (<HTMLElement>document.getElementById('file_dialog').querySelectorAll('.e-btn')[1]).click();
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data5)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                let nli: any = document.getElementById('file_tree').querySelectorAll('li');
                let ntr: any = document.getElementById('file_largeicons').querySelectorAll('li');
                let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                expect(nli.length).toEqual(6);
                expect(ntr.length).toEqual(6);
                expect(nar.length).toEqual(1);
                expect(ntr[1].classList.contains('e-active')).toBe(false);
                expect(ntr[1].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
                expect(ntr[2].classList.contains('e-active')).toBe(false);
                expect(ntr[2].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
                done();
            }, 500);
        });
        it('mouse click on delete button', (done: Function) => {
            let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            mouseEventArgs.target = li[0];
            mouseEventArgs.ctrlKey = true;
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            let items: any = document.getElementsByClassName('e-fe-delete');
            items[0].click();
            (<HTMLElement>document.getElementById('file_dialog').querySelectorAll('.e-btn')[1]).click();
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(dataDelete)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                let nli: any = document.getElementById('file_tree').querySelectorAll('li');
                let ntr: any = document.getElementById('file_largeicons').querySelectorAll('li');
                let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                expect(nli.length).toEqual(4);
                expect(ntr.length).toEqual(4);
                expect(nar.length).toEqual(1);
                expect(ntr[1].classList.contains('e-active')).toBe(false);
                expect(ntr[1].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
                expect(ntr[2].classList.contains('e-active')).toBe(false);
                expect(ntr[2].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
                done();
            }, 500);
        });
        it('mouse click on sortby button', (done: Function) => {
            // let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
            // mouseEventArgs.target = li[0];
            // mouseEventArgs.ctrlKey = true;
            // feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            let items: any = document.getElementById('file_tb_sortby');
            items.click();
            let size: any = document.getElementById('file_ddl_size');
            size.click();
            // (<HTMLElement>document.getElementById('file_dialog').querySelectorAll('.e-btn')[1]).click();
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(dataSortbySize)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                let nli: any = document.getElementById('file_tree').querySelectorAll('li');
                let ntr: any = document.getElementById('file_largeicons').querySelectorAll('li');
                let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                // expect(nli.length).toEqual(4);
                // expect(ntr.length).toEqual(4);
                expect(nar.length).toEqual(1);
                expect(ntr[0].textContent).toBe("Food");
                expect(ntr[1].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
                expect(ntr[2].classList.contains('e-active')).toBe(false);
                expect(ntr[2].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
                done();
            }, 500);
        });
        // it('mouse click on view button', (done: Function) => {
        //     let items: any = document.getElementById('file_tb_view');
        //     items.click();
        //     let size: any = document.getElementById('file_ddl_details');
        //     size.click();
        //     this.request = jasmine.Ajax.requests.mostRecent();
        //     this.request.respondWith({
        //         status: 200,
        //         responseText: JSON.stringify(data1)
        //     });
        //     jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //     setTimeout(function () {
        //         let nli: any = document.getElementById('file_tree').querySelectorAll('li');
        //         let ntr: any = document.getElementById('file_largeicons').querySelectorAll('li');
        //         let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
        //         expect(nli.length).toEqual(5);
        //         expect(ntr.length).toEqual(5);
        //         expect(nar.length).toEqual(1);
        //         expect(document.getElementById('file_grid').offsetWidth != 0).toEqual(true);
        //         expect(document.getElementById('file_largeicons').offsetWidth == 0).toEqual(true);
        //         expect(ntr[0].textContent).toBe("Documents");
        //         expect(ntr[1].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
        //         expect(ntr[2].classList.contains('e-active')).toBe(false);
        //         expect(ntr[2].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
        //         let items: any = document.getElementById('file_tb_view');
        //         items.click();
        //         let size: any = document.getElementById('file_ddl_large');
        //         size.click();
        //         this.request = jasmine.Ajax.requests.mostRecent();
        //         this.request.respondWith({
        //             status: 200,
        //             responseText: JSON.stringify(data1)
        //         });
        //         setTimeout(function () {
        //             let nli: any = document.getElementById('file_tree').querySelectorAll('li');
        //             let ntr: any = document.getElementById('file_largeicons').querySelectorAll('li');
        //             let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
        //             expect(nli.length).toEqual(5);
        //             expect(ntr.length).toEqual(5);
        //             expect(nar.length).toEqual(1);
        //             expect(document.getElementById('file_largeicons').offsetWidth != 0).toEqual(true);
        //             expect(document.getElementById('file_grid').offsetWidth == 0).toEqual(true);

        //         }, 500);
        //     }, 500);
        // });
        // it('mouse click on  info button', (done: Function) => {
        //     let items: any = document.getElementById('file_tb_details');
        //     items.click();
        //     this.request = jasmine.Ajax.requests.mostRecent();
        //     this.request.respondWith({
        //         status: 200,
        //         responseText: JSON.stringify(getSingleDetails)
        //     });
        //     jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //     setTimeout(function () {
        //         expect(document.getElementById('file_dialog_title').textContent).toBe('FileContent')
        //         expect((<any>document.querySelectorAll('.e-fe-value')[0]).textContent).toBe('Folder')
        //         // expect((<any>document.querySelectorAll('.e-fe-value')[1]).textContent).toBe('0')
        //         expect((<any>document.querySelectorAll('.e-fe-value')[2]).textContent).toBe('/FileContent')
        //         expect((<any>document.querySelectorAll('.e-fe-value')[3]).textContent).toBe('October 16, 2018 19:43:17')
        //         let lgli: any = document.getElementById('file_largeicons').querySelectorAll('li');
        //         mouseEventArgs.target = lgli[1];
        //         feObj.largeiconsviewModule.clickObj.tap(tapEvent);
        //         let items: any = document.getElementById('file_tb_details');
        //         items.click();
        //         this.request = jasmine.Ajax.requests.mostRecent();
        //         this.request.respondWith({
        //             status: 200,
        //             responseText: JSON.stringify(singleSelectionDetails)
        //         });
        //         setTimeout(function () {
        //             expect(document.getElementById('file_dialog_title').textContent).toBe('Documents')
        //             expect(document.querySelectorAll('.e-fe-value').length).toBe(4)
        //             expect((<any>document.querySelectorAll('.e-fe-value')[0]).textContent).toBe('Folder')
        //             // expect((<any>document.querySelectorAll('.e-fe-value')[1]).textContent).toBe('0')
        //             expect((<any>document.querySelectorAll('.e-fe-value')[2]).textContent).toBe('/Documents')
        //             expect((<any>document.querySelectorAll('.e-fe-value')[3]).textContent).toBe('October 16, 2018 19:43:17')
        //             let nli: any = document.getElementById('file_tree').querySelectorAll('li');
        //             let ntr: any = document.getElementById('file_largeicons').querySelectorAll('li');
        //             let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
        //             expect(nli.length).toEqual(5);
        //             expect(ntr.length).toEqual(5);
        //             expect(nar.length).toEqual(1);
        //             expect(document.getElementById('file_largeicons').offsetWidth != 0).toEqual(true);
        //             // expect(document.getElementById('file_grid').offsetWidth == 0).toEqual(true);
        //         }, 500);
        //     }, 500);
        // });

        // it('mouse click on download button', (done: Function) => {
        //     let li: any = document.getElementById('file_largeicons').querySelectorAll('li');
        //     mouseEventArgs.target = li[0];
        //     mouseEventArgs.ctrlKey = true;
        //     feObj.largeiconsviewModule.clickObj.tap(tapEvent);
        //     let items: any = document.getElementsByClassName('e-fe-download');
        //     items[0].click();
        //     (<HTMLElement>document.getElementById('file_dialog').querySelectorAll('.e-btn')[1]).click();
        //     this.request = jasmine.Ajax.requests.mostRecent();
        //     this.request.respondWith({
        //         status: 200,
        //         responseText: JSON.stringify(data1)
        //     });
        //     jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

        //     setTimeout(function () {
        //         let nli: any = document.getElementById('file_tree').querySelectorAll('li');
        //         let ntr: any = document.getElementById('file_largeicons').querySelectorAll('li');
        //         let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
        //         expect(nli.length).toEqual(4);
        //         expect(ntr.length).toEqual(4);
        //         expect(nar.length).toEqual(1);
        //         expect(ntr[1].classList.contains('e-active')).toBe(false);
        //         expect(ntr[1].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
        //         expect(ntr[2].classList.contains('e-active')).toBe(false);
        //         expect(ntr[2].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
        //         done();
        //     }, 500);
        // });

        it('mouse click on rename button', (done: Function) => {
            let lgli: any = document.getElementById('file_largeicons').querySelectorAll('li');
            mouseEventArgs.target = lgli[1];
            feObj.largeiconsviewModule.clickObj.tap(tapEvent);
            let items: any = document.getElementsByClassName('e-fe-rename');
            items[0].click();
            let nli: any = document.getElementById('file_tree').querySelectorAll('li');
            let ntr: any = document.getElementById('file_largeicons').querySelectorAll('li');
            let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
            expect(nli.length).toEqual(5);
            expect(ntr.length).toEqual(5);
            expect(nar.length).toEqual(1);
            expect(ntr[1].textContent).toBe("Employees");
            (<HTMLInputElement>document.getElementById('rename')).value = "My Folder";
            (<HTMLElement>document.getElementById('file_dialog').querySelectorAll('.e-btn')[1]).click();
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(folderRename)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(rename1)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                let nli: any = document.getElementById('file_tree').querySelectorAll('li');
                let ntr: any = document.getElementById('file_largeicons').querySelectorAll('li');
                let nar: any = document.getElementsByClassName('e-addressbar-ul')[0].querySelectorAll('li');
                expect(nli.length).toEqual(5);
                expect(ntr.length).toEqual(5);
                expect(nar.length).toEqual(1);
                expect(ntr[2].textContent).toBe("My Folder");
                expect(nli[2].textContent).toBe("My Folder");
                expect(ntr[1].classList.contains('e-active')).toBe(false);
                done();
            }, 500);
        });
    });
    describe('access control toolbar items testing', () => {
        let feObj: any;
        let ele: HTMLElement;
        let originalTimeout: any;
        let mouseEventArgs: any, tapEvent: any;
        beforeEach((): void => {
            jasmine.Ajax.install();
            feObj = undefined;
            ele = createElement('div', { id: 'file' });
            document.body.appendChild(ele);
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
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
        it('mouse click on new folder button', (done: Function) => {
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
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
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
                document.getElementById('file_tb_newfolder').click();
                let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerHTML).toEqual("Access Denied");
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
        it('mouse click on new folder button with access', (done: Function) => {
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
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
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
                document.getElementById('file_tb_newfolder').click();
                let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerHTML).toEqual("Folder");
                done();
            }, 500);
        });
        it('Toolbar button trimmed test', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
                ajaxSettings: {
                    url: '/FileAccessOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                //Custom item added along with default item
                toolbarSettings: { items: ['NewFolder ', ' Custom ', 'Upload', ' Delete ', 'Download', 'Rename', 'SortBy', 'Refresh', 'Selection', 'View', 'Details'] }
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(accessData5)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                let newFolderEle: any = document.querySelector('.e-toolbar-items #file_tb_newfolder .e-tbar-btn-text');
                expect(newFolderEle.innerText).toBe('New folder');
                expect(newFolderEle.parentElement.parentElement.getAttribute('title')).toBe('New folder');
                let customEle: any = document.querySelector('.e-toolbar-items #file_tb_custom .e-tbar-btn-text');
                expect(customEle.innerText).toBe('Custom');
                expect(customEle.parentElement.parentElement.getAttribute('title')).toBe('Tooltip-Custom');
                let delEle: any = document.querySelector('.e-toolbar-items #file_tb_delete .e-tbar-btn-text');
                expect(delEle.innerText).toBe('Delete');
                expect(delEle.parentElement.parentElement.getAttribute('title')).toBe('Delete');
                done();
            }, 500);
        });
        it('mouse click on upload button', (done: Function) => {
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
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
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
                document.getElementById('file_tb_upload').click();
                let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerHTML).toEqual("Access Denied");
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
        it('mouse click on upload button with access', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
                ajaxSettings: {
                    url: '/FileAccessOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                uploadSettings: { autoUpload: false }
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(accessData1)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
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
                document.getElementById('file_tb_upload').click();
                let fileObj: File = new File(["Nice One"], "sample.txt", { lastModified: 0, type: "overide/mimetype" })
                let eventArgs: any = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
                let uploadObj: any = document.querySelector('#file_upload');
                uploadObj.ej2_instances[0].onSelectFiles(eventArgs);
                let dialogObj: any = (document.getElementById("file_upload_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerHTML).toEqual("Upload Files");
                done();
            }, 500);
        });

        it('enter key on toolbar buttons with access', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
                ajaxSettings: {
                    url: '/FileAccessOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
                uploadSettings: { autoUpload: false }
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(accessData1)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
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
                document.getElementById('file_tb_upload').onkeyup({ keyCode: 13, key: 'Enter', target: document.getElementById('file_tb_upload') } as any);
                let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerHTML).toEqual("Access Denied");
                expect(dialogObj.visible).toBe(true);
                (<HTMLElement>document.getElementById('file_dialog').querySelector(".e-footer-content .e-primary.e-flat")).onkeyup({ keyCode: 13, key: 'Enter' } as any);
                dialogObj = (document.getElementById("file_dialog") as any).ej2_instances[0];
                expect(dialogObj.visible).toBe(false);
                expect(document.getElementById('file_tb_download').parentElement.classList.contains('e-hidden')).toBe(true);
                mouseEventArgs.target = largeLi[1];
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                expect(document.getElementById('file_tb_download').parentElement.classList.contains('e-hidden')).toBe(false);
                document.getElementById('file_tb_download').onkeyup({ keyCode: 13, key: 'Enter', target: document.getElementById('file_tb_download') } as any);
                expect(dialogObj.visible).toBe(true);
                (<HTMLElement>document.getElementById('file_dialog').querySelector(".e-footer-content .e-primary.e-flat")).onkeyup({ keyCode: 13, key: 'Enter' } as any);
                expect(dialogObj.visible).toBe(false);
                mouseEventArgs.target = largeLi[1];
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                let keyboardEventArgs: any = {
                    preventDefault: (): void => { },
                    action: 'enter',
                    target: largeLi[1],
                    stopImmediatePropagation: (): void => { },
                };
                feObj.largeiconsviewModule.keyActionHandler(keyboardEventArgs);
                expect(dialogObj.visible).toBe(true);
                expect(dialogObj.element.querySelector('.e-dlg-header').innerHTML).toEqual("Access Denied");
                done();
            }, 500);
        });

        it('mouse click on refresh button', (done: Function) => {
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
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
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
                document.getElementById('file_tb_refresh').click();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(accessData1)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
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
        it('mouse click on rename button', (done: Function) => {
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
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
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
                document.getElementById('file_tb_rename').click();
                let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerHTML).toEqual("Access Denied");
                done();
            }, 500);
        });
        it('mouse click on rename button with access', (done: Function) => {
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
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
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
                document.getElementById('file_tb_rename').click();
                let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerHTML).toEqual("Rename");
                done();
            }, 500);
        });
        it('mouse click on delete button', (done: Function) => {
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
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
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
                document.getElementById('file_tb_delete').click();
                let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerHTML).toEqual("Access Denied");
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
        it('mouse click on delete button with access', (done: Function) => {
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
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
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
                document.getElementById('file_tb_delete').click();
                let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerHTML).toEqual("Delete File");
                done();
            }, 500);
        });
        it('mouse click on download button', (done: Function) => {
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
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
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
                document.getElementById('file_tb_download').click();
                let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerHTML).toEqual("Access Denied");
                done();
            }, 500);
        });
        it('mouse click on details button', (done: Function) => {
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
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
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
                document.getElementById('file_tb_details').click();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(accessDetails1)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                    expect(dialogObj.element.querySelector('.e-dlg-header').innerHTML).toEqual("Downloads");
                    expect(dialogObj.element.querySelectorAll('td')[8].innerHTML).toEqual("Permission");
                    done();
                }, 500);
            }, 500);
        });
        it('mouse click on cut and paste button', (done: Function) => {
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
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
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
                mouseEventArgs.target = largeLi[8];
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                document.getElementById('file_tb_cut').click();
                mouseEventArgs.target = treeLi[3].querySelector('.e-fullrow');
                treeObj.touchClickObj.tap(tapEvent);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(accessData4)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    document.getElementById('file_tb_paste').click();
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify(accessData6)
                    });
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                        expect(dialogObj.element.querySelector('.e-dlg-header').innerHTML).toEqual("Access Denied");
                        done();
                    }, 400);
                }, 500);
            }, 500);
        });
        it('mouse click on copy and paste button', (done: Function) => {
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
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
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
                mouseEventArgs.target = largeLi[4];
                feObj.largeiconsviewModule.clickObj.tap(tapEvent);
                document.getElementById('file_tb_cut').click();
                mouseEventArgs.target = treeLi[3].querySelector('.e-fullrow');
                treeObj.touchClickObj.tap(tapEvent);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(accessData4)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    document.getElementById('file_tb_paste').click();
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify(accessData7)
                    });
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                        expect(dialogObj.element.querySelector('.e-dlg-header').innerHTML).toEqual("Access Denied");
                        done();
                    }, 400);
                }, 500);
            }, 500);
        });
        it('mouse click on delete button with two items selected', (done: Function) => {
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
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
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
                document.getElementById('file_tb_delete').click();
                let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerHTML).toEqual("Access Denied");
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
        it('mouse click on download button with two items selected', (done: Function) => {
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
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
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
                document.getElementById('file_tb_download').click();
                let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                expect(dialogObj.element.querySelector('.e-dlg-header').innerHTML).toEqual("Access Denied");
                done();
            }, 500);
        });
        it('mouse click on details button with two items selected', (done: Function) => {
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
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
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
                document.getElementById('file_tb_details').click();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify(accessDetails2)
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    let dialogObj: any = (document.getElementById("file_dialog") as any).ej2_instances[0];
                    expect(dialogObj.element.querySelector('.e-dlg-header').innerHTML).toEqual("Downloads, Music.png");
                    done();
                }, 500);
            }, 500);
        });
    });
    describe('Large icons sorting testing', () => {
        let feObj: FileManager;
        let ele: HTMLElement;
        let originalTimeout: any;
        let mouseEventArgs: any, tapEvent: any, count: any;
        beforeEach((): void => {
            jasmine.Ajax.install();
            feObj = undefined;
            count = 0;
            ele = createElement('div', { id: 'file' });
            document.body.appendChild(ele);
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
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
        it('mouse click on sortby', (done: Function) => {
            feObj = new FileManager({
                view: 'LargeIcons',
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                beforeSend: (args: any) => {
                    if (!isNullOrUndefined(args.ajaxSettings.data)) {
                        count++;
                    }
                }
            });
            feObj.appendTo('#file');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                let items: any = document.getElementById('file_tb_sortby');
                items.click();
                let size: any = document.getElementById('file_ddl_size');
                size.click();
                expect(count).toBe(2);
                done();
            }, 400);
        });
    });
});

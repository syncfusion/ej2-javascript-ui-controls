import { createElement } from '@syncfusion/ej2-base';
import { DropDownTree, DdtFilteringEventArgs } from '../../../src/drop-down-tree/drop-down-tree';
import { DataManager } from '@syncfusion/ej2-data';
import { remoteData2,filteredremoteData2 } from '../dataSource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

xdescribe('filter remote data testing ', () => {
    let ddtreeObj: any;
    let mouseEventArgs: any;
    let tapEvent: any;
    let originalTimeout: any;
    let ele: HTMLInputElement;    
    let dataManager1: DataManager = new DataManager({ url: '/TreeView/remoteData' });
    beforeEach((): void => {
        jasmine.Ajax.install();
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
        ddtreeObj = undefined;
        ele = <HTMLInputElement>createElement('input', { id: 'ddtree' });
        document.body.appendChild(ele);
    });
    afterEach((): void => {
        if (ddtreeObj)
            ddtreeObj.destroy();
            ddtreeObj = undefined
        ele.remove();
        document.body.innerHTML = '';
        jasmine.Ajax.uninstall();
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });
    it('filter with checkbox', (done) => {
        ddtreeObj = new DropDownTree({
            fields: { dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild", 
                child: {value:"subId",text:"subText",hasChildren:"subHasChild"}
            },
            allowFiltering: true,
            treeSettings: { loadOnDemand: true },
            showCheckBox: true,
            filterType: 'Contains'
        }, '#ddtree');
        this.request = jasmine.Ajax.requests.mostRecent();
        this.request.respondWith({
            status: 200,
            responseText: JSON.stringify({ d: remoteData2, __count: 2 })
        });
        setTimeout(function () {
            ddtreeObj.showPopup();
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter_wrap').length).toBe(1);
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter').length).toBe(1);
            expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(2);
            let filterEle: any = ddtreeObj.popupObj.element.querySelector('#' + ddtreeObj.element.id + "_filter");
            let filterObj: any = filterEle.ej2_instances[0];
            filterEle.value = 'j';
            filterObj.value = 'j';
            let eventArgs: any = { value: 'j', container: filterEle };
            filterObj.input(eventArgs);
            setTimeout(function () {
                expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(2);
                expect((ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item .e-frame')[0].parentElement.parentElement as HTMLElement).innerText).toBe("Music");
                expect((ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item .e-frame')[1].parentElement.parentElement as HTMLElement).innerText).toBe("Downloads");
                let li: Element[] = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
                let checkEle: Element = li[0].querySelector('.e-checkbox-wrapper');
                let e: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                checkEle.querySelector('.e-frame').dispatchEvent(e);
                expect(checkEle.getAttribute('aria-checked')).toBe('true');
                expect(ddtreeObj.value.length).toBe(1);
                expect(ddtreeObj.value.indexOf('01') !== -1).toBe(true);
                filterEle.value = '';
                filterObj.value = '';
                eventArgs = { value: '', container: filterEle };
                filterObj.input(eventArgs);
                setTimeout(function () {
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify({ d: remoteData2, __count: 2 })
                    });
                    setTimeout(function () {
                        expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(2);
                        expect(ddtreeObj.treeObj.checkedNodes.length).toBe(1);
                        expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item .e-frame.e-check').length).toBe(1);
                        expect((ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item .e-frame.e-check')[0].parentElement.parentElement as HTMLElement).innerText).toBe("Music");
                        expect((ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item .e-frame')[1].parentElement.parentElement as HTMLElement).innerText).toBe("Downloads");
                        expect(document.querySelectorAll('.e-chips-wrapper .e-chipcontent').length).toBe(1);
                        expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[0] as HTMLElement).innerText).toBe("Music");
                        expect(ddtreeObj.treeObj.checkedNodes.indexOf('01') !== -1).toBe(true);
                        done();
                    },100);
                },350);
            },350);
        },100);
    });
    it('filter with selectall', (done) => {        
        ddtreeObj = new DropDownTree({
            fields: { dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild", 
                child: {value:"subId",text:"subText",hasChildren:"subHasChild"}
            },
            allowFiltering: true,
            showSelectAll:true,
            treeSettings: { loadOnDemand: true },
            showCheckBox: true,
            filterType: 'Contains'
        }, '#ddtree');
        this.request = jasmine.Ajax.requests.mostRecent();
        this.request.respondWith({
            status: 200,
            responseText: JSON.stringify({ d: remoteData2, __count: 2 })
        });
        setTimeout(function () {
            ddtreeObj.showPopup();
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter_wrap').length).toBe(1);
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter').length).toBe(1);
            expect(document.querySelector('.e-selectall-parent').classList.contains('e-hide-selectall')).toBe(false);
            expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(2);
            let filterEle: any = ddtreeObj.popupObj.element.querySelector('#' + ddtreeObj.element.id + "_filter");
            let filterObj: any = filterEle.ej2_instances[0];
            filterEle.value = 'j';
            filterObj.value = 'j';
            let eventArgs: any = { value: 'j', container: filterEle };
            filterObj.input(eventArgs);
            setTimeout(function () {
                expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(2);
                expect(document.querySelector('.e-selectall-parent').classList.contains('e-hide-selectall')).toBe(true);
                filterEle.value = '';
                filterObj.value = '';
                eventArgs = { value: '', container: filterEle };
                filterObj.input(eventArgs);
                setTimeout(function () {
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify({ d: remoteData2, __count: 2 })
                    });
                    setTimeout(function () {
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(2);
                    expect(document.querySelector('.e-selectall-parent').classList.contains('e-hide-selectall')).toBe(false);
                    done();
                },100);
                },350);
            },350);
        },100);
    });
    it('filter with selectall and preventDefault', (done) => {       
        ddtreeObj = new DropDownTree({
            fields: { dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild", 
                child: {value:"subId",text:"subText",hasChildren:"subHasChild"}
            },
            allowFiltering: true,
            showSelectAll:true,
            treeSettings: { loadOnDemand: true },
            showCheckBox: true,
            filtering : (args:DdtFilteringEventArgs)=>{
                args.preventDefaultAction = true;
                args.fields.dataSource = filteredremoteData2;
            },
            filterType: 'Contains'
        }, '#ddtree');
        this.request = jasmine.Ajax.requests.mostRecent();
        this.request.respondWith({
            status: 200,
            responseText: JSON.stringify({ d: remoteData2, __count: 2 })
        });
        setTimeout(function () {
            ddtreeObj.showPopup();
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter_wrap').length).toBe(1);
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter').length).toBe(1);
            expect(document.querySelector('.e-selectall-parent').classList.contains('e-hide-selectall')).toBe(false);
            expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(2);
            expect((ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item .e-frame')[0].parentElement.parentElement as HTMLElement).innerText).toBe("Music");
            expect((ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item .e-frame')[1].parentElement.parentElement as HTMLElement).innerText).toBe("Downloads");
            let filterEle: any = ddtreeObj.popupObj.element.querySelector('#' + ddtreeObj.element.id + "_filter");
            let filterObj: any = filterEle.ej2_instances[0];
            filterEle.value = 'j';
            filterObj.value = 'j';
            let eventArgs: any = { value: 'j', container: filterEle };
            filterObj.input(eventArgs);
            setTimeout(function () {
                expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(1);
                expect(document.querySelector('.e-selectall-parent').classList.contains('e-hide-selectall')).toBe(true);
                expect((ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item .e-frame')[0].parentElement.parentElement as HTMLElement).innerText).toBe("Music");
                filterEle.value = '';
                filterObj.value = '';
                eventArgs = { value: '', container: filterEle };
                filterObj.input(eventArgs);
                setTimeout(function () {
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify({ d: remoteData2, __count: 2 })
                    });
                    setTimeout(function () {
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(2);
                    expect(document.querySelector('.e-selectall-parent').classList.contains('e-hide-selectall')).toBe(false);
                    expect((ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item .e-frame')[0].parentElement.parentElement as HTMLElement).innerText).toBe("Music");
                    expect((ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item .e-frame')[1].parentElement.parentElement as HTMLElement).innerText).toBe("Downloads");
                    done();
                    },100);
                },350);
            },350);
        },100);
    });
    it('filter with selectall and cancel', (done) => {        
        ddtreeObj = new DropDownTree({
            fields: { dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild", 
                child: {value:"subId",text:"subText",hasChildren:"subHasChild"}
            },
            allowFiltering: true,
            showSelectAll:true,
            treeSettings: { loadOnDemand: true },
            showCheckBox: true,
            filtering : (args:DdtFilteringEventArgs)=>{
                args.cancel = true;
            },
            filterType: 'Contains'
        }, '#ddtree');
        this.request = jasmine.Ajax.requests.mostRecent();
        this.request.respondWith({
            status: 200,
            responseText: JSON.stringify({ d: remoteData2, __count: 2 })
        });
        setTimeout(function () {
            ddtreeObj.showPopup();
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter_wrap').length).toBe(1);
            expect(document.querySelectorAll('#' + ddtreeObj.element.id + '_filter').length).toBe(1);
            expect(document.querySelector('.e-selectall-parent').classList.contains('e-hide-selectall')).toBe(false);
            expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(2);
            expect((ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item .e-frame')[0].parentElement.parentElement as HTMLElement).innerText).toBe("Music");
            expect((ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item .e-frame')[1].parentElement.parentElement as HTMLElement).innerText).toBe("Downloads");
            let filterEle: any = ddtreeObj.popupObj.element.querySelector('#' + ddtreeObj.element.id + "_filter");
            let filterObj: any = filterEle.ej2_instances[0];
            filterEle.value = 'j';
            filterObj.value = 'j';
            let eventArgs: any = { value: 'j', container: filterEle };
            filterObj.input(eventArgs);
            setTimeout(function () {
                expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(2);
                expect(document.querySelector('.e-selectall-parent').classList.contains('e-hide-selectall')).toBe(false);
                expect((ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item .e-frame')[0].parentElement.parentElement as HTMLElement).innerText).toBe("Music");
                expect((ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item .e-frame')[1].parentElement.parentElement as HTMLElement).innerText).toBe("Downloads");
                filterEle.value = '';
                filterObj.value = '';
                eventArgs = { value: '', container: filterEle };
                filterObj.input(eventArgs);
                setTimeout(function () {
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(2);
                    expect(document.querySelector('.e-selectall-parent').classList.contains('e-hide-selectall')).toBe(false);
                    expect((ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item .e-frame')[0].parentElement.parentElement as HTMLElement).innerText).toBe("Music");
                    expect((ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item .e-frame')[1].parentElement.parentElement as HTMLElement).innerText).toBe("Downloads");
                    done();
                },350);
            },350);
        },100);
    });
});

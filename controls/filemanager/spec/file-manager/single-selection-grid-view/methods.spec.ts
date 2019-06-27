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

describe('FileManager control single selection Grid view', () => {
    describe('methods testing', () => {
        let feObj: FileManager;
        let ele: HTMLElement, fmEle: HTMLElement;
        beforeEach(() => {
            jasmine.Ajax.install();
            ele = createElement('div', { id: 'file_wrap3', styles: "display: none" });
            document.body.appendChild(ele);
            fmEle = createElement('div', { id: 'file3' });
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
                allowMultiSelection: false,
                ajaxSettings: {
                    url: '/FileOperations',
                    uploadUrl: '/Upload', downloadUrl: '/Download', getImageUrl: '/GetImage'
                },
                showThumbnail: false,
            });
            feObj.appendTo("#file3");
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify(data1)
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                (document.getElementById('file_wrap3') as any).style = "display: block";
                expect((<any>document.getElementById("file3").getElementsByClassName('e-layout')[0]).style.height).toBe('0px');
                expect((<any>document.getElementById("file3").getElementsByClassName('e-content')[0]).style.height).toBe('0px');
                feObj.refreshLayout();
                expect((<any>document.getElementById("file3").getElementsByClassName('e-layout')[0]).style.height).not.toBe('0px');
                expect((<any>document.getElementById("file3").getElementsByClassName('e-content')[0]).style.height).not.toBe('0px');
                done();
            }, 400);
        });
    });
});
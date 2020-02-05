/**
 * Full screen spec
 */
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { RichTextEditor} from './../../../../src/index';
import { renderRTE, destroy } from './../../render.spec';

describe(' showFullScreen method  - ', () => {
    let rteObj: RichTextEditor;
    let onActionBegin: jasmine.Spy;
    let onActionComplete: jasmine.Spy;
    let controlId: string;
    beforeAll((done: Function) => {
        onActionBegin = jasmine.createSpy('onBegin');
        onActionComplete = jasmine.createSpy('OnComplete');
        rteObj = renderRTE({
            value: '<span id="rte">RTE</span>',
            actionComplete: onActionComplete,
            actionBegin: onActionBegin
        });
        controlId = rteObj.element.id;
        done();
    })
    afterAll((done: Function) => {
        destroy(rteObj);
        done();
    })
    it(' Test - trigger the actionBegin and actionComplete event', () => {
        rteObj.showFullScreen();
        expect(onActionBegin).toHaveBeenCalled();
        expect(onActionComplete).toHaveBeenCalled();
    });
    it(' Test - minimize element in full screen', () => {
        let minimizeEle: HTMLElement = rteObj.toolbarModule.baseToolbar.toolbarObj.element.querySelector('#' + controlId + "_toolbar_Minimize");
        expect(!isNullOrUndefined(minimizeEle)).toBe(true);
    });
});
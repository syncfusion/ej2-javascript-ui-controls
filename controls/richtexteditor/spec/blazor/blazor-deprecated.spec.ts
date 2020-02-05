/**
 * Blazor deprecated spec
 */
import { RichTextEditor } from '../../src/rich-text-editor/base/rich-text-editor';
import { renderRTE, destroy } from './../rich-text-editor/render.spec';

describe('RTE blazor coverage issues', () => {

    describe('BLAZ-232 - Ensure the deprecated Public methods, Event arguments for blazor', () => {
        let rteObj: RichTextEditor;
        let innerValue: string =
            `<img alt="Logo" src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" style="width: 300px; outline: rgb(74, 144, 226) solid 2px;" class="e-resize">`;
        beforeAll(() => {
            rteObj = renderRTE({
                value: innerValue
            });
        });
        it("Coverage for formatter", () => {
            (window as any).ejsInterop={ renderComplete:()=> {return true;}};
            (window as any).Blazor = null;
            rteObj.formatter.process(rteObj,null,new Event('keydown'));
            expect(Object.keys(window).indexOf('Blazor') >= 0).toBe(true);
            delete (window as any).Blazor;
            delete (window as any).ejsInterop;
        });

        it("Coverage for quicktoolbar - case 1", () => {
            (window as any).ejsInterop={ renderComplete:()=> {return true;}};
            (window as any).Blazor = null;
            (rteObj.quickToolbarModule as any).renderQuickToolbars();
            (rteObj.quickToolbarModule.imageQTBar as any).popupRenderer.quickToolbarOpen();
            expect(Object.keys(window).indexOf('Blazor') >= 0).toBe(true);
            delete (window as any).Blazor;
            delete (window as any).ejsInterop;
        });

        it("Coverage for quicktoolbar - case 2", () => {
            delete (window as any).ejsInterop;
            delete (window as any).Blazor;
            (rteObj.quickToolbarModule as any).renderQuickToolbars();   
            (rteObj.quickToolbarModule.imageQTBar as any).popupRenderer.quickToolbarOpen();
            expect(Object.keys(window).indexOf('Blazor') >= 0).toBe(false);
        });

        afterAll(() => {
            delete (window as any).Blazor;
            delete (window as any).ejsInterop;
            destroy(rteObj);
        });
    });
});

if(Object.keys(window).indexOf('Blazor') >= 0){
    delete (window as any).Blazor;
}
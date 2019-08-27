import { Toolbar, Table } from '../../src/rich-text-editor/index';
import { dispatchEvent } from '../../src/rich-text-editor/base/util';
import { RichTextEditor } from '../../src/rich-text-editor/base/rich-text-editor';
import { NodeSelection } from '../../src/selection/index';

import { renderRTE, destroy, setCursorPoint, dispatchEvent as dispatchEve } from './../rich-text-editor/render.spec';
import { createElement, L10n, isNullOrUndefined } from '@syncfusion/ej2-base';
import { QuickToolbar, MarkdownEditor, HtmlEditor, Link, Image } from "../../src/rich-text-editor/index";
import { Browser, detach, getUniqueID } from "@syncfusion/ej2-base";
import { FormValidator } from "@syncfusion/ej2-inputs";

RichTextEditor.Inject(MarkdownEditor);
RichTextEditor.Inject(HtmlEditor);

RichTextEditor.Inject(Toolbar, Table);
RichTextEditor.Inject(QuickToolbar, Link, Image);

describe('RTE blazor coverage issues', () => {


    describe('BLAZ-232 - Ensure the deprecated Public methods, Event arguments for blazor', () => {
        let rteObj: RichTextEditor;
        let innerValue: string =
            `<img alt="Logo" src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" style="width: 300px; outline: rgb(74, 144, 226) solid 2px;" class="e-resize">`;

        it("Coverage for formatter", () => {
            (window as any).Blazor = null;
            rteObj = renderRTE({
                value: innerValue
            });
            rteObj.formatter.process(rteObj,null,new Event('keydown'));
            expect(Object.keys(window).indexOf('Blazor') >= 0).toBe(true);
            delete (window as any).Blazor;
        });

        it("Coverage for quicktoolbar - case 1", () => {
            (window as any).Blazor = null;
            rteObj = renderRTE({
                value: innerValue
            });
            (rteObj.quickToolbarModule as any).renderQuickToolbars();
            (rteObj.quickToolbarModule.imageQTBar as any).popupRenderer.quickToolbarOpen();
            expect(Object.keys(window).indexOf('Blazor') >= 0).toBe(true);
            delete (window as any).Blazor;
        });

        it("Coverage for quicktoolbar - case 2", () => {
            delete (window as any).Blazor;
            rteObj = renderRTE({
                value: innerValue
            });
            (rteObj.quickToolbarModule as any).renderQuickToolbars();   
            (rteObj.quickToolbarModule.imageQTBar as any).popupRenderer.quickToolbarOpen();
            expect(Object.keys(window).indexOf('Blazor') >= 0).toBe(false);
        });

        afterEach(() => {
            delete (window as any).Blazor;
            rteObj.destroy();
        });
    });
});

if(Object.keys(window).indexOf('Blazor') >= 0){
    delete (window as any).Blazor;
}

/**
 * dialog spec document
 */
import { createElement, addClass, EmitType } from '@syncfusion/ej2-base'
import { Dialog, DialogUtility, BeforeCloseEventArgs } from '../../src/dialog/dialog';
import '../../node_modules/es6-promise/dist/es6-promise';
import { EventHandler, L10n } from '@syncfusion/ej2-base';
import { Touch, Browser, isNullOrUndefined } from '@syncfusion/ej2-base';

describe('Dialog blazor coverage issues', () => {


    describe('BLAZ-232 - Ensure the deprecated Public methods, Event arguments for blazor', () => {
        let dialog: any;
        
        beforeAll(() => {
            let ele: HTMLElement = createElement('div', { id: 'dialog1' });
            document.body.appendChild(ele);
            dialog = new Dialog({header:'Demo', content:'First demo content' });
            dialog.appendTo('#dialog1');
        });
        
        it("Coverage for dialog show", () => {
            (window as any).Blazor = null;
            dialog.show(true);
            expect(Object.keys(window).indexOf('Blazor') >= 0).toBe(true);
            delete (window as any).Blazor;
        });

        it("Coverage for Blazortemplate", () => {
            (window as any).Blazor = null;
            dialog.blazorTemplate("dialog1");
            dialog.blazorTemplate("dialog1footerTemplate");
            dialog.blazorTemplate("dialog1header");
            expect(Object.keys(window).indexOf('Blazor') >= 0).toBe(true);
            delete (window as any).Blazor;
        });

        afterAll(() => {
            delete (window as any).Blazor;
            dialog.destroy();
            document.body.innerHTML = '';
        });
    });
});

if(Object.keys(window).indexOf('Blazor') >= 0){
    delete (window as any).Blazor;
}
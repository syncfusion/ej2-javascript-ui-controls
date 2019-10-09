/**
 * dialog spec document
 */
import { createElement, addClass, EmitType } from '@syncfusion/ej2-base'
import { Dialog, DialogUtility, BeforeCloseEventArgs } from '../../src/dialog/dialog';
import '../../node_modules/es6-promise/dist/es6-promise';
import { EventHandler, L10n, enableBlazorMode, disableBlazorMode, isBlazor } from '@syncfusion/ej2-base';
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
            enableBlazorMode();
            dialog.show(true);
            expect(isBlazor()).toBe(true);
            disableBlazorMode();
        });

        it("Coverage for Blazortemplate", () => {
            enableBlazorMode();
            dialog.blazorTemplate("dialog1");
            dialog.blazorTemplate("dialog1footerTemplate");
            dialog.blazorTemplate("dialog1header");
            expect(isBlazor()).toBe(true);
            disableBlazorMode();
        });

        afterAll(() => {
            disableBlazorMode();
            dialog.destroy();
            document.body.innerHTML = '';
        });
    });

    describe('EJ2-31978 - Issue due to Content Security Policy directive "script-src self"', () => {
        let dialog: Dialog;
        
        beforeAll(() => {
            let ele: HTMLElement = createElement('div', { id: 'dialog1' });
            document.body.appendChild(ele);
            dialog = new Dialog();
            dialog.appendTo('#dialog1');
        });
        
        it("Coverage for Blazortemplate", () => {
            enableBlazorMode();
            dialog.header = 'Demo';
            dialog.content = '<div>Blazor First demo content</div>';
            dialog.footerTemplate = 'Footer Content';
            dialog.dataBind();
            expect(isBlazor()).toBe(true);
            disableBlazorMode();
        });

        afterAll(() => {
            disableBlazorMode();
            dialog.destroy();
            document.body.innerHTML = '';
        });
    });
});
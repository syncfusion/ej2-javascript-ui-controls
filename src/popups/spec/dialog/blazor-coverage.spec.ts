/**
 * Dialog blazor coverage spec document
 */
import { createElement, detach } from '@syncfusion/ej2-base'
import '../../node_modules/es6-promise/dist/es6-promise';
import { Dialog } from '../../src/dialog/dialog';

function destroyDialog(dialogObj: Dialog): void {
    dialogObj.destroy();
    detach(dialogObj.element);
}

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

        afterAll(() => {
            delete (window as any).Blazor;
            destroyDialog(dialog);
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
            (window as any).Blazor = null;
            (window as any).sfBlazor = null
            dialog.header = 'Demo';
            dialog.content = '<div>Blazor First demo content</div>';
            dialog.footerTemplate = 'Footer Content';
            dialog.dataBind();
            expect(Object.keys(window).indexOf('Blazor') >= 0).toBe(true);
            delete (window as any).Blazor;
            delete (window as any).sfBlazor;
        });

        afterAll(() => {
            delete (window as any).Blazor;
            delete (window as any).sfBlazor;
            destroyDialog(dialog);
        });
    });
});
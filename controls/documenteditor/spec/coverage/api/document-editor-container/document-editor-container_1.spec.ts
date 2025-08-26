import { DocumentEditorContainer } from '../../../../src/document-editor-container/document-editor-container';
import { Toolbar } from '../../../../src/document-editor-container/tool-bar/tool-bar';
import { createElement } from '@syncfusion/ej2-base';
import {DocumentEditor, ParagraphFormatProperties} from '../../../../src';
/**
 * Document Editor container
 */
describe('Document Editor container properties_1', () => {
    let container: DocumentEditorContainer;
    let element: HTMLElement;
    beforeAll(() => {
        element = createElement('div');
        document.body.appendChild(element);
        DocumentEditorContainer.Inject(Toolbar);
        container = new DocumentEditorContainer();
        container.appendTo(element);
    });
 afterAll((done) => {
        container.destroy();
        expect(element.childNodes.length).toBe(0);
        document.body.removeChild(element);
        expect(() => { container.destroy(); }).not.toThrowError();
        
        element = undefined;
        container = undefined;
        setTimeout(() => {
            done();
        },100);
    });
    it('serverActionSettings', () => {
        console.log('serverActionSettings');
        container.documentEditor.serviceUrl = 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/';
        container.documentEditor.serverActionSettings = { systemClipboard: 'SystemClipboard', spellCheck: 'SpellCheck' };
        expect(container.documentEditor.serviceUrl).toBe('https://ej2services.syncfusion.com/production/web-services/api/documenteditor/');
        expect(container.documentEditor.serverActionSettings.systemClipboard).toBe('SystemClipboard');
        expect(container.documentEditor.serverActionSettings.spellCheck).toBe('SpellCheck');
    });
    it('zIndex', () => {
        console.log('zIndex');
        container.zIndex = 100;
        expect(container.documentEditor.zIndex).toBe(2000);
    });
    it('header', () => {
        console.log('header');
        container.documentEditor.enableHeaderAndFooter = true;
        container.documentEditor.headers = [{ text: 'Header' }];
        expect(container.documentEditor.enableHeaderAndFooter).toBe(true);
        expect(container.documentEditor.headers).toEqual([{ text: 'Header' }]);
    });
    it('enable locale', () => {
        console.log('enable locale');
        container.onPropertyChanged({locale: 'true'}, {});
        container.documentEditor.locale = 'fr';
        expect(container.documentEditor.locale).toBe('fr');
    });
    it('enable RTL', () => {
        console.log('enable RTL');
        container.enableRtl = true;
        expect(container.documentEditor.enableRtl).toBe(false);
    });
});
describe('Document Editor container properties_2', () => {
    let container: DocumentEditorContainer;
    let element: HTMLElement;
    beforeAll(() => {
        element = createElement('div');
        document.body.appendChild(element);
        DocumentEditorContainer.Inject(Toolbar);
        container = new DocumentEditorContainer();
        container.appendTo(element);
    });
 afterAll((done) => {
        container.destroy();
        expect(element.childNodes.length).toBe(0);
        document.body.removeChild(element);
        expect(() => { container.destroy(); }).not.toThrowError();
        
        element = undefined;
        container = undefined;
        setTimeout(() => {
            done();
        },100);
    });
    it('enable comment', () => {
        console.log('enable comment');
       container.enableComment=true;
        container.documentEditor.editor.insertComment('New comment')
        expect(container.documentEditor.enableComment).toBe(true); 
        container.enableComment=false;
    });
    it('toolbarModule enableDisableInsertComment', () => {
        console.log('enableDisableInsertComment');
        container.toolbarModule.enableDisableInsertComment(true);
        expect(container.toolbarModule.toolbar.items[7].visible).toBe(true);
    });
    it('ToolbarModule', () => {
        console.log('ToolbarModule');
        container.enableToolbar=true;
        container.toolbarModule.enableItems(1, true);
        expect(container.toolbarModule.toolbar.items[1].visible).toBe(true);
        container.toolbarModule.enableItems(6, true);
        expect(container.toolbarModule.toolbar.items[6].visible).toBe(true);
    });
    it('reInitToolbarItems', () => {
        console.log('reInitToolbarItems');
        container.enableToolbar=false;
        expect(container.enableToolbar).toBe(false);
        container.enableToolbar=true;
        expect(container.toolbarModule.toolbar.items.length).not.toBe(0);
    });
});


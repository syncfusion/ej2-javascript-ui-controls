import { DocumentEditorContainer } from '../../src/document-editor-container/document-editor-container';
import { Toolbar } from '../../src/document-editor-container/tool-bar/tool-bar';
import { createElement } from '@syncfusion/ej2-base';
import { ContextMenu } from '../../src/document-editor/implementation/context-menu';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { LineWidget, ParagraphWidget } from '../../src';

describe('Document editor container properties', () => {
    let container: DocumentEditorContainer;
    let element: HTMLElement;
    beforeAll(() => {
        element = createElement('div');
        document.body.appendChild(element);
        DocumentEditorContainer.Inject(Toolbar);
        container = new DocumentEditorContainer();
        container.appendTo(element);
    });
    afterAll(() => {
        container.destroy();
        expect(element.childNodes.length).toBe(0);
        document.body.removeChild(element);
        expect(() => { container.destroy(); }).not.toThrowError();
        
        element = undefined;
        container = undefined;
    });
    it('Enable toolbar', () => {
        console.log('enable toolbar');
        container = new DocumentEditorContainer({enableToolbar:null});
        container.appendTo(element);
        expect(container.enableToolbar).toBe(null);
        container.destroy();
        container = new DocumentEditorContainer({enableToolbar:undefined});
        container.appendTo(element);
        expect(container.enableToolbar).toBe(true);
        container.destroy();
    });
    it('Show properties pane', () => {
        console.log('Show properties pane');
        container = new DocumentEditorContainer({showPropertiesPane:null});
        container.appendTo(element);
        expect(container.showPropertiesPane).toBe(null);
        container.destroy();
        container = new DocumentEditorContainer({showPropertiesPane:undefined});
        container.appendTo(element);
        expect(container.showPropertiesPane).toBe(true);
        container.destroy();
    });
    it('Restrict editing', () => {
        console.log('Restrict editing');
        container = new DocumentEditorContainer({restrictEditing:null});
        container.appendTo(element);
        expect(container.restrictEditing).toBe(null);
        container.destroy();
        container = new DocumentEditorContainer({restrictEditing:undefined});
        container.appendTo(element);
        expect(container.restrictEditing).toBe(false);
        container.destroy();
    });
    it('Enable spell check', () => {
        console.log('Enable spell check');
        container = new DocumentEditorContainer({enableSpellCheck:null});
        container.appendTo(element);
        expect(container.enableSpellCheck).toBe(null);
        container.destroy();
        container = new DocumentEditorContainer({enableSpellCheck:undefined});
        container.appendTo(element);
        expect(container.enableSpellCheck).toBe(false);
        container.destroy();
    });
    it('Enable Track changes', () => {
        console.log('Enable trach changes');
        container = new DocumentEditorContainer({enableTrackChanges:null});
        container.appendTo(element);
        expect(container.enableTrackChanges).toBe(null);
        container.destroy();
        container = new DocumentEditorContainer({enableTrackChanges:undefined});
        container.appendTo(element);
        expect(container.enableTrackChanges).toBe(false);
        container.destroy();
    });
    it('Layout type', () => {
        console.log('Layout type');
        container = new DocumentEditorContainer({layoutType:null});
        container.appendTo(element);
        expect(container.layoutType).toBe(null);
        container.destroy();
        container = new DocumentEditorContainer({layoutType:undefined});
        container.appendTo(element);
        expect(container.layoutType).toBe('Pages');
        container.destroy();
    });
    it('Current User', () => {
        console.log('Current User');
        container = new DocumentEditorContainer({currentUser:null});
        container.appendTo(element);
        expect(container.currentUser).toBe(null);
        container.destroy();
        container = new DocumentEditorContainer({currentUser:undefined});
        container.appendTo(element);
        expect(container.currentUser).toBe('');
        container.destroy();
    });
    it('User color', () => {
        console.log('User color');
        container = new DocumentEditorContainer({userColor:null});
        container.appendTo(element);
        expect(container.userColor).toBe(null);
        container.destroy();
        container = new DocumentEditorContainer({userColor:undefined});
        container.appendTo(element);
        expect(container.userColor).toBe('#FFFF00');
        container.destroy();
    });
    it('Enable local paste', () => {
        console.log('Enable local paste');
        container = new DocumentEditorContainer({enableLocalPaste:null});
        container.appendTo(element);
        expect(container.enableLocalPaste).toBe(null);
        container.destroy();
        container = new DocumentEditorContainer({enableLocalPaste:undefined});
        container.appendTo(element);
        expect(container.enableLocalPaste).toBe(false);
        container.destroy();
    });
    it('Service Url', () => {
        console.log('Service Url');
        container = new DocumentEditorContainer({serviceUrl:null});
        container.appendTo(element);
        expect(container.serviceUrl).toBe(null);
        container.destroy();
        container = new DocumentEditorContainer({serviceUrl:undefined});
        container.appendTo(element);
        expect(container.serviceUrl).toBe(undefined);
        container.destroy();
    });
    it('Z index', () => {
        console.log('Z index');
        container = new DocumentEditorContainer({zIndex:null});
        container.appendTo(element);
        expect(container.zIndex).toBe(null);
        container.destroy();
        container = new DocumentEditorContainer({zIndex:undefined});
        container.appendTo(element);
        expect(container.zIndex).toBe(2000);
        container.destroy();
    });
    it('Enable csp', () => {
        console.log('Enable csp');
        container = new DocumentEditorContainer({enableCsp:null});
        container.appendTo(element);
        expect(container.enableCsp).toBe(null);
        container.destroy();
        container = new DocumentEditorContainer({enableCsp:undefined});
        container.appendTo(element);
        expect(container.enableCsp).toBe(false);
        container.destroy();
    });
    it('Enable comment', () => {
        console.log('Enable comment');
        container = new DocumentEditorContainer({enableComment:null});
        container.appendTo(element);
        expect(container.enableComment).toBe(null);
        container.destroy();
        container = new DocumentEditorContainer({enableComment:undefined});
        container.appendTo(element);
        expect(container.enableComment).toBe(true);
        container.destroy();
    });
    it('Width', () => {
        console.log('Width');
        container = new DocumentEditorContainer({width:null});
        container.appendTo(element);
        expect(container.width).toBe(null);
        container.destroy();
        container = new DocumentEditorContainer({width:undefined});
        container.appendTo(element);
        expect(container.width).toBe('100%');
        container.destroy();
    });
    it('Height', () => {
        console.log('Height');
        container = new DocumentEditorContainer({height:null});
        container.appendTo(element);
        expect(container.height).toBe(null);
        container.destroy();
        container = new DocumentEditorContainer({height:undefined});
        container.appendTo(element);
        expect(container.height).toBe('320px');
        container.destroy();
    });
    it('Enable auto focus', () => {
        console.log('Enable auto focus');
        container = new DocumentEditorContainer({enableAutoFocus:null});
        container.appendTo(element);
        expect(container.enableAutoFocus).toBe(null);
        container.destroy();
        container = new DocumentEditorContainer({enableAutoFocus:undefined});
        container.appendTo(element);
        expect(container.enableAutoFocus).toBe(true);
        container.destroy();
    });
    it('Enable lock and edit', () => {
        console.log('Enable lock and edit');
        container = new DocumentEditorContainer({enableLockAndEdit:null});
        container.appendTo(element);
        expect(container.enableLockAndEdit).toBe(null);
        container.destroy();
        container = new DocumentEditorContainer({enableLockAndEdit:undefined});
        container.appendTo(element);
        expect(container.enableLockAndEdit).toBe(false);
        container.destroy();
    });
    it('Auto resize on visibility change', () => {
        console.log('Auto resize on visibility change');
        container = new DocumentEditorContainer({autoResizeOnVisibilityChange:null});
        container.appendTo(element);
        expect(container.autoResizeOnVisibilityChange).toBe(null);
        container.destroy();
        container = new DocumentEditorContainer({autoResizeOnVisibilityChange:undefined});
        container.appendTo(element);
        expect(container.autoResizeOnVisibilityChange).toBe(false);
        container.destroy();
    });
});
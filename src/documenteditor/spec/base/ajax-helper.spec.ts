import { DocumentEditor, XmlHttpRequestEventArgs } from '../../src/index';
import { createElement, Browser } from '@syncfusion/ej2-base';
import './../../node_modules/es6-promise/dist/es6-promise';
import { TestHelper } from './../test-helper.spec';
import { XmlHttpRequestHandler } from '../../src/document-editor/base/ajax-helper';
import { Regular } from '../../src/document-editor/implementation/text-helper/regular';

describe('Header Ajax value checking', () => {
    let editor: DocumentEditor;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({});
        DocumentEditor.Inject(Regular);
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo("#container");
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('header value checking', () => {
console.log('header value checking');
        editor.headers = [{ "syncfusion": "true" }];
        var httpRequest = new XmlHttpRequestHandler();
        httpRequest.customHeaders = editor.headers;
        const httprequestEventArgs: XmlHttpRequestEventArgs = { serverActionType: 'Import', headers: editor.headers, timeout: 0, cancel: false, withCredentials: true  };        
        var formObject = {};
        expect(() => {
            httpRequest.send(formObject, httprequestEventArgs);
            expect(httpRequest.xmlHttpRequest.withCredentials).toEqual(true);
            console.log(httpRequest.xmlHttpRequest.getAllResponseHeaders());
        }).not.toThrowError();
    })
});
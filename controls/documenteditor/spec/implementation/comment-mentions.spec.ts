import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from '../test-helper.spec';
import { CommentElementBox, Selection } from '../../src/index';
import { Editor } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';

describe('Validation for get commentData issue', () => {
    let editor: DocumentEditor = undefined;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', {
            id: 'container',
            styles: 'width:1000px;height:500px'
        });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Valdiation for posting reply comments with mentions', () => {
        let sfdtText = '{"sfdt":"UEsDBBQAAAAIAClmeVkWBQ/hEgMAABEVAAAEAAAAc2ZkdNxYy26bQBT9FWu6tSOGp2FXpXK6qKJI7aptFgMeDAovwSC3ifj33juDSYwwMW3qxPGCOcydx73nMNg+DyQvRJzG9/xruBbEE2XN56TiAfF+PBBfXmN5DeI18Qijlq65gblwfF9bmHzpLpZhQBdOQC1LZ8zSdYfMSRDAWloz/5tptLltbuckCon30MhcihIgiWAhw77Q5iTsULElnk11CSPiOa6ESQpQorJDokN+h9ZhAVlCm3MFfCgVZxWZbItKtTyDXHTYF1uMx7uWq3GbrIIiP5bMjwMowwf2yDXf3rANJw0WE2AxSCeMVnvU8lohTTCBySas7qF8KkuECeSSJbFfxkRGMLddDPHTaAjz9+5D3uvIej0skPqQQiaWxFioJKxDYYf8qgVsBxIAMpWkLSBPZCNUHXdbxdtdoqJb2IzCZv4GN0NyPqzaD0GFxW/5hKnBMJVc52XKEkgz+/V4h0/T45DPnK3jbDOjyPehKTviFbF2n9jZl3gTCeRH5qSvLNO1Iaceo4/D9nh90p0N9E8gVz3AfXYdl9q2bWmOA0fHdPbJpi3ZTcsK7bEyu4xY2VLziYesTsTshpVsU7Iimq3yTLwuOftpH8hwWHH9eMWNt6r4dMH1ccH1yYKfmJthLY3jtdSfyZeuDMc2zkJLY1xLY7KWJ+ZmWEvzGC3xS+y9HElzXEZzgoynpmVYQeuo0/gutLPGtbOmHMFXVs3+R9XO6MVpj6tmv4xqJ3lbOi/ytjwj7Zxx7ZyXfFueRMHl8b9dtAtrNF9Dfs5CxuW4jMvJv11OzM2wlu6E0/jeFHXHFXWnH8y3oSsvB0XtQorRQ55Gb8FVnosDC3ah5xZEHyid7qUhN1c1r8SsruQ+aP5c1QDQsCO6ppsLShe69Y06nml6lnFhL43vKtfOvhMJWFzkMk9Tjv+spcW2VjZNiWaf6hDgp7UeW6qKF2gUQW3qTjph6JhFIlWWDxMluHPy7wfWiyYZsgC4t/XPWtM0o905OBA3d3FYpI3DPTz+/L+sGuSpMv7AghI+FtT8AQAA//8DAFBLAQItABQAAAAIAClmeVkWBQ/hEgMAABEVAAAEAAAAAAAAAAAAIAAAAAAAAABzZmR0UEsFBgAAAAABAAEAMgAAADQDAAAAAA=="}';        
        editor.open(sfdtText);
        let comment: CommentElementBox = editor.documentHelper.comments[0];
        editor.editor.replyComment(comment,'<span contenteditable=\"false\" class=\"e-mention-chip\">Margaret</span>&nbsp;<span contenteditable=\"false\" class=\"e-mention-chip\">Laura Grace</span>');
        expect(() => {editor.editor.replyComment(comment,'<span contenteditable=\"false\" class=\"e-mention-chip\">Mary Kate</span>&nbsp;<span contenteditable=\"false\" class=\"e-mention-chip\">Camden Kate</span>')}).not.toThrowError();
    });
});
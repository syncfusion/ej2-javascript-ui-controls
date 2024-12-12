import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from '../test-helper.spec';
import { Selection } from '../../src/index';
import { Editor } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';

describe('validation for insertShape API', () => {
    let documenteditor: DocumentEditor = undefined;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', {
            id: 'container',
            styles: 'width:1000px;height:500px'
        });
        document.body.appendChild(ele);
        documenteditor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); documenteditor.enableEditorHistory = true;
        (documenteditor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (documenteditor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (documenteditor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (documenteditor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        documenteditor.appendTo('#container');
    });
    afterAll((done): void => {
        documenteditor.destroy();
        documenteditor = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Validation for LightningBolt shape', () => {
        documenteditor.editor.insertShape('LightningBolt',{height: 100, width: 100});
    });
    it('Validation for pentagon shape', () => {
        documenteditor.editor.insertShape('Pentagon',{height: 90, width: 100, lineColor: '#FFA500'});
    });
    it('Validation for pie shape', () => { 
        documenteditor.editor.insertShape('Pie',{height: 90, width: 100, lineColor: '#FFA500', textWrappingStyle: 'InFrontOfText'});
    });
    it('Validation for heart shape', () => {
        documenteditor.editor.insertShape('Heart',{height: 130, width: 150});
    });
    it('Validation for sun shape', () => {
        documenteditor.editor.insertShape('Sun',{height: 50, width: 70, lineColor: '#FFAE42'});
    });
    it('Validation for the flowchartprocess shape', () => {
        documenteditor.editor.insertShape('FlowChartProcess',{height: 40, width: 100, lineWeight: 0.5 });
    });
    it('Validation for the FlowChartDelay shape', () => {
        documenteditor.editor.insertShape('FlowChartDelay',{height: 100, width: 150, lineWeight: 1.5 });
    });
    it('Validation for the FlowChartDocument shape', () => {
        documenteditor.editor.insertShape('FlowChartDocument',{height: 60, width: 60, distanceLeft: 15 });
    });
    it('Validation for the FlowChartConnector shape', () => {
        documenteditor.editor.insertShape('FlowChartConnector',{height: 50, width: 50, distanceRight:20 });
    });
    it('Validation for the FlowChartSummingJunction shape', () => {
        documenteditor.editor.insertShape('FlowChartSummingJunction',{height: 120, width: 130, lineWeight:0.5 });
    });
});

import { WParagraphFormat } from '../../../src/document-editor/implementation/format/paragraph-format';
import { WListFormat } from '../../../src/document-editor/implementation/format/list-format';
import { createElement } from '@syncfusion/ej2-base';
import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { Selection } from '../../../src/document-editor/implementation/selection/selection';
import { Editor } from '../../../src/document-editor/implementation/editor/editor';
import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';
import { TestHelper } from '../../test-helper.spec';
/**
 * Paragraph format spec
 */
describe('Paragraph Validation Testing', () => {
    afterEach(() => {
        WParagraphFormat.clear();
        WListFormat.clear();
    });
    it('Copy format setting  Testing', () => {
        let para: WListFormat = new WListFormat();
        para.listLevelNumber = 20;
        expect('').toBe('');
    });
    it('Copy format Testing', () => {
        let para: WParagraphFormat = new WParagraphFormat();
        let para1: WParagraphFormat = new WParagraphFormat();
        para.copyFormat(para1);
        expect('').toBe('');
    });
    it('Copy format undefined Testing', () => {
        let para: WParagraphFormat = new WParagraphFormat();
        para.copyFormat(undefined);
        expect('').toBe('');
    });
    it('Clone format Testing', () => {
        let para: WParagraphFormat = new WParagraphFormat();
        para.cloneFormat();
        expect('').toBe('');
    });
    it('destroy Testing', () => {
        let para: WParagraphFormat = new WParagraphFormat();
        para.destroy();
        para.cloneFormat();
        expect(() => { para.destroy() }).not.toThrowError();
    });
    it('Clear Format validation', () => {
        let format: WParagraphFormat = new WParagraphFormat();
        format.leftIndent = 10;
        format.rightIndent = 12;
        format.afterSpacing = 10;
        format.listFormat.listId = 1;
        format.listFormat.listLevelNumber = 0;
        format.clearFormat();
        expect((format as any).uniqueParagraphFormat).toBeUndefined();
        expect(format.leftIndent).toBe(0);
        expect(format.rightIndent).toBe(0);
        expect(format.listFormat.listId).toBe(-1);
    });
    it('Text alignment right valdiation', () => {
        let format: WParagraphFormat = new WParagraphFormat();
        format.textAlignment = 'Right';
        format.bidi = true;
        expect(format.textAlignment).toBe("Left");
    });
    it('style property default value', () => {
        expect((WParagraphFormat as any).getPropertyDefaultValue('styleName')).toBe('Normal');
    });
});


let tabStop: object = {"sections":[{"blocks":[{"characterFormat":{"fontSize":8.0,"fontFamily":"Times New Roman"},"paragraphFormat":{"styleName":"[Normal]","tabs":[{"tabJustification":"Left","position":0.0,"tabLeader":"None","deletePosition":56.7},{"tabJustification":"Left","position":0.0,"tabLeader":"None","deletePosition":113.4},{"tabJustification":"Left","position":0.0,"tabLeader":"None","deletePosition":170.1},{"tabJustification":"Left","position":0.0,"tabLeader":"None","deletePosition":226.8},{"tabJustification":"Left","position":0.0,"tabLeader":"None","deletePosition":283.5},{"tabJustification":"Left","position":0.0,"tabLeader":"None","deletePosition":340.2},{"tabJustification":"Left","position":0.0,"tabLeader":"None","deletePosition":396.9},{"tabJustification":"Left","position":0.0,"tabLeader":"None","deletePosition":453.6},{"tabJustification":"Left","position":0.0,"tabLeader":"None","deletePosition":510.3},{"tabJustification":"Center","position":270.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Right","position":539.25,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Left","position":850.5,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Left","position":907.20001220703125,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Left","position":963.9000244140625,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Left","position":1020.5999755859375,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Left","position":1077.300048828125,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Left","position":1134.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Left","position":1190.699951171875,"tabLeader":"None","deletePosition":0.0}]},"inlines":[{"text":"Tab stop with delete position","characterFormat":{"fontSize":8.0,"fontFamily":"Times New Roman"}},{"text":"\t","characterFormat":{"fontSize":8.0,"fontFamily":"Times New Roman"}},{"hasFieldEnd":true,"fieldType":0},{"text":" PAGE \\* Arabic \\* MERGEFORMAT ","characterFormat":{"fontSize":8.0,"fontFamily":"Times New Roman"}},{"fieldType":2},{"text":"1","characterFormat":{"fontSize":8.0,"fontFamily":"Times New Roman"}},{"fieldType":1},{"text":" of 4","characterFormat":{"fontSize":8.0,"fontFamily":"Times New Roman"}},{"text":"\t","characterFormat":{"fontSize":8.0,"fontFamily":"Times New Roman"}},{"text":"right aligned","characterFormat":{"fontSize":8.0,"fontFamily":"Times New Roman"}},{"name":"_GoBack","bookmarkType":0},{"name":"_GoBack","bookmarkType":1}]},{"characterFormat":{"fontSize":7.0,"fontFamily":"Times New Roman"},"paragraphFormat":{"styleName":"Header","tabs":[{"tabJustification":"Left","position":36.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Left","position":72.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Left","position":108.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Left","position":144.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Left","position":180.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Left","position":216.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Left","position":252.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Left","position":288.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Left","position":324.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Left","position":360.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Left","position":396.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Left","position":432.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Left","position":468.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Left","position":504.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[]}],"headersFooters":{},"sectionFormat":{"headerDistance":36.0,"footerDistance":33.200000762939453,"pageWidth":612.0,"pageHeight":1008.0,"leftMargin":36.0,"rightMargin":21.600000381469727,"topMargin":8.5500001907348633,"bottomMargin":8.5500001907348633,"differentFirstPage":false,"differentOddAndEvenPages":false}}],"characterFormat":{"fontSize":12.0,"fontFamily":"Arial"},"paragraphFormat":{"afterSpacing":8.0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple"},"background":{"color":"#FFFFFFFF"},"styles":[{"type":"Paragraph","name":"Normal","next":"Normal","characterFormat":{"fontSize":10.0,"fontFamily":"CG Times"},"paragraphFormat":{"afterSpacing":0.0,"lineSpacing":1.0,"lineSpacingType":"Multiple"}},{"type":"Paragraph","name":"Heading 1","basedOn":"Normal","next":"Normal","characterFormat":{"bold":true,"fontSize":8.0},"paragraphFormat":{"outlineLevel":"Level1"}},{"type":"Paragraph","name":"Heading 2","basedOn":"Normal","next":"Normal","characterFormat":{"bold":true,"fontSize":8.0},"paragraphFormat":{"outlineLevel":"Level2","textAlignment":"Center"}},{"type":"Paragraph","name":"Heading 4","basedOn":"Normal","next":"Normal","characterFormat":{"bold":true},"paragraphFormat":{"outlineLevel":"Level4","textAlignment":"Justify","tabs":[{"tabJustification":"Left","position":276.75,"tabLeader":"None","deletePosition":0.0}]}},{"type":"Character","name":"Default Paragraph Font"},{"type":"Paragraph","name":"[Normal]","next":"Normal","paragraphFormat":{"afterSpacing":0.0,"lineSpacing":1.0,"lineSpacingType":"Multiple","tabs":[{"tabJustification":"Left","position":56.700000762939453,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Left","position":113.40000152587891,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Left","position":170.10000610351563,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Left","position":226.80000305175781,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Left","position":283.5,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Left","position":340.20001220703125,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Left","position":396.89999389648438,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Left","position":453.60000610351562,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Left","position":510.29998779296875,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Left","position":567.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Left","position":623.70001220703125,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Left","position":680.4000244140625,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Left","position":737.0999755859375,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Left","position":793.79998779296875,"tabLeader":"None","deletePosition":0.0}]}},{"type":"Paragraph","name":"Header","basedOn":"Normal","next":"Normal","paragraphFormat":{"tabs":[{"tabJustification":"Center","position":216.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Right","position":432.0,"tabLeader":"None","deletePosition":0.0}]}},{"type":"Paragraph","name":"Body Text","basedOn":"Normal","characterFormat":{"fontSize":8.0}},{"type":"Paragraph","name":"Body Text 2","basedOn":"Normal","characterFormat":{"fontSize":8.0},"paragraphFormat":{"textAlignment":"Justify"}},{"type":"Paragraph","name":"Body Text Indent 2","basedOn":"Normal","characterFormat":{"fontSize":8.0},"paragraphFormat":{"leftIndent":26.100000381469727}},{"type":"Paragraph","name":"Footer","basedOn":"Normal","link":"Footer Char","paragraphFormat":{"tabs":[{"tabJustification":"Center","position":234.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Right","position":468.0,"tabLeader":"None","deletePosition":0.0}]}},{"type":"Character","name":"Footer Char","basedOn":"Default Paragraph Font","characterFormat":{"fontSize":10.0,"fontFamily":"CG Times"}}],"defaultTabWidth":56.700000762939453};

describe('Tab stop with delete position',()=>{
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor.enableEditorHistory = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 500);
    });

    it('Get tab stop from paragraph', () => {
        editor.open(JSON.stringify(tabStop));
        // Excluding delete position.
        expect(editor.selection.start.paragraph.paragraphFormat.getUpdatedTabs().length).toBe(14);
    });
});
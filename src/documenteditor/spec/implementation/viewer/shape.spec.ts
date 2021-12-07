import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, LineWidget} from '../../../src/index';
import { TestHelper } from '../../test-helper.spec';
import { Selection } from '../../../src/index';
import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';
import { ParagraphWidget } from '../../../src';

describe('Horizonatal line shape', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, height: '700px' });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 500);
    });
    it('Inline wrapping style with width scale', () => {
        let lineShape: any = '{"sections":[{"blocks":[{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"styleName":"Normal"},"inlines":[{"shapeId":0,"visible":true,"width":0.0,"height":1.5,"widthScale":100.0,"heightScale":100.0,"lineFormat":{"line":false,"color":"#00000000","weight":0.75,"lineStyle":"Solid"},"fillFormat":{"color":"#A0A0A0FF","fill":true},"textWrappingStyle":"Inline","textWrappingType":"Both","verticalPosition":0.0,"verticalOrigin":"Paragraph","verticalAlignment":"None","verticalRelativePercent":-3.4028235E+38,"horizontalPosition":0.0,"horizontalOrigin":"Column","horizontalAlignment":"Center","horizontalRelativePercent":-3.4028235E+38,"zOrderPosition":2147483647,"allowOverlap":true,"layoutInCell":true,"lockAnchor":false,"distanceBottom":0.0,"distanceLeft":0.0,"distanceRight":0.0,"distanceTop":0.0,"autoShapeType":"Rectangle","textFrame":{"textVerticalAlignment":"Top","leftMargin":7.087,"rightMargin":7.087,"topMargin":3.685,"bottomMargin":3.685,"blocks":[{"inlines":[]}]}}]},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"styleName":"Normal"},"inlines":[]}],"headersFooters":{"header":{"blocks":[{"inlines":[]}]},"footer":{"blocks":[{"inlines":[]}]},"evenHeader":{"blocks":[{"inlines":[]}]},"evenFooter":{"blocks":[{"inlines":[]}]},"firstPageHeader":{"blocks":[{"inlines":[]}]},"firstPageFooter":{"blocks":[{"inlines":[]}]}},"sectionFormat":{"headerDistance":36.0,"footerDistance":36.0,"pageWidth":612.0,"pageHeight":792.0,"leftMargin":72.0,"rightMargin":72.0,"topMargin":72.0,"bottomMargin":72.0,"differentFirstPage":false,"differentOddAndEvenPages":false,"bidi":false,"restartPageNumbering":false,"pageStartingNumber":0,"endnoteNumberFormat":"LowerCaseRoman","footNoteNumberFormat":"Arabic","restartIndexForFootnotes":"DoNotRestart","restartIndexForEndnotes":"DoNotRestart"}}],"characterFormat":{"fontSize":11.0,"fontFamily":"Calibri","fontColor":"empty","fontSizeBidi":11.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"afterSpacing":8.0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple"},"background":{"color":"#FFFFFFFF"},"styles":[{"type":"Paragraph","name":"Normal","next":"Normal","characterFormat":{"fontColor":"empty"}},{"type":"Character","name":"Default Paragraph Font","characterFormat":{"fontColor":"empty"}}],"defaultTabWidth":36.0,"formatting":false,"trackChanges":false,"protectionType":"NoProtection","enforcement":false,"dontUseHTMLParagraphAutoSpacing":false,"alignTablesRowByRow":false,"formFieldShading":true,"footnotes":{"separator":[{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"styleName":"Normal"},"inlines":[{"text":"\\u0003","characterFormat":{"fontColor":"empty"}}]}],"continuationSeparator":[{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"styleName":"Normal"},"inlines":[{"text":"\\u0004","characterFormat":{"fontColor":"empty"}}]}],"continuationNotice":[{"inlines":[]}]},"endnotes":{"separator":[{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"styleName":"Normal"},"inlines":[{"text":"\\u0003","characterFormat":{"fontColor":"empty"}}]}],"continuationSeparator":[{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"styleName":"Normal"},"inlines":[{"text":"\\u0004","characterFormat":{"fontColor":"empty"}}]}],"continuationNotice":[{"inlines":[]}]},"compatibilityMode":3}';
        editor.open(lineShape);
        expect(editor.documentHelper.pages.length).toBe(1);
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].firstChild) as ParagraphWidget).childWidgets.length).toBe(1);

        expect((((editor.documentHelper.pages[0].bodyWidgets[0].firstChild) as ParagraphWidget).childWidgets[0] as LineWidget).children[0].width).not.toBe(0);
    });
});

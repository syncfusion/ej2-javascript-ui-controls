import { createElement,select } from '@syncfusion/ej2-base';
import { DocumentHelper,Editor, TableWidget, TextElementBox, TextFormFieldDialog, TableCellWidget,DocumentEditor,CommentCharacterElementBox, ParagraphWidget, LineWidget, FormFieldData } from '../../../src/index';
import { TestHelper } from '../../test-helper.spec';
import { Selection } from '../../../src/index';
import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';
/**
 * Restrict editing selection and edit region validation
 */
describe('Restrict editing Add edit region', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true });
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
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Add selected region to readonly case', () => {
console.log('Add selected region to readonly case');
        editor.editor.insertText('sample');
        editor.editor.onEnter();
        editor.editor.insertText('sample');
        editor.editor.onEnter();
        editor.editor.insertText('sample');
        editor.selection.handleControlHomeKey();
        editor.selection.handleShiftDownKey();
        editor.selection.handleShiftDownKey();
        editor.editor.insertEditRangeElement('Everyone');
        editor.editor.protect('ReadOnly');
        expect(editor.documentHelper.editRanges.length).toBe(1);
    });
    it('highlight selection for editable region', () => {
console.log('highlight selection for editable region');
        editor.selection.isHighlightEditRegion = true;
        editor.selection.highlightEditRegion();
    });
    it('SelectAll for editable region', () => {
console.log('SelectAll for editable region');
        editor.selection.showAllEditingRegion();
    });
    it('remove editrange at current selection', () => {
console.log('remove editrange at current selection');
        editor.selection.handleControlHomeKey();
        editor.selection.handleRightKey();
        editor.selection.handleRightKey();
        editor.selection.handleRightKey();
        editor.editor.removeUserRestrictions('Everyone');
        expect(editor.documentHelper.editRanges.containsKey('Everyone')).toBe(false);
    });
});

let paragraph: any = { "sections": [{ "blocks": [{ "paragraphFormat": { "afterSpacing": 30.0, "styleName": "Heading 1" }, "inlines": [{ "editRangeId": "1912695574", "group": "everyone" }, { "editRangeId": "514155093", "user": "sample@gmail.com" }, { "text": "Adventure Works Cycles" }, { "editRangeId": "1912695574", "editableRangeStart": { "editRangeId": "1912695574", "group": "everyone" } }, { "editRangeId": "514155093", "editableRangeStart": { "editRangeId": "514155093", "user": "sample@gmail.com" } }] }, { "paragraphFormat": { "firstLineIndent": 36.0, "styleName": "Normal" }, "inlines": [{ "text": "Adventure Works Cycles, the fictitious company on which the " }, { "text": "AdventureWorks" }, { "text": " sample databases are based, is a large, multinational " }, { "editRangeId": "1184707919", "group": "everyone" }, { "text": "manufacturing company. The company manufactures and sells metal and composite bicycles to North American, European and Asian commercial markets. While its base operation " }, { "text": "is located in" }, { "text": " Bothell, Washington wit" }, { "editRangeId": "1184707919", "editableRangeStart": { "editRangeId": "1184707919", "group": "everyone" } }, { "text": "h 290 employees, several regional sales teams are located throughout their market base." }] }, { "paragraphFormat": { "firstLineIndent": 36.0, "styleName": "Normal" }, "inlines": [{ "text": "In 2000, Adventure Works Cycles bought a small manufac" }, { "name": "_GoBack", "bookmarkType": 0 }, { "name": "_GoBack", "bookmarkType": 1 }, { "text": "turing plant, Importadores Neptuno, located in Mexico. " }, { "text": "Importadores" }, { "text": " " }, { "editRangeId": "451241714", "group": "everyone" }, { "editRangeId": "1146227303", "user": "sample@gmail.com" }, { "text": "Neptuno manufactures several critical subcomponents for the Adventure Works Cycles product line. These subcomponents are shipped to the Bothell location for final product assembly. In 2001, " }, { "text": "Importadores" }, { "text": " Neptuno" }, { "editRangeId": "451241714", "editableRangeStart": { "editRangeId": "451241714", "group": "everyone" } }, { "editRangeId": "1146227303", "editableRangeStart": { "editRangeId": "1146227303", "user": "sample@gmail.com" } }, { "text": ", became the sole manufacturer and distributor of the touring bicycle product group." }] }, { "paragraphFormat": { "styleName": "Heading 1" }, "inlines": [{ "editRangeId": "668092358", "group": "everyone" }, { "text": "Product Overview" }, { "editRangeId": "668092358", "editableRangeStart": { "editRangeId": "668092358", "group": "everyone" } }] }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [] }], "headersFooters": { "header": { "blocks": [{ "paragraphFormat": { "styleName": "Normal" }, "inlines": [] }] }, "footer": { "blocks": [{ "paragraphFormat": { "styleName": "Normal" }, "inlines": [] }] } }, "sectionFormat": { "headerDistance": 36.0, "footerDistance": 36.0, "pageWidth": 612.0, "pageHeight": 792.0, "leftMargin": 72.0, "rightMargin": 72.0, "topMargin": 72.0, "bottomMargin": 72.0, "differentFirstPage": false, "differentOddAndEvenPages": false, "bidi": false } }], "characterFormat": { "fontSize": 11.0, "fontFamily": "Calibri", "fontFamilyBidi": "Times New Roman" }, "background": { "color": "#FFFFFFFF" }, "styles": [{ "type": "Paragraph", "name": "Normal", "next": "Normal" }, { "type": "Paragraph", "name": "Heading 1", "basedOn": "Normal", "next": "Normal", "link": "Heading 1 Char", "characterFormat": { "fontSize": 16.0, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontFamilyBidi": "Calibri Light" }, "paragraphFormat": { "beforeSpacing": 12.0, "outlineLevel": "Level1" } }, { "type": "Paragraph", "name": "Heading 2", "basedOn": "Normal", "next": "Normal", "link": "Heading 2 Char", "characterFormat": { "fontSize": 13.0, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontFamilyBidi": "Calibri Light" }, "paragraphFormat": { "beforeSpacing": 2.0, "afterSpacing": 6.0, "outlineLevel": "Level2" } }, { "type": "Paragraph", "name": "Heading 3", "basedOn": "Normal", "next": "Normal", "link": "Heading 3 Char", "characterFormat": { "fontSize": 12.0, "fontFamily": "Calibri Light", "fontColor": "#1F3763FF", "fontFamilyBidi": "Calibri Light" }, "paragraphFormat": { "beforeSpacing": 2.0, "outlineLevel": "Level3" } }, { "type": "Paragraph", "name": "Heading 4", "basedOn": "Normal", "next": "Normal", "link": "Heading 4 Char", "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontFamilyBidi": "Calibri Light" }, "paragraphFormat": { "beforeSpacing": 2.0, "outlineLevel": "Level4" } }, { "type": "Paragraph", "name": "Heading 5", "basedOn": "Normal", "next": "Normal", "link": "Heading 5 Char", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontFamilyBidi": "Calibri Light" }, "paragraphFormat": { "beforeSpacing": 2.0, "outlineLevel": "Level5" } }, { "type": "Paragraph", "name": "Heading 6", "basedOn": "Normal", "next": "Normal", "link": "Heading 6 Char", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763FF", "fontFamilyBidi": "Calibri Light" }, "paragraphFormat": { "beforeSpacing": 2.0, "outlineLevel": "Level6" } }, { "type": "Character", "name": "Default Paragraph Font" }, { "type": "Character", "name": "Heading 1 Char", "basedOn": "Default Paragraph Font", "characterFormat": { "fontSize": 16.0, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontFamilyBidi": "Calibri Light" } }, { "type": "Character", "name": "Heading 2 Char", "basedOn": "Default Paragraph Font", "characterFormat": { "fontSize": 13.0, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontFamilyBidi": "Calibri Light" } }, { "type": "Character", "name": "Heading 3 Char", "basedOn": "Default Paragraph Font", "characterFormat": { "fontSize": 12.0, "fontFamily": "Calibri Light", "fontColor": "#1F3763FF", "fontFamilyBidi": "Calibri Light" } }, { "type": "Character", "name": "Heading 4 Char", "basedOn": "Default Paragraph Font", "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontFamilyBidi": "Calibri Light" } }, { "type": "Character", "name": "Heading 5 Char", "basedOn": "Default Paragraph Font", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontFamilyBidi": "Calibri Light" } }, { "type": "Character", "name": "Heading 6 Char", "basedOn": "Default Paragraph Font", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763FF", "fontFamilyBidi": "Calibri Light" } }], "defaultTabWidth": 36.0, "formatting": false, "protectionType": "ReadOnly", "enforcement": true, "hashValue": "uRsKdmfajrTccbIQUMDO9Nf0cH3r5CF86qNNBwGpBXiqteB/uzjMnkTqefN7LAOn8KI1y9do60XhE/NEpbseyw==", "saltValue": "exv9WhHKEdkNOkzHGmmmxQ==" };

let findRegion = '{"sections":[{"blocks":[{"characterFormat":{"fontSize":11.0,"fontFamily":"Calibri","fontSizeBidi":11.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"leftIndent":36.0,"firstLineIndent":-36.0},"inlines":[]},{"rows":[{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"characterFormat":{"bold":true,"fontSize":11.0,"fontFamily":"Calibri","fontSizeBidi":11.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"textAlignment":"Center"},"inlines":[{"text":"CONTRATO DE PRESTACIÓN DE SERVICIOS ENTRE LA ASOCIACIÓN DE INVESTIGACIÓN DE LA INDUSTRIA TEXTIL (","characterFormat":{"bold":true,"fontSize":16.0,"fontFamily":"Calibri","fontSizeBidi":11.0,"fontFamilyBidi":"Arial"}},{"text":"LDT","characterFormat":{"bold":true,"fontSize":16.0,"fontFamily":"Calibri","fontSizeBidi":11.0,"fontFamilyBidi":"Arial"}},{"text":") Y LA EMPRESA ","characterFormat":{"bold":true,"fontSize":16.0,"fontFamily":"Calibri","fontSizeBidi":11.0,"fontFamilyBidi":"Arial"}},{"text":"MIERDA","characterFormat":{"bold":true,"fontSize":16.0,"fontFamily":"Calibri","fontSizeBidi":11.0,"fontFamilyBidi":"Arial"}},{"text":" LT, S.L., EN EL MARCO DEL PROYECTO ","characterFormat":{"bold":true,"fontSize":16.0,"fontFamily":"Calibri","fontSizeBidi":11.0,"fontFamilyBidi":"Arial"}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":481.8999938964844,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":481.8999938964844}}]}],"title":null,"description":null,"tableFormat":{"allowAutoFit":true,"leftIndent":0.0,"tableAlignment":"Left","preferredWidthType":"Auto","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"bidi":false,"horizontalPositionAbs":"Left","horizontalPosition":0.0}},{"characterFormat":{"fontSize":11.0,"fontFamily":"Calibri","fontSizeBidi":11.0,"fontFamilyBidi":"Arial"},"inlines":[]},{"characterFormat":{"fontSize":11.0,"fontFamily":"Calibri","fontSizeBidi":11.0,"fontFamilyBidi":"Arial"},"inlines":[]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"},"paragraphFormat":{"outlineLevel":"Level1"},"inlines":[]},{"characterFormat":{"bold":true,"fontSize":18.0,"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"},"paragraphFormat":{"outlineLevel":"Level1","textAlignment":"Center"},"inlines":[{"text":"“PROCESOS DE TINTURA SOSTENIBLE - ","characterFormat":{"bold":true,"fontSize":18.0,"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":"DESARROLO DE NUEVOS PROCESOS DE TINTURA SOSTENIBLE”","characterFormat":{"bold":true,"fontSize":18.0,"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"},"paragraphFormat":{"outlineLevel":"Level1"},"inlines":[]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"},"paragraphFormat":{"outlineLevel":"Level1"},"inlines":[]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"},"paragraphFormat":{"outlineLevel":"Level1"},"inlines":[]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"},"paragraphFormat":{"outlineLevel":"Level1"},"inlines":[{"text":"En Alcoy, a 10/02/2022.","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"},"paragraphFormat":{"outlineLevel":"Level1"},"inlines":[]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"},"paragraphFormat":{"outlineLevel":"Level1"},"inlines":[]},{"characterFormat":{"bold":true,"fontSize":14.0,"fontFamily":"Calibri","fontColor":"#000000FF","fontSizeBidi":14.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"textAlignment":"Center","tabs":[{"tabJustification":"Center","position":241.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[{"text":"REUNIDOS","characterFormat":{"bold":true,"fontSize":14.0,"fontFamily":"Calibri","fontSizeBidi":14.0,"fontFamilyBidi":"Arial"}},{"text":" ","characterFormat":{"bold":true,"fontSize":14.0,"fontFamily":"Calibri","fontColor":"#000000FF","fontSizeBidi":14.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"},"paragraphFormat":{"tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"},"paragraphFormat":{"tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"},"paragraphFormat":{"tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[{"text":"De una parte, la empresa ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":"MIERDA","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":" LT, S.L. (en adelante, ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":"MIERDA","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":" LT), ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":"con CIF: ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial","localeId":3082}},{"text":"B98765432","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial","localeId":3082}},{"text":", con ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial","localeId":3082}},{"text":"sede Cr ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"Mierda Santa","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":" s/n ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"y en su nombre y representación","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":" ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":"D./Dña. Dña. R","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":" B","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":" con D.N.I. ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"87654321","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"-","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"L","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":" ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"en calidad de representante legal y con poderes suficientes para la celebración de este acto, poderes que no le han sido derogados ni modificados.","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[{"text":"Y de otra parte la ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"LDT","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":" (en lo sucesivo ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"LDT","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":") con N.I.F. ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"G-12345678","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":", con sede plaza Emilio Sala, nº 1, 03801, Alcoy, y en su nombre y representación D. ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"Mierda Para Ti","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":" actuando en calidad de ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"Director General","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":" con D.N.I. ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"12345678-J","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":", expresamente facultado al efecto de conformidad a lo dispuesto en el artículo 22 de los Estatutos de ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"LDT","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":", aprobados por la Asamblea General celebrada el 16 de diciembre de 2016.","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[{"text":"Se reconocen las partes con capacidad legal suficiente y poder bastante para este acto y ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"textAlignment":"Center","tabs":[{"tabJustification":"Center","position":241.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[{"text":"EXPONEN","characterFormat":{"bold":true,"fontSize":14.0,"fontFamily":"Calibri","fontSizeBidi":14.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"leftIndent":14.199999809265137,"firstLineIndent":-14.199999809265137,"lineSpacing":7.0,"lineSpacingType":"AtLeast","listFormat":{"listLevelNumber":0,"listId":2},"tabs":[{"tabJustification":"Left","position":0.0,"tabLeader":"None","deletePosition":36.0},{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[{"text":"Que ","characterFormat":{"fontFamily":"Calibri","fontColor":"#000000FF","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"MIERDA","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":" LT ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":"centra su actividad en preparación tintura y acabado textil; estando interesada en recibir el asesoramiento y los servicios tecnológicos corr","characterFormat":{"fontFamily":"Calibri","fontColor":"#000000FF","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"espondientes para la ejecución del Proyecto “DESARROLLO DE NUEVOS PROCESOS DE TINTURA SOSTENIBLES”; estando interesada en ","characterFormat":{"fontFamily":"Calibri","fontColor":"#000000FF","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"recibir el asesoramiento y los servicios tecnológicos correspondientes para la ejecución del Proyecto “PROCESOS DE TINTURA SOSTENIBLE-","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"DESARROLO DE NUEVOS PROCESOS DE TINTURA SOSTENIBLE”.","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"leftIndent":14.199999809265137,"lineSpacing":7.0,"lineSpacingType":"AtLeast","tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"leftIndent":14.199999809265137,"listFormat":{"listLevelNumber":0,"listId":2},"tabs":[{"tabJustification":"Left","position":0.0,"tabLeader":"None","deletePosition":36.0},{"tabJustification":"List","position":32.20000076293945,"tabLeader":"None","deletePosition":0.0}]},"inlines":[{"text":"Que ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"LDT","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":" desarrolla actividades de I+D en las áreas científica-tecnológicas concernientes al ámbito de conocimiento textil con aplicaciones a este sector industrial. Posee experiencia probada en las te","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"cnologías emergentes, las nuevas tecnologías, así como los nuevos procesos y productos que ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"marcan actualmente las pautas del avance progresivo en las actividades de I+D+I. Así mismo, ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"LDT","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":" cuenta con acreditaciones y reconocimientos del más alto nivel, ade","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"más de equipos tecnológicamente avanzados y personal altamente cualificado, con el fin de ofrecer servicios de consultoría y certificaciones en el ámbito nacional e internacional. ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"lineSpacing":7.0,"lineSpacingType":"AtLeast","tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"lineSpacing":7.0,"lineSpacingType":"AtLeast","tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[{"text":"Por lo anteriormente expuesto, es deseo de las partes contratantes que int","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"ervienen formalizar el presente contrato con arreglo a las siguientes","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[]},{"characterFormat":{"bold":true,"fontSize":14.0,"fontFamily":"Calibri","fontSizeBidi":14.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"textAlignment":"Center","tabs":[{"tabJustification":"Center","position":241.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[{"text":"CLÁUSULAS","characterFormat":{"bold":true,"fontSize":14.0,"fontFamily":"Calibri","fontSizeBidi":14.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":11.0,"fontFamilyBidi":"Arial"},"inlines":[]},{"characterFormat":{"bold":true,"underline":"Single","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[{"text":"PRIMERA: Objeto","characterFormat":{"bold":true,"underline":"Single","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"},"inlines":[{"text":"El objeto ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"del presente contrato es regular la ","characterFormat":{"fontFamily":"Calibri","fontColor":"#000000FF","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"prestación de servicios","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":" por parte de ","characterFormat":{"fontFamily":"Calibri","fontColor":"#000000FF","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"LDT","characterFormat":{"fontFamily":"Calibri","fontColor":"#000000FF","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":" y a favor de ","characterFormat":{"fontFamily":"Calibri","fontColor":"#000000FF","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"MIERDA","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":" LT","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":" para la ","characterFormat":{"fontFamily":"Calibri","fontColor":"#000000FF","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"ejecución y desarrollo del Proyecto de I+","characterFormat":{"fontFamily":"Calibri","fontColor":"#000000FF","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":"D titulado “","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":"PROCESOS DE TINTURA SOSTENIBLE-DESARROLO DE NUEVOS PROCESOS DE TINTURA SOSTENIBLE","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"” (en adelante el Proyecto), con el fin de regular la prestación de servicios por parte de ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":"LDT","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":" y a favor de ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":"MIERDA","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":" LT, p","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":"ara la ejecución y desarrollo del Proyecto de I+D titulado “DESARROLLO DE NUEVOS PROCESOS DE TINTURA SOSTENIBLES”, (en adelante el Proyecto), con el fin de investigar y desarrollar nuevos procesos de tintura sostenible en hilos de poliéster ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri","localeId":3082},"paragraphFormat":{"outlineLevel":"Level1"},"inlines":[]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"},"inlines":[{"text":"La descripción y alcance de los servicios que serán prestados por ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":"LDT","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":" a ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":"MIERDA","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":" LT","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":" se encuentra incorporada como ANEXO I al presente contrato.","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}}]},{"characterFormat":{"bold":true,"underline":"Single","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[]},{"characterFormat":{"bold":true,"underline":"Single","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[{"text":"SEGUNDA: Solicitud de financiación al Centro de Desarrollo Tecnológico Industrial (CDTI) ","characterFormat":{"bold":true,"underline":"Single","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[{"text":"Para el desarrollo d","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"el Proyecto, ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"MIERDA","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":" LT ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":"ha solicitado financiación mediante préstamo reembolsable y subvención parcial, a uno de los instrumentos de los que dispone el Centro para el Desarrollo Tecnológico - CDTI, (en lo sucesivo el organismo concedente), para la financiac","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"ión de proyectos generales de I+D+i, modalidad Proyectos Individuales de Investigación y Desarrollo (PID).","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[]},{"characterFormat":{"bold":true,"underline":"Single","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[{"text":"TERCERA: Condiciones de aceptación del proyecto","characterFormat":{"bold":true,"underline":"Single","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[]},{"inlines":[{"text":"Las partes aceptan la realización del Proyecto de acuerdo con el objetivo, las actividades y los tr"},{"text":"abajos a realizar, el cronograma de tareas y el presupuesto a ejecutar, por parte de "},{"text":"LDT"},{"text":" detallado en el "},{"text":"ANEXO I","characterFormat":{"italic":true}},{"text":"."}]},{"inlines":[]},{"inlines":[{"text":"La validez del presente contrato derivará única y exclusivamente de la favorable concesión de ayuda por parte del órgano instructor del org"},{"text":"anismo concedente, y en caso de ser favorable, de no haber renuncia formal y manifiesta por parte de "},{"text":"MIERDA","characterFormat":{"fontFamilyBidi":"Calibri"}},{"text":" LT ","characterFormat":{"fontFamilyBidi":"Calibri"}},{"text":"para llevar a cabo la ejecución del proyecto, en su caso, debidamente comunicada tanto al organismo concedente como a "},{"text":"LDT"},{"text":"."}]},{"inlines":[]},{"inlines":[{"text":"En función de lo an"},{"text":"terior, y para que empiecen los trabajos a desarrollar por "},{"text":"LDT"},{"text":", "},{"text":"MIERDA","characterFormat":{"fontFamilyBidi":"Calibri"}},{"text":" LT ","characterFormat":{"fontFamilyBidi":"Calibri"}},{"text":"notificará a "},{"text":"LDT"},{"text":" que la ayuda le ha sido concedida y aceptada por la misma, por lo que le pasará la notificación de concesión de la ayuda o una carta firmada por el representante"},{"text":" legal informándole de ello. "}]},{"inlines":[]},{"characterFormat":{"bold":true,"underline":"Single","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[{"text":"CUARTA: Vigencia y Duración","characterFormat":{"bold":true,"underline":"Single","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"afterSpacing":12.0,"tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[{"text":"El presente contrato entrará en vigor a la firma por parte de ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"MIERDA","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":" LT","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":"de la aceptación de la ayuda, con la notificación por escrito de ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"MIERDA","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":" LT ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":"a ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"LDT","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":" de la aceptación y firma de dicha ayuda, y","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":" la validación por parte de ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"LDT","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":" de la misma.","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[{"text":"A partir de ese momento se iniciarán los trabajos. Y el contrato tendrá una duración de 18 meses, debiéndose ejecutar los trabajos según el cronograma adjunto en el ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"ANEXO I","characterFormat":{"italic":true,"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":", siempre y cuando se le haya concedi","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"do la ayuda y ésta haya sido aceptada por ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"MIERDA","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":" LT","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":". Cualquier modificación sobre los plazos de ejecución del Proyecto indicados en dicho cronograma, deberá ser consensuada por las partes, y se recogerá en una adenda a este contrato.","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[{"text":"Una vez ejecutados co","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"mpletamente los trabajos, tal y como han sido descritos en el cronograma incorporado como ANEXO I, el presente contrato finalizará su vigencia sin que sea necesaria notificación ni comunicación alguna por ninguna de las partes.","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[{"text":"Las disposiciones de la clá","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"usula QUINTA a SÉPTIMA, DECIMOTERCERA y siguientes, subsistirán después de la terminación del presente contrato.","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[]},{"characterFormat":{"bold":true,"underline":"Single","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[{"text":"QUINTA: Confidencialidad","characterFormat":{"bold":true,"underline":"Single","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[{"text":"Tanto ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"LDT","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":" como ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"MIERDA","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":" LT ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":"se comprometen a no hacer difusión, bajo ningún concepto, de los conocimientos preexistentes de la otra parte, a las que haya podido tener acceso con ocasión del desarrollo del Proyecto, salvo que esas informaciones sean de dominio público o que la revelac","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"ión de ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"las mismas","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":" sea requerida por Ley.","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Left","position":339.6000061035156,"tabLeader":"None","deletePosition":0.0}]},"inlines":[]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[{"text":"Los resultados obtenidos durante la realización del Proyecto, tendrán carácter totalmente confidencial. Cualquier acción de difusión de los resultados tendrá que ser previa y expresamente autorizada por escrito por","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":" parte de ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"MIERDA","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":" LT.","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}}]},{"characterFormat":{"bold":true,"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[]},{"characterFormat":{"bold":true,"underline":"Single","fontFamily":"Calibri","fontFamilyBidi":"Arial"},"paragraphFormat":{"beforeSpacing":12.0,"afterSpacing":12.0},"inlines":[{"text":"SEXTA: Conocimientos Previos de las Partes","characterFormat":{"bold":true,"underline":"Single","fontFamily":"Calibri","fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontFamily":"Calibri","fontColor":"#000000FF","fontFamilyBidi":"Arial","localeId":3082},"inlines":[{"text":"Cada Parte seguirá siendo propietaria de sus Conocimientos Previos. En virtud del presente Contrato no se entienden cedidos a la otra Parte, ninguno de los Conocimientos Previos aportados al ","characterFormat":{"fontFamily":"Calibri","fontColor":"#000000FF","fontFamilyBidi":"Arial","localeId":3082}},{"text":"Proyecto (se entiende por Conocimientos Previos todo dato, conocimiento técnico o información, cualquiera  que sea su forma o naturaleza, tangible o intangible, incluido todo derecho, como los derechos de  propiedad industrial e intelectual  perteneciente ","characterFormat":{"fontFamily":"Calibri","fontColor":"#000000FF","fontFamilyBidi":"Arial","localeId":3082}},{"text":"a alguna de las Partes con anterioridad a la entrada en vigor del Contrato y que sea necesario para la ejecución del Proyecto o para la explotación de sus resultados). ","characterFormat":{"fontFamily":"Calibri","fontColor":"#000000FF","fontFamilyBidi":"Arial","localeId":3082}}]},{"characterFormat":{"bold":true,"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[]},{"characterFormat":{"bold":true,"underline":"Single","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[{"text":"SÉPTIMA: Propiedad de resultados","characterFormat":{"bold":true,"underline":"Single","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[{"text":"MIERDA","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":" LT ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":"será propietaria al cien por cien de los r","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"esultados obtenidos en la investigación. Esta adoptará la decisión con total libertad de la explotación de los mismos en función de sus intereses.","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"bold":true,"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[]},{"characterFormat":{"bold":true,"underline":"Single","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[{"text":"OCTAVA: Derechos de acceso para la realización del proyecto","characterFormat":{"bold":true,"underline":"Single","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[{"text":"Durante el tiempo de vigencia del Proyecto se c","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"onceden entre las Partes derechos de acceso gratuitos al Conocimiento y Derechos Previos y a los Resultados y Derechos Adquiridos, cuando sean necesarios para la realización de sus trabajos relacionados con el Proyecto. Dicho acceso está sujeto a las más e","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"strictas obligaciones de confidencialidad tal y como se encuentran pactadas en el presente contrato.","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[]},{"characterFormat":{"bold":true,"underline":"Single","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[{"text":"NOVENA: Importe y condiciones de pago","characterFormat":{"bold":true,"underline":"Single","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[{"text":"El presupuesto de ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"LDT","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":" para la ejecución del Proyecto, es de DIECISIETE MIL OCHOCIENTOS CINCUENTA ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"EUROS  EUROS","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":" (17","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"850,0000 €) ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"véase ANEXO I","characterFormat":{"italic":true,"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":", IVA no incluido, que se facturarán a ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"MIERDA","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":" LT,","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":" según la siguiente distribución:","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[{"editRangeId":"746063362","group":"everyone"}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial","localeId":3082},"paragraphFormat":{"styleName":"List Paragraph","listFormat":{"listLevelNumber":0,"listId":0},"tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[{"text":"Factura 1","characterFormat":{"bold":true,"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial","localeId":3082}},{"text":". Tras la firma con el CDTI el ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial","localeId":3082}},{"inlines":[{"text":"…..% ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial","localeId":3082}}],"contentControlProperties":{"lockContentControl":false,"lockContents":false,"color":"#00000000","type":"Text","hasPlaceHolderText":false,"multiline":false,"isTemporary":false,"dateCalendarType":"Gregorian","isChecked":false,"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial","localeId":3082}}},{"text":"del presupuesto total (………………,… €).","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial","localeId":3082}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial","localeId":3082},"paragraphFormat":{"styleName":"List Paragraph","listFormat":{"listLevelNumber":0,"listId":1},"tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[{"text":"Factura 2: ","characterFormat":{"bold":true,"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial","localeId":3082}},{"text":"….","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial","localeId":3082}},{"text":"% del presupuesto total (después de …. meses) …………,…. €. ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial","localeId":3082}}]},{"characterFormat":{"bold":true,"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial","localeId":3082},"paragraphFormat":{"styleName":"List Paragraph","listFormat":{"listLevelNumber":0,"listId":1},"tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[{"text":"Factura 3: ","characterFormat":{"bold":true,"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial","localeId":3082}},{"text":"….% del presupuesto total (después de …. meses) …………,…. €.","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial","localeId":3082}}]},{"characterFormat":{"bold":true,"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial","localeId":3082},"paragraphFormat":{"styleName":"List Paragraph","listFormat":{"listLevelNumber":0,"listId":1},"tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[{"text":"Factura 4: ","characterFormat":{"bold":true,"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial","localeId":3082}},{"text":"….% del presupuesto total (a la finalización de los trabajos) …………,…. €.","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial","localeId":3082}},{"editRangeId":"746063362","editableRangeStart":{"editRangeId":"746063362","group":"everyone"}}]},{"characterFormat":{"bold":true,"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial","localeId":3082},"paragraphFormat":{"tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[{"text":"Estas cantidades deberán incrementarse con el correspondiente I.V.A. vigente. ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[{"text":"MIERDA","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":" LT ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":"se compromete a realizar dichos pagos a ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"LDT","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":" a 30 días fecha de factura. ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[{"text":"Si durante el transcurso del proyecto la clasificación de la cobertura de riesgo asignada ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"por COFACE a la Empresa sufriera una variación, la forma de pago se revisará pudiendo ser modificada previo acuerdo entre ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"LDT","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":" y la Empresa. En caso de no llegarse a un acuerdo o no aceptar la Empresa las nuevas condiciones de pago propuestas por ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"LDT","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":", e","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"l contrato podrá rescindirse unilateralmente por causa justificada, dejando sin efecto desde esa fecha la realización de los trabajos programados en el Proyecto.","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"styleName":"Body Text 3"},"inlines":[{"text":"Los pagos se realizarán por transferencia bancaria a la cuenta de ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"LDT","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":" en ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"MIERDA","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"BANK, S.A., a","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":" la cuenta IBAN: ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"EN99","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"-","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"9999","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"-","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"9999","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"-","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"9999","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"-","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"9999","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"-","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"9999","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":".","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"styleName":"Body Text 3"},"inlines":[]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[{"text":"En el supuesto de incumplimiento del plazo de pago, será de aplicación la Ley 15/2010, de 5 de julio, por la que se establecen medidas de lucha contra la morosidad en las operaciones comerciales, así como un","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"a indemnización por costes de cobro previsto en el artículo 8 de la referida Ley.","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[]},{"characterFormat":{"bold":true,"underline":"Single","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[{"text":"DÉCIMA: Modificación y terminación del contrato.","characterFormat":{"bold":true,"underline":"Single","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[{"text":"Las partes podrán modificar o dar por terminado el presente contrato, por mutuo acuerdo y por escrito, dentro del periodo d","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"e vigencia del mismo.","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[]},{"characterFormat":{"bold":true,"underline":"Single","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[{"text":"UNDÉCIMA: Resolución del contrato y responsabilidad","characterFormat":{"bold":true,"underline":"Single","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[{"text":"El incumplimiento, por una de las partes, de cualquiera de las obligaciones contraídas por el presente contrato","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":", facultará a la otra para resolver el mismo, quedando facultada la parte cumplidora para reclamar los daños y perjuicios derivados del incumplimiento.","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[]},{"characterFormat":{"bold":true,"underline":"Single","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[{"text":"DUODÉCIMA: Comunicaciones","characterFormat":{"bold":true,"underline":"Single","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[{"text":"Por parte de ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"LDT","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":", los interlocutores para el Proyecto serán los siguientes","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":":","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[]},{"rows":[{"rowFormat":{"allowBreakAcrossPages":false,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"characterFormat":{"bold":true,"fontFamilyBidi":"Arial"},"paragraphFormat":{"tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[{"text":"Comunicaciones de carácter técnico:","characterFormat":{"bold":true,"fontFamilyBidi":"Arial"}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":224.6999969482422,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":224.6999969482422}},{"blocks":[{"characterFormat":{"fontFamilyBidi":"Arial"},"paragraphFormat":{"tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[{"text":"Comunicaciones de carácter administrativo:","characterFormat":{"bold":true,"fontFamilyBidi":"Arial"}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":221.1999969482422,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":221.1999969482422}}]},{"rowFormat":{"allowBreakAcrossPages":false,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"characterFormat":{"fontFamilyBidi":"Arial"},"inlines":[{"text":"Att. ","characterFormat":{"fontFamilyBidi":"Arial"}},{"text":"L E C","characterFormat":{"fontFamilyBidi":"Arial"}},{"text":" ","characterFormat":{"fontFamilyBidi":"Arial"}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":224.6999969482422,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":224.6999969482422}},{"blocks":[{"characterFormat":{"fontFamilyBidi":"Arial"},"paragraphFormat":{"tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[{"text":"Att. ","characterFormat":{"fontFamilyBidi":"Arial"}},{"text":"E A","characterFormat":{"fontFamilyBidi":"Arial"}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":221.1999969482422,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":221.1999969482422}}]},{"rowFormat":{"allowBreakAcrossPages":false,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"characterFormat":{"fontFamilyBidi":"Arial"},"paragraphFormat":{"rightIndent":-9.050000190734863},"inlines":[{"text":"Dirección: Plaza Emilio Sala, 1 Alcoy","characterFormat":{"fontFamilyBidi":"Arial"}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":224.6999969482422,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":224.6999969482422}},{"blocks":[{"characterFormat":{"fontFamilyBidi":"Arial"},"paragraphFormat":{"tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[{"text":"Dirección: Plaza Emilio Sala, 1 Alcoy.","characterFormat":{"fontFamilyBidi":"Arial"}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":221.1999969482422,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":221.1999969482422}}]},{"rowFormat":{"allowBreakAcrossPages":false,"isHeader":false,"height":4.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"characterFormat":{"fontFamilyBidi":"Arial"},"inlines":[{"text":"CP: ","characterFormat":{"fontFamilyBidi":"Arial"}},{"text":"12345","characterFormat":{"fontFamilyBidi":"Arial"}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":224.6999969482422,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":224.6999969482422}},{"blocks":[{"characterFormat":{"fontFamilyBidi":"Arial"},"paragraphFormat":{"tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[{"text":"CP:","characterFormat":{"fontFamilyBidi":"Arial"}},{"text":" 12345","characterFormat":{"fontFamilyBidi":"Arial"}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":221.1999969482422,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":221.1999969482422}}]},{"rowFormat":{"allowBreakAcrossPages":false,"isHeader":false,"height":4.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"characterFormat":{"fontFamilyBidi":"Arial"},"inlines":[{"text":"Email: ","characterFormat":{"fontFamilyBidi":"Arial"}},{"text":"lec@a.es"}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":224.6999969482422,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":224.6999969482422}},{"blocks":[{"characterFormat":{"fontFamilyBidi":"Arial"},"inlines":[{"text":"Email: ","characterFormat":{"fontFamilyBidi":"Arial"}},{"hasFieldEnd":true,"fieldType":0},{"text":"HYPERLINK \\"mailto:earanda@aitex.es\\" "},{"fieldType":2},{"text":"ea@","characterFormat":{"styleName":"Hyperlink","fontFamilyBidi":"Arial"}},{"text":"LDT","characterFormat":{"styleName":"Hyperlink","fontFamilyBidi":"Arial"}},{"text":".es","characterFormat":{"styleName":"Hyperlink","fontFamilyBidi":"Arial"}},{"fieldType":1},{"text":"        ","characterFormat":{"fontFamilyBidi":"Arial"}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":221.1999969482422,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":221.1999969482422}}]},{"rowFormat":{"allowBreakAcrossPages":false,"isHeader":false,"height":4.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"characterFormat":{"fontFamilyBidi":"Arial"},"paragraphFormat":{"tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[{"text":"Tel: ","characterFormat":{"fontFamilyBidi":"Arial"}},{"text":"12 345 67 89","characterFormat":{"fontFamilyBidi":"Arial"}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":224.6999969482422,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":224.6999969482422}},{"blocks":[{"characterFormat":{"fontFamilyBidi":"Arial","localeId":1036},"paragraphFormat":{"tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[{"text":"Tel:","characterFormat":{"fontFamilyBidi":"Arial","localeId":1036}},{"text":" ","characterFormat":{"fontFamilyBidi":"Arial","localeId":1036}},{"text":"12 345 67 89","characterFormat":{"fontFamilyBidi":"Arial","localeId":1036}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":221.1999969482422,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":221.1999969482422}}]},{"rowFormat":{"allowBreakAcrossPages":false,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"characterFormat":{"fontFamilyBidi":"Arial"},"paragraphFormat":{"tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[{"text":"Fax: ","characterFormat":{"fontFamilyBidi":"Arial"}},{"text":"98 765 43 21","characterFormat":{"fontFamilyBidi":"Arial"}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":224.6999969482422,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":224.6999969482422}},{"blocks":[{"characterFormat":{"fontFamilyBidi":"Arial"},"paragraphFormat":{"tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[{"text":"Fax: ","characterFormat":{"fontFamilyBidi":"Arial"}},{"text":"98 765 43 21","characterFormat":{"fontFamilyBidi":"Arial"}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":221.1999969482422,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":221.1999969482422}}]}],"title":null,"description":null,"tableFormat":{"allowAutoFit":true,"leftIndent":0.0,"tableAlignment":"Center","preferredWidth":445.8999938964844,"preferredWidthType":"Point","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"bidi":false,"horizontalPositionAbs":"Left","horizontalPosition":0.0}},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[{"text":"Por parte de ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"MIERDA","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":" LT","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":", el ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"interlocutor con ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"LDT","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":" en todo lo relacionado con el Proyecto será ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"Dña. R","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":" B","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":" ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":"y la dirección para la remisión de dicha documentación será:","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[]},{"rows":[{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"characterFormat":{"fontFamily":"Calibri","fontColor":"#FF0000FF","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"leftIndent":36.0,"firstLineIndent":-36.0,"tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]},"inlines":[{"text":"Dirección: Cr ","characterFormat":{"fontFamilyBidi":"Arial"}},{"text":"Mierda Santa","characterFormat":{"fontFamilyBidi":"Arial"}},{"text":" s/n ","characterFormat":{"fontFamilyBidi":"Arial"}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":445.8999938964844,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":445.8999938964844}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":4.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"characterFormat":{"fontFamilyBidi":"Arial"},"inlines":[{"text":"CP: ","characterFormat":{"fontFamilyBidi":"Arial"}},{"text":"98765","characterFormat":{"fontFamilyBidi":"Arial"}},{"text":".","characterFormat":{"fontFamilyBidi":"Arial"}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":445.8999938964844,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":445.8999938964844}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":4.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[{"text":"Email:","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":" "},{"text":"mierda@parati.net"},{"text":" ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":445.8999938964844,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":445.8999938964844}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":4.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"characterFormat":{"fontColor":"#1F497DFF","localeId":1033},"paragraphFormat":{"rightIndent":-9.050000190734863},"inlines":[{"text":"Tel: ","characterFormat":{"fontFamilyBidi":"Arial"}},{"text":"No Facilitado"},{"text":".","characterFormat":{"fontFamilyBidi":"Arial"}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":445.8999938964844,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":445.8999938964844}}]}],"title":null,"description":null,"tableFormat":{"allowAutoFit":true,"leftIndent":0.0,"tableAlignment":"Center","preferredWidth":445.8999938964844,"preferredWidthType":"Point","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"bidi":false,"horizontalPositionAbs":"Left","horizontalPosition":0.0}},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[]},{"characterFormat":{"bold":true,"underline":"Single","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[{"text":"D","characterFormat":{"bold":true,"underline":"Single","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"ECIMOTERCERA: Protección de datos personales","characterFormat":{"bold":true,"underline":"Single","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[{"text":"De conformidad con lo dispuesto en la Ley Orgánica 3/2018 de 5 de diciembre de Protección de Datos Personales y garantía de los derechos digitales y demás normativas aplicables, ambas partes se comprometen a re","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"spetar las citadas normas y a preservar absoluto secreto sobre los datos personales a los que tuviesen acceso en el ámbito de este contrato y adoptar todas las medidas necesarias, idóneas y/o simplemente convenientes, de tipo técnico y organizativo, que ga","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"ranticen su seguridad y protección.","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[]},{"characterFormat":{"bold":true,"underline":"Single","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[{"text":"DECIMOCUARTA: Jurisdicción","characterFormat":{"bold":true,"underline":"Single","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[{"text":"Las partes se comprometen a resolver amigablemente cualquier diferencia que sobre el presente contrato pueda surgir. En el caso de no ser posible una solución amigable, y resultar procedente ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"litigio judicial, ambas partes acuerdan someterse a la jurisdicción y competencia de los Tribunales de la ciudad de Alcoy, ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"con renuncia expresa a su propio fuero","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":".","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[{"text":" Y en prueba de conformidad, firman el presente contrato por duplicado y a un sólo efecto, e","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"n el lugar y fecha ut supra.","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[]},{"rows":[{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":113.4000015258789,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"characterFormat":{"bold":true,"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"textAlignment":"Center"},"inlines":[{"text":"LDT ","characterFormat":{"bold":true,"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"- ","characterFormat":{"bold":true,"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"LDT","characterFormat":{"bold":true,"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":237.60000610351562,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":237.60000610351562}},{"blocks":[{"characterFormat":{"bold":true,"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial","localeId":3082},"paragraphFormat":{"textAlignment":"Center"},"inlines":[{"text":"MIERDA","characterFormat":{"bold":true,"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":" LT, S.L.","characterFormat":{"bold":true,"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":237.3000030517578,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":237.3000030517578}}]},{"rowFormat":{"allowBreakAcrossPages":false,"isHeader":false,"height":29.799999237060547,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"characterFormat":{"bold":true,"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"textAlignment":"Center"},"inlines":[{"text":"D. ","characterFormat":{"bold":true,"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"V B J","characterFormat":{"bold":true,"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"textAlignment":"Center"},"inlines":[{"text":"Director General","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":237.60000610351562,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":237.60000610351562}},{"blocks":[{"characterFormat":{"bold":true,"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"textAlignment":"Center"},"inlines":[{"text":"Dña. R","characterFormat":{"bold":true,"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":" B","characterFormat":{"bold":true,"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"textAlignment":"Center"},"inlines":[{"text":"Gerente","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":237.3000030517578,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":237.3000030517578}}]}],"title":null,"description":null,"tableFormat":{"allowAutoFit":true,"leftIndent":0.0,"tableAlignment":"Left","preferredWidthType":"Auto","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"bidi":false,"horizontalPositionAbs":"Left","horizontalPosition":0.0}},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[]},{"rows":[{"rowFormat":{"allowBreakAcrossPages":false,"isHeader":false,"height":113.4000015258789,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"characterFormat":{"bold":true,"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"textAlignment":"Center"},"inlines":[{"text":"ASOCIACIÓN DE INVESTIGACIÓN DE LA INDUSTRIA TEXTIL- ","characterFormat":{"bold":true,"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"LDT","characterFormat":{"bold":true,"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":237.60000610351562,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":237.60000610351562}},{"blocks":[{"characterFormat":{"bold":true,"highlightColor":"Yellow","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial","localeId":3082},"paragraphFormat":{"textAlignment":"Center"},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":237.3000030517578,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":237.3000030517578}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":35.599998474121094,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"characterFormat":{"bold":true,"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial","localeId":2057},"paragraphFormat":{"textAlignment":"Center"},"inlines":[{"text":"D./Dña. ","characterFormat":{"bold":true,"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial","localeId":2057}},{"text":"L E C","characterFormat":{"bold":true,"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial","localeId":2057}},{"text":" ","characterFormat":{"bold":true,"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial","localeId":2057}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial","localeId":2057},"paragraphFormat":{"textAlignment":"Center"},"inlines":[{"text":"Project Manager","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial","localeId":2057}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":237.60000610351562,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"shading":{"texture":"TextureNone"},"cellWidth":237.60000610351562}},{"blocks":[{"characterFormat":{"bold":true,"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial","localeId":2057},"paragraphFormat":{"textAlignment":"Center"},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":237.3000030517578,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":237.3000030517578}}]}],"title":null,"description":null,"tableFormat":{"allowAutoFit":true,"leftIndent":0.0,"tableAlignment":"Left","preferredWidthType":"Auto","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"bidi":false,"horizontalPositionAbs":"Left","horizontalPosition":0.0}},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial","localeId":2057},"inlines":[]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial","localeId":2057},"inlines":[]}],"headersFooters":{"header":{"blocks":[{"paragraphFormat":{"styleName":"Header"},"inlines":[]}]},"footer":{"blocks":[{"characterFormat":{"fontSize":8.0,"fontFamily":"Calibri","fontSizeBidi":8.0,"fontFamilyBidi":"Calibri","localeId":3082},"paragraphFormat":{"textAlignment":"Center","styleName":"Footer","borders":{"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":1.0,"hasNoneStyle":false,"color":"#000000FF"}}},"inlines":[{"text":"-","characterFormat":{"fontSize":8.0,"fontFamily":"Calibri","fontSizeBidi":8.0,"fontFamilyBidi":"Calibri"}},{"text":"Anexo I","characterFormat":{"italic":true,"fontSize":8.0,"fontFamily":"Calibri","fontSizeBidi":8.0,"fontFamilyBidi":"Calibri","localeId":3082}},{"text":"-","characterFormat":{"fontSize":8.0,"fontFamily":"Calibri","fontSizeBidi":8.0,"fontFamilyBidi":"Calibri","localeId":3082}}]},{"blocks":[{"paragraphFormat":{"lineSpacing":1.1999999284744263,"lineSpacingType":"Multiple","textAlignment":"Center","styleName":"Footer"},"inlines":[{"text":"Página ","characterFormat":{"fontSize":8.0,"fontSizeBidi":8.0,"fontFamilyBidi":"Arial"}},{"hasFieldEnd":true,"characterFormat":{"bold":true,"fontSize":8.0,"boldBidi":true,"fontSizeBidi":8.0,"fontFamilyBidi":"Arial"},"fieldType":0},{"text":"PAGE","characterFormat":{"bold":true,"fontSize":8.0,"boldBidi":true,"fontSizeBidi":8.0,"fontFamilyBidi":"Arial"}},{"characterFormat":{"bold":true,"fontSize":8.0,"boldBidi":true,"fontSizeBidi":8.0,"fontFamilyBidi":"Arial"},"fieldType":2},{"text":"6","characterFormat":{"bold":true,"fontSize":8.0,"boldBidi":true,"fontSizeBidi":8.0,"fontFamilyBidi":"Arial"}},{"characterFormat":{"bold":true,"fontSize":8.0,"boldBidi":true,"fontSizeBidi":8.0,"fontFamilyBidi":"Arial"},"fieldType":1},{"text":" de ","characterFormat":{"fontSize":8.0,"fontSizeBidi":8.0,"fontFamilyBidi":"Arial"}},{"hasFieldEnd":true,"characterFormat":{"bold":true,"fontSize":8.0,"boldBidi":true,"fontSizeBidi":8.0,"fontFamilyBidi":"Arial"},"fieldType":0},{"text":"NUMPAGES","characterFormat":{"bold":true,"fontSize":8.0,"boldBidi":true,"fontSizeBidi":8.0,"fontFamilyBidi":"Arial"}},{"characterFormat":{"bold":true,"fontSize":8.0,"boldBidi":true,"fontSizeBidi":8.0,"fontFamilyBidi":"Arial"},"fieldType":2},{"text":"11","characterFormat":{"bold":true,"fontSize":8.0,"boldBidi":true,"fontSizeBidi":8.0,"fontFamilyBidi":"Arial"}},{"characterFormat":{"bold":true,"fontSize":8.0,"boldBidi":true,"fontSizeBidi":8.0,"fontFamilyBidi":"Arial"},"fieldType":1}]}],"contentControlProperties":{"lockContentControl":false,"lockContents":false,"color":"#00000000","type":"BuildingBlockGallery","hasPlaceHolderText":false,"multiline":false,"isTemporary":false,"dateCalendarType":"Gregorian","isChecked":false,"characterFormat":{"fontSize":8.0,"fontSizeBidi":8.0,"fontFamilyBidi":"Arial"}}},{"characterFormat":{"fontSize":8.0,"fontFamily":"Calibri","fontSizeBidi":8.0,"fontFamilyBidi":"Calibri"},"paragraphFormat":{"textAlignment":"Center","styleName":"Footer"},"inlines":[]}]},"evenHeader":{"blocks":[{"paragraphFormat":{"styleName":"Header"},"inlines":[]}]},"firstPageHeader":{"blocks":[{"paragraphFormat":{"styleName":"Header"},"inlines":[]}]}},"sectionFormat":{"headerDistance":42.54999923706055,"footerDistance":42.54999923706055,"pageWidth":595.3499755859375,"pageHeight":842.0,"leftMargin":56.70000076293945,"rightMargin":56.70000076293945,"topMargin":72.0,"bottomMargin":85.05000305175781,"differentFirstPage":false,"differentOddAndEvenPages":false,"bidi":false,"restartPageNumbering":false,"pageStartingNumber":0,"endnoteNumberFormat":"Arabic","footNoteNumberFormat":"Arabic","restartIndexForFootnotes":"DoNotRestart","restartIndexForEndnotes":"DoNotRestart","pageNumberStyle":"Arabic","columns":{"column":[{"width":481.95001220703125,"space":36.0}],"numberOfColumns":1,"equalWidth":true}}},{"blocks":[{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial","localeId":2057},"inlines":[{"editRangeId":"424941776","group":"everyone"}]},{"rows":[{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"characterFormat":{"bold":true,"italic":true,"underline":"Single","fontSize":24.0,"fontFamily":"Calibri","fontColor":"#FFFFFFFF","fontSizeBidi":18.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"textAlignment":"Center","tabs":[{"tabJustification":"Right","position":311.8500061035156,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Right","position":481.95001220703125,"tabLeader":"None","deletePosition":0.0}]},"inlines":[{"text":"ANEXO I","characterFormat":{"bold":true,"italic":true,"underline":"Single","fontSize":24.0,"fontFamily":"Calibri","fontColor":"#FFFFFFFF","fontSizeBidi":18.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"bold":true,"italic":true,"fontSize":13.0,"fontFamily":"Calibri","fontColor":"#FFFFFFFF","fontSizeBidi":13.0,"fontFamilyBidi":"Calibri"},"paragraphFormat":{"textAlignment":"Center"},"inlines":[]},{"characterFormat":{"bold":true,"italic":true,"fontSize":13.0,"fontFamily":"Calibri","fontColor":"#FFFFFFFF","fontSizeBidi":13.0,"fontFamilyBidi":"Calibri"},"paragraphFormat":{"textAlignment":"Center"},"inlines":[{"text":"TAREAS A REALIZAR","characterFormat":{"bold":true,"italic":true,"fontSize":13.0,"fontFamily":"Calibri","fontColor":"#FFFFFFFF","fontSizeBidi":13.0,"fontFamilyBidi":"Calibri"}},{"text":" POR ","characterFormat":{"bold":true,"italic":true,"fontSize":13.0,"fontFamily":"Calibri","fontColor":"#FFFFFFFF","fontSizeBidi":13.0,"fontFamilyBidi":"Calibri"}},{"text":"LDT","characterFormat":{"bold":true,"italic":true,"fontSize":13.0,"fontFamily":"Calibri","fontColor":"#FFFFFFFF","fontSizeBidi":13.0,"fontFamilyBidi":"Calibri"}},{"text":" EN EL PROYECTO","characterFormat":{"bold":true,"italic":true,"fontSize":13.0,"fontFamily":"Calibri","fontColor":"#FFFFFFFF","fontSizeBidi":13.0,"fontFamilyBidi":"Calibri"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial","localeId":2057},"paragraphFormat":{"textAlignment":"Center"},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":481.45001220703125,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"shading":{"texture":"TextureSolid","foregroundColor":"#F79646FF"},"cellWidth":481.45001220703125}}]}],"title":null,"description":null,"tableFormat":{"allowAutoFit":true,"leftIndent":0.0,"tableAlignment":"Left","preferredWidthType":"Auto","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"vertical":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"horizontal":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"shading":{"texture":"TextureSolid"},"bidi":false,"horizontalPositionAbs":"Left","horizontalPosition":0.0}},{"characterFormat":{"bold":true,"underline":"Single","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"beforeSpacing":6.0,"afterSpacing":6.0,"lineSpacing":12.0,"lineSpacingType":"AtLeast","contextualSpacing":true},"inlines":[]},{"characterFormat":{"bold":true,"underline":"Single","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"beforeSpacing":6.0,"afterSpacing":6.0,"lineSpacing":12.0,"lineSpacingType":"AtLeast","contextualSpacing":true},"inlines":[{"text":"OBJETIVO DEL PROYECTO:","characterFormat":{"bold":true,"underline":"Single","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"beforeSpacing":6.0,"afterSpacing":6.0,"lineSpacing":12.0,"lineSpacingType":"AtLeast","contextualSpacing":true},"inlines":[]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"},"inlines":[{"text":"En el marco de realización del proyecto “","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":"ACRONIMO-NOMBRE DEL PROYECTO","characterFormat":{"highlightColor":"Yellow","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"”","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":", se establecen las condiciones de colaboración entre ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":"la Empresa","characterFormat":{"highlightColor":"Yellow","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":" y ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":"LDT","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":" que se detallan en este documento.","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}}]},{"characterFormat":{"fontColor":"#FF0000FF","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[]},{"characterFormat":{"fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"lineSpacing":1.149999976158142,"lineSpacingType":"Multiple"},"inlines":[{"text":"El objetivo principal de","characterFormat":{"fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"l presente proyecto se centra en la investigación y desarrollo ","characterFormat":{"fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"……………………………………………………….","characterFormat":{"highlightColor":"Yellow","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"lineSpacing":1.149999976158142,"lineSpacingType":"Multiple"},"inlines":[{"text":" ","characterFormat":{"fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"lineSpacing":1.149999976158142,"lineSpacingType":"Multiple"},"inlines":[{"text":"En concreto, se estudiará: ","characterFormat":{"fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[]},{"characterFormat":{"bold":true,"fontSize":11.0,"fontFamily":"Arial Narrow","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082},"paragraphFormat":{"lineSpacing":1.149999976158142,"lineSpacingType":"Multiple"},"inlines":[{"text":"…………………………………..","characterFormat":{"bold":true,"highlightColor":"Yellow","fontSize":11.0,"fontFamily":"Arial Narrow","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082}}]},{"characterFormat":{"bold":true,"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"},"inlines":[]},{"characterFormat":{"bold":true,"underline":"Single","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"beforeSpacing":6.0,"afterSpacing":6.0,"lineSpacing":12.0,"lineSpacingType":"AtLeast","contextualSpacing":true},"inlines":[{"text":"FASES/ACTIVIDADES DEL PROYECTO EN LAS QUE PARTICIPA ","characterFormat":{"bold":true,"underline":"Single","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"LDT","characterFormat":{"bold":true,"underline":"Single","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"beforeSpacing":6.0,"afterSpacing":6.0,"lineSpacing":12.0,"lineSpacingType":"AtLeast","contextualSpacing":true},"inlines":[]},{"characterFormat":{"highlightColor":"Yellow","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"},"inlines":[{"text":"Descripción de las Fases del Proyecto en las que participa ","characterFormat":{"highlightColor":"Yellow","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":"LDT","characterFormat":{"highlightColor":"Yellow","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":".","characterFormat":{"highlightColor":"Yellow","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}}]},{"characterFormat":{"highlightColor":"Yellow","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"},"inlines":[]},{"characterFormat":{"highlightColor":"Yellow","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"},"inlines":[]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"},"inlines":[{"text":"La Empresa","characterFormat":{"highlightColor":"Yellow","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":" solicita la participación de ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":"LDT","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":" para la realización de las FASES ","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":"…, ","characterFormat":{"highlightColor":"Yellow","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":"…,  y","characterFormat":{"highlightColor":"Yellow","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":" …","characterFormat":{"highlightColor":"Yellow","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":" del presente proyecto","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}},{"text":", según resumido en la siguiente tabla:","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"},"inlines":[]},{"rows":[{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":12.850000381469727,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"characterFormat":{"bold":true,"fontSize":10.0,"fontColor":"#FFFFFFFF","fontFamilyBidi":"Arial"},"paragraphFormat":{"textAlignment":"Center"},"inlines":[{"text":"ACTIVIDAD / FASE","characterFormat":{"bold":true,"fontSize":10.0,"fontColor":"#FFFFFFFF","fontFamilyBidi":"Arial"}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":79.5999984741211,"preferredWidthType":"Point","verticalAlignment":"Center","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"Single","lineWidth":0.25,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#4BACC6FF"},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"shading":{"texture":"TextureNone","backgroundColor":"#F79646FF"},"cellWidth":79.5999984741211}},{"blocks":[{"characterFormat":{"bold":true,"fontSize":10.0,"fontColor":"#FFFFFFFF","fontFamilyBidi":"Arial"},"paragraphFormat":{"textAlignment":"Center"},"inlines":[{"text":"TAREA","characterFormat":{"bold":true,"fontSize":10.0,"fontColor":"#FFFFFFFF","fontFamilyBidi":"Arial"}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":41.599998474121094,"preferredWidthType":"Point","verticalAlignment":"Center","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"Single","lineWidth":0.25,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#4BACC6FF"},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"shading":{"texture":"TextureNone","backgroundColor":"#F79646FF"},"cellWidth":41.599998474121094}},{"blocks":[{"characterFormat":{"bold":true,"fontSize":10.0,"fontColor":"#FFFFFFFF","fontFamilyBidi":"Arial"},"paragraphFormat":{"textAlignment":"Center"},"inlines":[{"text":"TRABAJO PRINCIPAL A DESARROLLAR","characterFormat":{"bold":true,"fontSize":10.0,"fontColor":"#FFFFFFFF","fontFamilyBidi":"Arial"}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":312.6499938964844,"preferredWidthType":"Point","verticalAlignment":"Center","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"Single","lineWidth":0.25,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#4BACC6FF"},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"shading":{"texture":"TextureNone","backgroundColor":"#F79646FF"},"cellWidth":312.6499938964844}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":3.5,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"characterFormat":{"highlightColor":"Yellow","fontSize":10.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"textAlignment":"Center"},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":79.5999984741211,"preferredWidthType":"Point","verticalAlignment":"Center","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"top":{"lineStyle":"Single","lineWidth":0.25,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#4BACC6FF"},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":79.5999984741211}},{"blocks":[{"characterFormat":{"highlightColor":"Yellow","fontSize":10.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"lineSpacing":1.149999976158142,"lineSpacingType":"Multiple"},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":41.599998474121094,"preferredWidthType":"Point","verticalAlignment":"Center","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"top":{"lineStyle":"Single","lineWidth":0.25,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#4BACC6FF"},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":41.599998474121094}},{"blocks":[{"characterFormat":{"highlightColor":"Yellow","fontSize":10.0,"fontSizeBidi":9.0,"fontFamilyBidi":"Arial","localeId":3082},"paragraphFormat":{"lineSpacing":1.149999976158142,"lineSpacingType":"Multiple"},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":312.6499938964844,"preferredWidthType":"Point","verticalAlignment":"Center","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"top":{"lineStyle":"Single","lineWidth":0.25,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#4BACC6FF"},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":312.6499938964844}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":3.5,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"characterFormat":{"highlightColor":"Yellow","fontSize":10.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"textAlignment":"Center"},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":79.5999984741211,"preferredWidthType":"Point","verticalAlignment":"Center","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"top":{"lineStyle":"Single","lineWidth":0.25,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#4BACC6FF"},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":79.5999984741211}},{"blocks":[{"characterFormat":{"highlightColor":"Yellow","fontSize":10.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"lineSpacing":1.149999976158142,"lineSpacingType":"Multiple","textAlignment":"Center"},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":41.599998474121094,"preferredWidthType":"Point","verticalAlignment":"Center","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"top":{"lineStyle":"Single","lineWidth":0.25,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#4BACC6FF"},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":41.599998474121094}},{"blocks":[{"characterFormat":{"highlightColor":"Yellow","fontSize":10.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"lineSpacing":1.149999976158142,"lineSpacingType":"Multiple"},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":312.6499938964844,"preferredWidthType":"Point","verticalAlignment":"Center","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"top":{"lineStyle":"Single","lineWidth":0.25,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#4BACC6FF"},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":312.6499938964844}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":3.5,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"characterFormat":{"highlightColor":"Yellow","fontSize":10.0,"fontFamilyBidi":"Arial","localeId":3082},"paragraphFormat":{"textAlignment":"Center"},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":79.5999984741211,"preferredWidthType":"Point","verticalAlignment":"Center","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":79.5999984741211}},{"blocks":[{"characterFormat":{"highlightColor":"Yellow","fontSize":10.0,"fontFamilyBidi":"Arial","localeId":3082},"paragraphFormat":{"lineSpacing":1.149999976158142,"lineSpacingType":"Multiple","textAlignment":"Center"},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":41.599998474121094,"preferredWidthType":"Point","verticalAlignment":"Center","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":41.599998474121094}},{"blocks":[{"characterFormat":{"highlightColor":"Yellow","fontSize":10.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"lineSpacing":1.149999976158142,"lineSpacingType":"Multiple"},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":312.6499938964844,"preferredWidthType":"Point","verticalAlignment":"Center","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":312.6499938964844}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":3.5,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"characterFormat":{"highlightColor":"Yellow","fontSize":10.0,"fontFamilyBidi":"Arial","localeId":3082},"paragraphFormat":{"textAlignment":"Center"},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":79.5999984741211,"preferredWidthType":"Point","verticalAlignment":"Center","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":79.5999984741211}},{"blocks":[{"characterFormat":{"highlightColor":"Yellow","fontSize":10.0,"fontFamilyBidi":"Arial","localeId":3082},"paragraphFormat":{"lineSpacing":1.149999976158142,"lineSpacingType":"Multiple","textAlignment":"Center"},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":41.599998474121094,"preferredWidthType":"Point","verticalAlignment":"Center","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":41.599998474121094}},{"blocks":[{"characterFormat":{"highlightColor":"Yellow","fontSize":10.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"lineSpacing":1.149999976158142,"lineSpacingType":"Multiple"},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":312.6499938964844,"preferredWidthType":"Point","verticalAlignment":"Center","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":312.6499938964844}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":3.5,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"characterFormat":{"highlightColor":"Yellow","fontSize":10.0,"fontFamilyBidi":"Arial","localeId":3082},"paragraphFormat":{"textAlignment":"Center"},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":79.5999984741211,"preferredWidthType":"Point","verticalAlignment":"Center","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":79.5999984741211}},{"blocks":[{"characterFormat":{"highlightColor":"Yellow","fontSize":10.0,"fontFamilyBidi":"Arial","localeId":3082},"paragraphFormat":{"lineSpacing":1.5,"lineSpacingType":"Multiple","textAlignment":"Center"},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":41.599998474121094,"preferredWidthType":"Point","verticalAlignment":"Center","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":41.599998474121094}},{"blocks":[{"characterFormat":{"highlightColor":"Yellow","fontSize":10.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"lineSpacing":1.149999976158142,"lineSpacingType":"Multiple"},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":312.6499938964844,"preferredWidthType":"Point","verticalAlignment":"Center","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#F79646FF"},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":312.6499938964844}}]}],"title":null,"description":null,"tableFormat":{"allowAutoFit":true,"leftIndent":0.0,"tableAlignment":"Center","preferredWidth":433.8500061035156,"preferredWidthType":"Point","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"bidi":false,"horizontalPositionAbs":"Left","horizontalPosition":0.0}},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"},"inlines":[]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"},"inlines":[]},{"characterFormat":{"fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"lineSpacing":1.149999976158142,"lineSpacingType":"Multiple"},"inlines":[]},{"characterFormat":{"bold":true,"underline":"Single","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"beforeSpacing":6.0,"afterSpacing":6.0,"lineSpacing":12.0,"lineSpacingType":"AtLeast","contextualSpacing":true},"inlines":[{"text":"CRONOGRAMA DE EJECUCIÓN DE LOS TRABAJOS A REALIZAR POR ","characterFormat":{"bold":true,"underline":"Single","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"LDT","characterFormat":{"bold":true,"underline":"Single","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"contextualSpacing":true},"inlines":[]},{"characterFormat":{"fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"contextualSpacing":true},"inlines":[{"text":"A fin de dejar constancia del cronograma total de ejecución del proyecto, y la participación de ","characterFormat":{"fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"LDT","characterFormat":{"fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":", se adjunta el cronograma íntegro del proyecto.","characterFormat":{"fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontSize":11.0,"fontSizeBidi":11.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"contextualSpacing":true},"inlines":[]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"contextualSpacing":true},"inlines":[{"text":"Adjuntar cronograma participación ","characterFormat":{"highlightColor":"Yellow","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"LDT","characterFormat":{"highlightColor":"Yellow","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"contextualSpacing":true},"inlines":[]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"contextualSpacing":true},"inlines":[]},{"characterFormat":{"bold":true,"underline":"Single","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[{"text":"PRESUPUESTO DE ","characterFormat":{"bold":true,"underline":"Single","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"LDT","characterFormat":{"bold":true,"underline":"Single","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":" PARA SU PARTICIPACIÓN EN EL PROYECTO","characterFormat":{"bold":true,"underline":"Single","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"contextualSpacing":true},"inlines":[]},{"characterFormat":{"fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"lineSpacing":1.149999976158142,"lineSpacingType":"Multiple"},"inlines":[{"text":"A co","characterFormat":{"fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"text":"ntinuación, se detalla el coste económico de cada una de las Fases a desarrollar:","characterFormat":{"fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}}]},{"characterFormat":{"highlightColor":"Yellow","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"},"inlines":[]},{"rows":[{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":19.850000381469727,"heightType":"AtLeast","borders":{"left":{"lineStyle":"Single","lineWidth":2.25,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"right":{"lineStyle":"Single","lineWidth":2.25,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"top":{"lineStyle":"Single","lineWidth":2.25,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"bottom":{"lineStyle":"Single","lineWidth":2.25,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"vertical":{"lineStyle":"Single","lineWidth":0.75,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"horizontal":{"lineStyle":"Single","lineWidth":0.75,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"characterFormat":{"fontSize":11.0,"fontFamily":"Arial Narrow","fontColor":"#00000000","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082},"paragraphFormat":{"lineSpacing":1.1999999284744263,"lineSpacingType":"Multiple"},"inlines":[{"text":"FASE","characterFormat":{"fontSize":11.0,"fontFamily":"Arial Narrow","fontColor":"#00000000","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":13.300000190734863,"preferredWidthType":"Percent","verticalAlignment":"Center","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"shading":{"texture":"TextureNone","backgroundColor":"#D9D9D9FF"},"cellWidth":64.11651611328125}},{"blocks":[{"characterFormat":{"fontSize":11.0,"fontFamily":"Arial Narrow","fontColor":"#00000000","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082},"paragraphFormat":{"lineSpacing":1.1999999284744263,"lineSpacingType":"Multiple"},"inlines":[{"text":"………………………………….","characterFormat":{"highlightColor":"Yellow","fontSize":11.0,"fontFamily":"Arial Narrow","fontColor":"#00000000","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":70.30000305175781,"preferredWidthType":"Percent","verticalAlignment":"Center","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"shading":{"texture":"TextureNone","backgroundColor":"#D9D9D9FF"},"cellWidth":338.8014831542969}},{"blocks":[{"characterFormat":{"fontSize":11.0,"fontFamily":"Arial Narrow","fontColor":"#00000000","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082},"paragraphFormat":{"lineSpacing":1.1999999284744263,"lineSpacingType":"Multiple","textAlignment":"Right"},"inlines":[{"text":"IMPORTE","characterFormat":{"fontSize":11.0,"fontFamily":"Arial Narrow","fontColor":"#00000000","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":16.399999618530273,"preferredWidthType":"Percent","verticalAlignment":"Center","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"shading":{"texture":"TextureNone","backgroundColor":"#D9D9D9FF"},"cellWidth":79.031982421875}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":19.850000381469727,"heightType":"AtLeast","borders":{"left":{"lineStyle":"Single","lineWidth":2.25,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"right":{"lineStyle":"Single","lineWidth":2.25,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"top":{"lineStyle":"Single","lineWidth":2.25,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"bottom":{"lineStyle":"Single","lineWidth":2.25,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"vertical":{"lineStyle":"Single","lineWidth":0.75,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"horizontal":{"lineStyle":"Single","lineWidth":0.75,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"characterFormat":{"bold":false,"fontSize":11.0,"fontFamily":"Arial Narrow","fontColor":"#FFFFFFFF","boldBidi":false,"fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082},"paragraphFormat":{"lineSpacing":1.1999999284744263,"lineSpacingType":"Multiple"},"inlines":[{"text":"FASE 1.-","characterFormat":{"fontSize":11.0,"fontFamily":"Arial Narrow","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082}},{"text":" ","characterFormat":{"bold":false,"fontSize":11.0,"fontFamily":"Arial Narrow","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":13.300000190734863,"preferredWidthType":"Percent","verticalAlignment":"Center","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"shading":{"texture":"TextureNone"},"cellWidth":64.11651611328125}},{"blocks":[{"characterFormat":{"fontSize":11.0,"fontFamily":"Arial Narrow","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082},"paragraphFormat":{"lineSpacing":1.1999999284744263,"lineSpacingType":"Multiple"},"inlines":[{"text":"…………………………………","characterFormat":{"highlightColor":"Yellow","fontSize":11.0,"fontFamily":"Arial Narrow","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":70.30000305175781,"preferredWidthType":"Percent","verticalAlignment":"Center","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"shading":{"texture":"TextureNone"},"cellWidth":338.8014831542969}},{"blocks":[{"characterFormat":{"fontSize":11.0,"fontFamily":"Arial Narrow","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082},"paragraphFormat":{"lineSpacing":1.1999999284744263,"lineSpacingType":"Multiple","textAlignment":"Right"},"inlines":[{"text":"…………","characterFormat":{"highlightColor":"Yellow","fontSize":11.0,"fontFamily":"Arial Narrow","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082}},{"text":" €","characterFormat":{"fontSize":11.0,"fontFamily":"Arial Narrow","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":16.399999618530273,"preferredWidthType":"Percent","verticalAlignment":"Center","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"shading":{"texture":"TextureNone"},"cellWidth":79.031982421875}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":19.850000381469727,"heightType":"AtLeast","borders":{"left":{"lineStyle":"Single","lineWidth":2.25,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"right":{"lineStyle":"Single","lineWidth":2.25,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"top":{"lineStyle":"Single","lineWidth":2.25,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"bottom":{"lineStyle":"Single","lineWidth":2.25,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"vertical":{"lineStyle":"Single","lineWidth":0.75,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"horizontal":{"lineStyle":"Single","lineWidth":0.75,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"characterFormat":{"bold":false,"fontSize":11.0,"fontFamily":"Arial Narrow","boldBidi":false,"fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082},"paragraphFormat":{"lineSpacing":1.1999999284744263,"lineSpacingType":"Multiple"},"inlines":[{"text":"FASE 2.-","characterFormat":{"fontSize":11.0,"fontFamily":"Arial Narrow","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082}},{"text":" ","characterFormat":{"bold":false,"fontSize":11.0,"fontFamily":"Arial Narrow","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082}}]}],"cellFormat":{"columnSpan":1,"rowSpan":2,"preferredWidth":13.300000190734863,"preferredWidthType":"Percent","verticalAlignment":"Center","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"shading":{"texture":"TextureNone","backgroundColor":"#FFFFFFFF"},"cellWidth":64.11651611328125}},{"blocks":[{"characterFormat":{"fontSize":11.0,"fontFamily":"Arial Narrow","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082},"paragraphFormat":{"lineSpacing":1.1999999284744263,"lineSpacingType":"Multiple"},"inlines":[{"text":"…………………………………","characterFormat":{"highlightColor":"Yellow","fontSize":11.0,"fontFamily":"Arial Narrow","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":70.30000305175781,"preferredWidthType":"Percent","verticalAlignment":"Center","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"shading":{"texture":"TextureNone","backgroundColor":"#FFFFFFFF"},"cellWidth":338.8014831542969}},{"blocks":[{"characterFormat":{"fontSize":11.0,"fontFamily":"Arial Narrow","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082},"paragraphFormat":{"lineSpacing":1.1999999284744263,"lineSpacingType":"Multiple","textAlignment":"Right"},"inlines":[{"text":"…………","characterFormat":{"highlightColor":"Yellow","fontSize":11.0,"fontFamily":"Arial Narrow","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082}},{"text":" €","characterFormat":{"fontSize":11.0,"fontFamily":"Arial Narrow","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":16.399999618530273,"preferredWidthType":"Percent","verticalAlignment":"Center","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"shading":{"texture":"TextureNone","backgroundColor":"#FFFFFFFF"},"cellWidth":79.031982421875}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":19.850000381469727,"heightType":"AtLeast","borders":{"left":{"lineStyle":"Single","lineWidth":2.25,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"right":{"lineStyle":"Single","lineWidth":2.25,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"top":{"lineStyle":"Single","lineWidth":2.25,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"bottom":{"lineStyle":"Single","lineWidth":2.25,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"vertical":{"lineStyle":"Single","lineWidth":0.75,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"horizontal":{"lineStyle":"Single","lineWidth":0.75,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"characterFormat":{"fontSize":11.0,"fontFamily":"Arial Narrow","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082},"paragraphFormat":{"lineSpacing":1.1999999284744263,"lineSpacingType":"Multiple"},"inlines":[{"text":"…………………………………","characterFormat":{"highlightColor":"Yellow","fontSize":11.0,"fontFamily":"Arial Narrow","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":70.30000305175781,"preferredWidthType":"Percent","verticalAlignment":"Center","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"shading":{"texture":"TextureNone","backgroundColor":"#FFFFFFFF"},"cellWidth":338.8014831542969}},{"blocks":[{"characterFormat":{"fontSize":11.0,"fontFamily":"Arial Narrow","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082},"paragraphFormat":{"lineSpacing":1.1999999284744263,"lineSpacingType":"Multiple","textAlignment":"Right"},"inlines":[{"text":"…………","characterFormat":{"highlightColor":"Yellow","fontSize":11.0,"fontFamily":"Arial Narrow","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082}},{"text":" €","characterFormat":{"fontSize":11.0,"fontFamily":"Arial Narrow","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":16.399999618530273,"preferredWidthType":"Percent","verticalAlignment":"Center","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"shading":{"texture":"TextureNone","backgroundColor":"#FFFFFFFF"},"cellWidth":79.031982421875}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":19.850000381469727,"heightType":"AtLeast","borders":{"left":{"lineStyle":"Single","lineWidth":2.25,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"right":{"lineStyle":"Single","lineWidth":2.25,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"top":{"lineStyle":"Single","lineWidth":2.25,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"bottom":{"lineStyle":"Single","lineWidth":2.25,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"vertical":{"lineStyle":"Single","lineWidth":0.75,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"horizontal":{"lineStyle":"Single","lineWidth":0.75,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"characterFormat":{"bold":false,"fontSize":11.0,"fontFamily":"Arial Narrow","boldBidi":false,"fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082},"paragraphFormat":{"lineSpacing":1.1999999284744263,"lineSpacingType":"Multiple"},"inlines":[{"text":"FASE 3.-","characterFormat":{"fontSize":11.0,"fontFamily":"Arial Narrow","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082}},{"text":" ","characterFormat":{"bold":false,"fontSize":11.0,"fontFamily":"Arial Narrow","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082}}]}],"cellFormat":{"columnSpan":1,"rowSpan":2,"preferredWidth":13.300000190734863,"preferredWidthType":"Percent","verticalAlignment":"Center","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"shading":{"texture":"TextureNone","backgroundColor":"#FFFFFFFF"},"cellWidth":64.11651611328125}},{"blocks":[{"characterFormat":{"fontSize":11.0,"fontFamily":"Arial Narrow","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082},"paragraphFormat":{"lineSpacing":1.1999999284744263,"lineSpacingType":"Multiple"},"inlines":[{"text":"…………………………………","characterFormat":{"highlightColor":"Yellow","fontSize":11.0,"fontFamily":"Arial Narrow","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":70.30000305175781,"preferredWidthType":"Percent","verticalAlignment":"Center","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"shading":{"texture":"TextureNone","backgroundColor":"#FFFFFFFF"},"cellWidth":338.8014831542969}},{"blocks":[{"characterFormat":{"fontSize":11.0,"fontFamily":"Arial Narrow","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082},"paragraphFormat":{"lineSpacing":1.1999999284744263,"lineSpacingType":"Multiple","textAlignment":"Right"},"inlines":[{"text":"…………","characterFormat":{"highlightColor":"Yellow","fontSize":11.0,"fontFamily":"Arial Narrow","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082}},{"text":" €","characterFormat":{"fontSize":11.0,"fontFamily":"Arial Narrow","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":16.399999618530273,"preferredWidthType":"Percent","verticalAlignment":"Center","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"shading":{"texture":"TextureNone","backgroundColor":"#FFFFFFFF"},"cellWidth":79.031982421875}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":19.850000381469727,"heightType":"AtLeast","borders":{"left":{"lineStyle":"Single","lineWidth":2.25,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"right":{"lineStyle":"Single","lineWidth":2.25,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"top":{"lineStyle":"Single","lineWidth":2.25,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"bottom":{"lineStyle":"Single","lineWidth":2.25,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"vertical":{"lineStyle":"Single","lineWidth":0.75,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"horizontal":{"lineStyle":"Single","lineWidth":0.75,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"inlines":[{"text":"…………………………………","characterFormat":{"highlightColor":"Yellow","fontSize":11.0,"fontFamily":"Arial Narrow","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":70.30000305175781,"preferredWidthType":"Percent","verticalAlignment":"Top","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"shading":{"texture":"TextureNone","backgroundColor":"#FFFFFFFF"},"cellWidth":338.8014831542969}},{"blocks":[{"characterFormat":{"fontSize":11.0,"fontFamily":"Arial Narrow","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082},"paragraphFormat":{"lineSpacing":1.1999999284744263,"lineSpacingType":"Multiple","textAlignment":"Right"},"inlines":[{"text":"…………","characterFormat":{"highlightColor":"Yellow","fontSize":11.0,"fontFamily":"Arial Narrow","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082}},{"text":" €","characterFormat":{"fontSize":11.0,"fontFamily":"Arial Narrow","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":16.399999618530273,"preferredWidthType":"Percent","verticalAlignment":"Center","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"shading":{"texture":"TextureNone","backgroundColor":"#FFFFFFFF"},"cellWidth":79.031982421875}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":19.850000381469727,"heightType":"AtLeast","borders":{"left":{"lineStyle":"Single","lineWidth":2.25,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"right":{"lineStyle":"Single","lineWidth":2.25,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"top":{"lineStyle":"Single","lineWidth":2.25,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"bottom":{"lineStyle":"Single","lineWidth":2.25,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"vertical":{"lineStyle":"Single","lineWidth":0.75,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"horizontal":{"lineStyle":"Single","lineWidth":0.75,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"characterFormat":{"bold":false,"fontSize":11.0,"fontFamily":"Arial Narrow","boldBidi":false,"fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082},"paragraphFormat":{"lineSpacing":1.1999999284744263,"lineSpacingType":"Multiple"},"inlines":[{"text":"FASE 4.-","characterFormat":{"fontSize":11.0,"fontFamily":"Arial Narrow","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082}},{"text":" ","characterFormat":{"bold":false,"fontSize":11.0,"fontFamily":"Arial Narrow","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082}}]}],"cellFormat":{"columnSpan":1,"rowSpan":2,"preferredWidth":13.300000190734863,"preferredWidthType":"Percent","verticalAlignment":"Center","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"shading":{"texture":"TextureNone","backgroundColor":"#FFFFFFFF"},"cellWidth":64.11651611328125}},{"blocks":[{"inlines":[{"text":"…………………………………","characterFormat":{"highlightColor":"Yellow","fontSize":11.0,"fontFamily":"Arial Narrow","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":70.30000305175781,"preferredWidthType":"Percent","verticalAlignment":"Top","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"shading":{"texture":"TextureNone","backgroundColor":"#FFFFFFFF"},"cellWidth":338.8014831542969}},{"blocks":[{"characterFormat":{"fontSize":11.0,"fontFamily":"Arial Narrow","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082},"paragraphFormat":{"lineSpacing":1.1999999284744263,"lineSpacingType":"Multiple","textAlignment":"Right"},"inlines":[{"text":"…………","characterFormat":{"highlightColor":"Yellow","fontSize":11.0,"fontFamily":"Arial Narrow","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082}},{"text":" €","characterFormat":{"fontSize":11.0,"fontFamily":"Arial Narrow","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":16.399999618530273,"preferredWidthType":"Percent","verticalAlignment":"Center","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"shading":{"texture":"TextureNone","backgroundColor":"#FFFFFFFF"},"cellWidth":79.031982421875}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":19.850000381469727,"heightType":"AtLeast","borders":{"left":{"lineStyle":"Single","lineWidth":2.25,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"right":{"lineStyle":"Single","lineWidth":2.25,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"top":{"lineStyle":"Single","lineWidth":2.25,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"bottom":{"lineStyle":"Single","lineWidth":2.25,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"vertical":{"lineStyle":"Single","lineWidth":0.75,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"horizontal":{"lineStyle":"Single","lineWidth":0.75,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"characterFormat":{"fontSize":11.0,"fontFamily":"Arial Narrow","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082},"paragraphFormat":{"lineSpacing":1.1999999284744263,"lineSpacingType":"Multiple"},"inlines":[{"text":"…………………………………","characterFormat":{"highlightColor":"Yellow","fontSize":11.0,"fontFamily":"Arial Narrow","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":70.30000305175781,"preferredWidthType":"Percent","verticalAlignment":"Center","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"shading":{"texture":"TextureNone","backgroundColor":"#FFFFFFFF"},"cellWidth":338.8014831542969}},{"blocks":[{"characterFormat":{"fontSize":11.0,"fontFamily":"Arial Narrow","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082},"paragraphFormat":{"lineSpacing":1.1999999284744263,"lineSpacingType":"Multiple","textAlignment":"Right"},"inlines":[{"text":"…………","characterFormat":{"highlightColor":"Yellow","fontSize":11.0,"fontFamily":"Arial Narrow","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082}},{"text":" €","characterFormat":{"fontSize":11.0,"fontFamily":"Arial Narrow","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":16.399999618530273,"preferredWidthType":"Percent","verticalAlignment":"Center","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"shading":{"texture":"TextureNone","backgroundColor":"#FFFFFFFF"},"cellWidth":79.031982421875}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":19.850000381469727,"heightType":"AtLeast","borders":{"left":{"lineStyle":"Single","lineWidth":2.25,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"right":{"lineStyle":"Single","lineWidth":2.25,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"top":{"lineStyle":"Single","lineWidth":2.25,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"bottom":{"lineStyle":"Single","lineWidth":2.25,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"vertical":{"lineStyle":"Single","lineWidth":0.75,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"horizontal":{"lineStyle":"Single","lineWidth":0.75,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"characterFormat":{"fontSize":11.0,"fontFamily":"Arial Narrow","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082},"paragraphFormat":{"lineSpacing":1.1999999284744263,"lineSpacingType":"Multiple","textAlignment":"Right"},"inlines":[{"text":"TOTAL","characterFormat":{"fontSize":11.0,"fontFamily":"Arial Narrow","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082}}]}],"cellFormat":{"columnSpan":2,"rowSpan":1,"preferredWidth":83.5999984741211,"preferredWidthType":"Percent","verticalAlignment":"Center","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"shading":{"texture":"TextureNone","backgroundColor":"#D9D9D9FF"},"cellWidth":402.91796875}},{"blocks":[{"characterFormat":{"bold":true,"fontSize":11.0,"fontFamily":"Arial Narrow","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082},"paragraphFormat":{"lineSpacing":1.1999999284744263,"lineSpacingType":"Multiple","textAlignment":"Right"},"inlines":[{"text":"…………","characterFormat":{"bold":true,"highlightColor":"Yellow","fontSize":11.0,"fontFamily":"Arial Narrow","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082}},{"text":" €","characterFormat":{"bold":true,"fontSize":11.0,"fontFamily":"Arial Narrow","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":3082}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":16.399999618530273,"preferredWidthType":"Percent","verticalAlignment":"Center","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"shading":{"texture":"TextureNone","backgroundColor":"#D9D9D9FF"},"cellWidth":79.031982421875}}]}],"title":null,"description":null,"tableFormat":{"allowAutoFit":true,"leftIndent":0.0,"tableAlignment":"Left","preferredWidth":100.0,"preferredWidthType":"Percent","borders":{"left":{"lineStyle":"Single","lineWidth":2.25,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"right":{"lineStyle":"Single","lineWidth":2.25,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"top":{"lineStyle":"Single","lineWidth":2.25,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"bottom":{"lineStyle":"Single","lineWidth":2.25,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"vertical":{"lineStyle":"Single","lineWidth":0.75,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"horizontal":{"lineStyle":"Single","lineWidth":0.75,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"bidi":false,"horizontalPositionAbs":"Left","horizontalPosition":0.0}},{"characterFormat":{"highlightColor":"Yellow","fontFamily":"Calibri","fontSizeBidi":12.0,"fontFamilyBidi":"Calibri"},"inlines":[]},{"characterFormat":{"fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"inlines":[{"text":"IVA no incluido.","characterFormat":{"fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"editRangeId":"424941776","editableRangeStart":{"editRangeId":"424941776","group":"everyone"}}]},{"characterFormat":{"fontSize":1.0,"fontFamily":"Calibri","fontSizeBidi":1.0,"fontFamilyBidi":"Arial"},"inlines":[]}],"headersFooters":{},"sectionFormat":{"headerDistance":42.54999923706055,"footerDistance":42.54999923706055,"pageWidth":595.3499755859375,"pageHeight":842.0,"leftMargin":56.70000076293945,"rightMargin":56.70000076293945,"topMargin":72.0,"bottomMargin":85.05000305175781,"differentFirstPage":false,"differentOddAndEvenPages":false,"bidi":false,"restartPageNumbering":false,"pageStartingNumber":0,"endnoteNumberFormat":"Arabic","footNoteNumberFormat":"Arabic","restartIndexForFootnotes":"DoNotRestart","restartIndexForEndnotes":"DoNotRestart","pageNumberStyle":"Arabic","columns":{"column":[{"width":481.95001220703125,"space":36.0}],"numberOfColumns":1,"equalWidth":true}}}],"characterFormat":{"fontFamily":"Times New Roman","fontFamilyBidi":"Times New Roman","localeId":3082,"localeIdEastAsia":3082,"localeIdBidi":1025},"lists":[{"listId":0,"abstractListId":0},{"listId":1,"abstractListId":1},{"listId":2,"abstractListId":2}],"abstractLists":[{"abstractListId":0,"levels":[{"listLevelPattern":"Bullet","followCharacter":"Tab","numberFormat":"","characterFormat":{"fontFamily":"Symbol"},"paragraphFormat":{"leftIndent":36.0,"firstLineIndent":-18.0}},{"listLevelPattern":"Bullet","followCharacter":"Tab","numberFormat":"o","characterFormat":{"fontFamily":"Courier New","fontFamilyBidi":"Courier New"},"paragraphFormat":{"leftIndent":72.0,"firstLineIndent":-18.0}},{"listLevelPattern":"Bullet","followCharacter":"Tab","numberFormat":"","characterFormat":{"fontFamily":"Wingdings"},"paragraphFormat":{"leftIndent":108.0,"firstLineIndent":-18.0}},{"listLevelPattern":"Bullet","followCharacter":"Tab","numberFormat":"","characterFormat":{"fontFamily":"Symbol"},"paragraphFormat":{"leftIndent":144.0,"firstLineIndent":-18.0}},{"listLevelPattern":"Bullet","followCharacter":"Tab","numberFormat":"o","characterFormat":{"fontFamily":"Courier New","fontFamilyBidi":"Courier New"},"paragraphFormat":{"leftIndent":180.0,"firstLineIndent":-18.0}},{"listLevelPattern":"Bullet","followCharacter":"Tab","numberFormat":"","characterFormat":{"fontFamily":"Wingdings"},"paragraphFormat":{"leftIndent":216.0,"firstLineIndent":-18.0}},{"listLevelPattern":"Bullet","followCharacter":"Tab","numberFormat":"","characterFormat":{"fontFamily":"Symbol"},"paragraphFormat":{"leftIndent":252.0,"firstLineIndent":-18.0}},{"listLevelPattern":"Bullet","followCharacter":"Tab","numberFormat":"o","characterFormat":{"fontFamily":"Courier New","fontFamilyBidi":"Courier New"},"paragraphFormat":{"leftIndent":288.0,"firstLineIndent":-18.0}},{"listLevelPattern":"Bullet","followCharacter":"Tab","numberFormat":"","characterFormat":{"fontFamily":"Wingdings"},"paragraphFormat":{"leftIndent":324.0,"firstLineIndent":-18.0}}]},{"abstractListId":1,"levels":[{"listLevelPattern":"Bullet","followCharacter":"Tab","numberFormat":"","characterFormat":{"fontFamily":"Symbol"},"paragraphFormat":{"leftIndent":36.0,"firstLineIndent":-18.0}},{"listLevelPattern":"Bullet","followCharacter":"Tab","numberFormat":"o","characterFormat":{"fontFamily":"Courier New","fontFamilyBidi":"Courier New"},"paragraphFormat":{"leftIndent":72.0,"firstLineIndent":-18.0}},{"listLevelPattern":"Bullet","followCharacter":"Tab","numberFormat":"","characterFormat":{"fontFamily":"Wingdings"},"paragraphFormat":{"leftIndent":108.0,"firstLineIndent":-18.0}},{"listLevelPattern":"Bullet","followCharacter":"Tab","numberFormat":"","characterFormat":{"fontFamily":"Symbol"},"paragraphFormat":{"leftIndent":144.0,"firstLineIndent":-18.0}},{"listLevelPattern":"Bullet","followCharacter":"Tab","numberFormat":"o","characterFormat":{"fontFamily":"Courier New","fontFamilyBidi":"Courier New"},"paragraphFormat":{"leftIndent":180.0,"firstLineIndent":-18.0}},{"listLevelPattern":"Bullet","followCharacter":"Tab","numberFormat":"","characterFormat":{"fontFamily":"Wingdings"},"paragraphFormat":{"leftIndent":216.0,"firstLineIndent":-18.0}},{"listLevelPattern":"Bullet","followCharacter":"Tab","numberFormat":"","characterFormat":{"fontFamily":"Symbol"},"paragraphFormat":{"leftIndent":252.0,"firstLineIndent":-18.0}},{"listLevelPattern":"Bullet","followCharacter":"Tab","numberFormat":"o","characterFormat":{"fontFamily":"Courier New","fontFamilyBidi":"Courier New"},"paragraphFormat":{"leftIndent":288.0,"firstLineIndent":-18.0}},{"listLevelPattern":"Bullet","followCharacter":"Tab","numberFormat":"","characterFormat":{"fontFamily":"Wingdings"},"paragraphFormat":{"leftIndent":324.0,"firstLineIndent":-18.0}}]},{"abstractListId":2,"levels":[{"startAt":1,"restartLevel":0,"listLevelPattern":"Arabic","followCharacter":"Tab","numberFormat":"%1.","paragraphFormat":{"leftIndent":36.0,"firstLineIndent":-18.0,"tabs":[{"tabJustification":"List","position":36.0,"tabLeader":"None","deletePosition":0.0}]}},{"listLevelPattern":"Bullet","followCharacter":"Tab","numberFormat":"","characterFormat":{"fontFamily":"Symbol"},"paragraphFormat":{"leftIndent":72.0,"firstLineIndent":-18.0,"tabs":[{"tabJustification":"List","position":72.0,"tabLeader":"None","deletePosition":0.0}]}},{"startAt":1,"restartLevel":2,"listLevelPattern":"LowRoman","followCharacter":"Tab","numberFormat":"%3.","paragraphFormat":{"leftIndent":108.0,"firstLineIndent":-9.0,"tabs":[{"tabJustification":"List","position":108.0,"tabLeader":"None","deletePosition":0.0}]}},{"startAt":1,"restartLevel":3,"listLevelPattern":"Arabic","followCharacter":"Tab","numberFormat":"%4.","paragraphFormat":{"leftIndent":144.0,"firstLineIndent":-18.0,"tabs":[{"tabJustification":"List","position":144.0,"tabLeader":"None","deletePosition":0.0}]}},{"startAt":1,"restartLevel":4,"listLevelPattern":"LowLetter","followCharacter":"Tab","numberFormat":"%5.","paragraphFormat":{"leftIndent":180.0,"firstLineIndent":-18.0,"tabs":[{"tabJustification":"List","position":180.0,"tabLeader":"None","deletePosition":0.0}]}},{"startAt":1,"restartLevel":5,"listLevelPattern":"LowRoman","followCharacter":"Tab","numberFormat":"%6.","paragraphFormat":{"leftIndent":216.0,"firstLineIndent":-9.0,"tabs":[{"tabJustification":"List","position":216.0,"tabLeader":"None","deletePosition":0.0}]}},{"startAt":1,"restartLevel":6,"listLevelPattern":"Arabic","followCharacter":"Tab","numberFormat":"%7.","paragraphFormat":{"leftIndent":252.0,"firstLineIndent":-18.0,"tabs":[{"tabJustification":"List","position":252.0,"tabLeader":"None","deletePosition":0.0}]}},{"startAt":1,"restartLevel":7,"listLevelPattern":"LowLetter","followCharacter":"Tab","numberFormat":"%8.","paragraphFormat":{"leftIndent":288.0,"firstLineIndent":-18.0,"tabs":[{"tabJustification":"List","position":288.0,"tabLeader":"None","deletePosition":0.0}]}},{"startAt":1,"restartLevel":8,"listLevelPattern":"LowRoman","followCharacter":"Tab","numberFormat":"%9.","paragraphFormat":{"leftIndent":324.0,"firstLineIndent":-9.0,"tabs":[{"tabJustification":"List","position":324.0,"tabLeader":"None","deletePosition":0.0}]}}]}],"background":{"color":"#FFFFFFFF"},"styles":[{"type":"Paragraph","name":"Normal","next":"Normal","characterFormat":{"fontSize":12.0,"fontFamily":"Calibri","localeId":1034},"paragraphFormat":{"textAlignment":"Justify"}},{"type":"Paragraph","name":"Heading 1","basedOn":"Normal","next":"Normal","characterFormat":{"bold":true,"underline":"Single","fontSize":12.5,"fontFamily":"Arial"},"paragraphFormat":{"outlineLevel":"Level1","tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}],"keepWithNext":true}},{"type":"Paragraph","name":"Heading 2","basedOn":"Normal","next":"Normal","characterFormat":{"bold":true,"underline":"Single"},"paragraphFormat":{"outlineLevel":"Level2","keepWithNext":true}},{"type":"Paragraph","name":"Heading 3","basedOn":"Normal","next":"Normal","characterFormat":{"bold":true,"fontFamily":"Times New Roman"},"paragraphFormat":{"outlineLevel":"Level3","textAlignment":"Center","tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}],"keepWithNext":true}},{"type":"Paragraph","name":"Heading 4","basedOn":"Normal","next":"Normal","characterFormat":{"bold":true,"fontFamily":"Times New Roman"},"paragraphFormat":{"outlineLevel":"Level4","tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}],"keepWithNext":true}},{"type":"Paragraph","name":"Heading 5","basedOn":"Normal","next":"Normal","characterFormat":{"bold":true,"italic":true,"fontSize":13.0,"boldBidi":true,"italicBidi":true,"fontSizeBidi":13.0},"paragraphFormat":{"beforeSpacing":12.0,"afterSpacing":3.0,"outlineLevel":"Level5"}},{"type":"Character","name":"Default Paragraph Font"},{"type":"Character","name":"Fuente de encabezado predeter.","basedOn":"Default Paragraph Font"},{"type":"Paragraph","name":"TOC 1","basedOn":"Normal","next":"Normal","characterFormat":{"localeId":1033},"paragraphFormat":{"leftIndent":36.0,"rightIndent":36.0,"firstLineIndent":-36.0,"beforeSpacing":24.0,"tabs":[{"tabJustification":"Left","position":450.0,"tabLeader":"Dot","deletePosition":0.0},{"tabJustification":"Right","position":468.0,"tabLeader":"None","deletePosition":0.0}]}},{"type":"Paragraph","name":"TOC 2","basedOn":"Normal","next":"Normal","characterFormat":{"localeId":1033},"paragraphFormat":{"leftIndent":72.0,"rightIndent":36.0,"firstLineIndent":-36.0,"tabs":[{"tabJustification":"Left","position":450.0,"tabLeader":"Dot","deletePosition":0.0},{"tabJustification":"Right","position":468.0,"tabLeader":"None","deletePosition":0.0}]}},{"type":"Paragraph","name":"TOC 3","basedOn":"Normal","next":"Normal","characterFormat":{"localeId":1033},"paragraphFormat":{"leftIndent":108.0,"rightIndent":36.0,"firstLineIndent":-36.0,"tabs":[{"tabJustification":"Left","position":450.0,"tabLeader":"Dot","deletePosition":0.0},{"tabJustification":"Right","position":468.0,"tabLeader":"None","deletePosition":0.0}]}},{"type":"Paragraph","name":"TOC 4","basedOn":"Normal","next":"Normal","characterFormat":{"localeId":1033},"paragraphFormat":{"leftIndent":144.0,"rightIndent":36.0,"firstLineIndent":-36.0,"tabs":[{"tabJustification":"Left","position":450.0,"tabLeader":"Dot","deletePosition":0.0},{"tabJustification":"Right","position":468.0,"tabLeader":"None","deletePosition":0.0}]}},{"type":"Paragraph","name":"TOC 5","basedOn":"Normal","next":"Normal","characterFormat":{"localeId":1033},"paragraphFormat":{"leftIndent":180.0,"rightIndent":36.0,"firstLineIndent":-36.0,"tabs":[{"tabJustification":"Left","position":450.0,"tabLeader":"Dot","deletePosition":0.0},{"tabJustification":"Right","position":468.0,"tabLeader":"None","deletePosition":0.0}]}},{"type":"Paragraph","name":"TOC 6","basedOn":"Normal","next":"Normal","characterFormat":{"localeId":1033},"paragraphFormat":{"leftIndent":36.0,"firstLineIndent":-36.0,"tabs":[{"tabJustification":"Left","position":450.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Right","position":468.0,"tabLeader":"None","deletePosition":0.0}]}},{"type":"Paragraph","name":"TOC 7","basedOn":"Normal","next":"Normal","characterFormat":{"localeId":1033},"paragraphFormat":{"leftIndent":36.0,"firstLineIndent":-36.0}},{"type":"Paragraph","name":"TOC 8","basedOn":"Normal","next":"Normal","characterFormat":{"localeId":1033},"paragraphFormat":{"leftIndent":36.0,"firstLineIndent":-36.0,"tabs":[{"tabJustification":"Left","position":450.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Right","position":468.0,"tabLeader":"None","deletePosition":0.0}]}},{"type":"Paragraph","name":"TOC 9","basedOn":"Normal","next":"Normal","characterFormat":{"localeId":1033},"paragraphFormat":{"leftIndent":36.0,"firstLineIndent":-36.0,"tabs":[{"tabJustification":"Left","position":450.0,"tabLeader":"Dot","deletePosition":0.0},{"tabJustification":"Right","position":468.0,"tabLeader":"None","deletePosition":0.0}]}},{"type":"Paragraph","name":"índice 1","basedOn":"Normal","next":"índice 1","characterFormat":{"localeId":1033},"paragraphFormat":{"leftIndent":72.0,"rightIndent":36.0,"firstLineIndent":-72.0,"tabs":[{"tabJustification":"Left","position":450.0,"tabLeader":"Dot","deletePosition":0.0},{"tabJustification":"Right","position":468.0,"tabLeader":"None","deletePosition":0.0}]}},{"type":"Paragraph","name":"índice 2","basedOn":"Normal","next":"índice 2","characterFormat":{"localeId":1033},"paragraphFormat":{"leftIndent":72.0,"rightIndent":36.0,"firstLineIndent":-36.0,"tabs":[{"tabJustification":"Left","position":450.0,"tabLeader":"Dot","deletePosition":0.0},{"tabJustification":"Right","position":468.0,"tabLeader":"None","deletePosition":0.0}]}},{"type":"Paragraph","name":"toa","basedOn":"Normal","next":"toa","characterFormat":{"localeId":1033},"paragraphFormat":{"tabs":[{"tabJustification":"Left","position":450.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Right","position":468.0,"tabLeader":"None","deletePosition":0.0}]}},{"type":"Paragraph","name":"epígrafe","basedOn":"Normal","next":"epígrafe"},{"type":"Character","name":"_Equation Caption","basedOn":"Default Paragraph Font"},{"type":"Paragraph","name":"Footnote Text","basedOn":"Normal","next":"Footnote Text","characterFormat":{"fontSize":10.0}},{"type":"Character","name":"Footnote Reference","basedOn":"Default Paragraph Font","characterFormat":{"baselineAlignment":"Superscript"}},{"type":"Paragraph","name":"Header","basedOn":"Normal","next":"Header","paragraphFormat":{"tabs":[{"tabJustification":"Center","position":212.60000610351562,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Right","position":425.20001220703125,"tabLeader":"None","deletePosition":0.0}]}},{"type":"Paragraph","name":"Footer","basedOn":"Normal","next":"Footer","paragraphFormat":{"tabs":[{"tabJustification":"Center","position":212.60000610351562,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Right","position":425.20001220703125,"tabLeader":"None","deletePosition":0.0}]}},{"type":"Character","name":"Page Number","basedOn":"Default Paragraph Font"},{"type":"Paragraph","name":"Body Text","basedOn":"Normal","next":"Body Text","characterFormat":{"fontSize":12.5,"fontFamily":"Arial"},"paragraphFormat":{"tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]}},{"type":"Paragraph","name":"Texto independiente 21","basedOn":"Normal","next":"Texto independiente 21","characterFormat":{"bold":true,"underline":"Single","fontFamily":"Arial"}},{"type":"Paragraph","name":"Body Text 21","basedOn":"Normal","next":"Body Text 21","characterFormat":{"fontFamily":"Arial"},"paragraphFormat":{"firstLineIndent":-1.100000023841858,"tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Left","position":0.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Left","position":36.0,"tabLeader":"None","deletePosition":0.0}]}},{"type":"Paragraph","name":"Body Text 2","basedOn":"Normal","next":"Body Text 2","characterFormat":{"fontSize":13.0,"fontFamily":"Times New Roman"},"paragraphFormat":{"tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]}},{"type":"Paragraph","name":"Body Text 3","basedOn":"Normal","next":"Body Text 3","characterFormat":{"fontFamily":"Times New Roman"},"paragraphFormat":{"tabs":[{"tabJustification":"Left","position":-36.0,"tabLeader":"None","deletePosition":0.0}]}},{"type":"Paragraph","name":"texto","basedOn":"Normal","next":"texto","characterFormat":{"fontSize":10.0,"fontFamily":"Arial","fontColor":"#000000FF","fontFamilyBidi":"Arial","localeId":3082},"paragraphFormat":{"beforeSpacing":5.0,"afterSpacing":5.0,"spaceBeforeAuto":true,"spaceAfterAuto":true}},{"type":"Paragraph","name":"Normal (Web)","basedOn":"Normal","next":"Normal (Web)","characterFormat":{"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":12.0,"localeId":3082},"paragraphFormat":{"beforeSpacing":5.0,"afterSpacing":5.0,"spaceBeforeAuto":true,"spaceAfterAuto":true}},{"type":"Character","name":"estilo31","basedOn":"Default Paragraph Font","characterFormat":{"fontSize":10.0,"fontFamily":"Arial","fontSizeBidi":10.0,"fontFamilyBidi":"Arial"}},{"type":"Paragraph","name":"Unord List","basedOn":"Normal","next":"Unord List","characterFormat":{"fontSize":10.0,"fontFamily":"Helvetica","localeId":1033,"localeIdEastAsia":1033},"paragraphFormat":{"leftIndent":18.0,"firstLineIndent":-18.0}},{"type":"Paragraph","name":"Car","basedOn":"Normal","next":"Car","characterFormat":{"fontFamily":"Times New Roman","fontSizeBidi":12.0,"localeId":1045,"localeIdEastAsia":1045}},{"type":"Paragraph","name":"Char Char Char1 Char Char Char Char","basedOn":"Normal","next":"Char Char Char1 Char Char Char Char","characterFormat":{"fontFamily":"Times New Roman","fontSizeBidi":12.0,"localeId":1045,"localeIdEastAsia":1045}},{"type":"Paragraph","name":"Body Text Indent","basedOn":"Normal","next":"Body Text Indent","paragraphFormat":{"leftIndent":14.149999618530273,"afterSpacing":6.0}},{"type":"Paragraph","name":"Caption","basedOn":"Normal","next":"Normal","characterFormat":{"bold":true,"fontSize":10.0,"fontFamily":"Times New Roman","boldBidi":true}},{"type":"Paragraph","name":"Balloon Text","basedOn":"Normal","next":"Balloon Text","characterFormat":{"fontSize":8.0,"fontFamily":"Tahoma","fontSizeBidi":8.0,"fontFamilyBidi":"Tahoma"}},{"type":"Character","name":"Pie de página Car","basedOn":"Default Paragraph Font","characterFormat":{"fontSize":12.0,"fontFamily":"Courier","localeId":1034}},{"type":"Paragraph","name":"List Paragraph","basedOn":"Normal","next":"List Paragraph","paragraphFormat":{"leftIndent":35.400001525878906}},{"type":"Character","name":"Párrafo de lista Car","basedOn":"Default Paragraph Font","characterFormat":{"fontSize":12.0,"fontFamily":"Courier","localeId":1034}},{"type":"Character","name":"Estilo","basedOn":"Default Paragraph Font","characterFormat":{"fontSize":10.0,"fontFamily":"Arial","fontColor":"#00000000"}},{"type":"Character","name":"Hyperlink","basedOn":"Default Paragraph Font","characterFormat":{"underline":"Single","fontColor":"#0000FFFF"}},{"type":"Character","name":"Ref. de comentario1","basedOn":"Default Paragraph Font","characterFormat":{"fontSize":8.0,"fontSizeBidi":8.0}},{"type":"Paragraph","name":"Texto comentario1","basedOn":"Normal","next":"Texto comentario1","link":"Texto comentario Car","characterFormat":{"fontSize":10.0}},{"type":"Character","name":"Texto comentario Car","basedOn":"Default Paragraph Font","characterFormat":{"fontFamily":"Courier","localeId":1034}},{"type":"Paragraph","name":"Asunto del comentario1","basedOn":"Texto comentario1","next":"Texto comentario1","link":"Asunto del comentario Car","characterFormat":{"bold":true,"boldBidi":true}},{"type":"Character","name":"Asunto del comentario Car","basedOn":"Texto comentario Car","characterFormat":{"bold":true,"fontFamily":"Courier","boldBidi":true,"localeId":1034}},{"type":"Paragraph","name":"Default","next":"Default","characterFormat":{"fontSize":12.0,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":12.0,"fontFamilyBidi":"Arial","localeIdEastAsia":1033}},{"type":"Character","name":"Mención sin resolver1","basedOn":"Default Paragraph Font","characterFormat":{"fontColor":"#605E5CFF"}},{"type":"Paragraph","name":"Revision","next":"Revision","characterFormat":{"fontSize":12.0,"fontFamily":"Calibri","localeId":1034}}],"defaultTabWidth":36.0,"formatting":false,"trackChanges":false,"protectionType":"ReadOnly","enforcement":true,"cryptProviderType":"rsaFull","cryptAlgorithmClass":"hash","cryptAlgorithmType":"typeAny","cryptAlgorithmSid":"4","cryptSpinCount":"100000","dontUseHTMLParagraphAutoSpacing":false,"alignTablesRowByRow":false,"formFieldShading":false,"footnotes":{"separator":[{"inlines":[{"text":"\\u0003"}]}],"continuationSeparator":[{"inlines":[{"text":"\\u0004"}]}],"continuationNotice":[{"inlines":[]}]},"endnotes":{"separator":[{"inlines":[{"text":"\\u0003"}]}],"continuationSeparator":[{"inlines":[{"text":"\\u0004"}]}],"continuationNotice":[{"inlines":[]}]},"compatibilityMode":"Word2013"}';
describe('Find Next Region validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true });
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
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Find Next Region', () => {
        console.log('Find Next Region');
        editor.open(findRegion);
        let cursor = editor.selection.startOffset;
        expect(cursor).toBe('0;0;0');
        editor.editor.documentHelper.selection.navigateToNextEditingRegion();
        let findStart = editor.selection.startOffset;
        let findEnd = editor.selection.endOffset;
        expect(findStart).toBe('0;80;1');
        expect(findEnd).toBe('0;84;84');
        editor.editor.documentHelper.selection.navigateToNextEditingRegion();
        let findStartNext = editor.selection.startOffset;
        let findEndNext = editor.selection.endOffset;
        expect(findStartNext).toBe('1;0;1');
        expect(findEndNext).toBe('1;37;17');
    });
});
describe('Restrict editing Add edit region with everyone validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(JSON.stringify(paragraph));
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('highlightedit region validation', () => {
console.log('highlightedit region validation');
        editor.selection.isHighlightEditRegion = true;
        editor.selection.highlightEditRegion();
    });
    it('Navigate edit region validation', () => {
console.log('Navigate edit region validation');
        editor.selection.navigateToNextEditingRegion();
        editor.selection.navigateToNextEditingRegion();
        editor.selection.navigateToNextEditingRegion();
    });
    it('Formatting inside edit region validation', () => {
console.log('Formatting inside edit region validation');
        editor.selection.handleControlHomeKey();
        editor.selection.handleRightKey();
        editor.selection.handleRightKey();
        editor.selection.handleShiftRightKey();
        editor.selection.handleShiftRightKey();
        editor.selection.handleShiftRightKey();
        editor.selection.characterFormat.bold = true;
        expect(editor.selection.characterFormat.bold).toBe(true);
    });
    it('Formatting outside edit region validation', () => {
console.log('Formatting outside edit region validation');
        editor.selection.handleDownKey();
        editor.selection.handleRightKey();
        editor.selection.handleRightKey();
        editor.selection.handleShiftRightKey();
        editor.selection.handleShiftRightKey();
        editor.selection.handleShiftRightKey();
        editor.selection.characterFormat.bold = true;
        editor.selection.handleRightKey();
        editor.selection.handleLeftKey();
        expect(editor.selection.characterFormat.bold).toBe(false);
    });
    it('Editing outside edit region validation', () => {
console.log('Editing outside edit region validation');
        editor.editor.handleTextInput('sample');
        expect(editor.selection.getText(true)).toBe('')
    });
    it('Editing inside edit region validation', () => {
console.log('Editing inside edit region validation');
        editor.selection.handleControlHomeKey();
        editor.selection.handleRightKey();
        editor.selection.handleRightKey();
        editor.editor.insertText(' sample');
        editor.selection.selectCurrentWord();
        let text: string = editor.selection.getText(true)
        expect(text.indexOf('sample')).not.toBe(-1);
    });
});

describe('Restrict editing Add edit region based on currentuser validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(JSON.stringify(paragraph));
        editor.currentUser = 'sample@gmail.com';
        editor.userColor = '#E0E0E0';
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('highlightedit region validation', () => {
console.log('highlightedit region validation');
        editor.selection.isHighlightEditRegion = true;
        expect(editor.documentHelper.editRanges.length).toBe(2);
    });
    it('Unhighlightedit region validation', () => {
console.log('Unhighlightedit region validation');
        editor.selection.isHighlightEditRegion = false;
        expect(editor.selection.editRegionHighlighters).toBeUndefined();
    });
    it('Navigate edit region validation', () => {
console.log('Navigate edit region validation');
        editor.selection.navigateToNextEditingRegion();
        editor.selection.navigateToNextEditingRegion();
        editor.selection.navigateToNextEditingRegion();
    });
    it('Formatting inside edit region validation', () => {
console.log('Formatting inside edit region validation');
        editor.selection.handleControlHomeKey();
        editor.selection.handleRightKey();
        editor.selection.handleRightKey();
        editor.selection.handleShiftRightKey();
        editor.selection.handleShiftRightKey();
        editor.selection.handleShiftRightKey();
        editor.selection.characterFormat.bold = true;
        expect(editor.selection.characterFormat.bold).toBe(true);
    });
    it('Formatting outside edit region validation', () => {
console.log('Formatting outside edit region validation');
        editor.selection.handleDownKey();
        editor.selection.handleRightKey();
        editor.selection.handleRightKey();
        editor.selection.handleShiftRightKey();
        editor.selection.handleShiftRightKey();
        editor.selection.handleShiftRightKey();
        editor.selection.characterFormat.bold = true;
        editor.selection.handleRightKey();
        editor.selection.handleLeftKey();
        expect(editor.selection.characterFormat.bold).toBe(false);
    });
    it('Editing outside edit region validation', () => {
console.log('Editing outside edit region validation');
        editor.editor.handleTextInput('sample');
        expect(editor.selection.getText(true)).toBe('')
    });
    it('Editing inside edit region validation', () => {
console.log('Editing inside edit region validation');
        editor.selection.handleControlHomeKey();
        editor.selection.handleRightKey();
        editor.selection.handleRightKey();
        editor.editor.insertText(' sample');
        editor.selection.selectCurrentWord();
        let text: string = editor.selection.getText(true);
        expect(text.indexOf('sample')).not.toBe(-1);
    });
});
let table: any = { "sections": [{ "blocks": [{ "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "text": "Hello World. This is adventure" }] }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "editRangeId": "658904599", "group": "everyone" }, { "text": "Hello World. This is adventure" }] }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "text": "Hello World. This is adventure" }, { "editRangeId": "658904599", "editableRangeStart": { "editRangeId": "658904599", "group": "everyone" } }] }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "text": "Hello World. This is adventure" }] }, { "rows": [{ "rowFormat": { "allowBreakAcrossPages": true, "isHeader": false, "height": 0.0, "heightType": "AtLeast", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } }, "cells": [{ "blocks": [{ "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "editRangeId": "157440609", "columnFirst": 0, "columnLast": 0, "group": "everyone" }, { "editRangeId": "321197460", "columnFirst": 1, "columnLast": 1, "group": "everyone" }, { "text": "Hello World. This is adventure" }] }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 233.75, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } } }, { "blocks": [{ "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "text": "Hello World. This is adventure" }] }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "editRangeId": "157440609", "editableRangeStart": { "editRangeId": "157440609", "columnFirst": 0, "columnLast": 0, "group": "everyone" } }, { "editRangeId": "321197460", "editableRangeStart": { "editRangeId": "321197460", "columnFirst": 1, "columnLast": 1, "group": "everyone" } }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 233.75, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } } }] }, { "rowFormat": { "allowBreakAcrossPages": true, "isHeader": false, "height": 0.0, "heightType": "AtLeast", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } }, "cells": [{ "blocks": [{ "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "text": "Hello World. This is adventure" }] }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 233.75, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } } }, { "blocks": [{ "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "text": "Hello World. This is adventure" }] }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 233.75, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } } }] }], "title": null, "description": null, "tableFormat": { "allowAutoFit": true, "leftIndent": 0.0, "tableAlignment": "Left", "preferredWidthType": "Auto", "borders": { "left": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "bidi": false } }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "editRangeId": "2145070062", "user": "sample@gmail.com" }, { "text": "Hello World. This is adventure" }] }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "name": "_GoBack", "bookmarkType": 0 }, { "name": "_GoBack", "bookmarkType": 1 }, { "editRangeId": "2145070062", "editableRangeStart": { "editRangeId": "2145070062", "user": "sample@gmail.com" } }] }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "text": "Hello World. This is adventure" }] }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [] }], "headersFooters": {}, "sectionFormat": { "headerDistance": 36.0, "footerDistance": 36.0, "pageWidth": 612.0, "pageHeight": 792.0, "leftMargin": 72.0, "rightMargin": 72.0, "topMargin": 72.0, "bottomMargin": 72.0, "differentFirstPage": false, "differentOddAndEvenPages": false, "bidi": false } }], "characterFormat": { "fontSize": 11.0, "fontFamily": "Calibri", "fontSizeBidi": 11.0, "fontFamilyBidi": "Calibri" }, "paragraphFormat": { "afterSpacing": 8.0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple" }, "background": { "color": "#FFFFFFFF" }, "styles": [{ "type": "Paragraph", "name": "Normal", "next": "Normal" }, { "type": "Character", "name": "Default Paragraph Font" }], "defaultTabWidth": 36.0, "formatting": true, "protectionType": "ReadOnly", "enforcement": true, "hashValue": "hft9V2L7YF9LmSQzl7cjjvkAzCexZS5mRBZsT4JtOmCajw1O9HIB6bj2Q2MgCk/ejm5VfFn08dASVdWnlH+EqQ==", "saltValue": "0Ih64ttQ8dIiFXcDfuTQ0Q==" };
describe('Restrict editing Add edit region inside Table', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(JSON.stringify(table));
        editor.currentUser = 'sample@gmail.com';
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('highlightedit region validation', () => {
console.log('highlightedit region validation');
        editor.selection.isHighlightEditRegion = true;
        expect(editor.selection.editRegionHighlighters.length).not.toBe(0);
    });
    it('Unhighlightedit region validation', () => {
console.log('Unhighlightedit region validation');
        editor.selection.isHighlightEditRegion = false;
        expect(editor.selection.editRegionHighlighters).toBeUndefined();
    });
    it('Navigate edit region validation', () => {
console.log('Navigate edit region validation');
        editor.selection.navigateToNextEditingRegion();
        editor.selection.navigateToNextEditingRegion();
        editor.selection.navigateToNextEditingRegion();
    });
    it('BackSpace Validation', () => {
console.log('BackSpace Validation');
        editor.selection.navigateToNextEditingRegion();
        editor.editor.insertText('T');
        editor.editor.onBackSpace();
        editor.editor.onBackSpace();
        expect(editor.selection.isSelectionInEditRegion()).toBe(true);
    });
    it('Public API validation', () => {
console.log('Public API validation');
        editor.selection.navigateToNextEditingRegion();
        expect(editor.selection.isSelectionInEditRegion()).toBe(true);
    });
});

describe('Restrict editing add and remove with history preservation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.selection.isHighlightEditRegion = true;
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Add restrictions to selected area in document', () => {
console.log('Add restrictions to selected area in document');
        editor.editor.insertText('sample');
        editor.editor.onEnter();
        editor.editor.insertText('sample');
        editor.selection.selectAll();
        editor.editor.insertEditRangeElement('everyone');
        expect(editor.selection.editRangeCollection.length).toBe(1);
    });
    it('Undo after edit range collection', () => {
console.log('Undo after edit range collection');
        editor.editorHistory.undo();
        expect(editor.selection.editRangeCollection.length).toBe(0);
    });
    it('Redo after edit range collection', () => {
console.log('Redo after edit range collection');
        editor.editorHistory.redo();
        expect(editor.selection.editRangeCollection.length).toBe(1);
    });
    it('Remove restrictions to selected area in document', () => {
console.log('Remove restrictions to selected area in document');
        editor.selection.isHighlightEditRegion = true;
        editor.openBlank();
        editor.editor.insertText('sample');
        editor.selection.selectAll();
        editor.editor.insertEditRangeElement('everyone');
        editor.selection.handleHomeKey();
        editor.selection.handleRightKey();
        editor.selection.handleRightKey();
        editor.editor.removeUserRestrictions('everyone');
        expect(editor.selection.editRangeCollection.length).toBe(0);
    });
    it('undo after remove restrictions', () => {
console.log('undo after remove restrictions');
        editor.editorHistory.undo();
        expect(editor.selection.editRangeCollection.length).toBe(1);
    });

});



describe('Restrict Editing validation with password is empty validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.selection.isHighlightEditRegion = true;
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('protect document with empty password', () => {
console.log('protect document with empty password');
        editor.editor.insertText('sample');
        editor.editor.addProtection('', 'ReadOnly');
        expect(editor.documentHelper.protectionType).toBe('ReadOnly');
        expect(editor.documentHelper.isDocumentProtected).toBe(true);
    });
    it('Insert text in protected document', () => {
console.log('Insert text in protected document');
        editor.editor.handleTextInput('s');
        expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe('sample');
        editor.editor.unProtectDocument();

    });
    it('Insert text after unprotect document', () => {
console.log('Insert text after unprotect document');
        editor.editor.insertText('s');
        expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe('samples');
        editor.selection.selectAll();
        editor.editor.insertEditRangeElement('everyone');
        editor.editor.addProtection('', 'ReadOnly');
        editor.editor.handleTextInput('s');
        expect((editor.selection.start.currentWidget.children[1] as TextElementBox).text).toBe('samples');
    });

});
describe('Restrict editing validation with protection type CommentsOnly ',()=>{
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory,);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true,enableComment:true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.selection.isHighlightEditRegion = true;
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('should return true if document is protected with CommentOnly',()=>{
        console.log('should return true if document is protected with CommentOnly');
        editor.editor.addProtection('','CommentsOnly');
        expect(editor.documentHelper.protectionType).toBe('CommentsOnly');
        expect(editor.documentHelper.isDocumentProtected).toBe(true);
        editor.editor.unProtectDocument();
    });
    // it('ReadOnly mode validation in editregion',()=>{
    //     editor.editor.insertText("Sample");
    //     editor.selection.selectParagraph();
    //     editor.editor.insertEditRangeElement('everyone');
    //     editor.editor.addProtection('','CommentsOnly');
    //     editor.selection.handleShiftHomeKey();
    //     expect(editor.isReadOnlyMode).toBe(false);
    //     editor.editor.unProtectDocument();
    // });
    it('ReadOnly mode validation in uneditable region',()=>{
        editor.editor.insertText("Sample");
        editor.editor.addProtection('','CommentsOnly');
        expect(editor.isReadOnlyMode).toBe(true);
        editor.editor.unProtectDocument();
    });
    it('inserting Comment to selected region',()=>{
        console.log("inserting Comment to unselected region");
        editor.editor.addProtection('','CommentsOnly');
        editor.selection.selectAll();
        editor.editor.insertComment('Hello world');
        expect(editor.documentHelper.comments.length).toBe(1);
        editor.editor.replyComment(editor.documentHelper.comments[0],'reply 1');
    });
    it('Resolve  and reopen Comment validation with protectiontype CommentOnly',()=>{
        console.log('Resolve  and reopen Comment validation with protectiontype CommentOnly');
        editor.editor.resolveComment(editor.documentHelper.comments[0]);
        expect(editor.documentHelper.comments[0].isResolved).toBe(true);
        editor.editorHistory.undo();
        expect(editor.documentHelper.comments[0].isResolved).toBe(false);
        editor.editorHistory.redo();
        expect(editor.documentHelper.comments[0].isResolved).toBe(true);
        editor.editor.reopenComment(editor.documentHelper.comments[0]);
        expect(editor.documentHelper.comments[0].isResolved).toBe(false);
    });
    it('Delete comment validation with protectiontype CommentOnly',()=>{
        console.log('Delete comment validation with protectiontype CommentOnly');
        editor.editor.deleteCommentInternal(editor.documentHelper.comments[0]);
        expect(editor.documentHelper.comments.length).toBe(0);
    });
});
let TextFormField: any = {
    "sections": [
        {
            "sectionFormat": {
                "pageWidth": 612,
                "pageHeight": 792,
                "leftMargin": 72,
                "rightMargin": 72,
                "topMargin": 72,
                "bottomMargin": 72,
                "differentFirstPage": false,
                "differentOddAndEvenPages": false,
                "headerDistance": 36,
                "footerDistance": 36,
                "bidi": false
            },
            "blocks": [
                {
                    "paragraphFormat": {
                        "styleName": "Normal",
                        "listFormat": {
                        }
                    },
                    "characterFormat": {
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                            },
                            "fieldType": 0,
                            "hasFieldEnd": true,
                            "formFieldData": {
                                "name": "Text1",
                                "enabled": true,
                                "helpText": "",
                                "statusText": "",
                                "textInput": {
                                    "type": "Text",
                                    "maxLength": 0,
                                    "defaultValue": "Syncfusion",
                                    "format": ""
                                }
                            }
                        },
                        {
                            "characterFormat": {
                            },
                            "bookmarkType": 0,
                            "name": "Text1"
                        },
                        {
                            "characterFormat": {
                            },
                            "text": " FORMTEXT "
                        },
                        {
                            "characterFormat": {
                            },
                            "fieldType": 2
                        },
                        {
                            "characterFormat": {
                            },
                            "bookmarkType": 0,
                            "name": "_GoBack"
                        },
                        {
                            "characterFormat": {
                            },
                            "text": "Syncfusion"
                        },
                        {
                            "characterFormat": {
                            },
                            "bookmarkType": 1,
                            "name": "_GoBack"
                        },
                        {
                            "characterFormat": {
                            },
                            "fieldType": 1
                        },
                        {
                            "characterFormat": {
                            },
                            "bookmarkType": 1,
                            "name": "Text1"
                        }
                    ]
                }
            ],
            "headersFooters": {
            }
        }
    ],
    "characterFormat": {
        "bold": false,
        "italic": false,
        "fontSize": 11,
        "fontFamily": "Calibri",
        "underline": "None",
        "strikethrough": "None",
        "baselineAlignment": "Normal",
        "highlightColor": "NoColor",
        "fontColor": "#000000",
        "fontSizeBidi": 11,
        "fontFamilyBidi": "Arial"
    },
    "paragraphFormat": {
        "leftIndent": 0,
        "rightIndent": 0,
        "firstLineIndent": 0,
        "textAlignment": "Left",
        "beforeSpacing": 0,
        "afterSpacing": 8,
        "lineSpacing": 1.0791666507720947,
        "lineSpacingType": "Multiple",
        "listFormat": {
        },
        "bidi": false
    },
    "defaultTabWidth": 36,
    "enforcement": true,
    "hashValue": "DtAEDux42ScZP1O4y/wSNBM3VM7798i7zX3uabsX6R5z+tkmWLkenUjf/E893543/lmTZn5nSysnO19TYnD+GQ==",
    "saltValue": "IoYM+ccLHCMT6B8SRquSgw==",
    "formatting": false,
    "protectionType": "FormFieldsOnly",
    "dontUseHTMLParagraphAutoSpacing": false,
    "styles": [
        {
            "name": "Normal",
            "type": "Paragraph",
            "paragraphFormat": {
                "listFormat": {
                }
            },
            "characterFormat": {
            },
            "next": "Normal"
        },
        {
            "name": "Default Paragraph Font",
            "type": "Character",
            "characterFormat": {
            }
        },
        {
            "name": "Heading 1",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 0,
                "rightIndent": 0,
                "firstLineIndent": 0,
                "textAlignment": "Left",
                "beforeSpacing": 12,
                "afterSpacing": 0,
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level1",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 16,
                "fontFamily": "Calibri Light",
                "fontColor": "#2F5496"
            },
            "basedOn": "Normal",
            "link": "Heading 1 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 1 Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 16,
                "fontFamily": "Calibri Light",
                "fontColor": "#2F5496"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 2",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 0,
                "rightIndent": 0,
                "firstLineIndent": 0,
                "textAlignment": "Left",
                "beforeSpacing": 2,
                "afterSpacing": 0,
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level2",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 13,
                "fontFamily": "Calibri Light",
                "fontColor": "#2F5496"
            },
            "basedOn": "Normal",
            "link": "Heading 2 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 2 Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 13,
                "fontFamily": "Calibri Light",
                "fontColor": "#2F5496"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 3",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 0,
                "rightIndent": 0,
                "firstLineIndent": 0,
                "textAlignment": "Left",
                "beforeSpacing": 2,
                "afterSpacing": 0,
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level3",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 12,
                "fontFamily": "Calibri Light",
                "fontColor": "#1F3763"
            },
            "basedOn": "Normal",
            "link": "Heading 3 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 3 Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 12,
                "fontFamily": "Calibri Light",
                "fontColor": "#1F3763"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 4",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 0,
                "rightIndent": 0,
                "firstLineIndent": 0,
                "textAlignment": "Left",
                "beforeSpacing": 2,
                "afterSpacing": 0,
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level4",
                "listFormat": {
                }
            },
            "characterFormat": {
                "italic": true,
                "fontFamily": "Calibri Light",
                "fontColor": "#2F5496"
            },
            "basedOn": "Normal",
            "link": "Heading 4 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 4 Char",
            "type": "Character",
            "characterFormat": {
                "italic": true,
                "fontFamily": "Calibri Light",
                "fontColor": "#2F5496"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 5",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 0,
                "rightIndent": 0,
                "firstLineIndent": 0,
                "textAlignment": "Left",
                "beforeSpacing": 2,
                "afterSpacing": 0,
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level5",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontFamily": "Calibri Light",
                "fontColor": "#2F5496"
            },
            "basedOn": "Normal",
            "link": "Heading 5 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 5 Char",
            "type": "Character",
            "characterFormat": {
                "fontFamily": "Calibri Light",
                "fontColor": "#2F5496"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 6",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 0,
                "rightIndent": 0,
                "firstLineIndent": 0,
                "textAlignment": "Left",
                "beforeSpacing": 2,
                "afterSpacing": 0,
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level6",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontFamily": "Calibri Light",
                "fontColor": "#1F3763"
            },
            "basedOn": "Normal",
            "link": "Heading 6 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 6 Char",
            "type": "Character",
            "characterFormat": {
                "fontFamily": "Calibri Light",
                "fontColor": "#1F3763"
            },
            "basedOn": "Default Paragraph Font"
        }
    ],
    "lists": [
    ],
    "abstractLists": [
    ],
    "comments": [
    ]
}
describe('Form Filling validation For Formatting', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({
            enableEditor: true, isReadOnly: false, enableEditorHistory: true,
            documentEditorSettings: { formFieldSettings: { formFillingMode: 'Inline' } }
        });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(JSON.stringify(TextFormField));
        editor.selection.isHighlightEditRegion = true;
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Form Filling TextForm Field validation For CharacterFormatting', () => {
console.log('Form Filling TextForm Field validation For CharacterFormatting');
        editor.selection.navigateToNextFormField();
        editor.selection.selectField();
        editor.documentEditorSettings.formFieldSettings.formattingExceptions = ['Bold', 'Italic'];
        editor.editorModule.onApplyCharacterFormat('bold', true, false);
        expect(editor.documentHelper.protectionType).toBe('FormFieldsOnly');
        expect(editor.documentHelper.isDocumentProtected).toBe(true);
        expect(editor.selection.characterFormat.bold).toBe(true);
    });
    it('Form Filling TextForm Field validation For ParagraphFormatting', () => {
console.log('Form Filling TextForm Field validation For ParagraphFormatting');
        editor.selection.selectField();
        editor.documentEditorSettings.formFieldSettings.formattingExceptions = ['TextAlignment'];
        editor.editorModule.onApplyParagraphFormat('textAlignment', 'Center', false, true);
        expect(editor.documentHelper.protectionType).toBe('FormFieldsOnly');
        expect(editor.documentHelper.isDocumentProtected).toBe(true);
        expect(editor.selection.paragraphFormat.textAlignment).toBe('Center');
    });
});

/**
 * Restrict editing inside
 */

// let restrictData: any = {
//     "sections": [
//         {
//             "blocks": [
//                 {
//                     "paragraphFormat": {
//                         "styleName": "Normal"
//                     },
//                     "characterFormat": {},
//                     "inlines": [
//                         {
//                             "characterFormat": {},
//                             "text": "Out of table"
//                         }
//                     ]
//                 },
//                 {
//                     "paragraphFormat": {},
//                     "characterFormat": {},
//                     "inlines": []
//                 },
//                 {
//                     "rows": [
//                         {
//                             "cells": [
//                                 {
//                                     "blocks": [
//                                         {
//                                             "paragraphFormat": {
//                                                 "styleName": "Section Title"
//                                             },
//                                             "characterFormat": {},
//                                             "inlines": [
//                                                 {
//                                                     "characterFormat": {},
//                                                     "text": "TITLE IN TABLE"
//                                                 }
//                                             ]
//                                         }
//                                     ],
//                                     "cellFormat": {
//                                         "borders": {
//                                             "top": {},
//                                             "left": {},
//                                             "right": {},
//                                             "bottom": {},
//                                             "diagonalDown": {},
//                                             "diagonalUp": {},
//                                             "horizontal": {},
//                                             "vertical": {}
//                                         },
//                                         "shading": {
//                                             "backgroundColor": "#415364FF",
//                                             "foregroundColor": "empty",
//                                             "textureStyle": "TextureNone"
//                                         },
//                                         "preferredWidth": 468,
//                                         "preferredWidthType": "Point",
//                                         "cellWidth": 468,
//                                         "columnSpan": 1,
//                                         "rowSpan": 1,
//                                         "verticalAlignment": "Center"
//                                     },
//                                     "columnIndex": 0
//                                 }
//                             ],
//                             "rowFormat": {
//                                 "height": 20,
//                                 "allowBreakAcrossPages": true,
//                                 "heightType": "AtLeast",
//                                 "isHeader": false,
//                                 "borders": {
//                                     "top": {},
//                                     "left": {},
//                                     "right": {},
//                                     "bottom": {},
//                                     "diagonalDown": {},
//                                     "diagonalUp": {},
//                                     "horizontal": {},
//                                     "vertical": {}
//                                 },
//                                 "gridBefore": 1,
//                                 "gridBeforeWidth": 0,
//                                 "gridBeforeWidthType": "Point",
//                                 "gridAfter": 0,
//                                 "leftMargin": 5.4,
//                                 "topMargin": 0,
//                                 "rightMargin": 5.4,
//                                 "bottomMargin": 0
//                             }
//                         }
//                     ],
//                     "grid": [
//                         468
//                     ],
//                     "tableFormat": {
//                         "borders": {
//                             "top": {},
//                             "left": {},
//                             "right": {},
//                             "bottom": {},
//                             "diagonalDown": {},
//                             "diagonalUp": {},
//                             "horizontal": {},
//                             "vertical": {}
//                         },
//                         "shading": {},
//                         "leftIndent": 0,
//                         "topMargin": 0,
//                         "rightMargin": 5.4,
//                         "leftMargin": 5.4,
//                         "bottomMargin": 0,
//                         "bidi": false,
//                         "allowAutoFit": true
//                     },
//                     "columnCount": 1
//                 },
//                 {
//                     "paragraphFormat": {},
//                     "characterFormat": {},
//                     "inlines": []
//                 },
//                 {
//                     "rows": [
//                         {
//                             "cells": [
//                                 {
//                                     "blocks": [
//                                         {
//                                             "paragraphFormat": {
//                                                 "listFormat": {},
//                                                 "styleName": "Normal"
//                                             },
//                                             "characterFormat": {},
//                                             "inlines": [
//                                                 {
//                                                     "characterFormat": {},
//                                                     "text": "Key 0"
//                                                 }
//                                             ]
//                                         }
//                                     ],
//                                     "cellFormat": {
//                                         "borders": {
//                                             "top": {},
//                                             "left": {},
//                                             "right": {},
//                                             "bottom": {},
//                                             "diagonalDown": {},
//                                             "diagonalUp": {},
//                                             "horizontal": {},
//                                             "vertical": {}
//                                         },
//                                         "shading": {},
//                                         "preferredWidth": 234,
//                                         "cellWidth": 234,
//                                         "columnSpan": 1,
//                                         "rowSpan": 1
//                                     },
//                                     "columnIndex": 0
//                                 },
//                                 {
//                                     "blocks": [
//                                         {
//                                             "paragraphFormat": {
//                                                 "listFormat": {},
//                                                 "styleName": "Normal"
//                                             },
//                                             "inlines": [
//                                                 {
//                                                     "editRangeId": "0",
//                                                     "columnFirst": 1,
//                                                     "columnLast": 1,
//                                                     "user": "Everyone"
//                                                 },
//                                                 {
//                                                     "characterFormat": {},
//                                                     "text": " "
//                                                 }
//                                             ]
//                                         },
//                                         {
//                                             "paragraphFormat": {
//                                                 "styleName": "Restricted Editing"
//                                             },
//                                             "inlines": [
//                                                 {
//                                                     "editableRangeStart": {
//                                                         "user": "Everyone",
//                                                         "group": "",
//                                                         "columnFirst": 1,
//                                                         "columnLast": 1
//                                                     },
//                                                     "editRangeId": "0"
//                                                 }
//                                             ]
//                                         }
//                                     ],
//                                     "cellFormat": {
//                                         "borders": {
//                                             "top": {},
//                                             "left": {},
//                                             "right": {},
//                                             "bottom": {},
//                                             "diagonalDown": {},
//                                             "diagonalUp": {},
//                                             "horizontal": {},
//                                             "vertical": {}
//                                         },
//                                         "shading": {},
//                                         "preferredWidth": 234,
//                                         "cellWidth": 234,
//                                         "columnSpan": 1,
//                                         "rowSpan": 1
//                                     },
//                                     "columnIndex": 1
//                                 }
//                             ],
//                             "rowFormat": {
//                                 "height": 0,
//                                 "heightType": "Auto",
//                                 "borders": {
//                                     "top": {},
//                                     "left": {},
//                                     "right": {},
//                                     "bottom": {},
//                                     "diagonalDown": {},
//                                     "diagonalUp": {},
//                                     "horizontal": {},
//                                     "vertical": {}
//                                 },
//                                 "gridBefore": 0,
//                                 "gridAfter": 0
//                             }
//                         },
//                         {
//                             "cells": [
//                                 {
//                                     "blocks": [
//                                         {
//                                             "paragraphFormat": {
//                                                 "listFormat": {},
//                                                 "styleName": "Normal"
//                                             },
//                                             "characterFormat": {},
//                                             "inlines": [
//                                                 {
//                                                     "characterFormat": {},
//                                                     "text": "Key 1"
//                                                 }
//                                             ]
//                                         }
//                                     ],
//                                     "cellFormat": {
//                                         "borders": {
//                                             "top": {},
//                                             "left": {},
//                                             "right": {},
//                                             "bottom": {},
//                                             "diagonalDown": {},
//                                             "diagonalUp": {},
//                                             "horizontal": {},
//                                             "vertical": {}
//                                         },
//                                         "shading": {},
//                                         "preferredWidth": 234,
//                                         "cellWidth": 234,
//                                         "columnSpan": 1,
//                                         "rowSpan": 1
//                                     },
//                                     "columnIndex": 0
//                                 },
//                                 {
//                                     "blocks": [
//                                         {
//                                             "paragraphFormat": {
//                                                 "listFormat": {},
//                                                 "styleName": "Normal"
//                                             },
//                                             "inlines": [
//                                                 {
//                                                     "editRangeId": "1",
//                                                     "columnFirst": 1,
//                                                     "columnLast": 1,
//                                                     "user": "Everyone"
//                                                 },
//                                                 {
//                                                     "characterFormat": {},
//                                                     "text": " "
//                                                 }
//                                             ]
//                                         },
//                                         {
//                                             "paragraphFormat": {
//                                                 "styleName": "Restricted Editing"
//                                             },
//                                             "inlines": [
//                                                 {
//                                                     "editableRangeStart": {
//                                                         "user": "Everyone",
//                                                         "group": "",
//                                                         "columnFirst": 1,
//                                                         "columnLast": 1
//                                                     },
//                                                     "editRangeId": "1"
//                                                 }
//                                             ]
//                                         }
//                                     ],
//                                     "cellFormat": {
//                                         "borders": {
//                                             "top": {},
//                                             "left": {},
//                                             "right": {},
//                                             "bottom": {},
//                                             "diagonalDown": {},
//                                             "diagonalUp": {},
//                                             "horizontal": {},
//                                             "vertical": {}
//                                         },
//                                         "shading": {},
//                                         "preferredWidth": 234,
//                                         "cellWidth": 234,
//                                         "columnSpan": 1,
//                                         "rowSpan": 1
//                                     },
//                                     "columnIndex": 1
//                                 }
//                             ],
//                             "rowFormat": {
//                                 "height": 0,
//                                 "heightType": "Auto",
//                                 "borders": {
//                                     "top": {},
//                                     "left": {},
//                                     "right": {},
//                                     "bottom": {},
//                                     "diagonalDown": {},
//                                     "diagonalUp": {},
//                                     "horizontal": {},
//                                     "vertical": {}
//                                 },
//                                 "gridBefore": 0,
//                                 "gridAfter": 0
//                             }
//                         }
//                     ],
//                     "grid": [
//                         234,
//                         234
//                     ],
//                     "tableFormat": {
//                         "borders": {
//                             "top": {
//                                 "lineStyle": "Single",
//                                 "lineWidth": 0.5
//                             },
//                             "left": {
//                                 "lineStyle": "Single",
//                                 "lineWidth": 0.5
//                             },
//                             "right": {
//                                 "lineStyle": "Single",
//                                 "lineWidth": 0.5
//                             },
//                             "bottom": {
//                                 "lineStyle": "Single",
//                                 "lineWidth": 0.5
//                             },
//                             "diagonalDown": {},
//                             "diagonalUp": {},
//                             "horizontal": {
//                                 "lineStyle": "Single",
//                                 "lineWidth": 0.5
//                             },
//                             "vertical": {
//                                 "lineStyle": "Single",
//                                 "lineWidth": 0.5
//                             }
//                         },
//                         "shading": {},
//                         "topMargin": 0,
//                         "rightMargin": 5.4,
//                         "leftMargin": 5.4,
//                         "bottomMargin": 0,
//                         "preferredWidthType": "Auto"
//                     },
//                     "columnCount": 2
//                 },
//                 {
//                     "paragraphFormat": {},
//                     "characterFormat": {},
//                     "inlines": [
//                         {
//                             "characterFormat": {},
//                             "text": ""
//                         }
//                     ]
//                 }
//             ],
//             "headersFooters": {},
//             "sectionFormat": {
//                 "headerDistance": 36.0,
//                 "footerDistance": 36.0,
//                 "pageWidth": 612.0,
//                 "pageHeight": 792.0,
//                 "leftMargin": 72.0,
//                 "rightMargin": 72.0,
//                 "topMargin": 72.0,
//                 "bottomMargin": 72.0,
//                 "differentFirstPage": false,
//                 "differentOddAndEvenPages": false,
//                 "bidi": false
//             }
//         }
//     ],
//     "characterFormat": {
//         "bold": false,
//         "italic": false,
//         "fontSize": 10,
//         "fontFamily": "Arial",
//         "underline": "None",
//         "strikethrough": "None",
//         "baselineAlignment": "Normal",
//         "highlightColor": "NoColor",
//         "fontColor": "#000000",
//         "fontSizeBidi": 10,
//         "fontFamilyBidi": "Arial"
//     },
//     "paragraphFormat": {
//         "leftIndent": 0,
//         "rightIndent": 0,
//         "firstLineIndent": 0,
//         "textAlignment": "Left",
//         "beforeSpacing": 0,
//         "afterSpacing": 0,
//         "lineSpacing": 1,
//         "lineSpacingType": "Multiple",
//         "listFormat": {},
//         "bidi": false
//     },
//     "defaultTabWidth": 36,
//     "styles": [
//         {
//             "name": "Normal",
//             "type": "Paragraph",
//             "paragraphFormat": {
//                 "leftIndent": 0,
//                 "rightIndent": 0,
//                 "firstLineIndent": 0,
//                 "textAlignment": "Left",
//                 "beforeSpacing": 0,
//                 "afterSpacing": 0,
//                 "lineSpacing": 1.15,
//                 "lineSpacingType": "Multiple",
//                 "listFormat": {},
//                 "bidi": false
//             },
//             "characterFormat": {
//                 "bold": false,
//                 "italic": false,
//                 "fontSize": 10,
//                 "fontFamily": "Arial",
//                 "underline": "None",
//                 "strikethrough": "None",
//                 "baselineAlignment": "Normal",
//                 "highlightColor": "NoColor",
//                 "fontColor": "#000000",
//                 "fontSizeBidi": 10,
//                 "fontFamilyBidi": "Arial"
//             },
//             "next": "Normal"
//         },
//         {
//             "name": "Notes",
//             "type": "Paragraph",
//             "paragraphFormat": {
//                 "leftIndent": 0,
//                 "rightIndent": 0,
//                 "firstLineIndent": 0,
//                 "textAlignment": "Left",
//                 "beforeSpacing": 0,
//                 "afterSpacing": 0,
//                 "lineSpacing": 1.15,
//                 "lineSpacingType": "Multiple",
//                 "listFormat": {},
//                 "bidi": false
//             },
//             "characterFormat": {
//                 "bold": false,
//                 "italic": true,
//                 "fontSize": 9,
//                 "fontFamily": "Arial",
//                 "underline": "None",
//                 "strikethrough": "None",
//                 "baselineAlignment": "Normal",
//                 "highlightColor": "NoColor",
//                 "fontColor": "#000000",
//                 "fontSizeBidi": 9,
//                 "fontFamilyBidi": "Arial",
//                 "bidi": false
//             },
//             "next": "Notes"
//         },
//         {
//             "name": "Restricted Editing",
//             "type": "Paragraph",
//             "paragraphFormat": {
//                 "leftIndent": 0,
//                 "rightIndent": 0,
//                 "firstLineIndent": 0,
//                 "textAlignment": "Left",
//                 "beforeSpacing": 0,
//                 "afterSpacing": 0,
//                 "lineSpacing": 0,
//                 "lineSpacingType": "Multiple",
//                 "listFormat": {},
//                 "bidi": false
//             },
//             "characterFormat": {
//                 "bold": false,
//                 "italic": false,
//                 "fontSize": 1,
//                 "fontFamily": "Arial",
//                 "underline": "None",
//                 "strikethrough": "None",
//                 "baselineAlignment": "Normal",
//                 "highlightColor": "NoColor",
//                 "fontColor": "#000000FF",
//                 "fontSizeBidi": 1,
//                 "fontFamilyBidi": "Arial"
//             },
//             "basedOn": "Normal",
//             "next": "Restricted Editing"
//         },
//         {
//             "name": "Section Title",
//             "type": "Paragraph",
//             "paragraphFormat": {
//                 "leftIndent": 0,
//                 "rightIndent": 0,
//                 "firstLineIndent": 0,
//                 "textAlignment": "Left",
//                 "beforeSpacing": 0,
//                 "afterSpacing": 0.2,
//                 "lineSpacing": 1,
//                 "lineSpacingType": "Multiple",
//                 "outlineLevel": "BodyText",
//                 "listFormat": {},
//                 "bidi": false,
//                 "contextualSpacing": false
//             },
//             "characterFormat": {
//                 "bold": true,
//                 "italic": false,
//                 "fontSize": 12,
//                 "fontFamily": "Arial",
//                 "strikethrough": "None",
//                 "fontColor": "#FFFFFFFF",
//                 "bidi": false,
//                 "fontSizeBidi": 12,
//                 "fontFamilyBidi": "Arial"
//             },
//             "basedOn": "Normal",
//             "next": "Section Title"
//         },
//         {
//             "name": "Notes Index",
//             "type": "Paragraph",
//             "paragraphFormat": {},
//             "characterFormat": {
//                 "baselineAlignment": "Superscript"
//             },
//             "basedOn": "Normal",
//             "next": "Normal"
//         }
//     ],
//     "lists": [
//         {
//             "abstractListId": 0,
//             "listId": 0
//         }
//     ],
//     "abstractLists": [
//         {
//             "abstractListId": 0,
//             "levels": [
//                 {
//                     "characterFormat": {
//                         "bold": false,
//                         "italic": true,
//                         "fontSize": 9,
//                         "fontFamily": "Arial",
//                         "underline": "None",
//                         "strikethrough": "None",
//                         "baselineAlignment": "Normal",
//                         "highlightColor": "NoColor",
//                         "fontColor": "#000000",
//                         "fontSizeBidi": 9,
//                         "fontFamilyBidi": "Arial",
//                         "bidi": false
//                     },
//                     "paragraphFormat": {
//                         "leftIndent": 0,
//                         "firstLineIndent": -18,
//                         "listFormat": {}
//                     },
//                     "followCharacter": "Tab",
//                     "listLevelPattern": "Arabic",
//                     "numberFormat": "%1.",
//                     "restartLevel": 0,
//                     "startAt": 1
//                 }
//             ]
//         }
//     ],
//     "comments": [],
//     "enforcement": true,
//     "hashValue": "0A6BRhgb7C35JUaau8qeETWxzp4O8TjjGorpxLEPw38dZLWfkB///MlunuZDLzDzBHhdK1B2nMyusb0+do6hSQ==",
//     "saltValue": "ij25cMkkS+M/f5fyEQEFdQ==",
//     "formatting": false,
//     "protectionType": "ReadOnly"
// };

// describe('Delete inside restricked content', () => {
//     let editor: DocumentEditor = undefined;
//     beforeAll(() => {
//         document.body.innerHTML = '';
//         let ele: HTMLElement = createElement('div', { id: 'container' });
//         document.body.appendChild(ele);
//         DocumentEditor.Inject(Editor, Selection, EditorHistory);
//         editor = new DocumentEditor({
//             enableEditor: true, isReadOnly: false, enableEditorHistory: true,
//             documentEditorSettings: { formFieldSettings: { formFillingMode: 'Inline' } }
//         });
//         (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
//         (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
//         (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
//         (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
//         editor.appendTo('#container');
//         editor.open(JSON.stringify(restrictData));
//         editor.selection.isHighlightEditRegion = true;
//     });
//     afterAll((done) => {
//         editor.destroy();
//         document.body.removeChild(document.getElementById('container'));
//         editor = undefined;
//         document.body.innerHTML = '';
//         setTimeout(() => {
//             done();
//         }, 1000);
//     });
//     it('Delete', () => {
//         editor.selection.select("0;4;0;1;0;2", "0;4;0;1;0;2");
//         editor.editor.delete();
//         expect(editor.selection.start.currentWidget.children.length).toBe(3);
//         editor.editor.delete();
//         expect(editor.selection.start.currentWidget.children.length).toBe(3);
//     });
//     it('Enter inside restricted area', () => {

//         editor.editor.onEnter();
//         editor.selection.select("0;4;0;1;0;2", "0;4;0;1;0;2");
//         expect(() => { editor.editor.delete(); }).not.toThrowError();
//     });
// });

/**
 * Restrict editing selection and edit region validation
 */
describe('Restrict editing rown and column protection validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(getRowAndColumnProtectedDocument());
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Validate row protection', () => {
        console.log('Validate row protection');
        editor.selection.select('0;1;0;0;0;0', '0;1;0;0;0;0');
        let rowCount: number = editor.selection.start.paragraph.associatedCell.ownerTable.childWidgets.length;
        let columnCount: number = editor.selection.start.paragraph.associatedCell.ownerTable.tableHolder.columns.length;


        for (let i: number = 1; i < (rowCount * columnCount) - 1; i++) {
            let selectedCell: TableCellWidget = editor.selection.start.paragraph.associatedCell;
            if (selectedCell.ownerRow.index == 1) {
                expect(editor.isReadOnlyMode).toBe(false);
            } else {
                expect(editor.isReadOnlyMode).toBe(true);
            }
            (editor.selection as any).selectNextCell()
        }
    });
    it('Validate column protection', () => {
        console.log('Validate column protection');
        editor.selection.select('0;4;0;0;0;0', '0;4;0;0;0;0');
        let rowCount: number = editor.selection.start.paragraph.associatedCell.ownerTable.childWidgets.length;
        let columnCount: number = editor.selection.start.paragraph.associatedCell.ownerTable.tableHolder.columns.length;

        for (let i: number = 1; i < (rowCount * columnCount) - 1; i++) {
            let selectedCell: TableCellWidget = editor.selection.start.paragraph.associatedCell;
            if (selectedCell.index == 1) {
                expect(editor.isReadOnlyMode).toBe(false);
            } else {
                expect(editor.isReadOnlyMode).toBe(true);
            }
            (editor.selection as any).selectNextCell()
        }
    });
});

function getRowAndColumnProtectedDocument(): string {
    let protectedDocument: any = { "sections": [{ "blocks": [{ "inlines": [{ "text": "Row" }, { "text": " protection" }] }, { "rows": [{ "rowFormat": { "allowBreakAcrossPages": true, "isHeader": false, "height": 0.0, "heightType": "AtLeast", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } }, "cells": [{ "blocks": [{ "inlines": [{ "text": "Protected Cell" }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 124.25, "preferredWidthType": "Point", "verticalAlignment": "Top", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 124.25 } }, { "blocks": [{ "inlines": [{ "text": "Protected Cell" }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 121.94999694824219, "preferredWidthType": "Point", "verticalAlignment": "Top", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 121.94999694824219 } }, { "blocks": [{ "inlines": [{ "text": "Protected Cell" }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 110.6500015258789, "preferredWidthType": "Point", "verticalAlignment": "Top", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 110.6500015258789 } }, { "blocks": [{ "inlines": [{ "text": "Protected Cell" }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 110.6500015258789, "preferredWidthType": "Point", "verticalAlignment": "Top", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 110.6500015258789 } }] }, { "rowFormat": { "allowBreakAcrossPages": true, "isHeader": false, "height": 0.0, "heightType": "AtLeast", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } }, "cells": [{ "blocks": [{ "inlines": [{ "editRangeId": "885525315", "columnFirst": 0, "columnLast": 0, "group": "everyone" }, { "editRangeId": "1348348698", "columnFirst": 1, "columnLast": 1, "group": "everyone" }, { "editRangeId": "2071688626", "columnFirst": 2, "columnLast": 2, "group": "everyone" }, { "editRangeId": "1071409844", "columnFirst": 3, "columnLast": 3, "group": "everyone" }, { "text": "Editable Cell " }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 124.25, "preferredWidthType": "Point", "verticalAlignment": "Top", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 124.25 } }, { "blocks": [{ "inlines": [{ "text": "Editable Cell " }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 121.94999694824219, "preferredWidthType": "Point", "verticalAlignment": "Top", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 121.94999694824219 } }, { "blocks": [{ "inlines": [{ "text": "Editable Cell " }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 110.6500015258789, "preferredWidthType": "Point", "verticalAlignment": "Top", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 110.6500015258789 } }, { "blocks": [{ "inlines": [{ "text": "Editable Cell " }, { "editRangeId": "885525315", "editableRangeStart": { "editRangeId": "885525315", "columnFirst": 0, "columnLast": 0, "group": "everyone" } }, { "editRangeId": "1348348698", "editableRangeStart": { "editRangeId": "1348348698", "columnFirst": 1, "columnLast": 1, "group": "everyone" } }, { "editRangeId": "2071688626", "editableRangeStart": { "editRangeId": "2071688626", "columnFirst": 2, "columnLast": 2, "group": "everyone" } }, { "editRangeId": "1071409844", "editableRangeStart": { "editRangeId": "1071409844", "columnFirst": 3, "columnLast": 3, "group": "everyone" } }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 110.6500015258789, "preferredWidthType": "Point", "verticalAlignment": "Top", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 110.6500015258789 } }] }, { "rowFormat": { "allowBreakAcrossPages": true, "isHeader": false, "height": 0.0, "heightType": "AtLeast", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } }, "cells": [{ "blocks": [{ "inlines": [{ "text": "Protected Cell" }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 124.25, "preferredWidthType": "Point", "verticalAlignment": "Top", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 124.25 } }, { "blocks": [{ "inlines": [{ "text": "Protected Cell" }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 121.94999694824219, "preferredWidthType": "Point", "verticalAlignment": "Top", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 121.94999694824219 } }, { "blocks": [{ "inlines": [{ "text": "Protected Cell" }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 110.6500015258789, "preferredWidthType": "Point", "verticalAlignment": "Top", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 110.6500015258789 } }, { "blocks": [{ "inlines": [{ "text": "Protected Cell" }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 110.6500015258789, "preferredWidthType": "Point", "verticalAlignment": "Top", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 110.6500015258789 } }] }], "title": null, "description": null, "tableFormat": { "allowAutoFit": true, "leftIndent": 0.0, "tableAlignment": "Left", "preferredWidthType": "Auto", "borders": { "left": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#000000FF" }, "right": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#000000FF" }, "top": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#000000FF" }, "bottom": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#000000FF" }, "vertical": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#000000FF" }, "horizontal": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#000000FF" }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "bidi": false, "horizontalPositionAbs": "Left", "horizontalPosition": 0.0 } }, { "inlines": [] }, { "inlines": [{ "text": "Column protection" }] }, { "rows": [{ "rowFormat": { "allowBreakAcrossPages": true, "isHeader": false, "height": 0.0, "heightType": "AtLeast", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } }, "cells": [{ "blocks": [{ "inlines": [{ "editRangeId": "1147156371", "columnFirst": 1, "columnLast": 1, "group": "everyone" }, { "text": "Protected Cell:" }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 124.25, "preferredWidthType": "Point", "verticalAlignment": "Top", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 124.25 } }, { "blocks": [{ "inlines": [{ "text": "Editable Cell" }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 121.94999694824219, "preferredWidthType": "Point", "verticalAlignment": "Top", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 121.94999694824219 } }, { "blocks": [{ "inlines": [{ "text": "Protected Cell:" }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 110.6500015258789, "preferredWidthType": "Point", "verticalAlignment": "Top", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 110.6500015258789 } }, { "blocks": [{ "inlines": [{ "text": "Protected Cell:" }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 110.6500015258789, "preferredWidthType": "Point", "verticalAlignment": "Top", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 110.6500015258789 } }] }, { "rowFormat": { "allowBreakAcrossPages": true, "isHeader": false, "height": 0.0, "heightType": "AtLeast", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } }, "cells": [{ "blocks": [{ "inlines": [{ "editRangeId": "1708872778", "columnFirst": 1, "columnLast": 1, "group": "everyone" }, { "editRangeId": "1147156371", "editableRangeStart": { "editRangeId": "1147156371", "columnFirst": 1, "columnLast": 1, "group": "everyone" } }, { "text": "Protected Cell:" }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 124.25, "preferredWidthType": "Point", "verticalAlignment": "Top", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 124.25 } }, { "blocks": [{ "inlines": [{ "text": "Editable Cell" }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 121.94999694824219, "preferredWidthType": "Point", "verticalAlignment": "Top", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 121.94999694824219 } }, { "blocks": [{ "inlines": [{ "text": "Protected Cell:" }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 110.6500015258789, "preferredWidthType": "Point", "verticalAlignment": "Top", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 110.6500015258789 } }, { "blocks": [{ "inlines": [{ "text": "Protected Cell:" }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 110.6500015258789, "preferredWidthType": "Point", "verticalAlignment": "Top", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 110.6500015258789 } }] }, { "rowFormat": { "allowBreakAcrossPages": true, "isHeader": false, "height": 0.0, "heightType": "AtLeast", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } }, "cells": [{ "blocks": [{ "inlines": [{ "editRangeId": "1261197102", "columnFirst": 1, "columnLast": 1, "group": "everyone" }, { "editRangeId": "1708872778", "editableRangeStart": { "editRangeId": "1708872778", "columnFirst": 1, "columnLast": 1, "group": "everyone" } }, { "text": "Protected Cell:" }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 124.25, "preferredWidthType": "Point", "verticalAlignment": "Top", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 124.25 } }, { "blocks": [{ "inlines": [{ "text": "Editable Cell" }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 121.94999694824219, "preferredWidthType": "Point", "verticalAlignment": "Top", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 121.94999694824219 } }, { "blocks": [{ "inlines": [{ "text": "Protected Cell:" }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 110.6500015258789, "preferredWidthType": "Point", "verticalAlignment": "Top", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 110.6500015258789 } }, { "blocks": [{ "inlines": [{ "text": "Protected Cell:" }, { "editRangeId": "1261197102", "editableRangeStart": { "editRangeId": "1261197102", "columnFirst": 1, "columnLast": 1, "group": "everyone" } }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 110.6500015258789, "preferredWidthType": "Point", "verticalAlignment": "Top", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 110.6500015258789 } }] }], "title": null, "description": null, "tableFormat": { "allowAutoFit": true, "leftIndent": 0.0, "tableAlignment": "Left", "preferredWidthType": "Auto", "borders": { "left": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#000000FF" }, "right": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#000000FF" }, "top": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#000000FF" }, "bottom": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#000000FF" }, "vertical": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#000000FF" }, "horizontal": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#000000FF" }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "bidi": false, "horizontalPositionAbs": "Left", "horizontalPosition": 0.0 } }, { "inlines": [] }], "headersFooters": { "header": { "blocks": [{ "characterFormat": { "fontSize": 14.0, "fontSizeBidi": 14.0 }, "paragraphFormat": { "textAlignment": "Center", "styleName": "Header" }, "inlines": [{ "text": "Protected Cells ", "characterFormat": { "fontSize": 14.0, "fontSizeBidi": 14.0 } }] }] } }, "sectionFormat": { "headerDistance": 36.0, "footerDistance": 36.0, "pageWidth": 612.0, "pageHeight": 792.0, "leftMargin": 72.0, "rightMargin": 72.0, "topMargin": 72.0, "bottomMargin": 72.0, "differentFirstPage": false, "differentOddAndEvenPages": false, "bidi": false, "restartPageNumbering": false, "pageStartingNumber": 0, "endnoteNumberFormat": "LowerCaseRoman", "footNoteNumberFormat": "Arabic", "restartIndexForFootnotes": "DoNotRestart", "restartIndexForEndnotes": "DoNotRestart", "columns": { "column": [{ "width": 468.0, "space": 36.0 }], "numberOfColumns": 1, "equalWidth": true } } }], "characterFormat": { "fontSize": 11.0, "fontFamily": "Calibri", "fontSizeBidi": 11.0, "fontFamilyBidi": "Arial" }, "paragraphFormat": { "afterSpacing": 8.0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple" }, "background": { "color": "#FFFFFFFF" }, "styles": [{ "type": "Paragraph", "name": "Normal", "next": "Normal" }, { "type": "Character", "name": "Default Paragraph Font" }, { "type": "Paragraph", "name": "Header", "basedOn": "Normal", "next": "Header", "link": "Header Char", "paragraphFormat": { "afterSpacing": 0.0, "lineSpacing": 1.0, "lineSpacingType": "Multiple", "tabs": [{ "tabJustification": "Center", "position": 234.0, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Right", "position": 468.0, "tabLeader": "None", "deletePosition": 0.0 }] } }, { "type": "Character", "name": "Header Char", "basedOn": "Default Paragraph Font" }, { "type": "Paragraph", "name": "Footer", "basedOn": "Normal", "next": "Footer", "link": "Footer Char", "paragraphFormat": { "afterSpacing": 0.0, "lineSpacing": 1.0, "lineSpacingType": "Multiple", "tabs": [{ "tabJustification": "Center", "position": 234.0, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Right", "position": 468.0, "tabLeader": "None", "deletePosition": 0.0 }] } }, { "type": "Character", "name": "Footer Char", "basedOn": "Default Paragraph Font" }], "defaultTabWidth": 36.0, "formatting": false, "trackChanges": false, "protectionType": "ReadOnly", "enforcement": true, "cryptProviderType": "rsaFull", "cryptAlgorithmClass": "hash", "cryptAlgorithmType": "typeAny", "cryptAlgorithmSid": "4", "cryptSpinCount": "100000", "dontUseHTMLParagraphAutoSpacing": false, "alignTablesRowByRow": false, "formFieldShading": true, "footnotes": { "separator": [{ "paragraphFormat": { "afterSpacing": 0.0, "lineSpacing": 1.0, "lineSpacingType": "Multiple" }, "inlines": [{ "text": "\\u0003" }] }], "continuationSeparator": [{ "paragraphFormat": { "afterSpacing": 0.0, "lineSpacing": 1.0, "lineSpacingType": "Multiple" }, "inlines": [{ "text": "\\u0004" }] }], "continuationNotice": [{ "inlines": [] }] }, "endnotes": { "separator": [{ "paragraphFormat": { "afterSpacing": 0.0, "lineSpacing": 1.0, "lineSpacingType": "Multiple" }, "inlines": [{ "text": "\\u0003" }] }], "continuationSeparator": [{ "paragraphFormat": { "afterSpacing": 0.0, "lineSpacing": 1.0, "lineSpacingType": "Multiple" }, "inlines": [{ "text": "\\u0004" }] }], "continuationNotice": [{ "inlines": [] }] }, "compatibilityMode": "Word2013" };
    return JSON.stringify(protectedDocument);
}

let file : any = {"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false},"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"headersFooters":{"header":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"footer":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"evenHeader":{},"evenFooter":{},"firstPageHeader":{},"firstPageFooter":{}}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"bidi":false,"keepLinesTogether":false,"keepWithNext":false,"widowControl":true},"defaultTabWidth":36,"trackChanges":false,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"compatibilityMode":"Word2013","styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{},"next":"Normal"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":12,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[],"comments":[],"revisions":[],"customXml":[]};

describe('Adding CommentsOnly Protection to the file', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(JSON.stringify(file));
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Return True if the document is CommentsOnly Protected',() =>{
        console.log('Return True if the document is CommentsOnly Protected');
        editor.editor.addProtection('','CommentsOnly');
        expect(editor.documentHelper.protectionType).toBe('CommentsOnly');
    });
    it('Display CommentsOnly Restrict Pane onclick of Enfore Protection Button',() =>{
        console.log('Display CommentsOnly Restrict Pane');
        expect(() => { editor.showRestrictEditingPane() }).not.toThrowError();
    });
    it('Display of restrictPaneWholeDiv should be none', () => {
        console.log('Display of restrictPaneWholeDiv should be none');
        expect(editor.documentHelper.restrictEditingPane.restrictPaneWholeDiv.style.display).toBe('none');
    });
    it('Display of stopProtectionDiv should be block',() =>{
        console.log('Display of stopProtectionDiv should be block');
        expect(editor.documentHelper.restrictEditingPane.stopProtectionDiv.style.display).toBe('block');
    });
    it('Check the CommentsOnly restrict pane description',() =>{
        console.log('Checking the CommentsOnly restrict pane description');
        expect(editor.documentHelper.restrictEditingPane.stopProtectionDiv.textContent.toString()).toContain('This document is protected from unintentional editing. You may only insert comments into this region.');
    });
    it('Not to contain Format text description',() =>{
        console.log('Not to contain Format text description');
        expect(editor.documentHelper.restrictEditingPane.contentDiv2.style.display).toBe('none');
    });
    it('Return NoProtection to be true',() =>{
        console.log('Unprotecting the document');
        editor.editor.unProtectDocument();
        console.log('Return NoProtection to be true');
        expect(editor.documentHelper.protectionType).toBe('NoProtection');
    });
    it('Display of stopProtectionDiv should be none',() =>{
        console.log('Display of stopProtectionDiv should be none');
        expect(editor.documentHelper.restrictEditingPane.stopProtectionDiv.style.display).toBe('none');
    });
    it('Display of restrictPaneWholeDiv should be block',() =>{
        console.log('Display of restrictPaneWholeDiv should be block');
        expect(editor.documentHelper.restrictEditingPane.restrictPaneWholeDiv.style.display).toBe('block');
    });
});

describe('Restricting Editing with Tracked changes', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true });
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
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('should return true if document is Protected with RevisionsOnly', () => {
        console.log('should return true if document is Protected with RevisionsOnly');
        editor.editor.addProtection('', 'RevisionsOnly');
        expect(editor.documentHelper.protectionType).toBe('RevisionsOnly');
        expect(editor.documentHelper.isDocumentProtected).toBe(true);
        expect(editor.enableTrackChanges).toBe(true);
    });
    it('should return true if document is Unprotected ', () => {
        console.log('should return false if document is Unprotected');
        editor.editor.unProtectDocument();
        expect(editor.documentHelper.protectionType).toBe('NoProtection');
        expect(editor.documentHelper.isDocumentProtected).toBe(false);
        expect(editor.enableTrackChanges).toBe(false);
    });
    it('if protection Type in RevisionsOnly trackedchanges cannot be AcceptAll in edit region', () => {
        editor.openBlank();
        console.log(' if protection Type in RevisionsOnly trackedchanges cannot be AcceptAll in edit region');
        editor.editor.addProtection('', 'RevisionsOnly');
        editor.editor.insertText("Hello");
        editor.revisions.acceptAll();
        expect(editor.revisions.length).toBe(1);
    });
    it('if protection Type in RevisionsOnly trackedchanges cannot be RejectAll in edit region', () => {
        console.log('if protection Type in RevisionsOnly trackedchanges cannot be RejectAll in edit region');
        editor.editor.addProtection('', 'RevisionsOnly');
        editor.editor.insertText("world");
        editor.revisions.rejectAll();
        expect(editor.revisions.length).toBe(1);
    });
    it('if unProtectionType text values can be accept Acceptall in document', () => {
        console.log('if unProtectionType text values can be accept Acceptall in document');
        editor.openBlank();
        editor.editor.addProtection('', 'RevisionsOnly');
        editor.editor.insertText("world");
        editor.editor.unProtectDocument();
        expect(editor.documentHelper.protectionType).toBe('NoProtection');
        editor.revisions.acceptAll();
        expect(editor.revisions.length).toBe(0);
    });
    it('if unProtectionType text values can be reject in document should be show', () => {
        console.log('if unProtectionType text values can be rejectall in document should be show');
        editor.openBlank();
        editor.editor.addProtection('', 'RevisionsOnly');
        editor.editor.insertText("world");
        editor.editor.unProtectDocument();
        expect(editor.documentHelper.protectionType).toBe('NoProtection');
        editor.revisions.rejectAll();
        expect(editor.revisions.length).toBe(0);
    });
    it('if document  protectionType is  RevisionsOnly in contextmenu it will be hide the accept changes', () => {
        console.log('if document  protectionType is  RevisionsOnly in contextmenu it will be hide the accept changes');
        editor.openBlank();
        editor.editor.addProtection('', 'RevisionsOnly');
        editor.selection.hasRevisions();
        editor.editor.insertText("Hello");
        editor.revisions.acceptAll();
        expect(editor.revisions.length).toBe(1);
    });
    it('if document protectionType is RevisionOnly in contextmenu it will be hide the reject changes', () => {
        console.log('if document protectionType is RevisionOnly in contextmenu it will be hide the reject changes');
        editor.editor.addProtection('', 'RevisionsOnly');
        editor.selection.hasRevisions();
        editor.editor.insertText("Hello");
        editor.revisions.rejectAll();
        expect(editor.revisions.length).toBe(1);
    }); 
    it('if document  is  UnProtected in contextmenu it will be show the accept changes', () => {
        console.log('if document  protectionType is  RevisionsOnly in contextmenu it will be hide the accept changes');
        editor.openBlank();
        editor.editor.addProtection('', 'RevisionsOnly');
        editor.selection.hasRevisions();
        editor.editor.insertText("Hello");
        editor.editor.unProtectDocument();
        expect(editor.documentHelper.protectionType).toBe('NoProtection');
        editor.revisions.acceptAll();
        expect(editor.revisions.length).toBe(0);
    });
    it('if document UnProtected  in contextmenu it will be show  the reject changes', () => {
        console.log('if document protectionType is RevisionOnly in contextmenu it will be hide the reject changes');
        editor.editor.addProtection('', 'RevisionsOnly');
        editor.selection.hasRevisions();
        editor.editor.insertText("Hello");
        editor.editor.unProtectDocument();
        expect(editor.documentHelper.protectionType).toBe('NoProtection');
        editor.revisions.rejectAll();
        expect(editor.revisions.length).toBe(0);
    }); 
    it('The Undo and Redo clears History while protecting RevisionsOnly and unprotecting  with all four Types', () => {
        console.log('The Undo and Redo clears History while protecting The RevisionsOnly and unprotecting  with all four Types')
        editor.editor.addProtection('', 'RevisionsOnly');
        expect(editor.documentHelper.protectionType).toBe('RevisionsOnly');
        expect(editor.documentHelper.isDocumentProtected).toBe(true);
        editor.editor.insertText("Hello");
        expect(editor.enableTrackChanges).toBe(true);
        expect(editor.revisions.length).toBe(1);
        editor.editor.unProtectDocument();
        expect(editor.documentHelper.protectionType).toBe('NoProtection');
        expect(editor.documentHelper.isDocumentProtected).toBe(false);
        expect(editor.enableTrackChanges).toBe(false);
        expect(editor.editorHistory.canUndo()).toBe(false);
    });
    it('The Undo and Redo clears History while protecting ReadOnlyand unprotecting  with all four Types', () => {
        console.log('The Undo and Redo clears History while protecting the ReadOnly Protection and unprotecting  with all four Types')
        editor.editor.addProtection('', 'ReadOnly');
        expect(editor.documentHelper.protectionType).toBe('ReadOnly');
        expect(editor.documentHelper.isDocumentProtected).toBe(true);
        editor.editor.unProtectDocument();
        expect(editor.documentHelper.protectionType).toBe('NoProtection');
        expect(editor.documentHelper.isDocumentProtected).toBe(false);
        expect(editor.editorHistory.canUndo()).toBe(false);
    });
    it('The Undo and Redo clears History while protecting CommentsOnlyand unprotecting  with all four Types', () => {
        console.log('The Undo and Redo clears History while protecting the CommentsOnly Protection and unprotecting  with all four Types')
        editor.editor.addProtection('', 'CommentsOnly');
        expect(editor.documentHelper.protectionType).toBe('CommentsOnly');
        expect(editor.documentHelper.isDocumentProtected).toBe(true);
        editor.editor.unProtectDocument();
        expect(editor.documentHelper.protectionType).toBe('NoProtection');
        expect(editor.documentHelper.isDocumentProtected).toBe(false);
        expect(editor.editorHistory.canUndo()).toBe(false);
    });
});
describe('Editing in production mode not to throw error', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.documentEditorSettings.formFieldSettings.formFillingMode = 'Inline';
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    let file : any = {"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false,"pageNumberStyle":"Arabic"},"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"user":"","group":"Everyone","columnFirst":-1,"columnLast":-1,"editRangeId":"7"},{"characterFormat":{},"text":"sdfsdfsdf"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"dfdsf"},{"characterFormat":{},"editableRangeStart":{"user":"","group":"Everyone","columnFirst":-1,"columnLast":-1},"editRangeId":"7"}]}],"headersFooters":{"header":{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]},"footer":{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"bidi":false,"keepLinesTogether":false,"keepWithNext":false,"widowControl":true},"defaultTabWidth":36,"trackChanges":true,"enforcement":true,"hashValue":"","saltValue":"","formatting":false,"protectionType":"ReadOnly","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"compatibilityMode":"Word2013","styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{},"next":"Normal"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":12,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763FF","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763FF","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763FF","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763FF","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[],"comments":[],"revisions":[],"customXml":[],"footnotes":{"separator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]},"endnotes":{"separator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}};
    it('Editing in production mode not to throw error', () => {
        console.log('Editing in production mode not to throw error');
        editor.openBlank();
        editor.open(JSON.stringify(file));
        editor.selection.moveToLineEnd();
        editor.selection.moveDown();
        editor.editor.onEnter();
        editor.editor.insertText('h');
        editor.editor.onBackSpace();
        expect(() => { editor.editor.onBackSpace(); }).not.toThrowError();
    });
    it('After backspace to check text length in trackchange enable mode', () => {
        console.log('After backspace to check text length in trackchange enable mode');
        editor.openBlank();
        editor.open(JSON.stringify(file));
        editor.selection.moveToLineEnd();
        editor.editor.onBackSpace();
        editor.editor.onBackSpace();
        editor.editor.onBackSpace();
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(5);
    });
    it('After backspace to check text length in trackchange disable mode', () => {
        console.log('After backspace to check text length in trackchange disable mode');
        editor.openBlank();
        editor.open(JSON.stringify(file));
        editor.selection.moveToLineEnd();
        editor.enableTrackChanges = false;
        editor.editor.onBackSpace();
        editor.editor.onBackSpace();
        editor.editor.onBackSpace();
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(2);
    });
});
describe('Inline form filling mode importing validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.documentEditorSettings.formFieldSettings.formFillingMode = 'Inline';
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    let file : any = {"sections":[{"sectionFormat":{"pageWidth":595.2999877929688,"pageHeight":841.9000244140625,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false,"pageNumberStyle":"Arabic"},"blocks":[{"rows":[{"cells":[{"blocks":[{"paragraphFormat":{"lineSpacing":1.149999976158142,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"text":"n2: "}]},{"paragraphFormat":{"lineSpacing":1.149999976158142,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"fieldType":0,"hasFieldEnd":true,"formFieldData":{"name":"NUIPC","enabled":true,"helpText":"","statusText":"","textInput":{"type":"Text","maxLength":0,"defaultValue":"","format":"None"}}},{"characterFormat":{},"bookmarkType":0,"name":"NUIPC"},{"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"text":"FORMTEXT"},{"characterFormat":{},"fieldType":2},{"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"text":" "},{"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"text":"    "},{"characterFormat":{},"fieldType":1},{"characterFormat":{},"bookmarkType":1,"name":"NUIPC"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"topMargin":3,"rightMargin":5.400000095367432,"leftMargin":3,"bottomMargin":3,"preferredWidth":113.05000305175781,"preferredWidthType":"Point","cellWidth":450.04998779296875,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":false,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"gridBefore":0,"gridAfter":0,"leftIndent":1.4}}],"grid":[450.04998779296875],"tableFormat":{"borders":{"top":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"shading":{},"leftIndent":1.399999976158142,"tableAlignment":"Left","topMargin":0,"rightMargin":5.4,"leftMargin":5.4,"bottomMargin":0,"preferredWidth":450.04998779296875,"preferredWidthType":"Point","bidi":false,"allowAutoFit":false},"description":null,"title":null,"columnCount":1},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"headersFooters":{"header":{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]},"footer":{"blocks":[{"paragraphFormat":{"textAlignment":"Right","styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":9,"fontFamily":"Arial","fontSizeBidi":9,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":9,"fontFamily":"Arial","fontSizeBidi":9,"fontFamilyBidi":"Arial"},"text":"Pág. "},{"characterFormat":{"fontSize":9,"fontFamily":"Arial","fontSizeBidi":9,"fontFamilyBidi":"Arial"},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{"fontSize":9,"fontFamily":"Arial","fontSizeBidi":9,"fontFamilyBidi":"Arial"},"text":"PAGE  \\* MERGEFORMAT"},{"characterFormat":{},"fieldType":2},{"characterFormat":{"fontSize":9,"fontFamily":"Arial","fontSizeBidi":9,"fontFamilyBidi":"Arial"},"text":"1"},{"characterFormat":{},"fieldType":1}]}]}}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"bidi":false,"keepLinesTogether":false,"keepWithNext":false,"widowControl":true},"defaultTabWidth":36,"trackChanges":false,"enforcement":true,"hashValue":"LqZyy5RQnX3NY5RFxfr+uXvo24vzjlKXOKEcjLwn7u/8lXA9k2TbKTOFf/V2ll1MS/IlOy2CYeFAxqR7rPlWkw==","saltValue":"M+wGFtJiY64rtHzyC2lmrQ==","formatting":false,"protectionType":"FormFieldsOnly","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"compatibilityMode":"Word2013","styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{},"next":"Normal"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"beforeSpacing":12,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","next":"Normal"},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"beforeSpacing":2,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","next":"Normal"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"beforeSpacing":2,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763FF","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","next":"Normal"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"beforeSpacing":2,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","next":"Normal"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"beforeSpacing":2,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","next":"Normal"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"beforeSpacing":2,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763FF","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","next":"Normal"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763FF","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763FF","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[],"comments":[],"revisions":[],"customXml":[],"footnotes":{"separator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]},"endnotes":{"separator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}}
    it('Importing form field data not to throw error', () => {
        console.log('Importing form field data not to throw error');
        editor.openBlank();
        editor.open(JSON.stringify(file));
        let textformField = { fieldName: 'NUIPC', value: 'Hello World' };
        editor.selection.moveToNextParagraph();
        editor.selection.moveNextPosition();
        editor.editor.insertText("Adventure");
        editor.editor.onEnter();
        expect(() => { editor.importFormData([textformField]); }).not.toThrowError();
        editor.selection.moveToPreviousParagraph();
        editor.selection.moveToPreviousParagraph();
        editor.selection.moveToParagraphEnd();
        expect(() => { editor.importFormData([textformField]); }).not.toThrowError();
        expect(((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as any).childWidgets[0] as any).childWidgets[0] as any).childWidgets[1] as any).childWidgets[0].children[4].text).toBe("Hello World");
    });
    it('Importing Single form field data replacing Multiple Pargraphs', () => {
        console.log('Importing Single form field data replacing Multiple Pargraphs');
        editor.openBlank();
        editor.open(JSON.stringify(file));
        let textformFieldData = { fieldName: 'NUIPC', value: 'Hello World' };
        editor.selection.moveToNextParagraph();
        editor.selection.moveNextPosition();
        editor.editor.insertText("Adventure");
        editor.editor.onEnter();
        editor.editor.insertText("Document");
        editor.importFormData([textformFieldData]);
        let exportedData: FormFieldData[] = editor.exportFormData();
        expect(exportedData[0].value).toBe(textformFieldData.value +"\r");
    });
    it('Importing Multiple Pargraphs form field data replacing Single Pargraph', () => {
        console.log('Importing Multiple Pargraphs form field data replacing Single Pargraph');
        editor.openBlank();
        editor.open(JSON.stringify(file));
        let textformFieldData = { fieldName: 'NUIPC', value: 'Hello World\rdocument' };
        editor.selection.moveToNextParagraph();
        editor.selection.moveNextPosition();
        editor.editor.insertText("Adventure");
        editor.importFormData([textformFieldData]);
        let exportedData: FormFieldData[] = editor.exportFormData();
        expect(exportedData[0].value).toBe(textformFieldData.value);
    });
    it('Importing Multiple Pargraphs form field data replacing Multiple Pargraph', () => {
        console.log('Importing Multiple Pargraphs form field data replacing Multiple Pargraph');
        editor.openBlank();
        editor.open(JSON.stringify(file));
        let textformFieldData = { fieldName: 'NUIPC', value: 'Hello World\rdocument' };
        editor.selection.moveToNextParagraph();
        editor.selection.moveNextPosition();
        editor.editor.insertText("Adventure");
        editor.editor.onEnter();
        editor.editor.insertText('document');
        editor.importFormData([textformFieldData]);
        let exportedData: FormFieldData[] = editor.exportFormData();
        expect(exportedData[0].value).toBe(textformFieldData.value + "\r");
    });
});

describe('Inline form filling mode export validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.documentEditorSettings.formFieldSettings.formFillingMode = 'Inline';
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    let file : any = {"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false,"pageNumberStyle":"Arabic"},"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"fieldType":0,"hasFieldEnd":true,"formFieldData":{"name":"Text1","enabled":true,"helpText":"","statusText":"","textInput":{"type":"Text","maxLength":0,"defaultValue":"","format":""}}},{"characterFormat":{},"bookmarkType":0,"name":"Text1"},{"characterFormat":{},"text":"FORMTEXT"},{"characterFormat":{},"fieldType":2},{"characterFormat":{},"text":"     "},{"characterFormat":{},"fieldType":1},{"characterFormat":{},"bookmarkType":1,"name":"Text1"}]}],"headersFooters":{"header":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"footer":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"evenHeader":{},"evenFooter":{},"firstPageHeader":{},"firstPageFooter":{}}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"bidi":false,"keepLinesTogether":false,"keepWithNext":false,"widowControl":true},"defaultTabWidth":36,"trackChanges":false,"enforcement":true,"hashValue":"","saltValue":"","formatting":false,"protectionType":"FormFieldsOnly","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"compatibilityMode":"Word2013","styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{},"next":"Normal"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":12,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[],"comments":[],"revisions":[],"customXml":[]};
    it('Export Multiple paragraph form field data ', () => {
        console.log('Export Multiple paragraph form field data');
        editor.openBlank();
        editor.open(JSON.stringify(file));
        editor.selection.moveNextPosition();
        editor.editor.insertText('document');
        editor.editor.onEnter();
        editor.editor.insertText('hello world');
        editor.editor.onEnter();
        editor.editor.insertText('adventure');
        let data : FormFieldData[] = editor.exportFormData();
        expect(data[0].value).toBe("document\rhello world\radventure");
    });
});
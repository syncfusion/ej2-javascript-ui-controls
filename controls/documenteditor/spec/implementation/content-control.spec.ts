import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { ContentControlInfo, Editor, LineWidget, ParagraphWidget, SfdtExport, SfdtReader, TextElementBox} from '../../src/index';
import { TestHelper } from '../test-helper.spec';
import { Selection } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';

/**
 * Content control Spec
 */

describe('check apply content control', () => {
    let editor: DocumentEditor;
    let event: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            
            done();
        }, 1000);
    });
    it('apply plain text content control', () => {
        console.log('apply plain text content control');
                editor.openBlank();
                editor.editorModule.insertText('sample');
                editor.selection.selectAll();
                editor.editorModule.insertContentControl('Text');
                expect(editor.documentHelper.contentControlCollection.length).toBe(1);
                expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.type).toBe('Text');
            });
    it('apply Rich text content control', () => {
        console.log('apply rich text content control');
                editor.openBlank();
                editor.editorModule.insertText('sample');
                editor.selection.selectAll();
                editor.editorModule.insertContentControl('RichText');
                expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.type).toBe('RichText');
                expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.contentControlListItems.length).toBe(0);
            });
    it('apply combo box  content control', () => {
        console.log('apply combo box content control');
                editor.openBlank();
                editor.editorModule.insertText('sample');
                editor.selection.selectAll();
                editor.editorModule.insertContentControl('ComboBox');
                expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.type).toBe('ComboBox');
                expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.contentControlListItems.length).toBe(1);
            });
    it('apply drop down list content control', () => {
        console.log('apply drop down list content control');
                editor.openBlank();
                editor.editorModule.insertContentControl('DropDownList');
                expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.type).toBe('DropDownList');
                expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.hasPlaceHolderText).toBe(true);
            });
    it('apply check box content control', () => {
        console.log('apply check box content control');
                editor.openBlank();
                editor.editorModule.insertText('sample');
                editor.selection.selectAll();
                editor.editorModule.insertContentControl('CheckBox');
                expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.type).toBe('CheckBox');
                expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.isChecked).toBe(false);
            });
    it('apply date picker content control', () => {
        console.log('apply date picker content control');
                editor.openBlank();
                editor.editorModule.insertText('sample');
                editor.selection.selectAll();
                editor.editorModule.insertContentControl('Date','5/12/24');
                expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.type).toBe('Date');
            });
    it('apply picture content control', () => {
        console.log('apply picture content control');
                editor.openBlank();
                editor.editorModule.insertContentControl('Picture');
                expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.type).toBe('Picture');
            });
    it('check remove content control', () => {
        console.log('check remove content control');
                editor.openBlank();
                editor.editorModule.insertText('sample');
                editor.selection.selectAll();
                editor.editorModule.insertContentControl('Text');
                expect(editor.documentHelper.contentControlCollection.length).toBe(1);
                editor.selection.handleLeftKey();
                editor.editorModule.removeContentControl();
                expect(editor.documentHelper.contentControlCollection.length).toBe(0);
            });
    it('check remove content control', () => {
        console.log('check remove content control');
                editor.openBlank();
                editor.editorModule.insertText('sample');
                editor.selection.selectAll();
                editor.editorModule.insertContentControl('CheckBox');
                editor.selection.handleLeftKey();
                expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.isChecked).toBe(false);
                editor.editorModule.toggleContentControlCheckBox(editor.documentHelper.contentControlCollection[0], !editor.documentHelper.contentControlCollection[0].contentControlProperties.isChecked);
                expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.isChecked).toBe(true);
            });
    it('validate text insertion after content control',()=>{
        console.log('insert text after content control');
        editor.openBlank();
        editor.editor.insertContentControl('RichText','Text inside CC');
        let count = editor.selection.start.currentWidget.children.length;
        editor.selection.select('0;0;17','0;0;17');
        editor.editor.insertText("Text after CC");
        expect(editor.selection.start.currentWidget.children.length > count).toBe(true);
    })
    });

describe('Validate getContentControinfo', () => {
    let editor: DocumentEditor;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport); 
        editor.enableEditorHistory = true;
        editor.enableSfdtExport = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            
            done();
        }, 1000);
    });
    it('apply plain text content control', () => {
        console.log('apply plain text content control');
        editor.openBlank();
        editor.editorModule.insertText('Insering the plain text content control and using using getContentControlInfo method');
        editor.selection.selectAll();
        editor.editorModule.insertContentControl('Text');
        editor.selection.select('0;0;10', '0;0;10');
        let contentControlInfo: ContentControlInfo = editor.selectionModule.getContentControlInfo();
        expect(contentControlInfo.value).toBe('Insering the plain text content control and using using getContentControlInfo method');
        expect(contentControlInfo.type).toBe('Text');
        contentControlInfo.value = contentControlInfo.value + ' added new text';
        editor.importContentControlData([contentControlInfo]);
        editor.selection.select('0;0;10', '0;0;10');
        contentControlInfo = editor.selectionModule.getContentControlInfo();
        expect(contentControlInfo.value).toBe('Insering the plain text content control and using using getContentControlInfo method added new text');
    });
    it('apply combo box  content control', () => {
        console.log('apply combo box content control');
        editor.openBlank();
        editor.editorModule.insertText('sample');
        editor.selection.selectAll();
        editor.editorModule.insertContentControl('ComboBox');
        editor.selection.select('0;0;5', '0;0;5');
        let contentControlInfo: ContentControlInfo = editor.selectionModule.getContentControlInfo();
        expect(contentControlInfo.value).toBe('sample');
        expect(contentControlInfo.type).toBe('ComboBox');
        contentControlInfo.value = 'new value';
        editor.importContentControlData([contentControlInfo]);
        editor.selection.select('0;0;5', '0;0;5');
        contentControlInfo = editor.selectionModule.getContentControlInfo();
        expect(contentControlInfo.value).toBe('new value');
    });
    it('apply check box content control', () => {
        console.log('apply check box content control');
        editor.openBlank();
        editor.editorModule.insertContentControl('CheckBox');
        editor.selection.select('0;0;1', '0;0;1');
        let contentControlInfo: ContentControlInfo = editor.selectionModule.getContentControlInfo();
        expect(contentControlInfo.value).toBe('false');
        expect(contentControlInfo.type).toBe('CheckBox');
        contentControlInfo.value = 'true';
        editor.importContentControlData([contentControlInfo]);
        editor.selection.select('0;0;1', '0;0;1');
        contentControlInfo = editor.selectionModule.getContentControlInfo();
        expect(contentControlInfo.value).toBe('true');
    });
    it('apply date picker content control', () => {
        console.log('apply date picker content control');
        editor.openBlank();
        editor.editorModule.insertContentControl('Date','5/12/24');
        editor.selection.select('0;0;3', '0;0;3');
        let contentControlInfo: ContentControlInfo = editor.selectionModule.getContentControlInfo();
        expect(contentControlInfo.value).toBe('5/12/24');
        expect(contentControlInfo.type).toBe('Date');
        contentControlInfo.value = '6/12/24';
        editor.importContentControlData([contentControlInfo]);
        editor.selection.select('0;0;3', '0;0;3');
        contentControlInfo = editor.selectionModule.getContentControlInfo();
        expect(contentControlInfo.value).toBe('6/12/24');
    });
    it('apply rich text content control', () => {
        console.log('apply rich text content control');
        editor.openBlank();
        editor.editorModule.insertText('Insering the plain text content control and using getContentControlInfo method');
        editor.editorModule.onEnter();
        editor.editorModule.insertText('Insering the rich text content control and using getContentControlInfo method');
        editor.selection.selectAll();
        editor.editorModule.insertContentControl('RichText');
        editor.selection.select('0;0;10', '0;0;10');
        let contentControlInfo: ContentControlInfo = editor.selectionModule.getContentControlInfo();
        expect(contentControlInfo.value).toBeDefined;
        expect(contentControlInfo.type).toBe('RichText');
        editor.importContentControlData([contentControlInfo]);
        expect(typeof JSON.parse(contentControlInfo.value)).toBe("object");
        let widgets = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets;
        expect(widgets.length).toBe(2);
        expect((((widgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[1] as TextElementBox).text).toBe('Insering the plain text content control and using getContentControlInfo method');
        expect((((widgets[1] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as TextElementBox).text).toBe('Insering the rich text content control and using getContentControlInfo method');
    });
});

describe('Nested content control check apply content control', () => {
    let editor: DocumentEditor;
    let event: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ isReadOnly: false });
        editor.enableAllModules();
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            
            done();
        }, 1000);
    });

    it('Insert Rich text content control and add text content', () => {
        // Insert Rich text content control
        editor.editor.insertContentControl('RichText');
        
        // Enter add text one
        editor.editor.insertText('add text one');
        
        // Verify the content control was inserted and text was added
        expect(editor.documentHelper.contentControlCollection.length).toBe(1);
        expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.type).toBe('RichText');
    });

    it('Add second rich text content control', () => {
        
        editor.editor.onEnter();
        
        // Enter add test two
        editor.editor.insertText(' add test two');
         editor.editor.onEnter();
        editor.editor.onEnter();
        editor.editor.onEnter();
        editor.selection.handleUpKey();
        editor.selection.handleUpKey();
        editor.editor.insertContentControl('RichText');
        
        // Enter add text one
        editor.editor.insertText('1');
       expect(editor.documentHelper.contentControlCollection.length).toBe(2);
    });


    it('Verify the export case with nested content control', () => {
        // Clear existing content
        let sfdtText = editor.serialize();
        editor.open(sfdtText);
        expect(editor.documentHelper.contentControlCollection.length).toBe(2);
    });
});
describe('Inline Nested content control validation', () => {
    var sfdtText: any = {"optimizeSfdt":false,"allowHyphensInBookmarkNames":false,"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"headerDistance":36,"footerDistance":36,"differentFirstPage":false,"differentOddAndEvenPages":false,"bidi":false,"breakCode":"NewPage","endnoteNumberFormat":"LowerCaseRoman","footNoteNumberFormat":"Arabic","restartIndexForFootnotes":"DoNotRestart","restartIndexForEndnotes":"DoNotRestart","initialFootNoteNumber":1,"initialEndNoteNumber":1,"pageNumberStyle":"Arabic","numberOfColumns":1,"equalWidth":true,"lineBetweenColumns":false,"columns":[]},"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"inlines":[{"inlines":[{"characterFormat":{},"text":"Video"}],"contentControlProperties":{"lockContentControl":false,"lockContents":false,"color":"#00000000","type":"RichText","hasPlaceHolderText":false,"multiline":false,"isTemporary":false,"characterFormat":{},"contentControlListItems":[]}},{"characterFormat":{},"text":" "},{"inlines":[{"characterFormat":{},"text":"p"},{"inlines":[{"inlines":[{"characterFormat":{},"text":"r"},{"inlines":[{"inlines":[{"characterFormat":{},"text":"o"}],"contentControlProperties":{"lockContentControl":false,"lockContents":false,"color":"#00000000","type":"RichText","hasPlaceHolderText":false,"multiline":false,"isTemporary":false,"characterFormat":{},"contentControlListItems":[]}},{"characterFormat":{},"text":"v"}],"contentControlProperties":{"lockContentControl":false,"lockContents":false,"color":"#00000000","type":"RichText","hasPlaceHolderText":false,"multiline":false,"isTemporary":false,"characterFormat":{},"contentControlListItems":[]}}],"contentControlProperties":{"lockContentControl":false,"lockContents":false,"color":"#00000000","type":"RichText","hasPlaceHolderText":false,"multiline":false,"isTemporary":false,"characterFormat":{},"contentControlListItems":[]}},{"characterFormat":{},"text":"i"}],"contentControlProperties":{"lockContentControl":false,"lockContents":false,"color":"#00000000","type":"RichText","hasPlaceHolderText":false,"multiline":false,"isTemporary":false,"characterFormat":{},"contentControlListItems":[]}},{"characterFormat":{},"text":"d"},{"inlines":[{"characterFormat":{},"text":"es"}],"contentControlProperties":{"lockContentControl":false,"lockContents":false,"color":"#00000000","type":"RichText","hasPlaceHolderText":false,"multiline":false,"isTemporary":false,"characterFormat":{},"contentControlListItems":[]}}],"contentControlProperties":{"lockContentControl":false,"lockContents":false,"color":"#00000000","type":"RichText","hasPlaceHolderText":false,"multiline":false,"isTemporary":false,"characterFormat":{},"contentControlListItems":[]}},{"characterFormat":{},"text":" a "},{"inlines":[{"characterFormat":{},"text":"powerful"}],"contentControlProperties":{"lockContentControl":false,"lockContents":false,"color":"#00000000","type":"RichText","hasPlaceHolderText":false,"multiline":false,"isTemporary":false,"characterFormat":{},"contentControlListItems":[]}},{"characterFormat":{},"text":" way to "},{"inlines":[{"characterFormat":{},"text":"help"}],"contentControlProperties":{"lockContentControl":false,"lockContents":false,"color":"#00000000","type":"RichText","hasPlaceHolderText":false,"multiline":false,"isTemporary":false,"characterFormat":{},"contentControlListItems":[]}},{"characterFormat":{},"text":" you prove"}],"contentControlProperties":{"lockContentControl":false,"lockContents":false,"color":"#00000000","type":"RichText","hasPlaceHolderText":false,"multiline":false,"isTemporary":false,"characterFormat":{},"contentControlListItems":[]}},{"characterFormat":{},"text":" your point. When you click Online Video, you can paste in the embed code for the video you want to add."}]},{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Video "},{"inlines":[{"inlines":[{"inlines":[{"characterFormat":{},"text":"pro"},{"inlines":[{"characterFormat":{},"text":"vi"},{"inlines":[{"characterFormat":{},"text":"de"}],"contentControlProperties":{"lockContentControl":false,"lockContents":false,"color":"#00000000","type":"Text","hasPlaceHolderText":false,"multiline":false,"isTemporary":false,"characterFormat":{},"contentControlListItems":[]}},{"characterFormat":{},"text":"s a"}],"contentControlProperties":{"lockContentControl":false,"lockContents":false,"color":"#00000000","type":"RichText","hasPlaceHolderText":false,"multiline":false,"isTemporary":false,"characterFormat":{},"contentControlListItems":[]}},{"characterFormat":{},"text":" powerful"}],"contentControlProperties":{"lockContentControl":false,"lockContents":false,"color":"#00000000","type":"RichText","hasPlaceHolderText":false,"multiline":false,"isTemporary":false,"characterFormat":{},"contentControlListItems":[]}},{"characterFormat":{},"text":" way to"}],"contentControlProperties":{"lockContentControl":false,"lockContents":false,"color":"#00000000","type":"RichText","hasPlaceHolderText":false,"multiline":false,"isTemporary":false,"characterFormat":{},"contentControlListItems":[]}},{"characterFormat":{},"text":" help you prove"}],"contentControlProperties":{"lockContentControl":false,"lockContents":false,"color":"#00000000","type":"RichText","hasPlaceHolderText":false,"multiline":false,"isTemporary":false,"characterFormat":{},"contentControlListItems":[]}},{"characterFormat":{},"text":" your point."}]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"contentControlProperties":{"lockContentControl":false,"lockContents":false,"color":"#00000000","type":"RichText","hasPlaceHolderText":false,"multiline":false,"isTemporary":false,"characterFormat":{},"contentControlListItems":[]}}],"headersFooters":{}}],"characterFormat":{"fontSize":12,"fontFamily":"Aptos","fontSizeBidi":12,"fontFamilyBidi":"minorBidi","localeIdBidi":1025,"localeId":1033,"localeIdFarEast":1033,"fontFamilyAscii":"minorHAnsi","fontFamilyNonFarEast":"minorHAnsi","fontFamilyFarEast":"minorHAnsi"},"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":8,"lineSpacing":1.1583333015441895,"lineSpacingType":"Multiple","listFormat":{}},"fontSubstitutionTable":{},"themeFontLanguages":{"localeIdBidi":1025,"localeId":1033},"defaultTabWidth":36,"trackChanges":false,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"compatibilityMode":"Word2013","allowSpaceOfSameStyleInTable":false,"themes":{"fontScheme":{"fontSchemeName":"Office","majorFontScheme":{"fontSchemeList":[{"name":"latin","typeface":"Aptos Display","panose":"02110004020202020204"},{"name":"ea","panose":"02110004020202020204"},{"name":"cs","panose":"02110004020202020204"}],"fontTypeface":{"Jpan":"游ゴシック Light","Hang":"맑은 고딕","Hans":"等线 Light","Hant":"新細明體","Arab":"Times New Roman","Hebr":"Times New Roman","Thai":"Angsana New","Ethi":"Nyala","Beng":"Vrinda","Gujr":"Shruti","Khmr":"MoolBoran","Knda":"Tunga","Guru":"Raavi","Cans":"Euphemia","Cher":"Plantagenet Cherokee","Yiii":"Microsoft Yi Baiti","Tibt":"Microsoft Himalaya","Thaa":"MV Boli","Deva":"Mangal","Telu":"Gautami","Taml":"Latha","Syrc":"Estrangelo Edessa","Orya":"Kalinga","Mlym":"Kartika","Laoo":"DokChampa","Sinh":"Iskoola Pota","Mong":"Mongolian Baiti","Viet":"Times New Roman","Uigh":"Microsoft Uighur","Geor":"Sylfaen","Armn":"Arial","Bugi":"Leelawadee UI","Bopo":"Microsoft JhengHei","Java":"Javanese Text","Lisu":"Segoe UI","Mymr":"Myanmar Text","Nkoo":"Ebrima","Olck":"Nirmala UI","Osma":"Ebrima","Phag":"Phagspa","Syrn":"Estrangelo Edessa","Syrj":"Estrangelo Edessa","Syre":"Estrangelo Edessa","Sora":"Nirmala UI","Tale":"Microsoft Tai Le","Talu":"Microsoft New Tai Lue","Tfng":"Ebrima"}},"minorFontScheme":{"fontSchemeList":[{"name":"latin","typeface":"Aptos","panose":"02110004020202020204"},{"name":"ea","panose":"02110004020202020204"},{"name":"cs","panose":"02110004020202020204"}],"fontTypeface":{"Jpan":"游明朝","Hang":"맑은 고딕","Hans":"等线","Hant":"新細明體","Arab":"Arial","Hebr":"Arial","Thai":"Cordia New","Ethi":"Nyala","Beng":"Vrinda","Gujr":"Shruti","Khmr":"DaunPenh","Knda":"Tunga","Guru":"Raavi","Cans":"Euphemia","Cher":"Plantagenet Cherokee","Yiii":"Microsoft Yi Baiti","Tibt":"Microsoft Himalaya","Thaa":"MV Boli","Deva":"Mangal","Telu":"Gautami","Taml":"Latha","Syrc":"Estrangelo Edessa","Orya":"Kalinga","Mlym":"Kartika","Laoo":"DokChampa","Sinh":"Iskoola Pota","Mong":"Mongolian Baiti","Viet":"Arial","Uigh":"Microsoft Uighur","Geor":"Sylfaen","Armn":"Arial","Bugi":"Leelawadee UI","Bopo":"Microsoft JhengHei","Java":"Javanese Text","Lisu":"Segoe UI","Mymr":"Myanmar Text","Nkoo":"Ebrima","Olck":"Nirmala UI","Osma":"Ebrima","Phag":"Phagspa","Syrn":"Estrangelo Edessa","Syrj":"Estrangelo Edessa","Syre":"Estrangelo Edessa","Sora":"Nirmala UI","Tale":"Microsoft Tai Le","Talu":"Microsoft New Tai Lue","Tfng":"Ebrima"}}}},"background":{"color":"#FFFFFFFF"},"styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"listFormat":{}},"characterFormat":{},"next":"Normal"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"beforeSpacing":18,"afterSpacing":4,"outlineLevel":"Level1","keepLinesTogether":true,"keepWithNext":true,"listFormat":{}},"characterFormat":{"fontSize":20,"fontFamily":"Aptos Display","fontColor":"#0F4761FF","fontSizeBidi":20,"fontFamilyBidi":"majorBidi","fontFamilyAscii":"majorHAnsi","fontFamilyNonFarEast":"majorHAnsi","fontFamilyFarEast":"majorEastAsia"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":20,"fontFamily":"Aptos Display","fontColor":"#0F4761FF","fontSizeBidi":20,"fontFamilyBidi":"majorBidi","fontFamilyAscii":"majorHAnsi","fontFamilyNonFarEast":"majorHAnsi","fontFamilyFarEast":"majorEastAsia"},"basedOn":"Default Paragraph Font"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"beforeSpacing":8,"afterSpacing":4,"outlineLevel":"Level2","keepLinesTogether":true,"keepWithNext":true,"listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Aptos Display","fontColor":"#0F4761FF","fontSizeBidi":16,"fontFamilyBidi":"majorBidi","fontFamilyAscii":"majorHAnsi","fontFamilyNonFarEast":"majorHAnsi","fontFamilyFarEast":"majorEastAsia"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Aptos Display","fontColor":"#0F4761FF","fontSizeBidi":16,"fontFamilyBidi":"majorBidi","fontFamilyAscii":"majorHAnsi","fontFamilyNonFarEast":"majorHAnsi","fontFamilyFarEast":"majorEastAsia"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"beforeSpacing":8,"afterSpacing":4,"outlineLevel":"Level3","keepLinesTogether":true,"keepWithNext":true,"listFormat":{}},"characterFormat":{"fontSize":14,"fontColor":"#0F4761FF","fontSizeBidi":14,"fontFamilyBidi":"majorBidi","fontFamilyFarEast":"majorEastAsia"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":14,"fontColor":"#0F4761FF","fontSizeBidi":14,"fontFamilyBidi":"majorBidi","fontFamilyFarEast":"majorEastAsia"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"beforeSpacing":4,"afterSpacing":2,"outlineLevel":"Level4","keepLinesTogether":true,"keepWithNext":true,"listFormat":{}},"characterFormat":{"italic":true,"fontColor":"#0F4761FF","italicBidi":true,"fontFamilyBidi":"majorBidi","fontFamilyFarEast":"majorEastAsia"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontColor":"#0F4761FF","italicBidi":true,"fontFamilyBidi":"majorBidi","fontFamilyFarEast":"majorEastAsia"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"beforeSpacing":4,"afterSpacing":2,"outlineLevel":"Level5","keepLinesTogether":true,"keepWithNext":true,"listFormat":{}},"characterFormat":{"fontColor":"#0F4761FF","fontFamilyBidi":"majorBidi","fontFamilyFarEast":"majorEastAsia"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontColor":"#0F4761FF","fontFamilyBidi":"majorBidi","fontFamilyFarEast":"majorEastAsia"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"beforeSpacing":2,"afterSpacing":0,"outlineLevel":"Level6","keepLinesTogether":true,"keepWithNext":true,"listFormat":{}},"characterFormat":{"italic":true,"fontColor":"#595959FF","italicBidi":true,"fontFamilyBidi":"majorBidi","fontFamilyFarEast":"majorEastAsia"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"italic":true,"fontColor":"#595959FF","italicBidi":true,"fontFamilyBidi":"majorBidi","fontFamilyFarEast":"majorEastAsia"},"basedOn":"Default Paragraph Font"},{"name":"Heading 7","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"beforeSpacing":2,"afterSpacing":0,"outlineLevel":"Level7","keepLinesTogether":true,"keepWithNext":true,"listFormat":{}},"characterFormat":{"fontColor":"#595959FF","fontFamilyBidi":"majorBidi","fontFamilyFarEast":"majorEastAsia"},"basedOn":"Normal","link":"Heading 7 Char","next":"Normal"},{"name":"Heading 7 Char","type":"Character","characterFormat":{"fontColor":"#595959FF","fontFamilyBidi":"majorBidi","fontFamilyFarEast":"majorEastAsia"},"basedOn":"Default Paragraph Font"},{"name":"Heading 8","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"outlineLevel":"Level8","keepLinesTogether":true,"keepWithNext":true,"listFormat":{}},"characterFormat":{"italic":true,"fontColor":"#272727FF","italicBidi":true,"fontFamilyBidi":"majorBidi","fontFamilyFarEast":"majorEastAsia"},"basedOn":"Normal","link":"Heading 8 Char","next":"Normal"},{"name":"Heading 8 Char","type":"Character","characterFormat":{"italic":true,"fontColor":"#272727FF","italicBidi":true,"fontFamilyBidi":"majorBidi","fontFamilyFarEast":"majorEastAsia"},"basedOn":"Default Paragraph Font"},{"name":"Heading 9","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"outlineLevel":"Level9","keepLinesTogether":true,"keepWithNext":true,"listFormat":{}},"characterFormat":{"fontColor":"#272727FF","fontFamilyBidi":"majorBidi","fontFamilyFarEast":"majorEastAsia"},"basedOn":"Normal","link":"Heading 9 Char","next":"Normal"},{"name":"Heading 9 Char","type":"Character","characterFormat":{"fontColor":"#272727FF","fontFamilyBidi":"majorBidi","fontFamilyFarEast":"majorEastAsia"},"basedOn":"Default Paragraph Font"},{"name":"Title","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":4,"lineSpacing":1,"lineSpacingType":"Multiple","contextualSpacing":true,"listFormat":{}},"characterFormat":{"fontSize":28,"fontFamily":"Aptos Display","fontSizeBidi":28,"fontFamilyBidi":"majorBidi","fontFamilyAscii":"majorHAnsi","fontFamilyNonFarEast":"majorHAnsi","fontFamilyFarEast":"majorEastAsia"},"basedOn":"Normal","link":"Title Char","next":"Normal"},{"name":"Title Char","type":"Character","characterFormat":{"fontSize":28,"fontFamily":"Aptos Display","fontSizeBidi":28,"fontFamilyBidi":"majorBidi","fontFamilyAscii":"majorHAnsi","fontFamilyNonFarEast":"majorHAnsi","fontFamilyFarEast":"majorEastAsia"},"basedOn":"Default Paragraph Font"},{"name":"Subtitle","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"listFormat":{"listLevelNumber":1}},"characterFormat":{"fontSize":14,"fontColor":"#595959FF","fontSizeBidi":14,"fontFamilyBidi":"majorBidi","fontFamilyFarEast":"majorEastAsia"},"basedOn":"Normal","link":"Subtitle Char","next":"Normal"},{"name":"Subtitle Char","type":"Character","characterFormat":{"fontSize":14,"fontColor":"#595959FF","fontSizeBidi":14,"fontFamilyBidi":"majorBidi","fontFamilyFarEast":"majorEastAsia"},"basedOn":"Default Paragraph Font"},{"name":"Quote","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"textAlignment":"Center","beforeSpacing":8,"listFormat":{}},"characterFormat":{"italic":true,"fontColor":"#404040FF","italicBidi":true},"basedOn":"Normal","link":"Quote Char","next":"Normal"},{"name":"Quote Char","type":"Character","characterFormat":{"italic":true,"fontColor":"#404040FF","italicBidi":true},"basedOn":"Default Paragraph Font"},{"name":"List Paragraph","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":36,"contextualSpacing":true,"listFormat":{}},"characterFormat":{},"basedOn":"Normal","next":"List Paragraph"},{"name":"Intense Emphasis","type":"Character","characterFormat":{"italic":true,"fontColor":"#0F4761FF","italicBidi":true},"basedOn":"Default Paragraph Font"},{"name":"Intense Quote","type":"Paragraph","paragraphFormat":{"borders":{"top":{"color":"#0F4761FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":10},"left":{},"right":{},"bottom":{"color":"#0F4761FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":10},"horizontal":{},"vertical":{}},"leftIndent":43.20000076293945,"rightIndent":43.20000076293945,"textAlignment":"Center","beforeSpacing":18,"afterSpacing":18,"listFormat":{}},"characterFormat":{"italic":true,"fontColor":"#0F4761FF","italicBidi":true},"basedOn":"Normal","link":"Intense Quote Char","next":"Normal"},{"name":"Intense Quote Char","type":"Character","characterFormat":{"italic":true,"fontColor":"#0F4761FF","italicBidi":true},"basedOn":"Default Paragraph Font"},{"name":"Intense Reference","type":"Character","characterFormat":{"bold":true,"fontColor":"#0F4761FF","boldBidi":true},"basedOn":"Default Paragraph Font"},{"name":"Placeholder Text","type":"Character","characterFormat":{"fontColor":"#666666FF"},"basedOn":"Default Paragraph Font"},{"name":"Header","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{},"basedOn":"Normal","next":"Header"},{"name":"Footer","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{},"basedOn":"Normal","next":"Footer"}],"lists":[],"abstractLists":[],"comments":[],"revisions":[],"customXml":[],"images":{},"footnotes":{"separator":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]},"endnotes":{"separator":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}}
    let editor: DocumentEditor;
    let event: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ isReadOnly: false });
        editor.enableAllModules();
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            
            done();
        }, 1000);
    });
    
    it('Verify the export case with inline nested content control', () => {
        // Clear existing content
        editor.open(sfdtText);
        expect(editor.documentHelper.contentControlCollection.length).toBe(16);
        editor.selection.select('0;0;0', '0;0;80');
        editor.selection.copy();
        editor.open(editor.editorModule.copiedData);
        expect(editor.documentHelper.contentControlCollection.length).toBe(10);
    });
});
import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { BodyWidget, DocumentHelper, EditorHistory, LineWidget, ListTextElementBox, ParagraphWidget, SfdtExport, TextElementBox, TextFormField, TextFormFieldInfo } from '../../../src/index';
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from '../../test-helper.spec';
import { Editor } from '../../../src/index';
import { Selection } from '../../../src/index';
import { TextFormFieldDialog } from '../../../src/document-editor/implementation/dialogs/form-field-text-dialog';
import { ChangeEventArgs } from '@syncfusion/ej2-dropdowns/src/drop-down-list';

describe('Form field Text dialog', () => {
    let editor: DocumentEditor;
    let dialog: TextFormFieldDialog;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, TextFormFieldDialog);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.textFormFieldDialogModule;
        dialog.show();
        dialog.onCancelButtonClick();
    });
    beforeEach(() => {
        editor.openBlank();
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Insert Form field Text Value updates', () => {
        console.log('Insert Form field Text Value updates');
        editor.editorModule.insertFormField('Text');
        (dialog as any).typeDropDown.value = 'Date';
        (dialog as any).defaultTextInput.value = '3/20/2020';
        (dialog as any).maxLengthNumber.value = 0;
        (dialog as any).textFormatDropDown.value = 'M/d/yy';
        (dialog as any).bookmarkTextInput.value = 'Test';
        (dialog as any).fillInEnable.checked = false;
        (dialog as any).tooltipTextInput.value = 'testsync';
        editor.selection.selectAll();
        dialog.insertTextField();
        dialog.show();
        dialog.onCancelButtonClick();
        editor.selection.selectAll();
        let fieldData: TextFormField = editor.selection.getCurrentFormField().formFieldData as TextFormField;
        expect(fieldData.type).toBe('Date');
        expect(fieldData.defaultValue).toBe('3/20/20');
        expect(fieldData.maxLength).toBe(0);
        expect(fieldData.format).toBe('M/d/yy');
        expect(fieldData.name).toBe('Test');
        expect(fieldData.enabled).toBe(false);
        expect(fieldData.helpText).toBe('testsync');
    });
    it('Load Values - Form field Text Dialog', () => {
        console.log('Load Values - Form field Text Dialog');
        editor.editorModule.insertFormField('Text');
        editor.selection.selectAll();
        dialog.loadTextDialog();
        editor.selection.selectAll();
        let fieldData: TextFormField = editor.selection.getCurrentFormField().formFieldData as TextFormField;
        expect(fieldData.defaultValue).toBe((dialog as any).defaultTextInput.value);
        if (fieldData.type === 'Text') {
            expect((dialog as any).typeDropDown.value).toBe('Regular text');
        }
        expect(fieldData.maxLength).toBe((dialog as any).maxLengthNumber.value);
        expect(fieldData.format).toBe((dialog as any).textFormatDropDown.value);
        expect(fieldData.helpText).toBe((dialog as any).tooltipTextInput.value);
        expect(fieldData.name).toBe((dialog as any).bookmarkTextInput.value);
        expect(fieldData.enabled).toBe((dialog as any).fillInEnable.checked);
    });
    it('Valid Date format - Form field Text Dialog', () => {
        console.log('Valid Date format - Form field Text Dialog');
        editor.editorModule.insertFormField('Text');
        editor.selection.selectAll();
        (dialog as any).defaultTextInput.value = '3/20/2020';
        expect(dialog.isValidDateFormat()).toBe(true);
        (dialog as any).defaultTextInput.value = '3022020';
        expect(dialog.isValidDateFormat()).toBe(false);
    });
    it('Change Type DropDown - Form field Text Dialog', () => {
        console.log('Change Type DropDown - Form field Text Dialog');
        editor.editorModule.insertFormField('Text');
        let event: any = {};
        event.value = 'Number';
        (dialog as any).typeDropDown.value = 'Number';
        dialog.changeTypeDropDown(event as ChangeEventArgs);
        (dialog as any).defaultTextInput.value = '34';
        dialog.updateTextFormtas();
        expect((dialog as any).textFormatDropDown.dataSource[0]).toBe('0');
        event.value = 'Date';
        (dialog as any).typeDropDown.value = 'Date';
        (dialog as any).textFormatDropDown.value = 'M/d/yy';
        dialog.changeTypeDropDown(event as ChangeEventArgs);
        (dialog as any).defaultTextInput.value = '3/20/2020';
        dialog.updateTextFormtas();
        expect((dialog as any).textFormatDropDown.dataSource[0]).toBe('M/d/yyyy');
        event.value = 'Regular text';
        dialog.changeTypeDropDown(event as ChangeEventArgs);
        (dialog as any).defaultTextInput.value = 'Syncfusion';
        dialog.updateTextFormtas();
        expect((dialog as any).textFormatDropDown.dataSource[0].Value).toBe('Uppercase');
    });
    it('Change Type DropDown isinteracted - Form field Text Dialog', () => {
        console.log('Change Type DropDown isinteracted - Form field Text Dialog');
        editor.editorModule.insertFormField('Text');
        let event: any = {};
        (dialog as any).defaultTextInput.value = 'Sync';
        event.value = '';
        event.isInteracted = true;
        dialog.changeTypeDropDown(event as ChangeEventArgs);
        expect((dialog as any).defaultTextInput.value).toBe('');
    });
    it('Insert Form field Text Value updates', () => {
        console.log('Insert Form field Text Value updates - Date time validation');
        editor.editorModule.insertFormField('Text');
        (dialog as any).typeDropDown.value = 'Date';
        (dialog as any).textFormatDropDown.value = 'M/d/yyyy h:mm am/pm';
        (dialog as any).defaultTextInput.value = '10/1/2021 2:12 AM';
        (dialog as any).maxLengthNumber.value = 0;

        (dialog as any).bookmarkTextInput.value = 'Test';
        (dialog as any).fillInEnable.checked = false;
        (dialog as any).tooltipTextInput.value = 'testsync';
        editor.selection.selectAll();
        dialog.insertTextField();
        dialog.show();

        dialog.onCancelButtonClick();
        editor.selection.selectAll();
        let fieldData: TextFormField = editor.selection.getCurrentFormField().formFieldData as TextFormField;
        expect(fieldData.defaultValue).toBe('10/1/2021 2:12 AM');
    });
});
let text: any = { "sections": [{ "sectionFormat": { "pageWidth": 612, "pageHeight": 792, "leftMargin": 72, "rightMargin": 72, "topMargin": 72, "bottomMargin": 72, "differentFirstPage": false, "differentOddAndEvenPages": false, "headerDistance": 36, "footerDistance": 36, "bidi": false }, "blocks": [{ "paragraphFormat": { "leftIndent": 18, "rightIndent": 0, "firstLineIndent": -18, "textAlignment": "Left", "beforeSpacing": 0, "afterSpacing": 0, "lineSpacing": 1, "lineSpacingType": "Multiple", "styleName": "List Paragraph", "listFormat": { "listId": 0, "listLevelNumber": 0 }, "contextualSpacing": true }, "characterFormat": { "bold": false, "italic": false, "fontSize": 8, "fontFamily": "Times New Roman", "strikethrough": "None", "fontColor": "#000000FF", "boldBidi": false, "italicBidi": false, "fontSizeBidi": 8, "fontFamilyBidi": "Times New Roman" }, "inlines": [{ "characterFormat": { "bold": false, "italic": false, "fontSize": 8, "fontFamily": "Times New Roman", "strikethrough": "None", "fontColor": "#000000FF", "boldBidi": false, "italicBidi": false, "fontSizeBidi": 8, "fontFamilyBidi": "Times New Roman" }, "text": "Name Penuh (HURUH BESAR):" }, { "characterFormat": {}, "bookmarkType": 0, "name": "@PatientName" }, { "characterFormat": { "bold": false, "italic": false, "fontSize": 8, "fontFamily": "Times New Roman", "strikethrough": "None", "fontColor": "#000000FF", "boldBidi": false, "italicBidi": false, "fontSizeBidi": 8, "fontFamilyBidi": "Times New Roman" }, "fieldType": 0, "hasFieldEnd": true, "formFieldData": { "name": "@PatientName", "enabled": true, "helpText": "", "statusText": "", "textInput": { "type": "Text", "maxLength": 0, "defaultValue": "", "format": "None" } } }, { "characterFormat": {}, "text": "FORMTEXT" }, { "characterFormat": {}, "fieldType": 2 }, { "characterFormat": { "bold": false, "italic": false, "fontSize": 8, "fontFamily": "Times New Roman", "strikethrough": "None", "fontColor": "#000000FF", "boldBidi": false, "italicBidi": false, "fontSizeBidi": 8, "fontFamilyBidi": "Times New Roman" }, "text": "     " }, { "characterFormat": {}, "fieldType": 1 }, { "characterFormat": {}, "bookmarkType": 1, "name": "@PatientName" }] }, { "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Right", "beforeSpacing": 0, "afterSpacing": 8, "lineSpacing": 1, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {}, "contextualSpacing": false }, "characterFormat": { "bold": false, "italic": false, "fontSize": 8, "fontFamily": "Times New Roman", "strikethrough": "None", "baselineAlignment": "Normal", "fontColor": "#000000FF", "boldBidi": false, "italicBidi": false, "fontSizeBidi": 8, "fontFamilyBidi": "Times New Roman" }, "inlines": [{ "characterFormat": { "bold": false, "italic": false, "fontSize": 8, "fontFamily": "Times New Roman", "strikethrough": "None", "fontColor": "#000000FF", "boldBidi": false, "italicBidi": false, "fontSizeBidi": 8, "fontFamilyBidi": "Times New Roman" }, "text": "No. Siri" }, { "characterFormat": { "bold": false, "italic": false, "fontSize": 8, "fontFamily": "Times New Roman", "strikethrough": "None", "fontColor": "#000000FF", "boldBidi": false, "italicBidi": false, "fontSizeBidi": 8, "fontFamilyBidi": "Times New Roman" }, "text": ":" }, { "characterFormat": {}, "bookmarkType": 0, "name": "Text1" }, { "characterFormat": { "bold": false, "italic": false, "fontSize": 8, "fontFamily": "Times New Roman", "strikethrough": "None", "fontColor": "#000000FF", "boldBidi": false, "italicBidi": false, "fontSizeBidi": 8, "fontFamilyBidi": "Times New Roman" }, "fieldType": 0, "hasFieldEnd": true, "formFieldData": { "name": "Text1", "enabled": true, "helpText": "", "statusText": "", "textInput": { "type": "Text", "maxLength": 0, "defaultValue": "", "format": "None" } } }, { "characterFormat": {}, "text": "FORMTEXT" }, { "characterFormat": {}, "text": "FORMTEXT" }, { "characterFormat": {}, "text": "FORMTEXT" }, { "characterFormat": {}, "text": "FORMTEXT" }, { "characterFormat": {}, "text": "FORMTEXT" }, { "characterFormat": {}, "fieldType": 2 }, { "characterFormat": { "bold": false, "italic": false, "fontSize": 8, "fontFamily": "Times New Roman", "strikethrough": "None", "fontColor": "#000000FF", "boldBidi": false, "italicBidi": false, "fontSizeBidi": 8, "fontFamilyBidi": "Times New Roman" }, "text": "     " }, { "characterFormat": {}, "fieldType": 1 }, { "characterFormat": {}, "bookmarkType": 1, "name": "Text1" }] }], "headersFooters": { "header": { "blocks": [{ "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }] }, "footer": { "blocks": [{ "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }] }, "evenHeader": { "blocks": [{ "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }] }, "evenFooter": { "blocks": [{ "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }] }, "firstPageHeader": { "blocks": [{ "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }] }, "firstPageFooter": { "blocks": [{ "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }] } } }], "characterFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "underline": "None", "strikethrough": "None", "baselineAlignment": "Normal", "highlightColor": "NoColor", "fontColor": "#000000FF", "boldBidi": false, "italicBidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri", "allCaps": false }, "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 0, "afterSpacing": 0, "lineSpacing": 1, "lineSpacingType": "Multiple", "listFormat": {}, "bidi": false, "keepLinesTogether": false, "keepWithNext": false, "widowControl": true }, "defaultTabWidth": 36, "trackChanges": false, "enforcement": true, "hashValue": "", "saltValue": "", "formatting": false, "protectionType": "FormFieldsOnly", "dontUseHTMLParagraphAutoSpacing": false, "formFieldShading": true, "compatibilityMode": "Word2013", "styles": [{ "name": "Normal", "type": "Paragraph", "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "next": "Normal" }, { "name": "Heading 1", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 12, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level1", "listFormat": {} }, "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontSizeBidi": 16, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Normal", "link": "Heading 1 Char", "next": "Normal" }, { "name": "Heading 1 Char", "type": "Character", "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontSizeBidi": 16, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Default Paragraph Font" }, { "name": "Default Paragraph Font", "type": "Character", "characterFormat": {} }, { "name": "Heading 2", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level2", "listFormat": {} }, "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontSizeBidi": 13, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Normal", "link": "Heading 2 Char", "next": "Normal" }, { "name": "Heading 2 Char", "type": "Character", "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontSizeBidi": 13, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 3", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level3", "listFormat": {} }, "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763FF", "fontSizeBidi": 12, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Normal", "link": "Heading 3 Char", "next": "Normal" }, { "name": "Heading 3 Char", "type": "Character", "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763FF", "fontSizeBidi": 12, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 4", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level4", "listFormat": {} }, "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "italicBidi": true, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Normal", "link": "Heading 4 Char", "next": "Normal" }, { "name": "Heading 4 Char", "type": "Character", "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "italicBidi": true, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 5", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level5", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontFamilyBidi": "Calibri Light" }, "basedOn": "Normal", "link": "Heading 5 Char", "next": "Normal" }, { "name": "Heading 5 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontFamilyBidi": "Calibri Light" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 6", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level6", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763FF", "fontFamilyBidi": "Calibri Light" }, "basedOn": "Normal", "link": "Heading 6 Char", "next": "Normal" }, { "name": "Heading 6 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763FF", "fontFamilyBidi": "Calibri Light" }, "basedOn": "Default Paragraph Font" }, { "name": "List Paragraph", "type": "Paragraph", "paragraphFormat": { "leftIndent": 36, "rightIndent": 0, "textAlignment": "Left", "afterSpacing": 8, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "listFormat": {}, "contextualSpacing": true }, "characterFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Century Gothic", "strikethrough": "None", "fontColor": "#000000FF", "boldBidi": false, "italicBidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Century Gothic" }, "basedOn": "Normal", "next": "List Paragraph" }], "lists": [{ "abstractListId": 0, "levelOverrides": [], "listId": 0 }], "abstractLists": [{ "abstractListId": 0, "levels": [{ "characterFormat": { "bold": false, "italic": false, "fontSize": 8, "fontFamily": "Times New Roman", "strikethrough": "None", "fontColor": "#000000FF", "boldBidi": false, "italicBidi": false, "fontSizeBidi": 8, "fontFamilyBidi": "Times New Roman" }, "paragraphFormat": { "leftIndent": 18, "firstLineIndent": -18, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "listFormat": {}, "tabs": [{ "position": 0, "deletePosition": 0, "tabJustification": "Left", "tabLeader": "None" }] }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%1.", "restartLevel": 0, "startAt": 1 }, { "characterFormat": { "bold": false, "fontFamily": "Times New Roman", "fontColor": "#000000FF", "boldBidi": false, "fontFamilyBidi": "Times New Roman" }, "paragraphFormat": { "leftIndent": 54, "firstLineIndent": -18, "listFormat": {}, "tabs": [{ "position": 0, "deletePosition": 0, "tabJustification": "Left", "tabLeader": "None" }] }, "followCharacter": "Tab", "listLevelPattern": "LowLetter", "numberFormat": "%2.", "restartLevel": 1, "startAt": 1 }, { "characterFormat": { "bold": false, "fontFamily": "Times New Roman", "fontColor": "#000000FF", "boldBidi": false, "fontFamilyBidi": "Times New Roman" }, "paragraphFormat": { "leftIndent": 90, "firstLineIndent": -9, "listFormat": {}, "tabs": [{ "position": 0, "deletePosition": 0, "tabJustification": "Left", "tabLeader": "None" }] }, "followCharacter": "Tab", "listLevelPattern": "LowRoman", "numberFormat": "%3.", "restartLevel": 2, "startAt": 1 }, { "characterFormat": { "bold": false, "fontFamily": "Times New Roman", "fontColor": "#000000FF", "boldBidi": false, "fontFamilyBidi": "Times New Roman" }, "paragraphFormat": { "leftIndent": 126, "firstLineIndent": -18, "listFormat": {}, "tabs": [{ "position": 0, "deletePosition": 0, "tabJustification": "Left", "tabLeader": "None" }] }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%4.", "restartLevel": 3, "startAt": 1 }, { "characterFormat": { "bold": false, "fontFamily": "Times New Roman", "fontColor": "#000000FF", "boldBidi": false, "fontFamilyBidi": "Times New Roman" }, "paragraphFormat": { "leftIndent": 162, "firstLineIndent": -18, "listFormat": {}, "tabs": [{ "position": 0, "deletePosition": 0, "tabJustification": "Left", "tabLeader": "None" }] }, "followCharacter": "Tab", "listLevelPattern": "LowLetter", "numberFormat": "%5.", "restartLevel": 4, "startAt": 1 }, { "characterFormat": { "bold": false, "fontFamily": "Times New Roman", "fontColor": "#000000FF", "boldBidi": false, "fontFamilyBidi": "Times New Roman" }, "paragraphFormat": { "leftIndent": 198, "firstLineIndent": -9, "listFormat": {}, "tabs": [{ "position": 0, "deletePosition": 0, "tabJustification": "Left", "tabLeader": "None" }] }, "followCharacter": "Tab", "listLevelPattern": "LowRoman", "numberFormat": "%6.", "restartLevel": 5, "startAt": 1 }, { "characterFormat": { "bold": false, "fontFamily": "Times New Roman", "fontColor": "#000000FF", "boldBidi": false, "fontFamilyBidi": "Times New Roman" }, "paragraphFormat": { "leftIndent": 234, "firstLineIndent": -18, "listFormat": {}, "tabs": [{ "position": 0, "deletePosition": 0, "tabJustification": "Left", "tabLeader": "None" }] }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%7.", "restartLevel": 6, "startAt": 1 }, { "characterFormat": { "bold": false, "fontFamily": "Times New Roman", "fontColor": "#000000FF", "boldBidi": false, "fontFamilyBidi": "Times New Roman" }, "paragraphFormat": { "leftIndent": 270, "firstLineIndent": -18, "listFormat": {}, "tabs": [{ "position": 0, "deletePosition": 0, "tabJustification": "Left", "tabLeader": "None" }] }, "followCharacter": "Tab", "listLevelPattern": "LowLetter", "numberFormat": "%8.", "restartLevel": 7, "startAt": 1 }, { "characterFormat": { "bold": false, "fontFamily": "Times New Roman", "fontColor": "#000000FF", "boldBidi": false, "fontFamilyBidi": "Times New Roman" }, "paragraphFormat": { "leftIndent": 306, "firstLineIndent": -9, "listFormat": {}, "tabs": [{ "position": 0, "deletePosition": 0, "tabJustification": "Left", "tabLeader": "None" }] }, "followCharacter": "Tab", "listLevelPattern": "LowRoman", "numberFormat": "%9.", "restartLevel": 8, "startAt": 1 }] }], "comments": [], "revisions": [], "customXml": [], "footnotes": { "separator": [{ "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "text": "\u0003" }] }], "continuationSeparator": [{ "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "text": "\u0004" }] }], "continuationNotice": [{ "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }] }, "endnotes": { "separator": [{ "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "text": "\u0003" }] }], "continuationSeparator": [{ "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "text": "\u0004" }] }] } }
describe('Formfield data validation in inline mode', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Check the formfield text in inline mode', () => {
        console.log('Check the formfield text in inline mode');
        container.openBlank();
        container.open(text);
        container.documentEditorSettings.formFieldSettings.formFillingMode = 'Inline';
        let field: any = container.getFormFieldInfo('@PatientName');
        field.defaultValue = 'Sample';
        container.setFormFieldInfo('@PatientName', field);
        let bodyWidget: BodyWidget = container.editor.documentHelper.pages[0].bodyWidgets[0] as BodyWidget;
        let paragraphWidget: ParagraphWidget = bodyWidget.childWidgets[0] as ParagraphWidget;
        let lineWidget: LineWidget = paragraphWidget.childWidgets[0] as LineWidget;
        let textElementBox: TextElementBox = lineWidget.children[8] as TextElementBox;
        expect(textElementBox.text).toBe('Sample');
    });
});
describe('Check API to modify text form field name in Inline mode', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Check the number of form fields', () => {
        console.log('Check the number of form fields');
        container.openBlank();
        container.editor.insertFormField('Text');
        container.editor.insertFormField('Text');
        container.editor.insertFormField('Text');
        container.editor.enforceProtection('123', 'FormFieldsOnly');
        container.documentEditorSettings.formFieldSettings.formFillingMode = 'Inline';
        let formFieldNames1: any = container.getFormFieldNames();
        expect(formFieldNames1.length).toEqual(3);
        let field: any = container.getFormFieldInfo(formFieldNames1[1]);
        field.name = 'Text3';
        container.setFormFieldInfo(formFieldNames1[1], field);
        let formFieldNames2: any = container.getFormFieldNames();
        expect(formFieldNames2.length).toEqual(2);
        container.editor.stopProtection('123');
    });
    it('Check the names of Form Fields', () => {
        console.log('Check the names of form fields');
        container.openBlank();
        container.editor.insertFormField('Text');
        container.editor.insertFormField('Text');
        container.editor.insertFormField('Text');
        container.editor.enforceProtection('123', 'FormFieldsOnly');
        container.documentEditorSettings.formFieldSettings.formFillingMode = 'Inline';
        let formFieldNames1: any = container.getFormFieldNames();
        expect(formFieldNames1[0]).toEqual('Text1');
        expect(formFieldNames1[1]).toEqual('Text2');
        expect(formFieldNames1[2]).toEqual('Text3');
        let field: any = container.getFormFieldInfo(formFieldNames1[1]);
        field.name = 'Text3';
        container.setFormFieldInfo(formFieldNames1[1], field);
        let formFieldNames2: any = container.getFormFieldNames();
        expect(formFieldNames2[0]).toEqual('Text1');
        expect(formFieldNames2[1]).toEqual('Text3');
        container.editor.stopProtection('123');
    });
    it('Modifying form fields without modifying name', () => {
        console.log('modifying Form Field without changing name');
        container.openBlank();
        container.editor.insertFormField('Text');
        container.editor.insertFormField('Text');
        container.editor.insertFormField('Text');
        container.editor.enforceProtection('123', 'FormFieldsOnly');
        container.documentEditorSettings.formFieldSettings.formFillingMode = 'Inline';
        let formFieldNames1: any = container.getFormFieldNames();
        let field: any = container.getFormFieldInfo(formFieldNames1[1]);
        field.defaultValue = "Hello";
        field.format = "Uppercase";
        field.type = "Text";
        container.setFormFieldInfo(formFieldNames1[1], field);
        let formFieldNames2: any = container.getFormFieldNames();
        expect(formFieldNames2.length).toEqual(3);
        container.editor.stopProtection('123');
    });
    it('Check new name for form fields', () => {
        console.log('Check unique name for form fields');
        container.openBlank();
        container.editor.insertFormField('Text');
        container.editor.insertFormField('Text');
        container.editor.insertFormField('Text');
        container.editor.enforceProtection('123', 'FormFieldsOnly');
        container.documentEditorSettings.formFieldSettings.formFillingMode = 'Inline';
        let formFieldNames1: any = container.getFormFieldNames();
        let field1: any = container.getFormFieldInfo(formFieldNames1[1]);
        field1.name = 'NewFormFieldName';
        container.setFormFieldInfo(formFieldNames1[1], field1);
        let field2: any = container.getFormFieldInfo("NewFormFieldName");
        let formFieldNames2: any = container.getFormFieldNames();
        expect(formFieldNames2).toContain("NewFormFieldName");
        expect(field2.name).toBeDefined();
        container.editor.stopProtection('123');
    });
});
describe('Check API to modify text form field name in popup mode', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Check the number of form fields', () => {
        console.log('Check the number of form fields');
        container.openBlank();
        container.editor.insertFormField('Text');
        container.editor.insertFormField('Text');
        container.editor.insertFormField('Text');
        container.editor.enforceProtection('123', 'FormFieldsOnly');
        let formFieldNames1: any = container.getFormFieldNames();
        expect(formFieldNames1.length).toEqual(3);
        let field: any = container.getFormFieldInfo(formFieldNames1[1]);
        field.name = 'Text3';
        container.setFormFieldInfo(formFieldNames1[1], field);
        let formFieldNames2: any = container.getFormFieldNames();
        expect(formFieldNames2.length).toEqual(2);
        container.editor.stopProtection('123');
    });
    it('Check the names of Form Fields', () => {
        console.log('Check the names of form fields');
        container.openBlank();
        container.editor.insertFormField('Text');
        container.editor.insertFormField('Text');
        container.editor.insertFormField('Text');
        let formFieldNames1: any = container.getFormFieldNames();
        expect(formFieldNames1[0]).toEqual('Text1');
        expect(formFieldNames1[1]).toEqual('Text2');
        expect(formFieldNames1[2]).toEqual('Text3');
        container.editor.enforceProtection('123', 'FormFieldsOnly');
        let field: any = container.getFormFieldInfo(formFieldNames1[1]);
        field.name = 'Text3';
        container.setFormFieldInfo(formFieldNames1[1], field);
        let formFieldNames2: any = container.getFormFieldNames();
        expect(formFieldNames2[0]).toEqual('Text1');
        expect(formFieldNames2[1]).toEqual('Text3');
        container.editor.stopProtection('123');
    });
    it('Modifying form fields without modifying name', () => {
        console.log('modifying Form Field without changing name');
        container.openBlank();
        container.editor.insertFormField('Text');
        container.editor.insertFormField('Text');
        container.editor.insertFormField('Text');
        container.editor.enforceProtection('123', 'FormFieldsOnly');
        let formFieldNames1: any = container.getFormFieldNames();
        let field: any = container.getFormFieldInfo(formFieldNames1[1]);
        field.defaultValue = "Hello";
        field.format = "Uppercase";
        field.type = "Text";
        container.setFormFieldInfo(formFieldNames1[1], field);
        let formFieldNames2: any = container.getFormFieldNames();
        expect(formFieldNames2.length).toEqual(3);
        container.editor.stopProtection('123');
    });
    it('Check new name for form fields', () => {
        console.log('Check unique name for form fields');
        container.openBlank();
        container.editor.insertFormField('Text');
        container.editor.insertFormField('Text');
        container.editor.insertFormField('Text');
        container.editor.enforceProtection('123', 'FormFieldsOnly');
        let formFieldNames1: any = container.getFormFieldNames();
        let field1: any = container.getFormFieldInfo(formFieldNames1[1]);
        field1.name = 'NewFormFieldName';
        container.setFormFieldInfo(formFieldNames1[1], field1);
        let field2: any = container.getFormFieldInfo("NewFormFieldName");
        let formFieldNames2: any = container.getFormFieldNames();
        expect(formFieldNames2).toContain("NewFormFieldName");
        expect(field2.name).toBeDefined();
        container.editor.stopProtection('123');
    });
});
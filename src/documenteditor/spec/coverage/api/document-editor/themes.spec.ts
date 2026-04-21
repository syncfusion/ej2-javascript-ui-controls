import { BookmarkDialog, ContentControlInfo, Dictionary, DocumentEditor, DocumentEditorSettings, FontScheme, FontSchemeStruct, FormFieldData, MajorMinorFontScheme, Themes, XmlHttpRequestEventArgs, XmlHttpRequestHandler } from '../../../../src/index';
import { createElement, Browser } from '@syncfusion/ej2-base';
import 'node_modules/es6-promise/dist/es6-promise';
import { TestHelper } from '../../../test-helper.spec';



describe('Themes spec for coverage ', () => {
    let documenteditor: DocumentEditor;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        documenteditor = new DocumentEditor({isReadOnly:false})
        documenteditor.enableAllModules();
        documenteditor.appendTo("#container");
    });
    afterAll((done) => {
        documenteditor.destroy();
        document.body.removeChild(document.getElementById('container'));
        documenteditor = undefined;
        
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Themes constructor validation', () => {
        console.log('Themes constructor validation');
        let themes: Themes = new Themes();
        expect(themes).not.toBeUndefined();
    });
    it('Themes copyFormat validation', () => {
        console.log('Themes copyFormat validation');
        let themes: Themes = new Themes();
        themes.fontScheme = new FontScheme();
        themes.fontScheme.fontSchemeName = "test";
        themes.fontScheme.majorFontScheme = new MajorMinorFontScheme();
        let fontList: FontSchemeStruct = new FontSchemeStruct();
        fontList.name = "test";
        fontList.typeface = "test";
        fontList.panose = "test";
        fontList.copyFormat(fontList);
        themes.fontScheme.minorFontScheme.fontSchemeList.push(fontList);
        themes.fontScheme.minorFontScheme.fontSchemeList.push(fontList);
        fontList.copyFormat(undefined);
        fontList.destroy();
        themes.fontScheme.majorFontScheme.fontTypeface.add("test", "test");
        let typeface: Dictionary<string, string> = new Dictionary<string, string>();
        typeface.add("test", "test");
        themes.fontScheme.majorFontScheme.fontTypeface = typeface;
        themes.fontScheme.majorFontScheme.copyFormat(themes.fontScheme.majorFontScheme);
        themes.fontScheme.majorFontScheme.copyFormat(undefined);
        let themes1: Themes = new Themes();
        themes1.fontScheme = new FontScheme();
        themes.copyFormat(themes1);
        expect(themes).not.toBeUndefined();
        themes.fontScheme.minorFontScheme.destroy();
        themes1.fontScheme.destroy();
        themes1.destroy();
    });
    it('themes copy format undefined validation', () => {
        console.log('themes copy format undefined validation');
        let themes: Themes = new Themes();
        themes.copyFormat(undefined);
        expect(themes).not.toBeUndefined();
        console.log('font scheme copy format undefined validation');
        let fontScheme: FontScheme = new FontScheme();
        fontScheme.copyFormat(undefined);
        expect(fontScheme).not.toBeUndefined();
    });
});
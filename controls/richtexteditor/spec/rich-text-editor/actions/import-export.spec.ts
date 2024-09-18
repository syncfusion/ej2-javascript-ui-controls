/**
 * Import Export spec
 */
import { RichTextEditor } from "../../../src/rich-text-editor/index";
import { renderRTE, destroy } from "./../render.spec";
describe('Import function', () => {
    let rteObj: RichTextEditor;
    beforeEach((done: Function) => {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ['ImportWord']
            },
            importWord: {
                serviceUrl: 'https://ej2services.syncfusion.com/js/development/api/RichTextEditor/ImportFromWord',
            }
        });
        done();
    });
    afterEach((done: Function) => {
        destroy(rteObj);
        done();
    });
    it('To check the code coverage of onImport method', (done: Function) => {
        let rteEle: HTMLElement = rteObj.element;
        (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
        (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[0] as HTMLElement).click();
        const args = {
            e: {
                currentTarget: {
                    response: `<div class="Section0">
                            <p style="text-align:left;page-break-inside:auto;page-break-after:auto;page-break-before:avoid;margin-top:0pt;margin-bottom:8pt;">
                                <span lang="en-US" style="font-family:Aptos;font-size:26pt;text-transform:none;font-weight:bold;font-style:normal;font-variant:normal;text-decoration:none;line-height:107.916664%;">
                                    CheckingggggWord
                                </span>
                            </p>
                        </div>` }
            }
        };
        (<any>rteObj).importExportModule.uploaderObj.success(args);
        expect(rteEle.innerText).toContain('CheckingggggWord');
        done();
    });
});
describe('Export function', () => {
    let rteObj: RichTextEditor;
    beforeEach((done: Function) => {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ['ExportWord', 'ExportPdf']
            },
            exportWord: {
                serviceUrl: 'https://ej2services.syncfusion.com/js/development/api/RichTextEditor/ExportToDocx',
                fileName: 'RichTextEditor.docx',
                stylesheet: `
        .e-rte-content {
            font-size: 1em;
            font-weight: 400;
            margin: 0;
        }
    `
            },
            exportPdf: {
                serviceUrl: 'https://ej2services.syncfusion.com/js/development/api/RichTextEditor/ExportToPdf',
                fileName: 'RichTextEditor.pdf',
                stylesheet: `
        .e-rte-content{
            font-size: 1em;
            font-weight: 400;
            margin: 0;
        }
    `
            }
        });
        done();
    });
    afterEach((done: Function) => {
        destroy(rteObj);
        done();
    });
    it('To check the code coverage of onExport method', (done: Function) => {
        let rteEle: HTMLElement = rteObj.element;
        (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
        (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[0] as HTMLElement).click();
        (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[1] as HTMLElement).click();
        done();
    });
});
describe('Export function', () => {
    let rteObj: RichTextEditor;
    beforeEach((done: Function) => {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ['ExportWord', 'ExportPdf']
            },
            exportWord: {
                serviceUrl: 'https://ej2services.syncfusion.com/js/production/api/RichTextEditor/ExportToDocx',
                fileName: 'RichTextEditor.docx',
                stylesheet: `
        .e-rte-content {
            font-size: 1em;
            font-weight: 400;
            margin: 0;
        }
    `
            },
            exportPdf: {
                serviceUrl: 'https://ej2services.syncfusion.com/js/production/api/RichTextEditor/ExportToPdf',
                fileName: 'RichTextEditor.pdf',
                stylesheet: `
        .e-rte-content{
            font-size: 1em;
            font-weight: 400;
            margin: 0;
        }
    `
            },
        });
        done();
    });
    afterEach((done: Function) => {
        destroy(rteObj);
        done();
    });
    it('To test with dummy url', (done: Function) => {
        let rteEle: HTMLElement = rteObj.element;
        (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
        (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[0] as HTMLElement).click();
        (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[1] as HTMLElement).click();
        done();
    });
});
describe('Covering Code', () => {
    let rteObj: RichTextEditor;
    beforeEach((done: Function) => {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ['ImportWord', 'ExportWord', 'ExportPdf']
            },
            importWord: {
                serviceUrl: 'https://ej2services.syncfusion.com/js/development/api/RichTextEditor/ImportFromWord',
            },
            exportWord: {
                serviceUrl: 'https://ej2services.syncfusion.com/js/development/api/RichTextEditor/ExportToDocx',
                fileName: 'RichTextEditor.docx',
                stylesheet: `
        .e-rte-content {
            font-size: 1em;
            font-weight: 400;
            margin: 0;
        }
    `
            },
            exportPdf: {
                serviceUrl: 'https://ej2services.syncfusion.com/js/development/api/RichTextEditor/ExportToPdf',
                fileName: 'RichTextEditor.pdf',
                stylesheet: `
        .e-rte-content{
            font-size: 1em;
            font-weight: 400;
            margin: 0;
        }
    `
            },
            actionBegin: function (e: any) {
                e.cancel = true;
            }
        });
        done();
    });
    afterEach((done: Function) => {
        destroy(rteObj);
        done();
    });
    it(' To cover else part codes', (done: Function) => {
        let rteEle: HTMLElement = rteObj.element;
        (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
        const args = {
            subCommand: 'ImportWord'
        };
        (<any>rteObj).importExportModule.onExport(args);
        (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[1] as HTMLElement).click();
        (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[2] as HTMLElement).click();
        done();
    });
});
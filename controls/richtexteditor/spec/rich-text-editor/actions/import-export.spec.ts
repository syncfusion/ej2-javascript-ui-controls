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
                serviceUrl: 'https://services.syncfusion.com/js/development/api/RichTextEditor/ImportFromWord',
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
describe('Bug 905477: Script error occurred in import from word', () => {
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
    it('To check the table class is added for the table imported from the word', (done: Function) => {
        let rteEle: HTMLElement = rteObj.element;
        (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
        (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[0] as HTMLElement).click();
        const args = {
            e: {
                currentTarget: {
                    response: `<div class="Section0"><p style="text-align:left;page-break-inside:auto;page-break-after:auto;page-break-before:avoid;margin-top:0pt;margin-bottom:8pt;"><span lang="en-US" style="font-family:Aptos;font-size:26pt;text-transform:none;font-weight:bold;font-style:normal;font-variant:normal;text-decoration: none;line-height:107.916664%;">CheckingggggWord</span></p>  <div><table cellspacing="0" style="width: auto; border-collapse: collapse; "><tbody><tr style="height: 2px"><td style="vertical-align:top;border-top-style:solid;border-top-color:#000000;border-top-width:1pt;border-left-style:solid;border-left-color:#000000;border-left-width:1pt;border-right-style:solid;border-right-color:#000000;border-right-width:1pt;border-bottom-style:solid;border-bottom-color:#000000;border-bottom-width:1pt;padding-left:5.4pt;padding-right:5.4pt;padding-top:0pt;padding-bottom:0pt;width:134.13333px;"><p style="text-align:left;page-break-inside:auto;page-break-after:auto;page-break-before:avoid;margin-top:0pt;margin-bottom:0pt;"><span lang="en-US" style="font-family:Aptos;font-size:26pt;text-transform:none;font-weight:bold;font-style:normal;font-variant:normal;text-decoration: none;">a</span></p>  </td><td style="vertical-align:top;border-top-style:solid;border-top-color:#000000;border-top-width:1pt;border-left-style:solid;border-left-color:#000000;border-left-width:1pt;border-right-style:solid;border-right-color:#000000;border-right-width:1pt;border-bottom-style:solid;border-bottom-color:#000000;border-bottom-width:1pt;padding-left:5.4pt;padding-right:5.4pt;padding-top:0pt;padding-bottom:0pt;width:134.2px;"><p style="text-align:left;page-break-inside:auto;page-break-after:auto;page-break-before:avoid;margin-top:0pt;margin-bottom:0pt;"><span lang="en-US" style="font-family:Aptos;font-size:26pt;text-transform:none;font-weight:bold;font-style:normal;font-variant:normal;text-decoration: none;">b</span></p>  </td><td style="vertical-align:top;border-top-style:solid;border-top-color:#000000;border-top-width:1pt;border-left-style:solid;border-left-color:#000000;border-left-width:1pt;border-right-style:solid;border-right-color:#000000;border-right-width:1pt;border-bottom-style:solid;border-bottom-color:#000000;border-bottom-width:1pt;padding-left:5.4pt;padding-right:5.4pt;padding-top:0pt;padding-bottom:0pt;width:134.2px;"><p style="text-align:left;page-break-inside:auto;page-break-after:auto;page-break-before:avoid;margin-top:0pt;margin-bottom:0pt;"><span lang="en-US" style="font-family:Aptos;font-size:26pt;text-transform:none;font-weight:bold;font-style:normal;font-variant:normal;text-decoration: none;">C</span></p>  </td></tr><tr style="height: 2px"><td style="vertical-align:top;border-top-style:solid;border-top-color:#000000;border-top-width:1pt;border-left-style:solid;border-left-color:#000000;border-left-width:1pt;border-right-style:solid;border-right-color:#000000;border-right-width:1pt;border-bottom-style:solid;border-bottom-color:#000000;border-bottom-width:1pt;padding-left:5.4pt;padding-right:5.4pt;padding-top:0pt;padding-bottom:0pt;width:134.13333px;"><p style="text-align:left;page-break-inside:auto;page-break-after:auto;page-break-before:avoid;margin-top:0pt;margin-bottom:0pt;"><span lang="en-US" style="font-family:Aptos;font-size:26pt;text-transform:none;font-weight:bold;font-style:normal;font-variant:normal;text-decoration: none;">d</span></p>  </td><td style="vertical-align:top;border-top-style:solid;border-top-color:#000000;border-top-width:1pt;border-left-style:solid;border-left-color:#000000;border-left-width:1pt;border-right-style:solid;border-right-color:#000000;border-right-width:1pt;border-bottom-style:solid;border-bottom-color:#000000;border-bottom-width:1pt;padding-left:5.4pt;padding-right:5.4pt;padding-top:0pt;padding-bottom:0pt;width:134.2px;"><p style="text-align:left;page-break-inside:auto;page-break-after:auto;page-break-before:avoid;margin-top:0pt;margin-bottom:0pt;"><span lang="en-US" style="font-family:Aptos;font-size:26pt;text-transform:none;font-weight:bold;font-style:normal;font-variant:normal;text-decoration: none;">e</span></p>  </td><td style="vertical-align:top;border-top-style:solid;border-top-color:#000000;border-top-width:1pt;border-left-style:solid;border-left-color:#000000;border-left-width:1pt;border-right-style:solid;border-right-color:#000000;border-right-width:1pt;border-bottom-style:solid;border-bottom-color:#000000;border-bottom-width:1pt;padding-left:5.4pt;padding-right:5.4pt;padding-top:0pt;padding-bottom:0pt;width:134.2px;"><p style="text-align:left;page-break-inside:auto;page-break-after:auto;page-break-before:avoid;margin-top:0pt;margin-bottom:0pt;"><span lang="en-US" style="font-family:Aptos;font-size:26pt;text-transform:none;font-weight:bold;font-style:normal;font-variant:normal;text-decoration: none;">f</span></p>  </td></tr><tr style="height: 2px"><td style="vertical-align:top;border-top-style:solid;border-top-color:#000000;border-top-width:1pt;border-left-style:solid;border-left-color:#000000;border-left-width:1pt;border-right-style:solid;border-right-color:#000000;border-right-width:1pt;border-bottom-style:solid;border-bottom-color:#000000;border-bottom-width:1pt;padding-left:5.4pt;padding-right:5.4pt;padding-top:0pt;padding-bottom:0pt;width:134.13333px;"><p style="text-align:left;page-break-inside:auto;page-break-after:auto;page-break-before:avoid;margin-top:0pt;margin-bottom:0pt;"><span lang="en-US" style="font-family:Aptos;font-size:26pt;text-transform:none;font-weight:bold;font-style:normal;font-variant:normal;text-decoration: none;">g</span></p>  </td><td style="vertical-align:top;border-top-style:solid;border-top-color:#000000;border-top-width:1pt;border-left-style:solid;border-left-color:#000000;border-left-width:1pt;border-right-style:solid;border-right-color:#000000;border-right-width:1pt;border-bottom-style:solid;border-bottom-color:#000000;border-bottom-width:1pt;padding-left:5.4pt;padding-right:5.4pt;padding-top:0pt;padding-bottom:0pt;width:134.2px;"><p style="text-align:left;page-break-inside:auto;page-break-after:auto;page-break-before:avoid;margin-top:0pt;margin-bottom:0pt;"><span lang="en-US" style="font-family:Aptos;font-size:26pt;text-transform:none;font-weight:bold;font-style:normal;font-variant:normal;text-decoration: none;">h</span></p>  </td><td style="vertical-align:top;border-top-style:solid;border-top-color:#000000;border-top-width:1pt;border-left-style:solid;border-left-color:#000000;border-left-width:1pt;border-right-style:solid;border-right-color:#000000;border-right-width:1pt;border-bottom-style:solid;border-bottom-color:#000000;border-bottom-width:1pt;padding-left:5.4pt;padding-right:5.4pt;padding-top:0pt;padding-bottom:0pt;width:134.2px;"><p style="text-align:left;page-break-inside:auto;page-break-after:auto;page-break-before:avoid;margin-top:0pt;margin-bottom:0pt;"><span lang="en-US" style="font-family:Aptos;font-size:26pt;text-transform:none;font-weight:bold;font-style:normal;font-variant:normal;text-decoration: none;">i</span></p>  </td></tr></tbody></table></div><p style="text-align:left;page-break-inside:auto;page-break-after:auto;page-break-before:avoid;line-height:107.916664%;margin-top:0pt;margin-bottom:8pt;"><span style="font-family:Aptos;font-size:26pt;text-transform:none;font-weight:bold;font-style:normal;font-variant:normal;line-height:107.916664%;">&nbsp;</span></p>  </div>`
                }
            }
        };
        (<any>rteObj).importExportModule.uploaderObj.success(args);
        const table = rteEle.getElementsByTagName('table')[0];
        expect(table.classList).toContain('e-rte-paste-table');
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
                serviceUrl: 'https://services.syncfusion.com/js/development/api/RichTextEditor/ExportToDocx',
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
                serviceUrl: 'https://services.syncfusion.com/js/development/api/RichTextEditor/ExportToPdf',
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
                serviceUrl: 'https://services.syncfusion.com/js/production/api/RichTextEditor/ExportToDocx',
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
                serviceUrl: 'https://services.syncfusion.com/js/production/api/RichTextEditor/ExportToPdf',
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
                serviceUrl: 'https://services.syncfusion.com/js/development/api/RichTextEditor/ImportFromWord',
            },
            exportWord: {
                serviceUrl: 'https://services.syncfusion.com/js/development/api/RichTextEditor/ExportToDocx',
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
                serviceUrl: 'https://services.syncfusion.com/js/development/api/RichTextEditor/ExportToPdf',
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
import { SpreadsheetHelper } from "../util/spreadsheethelper.spec";
import { defaultData } from '../util/datasource.spec';
import { Overlay } from '../../../src/spreadsheet/services/index';
import { SpreadsheetModel, Spreadsheet, BasicModule, CellSaveEventArgs } from '../../../src/spreadsheet/index';
import { EventHandler } from "@syncfusion/ej2-base";

describe('Image ->', () => {
    const helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');

    describe('public method ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });

        it('Insert Image', (done: Function) => {
            helper.invoke('insertImage', [[{src:"https://www.w3schools.com/images/w3schools_green.jpg", height: 400, width: 400}], 'D3']);
            // expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[3].image)).toBe('[{"src":"https://www.w3schools.com/images/w3schools_green.jpg","id":"spreadsheet_overlay_picture_1","height":400,"width":400,"top":40,"left":192}]'); Check this now
            expect(helper.getElementFromSpreadsheet('#' + helper.id + '_overlay_picture_1').style.backgroundImage).toBe('url("https://www.w3schools.com/images/w3schools_green.jpg")');
            done();
        });

        it('After column insert', (done: Function) => {
            helper.invoke('insertColumn', [3, 4]);
            // expect(helper.getInstance().sheets[0].rows[2].cells[3]).toBeNull(); Check this now
            // expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[5].image)).toBe('[{"src":"https://www.w3schools.com/images/w3schools_green.jpg","id":"spreadsheet_overlay_picture_1","height":400,"width":400,"top":40,"left":320}]');
            // expect(helper.getElementFromSpreadsheet('#' + helper.id + '_overlay_picture_1').style.left).toBe('320px'); 
            done();
        });

        it('After row insert', (done: Function) => {
            helper.invoke('insertRow', [2, 2]);
            // expect(helper.getInstance().sheets[0].rows[2].cells).toBeUndefined(); Check this now
            // expect(JSON.stringify(helper.getInstance().sheets[0].rows[3].cells[5].image)).toBe('[{"src":"https://www.w3schools.com/images/w3schools_green.jpg","id":"spreadsheet_overlay_picture_1","height":400,"width":400,"top":60,"left":320}]');
            // expect(helper.getElementFromSpreadsheet('#' + helper.id + '_overlay_picture_1').style.top).toBe('60px');
            done();
        });

        it('Delete Image', (done: Function) => {
            (helper.getInstance().serviceLocator.getService('shape') as Overlay).destroy();// Need to remove once destory of overlay service handled in image.
            helper.invoke('deleteImage', ['spreadsheet_overlay_picture_1']);
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[3].cells[5].image)).toBe('[]');
            expect(helper.getElementFromSpreadsheet('#' + helper.id + '_overlay_picture_1')).toBeNull();
            done();
        });
    });

    describe('Delete Image with Freeze Panes', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }], frozenRows: 2, frozenColumns: 2  }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Delete Image With after Freezon Rows and Frozen Columns->', (done: Function) => {
            helper.getInstance().spreadsheetImageModule.createImageElement({options: { src: 'https://www.w3schools.com/images/w3schools_green.jpg'}, range: 'C3', isPublic: true });
            helper.getInstance().spreadsheetImageModule.deleteImage({ id: 'spreadsheet_overlay_picture_1' });
            setTimeout(() => {
                expect(helper.getElementFromSpreadsheet('#' + helper.id + '_overlay_picture_1')).toBeNull();
                done();
            });
        });
        it('Delete Image With Before Freezon Rows and Frozen Columns->', (done: Function) => {
            helper.getInstance().spreadsheetImageModule.createImageElement({options: { src: 'https://www.w3schools.com/images/w3schools_green.jpg'}, range: 'A1', isPublic: true });
            helper.getInstance().spreadsheetImageModule.deleteImage({ id: 'spreadsheet_overlay_picture_2' });
            setTimeout(() => {
                expect(helper.getElementFromSpreadsheet('#' + helper.id + '_overlay_picture_2')).toBeNull();
                done();
            });
        });
        it('Cancelling Delete Image in action begin event', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.actionBegin = (args: any): void => {
                    if (args.action === 'deleteImage') {  
                        args.args.eventArgs.cancel = true; }
                }
            helper.getInstance().spreadsheetImageModule.createImageElement({options: { src: 'https://www.w3schools.com/images/w3schools_green.jpg'}, range: 'A1', isPublic: true });
            helper.getInstance().spreadsheetImageModule.deleteImage({ id: 'spreadsheet_overlay_picture_3' });
            setTimeout(() => {
                expect(helper.getElementFromSpreadsheet('#' + helper.id + '_overlay_picture_3')).not.toBeNull();
                done();
            });
        });
        it('Cancelling Image Insert in action begin event', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.actionBegin = (args: any): void => {
                    if (args.action === 'beforeInsertImage') {  
                        args.args.eventArgs.cancel = true; }
                }
            helper.getInstance().spreadsheetImageModule.createImageElement({options: { src: 'https://www.w3schools.com/images/w3schools_green.jpg'}, range: 'I1', isPublic: true });
            expect(helper.getElementFromSpreadsheet('#' + helper.id + '_overlay_picture_4')).toBeNull();
            done();
        });
    });
    
    describe('Delete row/column after inserting the image ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });

        it('Delete row/column after inserting the image', (done: Function) => {
            helper.invoke('insertImage', [[{src:"https://www.w3schools.com/images/w3schools_green.jpg", height: 400, width: 400}], 'D3']);
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[3].image)).toBe('[{"src":"https://www.w3schools.com/images/w3schools_green.jpg","id":"spreadsheet_overlay_picture_1","height":400,"width":400,"top":40,"left":192}]');
            EventHandler.remove(document, 'mouseup', helper.getInstance().serviceLocator.services.shape.overlayMouseUpHandler);
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.delete(2,3,"Column","Sheet1");

            // ------------ After deleting the column image is removed so uanble to find the image position -----------------//

            // setTimeout(() => {
            //     expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[3].image)).toBe('[{"src":"https://www.w3schools.com/images/w3schools_green.jpg","id":"spreadsheet_overlay_picture_1","height":400,"width":400,"top":40,"left":192}]');
            // },0); 

            done();
        });
    });
});
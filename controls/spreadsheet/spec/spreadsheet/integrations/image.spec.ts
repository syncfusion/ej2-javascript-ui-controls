import { SpreadsheetHelper } from "../util/spreadsheethelper.spec";
import { defaultData } from '../util/datasource.spec';
import { Overlay } from '../../../src/spreadsheet/services/index';

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

    describe('UI Interaction ->', () => {
        
    });
});
import { SpreadsheetHelper } from "../util/spreadsheethelper.spec";
import { defaultData } from '../util/datasource.spec';
import { Overlay } from '../../../src/spreadsheet/services/index';
import { Spreadsheet } from '../../../src/spreadsheet/index';
import { EventHandler } from '@syncfusion/ej2-base';
import { ImageModel } from '../../../src/index';

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
            helper.invoke('insertImage', [[{src:"https://www.w3schools.com/images/w3schools_green.jpg", width: 110, height: 70 }], 'D3']);
            const image: ImageModel = helper.getInstance().sheets[0].rows[2].cells[3].image[0];
            expect(image.height).toBe(70);
            expect(image.width).toBe(110);
            expect(image.top).toBe(40);
            expect(image.left).toBe(192);
            const imageOverlay: HTMLElement = helper.getElementFromSpreadsheet('#' + image.id);
            expect(imageOverlay.style.backgroundImage).toBe('url("https://www.w3schools.com/images/w3schools_green.jpg")');
            done();
        });

        it('Resizing Image', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            const overlayObj: any = spreadsheet.serviceLocator.getService('shape') as Overlay;
            expect(overlayObj.originalWidth).toBe(400);
            expect(overlayObj.currentWidth).toBe(400);
            expect(overlayObj.originalHeight).toBe(300);
            expect(overlayObj.currenHeight).toBe(300);
            expect(overlayObj.isOverlayClicked).toBeFalsy();
            expect(overlayObj.isResizerClicked).toBeFalsy();
            const overlay: HTMLElement = helper.getElementFromSpreadsheet('.e-ss-overlay-active');
            const overlayHgtHanlde: HTMLElement = overlay.querySelector('.e-ss-overlay-b');
            let offset: DOMRect = overlayHgtHanlde.getBoundingClientRect() as DOMRect;
            helper.triggerMouseAction('mousedown', { x: offset.left, y: offset.top }, overlay, overlayHgtHanlde);
            expect(overlayObj.originalWidth).toBe(110);
            expect(overlayObj.currentWidth).toBe(110);
            expect(overlayObj.originalHeight).toBe(70);
            expect(overlayObj.currenHeight).toBe(70);
            expect(overlayObj.isOverlayClicked).toBeTruthy();
            expect(overlayObj.isResizerClicked).toBeTruthy();
            helper.triggerMouseAction('mousemove', { x: offset.left, y: offset.top + 30 }, overlay, overlayHgtHanlde);
            helper.triggerMouseAction('mouseup', { x: offset.left, y: offset.top + 30 }, document, overlayHgtHanlde);
            expect(overlayObj.originalWidth).toBe(110);
            expect(overlayObj.currentWidth).toBe(110);
            expect(overlayObj.originalHeight).toBe(100);
            expect(overlayObj.currenHeight).toBe(100);
            const image: ImageModel = spreadsheet.sheets[0].rows[2].cells[3].image[0];
            expect(image.height).toBe(100);
            expect(image.width).toBe(110);
            expect(image.top).toBe(40);
            expect(image.left).toBe(192);
            expect(overlay.style.height).toBe('100px');
            expect(overlay.style.width).toBe('110px');
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
            const image: ImageModel[] = helper.getInstance().sheets[0].rows[3].cells[5].image;
            expect(image.length).toBe(1);
            const imageId: string = image[0].id;
            helper.invoke('deleteImage', [imageId]);
            expect(image.length).toBe(0);
            expect(helper.getElementFromSpreadsheet('#' + imageId)).toBeNull();
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
            const image: ImageModel[] = helper.getInstance().sheets[0].rows[2].cells[2].image;
            expect(image.length).toBe(1);
            const imageId: string = image[0].id;
            expect(helper.getElementFromSpreadsheet('#' + imageId).style.height).toBe('300px');
            helper.getInstance().spreadsheetImageModule.deleteImage({ id: imageId });
            setTimeout(() => {
                expect(image.length).toBe(0);
                expect(helper.getElementFromSpreadsheet('#' + imageId)).toBeNull();
                done();
            });
        });
        it('Delete Image With Before Freezon Rows and Frozen Columns->', (done: Function) => {
            helper.getInstance().spreadsheetImageModule.createImageElement({options: { src: 'https://www.w3schools.com/images/w3schools_green.jpg'}, range: 'A1', isPublic: true });
            const image: ImageModel[] = helper.getInstance().sheets[0].rows[0].cells[0].image;
            expect(image.length).toBe(1);
            const imageId: string = image[0].id;
            expect(helper.getElementFromSpreadsheet('#' + imageId).style.height).toBe('300px');
            helper.getInstance().spreadsheetImageModule.deleteImage({ id: imageId });
            setTimeout(() => {
                expect(image.length).toBe(0);
                expect(helper.getElementFromSpreadsheet('#' + imageId)).toBeNull();
                done();
            });
        });
        it('Cancelling Delete Image in action begin event', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.actionBegin = (args: any): void => {
                    if (args.action === 'deleteImage') {  
                        args.args.eventArgs.cancel = true;
                    }
                }
            helper.getInstance().spreadsheetImageModule.createImageElement({options: { src: 'https://www.w3schools.com/images/w3schools_green.jpg'}, range: 'A1', isPublic: true });
            const image: ImageModel[] = helper.getInstance().sheets[0].rows[0].cells[0].image;
            expect(image.length).toBe(1);
            const imageId: string = image[0].id;
            helper.getInstance().spreadsheetImageModule.deleteImage({ id: imageId });
            setTimeout(() => {
                expect(image.length).toBe(1);
                expect(helper.getElementFromSpreadsheet('#' + imageId)).not.toBeNull();
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
            expect(helper.getInstance().sheets[0].rows[0].cells[8]).toBeUndefined();
            done();
        });
    });

    describe('Set image method testing', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Delete image with before frozen rows and frozen columns->', (done: Function) => {
            helper.getInstance().workbookImageModule.setImage({src: 'https://www.w3schools.com/images/w3schools_green.jpg', id: 'spreadsheet_overlay_picture_1', height: 400, width: 400, top: 20, left: 50 });
            setTimeout(() => {
                expect(helper.getElementFromSpreadsheet('#' + helper.id + '_overlay_picture_1')).toBeNull();
                done();
            });
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
            const image: ImageModel = helper.getInstance().sheets[0].rows[2].cells[3].image[0];
            expect(image.height).toBe(400);
            expect(image.width).toBe(400);
            expect(image.top).toBe(40);
            expect(image.left).toBe(192);
            expect(image.src).toBe('https://www.w3schools.com/images/w3schools_green.jpg');
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
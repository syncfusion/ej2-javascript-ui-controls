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
    describe('Clear All Actions', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet(
                { sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Apply styles', (done: Function) => {
            helper.invoke('selectRange', ['1:1']);
            setTimeout((): void => {
                helper.click('#' + helper.id + '_sorting');
                helper.click('#spreadsheet_sorting-popup ul li:nth-child(5)');
                expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filter-btn')).not.toBeNull();
                expect(helper.invoke('getCell', [0, 0]).textContent).toBe('Item Name');
                setTimeout((): void => {
                    helper.invoke('selectRange', ['A1:U1']);
                    helper.click('#' + helper.id + '_clear');
                    helper.click('#spreadsheet_clear-popup ul li:nth-child(1)');
                    expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filter-btn')).toBeNull();
                    expect(helper.invoke('getCell', [0, 0]).textContent).toBe('');
                    done();
                });
            });
        });
        it('Undo action', (done: Function) => {
            helper.getElement('#' + helper.id + '_undo').click();
            setTimeout((): void => {
                expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filter-btn')).not.toBeNull();
                expect(helper.invoke('getCell', [0, 0]).textContent).toBe('Item Name');
                done();
            });
        });
        it('Redo action', (done: Function) => {
            helper.getElement('#' + helper.id + '_redo').click();
            setTimeout((): void => {
                expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filter-btn')).toBeNull();
                expect(helper.invoke('getCell', [0, 0]).textContent).toBe('');
                done();
            });
        });
        it('Undo action-1', (done: Function) => {
            helper.getElement('#' + helper.id + '_undo').click();
            setTimeout((): void => {
                expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filter-btn')).not.toBeNull();
                expect(helper.invoke('getCell', [0, 0]).textContent).toBe('Item Name');
                helper.getElement('#' + helper.id + '_undo').click();
                setTimeout((): void => {
                    expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filter-btn')).toBeNull();
                    expect(helper.invoke('getCell', [0, 0]).textContent).toBe('Item Name');
                    helper.invoke('selectRange', ['A1']);
                    done();
                });
            });
        });
        it('Insert and remove image', (done: Function) => {
            helper.invoke('insertImage', [[{src:"https://www.w3schools.com/images/w3schools_green.jpg", width: 110, height: 70 }], 'A1']);
            setTimeout(() => {
                const image = helper.getInstance().sheets[0].rows[0].cells[0].image;
                expect(image.length).toBe(1);
                helper.getElement('#'+helper.id+'_clear').click();
                helper.getElement('#'+helper.id+'_clear-popup li:nth-child(1)').click();
                setTimeout(() => {
                    expect(image.length).toBe(0);
                    done();
                });
            });
        });
        it('Undo action-2', (done: Function) => {
            helper.getElement('#' + helper.id + '_undo').click();
            setTimeout((): void => {
                const image = helper.getInstance().sheets[0].rows[0].cells[0].image;
                expect(image.length).toBe(1);
                done();
            });
        });
        it('Redo action-1', (done: Function) => {
            helper.getElement('#' + helper.id + '_redo').click();
            setTimeout((): void => {
                const image = helper.getInstance().sheets[0].rows[0].cells[0].image;
                expect(image.length).toBe(0);
                done();
            });
        });
        it('Undo action-3', (done: Function) => {
            helper.getElement('#' + helper.id + '_undo').click();
            setTimeout((): void => {
                const image = helper.getInstance().sheets[0].rows[0].cells[0].image;
                expect(image.length).toBe(1);
                done();
            });
        });
        it('Insert chart with clear all option->', (done: Function) => {
            helper.invoke('insertChart', [[{ type: 'Column', range: 'A2:C5' }]]);
            const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
            expect(chart).not.toBeNull();
            setTimeout((): void => {
                helper.switchRibbonTab(1);
                helper.getElement('#' + helper.id + '_clear').click();
                helper.click('#' + helper.id + '_clear-popup ul li:nth-child(1)');
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).toBeNull();
                done();
            });
        });
        it('Undo action-4', (done: Function) => {
            helper.getElement('#' + helper.id + '_undo').click();
            setTimeout((): void => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                done();
            });
        });
        it('Redo action-2', (done: Function) => {
            helper.switchRibbonTab(1);
            helper.getElement('#' + helper.id + '_redo').click();
            setTimeout((): void => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).toBeNull();
                done();
            });
        });
    });

    describe('EJ2-931384->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Inserting image via public method after enabling readonly mode', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.setRangeReadOnly(true, 'A1:H11', 0);
            spreadsheet.insertImage([{ src: "https://www.w3schools.com/images/w3schools_green.jpg", width: 110, height: 70 }], 'D3');
            setTimeout(() => {
                expect(spreadsheet.sheets[0].rows[2].cells[3].isReadOnly).toBeTruthy();
                expect(spreadsheet.sheets[0].rows[2].cells[3].image).toBeUndefined();
                done();
            });
        });
        it('Inserting image through UI interaction enabling readonly mode', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.getInstance().spreadsheetImageModule.createImageElement({ options: { src: 'https://www.w3schools.com/images/w3schools_green.jpg' }, range: 'C3', isPublic: true, isAction: true });
            setTimeout(() => {
                helper.setAnimationToNone('.e-readonly-alert-dlg.e-dialog');
                expect(helper.getElement('.e-readonly-alert-dlg.e-dialog')).not.toBeNull();
                helper.click('.e-readonly-alert-dlg .e-footer-content button:nth-child(1)');
                setTimeout(() => {
                    expect(spreadsheet.sheets[0].rows[2].cells[2].isReadOnly).toBeTruthy();
                    expect(spreadsheet.sheets[0].rows[2].cells[2].image).toBeUndefined();
                    done();
                });
            });
        });
        it('Inserting an image with specific height and width after disabling readonly mode', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.setRangeReadOnly(false, 'A1:H11', 0);
            helper.getInstance().spreadsheetImageModule.createImageElement({ options: { src: 'https://www.w3schools.com/images/w3schools_green.jpg', width: 300, height: 200 }, range: 'C3', isPublic: true, isAction: true });
            setTimeout(() => {
                expect(spreadsheet.sheets[0].rows[2].cells[2].isReadOnly).toBeUndefined();
                expect(spreadsheet.sheets[0].rows[2].cells[2].image[0].height).toBe(200);
                expect(spreadsheet.sheets[0].rows[2].cells[2].image[0].width).toBe(300);
                done();
            });
        });
    });

    describe('EJ2-914956', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Script error occurs while performing undo action after deleting a sheet with an inserted image', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('duplicateSheet', [0]);
            setTimeout(() => {
                expect(spreadsheet.activeSheetIndex).toBe(1);
                expect(spreadsheet.sheets.length).toBe(2);
                expect(spreadsheet.sheets[1].name).toBe('Sheet1 (2)');
                helper.getInstance().spreadsheetImageModule.createImageElement({ options: { src: 'https://www.w3schools.com/images/w3schools_green.jpg', width: 75, height: 50 }, range: 'C3', isPublic: true, isAction: true });
                expect(spreadsheet.sheets[1].rows[2].cells[2].image[0].src).toBe('https://www.w3schools.com/images/w3schools_green.jpg');
                spreadsheet.delete(1, 1, 'Sheet');
                setTimeout(() => {
                    expect(spreadsheet.activeSheetIndex).toBe(0);
                    expect(spreadsheet.sheets.length).toBe(1);
                    expect(spreadsheet.sheets[0].name).toBe('Sheet1');
                    helper.click('#spreadsheet_undo');
                    expect(spreadsheet.activeSheetIndex).toBe(0);
                    expect(spreadsheet.sheets.length).toBe(1);
                    expect(spreadsheet.sheets[0].name).toBe('Sheet1');
                    helper.click('#spreadsheet_redo');
                    expect(spreadsheet.activeSheetIndex).toBe(0);
                    expect(spreadsheet.sheets.length).toBe(1);
                    expect(spreadsheet.sheets[0].name).toBe('Sheet1');
                    done();
                });
            });
        });
    });

    describe('CR-Issues ->', () => {
        describe('EJ2-70875 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{}, {}] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Image gets disappears when inserted and positioning it on the merged cell', (done: Function) => {
                const inst: Spreadsheet = helper.getInstance();
                helper.invoke('insertImage', [[{src:"https://www.w3schools.com/images/w3schools_green.jpg", width: 110, height: 70 }], 'C3']);
                helper.invoke('merge', ['B2:E7']);
                inst.activeSheetIndex = 1;
                inst.dataBind();
                setTimeout(function () {
                    expect(helper.getInstance().activeSheetIndex).toBe(1);
                    inst.activeSheetIndex = 0;
                    inst.dataBind();
                    setTimeout(function () {
                        expect(helper.getInstance().activeSheetIndex).toBe(0);
                        const image: ImageModel[] = helper.getInstance().sheets[0].rows[2].cells[2].image;
                        expect(image.length).toBe(1);
                        const imageId: string = image[0].id;
                        expect(helper.getElementFromSpreadsheet('#' + imageId)).not.toBeNull();
                        done();
                    });
                });
            });
        });
        describe('EJ2-871603, EJ2-914533 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{}, {}] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Script error occurs while deleting an image after inserting multiple images', (done: Function) => {
                helper.invoke('insertImage', [[{ src: "https://www.w3schools.com/images/w3schools_green.jpg", width: 110, height: 70 }], 'A1']);
                helper.invoke('insertImage', [[{ src: "https://www.w3schools.com/images/w3schools_green.jpg", width: 110, height: 70 }], 'A1']);
                helper.invoke('insertImage', [[{ src: "https://www.w3schools.com/images/w3schools_green.jpg", width: 110, height: 70 }], 'A1']);
                const imageArr: ImageModel[] = helper.getInstance().sheets[0].rows[0].cells[0].image;
                expect(imageArr.length).toBe(3);
                const imageId: string = imageArr[2].id;
                helper.invoke('deleteImage', [imageId]);
                expect(imageArr.length).toBe(2);
                expect(helper.getElementFromSpreadsheet('#' + imageId)).toBeNull();
                done();
            });
            it('Script Error occurs when inserting rows using insertRow method after inserting an image and freezing rows.', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                helper.invoke('insertImage', [[{ src: "https://www.w3schools.com/images/w3schools_green.jpg" }], 'A1']);
                const image: ImageModel = spreadsheet.sheets[spreadsheet.activeSheetIndex].rows[0].cells[0].image[0];
                expect(image.top && image.left).toBe(0);
                spreadsheet.insertRow(0, 1);
                setTimeout(() => {
                    helper.invoke('freezePanes', [5, 0]);
                })
                expect(image.top).toBe(40);
                expect(image.left).toBe(0);
                done();
            });
            it('Image is not inserted based on the given id in insertImage method.', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                helper.invoke('insertImage', [[{ src: "https://www.w3schools.com/images/w3schools_green.jpg", id: 'SelectImage'}], 'A1']);
                const image: ImageModel = spreadsheet.sheets[spreadsheet.activeSheetIndex].rows[0].cells[0].image[0];
                expect(image.id).toBe('SelectImage');
                done();
            });
        });
    });
});
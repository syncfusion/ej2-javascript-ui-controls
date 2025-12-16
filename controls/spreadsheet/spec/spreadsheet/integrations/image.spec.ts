import { SpreadsheetHelper } from "../util/spreadsheethelper.spec";
import { defaultData } from '../util/datasource.spec';
import { Overlay } from '../../../src/spreadsheet/services/index';
import { Spreadsheet } from '../../../src/spreadsheet/index';
import { EventHandler } from '@syncfusion/ej2-base';
import { CellModel ,ExtendedImageModel, ExtendedSheet, ImageModel, setImage } from '../../../src/index';

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

    describe('EJ2-967471, Migrate Image properties from the cell model to the sheet model during import ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Checking sheet images update to cells during import action', (done: Function) => {
            const spreadsheet: any = helper.getInstance();
            const sheet: ExtendedSheet = spreadsheet.sheets[0];
            const image: ExtendedImageModel[] = [
                { src: "https://www.w3schools.com/images/w3schools_green.jpg", address: [0,0] },
                { src: "https://www.w3schools.com/images/w3schools_green.jpg", address: [0,1] },
                { src: "https://www.w3schools.com/images/w3schools_green.jpg", address: [0,3] },
                { src: "https://www.w3schools.com/images/w3schools_green.jpg", address: [0,3] }]
            spreadsheet.setSheetPropertyOnMute(sheet, 'imageColl', image);
            spreadsheet.workbookImageModule.updateImagesFromSheet();
            expect(JSON.stringify(sheet.rows[0].cells[0].image[0])).toBe('{"src":"https://www.w3schools.com/images/w3schools_green.jpg"}');
            expect(JSON.stringify(sheet.rows[0].cells[1].image[0])).toBe('{"src":"https://www.w3schools.com/images/w3schools_green.jpg"}');
            expect(JSON.stringify(sheet.rows[0].cells[3].image[0])).toBe('{"src":"https://www.w3schools.com/images/w3schools_green.jpg"}');
            expect(JSON.stringify(sheet.rows[0].cells[3].image[1])).toBe('{"src":"https://www.w3schools.com/images/w3schools_green.jpg"}');
            expect(sheet.imageColl).toBeUndefined();
            done();
        });
    });
    describe('983493-Image Positioning Not Maintained Properly after set standart Height ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{
                    ranges: [{ dataSource: defaultData }],
                    columns: [{ width: 130 }, { width: 92 }, { width: 96 }],
                    standardHeight: 30,
                    rows: [{
                        index: 3,
                        cells: [
                            {
                                index: 1,
                                image: [<ExtendedImageModel>{ src: 'https://www.w3schools.com/images/w3schools_green.jpg', height: 150, width: 180, top: 62, left: 70, preservePos: true }],
                            }]
                    }]
                }]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Inserting image using data binding', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            const image: ExtendedImageModel = spreadsheet.sheets[0].rows[3].cells[1].image[0];
            expect(image.top).toBe(90);
            expect(image.left).toBe(130);
            const overlay: HTMLElement = helper.getElementFromSpreadsheet('#' + image.id);
            expect(overlay.style.top).not.toBe('62');
            expect(overlay.style.left).not.toBe('70');
            done();
        });
        it('Drag and drop chart from B4 to D8 cell', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            const image: HTMLElement = helper.getElement().querySelector('.e-ss-overlay');
            helper.triggerMouseAction('mousedown', { x: image.getBoundingClientRect().left + 1, y: image.getBoundingClientRect().top + 1 }, image, image);
            const targetCell = helper.invoke('getCell', [7, 3]);
            const targetRect = targetCell.getBoundingClientRect();
            helper.triggerMouseAction('mousemove', { x: targetRect.left + 10, y: targetRect.top + 10 }, image, image);
            helper.triggerMouseAction('mouseup', { x: targetRect.left + 10, y: targetRect.top + 10 }, document, image);
            setTimeout(() => {
                const cell: CellModel = spreadsheet.sheets[0].rows[7].cells[3];
                expect(spreadsheet.sheets[0].rows[3].cells[1].image.length).toBe(0);
                expect(cell.image).toBeDefined();
                expect(cell.image.length).toBe(1);
                done();
            });
        });
        it('Drag and drop chart from D8 to E12 cell', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            const image: HTMLElement = helper.getElement().querySelector('.e-ss-overlay');
            helper.triggerMouseAction('mousedown', { x: image.getBoundingClientRect().left + 1, y: image.getBoundingClientRect().top + 1 }, image, image);
            const targetCell = helper.invoke('getCell', [11, 4]);
            const targetRect = targetCell.getBoundingClientRect();
            helper.triggerMouseAction('mousemove', { x: targetRect.left + 10, y: targetRect.top + 10 }, image, image);
            helper.triggerMouseAction('mouseup', { x: targetRect.left + 10, y: targetRect.top + 10 }, document, image);
            setTimeout(() => {
                const cell: CellModel = spreadsheet.sheets[0].rows[11].cells[4];
                expect(spreadsheet.sheets[0].rows[7].cells[3].image.length).toBe(0);
                expect(cell.image).toBeDefined();
                expect(cell.image.length).toBe(1);
                done();
            });
        });
        it('Perform all undo operations in sequence', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            let cell: CellModel;
            helper.switchRibbonTab(1);
            helper.click('#spreadsheet_undo');
            cell = spreadsheet.sheets[0].rows[7].cells[3];
            expect(spreadsheet.sheets[0].rows[11].cells[4].image.length).toBe(0);
            expect(cell.image).toBeDefined();
            expect(cell.image.length).toBe(1);
            done();
        });
        it('Add chart and verify address and position update across sheet navigation', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            let cell: CellModel;
            helper.click('.e-add-sheet-tab');
            helper.click('.e-add-sheet-tab');
            setTimeout(() => {
                (document.querySelectorAll('.e-sheet-tab .e-toolbar-item')[0] as HTMLElement).click();
                helper.click('#spreadsheet_undo');
                cell = spreadsheet.sheets[0].rows[3].cells[1];
                expect(spreadsheet.sheets[0].rows[7].cells[3].image.length).toBe(0);
                expect(cell.image).toBeDefined();
                expect(cell.image.length).toBe(1);
                done();
            }, 500);
        });
        it('Perform all redo operations in sequence', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            let cell: CellModel;
            helper.switchRibbonTab(1);
            helper.click('#spreadsheet_redo');
            cell = spreadsheet.sheets[0].rows[7].cells[3];
            expect(spreadsheet.sheets[0].rows[3].cells[1].image.length).toBe(0);
            expect(cell.image).toBeDefined();
            expect(cell.image.length).toBe(1);
            helper.click('#spreadsheet_redo');
            cell = spreadsheet.sheets[0].rows[11].cells[4];
            expect(spreadsheet.sheets[0].rows[7].cells[3].image.length).toBe(0);
            expect(cell.image).toBeDefined();
            expect(cell.image.length).toBe(1);
            done();
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

    describe('EJ2-882967 Undo redo for multiple images is not working correctly->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{}] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Inserting images and pasting it in multiple cells', (done: Function) => {
            helper.getInstance().spreadsheetImageModule.createImageElement({ options: { src: 'https://www.w3schools.com/images/w3schools_green.jpg', width: 75, height: 50 }, range: 'C3', isPublic: true, isAction: true });
            setTimeout(function () {
                expect(helper.getInstance().sheets[0].rows[2].cells[2].image.length).toBe(1);
                helper.invoke('copy', ['C3:C3']).then(() => {
                    helper.invoke('paste', ['F3']);
                    expect(helper.getInstance().sheets[0].rows[2].cells[2].image[0].src).toBe('https://www.w3schools.com/images/w3schools_green.jpg');
                    expect(helper.getInstance().sheets[0].rows[2].cells[5].image[0].src).toBe('https://www.w3schools.com/images/w3schools_green.jpg');
                    done();
                });
            });
        });
        it('Duplicating the sheet and performing undo actions', (done: Function) => {
            helper.invoke('duplicateSheet', [0]);
            setTimeout(() => {
                helper.click('#spreadsheet_undo');
                helper.click('#spreadsheet_undo');
                expect(helper.getInstance().activeSheetIndex).toBe(1);
                expect(helper.getInstance().sheets[1].name).toBe('Sheet1 (2)');
                expect(helper.getInstance().sheets[0].rows[2].cells[2].image.length).toBe(0);
                expect(helper.getInstance().sheets[0].rows[2].cells[5].image.length).toBe(0);
                expect(helper.getInstance().sheets[1].rows[2].cells[2].image[0].src).toBe('https://www.w3schools.com/images/w3schools_green.jpg');
                expect(helper.getInstance().sheets[1].rows[2].cells[5].image[0].src).toBe('https://www.w3schools.com/images/w3schools_green.jpg');
                done();
            });
        });
        it('Checking the redo action', (done: Function) => {
            helper.click('#spreadsheet_redo');
            helper.click('#spreadsheet_redo');
            expect(helper.getInstance().activeSheetIndex).toBe(1);
            expect(helper.getInstance().sheets[1].name).toBe('Sheet1 (2)');
            expect(helper.getInstance().sheets[0].rows[2].cells[2].image[0].src).toBe('https://www.w3schools.com/images/w3schools_green.jpg');
            expect(helper.getInstance().sheets[0].rows[2].cells[5].image[0].src).toBe('https://www.w3schools.com/images/w3schools_green.jpg');
            expect(helper.getInstance().sheets[1].rows[2].cells[2].image[0].src).toBe('https://www.w3schools.com/images/w3schools_green.jpg');
            expect(helper.getInstance().sheets[1].rows[2].cells[5].image[0].src).toBe('https://www.w3schools.com/images/w3schools_green.jpg');
            done();
        });
    });

    describe('EJ2-958393 ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Cell data not exported properly after image insertion', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            expect(spreadsheet.sheets[0].rows[2].cells[3].value.toString()).toBe('20');
            helper.invoke('insertImage', [[{ src: "https://www.w3schools.com/images/w3schools_green.jpg", width: 110, height: 70 }], 'D3']);
            const image: ImageModel = spreadsheet.sheets[0].rows[2].cells[3].image[0];
            const imageOverlay: HTMLElement = helper.getElementFromSpreadsheet('#' + image.id);
            expect(imageOverlay.style.backgroundImage).toBe('url("https://www.w3schools.com/images/w3schools_green.jpg")');
            expect(spreadsheet.sheets[0].rows[2].cells[3].value.toString()).toBe('20');
            done();
        });
    });

    describe('EJ2-882964 ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{}] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Image not maintained properly in duplicate sheet', (done: Function) => {
            helper.getInstance().spreadsheetImageModule.createImageElement({ options: { src: 'https://www.w3schools.com/images/w3schools_green.jpg', width: 110, height: 70 }, range: 'D3', isPublic: true, isAction: true });
            expect(helper.getInstance().sheets[0].rows[2].cells[3].image.length).toBe(1);
            helper.invoke('duplicateSheet', [0]);
            setTimeout(() => {
                expect(helper.getInstance().activeSheetIndex).toBe(1);
                expect(helper.getInstance().sheets[1].name).toBe('Sheet1 (2)');
                expect(helper.getInstance().sheets[1].rows[2].cells[3].image[0].src).toBe('https://www.w3schools.com/images/w3schools_green.jpg');
                const spreadsheet: Spreadsheet = helper.getInstance();
                const overlayObj: any = spreadsheet.serviceLocator.getService('shape') as Overlay;
                expect(overlayObj.currentWidth).toBe(400);
                expect(overlayObj.currenHeight).toBe(300);
                expect(overlayObj.isOverlayClicked).toBeFalsy();
                expect(overlayObj.isResizerClicked).toBeFalsy();
                helper.invoke('selectImage');
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
                const image: ImageModel = spreadsheet.sheets[1].rows[2].cells[3].image[0];
                expect(image.height).toBe(100);
                expect(image.width).toBe(110);
                expect(image.top).toBe(40);
                expect(image.left).toBe(192);
                expect(overlay.style.height).toBe('100px');
                expect(overlay.style.width).toBe('110px');
                done();
            });
        });
        it('Performing undo and redo action after reszing the image in duplicate sheet', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            const overlay: HTMLElement = helper.getElementFromSpreadsheet('.e-ss-overlay-active');
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                const image: ImageModel = spreadsheet.sheets[1].rows[2].cells[3].image[0];
                expect(image.height).toBe(70);
                expect(image.width).toBe(110);
                expect(overlay.style.height).toBe('70px');
                expect(overlay.style.width).toBe('110px');
                helper.click('#spreadsheet_redo');
                setTimeout(() => {
                    expect(image.height).toBe(100);
                    expect(image.width).toBe(110);
                    expect(overlay.style.height).toBe('100px');
                    expect(overlay.style.width).toBe('110px');
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
        describe('EJ2-947278 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ rows: [{ cells: [{ image: [{ id: 'Chart-13', src: "https://www.w3schools.com/images/w3schools_green.jpg", width: 481, height: 289, top: 51, left: 44 }] }] }] }, {}]
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Image positioning not maintained during spreadsheet resizings', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[0].cells[0].image.length).toBe(0);
                expect(spreadsheet.sheets[0].rows[2].cells[0].image.length).toBe(1);
                spreadsheet.resize();
                expect(spreadsheet.sheets[0].rows[0].cells[0].image.length).toBe(0);
                expect(spreadsheet.sheets[0].rows[2].cells[0].image.length).toBe(1);
                const imageArr: ImageModel = spreadsheet.sheets[0].rows[2].cells[0].image[0];
                expect(imageArr.height).toBe(289);
                expect(imageArr.width).toBe(481);
                expect(imageArr.top).toBe(51);
                expect(imageArr.left).toBe(44);
                done();
            });
            it('Checking with public method for spreadsheet resize', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                helper.invoke('insertImage', [[{ src: "https://www.w3schools.com/images/w3schools_green.jpg", width: 481, height: 289, top: 65, left: 48 }], 'A1']);
                expect(spreadsheet.sheets[0].rows[0].cells[0].image.length).toBe(0);
                expect(spreadsheet.sheets[0].rows[3].cells[0].image.length).toBe(1);
                spreadsheet.resize();
                expect(spreadsheet.sheets[0].rows[0].cells[0].image.length).toBe(0);
                expect(spreadsheet.sheets[0].rows[3].cells[0].image.length).toBe(1);
                const imageArr: ImageModel = spreadsheet.sheets[0].rows[3].cells[0].image[0];
                expect(imageArr.height).toBe(289);
                expect(imageArr.width).toBe(481);
                expect(imageArr.top).toBe(65);
                expect(imageArr.left).toBe(48);
                done();
            });
            it('Checking isImport property in image model->', (done: Function) => {
                helper.getInstance().spreadsheetImageModule.createImageElement({ options: { src: 'https://www.w3schools.com/images/w3schools_green.jpg', preservePos: true, top: 980, id: 'Chart1' }, range: 'C50' });
                expect(helper.getInstance().sheets[0].rows[49].cells[2].image.length).toBe(1);
                helper.getInstance().notify(setImage, { options: [{ src: 'https://www.w3schools.com/images/w3schools_green.jpg', top: 980, id: 'Chart1' }], range: 'C50', isPositionChanged: true });
                helper.getInstance().spreadsheetImageModule.createImageElement({ options: { src: 'https://www.w3schools.com/images/w3schools_green.jpg', preservePos: true, left: 200, id: 'Chart2' }, range: 'C51' });
                expect(helper.getInstance().sheets[0].rows[50].cells[2].image.length).toBe(1);
                done();
            });
        });
    });

    describe('Spreadsheet Image properties check when allowimage is false', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet(
                { sheets: [{ ranges: [{ dataSource: defaultData }], rows: [{ cells: [{ image: [{ src: 'https://www.w3schools.com/images/w3schools_green.jpg', width: 110, height: 70 }] }] }] }], allowImage: false },
                done
            );
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('inserting image through cell binding and public method', (done: Function) => {
            const cell = helper.getInstance().sheets[0].rows[0].cells[0];
            expect(cell.image).not.toBeNull();
            const imageOverlay: HTMLElement = helper.getElementFromSpreadsheet('#' + cell.image[0].id);
            expect(imageOverlay).toBeNull();
            helper.invoke('insertImage', [[{ src: "https://www.w3schools.com/images/w3schools_green.jpg", width: 110, height: 70 }], 'A2']);
            const methodCell = helper.getInstance().sheets[0].rows[1].cells[0];
            expect(methodCell.image).toBeUndefined();
            done();
        });
        it('should check if parent of image button contains overlay class', () => {
            helper.switchRibbonTab(2);
            const imagebtn = helper.getElement('#spreadsheet_image');
            expect(imagebtn).not.toBeNull();
            const parent = imagebtn.parentElement;
            expect(parent).not.toBeNull();
            expect(parent.classList.contains('e-overlay')).toBe(true);
        });
    });
});
import { ExtendedImageModel, ExtendedSheet, getRangeIndexes, ImageModel } from '../common/index';
import { CellModel, SheetModel, getCell, setCell, getSheetIndex, Workbook, getSheet } from '../base/index';
import { importModelUpdate, setImage } from '../common/event';
import { isUndefined } from '@syncfusion/ej2-base';
/**
 * Specifies image.
 */
export class WorkbookImage {
    private parent: Workbook;
    constructor(parent: Workbook) {
        this.parent = parent;
        this.addEventListener();
    }

    private setImage(args: { options: ImageModel[], range: string, isPositionChanged?: boolean, isElementRemoved?: boolean }): boolean {
        const lastIndex: number = args.range ? args.range.lastIndexOf('!') : -1;
        const imgRange: string = args.range ? (lastIndex > -1) ? args.range.substring(lastIndex + 1) : args.range
            : this.parent.getActiveSheet().selectedRange;
        const sheetIdx: number = (args.range && lastIndex > -1) ?
            getSheetIndex(this.parent, args.range.substring(0, lastIndex)) : this.parent.activeSheetIndex;
        const indexes: number[] = getRangeIndexes(imgRange);
        const sheet: SheetModel = isUndefined(sheetIdx) ? this.parent.getActiveSheet() : getSheet(this.parent, sheetIdx);
        const cell: CellModel = getCell(indexes[0], indexes[1], sheet);
        let oldImgData: ImageModel[];
        const imgData: ImageModel[] = args.options;
        if (cell && cell.image) {
            oldImgData = cell.image;
            if (args.isPositionChanged) {
                for (let i: number = 0; i < oldImgData.length; i++) {
                    for (let j: number = 0; j < imgData.length; j++) {
                        oldImgData[i as number] = imgData[j as number];
                        if (document.getElementById(imgData[j as number].id)) {
                            args.isElementRemoved = true;
                            document.getElementById(imgData[j as number].id).remove();
                        }
                    }
                }
            } else {
                oldImgData = cell.image;
                for (let i: number = 0; i < imgData.length; i++) {
                    oldImgData.push(imgData[i as number]);
                }
            }
        }
        setCell(indexes[0], indexes[1], sheet, { image: (cell && cell.image) ? oldImgData : imgData }, true);
        return args.isElementRemoved;
    }

    private updateImagesFromSheet(): void {
        this.parent.sheets.forEach((sheet: ExtendedSheet) => {
            if (sheet.imageColl) {
                sheet.imageColl.forEach((model: ExtendedImageModel) => {
                    const imageModel: ExtendedImageModel = model;
                    const indexes: number[] = imageModel.address;
                    delete imageModel.address;
                    const cell: CellModel = getCell(indexes[0], indexes[1], sheet);
                    if (cell && cell.image) {
                        cell.image.push(imageModel);
                    } else {
                        setCell(indexes[0], indexes[1], sheet, { image: [imageModel] }, true);
                    }
                });
                delete sheet.imageColl;
            }
        });
    }

    /**
     * Adding event listener for number format.
     *
     * @returns {void} - Adding event listener for number format.
     */
    private addEventListener(): void {
        this.parent.on(setImage, this.setImage, this);
        this.parent.on(importModelUpdate, this.updateImagesFromSheet, this);
    }

    /**
     * Removing event listener for number format.
     *
     * @returns {void}
     */
    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(setImage, this.setImage);
            this.parent.off(importModelUpdate, this.updateImagesFromSheet);
        }
    }

    /**
     * To Remove the event listeners.
     *
     * @returns {void} - To Remove the event listeners.
     */
    public destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }

    /**
     * Get the workbook number format module name.
     *
     * @returns {string} - Get the module name.
     */
    public getModuleName(): string {
        return 'workbookImage';
    }
}


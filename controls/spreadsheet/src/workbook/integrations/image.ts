import { getRangeIndexes, ImageModel } from '../common/index';
import { CellModel, SheetModel, getCell, setCell, getSheetIndex, Workbook } from '../base/index';
import { setImage } from '../common/event';
/**
 * Specifies image.
 */
export class WorkbookImage {
    private parent: Workbook;
    constructor(parent: Workbook) {
        this.parent = parent;
        this.addEventListener();
    }

    private setImage(args: { options: ImageModel[], range: string }): void {
        let imgRange: string = args.range ? (args.range.indexOf('!') > 0) ? args.range.split('!')[1] : args.range.split('!')[0]
            : this.parent.getActiveSheet().selectedRange;
        let sheetIdx: number = (args.range && args.range.indexOf('!') > 0) ?
            getSheetIndex(this.parent, args.range.split('!')[0]) : this.parent.activeSheetIndex;
        let indexes: number[] = getRangeIndexes(imgRange);
        let sheet: SheetModel = sheetIdx ? this.parent.sheets[sheetIdx] : this.parent.getActiveSheet();
        let cell: CellModel = getCell(indexes[0], indexes[1], sheet);
        let oldImgData: ImageModel[];
        let imgData: ImageModel[] = args.options;
        if (cell && cell.image) {
            oldImgData = cell.image;
            for (let i: number = 0; i < imgData.length; i++) {
                oldImgData.push(imgData[i]);
            }
        }
        setCell(indexes[0], indexes[1], sheet, { image: (cell && cell.image) ? oldImgData : imgData }, true);
    }

    /**
     * Adding event listener for number format.
     */
    private addEventListener(): void {
        this.parent.on(setImage, this.setImage, this);
    }

    /**
     * Removing event listener for number format.
     */
    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(setImage, this.setImage);
        }
    }

    /**
     * To Remove the event listeners.
     */
    public destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }

    /**
     * Get the workbook number format module name.
     */
    public getModuleName(): string {
        return 'workbookImage';
    }
}


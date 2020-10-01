/**
 * Open properties.
 */
import { Spreadsheet } from '../base/index';
import { getColIdxFromClientX, createImageElement, deleteImage, refreshImagePosition } from '../common/event';
import { insertImage, refreshImgElem, refreshImgCellObj, getRowIdxFromClientY, } from '../common/event';
import { Overlay, Dialog } from '../services/index';
import { OpenOptions, overlay, dialog, BeforeImageData, BeforeImageRefreshData } from '../common/index';
import { removeClass, L10n } from '@syncfusion/ej2-base';
import { ImageModel, CellModel, getCell, setCell, getSheetIndex } from '../../workbook/index';
import { getRangeIndexes, SheetModel, setImage } from '../../workbook/index';

export class SpreadsheetImage {
    private parent: Spreadsheet;
    private pictureCount: number = 1;
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
        this.renderImageUpload();
    }

    /**
     * Adding event listener for success and failure 
     */
    private addEventListener(): void {
        this.parent.on(insertImage, this.insertImage, this);
        this.parent.on(refreshImgElem, this.refreshImgElem, this);
        this.parent.on(refreshImgCellObj, this.refreshImgCellObj, this);
        this.parent.on(createImageElement, this.createImageElement, this);
        this.parent.on(deleteImage, this.deleteImage, this);
        this.parent.on(refreshImagePosition, this.refreshInsDelImagePosition, this);
    }

    /**
     * Rendering upload component for importing images.
     */
    private renderImageUpload(): void {
        let uploadID: string = this.parent.element.id + '_imageUpload';
        this.parent.element.appendChild(this.parent.createElement('input', {
            id: uploadID,
            attrs: { type: 'file', accept: '.image, .jpg, .png, .gif ,jpeg', name: 'fileUpload' }
        }));
        let uploadBox: HTMLElement = document.getElementById(uploadID);
        uploadBox.onchange = this.imageSelect.bind(this);
        uploadBox.style.display = 'none';
    }
    /**
     * Process after select the excel and image file.
     * @param {Event} args - File select native event.
     */
    private imageSelect(args: Event): void {
        /* tslint:disable-next-line:no-any */
        let filesData: FileList = (args.target as any).files[0];
        if (filesData && filesData.length < 1) {
            return;
        }
        let impArgs: OpenOptions = {
            file: filesData
        };
        /* tslint:disable-next-line:no-any */
        if ((impArgs.file as any).type.indexOf('image') === 0) {
            this.insertImage(impArgs);
        } else {
            (this.parent.serviceLocator.getService(dialog) as Dialog).show({
                content: (this.parent.serviceLocator.getService('spreadsheetLocale') as L10n)
                    .getConstant('UnsupportedFile'),
                width: '300'
            });
        }

        (document.getElementById(this.parent.element.id + '_imageUpload') as HTMLInputElement).value = '';
    }

    /**
     * Removing event listener for success and failure 
     */
    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(insertImage, this.insertImage);
            this.parent.off(refreshImgCellObj, this.refreshImgCellObj);
            this.parent.off(createImageElement, this.createImageElement);
            this.parent.off(deleteImage, this.deleteImage);
            this.parent.off(refreshImagePosition, this.refreshInsDelImagePosition);

        }
    }
    // tslint:disable
    private insertImage(args: OpenOptions, range?: string): void {
        this.binaryStringVal(args).then(
            src => this.createImageElement({ options: { src: src as string }, range: range, isPublic: true })
        );
    }
    private binaryStringVal(args: any): Promise<string | ArrayBuffer> {
        return new Promise((resolve, reject) => {
            let reader: FileReader = new FileReader();
            reader.readAsDataURL(args.file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
    // tslint:enable
    private createImageElement(args: {
        options: {
            src: string, imageId?: string, height?: number,
            width?: number, top?: number, left?: number
        }, range: string, isPublic?: boolean, isUndoRedo?: boolean
    }): void {
        let range: string = args.range ? (args.range.indexOf('!') > 0) ? args.range.split('!')[1] : args.range.split('!')[0]
            : this.parent.getActiveSheet().selectedRange;
        let sheetIndex: number = (args.range && args.range.indexOf('!') > 0) ?
            getSheetIndex(this.parent, args.range.split('!')[0]) : this.parent.activeSheetIndex;

        let overlayObj: Overlay = this.parent.serviceLocator.getService(overlay) as Overlay;
        let id: string = args.options.imageId ? args.options.imageId : this.parent.element.id + '_overlay_picture_' + this.pictureCount;
        let indexes: number[] = getRangeIndexes(range);
        let sheet: SheetModel = sheetIndex ? this.parent.sheets[sheetIndex] : this.parent.getActiveSheet();
        if (document.getElementById(id)) {
            return;
        }
        let eventArgs: BeforeImageData = {
            requestType: 'beforeInsertImage', range: sheet.name + '!' + range,
            imageData: args.options.src, sheetIndex: sheetIndex
        };
        if (args.isPublic) {
            this.parent.notify('actionBegin', { eventArgs: eventArgs, action: 'beforeInsertImage' });
        }
        if (eventArgs.cancel) { return; }
        let element: HTMLElement = overlayObj.insertOverlayElement(id, range, sheetIndex);
        element.style.backgroundImage = 'url(\'' + args.options.src + '\')';
        if (args.options.height || args.options.left) {
            element.style.height = args.options.height + 'px';
            element.style.width = args.options.width + 'px';
            element.style.top = args.options.top + 'px';
            element.style.left = args.options.left + 'px';
        }
        if (!args.options.imageId) {
            this.pictureCount++;
        }
        let imgData: ImageModel = {
            src: args.options.src, id: id, height: parseFloat(element.style.height.replace('px', '')),
            width: parseFloat(element.style.width.replace('px', '')), top: parseFloat(element.style.top.replace('px', '')),
            left: parseFloat(element.style.left.replace('px', ''))
        };
        this.parent.setUsedRange(indexes[0], indexes[1]);
        if (args.isPublic || args.isUndoRedo) {
            this.parent.notify(setImage, { options: [imgData], range: sheet.name + '!' + range });
        }
        let currCell: CellModel = getCell(indexes[0], indexes[1], sheet);
        if (!currCell.image[currCell.image.length - 1].id) {
            currCell.image[currCell.image.length - 1].id = imgData.id;
        }
        eventArgs = {
            requestType: 'insertImage', range: sheet.name + '!' + range, imageHeight: args.options.height ? args.options.height : 300,
            imageWidth: args.options.width ? args.options.width : 400, imageData: args.options.src, id: id, sheetIndex: sheetIndex
        };
        if (!args.isUndoRedo && args.isPublic) {
            this.parent.notify('actionComplete', { eventArgs: eventArgs, action: 'insertImage' });
        }
    }

    private refreshImgElem(): void {
        let overlayElem: HTMLElement = document.getElementsByClassName('e-ss-overlay-active')[0] as HTMLElement;
        if (overlayElem) {
            removeClass([overlayElem], 'e-ss-overlay-active');
        }
    }

    private refreshInsDelImagePosition(args: {
        rowIdx: number, colIdx: number,
        sheetIdx: number, count: number, type: string, status: string
    }): void {
        let count: number = args.count;
        let sheetIdx: number = args.sheetIdx;
        let sheet: SheetModel = this.parent.sheets[sheetIdx];
        let pictureElements: HTMLElement;
        let currCellObj: CellModel = getCell(args.rowIdx, args.colIdx, sheet);
        let imageLen: number = currCellObj.image.length;
        let top: number; let left: number;
        for (let i: number = 0; i < imageLen; i++) {
            pictureElements = document.getElementById(currCellObj.image[i].id);
            top = (args.type === 'Row') ? (args.status === 'insert') ? currCellObj.image[i].top + (count * 20) :
                currCellObj.image[i].top - (count * 20) : currCellObj.image[i].top;
            left = (args.type === 'Column') ? (args.status === 'insert') ? currCellObj.image[i].left + (count * 64) :
                currCellObj.image[i].left - (count * 64) : currCellObj.image[i].left;
            currCellObj.image[i].top = top;
            currCellObj.image[i].left = left;
            pictureElements.style.top = top + 'px';
            pictureElements.style.left = left + 'px';
        }


    }

    private refreshImgCellObj(args: BeforeImageRefreshData): void {
        let prevRowIdx: { clientY: number, isImage: boolean } = { clientY: args.prevTop, isImage: true };
        this.parent.notify(getRowIdxFromClientY, prevRowIdx);
        let currRowIdx: { clientY: number, isImage: boolean } = { clientY: args.currentTop, isImage: true };
        this.parent.notify(getRowIdxFromClientY, currRowIdx);
        let prevColIdx: { clientX: number, isImage: boolean } = { clientX: args.prevLeft, isImage: true };
        this.parent.notify(getColIdxFromClientX, prevColIdx);
        let currColIdx: { clientX: number, isImage: boolean } = { clientX: args.currentLeft, isImage: true };
        this.parent.notify(getColIdxFromClientX, currColIdx);
        let sheet: SheetModel = this.parent.sheets[this.parent.activeSheetIndex];
        let prevCellObj: CellModel = getCell(prevRowIdx.clientY, prevColIdx.clientX, sheet);
        let currCellObj: CellModel = getCell(currRowIdx.clientY, currColIdx.clientX, sheet);
        let prevCellImg: object[] = prevCellObj ? prevCellObj.image : [];
        let prevImgObj: ImageModel;
        let currImgObj: ImageModel[];
        let prevCellImgLen: number = (prevCellImg && prevCellImg.length) ? prevCellImg.length : 0;
        if (prevCellObj && prevCellObj.image) {
            for (let i: number = 0; i < prevCellImgLen; i++) {
                if ((prevCellImg[i] as ImageModel).id === args.id) {
                    prevImgObj = prevCellImg[i];
                    prevImgObj.height = args.currentHeight;
                    prevImgObj.width = args.currentWidth;
                    prevImgObj.top = args.currentTop;
                    prevImgObj.left = args.currentLeft;
                    prevCellImg.splice(i, 1);
                }
            }
            if (currCellObj && currCellObj.image) {
                currImgObj = currCellObj.image;
                if (prevImgObj) {
                    currImgObj.push(prevImgObj);
                }
            }
            (currImgObj) ? setCell(currRowIdx.clientY, currColIdx.clientX, sheet, { image: currImgObj }, true) :
                setCell(currRowIdx.clientY, currColIdx.clientX, sheet, { image: [prevImgObj] }, true);
            if (args.requestType === 'imageRefresh' && !args.isUndoRedo) {
                let eventArgs: BeforeImageRefreshData = {
                    requestType: 'imageRefresh', currentRowIdx: currRowIdx.clientY, currentColIdx: currColIdx.clientX,
                    prevRowIdx: prevRowIdx.clientY, prevColIdx: prevColIdx.clientX, prevTop: args.prevTop, prevLeft: args.prevLeft,
                    currentTop: args.currentTop, currentLeft: args.currentLeft, currentHeight: args.currentHeight,
                    currentWidth: args.currentWidth, prevHeight: args.prevHeight, prevWidth: args.prevWidth,
                    id: args.id, sheetIdx: this.parent.activeSheetIndex
                };
                this.parent.notify('actionComplete', { eventArgs: eventArgs, action: 'imageRefresh' });
            }
        }
    }

    public deleteImage(args: { id: string, range?: string }): void {
        let sheet: SheetModel;
        let pictureElements: HTMLElement = document.getElementById(args.id);
        let rowIdx: number; let colIdx: number;
        let cellObj: CellModel;
        let prevCellImg: object[];
        let imgLength: number;
        if (pictureElements) {
            let imgTop: { clientY: number, isImage: boolean } = { clientY: pictureElements.offsetTop, isImage: true };
            this.parent.notify(getRowIdxFromClientY, imgTop);
            let imgleft: { clientX: number, isImage: boolean } = { clientX: pictureElements.offsetLeft, isImage: true };
            this.parent.notify(getColIdxFromClientX, imgleft);
            document.getElementById(args.id).remove();
            rowIdx = imgTop.clientY; colIdx = imgleft.clientX;
            sheet = this.parent.sheets[this.parent.activeSheetIndex];
        } else {
            let rangeVal: string = args.range ? args.range.indexOf('!') > 0 ? args.range.split('!')[1] : args.range.split('!')[0] :
                this.parent.getActiveSheet().selectedRange;
            let sheetIndex: number = args.range && args.range.indexOf('!') > 0 ? getSheetIndex(this.parent, args.range.split('!')[0]) :
                this.parent.activeSheetIndex;
            let index: number[] = getRangeIndexes(rangeVal);
            rowIdx = index[0]; colIdx = index[1];
            sheet = this.parent.sheets[sheetIndex];
        }
        cellObj = getCell(rowIdx, colIdx, sheet);
        prevCellImg = cellObj.image;
        imgLength = prevCellImg.length;
        for (let i: number = 0; i < imgLength; i++) {
            if ((prevCellImg[i] as ImageModel).id === args.id) {
                prevCellImg.splice(i, 1);
            }
        }
        setCell(rowIdx, colIdx, sheet, { image: prevCellImg }, true);
    }

    /**
     * To Remove the event listeners.
     */
    public destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }

    /**
     * Get the sheet picture module name.
     */
    public getModuleName(): string {
        return 'spreadsheetImage';
    }
}


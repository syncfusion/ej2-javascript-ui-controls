/**
 * Open properties.
 */
import { Spreadsheet } from '../base/index';
import { getColIdxFromClientX, createImageElement, deleteImage, refreshImagePosition, completeAction, readonlyAlert } from '../common/event';
import { insertImage, refreshImgCellObj, getRowIdxFromClientY } from '../common/event';
import { Overlay, Dialog } from '../services/index';
import { overlay, dialog, BeforeImageData, BeforeImageRefreshData } from '../common/index';
import { L10n, isUndefined, getUniqueID, isNullOrUndefined } from '@syncfusion/ej2-base';
import { ImageModel, CellModel, getCell, setCell, getSheetIndex, getRowsHeight, getColumnsWidth, Workbook, beginAction, getCellAddress, getSheet, isReadOnlyCells, getRangeAddress, addDPRValue } from '../../workbook/index';
import { getRangeIndexes, SheetModel, setImage } from '../../workbook/index';

export class SpreadsheetImage {
    private parent: Spreadsheet;
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
        this.renderImageUpload();
    }

    /**
     * Adding event listener for success and failure
     *
     * @returns {void} - Adding event listener for success and failure
     */
    private addEventListener(): void {
        this.parent.on(insertImage, this.insertImage, this);
        this.parent.on(refreshImgCellObj, this.refreshImgCellObj, this);
        this.parent.on(createImageElement, this.createImageElement, this);
        this.parent.on(deleteImage, this.deleteImage, this);
        this.parent.on(refreshImagePosition, this.refreshInsDelImagePosition, this);
    }

    /**
     * Rendering upload component for importing images.
     *
     * @returns {void} - Rendering upload component for importing images.
     */
    private renderImageUpload(): void {
        const uploadBox: HTMLElement = this.parent.createElement('input', {
            id: this.parent.element.id + '_imageUpload',
            attrs: { type: 'file', accept: '.image, .jpg, .png, .gif ,jpeg', name: 'fileUpload' }
        });
        uploadBox.style.display = 'none';
        this.parent.element.appendChild(uploadBox);
        uploadBox.onchange = this.imageSelect.bind(this);
    }
    /**
     * Process after select the excel and image file.
     *
     * @param {Event} args - File select native event.
     * @returns {void} - Process after select the excel and image file.
     */
    private imageSelect(args: Event): void {
        const file: File = (<HTMLInputElement>args.target).files[0];
        if (!file) { return; }
        if (file.type.includes('image')) {
            this.insertImage({ file: file, isAction: true });
        } else {
            (this.parent.serviceLocator.getService(dialog) as Dialog).show(
                { content: (this.parent.serviceLocator.getService('spreadsheetLocale') as L10n).getConstant('UnsupportedFile'),
                    width: '300' });
        }
        (<HTMLInputElement>args.target).value = '';
    }

    /**
     * Removing event listener for success and failure
     *
     * @returns {void} - Removing event listener for success and failure
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
    /* eslint-disable */
    private insertImage(args: { file: File, isAction?: boolean }, range?: string): void {
        this.binaryStringVal(args).then(
            src => this.createImageElement({ options: { src: src as string }, range: range, isPublic: true, isAction: args.isAction })
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
    /* eslint-enable */
    private createImageElement(args: {
        options: { src: string, id?: string, height?: number, width?: number, top?: number, left?: number, preservePos?: boolean },
        range?: string, isPublic?: boolean, isUndoRedo?: boolean, isAction?: boolean
    }): void {
        const lastIndex: number = args.range ? args.range.lastIndexOf('!') : 0;
        let range: string = args.range ? (lastIndex > 0) ? args.range.substring(lastIndex + 1) : args.range
            : this.parent.getActiveSheet().selectedRange;
        const sheetIndex: number = (args.range && lastIndex > 0) ?
            getSheetIndex(this.parent as Workbook, args.range.substring(0, lastIndex)) : this.parent.activeSheetIndex;
        const overlayObj: Overlay = this.parent.serviceLocator.getService(overlay) as Overlay;
        const id: string = args.options.id ? args.options.id : getUniqueID(this.parent.element.id + '_overlay_picture_');
        const indexes: number[] = getRangeIndexes(range);
        const sheet: SheetModel = isUndefined(sheetIndex) && !args.isUndoRedo ? this.parent.getActiveSheet() :
            this.parent.sheets[sheetIndex as number];
        if (!sheet || this.parent.element.querySelector(`#${id}`)) {
            return;
        }
        if (args.isPublic && isReadOnlyCells(this.parent, indexes)) {
            if (args.isAction) {
                this.parent.notify(readonlyAlert, null);
            }
            return;
        }
        let eventArgs: BeforeImageData = { requestType: 'beforeInsertImage', range: sheet.name + '!' + range, imageData: args.options.src,
            sheetIndex: sheetIndex };
        if (args.isPublic) {
            this.parent.notify('actionBegin', { eventArgs: eventArgs, action: 'beforeInsertImage' });
        }
        if (eventArgs.cancel) { return; }
        let overlayProps: { element: HTMLElement, top: number, left: number } = overlayObj.insertOverlayElement(id, range, sheetIndex);
        overlayProps.element.style.backgroundImage = 'url(\'' + args.options.src + '\')';
        if (args.options.height || args.options.left) {
            overlayProps.element.style.height = args.options.height + 'px'; overlayProps.element.style.width = args.options.width + 'px';
            if (!isNullOrUndefined(args.options.top)) {
                overlayProps.element.style.top = Number(addDPRValue(args.options.top).toFixed(2)) + 'px';
            }
            if (!isNullOrUndefined(args.options.left)) {
                overlayProps.element.style.left = Number(addDPRValue(args.options.left).toFixed(2)) + 'px';
            }
            if (!args.options.preservePos && !isNullOrUndefined(args.options.top) && !isNullOrUndefined(args.options.left)) {
                const imgTop: { clientY: number, isImage?: boolean } = { clientY: args.options.top, isImage: true };
                const imgleft: { clientX: number, isImage?: boolean } = { clientX: args.options.left, isImage: true };
                this.parent.notify(getRowIdxFromClientY, imgTop);
                this.parent.notify(getColIdxFromClientX, imgleft);
                const rowIdx: number = imgTop.clientY; const colIdx: number = imgleft.clientX;
                if (indexes[0] !== rowIdx || indexes[1] !== colIdx) {
                    const eventArgs: BeforeImageRefreshData = {
                        prevTop: args.options.top, prevLeft: args.options.left, prevRowIdx: indexes[0],
                        prevColIdx: indexes[1], prevHeight: args.options.height, prevWidth: args.options.width,
                        currentTop: args.options.top, currentLeft: args.options.left, currentRowIdx: rowIdx,
                        currentColIdx: colIdx, currentHeight: args.options.height, currentWidth: args.options.width,
                        id: args.options.id, requestType: 'imagePositionRefresh'
                    };
                    this.refreshImgCellObj(eventArgs);
                    indexes[0] = rowIdx; indexes[1] = colIdx;
                    range = getRangeAddress([rowIdx, colIdx]);
                }
            }
        }
        if (sheet.frozenRows || sheet.frozenColumns) {
            overlayObj.adjustFreezePaneSize(args.options, overlayProps.element, range);
        }
        const imgData: ImageModel = {
            src: args.options.src, id: id, height: parseFloat(overlayProps.element.style.height.replace('px', '')),
            width: parseFloat(overlayProps.element.style.width.replace('px', '')),
            top: sheet.frozenRows || sheet.frozenColumns ? (indexes[0] ? getRowsHeight(sheet, 0, indexes[0] - 1) : 0) :
                (isNullOrUndefined(args.options.top) || (args.options.preservePos && overlayProps.top > args.options.top) ?
                    overlayProps.top : args.options.top),
            left: sheet.frozenRows || sheet.frozenColumns ? (indexes[1] ? getColumnsWidth(sheet, 0, indexes[1] - 1) : 0) :
                (isNullOrUndefined(args.options.left) || (args.options.preservePos && overlayProps.left > args.options.left) ?
                    overlayProps.left : args.options.left)
        };
        this.parent.setUsedRange(indexes[0], indexes[1]);
        let isPositionChanged: boolean = false;
        const isElementRemoved: boolean = false;
        if (!args.isPublic && !args.isUndoRedo && (imgData.top !== args.options.top || imgData.left !== args.options.left)) {
            args.options.top = imgData.top;
            args.options.left = imgData.left;
            isPositionChanged = true;
        }
        const setImageEventArgs: { options: ImageModel[], range: string, isPositionChanged: boolean, isElementRemoved: boolean } = {
            options: [imgData], range: sheet.name + '!' + range, isPositionChanged: isPositionChanged, isElementRemoved
        };
        if (args.isPublic || args.isUndoRedo || isPositionChanged) {
            this.parent.notify(setImage, setImageEventArgs);
        }
        if (isPositionChanged && setImageEventArgs.isElementRemoved) {
            overlayProps = overlayObj.insertOverlayElement(id, range, sheetIndex);
            overlayProps.element.style.backgroundImage = 'url(\'' + args.options.src + '\')';
            if (args.options.height && args.options.width) {
                overlayProps.element.style.height = args.options.height + 'px';
                overlayProps.element.style.width = args.options.width + 'px';
            }
        }
        const currCell: CellModel = getCell(indexes[0], indexes[1], sheet);
        if (!currCell.image[currCell.image.length - 1].id) {
            currCell.image[currCell.image.length - 1].id = imgData.id;
        }
        if (!args.isUndoRedo && args.isPublic) {
            eventArgs = { requestType: 'insertImage', range: sheet.name + '!' + range, imageHeight: args.options.height ?
                args.options.height : 300, imageWidth: args.options.width ? args.options.width : 400, imageData: args.options.src, id: id,
            sheetIndex: sheetIndex };
            this.parent.notify('actionComplete', { eventArgs: eventArgs, action: 'insertImage' });
        }
    }

    private refreshInsDelImagePosition(args: {
        rowIdx: number, colIdx: number,
        sheetIdx: number, count: number, type: string, status: string
    }): void {
        const count: number = args.count;
        const sheetIdx: number = args.sheetIdx;
        const sheet: SheetModel = this.parent.sheets[sheetIdx as number];
        let pictureElements: HTMLElement;
        const currCellObj: CellModel = getCell(args.rowIdx, args.colIdx, sheet);
        const imageLen: number = currCellObj.image.length;
        let top: number; let left: number;
        for (let i: number = 0; i < imageLen; i++) {
            pictureElements = document.getElementById(currCellObj.image[i as number].id);
            top = (args.type === 'Row') ? (args.status === 'insert') ? currCellObj.image[i as number].top + (count * 20) :
                currCellObj.image[i as number].top - (count * 20) : currCellObj.image[i as number].top;
            left = (args.type === 'Column') ? (args.status === 'insert') ? currCellObj.image[i as number].left + (count * 64) :
                currCellObj.image[i as number].left - (count * 64) : currCellObj.image[i as number].left;
            currCellObj.image[i as number].top = top;
            currCellObj.image[i as number].left = left;
            if (pictureElements) {
                pictureElements.style.top = top + 'px';
                pictureElements.style.left = left + 'px';
            }
        }


    }

    private refreshImgCellObj(args: BeforeImageRefreshData): void {
        const sheetIndex: number =  isUndefined(args.sheetIdx) ? this.parent.activeSheetIndex : args.sheetIdx;
        const sheet: SheetModel = getSheet(this.parent, sheetIndex);
        const prevCellObj: CellModel = getCell(args.prevRowIdx, args.prevColIdx, sheet);
        const currCellObj: CellModel = getCell(args.currentRowIdx, args.currentColIdx, sheet);
        const prevCellImg: object[] = prevCellObj ? prevCellObj.image : [];
        let prevImgObj: ImageModel;
        let currImgObj: ImageModel[];
        const prevCellImgLen: number = (prevCellImg && prevCellImg.length) ? prevCellImg.length : 0;
        if (prevCellObj && prevCellObj.image && prevCellImg.length > 0) {
            for (let i: number = 0; i < prevCellImgLen; i++) {
                if (prevCellImg[i as number] && (prevCellImg[i as number] as ImageModel).id === args.id) {
                    prevImgObj = prevCellImg[i as number];
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
            if (currImgObj) {
                setCell(args.currentRowIdx, args.currentColIdx, sheet, { image: currImgObj }, true);
            } else {
                setCell(args.currentRowIdx, args.currentColIdx, sheet, { image: [prevImgObj] }, true);
            }
            if (args.requestType === 'imageRefresh' && !args.isUndoRedo) {
                const eventArgs: BeforeImageRefreshData = {
                    requestType: 'imageRefresh', currentRowIdx: args.currentRowIdx, currentColIdx: args.currentColIdx,
                    prevRowIdx: args.prevRowIdx, prevColIdx: args.prevColIdx, prevTop: args.prevTop, prevLeft: args.prevLeft,
                    currentTop: args.currentTop, currentLeft: args.currentLeft, currentHeight: args.currentHeight,
                    currentWidth: args.currentWidth, prevHeight: args.prevHeight, prevWidth: args.prevWidth,
                    id: args.id, sheetIdx: this.parent.activeSheetIndex
                };
                this.parent.notify('actionComplete', { eventArgs: eventArgs, action: 'imageRefresh' });
            }
        }
    }

    public deleteImage(
        args: {
            id: string, range?: string, preventEventTrigger?: boolean, sheet?: SheetModel,
            rowIdx?: number, colIdx?: number, isUndoRedo?: boolean, clearAction?: boolean
        }): void {
        let sheet: SheetModel = args.sheet || this.parent.getActiveSheet();
        const pictureElements: HTMLElement = document.getElementById(args.id);
        let rowIdx: number = args.rowIdx; let colIdx: number = args.colIdx;
        let address: string;
        if (pictureElements) {
            if (args.rowIdx === undefined && args.colIdx === undefined) {
                let imgTop: { clientY: number, isImage?: boolean, target?: Element };
                let imgleft: { clientX: number, isImage?: boolean, target?: Element };
                if (sheet.frozenRows || sheet.frozenColumns) {
                    const clientRect: ClientRect = pictureElements.getBoundingClientRect();
                    imgTop = { clientY: clientRect.top }; imgleft = { clientX: clientRect.left };
                    if (clientRect.top < this.parent.getColumnHeaderContent().getBoundingClientRect().bottom) {
                        imgTop.target = this.parent.getColumnHeaderContent();
                    }
                    if (clientRect.left < this.parent.getRowHeaderContent().getBoundingClientRect().right) {
                        imgleft.target = this.parent.getRowHeaderTable();
                    }
                } else {
                    imgTop = { clientY: parseFloat(pictureElements.style.top), isImage: true };
                    imgleft = { clientX: parseFloat(pictureElements.style.left), isImage: true };
                }
                this.parent.notify(getRowIdxFromClientY, imgTop); this.parent.notify(getColIdxFromClientX, imgleft);
                rowIdx = imgTop.clientY; colIdx = imgleft.clientX;
            }
            address = sheet.name + '!' + getCellAddress(rowIdx, colIdx);
            if (!args.preventEventTrigger) {
                const eventArgs: { address: string, cancel: boolean } = { address: address, cancel: false };
                this.parent.notify(beginAction, { action: 'deleteImage', eventArgs: eventArgs });
                if (eventArgs.cancel) {
                    return;
                }
            }
            document.getElementById(args.id).remove();
        } else if (!args.sheet) {
            const rangeVal: string = args.range ? args.range.lastIndexOf('!') > 0 ? args.range.substring(args.range.lastIndexOf('!') + 1)
                : args.range : this.parent.getActiveSheet().selectedRange;
            const sheetIndex: number = args.range && args.range.lastIndexOf('!') > 0 ?
                getSheetIndex(this.parent as Workbook, args.range.substring(0, args.range.lastIndexOf('!'))) :
                this.parent.activeSheetIndex;
            const index: number[] = getRangeIndexes(rangeVal);
            rowIdx = index[0]; colIdx = index[1];
            sheet = this.parent.sheets[sheetIndex as number];
        }
        let image: ImageModel = {};
        if (sheet) {
            const cellObj: CellModel = getCell(rowIdx, colIdx, sheet);
            const prevCellImg: ImageModel[] = (cellObj && cellObj.image) ? cellObj.image : [];
            const imgLength: number = prevCellImg.length;
            for (let i: number = imgLength - 1; i >= 0; i--) {
                if (prevCellImg[i as number].id === args.id) {
                    image = prevCellImg.splice(i, 1)[0];
                }
            }
            setCell(rowIdx, colIdx, sheet, { image: prevCellImg }, true);
        }
        if (!args.preventEventTrigger) {
            this.parent.notify(
                completeAction,
                { action: 'deleteImage', eventArgs: { address: address, id: image.id, imageData: image.src, imageWidth: image.width, imageHeight: image.height, cancel: false }, preventAction: args.isUndoRedo, isClearAction: args.clearAction });
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
     * Get the sheet picture module name.
     *
     * @returns {string} - Get the sheet picture module name.
     */
    public getModuleName(): string {
        return 'spreadsheetImage';
    }
}


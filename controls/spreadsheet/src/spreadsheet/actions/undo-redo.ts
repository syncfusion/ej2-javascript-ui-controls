import { Spreadsheet, locale, deleteImage, createImageElement, positionAutoFillElement, showAggregate, paste, undoRedoForChartDesign, cut, copy } from '../../spreadsheet/index';
import { performUndoRedo, updateUndoRedoCollection, enableToolbarItems, ICellRenderer, completeAction } from '../common/index';
import { UndoRedoEventArgs, setActionData, getBeforeActionData, updateAction } from '../common/index';
import { BeforeActionData, PreviousCellDetails, CollaborativeEditArgs, setUndoRedo, getUpdateUsingRaf } from '../common/index';
import { selectRange, clearUndoRedoCollection, setMaxHgt, getMaxHgt, setRowEleHeight } from '../common/index';
import { getRangeFromAddress, getRangeIndexes, BeforeCellFormatArgs, getSheet, workbookEditOperation, getSwapRange, Workbook, checkUniqueRange, reApplyFormula, getCellAddress, ValidationModel, cellValidation, getIndexesFromAddress, getSheetNameFromAddress } from '../../workbook/index';
import { getCell, setCell, CellModel, BeforeSortEventArgs, getSheetIndex, wrapEvent, getSheetIndexFromId } from '../../workbook/index';
import { SheetModel, MergeArgs, setMerge, getRangeAddress, replaceAll, applyCellFormat, CellFormatArgs } from '../../workbook/index';
import { addClass, extend, isNullOrUndefined, isObject, L10n, select } from '@syncfusion/ej2-base';
import { CellStyleModel, TextDecoration, setCellFormat, refreshRibbonIcons, getRow, ExtendedRowModel, getRowHeight } from '../../workbook/index';
import { SortDescriptor, getColIndex, beginAction, ActionEventArgs, ChartModel } from '../../workbook/index';
/**
 * UndoRedo module allows to perform undo redo functionalities.
 */
export class UndoRedo {
    private parent: Spreadsheet;
    private undoCollection: CollaborativeEditArgs[] = [];
    private redoCollection: CollaborativeEditArgs[] = [];
    private isUndo: boolean = false;
    private beforeActionData: BeforeActionData;
    private undoRedoStep: number = 100;
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
    }

    private setActionData(options: { args: CollaborativeEditArgs }): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        let address: number[];
        let cells: PreviousCellDetails[] = [];
        let cutCellDetails: PreviousCellDetails[] = [];
        const args: CollaborativeEditArgs = options.args;
        const eventArgs: UndoRedoEventArgs = args.eventArgs;
        let copiedInfo: { [key: string]: Object } = {};
        switch (args.action) {
        case 'format':
            address = getRangeIndexes((args.eventArgs as BeforeCellFormatArgs).range);
            break;
        case 'clipboard':
            copiedInfo = eventArgs.copiedInfo;
            address = getRangeIndexes(getRangeFromAddress(eventArgs.pastedRange));
            if (copiedInfo && copiedInfo.isCut) {
                cutCellDetails = this.getCellDetails(
                    copiedInfo.range as number[], getSheet(this.parent as Workbook, getSheetIndexFromId(
                        this.parent as Workbook, <number>copiedInfo.sId)), 'clipboard');
            }
            break;
        case 'beforeSort':
            address = getRangeIndexes((args.eventArgs as BeforeSortEventArgs).range);
            if (address[0] === address[2] && (address[2] - address[0]) === 0) { //if selected range is a single cell
                address[0] = 0; address[1] = 0; address[2] = sheet.usedRange.rowIndex; address[3] = sheet.usedRange.colIndex;
            }
            break;
        case 'beforeCellSave':
        case 'cellDelete':
        case 'cellSave':
            address = getRangeIndexes(eventArgs.address);
            break;
        case 'beforeWrap':
        case 'beforeReplace':
        case 'chartDesign':
            address = this.parent.getAddressInfo(eventArgs.address).indices;
            break;
        case 'beforeClear':
            address = getRangeIndexes(eventArgs.range);
            break;
        case 'beforeInsertImage':
            address = getRangeIndexes(eventArgs.range);
            break;
        case 'deleteImage':
            address = getRangeIndexes(eventArgs.address);
            break;
        case 'beforeInsertChart':
            address = getRangeIndexes(eventArgs.range);
            break;
        case 'filter':
            address = getRangeIndexes(eventArgs.range);
            break;
        case 'autofill':
            address = getRangeIndexes(eventArgs.fillRange);
            break;
        case 'removeValidation':
            address = getRangeIndexes(eventArgs.range);
            break;
        case 'hyperlink':
        case 'removeHyperlink':
            address = getRangeIndexes(eventArgs.address);
            break;
        }
        cells = this.getCellDetails(address, sheet, args.action);
        this.beforeActionData = { cellDetails: cells, cutCellDetails: cutCellDetails };
    }

    private getBeforeActionData(args: { beforeDetails: BeforeActionData }): void {
        args.beforeDetails = this.beforeActionData;
    }

    private performUndoRedo(args: { isUndo: boolean, isPublic: boolean, preventEvt?: boolean, preventReSelect?: boolean, isFromUpdateAction?: boolean }): void {
        let undoRedoArgs: CollaborativeEditArgs;
        if (args.isFromUpdateAction) {
            undoRedoArgs = args as unknown as CollaborativeEditArgs;
        } else {
            undoRedoArgs = args.isUndo ? this.undoCollection.pop() : this.redoCollection.pop();
        }
        this.isUndo = args.isUndo; let preventEvt: boolean;
        if (undoRedoArgs) {
            let actionArgs: ActionEventArgs;
            const replaceArgs: { replaceValue?: string, value?: string } = {};
            if (!args.isPublic) {
                const actionData: BeforeActionData = undoRedoArgs.eventArgs.beforeActionData;
                delete undoRedoArgs.eventArgs.beforeActionData;
                actionArgs = { action: undoRedoArgs.action, eventArgs: {} };
                extend(actionArgs.eventArgs, undoRedoArgs.eventArgs, null, true);
                undoRedoArgs.eventArgs.beforeActionData = actionData;
                (actionArgs.eventArgs as UndoRedoEventArgs).cancel = false;
                (undoRedoArgs as unknown as { preventAction: boolean }).preventAction = actionArgs.preventAction = true;
                if (args.isUndo) {
                    actionArgs.isUndo = true;
                } else {
                    actionArgs.isRedo = true;
                }
                if (!args.isFromUpdateAction) {
                    this.parent.notify(beginAction, actionArgs);
                }
                if ((actionArgs.eventArgs as UndoRedoEventArgs).cancel) {
                    this.updateUndoRedoIcons();
                    return;
                }
                delete (actionArgs.eventArgs as UndoRedoEventArgs).cancel;
            }
            switch (undoRedoArgs.action) {
            case 'cellSave':
            case 'format':
            case 'sorting':
            case 'wrap':
            case 'cellDelete':
            case 'autofill':
            case 'removeValidation':
            case 'hyperlink':
            case 'removeHyperlink':
                undoRedoArgs = this.performOperation(undoRedoArgs, args.preventEvt, args.preventReSelect, args.isPublic);
                break;
            case 'clipboard':
                undoRedoArgs = this.undoForClipboard(undoRedoArgs, args.isUndo, actionArgs);
                preventEvt = true;
                break;
            case 'resize':
            case 'resizeToFit':
                undoRedoArgs = this.undoForResize(undoRedoArgs);
                break;
            case 'hideShow':
                updateAction(undoRedoArgs, this.parent, !args.isUndo);
                break;
            case 'replace':
                undoRedoArgs = this.performOperation(undoRedoArgs);
                break;
            case 'replaceAll':
                (undoRedoArgs.eventArgs as unknown as { triggerEvent: boolean }).triggerEvent = false;
                if (args.isUndo) {
                    replaceArgs.value = (undoRedoArgs.eventArgs as unknown as { replaceValue: string}).replaceValue;
                    replaceArgs.replaceValue = undoRedoArgs.eventArgs.value;
                }
                this.parent.notify(replaceAll, { ...undoRedoArgs.eventArgs, ...replaceArgs });
                break;
            case 'insert':
            case 'filter':
                updateAction(undoRedoArgs, this.parent, !args.isUndo, null, actionArgs);
                preventEvt = undoRedoArgs.action === 'filter';
                break;
            case 'delete':
                updateAction(undoRedoArgs, this.parent, !args.isUndo);
                break;
            case 'validation':
            case 'addHighlight':
            case 'removeHighlight':
                updateAction(undoRedoArgs, this.parent, !args.isUndo);
                break;
            case 'merge':
                undoRedoArgs.eventArgs.merge = (undoRedoArgs as unknown as { isFromUpdateAction: boolean }).isFromUpdateAction ? undoRedoArgs.eventArgs.merge : !undoRedoArgs.eventArgs.merge;
                updateAction(undoRedoArgs, this.parent, false);
                break;
            case 'clear':
                undoRedoArgs = this.performOperation(undoRedoArgs);
                break;
            case 'conditionalFormat':
                updateAction(undoRedoArgs, this.parent, !args.isUndo, this.undoCollection);
                break;
            case 'clearCF':
                updateAction(undoRedoArgs, this.parent, !args.isUndo);
                break;
            case 'insertImage':
            case 'deleteImage':
                updateAction(undoRedoArgs, this.parent, !args.isUndo);
                break;
            case 'imageRefresh':
                updateAction(undoRedoArgs, this.parent, !args.isUndo);
                break;
            case 'insertChart':
            case 'deleteChart':
                updateAction(undoRedoArgs, this.parent, !args.isUndo);
                break;
            case 'chartRefresh':
                updateAction(undoRedoArgs, this.parent, !args.isUndo);
                break;
            case 'chartDesign':
                (undoRedoArgs.eventArgs as unknown as { isUndo: boolean }).isUndo = args.isUndo;
                this.parent.notify(undoRedoForChartDesign, undoRedoArgs.eventArgs);
                break;
            case 'addDefinedName':
                updateAction(undoRedoArgs, this.parent, !args.isUndo);
                break;
            }
            if (!args.isFromUpdateAction) {
                if (args.isUndo) {
                    this.redoCollection.push(undoRedoArgs);
                } else {
                    this.undoCollection.push(undoRedoArgs);
                }
                if (this.undoCollection.length > this.undoRedoStep) {
                    this.undoCollection.splice(0, 1);
                }
                if (this.redoCollection.length > this.undoRedoStep) {
                    this.redoCollection.splice(0, 1);
                }
                this.updateUndoRedoIcons();
                if (!args.isPublic && !preventEvt) {
                    this.parent.notify(completeAction, extend({ isUndoRedo: true, isUndo: args.isUndo }, undoRedoArgs));
                }
            }
            this.parent.notify(refreshRibbonIcons, null);
        }
    }

    private updateUndoRedoCollection(options: { args: CollaborativeEditArgs, isPublic?: boolean }): void {
        const actionList: string[] = ['clipboard', 'format', 'sorting', 'cellSave', 'resize', 'resizeToFit', 'wrap', 'hideShow', 'replace',
            'validation', 'merge', 'clear', 'conditionalFormat', 'clearCF', 'insertImage', 'imageRefresh', 'insertChart', 'deleteChart',
            'chartRefresh', 'filter', 'cellDelete', 'autofill', 'addDefinedName', 'removeValidation', 'removeHighlight', 'addHighlight', 'hyperlink', 'removeHyperlink', 'deleteImage', 'chartDesign', 'replaceAll'];
        if ((options.args.action === 'insert' || options.args.action === 'delete') && options.args.eventArgs.modelType !== 'Sheet') {
            actionList.push(options.args.action);
        }
        const action: string = options.args.action;
        if (actionList.indexOf(action) === -1 && !options.isPublic) {
            return;
        }
        const eventArgs: UndoRedoEventArgs = options.args.eventArgs;
        if (action === 'clipboard' || action === 'sorting' || action === 'format' || action === 'cellSave' ||
            action === 'wrap' || action === 'replace' || action === 'validation' || action === 'clear' || action === 'conditionalFormat' ||
            action === 'clearCF' || action === 'insertImage' || action === 'imageRefresh' || action === 'insertChart' ||
            action === 'chartRefresh' || action === 'filter' || action === 'cellDelete' || action === 'autofill' || action === 'removeValidation' ||
            action === 'addDefinedName' || action === 'hyperlink' || action === 'removeHyperlink' || action === 'deleteImage' || action === 'chartDesign') {
            const beforeActionDetails: { beforeDetails: BeforeActionData } = { beforeDetails: { cellDetails: [] } };
            this.parent.notify(getBeforeActionData, beforeActionDetails);
            eventArgs.beforeActionData = beforeActionDetails.beforeDetails;
        }
        if (action === 'clipboard' && eventArgs.copiedInfo && eventArgs.copiedInfo.isExternal) {
            const addressInfo: { sheetIndex: number, indices: number[] } = this.parent.getAddressInfo(eventArgs.pastedRange);
            eventArgs.copiedInfo.cellDetails = this.getCellDetails(
                addressInfo.indices, getSheet(this.parent, addressInfo.sheetIndex), action);
        }
        this.undoCollection.push(options.args);
        this.redoCollection = [];
        if (this.undoCollection.length > this.undoRedoStep) {
            this.undoCollection.splice(0, 1);
        }
        this.updateUndoRedoIcons();
    }

    private clearUndoRedoCollection(): void {
        this.undoCollection = [];
        this.redoCollection = [];
        this.updateUndoRedoIcons();
    }

    private updateUndoRedoIcons(): void {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        this.parent.notify(enableToolbarItems, [{
            tab: l10n.getConstant('Home'), items: [this.parent.element.id + '_undo']
            , enable: this.undoCollection.length > 0
        }]);
        this.parent.notify(enableToolbarItems, [{
            tab: l10n.getConstant('Home'), items: [this.parent.element.id + '_redo']
            , enable: this.redoCollection.length > 0
        }]);
    }

    private undoForClipboard(args: CollaborativeEditArgs, isUndo: boolean, actionArgs?: ActionEventArgs): CollaborativeEditArgs {
        const eventArgs: UndoRedoEventArgs = args.eventArgs;
        const address: string[] = eventArgs.pastedRange.split('!');
        const range: number[] = getRangeIndexes(address[1]);
        const sheetIndex: number = getSheetIndex(this.parent as Workbook, address[0]);
        const sheet: SheetModel = getSheet(this.parent as Workbook, sheetIndex);
        const copiedInfo: { [key: string]: Object } = eventArgs.copiedInfo;
        const actionData: BeforeActionData = eventArgs.beforeActionData;
        const isFromUpdateAction: boolean = (args as unknown as { isFromUpdateAction: boolean }).isFromUpdateAction;
        const isRefresh: boolean = this.checkRefreshNeeded(sheetIndex, isFromUpdateAction);
        let pictureElem: HTMLElement;
        if (actionArgs) {
            (actionArgs as unknown as { isUndoRedo: boolean }).isUndoRedo = true;
            (actionArgs.eventArgs as { beforeActionData: BeforeActionData }).beforeActionData = actionData;
        }
        if (args.eventArgs.requestType === 'imagePaste') {
            const copiedShapeInfo: { [key: string]: Object } = eventArgs.copiedShapeInfo;
            if (isUndo) {
                pictureElem = copiedShapeInfo.pictureElem as HTMLElement;
                if (copiedShapeInfo.isCut) {
                    this.parent.notify(deleteImage, {
                        id: pictureElem.id, sheetIdx: eventArgs.pasteSheetIndex + 1
                    });
                    this.parent.notify(createImageElement, {
                        options: {
                            src: pictureElem.style.backgroundImage.replace(/url\((['"])?(.*?)\1\)/gi, '$2'),
                            height: copiedShapeInfo.height, width: copiedShapeInfo.width, imageId: pictureElem.id
                        },
                        range: copiedShapeInfo.copiedRange, isPublic: false, isUndoRedo: true
                    });
                } else {
                    this.parent.notify(deleteImage, {
                        id: eventArgs.pastedPictureElement.id, sheetIdx: eventArgs.pasteSheetIndex + 1
                    });
                }
            } else {
                if (copiedShapeInfo.isCut) {
                    pictureElem = copiedShapeInfo.pictureElem as HTMLElement;
                    this.parent.notify(deleteImage, {
                        id: pictureElem.id, sheetIdx: copiedShapeInfo.sId
                    });
                    this.parent.notify(createImageElement, {
                        options: {
                            src: pictureElem.style.backgroundImage.replace(/url\((['"])?(.*?)\1\)/gi, '$2'),
                            height: copiedShapeInfo.height, width: copiedShapeInfo.width, imageId: pictureElem.id
                        },
                        range: copiedShapeInfo.pastedRange, isPublic: false, isUndoRedo: true
                    });
                } else {
                    pictureElem = eventArgs.pastedPictureElement;
                    this.parent.notify(createImageElement, {
                        options: {
                            src: pictureElem.style.backgroundImage.replace(/url\((['"])?(.*?)\1\)/gi, '$2'),
                            height: pictureElem.offsetHeight, width: pictureElem.offsetWidth, imageId: pictureElem.id
                        },
                        range: copiedShapeInfo.pastedRange, isPublic: false, isUndoRedo: true
                    });
                }
            }
        } else {
            if (isUndo) {
                if (copiedInfo.isCut) {
                    const cells: PreviousCellDetails[] = actionData.cutCellDetails;
                    this.updateCellDetails(
                        cells, getSheet(this.parent as Workbook, getSheetIndexFromId(this.parent as Workbook, <number>copiedInfo.sId)),
                        getSwapRange(copiedInfo.range as number[]), isRefresh, args);
                }
                if (actionData) {
                    this.updateCellDetails(actionData.cellDetails, sheet, range, isRefresh, args);
                }
                setMaxHgt(sheet, range[0], range[1], getRowHeight(sheet, range[0]));
                const hgt: number = getMaxHgt(sheet, range[0]);
                setRowEleHeight(this.parent, sheet, hgt, range[0]);
                eventArgs.mergeCollection.forEach((mergeArgs: MergeArgs): void => {
                    mergeArgs.merge = !mergeArgs.merge; this.parent.notify(setMerge, mergeArgs); mergeArgs.merge = !mergeArgs.merge;
                });
                if (actionArgs && !isFromUpdateAction) {
                    this.parent.notify(completeAction, actionArgs);
                }
            } else {
                if (copiedInfo.isExternal) {
                    const addressInfo: { sheetIndex: number, indices: number[] } = this.parent.getAddressInfo(eventArgs.pastedRange);
                    this.updateCellDetails(
                        copiedInfo.cellDetails as PreviousCellDetails[], getSheet(this.parent, addressInfo.sheetIndex),
                        addressInfo.indices, true, args);
                    if (actionArgs && !isFromUpdateAction) {
                        this.parent.notify(completeAction, actionArgs);
                    }
                } else {
                    const clipboardPromise: Promise<Object> = new Promise((resolve: Function) => { resolve((() => { /** */ })()); });
                    const addressInfo: { sheetIndex: number, indices: number[] } = this.parent.getAddressInfo(eventArgs.copiedRange);
                    this.parent.notify(eventArgs.copiedInfo.isCut ? cut : copy, {
                        range: addressInfo.indices, sId: getSheet(this.parent, addressInfo.sheetIndex).id,
                        promise: clipboardPromise, invokeCopy: true, isPublic: true, isFromUpdateAction: isFromUpdateAction
                    });
                    clipboardPromise.then(() => {
                        this.parent.notify(paste, {
                            range: address ? getIndexesFromAddress(eventArgs.pastedRange) : address,
                            sIdx: address ? getSheetIndex(this.parent, getSheetNameFromAddress(eventArgs.pastedRange)) : address,
                            type: eventArgs.type, isAction: false, isInternal: true, isFromUpdateAction: isFromUpdateAction
                        });
                        if (actionArgs && !isFromUpdateAction) {
                            this.parent.notify(completeAction, actionArgs);
                        }
                    });
                }
            }
            if (isRefresh && !isFromUpdateAction) {
                this.parent.notify(selectRange, { address: address[1] });
                this.parent.notify(positionAutoFillElement, {});
            }
        }
        return args;
    }

    private undoForResize(args: CollaborativeEditArgs): CollaborativeEditArgs {
        const eventArgs: UndoRedoEventArgs = args.eventArgs;
        if (eventArgs.hide === undefined) {
            if (eventArgs.isCol) {
                const temp: string = eventArgs.oldWidth;
                eventArgs.oldWidth = eventArgs.width;
                eventArgs.width = temp;
            } else {
                const temp: string = eventArgs.oldHeight;
                eventArgs.oldHeight = eventArgs.height;
                eventArgs.height = temp;
            }
        } else {
            eventArgs.hide = !eventArgs.hide;
        }
        updateAction(args, this.parent, false);
        const sheet: SheetModel = this.parent.getActiveSheet();
        const activeCell: number[] = getRangeIndexes(sheet.activeCell);
        const CellElem: CellModel = getCell(activeCell[0], activeCell[1], sheet);
        if (CellElem && CellElem.rowSpan) {
            const td: HTMLElement = this.parent.getCell(activeCell[0], activeCell[1]);
            (this.parent.element.querySelector('.e-active-cell') as HTMLElement).style.height = td.offsetHeight + 'px';
        } else if (CellElem && CellElem.colSpan) {
            const td: HTMLElement = this.parent.getCell(activeCell[0], activeCell[1]);
            (this.parent.element.querySelector('.e-active-cell') as HTMLElement).style.width = td.offsetWidth +  'px';
        }
        return args;
    }

    private performOperation(
        args: CollaborativeEditArgs, preventEvt?: boolean, preventReSelect?: boolean, isPublic?: boolean): CollaborativeEditArgs {
        const eventArgs: UndoRedoEventArgs = args.eventArgs;
        let address: string[] = [];
        if (args.action === 'autofill') {
            address = eventArgs.fillRange.split('!');
        } else {
            address = (args.action === 'cellSave' || args.action === 'wrap' || args.action === 'replace'
                || args.action === 'cellDelete' || args.action === 'hyperlink' || args.action === 'removeHyperlink') ? eventArgs.address.split('!') : eventArgs.range.split('!');
        }
        const range: number[] = getSwapRange(getRangeIndexes(address[1]));
        const indexes: number[] = range;
        const sheetIndex: number = getSheetIndex(this.parent as Workbook, address[0]);
        const sheet: SheetModel = getSheet(this.parent as Workbook, sheetIndex);
        const actionData: BeforeActionData = eventArgs.beforeActionData;
        const isFromUpdateAction: boolean = (args as unknown as { isFromUpdateAction: boolean }).isFromUpdateAction
        const isRefresh: boolean = this.checkRefreshNeeded(sheetIndex, isFromUpdateAction);
        const uniqueArgs: { cellIdx: number[], isUnique: boolean, uniqueRange: string } = { cellIdx: [range[0], range[1]], isUnique: false , uniqueRange: ''};
        this.parent.notify(checkUniqueRange, uniqueArgs);
        const updateSortIcon: Function = (idx: number, add: boolean): void => {
            if (sheetIndex === this.parent.activeSheetIndex) {
                let td: Element = this.parent.getCell(range[0] - 1, this.parent.sortCollection[idx].columnIndex);
                if (td) {
                    td = select('.e-filter-icon', td);
                    if (td) {
                        add ? td.classList.add(`e-sort${this.parent.sortCollection[idx].order === 'Ascending' ? 'asc' : 'desc'}-filter`) :
                            td.classList.remove(`e-sort${this.parent.sortCollection[idx].order === 'Ascending' ? 'asc' : 'desc'}-filter`);
                    }
                }
            }
        };
        if (this.isUndo) {
            if (uniqueArgs.isUnique && eventArgs.formula && eventArgs.formula.indexOf('UNIQUE') > - 1) {
                const rangeIdx: number[] = getRangeIndexes(uniqueArgs.uniqueRange);
                if (getCell(rangeIdx[0], rangeIdx[1], this.parent.getActiveSheet()).value !== '#SPILL!') {
                    for (let j: number = rangeIdx[0]; j <= rangeIdx[2]; j++) {
                        for (let k: number = rangeIdx[1]; k <= rangeIdx[3]; k++) {
                            if (j === rangeIdx[0] && k === rangeIdx[1]) {
                                k = k + 1;
                            }
                            this.parent.updateCell({value: ''}, getRangeAddress([j, k]));
                        }
                    }
                }
            }
            this.updateCellDetails(actionData.cellDetails, sheet, range, isRefresh, args, preventEvt);
            if (uniqueArgs.isUnique && args.action === 'cellDelete' && eventArgs.isSpill) {
                const rangeIdx: number[] = getRangeIndexes(uniqueArgs.uniqueRange);
                const cell: CellModel = getCell(rangeIdx[0], rangeIdx[1], this.parent.getActiveSheet());
                for (let i: number = rangeIdx[0]; i <= rangeIdx[2]; i++) {
                    for (let j: number = rangeIdx[1]; j <= rangeIdx[3]; j++) {
                        for (let k: number = range[0]; k <= range[2]; k++) {
                            for (let l: number = range[1]; l <= range[3]; l++) {
                                if (i !== k || j !== l) {
                                    this.parent.updateCell({value: ''}, getCellAddress(i, j));
                                }
                            }
                        }
                    }
                }
                cell.value = '#SPILL!';
                this.parent.updateCell(cell, getCellAddress(rangeIdx[0], rangeIdx[1]));
            }
            if (!eventArgs.isSpill && uniqueArgs.uniqueRange !== '') {
                const indexes: number[] = getRangeIndexes(uniqueArgs.uniqueRange);
                for (let j: number = indexes[0]; j <= indexes[2]; j++) {
                    for (let k: number = indexes[1]; k <= indexes[3]; k++) {
                        if (j === indexes[0] && k === indexes[1]) {
                            k = k + 1;
                        }
                        this.parent.updateCell({value: ''}, getRangeAddress([j, k]));
                    }
                }
                this.parent.notify(reApplyFormula, null);
            }
            if (args.action === 'sorting' && this.parent.sortCollection && eventArgs.previousSort) {
                for (let i: number = 0; i < this.parent.sortCollection.length; i++) {
                    if (this.parent.sortCollection[i].sheetIndex === sheetIndex) {
                        updateSortIcon(i, false);
                        this.parent.sortCollection.splice(i, 1);
                        if (eventArgs.previousSort.order) {
                            this.parent.sortCollection.splice(i, 0, eventArgs.previousSort);
                            updateSortIcon(i, true);
                        } else if (!this.parent.sortCollection.length) {
                            this.parent.sortCollection = undefined;
                        }
                        break;
                    }
                }
            }
        } else {
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            const argsEventArgs: any = args.eventArgs;
            const activeCellIndexes: number[] = getRangeIndexes(sheet.activeCell);
            let cellValue: TextDecoration = this.parent.getCellStyleValue(['textDecoration'], activeCellIndexes).textDecoration;
            if (argsEventArgs && argsEventArgs.style && (argsEventArgs.style as CellStyleModel).textDecoration ) {
                const value: TextDecoration = (argsEventArgs.style as CellStyleModel).textDecoration;
                let changedValue: TextDecoration = value;
                let changedStyle: CellStyleModel;
                let removeProp: boolean = false;
                if (cellValue === 'underline') {
                    changedValue = value === 'underline' ? 'none' : 'underline line-through';
                } else if (cellValue === 'line-through') {
                    changedValue = value === 'line-through' ? 'none' : 'underline line-through';
                } else if (cellValue === 'underline line-through') {
                    changedValue = value === 'underline' ? 'line-through' : 'underline'; removeProp = true;
                }
                if (changedValue === 'none') { removeProp = true; }
                (argsEventArgs.style as CellStyleModel).textDecoration = changedValue;
                args.eventArgs = argsEventArgs as UndoRedoEventArgs;
                this.parent.notify(setCellFormat, {
                    style: { textDecoration: changedValue } , range: activeCellIndexes, refreshRibbon: true,
                    onActionUpdate: true
                });
                for (let i: number = indexes[0]; i <= indexes[2]; i++) {
                    for (let j: number = indexes[1]; j <= indexes[3]; j++) {
                        if (i === activeCellIndexes[0] && j === activeCellIndexes[1]) { continue; }
                        changedStyle = {};
                        cellValue = this.parent.getCellStyleValue(['textDecoration'], [i, j]).textDecoration;
                        if (cellValue === 'none') {
                            if (removeProp) { continue; }
                            changedStyle.textDecoration = value;
                        } else if (cellValue === 'underline' || cellValue === 'line-through') {
                            if (removeProp) {
                                if (value === cellValue) {
                                    changedStyle.textDecoration = 'none';
                                } else {
                                    continue;
                                }
                            } else {
                                changedStyle.textDecoration = value !== cellValue ? 'underline line-through' : value;
                            }
                        } else if (cellValue === 'underline line-through') {
                            if (removeProp) {
                                changedStyle.textDecoration = value === 'underline' ? 'line-through' : 'underline';
                            } else {
                                continue;
                            }
                        }
                        this.parent.notify(setCellFormat, {
                            style: { textDecoration: changedStyle.textDecoration }, range: [i, j, i, j], refreshRibbon: true,
                            onActionUpdate: true
                        });
                    }
                }
                (argsEventArgs.style as CellStyleModel).textDecoration = value;
                args.eventArgs = argsEventArgs as UndoRedoEventArgs;
            } else {
                if (!isNullOrUndefined(eventArgs.oldValue) && eventArgs.oldValue !== eventArgs.value && uniqueArgs.isUnique) {
                    const indexes: number[] = getRangeIndexes(uniqueArgs.uniqueRange);
                    if (getCell(indexes[0], indexes[1], this.parent.getActiveSheet()).value !== '#SPILL!') {
                        for (let j: number = indexes[0]; j <= indexes[2]; j++) {
                            for (let k: number = indexes[1]; k <= indexes[3]; k++) {
                                if (j === indexes[0] && k === indexes[1]) {
                                    this.parent.updateCell({value: '#SPILL!'}, getRangeAddress([indexes[0], indexes[1]]));
                                    k = k + 1;
                                }
                                this.parent.updateCell({value: ''}, getRangeAddress([j, k]));
                            }
                        }
                    }
                }
                updateAction(args, this.parent, true);
                if (uniqueArgs.isUnique && args.action === 'cellDelete' && eventArgs.isSpill) {
                    const indexes: number[] = getRangeIndexes(uniqueArgs.uniqueRange); let Skip: boolean = false;
                    for (let i: number = indexes[0]; i <= indexes[1]; i++) {
                        for (let j: number = indexes[1]; j <= indexes[3]; j++) {
                            if (i === indexes[0] && j === indexes[1]) {
                                j++;
                            }
                            if (getCell(i, j, sheet) && !isNullOrUndefined(getCell(i, j, sheet).value)
                            && getCell(i, j, sheet).value !== '') {
                                Skip = true;
                            }
                        }
                    }
                    if (!Skip) {
                        const cell: CellModel = getCell(indexes[0], indexes[1], this.parent.getActiveSheet());
                        cell.value = '';
                        this.parent.updateCell(cell, getCellAddress(indexes[0], indexes[1]));
                        this.parent.notify(reApplyFormula, null);
                    }
                }
            }
            if (args.action === 'sorting' && eventArgs.previousSort) {
                let idx: number;
                if (this.parent.sortCollection) {
                    for (let i: number = 0; i < this.parent.sortCollection.length; i++) {
                        if (this.parent.sortCollection[i].sheetIndex === sheetIndex) {
                            updateSortIcon(i, false);
                            idx = i; this.parent.sortCollection.splice(i, 1);
                            break;
                        }
                    }
                } else {
                    this.parent.sortCollection = []; idx = 0;
                }
                this.parent.sortCollection.splice(
                    idx, 0, { sortRange: address[1], sheetIndex: sheetIndex, columnIndex:
                        getColIndex((eventArgs.sortOptions.sortDescriptors as SortDescriptor).field), order:
                        (eventArgs.sortOptions.sortDescriptors as SortDescriptor).order });
                updateSortIcon(idx, true);
            }
        }
        if (args.action === 'autofill') {
            address[1] = this.isUndo ? args.eventArgs.dataRange : args.eventArgs.selectedRange;
        }
        if (isRefresh && !preventReSelect && !isFromUpdateAction) {
            this.parent.notify(selectRange, { address: address[1] });
        }
        this.parent.notify(showAggregate, {});
        return args;
    }
    private getCellDetails(address: number[], sheet: SheetModel, action: string): PreviousCellDetails[] {
        const cells: PreviousCellDetails[] = [];
        let cell: CellModel; const filterCheck: boolean = action === 'cellDelete';
        address = getSwapRange(address);
        for (let i: number = address[0]; i <= address[2]; i++) {
            if (filterCheck && ((getRow(sheet, i) || {}) as ExtendedRowModel).isFiltered) { continue; }
            for (let j: number = address[1]; j <= address[3]; j++) {
                cell = getCell(i, j, sheet);
                cells.push({
                    rowIndex: i, colIndex: j, format: cell ? cell.format : null, isLocked: cell ? cell.isLocked : null,
                    style: cell && cell.style ? Object.assign({}, cell.style) : null, value: cell ? cell.value : '', formula: cell ?
                        cell.formula : '', wrap: cell && cell.wrap, rowSpan: cell && cell.rowSpan, colSpan: cell && cell.colSpan,
                    hyperlink: cell && (isObject(cell.hyperlink) ? extend({}, cell.hyperlink) : cell.hyperlink), image: cell && cell.image,
                    chart: cell && cell.chart && JSON.parse(JSON.stringify(cell.chart)), validation: cell && cell.validation
                });
            }
        }
        return cells;
    }

    private updateCellDetails(
        cells: PreviousCellDetails[], sheet: SheetModel, range: number[], isRefresh: boolean, args?: CollaborativeEditArgs,
        preventEvt?: boolean): void {
        const len: number = cells.length;
        const triggerEvt: boolean = args && !preventEvt && (args.action === 'cellSave' || args.action === 'cellDelete' ||
            args.action === 'autofill' || args.action === 'clipboard');
        let cellElem: HTMLElement; let prevCell: CellModel;
        let select: boolean;
        for (let i: number = 0; i < len; i++) {
            prevCell = getCell(cells[i].rowIndex, cells[i].colIndex, sheet, false, true);
            if (prevCell.style && args && (args.action === 'format' || args.action === 'clipboard')) {
                if (prevCell.style.borderTop && (!cells[i].style || !(cells[i].style as CellStyleModel).borderTop)) {
                    this.parent.setBorder({ borderTop: '' }, sheet.name + '!' + getCellAddress(cells[i].rowIndex, cells[i].colIndex));
                }
                if (prevCell.style.borderLeft && (!cells[i].style || !(cells[i].style as CellStyleModel).borderLeft)) {
                    this.parent.setBorder({ borderLeft: '' }, sheet.name + '!' + getCellAddress(cells[i].rowIndex, cells[i].colIndex));
                }
                if (prevCell.style.fontSize && (!cells[i].style || !(cells[i].style as CellStyleModel).fontSize)) {
                    prevCell.style.fontSize = '11pt'; select = true;
                    this.parent.notify(
                        applyCellFormat, <CellFormatArgs>{ style: { fontSize: '11pt' }, rowIdx: cells[i].rowIndex, colIdx:
                        cells[i].colIndex, lastCell: true, isHeightCheckNeeded: true, manualUpdate: true, onActionUpdate: true });
                }
                if (prevCell.style.fontFamily && (!cells[i].style || !(cells[i].style as CellStyleModel).fontFamily)) {
                    select = true; prevCell.style.fontFamily = 'Calibri';
                    this.parent.notify(
                        applyCellFormat, <CellFormatArgs>{ style: { fontFamily: 'Calibri' }, rowIdx: cells[i].rowIndex, colIdx:
                        cells[i].colIndex, lastCell: true, isHeightCheckNeeded: true, manualUpdate: true, onActionUpdate: true });
                }
            }
            setCell(cells[i].rowIndex, cells[i].colIndex, sheet, {
                value: cells[i].value, format: cells[i].format, isLocked: cells[i].isLocked,
                style: cells[i].style && Object.assign({}, cells[i].style), formula: cells[i].formula,
                wrap: cells[i].wrap, rowSpan: cells[i].rowSpan,
                colSpan: cells[i].colSpan, hyperlink: cells[i].hyperlink
            });
            this.parent.notify(
                workbookEditOperation,
                {
                    action: 'updateCellValue', address: [cells[i].rowIndex, cells[i].colIndex, cells[i].rowIndex,
                        cells[i].colIndex], value: cells[i].formula ? cells[i].formula : cells[i].value,
                    sheetIndex: getSheetIndex(this.parent, sheet.name)
                });
            if ((args && args.action === 'wrap' && args.eventArgs.wrap) || (prevCell.wrap && !cells[i].wrap)) {
                this.parent.notify(wrapEvent, {
                    range: [cells[i].rowIndex, cells[i].colIndex, cells[i].rowIndex,
                        cells[i].colIndex], wrap: false, sheet: sheet
                });
            }
            if (args && args.action === 'removeValidation' && cells[i].validation) {
                const rules: ValidationModel = {
                    type: cells[i].validation.type, operator: cells[i].validation.operator, value1: cells[i].validation.value1,
                    value2: cells[i].validation.value2, ignoreBlank: cells[i].validation.ignoreBlank,
                    inCellDropDown: cells[i].validation.inCellDropDown
                };
                this.parent.notify(cellValidation, { rules: rules, range: args.eventArgs.range });
            }
            if (args && cells[i].hyperlink && args.action === 'clear') {
                args.eventArgs.range = sheet.name + '!' + getRangeAddress([cells[i].rowIndex, cells[i].colIndex, cells[i].rowIndex,
                    cells[i].colIndex]);
                cellElem = this.parent.getCell(cells[i].rowIndex, cells[i].colIndex);
                if (args.eventArgs.type === 'Clear All' || args.eventArgs.type === 'Clear Hyperlinks') {
                    this.parent.addHyperlink(cells[i].hyperlink, args.eventArgs.range);
                } else if (args.eventArgs.type === 'Clear Formats') {
                    addClass(cellElem.querySelectorAll('.e-hyperlink'), 'e-hyperlink-style');
                }
            }
            if (triggerEvt && cells[i].value !== prevCell.value) {
                this.parent.trigger(
                    'cellSave', { element: null, value: cells[i].value, oldValue: prevCell.value, formula: cells[i].formula, cancel: false,
                        address: `${sheet.name}!${getCellAddress(cells[i].rowIndex, cells[i].colIndex)}`,
                        displayText: this.parent.getDisplayText(cells[i]) });
            }
        }
        if (isRefresh) {
            this.parent.serviceLocator.getService<ICellRenderer>('cell').refreshRange(range, false, false, true);
            if (select) { getUpdateUsingRaf((): void => this.parent.selectRange(sheet.selectedRange)); }
        }
    }

    private checkRefreshNeeded(sheetIndex: number, isFromUpdateAction?: boolean): boolean {
        let isRefresh: boolean = true;
        if (sheetIndex !== this.parent.activeSheetIndex) {
            if (!isFromUpdateAction) {
                this.parent.activeSheetIndex = sheetIndex;
                this.parent.dataBind();
            }
            isRefresh = false;
        }
        return isRefresh;
    }
    private addEventListener(): void {
        this.parent.on(performUndoRedo, this.performUndoRedo, this);
        this.parent.on(updateUndoRedoCollection, this.updateUndoRedoCollection, this);
        this.parent.on(setActionData, this.setActionData, this);
        this.parent.on(getBeforeActionData, this.getBeforeActionData, this);
        this.parent.on(clearUndoRedoCollection, this.clearUndoRedoCollection, this);
        this.parent.on(setUndoRedo, this.updateUndoRedoIcons, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(performUndoRedo, this.performUndoRedo);
            this.parent.off(updateUndoRedoCollection, this.updateUndoRedoCollection);
            this.parent.off(setActionData, this.setActionData);
            this.parent.off(getBeforeActionData, this.getBeforeActionData);
            this.parent.off(clearUndoRedoCollection, this.clearUndoRedoCollection);
            this.parent.off(setUndoRedo, this.updateUndoRedoIcons);
        }
    }

    /**
     * Destroy undo redo module.
     *
     * @returns {void} - Destroy undo redo module.
     */

    public destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }
    /**
     * Get the undo redo module name.
     *
     * @returns {string} - Get the undo redo module name.
     */
    public getModuleName(): string {
        return 'undoredo';
    }
}

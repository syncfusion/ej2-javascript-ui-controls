import { Workbook, setCell, SheetModel, setRow, CellModel, getSheet } from '../base/index';
import { setCFRule, clearCFRule, getRangeAddress, CellStyleModel, applyCellFormat, getSwapRange } from '../common/index';
import { getRangeIndexes, CellFormatArgs, ConditionalFormatModel } from '../common/index';
import { cFInitialCheck, clearCF, addHighlight, cFUndo, goto } from '../common/index';
import { completeAction } from '../../spreadsheet/common/event';
import { isNullOrUndefined } from '@syncfusion/ej2-base';


/**
 * The `WorkbookConditionalFormat` module is used to handle conditional formatting action in Spreadsheet.
 */
export class WorkbookConditionalFormat {
    private parent: Workbook;
    /**
     * Constructor for WorkbookConditionalFormat module.
     *
     * @param {Workbook} parent - Specifies the parent element.
     */
    constructor(parent: Workbook) {
        this.parent = parent;
        this.addEventListener();
    }

    /**
     * To destroy the conditional format module.
     *
     * @returns {void}
     */
    protected destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }

    private addEventListener(): void {
        this.parent.on(setCFRule, this.setCFrulHandler, this);
        this.parent.on(clearCFRule, this.clearRules, this);
        this.parent.on(cFUndo, this.cFUndoHandler, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(setCFRule, this.setCFrulHandler);
            this.parent.off(clearCFRule, this.clearRules);
            this.parent.off(cFUndo, this.cFUndoHandler);
        }
    }

    private setCFrulHandler(args: { conditionalFormat: ConditionalFormatModel, isAction?: boolean, sheetIdx?: number, isUndoRedo?: boolean }): void {
        const conditionalFormat: ConditionalFormatModel = args.conditionalFormat;
        let range: string = conditionalFormat.range;
        const sheetIndex: number = args.isUndoRedo ? args.sheetIdx : this.parent.getAddressInfo(range).sheetIndex;
        const sheet: SheetModel = getSheet(this.parent, sheetIndex);
        range = range || sheet.selectedRange;
        const indexes: number[] = getSwapRange(getRangeIndexes(range));
        conditionalFormat.range = getRangeAddress(indexes);
        if (!sheet.conditionalFormats) {
            this.parent.setSheetPropertyOnMute(sheet, 'conditionalFormats', []);
        }
        const cfrCount: number = sheet.conditionalFormats.length;
        sheet.conditionalFormats[cfrCount] = conditionalFormat;
        if (args.isUndoRedo && sheetIndex !== this.parent.activeSheetIndex) {
            this.parent.notify(goto, { address: sheet.name + '!' + conditionalFormat.range });
            return;
        }
        for (let rIdx: number = indexes[0]; rIdx <= indexes[2]; rIdx++) {
            if (!sheet.rows[rIdx]) { setRow(sheet, rIdx, {}); }
            for (let cIdx: number = indexes[1]; cIdx <= indexes[3]; cIdx++) {
                if (!sheet.rows[rIdx].cells || !sheet.rows[rIdx].cells[cIdx]) { setCell(rIdx, cIdx, sheet, {}); }
                if (sheetIndex === this.parent.activeSheetIndex) {
                    const cell: CellModel = sheet.rows[rIdx].cells[cIdx];
                    this.parent.notify(
                        cFInitialCheck, { rowIdx: rIdx, colIdx: cIdx, cell: cell, conditionalFormat: conditionalFormat, isAction:
                        args.isAction });
                }
            }
        }
    }

    private clearRules(
        args: { range: string, isPublic?: boolean, isclearFormat?: true, sheetIdx?: number, isClearCF?: boolean,
        isUndoRedo?: boolean }): void {
        const isPublic: boolean = isNullOrUndefined(args.isPublic) ? true : false;
        const cFormats: ConditionalFormatModel[] = [];
        const oldRange: string[] = [];
        let isFirst: boolean = true;
        let top: number;
        let bottom: number;
        let left: number;
        let right: number;
        let frontColIdx: number;
        let backColIdx: number;
        let topRowIdx: number;
        let bottomRowIdx: number;
        const range: string = args.range;
        const sheetIndex: number = args.isUndoRedo ? args.sheetIdx : this.parent.getAddressInfo(range).sheetIndex;
        const sheet: SheetModel = getSheet(this.parent, sheetIndex);
        const cFRules: ConditionalFormatModel[] = sheet.conditionalFormats;
        const rangeIndexes: number[] = getRangeIndexes(range);
        if (sheetIndex === this.parent.activeSheetIndex) {
            for (let rIdx: number = rangeIndexes[0]; rIdx <= rangeIndexes[2]; rIdx++) {
                for (let cIdx: number = rangeIndexes[1]; cIdx <= rangeIndexes[3]; cIdx++) {
                    this.parent.notify(clearCF, { rIdx: rIdx, cIdx: cIdx });
                }
            }
        }
        if (!cFRules) {
            return;
        }
        for (let cFRulesIdx: number = cFRules.length - 1; cFRulesIdx >= 0; cFRulesIdx--) {
            let isPresent: boolean = false;
            let result: string = '';
            const cFRule: ConditionalFormatModel = cFRules[cFRulesIdx];
            const cFRanges: string[] = cFRule.range.split(',');
            if (sheetIndex === this.parent.activeSheetIndex && ( args.isClearCF || !args.isUndoRedo)) {
                for (let cFRangeIdx: number = 0; cFRangeIdx < cFRanges.length; cFRangeIdx++) {
                    let isFull: boolean = false;
                    const cFRange: string = cFRanges[cFRangeIdx];
                    const cFRangeIndexes: number[] = getRangeIndexes(cFRange);
                    topRowIdx = cFRangeIndexes[0];
                    bottomRowIdx = cFRangeIndexes[0];
                    frontColIdx = cFRangeIndexes[1];
                    backColIdx = cFRangeIndexes[1];
                    if (cFRangeIndexes[0] >= rangeIndexes[0] && cFRangeIndexes[2] <= rangeIndexes[2] &&
                        cFRangeIndexes[1] >= rangeIndexes[1] && cFRangeIndexes[3] <= rangeIndexes[3]) {
                        isFull = true;
                    }
                    for (let cFRRowIdx: number = cFRangeIndexes[0]; cFRRowIdx <= cFRangeIndexes[2]; cFRRowIdx++) {
                        let isTrue: number = 0;
                        for (let cFRColIdx: number = cFRangeIndexes[1]; cFRColIdx <= cFRangeIndexes[3]; cFRColIdx++) {
                            for (let rRowIdx: number = rangeIndexes[0]; rRowIdx <= rangeIndexes[2]; rRowIdx++) {
                                for (let rColIdx: number = rangeIndexes[1]; rColIdx <= rangeIndexes[3]; rColIdx++) {
                                    if (rRowIdx === cFRRowIdx && rColIdx === cFRColIdx) {
                                        const style: CellStyleModel =
                                            this.parent.getCellStyleValue(['backgroundColor', 'color'], [rRowIdx, rColIdx]);
                                        this.parent.notify(applyCellFormat, <CellFormatArgs>{
                                            style: style, rowIdx: rRowIdx, colIdx: rColIdx,
                                            lastCell: true, isHeightCheckNeeded: true, manualUpdate: true
                                        });
                                        isTrue = isTrue + 1;
                                        isPresent = true;
                                        if (rRowIdx === cFRangeIndexes[0]) {
                                            if (rColIdx === cFRangeIndexes[3]) {
                                                if (frontColIdx === cFRangeIndexes[1]) {
                                                    if (backColIdx === rColIdx) {
                                                        backColIdx = rColIdx;
                                                    } else {
                                                        frontColIdx = rColIdx - 1;
                                                    }
                                                } else if (frontColIdx !== cFRangeIndexes[1] && backColIdx + 1 === rColIdx) {
                                                    backColIdx = cFRangeIndexes[1];
                                                    frontColIdx = frontColIdx - 1;
                                                } else if (frontColIdx !== cFRangeIndexes[1] && backColIdx === cFRangeIndexes[1]) {
                                                    frontColIdx = rangeIndexes[1] - 1;
                                                }
                                            } else if (rColIdx === cFRangeIndexes[1]) {
                                                if (backColIdx === cFRangeIndexes[1]) {
                                                    backColIdx = rColIdx + 1;
                                                }
                                            } else {
                                                if (frontColIdx === cFRangeIndexes[1] && backColIdx === cFRangeIndexes[1]) {
                                                    frontColIdx = rColIdx;
                                                    backColIdx = rColIdx;
                                                } else if (frontColIdx === cFRangeIndexes[1] && backColIdx !== cFRangeIndexes[1]) {
                                                    backColIdx = rColIdx + 1;
                                                } else {
                                                    backColIdx = rColIdx;
                                                }
                                            }
                                        } else {
                                            if (rColIdx === cFRangeIndexes[1]) {
                                                if (backColIdx === cFRangeIndexes[1] && cFRangeIndexes[1] !== cFRangeIndexes[3]) {
                                                    backColIdx = rColIdx + 1;
                                                }
                                            } else if (rColIdx === cFRangeIndexes[3]) {
                                                if (frontColIdx === cFRangeIndexes[1]) {
                                                    if (backColIdx === rColIdx) {
                                                        backColIdx = rColIdx;
                                                    } else {
                                                        frontColIdx = rColIdx - 1;
                                                    }
                                                } else if (frontColIdx !== cFRangeIndexes[1] && backColIdx === cFRangeIndexes[1]) {
                                                    frontColIdx = rangeIndexes[1] - 1;
                                                } else if (frontColIdx !== cFRangeIndexes[1] && backColIdx + 1 === rColIdx) {
                                                    backColIdx = cFRangeIndexes[1];
                                                    frontColIdx = rangeIndexes[1] - 1;
                                                } else {
                                                    bottomRowIdx = rRowIdx;
                                                }
                                            } else {
                                                if (frontColIdx === cFRangeIndexes[1] && backColIdx === cFRangeIndexes[1]) {
                                                    frontColIdx = rColIdx;
                                                    backColIdx = rColIdx;
                                                } else if (backColIdx !== cFRangeIndexes[1] && frontColIdx !== cFRangeIndexes[1]) {
                                                    backColIdx = rColIdx;
                                                } else if (frontColIdx !== cFRangeIndexes[1] && backColIdx === cFRangeIndexes[1]) {
                                                    frontColIdx = rColIdx;
                                                } else {
                                                    backColIdx = rColIdx + 1;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (isTrue > 0 && !isFull) {
                            if (isFirst) {
                                top = topRowIdx;
                                bottom = bottomRowIdx;
                                left = frontColIdx;
                                right = backColIdx;
                            }
                            if (frontColIdx === cFRangeIndexes[1] && backColIdx !== cFRangeIndexes[1]) {
                                if (backColIdx === cFRangeIndexes[3]) {
                                    if (topRowIdx !== cFRRowIdx) {
                                        result = result + ' ' + getRangeAddress([topRowIdx, left, bottom, cFRangeIndexes[3]]);
                                    }
                                    if (frontColIdx === cFRangeIndexes[1] && backColIdx === cFRangeIndexes[3]) {
                                        if (cFRRowIdx === cFRangeIndexes[2]) {
                                            if (cFRangeIndexes[1] === rangeIndexes[3]) {
                                                result = result + ' ' + getRangeAddress([cFRRowIdx, backColIdx, cFRRowIdx, cFRangeIndexes[3]]);
                                            }
                                        } else {
                                            if (rangeIndexes[2] === cFRangeIndexes[0] && backColIdx !== cFRangeIndexes[3]) {
                                                result = result + ' ' + getRangeAddress([cFRRowIdx, backColIdx, cFRRowIdx, cFRangeIndexes[3]]);
                                            }
                                            topRowIdx = cFRRowIdx + 1;
                                            bottomRowIdx = cFRRowIdx + 1;
                                            backColIdx = cFRangeIndexes[1];
                                        }
                                    }
                                } else if (right !== backColIdx) {
                                    result = result + ' ' + getRangeAddress([topRowIdx, right, cFRRowIdx - 1, cFRangeIndexes[3]]);
                                    if (backColIdx === cFRangeIndexes[3] && frontColIdx === cFRangeIndexes[1]) {
                                        topRowIdx = cFRRowIdx + 1;
                                        bottomRowIdx = cFRRowIdx + 1;
                                        backColIdx = cFRangeIndexes[1];
                                    } else {
                                        topRowIdx = cFRRowIdx;
                                        bottomRowIdx = cFRRowIdx;
                                    }
                                    if (backColIdx === cFRangeIndexes[3] && frontColIdx !== cFRangeIndexes[1]) {
                                        frontColIdx = cFRangeIndexes[1];
                                    }
                                } else if (left !== frontColIdx) {
                                    result = result + ' ' + getRangeAddress([topRowIdx, cFRangeIndexes[1], cFRRowIdx - 1, left]);
                                    topRowIdx = cFRRowIdx + 1;
                                    bottomRowIdx = cFRRowIdx + 1;
                                    frontColIdx = cFRangeIndexes[1];
                                    backColIdx = cFRangeIndexes[1];
                                } else if (cFRRowIdx === cFRangeIndexes[2]) {
                                    result = result + ' ' + getRangeAddress([topRowIdx, backColIdx, cFRRowIdx, cFRangeIndexes[3]]);
                                } else {
                                    if (bottomRowIdx < cFRRowIdx || (frontColIdx === cFRangeIndexes[1] && backColIdx === cFRangeIndexes[3]))
                                    {
                                        bottomRowIdx = cFRRowIdx;
                                    }
                                }
                            } else if (backColIdx === cFRangeIndexes[1] && frontColIdx !== cFRangeIndexes[1]) {
                                if (right !== backColIdx) {
                                    result = result + ' ' + getRangeAddress([topRowIdx, right, cFRRowIdx - 1, cFRangeIndexes[3]]);
                                    topRowIdx = cFRRowIdx;
                                    bottomRowIdx = cFRRowIdx;
                                }
                                if (left !== frontColIdx) {
                                    result = result + ' ' + getRangeAddress([topRowIdx, left, cFRRowIdx - 1, cFRangeIndexes[3]]);
                                    topRowIdx = cFRRowIdx;
                                    bottomRowIdx = cFRRowIdx;
                                }
                                if (cFRRowIdx === cFRangeIndexes[2]) {
                                    result = result + ' ' + getRangeAddress([topRowIdx, backColIdx, cFRRowIdx, frontColIdx]);
                                } else {
                                    bottomRowIdx = cFRRowIdx;
                                }
                            } else if (backColIdx !== cFRangeIndexes[1] && frontColIdx !== cFRangeIndexes[1]) {
                                if (cFRRowIdx === cFRangeIndexes[2] && cFRangeIndexes[2] === rangeIndexes[0]) {
                                    if (cFRangeIndexes[0] === cFRangeIndexes[2]) {
                                        result = result + ' ' + getRangeAddress([topRowIdx, cFRangeIndexes[1], bottomRowIdx, frontColIdx - 1]);
                                        result = result + ' ' +
                                            getRangeAddress([topRowIdx, backColIdx + 1, bottomRowIdx, cFRangeIndexes[3]]);
                                    } else {
                                        result =
                                            result + ' ' + getRangeAddress([topRowIdx, cFRangeIndexes[1], bottomRowIdx, cFRangeIndexes[3]]);
                                        result = result + ' ' +
                                            getRangeAddress([cFRangeIndexes[2], cFRangeIndexes[1], cFRangeIndexes[2], frontColIdx - 1]);
                                        result = result + ' ' +
                                            getRangeAddress([cFRangeIndexes[2], backColIdx + 1, cFRangeIndexes[2], cFRangeIndexes[3]]);
                                    }
                                } else if (cFRRowIdx === cFRangeIndexes[2]) {
                                    result = result + ' ' + getRangeAddress([topRowIdx, cFRangeIndexes[1], cFRRowIdx, frontColIdx - 1]);
                                    result = result + ' ' + getRangeAddress([topRowIdx, backColIdx + 1, cFRRowIdx, cFRangeIndexes[3]]);
                                } else {
                                    if (left === cFRangeIndexes[1] && right === cFRangeIndexes[1]) {
                                        result = result + ' ' + getRangeAddress([topRowIdx, left, bottomRowIdx, cFRangeIndexes[3]]);
                                        topRowIdx = cFRRowIdx;
                                    }
                                    bottomRowIdx = cFRRowIdx;
                                }
                            } else if (frontColIdx === cFRangeIndexes[1] && backColIdx === cFRangeIndexes[1]) {
                                if (rangeIndexes[2] !== cFRangeIndexes[0]) {
                                    if (cFRangeIndexes[2] >= rangeIndexes[2] && cFRRowIdx > rangeIndexes[2]) {
                                        result = result + ' ' + getRangeAddress([topRowIdx, frontColIdx, bottomRowIdx, cFRangeIndexes[3]]);
                                    }
                                    if (cFRangeIndexes[1] === cFRangeIndexes[3] &&
                                        cFRRowIdx <= cFRangeIndexes[2] && top !== cFRangeIndexes[2] && cFRRowIdx !== top) {
                                        result = result + ' ' + getRangeAddress([topRowIdx, frontColIdx, bottomRowIdx, cFRangeIndexes[3]]);
                                    }
                                    if (cFRangeIndexes[1] === cFRangeIndexes[3]) {
                                        topRowIdx = cFRRowIdx + 1;
                                        bottomRowIdx = cFRRowIdx + 1;
                                    }
                                } else {
                                    if (cFRRowIdx === cFRangeIndexes[2] || cFRRowIdx === cFRangeIndexes[0] &&
                                        cFRangeIndexes[1] !== cFRangeIndexes[3]) {
                                        result = result + ' ' + getRangeAddress([topRowIdx, frontColIdx, bottomRowIdx, backColIdx]);
                                    }
                                    topRowIdx = cFRRowIdx + 1;
                                    bottomRowIdx = cFRRowIdx + 1;
                                }
                                if (cFRRowIdx === cFRangeIndexes[2] && cFRangeIndexes[0] !== cFRangeIndexes[2] &&
                                    cFRangeIndexes[1] !== cFRangeIndexes[3]) {
                                    result = result + ' ' + getRangeAddress([cFRRowIdx, frontColIdx, cFRRowIdx, backColIdx]);
                                }
                            }
                            if (!isFirst) {
                                top = topRowIdx;
                                bottom = bottomRowIdx <= cFRangeIndexes[2] ? bottomRowIdx : cFRangeIndexes[2];
                                left = frontColIdx;
                                right = backColIdx <= cFRangeIndexes[3] ? backColIdx : cFRangeIndexes[3];
                            }
                            isFirst = false;
                        } else if (!isFull) {
                            if (isFirst) {
                                top = topRowIdx;
                                bottom = bottomRowIdx;
                                left = frontColIdx;
                                right = backColIdx;
                            }
                            if (frontColIdx === cFRangeIndexes[1] && backColIdx === cFRangeIndexes[1]) {
                                if (cFRRowIdx === cFRangeIndexes[2]) {
                                    result = result + ' ' + getRangeAddress([topRowIdx, frontColIdx, cFRRowIdx, cFRangeIndexes[3]]);
                                }
                                bottomRowIdx = cFRRowIdx;
                            }
                            if (backColIdx !== cFRangeIndexes[1] && frontColIdx !== cFRangeIndexes[1]) {
                                result = result + ' ' + getRangeAddress([topRowIdx, cFRangeIndexes[1], (cFRRowIdx - 1), frontColIdx - 1]);
                                result = result + ' ' + getRangeAddress([topRowIdx, backColIdx + 1, (cFRRowIdx - 1), cFRangeIndexes[3]]);
                                topRowIdx = cFRRowIdx;
                                bottomRowIdx = cFRRowIdx;
                                frontColIdx = cFRangeIndexes[1];
                                backColIdx = cFRangeIndexes[1];
                            }
                            if (backColIdx !== cFRangeIndexes[1] && frontColIdx === cFRangeIndexes[1]) {
                                result = result + ' ' + getRangeAddress([topRowIdx, backColIdx, (cFRRowIdx - 1), cFRangeIndexes[3]]);
                                topRowIdx = cFRRowIdx;
                                bottomRowIdx = cFRRowIdx;
                                frontColIdx = cFRangeIndexes[1];
                                backColIdx = cFRangeIndexes[1];
                            }
                            if (frontColIdx !== cFRangeIndexes[1] && backColIdx === cFRangeIndexes[1]) {
                                result = result + ' ' + getRangeAddress([topRowIdx, backColIdx, (cFRRowIdx - 1), frontColIdx]);
                                topRowIdx = cFRRowIdx;
                                bottomRowIdx = cFRRowIdx;
                                frontColIdx = cFRangeIndexes[1];
                                backColIdx = cFRangeIndexes[1];
                            }
                            if (!isFirst) {
                                top = topRowIdx;
                                bottom = bottomRowIdx <= cFRangeIndexes[2] ? bottomRowIdx : cFRangeIndexes[2];
                                left = frontColIdx;
                                right = backColIdx <= cFRangeIndexes[3] ? backColIdx : cFRangeIndexes[3];
                            }
                            isFirst = false;
                        }
                    }
                }
            }
            if (result === '') {
                oldRange.push(sheet.conditionalFormats[cFRulesIdx].range);
                sheet.conditionalFormats.splice(cFRulesIdx, 1);
            } else {
                oldRange.push(sheet.conditionalFormats[cFRulesIdx].range);
                sheet.conditionalFormats[cFRulesIdx].range = result.trim().replace(' ', ',');
            }
            if (isPresent && !isPublic) {
                cFRule.range = result.trim().replace(' ', ',');
                cFormats.push(cFRule);
            }
            if (args.isUndoRedo) {
                if (this.parent.activeSheetIndex !== args.sheetIdx) {
                    this.parent.notify(goto, { address: sheet.name + '!' + args.range });
                }
                break;
            }
        }
        if (!isPublic) {
            const eventArgs: object = { cFormats: cFormats, oldRange: oldRange, selectedRange: range, sheetIdx: sheetIndex };
            this.parent.notify(completeAction, { eventArgs: eventArgs, action: 'clearCF' });
        }
        if (!args.isclearFormat) {
            this.parent.notify(addHighlight, { range: range, isclearFormat: true });
        }
    }

    private cFUndoHandler(args: { conditionalFormat: ConditionalFormatModel, sheetIdx: number }): void {
        if (args.sheetIdx === this.parent.activeSheetIndex) {
            const cFRule: ConditionalFormatModel = args.conditionalFormat;
        const cFRanges: string[] = cFRule.range.split(',');
            const sheet: SheetModel = getSheet(this.parent, args.sheetIdx);
            for (let cFRangeIdx: number = 0; cFRangeIdx < cFRanges.length; cFRangeIdx++) {
                const cFRange: string = cFRanges[cFRangeIdx];
                const cFRangeIndexes: number[] = getRangeIndexes(cFRange);
                for (let cFRRowIdx: number = cFRangeIndexes[0]; cFRRowIdx <= cFRangeIndexes[2]; cFRRowIdx++) {
                    for (let cFRColIdx: number = cFRangeIndexes[1]; cFRColIdx <= cFRangeIndexes[3]; cFRColIdx++) {
                        const cell: CellModel = sheet.rows[cFRRowIdx].cells[cFRColIdx];
                        this.parent.notify(
                            cFInitialCheck, {
                            rowIdx: cFRRowIdx, colIdx: cFRColIdx, cell: cell, conditionalFormat: cFRule, isAction: true
                        });
                    }
                }
            }
        }
    }

    /**
     * Gets the module name.
     *
     * @returns {void} string
     */
    protected getModuleName(): string {
        return 'workbookConditionalFormatting';
    }
}

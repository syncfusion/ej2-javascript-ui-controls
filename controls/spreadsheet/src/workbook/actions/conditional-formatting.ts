import { Workbook, SheetModel, getSheet, ConditionalFormat } from '../index';
import { setCFRule, clearCFRule, getRangeAddress, getSheetIndexFromAddress } from '../common/index';
import { getRangeIndexes, ConditionalFormatModel, CFArgs, ApplyCFArgs, getSwapRange } from '../common/index';
import { applyCF, clearCF, goto, CFormattingEventArgs, beginAction } from '../common/index';


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
        this.parent.on(setCFRule, this.setCFRule, this);
        this.parent.on(clearCFRule, this.clearCFRule, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(setCFRule, this.setCFRule);
            this.parent.off(clearCFRule, this.clearCFRule);
        }
    }

    private setCFRule(e: CFArgs): void {
        const cf: ConditionalFormatModel = e.cfModel;
        const sheetIndex: number = e.sheetIdx === undefined ? getSheetIndexFromAddress(this.parent, cf.range) : e.sheetIdx;
        const sheet: SheetModel = getSheet(this.parent, sheetIndex);
        let indexes: number[] = getSwapRange(getRangeIndexes(cf.range || sheet.selectedRange));
        cf.range = getRangeAddress(indexes);
        if (e.isAction) {
            const eventArgs: CFormattingEventArgs = { range: cf.range, type: cf.type, cancel: false, cFColor: cf.cFColor, value: cf.value,
                sheetIdx: sheetIndex };
            this.parent.notify(beginAction, { eventArgs: eventArgs, action: 'conditionalFormat' });
            if (eventArgs.cancel) {
                return;
            }
            cf.type = eventArgs.type;
            cf.cFColor = eventArgs.cFColor;
            cf.value = eventArgs.value;
            if (eventArgs.range !== cf.range) {
                cf.range = eventArgs.range;
                indexes = getSwapRange(getRangeIndexes(eventArgs.range));
            }
            delete eventArgs.cancel;
        }
        if (!sheet.conditionalFormats) {
            this.parent.setSheetPropertyOnMute(sheet, 'conditionalFormats', []);
        }
        sheet.conditionalFormats.push(cf);
        if (sheetIndex !== this.parent.activeSheetIndex) {
            if (e.isUndoRedo && !e.isFromUpdateAction) {
                this.parent.notify(goto, { address: sheet.name + '!' + cf.range });
            }
        } else {
            this.parent.notify(applyCF, <ApplyCFArgs>{ cfModel: [cf], isAction: true });
        }
        this.parent.setUsedRange(indexes[2], indexes[3]);
        if (e.isAction) {
            this.parent.notify(
                'actionComplete', { eventArgs: { range: cf.range, type: cf.type, cFColor: cf.cFColor, value: cf.value, sheetIdx: sheetIndex },
                    action: 'conditionalFormat' });
        }
    }

    private clearCFRule(args: CFArgs): void {
        if (args.sheetIdx === undefined) {
            args.sheetIdx = this.parent.activeSheetIndex;
        }
        const sheet: SheetModel = getSheet(this.parent, args.sheetIdx);
        const cfRule: ConditionalFormatModel[] = sheet.conditionalFormats;
        if (args.isUndo) {
            if (args.updatedCFModel) {
                let idx: number;
                args.updatedCFModel.forEach((cf: ConditionalFormatModel): void => {
                    idx = cfRule.indexOf(cf);
                    if (idx > -1) {
                        cfRule.splice(idx, 1);
                    }
                });
            }
            cfRule.splice(cfRule.length, 0, ...args.oldCFModel);
            this.parent.notify(applyCF, <ApplyCFArgs>{ cfModel: args.oldCFModel, isAction: true });
            if (args.sheetIdx !== this.parent.activeSheetIndex) {
                this.parent.notify(goto, { address: sheet.name + '!' + args.range });
            }
            return;
        }
        if (!cfRule || !cfRule.length) {
            return;
        }
        let cf: ConditionalFormat; let cfRange: string[]; let cfIdx: number[]; let newRange: string[];
        let left: boolean; let right: boolean; let top: boolean; let bottom: boolean; let range: string;
        let idx: number[] = args.range && (typeof args.range === 'string' ? getRangeIndexes(args.range) : args.range);
        args.oldCFModel = []; args.updatedCFModel = [];
        const updatedCFModel: ConditionalFormatModel[] = [];
        const oldRange: string[] = [];
        const refreshCF: ConditionalFormatModel[] = [];
        for (let i: number = 0; i < cfRule.length; i++) {
            cf = <ConditionalFormat>cfRule[i as number];
            cfRange = cf.range.split(',');
            for (let j: number = 0; j < cfRange.length; j++) {
                cfIdx = getRangeIndexes(cfRange[j as number]);
                if (args.range) {
                    if (idx[0] <= cfIdx[0] && idx[1] <= cfIdx[1] && idx[2] >= cfIdx[2] && idx[3] >= cfIdx[3]) {
                        cfRange.splice(j, 1);
                        j--;
                    } else {
                        top = idx[0] >= cfIdx[0] && idx[0] <= cfIdx[2];
                        bottom = idx[2] >= cfIdx[0] && idx[2] <= cfIdx[2];
                        left = idx[1] >= cfIdx[1] && idx[1] <= cfIdx[3];
                        right = idx[3] >= cfIdx[1] && idx[3] <= cfIdx[3];
                        newRange = [];
                        if (top && bottom) {
                            if (left || right || (idx[1] < cfIdx[1] && idx[3] > cfIdx[3])) {
                                if (idx[0] - cfIdx[0] > 0) {
                                    newRange.push(getRangeAddress([cfIdx[0], cfIdx[1], idx[0] - 1, cfIdx[3]]));
                                }
                                if (cfIdx[2] - idx[2] > 0) {
                                    newRange.push(getRangeAddress([idx[2] + 1, cfIdx[1], cfIdx[2], cfIdx[3]]));
                                }
                            }
                            if (left && idx[1] !== cfIdx[1]) {
                                newRange.push(getRangeAddress([idx[0], cfIdx[1], idx[2], idx[1] - 1]));
                            }
                            if (right && idx[3] !== cfIdx[3]) {
                                newRange.push(getRangeAddress([idx[0], idx[3] + 1, idx[2], cfIdx[3]]));
                            }
                        } else if (left && right) {
                            if (top || bottom || (idx[0] < cfIdx[0] && idx[2] > cfIdx[2])) {
                                if (idx[1] - cfIdx[1] > 0) {
                                    newRange.push(getRangeAddress([cfIdx[0], cfIdx[1], cfIdx[2], idx[1] - 1]));
                                }
                                if (cfIdx[3] - idx[3] > 0) {
                                    newRange.push(getRangeAddress([cfIdx[0], idx[3] + 1, cfIdx[2], cfIdx[3]]));
                                }
                            }
                            if (top) {
                                if (idx[0] !== cfIdx[0]) {
                                    newRange.push(getRangeAddress([cfIdx[0], idx[1], idx[0] - 1, idx[3]]));
                                }
                            } else if (bottom && idx[2] !== cfIdx[2]) {
                                newRange.push(getRangeAddress([idx[2] + 1, idx[1], cfIdx[2], idx[3]]));
                            }
                        } else if (top || bottom) {
                            if (left) {
                                if (idx[1] !== cfIdx[1]) {
                                    newRange.push(getRangeAddress([cfIdx[0], cfIdx[1], cfIdx[2], idx[1] - 1]));
                                }
                                if (idx[0] - cfIdx[0] > 0) {
                                    newRange.push(getRangeAddress([cfIdx[0], idx[1], idx[0] - 1, cfIdx[3]]));
                                } else if (cfIdx[2] - idx[2] > 0) {
                                    newRange.push(getRangeAddress([idx[2] + 1, idx[1], cfIdx[2], cfIdx[3]]));
                                }
                            } else if (right) {
                                if (idx[3] !== cfIdx[3]) {
                                    newRange.push(getRangeAddress([cfIdx[0], idx[3] + 1, cfIdx[2], cfIdx[3]]));
                                }
                                if (idx[0] - cfIdx[0] > 0) {
                                    newRange.push(getRangeAddress([cfIdx[0], cfIdx[1], idx[0] - 1, idx[3]]));
                                } else if (cfIdx[2] - idx[2] > 0) {
                                    newRange.push(getRangeAddress([idx[2] + 1, cfIdx[1], cfIdx[2], idx[3]]));
                                }
                            }
                        }
                        if (newRange.length) {
                            cfRange[j as number] = newRange.join(',');
                        } else {
                            continue;
                        }
                    }
                } else {
                    idx = cfIdx;
                    cfRange.splice(j, 1);
                    j--;
                }
                if (args.sheetIdx === this.parent.activeSheetIndex) {
                    this.parent.notify(clearCF, { indexes: idx });
                }
            }
            range = cfRange.join(',');
            if (range !== cf.range) {
                if (args.cfModel && (args.cfModel.cFColor !== cf.cFColor || args.cfModel.type !== cf.type ||
                    args.cfModel.value !== cf.value)) {
                    refreshCF.push(cf);
                    continue;
                }
                oldRange.push(cf.range);
                if (!range) {
                    args.oldCFModel.push(cf);
                    updatedCFModel.concat(cfRule.splice(i, 1));
                    i--;
                } else {
                    args.oldCFModel.push({ type: cf.type, cFColor: cf.cFColor, format: cf.format, range: cf.range, value: cf.value });
                    cf.range = range;
                    if (cf.result) {
                        delete cf.result;
                        this.parent.notify(applyCF, <ApplyCFArgs>{ cfModel: [cf], isAction: true });
                    }
                    args.updatedCFModel.push(cf);
                    updatedCFModel.push(cf);
                }
            }
        }
        if (args.sheetIdx !== this.parent.activeSheetIndex) {
            if (args.isUndoRedo && !args.isFromUpdateAction) {
                this.parent.notify(goto, { address: sheet.name + '!' + args.range });
            }
        } else if (refreshCF.length) {
            this.parent.notify(applyCF, <ApplyCFArgs>{ cfModel: refreshCF, isAction: true });
        }
        if ((args.isAction || args.isClear) && args.oldCFModel.length) {
            const eventArgs: { [key: string]: object | string | number } = { cFormats: updatedCFModel, oldRange: oldRange,
                previousConditionalFormats: args.oldCFModel, sheetIdx: args.sheetIdx, selectedRange: args.range };
            if (args.updatedCFModel.length) {
                eventArgs.conditionalFormats = args.updatedCFModel;
            }
            if (args.isClear) {
                args.cfClearActionArgs = eventArgs;
            } else {
                this.parent.notify('actionComplete', { eventArgs: eventArgs, action: 'clearCF' });
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

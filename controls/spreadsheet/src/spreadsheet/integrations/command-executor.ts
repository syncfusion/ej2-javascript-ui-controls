import { Spreadsheet } from '../base/index';
import { AssistCommand, AssistAction, AnalyticalReport, CommandResult, cut, paste, copy, freeze, applyEditAction } from '../common/index';
import { AssistCommandArgs, FillRangeInfo, performAutoFill, applyWrapText, applyDataValidation } from '../common/index';
import { initiateFilterUI, applySort, applyNumberFormat } from '../common/index';
import { deleteModel, exportDialog, insertModel, replaceAll, setCFRule, setChart } from '../../workbook/common/event';
import { findAllValues, setMerge } from '../../workbook/common/event';
import { getFormatFromType, getSheetIndex, SheetModel } from '../../workbook/index';
import { ChartTheme, ValidationType, ValidationOperator, CellStyleModel, AutoFillType } from '../../workbook/common/index';
import { setCellFormat, SetCellFormatArgs, getRangeIndexes, getSwapRange, ChartModel } from '../../workbook/common/index';
import { getIndexesFromAddress, getColumnHeaderText, CFArgs, ChartType, AutoFillDirection } from '../../workbook/common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';

/**
 * CommandExecutor — executes AssistCommand objects against the Spreadsheet.
 * This class is UI-agnostic: it returns CommandResult objects that callers
 * (AIAssist panel or WebMCP adapter) map to their respective output format.
 *
 * @hidden
 */
export class CommandExecutor {
    private parent: Spreadsheet;

    /** Set of action names that can be batched together. */
    private readonly batchableActions: Set<string> = new Set(['edit', 'cellFormat', 'numberFormat']);

    constructor(parent: Spreadsheet) {
        this.parent = parent;
    }

    /**
     * Execute an array of AssistCommands, batching eligible consecutive actions.
     *
     * @param {AssistCommand[]} commands - The commands to execute.
     * @returns {Promise<CommandResult[]>} Array of per-command results.
     */
    public async executeHandler(commands: AssistCommand[]): Promise<CommandResult[]> {
        const results: CommandResult[] = [];
        let i: number = 0;
        while (i < commands.length) {
            const command: AssistCommand = commands[i as number];
            if (this.batchableActions.has(command.action)) {
                const batchAction: string = command.action;
                const batch: AssistCommand[] = [];
                while (i < commands.length && commands[i as number].action === batchAction) {
                    batch.push(commands[i as number]);
                    i++;
                }
                const result: CommandResult = batch.length > 1
                    ? this.executeBatch(batchAction, batch)
                    : this.executeSingleBatchable(batchAction, batch[0].args);
                results.push(result);
            } else {
                results.push(await this.executeSingle(command));
                i++;
            }
        }
        return results;
    }

    private executeSingleBatchable(action: string, args: AssistCommandArgs): CommandResult {
        try {
            switch (action) {
            case 'edit':    return this.wrapResult(action, this.executeEdit(args));
            case 'cellFormat':   return this.wrapResult(action, this.executeCellFormat(args));
            case 'numberFormat': return this.wrapResult(action, this.executeNumberFormat(args));
            default:        return this.errorResult(action, 'UNSUPPORTED_BATCH_ACTION', `${action} cannot be batched.`);
            }
        } catch (e) {
            return this.errorResult(action, 'EXECUTION_ERROR', (e instanceof Error) ? e.message : String(e));
        }
    }

    private async executeSingle(command: AssistCommand): Promise<CommandResult> {
        const action: AssistAction = command.action;
        try {
            switch (action) {
            case 'analysis':
                return this.wrapResult(action, command.args && command.args.message ? command.args.message : '', { type: 'analysis' });
            case 'reportGeneration':
                return this.wrapResult(
                    action,
                    command.args && command.args.reportStructure
                        ? this.buildReportNarrative(command.args.reportStructure)
                        : 'Report generation failed: no report structure returned.',
                    { reportStructure: command.args && command.args.reportStructure as unknown as Record<string, unknown> }
                );
            case 'findAndReplace':
                return this.wrapResult(action, this.executeFindReplace(command.args));
            case 'find': {
                const findResult: { message: string; addresses: string[] } = this.executeFind(command.args);
                return this.wrapResult(action, findResult.message, { addresses: findResult.addresses });
            }
            case 'conditionalFormat':
                return this.wrapResult(action, this.executeConditionalFormat(command.args));
            case 'merge':
                return this.wrapResult(action, this.executeMerge(command.args));
            case 'cut':
                return this.wrapResult(action, await this.executeCut(command.args));
            case 'copy':
                return this.wrapResult(action, await this.executeCopy(command.args));
            case 'paste':
                return this.wrapResult(action, this.executePaste(command.args));
            case 'wrap':
                return this.wrapResult(action, this.executeWrap(command.args));
            case 'chart':
                return this.wrapResult(action, this.executeChart(command.args));
            case 'dataValidation':
                return this.wrapResult(action, this.executeDataValidation(command.args));
            case 'filter':
                return this.wrapResult(action, this.executeFilter(command.args));
            case 'sort':
                return this.wrapResult(action, this.executeSort(command.args));
            case 'insert':
                return this.wrapResult(action, this.executeInsert(command.args));
            case 'delete':
                return this.wrapResult(action, this.executeDelete(command.args));
            case 'autofill':
                return this.wrapResult(action, this.executeAutoFill(command.args));
            case 'freezePanes':
                return this.wrapResult(action, this.executeFreezePanes(command.args));
            case 'hyperlink':
                return this.wrapResult(action, this.executeHyperlink(command.args));
            case 'save':
                return this.wrapResult(action, this.executeSave(command.args));
            case 'insertSheet':
                return this.wrapResult(action, this.executeInsertSheet(command.args));
            default:
                return this.wrapResult(
                    action,
                    command.message || 'I can analyze the sheet, update values, replace content, or apply number formats.',
                    {},
                    false
                );
            }
        } catch (e) {
            return this.errorResult(action, 'EXECUTION_ERROR', (e instanceof Error) ? e.message : String(e));
        }
    }

    private executeBatch(action: string, commands: AssistCommand[]): CommandResult {
        for (const cmd of commands) {
            this.executeSingleBatchable(action, cmd.args);
        }
        const ranges: string[] = commands
            .map((cmd: AssistCommand) => cmd.args && (cmd.args.range || cmd.args.address))
            .filter((r: string) => !isNullOrUndefined(r) && r !== '');
        const rangeText: string = ranges.length > 0 ? ranges.join(', ') : 'selected cells';
        let message: string;
        switch (action) {
        case 'edit': {
            const addresses: string[] = commands
                .map((cmd: AssistCommand) => cmd.args && cmd.args.address)
                .filter((a: string) => !isNullOrUndefined(a) && a !== '');
            const uniqueValues: string[] = Array.from(new Set<string>(
                commands.map((cmd: AssistCommand) => cmd.args && cmd.args.value)
            ));
            const compactRange: string = addresses.length > 0
                ? this.buildAddressRangeText(addresses) : 'selected cells';
            const valueText: string = uniqueValues.length === 1
                ? `${uniqueValues[0]}` : `${commands.length} different values`;
            message = `Updated cell range ${compactRange} with ${valueText}.`;
            break;
        }
        case 'cellFormat':
            message = `Applied cell formatting across ${commands.length} range(s): ${rangeText}.`;
            break;
        case 'numberFormat': {
            const formats: string[] = Array.from(new Set<string>(
                commands.map((cmd: AssistCommand) => cmd.args && cmd.args.format).filter(Boolean)
            ));
            const formatText: string = formats.length === 1 ? formats[0] : 'multiple formats';
            message = `Applied ${formatText} number format to ${commands.length} range(s): ${rangeText}.`;
            break;
        }
        default:
            message = `Applied ${action} to ${commands.length} range(s): ${rangeText}.`;
        }
        return { action, success: true, message, data: { ranges } };
    }

    private executeEdit(data: AssistCommandArgs): string {
        let sheetName: string;
        let address: string = this.getTargetAddress(data && (data.address));
        if (address.includes('!')) {
            const lastIndex: number = address.lastIndexOf('!');
            sheetName = address.substring(0, lastIndex);
            if (getSheetIndex(this.parent, sheetName) !== undefined) {
                return `Sheet "${sheetName}" not found.`;
            }
            address = address.substring(lastIndex + 1);
        } else {
            sheetName = this.parent.getActiveSheet().name;
        }
        const value: string = data.value;
        const eventArgs: { address: string, value: string, cancel?: boolean } = { address: `${sheetName}!${address}`, value: value };
        this.parent.notify(applyEditAction, eventArgs);
        if (eventArgs.cancel) {
            return 'Cannot edit read-only cell or edit was cancelled.';
        }
        return `Updated ${address} to ${value}.`;
    }

    private executeFindReplace(data: AssistCommandArgs): string {
        if (isNullOrUndefined(data) || isNullOrUndefined(data.findValue) || isNullOrUndefined(data.replaceValue)) {
            return 'Please provide both the value to replace and the replacement value.';
        }
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const findOptions: any = {
            value: (data.findValue).toString(),
            replaceValue: (data.replaceValue).toString(),
            mode: 'Sheet',
            sheetIndex: this.parent.activeSheetIndex,
            isCSen: data.caseSensitive === true,
            isEMatch: data.exactMatch === true,
            searchBy: 'By Row',
            isAction: true
        };
        this.parent.notify(replaceAll, findOptions);
        const caseInfo: string = data.caseSensitive === true ? ' (case-sensitive)' : '';
        const matchInfo: string = data.exactMatch === true ? ' with exact match' : '';
        return `Replaced all occurrences of "${data.findValue}" with "${data.replaceValue}"${caseInfo}${matchInfo}.`;
    }

    private executeFind(data: AssistCommandArgs): { message: string; addresses: string[] } {
        if (isNullOrUndefined(data) || isNullOrUndefined(data.findValue) || data.findValue === '') {
            return { message: 'Please provide a value to find.', addresses: [] };
        }
        const sheetIndex: number = this.resolveSheetIndex(data.sheetName);
        const sheetName: string = this.parent.sheets[sheetIndex as number].name;
        const findCollection: string[] = [];
        const findArgs: {
            value: string, mode: string, sheetIndex: number,
            isCSen: boolean, isEMatch: boolean, findCollection: string[]
        } = {
            value: data.findValue.toString(),
            mode: 'Sheet',
            sheetIndex: sheetIndex,
            isCSen: data.caseSensitive === true,
            isEMatch: data.exactMatch === true,
            findCollection: findCollection
        };
        this.parent.notify(findAllValues, findArgs);
        const addresses: string[] = this.filterAddressesByRange(findCollection, data.range);
        const caseInfo: string = data.caseSensitive === true ? ' (case-sensitive)' : '';
        const matchInfo: string = data.exactMatch === true ? ' with exact match' : '';
        const rangeInfo: string = !isNullOrUndefined(data.range) && data.range !== '' ? ` in range ${data.range}` : '';
        const message: string = addresses.length === 0
            ? `No matches found for "${data.findValue}" in sheet "${sheetName}"${rangeInfo}${caseInfo}${matchInfo}.`
            : `Found ${addresses.length} match(es) for "${data.findValue}" in sheet "${sheetName}"${rangeInfo}${caseInfo}${matchInfo}.`;
        return { message, addresses };
    }

    private executeNumberFormat(data: AssistCommandArgs): string {
        if (isNullOrUndefined(data) || isNullOrUndefined(data.format)) {
            return 'Please provide a number format pattern.';
        }
        const range: string = this.getTargetRange(data.range);
        const applyArgs: { format: string, range: string, cancel?: boolean } = { format: getFormatFromType(data.format), range: range };
        this.parent.notify(applyNumberFormat, applyArgs);
        if (applyArgs.cancel) {
            return '';
        }
        return `Applied number format ${data.format} to ${range}.`;
    }

    private executeCellFormat(data: AssistCommandArgs): string {
        if (isNullOrUndefined(data) || isNullOrUndefined(data.formatting) || Object.keys(data.formatting).length === 0) {
            return 'Please provide style properties to apply.';
        }
        const range: string = this.getTargetRange(data.range);
        const sheetName: string = this.parent.getActiveSheet().name;
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const src: { [key: string]: any } = data.formatting;
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const style: { [key: string]: any } = {};
        if (src.bold !== undefined) { style.fontWeight = src.bold === true ? 'bold' : 'normal'; }
        if (src.italic !== undefined) { style.fontStyle = src.italic === true ? 'italic' : 'normal'; }
        const hasUnderline: boolean = src.underline === true;
        const hasStrike: boolean = src.strikethrough === true;
        if (hasUnderline || hasStrike) {
            style.textDecoration = hasUnderline && hasStrike ? 'underline line-through' : (hasUnderline ? 'underline' : 'line-through');
        }
        if (src.fontSize !== undefined) {
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            const fs: any = src.fontSize;
            if (typeof fs === 'number') { style.fontSize = `${fs}pt`; }
            else if (typeof fs === 'string' && /^\d+$/.test(fs)) { style.fontSize = `${fs}pt`; }
            else { style.fontSize = fs; }
        }
        if (src.fontFamily) { style.fontFamily = src.fontFamily; }
        if (src.color) { style.color = src.color; }
        if (src.backgroundColor) { style.backgroundColor = src.backgroundColor; }
        Object.keys(src).forEach((k: string) => {
            if (['bold', 'italic', 'underline', 'strikethrough', 'fontSize', 'fontFamily', 'color', 'backgroundColor'].indexOf(k) === -1) {
                style[k as string] = src[k as string];
            }
        });
        this.parent.notify(setCellFormat, {
            range: sheetName + '!' + range, style: style as CellStyleModel,
            onActionUpdate: true, refreshRibbon: true
        } as SetCellFormatArgs);
        return `Applied cell style to ${range}.`;
    }

    private executeConditionalFormat(data: AssistCommandArgs): string {
        if (isNullOrUndefined(data)) {
            return 'Please provide conditional format details.';
        }
        const range: string = this.getTargetRange(data.range);
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const cfModel: any = {
            range: range,
            type: data.type,
            value: !isNullOrUndefined(data.value) ? String(data.value) : undefined,
            cFColor: data.cFColor,
            format: data.format
        };
        const args: CFArgs = { cfModel: cfModel, isAction: true };
        this.parent.notify(setCFRule, args);
        return `Applied conditional format (${cfModel.type}) to ${range}.`;
    }

    private executeMerge(data: AssistCommandArgs): string {
        if (isNullOrUndefined(data)) {
            return 'Please provide merge range or address.';
        }
        const range: string = this.getTargetRange(data.range);
        const mergeType: string = data.direction;
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const args: any = { range: range, type: mergeType, merge: true, isAction: true, refreshRibbon: true };
        this.parent.notify(setMerge, args);
        return `Merged ${range} as ${mergeType}.`;
    }

    private async executeCut(data: AssistCommandArgs): Promise<string> {
        if (isNullOrUndefined(data) || isNullOrUndefined(data.range)) {
            return 'Please provide a range to cut.';
        }
        const rangeStr: string = this.getTargetRange(data.range);
        const indices: number[] = getSwapRange(getRangeIndexes(rangeStr));
        this.parent.notify(cut, { range: indices, sId: this.parent.getActiveSheet().id, invokeCopy: true });
        return `Cut ${rangeStr}. Use paste to place it at the target location.`;
    }

    private async executeCopy(data: AssistCommandArgs): Promise<string> {
        if (isNullOrUndefined(data) || isNullOrUndefined(data.range)) {
            return 'Please provide a range to copy.';
        }
        const rangeStr: string = this.getTargetRange(data.range);
        const indices: number[] = getSwapRange(getRangeIndexes(rangeStr));
        this.parent.notify(copy, { range: indices, sId: this.parent.getActiveSheet().id, invokeCopy: true });
        return `Copied ${rangeStr}.`;
    }

    private executePaste(data: AssistCommandArgs): string {
        if (isNullOrUndefined(data) || isNullOrUndefined(data.range)) {
            return 'Please provide a paste target address.';
        }
        const rangeStr: string = this.getTargetRange(data.range);
        const indices: number[] = getSwapRange(getRangeIndexes(rangeStr));
        const sheetIndex: number = this.parent.activeSheetIndex;
        this.parent.notify(paste, { range: indices, sIdx: sheetIndex, isAction: true, isInternal: true });
        return `Pasted into ${rangeStr}.`;
    }

    private executeWrap(data: AssistCommandArgs): string {
        const range: string = this.getTargetRange(data && data.range);
        const wrapFlag: boolean = data.wrap;
        const applyArgs: { address: string, wrap: boolean, range: string, cancel?: boolean } = {
            address: `${this.parent.getActiveSheet().name}!${range}`,
            wrap: wrapFlag,
            range: range
        };
        this.parent.notify(applyWrapText, applyArgs);
        if (applyArgs.cancel) {
            return applyArgs.cancel ? 'Cannot change wrap on read-only range or cancelled.' : '';
        }
        return `${wrapFlag ? 'Enabled' : 'Disabled'} wrap for ${range}.`;
    }

    private executeChart(data: AssistCommandArgs): string {
        if (isNullOrUndefined(data)) {
            return 'Please provide chart details such as type and range.';
        }
        const range: string = this.getTargetRange(data.range);
        const chartModel: ChartModel = {
            type: data.chartType as ChartType,
            range: `${this.parent.getActiveSheet().name}!${range}`,
            theme: (data.theme as ChartTheme) || 'Material',
            title: data.title || '',
            isSeriesInRows: data.isSeriesInRows === true,
            height: data.height || 290,
            width: data.width || 480,
            markerSettings: { visible: false, isFilled: true }
        };
        this.parent.notify(setChart, { chart: [chartModel] });
        return `Inserted ${chartModel.type} chart for range ${range}.`;
    }

    private executeDataValidation(data: AssistCommandArgs): string {
        if (isNullOrUndefined(data) || isNullOrUndefined(data.dvType)) {
            return 'Please provide data validation details (type and range).';
        }
        const range: string = this.getTargetRange(data.range);
        const fullRange: string = this.parent.getActiveSheet().name + '!' + range;
        this.parent.notify(applyDataValidation, {
            range: fullRange,
            value1: data.dvValue1,
            value2: data.dvValue2 || '',
            ignoreBlank: data.dvIgnoreBlank !== false,
            type: data.dvType as ValidationType,
            operator: data.dvOperator as ValidationOperator,
            inCellDropDown: data.dvInCellDropDown !== false,
            cancel: false
        });
        return `Applied ${data.dvType} validation (${data.dvOperator}) to ${range}.`;
    }

    private executeFilter(data: AssistCommandArgs): string {
        if (isNullOrUndefined(data)) {
            return 'Please provide filter details such as column and value.';
        }
        const range: string = this.getTargetRange(data.range);
        const sheetIndex: number = this.parent.activeSheetIndex;
        if (data.clearFilter === true) {
            this.parent.notify(initiateFilterUI, { range: range, sIdx: sheetIndex, predicates: [], isInternal: false });
            return `Cleared filter on ${range}.`;
        }
        if (isNullOrUndefined(data.filterColumn) || data.filterColumn === '') {
            return 'Please provide a column to filter.';
        }
        const colLetter: string = data.filterColumn.toUpperCase().replace(/[^A-Z]/g, '');
        const colIndex: number = getIndexesFromAddress(`${colLetter}1`)[1];
        const field: string = getColumnHeaderText(colIndex + 1);
        const operator: string = data.filterOperator;
        const predicates: object[] = [{
            field: field,
            operator: operator,
            value: data.filterValue,
            matchCase: false,
            ignoreAccent: false,
            predicate: 'and',
            type: 'string'
        }];
        this.parent.notify(initiateFilterUI, {
            predicates: predicates,
            range: range,
            sIdx: sheetIndex,
            isInternal: false
        });
        return `Applied filter on column ${colLetter}: ${operator} "${data.filterValue}".`;
    }

    private executeSort(data: AssistCommandArgs): string {
        if (isNullOrUndefined(data)) {
            return 'Please provide sort details.';
        }
        const sheet: SheetModel = this.parent.getActiveSheet();
        const hasRange: boolean = !isNullOrUndefined(data.range) && data.range !== '' &&
            data.range.toLowerCase() !== 'selected';
        const range: string = hasRange ? data.range : undefined;
        const effectiveRange: string = range || sheet.selectedRange;
        let field: string;
        if (!isNullOrUndefined(data.sortColumn) && data.sortColumn !== '') {
            const colLetter: string = data.sortColumn.toUpperCase().replace(/[^A-Z]/g, '');
            const colIndex: number = getIndexesFromAddress(`${colLetter}1`)[1];
            field = getColumnHeaderText(colIndex + 1);
        } else {
            const rangeIdx: number[] = getRangeIndexes(effectiveRange);
            field = getColumnHeaderText(rangeIdx[1] + 1);
        }
        const order: string = data.sortOrder;
        const containsHeader: boolean = data.sortContainsHeader !== false;
        const sortArgs: { sortOptions: object, range?: string } = {
            sortOptions: {
                sortDescriptors: { field: field, order: order },
                containsHeader: containsHeader
            }
        };
        if (hasRange) {
            sortArgs.range = range;
        }
        this.parent.notify(applySort, sortArgs);
        const rangeInfo: string = hasRange ? ` in range ${range}` : ' in the selected range';
        return `Sorted by column ${field}${rangeInfo} in ${order} order.`;
    }

    private executeInsert(data: AssistCommandArgs): string {
        if (isNullOrUndefined(data) || isNullOrUndefined(data.modelType)) {
            return 'Please provide modelType (Row or Column) and startIndex.';
        }
        const type: string = data.modelType;
        if (!type) {
            return 'Invalid modelType. Please specify "Row" or "Column".';
        }
        const startIdx: number = Math.max(0, data.startIndex - 1);
        const count: number = Math.max(1, data.count);
        const endIdx: number = !isNullOrUndefined(data.endIndex)
            ? Math.max(startIdx, data.endIndex - 1)
            : startIdx + count - 1;
        this.parent.notify(insertModel, {
            model: this.parent.getActiveSheet(),
            start: startIdx,
            end: endIdx,
            modelType: type,
            isAction: true,
            insertType: 'above'
        });
        const insertedCount: number = (endIdx - startIdx) + 1;
        return `Inserted ${insertedCount} ${type}(s) at position ${data.startIndex}.`;
    }

    private executeDelete(data: AssistCommandArgs): string {
        if (isNullOrUndefined(data) || isNullOrUndefined(data.modelType)) {
            return 'Please provide modelType (Row or Column) and startIndex.';
        }
        const type: string = data.modelType;
        if (!type) {
            return 'Invalid modelType. Please specify "Row" or "Column".';
        }
        const startIdx: number = Math.max(0, data.startIndex - 1);
        const count: number = Math.max(1, data.count);
        const endIdx: number = !isNullOrUndefined(data.endIndex)
            ? Math.max(startIdx, data.endIndex - 1)
            : startIdx + count - 1;
        this.parent.notify(deleteModel, {
            model: this.parent.getActiveSheet(),
            start: startIdx,
            end: endIdx,
            modelType: type,
            isAction: true
        });
        const deletedCount: number = (endIdx - startIdx) + 1;
        return `Deleted ${deletedCount} ${type}(s) starting at position ${data.startIndex}.`;
    }

    private executeInsertSheet(data: AssistCommandArgs): string {
        const count: number = (typeof data.count === 'number' && data.count > 0) ? data.count : 1;
        const startIndex: number = typeof data.startIndex === 'number'
            ? data.startIndex
            : this.parent.sheets.length;
        const sheets: SheetModel[] = [];
        for (let i: number = 0; i < count; i++) {
            sheets.push(count === 1 && data.sheetName ? { name: data.sheetName } : {});
        }
        this.parent.insertSheet(sheets, undefined);
        return `Inserted ${count} sheet(s) at position ${startIndex}.`;
    }

    private executeAutoFill(data: AssistCommandArgs): string {
        if (isNullOrUndefined(data) || isNullOrUndefined(data.dataRange) || isNullOrUndefined(data.fillRange)) {
            return 'Please provide both dataRange (source) and fillRange (target) for autofill.';
        }
        const dataRange: string = this.getTargetRange(data.dataRange);
        const fillRange: string = this.getTargetRange(data.fillRange);
        const fillRangeIndices: number[] = getRangeIndexes(fillRange);
        const rangeInfo: FillRangeInfo = {
            startCell: { rowIndex: fillRangeIndices[0], colIndex: fillRangeIndices[1] },
            endCell:   { rowIndex: fillRangeIndices[2], colIndex: fillRangeIndices[3] },
            fillRange: fillRangeIndices,
            direction: data.direction as AutoFillDirection || undefined
        };
        this.parent.notify(performAutoFill, {
            dAutoFillCell: dataRange,
            fillType: data.fillType as AutoFillType,
            rangeInfo: rangeInfo
        });
        return `AutoFilled ${fillRange} from ${dataRange}).`;
    }

    private executeFreezePanes(data: AssistCommandArgs): string {
        if (isNullOrUndefined(data) || isNullOrUndefined(data.freezeType)) {
            return 'Please specify freezeType: "Rows", "Columns", "Panes", or "Unfreeze".';
        }
        if (!this.parent.allowFreezePane) {
            return 'Freeze pane is not enabled. Set allowFreezePane to true.';
        }
        const freezeType: string = data.freezeType.toLowerCase().trim();
        let row: number = 0;
        let column: number = 0;
        switch (freezeType) {
        case 'rows':
            row = Math.max(1, data.row);
            column = 0;
            break;
        case 'columns':
            row = 0;
            column = Math.max(1, data.column);
            break;
        case 'panes':
            row = Math.max(1, data.row);
            column = Math.max(1, data.column);
            break;
        case 'unfreeze':
            row = 0;
            column = 0;
            break;
        default:
            return `Unknown freezeType "${data.freezeType}". Use "Rows", "Columns", "Panes", or "Unfreeze".`;
        }
        this.parent.notify(freeze, { row: row, column: column, triggerEvent: true });
        if (freezeType === 'unfreeze') {
            return 'Removed all freeze panes from the active sheet.';
        }
        return `Frozen ${row > 0 ? `${row} row(s)` : ''}${row > 0 && column > 0 ? ' and ' : ''}${column > 0 ? `${column} column(s)` : ''} on the active sheet.`;
    }

    private executeHyperlink(data: AssistCommandArgs): string {
        if (isNullOrUndefined(data) || isNullOrUndefined(data.address) || data.address === '') {
            return 'Please provide an address (URL or cell/sheet reference) for the hyperlink.';
        }
        const range: string = this.getTargetRange(data.range);
        const sheetName: string = this.parent.getActiveSheet().name;
        const cellAddress: string = `${sheetName}!${range}`;
        const displayText: string = !isNullOrUndefined(data.displayText) && data.displayText !== ''
            ? data.displayText : null;
        this.parent.insertHyperlink(data.address, cellAddress, displayText, false);
        return `Inserted hyperlink to "${data.address}" in ${range}${displayText ? ` with display text "${displayText}"` : ''}.`;
    }

    private executeSave(data: AssistCommandArgs): string {
        const type: string = (data.saveType as string || 'xlsx').toLowerCase();
        const validTypes: string[] = ['xlsx', 'xls', 'csv', 'pdf'];
        if (validTypes.indexOf(type) === -1) {
            return `Saving in '${type}' format is not supported. Valid save types are 'xlsx', 'xls', 'csv', and 'pdf'.`;
        }
        this.parent.notify(exportDialog, { item: { id: `${this.parent.element.id}_${type[0].toUpperCase() + type.substring(1)}` } });
        return 'Save dialog opened';
    }

    private buildReportNarrative(report: AnalyticalReport | string): string {
        if (typeof report === 'string') {
            try {
                report = JSON.parse(report) as AnalyticalReport;
            } catch {
                return 'Report generation failed: invalid report structure format.';
            }
        }
        const escapeCell: (s: string | number | boolean) => string = (s: string | number | boolean): string => {
            if (s === null || s === undefined) { return ''; }
            return `${s}`.replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
        };
        let narrative: string = '**Report Summary**\n\n';
        if (report.summary) {
            narrative += `${report.summary}\n\n`;
        }
        if (report.kpis && report.kpis.length > 0) {
            narrative += '**Key KPIs:**\n';
            report.kpis.forEach((kpi: { name: string; value: string; formula?: string }) => {
                narrative += `- ${kpi.name}: ${kpi.value}` + (kpi.formula ? ` (formula: ${kpi.formula})` : '') + '\n';
            });
            narrative += '\n';
        }
        if (report.topRows && report.topRows.length > 0) {
            const rows: { row: number; values: Record<string, string | number | boolean>; }[] =
                report.topRows.slice(0, 5) as Array<{ row: number; values: Record<string, string | number | boolean> }>;
            const firstValues: Record<string, string | number | boolean> = (rows[0] && rows[0].values);
            const headers: string[] = Object.keys(firstValues);
            if (headers.length > 0) {
                narrative += '**Top Rows (sample):**\n\n';
                narrative += `| ${headers.map((h: string) => escapeCell(h)).join(' | ')} |\n`;
                narrative += `| ${headers.map(() => '---').join(' | ')} |\n`;
                rows.forEach((r: { row: number; values: Record<string, string | number | boolean> }) => {
                    const vals: string[] = headers.map((h: string) => {
                        return escapeCell((r.values && r.values[h as string] !== undefined)
                            ? (r.values[h as string] as string | number | boolean) : '');
                    });
                    narrative += `| ${vals.join(' | ')} |\n`;
                });
                narrative += '\n';
            }
        }
        if (report.visualSuggestions && report.visualSuggestions.length > 0) {
            narrative += '**Visual Suggestions:**\n';
            report.visualSuggestions.forEach((v: { chartType: string; range: string; reason?: string }) => {
                narrative += `- ${v.chartType}: range ${v.range}` + (v.reason ? ` — ${v.reason}` : '') + '\n';
            });
            narrative += '\n';
        }
        if (report.sections && report.sections.length > 0) {
            report.sections.forEach((section: { heading: string; content: string }) => {
                narrative += `**${section.heading}**\n${section.content}\n\n`;
            });
        }
        if (report.kpis && report.kpis.some((k: { name: string; value: string; formula?: string; }) =>
            k.formula && k.formula.length > 0)) {
            narrative += '**Suggested Formulas:**\n';
            report.kpis.forEach((k: { name: string; value: string; formula?: string }) => {
                if (k.formula) {
                    narrative += `- ${k.name}: ${k.formula}\n`;
                }
            });
            narrative += '\n';
        }
        return narrative.trim();
    }

    private resolveSheetIndex(sheetName?: string): number {
        if (!isNullOrUndefined(sheetName) && sheetName !== '') {
            const idx: number = this.parent.sheets.findIndex(
                (s: SheetModel) => s.name === sheetName
            );
            if (idx >= 0) { return idx; }
        }
        return this.parent.activeSheetIndex;
    }

    private filterAddressesByRange(addresses: string[], range?: string): string[] {
        if (isNullOrUndefined(range) || range === '' || addresses.length === 0) {
            return addresses;
        }
        try {
            const [r0, c0, r1, c1]: number[] = getRangeIndexes(range);
            const minRow: number = Math.min(r0, r1);
            const maxRow: number = Math.max(r0, r1);
            const minCol: number = Math.min(c0, c1);
            const maxCol: number = Math.max(c0, c1);
            return addresses.filter((addr: string) => {
                const cellPart: string = addr.indexOf('!') >= 0 ? addr.split('!')[1] : addr;
                const [rr, cc]: number[] = getRangeIndexes(cellPart);
                return rr >= minRow && rr <= maxRow && cc >= minCol && cc <= maxCol;
            });
        } catch {
            return addresses;
        }
    }

    private getTargetRange(address: string): string {
        const sheet: SheetModel = this.parent.getActiveSheet();
        const fallback: string = sheet.selectedRange;
        if (isNullOrUndefined(address) || address === '' || address.toLowerCase() === 'selected') {
            return fallback;
        }
        return address;
    }

    private getTargetAddress(address: string): string {
        const sheet: SheetModel = this.parent.getActiveSheet();
        const fallback: string = (sheet.selectedRange).split(':')[0];
        if (isNullOrUndefined(address) || address === '' || address.toLowerCase() === 'selected') {
            return fallback;
        }
        return address.split(':')[0];
    }

    private buildAddressRangeText(addresses: string[]): string {
        if (addresses.length === 0) { return ''; }
        if (addresses.length === 1) { return addresses[0]; }
        try {
            const indices: number[][] = addresses.map((a: string) => getRangeIndexes(a));
            const minRow: number = Math.min(...indices.map((idx: number[]) => idx[0]));
            const minCol: number = Math.min(...indices.map((idx: number[]) => idx[1]));
            const maxRow: number = Math.max(...indices.map(
                (idx: number[]) => idx[2] !== undefined ? idx[2] : idx[0]));
            const maxCol: number = Math.max(...indices.map(
                (idx: number[]) => idx[3] !== undefined ? idx[3] : idx[1]));
            const startCell: string = `${getColumnHeaderText(minCol + 1)}${minRow + 1}`;
            const endCell: string = `${getColumnHeaderText(maxCol + 1)}${maxRow + 1}`;
            return startCell === endCell ? startCell : `${startCell}:${endCell}`;
        } catch {
            return `${addresses[0]}:${addresses[addresses.length - 1]}`;
        }
    }

    private wrapResult(
        action: string,
        message: string,
        data: Record<string, unknown> = {},
        success: boolean = true
    ): CommandResult {
        return { action, success, message, data };
    }

    private errorResult(action: string, code: string, message: string): CommandResult {
        return { action, success: false, message, error: { code, message } };
    }

    /**
     * Get the spreadsheet commandexecuter module name.
     *
     * @returns {string} - Get the spreadsheet commandexecuter module name.
     */
    public getModuleName(): string {
        return 'CommandExecuter';
    }

    /**
     * To Remove the event listeners.
     *
     * @returns {void} - To Remove the event listeners.
     */
    public destroy(): void {
        this.parent = null;
    }
}

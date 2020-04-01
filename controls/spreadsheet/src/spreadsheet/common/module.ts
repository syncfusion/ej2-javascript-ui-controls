import { ModuleDeclaration } from '@syncfusion/ej2-base';
import { Spreadsheet } from '../base/index';
import { getWorkbookRequiredModules } from '../../workbook/common/module';

/**
 * To get Spreadsheet required modules.
 * @hidden
 * @param {Spreadsheet} context
 */
export function getRequiredModules(context: Spreadsheet): ModuleDeclaration[] {
    let modules: ModuleDeclaration[] = [];
    pushBasicModules(context, modules);
    getWorkbookRequiredModules(context, modules);
    return modules;
}

 // tslint:disable-next-line:max-func-body-length
function pushBasicModules(context: Spreadsheet, modules: ModuleDeclaration[]): void {
    modules.push({ member: 'basic', args: [] });
    modules.push({ member: 'all', args: [] });
    if (context.showRibbon) {
        modules.push({
            member: 'ribbon',
            args: [context]
        });
    }
    if (context.showFormulaBar) {
        modules.push({
            member: 'formulaBar',
            args: [context]
        });
    }
    if (context.showSheetTabs) {
        modules.push({
            member: 'sheetTabs',
            args: [context]
        });
    }
    if (context.allowEditing) {
        modules.push({
            member: 'edit',
            args: [context]
        });
        modules.push({
            member: 'formula',
            args: [context]
        });
        modules.push({
            member: 'workbookFormula',
            args: [context]
        });
        modules.push({
            member: 'workbookEdit',
            args: [context]
        });
    }
    if (context.allowOpen) {
        modules.push({
            member: 'open',
            args: [context]
        });
    }
    if (context.allowSave) {
        modules.push({
            member: 'save',
            args: [context]
        });
    }
    if (context.enableContextMenu) {
        modules.push({
            member: 'contextMenu',
            args: [context]
        });
    }
    if (context.selectionSettings.mode !== 'None') {
        modules.push({
            member: 'selection',
            args: [context]
        });
    }
    if (context.enableKeyboardNavigation) {
        modules.push({
            member: 'keyboardNavigation',
            args: [context]
        });
    }
    if (context.allowNumberFormatting) {
        modules.push({
            member: 'numberFormat',
            args: [context]
        });
    }
    if (context.enableKeyboardShortcut) {
        modules.push({
            member: 'keyboardShortcut',
            args: [context]
        });
    }
    if (context.enableClipboard) {
        modules.push({
            member: 'clipboard',
            args: [context]
        });
    }
    if (context.allowCellFormatting) {
        modules.push({
            member: 'cellformat',
            args: [context]
        });
    }
    if (context.allowSorting) {
        modules.push({ member: 'sort', args: [context] });
    }
    if (context.allowResizing) {
        modules.push({
            member: 'resize',
            args: [context]
        });
    }
    modules.push({
        member: 'collaborativeEditing',
        args: [context]
    });
    modules.push({
        member: 'protectSheet',
        args: [context]
    });
    if (context.allowHyperlink) {
        modules.push({
            member: 'spreadsheetHyperlink',
            args: [context]
        });
    }
    if (context.allowUndoRedo) {
        modules.push({
            member: 'undoredo',
            args: [context]
        });
    }
    if (context.allowFiltering) {
        modules.push({ member: 'filter', args: [context] });
    }
    if (context.allowWrap) {
        modules.push({ member: 'wrapText', args: [context] });
    }
    if (context.allowInsert) {
        modules.push({ member: 'insert', args: [context] });
    }
    if (context.allowDelete) {
        modules.push({ member: 'delete', args: [context] });
    }
    if (context.allowDataValidation) {
        modules.push({ member: 'dataValidation', args: [context] });
    }
    if (context.allowFindAndReplace) {
        modules.push({ member: 'findAndReplace', args: [context] });
    }
    if (context.allowMerge) {
        modules.push({ member: 'merge', args: [context] });
    }
}
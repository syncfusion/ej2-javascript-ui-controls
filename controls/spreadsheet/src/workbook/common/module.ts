import { ModuleDeclaration } from '@syncfusion/ej2-base';
import { Workbook } from '../base/index';

/**
 * To get Workbook required modules.
 * @hidden
 * @param {Workbook} context
 */
export function getWorkbookRequiredModules(context: Workbook, modules: ModuleDeclaration[] = []): ModuleDeclaration[] {
    modules.push({ member: 'workbookBasic', args: [] });
    modules.push({ member: 'workbookAll', args: [] });
    modules.push({
        member: 'dataBind',
        args: [context]
    });
    modules.push({
        member: 'workbookProtectSheet',
        args: [context]
    });
    if (context.allowSave) {
        modules.push({
            member: 'workbookSave',
            args: [context]
        });
    }
    if (context.allowOpen) {
        modules.push({
            member: 'workbookOpen',
            args: [context]
        });
    }
    if (context.allowEditing) {
        modules.push({
            member: 'workbookEdit',
            args: [context]
        });
        modules.push({
            member: 'workbookFormula',
            args: [context]
        });
    }
    if (context.allowNumberFormatting) {
        modules.push({
            member: 'workbookNumberFormat',
            args: [context]
        });
    }
    if (context.allowCellFormatting) {
        modules.push({
            member: 'workbookcellformat',
            args: [context]
        });
    }
    if (context.allowSorting) {
        modules.push({ member: 'workbookSort', args: [context] });
    }
    if (context.allowHyperlink) {
        modules.push({ member: 'workbookHyperlink', args: [context] });
    }
    if (context.allowFiltering) {
        modules.push({ member: 'workbookFilter', args: [context] });
    }
    if (context.allowFindAndReplace) {
        modules.push({ member: 'workbookfindAndReplace', args: [context] });
    }
    if (context.allowInsert) {
        modules.push({ member: 'workbookinsert', args: [context] });
    }
    if (context.allowDelete) {
        modules.push({ member: 'workbookdelete', args: [context] });
    }
    if (context.allowDataValidation) {
        modules.push({ member: 'workbookDataValidation', args: [context] });
    }
    return modules;
}
import { remove, L10n, createElement, extend } from '@syncfusion/ej2-base';
import { Dialog, DialogModel } from '@syncfusion/ej2-popups';
import { QueryBuilder, QueryBuilderModel, RuleModel } from '@syncfusion/ej2-querybuilder';
import { Predicate, Query } from '@syncfusion/ej2-data';
import {
    IGrid, QueryBuilderColumnDefinition, DialogButtonDefinition,
    AdvancedFilterOpenEventArgs, AdvancedFilterCloseEventArgs,
    IAction
} from '../base/interface';
import { AdvancedFilterSettingsModel } from '../base/grid-model';
import { ServiceLocator } from '../services/service-locator';
import * as events from '../base/constant';
import { Column } from '../models/column';
import { Grid } from '../base/grid';

export class AdvancedFilter implements IAction {

    private parent: IGrid;
    private serviceLocator: ServiceLocator;
    private dialog: Dialog | null = null;
    private queryBuilder: QueryBuilder | null = null;
    private currentRule: RuleModel | null = null;
    private filterRuleToRestore: RuleModel | null = null;
    private qbContainer: HTMLElement | null = null;
    private dialogContainer: HTMLElement | null = null;
    private l10n: L10n;
    /** @hidden */
    public baseQuery: Query | null = null;
    private hasEmptyState: boolean = false;
    private isAdvancedFilterApplied: boolean = false;
    private filterRequestType: 'filtering' | 'clear-filtering' | null = null;

    constructor(parent: IGrid, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.serviceLocator = serviceLocator as ServiceLocator;
        this.l10n = this.serviceLocator.getService<L10n>('localization');
        this.addEventListener();
    }

    protected getModuleName(): string {
        return 'advancedFilter';
    }

    public destroy(): void {
        this.removeEventListener();
        if (this.queryBuilder && !this.queryBuilder.isDestroyed) {
            this.queryBuilder.destroy();
        }
        if (this.dialog && !this.dialog.isDestroyed) {
            this.dialog.destroy();
        }
        if (this.dialogContainer) {
            remove(this.dialogContainer);
            this.dialogContainer = null;
        }
        this.queryBuilder = null;
        this.dialog = null;
        this.currentRule = null;
        this.filterRuleToRestore = null;
        this.baseQuery = null;
        this.hasEmptyState = false;
        this.filterRequestType = null;
    }

    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.refreshComplete, this.refreshComplete, this);
        this.parent.on(events.cancelBegin, this.cancelBeginEvent, this);
    }

    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.refreshComplete, this.refreshComplete);
        this.parent.off(events.cancelBegin, this.cancelBeginEvent);
    }

    private getAdvancedFilterSettings(): AdvancedFilterSettingsModel {
        return (this.parent.advancedFilterSettings as AdvancedFilterSettingsModel) || {};
    }

    public openDialog(): void {
        if (!this.parent.allowAdvancedFiltering) {
            return;
        }
        if (!this.dialog) {
            this.createDialog();
        }
        if (this.dialog && this.dialog.visible === false) {
            const eventArgs: AdvancedFilterOpenEventArgs = {
                requestType: 'advancedFilterOpen',
                dialog: this.dialog,
                queryBuilder: this.queryBuilder
            };
            this.parent.trigger('advancedFilterOpen', eventArgs);
            this.dialog.show();
        }
    }

    public closeDialog(): void {
        if (this.dialog && this.dialog.visible) {
            this.saveCurrentValidRule();
            this.dialog.hide();
        }
    }

    /// Saves the current valid rule from the dialog's QueryBuilder before closing.
    private saveCurrentValidRule(): void {
        if (!this.queryBuilder) {
            return;
        }
        const currentDialogRule: RuleModel = this.queryBuilder.getRules() as RuleModel;
        if (!this.hasValidFilterRule(currentDialogRule)) {
            this.filterRuleToRestore = null;
            return;
        }
        this.filterRuleToRestore = extend({}, {}, currentDialogRule, true) as RuleModel;
    }

    /// Validates if a rule contains all required filter information (field, operator, and value).
    private hasValidFilterRule(rule: RuleModel | null | undefined): boolean {
        if (!rule) {
            return false;
        }
        if (rule.rules && rule.rules.length > 0) {
            return rule.rules.some((child: RuleModel): boolean => this.hasValidFilterRule(child));
        }
        return !!(rule.field && rule.operator && (this.isValueLessOperator(rule.operator)
            || (rule.value !== undefined && rule.value !== null && rule.value !== '')));
    }

    /// Applies an advanced filter rule to the grid data. Triggers events and updates the query.
    public applyFilter(rule?: RuleModel): void {
        if (!rule || !rule.rules || rule.rules.length === 0 || this.isEmptyRule(rule)) {
            this.clearFilter();
            return;
        }
        if (this.dialog && this.dialog.visible) {
            const closeArgs: AdvancedFilterCloseEventArgs = {
                requestType: 'advancedFilterClose',
                dialog: this.dialog,
                queryBuilder: this.queryBuilder,
                cancel: false
            };
            this.parent.trigger('advancedFilterClose', closeArgs);
            if (closeArgs.cancel) {
                return;
            }
            this.closeDialog();
        }
        this.hasEmptyState = false;
        this.parent.trigger(events.advancedFilterBegin, {
            requestType: 'filtering',
            type: events.advancedFilterBegin,
            cancel: false,
            rule: rule,
            dialog: this.dialog,
            queryBuilder: this.queryBuilder
        });
        const predicate: Predicate | null = this.getPredicateFromRule(rule);
        if (!predicate) {
            return;
        }
        if (!this.baseQuery && this.parent.query) {
            this.baseQuery = this.parent.query.clone();
        }
        this.isAdvancedFilterApplied = true;
        this.filterRequestType = 'filtering';
        this.currentRule = extend({}, {}, rule, true) as RuleModel;
        this.filterRuleToRestore = extend({}, {}, rule, true) as RuleModel;
        if (this.baseQuery) {
            this.parent.query = this.baseQuery.clone().where(predicate);
        } else {
            this.parent.query = new Query().where(predicate);
        }
        this.setAdvancedFilterEnabled(true);
    }

    public refreshComplete(args: { requestType?: string }): void {
        if (this.isAdvancedFilterApplied && args.requestType === 'refresh') {
            this.isAdvancedFilterApplied = false;
            this.parent.trigger(events.advancedFilterComplete, {
                requestType: this.filterRequestType || 'filtering',
                type: events.advancedFilterComplete,
                cancel: false,
                rule: this.currentRule
            });
            this.filterRequestType = null;
        }
    }

    private cancelBeginEvent(args: { requestType?: string }): void {
        if (this.isAdvancedFilterApplied && args.requestType === 'refresh') {
            this.isAdvancedFilterApplied = false;
            this.filterRequestType = null;
        }
    }

    /// Checks if a rule or any of its child rules contain empty values.
    private isEmptyRule(rule: RuleModel): boolean {
        if (!rule || !rule.rules || rule.rules.length === 0) {
            return true;
        }
        return rule.rules.every((child: RuleModel): boolean => {
            if (child.rules) {
                return this.isEmptyRule(child);
            }
            if (this.isValueLessOperator(child.operator)) {
                return false;
            }
            const value: RuleModel['value'] = child.value;
            return value === undefined || value === null || value === ''
                || (Array.isArray(value) && value.length === 0);
        });
    }

    /// Clears the advanced filter and restores the original query state.
    public clearFilter(): void {
        if (this.dialog && this.dialog.visible) {
            const closeArgs: AdvancedFilterCloseEventArgs = {
                requestType: 'advancedFilterClose',
                dialog: this.dialog,
                queryBuilder: this.queryBuilder,
                cancel: false
            };
            this.parent.trigger('advancedFilterClose', closeArgs);
            if (closeArgs.cancel) {
                return;
            }
            this.closeDialog();
        }
        this.isAdvancedFilterApplied = true;
        this.filterRequestType = 'clear-filtering';
        this.parent.trigger(events.advancedFilterBegin, {
            requestType: 'clear-filtering',
            type: events.advancedFilterBegin,
            cancel: false,
            dialog: this.dialog,
            queryBuilder: this.queryBuilder
        });
        this.parent.query = this.baseQuery || new Query();
        this.currentRule = null;
        this.filterRuleToRestore = null;
        this.baseQuery = null;
        this.hasEmptyState = true;
        this.setAdvancedFilterEnabled(false);
    }

    /// Refreshes the QueryBuilder UI when grid columns change.
    public refresh(): void {
        if (!this.queryBuilder || this.queryBuilder.isDestroyed) {
            return;
        }
        const columns: QueryBuilderColumnDefinition[] = this.mapColumns();
        const emptyRule: RuleModel = { condition: 'and', rules: [] };
        const persistedValidRule: RuleModel | null = this.hasValidFilterRule(this.filterRuleToRestore)
            ? this.filterRuleToRestore
            : (this.hasValidFilterRule(this.currentRule) ? this.currentRule : null);
        const rule: RuleModel | null = persistedValidRule || (!this.hasEmptyState ? { condition: 'and', rules: [] } : emptyRule);
        if (columns.length > 0) {
            const normalizedRule: RuleModel | null = this.normalizeRule(rule, columns)
            || (this.hasEmptyState ? emptyRule : { condition: 'and', rules: [] });
            this.queryBuilder.setRules(normalizedRule);
        }
        this.queryBuilder.refresh();
    }

    /// Gets the currently active filter rule applied to the grid.
    public getRule(): RuleModel | null {
        return this.currentRule;
    }

    /// Sets the filter rule programmatically and updates the QueryBuilder UI.
    public setRule(rule: RuleModel | null): void {
        if (!rule) {
            this.currentRule = null;
            this.filterRuleToRestore = null;
            this.hasEmptyState = true;
            this.updateQueryBuilder({ condition: 'and', rules: [] });
            return;
        }
        this.currentRule = extend({}, {}, rule, true) as RuleModel;
        this.filterRuleToRestore = extend({}, {}, rule, true) as RuleModel;
        this.hasEmptyState = false;
        this.updateQueryBuilder(rule);
    }

    private updateQueryBuilder(rule: RuleModel): void {
        if (this.queryBuilder && !this.queryBuilder.isDestroyed) {
            this.queryBuilder.setRules(rule);
            this.queryBuilder.refresh();
        }
    }

    private setAdvancedFilterEnabled(active: boolean): void {
        const gridParent: Grid = this.parent as Grid;
        if (gridParent.toolbarModule) {
            gridParent.toolbarModule.enableAdvancedFilterButton(active);
        }
    }

    /// Maps grid columns to QueryBuilder compatible column definitions with appropriate types and operators.
    private mapColumns(): QueryBuilderColumnDefinition[] {
        if (!this.parent.columns || this.parent.columns.length === 0) {
            return [];
        }
        const qbColumns: QueryBuilderColumnDefinition[] = [];
        const includeHiddenColumns: boolean = this.getAdvancedFilterSettings().includeHiddenColumns === true;
        const processColumns: (columns: Column[]) => void = (columns: Column[]): void => {
            for (const col of columns) {
                if (col.columns && col.columns.length) {
                    processColumns(col.columns as Column[]);
                    continue;
                }
                if (col.allowFiltering === false || (!includeHiddenColumns && col.visible === false) || !col.field) {
                    continue;
                }
                const qbType: string = this.mapGridTypeToQBType(col.type);
                const qbColumn: QueryBuilderColumnDefinition = {
                    field: col.field,
                    label: col.headerText || col.field,
                    type: qbType,
                    operators: this.getOperatorsForType(qbType).map((op: string) => ({
                        key: this.getOperatorLabel(op),
                        value: op
                    })),
                    dataSource: col.dataSource,
                    format: (col.type === 'date' || col.type === 'dateonly' || col.type === 'datetime') ? (col.format || 'yMd') as string : undefined
                };
                qbColumns.push(qbColumn);
            }
        };
        processColumns(this.parent.columns as Column[]);
        return qbColumns;
    }

    /// Converts EJ2 Grid column type to QueryBuilder compatible type.
    private mapGridTypeToQBType(gridType?: string): string {
        if (!gridType) {
            return 'string';
        }
        const typeMap: { [key: string]: string } = {
            'string': 'string',
            'number': 'number',
            'date': 'date',
            'dateonly': 'date',
            'datetime': 'date',
            'boolean': 'boolean'
        };
        return typeMap[gridType.toLowerCase()] || 'string';
    }

    /// Returns the valid filter operators available for a specific data type.
    private getOperatorsForType(type: string): string[] {
        const operatorsByType: { [key: string]: string[] } = {
            'number': ['equal', 'notequal', 'lessthan', 'lessthanorequal', 'greaterthan', 'greaterthanorequal', 'between', 'in', 'notin', 'isnull', 'isnotnull'],
            'date': ['equal', 'notequal', 'lessthan', 'lessthanorequal', 'greaterthan', 'greaterthanorequal', 'between'],
            'datetime': ['equal', 'notequal', 'lessthan', 'lessthanorequal', 'greaterthan', 'greaterthanorequal', 'between'],
            'boolean': ['equal', 'notequal'],
            'string': ['startswith', 'notstartswith', 'endswith', 'notendswith', 'contains', 'notcontains',
                'equal', 'notequal', 'in', 'notin', 'isempty', 'isnotempty', 'isnull', 'isnotnull']
        };
        return operatorsByType[type.toLowerCase()] || operatorsByType['string'];
    }

    private getOperatorLocaleKey(operator: string): string {
        const localeKeys: [string, string][] = [
            ['equal', 'Equal'], ['notequal', 'NotEqual'], ['contains', 'Contains'], ['notcontains', 'NotContains'],
            ['startswith', 'StartsWith'], ['notstartswith', 'NotStartsWith'], ['endswith', 'EndsWith'], ['notendswith', 'NotEndsWith'],
            ['in', 'In'], ['notin', 'NotIn'], ['isempty', 'IsEmpty'], ['isnotempty', 'IsNotEmpty'],
            ['isnull', 'IsNull'], ['isnotnull', 'NotNull'], ['lessthan', 'LessThan'], ['lessthanorequal', 'LessThanOrEqual'],
            ['greaterthan', 'GreaterThan'], ['greaterthanorequal', 'GreaterThanOrEqual'], ['between', 'Between']
        ];
        const localeKey: [string, string] = localeKeys.find((entry: [string, string]) => entry[0] === operator);
        return localeKey ? localeKey[1] : operator;
    }

    private getOperatorLabel(operator: string): string {
        const label: string = this.l10n.getConstant(this.getOperatorLocaleKey(operator));
        return this.isValueLessOperator(operator) && label.indexOf('Is ') !== 0 ? 'Is ' + label : label;
    }

    private createDialog(): void {
        this.qbContainer = createElement('div', {
            id: this.parent.element.id + '_qbHost',
            className: 'e-advanced-filter-qb-host e-querybuilder',
            styles: 'width:100%; height:100%; display:block; padding:0; margin:0; border: none; box-shadow: none; overflow: auto; box-sizing:border-box;'
        });
        this.dialogContainer = document.createElement('div');
        this.dialogContainer.id = this.parent.element.id + '_advancedFilterDialog';
        this.dialogContainer.className = 'e-advanced-filter-dialog';
        if (document.body) {
            document.body.appendChild(this.dialogContainer);
        } else {
            this.parent.element.appendChild(this.dialogContainer);
        }
        const dialogModel: DialogModel = {
            header: this.l10n.getConstant('AdvancedFilter') || 'Advanced Filter',
            content: this.qbContainer,
            isModal: true,
            showCloseIcon: true,
            closeOnEscape: true,
            animationSettings: { effect: 'None' },
            width: 820,
            height: 480,
            buttons: this.getDialogButtons(),
            visible: false,
            target: document.body,
            beforeOpen: this.onDialogOpen.bind(this),
            open: this.onDialogOpened.bind(this),
            enableRtl: this.parent.enableRtl,
            locale: this.parent.locale
        };
        this.dialog = new Dialog(dialogModel);
        this.dialog.appendTo(this.dialogContainer);
        this.applyDialogSizeConstraints(this.dialog);
    }

    private applyDialogSizeConstraints(dialog: Dialog): void {
        const element: HTMLElement | null = dialog.element as HTMLElement | null;
        if (!element) {
            return;
        }
        element.style.minWidth = this.getDialogMinWidth() + 'px';
        element.style.minHeight = this.getDialogMinHeight() + 'px';
    }

    private getDialogMinHeight(): string | number {
        return 360;
    }

    private getDialogMinWidth(): string | number {
        return 520;
    }

    private getDialogButtons(): DialogButtonDefinition[] {
        return [
            {
                click: this.onCancelClick.bind(this),
                buttonModel: {
                    content: this.l10n.getConstant('CancelAdvancedFilter') || this.l10n.getConstant('Cancel') || 'Cancel'
                }
            },
            {
                click: this.onApplyClick.bind(this),
                buttonModel: {
                    content: this.l10n.getConstant('ApplyAdvancedFilter') || this.l10n.getConstant('Apply') || 'Apply',
                    isPrimary: true
                }
            }
        ];
    }

    /// Converts a filter rule to a Data Query predicate for applying grid filters.
    public getPredicateFromRule(rule: RuleModel): Predicate | null {
        const qbColumns: QueryBuilderColumnDefinition[] = this.mapColumns();
        if (qbColumns.length === 0) {
            return null;
        }
        const normalizedRule: RuleModel = this.normalizeRule(rule, qbColumns) || rule;
        const tempContainer: HTMLElement = createElement('div');
        document.body.appendChild(tempContainer);
        const tempQueryBuilder: QueryBuilder = new QueryBuilder({
            columns: qbColumns,
            rule: normalizedRule
        } as QueryBuilderModel);
        tempQueryBuilder.appendTo(tempContainer);
        try {
            return tempQueryBuilder.getPredicate(normalizedRule) as Predicate;
        } finally {
            tempQueryBuilder.destroy();
            remove(tempContainer);
        }
    }

    /// Creates and initializes the QueryBuilder component within the dialog.
    private createQueryBuilder(): void {
        if (this.queryBuilder || !this.qbContainer) {
            return;
        }
        const qbColumns: QueryBuilderColumnDefinition[] = this.mapColumns();
        if (qbColumns.length === 0) {
            return;
        }
        Object.assign(this.qbContainer.style, { width: '100%', padding: '0', margin: '0' });
        const advancedFilterSettings: AdvancedFilterSettingsModel = this.getAdvancedFilterSettings();
        const userQueryBuilderSettings: QueryBuilderModel = (advancedFilterSettings && advancedFilterSettings.queryBuilderSettings) || {};
        const qbConfig: QueryBuilderModel = extend({}, {
            columns: qbColumns,
            displayMode: 'Horizontal',
            width: '100%',
            locale: this.parent.locale,
            enableRtl: this.parent.enableRtl,
            dataSource: this.parent.dataSource,
            valueModel: {
                multiSelectModel: {
                    mode: 'CheckBox',
                    allowFiltering: true,
                    showSelectAll: true
                }
            }
        }, userQueryBuilderSettings, true) as QueryBuilderModel;
        this.queryBuilder = new QueryBuilder(qbConfig);
        this.queryBuilder.appendTo(this.qbContainer);
    }

    /// Selects the best rule to restore to the QueryBuilder: current > saved > configured.
    private getRuleToRestore(configuredRule: RuleModel | null): RuleModel | null {
        if (this.hasEmptyState) {
            return { condition: 'and', rules: [] } as RuleModel;
        }
        const rule: RuleModel | null = (this.hasValidFilterRule(this.currentRule) && this.currentRule)
            || (this.hasValidFilterRule(this.filterRuleToRestore) && this.filterRuleToRestore)
            || configuredRule;
        return rule ? extend({}, {}, rule, true) as RuleModel : null;
    }

    /// Validates and normalizes a rule by removing non-existent columns and resolving operators.
    private normalizeRule(rule: RuleModel | null | undefined, columns: QueryBuilderColumnDefinition[]): RuleModel | null {
        if (!rule) {
            return null;
        }
        const resolveRule: (currentRule: RuleModel) => RuleModel | null = (currentRule: RuleModel): RuleModel | null => {
            const clonedRule: RuleModel = extend({}, {}, currentRule, true) as RuleModel;
            if (clonedRule.rules && clonedRule.rules.length > 0) {
                const validChildren: RuleModel[] = [];
                for (const childRule of clonedRule.rules) {
                    const processedChild: RuleModel | null = resolveRule(childRule);
                    if (processedChild) {
                        validChildren.push(processedChild);
                    }
                }
                return validChildren.length > 0 ? {
                    condition: clonedRule.condition || 'and',
                    rules: validChildren,
                    not: clonedRule.not || false
                } : null;
            }
            if (!clonedRule.field) {
                return null;
            }
            const qbColumn: QueryBuilderColumnDefinition | undefined = columns.find(
                (col: QueryBuilderColumnDefinition) => col.field === clonedRule.field
            );
            if (!qbColumn) {
                return null;
            }
            const operatorList: string[] = (qbColumn.operators || []).map((op: string | { key?: string; value?: string }) =>
                typeof op === 'string' ? op : (op.value || op.key || '')
            ).filter((op: string) => !!op);
            const resolvedOperator: string = operatorList.indexOf(clonedRule.operator as string) >= 0
                ? clonedRule.operator as string
                : (operatorList[0] || 'equal');
            return {
                field: qbColumn.field,
                label: clonedRule.label || qbColumn.label,
                type: qbColumn.type,
                operator: resolvedOperator,
                value: clonedRule.value !== undefined && clonedRule.value !== null
                    ? clonedRule.value : this.isValueLessOperator(resolvedOperator) ? undefined : ''
            };
        };
        const normalizedRule: RuleModel | null = resolveRule(rule);
        if (normalizedRule && normalizedRule.rules && normalizedRule.rules.length > 0) {
            return normalizedRule;
        }
        return normalizedRule && normalizedRule.field ? { condition: 'and', rules: [normalizedRule] } : null;
    }

    private isValueLessOperator(operator?: string): boolean {
        return operator === 'isnull' || operator === 'isnotnull' || operator === 'isempty' || operator === 'isnotempty';
    }

    /// Restores the filter rule to the QueryBuilder display when the dialog opens.
    private restoreQueryBuilderRule(): void {
        if (!this.queryBuilder || this.queryBuilder.isDestroyed) {
            return;
        }
        const emptyRule: RuleModel = { condition: 'and', rules: [] } as RuleModel;
        if (this.hasEmptyState) {
            this.queryBuilder.setRules(emptyRule);
            return;
        }
        const columns: QueryBuilderColumnDefinition[] = this.mapColumns();
        const advancedFilterSettings: AdvancedFilterSettingsModel = this.getAdvancedFilterSettings();
        const configuredRuleValue: RuleModel | undefined = advancedFilterSettings && advancedFilterSettings.queryBuilderSettings
            ? advancedFilterSettings.queryBuilderSettings.rule
            : undefined;
        const configuredRule: RuleModel | null = this.normalizeRule(configuredRuleValue, columns);
        const ruleToRestore: RuleModel | null = this.getRuleToRestore(configuredRule);
        if (ruleToRestore && this.hasValidFilterRule(ruleToRestore)) {
            this.queryBuilder.setRules(ruleToRestore);
            this.queryBuilder.refresh();
            return;
        }
        this.filterRuleToRestore = null;
        this.currentRule = null;
        this.queryBuilder.setRules(emptyRule);
    }

    private onDialogOpen(): void {
        if (!this.qbContainer) {
            return;
        }
        if (this.queryBuilder && !this.queryBuilder.isDestroyed) {
            this.queryBuilder.destroy();
            this.queryBuilder = null;
        }
        this.qbContainer.innerHTML = '';
        this.createQueryBuilder();
        this.restoreQueryBuilderRule();
    }

    private onDialogOpened(): void {
        if (this.queryBuilder && !this.queryBuilder.isDestroyed && this.qbContainer) {
            const fieldSelect: HTMLElement | null = this.qbContainer.querySelector(
                '.e-field-select, select[id$="_field"], input.e-qb-field'
            ) as HTMLElement | null;
            if (fieldSelect) {
                fieldSelect.focus();
            }
        }
    }

    private onApplyClick(): void {
        if (!this.queryBuilder) {
            return;
        }
        const rule: RuleModel = this.queryBuilder.getRules() as RuleModel;
        if (rule) {
            this.applyFilter(rule);
        }
    }

    private onCancelClick(): void {
        this.closeDialog();
    }
}

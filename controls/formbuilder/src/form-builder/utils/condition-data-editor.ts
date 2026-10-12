import { L10n, createElement } from '@syncfusion/ej2-base';
import { QueryBuilder, RuleModel } from '@syncfusion/ej2-querybuilder';
import { Button } from '@syncfusion/ej2-buttons';
import { FormNode, ConditionalDataRule, ConditionType } from '@syncfusion/ej2-form-renderer';
import { buildColumnsForQueryBuilder } from './conditional-editor-utils';
import { DataSourceCollector } from './data-source-collector';
import { ColumnBuilder, ColumnDefinition } from './column-builder';
import { AccordionWrapper } from './custom-accordion';

/** @private */
export interface ConditionDataEditorOptions {
    host: HTMLElement;
    enableRtl?: boolean;
    componentFields: FormNode[];
    componentForEdit?: FormNode;
    excludeFieldId?: string;
    existingRules?: ConditionalDataRule[];
    locale: string;
    l10n?: L10n;
    onChange: (rules: ConditionalDataRule[]) => void;
    formSchema: any;
}

/** @private */
interface RuleEditor {
    ruleId: number;
    ruleIndex: number;
    queryBuilder: QueryBuilder;
    dataSourceCollector: DataSourceCollector | null;
    columnBuilder: ColumnBuilder | null;
    conditionAccordion: AccordionWrapper | null;
    headerEl: HTMLElement;
    bodyEl: HTMLElement;
    chevronEl: HTMLElement;
    deleteBtn: Button;
    expanded: boolean;
    headerClickHandler?: () => void;
    headerKeydownHandler?: (e: KeyboardEvent) => void;
}

/** @private */
interface InternalRule extends ConditionalDataRule {
    ruleId: number;
}

/** @private */
const DEFAULT_NEW_RULE: ConditionalDataRule = {
    condition: { condition: 'and', rules: [] } as ConditionType,
    dataSource: [] as any,
    columns: []
} as ConditionalDataRule;

/** @private */
export class ConditionDataEditor {
    private host: HTMLElement;
    private componentFields: FormNode[];
    private componentForEdit: FormNode | undefined;
    private excludeFieldId: string | undefined;
    private locale: string;
    private l10n: L10n | undefined;
    private onChange: (rules: ConditionalDataRule[]) => void;

    private rules: InternalRule[];
    private editors: RuleEditor[];
    private listHost: HTMLElement | null;
    private addBtn: Button | null;
    private destroyed: boolean;
    private nextRuleId: number;
    private formSchema: any;
    private collapsedRuleIds: Set<number>;
    private props: ConditionDataEditorOptions;

    constructor(opts: ConditionDataEditorOptions) {
        this.host = opts.host;
        this.props = opts;
        this.componentFields = opts.componentFields || [];
        this.componentForEdit = opts.componentForEdit;
        this.excludeFieldId = opts.excludeFieldId;
        this.locale = opts.locale || 'en-US';
        this.l10n = opts.l10n;
        this.onChange = opts.onChange;
        this.formSchema = opts.formSchema;

        const existing: ConditionalDataRule[] = opts.existingRules || [];
        this.nextRuleId = existing.length;
        this.rules = existing.map((r: ConditionalDataRule, idx: number) => ({
            condition: r.condition,
            dataSource: r.dataSource,
            columns: r.columns ? r.columns.slice() : [],
            ruleId: idx
        }));
        this.editors = [];
        this.listHost = null;
        this.addBtn = null;
        this.destroyed = false;
        this.collapsedRuleIds = new Set<number>(this.rules.map((r: InternalRule) => r.ruleId));
    }

    /** @private */
    public render(): void {
        if (this.destroyed) { return; }
        this.editors = [];
        this.host.innerHTML = '';

        const wrapper: HTMLElement = createElement('div', { className: 'condition-data-editor' });
        this.host.appendChild(wrapper);

        this.listHost = createElement('div', { className: 'rules-list' });
        wrapper.appendChild(this.listHost);

        this.rules.forEach((_rule: InternalRule, idx: number) => {
            this.renderRule(idx);
        });

        const actions: HTMLElement = createElement('div', { className: 'rule-actions' });
        actions.setAttribute('role', 'group');
        actions.setAttribute('aria-label', (this.l10n && this.l10n.getConstant('addCondition')) || 'Add Condition');
        wrapper.appendChild(actions);

        const addBtnEl: HTMLButtonElement = document.createElement('button');
        addBtnEl.type = 'button';
        addBtnEl.textContent = (this.l10n && this.l10n.getConstant('addCondition')) || '+ Add Condition';
        actions.appendChild(addBtnEl);
        this.addBtn = new Button({
            enableRtl: this.props.enableRtl,
            cssClass: 'e-outline'
        });
        this.addBtn.appendTo(addBtnEl);
        addBtnEl.addEventListener('click', () => this.handleAddRule());
    }

    /** @private */
    public getRules(): ConditionalDataRule[] {
        return this.rules
            .filter((r: InternalRule) => this.isRuleValid(r))
            .map((r: InternalRule) => ({
                condition: r.condition,
                dataSource: r.dataSource,
                ruleId: r.ruleId,
                columns: r.columns ? r.columns.slice() : []
            } as ConditionalDataRule));
    }

    /** @private */
    public destroy(): void {
        if (this.destroyed) { return; }
        this.destroyed = true;
        this.editors.forEach((ed: RuleEditor) => this.disposeRuleEditor(ed));
        this.editors = [];
        if (this.addBtn) {
            try { this.addBtn.destroy(); } catch { /* */ }
            this.addBtn = null;
        }
        this.host.innerHTML = '';
    }

    private isRuleValid(r: InternalRule): boolean {
        const hasCond: boolean = !!(r.condition && (
            ('rules' in r.condition && Array.isArray((r.condition as any).rules) && (r.condition as any).rules.length > 0) ||
            ('field' in r.condition)
        ));
        const hasData: boolean = !!(r.dataSource && (
            (typeof r.dataSource === 'string' && (r.dataSource as string).length > 0) ||
            (Array.isArray(r.dataSource) && (r.dataSource as any[]).length > 0) ||
            (typeof r.dataSource === 'object' && r.dataSource !== null && Object.keys(r.dataSource).length > 0)
        ));
        return hasCond || hasData;
    }

    private handleAddRule(): void {
        const newRule: InternalRule = {
            ...(DEFAULT_NEW_RULE as ConditionalDataRule),
            columns: [],
            ruleId: this.nextRuleId
        };
        this.nextRuleId = this.nextRuleId + 1;
        this.collapsedRuleIds.add(newRule.ruleId);
        this.rules.push(newRule);
        this.renderRule(this.rules.length - 1);
        this.notifyChange();
    }

    private renderRule(idx: number): void {
        if (!this.listHost) { return; }
        const item: HTMLElement = createElement('div', { className: 'rule-item' });
        this.listHost.appendChild(item);

        const rule: InternalRule = this.rules[idx as number];
        const ruleId: number = rule.ruleId;

        const header: HTMLElement = createElement('div', { className: 'rule-header' });
        header.tabIndex = 0;
        header.setAttribute('aria-expanded', 'false');
        header.setAttribute('aria-label', (this.l10n && this.l10n.getConstant('condition')) + ' ' + (idx + 1));
        header.style.cursor = 'pointer';
        header.style.display = 'flex';
        header.style.alignItems = 'center';
        header.style.gap = '8px';
        item.appendChild(header);

        const expanded: boolean = !this.collapsedRuleIds.has(ruleId);

        const chevronEl: HTMLElement = createElement('span', {
            className: 'rule-chevron ' + (expanded ? 'e-chevron-down' : 'e-chevron-right'),
            attrs: { 'aria-hidden': 'true' }
        });
        chevronEl.style.display = 'inline-flex';
        chevronEl.style.alignItems = 'center';
        chevronEl.style.justifyContent = 'center';
        chevronEl.style.minWidth = '20px';
        chevronEl.style.transition = 'transform 0.2s ease';
        header.appendChild(chevronEl);

        const title: HTMLElement = createElement('h4', { className: 'rule-title' });
        title.textContent = ((this.l10n && this.l10n.getConstant('condition')) || 'Condition') + ' ' + (idx + 1);
        title.style.flex = '1';
        title.style.margin = '0';
        header.appendChild(title);

        const delBtnEl: HTMLButtonElement = document.createElement('button');
        delBtnEl.type = 'button';
        delBtnEl.title = (this.l10n && this.l10n.getConstant('delete')) || 'Delete';
        delBtnEl.setAttribute('aria-label', ((this.l10n && this.l10n.getConstant('delete')) || 'Delete') + ' ' + ((this.l10n && this.l10n.getConstant('condition')) || 'Condition') + ' ' + (idx + 1));
        header.appendChild(delBtnEl);
        const delBtn: Button = new Button({
            enableRtl: this.props.enableRtl,
            cssClass: 'e-flat',
            iconCss: 'e-icons e-trash'
        });
        delBtn.appendTo(delBtnEl);
        delBtnEl.addEventListener('click', (e: Event) => {
            e.stopPropagation();
            this.handleDeleteRule(idx);
        });

        const body: HTMLElement = createElement('div', { className: 'rule-details' });
        body.setAttribute('role', 'region');
        item.appendChild(body);

        if (!expanded) {
            body.style.display = 'none';
            header.setAttribute('aria-expanded', 'false');
        }

        const headerClickHandler = () => this.toggleRuleCollapse(idx);
        const headerKeydownHandler = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.toggleRuleCollapse(idx);
            }
        };

        header.addEventListener('click', headerClickHandler);
        header.addEventListener('keydown', headerKeydownHandler);

        const condSection: HTMLElement = createElement('div', { className: 'e-fb-form-group' });
        condSection.setAttribute('role', 'group');
        condSection.setAttribute('aria-label', (this.l10n && this.l10n.getConstant('condition')) || 'Condition');
        body.appendChild(condSection);

        const condInner: HTMLElement = createElement('div');
        condSection.appendChild(condInner);

        const condDesc: HTMLElement = createElement('p', { className: 'property-description' });
        condDesc.textContent = (this.l10n && this.l10n.getConstant('conditionalDataConditionDescription')) || 'Define when this data source should be applied';
        condInner.appendChild(condDesc);

        const qbHost: HTMLElement = createElement('div');
        condInner.appendChild(qbHost);

        const qb: QueryBuilder = new QueryBuilder({
            enableRtl: this.props.enableRtl,
            dataSource: [],
            columns: [],
            rule: rule.condition as RuleModel,
            fieldModel: { popupHeight: '200px' },
            ruleChange: () => this.handleConditionChange(idx)
        });
        const qbColumns: any[] = buildColumnsForQueryBuilder(
            this.componentFields,
            qb,
            this.excludeFieldId,
            [],
            {},
            this.locale
        );
        qb.columns = qbColumns;
        qb.appendTo(qbHost);

        const conditionAccordion: AccordionWrapper = new AccordionWrapper({
            host: condSection,
            title: (this.l10n && this.l10n.getConstant('condition')) || 'Condition',
            content: condInner
        });
        conditionAccordion.render();
        conditionAccordion.setOpen(true);

        const dataSection: HTMLElement = createElement('div', { className: 'e-fb-form-group' });
        dataSection.setAttribute('role', 'group');
        dataSection.setAttribute('aria-label', (this.l10n && this.l10n.getConstant('dataSource')) || 'DataSource');
        body.appendChild(dataSection);

        const dataHost: HTMLElement = createElement('div', { className: 'cd-data-source' });
        dataSection.appendChild(dataHost);

        const dataSourceCollector: DataSourceCollector = new DataSourceCollector({
            enableRtl: this.props.enableRtl,
            host: dataHost,
            value: rule.dataSource,
            l10n: this.l10n || new L10n('en', {}),
            locale: this.locale,
            type: 'grid',
            datakey: 'cd-rule-' + ruleId,
            isAccordion: true,
            onChange: (newValue: any) => this.handleDataSourceChange(idx, newValue)
        });
        dataSourceCollector.render();

        const colSection: HTMLElement = createElement('div', { className: 'e-fb-form-group' });
        colSection.setAttribute('role', 'group');
        colSection.setAttribute('aria-label', (this.l10n && this.l10n.getConstant('columns')) || 'Columns');
        body.appendChild(colSection);

        const colHost: HTMLElement = createElement('div');
        colSection.appendChild(colHost);

        const columnBuilder: ColumnBuilder = new ColumnBuilder({
            host: colHost,
            columns: (rule.columns || []) as any,
            l10n: this.l10n || new L10n('en', {}),
            locale: this.locale,
            label: 'columns',
            isConditionData: true,
            onChange: (cols: ColumnDefinition[]) => this.handleColumnsChange(idx, cols),
            formSchema: this.formSchema,
            name: this.componentForEdit.name
        });
        columnBuilder.render();

        this.editors[idx as number] = {
            ruleId: ruleId,
            ruleIndex: idx,
            queryBuilder: qb,
            dataSourceCollector: dataSourceCollector,
            columnBuilder: columnBuilder,
            conditionAccordion: conditionAccordion,
            headerEl: header,
            bodyEl: body,
            chevronEl: chevronEl,
            deleteBtn: delBtn,
            expanded: expanded,
            headerClickHandler: headerClickHandler,
            headerKeydownHandler: headerKeydownHandler
        };
    }

    private handleConditionChange(idx: number): void {
        const ed: RuleEditor | undefined = this.editors[idx as number];
        if (!ed) { return; }
        const valid: RuleModel = ed.queryBuilder.getValidRules(ed.queryBuilder.rule);
        this.rules[idx as number] = Object.assign({}, this.rules[idx as number], { condition: valid as ConditionType });
        this.notifyChange();
    }

    private handleDataSourceChange(idx: number, newValue: any): void {
        const ed: RuleEditor | undefined = this.editors[idx as number];
        if (!ed) { return; }
        this.rules[idx as number] = Object.assign({}, this.rules[idx as number], { dataSource: newValue });
        this.notifyChange();
    }

    private handleColumnsChange(idx: number, cols: ColumnDefinition[]): void {
        const ed: RuleEditor | undefined = this.editors[idx as number];
        if (!ed) { return; }
        this.rules[idx as number] = Object.assign({}, this.rules[idx as number], { columns: cols });
        this.notifyChange();
    }

    private handleDeleteRule(idx: number): void {
        const ed: RuleEditor | undefined = this.editors[idx as number];
        if (ed) {
            this.collapsedRuleIds.delete(ed.ruleId);
            this.disposeRuleEditor(ed);
        }
        this.rules.splice(idx, 1);
        this.render();
        this.notifyChange();
    }

    private toggleRuleCollapse(idx: number): void {
        const ed: RuleEditor | undefined = this.editors[idx as number];
        if (!ed) { return; }
        if (ed.expanded) {
            ed.expanded = false;
            ed.bodyEl.style.display = 'none';
            ed.headerEl.setAttribute('aria-expanded', 'false');
            this.collapsedRuleIds.add(ed.ruleId);
            this.updateChevron(ed, false);
        } else {
            ed.expanded = true;
            ed.bodyEl.style.display = '';
            ed.headerEl.setAttribute('aria-expanded', 'true');
            this.collapsedRuleIds.delete(ed.ruleId);
            this.updateChevron(ed, true);
        }
    }

    private updateChevron(ed: RuleEditor, isExpanded: boolean): void {
        if (!ed.chevronEl) { return; }
        ed.chevronEl.classList.remove('e-chevron-down', 'e-chevron-right');
        ed.chevronEl.classList.add(isExpanded ? 'e-chevron-down' : 'e-chevron-right');
    }

    private disposeRuleEditor(ed: RuleEditor): void {
        if (ed.columnBuilder) {
            try { ed.columnBuilder.destroy(); } catch { /* */ }
        }
        if (ed.dataSourceCollector) {
            try { ed.dataSourceCollector.destroy(); } catch { /* */ }
        }
        if (ed.conditionAccordion) {
            try { ed.conditionAccordion.destroy(); } catch { /* */ }
        }
        if (ed.queryBuilder) {
            try { ed.queryBuilder.destroy(); } catch { /* */ }
        }
        if (ed.deleteBtn) {
            try { ed.deleteBtn.destroy(); } catch { /* */ }
        }
        if (ed.headerEl) {
            if (ed.headerClickHandler) {
                ed.headerEl.removeEventListener('click', ed.headerClickHandler);
            }
            if (ed.headerKeydownHandler) {
                ed.headerEl.removeEventListener('keydown', ed.headerKeydownHandler);
            }
        }
        if (ed.headerEl && ed.headerEl.parentElement) {
            ed.headerEl.parentElement.removeChild(ed.headerEl);
        }
    }

    private notifyChange(): void {
        this.onChange(this.getRules());
    }
}

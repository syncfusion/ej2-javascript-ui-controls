import { L10n, createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Button } from '@syncfusion/ej2-buttons';
import { ListBox, ChangeEventArgs as ListBoxChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import { Dialog } from '@syncfusion/ej2-popups';
import { QueryBuilder } from '@syncfusion/ej2-querybuilder';
import { RuleModel, ColumnsModel } from '@syncfusion/ej2-querybuilder';
import {
    FormNode,
    ConditionRule,
    ConditionalDataRule,
    ChoiceBasedFieldRule
} from '@syncfusion/ej2-form-renderer';
import {
    buildColumnsForQueryBuilder,
    fetchUrlOptionsForFields
} from './conditional-editor-utils';
import updateQueryBuilderDataSource from './update-query-builder-data-source';
import { ValueRenderer } from './value-renderer';
import { ChoiceBasedFieldEditor } from './choice-based-field-editor';
import { ConditionDataEditor } from './condition-data-editor';

/** @private */
export type ConditionAction =
    | 'visibleWhen' | 'readOnlyWhen' | 'disabledWhen'
    | 'requiredWhen' | 'setValueWhen' | 'conditionalData' | 'choiceBasedField';

/** @private */
export interface ConditionsEditorOptions {
    host: HTMLElement;
    getComponentFields: () => FormNode[];
    componentForEdit?: FormNode;
    excludeFieldId?: string;
    excludeChildIds?: string[];
    enableRtl?: boolean;
    existingConditions?: ConditionRule;
    onChange: (conditions: ConditionRule) => void;
    supportedConditions?: ConditionAction[];
    builderMode?: 'Simple' | 'Developer';
    l10n?: L10n;
    parentHost?: HTMLElement;
    formSchema?: any;
}

/** @private */
const DEFAULT_ACTIONS: ConditionAction[] = [
    'visibleWhen', 'readOnlyWhen', 'disabledWhen',
    'requiredWhen', 'setValueWhen'
];

/** @private */
const SIMPLE_MODE_ACTIONS: ConditionAction[] = ['visibleWhen', 'disabledWhen', 'readOnlyWhen'];

/** @private */
export class ConditionsEditor {

    private host: HTMLElement;
    private getComponentFields: () => FormNode[];
    private componentForEdit: FormNode | undefined;
    private excludeFieldId: string | undefined;
    private excludeChildIds: string[];
    private existingConditions: ConditionRule | undefined;
    private onChange: (conditions: ConditionRule) => void;
    private supportedConditions: ConditionAction[];
    private builderMode: 'Simple' | 'Developer' | undefined;
    private l10n: L10n | undefined;
    private locale: string;

    private parentHost: HTMLElement;
    private enableRtl: boolean;
    private state: ConditionRule;
    private dialogState: ConditionRule | null;
    private stateBeforeDialog: ConditionRule | null;
    private fetchedOptions: Record<string, any[]>;
    private destroyed: boolean;

    private tabHost: HTMLElement;
    private dialogContent: HTMLElement | null;
    private dialogHost: HTMLElement | null;
    private addRuleBtn: Button | null;
    private savedListBox: ListBox | null;

    private dialog: Dialog | null;
    private dialogListBox: ListBox | null;
    private activeConditionType: ConditionAction;
    private editingConditionType: ConditionAction | null;

    private qbMap: Partial<Record<ConditionAction, QueryBuilder>>;
    private qbHosts: Partial<Record<ConditionAction, HTMLElement>>;
    private valueRenderer: ValueRenderer | null;
    private choiceBasedEditor: ChoiceBasedFieldEditor | null;
    private choiceBasedHost: HTMLElement | null;
    private conditionDataEditor: ConditionDataEditor | null;
    private conditionDataHost: HTMLElement | null;

    private saveBtn: Button | null;
    private cancelBtn: Button | null;

    private abortControllers: Record<string, AbortController>;
    private dataSourceUnsubscribe: (() => void) | null;
    private dataSourceUpdateTimer: any;
    private formSchema: any;

    constructor(opts: ConditionsEditorOptions) {
        this.host = opts.host;
        this.enableRtl = opts.enableRtl;
        this.getComponentFields = opts.getComponentFields || (() => []);
        this.componentForEdit = opts.componentForEdit;
        this.excludeFieldId = opts.excludeFieldId;
        this.excludeChildIds = opts.excludeChildIds || [];
        this.existingConditions = opts.existingConditions;
        this.onChange = opts.onChange;
        this.parentHost = opts.parentHost;
        this.builderMode = opts.builderMode;
        this.l10n = opts.l10n;
        this.formSchema = opts.formSchema;
        this.locale = (this.l10n && (this.l10n as any).locale) || 'en-US';

        this.supportedConditions = this.computeSupportedConditions(opts.supportedConditions);

        this.state = this.cloneConditions(opts.existingConditions);
        this.dialogState = null;
        this.stateBeforeDialog = null;
        this.fetchedOptions = {};
        this.abortControllers = {};
        this.dataSourceUnsubscribe = null;
        this.dataSourceUpdateTimer = null;
        this.destroyed = false;

        this.tabHost = createElement('div', { className: 'conditions-editor-wrapper' });
        this.dialogContent = null;
        this.dialogHost = null;
        this.addRuleBtn = null;
        this.savedListBox = null;

        this.dialog = null;
        this.dialogListBox = null;
        this.activeConditionType = this.supportedConditions[0] || 'visibleWhen';
        this.editingConditionType = null;

        this.qbMap = {};
        this.qbHosts = {};
        this.valueRenderer = null;
        this.choiceBasedEditor = null;
        this.choiceBasedHost = null;
        this.conditionDataEditor = null;
        this.conditionDataHost = null;

        this.saveBtn = null;
        this.cancelBtn = null;
    }

    /** @private */
    public render(): void {
        if (this.destroyed) { return; }
        this.host.innerHTML = '';
        this.host.appendChild(this.tabHost);

        this.fetchUrlOptions().then(() => this.renderTabContent());
        this.renderTabContent();
    }

    /** @private */
    public destroy(): void {
        if (this.destroyed) { return; }
        this.destroyed = true;
        const ac: any = this.abortControllers as any;
        Object.keys(ac).forEach((k: string) => {
            try { ac[k as string].abort(); } catch { /* */ }
        });
        this.abortControllers = {};
        this.destroyDialog();
        if (this.addRuleBtn) {
            try { this.addRuleBtn.destroy(); } catch { /* */ }
            this.addRuleBtn = null;
        }
        if (this.savedListBox) {
            try { this.savedListBox.destroy(); } catch { /* */ }
            this.savedListBox = null;
        }
        this.host.innerHTML = '';
    }

    private renderTabContent(): void {
        this.tabHost.innerHTML = '';
        const savedKeys: ConditionAction[] = this.savedConditionKeys();

        if (savedKeys.length === 0) {
            this.renderEmptyState();
        } else {
            this.renderSavedList(savedKeys);
        }
    }

    private renderEmptyState(): void {
        const wrapper: HTMLElement = createElement('div', { className: 'conditions-empty' });
        wrapper.style.padding = '0.75rem 1rem';

        const desc: HTMLElement = createElement('p', { className: 'property-description' });
        desc.textContent = (this.l10n && this.l10n.getConstant('conditionsEditorLabel'))
            || "Add rules to control this field's behavior.";
        desc.style.fontSize = '13px';
        desc.style.color = 'rgb(var(--sf-color-on-surface-variant))';
        desc.style.margin = '0 0 12px 0';
        wrapper.appendChild(desc);

        const addBtnEl: HTMLButtonElement = document.createElement('button');
        addBtnEl.type = 'button';
        addBtnEl.textContent = (this.l10n && this.l10n.getConstant('addRule')) || 'Add Rule';
        addBtnEl.setAttribute('aria-label', (this.l10n && this.l10n.getConstant('addRule')) || 'Add Rule');
        addBtnEl.style.width = '100%';
        wrapper.appendChild(addBtnEl);

        this.tabHost.appendChild(wrapper);

        this.addRuleBtn = new Button({
            cssClass: 'e-outline',
            iconCss: 'e-icons e-plus',
            enableRtl: this.enableRtl
        });
        this.addRuleBtn.appendTo(addBtnEl);
        addBtnEl.addEventListener('click', () => this.openDialog());
    }

    private renderSavedList(savedKeys: ConditionAction[]): void {
        const wrapper: HTMLElement = createElement('div', { className: 'conditions-editor-dialog' });
        wrapper.style.padding = '0.75rem 1.2rem';
        wrapper.setAttribute('role', 'region');
        wrapper.setAttribute('aria-label', (this.l10n && this.l10n.getConstant('conditions')) || 'Conditions');

        const header: HTMLElement = createElement('div', { className: 'conditions-saved-header' });
        header.style.marginBottom = '12px';

        const desc: HTMLElement = createElement('p', {
            attrs: { 'id': 'conditions-editor-description' },
            className: 'property-description'
        });
        desc.textContent = (this.l10n && this.l10n.getConstant('conditionsEditorLabel'))
            || "Add rules to control this field's behavior.";
        desc.style.fontSize = '13px';
        desc.style.color = 'rgb(var(--sf-color-on-surface-variant))';
        desc.style.margin = '0 0 12px 0';
        header.appendChild(desc);

        const addBtnEl: HTMLButtonElement = document.createElement('button');
        addBtnEl.type = 'button';
        addBtnEl.textContent = (this.l10n && this.l10n.getConstant('addRule')) || 'Add Rule';
        addBtnEl.setAttribute('aria-label', (this.l10n && this.l10n.getConstant('addRule')) || 'Add Rule');
        addBtnEl.style.width = '100%';
        header.appendChild(addBtnEl);
        wrapper.appendChild(header);

        this.addRuleBtn = new Button({
            cssClass: 'e-outline',
            iconCss: 'e-icons e-plus',
            enableRtl: this.enableRtl
        });
        this.addRuleBtn.appendTo(addBtnEl);
        addBtnEl.addEventListener('click', () => this.openDialog());

        const listHost: HTMLElement = createElement('div', { className: 'conditions-saved-list' });
        listHost.setAttribute('aria-live', 'polite');
        wrapper.appendChild(listHost);

        this.tabHost.appendChild(wrapper);

        const editLabel: string = (this.l10n && this.l10n.getConstant('edit')) || 'Edit';
        const deleteLabel: string = (this.l10n && this.l10n.getConstant('delete')) || 'Delete';
        const dataSource: { text: string; id: ConditionAction; editLabel: string; deleteLabel: string }[] = savedKeys.map((k: ConditionAction) => ({
            text: this.conditionLabel(k),
            id: k,
            editLabel: editLabel,
            deleteLabel: deleteLabel
        }));

        this.savedListBox = new ListBox({
            dataSource: dataSource,
            enableRtl: this.enableRtl,
            fields: { text: 'text', value: 'id' },
            selectionSettings: { mode: 'Single' },
            value: [],
            change: (e: any) => {
                const target = e.event.target as HTMLElement | null;
                const btn = target && target.closest('button[data-action]') as HTMLButtonElement | null;
                if (!btn) { return; }

                e.event.preventDefault();
                e.event.stopPropagation();

                const id = btn.getAttribute('data-id') as ConditionAction;
                const action = btn.getAttribute('data-action');

                if (action === 'edit') {
                    setTimeout(() => {
                        this.handleEditCondition(id);
                    })
                } else if (action === 'delete') {
                    this.handleDeleteCondition(id);
                }
            },
            itemTemplate: '<div class="conditions-saved-row" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; border-radius: 4px; font-size: 14px;">'
                + '<span>${text}</span>'
                + '<div style="display: flex; gap: 8px;">'
                + '<button type="button" class="e-btn e-flat e-edit-btn" title="${editLabel}" aria-label="${editLabel} ${text}" data-id="${id}" data-action="edit">'
                + '<span class="e-btn-icon e-icons e-edit"></span></button>'
                + '<button type="button" class="e-btn e-flat e-delete-btn" title="${deleteLabel}" aria-label="${deleteLabel} ${text}" data-id="${id}" data-action="delete">'
                + '<span class="e-btn-icon e-icons e-trash"></span></button>'
                + '</div></div>'
        });
        this.savedListBox.appendTo(listHost);
    }

    private openDialog(editingConditionType?: ConditionAction): void {
        this.editingConditionType = editingConditionType || null;
        this.activeConditionType = isNullOrUndefined(editingConditionType)
            ? (this.activeConditionType || 'visibleWhen')
            : editingConditionType;
        this.stateBeforeDialog = this.cloneConditions(this.state);
        this.dialogState = this.cloneConditions(this.state);
        if (this.editingConditionType && !this.dialogState[this.editingConditionType]) {
            this.dialogState[this.editingConditionType] = {} as any;
        }
        this.state = this.dialogState;
        if (!this.dialog) { this.createDialog(); }
        if (this.dialog) { this.dialog.show(); }
        this.onDialogOpened();
        this.setupDataSourceSubscription();
        const editorHandle: HTMLElement | null = this.parentHost.querySelector('.editor-handle');
        if (editorHandle) {
            editorHandle.style.visibility = 'hidden';
        }
    }

    private closeDialog(commitChanges: boolean = false): void {
        if (this.dialog) {
            this.destroyDialog();
        }
        if (!commitChanges && this.stateBeforeDialog) {
            this.state = this.stateBeforeDialog;
        }
        this.dialogState = null;
        this.stateBeforeDialog = null;
        const editorHandle: HTMLElement | null = this.parentHost.querySelector('.editor-handle');
        if (editorHandle) {
            editorHandle.style.visibility = 'visible';
        }
    }

    private destroyDialog(): void {
        this.destroyQueryBuilders();
        this.teardownDataSourceSubscription();
        if (this.valueRenderer) { this.valueRenderer.destroy(); this.valueRenderer = null; }
        if (this.choiceBasedEditor) { this.choiceBasedEditor.destroy(); this.choiceBasedEditor = null; }
        if (this.conditionDataEditor) { this.conditionDataEditor.destroy(); this.conditionDataEditor = null; }
        if (this.dialogListBox) { try { this.dialogListBox.destroy(); } catch { /* */ } this.dialogListBox = null; }
        if (this.saveBtn) { try { this.saveBtn.destroy(); } catch { /* */ } this.saveBtn = null; }
        if (this.cancelBtn) { try { this.cancelBtn.destroy(); } catch { /* */ } this.cancelBtn = null; }
        if (this.dialog) { try { this.dialog.destroy(); } catch { /* */ } this.dialog = null; }
        if (this.dialogHost && this.dialogHost.parentElement) {
            this.dialogHost.parentElement.removeChild(this.dialogHost);
        }
        this.dialogHost = null;
        this.dialogContent = null;
    }

    protected createDialog(): void {
        this.dialogContent = createElement('div', {
            className: 'conditions-editor-dialog-content'
        });
        this.dialogContent.style.height = '100%';

        const inner: HTMLElement = createElement('div', { className: 'conditions-dialog-inner' });
        inner.style.display = 'flex';
        inner.style.height = '100%';
        inner.style.minHeight = '0';

        const left: HTMLElement = createElement('div', {
            className: 'conditions-dialog-left',
            attrs: { 'role': 'navigation', 'aria-label': (this.l10n && this.l10n.getConstant('conditions')) || 'Conditions' }
        });
        left.style.width = '280px';
        left.style.flexShrink = '0';
        left.style.borderRight = '1px solid #e0e0e0';
        left.style.overflowY = 'auto';
        left.style.maxHeight = '60vh';
        left.style.padding = '20px 10px 0 0';
        const leftList: HTMLElement = createElement('div', { className: 'conditions-dialog-left-list' });
        leftList.style.width = '100%';
        leftList.style.minHeight = '40px';
        left.appendChild(leftList);
        inner.appendChild(left);

        const right: HTMLElement = createElement('div', {
            className: 'conditions-dialog-right',
            attrs: { 'role': 'region', 'aria-live': 'polite' }
        });
        right.style.flex = '1';
        right.style.minWidth = '0';
        right.style.padding = '16px';
        right.style.overflowY = 'auto';
        right.style.maxHeight = '60vh';
        right.setAttribute('aria-label', this.activeConditionType);
        inner.appendChild(right);

        this.dialogContent.appendChild(inner);

        this.dialogHost = createElement('div', {
            className: 'conditions-editor-dialog'
        });
        this.dialogHost.style.position = 'fixed';
        this.dialogHost.style.top = '0';
        this.dialogHost.style.left = '0';
        this.dialogHost.style.width = '100vw';
        this.dialogHost.style.height = '100vh';
        document.body.appendChild(this.dialogHost);

        this.dialog = new Dialog({
            header: (this.l10n && this.l10n.getConstant('conditions')) || 'Conditions',
            showCloseIcon: true,
            closeOnEscape: true,
            enableRtl: this.enableRtl,
            isModal: true,
            width: '990px',
            height: '80vh',
            animationSettings: { effect: 'FadeZoom' },
            target: this.parentHost,
            content: this.dialogContent,
            buttons: [
                {
                    click: () => this.closeDialog(),
                    buttonModel: {
                        content: (this.l10n && this.l10n.getConstant('cancel')) || 'Cancel',
                        cssClass: 'e-flat'
                    }
                },
                {
                    click: () => this.handleSaveConditions(),
                    buttonModel: {
                        content: (this.l10n && this.l10n.getConstant('save')) || 'Save',
                        isPrimary: true,
                        cssClass: 'e-primary import-btn'
                    }
                }
            ],
            close: () => this.handleDialogClose()
        });
        this.dialog.appendTo(this.dialogHost);

        this.mountDialogListBox(leftList);
        this.renderRightPane(right);
    }

    private setupDataSourceSubscription(): void {
        if (this.dataSourceUnsubscribe) { return; }
        const self: ConditionsEditor = this;
        this.dataSourceUnsubscribe = updateQueryBuilderDataSource(
            () => self.getComponentFields(),
            (_fields: any[]) => {
                if (self.dataSourceUpdateTimer) { try { clearTimeout(self.dataSourceUpdateTimer); } catch { /* */ } }
                self.dataSourceUpdateTimer = setTimeout(() => {
                    self.dataSourceUpdateTimer = null;
                    self.fetchUrlOptions().then(() => {
                        if (self.dialog) {
                            try { self.destroyQueryBuilders(); } catch { /* */ }
                            try { self.renderRightPane(self.findRightPaneHost()); } catch { /* */ }
                        }
                    }).catch(() => {
                        if (self.dialog) {
                            try { self.destroyQueryBuilders(); } catch { /* */ }
                            try { self.renderRightPane(self.findRightPaneHost()); } catch { /* */ }
                        }
                    });
                }, 150);
            },
            { pollMs: 150 }
        );
    }

    private teardownDataSourceSubscription(): void {
        if (this.dataSourceUnsubscribe) {
            try { this.dataSourceUnsubscribe(); } catch { /* */ }
            this.dataSourceUnsubscribe = null;
        }
        if (this.dataSourceUpdateTimer) {
            try { clearTimeout(this.dataSourceUpdateTimer); } catch { /* */ }
            this.dataSourceUpdateTimer = null;
        }
    }

    private mountDialogListBox(host: HTMLElement): void {
        const editedType: string = ((this.componentForEdit && this.componentForEdit.type) || '').toLowerCase();
        const items: { text: string; id: ConditionAction }[] = this.supportedConditions
            .filter((c: ConditionAction) => c !== 'conditionalData' || editedType === 'datagrid')
            .map((c: ConditionAction) => ({ text: this.conditionLabel(c), id: c }));

        this.dialogListBox = new ListBox({
            dataSource: items,
            enableRtl: this.enableRtl,
            fields: { text: 'text', value: 'id' },
            selectionSettings: { mode: 'Single' },
            value: [this.activeConditionType],
            change: (e: ListBoxChangeEventArgs) => {
                const v: any = (e as any).value;
                const first: any = Array.isArray(v) ? v[0] : v;
                if (first) {
                    this.activeConditionType = first as ConditionAction;
                    this.renderRightPane(this.findRightPaneHost());
                    if (this.dialogListBox) {
                        this.dialogListBox.value = [this.activeConditionType];
                        try { this.dialogListBox.refresh(); } catch { /* */ }
                    }
                }
            },
            itemTemplate: '<span class="conditions-type-item" style="padding: 12px 16px; cursor: pointer; font-size: 14px; border-radius: 6px; transition: all 0.2s ease; margin-bottom: 4px; display: block;">${text}</span>'
        });
        this.dialogListBox.appendTo(host);
        this.dialogListBox.value = [this.activeConditionType];
        try { this.dialogListBox.refresh(); } catch { /* */ }
    }

    private findRightPaneHost(): HTMLElement {
        if (!this.dialogContent) { return createElement('div'); }
        const right: HTMLElement | null = this.dialogContent.querySelector('.conditions-dialog-right');
        return right || createElement('div');
    }

    protected renderRightPane(host: HTMLElement, conditionType: ConditionAction = this.activeConditionType): void {
        host.innerHTML = '';
        host.setAttribute('aria-label', conditionType);

        switch (conditionType) {
            case 'visibleWhen':
            case 'readOnlyWhen':
            case 'disabledWhen':
            case 'requiredWhen':
                this.renderQueryBuilderPane(host, conditionType, null);
                break;
            case 'setValueWhen':
                this.renderSetValueWhenPane(host);
                break;
            case 'choiceBasedField':
                this.renderChoiceBasedPane(host);
                break;
            case 'conditionalData':
                this.renderConditionalDataPane(host);
                break;
        }
    }

    private renderQueryBuilderPane(
        host: HTMLElement,
        type: ConditionAction,
        _extra: null
    ): void {
        const heading: HTMLElement = createElement('h4');
        heading.textContent = this.conditionLabel(type);
        heading.style.marginTop = '0';
        heading.style.marginBottom = '12px';
        host.appendChild(heading);

        const desc: HTMLElement = createElement('p', { className: 'property-description' });
        desc.textContent = this.conditionDescription(type);
        desc.style.fontSize = '13px';
        desc.style.color = 'rgb(var(--sf-color-on-surface-variant))';
        desc.style.marginBottom = '12px';
        host.appendChild(desc);

        const qbHost: HTMLElement = createElement('div', {
            attrs: { 'tabindex': '-1', 'aria-label': this.conditionLabel(type) }
        });
        host.appendChild(qbHost);

        const existing: any = (this.state as any)[type as ConditionAction];
        const componentFields: FormNode[] = this.getComponentFields();
        const qb: QueryBuilder = new QueryBuilder({
            dataSource: [],
            enableRtl: this.enableRtl,
            columns: [],
            rule: existing || { condition: 'and', rules: [] },
            fieldModel: { popupHeight: '200px' },
            ruleChange: () => this.handleQueryBuilderRuleChange(type)
        });
        const liveColumns: ColumnsModel[] = buildColumnsForQueryBuilder(
            componentFields,
            qb,
            this.excludeFieldId,
            this.excludeChildIds,
            this.fetchedOptions,
            this.locale
        );
        qb.columns = liveColumns;
        qb.appendTo(qbHost);
        this.qbMap[type as ConditionAction] = qb;
        this.qbHosts[type as ConditionAction] = qbHost;
    }

    private renderSetValueWhenPane(host: HTMLElement): void {
        const heading: HTMLElement = createElement('h4');
        heading.textContent = this.conditionLabel('setValueWhen');
        heading.style.marginTop = '0';
        heading.style.marginBottom = '12px';
        host.appendChild(heading);

        const desc: HTMLElement = createElement('p', { className: 'property-description' });
        desc.textContent = this.conditionDescription('setValueWhen');
        desc.style.fontSize = '13px';
        desc.style.color = 'rgb(var(--sf-color-on-surface-variant))';
        desc.style.marginBottom = '12px';
        host.appendChild(desc);

        const qbHost: HTMLElement = createElement('div', {
            attrs: { 'tabindex': '-1', 'aria-label': this.conditionLabel('setValueWhen') }
        });
        host.appendChild(qbHost);

        const setValueWhen: any = (this.state as any).setValueWhen || {};
        const componentFields: FormNode[] = this.getComponentFields();
        const qb: QueryBuilder = new QueryBuilder({
            dataSource: [],
            enableRtl: this.enableRtl,
            columns: [],
            rule: setValueWhen.condition || { condition: 'and', rules: [] },
            fieldModel: { popupHeight: '200px' },
            ruleChange: () => this.handleSetValueWhenRuleChange()
        });
        const liveColumns: ColumnsModel[] = buildColumnsForQueryBuilder(
            componentFields,
            qb,
            this.excludeFieldId,
            this.excludeChildIds,
            this.fetchedOptions,
            this.locale
        );
        qb.columns = liveColumns;
        qb.appendTo(qbHost);
        this.qbMap['setValueWhen'] = qb;
        this.qbHosts['setValueWhen'] = qbHost;

        const valueWrap: HTMLElement = createElement('div');
        valueWrap.style.marginTop = '16px';
        host.appendChild(valueWrap);

        const valueHost: HTMLElement = createElement('div');
        valueWrap.appendChild(valueHost);
        this.valueRenderer = new ValueRenderer({
            host: valueHost,
            enableRtl: this.enableRtl,
            component: this.componentForEdit,
            initialValue: setValueWhen.value,
            locale: this.locale,
            l10n: this.l10n,
            onChange: (v: any) => this.handleSetValueWhenValueChange(v)
        });
        this.valueRenderer.render();
    }

    private renderChoiceBasedPane(host: HTMLElement): void {
        const heading: HTMLElement = createElement('h4');
        heading.textContent = this.conditionLabel('choiceBasedField');
        heading.style.marginTop = '0';
        heading.style.marginBottom = '12px';
        host.appendChild(heading);

        const desc: HTMLElement = createElement('p', { className: 'property-description' });
        desc.textContent = this.conditionDescription('choiceBasedField');
        desc.style.fontSize = '13px';
        desc.style.color = 'rgb(var(--sf-color-on-surface-variant))';
        desc.style.marginBottom = '12px';
        host.appendChild(desc);

        const contentHost: HTMLElement = createElement('div');
        host.appendChild(contentHost);

        this.choiceBasedHost = contentHost;
        this.choiceBasedEditor = new ChoiceBasedFieldEditor({
            host: contentHost,
            enableRtl: this.enableRtl,
            componentForEdit: this.componentForEdit!,
            componentFields: this.getComponentFields(),
            existingRule: this.state.choiceBasedField,
            locale: this.locale,
            l10n: this.l10n,
            onChange: (rule: ChoiceBasedFieldRule | undefined) => this.handleChoiceBasedChange(rule)
        });
        this.choiceBasedEditor.render();
    }

    private renderConditionalDataPane(host: HTMLElement): void {
        const heading: HTMLElement = createElement('h4');
        heading.textContent = this.conditionLabel('conditionalData');
        heading.style.marginTop = '0';
        heading.style.marginBottom = '12px';
        host.appendChild(heading);

        const desc: HTMLElement = createElement('p', { className: 'property-description' });
        desc.textContent = this.conditionDescription('conditionalData');
        desc.style.fontSize = '13px';
        desc.style.color = 'rgb(var(--sf-color-on-surface-variant))';
        desc.style.marginBottom = '12px';
        host.appendChild(desc);

        const contentHost: HTMLElement = createElement('div');
        host.appendChild(contentHost);

        this.conditionDataHost = contentHost;
        this.conditionDataEditor = new ConditionDataEditor({
            host: contentHost,
            enableRtl: this.enableRtl,
            componentFields: this.getComponentFields(),
            componentForEdit: this.componentForEdit,
            excludeFieldId: this.excludeFieldId,
            existingRules: this.state.conditionalData,
            locale: this.locale,
            l10n: this.l10n,
            onChange: (rules: ConditionalDataRule[]) => this.handleConditionalDataChange(rules),
            formSchema: this.formSchema
        });
        this.conditionDataEditor.render();
    }

    private handleQueryBuilderRuleChange(type: ConditionAction): void {
        const qb: QueryBuilder | undefined = this.qbMap[type as ConditionAction];
        if (!qb) { return; }
        const valid: RuleModel = qb.getValidRules(qb.rule);
        if (this.hasNonEmptyRules(valid)) {
            (this.state as any)[type as ConditionAction] = valid;
        } else {
            delete (this.state as any)[type as ConditionAction];
        }
    }

    private handleSetValueWhenRuleChange(): void {
        const qb: QueryBuilder | undefined = this.qbMap['setValueWhen'];
        if (!qb) { return; }
        const valid: RuleModel = qb.getValidRules(qb.rule);
        const cur: any = (this.state as any).setValueWhen || {};
        (this.state as any).setValueWhen = Object.assign({}, cur, { condition: valid });
    }

    private handleSetValueWhenValueChange(v: any): void {
        const cur: any = (this.state as any).setValueWhen || {};
        (this.state as any).setValueWhen = Object.assign({}, cur, { value: v });
    }

    private handleChoiceBasedChange(rule: ChoiceBasedFieldRule | undefined): void {
        if (rule) { this.state.choiceBasedField = rule; }
        else { delete this.state.choiceBasedField; }
    }

    private handleConditionalDataChange(rules: ConditionalDataRule[]): void {
        if (rules && rules.length > 0) { this.state.conditionalData = rules; }
        else { delete this.state.conditionalData; }
    }

    private handleSaveConditions(): void {
        // Run ruleChange once more on the active QB to make sure state is up to date
        if (this.qbMap[this.activeConditionType]) {
            const type: ConditionAction = this.activeConditionType;
            if (type === 'setValueWhen') {
                this.handleSetValueWhenRuleChange();
            } else {
                this.handleQueryBuilderRuleChange(type);
            }
        }
        this.cleanupEmptySetValue();
        if (this.editingConditionType && this.editingConditionType !== this.activeConditionType) {
            delete (this.state as any)[this.editingConditionType];
        }
        this.state = this.cloneConditions(this.dialogState || this.state);
        this.onChange(this.buildConditionsPayload());
        this.editingConditionType = null;
        this.closeDialog(true);
        this.renderTabContent();
    }

    private handleDialogClose(): void {
        this.teardownDataSourceSubscription();
        this.renderTabContent();
        const editorHandle: HTMLElement | null = this.parentHost.querySelector('.editor-handle');
        if (editorHandle) {
            editorHandle.style.visibility = 'visible';
        }
    }

    protected onDialogOpened(): void {
        return;
    }

    private handleEditCondition(type: ConditionAction): void {
        this.openDialog(type);
    }

    private handleDeleteCondition(type: ConditionAction): void {
        if (type === 'setValueWhen') {
            this.state.setValueWhen = { value: undefined } as any;
            delete (this.state as any).setValueWhen;
        } else if (type === 'choiceBasedField') {
            delete this.state.choiceBasedField;
        } else if (type === 'conditionalData') {
            delete this.state.conditionalData;
        } else {
            delete (this.state as any)[type as ConditionAction];
        }
        this.cleanupEmptySetValue();
        this.onChange(this.buildConditionsPayload());
        this.renderTabContent();
    }

    private destroyQueryBuilders(): void {
        (Object.keys(this.qbMap) as ConditionAction[]).forEach((k: ConditionAction) => {
            const qb: QueryBuilder | undefined = this.qbMap[k as ConditionAction];
            if (qb) {
                try { qb.destroy(); } catch { /* */ }
            }
        });
        this.qbMap = {};
        this.qbHosts = {};
    }

    private computeSupportedConditions(sup: ConditionAction[] | undefined): ConditionAction[] {
        let base: ConditionAction[] = (sup && sup.length > 0) ? sup.slice() : DEFAULT_ACTIONS.slice();
        if (this.builderMode === 'Simple') {
            base = base.filter((c: ConditionAction) => SIMPLE_MODE_ACTIONS.indexOf(c) >= 0);
        }
        const t: string = ((this.componentForEdit && this.componentForEdit.type) || '').toLowerCase();
        if (t !== 'dropdown' && t !== 'multiselect') {
            base = base.filter((c: ConditionAction) => c !== 'choiceBasedField');
        }
        if (t !== 'datagrid') {
            base = base.filter((c: ConditionAction) => c !== 'conditionalData');
        }
        return base;
    }

    private cleanupEmptySetValue(): void {
        const sw: any = (this.state as any).setValueWhen;
        if (sw) {
            const hasCond: boolean = sw.condition && sw.condition.rules && sw.condition.rules.length > 0;
            const hasValue: boolean = sw.value !== undefined && sw.value !== '' && !(Array.isArray(sw.value) && sw.value.length === 0);
            if (!hasCond || !hasValue) {
                delete (this.state as any).setValueWhen;
            }
        }
    }

    private savedConditionKeys(): ConditionAction[] {
        const keys: ConditionAction[] = [];
        const all: ConditionAction[] = [
            'visibleWhen', 'readOnlyWhen', 'disabledWhen',
            'requiredWhen', 'setValueWhen', 'choiceBasedField', 'conditionalData'
        ];
        all.forEach((k: ConditionAction) => {
            if (this.supportedConditions.indexOf(k) < 0) { return; }
            const v: any = (this.state as any)[k as string];
            if (!v) { return; }
            if (k === 'setValueWhen') {
                if (v.condition && v.condition.rules && v.condition.rules.length > 0 && v.value !== undefined && v.value !== '') {
                    keys.push(k);
                }
            } else if (k === 'choiceBasedField') {
                keys.push(k);
            } else if (k === 'conditionalData') {
                if (Array.isArray(v) && v.length > 0) { keys.push(k); }
            } else {
                if (v.rules && v.rules.length > 0) { keys.push(k); }
            }
        });
        return keys;
    }

    private conditionLabel(t: ConditionAction): string {
        if (!this.l10n) { return t; }
        const map: Record<ConditionAction, string> = {
            visibleWhen: this.l10n.getConstant('conditionalVisibility') || 'Conditional Visibility',
            readOnlyWhen: this.l10n.getConstant('conditionalReadOnly') || 'Conditional Read-Only',
            disabledWhen: this.l10n.getConstant('conditionalDisable') || 'Conditional Disable',
            requiredWhen: this.l10n.getConstant('conditionalRequired') || 'Conditional Required',
            setValueWhen: this.l10n.getConstant('conditionalSetValue') || 'Set Value When',
            choiceBasedField: this.l10n.getConstant('choiceBasedField') || 'Choice-Based Field',
            conditionalData: this.l10n.getConstant('conditionalData') || 'Conditional Data'
        };
        return map[t as ConditionAction] || t;
    }

    private conditionDescription(t: ConditionAction): string {
        if (!this.l10n) { return ''; }
        const map: Partial<Record<ConditionAction, string>> = {
            visibleWhen: this.l10n.getConstant('conditionalVisibilityDescription') || '',
            readOnlyWhen: this.l10n.getConstant('conditionalReadOnlyDescription') || '',
            disabledWhen: this.l10n.getConstant('conditionalDisableDescription') || '',
            requiredWhen: this.l10n.getConstant('conditionalRequiredDescription') || '',
            setValueWhen: this.l10n.getConstant('conditionalSetValueDescription') || '',
            choiceBasedField: this.l10n.getConstant('choiceBasedFieldDescription') || '',
            conditionalData: this.l10n.getConstant('conditionalDataDescription') || ''
        };
        return map[t as ConditionAction] || '';
    }

    private hasNonEmptyRules(rule: any): boolean {
        if (!rule) { return false; }
        if (rule.rules && Array.isArray(rule.rules) && rule.rules.length > 0) { return true; }
        return false;
    }

    private cloneConditions(c: ConditionRule | undefined): ConditionRule {
        if (!c) { return {}; }
        const out: any = {};
        if (c.visibleWhen) { out.visibleWhen = JSON.parse(JSON.stringify(c.visibleWhen)); }
        if (c.readOnlyWhen) { out.readOnlyWhen = JSON.parse(JSON.stringify(c.readOnlyWhen)); }
        if (c.disabledWhen) { out.disabledWhen = JSON.parse(JSON.stringify(c.disabledWhen)); }
        if (c.requiredWhen) { out.requiredWhen = JSON.parse(JSON.stringify(c.requiredWhen)); }
        if (c.setValueWhen) { out.setValueWhen = JSON.parse(JSON.stringify(c.setValueWhen)); }
        if (c.choiceBasedField) { out.choiceBasedField = JSON.parse(JSON.stringify(c.choiceBasedField)); }
        if (c.conditionalData) { out.conditionalData = JSON.parse(JSON.stringify(c.conditionalData)); }
        return out;
    }

    private buildConditionsPayload(): ConditionRule {
        const out: any = {};
        if (this.state.visibleWhen && this.hasNonEmptyRules(this.state.visibleWhen)) {
            out.visibleWhen = JSON.parse(JSON.stringify(this.state.visibleWhen));
        }
        if (this.state.readOnlyWhen && this.hasNonEmptyRules(this.state.readOnlyWhen)) {
            out.readOnlyWhen = JSON.parse(JSON.stringify(this.state.readOnlyWhen));
        }
        if (this.state.disabledWhen && this.hasNonEmptyRules(this.state.disabledWhen)) {
            out.disabledWhen = JSON.parse(JSON.stringify(this.state.disabledWhen));
        }
        if (this.state.requiredWhen && this.hasNonEmptyRules(this.state.requiredWhen)) {
            out.requiredWhen = JSON.parse(JSON.stringify(this.state.requiredWhen));
        }
        if (this.state.setValueWhen
            && this.state.setValueWhen.condition
            && this.hasNonEmptyRules(this.state.setValueWhen.condition)
            && this.state.setValueWhen.value !== undefined
            && this.state.setValueWhen.value !== ''
            && !(Array.isArray(this.state.setValueWhen.value) && this.state.setValueWhen.value.length === 0)) {
            out.setValueWhen = JSON.parse(JSON.stringify(this.state.setValueWhen));
        }
        if (this.state.choiceBasedField) {
            out.choiceBasedField = JSON.parse(JSON.stringify(this.state.choiceBasedField));
        }
        if (Array.isArray(this.state.conditionalData) && this.state.conditionalData.length > 0) {
            out.conditionalData = JSON.parse(JSON.stringify(this.state.conditionalData));
        }
        return out;
    }

    private async fetchUrlOptions(): Promise<void> {
        const componentFields: FormNode[] = this.getComponentFields();
        await fetchUrlOptionsForFields(
            componentFields,
            this.fetchedOptions,
            this.abortControllers
        );
    }
}

import { L10n, createElement } from '@syncfusion/ej2-base';
import { CheckBoxSelection, DropDownList, MultiSelect } from '@syncfusion/ej2-dropdowns';
import { Button } from '@syncfusion/ej2-buttons';
import { ChoiceBasedFieldRule, FormNode } from '@syncfusion/ej2-form-renderer';
import { resolveUrlOptions } from './conditional-editor-utils';

/** @private */
export interface ChoiceBasedFieldEditorOptions {
    host: HTMLElement;
    enableRtl?: boolean;
    componentForEdit: FormNode;
    componentFields: FormNode[];
    existingRule?: ChoiceBasedFieldRule;
    locale: string;
    l10n?: L10n;
    onChange: (rule: ChoiceBasedFieldRule | undefined) => void;
}

/** @private */
export class ChoiceBasedFieldEditor {

    private host: HTMLElement;
    private component: FormNode;
    private componentFields: FormNode[];
    private locale: string;
    private l10n: L10n | undefined;
    private onChange: (rule: ChoiceBasedFieldRule | undefined) => void;

    private primaryFieldId: string | null;
    private currentOptionIndex: number;
    private choiceMapping: Record<string, string[]>;

    private primaryFieldDd: DropDownList | null;
    private primaryOptionDd: DropDownList | null;
    private dependentOptionsMs: MultiSelect | null;
    private saveBtn: Button | null;
    private props: ChoiceBasedFieldEditorOptions;
    private cancelBtn: Button | null;

    private step2Host: HTMLElement | null;
    private step3Host: HTMLElement | null;
    private actionsHost: HTMLElement | null;

    private destroyed: boolean;

    constructor(opts: ChoiceBasedFieldEditorOptions) {
        this.host = opts.host;
        this.props =  opts;
        this.component = opts.componentForEdit;
        this.componentFields = opts.componentFields || [];
        this.locale = opts.locale || 'en-US';
        this.l10n = opts.l10n;
        this.onChange = opts.onChange;

        this.primaryFieldId = (opts.existingRule && opts.existingRule.primaryFieldId) || null;
        this.choiceMapping = (opts.existingRule && opts.existingRule.choiceMapping)
            ? Object.assign({}, opts.existingRule.choiceMapping)
            : {};
        this.currentOptionIndex = 0;

        this.primaryFieldDd = null;
        this.primaryOptionDd = null;
        this.dependentOptionsMs = null;
        this.saveBtn = null;
        this.cancelBtn = null;

        this.step2Host = null;
        this.step3Host = null;
        this.actionsHost = null;

        this.destroyed = false;
    }

    /** @private */
    public render(): void {
        if (this.destroyed) { return; }
        this.host.innerHTML = '';

        const t: string = (this.component.type || '').toLowerCase();
        if (t !== 'dropdown') {
            this.renderInfoBanner();
            return;
        }

        this.renderStep1();
        if (this.primaryFieldId) {
            this.renderStep2();
            this.renderStep3();
            this.renderActions();
            this.refreshSaveEnabled();
        }
    }

    /** @private */
    public getRule(): ChoiceBasedFieldRule | undefined {
        if (!this.primaryFieldId) { return undefined; }
        if (Object.keys(this.choiceMapping).length === 0) { return undefined; }
        return {
            primaryFieldId: this.primaryFieldId,
            choiceMapping: Object.assign({}, this.choiceMapping),
            showAllWhenNotMapped: false
        };
    }

    /** @private */
    public destroy(): void {
        if (this.destroyed) { return; }
        this.destroyed = true;
        if (this.primaryFieldDd) {
            try { this.primaryFieldDd.destroy(); } catch { /* */ }
            this.primaryFieldDd = null;
        }
        if (this.primaryOptionDd) {
            try { this.primaryOptionDd.destroy(); } catch { /* */ }
            this.primaryOptionDd = null;
        }
        if (this.dependentOptionsMs) {
            try { this.dependentOptionsMs.destroy(); } catch { /* */ }
            this.dependentOptionsMs = null;
        }
        if (this.saveBtn) {
            try { this.saveBtn.destroy(); } catch { /* */ }
            this.saveBtn = null;
        }
        if (this.cancelBtn) {
            try { this.cancelBtn.destroy(); } catch { /* */ }
            this.cancelBtn = null;
        }
        this.host.innerHTML = '';
    }

    private renderInfoBanner(): void {
        const banner: HTMLElement = createElement('div', {
            className: 'e-info',
            attrs: { 'role': 'alert', 'aria-live': 'polite' },
            styles: 'padding:10px; background-color:#e7f3ff; border:1px solid #0066cc; border-radius:4px;'
        });
        banner.textContent = (this.l10n && this.l10n.getConstant('choiceBasedOnlyForDropdown'))
            || 'Choice-Based Field Rules apply only to Dropdown components';
        this.host.appendChild(banner);
    }

    private insertAboveActions(el: HTMLElement): void {
        if (this.actionsHost && this.actionsHost.parentElement === this.host) {
            this.host.insertBefore(el, this.actionsHost);
        } else {
            this.host.appendChild(el);
        }
    }

    private availablePrimaryFields(): FormNode[] {
        const idx: number = this.componentFields.findIndex((f: FormNode) => f.id === this.component.id);
        const upto: FormNode[] = idx >= 0 ? this.componentFields.slice(0, idx) : this.componentFields.slice();
        return upto.filter((f: FormNode) => (f.type || '').toLowerCase() === 'dropdown' && f.id !== this.component.id);
    }

    private renderStep1(): void {
        const step1: HTMLElement = createElement('div', { className: 'cbfe-step cbfe-step-1' });
        step1.style.padding = '0 25px';
        step1.style.marginBottom = '2rem';

        const label: HTMLElement = createElement('label', { className: 'property-description' });
        label.textContent = (this.l10n && this.l10n.getConstant('selectPrimaryField')) || 'Select Primary Field';
        step1.appendChild(label);

        const input: HTMLInputElement = document.createElement('input');
        step1.appendChild(input);
        this.insertAboveActions(step1);

        const fields: FormNode[] = this.availablePrimaryFields();
        this.primaryFieldDd = new DropDownList({
            enableRtl: this.props.enableRtl,
            dataSource: fields.map((f: FormNode) => ({
                text: f.label || (f as any).name || f.id,
                value: f.id
            })),
            fields: { text: 'text', value: 'value' },
            placeholder: 'Select a field',
            value: this.primaryFieldId || undefined,
            floatLabelType: 'Never',
            change: (e: any) => {
                this.primaryFieldId = e.value || null;
                this.currentOptionIndex = 0;
                this.choiceMapping = {};
                this.onChange(undefined);
                this.render();
            }
        });
        this.primaryFieldDd.appendTo(input);
    }

    private renderStep2(): void {
        this.removeStep2();
        const step2: HTMLElement = createElement('div', { className: 'cbfe-step cbfe-step-2' });
        step2.style.padding = '0 25px';
        step2.style.marginBottom = '2rem';
        this.step2Host = step2;

        const primaryField: FormNode | undefined = this.componentFields.find((f: FormNode) => f.id === this.primaryFieldId);
        if (!primaryField) { return; }
        const options: any[] = this.resolveFieldOptions(primaryField);

        const label: HTMLElement = createElement('label', { className: 'property-description' });
        label.textContent = ((this.l10n && this.l10n.getConstant('selectPrimaryOption')) || 'Select Option')
            + ' (' + (this.currentOptionIndex + 1) + ' of ' + options.length + ')';
        step2.appendChild(label);

        const input: HTMLInputElement = document.createElement('input');
        step2.appendChild(input);
        this.insertAboveActions(step2);

        const currentValue: any = options[this.currentOptionIndex];
        this.primaryOptionDd = new DropDownList({
            enableRtl: this.props.enableRtl,
            dataSource: options.map((opt: any) => ({ text: this.optToString(opt), value: opt })),
            fields: { text: 'text', value: 'value' },
            value: currentValue,
            floatLabelType: 'Never',
            change: (e: any) => {
                const newIdx: number = options.indexOf(e.value);
                if (newIdx >= 0) {
                    this.currentOptionIndex = newIdx;
                    this.renderStep2();
                    this.renderStep3();
                }
            }
        });
        this.primaryOptionDd.appendTo(input);
    }

    private renderStep3(): void {
        this.removeStep3();
        const step3: HTMLElement = createElement('div', { className: 'cbfe-step cbfe-step-3' });
        step3.style.padding = '0 25px';
        step3.style.marginBottom = '2rem';
        this.step3Host = step3;

        const primaryField: FormNode | undefined = this.componentFields.find((f: FormNode) => f.id === this.primaryFieldId);
        if (!primaryField) { return; }
        const primaryOptions: any[] = this.resolveFieldOptions(primaryField);
        const currentValue: any = primaryOptions[this.currentOptionIndex];
        if (currentValue === undefined) { return; }

        const label: HTMLElement = createElement('label', { className: 'property-description' });
        label.textContent = ((this.l10n && this.l10n.getConstant('selectDependentOptions')) || 'Select Dependent Options')
            + ' for "' + this.optToString(currentValue) + '"';
        step3.appendChild(label);

        const input: HTMLInputElement = document.createElement('input');
        step3.appendChild(input);
        this.insertAboveActions(step3);

        const dependentOptions: any[] = this.resolveFieldOptions(this.component);
        this.dependentOptionsMs = new MultiSelect({
            enableRtl: this.props.enableRtl,
            dataSource: dependentOptions.map((opt: any) => ({ text: this.optToString(opt), value: opt })),
            fields: { text: 'text', value: 'value' },
            placeholder: (this.l10n && this.l10n.getConstant('selectOptions')) || 'Select options',
            mode: 'CheckBox',
            showSelectAll: true,
            value: (this.choiceMapping[this.optToString(currentValue)] || []).slice(),
            floatLabelType: 'Never',
            change: (e: any) => {
                this.choiceMapping[this.optToString(currentValue)] = e.value || [];
                this.refreshSaveEnabled();
            }
        });
        MultiSelect.Inject(CheckBoxSelection);
        this.dependentOptionsMs.appendTo(input);

        const counter: HTMLElement = createElement('small');
        counter.style.display = 'block';
        counter.style.marginTop = '0.5rem';
        counter.style.color = '#666';
        const len: number = (this.choiceMapping[this.optToString(currentValue)] || []).length;
        counter.textContent = len + ' option(s) selected';
        step3.appendChild(counter);
    }

    private renderActions(): void {
        this.removeActions();
        const actions: HTMLElement = createElement('div', { className: 'cbfe-actions' });
        actions.style.display = 'flex';
        actions.style.gap = '0.5rem';
        actions.style.marginTop = '2rem';
        actions.style.padding = '0 25px';
        this.actionsHost = actions;
        this.host.appendChild(actions);

        const save: HTMLButtonElement = document.createElement('button');
        save.type = 'button';
        save.textContent = (this.l10n && this.l10n.getConstant('save')) || 'Save';
        actions.appendChild(save);
        this.saveBtn = new Button({
            enableRtl: this.props.enableRtl,
            cssClass: 'e-primary',
            disabled: Object.keys(this.choiceMapping).length === 0
        });
        this.saveBtn.appendTo(save);
        save.addEventListener('click', () => this.handleSave());

        const cancel: HTMLButtonElement = document.createElement('button');
        cancel.type = 'button';
        cancel.textContent = (this.l10n && this.l10n.getConstant('cancel')) || 'Cancel';
        actions.appendChild(cancel);
        this.cancelBtn = new Button({
            enableRtl: this.props.enableRtl,
            cssClass: 'e-outline'
        });
        this.cancelBtn.appendTo(cancel);
        cancel.addEventListener('click', () => this.handleCancel());
    }

    private refreshSaveEnabled(): void {
        if (this.saveBtn) {
            try { this.saveBtn.disabled = Object.keys(this.choiceMapping).length === 0; } catch { /* */ }
        }
    }

    private handleSave(): void {
        const rule: ChoiceBasedFieldRule | undefined = this.getRule();
        if (rule) { this.onChange(rule); }
    }

    private handleCancel(): void {
        this.primaryFieldId = null;
        this.currentOptionIndex = 0;
        this.choiceMapping = {};
        this.onChange(undefined);
        this.render();
    }

    private removeStep2(): void {
        if (this.step2Host) {
            if (this.primaryOptionDd) {
                try { this.primaryOptionDd.destroy(); } catch { /* */ }
                this.primaryOptionDd = null;
            }
            if (this.step2Host.parentElement) { this.step2Host.parentElement.removeChild(this.step2Host); }
            this.step2Host = null;
        }
    }

    private removeStep3(): void {
        if (this.step3Host) {
            if (this.dependentOptionsMs) {
                try { this.dependentOptionsMs.destroy(); } catch { /* */ }
                this.dependentOptionsMs = null;
            }
            if (this.step3Host.parentElement) { this.step3Host.parentElement.removeChild(this.step3Host); }
            this.step3Host = null;
        }
    }

    private removeActions(): void {
        if (this.actionsHost) {
            if (this.saveBtn) {
                try { this.saveBtn.destroy(); } catch { /* */ }
                this.saveBtn = null;
            }
            if (this.cancelBtn) {
                try { this.cancelBtn.destroy(); } catch { /* */ }
                this.cancelBtn = null;
            }
            if (this.actionsHost.parentElement) { this.actionsHost.parentElement.removeChild(this.actionsHost); }
            this.actionsHost = null;
        }
    }

    private optToString(opt: any): string {
        if (opt === null || opt === undefined) { return ''; }
        if (typeof opt === 'string') { return opt; }
        if (typeof opt === 'object' && 'value' in opt) { return String((opt as any).value); }
        return String(opt);
    }

    private resolveFieldOptions(field: FormNode): any[] {
        const opts: any = (field as any).options;
        if (!opts) { return []; }
        if (Array.isArray(opts)) { return opts; }
        if (opts && opts.type === 'url') {
            return this.fetchUrlOptionsSync(field.id, opts);
        }
        return [];
    }

    private fetchUrlOptionsSync(fieldId: string, opts: any): any[] {
        return resolveUrlOptions(opts, []);
    }
}

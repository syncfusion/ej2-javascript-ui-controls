import { L10n, createElement } from '@syncfusion/ej2-base';
import { ChangedEventArgs, TextArea } from '@syncfusion/ej2-inputs';
import { FormNode } from '@syncfusion/ej2-form-renderer';
import { ExpressionEngine, ExpressionValidator } from '@syncfusion/ej2-form-renderer';

/** @private */
const NO_DEPENDENCIES_MESSAGE: string =
    'Expression must contain at least one field reference';

/** @private */
export interface ExpressionEditorOptions {
    host: HTMLElement;
    expression: string;
    availableFields: string[] | FormNode[];
    l10n?: L10n;
    onExpressionChange: (expression: string) => void;
}

/** @private */
export interface ColumnExpressionEditorOptions {
    host: HTMLElement;
    expression: string;
    availableFields: string[];
    label?: string;
    description?: string;
    l10n?: L10n;
    onExpressionChange: (expression: string) => void;
}

/** @private */
function computeValidation(
    value: string,
    availableFields: string[] | FormNode[],
    validator: ExpressionValidator,
    engine: ExpressionEngine
): { errors: string[]; hasDependencies: boolean } {
    if (!value || value.trim() === '') {
        return { errors: [], hasDependencies: false };
    }

    const validationErrors: any[] = validator.validate(value, availableFields as string[] | any[]);
    const errorMessages: string[] = validationErrors.map((e: any) => e.message);

    const deps: string[] = engine.extractDependencies(value);

    if (deps.length === 0) {
        errorMessages.push(NO_DEPENDENCIES_MESSAGE);
    }

    return { errors: errorMessages, hasDependencies: deps.length > 0 };
}

/** @private */
export class ExpressionEditor {

    private host: HTMLElement;
    private expression: string;
    private availableFields: string[] | FormNode[];
    private l10n: L10n | undefined;
    private onExpressionChange: (expression: string) => void;

    private validator: ExpressionValidator;
    private engine: ExpressionEngine;

    private wrapper: HTMLElement | null;
    private inputGroup: HTMLElement | null;
    private textarea: TextArea | null;
    private errorsHost: HTMLElement | null;

    private destroyed: boolean;

    constructor(opts: ExpressionEditorOptions) {
        this.host = opts.host;
        this.expression = opts.expression || '';
        this.availableFields = opts.availableFields || [];
        this.l10n = opts.l10n;
        this.onExpressionChange = opts.onExpressionChange;

        this.validator = new ExpressionValidator();
        this.engine = new ExpressionEngine();

        this.wrapper = null;
        this.inputGroup = null;
        this.textarea = null;
        this.errorsHost = null;
        this.destroyed = false;
    }

    /** @private */
    public render(): void {
        if (this.destroyed) { return; }
        this.host.innerHTML = '';
        const fieldHost: HTMLElement = createElement('div', { className: 'property-field' });
        const wrapper: HTMLElement = createElement('div', { className: 'expression-editor' });
        const inputWrapper: HTMLElement = createElement('div', { className: 'expression-input-wrapper' });
        const inputGroup: HTMLElement = createElement('div');
        const textareaElement: HTMLTextAreaElement = createElement('textarea', {
            attrs: { 'rows': '2', 'id': 'expression-editor-textarea' }
        }) as HTMLTextAreaElement;
        inputGroup.appendChild(textareaElement);
        this.textarea = new TextArea({
            value: this.expression || '',
            placeholder: 'e.g., {qty} * {price}',
            rows: 2,
            htmlAttributes: { 'aria-label': 'Expression Editor textbox' },
            change: (e: ChangedEventArgs) => this.handleChange(e)
        });
        this.textarea.appendTo(textareaElement);
        inputWrapper.appendChild(inputGroup);
        wrapper.appendChild(inputWrapper);
        this.errorsHost = createElement('div', { className: 'expression-errors' });
        this.errorsHost.setAttribute('role', 'alert');
        this.errorsHost.setAttribute('aria-live', 'assertive');
        wrapper.appendChild(this.errorsHost);

        fieldHost.appendChild(wrapper);
        this.host.appendChild(fieldHost);
        this.wrapper = wrapper;
        this.inputGroup = inputGroup;
        this.refresh();
    }

    /** @private */
    public destroy(): void {
        if (this.destroyed) { return; }
        this.destroyed = true;

        if (this.textarea) {
            try { this.textarea.destroy(); } catch { /* best-effort */ }
            this.textarea = null;
        }

        this.wrapper = null;
        this.inputGroup = null;
        this.errorsHost = null;

        this.host.innerHTML = '';
    }

    /** @private */
    public setValue(expression: string): void {
        this.expression = expression || '';
        if (this.textarea && this.textarea.value !== this.expression) {
            this.textarea.value = this.expression;
        }
        this.refresh();
    }

    private handleChange(e: ChangedEventArgs): void {
        const value: string = e.value || '';
        this.expression = value;
        this.refresh();
    }

    private refresh(): void {
        const result: { errors: string[]; hasDependencies: boolean } =
            computeValidation(this.expression, this.availableFields, this.validator, this.engine);

        this.paintErrors(result.errors);

        if (this.textarea) {
            if (result.errors.length > 0) {
                this.textarea.element.classList.add('e-error');
                this.textarea.element.setAttribute('aria-invalid', 'true');
            } else {
                this.textarea.element.classList.remove('e-error');
                this.textarea.element.setAttribute('aria-invalid', 'false');
            }
        }

        if (result.errors.length === 0 && result.hasDependencies) {
            this.onExpressionChange(this.expression);
        } else {
            this.onExpressionChange('');
        }
    }

    private paintErrors(errors: string[]): void {
        if (!this.errorsHost) { return; }
        this.errorsHost.innerHTML = '';

        if (errors.length === 0) {
            return;
        }

        for (let i: number = 0; i < errors.length; i++) {
            const errEl: HTMLElement = createElement('div', { className: 'e-error' });
            errEl.setAttribute('role', 'alert');
            errEl.setAttribute('aria-live', 'assertive');
            errEl.textContent = errors[i as number];
            this.errorsHost.appendChild(errEl);
        }
    }
}

/** @private */
export class ColumnExpressionEditor {

    private host: HTMLElement;
    private inputValue: string;
    private availableFields: string[];
    private label: string;
    private description: string;
    private l10n: L10n | undefined;
    private onExpressionChange: (expression: string) => void;

    private validator: ExpressionValidator;
    private engine: ExpressionEngine;

    private wrapper: HTMLElement | null;
    private textarea: TextArea | null;
    private errorsHost: HTMLElement | null;
    private destroyed: boolean;

    constructor(opts: ColumnExpressionEditorOptions) {
        this.host = opts.host;
        this.inputValue = opts.expression || '';
        this.availableFields = opts.availableFields || [];
        this.label = opts.label || ((opts.l10n && opts.l10n.getConstant('expression')) || 'Expression');
        this.description = opts.description !== undefined
            ? opts.description
            : ((opts.l10n && opts.l10n.getConstant('expressionDescription')) || '');
        this.l10n = opts.l10n;
        this.onExpressionChange = opts.onExpressionChange;

        // Reused across renders - same as React's `useMemo(..., [])`.
        this.validator = new ExpressionValidator();
        this.engine = new ExpressionEngine();

        this.wrapper = null;
        this.textarea = null;
        this.errorsHost = null;
        this.destroyed = false;
    }

    /** @private */
    public render(): void {
        if (this.destroyed) { return; }
        this.host.innerHTML = '';
        const fieldHost: HTMLElement = createElement('div', { className: 'property-field' });
        const labelEl: HTMLElement = createElement('label', { className: 'property-label' });
        labelEl.textContent = this.label;
        fieldHost.appendChild(labelEl);
        if (this.description) {
            const descEl: HTMLElement = createElement('p', { className: 'property-description' });
            descEl.textContent = this.description;
            fieldHost.appendChild(descEl);
        }
        this.wrapper = createElement('div', { className: 'column-expression-editor' });
        this.wrapper.setAttribute('aria-label', 'Expression Editor textbox');
        const inputGroup: HTMLElement = createElement('div', { className: 'e-input-group' });

        const initialErrors: string[] = this.computeErrors(this.inputValue);
        const initialAttrs: { [key: string]: string } = {
            'rows': '2',
            'id': 'column-expression-editor-input',
            'aria-label': 'Expression Editor textbox',
            'aria-invalid': initialErrors.length > 0 ? 'true' : 'false'
        };
        if (initialErrors.length > 0) {
            initialAttrs['aria-describedby'] = 'column-expression-errors';
        }

        const textareaElement: HTMLTextAreaElement = createElement('textarea', {
            className: 'e-input',
            attrs: initialAttrs
        }) as HTMLTextAreaElement;
        inputGroup.appendChild(textareaElement);
        this.textarea = new TextArea({
            value: this.inputValue,
            placeholder: (this.l10n && this.l10n.getConstant('expressionPlaceholder')) || '',
            rows: 2,
            htmlAttributes: initialAttrs,
            change: (e: ChangedEventArgs) => this.handleInputChange(e)
        });
        this.textarea.appendTo(textareaElement);
        this.wrapper.appendChild(inputGroup);

        this.errorsHost = createElement('div', {
            className: 'e-error',
            id: 'column-expression-errors'
        });
        this.errorsHost.setAttribute('role', 'alert');
        this.errorsHost.setAttribute('aria-live', 'assertive');
        this.wrapper.appendChild(this.errorsHost);

        fieldHost.appendChild(this.wrapper);
        this.host.appendChild(fieldHost);

        this.paintErrors(initialErrors);
    }

    public destroy(): void {
        if (this.destroyed) { return; }
        this.destroyed = true;

        if (this.textarea) {
            try { this.textarea.destroy(); } catch { /* ignore */ }
            this.textarea = null;
        }

        this.wrapper = null;
        this.errorsHost = null;

        this.host.innerHTML = '';
    }

    /** @private */
    public setValue(expression: string): void {
        this.inputValue = expression || '';
        if (this.textarea && this.textarea.value !== this.inputValue) {
            this.textarea.value = this.inputValue;
        }
        this.paintErrors(this.computeErrors(this.inputValue));
    }

    private handleInputChange(e: ChangedEventArgs): void {
        const newValue: string = e.value || '';
        this.inputValue = newValue;

        const tempErrors: string[] = this.computeErrors(newValue);

        this.paintErrors(tempErrors);

        const attrs: { [key: string]: string } = {
            'aria-label': 'Expression Editor textbox',
            'aria-invalid': tempErrors.length > 0 ? 'true' : 'false',
            'id': 'column-expression-editor-input'
        };
        if (tempErrors.length > 0) {
            attrs['aria-describedby'] = 'column-expression-errors';
        }
        if (this.textarea) {
            for (const key in attrs) {
                this.textarea.element.setAttribute(key, attrs[key as string]);
            }
        }

        if (tempErrors.length === 0) {
            this.onExpressionChange(newValue);
        }
    }

    private computeErrors(value: string): string[] {
        if (!value || value.trim() === '') {
            return [];
        }
        const result: { errors: string[]; hasDependencies: boolean } =
            computeValidation(value, this.availableFields, this.validator, this.engine);
        return result.errors;
    }

    private paintErrors(errors: string[]): void {
        if (!this.errorsHost) { return; }
        this.errorsHost.innerHTML = '';

        if (errors.length === 0) {
            return;
        }

        for (let i: number = 0; i < errors.length; i++) {
            const p: HTMLElement = createElement('p');
            p.style.margin = '0';
            p.textContent = errors[i as number];
            this.errorsHost.appendChild(p);
        }
    }
}

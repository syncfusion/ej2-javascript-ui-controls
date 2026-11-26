import { L10n } from '@syncfusion/ej2-base';
import { TextBox } from '@syncfusion/ej2-inputs';
import { DropDownList, ChangeEventArgs as DropDownChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import { Button } from '@syncfusion/ej2-buttons';
/**
 * Structured editors for the Approve step:
 *   - `ReviewersEditor`  : one row per reviewer (type + value with expression picker)
 *   - `RequestFieldsEditor` : one row per dynamic detail the reviewer sees
 *                          in the approval popup (label + expression-capable value).
 *
 * Replaces the previous raw JSON textareas (`Reviewers JSON`, `Content JSON`)
 * with first-class, dynamically composable author controls so workflows can
 * surface arbitrary request details — no fixed host-side schema required.
 */

import { ApprovalRequestField, ReviewerRef } from '../../models/workflow-step-props';
import { HelpPopup, buildHelpTitle } from '../property-panel';
import { EditorComponents, EditorExpressionTarget } from './editor-components';
import { ServiceLocator } from '../service';
import { resolveEditorL10n } from './editor-l10n';
import { localeDefaults } from '../../localization/locale-defaults';


/**
 * Format a `key` carrying `{0}` / `{1}` placeholders.
 *
 * @param {string} value The value.
 * @param {string[]} args The args.
 * @returns {string} The formatted value.
 * @private
 */
function approvalFormatTemplate(value: string, args: string[]): string {
    return args.reduce<string>((acc: string, arg: string, index: number) => {
        return acc.replace('{' + index + '}', arg);
    }, value);
}

/**
 * Resolve a localised string from the active L10n bundle, with a fallback
 * to the bundled English string. Mirrors `FormFieldsEditor.t` and
 * `StepEditorRegistry.resolveCaption`.
 *
 * @param {L10n | undefined} l10n The l10n.
 * @param {string} key The key.
 * @param {string[]} [args] The args.
 * @returns {string} The resolved string.
 * @private
 */
function approvalResolveCaption(l10n: L10n | undefined, key: string, args?: string[]): string {
    let value: string = key;
    if (l10n) {
        const localised: string = l10n.getConstant(key);
        if (localised) {
            value = localised;
        }
    }
    if (value === key && localeDefaults[`${key}`]) {
        value = localeDefaults[`${key}`];
    }
    if (args && args.length) {
        return approvalFormatTemplate(value, args);
    }
    return value;
}

/**
 * Reviewers Change Handler.
 *
 * @private
 */
export type ReviewersChangeHandler = (reviewers: ReviewerRef[]) => void;
/**
 * Request Fields Change Handler.
 *
 * @private
 */
export type RequestFieldsChangeHandler = (fields: ApprovalRequestField[]) => void;
/**
 * Reviewers Commit Handler.
 *
 * @private
 */
export type ReviewersCommitHandler = () => void;
/**
 * Request Fields Commit Handler.
 *
 * @private
 */
export type RequestFieldsCommitHandler = () => void;

/**
 * Approval Expression Hooks.
 *
 * @private
 */
export interface ApprovalExpressionHooks {
    attachExpression?: (input: EditorExpressionTarget) => void;
}

const REVIEWER_TYPES: ReviewerRef['type'][] = ['User', 'Role', 'Group', 'Email'];

/**
 * Reviewers list editor. One card per reviewer: type (User/Role/Group/Email) + value
 * (expression-capable so the author can template the address or user id).
 *
 * @private
 */
export class ReviewersEditor {
    private static l10n: L10n | undefined;
    private static locator: ServiceLocator | undefined;

    /**
     * Mirror the host's L10n instance (and the shared service locator) into
     * this static editor. See `FormFieldsEditor.setLocale` for the resolver
     * contract.
     *
     * @param {L10n} [l10n] The optional L10n instance to use.
     * @param {ServiceLocator} [locator] The optional shared service locator.
     * @returns {void} Nothing.
     * @private
     */
    public static setLocale(l10n?: L10n, locator?: ServiceLocator): void {
        ReviewersEditor.l10n = l10n;
        ReviewersEditor.locator = locator;
    }

    /**
     * Resolve a localised string for a key. Mirrors `FormFieldsEditor.t`.
     *
     * @param {string} key The key.
     * @param {string[]} [args] The args.
     * @returns {string} The resolved string.
     * @private
     */
    private static t(key: string, args?: string[]): string {
        return approvalResolveCaption(
            resolveEditorL10n(ReviewersEditor.locator, ReviewersEditor.l10n),
            key,
            args
        );
    }

    /**
     * Render.
     *
     * @param {HTMLElement} host The host.
     * @param {ReviewerRef} reviewers The reviewers.
     * @param {ReviewersChangeHandler} onChange The on change.
     * @param {ApprovalExpressionHooks} hooks The hooks.
     * @param {ReviewersCommitHandler} onCommit The on commit.
     * @param {L10n} [l10n] Optional L10n override for this render.
     * @returns {void} Nothing.
     * @private
     */
    public static render(
        host: HTMLElement,
        reviewers: ReviewerRef[],
        onChange: ReviewersChangeHandler,
        hooks?: ApprovalExpressionHooks,
        onCommit?: ReviewersCommitHandler
    ): void {
        const root: HTMLDivElement = document.createElement('div');
        root.className = 'e-wf-list-editor e-wf-reviewers-editor';

        const helpPopup: HelpPopup = new HelpPopup();
        const headingText: string = ReviewersEditor.t('Reviewers');
        const helpText: string = 'Add one reviewer per row to define who must approve. <br><br>'
                + '<strong>Type</strong> can be User, Role, Group, or Email. <br>'
                + '<strong>Value</strong> is resolved by the host system.';
        const titleRow: HTMLDivElement = buildHelpTitle(
            headingText,
            headingText,
            helpText,
            helpPopup
        );

        const list: HTMLDivElement = document.createElement('div');
        list.className = 'e-wf-list-editor-items';

        const clone: (source: ReviewerRef[]) => ReviewerRef[] = (source: ReviewerRef[]): ReviewerRef[] => {
            return source.map((item: ReviewerRef) => ({
                type: item.type,
                value: item.value === undefined || item.value === null ? '' : String(item.value)
            }));
        };
        const current: ReviewerRef[] = clone(Array.isArray(reviewers) ? reviewers : []);

        const emit: () => void = (): void => {
            onChange(clone(current));
        };

        const rebuild: (focusKey?: string) => void = (focusKey?: string): void => {
            // Components must be disposed before the rows are discarded;
            // clearing `innerHTML` alone would orphan every instance.
            EditorComponents.clear(list);
            if (!current.length) {
                const empty: HTMLDivElement = document.createElement('div');
                empty.className = 'e-wf-list-editor-empty';
                empty.textContent = ReviewersEditor.t('reviewersEmpty');
                list.appendChild(empty);
            }
            current.forEach((item: ReviewerRef, index: number) => {
                ReviewersEditor.renderRow(list, item, index, current, emit, rebuild, hooks, onCommit);
            });
            // Component-aware restore: a DropDownList hides its original
            // element, so `focus()` on it is a no-op and `focusIn()` is used
            // instead. Text inputs keep the caret-to-end behaviour.
            EditorComponents.focusTarget(list, focusKey || '');
        };

        const toolbar: HTMLDivElement = document.createElement('div');
        toolbar.className = 'e-wf-list-editor-toolbar';
        const add: HTMLButtonElement = document.createElement('button');
        add.className = 'e-wf-list-editor-add';
        const addLabel: string = ReviewersEditor.t('reviewersAdd');
        add.addEventListener('click', (event: MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();
            current.push(ReviewersEditor.defaultReviewer(current));
            rebuild('rev-value-' + (current.length - 1));
            emit();
            if (onCommit) {
                onCommit();
            }
        });
        toolbar.appendChild(add);

        root.appendChild(titleRow);
        root.appendChild(list);
        root.appendChild(toolbar);
        host.appendChild(root);
        // Mounted after the host is attached: an EJ2 component initialised
        // while detached measures zero.
        new Button({ cssClass: 'e-wf-list-editor-add', isPrimary: true, content: addLabel }).appendTo(add);
        rebuild();
    }

    private static renderRow(
        container: HTMLElement,
        item: ReviewerRef,
        index: number,
        all: ReviewerRef[],
        emit: () => void,
        rebuild: (focusKey?: string) => void,
        hooks?: ApprovalExpressionHooks,
        onCommit?: ReviewersCommitHandler
    ): void {
        const row: HTMLDivElement = document.createElement('div');
        row.className = 'e-wf-list-editor-row e-wf-reviewer-row';
        // Attached up front so every component below is instantiated on a
        // laid-out element rather than a detached one.
        container.appendChild(row);

        const header: HTMLDivElement = document.createElement('div');
        header.className = 'e-wf-list-editor-row-header';
        const title: HTMLSpanElement = document.createElement('span');
        title.className = 'e-wf-list-editor-row-title';
        title.textContent = ReviewersEditor.t('reviewerRow', [String(index + 1)]);
        const remove: HTMLButtonElement = document.createElement('button');
        remove.className = 'e-wf-list-editor-remove';
        remove.setAttribute('title', ReviewersEditor.t('reviewerRemove'));
        remove.setAttribute('aria-label', ReviewersEditor.t('reviewerRemove'));
        remove.addEventListener('click', (event: MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();
            all.splice(index, 1);
            rebuild();
            emit();
        });
        header.appendChild(title);
        header.appendChild(remove);
        row.appendChild(header);
        new Button({
            cssClass: 'e-wf-list-editor-remove e-flat',
            iconCss: 'e-icons e-close'
        }).appendTo(remove);

        const body: HTMLDivElement = document.createElement('div');
        body.className = 'e-wf-list-editor-row-body e-wf-reviewer-row-body';
        row.appendChild(body);

        // Type select
        const typeWrap: HTMLDivElement = document.createElement('div');
        typeWrap.className = 'e-wf-list-editor-subfield';
        const typeCaption: HTMLSpanElement = document.createElement('span');
        typeCaption.className = 'e-wf-list-editor-sublabel';
        typeCaption.textContent = ReviewersEditor.t('reviewerType');
        const typeElement: HTMLInputElement = document.createElement('input');
        typeElement.type = 'text';
        typeElement.setAttribute('data-wf-focus', 'rev-type-' + index);
        typeWrap.appendChild(typeCaption);
        typeWrap.appendChild(typeElement);
        body.appendChild(typeWrap);
        const typeSelect: DropDownList = new DropDownList({
            cssClass: 'e-wf-property-input',
            dataSource: REVIEWER_TYPES.slice() as string[],
            value: String(item.type || 'User'),
            change: (args: DropDownChangeEventArgs) => {
                const next: unknown = args && args.value !== undefined && args.value !== null ? args.value : '';
                item.type = String(next) as ReviewerRef['type'];
                emit();
            }
        });
        typeSelect.appendTo(typeElement);
        typeSelect.element.setAttribute(
            'aria-label',
            ReviewersEditor.t('reviewerTypeAria', [String(index + 1)])
        );

        // Value (expression-capable)
        ReviewersEditor.labeledInput(
            body,
            ReviewersEditor.t('reviewerValue'),
            'text',
            item.value === undefined || item.value === null ? '' : String(item.value),
            'rev-value-' + index,
            (value: string) => {
                item.value = value;
                emit();
            },
            hooks
        );

    }

    private static labeledInput(
        container: HTMLElement,
        label: string,
        inputType: string,
        value: string,
        focusKey: string,
        onChange: (value: string) => void,
        hooks?: ApprovalExpressionHooks
    ): void {
        const wrap: HTMLDivElement = document.createElement('div');
        wrap.className = 'e-wf-list-editor-subfield';
        const caption: HTMLSpanElement = document.createElement('span');
        caption.className = 'e-wf-list-editor-sublabel';
        caption.textContent = label;

        const row: HTMLDivElement = document.createElement('div');
        row.className = hooks && hooks.attachExpression
            ? 'e-wf-property-input-row e-wf-property-input-row-expression'
            : 'e-wf-property-input-row';

        const element: HTMLInputElement = document.createElement('input');
        element.type = inputType;
        element.setAttribute('data-wf-focus', focusKey);
        row.appendChild(element);
        wrap.appendChild(caption);
        wrap.appendChild(row);
        container.appendChild(wrap);

        const input: TextBox = new TextBox({
            cssClass: 'e-wf-property-input',
            value: value
        });
        input.appendTo(element);
        input.element.setAttribute('aria-label', label);
        // DOM `change` fires once on blur/Enter so per-keystroke input does
        // not queue rapid-fire property events from the host binding.
        input.element.addEventListener('change', () => onChange(input.element.value));
        if (hooks && hooks.attachExpression) {
            // The component is handed to the picker rather than the raw
            // element so writes go through the instance.
            hooks.attachExpression(input);
        }
    }

    private static defaultReviewer(existing: ReviewerRef[]): ReviewerRef {
        return { type: 'User', value: '' };
    }
}

/**
 * Request-details list editor. Each row becomes a label/value pair the
 * reviewer sees in the approval popup. Values are expression-capable.
 *
 * @private
 */
export class RequestFieldsEditor {
    private static l10n: L10n | undefined;
    private static locator: ServiceLocator | undefined;

    /**
     * Mirror the host's L10n instance (and the shared service locator) into
     * this static editor. See `FormFieldsEditor.setLocale` for the resolver
     * contract.
     *
     * @param {L10n} [l10n] The optional L10n instance to use.
     * @param {ServiceLocator} [locator] The optional shared service locator.
     * @returns {void} Nothing.
     * @private
     */
    public static setLocale(l10n?: L10n, locator?: ServiceLocator): void {
        RequestFieldsEditor.l10n = l10n;
        RequestFieldsEditor.locator = locator;
    }

    /**
     * Resolve a localised string for a key. Mirrors `FormFieldsEditor.t`.
     *
     * @param {string} key The key.
     * @param {string[]} [args] The args.
     * @returns {string} The resolved string.
     * @private
     */
    private static t(key: string, args?: string[]): string {
        return approvalResolveCaption(
            resolveEditorL10n(RequestFieldsEditor.locator, RequestFieldsEditor.l10n),
            key,
            args
        );
    }

    /**
     * Render.
     *
     * @param {HTMLElement} host The host.
     * @param {ApprovalRequestField} fields The fields.
     * @param {RequestFieldsChangeHandler} onChange The on change.
     * @param {ApprovalExpressionHooks} hooks The hooks.
     * @param {RequestFieldsCommitHandler} onCommit The on commit.
     * @param {L10n} [l10n] Optional L10n override for this render.
     * @returns {void} Nothing.
     * @private
     */
    public static render(
        host: HTMLElement,
        fields: ApprovalRequestField[],
        onChange: RequestFieldsChangeHandler,
        hooks?: ApprovalExpressionHooks,
        onCommit?: RequestFieldsCommitHandler
    ): void {
        const root: HTMLDivElement = document.createElement('div');
        root.className = 'e-wf-list-editor e-wf-request-fields-editor';

        const helpPopup: HelpPopup = new HelpPopup();
        const headingText: string = RequestFieldsEditor.t('Request Details');
        const helpText: string = 'Define the fields the reviewer sees in the approval popup. <br><br>'
                + '<strong>Label:</strong> Heading shown to reviewer. <br>'
                + '<strong>Value:</strong> Expression-capable text evaluated at runtime.';
        const titleRow: HTMLDivElement = buildHelpTitle(
            headingText,
            headingText,
            helpText,
            helpPopup
        );

        const list: HTMLDivElement = document.createElement('div');
        list.className = 'e-wf-list-editor-items';

        const clone: (source: ApprovalRequestField[]) => ApprovalRequestField[] =
            (source: ApprovalRequestField[]): ApprovalRequestField[] => {
                return source.map((item: ApprovalRequestField) => ({
                    label: item.label === undefined || item.label === null ? '' : String(item.label),
                    value: item.value === undefined || item.value === null ? '' : String(item.value)
                }));
            };
        const current: ApprovalRequestField[] = clone(Array.isArray(fields) ? fields : []);

        const emit: () => void = (): void => {
            onChange(clone(current));
        };

        const rebuild: (focusKey?: string) => void = (focusKey?: string): void => {
            // Components must be disposed before the rows are discarded;
            // clearing `innerHTML` alone would orphan every instance.
            EditorComponents.clear(list);
            if (!current.length) {
                const empty: HTMLDivElement = document.createElement('div');
                empty.className = 'e-wf-list-editor-empty';
                empty.textContent = RequestFieldsEditor.t('requestFieldsEmpty');
                list.appendChild(empty);
            }
            current.forEach((item: ApprovalRequestField, index: number) => {
                RequestFieldsEditor.renderRow(list, item, index, current, emit, rebuild, hooks, onCommit);
            });
            // Component-aware restore: a DropDownList hides its original
            // element, so `focus()` on it is a no-op and `focusIn()` is used
            // instead. Text inputs keep the caret-to-end behaviour.
            EditorComponents.focusTarget(list, focusKey || '');
        };

        const toolbar: HTMLDivElement = document.createElement('div');
        toolbar.className = 'e-wf-list-editor-toolbar';
        const add: HTMLButtonElement = document.createElement('button');
        add.className = 'e-wf-list-editor-add';
        const addLabel: string = RequestFieldsEditor.t('requestFieldsAdd');
        add.addEventListener('click', (event: MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();
            current.push({ label: '', value: '' });
            rebuild('rf-label-' + (current.length - 1));
            emit();
            if (onCommit) {
                onCommit();
            }
        });
        toolbar.appendChild(add);

        root.appendChild(titleRow);
        root.appendChild(list);
        root.appendChild(toolbar);
        host.appendChild(root);
        // Mounted after the host is attached: an EJ2 component initialised
        // while detached measures zero.
        new Button({ cssClass: 'e-wf-list-editor-add', isPrimary: true, content: addLabel }).appendTo(add);
        rebuild();
    }

    private static renderRow(
        container: HTMLElement,
        item: ApprovalRequestField,
        index: number,
        all: ApprovalRequestField[],
        emit: () => void,
        rebuild: (focusKey?: string) => void,
        hooks?: ApprovalExpressionHooks,
        onCommit?: RequestFieldsCommitHandler
    ): void {
        const row: HTMLDivElement = document.createElement('div');
        row.className = 'e-wf-list-editor-row e-wf-request-field-row';
        // Attached up front so every component below is instantiated on a
        // laid-out element rather than a detached one.
        container.appendChild(row);

        const header: HTMLDivElement = document.createElement('div');
        header.className = 'e-wf-list-editor-row-header';
        const title: HTMLSpanElement = document.createElement('span');
        title.className = 'e-wf-list-editor-row-title';
        const displayTitle: string = String(item.label || '').trim() || RequestFieldsEditor.t('requestFieldRow', [String(index + 1)]);
        title.textContent = displayTitle;
        const remove: HTMLButtonElement = document.createElement('button');
        remove.className = 'e-wf-list-editor-remove';
        remove.setAttribute('title', RequestFieldsEditor.t('requestFieldRemove'));
        remove.setAttribute('aria-label', RequestFieldsEditor.t('requestFieldRemove'));
        remove.addEventListener('click', (event: MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();
            all.splice(index, 1);
            rebuild();
            emit();
        });
        header.appendChild(title);
        header.appendChild(remove);
        row.appendChild(header);
        new Button({
            cssClass: 'e-wf-list-editor-remove e-flat',
            iconCss: 'e-icons e-close'
        }).appendTo(remove);

        const body: HTMLDivElement = document.createElement('div');
        body.className = 'e-wf-list-editor-row-body e-wf-request-field-row-body';
        row.appendChild(body);

        // Label (plain text — not expression-capable)
        RequestFieldsEditor.labeledInput(
            body,
            RequestFieldsEditor.t('requestFieldLabel'),
            'text',
            item.label === undefined || item.label === null ? '' : String(item.label),
            'rf-label-' + index,
            (value: string) => {
                item.label = value;
                title.textContent = String(value || '').trim() || RequestFieldsEditor.t('requestFieldRow', [String(index + 1)]);
                emit();
            }
        );

        // Value (expression-capable)
        RequestFieldsEditor.labeledInput(
            body,
            RequestFieldsEditor.t('requestFieldValue'),
            'text',
            item.value === undefined || item.value === null ? '' : String(item.value),
            'rf-value-' + index,
            (value: string) => {
                item.value = value;
                emit();
            },
            hooks
        );

    }

    private static labeledInput(
        container: HTMLElement,
        label: string,
        inputType: string,
        value: string,
        focusKey: string,
        onChange: (value: string) => void,
        hooks?: ApprovalExpressionHooks
    ): void {
        const wrap: HTMLDivElement = document.createElement('div');
        wrap.className = 'e-wf-list-editor-subfield';
        const caption: HTMLSpanElement = document.createElement('span');
        caption.className = 'e-wf-list-editor-sublabel';
        caption.textContent = label;

        const row: HTMLDivElement = document.createElement('div');
        row.className = hooks && hooks.attachExpression
            ? 'e-wf-property-input-row e-wf-property-input-row-expression'
            : 'e-wf-property-input-row';

        const element: HTMLInputElement = document.createElement('input');
        element.type = inputType;
        element.setAttribute('data-wf-focus', focusKey);
        row.appendChild(element);
        wrap.appendChild(caption);
        wrap.appendChild(row);
        container.appendChild(wrap);

        const input: TextBox = new TextBox({
            cssClass: 'e-wf-property-input',
            value: value
        });
        input.appendTo(element);
        input.element.setAttribute('aria-label', label);
        // DOM `change` fires once on blur/Enter so per-keystroke input does
        // not queue rapid-fire property events from the host binding.
        input.element.addEventListener('change', () => onChange(input.element.value));
        if (hooks && hooks.attachExpression) {
            // The component is handed to the picker rather than the raw
            // element so writes go through the instance.
            hooks.attachExpression(input);
        }
    }
}

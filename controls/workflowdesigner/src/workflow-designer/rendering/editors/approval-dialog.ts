/**
 * Schema-driven Approve-step simulation dialog (mirrors `FormInputDialog`).
 *
 * Renders a centered modal with:
 *   - Resolved `requestMessage` as the title
 *   - A REVIEWER section listing every configured reviewer as a card with a
 *     type chip (User / Role / Group / Email)
 *   - A REQUEST DETAILS label / value grid built from `requestFields`
 *     (expressions resolved against the supplied runtime context)
 *   - Approve (primary) and Reject (secondary) actions; Reject reveals a
 *     required comment textarea
 *
 * Returns an `ApprovalDecisionResult`:
 *   - Approve  → { decision: 'approved', reviewedBy?, reviewedAt }
 *   - Reject   → { decision: 'declined', comments (required), reviewedBy?, reviewedAt }
 *   - Esc → `undefined` (caller treats as declined / no decision)
 *
 * The Approve step already has two output ports (`approved`, `declined`) per
 * spec §13; this dialog only produces the decision — branching uses the
 * existing `outputPort` routing.
 */

import { L10n } from '@syncfusion/ej2-base';
import { Dialog } from '@syncfusion/ej2-popups';
import { TextBox } from '@syncfusion/ej2-inputs';
import { ApprovalDecisionResult, ApprovalRequestField, ReviewerRef } from '../../models/workflow-step-props';
import { WorkflowStep } from '../../models/workflow-step';
import { WorkflowRuntimeContext } from '../../models/workflow-runtime-context';
import { ExpressionEvaluator } from '../../simulation/expression-evaluator';
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
 * Approval Dialog Options.
 *
 * @private
 */
export interface ApprovalDialogOptions {
    /** Runtime context used to resolve `{{...}}` expressions in the message and values. */
    context: WorkflowRuntimeContext;
    /** Optional identity recorded on the decision (e.g. signed-in user). */
    reviewedBy?: string;
    /** Closes the dialog without a decision when aborted (the run stopped or the step timed out). */
    signal?: AbortSignal;
}

/**
 * Approval Dialog.
 *
 * @private
 */
export class ApprovalDialog {
    private static l10n: L10n | undefined;
    private static locator: ServiceLocator | undefined;

    /**
     * Mirror the host's L10n instance (and the shared service locator) into
     * this static dialog. The locator is preferred on every
     * `resolveCaption()` lookup so runtime `setLocale()` changes take effect
     * on the next render without requiring a per-editor re-wire; the static
     * `l10n` is the defensive fallback for callers that do not pass a
     * locator.
     *
     * @param {L10n} [l10n] The optional L10n instance to use.
     * @param {ServiceLocator} [locator] The optional shared service locator.
     * @returns {void} Nothing.
     * @private
     */
    public static setLocale(l10n?: L10n, locator?: ServiceLocator): void {
        ApprovalDialog.l10n = l10n;
        ApprovalDialog.locator = locator;
    }

    /**
     * Resolve a localised string from the active L10n bundle, with a
     * fallback to the bundled English string.
     *
     * @param {string} key The key.
     * @param {string[]} [args] The args.
     * @returns {string} The resolved string.
     * @private
     */
    private static resolveCaption(key: string, args?: string[]): string {
        const l10n: L10n | undefined = resolveEditorL10n(
            ApprovalDialog.locator,
            ApprovalDialog.l10n
        );
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
     * Show.
     *
     * @param {HTMLElement} host The host.
     * @param {WorkflowStepModel} step The step.
     * @param {ApprovalDialogOptions} options The options.
     * @returns {Promise} The result.
     * @private
     */
    public static show(
        host: HTMLElement,
        step: WorkflowStep,
        options: ApprovalDialogOptions
    ): Promise<ApprovalDecisionResult | undefined> {
        const props: Record<string, unknown> = ApprovalDialog.readProps(step);
        const rawMessage: string = String(props.requestMessage || '').trim();
        const requestFields: ApprovalRequestField[] = ApprovalDialog.readRequestFields(props);
        const reviewers: ReviewerRef[] = ApprovalDialog.readReviewers(props);
        const fallbackTitle: string = step.name
            ? ApprovalDialog.resolveCaption('approvalDefaultTitle', [step.name])
            : 'Approval';
        const context: unknown = options.context || { input: { response: {} }, nodes: {}, variables: {} };
        const resolvedMessage: string = rawMessage
            ? ApprovalDialog.formatForDisplay(ExpressionEvaluator.resolve(rawMessage, context)).trim()
            : '';
        const title: string = resolvedMessage || fallbackTitle;

        return new Promise<ApprovalDecisionResult | undefined>((resolve: (value: ApprovalDecisionResult | undefined) => void) => {
            const target: HTMLDivElement = document.createElement('div');
            host.appendChild(target);

            const content: HTMLDivElement = document.createElement('div');

            const body: HTMLDivElement = document.createElement('div');
            body.className = 'e-wf-approval-dialog-body';

            // Reviewer section — one card per configured reviewer with a
            // type chip. The card layout mirrors the reference image and
            // keeps reviewers visually distinct from request details.
            const resolvedReviewers: Array<{ type: 'User' | 'Role' | 'Group' | 'Email'; display: string; raw: string }> =
                ApprovalDialog.resolveReviewers(reviewers, context);
            if (resolvedReviewers.length) {
                const reviewersSection: HTMLDivElement = document.createElement('div');
                reviewersSection.className = 'e-wf-approval-reviewers';
                const reviewersHeading: HTMLDivElement = document.createElement('div');
                reviewersHeading.className = 'e-wf-approval-section-label';
                reviewersHeading.textContent = ApprovalDialog.resolveCaption('approvalReviewerHeading');
                reviewersSection.appendChild(reviewersHeading);
                resolvedReviewers.forEach((r: { type: 'User' | 'Role' | 'Group' | 'Email'; display: string; raw: string }) => {
                    const card: HTMLDivElement = document.createElement('div');
                    card.className = 'e-wf-approval-reviewer-card';
                    card.setAttribute('role', 'group');
                    card.setAttribute('aria-label', ApprovalDialog.resolveCaption('approvalReviewerAria', [r.type]));
                    const name: HTMLDivElement = document.createElement('div');
                    name.className = 'e-wf-approval-reviewer-name';
                    name.textContent = r.display || ApprovalDialog.resolveCaption('approvalEmptyValue');
                    name.title = r.display;
                    const chip: HTMLSpanElement = document.createElement('span');
                    // Per-type tint surfaced via a BEM-style modifier so
                    // CSS can color the chip by reviewer kind (User,
                    // Role, Group, Email) without touching markup.
                    chip.className = 'e-wf-approval-reviewer-chip '
                        + 'e-wf-approval-reviewer-chip--' + r.type.toLowerCase();
                    chip.textContent = r.type;
                    card.appendChild(name);
                    card.appendChild(chip);
                    reviewersSection.appendChild(card);
                });
                body.appendChild(reviewersSection);
            }

            const detailsHeading: HTMLDivElement = document.createElement('div');
            detailsHeading.className = 'e-wf-approval-section-label';
            detailsHeading.textContent = ApprovalDialog.resolveCaption('approvalRequestDetails');
            body.appendChild(detailsHeading);

            if (!requestFields.length) {
                const empty: HTMLDivElement = document.createElement('div');
                empty.className = 'e-wf-approval-empty';
                empty.textContent = ApprovalDialog.resolveCaption('approvalEmpty');
                body.appendChild(empty);
            } else {
                const grid: HTMLDivElement = document.createElement('div');
                grid.className = 'e-wf-approval-grid';
                requestFields.forEach((field: ApprovalRequestField) => {
                    const row: HTMLDivElement = document.createElement('div');
                    row.className = 'e-wf-approval-row';
                    const label: HTMLDivElement = document.createElement('div');
                    label.className = 'e-wf-approval-label';
                    const labelText: string = String(field.label || '').trim() || ApprovalDialog.resolveCaption('approvalFieldDefaultLabel');
                    label.textContent = labelText;
                    const value: HTMLDivElement = document.createElement('div');
                    value.className = 'e-wf-approval-value';
                    const raw: string = field.value === undefined || field.value === null ? '' : String(field.value);
                    const resolvedValue: unknown = raw ? ExpressionEvaluator.resolve(raw, context) : undefined;
                    const display: string = raw
                        ? ApprovalDialog.formatForDisplay(resolvedValue)
                        : '';
                    value.textContent = display || ApprovalDialog.resolveCaption('approvalEmptyValue');
                    value.title = display;
                    row.appendChild(label);
                    row.appendChild(value);
                    grid.appendChild(row);
                });
                body.appendChild(grid);
            }
            content.appendChild(body);

            // Reject comment (hidden until Reject is chosen) — UX matches
            // Zapier/Activepieces: comment is required on rejection.
            const commentWrap: HTMLDivElement = document.createElement('div');
            commentWrap.className = 'e-wf-approval-comment-wrap';
            commentWrap.hidden = true;
            const commentLabel: HTMLLabelElement = document.createElement('label');
            commentLabel.className = 'e-wf-approval-comment-label';
            commentLabel.textContent = ApprovalDialog.resolveCaption('approvalCommentLabel');
            const commentElement: HTMLTextAreaElement = document.createElement('textarea');
            commentLabel.appendChild(commentElement);
            const commentError: HTMLDivElement = document.createElement('div');
            commentError.className = 'e-wf-approval-comment-error';
            commentError.hidden = true;
            commentWrap.appendChild(commentLabel);
            commentWrap.appendChild(commentError);
            content.appendChild(commentWrap);

            let dialog: Dialog | null = null;
            let commentBox: TextBox | null = null;
            let resolved: boolean = false;

            /**
             * Returns a rendered footer button by its authored cssClass.
             *
             * EJ2 owns the footer markup, so the four actions are addressed
             * through the classes declared on their `buttonModel` rather
             * than through element references held at build time.
             *
             * @param {string} cssClass The authored button class.
             * @returns {HTMLButtonElement} The rendered button, or null when absent.
             */
            const footerButton: (cssClass: string) => HTMLButtonElement | null =
                (cssClass: string): HTMLButtonElement | null => {
                    if (!dialog || !dialog.element) {
                        return null;
                    }
                    return dialog.element.querySelector('.e-footer-content .' + cssClass);
                };

            const setHidden: (cssClass: string, hidden: boolean) => void =
                (cssClass: string, hidden: boolean): void => {
                    const button: HTMLButtonElement | null = footerButton(cssClass);
                    if (button) {
                        // EJ2 renders footer actions and may re-apply layout/styles.
                        // Hiding via the DOM display property is more reliable than
                        // `hidden` for our `buttonModel`-generated markup.
                        if (hidden) {
                            button.style.display = 'none';
                            button.setAttribute('aria-hidden', 'true');
                        } else {
                            button.style.display = '';
                            button.hidden = false;
                            button.removeAttribute('aria-hidden');
                        }
                    }
                };

            const commentText: () => string = (): string =>
                commentBox && commentBox.element ? String(commentBox.element.value || '').trim() : '';

            /**
             * Resolves the dialog exactly once.
             *
             * Escape, the overlay and every footer button all reach this
             * function, so `onResolved` can never fire twice. Disposal is
             * deferred by one task because `hide()` is reached from inside
             * Dialog's own handlers, which are still using the element.
             *
             * @param {ApprovalDecisionResult} result The decision, or undefined when dismissed.
             * @returns {void}
             */
            const finish: (result: ApprovalDecisionResult | undefined) => void =
                (result: ApprovalDecisionResult | undefined): void => {
                    if (resolved) {
                        return;
                    }
                    resolved = true;
                    window.setTimeout(() => {
                        if (commentBox) {
                            commentBox.destroy();
                            commentBox = null;
                        }
                        if (dialog) {
                            dialog.destroy();
                            dialog = null;
                        }
                        if (target.parentNode) {
                            target.parentNode.removeChild(target);
                        }
                    }, 0);
                    if (dialog) {
                        dialog.hide();
                    }
                    resolve(result);
                };

            dialog = new Dialog({
                header: ApprovalDialog.buildHeader(title),
                content: content,
                isModal: true,
                // The original dialog offered no close affordance other than
                // Escape; keeping `showCloseIcon` off preserves that.
                showCloseIcon: false,
                closeOnEscape: true,
                // Sized to the widest content this dialog renders (a
                // two-column request-details grid) and capped so it stays
                // usable on small viewports.
                width: '560px',
                cssClass: 'e-wf-dialog e-wf-approval-dialog',
                buttons: [
                    {
                        buttonModel: { content: ApprovalDialog.resolveCaption('approvalReject'), cssClass: 'e-wf-approval-reject' },
                        click: (): void => {
                            // Swap the action row into the reject-reason flow: hide the
                            // Approve / Reject pair and reveal Back + Submit Rejection.
                            // Cancel is intentionally not part of the dialog any more.
                            setHidden('e-wf-approval-approve', true);
                            setHidden('e-wf-approval-reject', true);
                            setHidden('e-wf-approval-back', false);
                            setHidden('e-wf-approval-submit-reject', false);
                            commentWrap.hidden = false;
                            commentError.hidden = true;
                            // Submit is gated on a non-empty trimmed comment; start
                            // disabled so the reviewer is forced to type first.
                            const submit: HTMLButtonElement | null = footerButton('e-wf-approval-submit-reject');
                            if (submit) {
                                submit.disabled = commentText().length === 0;
                            }
                            if (commentBox) {
                                commentBox.element.focus();
                            }
                        }
                    },
                    {
                        buttonModel: {
                            content: ApprovalDialog.resolveCaption('approvalApprove'),
                            isPrimary: true,
                            cssClass: 'e-wf-dialog-primary e-wf-approval-approve'
                        },
                        click: (): void => {
                            // Approve is only visible while the dialog is in its initial
                            // state; the rejection flow swaps it out for Back + Submit
                            // Rejection, so this path always means "approve now".
                            finish(ApprovalDialog.buildDecision('approved', undefined, options.reviewedBy));
                        }
                    },
                    {
                        buttonModel: { content: ApprovalDialog.resolveCaption('approvalBack'), cssClass: 'e-wf-approval-back' },
                        click: (): void => {
                            // Return to the initial action row without approving,
                            // rejecting or continuing the workflow. Comment text is
                            // cleared so the reviewer can either retype or close the
                            // dialog with no typed reason remaining.
                            if (commentBox) {
                                commentBox.value = '';
                                commentBox.dataBind();
                            }
                            commentError.hidden = true;
                            commentWrap.hidden = true;
                            setHidden('e-wf-approval-back', true);
                            setHidden('e-wf-approval-submit-reject', true);
                            setHidden('e-wf-approval-approve', false);
                            setHidden('e-wf-approval-reject', false);
                            const approve: HTMLButtonElement | null = footerButton('e-wf-approval-approve');
                            if (approve) {
                                approve.focus();
                            }
                        }
                    },
                    {
                        buttonModel: {
                            content: ApprovalDialog.resolveCaption('approvalSubmitRejection'),
                            isPrimary: true,
                            cssClass: 'e-wf-dialog-primary e-wf-approval-submit-reject'
                        },
                        click: (): void => {
                            const comment: string = commentText();
                            if (!comment) {
                                // Defensive: the input listener below already gates the
                                // button, but a programmatic re-enable or paste could
                                // still submit an empty value — surface the inline
                                // error instead of silently dropping the rejection.
                                commentError.textContent = ApprovalDialog.resolveCaption('approvalCommentError');
                                commentError.hidden = false;
                                if (commentBox) {
                                    commentBox.element.focus();
                                }
                                return;
                            }
                            finish(ApprovalDialog.buildDecision('declined', comment, options.reviewedBy));
                        }
                    }
                ],
                // Escape and the overlay both land here; `finish` is
                // idempotent so a button-driven close is a no-op.
                close: (): void => finish(undefined),
                open: (): void => {
                    if (dialog && dialog.element) {
                        dialog.element.setAttribute('aria-label', title);
                    }
                    // EJ2 builds footer buttons asynchronously. If we try to
                    // hide them immediately on `open`, they can briefly
                    // render all actions at once. Defer until the footer DOM
                    // exists so the dialog starts in the intended state:
                    // Approve / Reject only.
                    setHidden('e-wf-approval-back', true);
                    setHidden('e-wf-approval-submit-reject', true);
                    setHidden('e-wf-approval-approve', false);
                    setHidden('e-wf-approval-reject', false);

                    const approve: HTMLButtonElement | null = footerButton('e-wf-approval-approve');
                    if (approve) {
                        approve.focus();
                    }
                }
            });
            dialog.appendTo(target);

            // Close without a decision when the run stops or the step times out.
            if (options.signal) {
                if (options.signal.aborted) {
                    finish(undefined);
                } else {
                    options.signal.addEventListener('abort', () => finish(undefined), { once: true });
                }
            }

            commentBox = new TextBox({
                multiline: true,
                cssClass: 'e-wf-dialog-input e-wf-approval-comment',
                placeholder: ApprovalDialog.resolveCaption('approvalCommentPlaceholder')
            });
            commentBox.appendTo(commentElement);
            commentBox.element.setAttribute('aria-label', ApprovalDialog.resolveCaption('approvalCommentLabel').replace(/\s\*$/, ''));
            commentBox.element.setAttribute('rows', '3');
            // Enable Submit Rejection as soon as the reviewer types a
            // non-empty trimmed comment. Trimmed comparison keeps a
            // whitespace-only rejection from unlocking the button.
            commentBox.element.addEventListener('input', () => {
                const submit: HTMLButtonElement | null = footerButton('e-wf-approval-submit-reject');
                if (!submit || submit.hidden) {
                    return;
                }
                submit.disabled = commentText().length === 0;
                if (!submit.disabled) {
                    commentError.hidden = true;
                }
            });
        });
    }

    /**
     * Builds the dialog header markup.
     *
     * @param {string} title The resolved request message or fallback title.
     * @returns {string} The header markup.
     */
    private static buildHeader(title: string): string {
        const safe: string = String(title)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
        return '<div class="e-wf-approval-dialog-header">'
            + '<div class="e-wf-dialog-title e-wf-approval-dialog-title">' + safe + '</div></div>';
    }

    private static buildDecision(
        decision: 'approved' | 'declined',
        comments: string | undefined,
        reviewedBy: string | undefined
    ): ApprovalDecisionResult {
        const result: ApprovalDecisionResult = {
            decision: decision,
            reviewedAt: new Date()
        };
        if (comments) {
            result.comments = comments;
        }
        if (reviewedBy) {
            result.reviewedBy = reviewedBy;
        }
        return result;
    }

    private static resolveReviewers(
        reviewers: ReviewerRef[],
        context: unknown
    ): Array<{ type: 'User' | 'Role' | 'Group' | 'Email'; display: string; raw: string }> {
        if (!Array.isArray(reviewers) || !reviewers.length) {
            return [];
        }
        const out: Array<{ type: 'User' | 'Role' | 'Group' | 'Email'; display: string; raw: string }> = [];
        reviewers.forEach((r: ReviewerRef) => {
            const type: 'User' | 'Role' | 'Group' | 'Email' = (r && r.type) ? r.type : 'User';
            const raw: string = String((r && r.value) || '').trim();
            if (!raw) {
                return;
            }
            const resolved: string = ApprovalDialog.formatForDisplay(ExpressionEvaluator.resolve(raw, context)).trim();
            if (!resolved) {
                return;
            }
            out.push({ type: type, display: resolved, raw: raw });
        });
        return out;
    }

    /**
     * Smart display formatter for resolved expression values. Naive
     * `String(object)` yields `"[object Object]"` which is useless to a
     * reviewer; this helper renders shapes the way humans actually read
     * them in approval UIs (n8n, Zapier, Make):
     *   - string / number / boolean / Date  → natural shape
     *   - flat object (≤6 scalar entries)   → "Title: Refund · Email: a@b"
     *   - nested object or large object     → tidy JSON dump (truncated)
     *   - array                             → scalar items joined; else JSON
     *   - null / undefined                  → empty string (the caller
     *                                         replaces empty with `—`)
     *
     * @param {Object} value The resolved expression value.
     * @returns {string} The human-readable display value.
     */
    private static formatForDisplay(value: unknown): string {
        if (value === undefined || value === null) {
            return '';
        }
        if (typeof value === 'string') {
            return value;
        }
        if (typeof value === 'number' || typeof value === 'boolean') {
            return String(value);
        }
        if (value instanceof Date) {
            return isNaN(value.getTime()) ? '' : value.toISOString();
        }
        if (Array.isArray(value)) {
            const scalarItems: string[] = value
                .filter((item: unknown) => item === null
                    || item === undefined
                    || typeof item === 'string'
                    || typeof item === 'number'
                    || typeof item === 'boolean')
                .map((item: unknown) => item === null || item === undefined ? '' : String(item));
            if (scalarItems.length === value.length) {
                return scalarItems.join(', ');
            }
            return ApprovalDialog.compactJson(value);
        }
        if (typeof value === 'object') {
            // Manual Object.entries equivalent — the project's tsconfig targets
            // es5 without the es2017.object lib, so `Object.entries` is not
            // available as a typed static method here.
            const record: Record<string, unknown> = value as Record<string, unknown>;
            const keys: string[] = Object.keys(record);
            const isFlatScalar: boolean = keys.every((k: string) => {
                const v: unknown = record[`${k}`];
                return v === null
                    || v === undefined
                    || typeof v === 'string'
                    || typeof v === 'number'
                    || typeof v === 'boolean';
            });
            if (isFlatScalar && keys.length <= 6) {
                return keys
                    .map((k: string) => {
                        const v: unknown = record[`${k}`];
                        return k + ': ' + (v === null || v === undefined ? '' : String(v));
                    })
                    .join(' \u00b7 ');
            }
            return ApprovalDialog.compactJson(value);
        }
        return String(value);
    }

    private static compactJson(value: unknown): string {
        let json: string;
        try {
            json = JSON.stringify(value);
        } catch (e) {
            json = '[unserializable]';
        }
        if (json && json.length > 200) {
            json = json.substring(0, 197) + '\u2026';
        }
        return json;
    }

    private static readProps(step: WorkflowStep): Record<string, unknown> {
        if (step.props && typeof step.props === 'object') {
            return step.props as Record<string, unknown>;
        }
        return {};
    }

    private static readRequestFields(props: Record<string, unknown>): ApprovalRequestField[] {
        const source: unknown = props.requestFields;
        if (!Array.isArray(source)) {
            // Legacy migration: tolerate old `contentToReview` payloads and
            // project them into the new shape so existing workflows still run.
            const legacy: unknown = props.contentToReview;
            if (Array.isArray(legacy)) {
                return legacy.map((item: unknown) => {
                    const record: Record<string, unknown> = (item && typeof item === 'object')
                        ? item as Record<string, unknown>
                        : {};
                    return {
                        label: String(record.label || ''),
                        value: record.value === undefined || record.value === null ? '' : String(record.value)
                    };
                });
            }
            return [];
        }
        return source.map((item: unknown) => {
            const record: Record<string, unknown> = (item && typeof item === 'object')
                ? item as Record<string, unknown>
                : {};
            return {
                label: String(record.label || ''),
                value: record.value === undefined || record.value === null ? '' : String(record.value)
            };
        });
    }

    private static readReviewers(props: Record<string, unknown>): ReviewerRef[] {
        const source: unknown = props.reviewers;
        if (!Array.isArray(source)) {
            return [];
        }
        return source
            .filter((item: unknown) => item && typeof item === 'object')
            .map((item: unknown) => {
                const record: Record<string, unknown> = item as Record<string, unknown>;
                const rawType: string = String(record.type || 'User');
                const type: 'User' | 'Role' | 'Group' | 'Email' = (['User', 'Role', 'Group', 'Email'] as string[])
                    .indexOf(rawType) !== -1
                    ? rawType as 'User' | 'Role' | 'Group' | 'Email'
                    : 'User';
                return {
                    type: type,
                    value: record.value === undefined || record.value === null ? '' : String(record.value)
                };
            });
    }
}

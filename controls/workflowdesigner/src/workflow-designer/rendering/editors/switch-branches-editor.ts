/**
 * Structured Switch branches editor.
 * Writes BranchRule[] with branchName + ConditionRule — not free-form JSON.
 */

import { L10n } from '@syncfusion/ej2-base';
import { TextBox } from '@syncfusion/ej2-inputs';
import { Button } from '@syncfusion/ej2-buttons';
import { BranchRule } from '../../models/workflow-step-props';
import { ConditionRule } from '../../models/workflow-shared-types';
import { ConditionRulesEditor, ConditionRuleExpressionHooks } from './condition-rules-editor';
import { EditorComponents } from './editor-components';
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
function switchFormatTemplate(value: string, args: string[]): string {
    return args.reduce<string>((acc: string, arg: string, index: number) => {
        return acc.replace('{' + index + '}', arg);
    }, value);
}

/**
 * Resolve a localised string from the active L10n bundle, with a fallback
 * to the bundled English string.
 *
 * @param {L10n | undefined} l10n The l10n.
 * @param {string} key The key.
 * @param {string[]} [args] The args.
 * @returns {string} The resolved string.
 * @private
 */
function switchResolveCaption(l10n: L10n | undefined, key: string, args?: string[]): string {
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
        return switchFormatTemplate(value, args);
    }
    return value;
}

/**
 * Switch Branches Change Handler.
 *
 * @private
 */
export type SwitchBranchesChangeHandler = (branches: BranchRule[]) => void;
/**
 * Switch Branches Commit Handler.
 *
 * @private
 */
export type SwitchBranchesCommitHandler = () => void;

/**
 * Renders add/remove switch branches with operator/field condition UI.
 *
 * @private
 */
export class SwitchBranchesEditor {
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
        SwitchBranchesEditor.l10n = l10n;
        SwitchBranchesEditor.locator = locator;
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
        return switchResolveCaption(
            resolveEditorL10n(SwitchBranchesEditor.locator, SwitchBranchesEditor.l10n),
            key,
            args
        );
    }

    /**
     * Render.
     *
     * @param {HTMLElement} host The host.
     * @param {BranchRule} branches The branches.
     * @param {SwitchBranchesChangeHandler} onChange The on change.
     * @param {ConditionRuleExpressionHooks} hooks The hooks.
     * @param {SwitchBranchesCommitHandler} onCommit The on commit.
     * @param {L10n} [l10n] Optional L10n override for this render.
     * @returns {void} Nothing.
     * @private
     */
    public static render(
        host: HTMLElement,
        branches: BranchRule[],
        onChange: SwitchBranchesChangeHandler,
        hooks?: ConditionRuleExpressionHooks,
        onCommit?: SwitchBranchesCommitHandler
    ): void {
        const root: HTMLDivElement = document.createElement('div');
        root.className = 'e-wf-list-editor e-wf-switch-branches-editor';

        const list: HTMLDivElement = document.createElement('div');
        list.className = 'e-wf-list-editor-items';

        const current: BranchRule[] = SwitchBranchesEditor.cloneBranches(Array.isArray(branches) ? branches : []);

        const emit: () => void = (): void => {
            onChange(SwitchBranchesEditor.cloneBranches(current));
        };

        const rebuild: () => void = (): void => {
            // Components must be disposed before the rows are discarded;
            // clearing `innerHTML` alone would orphan every instance.
            EditorComponents.clear(list);
            if (!current.length) {
                const empty: HTMLDivElement = document.createElement('div');
                empty.className = 'e-wf-list-editor-empty';
                empty.textContent = SwitchBranchesEditor.t('branchEmpty');
                list.appendChild(empty);
            }
            current.forEach((branch: BranchRule, index: number) => {
                SwitchBranchesEditor.renderRow(list, branch, index, current, emit, rebuild, hooks, onCommit);
            });
        };

        const toolbar: HTMLDivElement = document.createElement('div');
        toolbar.className = 'e-wf-list-editor-toolbar';
        const add: HTMLButtonElement = document.createElement('button');
        add.className = 'e-wf-list-editor-add';
        add.addEventListener('click', () => {
            current.push({
                branchName: SwitchBranchesEditor.nextBranchName(current),
                condition: ConditionRulesEditor.defaultRule()
            });
            rebuild();
            emit();
            if (onCommit) {
                onCommit();
            }
        });
        toolbar.appendChild(add);

        root.appendChild(list);
        root.appendChild(toolbar);
        host.appendChild(root);
        // Mounted after the host is attached: an EJ2 component initialised
        // while detached measures zero.
        new Button({ cssClass: 'e-wf-list-editor-add', isPrimary: true, content: SwitchBranchesEditor.t('branchAdd') }).appendTo(add);
        rebuild();
    }

    private static renderRow(
        container: HTMLElement,
        branch: BranchRule,
        index: number,
        all: BranchRule[],
        emit: () => void,
        rebuild: () => void,
        hooks?: ConditionRuleExpressionHooks,
        onCommit?: SwitchBranchesCommitHandler
    ): void {
        const row: HTMLDivElement = document.createElement('div');
        row.className = 'e-wf-list-editor-row e-wf-switch-branch-row';
        // Attached up front so every component below is instantiated on a
        // laid-out element rather than a detached one.
        container.appendChild(row);

        const header: HTMLDivElement = document.createElement('div');
        header.className = 'e-wf-list-editor-row-header';
        const title: HTMLSpanElement = document.createElement('span');
        title.className = 'e-wf-list-editor-row-title';
        title.textContent = SwitchBranchesEditor.t('branchRow', [String(index + 1)]);
        const remove: HTMLButtonElement = document.createElement('button');
        remove.className = 'e-wf-list-editor-remove';
        remove.setAttribute('title', SwitchBranchesEditor.t('branchRemove'));
        remove.setAttribute('aria-label', SwitchBranchesEditor.t('branchRemove'));
        remove.addEventListener('click', () => {
            all.splice(index, 1);
            rebuild();
            emit();
            if (onCommit) {
                onCommit();
            }
        });
        header.appendChild(title);
        header.appendChild(remove);
        row.appendChild(header);
        new Button({
            cssClass: 'e-wf-list-editor-remove e-flat',
            iconCss: 'e-icons e-close'
        }).appendTo(remove);

        const nameWrap: HTMLLabelElement = document.createElement('label');
        nameWrap.className = 'e-wf-list-editor-subfield';
        const nameCaption: HTMLSpanElement = document.createElement('span');
        nameCaption.className = 'e-wf-list-editor-sublabel';
        nameCaption.textContent = SwitchBranchesEditor.t('branchName');
        const nameElement: HTMLInputElement = document.createElement('input');
        nameElement.type = 'text';
        nameWrap.appendChild(nameCaption);
        nameWrap.appendChild(nameElement);
        row.appendChild(nameWrap);
        const nameInput: TextBox = new TextBox({
            cssClass: 'e-wf-property-input',
            value: String(branch.branchName || '')
        });
        nameInput.appendTo(nameElement);
        nameInput.element.setAttribute('aria-label', SwitchBranchesEditor.t('branchName'));
        nameInput.element.addEventListener('change', () => {
            branch.branchName = nameInput.element.value;
            emit();
        });

        if (!branch.condition) {
            branch.condition = ConditionRulesEditor.defaultRule();
        }
        const conditionHost: HTMLDivElement = document.createElement('div');
        conditionHost.className = 'e-wf-switch-branch-condition';
        ConditionRulesEditor.renderSingleRule(
            conditionHost,
            branch.condition,
            (rule: ConditionRule) => {
                branch.condition = rule;
                emit();
            },
            hooks
        );
        row.appendChild(conditionHost);
    }

    private static nextBranchName(branches: BranchRule[]): string {
        let n: number = branches.length + 1;
        const used: { [name: string]: boolean } = Object.create(null);
        branches.forEach((b: BranchRule) => {
            if (b.branchName) {
                used[b.branchName] = true;
            }
        });
        while (used['branch' + n]) {
            n++;
        }
        return 'branch' + n;
    }

    private static cloneBranches(branches: BranchRule[]): BranchRule[] {
        return branches.map((branch: BranchRule) => ({
            branchName: branch && branch.branchName ? String(branch.branchName) : '',
            condition: ConditionRulesEditor.cloneRule(
                branch && branch.condition ? branch.condition : ConditionRulesEditor.defaultRule()
            )
        }));
    }
}

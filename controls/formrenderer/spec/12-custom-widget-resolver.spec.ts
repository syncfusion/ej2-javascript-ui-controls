/**
 * 12 — Custom widget resolver priority contract
 *
 * Pure unit tests for `resolveCustomWidget` (no DOM, no Karma fixture).
 * Verifies the user-issued priority contract:
 *
 *   1. fieldName  — wins unconditionally (even if entry.templateId is
 *                   set AND differs from the schema's component.templateId,
 *                   or component.templateId is absent).
 *   2. templateId — wins over type when component.templateId is non-empty
 *                   and equals entry.templateId.
 *   3. type       — catch-all for any component whose type matches.
 *
 * Each scenario asserts both the `matchKind` and the selected `entry`
 * reference to make sure the resolver returns the right entry and tier.
 */

import { resolveCustomWidget, ResolvedCustomWidget } from '../src/form-renderer/form-renderer/custom-widget-resolver';
import { CustomWidgetSettingModel, FormNode } from '../src/index';

function makeComponent(name: string, type: FormNode['type'], templateId?: string): FormNode {
    const node: FormNode = {
        id: `${name}_id`,
        type,
        name,
        label: `Test ${name}`
    } as FormNode;
    if (templateId !== undefined) {
        (node as any).templateId = templateId;
    }
    return node;
}

function makeEntry(partial: Partial<CustomWidgetSettingModel> & { template?: any }): CustomWidgetSettingModel {
    return {
        template: partial.template !== undefined ? partial.template : '<div></div>',
        ...partial
    } as CustomWidgetSettingModel;
}

describe('resolveCustomWidget — priority contract', (): void => {

    it('Scenario 1: type tier catches all when no higher tier matches', (): void => {
        const comp: FormNode = makeComponent('f1', 'textbox');
        const entry: CustomWidgetSettingModel = makeEntry({ type: 'textbox', template: '<b>A</b>' });
        const result: ResolvedCustomWidget | null = resolveCustomWidget(comp, [entry]);
        expect(result).not.toBeNull();
        expect(result!.matchKind).toBe('type');
        expect(result!.entry).toBe(entry);
    });

    it('Scenario 2: templateId tier beats type tier', (): void => {
        const comp: FormNode = makeComponent('f1', 'textbox', 't-a');
        const typeEntry: CustomWidgetSettingModel = makeEntry({ type: 'textbox', template: '<b>A</b>' });
        const tplEntry: CustomWidgetSettingModel = makeEntry({ templateId: 't-a', template: '<b>B</b>' });
        const result: ResolvedCustomWidget | null = resolveCustomWidget(comp, [typeEntry, tplEntry]);
        expect(result).not.toBeNull();
        expect(result!.matchKind).toBe('templateId');
        expect(result!.entry).toBe(tplEntry);
    });

    it('Scenario 3: fieldName tier wins even when entry.templateId is set and component.templateId is undefined', (): void => {
        const comp: FormNode = makeComponent('f1', 'textbox');
        const entry: CustomWidgetSettingModel = makeEntry({ fieldName: 'f1', templateId: 't-x', template: '<b>C</b>' });
        const result: ResolvedCustomWidget | null = resolveCustomWidget(comp, [entry]);
        expect(result).not.toBeNull();
        expect(result!.matchKind).toBe('fieldName');
        expect(result!.entry).toBe(entry);
    });

    it('Scenario 4: fieldName tier wins when entry.templateId differs from component.templateId (brief explicit case)', (): void => {
        const comp: FormNode = makeComponent('f1', 'textbox', 't-b');
        const entry: CustomWidgetSettingModel = makeEntry({ fieldName: 'f1', templateId: 't-x', template: '<b>C</b>' });
        const result: ResolvedCustomWidget | null = resolveCustomWidget(comp, [entry]);
        expect(result).not.toBeNull();
        expect(result!.matchKind).toBe('fieldName');
        expect(result!.entry).toBe(entry);
    });

    it('Scenario 5: fieldName on a different component does NOT match — falls through to templateId', (): void => {
        const comp: FormNode = makeComponent('f1', 'textbox', 't-a');
        const tplEntry: CustomWidgetSettingModel = makeEntry({ templateId: 't-a', template: '<b>B</b>' });
        const fieldEntry: CustomWidgetSettingModel = makeEntry({ fieldName: 'f2', template: '<b>C</b>' });
        const result: ResolvedCustomWidget | null = resolveCustomWidget(comp, [tplEntry, fieldEntry]);
        expect(result).not.toBeNull();
        expect(result!.matchKind).toBe('templateId');
        expect(result!.entry).toBe(tplEntry);
    });

    it('Scenario 6: empty settings array → null', (): void => {
        const comp: FormNode = makeComponent('f1', 'textbox');
        const result: ResolvedCustomWidget | null = resolveCustomWidget(comp, []);
        expect(result).toBeNull();
    });

    it('Scenario 7: undefined settings → null', (): void => {
        const comp: FormNode = makeComponent('f1', 'textbox');
        const result: ResolvedCustomWidget | null = resolveCustomWidget(comp, undefined);
        expect(result).toBeNull();
    });

    it('Scenario 8: type mismatch → null', (): void => {
        const comp: FormNode = makeComponent('f1', 'textbox');
        const entry: CustomWidgetSettingModel = makeEntry({ type: 'textarea', template: '<b>A</b>' });
        const result: ResolvedCustomWidget | null = resolveCustomWidget(comp, [entry]);
        expect(result).toBeNull();
    });

    it('Scenario 9: no tier matches → null', (): void => {
        const comp: FormNode = makeComponent('f1', 'textbox', 't-a');
        const entry: CustomWidgetSettingModel = makeEntry({ fieldName: 'f2', templateId: 't-b', template: '<b>C</b>' });
        const result: ResolvedCustomWidget | null = resolveCustomWidget(comp, [entry]);
        expect(result).toBeNull();
    });

    it('Scenario 10: empty entry.fieldName is treated as unset (no fieldName match)', (): void => {
        const comp: FormNode = makeComponent('f1', 'textbox');
        // Empty-string fieldName should not match (treated as unset per the interface default).
        const entry: CustomWidgetSettingModel = makeEntry({ fieldName: '', type: 'textbox', template: '<b>A</b>' });
        const result: ResolvedCustomWidget | null = resolveCustomWidget(comp, [entry]);
        expect(result).not.toBeNull();
        expect(result!.matchKind).toBe('type');
    });

    it('Scenario 11: fieldName tier ignores entry.templateId entirely (templateId matches but fieldName still wins)', (): void => {
        // entry has fieldName='f1' AND templateId='t-a' ; component has name='f1' AND templateId='t-a'.
        // Both could match. Per the priority contract, fieldName tier is checked first and wins.
        const comp: FormNode = makeComponent('f1', 'textbox', 't-a');
        const entry: CustomWidgetSettingModel = makeEntry({ fieldName: 'f1', templateId: 't-a', template: '<b>C</b>' });
        const result: ResolvedCustomWidget | null = resolveCustomWidget(comp, [entry]);
        expect(result).not.toBeNull();
        expect(result!.matchKind).toBe('fieldName');
        expect(result!.entry).toBe(entry);
    });

    it('Scenario 12: first entry wins within type tier when multiple type entries match', (): void => {
        const comp: FormNode = makeComponent('f1', 'textbox');
        const first: CustomWidgetSettingModel = makeEntry({ type: 'textbox', template: '<b>1</b>' });
        const second: CustomWidgetSettingModel = makeEntry({ type: 'textbox', template: '<b>2</b>' });
        const result: ResolvedCustomWidget | null = resolveCustomWidget(comp, [first, second]);
        expect(result).not.toBeNull();
        expect(result!.matchKind).toBe('type');
        expect(result!.entry).toBe(first);
    });
});

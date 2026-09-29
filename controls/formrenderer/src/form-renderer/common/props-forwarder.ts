/**
 * @private
 */

/**
 * @private
 */
export const RESERVED_RENDERER_KEYS: ReadonlyArray<string> = [
    'id',               // renderer-supplied id (component.name becomes id)
    'type',             // drives the renderFormField switch
    'name',             // renderer-supplied name (component.id becomes name)
    'label',            // label is rendered outside the control
    'conditions',       // ConditionalRuleEngine metadata
    'customValidation', // FormStateBridge rule metadata
    'customvalidation', // lower-case form too (defensive)
    '_configured',      // internal "fully configured" flag
    'widget',           // alias of `type`
    'templateId',       // out of scope for this change (carved out by user)
    'kind',             // reserved
    'as',               // reserved
    'visibility',       // internal state
    'options',          // selection-only; rendered cases already handle this
    'tableCells',       // layout-only
    'tabItems',         // layout-only
    'children',         // layout-only
    'templateData',     // template plumbing (out of scope)
    'ref'
];

/**
 * EJ2 lifecycle / framework methods whose names MUST NOT be invoked
 * by the pass-through (would be assigned-as-data, ignored by the
 * framework, but also poison if mapped to a setter eager on init).
 *
 * @private
 */
export const EJ2_LIFECYCLE_KEYS: ReadonlyArray<string> = [
    'created',
    'destroyed',
    'appendTo',
    'appendToElement',
    'append',
    'render',
    'addEventListener',
    'removeEventListener',
    'getModuleName',
    'inject',
    'dataBind',
    'refresh',
    'onPropertyChanged'
];

/**
 * @private
 */
export function pickUnmappedSchemaProps(
    component: { [key: string]: unknown } | undefined | null,
    explicitKeys: ReadonlyArray<string>
): { [key: string]: unknown } {
    const comp: { [k: string]: unknown } = component || {};
    const explicit: { [k: string]: boolean } = {};
    for (let exIdx: number = 0; exIdx < explicitKeys.length; exIdx++) {
        explicit[explicitKeys[exIdx]] = true;
    }
    for (let rIdx: number = 0; rIdx < RESERVED_RENDERER_KEYS.length; rIdx++) {
        explicit[RESERVED_RENDERER_KEYS[rIdx]] = true;
    }
    for (let lIdx: number = 0; lIdx < EJ2_LIFECYCLE_KEYS.length; lIdx++) {
        explicit[EJ2_LIFECYCLE_KEYS[lIdx]] = true;
    }

    const keys: string[] = [];
    for (const k in comp) {
        if (
            Object.prototype.hasOwnProperty.call(comp, k) &&
            !explicit[k] &&
            k !== '__proto__' &&
            k !== 'constructor'
        ) {
            keys.push(k);
        }
    }
    keys.sort();

    const out: { [k: string]: unknown } = {};
    for (let outIdx: number = 0; outIdx < keys.length; outIdx++) {
        const key: string = keys[outIdx];
        out[key] = comp[key];
    }
    return out;
}

/**
 * @private
 */
export function applyExtraProps(control: any, extra: { [key: string]: unknown }): number {
    if (!control || !extra) { return 0; }
    const keys: string[] = Object.keys(extra);
    let applied: number = 0;
    for (let kIdx: number = 0; kIdx < keys.length; kIdx++) {
        const k: string = keys[kIdx];
        try {
            (control as any)[k] = extra[k];
            applied++;
        } catch (e) {
            const ctor: string = (control && control.constructor && control.constructor.name) || '<unknown>';
            // eslint-disable-next-line no-console
            console.warn(`[form-renderer] cannot forward schema property "${k}" to control of type ${ctor}:`, e);
        }
    }
    return applied;
}

/**
 * @private
 */
export function forwardExtras(
    control: any,
    component: { [key: string]: unknown } | undefined | null,
    explicitKeys: ReadonlyArray<string>,
    extras?: ReadonlyArray<{ key: string; value: unknown }>
): number {
    const picked: { [k: string]: unknown } = pickUnmappedSchemaProps(component, explicitKeys);
    if (extras && extras.length) {
        for (let exIdx: number = 0; exIdx < extras.length; exIdx++) {
            const item: { key: string; value: unknown } = extras[exIdx];
            picked[item.key] = item.value;
        }
        // Re-sort with the injected extras deterministically.
        const sorted: { [k: string]: unknown } = {};
        Object.keys(picked).sort().forEach((k: string): void => {
            sorted[k] = picked[k];
        });
        return applyExtraProps(control, sorted);
    }
    return applyExtraProps(control, picked);
}

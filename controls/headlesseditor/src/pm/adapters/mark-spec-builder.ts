import { MarkSpec, AttributeSpec } from '../pm-guard';
import { MarkDefinition } from '../../schema/types/mark-definition';
import { DOMSpecRegistry } from '../dom/dom-spec-registry';

/**
 * MarkSpecBuilder — converts a MarkDefinition to a ProseMirror MarkSpec.
 *
 * Delegates toDOM resolution entirely to the DOMSpecRegistry — the builder
 * itself owns no rendering knowledge.
 *
 * Only used internally by PMSchemaAdapter.compile() to build full schemas.
 */
export class MarkSpecBuilder {
    private readonly _domRegistry: DOMSpecRegistry;

    public constructor(domRegistry: DOMSpecRegistry) {
        this._domRegistry = domRegistry;
    }

    public build(def: MarkDefinition): MarkSpec {
        const spec: MarkSpec = {};

        if (def.attrs && def.attrs.length > 0) {
            const attrs: Record<string, AttributeSpec> = {};
            for (const attrDef of def.attrs) {
                const attrSpec: AttributeSpec = {};
                if ('default' in attrDef && attrDef.default !== undefined) {
                    attrSpec.default = attrDef.default;
                }
                attrs[attrDef.name] = attrSpec;
            }
            spec.attrs = attrs;
        }

        if (def.inclusive !== undefined) {
            spec.inclusive = def.inclusive;
        }

        if (def.spanning !== undefined) {
            spec.spanning = def.spanning;
        }

        if (def.excludes !== undefined) {
            spec.excludes = def.excludes.join(' ');
        }

        // ── toDOM and parseDOM ────────────────────────────────────────────
        // Delegated to the registry. Throws MissingDOMSpecError if the mark
        // type has no registered spec — missing specs are config errors.
        const markDOMSpec: ReturnType<DOMSpecRegistry['getMarkDOMSpec']> = this._domRegistry.getMarkDOMSpec(def.name);
        const domProps: Record<string, any> = { toDOM: markDOMSpec.toDOM };
        if (markDOMSpec.parseDOM) {
            domProps.parseDOM = markDOMSpec.parseDOM;
        }
        Object.assign(spec, domProps);

        return spec;
    }
}

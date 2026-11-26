import { WorkflowStep } from '../models/workflow-step';
import { WorkflowConnection } from '../models/workflow-connection';

type StepDefaultsCallback = (step: WorkflowStep) => WorkflowStep;
type ConnectionDefaultsCallback = (connection: WorkflowConnection) => WorkflowConnection;
type FlatValues = Record<string, unknown>;

const STEP_KEYS: string[] = [
    'size.width', 'size.height',
    'appearance.iconCss', 'appearance.strokeColor', 'appearance.strokeWidth', 'appearance.fill', 'appearance.textColor'
];
for (const state of ['running', 'completed', 'failed']) {
    for (const prop of ['iconCss', 'strokeColor', 'strokeWidth', 'fill', 'textColor']) {
        STEP_KEYS.push('stateAppearance.' + state + '.' + prop);
    }
}
const CONNECTION_KEYS: string[] = [
    'type', 'sourceDecorator', 'targetDecorator',
    'style.strokeColor', 'style.strokeWidth', 'style.strokeDashArray',
    'successStyle.strokeColor', 'successStyle.strokeWidth', 'successStyle.strokeDashArray'
];

/**
 * Resolves `stepDefaults` / `connectionDefaults` onto workflow items.
 *
 * Defaults are written into the item so the exported JSON carries the resolved values. The values written
 * by a defaults callback are remembered per item (never serialized), so a later re-evaluation can tell
 * them apart from explicit values: explicit values are never overwritten, and a default that is removed
 * is cleared so the built-in default applies again.
 *
 * @private
 */
export class DefaultsResolver {
    public stepDefaults: StepDefaultsCallback | null = null;
    public connectionDefaults: ConnectionDefaultsCallback | null = null;
    private applied: WeakMap<object, FlatValues> = new WeakMap<object, FlatValues>();
    private busy: boolean = false;

    public applyStep(step: WorkflowStep): void {
        this.apply(step, this.stepDefaults, STEP_KEYS, ['size', 'appearance', 'stateAppearance']);
    }

    public applyConnection(connection: WorkflowConnection): void {
        this.apply(connection, this.connectionDefaults, CONNECTION_KEYS, ['style', 'successStyle']);
    }

    private apply(
        item: object, callback: Function | null, keys: string[], nested: string[]
    ): void {
        if (this.busy || (typeof callback !== 'function' && !this.applied.has(item))) {
            return; // a callback that calls dataBind() must not re-enter the resolver
        }
        this.busy = true;
        try {
            this.run(item, callback, keys, nested);
        } finally {
            this.busy = false;
        }
    }

    private run(
        item: object, callback: Function | null, keys: string[], nested: string[]
    ): void {
        const record: Record<string, unknown> = item as Record<string, unknown>;
        const next: FlatValues = typeof callback === 'function' ? this.evaluate(item, callback, keys, nested, this.applied.get(item) || {}) : {};
        const previous: FlatValues = this.applied.get(item) || {};
        const now: FlatValues = {};
        for (const key of keys) {
            const current: unknown = DefaultsResolver.read(record, key);
            const ownedByDefaults: boolean = key in previous && current === previous[`${key}`];
            if (current !== undefined && !ownedByDefaults) {
                continue; // explicit value wins
            }
            if (next[`${key}`] !== undefined) {
                DefaultsResolver.write(record, key, next[`${key}`]);
                now[`${key}`] = next[`${key}`];
            } else if (ownedByDefaults) {
                DefaultsResolver.write(record, key, undefined);
            }
        }
        this.applied.set(item, now);
    }

    private evaluate(item: object, callback: Function, keys: string[], nested: string[], owned: FlatValues): FlatValues {
        const out: FlatValues = {};
        try {
            const copy: Record<string, unknown> = Object.assign({}, item as Record<string, unknown>);
            for (const name of nested) {
                const value: unknown = copy[`${name}`];
                if (value && typeof value === 'object') {
                    copy[`${name}`] = JSON.parse(JSON.stringify(value));
                }
            }
            // The callback sees only explicit values, never the ones a previous run supplied.
            for (const key of keys) {
                if (key in owned && DefaultsResolver.read(copy, key) === owned[`${key}`]) {
                    DefaultsResolver.write(copy, key, undefined);
                }
            }
            // EJ2 defaults callbacks may mutate their argument and return nothing, or return the item.
            const returned: unknown = callback(copy);
            const result: unknown = returned && typeof returned === 'object' ? returned : copy;
            for (const key of keys) {
                const value: unknown = DefaultsResolver.read(result as Record<string, unknown>, key);
                if (DefaultsResolver.valid(key, value)) {
                    out[`${key}`] = value;
                }
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Workflow defaults callback failed:', error);
            return {};
        }
        return out;
    }

    private static valid(key: string, value: unknown): boolean {
        if (value === undefined || value === null) {
            return false;
        }
        const numeric: boolean = key === 'size.width' || key === 'size.height' || /\.strokeWidth$/.test(key);
        return numeric ? typeof value === 'number' && isFinite(value) && value >= 0 : typeof value === 'string';
    }

    private static read(target: Record<string, unknown>, path: string): unknown {
        let holder: unknown = target;
        for (const part of path.split('.')) {
            if (!holder || typeof holder !== 'object') {
                return undefined;
            }
            holder = (holder as Record<string, unknown>)[`${part}`];
        }
        return holder;
    }

    private static write(target: Record<string, unknown>, path: string, value: unknown): void {
        const parts: string[] = path.split('.');
        const chain: Array<Record<string, unknown>> = [target];
        for (let i: number = 0; i < parts.length - 1; i++) {
            const holder: Record<string, unknown> = chain[parseInt(i.toString(), 10)];
            let next: unknown = holder[`${parts[parseInt(i.toString(), 10)]}`];
            if (!next || typeof next !== 'object') {
                if (value === undefined) {
                    return;
                }
                next = {};
                holder[`${parts[parseInt(i.toString(), 10)]}`] = next;
            }
            chain.push(next as Record<string, unknown>);
        }
        const leaf: string = parts[parts.length - 1];
        const owner: Record<string, unknown> = chain[chain.length - 1];
        if (value === undefined) {
            delete owner[`${leaf}`];
            // Drop containers that became empty so nothing stray is exported.
            for (let i: number = chain.length - 1; i > 0; i--) {
                if (Object.keys(chain[parseInt(i.toString(), 10)]).length === 0) {
                    delete chain[i - 1][`${parts[i - 1]}`];
                }
            }
        } else {
            owner[`${leaf}`] = value;
        }
    }
}

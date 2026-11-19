/**
 * Process-wide optional-feature registry owned by core.
 *
 * @remarks
 * Core never imports `src/pptx/features/*`. Feature packages call {@link registerFeature}
 * from their own entry points; applications call {@link ensureFeature} when they need
 * a domain at runtime. An empty registry must not block open/save or opaque
 * preservation (see `docs/architecture/MODULAR-LOADING.md` and
 * `.agent/policies/modularity.md`).
 *
 * These APIs are infrastructure registration hooks, not document content mutators
 * (see `docs/api/API-RULES.md` verb conventions for content APIs).
 *
 * @packageDocumentation
 */
import { ShapeType } from '../presentation/shapetype';
import { OoxmlElement } from '../xml/index';
import { arrayAt } from '../util/es5-compat';
/**
 * Stable identifier for an optional feature domain (for example `"animation"`).
 *
 * @public
 */
export type FeatureId = string;
/**
 * Descriptor supplied by an optional feature package when it registers with core.
 *
 * @remarks
 * The skeleton only requires {@link FeatureModule.id}. Later feature tasks may use
 * {@link FeatureModule.activate} for one-time initialization. Core still must not
 * import feature module bodies.
 *
 * @public
 */
export interface FeatureModule {
    /** Domain id used by {@link ensureFeature} and queries. */
    readonly id: FeatureId;
    /**
     * Optional one-time activation hook.
     *
     * @remarks
     * Invoked at most once per successful {@link ensureFeature} for this id after
     * registration. Must not pull other feature domains into the core graph.
     */
    readonly activate?: () => void | Promise<void>;
}
interface RegistryEntry {
    readonly module: FeatureModule;
    activated: boolean;
}
const registry: Map<string, RegistryEntry> = new Map<FeatureId, RegistryEntry>();
const graphicKindDetectors: GraphicKindDetector[] = [];
/** Extra comment relationship type URIs registered by optional comment modules. */
const commentRelTypes: Set<string> = new Set<string>();
/** Detector hook used by optional graphic payload modules. */
export interface GraphicKindDetector {
    /** Returns a content kind when this detector owns the element, otherwise null. */
    detect(uri: string | undefined, element: OoxmlElement): ShapeType | null;
}
/**
 * Registers an optional graphic payload detector.
 *
 * @param {GraphicKindDetector} detector - The detector value.
 * @returns {void} Nothing.
 */
export function registerGraphicKindDetector(detector: GraphicKindDetector): void {
    graphicKindDetectors.push(detector);
}
/**
 * Registers an additional slide→comments relationship type for {@link Slide.hasComments}.
 *
 * @remarks Core already treats types ending with `/relationships/comments` as comments (ECMA-376 Part 4 Transitional comments). Optional
 * modules call this for extension types that do not use that suffix. Duplicates are ignored. Citation: ECMA-376-1 §13.3.2;
 * `docs/specs/023-comments-preserve.md`.
 * @internal
 * @param {string} relationshipType - Full relationship Type URI (never invent URIs).
 * @returns {void} Nothing.
 */
export function registerCommentRelType(relationshipType: string): void {
    if (relationshipType.length === 0) {
        throw new Error('Comment relationship type must be a non-empty string.');
    }
    commentRelTypes.add(relationshipType);
}
/**
 * Returns whether a relationship type is a registered comments extension type.
 *
 * @internal
 * @param {string} relationshipType - Relationship Type URI from a slide part relationship.
 * @returns {boolean} `true` when {@link registerCommentRelType} recorded the URI.
 */
export function isRegisteredCommentRelType(relationshipType: string): boolean {
    return commentRelTypes.has(relationshipType);
}
/**
 * Resolves a registered graphic payload detector without throwing from shape walks.
 *
 * @param {string | undefined} uri - The uri value.
 * @param {OoxmlElement} element - The element value.
 * @returns {ShapeType | null} The result.
 */
export function detectGraphicKind(uri: string | undefined, element: OoxmlElement): ShapeType | null {
    for (let i: number = graphicKindDetectors.length - 1; i >= 0; i -= 1) {
        const detector: GraphicKindDetector = arrayAt(graphicKindDetectors, i);
        if (detector !== undefined) {
            const kind: ShapeType = detector.detect(uri, element);
            if (kind !== null) {
                return kind;
            }
        }
    }
    return null;
}
/**
 * Registers an optional feature module with the core registry.
 *
 * @remarks Re-registering the same {@link FeatureModule.id} replaces the previous descriptor and clears its activation flag so a later
 * {@link ensureFeature} can run the new {@link FeatureModule.activate} hook. Registration is synchronous and side-effect free beyond
 * updating the registry map (activation is deferred to {@link ensureFeature}).
 * @example ```ts registerFeature({ id: 'animation', activate: () => { // feature-owned wiring only }, }); ```
 * @public
 * @param {FeatureModule} feature - Module descriptor from a feature package entry point.
 * @returns {void} Nothing.
 */
export function registerFeature(feature: FeatureModule): void {
    if (feature.id.length === 0) {
        throw new Error('Feature id must be a non-empty string.');
    }
    registry.set(feature.id, { module: feature, activated: false });
}
/**
 * Ensures a registered feature has been activated, if present.
 *
 * @remarks Missing features are a deliberate no-op: unsupported markup stays opaque and round-trips without the semantic module. When the
 * feature is registered and has an {@link FeatureModule.activate} hook, the hook runs at most once until the entry is replaced via {@link
 * registerFeature}.
 * @example ```ts await ensureFeature('animation'); ```
 * @public
 * @param {FeatureId} id - Feature domain id.
 * @returns {*} Resolves when activation completes, or immediately when the id is not
 */
export async function ensureFeature(id: FeatureId): Promise<void> {
    const entry: RegistryEntry = registry.get(id);
    if (entry === undefined) {
        return;
    }
    if (entry.activated) {
        return;
    }
    entry.activated = true;
    if (entry.module.activate !== undefined) {
        await entry.module.activate();
    }
}
/**
 * Returns whether a feature id is present in the registry.
 *
 * @public
 * @param {FeatureId} id - Feature domain id.
 * @returns {boolean} `true` when {@link registerFeature} has recorded the id.
 */
export function isFeatureRegistered(id: FeatureId): boolean {
    return registry.has(id);
}
/**
 * Lists registered feature ids in insertion order.
 *
 * @public
 * @returns {*} A new array of ids; empty when no features have registered.
 */
export function listRegisteredFeatures(): ReadonlyArray<FeatureId> {
    return Object.freeze([...registry.keys()]);
}
/**
 * Clears the process-wide registry.
 *
 * @remarks Intended for unit tests that require a deterministic empty registry. Not part of the supported application API surface.
 * @internal
 * @returns {void} Nothing.
 */
export function clearFeatureRegistry(): void {
    registry.clear();
    graphicKindDetectors.length = 0;
    commentRelTypes.clear();
}

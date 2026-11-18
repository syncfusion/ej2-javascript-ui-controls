import { TableGradientPaint, TablePaintPart, resolveTableGradientPaint } from './table-gradient-paint';
import { TableStyleFillSnapshot } from './table-fill-bindings';
import { OutlineEndSource, ResolvedOutlineEnds, resolveOutlineEnds } from '../core/resolve/outline-line-ends';
/** Shared source-to-effective gradient bridge; no XML parsing or source writeback. */
import { GradientHostPartBindings, GradientShapeHostBinding, GradientHostColorMap } from './gradient-host-bindings';
import { GradientHostResult, GradientHostSource, resolveGradientHostSources } from '../core/resolve/gradient-host-sources';
import { OutlineGradientSource, resolveOutlineGradientSources } from '../core/resolve/outline-gradient-sources';
import { GradientThemeStyles } from '../core/theme/gradient-theme-styles';
import { ColorMapping } from '../core/theme/color-mapping';
import { ColorScheme } from '../core/theme/color-scheme';
import { ColorValue } from '../core/theme/color-value';
import { objectSet } from '../core/util/es5-compat';
import { isColorSchemeIndex } from '../core/theme/constants';
import { EffectiveColorContext } from '../core/theme/resolve-color';
import { placeholderMatchKey } from '../core/placeholders/match-key';
import { parsePlaceholderIdx } from '../core/placeholders/match-key';
import { arrayAt } from '../core/util/es5-compat';
import { DEFAULT_PLACEHOLDER_TYPE } from '../core/placeholders/constants';

/** Relationship-selected source roles, not guessed from filenames or producer strings. @internal */
export interface GradientSlidePaintInput {
    readonly tableParts?: ReadonlyArray<TablePaintPart>;
    readonly tableStyles?: ReadonlyArray<TableStyleFillSnapshot>;
    readonly slide: GradientHostPartBindings;
    readonly layout?: GradientHostPartBindings;
    readonly master?: GradientHostPartBindings;
    readonly theme?: GradientHostPartBindings;
    /** Applicable theme overrides, lowest to highest priority. */
    readonly overrides?: ReadonlyArray<GradientHostPartBindings>;
}
/** Versioned clone-safe effective paint, separate from authored part sidecars. @internal */
export interface GradientSlidePaintSnapshot {
    readonly version: 1;
    /** Canonical active symbolic colors/map for shared text painters; absent on older producers. */
    readonly textColors?: { readonly kind: 'unavailable' } | { readonly kind: 'available';
        readonly colors: Readonly<Partial<Record<string, ColorValue>>>;
        readonly colorMap: Readonly<Partial<Record<string, string>>>; };
    /** Optional evaluated table/cell paints; absent on earlier producers. */
    readonly tables?: ReadonlyArray<TableGradientPaint>;
    /** Actual selected roles; absent on earlier version-one producers. */
    readonly parts?: { readonly slide: string; readonly layout?: string; readonly master?: string; };
    readonly background: GradientHostResult;
    readonly hosts: ReadonlyArray<{ readonly partName: string; readonly id: string; readonly result: GradientHostResult;
        readonly outline?: GradientHostResult; readonly outlineEnds?: ResolvedOutlineEnds; }>;
    readonly diagnostics: ReadonlyArray<string>;
}

/**
 * Resolves selected source roles using canonical inheritance and checked colors.
 *
 * @remarks Placeholder matching uses the existing type/index key and index parser.
 * Layout color-map override is not applied to slide-level resolution (existing
 * canonical map contract). Missing/invalid context never fabricates RGB. No cache
 * means edits/theme revisions are observed on every invocation.
 * @param {GradientSlidePaintInput} input - Relationship-selected canonical source parts.
 * @returns {GradientSlidePaintSnapshot} Effective clone-safe host results.
 * @internal
 */
export function resolveGradientSlidePaint(input: GradientSlidePaintInput): GradientSlidePaintSnapshot {
    const diagnostics: string[] = [];
    let theme: GradientHostPartBindings['theme'] = input.theme === undefined ? undefined : input.theme.theme;
    (input.overrides || []).forEach((part: GradientHostPartBindings): void => {
        const next: GradientHostPartBindings['theme'] = part.theme;
        if (next === undefined) { diagnostics.push('unavailable-theme-override'); return; }
        theme = {
            styles: {
                lineStyles: next.styles.lines === undefined && next.styles.lineStyles === undefined && theme !== undefined ?
                    theme.styles.lineStyles : next.styles.lineStyles,
                lineEnds: next.styles.lines === undefined && next.styles.lineEnds === undefined && theme !== undefined ?
                    theme.styles.lineEnds : next.styles.lineEnds,
                lines: next.styles.lines === undefined && theme !== undefined ? theme.styles.lines : next.styles.lines,
                fills: next.styles.fills === undefined && theme !== undefined ? theme.styles.fills : next.styles.fills,
                backgrounds: next.styles.backgrounds === undefined && theme !== undefined ?
                    theme.styles.backgrounds : next.styles.backgrounds
            },
            colors: next.colors === undefined && theme !== undefined ? theme.colors : next.colors
        };
    });
    const styles: GradientThemeStyles | undefined = theme === undefined ? undefined : theme.styles;
    const map: GradientHostColorMap | undefined = input.slide.colorMap && input.slide.colorMap.kind !== 'master-reference' ?
        input.slide.colorMap : input.master === undefined ? undefined : input.master.colorMap;
    const colors: EffectiveColorContext | undefined = colorContext(map, theme);
    if (colors === undefined) { diagnostics.push('unavailable-color-context'); }
    const parts: GradientHostPartBindings[] = [input.slide];
    if (input.layout !== undefined) { parts.push(input.layout); }
    if (input.master !== undefined) { parts.push(input.master); }
    const indexes: Map<string, Map<string, GradientShapeHostBinding>> = new Map();
    const identities: Map<string, Map<string, GradientShapeHostBinding>> = new Map();
    parts.forEach((part: GradientHostPartBindings): void => {
        const ph: Map<string, GradientShapeHostBinding> = new Map();
        const ids: Map<string, GradientShapeHostBinding> = new Map();
        part.hosts.forEach((host: GradientShapeHostBinding): void => {
            if (!host.bindable || host.id === undefined) { diagnostics.push('unbound-host-id'); return; }
            ids.set(host.id, host);
            const key: string | undefined = placeholderKey(host);
            if (key !== undefined && !ph.has(key)) { ph.set(key, host); }
        });
        indexes.set(part.partName, ph); identities.set(part.partName, ids);
    });
    const bgSources: GradientHostSource[] = [];
    parts.forEach((part: GradientHostPartBindings): void => {
        const id: string = part === input.slide ? 'slide' : part === input.layout ? 'layout' : 'master';
        const shade: typeof part.background.shadeToTitle = part.background.shadeToTitle;
        if (shade !== undefined && shade.kind === 'invalid') { diagnostics.push('invalid-background-shade-flag'); }
        bgSources.push({ id, fill: part.background.fill, reference: part.background.reference,
            shadeToTitle: shade === undefined ? undefined : shade.kind === 'value' ? shade.value : false });
    });
    const background: GradientHostResult = resolveGradientHostSources(bgSources, styles, colors, true);
    const hosts: { partName: string; id: string; result: GradientHostResult;
        outline?: GradientHostResult; outlineEnds?: ResolvedOutlineEnds; }[] = [];
    parts.forEach((part: GradientHostPartBindings): void => {
        part.hosts.forEach((host: GradientShapeHostBinding): void => {
            if (!host.bindable || host.id === undefined) { return; }
            let result: GradientHostResult;
            if (host.useBackgroundFill.kind === 'invalid') {
                result = { kind: 'invalid-reference', source: 'direct', reason: 'invalid-background-fill-flag' };
            } else if (host.useBackgroundFill.kind === 'value' && host.useBackgroundFill.value) { result = background; }
            else {
                const sources: GradientHostSource[] = [];
                append(sources, host, 'direct', 'style');
                const key: string | undefined = placeholderKey(host);
                if (key !== undefined) {
                    if (part === input.slide && input.layout !== undefined) {
                        append(sources, lookup(indexes, input.layout.partName, key), 'layout', 'layout-style');
                    }
                    if (part !== input.master && input.master !== undefined) {
                        append(sources, lookup(indexes, input.master.partName, key), 'master', 'master-style');
                    }
                }
                result = resolveGradientHostSources(sources, styles, colors, false);
                if (result.kind === 'other' && result.fillKind === 'group') {
                    if (result.source !== 'direct' && result.source !== 'style') {
                        result = { ...result, reason: 'inherited-group-owner-unresolved' };
                    } else { result = groupResult(host, part, identities, styles, colors, result); }
                } else if (host.elementKind === 'grpSp' && result.kind !== 'missing') {
                    result = { ...result, groupOwner: { id: host.id, chain: [host.id], partName: part.partName } };
                }
            }
            let outline: GradientHostResult | undefined;
            let outlineEnds: ResolvedOutlineEnds | undefined;
            if (host.outline !== undefined) {
                const sources: OutlineGradientSource[] = [];
                const endSources: OutlineEndSource[] = [];
                const addEnds: (value: GradientShapeHostBinding | undefined, id: string) => void =
                    (value: GradientShapeHostBinding | undefined, id: string): void => {
                        if (value !== undefined && value.outline !== undefined) {
                            endSources.push({ id, ends: value.outline.ends, reference: value.outline.reference });
                        }
                    };
                addEnds(host, 'outline-direct');
                appendOutline(sources, host, 'outline-direct');
                const key: string | undefined = placeholderKey(host);
                if (key !== undefined) {
                    if (part === input.slide && input.layout !== undefined) {
                        appendOutline(sources, lookup(indexes, input.layout.partName, key), 'outline-layout');
                        addEnds(lookup(indexes, input.layout.partName, key), 'outline-layout');
                    }
                    if (part !== input.master && input.master !== undefined) {
                        appendOutline(sources, lookup(indexes, input.master.partName, key), 'outline-master');
                        addEnds(lookup(indexes, input.master.partName, key), 'outline-master');
                    }
                }
                if (host.outline.ends !== undefined) {
                    outlineEnds = resolveOutlineEnds(endSources, styles === undefined ? undefined : styles.lineEnds);
                }
                outline = resolveOutlineGradientSources(sources, styles === undefined ? undefined : styles.lines, colors);
            }
            hosts.push({ partName: part.partName, id: host.id, result,
                outline, outlineEnds });
        });
    });
    const textColors: Partial<Record<string, ColorValue>> = {};
    if (colors !== undefined && theme !== undefined && theme.colors !== undefined) {
        theme.colors.forEach((entry: { readonly slot: string; readonly color: ColorValue | undefined; }): void => {
            if (isColorSchemeIndex(entry.slot) && entry.color !== undefined) { objectSet(textColors, entry.slot, entry.color); }
        });
    }
    return { version: 1, textColors: colors === undefined ? { kind: 'unavailable' } :
        { kind: 'available', colors: textColors, colorMap: colors.mapping.toRecord() }, parts: { slide: input.slide.partName,
        layout: input.layout === undefined ? undefined : input.layout.partName,
        master: input.master === undefined ? undefined : input.master.partName },
    background, hosts,
    ...(input.tableParts === undefined || input.tableParts.length === 0 ? {} :
        { tables: resolveTableGradientPaint(input.tableParts, input.tableStyles || [], styles, colors) }),
    diagnostics: Array.from(new Set(diagnostics)) };
}

/** Reuses canonical lexical placeholder index semantics; raw attributes remain in source.
 *
 * @param {GradientShapeHostBinding} host - Direct source carrier.
 * @returns {string | undefined} Existing canonical match key.
 */
function placeholderKey(host: GradientShapeHostBinding): string | undefined {
    const ph: typeof host.placeholder = host.placeholder;
    return ph === undefined ? undefined : placeholderMatchKey(ph.type || DEFAULT_PLACEHOLDER_TYPE, parsePlaceholderIdx(ph.index));
}
/** Indexed part lookup avoids document-wide scans per host.
 *
 * @param {Map<string, Map<string, GradientShapeHostBinding>>} indexes - Part-local indexes.
 * @param {string} part - Owning part name.
 * @param {string} key - Host identity/key.
 * @returns {GradientShapeHostBinding | undefined} Exact binding.
 */
function lookup(indexes: Map<string, Map<string, GradientShapeHostBinding>>,
                part: string, key: string): GradientShapeHostBinding | undefined {
    const index: Map<string, GradientShapeHostBinding> | undefined = indexes.get(part);
    return index === undefined ? undefined : index.get(key);
}
/** Appends direct and style choices in the same order as the live host adapter.
 *
 * @param {GradientHostSource[]} sources - Existing source list.
 * @param {GradientShapeHostBinding} host - Selected actual host.
 * @param {string} direct - Direct source identity.
 * @param {string} style - Reference source identity.
 * @returns {void} Appends source-only inputs.
 */
function append(sources: GradientHostSource[], host: GradientShapeHostBinding | undefined, direct: string, style: string): void {
    if (host === undefined) { return; }
    sources.push({ id: direct, fill: host.fill });
    sources.push({ id: style, fill: { kind: 'missing' }, reference: host.reference });
}
/** Builds only a complete valid color map; missing scheme slots remain checked failures.
 *
 * @param {GradientHostColorMap} map - Selected raw map.
 * @param {*} theme - Selected theme sources.
 * @returns {EffectiveColorContext | undefined} Valid map/scheme context or unavailable.
 */
function colorContext(map: GradientHostColorMap | undefined, theme: GradientHostPartBindings['theme']): EffectiveColorContext | undefined {
    if (map === undefined || map.entries === undefined || theme === undefined || theme.colors === undefined) { return undefined; }
    const entries: Map<string, string> = new Map();
    for (const entry of map.entries) {
        if (entry.value === undefined || !isColorSchemeIndex(entry.value)) { return undefined; }
        entries.set(entry.key, entry.value);
    }
    const slots: Map<string, ColorValue> = new Map();
    theme.colors.forEach((entry: { readonly slot: string; readonly color: ColorValue | undefined; }): void => {
        if (entry.color !== undefined) { slots.set(entry.slot, entry.color); }
    });
    try { return { mapping: new ColorMapping(entries), scheme: new ColorScheme('gradient-paint', slots) }; }
    catch (error) { if (error instanceof RangeError) { return undefined; } throw error; }
}
/** Follows only actual ancestor IDs; inherited placeholder group ownership stays unresolved.
 *
 * @param {GradientShapeHostBinding} host - Recipient source.
 * @param {GradientHostPartBindings} part - Same-part group owners.
 * @param {Map<string, Map<string, GradientShapeHostBinding>>} identities - Unambiguous identity index.
 * @param {GradientThemeStyles} styles - Selected theme matrices.
 * @param {EffectiveColorContext} colors - Checked color context.
 * @param {GradientHostResult} unresolved - Original selected group choice.
 * @returns {GradientHostResult} Actual group result or explicit diagnostic.
 */
function groupResult(host: GradientShapeHostBinding, part: GradientHostPartBindings,
                     identities: Map<string, Map<string, GradientShapeHostBinding>>, styles: GradientThemeStyles | undefined,
                     colors: EffectiveColorContext | undefined, unresolved: GradientHostResult): GradientHostResult {
    const chain: string[] = [];
    for (let i: number = host.ancestors.length - 1; i >= 0; i--) {
        const id: string | undefined = arrayAt(host.ancestors, i);
        const owner: GradientShapeHostBinding | undefined = id === undefined ? undefined : lookup(identities, part.partName, id);
        if (owner === undefined || id === undefined || chain.indexOf(id) >= 0) {
            return { kind: 'invalid-reference', source: 'group', reason: 'invalid-group-ancestry' };
        }
        chain.push(id);
        if (owner.fill.kind === 'group') { continue; }
        const result: GradientHostResult = resolveGradientHostSources([{ id: 'group:' + id, fill: owner.fill }], styles, colors, false);
        return { ...result, groupOwner: { id, partName: part.partName, chain } };
    }
    return unresolved.kind === 'other' ? { ...unresolved, reason: 'missing-group-owner' } : unresolved;
}

/**
 * Appends the independent line source of an exactly matched host.
 *
 * @param {OutlineGradientSource[]} sources - Ordered direct/layout/master tiers.
 * @param {GradientShapeHostBinding | undefined} host - Existing canonical placeholder match.
 * @param {string} id - Source provenance.
 * @returns {void} Adds only available source bindings; never borrows shape fill.
 */
function appendOutline(sources: OutlineGradientSource[], host: GradientShapeHostBinding | undefined, id: string): void {
    if (host === undefined || host.outline === undefined) { return; }
    sources.push({ id, fill: host.outline.fill, reference: host.outline.reference });
}

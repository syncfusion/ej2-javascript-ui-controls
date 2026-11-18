import { OutlineEnds, readOutlineEnds } from '../core/resolve/outline-line-ends';
/** Exact-namespace, clone-safe source inputs for the canonical gradient host resolver. */
import { OoxmlElement, OoxmlText } from '../core/xml/dom';
import { findChild, getAttr } from '../core/shapes/dom-utils';
import { readDrawingFillProperties } from '../core/text/character-fills';
import { GradientThemeStyle, GradientThemeStyles, readGradientThemeStyles } from '../core/theme/gradient-theme-styles';
import { AuthoredFillMatrixReference, readFillMatrixReference } from '../core/theme/read-fill-reference';
import { AuthoredGradientFill } from '../core/theme/gradient-types';
import { getGradientDrawingNamespace } from '../core/theme/read-gradient';
import { GradientLexical, parseGradientBoolean } from '../core/theme/gradient-values';
import { ColorValue } from '../core/theme/color-value';
import { tryParseColorChoiceChild } from '../core/theme/parse-color-choice';
import { COLOR_MAP_KEYS, COLOR_SCHEME_SLOTS } from '../core/theme/constants';
import { SecurityLimits, resolveLimits } from '../core/security/limits';
import { PackageLimitError } from '../core/security/errors';
import { AuthoredLineMatrixReference, readLineMatrixReference } from '../core/theme/read-fill-reference';
import { arrayAt } from '../core/util/es5-compat';

/** Raw attributes remain raw; placeholder defaulting/matching belongs to the adapter. @internal */
export interface GradientHostPlaceholder { readonly type: string | undefined; readonly index: string | undefined; }
/** Selected direct fill/reference context, never resolved paint. @internal */
export interface GradientHostFillBinding {
    readonly fill: GradientThemeStyle;
    readonly reference: AuthoredFillMatrixReference | undefined;
    readonly shadeToTitle?: GradientLexical<boolean>;
}
/** A real shape-tree carrier; ambiguous or absent IDs never become fabricated identities. @internal */
export interface GradientShapeHostBinding extends GradientHostFillBinding {
    readonly id: string | undefined;
    readonly bindable: boolean;
    readonly elementKind: string;
    readonly ancestors: ReadonlyArray<string | undefined>;
    readonly placeholder: GradientHostPlaceholder | undefined;
    /** Absent on older producers; direct outline is independent of shape fill. */
    readonly outline?: { readonly ends?: OutlineEnds; readonly present: boolean; readonly fill: GradientThemeStyle;
        readonly reference: AuthoredLineMatrixReference | undefined; };
    readonly useBackgroundFill: GradientLexical<boolean>;
}
/** Original map choice and sparse attributes; no map defaults are manufactured. @internal */
export interface GradientHostColorMap {
    readonly kind: 'master' | 'override' | 'master-reference' | 'invalid';
    readonly entries?: ReadonlyArray<{ readonly key: string; readonly value: string | undefined; }>;
}
/** Complete part-scoped host inputs, independent of legacy paint projections. @internal */
export interface GradientHostPartBindings {
    readonly partName: string;
    readonly hosts: ReadonlyArray<GradientShapeHostBinding>;
    readonly background: GradientHostFillBinding;
    readonly colorMap: GradientHostColorMap | undefined;
    readonly theme: {
        readonly styles: GradientThemeStyles;
        readonly colors: ReadonlyArray<{ readonly slot: string; readonly color: ColorValue | undefined; }> | undefined;
    } | undefined;
    readonly diagnostics: ReadonlyArray<{ readonly code: string; readonly id?: string; }>;
}

/**
 * Reads host inputs from one already-parsed complete PresentationML/theme part.
 *
 * @remarks Direct exact-namespace children only; MC/foreign branches stay unbound.
 * Group and shape limits reuse the caller's existing security policy. This helper
 * does not select relationships,match placeholders,resolve colors or retain DOM.
 * @param {OoxmlElement} root - Canonical parsed part root.
 * @param {string} partName - Original package identity.
 * @param {Partial<SecurityLimits>} overrides - Existing caller limits.
 * @param {ReadonlyMap<OoxmlElement, AuthoredGradientFill>} gradients - Optional canonical parsed gradient cache.
 * @returns {GradientHostPartBindings | undefined} Clone-safe source bindings or unrelated root.
 * @internal
 */
export function readGradientHostBindings(root: OoxmlElement, partName: string, overrides?: Partial<SecurityLimits>,
                                         gradients?: ReadonlyMap<OoxmlElement, AuthoredGradientFill>
): GradientHostPartBindings | undefined {
    const ns: string = root.namespaceUri;
    const drawing: string | undefined = getGradientDrawingNamespace(ns);
    if (drawing === undefined) { return undefined; }
    const themeRoot: boolean = ns === drawing && (root.localName === 'theme' || root.localName === 'themeOverride');
    const slideRoot: boolean = ns !== drawing && ['sld', 'sldLayout', 'sldMaster'].indexOf(root.localName) >= 0;
    if (!themeRoot && !slideRoot) { return undefined; }
    const limits: SecurityLimits = resolveLimits(overrides);
    const diagnostics: { code: string; id?: string; }[] = [];
    const hosts: GradientShapeHostBinding[] = [];
    const counts: Map<string, number> = new Map();
    const common: OoxmlElement | undefined = slideRoot ? findChild(root, ns, 'cSld') : undefined;
    const tree: OoxmlElement | undefined = common === undefined ? undefined : findChild(common, ns, 'spTree');
    let count: number = 0;
    /**
     * @param {OoxmlElement} element - Exact shape-tree carrier.
     * @param {ReadonlyArray<string | undefined>} ancestors - Actual ancestor IDs,outermost first.
     * @param {number} depth - Group nesting depth; root tree is zero.
     * @returns {void} Appends a source-only host record.
     */
    function visit(element: OoxmlElement, ancestors: ReadonlyArray<string | undefined>, depth: number): void {
        const kind: string = element.localName;
        const nvName: string = kind === 'sp' ? 'nvSpPr' : kind === 'cxnSp' ? 'nvCxnSpPr' : kind === 'pic' ? 'nvPicPr' :
            kind === 'graphicFrame' ? 'nvGraphicFramePr' : kind === 'contentPart' ? 'nvContentPartPr' : 'nvGrpSpPr';
        const nv: OoxmlElement | undefined = findChild(element, ns, nvName);
        const nonVisual: OoxmlElement | undefined = nv === undefined ? undefined : findChild(nv, ns, 'cNvPr');
        const id: string | undefined = nonVisual === undefined ? undefined : getAttr(nonVisual, '', 'id');
        if (id === undefined || id === '') { diagnostics.push({ code: 'missing-host-id' }); }
        else { counts.set(id, (counts.get(id) || 0) + 1); }
        const application: OoxmlElement | undefined = nv === undefined ? undefined : findChild(nv, ns, 'nvPr');
        const placeholder: OoxmlElement | undefined = application === undefined ? undefined : findChild(application, ns, 'ph');
        const properties: OoxmlElement | undefined = findChild(element, ns,
                                                               kind === 'grpSp' || kind === 'spTree' ? 'grpSpPr' : 'spPr');
        const style: OoxmlElement | undefined = findChild(element, ns, 'style');
        const reference: OoxmlElement | undefined = style === undefined ? undefined : findChild(style, drawing, 'fillRef');
        const line: OoxmlElement | undefined = properties === undefined ? undefined : findChild(properties, drawing, 'ln');
        const lineReference: OoxmlElement | undefined = style === undefined ? undefined : findChild(style, drawing, 'lnRef');
        hosts.push({ id, bindable: false, elementKind: kind, ancestors,
            fill: properties === undefined ? { kind: 'missing' } : readDrawingFillProperties(properties, drawing, partName, gradients),
            reference: reference === undefined ? undefined : readFillMatrixReference(reference, partName),
            placeholder: placeholder === undefined ? undefined : { type: getAttr(placeholder, '', 'type'), index: getAttr(placeholder, '', 'idx') },
            ...(['sp', 'cxnSp', 'pic'].indexOf(kind) < 0 ? {} : { outline: {
                ends: readOutlineEnds(line, drawing),
                present: line !== undefined,
                fill: line === undefined ? { kind: 'missing' } : readDrawingFillProperties(line, drawing, partName, gradients),
                reference: lineReference === undefined ? undefined : readLineMatrixReference(lineReference, partName)
            } }),
            useBackgroundFill: parseGradientBoolean(getAttr(element, '', 'useBgFill')) });
        if (kind !== 'grpSp' && kind !== 'spTree') { return; }
        const parentIds: ReadonlyArray<string | undefined> = ancestors.concat([id]);
        for (let i: number = 0; i < element.children.length; i++) {
            const child: OoxmlElement | OoxmlText = arrayAt(element.children, i);
            if (child.kind !== 'element' || child.namespaceUri !== ns ||
                ['sp', 'cxnSp', 'pic', 'grpSp', 'graphicFrame', 'contentPart'].indexOf(child.localName) < 0) { continue; }
            count++;
            if (count > limits.shapesPerSlide) { throw new PackageLimitError('shapesPerSlide', { partName, actual: count }); }
            const childDepth: number = depth + (child.localName === 'grpSp' ? 1 : 0);
            if (childDepth > limits.groupNestingDepth) { throw new PackageLimitError('groupNestingDepth', { partName, actual: childDepth }); }
            visit(child, parentIds, childDepth);
        }
    }
    if (tree !== undefined) { visit(tree, [], 0); }
    counts.forEach((value: number, id: string): void => {
        if (value > 1) { diagnostics.push({ code: 'duplicate-host-id', id }); }
    });
    const bg: OoxmlElement | undefined = common === undefined ? undefined : findChild(common, ns, 'bg');
    const bgPr: OoxmlElement | undefined = bg === undefined ? undefined : findChild(bg, ns, 'bgPr');
    const bgRef: OoxmlElement | undefined = bg === undefined ? undefined : findChild(bg, ns, 'bgRef');
    const direct: GradientThemeStyle = bgPr === undefined ? { kind: 'missing' } : readDrawingFillProperties(bgPr, drawing, partName, gradients);
    const background: GradientHostFillBinding = {
        fill: bgPr !== undefined && direct.kind === 'missing' ? { kind: 'unknown' } : direct,
        reference: bgPr !== undefined || bgRef === undefined ? undefined : readFillMatrixReference(bgRef, partName),
        ...(bgPr === undefined ? {} : { shadeToTitle: parseGradientBoolean(getAttr(bgPr, '', 'shadeToTitle')) })
    };
    let colorMap: GradientHostColorMap | undefined;
    const masterMap: OoxmlElement | undefined = slideRoot && root.localName === 'sldMaster' ? findChild(root, ns, 'clrMap') : undefined;
    const override: OoxmlElement | undefined = slideRoot && root.localName !== 'sldMaster' ? findChild(root, ns, 'clrMapOvr') : undefined;
    const selectedMap: OoxmlElement | undefined = masterMap || (override === undefined ? undefined : findChild(override, drawing, 'overrideClrMapping'));
    if (selectedMap !== undefined) {
        colorMap = { kind: masterMap !== undefined ? 'master' : 'override', entries: COLOR_MAP_KEYS.map(
            (key: string): { readonly key: string; readonly value: string | undefined; } => ({ key, value: getAttr(selectedMap, '', key) })) };
    } else if (override !== undefined) {
        colorMap = { kind: findChild(override, drawing, 'masterClrMapping') === undefined ? 'invalid' : 'master-reference' };
    }
    let theme: GradientHostPartBindings['theme'];
    if (themeRoot) {
        const elements: OoxmlElement | undefined = root.localName === 'themeOverride' ? root : findChild(root, drawing, 'themeElements');
        const format: OoxmlElement | undefined = elements === undefined ? undefined : findChild(elements, drawing, 'fmtScheme');
        const scheme: OoxmlElement | undefined = elements === undefined ? undefined : findChild(elements, drawing, 'clrScheme');
        const colors: { slot: string; color: ColorValue | undefined; }[] = [];
        if (scheme !== undefined) {
            COLOR_SCHEME_SLOTS.forEach((slot: string): void => {
                const owner: OoxmlElement | undefined = findChild(scheme, drawing, slot);
                if (owner !== undefined) { colors.push({ slot, color: tryParseColorChoiceChild(owner, drawing) }); }
            });
        }
        theme = { styles: readGradientThemeStyles(format, partName), colors: scheme === undefined ? undefined : colors };
    }
    return { partName, hosts: hosts.map((host: GradientShapeHostBinding): GradientShapeHostBinding =>
        ({ ...host, bindable: host.id !== undefined && host.id !== '' && counts.get(host.id) === 1 })),
    background, colorMap, theme, diagnostics };
}

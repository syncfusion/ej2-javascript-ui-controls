import { cloneScopedElement } from '../xml/clone-scoped-element';
import { SecurityLimits } from '../security/limits';
import { validateGradientReplacement } from '../shapes/materialize-shape-gradient';
import { GradientStopEditor } from '../shapes/gradient-stop-editor';
/** Background mutation follows local pml.xsd CT_CommonSlideData,
 * CT_Background, EG_Background and CT_BackgroundProperties in both dialects.
 */
import { OoxmlElement, OoxmlText } from '../xml/dom';
import { asMutable, findChild } from '../shapes/dom-utils';
import { GradientFillOptions } from '../shapes/gradient-fill-options';
import { buildGradientFill, buildSolidFill, GradientFillError } from '../shapes/write-gradient-fill';
import { ColorValue } from '../theme/color-value';
import { getGradientDrawingNamespace } from '../theme/read-gradient';
const FILLS: ReadonlyArray<string> = ['noFill', 'solidFill', 'gradFill', 'blipFill', 'pattFill', 'grpFill'];
/**
 * Validates a gradient before replacing the selected host's background.
 *
 * @internal
 * @param {OoxmlElement} root - Explicit slide, layout or master root.
 * @param {GradientFillOptions} options - Complete gradient replacement.
 * @param {string} partName - Owning package part.
 * @returns {boolean} Successful mutation.
 */
export function writeGradientBackground(root: OoxmlElement, options: GradientFillOptions, partName: string): boolean {
    const common: OoxmlElement = backgroundHost(root, partName);
    const ns: string = drawingNamespace(root, partName);
    const fill: OoxmlElement = buildGradientFill(options, ns, partName);
    return commitBackgroundPaint(common, root, fill);
}
/**
 * Commits one prevalidated raw authored gradient without rebuilding its unknown content.
 *
 * @internal
 * @param {OoxmlElement} root - Actual destination slide root.
 * @param {OoxmlElement} fill - Independent scoped source copy.
 * @param {string} partName - Destination part identity.
 * @param {SecurityLimits} limits - Actual destination limits.
 * @returns {boolean} Whether the canonical background paint writer committed.
 */
export function writeCopiedGradientBackground(root: OoxmlElement, fill: OoxmlElement, partName: string,
                                              limits: SecurityLimits): boolean {
    const common: OoxmlElement = backgroundHost(root, partName);
    if (fill.localName !== 'gradFill' || fill.namespaceUri !== drawingNamespace(root, partName)) {
        throw new GradientFillError(partName, 'background.copy.gradient');
    }
    const candidate: OoxmlElement = cloneScopedElement({ root, node: root, partName }, { partName, limits });
    commitBackgroundPaint(backgroundHost(candidate, partName), candidate, fill);
    validateGradientReplacement(root, root, candidate, partName, limits);
    return commitBackgroundPaint(common, root, fill);
}
/**
 * @param {OoxmlElement} root - Exact slide/layout/master source host.
 * @param {ColorValue} color - Validated authored color choice, never resolved paint.
 * @param {string} partName - Owning part for validation diagnostics.
 * @returns {boolean} Successful atomic background paint replacement.
 * @internal
 */
export function writeSolidBackground(root: OoxmlElement, color: ColorValue, partName: string): boolean {
    const common: OoxmlElement = backgroundHost(root, partName);
    return commitBackgroundPaint(common, root, buildSolidFill(color, drawingNamespace(root, partName), partName));
}
/**
 * @param {OoxmlElement} root - Exact slide/layout/master source host.
 * @param {string} partName - Owning part for validation diagnostics.
 * @returns {boolean} Explicit noFill replacement, retaining independent background metadata.
 * @internal
 */
export function writeNoFillBackground(root: OoxmlElement, partName: string): boolean {
    const common: OoxmlElement = backgroundHost(root, partName);
    const fill: OoxmlElement = { kind: 'element', namespaceUri: drawingNamespace(root, partName),
        localName: 'noFill', prefixHint: 'a', attributes: [], children: [] };
    return commitBackgroundPaint(common, root, fill);
}
/**
 * @param {OoxmlElement} common - Validated existing cSld.
 * @param {OoxmlElement} root - Namespace-accurate source host.
 * @param {OoxmlElement} fill - Fully validated detached replacement paint.
 * @returns {boolean} Commits only after constructing the complete exclusive choice.
 */
function commitBackgroundPaint(common: OoxmlElement, root: OoxmlElement, fill: OoxmlElement): boolean {
    const ns: string = fill.namespaceUri;
    const bg: OoxmlElement | undefined = findChild(common, root.namespaceUri, 'bg');
    const old: OoxmlElement | undefined = bg === undefined ? undefined : findChild(bg, root.namespaceUri, 'bgPr');
    const children: Array<OoxmlElement | OoxmlText> = old === undefined ? [] :
        old.children.filter((child: OoxmlElement | OoxmlText): boolean =>
            !(child.kind === 'element' && child.namespaceUri === ns && FILLS.indexOf(child.localName) >= 0));
    // Fill precedes effects and p:extLst; all retained nodes keep their identity.
    children.unshift(fill);
    const properties: OoxmlElement = old === undefined ? element(root, 'bgPr', children) : { ...old, children };
    return commitBackground(common, root, bg, properties);
}
/**
 * Writes an explicit theme reference without resolving the authored color.
 *
 * @internal
 * @param {OoxmlElement} root - Explicit slide, layout or master root.
 * @param {number} index - Unsigned 32-bit matrix reference, including sentinels.
 * @param {ColorValue} color - Required authored reference color choice.
 * @param {string} partName - Owning package part.
 * @returns {boolean} Successful mutation.
 */
export function writeBackgroundReference(root: OoxmlElement, index: number, color: ColorValue, partName: string): boolean {
    const common: OoxmlElement = backgroundHost(root, partName);
    if (typeof index !== 'number' || !Number.isInteger(index) || index < 0 || index > 4294967295) {
        throw new GradientFillError(partName, 'background.reference.index');
    }
    const ns: string = drawingNamespace(root, partName);
    const solid: OoxmlElement = buildSolidFill(color, ns, partName);
    const reference: OoxmlElement = { ...element(root, 'bgRef', solid.children),
        attributes: [{ namespaceUri: '', localName: 'idx', value: String(index) }] };
    const old: OoxmlElement | undefined = findChild(common, root.namespaceUri, 'bg');
    return commitBackground(common, root, old, reference);
}
/**
 * Removes the selected host's direct background and restores inheritance.
 *
 * @internal
 * @param {OoxmlElement} root - Explicit slide, layout or master root.
 * @param {string} partName - Owning package part.
 * @returns {boolean} Whether a direct override was removed.
 */
export function clearBackgroundOverride(root: OoxmlElement, partName: string): boolean {
    const common: OoxmlElement = backgroundHost(root, partName);
    const children: Array<OoxmlElement | OoxmlText> = common.children.filter((child: OoxmlElement | OoxmlText): boolean =>
        !(child.kind === 'element' && child.namespaceUri === root.namespaceUri && child.localName === 'bg'));
    if (children.length === common.children.length) { return false; }
    asMutable(common).children = children;
    return true;
}
/**
 * Prepares the exclusive bgPr/bgRef choice, then commits one children array.
 *
 * @param {OoxmlElement} common - Existing cSld.
 * @param {OoxmlElement} root - Host root for namespace identity.
 * @param {OoxmlElement | undefined} old - Prior background, if present.
 * @param {OoxmlElement} choice - Prevalidated detached choice.
 * @returns {boolean} Successful commit.
 */
function commitBackground(common: OoxmlElement, root: OoxmlElement, old: OoxmlElement | undefined, choice: OoxmlElement): boolean {
    const choices: Array<OoxmlElement | OoxmlText> = old === undefined ? [] :
        old.children.filter((child: OoxmlElement | OoxmlText): boolean =>
            !(child.kind === 'element' && child.namespaceUri === root.namespaceUri && (child.localName === 'bgPr' || child.localName === 'bgRef')));
    choices.unshift(choice);
    const background: OoxmlElement = old === undefined ? element(root, 'bg', choices) : { ...old, children: choices };
    const children: Array<OoxmlElement | OoxmlText> = common.children.filter((child: OoxmlElement | OoxmlText): boolean =>
        !(child.kind === 'element' && child.namespaceUri === root.namespaceUri && child.localName === 'bg'));
    children.unshift(background);
    asMutable(common).children = children;
    return true;
}
/**
 * @param {OoxmlElement} root - Explicit host.
 * @param {string} partName - Diagnostic identity.
 * @returns {OoxmlElement} Required cSld, without repairing malformed hosts.
 */
function backgroundHost(root: OoxmlElement, partName: string): OoxmlElement {
    drawingNamespace(root, partName);
    if (['sld', 'sldLayout', 'sldMaster', 'notes', 'notesMaster', 'handoutMaster'].indexOf(root.localName) < 0) { throw new GradientFillError(partName, 'background.host'); }
    const common: OoxmlElement | undefined = findChild(root, root.namespaceUri, 'cSld');
    if (common === undefined) { throw new GradientFillError(partName, 'background.host.cSld'); }
    return common;
}
/**
 * @param {OoxmlElement} root - PresentationML host.
 * @param {string} partName - Diagnostic identity.
 * @returns {string} Exact DrawingML dialect namespace.
 */
function drawingNamespace(root: OoxmlElement, partName: string): string {
    const ns: string | undefined = getGradientDrawingNamespace(root.namespaceUri);
    if (ns === undefined || root.namespaceUri === ns) { throw new GradientFillError(partName, 'background.host.namespace'); }
    return ns;
}
/**
 * @param {OoxmlElement} root - Namespace/prefix owner.
 * @param {string} name - Exact PresentationML local name.
 * @param {ReadonlyArray<OoxmlElement | OoxmlText>} children - Detached children.
 * @returns {OoxmlElement} Detached PresentationML element.
 */
function element(root: OoxmlElement, name: string, children: ReadonlyArray<OoxmlElement | OoxmlText>): OoxmlElement {
    return { kind: 'element', namespaceUri: root.namespaceUri, prefixHint: root.prefixHint || 'p', localName: name, attributes: [], children };
}

/**
 * Binds a stop editor to the current direct bgPr gradient.
 *
 * @internal
 * @param {Function} locateRoot - Current explicit background host.
 * @param {string} partName - Owning part.
 * @param {Function} onMutate - Existing host callback.
 * @returns {GradientStopEditor} Bound session, invalidated by choice replacement/reset.
 */
export function editBackgroundGradient(locateRoot: () => OoxmlElement, partName: string, onMutate: () => void): GradientStopEditor {
    const root: OoxmlElement = locateRoot();
    backgroundHost(root, partName);
    const ns: string = drawingNamespace(root, partName);
    return new GradientStopEditor((): OoxmlElement | undefined => {
        if (locateRoot() !== root) { return undefined; }
        const common: OoxmlElement = backgroundHost(root, partName);
        const bg: OoxmlElement | undefined = findChild(common, root.namespaceUri, 'bg');
        const properties: OoxmlElement | undefined = bg === undefined ? undefined : findChild(bg, root.namespaceUri, 'bgPr');
        return properties === undefined ? undefined : findChild(properties, ns, 'gradFill');
    }, partName, onMutate);
}

import { arrayAt } from '../../core/util/es5-compat';
import { mergeChartTextBody, ChartCharacterMerge } from './chart-text-body-merge';
/** Keeps nested chart text sources independent of engine-owned data/label flags. */
import { OoxmlAttribute, OoxmlElement, OoxmlText, serializeXml } from '../../core/xml/dom';
import { asMutable, getAttr } from '../../core/shapes/dom-utils';
import { SecurityLimits } from '../../core/security/limits';
import { cloneScopedElement } from '../../core/xml/clone-scoped-element';
import { GradientFillError } from '../../core/shapes/write-gradient-fill';
import { collectChartGradientHosts, ChartGradientHost } from './chart-gradient-sources';
import { insertChartChild } from './chart-gradient-target';
interface TextOwner { readonly key: string; readonly owner: OoxmlElement; }
/**
 * @param {OoxmlElement} source - Actual source root.
 * @param {OoxmlElement} before - Dependency export before its edit.
 * @param {OoxmlElement} after - Dependency export after its edit.
 * @param {ReadonlyArray<number | undefined>} seriesMap - Surviving opaque series mapping.
 * @param {SecurityLimits} limits - Existing package limits.
 * @param {string} partName - Same chart part identity.
 * @param {ChartCharacterMerge} merge - Character-property delta merger.
 * @param {ReadonlySet<string>} forced - Explicit text-color assignments.
 * @param {ReadonlySet<string>} contentReplacements - Explicit whole-text replacement commands.
 * @returns {void} Retains independently unchanged text bodies without restoring old label flags/data.
 * @internal
 */
export function preserveNestedChartText(source: OoxmlElement, before: OoxmlElement, after: OoxmlElement,
                                        seriesMap: ReadonlyArray<number | undefined>, limits: SecurityLimits, partName: string,
                                        merge: ChartCharacterMerge,
                                        forced: ReadonlySet<string> = new Set(),
                                        contentReplacements: ReadonlySet<string> = new Set()): void {
    const previous: Map<string, OoxmlElement> = indexOwners(before, undefined, partName);
    const next: Map<string, OoxmlElement> = indexOwners(after, undefined, partName);
    const originals: Map<string, OoxmlElement> = indexOwners(source, seriesMap, partName);
    originals.forEach((owner: OoxmlElement, key: string): void => {
        const old: OoxmlElement | undefined = previous.get(key); let current: OoxmlElement | undefined = next.get(key);
        if (!current) {
            if (old && (key === 'title' || key === 'legend' || key.indexOf('axis-title:') === 0)) { return; }
            let parent: OoxmlElement | undefined;
            let following: ReadonlyArray<string> = [];
            if (key.indexOf(':label:') >= 0) {
                parent = next.get(key.slice(0, key.indexOf(':label:')) + ':labels');
                if (!parent || labelDeleted(parent, partName)) { return; } // Stable whole dLbls metadata is restored by its existing series owner.
                following = ['delete', 'numFmt', 'spPr', 'txPr', 'dLblPos', 'showLegendKey', 'showVal', 'showCatName',
                    'showSerName', 'showPercent', 'showBubbleSize', 'separator', 'showLeaderLines', 'leaderLines', 'extLst'];
            } else if (key.indexOf('axis-title:') === 0) {
                parent = next.get('axis:' + key.slice('axis-title:'.length));
                following = ['numFmt', 'majorTickMark', 'minorTickMark', 'tickLblPos', 'spPr', 'txPr', 'crossAx', 'extLst'];
            } else if (key.indexOf('series:') === 0) { return; }
            if (!parent) { throw new GradientFillError(partName, 'chart.text.export.owner'); }
            current = cloneScopedElement({ root: source, node: owner, partName }, { partName, limits });
            insertChartChild(parent, current, following); next.set(key, current); return;
        }
        if (labelDeleted(current, partName)) { return; }
        let referenceDefaultsHandled: boolean = false;
        for (const name of ['tx', 'txPr']) {
            if (name === 'txPr' && referenceDefaultsHandled) { continue; }
            const sourceBody: OoxmlElement | undefined = child(owner, name, partName);
            if (!sourceBody) { continue; }
            const baseline: OoxmlElement | undefined = old && child(old, name, partName);
            const replacement: OoxmlElement | undefined = child(current, name, partName);
            const changed: boolean = signature(baseline) !== signature(replacement);
            const force: boolean = forced.has(key);
            let copy: OoxmlElement;
            const referenceDefaults: OoxmlElement | undefined = name === 'tx' ? child(owner, 'txPr', partName) : undefined;
            if (name === 'tx' && child(sourceBody, 'strRef', partName) && replacement && !contentReplacements.has(key)) {
                copy = cloneScopedElement({ root: source, node: sourceBody, partName }, { partName, limits });
                if (changed || force) {
                    let defaults: OoxmlElement | undefined = child(owner, 'txPr', partName);
                    if (!defaults) {
                        const main: string = source.namespaceUri === 'http://purl.oclc.org/ooxml/drawingml/chart' ?
                            'http://purl.oclc.org/ooxml/drawingml/main' : 'http://schemas.openxmlformats.org/drawingml/2006/main';
                        defaults = { kind: 'element', namespaceUri: owner.namespaceUri, localName: 'txPr', attributes: [],
                            children: ['bodyPr', 'lstStyle', 'p'].map((localName: string): OoxmlElement =>
                                ({ kind: 'element', namespaceUri: main, localName, attributes: [], children: [] })) };
                        insertChartChild(owner, defaults, ['extLst']);
                    }
                    const formatted: OoxmlElement = mergeChartTextBody(source, defaults, baseline, replacement,
                                                                       limits, partName, merge, force, true);
                    const priorDefaults: OoxmlElement | undefined = child(current, 'txPr', partName);
                    asMutable(current).children = current.children.filter(
                        (node: OoxmlElement | OoxmlText): boolean => node !== priorDefaults);
                    insertChartChild(current, formatted, ['dLblPos', 'showLegendKey', 'showVal', 'showCatName', 'showSerName',
                        'showPercent', 'showBubbleSize', 'separator', 'extLst']); referenceDefaultsHandled = true;
                }
            } else if (name === 'tx' && child(sourceBody, 'strRef', partName) && replacement &&
                contentReplacements.has(key) && referenceDefaults) {
                const defaults: OoxmlElement = referenceDefaults;
                const formatted: OoxmlElement = mergeChartTextBody(source, defaults, baseline, replacement,
                                                                   limits, partName, merge, force);
                copy = cloneScopedElement({ root: source, node: sourceBody, partName }, { partName, limits });
                const reference: OoxmlElement | undefined = child(copy, 'strRef', partName);
                asMutable(copy).children = copy.children.map((node: OoxmlElement | OoxmlText): OoxmlElement | OoxmlText =>
                    node === reference ? { ...formatted, localName: 'rich' } : node);
            } else if (changed || force) {
                if (!replacement) { continue; }
                copy = mergeChartTextBody(source, sourceBody, baseline, replacement, limits, partName, merge, force);
            } else { copy = cloneScopedElement({ root: source, node: sourceBody, partName }, { partName, limits }); }
            asMutable(current).children = current.children.filter((node: OoxmlElement | OoxmlText): boolean => node !== replacement);
            insertChartChild(current, copy, current.localName === 'chartSpace' ? ['externalData', 'printSettings', 'userShapes', 'extLst'] : name === 'tx' ? ['layout', 'overlay', 'numFmt', 'spPr', 'txPr', 'dLblPos', 'showLegendKey',
                'showVal', 'showCatName', 'showSerName', 'showPercent', 'showBubbleSize', 'separator', 'extLst'] :
                ['dLblPos', 'showLegendKey', 'showVal', 'showCatName', 'showSerName', 'showPercent',
                    'showBubbleSize', 'separator', 'showLeaderLines', 'leaderLines', 'crossAx', 'crosses', 'crossesAt', 'auto',
                    'lblAlgn', 'lblOffset', 'tickLblSkip', 'tickMarkSkip', 'noMultiLvlLbl', 'crossBetween', 'majorUnit', 'minorUnit',
                    'majorTimeUnit', 'minorTimeUnit', 'extLst']);
        }
    });
}
/** @param {OoxmlElement} root - Exact source chart.
 * @param {ReadonlyArray<number | undefined>} seriesMap - Optional original-to-current mapping.
 * @param {string} partName - Diagnostic identity.
 * @returns {Map<string, OoxmlElement>} Known nested text owners; ambiguous identities fail. */
function indexOwners(root: OoxmlElement, seriesMap: ReadonlyArray<number | undefined> | undefined,
                     partName: string): Map<string, OoxmlElement> {
    const rows: TextOwner[] = []; let series: number = 0;
    const ns: string = root.namespaceUri;
    collectChartGradientHosts(root).forEach((host: ChartGradientHost): void => {
        if (['chart-area', 'title', 'legend'].indexOf(host.kind) >= 0) { rows.push({ key: host.kind, owner: host.owner }); }
        if (host.kind === 'series') {
            const original: number = series++; const position: number | undefined = seriesMap ? arrayAt(seriesMap, original) : original;
            if (position === undefined) { return; }
            const labels: OoxmlElement | undefined = child(host.owner, 'dLbls', partName);
            if (!labels) { return; }
            rows.push({ key: 'series:' + position + ':labels', owner: labels });
            for (const node of labels.children) {
                if (node.kind !== 'element' || node.namespaceUri !== ns || node.localName !== 'dLbl') { continue; }
                const idx: OoxmlElement | undefined = child(node, 'idx', partName);
                rows.push({ key: 'series:' + position + ':label:' + identity(idx, partName), owner: node });
            }
        }
        if (host.kind === 'plot-area') {
            for (const node of host.owner.children) {
                if (node.kind !== 'element' || node.namespaceUri !== ns ||
                    ['catAx', 'valAx', 'dateAx', 'serAx'].indexOf(node.localName) < 0) { continue; }
                const id: string = identity(child(node, 'axId', partName), partName);
                rows.push({ key: 'axis:' + id, owner: node });
                const title: OoxmlElement | undefined = child(node, 'title', partName);
                if (title) { rows.push({ key: 'axis-title:' + id, owner: title }); }
            }
        }
    });
    const result: Map<string, OoxmlElement> = new Map();
    for (const row of rows) {
        if (result.has(row.key)) { throw new GradientFillError(partName, 'chart.text.export.ambiguous'); }
        result.set(row.key, row.owner);
    }
    return result;
}
/** @param {OoxmlElement | undefined} node - Authored unsigned identity element.
 * @param {string} partName - Diagnostic identity.
 * @returns {string} Normalized valid uint32 identity. */
function identity(node: OoxmlElement | undefined, partName: string): string {
    const value: string | undefined = node && getAttr(node, '', 'val');
    if (value === undefined || !/^[ \t\r\n]*[+]?[0-9]+[ \t\r\n]*$/.test(value) || Number(value) > 4294967295) {
        throw new GradientFillError(partName, 'chart.text.export.identity');
    }
    return String(Number(value));
}
/** @param {OoxmlElement} owner - Direct chart owner.
 * @param {string} name - Exact chart child.
 * @param {string} partName - Diagnostic source.
 * @returns {OoxmlElement | undefined} Unique optional child. */
function child(owner: OoxmlElement, name: string, partName: string): OoxmlElement | undefined {
    let found: OoxmlElement | undefined;
    for (const node of owner.children) {
        if (node.kind !== 'element' || node.namespaceUri !== owner.namespaceUri || node.localName !== name) { continue; }
        if (found) { throw new GradientFillError(partName, 'chart.text.export.ambiguous'); } found = node;
    }
    return found;
}
/** @param {OoxmlElement | undefined} node - Optional exact body.
 * @returns {string} Serialized same-engine comparison token. */
function signature(node: OoxmlElement | undefined): string { return node ? serializeXml(node) : ''; }

/** @param {OoxmlElement} owner - Output label owner.
 * @param {string} partName - Diagnostic source.
 * @returns {boolean} Honors delete=true; switches a plain false delete choice to the formatting group. */
function labelDeleted(owner: OoxmlElement, partName: string): boolean {
    if (owner.localName !== 'dLbl' && owner.localName !== 'dLbls') { return false; }
    const deletion: OoxmlElement | undefined = child(owner, 'delete', partName);
    if (!deletion) { return false; }
    const value: string | undefined = getAttr(deletion, '', 'val');
    if (value === undefined || value === 'true' || value === '1') { return true; }
    if (value !== 'false' && value !== '0' || deletion.attributes.some((attribute: OoxmlAttribute): boolean =>
        attribute.namespaceUri !== '' || attribute.localName !== 'val') || deletion.children.some(
        (node: OoxmlElement | OoxmlText): boolean => node.kind === 'element' || node.text.trim() !== '')) {
        throw new GradientFillError(partName, 'chart.text.export.delete');
    }
    asMutable(owner).children = owner.children.filter((node: OoxmlElement | OoxmlText): boolean => node !== deletion); return false;
}

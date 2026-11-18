/** Projects only generated classic-chart XML into the authored chart's exact Strict dialect. */
import { OoxmlAttribute, OoxmlElement, OoxmlNamespaceDeclaration, OoxmlText } from '../../core/xml/dom';
import { GradientFillError } from '../../core/shapes/write-gradient-fill';
const ALIASES: ReadonlyMap<string, string> = new Map([
    ['http://schemas.openxmlformats.org/drawingml/2006/chart', 'http://purl.oclc.org/ooxml/drawingml/chart'],
    ['http://schemas.openxmlformats.org/drawingml/2006/main', 'http://purl.oclc.org/ooxml/drawingml/main'],
    ['http://schemas.openxmlformats.org/officeDocument/2006/relationships', 'http://purl.oclc.org/ooxml/officeDocument/relationships']
]);
/**
 * @remarks Source XML is never rewritten. The engine's serializer emits Transitional
 * XML after data edits, even for an originally Strict chart. Only its generated,
 * known chart/main/relationship names may be projected. Foreign/MC content refuses
 * projection because rewriting its inherited namespace context would be unsafe.
 * @param {OoxmlElement} generated - Separately parsed dependency output.
 * @param {string} destination - Actual authored source root namespace.
 * @param {string} partName - Diagnostic part.
 * @returns {OoxmlElement} Same root when compatible, otherwise independently projected generated tree.
 * @internal
 */
export function projectChartExportDialect(generated: OoxmlElement, destination: string, partName: string): OoxmlElement {
    if (generated.namespaceUri === destination) { return generated; }
    if (destination !== 'http://purl.oclc.org/ooxml/drawingml/chart' ||
        generated.namespaceUri !== 'http://schemas.openxmlformats.org/drawingml/2006/chart') {
        throw new GradientFillError(partName, 'chart.export.dialect');
    }
    return project(generated, partName);
}
/** @param {OoxmlElement} node - Known generated element.
 * @param {string} partName - Diagnostic part.
 * @returns {OoxmlElement} Independent exact Strict projection. */
function project(node: OoxmlElement, partName: string): OoxmlElement {
    const ns: string | undefined = ALIASES.get(node.namespaceUri);
    if (!ns || node.namespaceUri.indexOf('/relationships') >= 0) { throw new GradientFillError(partName, 'chart.export.dialect.foreign'); }
    return { ...node, namespaceUri: ns,
        attributes: node.attributes.map((attribute: OoxmlAttribute): OoxmlAttribute => {
            if (attribute.namespaceUri === '') { return { ...attribute, value: percentage(node, attribute, partName) }; }
            if (attribute.namespaceUri === 'http://www.w3.org/XML/1998/namespace') { return { ...attribute }; }
            const uri: string | undefined = ALIASES.get(attribute.namespaceUri);
            if (!uri) { throw new GradientFillError(partName, 'chart.export.dialect.foreign'); }
            return { ...attribute, namespaceUri: uri };
        }),
        ...(node.namespaceDeclarations === undefined ? {} : { namespaceDeclarations:
            node.namespaceDeclarations.map((declaration: OoxmlNamespaceDeclaration): OoxmlNamespaceDeclaration =>
                ({ ...declaration, uri: ALIASES.get(declaration.uri) || declaration.uri })) }),
        children: node.children.map((child: OoxmlElement | OoxmlText): OoxmlElement | OoxmlText =>
            child.kind === 'text' ? { ...child } : project(child, partName)) };
}

/** @param {OoxmlElement} owner - Generated Transitional owner.
 * @param {OoxmlAttribute} attribute - Exact unqualified schema attribute.
 * @param {string} partName - Diagnostic part.
 * @returns {string} Strict percentage lexical form for explicitly enumerated schema types. */
function percentage(owner: OoxmlElement, attribute: OoxmlAttribute, partName: string): string {
    const name: string = owner.localName; const attr: string = attribute.localName;
    const chart: boolean = owner.namespaceUri === 'http://schemas.openxmlformats.org/drawingml/2006/chart';
    const chartPercent: boolean = chart && attr === 'val' && ['hPercent', 'depthPercent', 'thickness', 'gapWidth', 'gapDepth',
        'overlap', 'bubbleScale', 'holeSize', 'secondPieSize', 'lblOffset'].indexOf(name) >= 0;
    const mainPercent: boolean = !chart && (
        attr === 'val' && ['tint', 'shade', 'alpha', 'alphaOff', 'alphaMod', 'hueMod', 'sat', 'satOff', 'satMod',
            'lum', 'lumOff', 'lumMod', 'red', 'redOff', 'redMod', 'green', 'greenOff', 'greenMod', 'blue', 'blueOff', 'blueMod',
            'spcPct'].indexOf(name) >= 0 ||
        name === 'gs' && attr === 'pos' ||
        ['fillToRect', 'tileRect', 'srcRect', 'fillRect'].indexOf(name) >= 0 && ['l', 't', 'r', 'b'].indexOf(attr) >= 0 ||
        ['outerShdw', 'reflection', 'tile'].indexOf(name) >= 0 && ['sx', 'sy'].indexOf(attr) >= 0 ||
        name === 'reflection' && ['stA', 'stPos', 'endA', 'endPos'].indexOf(attr) >= 0 ||
        name === 'lum' && ['bright', 'contrast'].indexOf(attr) >= 0 ||
        ['biLevel', 'alphaBiLevel'].indexOf(name) >= 0 && attr === 'thresh' ||
        name === 'alphaRepl' && attr === 'a' || name === 'alphaModFix' && attr === 'amt' ||
        name === 'tint' && attr === 'amt' ||
        name === 'normAutofit' && ['fontScale', 'lnSpcReduction'].indexOf(attr) >= 0 ||
        ['rPr', 'defRPr', 'endParaRPr'].indexOf(name) >= 0 && attr === 'baseline');
    if (!chartPercent && !mainPercent) { return attribute.value; }
    if (attribute.value.endsWith('%')) {
        const pieces: string[] = attribute.value.slice(0, -1).replace(/^[+-]/, '').split('.');
        if (pieces.length <= 2 && pieces.every((piece: string): boolean => /^[0-9]+$/.test(piece))) { return attribute.value; }
        throw new GradientFillError(partName, 'chart.export.dialect.percentage');
    }
    if (!/^[ \t\r\n]*[+-]?[0-9]+[ \t\r\n]*$/.test(attribute.value) || !Number.isSafeInteger(Number(attribute.value))) {
        throw new GradientFillError(partName, 'chart.export.dialect.percentage');
    }
    return String(Number(attribute.value) / (chartPercent ? 1 : 1000)) + '%';
}

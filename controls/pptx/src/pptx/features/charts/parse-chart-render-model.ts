/**
 * Parses a classic `c:chartSpace` part into a {@link ChartRenderModel}.
 *
 * @remarks
 * Read-only and DOM-free. Reads the chart part's own caches (`c:numCache` / `c:strCache`); never opens the
 * embedded workbook. Unknown markup is ignored here - the authoritative bytes stay on
 * {@link ChartInstance.originalXml}. Colours are returned as authored {@link ColorValue} + transforms and are
 * never flattened to RGB.
 *
 * Citations: ECMA-376 Part 1 §21.2 (DrawingML Charts), dml-chart.xsd.
 */
import { DML_NS } from '../../core/shapes/constants';
import { findChild, getAttr } from '../../core/shapes/dom-utils';
import { tryParseColorChoiceChild } from '../../core/theme/parse-color-choice';
import { OoxmlElement, OoxmlText, parseXml } from '../../core/xml/dom';
import {
    ChartAxisModel, ChartColor, ChartColorTransform, ChartDataLabelsModel, ChartErrorBarsModel, ChartFill, ChartLegendModel,
    ChartLine, ChartMarkerModel, ChartPlotKind, ChartPlotModel, ChartPointFormat, ChartRenderModel, ChartSeriesModel,
    ChartShapeFormat, ChartTextStyle, ChartTitleModel, ChartTrendlineModel
} from './chart-render-model';
/** DrawingML chart namespace (`c:`). */
const C_NS: string = 'http://schemas.openxmlformats.org/drawingml/2006/chart';
const EMU_PER_POINT: number = 12700;
const PLOT_TAGS: { [tag: string]: { kind: ChartPlotKind; is3D: boolean } } = {
    barChart: { kind: 'bar', is3D: false }, bar3DChart: { kind: 'bar', is3D: true },
    lineChart: { kind: 'line', is3D: false }, line3DChart: { kind: 'line', is3D: true },
    areaChart: { kind: 'area', is3D: false }, area3DChart: { kind: 'area', is3D: true },
    pieChart: { kind: 'pie', is3D: false }, pie3DChart: { kind: 'pie', is3D: true },
    doughnutChart: { kind: 'doughnut', is3D: false }, ofPieChart: { kind: 'ofPie', is3D: false },
    scatterChart: { kind: 'scatter', is3D: false }, bubbleChart: { kind: 'bubble', is3D: false },
    radarChart: { kind: 'radar', is3D: false }, stockChart: { kind: 'stock', is3D: false },
    surfaceChart: { kind: 'surface', is3D: false }, surface3DChart: { kind: 'surface', is3D: true }
};
const AXIS_TAGS: string[] = ['catAx', 'dateAx', 'valAx', 'serAx'];
/**
 * @param {OoxmlElement} parent - Parent element.
 * @param {string} ns - Namespace URI.
 * @param {string} name - Local name.
 * @returns {OoxmlElement[]} Direct element children with that name.
 */
function childrenNamed(parent: OoxmlElement | undefined, ns: string, name: string): OoxmlElement[] {
    const out: OoxmlElement[] = [];
    if (parent === undefined) {
        return out;
    }
    for (let i: number = 0; i < parent.children.length; i++) {
        const child: OoxmlElement | OoxmlText = parent.children[i as number];
        if (child.kind === 'element' && child.namespaceUri === ns && child.localName === name) {
            out.push(child);
        }
    }
    return out;
}
/**
 * @param {OoxmlElement} parent - Parent element.
 * @param {string} name - `c:` local name.
 * @returns {OoxmlElement | undefined} First direct `c:` child.
 */
function c(parent: OoxmlElement | undefined, name: string): OoxmlElement | undefined {
    return parent === undefined ? undefined : findChild(parent, C_NS, name);
}
/**
 * @param {OoxmlElement} parent - Parent element.
 * @param {string} name - `a:` local name.
 * @returns {OoxmlElement | undefined} First direct `a:` child.
 */
function a(parent: OoxmlElement | undefined, name: string): OoxmlElement | undefined {
    return parent === undefined ? undefined : findChild(parent, DML_NS, name);
}
/**
 * @param {OoxmlElement} el - Element.
 * @returns {string | undefined} The unprefixed `val` attribute.
 */
function val(el: OoxmlElement | undefined): string | undefined {
    return el === undefined ? undefined : getAttr(el, '', 'val');
}
/**
 * @param {OoxmlElement} el - Element.
 * @returns {number | undefined} Finite numeric `val`, or `undefined`.
 */
function numVal(el: OoxmlElement | undefined): number | undefined {
    const raw: string = val(el);
    if (raw === undefined || raw === '') {
        return undefined;
    }
    const n: number = Number(raw);
    return isFinite(n) ? n : undefined;
}
/**
 * OOXML booleans default to true when the element is present without `val`.
 *
 * @param {OoxmlElement} el - Element (may be absent).
 * @param {boolean} absent - Result when the element is absent.
 * @returns {boolean} Boolean value.
 */
function boolVal(el: OoxmlElement | undefined, absent: boolean): boolean {
    if (el === undefined) {
        return absent;
    }
    const raw: string = val(el);
    return raw === undefined ? true : (raw === '1' || raw === 'true');
}
/**
 * @param {OoxmlElement} el - Element.
 * @returns {string} Concatenated descendant text.
 */
function textOf(el: OoxmlElement): string {
    let out: string = '';
    for (let i: number = 0; i < el.children.length; i++) {
        const child: OoxmlElement | OoxmlText = el.children[i as number];
        out += child.kind === 'text' ? child.text : textOf(child);
    }
    return out;
}
/**
 * @param {OoxmlElement} parent - Element that owns one colour-choice child.
 * @returns {ChartColor | undefined} Authored colour with transforms.
 */
function readColor(parent: OoxmlElement | undefined): ChartColor | undefined {
    if (parent === undefined) {
        return undefined;
    }
    const color: ChartColor['color'] = tryParseColorChoiceChild(parent);
    if (color === undefined) {
        return undefined;
    }
    const transforms: ChartColorTransform[] = [];
    for (let i: number = 0; i < parent.children.length; i++) {
        const child: OoxmlElement | OoxmlText = parent.children[i as number];
        if (child.kind !== 'element' || child.namespaceUri !== DML_NS ||
            ['srgbClr', 'scrgbClr', 'hslClr', 'sysClr', 'schemeClr', 'prstClr'].indexOf(child.localName) < 0) {
            continue;
        }
        for (let j: number = 0; j < child.children.length; j++) {
            const t: OoxmlElement | OoxmlText = child.children[j as number];
            if (t.kind === 'element') {
                transforms.push({ kind: t.localName, value: numVal(t) });
            }
        }
        break;
    }
    return { color, transforms };
}
/**
 * @param {OoxmlElement} holder - `c:spPr` / `a:ln`'s parent / `a:ln` itself.
 * @returns {ChartFill | undefined} Fill authored directly under `holder`.
 */
function readFill(holder: OoxmlElement | undefined): ChartFill | undefined {
    if (holder === undefined) {
        return undefined;
    }
    if (a(holder, 'noFill') !== undefined) {
        return { kind: 'none' };
    }
    const solid: OoxmlElement = a(holder, 'solidFill');
    if (solid !== undefined) {
        const color: ChartColor = readColor(solid);
        return color === undefined ? undefined : { kind: 'solid', color };
    }
    const grad: OoxmlElement = a(holder, 'gradFill');
    if (grad !== undefined) {
        // Approximate with the first stop; the model reports it via `kind: 'gradient'`.
        const stops: OoxmlElement = a(grad, 'gsLst');
        const first: OoxmlElement = stops === undefined ? undefined : childrenNamed(stops, DML_NS, 'gs')[0];
        const color: ChartColor = readColor(first);
        if (color === undefined) {
            return { kind: 'unsupported', detail: 'gradFill' };
        }
        const stopList: Array<{ position: number; color: ChartColor }> = [];
        const gs: OoxmlElement[] = stops === undefined ? [] : childrenNamed(stops, DML_NS, 'gs');
        for (let i: number = 0; i < gs.length; i++) {
            const pos: string = getAttr(gs[i as number], '', 'pos');
            const stopColor: ChartColor = readColor(gs[i as number]);
            if (pos !== undefined && stopColor !== undefined && isFinite(Number(pos))) {
                stopList.push({ position: Number(pos) / 1000, color: stopColor });
            }
        }
        const lin: OoxmlElement = a(grad, 'lin');
        const ang: string = lin === undefined ? undefined : getAttr(lin, '', 'ang');
        const path: OoxmlElement = a(grad, 'path');
        const pathType: string = path === undefined ? undefined : getAttr(path, '', 'path');
        return {
            kind: 'gradient', color,
            ...(stopList.length > 1 ? { stops: stopList } : {}),
            ...(ang !== undefined && isFinite(Number(ang)) ? { angleDeg: Number(ang) / 60000 } : {}),
            ...(pathType !== undefined ? { path: pathType } : {})
        };
    }
    const patt: OoxmlElement = a(holder, 'pattFill');
    if (patt !== undefined) {
        const preset: string = getAttr(patt, '', 'prst');
        if (preset === undefined) {
            return { kind: 'unsupported', detail: 'pattFill' };
        }
        const foreground: ChartColor = readColor(a(patt, 'fgClr'));
        const background: ChartColor = readColor(a(patt, 'bgClr'));
        return {
            kind: 'pattern', preset,
            ...(foreground !== undefined ? { foreground } : {}),
            ...(background !== undefined ? { background } : {})
        };
    }
    if (a(holder, 'blipFill') !== undefined) {
        return { kind: 'unsupported', detail: 'blipFill' };
    }
    return undefined;
}
/**
 * @param {OoxmlElement} ln - `a:ln` element.
 * @returns {ChartLine | undefined} Outline.
 */
function readLine(ln: OoxmlElement | undefined): ChartLine | undefined {
    if (ln === undefined) {
        return undefined;
    }
    const w: string = getAttr(ln, '', 'w');
    const wn: number = w === undefined ? NaN : Number(w);
    return {
        fill: readFill(ln) || { kind: 'none' },
        widthPt: isFinite(wn) ? wn / EMU_PER_POINT : undefined,
        dash: val(a(ln, 'prstDash'))
    };
}
/**
 * @param {OoxmlElement} spPr - `c:spPr` element.
 * @returns {ChartShapeFormat} Fill + outline (members undefined when not authored).
 */
function readShapeFormat(spPr: OoxmlElement | undefined): ChartShapeFormat {
    if (spPr === undefined) {
        return {};
    }
    const fill: ChartFill = readFill(spPr);
    const line: ChartLine = readLine(a(spPr, 'ln'));
    return { ...(fill !== undefined ? { fill } : {}), ...(line !== undefined ? { line } : {}) };
}
/**
 * @param {OoxmlElement} rPr - `a:defRPr` / `a:rPr` / `a:endParaRPr`.
 * @returns {ChartTextStyle} Text style.
 */
function readRunProps(rPr: OoxmlElement | undefined): ChartTextStyle {
    if (rPr === undefined) {
        return {};
    }
    const sz: string = getAttr(rPr, '', 'sz');
    const b: string = getAttr(rPr, '', 'b');
    const i: string = getAttr(rPr, '', 'i');
    const latin: OoxmlElement = a(rPr, 'latin');
    const color: ChartColor = readColor(a(rPr, 'solidFill'));
    const size: number = sz === undefined ? NaN : Number(sz) / 100;
    const cap: string = getAttr(rPr, '', 'cap');
    return {
        ...(cap === 'all' || cap === 'small' || cap === 'none' ? { caps: cap } : {}),
        ...(isFinite(size) ? { sizePt: size } : {}),
        ...(b !== undefined ? { bold: b === '1' || b === 'true' } : {}),
        ...(i !== undefined ? { italic: i === '1' || i === 'true' } : {}),
        ...(latin !== undefined && getAttr(latin, '', 'typeface') ? { fontFamily: getAttr(latin, '', 'typeface') } : {}),
        ...(color !== undefined ? { color } : {})
    };
}
/**
 * @param {OoxmlElement} txPr - `c:txPr` element.
 * @returns {ChartTextStyle} Default text style of the first paragraph.
 */
function readTxPr(txPr: OoxmlElement | undefined): ChartTextStyle {
    const p: OoxmlElement = a(txPr, 'p');
    const style: ChartTextStyle = readRunProps(a(a(p, 'pPr'), 'defRPr'));
    const bodyPr: OoxmlElement = a(txPr, 'bodyPr');
    const rot: string = bodyPr === undefined ? undefined : getAttr(bodyPr, '', 'rot');
    const degrees: number = rot === undefined ? NaN : Number(rot) / 60000;
    // ST_Angle values outside -90..90 degrees (PowerPoint writes rot="-60000000") mean "automatic", not a real rotation.
    return isFinite(degrees) && degrees >= -90 && degrees <= 90 ? { ...style, rotationDeg: degrees } : style;
}
/**
 * @param {OoxmlElement} title - `c:title` element.
 * @returns {ChartTitleModel | undefined} Title text/style; `undefined` when no static text.
 */
function readTitle(title: OoxmlElement | undefined): ChartTitleModel | undefined {
    if (title === undefined) {
        return undefined;
    }
    const richEl: OoxmlElement = c(c(title, 'tx'), 'rich');
    const lines: string[] = [];
    let style: ChartTextStyle = {};
    if (richEl !== undefined) {
        const paragraphs: OoxmlElement[] = childrenNamed(richEl, DML_NS, 'p');
        for (let i: number = 0; i < paragraphs.length; i++) {
            const runs: OoxmlElement[] = childrenNamed(paragraphs[i as number], DML_NS, 'r');
            let line: string = '';
            for (let j: number = 0; j < runs.length; j++) {
                const t: OoxmlElement = a(runs[j as number], 't');
                line += t === undefined ? '' : textOf(t);
                if (j === 0 && i === 0) {
                    style = readRunProps(a(runs[0], 'rPr'));
                }
            }
            lines.push(line);
            if (i === 0 && Object.keys(style).length === 0) {
                style = readRunProps(a(a(paragraphs[0], 'pPr'), 'defRPr'));
            }
        }
    } else {
        const strRef: OoxmlElement = c(c(title, 'tx'), 'strRef');
        const cache: string[] = readStringCache(c(strRef, 'strCache'));
        if (cache.length > 0) {
            lines.push(cache[0]);
        }
        style = readTxPr(c(title, 'txPr'));
    }
    const text: string = lines.join('\n');
    return text.length === 0 ? undefined : { text, style, overlay: boolVal(c(title, 'overlay'), false) };
}
/**
 * @param {OoxmlElement} title - `c:title` element.
 * @returns {ChartTitleModel | undefined} Automatic title marker when `c:title` has no `c:tx`.
 */
function readAutoTitle(title: OoxmlElement | undefined): ChartTitleModel | undefined {
    if (title === undefined || c(title, 'tx') !== undefined) {
        return undefined;
    }
    return { text: '', style: readTxPr(c(title, 'txPr')), overlay: boolVal(c(title, 'overlay'), false), auto: true };
}
/**
 * @param {OoxmlElement} cache - `c:strCache` / `c:numCache` element.
 * @param {boolean} numeric - Parse values as numbers.
 * @returns {Array} Dense point array indexed by `c:pt/@idx`, length `c:ptCount`.
 */
function readCache(cache: OoxmlElement | undefined): Array<string | null> {
    const out: Array<string | null> = [];
    if (cache === undefined) {
        return out;
    }
    const count: number = numVal(c(cache, 'ptCount')) || 0;
    for (let i: number = 0; i < count && i < 1000000; i++) {
        out.push(null);
    }
    const pts: OoxmlElement[] = childrenNamed(cache, C_NS, 'pt');
    for (let i: number = 0; i < pts.length; i++) {
        const idx: number = Number(getAttr(pts[i as number], '', 'idx'));
        const v: OoxmlElement = c(pts[i as number], 'v');
        if (isFinite(idx) && idx >= 0 && idx < 1000000 && v !== undefined) {
            while (out.length <= idx) {
                out.push(null);
            }
            out[idx as number] = textOf(v);
        }
    }
    return out;
}
/**
 * @param {OoxmlElement} cache - `c:strCache`.
 * @returns {string[]} Cached strings (blank points become empty strings).
 */
function readStringCache(cache: OoxmlElement | undefined): string[] {
    return readCache(cache).map((v: string | null): string => v === null ? '' : v);
}
/**
 * @param {OoxmlElement} cache - `c:numCache`.
 * @returns {Array} Cached numbers; blank/non-numeric points are `null`.
 */
function readNumberCache(cache: OoxmlElement | undefined): Array<number | null> {
    return readCache(cache).map((v: string | null): number | null => {
        if (v === null || v === '') {
            return null;
        }
        const n: number = Number(v);
        return isFinite(n) ? n : null;
    });
}
/**
 * Reads `c:cat` / `c:val` style data holders (`numRef`, `strRef`, `numLit`, `strLit`, `multiLvlStrRef`).
 *
 * @param {OoxmlElement} holder - Data holder.
 * @returns {Object} Strings or numbers, plus the numeric cache format code.
 */
function readDataHolder(holder: OoxmlElement | undefined): { strings: string[]; numbers: Array<number | null>; isNumeric: boolean; formatCode?: string } {
    const empty: { strings: string[]; numbers: Array<number | null>; isNumeric: boolean } = {
        strings: [], numbers: [], isNumeric: false
    };
    if (holder === undefined) {
        return empty;
    }
    const numCache: OoxmlElement = c(c(holder, 'numRef'), 'numCache') || c(holder, 'numLit');
    if (numCache !== undefined) {
        const numbers: Array<number | null> = readNumberCache(numCache);
        const fmt: OoxmlElement = c(numCache, 'formatCode');
        return {
            strings: readCache(numCache).map((v: string | null): string => v === null ? '' : v),
            numbers, isNumeric: true, formatCode: fmt === undefined ? undefined : textOf(fmt)
        };
    }
    const strCache: OoxmlElement = c(c(holder, 'strRef'), 'strCache') || c(holder, 'strLit');
    if (strCache !== undefined) {
        return { ...empty, strings: readStringCache(strCache) };
    }
    const multi: OoxmlElement = c(c(holder, 'multiLvlStrRef'), 'multiLvlStrCache');
    if (multi !== undefined) {
        // Innermost (first) level carries the leaf labels.
        const lvl: OoxmlElement = c(multi, 'lvl');
        return { ...empty, strings: readStringCache(lvl) };
    }
    return empty;
}
/**
 * @param {OoxmlElement} dLbls - `c:dLbls`.
 * @returns {ChartDataLabelsModel | undefined} Data labels when any content is shown.
 */
function readDataLabels(dLbls: OoxmlElement | undefined): ChartDataLabelsModel | undefined {
    if (dLbls === undefined || boolVal(c(dLbls, 'delete'), false)) {
        return undefined;
    }
    const fmt: OoxmlElement = c(dLbls, 'numFmt');
    const model: ChartDataLabelsModel = {
        showValue: boolVal(c(dLbls, 'showVal'), false),
        showCategoryName: boolVal(c(dLbls, 'showCatName'), false),
        showSeriesName: boolVal(c(dLbls, 'showSerName'), false),
        showPercent: boolVal(c(dLbls, 'showPercent'), false),
        showBubbleSize: boolVal(c(dLbls, 'showBubbleSize'), false),
        position: val(c(dLbls, 'dLblPos')),
        numberFormat: fmt === undefined ? undefined : getAttr(fmt, '', 'formatCode'),
        style: readTxPr(c(dLbls, 'txPr')),
        ...(c(dLbls, 'separator') !== undefined ? { separator: textOf(c(dLbls, 'separator')) } : {}),
        ...(c(dLbls, 'spPr') !== undefined ? { format: readShapeFormat(c(dLbls, 'spPr')) } : {})
    };
    const any: boolean = model.showValue || model.showCategoryName || model.showSeriesName ||
        model.showPercent || model.showBubbleSize;
    return any ? model : undefined;
}
/**
 * @param {OoxmlElement} marker - `c:marker`.
 * @returns {ChartMarkerModel | undefined} Marker.
 */
function readMarker(marker: OoxmlElement | undefined): ChartMarkerModel | undefined {
    if (marker === undefined || c(marker, 'symbol') === undefined) {
        return undefined;
    }
    return { symbol: val(c(marker, 'symbol')) || 'auto', size: numVal(c(marker, 'size')), format: readShapeFormat(c(marker, 'spPr')) };
}
/**
 * @param {OoxmlElement} ser - `c:ser`.
 * @returns {ChartTrendlineModel[]} Trendlines.
 */
function readTrendlines(ser: OoxmlElement): ChartTrendlineModel[] {
    return childrenNamed(ser, C_NS, 'trendline').map((t: OoxmlElement): ChartTrendlineModel => {
        const nm: OoxmlElement = c(t, 'name');
        return {
            type: val(c(t, 'trendlineType')) || 'linear',
            name: nm === undefined ? undefined : textOf(nm),
            order: numVal(c(t, 'order')), period: numVal(c(t, 'period')),
            forward: numVal(c(t, 'forward')), backward: numVal(c(t, 'backward')),
            intercept: numVal(c(t, 'intercept')),
            line: readLine(a(c(t, 'spPr'), 'ln'))
        };
    });
}
/**
 * @param {OoxmlElement} ser - `c:ser`.
 * @returns {ChartErrorBarsModel[]} Error bars.
 */
function readErrorBars(ser: OoxmlElement): ChartErrorBarsModel[] {
    return childrenNamed(ser, C_NS, 'errBars').map((e: OoxmlElement): ChartErrorBarsModel => ({
        direction: val(c(e, 'errBarType')) || 'both',
        valueType: val(c(e, 'errValType')) || 'fixedVal',
        value: numVal(c(e, 'val')),
        noEndCap: boolVal(c(e, 'noEndCap'), false),
        axis: val(c(e, 'errDir'))
    }));
}
/**
 * @param {OoxmlElement} ser - `c:ser`.
 * @param {ChartPlotKind} kind - Owning plot family.
 * @returns {ChartSeriesModel} Series model.
 */
function readSeries(ser: OoxmlElement, kind: ChartPlotKind): ChartSeriesModel {
    const scatter: boolean = kind === 'scatter' || kind === 'bubble';
    const tx: OoxmlElement = c(ser, 'tx');
    const nameStrings: string[] = tx === undefined ? [] : readStringCache(c(c(tx, 'strRef'), 'strCache'));
    const literal: OoxmlElement = c(tx, 'v');
    const name: string = literal !== undefined ? textOf(literal) : nameStrings.length > 0 ? nameStrings[0] : undefined;
    const cat: ReturnType<typeof readDataHolder> = readDataHolder(c(ser, scatter ? 'xVal' : 'cat'));
    const val_: ReturnType<typeof readDataHolder> = readDataHolder(c(ser, scatter ? 'yVal' : 'val'));
    const bubble: ReturnType<typeof readDataHolder> = readDataHolder(c(ser, 'bubbleSize'));
    const points: ChartPointFormat[] = childrenNamed(ser, C_NS, 'dPt').map((p: OoxmlElement): ChartPointFormat => ({
        index: numVal(c(p, 'idx')) || 0, format: readShapeFormat(c(p, 'spPr')), explosion: numVal(c(p, 'explosion'))
    }));
    return {
        index: numVal(c(ser, 'idx')) || 0,
        order: numVal(c(ser, 'order')) || 0,
        name,
        categories: scatter ? [] : cat.strings,
        categoryNumbers: scatter ? [] : (cat.isNumeric ? cat.numbers : []),
        values: val_.numbers,
        xValues: scatter ? cat.numbers : [],
        bubbleSizes: bubble.numbers,
        formatCode: val_.formatCode,
        format: readShapeFormat(c(ser, 'spPr')),
        marker: readMarker(c(ser, 'marker')),
        dataLabels: readDataLabels(c(ser, 'dLbls')),
        points,
        trendlines: readTrendlines(ser),
        errorBars: readErrorBars(ser),
        smooth: boolVal(c(ser, 'smooth'), false),
        explosion: numVal(c(ser, 'explosion'))
    };
}
/**
 * @param {OoxmlElement} plotEl - Plot element.
 * @param {string} tag - Plot local name.
 * @returns {ChartPlotModel} Plot.
 */
function readPlot(plotEl: OoxmlElement, tag: string): ChartPlotModel {
    const info: { kind: ChartPlotKind; is3D: boolean } = PLOT_TAGS[tag as string];
    const series: ChartSeriesModel[] = childrenNamed(plotEl, C_NS, 'ser').map(
        (s: OoxmlElement): ChartSeriesModel => readSeries(s, info.kind));
    series.sort((l: ChartSeriesModel, r: ChartSeriesModel): number => l.order - r.order);
    const plotDlbls: ChartDataLabelsModel = readDataLabels(c(plotEl, 'dLbls'));
    if (plotDlbls !== undefined) {
        for (let i: number = 0; i < series.length; i++) {
            if (series[i as number].dataLabels === undefined) {
                series[i as number] = { ...series[i as number], dataLabels: plotDlbls };
            }
        }
    }
    return {
        kind: info.kind, is3D: info.is3D,
        barDirection: val(c(plotEl, 'barDir')) || 'col',
        grouping: val(c(plotEl, 'grouping')) || (info.kind === 'bar' ? 'clustered' : 'standard'),
        varyColors: boolVal(c(plotEl, 'varyColors'), info.kind === 'pie' || info.kind === 'doughnut'),
        gapWidth: numVal(c(plotEl, 'gapWidth')), overlap: numVal(c(plotEl, 'overlap')),
        holeSize: numVal(c(plotEl, 'holeSize')), firstSliceAngle: numVal(c(plotEl, 'firstSliceAng')),
        scatterStyle: val(c(plotEl, 'scatterStyle')), radarStyle: val(c(plotEl, 'radarStyle')),
        markers: boolVal(c(plotEl, 'marker'), false),
        axisIds: childrenNamed(plotEl, C_NS, 'axId').map((e: OoxmlElement): string => val(e) || ''),
        series
    };
}
/**
 * @param {OoxmlElement} axisEl - Axis element.
 * @returns {ChartAxisModel} Axis.
 */
function readAxis(axisEl: OoxmlElement): ChartAxisModel {
    const scaling: OoxmlElement = c(axisEl, 'scaling');
    const fmt: OoxmlElement = c(axisEl, 'numFmt');
    const grid: OoxmlElement = c(axisEl, 'majorGridlines');
    return {
        id: val(c(axisEl, 'axId')) || '',
        kind: axisEl.localName,
        deleted: boolVal(c(axisEl, 'delete'), false),
        position: val(c(axisEl, 'axPos')),
        min: numVal(c(scaling, 'min')), max: numVal(c(scaling, 'max')), logBase: numVal(c(scaling, 'logBase')),
        reversed: val(c(scaling, 'orientation')) === 'maxMin',
        majorUnit: numVal(c(axisEl, 'majorUnit')), minorUnit: numVal(c(axisEl, 'minorUnit')),
        majorGridlines: grid !== undefined,
        majorGridlineFormat: readLine(a(c(grid, 'spPr'), 'ln')),
        minorGridlines: c(axisEl, 'minorGridlines') !== undefined,
        title: readTitle(c(axisEl, 'title')),
        numberFormat: fmt === undefined ? undefined : getAttr(fmt, '', 'formatCode'),
        numberFormatSourceLinked: fmt !== undefined && getAttr(fmt, '', 'sourceLinked') === '1',
        majorTickMark: val(c(axisEl, 'majorTickMark')) || 'cross',
        minorTickMark: val(c(axisEl, 'minorTickMark')) || 'cross',
        tickLabelPosition: val(c(axisEl, 'tickLblPos')) || 'nextTo',
        line: readLine(a(c(axisEl, 'spPr'), 'ln')),
        labelStyle: readTxPr(c(axisEl, 'txPr'))
    };
}
/**
 * @param {OoxmlElement} legend - `c:legend`.
 * @returns {ChartLegendModel | undefined} Legend.
 */
function readLegend(legend: OoxmlElement | undefined): ChartLegendModel | undefined {
    if (legend === undefined) {
        return undefined;
    }
    return { position: val(c(legend, 'legendPos')) || 'r', style: readTxPr(c(legend, 'txPr')), overlay: boolVal(c(legend, 'overlay'), false) };
}
/**
 * Parses chart part XML into a render model.
 *
 * @public
 * @param {string} xml - UTF-8 decoded `c:chartSpace` part.
 * @returns {ChartRenderModel | undefined} Model, or `undefined` when `xml` is not a chartSpace.
 */
export function parseChartRenderModel(xml: string): ChartRenderModel | undefined {
    const root: OoxmlElement = parseXml(xml);
    if (root.namespaceUri !== C_NS || root.localName !== 'chartSpace') {
        return undefined;
    }
    const chart: OoxmlElement = c(root, 'chart');
    const plotArea: OoxmlElement = c(chart, 'plotArea');
    const plots: ChartPlotModel[] = [];
    const unsupported: string[] = [];
    const axes: ChartAxisModel[] = [];
    if (plotArea !== undefined) {
        for (let i: number = 0; i < plotArea.children.length; i++) {
            const child: OoxmlElement | OoxmlText = plotArea.children[i as number];
            if (child.kind !== 'element' || child.namespaceUri !== C_NS) {
                continue;
            }
            if (PLOT_TAGS[child.localName as string] !== undefined) {
                plots.push(readPlot(child, child.localName));
            } else if (AXIS_TAGS.indexOf(child.localName) >= 0) {
                axes.push(readAxis(child));
            } else if (child.localName === 'dTable') {
                unsupported.push('dataTable');
            }
        }
    }
    const first: ChartPlotModel = plots[0];
    const axisFor = (id: string): ChartAxisModel | undefined => axes.filter((x: ChartAxisModel): boolean => x.id === id)[0];
    const categoryAxis: ChartAxisModel = first === undefined ? undefined : axisFor(first.axisIds[0]);
    const valueAxis: ChartAxisModel = first === undefined ? undefined : axisFor(first.axisIds[1]);
    for (let i: number = 0; i < plots.length; i++) {
        const p: ChartPlotModel = plots[i as number];
        if (p.is3D) { unsupported.push('3D:' + p.kind); }
        if (p.kind === 'stock' || p.kind === 'surface' || p.kind === 'ofPie') { unsupported.push('plot:' + p.kind); }
    }
    const style: number = numVal(c(root, 'style'));
    return {
        title: readTitle(c(chart, 'title')) || readAutoTitle(c(chart, 'title')),
        legend: readLegend(c(chart, 'legend')),
        plots, categoryAxis, valueAxis, axes,
        chartArea: readShapeFormat(c(root, 'spPr')),
        plotArea: readShapeFormat(c(plotArea, 'spPr')),
        textStyle: readTxPr(c(root, 'txPr')),
        styleId: style,
        unsupported
    };
}

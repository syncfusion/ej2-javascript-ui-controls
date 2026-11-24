/**
 * Chart feature registration.
 *
 * Registers:
 * 1. appendChart() method on Paragraph.prototype
 * 2. Chart parsing handler (stub for Phase 2)
 * 3. Chart serialization handler (stub for Phase 2)
 *
 * No async loader required - static Workbook import is used internally.
 *
 * @private
 */

import { featureId, registerFeature } from '../../core/registry/index';
import { Paragraph, setAppendChartFactory } from '../document/paragraph';
import { appendChartImpl } from './paragraph-append-chart';
import { ChartType } from '@syncfusion/ej2-xlsx';
import { Chart } from './chart';
import { ChartPackagePart } from './chart-package';
import { registerFeatureMaterializeHandler, visitParagraphsInDocumentOrder } from '../../core/registry/index';
import { maxDocPrIdInDocument } from '../drawing/parse-register';
import { officeDocumentPartName, OpcPackage } from '../../core/opc/package';
import { partName, PartName } from '../../core/opc/part-name';
import { registerFeaturePackagePartHandler } from '../../core/registry/package-part-handlers';
import { registerFeatureRunLeafHandler } from '../../core/registry/run-leaf-handlers';
import { FeatureRunParagraphItem, ParagraphItem, TextRange, Tab, CarriageReturn, Break, FeatureInlineParagraphItem, OpaqueRunItem, OpaqueParagraphItem } from '../document/text-range';
import { ChartRunLeaf, loadChart, parseChartDrawing } from './chart-load';
import { WordDocument } from '../document/document';
import { FeatureId } from '../../core/registry/feature-registry';
import { Field, FieldMark } from '../fields/paragraph-field';

const CHARTS: FeatureId = featureId('charts');

let registered: boolean = false;

/**
 * Registers the chart feature with the document model.
 *
 * @returns {void} Nothing is returned.
 * @remarks
 * Binds {@link Paragraph.appendChart} to the {@link Paragraph} class.
 * Charts work without calling this method; call it to make the registration explicit. Calling it more than once has no effect.
 *
 * @example
 * ```typescript
 * registerChartsFeature();
 * const doc = WordDocument.create();
 * const paragraph = doc.sections[0].body.appendParagraph();
 * const chart = paragraph.appendChart(ChartType.ColumnClustered, 500, 300);
 * ```
 *
 * @private
 */
export function registerChartsFeature(): void {
    if (registered) {
        return;
    }
    registered = true;

    // Register with feature registry
    registerFeature({ id: CHARTS });

    registerFeatureRunLeafHandler({
        featureId: CHARTS,
        wmlLocalName: 'drawing',
        tryParse: parseChartDrawing
    }, { prepend: true });
    registerFeaturePackagePartHandler({
        featureId: CHARTS,
        loadParts(): ChartPackagePart & { afterMainDocumentLoad(document: WordDocument): void } {
            const part: ChartPackagePart = new ChartPackagePart([], partName('/word/document.xml'), 1);
            return Object.assign(part, { afterMainDocumentLoad: hydrateLoadedCharts });
        }
    });
    registerFeatureMaterializeHandler({
        featureId: CHARTS,
        materialize(document: WordDocument): void {
            const charts: Chart[] = [];
            visitParagraphsInDocumentOrder(document, (paragraph: Paragraph) => {
                paragraph.items.forEach((item: ParagraphItem) => {
                    if (item instanceof Chart) {
                        charts.push(item);
                    }
                });
            });
            const live: Set<number> = new Set<number>();
            charts.forEach((c: Chart) => { if (c.packageIndex !== undefined) { live.add(c.packageIndex); } });
            const removed: number[] = [];
            const loaded: Set<number> = loadedChartIndexes.get(document);
            if (loaded !== undefined) {
                loaded.forEach((n: number) => { if (!live.has(n)) { removed.push(n); } });
            }
            document.setFeaturePart(
                CHARTS,
                new ChartPackagePart(
                    charts,
                    officeDocumentPartName(document.opcPackage()),
                    Math.max(maxDocPrIdInDocument(document), ...charts.map((c: Chart) => c.docPrId)) + 1,
                    removed
                )
            );
        }
    });

    // Bind appendChart() to Paragraph.prototype
    bindAppendChartMethod();
}

/**
 * Replace preserved chart drawings with live charts after a document is opened.
 * A chart whose parts cannot be read keeps its preserved drawing.
 *
 * @private
 */
const loadedChartIndexes: WeakMap<WordDocument, Set<number>> = new WeakMap();

function hydrateLoadedCharts(document: WordDocument): void {
    const loaded: Set<number> = new Set<number>();
    loadedChartIndexes.set(document, loaded);
    const pkg: OpcPackage = document.opcPackage();
    const main: PartName = officeDocumentPartName(pkg);
    visitParagraphsInDocumentOrder(document, (paragraph: Paragraph) => {
        const items: ParagraphItem[] = paragraph.items.toArray();
        let changed: boolean = false;
        const next: ParagraphItem[] = items.map((item: ParagraphItem) => {
            if (item instanceof FeatureRunParagraphItem && item.featureId === CHARTS && item.value instanceof ChartRunLeaf) {
                let chart: Chart | undefined;
                try {
                    chart = loadChart(item.value, pkg, main);
                } catch (e) {
                    chart = undefined;
                }
                if (chart !== undefined) {
                    changed = true;
                    if (chart.packageIndex !== undefined) {
                        loaded.add(chart.packageIndex);
                    }
                    return chart;
                }
            }
            return item;
        });
        if (changed) {
            paragraph.hydrateItems(next);
        }
    });
}

/**
 * Bind appendChart() method to Paragraph.prototype.
 *
 * @returns {void} Nothing is returned.
 * @private
 */
function bindAppendChartMethod(): void {
    setAppendChartFactory(appendChartImpl);
    Object.defineProperty(Paragraph.prototype, 'appendChart', {
        value(
            this: Paragraph,
            chartType: ChartType,
            width: number,
            height: number
        ): Chart {
            return appendChartImpl(this, chartType, width, height);
        },
        writable: true,
        configurable: true,
        enumerable: false
    });
}

/**
 * Reset charts feature (test cleanup).
 *
 * @returns {void} Nothing is returned.
 * @private
 */
export function resetChartsFeatureForTests(): void {
    registered = false;
}

registerChartsFeature();

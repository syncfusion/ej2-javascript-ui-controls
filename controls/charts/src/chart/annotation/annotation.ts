import { Chart } from '../../chart/chart';
import { ChartAnnotationSettings } from './../model/chart-base';
import { AnnotationBase } from '../../common/annotation/annotation';
import { appendElement, redrawElement } from '../../common/utils/helper';
import { createElement } from '@syncfusion/ej2-base';
import { ChartAnnotationSettingsModel } from '../index';
/**
 * The `ChartAnnotation` module handles annotations for the chart.
 */
export class ChartAnnotation extends AnnotationBase {

    private chart: Chart;
    private annotations: ChartAnnotationSettingsModel[];
    private parentElement: HTMLElement;

    /**
     * Constructor for chart annotation.
     *
     * @private
     * @param {Chart} control - The chart control instance.
     * @param {ChartAnnotationSettings[]} annotations - The array of annotation settings.
     */
    constructor(control: Chart, annotations: ChartAnnotationSettings[]) {
        super(control);
        this.chart = control;
        this.annotations = annotations;
    }

    /**
     * Method to render the annotation for chart
     *
     * @param {Element} element - annotation element.
     * @returns {void}
     * @private
     */
    public renderAnnotations(element: Element): void {
        this.annotations = this.chart.annotations;
        this.parentElement = <HTMLElement>redrawElement(this.chart.redraw, this.chart.element.id + '_Annotation_Collections') ||
            createElement('div', {
                id: this.chart.element.id + '_Annotation_Collections'
            });
        this.annotations.map((annotation: ChartAnnotationSettings, index: number) => {
            this.processAnnotation(annotation, index, this.parentElement);
        });
        for (let index: number = 0; this.chart.getModuleName() === 'chart' && !this.chart.enableCanvas && index < this.chart.visibleSeries.length; index++) {
            if (this.chart.visibleSeries[index as number].animation.enable && this.chart.animateSeries) {
                this.parentElement.style.visibility = 'hidden';
                break;
            }
        }
        appendElement(this.parentElement, element, this.chart.redraw);
    }

    /**
     * To destroy the annotation.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        // Destroy method performed here
    }

    /**
     * Get module name.
     *
     * @returns {string} - Returns the module name.
     */
    protected getModuleName(): string {
        // Returns te module name
        return 'Annotation';
    }
}

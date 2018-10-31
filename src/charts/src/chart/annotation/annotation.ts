import { Chart } from '../../chart/chart';
import { ChartAnnotationSettings } from './../model/chart-base';
import { AnnotationBase } from '../../common/annotation/annotation';
import { appendElement, redrawElement } from '../../common/utils/helper';
import { createElement } from '@syncfusion/ej2-base';
import { ChartAnnotationSettingsModel } from '../index';
/**
 * `ChartAnnotation` module handles the annotation for chart.
 */
export class ChartAnnotation extends AnnotationBase {

    private chart: Chart;
    private annotations: ChartAnnotationSettingsModel[];
    private parentElement: HTMLElement;

    /**
     * Constructor for chart annotation.
     * @private.
     */
    constructor(control: Chart, annotations: ChartAnnotationSettings[]) {
        super(control);
        this.chart = control;
        this.annotations = annotations;
    }

    /**
     * Method to render the annotation for chart
     * @param element
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
        appendElement(this.parentElement, element, this.chart.redraw);
    }

    /**
     * To destroy the annotation. 
     * @return {void}
     * @private
     */
    public destroy(control: Chart): void {
        // Destroy method performed here
    }

    /**
     * Get module name.
     */
    protected getModuleName(): string {
        // Returns te module name
        return 'Annotation';
    }
}
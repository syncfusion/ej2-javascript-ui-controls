/** 
 * AccumulationChart annotation properties
 */

import { AccumulationChart } from '../../accumulation-chart/accumulation';
import { AccumulationAnnotationSettings } from '../model/acc-base';
import { AnnotationBase } from '../../common/annotation/annotation';
import { appendElement, redrawElement } from '../../common/utils/helper';
import { createElement } from '@syncfusion/ej2-base';
import { AccumulationAnnotationSettingsModel } from '../index';


/**
 * `AccumulationAnnotation` module handles the annotation for accumulation chart.
 */
export class AccumulationAnnotation extends AnnotationBase {

    private pie: AccumulationChart;
    private parentElement: HTMLElement;
    private annotations: AccumulationAnnotationSettingsModel[];

    /**
     * Constructor for accumulation chart annotation.
     * @private.
     */
     constructor(control: AccumulationChart) {
        super(control);
        this.pie = control;
    }


    /**
     * Method to render the annotation for accumulation chart
     * @param element 
     */
    public renderAnnotations(element: Element): void {
        this.annotations = this.pie.annotations;
        let redraw: boolean = this.pie.redraw;
        this.parentElement = (redrawElement(redraw, this.pie.element.id + '_Annotation_Collections') ||
            createElement('div', {
                id: this.pie.element.id + '_Annotation_Collections'
            })) as HTMLElement;
        this.annotations.map((annotation: AccumulationAnnotationSettings, index: number) => {
            this.processAnnotation(annotation, index, this.parentElement);
        });
        appendElement(this.parentElement, element, redraw);
    }

    /**
     * Get module name.
     */
    protected getModuleName(): string {
        // Returns te module name
        return 'Annotation';
    }
    /**
     * To destroy the annotation. 
     * @return {void}
     * @private
     */
    public destroy(control: AccumulationChart): void {
        // Destroy method performed here
    }
}
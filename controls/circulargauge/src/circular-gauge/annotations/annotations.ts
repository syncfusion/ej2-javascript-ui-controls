import { CircularGauge } from '../circular-gauge';
import { Axis, Annotation } from '../axes/axis';
import { stringToNumber, GaugeLocation, getLocationFromAngle, getFontStyle } from '../utils/helper';
import { getElement, getTemplateFunction, measureElementRect } from '../utils/helper';
import { IAnnotationRenderEventArgs } from '../model/interface';
import { annotationRender } from '../model/constants';
import { createElement, updateBlazorTemplate, resetBlazorTemplate } from '@syncfusion/ej2-base';

/**
 * Annotation Module handles the Annotation of the axis.
 */

export class Annotations {
    private gauge: CircularGauge;
    private elementId: string;
    /**
     * Constructor for Annotation module.
     * @private.
     */
    constructor(gauge: CircularGauge) {
        this.gauge = gauge;
        this.elementId = gauge.element.id;
    }

    /**
     * Method to render the annotation for circular gauge.
     */
    //tslint:disable
    public renderAnnotation(axis: Axis, index: number): void {
        let width: number = this.gauge.availableSize.width;
        let element: HTMLElement = createElement('div', {
            id: this.elementId + '_Annotations_' + index
        });
        let parentElement: Element = getElement(this.elementId + '_Secondary_Element');
        document.getElementById(this.elementId + '_Secondary_Element').style.width = width + 'px';
        axis.annotations.map((annotation: Annotation, annotationIndex: number) => {
            if (annotation.content !== null) {
                this.createTemplate(element, annotationIndex, index);
            }
        });
        if (parentElement && element.childElementCount) {
            parentElement.appendChild(element);
            updateBlazorTemplate(element.id + '_ContentTemplate', 'ContentTemplate');
        }
    }

    /**
     * Method to create annotation template for circular gauge.
     */
    public createTemplate(element: HTMLElement, annotationIndex: number, axisIndex: number): void {
        let axis: Axis = <Axis>this.gauge.axes[axisIndex];
        let annotation: Annotation = <Annotation>axis.annotations[annotationIndex];
        let childElement: HTMLElement = createElement('div', {
            id: this.elementId + '_Axis_' + axisIndex + '_Annotation_' + annotationIndex,
            styles: 'position: absolute; z-index:' + annotation.zIndex + ';transform:' +
                (annotation.autoAngle ? 'rotate(' + (annotation.angle - 90) + 'deg)' : 'rotate(0deg)') + ';'
        });
        let argsData: IAnnotationRenderEventArgs = {
            cancel: false, name: annotationRender, content: annotation.content,
            axis: axis, annotation: annotation, textStyle: annotation.textStyle
        };
        this.gauge.trigger('annotationRender', argsData, (observedArgs: IAnnotationRenderEventArgs) => {
            let templateFn: Function;
            let templateElement: HTMLCollection;
            let blazor: string = 'Blazor';
            if (!argsData.cancel) {
                templateFn = getTemplateFunction(argsData.content);                
                if (templateFn && (!window[blazor] ? templateFn(axis, null, null, element.id + '_ContentTemplate').length : {})) {
                    templateElement = Array.prototype.slice.call(templateFn(!window[blazor] ? axis : {}, null, null, element.id + '_ContentTemplate'));
                    let length: number = templateElement.length;
                    for (let i: number = 0; i < length; i++) {
                        childElement.appendChild(templateElement[i]);
                    }
                } else {
                    childElement.appendChild(createElement('div', {
                        innerHTML: argsData.content,
                        styles: getFontStyle(argsData.textStyle)
                    }));
                }
                this.updateLocation(childElement, axis, <Annotation>annotation);
                element.appendChild(childElement);
                } else {
                    resetBlazorTemplate(element.id + '_ContentTemplate', '_ContentTemplate');
                }
        });
    }

    /**
     * Method to update the annotation location for circular gauge.
     */
    private updateLocation(element: HTMLElement, axis: Axis, annotation: Annotation): void {
        let location: GaugeLocation = getLocationFromAngle(
            annotation.angle - 90,
            stringToNumber(annotation.radius, axis.currentRadius),
            this.gauge.midPoint
        );
        let elementRect: ClientRect = measureElementRect(element);
        element.style.left = (location.x - (elementRect.width / 2)) + 'px';
        element.style.top = (location.y - (elementRect.height / 2)) + 'px';
        element.setAttribute('aria-label', annotation.description || 'Annotation');
    }

    /**
     * Get module name.
     */
    protected getModuleName(): string {
        // Returns te module name
        return 'Annotations';
    }
    /**
     * To destroy the annotation.
     * @return {void}
     * @private
     */
    public destroy(gauge: CircularGauge): void {
        // Destroy method performed here
    }
}
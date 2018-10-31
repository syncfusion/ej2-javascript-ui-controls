import { CircularGauge } from '../circular-gauge';
import { Axis, Annotation } from '../axes/axis';
import { stringToNumber, GaugeLocation, getLocationFromAngle, getFontStyle } from '../utils/helper';
import { getElement, getTemplateFunction, measureElementRect } from '../utils/helper';
import { IAnnotationRenderEventArgs } from '../model/interface';
import { annotationRender } from '../model/constants';
import { createElement } from '@syncfusion/ej2-base';

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
    public renderAnnotation(axis: Axis, index: number): void {
        let element: HTMLElement = createElement('div', {
            id: this.elementId + '_Annotations_' + index
        });
        let parentElement: Element = getElement(this.elementId + '_Secondary_Element');
        axis.annotations.map((annotation: Annotation, annotationIndex: number) => {
            if (annotation.content !== null) {
                this.createTemplate(element, annotationIndex, index);
            }
        });
        if (parentElement && element.childElementCount) {
            parentElement.appendChild(element);
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
        this.gauge.trigger(annotationRender, argsData);
        let templateFn: Function;
        let templateElement: HTMLCollection;
        if (!argsData.cancel) {
            templateFn = getTemplateFunction(argsData.content);
            if (templateFn && templateFn(axis).length) {
                templateElement = templateFn(axis);
                while (templateElement.length > 0) {
                    childElement.appendChild(templateElement[0]);
                }
            } else {
                childElement.appendChild(createElement('div', {
                    innerHTML: argsData.content,
                    styles: getFontStyle(argsData.textStyle)
                }));
            }
            this.updateLocation(childElement, axis, <Annotation>annotation);
            element.appendChild(childElement);
        }
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
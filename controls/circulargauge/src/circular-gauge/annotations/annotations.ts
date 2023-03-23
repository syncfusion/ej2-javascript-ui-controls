import { CircularGauge } from '../circular-gauge';
import { Axis, Annotation } from '../axes/axis';
import { getTemplateFunction, getElement, stringToNumber, getFontStyle, getLocationFromAngle, GaugeLocation, removeElement } from '../utils/helper-common';
import { IAnnotationRenderEventArgs } from '../model/interface';
import { annotationRender } from '../model/constants';
import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';

/**
 * Annotation Module handles the Annotation of the axis.
 * 
 * @hidden
 */

export class Annotations {
    /**
     * Constructor for Annotation module.
     *
     * @param {CircularGauge} gauge - Specifies the instance of the gauge.
     * @private.
     */

    // eslint-disable-next-line
    constructor(gauge: CircularGauge) {
    }

    /**
     * Method to render the annotation for circular gauge.
     * 
     * @private
     */

    public renderAnnotation(axis: Axis, index: number, gauge: CircularGauge): void {
        const width: number = gauge.availableSize.width;
        const element: HTMLElement = createElement('div', {
            id: gauge.element.id + '_Annotations_' + index
        });
        const parentElement: Element = getElement(gauge.element.id + '_Secondary_Element');
        if (!isNullOrUndefined(document.getElementById(gauge.element.id + '_Secondary_Element'))) {
            document.getElementById(gauge.element.id + '_Secondary_Element').style.width = width + 'px';
        }
        axis.annotations.map((annotation: Annotation, annotationIndex: number) => {
            if (annotation.content !== null) {
                this.createTemplate(element, annotationIndex, index, gauge);
            }
        });
        if (parentElement && element.childElementCount) {
            parentElement.appendChild(element);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (gauge as any).renderReactTemplates();
    }

    /**
     * Method to create annotation template for circular gauge.
     * 
     * @private
     */

    public createTemplate(element: HTMLElement, annotationIndex: number, axisIndex: number, gauge: CircularGauge): void {
        const axis: Axis = <Axis>gauge.axes[axisIndex as number];
        const annotation: Annotation = <Annotation>axis.annotations[annotationIndex as number];
        const childElement: HTMLElement = createElement('div', {
            id: gauge.element.id + '_Axis_' + axisIndex + '_Annotation_' + annotationIndex
        });
        childElement.style.cssText = 'position: absolute; z-index:' + annotation.zIndex + ';transform:' +
                                        (annotation.autoAngle ? 'rotate(' + (annotation.angle - 90) + 'deg)' : 'rotate(0deg)') + ';';
        const argsData: IAnnotationRenderEventArgs = {
            cancel: false, name: annotationRender, content: annotation.content,
            axis: axis, annotation: annotation, textStyle: annotation.textStyle
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        gauge.trigger('annotationRender', argsData, (observedArgs: IAnnotationRenderEventArgs) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let templateFn: any;
            let templateElement: HTMLCollection;
            if (!argsData.cancel) {
                templateFn = getTemplateFunction(argsData.content, gauge);
                if (templateFn && templateFn(axis, gauge, argsData.content, gauge.element.id + '_Axis' + axisIndex + '_ContentTemplate' + annotationIndex).length) {
                    templateElement = Array.prototype.slice.call(templateFn(axis, gauge, argsData.content, gauge.element.id + '_Axis' + axisIndex + '_ContentTemplate' + annotationIndex));
                    const length: number = templateElement.length;
                    for (let i: number = 0; i < length; i++) {
                        childElement.appendChild(templateElement[i as number]);
                    }
                } else {
                    const annotationElement: HTMLElement = createElement('div', {
                        innerHTML: argsData.content,
                        id: 'StringTemplate'
                    }) as HTMLElement;
                    annotationElement.style.cssText = getFontStyle(argsData.textStyle);
                    childElement.appendChild(annotationElement);
                }
                this.updateLocation(childElement, axis, <Annotation>annotation, gauge);
                element.appendChild(childElement);
            }
        });
    }

    /**
     * Method to update the annotation location for circular gauge.
     *
     * @param {HTMLElement} element - Specifies the element.
     * @param {Axis} axis - Specifies the axis.
     * @param {Annotation} annotation - Specifies the annotation.
     * @returns {void}
     */

    private updateLocation(element: HTMLElement, axis: Axis, annotation: Annotation, gauge: CircularGauge): void {
        const location: GaugeLocation = getLocationFromAngle(
            annotation.angle - 90,
            stringToNumber(annotation.radius, axis.currentRadius),
            gauge.midPoint
        );
        const elementRect: ClientRect = this.measureElementRect(element);
        element.style.left = (location.x - (elementRect.width / 2)) + 'px';
        element.style.top = (location.y - (elementRect.height / 2)) + 'px';
        element.setAttribute('aria-label', annotation.description || 'Annotation');
    }

    /**
     * Get module name.
     *
     * @returns {string} - Returns the module name
     */
    protected getModuleName(): string {
        // Returns te module name
        return 'Annotations';
    }
    /**
     * To destroy the annotation.
     *
     * @returns {void}
     * @private
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public destroy(): void { }

    /**
     * Function to measure the element rect.
     *
     * @param {HTMLElement} element - Specifies the html element.
     * @returns {ClientRect} - Returns the client rect.
     * @private
     */

    private measureElementRect(element: HTMLElement): ClientRect {
        document.body.appendChild(element);
        const bounds: ClientRect = element.getBoundingClientRect();
        removeElement(element.id);
        return bounds;
    }
}

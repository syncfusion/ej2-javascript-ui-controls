/* eslint-disable max-len */
import { CircularGauge } from '../circular-gauge';
import { Axis, Annotation } from '../axes/axis';
import { stringToNumber, GaugeLocation, getLocationFromAngle, getFontStyle } from '../utils/helper';
import { getElement, getTemplateFunction, measureElementRect } from '../utils/helper';
import { IAnnotationRenderEventArgs } from '../model/interface';
import { annotationRender } from '../model/constants';
import { createElement, updateBlazorTemplate, isNullOrUndefined } from '@syncfusion/ej2-base';

/**
 * Annotation Module handles the Annotation of the axis.
 */

export class Annotations {
    private gauge: CircularGauge;
    private elementId: string;
    /**
     * Constructor for Annotation module.
     *
     * @param {CircularGauge} gauge - Specifies the instance of the gauge.
     * @private.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    constructor(gauge: CircularGauge) {
        this.gauge = gauge;
        this.elementId = gauge.element.id;
    }

    // eslint-disable-next-line valid-jsdoc
    /**
     * Method to render the annotation for circular gauge.
     */
    public renderAnnotation(axis: Axis, index: number): void {
        const width: number = this.gauge.availableSize.width;
        const element: HTMLElement = createElement('div', {
            id: this.elementId + '_Annotations_' + index
        });
        const parentElement: Element = getElement(this.elementId + '_Secondary_Element');
        if (!isNullOrUndefined(document.getElementById(this.elementId + '_Secondary_Element'))) {
            document.getElementById(this.elementId + '_Secondary_Element').style.width = width + 'px';
        }
        axis.annotations.map((annotation: Annotation, annotationIndex: number) => {
            if (annotation.content !== null) {
                this.createTemplate(element, annotationIndex, index);
            }
        });
        if (parentElement && element.childElementCount && !this.gauge.isBlazor) {
            parentElement.appendChild(element);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this.gauge as any).renderReactTemplates();
    }

    // eslint-disable-next-line valid-jsdoc
    /**
     * Method to create annotation template for circular gauge.
     */
    public createTemplate(element: HTMLElement, annotationIndex: number, axisIndex: number): void {
        const axis: Axis = <Axis>this.gauge.axes[axisIndex];
        const annotation: Annotation = <Annotation>axis.annotations[annotationIndex];
        const childElement: HTMLElement = createElement('div', {
            id: this.elementId + '_Axis_' + axisIndex + '_Annotation_' + annotationIndex,
            styles: 'position: absolute; z-index:' + annotation.zIndex + ';transform:' +
                    (annotation.autoAngle ? 'rotate(' + (annotation.angle - 90) + 'deg)' : 'rotate(0deg)') + ';'
        });
        let argsData: IAnnotationRenderEventArgs = {
            cancel: false, name: annotationRender, content: annotation.content,
            axis: axis, annotation: annotation, textStyle: annotation.textStyle
        };
        if (this.gauge.isBlazor) {
            const {cancel, name, content, textStyle} : IAnnotationRenderEventArgs = argsData;
            argsData = {cancel, name, content, annotation, textStyle};
        }
        this.gauge.trigger('annotationRender', argsData, (observedArgs: IAnnotationRenderEventArgs) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let templateFn: any;
            let templateElement: HTMLCollection;
            if (!argsData.cancel) {
                templateFn = getTemplateFunction(argsData.content, this.gauge);
                if (templateFn && (!this.gauge.isBlazor ? templateFn(axis, this.gauge, argsData.content, this.gauge.element.id + '_Axis' + axisIndex + '_ContentTemplate' + annotationIndex).length : {})) {
                    templateElement = Array.prototype.slice.call(templateFn(!this.gauge.isBlazor ? axis : {}, this.gauge, argsData.content, this.gauge.element.id + '_Axis' + axisIndex + '_ContentTemplate' + annotationIndex));
                    const length: number = templateElement.length;
                    for (let i: number = 0; i < length; i++) {
                        childElement.appendChild(templateElement[i]);
                    }
                } else {
                    childElement.appendChild(createElement('div', {
                        innerHTML: argsData.content,
                        id: 'StringTemplate',
                        styles: getFontStyle(argsData.textStyle)
                    }));
                }
                this.updateLocation(childElement, axis, <Annotation>annotation);
                element.appendChild(childElement);
                const parentElement: Element = document.getElementById(this.elementId + '_Secondary_Element');
                if (this.gauge.isBlazor && annotationIndex === (this.gauge.axes[axisIndex].annotations.length - 1) &&
                    element && parentElement) {
                    parentElement.appendChild(element);
                    for (let i: number = 0; i < this.gauge.axes[axisIndex].annotations.length; i++) {
                        updateBlazorTemplate(this.gauge.element.id + '_Axis' + axisIndex + '_ContentTemplate' + i, 'ContentTemplate', this.gauge.axes[axisIndex].annotations[i]);
                    }
                }
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
    private updateLocation(element: HTMLElement, axis: Axis, annotation: Annotation): void {
        const location: GaugeLocation = getLocationFromAngle(
            annotation.angle - 90,
            stringToNumber(annotation.radius, axis.currentRadius),
            this.gauge.midPoint
        );
        const elementRect: ClientRect = measureElementRect(element);
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
     * @param {CircularGauge} gauge - Specifies the instance of the gauge.
     * @returns {void}
     * @private
     */
    public destroy(gauge: CircularGauge): void {
        // Destroy method performed here
    }
}

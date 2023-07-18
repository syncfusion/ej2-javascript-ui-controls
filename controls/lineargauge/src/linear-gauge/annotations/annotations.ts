/* eslint-disable valid-jsdoc */
/* eslint-disable max-len */

import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { LinearGauge } from '../../linear-gauge';
import { Axis } from '../axes/axis';
import { Annotation } from '../model/base';
import { getTemplateFunction, getElement, getElementOffset, Size, Rect, getExtraWidth } from '../utils/helper';
import { getFontStyle, valueToCoefficient, VisibleRange } from '../utils/helper';
import { annotationRender } from '../model/constant';
import { IAnnotationRenderEventArgs } from '../model/interface';
import { FontModel } from '../model/base-model';

/**
 * Represent the Annotation rendering for gauge
 *
 * @hidden
 */

export class Annotations {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {
    }
    /**
     * To render annotation elements.
     *
     * @param {LinearGauge} gauge - Specifies the instance of Linear Gauge.
     *
     * @private
     */
    public renderAnnotationElements(gauge: LinearGauge): void {
        const secondaryID: string = gauge.element.id + '_Secondary_Element';
        const annotationGroup: HTMLElement = createElement('div', { id: gauge.element.id + '_AnnotationsGroup' });
        annotationGroup.style.position = 'absolute';
        annotationGroup.style.top = '0px';
        annotationGroup.style.left = '0px';
        gauge.annotations.map((annotation: Annotation, index: number): void => {
            if (annotation.content !== null) {
                this.createAnnotationTemplate(annotationGroup, index, gauge);
            }
        });
        if (annotationGroup.childElementCount > 0 && !(isNullOrUndefined(getElement(secondaryID)))) {
            getElement(secondaryID).appendChild(annotationGroup);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (gauge as any).renderReactTemplates();
    }
    /**
     * To create annotation elements
     *
     * @param {HTMLElement} element - Specifies the content of the annotation to be updated in it.
     * @param {number} annotationIndex - Specifies the index number of the annotation in which the content is to be changed.
     * @param {LinearGauge} gauge - Specifies the instance of Linear Gauge.
     *
     * @private
     */
    public createAnnotationTemplate(element: HTMLElement, annotationIndex: number, gauge: LinearGauge): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let left: number; let top: number; let templateFn: any;
        let renderAnnotation: boolean = false;
        let templateElement: HTMLCollection; let axis: Axis;
        let axisIndex: number;
        const annotation: Annotation = <Annotation>gauge.annotations[annotationIndex as number];
        const childElement: HTMLElement = createElement('div', {
            id: gauge.element.id + '_Annotation_' + annotationIndex
        });
        childElement.style.cssText = 'position: absolute; z-index:' + annotation.zIndex + ';';
        const style: FontModel = {
            size: annotation.font.size,
            color: annotation.font.color,
            fontFamily: annotation.font.fontFamily,
            fontWeight: annotation.font.fontWeight,
            fontStyle: annotation.font.fontStyle,
            opacity: annotation.font.opacity
        };
        const argsData: IAnnotationRenderEventArgs = {
            cancel: false, name: annotationRender, content: annotation.content,
            annotation: annotation, textStyle: style
        };
        argsData.textStyle.color = style.color || gauge.themeStyle.labelColor;
        gauge.trigger(annotationRender, argsData, () => {
            if (!argsData.cancel) {
                templateFn = getTemplateFunction(argsData.content, gauge);
                if (templateFn && templateFn(gauge, gauge, argsData.content, gauge.element.id + '_ContentTemplate' + annotationIndex).length) {
                    templateElement = Array.prototype.slice.call(templateFn(gauge, gauge, argsData.content, gauge.element.id + '_ContentTemplate' + annotationIndex));
                    const length: number = templateElement.length;
                    for (let i: number = 0; i < length; i++) {
                        childElement.appendChild(templateElement[i as number]);
                    }
                } else {
                    const annotationElement: HTMLElement = createElement('div', {
                        innerHTML: !isNullOrUndefined(argsData.content) ? argsData.content.toString() : null
                    });
                    annotationElement.style.cssText = getFontStyle(argsData.textStyle);
                    childElement.appendChild(annotationElement);
                }
                const offset: Size = getElementOffset(<HTMLElement>childElement.cloneNode(true), gauge.element);
                if (!(isNullOrUndefined(annotation.axisValue))) {
                    axisIndex = isNullOrUndefined(annotation.axisIndex) ? 0 : annotation.axisIndex;
                    axis = <Axis>gauge.axes[axisIndex as number];
                    const range: VisibleRange = axis.visibleRange;
                    renderAnnotation = (annotation.axisValue >= range.min && annotation.axisValue <= range.max) ? true : false;
                    const line: Rect = axis.lineBounds;
                    const extraWidth: number = getExtraWidth(gauge.element);
                    const axisCollection: HTMLElement = getElement(gauge.element.id + '_Axis_Collections');
                    if (!isNullOrUndefined(axisCollection)) {
                        const transformValue: string = axisCollection.getAttribute('transform').split('(')[1].split(')')[0];
                        const leftTransformValue: number = parseInt(transformValue.split(',')[0], 10);
                        const topTransformValue: number = parseInt(transformValue.split(',')[1], 10);
                        if (gauge.orientation === 'Vertical') {
                            left = line.x + parseFloat(annotation.x.toString()) + leftTransformValue - extraWidth;
                            top = ((valueToCoefficient(parseFloat(annotation.axisValue.toString()), axis, gauge.orientation, range) * line.height) + line.y);
                            top += parseFloat(annotation.y.toString());
                        } else {
                            left = ((valueToCoefficient(parseFloat(annotation.axisValue.toString()), axis, gauge.orientation, range) * line.width) + line.x - extraWidth);
                            left += parseFloat(annotation.x.toString());
                            top = line.y + parseFloat(annotation.y.toString()) + topTransformValue;
                        }
                        left -= (offset.width / 2);
                        top -= (offset.height / 2);
                    }
                } else {
                    const elementRect: ClientRect = gauge.element.getBoundingClientRect();
                    const bounds: ClientRect = gauge.svgObject.getBoundingClientRect();
                    renderAnnotation = true;
                    left = Math.abs(bounds.left - elementRect.left);
                    top = Math.abs(bounds.top - elementRect.top);
                    left = (annotation.horizontalAlignment === 'None') ? (left + annotation.x) : left;
                    top = (annotation.verticalAlignment === 'None') ? top + annotation.y : top;
                    switch (annotation.verticalAlignment) {
                    case 'Near':
                        top = top + annotation.y;
                        break;
                    case 'Center':
                        top = top + annotation.y + ((bounds.height / 2) - (offset.height / 2));
                        break;
                    case 'Far':
                        top = (top + bounds.height) + annotation.y - offset.height;
                        break;
                    }
                    switch (annotation.horizontalAlignment) {
                    case 'Near':
                        left = left + annotation.x;
                        break;
                    case 'Center':
                        left = left + annotation.x + ((bounds.width / 2) - (offset.width / 2));
                        break;
                    case 'Far':
                        left = (left + bounds.width) + annotation.x - offset.width;
                        break;
                    }
                }
                childElement.style.left = left + 'px';
                childElement.style.top = top + 'px';
                if (renderAnnotation) {
                    element.appendChild(childElement);
                }
            }
        });

    }

    /*
     * Get module name.
     */
    protected getModuleName(): string {
        return 'Annotations';
    }

    /**
     * To destroy the annotation.
     *
     * @return {void}
     * @private
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public destroy(): void { }
}

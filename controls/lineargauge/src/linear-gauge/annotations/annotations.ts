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

/**
 * Represent the Annotation rendering for gauge
 */

export class Annotations {
    private gauge: LinearGauge;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    constructor(gauge: LinearGauge) {
        this.gauge = gauge;
    }
    /**
     * To render annotation elements
     */
    public renderAnnotationElements(): void {
        const secondaryID: string = this.gauge.element.id + '_Secondary_Element';
        const annotationGroup: HTMLElement = createElement('div', { id: this.gauge.element.id + '_AnnotationsGroup' });
        annotationGroup.style.position = 'absolute';
        annotationGroup.style.top = '0px';
        annotationGroup.style.left = '0px';
        this.gauge.annotations.map((annotation: Annotation, index: number): void => {
            if (annotation.content !== null) {
                this.createAnnotationTemplate(annotationGroup, index);
            }
        });
        if (annotationGroup.childElementCount > 0 && !(isNullOrUndefined(getElement(secondaryID)))) {
            getElement(secondaryID).appendChild(annotationGroup);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this.gauge as any).renderReactTemplates();
    }
    /**
     * To create annotation elements
     */
    public createAnnotationTemplate(element: HTMLElement, annotationIndex: number): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let left: number; let top: number; let templateFn: any;
        let renderAnnotation: boolean = false;
        let templateElement: HTMLCollection; let axis: Axis;
        let axisIndex: number; let axisValue: number;
        const id: string = this.gauge.element.id + '_Annotation_' + annotationIndex;
        const annotation: Annotation = <Annotation>this.gauge.annotations[annotationIndex];
        const childElement: HTMLElement = createElement('div', {
            id: this.gauge.element.id + '_Annotation_' + annotationIndex, styles: 'position: absolute; z-index:' + annotation.zIndex + ';'
        });
        let argsData: IAnnotationRenderEventArgs = {
            cancel: false, name: annotationRender, content: annotation.content,
            annotation: annotation, textStyle: annotation.font
        };
        argsData.textStyle.color = annotation.font.color || this.gauge.themeStyle.labelColor;
        this.gauge.trigger(annotationRender, argsData, (observerArgs: IAnnotationRenderEventArgs) => {
            if (!argsData.cancel) {
                templateFn = getTemplateFunction(argsData.content);
                if (templateFn && templateFn(this.gauge, this.gauge, argsData.content, this.gauge.element.id + '_ContentTemplate' + annotationIndex).length) {
                    templateElement = Array.prototype.slice.call(templateFn(this.gauge, this.gauge, argsData.content, this.gauge.element.id + '_ContentTemplate' + annotationIndex));
                    const length: number = templateElement.length;
                    for (let i: number = 0; i < length; i++) {
                        childElement.appendChild(templateElement[i]);
                    }
                } else {
                    childElement.appendChild(createElement('div', {
                        innerHTML: argsData.content,
                        styles: getFontStyle(argsData.textStyle)
                    }));
                }
                const offset: Size = getElementOffset(<HTMLElement>childElement.cloneNode(true), this.gauge.element);
                if (!(isNullOrUndefined(annotation.axisValue))) {
                    axisIndex = isNullOrUndefined(annotation.axisIndex) ? 0 : annotation.axisIndex;
                    axis = <Axis>this.gauge.axes[axisIndex];
                    const range: VisibleRange = axis.visibleRange;
                    renderAnnotation = (annotation.axisValue >= range.min && annotation.axisValue <= range.max) ? true : false;
                    const line: Rect = axis.lineBounds;
                    const extraWidth: number = getExtraWidth(this.gauge.element);
                    const axisCollection: HTMLElement = getElement(this.gauge.element.id + '_Axis_Collections');
                    const transformValue: string = axisCollection.getAttribute('transform').split("(")[1].split(")")[0];
                    const leftTransformValue: number = parseInt(transformValue.split(",")[0]);
                    const topTransformValue: number = parseInt(transformValue.split(",")[1]);
                    if (this.gauge.orientation === 'Vertical') {
                        left = line.x + annotation.x + leftTransformValue - extraWidth;
                        top = ((valueToCoefficient(annotation.axisValue, axis, this.gauge.orientation, range) * line.height) + line.y);
                        top += annotation.y;
                    } else {
                        left = ((valueToCoefficient(annotation.axisValue, axis, this.gauge.orientation, range) * line.width) + line.x - extraWidth);
                        left += annotation.x;
                        top = line.y + annotation.y + topTransformValue;
                    }
                    left -= (offset.width / 2);
                    top -= (offset.height / 2);
                } else {
                    const elementRect: ClientRect = this.gauge.element.getBoundingClientRect();
                    const bounds: ClientRect = this.gauge.svgObject.getBoundingClientRect();
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
    public destroy(gauge: LinearGauge): void {
        // Destroy method performed here
    }
}

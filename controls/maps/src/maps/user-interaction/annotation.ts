import { Maps, IAnnotationRenderingEventArgs, annotationRendering, Annotation } from '../index';
import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { getTemplateFunction, Size, getElementOffset, getElementByID } from '../utils/helper';

/**
 * Represents the annotation elements for map.
 */

export class Annotations {

    private map: Maps;
    constructor(map: Maps) {
        this.map = map;
    }

    public renderAnnotationElements(): void {
        const secondaryID: string = this.map.element.id + '_Secondary_Element';
        const annotationGroup: HTMLElement = createElement('div', { id: this.map.element.id + '_Annotations_Group' });
        annotationGroup.style.position = 'absolute';
        annotationGroup.style.top = '0px';
        annotationGroup.style.left = '0px';
        this.map.annotations.map((annotation: Annotation, index: number): void => {
            if (annotation.content !== null) {
                this.createAnnotationTemplate(annotationGroup, annotation, index);
            }
        });
        if (annotationGroup.childElementCount > 0 && !(isNullOrUndefined(getElementByID(secondaryID)))) {
            getElementByID(secondaryID).appendChild(annotationGroup);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this.map as any).renderReactTemplates();
    }

    /**
     * To create annotation elements
     *
     * @param {HTMLElement} parentElement - Specifies the parent element in the map.
     * @param {Annotation} annotation -  Specifies the options for customizing the annotation element in maps.
     * @param {number} annotationIndex - Specifies the index of the annotation.
     * @returns {void}
     *
     * @private
     */
    public createAnnotationTemplate(parentElement: HTMLElement, annotation: Annotation, annotationIndex: number): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let left: number; let top: number; let templateFn: any;
        const map: Maps = this.map; let templateElement: HTMLCollection;
        const availSize: Size = map.availableSize;
        const childElement: HTMLElement = createElement('div', {
            id: map.element.id + '_Annotation_' + annotationIndex
        });
        childElement.style.cssText = 'position: absolute; z-index:' + annotation.zIndex + ';';
        const argsData: IAnnotationRenderingEventArgs = {
            cancel: false, name: annotationRendering, content: annotation.content,
            annotation: annotation
        };
        //eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.map.trigger(annotationRendering, argsData, (annotationArgs: IAnnotationRenderingEventArgs) => {
            if (argsData.cancel) {
                return;
            }
            templateFn = getTemplateFunction(argsData.content, this.map);
            if (templateFn && templateFn(
                this.map, this.map, argsData.content, this.map.element.id + '_ContentTemplate_' + annotationIndex).length) {
                templateElement = Array.prototype.slice.call(templateFn(
                    this.map, this.map, argsData.content, this.map.element.id + '_ContentTemplate_' + annotationIndex));
                const length: number = templateElement.length;
                for (let i: number = 0; i < length; i++) {
                    childElement.appendChild(templateElement[i as number]);
                }
            } else {
                childElement.appendChild(createElement('div', {
                    innerHTML: argsData.content as string
                }));
            }
        });

        const offset: Size = getElementOffset(<HTMLElement>childElement.cloneNode(true), map.element);
        const elementRect: ClientRect = map.element.getBoundingClientRect();
        const bounds: ClientRect = map.svgObject.getBoundingClientRect();
        left = Math.abs(bounds.left - elementRect.left);
        top = Math.abs(bounds.top - elementRect.top);
        const annotationXValue: number = (annotation.x.indexOf('%') > -1) ? (availSize.width / 100) * parseFloat(annotation.x) :
            parseFloat(annotation.x);
        const annotationYValue: number = (annotation.y.indexOf('%') > -1) ? (availSize.height / 100) * parseFloat(annotation.y) :
            parseFloat(annotation.y);
        left = (annotation.horizontalAlignment === 'None') ? (left + annotationXValue) : left;
        top = (annotation.verticalAlignment === 'None') ? (top + annotationYValue) : top;
        switch (annotation.verticalAlignment) {
        case 'Near':
            top = (top + annotationYValue);
            break;
        case 'Center':
            top = (top + annotationYValue) + ((bounds.height / 2) - (offset.height / 2));
            break;
        case 'Far':
            top = (top + bounds.height + annotationYValue) - offset.height;
            break;
        }
        switch (annotation.horizontalAlignment) {
        case 'Near':
            left = (left + annotationXValue);
            break;
        case 'Center':
            left = (left + annotationXValue) + ((bounds.width / 2) - (offset.width / 2));
            break;
        case 'Far':
            left = (left + bounds.width + annotationXValue) - offset.width;
            break;
        }
        childElement.style.left = left + 'px';
        childElement.style.top = top + 'px';
        parentElement.appendChild(childElement);
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
     * @returns {void}
     * @private
     */
    public destroy(): void {
        this.map = null;
    }

}

import { Maps, IAnnotationRenderingEventArgs, annotationRendering, Annotation } from '../index';
import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { getTemplateFunction, Size, getElementOffset, getElementByID } from '../utils/helper';

/**
 * Represent the annotation rendering for map
 */

export class Annotations {

    private map: Maps;
    constructor(map: Maps) {
        this.map = map;
    }

    public renderAnnotationElements(): void {
        let secondaryID: string = this.map.element.id + '_Secondary_Element';
        let annotationGroup: HTMLElement = createElement('div', { id: this.map.element.id + '_Annotations_Group' });
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
    }

    /**
     * To create annotation elements
     */
    public createAnnotationTemplate(parentElement: HTMLElement, annotation: Annotation, annotationIndex: number): void {
        let left: number; let top: number; let templateFn: Function;
        let map: Maps = this.map; let templateElement: HTMLCollection;
        let availSize: Size = map.availableSize;
        let id: string = map.element.id + '_Annotation_' + annotationIndex;
        let childElement: HTMLElement = createElement('div', {
            id: map.element.id + '_Annotation_' + annotationIndex, styles: 'position: absolute; z-index:' + annotation.zIndex + ';'
        });
        let argsData: IAnnotationRenderingEventArgs = {
            cancel: false, name: annotationRendering, content: annotation.content,
            annotation: annotation
        };
        this.map.trigger(annotationRendering, argsData);
        templateFn = getTemplateFunction(argsData.content);
        if (templateFn && templateFn(this.map).length) {
            templateElement = templateFn(this.map);
            while (templateElement.length > 0) {
                childElement.appendChild(templateElement[0]);
            }
        } else {
            childElement.appendChild(createElement('div', {
                innerHTML: argsData.content
            }));
        }
        let offset: Size = getElementOffset(<HTMLElement>childElement.cloneNode(true), map.element);
        let elementRect: ClientRect = map.element.getBoundingClientRect();
        let bounds: ClientRect = map.svgObject.getBoundingClientRect();
        left = Math.abs(bounds.left - elementRect.left);
        top = Math.abs(bounds.top - elementRect.top);
        let annotationXValue: number = (annotation.x.indexOf('%') > -1) ? (availSize.width / 100) * parseFloat(annotation.x) :
            parseFloat(annotation.x);
        let annotationYValue: number = (annotation.y.indexOf('%') > -1) ? (availSize.height / 100) * parseFloat(annotation.y) :
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
     * @return {void}
     * @private
     */
    public destroy(map: Maps): void {
        // Destroy method performed here
    }

}
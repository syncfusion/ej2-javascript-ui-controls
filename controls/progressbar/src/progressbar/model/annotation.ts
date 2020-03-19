import { ProgressBar } from '../progressbar';
import { ProgressAnnotationSettings } from '../model/progress-base';
import { createElement } from '@syncfusion/ej2-base';
import { annotationRender, removeElement, ProgressLocation } from '../utils/helper';
import { IAnnotationRenderEventArgs } from '../model/progress-interface';
import { Rect } from '@syncfusion/ej2-svg-base';
/**
 * Base file for annotation
 */
export class AnnotationBase {
    private control: ProgressBar;
    private annotation: ProgressAnnotationSettings;
    /**
     * Constructor for chart and accumulation annotation
     * @param control
     */
    constructor(control: ProgressBar) {
        this.control = control;
    }
    public render(annotation: ProgressAnnotationSettings, index: number): HTMLElement {
        this.annotation = annotation;
        let childElement: HTMLElement = createElement('div', {
            id: this.control.element.id + 'Annotation' + index,
            styles: 'position:absolute;z-index:1', innerHTML: annotation.content
        });
        return childElement;
    }
    /**
     * To process the annotation 
     * @param annotation
     * @param index
     * @param parentElement
     */
    public processAnnotation(
        annotation: ProgressAnnotationSettings, index: number,
        parentElement: HTMLElement
    ): void {
        let annotationElement: HTMLElement;
        let location: ProgressLocation;
        location = new ProgressLocation(0, 0);
        annotationElement = this.render(annotation, index);
        if (annotationElement) {
            this.setElementStyle(location, annotationElement, parentElement);
        } else if (this.control.redraw) {
            removeElement(annotationElement.id);
        }
    }
    public setElementStyle(
        location: ProgressLocation, element: HTMLElement, parentElement: HTMLElement
    ): void {
        let argsData: IAnnotationRenderEventArgs = {
            cancel: false, name: annotationRender, content: element,
            location: location
        };
        this.control.trigger(annotationRender, argsData);
        if (!argsData.cancel) {
            let result: {top: number, left: number} = this.Location(this.annotation.annotationRadius, this.annotation.annotationAngle);
            argsData.content.style.left = result.left + 'px';
            argsData.content.style.top = result.top + 'px';
            argsData.content.style.transform = 'translate(-50%, -50%)';
            argsData.content.setAttribute('aria-label', 'Annotation');
            parentElement.appendChild(argsData.content);
        }
    }
    private Location(radius: string, angle: number): {top: number, left: number} {
        let top: number; let left: number;
        let radius1: number = parseFloat(radius);
        if (radius1 === 0 && angle === 0) {
            let rect: Rect = this.control.progressRect;
            left =  rect.x + (rect.width / 2);
            top = rect.y + (rect.height / 2);
        } else {
            let degToRadFactor: number = Math.PI / 180;
            angle = angle - 90;
            angle = angle * degToRadFactor;
            let x: number = Math.round(this.control.progressSize.width / 2.25);
            let y: number = Math.round(this.control.progressSize.height / 2.25);
            left = (radius1 * Math.cos(angle)) + x;
            top = (radius1 * Math.sin(angle)) + y;
        }
        return {
            top: top, left: left
        };
    }
}

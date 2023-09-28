/* eslint-disable valid-jsdoc */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
     * Constructor for progress annotation
     *
     * @param {ProgressBar} control It called constructor
     */
    constructor(control: ProgressBar) {
        this.control = control;
    }
    public render(annotation: ProgressAnnotationSettings, index: number): HTMLElement {
        this.annotation = annotation;
        const childElement: HTMLElement = createElement('div', {
            id: this.control.element.id + 'Annotation' + index,
            styles: 'position:absolute;z-index:1', innerHTML: annotation.content
        });
        return childElement;
    }
    /**
     * To process the annotation
     *
     * @param {ProgressAnnotationSettings} annotation One of the parameter called annotation
     * @param {number} index Index of the annotation
     * @param {HTMLElement} parentElement Parent element of the annotation
     */
    public processAnnotation(
        annotation: ProgressAnnotationSettings, index: number,
        parentElement: HTMLElement
    ): void {
        const location: ProgressLocation = new ProgressLocation(0, 0);
        const annotationElement: HTMLElement = this.render(annotation, index);
        if (annotationElement) {
            this.setElementStyle(location, annotationElement, parentElement);
        } else if (this.control.redraw) {
            removeElement(annotationElement.id);
            // tslint:disable-next-line:no-any
            if ((this.control as any).isReact) { (this.control as any).clearTemplate(); }
        }
    }
    public setElementStyle(
        location: ProgressLocation, element: HTMLElement, parentElement: HTMLElement
    ): void {
        const argsData: IAnnotationRenderEventArgs = {
            cancel: false, name: annotationRender, content: element,
            location: location
        };
        this.control.trigger(annotationRender, argsData);
        if (!argsData.cancel) {
            const result: { top: number, left: number } = this.Location(this.annotation.annotationRadius, this.annotation.annotationAngle);
            argsData.content.style.left = result.left + 'px';
            argsData.content.style.top = result.top + 'px';
            argsData.content.style.transform = 'translate(-50%, -50%)';
            argsData.content.setAttribute('aria-label', 'Annotation');
            parentElement.appendChild(argsData.content);
            // tslint:disable-next-line:no-any
            if ((this.control as any).isReact) { (this.control as any).renderReactTemplates(); }
        }
    }
    private Location(radius: string, angle: number): { top: number, left: number } {
        let top: number; let left: number;
        const radius1: number = parseFloat(radius);
        if (radius1 === 0 && angle === 0) {
            const rect: Rect = this.control.progressRect;
            left = rect.x + (rect.width / 2);
            top = rect.y + (rect.height / 2);
        } else {
            const degToRadFactor: number = Math.PI / 180;
            angle = angle - 90;
            angle = angle * degToRadFactor;
            const x: number = Math.round(this.control.progressSize.width / 2.25);
            const y: number = Math.round(this.control.progressSize.height / 2.25);
            left = (radius1 * Math.cos(angle)) + x;
            top = (radius1 * Math.sin(angle)) + y;
        }
        return {
            top: top, left: left
        };
    }
}

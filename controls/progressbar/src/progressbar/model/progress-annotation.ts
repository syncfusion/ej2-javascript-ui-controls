/* eslint-disable jsdoc/require-returns */
/* eslint-disable valid-jsdoc */
import { ProgressBar } from '../progressbar';
import { createElement } from '@syncfusion/ej2-base';
import { ProgressAnnotationSettingsModel } from './progress-base-model';
import { ProgressAnnotationSettings } from './progress-base';
import { AnnotationBase } from './annotation';
import { ProgressAnimation } from '../utils/progress-animation';

/**
 * Class for progress annotation
 */
export class ProgressAnnotation extends AnnotationBase {
    private progress: ProgressBar;
    private annotations: ProgressAnnotationSettingsModel[];
    public parentElement: HTMLElement;
    private animation: ProgressAnimation = new ProgressAnimation();
    /**
     * Constructor for ProgressBar annotation
     *
     * @private
     * @param {ProgressBar} control Passed the control
     * @param {annotations} annotations ProgressAnnotationSettings
     */
    constructor(control: ProgressBar, annotations: ProgressAnnotationSettings[]) {
        super(control);
        this.progress = control;
        this.annotations = annotations;
    }
    /**
     * Method to render the annotation for ProgressBar
     *
     * @param {Element} element Annotation element.
     * @private
     */
    public renderAnnotations(element: Element): void {
        this.annotations = this.progress.annotations;
        const parentElement: HTMLElement = document.getElementById(this.progress.element.id + 'Annotation_collections');
        this.parentElement = parentElement ? parentElement : createElement('div', {
            id: this.progress.element.id + 'Annotation_collections',
            styles: 'position:absolute'
        });
        this.annotations.map((annotation: ProgressAnnotationSettings, index: number) => {
            this.processAnnotation(annotation, index, this.parentElement);
        });
        if (!parentElement) {
            element.appendChild(this.parentElement);
        }
        if (this.progress.animation.enable && !this.progress.isIndeterminate) {
            this.animation.doAnnotationAnimation(this.progress.clipPath, this.progress);
        }
    }
    /**
     * Get module name.
     */
    protected getModuleName(): string {
        return 'ProgressAnnotation';
    }
    /**
     * To destroy the annotation.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        // Destroy method performed here
    }
}

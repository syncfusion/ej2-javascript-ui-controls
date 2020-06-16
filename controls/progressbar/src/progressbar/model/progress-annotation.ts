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
    private parentElement: HTMLElement;
    private animation: ProgressAnimation = new ProgressAnimation();
    /**
     * Constructor for ProgressBar annotation
     * @private
     */
    constructor(control: ProgressBar, annotations: ProgressAnnotationSettings[]) {
        super(control);
        this.progress = control;
        this.annotations = annotations;
    }
    /**
     * Method to render the annotation for ProgressBar
     * @param element
     * @private
     */
    public renderAnnotations(element: Element): void {
        this.annotations = this.progress.annotations;
        let parentElement: HTMLElement = document.getElementById(this.progress.element.id + 'Annotation_collections');
        let annotationElement: Element;
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
     * @return {void}
     * @private
     */
    public destroy(control: ProgressBar): void {
        // Destroy method performed here
    }

}
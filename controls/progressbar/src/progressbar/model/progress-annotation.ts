import { ProgressBar } from '../progressbar';
import { createElement } from '@syncfusion/ej2-base';
import { ProgressAnnotationSettingsModel } from './progress-base-model';
import { ProgressAnnotationSettings } from './progress-base';
import { AnnotationBase } from './annotation';
/**
 * Class for progress annotation
 */
export class ProgressAnnotation extends AnnotationBase {
    private progress: ProgressBar;
    private annotations: ProgressAnnotationSettingsModel[];
    private parentElement: HTMLElement;
    /**
     * Constructor for Progress annotation
     * @private
     */
    constructor(control: ProgressBar, annotations: ProgressAnnotationSettings[]) {
        super(control);
        this.progress = control;
        this.annotations = annotations;
    }
    /**
     * Method to render the annotation for chart
     * @param element
     * @private
     */
    public renderAnnotations(element: Element): void {
        this.annotations = this.progress.annotations;
        let parentElement: HTMLElement = document.getElementById(this.progress.element.id + 'Annotation_collections');
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
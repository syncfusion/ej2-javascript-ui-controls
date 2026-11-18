import { PdfAnnotation, Pdf3DAnnotation } from '../annotations/annotation';
import { _PdfDictionary, _PdfName } from '../pdf-primitives';
import { PdfAction } from '../pdf-action';
import { PdfPage } from '../pdf-page';
import { PdfDocument } from '../pdf-document';
import { _PdfCrossReference } from '../pdf-cross-reference';
/**
 * Represents an action that navigates to a view of a 3D annotation.
 *
 * ```typescript
 * // Load an existing PDF document containing a 3D annotation
 * let document: PdfDocument = new PdfDocument(data, password);
 * let page: PdfPage = document.getPage(0);
 * // Get the existing 3D annotation
 * let annotation: Pdf3DAnnotation = page.annotations.at(0) as Pdf3DAnnotation;
 * // Create a 3D-view action
 * let action: PdfGoTo3DViewAction = new PdfGoTo3DViewAction(annotation, 'DefaultView');
 * // Create a button and assign the action
 * let field: PdfButtonField = new PdfButtonField(
 *     page, 'GoTo3DView', { x: 20, y: 20, width: 120, height: 30 }
 * );
 * field.actions.mouseUp = action;
 * document.form.add(field);
 * // Save and destroy the document
 * document.save('output.pdf');
 * document.destroy();
 * ```
 */
export class PdfGoTo3DViewAction extends PdfAction {
    /**
     * Stores the target 3D annotation.
     *
     * @private
     */
    private _annotation: Pdf3DAnnotation;
    /**
     * Stores the name or index of the target 3D view.
     *
     * @private
     */
    private _view: string | number;
    /**
     * Initializes a new instance of the `PdfGoTo3DViewAction` class.
     *
     * ```typescript
     * // Load an existing PDF document containing a 3D annotation
     * let document: PdfDocument = new PdfDocument(data, password);
     * let page: PdfPage = document.getPage(0);
     * // Get the existing 3D annotation
     * let annotation: Pdf3DAnnotation = page.annotations.at(0) as Pdf3DAnnotation;
     * // Create a 3D-view action
     * let action: PdfGoTo3DViewAction = new PdfGoTo3DViewAction(annotation, 'DefaultView');
     * // Create a button and assign the action
     * let field: PdfButtonField = new PdfButtonField(
     *     page, 'GoTo3DView', { x: 20, y: 20, width: 120, height: 30 }
     * );
     * field.actions.mouseUp = action;
     * document.form.add(field);
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {Pdf3DAnnotation} annotation The target 3D annotation.
     * @param {string | number} view The name or zero-based index of the target 3D view.
     */
    public constructor(annotation?: Pdf3DAnnotation, view?: string | number) {
        super();
        this._initialize();
        this._dictionary.update('S', new _PdfName('GoTo3DView'));
        if (annotation) {
            this.annotation = annotation;
        }
        if (view !== undefined) {
            this.view = view;
        }
    }
    /**
     * Gets the target 3D annotation.
     *
     * ```typescript
     * // Load an existing PDF document containing a 3D-view action
     * let document: PdfDocument = new PdfDocument(data, password);
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the 3D-view action
     * let action: PdfGoTo3DViewAction = field.actions.mouseUp as PdfGoTo3DViewAction;
     * // Get the target 3D annotation
     * let annotation: Pdf3DAnnotation = action.annotation;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {Pdf3DAnnotation} The target 3D annotation.
     */
    public get annotation(): Pdf3DAnnotation {
        if (!this._annotation && this._dictionary.has('TA')) {
            const targetDictionary: _PdfDictionary = this._dictionary.get('TA') as _PdfDictionary;
            const crossReference: _PdfCrossReference = this._dictionary._crossReference;
            const document: PdfDocument = crossReference ? crossReference._document
                : undefined;
            if (targetDictionary instanceof _PdfDictionary &&
                document instanceof PdfDocument) {
                for (let i: number = 0; i < document.pageCount; i++) {
                    const page: PdfPage = document.getPage(i);
                    for (let j: number = 0; j < page.annotations.count; j++) {
                        const annotation: PdfAnnotation = page.annotations.at(j);
                        if (annotation instanceof Pdf3DAnnotation &&
                            annotation._dictionary === targetDictionary) {
                            this._annotation = annotation;
                            break;
                        }
                    }
                    if (this._annotation) {
                        break;
                    }
                }
            }
        }
        return this._annotation;
    }
    /**
     * Sets the target 3D annotation.
     *
     * ```typescript
     * // Load an existing PDF document containing a 3D annotation
     * let document: PdfDocument = new PdfDocument(data, password);
     * let page: PdfPage = document.getPage(0);
     * // Get the existing 3D annotation
     * let annotation: Pdf3DAnnotation = page.annotations.at(0) as Pdf3DAnnotation;
     * // Get the button field and its 3D-view action
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * let action: PdfGoTo3DViewAction = field.actions.mouseUp as PdfGoTo3DViewAction;
     * // Set the target 3D annotation
     * action.annotation = annotation;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {Pdf3DAnnotation} value The target 3D annotation.
     */
    public set annotation(value: Pdf3DAnnotation) {
        this._annotation = value;
        if (value && value._ref) {
            this._dictionary.update('TA', value._ref);
        } else if (value) {
            this._dictionary.update('TA', value._dictionary);
        } else {
            delete this._dictionary._map.TA;
        }
        this._dictionary._updated = true;
    }
    /**
     * Gets the name or index of the target 3D view.
     *
     * ```typescript
     * // Load an existing PDF document containing a 3D-view action
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the 3D-view action
     * let action: PdfGoTo3DViewAction = field.actions.mouseUp as PdfGoTo3DViewAction;
     * // Get the name or index of the target 3D view
     * let view: string | number = action.view;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {string | number} The name or zero-based index of the target 3D view.
     */
    public get view(): string | number {
        if (this._view === undefined) {
            const value: unknown = this._dictionary.get('V');
            this._view = value instanceof _PdfName ? value.name : value as string | number;
        }
        return this._view;
    }
    /**
     * Sets the name or index of the target 3D view.
     *
     * ```typescript
     * // Load an existing PDF document containing a 3D-view action
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the 3D-view action
     * let action: PdfGoTo3DViewAction = field.actions.mouseUp as PdfGoTo3DViewAction;
     * // Set the target 3D view
     * action.view = 'DefaultView';
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {string | number} value The name or zero-based index of the target 3D view.
     */
    public set view(value: string | number) {
        this._view = value;
        this._dictionary.update('V', value);
        this._dictionary._updated = true;
    }
    /**
     * Validates the 3D-view action before serialization.
     *
     * @private
     * @returns {void} Nothing.
     */
    _validate(): void {
        if (!this.annotation && !this._dictionary.has('TA')) {
            throw new Error('PdfGoTo3DViewAction.annotation expected valid Pdf3DAnnotation.');
        }
        if (typeof this.view === 'undefined' || this.view === null) {
            throw new Error('PdfGoTo3DViewAction.view expected valid value.');
        }
    }
}
PdfAction._registerActionClass('GoTo3DView', PdfGoTo3DViewAction);

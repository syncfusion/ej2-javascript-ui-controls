import { PdfAction } from '../pdf-action';
import { _PdfName } from '../pdf-primitives';
import { PdfHideTarget } from '../pdf-document-helper';
import { PdfHideTargetCollection } from './pdf-hide-target-collection';
/**
 * Represents an action that hides or shows one or more form fields or annotations.
 *
 * ```typescript
 * // Create a new PDF document
 * let document: PdfDocument = new PdfDocument();
 * let page: PdfPage = document.addPage();
 * // Create a text box field
 * let textField: PdfTextBoxField = new PdfTextBoxField(
 *     page, 'CustomerName', { x: 20, y: 20, width: 150, height: 30 }
 * );
 * document.form.add(textField);
 * // Create a Hide Action
 * let action: PdfHideAction = new PdfHideAction(true, [
 *     { fieldName: 'CustomerName' }
 * ]);
 * // Create a button and assign the action
 * let button: PdfButtonField = new PdfButtonField(
 *     page, 'HideCustomerName', { x: 20, y: 70, width: 120, height: 30 }
 * );
 * button.text = 'Hide targets';
 * button.actions.mouseUp = action;
 * document.form.add(button);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfHideAction extends PdfAction {
    /**
     * Caches the target collection of the action.
     *
     * @private
     */
    private _targetCollection: PdfHideTargetCollection;
    /**
     * Initializes a new instance of the PdfHideAction class with the specified visibility state and optional targets.
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * let page: PdfPage = document.addPage();
     * let textField: PdfTextBoxField = new PdfTextBoxField(
     *     page, 'CustomerName', { x: 20, y: 20, width: 150, height: 30 }
     * );
     document.form.add(textField);
     * // Create a Hide Action that hides the text box
     * let action: PdfHideAction = new PdfHideAction(true, [
     *     { fieldName: 'CustomerName' }
     * ]);
     * // Create a button and assign the action
     * let button: PdfButtonField = new PdfButtonField(
     *     page, 'HideCustomerName', { x: 20, y: 70, width: 120, height: 30 }
     * );
     * button.actions.mouseUp = action;
     * document.form.add(button);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {boolean} hide Indicates whether the targets shall be hidden (`true`) or shown (`false`).
     * @param {PdfHideTarget[]} [targets] The form-field and annotation targets used to initialize the collection.
     */
    public constructor(hide: boolean, targets?: PdfHideTarget[]) {
        super();
        this._initialize();
        this._dictionary.update('S', new _PdfName('Hide'));
        this._dictionary.update('H', hide);
        this._targetCollection = new PdfHideTargetCollection(this);
        this._targetCollection._rawTargets = [];
        if (targets) {
            targets.forEach((target: PdfHideTarget): void => {
                this._targetCollection.add(target);
            });
        }
    }
    /**
     * Gets whether the targets are hidden.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Get the Hide Action
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * let action: PdfHideAction = field.actions.mouseUp as PdfHideAction;
     * // Get the visibility state
     * let hide: boolean = action.hide;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @returns {boolean} `true` when the targets are hidden; otherwise, `false`.
     */
    public get hide(): boolean {
        if (this._dictionary.has('H')) {
            return this._dictionary.get('H') === true;
        }
        return true;
    }
    /**
     * Sets whether the targets are hidden.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Get the Hide Action
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * let action: PdfHideAction = field.actions.mouseUp as PdfHideAction;
     * // Show the targets
     * action.hide = false;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {boolean} value `true` to hide the targets; `false` to show them.
     */
    public set hide(value: boolean) {
        this._dictionary.update('H', value);
        this._dictionary._updated = true;
    }
    /**
     * Gets the collection of form-field and annotation targets associated with the Hide Action.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Get the Hide Action
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * let action: PdfHideAction = field.actions.mouseUp as PdfHideAction;
     * // Get the target collection
     * let targets: PdfHideTargetCollection = action.targets;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @returns {PdfHideTargetCollection} The target collection of the Hide Action.
     */
    public get targets(): PdfHideTargetCollection {
        if (!this._targetCollection) {
            this._load();
        }
        return this._targetCollection;
    }
    /**
     * Loads the raw /T entry into a new target collection for a loaded action.
     *
     * @private
     * @returns {void} Nothing.
     */
    private _load(): void {
        let rawTargets: any[] = undefined; // eslint-disable-line
        if (this._dictionary.has('T')) {
            const value: any = this._dictionary.getRaw('T'); // eslint-disable-line
            if (Array.isArray(value)) {
                rawTargets = value;
            } else {
                rawTargets = [value];
            }
        }
        this._targetCollection = new PdfHideTargetCollection(this);
        this._targetCollection._rawTargets = rawTargets;
    }
    /**
     * Synchronizes the public target collection into the action dictionary before serialization.
     *
     * @private
     * @returns {void} Nothing.
     */
    _validate(): void {
        if (this._targetCollection) {
            this._targetCollection._sync();
        }
    }
}
PdfAction._registerActionClass('Hide', PdfHideAction);

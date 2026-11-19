import { PdfAnnotation } from '../annotations/annotation';
import { PdfAction } from '../pdf-action';
import { _PdfDictionary, _PdfName, _PdfReference } from '../pdf-primitives';
import { PdfAnnotationTarget, PdfFieldTarget, PdfHideTarget } from '../pdf-document-helper';
/**
 * Represents a collection of form-field and annotation targets associated with a PDF Hide Action.
 *
 * ```typescript
 * // Create a new PDF document
 * let document: PdfDocument = new PdfDocument();
 * let page: PdfPage = document.addPage();
 * // Create a Hide Action
 * let action: PdfHideAction = new PdfHideAction(true);
 * // Add targets to the collection
 * action.targets.add({ fieldName: 'CustomerName' });
 * // Get the target count
 * let count: number = action.targets.count;
 * // Read a target
 * let target: PdfHideTarget = action.targets.itemAt(0);
 * // Remove a target
 * action.targets.removeAt(0);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfHideTargetCollection {
    /**
     * Internal ordered list of targets.
     *
     * @private
     */
    private _targets: PdfHideTarget[] = [];
    /**
     * Back-reference to the owning action.
     *
     * @private
     */
    private _action: PdfAction;
    /**
     * Raw preserved target values loaded from the source dictionary.
     *
     * @private
     */
    _rawTargets: any[]; // eslint-disable-line
    /**
     * Initializes a new instance of the `PdfHideTargetCollection` class.
     *
     * @private
     * @param {PdfAction} action The owning Hide Action.
     */
    constructor(action: PdfAction) {
        this._action = action;
    }
    /**
     * Gets the number of targets in the collection.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Get the first page
     * let page: PdfPage = document.getPage(0) as PdfPage;
     * // Get the form field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the Hide Action
     * let action: PdfHideAction = field.actions.mouseUp as PdfHideAction;
     * // Get the target count
     * let count: number = action.targets.count;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @returns {number} The number of targets in the collection.
     */
    public get count(): number {
        this._ensureParsed();
        return this._targets.length;
    }
    /**
     * Adds the specified target to the end of the collection.
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * // Add a page
     * let page: PdfPage = document.addPage();
     * // Create button and text-box fields
     * let button: PdfButtonField = new PdfButtonField(page, 'button', {
     *     x: 20, y: 20, width: 100, height: 30
     * });
     * let textBox: PdfTextBoxField = new PdfTextBoxField(page, 'CustomerName', {
     *     x: 20, y: 70, width: 150, height: 30
     * });
     * // Add the fields to the document
     * document.form.add(button);
     * document.form.add(textBox);
     * // Create a Hide Action
     * let action: PdfHideAction = new PdfHideAction(true);
     * // Add a field target
     * action.targets.add({ fieldName: 'CustomerName' });
     * // Assign the action to the button field
     * button.actions.mouseUp = action;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {PdfHideTarget} target The target to add.
     * @returns {void} Nothing.
     */
    public add(target: PdfHideTarget): void {
        this._ensureParsed();
        if (target !== null && target !== undefined && !this._isDuplicate(target)) {
            this._targets.push(target);
        }
        this._update();
    }
    /**
     * Gets the target at the specified zero-based index.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Get the form field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the Hide Action
     * let action: PdfHideAction = field.actions.mouseUp as PdfHideAction;
     * // Get the first target
     * let target: PdfHideTarget = action.targets.itemAt(0);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {number} index The zero-based index of the target.
     * @returns {PdfHideTarget} The target at the specified index.
     */
    public itemAt(index: number): PdfHideTarget {
        this._ensureParsed();
        this._validateIndex(index);
        return this._targets[index]; // eslint-disable-line
    }
    /**
     * Removes the target at the specified zero-based index.
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * // Add a page
     * let page: PdfPage = document.addPage();
     * // Create a button field
     * let button: PdfButtonField = new PdfButtonField(page, 'button', {
     *     x: 20, y: 20, width: 100, height: 30
     * });
     * // Add the button field to the document
     * document.form.add(button);
     * // Create a Hide Action
     * let action: PdfHideAction = new PdfHideAction(true);
     * // Add a field target
     * action.targets.add({ fieldName: 'CustomerName' });
     * // Remove the first target
     * action.targets.removeAt(0);
     * // Assign the action to the button field
     * button.actions.mouseUp = action;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {number} index The zero-based index of the target to remove.
     * @returns {void} Nothing.
     */
    public removeAt(index: number): void {
        this._ensureParsed();
        this._validateIndex(index);
        this._targets.splice(index, 1);
        this._update();
    }
    /**
     * Removes the first matching target from the collection.
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * // Add a page
     * let page: PdfPage = document.addPage();
     * // Create a button field
     * let button: PdfButtonField = new PdfButtonField(page, 'button', {
     *     x: 20, y: 20, width: 100, height: 30
     * });
     * // Create a text-box field
     * let textBox: PdfTextBoxField = new PdfTextBoxField(page, 'CustomerName', {
     *     x: 20, y: 70, width: 150, height: 30
     * });
     * // Add the fields to the document
     * document.form.add(button);
     * document.form.add(textBox);
     * // Create a Hide Action
     * let action: PdfHideAction = new PdfHideAction(true);
     * // Add a field target
     * action.targets.add({ fieldName: 'CustomerName' });
     * // Remove the matching target
     * action.targets.remove({ fieldName: 'CustomerName' });
     * // Assign the action to the button field
     * button.actions.mouseUp = action;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {PdfHideTarget} target The target to remove.
     * @returns {void} Nothing.
     */
    public remove(target: PdfHideTarget): void {
        this._ensureParsed();
        const index: number = this.indexOf(target);
        if (index >= 0) {
            this._targets.splice(index, 1);
        }
        this._update();
    }
    /**
     * Determines whether the collection contains the specified target.
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * // Add a page
     * let page: PdfPage = document.addPage();
     * // Create a button field
     * let button: PdfButtonField = new PdfButtonField(page, 'button', {
     *     x: 20, y: 20, width: 100, height: 30
     * });
     * // Create a text-box field
     * let textBox: PdfTextBoxField = new PdfTextBoxField(page, 'CustomerName', {
     *     x: 20, y: 70, width: 150, height: 30
     * });
     * // Add the fields to the document
     * document.form.add(button);
     * document.form.add(textBox);
     * // Create a Hide Action
     * let action: PdfHideAction = new PdfHideAction(true);
     * // Add a field target
     * action.targets.add({ fieldName: 'CustomerName' });
     * // Check whether the target exists
     * let exists: boolean = action.targets.has({ fieldName: 'CustomerName' });
     * // Assign the action to the button field
     * button.actions.mouseUp = action;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {PdfHideTarget} target The target to locate.
     * @returns {boolean} `true` when the target exists; otherwise, `false`.
     */
    public has(target: PdfHideTarget): boolean {
        return this.indexOf(target) >= 0;
    }
    /**
     * Returns the zero-based index of the specified target, or `-1` when it is not found.
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * // Add a page
     * let page: PdfPage = document.addPage();
     * // Create a button field
     * let button: PdfButtonField = new PdfButtonField(page, 'button', {
     *     x: 20, y: 20, width: 100, height: 30
     * });
     * // Create a text-box field
     * let textBox: PdfTextBoxField = new PdfTextBoxField(page, 'CustomerName', {
     *     x: 20, y: 70, width: 150, height: 30
     * });
     * // Add the fields to the document
     * document.form.add(button);
     * document.form.add(textBox);
     * // Create a Hide Action
     * let action: PdfHideAction = new PdfHideAction(true);
     * // Add a field target
     * action.targets.add({ fieldName: 'CustomerName' });
     * // Get the target index
     * let index: number = action.targets.indexOf({ fieldName: 'CustomerName' });
     * // Assign the action to the button field
     * button.actions.mouseUp = action;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {PdfHideTarget} target The target to locate.
     * @returns {number} The zero-based index of the target, or `-1` when it is not found.
     */
    public indexOf(target: PdfHideTarget): number {
        this._ensureParsed();
        let result: number = -1;
        for (let i: number = 0; i < this._targets.length; i++) {
            if (this._matches(this._targets[i], target)) { // eslint-disable-line
                result = i;
                break;
            }
        }
        return result;
    }
    /**
     * Removes all targets from the collection.
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * // Add a page
     * let page: PdfPage = document.addPage();
     * // Create a button field
     * let button: PdfButtonField = new PdfButtonField(page, 'button', {
     *     x: 20, y: 20, width: 100, height: 30
     * });
     * // Create a text-box field
     * let textBox: PdfTextBoxField = new PdfTextBoxField(page, 'CustomerName', {
     *     x: 20, y: 70, width: 150, height: 30
     * });
     * // Add the fields to the document
     * document.form.add(button);
     * document.form.add(textBox);
     * // Create a Hide Action
     * let action: PdfHideAction = new PdfHideAction(true);
     * // Add a field target
     * action.targets.add({ fieldName: 'CustomerName' });
     * // Remove all targets
     * action.targets.clear();
     * // Assign the action to the button field
     * button.actions.mouseUp = action;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @returns {void} Nothing.
     */
    public clear(): void {
        this._ensureParsed();
        this._targets = [];
        this._update();
    }
    /**
     * Synchronizes the public targets into the action dictionary when a loaded action is unchanged.
     *
     * @private
     * @returns {void} Nothing.
     */
    _sync(): void {
        if (this._rawTargets === null || this._rawTargets === undefined) {
            this._update();
        }
    }
    /**
     * Ensures the loaded /T entry has been parsed into the public target list.
     *
     * @private
     * @returns {void} Nothing.
     */
    private _ensureParsed(): void {
        if (this._rawTargets !== null && this._rawTargets !== undefined) {
            const rawTargets: any[] = this._rawTargets; // eslint-disable-line
            this._rawTargets = undefined;
            rawTargets.forEach((rawTarget: any): void => { // eslint-disable-line
                const target: PdfHideTarget = this._resolveTarget(rawTarget);
                if (target !== null && target !== undefined && !this._isDuplicate(target)) {
                    this._targets.push(target);
                }
            });
        }
    }
    /**
     * Synchronizes the public targets into the action dictionary /T entry.
     *
     * @private
     * @returns {void} Nothing.
     */
    _update(): void {
        const dictionary: _PdfDictionary = this._action._dictionary;
        const values: any[] = []; // eslint-disable-line
        this._targets.forEach((target: PdfHideTarget): void => {
            if (this._isFieldTarget(target)) {
                values.push((target as PdfFieldTarget).fieldName);
            } else if (this._isAnnotationTarget(target)) {
                const reference: _PdfReference =
                    this._getAnnotationReference((target as PdfAnnotationTarget).annotation);
                if (reference) {
                    values.push(reference);
                }
            } else {
                values.push((target as any)._rawValue); // eslint-disable-line
            }
        });
        if (values.length === 1) {
            dictionary.update('T', values[0]);
        } else if (values.length > 1) {
            dictionary.update('T', values);
        } else {
            delete dictionary._map.T;
            dictionary._updated = true;
        }
    }
    /**
     * Resolves a raw loaded /T value into a public target while preserving unsupported values.
     *
     * @private
     * @param {any} rawTarget The raw /T value or array element.
     * @returns {PdfHideTarget} The resolved public target.
     */
    private _resolveTarget(rawTarget: any): PdfHideTarget { // eslint-disable-line
        if (rawTarget === null || rawTarget === undefined) {
            return undefined;
        }
        if (typeof rawTarget === 'string') {
            return { fieldName: rawTarget };
        }
        if (rawTarget instanceof _PdfName) {
            return { fieldName: rawTarget.name };
        }
        if (rawTarget instanceof _PdfReference) {
            const crossReference: any = this._action._dictionary._crossReference; // eslint-disable-line
            let annotationDictionary: any = undefined; // eslint-disable-line
            if (crossReference) {
                annotationDictionary = crossReference._fetch(rawTarget);
            }
            if (annotationDictionary && annotationDictionary.has && annotationDictionary.has('Subtype')) {
                const resolved: PdfAnnotation = this._findAnnotation(annotationDictionary, crossReference);
                if (resolved) {
                    return this._wrapAnnotation(resolved, rawTarget);
                }
            }
            const preserved: any = { _rawValue: rawTarget }; // eslint-disable-line
            return preserved;
        }
        const preserved: any = { _rawValue: rawTarget }; // eslint-disable-line
        return preserved;
    }
    /**
     * Finds the annotation instance that owns the specified annotation dictionary.
     *
     * @private
     * @param {_PdfDictionary} annotationDictionary The loaded annotation dictionary.
     * @param {any} crossReference The cross-reference table used to reach the document.
     * @returns {PdfAnnotation} The owning annotation instance, when found.
     */
    private _findAnnotation(annotationDictionary: _PdfDictionary, crossReference: any): PdfAnnotation { // eslint-disable-line
        const document: any = crossReference._document; // eslint-disable-line
        for (let i: number = 0; i < document.pageCount; i++) {
            const page: any = document.getPage(i); // eslint-disable-line
            const annotations: any = page.annotations; // eslint-disable-line
            for (let j: number = 0; j < annotations.count; j++) {
                const annotation: PdfAnnotation = annotations.at(j);
                if (annotation._dictionary === annotationDictionary) {
                    return annotation;
                }
            }
        }
        return undefined;
    }
    /**
     * Wraps a resolved annotation into an annotation target while preserving its raw reference.
     *
     * @private
     * @param {PdfAnnotation} annotation The resolved annotation instance.
     * @param {_PdfReference} rawTarget The raw annotation reference.
     * @returns {PdfHideTarget} The annotation target.
     */
    private _wrapAnnotation(annotation: PdfAnnotation, rawTarget: _PdfReference): PdfHideTarget {
        const target: PdfAnnotationTarget = { annotation: annotation };
        (target as any)._rawValue = rawTarget; // eslint-disable-line
        return target;
    }
    /**
     * Gets the indirect reference used to serialize the specified annotation.
     *
     * @private
     * @param {PdfAnnotation} annotation The annotation target.
     * @returns {_PdfReference} The annotation reference.
     */
    private _getAnnotationReference(annotation: PdfAnnotation): _PdfReference {
        const annotationRef: _PdfReference = (annotation as any)._ref; // eslint-disable-line
        if (annotationRef instanceof _PdfReference) {
            return annotationRef;
        }
        const reference: any = annotation._dictionary._reference; // eslint-disable-line
        if (reference instanceof _PdfReference) {
            return reference;
        }
        return undefined;
    }
    /**
     * Determines whether the target represents a form field.
     *
     * @private
     * @param {PdfHideTarget} target The target to inspect.
     * @returns {boolean} `true` when the target is a form-field target.
     */
    private _isFieldTarget(target: PdfHideTarget): boolean {
        return (target as PdfFieldTarget).fieldName !== undefined &&
            (target as any).annotation === undefined; // eslint-disable-line
    }
    /**
     * Determines whether the target represents an annotation.
     *
     * @private
     * @param {PdfHideTarget} target The target to inspect.
     * @returns {boolean} `true` when the target is an annotation target.
     */
    private _isAnnotationTarget(target: PdfHideTarget): boolean {
        return (target as PdfAnnotationTarget).annotation !== undefined;
    }
    /**
     * Determines whether the target is an equivalent duplicate of an existing target.
     *
     * @private
     * @param {PdfHideTarget} target The target to inspect.
     * @returns {boolean} `true` when an equivalent target already exists.
     */
    private _isDuplicate(target: PdfHideTarget): boolean {
        return this.indexOf(target) >= 0;
    }
    /**
     * Compares two targets using logical target comparison.
     *
     * @private
     * @param {PdfHideTarget} left The first target.
     * @param {PdfHideTarget} right The second target.
     * @returns {boolean} `true` when the targets are logically equal.
     */
    private _matches(left: PdfHideTarget, right: PdfHideTarget): boolean {
        if (left === right) {
            return true;
        }
        if (left === null || left === undefined || right === null || right === undefined) {
            return false;
        }
        if (this._isFieldTarget(left) && this._isFieldTarget(right)) {
            return (left as PdfFieldTarget).fieldName === (right as PdfFieldTarget).fieldName;
        }
        if (this._isAnnotationTarget(left) && this._isAnnotationTarget(right)) {
            const leftAnnotation: PdfAnnotation = (left as PdfAnnotationTarget).annotation;
            const rightAnnotation: PdfAnnotation = (right as PdfAnnotationTarget).annotation;
            if (leftAnnotation === rightAnnotation) {
                return true;
            }
            const leftReference: _PdfReference = this._annotationReference(left);
            const rightReference: _PdfReference = this._annotationReference(right);
            return leftReference !== undefined && rightReference !== undefined &&
                leftReference.toString() === rightReference.toString();
        }
        return false;
    }
    /**
     * Gets the reference identity of an annotation target.
     *
     * @private
     * @param {PdfHideTarget} target The annotation target.
     * @returns {_PdfReference} The annotation reference, when available.
     */
    private _annotationReference(target: PdfHideTarget): _PdfReference {
        const rawTarget: any = (target as any)._rawValue; // eslint-disable-line
        if (rawTarget instanceof _PdfReference) {
            return rawTarget;
        }
        return this._getAnnotationReference((target as PdfAnnotationTarget).annotation);
    }
    /**
     * Validates an index used by `itemAt` and `removeAt`.
     *
     * @private
     * @param {number} index The index to validate.
     * @returns {void} Nothing.
     */
    private _validateIndex(index: number): void {
        if (index < 0 || index >= this._targets.length) {
            throw new Error(
                'PdfHideTargetCollection index was out of range. ' +
                `Expected a value between 0 and ${Math.max(this._targets.length - 1, 0)} ` +
                `and the actual value was ${index}.`
            );
        }
    }
}

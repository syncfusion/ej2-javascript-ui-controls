import { PdfAnnotation, PdfRichMediaAnnotation } from '../annotations/annotation';
import { PdfAction } from '../pdf-action';
import { _PdfCrossReference } from '../pdf-cross-reference';
import { PdfDocument } from '../pdf-document';
import { PdfPage } from '../pdf-page';
import { _PdfDictionary, _PdfName } from '../pdf-primitives';
import { PdfRichMediaCommand } from './pdf-rich-media-command';
/**
 * Represents an action that executes a command on an existing rich-media annotation.
 *
 * ```typescript
 * // Load an existing PDF document containing a rich-media annotation
 * let document: PdfDocument = new PdfDocument(data, password);
 * let page: PdfPage = document.getPage(0);
 * // Get the existing rich-media annotation
 * let annotation: PdfRichMediaAnnotation = page.annotations.at(0) as PdfRichMediaAnnotation;
 * // Create a rich-media command
 * let command: PdfRichMediaCommand = new PdfRichMediaCommand('play');
 * // Create a rich-media execute action
 * let action: PdfRichMediaExecuteAction = new PdfRichMediaExecuteAction(annotation, command);
 * // Create a button and assign the action
 * let field: PdfButtonField = new PdfButtonField(
 *     page, 'ExecuteRichMedia', { x: 20, y: 20, width: 140, height: 30 }
 * );
 * field.actions.mouseUp = action;
 * document.form.add(field);
 * // Save and destroy the document
 * document.save('output.pdf');
 * document.destroy();
 * ```
 */
export class PdfRichMediaExecuteAction extends PdfAction {
    /**
     * Stores the target rich-media annotation.
     *
     * @private
     */
    private _annotation: PdfRichMediaAnnotation;
    /**
     * Stores the command executed on the rich-media annotation.
     *
     * @private
     */
    private _command: PdfRichMediaCommand;
    /**
     * Initializes a new instance of the `PdfRichMediaExecuteAction` class.
     *
     * ```typescript
     * // Load an existing PDF document containing a rich-media annotation
     * let document: PdfDocument = new PdfDocument(data, password);
     * let page: PdfPage = document.getPage(0);
     * // Get the existing rich-media annotation
     * let annotation: PdfRichMediaAnnotation = page.annotations.at(0) as PdfRichMediaAnnotation;
     * // Create a rich-media command
     * let command: PdfRichMediaCommand = new PdfRichMediaCommand('play');
     * // Create a rich-media execute action
     * let action: PdfRichMediaExecuteAction = new PdfRichMediaExecuteAction(annotation, command);
     * // Create a button and assign the action
     * let field: PdfButtonField = new PdfButtonField(
     *     page, 'ExecuteRichMedia', { x: 20, y: 20, width: 140, height: 30 }
     * );
     * field.actions.mouseUp = action;
     * document.form.add(field);
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {PdfRichMediaAnnotation} annotation The target rich-media annotation.
     * @param {PdfRichMediaCommand} command The command to execute on the rich-media annotation.
     */
    public constructor(annotation?: PdfRichMediaAnnotation, command?: PdfRichMediaCommand) {
        super();
        this._initialize();
        this._dictionary.update('S', new _PdfName('RichMediaExecute'));
        if (annotation) {
            this.annotation = annotation;
        }
        if (command) {
            this.command = command;
        }
    }
    /**
     * Gets the target rich-media annotation.
     *
     * ```typescript
     * // Load an existing PDF document containing a rich-media execute action
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the rich-media execute action
     * let action: PdfRichMediaExecuteAction = field.actions.mouseUp as PdfRichMediaExecuteAction;
     * // Get the target rich-media annotation
     * let annotation: PdfRichMediaAnnotation = action.annotation;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {PdfRichMediaAnnotation} The target rich-media annotation.
     */
    public get annotation(): PdfRichMediaAnnotation {
        if (!this._annotation && this._dictionary.has('TA')) {
            const targetDictionary: _PdfDictionary = this._dictionary.get('TA') as _PdfDictionary;
            const crossReference: _PdfCrossReference = this._dictionary._crossReference;
            const document: PdfDocument = crossReference ? crossReference._document : undefined;
            if (targetDictionary instanceof _PdfDictionary && document instanceof PdfDocument) {
                for (let i: number = 0; i < document.pageCount; i++) {
                    const page: PdfPage = document.getPage(i);
                    for (let j: number = 0; j < page.annotations.count; j++) {
                        const annotation: PdfAnnotation = page.annotations.at(j);
                        if (annotation instanceof PdfRichMediaAnnotation &&
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
     * Sets the target rich-media annotation.
     *
     * ```typescript
     * // Load an existing PDF document containing a rich-media annotation
     * let document: PdfDocument = new PdfDocument(data, password);
     * let page: PdfPage = document.getPage(0);
     * // Get the existing rich-media annotation
     * let annotation: PdfRichMediaAnnotation = page.annotations.at(0) as PdfRichMediaAnnotation;
     * // Get the rich-media execute action
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * let action: PdfRichMediaExecuteAction = field.actions.mouseUp as PdfRichMediaExecuteAction;
     * // Set the target rich-media annotation
     * action.annotation = annotation;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {PdfRichMediaAnnotation} value The target rich-media annotation.
     */
    public set annotation(value: PdfRichMediaAnnotation) {
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
     * Gets the command executed on the target rich-media annotation.
     *
     * ```typescript
     * // Load an existing PDF document containing a rich-media execute action
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the rich-media execute action
     * let action: PdfRichMediaExecuteAction = field.actions.mouseUp as PdfRichMediaExecuteAction;
     * // Get the rich-media command
     * let command: PdfRichMediaCommand = action.command;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {PdfRichMediaCommand} The command executed on the target rich-media annotation.
     */
    public get command(): PdfRichMediaCommand {
        if (!this._command && this._dictionary.has('CMD')) {
            const dictionary: _PdfDictionary = this._dictionary.get('CMD') as _PdfDictionary;
            if (dictionary instanceof _PdfDictionary) {
                (dictionary as any)._parentDictionary = (this._dictionary as any)._parentDictionary || this._dictionary; // eslint-disable-line
                this._command = PdfRichMediaCommand._createFromDictionary(dictionary);
            }
        }
        return this._command;
    }
    /**
     * Sets the command executed on the target rich-media annotation.
     *
     * ```typescript
     * // Load an existing PDF document containing a rich-media execute action
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the rich-media execute action
     * let action: PdfRichMediaExecuteAction = field.actions.mouseUp as PdfRichMediaExecuteAction;
     * // Create and set a rich-media command
     * let command: PdfRichMediaCommand = new PdfRichMediaCommand('pause');
     * action.command = command;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {PdfRichMediaCommand} value The command to execute on the target rich-media annotation.
     */
    public set command(value: PdfRichMediaCommand) {
        this._command = value;
        if (value) {
            this._dictionary.update('CMD', value._dictionary);
        } else {
            delete this._dictionary._map.CMD;
        }
        this._dictionary._updated = true;
    }
    /**
     * Validates the rich-media execute action before serialization.
     *
     * @private
     * @returns {void} Nothing.
     */
    _validate(): void {
        if (!this.annotation && !this._dictionary.has('TA')) {
            throw new Error(
                'PdfRichMediaExecuteAction.annotation expected valid PdfRichMediaAnnotation.'
            );
        }
        if (!this.command) {
            throw new Error(
                'PdfRichMediaExecuteAction.command expected valid PdfRichMediaCommand.'
            );
        }
        this.command._validate();
    }
    /**
     * Creates a rich-media execute action from an existing dictionary.
     *
     * @private
     * @param {_PdfDictionary} dictionary The action dictionary to load.
     * @returns {PdfRichMediaExecuteAction} The loaded rich-media execute action.
     */
    static _load(dictionary: _PdfDictionary): PdfRichMediaExecuteAction {
        const action: PdfRichMediaExecuteAction = new PdfRichMediaExecuteAction();
        action._dictionary = dictionary;
        return action;
    }
}
PdfAction._registerActionClass('RichMediaExecute', PdfRichMediaExecuteAction);

import { _PdfDictionary, _PdfName } from '../pdf-primitives';
/**
 * Represents a command executed by a rich-media annotation.
 *
 * ```typescript
 * // Load an existing PDF document containing a rich-media annotation
 * let document: PdfDocument = new PdfDocument(data, password);
 * let page: PdfPage = document.getPage(0);
 * // Get the existing rich-media annotation
 * let annotation: PdfRichMediaAnnotation = page.annotations.at(0) as PdfRichMediaAnnotation;
 * // Create a rich-media command
 * let command: PdfRichMediaCommand = new PdfRichMediaCommand('play');
 * command.arguments = [0];
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
export class PdfRichMediaCommand {
    /**
     * Stores the rich-media command dictionary.
     *
     * @private
     */
    _dictionary: _PdfDictionary;
    /**
     * Initializes a new instance of the `PdfRichMediaCommand` class.
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
     * @param {string} command The command executed by the rich-media instance.
     */
    public constructor(command: string) {
        this._dictionary = new _PdfDictionary();
        this._dictionary.update('Type', new _PdfName('RichMediaCommand'));
        this.command = command;
    }
    /**
     * Gets the command executed by the rich-media instance.
     *
     * ```typescript
     * // Load an existing PDF document containing a rich-media execute action
     * let document: PdfDocument = new PdfDocument(data, password);
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the rich-media execute action
     * let action: PdfRichMediaExecuteAction = field.actions.mouseUp as PdfRichMediaExecuteAction;
     * // Get the rich-media command
     * let command: string = action.command.command;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {string} The command executed by the rich-media instance.
     */
    public get command(): string {
        return this._dictionary.get('C');
    }
    /**
     * Sets the command executed by the rich-media instance.
     *
     * ```typescript
     * // Load an existing PDF document containing a rich-media execute action
     * let document: PdfDocument = new PdfDocument(data, password);
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the rich-media execute action
     * let action: PdfRichMediaExecuteAction = field.actions.mouseUp as PdfRichMediaExecuteAction;
     * // Set the rich-media command
     * action.command.command = 'pause';
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {string} value The command to execute.
     */
    public set command(value: string) {
        if (typeof value !== 'string' || value.trim().length === 0) {
            throw new Error(
                'PdfRichMediaCommand.command expected non-empty value.'
            );
        }
        this._dictionary.update('C', value);
        this._dictionary._updated = true;
    }
    /**
     * Gets the arguments passed to the rich-media command.
     *
     * ```typescript
     * // Load an existing PDF document containing a rich-media execute action
     * let document: PdfDocument = new PdfDocument(data, password);
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the rich-media execute action
     * let action: PdfRichMediaExecuteAction = field.actions.mouseUp as PdfRichMediaExecuteAction;
     * // Get the rich-media command arguments
     * let argumentsValue: Array<string | number | boolean> = action.command.arguments;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {Array<string | number | boolean>} The arguments passed to the command.
     */
    public get arguments(): Array<string | number | boolean> {
        const value: unknown = this._dictionary.get('A');
        if (Array.isArray(value)) {
            return value as Array<string | number | boolean>;
        }
        if (value !== undefined && value !== null) {
            return [value as string | number | boolean];
        }
        return [];
    }
    /**
     * Sets the arguments passed to the rich-media command.
     *
     * ```typescript
     * // Load an existing PDF document containing a rich-media execute action
     * let document: PdfDocument = new PdfDocument(data, password);
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the rich-media execute action
     * let action: PdfRichMediaExecuteAction = field.actions.mouseUp as PdfRichMediaExecuteAction;
     * // Set the rich-media command arguments
     * action.command.arguments = [0, true];
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {Array<string | number | boolean>} value The arguments to pass to the command.
     */
    public set arguments(value: Array<string | number | boolean>) {
        if (value && value.length > 0) {
            this._dictionary.update('A', value);
        } else {
            delete this._dictionary._map.A;
            this._dictionary._updated = true;
        }
        this._dictionary._updated = true;
    }
    /**
     * Creates a rich-media command from an existing dictionary.
     *
     * @private
     * @param {_PdfDictionary} dictionary The rich-media command dictionary.
     * @returns {PdfRichMediaCommand} The loaded rich-media command.
     */
    static _createFromDictionary(dictionary: _PdfDictionary): PdfRichMediaCommand {
        const command: PdfRichMediaCommand =
            Object.create(PdfRichMediaCommand.prototype) as PdfRichMediaCommand;
        command._dictionary = dictionary;
        return command;
    }
    /**
     * Validates the rich-media command before serialization.
     *
     * @private
     * @returns {void} Nothing.
     */
    _validate(): void {
        if (!this.command || this.command.trim().length === 0) {
            throw new Error(
                'PdfRichMediaCommand.command expected non-empty value.'
            );
        }
    }
}

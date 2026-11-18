import { _PdfBaseStream } from '../base-stream';
import { PdfAction } from '../pdf-action';
import { _PdfName, _PdfReference } from '../pdf-primitives';
import { PdfSound } from './pdf-sound';
/**
 * Represents an action that plays an embedded sound resource.
 *
 * ```typescript
 * // Create a new PDF document
 * let document: PdfDocument = new PdfDocument();
 * let page: PdfPage = document.addPage();
 * // Create and configure a sound resource
 * let sound: PdfSound = new PdfSound(soundData);
 * sound.bits = 16;
 * sound.channels = PdfSoundChannels.Stereo;
 * sound.encoding = PdfSoundEncoding.Signed;
 * sound.rate = 44100;
 * // Create a sound action
 * let action: PdfSoundAction = new PdfSoundAction(sound);
 * action.volume = 1;
 * // Create a button and assign the action
 * let field: PdfButtonField = new PdfButtonField(
 *     page, 'PlaySound', { x: 20, y: 20, width: 120, height: 30 }
 * );
 * field.text = 'Play sound';
 * field.actions.mouseUp = action;
 * document.form.add(field);
 * // Save and destroy the document
 * document.save('output.pdf');
 * document.destroy();
 * ```
 */
export class PdfSoundAction extends PdfAction {
    /**
     * Stores the sound resource associated with the action.
     *
     * @private
     */
    private _sound: PdfSound;
    /**
     * Stores the indirect reference of the sound stream.
     *
     * @private
     */
    private _soundReference: _PdfReference;
    /**
     * Initializes a new instance of the `PdfSoundAction` class.
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * let page: PdfPage = document.addPage();
     * // Create and configure a sound resource
     * let sound: PdfSound = new PdfSound(soundData);
     * sound.bits = 16;
     * sound.channels = PdfSoundChannels.Stereo;
     * sound.encoding = PdfSoundEncoding.Signed;
     * sound.rate = 44100;
     * // Create a sound action
     * let action: PdfSoundAction = new PdfSoundAction(sound);
     * // Create a button and assign the action
     * let field: PdfButtonField = new PdfButtonField(
     *     page, 'PlaySound', { x: 20, y: 20, width: 120, height: 30 }
     * );
     * field.text = 'Play sound';
     * field.actions.mouseUp = action;
     * document.form.add(field);
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {PdfSound} sound The optional sound resource to play.
     */
    public constructor(sound?: PdfSound) {
        super();
        this._initialize();
        this._dictionary.update('S', new _PdfName('Sound'));
        if (sound) {
            this.sound = sound;
        }
    }
    /**
     * Gets whether the sound is mixed with other sounds.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the sound button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the sound action
     * let action: PdfSoundAction = field.actions.mouseUp as PdfSoundAction;
     * // Get the sound mixing setting
     * let mix: boolean = action.mix;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {boolean} `true` if the sound is mixed with other sounds; otherwise, `false`.
     */
    public get mix(): boolean {
        return this._dictionary.get('Mix') || false;
    }
    /**
     * Sets whether the sound is mixed with other sounds.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the sound button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the sound action
     * let action: PdfSoundAction = field.actions.mouseUp as PdfSoundAction;
     * // Enable sound mixing
     * action.mix = true;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {boolean} value `true` to mix the sound with other sounds; otherwise, `false`.
     */
    public set mix(value: boolean) {
        this._dictionary.update('Mix', value);
        this._dictionary._updated = true;
    }
    /**
     * Gets whether the sound is repeated.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the sound button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the sound action
     * let action: PdfSoundAction = field.actions.mouseUp as PdfSoundAction;
     * // Get the sound repeat setting
     * let repeat: boolean = action.repeat;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {boolean} `true` if the sound is repeated; otherwise, `false`.
     */
    public get repeat(): boolean {
        return this._dictionary.get('Repeat') || false;
    }
    /**
     * Sets whether the sound is repeated.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the sound button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the sound action
     * let action: PdfSoundAction = field.actions.mouseUp as PdfSoundAction;
     * // Enable sound repetition
     * action.repeat = true;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {boolean} value `true` to repeat the sound; otherwise, `false`.
     */
    public set repeat(value: boolean) {
        this._dictionary.update('Repeat', value);
        this._dictionary._updated = true;
    }
    /**
     * Gets whether the sound is played synchronously.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the sound button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the sound action
     * let action: PdfSoundAction = field.actions.mouseUp as PdfSoundAction;
     * // Get the synchronous playback setting
     * let synchronous: boolean = action.synchronous;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {boolean} `true` if the sound is played synchronously; otherwise, `false`.
     */
    public get synchronous(): boolean {
        return this._dictionary.get('Synchronous') || false;
    }
    /**
     * Sets whether the sound is played synchronously.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the sound button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the sound action
     * let action: PdfSoundAction = field.actions.mouseUp as PdfSoundAction;
     * // Enable synchronous playback
     * action.synchronous = true;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {boolean} value `true` to play the sound synchronously; otherwise, `false`.
     */
    public set synchronous(value: boolean) {
        this._dictionary.update('Synchronous', value);
        this._dictionary._updated = true;
    }
    /**
     * Gets the playback volume of the sound.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the sound button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the sound action
     * let action: PdfSoundAction = field.actions.mouseUp as PdfSoundAction;
     * // Get the sound volume
     * let volume: number = action.volume;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {number} The playback volume from `-1` to `1`.
     */
    public get volume(): number {
        const volume: unknown = this._dictionary.get('Volume');
        return typeof volume === 'number' ? volume : 1;
    }
    /**
     * Sets the playback volume of the sound.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the sound button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the sound action
     * let action: PdfSoundAction = field.actions.mouseUp as PdfSoundAction;
     * // Set the sound volume
     * action.volume = 0.8;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {number} value The playback volume from `-1` to `1`.
     */
    public set volume(value: number) {
        if (typeof value !== 'number' || isNaN(value) || value < -1 || value > 1) {
            throw new Error(
                `PdfSoundAction.volume expected a value between -1 and 1. Actual value: ${value}`
            );
        }
        this._dictionary.update('Volume', value);
        this._dictionary._updated = true;
    }
    /**
     * Gets the sound resource associated with the action.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the sound button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the sound action and sound resource
     * let action: PdfSoundAction = field.actions.mouseUp as PdfSoundAction;
     * let sound: PdfSound = action.sound;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {PdfSound} The sound resource associated with the action.
     */
    public get sound(): PdfSound {
        if (!this._sound) {
            const rawValue: unknown = this._dictionary.getRaw('Sound');
            if (rawValue instanceof _PdfReference) {
                this._soundReference = rawValue;
            }
            const value: unknown = this._dictionary.get('Sound');
            if (value instanceof _PdfBaseStream) {
                this._sound = PdfSound._createFromStream(value);
            }
        }
        return this._sound;
    }
    /**
     * Sets the sound resource associated with the action.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the sound button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the sound action
     * let action: PdfSoundAction = field.actions.mouseUp as PdfSoundAction;
     * // Create and configure a sound resource
     * let sound: PdfSound = new PdfSound(updatedSoundData);
     * sound.bits = 16;
     * sound.channels = PdfSoundChannels.Stereo;
     * sound.encoding = PdfSoundEncoding.Signed;
     * sound.rate = 44100;
     * // Set the sound resource
     * action.sound = sound;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {PdfSound} value The sound resource to associate with the action.
     */
    public set sound(value: PdfSound) {
        this._sound = value;
        this._soundReference = undefined;
        if (this._dictionary.has('Sound')) {
            delete this._dictionary._map.Sound;
        }
        this._dictionary._updated = true;
    }
    /**
     * Registers the sound stream before serialization.
     *
     * @private
     * @returns {void} Nothing.
     */
    _beginSave(): void {
        this._validate();
        if (!this._soundReference && this._dictionary._crossReference) {
            this._soundReference = this._dictionary._crossReference._getNextReference();
            this._dictionary._crossReference._cacheMap.set(this._soundReference, this.sound._stream);
        }
        if (this._soundReference) {
            this._dictionary.update('Sound', this._soundReference);
        }
    }
    /**
     * Validates the sound action before serialization.
     *
     * @private
     * @returns {void} Nothing.
     */
    _validate(): void {
        if (!this.sound) {
            throw new Error(
                'PdfSoundAction.sound expected valid PdfSound. Actual value: undefined.'
            );
        }
        this.sound._validate();
    }
}
PdfAction._registerActionClass('Sound', PdfSoundAction);

import { _PdfBaseStream, _PdfStream } from '../base-stream';
import { PdfSoundChannels, PdfSoundEncoding } from '../enumerator';
import { _PdfDictionary, _PdfName } from '../pdf-primitives';
/**
 * Represents an embedded sound resource in a PDF document.
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
 */
export class PdfSound {
    /**
     * Stores the embedded sound stream.
     *
     * @private
     */
    _stream: _PdfBaseStream;
    /**
     * Initializes a new instance of the `PdfSound` class.
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
     * @param {Uint8Array} data The optional audio data to embed.
     */
    public constructor(data?: Uint8Array) {
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('Type', new _PdfName('Sound'));
        this._stream = new _PdfStream(data || new Uint8Array(0), dictionary);
    }
    /**
     * Creates a sound resource from an existing stream.
     *
     * @private
     * @param {_PdfBaseStream} stream The existing sound stream.
     * @returns {PdfSound} The loaded sound resource.
     */
    static _createFromStream(stream: _PdfBaseStream): PdfSound {
        const sound: PdfSound = Object.create(PdfSound.prototype) as PdfSound;
        sound._stream = stream;
        return sound;
    }
    /**
     * Gets the embedded audio data.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the sound button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the sound action and audio data
     * let action: PdfSoundAction = field.actions.mouseUp as PdfSoundAction;
     * let soundData: Uint8Array = action.sound.data;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {Uint8Array} The embedded audio data.
     */
    public get data(): Uint8Array {
        if (this._stream instanceof _PdfStream) {
            const position: number = this._stream.position;
            this._stream.position = this._stream.start;
            const data: Uint8Array = this._stream.getBytes();
            this._stream.position = position;
            return data;
        }
        return this._stream.getBytes();
    }
    /**
     * Sets the embedded audio data.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the sound button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the sound action
     * let action: PdfSoundAction = field.actions.mouseUp as PdfSoundAction;
     * // Set the embedded audio data
     * action.sound.data = updatedSoundData;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {Uint8Array} value The audio data to embed.
     */
    public set data(value: Uint8Array) {
        if (!(value instanceof Uint8Array)) {
            throw new Error(
                'PdfSound.data expected valid Uint8Array. Actual value: invalid data.'
            );
        }
        if (this._stream instanceof _PdfStream) {
            this._stream._writeBytes(Array.from(value));
        }
    }
    /**
     * Gets the number of bits per audio sample.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the sound button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the sound action and bits per sample
     * let action: PdfSoundAction = field.actions.mouseUp as PdfSoundAction;
     * let bits: number = action.sound.bits;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {number} The number of bits per audio sample.
     */
    public get bits(): number {
        return this._stream.dictionary.get('B');
    }
    /**
     * Sets the number of bits per audio sample.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the sound button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the sound action
     * let action: PdfSoundAction = field.actions.mouseUp as PdfSoundAction;
     * // Set the number of bits per sample
     * action.sound.bits = 16;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {number} value The number of bits per audio sample.
     */
    public set bits(value: number) {
        this._stream.dictionary.update('B', value);
    }
    /**
     * Gets the channel layout of the sound resource.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the sound button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the sound action and channel layout
     * let action: PdfSoundAction = field.actions.mouseUp as PdfSoundAction;
     * let channels: PdfSoundChannels = action.sound.channels;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {PdfSoundChannels} The channel layout of the sound resource.
     */
    public get channels(): PdfSoundChannels {
        const value: number = this._stream.dictionary.get('C');
        return value === 2 ? PdfSoundChannels.Stereo : PdfSoundChannels.Mono;
    }
    /**
     * Sets the channel layout of the sound resource.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the sound button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the sound action
     * let action: PdfSoundAction = field.actions.mouseUp as PdfSoundAction;
     * // Set the channel layout
     * action.sound.channels = PdfSoundChannels.Stereo;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {PdfSoundChannels} value The channel layout of the sound resource.
     */
    public set channels(value: PdfSoundChannels) {
        if (value !== PdfSoundChannels.Mono && value !== PdfSoundChannels.Stereo) {
            throw new Error(
                `PdfSound.channels expected valid PdfSoundChannels. Actual value: ${value}`
            );
        }
        this._stream.dictionary.update(
            'C',
            value === PdfSoundChannels.Stereo ? 2 : 1
        );
    }
    /**
     * Gets the audio encoding of the sound resource.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the sound button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the sound action and audio encoding
     * let action: PdfSoundAction = field.actions.mouseUp as PdfSoundAction;
     * let encoding: PdfSoundEncoding = action.sound.encoding;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {PdfSoundEncoding} The audio encoding of the sound resource.
     */
    public get encoding(): PdfSoundEncoding {
        const value: unknown = this._stream.dictionary.get('E');
        const name: string = value instanceof _PdfName ? value.name : '';
        switch (name) {
        case 'ALaw':
            return PdfSoundEncoding.ALaw;
        case 'muLaw':
            return PdfSoundEncoding.MuLaw;
        case 'Signed':
            return PdfSoundEncoding.Signed;
        default:
            return PdfSoundEncoding.Raw;
        }
    }
    /**
     * Sets the audio encoding of the sound resource.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the sound button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the sound action
     * let action: PdfSoundAction = field.actions.mouseUp as PdfSoundAction;
     * // Set the audio encoding
     * action.sound.encoding = PdfSoundEncoding.Signed;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {PdfSoundEncoding} value The audio encoding of the sound resource.
     */
    public set encoding(value: PdfSoundEncoding) {
        let name: string;
        switch (value) {
        case PdfSoundEncoding.ALaw:
            name = 'ALaw';
            break;
        case PdfSoundEncoding.MuLaw:
            name = 'muLaw';
            break;
        case PdfSoundEncoding.Raw:
            name = 'Raw';
            break;
        case PdfSoundEncoding.Signed:
            name = 'Signed';
            break;
        default:
            throw new Error(
                `PdfSound.encoding expected valid PdfSoundEncoding. Actual value: ${value}`
            );
        }
        this._stream.dictionary.update('E', new _PdfName(name));
    }
    /**
     * Gets the sampling rate of the sound resource.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the sound button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the sound action and sampling rate
     * let action: PdfSoundAction = field.actions.mouseUp as PdfSoundAction;
     * let rate: number = action.sound.rate;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {number} The number of audio samples per second.
     */
    public get rate(): number {
        return this._stream.dictionary.get('R');
    }
    /**
     * Sets the sampling rate of the sound resource.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the sound button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the sound action
     * let action: PdfSoundAction = field.actions.mouseUp as PdfSoundAction;
     * // Set the sampling rate
     * action.sound.rate = 44100;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {number} value The number of audio samples per second.
     */
    public set rate(value: number) {
        this._stream.dictionary.update('R', value);
    }
    /**
     * Validates the sound resource before serialization.
     *
     * @private
     * @returns {void} Nothing.
     */
    _validate(): void {
        if (!this._stream || this._stream.length === 0) {
            throw new Error(
                'PdfSound.data expected non-empty audio data. Actual value: empty data.'
            );
        }
        if (!Number.isFinite(this.rate) || this.rate <= 0) {
            throw new Error(
                `PdfSound.rate expected value greater than 0. Actual value: ${this.rate}`
            );
        }
        if (!Number.isInteger(this.bits) || this.bits <= 0) {
            throw new Error(
                `PdfSound.bits expected a positive integer. Actual value: ${this.bits}`
            );
        }
        const channels: number = this._stream.dictionary.get('C');
        if (channels !== 1 && channels !== 2) {
            throw new Error(
                `PdfSound.channels expected 1 or 2 channels. Actual value: ${channels}`
            );
        }
        const encoding: unknown = this._stream.dictionary.get('E');
        if (!(encoding instanceof _PdfName)) {
            throw new Error(
                'PdfSound.encoding expected valid PdfSoundEncoding. Actual value: undefined'
            );
        }
    }
}

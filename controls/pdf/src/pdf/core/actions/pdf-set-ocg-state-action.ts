import { PdfLayerStateOperation } from '../enumerator';
import { PdfLayer } from '../layers/layer';
import { PdfLayerCollection } from '../layers/layer-collection';
import { PdfAction } from '../pdf-action';
import { _PdfCrossReference } from '../pdf-cross-reference';
import { PdfDocument } from '../pdf-document';
import { _PdfDictionary, _PdfName, _PdfReference } from '../pdf-primitives';
import { PdfLayerState } from './pdf-layer-state';
/**
 * Represents an action that changes the visibility state of optional-content layers.
 *
 * ```typescript
 * // Create a new PDF document
 * let document: PdfDocument = new PdfDocument();
 * let page: PdfPage = document.addPage();
 * // Create layers and their states
 * let firstLayer: PdfLayer = document.layers.add('First Layer', true);
 * let secondLayer: PdfLayer = document.layers.add('Second Layer', false);
 * let states: PdfLayerState[] = [
 *     new PdfLayerState(PdfLayerStateOperation.Off, firstLayer),
 *     new PdfLayerState(PdfLayerStateOperation.On, secondLayer)
 * ];
 * // Create a layer-state action
 * let action: PdfSetOCGStateAction = new PdfSetOCGStateAction(states, true);
 * // Create a button and assign the action
 * let field: PdfButtonField = new PdfButtonField(
 *     page, 'LayerState', { x: 20, y: 20, width: 120, height: 30 }
 * );
 * field.text = 'Change layers';
 * field.actions.mouseUp = action;
 * document.form.add(field);
 * // Save and destroy the document
 * document.save('output.pdf');
 * document.destroy();
 * ```
 */
export class PdfSetOCGStateAction extends PdfAction {
    /**
     * Stores the layer states associated with the action.
     *
     * @private
     */
    private _state: PdfLayerState[];
    /**
     * Initializes a new instance of the `PdfSetOCGStateAction` class.
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * let page: PdfPage = document.addPage();
     * // Create layers and their states
     * let firstLayer: PdfLayer = document.layers.add('First Layer', true);
     * let secondLayer: PdfLayer = document.layers.add('Second Layer', false);
     * let states: PdfLayerState[] = [
     *     new PdfLayerState(PdfLayerStateOperation.Off, firstLayer),
     *     new PdfLayerState(PdfLayerStateOperation.On, secondLayer)
     * ];
     * // Create a layer-state action
     * let action: PdfSetOCGStateAction = new PdfSetOCGStateAction(states, true);
     * // Create a button and assign the action
     * let field: PdfButtonField = new PdfButtonField(
     *     page, 'LayerState', { x: 20, y: 20, width: 120, height: 30 }
     * );
     * field.text = 'Change layers';
     * field.actions.mouseUp = action;
     * document.form.add(field);
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {PdfLayerState[]} state The optional layer states associated with the action.
     * @param {boolean} preserveRadioButtons Whether to preserve the radio-button relationships between layers.
     */
    public constructor(state?: PdfLayerState[], preserveRadioButtons?: boolean) {
        super();
        this._initialize();
        this._dictionary.update('S', new _PdfName('SetOCGState'));
        if (state) {
            this.state = state;
        }
        if (preserveRadioButtons !== undefined) {
            this.preserveRadioButtons = preserveRadioButtons;
        }
    }
    /**
     * Gets the layer states associated with the action.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the layer-state button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the layer-state action
     * let action: PdfSetOCGStateAction = field.actions.mouseUp as PdfSetOCGStateAction;
     * // Get the layer states
     * let states: PdfLayerState[] = action.state;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {PdfLayerState[]} The layer states associated with the action.
     */
    public get state(): PdfLayerState[] {
        if (!this._state) {
            this._state = [];
            const stateArray: any[] = this._dictionary.getArray('State'); // eslint-disable-line
            const crossReference: _PdfCrossReference = this._dictionary._crossReference;
            const document: PdfDocument = crossReference ? crossReference._document : undefined;
            const layers: PdfLayerCollection = document ? document.layers : undefined;
            let operation: PdfLayerStateOperation = PdfLayerStateOperation.On;
            if (Array.isArray(stateArray) && layers) {
                stateArray.forEach((item: any): void => { // eslint-disable-line
                    if (item instanceof _PdfName) {
                        operation = this._getLayerStateOperation(item);
                    } else {
                        const layer: PdfLayer = this._getLayer(item, layers);
                        if (layer) {
                            this._state.push(new PdfLayerState(operation, layer));
                        }
                    }
                });
            }
        }
        return this._state;
    }
    /**
     * Sets the layer states associated with the action.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the layer-state button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the layer-state action
     * let action: PdfSetOCGStateAction = field.actions.mouseUp as PdfSetOCGStateAction;
     * // Get the document layers
     * let firstLayer: PdfLayer = document.layers.at(0);
     * let secondLayer: PdfLayer = document.layers.at(1);
     * // Set the layer states
     * action.state = [
     *     new PdfLayerState(PdfLayerStateOperation.Off, firstLayer),
     *     new PdfLayerState(PdfLayerStateOperation.Toggle, secondLayer)
     * ];
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {PdfLayerState[]} value The layer states to associate with the action.
     */
    public set state(value: PdfLayerState[]) {
        this._state = value;
        if (value && value.length > 0) {
            const stateArray: any[] = []; // eslint-disable-line
            value.forEach((item: PdfLayerState): void => {
                let operationName: string;
                if (item.operation === PdfLayerStateOperation.On) {
                    operationName = 'ON';
                } else if (item.operation === PdfLayerStateOperation.Off) {
                    operationName = 'OFF';
                } else {
                    operationName = 'Toggle';
                }
                stateArray.push(new _PdfName(operationName));
                if (item.layer && item.layer._referenceHolder) {
                    stateArray.push(item.layer._referenceHolder);
                }
            });
            this._dictionary.update('State', stateArray);
        } else {
            delete this._dictionary._map.State;
        }
        this._dictionary._updated = true;
    }
    /**
     * Gets whether the radio-button relationships between layers are preserved.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the layer-state button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the layer-state action
     * let action: PdfSetOCGStateAction = field.actions.mouseUp as PdfSetOCGStateAction;
     * // Get the radio-button preservation setting
     * let preserveRadioButtons: boolean = action.preserveRadioButtons;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {boolean} `true` if radio-button relationships are preserved; otherwise, `false`.
     */
    public get preserveRadioButtons(): boolean {
        return this._dictionary.get('PreserveRB') || false;
    }
    /**
     * Sets whether the radio-button relationships between layers are preserved.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the layer-state button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the layer-state action
     * let action: PdfSetOCGStateAction = field.actions.mouseUp as PdfSetOCGStateAction;
     * // Preserve the radio-button relationships between layers
     * action.preserveRadioButtons = true;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {boolean} value `true` to preserve radio-button relationships; otherwise, `false`.
     */
    public set preserveRadioButtons(value: boolean) {
        this._dictionary.update('PreserveRB', value);
        this._dictionary._updated = true;
    }
    /**
     * Gets the layer-state operation from the specified PDF name.
     *
     * @private
     * @param {_PdfName} value The PDF name representing the layer-state operation.
     * @returns {PdfLayerStateOperation} The resolved layer-state operation.
     */
    private _getLayerStateOperation(value: _PdfName): PdfLayerStateOperation {
        if (value.name === 'OFF') {
            return PdfLayerStateOperation.Off;
        }
        if (value.name === 'Toggle') {
            return PdfLayerStateOperation.Toggle;
        }
        return PdfLayerStateOperation.On;
    }
    /**
     * Resolves a layer from its reference or dictionary.
     *
     * @private
     * @param {any} value The layer reference or dictionary.
     * @param {PdfLayerCollection} layers The document layer collection.
     * @returns {PdfLayer} The resolved layer, or `undefined` when no layer matches.
     */
    private _getLayer(value: any, layers: PdfLayerCollection): PdfLayer { // eslint-disable-line
        for (let i: number = 0; i < layers.count; i++) {
            const layer: PdfLayer = layers.at(i);
            if (value instanceof _PdfReference && layer._referenceHolder &&
                layer._referenceHolder.objectNumber === value.objectNumber &&
                layer._referenceHolder.generationNumber === value.generationNumber) {
                return layer;
            }
            if (value instanceof _PdfDictionary && layer._dictionary === value) {
                return layer;
            }
        }
        return undefined;
    }
    /**
     * Validates the layer-state action before serialization.
     *
     * @private
     * @returns {void} Nothing.
     */
    _validate(): void {
        if (!this.state || this.state.length === 0) {
            throw new Error(
                'PdfSetOCGStateAction.state expected valid layer states.'
            );
        }
        this.state.forEach((item: PdfLayerState): void => {
            item._validate();
        });
    }
}
PdfAction._registerActionClass('SetOCGState', PdfSetOCGStateAction);

import { PdfLayerStateOperation } from '../enumerator';
import { PdfLayer } from '../layers/layer';
/**
 * Represents an operation applied to a layer by a layer-state action.
 *
 * ```typescript
 * // Create a new PDF document
 * let document: PdfDocument = new PdfDocument();
 * let page: PdfPage = document.addPage();
 * // Create a layer and its state
 * let layer: PdfLayer = document.layers.add('Content Layer', true);
 * let state: PdfLayerState = new PdfLayerState(PdfLayerStateOperation.Off, layer);
 * // Create a layer-state action
 * let action: PdfSetOCGStateAction = new PdfSetOCGStateAction([state], true);
 * // Create a button and assign the action
 * let field: PdfButtonField = new PdfButtonField(
 *     page, 'LayerState', { x: 20, y: 20, width: 120, height: 30 }
 * );
 * field.text = 'Change layer';
 * field.actions.mouseUp = action;
 * document.form.add(field);
 * // Save and destroy the document
 * document.save('output.pdf');
 * document.destroy();
 * ```
 */
export class PdfLayerState {
    /**
     * Stores the operation applied to the layer.
     *
     * @private
     */
    private _operation: PdfLayerStateOperation;
    /**
     * Stores the layer affected by the operation.
     *
     * @private
     */
    private _layer: PdfLayer;
    /**
     * Initializes a new instance of the `PdfLayerState` class.
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * let page: PdfPage = document.addPage();
     * // Create a layer and its state
     * let layer: PdfLayer = document.layers.add('Content Layer', true);
     * let state: PdfLayerState = new PdfLayerState(PdfLayerStateOperation.Off, layer);
     * // Create a layer-state action
     * let action: PdfSetOCGStateAction = new PdfSetOCGStateAction([state], true);
     * // Create a button and assign the action
     * let field: PdfButtonField = new PdfButtonField(
     *     page, 'LayerState', { x: 20, y: 20, width: 120, height: 30 }
     * );
     * field.text = 'Change layer';
     * field.actions.mouseUp = action;
     * document.form.add(field);
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {PdfLayerStateOperation} operation The operation applied to the layer.
     * @param {PdfLayer} layer The layer affected by the operation.
     */
    public constructor(operation: PdfLayerStateOperation, layer: PdfLayer) {
        this._operation = operation;
        this._layer = layer;
    }
    /**
     * Gets the operation applied to the layer.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the layer-state button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the layer-state action and its first state
     * let action: PdfSetOCGStateAction = field.actions.mouseUp as PdfSetOCGStateAction;
     * let state: PdfLayerState = action.state[0];
     * // Get the operation applied to the layer
     * let operation: PdfLayerStateOperation = state.operation;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {PdfLayerStateOperation} The operation applied to the layer.
     */
    public get operation(): PdfLayerStateOperation {
        return this._operation;
    }
    /**
     * Sets the operation applied to the layer.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the layer-state button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the layer-state action and its first state
     * let action: PdfSetOCGStateAction = field.actions.mouseUp as PdfSetOCGStateAction;
     * let state: PdfLayerState = action.state[0];
     * // Set the operation applied to the layer
     * state.operation = PdfLayerStateOperation.Toggle;
     * action.state = action.state;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {PdfLayerStateOperation} value The operation to apply to the layer.
     */
    public set operation(value: PdfLayerStateOperation) {
        this._operation = value;
    }
    /**
     * Gets the layer affected by the operation.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the layer-state button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the layer-state action and its first state
     * let action: PdfSetOCGStateAction = field.actions.mouseUp as PdfSetOCGStateAction;
     * let state: PdfLayerState = action.state[0];
     * // Get the layer affected by the operation
     * let layer: PdfLayer = state.layer;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {PdfLayer} The layer affected by the operation.
     */
    public get layer(): PdfLayer {
        return this._layer;
    }
    /**
     * Sets the layer affected by the operation.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the layer-state button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the layer-state action and its first state
     * let action: PdfSetOCGStateAction = field.actions.mouseUp as PdfSetOCGStateAction;
     * let state: PdfLayerState = action.state[0];
     * // Get another layer from the document
     * let layer: PdfLayer = document.layers.at(1);
     * // Set the layer affected by the operation
     * state.layer = layer;
     * action.state = action.state;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {PdfLayer} value The layer to associate with the operation.
     */
    public set layer(value: PdfLayer) {
        this._layer = value;
    }
    /**
     * Validates the layer state before serialization.
     *
     * @private
     * @returns {void} Nothing.
     */
    _validate(): void {
        if (!this._layer) {
            throw new Error('PdfLayerState.layer expected valid PdfLayer.');
        }
    }
}

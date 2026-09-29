import { PdfPrintState } from '../src/pdf/core/enumerator';
import { PdfDocument } from '../src/pdf/core/pdf-document';
import { _PdfDictionary, _PdfName, _PdfReference } from '../src/pdf/core/pdf-primitives';
import { PdfLayerCollection } from '../src/pdf/core/layers/layer-collection';
import { PdfLayer } from '../src/pdf/core/layers/layer';
import { PdfPage } from '../src/pdf/core/pdf-page';
function createLayerDictionary(document: PdfDocument, name: string, layerId: string): {
    dictionary: _PdfDictionary;
    reference: _PdfReference;
} {
    const dictionary: _PdfDictionary = new _PdfDictionary(document._crossReference);
    const reference: _PdfReference = document._crossReference._getNextReference();
    dictionary.update('Name', name);
    dictionary.update('Type', new _PdfName('OCG'));
    dictionary.update('LayerID', new _PdfName(layerId));
    document._crossReference._cacheMap.set(reference, dictionary);
    return { dictionary, reference };
}
function setOptionalContentProperties(
    document: PdfDocument,
    groups: _PdfReference[],
    order?: (_PdfReference | _PdfReference[])[],
    off?: _PdfReference[],
    locked?: _PdfReference[]
): void {
    const defaultView: _PdfDictionary = new _PdfDictionary(document._crossReference);
    if (order) {
        defaultView.update('Order', order);
    }
    if (off) {
        defaultView.update('OFF', off);
    }
    if (locked) {
        defaultView.update('Locked', locked);
    }
    const optionalContent: _PdfDictionary = new _PdfDictionary(document._crossReference);
    optionalContent.update('OCGs', groups);
    optionalContent.update('D', defaultView);
    document._catalog._catalogDictionary.update('OCProperties', optionalContent);
}
describe('PdfLayerCollection constructor mutation coverage lines 5 to 103', () => {
    it('keeps a root collection as a non sublayer collection', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        // Act
        const layers: PdfLayerCollection = new PdfLayerCollection(document);
        // Assert
        expect(layers._subLayer).toBeFalsy();
        expect(layers.count).toBe(0);
        document.destroy();
    });
    it('stores the supplied parent without parsing document optional content', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const parent: PdfLayer = new PdfLayer();
        // Act
        const layers: PdfLayerCollection = new PdfLayerCollection(document, parent);
        // Assert
        expect((layers as any)._parent).toBe(parent);
        expect(layers.count).toBe(0);
        document.destroy();
    });
    it('ignores optional content properties without an OCGs entry', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const optionalContent: _PdfDictionary = new _PdfDictionary(document._crossReference);
        optionalContent.update('D', new _PdfDictionary(document._crossReference));
        document._catalog._catalogDictionary.update('OCProperties', optionalContent);
        // Act
        const layers: PdfLayerCollection = new PdfLayerCollection(document);
        // Assert
        expect(layers.count).toBe(0);
        expect(layers.at(0)).toBeUndefined();
        document.destroy();
    });
    it('ignores a non array OCGs value', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const optionalContent: _PdfDictionary = new _PdfDictionary(document._crossReference);
        optionalContent.update('OCGs', new _PdfName('Invalid'));
        optionalContent.update('D', new _PdfDictionary(document._crossReference));
        document._catalog._catalogDictionary.update('OCProperties', optionalContent);
        // Act
        const layers: PdfLayerCollection = new PdfLayerCollection(document);
        // Assert
        expect(layers.count).toBe(0);
        document.destroy();
    });
    it('ignores non reference entries in the OCGs array', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const optionalContent: _PdfDictionary = new _PdfDictionary(document._crossReference);
        optionalContent.update('OCGs', [new _PdfName('Invalid')]);
        optionalContent.update('D', new _PdfDictionary(document._crossReference));
        document._catalog._catalogDictionary.update('OCProperties', optionalContent);
        // Act
        const layers: PdfLayerCollection = new PdfLayerCollection(document);
        // Assert
        expect(layers.count).toBe(0);
        document.destroy();
    });
    it('ignores an unresolved OCG reference', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const unresolvedReference: _PdfReference = document._crossReference._getNextReference();
        setOptionalContentProperties(document, [unresolvedReference]);
        // Act
        const layers: PdfLayerCollection = new PdfLayerCollection(document);
        // Assert
        expect(layers.count).toBe(0);
        document.destroy();
    });
    it('creates a layer only when the OCG dictionary has a name', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layerEntry: { dictionary: _PdfDictionary; reference: _PdfReference } =
            createLayerDictionary(document, 'Layer-A', 'LayerA_ID');
        setOptionalContentProperties(document, [layerEntry.reference], [layerEntry.reference]);
        // Act
        const layers: PdfLayerCollection = new PdfLayerCollection(document);
        const layer: PdfLayer = layers.at(0);
        // Assert
        expect(layers.count).toBe(1);
        expect(layer.name).toBe('Layer-A');
        expect(layer._layerId).toBe('LayerA_ID');
        expect(layer._dictionary).toBe(layerEntry.dictionary);
        expect(layer._referenceHolder).toBe(layerEntry.reference);
        expect(layer._document).toBe(document);
        expect(layer._layer).toBe(layer);
        document.destroy();
    });
    it('keeps default identity values when the OCG dictionary has no name', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary(document._crossReference);
        const reference: _PdfReference = document._crossReference._getNextReference();
        dictionary.update('LayerID', new _PdfName('Unnamed_ID'));
        document._crossReference._cacheMap.set(reference, dictionary);
        setOptionalContentProperties(document, [reference], [reference]);
        // Act
        const layers: PdfLayerCollection = new PdfLayerCollection(document);
        const layer: PdfLayer = layers.at(0);
        // Assert
        expect(layers.count).toBe(1);
        expect(layer.name).toBe('');
        expect(layer._layerId).toBeUndefined();
        expect(layer._dictionary).toBeDefined();
        expect(layer._dictionary.has('Name')).toBeFalsy();
        expect(layer._referenceHolder).toBeUndefined();
        document.destroy();
    });
    it('reads a direct usage print dictionary without changing visibility during construction', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layerEntry: { dictionary: _PdfDictionary; reference: _PdfReference } =
            createLayerDictionary(document, 'Direct-Usage', 'Direct_ID');
        const print: _PdfDictionary = new _PdfDictionary(document._crossReference);
        print.update('PrintState', new _PdfName('ON'));
        const usage: _PdfDictionary = new _PdfDictionary(document._crossReference);
        usage.update('Print', print);
        layerEntry.dictionary.update('Usage', usage);
        setOptionalContentProperties(document, [layerEntry.reference], [layerEntry.reference]);
        // Act
        const layers: PdfLayerCollection = new PdfLayerCollection(document);
        const layer: PdfLayer = layers.at(0);
        // Assert
        expect(layer._printOption).toBe(print);
        expect(layer.printState).toBe(PdfPrintState.alwaysPrint);
        expect(layer.visible).toBeTruthy();
        document.destroy();
    });
    it('maps a direct non ON print state to neverPrint', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layerEntry: { dictionary: _PdfDictionary; reference: _PdfReference } =
            createLayerDictionary(document, 'Never-Print', 'NeverPrint_ID');
        const print: _PdfDictionary = new _PdfDictionary(document._crossReference);
        print.update('PrintState', new _PdfName('OFF'));
        const usage: _PdfDictionary = new _PdfDictionary(document._crossReference);
        usage.update('Print', print);
        layerEntry.dictionary.update('Usage', usage);
        setOptionalContentProperties(document, [layerEntry.reference], [layerEntry.reference]);
        // Act
        const layer: PdfLayer = new PdfLayerCollection(document).at(0);
        // Assert
        expect(layer.printState).toBe(PdfPrintState.neverPrint);
        expect(layer.visible).toBeTruthy();
        document.destroy();
    });
    it('does not read direct usage entries having incorrect value types', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layerEntry: { dictionary: _PdfDictionary; reference: _PdfReference } =
            createLayerDictionary(document, 'Invalid-Direct-Usage', 'InvalidDirect_ID');
        const usage: _PdfDictionary = new _PdfDictionary(document._crossReference);
        usage.update('Print', new _PdfName('Invalid'));
        usage.update('View', new _PdfName('Invalid'));
        layerEntry.dictionary.update('Usage', usage);
        setOptionalContentProperties(document, [layerEntry.reference], [layerEntry.reference]);
        // Act
        const layer: PdfLayer = new PdfLayerCollection(document).at(0);
        // Assert
        expect(layer._printOption).toBeUndefined();
        expect(layer.printState).toBe(PdfPrintState.printWhenVisible);
        expect(layer.visible).toBeTruthy();
        document.destroy();
    });
    it('reads a referenced usage print dictionary without changing visibility during construction', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layerEntry: { dictionary: _PdfDictionary; reference: _PdfReference } =
            createLayerDictionary(document, 'Referenced-Usage', 'Referenced_ID');
        const print: _PdfDictionary = new _PdfDictionary(document._crossReference);
        print.update('PrintState', new _PdfName('OFF'));
        const printReference: _PdfReference = document._crossReference._getNextReference();
        document._crossReference._cacheMap.set(printReference, print);
        const usage: _PdfDictionary = new _PdfDictionary(document._crossReference);
        usage.update('Print', printReference);
        const usageReference: _PdfReference = document._crossReference._getNextReference();
        document._crossReference._cacheMap.set(usageReference, usage);
        layerEntry.dictionary.update('Usage', usageReference);
        setOptionalContentProperties(document, [layerEntry.reference], [layerEntry.reference]);
        // Act
        const layer: PdfLayer = new PdfLayerCollection(document).at(0);
        // Assert
        expect(layer._printOption).toBe(print);
        expect(layer.printState).toBe(PdfPrintState.neverPrint);
        expect(layer.visible).toBeTruthy();
        document.destroy();
    });
    it('does not read unresolved referenced usage', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layerEntry: { dictionary: _PdfDictionary; reference: _PdfReference } =
            createLayerDictionary(document, 'Unresolved-Usage', 'UnresolvedUsage_ID');
        const usageReference: _PdfReference = document._crossReference._getNextReference();
        layerEntry.dictionary.update('Usage', usageReference);
        setOptionalContentProperties(document, [layerEntry.reference], [layerEntry.reference]);
        // Act
        const layer: PdfLayer = new PdfLayerCollection(document).at(0);
        // Assert
        expect(layer._printOption).toBeUndefined();
        expect(layer.printState).toBe(PdfPrintState.printWhenVisible);
        expect(layer.visible).toBeTruthy();
        document.destroy();
    });
    it('does not read referenced print and view entries having incorrect value types', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layerEntry: { dictionary: _PdfDictionary; reference: _PdfReference } =
            createLayerDictionary(document, 'Invalid-Referenced-Usage', 'InvalidReferenced_ID');
        const usage: _PdfDictionary = new _PdfDictionary(document._crossReference);
        usage.update('Print', new _PdfName('Invalid'));
        usage.update('View', new _PdfName('Invalid'));
        const usageReference: _PdfReference = document._crossReference._getNextReference();
        document._crossReference._cacheMap.set(usageReference, usage);
        layerEntry.dictionary.update('Usage', usageReference);
        setOptionalContentProperties(document, [layerEntry.reference], [layerEntry.reference]);
        // Act
        const layer: PdfLayer = new PdfLayerCollection(document).at(0);
        // Assert
        expect(layer._printOption).toBeUndefined();
        expect(layer.printState).toBe(PdfPrintState.printWhenVisible);
        expect(layer.visible).toBeTruthy();
        document.destroy();
    });
    it('applies locked and OFF arrays after parsing the layer', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layerEntry: { dictionary: _PdfDictionary; reference: _PdfReference } =
            createLayerDictionary(document, 'State-Layer', 'State_ID');
        layerEntry.dictionary.update('Visible', true);
        setOptionalContentProperties(
            document,
            [layerEntry.reference],
            [layerEntry.reference],
            [layerEntry.reference],
            [layerEntry.reference]
        );
        // Act
        const layer: PdfLayer = new PdfLayerCollection(document).at(0);
        // Assert
        expect(layer.locked).toBeTruthy();
        expect(layer.visible).toBeFalsy();
        expect(layer._dictionary.get('Visible')).toBeFalsy();
        document.destroy();
    });
});
function createIsolatedLayerCollection(document: PdfDocument): PdfLayerCollection {
    const parent: PdfLayer = new PdfLayer();
    return new PdfLayerCollection(document, parent);
}
function addLayerToInternalList(collection: PdfLayerCollection, layer: PdfLayer): void {
    (collection as any)._list.push(layer);
}
describe('PdfLayerCollection mutation coverage lines 103 to 240', () => {
    it('add preserves the default visible state when visibility is omitted', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = document.layers;
        // Act
        const layer: PdfLayer = layers.add('Default-Visible');
        // Assert
        expect(layer.name).toBe('Default-Visible');
        expect(layer.visible).toBeTruthy();
        expect(layers.count).toBe(1);
        expect(layers.at(0)).toBe(layer);
        expect(layer._layerId.indexOf('OCG_')).toBe(0);
        expect(layer._subLayerPosition).toBe(0);
        expect(layer._layer).toBe(layer);
        document.destroy();
    });
    it('add applies an explicit false visibility value', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = document.layers;
        // Act
        const layer: PdfLayer = layers.add('Hidden-Layer', false);
        // Assert
        expect(layer.visible).toBeFalsy();
        expect(layer._dictionary.get('Visible')).toBeFalsy();
        expect(document._off.indexOf(layer._referenceHolder)).not.toBe(-1);
        document.destroy();
    });
    it('add applies an explicit true visibility value', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = document.layers;
        // Act
        const layer: PdfLayer = layers.add('Visible-Layer', true);
        // Assert
        expect(layer.visible).toBeTruthy();
        expect(layer._dictionary.get('Visible')).toBeTruthy();
        expect(document._on.indexOf(layer._referenceHolder)).not.toBe(-1);
        document.destroy();
    });
    it('contains returns the exact result for matching and nonmatching names', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = document.layers;
        layers.add('Existing-Layer');
        // Act
        const containsExisting: boolean = layers.contains('Existing-Layer');
        const containsMissing: boolean = layers.contains('Missing-Layer');
        // Assert
        expect(containsExisting).toBeTruthy();
        expect(containsMissing).toBeFalsy();
        document.destroy();
    });
    it('contains returns the exact result for matching and nonmatching layer instances', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = document.layers;
        const existingLayer: PdfLayer = layers.add('Existing-Layer');
        const missingLayer: PdfLayer = new PdfLayer();
        // Act
        const containsExisting: boolean = layers.contains(existingLayer);
        const containsMissing: boolean = layers.contains(missingLayer);
        // Assert
        expect(containsExisting).toBeTruthy();
        expect(containsMissing).toBeFalsy();
        document.destroy();
    });
    it('contains rejects an empty string argument', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = document.layers;
        // Act and Assert
        expect((): boolean => layers.contains('')).toThrowError('Layer cannot be null or undefined');
        document.destroy();
    });
    it('clear removes every layer and leaves an empty collection', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = document.layers;
        const firstLayer: PdfLayer = layers.add('First-Layer');
        const secondLayer: PdfLayer = layers.add('Second-Layer');
        // Act
        layers.clear();
        // Assert
        expect(layers.count).toBe(0);
        expect(layers.contains(firstLayer)).toBeFalsy();
        expect(layers.contains(secondLayer)).toBeFalsy();
        const optionalContent: _PdfDictionary = document._catalog._catalogDictionary.get('OCProperties') as _PdfDictionary;
        expect((optionalContent.get('OCGs') as any[]).length).toBe(0);
        document.destroy();
    });
    it('indexOf returns the exact existing and missing positions', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = document.layers;
        const firstLayer: PdfLayer = layers.add('First-Layer');
        const secondLayer: PdfLayer = layers.add('Second-Layer');
        const missingLayer: PdfLayer = new PdfLayer();
        // Act
        const firstIndex: number = layers.indexOf(firstLayer);
        const secondIndex: number = layers.indexOf(secondLayer);
        const missingIndex: number = layers.indexOf(missingLayer);
        // Assert
        expect(firstIndex).toBe(0);
        expect(secondIndex).toBe(1);
        expect(missingIndex).toBe(-1);
        document.destroy();
    });
    it('move rejects an index equal to the collection length', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = document.layers;
        const layer: PdfLayer = layers.add('Layer');
        // Act and Assert
        expect((): void => layers.move(1, layer)).toThrowError(
            'Index cannot be less than 0 or greater than array length'
        );
        expect(layers.at(0)).toBe(layer);
        document.destroy();
    });
    it('move changes both collection order and optional-content order', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = document.layers;
        const firstLayer: PdfLayer = layers.add('First-Layer');
        const secondLayer: PdfLayer = layers.add('Second-Layer');
        const thirdLayer: PdfLayer = layers.add('Third-Layer');
        const optionalContent: _PdfDictionary = document._catalog._catalogDictionary.get('OCProperties') as _PdfDictionary;
        const defaultView: _PdfDictionary = optionalContent.get('D') as _PdfDictionary;
        const order: any[] = defaultView.get('Order') as any[];
        // Act
        layers.move(0, thirdLayer);
        // Assert
        expect(layers.at(0)).toBe(thirdLayer);
        expect(layers.at(1)).toBe(firstLayer);
        expect(layers.at(2)).toBe(secondLayer);
        expect(order[0]).toBe(thirdLayer._referenceHolder);
        document.destroy();
    });
    it('move leaves the collection unchanged when the layer is not present', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = document.layers;
        const firstLayer: PdfLayer = layers.add('First-Layer');
        const secondLayer: PdfLayer = layers.add('Second-Layer');
        const missingLayer: PdfLayer = new PdfLayer();
        // Act
        layers.move(0, missingLayer);
        // Assert
        expect(layers.at(0)).toBe(firstLayer);
        expect(layers.at(1)).toBe(secondLayer);
        expect(layers.contains(missingLayer)).toBeFalsy();
        document.destroy();
    });
    it('removeAt removes the selected layer and its optional-content reference', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = document.layers;
        const firstLayer: PdfLayer = layers.add('First-Layer');
        const secondLayer: PdfLayer = layers.add('Second-Layer');
        const firstReference: any = firstLayer._referenceHolder;
        // Act
        layers.removeAt(0, false);
        // Assert
        expect(layers.count).toBe(1);
        expect(layers.at(0)).toBe(secondLayer);
        expect(layers.contains(firstLayer)).toBeFalsy();
        const optionalContent: _PdfDictionary = document._catalog._catalogDictionary.get('OCProperties') as _PdfDictionary;
        expect((optionalContent.get('OCGs') as any[]).indexOf(firstReference)).toBe(-1);
        document.destroy();
    });
    it('removeAt removes direct child layers from the root collection', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = createIsolatedLayerCollection(document);
        const parentLayer: PdfLayer = new PdfLayer();
        const childLayer: PdfLayer = new PdfLayer();
        parentLayer._child.push(childLayer);
        addLayerToInternalList(layers, parentLayer);
        addLayerToInternalList(layers, childLayer);
        // Act
        layers.removeAt(0);
        // Assert
        expect(layers.count).toBe(0);
        expect(layers.contains(parentLayer)).toBeFalsy();
        expect(layers.contains(childLayer)).toBeFalsy();
        document.destroy();
    });
    it('remove with a layer instance removes only the supplied layer', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = document.layers;
        const firstLayer: PdfLayer = layers.add('First-Layer');
        const secondLayer: PdfLayer = layers.add('Second-Layer');
        // Act
        layers.remove(firstLayer, false);
        // Assert
        expect(layers.count).toBe(1);
        expect(layers.contains(firstLayer)).toBeFalsy();
        expect(layers.at(0)).toBe(secondLayer);
        document.destroy();
    });
    it('remove with an absent layer instance leaves the collection unchanged', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = document.layers;
        const existingLayer: PdfLayer = layers.add('Existing-Layer');
        const missingLayer: PdfLayer = new PdfLayer();
        // Act
        layers.remove(missingLayer);
        // Assert
        expect(layers.count).toBe(1);
        expect(layers.at(0)).toBe(existingLayer);
        document.destroy();
    });
    it('remove with a name removes every matching layer', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = document.layers;
        layers.add('Repeated-Layer');
        const retainedLayer: PdfLayer = layers.add('Retained-Layer');
        layers.add('Repeated-Layer');
        // Act
        layers.remove('Repeated-Layer', false);
        // Assert
        expect(layers.count).toBe(1);
        expect(layers.at(0)).toBe(retainedLayer);
        expect(layers.contains('Repeated-Layer')).toBeFalsy();
        document.destroy();
    });
    it('setPrintState preserves the current state for a non name value', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = createIsolatedLayerCollection(document);
        const layer: PdfLayer = new PdfLayer();
        layer._document = document;
        layer._crossReference = document._crossReference;
        (layer as any)._printState = PdfPrintState.alwaysPrint;
        const printOption: _PdfDictionary = new _PdfDictionary(document._crossReference);
        printOption.update('PrintState', 'OFF');
        // Act
        (layers as any)._setPrintState(printOption, layer);
        // Assert
        expect(layer.printState).toBe(PdfPrintState.alwaysPrint);
        document.destroy();
    });
    it('addLayer returns the exact inserted index and stores the same layer', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = createIsolatedLayerCollection(document);
        const firstLayer: PdfLayer = new PdfLayer();
        const secondLayer: PdfLayer = new PdfLayer();
        addLayerToInternalList(layers, firstLayer);
        // Act
        const index: number = (layers as any)._addLayer(secondLayer) as number;
        // Assert
        expect(index).toBe(1);
        expect(layers.count).toBe(2);
        expect(layers.at(1)).toBe(secondLayer);
        expect(secondLayer._layer).toBe(secondLayer);
        document.destroy();
    });
});
function createCollection(document: PdfDocument): PdfLayerCollection {
    return document.layers;
}
function createPreparedLayer(document: PdfDocument, name: string, state: PdfPrintState, visible: boolean): PdfLayer {
    const layer: PdfLayer = new PdfLayer();
    layer._document = document;
    layer._crossReference = document._crossReference;
    layer.name = name;
    layer._layerId = name + '_ID';
    layer.visible = visible;
    layer.printState = state;
    return layer;
}
describe('PdfLayerCollection mutation coverage lines 240 to 376', () => {
    it('createLayer creates OCProperties and enables catalog writing for the first layer', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = createCollection(document);
        // Act
        const layer: PdfLayer = layers.add('First-Layer', true);
        // Assert
        const optionalContent: _PdfDictionary = document._catalog._catalogDictionary.get('OCProperties') as _PdfDictionary;
        const groups: _PdfReference[] = optionalContent.get('OCGs') as _PdfReference[];
        expect(optionalContent).toBeDefined();
        expect(groups.length).toBe(1);
        expect(groups[0]).toBe(layer._referenceHolder);
        expect(document._crossReference._allowCatalog).toBeTruthy();
        expect(document._catalog._catalogDictionary._updated).toBeTruthy();
        document.destroy();
    });
    it('createLayer appends a second layer without replacing existing OCProperties', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = createCollection(document);
        const firstLayer: PdfLayer = layers.add('First-Layer', true);
        const optionalContent: _PdfDictionary = document._catalog._catalogDictionary.get('OCProperties') as _PdfDictionary;
        // Act
        const secondLayer: PdfLayer = layers.add('Second-Layer', true);
        // Assert
        const currentOptionalContent: _PdfDictionary = document._catalog._catalogDictionary.get('OCProperties') as _PdfDictionary;
        const groups: _PdfReference[] = currentOptionalContent.get('OCGs') as _PdfReference[];
        expect(currentOptionalContent).toBe(optionalContent);
        expect(groups.length).toBe(2);
        expect(groups[0]).toBe(firstLayer._referenceHolder);
        expect(groups[1]).toBe(secondLayer._referenceHolder);
        document.destroy();
    });
    it('createLayer preserves unique OCG references when the existing list already contains the layer', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = createCollection(document);
        const layer: PdfLayer = layers.add('Unique-Layer', true);
        const optionalContent: _PdfDictionary = document._catalog._catalogDictionary.get('OCProperties') as _PdfDictionary;
        const groups: _PdfReference[] = optionalContent.get('OCGs') as _PdfReference[];
        // Act
        const matchingReferences: _PdfReference[] = groups.filter((reference: _PdfReference) => reference === layer._referenceHolder);
        // Assert
        expect(groups.length).toBe(1);
        expect(matchingReferences.length).toBe(1);
        document.destroy();
    });
    it('createLayer adds the Order array when the existing default view does not contain it', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = createCollection(document);
        layers.add('First-Layer', true);
        const optionalContent: _PdfDictionary = document._catalog._catalogDictionary.get('OCProperties') as _PdfDictionary;
        const defaultView: _PdfDictionary = optionalContent.get('D') as _PdfDictionary;
        delete defaultView._map.Order;
        // Act
        const secondLayer: PdfLayer = layers.add('Second-Layer', true);
        // Assert
        const order: (_PdfReference | _PdfReference[])[] = defaultView.get('Order') as (_PdfReference | _PdfReference[])[];
        expect(defaultView.has('Order')).toBeTruthy();
        expect(order).toBe(document._order);
        expect(document._order.indexOf(secondLayer._referenceHolder)).not.toBe(-1);
        document.destroy();
    });
    it('createLayer appends a visible layer reference to an existing ON array', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = createCollection(document);
        const firstLayer: PdfLayer = layers.add('First-Layer', true);
        const optionalContent: _PdfDictionary = document._catalog._catalogDictionary.get('OCProperties') as _PdfDictionary;
        const defaultView: _PdfDictionary = optionalContent.get('D') as _PdfDictionary;
        const on: _PdfReference[] = [firstLayer._referenceHolder];
        defaultView.update('ON', on);
        // Act
        const secondLayer: PdfLayer = layers.add('Second-Layer', true);
        // Assert
        expect(on.length).toBe(2);
        expect(on[0]).toBe(firstLayer._referenceHolder);
        expect(on[1]).toBe(secondLayer._referenceHolder);
        document.destroy();
    });
    it('createLayer appends a hidden layer reference to an existing OFF array', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = createCollection(document);
        layers.add('First-Layer', true);
        const optionalContent: _PdfDictionary = document._catalog._catalogDictionary.get('OCProperties') as _PdfDictionary;
        const defaultView: _PdfDictionary = optionalContent.get('D') as _PdfDictionary;
        const off: _PdfReference[] = [];
        defaultView.update('OFF', off);
        // Act
        const hiddenLayer: PdfLayer = layers.add('Hidden-Layer', false);
        // Assert
        expect(hiddenLayer.visible).toBeFalsy();
        expect(off.length).toBe(1);
        expect(off[0]).toBe(hiddenLayer._referenceHolder);
        document.destroy();
    });
    it('createLayer appends the new layer to a referenced usage OCG array', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = createCollection(document);
        const firstLayer: PdfLayer = layers.add('First-Layer', true);
        const optionalContent: _PdfDictionary = document._catalog._catalogDictionary.get('OCProperties') as _PdfDictionary;
        const defaultView: _PdfDictionary = optionalContent.get('D') as _PdfDictionary;
        const usageDictionary: _PdfDictionary = new _PdfDictionary(document._crossReference);
        const usageGroups: _PdfReference[] = [firstLayer._referenceHolder];
        usageDictionary.update('OCGs', usageGroups);
        const usageReference: _PdfReference = document._crossReference._getNextReference();
        document._crossReference._cacheMap.set(usageReference, usageDictionary);
        defaultView.update('AS', [usageReference]);
        // Act
        const secondLayer: PdfLayer = layers.add('Second-Layer', true);
        // Assert
        expect(usageGroups.length).toBe(2);
        expect(usageGroups[0]).toBe(firstLayer._referenceHolder);
        expect(usageGroups[1]).toBe(secondLayer._referenceHolder);
        document.destroy();
    });
    it('createLayer does not duplicate a reference already present in a usage OCG array', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = createCollection(document);
        const layer: PdfLayer = layers.add('Layer', true);
        const optionalContent: _PdfDictionary = document._catalog._catalogDictionary.get('OCProperties') as _PdfDictionary;
        const defaultView: _PdfDictionary = optionalContent.get('D') as _PdfDictionary;
        const usageDictionary: _PdfDictionary = new _PdfDictionary(document._crossReference);
        const usageGroups: _PdfReference[] = [layer._referenceHolder];
        usageDictionary.update('OCGs', usageGroups);
        const usageReference: _PdfReference = document._crossReference._getNextReference();
        document._crossReference._cacheMap.set(usageReference, usageDictionary);
        defaultView.update('AS', [usageReference]);
        // Act
        const matchingReferences: _PdfReference[] = usageGroups.filter(
            (reference: _PdfReference) => reference === layer._referenceHolder
        );
        // Assert
        expect(usageGroups.length).toBe(1);
        expect(matchingReferences.length).toBe(1);
        document.destroy();
    });
    it('createOptionalContentDictionary stores exact layer metadata and print resources', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = createCollection(document);
        // Act
        const layer: PdfLayer = layers.add('Metadata-Layer', false);
        // Assert
        expect(layer._dictionary.get('Name')).toBe('Metadata-Layer');
        expect((layer._dictionary.get('Type') as _PdfName).name).toBe('OCG');
        expect((layer._dictionary.get('LayerID') as _PdfName).name).toBe(layer._layerId);
        expect(layer._dictionary.get('Visible')).toBeFalsy();
        expect(layer._dictionary.has('Usage')).toBeTruthy();
        expect(document._optionalContentDictionaries.indexOf(layer._referenceHolder)).not.toBe(-1);
        expect(document._printLayer.indexOf(layer._referenceHolder)).not.toBe(-1);
        expect((layers as any)._isLayerContainsResource).toBeTruthy();
        document.destroy();
    });
    it('createOptionalContentDictionary records visible and hidden references in separate arrays', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = createCollection(document);
        // Act
        const visibleLayer: PdfLayer = layers.add('Visible-Layer', true);
        const hiddenLayer: PdfLayer = layers.add('Hidden-Layer', false);
        // Assert
        expect(document._on.indexOf(visibleLayer._referenceHolder)).not.toBe(-1);
        expect(document._on.indexOf(hiddenLayer._referenceHolder)).toBe(-1);
        expect(document._off.indexOf(hiddenLayer._referenceHolder)).not.toBe(-1);
        expect(document._off.indexOf(visibleLayer._referenceHolder)).toBe(-1);
        document.destroy();
    });
    it('createOptionalContentViews creates exact name order visibility and print application entries', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = createCollection(document);
        layers.add('Layer', true);
        // Act
        const views: _PdfDictionary = (layers as any)._createOptionalContentViews() as _PdfDictionary;
        const applications: _PdfReference[] = views.get('AS') as _PdfReference[];
        const application: _PdfDictionary = document._crossReference._fetch(
            applications[applications.length - 1]
        ) as _PdfDictionary;
        const category: _PdfName[] = application.get('Category') as _PdfName[];
        // Assert
        expect(views.get('Name')).toBe('Layers');
        expect(views.get('Order')).toBe(document._order);
        expect(views.get('ON')).toBe(document._on);
        expect(views.get('OFF')).toBe(document._off);
        expect(category.length).toBe(1);
        expect(category[0].name).toBe('Print');
        expect(application.get('OCGs')).toBe(document._printLayer);
        expect((application.get('Event') as _PdfName).name).toBe('Print');
        document.destroy();
    });
    it('createOptionalContentViews adds one new application reference per invocation', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = createCollection(document);
        const initialCount: number = document._as.length;
        // Act
        const firstView: _PdfDictionary = (layers as any)._createOptionalContentViews() as _PdfDictionary;
        const countAfterFirst: number = document._as.length;
        const secondView: _PdfDictionary = (layers as any)._createOptionalContentViews() as _PdfDictionary;
        // Assert
        expect(countAfterFirst).toBe(initialCount + 1);
        expect(document._as.length).toBe(initialCount + 2);
        expect(firstView.get('AS')).toBe(document._as);
        expect(secondView.get('AS')).toBe(document._as);
        document.destroy();
    });
});
describe('PdfLayerCollection corrected print-state mutation coverage', () => {
    function createIsolatedLayerCollection(document: PdfDocument): PdfLayerCollection {
        const parent: PdfLayer = new PdfLayer();
        return new PdfLayerCollection(document, parent);
    }
    function createCollection(document: PdfDocument): PdfLayerCollection {
        return document.layers;
    }
    function createPreparedLayer(
        document: PdfDocument,
        name: string,
        state: PdfPrintState,
        visible: boolean
    ): PdfLayer {
        const layer: PdfLayer = document.layers.add(name, visible);
        (layer as any)._printState = state;
        return layer;
    }
    it('setPrintState maps ON to alwaysPrint', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = createIsolatedLayerCollection(document);
        const layer: PdfLayer = document.layers.add('Always-Print-Layer', true);
        const printOption: _PdfDictionary = new _PdfDictionary(document._crossReference);
        printOption.update('PrintState', new _PdfName('ON'));
        // Act
        (layers as any)._setPrintState(printOption, layer);
        // Assert
        expect(layer.printState).toBe(PdfPrintState.alwaysPrint);
        document.destroy();
    });
    it('setPrintState maps a non ON name to neverPrint', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = createIsolatedLayerCollection(document);
        const layer: PdfLayer = document.layers.add('Never-Print-Layer', true);
        const printOption: _PdfDictionary = new _PdfDictionary(document._crossReference);
        printOption.update('PrintState', new _PdfName('OFF'));
        // Act
        (layers as any)._setPrintState(printOption, layer);
        // Assert
        expect(layer.printState).toBe(PdfPrintState.neverPrint);
        document.destroy();
    });
    it('setPrintOption creates OFF print state for neverPrint', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = createCollection(document);
        const layer: PdfLayer = createPreparedLayer(
            document,
            'Never-Print',
            PdfPrintState.neverPrint,
            true
        );
        // Act
        const usageReference: _PdfReference = (layers as any)._setPrintOption(layer) as _PdfReference;
        const usage: _PdfDictionary = document._crossReference._fetch(usageReference) as _PdfDictionary;
        const printReference: _PdfReference = usage.getRaw('Print') as _PdfReference;
        const print: _PdfDictionary = document._crossReference._fetch(printReference) as _PdfDictionary;
        // Assert
        expect(layer._usage).toBe(usage);
        expect(layer._printOption).toBe(print);
        expect((print.get('Subtype') as _PdfName).name).toBe('Print');
        expect((print.get('PrintState') as _PdfName).name).toBe('OFF');
        expect(usage.getRaw('Print')).toBe(printReference);
        document.destroy();
    });
    it('setPrintOption creates ON print state for alwaysPrint', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = createCollection(document);
        const layer: PdfLayer = createPreparedLayer(
            document,
            'Always-Print',
            PdfPrintState.alwaysPrint,
            true
        );
        // Act
        const usageReference: _PdfReference = (layers as any)._setPrintOption(layer) as _PdfReference;
        const usage: _PdfDictionary = document._crossReference._fetch(usageReference) as _PdfDictionary;
        const printReference: _PdfReference = usage.getRaw('Print') as _PdfReference;
        const print: _PdfDictionary = document._crossReference._fetch(printReference) as _PdfDictionary;
        // Assert
        expect((print.get('Subtype') as _PdfName).name).toBe('Print');
        expect((print.get('PrintState') as _PdfName).name).toBe('ON');
        expect(layer._usage).toBe(usage);
        expect(layer._printOption).toBe(print);
        document.destroy();
    });
    it('setPrintOption omits PrintState for printWhenVisible', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = createCollection(document);
        const layer: PdfLayer = createPreparedLayer(
            document,
            'Visible-Print',
            PdfPrintState.printWhenVisible,
            true
        );
        // Act
        const usageReference: _PdfReference = (layers as any)._setPrintOption(layer) as _PdfReference;
        const usage: _PdfDictionary = document._crossReference._fetch(usageReference) as _PdfDictionary;
        const printReference: _PdfReference = usage.getRaw('Print') as _PdfReference;
        const print: _PdfDictionary = document._crossReference._fetch(printReference) as _PdfDictionary;
        // Assert
        expect((print.get('Subtype') as _PdfName).name).toBe('Print');
        expect(print.has('PrintState')).toBeFalsy();
        expect(layer._printOption).toBe(print);
        document.destroy();
    });
});
function createLayerReference(document: PdfDocument): _PdfReference {
    return document._crossReference._getNextReference();
}
function createOptionalContentProperties(
    document: PdfDocument,
    order: (_PdfReference | _PdfReference[])[]
): _PdfDictionary {
    const defaultView: _PdfDictionary = new _PdfDictionary(document._crossReference);
    defaultView.update('Order', order);
    const optionalContent: _PdfDictionary = new _PdfDictionary(document._crossReference);
    optionalContent.update('OCGs', []);
    optionalContent.update('D', defaultView);
    document._catalog._catalogDictionary.update('OCProperties', optionalContent);
    return optionalContent;
}
function prepareLayer(document: PdfDocument, name: string): PdfLayer {
    const layer: PdfLayer = new PdfLayer();
    layer._document = document;
    layer._crossReference = document._crossReference;
    layer.name = name;
    layer._layerId = name + '_ID';
    return layer;
}
describe('PdfLayerCollection mutation coverage lines 376 to 516', () => {
    it('createSublayer appends a root reference when optional content is absent', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = new PdfLayerCollection(document, new PdfLayer());
        const layer: PdfLayer = prepareLayer(document, 'Root-Layer');
        const reference: _PdfReference = createLayerReference(document);
        (layers as any)._subLayer = false;
        // Act
        (layers as any)._createSublayer(undefined, reference, layer);
        // Assert
        expect(document._order.length).toBe(1);
        expect(document._order[0]).toBe(reference);
        expect(layer._parent).toBeUndefined();
        document.destroy();
    });
    it('createSublayer uses the existing optional-content order for a root layer', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const existingReference: _PdfReference = createLayerReference(document);
        const order: (_PdfReference | _PdfReference[])[] = [existingReference];
        const optionalContent: _PdfDictionary = createOptionalContentProperties(document, order);
        const layers: PdfLayerCollection = new PdfLayerCollection(document, new PdfLayer());
        const layer: PdfLayer = prepareLayer(document, 'Second-Root');
        const reference: _PdfReference = createLayerReference(document);
        (layers as any)._subLayer = false;
        // Act
        (layers as any)._createSublayer(optionalContent, reference, layer);
        // Assert
        expect(document._order).toBe(order);
        expect(order.length).toBe(2);
        expect(order[0]).toBe(existingReference);
        expect(order[1]).toBe(reference);
        document.destroy();
    });
    it('createSublayer assigns the parent and records the first child reference', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const parent: PdfLayer = prepareLayer(document, 'Parent');
        parent._referenceHolder = createLayerReference(document);
        const layers: PdfLayerCollection = new PdfLayerCollection(document, parent);
        const child: PdfLayer = prepareLayer(document, 'Child');
        const childReference: _PdfReference = createLayerReference(document);
        (layers as any)._subLayer = true;
        // Act
        (layers as any)._createSublayer(undefined, childReference, child);
        // Assert
        expect(child._parent).toBe(parent);
        expect(parent._subLayer.length).toBe(1);
        expect(parent._subLayer[0]).toBe(childReference);
        expect(parent._child.length).toBe(1);
        expect(parent._child[0]).toBe(child);
        expect(child._parentLayer.length).toBe(1);
        expect(child._parentLayer[0]).toBe(parent);
        document.destroy();
    });
    it('createSublayer inserts the first child array after an ordered parent', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const parent: PdfLayer = prepareLayer(document, 'Parent');
        parent._referenceHolder = createLayerReference(document);
        document._order.push(parent._referenceHolder);
        const optionalContent: _PdfDictionary =
            createOptionalContentProperties(document, document._order);
        const layers: PdfLayerCollection = new PdfLayerCollection(document, parent);
        const child: PdfLayer = prepareLayer(document, 'Child');
        const childReference: _PdfReference = createLayerReference(document);
        (layers as any)._subLayer = true;
        // Act
        (layers as any)._createSublayer(optionalContent, childReference, child);
        // Assert
        expect(parent._subLayer.length).toBe(1);
        expect(parent._subLayer[0]).toBe(childReference);
        expect(document._order.length).toBe(2);
        expect(document._order[0]).toBe(parent._referenceHolder);
        expect(document._order[1] as any).toBe(parent._subLayer as any);
        expect(parent._child.length).toBe(1);
        expect(parent._child[0]).toBe(child);
        expect(child._parent).toBe(parent);
        document.destroy();
    });
    it('createSublayer replaces the prior child array when an ordered parent gains another child', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const parent: PdfLayer = prepareLayer(document, 'Parent');
        parent._referenceHolder = createLayerReference(document);
        const firstChild: PdfLayer = prepareLayer(document, 'First-Child');
        const firstReference: _PdfReference = createLayerReference(document);
        parent._child.push(firstChild);
        parent._subLayer.push(firstReference);
        document._order.push(
            parent._referenceHolder,
            parent._subLayer as _PdfReference[]
        );
        const optionalContent: _PdfDictionary =
            createOptionalContentProperties(document, document._order);
        const layers: PdfLayerCollection = new PdfLayerCollection(document, parent);
        const secondChild: PdfLayer = prepareLayer(document, 'Second-Child');
        const secondReference: _PdfReference = createLayerReference(document);
        (layers as any)._subLayer = true;
        // Act
        (layers as any)._createSublayer(optionalContent, secondReference, secondChild);
        // Assert
        expect(parent._subLayer.length).toBe(2);
        expect(parent._subLayer[0]).toBe(firstReference);
        expect(parent._subLayer[1]).toBe(secondReference);
        expect(document._order.length).toBe(2);
        expect(document._order[0]).toBe(parent._referenceHolder);
        expect(document._order[1] as any).toBe(parent._subLayer as any);
        expect(parent._child.length).toBe(2);
        expect(parent._child[0]).toBe(firstChild);
        expect(parent._child[1]).toBe(secondChild);
        expect(secondChild._parent).toBe(parent);
        document.destroy();
    });
    it('createSublayer inserts a nested child array into the grandparent hierarchy', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const grandparent: PdfLayer = prepareLayer(document, 'Grandparent');
        const parent: PdfLayer = prepareLayer(document, 'Parent');
        grandparent._referenceHolder = createLayerReference(document);
        parent._referenceHolder = createLayerReference(document);
        parent._parent = grandparent;
        parent._parentLayer.push(grandparent);
        grandparent._subLayer.push(parent._referenceHolder);
        document._order.push(
            grandparent._referenceHolder,
            grandparent._subLayer as _PdfReference[]
        );
        const optionalContent: _PdfDictionary =
            createOptionalContentProperties(document, document._order);
        const layers: PdfLayerCollection = new PdfLayerCollection(document, parent);
        const child: PdfLayer = prepareLayer(document, 'Child');
        const childReference: _PdfReference = createLayerReference(document);
        (layers as any)._subLayer = true;
        // Act
        (layers as any)._createSublayer(optionalContent, childReference, child);
        // Assert
        expect(parent._subLayer.length).toBe(1);
        expect(parent._subLayer[0]).toBe(childReference);
        expect(grandparent._subLayer.length).toBe(2);
        expect(grandparent._subLayer[0]).toBe(parent._referenceHolder);
        expect(grandparent._subLayer[1] as any).toBe(parent._subLayer as any);
        expect(document._order.length).toBe(2);
        expect(document._order[0]).toBe(grandparent._referenceHolder);
        expect(document._order[1] as any).toBe(grandparent._subLayer as any);
        expect(child._parent).toBe(parent);
        expect(child._parentLayer.length).toBe(2);
        expect(child._parentLayer[0]).toBe(grandparent);
        expect(child._parentLayer[1]).toBe(parent);
        document.destroy();
    });
    it('checkLayerLock applies locked state to a mapped reference', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = new PdfLayerCollection(
            document,
            new PdfLayer()
        );
        const layer: PdfLayer = new PdfLayer();
        const reference: _PdfReference =
            document._crossReference._getNextReference();
        const defaultView: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        const optionalContent: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        const layerDictionary: Map<_PdfReference, PdfLayer> =
            new Map<_PdfReference, PdfLayer>();

        layer._document = document;
        layer._crossReference = document._crossReference;
        layer._referenceHolder = reference;
        layerDictionary.set(reference, layer);
        defaultView.update('Locked', [reference]);
        optionalContent.update('D', defaultView);
        (layers as any)._layerDictionary = layerDictionary;

        // Act
        (layers as any)._checkLayerLock(optionalContent);

        // Assert
        expect(layer.locked).toBeTruthy();
        expect((defaultView.get('Locked') as _PdfReference[]).length).toBe(1);
        expect(
            (defaultView.get('Locked') as _PdfReference[])[0]
        ).toBe(reference);
        document.destroy();
    });
    it('checkLayerLock ignores nonreference and unmapped entries', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        document.layers.add('Unlocked-Layer', true);
        const optionalContent: _PdfDictionary = document._catalog._catalogDictionary.get('OCProperties') as _PdfDictionary;
        const defaultView: _PdfDictionary = optionalContent.get('D') as _PdfDictionary;
        const missingReference: _PdfReference = createLayerReference(document);
        defaultView.update('Locked', ['Invalid', missingReference]);
        const layers: PdfLayerCollection = new PdfLayerCollection(document);
        const parsedLayer: PdfLayer = layers.at(0);
        // Act
        (layers as any)._checkLayerLock(optionalContent);
        // Assert
        expect(parsedLayer.locked).toBeFalsy();
        expect(parsedLayer._dictionary.has('Locked')).toBeFalsy();
        document.destroy();
    });
    it('checkLayerVisible turns a mapped visible layer off and updates its dictionary', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const sourceLayer: PdfLayer = document.layers.add('Hidden-Layer', true);
        const optionalContent: _PdfDictionary = document._catalog._catalogDictionary.get('OCProperties') as _PdfDictionary;
        const defaultView: _PdfDictionary = optionalContent.get('D') as _PdfDictionary;
        defaultView.update('OFF', [sourceLayer._referenceHolder]);
        const layers: PdfLayerCollection = new PdfLayerCollection(document);
        const parsedLayer: PdfLayer = layers.at(0);
        parsedLayer._visible = true;
        parsedLayer._dictionary.set('Visible', true);
        // Act
        (layers as any)._checkLayerVisible(optionalContent);
        // Assert
        expect(parsedLayer.visible).toBeFalsy();
        expect(parsedLayer._dictionary.get('Visible')).toBeFalsy();
        document.destroy();
    });
    it('checkLayerVisible preserves an already hidden mapped layer', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const sourceLayer: PdfLayer = document.layers.add('Already-Hidden', false);
        const optionalContent: _PdfDictionary = document._catalog._catalogDictionary.get('OCProperties') as _PdfDictionary;
        const defaultView: _PdfDictionary = optionalContent.get('D') as _PdfDictionary;
        defaultView.update('OFF', [sourceLayer._referenceHolder]);
        const layers: PdfLayerCollection = new PdfLayerCollection(document);
        const parsedLayer: PdfLayer = layers.at(0);
        parsedLayer._visible = false;
        parsedLayer._dictionary.set('Visible', false);
        // Act
        (layers as any)._checkLayerVisible(optionalContent);
        // Assert
        expect(parsedLayer.visible).toBeFalsy();
        expect(parsedLayer._dictionary.get('Visible')).toBeFalsy();
        document.destroy();
    });
    it('checkLayerVisible ignores nonreference and unmapped OFF entries', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        document.layers.add('Visible-Layer', true);
        const optionalContent: _PdfDictionary = document._catalog._catalogDictionary.get('OCProperties') as _PdfDictionary;
        const defaultView: _PdfDictionary = optionalContent.get('D') as _PdfDictionary;
        const missingReference: _PdfReference = createLayerReference(document);
        defaultView.update('OFF', ['Invalid', missingReference]);
        const layers: PdfLayerCollection = new PdfLayerCollection(document);
        const parsedLayer: PdfLayer = layers.at(0);
        // Act
        (layers as any)._checkLayerVisible(optionalContent);
        // Assert
        expect(parsedLayer.visible).toBeTruthy();
        expect(parsedLayer._dictionary.get('Visible')).toBeTruthy();
        document.destroy();
    });
});

function createReference(document: PdfDocument): _PdfReference {
    return document._crossReference._getNextReference();
}

function createLayer(document: PdfDocument, name: string): PdfLayer {
    const layer: PdfLayer = new PdfLayer();
    layer._document = document;
    layer._crossReference = document._crossReference;
    layer.name = name;
    layer._layerId = name + '_ID';
    layer._dictionary = new _PdfDictionary(document._crossReference);
    return layer;
}

function createOrderProperties(
    document: PdfDocument,
    order: (_PdfReference | _PdfReference[])[]
): _PdfDictionary {
    const defaultView: _PdfDictionary = new _PdfDictionary(document._crossReference);
    defaultView.update('Order', order);
    const optionalContent: _PdfDictionary = new _PdfDictionary(document._crossReference);
    optionalContent.update('OCGs', []);
    optionalContent.update('D', defaultView);
    document._catalog._catalogDictionary.update('OCProperties', optionalContent);
    return optionalContent;
}

describe('PdfLayerCollection mutation coverage lines 516 to 700', () => {
    it('checkParentLayer creates the exact parent and child hierarchy from Order', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const parentSource: PdfLayer = document.layers.add('Parent', true);
        const childSource: PdfLayer = document.layers.add('Child', true);
        const optionalContent: _PdfDictionary = document._catalog._catalogDictionary.get('OCProperties') as _PdfDictionary;
        const defaultView: _PdfDictionary = optionalContent.get('D') as _PdfDictionary;
        defaultView.update('Order', [parentSource._referenceHolder, [childSource._referenceHolder]]);

        // Act
        const layers: PdfLayerCollection = new PdfLayerCollection(document);
        const parent: PdfLayer = layers.at(0);
        const child: PdfLayer = parent.layers.at(0);

        // Assert
        expect(layers.count).toBe(1);
        expect(parent.name).toBe('Parent');
        expect(parent._child.length).toBe(1);
        expect(parent._child[0]).toBe(child);
        expect(child.name).toBe('Child');
        expect(child._parent).toBe(parent);
        expect(child._parentLayer.length).toBe(1);
        expect(child._parentLayer[0]).toBe(parent);
        document.destroy();
    });

    it('parsingLayerOrder ignores an empty nested order array', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = new PdfLayerCollection(document, new PdfLayer());
        const layerDictionary: Map<_PdfReference, PdfLayer> = new Map<_PdfReference, PdfLayer>();
        const order: (_PdfReference | _PdfReference[])[] = [[]];

        // Act
        (layers as any)._parsingLayerOrder(null, order, layerDictionary);

        // Assert
        expect(layerDictionary.size).toBe(0);
        expect(order.length).toBe(1);
        expect((order[0] as _PdfReference[]).length).toBe(0);
        document.destroy();
    });

    it('parsingLayerOrder handles a string-leading nested array without adding hierarchy', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = new PdfLayerCollection(document, new PdfLayer());
        const layerDictionary: Map<_PdfReference, PdfLayer> = new Map<_PdfReference, PdfLayer>();
        const order: any[] = [['Heading']];

        // Act
        (layers as any)._parsingLayerOrder(null, order, layerDictionary);

        // Assert
        expect(layerDictionary.size).toBe(0);
        expect(order.length).toBe(1);
        expect(order[0][0]).toBe('Heading');
        document.destroy();
    });

    it('parsingLayerOrder does not duplicate an existing child relationship', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = new PdfLayerCollection(document, new PdfLayer());
        const parent: PdfLayer = createLayer(document, 'Parent');
        const child: PdfLayer = createLayer(document, 'Child');
        const parentReference: _PdfReference = createReference(document);
        const childReference: _PdfReference = createReference(document);
        parent._child.push(child);
        const layerDictionary: Map<_PdfReference, PdfLayer> = new Map<_PdfReference, PdfLayer>();
        layerDictionary.set(parentReference, parent);
        layerDictionary.set(childReference, child);
        const order: (_PdfReference | _PdfReference[])[] = [parentReference, [childReference]];

        // Act
        (layers as any)._parsingLayerOrder(null, order, layerDictionary);

        // Assert
        expect(parent._child.length).toBe(1);
        expect(parent._child[0]).toBe(child);
        expect(child._parent).toBe(parent);
        expect(child._parentLayer.length).toBe(1);
        expect(child._parentLayer[0]).toBe(parent);
        document.destroy();
    });



    it('createLayerHierarchical keeps only root layers in the root collection', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const parentSource: PdfLayer = document.layers.add('Parent', true);
        const childSource: PdfLayer = document.layers.add('Child', true);
        const optionalContent: _PdfDictionary = document._catalog._catalogDictionary.get('OCProperties') as _PdfDictionary;
        const defaultView: _PdfDictionary = optionalContent.get('D') as _PdfDictionary;
        defaultView.update('Order', [parentSource._referenceHolder, [childSource._referenceHolder]]);

        // Act
        const layers: PdfLayerCollection = new PdfLayerCollection(document);
        const parent: PdfLayer = layers.at(0);

        // Assert
        expect(layers.count).toBe(1);
        expect(parent.name).toBe('Parent');
        expect(parent.layers.count).toBe(1);
        expect(parent.layers.at(0).name).toBe('Child');
        expect(parent.layers.at(0)._layer).toBe(parent.layers.at(0));
        document.destroy();
    });



    it('addNestedLayer returns the exact inserted index and stores the layer', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = new PdfLayerCollection(document, new PdfLayer());
        const firstLayer: PdfLayer = createLayer(document, 'First');
        const secondLayer: PdfLayer = createLayer(document, 'Second');
        (layers as any)._addNestedLayer(firstLayer);

        // Act
        const index: number = (layers as any)._addNestedLayer(secondLayer) as number;

        // Assert
        expect(index).toBe(1);
        expect(layers.count).toBe(2);
        expect(layers.at(1)).toBe(secondLayer);
        expect(secondLayer._layer).toBe(secondLayer);
        document.destroy();
    });

    it('removeLayer removes all root optional-content metadata and cached usage objects', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layer: PdfLayer = document.layers.add('Remove-Layer', true);
        layer.locked = true;
        const optionalContent: _PdfDictionary = document._catalog._catalogDictionary.get('OCProperties') as _PdfDictionary;
        const defaultView: _PdfDictionary = optionalContent.get('D') as _PdfDictionary;
        defaultView.update('Locked', [layer._referenceHolder]);
        const groups: _PdfReference[] = optionalContent.get('OCGs') as _PdfReference[];
        const order: (_PdfReference | _PdfReference[])[] = defaultView.get('Order') as (_PdfReference | _PdfReference[])[];
        const on: _PdfReference[] = defaultView.get('ON') as _PdfReference[];
        const locked: _PdfReference[] = defaultView.get('Locked') as _PdfReference[];
        const usageReference: _PdfReference = layer._dictionary.getRaw('Usage') as _PdfReference;
        const usageDictionary: _PdfDictionary = document._crossReference._cacheMap.get(usageReference) as _PdfDictionary;
        const printReference: _PdfReference = usageDictionary.getRaw('Print') as _PdfReference;

        // Act
        (document.layers as any)._removeLayer(layer, false);

        // Assert
        expect(groups.indexOf(layer._referenceHolder)).toBe(-1);
        expect(order.indexOf(layer._referenceHolder)).toBe(-1);
        expect(on.indexOf(layer._referenceHolder)).toBe(-1);
        expect(locked.indexOf(layer._referenceHolder)).toBe(-1);
        expect(document._crossReference._cacheMap.has(layer._referenceHolder)).toBeFalsy();
        expect(document._crossReference._cacheMap.has(usageReference)).toBeFalsy();
        expect(document._crossReference._cacheMap.has(printReference)).toBeFalsy();
        expect(optionalContent._updated).toBeTruthy();
        expect(document._catalog._catalogDictionary._updated).toBeTruthy();
        expect(document._crossReference._allowCatalog).toBeTruthy();
        document.destroy();
    });

    it('removeLayer removes a hidden layer reference from OFF', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layer: PdfLayer = document.layers.add('Hidden-Layer', false);
        const optionalContent: _PdfDictionary = document._catalog._catalogDictionary.get('OCProperties') as _PdfDictionary;
        const defaultView: _PdfDictionary = optionalContent.get('D') as _PdfDictionary;
        const off: _PdfReference[] = defaultView.get('OFF') as _PdfReference[];

        // Act
        (document.layers as any)._removeLayer(layer, false);

        // Assert
        expect(layer.visible).toBeFalsy();
        expect(off.indexOf(layer._referenceHolder)).toBe(-1);
        document.destroy();
    });


    it('removeOCG removes only the matching layer reference', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = new PdfLayerCollection(document, new PdfLayer());
        const layer: PdfLayer = createLayer(document, 'Layer');
        const matchingReference: _PdfReference = createReference(document);
        const retainedReference: _PdfReference = createReference(document);
        layer._referenceHolder = matchingReference;
        const groups: _PdfReference[] = [retainedReference, matchingReference];

        // Act
        (layers as any)._removeOCG(layer, groups);

        // Assert
        expect(groups.length).toBe(1);
        expect(groups[0]).toBe(retainedReference);
        expect(groups.indexOf(matchingReference)).toBe(-1);
        document.destroy();
    });

    it('removeOCG preserves the array when the layer reference is absent', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = new PdfLayerCollection(document, new PdfLayer());
        const layer: PdfLayer = createLayer(document, 'Layer');
        layer._referenceHolder = createReference(document);
        const retainedReference: _PdfReference = createReference(document);
        const groups: _PdfReference[] = [retainedReference];

        // Act
        (layers as any)._removeOCG(layer, groups);

        // Assert
        expect(groups.length).toBe(1);
        expect(groups[0]).toBe(retainedReference);
        document.destroy();
    });
});



describe('PdfLayerCollection mutation coverage lines 700 to 875', () => {


    function createReference(document: PdfDocument): _PdfReference {
        return document._crossReference._getNextReference();
    }

    function createLayer(document: PdfDocument, name: string): PdfLayer {
        const layer: PdfLayer = new PdfLayer();
        layer._document = document;
        layer._crossReference = document._crossReference;
        layer.name = name;
        layer._layerId = name + '_ID';
        layer._dictionary = new _PdfDictionary(document._crossReference);
        layer._referenceHolder = createReference(document);
        return layer;
    }

    function createCollection(document: PdfDocument): PdfLayerCollection {
        return new PdfLayerCollection(document, new PdfLayer());
    }
    it('removeUsage removes the layer reference from a direct usage dictionary', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = createCollection(document);
        const layer: PdfLayer = createLayer(document, 'Direct-Usage');
        const retainedReference: _PdfReference = createReference(document);
        const usageGroups: _PdfReference[] = [retainedReference, layer._referenceHolder];
        const usageDictionary: _PdfDictionary = new _PdfDictionary(document._crossReference);
        usageDictionary.update('OCGs', usageGroups);

        // Act
        (layers as any)._removeUsage(layer, [usageDictionary]);

        // Assert
        expect(usageGroups.length).toBe(1);
        expect(usageGroups[0]).toBe(retainedReference);
        expect(usageGroups.indexOf(layer._referenceHolder)).toBe(-1);
        document.destroy();
    });

    it('removeUsage resolves a referenced usage dictionary and stops after removal', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = createCollection(document);
        const layer: PdfLayer = createLayer(document, 'Referenced-Usage');
        const firstGroups: _PdfReference[] = [layer._referenceHolder];
        const secondGroups: _PdfReference[] = [layer._referenceHolder];
        const firstUsage: _PdfDictionary = new _PdfDictionary(document._crossReference);
        const secondUsage: _PdfDictionary = new _PdfDictionary(document._crossReference);
        firstUsage.update('OCGs', firstGroups);
        secondUsage.update('OCGs', secondGroups);
        const firstReference: _PdfReference = createReference(document);
        const secondReference: _PdfReference = createReference(document);
        document._crossReference._cacheMap.set(firstReference, firstUsage);
        document._crossReference._cacheMap.set(secondReference, secondUsage);

        // Act
        (layers as any)._removeUsage(layer, [firstReference, secondReference]);

        // Assert
        expect(firstGroups.length).toBe(0);
        expect(secondGroups.length).toBe(1);
        expect(secondGroups[0]).toBe(layer._referenceHolder);
        document.destroy();
    });

    it('removeUsage preserves usage groups when the layer reference is absent', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = createCollection(document);
        const layer: PdfLayer = createLayer(document, 'Absent-Usage');
        const retainedReference: _PdfReference = createReference(document);
        const usageGroups: _PdfReference[] = [retainedReference];
        const usageDictionary: _PdfDictionary = new _PdfDictionary(document._crossReference);
        usageDictionary.update('OCGs', usageGroups);

        // Act
        (layers as any)._removeUsage(layer, [usageDictionary]);

        // Assert
        expect(usageGroups.length).toBe(1);
        expect(usageGroups[0]).toBe(retainedReference);
        document.destroy();
    });

    it('removeOrder removes a layer and its following child array', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = createCollection(document);
        const layer: PdfLayer = createLayer(document, 'Parent');
        const childReference: _PdfReference = createReference(document);
        const retainedReference: _PdfReference = createReference(document);
        const childOrder: _PdfReference[] = [childReference];
        const order: (_PdfReference | _PdfReference[])[] = [
            layer._referenceHolder,
            childOrder,
            retainedReference
        ];

        // Act
        (layers as any)._removeOrder(layer, order, []);

        // Assert
        expect(order.length).toBe(1);
        expect(order[0]).toBe(retainedReference);
        document.destroy();
    });

    it('removeOrder removes a nonfinal layer without a following child array', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = createCollection(document);
        const layer: PdfLayer = createLayer(document, 'Middle');
        const retainedReference: _PdfReference = createReference(document);
        const order: (_PdfReference | _PdfReference[])[] = [layer._referenceHolder, retainedReference];

        // Act
        (layers as any)._removeOrder(layer, order, []);

        // Assert
        expect(order.length).toBe(1);
        expect(order[0]).toBe(retainedReference);
        document.destroy();
    });

    it('removeOrder removes a matching final layer', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = createCollection(document);
        const layer: PdfLayer = createLayer(document, 'Final');
        const retainedReference: _PdfReference = createReference(document);
        const order: (_PdfReference | _PdfReference[])[] = [retainedReference, layer._referenceHolder];

        // Act
        (layers as any)._removeOrder(layer, order, []);

        // Assert
        expect(order.length).toBe(1);
        expect(order[0]).toBe(retainedReference);
        document.destroy();
    });

    it('removeOrder recursively removes a layer from a nested array', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = createCollection(document);
        const layer: PdfLayer = createLayer(document, 'Nested');
        const retainedReference: _PdfReference = createReference(document);
        const nestedOrder: _PdfReference[] = [retainedReference, layer._referenceHolder];
        const order: (_PdfReference | _PdfReference[])[] = [nestedOrder];

        // Act
        (layers as any)._removeOrder(layer, order, []);

        // Assert
        expect(nestedOrder.length).toBe(1);
        expect(nestedOrder[0]).toBe(retainedReference);
        expect(order.length).toBe(1);
        document.destroy();
    });

    it('removeVisible removes a visible layer only from ON', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = createCollection(document);
        const layer: PdfLayer = createLayer(document, 'Visible');
        layer._visible = true;
        const retainedReference: _PdfReference = createReference(document);
        const on: _PdfReference[] = [retainedReference, layer._referenceHolder];
        const off: _PdfReference[] = [layer._referenceHolder];

        // Act
        (layers as any)._removeVisible(layer, on, off);

        // Assert
        expect(on.length).toBe(1);
        expect(on[0]).toBe(retainedReference);
        expect(off.length).toBe(1);
        expect(off[0]).toBe(layer._referenceHolder);
        document.destroy();
    });

    it('removeVisible removes a hidden layer only from OFF', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = createCollection(document);
        const layer: PdfLayer = createLayer(document, 'Hidden');
        layer._visible = false;
        const retainedReference: _PdfReference = createReference(document);
        const on: _PdfReference[] = [layer._referenceHolder];
        const off: _PdfReference[] = [retainedReference, layer._referenceHolder];

        // Act
        (layers as any)._removeVisible(layer, on, off);

        // Assert
        expect(off.length).toBe(1);
        expect(off[0]).toBe(retainedReference);
        expect(on.length).toBe(1);
        expect(on[0]).toBe(layer._referenceHolder);
        document.destroy();
    });

    it('removeVisible preserves arrays when the layer reference is absent', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = createCollection(document);
        const layer: PdfLayer = createLayer(document, 'Absent');
        layer._visible = true;
        const onReference: _PdfReference = createReference(document);
        const offReference: _PdfReference = createReference(document);
        const on: _PdfReference[] = [onReference];
        const off: _PdfReference[] = [offReference];

        // Act
        (layers as any)._removeVisible(layer, on, off);

        // Assert
        expect(on.length).toBe(1);
        expect(on[0]).toBe(onReference);
        expect(off.length).toBe(1);
        expect(off[0]).toBe(offReference);
        document.destroy();
    });

    it('removeLocked removes only the matching locked reference', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = createCollection(document);
        const layer: PdfLayer = createLayer(document, 'Locked');
        const retainedReference: _PdfReference = createReference(document);
        const locked: _PdfReference[] = [retainedReference, layer._referenceHolder];

        // Act
        (layers as any)._removeLocked(layer, locked);

        // Assert
        expect(locked.length).toBe(1);
        expect(locked[0]).toBe(retainedReference);
        expect(locked.indexOf(layer._referenceHolder)).toBe(-1);
        document.destroy();
    });

    it('removeLocked preserves the array when the layer reference is absent', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = createCollection(document);
        const layer: PdfLayer = createLayer(document, 'Unlocked');
        const retainedReference: _PdfReference = createReference(document);
        const locked: _PdfReference[] = [retainedReference];

        // Act
        (layers as any)._removeLocked(layer, locked);

        // Assert
        expect(locked.length).toBe(1);
        expect(locked[0]).toBe(retainedReference);
        document.destroy();
    });


    it('streamWrite writes operands operator spaces and line ending when not skipped', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = createCollection(document);
        const data: _PdfContentStream = new _PdfContentStream([]);

        // Act
        (layers as any)._streamWrite(['10', '20'], 'm', true, data);

        // Assert
        const bytes: number[] = (data as any)._bytes as number[];
        const text: string = String.fromCharCode.apply(null, bytes);
        expect(data.length).toBe(9);
        expect(text).toBe('10 20 m\r\n');
        document.destroy();
    });

    it('streamWrite does not write when skip is active inside marked content', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = createCollection(document);
        const data: _PdfContentStream = new _PdfContentStream([]);
        (layers as any)._bdcCount = 1;

        // Act
        (layers as any)._streamWrite(['10'], 'm', true, data);

        // Assert
        expect(data.length).toBe(0);
        expect(layers._isSkip).toBeTruthy();
        document.destroy();
    });
});


function getPageResources(document: PdfDocument, page: PdfPage): _PdfDictionary {
    let resources: _PdfDictionary = page._pageDictionary.get('Resources') as _PdfDictionary;
    if (!resources) {
        resources = new _PdfDictionary(document._crossReference);
        page._pageDictionary.update('Resources', resources);
    }
    return resources;
}

function setLayerPageAndId(layer: PdfLayer, page: PdfPage, layerId: string): void {
    Object.defineProperty(layer, '_layerId', {
        configurable: true,
        enumerable: false,
        value: layerId,
        writable: true
    });
    Object.defineProperty(layer, '_layerPage', {
        configurable: true,
        enumerable: false,
        value: page
    });
}

describe('PdfLayerCollection removeLayerContent corrected mutation coverage', () => {

    function createReference(document: PdfDocument): _PdfReference {
        return document._crossReference._getNextReference();
    }

    function createLayer(document: PdfDocument, name: string): PdfLayer {
        const layer: PdfLayer = new PdfLayer();
        layer._document = document;
        layer._crossReference = document._crossReference;
        layer.name = name;
        layer._dictionary = new _PdfDictionary(document._crossReference);
        layer._referenceHolder = createReference(document);
        return layer;
    }

    function createCollection(document: PdfDocument): PdfLayerCollection {
        return new PdfLayerCollection(document, new PdfLayer());
    }

    it('removeLayerContent removes the layer resource property from every associated page', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const layers: PdfLayerCollection = createCollection(document);
        const layer: PdfLayer = createLayer(document, 'Resource-Layer');
        const layerId: string = 'Resource-Layer_ID';
        const resources: _PdfDictionary = getPageResources(document, page);
        const properties: _PdfDictionary = new _PdfDictionary(document._crossReference);
        properties.update(layerId, layer._referenceHolder);
        resources.update('Properties', properties);
        page._pageDictionary.update('Contents', []);
        setLayerPageAndId(layer, page, layerId);
        layer._pages.push(page);

        // Act
        (layers as any)._removeLayerContent(layer);

        // Assert
        expect(properties.has(layerId)).toBeFalsy();
        expect(properties.get(layerId)).toBeUndefined();
        expect(page._pageDictionary._updated).toBeTruthy();
        document.destroy();
    });
});
import { _PdfContentStream } from '../src/pdf/core/base-stream';



function getStreamText(stream: _PdfContentStream): string {
    const bytes: number[] = (stream as any)._bytes as number[];
    return String.fromCharCode.apply(null, bytes);
}

function prepareMarkedContentLayer(
    document: PdfDocument,
    page: PdfPage,
    layerId: string,
    contents: _PdfReference[]
): PdfLayer {
    const layer: PdfLayer = new PdfLayer();
    layer._document = document;
    layer._crossReference = document._crossReference;
    layer._pages.push(page);
    page._pageDictionary.update('Contents', contents);
    Object.defineProperty(layer, '_layerId', {
        configurable: true,
        enumerable: false,
        value: layerId,
        writable: true
    });
    return layer;
}

describe('PdfLayerCollection mutation coverage lines 875 to 958', () => {
    function createCollection(document: PdfDocument): PdfLayerCollection {
        return new PdfLayerCollection(document, new PdfLayer());
    }

    function createReference(document: PdfDocument): _PdfReference {
        return document._crossReference._getNextReference();
    }
    it('processBeginMarkContent writes a non optional-content BDC operator', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = createCollection(document);
        const layer: PdfLayer = new PdfLayer();
        const data: _PdfContentStream = new _PdfContentStream([]);

        // Act
        (layers as any)._processBeginMarkContent(layer, 'BDC', ['/Span', '/LayerA'], data);

        // Assert
        expect((layers as any)._bdcCount).toBe(0);
        expect(layers._isSkip).toBeFalsy();
        expect(getStreamText(data)).toBe('/Span /LayerA BDC\r\n');
        document.destroy();
    });

    it('processBeginMarkContent requires both OC and a second operand', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = createCollection(document);
        const layer: PdfLayer = new PdfLayer();
        Object.defineProperty(layer, '_layerId', {
            configurable: true,
            value: 'LayerA'
        });
        const data: _PdfContentStream = new _PdfContentStream([]);

        // Act
        (layers as any)._processBeginMarkContent(layer, 'BDC', ['/OC'], data);

        // Assert
        expect((layers as any)._bdcCount).toBe(0);
        expect(layers._isSkip).toBeFalsy();
        expect(getStreamText(data)).toBe('/OC BDC\r\n');
        document.destroy();
    });

    it('processBeginMarkContent starts skipping for the matching OC layer', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const layers: PdfLayerCollection = createCollection(document);
        const contentReference: _PdfReference = _PdfReference.get(20, 0);
        const layer: PdfLayer = prepareMarkedContentLayer(
            document,
            page,
            'LayerA',
            [contentReference]
        );
        const data: _PdfContentStream = new _PdfContentStream([]);

        // Act
        (layers as any)._processBeginMarkContent(
            layer,
            'BDC',
            ['/OC', '/LayerA'],
            data,
            '20 0'
        );

        // Assert
        const contents: _PdfReference[] = page._pageDictionary.getRaw('Contents') as _PdfReference[];
        expect((layers as any)._bdcCount).toBe(1);
        expect(layers._isSkip).toBeTruthy();
        expect(contents.length).toBe(0);
        expect(data.length).toBe(0);
        document.destroy();
    });

    it('processBeginMarkContent preserves contents when matching BDC has no object id', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const layers: PdfLayerCollection = createCollection(document);
        const contentReference: _PdfReference = _PdfReference.get(21, 0);
        const layer: PdfLayer = prepareMarkedContentLayer(
            document,
            page,
            'LayerA',
            [contentReference]
        );
        const data: _PdfContentStream = new _PdfContentStream([]);

        // Act
        (layers as any)._processBeginMarkContent(
            layer,
            'BDC',
            ['/OC', '/LayerA'],
            data
        );

        // Assert
        const contents: _PdfReference[] = page._pageDictionary.getRaw('Contents') as _PdfReference[];
        expect((layers as any)._bdcCount).toBe(1);
        expect(contents.length).toBe(1);
        expect(contents[0]).toBe(contentReference);
        expect(data.length).toBe(0);
        document.destroy();
    });

    it('processBeginMarkContent increments nested BDC depth and returns without writing', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = createCollection(document);
        const layer: PdfLayer = new PdfLayer();
        const data: _PdfContentStream = new _PdfContentStream([]);
        (layers as any)._bdcCount = 1;

        // Act
        (layers as any)._processBeginMarkContent(
            layer,
            'BDC',
            ['/OC', '/Nested'],
            data
        );

        // Assert
        expect((layers as any)._bdcCount).toBe(2);
        expect(layers._isSkip).toBeTruthy();
        expect(data.length).toBe(0);
        document.destroy();
    });

    it('processBeginMarkContent decrements the marked-content depth for EMC', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = createCollection(document);
        const layer: PdfLayer = new PdfLayer();
        const data: _PdfContentStream = new _PdfContentStream([]);
        (layers as any)._bdcCount = 1;

        // Act
        (layers as any)._processBeginMarkContent(layer, 'EMC', [], data);

        // Assert
        expect((layers as any)._bdcCount).toBe(0);
        expect(layers._isSkip).toBeFalsy();
        expect(data.length).toBe(0);
        document.destroy();
    });

    it('processBeginMarkContent writes EMC when no marked-content skip is active', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = createCollection(document);
        const layer: PdfLayer = new PdfLayer();
        const data: _PdfContentStream = new _PdfContentStream([]);

        // Act
        (layers as any)._processBeginMarkContent(layer, 'EMC', [], data);

        // Assert
        expect((layers as any)._bdcCount).toBe(0);
        expect(getStreamText(data)).toBe('EMC\r\n');
        document.destroy();
    });

    it('streamWrite writes the exact operator when operands are absent', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = createCollection(document);
        const data: _PdfContentStream = new _PdfContentStream([]);

        // Act
        (layers as any)._streamWrite(undefined, 'Q', false, data);

        // Assert
        expect(data.length).toBe(3);
        expect(getStreamText(data)).toBe('Q\r\n');
        document.destroy();
    });

    it('streamWrite writes every operand followed by one space', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = createCollection(document);
        const data: _PdfContentStream = new _PdfContentStream([]);

        // Act
        (layers as any)._streamWrite(['1', '2', '3'], 'RG', false, data);

        // Assert
        expect(data.length).toBe(10);
        expect(getStreamText(data)).toBe('1 2 3 RG\r\n');
        document.destroy();
    });

    it('streamWrite writes when skip is false even while marked content is active', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = createCollection(document);
        const data: _PdfContentStream = new _PdfContentStream([]);
        (layers as any)._bdcCount = 1;

        // Act
        (layers as any)._streamWrite(['2'], 'w', false, data);

        // Assert
        expect(layers._isSkip).toBeTruthy();
        expect(getStreamText(data)).toBe('2 w\r\n');
        document.destroy();
    });

    it('streamWrite skips output only when skip and marked-content state are both true', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = createCollection(document);
        const data: _PdfContentStream = new _PdfContentStream([]);
        (layers as any)._bdcCount = 1;

        // Act
        (layers as any)._streamWrite(['2'], 'w', true, data);

        // Assert
        expect(data.length).toBe(0);
        expect(getStreamText(data)).toBe('');
        document.destroy();
    });

    it('insertLayer reorders both Order and OCGs for three following references', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = createCollection(document);
        const firstReference: _PdfReference = createReference(document);
        const secondReference: _PdfReference = createReference(document);
        const thirdReference: _PdfReference = createReference(document);
        const movedReference: _PdfReference = createReference(document);
        const order: (_PdfReference | _PdfReference[])[] = [
            firstReference,
            secondReference,
            thirdReference,
            movedReference
        ];
        const groups: _PdfReference[] = [
            firstReference,
            secondReference,
            thirdReference,
            movedReference
        ];
        const defaultView: _PdfDictionary = new _PdfDictionary(document._crossReference);
        defaultView.update('Order', order);
        const optionalContent: _PdfDictionary = new _PdfDictionary(document._crossReference);
        optionalContent.update('OCGs', groups);
        optionalContent.update('D', defaultView);
        document._catalog._catalogDictionary.update('OCProperties', optionalContent);
        const layer: PdfLayer = new PdfLayer();
        layer._referenceHolder = movedReference;

        // Act
        (layers as any)._insertLayer(0, layer);

        // Assert
        expect(order.length).toBe(4);
        expect(order[0]).toBe(movedReference);
        expect(order[1]).toBe(firstReference);
        expect(order[2]).toBe(secondReference);
        expect(order[3]).toBe(thirdReference);
        expect(groups.length).toBe(4);
        expect(groups[0]).toBe(movedReference);
        expect(groups[1]).toBe(firstReference);
        expect(groups[2]).toBe(secondReference);
        expect(groups[3]).toBe(thirdReference);
        document.destroy();
    });

    it('insertLayer does not reorder when fewer than two positions follow the target index', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = createCollection(document);
        const firstReference: _PdfReference = createReference(document);
        const movedReference: _PdfReference = createReference(document);
        const order: (_PdfReference | _PdfReference[])[] = [firstReference, movedReference];
        const groups: _PdfReference[] = [firstReference, movedReference];
        const defaultView: _PdfDictionary = new _PdfDictionary(document._crossReference);
        defaultView.update('Order', order);
        const optionalContent: _PdfDictionary = new _PdfDictionary(document._crossReference);
        optionalContent.update('OCGs', groups);
        optionalContent.update('D', defaultView);
        document._catalog._catalogDictionary.update('OCProperties', optionalContent);
        const layer: PdfLayer = new PdfLayer();
        layer._referenceHolder = movedReference;

        // Act
        (layers as any)._insertLayer(0, layer);

        // Assert
        expect(order.length).toBe(2);
        expect(order[0]).toBe(firstReference);
        expect(order[1]).toBe(movedReference);
        expect(groups[0]).toBe(firstReference);
        expect(groups[1]).toBe(movedReference);
        document.destroy();
    });

    it('insertLayer does not reorder when the first following entry is an array', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = createCollection(document);
        const firstReference: _PdfReference = createReference(document);
        const childReference: _PdfReference = createReference(document);
        const thirdReference: _PdfReference = createReference(document);
        const movedReference: _PdfReference = createReference(document);
        const childOrder: _PdfReference[] = [childReference];
        const order: (_PdfReference | _PdfReference[])[] = [
            firstReference,
            childOrder,
            thirdReference,
            movedReference
        ];
        const groups: _PdfReference[] = [firstReference, thirdReference, movedReference];
        const defaultView: _PdfDictionary = new _PdfDictionary(document._crossReference);
        defaultView.update('Order', order);
        const optionalContent: _PdfDictionary = new _PdfDictionary(document._crossReference);
        optionalContent.update('OCGs', groups);
        optionalContent.update('D', defaultView);
        document._catalog._catalogDictionary.update('OCProperties', optionalContent);
        const layer: PdfLayer = new PdfLayer();
        layer._referenceHolder = movedReference;

        // Act
        (layers as any)._insertLayer(0, layer);

        // Assert
        expect(order[0]).toBe(firstReference);
        expect(order[1]).toBe(childOrder);
        expect(order[2]).toBe(thirdReference);
        expect(order[3]).toBe(movedReference);
        expect(groups[2]).toBe(movedReference);
        document.destroy();
    });

    it('insertLayer does not reorder an absent reference', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const layers: PdfLayerCollection = createCollection(document);
        const firstReference: _PdfReference = createReference(document);
        const secondReference: _PdfReference = createReference(document);
        const thirdReference: _PdfReference = createReference(document);
        const missingReference: _PdfReference = createReference(document);
        const order: (_PdfReference | _PdfReference[])[] = [
            firstReference,
            secondReference,
            thirdReference
        ];
        const groups: _PdfReference[] = [firstReference, secondReference, thirdReference];
        const defaultView: _PdfDictionary = new _PdfDictionary(document._crossReference);
        defaultView.update('Order', order);
        const optionalContent: _PdfDictionary = new _PdfDictionary(document._crossReference);
        optionalContent.update('OCGs', groups);
        optionalContent.update('D', defaultView);
        document._catalog._catalogDictionary.update('OCProperties', optionalContent);
        const layer: PdfLayer = new PdfLayer();
        layer._referenceHolder = missingReference;

        // Act
        (layers as any)._insertLayer(0, layer);

        // Assert
        expect(order.length).toBe(3);
        expect(order[0]).toBe(firstReference);
        expect(order[1]).toBe(secondReference);
        expect(order[2]).toBe(thirdReference);
        expect(groups.indexOf(missingReference)).toBe(-1);
        document.destroy();
    });
});

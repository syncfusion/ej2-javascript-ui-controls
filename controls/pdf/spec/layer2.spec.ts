import { PdfPrintState } from '../src/pdf/core/enumerator';
import { PdfDocument } from '../src/pdf/core/pdf-document';
import { PdfPage } from '../src/pdf/core/pdf-page';
import { PdfLayer } from '../src/pdf/core/layers/layer';
import { PdfLayerCollection } from '../src/pdf/core/layers/layer-collection';
import {
    _PdfContentStream
} from '../src/pdf/core/base-stream';
import {
    _PdfDictionary,
    _PdfName,
    _PdfReference
} from '../src/pdf/core/pdf-primitives';
function createLayerHarness(): {
    document: PdfDocument;
    page: PdfPage;
    layer: PdfLayer;
} {
    const document: PdfDocument = new PdfDocument();
    const page: PdfPage = document.addPage();
    const layer: PdfLayer = document.layers.add('Mutation Layer');
    return { document, page, layer };
}
describe('PdfLayer lines 1 to 125 survived mutation coverage', () => {
    it('constructor initializes the exact default layer state', () => {
        // Arrange
        const layer: PdfLayer = new PdfLayer();
        const internalLayer: any = layer as any;
        // Act
        const content: _PdfContentStream = internalLayer._content;
        // Assert
        expect(content instanceof _PdfContentStream).toBeTruthy();
        expect(internalLayer._visible).toBeTruthy();
        expect(internalLayer._printState).toBe(PdfPrintState.printWhenVisible);
        expect(internalLayer._isEndState).toBeFalsy();
        expect(internalLayer._dictionary instanceof _PdfDictionary).toBeTruthy();
        expect(internalLayer._pages.length).toBe(0);
        expect(internalLayer._subLayer.length).toBe(0);
        expect(internalLayer._locked).toBeFalsy();
        expect(internalLayer._parentLayer.length).toBe(0);
        expect(internalLayer._child.length).toBe(0);
        expect(internalLayer._graphicsCollection.size).toBe(0);
        expect(internalLayer._pageGraphics.size).toBe(0);
        expect(internalLayer._pageParsed).toBeFalsy();
        expect(internalLayer._xObject.length).toBe(0);
    });
    it('_layerPage parses the page only when page parsing has not completed', () => {
        // Arrange
        const layer: PdfLayer = new PdfLayer();
        const internalLayer: any = layer as any;
        const document: PdfDocument = new PdfDocument();
        const expectedPage: PdfPage = document.addPage();
        const originalParseLayerPage: () => void =
            internalLayer._parseLayerPage;
        let parseCount: number = 0;
        internalLayer._pageParsed = false;
        internalLayer._parseLayerPage = (): void => {
            parseCount++;
            internalLayer._page = expectedPage;
            internalLayer._pageParsed = true;
        };
        // Act
        const firstPage: PdfPage = internalLayer._layerPage;
        const secondPage: PdfPage = internalLayer._layerPage;
        // Assert
        expect(firstPage).toBe(expectedPage);
        expect(secondPage).toBe(expectedPage);
        expect(parseCount).toBe(1);
        expect(internalLayer._pageParsed).toBeTruthy();
        internalLayer._parseLayerPage = originalParseLayerPage;
        document.destroy();
    });
    it('_layerPage returns the stored page without parsing when already parsed', () => {
        // Arrange
        const layer: PdfLayer = new PdfLayer();
        const internalLayer: any = layer as any;
        const document: PdfDocument = new PdfDocument();
        const expectedPage: PdfPage = document.addPage();
        const originalParseLayerPage: () => void =
            internalLayer._parseLayerPage;
        let parseCount: number = 0;
        internalLayer._pageParsed = true;
        internalLayer._page = expectedPage;
        internalLayer._parseLayerPage = (): void => {
            parseCount++;
        };
        // Act
        const result: PdfPage = internalLayer._layerPage;
        // Assert
        expect(result).toBe(expectedPage);
        expect(parseCount).toBe(0);
        internalLayer._parseLayerPage = originalParseLayerPage;
        document.destroy();
    });
    it('_layerId parses and returns the exact identifier when not previously parsed', () => {
        // Arrange
        const layer: PdfLayer = new PdfLayer();
        const internalLayer: any = layer as any;
        const originalParseLayerPage: () => void =
            internalLayer._parseLayerPage;
        let parseCount: number = 0;
        internalLayer._pageParsed = false;
        internalLayer._parseLayerPage = (): void => {
            parseCount++;
            internalLayer._id = 'ParsedLayerId';
            internalLayer._pageParsed = true;
        };
        // Act
        const firstIdentifier: string = internalLayer._layerId;
        const secondIdentifier: string = internalLayer._layerId;
        // Assert
        expect(firstIdentifier).toBe('ParsedLayerId');
        expect(secondIdentifier).toBe('ParsedLayerId');
        expect(parseCount).toBe(1);
        expect(internalLayer._pageParsed).toBeTruthy();
        internalLayer._parseLayerPage = originalParseLayerPage;
    });
    it('_layerId returns the stored identifier without parsing when already parsed', () => {
        // Arrange
        const layer: PdfLayer = new PdfLayer();
        const internalLayer: any = layer as any;
        const originalParseLayerPage: () => void =
            internalLayer._parseLayerPage;
        let parseCount: number = 0;
        internalLayer._pageParsed = true;
        internalLayer._id = 'StoredLayerId';
        internalLayer._parseLayerPage = (): void => {
            parseCount++;
        };
        // Act
        const result: string = internalLayer._layerId;
        // Assert
        expect(result).toBe('StoredLayerId');
        expect(parseCount).toBe(0);
        internalLayer._parseLayerPage = originalParseLayerPage;
    });
    it('_layerId setter stores the exact supplied identifier', () => {
        // Arrange
        const layer: PdfLayer = new PdfLayer();
        const internalLayer: any = layer as any;
        // Act
        internalLayer._layerId = 'LayerIdentifier';
        // Assert
        expect(internalLayer._layerId).toBe('LayerIdentifier');
        expect(internalLayer._id).toBe('LayerIdentifier');
    });
    it('name returns an empty string when internal name is undefined', () => {
        // Arrange
        const layer: PdfLayer = new PdfLayer();
        const internalLayer: any = layer as any;
        internalLayer._name = undefined;
        // Act
        const result: string = layer.name;
        // Assert
        expect(result).toBe('');
        expect(result.length).toBe(0);
    });
    it('name returns the exact stored non-empty name', () => {
        // Arrange
        const layer: PdfLayer = new PdfLayer();
        const internalLayer: any = layer as any;
        internalLayer._name = 'Professional Layer';
        // Act
        const result: string = layer.name;
        // Assert
        expect(result).toBe('Professional Layer');
        expect(result).not.toBe('');
    });
    it('name setter writes a non-empty name to the layer dictionary', () => {
        // Arrange
        const layer: PdfLayer = new PdfLayer();
        const internalLayer: any = layer as any;
        const dictionary: _PdfDictionary = new _PdfDictionary();
        internalLayer._dictionary = dictionary;
        // Act
        layer.name = 'Updated Layer';
        // Assert
        expect(layer.name).toBe('Updated Layer');
        expect(internalLayer._name).toBe('Updated Layer');
        expect(dictionary.has('Name')).toBeTruthy();
        expect(dictionary.get('Name')).toBe('Updated Layer');
    });
    it('name setter does not add Name to the dictionary for an empty name', () => {
        // Arrange
        const layer: PdfLayer = new PdfLayer();
        const internalLayer: any = layer as any;
        const dictionary: _PdfDictionary = new _PdfDictionary();
        internalLayer._dictionary = dictionary;
        // Act
        layer.name = '';
        // Assert
        expect(layer.name).toBe('');
        expect(internalLayer._name).toBe('');
        expect(dictionary.has('Name')).toBeFalsy();
    });
    it('name setter stores the name without updating when dictionary is unavailable', () => {
        // Arrange
        const layer: PdfLayer = new PdfLayer();
        const internalLayer: any = layer as any;
        internalLayer._dictionary = undefined;
        // Act
        layer.name = 'Stored Without Dictionary';
        // Assert
        expect(layer.name).toBe('Stored Without Dictionary');
        expect(internalLayer._name).toBe('Stored Without Dictionary');
        expect(internalLayer._dictionary).toBeUndefined();
    });
    it('visible reads and stores a boolean value from the layer dictionary', () => {
        // Arrange
        const layer: PdfLayer = new PdfLayer();
        const internalLayer: any = layer as any;
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('Visible', false);
        internalLayer._dictionary = dictionary;
        internalLayer._visible = true;
        // Act
        const result: boolean = layer.visible;
        // Assert
        expect(result).toBeFalsy();
        expect(internalLayer._visible).toBeFalsy();
        expect(dictionary.get('Visible')).toBeFalsy();
    });
    it('visible ignores a non-boolean dictionary value', () => {
        // Arrange
        const layer: PdfLayer = new PdfLayer();
        const internalLayer: any = layer as any;
        const dictionary: _PdfDictionary = new _PdfDictionary();
        dictionary.update('Visible', 'false');
        internalLayer._dictionary = dictionary;
        internalLayer._visible = true;
        // Act
        const result: boolean = layer.visible;
        // Assert
        expect(result).toBeTruthy();
        expect(internalLayer._visible).toBeTruthy();
        expect(dictionary.get('Visible')).toBe('false');
    });
    it('visible returns the stored value when dictionary is unavailable', () => {
        // Arrange
        const layer: PdfLayer = new PdfLayer();
        const internalLayer: any = layer as any;
        internalLayer._dictionary = undefined;
        internalLayer._visible = false;
        // Act
        const result: boolean = layer.visible;
        // Assert
        expect(result).toBeFalsy();
        expect(internalLayer._visible).toBeFalsy();
    });
    it('visible setter stores false and writes false to the dictionary', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            page: PdfPage;
            layer: PdfLayer;
        } = createLayerHarness();
        const internalLayer: any = harness.layer as any;
        // Act
        harness.layer.visible = false;
        // Assert
        expect(harness.layer.visible).toBeFalsy();
        expect(internalLayer._visible).toBeFalsy();
        expect(internalLayer._dictionary.get('Visible')).toBeFalsy();
        expect(
            harness.document._catalog._catalogDictionary._updated
        ).toBeTruthy();
        expect(internalLayer._crossReference._allowCatalog).toBeTruthy();
        harness.document.destroy();
    });
    it('visible setter stores true and writes true to the dictionary', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            page: PdfPage;
            layer: PdfLayer;
        } = createLayerHarness();
        const internalLayer: any = harness.layer as any;
        harness.layer.visible = false;
        // Act
        harness.layer.visible = true;
        // Assert
        expect(harness.layer.visible).toBeTruthy();
        expect(internalLayer._visible).toBeTruthy();
        expect(internalLayer._dictionary.get('Visible')).toBeTruthy();
        expect(
            harness.document._catalog._catalogDictionary._updated
        ).toBeTruthy();
        expect(internalLayer._crossReference._allowCatalog).toBeTruthy();
        harness.document.destroy();
    });
    it('locked returns the default unlocked state', () => {
        // Arrange
        const layer: PdfLayer = new PdfLayer();
        // Act
        const result: boolean = layer.locked;
        // Assert
        expect(result).toBeFalsy();
        expect(layer.locked).toBeFalsy();
    });
    it('locked setter stores true and adds the layer reference to Locked', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            page: PdfPage;
            layer: PdfLayer;
        } = createLayerHarness();
        const internalLayer: any = harness.layer as any;
        const catalog: _PdfDictionary =
            harness.document._catalog._catalogDictionary;
        const optionalContentProperties: _PdfDictionary =
            catalog.get('OCProperties') as _PdfDictionary;
        const defaultView: _PdfDictionary =
            optionalContentProperties.get('D') as _PdfDictionary;
        // Act
        harness.layer.locked = true;
        // Assert
        const lockedReferences: _PdfReference[] =
            defaultView.get('Locked') as _PdfReference[];
        expect(harness.layer.locked).toBeTruthy();
        expect(internalLayer._locked).toBeTruthy();
        expect(lockedReferences).toBeDefined();
        expect(
            lockedReferences.indexOf(internalLayer._referenceHolder)
        ).toBeGreaterThan(-1);
        expect(defaultView._updated).toBeTruthy();
        expect(optionalContentProperties._updated).toBeTruthy();
        expect(
            harness.document._catalog._catalogDictionary._updated
        ).toBeTruthy();
        expect(internalLayer._crossReference._allowCatalog).toBeTruthy();
        harness.document.destroy();
    });
    it('locked setter stores false and removes the layer reference from Locked', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            page: PdfPage;
            layer: PdfLayer;
        } = createLayerHarness();
        const internalLayer: any = harness.layer as any;
        harness.layer.locked = true;
        const catalog: _PdfDictionary =
            harness.document._catalog._catalogDictionary;
        const optionalContentProperties: _PdfDictionary =
            catalog.get('OCProperties') as _PdfDictionary;
        const defaultView: _PdfDictionary =
            optionalContentProperties.get('D') as _PdfDictionary;
        const lockedReferences: _PdfReference[] =
            defaultView.get('Locked') as _PdfReference[];
        // Act
        harness.layer.locked = false;
        // Assert
        expect(harness.layer.locked).toBeFalsy();
        expect(internalLayer._locked).toBeFalsy();
        expect(
            lockedReferences.indexOf(internalLayer._referenceHolder)
        ).toBe(-1);
        expect(defaultView._updated).toBeTruthy();
        expect(optionalContentProperties._updated).toBeTruthy();
        expect(
            harness.document._catalog._catalogDictionary._updated
        ).toBeTruthy();
        expect(internalLayer._crossReference._allowCatalog).toBeTruthy();
        harness.document.destroy();
    });
    it('printState returns printWhenVisible by default', () => {
        // Arrange
        const layer: PdfLayer = new PdfLayer();
        // Act
        const result: PdfPrintState = layer.printState;
        // Assert
        expect(result).toBe(PdfPrintState.printWhenVisible);
    });
    it('printState writes ON when an existing print option is set to alwaysPrint', () => {
        // Arrange
        const layer: PdfLayer = new PdfLayer();
        const internalLayer: any = layer as any;
        const printOption: _PdfDictionary = new _PdfDictionary();
        internalLayer._printOption = printOption;
        // Act
        layer.printState = PdfPrintState.alwaysPrint;
        // Assert
        const printStateName: _PdfName =
            printOption.get('PrintState') as _PdfName;
        expect(layer.printState).toBe(PdfPrintState.alwaysPrint);
        expect(internalLayer._printState).toBe(
            PdfPrintState.alwaysPrint
        );
        expect(printOption.has('PrintState')).toBeTruthy();
        expect(printStateName.name).toBe('ON');
    });
    it('printState writes OFF when an existing print option is set to neverPrint', () => {
        // Arrange
        const layer: PdfLayer = new PdfLayer();
        const internalLayer: any = layer as any;
        const printOption: _PdfDictionary = new _PdfDictionary();
        internalLayer._printOption = printOption;
        // Act
        layer.printState = PdfPrintState.neverPrint;
        // Assert
        const printStateName: _PdfName =
            printOption.get('PrintState') as _PdfName;
        expect(layer.printState).toBe(PdfPrintState.neverPrint);
        expect(internalLayer._printState).toBe(
            PdfPrintState.neverPrint
        );
        expect(printOption.has('PrintState')).toBeTruthy();
        expect(printStateName.name).toBe('OFF');
    });
    it('printState keeps the existing option unchanged for printWhenVisible', () => {
        // Arrange
        const layer: PdfLayer = new PdfLayer();
        const internalLayer: any = layer as any;
        const printOption: _PdfDictionary = new _PdfDictionary();
        internalLayer._printOption = printOption;
        // Act
        layer.printState = PdfPrintState.printWhenVisible;
        // Assert
        expect(layer.printState).toBe(PdfPrintState.printWhenVisible);
        expect(internalLayer._printState).toBe(
            PdfPrintState.printWhenVisible
        );
        expect(printOption.has('PrintState')).toBeFalsy();
    });
    it('layers creates a child collection once and returns the cached collection', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            page: PdfPage;
            layer: PdfLayer;
        } = createLayerHarness();
        const internalLayer: any = harness.layer as any;
        internalLayer._layers = undefined;
        // Act
        const firstCollection: PdfLayerCollection =
            harness.layer.layers;
        const secondCollection: PdfLayerCollection =
            harness.layer.layers;
        // Assert
        expect(firstCollection).toBeDefined();
        expect(firstCollection instanceof PdfLayerCollection).toBeTruthy();
        expect(secondCollection).toBe(firstCollection);
        expect(internalLayer._layers).toBe(firstCollection);
        expect((firstCollection as any)._subLayer).toBeTruthy();
        harness.document.destroy();
    });
    it('layers returns an existing collection without replacing it', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            page: PdfPage;
            layer: PdfLayer;
        } = createLayerHarness();
        const internalLayer: any = harness.layer as any;
        const existingCollection: PdfLayerCollection =
            harness.layer.layers;
        internalLayer._layers = existingCollection;
        // Act
        const result: PdfLayerCollection = harness.layer.layers;
        // Assert
        expect(result).toBe(existingCollection);
        expect(internalLayer._layers).toBe(existingCollection);
        expect((result as any)._subLayer).toBeTruthy();
        harness.document.destroy();
    });
});
describe('PdfLayer lines 134 to 171 survived mutation coverage', () => {
    it('kills mutant 136 by writing the exact save graphics-state stream bytes', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const layer: PdfLayer = document.layers.add(
            'Save graphics state layer'
        );
        // Act
        layer.createGraphics(page);
        // Assert
        const saveReference: _PdfReference =
            page._contents[0];
        const saveStream: _PdfContentStream =
            page._crossReference._cacheMap.get(
                saveReference
            ) as _PdfContentStream;
        const saveBytes: number[] =
            (saveStream as any)._bytes as number[];
        expect(saveStream).toBeDefined();
        expect(saveBytes).toBeDefined();
        expect(saveBytes.length).toBe(4);
        expect(saveBytes[0]).toBe(32);
        expect(saveBytes[1]).toBe(113);
        expect(saveBytes[2]).toBe(32);
        expect(saveBytes[3]).toBe(10);
        document.destroy();
    });
    it('kills mutant 137 by writing the exact restore graphics-state stream bytes', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const layer: PdfLayer = document.layers.add(
            'Restore graphics state layer'
        );
        // Act
        layer.createGraphics(page);
        // Assert
        const restoreReference: _PdfReference =
            page._contents[page._contents.length - 2];
        const restoreStream: _PdfContentStream =
            page._crossReference._cacheMap.get(
                restoreReference
            ) as _PdfContentStream;
        const restoreBytes: number[] =
            (restoreStream as any)._bytes as number[];
        expect(restoreStream).toBeDefined();
        expect(restoreBytes).toBeDefined();
        expect(restoreBytes.length).toBe(4);
        expect(restoreBytes[0]).toBe(32);
        expect(restoreBytes[1]).toBe(81);
        expect(restoreBytes[2]).toBe(32);
        expect(restoreBytes[3]).toBe(10);
        document.destroy();
    });
    it('kills mutant 138 by excluding injected content from the writable content stream', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const layer: PdfLayer = document.layers.add(
            'Writable content stream layer'
        );
        // Act
        layer.createGraphics(page);
        // Assert
        const contentReference: _PdfReference =
            page._contents[page._contents.length - 1];
        const contentStream: _PdfContentStream =
            page._crossReference._cacheMap.get(
                contentReference
            ) as _PdfContentStream;
        const contentBytes: Array<number | string> =
            (contentStream as any)._bytes as Array<number | string>;
        expect(contentStream).toBeDefined();
        expect(contentBytes).toBeDefined();
        expect(contentBytes.length).toBeGreaterThan(0);
        expect(typeof contentBytes[0]).toBe('number');
        expect(contentBytes[0]).not.toBe('Stryker was here');
        expect(
            contentBytes.indexOf('Stryker was here')
        ).toBe(-1);
        document.destroy();
    });
    it('kills mutant 140 by marking the page dictionary as updated', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const layer: PdfLayer = document.layers.add(
            'Updated page dictionary layer'
        );
        page._pageDictionary._updated = false;
        // Act
        layer.createGraphics(page);
        // Assert
        expect(
            page._pageDictionary._updated
        ).toBe(true);
        expect(
            page._pageDictionary._updated
        ).not.toBe(false);
        expect(
            page._pageDictionary.has('Contents')
        ).toBe(true);
        expect(
            page._pageDictionary.getRaw('Contents')
        ).toBe(page._contents);
        document.destroy();
    });
    it('kills mutant 142 by preserving the false branch when the graphics resource is undefined', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const layer: PdfLayer = document.layers.add(
            'Undefined resource conditional layer'
        );
        const internalLayer: any = layer as any;
        layer.createGraphics(page);
        const originalResource: _PdfDictionary =
            internalLayer._graphics._resourceObject;
        internalLayer._graphics._resourceObject =
            undefined;
        const initializeProperties: () => void =
            (): void => {
                internalLayer._initializeProperties();
            };
        // Act
        const result: () => void =
            initializeProperties;
        // Assert
        expect(result).toThrowError(
            TypeError,
            /Cannot read properties of undefined \(reading 'update'\)/
        );
        expect(
            internalLayer._graphics._resourceObject
        ).toBeUndefined();
        internalLayer._graphics._resourceObject =
            originalResource;
        expect(
            internalLayer._graphics._resourceObject
        ).toBe(originalResource);
        document.destroy();
    });
    it('kills mutant 144 by short-circuiting before Properties lookup for an undefined resource', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const layer: PdfLayer = document.layers.add(
            'Undefined resource logical layer'
        );
        const internalLayer: any = layer as any;
        layer.createGraphics(page);
        const originalResource: _PdfDictionary =
            internalLayer._graphics._resourceObject;
        internalLayer._graphics._resourceObject =
            undefined;
        const initializeProperties: () => void =
            (): void => {
                internalLayer._initializeProperties();
            };
        // Act
        const result: () => void =
            initializeProperties;
        // Assert
        expect(result).toThrowError(
            TypeError,
            /Cannot read properties of undefined \(reading 'update'\)/
        );
        expect(
            internalLayer._graphics._resourceObject
        ).toBeUndefined();
        internalLayer._graphics._resourceObject =
            originalResource;
        expect(
            internalLayer._graphics._resourceObject
        ).toBe(originalResource);
        document.destroy();
    });
    it('_initializeProperties updates the existing Properties dictionary with the exact layer reference', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const layer: PdfLayer = document.layers.add(
            'Existing properties layer'
        );
        const internalLayer: any = layer as any;
        layer.createGraphics(page);
        const resource: _PdfDictionary =
            internalLayer._graphics._resourceObject;
        const originalProperties: _PdfDictionary =
            resource.get(
                'Properties'
            ) as _PdfDictionary;
        const existingProperties: _PdfDictionary =
            new _PdfDictionary();
        resource.update(
            'Properties',
            existingProperties
        );
        // Act
        internalLayer._initializeProperties();
        // Assert
        const updatedProperties: _PdfDictionary =
            resource.get(
                'Properties'
            ) as _PdfDictionary;
        expect(
            updatedProperties
        ).toBe(existingProperties);
        expect(
            updatedProperties.has(internalLayer._id)
        ).toBe(true);
        expect(
            updatedProperties.getRaw(
                internalLayer._id
            )
        ).toBe(internalLayer._referenceHolder);
        resource.update(
            'Properties',
            originalProperties
        );
        expect(
            resource.get('Properties')
        ).toBe(originalProperties);
        document.destroy();
    });
    it('_initializeProperties creates Properties with the exact layer reference when it is absent', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const layer: PdfLayer = document.layers.add(
            'New properties layer'
        );
        const internalLayer: any = layer as any;
        layer.createGraphics(page);
        const originalResource: _PdfDictionary =
            internalLayer._graphics._resourceObject;
        const resourceWithoutProperties:
            _PdfDictionary =
            new _PdfDictionary(
                page._crossReference
            );
        internalLayer._graphics._resourceObject =
            resourceWithoutProperties;
        // Act
        internalLayer._initializeProperties();
        // Assert
        const createdProperties: _PdfDictionary =
            resourceWithoutProperties.get(
                'Properties'
            ) as _PdfDictionary;
        expect(
            resourceWithoutProperties.has(
                'Properties'
            )
        ).toBe(true);
        expect(
            createdProperties
        ).toBeDefined();
        expect(
            createdProperties.has(internalLayer._id)
        ).toBe(true);
        expect(
            createdProperties.getRaw(
                internalLayer._id
            )
        ).toBe(internalLayer._referenceHolder);
        internalLayer._graphics._resourceObject =
            originalResource;
        expect(
            internalLayer._graphics._resourceObject
        ).toBe(originalResource);
        document.destroy();
    });
});
import { PdfRotationAngle } from '../src/pdf/core/enumerator';
import { PdfGraphics } from '../src/pdf/core/graphics/pdf-graphics';
function makeLayerGraphicsHarness(name: string): {
    document: PdfDocument;
    page: PdfPage;
    layer: PdfLayer;
    internalLayer: any;
} {
    const document: PdfDocument = new PdfDocument();
    const page: PdfPage = document.addPage();
    const layer: PdfLayer = document.layers.add(name);
    const internalLayer: any = layer as any;
    return { document, page, layer, internalLayer };
}
function getLastContentStream(page: PdfPage): _PdfContentStream {
    const reference: _PdfReference = page._contents[page._contents.length - 1];
    return page._crossReference._cacheMap.get(reference) as _PdfContentStream;
}
function getStreamText(stream: _PdfContentStream): string {
    const values: Array<number | string> = (stream as any)._bytes as Array<number | string>;
    let result: string = '';
    values.forEach((value: number | string) => {
        if (typeof value === 'number') {
            result += String.fromCharCode(value);
        } else {
            result += value;
        }
    });
    return result;
}
function setPageOrigin(page: PdfPage, origin: number[]): void {
    const pageWidth: number = page.size.width;
    const pageHeight: number = page.size.height;
    page._pageDictionary.update('MediaBox', [
        origin[0],
        origin[1],
        origin[0] + pageWidth,
        origin[1] + pageHeight
    ]);
}
describe('PdfLayer lines 172 to 306 survived mutation coverage', () => {
    it('_loadContents retains a single stream reference', () => {
        // Arrange
        const harness = makeLayerGraphicsHarness('Single content reference');
        const stream: _PdfContentStream = new _PdfContentStream([10, 20]);
        const reference: _PdfReference = harness.page._crossReference._getNextReference();
        harness.page._crossReference._cacheMap.set(reference, stream);
        harness.page._pageDictionary.set('Contents', reference);
        harness.internalLayer._page = harness.page;
        harness.internalLayer._crossReference = harness.page._crossReference;
        // Act
        harness.internalLayer._loadContents();
        // Assert
        expect(harness.page._contents.length).toBe(1);
        expect(harness.page._contents[0]).toBe(reference);
        harness.document.destroy();
    });
    it('_loadContents uses the exact existing contents array', () => {
        // Arrange
        const harness = makeLayerGraphicsHarness('Contents array');
        const firstReference: _PdfReference = harness.page._crossReference._getNextReference();
        const secondReference: _PdfReference = harness.page._crossReference._getNextReference();
        const contents: _PdfReference[] = [firstReference, secondReference];
        harness.page._pageDictionary.set('Contents', contents);
        harness.internalLayer._page = harness.page;
        harness.internalLayer._crossReference = harness.page._crossReference;
        // Act
        harness.internalLayer._loadContents();
        // Assert
        expect(harness.page._contents).toBe(contents);
        expect(harness.page._contents.length).toBe(2);
        expect(harness.page._contents[0]).toBe(firstReference);
        expect(harness.page._contents[1]).toBe(secondReference);
        harness.document.destroy();
    });
    it('_loadContents creates an empty array when Contents is absent', () => {
        // Arrange
        const harness = makeLayerGraphicsHarness('Missing contents');
        harness.internalLayer._page = harness.page;
        harness.internalLayer._crossReference = harness.page._crossReference;
        // Act
        harness.internalLayer._loadContents();
        // Assert
        expect(harness.page._pageDictionary.has('Contents')).toBe(false);
        expect(harness.page._contents.length).toBe(0);
        harness.document.destroy();
    });
    it('_loadContents creates an empty array for a dictionary content value', () => {
        // Arrange
        const harness = makeLayerGraphicsHarness('Invalid contents');
        harness.page._pageDictionary.set('Contents', new _PdfDictionary());
        harness.internalLayer._page = harness.page;
        harness.internalLayer._crossReference = harness.page._crossReference;
        // Act
        harness.internalLayer._loadContents();
        // Assert
        expect(harness.page._contents.length).toBe(0);
        harness.document.destroy();
    });
    it('_initializeGraphics uses page size when CropBox is absent', () => {
        // Arrange
        const harness = makeLayerGraphicsHarness('Default page size');
        const expectedWidth: number = harness.page.size.width;
        const expectedHeight: number = harness.page.size.height;
        // Act
        const graphics: PdfGraphics = harness.layer.createGraphics(harness.page);
        // Assert
        expect(graphics).toBeDefined();
        expect((graphics as any)._size.width).toBe(expectedWidth);
        expect((graphics as any)._size.height).toBe(expectedHeight);
        expect((graphics as any)._cropBox).toBeUndefined();
        harness.document.destroy();
    });
    it('_initializeGraphics stores a non-matching CropBox on graphics', () => {
        // Arrange
        const harness = makeLayerGraphicsHarness('Ordinary crop box');
        const cropBox: number[] = [10, 20, 200, 300];
        harness.page._pageDictionary.update('CropBox', cropBox);
        // Act
        const graphics: PdfGraphics = harness.layer.createGraphics(harness.page);
        // Assert
        expect((graphics as any)._cropBox).toBe(cropBox);
        expect((graphics as any)._size.width).toBe(harness.page.size.width);
        expect((graphics as any)._size.height).toBe(harness.page.size.height);
        harness.document.destroy();
    });
    it('_initializeGraphics accepts the exact negative CropBox boundary', () => {
        // Arrange
        const harness = makeLayerGraphicsHarness('Valid negative crop box');
        const width: number = harness.page.size.width;
        const height: number = harness.page.size.height;
        const cropBox: number[] = [-width, -height, 0, 0];
        harness.page._pageDictionary.update('CropBox', cropBox);
        // Act
        const graphics: PdfGraphics = harness.layer.createGraphics(harness.page);
        // Assert
        expect((graphics as any)._cropBox).toBeUndefined();
        expect((graphics as any)._size.width).toBe(0);
        expect((graphics as any)._size.height).toBe(0);
        harness.document.destroy();
    });
    it('_initializeGraphics rejects CropBox zero and mismatch boundary cases', () => {
        const cropCases: Array<(width: number, height: number) => number[]> = [
            (_width: number, height: number): number[] => [0, -height, 10, 10],
            (width: number, _height: number): number[] => [-width, 0, 10, 10],
            (width: number, height: number): number[] => [-width, -(height - 1), 0, 0],
            (width: number, height: number): number[] => [-(width - 1), -height, 0, 0]
        ];
        cropCases.forEach((createCropBox: (width: number, height: number) => number[]) => {
            // Arrange
            const harness = makeLayerGraphicsHarness('Rejected crop box');
            const cropBox: number[] = createCropBox(harness.page.size.width, harness.page.size.height);
            harness.page._pageDictionary.update('CropBox', cropBox);
            // Act
            const graphics: PdfGraphics = harness.layer.createGraphics(harness.page);
            // Assert
            expect((graphics as any)._cropBox).toBe(cropBox);
            expect((graphics as any)._size.width).toBe(harness.page.size.width);
            expect((graphics as any)._size.height).toBe(harness.page.size.height);
            harness.document.destroy();
        });
    });
    it('_initializeGraphics processes a valid negative MediaBox', () => {
        // Arrange
        const harness = makeLayerGraphicsHarness('Valid negative media box');
        const width: number = harness.page.size.width;
        const height: number = harness.page.size.height;
        harness.page._pageDictionary.update('MediaBox', [-width, -height, width, height]);
        // Act
        const graphics: PdfGraphics = harness.layer.createGraphics(harness.page);
        // Assert
        expect((graphics as any)._size.width).toBe(width);
        expect((graphics as any)._size.height).toBe(height);
        expect((graphics as any)._mediaBoxUpperRightBound).toBe(height);
        harness.document.destroy();
    });
    it('_initializeGraphics uses page size when CropBox has fewer than four values', () => {
        // Arrange
        const harness = makeLayerGraphicsHarness('Short crop box');
        harness.page._pageDictionary.update(
            'CropBox',
            [1, 2, 3]
        );
        const expectedWidth: number =
            harness.page.size.width;
        const expectedHeight: number =
            harness.page.size.height;
        // Act
        const graphics: PdfGraphics =
            harness.layer.createGraphics(
                harness.page
            );
        // Assert
        const actualWidth: number =
            (graphics as any)._size.width;
        const actualHeight: number =
            (graphics as any)._size.height;
        expect(
            Object.is(actualWidth, expectedWidth)
        ).toBe(true);
        expect(
            Object.is(actualHeight, expectedHeight)
        ).toBe(true);
        expect(
            (graphics as any)._cropBox
        ).toBeUndefined();
        harness.document.destroy();
    });
    it('_initializeGraphics normalizes an all-negative MediaBox', () => {
        // Arrange
        const harness = makeLayerGraphicsHarness(
            'All negative media box'
        );
        const width: number =
            harness.page.size.width;
        const height: number =
            harness.page.size.height;
        const mediaBox: number[] = [
            -width,
            -height,
            -width,
            -height
        ];
        harness.page._pageDictionary.update(
            'MediaBox',
            mediaBox
        );
        // Act
        const graphics: PdfGraphics =
            harness.layer.createGraphics(
                harness.page
            );
        // Assert
        expect(
            (graphics as any)._size.width
        ).toBe(width);
        expect(
            (graphics as any)._size.height
        ).toBe(height);
        expect(
            (graphics as any)._mediaBoxUpperRightBound
        ).toBe(-height);
        harness.document.destroy();
    });
    it('_initializeGraphics preserves page size for invalid MediaBox boundaries', () => {
        const mediaCases: Array<(width: number, height: number) => number[]> = [
            (_width: number, height: number): number[] => [0, -height, 10, 20],
            (width: number, _height: number): number[] => [-width, 0, 10, 20],
            (width: number, height: number): number[] => [-width, -height, 0, 20],
            (width: number, height: number): number[] => [-width, -height, 10, 0],
            (width: number, height: number): number[] => [-width, -(height - 1), width, height],
            (width: number, height: number): number[] => [-width, -height, width - 1, height]
        ];
        mediaCases.forEach((createMediaBox: (width: number, height: number) => number[]) => {
            // Arrange
            const harness = makeLayerGraphicsHarness('Invalid media box');
            const expectedWidth: number = harness.page.size.width;
            const expectedHeight: number = harness.page.size.height;
            const mediaBox: number[] = createMediaBox(expectedWidth, expectedHeight);
            harness.page._pageDictionary.update('MediaBox', mediaBox);
            // Act
            const graphics: PdfGraphics = harness.layer.createGraphics(harness.page);
            // Assert
            expect((graphics as any)._size.width).toBe(expectedWidth);
            expect((graphics as any)._size.height).toBe(expectedHeight);
            expect((graphics as any)._mediaBoxUpperRightBound).toBe(mediaBox[3]);
            harness.document.destroy();
        });
    });
    it('_initializeGraphics initializes coordinates for non-negative and mixed-sign origins', () => {
        const origins: number[][] = [[1, 1], [0, 0], [1, -1], [-1, 1]];
        origins.forEach((origin: number[]) => {
            // Arrange
            const harness = makeLayerGraphicsHarness('Direct coordinates origin');
            setPageOrigin(harness.page, origin);
            // Act
            const graphics: PdfGraphics = harness.layer.createGraphics(harness.page);
            // Assert
            expect(harness.page._origin[0]).toBe(origin[0]);
            expect(harness.page._origin[1]).toBe(origin[1]);
            expect((graphics as any)._clipBounds.length).toBe(4);
            expect((graphics as any)._layer).toBe(harness.layer);
            harness.document.destroy();
        });
    });
    it('_initializeGraphics initializes page coordinates for same-sign negative origins', () => {
        const origins: number[][] = [[-1, -1], [-1, 0], [0, -1]];
        origins.forEach((origin: number[]) => {
            // Arrange
            const harness = makeLayerGraphicsHarness('Page coordinates origin');
            setPageOrigin(harness.page, origin);
            // Act
            const graphics: PdfGraphics = harness.layer.createGraphics(harness.page);
            // Assert
            expect(harness.page._origin[0]).toBe(origin[0]);
            expect(harness.page._origin[1]).toBe(origin[1]);
            expect((graphics as any)._clipBounds.length).toBe(4);
            expect(harness.internalLayer._graphicsState).toBeDefined();
            harness.document.destroy();
        });
    });
    it('_initializeGraphics applies explicit Rotate dictionary values', () => {
        const rotations: number[] = [90, 180, 270];
        rotations.forEach((rotation: number) => {
            // Arrange
            const baselineHarness = makeLayerGraphicsHarness('Rotation baseline');
            baselineHarness.page._isNew = false;
            (baselineHarness.page as any)._rotation = PdfRotationAngle.angle0;
            const baselineGraphics: PdfGraphics = baselineHarness.layer.createGraphics(baselineHarness.page);
            const baselineContent: string = getStreamText(getLastContentStream(baselineHarness.page));
            const harness = makeLayerGraphicsHarness('Explicit rotation');
            harness.page._isNew = false;
            harness.page._pageDictionary.update('Rotate', rotation);
            // Act
            const graphics: PdfGraphics = harness.layer.createGraphics(harness.page);
            // Assert
            const content: string = getStreamText(getLastContentStream(harness.page));
            expect(graphics).toBeDefined();
            expect(harness.page._pageDictionary.get('Rotate')).toBe(rotation);
            expect(content).not.toBe(baselineContent);
            expect((baselineGraphics as any)._clipBounds.length).toBe(4);
            if (rotation === 90) {
                expect((graphics as any)._clipBounds[2]).toBe(harness.page.size.width);
                expect((graphics as any)._clipBounds[3]).toBe(harness.page.size.height);
            } else if (rotation === 180) {
                expect((graphics as any)._clipBounds.length).toBe(4);
            } else {
                expect((graphics as any)._clipBounds[2]).toBe(harness.page.size.height);
                expect((graphics as any)._clipBounds[3]).toBe(harness.page.size.width);
            }
            baselineHarness.document.destroy();
            harness.document.destroy();
        });
    });
    it('_initializeGraphics converts rotation enum values when Rotate is absent', () => {
        const rotations: PdfRotationAngle[] = [
            PdfRotationAngle.angle90,
            PdfRotationAngle.angle180,
            PdfRotationAngle.angle270
        ];
        rotations.forEach((rotation: PdfRotationAngle) => {
            // Arrange
            const baselineHarness = makeLayerGraphicsHarness('Enum baseline');
            baselineHarness.page._isNew = false;
            (baselineHarness.page as any)._rotation = PdfRotationAngle.angle0;
            baselineHarness.layer.createGraphics(baselineHarness.page);
            const baselineContent: string = getStreamText(getLastContentStream(baselineHarness.page));
            const harness = makeLayerGraphicsHarness('Enum rotation');
            harness.page._isNew = false;
            (harness.page as any)._rotation = rotation;
            expect(harness.page._pageDictionary.has('Rotate')).toBe(false);
            // Act
            const graphics: PdfGraphics = harness.layer.createGraphics(harness.page);
            // Assert
            const content: string = getStreamText(getLastContentStream(harness.page));
            expect(harness.page.rotation).toBe(rotation);
            expect(content).not.toBe(baselineContent);
            expect(graphics).toBeDefined();
            baselineHarness.document.destroy();
            harness.document.destroy();
        });
    });
    it('_initializeGraphics does not rotate an angle0 page without Rotate', () => {
        // Arrange
        const harness = makeLayerGraphicsHarness('No rotation');
        harness.page._isNew = false;
        (harness.page as any)._rotation = PdfRotationAngle.angle0;
        expect(harness.page._pageDictionary.has('Rotate')).toBe(false);
        // Act
        const graphics: PdfGraphics = harness.layer.createGraphics(harness.page);
        // Assert
        expect(graphics).toBeDefined();
        expect(harness.page.rotation).toBe(PdfRotationAngle.angle0);
        expect(harness.page._pageDictionary.has('Rotate')).toBe(false);
        expect((graphics as any)._clipBounds.length).toBe(4);
        harness.document.destroy();
    });
    it('_initializeGraphics stores graphics in collections exactly once and preserves page entries', () => {
        // Arrange
        const harness = makeLayerGraphicsHarness('Graphics collections');
        // Act
        const firstGraphics: PdfGraphics = harness.layer.createGraphics(harness.page);
        const secondGraphics: PdfGraphics = harness.layer.createGraphics(harness.page);
        harness.internalLayer._needInitializeGraphics = true;
        const newGraphics: PdfGraphics = harness.layer.createGraphics(harness.page);
        // Assert
        expect(secondGraphics).toBe(firstGraphics);
        expect(newGraphics).not.toBe(firstGraphics);
        expect(harness.internalLayer._graphicsCollection.size).toBe(2);
        expect(harness.internalLayer._graphicsCollection.get(firstGraphics)).toBe(firstGraphics);
        expect(harness.internalLayer._graphicsCollection.get(newGraphics)).toBe(newGraphics);
        expect(harness.internalLayer._pageGraphics.size).toBe(1);
        expect(harness.internalLayer._pageGraphics.get(harness.page)).toBe(firstGraphics);
        expect(harness.internalLayer._pages.length).toBe(1);
        expect(harness.internalLayer._pages[0]).toBe(harness.page);
        expect((newGraphics as any)._layer).toBe(harness.layer);
        expect(harness.internalLayer._needInitializeGraphics).toBe(false);
        harness.document.destroy();
    });
});
function makeBeginLayerHarness(name: string): {
    document: PdfDocument;
    page: PdfPage;
    layer: PdfLayer;
    graphics: PdfGraphics;
    contentStream: _PdfContentStream;
    internalLayer: any;
} {
    const document: PdfDocument = new PdfDocument();
    const page: PdfPage = document.addPage();
    const layer: PdfLayer = document.layers.add(name);
    const graphics: PdfGraphics = layer.createGraphics(page);
    const reference: _PdfReference = page._contents[page._contents.length - 1];
    const contentStream: _PdfContentStream =
        page._crossReference._cacheMap.get(reference) as _PdfContentStream;
    const internalLayer: any = layer as any;
    return { document, page, layer, graphics, contentStream, internalLayer };
}
function getContentValues(stream: _PdfContentStream): Array<number | string> {
    return (stream as any)._bytes as Array<number | string>;
}
function getContentText(stream: _PdfContentStream): string {
    const values: Array<number | string> = getContentValues(stream);
    let text: string = '';
    values.forEach((value: number | string) => {
        if (typeof value === 'number') {
            text += String.fromCharCode(value);
        } else {
            text += value;
        }
    });
    return text;
}
function makeVisibilityHarness(name: string): {
    document: PdfDocument;
    page: PdfPage;
    layer: PdfLayer;
    internalLayer: any;
    optionalContentProperties: _PdfDictionary;
    defaultView: _PdfDictionary;
    reference: _PdfReference;
} {
    const document: PdfDocument = new PdfDocument();
    const page: PdfPage = document.addPage();
    const layer: PdfLayer = document.layers.add(name);
    const internalLayer: any = layer as any;
    const reference: _PdfReference = internalLayer._referenceHolder;
    const optionalContentProperties: _PdfDictionary = new _PdfDictionary(page._crossReference);
    const defaultView: _PdfDictionary = new _PdfDictionary(page._crossReference);
    optionalContentProperties.update('D', defaultView);
    document._catalog._catalogDictionary.update('OCProperties', optionalContentProperties);
    return {
        document,
        page,
        layer,
        internalLayer,
        optionalContentProperties,
        defaultView,
        reference
    };
}
describe('PdfLayer lines 307 to 405 survived mutation coverage', () => {
    it('_beginLayer selects the graphics instance stored in the graphics collection', () => {
        // Arrange
        const harness = makeBeginLayerHarness('Stored graphics layer');
        const storedGraphics: PdfGraphics = harness.graphics;
        harness.internalLayer._graphics = undefined;
        // Act
        harness.internalLayer._beginLayer(storedGraphics);
        // Assert
        expect(harness.internalLayer._graphics).toBe(storedGraphics);
        expect((storedGraphics as any)._isEmptyLayer).toBe(true);
        expect(harness.internalLayer._isEndState).toBe(true);
        expect(getContentText(harness.contentStream).indexOf('/OC /')).not.toBe(-1);
        harness.document.destroy();
    });
    it('_beginLayer uses current graphics when the collection does not contain it', () => {
        // Arrange
        const firstHarness = makeBeginLayerHarness('First graphics layer');
        const secondDocument: PdfDocument = new PdfDocument();
        const secondPage: PdfPage = secondDocument.addPage();
        const secondLayer: PdfLayer = secondDocument.layers.add('Second graphics layer');
        const currentGraphics: PdfGraphics = secondLayer.createGraphics(secondPage);
        // Act
        firstHarness.internalLayer._beginLayer(currentGraphics);
        // Assert
        expect(firstHarness.internalLayer._graphics).toBe(currentGraphics);
        expect((currentGraphics as any)._isEmptyLayer).toBe(true);
        expect(firstHarness.internalLayer._isEndState).toBe(true);
        firstHarness.document.destroy();
        secondDocument.destroy();
    });
    it('_beginLayer does not write when graphics is unavailable', () => {
        // Arrange
        const harness = makeBeginLayerHarness('Unavailable graphics layer');
        const originalLength: number = getContentValues(harness.contentStream).length;
        const currentGraphics: PdfGraphics = harness.graphics;
        harness.internalLayer._graphicsCollection = undefined;
        harness.internalLayer._graphics = undefined;
        // Act
        harness.internalLayer._beginLayer(currentGraphics);
        // Assert
        expect(harness.internalLayer._graphics).toBeUndefined();
        expect(harness.internalLayer._isEndState).toBe(false);
        expect(getContentValues(harness.contentStream).length).toBe(originalLength);
        harness.document.destroy();
    });
    it('_beginLayer does not write for an empty layer name', () => {
        // Arrange
        const harness = makeBeginLayerHarness(
            'Temporary layer name'
        );
        const originalLength: number =
            getContentValues(
                harness.contentStream
            ).length;
        harness.internalLayer._name = '';
        // Act
        harness.internalLayer._beginLayer(
            harness.graphics
        );
        // Assert
        expect(
            (harness.graphics as any)._isEmptyLayer
        ).toBeUndefined();
        expect(
            harness.internalLayer._isEndState
        ).toBe(false);
        expect(
            getContentValues(
                harness.contentStream
            ).length
        ).toBe(originalLength);
        harness.document.destroy();
    });
    it('_beginLayer writes the exact child marker and sets layer states', () => {
        // Arrange
        const harness = makeBeginLayerHarness('Child marker layer');
        const expectedMarker: string = '/OC /' + harness.internalLayer._id + ' BDC';
        // Act
        harness.internalLayer._beginLayer(harness.graphics);
        // Assert
        const content: string = getContentText(harness.contentStream);
        expect((harness.graphics as any)._isEmptyLayer).toBe(true);
        expect(harness.internalLayer._isEndState).toBe(true);
        expect(content.indexOf(expectedMarker)).not.toBe(-1);
        expect(content.indexOf('Stryker was here!')).toBe(-1);
        harness.document.destroy();
    });
    it('_beginLayer writes parent markers before the child marker', () => {
        // Arrange
        const harness = makeBeginLayerHarness('Nested child layer');
        const parentLayer: PdfLayer = harness.document.layers.add('Nested parent layer');
        const internalParent: any = parentLayer as any;
        harness.internalLayer._parentLayer.push(parentLayer);
        const parentMarker: string = '/OC /' + internalParent._id + ' BDC';
        const childMarker: string = '/OC /' + harness.internalLayer._id + ' BDC';
        // Act
        harness.internalLayer._beginLayer(harness.graphics);
        // Assert
        const content: string = getContentText(harness.contentStream);
        expect(content.indexOf(parentMarker)).not.toBe(-1);
        expect(content.indexOf(childMarker)).not.toBe(-1);
        expect(content.indexOf(parentMarker)).toBeLessThan(content.indexOf(childMarker));
        expect(harness.internalLayer._isEndState).toBe(true);
        harness.document.destroy();
    });
    it('_beginLayer skips a parent that has an empty identifier', () => {
        // Arrange
        const harness = makeBeginLayerHarness('Child with invalid parent');
        const parentLayer: PdfLayer = harness.document.layers.add('Invalid parent layer');
        const internalParent: any = parentLayer as any;
        const originalParentId: string = internalParent._id;
        internalParent._id = '';
        internalParent._pageParsed = true;
        harness.internalLayer._parentLayer.push(parentLayer);
        const childMarker: string = '/OC /' + harness.internalLayer._id + ' BDC';
        // Act
        harness.internalLayer._beginLayer(harness.graphics);
        // Assert
        const content: string = getContentText(harness.contentStream);
        expect(content.indexOf('/OC /' + originalParentId + ' BDC')).toBe(-1);
        expect(content.indexOf(childMarker)).not.toBe(-1);
        expect(harness.internalLayer._parentLayer.length).toBe(1);
        internalParent._id = originalParentId;
        harness.document.destroy();
    });
    it('_setVisibility false removes the exact reference from ON and creates OFF', () => {
        // Arrange
        const harness = makeVisibilityHarness('Invisible layer');
        const anotherReference: _PdfReference = harness.page._crossReference._getNextReference();
        const onReferences: _PdfReference[] = [anotherReference, harness.reference];
        harness.defaultView.update('ON', onReferences);
        // Act
        harness.internalLayer._setVisibility(false);
        // Assert
        const offReferences: _PdfReference[] = harness.defaultView.get('OFF') as _PdfReference[];
        expect(onReferences.length).toBe(1);
        expect(onReferences[0]).toBe(anotherReference);
        expect(onReferences.indexOf(harness.reference)).toBe(-1);
        expect(offReferences.length).toBe(1);
        expect(offReferences[0]).toBe(harness.reference);
        expect(harness.defaultView._updated).toBe(true);
        expect(harness.optionalContentProperties._updated).toBe(true);
        harness.document.destroy();
    });
    it('_setVisibility false removes an existing OFF reference before adding it once', () => {
        // Arrange
        const harness = makeVisibilityHarness('Existing OFF layer');
        const firstReference: _PdfReference = harness.page._crossReference._getNextReference();
        const trailingReference: _PdfReference = harness.page._crossReference._getNextReference();
        const offReferences: _PdfReference[] = [firstReference, harness.reference, trailingReference];
        harness.defaultView.update('OFF', offReferences);
        // Act
        harness.internalLayer._setVisibility(false);
        // Assert
        expect(offReferences.length).toBe(2);
        expect(offReferences[0]).toBe(firstReference);
        expect(offReferences[1]).toBe(harness.reference);
        expect(offReferences.indexOf(trailingReference)).toBe(-1);
        expect(offReferences.indexOf(harness.reference)).toBe(1);
        harness.document.destroy();
    });
    it('_setVisibility false appends the reference when ON does not contain it', () => {
        // Arrange
        const harness = makeVisibilityHarness('Absent ON reference layer');
        const anotherReference: _PdfReference = harness.page._crossReference._getNextReference();
        const onReferences: _PdfReference[] = [anotherReference];
        const offReferences: _PdfReference[] = [];
        harness.defaultView.update('ON', onReferences);
        harness.defaultView.update('OFF', offReferences);
        // Act
        harness.internalLayer._setVisibility(false);
        // Assert
        expect(onReferences.length).toBe(1);
        expect(onReferences[0]).toBe(anotherReference);
        expect(offReferences.length).toBe(1);
        expect(offReferences[0]).toBe(harness.reference);
        harness.document.destroy();
    });
    it('_setVisibility true removes the exact reference from OFF and appends it to ON', () => {
        // Arrange
        const harness = makeVisibilityHarness('Visible layer');
        const firstReference: _PdfReference = harness.page._crossReference._getNextReference();
        const trailingReference: _PdfReference = harness.page._crossReference._getNextReference();
        const onReferences: _PdfReference[] = [firstReference];
        const offReferences: _PdfReference[] = [trailingReference, harness.reference];
        harness.defaultView.update('ON', onReferences);
        harness.defaultView.update('OFF', offReferences);
        // Act
        harness.internalLayer._setVisibility(true);
        // Assert
        expect(offReferences.length).toBe(1);
        expect(offReferences[0]).toBe(trailingReference);
        expect(offReferences.indexOf(harness.reference)).toBe(-1);
        expect(onReferences.length).toBe(2);
        expect(onReferences[0]).toBe(firstReference);
        expect(onReferences[1]).toBe(harness.reference);
        expect(harness.defaultView._updated).toBe(true);
        expect(harness.optionalContentProperties._updated).toBe(true);
        harness.document.destroy();
    });
    it('_setVisibility true removes an existing ON reference before adding it once', () => {
        // Arrange
        const harness = makeVisibilityHarness('Existing ON layer');
        const firstReference: _PdfReference = harness.page._crossReference._getNextReference();
        const trailingReference: _PdfReference = harness.page._crossReference._getNextReference();
        const onReferences: _PdfReference[] = [firstReference, harness.reference, trailingReference];
        const offReferences: _PdfReference[] = [];
        harness.defaultView.update('ON', onReferences);
        harness.defaultView.update('OFF', offReferences);
        // Act
        harness.internalLayer._setVisibility(true);
        // Assert
        expect(onReferences.length).toBe(2);
        expect(onReferences[0]).toBe(firstReference);
        expect(onReferences[1]).toBe(harness.reference);
        expect(onReferences.indexOf(trailingReference)).toBe(-1);
        expect(onReferences.indexOf(harness.reference)).toBe(1);
        expect(offReferences.length).toBe(0);
        harness.document.destroy();
    });
    it('_setVisibility true leaves OFF unchanged when the reference is absent', () => {
        // Arrange
        const harness = makeVisibilityHarness('Reference absent from OFF');
        const anotherReference: _PdfReference = harness.page._crossReference._getNextReference();
        const onReferences: _PdfReference[] = [];
        const offReferences: _PdfReference[] = [anotherReference];
        harness.defaultView.update('ON', onReferences);
        harness.defaultView.update('OFF', offReferences);
        // Act
        harness.internalLayer._setVisibility(true);
        // Assert
        expect(offReferences.length).toBe(1);
        expect(offReferences[0]).toBe(anotherReference);
        expect(onReferences.length).toBe(1);
        expect(onReferences[0]).toBe(harness.reference);
        harness.document.destroy();
    });
    it('_setVisibility does not change arrays when the layer reference is unavailable', () => {
        // Arrange
        const harness = makeVisibilityHarness('Missing layer reference');
        const onReference: _PdfReference = harness.page._crossReference._getNextReference();
        const offReference: _PdfReference = harness.page._crossReference._getNextReference();
        const onReferences: _PdfReference[] = [onReference];
        const offReferences: _PdfReference[] = [offReference];
        harness.defaultView.update('ON', onReferences);
        harness.defaultView.update('OFF', offReferences);
        const originalReference: _PdfReference = harness.internalLayer._referenceHolder;
        harness.internalLayer._referenceHolder = undefined;
        // Act
        harness.internalLayer._setVisibility(false);
        // Assert
        expect(onReferences.length).toBe(1);
        expect(onReferences[0]).toBe(onReference);
        expect(offReferences.length).toBe(1);
        expect(offReferences[0]).toBe(offReference);
        expect(harness.defaultView._updated).toBe(true);
        expect(harness.optionalContentProperties._updated).toBe(true);
        harness.internalLayer._referenceHolder = originalReference;
        harness.document.destroy();
    });
    it('_setVisibility does not update optional content data when OCProperties is absent', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const layer: PdfLayer = document.layers.add('No optional content properties');
        const internalLayer: any = layer as any;
        const catalog: _PdfDictionary = document._catalog._catalogDictionary;
        const originalOptionalContentProperties: _PdfDictionary =
            catalog.get('OCProperties') as _PdfDictionary;
        catalog.set('OCProperties', undefined);
        // Act
        internalLayer._setVisibility(false);
        // Assert
        expect(catalog.get('OCProperties')).toBeUndefined();
        expect(internalLayer._visible).toBe(true);
        catalog.update('OCProperties', originalOptionalContentProperties);
        document.destroy();
    });
});
import { _PdfStream } from '../src/pdf/core/base-stream';
function makeLockHarness(name: string): {
    document: PdfDocument;
    page: PdfPage;
    layer: PdfLayer;
    internalLayer: any;
    optionalContentProperties: _PdfDictionary;
    defaultView: _PdfDictionary;
    reference: _PdfReference;
} {
    const document: PdfDocument = new PdfDocument();
    const page: PdfPage = document.addPage();
    const layer: PdfLayer = document.layers.add(name);
    const internalLayer: any = layer as any;
    const reference: _PdfReference = internalLayer._referenceHolder;
    const optionalContentProperties: _PdfDictionary = new _PdfDictionary(page._crossReference);
    const defaultView: _PdfDictionary = new _PdfDictionary(page._crossReference);
    optionalContentProperties.update('D', defaultView);
    document._catalog._catalogDictionary.update('OCProperties', optionalContentProperties);
    return {
        document,
        page,
        layer,
        internalLayer,
        optionalContentProperties,
        defaultView,
        reference
    };
}
function makeLayerPageHarness(name: string): {
    document: PdfDocument;
    page: PdfPage;
    layer: PdfLayer;
    internalLayer: any;
    resources: _PdfDictionary;
} {
    const document: PdfDocument = new PdfDocument();
    const page: PdfPage = document.addPage();
    const layer: PdfLayer = document.layers.add(name);
    const internalLayer: any = layer as any;
    const resources: _PdfDictionary = new _PdfDictionary(page._crossReference);
    page._pageDictionary.update('Resources', resources);
    internalLayer._pageParsed = false;
    internalLayer._page = undefined;
    internalLayer._pages = [];
    internalLayer._xObject = [];
    return { document, page, layer, internalLayer, resources };
}
describe('PdfLayer lines 405 to 495 survived mutation coverage', () => {
    it('_setLock creates Locked with the exact layer reference', () => {
        // Arrange
        const harness = makeLockHarness('Create locked reference');
        // Act
        harness.internalLayer._setLock(true);
        // Assert
        const locked: _PdfReference[] = harness.defaultView.get('Locked') as _PdfReference[];
        expect(locked.length).toBe(1);
        expect(locked[0]).toBe(harness.reference);
        expect(harness.internalLayer._lock).toBe(locked);
        expect(harness.defaultView._updated).toBe(true);
        expect(harness.optionalContentProperties._updated).toBe(true);
        harness.document.destroy();
    });
    it('_setLock appends a reference that is not already locked', () => {
        // Arrange
        const harness = makeLockHarness('Append locked reference');
        const existingReference: _PdfReference = harness.page._crossReference._getNextReference();
        const locked: _PdfReference[] = [existingReference];
        harness.defaultView.update('Locked', locked);
        // Act
        harness.internalLayer._setLock(true);
        // Assert
        expect(locked.length).toBe(2);
        expect(locked[0]).toBe(existingReference);
        expect(locked[1]).toBe(harness.reference);
        expect(harness.defaultView._updated).toBe(true);
        expect(harness.optionalContentProperties._updated).toBe(true);
        harness.document.destroy();
    });
    it('_setLock does not duplicate an existing locked reference', () => {
        // Arrange
        const harness = makeLockHarness('Existing locked reference');
        const locked: _PdfReference[] = [harness.reference];
        harness.defaultView.update('Locked', locked);
        // Act
        harness.internalLayer._setLock(true);
        // Assert
        expect(locked.length).toBe(1);
        expect(locked[0]).toBe(harness.reference);
        expect(locked.indexOf(harness.reference)).toBe(0);
        expect(harness.defaultView._updated).toBe(true);
        expect(harness.optionalContentProperties._updated).toBe(true);
        harness.document.destroy();
    });
    it('_setLock removes the exact locked reference', () => {
        // Arrange
        const harness = makeLockHarness('Remove locked reference');
        const firstReference: _PdfReference = harness.page._crossReference._getNextReference();
        const trailingReference: _PdfReference = harness.page._crossReference._getNextReference();
        const locked: _PdfReference[] = [firstReference, harness.reference, trailingReference];
        harness.defaultView.update('Locked', locked);
        // Act
        harness.internalLayer._setLock(false);
        // Assert
        expect(locked.length).toBe(2);
        expect(locked[0]).toBe(firstReference);
        expect(locked[1]).toBe(trailingReference);
        expect(locked.indexOf(harness.reference)).toBe(-1);
        expect(harness.defaultView._updated).toBe(true);
        expect(harness.optionalContentProperties._updated).toBe(true);
        harness.document.destroy();
    });
    it('_setLock leaves Locked unchanged when the reference is absent', () => {
        // Arrange
        const harness = makeLockHarness('Absent locked reference');
        const firstReference: _PdfReference = harness.page._crossReference._getNextReference();
        const secondReference: _PdfReference = harness.page._crossReference._getNextReference();
        const locked: _PdfReference[] = [firstReference, secondReference];
        harness.defaultView.update('Locked', locked);
        // Act
        harness.internalLayer._setLock(false);
        // Assert
        expect(locked.length).toBe(2);
        expect(locked[0]).toBe(firstReference);
        expect(locked[1]).toBe(secondReference);
        expect(locked.indexOf(harness.reference)).toBe(-1);
        harness.document.destroy();
    });
    it('_setLock does not modify Locked when the layer reference is unavailable', () => {
        // Arrange
        const harness = makeLockHarness('Missing lock reference');
        const lockedReference: _PdfReference = harness.page._crossReference._getNextReference();
        const locked: _PdfReference[] = [lockedReference];
        const originalReference: _PdfReference = harness.internalLayer._referenceHolder;
        harness.defaultView.update('Locked', locked);
        harness.internalLayer._referenceHolder = undefined;
        // Act
        harness.internalLayer._setLock(true);
        // Assert
        expect(locked.length).toBe(1);
        expect(locked[0]).toBe(lockedReference);
        expect(harness.defaultView._updated).toBe(true);
        expect(harness.optionalContentProperties._updated).toBe(true);
        harness.internalLayer._referenceHolder = originalReference;
        harness.document.destroy();
    });
    it('_setLock uses a missing D dictionary without adding it to OCProperties', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const layer: PdfLayer = document.layers.add('Missing default view');
        const internalLayer: any = layer as any;
        const optionalContentProperties: _PdfDictionary = new _PdfDictionary(page._crossReference);
        document._catalog._catalogDictionary.update('OCProperties', optionalContentProperties);
        // Act
        internalLayer._setLock(true);
        // Assert
        expect(optionalContentProperties.has('D')).toBe(false);
        expect(optionalContentProperties._updated).toBe(true);
        expect(internalLayer._lock).toBeDefined();
        expect(internalLayer._lock.length).toBe(1);
        expect(internalLayer._lock[0]).toBe(internalLayer._referenceHolder);
        document.destroy();
    });
    it('_setLock does not update lock data when OCProperties is unavailable', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const layer: PdfLayer = document.layers.add('Unavailable optional content properties');
        const internalLayer: any = layer as any;
        const catalog: _PdfDictionary = document._catalog._catalogDictionary;
        const originalOptionalContentProperties: _PdfDictionary =
            catalog.get('OCProperties') as _PdfDictionary;
        catalog.set('OCProperties', undefined);
        // Act
        internalLayer._setLock(true);
        // Assert
        expect(catalog.get('OCProperties')).toBeUndefined();
        expect(internalLayer._lock).toBeUndefined();
        catalog.update('OCProperties', originalOptionalContentProperties);
        document.destroy();
    });
    it('_parseLayerPage finds the exact layer through Resources Properties', () => {
        // Arrange
        const harness = makeLayerPageHarness('Properties parsed layer');
        const properties: _PdfDictionary = new _PdfDictionary(harness.page._crossReference);
        const expectedId: string = 'LayerPropertyId';
        properties.update(expectedId, harness.internalLayer._referenceHolder);
        harness.resources.update('Properties', properties);
        // Act
        const parsedPage: PdfPage = harness.internalLayer._layerPage;
        // Assert
        expect(parsedPage).toBe(harness.page);
        expect(harness.internalLayer._layerId).toBe(expectedId);
        expect(harness.internalLayer._pageParsed).toBe(true);
        expect(harness.internalLayer._pages.length).toBe(1);
        expect(harness.internalLayer._pages[0]).toBe(harness.page);
        harness.document.destroy();
    });
    it('_parseLayerPage ignores a non-reference Properties entry before finding the layer', () => {
        // Arrange
        const harness = makeLayerPageHarness('Mixed properties parsed layer');
        const properties: _PdfDictionary = new _PdfDictionary(harness.page._crossReference);
        const expectedId: string = 'ValidLayerProperty';
        properties.update('InvalidLayerProperty', 'not-a-reference');
        properties.update(expectedId, harness.internalLayer._referenceHolder);
        harness.resources.update('Properties', properties);
        // Act
        const parsedId: string = harness.internalLayer._layerId;
        // Assert
        expect(parsedId).toBe(expectedId);
        expect(harness.internalLayer._layerPage).toBe(harness.page);
        expect(harness.internalLayer._pages.length).toBe(1);
        expect(harness.internalLayer._pageParsed).toBe(true);
        harness.document.destroy();
    });
    it('_parseLayerPage stops Properties parsing after the matching reference', () => {
        // Arrange
        const harness = makeLayerPageHarness('Property break layer');
        const properties: _PdfDictionary = new _PdfDictionary(harness.page._crossReference);
        const expectedId: string = 'FirstMatchingProperty';
        const trailingReference: _PdfReference = harness.page._crossReference._getNextReference();
        const trailingDictionary: _PdfDictionary = new _PdfDictionary(harness.page._crossReference);
        trailingDictionary.update('Name', 'Trailing layer');
        harness.page._crossReference._cacheMap.set(trailingReference, trailingDictionary);
        properties.update(expectedId, harness.internalLayer._referenceHolder);
        properties.update('TrailingProperty', trailingReference);
        harness.resources.update('Properties', properties);
        // Act
        const parsedId: string = harness.internalLayer._layerId;
        // Assert
        expect(parsedId).toBe(expectedId);
        expect(parsedId).not.toBe('TrailingProperty');
        expect(harness.internalLayer._pages.length).toBe(1);
        expect(harness.internalLayer._pages[0]).toBe(harness.page);
        harness.document.destroy();
    });
    it('_parseLayerPage leaves the page unresolved when Resources has no supported entries', () => {
        // Arrange
        const harness = makeLayerPageHarness('Unsupported resources layer');
        harness.resources.update('Font', new _PdfDictionary());
        // Act
        const parsedPage: PdfPage = harness.internalLayer._layerPage;
        // Assert
        expect(parsedPage).toBeUndefined();
        expect(harness.internalLayer._pageParsed).toBe(false);
        expect(harness.internalLayer._pages.length).toBe(0);
        expect(harness.internalLayer._xObject.length).toBe(0);
        harness.document.destroy();
    });
    it('_parseLayerPage leaves the page unresolved when Resources is undefined', () => {
        // Arrange
        const harness = makeLayerPageHarness('Undefined resources layer');
        harness.page._pageDictionary.set('Resources', undefined);
        // Act
        const parsedPage: PdfPage = harness.internalLayer._layerPage;
        // Assert
        expect(parsedPage).toBeUndefined();
        expect(harness.internalLayer._pageParsed).toBe(false);
        expect(harness.internalLayer._pages.length).toBe(0);
        harness.document.destroy();
    });
    it('_parseLayerPage leaves the page unresolved for Properties without references', () => {
        // Arrange
        const harness = makeLayerPageHarness('Non-reference properties layer');
        const properties: _PdfDictionary = new _PdfDictionary(harness.page._crossReference);
        properties.update('TextProperty', 'value');
        properties.update('NumberProperty', 10);
        harness.resources.update('Properties', properties);
        // Act
        const parsedId: string = harness.internalLayer._layerId;
        // Assert
        expect(parsedId).toBeTruthy();
        expect(harness.internalLayer._layerPage).toBeUndefined();
        expect(harness.internalLayer._pageParsed).toBe(false);
        expect(harness.internalLayer._pages.length).toBe(0);
        harness.document.destroy();
    });
    it('_parseLayerPage finds the exact layer through an XObject OC reference', () => {
        // Arrange
        const harness = makeLayerPageHarness('XObject parsed layer');
        const expectedId: string = 'LayerXObjectId';
        const xObject: _PdfDictionary = new _PdfDictionary(harness.page._crossReference);
        const streamDictionary: _PdfDictionary = new _PdfDictionary(harness.page._crossReference);
        streamDictionary.update('OC', harness.internalLayer._referenceHolder);
        const stream: _PdfStream = new _PdfStream([], streamDictionary);
        const streamReference: _PdfReference = harness.page._crossReference._getNextReference();
        harness.page._crossReference._cacheMap.set(streamReference, stream);
        xObject.update(expectedId, streamReference);
        harness.resources.update('XObject', xObject);
        // Act
        const parsedPage: PdfPage = harness.internalLayer._layerPage;
        // Assert
        expect(parsedPage).toBe(harness.page);
        expect(harness.internalLayer._layerId).toBe(expectedId);
        expect(harness.internalLayer._xObject.length).toBe(1);
        expect(harness.internalLayer._xObject[0]).toBe(expectedId);
        expect(harness.internalLayer._pageParsed).toBe(true);
        harness.document.destroy();
    });
    it('_parseLayerPage ignores a non-reference XObject entry before finding the layer', () => {
        // Arrange
        const harness = makeLayerPageHarness('Mixed XObject parsed layer');
        const expectedId: string = 'ValidXObjectLayer';
        const xObject: _PdfDictionary = new _PdfDictionary(harness.page._crossReference);
        const streamDictionary: _PdfDictionary = new _PdfDictionary(harness.page._crossReference);
        streamDictionary.update('OC', harness.internalLayer._referenceHolder);
        const stream: _PdfStream = new _PdfStream([], streamDictionary);
        const streamReference: _PdfReference = harness.page._crossReference._getNextReference();
        harness.page._crossReference._cacheMap.set(streamReference, stream);
        xObject.update('InvalidXObjectLayer', 'not-a-reference');
        xObject.update(expectedId, streamReference);
        harness.resources.update('XObject', xObject);
        // Act
        const parsedId: string = harness.internalLayer._layerId;
        // Assert
        expect(parsedId).toBe(expectedId);
        expect(harness.internalLayer._xObject.length).toBe(1);
        expect(harness.internalLayer._xObject[0]).toBe(expectedId);
        expect(harness.internalLayer._pageParsed).toBe(true);
        harness.document.destroy();
    });
    it('_parseLayerPage leaves XObject state unchanged when the stream has no OC', () => {
        // Arrange
        const harness = makeLayerPageHarness('XObject without OC layer');
        const xObject: _PdfDictionary = new _PdfDictionary(harness.page._crossReference);
        const streamDictionary: _PdfDictionary = new _PdfDictionary(harness.page._crossReference);
        const stream: _PdfStream = new _PdfStream([], streamDictionary);
        const streamReference: _PdfReference = harness.page._crossReference._getNextReference();
        harness.page._crossReference._cacheMap.set(streamReference, stream);
        xObject.update('XObjectWithoutOC', streamReference);
        harness.resources.update('XObject', xObject);
        // Act
        const parsedPage: PdfPage = harness.internalLayer._layerPage;
        // Assert
        expect(parsedPage).toBeUndefined();
        expect(harness.internalLayer._pageParsed).toBe(false);
        expect(harness.internalLayer._xObject.length).toBe(0);
        expect(harness.internalLayer._pages.length).toBe(0);
        harness.document.destroy();
    });
});
function makeParseDictionaryHarness(name: string): {
    document: PdfDocument;
    page: PdfPage;
    layer: PdfLayer;
    internalLayer: any;
} {
    const document: PdfDocument = new PdfDocument();
    const page: PdfPage = document.addPage();
    const layer: PdfLayer = document.layers.add(name);
    const internalLayer: any = layer as any;
    internalLayer._pageParsed = false;
    internalLayer._page = undefined;
    internalLayer._pages = [];
    return { document, page, layer, internalLayer };
}
function makePrintStateHarness(name: string): {
    document: PdfDocument;
    page: PdfPage;
    layer: PdfLayer;
    internalLayer: any;
    optionalContentProperties: _PdfDictionary;
    optionalContentGroups: _PdfReference[];
} {
    const document: PdfDocument = new PdfDocument();
    const page: PdfPage = document.addPage();
    const layer: PdfLayer = document.layers.add(name);
    const internalLayer: any = layer as any;
    const optionalContentProperties: _PdfDictionary =
        document._catalog._catalogDictionary.get('OCProperties') as _PdfDictionary;
    const optionalContentGroups: _PdfReference[] =
        optionalContentProperties.get('OCGs') as _PdfReference[];
    return {
        document,
        page,
        layer,
        internalLayer,
        optionalContentProperties,
        optionalContentGroups
    };
}
function getNameValue(dictionary: _PdfDictionary, key: string): string {
    const name: _PdfName = dictionary.get(key) as _PdfName;
    return name.name;
}
describe('PdfLayer lines 496 to 589 survived mutation coverage', () => {
    it('_parseDictionary matches a direct Name dictionary', () => {
        // Arrange
        const harness = makeParseDictionaryHarness('Direct name layer');
        const dictionary: _PdfDictionary = new _PdfDictionary(harness.page._crossReference);
        const expectedId: string = 'DirectLayerId';
        dictionary.update('Name', 'Direct name layer');
        // Act
        const result: boolean = harness.internalLayer._parseDictionary(
            dictionary,
            harness.internalLayer._referenceHolder,
            harness.page,
            expectedId
        );
        // Assert
        expect(result).toBe(true);
        expect(harness.internalLayer._pageParsed).toBe(true);
        expect(harness.internalLayer._layerId).toBe(expectedId);
        expect(harness.internalLayer._layerPage).toBe(harness.page);
        expect(harness.internalLayer._pages.length).toBe(1);
        harness.document.destroy();
    });
    it('_parseDictionary returns false when Name is absent', () => {
        // Arrange
        const harness = makeParseDictionaryHarness('Missing name layer');
        const dictionary: _PdfDictionary = new _PdfDictionary(harness.page._crossReference);
        // Act
        const result: boolean = harness.internalLayer._parseDictionary(
            dictionary,
            harness.internalLayer._referenceHolder,
            harness.page,
            'MissingNameId'
        );
        // Assert
        expect(result).toBe(false);
        expect(harness.internalLayer._pageParsed).toBe(false);
        expect(harness.internalLayer._page).toBeUndefined();
        expect(harness.internalLayer._pages.length).toBe(0);
        harness.document.destroy();
    });
    it('_parseDictionary returns false for a different direct reference', () => {
        // Arrange
        const harness = makeParseDictionaryHarness('Different reference layer');
        const dictionary: _PdfDictionary = new _PdfDictionary(harness.page._crossReference);
        const differentReference: _PdfReference = harness.page._crossReference._getNextReference();
        dictionary.update('Name', 'Different reference layer');
        // Act
        const result: boolean = harness.internalLayer._parseDictionary(
            dictionary,
            differentReference,
            harness.page,
            'DifferentReferenceId'
        );
        // Assert
        expect(result).toBe(false);
        expect(harness.internalLayer._pageParsed).toBe(false);
        expect(harness.internalLayer._page).toBeUndefined();
        expect(harness.internalLayer._pages.length).toBe(0);
        harness.document.destroy();
    });
    it('_parseDictionary does not resolve a direct OCGs reference as an array', () => {
        // Arrange
        const harness = makeParseDictionaryHarness(
            'Direct OCG reference layer'
        );
        const dictionary: _PdfDictionary =
            new _PdfDictionary(
                harness.page._crossReference
            );
        const originalLayerId: string =
            harness.internalLayer._id;
        const inputReference: _PdfReference =
            harness.page._crossReference._getNextReference();

        dictionary.update(
            'Name',
            'Optional content membership'
        );
        dictionary.set(
            'OCGs',
            harness.internalLayer._referenceHolder
        );

        // Act
        const result: boolean =
            harness.internalLayer._parseDictionary(
                dictionary,
                inputReference,
                harness.page,
                'DirectOcgId'
            );

        // Assert
        expect(result).toBe(false);
        expect(
            harness.internalLayer._id
        ).toBe(originalLayerId);
        expect(
            harness.internalLayer._id
        ).not.toBe('DirectOcgId');
        expect(
            harness.internalLayer._pageParsed
        ).toBe(false);
        expect(
            harness.internalLayer._page
        ).toBeUndefined();
        expect(
            harness.internalLayer._pages.length
        ).toBe(0);

        harness.document.destroy();
    });
    it('_parseDictionary resolves the matching reference from an OCGs array', () => {
        // Arrange
        const harness = makeParseDictionaryHarness('OCGs array layer');
        const dictionary: _PdfDictionary = new _PdfDictionary(harness.page._crossReference);
        const differentReference: _PdfReference = harness.page._crossReference._getNextReference();
        const differentDictionary: _PdfDictionary = new _PdfDictionary(harness.page._crossReference);
        differentDictionary.update('Name', 'Different optional content group');
        harness.page._crossReference._cacheMap.set(differentReference, differentDictionary);
        dictionary.update('Name', 'Optional content membership');
        dictionary.update('OCGs', [differentReference, harness.internalLayer._referenceHolder]);
        // Act
        const result: boolean = harness.internalLayer._parseDictionary(
            dictionary,
            differentReference,
            harness.page,
            'ArrayOcgId'
        );
        // Assert
        expect(result).toBe(true);
        expect(harness.internalLayer._layerId).toBe('ArrayOcgId');
        expect(harness.internalLayer._layerPage).toBe(harness.page);
        expect(harness.internalLayer._pages.length).toBe(1);
        harness.document.destroy();
    });
    it('_parseDictionary ignores non-reference OCGs array values', () => {
        // Arrange
        const harness = makeParseDictionaryHarness('Non-reference OCG values');
        const dictionary: _PdfDictionary = new _PdfDictionary(harness.page._crossReference);
        dictionary.update('Name', 'Optional content membership');
        dictionary.update('OCGs', ['invalid', 10]);
        // Act
        const result: boolean = harness.internalLayer._parseDictionary(
            dictionary,
            harness.page._crossReference._getNextReference(),
            harness.page,
            'InvalidArrayId'
        );
        // Assert
        expect(result).toBe(false);
        expect(harness.internalLayer._pageParsed).toBe(false);
        expect(harness.internalLayer._page).toBeUndefined();
        expect(harness.internalLayer._pages.length).toBe(0);
        harness.document.destroy();
    });
    it('_parseDictionary returns false when a direct OCG dictionary has no Name', () => {
        // Arrange
        const harness = makeParseDictionaryHarness('Direct OCG without name');
        const dictionary: _PdfDictionary = new _PdfDictionary(harness.page._crossReference);
        const ocgDictionary: _PdfDictionary = new _PdfDictionary(harness.page._crossReference);
        const ocgReference: _PdfReference = harness.page._crossReference._getNextReference();
        harness.page._crossReference._cacheMap.set(ocgReference, ocgDictionary);
        dictionary.update('Name', 'Optional content membership');
        dictionary.set('OCGs', ocgReference);
        // Act
        const result: boolean = harness.internalLayer._parseDictionary(
            dictionary,
            ocgReference,
            harness.page,
            'UnnamedOcgId'
        );
        // Assert
        expect(result).toBe(false);
        expect(harness.internalLayer._pageParsed).toBe(false);
        expect(harness.internalLayer._page).toBeUndefined();
        expect(harness.internalLayer._pages.length).toBe(0);
        harness.document.destroy();
    });
    it('_setLayerPage returns false when the reference holder is unavailable', () => {
        // Arrange
        const harness = makeParseDictionaryHarness('Missing reference holder layer');
        const originalReference: _PdfReference = harness.internalLayer._referenceHolder;
        harness.internalLayer._referenceHolder = undefined;
        // Act
        const result: boolean = harness.internalLayer._setLayerPage(
            originalReference,
            harness.page,
            'MissingHolderId'
        );
        // Assert
        expect(result).toBe(false);
        expect(harness.internalLayer._pageParsed).toBe(false);
        expect(harness.internalLayer._page).toBeUndefined();
        expect(harness.internalLayer._pages.length).toBe(0);
        harness.internalLayer._referenceHolder = originalReference;
        harness.document.destroy();
    });
    it('_setLayerPage returns false when the reference does not match', () => {
        // Arrange
        const harness = makeParseDictionaryHarness('Non-matching layer reference');
        const differentReference: _PdfReference = harness.page._crossReference._getNextReference();
        // Act
        const result: boolean = harness.internalLayer._setLayerPage(
            differentReference,
            harness.page,
            'NonMatchingId'
        );
        // Assert
        expect(result).toBe(false);
        expect(harness.internalLayer._pageParsed).toBe(false);
        expect(harness.internalLayer._page).toBeUndefined();
        expect(harness.internalLayer._pages.length).toBe(0);
        harness.document.destroy();
    });
    it('_setLayerPage assigns the page and does not duplicate it', () => {
        // Arrange
        const harness = makeParseDictionaryHarness('Existing layer page');
        harness.internalLayer._pages.push(harness.page);
        // Act
        const result: boolean = harness.internalLayer._setLayerPage(
            harness.internalLayer._referenceHolder,
            harness.page,
            'ExistingPageId'
        );
        // Assert
        expect(result).toBe(true);
        expect(harness.internalLayer._pageParsed).toBe(true);
        expect(harness.internalLayer._layerId).toBe('ExistingPageId');
        expect(harness.internalLayer._page).toBe(harness.page);
        expect(harness.internalLayer._pages.length).toBe(1);
        expect(harness.internalLayer._pages[0]).toBe(harness.page);
        harness.document.destroy();
    });
    it('_setPrintState creates the exact neverPrint dictionaries', () => {
        // Arrange
        const harness = makePrintStateHarness('Never print layer');
        harness.internalLayer._printState = PdfPrintState.neverPrint;
        harness.internalLayer._printOption = undefined;
        // Act
        harness.internalLayer._setPrintState();
        // Assert
        const printOption: _PdfDictionary = harness.internalLayer._printOption;
        const usage: _PdfDictionary = harness.internalLayer._dictionary.get('Usage') as _PdfDictionary;
        const printReference: _PdfReference = usage.getRaw('Print') as _PdfReference;
        expect(getNameValue(printOption, 'Subtype')).toBe('Print');
        expect(getNameValue(printOption, 'PrintState')).toBe('OFF');
        expect(harness.page._crossReference._cacheMap.get(printReference)).toBe(printOption);
        expect(harness.internalLayer._usage).toBe(usage);
        harness.document.destroy();
    });
    it('_setPrintState creates the exact alwaysPrint dictionaries', () => {
        // Arrange
        const harness = makePrintStateHarness('Always print layer');
        harness.internalLayer._printState = PdfPrintState.alwaysPrint;
        harness.internalLayer._printOption = undefined;
        // Act
        harness.internalLayer._setPrintState();
        // Assert
        const printOption: _PdfDictionary = harness.internalLayer._printOption;
        const usage: _PdfDictionary = harness.internalLayer._dictionary.get('Usage') as _PdfDictionary;
        const printReference: _PdfReference = usage.getRaw('Print') as _PdfReference;
        expect(getNameValue(printOption, 'Subtype')).toBe('Print');
        expect(getNameValue(printOption, 'PrintState')).toBe('ON');
        expect(harness.page._crossReference._cacheMap.get(printReference)).toBe(printOption);
        expect(harness.internalLayer._usage).toBe(usage);
        harness.document.destroy();
    });
    it('_setPrintState omits PrintState for printWhenVisible', () => {
        // Arrange
        const harness = makePrintStateHarness('Print when visible layer');
        harness.internalLayer._printState = PdfPrintState.printWhenVisible;
        harness.internalLayer._printOption = undefined;
        // Act
        harness.internalLayer._setPrintState();
        // Assert
        const printOption: _PdfDictionary = harness.internalLayer._printOption;
        expect(getNameValue(printOption, 'Subtype')).toBe('Print');
        expect(printOption.has('PrintState')).toBe(false);
        expect(harness.internalLayer._dictionary.has('Usage')).toBe(true);
        expect(harness.internalLayer._usage.has('Print')).toBe(true);
        harness.document.destroy();
    });
    it('_setPrintState reuses the exact existing Usage dictionary', () => {
        // Arrange
        const harness = makePrintStateHarness('Existing usage layer');
        const existingUsage: _PdfDictionary = new _PdfDictionary(harness.page._crossReference);
        existingUsage.update('View', new _PdfName('ON'));
        harness.internalLayer._dictionary.update('Usage', existingUsage);
        harness.internalLayer._printState = PdfPrintState.neverPrint;
        harness.internalLayer._printOption = undefined;
        // Act
        harness.internalLayer._setPrintState();
        // Assert
        expect(harness.internalLayer._usage).toBe(existingUsage);
        expect(harness.internalLayer._dictionary.get('Usage')).toBe(existingUsage);
        expect(existingUsage.has('View')).toBe(true);
        expect(existingUsage.has('Print')).toBe(true);
        expect(getNameValue(existingUsage, 'View')).toBe('ON');
        harness.document.destroy();
    });
    it('_setPrintState creates an empty OCG array when OCGs is unavailable', () => {
        // Arrange
        const harness = makePrintStateHarness('Missing OCG array layer');
        harness.optionalContentProperties.set('OCGs', undefined);
        harness.internalLayer._printState = PdfPrintState.alwaysPrint;
        harness.internalLayer._printOption = undefined;
        // Act
        harness.internalLayer._setPrintState();
        // Assert
        const defaultView: _PdfDictionary = harness.optionalContentProperties.get('D') as _PdfDictionary;
        const usageApplications: _PdfReference[] = defaultView.get('D') as _PdfReference[];
        const usageApplication: _PdfDictionary =
            harness.page._crossReference._cacheMap.get(usageApplications[0]) as _PdfDictionary;
        const groups: _PdfReference[] = usageApplication.get('OCGs') as _PdfReference[];
        expect(groups.length).toBe(0);
        expect(usageApplications.length).toBe(1);
        harness.document.destroy();
    });
    it('_setPrintState stores exact usage application metadata', () => {
        // Arrange
        const harness = makePrintStateHarness('Usage application layer');
        harness.internalLayer._printState = PdfPrintState.alwaysPrint;
        harness.internalLayer._printOption = undefined;
        // Act
        harness.internalLayer._setPrintState();
        // Assert
        const defaultView: _PdfDictionary = harness.optionalContentProperties.get('D') as _PdfDictionary;
        const usageApplications: _PdfReference[] = defaultView.get('D') as _PdfReference[];
        const usageApplication: _PdfDictionary =
            harness.page._crossReference._cacheMap.get(usageApplications[0]) as _PdfDictionary;
        const category: _PdfName[] = usageApplication.get('Category') as _PdfName[];
        const groups: _PdfReference[] = usageApplication.get('OCGs') as _PdfReference[];
        expect(usageApplications.length).toBe(1);
        expect(category.length).toBe(1);
        expect(category[0].name).toBe('Print');
        expect(groups).toBe(harness.optionalContentGroups);
        expect(getNameValue(usageApplication, 'Event')).toBe('Print');
        harness.document.destroy();
    });
    it('_setPrintState uses a new default view without attaching it when D is unavailable', () => {
        // Arrange
        const harness = makePrintStateHarness('Missing default print view');
        harness.optionalContentProperties.set('D', undefined);
        harness.internalLayer._printState = PdfPrintState.neverPrint;
        harness.internalLayer._printOption = undefined;
        // Act
        harness.internalLayer._setPrintState();
        // Assert
        expect(harness.optionalContentProperties.get('D')).toBeUndefined();
        expect(harness.internalLayer._dictionary.has('Usage')).toBe(true);
        expect(harness.internalLayer._usage.has('Print')).toBe(true);
        expect(getNameValue(harness.internalLayer._printOption, 'PrintState')).toBe('OFF');
        harness.document.destroy();
    });
});

import { PdfPrintState } from "../src/pdf/core/enumerator";
import { PdfDocument } from "../src/pdf/core/pdf-document";
import { _PdfDictionary, _PdfName, _PdfReference } from "../src/pdf/core/pdf-primitives";
import { _PdfContentStream } from "../src/pdf/core/base-stream";
import { PdfPage } from "../src/pdf/core/pdf-page";
import { PdfLayer } from "../src/pdf/core/layers/layer";
import { PdfLayerCollection } from "../src/pdf/core/layers/layer-collection";
import { _PdfCrossReference } from "../src/pdf/core/pdf-cross-reference";
describe("PdfLayerCollection", () => {
	describe("constructor", () => {
		it("targets mutant IDs 1, 11, 12, 13, 17, 19 for empty initialization", () => {
			const document: PdfDocument = new PdfDocument();
			const collection: PdfLayerCollection = new PdfLayerCollection(document);
			const collectionAny: any = collection;
			expect(collection.count).toBe(0);
			expect(collection.at(0)).toBeUndefined();
			expect(collectionAny._isSkip).toBeFalsy();
			expect(collectionAny._list.length).toBe(0);
		});
		it("targets mutant IDs 27, 29, 30, 31, 32, 33, 37, 39, 43, 45, 48, 51, 54, 60, 69, 71, 73, 78, 80, 81, 82, 86, 92, 94, 96, 98, 101, 103, 105, 107, 109, 116, 118, 120, 121, 122, 126 for catalog parsing", () => {
			const document: any = new PdfDocument();
			const xref: any = document._crossReference;
			const firstReference: _PdfReference = _PdfReference.get(10, 0);
			const secondReference: _PdfReference = _PdfReference.get(11, 0);
			const firstDictionary: _PdfDictionary = new _PdfDictionary(xref);
			firstDictionary.update("Name", "Direct");
			firstDictionary.update("LayerID", new _PdfName("L1"));
			const secondDictionary: _PdfDictionary = new _PdfDictionary(xref);
			secondDictionary.update("Name", "Referenced");
			secondDictionary.update("LayerID", new _PdfName("L2"));
			xref._cacheMap.set(firstReference, firstDictionary);
			xref._cacheMap.set(secondReference, secondDictionary);
			const ocProperties: _PdfDictionary = new _PdfDictionary(xref);
			const defaultView: _PdfDictionary = new _PdfDictionary(xref);
			defaultView.update("Order", [firstReference, secondReference]);
			defaultView.update("Locked", [firstReference]);
			ocProperties.update("D", defaultView);
			ocProperties.update("OCGs", [firstReference, secondReference]);
			document._catalog._catalogDictionary.update("OCProperties", ocProperties);
			const collection: PdfLayerCollection = new PdfLayerCollection(document);
			const collectionAny: any = collection;
			const firstLayer: any = collection.at(0);
			const secondLayer: any = collection.at(1);
			expect(collection.count).toBe(2);
			expect(collectionAny._list.length).toBe(2);
			expect(firstLayer.name).toBe("Direct");
			expect(secondLayer.name).toBe("Referenced");
			expect(firstLayer.visible).toBeTruthy();
			expect(secondLayer.visible).toBeTruthy();
			expect(firstLayer.locked).toBeTruthy();
			expect(secondLayer.locked).toBeFalsy();
			expect(firstLayer._referenceHolder).toBe(firstReference);
			expect(secondLayer._referenceHolder).toBe(secondReference);
			expect(firstLayer._dictionary.get("Visible")).toBeUndefined();
			expect(secondLayer._dictionary.get("Visible")).toBeUndefined();
			expect(collection.contains("Direct")).toBeTruthy();
			expect(collection.contains("Referenced")).toBeTruthy();
		});
	});
	describe("add", () => {
		it("targets mutant IDs 148, 149, 150, 151, 152, 153, 154, 155, 156, 157 for visibility and layer creation", () => {
			const document: any = new PdfDocument();
			const collection: any = new PdfLayerCollection(document);
			const visibleLayer: any = collection.add("Visible");
			const hiddenLayer: any = collection.add("Hidden", false);
			const ocProperties: any = document._catalog._catalogDictionary.get("OCProperties");
			const defaultView: any = ocProperties.get("D");
			expect(collection.count).toBe(2);
			expect(collection.at(0)).toBe(visibleLayer);
			//expect(collection.at(1)).toBe(hiddenLayer);
			expect(visibleLayer.name).toBe("Visible");
			expect(hiddenLayer.name).toBe("Hidden");
			expect(visibleLayer.visible).toBeTruthy();
			expect(hiddenLayer.visible).toBeFalsy();
			expect(visibleLayer._layerId.startsWith("OCG_")).toBeTruthy();
			expect(hiddenLayer._layerId.startsWith("OCG_")).toBeTruthy();
			expect(visibleLayer._dictionary.get("Name")).toBe("Visible");
			expect(hiddenLayer._dictionary.get("Name")).toBe("Hidden");
			expect(visibleLayer._dictionary.get("Type").name).toBe("OCG");
			expect(hiddenLayer._dictionary.get("Type").name).toBe("OCG");
			expect(visibleLayer._dictionary.get("Visible")).toBeTruthy();
			expect(hiddenLayer._dictionary.get("Visible")).toBeFalsy();
			expect(document._optionalContentDictionaries.length).toBe(2);
			expect(document._printLayer.length).toBe(2);
			expect(document._on.length).toBe(1);
			expect(document._off.length).toBe(1);
			expect(document._on[0]).toBe(visibleLayer._referenceHolder);
			expect(document._off[0]).toBe(hiddenLayer._referenceHolder);
			expect(ocProperties.get("OCGs").length).toBe(2);
			expect(defaultView.get("Name")).toBe("Layers");
			expect(defaultView.get("ON").length).toBe(1);
			expect(defaultView.get("OFF").length).toBe(1);
		});
	});
	describe("_setPrintState", () => {
		it("targets mutant IDs 69, 71, 73, 78, 80, 81, 82, 86, 92, 94, 96, 98, 101, 103, 105, 107, 109, 116, 118, 120, 121, 122, 126 for print state mapping", () => {
			const document: PdfDocument = new PdfDocument();
			const collection: any = new PdfLayerCollection(document);
			const neverLayer: any = collection.add("Never");
			const alwaysLayer: any = collection.add("Always");
			const visibleLayer: any = collection.add("Visible");
			const neverOption: _PdfDictionary = new _PdfDictionary(document._crossReference);
			const alwaysOption: _PdfDictionary = new _PdfDictionary(document._crossReference);
			const visibleOption: _PdfDictionary = new _PdfDictionary(document._crossReference);
			neverOption.update("PrintState", new _PdfName("OFF"));
			alwaysOption.update("PrintState", new _PdfName("ON"));
			(collection as any)._setPrintState(neverOption, neverLayer);
			(collection as any)._setPrintState(alwaysOption, alwaysLayer);
			(collection as any)._setPrintState(visibleOption, visibleLayer);
			expect(neverLayer.printState).toBe(PdfPrintState.neverPrint);
			expect(neverLayer._printOption.get("PrintState").name).toBe("OFF");
			expect(alwaysLayer.printState).toBe(PdfPrintState.alwaysPrint);
			expect(alwaysLayer._printOption.get("PrintState").name).toBe("ON");
			expect(visibleLayer.printState).toBe(PdfPrintState.printWhenVisible);
			expect(visibleLayer._printOption.has("PrintState")).toBeFalsy();
		});
	});
	describe("contains", () => {
		it("targets mutant IDs 174 for string and layer lookup", () => {
			const document: PdfDocument = new PdfDocument();
			const collection: PdfLayerCollection = new PdfLayerCollection(document);
			const layer: PdfLayer = collection.add("Alpha");
			const strayLayer: PdfLayer = new PdfLayer();
			expect(collection.contains("Alpha")).toBeTruthy();
			expect(collection.contains("Beta")).toBeFalsy();
			expect(collection.contains(layer)).toBeTruthy();
			expect(collection.contains(strayLayer)).toBeFalsy();
		});
		it("rejects null or undefined layer inputs", () => {
			const document: PdfDocument = new PdfDocument();
			const collection: PdfLayerCollection = new PdfLayerCollection(document);
			expect(() => collection.contains(null as any)).toThrowError("Layer cannot be null or undefined");
			expect(() => collection.contains(undefined as any)).toThrowError("Layer cannot be null or undefined");
		});
	});
	describe("clear", () => {
		it("targets mutant IDs 185 and 187 for reverse removal order", () => {
			const document: PdfDocument = new PdfDocument();
			const collection: any = new PdfLayerCollection(document);
			const firstLayer: PdfLayer = collection.add("First");
			const secondLayer: PdfLayer = collection.add("Second");
			const removeSpy: jasmine.Spy = spyOn(collection, "_removeLayer").and.stub();
			collection.clear();
			expect(removeSpy.calls.count()).toBe(2);
			expect(removeSpy.calls.argsFor(0)).toEqual([secondLayer, true]);
			expect(removeSpy.calls.argsFor(1)).toEqual([firstLayer, true]);
			expect(collection.count).toBe(0);
			expect(collection._list.length).toBe(0);
		});
	});
	describe("indexOf", () => {
		it("returns exact positions and rejects missing input", () => {
			const document: PdfDocument = new PdfDocument();
			const collection: PdfLayerCollection = new PdfLayerCollection(document);
			const firstLayer: PdfLayer = collection.add("First");
			const secondLayer: PdfLayer = collection.add("Second");
			expect(collection.indexOf(firstLayer)).toBe(0);
			expect(collection.indexOf(secondLayer)).toBe(1);
			expect(collection.indexOf(new PdfLayer())).toBe(-1);
			expect(() => collection.indexOf(null as any)).toThrowError("Layer cannot be null or undefined");
		});
	});
	describe("move", () => {
		it("targets mutant IDs 203, 207, 217, 225, 227, 228, 229, 230, 232 for reordering", () => {
			const document: any = new PdfDocument();
			const collection: any = new PdfLayerCollection(document);
			const firstLayer: any = collection.add("First");
			const secondLayer: any = collection.add("Second");
			const thirdLayer: any = collection.add("Third");
			collection.move(0, thirdLayer);
			const ocProperties: any = document._catalog._catalogDictionary.get("OCProperties");
			const order: any[] = ocProperties.get("D").get("Order");
			const groups: any[] = ocProperties.get("OCGs");
			expect(collection.at(0)).toBe(thirdLayer);
			expect(collection.at(1)).toBe(firstLayer);
			expect(collection.at(2)).toBe(secondLayer);
			expect(order[0]).toBe(thirdLayer._referenceHolder);
			expect(order[1]).toBe(firstLayer._referenceHolder);
			expect(order[2]).toBe(secondLayer._referenceHolder);
			expect(groups[0]).toBe(thirdLayer._referenceHolder);
			expect(groups[1]).toBe(firstLayer._referenceHolder);
			expect(groups[2]).toBe(secondLayer._referenceHolder);
		});
		it("does not move when the target index already matches the layer position", () => {
			const document: PdfDocument = new PdfDocument();
			const collection: any = new PdfLayerCollection(document);
			const firstLayer: PdfLayer = collection.add("First");
			const secondLayer: PdfLayer = collection.add("Second");
			const insertSpy: jasmine.Spy = spyOn(collection, "_insertLayer").and.stub();
			collection.move(1, secondLayer);
			expect(insertSpy).not.toHaveBeenCalled();
			expect(collection.at(0)).toBe(firstLayer);
			expect(collection.at(1)).toBe(secondLayer);
		});
		it("rejects invalid indexes and null layers", () => {
			const document: PdfDocument = new PdfDocument();
			const collection: PdfLayerCollection = new PdfLayerCollection(document);
			const layer: PdfLayer = collection.add("Layer");
			expect(() => collection.move(-1, layer)).toThrowError("Index cannot be less than 0 or greater than array length");
			expect(() => collection.move(1, layer)).toThrowError("Index cannot be less than 0 or greater than array length");
			expect(() => collection.move(0, null as any)).toThrowError("Layer cannot be null or undefined");
		});
	});
	describe("removeAt", () => {
		it("removes the exact layer at the requested index", () => {
			const document: any = new PdfDocument();
			const collection: any = new PdfLayerCollection(document);
			const firstLayer: any = collection.add("First", true);
			const secondLayer: any = collection.add("Second", false);
			collection.removeAt(0);
			const ocProperties: any = document._catalog._catalogDictionary.get("OCProperties");
			expect(collection.count).toBe(1);
			expect(collection.at(0)).toBe(secondLayer);
			expect(collection.contains(firstLayer)).toBeFalsy();
			expect(ocProperties.get("OCGs").length).toBe(1);
			expect(document._on.length).toBe(0);
			expect(document._off.length).toBe(1);
		});
		it("rejects out of range indexes", () => {
			const document: PdfDocument = new PdfDocument();
			const collection: PdfLayerCollection = new PdfLayerCollection(document);
			collection.add("Layer");
			expect(() => collection.removeAt(-1)).toThrowError("Index cannot be less than 0 or greater than array length");
			expect(() => collection.removeAt(1)).toThrowError("Index cannot be less than 0 or greater than array length");
		});
	});
	describe("remove", () => {
		it("removes by layer instance and by exact name", () => {
			const document: any = new PdfDocument();
			const collection: any = new PdfLayerCollection(document);
			const firstLayer: any = collection.add("Alpha");
			const secondLayer: any = collection.add("Beta");
			collection.remove(firstLayer);
			expect(collection.count).toBe(1);
			expect(collection.at(0)).toBe(secondLayer);
			expect(collection.contains("Alpha")).toBeFalsy();
			collection.add("Alpha");
			collection.add("Alpha");
			collection.remove("Alpha");
			expect(collection.count).toBe(1);
			expect(collection.at(0).name).toBe("Beta");
			expect(document._catalog._catalogDictionary.get("OCProperties").get("OCGs").length).toBe(1);
		});
	});
	describe("_createLayer", () => {
		it("targets mutant IDs 350, 352, 354, 356, 360, 365, 369, 374, 379, 384, 393, 396, 398, 401, 403, 404, 405, 406, 416, 417, 422, 424, 425, 426, 427, 444, 459 for merging existing OCProperties", () => {
			const document: any = new PdfDocument();
			const collection: any = new PdfLayerCollection(document);
			const baseLayer: any = collection.add("Base");
			const ocProperties: any = document._catalog._catalogDictionary.get("OCProperties");
			const defaultView: any = ocProperties.get("D");
			const usageApplication: _PdfDictionary = new _PdfDictionary(document._crossReference);
			usageApplication.update("Category", [new _PdfName("Print")]);
			usageApplication.update("OCGs", [baseLayer._referenceHolder]);
			usageApplication.update("Event", new _PdfName("Print"));
			const usageReference: _PdfReference = _PdfReference.get(30, 0);
			document._crossReference._cacheMap.set(usageReference, usageApplication);
			defaultView.update("Order", [baseLayer._referenceHolder]);
			defaultView.update("ON", [baseLayer._referenceHolder]);
			defaultView.update("OFF", []);
			defaultView.update("AS", [usageReference]);
			ocProperties.update("OCGs", [baseLayer._referenceHolder]);
			document._order = [baseLayer._referenceHolder];
			document._on = [baseLayer._referenceHolder];
			document._off = [];
			document._printLayer = [baseLayer._referenceHolder];
			document._as = [usageReference];
			const visibleLayer: any = collection.add("Visible");
			const hiddenLayer: any = collection.add("Hidden", false);
			const updatedUsageApplication: any = document._crossReference._cacheMap.get(usageReference);
			expect(collection.count).toBe(3);
			expect(collection.at(0)).toBe(baseLayer);
			expect(collection.at(1)).toBe(visibleLayer);
			expect(collection.at(2)).toBe(hiddenLayer);
			expect(ocProperties.get("OCGs").length).toBe(3);
			expect(ocProperties.get("OCGs")[0]).toBe(baseLayer._referenceHolder);
			expect(ocProperties.get("OCGs")[1]).toBe(visibleLayer._referenceHolder);
			expect(ocProperties.get("OCGs")[2]).toBe(hiddenLayer._referenceHolder);
			expect(defaultView.get("Order").length).toBe(3);
			expect(defaultView.get("Order")[1]).toBe(visibleLayer._referenceHolder);
			expect(defaultView.get("Order")[2]).toBe(hiddenLayer._referenceHolder);
			expect(defaultView.get("ON").length).toBe(2);
			expect(defaultView.get("OFF").length).toBe(1);
			expect(defaultView.get("ON")[1]).toBe(visibleLayer._referenceHolder);
			expect(defaultView.get("OFF")[0]).toBe(hiddenLayer._referenceHolder);
			expect(updatedUsageApplication.get("OCGs").length).toBe(3);
			expect(updatedUsageApplication.get("OCGs")[0]).toBe(baseLayer._referenceHolder);
			expect(updatedUsageApplication.get("OCGs")[1]).toBe(visibleLayer._referenceHolder);
			expect(updatedUsageApplication.get("OCGs")[2]).toBe(hiddenLayer._referenceHolder);
		});
	});
	describe("_createOptionalContentViews", () => {
		it("targets mutant IDs 471, 472, 473, 474, 475, 476 for default view creation", () => {
			const document: any = new PdfDocument();
			const collection: any = new PdfLayerCollection(document);
			document._order = [];
			document._on = [];
			document._off = [];
			document._printLayer = [];
			document._as = [];
			const views: any = collection._createOptionalContentViews();
			const usageReference: any = document._as[0];
			const usageApplication: any = document._crossReference._cacheMap.get(usageReference);
			expect(views.get("Name")).toBe("Layers");
			expect(views.get("Order")).toBe(document._order);
			expect(views.get("ON")).toBe(document._on);
			expect(views.get("OFF")).toBe(document._off);
			expect(views.get("AS")).toBe(document._as);
			expect(document._as.length).toBe(1);
			expect(usageApplication.get("Category").length).toBe(1);
			expect(usageApplication.get("Category")[0].name).toBe("Print");
			expect(usageApplication.get("OCGs")).toBe(document._printLayer);
			expect(usageApplication.get("Event").name).toBe("Print");
		});
	});
	describe("_setPrintOption", () => {
		it("targets mutant IDs 479, 480, 446, 449, 450, 451, 452, 453, 454 for print option dictionaries", () => {
			const document: any = new PdfDocument();
			const collection: any = new PdfLayerCollection(document);
			const neverLayer: any = new PdfLayer();
			neverLayer._document = document;
			neverLayer._crossReference = document._crossReference;
			neverLayer._printState = PdfPrintState.neverPrint;
			const alwaysLayer: any = new PdfLayer();
			alwaysLayer._document = document;
			alwaysLayer._crossReference = document._crossReference;
			alwaysLayer._printState = PdfPrintState.alwaysPrint;
			const visibleLayer: any = new PdfLayer();
			visibleLayer._document = document;
			visibleLayer._crossReference = document._crossReference;
			visibleLayer._printState = PdfPrintState.printWhenVisible;
			const neverUsageReference: _PdfReference = collection._setPrintOption(neverLayer);
			const alwaysUsageReference: _PdfReference = collection._setPrintOption(alwaysLayer);
			const visibleUsageReference: _PdfReference = collection._setPrintOption(visibleLayer);
			const neverUsage: any = document._crossReference._cacheMap.get(neverUsageReference);
			const alwaysUsage: any = document._crossReference._cacheMap.get(alwaysUsageReference);
			const visibleUsage: any = document._crossReference._cacheMap.get(visibleUsageReference);
			const neverPrint: any = document._crossReference._cacheMap.get(neverUsage.get("Print"));
			const alwaysPrint: any = document._crossReference._cacheMap.get(alwaysUsage.get("Print"));
			const visiblePrint: any = document._crossReference._cacheMap.get(visibleUsage.get("Print"));
			expect(neverUsage.get("Print")).toBe(neverLayer._usage.get("Print"));
			expect(alwaysUsage.get("Print")).toBe(alwaysLayer._usage.get("Print"));
			expect(visibleUsage.get("Print")).toBe(visibleLayer._usage.get("Print"));
			expect(neverPrint.get("Subtype").name).toBe("Print");
			expect(neverPrint.get("PrintState").name).toBe("OFF");
			expect(alwaysPrint.get("Subtype").name).toBe("Print");
			expect(alwaysPrint.get("PrintState").name).toBe("ON");
			expect(visiblePrint.get("Subtype").name).toBe("Print");
			expect(visiblePrint.has("PrintState")).toBeFalsy();
			expect(neverLayer._printOption).toBe(neverPrint);
			expect(alwaysLayer._printOption).toBe(alwaysPrint);
			expect(visibleLayer._printOption).toBe(visiblePrint);
		});
	});
	describe("_createSublayer", () => {
		it("targets mutant IDs 500, 502, 503, 504, 505, 506, 508, 509 for top-level ordering", () => {
			const document: any = new PdfDocument();
			const collection: any = new PdfLayerCollection(document);
			const layer: any = new PdfLayer();
			const layerReference: _PdfReference = _PdfReference.get(40, 0);
			layer._document = document;
			layer._crossReference = document._crossReference;
			layer._referenceHolder = layerReference;
			layer._child = [];
			layer._parentLayer = [];
			layer._subLayer = [];
			const ocProperties: _PdfDictionary = new _PdfDictionary(document._crossReference);
			const defaultView: _PdfDictionary = new _PdfDictionary(document._crossReference);
			defaultView.update("Order", []);
			ocProperties.update("D", defaultView);
			document._order = [];
			collection._subLayer = false;
			collection._createSublayer(ocProperties, layerReference, layer);
			expect(document._order.length).toBe(1);
			expect(document._order[0]).toBe(layerReference);
			expect(layer._parent).toBeUndefined();
			expect(layer._child.length).toBe(0);
		});
		it("targets mutant IDs 525, 528, 531, 533, 545, 548, 550, 554, 555, 556, 557, 558, 559, 560, 561, 584, 590, 595, 600 for nested child insertion", () => {
			const document: any = new PdfDocument();
			const collection: any = new PdfLayerCollection(document);
			const parent: any = new PdfLayer();
			const child: any = new PdfLayer();
			const parentReference: _PdfReference = _PdfReference.get(42, 0);
			const childReference: _PdfReference = _PdfReference.get(43, 0);
			parent._document = document;
			parent._crossReference = document._crossReference;
			parent._referenceHolder = parentReference;
			parent._child = [];
			parent._parentLayer = [];
			parent._subLayer = [];
			child._document = document;
			child._crossReference = document._crossReference;
			child._referenceHolder = childReference;
			child._child = [];
			child._parentLayer = [];
			child._subLayer = [];
			document._order = [parentReference];
			const ocProperties: _PdfDictionary = new _PdfDictionary(document._crossReference);
			const defaultView: _PdfDictionary = new _PdfDictionary(document._crossReference);
			defaultView.update("Order", document._order);
			ocProperties.update("D", defaultView);
			collection._subLayer = true;
			collection._parent = parent;
			collection._createSublayer(ocProperties, childReference, child);
			expect(parent._child.length).toBe(1);
			expect(parent._child[0]).toBe(child);
			expect(child._parent).toBe(parent);
			expect(child._parentLayer.length).toBe(1);
			expect(child._parentLayer[0]).toBe(parent);
			expect(parent._subLayer.length).toBe(1);
			expect(parent._subLayer[0]).toBe(childReference);
			expect(document._order.length).toBe(2);
			expect(document._order[0]).toBe(parentReference);
		});
	});
	describe("_checkLayerVisible", () => {
		it("targets mutant IDs 649, 650, 651, 652, 653, 656, 658, 661 for matching OFF references", () => {
			const document: any = new PdfDocument();
			const collection: any = new PdfLayerCollection(document);
			const layerRef: _PdfReference = _PdfReference.get(60, 0);
			const layer: any = new PdfLayer();
			layer._visible = true;
			layer._dictionary = new _PdfDictionary(document._crossReference);
			const layerMap: Map<_PdfReference, PdfLayer> = new Map();
			layerMap.set(layerRef, layer);
			const ocProperties: _PdfDictionary = new _PdfDictionary(document._crossReference);
			const defaultView: _PdfDictionary = new _PdfDictionary(document._crossReference);
			defaultView.update("OFF", [layerRef]);
			ocProperties.update("D", defaultView);
			document._catalog._catalogDictionary.update("OCProperties", ocProperties);
			collection._layerDictionary = layerMap;
			collection._checkLayerVisible(ocProperties);
			expect(layer._visible).toBeFalsy();
			expect(layer._dictionary.get("Visible")).toBeFalsy();
		});
		it("targets mutant IDs 649, 650, 651, 652, 653, 656, 658, 661 for non matching OFF references", () => {
			const document: any = new PdfDocument();
			const collection: any = new PdfLayerCollection(document);
			const layerRef: _PdfReference = _PdfReference.get(61, 0);
			const layer: any = new PdfLayer();
			layer._visible = true;
			layer._dictionary = new _PdfDictionary(document._crossReference);
			const layerMap: Map<_PdfReference, PdfLayer> = new Map();
			layerMap.set(layerRef, layer);
			const ocProperties: _PdfDictionary = new _PdfDictionary(document._crossReference);
			const defaultView: _PdfDictionary = new _PdfDictionary(document._crossReference);
			defaultView.update("OFF", [_PdfReference.get(62, 0)]);
			ocProperties.update("D", defaultView);
			document._catalog._catalogDictionary.update("OCProperties", ocProperties);
			collection._layerDictionary = layerMap;
			collection._checkLayerVisible(ocProperties);
			expect(layer._visible).toBeTruthy();
			expect(layer._dictionary.has("Visible")).toBeFalsy();
		});
	});
	describe("_parsingLayerOrder", () => {
		it("targets mutant IDs 668, 672, 677, 684, 687, 693, 699, 704, 709, 711, 717, 718, 720 for nested parent child parsing", () => {
			const document: any = new PdfDocument();
			const collection: any = new PdfLayerCollection(document);
			const parentRef: _PdfReference = _PdfReference.get(70, 0);
			const childRef: _PdfReference = _PdfReference.get(71, 0);
			const parent: any = new PdfLayer();
			parent._child = [];
			parent._parentLayer = [];
			parent._subLayer = [];
			const child: any = new PdfLayer();
			child._child = [];
			child._parentLayer = [];
			child._subLayer = [];
			const layerDictionary: Map<_PdfReference, PdfLayer> = new Map();
			layerDictionary.set(parentRef, parent);
			layerDictionary.set(childRef, child);
			collection._parsingLayerOrder(null, [parentRef, [childRef]], layerDictionary);
			expect(parent._child.length).toBe(1);
			expect(parent._child[0]).toBe(child);
			expect(child._parent).toBe(parent);
			expect(child._parentLayer.length).toBe(1);
			expect(child._parentLayer[0]).toBe(parent);
			expect(parent._subLayer.length).toBe(1);
			expect(parent._subLayer[0]).toBe(childRef);
			expect(child._subLayer.length).toBe(0);
		});
		it("targets mutant IDs 728, 729, 731, 733 for empty nested arrays", () => {
			const document: any = new PdfDocument();
			const collection: any = new PdfLayerCollection(document);
			const parentRef: _PdfReference = _PdfReference.get(72, 0);
			const parent: any = new PdfLayer();
			parent._child = [];
			parent._parentLayer = [];
			parent._subLayer = [];
			const layerDictionary: Map<_PdfReference, PdfLayer> = new Map();
			layerDictionary.set(parentRef, parent);
			collection._parsingLayerOrder(null, [parentRef, []], layerDictionary);
			expect(parent._child.length).toBe(0);
			expect(parent._parentLayer.length).toBe(0);
			expect(parent._subLayer.length).toBe(0);
		});
		it("targets mutant IDs 734, 735, 736, 737, 738 for string based nested arrays", () => {
			const document: any = new PdfDocument();
			const collection: any = new PdfLayerCollection(document);
			const parentRef: _PdfReference = _PdfReference.get(73, 0);
			const parent: any = new PdfLayer();
			parent._child = [];
			parent._parentLayer = [];
			parent._subLayer = [];
			const layerDictionary: Map<_PdfReference, PdfLayer> = new Map();
			layerDictionary.set(parentRef, parent);
			collection._parsingLayerOrder(null, [parentRef, ["Text" as any]], layerDictionary);
			expect(parent._child.length).toBe(0);
			expect(parent._parentLayer.length).toBe(0);
			expect(parent._subLayer.length).toBe(1);
		});
	});
	describe("_createLayerHierarchical", () => {
		it("targets mutant IDs 742, 744, 747, 749, 750, 751, 755, 757, 763, 772, 774, 775, 776, 777 for rebuilding hierarchical order", () => {
			const document: any = new PdfDocument();
			const collection: any = new PdfLayerCollection(document);
			const parentRef: _PdfReference = _PdfReference.get(80, 0);
			const childRef: _PdfReference = _PdfReference.get(81, 0);
			const parent: any = new PdfLayer();
			parent._document = document;
			parent._layer = parent;
			parent._child = [];
			parent._parentLayer = [];
			parent._subLayer = [];
			const child: any = new PdfLayer();
			child._document = document;
			child._layer = child;
			child._child = [];
			child._parent = parent;
			child._parentLayer = [];
			child._subLayer = [];
			const layerDictionary: Map<_PdfReference, PdfLayer> = new Map();
			layerDictionary.set(parentRef, parent);
			layerDictionary.set(childRef, child);
			collection._layerDictionary = layerDictionary;
			collection._list = [new PdfLayer()];
			const ocProperties: _PdfDictionary = new _PdfDictionary(document._crossReference);
			const defaultView: _PdfDictionary = new _PdfDictionary(document._crossReference);
			defaultView.update("Order", [parentRef, childRef]);
			ocProperties.update("D", defaultView);
			collection._createLayerHierarchical(ocProperties);
			expect(collection.count).toBe(1);
			expect(collection.at(0)).toBe(parent);
			expect(parent.layers.count).toBe(1);
			expect(parent.layers.at(0)).toBe(child);
			expect(child._parent).toBe(parent);
			expect(child._parentLayer[0]).toBeUndefined();
		});
	});
	describe("_addChildLayer", () => {
		it("targets mutant ID 783 for adding unique children only once", () => {
			const document: any = new PdfDocument();
			const collection: any = new PdfLayerCollection(document);
			const parent: any = new PdfLayer();
			const child: any = new PdfLayer();
			parent._document = document;
			parent._layer = parent;
			parent._child = [child];
			parent._parentLayer = [];
			parent._subLayer = [];
			collection._addChildLayer(parent);
			collection._addChildLayer(parent);
			expect(parent.layers.count).toBe(1);
			expect(parent.layers.at(0)).toBe(child);
		});
	});
	describe("_addNestedLayer", () => {
		it("targets mutant ID 789 for nested layer insertion", () => {
			const document: any = new PdfDocument();
			const collection: any = new PdfLayerCollection(document);
			const layer: any = new PdfLayer();
			const index: number = collection._addNestedLayer(layer);
			expect(index).toBe(0);
			expect(collection.count).toBe(1);
			expect(collection.at(0)).toBe(layer);
			expect(layer._layer).toBe(layer);
		});
	});
	describe("_removeLayer", () => {
		it("targets mutant IDs 791, 793, 795, 797, 801, 805, 808, 813, 816, 817, 818, 819, 820, 821, 822, 823, 824, 825, 830, 833, 838, 843, 848, 851, 856, 861, 863, 865, 866, 867, 868, 869, 871, 872, 873, 874, 875, 876, 877, 878, 881, 886, 888, 889, 891, 894, 897, 899, 903, 912, 916, 919, 924, 925 for visible layer cleanup", () => {
			const document: any = new PdfDocument();
			const collection: any = new PdfLayerCollection(document);
			const visibleLayer: any = collection.add("Visible", true);
			const otherRef: _PdfReference = _PdfReference.get(90, 0);
			const usageRef: _PdfReference = _PdfReference.get(91, 0);
			const printRef: _PdfReference = _PdfReference.get(92, 0);
			const usageDictionary: _PdfDictionary = new _PdfDictionary(document._crossReference);
			usageDictionary.update("OCGs", [visibleLayer._referenceHolder]);
			usageDictionary.update("Print", printRef);
			const printDictionary: _PdfDictionary = new _PdfDictionary(document._crossReference);
			document._crossReference._cacheMap.set(usageRef, usageDictionary);
			document._crossReference._cacheMap.set(printRef, printDictionary);
			visibleLayer._dictionary.set("Usage", usageRef);
			const ocProperties: any = document._catalog._catalogDictionary.get("OCProperties");
			const defaultView: any = ocProperties.get("D");
			ocProperties.update("OCGs", [otherRef, visibleLayer._referenceHolder]);
			defaultView.update("Order", [otherRef, [visibleLayer._referenceHolder]]);
			defaultView.update("Locked", [visibleLayer._referenceHolder]);
			defaultView.update("ON", [visibleLayer._referenceHolder]);
			defaultView.update("OFF", []);
			defaultView.update("AS", [usageRef]);
			collection.remove(visibleLayer, false);
			expect(collection.count).toBe(0);
			expect(collection.contains(visibleLayer)).toBeFalsy();
			expect(ocProperties.get("OCGs").length).toBe(1);
			expect(ocProperties.get("OCGs")[0]).toBe(otherRef);
			expect(defaultView.get("Locked").length).toBe(0);
			expect(defaultView.get("ON").length).toBe(0);
			expect(defaultView.get("Order").length).toBe(2);
			expect(defaultView.get("Order")[0]).toBe(otherRef);
			expect(Array.isArray(defaultView.get("Order")[1])).toBeTruthy();
			expect((defaultView.get("Order")[1] as any[]).length).toBe(0);
			expect(usageDictionary.get("OCGs").length).toBe(0);
			expect(document._crossReference._cacheMap.has(visibleLayer._referenceHolder)).toBeFalsy();
			expect(document._crossReference._cacheMap.has(usageRef)).toBeFalsy();
			expect(document._crossReference._cacheMap.has(printRef)).toBeFalsy();
			expect(ocProperties._updated).toBeTruthy();
			expect(document._catalog._catalogDictionary._updated).toBeTruthy();
			expect(document._crossReference._allowCatalog).toBeTruthy();
		});
		it("targets mutant IDs 791, 793, 795, 797, 801, 805, 808, 813, 816, 817, 818, 819, 820, 821, 822, 823, 824, 825, 830, 833, 838, 843, 848, 851, 856, 861, 863, 865, 866, 867, 868, 869, 871, 872, 873, 874, 875, 876, 877, 878, 881, 886, 888, 889, 891, 894, 897, 899, 903, 912, 916, 919, 924, 925 for hidden layer cleanup", () => {
			const document: any = new PdfDocument();
			const collection: any = new PdfLayerCollection(document);
			const hiddenLayer: any = collection.add("Hidden", false);
			const otherRef: _PdfReference = _PdfReference.get(93, 0);
			const usageRef: _PdfReference = _PdfReference.get(94, 0);
			const printRef: _PdfReference = _PdfReference.get(95, 0);
			const usageDictionary: _PdfDictionary = new _PdfDictionary(document._crossReference);
			usageDictionary.update("OCGs", [hiddenLayer._referenceHolder]);
			usageDictionary.update("Print", printRef);
			const printDictionary: _PdfDictionary = new _PdfDictionary(document._crossReference);
			document._crossReference._cacheMap.set(usageRef, usageDictionary);
			document._crossReference._cacheMap.set(printRef, printDictionary);
			hiddenLayer._dictionary.set("Usage", usageRef);
			const ocProperties: any = document._catalog._catalogDictionary.get("OCProperties");
			const defaultView: any = ocProperties.get("D");
			ocProperties.update("OCGs", [otherRef, hiddenLayer._referenceHolder]);
			defaultView.update("Order", [otherRef, hiddenLayer._referenceHolder]);
			defaultView.update("Locked", [hiddenLayer._referenceHolder]);
			defaultView.update("ON", []);
			defaultView.update("OFF", [hiddenLayer._referenceHolder]);
			defaultView.update("AS", [usageRef]);
			collection.remove(hiddenLayer, false);
			expect(collection.count).toBe(0);
			expect(collection.contains(hiddenLayer)).toBeFalsy();
			expect(ocProperties.get("OCGs").length).toBe(1);
			expect(ocProperties.get("OCGs")[0]).toBe(otherRef);
			expect(defaultView.get("Locked").length).toBe(0);
			expect(defaultView.get("OFF").length).toBe(0);
			expect(defaultView.get("ON").length).toBe(0);
			expect(usageDictionary.get("OCGs").length).toBe(0);
			expect(document._crossReference._cacheMap.has(hiddenLayer._referenceHolder)).toBeFalsy();
			expect(document._crossReference._cacheMap.has(usageRef)).toBeFalsy();
			expect(document._crossReference._cacheMap.has(printRef)).toBeFalsy();
		});
	});
	describe("_removeLayerContent", () => {
		it("targets mutant IDs 856, 861, 863, 865, 866, 867, 868, 869, 871, 872, 873, 874, 875, 876, 877, 878, 881, 886, 888, 889, 891, 894, 897, 899, 903, 912, 916, 919, 924, 925 for page content removal", () => {
			const document: any = new PdfDocument();
			const collection: any = new PdfLayerCollection(document);
			const layer: any = collection.add("Layer", true);
			layer._layerId = "LayerA";
			layer._pageParsed = true;
			layer._page = undefined;
			layer._xObject = ["LayerA", "X1"];
			const pageDictionary: _PdfDictionary = new _PdfDictionary(document._crossReference);
			const resources: _PdfDictionary = new _PdfDictionary(document._crossReference);
			const properties: _PdfDictionary = new _PdfDictionary(document._crossReference);
			const xObject: _PdfDictionary = new _PdfDictionary(document._crossReference);
			properties.update("LayerA", true);
			xObject.update("X1", "X1");
			resources.update("Properties", properties);
			resources.update("XObject", xObject);
			pageDictionary.update("Resources", resources);
			const page: any = new PdfPage(document._crossReference, 0, pageDictionary, _PdfReference.get(120, 0));
			const contentReference: _PdfReference = _PdfReference.get(121, 0);
			const contentStream: _PdfContentStream = new _PdfContentStream([]);
			contentStream.write("q /OC /LayerA BDC EMC Q");
			document._crossReference._cacheMap.set(contentReference, contentStream);
			page._contents = [contentReference];
			page._pageDictionary.update("Contents", [contentStream]);
			layer._pages = [page];
			layer._page = page;
			collection._removeLayerContent(layer);
			expect(properties.has("LayerA")).toBeFalsy();
			expect(xObject.has("X1")).toBe(true);
			expect(layer._xObject.length).toBe(1);
			expect(layer._xObject[0]).toBe("X1");
			expect(contentStream.getString()).toBe('q /OC /LayerA BDC EMC Q');
			expect(page._pageDictionary._updated).toBeTruthy();
		});
		it("targets mutant IDs 1029, 1031, 1032, 1033, 1034, 1035, 1042, 1043 for blank layer id preservation", () => {
			const document: any = new PdfDocument();
			const collection: any = new PdfLayerCollection(document);
			const layer: any = new PdfLayer();
			layer._document = document;
			layer._crossReference = document._crossReference;
			layer._pageParsed = true;
			layer._page = undefined;
			layer._layerId = " ";
			layer._xObject = [];
			const pageDictionary: _PdfDictionary = new _PdfDictionary(document._crossReference);
			const resources: _PdfDictionary = new _PdfDictionary(document._crossReference);
			const properties: _PdfDictionary = new _PdfDictionary(document._crossReference);
			properties.update(" ", true);
			resources.update("Properties", properties);
			pageDictionary.update("Resources", resources);
			pageDictionary.update("Contents", []);
			const page: any = new PdfPage(document._crossReference, 0, pageDictionary, _PdfReference.get(122, 0));
			layer._pages = [page];
			layer._page = page;
			collection._removeLayerContent(layer);
			expect(properties.has(" ")).toBeTruthy();
			expect(layer._xObject.length).toBe(0);
			expect(page._pageDictionary._updated).toBeTruthy();
		});
	});
	describe("_processBeginMarkContent", () => {
		it("targets mutant IDs 877, 878, 881, 886, 888, 889, 891, 894, 897, 899, 903, 912, 916, 919, 924, 925 for BDC and EMC state transitions", () => {
			const document: any = new PdfDocument();
			const collection: any = new PdfLayerCollection(document);
			const layer: any = new PdfLayer();
			layer._layerId = "LayerB";
			const pageDictionary: _PdfDictionary = new _PdfDictionary(document._crossReference);
			pageDictionary.update("Contents", [_PdfReference.get(130, 0)]);
			const page: any = new PdfPage(document._crossReference, 0, pageDictionary, _PdfReference.get(131, 0));
			layer._pages = [page];
			const data: _PdfContentStream = new _PdfContentStream([]);
			collection._bdcCount = 0;
			collection._processBeginMarkContent(layer, "BDC", ["/OC", "/LayerB"], data, "130 0");
			expect(collection._bdcCount).toBe(1);
			expect(page._pageDictionary.getRaw("Contents").length).toBe(0);
			expect(data.length).toBe(0);
			collection._processBeginMarkContent(layer, "EMC", [], data);
			expect(collection._bdcCount).toBe(0);
			expect(data.length).toBe(0);
		});
		it("targets mutant IDs 1247, 1249, 1250, 1251, 1253, 1295, 1299 for non-OC BDC output", () => {
			const document: any = new PdfDocument();
			const collection: any = new PdfLayerCollection(document);
			const layer: any = new PdfLayer();
			layer._layerId = "LayerC";
			const data: _PdfContentStream = new _PdfContentStream([]);
			collection._bdcCount = 0;
			collection._processBeginMarkContent(layer, "BDC", ["/NotOC"], data);
			expect(collection._bdcCount).toBe(0);
			expect(data.getString()).toBe("/NotOC BDC\r\n");
		});
		it("targets mutant IDs 1247, 1249, 1250, 1251, 1253 for nested BDC skip counting", () => {
			const document: any = new PdfDocument();
			const collection: any = new PdfLayerCollection(document);
			const layer: any = new PdfLayer();
			layer._layerId = "LayerD";
			const data: _PdfContentStream = new _PdfContentStream([]);
			collection._bdcCount = 1;
			collection._processBeginMarkContent(layer, "BDC", ["/OC", "/LayerD"], data, "130 0");
			expect(collection._bdcCount).toBe(2);
			expect(data.length).toBe(0);
		});
	});
	describe("_streamWrite", () => {
		it("targets mutant IDs 902, 903, 907, 908 for operand and operator output", () => {
			const document: any = new PdfDocument();
			const collection: any = new PdfLayerCollection(document);
			const data: _PdfContentStream = new _PdfContentStream([]);
			collection._streamWrite(["A", "B"], "Tj", false, data);
			expect(data.getString()).toBe("A B Tj\r\n");
		});
		it("targets mutant IDs 902, 903, 907, 908 for skip handling when BDC state is active", () => {
			const document: any = new PdfDocument();
			const collection: any = new PdfLayerCollection(document);
			const data: _PdfContentStream = new _PdfContentStream([]);
			collection._bdcCount = 1;
			collection._streamWrite(["A"], "Tj", true, data);
			expect(data.length).toBe(0);
			expect(collection._isSkip).toBeTruthy();
		});
		it("targets mutant IDs 1295, 1299, 1220 for skip flag without active skip state", () => {
			const document: any = new PdfDocument();
			const collection: any = new PdfLayerCollection(document);
			const data: _PdfContentStream = new _PdfContentStream([]);
			collection._streamWrite(["A"], "Tj", true, data);
			expect(data.getString()).toBe("A Tj\r\n");
		});
		it("targets mutant IDs 1295, 1299, 1067 for operator only output", () => {
			const document: any = new PdfDocument();
			const collection: any = new PdfLayerCollection(document);
			const data: _PdfContentStream = new _PdfContentStream([]);
			collection._streamWrite(undefined as any, "Q", false, data);
			expect(data.getString()).toBe("Q\r\n");
		});
	});
	describe("_removeUsage", () => {
		it("targets mutant IDs 926, 927 for stopping after the first matching usage entry", () => {
			const document: any = new PdfDocument();
			const collection: any = new PdfLayerCollection(document);
			const layer: any = new PdfLayer();
			const targetRef: _PdfReference = _PdfReference.get(200, 0);
			const keepRef: _PdfReference = _PdfReference.get(201, 0);
			layer._referenceHolder = targetRef;
			const firstUsage: _PdfDictionary = new _PdfDictionary(document._crossReference);
			firstUsage.update("OCGs", [targetRef, keepRef]);
			const secondUsage: _PdfDictionary = new _PdfDictionary(document._crossReference);
			secondUsage.update("OCGs", [targetRef]);
			collection._removeUsage(layer, [firstUsage, secondUsage]);
			expect(firstUsage.get("OCGs").length).toBe(1);
			expect(firstUsage.get("OCGs")[0]).toBe(keepRef);
			expect(secondUsage.get("OCGs").length).toBe(1);
			expect(secondUsage.get("OCGs")[0]).toBe(targetRef);
		});
	});
	describe("_removeOrder", () => {
		it("targets mutant IDs 928, 929, 930, 931, 932, 933, 934, 935, 937, 939, 941, 942, 945, 946, 947, 948, 949, 950, 952, 953, 954, 955, 956, 957, 958, 959 for direct removal", () => {
			const document: any = new PdfDocument();
			const collection: any = new PdfLayerCollection(document);
			const layer: any = new PdfLayer();
			const targetRef: _PdfReference = _PdfReference.get(210, 0);
			const keepRef: _PdfReference = _PdfReference.get(211, 0);
			const tailRef: _PdfReference = _PdfReference.get(212, 0);
			layer._referenceHolder = targetRef;
			const order: any[] = [keepRef, targetRef, tailRef];
			const arrayList: any[] = [];
			collection._removeOrder(layer, order, arrayList);
			expect(order.length).toBe(2);
			expect(order[0]).toBe(keepRef);
			expect(order[1]).toBe(tailRef);
			expect(arrayList.length).toBe(0);
		});
		it("targets mutant IDs 928, 929, 930, 931, 932, 933, 934, 935, 937, 939, 941, 942, 945, 946, 947, 948, 949, 950, 952, 953, 954, 955, 956, 957, 958, 959 for nested removal with trailing array", () => {
			const document: any = new PdfDocument();
			const collection: any = new PdfLayerCollection(document);
			const layer: any = new PdfLayer();
			const targetRef: _PdfReference = _PdfReference.get(220, 0);
			const keepRef: _PdfReference = _PdfReference.get(221, 0);
			layer._referenceHolder = targetRef;
			const order: any[] = [keepRef, targetRef, [keepRef]];
			collection._removeOrder(layer, order, []);
			expect(order.length).toBe(1);
			expect(order[0]).toBe(keepRef);
		});
		it("targets mutant IDs 960, 961, 962, 963, 964, 965, 966, 967, 968, 973 for recursive arrayList processing", () => {
			const document: any = new PdfDocument();
			const collection: any = new PdfLayerCollection(document);
			const layer: any = new PdfLayer();
			const targetRef: _PdfReference = _PdfReference.get(230, 0);
			const firstKeep: _PdfReference = _PdfReference.get(231, 0);
			const secondKeep: _PdfReference = _PdfReference.get(232, 0);
			layer._referenceHolder = targetRef;
			const firstNested: any[] = [targetRef, firstKeep];
			const secondNested: any[] = [targetRef, secondKeep];
			const order: any[] = [firstNested, secondNested];
			collection._removeOrder(layer, order, []);
			expect(firstNested.length).toBe(1);
			expect(firstNested[0]).toBe(firstKeep);
			expect(secondNested.length).toBe(1);
			expect(secondNested[0]).toBe(secondKeep);
		});
	});
	describe("_removeVisible", () => {
		it("targets mutant IDs 978, 980, 981, 983, 984, 985, 989, 994, 995, 996, 999, 1001 for matching ON and OFF removals", () => {
			const document: any = new PdfDocument();
			const collection: any = new PdfLayerCollection(document);
			const visibleLayer: any = new PdfLayer();
			visibleLayer._visible = true;
			visibleLayer._dictionary = new _PdfDictionary(document._crossReference);
			visibleLayer._referenceHolder = _PdfReference.get(240, 0);
			const hiddenLayer: any = new PdfLayer();
			hiddenLayer._visible = false;
			hiddenLayer._dictionary = new _PdfDictionary(document._crossReference);
			hiddenLayer._referenceHolder = _PdfReference.get(241, 0);
			const onKeepRef: _PdfReference = _PdfReference.get(242, 0);
			const offKeepRef: _PdfReference = _PdfReference.get(243, 0);
			const on: _PdfReference[] = [visibleLayer._referenceHolder, onKeepRef];
			const off: _PdfReference[] = [offKeepRef, hiddenLayer._referenceHolder];
			collection._removeVisible(visibleLayer, on, off);
			collection._removeVisible(hiddenLayer, on, off);
			expect(on.length).toBe(1);
			expect(on[0]).toBe(onKeepRef);
			expect(off.length).toBe(1);
			expect(off[0]).toBe(offKeepRef);
		});
		it("targets mutant IDs 978, 980, 981, 983, 984, 985, 989, 994, 995, 996, 999, 1001 for non matching arrays", () => {
			const document: any = new PdfDocument();
			const collection: any = new PdfLayerCollection(document);
			const visibleLayer: any = new PdfLayer();
			visibleLayer._visible = true;
			visibleLayer._dictionary = new _PdfDictionary(document._crossReference);
			visibleLayer._referenceHolder = _PdfReference.get(244, 0);
			const hiddenLayer: any = new PdfLayer();
			hiddenLayer._visible = false;
			hiddenLayer._dictionary = new _PdfDictionary(document._crossReference);
			hiddenLayer._referenceHolder = _PdfReference.get(245, 0);
			const onKeepRef: _PdfReference = _PdfReference.get(246, 0);
			const offKeepRef: _PdfReference = _PdfReference.get(247, 0);
			const on: _PdfReference[] = [onKeepRef];
			const off: _PdfReference[] = [offKeepRef];
			collection._removeVisible(visibleLayer, on, off);
			collection._removeVisible(hiddenLayer, on, off);
			expect(on.length).toBe(1);
			expect(on[0]).toBe(onKeepRef);
			expect(off.length).toBe(1);
			expect(off[0]).toBe(offKeepRef);
		});
	});
	describe("_removeLocked", () => {
		it("targets mutant IDs 1006, 1008, 1009, 1011 for matching locked removal", () => {
			const document: any = new PdfDocument();
			const collection: any = new PdfLayerCollection(document);
			const layer: any = new PdfLayer();
			layer._referenceHolder = _PdfReference.get(250, 0);
			const keepRef: _PdfReference = _PdfReference.get(251, 0);
			const locked: _PdfReference[] = [keepRef, layer._referenceHolder];
			collection._removeLocked(layer, locked);
			expect(locked.length).toBe(1);
			expect(locked[0]).toBe(keepRef);
		});
		it("targets mutant IDs 1006, 1008, 1009, 1011 for non matching locked arrays", () => {
			const document: any = new PdfDocument();
			const collection: any = new PdfLayerCollection(document);
			const layer: any = new PdfLayer();
			layer._referenceHolder = _PdfReference.get(252, 0);
			const keepRef: _PdfReference = _PdfReference.get(253, 0);
			const locked: _PdfReference[] = [keepRef];
			collection._removeLocked(layer, locked);
			expect(locked.length).toBe(1);
			expect(locked[0]).toBe(keepRef);
		});
	});
	describe("_insertLayer", () => {
		it("targets mutant IDs 1306, 1309, 1332, 1334, 1338, 1341, 1344, 1346, 1347, 1348, 1350, 1351, 1352, 1354, 1356, 1358, 1360, 1362, 1365 for reordering document arrays", () => {
			const document: any = new PdfDocument();
			const collection: any = new PdfLayerCollection(document);
			const firstRef: _PdfReference = _PdfReference.get(260, 0);
			const secondRef: _PdfReference = _PdfReference.get(261, 0);
			const thirdRef: _PdfReference = _PdfReference.get(262, 0);
			const ocDictionary: _PdfDictionary = new _PdfDictionary(document._crossReference);
			const defaultView: _PdfDictionary = new _PdfDictionary(document._crossReference);
			defaultView.update("Order", [firstRef, secondRef, thirdRef]);
			ocDictionary.update("D", defaultView);
			ocDictionary.update("OCGs", [firstRef, secondRef, thirdRef]);
			document._catalog._catalogDictionary.update("OCProperties", ocDictionary);
			const layer: any = new PdfLayer();
			layer._referenceHolder = thirdRef;
			collection._insertLayer(0, layer);
			expect(defaultView.get("Order")[0]).toBe(thirdRef);
			expect(defaultView.get("Order")[1]).toBe(firstRef);
			expect(defaultView.get("Order")[2]).toBe(secondRef);
			expect(ocDictionary.get("OCGs")[0]).toBe(thirdRef);
			expect(ocDictionary.get("OCGs")[1]).toBe(firstRef);
			expect(ocDictionary.get("OCGs")[2]).toBe(secondRef);
		});
		it("targets mutant IDs 1306, 1309, 1332, 1334, 1338, 1341, 1344, 1346, 1347, 1348, 1350, 1351, 1352, 1354, 1356, 1358, 1360, 1362, 1365 for short order no-op", () => {
			const document: any = new PdfDocument();
			const collection: any = new PdfLayerCollection(document);
			const firstRef: _PdfReference = _PdfReference.get(263, 0);
			const secondRef: _PdfReference = _PdfReference.get(264, 0);
			const ocDictionary: _PdfDictionary = new _PdfDictionary(document._crossReference);
			const defaultView: _PdfDictionary = new _PdfDictionary(document._crossReference);
			defaultView.update("Order", [firstRef, secondRef]);
			ocDictionary.update("D", defaultView);
			ocDictionary.update("OCGs", [firstRef, secondRef]);
			document._catalog._catalogDictionary.update("OCProperties", ocDictionary);
			const layer: any = new PdfLayer();
			layer._referenceHolder = secondRef;
			collection._insertLayer(0, layer);
			expect(defaultView.get("Order").length).toBe(2);
			expect(defaultView.get("Order")[0]).toBe(firstRef);
			expect(defaultView.get("Order")[1]).toBe(secondRef);
			expect(ocDictionary.get("OCGs")[0]).toBe(firstRef);
			expect(ocDictionary.get("OCGs")[1]).toBe(secondRef);
		});
	});
});
interface PdfLayerCollectionInternals {
	_list: PdfLayer[];
	_document: PdfDocument;
	_crossReference: _PdfCrossReference;
	_layerDictionary: Map<_PdfReference, PdfLayer>;
	_bdcCount: number;
	_isLayerContainsResource: boolean;
	_parent: PdfLayer;
	_subLayer: boolean;
	_setPrintState(
		printOption: _PdfDictionary,
		layer: PdfLayer
	): void;
	_addLayer(
		layer: PdfLayer
	): number;
	_addNestedLayer(
		layer: PdfLayer
	): number;
	_createOptionalContentDictionary(
		layer: PdfLayer
	): Array<_PdfReference>;
	_createOptionalContentViews(): _PdfDictionary;
	_setPrintOption(
		layer: PdfLayer
	): _PdfReference;
	_createSublayer(
		ocProperties: _PdfDictionary,
		reference: _PdfReference,
		layer: PdfLayer
	): void;
	_checkLayerLock(
		ocProperties: _PdfDictionary
	): void;
	_checkLayerVisible(
		ocProperties: _PdfDictionary
	): void;
	_checkParentLayer(
		ocProperties: _PdfDictionary
	): void;
	_parsingLayerOrder(
		parent: PdfLayer,
		array: (_PdfReference | _PdfReference[])[],
		layerDictionary: Map<_PdfReference, PdfLayer>
	): void;
	_createLayerHierarchical(
		ocProperties: _PdfDictionary
	): void;
	_addChildLayer(
		layer: PdfLayer
	): void;
	_removeOCG(
		layer: PdfLayer,
		ocGroup: _PdfReference[]
	): void;
	_removeUsage(
		layer: PdfLayer,
		usage: _PdfReference[]
	): void;
	_removeOrder(
		layer: PdfLayer,
		order: (_PdfReference[] | _PdfReference)[],
		arrayList: (_PdfReference | _PdfReference[])[]
	): void;
	_removeVisible(
		layer: PdfLayer,
		on: _PdfReference[],
		off: _PdfReference[]
	): void;
	_removeLocked(
		layer: PdfLayer,
		locked: _PdfReference[]
	): void;
	_removeLayer(
		layer: PdfLayer,
		removeGraphicalContent: boolean
	): void;
	_removeLayerContent(
		layer: PdfLayer
	): void;
	_processBeginMarkContent(
		layer: PdfLayer,
		operator: string,
		operands: string[],
		data: _PdfContentStream,
		id?: string
	): void;
	_streamWrite(
		operands: string[],
		operator: string,
		skip: boolean,
		data: _PdfContentStream
	): void;
	_insertLayer(
		index: number,
		layer: PdfLayer
	): void;
}
describe('PdfLayerCollection survived-mutant coverage', () => {
	function getInternals(
		collection: PdfLayerCollection
	): PdfLayerCollectionInternals {
		return collection as unknown as PdfLayerCollectionInternals;
	}
	let document: PdfDocument;
	let collection: PdfLayerCollection;
	let internals: PdfLayerCollectionInternals;
	beforeEach((): void => {
		// Arrange
		document = new PdfDocument();
		collection = document.layers;
		internals = getInternals(collection);
	});
	afterEach((): void => {
		document.destroy();
	});
	describe('_removeOrder', () => {
		it('removes a matching reference and its following child array', (): void => {
			// Arrange
			const target: _PdfReference = _PdfReference.get(10, 0);
			const sibling: _PdfReference = _PdfReference.get(11, 0);
			const child: _PdfReference = _PdfReference.get(12, 0);
			const childOrder: _PdfReference[] = [child];
			const order: Array<_PdfReference | _PdfReference[]> = [
				target,
				childOrder,
				sibling
			];
			const arrayList: Array<_PdfReference | _PdfReference[]> = [];
			const layer: PdfLayer = new PdfLayer();
			layer._referenceHolder = target;
			// Act
			internals._removeOrder(layer, order, arrayList);
			// Assert
			expect(order.length).toBe(1);
			expect(order[0]).toBe(sibling);
			expect(order.indexOf(target)).toBe(-1);
			expect(order.indexOf(childOrder)).toBe(-1);
			expect(arrayList.length).toBe(0);
		});
		it('removes a matching non-final reference without removing the next reference', (): void => {
			// Arrange
			const target: _PdfReference = _PdfReference.get(20, 0);
			const next: _PdfReference = _PdfReference.get(21, 0);
			const order: Array<_PdfReference | _PdfReference[]> = [
				target,
				next
			];
			const arrayList: Array<_PdfReference | _PdfReference[]> = [];
			const layer: PdfLayer = new PdfLayer();
			layer._referenceHolder = target;
			// Act
			internals._removeOrder(layer, order, arrayList);
			// Assert
			expect(order.length).toBe(1);
			expect(order[0]).toBe(next);
			expect(order.indexOf(target)).toBe(-1);
		});
		it('removes a matching reference from the final position', (): void => {
			// Arrange
			const first: _PdfReference = _PdfReference.get(30, 0);
			const target: _PdfReference = _PdfReference.get(31, 0);
			const order: Array<_PdfReference | _PdfReference[]> = [
				first,
				target
			];
			const arrayList: Array<_PdfReference | _PdfReference[]> = [];
			const layer: PdfLayer = new PdfLayer();
			layer._referenceHolder = target;
			// Act
			internals._removeOrder(layer, order, arrayList);
			// Assert
			expect(order.length).toBe(1);
			expect(order[0]).toBe(first);
			expect(order.indexOf(target)).toBe(-1);
		});
		it('recursively removes a matching reference from a nested order array', (): void => {
			// Arrange
			const target: _PdfReference = _PdfReference.get(40, 0);
			const sibling: _PdfReference = _PdfReference.get(41, 0);
			const nestedOrder: _PdfReference[] = [target, sibling];
			const order: Array<_PdfReference | _PdfReference[]> = [
				nestedOrder
			];
			const arrayList: Array<_PdfReference | _PdfReference[]> = [];
			const layer: PdfLayer = new PdfLayer();
			layer._referenceHolder = target;
			// Act
			internals._removeOrder(layer, order, arrayList);
			// Assert
			expect(order.length).toBe(1);
			expect(nestedOrder.length).toBe(1);
			expect(nestedOrder[0]).toBe(sibling);
			expect(nestedOrder.indexOf(target)).toBe(-1);
			expect(arrayList.length).toBe(0);
		});
		it('preserves order when the layer reference is absent', (): void => {
			// Arrange
			const first: _PdfReference = _PdfReference.get(50, 0);
			const second: _PdfReference = _PdfReference.get(51, 0);
			const missing: _PdfReference = _PdfReference.get(52, 0);
			const order: Array<_PdfReference | _PdfReference[]> = [
				first,
				second
			];
			const expected: Array<_PdfReference | _PdfReference[]> = [
				first,
				second
			];
			const arrayList: Array<_PdfReference | _PdfReference[]> = [];
			const layer: PdfLayer = new PdfLayer();
			layer._referenceHolder = missing;
			// Act
			internals._removeOrder(layer, order, arrayList);
			// Assert
			expect(order).toEqual(expected);
			expect(order.length).toBe(2);
		});
		it('does not enumerate a null order', (): void => {
			// Arrange
			const target: _PdfReference = _PdfReference.get(60, 0);
			const layer: PdfLayer = new PdfLayer();
			layer._referenceHolder = target;
			const arrayList: Array<_PdfReference | _PdfReference[]> = [];
			// Act
			const action: () => void = (): void => {
				internals._removeOrder(
					layer,
					null as unknown as Array<_PdfReference | _PdfReference[]>,
					arrayList
				);
			};
			// Assert
			expect(action).not.toThrow();
			expect(arrayList.length).toBe(0);
		});
	});
	describe('_removeVisible', () => {
		it('removes a visible layer reference from the ON array only', (): void => {
			// Arrange
			const target: _PdfReference = _PdfReference.get(70, 0);
			const other: _PdfReference = _PdfReference.get(71, 0);
			const on: _PdfReference[] = [other, target];
			const off: _PdfReference[] = [target];
			const layer: PdfLayer = new PdfLayer();
			layer._referenceHolder = target;
			layer._visible = true;
			// Act
			internals._removeVisible(layer, on, off);
			// Assert
			expect(on.length).toBe(1);
			expect(on[0]).toBe(other);
			expect(on.indexOf(target)).toBe(-1);
			expect(off.length).toBe(1);
			expect(off[0]).toBe(target);
		});
		it('removes a hidden layer reference from the OFF array only', (): void => {
			// Arrange
			const target: _PdfReference = _PdfReference.get(80, 0);
			const other: _PdfReference = _PdfReference.get(81, 0);
			const on: _PdfReference[] = [target];
			const off: _PdfReference[] = [other, target];
			const layer: PdfLayer = new PdfLayer();
			layer._referenceHolder = target;
			layer._visible = false;
			// Act
			internals._removeVisible(layer, on, off);
			// Assert
			expect(off.length).toBe(1);
			expect(off[0]).toBe(other);
			expect(off.indexOf(target)).toBe(-1);
			expect(on.length).toBe(1);
			expect(on[0]).toBe(target);
		});
		it('preserves arrays when the visible layer reference is absent', (): void => {
			// Arrange
			const target: _PdfReference = _PdfReference.get(90, 0);
			const other: _PdfReference = _PdfReference.get(91, 0);
			const on: _PdfReference[] = [other];
			const off: _PdfReference[] = [];
			const layer: PdfLayer = new PdfLayer();
			layer._referenceHolder = target;
			layer._visible = true;
			// Act
			internals._removeVisible(layer, on, off);
			// Assert
			expect(on.length).toBe(1);
			expect(on[0]).toBe(other);
			expect(on.indexOf(target)).toBe(-1);
			expect(off.length).toBe(0);
		});
	});
	describe('_removeLocked', () => {
		it('removes exactly the matching layer reference', (): void => {
			// Arrange
			const target: _PdfReference = _PdfReference.get(100, 0);
			const first: _PdfReference = _PdfReference.get(101, 0);
			const last: _PdfReference = _PdfReference.get(102, 0);
			const locked: _PdfReference[] = [first, target, last];
			const layer: PdfLayer = new PdfLayer();
			layer._referenceHolder = target;
			// Act
			internals._removeLocked(layer, locked);
			// Assert
			expect(locked.length).toBe(2);
			expect(locked[0]).toBe(first);
			expect(locked[1]).toBe(last);
			expect(locked.indexOf(target)).toBe(-1);
		});
		it('preserves the locked array when the reference is absent', (): void => {
			// Arrange
			const target: _PdfReference = _PdfReference.get(110, 0);
			const first: _PdfReference = _PdfReference.get(111, 0);
			const locked: _PdfReference[] = [first];
			const layer: PdfLayer = new PdfLayer();
			layer._referenceHolder = target;
			// Act
			internals._removeLocked(layer, locked);
			// Assert
			expect(locked.length).toBe(1);
			expect(locked[0]).toBe(first);
		});
	});
	describe('_removeUsage', () => {
		it('removes the layer reference from the first matching usage dictionary', (): void => {
			// Arrange
			const target: _PdfReference = _PdfReference.get(120, 0);
			const other: _PdfReference = _PdfReference.get(121, 0);
			const usageReference: _PdfReference = _PdfReference.get(122, 0);
			const usageDictionary: _PdfDictionary = new _PdfDictionary();
			const ocGroups: _PdfReference[] = [other, target];
			usageDictionary.update('OCGs', ocGroups);
			spyOn(
				internals._crossReference,
				'_fetch'
			).and.returnValue(usageDictionary);
			const layer: PdfLayer = new PdfLayer();
			layer._referenceHolder = target;
			// Act
			internals._removeUsage(layer, [usageReference]);
			// Assert
			expect(ocGroups.length).toBe(1);
			expect(ocGroups[0]).toBe(other);
			expect(ocGroups.indexOf(target)).toBe(-1);
			expect(internals._crossReference._fetch)
				.toHaveBeenCalledWith(usageReference);
		});
		it('stops after the first usage dictionary removes the reference', (): void => {
			// Arrange
			const target: _PdfReference = _PdfReference.get(130, 0);
			const firstReference: _PdfReference = _PdfReference.get(131, 0);
			const secondReference: _PdfReference = _PdfReference.get(132, 0);
			const firstDictionary: _PdfDictionary = new _PdfDictionary();
			const secondDictionary: _PdfDictionary = new _PdfDictionary();
			const firstGroups: _PdfReference[] = [target];
			const secondGroups: _PdfReference[] = [target];
			firstDictionary.update('OCGs', firstGroups);
			secondDictionary.update('OCGs', secondGroups);
			const fetchSpy: jasmine.Spy = spyOn(
				internals._crossReference,
				'_fetch'
			).and.callFake((reference: _PdfReference): _PdfDictionary => {
				return reference === firstReference
					? firstDictionary
					: secondDictionary;
			});
			const layer: PdfLayer = new PdfLayer();
			layer._referenceHolder = target;
			// Act
			internals._removeUsage(
				layer,
				[firstReference, secondReference]
			);
			// Assert
			expect(firstGroups.length).toBe(0);
			expect(secondGroups.length).toBe(1);
			expect(secondGroups[0]).toBe(target);
			expect(fetchSpy.calls.count()).toBe(1);
		});
		it('preserves usage groups when the target reference is absent', (): void => {
			// Arrange
			const target: _PdfReference = _PdfReference.get(140, 0);
			const other: _PdfReference = _PdfReference.get(141, 0);
			const usageReference: _PdfReference = _PdfReference.get(142, 0);
			const usageDictionary: _PdfDictionary = new _PdfDictionary();
			const ocGroups: _PdfReference[] = [other];
			usageDictionary.update('OCGs', ocGroups);
			spyOn(
				internals._crossReference,
				'_fetch'
			).and.returnValue(usageDictionary);
			const layer: PdfLayer = new PdfLayer();
			layer._referenceHolder = target;
			// Act
			internals._removeUsage(layer, [usageReference]);
			// Assert
			expect(ocGroups.length).toBe(1);
			expect(ocGroups[0]).toBe(other);
		});
	});
	describe('_streamWrite', () => {
		it('writes every operand, the operator, and the exact line ending', (): void => {
			// Arrange
			const data: _PdfContentStream = new _PdfContentStream([]);
			internals._bdcCount = 0;
			// Act
			internals._streamWrite(
				['10', '20'],
				'm',
				false,
				data
			);
			// Assert
			expect(data.getString()).toBe('10 20 m\r\n');
		});
		it('writes an operator when operands are empty', (): void => {
			// Arrange
			const data: _PdfContentStream = new _PdfContentStream([]);
			internals._bdcCount = 0;
			// Act
			internals._streamWrite([], 'Q', false, data);
			// Assert
			expect(data.getString()).toBe('Q\r\n');
		});
		it('does not write when skip is true and BDC state is active', (): void => {
			// Arrange
			const data: _PdfContentStream = new _PdfContentStream([]);
			data.write('existing');
			internals._bdcCount = 1;
			// Act
			internals._streamWrite(
				['10'],
				'm',
				true,
				data
			);
			// Assert
			expect(data.getString()).toBe('existing');
		});
		it('writes when skip is false even if BDC state is active', (): void => {
			// Arrange
			const data: _PdfContentStream = new _PdfContentStream([]);
			internals._bdcCount = 1;
			// Act
			internals._streamWrite(
				['10'],
				'm',
				false,
				data
			);
			// Assert
			expect(data.getString()).toBe('10 m\r\n');
		});
	});
	describe('_processBeginMarkContent', () => {
		it('increments BDC count when a matching OC operand is found', (): void => {
			// Arrange
			const layer: PdfLayer = new PdfLayer();
			const pageDictionary: _PdfDictionary = new _PdfDictionary();
			const data: _PdfContentStream = new _PdfContentStream([]);
			layer._layerId = 'LayerA';
			Object.defineProperty(layer, '_pages', {
				configurable: true,
				value: [
					{
						_pageDictionary: pageDictionary
					}
				],
				writable: true
			});
			internals._bdcCount = 0;
			// Act
			internals._processBeginMarkContent(
				layer,
				'BDC',
				['/OC', '/LayerA'],
				data
			);
			// Assert
			expect(internals._bdcCount).toBe(1);
			expect(data.length).toBe(0);
			expect(data.getString()).toBe('');
		});
		it('increments an already active BDC count and returns immediately', (): void => {
			// Arrange
			const layer: PdfLayer = new PdfLayer();
			layer._layerId = 'LayerA';
			const data: _PdfContentStream = new _PdfContentStream([]);
			internals._bdcCount = 1;
			// Act
			internals._processBeginMarkContent(
				layer,
				'BDC',
				['/OC', '/OtherLayer'],
				data
			);
			// Assert
			expect(internals._bdcCount).toBe(2);
			expect(data.getString()).toBe('');
		});
		it('does not increment BDC count for an unmatched layer operand', (): void => {
			// Arrange
			const layer: PdfLayer = new PdfLayer();
			layer._layerId = 'LayerA';
			const data: _PdfContentStream = new _PdfContentStream([]);
			internals._bdcCount = 0;
			// Act
			internals._processBeginMarkContent(
				layer,
				'BDC',
				['/OC', '/LayerB'],
				data
			);
			// Assert
			expect(internals._bdcCount).toBe(0);
			expect(data.getString()).toBe('/OC /LayerB BDC\r\n');
		});
		it('decrements BDC count for EMC without going below zero', (): void => {
			// Arrange
			const layer: PdfLayer = new PdfLayer();
			const data: _PdfContentStream = new _PdfContentStream([]);
			internals._bdcCount = 1;
			// Act
			internals._processBeginMarkContent(
				layer,
				'EMC',
				[],
				data
			);
			// Assert
			expect(internals._bdcCount).toBe(0);
			expect(data.getString()).toBe('');
		});
		it('does not decrement BDC count when EMC is received at zero', (): void => {
			// Arrange
			const layer: PdfLayer = new PdfLayer();
			const data: _PdfContentStream = new _PdfContentStream([]);
			internals._bdcCount = 0;
			// Act
			internals._processBeginMarkContent(
				layer,
				'EMC',
				[],
				data
			);
			// Assert
			expect(internals._bdcCount).toBe(0);
			expect(data.getString()).toBe('EMC\r\n');
		});
	});
	describe('_insertLayer', () => {
		it('moves the matching reference in both Order and OCGs', (): void => {
			// Arrange
			const first: _PdfReference = _PdfReference.get(200, 0);
			const second: _PdfReference = _PdfReference.get(201, 0);
			const target: _PdfReference = _PdfReference.get(202, 0);
			const order: Array<_PdfReference | _PdfReference[]> = [
				first,
				second,
				target
			];
			const ocGroups: _PdfReference[] = [
				first,
				second,
				target
			];
			const defaultView: _PdfDictionary = new _PdfDictionary();
			defaultView.update('Order', order);
			const ocProperties: _PdfDictionary = new _PdfDictionary();
			ocProperties.update('OCGs', ocGroups);
			ocProperties.update('D', defaultView);
			document._catalog._catalogDictionary.update(
				'OCProperties',
				ocProperties
			);
			const layer: PdfLayer = new PdfLayer();
			layer._referenceHolder = target;
			// Act
			internals._insertLayer(0, layer);
			// Assert
			expect(order.length).toBe(3);
			expect(order[0]).toBe(target);
			expect(order[1]).toBe(first);
			expect(order[2]).toBe(second);
			expect(ocGroups.length).toBe(3);
			expect(ocGroups[0]).toBe(target);
			expect(ocGroups[1]).toBe(first);
			expect(ocGroups[2]).toBe(second);
		});
		it('preserves arrays when the requested index equals the order length', (): void => {
			// Arrange
			const first: _PdfReference = _PdfReference.get(220, 0);
			const target: _PdfReference = _PdfReference.get(221, 0);
			const order: Array<_PdfReference | _PdfReference[]> = [
				first,
				target
			];
			const ocGroups: _PdfReference[] = [
				first,
				target
			];
			const defaultView: _PdfDictionary = new _PdfDictionary();
			defaultView.update('Order', order);
			const ocProperties: _PdfDictionary = new _PdfDictionary();
			ocProperties.update('OCGs', ocGroups);
			ocProperties.update('D', defaultView);
			document._catalog._catalogDictionary.update(
				'OCProperties',
				ocProperties
			);
			const layer: PdfLayer = new PdfLayer();
			layer._referenceHolder = target;
			// Act
			internals._insertLayer(order.length, layer);
			// Assert
			expect(order.length).toBe(2);
			expect(order[1]).toBe(target);
			expect(ocGroups[0]).toBe(first);
			expect(ocGroups[1]).toBe(target);
		});
	});
})
interface LayerCollectionInternals {
	_list: PdfLayer[];
	_document: PdfDocument;
	_crossReference: _PdfCrossReference;
	_layerDictionary: Map<_PdfReference, PdfLayer>;
	_bdcCount: number;
	_isLayerContainsResource: boolean;
	_parent: PdfLayer;
	_subLayer: boolean;
	_setPrintState(
		printOption: _PdfDictionary,
		layer: PdfLayer
	): void;
	_addLayer(
		layer: PdfLayer
	): number;
	_addNestedLayer(
		layer: PdfLayer
	): number;
	_createOptionalContentDictionary(
		layer: PdfLayer
	): Array<_PdfReference>;
	_createOptionalContentViews(): _PdfDictionary;
	_setPrintOption(
		layer: PdfLayer
	): _PdfReference;
	_createSublayer(
		ocProperties: _PdfDictionary,
		reference: _PdfReference,
		layer: PdfLayer
	): void;
	_checkLayerLock(
		ocProperties: _PdfDictionary
	): void;
	_checkLayerVisible(
		ocProperties: _PdfDictionary
	): void;
	_checkParentLayer(
		ocProperties: _PdfDictionary
	): void;
	_parsingLayerOrder(
		parent: PdfLayer,
		array: (_PdfReference | _PdfReference[])[],
		layerDictionary: Map<_PdfReference, PdfLayer>
	): void;
	_createLayerHierarchical(
		ocProperties: _PdfDictionary
	): void;
	_addChildLayer(
		layer: PdfLayer
	): void;
	_removeOCG(
		layer: PdfLayer,
		ocGroup: _PdfReference[]
	): void;
	_removeUsage(
		layer: PdfLayer,
		usage: _PdfReference[]
	): void;
	_removeOrder(
		layer: PdfLayer,
		order: (_PdfReference[] | _PdfReference)[],
		arrayList: (_PdfReference | _PdfReference[])[]
	): void;
	_removeVisible(
		layer: PdfLayer,
		on: _PdfReference[],
		off: _PdfReference[]
	): void;
	_removeLocked(
		layer: PdfLayer,
		locked: _PdfReference[]
	): void;
	_processBeginMarkContent(
		layer: PdfLayer,
		operator: string,
		operands: string[],
		data: _PdfContentStream,
		id?: string
	): void;
	_streamWrite(
		operands: string[],
		operator: string,
		skip: boolean,
		data: _PdfContentStream
	): void;
	_insertLayer(
		index: number,
		layer: PdfLayer
	): void;
}
function getInternals(collection: PdfLayerCollection): LayerCollectionInternals {
	return collection as unknown as LayerCollectionInternals;
}
function createDocumentWithLayers(): {
	document: PdfDocument;
	page: PdfPage;
	collection: PdfLayerCollection;
} {
	const document: PdfDocument = new PdfDocument();
	const page: PdfPage = document.addPage();
	const collection: PdfLayerCollection = document.layers;
	return { document, page, collection };
}
function getDefaultView(document: PdfDocument): _PdfDictionary {
	const catalog: _PdfDictionary = document._catalog._catalogDictionary;
	const optionalContent: _PdfDictionary = catalog.get('OCProperties') as _PdfDictionary;
	return optionalContent.get('D') as _PdfDictionary;
}
function createReference(document: PdfDocument): _PdfReference {
	return document._crossReference._getNextReference();
}
describe('PdfLayerCollection mutation coverage', () => {
	it('adds a layer with the exact name, visibility, identifier and index', () => {
		const harness = createDocumentWithLayers();
		const layer: PdfLayer = harness.collection.add('Visible layer', false);
		expect(harness.collection.count).toBe(1);
		expect(harness.collection.at(0)).toBe(layer);
		expect(layer.name).toBe('Visible layer');
		expect(layer.visible).toBeFalsy();
		expect(layer._layerId.indexOf('OCG_')).toBe(0);
		expect(layer._subLayerPosition).toBe(0);
		expect(layer._layer).toBe(layer);
		harness.document.destroy();
	});
	it('keeps the default visibility when the optional visibility argument is omitted', () => {
		const harness = createDocumentWithLayers();
		const layer: PdfLayer = harness.collection.add('Default visible layer');
		expect(layer.visible).toBeTruthy();
		expect(layer._dictionary.get('Visible')).toBeTruthy();
		harness.document.destroy();
	});
	it('returns exact contains and index results for layer and name inputs', () => {
		const harness = createDocumentWithLayers();
		const firstLayer: PdfLayer = harness.collection.add('First');
		const externalLayer: PdfLayer = new PdfLayer();
		const containsLayer: boolean = harness.collection.contains(firstLayer);
		const containsName: boolean = harness.collection.contains('First');
		const containsMissingName: boolean = harness.collection.contains('Missing');
		const containsExternalLayer: boolean = harness.collection.contains(externalLayer);
		expect(containsLayer).toBeTruthy();
		expect(containsName).toBeTruthy();
		expect(containsMissingName).toBeFalsy();
		expect(containsExternalLayer).toBeFalsy();
		expect(harness.collection.indexOf(firstLayer)).toBe(0);
		expect(harness.collection.indexOf(externalLayer)).toBe(-1);
		harness.document.destroy();
	});
	it('moves a layer and updates both collection and optional-content order', () => {
		const harness = createDocumentWithLayers();
		const firstLayer: PdfLayer = harness.collection.add('First');
		const secondLayer: PdfLayer = harness.collection.add('Second');
		const thirdLayer: PdfLayer = harness.collection.add('Third');
		harness.collection.move(0, thirdLayer);
		const defaultView: _PdfDictionary = getDefaultView(harness.document);
		const order: (_PdfReference | _PdfReference[])[] = defaultView.get('Order');
		expect(harness.collection.at(0)).toBe(thirdLayer);
		expect(harness.collection.at(1)).toBe(firstLayer);
		expect(harness.collection.at(2)).toBe(secondLayer);
		expect(order[0]).toBe(thirdLayer._referenceHolder);
		harness.document.destroy();
	});
	it('does not reorder when the requested position is already current', () => {
		const harness = createDocumentWithLayers();
		const firstLayer: PdfLayer = harness.collection.add('First');
		const secondLayer: PdfLayer = harness.collection.add('Second');
		harness.collection.move(1, secondLayer);
		expect(harness.collection.at(0)).toBe(firstLayer);
		expect(harness.collection.at(1)).toBe(secondLayer);
		harness.document.destroy();
	});
	it('removes a layer by instance and forwards the graphical-content value', () => {
		const harness = createDocumentWithLayers();
		const firstLayer: PdfLayer = harness.collection.add('First');
		const secondLayer: PdfLayer = harness.collection.add('Second');
		harness.collection.remove(firstLayer, false);
		expect(harness.collection.count).toBe(1);
		expect(harness.collection.at(0)).toBe(secondLayer);
		expect(harness.collection.contains(firstLayer)).toBeFalsy();
		harness.document.destroy();
	});
	it('removes every matching layer name without skipping adjacent entries', () => {
		const harness = createDocumentWithLayers();
		harness.collection.add('Repeated');
		harness.collection.add('Repeated');
		const remainingLayer: PdfLayer = harness.collection.add('Remaining');
		harness.collection.remove('Repeated', false);
		expect(harness.collection.count).toBe(1);
		expect(harness.collection.at(0)).toBe(remainingLayer);
		expect(harness.collection.contains('Repeated')).toBeFalsy();
		harness.document.destroy();
	});
	it('removeAt removes the parent from the top-level collection', () => {
		// Arrange
		const harness = createDocumentWithLayers();
		const parentLayer: PdfLayer =
			harness.collection.add('Parent');
		const childLayer: PdfLayer =
			parentLayer.layers.add('Child');
		// Act
		harness.collection.removeAt(0, false);
		// Assert
		expect(harness.collection.count).toBe(0);
		expect(
			harness.collection.contains(parentLayer)
		).toBeFalsy();
		expect(
			harness.collection.contains(childLayer)
		).toBeFalsy();
		expect(
			parentLayer.layers.contains(childLayer)
		).toBeTruthy();
		expect(parentLayer.layers.count).toBe(1);
		expect(parentLayer.layers.at(0)).toBe(childLayer);
		harness.document.destroy();
	});
	it('clear removes layers from the final index down to zero', () => {
		const harness = createDocumentWithLayers();
		harness.collection.add('First');
		harness.collection.add('Second');
		harness.collection.add('Third');
		harness.collection.clear();
		expect(harness.collection.count).toBe(0);
		expect(harness.collection.contains('First')).toBeFalsy();
		expect(harness.collection.contains('Second')).toBeFalsy();
		expect(harness.collection.contains('Third')).toBeFalsy();
		harness.document.destroy();
	});
	it('returns the exact index from the internal add and nested-add branches', () => {
		const harness = createDocumentWithLayers();
		const internals: LayerCollectionInternals = getInternals(harness.collection);
		const firstLayer: PdfLayer = new PdfLayer();
		firstLayer._document = harness.document;
		firstLayer._crossReference = harness.document._crossReference;
		firstLayer.name = 'Internal';
		firstLayer._layerId = 'OCG_Internal';
		const addedIndex: number = internals._addLayer(firstLayer);
		const nestedLayer: PdfLayer = new PdfLayer();
		const nestedIndex: number = internals._addNestedLayer(nestedLayer);
		expect(addedIndex).toBe(0);
		expect(nestedIndex).toBe(1);
		expect(internals._list[0]).toBe(firstLayer);
		expect(internals._list[1]).toBe(nestedLayer);
		expect(nestedLayer._layer).toBe(nestedLayer);
		harness.document.destroy();
	});
 	it('sets exact always-print and never-print values from print dictionaries', () => {
		// Arrange
		const harness = createDocumentWithLayers();
		const internals: LayerCollectionInternals =
			getInternals(harness.collection);
		const layer: PdfLayer = new PdfLayer();
		layer._printOption = new _PdfDictionary();
		const enabledPrint: _PdfDictionary =
			new _PdfDictionary();
		enabledPrint.update(
			'PrintState',
			new _PdfName('ON')
		);
		const disabledPrint: _PdfDictionary =
			new _PdfDictionary();
		disabledPrint.update(
			'PrintState',
			new _PdfName('OFF')
		);
		// Act
		internals._setPrintState(enabledPrint, layer);
		// Assert
		expect(layer.printState).toBe(
			PdfPrintState.alwaysPrint
		);
		expect(
			(
				layer._printOption.get(
					'PrintState'
				) as _PdfName
			).name
		).toBe('ON');
		// Act
		internals._setPrintState(disabledPrint, layer);
		// Assert
		expect(layer.printState).toBe(
			PdfPrintState.neverPrint
		);
		expect(
			(
				layer._printOption.get(
					'PrintState'
				) as _PdfName
			).name
		).toBe('OFF');
		harness.document.destroy();
	});
	it('creates exact optional-content dictionary values for a non-printing layer', () => {
		// Arrange
		const harness = createDocumentWithLayers();
		const internals: LayerCollectionInternals =
			getInternals(harness.collection);
		const layer: PdfLayer = new PdfLayer();
		layer._document = harness.document;
		layer._crossReference =
			harness.document._crossReference;
		layer._layer = layer;
		layer.name = 'Dictionary layer';
		layer._layerId = 'OCG_Dictionary';
		layer._visible = false;
		layer._dictionary.update('Visible', false);
		layer._printOption = new _PdfDictionary();
		layer.printState = PdfPrintState.neverPrint;
		// Act
		const references: _PdfReference[] =
			internals._createOptionalContentDictionary(
				layer
			);
		// Assert
		expect(
			references.indexOf(layer._referenceHolder)
		).not.toBe(-1);
		expect(
			layer._dictionary.get('Name')
		).toBe('Dictionary layer');
		expect(
			(
				layer._dictionary.get(
					'Type'
				) as _PdfName
			).name
		).toBe('OCG');
		expect(
			(
				layer._dictionary.get(
					'LayerID'
				) as _PdfName
			).name
		).toBe('OCG_Dictionary');
		expect(
			layer._dictionary.get('Visible')
		).toBeFalsy();
		expect(
			layer._dictionary.has('Usage')
		).toBeTruthy();
		expect(
			harness.document._off.indexOf(
				layer._referenceHolder
			)
		).not.toBe(-1);
		expect(
			harness.document._printLayer.indexOf(
				layer._referenceHolder
			)
		).not.toBe(-1);
		harness.document.destroy();
	});
	it('creates exact optional-content view arrays and print usage values', () => {
		const harness = createDocumentWithLayers();
		const internals: LayerCollectionInternals = getInternals(harness.collection);
		const views: _PdfDictionary = internals._createOptionalContentViews();
		const usageReferences: _PdfReference[] = views.get('AS');
		const usageDictionary: _PdfDictionary = harness.document._crossReference._fetch(usageReferences[0]) as _PdfDictionary;
		const category: _PdfName[] = usageDictionary.get('Category');
		expect(views.get('Name')).toBe('Layers');
		expect(views.get('Order')).toBe(harness.document._order);
		expect(views.get('ON')).toBe(harness.document._on);
		expect(views.get('OFF')).toBe(harness.document._off);
		expect(category.length).toBe(1);
		expect(category[0].name).toBe('Print');
		expect((usageDictionary.get('Event') as _PdfName).name).toBe('Print');
		expect(usageDictionary.get('OCGs')).toBe(harness.document._printLayer);
		harness.document.destroy();
	});
	it('creates exact print option states for always and never print', () => {
		// Arrange
		const harness = createDocumentWithLayers();
		const internals: LayerCollectionInternals =
			getInternals(harness.collection);
		const neverLayer: PdfLayer = new PdfLayer();
		neverLayer._printOption = new _PdfDictionary();
		neverLayer.printState =
			PdfPrintState.neverPrint;
		const alwaysLayer: PdfLayer = new PdfLayer();
		alwaysLayer._printOption = new _PdfDictionary();
		alwaysLayer.printState =
			PdfPrintState.alwaysPrint;
		// Act
		const neverReference: _PdfReference =
			internals._setPrintOption(neverLayer);
		const alwaysReference: _PdfReference =
			internals._setPrintOption(alwaysLayer);
		// Assert
		expect(neverReference).toBeDefined();
		expect(alwaysReference).toBeDefined();
		expect(
			(
				neverLayer._printOption.get(
					'PrintState'
				) as _PdfName
			).name
		).toBe('OFF');
		expect(
			(
				alwaysLayer._printOption.get(
					'PrintState'
				) as _PdfName
			).name
		).toBe('ON');
		expect(
			neverLayer._usage.getRaw('Print')
		).toBeDefined();
		expect(
			alwaysLayer._usage.getRaw('Print')
		).toBeDefined();
		harness.document.destroy();
	});
	it('creates top-level and child ordering with exact parent relationships', () => {
		const harness = createDocumentWithLayers();
		const parentLayer: PdfLayer = harness.collection.add('Parent');
		const childLayer: PdfLayer = parentLayer.layers.add('Child');
		expect(parentLayer._child.length).toBe(1);
		expect(parentLayer._child[0]).toBe(childLayer);
		expect(childLayer._parent).toBe(parentLayer);
		expect(childLayer._parentLayer.length).toBe(1);
		expect(childLayer._parentLayer[0]).toBe(parentLayer);
		expect(parentLayer.layers.count).toBe(1);
		expect(parentLayer.layers.at(0)).toBe(childLayer);
		expect(parentLayer._subLayer.indexOf(childLayer._referenceHolder)).not.toBe(-1);
		harness.document.destroy();
	});
	it('does not duplicate the child collection when the sublayer is registered again', () => {
		// Arrange
		const harness = createDocumentWithLayers();
		const parentLayer: PdfLayer =
			harness.collection.add('Parent');
		const childLayer: PdfLayer =
			parentLayer.layers.add('Child');
		const childInternals: LayerCollectionInternals =
			getInternals(parentLayer.layers);
		const optionalContent: _PdfDictionary =
			harness.document._catalog
				._catalogDictionary.get(
					'OCProperties'
				) as _PdfDictionary;
		// Act
		childInternals._createSublayer(
			optionalContent,
			childLayer._referenceHolder,
			childLayer
		);
		// Assert
		expect(parentLayer._child.length).toBe(1);
		expect(parentLayer._child[0]).toBe(childLayer);
		expect(parentLayer.layers.count).toBe(1);
		expect(
			parentLayer.layers.at(0)
		).toBe(childLayer);
		/*
		 * The current source prevents duplicate child entries,
		 * but the first parentLayer branch appends the parent
		 * again to childLayer._parentLayer.
		 */
		expect(childLayer._parentLayer.length).toBe(2);
		expect(
			childLayer._parentLayer[0]
		).toBe(parentLayer);
		expect(
			childLayer._parentLayer[1]
		).toBe(parentLayer);
		harness.document.destroy();
	});
	it('applies locked references only to the matching layer', () => {
		// Arrange
		const harness = createDocumentWithLayers();
		const firstLayer: PdfLayer =
			harness.collection.add('First');
		const secondLayer: PdfLayer =
			harness.collection.add('Second');
		const internals: LayerCollectionInternals =
			getInternals(harness.collection);
		internals._layerDictionary.set(
			firstLayer._referenceHolder,
			firstLayer
		);
		internals._layerDictionary.set(
			secondLayer._referenceHolder,
			secondLayer
		);
		const defaultView: _PdfDictionary =
			getDefaultView(harness.document);
		defaultView.update(
			'Locked',
			[secondLayer._referenceHolder]
		);
		const optionalContent: _PdfDictionary =
			harness.document._catalog
				._catalogDictionary.get(
					'OCProperties'
				) as _PdfDictionary;
		// Act
		internals._checkLayerLock(optionalContent);
		// Assert
		const locked: _PdfReference[] =
			defaultView.get(
				'Locked'
			) as _PdfReference[];
		expect(firstLayer.locked).toBeFalsy();
		expect(secondLayer.locked).toBeTruthy();
		expect(locked.length).toBe(1);
		expect(locked[0]).toBe(
			secondLayer._referenceHolder
		);
		harness.document.destroy();
	});
	it('applies OFF visibility to layer state and dictionary state', () => {
		// Arrange
		const harness = createDocumentWithLayers();
		const firstLayer: PdfLayer =
			harness.collection.add('First', true);
		const internals: LayerCollectionInternals =
			getInternals(harness.collection);
		internals._layerDictionary.set(
			firstLayer._referenceHolder,
			firstLayer
		);
		firstLayer._visible = true;
		firstLayer._dictionary.set(
			'Visible',
			true
		);
		const defaultView: _PdfDictionary =
			getDefaultView(harness.document);
		defaultView.update(
			'OFF',
			[firstLayer._referenceHolder]
		);
		const optionalContent: _PdfDictionary =
			harness.document._catalog
				._catalogDictionary.get(
					'OCProperties'
				) as _PdfDictionary;
		// Act
		internals._checkLayerVisible(optionalContent);
		// Assert
		expect(firstLayer._visible).toBeFalsy();
		expect(
			firstLayer._dictionary.get('Visible')
		).toBeFalsy();
		expect(firstLayer.visible).toBeFalsy();
		harness.document.destroy();
	});
	it('parses a nested order into exact child and parent collections', () => {
		const harness = createDocumentWithLayers();
		const parentLayer: PdfLayer = harness.collection.add('Parent');
		const childLayer: PdfLayer = harness.collection.add('Child');
		parentLayer._child.length = 0;
		childLayer._parentLayer.length = 0;
		childLayer._parent = undefined;
		const internals: LayerCollectionInternals = getInternals(harness.collection);
		const dictionary: Map<_PdfReference, PdfLayer> = new Map<_PdfReference, PdfLayer>();
		dictionary.set(parentLayer._referenceHolder, parentLayer);
		dictionary.set(childLayer._referenceHolder, childLayer);
		const order: (_PdfReference | _PdfReference[])[] = [
			parentLayer._referenceHolder,
			[childLayer._referenceHolder]
		];
		internals._parsingLayerOrder(null, order, dictionary);
		expect(parentLayer._child.length).toBe(1);
		expect(parentLayer._child[0]).toBe(childLayer);
		expect(childLayer._parent).toBe(parentLayer);
		expect(childLayer._parentLayer.indexOf(parentLayer)).not.toBe(-1);
		expect(parentLayer._subLayer.length).toBe(1);
		harness.document.destroy();
	});
	it('rebuilds hierarchical top-level and nested collections', () => {
		// Arrange
		const harness = createDocumentWithLayers();
		const parentLayer: PdfLayer =
			harness.collection.add('Parent');
		const childLayer: PdfLayer =
			harness.collection.add('Child');
		const internals: LayerCollectionInternals =
			getInternals(harness.collection);
		childLayer._parent = parentLayer;
		parentLayer._child.push(childLayer);
		internals._layerDictionary.set(
			parentLayer._referenceHolder,
			parentLayer
		);
		internals._layerDictionary.set(
			childLayer._referenceHolder,
			childLayer
		);
		const optionalContent: _PdfDictionary =
			harness.document._catalog
				._catalogDictionary.get(
					'OCProperties'
				) as _PdfDictionary;
		const defaultView: _PdfDictionary =
			optionalContent.get(
				'D'
			) as _PdfDictionary;
		defaultView.update(
			'Order',
			[
				parentLayer._referenceHolder,
				[childLayer._referenceHolder]
			]
		);
		// Act
		internals._createLayerHierarchical(
			optionalContent
		);
		// Assert
		expect(harness.collection.count).toBe(1);
		expect(harness.collection.at(0)).toBe(
			parentLayer
		);
		expect(
			harness.collection.contains(parentLayer)
		).toBeTruthy();
		expect(
			harness.collection.contains(childLayer)
		).toBeFalsy();
		expect(
			parentLayer.layers.contains(childLayer)
		).toBeTruthy();
		expect(parentLayer.layers.count).toBe(1);
		expect(
			parentLayer.layers.at(0)
		).toBe(childLayer);
		harness.document.destroy();
	});
	it('removes an exact OCG, lock, ON and OFF reference', () => {
		// Arrange
		const harness = createDocumentWithLayers();
		const layer: PdfLayer =
			harness.collection.add('Target');
		const internals: LayerCollectionInternals =
			getInternals(harness.collection);
		const otherReference: _PdfReference =
			createReference(harness.document);
		const ocGroups: _PdfReference[] = [
			otherReference,
			layer._referenceHolder
		];
		const locked: _PdfReference[] = [
			layer._referenceHolder,
			otherReference
		];
		const on: _PdfReference[] = [
			layer._referenceHolder,
			otherReference
		];
		const off: _PdfReference[] = [
			layer._referenceHolder,
			otherReference
		];
		// Act
		internals._removeOCG(layer, ocGroups);
		internals._removeLocked(layer, locked);
		layer._visible = true;
		layer._dictionary.set(
			'Visible',
			true
		);
		internals._removeVisible(
			layer,
			on,
			off
		);
		layer._visible = false;
		layer._dictionary.set(
			'Visible',
			false
		);
		internals._removeVisible(
			layer,
			on,
			off
		);
		// Assert
		expect(ocGroups.length).toBe(1);
		expect(ocGroups[0]).toBe(otherReference);
		expect(locked.length).toBe(1);
		expect(locked[0]).toBe(otherReference);
		expect(on.length).toBe(1);
		expect(on[0]).toBe(otherReference);
		expect(off.length).toBe(1);
		expect(off[0]).toBe(otherReference);
		harness.document.destroy();
	});
	it('removes the target from direct order and removes its following child array', () => {
		const harness = createDocumentWithLayers();
		const layer: PdfLayer = harness.collection.add('Target');
		const internals: LayerCollectionInternals = getInternals(harness.collection);
		const otherReference: _PdfReference = createReference(harness.document);
		const childReference: _PdfReference = createReference(harness.document);
		const order: (_PdfReference | _PdfReference[])[] = [
			otherReference,
			layer._referenceHolder,
			[childReference]
		];
		const nestedEntries: (_PdfReference | _PdfReference[])[] = [];
		internals._removeOrder(layer, order, nestedEntries);
		expect(order.length).toBe(1);
		expect(order[0]).toBe(otherReference);
		expect(nestedEntries.length).toBe(0);
		harness.document.destroy();
	});
	it('removes the target from a recursively nested order', () => {
		const harness = createDocumentWithLayers();
		const layer: PdfLayer = harness.collection.add('Target');
		const internals: LayerCollectionInternals = getInternals(harness.collection);
		const otherReference: _PdfReference = createReference(harness.document);
		const nestedOrder: _PdfReference[] = [otherReference, layer._referenceHolder];
		const order: (_PdfReference | _PdfReference[])[] = [nestedOrder];
		const nestedEntries: (_PdfReference | _PdfReference[])[] = [];
		internals._removeOrder(layer, order, nestedEntries);
		expect(nestedOrder.length).toBe(1);
		expect(nestedOrder[0]).toBe(otherReference);
		expect(order.length).toBe(1);
		harness.document.destroy();
	});
	it('removes a layer from the first matching usage dictionary and stops', () => {
		const harness = createDocumentWithLayers();
		const layer: PdfLayer = harness.collection.add('Target');
		const internals: LayerCollectionInternals = getInternals(harness.collection);
		const otherReference: _PdfReference = createReference(harness.document);
		const firstUsage: _PdfDictionary = new _PdfDictionary();
		firstUsage.update('OCGs', [layer._referenceHolder, otherReference]);
		const secondUsage: _PdfDictionary = new _PdfDictionary();
		secondUsage.update('OCGs', [layer._referenceHolder]);
		const firstUsageReference: _PdfReference = createReference(harness.document);
		const secondUsageReference: _PdfReference = createReference(harness.document);
		harness.document._crossReference._cacheMap.set(firstUsageReference, firstUsage);
		harness.document._crossReference._cacheMap.set(secondUsageReference, secondUsage);
		internals._removeUsage(layer, [firstUsageReference, secondUsageReference]);
		const firstGroups: _PdfReference[] = firstUsage.get('OCGs');
		const secondGroups: _PdfReference[] = secondUsage.get('OCGs');
		expect(firstGroups).toEqual([otherReference]);
		expect(secondGroups).toEqual([layer._referenceHolder]);
		harness.document.destroy();
	});
	it('writes operands and operator with exact spacing and line ending', () => {
		const harness = createDocumentWithLayers();
		const internals: LayerCollectionInternals = getInternals(harness.collection);
		const data: _PdfContentStream = new _PdfContentStream([]);
		internals._streamWrite(['10', '20'], 'm', false, data);
		expect(data.getString()).toBe('10 20 m\r\n');
		harness.document.destroy();
	});
	it('skips writing only while a marked-content layer is active', () => {
		const harness = createDocumentWithLayers();
		const internals: LayerCollectionInternals = getInternals(harness.collection);
		const data: _PdfContentStream = new _PdfContentStream([]);
		internals._bdcCount = 1;
		internals._streamWrite(['10'], 'm', true, data);
		expect(data.length).toBe(0);
		internals._streamWrite(['20'], 'l', false, data);
		expect(data.getString()).toBe('20 l\r\n');
		harness.document.destroy();
	});
	it('increments and decrements the exact marked-content nesting count', () => {
		const harness = createDocumentWithLayers();
		const internals: LayerCollectionInternals = getInternals(harness.collection);
		const layer: PdfLayer = harness.collection.add('Target');
		const page: PdfPage = harness.page;
		layer._pages.push(page);
		const data: _PdfContentStream = new _PdfContentStream([]);
		internals._processBeginMarkContent(layer, 'BDC', ['/OC', `/${layer._layerId}`], data);
		expect(internals._bdcCount).toBe(1);
		expect(data.length).toBe(0);
		internals._processBeginMarkContent(layer, 'BDC', ['/OC', '/Nested'], data);
		expect(internals._bdcCount).toBe(2);
		internals._processBeginMarkContent(layer, 'EMC', [], data);
		expect(internals._bdcCount).toBe(1);
		internals._processBeginMarkContent(layer, 'EMC', [], data);
		expect(internals._bdcCount).toBe(0);
		harness.document.destroy();
	});
	it('writes nonmatching BDC content without changing the skip state', () => {
		const harness = createDocumentWithLayers();
		const internals: LayerCollectionInternals = getInternals(harness.collection);
		const layer: PdfLayer = harness.collection.add('Target');
		const data: _PdfContentStream = new _PdfContentStream([]);
		internals._processBeginMarkContent(layer, 'BDC', ['/OC', '/Different'], data);
		expect(internals._bdcCount).toBe(0);
		expect(data.getString()).toBe(`/OC /Different BDC\r\n`);
		harness.document.destroy();
	});
	it('inserts the selected layer reference at the exact requested position', () => {
		const harness = createDocumentWithLayers();
		const firstLayer: PdfLayer = harness.collection.add('First');
		const secondLayer: PdfLayer = harness.collection.add('Second');
		const thirdLayer: PdfLayer = harness.collection.add('Third');
		const internals: LayerCollectionInternals = getInternals(harness.collection);
		const optionalContent: _PdfDictionary = harness.document._catalog._catalogDictionary.get('OCProperties') as _PdfDictionary;
		const defaultView: _PdfDictionary = optionalContent.get('D') as _PdfDictionary;
		const order: (_PdfReference | _PdfReference[])[] = [
			firstLayer._referenceHolder,
			secondLayer._referenceHolder,
			thirdLayer._referenceHolder
		];
		const ocGroups: _PdfReference[] = [
			firstLayer._referenceHolder,
			secondLayer._referenceHolder,
			thirdLayer._referenceHolder
		];
		defaultView.update('Order', order);
		optionalContent.update('OCGs', ocGroups);
		internals._insertLayer(0, thirdLayer);
		expect(order[0]).toBe(thirdLayer._referenceHolder);
		expect(order[1]).toBe(firstLayer._referenceHolder);
		expect(order[2]).toBe(secondLayer._referenceHolder);
		expect(ocGroups[0]).toBe(thirdLayer._referenceHolder);
		expect(ocGroups[1]).toBe(firstLayer._referenceHolder);
		expect(ocGroups[2]).toBe(secondLayer._referenceHolder);
		harness.document.destroy();
	});
});

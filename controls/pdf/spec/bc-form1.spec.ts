import { PdfForm } from '../src/pdf/core/form/form';
import { PdfButtonField, PdfCheckBoxField, PdfField, PdfRadioButtonListField } from '../src/pdf/core/form/field';
import { PdfAnnotationCollection } from '../src/pdf/core/annotations/annotation-collection';
import { PdfStateItem, PdfWidgetAnnotation } from '../src/pdf/core/annotations/annotation';
import { PdfFormFieldsTabOrder, PdfRotationAngle } from '../src/pdf/core/enumerator';
import { PdfPage } from '../src/pdf/core/pdf-page';
import { _PdfDictionary, _PdfName, _PdfReference } from '../src/pdf/core/pdf-primitives';
import * as utils from '../src/pdf/core/utils';
describe('PdfForm additional coverage - highlighted branches', (): void => {

    interface TestDocument {
        pageCount: number;
        getPage(index: number): PdfPage;
    }

    interface TestCrossReference {
        _document: TestDocument | null;
        _cacheMap: Map<_PdfReference, _PdfDictionary>;
        _allowCatalog: boolean;
        _fetch: jasmine.Spy;
    }

    interface TestPageShape {
        _pageIndex: number;
        _isNew: boolean;
        tabOrder: PdfFormFieldsTabOrder;
        _pageDictionary?: _PdfDictionary;
        _annotations?: PdfAnnotationCollection;
        annotations?: PdfAnnotationCollection;
    }

    interface TestFieldShape {
        _ref: _PdfReference;
        _name: string;
        _dictionary: _PdfDictionary;
        _parsedItems: Map<number, unknown>;
        _isLoaded: boolean;
        _kidsCount: number;
        _annotationIndex: number;
        _tabIndex?: number;
        flatten: boolean;
        _page?: PdfPage;
        _isImport?: boolean;
        itemAt(index: number): PdfWidgetAnnotation;
        _doPostProcess: jasmine.Spy;
    }

    interface TestFormShape {
        _dictionary: _PdfDictionary;
        _fields: _PdfReference[];
        _parsedFields: Map<number, PdfField>;
        _fieldCollection: PdfField[];
        _formNames: string[];
        _widgetReferences?: _PdfReference[];
        _tabCollection: Map<number, PdfFormFieldsTabOrder>;
        _hasKids: boolean;
        _isNeedAppearances: boolean;
        _requiresPostProcessing: boolean;
        _tabOrder?: PdfFormFieldsTabOrder;
        _crossReference: TestCrossReference;
    }

    function createReference(id: number): _PdfReference {
        const ref: _PdfReference = Object.create(_PdfReference.prototype) as _PdfReference;
        Object.defineProperty(ref, 'objectNumber', {
            value: id,
            writable: true,
            configurable: true
        });
        Object.defineProperty(ref, 'generationNumber', {
            value: 0,
            writable: true,
            configurable: true
        });
        return ref;
    }

    function createName(name: string): _PdfName {
        const pdfName: _PdfName = Object.create(_PdfName.prototype) as _PdfName;
        Object.defineProperty(pdfName, 'name', {
            value: name,
            writable: true,
            configurable: true
        });
        return pdfName;
    }

    function createDictionary(map: Record<string, unknown> = {}): _PdfDictionary {
        const dict: _PdfDictionary = Object.create(_PdfDictionary.prototype) as _PdfDictionary;
        Object.defineProperty(dict, '_map', {
            value: { ...map },
            writable: true,
            configurable: true
        });
        Object.defineProperty(dict, '_updated', {
            value: false,
            writable: true,
            configurable: true
        });

        dict.has = function (key: string): boolean {
            const store: Record<string, unknown> = (this as unknown as { _map: Record<string, unknown> })._map;
            return Object.prototype.hasOwnProperty.call(store, key);
        };

        dict.get = function (key: string): unknown {
            const store: Record<string, unknown> = (this as unknown as { _map: Record<string, unknown> })._map;
            return store[key];
        };

        dict.getRaw = function (key: string): unknown {
            const store: Record<string, unknown> = (this as unknown as { _map: Record<string, unknown> })._map;
            return store[key];
        };

        dict.getArray = function (key: string): unknown[] {
            const store: Record<string, unknown> = (this as unknown as { _map: Record<string, unknown> })._map;
            return (store[key] as unknown[]) || [];
        };

        dict.set = function (key: string, value: unknown): void {
            const self = this as unknown as { _map: Record<string, unknown> };
            self._map[key] = value;
        };

        dict.update = function (key: string, value: unknown): void {
            const self = this as unknown as { _map: Record<string, unknown>; _updated: boolean };
            self._map[key] = value;
            self._updated = true;
        };

        return dict;
    }

    function createPage(
        index: number,
        tabOrder: PdfFormFieldsTabOrder,
        annots: _PdfReference[] = [],
        hasDictionary: boolean = true
    ): PdfPage {
        const page: PdfPage & TestPageShape = {} as PdfPage & TestPageShape;
        page._pageIndex = index;
        page._isNew = false;
        page.tabOrder = tabOrder;

        if (hasDictionary) {
            page._pageDictionary = createDictionary({
                Annots: annots
            });
        }

        Object.defineProperty(page, 'annotations', {
            configurable: true,
            get: function (): PdfAnnotationCollection | undefined {
                return page._annotations;
            }
        });

        return page;
    }

    function createWidgetItem(ref: _PdfReference, rect: number[]): PdfWidgetAnnotation {
        const item: PdfWidgetAnnotation = Object.create(PdfWidgetAnnotation.prototype) as PdfWidgetAnnotation;

        Object.defineProperty(item, '_ref', {
            value: ref,
            writable: true,
            configurable: true
        });

        Object.defineProperty(item, '_dictionary', {
            value: createDictionary({ Rect: rect }),
            writable: true,
            configurable: true
        });

        return item;
    }

    function createField(
        name: string,
        ref: _PdfReference,
        page: PdfPage,
        rect: number[] = [0, 0, 10, 10],
        tabIndex: number = 0,
        isLoaded: boolean = true
    ): PdfField {
        const field: PdfField & TestFieldShape = {} as PdfField & TestFieldShape;

        field._ref = ref;
        field._name = name;
        field._dictionary = createDictionary({
            Rect: rect
        });
        (field as any)._parsedItems = new Map<number, unknown>();
        field._isLoaded = isLoaded;
        // field._kidsCount = 0;
        field._annotationIndex = 0;
        field._tabIndex = tabIndex;
        field.flatten = false;
        field._page = page;
        field._isImport = false;

        Object.defineProperty(field, 'name', {
            configurable: true,
            get: function (): string {
                return field._name;
            }
        });

        Object.defineProperty(field, 'page', {
            configurable: true,
            get: function (): PdfPage {
                return page;
            }
        });

        Object.defineProperty(field, 'itemsCount', {
            configurable: true,
            get: function (): number {
                return 1;
            }
        });

        field.itemAt = function (_index: number): PdfWidgetAnnotation {
            return createWidgetItem(createReference(9000), rect);
        };

        field._doPostProcess = jasmine.createSpy('_doPostProcess');

        return field;
    }

    function createFormShell(): PdfForm {
        const form: PdfForm & TestFormShape = Object.create(PdfForm.prototype) as PdfForm & TestFormShape;

        form._dictionary = createDictionary({ Fields: [] });
        form._fields = [];
        form._parsedFields = new Map<number, PdfField>();
        form._fieldCollection = [];
        form._formNames = [];
        form._widgetReferences = undefined;
        form._tabCollection = new Map<number, PdfFormFieldsTabOrder>();
        form._hasKids = false;
        form._isNeedAppearances = false;
        form._requiresPostProcessing = false;
        (form as any)._crossReference = {
            _document: null,
            _cacheMap: new Map<_PdfReference, _PdfDictionary>(),
            _allowCatalog: false,
            _fetch: jasmine.createSpy('_fetch')
        };

        return form;
    }

    it('should cover orderFormFields(Map) reorder branch including splice path', (): void => {
        const form: PdfForm & TestFormShape = createFormShell() as PdfForm & TestFormShape;

        const page0: PdfPage = createPage(0, PdfFormFieldsTabOrder.row, []);
        const page1: PdfPage = createPage(1, PdfFormFieldsTabOrder.row, []);

        const document: TestDocument = {
            pageCount: 2,
            getPage(index: number): PdfPage {
                return index === 0 ? page0 : page1;
            }
        };
        (form as any)._crossReference._document = document;

        const ref1: _PdfReference = createReference(1);
        const ref2: _PdfReference = createReference(2);
        const ref3: _PdfReference = createReference(3);

        const fieldB: PdfField = createField('B', ref2, page0, [50, 10, 60, 20], 1);
        const fieldA: PdfField = createField('A', ref1, page0, [10, 10, 20, 20], 0);
        const fieldC: PdfField = createField('C', ref3, page1, [10, 10, 20, 20], 0);

        const initialFields: PdfField[] = [fieldB, fieldA, fieldC];
        form._fields = [ref2, ref1, ref3];

        spyOn(form, '_getFields').and.returnValue(initialFields);

        spyOn(form, '_sortItemByPageIndex').and.callFake((field: PdfField): PdfPage => {
            return field.page;
        });

        spyOn(form, '_compareFields').and.callFake((left: PdfField, right: PdfField): number => {
            return left.name.localeCompare(right.name);
        });

        const tabMap: Map<number, PdfFormFieldsTabOrder> = new Map<number, PdfFormFieldsTabOrder>();
        tabMap.set(0, PdfFormFieldsTabOrder.row);

        expect((): void => {
            form.orderFormFields(tabMap);
        }).not.toThrow();

        expect(form._fieldCollection.length).toBe(3);
        expect(form._fieldCollection[0].name).toBe('A');
        expect(form._fieldCollection[1].name).toBe('B');
        expect(form._fieldCollection[2].name).toBe('C');
        expect(form._fields[0]).toBe(ref1);
        expect(form._fields[1]).toBe(ref2);
        expect(form._fields[2]).toBe(ref3);
        expect((page0 as PdfPage & TestPageShape).tabOrder).toBe(PdfFormFieldsTabOrder.row);
    });

    it('should cover _createFields node traversal and nodes.pop path', (): void => {
        const form: PdfForm & TestFormShape = createFormShell() as PdfForm & TestFormShape;

        const rootRef: _PdfReference = createReference(10);
        const childNodeRef: _PdfReference = createReference(11);
        const terminalRef: _PdfReference = createReference(12);

        const terminalDict: _PdfDictionary = createDictionary({
            T: 'TerminalField',
            FT: createName('Tx'),
            P: createReference(100),
            Rect: [0, 0, 40, 20]
        });

        const childNodeDict: _PdfDictionary = createDictionary({
            Kids: [terminalRef]
        });

        const rootDict: _PdfDictionary = createDictionary({
            Fields: [rootRef]
        });

        const topFieldDict: _PdfDictionary = createDictionary({
            Kids: [childNodeRef]
        });

        form._dictionary = rootDict;

        form._crossReference._fetch.and.callFake((ref: _PdfReference): _PdfDictionary | undefined => {
            if (ref === rootRef) {
                return topFieldDict;
            }
            if (ref === childNodeRef) {
                return childNodeDict;
            }
            if (ref === terminalRef) {
                return terminalDict;
            }
            return undefined;
        });

        spyOn(form as any, '_createFieldCollection').and.callFake((
            terminalFields: _PdfDictionary[],
            fieldsMap: Map<_PdfDictionary, _PdfReference>
        ): void => {
            expect(Array.isArray(terminalFields)).toBe(true);
            expect(terminalFields.length).toBe(1);
            expect(terminalFields[0]).toBe(terminalDict);
            expect(fieldsMap.get(topFieldDict)).toBe(rootRef);
            expect(fieldsMap.get(childNodeDict)).toBe(childNodeRef);
            expect(fieldsMap.get(terminalDict)).toBe(terminalRef);
        });

        expect((): void => {
            form._createFields();
        }).not.toThrow();

        expect(form._hasKids).toBe(true);
        expect(form._formNames.indexOf('TerminalField')).toBeGreaterThan(-1);
    });
    it('should cover _createFieldCollection continue branch for missing page dictionary', (): void => {
        const form: PdfForm & TestFormShape =
            createFormShell() as PdfForm & TestFormShape;
        spyOn<any>(form, '_createFormFieldsFromWidgets').and.stub();
        const validPage: PdfPage = createPage(
            1,
            PdfFormFieldsTabOrder.none,
            []
        );
        const document: TestDocument = {
            pageCount: 2,
            getPage(index: number): PdfPage {
                if (index === 0) {
                    return {} as PdfPage;
                }
                return validPage;
            }
        };
        (form as any)._crossReference._document = document;
        expect((): void => {
            (form as any)._createFieldCollection(
                [],
                new Map<_PdfDictionary, _PdfReference>()
            );
        }).not.toThrow();

        expect(form._fields.length).toBe(0);
        expect(
            (form as any)._createFormFieldsFromWidgets
        ).toHaveBeenCalledWith(0);
    });
    it('should cover _doPostProcess manual annotation rearrange and import removal path', (): void => {
        const form: PdfForm & TestFormShape = createFormShell() as PdfForm & TestFormShape;

        const fieldRef: _PdfReference = createReference(20);
        const itemRef: _PdfReference = createReference(21);
        const fallbackAnnotRef: _PdfReference = createReference(22);

        const annots: _PdfReference[] = [fallbackAnnotRef];
        const page: PdfPage = createPage(0, PdfFormFieldsTabOrder.manual, annots, true);

        const document: TestDocument = {
            pageCount: 1,
            getPage(_index: number): PdfPage {
                return page;
            }
        };

        (form as any)._crossReference._document = document;
        form._crossReference._fetch.and.callFake((_ref: _PdfReference): _PdfDictionary => {
            return createDictionary({
                Subtype: createName('Widget'),
                Rect: [0, 0, 20, 20]
            });
        });

        const rearrangedAnnots: _PdfReference[] = [itemRef, fallbackAnnotRef];
        spyOn(PdfAnnotationCollection.prototype, '_reArrange').and.returnValue(rearrangedAnnots);

        const item: PdfWidgetAnnotation = createWidgetItem(itemRef, [0, 0, 20, 20]);

        const field: PdfField & TestFieldShape = {} as PdfField & TestFieldShape;
        field._ref = fieldRef;
        field._dictionary = createDictionary({});
        field._page = page;
        field._isLoaded = false;
        field._tabIndex = 1;
        field._annotationIndex = 0;
        field.flatten = false;
        field._isImport = false;

        Object.defineProperty(field, 'page', {
            configurable: true,
            get: function (): PdfPage {
                return page;
            }
        });

        Object.defineProperty(field, 'itemsCount', {
            configurable: true,
            get: function (): number {
                return 1;
            }
        });

        field.itemAt = jasmine.createSpy('itemAt').and.callFake((_index: number): PdfWidgetAnnotation => {
            return item;
        });

        field._doPostProcess = jasmine.createSpy('_doPostProcess');

        form._fields = [fieldRef];
        form._tabOrder = PdfFormFieldsTabOrder.manual;

        spyOn(form, 'fieldAt').and.returnValue(field as PdfField);
        spyOn(form, 'removeFieldAt').and.stub();

        expect((): void => {
            form._doPostProcess(true, page);
        }).not.toThrow();

        expect(field._isImport).toBe(true);
        expect(field._doPostProcess).toHaveBeenCalledWith(true);
        expect(PdfAnnotationCollection.prototype._reArrange).toHaveBeenCalledWith(fieldRef, 1, 0);
        expect(((page as PdfPage & TestPageShape)._pageDictionary as _PdfDictionary).get('Annots')).toEqual(rearrangedAnnots);
        expect((((page as PdfPage & TestPageShape)._pageDictionary as _PdfDictionary) as unknown as { _updated: boolean })._updated).toBe(true);
        expect(form.removeFieldAt).toHaveBeenCalledWith(0);
    });

    it('should cover _doPostProcess path when field matches pageToImport without removal', (): void => {
        const form: PdfForm & TestFormShape = createFormShell() as PdfForm & TestFormShape;

        const fieldRef: _PdfReference = createReference(30);
        const page: PdfPage = createPage(0, PdfFormFieldsTabOrder.none, []);

        const field: PdfField & TestFieldShape = {} as PdfField & TestFieldShape;
        field._ref = fieldRef;
        field._dictionary = createDictionary({});
        field._page = page;
        field._isLoaded = true;
        field._tabIndex = undefined;
        field.flatten = false;
        field._isImport = false;

        Object.defineProperty(field, 'page', {
            configurable: true,
            get: function (): PdfPage {
                return page;
            }
        });

        field.itemAt = jasmine.createSpy('itemAt').and.callFake((_index: number): PdfWidgetAnnotation => {
            return createWidgetItem(createReference(31), [0, 0, 10, 10]);
        });

        field._doPostProcess = jasmine.createSpy('_doPostProcess');

        form._fields = [fieldRef];

        spyOn(form, 'fieldAt').and.returnValue(field as PdfField);
        spyOn(form, 'removeFieldAt').and.stub();

        expect((): void => {
            form._doPostProcess(false, page);
        }).not.toThrow();

        expect(field._isImport).toBe(true);
        expect(field._doPostProcess).toHaveBeenCalledWith(false);
        expect(form.removeFieldAt).not.toHaveBeenCalled();
    });
});

describe('PdfForm highlighted branch coverage', (): void => {

    interface TestDocument {
        pageCount: number;
        getPage(index: number): PdfPage;
    }

    interface TestCrossReference {
        _document: TestDocument | null;
        _fetch: jasmine.Spy;
        _cacheMap: Map<_PdfReference, _PdfDictionary>;
        _allowCatalog: boolean;
    }

    function createReference(id: number): _PdfReference {
        const ref: _PdfReference = Object.create(_PdfReference.prototype) as _PdfReference;
        Object.defineProperty(ref, 'objectNumber', {
            value: id,
            writable: true,
            configurable: true
        });
        Object.defineProperty(ref, 'generationNumber', {
            value: 0,
            writable: true,
            configurable: true
        });
        return ref;
    }

    function createName(name: string): _PdfName {
        const value: _PdfName = Object.create(_PdfName.prototype) as _PdfName;
        Object.defineProperty(value, 'name', {
            value: name,
            writable: true,
            configurable: true
        });
        return value;
    }

    function createDictionary(map: Record<string, unknown> = {}): _PdfDictionary {
        const dict: _PdfDictionary = Object.create(_PdfDictionary.prototype) as _PdfDictionary;

        Object.defineProperty(dict, '_map', {
            value: { ...map },
            writable: true,
            configurable: true
        });

        Object.defineProperty(dict, '_updated', {
            value: false,
            writable: true,
            configurable: true
        });

        dict.has = function (key: string): boolean {
            const store: Record<string, unknown> = (this as unknown as { _map: Record<string, unknown> })._map;
            return Object.prototype.hasOwnProperty.call(store, key);
        };

        dict.get = function (key: string): unknown {
            const store: Record<string, unknown> = (this as unknown as { _map: Record<string, unknown> })._map;
            return store[key];
        };

        dict.getRaw = function (key: string): unknown {
            const store: Record<string, unknown> = (this as unknown as { _map: Record<string, unknown> })._map;
            return store[key];
        };

        dict.getArray = function (key: string): unknown[] {
            const store: Record<string, unknown> = (this as unknown as { _map: Record<string, unknown> })._map;
            return (store[key] as unknown[]) || [];
        };

        dict.set = function (key: string, value: unknown): void {
            const self = this as unknown as { _map: Record<string, unknown> };
            self._map[key] = value;
        };

        dict.update = function (key: string, value: unknown): void {
            const self = this as unknown as { _map: Record<string, unknown>; _updated: boolean };
            self._map[key] = value;
            self._updated = true;
        };

        return dict;
    }

    function createPage(
        index: number,
        tabOrder: PdfFormFieldsTabOrder = PdfFormFieldsTabOrder.none,
        annots: _PdfReference[] = [],
        hasDictionary: boolean = true
    ): PdfPage {
        const page: PdfPage = {} as PdfPage;

        Object.defineProperty(page, '_pageIndex', {
            value: index,
            writable: true,
            configurable: true
        });

        Object.defineProperty(page, '_isNew', {
            value: false,
            writable: true,
            configurable: true
        });

        Object.defineProperty(page, 'tabOrder', {
            value: tabOrder,
            writable: true,
            configurable: true
        });

        if (hasDictionary) {
            Object.defineProperty(page, '_pageDictionary', {
                value: createDictionary({ Annots: annots }),
                writable: true,
                configurable: true
            });
        }

        return page;
    }

    function createWidgetItem(
        ref: _PdfReference,
        rect: number[] = [0, 0, 10, 10],
        parent?: _PdfReference
    ): PdfWidgetAnnotation {
        const item: PdfWidgetAnnotation = Object.create(PdfWidgetAnnotation.prototype) as PdfWidgetAnnotation;
        const map: Record<string, unknown> = { Rect: rect };
        if (parent) {
            map.Parent = parent;
        }

        Object.defineProperty(item, '_ref', {
            value: ref,
            writable: true,
            configurable: true
        });

        Object.defineProperty(item, '_dictionary', {
            value: createDictionary(map),
            writable: true,
            configurable: true
        });

        return item;
    }

    function createCheckStateItem(
        exportValue: string,
        initialChecked: boolean
    ): PdfStateItem {
        const item: PdfStateItem = Object.create(PdfStateItem.prototype) as PdfStateItem;

        let checkedValue: boolean = initialChecked;

        Object.defineProperty(item, 'exportValue', {
            value: exportValue,
            writable: true,
            configurable: true
        });

        Object.defineProperty(item, 'checked', {
            get: function (): boolean {
                return checkedValue;
            },
            set: function (value: boolean): void {
                checkedValue = value;
            },
            configurable: true
        });

        return item;
    }

    function createFormShell(): PdfForm {
        const form: PdfForm = Object.create(PdfForm.prototype) as PdfForm;

        Object.defineProperty(form, '_dictionary', {
            value: createDictionary({ Fields: [] }),
            writable: true,
            configurable: true
        });

        Object.defineProperty(form, '_fields', {
            value: [],
            writable: true,
            configurable: true
        });

        Object.defineProperty(form, '_parsedFields', {
            value: new Map<number, PdfField>(),
            writable: true,
            configurable: true
        });

        Object.defineProperty(form, '_fieldCollection', {
            value: [],
            writable: true,
            configurable: true
        });

        Object.defineProperty(form, '_formNames', {
            value: [],
            writable: true,
            configurable: true
        });

        Object.defineProperty(form, '_widgetReferences', {
            value: undefined,
            writable: true,
            configurable: true
        });

        Object.defineProperty(form, '_tabCollection', {
            value: new Map<number, PdfFormFieldsTabOrder>(),
            writable: true,
            configurable: true
        });

        Object.defineProperty(form, '_hasKids', {
            value: false,
            writable: true,
            configurable: true
        });

        Object.defineProperty(form, '_isNeedAppearances', {
            value: false,
            writable: true,
            configurable: true
        });

        Object.defineProperty(form, '_requiresPostProcessing', {
            value: false,
            writable: true,
            configurable: true
        });

        const crossReference: TestCrossReference = {
            _document: null,
            _fetch: jasmine.createSpy('_fetch'),
            _cacheMap: new Map<_PdfReference, _PdfDictionary>(),
            _allowCatalog: false
        };

        Object.defineProperty(form, '_crossReference', {
            value: crossReference,
            writable: true,
            configurable: true
        });

        return form;
    }
    it('should cover _groupingFormFields checkbox branch where matched checked item turns unchecked newItem to checked', (): void => {
        const form: PdfForm = createFormShell();
        (form as unknown as { _fields: _PdfReference[] })._fields = [createReference(500)];

        const oldField: PdfCheckBoxField = Object.create(PdfCheckBoxField.prototype) as PdfCheckBoxField;
        const newField: PdfCheckBoxField = Object.create(PdfCheckBoxField.prototype) as PdfCheckBoxField;

        const oldFieldRef: _PdfReference = createReference(10);
        const oldKidRef: _PdfReference = createReference(11);
        const newKidRef: _PdfReference = createReference(12);

        const oldDictionary: _PdfDictionary = createDictionary({
            Kids: [oldKidRef]
        });

        const matchedItem: PdfStateItem = createCheckStateItem('Yes', true);
        const newItem: PdfStateItem = createCheckStateItem('Yes', false);
        const newWidget: PdfWidgetAnnotation = createWidgetItem(newKidRef, [0, 0, 12, 12], createReference(77));

        Object.defineProperty(oldField, '_name', {
            value: 'CheckGroup2',
            writable: true,
            configurable: true
        });
        Object.defineProperty(newField, '_name', {
            value: 'CheckGroup2',
            writable: true,
            configurable: true
        });

        Object.defineProperty(oldField, '_ref', {
            value: oldFieldRef,
            writable: true,
            configurable: true
        });

        Object.defineProperty(oldField, '_dictionary', {
            value: oldDictionary,
            writable: true,
            configurable: true
        });

        Object.defineProperty(newField, '_dictionary', {
            value: createDictionary({}),
            writable: true,
            configurable: true
        });

        Object.defineProperty(oldField, '_parsedItems', {
            value: new Map<number, PdfStateItem>(),
            writable: true,
            configurable: true
        });

        Object.defineProperty(newField, '_parsedItems', {
            value: new Map<number, PdfStateItem>(),
            writable: true,
            configurable: true
        });

        Object.defineProperty(oldField, 'flatten', {
            value: false,
            writable: true,
            configurable: true
        });

        Object.defineProperty(newField, 'flatten', {
            value: false,
            writable: true,
            configurable: true
        });

        Object.defineProperty(oldField, 'itemsCount', {
            get: function (): number {
                return 1;
            },
            configurable: true
        });

        Object.defineProperty(newField, 'itemsCount', {
            get: function (): number {
                return 1;
            },
            configurable: true
        });

        (oldField as any).itemAt = jasmine.createSpy('oldField.itemAt').and.returnValue(matchedItem) as unknown as (index: number) => PdfWidgetAnnotation;

        (newField as any).itemAt = jasmine.createSpy('newField.itemAt').and.callFake((_index: number): PdfWidgetAnnotation | PdfStateItem => {
            const merged: PdfStateItem & PdfWidgetAnnotation = newItem as PdfStateItem & PdfWidgetAnnotation;
            Object.defineProperty(merged, '_dictionary', {
                value: (newWidget as unknown as { _dictionary: _PdfDictionary })._dictionary,
                writable: true,
                configurable: true
            });
            Object.defineProperty(merged, '_ref', {
                value: newKidRef,
                writable: true,
                configurable: true
            });
            return merged;
        }) as unknown as (index: number) => PdfWidgetAnnotation;

        expect((): void => {
            form._groupingFormFields(newField as unknown as PdfField, oldField as unknown as PdfField);
        }).not.toThrow();

        expect(newItem.checked).toBe(true);
    });

    it('should cover _processRemainingWidgets branches including continue, parent push and standalone widget push', (): void => {
        const form: PdfForm = createFormShell();
        const pageRef: _PdfReference = createReference(100);
        const parentRef: _PdfReference = createReference(101);
        const annotWithParentRef: _PdfReference = createReference(102);
        const standaloneAnnotRef: _PdfReference = createReference(103);

        const invalidPage: PdfPage = {} as PdfPage;
        const validPage: PdfPage = createPage(1, PdfFormFieldsTabOrder.none, [annotWithParentRef, standaloneAnnotRef], true);

        const document: TestDocument = {
            pageCount: 2,
            getPage(index: number): PdfPage {
                return index === 0 ? invalidPage : validPage;
            }
        };

        (form as unknown as { _crossReference: TestCrossReference })._crossReference._document = document;
        (form as unknown as { _fields: _PdfReference[] })._fields = [];
        (form as unknown as { _formNames: string[] })._formNames = [];

        const annotWithParent: _PdfDictionary = createDictionary({
            Subtype: createName('Widget'),
            P: pageRef,
            Parent: parentRef
        });

        const parentDictionary: _PdfDictionary = createDictionary({
            T: 'ParentField'
        });

        const standaloneAnnot: _PdfDictionary = createDictionary({
            Subtype: createName('Widget'),
            P: pageRef,
            FT: createName('Tx'),
            T: 'StandaloneField'
        });

        (form as unknown as { _crossReference: TestCrossReference })._crossReference._fetch.and.callFake(
            (ref: _PdfReference): _PdfDictionary | undefined => {
                if (ref === annotWithParentRef) {
                    return annotWithParent;
                }
                if (ref === parentRef) {
                    return parentDictionary;
                }
                if (ref === standaloneAnnotRef) {
                    return standaloneAnnot;
                }
                return undefined;
            }
        );

        expect((): void => {
            (form as any)._processRemainingWidgets();
        }).not.toThrow();

        const fields: _PdfReference[] = (form as unknown as { _fields: _PdfReference[] })._fields;
        expect(fields.indexOf(parentRef)).toBeGreaterThan(-1);
        expect(fields.indexOf(standaloneAnnotRef)).toBeGreaterThan(-1);
    });

    it('should cover _removeInvalidFields branch where page Annots is an indirect reference', (): void => {
        const form: PdfForm = createFormShell();

        const parentRef: _PdfReference = createReference(200);
        const kidRef: _PdfReference = createReference(201);
        const pageRef: _PdfReference = createReference(202);
        const annotsArrayRef: _PdfReference = createReference(203);

        const parentDictionary: _PdfDictionary = createDictionary({
            Kids: [kidRef]
        });

        const kidDictionary: _PdfDictionary = createDictionary({
            P: pageRef,
            Rect: [0, 0, 20, 20]
        });

        const pageDictionary: _PdfDictionary = createDictionary({
            Annots: annotsArrayRef
        });

        (form as unknown as { _crossReference: TestCrossReference })._crossReference._fetch.and.callFake(
            (ref: _PdfReference): _PdfDictionary | _PdfReference[] | undefined => {
                if (ref === kidRef) {
                    return kidDictionary;
                }
                if (ref === pageRef) {
                    return pageDictionary;
                }
                if (ref === annotsArrayRef) {
                    return [kidRef];
                }
                return undefined;
            }
        );

        expect((): void => {
            const result: boolean = form._removeInvalidFields(
                parentDictionary,
                new Map<number, _PdfDictionary[]>(),
                parentRef,
                []
            );
            expect(result).toBe(true);
        }).not.toThrow();
    });

    it('should cover _validateField branch where matching widget reference is pushed to _fields', (): void => {
        const form: PdfForm = createFormShell();
        const fieldRef: _PdfReference = createReference(310);
        const widgetRef: _PdfReference = createReference(311);

        const widgetDictionary: _PdfDictionary = createDictionary({});
        Object.defineProperty(widgetDictionary, '_reference', {
            value: widgetRef,
            writable: true,
            configurable: true
        });

        const pageWidgets: Map<number, _PdfDictionary[]> = new Map<number, _PdfDictionary[]>();
        pageWidgets.set(0, [widgetDictionary]);

        (form as unknown as { _isValidKids: boolean })._isValidKids = false;
        (form as unknown as { _fields: _PdfReference[] })._fields = [];
        spyOn(form, '_compareWidgets').and.returnValue(true);

        const result: boolean = form._validateField(
            createDictionary({}),
            pageWidgets,
            fieldRef,
            []
        );

        expect(result).toBe(false);
        expect((form as unknown as { _fields: _PdfReference[] })._fields.indexOf(widgetRef)).toBeGreaterThan(-1);
    });

    it('should cover _compareWidgets TU equality branch when no FT/T/V entries exist', (): void => {
        const form: PdfForm = createFormShell();

        const widgetDictionary: _PdfDictionary = createDictionary({
            TU: 'same-tu',
            Rect: [0, 0, 10, 10]
        });

        const annotDictionary: _PdfDictionary = createDictionary({
            TU: 'same-tu',
            Rect: [1, 1, 11, 11]
        });

        const result: boolean = form._compareWidgets(widgetDictionary, annotDictionary);
        expect(result).toBe(false);
    });

    it('should cover _isNode branch for non-widget subtype kids entry', (): void => {
        const form: PdfForm = createFormShell();

        const kidRef: _PdfReference = createReference(400);
        const kidDictionary: _PdfDictionary = createDictionary({
            Subtype: createName('Link')
        });

        (form as unknown as { _crossReference: TestCrossReference })._crossReference._fetch.and.callFake(
            (ref: _PdfReference): _PdfDictionary | undefined => {
                if (ref === kidRef) {
                    return kidDictionary;
                }
                return undefined;
            }
        );

        const result: boolean = form._isNode([kidRef]);
        expect(result).toBe(true);
    });

    it('should cover _parseWidgetReferences for direct widget kid, referenced widget kid and field without kids', (): void => {
        const form: PdfForm = createFormShell();

        const fieldRefWithKids: _PdfReference = createReference(500);
        const fieldRefWithoutKids: _PdfReference = createReference(501);
        const kidRefWidget: _PdfReference = createReference(502);

        const directKidDictionary: _PdfDictionary = createDictionary({
            Subtype: createName('Widget')
        });

        const referencedKidDictionary: _PdfDictionary = createDictionary({
            Subtype: createName('Widget')
        });

        const fieldDictionaryWithKids: _PdfDictionary = createDictionary({
            Kids: [directKidDictionary, kidRefWidget]
        });

        const fieldDictionaryWithoutKids: _PdfDictionary = createDictionary({
            FT: createName('Tx'),
            T: 'PlainField'
        });

        (form as unknown as { _fields: _PdfReference[] })._fields = [fieldRefWithKids, fieldRefWithoutKids];
        (form as unknown as { _widgetReferences?: _PdfReference[] | unknown[] })._widgetReferences = undefined;

        (form as unknown as { _crossReference: TestCrossReference })._crossReference._fetch.and.callFake(
            (ref: _PdfReference): _PdfDictionary | undefined => {
                if (ref === fieldRefWithKids) {
                    return fieldDictionaryWithKids;
                }
                if (ref === kidRefWidget) {
                    return referencedKidDictionary;
                }
                if (ref === fieldRefWithoutKids) {
                    return fieldDictionaryWithoutKids;
                }
                return undefined;
            }
        );

        const result: unknown[] = form._parseWidgetReferences() as unknown[];

        expect(result.length).toBe(3);
        expect(result.indexOf(directKidDictionary)).toBeGreaterThan(-1);
        expect(result.indexOf(kidRefWidget)).toBeGreaterThan(-1);
        expect(result.indexOf(fieldRefWithoutKids)).toBeGreaterThan(-1);
    });

    it('should cover non-radio button grouping branch and set _setAppearance on old button field', (): void => {
        const form: PdfForm = createFormShell();
        (form as unknown as { _fields: _PdfReference[] })._fields = [createReference(700)];

        const oldField: PdfButtonField = Object.create(PdfButtonField.prototype) as PdfButtonField;
        const newField: PdfButtonField = Object.create(PdfButtonField.prototype) as PdfButtonField;

        const oldFieldRef: _PdfReference = createReference(701);
        const oldKidRef: _PdfReference = createReference(702);
        const newKidRef: _PdfReference = createReference(703);

        Object.defineProperty(oldField, '_name', {
            value: 'BtnGroup',
            writable: true,
            configurable: true
        });
        Object.defineProperty(newField, '_name', {
            value: 'BtnGroup',
            writable: true,
            configurable: true
        });

        Object.defineProperty(oldField, '_ref', {
            value: oldFieldRef,
            writable: true,
            configurable: true
        });

        Object.defineProperty(oldField, '_dictionary', {
            value: createDictionary({ Kids: [oldKidRef] }),
            writable: true,
            configurable: true
        });

        Object.defineProperty(newField, '_dictionary', {
            value: createDictionary({}),
            writable: true,
            configurable: true
        });

        Object.defineProperty(oldField, '_parsedItems', {
            value: new Map<number, unknown>(),
            writable: true,
            configurable: true
        });

        Object.defineProperty(oldField, '_setAppearance', {
            value: false,
            writable: true,
            configurable: true
        });

        Object.defineProperty(oldField, 'flatten', {
            value: false,
            writable: true,
            configurable: true
        });

        Object.defineProperty(newField, 'flatten', {
            value: false,
            writable: true,
            configurable: true
        });

        Object.defineProperty(oldField, 'itemsCount', {
            get: function (): number {
                return 1;
            },
            configurable: true
        });

        Object.defineProperty(newField, 'itemsCount', {
            get: function (): number {
                return 1;
            },
            configurable: true
        });

        oldField.itemAt = jasmine.createSpy('oldButton.itemAt').and.returnValue(createWidgetItem(oldKidRef)) as unknown as (index: number) => PdfWidgetAnnotation;
        newField.itemAt = jasmine.createSpy('newButton.itemAt').and.returnValue(createWidgetItem(newKidRef, [0, 0, 10, 10], createReference(704))) as unknown as (index: number) => PdfWidgetAnnotation;

        expect((): void => {
            form._groupingFormFields(newField as unknown as PdfField, oldField as unknown as PdfField);
        }).not.toThrow();

        expect((oldField as unknown as { _setAppearance: boolean })._setAppearance).toBe(true);
    });

    it('should cover radio-field bypass path in _groupingFormFields without throwing', (): void => {
        const form: PdfForm = createFormShell();
        (form as unknown as { _fields: _PdfReference[] })._fields = [createReference(800)];

        const oldField: PdfRadioButtonListField = Object.create(PdfRadioButtonListField.prototype) as PdfRadioButtonListField;
        const newField: PdfRadioButtonListField = Object.create(PdfRadioButtonListField.prototype) as PdfRadioButtonListField;

        Object.defineProperty(oldField, '_name', {
            value: 'RadioGroup',
            writable: true,
            configurable: true
        });

        Object.defineProperty(newField, '_name', {
            value: 'RadioGroup',
            writable: true,
            configurable: true
        });

        Object.defineProperty(oldField, '_dictionary', {
            value: createDictionary({ Kids: [] }),
            writable: true,
            configurable: true
        });

        Object.defineProperty(newField, '_dictionary', {
            value: createDictionary({ Kids: [] }),
            writable: true,
            configurable: true
        });

        Object.defineProperty(oldField, '_kids', {
            value: [],
            writable: true,
            configurable: true
        });

        Object.defineProperty(newField, '_kids', {
            value: [],
            writable: true,
            configurable: true
        });

        Object.defineProperty(oldField, '_parsedItems', {
            value: new Map<number, unknown>(),
            writable: true,
            configurable: true
        });

        Object.defineProperty(newField, '_parsedItems', {
            value: new Map<number, unknown>(),
            writable: true,
            configurable: true
        });

        Object.defineProperty(oldField, 'itemsCount', {
            get: function (): number {
                return 0;
            },
            configurable: true
        });

        Object.defineProperty(newField, 'itemsCount', {
            get: function (): number {
                return 0;
            },
            configurable: true
        });

        Object.defineProperty(oldField, 'selectedIndex', {
            value: -1,
            writable: true,
            configurable: true
        });

        Object.defineProperty(newField, 'selectedIndex', {
            value: -1,
            writable: true,
            configurable: true
        });

        Object.defineProperty(oldField, 'allowUnisonSelection', {
            value: true,
            writable: true,
            configurable: true
        });

        Object.defineProperty(newField, 'allowUnisonSelection', {
            value: true,
            writable: true,
            configurable: true
        });

        expect((): void => {
            form._groupingFormFields(newField as unknown as PdfField, oldField as unknown as PdfField);
        }).not.toThrow();
    });
});


describe('PdfForm highlighted branch coverage', (): void => {

    interface TestDocument {
        pageCount: number;
        getPage(index: number): PdfPage;
    }

    interface TestCrossReference {
        _document: TestDocument | null;
        _fetch: jasmine.Spy;
        _cacheMap: Map<_PdfReference, _PdfDictionary>;
        _allowCatalog: boolean;
    }

    function createReference(id: number): _PdfReference {
        const ref: _PdfReference = Object.create(_PdfReference.prototype) as _PdfReference;
        Object.defineProperty(ref, 'objectNumber', {
            value: id,
            writable: true,
            configurable: true
        });
        Object.defineProperty(ref, 'generationNumber', {
            value: 0,
            writable: true,
            configurable: true
        });
        return ref;
    }

    function createName(name: string): _PdfName {
        const value: _PdfName = Object.create(_PdfName.prototype) as _PdfName;
        Object.defineProperty(value, 'name', {
            value: name,
            writable: true,
            configurable: true
        });
        return value;
    }

    function createDictionary(map: Record<string, unknown> = {}): _PdfDictionary {
        const dict: _PdfDictionary = Object.create(_PdfDictionary.prototype) as _PdfDictionary;

        Object.defineProperty(dict, '_map', {
            value: { ...map },
            writable: true,
            configurable: true
        });

        Object.defineProperty(dict, '_updated', {
            value: false,
            writable: true,
            configurable: true
        });

        dict.has = function (key: string): boolean {
            const store: Record<string, unknown> = (this as unknown as { _map: Record<string, unknown> })._map;
            return Object.prototype.hasOwnProperty.call(store, key);
        };

        dict.get = function (key: string): unknown {
            const store: Record<string, unknown> = (this as unknown as { _map: Record<string, unknown> })._map;
            return store[key];
        };

        dict.getRaw = function (key: string): unknown {
            const store: Record<string, unknown> = (this as unknown as { _map: Record<string, unknown> })._map;
            return store[key];
        };

        dict.getArray = function (key: string): unknown[] {
            const store: Record<string, unknown> = (this as unknown as { _map: Record<string, unknown> })._map;
            return (store[key] as unknown[]) || [];
        };

        dict.set = function (key: string, value: unknown): void {
            const self = this as unknown as { _map: Record<string, unknown> };
            self._map[key] = value;
        };

        dict.update = function (key: string, value: unknown): void {
            const self = this as unknown as { _map: Record<string, unknown>; _updated: boolean };
            self._map[key] = value;
            self._updated = true;
        };

        return dict;
    }

    function createPage(
        index: number,
        tabOrder: PdfFormFieldsTabOrder = PdfFormFieldsTabOrder.none,
        annots: _PdfReference[] = [],
        hasDictionary: boolean = true
    ): PdfPage {
        const page: PdfPage = {} as PdfPage;

        Object.defineProperty(page, '_pageIndex', {
            value: index,
            writable: true,
            configurable: true
        });

        Object.defineProperty(page, '_isNew', {
            value: false,
            writable: true,
            configurable: true
        });

        Object.defineProperty(page, 'tabOrder', {
            value: tabOrder,
            writable: true,
            configurable: true
        });

        if (hasDictionary) {
            Object.defineProperty(page, '_pageDictionary', {
                value: createDictionary({ Annots: annots }),
                writable: true,
                configurable: true
            });
        }

        return page;
    }

    function createWidgetItem(
        ref: _PdfReference,
        rect: number[] = [0, 0, 10, 10],
        parent?: _PdfReference
    ): PdfWidgetAnnotation {
        const item: PdfWidgetAnnotation = Object.create(PdfWidgetAnnotation.prototype) as PdfWidgetAnnotation;
        const map: Record<string, unknown> = { Rect: rect };
        if (parent) {
            map.Parent = parent;
        }

        Object.defineProperty(item, '_ref', {
            value: ref,
            writable: true,
            configurable: true
        });

        Object.defineProperty(item, '_dictionary', {
            value: createDictionary(map),
            writable: true,
            configurable: true
        });

        return item;
    }

    function createCheckStateItem(
        exportValue: string,
        initialChecked: boolean
    ): PdfStateItem {
        const item: PdfStateItem = Object.create(PdfStateItem.prototype) as PdfStateItem;

        let checkedValue: boolean = initialChecked;

        Object.defineProperty(item, 'exportValue', {
            value: exportValue,
            writable: true,
            configurable: true
        });

        Object.defineProperty(item, 'checked', {
            get: function (): boolean {
                return checkedValue;
            },
            set: function (value: boolean): void {
                checkedValue = value;
            },
            configurable: true
        });

        return item;
    }

    function createFormShell(): PdfForm {
        const form: PdfForm = Object.create(PdfForm.prototype) as PdfForm;

        Object.defineProperty(form, '_dictionary', {
            value: createDictionary({ Fields: [] }),
            writable: true,
            configurable: true
        });

        Object.defineProperty(form, '_fields', {
            value: [],
            writable: true,
            configurable: true
        });

        Object.defineProperty(form, '_parsedFields', {
            value: new Map<number, PdfField>(),
            writable: true,
            configurable: true
        });

        Object.defineProperty(form, '_fieldCollection', {
            value: [],
            writable: true,
            configurable: true
        });

        Object.defineProperty(form, '_formNames', {
            value: [],
            writable: true,
            configurable: true
        });

        Object.defineProperty(form, '_widgetReferences', {
            value: undefined,
            writable: true,
            configurable: true
        });

        Object.defineProperty(form, '_tabCollection', {
            value: new Map<number, PdfFormFieldsTabOrder>(),
            writable: true,
            configurable: true
        });

        Object.defineProperty(form, '_hasKids', {
            value: false,
            writable: true,
            configurable: true
        });

        Object.defineProperty(form, '_isNeedAppearances', {
            value: false,
            writable: true,
            configurable: true
        });

        Object.defineProperty(form, '_requiresPostProcessing', {
            value: false,
            writable: true,
            configurable: true
        });

        const crossReference: TestCrossReference = {
            _document: null,
            _fetch: jasmine.createSpy('_fetch'),
            _cacheMap: new Map<_PdfReference, _PdfDictionary>(),
            _allowCatalog: false
        };

        Object.defineProperty(form, '_crossReference', {
            value: crossReference,
            writable: true,
            configurable: true
        });

        return form;
    }


    it('should cover _groupingFormFields checkbox branch where newItem is restored to checked state after matched item update', function () {
        var form = createFormShell();
        form._fields = [createReference(999)];

        var oldField = Object.create(PdfCheckBoxField.prototype);
        var newField = Object.create(PdfCheckBoxField.prototype);

        var oldFieldRef = createReference(1);
        var newItemRef = createReference(2);
        var oldKidRef = createReference(3);

        var oldDictionary = createDictionary({
            Kids: [oldKidRef]
        });

        var newWidget = createWidgetItem(newItemRef, [0, 0, 10, 10], createReference(55));

        var matchedItem = Object.create(PdfStateItem.prototype);
        var matchedChecked = false;
        var newItemChecked = true;

        Object.defineProperty(matchedItem, 'exportValue', {
            value: 'Yes',
            writable: true,
            configurable: true
        });

        // IMPORTANT FIX:
        // _groupingFormFields uses matched._field._isUpdating = false;
        Object.defineProperty(matchedItem, '_field', {
            value: { _isUpdating: true },
            writable: true,
            configurable: true
        });

        Object.defineProperty(matchedItem, 'checked', {
            get: function () {
                return matchedChecked;
            },
            set: function (value) {
                matchedChecked = value;
                // force newItem.checked to become false after matched.checked = true
                // so this line gets covered:
                // if (!newItem.checked) { newItem.checked = true; }
                newItemChecked = false;
            },
            configurable: true
        });

        var newItem = Object.create(PdfStateItem.prototype);

        Object.defineProperty(newItem, 'exportValue', {
            value: 'Yes',
            writable: true,
            configurable: true
        });

        Object.defineProperty(newItem, 'checked', {
            get: function () {
                return newItemChecked;
            },
            set: function (value) {
                newItemChecked = value;
            },
            configurable: true
        });

        // IMPORTANT FIX:
        // itemAt() must return PdfStateItem for PdfCheckBoxField,
        // but _groupingFormFields also reads _dictionary and _ref from itemAt(0)
        Object.defineProperty(newItem, '_dictionary', {
            value: newWidget._dictionary,
            writable: true,
            configurable: true
        });

        Object.defineProperty(newItem, '_ref', {
            value: newItemRef,
            writable: true,
            configurable: true
        });

        Object.defineProperty(oldField, '_name', {
            value: 'CheckGroup',
            writable: true,
            configurable: true
        });

        Object.defineProperty(newField, '_name', {
            value: 'CheckGroup',
            writable: true,
            configurable: true
        });

        Object.defineProperty(oldField, '_ref', {
            value: oldFieldRef,
            writable: true,
            configurable: true
        });

        Object.defineProperty(oldField, '_dictionary', {
            value: oldDictionary,
            writable: true,
            configurable: true
        });

        Object.defineProperty(newField, '_dictionary', {
            value: createDictionary({}),
            writable: true,
            configurable: true
        });

        Object.defineProperty(oldField, '_parsedItems', {
            value: new Map(),
            writable: true,
            configurable: true
        });

        Object.defineProperty(newField, '_parsedItems', {
            value: new Map(),
            writable: true,
            configurable: true
        });

        Object.defineProperty(oldField, 'flatten', {
            value: false,
            writable: true,
            configurable: true
        });

        Object.defineProperty(newField, 'flatten', {
            value: true,
            writable: true,
            configurable: true
        });

        Object.defineProperty(oldField, 'itemsCount', {
            get: function () {
                return 1;
            },
            configurable: true
        });

        Object.defineProperty(newField, 'itemsCount', {
            get: function () {
                return 1;
            },
            configurable: true
        });

        // IMPORTANT FIX:
        // For PdfCheckBoxField, itemAt must behave like PdfStateItem
        oldField.itemAt = jasmine.createSpy('oldField.itemAt').and.callFake(function (_index:any) {
            return matchedItem;
        });

        newField.itemAt = jasmine.createSpy('newField.itemAt').and.callFake(function (_index:any) {
            return newItem;
        });

        expect(function () {
            form._groupingFormFields(newField, oldField);
        }).not.toThrow();

        expect(oldField.flatten).toBe(true);
        expect(newField.flatten).toBe(true);
        expect(matchedItem.checked).toBe(true);
        expect(newItem.checked).toBe(true);
        expect(matchedItem._field._isUpdating).toBe(false);
    });


    it('should cover _groupingFormFields checkbox branch where matched checked item turns unchecked newItem to checked', (): void => {
        const form: PdfForm = createFormShell();
        (form as unknown as { _fields: _PdfReference[] })._fields = [createReference(500)];

        const oldField: PdfCheckBoxField = Object.create(PdfCheckBoxField.prototype) as PdfCheckBoxField;
        const newField: PdfCheckBoxField = Object.create(PdfCheckBoxField.prototype) as PdfCheckBoxField;

        const oldFieldRef: _PdfReference = createReference(10);
        const oldKidRef: _PdfReference = createReference(11);
        const newKidRef: _PdfReference = createReference(12);

        const oldDictionary: _PdfDictionary = createDictionary({
            Kids: [oldKidRef]
        });

        const matchedItem: PdfStateItem = createCheckStateItem('Yes', true);
        const newItem: PdfStateItem = createCheckStateItem('Yes', false);
        const newWidget: PdfWidgetAnnotation = createWidgetItem(newKidRef, [0, 0, 12, 12], createReference(77));

        Object.defineProperty(oldField, '_name', {
            value: 'CheckGroup2',
            writable: true,
            configurable: true
        });
        Object.defineProperty(newField, '_name', {
            value: 'CheckGroup2',
            writable: true,
            configurable: true
        });

        Object.defineProperty(oldField, '_ref', {
            value: oldFieldRef,
            writable: true,
            configurable: true
        });

        Object.defineProperty(oldField, '_dictionary', {
            value: oldDictionary,
            writable: true,
            configurable: true
        });

        Object.defineProperty(newField, '_dictionary', {
            value: createDictionary({}),
            writable: true,
            configurable: true
        });

        Object.defineProperty(oldField, '_parsedItems', {
            value: new Map<number, PdfStateItem>(),
            writable: true,
            configurable: true
        });

        Object.defineProperty(newField, '_parsedItems', {
            value: new Map<number, PdfStateItem>(),
            writable: true,
            configurable: true
        });

        Object.defineProperty(oldField, 'flatten', {
            value: false,
            writable: true,
            configurable: true
        });

        Object.defineProperty(newField, 'flatten', {
            value: false,
            writable: true,
            configurable: true
        });

        Object.defineProperty(oldField, 'itemsCount', {
            get: function (): number {
                return 1;
            },
            configurable: true
        });

        Object.defineProperty(newField, 'itemsCount', {
            get: function (): number {
                return 1;
            },
            configurable: true
        });


        oldField.itemAt = jasmine.createSpy('oldField.itemAt').and.returnValue(matchedItem) as unknown as (index: number) => PdfStateItem;

        newField.itemAt = jasmine.createSpy('newField.itemAt').and.callFake((_index: number): PdfStateItem => {
            const merged: PdfStateItem = newItem as PdfStateItem;

            Object.defineProperty(merged as PdfStateItem & { _dictionary: _PdfDictionary }, '_dictionary', {
                value: (newWidget as PdfWidgetAnnotation & { _dictionary: _PdfDictionary })._dictionary,
                writable: true,
                configurable: true
            });

            Object.defineProperty(merged as PdfStateItem & { _ref: _PdfReference }, '_ref', {
                value: newKidRef,
                writable: true,
                configurable: true
            });

            return merged;
        }) as unknown as (index: number) => PdfStateItem;

        expect((): void => {
            form._groupingFormFields(newField as unknown as PdfField, oldField as unknown as PdfField);
        }).not.toThrow();

        expect(newItem.checked).toBe(true);
    });

    it('should cover _processRemainingWidgets branches including continue, parent push and standalone widget push', (): void => {
        const form: PdfForm = createFormShell();
        const pageRef: _PdfReference = createReference(100);
        const parentRef: _PdfReference = createReference(101);
        const annotWithParentRef: _PdfReference = createReference(102);
        const standaloneAnnotRef: _PdfReference = createReference(103);

        const invalidPage: PdfPage = {} as PdfPage;
        const validPage: PdfPage = createPage(1, PdfFormFieldsTabOrder.none, [annotWithParentRef, standaloneAnnotRef], true);

        const document: TestDocument = {
            pageCount: 2,
            getPage(index: number): PdfPage {
                return index === 0 ? invalidPage : validPage;
            }
        };

        (form as unknown as { _crossReference: TestCrossReference })._crossReference._document = document;
        (form as unknown as { _fields: _PdfReference[] })._fields = [];
        (form as unknown as { _formNames: string[] })._formNames = [];

        const annotWithParent: _PdfDictionary = createDictionary({
            Subtype: createName('Widget'),
            P: pageRef,
            Parent: parentRef
        });

        const parentDictionary: _PdfDictionary = createDictionary({
            T: 'ParentField'
        });

        const standaloneAnnot: _PdfDictionary = createDictionary({
            Subtype: createName('Widget'),
            P: pageRef,
            FT: createName('Tx'),
            T: 'StandaloneField'
        });

        (form as unknown as { _crossReference: TestCrossReference })._crossReference._fetch.and.callFake(
            (ref: _PdfReference): _PdfDictionary | undefined => {
                if (ref === annotWithParentRef) {
                    return annotWithParent;
                }
                if (ref === parentRef) {
                    return parentDictionary;
                }
                if (ref === standaloneAnnotRef) {
                    return standaloneAnnot;
                }
                return undefined;
            }
        );


        expect((): void => {
            (form as unknown as { _processRemainingWidgets: () => void })._processRemainingWidgets();
        }).not.toThrow();


        const fields: _PdfReference[] = (form as unknown as { _fields: _PdfReference[] })._fields;
        expect(fields.indexOf(parentRef)).toBeGreaterThan(-1);
        expect(fields.indexOf(standaloneAnnotRef)).toBeGreaterThan(-1);
    });

    it('should cover _removeInvalidFields branch where page Annots is an indirect reference', (): void => {
        const form: PdfForm = createFormShell();

        const parentRef: _PdfReference = createReference(200);
        const kidRef: _PdfReference = createReference(201);
        const pageRef: _PdfReference = createReference(202);
        const annotsArrayRef: _PdfReference = createReference(203);

        const parentDictionary: _PdfDictionary = createDictionary({
            Kids: [kidRef]
        });

        const kidDictionary: _PdfDictionary = createDictionary({
            P: pageRef,
            Rect: [0, 0, 20, 20]
        });

        const pageDictionary: _PdfDictionary = createDictionary({
            Annots: annotsArrayRef
        });

        (form as unknown as { _crossReference: TestCrossReference })._crossReference._fetch.and.callFake(
            (ref: _PdfReference): _PdfDictionary | _PdfReference[] | undefined => {
                if (ref === kidRef) {
                    return kidDictionary;
                }
                if (ref === pageRef) {
                    return pageDictionary;
                }
                if (ref === annotsArrayRef) {
                    return [kidRef];
                }
                return undefined;
            }
        );

        expect((): void => {
            const result: boolean = form._removeInvalidFields(
                parentDictionary,
                new Map<number, _PdfDictionary[]>(),
                parentRef,
                []
            );
            expect(result).toBe(true);
        }).not.toThrow();
    });
    it('should cover _validateField branch where matching widget reference is pushed to _fields', (): void => {
        const form: PdfForm = createFormShell();
        const fieldRef: _PdfReference = createReference(310);
        const widgetRef: _PdfReference = createReference(311);

        const widgetDictionary: _PdfDictionary = createDictionary({});
        Object.defineProperty(widgetDictionary, '_reference', {
            value: widgetRef,
            writable: true,
            configurable: true
        });

        const pageWidgets: Map<number, _PdfDictionary[]> = new Map<number, _PdfDictionary[]>();
        pageWidgets.set(0, [widgetDictionary]);

        (form as unknown as { _isValidKids: boolean })._isValidKids = false;
        (form as unknown as { _fields: _PdfReference[] })._fields = [];
        spyOn(form, '_compareWidgets').and.returnValue(true);

        const result: boolean = form._validateField(
            createDictionary({}),
            pageWidgets,
            fieldRef,
            []
        );

        expect(result).toBe(false);
        expect((form as unknown as { _fields: _PdfReference[] })._fields.indexOf(widgetRef)).toBeGreaterThan(-1);
    });

    it('should cover _isNode branch for non-widget subtype kids entry', (): void => {
        const form: PdfForm = createFormShell();

        const kidRef: _PdfReference = createReference(400);
        const kidDictionary: _PdfDictionary = createDictionary({
            Subtype: createName('Link')
        });

        (form as unknown as { _crossReference: TestCrossReference })._crossReference._fetch.and.callFake(
            (ref: _PdfReference): _PdfDictionary | undefined => {
                if (ref === kidRef) {
                    return kidDictionary;
                }
                return undefined;
            }
        );

        const result: boolean = form._isNode([kidRef]);
        expect(result).toBe(true);
    });

    it('should cover _parseWidgetReferences for direct widget kid, referenced widget kid and field without kids', (): void => {
        const form: PdfForm = createFormShell();

        const fieldRefWithKids: _PdfReference = createReference(500);
        const fieldRefWithoutKids: _PdfReference = createReference(501);
        const kidRefWidget: _PdfReference = createReference(502);

        const directKidDictionary: _PdfDictionary = createDictionary({
            Subtype: createName('Widget')
        });

        const referencedKidDictionary: _PdfDictionary = createDictionary({
            Subtype: createName('Widget')
        });

        const fieldDictionaryWithKids: _PdfDictionary = createDictionary({
            Kids: [directKidDictionary, kidRefWidget]
        });

        const fieldDictionaryWithoutKids: _PdfDictionary = createDictionary({
            FT: createName('Tx'),
            T: 'PlainField'
        });

        (form as unknown as { _fields: _PdfReference[] })._fields = [fieldRefWithKids, fieldRefWithoutKids];
        (form as unknown as { _widgetReferences?: _PdfReference[] | unknown[] })._widgetReferences = undefined;

        (form as unknown as { _crossReference: TestCrossReference })._crossReference._fetch.and.callFake(
            (ref: _PdfReference): _PdfDictionary | undefined => {
                if (ref === fieldRefWithKids) {
                    return fieldDictionaryWithKids;
                }
                if (ref === kidRefWidget) {
                    return referencedKidDictionary;
                }
                if (ref === fieldRefWithoutKids) {
                    return fieldDictionaryWithoutKids;
                }
                return undefined;
            }
        );

        const result: unknown[] = form._parseWidgetReferences() as unknown[];

        expect(result.length).toBe(3);
        expect(result.indexOf(directKidDictionary)).toBeGreaterThan(-1);
        expect(result.indexOf(kidRefWidget)).toBeGreaterThan(-1);
        expect(result.indexOf(fieldRefWithoutKids)).toBeGreaterThan(-1);
    });

    it('should cover non-radio button grouping branch and set _setAppearance on old button field', (): void => {
        const form: PdfForm = createFormShell();
        (form as unknown as { _fields: _PdfReference[] })._fields = [createReference(700)];

        const oldField: PdfButtonField = Object.create(PdfButtonField.prototype) as PdfButtonField;
        const newField: PdfButtonField = Object.create(PdfButtonField.prototype) as PdfButtonField;

        const oldFieldRef: _PdfReference = createReference(701);
        const oldKidRef: _PdfReference = createReference(702);
        const newKidRef: _PdfReference = createReference(703);

        Object.defineProperty(oldField, '_name', {
            value: 'BtnGroup',
            writable: true,
            configurable: true
        });
        Object.defineProperty(newField, '_name', {
            value: 'BtnGroup',
            writable: true,
            configurable: true
        });

        Object.defineProperty(oldField, '_ref', {
            value: oldFieldRef,
            writable: true,
            configurable: true
        });

        Object.defineProperty(oldField, '_dictionary', {
            value: createDictionary({ Kids: [oldKidRef] }),
            writable: true,
            configurable: true
        });

        Object.defineProperty(newField, '_dictionary', {
            value: createDictionary({}),
            writable: true,
            configurable: true
        });

        Object.defineProperty(oldField, '_parsedItems', {
            value: new Map<number, unknown>(),
            writable: true,
            configurable: true
        });

        Object.defineProperty(oldField, '_setAppearance', {
            value: false,
            writable: true,
            configurable: true
        });

        Object.defineProperty(oldField, 'flatten', {
            value: false,
            writable: true,
            configurable: true
        });

        Object.defineProperty(newField, 'flatten', {
            value: false,
            writable: true,
            configurable: true
        });

        Object.defineProperty(oldField, 'itemsCount', {
            get: function (): number {
                return 1;
            },
            configurable: true
        });

        Object.defineProperty(newField, 'itemsCount', {
            get: function (): number {
                return 1;
            },
            configurable: true
        });

        oldField.itemAt = jasmine.createSpy('oldButton.itemAt').and.returnValue(createWidgetItem(oldKidRef)) as unknown as (index: number) => PdfWidgetAnnotation;
        newField.itemAt = jasmine.createSpy('newButton.itemAt').and.returnValue(createWidgetItem(newKidRef, [0, 0, 10, 10], createReference(704))) as unknown as (index: number) => PdfWidgetAnnotation;

        expect((): void => {
            form._groupingFormFields(newField as unknown as PdfField, oldField as unknown as PdfField);
        }).not.toThrow();

        expect((oldField as unknown as { _setAppearance: boolean })._setAppearance).toBe(true);
    });

    it('should cover radio-field bypass path in _groupingFormFields without throwing', (): void => {
        const form: PdfForm = createFormShell();
        (form as unknown as { _fields: _PdfReference[] })._fields = [createReference(800)];

        const oldField: PdfRadioButtonListField = Object.create(PdfRadioButtonListField.prototype) as PdfRadioButtonListField;
        const newField: PdfRadioButtonListField = Object.create(PdfRadioButtonListField.prototype) as PdfRadioButtonListField;

        Object.defineProperty(oldField, '_name', {
            value: 'RadioGroup',
            writable: true,
            configurable: true
        });

        Object.defineProperty(newField, '_name', {
            value: 'RadioGroup',
            writable: true,
            configurable: true
        });

        Object.defineProperty(oldField, '_dictionary', {
            value: createDictionary({ Kids: [] }),
            writable: true,
            configurable: true
        });

        Object.defineProperty(newField, '_dictionary', {
            value: createDictionary({ Kids: [] }),
            writable: true,
            configurable: true
        });

        Object.defineProperty(oldField, '_kids', {
            value: [],
            writable: true,
            configurable: true
        });

        Object.defineProperty(newField, '_kids', {
            value: [],
            writable: true,
            configurable: true
        });

        Object.defineProperty(oldField, '_parsedItems', {
            value: new Map<number, unknown>(),
            writable: true,
            configurable: true
        });

        Object.defineProperty(newField, '_parsedItems', {
            value: new Map<number, unknown>(),
            writable: true,
            configurable: true
        });

        Object.defineProperty(oldField, 'itemsCount', {
            get: function (): number {
                return 0;
            },
            configurable: true
        });

        Object.defineProperty(newField, 'itemsCount', {
            get: function (): number {
                return 0;
            },
            configurable: true
        });

        Object.defineProperty(oldField, 'selectedIndex', {
            value: -1,
            writable: true,
            configurable: true
        });

        Object.defineProperty(newField, 'selectedIndex', {
            value: -1,
            writable: true,
            configurable: true
        });

        Object.defineProperty(oldField, 'allowUnisonSelection', {
            value: true,
            writable: true,
            configurable: true
        });

        Object.defineProperty(newField, 'allowUnisonSelection', {
            value: true,
            writable: true,
            configurable: true
        });

        expect((): void => {
            form._groupingFormFields(newField as unknown as PdfField, oldField as unknown as PdfField);
        }).not.toThrow();
    });
});


    function createReference(id:any) {
        var ref = Object.create(_PdfReference.prototype);
        Object.defineProperty(ref, 'objectNumber', {
            value: id,
            writable: true,
            configurable: true
        });
        Object.defineProperty(ref, 'generationNumber', {
            value: 0,
            writable: true,
            configurable: true
        });
        return ref;
    }

    function createName(name:any) {
        var value = Object.create(_PdfName.prototype);
        Object.defineProperty(value, 'name', {
            value: name,
            writable: true,
            configurable: true
        });
        return value;
    }

    function createDictionary(map :any) {
        var dict = Object.create(_PdfDictionary.prototype);
        Object.defineProperty(dict, '_map', {
            value: Object.assign({}, map || {}),
            writable: true,
            configurable: true
        });
        Object.defineProperty(dict, '_updated', {
            value: false,
            writable: true,
            configurable: true
        });

        dict.has = function (key:any) {
            return Object.prototype.hasOwnProperty.call(this._map, key);
        };
        dict.get = function (key:any) {
            return this._map[key];
        };
        dict.getRaw = function (key:any) {
            return this._map[key];
        };
        dict.getArray = function (key:any) {
            return this._map[key];
        };
        dict.set = function (key:any, value:any) {
            this._map[key] = value;
        };
        dict.update = function (key:any, value:any) {
            this._map[key] = value;
            this._updated = true;
        };

        return dict;
    }

    function createFormShell() {
        var form = Object.create(PdfForm.prototype);
        form._dictionary = createDictionary({ Fields: [] });
        form._fields = [];
        form._parsedFields = new Map();
        form._fieldCollection = [];
        form._formNames = [];
        form._widgetReferences = undefined;
        form._tabCollection = new Map();
        form._hasKids = false;
        form._isNeedAppearances = false;
        form._requiresPostProcessing = false;
        form._crossReference = {
            _document: null,
            _cacheMap: new Map(),
            _allowCatalog: false,
            _fetch: jasmine.createSpy('_fetch')
        };
        return form;
    }

    function createWidgetItem(ref:any, rect:any, parentRef:any) {
        var item = Object.create(PdfWidgetAnnotation.prototype);
        var map = {
            Rect: rect || [0, 0, 10, 10]
        };
        if (parentRef) {
            (map as any).Parent = parentRef;
        }

        Object.defineProperty(item, '_ref', {
            value: ref,
            writable: true,
            configurable: true
        });
        Object.defineProperty(item, '_dictionary', {
            value: createDictionary(map),
            writable: true,
            configurable: true
        });

        return item;
    }

    function createPage(index:any, rotation:any) {
        var page = Object.create(PdfPage.prototype);
        Object.defineProperty(page, '_pageIndex', {
            value: index,
            writable: true,
            configurable: true
        });
        Object.defineProperty(page, '_isNew', {
            value: false,
            writable: true,
            configurable: true
        });
        Object.defineProperty(page, 'rotation', {
            value: typeof rotation === 'number' ? rotation : PdfRotationAngle.angle0,
            writable: true,
            configurable: true
        });
        Object.defineProperty(page, 'tabOrder', {
            value: PdfFormFieldsTabOrder.none,
            writable: true,
            configurable: true
        });
        return page;
    }

    function createPdfField(page:any, rect:any, tabIndex:any) {
        var field = Object.create(PdfField.prototype);

        Object.defineProperty(field, '_dictionary', {
            value: createDictionary({
                Rect: rect || [0, 0, 10, 10]
            }),
            writable: true,
            configurable: true
        });

        Object.defineProperty(field, 'page', {
            configurable: true,
            get: function () {
                return page;
            }
        });

        Object.defineProperty(field, 'tabIndex', {
            configurable: true,
            get: function () {
                return typeof tabIndex === 'number' ? tabIndex : 0;
            }
        });

        return field;
    }

    it('should cover _groupingFormFields branch: if (!newItem.checked) { newItem.checked = true; }', function () {
        var form = createFormShell();
        form._fields = [createReference(999)];

        var oldField = Object.create(PdfCheckBoxField.prototype);
        var newField = Object.create(PdfCheckBoxField.prototype);

        var oldFieldRef = createReference(1);
        var newItemRef = createReference(2);
        var oldKidRef = createReference(3);

        var oldDictionary = createDictionary({
            Kids: [oldKidRef]
        });

        var newWidget = createWidgetItem(newItemRef, [0, 0, 10, 10], createReference(55));

        var matchedItem = Object.create(PdfStateItem.prototype);
        var matchedChecked = false;
        var newItemChecked = true;

        Object.defineProperty(matchedItem, 'exportValue', {
            value: 'Yes',
            writable: true,
            configurable: true
        });

        // REQUIRED: _groupingFormFields sets matched._field._isUpdating = false;
        Object.defineProperty(matchedItem, '_field', {
            value: { _isUpdating: true },
            writable: true,
            configurable: true
        });

        Object.defineProperty(matchedItem, 'checked', {
            get: function () {
                return matchedChecked;
            },
            set: function (value) {
                matchedChecked = value;
                // force newItem.checked -> false immediately after matched.checked = true
                // so highlighted line executes
                newItemChecked = false;
            },
            configurable: true
        });

        var newItem = Object.create(PdfStateItem.prototype);

        Object.defineProperty(newItem, 'exportValue', {
            value: 'Yes',
            writable: true,
            configurable: true
        });

        Object.defineProperty(newItem, 'checked', {
            get: function () {
                return newItemChecked;
            },
            set: function (value) {
                newItemChecked = value;
            },
            configurable: true
        });

        // REQUIRED: same object must behave like PdfStateItem + have widget data
        Object.defineProperty(newItem, '_dictionary', {
            value: newWidget._dictionary,
            writable: true,
            configurable: true
        });

        Object.defineProperty(newItem, '_ref', {
            value: newItemRef,
            writable: true,
            configurable: true
        });

        Object.defineProperty(oldField, '_name', {
            value: 'CheckGroupOne',
            writable: true,
            configurable: true
        });
        Object.defineProperty(newField, '_name', {
            value: 'CheckGroupOne',
            writable: true,
            configurable: true
        });

        Object.defineProperty(oldField, '_ref', {
            value: oldFieldRef,
            writable: true,
            configurable: true
        });

        Object.defineProperty(oldField, '_dictionary', {
            value: oldDictionary,
            writable: true,
            configurable: true
        });

        Object.defineProperty(newField, '_dictionary', {
            value: createDictionary({}),
            writable: true,
            configurable: true
        });

        Object.defineProperty(oldField, '_parsedItems', {
            value: new Map(),
            writable: true,
            configurable: true
        });

        Object.defineProperty(newField, '_parsedItems', {
            value: new Map(),
            writable: true,
            configurable: true
        });

        Object.defineProperty(oldField, 'flatten', {
            value: false,
            writable: true,
            configurable: true
        });

        Object.defineProperty(newField, 'flatten', {
            value: false,
            writable: true,
            configurable: true
        });

        Object.defineProperty(oldField, 'itemsCount', {
            get: function () {
                return 1;
            },
            configurable: true
        });

        Object.defineProperty(newField, 'itemsCount', {
            get: function () {
                return 1;
            },
            configurable: true
        });

        oldField.itemAt = jasmine.createSpy('oldField.itemAt').and.callFake(function () {
            return matchedItem;
        });

        newField.itemAt = jasmine.createSpy('newField.itemAt').and.callFake(function () {
            return newItem;
        });

        expect(function () {
            form._groupingFormFields(newField, oldField);
        }).not.toThrow();

        expect(matchedItem.checked).toBe(true);
        expect(newItem.checked).toBe(true);
        expect(matchedItem._field._isUpdating).toBe(false);
    });

    it('should cover _groupingFormFields branch: if (matched && matched.checked && !newItem.checked) { newItem.checked = true; }', function () {
        var form = createFormShell();
        form._fields = [createReference(1000)];

        var oldField = Object.create(PdfCheckBoxField.prototype);
        var newField = Object.create(PdfCheckBoxField.prototype);

        var oldFieldRef = createReference(10);
        var newItemRef = createReference(11);
        var oldKidRef = createReference(12);

        var oldDictionary = createDictionary({
            Kids: [oldKidRef]
        });

        var newWidget = createWidgetItem(newItemRef, [0, 0, 10, 10], createReference(56));

        var matchedItem = Object.create(PdfStateItem.prototype);
        var newItem = Object.create(PdfStateItem.prototype);
        var matchedChecked = true;
        var newItemChecked = false;

        Object.defineProperty(matchedItem, 'exportValue', {
            value: 'Yes',
            writable: true,
            configurable: true
        });
        Object.defineProperty(matchedItem, 'checked', {
            get: function () {
                return matchedChecked;
            },
            set: function (value) {
                matchedChecked = value;
            },
            configurable: true
        });

        Object.defineProperty(newItem, 'exportValue', {
            value: 'Yes',
            writable: true,
            configurable: true
        });
        Object.defineProperty(newItem, 'checked', {
            get: function () {
                return newItemChecked;
            },
            set: function (value) {
                newItemChecked = value;
            },
            configurable: true
        });

        Object.defineProperty(newItem, '_dictionary', {
            value: newWidget._dictionary,
            writable: true,
            configurable: true
        });

        Object.defineProperty(newItem, '_ref', {
            value: newItemRef,
            writable: true,
            configurable: true
        });

        Object.defineProperty(oldField, '_name', {
            value: 'CheckGroupTwo',
            writable: true,
            configurable: true
        });
        Object.defineProperty(newField, '_name', {
            value: 'CheckGroupTwo',
            writable: true,
            configurable: true
        });

        Object.defineProperty(oldField, '_ref', {
            value: oldFieldRef,
            writable: true,
            configurable: true
        });

        Object.defineProperty(oldField, '_dictionary', {
            value: oldDictionary,
            writable: true,
            configurable: true
        });

        Object.defineProperty(newField, '_dictionary', {
            value: createDictionary({}),
            writable: true,
            configurable: true
        });

        Object.defineProperty(oldField, '_parsedItems', {
            value: new Map(),
            writable: true,
            configurable: true
        });

        Object.defineProperty(newField, '_parsedItems', {
            value: new Map(),
            writable: true,
            configurable: true
        });

        Object.defineProperty(oldField, 'flatten', {
            value: false,
            writable: true,
            configurable: true
        });

        Object.defineProperty(newField, 'flatten', {
            value: false,
            writable: true,
            configurable: true
        });

        Object.defineProperty(oldField, 'itemsCount', {
            get: function () {
                return 1;
            },
            configurable: true
        });

        Object.defineProperty(newField, 'itemsCount', {
            get: function () {
                return 1;
            },
            configurable: true
        });

        oldField.itemAt = jasmine.createSpy('oldField.itemAt').and.callFake(function () {
            return matchedItem;
        });

        newField.itemAt = jasmine.createSpy('newField.itemAt').and.callFake(function () {
            return newItem;
        });

        spyOn(form, '_getSelectedExportValue').and.returnValue(undefined);

        expect(function () {
            form._groupingFormFields(newField, oldField);
        }).not.toThrow();

        expect(matchedItem.checked).toBe(true);
        expect(newItem.checked).toBe(true);
    });

    it('should cover _isNode direct dictionary entry branch and return true for non-widget subtype', function () {
        var form = createFormShell();

        var directKidDictionary = createDictionary({
            Subtype: createName('Link')
        });

        // Source uses _isNullOrUndefined(...) in a truthy way in this branch,
        // so make the spy return true for non-null values.
        spyOn(utils, '_isNullOrUndefined').and.callFake(function (value:any) {
            return value !== null && typeof value !== 'undefined';
        });

        var result = form._isNode([directKidDictionary]);

        expect(result).toBe(true);
    });

    it('should cover _compareFields column branch index!==0 -> result=index', function () {
        var form = createFormShell();
        form._tabOrder = PdfFormFieldsTabOrder.column;

        var page0 = createPage(0, PdfRotationAngle.angle0);
        var page1 = createPage(1, PdfRotationAngle.angle0);

        var field1 = createPdfField(page0, [10, 10, 20, 20], 0);
        var field2 = createPdfField(page1, [30, 30, 40, 40], 0);

        spyOn(form, '_sortItemByPageIndex').and.callFake(function (field:any) {
            return field.page;
        });

        var result = form._compareFields(field1, field2);

        // page0 index - page1 index = -1
        expect(result).toBe(-1);
    });

    it('should cover _compareFields manual branch index!==0 -> result=index', function () {
        var form = createFormShell();
        form._tabOrder = PdfFormFieldsTabOrder.manual;

        var page0 = createPage(0, PdfRotationAngle.angle0);
        var page1 = createPage(1, PdfRotationAngle.angle0);

        var field1 = createPdfField(page0, [10, 10, 20, 20], 5);
        var field2 = createPdfField(page1, [30, 30, 40, 40], 1);

        spyOn(form, '_sortItemByPageIndex').and.callFake(function (field:any) {
            return field.page;
        });

        var result = form._compareFields(field1, field2);

        // page0 index - page1 index = -1
        expect(result).toBe(-1);
    });

    it('should cover _getFieldIndex first exact-name hit branch: if (nameIndex !== -1) { index = nameIndex; }', function () {
        var form = createFormShell();
        form._fields = [createReference(2000)];

        var field = Object.create(PdfField.prototype);
        Object.defineProperty(field, 'name', {
            configurable: true,
            get: function () {
                return 'CustomerName';
            }
        });
        Object.defineProperty(field, 'actualName', {
            configurable: true,
            get: function () {
                return 'CustomerNameActual';
            }
        });

        spyOn(form, 'fieldAt').and.callFake(function (index:any) {
            if (index === 0) {
                return field;
            }
            return undefined;
        });

        var result = form._getFieldIndex('CustomerName');

        expect(result).toBe(0);
    });



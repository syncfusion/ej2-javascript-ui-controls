import { _PdfDictionary, _PdfName, _PdfReference } from './../pdf-primitives';
import { _PdfCrossReference } from './../pdf-cross-reference';
import { PdfField, PdfTextBoxField, PdfButtonField, PdfCheckBoxField, PdfRadioButtonListField, PdfComboBoxField, PdfListBoxField, PdfSignatureField } from './field';
import { _getInheritableProperty, _getPageIndex, _isNullOrUndefined } from './../utils';
import { PdfFormFieldsTabOrder, _FieldFlag, _SignatureFlag } from './../enumerator';
import { PdfPage } from './../pdf-page';
import { PdfAnnotationCollection } from './../annotations/annotation-collection';
import { PdfRadioButtonListItem, PdfStateItem, PdfWidgetAnnotation } from './../annotations/annotation';
import { PdfDocument } from '../pdf-document';
import { _PdfCatalog } from '../pdf-catalog';
import { PdfFont } from './../fonts/pdf-standard-font';
/**
 * Represents a PDF form.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access the form of the PDF document
 * let form: PdfForm = document.form;
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfForm {
    /**
     * Cross-reference of the owning PDF document.
     *
     * @private
     */
    _crossReference: _PdfCrossReference;
    /**
     * AcroForm dictionary containing form-wide entries.
     *
     * @private
     */
    _dictionary: _PdfDictionary;
    /**
     * References to top-level fields in the form.
     *
     * @private
     */
    _fields: Array<_PdfReference>;
    /**
     * References to widget annotations associated with form fields.
     *
     * @private
     */
    _widgetReferences: Array<_PdfReference>;
    /**
     * Cache of parsed fields keyed by index.
     *
     * @private
     */
    _parsedFields: Map<number, PdfField>;
    /**
     * Indicates whether the viewer should generate appearances.
     *
     * @private
     */
    _needAppearances: boolean;
    /**
     * Indicates use of a default appearance for widgets.
     *
     * @private
     */
    _isDefaultAppearance: boolean = false;
    /**
     * Indicates whether the form contains fields with kids.
     *
     * @private
     */
    _hasKids: boolean = false;
    /**
     * Indicates whether to generate appearance streams for fields.
     *
     * @private
     */
    _setAppearance: boolean = false;
    /**
     * Exports fields even if they are empty.
     *
     * @private
     */
    _exportEmptyFields: boolean = false;
    /**
     * Field names in the order they were parsed.
     *
     * @private
     */
    _fieldNames: Array<string>;
    /**
     * Indexed field names.
     *
     * @private
     */
    _indexedFieldNames: Array<string>;
    /**
     * Actual field names without indices or suffixes.
     *
     * @private
     */
    _actualFieldNames: Array<string>;
    /**
     * Indexed actual field names list.
     *
     * @private
     */
    _indexedActualFieldNames: Array<string>;
    /**
     * Global tab order setting for form fields.
     *
     * @private
     */
    _tabOrder: PdfFormFieldsTabOrder;
    /**
     * Collection of parsed field instances.
     *
     * @private
     */
    _fieldCollection: PdfField[] = [];
    /**
     * Per page tab order map.
     *
     * @private
     */
    _tabCollection: Map<number, PdfFormFieldsTabOrder>;
    /**
     * Signature flag indicating required usage or certification.
     *
     * @private
     */
    _signFlag: _SignatureFlag = _SignatureFlag.none;
    /**
     * Cached indicator for NeedAppearances usage.
     *
     * @private
     */
    _isNeedAppearances: boolean = false;
    /**
     * List of form names in document order.
     *
     * @private
     */
    _formNames: Array<string> = [];
    /**
     * Enables automatic naming for newly added fields.
     *
     * @private
     */
    _fieldAutoNaming: boolean = false;
    /**
     * Generated or user-specified field names.
     *
     * @private
     */
    _fieldName: Array<string> = [];
    /**
     * Cache of fonts used across fields keyed by font name.
     *
     * @private
     */
    _fontCache: Map<string, PdfFont> = new Map();
    /**
     * Cache of fonts used across fields keyed by font name.
     *
     * @private
     */
    _fontResources: _PdfDictionary;
    /**
     * Indicates whether additional post-processing is required.
     *
     * @private
     */
    _requiresPostProcessing: boolean = false;
    /**
     * Represents a loaded from the PDF document.
     *
     * @private
     * @param {_PdfDictionary} dictionary Form dictionary.
     * @param {_PdfCrossReference} crossReference Cross reference object.
     */
    constructor(dictionary: _PdfDictionary, crossReference: _PdfCrossReference) {
        this._dictionary = dictionary;
        this._crossReference = crossReference;
        this._parsedFields = new Map();
        this._fields = [];
        this._createFields();
    }
    /**
     * Gets the fields count (Read only).
     *
     * @returns {number} Fields count.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access loaded form
     * let form: PdfForm = document.form;
     * // Gets the fields count
     * let count: number = form.count;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get count(): number {
        return this._fields.length;
    }
    /**
     * Gets a value indicating whether need appearances (Read only).
     *
     * @returns {boolean} Need appearances.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access loaded form
     * let form: PdfForm = document.form;
     * // Gets the boolean flag indicating need appearances
     * let needAppearances: number = form.needAppearances;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get needAppearances(): boolean {
        if (this._dictionary.has('NeedAppearances')) {
            this._needAppearances = this._dictionary.get('NeedAppearances');
        }
        return this._needAppearances;
    }
    /**
     * Gets a value indicating whether allow to export empty fields or not.
     *
     * @returns {boolean} Export empty fields.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access loaded form
     * let form: PdfForm = document.form;
     * // Gets a value indicating whether allow to export empty fields or not.
     * let exportEmptyFields: boolean = form.exportEmptyFields;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get exportEmptyFields(): boolean {
        return this._exportEmptyFields;
    }
    /**
     * Sets a value indicating whether allow to export empty fields or not.
     *
     * @param {boolean} value Export empty fields.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access loaded form
     * let form: PdfForm = document.form;
     * // Sets a value indicating whether allow to export empty fields or not.
     * form.exportEmptyFields = false;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set exportEmptyFields(value: boolean) {
        this._exportEmptyFields = value;
    }
    /**
     * Gets the current signature flags of the form (`SigFlags`).
     *
     * @private
     * @returns {_SignatureFlag} The active signature flags bitmask.
     */
    get _signatureFlag(): _SignatureFlag {
        return this._signFlag;
    }
    /**
     * Sets the form's signature flags and updates the `SigFlags` entry in the AcroForm dictionary.
     *
     * @private
     * @param {_SignatureFlag} value The signature flags bitmask to set.
     * @returns {void}
     */
    set _signatureFlag(value: _SignatureFlag) {
        if (value !== this._signFlag) {
            this._signFlag = value;
            this._dictionary.update('SigFlags', value);
        }
    }
    /**
     * Gets a value indicating whether the automatic field naming is enabled for form fields.
     *
     * @returns {boolean} Indicates if field auto naming is enabled.
     *
     * ```typescript
     * // Create new document.
     * let document: PdfDocument = new PdfDocument();
     * // Access loaded form
     * let form: PdfForm = document.form;
     * // Gets the value indicating if automatic field naming is enabled
     * let fieldAutoNaming: boolean = form.fieldAutoNaming;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get fieldAutoNaming(): boolean {
        return this._fieldAutoNaming;
    }
    /**
     * Sets a value indicating whether field auto-naming is enabled for form fields.
     *
     * @param {boolean} value Enable or disable field auto naming. The default value is false.
     * ```typescript
     * // Create a new document
     * let document: PdfDocument = new PdfDocument();
     * // Access loaded form
     * let form: PdfForm = document.form;
     * // Enable automatic field naming for new form fields.
     * form.fieldAutoNaming = true;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set fieldAutoNaming(value: boolean) {
        this._fieldAutoNaming = value;
    }
    /**
     * Gets the `PdfField` at the specified index.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the loaded form field
     * let field: PdfField = document.form.fieldAt(0);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {number} index Field index.
     * @returns {PdfField} Loaded PDF form field at the specified index.
     */
    public fieldAt(index: number): PdfField {
        if (index < 0 || index >= this._fields.length) {
            throw Error('Index out of range.');
        }
        let field: PdfField;
        if (this._parsedFields.has(index)) {
            field = this._parsedFields.get(index);
            this._isNeedAppearances = true;
        } else {
            let dictionary: _PdfDictionary;
            const ref: _PdfReference = this._fields[index]; // eslint-disable-line
            if (ref && ref instanceof _PdfReference) {
                dictionary = this._crossReference._fetch(ref);
            }
            if (dictionary) {
                field = this._parseFields(dictionary, ref);
                this._parsedFields.set(index, field);
                if (field && field instanceof PdfField) {
                    field._annotationIndex = index;
                }
            }
        }
        return field;
    }
    /**
     * Parses a terminal form field from its dictionary and reference, instantiating the appropriate
     * field type based on `FT` and `Ff` (e.g., text, button, choice, signature).
     *
     * @private
     * @param {_PdfDictionary} dictionary The field dictionary to parse.
     * @param {_PdfReference} reference The indirect reference of the field.
     * @returns {PdfField} The constructed field instance.
     */
    _parseFields(dictionary: _PdfDictionary, reference: _PdfReference): PdfField {
        let field: PdfField;
        if (dictionary) {
            const key: _PdfName = _getInheritableProperty(dictionary, 'FT', false, true, 'Parent');
            let fieldFlags: number = 0;
            const flag: number = _getInheritableProperty(dictionary, 'Ff', false, true, 'Parent');
            if (typeof flag !== 'undefined') {
                fieldFlags = flag;
            }
            if (key) {
                switch (key.name.toLowerCase()) {
                case 'tx':
                    field = PdfTextBoxField._load(this, dictionary, this._crossReference, reference);
                    break;
                case 'btn':
                    if ((fieldFlags & _FieldFlag.pushButton) !== 0) {
                        field = PdfButtonField._load(this, dictionary, this._crossReference, reference);
                    } else if ((fieldFlags & _FieldFlag.radio) !== 0) {
                        field = PdfRadioButtonListField._load(this, dictionary, this._crossReference, reference);
                    } else {
                        field = PdfCheckBoxField._load(this, dictionary, this._crossReference, reference);
                    }
                    break;
                case 'ch':
                    if ((fieldFlags & _FieldFlag.combo) !== 0) {
                        field = PdfComboBoxField._load(this, dictionary, this._crossReference, reference);
                    } else {
                        field = PdfListBoxField._load(this, dictionary, this._crossReference, reference);
                    }
                    break;
                case 'sig':
                    field = PdfSignatureField._load(this, dictionary, this._crossReference, reference);
                    break;
                }
            }
        }
        return field;
    }
    /**
     * Add a new `PdfField`.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Add a new form field
     * let index: number = document.form.add(field);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {PdfField} field Field object to add.
     * @returns {number} Field index.
     */
    public add(field: PdfField): number {
        if (this._fields.length > 0) {
            const fieldsCollection: PdfField[] = this._getFields();
            const old: PdfField = fieldsCollection.find(oldField => oldField.name === field.name); // eslint-disable-line
            if (old && this._fieldAutoNaming) {
                const newName: string = this._getCorrectName(field._name);
                field._name = newName;
                field._dictionary.update('T', newName);
                this._fieldName.push(field._name);
                return this._doAdd(field);
            } else if (old && ((old instanceof PdfSignatureField && (old._isLoaded
                       || old._crossReference._document._isLoaded)) ||
                       !(old instanceof PdfSignatureField)) && this._checkType(old, field)) {
                this._fieldName.push(field._name);
                return this._groupingFormFields(field, old);
            }
        }
        this._requiresPostProcessing = true;
        this._fieldName.push(field._name);
        return this._doAdd(field);
    }
    /**
     * Adds a field to the form, updates the AcroForm `Fields` array, caches the parsed field,
     * and sets appearance/signature flags when applicable.
     *
     * @private
     * @param {PdfField} field The field to add to the form.
     * @returns {number} The index of the added field in the form.
     */
    _doAdd(field: PdfField): number {
        this._fields.push(field._ref);
        this._dictionary.update('Fields', this._fields);
        this._parsedFields.set(this._fields.length - 1, field);
        field._form = this;
        this._crossReference._root._updated = true;
        if (field instanceof PdfSignatureField) {
            field._form._signatureFlag = _SignatureFlag.signatureExists | _SignatureFlag.appendOnly;
        }
        this._isNeedAppearances = true;
        return (this._fields.length - 1);
    }
    /**
     * Groups a new field with an existing field having the same name by wiring widget parents,
     * merging kids, syncing flags/appearance, and handling radio options/selection where needed.
     *
     * @private
     * @param {PdfField} field The new field to group.
     * @param {PdfField} oldField The existing field with the same name.
     * @returns {number} The index of the grouped field (existing field’s index).
     */
    _groupingFormFields(field: PdfField, oldField: PdfField): number {
        if (oldField._name === field._name) {
            if (oldField.flatten || field.flatten) {
                field.flatten = true;
                oldField.flatten = true;
            }
        }
        if (!(field instanceof PdfRadioButtonListField && oldField instanceof PdfRadioButtonListField)) {
            const widgetDictionary: _PdfDictionary = (field as PdfField).itemAt(0)._dictionary;
            if (widgetDictionary && widgetDictionary.has('Parent')) {
                delete widgetDictionary._map.Parent;
            }
            (field as PdfField).itemAt(0)._dictionary.set('Parent', oldField._ref);
            const fieldKidRef: _PdfReference = field.itemAt(0)._ref;
            let oldFieldKids: any = oldField._dictionary.get('Kids'); // eslint-disable-line
            if (oldFieldKids && oldFieldKids.length > 0) {
                oldFieldKids.push(fieldKidRef);
                oldField._dictionary.update('Kids', oldFieldKids);
                oldField._dictionary._updated = true;
            } else {
                this._updateFieldsKids(oldField, field);
            }
            if (field instanceof PdfCheckBoxField && oldField instanceof PdfCheckBoxField) {
                const newItem: PdfStateItem = field.itemAt(0) as PdfStateItem;
                let newValue: string;
                if (newItem && typeof newItem.exportValue === 'string') {
                    newValue = newItem.exportValue;
                }
                const appendedIndex: number = oldField.itemsCount - 1;
                oldField._parsedItems.set(appendedIndex, newItem);
                newItem._field = oldField;
                newItem._index = appendedIndex;
                if (!newValue && newValue !== '') {
                    return this._fields.length - 1;
                }
                const matchIndex: number = this._findFirstByExportValue(oldField, newValue);
                const groupHasSameExportValue: boolean = matchIndex >= 0;
                const oldSelectedValue: string = this._getSelectedExportValue(oldField);
                if (newItem.checked) {
                    if (groupHasSameExportValue) {
                        const matched: PdfStateItem = oldField.itemAt(matchIndex) as PdfStateItem;
                        if (matched && !matched.checked) {
                            matched._field._isUpdating = false;
                            matched.checked = true;
                        }
                        if (!newItem.checked) {
                            newItem.checked = true;
                        }
                    } else {
                        newItem.checked = true;
                    }
                } else {
                    if (oldSelectedValue && oldSelectedValue === newValue) {
                        newItem.checked = true;
                    } else if (groupHasSameExportValue) {
                        const matched: PdfStateItem = oldField.itemAt(matchIndex) as PdfStateItem;
                        if (matched && matched.checked && !newItem.checked) {
                            newItem.checked = true;
                        }
                    }
                }
                return this._fields.length - 1;
            }
            if ((field instanceof PdfButtonField && oldField instanceof PdfButtonField)) {
                if (!oldField._setAppearance) {
                    oldField._setAppearance = true;
                }
            }
            return this._fields.length - 1;
        } else {
            const baseDictionary: _PdfDictionary = oldField._dictionary;
            if (baseDictionary && baseDictionary.has('Opt')) {
                delete baseDictionary._map.Opt;
            }
            const _radioButtonGroupingFields: PdfField[] = [];
            _radioButtonGroupingFields.push(oldField);
            _radioButtonGroupingFields.push(field);
            let itemCount: number = 0;
            let globalSelectedIndex: number = -1;
            _radioButtonGroupingFields.forEach(field => { // eslint-disable-line
                if ((field as PdfRadioButtonListField).selectedIndex >= 0) {
                    const selectedItemIndex: number = itemCount + (field as PdfRadioButtonListField).selectedIndex;
                    if (selectedItemIndex > globalSelectedIndex) {
                        globalSelectedIndex = selectedItemIndex;
                    }
                }
                itemCount += field._kids.length;
            });
            if (oldField._kids.length !== oldField._parsedItems.size) {
                for (let j: number = 0; j < oldField._kids.length; j++) {
                    const existingItem: PdfRadioButtonListItem = oldField._parsedItems.get(j);
                    if (!existingItem || (existingItem as PdfRadioButtonListItem).value !== (oldField.itemAt(j) as
                                          PdfRadioButtonListItem).value) {
                        oldField._parsedItems.set(j, oldField.itemAt(j));
                    }
                }
            }
            let fieldKids: any = field._dictionary.get('Kids'); // eslint-disable-line
            if (fieldKids.length > 0) {
                let oldFieldKids: any = oldField._dictionary.get('Kids'); // eslint-disable-line
                let itemsCount: number = oldField.itemsCount;
                for (let i: number = 0; i < field.itemsCount; i++) {
                    const widgetDictionary: _PdfDictionary = (field as PdfField).itemAt(i)._dictionary;
                    if (widgetDictionary && widgetDictionary.has('Parent')) {
                        delete widgetDictionary._map.Parent;
                    }
                    widgetDictionary.set('Parent', oldField._ref);
                    field.itemAt(i)._field = oldField;
                    field.itemAt(i)._index = itemsCount++;
                    itemCount++;
                    const fieldKidRef: _PdfReference = field.itemAt(i)._ref;
                    oldFieldKids.push(fieldKidRef);
                }
                oldField._dictionary.update('Kids', oldFieldKids);
                oldField._dictionary._updated = true;
            }
            oldField.allowUnisonSelection = field.allowUnisonSelection;
            let count: number = oldField._parsedItems.size;
            for (let j: number = 0; j < field.itemsCount; j++) {
                oldField._parsedItems.set(count, field.itemAt(j));
                count++;
            }
            if (!field.allowUnisonSelection) {
                this._addItemsToOptionsArray(oldField);
            }
            if (_radioButtonGroupingFields.length > 0 && globalSelectedIndex >= 0 && globalSelectedIndex < itemCount) {
                (_radioButtonGroupingFields[0] as PdfRadioButtonListField).selectedIndex = globalSelectedIndex;
            }
            return this._fields.length - 1;
        }
    }
    /**
     * Finds the first item index within a checkbox field that has an `exportValue`
     * matching the provided `value`.
     *
     * @private
     * @param {PdfCheckBoxField} field The checkbox field to search.
     * @param {string} value The export value to match.
     * @returns {number} The index of the first matching item, or `-1` when not found.
     */
    _findFirstByExportValue(field: PdfCheckBoxField, value: string): number {
        if (!field || field.itemsCount <= 0 || value == null) {
            return -1;
        }
        for (let i: number = 0; i < field.itemsCount; i++) {
            const item: PdfStateItem = field.itemAt(i) as PdfStateItem;
            if (item && item.exportValue === value) {
                return i;
            }
        }
        return -1;
    }
    /**
     * Returns the export value of the currently selected item in a checkbox field.
     * If the field dictionary contains a `/V` entry it is returned first; otherwise
     * the checked state of individual `PdfStateItem`s is consulted.
     *
     * @private
     * @param {PdfCheckBoxField} field The checkbox field to query.
     * @returns {string} The selected export value, or `undefined` if none.
     */
    _getSelectedExportValue(field: PdfCheckBoxField): string {
        let exportValue: string;
        if (!field) {
            return undefined;
        }
        if (field._dictionary && field._dictionary.has('V')) {
            const v: _PdfName = field._dictionary.get('V');
            if (v && typeof v.name === 'string') {
                exportValue = v.name;
            }
        }
        for (let i: number = 0; i < field.itemsCount; i++) {
            const item: PdfStateItem = field.itemAt(i) as PdfStateItem;
            if (item && item.checked) {
                exportValue = item.exportValue;
            }
        }
        return exportValue;
    }
    /**
     * Converts a standalone field into a parent with `Kids` by creating a new parent dictionary,
     * moving relevant entries, and attaching both the old and new field widgets under it.
     *
     * @private
     * @param {PdfField} oldField The existing field that will become the parent.
     * @param {PdfField} newField The new field whose first widget is added as a kid.
     * @returns {void}
     */
    _updateFieldsKids(oldField: PdfField, newField: PdfField): void {
        const oldFieldDict: _PdfDictionary = oldField._dictionary;
        const newDict: _PdfDictionary = new _PdfDictionary(this._crossReference);
        const newFieldRef: _PdfReference = this._crossReference._getNextReference();
        const fieldKeys: string[] = ['FT', 'T', 'V', 'Ff', 'Opt', 'I', 'TU'];
        fieldKeys.forEach(key => { // eslint-disable-line
            if (oldFieldDict.has(key)) {
                newDict.update(key, oldFieldDict.get(key));
                delete oldFieldDict._map[key]; // eslint-disable-line
            }
        });
        oldField._dictionary._updated = true;
        oldFieldDict.set('Parent', newFieldRef);
        newField.itemAt(0)._dictionary.set('Parent', newFieldRef);
        const kidElements: _PdfReference[] = [];
        kidElements.push(oldField._ref);
        const fieldKidRef: _PdfReference = newField.itemAt(0)._ref;
        kidElements.push(fieldKidRef);
        newDict.update('Kids', kidElements);
        newDict._updated = true;
        this._crossReference._cacheMap.set(newFieldRef, newDict);
        const acroForm: any= this._crossReference._document._catalog._catalogDictionary.get('AcroForm'); // eslint-disable-line
        const fields: any = acroForm.get('Fields'); // eslint-disable-line
        const index: number = fields.indexOf(oldField._ref);
        if (index !== -1) {
            fields[<number>index] = newFieldRef;
        }
        oldField._ref = newFieldRef;
        oldField._dictionary = newDict;
        oldField._kids = newDict.get('Kids');
        oldField._dictionary._updated = true;
    }
    /**
     * Populates the `Opt` array for a radio button group when duplicate export values are present,
     * ensuring unique option entries for appearance resolution.
     *
     * @private
     * @param {PdfField} baseField The radio button field used to derive option values.
     * @returns {void}
     */
    _addItemsToOptionsArray (baseField: PdfField): void {
        const seenValues: Set<string> = new Set();
        const duplicateValues: Set<string> = new Set();
        const allValues: string[] = [];
        const radioField: PdfRadioButtonListField = baseField as PdfRadioButtonListField;
        for (let i: number = 0; i < radioField.itemsCount; i++) {
            const value: string = radioField.itemAt(i).value;
            allValues.push(value);
            if (seenValues.has(value)) {
                duplicateValues.add(value);
            } else {
                seenValues.add(value);
            }
        }
        if (duplicateValues.size > 0) {
            baseField._dictionary.set('Opt', allValues);
        }
    }
    /**
     * Computes a unique field name by appending a generated identifier when the base name already exists.
     *
     * @private
     * @param {string} name The proposed field name.
     * @returns {string} A unique field name derived from the input.
     */
    _getCorrectName(name: string): string {
        let correctName: string = name;
        const existingIndex: number = this._fieldName.indexOf(name);
        if (existingIndex !== -1) {
            const uid: string = this._generateUniqueIdentifier();
            correctName = `${name}_${uid}`;
        }
        return correctName;
    }
    /**
     * Generates a simple pseudo-random identifier string for field auto-naming.
     *
     * @private
     * @returns {string} The generated identifier.
     */
    _generateUniqueIdentifier(): string {
        return Math.floor(Math.random() * 10000).toString();
    }
    /**
     * Remove the specified PDF form field.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the loaded form field
     * let field: PdfField = document.form.fieldAt(3);
     * // Remove the form field
     * document.form.removeField(field);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {PdfField} field Field object to remove.
     * @returns {void} Nothing.
     */
    public removeField(field: PdfField): void {
        const index: number = this._fields.indexOf(field._ref);
        if (index >= 0) {
            this.removeFieldAt(index);
        }
    }
    /**
     * Remove the PDF form field from specified index.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Remove the form field from the specified index
     * document.form.removeFieldAt(3);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {number} index Field index to remove.
     * @returns {void} Nothing.
     */
    public removeFieldAt(index: number): void {
        const field: PdfField = this.fieldAt(index);
        if (field) {
            if (field._kidsCount > 0) {
                for (let i: number = field._kidsCount - 1; i >= 0; i--) {
                    const item: PdfWidgetAnnotation = field.itemAt(i);
                    let page: PdfPage;
                    if (item) {
                        page = item._getPage();
                        if (page) {
                            page._removeAnnotation(item._ref);
                        }
                    }
                }
            } else if (field._dictionary.has('Subtype') && field._dictionary.get('Subtype').name === 'Widget') {
                const page: PdfPage = field.page;
                if (page) {
                    page._removeAnnotation(field._ref);
                }
            }
            this._parsedFields.delete(index);
            this._reorderParsedAnnotations(index);
        }
        this._fields.splice(index, 1);
        const document: PdfDocument = this._crossReference._document;
        const catalog: _PdfCatalog = document._catalog;
        if (this._fields.length === 0 && document && catalog && catalog._catalogDictionary) {
            catalog._catalogDictionary._updated = true;
            this._crossReference._allowCatalog = true;
        }
        this._dictionary.set('Fields', this._fields);
        this._dictionary._updated = true;
    }
    /**
     * Rebuilds the parsed fields cache after a removal, compacting indices above the removed position.
     *
     * @private
     * @param {number} index The removed field index.
     * @returns {void}
     */
    _reorderParsedAnnotations(index: number): void {
        const result: Map<number, PdfField> = new Map<number, PdfField>();
        this._parsedFields.forEach((value: PdfField, key: number) => {
            if (key > index) {
                result.set(key - 1, value);
            } else {
                result.set(key, value);
            }
        });
        this._parsedFields = result;
    }
    /**
     * Sets the flag to indicate the new appearance creation
     * If true, appearance will not be created. Default appearance has been considered.
     * If false, new appearance stream has been created from field values and updated as normal appearance.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Set boolean flag to create a new appearance stream for form fields.
     * document.form.setDefaultAppearance(false);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {boolean} value Set default appearance.
     * @returns {void} Nothing.
     */
    public setDefaultAppearance(value: boolean): void {
        this._setAppearance = !value;
        this._needAppearances = value;
        this._isDefaultAppearance = value;
    }
    /**
     * Order the form fields.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Order the form fields.
     * document.form.orderFormFields();
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @returns {void}
     */
    public orderFormFields(): void
    /**
     * Order the form fields based on page tab order.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Order the form fields based on page tab order.
     * document.form.orderFormFields(PdfFormFieldsTabOrder.row);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {PdfFormFieldsTabOrder} tabOrder tab order types for form fields.
     * @returns {void}
     */
    public orderFormFields(tabOrder: PdfFormFieldsTabOrder): void
    /**
     * Order the form fields based on tab collection.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * //Set the tab collection to order the form fields.
     * let values: Map<number, PdfFormFieldsTabOrder> = new Map<number, PdfFormFieldsTabOrder>();
     * // Set the tab order for the page index 1.
     * values.set(1, PdfFormFieldsTabOrder.column);
     * // Set the tab order for the page index 2.
     * values.set(2, PdfFormFieldsTabOrder.row);
     * // Order the form fields based on tab collection.
     * document.form.orderFormFields(values);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {Map<number, PdfFormFieldsTabOrder>} tabCollection collection of tab order with page index.
     * @returns {void}
     */
    public orderFormFields(tabCollection: Map<number, PdfFormFieldsTabOrder>): void
    public orderFormFields(tabOrder?: PdfFormFieldsTabOrder | Map<number, PdfFormFieldsTabOrder>): void {
        if (tabOrder === null || typeof tabOrder === 'undefined') {
            this.orderFormFields(new Map<number, PdfFormFieldsTabOrder>());
        } else {
            let tab: _PdfName;
            const document: PdfDocument = this._crossReference._document;
            let value: PdfField[];
            if (tabOrder && tabOrder instanceof Map) {
                let setTabOrder: boolean = true;
                if (tabOrder.size > 0) {
                    this._tabCollection = tabOrder;
                } else {
                    setTabOrder = false;
                    this._tabCollection = tabOrder;
                }
                const fieldCollection: Map<number, PdfField[]> = new Map<number, PdfField[]>();
                this._fieldCollection = this._getFields();
                if (_isNullOrUndefined(this._fieldCollection) && this._fieldCollection.length > 0) {
                    const page: PdfPage = this._fieldCollection[0].page;
                    if (page && document) {
                        this._fieldCollection.forEach((field: PdfField) => {
                            if (field.page) {
                                const index: number = _getPageIndex(document, this._sortItemByPageIndex(field, true)._pageDictionary);
                                if (index >= 0) {
                                    if (fieldCollection.has(index)) {
                                        value = fieldCollection.get(index);
                                        value.push(field);
                                    } else {
                                        value = [];
                                        value.push(field);
                                        fieldCollection.set(index, value);
                                    }
                                    const page: PdfPage = document.getPage(index);
                                    if (!this._tabCollection.has(index)) {
                                        this._tabCollection.set(index, page.tabOrder);
                                    }
                                    if (setTabOrder) {
                                        page.tabOrder = this._tabCollection.get(index);
                                    }
                                }
                            }
                        });
                        let fieldsCount: number = 0;
                        fieldCollection.forEach((value: PdfField[], key: number) => {
                            this._tabOrder = this._tabCollection.get(key);
                            if (this._tabOrder !== PdfFormFieldsTabOrder.structure) {
                                const fields: PdfField[] = value;
                                fields.sort((pdfField1: object, pdfField2: object) => {
                                    return this._compareFields(pdfField1, pdfField2);
                                });
                                fields.forEach((field: PdfField, j: number) => {
                                    const fieldIndex: number = this._fieldCollection.indexOf(field);
                                    if (fieldIndex !== -1 && fieldIndex !== fieldsCount + j) {
                                        const fieldToMove: PdfField = this._fieldCollection[<number>fieldIndex];
                                        this._fieldCollection.splice(fieldIndex, 1);
                                        this._fieldCollection.splice(fieldsCount + j, 0, fieldToMove);
                                    }
                                });
                            }
                            fieldsCount += value.length;
                        });
                    }
                }
            } else {
                this._tabOrder = tabOrder as PdfFormFieldsTabOrder;
                tab = this._getOrder(this._tabOrder);
                this._fieldCollection = this._getFields();
                this._fieldCollection.sort((pdfField1: object, pdfField2: object) => {
                    return this._compareFields(pdfField1, pdfField2);
                });
            }
            this._parsedFields.clear();
            this._fieldCollection.forEach((field: PdfField, i: number) => {
                this._parsedFields.set(i, field);
                this._fields[<number>i] = field._ref;
                if (tab) {
                    field.page._pageDictionary.update('Tabs', tab);
                }
            });
            this._dictionary.update('Fields', this._fields);
        }
    }
    /**
     * Traverses the AcroForm field tree, collects terminal fields, repairs missing `Parent` links,
     * and initializes the form's field list and known form names.
     *
     * @private
     * @returns {void}
     */
    _createFields(): void {
        let fields: Array<any>; // eslint-disable-line
        const fieldsMap: Map<_PdfDictionary, _PdfReference> = new Map<_PdfDictionary, _PdfReference>();
        if (this._dictionary && this._dictionary.has('Fields')) {
            fields = this._dictionary.get('Fields');
        }
        let count: number = 0;
        const nodes: any[] = []; // eslint-disable-line
        const terminalFields: _PdfDictionary[] = [];
        while (fields && fields.length > 0) {
            for (; count < fields.length; count++) {
                const ref: _PdfReference = fields[count]; // eslint-disable-line
                let fieldDictionary: _PdfDictionary;
                if (ref && ref instanceof _PdfReference) {
                    fieldDictionary = this._crossReference._fetch(ref);
                    if (fieldDictionary && fieldDictionary instanceof _PdfDictionary) {
                        fieldsMap.set(fieldDictionary, ref);
                    }
                }
                let fieldKids: [];
                if (fieldDictionary && fieldDictionary instanceof _PdfDictionary && fieldDictionary.has('Kids')) {
                    fieldKids = fieldDictionary.get('Kids');
                    if (fieldKids && fieldKids.length > 0) {
                        fieldKids.forEach((reference: _PdfReference) => {
                            if (reference instanceof _PdfReference) {
                                const kidsDict: _PdfDictionary = this._crossReference._fetch(reference);
                                if (kidsDict) {
                                    fieldsMap.set(kidsDict, reference);
                                    if (!kidsDict.has('Parent')) {
                                        kidsDict.update('Parent', ref);
                                    }
                                }
                            }
                        });
                    }
                }
                if (!fieldKids) {
                    if (fieldDictionary && fieldDictionary instanceof _PdfDictionary) {
                        if (terminalFields.indexOf(fieldDictionary) === -1) {
                            terminalFields.push(fieldDictionary);
                            if (fieldDictionary.has('T')) {
                                const fieldName: string = fieldDictionary.get('T');
                                if (this._formNames.indexOf(fieldName) === -1) {
                                    this._formNames.push(fieldName);
                                }
                            }
                        }
                    }
                } else {
                    const isNode: boolean = (!fieldDictionary.has('FT')) || this._isNode(fieldKids);
                    if (isNode) {
                        nodes.push({ fields, count });
                        this._hasKids = true;
                        count = -1;
                        fields = fieldKids;
                    } else {
                        terminalFields.push(fieldDictionary);
                        if (fieldDictionary.has('T')) {
                            const fieldName: string = fieldDictionary.get('T');
                            if (this._formNames.indexOf(fieldName) === -1) {
                                this._formNames.push(fieldName);
                            }
                        }
                    }
                }
            }
            if (nodes.length === 0) {
                break;
            }
            const entry: any = nodes.pop(); // eslint-disable-line
            fields = entry.fields;
            count = entry.count + 1;
        }
        this._createFieldCollection(terminalFields, fieldsMap);
    }
    private _createFieldCollection(terminalFields: _PdfDictionary[], fieldsMap: Map<_PdfDictionary, _PdfReference>): void {
        const pageWidgets: Map<number, _PdfDictionary[]> = new Map();
        const document: PdfDocument = this._crossReference._document;
        const widgetCollection: _PdfReference[] = [];
        if (document) {
            for (let i: number = 0; i < document.pageCount; i++) {
                const page: PdfPage = document.getPage(i);
                if (!page || !page._pageDictionary) {
                    continue;
                }
                const pageDictionary: _PdfDictionary = page._pageDictionary;
                let widgetAnnots: _PdfReference[] = [];
                if (pageDictionary && pageDictionary.has('Annots')) {
                    widgetAnnots = pageDictionary.getRaw('Annots');
                    if (widgetAnnots instanceof _PdfReference) {
                        widgetAnnots = this._crossReference._fetch(widgetAnnots);
                    }
                }
                const widgets: _PdfDictionary[] = [];
                if (widgetAnnots && Array.isArray(widgetAnnots) && widgetAnnots.length > 0) {
                    for (let j: number = 0; j < widgetAnnots.length; j++) {
                        const ref: _PdfReference = widgetAnnots[<number>j];
                        if (ref && ref instanceof _PdfReference) {
                            widgetCollection.push(ref);
                            const annotDictionary: _PdfDictionary = this._crossReference._fetch(ref);
                            if (annotDictionary && annotDictionary.has('Subtype') &&
                                annotDictionary.get('Subtype').name === 'Widget') {
                                annotDictionary._reference = ref;
                                widgets.push(annotDictionary);
                            }
                        }
                    }
                    pageWidgets.set(i, widgets);
                }
            }
        }
        for (let i: number = 0; i < terminalFields.length; i++) {
            const fieldDictionary: _PdfDictionary = terminalFields[<number>i];
            const fieldRef: _PdfReference = fieldsMap.get(fieldDictionary);
            if (fieldRef && this._removeInvalidFields(fieldDictionary, pageWidgets, fieldRef, widgetCollection)) {
                if (this._fields.indexOf(fieldRef) === -1) {
                    this._fields.push(fieldRef);
                }
            }
        }
        if (terminalFields.length > 0) {
            this._processRemainingWidgets();
        }
    }
    private _processRemainingWidgets(): void {
        const document: PdfDocument = this._crossReference._document;
        for (let i: number = 0; i < document.pageCount; i++) {
            const page: PdfPage = document.getPage(i);
            if (!page || !page._pageDictionary) {
                continue;
            }
            const pageDictionary: _PdfDictionary = page._pageDictionary;
            let widgetAnnots: _PdfReference[] = [];
            if (pageDictionary.has('Annots')) {
                widgetAnnots = pageDictionary.getRaw('Annots');
                if (widgetAnnots instanceof _PdfReference) {
                    widgetAnnots = this._crossReference._fetch(widgetAnnots);
                }
            }
            for (let j: number = 0; j < widgetAnnots.length; j++) {
                const ref: _PdfReference = widgetAnnots[<number>j];
                if (ref instanceof _PdfReference && this._fields.indexOf(ref) === -1) {
                    const annotDictionary: _PdfDictionary = this._crossReference._fetch(ref);
                    if (annotDictionary &&
                        annotDictionary.has('Subtype') &&
                        annotDictionary.get('Subtype') &&
                        annotDictionary.get('Subtype').name === 'Widget' &&
                        annotDictionary.has('P')
                    ) {
                        if (annotDictionary.has('Parent')) {
                            const parentRef: _PdfReference = annotDictionary.getRaw('Parent');
                            let annotationParentDictionary: _PdfDictionary;
                            if (parentRef && parentRef instanceof _PdfReference) {
                                annotationParentDictionary = this._crossReference._fetch(parentRef);
                                if (annotationParentDictionary && annotationParentDictionary.has('T')) {
                                    const parentValue: string = annotationParentDictionary.get('T');
                                    if (this._formNames.indexOf(parentValue) === -1 && this._fields.indexOf(parentRef) === -1) {
                                        this._fields.push(parentRef);
                                    }
                                }
                            }
                        } else if (annotDictionary.has('FT') && annotDictionary.has('T') && this._formNames.indexOf(annotDictionary.get('T')) === -1) {
                            this._fields.push(ref);
                        }
                    }
                }
            }
        }
    }
    /**
     * Checks whether a field dictionary contains a non-empty `Kids` array.
     *
     * @private
     * @param {_PdfDictionary} dictionary The field dictionary to inspect.
     * @returns {boolean} Returns `true` if `Kids` exists and is non-empty; otherwise, `false`.
     */
    _hasValidKids(dictionary: _PdfDictionary): boolean {
        const kidsArray: any[] = dictionary.get('Kids'); // eslint-disable-line
        return kidsArray && kidsArray.length > 0;
    }
    /**
     * Validates a field (and its descendants) against the page widget lists, removing any invalid
     * kid references and determining whether the field has at least one valid descendant.
     *
     * @private
     * @param {_PdfDictionary} dictionary The field or node dictionary.
     * @param {Map<number, _PdfDictionary[]>} pageWidgets A mapping of page index to widget dictionaries.
     * @param {_PdfReference} ref The reference of the current field/widget.
     * @param {_PdfReference[]} widgetCollection Flat list of widget references found in pages.
     * @returns {boolean} Returns `true` if the field or any child remains valid; otherwise, `false`.
     */
    _removeInvalidFields(dictionary: _PdfDictionary, pageWidgets: Map<number, _PdfDictionary[]>, ref: _PdfReference,
                         widgetCollection: _PdfReference[]): boolean {
        if (!dictionary) {
            return false;
        }
        if (dictionary.has('Kids') && this._hasValidKids(dictionary)) {
            const kidsArray: any[] = dictionary.get('Kids'); // eslint-disable-line
            const invalidKids: number[] = [];
            let hasValidChild: boolean = false;
            for (let i: number = 0; i < kidsArray.length; i++) {
                let childDictionary: _PdfDictionary;
                const kidRef: any = kidsArray[<number>i]; // eslint-disable-line
                if (kidRef instanceof _PdfReference) {
                    childDictionary = this._crossReference._fetch(kidRef);
                } else if (kidRef instanceof _PdfDictionary) {
                    childDictionary = kidRef;
                }
                if (childDictionary) {
                    if (childDictionary.has('P')) {
                        const pageRef: any = childDictionary.get('P'); // eslint-disable-line
                        let pageDictionary: _PdfDictionary;
                        if (pageRef instanceof _PdfReference) {
                            pageDictionary = this._crossReference._fetch(pageRef);
                        } else if (pageRef instanceof _PdfDictionary) {
                            pageDictionary = pageRef;
                        }
                        if (pageDictionary && pageDictionary.has('Annots')) {
                            let annots: any = pageDictionary.get('Annots'); // eslint-disable-line
                            if (annots instanceof _PdfReference) {
                                annots = this._crossReference._fetch(annots);
                            }
                            if (annots && Array.isArray(annots)) {
                                const kidExists: boolean = annots.indexOf(kidRef) !== -1;
                                if (!kidExists) {
                                    invalidKids.push(i);
                                    continue;
                                }
                            }
                        }
                    }
                    const isChildValid: boolean = this._removeInvalidFields(childDictionary, pageWidgets, kidRef, widgetCollection);
                    if (isChildValid) {
                        hasValidChild = true;
                    } else {
                        invalidKids.push(i);
                    }
                } else {
                    invalidKids.push(i);
                }
            }
            for (let i: number = invalidKids.length - 1; i >= 0; i--) {
                kidsArray.splice(invalidKids[<number>i], 1);
            }
            if (kidsArray.length > 0 && hasValidChild) {
                dictionary.update('Kids', kidsArray);
                return true;
            }
            return false;
        } else {
            return this._validateField(dictionary, pageWidgets, ref, widgetCollection);
        }
    }
    /**
     * Determines whether a terminal field dictionary represents a valid widget by checking for
     * page and rectangle entries or by matching against known page widgets.
     *
     * @private
     * @param {_PdfDictionary} fieldDictionary The terminal field dictionary to validate.
     * @param {Map<number, _PdfDictionary[]>} pageWidgets A mapping of page index to widget dictionaries.
     * @param {_PdfReference} ref The reference of the field/widget under validation.
     * @param {_PdfReference[]} widgetCollection Flat list of widget references found in pages.
     * @returns {boolean} Returns `true` if the field is valid; otherwise, `false`.
     */
    _validateField(fieldDictionary: _PdfDictionary, pageWidgets: Map<number, _PdfDictionary[]>, ref: _PdfReference,
                   widgetCollection: _PdfReference[]): boolean {
        if (!fieldDictionary || !pageWidgets) {
            return false;
        }
        if (fieldDictionary.has('P') && fieldDictionary.has('Rect')) {
            return true;
        }
        if (widgetCollection && widgetCollection.indexOf(ref) !== -1) {
            return true;
        }
        pageWidgets.forEach((widgets: _PdfDictionary[], pageIndex: number) => { // eslint-disable-line
            if (widgets && widgets.length > 0) {
                for (let j: number = 0; j < widgets.length; j++) {
                    const widget: _PdfDictionary = widgets[<number>j];
                    if (widget && this._compareWidgets(widget, fieldDictionary)) {
                        if (this._fields.indexOf(widget._reference) === -1) {
                            this._fields.push(widget._reference);
                        }
                        return;
                    }
                }
            }
        });
        return false;
    }
    _compareWidgets(widget: _PdfDictionary, annotDictionary: _PdfDictionary): boolean {
        if (!widget || !annotDictionary) {
            return false;
        }
        if (!(widget.has('FT') && annotDictionary.has('FT'))) {
            return false;
        }
        const widgetType: _PdfName = widget.get('FT');
        const annotType: _PdfName = annotDictionary.get('FT');
        if (widgetType && annotType && widgetType.name !== annotType.name) {
            return false;
        }
        let widgetName: string;
        let annotName: string;
        if (widget.has('T')) {
            widgetName = widget.get('T');
        }
        if (annotDictionary.has('T')) {
            annotName = annotDictionary.get('T');
        }
        if (widgetName && annotName && widgetName !== annotName) {
            return false;
        }
        let widgetValue: any; // eslint-disable-line
        let annotValue: any; // eslint-disable-line
        if (widget.has('V')) {
            widgetValue = widget.get('V');
        }
        if (annotDictionary.has('V')) {
            annotValue = annotDictionary.get('V');
        }
        if (typeof widgetValue === 'string' && typeof annotValue === 'string') {
            return true;
        } else if (widgetValue instanceof _PdfName && annotValue instanceof _PdfName && widgetValue.name === annotValue.name) {
            return true;
        }
        return false;
    }
    /**
     * Determines whether the provided `Kids` collection represents a non widget node
     * (i.e., its first child is not a `Widget` subtype).
     *
     * @private
     * @param {any[]} kids The array of kid dictionaries or references.
     * @returns {boolean} Returns `true` if the entry is a non terminal node; otherwise, `false`.
     */
    _isNode(kids: Array<any>) : boolean { // eslint-disable-line
        let isNode: boolean = false;
        if (_isNullOrUndefined(kids) && kids.length > 0) {
            const entry: any = kids[0]; // eslint-disable-line
            let dictionary: _PdfDictionary;
            if (_isNullOrUndefined(entry)) {
                if (entry instanceof _PdfDictionary) {
                    dictionary = entry;
                } else if (entry instanceof _PdfReference) {
                    dictionary = this._crossReference._fetch(entry);
                }
            }
            if (dictionary && dictionary.has('Subtype')) {
                const subtype: _PdfName = dictionary.get('Subtype');
                if (subtype && subtype.name !== 'Widget') {
                    isNode = true;
                }
            }
        }
        return isNode;
    }
    /**
     * Enumerates and collects all widget annotation references for the form's fields,
     * traversing each field’s `Kids` or the field itself when no children are present.
     *
     * @private
     * @returns {Array<_PdfReference>} The array of widget references.
     */
    _parseWidgetReferences(): Array<_PdfReference> {
        if (typeof this._widgetReferences === 'undefined' && this.count > 0) {
            this._widgetReferences = [];
            this._fields.forEach((fieldReference: _PdfReference) => {
                const dictionary: _PdfDictionary = this._crossReference._fetch(fieldReference);
                if (dictionary) {
                    if (dictionary.has('Kids')) {
                        const fieldKids: [] = dictionary.get('Kids');
                        if (fieldKids && fieldKids.length > 0) {
                            fieldKids.forEach((kidReference: any) => { // eslint-disable-line
                                let kidDictionary: _PdfDictionary;
                                if (kidReference && kidReference instanceof _PdfDictionary) {
                                    kidDictionary = kidReference;
                                } else if (kidReference && kidReference instanceof _PdfReference) {
                                    kidDictionary = this._crossReference._fetch(kidReference);
                                }
                                if (kidDictionary && kidDictionary.has('Subtype')) {
                                    const subtype: _PdfName = kidDictionary.get('Subtype');
                                    if (subtype && subtype.name === 'Widget') {
                                        this._widgetReferences.push(kidReference);
                                    }
                                }
                            });
                        }
                    } else {
                        this._widgetReferences.push(fieldReference);
                    }
                }
            });
        }
        return this._widgetReferences;
    }
    /**
     * Performs post-processing for all fields: applies tab order re arrangement (when manual),
     * generates appearances or flattens as required, and removes fields flattened for the specified page.
     *
     * @private
     * @param {boolean} isFlatten When `true`, flatten field appearances into the page content.
     * @param {PdfPage} [pageToImport] Optional page context to restrict processing/removal.
     * @returns {void}
     */
    _doPostProcess(isFlatten: boolean, pageToImport?: PdfPage): void {
        for (let i: number = this.count - 1; i >= 0; i--) {
            const field: PdfField = this.fieldAt(i);
            if (field && !field._isLoaded && typeof field._tabIndex !== 'undefined' && field._tabIndex >= 0) {
                const page: PdfPage = field._page;
                if (page &&
                    page._pageDictionary.has('Annots') &&
                    (page.tabOrder === PdfFormFieldsTabOrder.manual ||  this._tabOrder === PdfFormFieldsTabOrder.manual)) {
                    const annots: _PdfReference[] = page._pageDictionary.get('Annots');
                    const annotationCollection: PdfAnnotationCollection = new PdfAnnotationCollection(annots, this._crossReference, page);
                    page._annotations = annotationCollection;
                    for (let i: number = 0; i < field.itemsCount; i++) {
                        const item: PdfWidgetAnnotation = field.itemAt(i);
                        if (item && item instanceof PdfWidgetAnnotation) {
                            let index: number = annots.indexOf(item._ref);
                            if (index < 0) {
                                index = field._annotationIndex;
                            }
                            if (index >= 0) {
                                const annotations: _PdfReference[] = page.annotations._reArrange(field._ref, field._tabIndex, index);
                                page._pageDictionary.update('Annots', annotations);
                                page._pageDictionary._updated = true;
                            }
                        }
                    }
                }
            }
            if (field && ((pageToImport && field.page === pageToImport) || !pageToImport)) {
                if (pageToImport) {
                    field._isImport = true;
                }
                field._doPostProcess(isFlatten || field.flatten);
                if (!isFlatten && field.flatten || (isFlatten && pageToImport && field.page === pageToImport)) {
                    this.removeFieldAt(i);
                }
            }
        }
    }
    /**
     * Resolves a field's index by matching against stored names, indexed names, actual names,
     * and indexed actual names.
     *
     * @private
     * @param {string} name The field name to locate.
     * @returns {number} The matching field index, or `-1` if not found.
     */
    _getFieldIndex(name: string): number {
        let index: number = -1;
        if (this.count > 0) {
            if (!this._fieldNames) {
                this._fieldNames = [];
            }
            if (!this._indexedFieldNames) {
                this._indexedFieldNames = [];
            }
            if (!this._actualFieldNames) {
                this._actualFieldNames = [];
            }
            if (!this._indexedActualFieldNames) {
                this._indexedActualFieldNames = [];
            }
            for (let i: number = 0; i < this.count; i++) {
                const field: PdfField = this.fieldAt(i);
                if (field) {
                    const fieldName: string = field.name;
                    if (fieldName) {
                        this._fieldNames.push(fieldName);
                        this._indexedFieldNames.push(fieldName.split('[')[0]);
                    }
                    const actualName: string = field.actualName;
                    if (actualName) {
                        this._actualFieldNames.push(actualName);
                        this._indexedActualFieldNames.push(actualName.split('[')[0]);
                    }
                }
            }
            let nameIndex: number = this._fieldNames.indexOf(name);
            if (nameIndex !== -1) {
                index = nameIndex;
            } else {
                nameIndex = this._indexedFieldNames.indexOf(name);
                if (nameIndex !== -1) {
                    index = nameIndex;
                } else {
                    nameIndex = this._actualFieldNames.indexOf(name);
                    if (nameIndex !== -1) {
                        index = nameIndex;
                    } else {
                        nameIndex = this._indexedActualFieldNames.indexOf(name);
                        if (nameIndex !== -1) {
                            index = nameIndex;
                        }
                    }
                }
            }
        }
        return index;
    }
    /**
     * Materializes and returns all parsed `PdfField` instances for the current form.
     *
     * @private
     * @returns {PdfField[]} The array of loaded fields.
     */
    _getFields(): PdfField[] {
        const fields: PdfField[] = [];
        for (let i: number = 0; i < this._fields.length; i++) {
            const field: PdfField = this.fieldAt(i);
            if (field && field instanceof PdfField) {
                fields.push(field);
            }
        }
        return fields;
    }
    /**
     * Maps a tab order enumeration to its corresponding name object (`'R'`, `'C'`, `'S'`), or `null` for `none`.
     *
     * @private
     * @param {PdfFormFieldsTabOrder} tabOrder The tab order mode.
     * @returns {_PdfName} The corresponding name entry, or `null` if none.
     */
    _getOrder(tabOrder: PdfFormFieldsTabOrder): _PdfName {
        if (tabOrder !== PdfFormFieldsTabOrder.none) {
            let tabs: string = '';
            if (tabOrder === PdfFormFieldsTabOrder.row) {
                tabs = 'R';
            } else if (tabOrder === PdfFormFieldsTabOrder.column) {
                tabs = 'C';
            } else if (tabOrder === PdfFormFieldsTabOrder.structure) {
                tabs = 'S';
            }
            return _PdfName.get(tabs);
        }
        return null;
    }
    /**
     * Compares two fields for ordering based on page index and the current tab order mode
     * (`row`, `column`, `manual`, `none`, `structure`, `widget`).
     *
     * @private
     * @param {any} field1 The first field to compare.
     * @param {any} field2 The second field to compare.
     * @returns {number} A negative value if `field1` precedes `field2`, positive if after, or `0` if equal.
     */
    _compareFields(field1: any, field2: any): number { // eslint-disable-line
        let result: number = 0;
        let xdiff: number;
        let index: number;
        const page1: PdfPage = field1.page;
        const page2: PdfPage = field2.page;
        if (page1 && !page1._isNew && page1 instanceof PdfPage && page2 && !page2._isNew && page2 instanceof PdfPage) {
            const page1Index: number = this._sortItemByPageIndex(field1, false)._pageIndex;
            const page2Index: number = this._sortItemByPageIndex(field2, false)._pageIndex;
            let rectangle1: number[];
            if (field1._dictionary.has('Kids')) {
                rectangle1 = this._getItemRectangle(field1);
            } else {
                rectangle1 = this._getRectangle(field1._dictionary);
            }
            let rectangle2: number[];
            if (field2._dictionary.has('Kids')) {
                rectangle2 = this._getItemRectangle(field2);
            } else {
                rectangle2 = this._getRectangle(field2._dictionary);
            }
            const firstHeight: number = rectangle1[3] - rectangle1[1];
            const secondHeight: number = rectangle2[3] - rectangle2[1];
            if (rectangle1 && rectangle1.length >= 2 && rectangle2 && rectangle2.length >= 2) {
                const x1: number = rectangle1[0];
                const y1: number = rectangle1[1];
                const x2: number = rectangle2[0];
                const y2: number = rectangle2[1];
                if (typeof x1 === 'number' && typeof x2 === 'number' &&
                    typeof y1 === 'number' && typeof y2 === 'number') {
                    index = page1Index - page2Index;
                    if (this._tabOrder === PdfFormFieldsTabOrder.row) {
                        xdiff = this._compare(y2, y1);
                        if (xdiff !== 0) {
                            let isValid: boolean = xdiff === -1 && y1 > y2 && (y1 - firstHeight / 2) < y2;
                            isValid = isValid || (xdiff === 1 && y2 > y1 && (y2 - secondHeight / 2) < y1);
                            if (isValid) {
                                xdiff = 0;
                            }
                        }
                        if (index !== 0) {
                            result = index;
                        } else if (xdiff !== 0) {
                            result = xdiff;
                        } else {
                            result = this._compare(x1, x2);
                        }
                    } else if (this._tabOrder === PdfFormFieldsTabOrder.column) {
                        xdiff = this._compare(x1, x2);
                        if (index !== 0) {
                            result = index;
                        } else if (xdiff !== 0) {
                            result = xdiff;
                        } else {
                            result = this._compare(y2, y1);
                        }
                    } else if (this._tabOrder === PdfFormFieldsTabOrder.manual ||
                            this._tabOrder === PdfFormFieldsTabOrder.none ||
                            this._tabOrder === PdfFormFieldsTabOrder.structure ||
                            this._tabOrder === PdfFormFieldsTabOrder.widget) {
                        if (field1 instanceof PdfField && field2 instanceof PdfField) {
                            const field1Index: number = field1.tabIndex;
                            const field2Index: number = field2.tabIndex;
                            xdiff = this._compare(field1Index, field2Index);
                            if (index !== 0) {
                                result = index;
                            } else {
                                result = xdiff;
                            }
                        }
                    }
                }
            }
        }
        return result;
    }
    /**
     * Retrieves the `Rect` array from the specified dictionary.
     *
     * @private
     * @param {_PdfDictionary} dictionary The dictionary containing a `Rect` entry.
     * @returns {number[]} The rectangle `[x1, y1, x2, y2]`, or `undefined` if absent.
     */
    _getRectangle(dictionary: _PdfDictionary): number[] {
        let rect: number[];
        if (dictionary && dictionary.has('Rect')) {
            rect = dictionary.getArray('Rect');
        }
        return rect;
    }
    /**
     * Gets a representative widget rectangle for a field with kids, preferring the first widget
     * when multiple widgets are present.
     *
     * @private
     * @param {PdfField} field The field whose widget rectangle is requested.
     * @returns {number[]} The widget rectangle `[x1, y1, x2, y2]`, or `undefined` if unavailable.
     */
    _getItemRectangle(field: PdfField): number[] {
        let result: number[];
        const dictionary: _PdfDictionary = field._dictionary;
        if (dictionary.has('Kids')) {
            const kids: _PdfDictionary[] = dictionary.getArray('Kids');
            if (_isNullOrUndefined(kids) && kids.length >= 1) {
                if (kids.length === 1) {
                    result = this._getRectangle(kids[0]);
                } else {
                    if (field && field.itemsCount > 1) {
                        result = this._getRectangle(field.itemAt(0)._dictionary);
                    } else {
                        result = this._getRectangle(kids[0]);
                    }
                }
            }
        }
        return result;
    }
    /**
     * Compares two numeric values.
     *
     * @private
     * @param {number} x The first number.
     * @param {number} y The second number.
     * @returns {number} Returns `1` if `x > y`, `-1` if `x < y`, otherwise `0`.
     */
    _compare(x: number, y: number): number {
        if (x > y) {
            return 1;
        } else if (x < y) {
            return -1;
        } else {
            return 0;
        }
    }
    /**
     * Compares two widget references by their rectangles according to the current tab order.
     *
     * @private
     * @param {_PdfReference} x The first widget reference.
     * @param {_PdfReference} y The second widget reference.
     * @returns {number} A negative, positive, or zero value indicating relative order.
     */
    _compareKidsElement(x: _PdfReference, y: _PdfReference): number {
        const xDictionary: _PdfDictionary = this._crossReference._fetch(x);
        const yDictionary: _PdfDictionary = this._crossReference._fetch(y);
        const xRect: number[] = this._getRectangle(xDictionary);
        const yRect: number[] = this._getRectangle(yDictionary);
        let result: number;
        if (xRect && xRect.length >= 2 && yRect && yRect.length >= 2) {
            const x1: number = xRect[0];
            const y1: number = xRect[1];
            const x2: number = yRect[0];
            const y2: number = yRect[1];
            if (typeof x1 === 'number' && typeof x2 === 'number' &&
                typeof y1 === 'number' && typeof y2 === 'number') {
                let xdiff: number;
                if (this._tabOrder === PdfFormFieldsTabOrder.row) {
                    xdiff = this._compare(y2, y1);
                    if (xdiff !== 0) {
                        result = xdiff;
                    } else {
                        result = this._compare(x1, x2);
                    }
                } else if (this._tabOrder === PdfFormFieldsTabOrder.column) {
                    xdiff = this._compare(x1, x2);
                    if (xdiff !== 0) {
                        result = xdiff;
                    } else {
                        result = this._compare(y2, y1);
                    }
                } else {
                    result = 0;
                }
                return result;
            }
        }
        return result;
    }
    /**
     * Sorts a field's items by page/tab order and returns the effective page used for ordering.
     *
     * @private
     * @param {PdfField} field The field whose items should be sorted.
     * @param {boolean} hasPageTabOrder When `true`, uses the page's tab order for sorting.
     * @returns {PdfPage} The page used to determine ordering.
     */
    _sortItemByPageIndex(field: PdfField, hasPageTabOrder: boolean): PdfPage {
        let page: PdfPage = field.page;
        const tabOrder: PdfFormFieldsTabOrder = this._tabOrder;
        this._tabOrder = hasPageTabOrder ? field.page.tabOrder : tabOrder;
        this._sortFieldItems(field);
        if (field._isLoaded && field._kidsCount > 1) {
            page = field.itemAt(0).page;
        }
        this._tabOrder = tabOrder;
        if (typeof page === 'undefined') {
            page = field.page;
        }
        return page;
    }
    /**
     * Sorts the parsed items of supported fields (text, list box, checkbox, radio) using
     * the current tab order comparator.
     *
     * @private
     * @param {PdfField} field The field whose items are to be sorted.
     * @returns {void}
     */
    _sortFieldItems(field: PdfField): void {
        if (field._isLoaded && (field instanceof PdfTextBoxField ||
            field instanceof PdfListBoxField ||
            field instanceof PdfCheckBoxField ||
            field instanceof PdfRadioButtonListField)) {
            const collection: any[] = field._parseItems(); // eslint-disable-line
            collection.sort((item1: any, item2: any) => { // eslint-disable-line
                return this._compareFieldItem(item1, item2);
            });
            field._parsedItems.clear();
            collection.forEach((item: any, i: number) => { // eslint-disable-line
                field._parsedItems.set(i, item);
            });
        }
    }
    /**
     * Compares two field items by page index and rectangle, honoring the current tab order
     * `row` or `column`.
     *
     * @private
     * @param {any} item1 The first item to compare.
     * @param {any} item2 The second item to compare.
     * @returns {number} A negative, positive, or zero value indicating relative order.
     */
    _compareFieldItem(item1: any, item2: any): number { // eslint-disable-line
        let result: number = 0;
        if (typeof item1 !== 'undefined' && typeof item2 !== 'undefined') {
            const page1: PdfPage = item1.page;
            const page2: PdfPage = item2.page;
            const array1: number[] = this._getRectangle(item1._dictionary);
            const array2: number[] = this._getRectangle(item2._dictionary);
            if (array1 && array2) {
                const x1: number = array1[0];
                const y1: number = array1[1];
                const x2: number = array2[0];
                const y2: number = array2[1];
                let xdiff: number;
                if (this._tabOrder === PdfFormFieldsTabOrder.row) {
                    xdiff = this._compare(page1._pageIndex, page2._pageIndex);
                    if (xdiff !== 0) {
                        result = xdiff;
                    } else {
                        xdiff = this._compare(y2, y1);
                        if (xdiff !== 0) {
                            result = xdiff;
                        } else {
                            result = this._compare(x1, x2);
                        }
                    }
                } else if (this._tabOrder === PdfFormFieldsTabOrder.column) {
                    xdiff = this._compare(page1._pageIndex, page2._pageIndex);
                    if (xdiff !== 0) {
                        result = xdiff;
                    } else {
                        xdiff = this._compare(x1, x2);
                        if (xdiff !== 0) {
                            result = xdiff;
                        } else {
                            result = this._compare(y2, y1);
                        }
                    }
                }
            }
        }
        return result;
    }
    /**
     * Clears the form’s field reference list and the parsed field cache.
     *
     * @private
     * @returns {void}
     */
    _clear(): void {
        this._fields = [];
        this._parsedFields = new Map();
    }
    /**
     * Checks whether two fields are of the same field class (e.g., both text, both radio).
     *
     * @private
     * @param {PdfField} field1 The first field.
     * @param {PdfField} field2 The second field.
     * @returns {boolean} Returns `true` if the field types are compatible; otherwise, `false`.
     */
    _checkType(field1: PdfField, field2: PdfField): boolean {
        return (field1 instanceof PdfTextBoxField && field2 instanceof PdfTextBoxField) ||
            (field1 instanceof PdfButtonField && field2 instanceof PdfButtonField) ||
            (field1 instanceof PdfCheckBoxField && field2 instanceof PdfCheckBoxField) ||
            (field1 instanceof PdfComboBoxField && field2 instanceof PdfComboBoxField) ||
            (field1 instanceof PdfListBoxField && field2 instanceof PdfListBoxField) ||
            (field1 instanceof PdfRadioButtonListField && field2 instanceof PdfRadioButtonListField) ||
            (field1 instanceof PdfSignatureField && field2 instanceof PdfSignatureField);
    }
}

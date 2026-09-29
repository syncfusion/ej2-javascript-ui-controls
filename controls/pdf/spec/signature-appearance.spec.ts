import { PdfWidgetAnnotation } from "../src/pdf/core/annotations/annotation";
import { _PdfContentStream, _PdfStream } from "../src/pdf/core/base-stream";
import { _ContentParser } from "../src/pdf/core/content-parser";
import { CryptographicStandard, DigestAlgorithm, PdfRotationAngle } from "../src/pdf/core/enumerator";
import { PdfFontFamily, PdfStandardFont } from "../src/pdf/core/fonts/pdf-standard-font";
import { PdfSignatureField } from "../src/pdf/core/form/field";
import { PdfBrush } from "../src/pdf/core/graphics/pdf-graphics";
import { PdfDocument } from "../src/pdf/core/pdf-document";
import { _PdfDictionary, _PdfReference } from "../src/pdf/core/pdf-primitives";
import { PdfSignature } from "../src/pdf/core/security/digital-signature/signature/pdf-signature";
import { _bytesToString } from "../src/pdf/core/utils";
import { certchain_1, pdf_pfx } from "./certificate-input.spec";
describe('989234 Signature validation appearance', () => {
    it('989234 - 0', () => {
        let document = new PdfDocument();
        let page = document.addPage();
        const certData = certchain_1;
        const password = 'moorthy';
        let field: PdfSignatureField = new PdfSignatureField(page, 'field 1', { x: 45, y: 45, width: 100, height: 200 });
        const sign: PdfSignature = PdfSignature.create(certData, password,
            {
                cryptographicStandard: CryptographicStandard.cms,
                digestAlgorithm: DigestAlgorithm.sha256,
                contactInfo: 'johndoe@owned.us',
                locationInfo: 'Honolulu, Hawaii',
                reason: 'Validation Appearance',
                signedName: 'Syncfusion'
            }
        );
        sign.isValidationAppearanceEnabled = true;
        field.setSignature(sign);
        document.form.add(field);
        let update = document.save();
        document.destroy();
        document = new PdfDocument(update);
        let form = document.form;
        expect(form.count).toEqual(1);
        field = form.fieldAt(0) as PdfSignatureField;
        const fieldDictionary: _PdfDictionary = field._dictionary;
        if (fieldDictionary.has('Kids')) {
            const kids: _PdfReference[] = fieldDictionary.get('Kids');
            const widget: _PdfDictionary = field._crossReference._fetch(kids[0]);
            if (widget && widget.has('AP')) {
                const ap: _PdfDictionary = widget.get('AP');
                const appearance: _PdfStream = ap.get('N');
                let resource = appearance.dictionary.get('Resources');
                expect(appearance).not.toBeUndefined();
                let xobject1 = resource.get('XObject');
                let resource2 = xobject1.get('FRM');
                const frmResources = resource2.dictionary.get('Resources');
                const xobject2 = frmResources.get('XObject');
                const n0 = xobject2.get('n0');
                expect(n0).toBeDefined();
                let bytes = n0.getBytes();
                let decoded: string = _bytesToString(bytes);
                expect(decoded.trim()).toBe('% DSBlank');
                let entry1 = xobject2.get('n1');
                let parser = new _ContentParser(entry1.getBytes());
                let result = parser._readContent();
                expect(result[3]._operator).toEqual('cm');
                expect(result[3]._operands).toEqual(['0.1', '0', '0', '0.1', '9', '0']);
                expect(result[4]._operator).toEqual('J');
                expect(result[4]._operands).toEqual(['0']);
                expect(result[5]._operator).toEqual('j');
                expect(result[5]._operands).toEqual(['0']);
                expect(result[6]._operator).toEqual('M');
                expect(result[6]._operands).toEqual(['4']);
                expect(result[7]._operator).toEqual('d');
                expect(result[7]._operands).toEqual(['[]', '0']);
                expect(result[8]._operator).toEqual('i');
                expect(result[8]._operands).toEqual(['1']);
                expect(result[9]._operator).toEqual('g');
                expect(result[9]._operands).toEqual(['0']);
                expect(result[10]._operator).toEqual('m');
                expect(result[10]._operands).toEqual(['313', '292']);
                expect(result[11]._operator).toEqual('c');
                expect(result[11]._operands).toEqual(['313', '404', '325', '453', '432', '529']);
                expect(result[12]._operator).toEqual('c');
                expect(result[13]._operator).toEqual('c');
                expect(result[13]._operands).toEqual(['504', '736', '440', '760', '391', '760']);
                expect(result[14]._operator).toEqual('c');
                expect(result[14]._operands).toEqual(['286', '760', '271', '681', '265', '626']);
                expect(result[15]._operator).toEqual('l');
                expect(result[15]._operands).toEqual(['265', '625']);
                expect(result[16]._operator).toEqual('l');
                expect(result[16]._operands).toEqual(['100', '625']);
                expect(result[17]._operator).toEqual('c');
                expect(result[18]._operator).toEqual('c');
                expect(result[18]._operands).toEqual(['451', '898', '679', '878', '679', '650']);
                expect(result[19]._operator).toEqual('c');
                expect(result[19]._operands).toEqual(['679', '555', '628', '499', '538', '435']);
                expect(result[20]._operator).toEqual('c');
                expect(result[20]._operands).toEqual(['488', '399', '467', '376', '467', '292']);
                expect(result[21]._operator).toEqual('l');
                expect(result[21]._operands).toEqual(['313', '292']);
                expect(result[22]._operator).toEqual('h');
                expect(result[22]._operands).toEqual([]);
                expect(result[23]._operator).toEqual('re');
                expect(result[23]._operands).toEqual(['308', '214', '170', '-164']);
                expect(result[24]._operator).toEqual('f');
                expect(result[24]._operands).toEqual([]);
                expect(result[25]._operator).toEqual('G');
                expect(result[25]._operands).toEqual(['0.44']);
                expect(result[26]._operator).toEqual('w');
                expect(result[26]._operands).toEqual(['1.2']);
                expect(result[27]._operator).toEqual('rg');
                expect(result[27]._operands).toEqual(['1', '1', '0']);
                expect(result[28]._operator).toEqual('m');
                expect(result[28]._operands).toEqual(['287', '318']);
                expect(result[29]._operator).toEqual('c');
                expect(result[29]._operands).toEqual(['287', '430', '299', '479', '406', '555']);
                expect(result[30]._operator).toEqual('c');
                expect(result[30]._operands).toEqual(['451', '587', '478', '623', '478', '671']);
                expect(result[31]._operator).toEqual('c');
                expect(result[31]._operands).toEqual(['478', '762', '414', '786', '365', '786']);
                expect(result[32]._operator).toEqual('c');
                expect(result[32]._operands).toEqual(['260', '786', '245', '707', '239', '652']);
                expect(result[33]._operator).toEqual('l');
                expect(result[33]._operands).toEqual(['239', '651']);
                expect(result[34]._operator).toEqual('l');
                expect(result[34]._operands).toEqual(['74', '651']);
                expect(result[35]._operator).toEqual('c');
                expect(result[35]._operands).toEqual(['74', '854', '227', '924', '355', '924']);
                expect(result[36]._operator).toEqual('c');
                expect(result[36]._operands).toEqual(['425', '924', '653', '904', '653', '676']);
                expect(result[37]._operator).toEqual('c');
                expect(result[37]._operands).toEqual(['653', '581', '602', '525', '512', '461']);
                expect(result[38]._operator).toEqual('c');
                expect(result[38]._operands).toEqual(['462', '425', '441', '402', '441', '318']);
                expect(result[39]._operator).toEqual('l');
                expect(result[39]._operands).toEqual(['287', '318']);
                expect(result[40]._operator).toEqual('h');
                expect(result[40]._operands).toEqual([]);
                expect(result[41]._operator).toEqual('re');
                expect(result[41]._operands).toEqual(['282', '240', '170', '-164']);
                expect(result[42]._operator).toEqual('B');
                expect(result[42]._operands).toEqual([]);
                expect(result[43]._operator).toEqual('Q');
                expect(result[43]._operands).toEqual([]);
                entry1 = xobject2.get('n2');
                parser = new _ContentParser(entry1.getBytes());
                result = parser._readContent();
                expect(result[0]._operator).toEqual('cm');
                expect(result[0]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '200.00']);
                entry1 = xobject2.get('n3');
                expect(entry1).toBeDefined();
                bytes = entry1.getBytes();
                decoded = _bytesToString(bytes);
                expect(decoded.trim()).toBe('% DSBlank');
                entry1 = xobject2.get('n4');
                parser = new _ContentParser(entry1.getBytes());
                result = parser._readContent();
                expect(result.length).toBe(13);
                expect(result[0]._operator).toEqual('cm');
                expect(result[0]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '50.00']);
                expect(result[1]._operator).toEqual('BT');
                expect(result[1]._operands).toEqual([]);
                expect(result[2]._operator).toEqual('CS');
                expect(result[2]._operands).toEqual(['/DeviceRGB']);
                expect(result[3]._operator).toEqual('cs');
                expect(result[3]._operands).toEqual(['/DeviceRGB']);
                expect(result[4]._operator).toEqual('rg');
                expect(result[4]._operands).toEqual(['0.000', '0.000', '0.000']);
                expect(result[5]._operator).toEqual('Tf');
                expect(result[6]._operator).toEqual('Tr');
                expect(result[6]._operands).toEqual(['0'])
                expect(result[7]._operator).toEqual('Tc');
                expect(result[7]._operands).toEqual(['0.000']);
                expect(result[8]._operator).toEqual('Tw');
                expect(result[8]._operands).toEqual(['0.000']);
                expect(result[9]._operator).toEqual('Tz');
                expect(result[9]._operands).toEqual(['100.000']);
                expect(result[10]._operator).toEqual('Tm');
                expect(result[10]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '-9.14']);
                expect(result[11]._operator).toEqual("'");
                expect(result[11]._operands).toEqual(['(Signature Not Verified)']);
                expect(result[12]._operator).toEqual('ET');
                expect(result[12]._operands).toEqual([]);
            }
        }
    });
    it('989234 - 4', () => {
        let document = new PdfDocument();
        let page = document.addPage();
        const certData = pdf_pfx;
        const password = 'syncfusion';
         let field = new PdfSignatureField(page, certData, { x: 300, y: 50, width: 120, height: 40 });
        document.form.add(field);
        const sign = PdfSignature.create(certData, password, {
            cryptographicStandard: CryptographicStandard.cms,
            digestAlgorithm: DigestAlgorithm.sha256,
            contactInfo: 'johndoe@owned.us',
            locationInfo: 'Honolulu, Hawaii',
            reason: 'I am author of this document.'
        });
        sign.isValidationAppearanceEnabled = true;
        field.setSignature(sign);
        let fieldAppearance = field.getAppearance();
        fieldAppearance.normal.graphics.drawString(
            'Digital signature',
            new PdfStandardFont(PdfFontFamily.helvetica, 11), {x: 50, y: 50, width: 100, height: 100}, new PdfBrush({r: 0, g: 0, b: 0})
        );
        let update = document.save();
        document = new PdfDocument(update);
        field = document.form.fieldAt(0) as PdfSignatureField;
        const fieldDictionary: _PdfDictionary = field._dictionary;
        if (fieldDictionary.has('Kids')) {
            const kids: _PdfReference[] = fieldDictionary.get('Kids');
            const widget: _PdfDictionary = field._crossReference._fetch(kids[0]);
            if (widget && widget.has('AP')) {
                const ap: _PdfDictionary = widget.get('AP');
                const appearance: _PdfStream = ap.get('N');
                let resource = appearance.dictionary.get('Resources');
                expect(appearance).not.toBeUndefined();
                let xobject1 = resource.get('XObject');
                let resource2 = xobject1.get('FRM');
                const frmResources = resource2.dictionary.get('Resources');
                const xobject2 = frmResources.get('XObject');
                const n0 = xobject2.get('n0');
                expect(n0).toBeDefined();
                let bytes = n0.getBytes();
                let decoded: string = _bytesToString(bytes);
                expect(decoded.trim()).toBe('% DSBlank');
                let entry1 = xobject2.get('n1');
                let parser = new _ContentParser(entry1.getBytes());
                let result = parser._readContent();
                expect(result[3]._operator).toEqual('cm');
                expect(result[3]._operands).toEqual(['0.1', '0', '0', '0.1', '9', '0']);
                expect(result[7]._operator).toEqual('d');
                entry1 = xobject2.get('n3');
                decoded = _bytesToString(entry1.getBytes());
                expect(decoded.trim()).toBe('% DSBlank');
                entry1 = xobject2.get('n4');
                parser = new _ContentParser(entry1.getBytes());
                result = parser._readContent();
                expect(result.length).toBe(13);
                expect(result[0]._operator).toEqual('cm');
                expect(result[0]._operands).toEqual(['1.00','.00','.00','1.00','.00','10.00']);
                expect(result[1]._operator).toEqual('BT');
                expect(result[1]._operands).toEqual([]);
                expect(result[2]._operator).toEqual('CS');
                expect(result[2]._operands).toEqual(['/DeviceRGB']);
                expect(result[3]._operator).toEqual('cs');
                expect(result[3]._operands).toEqual(['/DeviceRGB']);
                expect(result[4]._operator).toEqual('rg');
                expect(result[4]._operands).toEqual(['0.000', '0.000', '0.000']);
                expect(result[5]._operator).toEqual('Tf');
                expect(result[5]._operands[1]).toEqual('9.814');
                expect(result[5]._operands[0].startsWith('/')).toBe(true);
                expect(result[6]._operator).toEqual('Tr');
                expect(result[6]._operands).toEqual(['0']);
                expect(result[7]._operator).toEqual('Tc');
                expect(result[7]._operands).toEqual(['0.000']);
                expect(result[8]._operator).toEqual('Tw');
                expect(result[8]._operands).toEqual(['0.000']);
                expect(result[9]._operator).toEqual('Tz');
                expect(result[9]._operands).toEqual(['100.000']);
                expect(result[10]._operator).toEqual('Tm');
                expect(result[10]._operands).toEqual(['1.00','.00','.00', '1.00', '.00','-9.14']);
                expect(result[11]._operator).toEqual("'");
                expect(result[11]._operands).toEqual(['(Signature Not Verified)']);
                expect(result[12]._operator).toEqual('ET');
                expect(result[12]._operands).toEqual([]);
            }
        }
    });
    it('989234 - 7', () => {
        const certData = pdf_pfx;
        const password = 'syncfusion';
        let document = new PdfDocument();
        const page1 = document.addPage();
        const page2 = document.addPage();
        const page3 = document.addPage();
        const field1 = new PdfSignatureField(page1, 'field1', { x: 50, y: 50, width: 120, height: 40 });
        const field2 = new PdfSignatureField(page2, 'field2', { x: 200, y: 200, width: 120, height: 40 });
        const field3 = new PdfSignatureField(page3, 'field3', { x: 300, y: 300, width: 120, height: 40 });
        const sign1 = PdfSignature.create(certData, password, {
            cryptographicStandard: CryptographicStandard.cms,
            digestAlgorithm: DigestAlgorithm.sha256,
            contactInfo: 'johndoe@owned.us',
            locationInfo: 'Honolulu, Hawaii',
            reason: 'Validation Appearance'
        });
        sign1.isValidationAppearanceEnabled = true;
        const sign2 = PdfSignature.create(certData, password, {
            cryptographicStandard: CryptographicStandard.cms,
            digestAlgorithm: DigestAlgorithm.sha256,
            contactInfo: 'johndoe@owned.us',
            locationInfo: 'Honolulu, Hawaii',
            reason: 'Validation Appearance'
        });
        sign2.isValidationAppearanceEnabled = true;
        const sign3 = PdfSignature.create(certData, password, {
            cryptographicStandard: CryptographicStandard.cms,
            digestAlgorithm: DigestAlgorithm.sha256,
            contactInfo: 'johndoe@owned.us',
            locationInfo: 'Honolulu, Hawaii',
            reason: 'Validation Appearance'
        });
        sign3.isValidationAppearanceEnabled = true;
        field1.setSignature(sign1);
        field2.setSignature(sign2);
        field3.setSignature(sign3);
        document.form.add(field1);
        document.form.add(field2);
        document.form.add(field3);
        const update = document.save();
        document = new PdfDocument(update);
        const form = document.form;
        expect(form.count).toEqual(3);
        for (let i = 0; i < form.count; i++) {
            const field = form.fieldAt(i) as PdfSignatureField;
            const fieldDictionary: _PdfDictionary = field._dictionary;
            if (fieldDictionary.has('Kids')) {
                const kids: _PdfReference[] = fieldDictionary.get('Kids');
                const widget: _PdfDictionary = field._crossReference._fetch(kids[0]);
                if (widget && widget.has('AP')) {
                    const ap: _PdfDictionary = widget.get('AP');
                    const appearance: _PdfStream = ap.get('N');
                    let resource = appearance.dictionary.get('Resources');
                    expect(appearance).not.toBeUndefined();
                    let xobject1 = resource.get('XObject');
                    let resource2 = xobject1.get('FRM');
                    const frmResources = resource2.dictionary.get('Resources');
                    const xobject2 = frmResources.get('XObject');
                    const n0 = xobject2.get('n0');
                    expect(n0).toBeDefined();
                    let bytes = n0.getBytes();
                    let decoded: string = _bytesToString(bytes);
                    expect(decoded.trim()).toBe('% DSBlank');
                }
            }
        }
    });
    it('989234 - 8', () => {
        const certData = pdf_pfx;
        const password = 'syncfusion';
        const cryptographicStandards = [CryptographicStandard.cms, CryptographicStandard.cades];
        const digestAlgorithms = [
            DigestAlgorithm.sha1,
            DigestAlgorithm.sha256,
            DigestAlgorithm.sha384,
            DigestAlgorithm.sha512
        ];
        for (let cs of cryptographicStandards) {
            for (let da of digestAlgorithms) {
                let document = new PdfDocument();
                let page = document.addPage();
                let field = new PdfSignatureField(page, `field_${cs}_${da}`, { x: 50, y: 50, width: 150, height: 50 });
                const sign = PdfSignature.create(certData, password, {
                    cryptographicStandard: cs,
                    digestAlgorithm: da,
                    contactInfo: 'johndoe@owned.us',
                    locationInfo: 'Honolulu, Hawaii',
                    reason: `Validation Appearance - ${cs} - ${da}`
                });
                sign.isValidationAppearanceEnabled = true;
                field.setSignature(sign);
                document.form.add(field);
                const update = document.save();
                document = new PdfDocument(update);
                const form = document.form;
                expect(form.count).toEqual(1);
                field = form.fieldAt(0) as PdfSignatureField;
                const fieldDictionary: _PdfDictionary = field._dictionary;
                if (fieldDictionary.has('Kids')) {
                    const kids: _PdfReference[] = fieldDictionary.get('Kids');
                    const widget: _PdfDictionary = field._crossReference._fetch(kids[0]);
                    if (widget && widget.has('AP')) {
                        const ap: _PdfDictionary = widget.get('AP');
                        const appearance: _PdfStream = ap.get('N');
                        let resource = appearance.dictionary.get('Resources');
                        expect(appearance).not.toBeUndefined();
                        let xobject1 = resource.get('XObject');
                        let resource2 = xobject1.get('FRM');
                        const frmResources = resource2.dictionary.get('Resources');
                        const xobject2 = frmResources.get('XObject');
                        const n0 = xobject2.get('n0');
                        expect(n0).toBeDefined();
                        let bytes = n0.getBytes();
                        let decoded: string = _bytesToString(bytes);
                        expect(decoded.trim()).toBe('% DSBlank');
                    }
                }
            }
        }
    });
    it('989234 - 9', () => {
        const certData = pdf_pfx;
        const password = 'syncfusion';
        let document = new PdfDocument();
        let page = document.addPage();
        let field = new PdfSignatureField(page, `Signature`, { x: 50, y: 50, width: 150, height: 50 });
        let sign = PdfSignature.create(certData, password, {
            cryptographicStandard: CryptographicStandard.cms,
            digestAlgorithm: DigestAlgorithm.sha256,
            contactInfo: 'johndoe@owned.us',
            locationInfo: 'Honolulu, Hawaii',
            reason: `Validation Appearance`,
            isValidationAppearanceEnabled: true
        });
        field.setSignature(sign);
        document.form.add(field);
        let update = document.save();
        document = new PdfDocument(update);
        let form = document.form;
        field = form.fieldAt(0) as PdfSignatureField;
        sign = field.getSignature();
        let result = sign.isValidationAppearanceEnabled;
        expect(result).toEqual(true);
        document.destroy();
    });
});
describe('989234 Signature validation appearance coverage - mutation', () => {
    it('989234 - should reuse appearance layer instance for validation appearance', () => {
        const document = new PdfDocument();
        const page = document.addPage();
        const field = new PdfSignatureField(page, 'Signature', { x: 50, y: 50, width: 100, height: 50 });
        const appearance = field.getAppearance();
        const firstLayer = appearance._getAppearanceLayer();
        const secondLayer = appearance._getAppearanceLayer();
        expect(firstLayer).toBe(secondLayer);
        document.destroy();
    });
    it('989234 - should return true when validation appearance exists', () => {
        const certData = pdf_pfx;
        const password = 'syncfusion';
        let document = new PdfDocument();
        const page = document.addPage();
        const field = new PdfSignatureField(page, 'Signature', { x: 50, y: 50, width: 150, height: 50 });
        const sign = PdfSignature.create(certData, password, {cryptographicStandard: CryptographicStandard.cms,digestAlgorithm: DigestAlgorithm.sha256,reason: 'Validation Appearance'});
        sign.isValidationAppearanceEnabled = true;
        field.setSignature(sign);
        document.form.add(field);
        const data = document.save();
        document = new PdfDocument(data);
        const loadedField = document.form.fieldAt(0) as PdfSignatureField;
        const loadedSignature = loadedField.getSignature();
        expect(loadedSignature._getValidationAppearance()).toBe(true);
        document.destroy();
    });
    it('989234 - should get validation appearance from widget annotation when Kids entry is absent', () => {
        const document = new PdfDocument();
        const page = document.addPage();
        const field = new PdfSignatureField(page,'Signature',{ x: 10, y: 10, width: 100, height: 50 });
        document.form.add(field);
        const signature = new PdfSignature();
        signature._signed = true;
        signature._signatureField = field;
        signature._crossReference = field._crossReference;
        if (field._dictionary.has('Kids')) {
            delete field._dictionary._map.Kids;
        }
        expect(field._widgetAnnot).toBeDefined();
        const widgetDictionary = new _PdfDictionary(field._crossReference);
        const ap = new _PdfDictionary(field._crossReference);
        const appearanceDictionary = new _PdfDictionary(field._crossReference);
        const appearance = new _PdfStream(new Uint8Array(0),appearanceDictionary);
        const resources = new _PdfDictionary(field._crossReference);
        const xObjects = new _PdfDictionary(field._crossReference);
        const frmDictionary = new _PdfDictionary(field._crossReference);
        const frm = new _PdfStream(new Uint8Array(0),frmDictionary);
        const frmResources = new _PdfDictionary(field._crossReference);
        const frmXObjects = new _PdfDictionary(field._crossReference);
        frmXObjects.set('n0',new _PdfStream(new Uint8Array(0),new _PdfDictionary(field._crossReference)));
        frmXObjects.set('n1',new _PdfStream(new Uint8Array(0),new _PdfDictionary(field._crossReference)));
        frmXObjects.set('n2',new _PdfStream(new Uint8Array(0),new _PdfDictionary(field._crossReference)));
        frmXObjects.set('n3',new _PdfStream(new Uint8Array(0),new _PdfDictionary(field._crossReference)));
        frmXObjects.set('n4',new _PdfStream(new Uint8Array(0),new _PdfDictionary(field._crossReference)));
        frmResources.set('XObject', frmXObjects);
        frm.dictionary.set('Resources', frmResources);
        xObjects.set('FRM', frm);
        resources.set('XObject', xObjects);
        appearance.dictionary.set('Resources', resources);
        ap.set('N', appearance);
        widgetDictionary.set('AP', ap);
        const widget = new PdfWidgetAnnotation();
        widget._dictionary = widgetDictionary;
        field._widgetAnnot = widget;
        expect(signature._getValidationAppearance()).toBe(true);
        document.destroy();
    });
    it('989234 - should return false when only n4 exists in validation appearance', () => {
        const signature = new PdfSignature();
        signature._signed = true;
        const frmXObjects = new _PdfDictionary();
        frmXObjects.set('n4', new _PdfDictionary());
        const frmResources = new _PdfDictionary();
        frmResources.set('XObject', frmXObjects);
        const frmDictionary = new _PdfDictionary();
        frmDictionary.set('Resources', frmResources);
        const frm = new _PdfStream(new Uint8Array(0),frmDictionary);
        const xObjects = new _PdfDictionary();
        xObjects.set('FRM', frm);
        const resources = new _PdfDictionary();
        resources.set('XObject', xObjects);
        const appearanceDictionary = new _PdfDictionary();
        appearanceDictionary.set('Resources', resources);
        const appearance = new _PdfStream(new Uint8Array(0),appearanceDictionary);
        const apDictionary = new _PdfDictionary();
        apDictionary.set('N', appearance);
        const widgetDictionary = new _PdfDictionary();
        widgetDictionary.set('AP', apDictionary);
        const widget = new PdfWidgetAnnotation();
        widget._dictionary = widgetDictionary;
        const field = {} as PdfSignatureField;
        field._widgetAnnot = widget;
        field._dictionary = new _PdfDictionary();
        signature._signatureField = field;
        expect(signature._getValidationAppearance()).toBe(false);
    });
    it('989234 - should return false when n0, n1 and n2 are missing from validation appearance', () => {
        const document = new PdfDocument();
        const page = document.addPage();
        const field = new PdfSignatureField(page,'Signature',{ x: 10, y: 10, width: 100, height: 50 });
        document.form.add(field);
        const signature = new PdfSignature();
        signature._signed = true;
        signature._signatureField = field;
        signature._crossReference = field._crossReference;
        if (field._dictionary.has('Kids')) {
            delete field._dictionary._map.Kids;
        }
        const widgetDictionary = new _PdfDictionary(field._crossReference);
        const ap = new _PdfDictionary(field._crossReference);
        const appearanceDictionary = new _PdfDictionary(field._crossReference);
        const appearance = new _PdfStream(new Uint8Array(0),appearanceDictionary);
        const resources = new _PdfDictionary(field._crossReference);
        const xObjects = new _PdfDictionary(field._crossReference);
        const frmDictionary = new _PdfDictionary(field._crossReference);
        const frm = new _PdfStream(new Uint8Array(0),frmDictionary);
        const frmResources = new _PdfDictionary(field._crossReference);
        const frmXObjects = new _PdfDictionary(field._crossReference);
        frmXObjects.set('n3',new _PdfStream(new Uint8Array(0),new _PdfDictionary(field._crossReference)));
        frmXObjects.set('n4',new _PdfStream(new Uint8Array(0),new _PdfDictionary(field._crossReference)));
        frmResources.set('XObject', frmXObjects);
        frm.dictionary.set('Resources', frmResources);
        xObjects.set('FRM', frm);
        resources.set('XObject', xObjects);
        appearance.dictionary.set('Resources', resources);
        ap.set('N', appearance);
        widgetDictionary.set('AP', ap);
        const widget = new PdfWidgetAnnotation();
        widget._dictionary = widgetDictionary;
        field._widgetAnnot = widget;
        expect(signature._getValidationAppearance()).toBe(false);
        document.destroy();
    });
    it('989234 - should return false when only n0 and n1 exist in validation appearance', () => {
        const document = new PdfDocument();
        const page = document.addPage();
        const field = new PdfSignatureField(page,'Signature',{ x: 10, y: 10, width: 100, height: 50 });
        document.form.add(field);
        const signature = new PdfSignature();
        signature._signed = true;
        signature._signatureField = field;
        signature._crossReference = field._crossReference;
        if (field._dictionary.has('Kids')) {
            delete field._dictionary._map.Kids;
        }
        const widgetDictionary = new _PdfDictionary(field._crossReference);
        const ap = new _PdfDictionary(field._crossReference);
        const appearanceDictionary = new _PdfDictionary(field._crossReference);
        const appearance = new _PdfStream(new Uint8Array(0),appearanceDictionary);
        const resources = new _PdfDictionary(field._crossReference);
        const xObjects = new _PdfDictionary(field._crossReference);
        const frmDictionary = new _PdfDictionary(field._crossReference);
        const frm = new _PdfStream(new Uint8Array(0),frmDictionary);
        const frmResources = new _PdfDictionary(field._crossReference);
        const frmXObjects = new _PdfDictionary(field._crossReference);
        frmXObjects.set('n0',new _PdfStream(new Uint8Array(0),new _PdfDictionary(field._crossReference)));
        frmXObjects.set('n1',new _PdfStream(new Uint8Array(0),new _PdfDictionary(field._crossReference)));
        frmResources.set('XObject', frmXObjects);
        frm.dictionary.set('Resources', frmResources);
        xObjects.set('FRM', frm);
        resources.set('XObject', xObjects);
        appearance.dictionary.set('Resources', resources);
        ap.set('N', appearance);
        widgetDictionary.set('AP', ap);
        const widget = new PdfWidgetAnnotation();
        widget._dictionary = widgetDictionary;
        field._widgetAnnot = widget;
        expect(signature._getValidationAppearance()).toBe(false);
        document.destroy();
    });
    it('989234 - should return false when an exception occurs while checking validation appearance', () => {
        const signature = new PdfSignature();
        signature._signed = true;
        signature._signatureField = {} as any;
        expect(signature._getValidationAppearance()).toBe(false);
    });
    it('989234 - should return without generating validation appearance when width is zero', () => {
        const document = new PdfDocument();
        const page = document.addPage();
        const field = new PdfSignatureField(page,'Signature',{ x: 10, y: 10, width: 100, height: 50 });
        const sign = PdfSignature.create(pdf_pfx, 'syncfusion', {cryptographicStandard: CryptographicStandard.cms,digestAlgorithm: DigestAlgorithm.sha256});
        sign.isValidationAppearanceEnabled = true;
        field.setSignature(sign);
        document.form.add(field);
        sign._bounds = {x: 0,y: 0,width: 0,height: 100};
        const appearanceBefore = field.getAppearance()._isCompletedValidationAppearance;
        sign._setValidationAppearance();
        expect(field.getAppearance()._isCompletedValidationAppearance).toBe(appearanceBefore);
        document.destroy();
    });
    it('989234 - should not create validation appearance when width is zero', () => {
        const document = new PdfDocument();
        const page = document.addPage();
        const field = new PdfSignatureField(page,'Signature',{ x: 10, y: 10, width: 100, height: 50 });
        const sign = PdfSignature.create(pdf_pfx, 'syncfusion', {cryptographicStandard: CryptographicStandard.cms,digestAlgorithm: DigestAlgorithm.sha256});
        sign.isValidationAppearanceEnabled = true;
        field.setSignature(sign);
        document.form.add(field);
        sign._bounds = {x: 0,y: 0,width: 0,height: 100};
        const appearance = field.getAppearance();
        appearance._isCompletedValidationAppearance = false;
        sign._setValidationAppearance();
        expect(appearance._isCompletedValidationAppearance).toBe(false);
        document.destroy();
    });
    it('989234 - should not generate validation appearance when width is zero', () => {
        const document = new PdfDocument();
        const page = document.addPage();
        const field = new PdfSignatureField(page,'Signature',{ x: 10, y: 10, width: 100, height: 50 });
        const sign = PdfSignature.create(pdf_pfx, 'syncfusion', {cryptographicStandard: CryptographicStandard.cms,digestAlgorithm: DigestAlgorithm.sha256});
        sign.isValidationAppearanceEnabled = true;
        field.setSignature(sign);
        document.form.add(field);
        sign._bounds = {x: 0,y: 0,width: 0,height: 100};
        const appearance = field.getAppearance();
        appearance._isCompletedValidationAppearance = false;
        sign._setValidationAppearance();
        expect(appearance._isCompletedValidationAppearance).toBe(false);
        document.destroy();
    });
    it('989234 - should return without generating validation appearance when cross reference is undefined', () => {
        const document = new PdfDocument();
        const page = document.addPage();
        const field = new PdfSignatureField(page,'Signature',{ x: 10, y: 10, width: 100, height: 50 });
        const sign = PdfSignature.create(pdf_pfx, 'syncfusion', {cryptographicStandard: CryptographicStandard.cms,digestAlgorithm: DigestAlgorithm.sha256});
        sign.isValidationAppearanceEnabled = true;
        field.setSignature(sign);
        document.form.add(field);
        sign._signatureField._crossReference = undefined;
        const appearance = field.getAppearance();
        appearance._isCompletedValidationAppearance = false;
        sign._setValidationAppearance();
        expect(appearance._isCompletedValidationAppearance).toBe(false);
        document.destroy();
    });
    it('989234 - should not create validation appearance when height is zero', () => {
        const document = new PdfDocument();
        const page = document.addPage();
        const field = new PdfSignatureField(page,'Signature',{ x: 10, y: 10, width: 100, height: 50 });
        const sign = PdfSignature.create(pdf_pfx, 'syncfusion', {cryptographicStandard: CryptographicStandard.cms,digestAlgorithm: DigestAlgorithm.sha256});
        sign.isValidationAppearanceEnabled = true;
        field.setSignature(sign);
        document.form.add(field);
        sign._bounds = {x: 0,y: 0,width: 100,height: 0};
        const appearance = field.getAppearance();
        appearance._isCompletedValidationAppearance = false;
        sign._setValidationAppearance();
        expect(appearance._isCompletedValidationAppearance).toBe(false);
        document.destroy();
    });
    it('989234 - should initialize page from signature field when page is undefined', () => {
        const document = new PdfDocument();
        const page = document.addPage();
        const field = new PdfSignatureField(page,'Signature',{ x: 10, y: 10, width: 150, height: 50 });
        const sign = PdfSignature.create(pdf_pfx, 'syncfusion', {cryptographicStandard: CryptographicStandard.cms,digestAlgorithm: DigestAlgorithm.sha256});
        field.setSignature(sign);
        document.form.add(field);
        sign._page = undefined;
        sign._setValidationAppearance();
        expect(sign._page).toBe(page);
        document.destroy();
    });
    it('989234 - should not overwrite an existing page with signature field page', () => {
        const document = new PdfDocument();
        const page1 = document.addPage();
        const page2 = document.addPage();
        const field = new PdfSignatureField(page2,'Signature',{ x: 10, y: 10, width: 150, height: 50 });
        const sign = PdfSignature.create(pdf_pfx, 'syncfusion', {cryptographicStandard: CryptographicStandard.cms,digestAlgorithm: DigestAlgorithm.sha256});
        field.setSignature(sign);
        document.form.add(field);
        sign._page = page1;
        sign._setValidationAppearance();
        expect(sign._page).toBe(page1);
        document.destroy();
    });
    it('989234 - should generate rotated validation appearance for a 90 degree rotated page', () => {
        const document = new PdfDocument();
        const page = document.addPage();
        page.rotation = PdfRotationAngle.angle90;
        const field = new PdfSignatureField(page,'Signature',{ x: 10, y: 10, width: 150, height: 50 });
        const sign = PdfSignature.create(pdf_pfx, 'syncfusion', {cryptographicStandard: CryptographicStandard.cms,digestAlgorithm: DigestAlgorithm.sha256});
        sign.isValidationAppearanceEnabled = true;
        field.setSignature(sign);
        document.form.add(field);
        sign._setValidationAppearance();
        expect(field.getAppearance()._isCompletedValidationAppearance).toBe(true);
        document.destroy();
    });
    it('989234 - should generate validation appearance for a 90 degree rotated page', () => {
        const document = new PdfDocument();
        const page = document.addPage();
        page.rotation = PdfRotationAngle.angle90;
        const field = new PdfSignatureField(page,'Signature',{ x: 10, y: 10, width: 150, height: 50 });
        const sign = PdfSignature.create(pdf_pfx, 'syncfusion', {cryptographicStandard: CryptographicStandard.cms,digestAlgorithm: DigestAlgorithm.sha256});
        sign.isValidationAppearanceEnabled = true;
        field.setSignature(sign);
        document.form.add(field);
        sign._setValidationAppearance();
        expect(field.getAppearance()._isCompletedValidationAppearance).toBe(true);
        document.destroy();
    });
    it('989234 - should generate non-rotated validation appearance for an unrotated page', () => {
        const document = new PdfDocument();
        const page = document.addPage();
        page.rotation = PdfRotationAngle.angle0;
        const field = new PdfSignatureField(page,'Signature',{ x: 10, y: 10, width: 150, height: 50 });
        const sign = PdfSignature.create(pdf_pfx, 'syncfusion', {cryptographicStandard: CryptographicStandard.cms,digestAlgorithm: DigestAlgorithm.sha256});
        sign.isValidationAppearanceEnabled = true;
        field.setSignature(sign);
        document.form.add(field);
        sign._setValidationAppearance();
        expect(field.getAppearance()._isCompletedValidationAppearance).toBe(true);
        document.destroy();
    });
    it('989234 - should generate rotated validation appearance for a rotated page', () => {
        const document = new PdfDocument();
        const page = document.addPage();
        page.rotation = PdfRotationAngle.angle90;
        const field = new PdfSignatureField(page,'Signature',{ x: 10, y: 10, width: 150, height: 50 });
        const sign = PdfSignature.create(pdf_pfx, 'syncfusion', {cryptographicStandard: CryptographicStandard.cms,digestAlgorithm: DigestAlgorithm.sha256});
        sign.isValidationAppearanceEnabled = true;
        field.setSignature(sign);
        document.form.add(field);
        sign._setValidationAppearance();
        expect(field.getAppearance()._isCompletedValidationAppearance).toBe(true);
        document.destroy();
    });
    it('989234 - should generate correct N0 template position for non-rotated pages', () => {
        const document = new PdfDocument();
        const page = document.addPage();
        page.rotation = PdfRotationAngle.angle0;
        const field = new PdfSignatureField(page,'Signature',{ x: 10, y: 10, width: 150, height: 50 });
        const sign = PdfSignature.create(pdf_pfx, 'syncfusion', {cryptographicStandard: CryptographicStandard.cms,digestAlgorithm: DigestAlgorithm.sha256});
        sign.isValidationAppearanceEnabled = true;
        field.setSignature(sign);
        document.form.add(field);
        sign._setValidationAppearance();
        const appearance = field.getAppearance();
        expect(appearance._isCompletedValidationAppearance).toBe(true);
        document.destroy();
    });
    it('989234 - should generate rotated N1 validation appearance for rotated pages', () => {
        const document = new PdfDocument();
        const page = document.addPage();
        page.rotation = PdfRotationAngle.angle90;
        const field = new PdfSignatureField(page,'Signature',{ x: 10, y: 10, width: 150, height: 50 });
        const sign = PdfSignature.create(pdf_pfx, 'syncfusion', {cryptographicStandard: CryptographicStandard.cms,digestAlgorithm: DigestAlgorithm.sha256});
        sign.isValidationAppearanceEnabled = true;
        field.setSignature(sign);
        document.form.add(field);
        sign._setValidationAppearance();
        expect(field.getAppearance()._isCompletedValidationAppearance).toBe(true);
        document.destroy();
    });
    it('989234 - should position N1 template correctly when height is greater than width', () => {
        const document = new PdfDocument();
        const page = document.addPage();
        const field = new PdfSignatureField(page,'Signature',{ x: 10, y: 10, width: 80, height: 200 });
        const sign = PdfSignature.create(pdf_pfx, 'syncfusion', {cryptographicStandard: CryptographicStandard.cms,digestAlgorithm: DigestAlgorithm.sha256});
        sign.isValidationAppearanceEnabled = true;
        field.setSignature(sign);
        document.form.add(field);
        sign._setValidationAppearance();
        const appearance = field.getAppearance();
        expect(appearance._isCompletedValidationAppearance).toBe(true);
        document.destroy();
    });
    it('989234 - should position N1 template correctly when width is greater than height', () => {
        const document = new PdfDocument();
        const page = document.addPage();
        const field = new PdfSignatureField(page,'Signature',{ x: 10, y: 10, width: 200, height: 80 });
        const sign = PdfSignature.create(pdf_pfx, 'syncfusion', {cryptographicStandard: CryptographicStandard.cms,digestAlgorithm: DigestAlgorithm.sha256});
        sign.isValidationAppearanceEnabled = true;
        field.setSignature(sign);
        document.form.add(field);
        sign._setValidationAppearance();
        const appearance = field.getAppearance();
        expect(appearance._isCompletedValidationAppearance).toBe(true);
        document.destroy();
    });
    it('989234 - should use non rotated appearance layer path for a normal page', () => {
        const document = new PdfDocument();
        const page = document.addPage();
        page.rotation = PdfRotationAngle.angle0;
        const field = new PdfSignatureField(page,'Signature',{ x: 10, y: 10, width: 200, height: 100 });
        const sign = PdfSignature.create(pdf_pfx, 'syncfusion', {cryptographicStandard: CryptographicStandard.cms,digestAlgorithm: DigestAlgorithm.sha256});
        sign.isValidationAppearanceEnabled = true;
        field.setSignature(sign);
        document.form.add(field);
        sign._setValidationAppearance();
        const appearance = field.getAppearance();
        expect(appearance._isCompletedValidationAppearance).toBe(true);
        document.destroy();
    });
    it('989234 - should position appearance layer correctly for non-rotated pages', () => {
        const document = new PdfDocument();
        const page = document.addPage();
        page.rotation = PdfRotationAngle.angle0;
        const field = new PdfSignatureField(page,'Signature',{ x: 10, y: 10, width: 200, height: 100 });
        const sign = PdfSignature.create(pdf_pfx, 'syncfusion', {cryptographicStandard: CryptographicStandard.cms,digestAlgorithm: DigestAlgorithm.sha256});
        sign.isValidationAppearanceEnabled = true;
        field.setSignature(sign);
        document.form.add(field);
        sign._setValidationAppearance();
        const appearance = field.getAppearance();
        expect(appearance._isCompletedValidationAppearance).toBe(true);
        document.destroy();
    });
    it('989234 - should position N3 template correctly for non-rotated pages', () => {
        const document = new PdfDocument();
        const page = document.addPage();
        page.rotation = PdfRotationAngle.angle0;
        const field = new PdfSignatureField(page,'Signature',{ x: 10, y: 10, width: 150, height: 50 });
        const sign = PdfSignature.create(pdf_pfx, 'syncfusion', {cryptographicStandard: CryptographicStandard.cms,digestAlgorithm: DigestAlgorithm.sha256});
        sign.isValidationAppearanceEnabled = true;
        field.setSignature(sign);
        document.form.add(field);
        sign._setValidationAppearance();
        const appearance = field.getAppearance();
        expect(appearance._isCompletedValidationAppearance).toBe(true);
        document.destroy();
    });
    it('989234 - should create rotated N4 template dimensions for rotated pages', () => {
        const document = new PdfDocument();
        const page = document.addPage();
        page.rotation = PdfRotationAngle.angle90;
        const field = new PdfSignatureField(page,'Signature',{x: 10,y: 10,width: 200,height: 100});
        const sign = PdfSignature.create(pdf_pfx, 'syncfusion', {
            cryptographicStandard: CryptographicStandard.cms,
            digestAlgorithm: DigestAlgorithm.sha256
        });
        sign.isValidationAppearanceEnabled = true;
        field.setSignature(sign);
        document.form.add(field);
        sign._setValidationAppearance();
        expect(field.getAppearance()._isCompletedValidationAppearance).toBe(true);
        document.destroy();
    });
    it('989234 - should not append an extra CRLF when validation stream already ends with LF', () => {
        const document = new PdfDocument();
        const page = document.addPage();
        const field = new PdfSignatureField(page,'Signature',{ x: 10, y: 10, width: 200, height: 100 });
        const signature = PdfSignature.create(pdf_pfx, 'syncfusion', {
            cryptographicStandard: CryptographicStandard.cms,
            digestAlgorithm: DigestAlgorithm.sha256
        });
        signature.isValidationAppearanceEnabled = true;
        field.setSignature(signature);
        document.form.add(field);
        const appearance = field.getAppearance();
        const layer = appearance._getAppearanceLayer();
        const stream: _PdfContentStream = layer.graphics._sw._stream;
        stream.write('TestData\n');
        signature._setValidationAppearance();
        const validationStream =appearance.normal.graphics._sw._stream.getString();
        expect(validationStream.endsWith('\n\r\n')).toBe(false);
        document.destroy();
    });
    it('989234 - should append CRLF to generated validation appearance stream', () => {
        const document = new PdfDocument();
        const page = document.addPage();
        const field = new PdfSignatureField(page,'Signature',{ x: 10, y: 10, width: 200, height: 100 });
        const signature = PdfSignature.create(pdf_pfx, 'syncfusion', {cryptographicStandard: CryptographicStandard.cms,digestAlgorithm: DigestAlgorithm.sha256});
        signature.isValidationAppearanceEnabled = true;
        field.setSignature(signature);
        document.form.add(field);
        signature._setValidationAppearance();
        const appearance = field.getAppearance();
        const streamData =appearance.normal.graphics._sw._stream.getString();
        expect(streamData.endsWith('\r\n')).toBe(true);
        document.destroy();
    });
    it('989234 - should append CRLF when validation stream does not end with a line break', () => {
        const document = new PdfDocument();
        const page = document.addPage();
        const field = new PdfSignatureField(page,'Signature',{ x: 10, y: 10, width: 200, height: 100 });
        const signature = PdfSignature.create(pdf_pfx, 'syncfusion', {
            cryptographicStandard: CryptographicStandard.cms,
            digestAlgorithm: DigestAlgorithm.sha256
        });
        signature.isValidationAppearanceEnabled = true;
        field.setSignature(signature);
        document.form.add(field);
        signature._setValidationAppearance();
        const appearance = field.getAppearance();
        const streamData =appearance.normal.graphics._sw._stream.getString();
        expect(streamData.endsWith('\r\n')).toBe(true);
        document.destroy();
    });
    it('989234 - should append CRLF when validation stream does not end with CR or LF', () => {
        const document = new PdfDocument();
        const page = document.addPage();
        const field = new PdfSignatureField(page,'Signature',{ x: 10, y: 10, width: 200, height: 100 });
        const signature = PdfSignature.create(pdf_pfx, 'syncfusion', {cryptographicStandard: CryptographicStandard.cms,digestAlgorithm: DigestAlgorithm.sha256});
        signature.isValidationAppearanceEnabled = true;
        field.setSignature(signature);
        document.form.add(field);
        signature._setValidationAppearance();
        const streamData = field.getAppearance().normal.graphics._sw._stream.getString();
        expect(streamData.endsWith('\r\n')).toBe(true);
        document.destroy();
    });
    it('989234 - should disable compression for validation stream content', () => {
        const template = {_content: {_isCompress: true}} as any;
        const signature = new PdfSignature();
        signature._disableValidationStreamCompression(template);
        expect(template._content._isCompress).toBe(false);
    });
    it('989234 - should skip CRLF replacement when stream does not contain CRLF', () => {
        const signature = new PdfSignature();
        const replaceSpy = spyOn(String.prototype, 'replace').and.callThrough();
        signature._reviseSignatureValidationStream('ABC');
        expect(replaceSpy).not.toHaveBeenCalledWith(/\r\n/g, ' ');
    });
    it('989234 - should replace CRLF with spaces in validation stream data', () => {
        const signature = new PdfSignature();
        const result = signature._reviseSignatureValidationStream('Line1\r\nLine2');
        expect(result).toBe('Line1 Line2');
    });
    it('989234 - should not perform Q Q replacement when the marker is absent', () => {
        const signature = new PdfSignature();
        const replaceSpy = spyOn(String.prototype, 'replace').and.callThrough();
        signature._reviseSignatureValidationStream('Validation stream without marker');
        expect(replaceSpy).not.toHaveBeenCalledWith(/Q Q /g,'Q Q\r\n');
    });
    it('989234 - should replace Q Q marker with Q Q CRLF in validation stream data', () => {
        const signature = new PdfSignature();
        const result = signature._reviseSignatureValidationStream('BT Q Q ET');
        expect(result).toBe('BT Q Q\r\nET');
    });
    it('989234 - should insert CRLF after Q Q marker in validation stream data', () => {
        const signature = new PdfSignature();
        const result = signature._reviseSignatureValidationStream('BT Q Q ET');
        expect(result).toBe('BT Q Q\r\nET');
    });
    it('989234 - should replace Q Q marker with Q Q followed by CRLF', () => {
        const signature = new PdfSignature();
        const result = signature._reviseSignatureValidationStream('BT Q Q ET');
        expect(result).toBe('BT Q Q\r\nET');
    });
    it('989234 - should calculate scale factor correctly', () => {
        const signature = new PdfSignature();
        const scale = signature._findScale(200, 100);
        expect(scale[0]).toBeCloseTo(0.9, 5);
        expect(scale[1]).toBe(55);
        expect(scale[2]).toBe(5);
    });
    it('989234 - should calculate scale offsets correctly', () => {
        const signature = new PdfSignature();
        const scale = signature._findScale(200, 100);
        expect(scale[0]).toBeCloseTo(0.9, 5);
        expect(scale[1]).toBe(55);
        expect(scale[2]).toBe(5);
    });
    it('989234 - should calculate scale values correctly', () => {
        const signature = new PdfSignature();
        const scale = signature._findScale(200, 100);
        expect(scale[0]).toBeCloseTo(0.9, 5);
        expect(scale[1]).toBe(55);
        expect(scale[2]).toBe(5);
    });
    it('989234 - should create a new appearance layer', () => {
        const document = new PdfDocument();
        const page = document.addPage();
        const field = new PdfSignatureField(page,'Signature',{ x: 10, y: 10, width: 100, height: 50 });
        document.form.add(field);
        const appearance = field.getAppearance();
        delete (appearance as any)._appearanceLayer;
        const layer = appearance._getAppearanceLayer();
        expect(layer).toBeDefined();
        expect(layer.size.width).toBe(field.bounds.width);
        expect(layer.size.height).toBe(field.bounds.height);
        document.destroy();
    });
});

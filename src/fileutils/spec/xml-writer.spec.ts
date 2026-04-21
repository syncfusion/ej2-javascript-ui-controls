import { XmlWriter } from '../src/xml-writer';

/**
 * Xml Writer Spec
 */
describe('Create XmlWriter instance', (): void => {
    beforeEach((): void => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
    });
    it('Validate constructor', (done): void => {
        /**
         * instantiate XmlWriter class
         */
        let xmlWriter: XmlWriter = new XmlWriter();
        setTimeout((): void => {
            expect('').toBe('');
            done();
        }, 50);
    });
});
describe('Create single empty element without start document', (): void => {
    let xmlWriter: XmlWriter;
    let fileReader: FileReader;
    let xmlText: string | ArrayBuffer;
    beforeEach((): void => {
        /**
         * instantiate XmlWriter class
         */
        xmlWriter = new XmlWriter();
        /**
         * creates instance of FileReader class
         */
        fileReader = new FileReader();
        fileReader.onload = (): void => {
            /**
             * gets xml text from bolb
             */
            xmlText = fileReader.result;
        };
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
    });
    afterEach((): void => {
        xmlWriter.destroy();
        xmlWriter = undefined;
        fileReader = undefined;
        xmlText = '';
    });
    it('Prefix and namespace as null', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root />');
            done();
        }, 50);
    });
    it('Prefix and namespace as empty', (done): void => {
        xmlWriter.writeStartElement('', 'root', '');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root />');
            done();
        }, 50);
    });
    it('Prefix and namespace as valid string', (done): void => {
        xmlWriter.writeStartElement('w', 'root', 'xmlns');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><w:root xmlns:w="xmlns" />');
            done();
        }, 50);
    });
    it('Prefix as null and namespace as valid string', (done): void => {
        xmlWriter.writeStartElement(null, 'root', 'xmlns');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root xmlns="xmlns" />');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string', (done): void => {
        xmlWriter.writeStartElement('', 'root', 'xmlns');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root xmlns="xmlns" />');
            done();
        }, 50);
    });
    it('Prefix as valid string and namespace as null', (done): void => {
        setTimeout((): void => {
            expect((): void => { xmlWriter.writeStartElement('w', 'root', null); }).toThrow(new Error('ArgumentException: Cannot use a prefix with an empty namespace'));
            done();
        }, 50);
    });
    it('Prefix, namespace as null ,localName with valid special character', (done): void => {
        xmlWriter.writeStartElement(null, 'root_-.', null)
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root_-. />');
            done();
        }, 50);
    });
    it('Prefix, namespace, localName as null', (done): void => {
        setTimeout((): void => {
            expect((): void => { xmlWriter.writeStartElement(null, null, null); }).toThrow(new Error('ArgumentException: localName cannot be undefined, null or empty'));
            done();
        }, 50);
    });
    it('Prefix, namespace, localName as null empty', (done): void => {
        setTimeout((): void => {
            expect((): void => { xmlWriter.writeStartElement('', '', ''); }).toThrow(new Error('ArgumentException: localName cannot be undefined, null or empty'));
            done();
        }, 50);
    });
    it('Prefix,localName as valid String and namespace as empty', (done): void => {
        setTimeout((): void => {
            expect((): void => { xmlWriter.writeStartElement('w', 'root', ''); }).toThrow(new Error('ArgumentException: Cannot use a prefix with an empty namespace'));
            done();
        }, 50);
    });
    it('Prefix,localName as valid String and namespace as null', (done): void => {
        setTimeout((): void => {
            expect((): void => { xmlWriter.writeStartElement('w', 'root', null); }).toThrow(new Error('ArgumentException: Cannot use a prefix with an empty namespace'));
            done();
        }, 50);
    });
    it('Prefix = xmlns, namespace, localName as valid string', (done): void => {
        setTimeout((): void => {
            expect((): void => { xmlWriter.writeStartElement('xmlns', 'root', 'element'); }).toThrow(new Error('InvalidArgumentException: Prefix "xmlns" is reserved for use by XML.'));
            done();
        }, 50);
    });
    it('Prefix =xmlns, and namespace aa valid string', (done): void => {
        setTimeout((): void => {
            expect((): void => { xmlWriter.writeStartElement('xmlns', 'root', 'element'); }).toThrow(new Error('InvalidArgumentException: Prefix "xmlns" is reserved for use by XML.'));
            done();
        }, 50);
    });
    it('Prefix,localName with invalid special character @ and namespace as null', (done): void => {
        setTimeout((): void => {
            expect((): void => { xmlWriter.writeStartElement('w', 'ro@ot', null); }).toThrow(new Error('InvalidArgumentException: invalid name character'));
            done();
        }, 50);
    });
    it('Prefix,localName with invalid special character \'(\' and namespace as null', (done): void => {
        setTimeout((): void => {
            expect((): void => { xmlWriter.writeStartElement('w', 'ro(ot', null); }).toThrow(new Error('InvalidArgumentException: invalid name character'));
            done();
        }, 50);
    });
    it('Prefix,localName with invalid special character \')\' and namespace as null', (done): void => {
        setTimeout((): void => {
            expect((): void => { xmlWriter.writeStartElement('w', 'ro)ot', null); }).toThrow(new Error('InvalidArgumentException: invalid name character'));
            done();
        }, 50);
    });
    it('Prefix,localName with invalid special character \' \' and namespace as null', (done): void => {
        setTimeout((): void => {
            expect((): void => { xmlWriter.writeStartElement('w', 'ro ot', null); }).toThrow(new Error('InvalidArgumentException: invalid name character'));
            done();
        }, 50);
    });
    it('Prefix,localName with invalid special character \'$\' and namespace as null', (done): void => {
        setTimeout((): void => {
            expect((): void => { xmlWriter.writeStartElement('w', 'ro$ot', null); }).toThrow(new Error('InvalidArgumentException: invalid name character'));
            done();
        }, 50);
    });
    it('Prefix,localName with invalid special character \':\' and namespace as null', (done): void => {
        setTimeout((): void => {
            expect((): void => { xmlWriter.writeStartElement('w', 'ro:ot', null); }).toThrow(new Error('InvalidArgumentException: invalid name character'));
            done();
        }, 50);
    });
    it('Prefix,localName with invalid special character \'#\' and namespace as null', (done): void => {
        setTimeout((): void => {
            expect((): void => { xmlWriter.writeStartElement('w', 'ro#ot', null); }).toThrow(new Error('InvalidArgumentException: invalid name character'));
            done();
        }, 50);
    });
    it('Prefix,localName with invalid special character \'*\' and namespace as null', (done): void => {
        setTimeout((): void => {
            expect((): void => { xmlWriter.writeStartElement('w', 'ro**ot', null); }).toThrow(new Error('InvalidArgumentException: invalid name character'));
            done();
        }, 50);
    });
    it('Prefix and namespace as null,localName with invalid special character \'<\' ', (done): void => {
        setTimeout((): void => {
            expect((): void => { xmlWriter.writeStartElement('w', 'ro<ot', null); }).toThrow(new Error('InvalidArgumentException: invalid name character'));
            done();
        }, 50);
    });
    it('Element\'s prefix=xmlns ,ns=http://www.w3.org/2000/xmlns/ ', (done): void => {
        setTimeout((): void => {
            expect((): void => { xmlWriter.writeStartElement('xmlns', "book", 'http://www.w3.org/2000/xmlns/'); }).toThrow(new Error('InvalidArgumentException: Prefix "xmlns" is reserved for use by XML.'));
            done();
        }, 50);
    });
    it('Element\'s prefix=xml ,ns=http://www.w3.org/2000/xmlns/ ', (done): void => {
        setTimeout((): void => {
            expect((): void => { xmlWriter.writeStartElement('xml', "book", 'http://www.w3.org/2000/xmlns/'); }).toThrow(new Error('InvalidArgumentException: Xml String'));
            done();
        }, 50);
    });
    it('Element\'s prefix as valid string ,ns=http://www.w3.org/XML/1998/namespace ', (done): void => {
        setTimeout((): void => {
            expect((): void => { xmlWriter.writeStartElement('w', "book", 'http://www.w3.org/XML/1998/namespace'); }).toThrow(new Error('InvalidArgumentException'));
            done();
        }, 50);
    });
    it('Element\'s prefix as valid string,ns=http://www.w3.org/2000/xmlns/ ', (done): void => {
        setTimeout((): void => {
            expect((): void => { xmlWriter.writeStartElement('w', "book", 'http://www.w3.org/2000/xmlns/'); }).toThrow(new Error('InvalidArgumentException'));
            done();
        }, 50);
    });
});
describe('Create single empty element with start document', (): void => {
    let xmlWriter: XmlWriter;
    let fileReader: FileReader;
    let xmlText: string | ArrayBuffer;
    beforeEach((): void => {
        /**
         * instantiate XmlWriter class
         */
        xmlWriter = new XmlWriter();
        /**
         * creates instance of FileReader class
         */
        fileReader = new FileReader();
        fileReader.onload = (): void => {
            /**
             * gets xml text from bolb
             */
            xmlText = fileReader.result;
        };
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
    });
    afterEach((): void => {
        xmlWriter.destroy();
        xmlWriter = undefined;
        fileReader = undefined;
        xmlText = '';
    });
    it('Prefix and namespace as null with start Document standalone true', (done): void => {
        xmlWriter.writeStartDocument(true);
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="yes"?><root />');
            done();
        }, 50);
    });
    it('Prefix and namespace as null with start Document standalone false', (done): void => {
        xmlWriter.writeStartDocument(false);
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="no"?><root />');
            done();
        }, 50);
    });
    it('Prefix and namespace as null with start Document standalone empty', (done): void => {
        xmlWriter.writeStartDocument();
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root />');
            done();
        }, 50);
    });
    it('Prefix and namespace as empty with start Document standalone true', (done): void => {
        xmlWriter.writeStartDocument(true);
        xmlWriter.writeStartElement('', 'root', '');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="yes"?><root />');
            done();
        }, 50);
    });
    it('Prefix and namespace as empty with start Document standalone false', (done): void => {
        xmlWriter.writeStartDocument(false);
        xmlWriter.writeStartElement('', 'root', '');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="no"?><root />');
            done();
        }, 50);
    });
    it('Prefix and namespace as empty with start Document standalone empty', (done): void => {
        xmlWriter.writeStartDocument();
        xmlWriter.writeStartElement('', 'root', '');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root />');
            done();
        }, 50);
    });
    it('Prefix and namespace as valid string with start document standalone true', (done): void => {
        xmlWriter.writeStartDocument(true);
        xmlWriter.writeStartElement('w', 'root', 'xmlns');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="yes"?><w:root xmlns:w="xmlns" />');
            done();
        }, 50);
    });
    it('Prefix and namespace as valid string with start document standalone false', (done): void => {
        xmlWriter.writeStartDocument(false);
        xmlWriter.writeStartElement('w', 'root', 'xmlns');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="no"?><w:root xmlns:w="xmlns" />');
            done();
        }, 50);
    });
    it('Prefix and namespace as valid string with start document standalone empty', (done): void => {
        xmlWriter.writeStartDocument();
        xmlWriter.writeStartElement('w', 'root', 'xmlns');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><w:root xmlns:w="xmlns" />');
            done();
        }, 50);
    });
    it('Prefix as null and namespace as valid string with start document standalone true', (done): void => {
        xmlWriter.writeStartDocument(true);
        xmlWriter.writeStartElement(null, 'root', 'xmlns');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="yes"?><root xmlns="xmlns" />');
            done();
        }, 50);
    });
    it('Prefix as null and namespace as valid string with start document standalone false', (done): void => {
        xmlWriter.writeStartDocument(false);
        xmlWriter.writeStartElement(null, 'root', 'xmlns');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="no"?><root xmlns="xmlns" />');
            done();
        }, 50);
    });
    it('Prefix as null and namespace as valid string with start document standalone empty', (done): void => {
        xmlWriter.writeStartDocument();
        xmlWriter.writeStartElement(null, 'root', 'xmlns');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root xmlns="xmlns" />');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string with start document standalone true', (done): void => {
        xmlWriter.writeStartDocument(true);
        xmlWriter.writeStartElement('', 'root', "xmlns");
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="yes"?><root xmlns="xmlns" />');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string with start document standalone false', (done): void => {
        xmlWriter.writeStartDocument(false);
        xmlWriter.writeStartElement('', 'root', "xmlns");
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="no"?><root xmlns="xmlns" />');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string with start document standalone false', (done): void => {
        xmlWriter.writeStartDocument();
        xmlWriter.writeStartElement('', 'root', "xmlns");
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root xmlns="xmlns" />');
            done();
        }, 50);
    });
    it('Empty start Document without child element', (done): void => {
        xmlWriter.writeStartElement('', 'book', '');
        setTimeout((): void => {
            expect((): void => { xmlWriter.writeStartDocument(); }).toThrow(new Error('InvalidOperationException: Wrong Token'));
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string with start document standalone false,end document befor end element', (done): void => {
        xmlWriter.writeStartDocument();
        xmlWriter.writeStartElement('', 'root', "xmlns");
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root xmlns="xmlns" />');
            done();
        }, 50);
    });
});
describe('create single non empty element without start document', (): void => {
    let xmlWriter: XmlWriter;
    let fileReader: FileReader;
    let xmlText: string | ArrayBuffer;
    beforeEach((): void => {
        /**
         * instantiate XmlWriter class
         */
        xmlWriter = new XmlWriter();
        /**
         * creates instance of FileReader class
         */
        fileReader = new FileReader();
        fileReader.onload = (): void => {
            /**
             * gets xml text from bolb
             */
            xmlText = fileReader.result;
        };
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
    });
    afterEach((): void => {
        xmlWriter.destroy();
        xmlWriter = undefined;
        fileReader = undefined;
        xmlText = '';
    });
    it('Prefix and namespace as null & value as valid string ', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeString('value');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root>value</root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as null & value as empty ', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeString('');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root></root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as null & value as null ', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeString(null);
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root />');
            done();
        }, 50);
    });
    it('Prefix and namespace as empty  & value as valid string ', (done): void => {
        xmlWriter.writeStartElement('', 'root', '');
        xmlWriter.writeString('value');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root>value</root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as empty  & value as empty ', (done): void => {
        xmlWriter.writeStartElement('', 'root', '');
        xmlWriter.writeString('');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root></root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as empty  & value as  null', (done): void => {
        xmlWriter.writeStartElement('', 'root', '');
        xmlWriter.writeString(null);
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root />');
            done();
        }, 50);
    });
    it('Prefix and namespace as valid string  & value as valid string ', (done): void => {
        xmlWriter.writeStartElement('w', 'root', 'xmlns');
        xmlWriter.writeString('value');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><w:root xmlns:w="xmlns">value</w:root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as valid string  & value as empty ', (done): void => {
        xmlWriter.writeStartElement('w', 'root', 'xmlns');
        xmlWriter.writeString('');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><w:root xmlns:w="xmlns"></w:root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as valid string  & value as null ', (done): void => {
        xmlWriter.writeStartElement('w', 'root', 'xmlns');
        xmlWriter.writeString(null);
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><w:root xmlns:w="xmlns" />');
            done();
        }, 50);
    });
    it('Prefix as null and namespace as valid string  & value as valid string ', (done): void => {
        xmlWriter.writeStartElement(null, 'root', 'xmlns');
        xmlWriter.writeString('value');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root xmlns="xmlns">value</root>');
            done();
        }, 50);
    });
    it('Prefix as null and namespace as valid string  & value as empty string ', (done): void => {
        xmlWriter.writeStartElement(null, 'root', 'xmlns');
        xmlWriter.writeString('');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root xmlns="xmlns"></root>');
            done();
        }, 50);
    });
    it('Prefix as null and namespace as valid string  & value as null', (done): void => {
        xmlWriter.writeStartElement(null, 'root', 'xmlns');
        xmlWriter.writeString(null);
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root xmlns="xmlns" />');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as valid string ', (done): void => {
        xmlWriter.writeStartElement('', 'root', "xmlns");
        xmlWriter.writeString('value');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root xmlns="xmlns">value</root>');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as empty string ', (done): void => {
        xmlWriter.writeStartElement('', 'root', "xmlns");
        xmlWriter.writeString('');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root xmlns="xmlns"></root>');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as null ', (done): void => {
        xmlWriter.writeStartElement('', 'root', "xmlns");
        xmlWriter.writeString(null);
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root xmlns="xmlns" />');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as valid string with special char & ', (done): void => {
        xmlWriter.writeStartElement('', 'root', "xmlns");
        xmlWriter.writeString('value&');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root xmlns="xmlns">value&amp;</root>');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as valid string with special char < ', (done): void => {
        xmlWriter.writeStartElement('', 'root', "xmlns");
        xmlWriter.writeString('value<');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root xmlns="xmlns">value&lt;</root>');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as valid string with special char > ', (done): void => {
        xmlWriter.writeStartElement('', 'root', "xmlns");
        xmlWriter.writeString('value>');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root xmlns="xmlns">value&gt;</root>');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as valid string with special char \" ', (done): void => {
        xmlWriter.writeStartElement('', 'root', "xmlns");
        xmlWriter.writeString('value\"');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root xmlns="xmlns">value\"</root>');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as valid string with special char \' ', (done): void => {
        xmlWriter.writeStartElement('', 'root', "xmlns");
        xmlWriter.writeString('value\'');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root xmlns="xmlns">value\'</root>');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as valid string with multiple special character', (done): void => {
        xmlWriter.writeStartElement('', 'root', "xmlns");
        xmlWriter.writeString('value&&<\"');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root xmlns="xmlns">value&amp;&amp;&lt;\"</root>');
            done();
        }, 50);
    });
    it('writeString at XmlWriteStart initial', (done): void => {
        setTimeout((): void => {
            expect((): void => { xmlWriter.writeString('value&&<\"'); }).toThrow(new Error('InvalidOperationException: Wrong Token'));
            done();
        }, 50);
    });
    it('writeString at XmlWriteStart initial', (done): void => {
        xmlWriter.writeStartElement('', 'root', '');
        xmlWriter.writeString('parent');
        xmlWriter.writeEndElement();
        xmlWriter.destroy();
        setTimeout((): void => {
            expect((): void => { xmlWriter.writeStartElement('', 'root', ''); }).toThrow(new Error('InvalidOperationException: Wrong Token'));
            done();
        }, 50);
    });
});
describe('create single non empty element with start document', (): void => {
    let xmlWriter: XmlWriter;
    let fileReader: FileReader;
    let xmlText: string | ArrayBuffer;
    beforeEach((): void => {
        /**
         * instantiate XmlWriter class
         */
        xmlWriter = new XmlWriter();
        /**
         * creates instance of FileReader class
         */
        fileReader = new FileReader();
        fileReader.onload = (): void => {
            /**
             * gets xml text from bolb
             */
            xmlText = fileReader.result;
        };
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
    });
    afterEach((): void => {
        xmlWriter.destroy();
        xmlWriter = undefined;
        fileReader = undefined;
        xmlText = '';
    });
    it('Prefix and namespace as null & value as valid string,start document empty ', (done): void => {
        xmlWriter.writeStartDocument();
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeString('value');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root>value</root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as null & value as valid string,start document true ', (done): void => {
        xmlWriter.writeStartDocument(true);
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeString('value');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="yes"?><root>value</root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as null & value as valid string,start document false ', (done): void => {
        xmlWriter.writeStartDocument(false);
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeString('value');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="no"?><root>value</root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as null & value as empty,start document empty ', (done): void => {
        xmlWriter.writeStartDocument();
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeString('');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root></root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as null & value as empty,start document true ', (done): void => {
        xmlWriter.writeStartDocument(true);
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeString('');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="yes"?><root></root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as null & value as empty,start document false ', (done): void => {
        xmlWriter.writeStartDocument(false);
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeString('');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="no"?><root></root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as null & value as null,start document empty ', (done): void => {
        xmlWriter.writeStartDocument();
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeString(null);
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root />');
            done();
        }, 50);
    });
    it('Prefix and namespace as null & value as null,start document true ', (done): void => {
        xmlWriter.writeStartDocument(true);
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeString(null);
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="yes"?><root />');
            done();
        }, 50);
    });
    it('Prefix and namespace as null & value as null,start document false ', (done): void => {
        xmlWriter.writeStartDocument(false);
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeString(null);
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="no"?><root />');
            done();
        }, 50);
    });
    it('Prefix and namespace as empty  & value as valid string,start document empty ', (done): void => {
        xmlWriter.writeStartDocument();
        xmlWriter.writeStartElement('', 'root', '');
        xmlWriter.writeString('value');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root>value</root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as empty  & value as valid string,start document true ', (done): void => {
        xmlWriter.writeStartDocument(true);
        xmlWriter.writeStartElement('', 'root', '');
        xmlWriter.writeString('value');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="yes"?><root>value</root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as empty  & value as valid string,start document false ', (done): void => {
        xmlWriter.writeStartDocument(false);
        xmlWriter.writeStartElement('', 'root', '');
        xmlWriter.writeString('value');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="no"?><root>value</root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as empty  & value as  null,start document empty', (done): void => {
        xmlWriter.writeStartDocument();
        xmlWriter.writeStartElement('', 'root', '');
        xmlWriter.writeString(null);
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root />');
            done();
        }, 50);
    });
    it('Prefix and namespace as empty  & value as  null,start document true', (done): void => {
        xmlWriter.writeStartDocument(true);
        xmlWriter.writeStartElement('', 'root', '');
        xmlWriter.writeString(null);
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="yes"?><root />');
            done();
        }, 50);
    });
    it('Prefix and namespace as empty  & value as  null,start document false', (done): void => {
        xmlWriter.writeStartDocument(false);
        xmlWriter.writeStartElement('', 'root', '');
        xmlWriter.writeString(null);
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="no"?><root />');
            done();
        }, 50);
    });
    it('Prefix and namespace as valid string  & value as valid string,start document empty ', (done): void => {
        xmlWriter.writeStartDocument();
        xmlWriter.writeStartElement('w', 'root', 'xmlns');
        xmlWriter.writeString('value');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><w:root xmlns:w="xmlns">value</w:root>');
            done();
        }, 50);
    });
    it('Prefix,namespace,value as valid string with two writeString method ', (done): void => {
        xmlWriter.writeStartDocument();
        xmlWriter.writeStartElement('w', 'root', 'xmlns');
        xmlWriter.writeString('value');
        xmlWriter.writeString(' data');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><w:root xmlns:w="xmlns">value data</w:root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as valid string  & value as valid string,start document true ', (done): void => {
        xmlWriter.writeStartDocument(true);
        xmlWriter.writeStartElement('w', 'root', 'xmlns');
        xmlWriter.writeString('value');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="yes"?><w:root xmlns:w="xmlns">value</w:root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as valid string  & value as valid string,start document false ', (done): void => {
        xmlWriter.writeStartDocument(false);
        xmlWriter.writeStartElement('w', 'root', 'xmlns');
        xmlWriter.writeString('value');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="no"?><w:root xmlns:w="xmlns">value</w:root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as valid string  & value as empty,start document empty ', (done): void => {
        xmlWriter.writeStartDocument();
        xmlWriter.writeStartElement('w', 'root', 'xmlns');
        xmlWriter.writeString('');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><w:root xmlns:w="xmlns"></w:root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as valid string  & value as empty,start document true ', (done): void => {
        xmlWriter.writeStartDocument(true);
        xmlWriter.writeStartElement('w', 'root', 'xmlns');
        xmlWriter.writeString('');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="yes"?><w:root xmlns:w="xmlns"></w:root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as valid string  & value as empty,start document false ', (done): void => {
        xmlWriter.writeStartDocument(false);
        xmlWriter.writeStartElement('w', 'root', 'xmlns');
        xmlWriter.writeString('');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="no"?><w:root xmlns:w="xmlns"></w:root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as valid string  & value as null,start document empty ', (done): void => {
        xmlWriter.writeStartDocument();
        xmlWriter.writeStartElement('w', 'root', 'xmlns');
        xmlWriter.writeString(null);
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><w:root xmlns:w="xmlns" />');
            done();
        }, 50);
    });
    it('Prefix and namespace as valid string  & value as null,start document true ', (done): void => {
        xmlWriter.writeStartDocument(true);
        xmlWriter.writeStartElement('w', 'root', 'xmlns');
        xmlWriter.writeString(null);
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="yes"?><w:root xmlns:w="xmlns" />');
            done();
        }, 50);
    });
    it('Prefix and namespace as valid string  & value as null,start document false ', (done): void => {
        xmlWriter.writeStartDocument(false);
        xmlWriter.writeStartElement('w', 'root', 'xmlns');
        xmlWriter.writeString(null);
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="no"?><w:root xmlns:w="xmlns" />');
            done();
        }, 50);
    });
    it('Prefix as null and namespace as valid string  & value as valid string ,start document empty', (done): void => {
        xmlWriter.writeStartDocument();
        xmlWriter.writeStartElement(null, 'root', 'xmlns');
        xmlWriter.writeString('value');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root xmlns="xmlns">value</root>');
            done();
        }, 50);
    });
    it('Prefix as null and namespace as valid string  & value as valid string ,start document false', (done): void => {
        xmlWriter.writeStartDocument(false);
        xmlWriter.writeStartElement(null, 'root', 'xmlns');
        xmlWriter.writeString('value');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="no"?><root xmlns="xmlns">value</root>');
            done();
        }, 50);
    });
    it('Prefix as null and namespace as valid string  & value as valid string ,start document true', (done): void => {
        xmlWriter.writeStartDocument(true);
        xmlWriter.writeStartElement(null, 'root', 'xmlns');
        xmlWriter.writeString('value');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="yes"?><root xmlns="xmlns">value</root>');
            done();
        }, 50);
    });
    it('Prefix as null and namespace as valid string  & value as empty string,start document empty ', (done): void => {
        xmlWriter.writeStartDocument();
        xmlWriter.writeStartElement(null, 'root', 'xmlns');
        xmlWriter.writeString('');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root xmlns="xmlns"></root>');
            done();
        }, 50);
    });
    it('Prefix as null and namespace as valid string  & value as empty string,start document false ', (done): void => {
        xmlWriter.writeStartDocument(false);
        xmlWriter.writeStartElement(null, 'root', 'xmlns');
        xmlWriter.writeString('');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="no"?><root xmlns="xmlns"></root>');
            done();
        }, 50);
    });
    it('Prefix as null and namespace as valid string  & value as empty string,start document true ', (done): void => {
        xmlWriter.writeStartDocument(true);
        xmlWriter.writeStartElement(null, 'root', 'xmlns');
        xmlWriter.writeString('');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="yes"?><root xmlns="xmlns"></root>');
            done();
        }, 50);
    });
    it('Prefix as null and namespace as valid string  & value as null,start document empty', (done): void => {
        xmlWriter.writeStartDocument();
        xmlWriter.writeStartElement(null, 'root', 'xmlns');
        xmlWriter.writeString(null);
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root xmlns="xmlns" />');
            done();
        }, 50);
    });
    it('Prefix as null and namespace as valid string  & value as null,start document false', (done): void => {
        xmlWriter.writeStartDocument(false);
        xmlWriter.writeStartElement(null, 'root', 'xmlns');
        xmlWriter.writeString(null);
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="no"?><root xmlns="xmlns" />');
            done();
        }, 50);
    });
    it('Prefix as null and namespace as valid string  & value as null,start document true', (done): void => {
        xmlWriter.writeStartDocument(true);
        xmlWriter.writeStartElement(null, 'root', 'xmlns');
        xmlWriter.writeString(null);
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="yes"?><root xmlns="xmlns" />');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as valid string,start document empty ', (done): void => {
        xmlWriter.writeStartDocument();
        xmlWriter.writeStartElement('', 'root', "xmlns");
        xmlWriter.writeString('value');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root xmlns="xmlns">value</root>');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as valid string,start document false ', (done): void => {
        xmlWriter.writeStartDocument(false);
        xmlWriter.writeStartElement('', 'root', "xmlns");
        xmlWriter.writeString('value');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="no"?><root xmlns="xmlns">value</root>');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as valid string,start document true ', (done): void => {
        xmlWriter.writeStartDocument(true);
        xmlWriter.writeStartElement('', 'root', "xmlns");
        xmlWriter.writeString('value');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="yes"?><root xmlns="xmlns">value</root>');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as empty string,start document empty ', (done): void => {
        xmlWriter.writeStartDocument();
        xmlWriter.writeStartElement('', 'root', "xmlns");
        xmlWriter.writeString('');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root xmlns="xmlns"></root>');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as empty string,start document false ', (done): void => {
        xmlWriter.writeStartDocument(false);
        xmlWriter.writeStartElement('', 'root', "xmlns");
        xmlWriter.writeString('');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="no"?><root xmlns="xmlns"></root>');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as empty string,start document true ', (done): void => {
        xmlWriter.writeStartDocument(true);
        xmlWriter.writeStartElement('', 'root', "xmlns");
        xmlWriter.writeString('');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="yes"?><root xmlns="xmlns"></root>');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as null,start document empty ', (done): void => {
        xmlWriter.writeStartDocument();
        xmlWriter.writeStartElement('', 'root', "xmlns");
        xmlWriter.writeString(null);
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root xmlns="xmlns" />');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as null,start document false ', (done): void => {
        xmlWriter.writeStartDocument(false);
        xmlWriter.writeStartElement('', 'root', "xmlns");
        xmlWriter.writeString(null);
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="no"?><root xmlns="xmlns" />');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as null,start document true ', (done): void => {
        xmlWriter.writeStartDocument(true);
        xmlWriter.writeStartElement('', 'root', "xmlns");
        xmlWriter.writeString(null);
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="yes"?><root xmlns="xmlns" />');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as valid string with special char &,start document empty ', (done): void => {
        xmlWriter.writeStartDocument();
        xmlWriter.writeStartElement('', 'root', "xmlns");
        xmlWriter.writeString('value&');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root xmlns="xmlns">value&amp;</root>');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as valid string with special char &,start document false ', (done): void => {
        xmlWriter.writeStartDocument(false);
        xmlWriter.writeStartElement('', 'root', "xmlns");
        xmlWriter.writeString('value&');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="no"?><root xmlns="xmlns">value&amp;</root>');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as valid string with special char &,start document true ', (done): void => {
        xmlWriter.writeStartDocument(true);
        xmlWriter.writeStartElement('', 'root', "xmlns");
        xmlWriter.writeString('value&');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="yes"?><root xmlns="xmlns">value&amp;</root>');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as valid string with special char <,start document empty ', (done): void => {
        xmlWriter.writeStartDocument();
        xmlWriter.writeStartElement('', 'root', "xmlns");
        xmlWriter.writeString('value<');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root xmlns="xmlns">value&lt;</root>');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as valid string with special char <,start document false ', (done): void => {
        xmlWriter.writeStartDocument(false);
        xmlWriter.writeStartElement('', 'root', "xmlns");
        xmlWriter.writeString('value<');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="no"?><root xmlns="xmlns">value&lt;</root>');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as valid string with special char <,start document true ', (done): void => {
        xmlWriter.writeStartDocument(true);
        xmlWriter.writeStartElement('', 'root', "xmlns");
        xmlWriter.writeString('value<');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="yes"?><root xmlns="xmlns">value&lt;</root>');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as valid string with special char >,start document empty ', (done): void => {
        xmlWriter.writeStartDocument();
        xmlWriter.writeStartElement('', 'root', "xmlns");
        xmlWriter.writeString('value>');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root xmlns="xmlns">value&gt;</root>');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as valid string with special char >,start document empty ', (done): void => {
        xmlWriter.writeStartDocument(false);
        xmlWriter.writeStartElement('', 'root', "xmlns");
        xmlWriter.writeString('value>');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="no"?><root xmlns="xmlns">value&gt;</root>');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as valid string with special char >,start document empty ', (done): void => {
        xmlWriter.writeStartDocument(true);
        xmlWriter.writeStartElement('', 'root', "xmlns");
        xmlWriter.writeString('value>');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="yes"?><root xmlns="xmlns">value&gt;</root>');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as valid string with special char \" ,start document empty', (done): void => {
        xmlWriter.writeStartDocument();
        xmlWriter.writeStartElement('', 'root', "xmlns");
        xmlWriter.writeString('value\"');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root xmlns="xmlns">value\"</root>');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as valid string with special char \" ,start document false', (done): void => {
        xmlWriter.writeStartDocument(false);
        xmlWriter.writeStartElement('', 'root', "xmlns");
        xmlWriter.writeString('value\"');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="no"?><root xmlns="xmlns">value\"</root>');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as valid string with special char \" ,start document true', (done): void => {
        xmlWriter.writeStartDocument(true);
        xmlWriter.writeStartElement('', 'root', "xmlns");
        xmlWriter.writeString('value\"');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="yes"?><root xmlns="xmlns">value\"</root>');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as valid string with special char \',start document empty ', (done): void => {
        xmlWriter.writeStartDocument();
        xmlWriter.writeStartElement('', 'root', "xmlns");
        xmlWriter.writeString('value\'');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root xmlns="xmlns">value\'</root>');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as valid string with special char \',start document flase ', (done): void => {
        xmlWriter.writeStartDocument(false);
        xmlWriter.writeStartElement('', 'root', "xmlns");
        xmlWriter.writeString('value\'');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="no"?><root xmlns="xmlns">value\'</root>');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as valid string with special char \',start document true ', (done): void => {
        xmlWriter.writeStartDocument(true);
        xmlWriter.writeStartElement('', 'root', "xmlns");
        xmlWriter.writeString('value\'');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="yes"?><root xmlns="xmlns">value\'</root>');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as valid string with multiple special character,start document empty', (done): void => {
        xmlWriter.writeStartDocument();
        xmlWriter.writeStartElement('', 'root', "xmlns");
        xmlWriter.writeString('value&&<\"');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument()
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root xmlns="xmlns">value&amp;&amp;&lt;\"</root>');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as valid string with multiple special character,start document false', (done): void => {
        xmlWriter.writeStartDocument(false);
        xmlWriter.writeStartElement('', 'root', "xmlns");
        xmlWriter.writeString('value&&<\"');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument()
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="no"?><root xmlns="xmlns">value&amp;&amp;&lt;\"</root>');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as valid string with multiple special character,start document true', (done): void => {
        xmlWriter.writeStartDocument(true);
        xmlWriter.writeStartElement('', 'root', "xmlns");
        xmlWriter.writeString('value&&<\"');
        xmlWriter.writeEndElement();
        xmlWriter.writeEndDocument()
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="yes"?><root xmlns="xmlns">value&amp;&amp;&lt;\"</root>');
            done();
        }, 50);
    });
});
describe('create single non empty element with writeElementString', (): void => {
    let xmlWriter: XmlWriter;
    let fileReader: FileReader;
    let xmlText: string | ArrayBuffer;
    beforeEach((): void => {
        /**
         * instantiate XmlWriter class
         */
        xmlWriter = new XmlWriter();
        /**
         * creates instance of FileReader class
         */
        fileReader = new FileReader();
        fileReader.onload = (): void => {
            /**
             * gets xml text from bolb
             */
            xmlText = fileReader.result;
        };
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
    });
    afterEach((): void => {
        xmlWriter.destroy();
        xmlWriter = undefined;
        fileReader = undefined;
        xmlText = '';
    });
    it('Prefix,namespace,value as valid string', (done): void => {
        xmlWriter.writeElementString(null, 'root', null, 'value');
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root>value</root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as null & value as valid string,start document true ', (done): void => {
        xmlWriter.writeStartDocument(true);
        xmlWriter.writeElementString(null, 'root', null, 'value');
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="yes"?><root>value</root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as null & value as valid string,start document false ', (done): void => {
        xmlWriter.writeStartDocument(false);
        xmlWriter.writeElementString(null, 'root', null, 'value');
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="no"?><root>value</root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as null & value as empty,start document empty ', (done): void => {
        xmlWriter.writeStartDocument();
        xmlWriter.writeElementString(null, 'root', null, '');
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root />');
            done();
        }, 50);
    });
    it('Prefix and namespace as null & value as empty,start document true ', (done): void => {
        xmlWriter.writeStartDocument(true);
        xmlWriter.writeElementString(null, 'root', null, '');
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="yes"?><root />');
            done();
        }, 50);
    });
    it('Prefix and namespace as null & value as empty,start document false ', (done): void => {
        xmlWriter.writeStartDocument(false);
        xmlWriter.writeElementString(null, 'root', null, '');
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="no"?><root />');
            done();
        }, 50);
    });
    it('Prefix and namespace as null & value as null,start document empty ', (done): void => {
        xmlWriter.writeStartDocument();
        xmlWriter.writeElementString(null, 'root', null, null);
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root />');
            done();
        }, 50);
    });
    it('Prefix and namespace as null & value as null,start document true ', (done): void => {
        xmlWriter.writeStartDocument(true);
        xmlWriter.writeElementString(null, 'root', null, null);
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="yes"?><root />');
            done();
        }, 50);
    });
    it('Prefix and namespace as null & value as null,start document false ', (done): void => {
        xmlWriter.writeStartDocument(false);
        xmlWriter.writeElementString(null, 'root', null, null);
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="no"?><root />');
            done();
        }, 50);
    });
    it('Prefix and namespace as empty  & value as valid string,start document empty ', (done): void => {
        xmlWriter.writeStartDocument();
        xmlWriter.writeElementString('', 'root', '', 'value');

        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root>value</root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as empty  & value as valid string,start document true ', (done): void => {
        xmlWriter.writeStartDocument(true);
        xmlWriter.writeElementString('', 'root', '', 'value');
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="yes"?><root>value</root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as empty  & value as valid string,start document false ', (done): void => {
        xmlWriter.writeStartDocument(false);
        xmlWriter.writeElementString('', 'root', '', 'value');
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="no"?><root>value</root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as empty  & value as  null,start document empty', (done): void => {
        xmlWriter.writeStartDocument();
        xmlWriter.writeElementString('', 'root', '', null);
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root />');
            done();
        }, 50);
    });
    it('Prefix and namespace as empty  & value as  null,start document true', (done): void => {
        xmlWriter.writeStartDocument(true);
        xmlWriter.writeElementString('', 'root', '', null);
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="yes"?><root />');
            done();
        }, 50);
    });
    it('Prefix and namespace as empty  & value as  null,start document false', (done): void => {
        xmlWriter.writeStartDocument(false);
        xmlWriter.writeElementString('', 'root', '', null);
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="no"?><root />');
            done();
        }, 50);
    });
    it('Prefix and namespace as valid string  & value as valid string,start document empty ', (done): void => {
        xmlWriter.writeStartDocument();
        xmlWriter.writeElementString('w', 'root', 'xmlns', 'value');
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><w:root xmlns:w="xmlns">value</w:root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as valid string  & value as valid string,start document true ', (done): void => {
        xmlWriter.writeStartDocument(true);
        xmlWriter.writeElementString('w', 'root', 'xmlns', 'value');
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="yes"?><w:root xmlns:w="xmlns">value</w:root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as valid string  & value as valid string,start document false ', (done): void => {
        xmlWriter.writeStartDocument(false);
        xmlWriter.writeElementString('w', 'root', 'xmlns', 'value');
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="no"?><w:root xmlns:w="xmlns">value</w:root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as valid string  & value as empty,start document empty ', (done): void => {
        xmlWriter.writeStartDocument();
        xmlWriter.writeElementString('w', 'root', 'xmlns', '');
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><w:root xmlns:w="xmlns" />');
            done();
        }, 50);
    });
    it('Prefix and namespace as valid string  & value as empty,start document true ', (done): void => {
        xmlWriter.writeStartDocument(true);
        xmlWriter.writeElementString('w', 'root', 'xmlns', '');
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="yes"?><w:root xmlns:w="xmlns" />');
            done();
        }, 50);
    });
    it('Prefix and namespace as valid string  & value as empty,start document false ', (done): void => {
        xmlWriter.writeStartDocument(false);
        xmlWriter.writeElementString('w', 'root', 'xmlns', '');
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="no"?><w:root xmlns:w="xmlns" />');
            done();
        }, 50);
    });
    it('Prefix and namespace as valid string  & value as null,start document empty ', (done): void => {
        xmlWriter.writeStartDocument();
        xmlWriter.writeElementString('w', 'root', 'xmlns', null);
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><w:root xmlns:w="xmlns" />');
            done();
        }, 50);
    });
    it('Prefix and namespace as valid string  & value as null,start document true ', (done): void => {
        xmlWriter.writeStartDocument(true);
        xmlWriter.writeElementString('w', 'root', 'xmlns', null);
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="yes"?><w:root xmlns:w="xmlns" />');
            done();
        }, 50);
    });
    it('Prefix as null and namespace as valid string  & value as valid string ', (done): void => {
        xmlWriter.writeElementString(null, 'root', 'xmlns', 'value');
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root xmlns="xmlns">value</root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as valid string  & value as null,start document false ', (done): void => {
        xmlWriter.writeStartDocument(false);
        xmlWriter.writeElementString('w', 'root', 'xmlns', null);
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="no"?><w:root xmlns:w="xmlns" />');
            done();
        }, 50);
    });
    it('Prefix as null and namespace as valid string  & value as valid string ,start document empty', (done): void => {
        xmlWriter.writeStartDocument();
        xmlWriter.writeElementString(null, 'root', 'xmlns', 'value');
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root xmlns="xmlns">value</root>');
            done();
        }, 50);
    });
    it('Prefix as null and namespace as valid string  & value as valid string ,start document false', (done): void => {
        xmlWriter.writeStartDocument(false);
        xmlWriter.writeElementString(null, 'root', 'xmlns', 'value');
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="no"?><root xmlns="xmlns">value</root>');
            done();
        }, 50);
    });
    it('Prefix as null and namespace as valid string  & value as valid string ,start document true', (done): void => {
        xmlWriter.writeStartDocument(true);
        xmlWriter.writeElementString(null, 'root', 'xmlns', 'value');
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="yes"?><root xmlns="xmlns">value</root>');
            done();
        }, 50);
    });
    it('Prefix as null and namespace as valid string  & value as empty string,start document empty ', (done): void => {
        xmlWriter.writeStartDocument();
        xmlWriter.writeElementString(null, 'root', 'xmlns', '');
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root xmlns="xmlns" />');
            done();
        }, 50);
    });
    it('Prefix as null and namespace as valid string  & value as empty string,start document false ', (done): void => {
        xmlWriter.writeStartDocument(false);
        xmlWriter.writeElementString(null, 'root', 'xmlns', '');
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="no"?><root xmlns="xmlns" />');
            done();
        }, 50);
    });
    it('Prefix as null and namespace as valid string  & value as empty string,start document true ', (done): void => {
        xmlWriter.writeStartDocument(true);
        xmlWriter.writeElementString(null, 'root', 'xmlns', '');
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="yes"?><root xmlns="xmlns" />');
            done();
        }, 50);
    });
    it('Prefix as null and namespace as valid string  & value as null,start document empty', (done): void => {
        xmlWriter.writeStartDocument();
        xmlWriter.writeElementString(null, 'root', 'xmlns', null);
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root xmlns="xmlns" />');
            done();
        }, 50);
    });
    it('Prefix as null and namespace as valid string  & value as null,start document false', (done): void => {
        xmlWriter.writeStartDocument(false);
        xmlWriter.writeElementString(null, 'root', 'xmlns', null);
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="no"?><root xmlns="xmlns" />');
            done();
        }, 50);
    });
    it('Prefix as null and namespace as valid string  & value as null,start document true', (done): void => {
        xmlWriter.writeStartDocument(true);
        xmlWriter.writeElementString(null, 'root', 'xmlns', null);
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="yes"?><root xmlns="xmlns" />');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as valid string,start document empty ', (done): void => {
        xmlWriter.writeStartDocument();
        xmlWriter.writeElementString('', 'root', 'xmlns', 'value');
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root xmlns="xmlns">value</root>');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as valid string,start document false ', (done): void => {
        xmlWriter.writeStartDocument(false);
        xmlWriter.writeElementString('', 'root', 'xmlns', 'value');
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="no"?><root xmlns="xmlns">value</root>');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as valid string,start document true ', (done): void => {
        xmlWriter.writeStartDocument(true);
        xmlWriter.writeElementString('', 'root', 'xmlns', 'value');
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="yes"?><root xmlns="xmlns">value</root>');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as empty string,start document empty ', (done): void => {
        xmlWriter.writeStartDocument();
        xmlWriter.writeElementString('', 'root', 'xmlns', '');
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root xmlns="xmlns" />');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as empty string,start document false ', (done): void => {
        xmlWriter.writeStartDocument(false);
        xmlWriter.writeElementString('', 'root', 'xmlns', '');
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="no"?><root xmlns="xmlns" />');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as empty string,start document true ', (done): void => {
        xmlWriter.writeStartDocument(true);
        xmlWriter.writeElementString('', 'root', 'xmlns', '');
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="yes"?><root xmlns="xmlns" />');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as null,start document empty ', (done): void => {
        xmlWriter.writeStartDocument();
        xmlWriter.writeElementString('', 'root', 'xmlns', null);
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root xmlns="xmlns" />');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as null,start document false ', (done): void => {
        xmlWriter.writeStartDocument(false);
        xmlWriter.writeElementString('', 'root', 'xmlns', null);
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="no"?><root xmlns="xmlns" />');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as null,start document true ', (done): void => {
        xmlWriter.writeStartDocument(true);
        xmlWriter.writeElementString('', 'root', 'xmlns', null);
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="yes"?><root xmlns="xmlns" />');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as valid string with special char &,start document empty ', (done): void => {
        xmlWriter.writeStartDocument();
        xmlWriter.writeElementString('', 'root', 'xmlns', 'value&');
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root xmlns="xmlns">value&amp;</root>');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as valid string with special char &,start document false ', (done): void => {
        xmlWriter.writeStartDocument(false);
        xmlWriter.writeElementString('', 'root', 'xmlns', 'value&');
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="no"?><root xmlns="xmlns">value&amp;</root>');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as valid string with special char &,start document true ', (done): void => {
        xmlWriter.writeStartDocument(true);
        xmlWriter.writeElementString('', 'root', 'xmlns', 'value&');
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="yes"?><root xmlns="xmlns">value&amp;</root>');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as valid string with special char <,start document empty ', (done): void => {
        xmlWriter.writeStartDocument();
        xmlWriter.writeElementString('', 'root', 'xmlns', 'value<');
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root xmlns="xmlns">value&lt;</root>');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as valid string with special char <,start document false ', (done): void => {
        xmlWriter.writeStartDocument(false);
        xmlWriter.writeElementString('', 'root', 'xmlns', 'value<');
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="no"?><root xmlns="xmlns">value&lt;</root>');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as valid string with special char <,start document true ', (done): void => {
        xmlWriter.writeStartDocument(true);
        xmlWriter.writeElementString('', 'root', 'xmlns', 'value<');
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="yes"?><root xmlns="xmlns">value&lt;</root>');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as valid string with special char >,start document empty ', (done): void => {
        xmlWriter.writeStartDocument();
        xmlWriter.writeElementString('', 'root', 'xmlns', 'value>');
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root xmlns="xmlns">value&gt;</root>');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as valid string with special char >,start document fasle ', (done): void => {
        xmlWriter.writeStartDocument(false);
        xmlWriter.writeElementString('', 'root', 'xmlns', 'value>');
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="no"?><root xmlns="xmlns">value&gt;</root>');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as valid string with special char >,start document true ', (done): void => {
        xmlWriter.writeStartDocument(true);
        xmlWriter.writeElementString('', 'root', 'xmlns', 'value>');
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="yes"?><root xmlns="xmlns">value&gt;</root>');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as valid string with special char \" ,start document empty', (done): void => {
        xmlWriter.writeStartDocument();
        xmlWriter.writeElementString('', 'root', 'xmlns', 'value"');
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root xmlns="xmlns">value\"</root>');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as valid string with special char \" ,start document false', (done): void => {
        xmlWriter.writeStartDocument(false);
        xmlWriter.writeElementString('', 'root', 'xmlns', 'value"');
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="no"?><root xmlns="xmlns">value\"</root>');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as valid string with special char \" ,start document true', (done): void => {
        xmlWriter.writeStartDocument(true);
        xmlWriter.writeElementString('', 'root', 'xmlns', 'value"');
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="yes"?><root xmlns="xmlns">value\"</root>');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as valid string with special char \',start document empty ', (done): void => {
        xmlWriter.writeStartDocument();
        xmlWriter.writeElementString('', 'root', 'xmlns', 'value\'');
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root xmlns="xmlns">value\'</root>');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as valid string with special char \',start document flase ', (done): void => {
        xmlWriter.writeStartDocument(false);
        xmlWriter.writeElementString('', 'root', 'xmlns', 'value\'');
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="no"?><root xmlns="xmlns">value\'</root>');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as valid string with special char \',start document true ', (done): void => {
        xmlWriter.writeStartDocument(true);
        xmlWriter.writeElementString('', 'root', 'xmlns', 'value\'');
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="yes"?><root xmlns="xmlns">value\'</root>');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as valid string with multiple special character,start document empty', (done): void => {
        xmlWriter.writeStartDocument();
        xmlWriter.writeElementString('', 'root', 'xmlns', 'value&&<\"');
        xmlWriter.writeEndDocument()
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root xmlns="xmlns">value&amp;&amp;&lt;\"</root>');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as valid string with multiple special character,start document false', (done): void => {
        xmlWriter.writeStartDocument(false);
        xmlWriter.writeElementString('', 'root', 'xmlns', 'value&&<\"');
        xmlWriter.writeEndDocument()
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="no"?><root xmlns="xmlns">value&amp;&amp;&lt;\"</root>');
            done();
        }, 50);
    });
    it('Prefix as empty and namespace as valid string  & value as valid string with multiple special character,start document true', (done): void => {
        xmlWriter.writeStartDocument(true);
        xmlWriter.writeElementString('', 'root', 'xmlns', 'value&&<\"');
        xmlWriter.writeEndDocument()
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="yes"?><root xmlns="xmlns">value&amp;&amp;&lt;\"</root>');
            done();
        }, 50);
    });
});
describe('Create single empty element with single attribute', (): void => {
    let xmlWriter: XmlWriter;
    let fileReader: FileReader;
    let xmlText: string | ArrayBuffer;
    beforeEach((): void => {
        /**
         * instantiate XmlWriter class
         */
        xmlWriter = new XmlWriter();
        /**
         * creates instance of FileReader class
         */
        fileReader = new FileReader();
        fileReader.onload = (): void => {
            /**
             * gets xml text from bolb
             */
            xmlText = fileReader.result;
        };
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
    });
    afterEach((): void => {
        xmlWriter = undefined;
        fileReader = undefined;
        xmlText = '';
    });
    it('Prefix and namespace as null,attribute\'s - prefix,namespace,value as empty', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeAttributeString('', 'value', '', '');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root value="" />');
            done();
        }, 50);
    });
    it('Prefix and namespace as null,attribute\'s - prefix,namespace,value as null', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeAttributeString(null, 'value', null, null);
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root value="" />');
            done();
        }, 50);
    });
    it('Prefix and namespace as null,attribute\'s - prefix,namespace as empty valueas valid string', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeAttributeString('', 'value', '', 'data');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root value="data" />');
            done();
        }, 50);
    });
    it('Prefix and namespace as null,attribute\'s - prefix,namespace as null value as valid string', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeAttributeString(null, 'value', null, 'data');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root value="data" />');
            done();
        }, 50);
    });
    it('Prefix and namespace as null,attribute\'s - prefix,value as valid string,namespace as empty', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeAttributeString('w', 'value', '', 'data');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root value="data" />');
            done();
        }, 50);
    });
    it('Prefix and namespace as null,attribute\'s - prefix,value as valid string,namespace as null', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeAttributeString('w', 'value', null, 'data');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root value="data" />');
            done();
        }, 50);
    });
    it('Prefix and namespace as null,attribute\'s - prefix as valid string and value,namespace as empty', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeAttributeString('w', 'value', '', '');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root value="" />');
            done();
        }, 50);
    });
    it('Prefix and namespace as null,attribute\'s - prefix as valid string and value,namespace as null', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeAttributeString('w', 'value', null, null);
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root value="" />');
            done();
        }, 50);
    });
    it('Prefix and namespace as null,attribute\'s - prefix,namespace,value as valid string', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeAttributeString('w', 'value', 'a', 'data');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root w:value="data" xmlns:w="a" />');
            done();
        }, 50);
    });
    it('Prefix and namespace as null,attribute\'s - prefix,namespace as valid string and value empty', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeAttributeString('w', 'value', 'a', '');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root w:value="" xmlns:w="a" />');
            done();
        }, 50);
    });
    it('Prefix and namespace as null,attribute\'s - prefix,namespace as valid string and value null', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeAttributeString('w', 'value', 'a', null);
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root w:value="" xmlns:w="a" />');
            done();
        }, 50);
    });
    it('Prefix and namespace as null,attribute\'s - prefix,namespace,value empty', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        setTimeout((): void => {
            expect((): void => { xmlWriter.writeAttributeString('', '', '', ''); }).toThrow(new Error("ArgumentException: localName cannot be undefined, null or empty"));
            done();
        }, 50);
    });
    it('Prefix and namespace as null,attribute\'s - prefix,namespace,value null', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        setTimeout((): void => {
            expect((): void => { xmlWriter.writeAttributeString(null, null, null, null); }).toThrow(new Error("ArgumentException: localName cannot be undefined, null or empty"));
            done();
        }, 50);
    });
    it('writeAttributeString method before start element', (done): void => {
        setTimeout((): void => {
            expect((): void => { xmlWriter.writeAttributeString('w', 'root', 'xml', 'data'); }).toThrow(new Error('InvalidOperationException: Wrong Token'));
            done();
        }, 50);
    });
    it('Prefix, namespace as null ,localName with valid special character,attribute localName with valid special character', (done): void => {
        xmlWriter.writeStartElement(null, 'root_-.', null)
        xmlWriter.writeAttributeString(null, 'value_-.', null, 'data');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root_-. value_-.="data" />');
            done();
        }, 50);
    });
    it('Prefix, namespace as null ,localName with valid special character,attribute with invalid special character', (done): void => {
        xmlWriter.writeStartElement(null, 'root_-.', null)
        setTimeout((): void => {
            expect((): void => { xmlWriter.writeAttributeString(null, 'value@', null, 'data'); }).toThrow(new Error('InvalidArgumentException: invalid name character'));
            done();
        }, 50);
    });
    it('Prefix, namespace as null ,localName with valid string,attribute value with valid special character', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null)
        xmlWriter.writeAttributeString(null, 'value', null, 'data&\"<>');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root value="data&amp;&quot;&lt;&gt;" />');
            done();
        }, 50);
    });
});
describe('create single non empty element with single attribute', (): void => {
    let xmlWriter: XmlWriter;
    let fileReader: FileReader;
    let xmlText: string | ArrayBuffer;
    beforeEach((): void => {
        /**
         * instantiate XmlWriter class
         */
        xmlWriter = new XmlWriter();
        /**
         * creates instance of FileReader class
         */
        fileReader = new FileReader();
        fileReader.onload = (): void => {
            /**
             * gets xml text from bolb
             */
            xmlText = fileReader.result;
        };
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
    })
    afterEach((): void => {
        xmlWriter = undefined;
        fileReader = undefined;
        xmlText = '';
    });
    it('Prefix and namespace as null,attribute\'s - prefix,namespace,value as empty,element value - valid string', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeAttributeString('', 'value', '', '');
        xmlWriter.writeString('element');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root value="">element</root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as null,attribute\'s - prefix,namespace,value as null,element value - valid string', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeAttributeString(null, 'value', null, null);
        xmlWriter.writeString('element');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root value="">element</root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as null,attribute\'s - prefix,namespace as empty valueas valid string,element value - valid string', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeAttributeString('', 'value', '', 'data');
        xmlWriter.writeString('element');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root value="data">element</root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as null,attribute\'s - prefix,namespace as null value as valid string,element value - valid string', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeAttributeString(null, 'value', null, 'data');
        xmlWriter.writeString('element');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root value="data">element</root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as null,attribute\'s - prefix,value as valid string,namespace as empty,element value - valid string', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeAttributeString('w', 'value', '', 'data');
        xmlWriter.writeString('element');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root value="data">element</root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as null,attribute\'s - prefix,value as valid string,namespace as null,element value - valid string', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeAttributeString('w', 'value', null, 'data');
        xmlWriter.writeString('element');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root value="data">element</root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as null,attribute\'s - prefix as valid string and value,namespace as empty,element value - valid string', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeAttributeString('w', 'value', '', '');
        xmlWriter.writeString('element');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root value="">element</root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as null,attribute\'s - prefix as valid string and value,namespace as null,element value - valid string', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeAttributeString('w', 'value', null, null);
        xmlWriter.writeString('element');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root value="">element</root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as null,attribute\'s - prefix,namespace,value as valid string,element value - valid string', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeAttributeString('w', 'value', 'a', 'data');
        xmlWriter.writeString('element');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root w:value="data" xmlns:w="a">element</root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as null,attribute\'s - prefix,namespace as valid string and value empty,element value - valid string', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeAttributeString('w', 'value', 'a', '');
        xmlWriter.writeString('element');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root w:value="" xmlns:w="a">element</root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as null,attribute\'s - prefix,namespace as valid string and value null,element value - valid string', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeAttributeString('w', 'value', 'a', null);
        xmlWriter.writeString('element');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root w:value="" xmlns:w="a">element</root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as null,attribute\'s - prefix,namespace,value empty,element value - valid string', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeString('element');
        setTimeout((): void => {
            expect((): void => { xmlWriter.writeAttributeString('', '', '', ''); }).toThrow(new Error("ArgumentException: localName cannot be undefined, null or empty"));
            done();
        }, 50);
    });
    it('Prefix and namespace as null,attribute\'s - prefix,namespace,value null,element value - valid string', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeString('element');
        setTimeout((): void => {
            expect((): void => { xmlWriter.writeAttributeString(null, null, null, null); }).toThrow(new Error("ArgumentException: localName cannot be undefined, null or empty"));
            done();
        }, 50);
    });
    it('Prefix, namespace as null ,localName with valid special character,attribute localName with valid special character,element value - valid string', (done): void => {
        xmlWriter.writeStartElement(null, 'root_-.', null)
        xmlWriter.writeAttributeString(null, 'value_-.', null, 'data');
        xmlWriter.writeString('element');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root_-. value_-.="data">element</root_-.>');
            done();
        }, 50);
    });
    it('Prefix, namespace as null ,localName with valid special character,attribute with invalid special character,element value - valid string', (done): void => {
        xmlWriter.writeStartElement(null, 'root_-.', null)
        xmlWriter.writeString('element');
        setTimeout((): void => {
            expect((): void => { xmlWriter.writeAttributeString(null, 'value@', null, 'data'); }).toThrow(new Error('InvalidOperationException: Wrong Token'));
            done();
        }, 50);
    });
    it('Prefix, namespace as null ,localName with valid string,attribute value with valid special character,element value - valid string', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null)
        xmlWriter.writeAttributeString(null, 'value', null, 'data&\"<>');
        xmlWriter.writeString('element');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root value="data&amp;&quot;&lt;&gt;">element</root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as null,attribute\'s - prefix,namespace,value as empty,element value - valid string', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeAttributeString('', 'value', '', '');
        xmlWriter.writeString('');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root value=""></root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as null,attribute\'s - prefix,namespace,value as null,element value - valid string', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeAttributeString(null, 'value', null, null);
        xmlWriter.writeString('');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root value=""></root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as null,attribute\'s - prefix,namespace as empty valueas valid string,element value - valid string', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeAttributeString('', 'value', '', 'data');
        xmlWriter.writeString('');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root value="data"></root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as null,attribute\'s - prefix,namespace as null value as valid string,element value - valid string', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeAttributeString(null, 'value', null, 'data');
        xmlWriter.writeString('');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root value="data"></root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as null,attribute\'s - prefix,value as valid string,namespace as empty,element value - valid string', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeAttributeString('w', 'value', '', 'data');
        xmlWriter.writeString('');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root value="data"></root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as null,attribute\'s - prefix,value as valid string,namespace as null,element value - valid string', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeAttributeString('w', 'value', null, 'data');
        xmlWriter.writeString('');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root value="data"></root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as null,attribute\'s - prefix as valid string and value,namespace as empty,element value - valid string', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeAttributeString('w', 'value', '', '');
        xmlWriter.writeString('');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root value=""></root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as null,attribute\'s - prefix as valid string and value,namespace as null,element value - valid string', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeAttributeString('w', 'value', null, null);
        xmlWriter.writeString('');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root value=""></root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as null,attribute\'s - prefix,namespace,value as valid string,element value - valid string', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeAttributeString('w', 'value', 'a', 'data');
        xmlWriter.writeString('');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root w:value="data" xmlns:w="a"></root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as null,attribute\'s - prefix,namespace as valid string and value empty,element value - valid string', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeAttributeString('w', 'value', 'a', '');
        xmlWriter.writeString('');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root w:value="" xmlns:w="a"></root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as null,attribute\'s - prefix,namespace as valid string and value null,element value - valid string', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeAttributeString('w', 'value', 'a', null);
        xmlWriter.writeString('');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root w:value="" xmlns:w="a"></root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as null,attribute\'s - prefix,namespace,value empty,element value - valid string', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeString('');
        setTimeout((): void => {
            expect((): void => { xmlWriter.writeAttributeString('', '', '', ''); }).toThrow(new Error("ArgumentException: localName cannot be undefined, null or empty"));
            done();
        }, 50);
    });
    it('Prefix and namespace as null,attribute\'s - prefix,namespace,value null,element value - valid string', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeString('');
        setTimeout((): void => {
            expect((): void => { xmlWriter.writeAttributeString(null, null, null, null); }).toThrow(new Error("ArgumentException: localName cannot be undefined, null or empty"));
            done();
        }, 50);
    });
    it('Prefix, namespace as null ,localName with valid special character,attribute localName with valid special character,element value - valid string', (done): void => {
        xmlWriter.writeStartElement(null, 'root_-.', null)
        xmlWriter.writeAttributeString(null, 'value_-.', null, 'data');
        xmlWriter.writeString('');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root_-. value_-.="data"></root_-.>');
            done();
        }, 50);
    });
    it('Prefix, namespace as null ,localName with valid special character,attribute with invalid special character,element value - valid string', (done): void => {
        xmlWriter.writeStartElement(null, 'root_-.', null)
        xmlWriter.writeString('');
        setTimeout((): void => {
            expect((): void => { xmlWriter.writeAttributeString(null, 'value@', null, 'data'); }).toThrow(new Error('InvalidOperationException: Wrong Token'));
            done();
        }, 50);
    });
    it('Prefix, namespace as null ,localName with valid string,attribute value with valid special character,element value - valid string', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null)
        xmlWriter.writeAttributeString(null, 'value', null, 'data&\"<>');
        xmlWriter.writeString('');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root value="data&amp;&quot;&lt;&gt;"></root>');
            done();
        }, 50);
    });
    it('Prefix and namespace as null,attribute\'s - prefix,namespace,value as empty,element value - as null', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeAttributeString('', 'value', '', '');
        xmlWriter.writeString(null);
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root value="" />');
            done();
        }, 50);
    });
    it('Prefix and namespace as null,attribute\'s - prefix,namespace,value as null,element value - as null', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeAttributeString(null, 'value', null, null);
        xmlWriter.writeString(null);
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root value="" />');
            done();
        }, 50);
    });
    it('Prefix and namespace as null,attribute\'s - prefix,namespace as empty valueas valid string,element value - as null', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeAttributeString('', 'value', '', 'data');
        xmlWriter.writeString(null);
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root value="data" />');
            done();
        }, 50);
    });
    it('Prefix and namespace as null,attribute\'s - prefix,namespace as null value as valid string,element value - as null', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeAttributeString(null, 'value', null, 'data');
        xmlWriter.writeString(null);
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root value="data" />');
            done();
        }, 50);
    });
    it('Prefix and namespace as null,attribute\'s - prefix,value as valid string,namespace as empty,element value - as null', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeAttributeString('w', 'value', '', 'data');
        xmlWriter.writeString(null);
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root value="data" />');
            done();
        }, 50);
    });
    it('Prefix and namespace as null,attribute\'s - prefix,value as valid string,namespace as null,element value - as null', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeAttributeString('w', 'value', null, 'data');
        xmlWriter.writeString(null);
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root value="data" />');
            done();
        }, 50);
    });
    it('Prefix and namespace as null,attribute\'s - prefix as valid string and value,namespace as empty,element value - as null', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeAttributeString('w', 'value', '', '');
        xmlWriter.writeString(null);
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root value="" />');
            done();
        }, 50);
    });
    it('Prefix and namespace as null,attribute\'s - prefix as valid string and value,namespace as null,element value - as null', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeAttributeString('w', 'value', null, null);
        xmlWriter.writeString(null);
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root value="" />');
            done();
        }, 50);
    });
    it('Prefix and namespace as null,attribute\'s - prefix,namespace,value as valid string,element value - as null', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeAttributeString('w', 'value', 'a', 'data');
        xmlWriter.writeString(null);
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root w:value="data" xmlns:w="a" />');
            done();
        }, 50);
    });
    it('Prefix and namespace as null,attribute\'s - prefix,namespace as valid string and value empty,element value - as null', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeAttributeString('w', 'value', 'a', '');
        xmlWriter.writeString(null);
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root w:value="" xmlns:w="a" />');
            done();
        }, 50);
    });
    it('Prefix and namespace as null,attribute\'s - prefix,namespace as valid string and value null,element value - as null', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeAttributeString('w', 'value', 'a', null);
        xmlWriter.writeString(null);
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root w:value="" xmlns:w="a" />');
            done();
        }, 50);
    });
    it('Prefix and namespace as null,attribute\'s - prefix,namespace,value empty,element value - as null', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeString(null);
        setTimeout((): void => {
            expect((): void => { xmlWriter.writeAttributeString('', '', '', ''); }).toThrow(new Error("ArgumentException: localName cannot be undefined, null or empty"));
            done();
        }, 50);
    });
    it('Prefix and namespace as null,attribute\'s - prefix,namespace,value null,element value - as null', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeString(null);
        setTimeout((): void => {
            expect((): void => { xmlWriter.writeAttributeString(null, null, null, null); }).toThrow(new Error("ArgumentException: localName cannot be undefined, null or empty"));
            done();
        }, 50);
    });
    it('Prefix, namespace as null ,localName with valid special character,attribute localName with valid special character,element value - as null', (done): void => {
        xmlWriter.writeStartElement(null, 'root_-.', null)
        xmlWriter.writeAttributeString(null, 'value_-.', null, 'data');
        xmlWriter.writeString(null);
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root_-. value_-.="data" />');
            done();
        }, 50);
    });
    it('Prefix, namespace as null ,localName with valid special character,attribute with invalid special character,element value - as null', (done): void => {
        xmlWriter.writeStartElement(null, 'root_-.', null)
        xmlWriter.writeString(null);
        setTimeout((): void => {
            expect((): void => { xmlWriter.writeAttributeString(null, 'value@', null, 'data'); }).toThrow(new Error('InvalidArgumentException: invalid name character'));
            done();
        }, 50);
    });
    it('Prefix, namespace as null ,localName with valid string,attribute value with valid special character,element value - as null', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null)
        xmlWriter.writeAttributeString(null, 'value', null, 'data&\"<>');
        xmlWriter.writeString(null);
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root value="data&amp;&quot;&lt;&gt;" />');
            done();
        }, 50);
    });
    it('Prefix, namespace as null ,localName with valid string,attribute with Prefix ="xmlns",namespace,localName as empty', (done): void => {
        xmlWriter.writeStartElement(null, "book", null);
        xmlWriter.writeAttributeString("xmlns", "", "", "");
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><book xmlns="" />');
            done();
        }, 50);
    });
    it('Prefix, namespace as null ,localName with valid string,attribute with Prefix ="xmlns",namespace,localName as null', (done): void => {
        xmlWriter.writeStartElement(null, "book", null);
        xmlWriter.writeAttributeString("xmlns", null, null, null);
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><book xmlns="" />');
            done();
        }, 50);
    });
    it('Prefix, namespace as null ,localName with valid string,attribute with localName ="xmlns",namespace as http://www.w3.org/2000/xmlns/ ,prefix as null', (done): void => {
        xmlWriter.writeStartElement(null, "book", null);
        xmlWriter.writeAttributeString(null, "xmlns", 'http://www.w3.org/2000/xmlns/', null);
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><book xmlns="" />');
            done();
        }, 50);
    });
    it('Prefix, namespace as null ,localName with valid string,attribute with Prefix ="xml",namespace,localName as null', (done): void => {
        xmlWriter.writeStartElement(null, "book", null);
        xmlWriter.writeAttributeString("xml", "space", 'http://www.w3.org/XML/1998/namespace', 'preserve');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><book xml:space="preserve" />');
            done();
        }, 50);
    });
    it('Prefix, namespace as null ,localName with valid string,attribute with Prefix ="xml" & "xmlns",namespace,localName as null', (done): void => {
        xmlWriter.writeStartElement(null, "book", null);
        xmlWriter.writeAttributeString(null, "xmlns", 'http://www.w3.org/2000/xmlns/', null);
        xmlWriter.writeAttributeString("xml", "space", 'http://www.w3.org/XML/1998/namespace', 'preserve');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><book xmlns="" xml:space="preserve" />');
            done();
        }, 50);
    });
    it('Prefix, namespace as null ,localName with valid string,attribute with Prefix ="xml",namespace,localName as null', (done): void => {
        xmlWriter.writeStartElement(null, "book", null);
        xmlWriter.writeAttributeString("xmlspace", "space", 'data', 'preserve');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><book xmlspace:space="preserve" xmlns:xmlspace="data" />');
            done();
        }, 50);
    });
    it('Prefix, namespace as null ,localName with valid string,attribute with Prefix ="xml",namespace,localName as null', (done): void => {
        xmlWriter.writeStartElement(null, "book", null);
        xmlWriter.writeAttributeString("xml", "space", 'http://www.w3.org/XML/1998/namespace', 'default');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><book xml:space="default" />');
            done();
        }, 50);
    });
    it('Prefix, namespace as null ,localName with valid string,attribute with Prefix ="xml",namespace,localName ', (done): void => {
        xmlWriter.writeStartElement(null, "book", null);
        xmlWriter.writeAttributeString("xml", "lang", 'http://www.w3.org/XML/1998/namespace', 'default');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><book xml:lang="default" />');
            done();
        }, 50);
    });
    it('Prefix, namespace as null ,localName with valid string,attribute with Prefix ="xml",namespace,localName ', (done): void => {
        xmlWriter.writeStartElement(null, "book", null);
        xmlWriter.writeAttributeString("xml", "b", 'http://www.w3.org/XML/1998/namespace', 'default');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><book xml:b="default" />');
            done();
        }, 50);
    });
});
describe('Create multiple non empty element with attribute', (): void => {
    let xmlWriter: XmlWriter;
    let fileReader: FileReader;
    let xmlText: string | ArrayBuffer;
    beforeEach((): void => {
        /**
         * instantiate XmlWriter class
         */
        xmlWriter = new XmlWriter();
        /**
         * creates instance of FileReader class
         */
        fileReader = new FileReader();
        fileReader.onload = (): void => {
            /**
             * gets xml text from bolb
             */
            xmlText = fileReader.result;
        };
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
    });
    afterEach((): void => {
        xmlWriter = undefined;
        fileReader = undefined;
        xmlText = '';
    });
    it('Element\'s and attribute\'s Prefix,namespace as null', (done): void => {
        xmlWriter.writeStartElement(null, "book", null);
        xmlWriter.writeAttributeString(null, "bk", null, "urn:samples");
        xmlWriter.writeAttributeString(null, "genre", null, "novel");
        xmlWriter.writeStartElement(null, "title", null);
        xmlWriter.writeString("The Handmaid's Tale");
        xmlWriter.writeEndElement();
        xmlWriter.writeElementString(null, "price", null, "19.95");
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><book bk="urn:samples" genre="novel">' +
                '<title>The Handmaid\'s Tale</title><price>19.95</price></book>');
            done();
        }, 50);
    });
    it('Element\'s and attribute\'s Prefix,namespace as empty', (done): void => {
        xmlWriter.writeStartElement('', "book", '');
        xmlWriter.writeAttributeString('', "bk", '', "urn:samples");
        xmlWriter.writeAttributeString('', "genre", '', "novel");
        xmlWriter.writeStartElement('', "title", '');
        xmlWriter.writeString("The Handmaid's Tale");
        xmlWriter.writeEndElement();
        xmlWriter.writeElementString('', "price", '', "19.95");
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><book bk="urn:samples" genre="novel">' +
                '<title>The Handmaid\'s Tale</title><price>19.95</price></book>');
            done();
        }, 50);
    });
    it('Element\'s  Prefix as null,namespace as valid string and attribute\'s Prefix ,namespace null', (done): void => {
        xmlWriter.writeStartElement(null, "book", 'xml');
        xmlWriter.writeAttributeString(null, "bk", null, "urn:samples");
        xmlWriter.writeAttributeString(null, "genre", null, "novel");
        xmlWriter.writeStartElement(null, "title", null);
        xmlWriter.writeString("The Handmaid's Tale");
        xmlWriter.writeEndElement();
        xmlWriter.writeElementString(null, "price", null, "19.95");
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><book bk="urn:samples" genre="novel" xmlns="xml">' +
                '<title>The Handmaid\'s Tale</title><price>19.95</price></book>');
            done();
        }, 50);
    });
    it('Element\'s  Prefix as empty,namespace as valid string and attribute\'s Prefix ,namespace null', (done): void => {
        xmlWriter.writeStartElement('', "book", 'xml');
        xmlWriter.writeAttributeString(null, "bk", null, "urn:samples");
        xmlWriter.writeAttributeString(null, "genre", null, "novel");
        xmlWriter.writeStartElement(null, "title", null);
        xmlWriter.writeString("The Handmaid's Tale");
        xmlWriter.writeEndElement();
        xmlWriter.writeElementString(null, "price", null, "19.95");
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><book bk="urn:samples" genre="novel" xmlns="xml">' +
                '<title>The Handmaid\'s Tale</title><price>19.95</price></book>');
            done();
        }, 50);
    });
    it('Element\'s  Prefix as null,namespace as valid string and attribute\'s Prefix ,namespace empty', (done): void => {
        xmlWriter.writeStartElement(null, "book", 'xml');
        xmlWriter.writeAttributeString('', "bk", '', "urn:samples");
        xmlWriter.writeAttributeString('', "genre", '', "novel");
        xmlWriter.writeStartElement(null, "title", null);
        xmlWriter.writeString("The Handmaid's Tale");
        xmlWriter.writeEndElement();
        xmlWriter.writeElementString(null, "price", null, "19.95");
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><book bk="urn:samples" genre="novel" xmlns="xml">' +
                '<title>The Handmaid\'s Tale</title><price>19.95</price></book>');
            done();
        }, 50);
    });
    it('Element\'s prefix,namespace as null and attribute\'s Prefix ,namespace as valid empty', (done): void => {
        xmlWriter.writeStartElement(null, "book", null);
        xmlWriter.writeAttributeString('w', "bk", 'xmlns', "urn:samples");
        xmlWriter.writeAttributeString('s', "genre", 'xml', "novel");
        xmlWriter.writeStartElement(null, "title", null);
        xmlWriter.writeString("The Handmaid's Tale");
        xmlWriter.writeEndElement();
        xmlWriter.writeElementString(null, "price", null, "19.95");
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><book w:bk="urn:samples" s:genre="novel" xmlns:s="xml" xmlns:w="xmlns"><title>The Handmaid\'s Tale</title><price>19.95</price></book>');
            done();
        }, 50);
    });
    it('Element\'s prefix,namespace as null and attribute\'s Prefix ,namespace as valid empty with multiple attribute', (done): void => {
        xmlWriter.writeStartElement("", "book", "");
        xmlWriter.writeAttributeString("w", "bk", "xmlns", "urn:samples");
        xmlWriter.writeAttributeString("s", "genre", "xml", "novel");
        xmlWriter.writeStartElement(null, "title", null);
        xmlWriter.writeStartElement(null, "author", null);
        xmlWriter.writeStartElement(null, "country", null);
        xmlWriter.writeAttributeString("xmlns", "bk", "http://www.w3.org/2000/xmlns/", "urn:samples");
        xmlWriter.writeString("tagore");
        xmlWriter.writeEndElement();
        xmlWriter.writeEndElement();
        xmlWriter.writeEndElement();
        xmlWriter.writeElementString("", "price", "", "19.95");
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><book w:bk="urn:samples" s:genre="novel" xmlns:s="xml" xmlns:w="xmlns"><title><author><country xmlns:bk="urn:samples">tagore</country></author></title><price>19.95</price></book>');
            done();
        }, 50);
    });
    it('Element\'s prefix,namespace as null and attribute\'s Prefix ,namespace as valid empty with multiple attribute with same namespace', (done): void => {
        xmlWriter.writeStartElement("", "book", "");
        xmlWriter.writeAttributeString("w", "bk", "xmlns", "urn:samples");
        xmlWriter.writeAttributeString("s", "genre", "xml", "novel");
        xmlWriter.writeStartElement(null, "title", null);
        xmlWriter.writeStartElement(null, "author", null);
        xmlWriter.writeStartElement(null, "country", null);
        xmlWriter.writeAttributeString("xmlns", "s", "http://www.w3.org/2000/xmlns/", "urn:samples");
        xmlWriter.writeString("tagore");
        xmlWriter.writeEndElement();
        xmlWriter.writeEndElement();
        xmlWriter.writeEndElement();
        xmlWriter.writeElementString("", "price", "", "19.95");
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><book w:bk="urn:samples" s:genre="novel" xmlns:s="xml" xmlns:w="xmlns"><title><author><country xmlns:s="urn:samples">tagore</country></author></title><price>19.95</price></book>');
            done();
        }, 50);
    });
    it('Nested get prefix from parent element', (done): void => {
        xmlWriter.writeStartElement(null, "book", null);
        xmlWriter.writeAttributeString("xmlns", "bk", null, "urn:samples");
        xmlWriter.writeAttributeString(null, "genre", null, "novel");
        xmlWriter.writeStartElement(null, "title", null);
        xmlWriter.writeString("The Handmaid's Tale");
        xmlWriter.writeEndElement();
        xmlWriter.writeElementString(null, "price", null, "19.95");
        xmlWriter.writeStartElement(null, "ISBN", "urn:samples");
        xmlWriter.writeString("1-861003-78");
        xmlWriter.writeEndElement();
        xmlWriter.writeElementString(null, "style", "urn:samples", "hardcover");
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><book xmlns:bk="urn:samples" genre="novel"><title>The Handmaid\'s Tale</title><price>19.95</price><bk:ISBN>1-861003-78</bk:ISBN><bk:style>hardcover</bk:style></book>');
            done();
        }, 50);
    });
    it('End Document without EndElement', (done): void => {
        xmlWriter.writeStartElement(null, "book", null);
        xmlWriter.writeAttributeString('w', "bk", 'xmlns', "urn:samples");
        xmlWriter.writeAttributeString('s', "genre", 'xml', "novel");
        xmlWriter.writeElementString(null, "price", null, "19.95");
        xmlWriter.writeStartElement(null, "title", null);
        xmlWriter.writeString("The Handmaid's Tale");
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><book w:bk="urn:samples" s:genre="novel" xmlns:s="xml" xmlns:w="xmlns"><price>19.95</price><title>The Handmaid\'s Tale</title></book>');
            done();
        }, 50);
    });
    it('duplicae attributes validation', (done): void => {
        xmlWriter.writeStartElement(null, "book", null);
        xmlWriter.writeAttributeString('w', "bk", 'xmlns', "urn:samples");
        setTimeout((): void => {
            expect((): void => { xmlWriter.writeAttributeString('w', "bk", 'xmlns', "urn:samples") }).toThrow(new Error('XmlException: duplicate attribute name'));
            done();
        }, 50);
    });
    it('Element Prefix = Xmlns reserved key word', (done): void => {
        setTimeout((): void => {
            expect((): void => { xmlWriter.writeStartElement('xmlns', 'root', 'data') }).toThrow(new Error('InvalidArgumentException: Prefix "xmlns" is reserved for use by XML.'));
            done();
        }, 50);
    });
    it('Element\'s  Prefix as null,namespace as valid string and attribute\'s Prefix ,namespace as valid string', (done): void => {
        xmlWriter.writeStartElement(null, "book", 'xml');
        xmlWriter.writeAttributeString(null, "bk", null, "urn:samples");
        xmlWriter.writeAttributeString(null, "genre", null, "novel");
        xmlWriter.writeStartElement(null, "title", null);
        xmlWriter.writeString("The Handmaid's Tale");
        xmlWriter.writeEndElement();
        xmlWriter.writeElementString(null, "price", null, "19.95");
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><book bk="urn:samples" genre="novel" xmlns="xml">' +
                '<title>The Handmaid\'s Tale</title><price>19.95</price></book>');
            done();
        }, 50);
    });
    it('Element with multiple namespace and attribute', (done) => {
        xmlWriter.writeStartElement("w", "Document", "xmlns");
        xmlWriter.writeAttributeString(null, "child", "xmlns", "section");
        xmlWriter.writeAttributeString(null, "childNode", "xmlns", "Format");
        xmlWriter.writeAttributeString(null, "leaf", "xmlns", "last");
        xmlWriter.writeStartElement("w", "Block", "Xmlns");
        xmlWriter.writeAttributeString(null, "child", "xls", "paragraph");
        xmlWriter.writeEndElement();
        xmlWriter.writeElementString("g", "base", "xml", "node");
        xmlWriter.writeElementString(null, "build", "xmlns", "compile");
        xmlWriter.writeElementString(null, "build", "xml", "compile");
        xmlWriter.writeElementString(null, "build", "xml", "compile");
        xmlWriter.writeStartElement(null, "paragraph", "xmlns");
        xmlWriter.writeStartElement("p", "paragraph", "xmlns");
        xmlWriter.writeStartElement("r", "Table", "xmlns");
        xmlWriter.writeStartElement("q", "image", "xmlns");
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><w:Document w:child="section" w:childNode="Format" w:leaf="last" xmlns:w="xmlns"><w:Block child="paragraph" xmlns:w="Xmlns" /><g:base xmlns:g="xml">node</g:base><w:build>compile</w:build><build xmlns="xml">compile</build><build xmlns="xml">compile</build><w:paragraph><p:paragraph xmlns:p="xmlns"><r:Table xmlns:r="xmlns"><q:image xmlns:q="xmlns" /></r:Table></p:paragraph></w:paragraph></w:Document>');
            done();
        }, 50);
    });
    it('Attribute with same prefix different namespace ', (done): void => {
        xmlWriter.writeStartElement(null, "book", null);
        xmlWriter.writeAttributeString('w', "bk", 'xmlns', "urn:samples");
        setTimeout((): void => {
            expect((): void => { xmlWriter.writeAttributeString('w', "genre", 'xml', "novel"); }).toThrow(new Error('XmlException namespace Uri needs to be the same as the one that is already declared'));
            done();
        }, 50);
    });
    it('Attribute same namespace different prefix ', (done): void => {
        xmlWriter.writeStartElement(null, "From", null);
        xmlWriter.writeAttributeString('w', "lang", 'xmlns', 'uri:sample');
        setTimeout((): void => {
            expect((): void => { xmlWriter.writeAttributeString('z', "lang", 'xmlns', 'mug:sample'); }).toThrow(new Error('XmlException: duplicate attribute name'));
            done();
        }, 50);
    });
    it('prefix and namespace with predifferent namespace', (done): void => {
        xmlWriter.writeStartDocument(true);
        xmlWriter.writeStartElement('w', 'document', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main');
        xmlWriter.writeAttributeString(null, 'wpc', 'http://www.w3.org/2000/xmlns/', 'http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas');
        xmlWriter.writeStartElement(null, 'body', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main');
        xmlWriter.writeStartElement(null, 'p', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main');
        xmlWriter.writeAttributeString(null, 'rsidR', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main', '00400719');
        xmlWriter.writeAttributeString(null, 'rsidRDefault', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main', '00400719');
        xmlWriter.writeStartElement(null, 'r', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main');
        xmlWriter.writeStartElement(null, 't', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main');
        xmlWriter.writeString('word');
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="yes"?><w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p w:rsidR="00400719" w:rsidRDefault="00400719"><w:r><w:t>word</w:t></w:r></w:p></w:body></w:document>');
            done();
        }, 50);
    });
    it('prefix and namespace with predifferent namespace and prefix', (done): void => {
        xmlWriter.writeStartDocument(true);
        xmlWriter.writeStartElement('w', 'document', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main');
        xmlWriter.writeAttributeString(null, 'wpc', 'http://www.w3.org/2000/xmlns/', 'http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas');
        xmlWriter.writeStartElement(null, 'body', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main');
        xmlWriter.writeStartElement(null, 'p', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main');
        xmlWriter.writeAttributeString(null, 'rsidR', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main', '00400719');
        xmlWriter.writeAttributeString(null, 'rsidRDefault', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main', '00400719');
        xmlWriter.writeStartElement(null, 'r', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main');
        xmlWriter.writeStartElement(null, 't', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main');
        xmlWriter.writeString('word');
        xmlWriter.writeStartElement('w', 'i', null);
        xmlWriter.writeString('word');
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="yes"?><w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p w:rsidR="00400719" w:rsidRDefault="00400719"><w:r><w:t>word<w:i>word</w:i></w:t></w:r></w:p></w:body></w:document>');
            done();
        }, 50);
    });
    it('prefix and namespace with predifferent namespace and prefix writeStartElement after writeString', (done): void => {
        xmlWriter.writeStartDocument(true);
        xmlWriter.writeStartElement('w', 'document', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main');
        xmlWriter.writeAttributeString(null, 'wpc', 'http://www.w3.org/2000/xmlns/', 'http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas');
        xmlWriter.writeStartElement(null, 'body', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main');
        xmlWriter.writeStartElement(null, 'p', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main');
        xmlWriter.writeAttributeString(null, 'rsidR', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main', '00400719');
        xmlWriter.writeAttributeString(null, 'rsidRDefault', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main', '00400719');
        xmlWriter.writeStartElement(null, 'r', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main');
        xmlWriter.writeStartElement(null, 't', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main');
        xmlWriter.writeString('word');
        xmlWriter.writeStartElement('w', 'i', null);
        xmlWriter.writeString('word');
        xmlWriter.writeEndDocument();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8" standalone="yes"?><w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p w:rsidR="00400719" w:rsidRDefault="00400719"><w:r><w:t>word<w:i>word</w:i></w:t></w:r></w:p></w:body></w:document>');
            done();
        }, 50);
    });

});
describe('save xml document and destroy XmlWriter class', (): void => {
    let xmlWriter: XmlWriter;
    let fileReader: FileReader;
    let xmlText: string | ArrayBuffer;
    beforeEach((): void => {
        /**
         * instantiate XmlWriter class
         */
        xmlWriter = new XmlWriter();
        /**
         * creates instance of FileReader class
         */
        fileReader = new FileReader();
        fileReader.onload = (): void => {
            /**
             * gets xml text from bolb
             */
            xmlText = fileReader.result;
        };
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
    });
    afterEach((): void => {
        xmlWriter.destroy();
        xmlWriter = undefined;
        fileReader = undefined;
        xmlText = '';
    });
    it('Save blob as xml file', (done): void => {
        xmlWriter.writeStartElement(null, "book", null);
        xmlWriter.writeAttributeString(null, "bk", null, "urn:samples");
        xmlWriter.writeAttributeString(null, "genre", null, "novel");
        for (let i: number = 0; i < 500; i++) {
            xmlWriter.writeStartElement(null, "title", null);
            xmlWriter.writeString("The Handmaid's Tale");
            xmlWriter.writeEndElement();
            xmlWriter.writeElementString(null, "price", null, "19.95");
        }
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(() => { xmlWriter.save(undefined); }).toThrowError();
            done();
        }, 50);
    });
    it('Save blob as xml file,without writeEndDocument or writeEndElement', (done): void => {
        xmlWriter.writeStartDocument(true);
        xmlWriter.writeStartElement('w', 'document', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main');
        xmlWriter.writeAttributeString(null, 'wpc', 'http://www.w3.org/2000/xmlns/', 'http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas');
        xmlWriter.writeStartElement(null, 'body', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main');
        xmlWriter.writeStartElement(null, 'p', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main');
        xmlWriter.writeAttributeString(null, 'rsidR', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main', '00400719');
        xmlWriter.writeAttributeString(null, 'rsidRDefault', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main', '00400719');
        xmlWriter.writeStartElement(null, 'r', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main');
        xmlWriter.writeStartElement(null, 't', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main');
        xmlWriter.writeString('word document');
        setTimeout((): void => {
            expect('').toBe('');
            done();
        }, 50);
    });
    it('save blob as xml file in microsoft browser', (done): void => {
        xmlWriter.writeStartDocument(true);
        xmlWriter.writeStartElement('w', 'document', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main');
        xmlWriter.writeAttributeString(null, 'wpc', 'http://www.w3.org/2000/xmlns/', 'http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas');
        xmlWriter.writeString('word document');
        setTimeout((): void => {
            done();
        }, 50);
    });
    it('Save blob as xml file,with Start and End Document', (done): void => {
        xmlWriter.writeStartDocument(true);
        xmlWriter.writeStartElement('w', 'document', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main');
        xmlWriter.writeAttributeString(null, 'wpc', 'http://www.w3.org/2000/xmlns/', 'http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas');
        xmlWriter.writeStartElement(null, 'body', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main');
        xmlWriter.writeStartElement(null, 'p', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main');
        xmlWriter.writeAttributeString(null, 'rsidR', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main', '00400719');
        xmlWriter.writeAttributeString(null, 'rsidRDefault', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main', '00400719');
        xmlWriter.writeStartElement(null, 'r', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main');
        xmlWriter.writeStartElement(null, 't', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main');
        xmlWriter.writeString('word document');
        xmlWriter.writeEndDocument();
        setTimeout((): void => {
            expect('').toBe('');
            done();
        }, 50);
    });
    it('destroy xmlWriter resource', (done): void => {
        xmlWriter.writeStartElement(null, "book", null);
        xmlWriter.writeAttributeString(null, "bk", null, "urn:samples");
        xmlWriter.writeAttributeString(null, "genre", null, "novel");
        xmlWriter.writeStartElement(null, "title", null);
        xmlWriter.writeString("The Handmaid's Tale");
        xmlWriter.writeEndElement();
        xmlWriter.writeElementString(null, "price", null, "19.95");
        xmlWriter.writeEndElement();
        xmlWriter.destroy();
        setTimeout((): void => {
            expect(xmlWriter.buffer).toBe(undefined);
            done();
        }, 50);
    });
});
describe('create empty element with write processing instuction', (): void => {
    let xmlWriter: XmlWriter;
    let fileReader: FileReader;
    let xmlText: string | ArrayBuffer;
    beforeEach((): void => {
        /**
         * instantiate XmlWriter class
         */
        xmlWriter = new XmlWriter();
        /**
         * creates instance of FileReader class
         */
        fileReader = new FileReader();
        fileReader.onload = (): void => {
            /**
             * gets xml text from bolb
             */
            xmlText = fileReader.result;
        };
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
    });
    afterEach((): void => {
        xmlWriter.destroy();
        xmlWriter = undefined;
        fileReader = undefined;
        xmlText = '';
    });
    it('Name and text as null', (done): void => {
        setTimeout((): void => {
            expect((): void => { xmlWriter.writeProcessingInstruction(null, null); }).toThrow(new Error('ArgumentException: name should not be undefined, null or empty'));
            done();
        }, 50);
    });
    it('Name as null and text as valid string', (done): void => {
        setTimeout((): void => {
            expect((): void => { xmlWriter.writeProcessingInstruction(null, 'href="book.xls"'); }).toThrow(new Error('ArgumentException: name should not be undefined, null or empty'));
            done();
        }, 50);
    });
    it('Name  and text as valid string', (done): void => {
        xmlWriter.writeProcessingInstruction('xml-stylesheet', 'href="book.xls"')
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><?xml-stylesheet href="book.xls"?><root />');
            done();
        }, 50);
    });
    it('Name  as valid string and text as null', (done): void => {
        xmlWriter.writeProcessingInstruction('xml-stylesheet', null)
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><?xml-stylesheet?><root />');
            done();
        }, 50);
    });
    it('Name  as valid string and text as empty', (done): void => {
        xmlWriter.writeProcessingInstruction('xml-stylesheet', '')
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><?xml-stylesheet?><root />');
            done();
        }, 50);
    });
    it('Name  as valid string and text with special character', (done): void => {
        xmlWriter.writeProcessingInstruction('xml-stylesheet', 'href=\"book.xls&*\"\'\"');
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><?xml-stylesheet href="book.xls&*"\'"?><root />');
            done();
        }, 50);
    });
    it('Name  and text with valid special character', (done): void => {
        xmlWriter.writeProcessingInstruction('xml-_.stylesheet', 'href=\"book.xls&*\"\'\"');
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><?xml-_.stylesheet href="book.xls&*"\'"?><root />');
            done();
        }, 50);
    });
    it('write processing instruction after XmlWriterState initial', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        setTimeout((): void => {
            expect((): void => { xmlWriter.writeProcessingInstruction('xml-style', 'href=\"book.xls&*\"\'\"') }).toThrow(new Error('InvalidOperationException: Wrong Token'));
            done();
        }, 50);
    });
    it('Name  as invalid string and text as valid string', (done): void => {
        setTimeout((): void => {
            expect((): void => { xmlWriter.writeProcessingInstruction('xml-styl@esheet', 'href=\"book.xls&*\"\'\"') }).toThrow(new Error('InvalidArgumentException: invalid name character'));
            done();
        }, 50);
    });
    it('Name  as invalid string $ and text as valid string', (done): void => {
        setTimeout((): void => {
            expect((): void => { xmlWriter.writeProcessingInstruction('xml-styl$esheet', 'href=\"book.xls&*\"\'\"') }).toThrow(new Error('InvalidArgumentException: invalid name character'));
            done();
        }, 50);
    });
    it('Name  as invalid string # and text as valid string', (done): void => {
        setTimeout((): void => {
            expect((): void => { xmlWriter.writeProcessingInstruction('xml-styl#esheet', 'href=\"book.xls&*\"\'\"') }).toThrow(new Error('InvalidArgumentException: invalid name character'));
            done();
        }, 50);
    });
    it('Name  as invalid string = and text as valid string', (done): void => {
        setTimeout((): void => {
            expect((): void => { xmlWriter.writeProcessingInstruction('xml-styl=esheet', 'href=\"book.xls&*\"\'\"') }).toThrow(new Error('InvalidArgumentException: invalid name character'));
            done();
        }, 50);
    });
    it('Name = Xml ,after writeStartDocument', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        setTimeout((): void => {
            expect((): void => { xmlWriter.writeProcessingInstruction('xml', 'data.docx'); }).toThrow(new Error('InvalidArgumentException: Cannot write XML declaration.WriteStartDocument method has already written it'));
            done();
        }, 50);
    });
    it('Name = Xml ,after writeStartDocument', (done): void => {
        xmlWriter.writeProcessingInstruction('xml', 'data.docx');
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><?xml data.docx?><root />');
            done();
        }, 50);
    });
});
describe('create single non empty element with writeRaw method', (): void => {
    let xmlWriter: XmlWriter;
    let fileReader: FileReader;
    let xmlText: string | ArrayBuffer;
    beforeEach((): void => {
        /**
         * instantiate XmlWriter class
         */
        xmlWriter = new XmlWriter();
        /**
         * creates instance of FileReader class
         */
        fileReader = new FileReader();
        fileReader.onload = (): void => {
            /**
             * gets xml text from bolb
             */
            xmlText = fileReader.result;
        };
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
    });
    afterEach((): void => {
        xmlWriter.destroy();
        xmlWriter = undefined;
        fileReader = undefined;
        xmlText = '';
    });
    it('prefix and namespace as null and localName as Valid string,writeRaw text as null', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeRaw(null);
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root />');
            done();
        }, 50);
    });
    it('prefix and namespace as null and localName as Valid string,writeRaw text as empty', (done): void => {
        xmlWriter.writeStartElement(null, 'root', null);
        xmlWriter.writeRaw('');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root />');
            done();
        }, 50);
    });
    it('prefix and namespace as empty and localName as Valid string,writeRaw text as null', (done): void => {
        xmlWriter.writeStartElement('', 'root', '');
        xmlWriter.writeRaw(null);
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root />');
            done();
        }, 50);
    });
    it('prefix and namespace as empty and localName as Valid string,writeRaw text as empty', (done): void => {
        xmlWriter.writeStartElement('', 'root', '');
        xmlWriter.writeRaw('');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root />');
            done();
        }, 50);
    });
    it('prefix and namespace as empty and localName as Valid string,writeRaw text as valid string', (done): void => {
        xmlWriter.writeStartElement('', 'root', '');
        xmlWriter.writeRaw('child');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root>child</root>');
            done();
        }, 50);
    });
    it('prefix,namespace as empty and localName as Valid string,with two writeRaw method', (done): void => {
        xmlWriter.writeStartElement('', 'root', '');
        xmlWriter.writeRaw('child');
        xmlWriter.writeRaw(' node');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root>child node</root>');
            done();
        }, 50);
    });
    it('prefix and namespace as empty and localName as Valid string,writeRaw text as valid string with special character', (done): void => {
        xmlWriter.writeStartElement('', 'root', '');
        xmlWriter.writeRaw('~`!@#$%^&*()_+=-[];\',./{}|:"<>?');
        xmlWriter.writeEndElement();
        fileReader.readAsText(xmlWriter.buffer);
        setTimeout((): void => {
            expect(xmlText).toBe('<?xml version="1.0" encoding="utf-8"?><root>~`!@#$%^&*()_+=-[];\',./{}|:"<>?</root>');
            done();
        }, 50);
    });
    it('writeRaw at XmlWriteStart initial', (done): void => {
        setTimeout((): void => {
            expect((): void => { xmlWriter.writeRaw('value&&<\"'); }).toThrow(new Error('InvalidOperationException: Wrong Token'));
            done();
        }, 50);
    });
});
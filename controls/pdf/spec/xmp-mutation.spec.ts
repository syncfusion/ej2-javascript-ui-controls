import { PdfBasicJobTicketSchema } from "../src/pdf/core/xmp/pdf-basic-job-ticket-schema";
import { PdfBasicSchema } from "../src/pdf/core/xmp/pdf-basic-schema";
import { PdfSchema } from "../src/pdf/core/xmp/pdf-schema";
describe('1041696 Content Parser Mutation', () => {
    it('1041696 - should initialize basic job ticket schema name', () => {
        const xmp: any = {};
        const schema: any = new PdfBasicJobTicketSchema(xmp);
        expect(schema._name).toBe('BasicJobTicket');
    });
    it('1041704 - should initialize basic schema name and prefix', () => {
        const xmp: any = {};
        const schema: any = new PdfBasicSchema(xmp);
        expect(schema._prefix).toBe('xap');
        expect(schema._name).toBe('Basic');
    });
    it('1041704 - should return cached creatorTool value', () => {
        const schema: any = new PdfBasicSchema({} as any);
        let callCount: number = 0;
        schema._creatorTool = 'CachedTool';
        schema._getProperty = function (
            _name: string
        ): string {
            callCount++;
            return 'PropertyValue';
        };
        const result: string = schema.creatorTool;
        expect(result).toBe('CachedTool');
        expect(callCount).toBe(0);
    });
    it('1041704 - should return cached label value', () => {
        const schema: any = new PdfBasicSchema({} as any);
        let callCount: number = 0;
        schema._label = 'CachedLabel';
        schema._getProperty = function (
            _name: string
        ): string {
            callCount++;
            return 'PropertyValue';
        };
        const result: string = schema.label;
        expect(result).toBe('CachedLabel');
        expect(callCount).toBe(0);
    });
    it('1041704 - should return cached nickname value', () => {
        const schema: any = new PdfBasicSchema({} as any);
        let callCount: number = 0;
        schema._nickname = 'CachedNickname';
        schema._getProperty = function (
            _name: string
        ): string {
            callCount++;
            return 'PropertyValue';
        };
        const result: string = schema.nickname;
        expect(result).toBe('CachedNickname');
        expect(callCount).toBe(0);
    });
    it('1041704 - should return cached baseUrl value', () => {
        const schema: any = new PdfBasicSchema({} as any);
        let callCount: number = 0;
        schema._baseUrl = 'https://example.com';
        schema._getProperty = function (
            _name: string
        ): string {
            callCount++;
            return 'PropertyValue';
        };
        const result: string = schema.baseUrl;
        expect(result).toBe('https://example.com');
        expect(callCount).toBe(0);
    });
    it('1041704 - should return cached createDate value', () => {
        const schema: any = new PdfBasicSchema({} as any);
        let callCount: number = 0;
        schema._createDate = '2025-01-01';
        schema._getProperty = function (
            _name: string
        ): string {
            callCount++;
            return 'PropertyValue';
        };
        const result: string = schema.createDate;
        expect(result).toBe('2025-01-01');
        expect(callCount).toBe(0);
    });
    it('1041704 - should read modifyDate from xap ModifyDate property', () => {
        const schema: any = new PdfBasicSchema({} as any);
        let propertyName: string = '';
        schema._getProperty = function (
            name: string
        ): string {
            propertyName = name;
            return 'ModifyDateValue';
        };
        const result: string = schema.modifyDate;
        expect(result).toBe('ModifyDateValue');
        expect(propertyName).toBe('xap:ModifyDate');
    });
    it('1041704 - should read metadataDate from xap MetadataDate property', () => {
        const schema: any = new PdfBasicSchema({} as any);
        let propertyName: string = '';
        schema._getProperty = function (
            name: string
        ): string {
            propertyName = name;
            return 'MetadataDateValue';
        };
        const result: string = schema.metadataDate;
        expect(result).toBe('MetadataDateValue');
        expect(propertyName).toBe('xap:MetadataDate');
    });
    it('1041704 - should return cached advisory value', () => {
        const schema: any = new PdfBasicSchema({} as any);
        let callCount: number = 0;
        schema._advisory = ['A'];
        schema._getProperty = function (
            _name: string
        ): any {
            callCount++;
            return [];
        };
        const result: any =
            schema.advisory;
        expect(result).toBe(schema._advisory);
        expect(callCount).toBe(0);
    });
    it('1041704 - should return cached identifier value', () => {
        const schema: any = new PdfBasicSchema({} as any);
        let callCount: number = 0;
        schema._identifier = ['ID1'];
        schema._getProperty = function (
            _name: string
        ): any {
            callCount++;
            return [];
        };
        const result: any = schema.identifier;
        expect(result).toBe(schema._identifier);
        expect(callCount).toBe(0);
    });
    it('1041704 - should return cached rating value', () => {
        const schema: any = new PdfBasicSchema({} as any);
        schema._rating = 5;
        let callCount: number = 0;
        schema._getProperty = function (
            _name: string
        ): number {
            callCount++;
            return 10;
        };
        const result: number = schema.rating;
        expect(result).toBe(5);
        expect(callCount).toBe(0);
    });
    it('1041788 - should read producer from pdf Producer property', () => {
        const schema: any = new PdfSchema({} as any);
        let propertyName: string = '';
        schema._getProperty = function (
            name: string
        ): string {
            propertyName = name;
            return 'ProducerValue';
        };
        const result: string = schema.producer;
        expect(result).toBe('ProducerValue');
        expect(propertyName).toBe('pdf:Producer');
    });
    it('1041788 - should return cached producer value', () => {
        const schema: any = new PdfSchema({} as any);
        let callCount: number = 0;
        schema._producer = 'ExistingProducer';
        schema._getProperty = function (
            _name: string
        ): string {
            callCount++;
            return 'MutatedProducer';
        };
        const result: string = schema.producer;
        expect(result).toBe('ExistingProducer');
        expect(callCount).toBe(0);
    });
    it('1041788 - should return cached pdfVersion value', () => {
        const schema: any = new PdfSchema({} as any);
        let callCount: number = 0;
        schema._pdfVersion = '1.7';
        schema._getProperty = function (
            _name: string
        ): string {
            callCount++;
            return '2.0';
        };
        const result: string = schema.pdfVersion;
        expect(result).toBe('1.7');
        expect(callCount).toBe(0);
    });
    it('1041788 - should return cached keywords value', () => {
        const schema: any = new PdfSchema({} as any);
        let callCount: number = 0;
        schema._keywords = 'keyword1,keyword2';
        schema._getProperty = function (
            _name: string
        ): string {
            callCount++;
            return 'mutated-value';
        };
        const result: string = schema.keywords;
        expect(result).toBe('keyword1,keyword2');
        expect(callCount).toBe(0);
    });
    it('1041788 - should initialize pdf schema name and prefix', () => {
        const xmp: any = {};
        const schema: any = new PdfSchema(xmp);
        expect(schema._prefix).toBe('pdf');
        expect(schema._name).toBe('PDF');
    });
    it('1041788 - should return cached keywords value', () => {
        const schema: any = new PdfSchema({} as any);
        let callCount: number = 0;
        schema._keywords = 'keyword1,keyword2';
        schema._getProperty = function (
            _name: string
        ): string {
            callCount++;
            return 'mutated-value';
        };
        const result: string = schema.keywords;
        expect(result).toBe('keyword1,keyword2');
        expect(callCount).toBe(0);
    });
    it('1041788 - should return cached pdfVersion value', () => {
        const schema: any = new PdfSchema({} as any);
        let callCount: number = 0;
        schema._pdfVersion = '1.7';
        schema._getProperty = function (
            _name: string
        ): string {
            callCount++;
            return '2.0';
        };
        const result: string = schema.pdfVersion;
        expect(result).toBe('1.7');
        expect(callCount).toBe(0);
    });
    it('1041788 - should return cached producer value', () => {
        const schema: any = new PdfSchema({} as any);
        let callCount: number = 0;
        schema._producer = 'ExistingProducer';
        schema._getProperty = function (
            _name: string
        ): string {
            callCount++;
            return 'MutatedProducer';
        };
        const result: string = schema.producer;
        expect(result).toBe('ExistingProducer');
        expect(callCount).toBe(0);
    });
    it('1041788 - should read producer from pdf Producer property', () => {
        const schema: any = new PdfSchema({} as any);
        let propertyName: string = '';
        schema._getProperty = function (
            name: string
        ): string {
            propertyName = name;
            return 'ProducerValue';
        };
        const result: string = schema.producer;
        expect(result).toBe('ProducerValue');
        expect(propertyName).toBe('pdf:Producer');
    });
});
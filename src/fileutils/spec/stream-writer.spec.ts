import { StreamWriter } from '../src/stream-writer';
import { Encoding, EncodingType } from '../src/encoding';
/**
 * Stream Writer Spec Modules
 */


describe('Create StreamWriter instance', () => {
    beforeEach(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
    });
    it('Validate constructor', (done) => {
        /**
         * instantiate StreamWriter class
         */
        let streamWriter: StreamWriter = new StreamWriter();
        setTimeout(function (): void {
            expect(streamWriter.encoding.type).toBe('Utf8');
            done();
        }, 50);
    });
    it('StreamWriter constructor with Null checking', () => {
        let streamWriter: StreamWriter = new StreamWriter(null);
        expect(streamWriter.encoding.type).toBe('Utf8');
        expect(streamWriter.encoding.includeBom).toBe(false);
    });
    it('StreamWriter constructor with undefined', () => {
        let streamWriter: StreamWriter = new StreamWriter(undefined);
        expect(streamWriter.encoding.type).toBe('Utf8');
    });

    it('StreamWriter constructor with encoding', () => {
        let enc: Encoding = new Encoding();
        let streamWriter: StreamWriter = new StreamWriter(enc);
        expect(streamWriter.encoding.type).toBe('Ansi');
    });

    it('StreamWriter constructor with encoding with UTF-8', () => {
        let enc: Encoding = new Encoding(false);
        enc.type = 'Utf8';
        let streamWriter: StreamWriter = new StreamWriter(enc);
        expect(streamWriter.encoding.type).toBe('Utf8');
    });
});
describe('Streamwriter with Encoding Testing', () => {
    let streamWriter: StreamWriter;
    let fileReader: FileReader;
    let text: string | ArrayBuffer;
    beforeEach((): void => {
        /**
         * creates instance of FileReader class
         */
        fileReader = new FileReader();
        fileReader.onload = (): void => {
            /**
             * gets text from blob
             */
            text = fileReader.result;
        }
    });
    afterEach((): void => {
        streamWriter.destroy();
        streamWriter = undefined;
        fileReader = undefined;
        text = '';
    });

    it('text writing with ANSI encoding', (done) => {
        let encoding: Encoding = new Encoding(false);
        encoding.type = 'Ansi';
        streamWriter = new StreamWriter(encoding);
        streamWriter.write('numéro de téléphone');
        fileReader.readAsText(streamWriter.buffer);
        setTimeout(function (): void {
            expect(streamWriter.buffer.size).toBe(19);
            done();
        }, 50);
    });
    it('text writing with UTF8 without bom encoding', (done) => {
        let encoding: Encoding = new Encoding(false);
        encoding.type = 'Utf8';
        streamWriter = new StreamWriter(encoding);
        streamWriter.write('numéro de téléphone');
        fileReader.readAsText(streamWriter.buffer);
        setTimeout(function (): void {
            expect(streamWriter.buffer.size).toBe(22);
            done();
        }, 50);
    });
    it('text writing with UTF8 with bom encoding', (done) => {
        let encoding: Encoding = new Encoding(true);
        encoding.type = 'Utf8';
        streamWriter = new StreamWriter(encoding);
        streamWriter.write('numéro de téléphone');
        fileReader.readAsText(streamWriter.buffer);
        setTimeout(function (): void {
            expect(streamWriter.buffer.size).toBe(25);
            done();
        }, 50);
    });
    it('text writing with Unicode encoding with Bom', (done) => {
        let encoding: Encoding = new Encoding(true);
        encoding.type = 'Unicode';
        streamWriter = new StreamWriter(encoding);
        streamWriter.write('numéro de téléphone');
        fileReader.readAsText(streamWriter.buffer);
        setTimeout(function (): void {
            expect(streamWriter.buffer.size).toBe(40);
            done();
        }, 50);
    });
    it('text writing with Unicode encoding without Bom ', (done) => {
        let encoding: Encoding = new Encoding(false);
        encoding.type = 'Unicode';
        streamWriter = new StreamWriter(encoding);
        streamWriter.write('numéro de téléphone');
        fileReader.readAsText(streamWriter.buffer);
        setTimeout(function (): void {
            expect(streamWriter.buffer.size).toBe(38);
            done();
        }, 50);
    });

});
/**
 * StreamWriter write Method Testing
 */
describe("StreamWriter write Method Testing", () => {
    let streamWriter: StreamWriter;
    let fileReader: FileReader;
    let text: string | ArrayBuffer;
    let originalTimeout: number;

    beforeEach((): void => {
        streamWriter = new StreamWriter();
        /**
         * creates instance of FileReader class
         */
        fileReader = new FileReader();
        fileReader.onload = (): void => {
            /**
             * gets text from blob
             */
            text = fileReader.result;
        }
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
    });
    afterEach((): void => {
        streamWriter.destroy();
        streamWriter = undefined;
        fileReader = undefined;
        text = '';
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    it('write with null parameter', (): void => {
        expect(function (): void { streamWriter.write(null); }).toThrow(new Error('ArgumentException: string cannot be null or undefined'));
    });
    it('write with undefined parameter', (): void => {
        expect(function (): void { streamWriter.write(undefined); }).toThrow(new Error('ArgumentException: string cannot be null or undefined'));
    });
    it('write with empty string', () => {
        streamWriter.write('');
        expect(streamWriter.buffer.size == 0).toBe(true);
    });
    it('write with string parameter', (done) => {
        streamWriter.write('StreamWriter');
        fileReader.readAsText(streamWriter.buffer);
        setTimeout(function (): void {
            expect(text).toBe('StreamWriter');
            done();
        }, 50);

    });
    it('write with integer parameter', (done) => {
        let x: number = 124;
        streamWriter.write(x.toString());
        fileReader.readAsText(streamWriter.buffer);
        setTimeout(function (): void {
            expect(text).toBe('124');
            expect(streamWriter.buffer.size).toBe(3);
            done();
        }, 50);

    });
    it('write with integer parameter', (done) => {
        let x: number = 124;
        streamWriter.write(x.toString());
        fileReader.readAsText(streamWriter.buffer);
        setTimeout(function (): void {
            expect(text).toBe('124');
            expect(streamWriter.buffer.size).toBe(3);
            done();
        }, 50);

    });
    it('write with decimal parameter', (done) => {
        let x: number = 124.66;
        streamWriter.write(x.toString());
        fileReader.readAsText(streamWriter.buffer);
        setTimeout(function (): void {
            expect(text).toBe('124.66');
            done();
        }, 50);

    });
    it('write with negative value parameter', (done) => {
        let x: number = -124;
        streamWriter.write(x.toString());
        fileReader.readAsText(streamWriter.buffer);
        setTimeout(function (): void {
            expect(text).toBe('-124');
            done();
        }, 50);

    });
    it('write with boolean parameter', (done) => {
        let x: boolean = true;
        streamWriter.write(x.toString());
        fileReader.readAsText(streamWriter.buffer);
        setTimeout(function (): void {
            expect(text).toBe('true');
            done();
        }, 50);

    });
    it('Test text appending in blob', (done) => {
        streamWriter.write('Stream');
        streamWriter.write('Writer');
        fileReader.readAsText(streamWriter.buffer);
        setTimeout(function (): void {
            expect(text).toBe('StreamWriter');
            done();
        }, 50);
    });
    it('Without write method', (done) => {
        fileReader.readAsText(streamWriter.buffer);
        setTimeout(function (): void {
            expect(text).toBe('');
            done();
        }, 50);
    });
});

/**
 * StreamWriter writeLine Method Testing
 */
describe("StreamWriter writeLine Method Testing", () => {
    let streamWriter: StreamWriter;
    let fileReader: FileReader;
    let text: string | ArrayBuffer;
    let originalTimeout: number;

    beforeEach((): void => {
        streamWriter = new StreamWriter();
        /**
         * creates instance of FileReader class
         */
        fileReader = new FileReader();
        fileReader.onload = (): void => {
            /**
             * gets text from blob
             */
            text = fileReader.result;
        }
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
    });
    afterEach((): void => {
        streamWriter.destroy();
        streamWriter = undefined;
        fileReader = undefined;
        text = '';
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    it('writeLine with null parameter', (): void => {
        expect(function (): void { streamWriter.writeLine(null); }).toThrow(new Error('ArgumentException: string cannot be null or undefined'));
    });
    it('writeLine with undefined parameter', (): void => {
        expect(function (): void { streamWriter.writeLine(null); }).toThrow(new Error('ArgumentException: string cannot be null or undefined'));
    });
    it('writeLine with empty string', () => {
        streamWriter.writeLine('');
        expect(streamWriter.buffer.size == 2).toBe(true);
    });
    it('writeLine with string parameter', (done) => {
        streamWriter.writeLine('StreamWriter');
        fileReader.readAsText(streamWriter.buffer);
        setTimeout(function (): void {
            expect(text).toBe('StreamWriter\r\n');
            done();
        }, 50);

    });
    it('writeLine with integer parameter', (done) => {
        let x: number = 124;
        streamWriter.writeLine(x.toString());
        fileReader.readAsText(streamWriter.buffer);
        setTimeout(function (): void {
            expect(streamWriter.buffer.size).toBe(5);
            done();
        }, 50);

    });
    it('writeLine with decimal parameter', (done) => {
        let x: number = 124.66;
        streamWriter.writeLine(x.toString());
        fileReader.readAsText(streamWriter.buffer);
        setTimeout(function (): void {
            expect(text).toBe('124.66\r\n');
            done();
        }, 50);

    });
    it('writeLine with negative value parameter', (done) => {
        let x: number = -124;
        streamWriter.writeLine(x.toString());
        fileReader.readAsText(streamWriter.buffer);
        setTimeout(function (): void {
            expect(text).toBe('-124\r\n');
            done();
        }, 50);

    });
    it('writeLine with boolean parameter', (done) => {
        let x: boolean = true;
        streamWriter.writeLine(x.toString());
        fileReader.readAsText(streamWriter.buffer);
        setTimeout(function (): void {
            expect(text).toBe('true\r\n');
            done();
        }, 50);

    });
    it('Test text appending in blob', (done) => {
        streamWriter.write('Stream');
        streamWriter.writeLine('Writer');
        fileReader.readAsText(streamWriter.buffer);
        setTimeout(function (): void {
            expect(text).toBe('StreamWriter\r\n');
            done();
        }, 50);
    });
    it('Without writeLine method', (done) => {
        fileReader.readAsText(streamWriter.buffer);
        setTimeout(function (): void {
            expect(text).toBe('');
            done();
        }, 50);
    });
    it('writeline method testing with maximum string', () => {
        for (let i: number = 0; i < 10241; i++) {
            streamWriter.writeLine('a');
        }
        let position: number = streamWriter.buffer.size;
        expect(position).toBe(30723);
    });
});

/**
 *StreamWriter save and destroy testing
 */
describe('StreamWriter save and destroy testing', () => {
    let streamWriter: StreamWriter;
    let fileReader: FileReader;
    let text: string | ArrayBuffer;
    let originalTimeout: number;

    beforeEach((): void => {
        let encoding: Encoding = new Encoding(true);
        encoding.type = 'Utf8';
        streamWriter = new StreamWriter(encoding);
        fileReader = new FileReader();
        fileReader.onload = (): void => {
            text = fileReader.result;
        }
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
    });
    afterEach((): void => {
        streamWriter.destroy();
        streamWriter = undefined;
        fileReader = undefined;
        text = '';
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });
    it('save method with null parameter', () => {
        expect((): void => { streamWriter.save(null) }).toThrow(new Error('ArgumentException: fileName cannot be undefined, null or empty'));
    });
    it('save method with empty string', () => {
        expect((): void => { streamWriter.save('') }).toThrow(new Error('ArgumentException: fileName cannot be undefined, null or empty'));
    });
    it('save method with valid string', (done) => {
        streamWriter.write('Stream');
        fileReader.readAsText(streamWriter.buffer);
        setTimeout(function (): void {
            expect(text === 'Stream').toEqual(true);
            done();
        }, 50);
    });
    it('before calling destroy method', (done) => {
        streamWriter.write('Stream');
        streamWriter.write('Writer');
        fileReader.readAsText(streamWriter.buffer);
        setTimeout(function (): void {
            expect(text === 'Writer').toEqual(false);
            done();
        }, 50);
    });
    it('after calling destroy method ', (done) => {
        streamWriter.write('Stream');
        streamWriter.destroy();
        setTimeout(function (): void {
            expect(() => { streamWriter.write('Writer') }).toThrow(new Error('Object Disposed Exception: current writer is disposed'));
            done();
        }, 50);
    });
    it('after calling destroy method, call writeLine method', (done) => {
        streamWriter.write('Stream');
        streamWriter.destroy();
        setTimeout(function (): void {
            expect(() => { streamWriter.writeLine('Writer') }).toThrow(new Error('Object Disposed Exception: current writer is disposed'));
            done();
        }, 50);
    });
    it('save method testing', (done) => {
        for (let i: number = 0; i < 10241; i++) {
            streamWriter.write('a');
        }
        let position: number = streamWriter.buffer.size;
        expect(position).toBe(10244);
        // streamWriter.save('sample.txt');
        setTimeout(function (): void {
            expect(text).toBe('');
            done()
        }, 100);
    });
    // it('save method with MicrosoftBrowser testing', () => {
    //     streamWriter.write('StreamWriter');
    //     expect(() => { streamWriter.save('sample.txt'); }).not.toThrowError();
    // });
});

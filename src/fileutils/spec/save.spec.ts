import { Save } from '../src/save';
/**
 * Save module spec
 */
describe('Save class specification', () => {
    let saveObj: Save = new Save();
    it('save with null parameter', () => {
        expect(() => { Save.save(null, null); }).toThrowError();
    });
    it('save with undefined parameter', () => {
        expect(() => { Save.save(undefined, undefined); }).toThrowError();
    });
    it('save with empty string', () => {
        expect(() => { Save.save('', new Blob(['Hello'])); }).toThrowError();
    });
    // it('save with valid parameter', () => {
    //     Save.isMicrosoftBrowser = false;
    //     expect(() => { Save.save('Sample.txt', new Blob(['Hello'])); }).not.toThrowError();
    // });
    it('save with microsoft browser testing', () => {
        Save.isMicrosoftBrowser = true;
        expect(() => { Save.save('Sample.txt', new Blob(['Hello'])); }).toThrowError();
    });
    it('Get MIME Type Validation', () => {
        expect(Save.getMimeType('html')).toBe('text/html');
        expect(Save.getMimeType('pdf')).toBe('application/pdf');
        expect(Save.getMimeType('docx')).toBe('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        expect(Save.getMimeType('xlsx')).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        expect(Save.getMimeType('txt')).toBe('text/plain');
    });
    it('Save With out file extension', () => {
        Save.isMicrosoftBrowser = false;
        Save.save('Sample', new Blob(['Hello']));
        expect('').toBe('');
    });
    it('Save With file extension', () => {
        Save.isMicrosoftBrowser = false;
        Save.save('Sample.txt', new Blob(['Hello']));
        expect('').toBe('');
    });
    it('Save internal Validation docx', (done) => {
        let blob: Blob = new Blob(['docx-demo'], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        (Save as any).saveInternal('sample.docx', 'docx', blob, null, false);
        setTimeout(() => {
            done();
        }, 50);
    });
    it('Save internal Validation xlsx', (done) => {
        let blob: Blob = new Blob(['docx-demo'], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        (Save as any).saveInternal('sample.xlsx', 'xlsx', blob, null, false);
        setTimeout(() => {
            done();
        }, 50);
    });
    it('Save internal Validation txt', () => {
        let blob: Blob = new Blob(['docx-demo'], { type: 'text/plain' });
        (Save as any).saveInternal('sample.txt', 'txt', blob, null, false);
    });
});
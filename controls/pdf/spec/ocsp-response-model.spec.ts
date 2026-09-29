import { _PdfOneTimeResponseHelper } from "../src/pdf/core/security/digital-signature/ocsp/ocsp-response-model";
import { _PdfGeneralizedTime } from "../src/pdf/core/security/digital-signature/ocsp/ocsp-response-utils";
describe('_PdfOneTimeResponseHelper survived mutations', () => {
    it('returns the current update through _thisUpdate', () => {
        const helper: _PdfOneTimeResponseHelper =
            new _PdfOneTimeResponseHelper();
        const currentUpdate: _PdfGeneralizedTime =
            new _PdfGeneralizedTime();
        (helper as any)._currentUpdate = currentUpdate;
        expect((helper as any)._thisUpdate).toBe(currentUpdate);
    });
    it('defines _thisUpdate as enumerable and configurable', () => {
        const descriptor: PropertyDescriptor | undefined =
            Object.getOwnPropertyDescriptor(
                _PdfOneTimeResponseHelper.prototype,
                '_thisUpdate'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor!.enumerable).toBe(true);
        expect(descriptor!.configurable).toBe(true);
    });
    it('returns the next update through _nextUpdateTime', () => {
        const helper: _PdfOneTimeResponseHelper =
            new _PdfOneTimeResponseHelper();
        const nextUpdate: _PdfGeneralizedTime =
            new _PdfGeneralizedTime();
        (helper as any)._nextUpdate = nextUpdate;
        expect((helper as any)._nextUpdateTime).toBe(nextUpdate);
    });
    it('defines _nextUpdateTime as enumerable and configurable', () => {
        const descriptor: PropertyDescriptor | undefined =
            Object.getOwnPropertyDescriptor(
                _PdfOneTimeResponseHelper.prototype,
                '_nextUpdateTime'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor!.enumerable).toBe(true);
        expect(descriptor!.configurable).toBe(true);
    });
});
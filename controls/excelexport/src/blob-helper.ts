/**
 * BlobHelper class
 * @private
 */
export class BlobHelper {
    /* tslint:disable:no-any */
    private parts: any = [];
    private blob: Blob;
    /* tslint:disable:no-any */
    public append(part: any): void {
        this.parts.push(part);
        this.blob = undefined; // Invalidate the blob
    }

    public getBlob(): Blob {
        return new Blob(this.parts, { type: 'text/plain' });
    }
}
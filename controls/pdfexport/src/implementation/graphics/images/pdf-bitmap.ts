/**
 * PdfBitmap.ts class for EJ2-PDF
 */
import { ImageDecoder } from './../../graphics/images/image-decoder';
import { ByteArray } from './../../graphics/images/byte-array';
import { DictionaryProperties } from './../../input-output/pdf-dictionary-properties';
import { PdfImage } from './pdf-image';
/**
 * The 'PdfBitmap' contains methods and properties to handle the Bitmap images.
 * ```typescript
 * // create a new PDF document.
 * let document : PdfDocument = new PdfDocument();
 * // add a page to the document.
 * let page1 : PdfPage = document.pages.add();
 * // base64 string of an image
 * let imageString : string = '/9j/3+2w7em7HzY/KiijFw … 1OEYRUYrQ45yc5OUtz/9k=';
 * // load the image from the base64 string of original image.
 * let image : PdfBitmap = new PdfBitmap(imageString);
 * // draw the image
 * page1.graphics.drawImage(image, new RectangleF({x : 10, y : 10}, {width : 200, height : 200}));
 * // save the document.
 * document.save('output.pdf');
 * // destroy the document
 * document.destroy();
 * ```
 */
export class PdfBitmap extends PdfImage {
    //Fields
    /**
     * Specifies the `status` of an image.
     * @default true.
     * @hidden
     * @private
     */
    private imageStatus : boolean = true;
    /**
     * Internal variable for accessing fields from `DictionryProperties` class.
     * @hidden
     * @private
     */
    private dictionaryProperties : DictionaryProperties = new DictionaryProperties();
    /**
     * `Type` of an image.
     * @hidden
     * @private
     */
    public checkImageType : number;
    //Properties
    /**
     * Object to store `decoder` of an image.
     * @hidden
     * @private
     */
    public decoder : ImageDecoder;
    /**
     * `Load image`.
     * @hidden
     * @private
     */
    private loadImage(encodedString : string) : void {
        let task : void = this.initializeAsync(encodedString);
    }
    /**
     * Create an instance for `PdfBitmap` class.
     * @param encodedString Base64 string of an image.
     * ```typescript
     * // create a new PDF document.
     * let document : PdfDocument = new PdfDocument();
     * // add a page to the document.
     * let page1 : PdfPage = document.pages.add();
     * // base64 string of an image
     * let imageString : string = '/9j/3+2w7em7HzY/KiijFw … 1OEYRUYrQ45yc5OUtz/9k=';
     * //
     * // load the image from the base64 string of original image.
     * let image : PdfBitmap = new PdfBitmap(imageString);
     * //
     * // draw the image
     * page1.graphics.drawImage(image, new RectangleF({x : 10, y : 10}, {width : 200, height : 200}));
     * // save the document.
     * document.save('output.pdf');
     * // destroy the document
     * document.destroy();
     * ```
     */
    public constructor(encodedString : string) {
        super();
        this.loadImage(encodedString);
    }
    /**
     * `Initialize` image parameters.
     * @private
     */
    public initializeAsync(encodedString : string) : void {
        let byteArray : ByteArray = new ByteArray(encodedString.length);
        byteArray.writeFromBase64String(encodedString);
        this.decoder = new ImageDecoder(byteArray);
        this.height = this.decoder.height;
        this.width = this.decoder.width;
        // FrameCount = BitmapImageDecoder.FrameCount;
        this.bitsPerComponent = this.decoder.bitsPerComponent;
    }
    /**
     * `Saves` the image into stream.
     * @private
     */
    public save() : void {
        this.imageStatus = true;
        this.imageStream = this.decoder.getImageDictionary();
    }
}

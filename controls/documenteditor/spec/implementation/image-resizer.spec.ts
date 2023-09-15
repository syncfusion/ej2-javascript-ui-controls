import { LayoutViewer, PageLayoutViewer, DocumentHelper } from '../../src/index';
import { DocumentEditor } from '../../src/document-editor/document-editor';
import { Page, ImageElementBox, ParagraphWidget, LineWidget } from '../../src/index';
import { ImageResizer, SelectedImageInfo } from '../../src/document-editor/implementation/editor/image-resizer';
import { Point, ImagePointInfo } from '../../src/document-editor/implementation/editor/editor-helper';
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from '../test-helper.spec';
import { ImageInfo } from '../../src/index';
import { Editor } from '../../src/index';
import { Selection } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/index';
/**
 * Image Resizer spec
 */
describe('Image format validation', () => {
    it('Image format constructor validation', () => {
console.log('Image format constructor validation');
        let image: ImageElementBox = new ImageElementBox(false);
        image.height = 100;
        image.width = 75;
        let imageFormat: ImageInfo = new ImageInfo(image);
        expect(imageFormat.height).toBe(100);
        expect(imageFormat.width).toBe(75);
    });
    it('Image format destroy validation', () => {
console.log('Image format destroy validation');
        let image: ImageElementBox = new ImageElementBox(false);
        image.width = 10;
        image.height = 10;
        let imageFormat: ImageInfo = new ImageInfo(image);
        imageFormat.destroy();
        expect(imageFormat.width).toBe(undefined);
    });
});

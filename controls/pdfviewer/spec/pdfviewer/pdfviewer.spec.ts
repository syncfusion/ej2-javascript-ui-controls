import { createElement } from "@syncfusion/ej2-base";
import { PdfViewer, Toolbar, Magnification, Navigation, LinkAnnotation,ThumbnailView,BookmarkView,
    TextSelection, TextSearch, Print, Annotation,FormFields, AnnotationDataFormat,FormDesigner,PageOrganizer} from "../../src/index";
import { mouseDownEvent, mouseMoveEvent, mouseUpEvent } from "./utils.spec";
import { EMPTY_PDF_B64 } from "./Data/pdf-data.spec";

/**
* PdfViewer spec
*/
describe('PDF_Viewer', () => {
  let pdfviewer: PdfViewer = null;
  PdfViewer.Inject(Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
    TextSelection, TextSearch, Print, Annotation, FormFields, FormDesigner, PageOrganizer);

  beforeAll((done) => {
    const element: HTMLElement = createElement('div', { id: 'pdfviewer' });
    document.body.appendChild(element);
    pdfviewer = new PdfViewer({
      resourceUrl: window.location.origin + '/base/src/pdfviewer/ej2-pdfviewer-lib',
      documentPath: "data:application/pdf;base64," + EMPTY_PDF_B64
    });
    pdfviewer.documentLoad = () => {
      done();
    }
    pdfviewer.appendTo("#pdfviewer");
  });
  afterAll(() => {
    if (pdfviewer) {
      pdfviewer.destroy();
      const el = document.getElementById('pdfviewer');
      if (el && el.parentNode) { el.parentNode.removeChild(el); }
      pdfviewer = null;
    }
  });
  afterEach(() => {
  });
  it("Get total Page Number", (done) => {
    // Wait until PDF is actually loaded
    try {
      expect(pdfviewer.pageCount).toBe(1);
      done();
    } catch (e) {
      done.fail(e);
    }
  });
  it("Get total Page Details", (done) => {
    // Wait until PDF is actually loaded
    try {
      let pageDetails = pdfviewer.getPageInfo(0);
      expect(pageDetails.pageIndex).toBe(0);
      expect(pageDetails.rotation).toBe(0);
      expect(pageDetails.width).toBe(595);
      expect(pageDetails.height).toBe(842);
      done();
    } catch (e) {
      done.fail(e);
    }
  });
  
  it('Add Rectangle Annotation in the UI', async (done: DoneFn) => {
    try {
      const canvas = document.querySelector('#pdfviewer_textLayer_0') as HTMLElement | null;
      const target: HTMLElement | null = canvas;
      if (!target) {
        throw new Error('Could not find target element to dispatch mouse events. Update selector in test.');
      }
      // ensure annotation module exists
      if (!pdfviewer || !pdfviewer.annotation || typeof pdfviewer.annotation.setAnnotationMode !== 'function') {
        throw new Error('pdfviewer.annotation.setAnnotationMode not available. Ensure viewer and annotation module are initialized.');
      }
      // Set annotation mode
      pdfviewer.annotation.setAnnotationMode('Rectangle');
      // Coordinates and timing
      const startX = 450;
      const startY = 350;
      const endX = 550;
      const endY = 200;
      const steps = 20;

      // Move cursor to start (optional)
      mouseMoveEvent(target, startX, startY);

      // Press mouse at start
      mouseDownEvent(target, startX, startY);

      // Interpolate moves
      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const x = Math.round(startX + (endX - startX) * t);
        const y = Math.round(startY + (endY - startY) * t);
        mouseMoveEvent(target, x, y);
      }

      // Release at end
      mouseUpEvent(target, endX, endY);
      // Assert annotation added
      const collectionLen = Array.isArray(pdfviewer.annotationCollection) ? pdfviewer.annotationCollection.length : 0;
      expect(collectionLen).toBe(1);
      done();
    } catch (e) {
      done.fail(e as Error);
    }
  });
  // it("Get annotation count", (done) => {
  //   pdfviewer = new PdfViewer({
  //     resourceUrl: 'https://cdn.syncfusion.com/ej2/32.1.19/dist/ej2-pdfviewer-lib',
  //     documentPath: 'https://cdn.syncfusion.com/content/pdf/programmatical-annotations.pdf',
  //     documentLoad: () => {
  //       try {
  //         // setTimeout(function () {
  //         const viewer = (document.getElementById('pdfviewer') as any).ej2_instances[0];
  //         expect(viewer.annotationCollection.length).toBe(1);
  //         done();
  //         // }, 3000);
  //       } catch (e) {
  //         done.fail(e);
  //       }
  //     }
  //   });
  //   pdfviewer.appendTo("#pdfviewer");
  // });
});
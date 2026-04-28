import { createElement } from "@syncfusion/ej2-base";
import {
  PdfViewer, Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
  TextSelection, TextSearch, Print, Annotation, FormFields, AnnotationDataFormat, FormDesigner, PageOrganizer
} from "../../../../src/index";
import { mouseDownEvent, mouseMoveEvent, mouseUpEvent } from "../../utils.spec";
import { EMPTY_PDF_B64 } from "../../Data/pdf-data.spec";


describe('PDF_Viewer_Locale', () => {
  let pdfviewer_Locale: PdfViewer = null;
  PdfViewer.Inject(Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
    TextSelection, TextSearch, Print, Annotation, FormFields, FormDesigner, PageOrganizer);

  beforeAll((done) => {
    const element: HTMLElement = createElement('div', { id: 'pdfviewer_Locale' });
    document.body.appendChild(element);
    pdfviewer_Locale = new PdfViewer({
      resourceUrl: window.location.origin + '/base/src/pdfviewer/ej2-pdfviewer-lib',
      documentPath: "data:application/pdf;base64," + EMPTY_PDF_B64
    });
    pdfviewer_Locale.documentLoad = () => {
      done();
    }
    pdfviewer_Locale.appendTo("#pdfviewer_Locale");
  });

  afterAll(() => {
    if (pdfviewer_Locale) {
      pdfviewer_Locale.destroy();
      const el = document.getElementById('pdfviewer_Locale');
      if (el && el.parentNode) { el.parentNode.removeChild(el); }
      pdfviewer_Locale = null;
    }
  });

  afterEach(() => {
  });
  it('1007446 - changing the localization tooltip is not rendered properly', function (done: DoneFn) {
    try {
      const pv= pdfviewer_Locale;
      if (!pv) { done.fail('pdfviewer not initialized'); return; }

      pv.locale = 'en';
      if (pv.dataBind) pv.dataBind();

      pv.documentLoad = () => {
        try {
          const tool = document.getElementById('pdfviewer_Locale_toolbarContainer') as HTMLElement | null;
          expect(tool).not.toBeNull();
          const layer = document.getElementById('pdfviewer_Locale_textLayer_0') as HTMLElement | null;
          expect(layer).not.toBeNull();
          const btn = document.getElementById('pdfviewer_Locale_open') as HTMLElement | null;
          expect(!!btn).toBe(true, 'Open button element not found');
          const el = document.getElementById('pdfviewer_Locale_openText') as HTMLElement | null;
          if (!el) { done.fail('Open text element missing (en)'); return; }
          expect(!!el).toBe(true, 'Open text element not found (en)');
          expect((el.textContent || '').trim()).toBe('Open');
          if (btn && el) expect(btn.contains(el)).toBe(true, 'Open label should be inside Open button');
          pv.documentLoad = null;
          done();
        } catch (e) {
          done.fail(e as Error);
        }
      };
    } catch (e) {
      done.fail(e as Error);
    }
  });
});
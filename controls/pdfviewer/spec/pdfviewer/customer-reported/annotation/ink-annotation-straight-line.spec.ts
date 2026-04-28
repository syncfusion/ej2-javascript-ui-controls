import { createElement } from '@syncfusion/ej2-base';
import { PdfViewer, Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView, TextSelection, TextSearch, Print,
  Annotation, FormFields, FormDesigner, PageOrganizer } from '../../../../src/index';
import { getTarget, mouseDownEvent, mouseMoveEvent, mouseUpEvent } from '../../utils.spec';
import { EMPTY_PDF_B64 } from '../../Data/pdf-data.spec';

/**
 * PDF Viewer Straight-Line Ink Annotation NaN Corruption Test
 * Issue 1021264: Straight-line ink annotation corrupts downloaded PDF due to NaN value in saveInkSignature
 */
describe('PDF_Viewer_Ink_StraightLine_NaNCorruption', () => {
  let pdfviewer_straightline_ink: PdfViewer | null = null;
  PdfViewer.Inject(
    Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView, TextSelection, TextSearch, Print, Annotation, FormFields, FormDesigner, PageOrganizer
  );

  beforeAll((done: DoneFn) => {
    const element = createElement('div', { id: 'pdfviewer_straightline_ink' });
    document.body.appendChild(element);
    pdfviewer_straightline_ink = new PdfViewer({
      resourceUrl: window.location.origin + '/base/src/pdfviewer/ej2-pdfviewer-lib',
      documentPath: 'data:application/pdf;base64,' + EMPTY_PDF_B64
    });
    pdfviewer_straightline_ink.documentLoad = () => done();
    pdfviewer_straightline_ink.appendTo('#pdfviewer_straightline_ink');
  });

  afterAll(() => {
    if (pdfviewer_straightline_ink) {
      pdfviewer_straightline_ink.destroy();
      const el = document.getElementById('pdfviewer_straightline_ink');
      if (el && el.parentNode) { el.parentNode.removeChild(el); }
      pdfviewer_straightline_ink = null;
    }
  });

  it('1021264-straight-line-ink-annotation-should-serialize-correctly-after-saveAsBlob', async () => {
    // Act: Draw a vertical straight-line ink annotation (start and end at same X coordinate)
    pdfviewer_straightline_ink.annotation.setAnnotationMode('Ink');
    const target = getTarget('#pdfviewer_straightline_ink_textLayer_0');
    const rect = target.getBoundingClientRect();
    
    // Vertical straight line: same X coordinate, different Y values
    const startX = Math.round(rect.left + 100);
    const startY = Math.round(rect.top + 50);
    const endX = Math.round(rect.left + 100);  // Same X as start (vertical line)
    const endY = Math.round(rect.top + 150);   // Different Y

    mouseDownEvent(target, startX, startY);
    mouseMoveEvent(target, endX, endY);
    mouseUpEvent(target, endX, endY);

    // Finalize annotation
    pdfviewer_straightline_ink.annotation.setAnnotationMode('None');
    
    // Verify annotation was added
    const annotationCountBeforeSave = pdfviewer_straightline_ink.annotationCollection.length;
    expect(annotationCountBeforeSave).toBeGreaterThan(0);
    
    // Act: Save as blob and reload
    const blob = await pdfviewer_straightline_ink.saveAsBlob();
    
    // Assert: Verify blob is valid (not corrupted due to NaN in saveInkSignature)
    expect(blob).toBeDefined();
    expect(blob.size).toBeGreaterThan(0);
      
    const reloadPromise = new Promise<void>((resolve) => {
      pdfviewer_straightline_ink.documentLoad = () => resolve();
    });    
    const reader = new FileReader();
    reader.onload = () => pdfviewer_straightline_ink.load(reader.result as string, null);
    reader.readAsDataURL(blob);
    
    await reloadPromise;
    
    // Assert: Verify ink annotation is preserved after reload
    expect(pdfviewer_straightline_ink.annotationCollection.length).toBeGreaterThan(0);
    const reloadedAnnotation = pdfviewer_straightline_ink.annotationCollection[0];
    
    // Assert: Annotation has valid bounds (not NaN)
    expect(reloadedAnnotation.bounds).toBeDefined();
    expect(reloadedAnnotation.bounds.x).toBeDefined();
    expect(reloadedAnnotation.bounds.y).toBeDefined();
    expect(reloadedAnnotation.bounds.width).toBeDefined();
    expect(reloadedAnnotation.bounds.height).toBeDefined();
    
    // Assert: Bounds dimensions are positive (minimum 1 for zero-dimension lines)
    expect(reloadedAnnotation.bounds.width).toBeGreaterThan(0);
    expect(reloadedAnnotation.bounds.height).toBeGreaterThan(0);
  });
});

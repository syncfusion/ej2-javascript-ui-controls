import { createElement } from "@syncfusion/ej2-base";
import {
    PdfViewer, Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
    TextSelection, TextSearch, Print, Annotation, FormFields, AnnotationDataFormat, FormDesigner, PageOrganizer
} from "../../../../src/index";
import { mouseOverEvent, mouseClickEvent } from "../../utils.spec";
import { EMPTY_PDF_B64 } from "../../Data/pdf-data.spec";

/**
* PdfViewer spec
*/
describe('PDF_Viewer_UndoRedo', () => {
    let pdfviewer_undoredo: PdfViewer = null;
    PdfViewer.Inject(Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
        TextSelection, TextSearch, Print, Annotation, FormFields, FormDesigner, PageOrganizer);

    beforeAll((done) => {
        const element: HTMLElement = createElement('div', { id: 'pdfviewer_undoredo' });
        document.body.appendChild(element);
        pdfviewer_undoredo = new PdfViewer({
            resourceUrl: window.location.origin + '/base/src/pdfviewer/ej2-pdfviewer-lib',
            documentPath: "data:application/pdf;base64," + EMPTY_PDF_B64
        });
        pdfviewer_undoredo.documentLoad = () => {
            done();
        }
        pdfviewer_undoredo.appendTo("#pdfviewer_undoredo");
    });

    afterAll(() => {
        if (pdfviewer_undoredo) {
            pdfviewer_undoredo.destroy();
            const el = document.getElementById('pdfviewer_undoredo');
            if (el && el.parentNode) { el.parentNode.removeChild(el); }
            pdfviewer_undoredo = null;
        }
    });

    afterEach(() => {
    });

    it("1009575-Undo/Redo should not throw when delete is disabled (insert empty page & revert cleanly", async (done: DoneFn) => {
      try {
        pdfviewer_undoredo.pageOrganizerSettings.canDelete = false;
        pdfviewer_undoredo.extractTextCompleted = () => {
          const organizePages = document.querySelector(
            "#pdfviewer_undoredo_organize-view_icon",
          ) as HTMLElement | null;
          // Click Organizes Pages
          if (!organizePages) {
            throw new Error(
              "organizePages button not found: #pdfviewer_undoredo_organize-view_icon",
            );
          }
          mouseClickEvent(organizePages);
          // Hover the First Page to click the insert left button
          const firstPage = document.querySelector(
            "#pdfviewer_undoredo_container_image_0",
          ) as HTMLElement | null;
          if (!firstPage) {
            throw new Error(
              "firstPage not found: #pdfviewer_undoredo_container_image_0",
            );
          }
          mouseOverEvent(firstPage);
          // Click Insert Left
          const insertLeft = document.querySelector(
            "#pdfviewer_undoredo_insert_page_0",
          ) as HTMLElement | null;
          if (!insertLeft) {
            throw new Error(
              "insertLeft button not found: #pdfviewer_undoredo_insert_page_0",
            );
          }
          mouseClickEvent(insertLeft);
          // Check Page Number while insert
          const pageNumber = document.querySelector(
            "#pdfviewer_undoredo_tile_pagenumber_0_0",
          ) as HTMLElement | null;
          if (!pageNumber) {
            throw new Error(
              "pageNumber not found: #pdfviewer_undoredo_tile_pagenumber_0_0",
            );
          }
          // Check Page Count while insert
          const pgCntInsertLeft = document.querySelectorAll(
            ".e-pv-organize-anchor-node",
          ).length;
          if (!pgCntInsertLeft) {
            throw new Error(
              "pgCntInsertLeft not found: .e-pv-organize-anchor-node",
            );
          }
          expect(pgCntInsertLeft).toEqual(pdfviewer_undoredo.pageCount + 1);
          // Click Undo
          const undo = document.querySelector(
            "#pdfviewer_undoredo_undo_organize_Pages",
          ) as HTMLElement | null;
          if (!undo) {
            throw new Error(
              "undo button not found: #pdfviewer_undoredo_undo_organize_Pages",
            );
          }
          mouseClickEvent(undo);
          // Check Page Number after undo
          const undoPageNumber = document.querySelector(
            "#pdfviewer_undoredo_tile_pagenumber_0",
          ) as HTMLElement | null;
          if (!undoPageNumber) {
            throw new Error(
              "undoPageNumber not found: #pdfviewer_undoredo_tile_pagenumber_0",
            );
          }
          expect(pageNumber.textContent).toEqual(undoPageNumber.textContent);
          // Check Page Count after undo
          const pgCntAfterUndo = document.querySelectorAll(
            ".e-pv-organize-anchor-node",
          ).length;
          if (!pgCntAfterUndo) {
            throw new Error(
              "pgCntAfterUndo not found: .e-pv-organize-anchor-node",
            );
          }
          expect(pgCntAfterUndo).toEqual(pdfviewer_undoredo.pageCount);
          // Click Redo
          const redo = document.querySelector(
            "#pdfviewer_undoredo_redo_organize_Pages",
          ) as HTMLElement | null;
          if (!redo) {
            throw new Error(
              "redo button not found: #pdfviewer_undoredo_redo_organize_Pages",
            );
          }
          mouseClickEvent(redo);
          // Check Page Count after redo
          const pgCntAfterRedo = document.querySelectorAll(
            ".e-pv-organize-anchor-node",
          ).length;
          if (!pgCntAfterRedo) {
            throw new Error(
              "pgCntAfterRedo not found: .e-pv-organize-anchor-node",
            );
          }
          expect(pgCntAfterRedo).toEqual(pdfviewer_undoredo.pageCount + 1);
          pdfviewer_undoredo.extractTextCompleted = null;
          done();
        };
      } catch (e) {
        done.fail(e as Error);
      }
    });
});
import { createElement } from "@syncfusion/ej2-base";
import {
    PdfViewer, Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
    TextSelection, TextSearch, Print, Annotation, FormFields, AnnotationDataFormat, FormDesigner, PageOrganizer
} from "../../../../src/index";
// import { mouseDownEvent, mouseMoveEvent, mouseUpEvent } from "../../utils.spec";
import { EMPTY_PDF_B64 } from "../../Data/pdf-data.spec";
import { mouseMoveEvent, mouseDownEvent, mouseUpEvent, mouseClickEvent, waitFor, rightClickEvent} from "../../utils.spec";


describe('PDF_Viewer_CustomToolbar', () => {
    let pdfviewer_customToolbar: PdfViewer = null;
    PdfViewer.Inject(Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
        TextSelection, TextSearch, Print, Annotation, FormFields, FormDesigner, PageOrganizer);

    beforeAll((done) => {
        const element: HTMLElement = createElement('div', { id: 'pdfviewer_customToolbar' });
        document.body.appendChild(element);
        pdfviewer_customToolbar = new PdfViewer({
            resourceUrl: window.location.origin + '/base/src/pdfviewer/ej2-pdfviewer-lib',
            documentPath: "data:application/pdf;base64," + EMPTY_PDF_B64
        });
        pdfviewer_customToolbar.documentLoad = () => {
            done();
        }
        pdfviewer_customToolbar.appendTo("#pdfviewer_customToolbar");
    });

    afterAll(() => {
        if (pdfviewer_customToolbar) {
            pdfviewer_customToolbar.destroy();
            const el = document.getElementById('pdfviewer_customToolbar');
            if (el && el.parentNode) { el.parentNode.removeChild(el); }
            pdfviewer_customToolbar = null;
        }
    });

    afterEach(() => {
    });
    it("1013457-Copy, cut & paste are working in the toolbar sample.", async (done: DoneFn) => {
      try {
        const target = document.querySelector(
          "#pdfviewer_customToolbar_textLayer_0",
        ) as HTMLElement | null;
        if (!target) {
          throw new Error("target not found");
        }
        const rect = target.getBoundingClientRect();
        // Create a temporary button
        const btn = document.createElement("button");
        btn.id = "test-view-button_0";
        btn.textContent = "View";
        document.body.appendChild(btn);
        btn.addEventListener("click", async () => {
          // Root wrapper
          const box = document.createElement("div");
          box.id = "textSearchBox";
          box.style.left = "60%";
          // Search bar container
          const bar = document.createElement("div");
          bar.id = "pdfViewer_search_box";
          // Input group
          const spanGroup = document.createElement("span");
          spanGroup.className = "e-input-group e-custom-search-input";
          const input = document.createElement("input");
          input.type = "text";
          input.id = "searchInput";
          input.placeholder = "Find in document";
          input.className = "e-input";
          const icon = document.createElement("span");
          icon.className = "e-input-group-icon e-pv-search-icon";
          icon.id = "searchBtn";
          // Nav buttons
          const prevBtn = document.createElement("button");
          prevBtn.id = "previousSearch";
          prevBtn.className = "search-button";
          prevBtn.style.marginLeft = "5px";
          const nextBtn = document.createElement("button");
          nextBtn.id = "nextSearch";
          nextBtn.className = "search-button";
          // Match case container
          const matchContainer = document.createElement("div");
          matchContainer.id = "matchCaseContainer";
          matchContainer.style.marginTop = "8px";
          const matchCase = document.createElement("input");
          matchCase.id = "matchCase";
          matchCase.type = "checkbox";
          // Wire up tree
          spanGroup.appendChild(input);
          spanGroup.appendChild(icon);
          bar.appendChild(spanGroup);
          bar.appendChild(prevBtn);
          bar.appendChild(nextBtn);
          matchContainer.appendChild(matchCase);
          box.appendChild(bar);
          box.appendChild(matchContainer);
          const viewerElement =
            document.querySelector("#pdfviewer_customToolbar") ||
            (document.querySelector(
              "#pdfViewer_customToolbar",
            ) as HTMLElement | null);
          await waitFor(() => {
            const el =
              document.querySelector("#pdfviewer_customToolbar") ||
              document.querySelector("#pdfViewer_customToolbar");
            return !!el;
          });
          if (viewerElement && viewerElement.parentElement) {
            viewerElement.parentElement.insertBefore(box, viewerElement);
          }
        });
        // Trigger the click handler
        btn.click();
        pdfviewer_customToolbar.annotation.setAnnotationMode("Rectangle");
        const sx = Math.round(rect.left + 260);
        const sy = Math.round(rect.top + 80);
        const ex = Math.round(rect.left + 360);
        const ey = Math.round(rect.top + 140);
        mouseMoveEvent(target, sx, sy);
        mouseDownEvent(target, sx, sy);
        // interpolate a few moves to mimic drag
        const steps = 10;
        for (let i = 1; i <= steps; i++) {
          const t = i / steps;
          const x = Math.round(sx + (ex - sx) * t);
          const y = Math.round(sy + (ey - sy) * t);
          mouseMoveEvent(target, x, y);
        }
        mouseUpEvent(target, ex, ey);
        await waitFor(
          () =>
            pdfviewer_customToolbar.annotationCollection &&
            pdfviewer_customToolbar.annotationCollection.length > 0,
        );
        rightClickEvent(target, sx + 20, sy + 20);
        await waitFor(
          () =>
            (
              document.querySelector(
                "#pdfviewer_customToolbar_context_menu",
              ) as HTMLElement
            ).style.display === "block",
        );
        const copyBtn = document.querySelector(
          "#pdfviewer_customToolbar_contextmenu_copy",
        ) as HTMLElement | null;
        mouseClickEvent(copyBtn);
        rightClickEvent(target, sx + 100, sy + 100);
        await waitFor(
          () =>
            (
              document.querySelector(
                "#pdfviewer_customToolbar_context_menu",
              ) as HTMLElement
            ).style.display === "block",
        );
        // set stored coords used by the paste fallback
        pdfviewer_customToolbar.viewerBase.mouseLeft = sx + 150;
        pdfviewer_customToolbar.viewerBase.mouseTop = sy + 100;
        const pasteBtn = document.querySelector(
          "#pdfviewer_customToolbar_contextmenu_paste",
        ) as HTMLElement | null;
        mouseClickEvent(pasteBtn);
        expect(pdfviewer_customToolbar.annotationCollection.length).toBe(2);
        // Remove all temporary buttons created for this test
        if (btn.parentNode) {
          btn.parentNode.removeChild(btn);
        }
        done();
      } catch (e) {
        done.fail(e as any);
      }
    });
});
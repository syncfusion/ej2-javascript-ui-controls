import { createElement } from "@syncfusion/ej2-base";
import {
    PdfViewer, Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
    TextSelection, TextSearch, Print, Annotation, FormFields, AnnotationDataFormat, FormDesigner, PageOrganizer
} from "../../../../src/index";
import { mouseDownEvent, mouseMoveEvent, mouseUpEvent, waitFor } from "../../utils.spec";
import { EMPTY_PDF_B64 } from "../../Data/pdf-data.spec";


describe('PDF_Viewer_ReplyComments', () => {
    let pdfviewer_replyComments: PdfViewer = null;
    PdfViewer.Inject(Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
        TextSelection, TextSearch, Print, Annotation, FormFields, FormDesigner, PageOrganizer);

    beforeAll((done) => {
        // Create host element and mount viewer with an empty (base64) PDF
        const element: HTMLElement = createElement('div', { id: 'pdfviewer_replyComments' });
        document.body.appendChild(element);
        pdfviewer_replyComments = new PdfViewer({
            resourceUrl: window.location.origin + '/base/src/pdfviewer/ej2-pdfviewer-lib',
            documentPath: "data:application/pdf;base64," + EMPTY_PDF_B64
        });
        // Wait for initial document load before starting tests
        pdfviewer_replyComments.documentLoad = () => {
            done();
        }
        // Attach viewer to DOM
        pdfviewer_replyComments.appendTo("#pdfviewer_replyComments");
    });

    afterAll(() => {
        // Clean up viewer instance and DOM to prevent test bleed-over
        if (pdfviewer_replyComments) {
            pdfviewer_replyComments.destroy();
            const el = document.getElementById('pdfviewer_replyComments');
            if (el && el.parentNode) { el.parentNode.removeChild(el); }
            pdfviewer_replyComments = null;
        }
    });

    afterEach(() => {
        // No per-test teardown required
    });


    /**
     * Task ID: 1011169
     * Title: 1011169 - Sticky Note: programmatic main comment + 2 replies → lock → nameTable validates
     * Creates a Sticky Note, adds one main comment and two replies via API, locks the annotation and comments,
     * then validates the corresponding entry in viewer.nameTable using object-key scan.
     */
    it('1011169 - Sticky Note: programmatic main comment + 2 replies → lock → nameTable validates', async function (done) {
        try {
            let annotName: string | null = null;

            // 1) Enable Sticky Notes annotation mode
            pdfviewer_replyComments.annotation.setAnnotationMode('StickyNotes');

            // 2) Create a Sticky Note using mouse events at a fixed offset on page 0
            const target: HTMLElement =
                (document.querySelector('#pdfviewer_replyComments_textLayer_0') as HTMLElement) ||
                (document.getElementById('pdfviewer_replyComments') as HTMLElement);

            const rect = target.getBoundingClientRect();
            const x = Math.round(rect.left + 140);
            const y = Math.round(rect.top + 140);

            mouseDownEvent(target, x, y);
            mouseUpEvent(target, x, y);
            // Wait until an annotation exists and the comment UI is present
            await waitFor(() => pdfviewer_replyComments.annotationCollection && pdfviewer_replyComments.annotationCollection.length > 0);
            await waitFor(() => !!document.querySelector('#pdfviewer_replyComments_commentdiv_1_0'));

            // Create a temporary button to trigger programmatic main comment add
            const btn = document.createElement('button');
            btn.id = 'test-view-button_0';
            btn.textContent = 'View';
            document.body.appendChild(btn);
            btn.addEventListener('click', () => {
                // 3) Grab the newly created annotation and add main comment via API
                const annot = pdfviewer_replyComments.annotationCollection[pdfviewer_replyComments.annotationCollection.length - 1];
                annotName = annot.annotationId;
                if (annot) {
                    annot.commentType = 'add';
                    annot.note = 'API Main Comment';
                    pdfviewer_replyComments.annotation.editAnnotation(annot);
                    console.log(pdfviewer_replyComments.annotationCollection[0]);
                }

            });
            // Trigger the click handler to perform the main comment add
            btn.click();

            // Add first reply via a temporary button click (API-driven)
            const replyBtn = document.createElement('button');
            replyBtn.id = 'test-view-button_1';
            replyBtn.textContent = 'View';
            document.body.appendChild(replyBtn);
            replyBtn.addEventListener('click', () => {
                const annot = pdfviewer_replyComments.annotationCollection[pdfviewer_replyComments.annotationCollection.length - 1];
                // 5) Add first reply programmatically
                annot.commentType = 'add';
                annot.replyComment = ['API Reply 1'];
                pdfviewer_replyComments.annotation.editAnnotation(annot);
            });
            replyBtn.click();

            // Add second reply via a temporary button click (API-driven)
            const replyBtn2 = document.createElement('button');
            replyBtn2.id = 'test-view-button_2';
            replyBtn2.textContent = 'View';
            document.body.appendChild(replyBtn2);
            replyBtn2.addEventListener('click', () => {
                const annot = pdfviewer_replyComments.annotationCollection[pdfviewer_replyComments.annotationCollection.length - 1];
                // 6) Add second reply programmatically
                annot.commentType = 'add';
                annot.replyComment = ['API Reply 2'];
                pdfviewer_replyComments.annotation.editAnnotation(annot);
            });
            replyBtn2.click();

            // Add third reply via a temporary button click (API-driven)
            const replyBtn3 = document.createElement('button');
            replyBtn3.id = 'test-view-button_3';
            replyBtn3.textContent = 'View';
            document.body.appendChild(replyBtn3);
            replyBtn3.addEventListener('click', () => {
                const annot = pdfviewer_replyComments.annotationCollection[pdfviewer_replyComments.annotationCollection.length - 1];
                // 7) Add third reply programmatically
                annot.commentType = 'add';
                annot.replyComment = ['API Reply 3'];
                pdfviewer_replyComments.annotation.editAnnotation(annot);
            });
            replyBtn3.click();

            // Prepare to lock the annotation and its comments
            const annotCollection = pdfviewer_replyComments.annotationCollection[pdfviewer_replyComments.annotationCollection.length - 1];
            const settingBtn = document.createElement('button');
            settingBtn.id = 'test-view-button_4';
            settingBtn.textContent = 'View';
            document.body.appendChild(settingBtn);
            settingBtn.addEventListener('click', () => {
                // 8) Lock annotation and all comments/replies
                annotCollection.annotationSettings = annotCollection.annotationSettings || {};
                annotCollection.annotationSettings.isLock = true;
                (annotCollection as any).isCommentLock = true;
                pdfviewer_replyComments.annotation.editAnnotation(annotCollection);
            });
            // Trigger lock operation
            settingBtn.click();


            // Helper function to scan viewer.nameTable for the current annotation by its annotName
            const getAnnotationFromNameTable = (annotationName: string): any => {
                if (!annotationName) return null;
                const table: any = (pdfviewer_replyComments as any).nameTable;
                if (!table) return null;

                const keys: string[] = Object.keys(table);
                for (let i: number = 0; i < keys.length; i++) {
                    const obj: any = table[keys[parseInt(i.toString(), 10)]];
                    if (obj && obj.annotName === annotationName) {
                        return obj;
                    }
                }
                return null;
            };

            // Validate that nameTable contains an entry for this annotation with at least 3 comments
            const nameEntry = getAnnotationFromNameTable(annotName);
            expect(nameEntry).toBeTruthy();
            expect(nameEntry.annotName).toBe(annotName);
            expect(Array.isArray(nameEntry.comments)).toBe(true);
            expect(nameEntry.comments.length).toBeGreaterThanOrEqual(3);

            // Remove all temporary buttons created for this test
            if (btn.parentNode) {
                btn.parentNode.removeChild(btn);
            }
            if (replyBtn.parentNode) {
                replyBtn.parentNode.removeChild(replyBtn);
            }
            if (replyBtn2.parentNode) {
                replyBtn2.parentNode.removeChild(replyBtn2);
            }
            if (replyBtn3.parentNode) {
                replyBtn3.parentNode.removeChild(replyBtn3);
            }
            if (settingBtn.parentNode) {
                settingBtn.parentNode.removeChild(settingBtn);
            }

            // Signal test completion
            done();
        } catch (err) {
            // Surface any unexpected error to Jasmine
            fail(err as any);
            done();
        }
    });


});
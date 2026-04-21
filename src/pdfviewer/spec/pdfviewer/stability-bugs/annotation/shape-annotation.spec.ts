import { createElement } from "@syncfusion/ej2-base";
import {
	PdfViewer, Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
	TextSelection, TextSearch, Print, Annotation, FormFields, FormDesigner, PageOrganizer
} from "../../../../src/index";
import { dblClickEvent, getTarget, mouseDownEvent, mouseMoveEvent, mouseUpEvent, waitFor } from "../../utils.spec";
import { EMPTY_PDF_B64 } from "../../Data/pdf-data.spec";

describe('PDF_Viewer_Shapes_Opacity_Zero', () => {
	let pdfviewer_shape: PdfViewer = null;

	PdfViewer.Inject(
		Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
		TextSelection, TextSearch, Print, Annotation, FormFields, FormDesigner, PageOrganizer
	);

	beforeAll((done) => {
		const element: HTMLElement = createElement('div', { id: 'pdfviewer_shape' });
		document.body.appendChild(element);
		pdfviewer_shape = new PdfViewer({
			resourceUrl: window.location.origin + '/base/src/pdfviewer/ej2-pdfviewer-lib',
			documentPath: "data:application/pdf;base64," + EMPTY_PDF_B64
		});
		pdfviewer_shape.documentLoad = () => done();
		pdfviewer_shape.appendTo('#pdfviewer_shape');
	});

	afterAll(() => {
		if (pdfviewer_shape) {
			pdfviewer_shape.destroy();
			const el = document.getElementById('pdfviewer_shape');
			if (el && el.parentNode) { el.parentNode.removeChild(el); }
			pdfviewer_shape = null;
		}
	});

	it('1009739-Line annotation invisible when opacity=0', (done: DoneFn) => {
		try {
			const target = getTarget('#pdfviewer_shape_textLayer_0');
			const rect = target.getBoundingClientRect();
			pdfviewer_shape.lineSettings.opacity = 0;
			pdfviewer_shape.annotation.setAnnotationMode('Line');

			const sx = Math.round(rect.left + 50);
			const sy = Math.round(rect.top + 80);
			const ex = Math.round(rect.left + 200);
			const ey = Math.round(rect.top + 80);
			mouseMoveEvent(target, sx, sy);
			mouseDownEvent(target, sx, sy);
			mouseMoveEvent(target, ex, ey);
			mouseUpEvent(target, ex, ey);
			waitFor(() => pdfviewer_shape.annotationCollection && pdfviewer_shape.annotationCollection.length > 0);
			const annottaions = pdfviewer_shape.annotationCollection[pdfviewer_shape.annotationCollection.length - 1] as any;
			expect(annottaions).toBeDefined();
			expect(annottaions.opacity).toBe(0);
			done();
		} catch (e) {
			done.fail(e as Error);
		}
	});

	it('1009739-Arrow annotation invisible when opacity=0', (done: DoneFn) => {
		try {
			const target = getTarget('#pdfviewer_shape_textLayer_0');
			const rect = target.getBoundingClientRect();
			pdfviewer_shape.arrowSettings.opacity = 0;
			pdfviewer_shape.annotation.setAnnotationMode('Arrow');

			const sx = Math.round(rect.left + 60);
			const sy = Math.round(rect.top + 140);
			const ex = Math.round(rect.left + 220);
			const ey = Math.round(rect.top + 140);

			mouseMoveEvent(target, sx, sy);
			mouseDownEvent(target, sx, sy);
			mouseMoveEvent(target, ex, ey);
			mouseUpEvent(target, ex, ey);
			waitFor(() => pdfviewer_shape.annotationCollection && pdfviewer_shape.annotationCollection.length > 0)
			const annottaions = pdfviewer_shape.annotationCollection[pdfviewer_shape.annotationCollection.length - 1] as any;
			expect(annottaions).toBeDefined();
			expect(annottaions.opacity).toBe(0);
			done();
		} catch (e) {
			done.fail(e as Error);
		}
	});

	it('1009739-Rectangle annotation invisible when opacity=0', (done: DoneFn) => {
		try {
			const target = getTarget('#pdfviewer_shape_textLayer_0');
			const rect = target.getBoundingClientRect();
			pdfviewer_shape.rectangleSettings.opacity = 0;
			pdfviewer_shape.annotation.setAnnotationMode('Rectangle');

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
			waitFor(() => pdfviewer_shape.annotationCollection && pdfviewer_shape.annotationCollection.length > 0)
			const annottaions = pdfviewer_shape.annotationCollection[pdfviewer_shape.annotationCollection.length - 1] as any;
			expect(annottaions).toBeDefined();
			expect(annottaions.opacity).toBe(0);
			done();
		} catch (e) {
			done.fail(e as Error);
		}
	});

	it('1009739-Circle annotation invisible when opacity=0', (done: DoneFn) => {
		try {
			const target = getTarget('#pdfviewer_shape_textLayer_0');
			const rect = target.getBoundingClientRect();
			pdfviewer_shape.circleSettings.opacity = 0;
			pdfviewer_shape.annotation.setAnnotationMode('Circle');

			const sx = Math.round(rect.left + 260);
			const sy = Math.round(rect.top + 200);
			const ex = Math.round(rect.left + 340);
			const ey = Math.round(rect.top + 260);

			mouseMoveEvent(target, sx, sy);
			mouseDownEvent(target, sx, sy);
			const steps = 10;
			for (let i = 1; i <= steps; i++) {
				const t = i / steps;
				const x = Math.round(sx + (ex - sx) * t);
				const y = Math.round(sy + (ey - sy) * t);
				mouseMoveEvent(target, x, y);
			}
			mouseUpEvent(target, ex, ey);
			waitFor(() => pdfviewer_shape.annotationCollection && pdfviewer_shape.annotationCollection.length > 0)
			const annottaions = pdfviewer_shape.annotationCollection[pdfviewer_shape.annotationCollection.length - 1] as any;
			expect(annottaions).toBeDefined();
			expect(annottaions.opacity).toBe(0);
			done();
		} catch (e) {
			done.fail(e as Error);
		}
	});

	it('1009739-Polygon annotation invisible when opacity=0', (done: DoneFn) => {
		try {
			const target = getTarget('#pdfviewer_shape_textLayer_0');
			const rect = target.getBoundingClientRect();
			pdfviewer_shape.polygonSettings.opacity = 0;
			pdfviewer_shape.annotation.setAnnotationMode('Polygon');

			// Pentagon points (approximate)
			const aX = Math.round(rect.left + 125); // top center
			const aY = Math.round(rect.top + 40);

			const bX = Math.round(rect.left + 200); // upper right
			const bY = Math.round(rect.top + 90);

			const cX = Math.round(rect.left + 170); // lower right
			const cY = Math.round(rect.top + 160);

			const dX = Math.round(rect.left + 80);  // lower left
			const dY = Math.round(rect.top + 160);

			const eX = Math.round(rect.left + 50);  // upper left
			const eY = Math.round(rect.top + 90);

			// Draw AB
			mouseMoveEvent(target, aX, aY);
			mouseDownEvent(target, aX, aY);
			mouseMoveEvent(target, bX, bY);
			mouseUpEvent(target, bX, bY);

			// Draw BC
			mouseMoveEvent(target, bX, bY);
			mouseDownEvent(target, bX, bY);
			mouseMoveEvent(target, cX, cY);
			mouseUpEvent(target, cX, cY);

			// Draw CD
			mouseMoveEvent(target, cX, cY);
			mouseDownEvent(target, cX, cY);
			mouseMoveEvent(target, dX, dY);
			mouseUpEvent(target, dX, dY);

			// Draw DE
			mouseMoveEvent(target, dX, dY);
			mouseDownEvent(target, dX, dY);
			mouseMoveEvent(target, eX, eY);
			mouseUpEvent(target, eX, eY);

			// Draw EA (closing polygon)
			mouseMoveEvent(target, eX, eY);
			mouseDownEvent(target, eX, eY);
			mouseMoveEvent(target, aX, aY);
			mouseUpEvent(target, aX, aY);

			waitFor(() => pdfviewer_shape.annotationCollection && pdfviewer_shape.annotationCollection.length > 0)
			const annottaions = pdfviewer_shape.annotationCollection[pdfviewer_shape.annotationCollection.length - 1] as any;
			expect(annottaions).toBeDefined();
			expect(annottaions.opacity).toBe(0);
			done();
		} catch (e) {
			// Some environments may differ in polygon completion; still assert collection consistency on failure context
			done.fail(e as Error);
		}
	});
});


/**
 * Shared utility functions for PDF Viewer tests
 */
import { AnnotationDataFormat } from '../../src/index';

/**
 * Opens annotation toolbar by clicking the annotation button
 * @param viewerId - The ID of the PDF viewer element (default: 'pdfviewer')
 */
export function openAnnotationToolbar(viewerId: string = 'pdfviewer'): void {
    const annotationBtn = document.querySelector(`#${viewerId}_annotation`) as HTMLElement;
    expect(annotationBtn).not.toBeNull();
    annotationBtn.click();
}

/**
 * Verifies button exists, has correct ID, and clicks it
 * @param selector - CSS selector for the button
 * @param expectedId - Expected ID of the button
 */
export function verifyAndClickButton(selector: string, expectedId: string): void {
    const button = document.querySelector(selector) as HTMLButtonElement;
    expect(button).not.toBeNull();
    expect(button.id).toBe(expectedId);
    button.click();
}

/**
 * Closes annotation toolbar if open
 * @param viewerId - The ID of the PDF viewer element (default: 'pdfviewer')
 */
export function closeAnnotationToolbar(viewerId: string = 'pdfviewer'): void {
    const annotationToolbar = document.querySelector(`#${viewerId}_annotationContainer`);
    if (annotationToolbar) {
        const annotationBtn = document.querySelector(`#${viewerId}_annotation`) as HTMLElement;
        if (annotationBtn && annotationBtn.classList.contains('e-active')) {
            annotationBtn.click();
        }
    }
}
export function mouseDownEvent(element: any, cx: number, cy: number, ctrl?: any, shift?: any) {
    let mousedown = document.createEvent('MouseEvent');
    mousedown.initMouseEvent('mousedown', true, false, window, 1, 0, 0, cx, cy, ctrl, false, shift, false, 1, element);
    element.dispatchEvent(mousedown);
}

export function mouseMoveEvent(element: any, cx: number, cy: number, ctrl?: any, shift?: any) {
    let mousemove = document.createEvent('MouseEvent');
    mousemove.initMouseEvent('mousemove', true, false, window, 1, 0, 0, cx, cy, ctrl, false, shift, false, 1, element);
    element.dispatchEvent(mousemove);
}

export function mouseUpEvent(element: any, cx: number, cy: number, ctrl?: any, shift?: any) {
    let mouseup = document.createEvent('MouseEvent');
    mouseup.initMouseEvent('mouseup', true, false, window, 1, 0, 0, cx, cy, ctrl, false, shift, false, 1, element);
    element.dispatchEvent(mouseup);
}

export function mouseClickEvent(element: HTMLElement) {
    element.click();
}

export function mouseOverEvent(element: HTMLElement, ctrl = false, shift = false) {
    const rect = element.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const ev = document.createEvent('MouseEvent');
    ev.initMouseEvent(
        'mouseover',
        true,   // bubbles
        true,   // cancelable
        window,
        0,
        0, 0,   // screenX, screenY (optional)
        cx, cy, // clientX, clientY
        ctrl,
        false,  // altKey
        shift,
        false,  // metaKey
        0,      // button
        null    // relatedTarget
    );
    element.dispatchEvent(ev);
}

export function dblClickEvent(target: HTMLElement, cx: number, cy: number) {
    const dbl = new MouseEvent('dblclick', { bubbles: true, cancelable: true, clientX: cx, clientY: cy });
    target.dispatchEvent(dbl);
}

export function getTarget(id:string): HTMLElement {
    const target = document.querySelector(id) as HTMLElement
        || (document.getElementById('pdfviewer') as HTMLElement);
    if (!target) {
        throw new Error('Target layer not found for mouse events.');
    }
    return target;
}
export function focusOn(target: HTMLElement) {
    target.focus();
}

export function sleep(ms: any) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function waitFor(check: () => boolean): any {
    return new Promise((resolve) => {
        function poll() {
            try {
                const result = check();
                if (result) {
                    resolve(result);
                    return;
                }
            } catch (e) {
                // ignore errors from check() and keep polling
            }
            requestAnimationFrame(poll);
        }
        poll();
    });
}
export function Keydown(
    target: Element | Document | Window | null | undefined,
    key: string,
    code: string,
    mods?: Partial<Pick<KeyboardEventInit, 'ctrlKey' | 'metaKey' | 'altKey' | 'shiftKey'>>
): boolean {
    const t = (target || document.body) as Element | Document | Window;
    const m = mods || {};
    const evt = new KeyboardEvent('keydown', {
        key,
        code,
        ctrlKey: !!m.ctrlKey,
        metaKey: !!m.metaKey,
        altKey: !!m.altKey,
        shiftKey: !!m.shiftKey,
        bubbles: true,
        cancelable: true
    });
    return t.dispatchEvent(evt);
}

export function rightClickEvent(element: HTMLElement, cx: number, cy: number): void {
    const contextmenu = new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        clientX: cx,
        clientY: cy,
        button: 2,
        buttons: 2
    });
    element.dispatchEvent(contextmenu);
}

// Helper to export all annotations as an object from the viewer
export async function exportAnnotationsHelper(viewer: any): Promise<any> {
    return await viewer.exportAnnotationsAsObject();
}


// Helper to import annotations using JSON format
export function importAnnotationsHelper(viewer: any, exportedData: any): void {
    viewer.importAnnotation(exportedData, AnnotationDataFormat.Json);
}

// Helper to remove all annotations from the viewer
export function deleteAllAnnotationsHelper(viewer: any): void {
    while (viewer.annotationCollection && viewer.annotationCollection.length > 0) {
        viewer.annotation.selectAnnotation(viewer.annotationCollection[0].annotationId);
        viewer.annotation.deleteAnnotation();
    }
}

// Helper utility to draw a closed triangle using three connected line segments
export function threePointCalibrate() {
    const target = getTarget('#pdfviewer_lineType_textLayer_0');
    const rect = target.getBoundingClientRect();
    const aX = Math.round(rect.left + 100);
    const aY = Math.round(rect.top + 50);

    const bX = Math.round(rect.left + 200);
    const bY = Math.round(rect.top + 150);

    const cX = Math.round(rect.left + 50);
    const cY = Math.round(rect.top + 150);

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

    // Draw CA (closing triangle)
    mouseMoveEvent(target, cX, cY);
    mouseDownEvent(target, cX, cY);
    mouseMoveEvent(target, aX, aY);
    mouseUpEvent(target, aX, aY);
}

// Helper assertion to ensure geometry has changed after an operation
export function assertGeometryChanged(initial: any, updated: any, propertyName: string): void {
    const normalizedInitial = normalizeForComparison(initial);
    const normalizedUpdated = normalizeForComparison(updated);
    expect(JSON.stringify(normalizedInitial)).not.toBe(
        JSON.stringify(normalizedUpdated),
        `${propertyName} should change after resize`
    );
}

// Helper assertion to ensure geometry matches expected values
export function assertGeometryMatches(expected: any, actual: any, propertyName: string): void {
    const normalizedExpected = normalizeForComparison(expected);
    const normalizedActual = normalizeForComparison(actual);
    expect(JSON.stringify(normalizedExpected)).toBe(
        JSON.stringify(normalizedActual),
        `${propertyName} should match`
    );
}

// Helper to normalize geometry values for stable comparison
// - Rounds numbers to 2 decimal places
// - Recursively processes arrays and objects
// - Removes undefined properties
function normalizeForComparison(obj: any): any {
    if (typeof obj === 'number') {
        return Math.round(obj * 100) / 100;
    }
    if (Array.isArray(obj)) {
        return obj.map(normalizeForComparison);
    }
    if (typeof obj === 'object' && obj !== null) {
        const result: any = {};
        for (const key in obj) {
            if (obj[key] !== undefined) {
                result[key] = normalizeForComparison(obj[key]);
            }
        }
        return result;
    }
    return obj;
}

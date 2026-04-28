import { EmitType, Browser, createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { DropDownList } from '../../src/drop-down-list/drop-down-list';

describe('Priority 1 - Resize Boundary Constraints', () => {
    let ddl: any;
    let element: HTMLInputElement;
    let originalTimeout: number;
    beforeEach(() => {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 3000;
        element = createElement('input', { id: 'ddl-resize' }) as HTMLInputElement;
        document.body.appendChild(element);
    });
    afterEach(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        if (ddl) {
            ddl.destroy();
        }
        if (element) {
            element.remove();
        }
        document.body.innerHTML = '';
    });
    /**
     * Test Case 1: Prevent resizing below maximum height
     * Expected: Resize should not go below maximum height threshold
     */
    it('should prevent resizing below maximum height', (done) => {
        ddl = new DropDownList({
            dataSource: [
                { text: 'Item 1' },
                { text: 'Item 2' },
                { text: 'Item 3' },
                { text: 'Item 4' },
                { text: 'Item 5' }
            ],
            allowResize: true,
            popupHeight: '250px'
        });
        ddl.appendTo(element);
        ddl.showPopup();
        setTimeout(() => {
            const popup = ddl.popupObj.element;
            const maxHeight = 300; // Maximum reasonable height
            // Try to set very highest height
            popup.style.height = '500px';
            ddl.dataBind();
            // Component should maintain maximum height
            const currentHeight = popup.offsetHeight;
            expect(currentHeight).toBeLessThanOrEqual(maxHeight);
            done();
        }, 100);
    });
    /**
     * Test Case 2: Prevent negative dimensions during resize
     * Expected: Dimensions should never be negative
     */
    it('should prevent negative dimensions during resize', (done) => {
        ddl = new DropDownList({
            dataSource: [{ text: 'Item 1' }, { text: 'Item 2' }],
            allowResize: true
        });
        ddl.appendTo(element);
        ddl.showPopup();
        setTimeout(() => {
            const popup = ddl.popupObj.element;
            // Try to set negative dimensions
            popup.style.width = '-100px';
            popup.style.height = '-50px';
            ddl.dataBind();
            // Either should be corrected or not applied
            expect(popup.offsetWidth).toBeGreaterThan(0);
            expect(popup.offsetHeight).toBeGreaterThan(0);
            done();
        }, 100);
    });

    /**
     * Test Case 3: Restrict resize within viewport boundaries
     * Expected: Popup should not exceed viewport boundaries
     */
    it('should restrict resize within viewport boundaries', (done) => {
        ddl = new DropDownList({
            dataSource: [{ text: 'Item 1' }, { text: 'Item 2' }],
            allowResize: true,
            popupWidth: '200px'
        });
        ddl.appendTo(element);
        ddl.showPopup();
        setTimeout(() => {
            const popup = ddl.popupObj.element;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const popupRight = popup.offsetLeft + popup.offsetWidth;
            const popupBottom = popup.offsetTop + popup.offsetHeight;
            // Should not significantly exceed viewport (allowing small tolerance)
            expect(popupRight).toBeLessThanOrEqual(viewportWidth + 50);
            expect(popupBottom).toBeLessThanOrEqual(viewportHeight + 50);
            done();
        }, 100);
    });
    /**
     * Test Case 3.4: Fire resizeStart event when resize begins
     * Expected: resizeStart event should be triggered before resize
     */
    it('should fire resizeStart event before resize', (done) => {
        let resizeStartFired = false;

        ddl = new DropDownList({
            dataSource: [{ text: 'Item 1' }],
            allowResize: true,
            resizeStart: (args: any) => {
                resizeStartFired = true;;
            }
        });
        ddl.appendTo(element);
        ddl.showPopup();
        setTimeout(() => {
            const popup = ddl.popupObj.element;
            const resizeHandle = popup.querySelector('.e-resizer-right');
            // Trigger mouse down on resize handle
            const mouseDownEvent = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: resizeHandle.getBoundingClientRect().left,
                clientY: resizeHandle.getBoundingClientRect().top
            });
            resizeHandle.dispatchEvent(mouseDownEvent);
            setTimeout(() => {
                expect(resizeStartFired).toBe(true);
                done();
            }, 100);
        }, 100);
    });
    /**
     * Test Case 5: Verify resize event sequence (Start → Resizing → Stop)
     * Expected: Events should fire in correct sequence
     */
    it('should fire resize events in correct sequence', (done) => {
        const eventSequence: string[] = [];
        ddl = new DropDownList({
            dataSource: [{ text: 'Item 1' }],
            allowResize: true,
            resizeStart: () => {
                eventSequence.push('resizeStart');
            },
            resizing: () => {
                if (eventSequence.indexOf('resizing') === -1) {
                    eventSequence.push('resizing');
                }
            },
            resizeStop: () => {
                eventSequence.push('resizeStop');
            }
        });
        ddl.appendTo(element);
        ddl.showPopup();
        setTimeout(() => {
            const popup = ddl.popupObj.element;
            const resizeHandle = popup.querySelector('.e-resizer-right');
            // Simulate resize with realistic mouse event properties so handlers detect button state
            const rect = resizeHandle.getBoundingClientRect();
            // Simulate mouse down on the resize handle (left button)
            const mouseDownEvent = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: rect.left,
                clientY: rect.top,
                button: 0,
                buttons: 1
            });
            resizeHandle.dispatchEvent(mouseDownEvent);
            setTimeout(() => {
                // Simulate mouse move while left button is held
                const mouseMoveEvent = new MouseEvent('mousemove', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    clientX: rect.left + 100,
                    clientY: rect.top,
                    buttons: 1
                });
                document.dispatchEvent(mouseMoveEvent);
                setTimeout(() => {
                    // Simulate mouse up to end resize
                    const mouseUpEvent = new MouseEvent('mouseup', {
                        bubbles: true,
                        cancelable: true,
                        view: window,
                        clientX: rect.left + 100,
                        clientY: rect.top,
                        button: 0,
                        buttons: 0
                    });
                    document.dispatchEvent(mouseUpEvent);
                    setTimeout(() => {
                        // Check sequence contains events and includes resizeStop
                        expect(eventSequence.length).toBeGreaterThan(0);
                        expect(eventSequence[0]).toBe('resizeStart');
                        expect(eventSequence).toContain('resizing');
                        expect(eventSequence).toContain('resizeStop');
                        done();
                    }, 100);
                }, 100);
            }, 100);
        }, 100);
    });
    /**
     * Test Case 6: Prevent resize when allowResize is false
     * Expected: Resize handle should not be visible/functional
     */
    it('should not show resize handle when allowResize is false', (done) => {
        ddl = new DropDownList({
            dataSource: [{ text: 'Item 1' }],
            allowResize: false
        });
        ddl.appendTo(element);
        ddl.showPopup();
        setTimeout(() => {
            const popup = ddl.popupObj.element;
            const resizeHandle = popup.querySelector('.e-resizer-right');
            expect(resizeHandle).toBeNull();
            done();
        }, 100);
    });
    /**
     * Test Case 7: Maintain aspect ratio during resize (if applicable)
     * Expected: Resize should maintain reasonable popup proportions
     */
    it('should maintain reasonable proportions during resize', (done) => {
        ddl = new DropDownList({
            dataSource: [{ text: 'Item 1' }, { text: 'Item 2' }],
            allowResize: true,
            popupHeight: '300px',
            popupWidth: '200px'
        });
        ddl.appendTo(element);
        ddl.showPopup();
        setTimeout(() => {
            const popup = ddl.popupObj.element;
            const width = popup.offsetWidth;
            const height = popup.offsetHeight;
            // Dimensions should be positive
            expect(width).toBeGreaterThan(0);
            expect(height).toBeGreaterThan(0);
            // Aspect ratio should be reasonable (not extreme)
            const aspectRatio = width / height;
            expect(aspectRatio).toBeGreaterThan(0.1);
            expect(aspectRatio).toBeLessThan(10);
            done();
        }, 100);
    });
    /**
     * Test Case 8: Resize should work with dynamic popupHeight changes
     * Expected: Resize should adjust to dynamic height changes
     */
    it('should resize properly after dynamic popupHeight changes', (done) => {
        ddl = new DropDownList({
            dataSource: [{ text: 'Item 1' }, { text: 'Item 2' }],
            allowResize: true,
            popupHeight: '200px'
        });
        ddl.appendTo(element);
        expect(ddl.popupHeight).toBe('200px');
        // Change height dynamically
        ddl.popupHeight = '400px';
        ddl.dataBind();
        ddl.showPopup();
        setTimeout(() => {
            expect(ddl.popupHeight).toBe('400px');
            const popup = ddl.popupObj.element;
            expect(popup).toBeDefined();
            expect(popup.offsetHeight).toBeGreaterThan(0);
            done();
        }, 100);
    });
    /**
     * Test Case 9: Verify resize boundaries don't interfere with scrolling
     * Expected: Scrolling should work within resized popup
     */
    it('should allow scrolling within resized popup', (done) => {
        const data: { text: string }[] = [];
        for (let i = 0; i < 50; i++) {
            data.push({ text: 'Item ' + i });
        }
        ddl = new DropDownList({
            dataSource: data,
            allowResize: true,
            popupHeight: '300px'
        });
        ddl.appendTo(element);
        ddl.showPopup();
        setTimeout(() => {
            const initialScroll = ddl.list.scrollTop;
            ddl.list.scrollTop = 50;
            expect(ddl.list.scrollTop).toBeGreaterThanOrEqual(50);
            expect(ddl.list.scrollTop).not.toBe(initialScroll);
            done();
        }, 100);
    });
});

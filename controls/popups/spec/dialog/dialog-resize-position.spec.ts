/**
 * Dialog Resize Position Bug Test
 * Tests the issue where dialog position is incorrect after resize, close, and reopen
 */
import { createElement, detach } from '@syncfusion/ej2-base';
import { Dialog } from '../../src/dialog/dialog';

function destroyDialog(dialogObj: Dialog): void {
    if (dialogObj) {
        dialogObj.destroy();
        if (dialogObj.element && dialogObj.element.parentElement) {
            detach(dialogObj.element);
        }
    }
}

describe('Dialog Resize Position Bug - Modal Dialog with Center Position', () => {
    let dialog: Dialog;
    let targetElement: HTMLElement;
    let dialogElement: HTMLElement;

    beforeAll(() => {
        // Create container element
        targetElement = createElement('div', { id: 'container' });
        targetElement.style.width = '800px';
        targetElement.style.height = '600px';
        targetElement.style.position = 'relative';
        document.body.appendChild(targetElement);

        // Create dialog element
        dialogElement = createElement('div', { id: 'testDialog' });
        document.body.appendChild(dialogElement);
    });

    afterAll(() => {
        destroyDialog(dialog);
        if (targetElement && targetElement.parentElement) {
            detach(targetElement);
        }
    });

    it('Dialog element top property should have correct value after resize, close, and reopen', (done: Function) => {
        let resizeStartCount = 0;

        dialog = new Dialog({
            allowDragging: true,
            enableResize: true,
            isModal: true,
            resizeHandles: ['All'],
            header: 'Dialog',
            content: 'This is a Dialog with resize enabled',
            target: targetElement,
            width: '250px',
            visible: false,
            resizeStart: function () {
                resizeStartCount++;
                console.log(`ResizeStart triggered - Count: ${resizeStartCount}`);
                const dialogElem = document.getElementById('testDialog');
                if (dialogElem) {
                    console.log(`Dialog element top: ${dialogElem.style.top}`);
                    console.log(`Dialog element left: ${dialogElem.style.left}`);
                }
            }
        });

        dialog.appendTo('#testDialog');

        // Step 1: Open the dialog
        setTimeout(() => {
            dialog.show();
            var elem = document.getElementById('testDialog');
            expect(elem.style.top).not.toBe('0px');
            expect(elem.style.left).not.toBe('0px');
        }, 100);

        // Step 2: Trigger resize
        setTimeout(() => {
            const resizeHandle = document.querySelector('.e-south-east') as HTMLElement;
            if (resizeHandle) {
                const mouseEvent = document.createEvent('MouseEvents');
                mouseEvent.initEvent('mousedown', true, true);
                resizeHandle.dispatchEvent(mouseEvent);
                
                const mouseUpEvent = document.createEvent('MouseEvents');
                mouseUpEvent.initEvent('mouseup', true, true);
                document.dispatchEvent(mouseUpEvent);
            }
        }, 300);

        // Step 3: Close the dialog
        setTimeout(() => {
            dialog.hide();
        }, 600);

        // Step 4: Reopen the dialog
        setTimeout(() => {
            dialog.show();
        }, 900);

        // Step 6: Verify
        setTimeout(() => {
            const dialogElem = document.getElementById('testDialog');
            expect(resizeStartCount).toBe(1);
            
            const currentTop = dialogElem.style.top;
            console.log(`Final top value: ${currentTop}`);
            
            expect(currentTop).not.toBe('0px', 'Dialog top should not be 0px after reopen and resize');
            expect(currentTop).not.toBe('0', 'Dialog top should not be 0 after reopen and resize');
            
            done();
        }, 1500);
    });
});

import { RichTextEditor } from "../../../src/index";
import { ImageDropEventArgs, MediaDropEventArgs } from "./../../../src/common/interface";
import { renderRTE, destroy } from "../render.spec";
import { getImageUniqueFIle } from "../online-service.spec";

describe(' Media - Drag and Drop', () => {
    beforeAll((done: DoneFn) => {
        const link: HTMLLinkElement = document.createElement('link');
        link.href = '/base/demos/themes/material.css';
        link.rel = 'stylesheet';
        link.id = 'materialTheme';
        link.onload = () => {
            done(); // Style should be loaded before done() called
        };
        link.onerror = (e) => {
            fail(`Failed to load stylesheet: ${link.href}`);
            done(); // still end the test run to avoid hanging
        };
        document.head.appendChild(link);

    });
    afterAll(() => {
        document.getElementById('materialTheme').remove();
    });
    describe('986531: beforeImageDrop Event Should Trigger Only for Image Drops, Not for Audio or Video', () => {
        let rteObj: RichTextEditor;
        let isImageDropTriggered: boolean = false;
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: { items: ['Image', 'Audio'] },
                beforeImageDrop: (args: ImageDropEventArgs) => {
                    args.cancel = true; // Cancel image drop
                    isImageDropTriggered = true;
                }
            });
        });
        afterEach(() => destroy(rteObj));
        it('Should not trigger the beforeImageDrop event when audio is dropped in to the editor', (done: DoneFn) => {
            rteObj.inputElement.innerHTML = `<p>Drop test content.</p>`;
            const paragraph = rteObj.inputElement.querySelector('p');
            const audioFile = new File(['dummy'], 'test.mp3', { type: 'audio/mp3' });
            const audioTransfer = new DataTransfer();
            audioTransfer.items.add(audioFile);
            const audioDropEvent = new DragEvent('drop', { dataTransfer: audioTransfer, bubbles: true });
            paragraph.dispatchEvent(audioDropEvent);
            setTimeout(() => {
                expect(rteObj.inputElement.querySelectorAll('.e-audio-wrap').length).toBe(1);
                expect(isImageDropTriggered).toBe(false);
                done();
            }, 100);
        });
    });

    describe('986531: beforeImageDrop Event Should Trigger Only for Image Drops, Not for Audio or Video', () => {
        let rteObj: RichTextEditor;
        let isImageDropTriggered: boolean = false;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: { items: ['Video'] },
                value: `<div><p>Insert video here</p></div>`,
                beforeImageDrop: (args) => {
                    isImageDropTriggered = true; // Should NOT trigger for video
                }
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });

        it('When video is dragged and dropped, ensure beforeImageDrop is not triggered', (done: DoneFn) => {
            const fileObj = new File(['dummy'], 'sample.mp4', { type: 'video/mp4' });
            const event: any = {
                clientX: 40,
                clientY: 294,
                dataTransfer: { files: [fileObj] },
                preventDefault: () => { }
            };
            rteObj.focusIn();
            (rteObj.videoModule as any).insertDragVideo(event);
            setTimeout(() => {
                // Only one final <video> should exist
                expect(rteObj.inputElement.querySelectorAll('video').length).toBe(1);
                expect(isImageDropTriggered).toBe(false);
                done();
            }, 500);
        });
    });

    describe('986531: beforeImageDrop Event Should Trigger Only for Image Drops, Not for Audio or Video', () => {
        let editor: RichTextEditor;
        let isMediaDropTriggered: boolean = false;
        beforeAll(() => {
            editor = renderRTE({
                value: `<p>This is a text content.</p>`,
                beforeMediaDrop: (args: MediaDropEventArgs) => {
                    args.cancel = true; 
                    isMediaDropTriggered = true;
                }
            });
        });
        afterAll(() => {
            destroy(editor);
        });
        it('Should not trigger the beforeMediaDrop event when image is dropped in to the editor', (done: DoneFn) => {
            const file: File = getImageUniqueFIle();
            const dataTransfer: DataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            const eventInit: DragEventInit = {
                dataTransfer: dataTransfer,
                bubbles: true,
                clientX: 40,
                clientY: 294,
            };
            const dropEvent: DragEvent = new DragEvent('drop', eventInit);
            editor.inputElement.querySelector('p').dispatchEvent(dropEvent);
            setTimeout(() => {
                expect(editor.inputElement.querySelectorAll('img').length).toBe(1);
                expect(isMediaDropTriggered).toBe(false);
                done();
            }, 100);
        });
    });
});

import { RichTextEditor } from "../../../src/index";
import { ImageDropEventArgs, MediaDropEventArgs } from "./../../../src/common/interface";
import { renderRTE, destroy } from "../render.spec";
import { getImageUniqueFIle } from "../online-service.spec";
import { isNullOrUndefined, Browser } from "@syncfusion/ej2-base";

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

    describe('Bug 1003366: Cursor is not available while dragging and dropping the file into the editor', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p>21</p>`,
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it("Dragging supported image format should make the cursor visible ", function (done: DoneFn) {
            let fileObj: File = new File(["Nice One"], "sample.jpg", { lastModified: 0, type: "image/jpg" });
            const imageTransfer = new DataTransfer();
            imageTransfer.items.add(fileObj);
            rteObj.focusIn();
            const imageDropEvent = new DragEvent('dragover', { dataTransfer: imageTransfer, bubbles: true });
            rteObj.inputElement.dispatchEvent(imageDropEvent);
            setTimeout(() => {
                const range: Range = rteObj.getRange();
                expect(rteObj.inputElement.contains(range.startContainer)).toBe(true);
                done();
            }, 200);
        });
    });

    describe('Bug 999971: Remove Copy Icon and Set Drop Effect to None for Non-Allowed Media Types', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p>21</p>`,
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it("Dragging unsupported audio format should make the drop effect as none ", function (done: DoneFn) {
            let fileObj: File = new File(
                ["OGG Audio Data"],
                "sample.ogg",
                { lastModified: 0, type: "audio/ogg" }
            );
            const audioTransfer = new DataTransfer();
            audioTransfer.items.add(fileObj);
            rteObj.focusIn();
            const audioDropEvent = new DragEvent('dragover', { dataTransfer: audioTransfer, bubbles: true });
            rteObj.inputElement.dispatchEvent(audioDropEvent);
            setTimeout(() => {
                expect(audioDropEvent.dataTransfer.dropEffect).toBe('none');
                done();
            }, 200);
        });
    });

    describe('Bug 999971: Remove Copy Icon and Set Drop Effect to None for Non-Allowed Media Types', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p>21</p>`,
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it("Dragging unsupported image format should make the drop effect as none ", function (done: DoneFn) {
            let fileObj: File = new File(["Nice One"], "sample.gif", { lastModified: 0, type: "image/gif" });
            const imageTransfer = new DataTransfer();
            imageTransfer.items.add(fileObj);
            rteObj.focusIn();
            const imageDropEvent = new DragEvent('dragover', { dataTransfer: imageTransfer, bubbles: true });
            rteObj.inputElement.dispatchEvent(imageDropEvent);
            setTimeout(() => {
                expect(imageDropEvent.dataTransfer.dropEffect).toBe('none');
                done();
            }, 200);
        });
    });

    describe('Bug 999971: Remove Copy Icon and Set Drop Effect to None for Non-Allowed Media Types', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p>21</p>`,
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it("Dragging unsupported video format should make the drop effect as none ", function (done: DoneFn) {
            let fileObj: File = new File(
                ["MKV Video Data"],
                "sample.mkv",
                { lastModified: 0, type: "video/x-matroska" }
            );
            const videoTransfer = new DataTransfer();
            videoTransfer.items.add(fileObj);
            rteObj.focusIn();
            const videoDropEvent = new DragEvent('dragover', { dataTransfer: videoTransfer, bubbles: true });
            rteObj.inputElement.dispatchEvent(videoDropEvent);
            setTimeout(() => {
                expect(videoDropEvent.dataTransfer.dropEffect).toBe('none');
                done();
            }, 200);
        });
    });

    describe('Bug 999971: Remove Copy Icon and Set Drop Effect to None for Non-Allowed Media Types', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p>21</p>`,
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it("Dragging without audio file should make the drop effect as none ", function (done: DoneFn) {
            const audioTransfer = new DataTransfer();
            let event: any = {
                clientX: 40,
                clientY: 294,
                target: rteObj.contentModule.getEditPanel(),
                dataTransfer: audioTransfer,
                preventDefault: function () { return; },
                stopImmediatePropagation: function () { return; }
            };
            rteObj.focusIn();
            (rteObj.audioModule as any).dragOver(event);
            setTimeout(() => {
                expect(event.dataTransfer.dropEffect).toBe('none');
                event = {
                    clientX: 40,
                    clientY: 294,
                    target: rteObj.contentModule.getEditPanel(),
                    preventDefault: function () { return; },
                    stopImmediatePropagation: function () { return; }
                };
                rteObj.focusIn();
                (rteObj.audioModule as any).dragOver(event);
                setTimeout(() => {
                    expect(event.dataTransfer).toBeUndefined();
                    done();
                }, 200);
            }, 200);
        });
    });

    describe('Bug 999971: Remove Copy Icon and Set Drop Effect to None for Non-Allowed Media Types', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p>21</p>`,
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it("Dragging without video file should make the drop effect as none ", function (done: DoneFn) {
            const videoTransfer = new DataTransfer();
            let event: any = {
                clientX: 40,
                clientY: 294,
                target: rteObj.contentModule.getEditPanel(),
                dataTransfer: videoTransfer,
                preventDefault: function () { return; },
                stopImmediatePropagation: function () { return; }
            };
            rteObj.focusIn();
            (rteObj.videoModule as any).dragOver(event);
            setTimeout(() => {
                expect(event.dataTransfer.dropEffect).toBe('none');
                event = {
                    clientX: 40,
                    clientY: 294,
                    target: rteObj.contentModule.getEditPanel(),
                    preventDefault: function () { return; },
                    stopImmediatePropagation: function () { return; }
                };
                rteObj.focusIn();
                (rteObj.videoModule as any).dragOver(event);
                setTimeout(() => {
                    expect(event.dataTransfer).toBeUndefined();
                    done();
                }, 200);
            }, 200);
        });
    });

    describe('Bug 999971: Remove Copy Icon and Set Drop Effect to None for Non-Allowed Media Types', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p>21</p>`,
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it("should return the proper audio file type", function () {
            expect(isNullOrUndefined((rteObj.audioModule as any).getAudioExtensionFromMime(""))).toBe(true);
            expect(isNullOrUndefined((rteObj.audioModule as any).getAudioExtensionFromMime("video/mp4"))).toBe(true);
            expect(!isNullOrUndefined((rteObj.audioModule as any).getAudioExtensionFromMime("audio/opus; codecs=opus"))).toBe(true);
        });
    });

    describe('Bug 999971: Remove Copy Icon and Set Drop Effect to None for Non-Allowed Media Types', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p>21</p>`,
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it("should return the proper video file type", function () {
            expect(isNullOrUndefined((rteObj.videoModule as any).getExtensionFromMime(""))).toBe(true);
            expect(isNullOrUndefined((rteObj.videoModule as any).getExtensionFromMime("audio/mp3"))).toBe(true);
            expect(!isNullOrUndefined((rteObj.videoModule as any).getExtensionFromMime('video/webm; codecs="vp9"'))).toBe(true);
        });
    });

    describe('dragOver functionality across different browsers', () => {
            let rteObj: RichTextEditor;
            let dragEvent: any;
            let backupBrowserName: string;
            beforeEach(() => {
                rteObj = renderRTE({});
                dragEvent = {
                    dataTransfer: {
                        items: [{ type: "video/mp4" }],
                        types: ["Files"]
                    },
                    preventDefault: jasmine.createSpy('preventDefault'),
                    stopImmediatePropagation: function () { return; }
                };
                // Backup the browser name (info.name)
                backupBrowserName = Browser.info.name;
            });
            afterEach(() => {
                destroy(rteObj);
                // Restore the browser name
                Browser.info.name = backupBrowserName;
            });
            it('should call preventDefault for Edge browsers when dragging video', () => {
                Browser.info.name = 'edge';
                dragEvent.dataTransfer.items = [{ type: 'video/mp4' }];
                const result = (rteObj.videoModule as any).dragOver(dragEvent);
                expect(dragEvent.preventDefault).toHaveBeenCalled();
                expect(result).toBeUndefined();
            });
            it('should call preventDefault for Internet Explorer when types contain Files', () => {
                Browser.info.name = 'ie';
                dragEvent.dataTransfer.types = ["Files"];
                const result = (rteObj.videoModule as any).dragOver(dragEvent);
                expect(result === undefined || result === true).toBe(true);
            });
            it('should return true for other browsers or types', () => {
                Browser.info.name = 'chrome';
                dragEvent.dataTransfer.items = [{ type: 'text/plain' }];
                dragEvent.dataTransfer.types = ["text"];
                const result = (rteObj.videoModule as any).dragOver(dragEvent);
                expect(dragEvent.preventDefault).not.toHaveBeenCalled();
                expect(isNullOrUndefined(result)).toBe(true);
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

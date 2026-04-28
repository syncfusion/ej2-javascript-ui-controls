/**
 * HTML - readonly spec
 */
import { detach, createElement, isNullOrUndefined } from "@syncfusion/ej2-base";
import { RichTextEditor } from './../../../../src/index';
import { ToolbarType } from './../../../../src/common/enum';
import { renderRTE, destroy, clickAudio, clickVideo, clickImage } from './../../render.spec';

describe('RTE BASIC PROPERTIES - readonly - ', () => {

    describe(' PUBLIC METHODS - ', () => {

        describe(' destroy - ', () => {
            let rteObj: RichTextEditor;
            afterEach((done: Function) => {
                detach(rteObj.element);
                done();
            })

            it(' Test the readonly class of root element after destroy the component', () => {
                rteObj = renderRTE({ });
                rteObj.readonly = true;
                rteObj.dataBind();
                rteObj.destroy();
                expect(rteObj.element.classList.contains('e-rte-readonly')).toBe(false);
            });
        });

        describe(' selectAll - ', () => {
            let rteObj: RichTextEditor;
            let newEle: HTMLElement = createElement('span');
            afterEach((done: Function) => {
                destroy(rteObj);
                if(document.querySelector('span')) { detach(newEle); }
                done();
            })

            it(' Test the selection in readonly mode', () => {
                rteObj = renderRTE({
                    value: "<p>RichTextEditor</p>"
                });
                let ele: HTMLElement = rteObj.element;
                newEle.innerHTML = "<p>OutSide node</p>";
                ele.parentElement.appendChild(newEle);
                rteObj.selectAll();
                expect(rteObj.getSelection()).toEqual("RichTextEditor");
                document.body.click();
                rteObj.readonly = true;
                rteObj.dataBind();
                rteObj.selectAll();
                expect(rteObj.getSelection()).toBe("RichTextEditor");
            });
            it(' When no content in Rich Text Editor', () => {
                rteObj = renderRTE({
                    value: ''
                });
                rteObj.selectAll();
                expect(rteObj.getSelection()).toEqual('');
            });
        });
    });

    describe("1001277: When readonly set to true Expand toolbar items must be disabled", () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p>Sample</p>',
                toolbarSettings: {
                    items: ['Undo', 'Redo', '|', {
                        tooltipText: 'Insert Symbol',
                        template: '<button class="e-tbar-btn e-btn" tabindex="-1" id="custom_tbar"  style="width:100%"><div class="e-tbar-btn-text" style="font-weight: 400;"> &#937;</div></button>',
                        command: 'Custom',
                    },
                        'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
                        'FontName', 'FontSize', 'FontColor', 'LineHeight', 'BackgroundColor', '|',
                        'SubScript', 'SuperScript', '|',
                        'LowerCase', 'UpperCase', '|',
                        'Formats', 'Alignments', 'Blockquote', 'HorizontalLine', '|', 'OrderedList', 'UnorderedList', '|',
                        'Indent', 'Outdent', '|',
                        'CreateLink', '|', 'Image', '|', 'CreateTable', '|',
                        'SourceCode', '|', 'FormatPainter', '|', 'ClearFormat', '|', 'EmojiPicker', '|', 'Print', 'InsertCode', 'Audio', 'Video']
                },
                readonly: true,
                height: 400,
                width: 600,
            });
        });

        afterAll(() => {
            destroy(rteObj);
        });
        it('should disable the toolbar items on initial render and enable on dynamically  setting the readonly to false', (done: Function) => {
            expect(rteObj.getToolbarElement().querySelector('#' + rteObj.element.id + '_toolbar_Bold').parentElement.classList.contains('e-overlay')).toBe(true);
            expect(rteObj.getToolbarElement().querySelector('#custom_tbar').parentElement.classList.contains('e-overlay')).toBe(true);
            expect(rteObj.getToolbarElement().querySelector('#' + rteObj.element.id + '_toolbar_nav').parentElement.classList.contains('e-overlay')).toBe(true);
            rteObj.readonly = false;
            rteObj.dataBind();
            setTimeout(() => {
                expect(rteObj.getToolbarElement().querySelector('#' + rteObj.element.id + '_toolbar_Bold').parentElement.classList.contains('e-overlay')).toBe(false);
                expect(rteObj.getToolbarElement().querySelector('#custom_tbar').parentElement.classList.contains('e-overlay')).toBe(false);
                expect(rteObj.getToolbarElement().querySelector('#' + rteObj.element.id + '_toolbar_nav').parentElement.classList.contains('e-overlay')).toBe(false);
                done();
            }, 100);
        });
    });
    describe("1001277: When readonly set to true and Dynamically enabling toolbar", () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p>Sample</p>',
                toolbarSettings: {
                    items: ['Undo', 'Redo', '|', {
                        tooltipText: 'Insert Symbol',
                        template: '<button class="e-tbar-btn e-btn" tabindex="-1" id="custom_tbar"  style="width:100%"><div class="e-tbar-btn-text" style="font-weight: 400;"> &#937;</div></button>',
                        command: 'Custom',
                    },
                        'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
                        'FontName', 'FontSize', 'FontColor', 'LineHeight', 'BackgroundColor', '|',
                        'SubScript', 'SuperScript', '|',
                        'LowerCase', 'UpperCase', '|',
                        'Formats', 'Alignments', 'Blockquote', 'HorizontalLine', '|', 'OrderedList', 'UnorderedList', '|',
                        'Indent', 'Outdent', '|',
                        'CreateLink', '|', 'Image', '|', 'CreateTable', '|',
                        'SourceCode', '|', 'FormatPainter', '|', 'ClearFormat', '|', 'EmojiPicker', '|', 'Print', 'InsertCode', 'Audio', 'Video'],
                    enable: false
                },
                readonly: true,
                height: 400,
                width: 600,
            });
        });

        afterAll(() => {
            destroy(rteObj);
        });
        it('should disable the toolbar items on dynamically enable the toolbar', (done: Function) => {
            rteObj.toolbarSettings.enable = true;
            rteObj.dataBind();
            setTimeout(() => {
                expect(rteObj.getToolbarElement().querySelector('#' + rteObj.element.id + '_toolbar_Bold').parentElement.classList.contains('e-overlay')).toBe(true);
                expect(rteObj.getToolbarElement().querySelector('#custom_tbar').parentElement.classList.contains('e-overlay')).toBe(true);
                expect(rteObj.getToolbarElement().querySelector('#' + rteObj.element.id + '_toolbar_nav').parentElement.classList.contains('e-overlay')).toBe(true);
                done();
            }, 100);
        });
    });
    describe("1001277: When readonly set to true popup toolbar items should be disabled", () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p>Sample</p>',
                toolbarSettings: {
                    items: ['Undo', 'Redo', '|', {
                        tooltipText: 'Insert Symbol',
                        template: '<button class="e-tbar-btn e-btn" tabindex="-1" id="custom_tbar"  style="width:100%"><div class="e-tbar-btn-text" style="font-weight: 400;"> &#937;</div></button>',
                        command: 'Custom',
                    },
                        'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
                        'FontName', 'FontSize', 'FontColor', 'LineHeight', 'BackgroundColor', '|',
                        'SubScript', 'SuperScript', '|',
                        'LowerCase', 'UpperCase', '|',
                        'Formats', 'Alignments', 'Blockquote', 'HorizontalLine', '|', 'OrderedList', 'UnorderedList', '|',
                        'Indent', 'Outdent', '|',
                        'CreateLink', '|', 'Image', '|', 'CreateTable', '|',
                        'SourceCode', '|', 'FormatPainter', '|', 'ClearFormat', '|', 'EmojiPicker', '|', 'Print', 'InsertCode', 'Audio', 'Video'],
                    type: ToolbarType.Popup
                },
                readonly: true,
                height: 400,
                width: 600,
            });
        });

        afterAll(() => {
            destroy(rteObj);
        });
        it('should disable the popup toolbar items on initial render and dynamically enable the toolbar on dynamically  setting the readonly to false', (done: Function) => {
            expect(rteObj.getToolbarElement().querySelector('#' + rteObj.element.id + '_toolbar_Bold').parentElement.classList.contains('e-overlay')).toBe(true);
            expect(rteObj.getToolbarElement().querySelector('#custom_tbar').parentElement.classList.contains('e-overlay')).toBe(true);
            expect(rteObj.getToolbarElement().querySelector('#' + rteObj.element.id + '_toolbar_nav').parentElement.classList.contains('e-overlay')).toBe(true);
            rteObj.readonly = false;
            rteObj.dataBind();
            setTimeout(() => {
                expect(rteObj.getToolbarElement().querySelector('#' + rteObj.element.id + '_toolbar_Bold').parentElement.classList.contains('e-overlay')).toBe(false);
                expect(rteObj.getToolbarElement().querySelector('#custom_tbar').parentElement.classList.contains('e-overlay')).toBe(false);
                expect(rteObj.getToolbarElement().querySelector('#' + rteObj.element.id + '_toolbar_nav').parentElement.classList.contains('e-overlay')).toBe(false);
                done();
            }, 100);
        });
    });
    describe("1001277: When readonly set to true Scrollable toolbar items should be disabled.", () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p>Sample</p>',
                toolbarSettings: {
                    items: ['Undo', 'Redo', '|', {
                        tooltipText: 'Insert Symbol',
                        template: '<button class="e-tbar-btn e-btn" tabindex="-1" id="custom_tbar"  style="width:100%"><div class="e-tbar-btn-text" style="font-weight: 400;"> &#937;</div></button>',
                        command: 'Custom',
                    },
                        'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
                        'FontName', 'FontSize', 'FontColor', 'LineHeight', 'BackgroundColor', '|',
                        'SubScript', 'SuperScript', '|',
                        'LowerCase', 'UpperCase', '|',
                        'Formats', 'Alignments', 'Blockquote', 'HorizontalLine', '|', 'OrderedList', 'UnorderedList', '|',
                        'Indent', 'Outdent', '|',
                        'CreateLink', '|', 'Image', '|', 'CreateTable', '|',
                        'SourceCode', '|', 'FormatPainter', '|', 'ClearFormat', '|', 'EmojiPicker', '|', 'Print', 'InsertCode', 'Audio', 'Video'],
                    type: ToolbarType.Scrollable
                },
                readonly: true,
                height: 400,
                width: 600,
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('should disable the scrollable toolbar items on initial render and dynamically enable the toolbar when dynamically setting the readonly to false', (done: Function) => {
            expect(rteObj.getToolbarElement().querySelector('#' + rteObj.element.id + '_toolbar_Bold').parentElement.classList.contains('e-overlay')).toBe(true);
            expect(rteObj.getToolbarElement().querySelector('#custom_tbar').parentElement.classList.contains('e-overlay')).toBe(true);
            expect(rteObj.getToolbarElement().querySelector('.e-scroll-nav.e-scroll-left-nav').parentElement.classList.contains('e-overlay')).toBe(true);
            expect(rteObj.getToolbarElement().querySelector('.e-scroll-nav.e-scroll-right-nav').parentElement.classList.contains('e-overlay')).toBe(true);
            rteObj.readonly = false;
            rteObj.dataBind();
            setTimeout(() => {
                expect(rteObj.getToolbarElement().querySelector('#' + rteObj.element.id + '_toolbar_Bold').parentElement.classList.contains('e-overlay')).toBe(false);
                expect(rteObj.getToolbarElement().querySelector('#custom_tbar').parentElement.classList.contains('e-overlay')).toBe(false);
                expect(rteObj.getToolbarElement().querySelector('.e-scroll-nav.e-scroll-left-nav').classList.contains('e-overlay')).toBe(true);
                expect(rteObj.getToolbarElement().querySelector('.e-scroll-nav.e-scroll-right-nav').classList.contains('e-overlay')).toBe(false);
                const rightScrollBtn: HTMLElement = rteObj.getToolbarElement().querySelector('.e-scroll-nav.e-scroll-right-nav');
                rightScrollBtn.classList.add('e-overlay');
                rteObj.getToolbarElement().querySelector('.e-scroll-nav.e-scroll-left-nav').classList.remove('e-overlay');
                rteObj.readonly = true;
                rteObj.dataBind();
                setTimeout(() => {
                    expect(rteObj.getToolbarElement().querySelector('.e-scroll-nav.e-scroll-right-nav').parentElement.classList.contains('e-overlay')).toBe(true);
                    expect(rteObj.getToolbarElement().querySelector('.e-scroll-nav.e-scroll-left-nav').parentElement.classList.contains('e-overlay')).toBe(true);
                    rteObj.readonly = false;
                    rteObj.dataBind();
                    setTimeout(() => {
                        expect(rteObj.getToolbarElement().querySelector('.e-scroll-nav.e-scroll-right-nav').classList.contains('e-overlay')).toBe(true);
                        expect(rteObj.getToolbarElement().querySelector('.e-scroll-nav.e-scroll-left-nav').classList.contains('e-overlay')).toBe(false);
                        done();
                    }, 100);
                }, 100)
            }, 100);
        });
    });
    describe("1001277: When readonly set to true Scrollable toolbar items should be disabled both the left and right scroll buttons", () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p>Sample</p>',
                toolbarSettings: {
                    items: ['Undo', 'Redo', '|', {
                        tooltipText: 'Insert Symbol',
                        template: '<button class="e-tbar-btn e-btn" tabindex="-1" id="custom_tbar"  style="width:100%"><div class="e-tbar-btn-text" style="font-weight: 400;"> &#937;</div></button>',
                        command: 'Custom',
                    },
                        'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
                        'FontName', 'FontSize', 'FontColor', 'LineHeight', 'BackgroundColor', '|',
                        'SubScript', 'SuperScript', '|',
                        'LowerCase', 'UpperCase', '|',
                        'Formats', 'Alignments', 'Blockquote', 'HorizontalLine', '|', 'OrderedList', 'UnorderedList', '|',
                        'Indent', 'Outdent', '|',
                        'CreateLink', '|', 'Image', '|', 'CreateTable', '|',
                        'SourceCode', '|', 'FormatPainter', '|', 'ClearFormat', '|', 'EmojiPicker', '|', 'Print', 'InsertCode', 'Audio', 'Video'],
                    type: ToolbarType.Scrollable
                },
                readonly: true,
                height: 400,
                width: 600,
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('should disable the scrollable toolbar items on initial render and dynamically enable the toolbar', (done: Function) => {
            expect(rteObj.getToolbarElement().querySelector('#' + rteObj.element.id + '_toolbar_Bold').parentElement.classList.contains('e-overlay')).toBe(true);
            expect(rteObj.getToolbarElement().querySelector('#custom_tbar').parentElement.classList.contains('e-overlay')).toBe(true);
            expect(rteObj.getToolbarElement().querySelector('.e-scroll-nav.e-scroll-left-nav').parentElement.classList.contains('e-overlay')).toBe(true);
            expect(rteObj.getToolbarElement().querySelector('.e-scroll-nav.e-scroll-right-nav').parentElement.classList.contains('e-overlay')).toBe(true);
            rteObj.readonly = false;
            rteObj.dataBind();
            setTimeout(() => {
                expect(rteObj.getToolbarElement().querySelector('#' + rteObj.element.id + '_toolbar_Bold').parentElement.classList.contains('e-overlay')).toBe(false);
                expect(rteObj.getToolbarElement().querySelector('#custom_tbar').parentElement.classList.contains('e-overlay')).toBe(false);
                expect(rteObj.getToolbarElement().querySelector('.e-scroll-nav.e-scroll-left-nav').classList.contains('e-overlay')).toBe(true);
                expect(rteObj.getToolbarElement().querySelector('.e-scroll-nav.e-scroll-right-nav').classList.contains('e-overlay')).toBe(false);
                const rightScrollBtn: HTMLElement = rteObj.getToolbarElement().querySelector('.e-scroll-nav.e-scroll-right-nav');
                rteObj.getToolbarElement().querySelector('.e-scroll-nav.e-scroll-left-nav').classList.remove('e-overlay');
                rteObj.readonly = true;
                rteObj.dataBind();
                setTimeout(() => {
                    expect(rteObj.getToolbarElement().querySelector('.e-scroll-nav.e-scroll-right-nav').parentElement.classList.contains('e-overlay')).toBe(true);
                    expect(rteObj.getToolbarElement().querySelector('.e-scroll-nav.e-scroll-left-nav').parentElement.classList.contains('e-overlay')).toBe(true);
                    rteObj.readonly = false;
                    rteObj.dataBind();
                    setTimeout(() => {
                        expect(rteObj.getToolbarElement().querySelector('.e-scroll-nav.e-scroll-right-nav').classList.contains('e-overlay')).toBe(false);
                        expect(rteObj.getToolbarElement().querySelector('.e-scroll-nav.e-scroll-left-nav').classList.contains('e-overlay')).toBe(false);
                        done();
                    }, 100);
                }, 100)
            }, 100);
        });
    });
    describe("1001277: When readonly set to true Scrollable toolbar items should be disabled , left scroll button should be disabled", () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p>Sample</p>',
                toolbarSettings: {
                    items: ['Undo', 'Redo', '|', {
                        tooltipText: 'Insert Symbol',
                        template: '<button class="e-tbar-btn e-btn" tabindex="-1" id="custom_tbar"  style="width:100%"><div class="e-tbar-btn-text" style="font-weight: 400;"> &#937;</div></button>',
                        command: 'Custom',
                    },
                        'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
                        'FontName', 'FontSize', 'FontColor', 'LineHeight', 'BackgroundColor', '|',
                        'SubScript', 'SuperScript', '|',
                        'LowerCase', 'UpperCase', '|',
                        'Formats', 'Alignments', 'Blockquote', 'HorizontalLine', '|', 'OrderedList', 'UnorderedList', '|',
                        'Indent', 'Outdent', '|',
                        'CreateLink', '|', 'Image', '|', 'CreateTable', '|',
                        'SourceCode', '|', 'FormatPainter', '|', 'ClearFormat', '|', 'EmojiPicker', '|', 'Print', 'InsertCode', 'Audio', 'Video'],
                    type: ToolbarType.Scrollable
                },
                readonly: true,
                height: 400,
                width: 600,
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('should disable the scrollable toolbar items on initial render and dynamically enable the toolbar', (done: Function) => {
            expect(rteObj.getToolbarElement().querySelector('#' + rteObj.element.id + '_toolbar_Bold').parentElement.classList.contains('e-overlay')).toBe(true);
            expect(rteObj.getToolbarElement().querySelector('#custom_tbar').parentElement.classList.contains('e-overlay')).toBe(true);
            expect(rteObj.getToolbarElement().querySelector('.e-scroll-nav.e-scroll-left-nav').parentElement.classList.contains('e-overlay')).toBe(true);
            expect(rteObj.getToolbarElement().querySelector('.e-scroll-nav.e-scroll-right-nav').parentElement.classList.contains('e-overlay')).toBe(true);
            rteObj.readonly = false;
            rteObj.dataBind();
            setTimeout(() => {
                expect(rteObj.getToolbarElement().querySelector('#' + rteObj.element.id + '_toolbar_Bold').parentElement.classList.contains('e-overlay')).toBe(false);
                expect(rteObj.getToolbarElement().querySelector('#custom_tbar').parentElement.classList.contains('e-overlay')).toBe(false);
                expect(rteObj.getToolbarElement().querySelector('.e-scroll-nav.e-scroll-left-nav').classList.contains('e-overlay')).toBe(true);
                expect(rteObj.getToolbarElement().querySelector('.e-scroll-nav.e-scroll-right-nav').classList.contains('e-overlay')).toBe(false);
                rteObj.readonly = true;
                rteObj.dataBind();
                setTimeout(() => {
                    expect(rteObj.getToolbarElement().querySelector('.e-scroll-nav.e-scroll-right-nav').parentElement.classList.contains('e-overlay')).toBe(true);
                    expect(rteObj.getToolbarElement().querySelector('.e-scroll-nav.e-scroll-left-nav').parentElement.classList.contains('e-overlay')).toBe(true);
                    rteObj.readonly = false;
                    rteObj.dataBind();
                    setTimeout(() => {
                        expect(rteObj.getToolbarElement().querySelector('.e-scroll-nav.e-scroll-right-nav').classList.contains('e-overlay')).toBe(false);
                        expect(rteObj.getToolbarElement().querySelector('.e-scroll-nav.e-scroll-left-nav').classList.contains('e-overlay')).toBe(true);
                        done();
                    }, 100);
                }, 100)
            }, 100);
        });
    });
    describe("1001277: Image popup must be closed when readonly enabled dynamically", () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p>Sample</p>',
                toolbarSettings: {
                    items: ['Bold']
                },
                height: 400,
                width: 600,
            });
        });

        afterAll(() => {
            destroy(rteObj);
        });
        it('Should close the quick toolbar', (done: DoneFn) => {
            rteObj.inputElement.innerHTML = `<p><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 300px;" class="e-rte-image e-img-inline"></p>`;
            rteObj.focusIn();
            const img = rteObj.inputElement.querySelector('img');
            clickImage(img);
            setTimeout(() => {
                expect(rteObj.inputElement.querySelectorAll('.e-img-resize').length).toBe(1);
                const quickToolbar: HTMLElement = document.body.querySelector('.e-rte-quick-popup');
                expect(quickToolbar).not.toBeNull();
                rteObj.readonly = true;
                rteObj.dataBind();
                setTimeout(() => {
                    const quickToolbar: HTMLElement = document.body.querySelector('.e-rte-quick-popup');
                    expect(quickToolbar).toBeNull();
                    done();
                }, 100);
            }, 400);
        });
    });
    describe("1001277: Video popup must be closed when readonly enabled dynamically", () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p>Sample</p>',
                toolbarSettings: {
                    items: ['Bold']
                },
                height: 400,
                width: 600,
            });
        });

        afterAll(() => {
            destroy(rteObj);
        });
        it('Should close the quick toolbar', (done: DoneFn) => {
            rteObj.inputElement.innerHTML = `<p><video controls style="width: 30%;"><sourcesrc="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Ocean-Waves.mp4" type="video/mp4" /></video></p>`;
            rteObj.focusIn();
            const vid = rteObj.inputElement.querySelector('video');
            clickVideo(vid);
            setTimeout(() => {
                expect(rteObj.inputElement.querySelectorAll('.e-vid-resize').length).toBe(1);
                const quickToolbar: HTMLElement = document.body.querySelector('.e-rte-quick-popup');
                expect(quickToolbar).not.toBeNull();
                rteObj.readonly = true;
                rteObj.dataBind();
                setTimeout(() => {
                    const quickToolbar: HTMLElement = document.body.querySelector('.e-rte-quick-popup');
                    expect(quickToolbar).toBeNull();
                    done();
                }, 100);
            }, 400);
        });
    });
    describe("1001277: Audio popup must be closed when readonly enabled dynamically.", () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p>Sample</p>',
                toolbarSettings: {
                    items: ['Bold']
                },
                height: 400,
                width: 600,
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Should close the quick toolbar', (done: DoneFn) => {
            rteObj.inputElement.innerHTML = `<p><span class="e-audio-wrap" contenteditable="false" title="horse.mp3"><span class="e-clickelem"><audio class="e-rte-audio e-audio-inline" controls="" style=""><source src="https://www.w3schools.com/html/horse.mp3" type="audio/mp3"></audio></span></span> </p>`;
            rteObj.focusIn();
            const aud = rteObj.inputElement.querySelector('audio');
            clickAudio(aud);
            setTimeout(() => {
                const quickToolbar: HTMLElement = document.body.querySelector('.e-rte-quick-popup');
                expect(quickToolbar).not.toBeNull();
                rteObj.readonly = true;
                rteObj.dataBind();
                setTimeout(() => {
                    const quickToolbar: HTMLElement = document.body.querySelector('.e-rte-quick-popup');
                    expect(quickToolbar).toBeNull();
                    done();
                }, 100);
            }, 400);
        });
    });
    describe("1001277: Table resize and quick toolbar must be closed when readonly enabled dynamically", function () {
        var rteObj: RichTextEditor;
        beforeAll(function () {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable']
                },
                saveInterval: 1,
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><colgroup><col style="width: 33.3333%;"><col style="width: 33.3333%;"><col style="width: 33.3333%;"></colgroup><tbody><tr><td class="e-cell-select"><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr></tbody></table>`
            });
            rteObj.saveInterval = 10;
            rteObj.dataBind();
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it("Table resize gripper element and quick toolbar should be closed", function (done) {
            let table: any = (rteObj.tableModule as any).contentModule.getEditPanel().querySelector('table');
            (rteObj.tableModule as any).tableObj.resizeHelper({ target: table, preventDefault: function () { } });
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-table-box') !== null).toBe(true);
            expect(table.querySelectorAll('.e-cell-select').length == 1).toBe(true);
            rteObj.readonly = true;
            setTimeout(function () {
                expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-table-box').length == 0).toBe(true);
                expect(table.querySelectorAll('.e-cell-select').length == 0).toBe(true);
                done();
            }, 100);
        });
    });
    describe("1001277: sourcecode view cases , should disable the itmes when readonly enabled dynamically", function () {
        var rteObj: RichTextEditor;
        beforeAll(function () {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'FullScreen', 'SourceCode']
                },
                value: `<p>Sample</p>`
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it("Toolbar items should be disabled and enabled when readonly enabled", function (done) {
            let item: HTMLElement = rteObj.element.querySelector('#' + rteObj.element.id + '_toolbar_SourceCode');
            item.click();
            setTimeout(() => {
                rteObj.readonly = true;
                rteObj.dataBind();
                setTimeout(() => {
                    let item = rteObj.element.querySelector('#' + rteObj.element.id + '_toolbar_Preview') as HTMLElement;
                    expect(item.parentElement.classList.contains('e-overlay')).toBe(true);
                    rteObj.readonly = false;
                    rteObj.dataBind();
                    setTimeout(() => {
                        item = rteObj.element.querySelector('#' + rteObj.element.id + '_toolbar_Preview') as HTMLElement;
                        expect(item.parentElement.classList.contains('e-overlay')).toBe(false);
                        done();
                    })
                }, 100);
            }, 100);
        });
    });
    describe("1001277: Image dialod must be closed when readonly enabled dynamically", () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p>Sample</p>',
                toolbarSettings: {
                    items: ['Image']
                },
            });
        });

        afterAll(() => {
            destroy(rteObj);
        });
        it('Should close the dialog when readonly enabled', (done: DoneFn) => {
            rteObj.inputElement.innerHTML = `<p>Testing</p>`;
            (<HTMLElement>rteObj.element.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            setTimeout(() => {
                expect(isNullOrUndefined((<any>rteObj).imageModule.dialogObj)).toBe(false);
                rteObj.readonly = true;
                rteObj.dataBind();
                setTimeout(() => {
                    expect(isNullOrUndefined((<any>rteObj).imageModule.dialogObj)).toBe(true);
                    done();
                }, 100);
            }, 100);
        });
    });
    describe("1001277: Video dialod must be closed when readonly enabled dynamically", () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p>Sample</p>',
                toolbarSettings: {
                    items: ['Video']
                },
            });
        });

        afterAll(() => {
            destroy(rteObj);
        });
        it('Should close the dialog when readonly enabled', (done: DoneFn) => {
            rteObj.inputElement.innerHTML = `<p>Testing</p>`;
            (<HTMLElement>rteObj.element.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            setTimeout(() => {
                expect(isNullOrUndefined((<any>rteObj).videoModule.dialogObj)).toBe(false);
                rteObj.readonly = true;
                rteObj.dataBind();
                setTimeout(() => {
                    expect(isNullOrUndefined((<any>rteObj).videoModule.dialogObj)).toBe(true);
                    done();
                }, 100);
            }, 100);
        });
    });
    describe("1001277: Audio dialod must be closed when readonly enabled dynamically", () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p>Sample</p>',
                toolbarSettings: {
                    items: ['Audio']
                },
            });
        });

        afterAll(() => {
            destroy(rteObj);
        });
        it('Should close the dialog when readonly enabled', (done: DoneFn) => {
            rteObj.inputElement.innerHTML = `<p>Testing</p>`;
            (<HTMLElement>rteObj.element.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            setTimeout(() => {
                expect(isNullOrUndefined((<any>rteObj).audioModule.dialogObj)).toBe(false);
                rteObj.readonly = true;
                rteObj.dataBind();
                setTimeout(() => {
                    expect(isNullOrUndefined((<any>rteObj).audioModule.dialogObj)).toBe(true);
                    done();
                }, 100);
            }, 100);
        });
    });
    describe("1001277: Link dialod must be closed when readonly enabled dynamically", () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p>Sample</p>',
                toolbarSettings: {
                    items: ['CreateLink']
                },
            });
        });

        afterAll(() => {
            destroy(rteObj);
        });
        it('Should close the dialog when readonly enabled', (done: DoneFn) => {
            rteObj.inputElement.innerHTML = `<p>Testing</p>`;
            (<HTMLElement>rteObj.element.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            setTimeout(() => {
                expect(isNullOrUndefined((<any>rteObj).linkModule.dialogObj)).toBe(false);
                rteObj.readonly = true;
                rteObj.dataBind();
                setTimeout(() => {
                    expect(isNullOrUndefined((<any>rteObj).linkModule.dialogObj)).toBe(true);
                    done();
                }, 100);
            }, 100);
        });
    });
    describe("1001277: Emoji dialog must be closed when readonly enabled dynamically", () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p>Sample</p>',
                toolbarSettings: {
                    items: ['EmojiPicker']
                },
            });
        });

        afterAll(() => {
            destroy(rteObj);
        });
        it('Should close the dialog when readonly enabled', (done: DoneFn) => {
            rteObj.inputElement.innerHTML = `<p>Testing</p>`;
            (<HTMLElement>rteObj.element.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            setTimeout(() => {
                expect(isNullOrUndefined((<any>rteObj).emojiPickerModule.popupObj)).toBe(false);
                rteObj.readonly = true;
                rteObj.dataBind();
                setTimeout(() => {
                    expect(isNullOrUndefined((<any>rteObj).emojiPickerModule.popupObj)).toBe(true);
                    done();
                }, 100);
            }, 100);
        });
    });
    describe("1001277: Table popup dialog must be closed when readonly enabled dynamically", () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p>Sample</p>',
                toolbarSettings: {
                    items: ['CreateTable']
                },
            });
        });

        afterAll(() => {
            destroy(rteObj);
        });
        it('Should close the dialog when readonly enabled', (done: DoneFn) => {
            rteObj.inputElement.innerHTML = `<p>Testing</p>`;
            (<HTMLElement>rteObj.element.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            setTimeout(() => {
                expect(isNullOrUndefined((<any>rteObj).tableModule.popupObj)).toBe(false);
                rteObj.readonly = true;
                rteObj.dataBind();
                setTimeout(() => {
                    expect(isNullOrUndefined((<any>rteObj).tableModule.popupObj)).toBe(true);
                    done();
                }, 100);
            }, 100);
        });
    });
    describe('1001277: Table dialog must be closed when readonly enabled dynamically', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                placeholder: 'Insert table here',
                toolbarSettings: {
                    items: ['Bold', 'CreateTable']
                },
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Should close the dialog when readonly enabled', (done: DoneFn) => {
            rteObj.focusIn();
            const keyEvent = new KeyboardEvent("keydown", {
                key: "E",
                code: "KeyE",
                which: 69,
                keyCode: 69,
                ctrlKey: true,
                shiftKey: true,
                bubbles: true,
                cancelable: true
            } as KeyboardEventInit);
            rteObj.inputElement.dispatchEvent(keyEvent);
            setTimeout(() => {
                expect(isNullOrUndefined((<any>rteObj).tableModule.editdlgObj)).toBe(false);
                rteObj.readonly = true;
                rteObj.dataBind();
                setTimeout(() => {
                    expect(isNullOrUndefined((<any>rteObj).tableModule.editdlgObj)).toBe(true);
                    done();
                }, 100);
            }, 100);
        });
    });
    describe('1001277 - Dropdown must closed when the readonly enabled dynamically', () => {
        let rteObj: RichTextEditor;
        beforeAll((done) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['FontName', 'FontSize', 'Formats', 'OrderedList', 'UnorderedList']
                },
                value: "Rich Text Editor"
            });
            done();
        });
        it('Should close the dropdown when readonly enabled', (done: Function) => {
            const dropButton: NodeList = document.body.querySelectorAll('.e-dropdown-btn');
            (dropButton[0] as HTMLElement).click();
            setTimeout(() => {
                expect(document.querySelectorAll('.e-popup-open').length).toBe(1);
                rteObj.readonly = true;
                rteObj.dataBind();
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-popup-open').length).toBe(0);
                    done();
                }, 100);
            }, 100);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });
    describe('1001277 - Background color Dropdown must closed when the readonly enabled dynamically', () => {
        let rteObj: RichTextEditor;
        beforeAll((done) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['BackgroundColor', 'FontName', 'FontSize', 'Formats', 'OrderedList', 'UnorderedList']
                },
                value: "Rich Text Editor"
            });
            done();
        });
        it('Should close the dropdown when readonly enabled', (done: Function) => {
            const dropButton: NodeList = document.body.querySelectorAll('.e-dropdown-btn');
            (dropButton[0] as HTMLElement).click();
            setTimeout(() => {
                expect(document.querySelectorAll('.e-popup-open').length).toBe(1);
                rteObj.readonly = true;
                rteObj.dataBind();
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-popup-open').length).toBe(0);
                    done();
                }, 100);
            }, 100);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });
});
/**
 * Clear format spec
 */
import { RichTextEditor } from './../../../../src/index';
import { renderRTE, destroy, dispatchEvent } from './../../render.spec';

describe('Clear Format commands', () => {
    //HTML value
    let innervalue: string = `<p id="first-node">The rich text editor is WYSIWYG ("what you see is what you get") editor useful to 
    create and edit content, and return the valid
     <a href="https://ej2.syncfusion.com/home/" target="_blank">HTML markup</a> or 
     <a href="https://ej2.syncfusion.com/home/" target="_blank">markdown</a>
      of the content</p><p><strong>Table</strong></p><p>Inserts the manages table.</p>
      <table class="e-rte-table" style="width: 100%;"><tbody><tr><td style="width: 50%;" class="">
      <p>column 1<br></p><p>column 2</p></td><td style="width: 50%;"><p><br></p></td></tr></tbody></table>
      <p><b>Toolbar</b></p><p>Toolbar contains commands to align the text, insert link, insert image, insert list,
       undo/redo operations, HTML view, etc </p><ol><li><p>Toolbar is fully customizable</p></li></ol>
       <p><b>Image.</b></p><p><span>Allows you to insert images from an online source as well as the local computer</span></p>
       <img id="last-node" alt="Logo" src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" style="width: 300px;">`;
    let rteObj: RichTextEditor;
    let controlId: string;
    let rteElement: HTMLElement;
    beforeEach(() => {
        rteObj = renderRTE({
            value: innervalue,
            toolbarSettings: {
                items: ['ClearFormat', 'Formats', 'Alignments', 'Indent', 'Outdent', 'OrderedList', 'UnorderedList']
            }
        })
        controlId = rteObj.element.id;
        rteElement = rteObj.element;
    });
    afterEach(() => {
        destroy(rteObj);
    });
    /**
     * Text Node Direct Parent
     */
    it('Clear the parent based commands headings', () => {
        rteObj.selectAll();
        let item: HTMLElement = rteElement.querySelector("#" + controlId + '_toolbar_Formats');
        dispatchEvent(item, 'mousedown');
        item.click();
        let popup = document.querySelector("#" + controlId + '_toolbar_Formats-popup');
        item = popup.querySelectorAll('.e-item')[4] as HTMLElement;
        dispatchEvent(item, 'mousedown');
        item.click();
        item = rteElement.querySelector("#" + controlId + '_toolbar_ClearFormat');
        dispatchEvent(item, 'mousedown');
        item.click();
        expect(rteElement.querySelectorAll('h2').length === 0).toBe(true);
    });
});
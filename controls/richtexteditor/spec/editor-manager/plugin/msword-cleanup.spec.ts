/**
 * Paste CleanUp spec
 */
import { EditorManager } from '../../../src/editor-manager/index';
import { RichTextEditor } from '../../../src/rich-text-editor/base/rich-text-editor';
import { PasteCleanup } from '../../../src/rich-text-editor/actions/paste-clean-up';
import { renderRTE, setCursorPoint } from '../../rich-text-editor/render.spec';
import {
  CLS_RTE_PASTE_KEEP_FORMAT, CLS_RTE_PASTE_REMOVE_FORMAT, CLS_RTE_PASTE_OK,
} from '../../../src/rich-text-editor/base/classes';
import { createElement } from '@syncfusion/ej2-base';
RichTextEditor.Inject(PasteCleanup);

describe('MSWord Content Paste testing', () => {
  let editorObj: EditorManager;
  let rteObj: RichTextEditor;
  let pasteCleanUp: PasteCleanup;
  let rteEle: HTMLElement;
  let element: HTMLElement;
  let keepFormatButton: HTMLElement;
  let keyBoardEvent: any = {
    preventDefault: () => { },
    type: 'keydown',
    stopPropagation: () => { },
    ctrlKey: false,
    shiftKey: false,
    action: null,
    which: 64,
    key: ''
  };

  beforeAll((done: Function) => {
    rteObj = renderRTE({
      pasteCleanupSettings: {
        prompt: true
      }
    });
    rteEle = rteObj.element;
    done();
  });

  it('MSWord List Conversion Type 1', (done) => {
    /*
      •	One Node-1
      •	Two Node-1
      •	Three Node-1
    */
    let localElem: string = `
    <p class='MsoListParagraphCxSpFirst' style='text-indent:-.25in;mso-list:l0 level1 lfo1'><!--[if !supportLists]--><span style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><!--[endif]-->One Node-1<o:p></o:p></p>

<p class='MsoListParagraphCxSpMiddle' style='text-indent:-.25in;mso-list:l0 level1 lfo1'><!--[if !supportLists]--><span style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><!--[endif]-->Two Node-1<o:p></o:p></p>

<p class='MsoListParagraphCxSpLast' style='text-indent:-.25in;mso-list:l0 level1 lfo1'><!--[if !supportLists]--><span style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><!--[endif]-->Three Node-1<o:p></o:p></p>
    `;
    keyBoardEvent.clipboardData = {
      getData: () => {
        return localElem;
      },
      items: []
    };
    (rteObj as any).inputElement.focus();
    setCursorPoint((rteObj as any).inputElement, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let allElem: any = (rteObj as any).inputElement.firstElementChild.querySelectorAll('*');
      let expected: boolean = true;
      let expectedElem: string = `<ul level="1" style="list-style: disc;"><li><p>One Node-1</p></li><li><p>Two Node-1</p></li><li><p>Three Node-1</p></li></ul>`;
      if (allElem[0].parentElement.innerHTML.trim() !== expectedElem) {
        expected = false;
      }
      expect(expected).toBe(true);
      done();
    }, 100);
  });

  it('MSWord List Conversion Type 2', (done) => {
    /*
    <ol>
      1. One Node-1
      2. Two Node-1
      3. Three Node-1
    </ol>
     */
    let localElem: string = `
  <p class='MsoListParagraphCxSpFirst' style='text-indent:-.25in;mso-list:l0 level1 lfo1'><!--[if !supportLists]--><span style='mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin'><span style='mso-list:Ignore'>1.<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  </span></span></span><!--[endif]-->One Node-1<o:p></o:p></p>
  
  <p class='MsoListParagraphCxSpMiddle' style='text-indent:-.25in;mso-list:l0 level1 lfo1'><!--[if !supportLists]--><span style='mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin'><span style='mso-list:Ignore'>2.<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  </span></span></span><!--[endif]-->Two Node-1<o:p></o:p></p>
  
  <p class='MsoListParagraphCxSpLast' style='text-indent:-.25in;mso-list:l0 level1 lfo1'><!--[if !supportLists]--><span style='mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin'><span style='mso-list:Ignore'>3.<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  </span></span></span><!--[endif]-->Three Node-1<o:p></o:p></p>
  `;
    keyBoardEvent.clipboardData = {
      getData: () => {
        return localElem;
      },
      items: []
    };
    (rteObj as any).inputElement.focus();
    setCursorPoint((rteObj as any).inputElement, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let allElem: any = (rteObj as any).inputElement.firstElementChild.querySelectorAll('*');
      let expected: boolean = true;
      let expectedElem: string = `<ol level="1" style="list-style: decimal;"><li><p>One Node-1</p></li><li><p>Two Node-1</p></li><li><p>Three Node-1</p></li></ol>`;
      if (allElem[0].parentElement.innerHTML.trim() !== expectedElem) {
        expected = false;
      }
      expect(expected).toBe(true);
      done();
    }, 100);
  });

  it('MSWord List Conversion Type 3', (done) => {
    /*
      •	One Node-3
        o	Two Node-3
      •	Three Node-3
      •	Four Node-3
    */
    let localElem: string = `
    <p class='MsoListParagraphCxSpFirst' style='text-indent:-.25in;mso-list:l0 level1 lfo1'><!--[if !supportLists]--><span style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><!--[endif]-->One Node-3<o:p></o:p></p>

<p class='MsoListParagraphCxSpMiddle' style='margin-left:1.0in;mso-add-space:
auto;text-indent:-.25in;mso-list:l0 level2 lfo1'><!--[if !supportLists]--><span style='font-family:&quot;Courier New&quot;;mso-fareast-font-family:&quot;Courier New&quot;'><span style='mso-list:Ignore'>o<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;
</span></span></span><!--[endif]-->Two Node-3<o:p></o:p></p>

<p class='MsoListParagraphCxSpMiddle' style='margin-left:2.0in;mso-add-space:
auto;text-indent:-.25in;mso-list:l0 level4 lfo1'><!--[if !supportLists]--><span style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><!--[endif]-->Three Node-3<o:p></o:p></p>

<p class='MsoListParagraphCxSpLast' style='text-indent:-.25in;mso-list:l0 level1 lfo1'><!--[if !supportLists]--><span style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><!--[endif]-->Four Node-3<o:p></o:p></p>
  `;
    keyBoardEvent.clipboardData = {
      getData: () => {
        return localElem;
      },
      items: []
    };
    (rteObj as any).inputElement.focus();
    setCursorPoint((rteObj as any).inputElement, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let allElem: any = (rteObj as any).inputElement.firstElementChild.querySelectorAll('*');
      let expected: boolean = true;
      let expectedElem: string = `<ul level="1" style="list-style: disc;"><li><p>One Node-3</p><ul level="2" style="list-style: square;"><li style="list-style: square;"><p>Two Node-3</p><ul><li style="list-style-type: none;"><ul level="4" style="list-style: disc;"><li style="list-style: disc;"><p>Three Node-3</p></li></ul></li></ul></li></ul></li><li><p>Four Node-3</p></li></ul>`;
      if (allElem[0].parentElement.innerHTML.trim() !== expectedElem) {
        expected = false;
      }
      expect(expected).toBe(true);
      done();
    }, 100);
  });

  it('MSWord List Conversion Type 4', (done) => {
    /*
      1.	One Node-4
        o	Two Node-4
        o	Three Node-4
      2.	Four Node-4
    */
    let localElem: string = `
    <p class='MsoListParagraphCxSpFirst' style='text-indent:-.25in;mso-list:l0 level1 lfo1'><!--[if !supportLists]--><span style='mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin'><span style='mso-list:Ignore'>1.<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><!--[endif]-->One Node-4<o:p></o:p></p>

<p class='MsoListParagraphCxSpMiddle' style='margin-left:1.0in;mso-add-space:
auto;text-indent:-.25in;mso-list:l0 level2 lfo1'><!--[if !supportLists]--><span style='font-family:&quot;Courier New&quot;;mso-fareast-font-family:&quot;Courier New&quot;'><span style='mso-list:Ignore'>o<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;
</span></span></span><!--[endif]-->Two Node-4<o:p></o:p></p>

<p class='MsoListParagraphCxSpMiddle' style='margin-left:1.0in;mso-add-space:
auto;text-indent:-.25in;mso-list:l0 level2 lfo1'><!--[if !supportLists]--><span style='font-family:&quot;Courier New&quot;;mso-fareast-font-family:&quot;Courier New&quot;'><span style='mso-list:Ignore'>o<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;
</span></span></span><!--[endif]-->Three Node-4<o:p></o:p></p>

<p class='MsoListParagraphCxSpLast' style='text-indent:-.25in;mso-list:l0 level1 lfo1'><!--[if !supportLists]--><span style='mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin'><span style='mso-list:Ignore'>2.<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><!--[endif]-->Four Node-4<o:p></o:p></p>
  `;
    keyBoardEvent.clipboardData = {
      getData: () => {
        return localElem;
      },
      items: []
    };
    (rteObj as any).inputElement.focus();
    setCursorPoint((rteObj as any).inputElement, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let allElem: any = (rteObj as any).inputElement.firstElementChild.querySelectorAll('*');
      let expected: boolean = true;
      let expectedElem: string = `<ol level="1" style="list-style: decimal;"><li><p>One Node-4</p><ul level="2" style="list-style: square;"><li style="list-style: square;"><p>Two Node-4</p></li><li><p>Three Node-4</p></li></ul></li><li><p>Four Node-4</p></li></ol>`;
      if (allElem[0].parentElement.innerHTML.trim() !== expectedElem) {
        expected = false;
      }
      expect(expected).toBe(true);
      done();
    }, 100);
  });

  it('MSWord List Conversion Type 5', (done) => {
    /*
      1.	One Type-5
        a.	Two Type-5
          i.	Three Type-5
        b.	Four Type-5
      2.	Five Type-5
      3.	Six Type-5
        a.	Seven Type-5

      1.	Eight Separate Type-5
      2.	Nine Separate Type-5
    */
    let localElem: string = `
    <p class='MsoListParagraphCxSpFirst' style='text-indent:-.25in;mso-list:l1 level1 lfo1'><!--[if !supportLists]--><span style='mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin'><span style='mso-list:Ignore'>1.<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><!--[endif]-->One Type-5<o:p></o:p></p>

<p class='MsoListParagraphCxSpMiddle' style='margin-left:1.0in;mso-add-space:
auto;text-indent:-.25in;mso-list:l1 level2 lfo1'><!--[if !supportLists]--><span style='mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin'><span style='mso-list:Ignore'>a.<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><!--[endif]-->Two Type-5<o:p></o:p></p>

<p class='MsoListParagraphCxSpMiddle' style='margin-left:1.5in;mso-add-space:
auto;text-indent:-1.5in;mso-text-indent-alt:-9.0pt;mso-list:l1 level3 lfo1'><!--[if !supportLists]--><span style='mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin'><span style='mso-list:Ignore'><span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span>i.<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><!--[endif]-->Three Type-5<o:p></o:p></p>

<p class='MsoListParagraphCxSpMiddle' style='margin-left:1.0in;mso-add-space:
auto;text-indent:-.25in;mso-list:l1 level2 lfo1'><!--[if !supportLists]--><span style='mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin'><span style='mso-list:Ignore'>b.<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><!--[endif]-->Four Type-5<o:p></o:p></p>

<p class='MsoListParagraphCxSpMiddle' style='text-indent:-.25in;mso-list:l1 level1 lfo1'><!--[if !supportLists]--><span style='mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin'><span style='mso-list:Ignore'>2.<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><!--[endif]-->Five Type-5<o:p></o:p></p>

<p class='MsoListParagraphCxSpMiddle' style='text-indent:-.25in;mso-list:l1 level1 lfo1'><!--[if !supportLists]--><span style='mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin'><span style='mso-list:Ignore'>3.<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><!--[endif]-->Six Type-5<o:p></o:p></p>

<p class='MsoListParagraphCxSpLast' style='margin-left:1.0in;mso-add-space:auto;
text-indent:-.25in;mso-list:l1 level2 lfo1'><!--[if !supportLists]--><span style='mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin'><span style='mso-list:Ignore'>a.<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><!--[endif]-->Seven Type-5<o:p></o:p></p>

<p class='MsoNormal'><o:p>&nbsp;</o:p></p>

<p class='MsoListParagraphCxSpFirst' style='text-indent:-.25in;mso-list:l0 level1 lfo2'><!--[if !supportLists]--><span style='mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin'><span style='mso-list:Ignore'>1.<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><!--[endif]-->Eight Separate Type-5<o:p></o:p></p>

<p class='MsoListParagraphCxSpLast' style='text-indent:-.25in;mso-list:l0 level1 lfo2'><!--[if !supportLists]--><span style='mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin'><span style='mso-list:Ignore'>2.<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><!--[endif]-->Nine Separate Type-5<o:p></o:p></p>
  `;
    keyBoardEvent.clipboardData = {
      getData: () => {
        return localElem;
      },
      items: []
    };
    (rteObj as any).inputElement.focus();
    setCursorPoint((rteObj as any).inputElement, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let allElem: any = (rteObj as any).inputElement.firstElementChild.querySelectorAll('*');
      let expected: boolean = true;
      let expectedElem: string = `<ol level="1" style="list-style: decimal;"><li><p>One Type-5</p><ol level="2" style="list-style: lower-alpha;"><li style="list-style: lower-alpha;"><p>Two Type-5</p><ol level="3" style="list-style: lower-roman;"><li style="list-style: lower-roman;"><p>Three Type-5</p></li></ol></li><li><p>Four Type-5</p></li></ol></li><li><p>Five Type-5</p></li><li><p>Six Type-5</p><ol level="2" style="list-style: lower-alpha;"><li style="list-style: lower-alpha;"><p>Seven Type-5</p></li></ol></li></ol><br><ol level="1" style="list-style: decimal;"><li><p>Eight Separate Type-5</p></li><li><p>Nine Separate Type-5</p></li></ol>`;
      if (allElem[0].parentElement.innerHTML.trim().replace(/>\s+</g, '><') !== expectedElem) {
        expected = false;
      }
      expect(expected).toBe(true);
      done();
    }, 100);
  });

  it('MSWord List Conversion Type 6', (done) => {
    /*
    1.	One Node-6
      •	Two Node-6
      •	Three Node-6
    2.	Four Node-6
    */
    let localElem: string = `
    <p class='MsoListParagraphCxSpFirst' style='text-indent:-.25in;mso-list:l1 level1 lfo1'><!--[if !supportLists]--><span style='mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin'><span style='mso-list:Ignore'>1.<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><!--[endif]-->One Node-6<o:p></o:p></p>

<p class='MsoListParagraphCxSpMiddle' style='margin-left:.75in;mso-add-space:
auto;text-indent:-.25in;mso-list:l0 level1 lfo2'><!--[if !supportLists]--><span style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><!--[endif]-->Two Node-6<o:p></o:p></p>

<p class='MsoListParagraphCxSpMiddle' style='margin-left:.75in;mso-add-space:
auto;text-indent:-.25in;mso-list:l0 level1 lfo2'><!--[if !supportLists]--><span style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><!--[endif]-->Three Node-6<o:p></o:p></p>

<p class='MsoListParagraphCxSpLast' style='text-indent:-.25in;mso-list:l1 level1 lfo1'><!--[if !supportLists]--><span style='mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin'><span style='mso-list:Ignore'>2.<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><!--[endif]-->Four Node-6<o:p></o:p></p>
  `;
    keyBoardEvent.clipboardData = {
      getData: () => {
        return localElem;
      },
      items: []
    };
    (rteObj as any).inputElement.focus();
    setCursorPoint((rteObj as any).inputElement, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let allElem: any = (rteObj as any).inputElement.firstElementChild.querySelectorAll('*');
      let expected: boolean = true;
      let expectedElem: string = `<ol level="1" style="list-style: decimal;"><li><p>One Node-6</p></li></ol><ul level="1"><li><p>Two Node-6</p></li><li><p>Three Node-6</p></li></ul><ol level="1"><li><p>Four Node-6</p></li></ol>`;
      if (allElem[0].parentElement.innerHTML.trim().replace(/>\s+</g, '><') !== expectedElem) {
        expected = false;
      }
      expect(expected).toBe(true);
      done();
    }, 100);
  });

  it('MSWord List Conversion Type 7', (done) => {
    /*
      •	One Node-7
      •	Two Node-7
              o	Three Node-7
                  •	Four Node-7
        o	Five Node-7
      •	Six Node-7
    */
    let localElem: string = `
    <p class='MsoListParagraphCxSpFirst' style='text-indent:-.25in;mso-list:l0 level1 lfo1'><!--[if !supportLists]--><span style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><!--[endif]-->One Node-7<o:p></o:p></p>

<p class='MsoListParagraphCxSpMiddle' style='text-indent:-.25in;mso-list:l0 level1 lfo1'><!--[if !supportLists]--><span style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><!--[endif]-->Two Node-7<o:p></o:p></p>

<p class='MsoListParagraphCxSpMiddle' style='margin-left:2.5in;mso-add-space:
auto;text-indent:-.25in;mso-list:l0 level5 lfo1'><!--[if !supportLists]--><span style='font-family:&quot;Courier New&quot;;mso-fareast-font-family:&quot;Courier New&quot;'><span style='mso-list:Ignore'>o<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;
</span></span></span><!--[endif]-->Three Node-7<o:p></o:p></p>

<p class='MsoListParagraphCxSpMiddle' style='margin-left:3.5in;mso-add-space:
auto;text-indent:-.25in;mso-list:l0 level7 lfo1'><!--[if !supportLists]--><span style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><!--[endif]-->Four Node-7<o:p></o:p></p>

<p class='MsoListParagraphCxSpMiddle' style='margin-left:1.0in;mso-add-space:
auto;text-indent:-.25in;mso-list:l1 level2 lfo2'><!--[if !supportLists]--><span style='font-family:&quot;Courier New&quot;;mso-fareast-font-family:&quot;Courier New&quot;'><span style='mso-list:Ignore'>o<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;
</span></span></span><!--[endif]-->Five Node-7<o:p></o:p></p>

<p class='MsoListParagraphCxSpLast' style='text-indent:-.25in;mso-list:l0 level1 lfo1'><!--[if !supportLists]--><span style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><!--[endif]-->Six Node-7<o:p></o:p></p>
  `;
    keyBoardEvent.clipboardData = {
      getData: () => {
        return localElem;
      },
      items: []
    };
    (rteObj as any).inputElement.focus();
    setCursorPoint((rteObj as any).inputElement, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let allElem: any = (rteObj as any).inputElement.firstElementChild.querySelectorAll('*');
      let expected: boolean = true;
      let expectedElem: string = `<ul level="1" style="list-style: disc;"><li><p>One Node-7</p></li><li><p>Two Node-7</p><ul><li style="list-style-type: none;"><ul><li style="list-style-type: none;"><ul><li style="list-style-type: none;"><ul level="5" style="list-style: square;"><li style="list-style: square;"><p>Three Node-7</p><ul><li style="list-style-type: none;"><ul level="7" style="list-style: disc;"><li style="list-style: disc;"><p>Four Node-7</p></li></ul></li></ul></li></ul></li></ul></li></ul></li></ul></li><ul level="2" style="list-style: square;"><li><p>Five Node-7</p></li></ul><li><p>Six Node-7</p></li></ul>`;
      if (allElem[0].parentElement.innerHTML.trim().replace(/>\s+</g, '><') !== expectedElem) {
        expected = false;
      }
      expect(expected).toBe(true);
      done();
    }, 100);
  });

  it('MSWord List Conversion Type 8', (done) => {
    /*
      •	One Node-8
      •	Two Node-8
            •	Three Node-8
              o	Four Node -8
            •	Five Node-8
      •	Six Node-8
    */
    let localElem: string = `
    <p class='MsoListParagraphCxSpFirst' style='text-indent:-.25in;mso-list:l0 level1 lfo1'><!--[if !supportLists]--><span style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><!--[endif]-->One Node-8<o:p></o:p></p>

<p class='MsoListParagraphCxSpMiddle' style='text-indent:-.25in;mso-list:l0 level1 lfo1'><!--[if !supportLists]--><span style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><!--[endif]-->Two Node-8<o:p></o:p></p>

<p class='MsoListParagraphCxSpMiddle' style='margin-left:2.0in;mso-add-space:
auto;text-indent:-.25in;mso-list:l0 level4 lfo1'><!--[if !supportLists]--><span style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><!--[endif]-->Three Node-8<o:p></o:p></p>

<p class='MsoListParagraphCxSpMiddle' style='margin-left:2.5in;mso-add-space:
auto;text-indent:-.25in;mso-list:l0 level5 lfo1'><!--[if !supportLists]--><span style='font-family:&quot;Courier New&quot;;mso-fareast-font-family:&quot;Courier New&quot;'><span style='mso-list:Ignore'>o<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;
</span></span></span><!--[endif]-->Four Node -8<o:p></o:p></p>

<p class='MsoListParagraphCxSpMiddle' style='margin-left:2.0in;mso-add-space:
auto;text-indent:-.25in;mso-list:l0 level4 lfo1'><!--[if !supportLists]--><span style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><!--[endif]-->Five Node-8<o:p></o:p></p>

<p class='MsoListParagraphCxSpLast' style='text-indent:-.25in;mso-list:l0 level1 lfo1'><!--[if !supportLists]--><span style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><!--[endif]-->Six Node-8<o:p></o:p></p>
  `;
    keyBoardEvent.clipboardData = {
      getData: () => {
        return localElem;
      },
      items: []
    };
    (rteObj as any).inputElement.focus();
    setCursorPoint((rteObj as any).inputElement, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let allElem: any = (rteObj as any).inputElement.firstElementChild.querySelectorAll('*');
      let expected: boolean = true;
      let expectedElem: string = `<ul level="1" style="list-style: disc;"><li><p>One Node-8</p></li><li><p>Two Node-8</p><ul><li style="list-style-type: none;"><ul><li style="list-style-type: none;"><ul level="4" style="list-style: disc;"><li style="list-style: disc;"><p>Three Node-8</p><ul level="5" style="list-style: square;"><li style="list-style: square;"><p>Four Node -8</p></li></ul></li><li><p>Five Node-8</p></li></ul></li></ul></li></ul></li><li><p>Six Node-8</p></li></ul>`;
      if (allElem[0].parentElement.innerHTML.trim().replace(/>\s+</g, '><') !== expectedElem) {
        expected = false;
      }
      expect(expected).toBe(true);
      done();
    }, 100);
  });

  it('MSWord List Conversion Type 9', (done) => {
    /*
      1.	One Node-9
          1.	Two Node-9
          2.	Three Node-9
      •	Four Node-9
    */
    let localElem: string = `
    <p class='MsoListParagraphCxSpFirst' style='text-indent:-.25in;mso-list:l1 level1 lfo1'><!--[if !supportLists]--><span style='mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin'><span style='mso-list:Ignore'>1.<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><!--[endif]-->One Node-9<o:p></o:p></p>

<p class='MsoListParagraphCxSpMiddle' style='margin-left:1.0in;mso-add-space:
auto;text-indent:-.25in;mso-list:l1 level2 lfo1'><!--[if !supportLists]--><span style='mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin'><span style='mso-list:Ignore'>1.<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><!--[endif]-->Two Node-9<o:p></o:p></p>

<p class='MsoListParagraphCxSpMiddle' style='margin-left:1.0in;mso-add-space:
auto;text-indent:-.25in;mso-list:l1 level2 lfo1'><!--[if !supportLists]--><span style='mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin'><span style='mso-list:Ignore'>2.<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><!--[endif]-->Three Node-9<o:p></o:p></p>

<p class='MsoListParagraphCxSpLast' style='text-indent:-.25in;mso-list:l0 level1 lfo2'><!--[if !supportLists]--><span style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><!--[endif]-->Four Node-9<o:p></o:p></p>
  `;
    keyBoardEvent.clipboardData = {
      getData: () => {
        return localElem;
      },
      items: []
    };
    (rteObj as any).inputElement.focus();
    setCursorPoint((rteObj as any).inputElement, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let allElem: any = (rteObj as any).inputElement.firstElementChild.querySelectorAll('*');
      let expected: boolean = true;
      let expectedElem: string = `<ol level="1" style="list-style: decimal;"><li><p>One Node-9</p><ol level="2" style="list-style: lower-alpha;"><li style="list-style: lower-alpha;"><p>Two Node-9</p></li><li><p>Three Node-9</p></li></ol></li></ol><ul level="1" style="list-style: disc;"><li><p>Four Node-9</p></li></ul>`;
      if (allElem[0].parentElement.innerHTML.trim().replace(/>\s+</g, '><') !== expectedElem) {
        expected = false;
      }
      expect(expected).toBe(true);
      done();
    }, 100);
  });

  it('MSWord List Conversion Type 10', (done) => {
    /*
      •	One Node-10
      •	Two Node-10
      •	Three Node-10
    */
    let localElem: string = `
    <p class='MsoListParagraphCxSpFirst' style='text-indent:-.25in;mso-list:l0 level1 lfo1'><!--[if !supportLists]--><span style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><!--[endif]-->One Node-10<o:p></o:p></p>

<p class='MsoListParagraphCxSpMiddle' style='text-indent:-.25in;mso-list:l0 lfo1'><!--[if !supportLists]--><span style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><!--[endif]-->Two Node-10<o:p></o:p></p>

<p class='MsoListParagraphCxSpLast' style='text-indent:-.25in;mso-list:l0 level1 lfo1'><!--[if !supportLists]--><span style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><!--[endif]-->Three Node-10<o:p></o:p></p>
  `;
    keyBoardEvent.clipboardData = {
      getData: () => {
        return localElem;
      },
      items: []
    };
    (rteObj as any).inputElement.focus();
    setCursorPoint((rteObj as any).inputElement, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let allElem: any = (rteObj as any).inputElement.firstElementChild.querySelectorAll('*');
      let expected: boolean = true;
      let expectedElem: string = `<ul level="1" style="list-style: disc;"><li><p>One Node-10</p></li><li><p>Two Node-10</p></li><li><p>Three Node-10</p></li></ul>`;
      if (allElem[0].parentElement.innerHTML.trim().replace(/>\s+</g, '><') !== expectedElem) {
        expected = false;
      }
      expect(expected).toBe(true);
      done();
    }, 100);
  });

  it('MSWord List Conversion Type 11', (done) => {
    /*
      •	One Node-10
      •	Two Node-10
      •	Three Node-10
    */
    let localElem: string = `
    <p class='MsoListParagraphCxSpFirst' style='text-indent:-.25in;mso-list:l0 level1 lfo1'><!--[if !supportLists]--><span style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><!--[endif]-->One Node-10<o:p></o:p></p>
<h2></h2>
<p class='MsoListParagraphCxSpMiddle' style='text-indent:-.25in;mso-list:l0 lfo1'><!--[if !supportLists]--><span style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><!--[endif]-->Two Node-10<o:p></o:p></p>

<p class='MsoListParagraphCxSpLast' style='text-indent:-.25in;mso-list:l0 level1 lfo1'><!--[if !supportLists]--><span style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><!--[endif]-->Three Node-10<o:p></o:p></p>
  `;
    keyBoardEvent.clipboardData = {
      getData: () => {
        return localElem;
      },
      items: []
    };
    (rteObj as any).inputElement.focus();
    setCursorPoint((rteObj as any).inputElement, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let allElem: any = (rteObj as any).inputElement.firstElementChild.querySelectorAll('*');
      let expected: boolean = true;
      let expectedElem: string = `<ul level="1" style="list-style: disc;"><li><p>One Node-10</p></li></ul><ul level="1" style="list-style: disc;"><li><p>Two Node-10</p></li><li><p>Three Node-10</p></li></ul>`;
      if (allElem[0].parentElement.innerHTML.trim().replace(/>\s+</g, '><') !== expectedElem) {
        expected = false;
      }
      expect(expected).toBe(true);
      done();
    }, 100);
  });

  it('MSWord List Conversion Type 12', (done) => {
    /*
      •	One Node-10
      •	Two Node-10
      •	Three Node-10
    */
    let localElem: string = `
    <ul level="1" style="list-style: disc;"><li>One Node-10</li></ul><h2></h2><ul level="1" style="list-style: disc;"><li>Two Node-10</li><li>Three Node-10</li></ul>
  `;
    keyBoardEvent.clipboardData = {
      getData: () => {
        return localElem;
      },
      items: []
    };
    (rteObj as any).inputElement.focus();
    setCursorPoint((rteObj as any).inputElement, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let allElem: any = (rteObj as any).inputElement.firstElementChild.querySelectorAll('*');
      let expected: boolean = true;
      let expectedElem: string = `<ul level="1" style="list-style: disc;"><li>One Node-10</li></ul><h2></h2><ul level="1" style="list-style: disc;"><li>Two Node-10</li><li>Three Node-10</li></ul>`;
      if (allElem[0].parentElement.innerHTML.trim().replace(/>\s+</g, '><') !== expectedElem) {
        expected = false;
      }
      expect(expected).toBe(true);
      done();
    }, 100);
  });

  it('Paste content from Excel along with Col group', (done) => {
    let localElem: string = `<html xmlns:v="urn:schemas-microsoft-com:vml"
    xmlns:o="urn:schemas-microsoft-com:office:office"
    xmlns:x="urn:schemas-microsoft-com:office:excel"
    xmlns="http://www.w3.org/TR/REC-html40">
    
    <head>
    <meta http-equiv=Content-Type content="text/html; charset=utf-8">
    <meta name=ProgId content=Excel.Sheet>
    <meta name=Generator content="Microsoft Excel 15">
    <link id=Main-File rel=Main-File
    href="file:///C:/Users/REVANT~2/AppData/Local/Temp/msohtmlclip1/01/clip.htm">
    <link rel=File-List
    href="file:///C:/Users/REVANT~2/AppData/Local/Temp/msohtmlclip1/01/clip_filelist.xml">
    <style>
    <!--table
      {mso-displayed-decimal-separator:"\.";
      mso-displayed-thousand-separator:"\,";}
    @page
      {margin:.75in .7in .75in .7in;
      mso-header-margin:.3in;
      mso-footer-margin:.3in;}
    tr
      {mso-height-source:auto;}
    col
      {mso-width-source:auto;}
    br
      {mso-data-placement:same-cell;}
    td
      {padding-top:1px;
      padding-right:1px;
      padding-left:1px;
      mso-ignore:padding;
      color:black;
      font-size:11.0pt;
      font-weight:400;
      font-style:normal;
      text-decoration:none;
      font-family:Calibri, sans-serif;
      mso-font-charset:0;
      mso-number-format:General;
      text-align:general;
      vertical-align:bottom;
      border:none;
      mso-background-source:auto;
      mso-pattern:auto;
      mso-protection:locked visible;
      white-space:nowrap;
      mso-rotate:0;}
    .xl65
      {border-top:.5pt solid black;
      border-right:1.0pt solid windowtext;
      border-bottom:.5pt solid black;
      border-left:.5pt solid black;
      background:#D9D9D9;
      mso-pattern:#D9D9D9 none;}
    .xl66
      {border:.5pt solid black;
      background:#D9D9D9;
      mso-pattern:#D9D9D9 none;}
    .xl67
      {mso-number-format:0;
      border:.5pt solid black;
      background:#D9D9D9;
      mso-pattern:#D9D9D9 none;}
    .xl68
      {border-top:.5pt solid black;
      border-right:1.0pt solid windowtext;
      border-bottom:.5pt solid black;
      border-left:.5pt solid black;}
    .xl69
      {border:.5pt solid black;}
    .xl70
      {mso-number-format:0;
      border:.5pt solid black;}
    -->
    </style>
    </head>
    
    <body link="#0563C1" vlink="#954F72">
    
    <table border=0 cellpadding=0 cellspacing=0 width=425 style='border-collapse:
     collapse;width:319pt'>
    <!--StartFragment-->
     <col width=233 style='mso-width-source:userset;mso-width-alt:8145;width:175pt'>
     <col width=64 span=3 style='width:48pt'>
     <tr height=19 style='height:14.5pt'>
      <td height=19 class=xl65 width=233 style='height:14.5pt;width:175pt'>Hauptansicht
      mit Panelverwaltung</td>
      <td class=xl66 align=right width=64 style='width:48pt'>10</td>
      <td class=xl66 align=right width=64 style='border-left:none;width:48pt'>84</td>
      <td class=xl67 align=right width=64 style='border-left:none;width:48pt'>0</td>
     </tr>
     <tr height=19 style='height:14.5pt'>
      <td height=19 class=xl68 style='height:14.5pt;border-top:none'>Bericht</td>
      <td class=xl69 align=right style='border-top:none'>20</td>
      <td class=xl69 align=right style='border-top:none;border-left:none'>168</td>
      <td class=xl70 align=right style='border-top:none;border-left:none'>0</td>
     </tr>
     <tr height=19 style='height:14.5pt'>
      <td height=19 class=xl65 style='height:14.5pt;border-top:none'>Filterauswahl</td>
      <td class=xl66 align=right style='border-top:none'>5</td>
      <td class=xl66 align=right style='border-top:none;border-left:none'>42</td>
      <td class=xl67 align=right style='border-top:none;border-left:none'>0</td>
     </tr>
    <!--EndFragment-->
    </table>
    
    </body>
    
    </html>`;
    keyBoardEvent.clipboardData = {
      getData: () => {
        return localElem;
      },
      items: []
    };
    (rteObj as any).inputElement.focus();
    setCursorPoint((rteObj as any).inputElement, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let cleanFormat: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_REMOVE_FORMAT);
        cleanFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let allElem: any = (rteObj as any).inputElement.firstElementChild.querySelectorAll('*');
      let expected: boolean = false;
      let expectedElem: string = `<table border="0" cellpadding="0" cellspacing="0" width="425"><tbody><tr height="19"><td height="19" width="233">Hauptansicht
      mit Panelverwaltung</td><td align="right" width="64">10</td><td align="right" width="64">84</td><td align="right" width="64">0</td></tr><tr height="19"><td height="19">Bericht</td><td align="right">20</td><td align="right">168</td><td align="right">0</td></tr><tr height="19"><td height="19">Filterauswahl</td><td align="right">5</td><td align="right">42</td><td align="right">0</td></tr></tbody></table>`;
      if (allElem[0].parentElement.innerHTML.trim().replace(/>\s+</g, '><') === expectedElem) {
        expected = true;
      }
      expect(expected).toBe(true);
      done();
    }, 100);
  });

  it('EJ2-26590 - Pasting Content from word does prompt the paste dialog', (done) => {
    let localElem: string = `
    <p class='MsoListParagraph' style='text-indent:-.25in;mso-list:l0 level1 lfo1'><!--[if !supportLists]--><span style='mso-ascii-font-family:Calibri;mso-fareast-font-family:Calibri;
mso-hansi-font-family:Calibri;mso-bidi-font-family:Calibri'><span style='mso-list:Ignore'>-<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><!--[endif]-->Para 1 <o:p></o:p></p>
<p class='MsoNormal'><o:p>&nbsp;</o:p></p>
<h1>Head 1 <o:p></o:p></h1>
<p class='MsoListParagraph' style='margin-left:1.25in;mso-add-space:auto'><o:p>&nbsp;</o:p></p>
<table class='MsoTableGrid' border='1' cellspacing='0' cellpadding='0' style='border-collapse:collapse;border:none;mso-border-alt:solid windowtext .5pt;mso-yfti-tbllook:1184;mso-padding-alt:0in 5.4pt 0in 5.4pt'>
 <tbody><tr style='mso-yfti-irow:0;mso-yfti-firstrow:yes;mso-yfti-lastrow:yes'>
  <td width='312' valign='top' style='width:233.75pt;border:solid windowtext 1.0pt;mso-border-alt:solid windowtext .5pt;padding:0in 5.4pt 0in 5.4pt'>
  <p class='MsoNormal' style='margin-top:0in;margin-right:0in;margin-bottom:0in;margin-left:1.0in;margin-bottom:.0001pt;line-height:normal'>T-1<o:p></o:p></p>
  </td>
  <td width='312' valign='top' style='width:233.75pt;border:solid windowtext 1.0pt;border-left:none;mso-border-left-alt:solid windowtext .5pt;mso-border-alt:solid windowtext .5pt;padding:0in 5.4pt 0in 5.4pt'>
  <p class='MsoNormal' style='margin-bottom:0in;margin-bottom:.0001pt;line-height:normal'>T-2<o:p></o:p></p>
  </td>
  <td width='312' valign='top' style='width:233.75pt;border:solid windowtext 1.0pt; border-left:none;mso-border-left-alt:solid windowtext .5pt;mso-border-alt:solid windowtext .5pt;padding:0in 5.4pt 0in 5.4pt'>
  <p class='MsoNormal' style='margin-bottom:0in;margin-bottom:.0001pt;line-height:normal'>T-3 <o:p></o:p></p>
  </td>
 </tr></tbody>
</table>
  `;
    keyBoardEvent.clipboardData = {
      getData: () => {
        return localElem;
      },
      items: []
    };
    (rteObj as any).inputElement.focus();
    setCursorPoint((rteObj as any).inputElement, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let allElem: any = (rteObj as any).inputElement.firstElementChild.querySelectorAll('*');
      let expected: boolean = true;
      let expectedElem: string = `<ul level="1" style="list-style: disc;"><li><p>Para 1 </p></li></ul><br><h1>Head 1 </h1><table border="1" cellspacing="0" cellpadding="0" style="border:none;"><tbody><tr><td width="312" valign="top" style="width:233.75pt;border:solid windowtext 1.0pt;padding:0in 5.4pt 0in 5.4pt;"><p style="margin-top:0in;margin-right:0in;margin-bottom:0in;margin-left:1.0in;margin-bottom:.0001pt;line-height:normal;">T-1</p></td><td width="312" valign="top" style="width:233.75pt;border:solid windowtext 1.0pt;border-left:none;padding:0in 5.4pt 0in 5.4pt;"><p style="margin-bottom:0in;margin-bottom:.0001pt;line-height:normal;">T-2</p></td><td width="312" valign="top" style="width:233.75pt;border:solid windowtext 1.0pt; border-left:none;padding:0in 5.4pt 0in 5.4pt;"><p style="margin-bottom:0in;margin-bottom:.0001pt;line-height:normal;">T-3 </p></td></tr></tbody></table>`
      if (allElem[0].parentElement.innerHTML.trim().replace(/>\s+</g, '><') !== expectedElem) {
        expected = false;
      }
      expect(expected).toBe(true);
      done();
    }, 100);
  });

  it('Paste from Word feature', (done) => {
    let localElem: string = `
    <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
<meta name='ProgId' content='Word.Document'>
<meta name='Generator' content='Microsoft Word 15'>
<meta name='Originator' content='Microsoft Word 15'>
<style>
<!--
 /* Font Definitions */
 @font-face
	{font-family:'Cambria Math';
	panose-1:2 4 5 3 5 4 6 3 2 4;
	mso-font-charset:0;
	mso-generic-font-family:roman;
	mso-font-pitch:variable;
	mso-font-signature:3 0 0 0 1 0;}
@font-face
	{font-family:Calibri;
	panose-1:2 15 5 2 2 2 4 3 2 4;
	mso-font-charset:0;
	mso-generic-font-family:swiss;
	mso-font-pitch:variable;
	mso-font-signature:-536858881 -1073732485 9 0 511 0;}
@font-face
	{font-family:'Calibri Light';
	panose-1:2 15 3 2 2 2 4 3 2 4;
	mso-font-charset:0;
	mso-generic-font-family:swiss;
	mso-font-pitch:variable;
	mso-font-signature:-536859905 -1073732485 9 0 511 0;}
@font-face
	{font-family:Algerian;
	panose-1:4 2 7 5 4 10 2 6 7 2;
	mso-font-charset:0;
	mso-generic-font-family:decorative;
	mso-font-pitch:variable;
	mso-font-signature:3 0 0 0 1 0;}
 /* Style Definitions */
 p.MsoNormal, li.MsoNormal, div.MsoNormal
	{mso-style-unhide:no;
	mso-style-qformat:yes;
	mso-style-parent:'';
	margin-top:0in;
	margin-right:0in;
	margin-bottom:8.0pt;
	margin-left:0in;
	line-height:107%;
	mso-pagination:widow-orphan;
	font-size:11.0pt;
	font-family:'Calibri',sans-serif;
	mso-ascii-font-family:Calibri;
	mso-ascii-theme-font:minor-latin;
	mso-fareast-font-family:Calibri;
	mso-fareast-theme-font:minor-latin;
	mso-hansi-font-family:Calibri;
	mso-hansi-theme-font:minor-latin;
	mso-bidi-font-family:'Times New Roman';
	mso-bidi-theme-font:minor-bidi;}
h1
	{mso-style-priority:9;
	mso-style-unhide:no;
	mso-style-qformat:yes;
	mso-style-link:'Heading 1 Char';
	mso-style-next:Normal;
	margin-top:12.0pt;
	margin-right:0in;
	margin-bottom:0in;
	margin-left:0in;
	margin-bottom:.0001pt;
	line-height:107%;
	mso-pagination:widow-orphan lines-together;
	page-break-after:avoid;
	mso-outline-level:1;
	font-size:16.0pt;
	font-family:'Calibri Light',sans-serif;
	mso-ascii-font-family:'Calibri Light';
	mso-ascii-theme-font:major-latin;
	mso-fareast-font-family:'Times New Roman';
	mso-fareast-theme-font:major-fareast;
	mso-hansi-font-family:'Calibri Light';
	mso-hansi-theme-font:major-latin;
	mso-bidi-font-family:'Times New Roman';
	mso-bidi-theme-font:major-bidi;
	color:#2F5496;
	mso-themecolor:accent1;
	mso-themeshade:191;
	mso-font-kerning:0pt;
	font-weight:normal;}
span.Heading1Char
	{mso-style-name:'Heading 1 Char';
	mso-style-priority:9;
	mso-style-unhide:no;
	mso-style-locked:yes;
	mso-style-link:'Heading 1';
	mso-ansi-font-size:16.0pt;
	mso-bidi-font-size:16.0pt;
	font-family:'Calibri Light',sans-serif;
	mso-ascii-font-family:'Calibri Light';
	mso-ascii-theme-font:major-latin;
	mso-fareast-font-family:'Times New Roman';
	mso-fareast-theme-font:major-fareast;
	mso-hansi-font-family:'Calibri Light';
	mso-hansi-theme-font:major-latin;
	mso-bidi-font-family:'Times New Roman';
	mso-bidi-theme-font:major-bidi;
	color:#2F5496;
	mso-themecolor:accent1;
	mso-themeshade:191;}
.MsoChpDefault
	{mso-style-type:export-only;
	mso-default-props:yes;
	font-family:'Calibri',sans-serif;
	mso-ascii-font-family:Calibri;
	mso-ascii-theme-font:minor-latin;
	mso-fareast-font-family:Calibri;
	mso-fareast-theme-font:minor-latin;
	mso-hansi-font-family:Calibri;
	mso-hansi-theme-font:minor-latin;
	mso-bidi-font-family:'Times New Roman';
	mso-bidi-theme-font:minor-bidi;}
.MsoPapDefault
	{mso-style-type:export-only;
	margin-bottom:8.0pt;
	line-height:107%;}
@page WordSection1
	{size:8.5in 11.0in;
	margin:1.0in 1.0in 1.0in 1.0in;
	mso-header-margin:.5in;
	mso-footer-margin:.5in;
	mso-paper-source:0;}
div.WordSection1
	{page:WordSection1;}
-->
</style>
<!--[if gte mso 10]>
<style>
 /* Style Definitions */
 table.MsoNormalTable
	{mso-style-name:'Table Normal';
	mso-tstyle-rowband-size:0;
	mso-tstyle-colband-size:0;
	mso-style-noshow:yes;
	mso-style-priority:99;
	mso-style-parent:'';
	mso-padding-alt:0in 5.4pt 0in 5.4pt;
	mso-para-margin-top:0in;
	mso-para-margin-right:0in;
	mso-para-margin-bottom:8.0pt;
	mso-para-margin-left:0in;
	line-height:107%;
	mso-pagination:widow-orphan;
	font-size:11.0pt;
	font-family:'Calibri',sans-serif;
	mso-ascii-font-family:Calibri;
	mso-ascii-theme-font:minor-latin;
	mso-hansi-font-family:Calibri;
	mso-hansi-theme-font:minor-latin;
	mso-bidi-font-family:'Times New Roman';
	mso-bidi-theme-font:minor-bidi;}
</style>
<![endif]-->



<!--StartFragment-->

<h1>Heading 1<o:p></o:p></h1>

<p class='MsoNormal'>Normal Text content <span style='color:red'>red color </span><span style='color:yellow'>yellow color </span><span style='font-size:23.0pt;
line-height:107%'>font size 23</span> <b style='mso-bidi-font-weight:normal'>bold
text</b> <i style='mso-bidi-font-style:normal'>italic text</i> <span style='font-family:Algerian'>font family text</span> <o:p></o:p></p>

<!--EndFragment-->`;
    keyBoardEvent.clipboardData = {
      getData: () => {
        return localElem;
      },
      items: []
    };
    (rteObj as any).inputElement.focus();
    setCursorPoint((rteObj as any).inputElement, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let allElem: any = (rteObj as any).inputElement.firstElementChild.querySelectorAll('*');
      let expected: boolean = true;
      let expectedElem: string = `<h1 style="margin-top:12.0pt;margin-right:0in;margin-bottom:0in;margin-left:0in;margin-bottom:.0001pt;line-height:107%;font-size:16.0pt;font-family:'Calibri Light',sans-serif;color:#2F5496;font-weight:normal;">Heading 1</h1><p style="margin-top:0in;margin-right:0in;margin-bottom:8.0pt;margin-left:0in;line-height:107%;font-size:11.0pt;font-family:'Calibri',sans-serif;">Normal Text content <span style="color:red;">red color </span><span style="color:yellow;">yellow color </span><span style="font-size:23.0pt;
line-height:107%;">font size 23</span><b>bold
text</b><i>italic text</i><span style="font-family:Algerian;">font family text</span></p>`;
      if (allElem[0].parentElement.innerHTML.trim().replace(/>\s+</g, '><') !== expectedElem) {
        expected = false;
      }
      expect(expected).toBe(true);
      done();
    }, 100);
  });

  it('Tab style not applied issue', (done) => {
    let localElem: string = `<html xmlns:o='urn:schemas-microsoft-com:office:office'
    xmlns:w='urn:schemas-microsoft-com:office:word'
    xmlns:m='http://schemas.microsoft.com/office/2004/12/omml'
    xmlns='http://www.w3.org/TR/REC-html40'>
    
    <head>
    <style>
    <!--
     /* Font Definitions */
     @font-face
      {font-family:'Cambria Math';
      panose-1:2 4 5 3 5 4 6 3 2 4;
      mso-font-charset:0;
      mso-generic-font-family:roman;
      mso-font-pitch:variable;
      mso-font-signature:3 0 0 0 1 0;}
    @font-face
      {font-family:Calibri;
      panose-1:2 15 5 2 2 2 4 3 2 4;
      mso-font-charset:0;
      mso-generic-font-family:swiss;
      mso-font-pitch:variable;
      mso-font-signature:-536858881 -1073732485 9 0 511 0;}
     /* Style Definitions */
     p.MsoNormal, li.MsoNormal, div.MsoNormal
      {mso-style-unhide:no;
      mso-style-qformat:yes;
      mso-style-parent:'';
      margin-top:0in;
      margin-right:0in;
      margin-bottom:8.0pt;
      margin-left:0in;
      line-height:107%;
      mso-pagination:widow-orphan;
      font-size:11.0pt;
      font-family:'Calibri',sans-serif;
      mso-ascii-font-family:Calibri;
      mso-ascii-theme-font:minor-latin;
      mso-fareast-font-family:Calibri;
      mso-fareast-theme-font:minor-latin;
      mso-hansi-font-family:Calibri;
      mso-hansi-theme-font:minor-latin;
      mso-bidi-font-family:'Times New Roman';
      mso-bidi-theme-font:minor-bidi;}
    .MsoChpDefault
      {mso-style-type:export-only;
      mso-default-props:yes;
      font-family:'Calibri',sans-serif;
      mso-ascii-font-family:Calibri;
      mso-ascii-theme-font:minor-latin;
      mso-fareast-font-family:Calibri;
      mso-fareast-theme-font:minor-latin;
      mso-hansi-font-family:Calibri;
      mso-hansi-theme-font:minor-latin;
      mso-bidi-font-family:'Times New Roman';
      mso-bidi-theme-font:minor-bidi;}
    .MsoPapDefault
      {mso-style-type:export-only;
      margin-bottom:8.0pt;
      line-height:107%;}
    @page WordSection1
      {size:8.5in 11.0in;
      margin:1.0in 1.0in 1.0in 1.0in;
      mso-header-margin:.5in;
      mso-footer-margin:.5in;
      mso-paper-source:0;}
    div.WordSection1
      {page:WordSection1;}
    -->
    </style>
    <!--[if gte mso 10]>
    <style>
     /* Style Definitions */
     table.MsoNormalTable
      {mso-style-name:'Table Normal';
      mso-tstyle-rowband-size:0;
      mso-tstyle-colband-size:0;
      mso-style-noshow:yes;
      mso-style-priority:99;
      mso-style-parent:'';
      mso-padding-alt:0in 5.4pt 0in 5.4pt;
      mso-para-margin-top:0in;
      mso-para-margin-right:0in;
      mso-para-margin-bottom:8.0pt;
      mso-para-margin-left:0in;
      line-height:107%;
      mso-pagination:widow-orphan;
      font-size:11.0pt;
      font-family:'Calibri',sans-serif;
      mso-ascii-font-family:Calibri;
      mso-ascii-theme-font:minor-latin;
      mso-hansi-font-family:Calibri;
      mso-hansi-theme-font:minor-latin;
      mso-bidi-font-family:'Times New Roman';
      mso-bidi-theme-font:minor-bidi;}
    </style>
    <![endif]-->
    </head>
    
    <body lang=EN-US style='tab-interval:.5in'>
    <!--StartFragment-->
    
    <p class=MsoNormal>Tab<o:p></o:p></p>
    
    <p class=MsoNormal style='text-indent:.5in'>Tab 1<o:p></o:p></p>
    
    <p class=MsoNormal style='margin-left:.5in;text-indent:.5in'>Tab 2<o:p></o:p></p>
    
    <p class=MsoNormal style='margin-left:1.0in;text-indent:.5in'>Tab 3<o:p></o:p></p>
    
    <p class=MsoNormal style='margin-left:1.5in;text-indent:.5in'>Tab 4<o:p></o:p></p>
    
    <!--EndFragment-->
    </body>
    
    </html>
    `;
    keyBoardEvent.clipboardData = {
      getData: () => {
        return localElem;
      },
      items: []
    };
    (rteObj as any).inputElement.focus();
    setCursorPoint((rteObj as any).inputElement, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let allElem: any = (rteObj as any).inputElement.firstElementChild.querySelectorAll('*');
      let expected: boolean = true;
      let expectedElem: string = `<p>Tab</p><p style="text-indent:.5in;">Tab 1</p><p style="margin-left:.5in;text-indent:.5in;">Tab 2</p><p style="margin-left:1.0in;text-indent:.5in;">Tab 3</p><p style="margin-left:1.5in;text-indent:.5in;">Tab 4</p>`;
      if (allElem[0].parentElement.innerHTML.trim().replace(/>\s+</g, '><') !== expectedElem) {
        expected = false;
      }
      expect(expected).toBe(true);
      done();
    }, 100);
  });

  it('One line aligned to right ', (done) => {
    let localElem: string = `<html xmlns:o='urn:schemas-microsoft-com:office:office'
    xmlns:w='urn:schemas-microsoft-com:office:word'
    xmlns:m='http://schemas.microsoft.com/office/2004/12/omml'
    xmlns='http://www.w3.org/TR/REC-html40'>
    
    <head>
    <style>
    <!--
     /* Font Definitions */
     @font-face
      {font-family:'Cambria Math';
      panose-1:2 4 5 3 5 4 6 3 2 4;
      mso-font-charset:0;
      mso-generic-font-family:roman;
      mso-font-pitch:variable;
      mso-font-signature:3 0 0 0 1 0;}
    @font-face
      {font-family:Calibri;
      panose-1:2 15 5 2 2 2 4 3 2 4;
      mso-font-charset:0;
      mso-generic-font-family:swiss;
      mso-font-pitch:variable;
      mso-font-signature:-536858881 -1073732485 9 0 511 0;}
     /* Style Definitions */
     p.MsoNormal, li.MsoNormal, div.MsoNormal
      {mso-style-unhide:no;
      mso-style-qformat:yes;
      mso-style-parent:'';
      margin-top:0in;
      margin-right:0in;
      margin-bottom:8.0pt;
      margin-left:0in;
      line-height:107%;
      mso-pagination:widow-orphan;
      font-size:11.0pt;
      font-family:'Calibri',sans-serif;
      mso-ascii-font-family:Calibri;
      mso-ascii-theme-font:minor-latin;
      mso-fareast-font-family:Calibri;
      mso-fareast-theme-font:minor-latin;
      mso-hansi-font-family:Calibri;
      mso-hansi-theme-font:minor-latin;
      mso-bidi-font-family:'Times New Roman';
      mso-bidi-theme-font:minor-bidi;}
    .MsoChpDefault
      {mso-style-type:export-only;
      mso-default-props:yes;
      font-family:'Calibri',sans-serif;
      mso-ascii-font-family:Calibri;
      mso-ascii-theme-font:minor-latin;
      mso-fareast-font-family:Calibri;
      mso-fareast-theme-font:minor-latin;
      mso-hansi-font-family:Calibri;
      mso-hansi-theme-font:minor-latin;
      mso-bidi-font-family:'Times New Roman';
      mso-bidi-theme-font:minor-bidi;}
    .MsoPapDefault
      {mso-style-type:export-only;
      margin-bottom:8.0pt;
      line-height:107%;}
    @page WordSection1
      {size:8.5in 11.0in;
      margin:1.0in 1.0in 1.0in 1.0in;
      mso-header-margin:.5in;
      mso-footer-margin:.5in;
      mso-paper-source:0;}
    div.WordSection1
      {page:WordSection1;}
    -->
    </style>
    <!--[if gte mso 10]>
    <style>
     /* Style Definitions */
     table.MsoNormalTable
      {mso-style-name:'Table Normal';
      mso-tstyle-rowband-size:0;
      mso-tstyle-colband-size:0;
      mso-style-noshow:yes;
      mso-style-priority:99;
      mso-style-parent:'';
      mso-padding-alt:0in 5.4pt 0in 5.4pt;
      mso-para-margin-top:0in;
      mso-para-margin-right:0in;
      mso-para-margin-bottom:8.0pt;
      mso-para-margin-left:0in;
      line-height:107%;
      mso-pagination:widow-orphan;
      font-size:11.0pt;
      font-family:'Calibri',sans-serif;
      mso-ascii-font-family:Calibri;
      mso-ascii-theme-font:minor-latin;
      mso-hansi-font-family:Calibri;
      mso-hansi-theme-font:minor-latin;
      mso-bidi-font-family:'Times New Roman';
      mso-bidi-theme-font:minor-bidi;}
    </style>
    <![endif]-->
    </head>
    
    <body lang=EN-US style='tab-interval:.5in'>
    <!--StartFragment-->
    
    <p class=MsoNormal>First line to left<o:p></o:p></p>
    
    <p class=MsoNormal align=right style='text-align:right'>Second line to right<o:p></o:p></p>
    
    <p class=MsoNormal>Third line to left<o:p></o:p></p>
    
    <!--EndFragment-->
    </body>
    
    </html>
    `;
    keyBoardEvent.clipboardData = {
      getData: () => {
        return localElem;
      },
      items: []
    };
    (rteObj as any).inputElement.focus();
    setCursorPoint((rteObj as any).inputElement, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let allElem: any = (rteObj as any).inputElement.firstElementChild.querySelectorAll('*');
      let expected: boolean = true;
      let expectedElem: string = `<p>First line to left</p><p align="right" style="text-align:right;">Second line to right</p><p>Third line to left</p>`;
      if (allElem[0].parentElement.innerHTML.trim().replace(/>\s+</g, '><') !== expectedElem) {
        expected = false;
      }
      expect(expected).toBe(true);
      done();
    }, 100);
  });
  
  it('Only one heading ', (done) => {
    let localElem: string = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
    xmlns:w="urn:schemas-microsoft-com:office:word"
    xmlns:m="http://schemas.microsoft.com/office/2004/12/omml"
    xmlns="http://www.w3.org/TR/REC-html40">
    
    <head>
    <meta http-equiv=Content-Type content="text/html; charset=utf-8">
    <meta name=ProgId content=Word.Document>
    <meta name=Generator content="Microsoft Word 15">
    <meta name=Originator content="Microsoft Word 15">
    <link rel=File-List
    href="file:///C:/Users/REVANT~2/AppData/Local/Temp/msohtmlclip1/01/clip_filelist.xml">
    <!--[if gte mso 9]><xml>
     <o:OfficeDocumentSettings>
      <o:AllowPNG/>
     </o:OfficeDocumentSettings>
    </xml><![endif]-->
    <link rel=themeData
    href="file:///C:/Users/REVANT~2/AppData/Local/Temp/msohtmlclip1/01/clip_themedata.thmx">
    <link rel=colorSchemeMapping
    href="file:///C:/Users/REVANT~2/AppData/Local/Temp/msohtmlclip1/01/clip_colorschememapping.xml">
    <!--[if gte mso 9]><xml>
     <w:WordDocument>
      <w:View>Normal</w:View>
      <w:Zoom>0</w:Zoom>
      <w:TrackMoves/>
      <w:TrackFormatting/>
      <w:PunctuationKerning/>
      <w:ValidateAgainstSchemas/>
      <w:SaveIfXMLInvalid>false</w:SaveIfXMLInvalid>
      <w:IgnoreMixedContent>false</w:IgnoreMixedContent>
      <w:AlwaysShowPlaceholderText>false</w:AlwaysShowPlaceholderText>
      <w:DoNotPromoteQF/>
      <w:LidThemeOther>EN-US</w:LidThemeOther>
      <w:LidThemeAsian>X-NONE</w:LidThemeAsian>
      <w:LidThemeComplexScript>X-NONE</w:LidThemeComplexScript>
      <w:Compatibility>
       <w:BreakWrappedTables/>
       <w:SnapToGridInCell/>
       <w:WrapTextWithPunct/>
       <w:UseAsianBreakRules/>
       <w:DontGrowAutofit/>
       <w:SplitPgBreakAndParaMark/>
       <w:EnableOpenTypeKerning/>
       <w:DontFlipMirrorIndents/>
       <w:OverrideTableStyleHps/>
      </w:Compatibility>
      <m:mathPr>
       <m:mathFont m:val="Cambria Math"/>
       <m:brkBin m:val="before"/>
       <m:brkBinSub m:val="&#45;-"/>
       <m:smallFrac m:val="off"/>
       <m:dispDef/>
       <m:lMargin m:val="0"/>
       <m:rMargin m:val="0"/>
       <m:defJc m:val="centerGroup"/>
       <m:wrapIndent m:val="1440"/>
       <m:intLim m:val="subSup"/>
       <m:naryLim m:val="undOvr"/>
      </m:mathPr></w:WordDocument>
    </xml><![endif]--><!--[if gte mso 9]><xml>
     <w:LatentStyles DefLockedState="false" DefUnhideWhenUsed="false"
      DefSemiHidden="false" DefQFormat="false" DefPriority="99"
      LatentStyleCount="375">
      <w:LsdException Locked="false" Priority="0" QFormat="true" Name="Normal"/>
      <w:LsdException Locked="false" Priority="9" QFormat="true" Name="heading 1"/>
      <w:LsdException Locked="false" Priority="9" SemiHidden="true"
       UnhideWhenUsed="true" QFormat="true" Name="heading 2"/>
      <w:LsdException Locked="false" Priority="9" SemiHidden="true"
       UnhideWhenUsed="true" QFormat="true" Name="heading 3"/>
      <w:LsdException Locked="false" Priority="9" SemiHidden="true"
       UnhideWhenUsed="true" QFormat="true" Name="heading 4"/>
      <w:LsdException Locked="false" Priority="9" SemiHidden="true"
       UnhideWhenUsed="true" QFormat="true" Name="heading 5"/>
      <w:LsdException Locked="false" Priority="9" SemiHidden="true"
       UnhideWhenUsed="true" QFormat="true" Name="heading 6"/>
      <w:LsdException Locked="false" Priority="9" SemiHidden="true"
       UnhideWhenUsed="true" QFormat="true" Name="heading 7"/>
      <w:LsdException Locked="false" Priority="9" SemiHidden="true"
       UnhideWhenUsed="true" QFormat="true" Name="heading 8"/>
      <w:LsdException Locked="false" Priority="9" SemiHidden="true"
       UnhideWhenUsed="true" QFormat="true" Name="heading 9"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="index 1"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="index 2"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="index 3"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="index 4"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="index 5"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="index 6"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="index 7"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="index 8"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="index 9"/>
      <w:LsdException Locked="false" Priority="39" SemiHidden="true"
       UnhideWhenUsed="true" Name="toc 1"/>
      <w:LsdException Locked="false" Priority="39" SemiHidden="true"
       UnhideWhenUsed="true" Name="toc 2"/>
      <w:LsdException Locked="false" Priority="39" SemiHidden="true"
       UnhideWhenUsed="true" Name="toc 3"/>
      <w:LsdException Locked="false" Priority="39" SemiHidden="true"
       UnhideWhenUsed="true" Name="toc 4"/>
      <w:LsdException Locked="false" Priority="39" SemiHidden="true"
       UnhideWhenUsed="true" Name="toc 5"/>
      <w:LsdException Locked="false" Priority="39" SemiHidden="true"
       UnhideWhenUsed="true" Name="toc 6"/>
      <w:LsdException Locked="false" Priority="39" SemiHidden="true"
       UnhideWhenUsed="true" Name="toc 7"/>
      <w:LsdException Locked="false" Priority="39" SemiHidden="true"
       UnhideWhenUsed="true" Name="toc 8"/>
      <w:LsdException Locked="false" Priority="39" SemiHidden="true"
       UnhideWhenUsed="true" Name="toc 9"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Normal Indent"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="footnote text"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="annotation text"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="header"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="footer"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="index heading"/>
      <w:LsdException Locked="false" Priority="35" SemiHidden="true"
       UnhideWhenUsed="true" QFormat="true" Name="caption"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="table of figures"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="envelope address"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="envelope return"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="footnote reference"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="annotation reference"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="line number"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="page number"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="endnote reference"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="endnote text"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="table of authorities"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="macro"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="toa heading"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="List"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="List Bullet"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="List Number"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="List 2"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="List 3"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="List 4"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="List 5"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="List Bullet 2"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="List Bullet 3"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="List Bullet 4"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="List Bullet 5"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="List Number 2"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="List Number 3"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="List Number 4"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="List Number 5"/>
      <w:LsdException Locked="false" Priority="10" QFormat="true" Name="Title"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Closing"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Signature"/>
      <w:LsdException Locked="false" Priority="1" SemiHidden="true"
       UnhideWhenUsed="true" Name="Default Paragraph Font"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Body Text"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Body Text Indent"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="List Continue"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="List Continue 2"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="List Continue 3"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="List Continue 4"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="List Continue 5"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Message Header"/>
      <w:LsdException Locked="false" Priority="11" QFormat="true" Name="Subtitle"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Salutation"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Date"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Body Text First Indent"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Body Text First Indent 2"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Note Heading"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Body Text 2"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Body Text 3"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Body Text Indent 2"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Body Text Indent 3"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Block Text"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Hyperlink"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="FollowedHyperlink"/>
      <w:LsdException Locked="false" Priority="22" QFormat="true" Name="Strong"/>
      <w:LsdException Locked="false" Priority="20" QFormat="true" Name="Emphasis"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Document Map"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Plain Text"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="E-mail Signature"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="HTML Top of Form"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="HTML Bottom of Form"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Normal (Web)"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="HTML Acronym"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="HTML Address"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="HTML Cite"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="HTML Code"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="HTML Definition"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="HTML Keyboard"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="HTML Preformatted"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="HTML Sample"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="HTML Typewriter"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="HTML Variable"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Normal Table"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="annotation subject"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="No List"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Outline List 1"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Outline List 2"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Outline List 3"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Table Simple 1"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Table Simple 2"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Table Simple 3"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Table Classic 1"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Table Classic 2"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Table Classic 3"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Table Classic 4"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Table Colorful 1"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Table Colorful 2"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Table Colorful 3"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Table Columns 1"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Table Columns 2"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Table Columns 3"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Table Columns 4"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Table Columns 5"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Table Grid 1"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Table Grid 2"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Table Grid 3"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Table Grid 4"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Table Grid 5"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Table Grid 6"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Table Grid 7"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Table Grid 8"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Table List 1"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Table List 2"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Table List 3"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Table List 4"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Table List 5"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Table List 6"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Table List 7"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Table List 8"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Table 3D effects 1"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Table 3D effects 2"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Table 3D effects 3"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Table Contemporary"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Table Elegant"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Table Professional"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Table Subtle 1"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Table Subtle 2"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Table Web 1"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Table Web 2"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Table Web 3"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Balloon Text"/>
      <w:LsdException Locked="false" Priority="39" Name="Table Grid"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Table Theme"/>
      <w:LsdException Locked="false" SemiHidden="true" Name="Placeholder Text"/>
      <w:LsdException Locked="false" Priority="1" QFormat="true" Name="No Spacing"/>
      <w:LsdException Locked="false" Priority="60" Name="Light Shading"/>
      <w:LsdException Locked="false" Priority="61" Name="Light List"/>
      <w:LsdException Locked="false" Priority="62" Name="Light Grid"/>
      <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1"/>
      <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2"/>
      <w:LsdException Locked="false" Priority="65" Name="Medium List 1"/>
      <w:LsdException Locked="false" Priority="66" Name="Medium List 2"/>
      <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1"/>
      <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2"/>
      <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3"/>
      <w:LsdException Locked="false" Priority="70" Name="Dark List"/>
      <w:LsdException Locked="false" Priority="71" Name="Colorful Shading"/>
      <w:LsdException Locked="false" Priority="72" Name="Colorful List"/>
      <w:LsdException Locked="false" Priority="73" Name="Colorful Grid"/>
      <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 1"/>
      <w:LsdException Locked="false" Priority="61" Name="Light List Accent 1"/>
      <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 1"/>
      <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 1"/>
      <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 1"/>
      <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 1"/>
      <w:LsdException Locked="false" SemiHidden="true" Name="Revision"/>
      <w:LsdException Locked="false" Priority="34" QFormat="true"
       Name="List Paragraph"/>
      <w:LsdException Locked="false" Priority="29" QFormat="true" Name="Quote"/>
      <w:LsdException Locked="false" Priority="30" QFormat="true"
       Name="Intense Quote"/>
      <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 1"/>
      <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 1"/>
      <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 1"/>
      <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 1"/>
      <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 1"/>
      <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 1"/>
      <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 1"/>
      <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 1"/>
      <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 2"/>
      <w:LsdException Locked="false" Priority="61" Name="Light List Accent 2"/>
      <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 2"/>
      <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 2"/>
      <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 2"/>
      <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 2"/>
      <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 2"/>
      <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 2"/>
      <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 2"/>
      <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 2"/>
      <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 2"/>
      <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 2"/>
      <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 2"/>
      <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 2"/>
      <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 3"/>
      <w:LsdException Locked="false" Priority="61" Name="Light List Accent 3"/>
      <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 3"/>
      <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 3"/>
      <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 3"/>
      <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 3"/>
      <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 3"/>
      <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 3"/>
      <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 3"/>
      <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 3"/>
      <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 3"/>
      <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 3"/>
      <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 3"/>
      <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 3"/>
      <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 4"/>
      <w:LsdException Locked="false" Priority="61" Name="Light List Accent 4"/>
      <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 4"/>
      <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 4"/>
      <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 4"/>
      <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 4"/>
      <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 4"/>
      <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 4"/>
      <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 4"/>
      <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 4"/>
      <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 4"/>
      <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 4"/>
      <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 4"/>
      <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 4"/>
      <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 5"/>
      <w:LsdException Locked="false" Priority="61" Name="Light List Accent 5"/>
      <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 5"/>
      <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 5"/>
      <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 5"/>
      <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 5"/>
      <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 5"/>
      <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 5"/>
      <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 5"/>
      <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 5"/>
      <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 5"/>
      <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 5"/>
      <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 5"/>
      <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 5"/>
      <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 6"/>
      <w:LsdException Locked="false" Priority="61" Name="Light List Accent 6"/>
      <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 6"/>
      <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 6"/>
      <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 6"/>
      <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 6"/>
      <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 6"/>
      <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 6"/>
      <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 6"/>
      <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 6"/>
      <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 6"/>
      <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 6"/>
      <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 6"/>
      <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 6"/>
      <w:LsdException Locked="false" Priority="19" QFormat="true"
       Name="Subtle Emphasis"/>
      <w:LsdException Locked="false" Priority="21" QFormat="true"
       Name="Intense Emphasis"/>
      <w:LsdException Locked="false" Priority="31" QFormat="true"
       Name="Subtle Reference"/>
      <w:LsdException Locked="false" Priority="32" QFormat="true"
       Name="Intense Reference"/>
      <w:LsdException Locked="false" Priority="33" QFormat="true" Name="Book Title"/>
      <w:LsdException Locked="false" Priority="37" SemiHidden="true"
       UnhideWhenUsed="true" Name="Bibliography"/>
      <w:LsdException Locked="false" Priority="39" SemiHidden="true"
       UnhideWhenUsed="true" QFormat="true" Name="TOC Heading"/>
      <w:LsdException Locked="false" Priority="41" Name="Plain Table 1"/>
      <w:LsdException Locked="false" Priority="42" Name="Plain Table 2"/>
      <w:LsdException Locked="false" Priority="43" Name="Plain Table 3"/>
      <w:LsdException Locked="false" Priority="44" Name="Plain Table 4"/>
      <w:LsdException Locked="false" Priority="45" Name="Plain Table 5"/>
      <w:LsdException Locked="false" Priority="40" Name="Grid Table Light"/>
      <w:LsdException Locked="false" Priority="46" Name="Grid Table 1 Light"/>
      <w:LsdException Locked="false" Priority="47" Name="Grid Table 2"/>
      <w:LsdException Locked="false" Priority="48" Name="Grid Table 3"/>
      <w:LsdException Locked="false" Priority="49" Name="Grid Table 4"/>
      <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark"/>
      <w:LsdException Locked="false" Priority="51" Name="Grid Table 6 Colorful"/>
      <w:LsdException Locked="false" Priority="52" Name="Grid Table 7 Colorful"/>
      <w:LsdException Locked="false" Priority="46"
       Name="Grid Table 1 Light Accent 1"/>
      <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 1"/>
      <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 1"/>
      <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 1"/>
      <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 1"/>
      <w:LsdException Locked="false" Priority="51"
       Name="Grid Table 6 Colorful Accent 1"/>
      <w:LsdException Locked="false" Priority="52"
       Name="Grid Table 7 Colorful Accent 1"/>
      <w:LsdException Locked="false" Priority="46"
       Name="Grid Table 1 Light Accent 2"/>
      <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 2"/>
      <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 2"/>
      <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 2"/>
      <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 2"/>
      <w:LsdException Locked="false" Priority="51"
       Name="Grid Table 6 Colorful Accent 2"/>
      <w:LsdException Locked="false" Priority="52"
       Name="Grid Table 7 Colorful Accent 2"/>
      <w:LsdException Locked="false" Priority="46"
       Name="Grid Table 1 Light Accent 3"/>
      <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 3"/>
      <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 3"/>
      <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 3"/>
      <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 3"/>
      <w:LsdException Locked="false" Priority="51"
       Name="Grid Table 6 Colorful Accent 3"/>
      <w:LsdException Locked="false" Priority="52"
       Name="Grid Table 7 Colorful Accent 3"/>
      <w:LsdException Locked="false" Priority="46"
       Name="Grid Table 1 Light Accent 4"/>
      <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 4"/>
      <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 4"/>
      <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 4"/>
      <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 4"/>
      <w:LsdException Locked="false" Priority="51"
       Name="Grid Table 6 Colorful Accent 4"/>
      <w:LsdException Locked="false" Priority="52"
       Name="Grid Table 7 Colorful Accent 4"/>
      <w:LsdException Locked="false" Priority="46"
       Name="Grid Table 1 Light Accent 5"/>
      <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 5"/>
      <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 5"/>
      <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 5"/>
      <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 5"/>
      <w:LsdException Locked="false" Priority="51"
       Name="Grid Table 6 Colorful Accent 5"/>
      <w:LsdException Locked="false" Priority="52"
       Name="Grid Table 7 Colorful Accent 5"/>
      <w:LsdException Locked="false" Priority="46"
       Name="Grid Table 1 Light Accent 6"/>
      <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 6"/>
      <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 6"/>
      <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 6"/>
      <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 6"/>
      <w:LsdException Locked="false" Priority="51"
       Name="Grid Table 6 Colorful Accent 6"/>
      <w:LsdException Locked="false" Priority="52"
       Name="Grid Table 7 Colorful Accent 6"/>
      <w:LsdException Locked="false" Priority="46" Name="List Table 1 Light"/>
      <w:LsdException Locked="false" Priority="47" Name="List Table 2"/>
      <w:LsdException Locked="false" Priority="48" Name="List Table 3"/>
      <w:LsdException Locked="false" Priority="49" Name="List Table 4"/>
      <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark"/>
      <w:LsdException Locked="false" Priority="51" Name="List Table 6 Colorful"/>
      <w:LsdException Locked="false" Priority="52" Name="List Table 7 Colorful"/>
      <w:LsdException Locked="false" Priority="46"
       Name="List Table 1 Light Accent 1"/>
      <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 1"/>
      <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 1"/>
      <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 1"/>
      <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 1"/>
      <w:LsdException Locked="false" Priority="51"
       Name="List Table 6 Colorful Accent 1"/>
      <w:LsdException Locked="false" Priority="52"
       Name="List Table 7 Colorful Accent 1"/>
      <w:LsdException Locked="false" Priority="46"
       Name="List Table 1 Light Accent 2"/>
      <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 2"/>
      <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 2"/>
      <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 2"/>
      <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 2"/>
      <w:LsdException Locked="false" Priority="51"
       Name="List Table 6 Colorful Accent 2"/>
      <w:LsdException Locked="false" Priority="52"
       Name="List Table 7 Colorful Accent 2"/>
      <w:LsdException Locked="false" Priority="46"
       Name="List Table 1 Light Accent 3"/>
      <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 3"/>
      <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 3"/>
      <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 3"/>
      <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 3"/>
      <w:LsdException Locked="false" Priority="51"
       Name="List Table 6 Colorful Accent 3"/>
      <w:LsdException Locked="false" Priority="52"
       Name="List Table 7 Colorful Accent 3"/>
      <w:LsdException Locked="false" Priority="46"
       Name="List Table 1 Light Accent 4"/>
      <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 4"/>
      <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 4"/>
      <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 4"/>
      <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 4"/>
      <w:LsdException Locked="false" Priority="51"
       Name="List Table 6 Colorful Accent 4"/>
      <w:LsdException Locked="false" Priority="52"
       Name="List Table 7 Colorful Accent 4"/>
      <w:LsdException Locked="false" Priority="46"
       Name="List Table 1 Light Accent 5"/>
      <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 5"/>
      <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 5"/>
      <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 5"/>
      <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 5"/>
      <w:LsdException Locked="false" Priority="51"
       Name="List Table 6 Colorful Accent 5"/>
      <w:LsdException Locked="false" Priority="52"
       Name="List Table 7 Colorful Accent 5"/>
      <w:LsdException Locked="false" Priority="46"
       Name="List Table 1 Light Accent 6"/>
      <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 6"/>
      <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 6"/>
      <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 6"/>
      <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 6"/>
      <w:LsdException Locked="false" Priority="51"
       Name="List Table 6 Colorful Accent 6"/>
      <w:LsdException Locked="false" Priority="52"
       Name="List Table 7 Colorful Accent 6"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Mention"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Smart Hyperlink"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Hashtag"/>
      <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
       Name="Unresolved Mention"/>
     </w:LatentStyles>
    </xml><![endif]-->
    <style>
    <!--
     /* Font Definitions */
     @font-face
      {font-family:"Cambria Math";
      panose-1:2 4 5 3 5 4 6 3 2 4;
      mso-font-charset:0;
      mso-generic-font-family:roman;
      mso-font-pitch:variable;
      mso-font-signature:3 0 0 0 1 0;}
    @font-face
      {font-family:Calibri;
      panose-1:2 15 5 2 2 2 4 3 2 4;
      mso-font-charset:0;
      mso-generic-font-family:swiss;
      mso-font-pitch:variable;
      mso-font-signature:-536858881 -1073732485 9 0 511 0;}
    @font-face
      {font-family:"Calibri Light";
      panose-1:2 15 3 2 2 2 4 3 2 4;
      mso-font-charset:0;
      mso-generic-font-family:swiss;
      mso-font-pitch:variable;
      mso-font-signature:-536859905 -1073732485 9 0 511 0;}
     /* Style Definitions */
     p.MsoNormal, li.MsoNormal, div.MsoNormal
      {mso-style-unhide:no;
      mso-style-qformat:yes;
      mso-style-parent:"";
      margin-top:0in;
      margin-right:0in;
      margin-bottom:8.0pt;
      margin-left:0in;
      line-height:107%;
      mso-pagination:widow-orphan;
      font-size:11.0pt;
      font-family:"Calibri",sans-serif;
      mso-ascii-font-family:Calibri;
      mso-ascii-theme-font:minor-latin;
      mso-fareast-font-family:Calibri;
      mso-fareast-theme-font:minor-latin;
      mso-hansi-font-family:Calibri;
      mso-hansi-theme-font:minor-latin;
      mso-bidi-font-family:"Times New Roman";
      mso-bidi-theme-font:minor-bidi;}
    h2
      {mso-style-priority:9;
      mso-style-qformat:yes;
      mso-style-link:"Heading 2 Char";
      mso-style-next:Normal;
      margin-top:2.0pt;
      margin-right:0in;
      margin-bottom:0in;
      margin-left:0in;
      margin-bottom:.0001pt;
      line-height:107%;
      mso-pagination:widow-orphan lines-together;
      page-break-after:avoid;
      mso-outline-level:2;
      font-size:13.0pt;
      font-family:"Calibri Light",sans-serif;
      mso-ascii-font-family:"Calibri Light";
      mso-ascii-theme-font:major-latin;
      mso-fareast-font-family:"Times New Roman";
      mso-fareast-theme-font:major-fareast;
      mso-hansi-font-family:"Calibri Light";
      mso-hansi-theme-font:major-latin;
      mso-bidi-font-family:"Times New Roman";
      mso-bidi-theme-font:major-bidi;
      color:#2F5496;
      mso-themecolor:accent1;
      mso-themeshade:191;
      font-weight:normal;}
    span.Heading2Char
      {mso-style-name:"Heading 2 Char";
      mso-style-priority:9;
      mso-style-unhide:no;
      mso-style-locked:yes;
      mso-style-link:"Heading 2";
      mso-ansi-font-size:13.0pt;
      mso-bidi-font-size:13.0pt;
      font-family:"Calibri Light",sans-serif;
      mso-ascii-font-family:"Calibri Light";
      mso-ascii-theme-font:major-latin;
      mso-fareast-font-family:"Times New Roman";
      mso-fareast-theme-font:major-fareast;
      mso-hansi-font-family:"Calibri Light";
      mso-hansi-theme-font:major-latin;
      mso-bidi-font-family:"Times New Roman";
      mso-bidi-theme-font:major-bidi;
      color:#2F5496;
      mso-themecolor:accent1;
      mso-themeshade:191;}
    .MsoChpDefault
      {mso-style-type:export-only;
      mso-default-props:yes;
      font-family:"Calibri",sans-serif;
      mso-ascii-font-family:Calibri;
      mso-ascii-theme-font:minor-latin;
      mso-fareast-font-family:Calibri;
      mso-fareast-theme-font:minor-latin;
      mso-hansi-font-family:Calibri;
      mso-hansi-theme-font:minor-latin;
      mso-bidi-font-family:"Times New Roman";
      mso-bidi-theme-font:minor-bidi;}
    .MsoPapDefault
      {mso-style-type:export-only;
      margin-bottom:8.0pt;
      line-height:107%;}
    @page WordSection1
      {size:8.5in 11.0in;
      margin:1.0in 1.0in 1.0in 1.0in;
      mso-header-margin:.5in;
      mso-footer-margin:.5in;
      mso-paper-source:0;}
    div.WordSection1
      {page:WordSection1;}
    -->
    </style>
    <!--[if gte mso 10]>
    <style>
     /* Style Definitions */
     table.MsoNormalTable
      {mso-style-name:"Table Normal";
      mso-tstyle-rowband-size:0;
      mso-tstyle-colband-size:0;
      mso-style-noshow:yes;
      mso-style-priority:99;
      mso-style-parent:"";
      mso-padding-alt:0in 5.4pt 0in 5.4pt;
      mso-para-margin-top:0in;
      mso-para-margin-right:0in;
      mso-para-margin-bottom:8.0pt;
      mso-para-margin-left:0in;
      line-height:107%;
      mso-pagination:widow-orphan;
      font-size:11.0pt;
      font-family:"Calibri",sans-serif;
      mso-ascii-font-family:Calibri;
      mso-ascii-theme-font:minor-latin;
      mso-hansi-font-family:Calibri;
      mso-hansi-theme-font:minor-latin;
      mso-bidi-font-family:"Times New Roman";
      mso-bidi-theme-font:minor-bidi;}
    </style>
    <![endif]-->
    </head>
    
    <body lang=EN-US style='tab-interval:.5in'>
    <!--StartFragment-->
    
    <h2>Heading2<o:p></o:p></h2>
    
    <!--EndFragment-->
    </body>
    
    </html>
    `;
    keyBoardEvent.clipboardData = {
      getData: () => {
        return localElem;
      },
      items: []
    };
    (rteObj as any).inputElement.focus();
    setCursorPoint((rteObj as any).inputElement, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let allElem: any = (rteObj as any).inputElement.firstElementChild.querySelectorAll('*');
      let expected: boolean = false;
      let expectedElem: string = `<h2>Heading2</h2>`;
      if (allElem[0].parentElement.innerHTML.trim().replace(/>\s+</g, '><') === expectedElem) {
        expected = true;
      }
      expect(expected).toBe(true);
      done();
    }, 100);
  });

  it('List with styles font family, font color, font size', (done) => {
    let localElem: string = `<html xmlns:o='urn:schemas-microsoft-com:office:office'
    xmlns:w='urn:schemas-microsoft-com:office:word'
    xmlns:m='http://schemas.microsoft.com/office/2004/12/omml'
    xmlns='http://www.w3.org/TR/REC-html40'>
    
    <head>
    <style>
    <!--
     /* Font Definitions */
     @font-face
      {font-family:Wingdings;
      panose-1:5 0 0 0 0 0 0 0 0 0;
      mso-font-charset:2;
      mso-generic-font-family:auto;
      mso-font-pitch:variable;
      mso-font-signature:0 268435456 0 0 -2147483648 0;}
    @font-face
      {font-family:'Cambria Math';
      panose-1:2 4 5 3 5 4 6 3 2 4;
      mso-font-charset:0;
      mso-generic-font-family:roman;
      mso-font-pitch:variable;
      mso-font-signature:-536869121 1107305727 33554432 0 415 0;}
    @font-face
      {font-family:Calibri;
      panose-1:2 15 5 2 2 2 4 3 2 4;
      mso-font-charset:0;
      mso-generic-font-family:swiss;
      mso-font-pitch:variable;
      mso-font-signature:-536858881 -1073732485 9 0 511 0;}
    @font-face
      {font-family:Algerian;
      panose-1:4 2 7 5 4 10 2 6 7 2;
      mso-font-charset:0;
      mso-generic-font-family:decorative;
      mso-font-pitch:variable;
      mso-font-signature:3 0 0 0 1 0;}
     /* Style Definitions */
     p.MsoNormal, li.MsoNormal, div.MsoNormal
      {mso-style-unhide:no;
      mso-style-qformat:yes;
      mso-style-parent:'';
      margin-top:0in;
      margin-right:0in;
      margin-bottom:8.0pt;
      margin-left:0in;
      line-height:107%;
      mso-pagination:widow-orphan;
      font-size:11.0pt;
      font-family:'Calibri',sans-serif;
      mso-ascii-font-family:Calibri;
      mso-ascii-theme-font:minor-latin;
      mso-fareast-font-family:Calibri;
      mso-fareast-theme-font:minor-latin;
      mso-hansi-font-family:Calibri;
      mso-hansi-theme-font:minor-latin;
      mso-bidi-font-family:'Times New Roman';
      mso-bidi-theme-font:minor-bidi;}
    p.MsoListParagraph, li.MsoListParagraph, div.MsoListParagraph
      {mso-style-priority:34;
      mso-style-unhide:no;
      mso-style-qformat:yes;
      margin-top:0in;
      margin-right:0in;
      margin-bottom:8.0pt;
      margin-left:.5in;
      mso-add-space:auto;
      line-height:107%;
      mso-pagination:widow-orphan;
      font-size:11.0pt;
      font-family:'Calibri',sans-serif;
      mso-ascii-font-family:Calibri;
      mso-ascii-theme-font:minor-latin;
      mso-fareast-font-family:Calibri;
      mso-fareast-theme-font:minor-latin;
      mso-hansi-font-family:Calibri;
      mso-hansi-theme-font:minor-latin;
      mso-bidi-font-family:'Times New Roman';
      mso-bidi-theme-font:minor-bidi;}
    p.MsoListParagraphCxSpFirst, li.MsoListParagraphCxSpFirst, div.MsoListParagraphCxSpFirst
      {mso-style-priority:34;
      mso-style-unhide:no;
      mso-style-qformat:yes;
      mso-style-type:export-only;
      margin-top:0in;
      margin-right:0in;
      margin-bottom:0in;
      margin-left:.5in;
      margin-bottom:.0001pt;
      mso-add-space:auto;
      line-height:107%;
      mso-pagination:widow-orphan;
      font-size:11.0pt;
      font-family:'Calibri',sans-serif;
      mso-ascii-font-family:Calibri;
      mso-ascii-theme-font:minor-latin;
      mso-fareast-font-family:Calibri;
      mso-fareast-theme-font:minor-latin;
      mso-hansi-font-family:Calibri;
      mso-hansi-theme-font:minor-latin;
      mso-bidi-font-family:'Times New Roman';
      mso-bidi-theme-font:minor-bidi;}
    p.MsoListParagraphCxSpMiddle, li.MsoListParagraphCxSpMiddle, div.MsoListParagraphCxSpMiddle
      {mso-style-priority:34;
      mso-style-unhide:no;
      mso-style-qformat:yes;
      mso-style-type:export-only;
      margin-top:0in;
      margin-right:0in;
      margin-bottom:0in;
      margin-left:.5in;
      margin-bottom:.0001pt;
      mso-add-space:auto;
      line-height:107%;
      mso-pagination:widow-orphan;
      font-size:11.0pt;
      font-family:'Calibri',sans-serif;
      mso-ascii-font-family:Calibri;
      mso-ascii-theme-font:minor-latin;
      mso-fareast-font-family:Calibri;
      mso-fareast-theme-font:minor-latin;
      mso-hansi-font-family:Calibri;
      mso-hansi-theme-font:minor-latin;
      mso-bidi-font-family:'Times New Roman';
      mso-bidi-theme-font:minor-bidi;}
    p.MsoListParagraphCxSpLast, li.MsoListParagraphCxSpLast, div.MsoListParagraphCxSpLast
      {mso-style-priority:34;
      mso-style-unhide:no;
      mso-style-qformat:yes;
      mso-style-type:export-only;
      margin-top:0in;
      margin-right:0in;
      margin-bottom:8.0pt;
      margin-left:.5in;
      mso-add-space:auto;
      line-height:107%;
      mso-pagination:widow-orphan;
      font-size:11.0pt;
      font-family:'Calibri',sans-serif;
      mso-ascii-font-family:Calibri;
      mso-ascii-theme-font:minor-latin;
      mso-fareast-font-family:Calibri;
      mso-fareast-theme-font:minor-latin;
      mso-hansi-font-family:Calibri;
      mso-hansi-theme-font:minor-latin;
      mso-bidi-font-family:'Times New Roman';
      mso-bidi-theme-font:minor-bidi;}
    .MsoChpDefault
      {mso-style-type:export-only;
      mso-default-props:yes;
      font-family:'Calibri',sans-serif;
      mso-ascii-font-family:Calibri;
      mso-ascii-theme-font:minor-latin;
      mso-fareast-font-family:Calibri;
      mso-fareast-theme-font:minor-latin;
      mso-hansi-font-family:Calibri;
      mso-hansi-theme-font:minor-latin;
      mso-bidi-font-family:'Times New Roman';
      mso-bidi-theme-font:minor-bidi;}
    .MsoPapDefault
      {mso-style-type:export-only;
      margin-bottom:8.0pt;
      line-height:107%;}
    @page WordSection1
      {size:8.5in 11.0in;
      margin:1.0in 1.0in 1.0in 1.0in;
      mso-header-margin:.5in;
      mso-footer-margin:.5in;
      mso-paper-source:0;}
    div.WordSection1
      {page:WordSection1;}
     /* List Definitions */
     @list l0
      {mso-list-id:1597908209;
      mso-list-type:hybrid;
      mso-list-template-ids:-871440298 67698689 67698691 67698693 67698689 67698691 67698693 67698689 67698691 67698693;}
    @list l0:level1
      {mso-level-number-format:bullet;
      mso-level-text:;
      mso-level-tab-stop:none;
      mso-level-number-position:left;
      text-indent:-.25in;
      font-family:Symbol;}
    @list l0:level2
      {mso-level-number-format:bullet;
      mso-level-text:o;
      mso-level-tab-stop:none;
      mso-level-number-position:left;
      text-indent:-.25in;
      font-family:'Courier New';}
    @list l0:level3
      {mso-level-number-format:bullet;
      mso-level-text:;
      mso-level-tab-stop:none;
      mso-level-number-position:left;
      text-indent:-.25in;
      font-family:Wingdings;}
    @list l0:level4
      {mso-level-number-format:bullet;
      mso-level-text:;
      mso-level-tab-stop:none;
      mso-level-number-position:left;
      text-indent:-.25in;
      font-family:Symbol;}
    @list l0:level5
      {mso-level-number-format:bullet;
      mso-level-text:o;
      mso-level-tab-stop:none;
      mso-level-number-position:left;
      text-indent:-.25in;
      font-family:'Courier New';}
    @list l0:level6
      {mso-level-number-format:bullet;
      mso-level-text:;
      mso-level-tab-stop:none;
      mso-level-number-position:left;
      text-indent:-.25in;
      font-family:Wingdings;}
    @list l0:level7
      {mso-level-number-format:bullet;
      mso-level-text:;
      mso-level-tab-stop:none;
      mso-level-number-position:left;
      text-indent:-.25in;
      font-family:Symbol;}
    @list l0:level8
      {mso-level-number-format:bullet;
      mso-level-text:o;
      mso-level-tab-stop:none;
      mso-level-number-position:left;
      text-indent:-.25in;
      font-family:'Courier New';}
    @list l0:level9
      {mso-level-number-format:bullet;
      mso-level-text:;
      mso-level-tab-stop:none;
      mso-level-number-position:left;
      text-indent:-.25in;
      font-family:Wingdings;}
    ol
      {margin-bottom:0in;}
    ul
      {margin-bottom:0in;}
    -->
    </style>
    <!--[if gte mso 10]>
    <style>
     /* Style Definitions */
     table.MsoNormalTable
      {mso-style-name:'Table Normal';
      mso-tstyle-rowband-size:0;
      mso-tstyle-colband-size:0;
      mso-style-noshow:yes;
      mso-style-priority:99;
      mso-style-parent:'';
      mso-padding-alt:0in 5.4pt 0in 5.4pt;
      mso-para-margin-top:0in;
      mso-para-margin-right:0in;
      mso-para-margin-bottom:8.0pt;
      mso-para-margin-left:0in;
      line-height:107%;
      mso-pagination:widow-orphan;
      font-size:11.0pt;
      font-family:'Calibri',sans-serif;
      mso-ascii-font-family:Calibri;
      mso-ascii-theme-font:minor-latin;
      mso-hansi-font-family:Calibri;
      mso-hansi-theme-font:minor-latin;
      mso-bidi-font-family:'Times New Roman';
      mso-bidi-theme-font:minor-bidi;}
    </style>
    <![endif]-->
    </head>
    
    <body lang=EN-US style='tab-interval:.5in'>
    <!--StartFragment-->
    
    <p class=MsoListParagraphCxSpFirst style='text-indent:-.25in;mso-list:l0 level1 lfo1'><![if !supportLists]><span
    style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
    Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt 'Times New Roman''>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    </span></span></span><![endif]>List 1 with <span style='font-size:26.0pt;
    line-height:107%'>font size</span><o:p></o:p></p>
    
    <p class=MsoListParagraphCxSpMiddle style='text-indent:-.25in;mso-list:l0 level1 lfo1'><![if !supportLists]><span
    style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
    Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt 'Times New Roman''>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    </span></span></span><![endif]>List 2 with <span style='color:red'>font color</span><o:p></o:p></p>
    
    <p class=MsoListParagraphCxSpMiddle style='text-indent:-.25in;mso-list:l0 level1 lfo1'><![if !supportLists]><span
    style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
    Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt 'Times New Roman''>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    </span></span></span><![endif]>List 3 with <span style='font-family:Algerian'>font
    family</span><o:p></o:p></p>
    
    <p class=MsoListParagraphCxSpLast style='text-indent:-.25in;mso-list:l0 level1 lfo1'><![if !supportLists]><span
    style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
    Symbol;color:white;mso-style-textoutline-type:solid;mso-style-textoutline-fill-color:
    #ED7D31;mso-style-textoutline-fill-themecolor:accent2;mso-style-textoutline-fill-alpha:
    100.0%;mso-style-textoutline-outlinestyle-dpiwidth:.52pt;mso-style-textoutline-outlinestyle-linecap:
    flat;mso-style-textoutline-outlinestyle-join:round;mso-style-textoutline-outlinestyle-pctmiterlimit:
    0%;mso-style-textoutline-outlinestyle-dash:solid;mso-style-textoutline-outlinestyle-align:
    center;mso-style-textoutline-outlinestyle-compound:simple;mso-effects-shadow-color:
    #ED7D31;mso-effects-shadow-themecolor:accent2;mso-effects-shadow-alpha:100.0%;
    mso-effects-shadow-dpiradius:0pt;mso-effects-shadow-dpidistance:3.0pt;
    mso-effects-shadow-angledirection:2700000;mso-effects-shadow-align:topleft;
    mso-effects-shadow-pctsx:100.0%;mso-effects-shadow-pctsy:100.0%;mso-effects-shadow-anglekx:
    0;mso-effects-shadow-angleky:0'><span style='mso-list:Ignore'>·<span
    style='font:7.0pt 'Times New Roman''>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span></span><![endif]>List
    4 with <span style='background:yellow;mso-highlight:yellow'>background color</span><b
    style='mso-bidi-font-weight:normal'><span style='color:white;mso-style-textoutline-type:
    solid;mso-style-textoutline-fill-color:#ED7D31;mso-style-textoutline-fill-themecolor:
    accent2;mso-style-textoutline-fill-alpha:100.0%;mso-style-textoutline-outlinestyle-dpiwidth:
    .52pt;mso-style-textoutline-outlinestyle-linecap:flat;mso-style-textoutline-outlinestyle-join:
    round;mso-style-textoutline-outlinestyle-pctmiterlimit:0%;mso-style-textoutline-outlinestyle-dash:
    solid;mso-style-textoutline-outlinestyle-align:center;mso-style-textoutline-outlinestyle-compound:
    simple;mso-effects-shadow-color:#ED7D31;mso-effects-shadow-themecolor:accent2;
    mso-effects-shadow-alpha:100.0%;mso-effects-shadow-dpiradius:0pt;mso-effects-shadow-dpidistance:
    3.0pt;mso-effects-shadow-angledirection:2700000;mso-effects-shadow-align:topleft;
    mso-effects-shadow-pctsx:100.0%;mso-effects-shadow-pctsy:100.0%;mso-effects-shadow-anglekx:
    0;mso-effects-shadow-angleky:0'><o:p></o:p></span></b></p>
    
    <!--EndFragment-->
    </body>
    
    </html>
    `;
    keyBoardEvent.clipboardData = {
      getData: () => {
        return localElem;
      },
      items: []
    };
    (rteObj as any).inputElement.focus();
    setCursorPoint((rteObj as any).inputElement, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let allElem: any = (rteObj as any).inputElement.firstElementChild.querySelectorAll('*');
      let expected: boolean = true;
      let expectedElem: string = `<ul level="1"><li><p>List 1 with <span style="font-size:26.0pt;
    line-height:107%;">font size</span></p></li><li><p>List 2 with <span style="color:red;">font color</span></p></li><li><p>List 3 with <span style="font-family:Algerian;">font
    family</span></p></li><li><p>List
    4 with <span style="background:yellow;">background color</span></p></li></ul>`;
      if (allElem[0].parentElement.innerHTML.trim().replace(/>\s+</g, '><') !== expectedElem) {
        expected = false;
      }
      expect(expected).toBe(true);
      done();
    }, 100);
  });

  it('Paste image from MSWord', () => {
    let localElem: string = `<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="ProgId" content="Word.Document">
    <meta name="Generator" content="Microsoft Word 15">
    <meta name="Originator" content="Microsoft Word 15">
    <link rel="File-List" href="file:///C:/Users/REVANT~2/AppData/Local/Temp/msohtmlclip1/01/clip_filelist.xml">
    <link rel="Edit-Time-Data" href="file:///C:/Users/REVANT~2/AppData/Local/Temp/msohtmlclip1/01/clip_editdata.mso">
    <link rel="themeData" href="file:///C:/Users/REVANT~2/AppData/Local/Temp/msohtmlclip1/01/clip_themedata.thmx">
    <link rel="colorSchemeMapping" href="file:///C:/Users/REVANT~2/AppData/Local/Temp/msohtmlclip1/01/clip_colorschememapping.xml">
    <style>
    <!--
     /* Font Definitions */
     @font-face
        {font-family:"Cambria Math";
        panose-1:2 4 5 3 5 4 6 3 2 4;
        mso-font-charset:0;
        mso-generic-font-family:roman;
        mso-font-pitch:variable;
        mso-font-signature:3 0 0 0 1 0;}
    @font-face
        {font-family:Calibri;
        panose-1:2 15 5 2 2 2 4 3 2 4;
        mso-font-charset:0;
        mso-generic-font-family:swiss;
        mso-font-pitch:variable;
        mso-font-signature:-536858881 -1073732485 9 0 511 0;}
     /* Style Definitions */
     p.MsoNormal, li.MsoNormal, div.MsoNormal
        {mso-style-unhide:no;
        mso-style-qformat:yes;
        mso-style-parent:"";
        margin:0in;
        margin-bottom:.0001pt;
        mso-pagination:widow-orphan;
        font-size:11.0pt;
        font-family:"Calibri",sans-serif;
        mso-fareast-font-family:Calibri;
        mso-fareast-theme-font:minor-latin;}
    .MsoChpDefault
        {mso-style-type:export-only;
        mso-default-props:yes;
        font-size:10.0pt;
        mso-ansi-font-size:10.0pt;
        mso-bidi-font-size:10.0pt;}
    @page WordSection1
        {size:8.5in 11.0in;
        margin:1.0in 1.0in 1.0in 1.0in;
        mso-header-margin:.5in;
        mso-footer-margin:.5in;
        mso-paper-source:0;}
    div.WordSection1
        {page:WordSection1;}
    -->
    </style>
    <!--[if gte mso 10]>
    <style>
     /* Style Definitions */
     table.MsoNormalTable
        {mso-style-name:"Table Normal";
        mso-tstyle-rowband-size:0;
        mso-tstyle-colband-size:0;
        mso-style-noshow:yes;
        mso-style-priority:99;
        mso-style-parent:"";
        mso-padding-alt:0in 5.4pt 0in 5.4pt;
        mso-para-margin:0in;
        mso-para-margin-bottom:.0001pt;
        mso-pagination:widow-orphan;
        font-size:10.0pt;
        font-family:"Times New Roman",serif;}
    </style>
    <![endif]-->
    <!--StartFragment--><span style="font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;
    mso-fareast-font-family:Calibri;mso-fareast-theme-font:minor-latin;mso-ansi-language:
    EN-US;mso-fareast-language:EN-US;mso-bidi-language:AR-SA"><img width="128" height="128" src="file:///C:/Users/REVANT~2/AppData/Local/Temp/msohtmlclip1/01/clip_image001.gif" style="height:1.333in;width:1.333in" border="0" v:shapes="Picture_x0020_1"><!--[endif]--></span><!--EndFragment-->`;
    let localElem1: string = `<p class='MsoListParagraphCxSpFirst' style='text-indent:-.25in;mso-list:l0 level1 lfo1'><!--[if !supportLists]--><span style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:Symbol'><span style='mso-list:Ignore'><span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;</span></span></span><!--[endif]--><o:p></o:p></p>`;

    let rtfData: string = `{\\rtf1\\adeflang1025\\ansi\\ansicpg1252\\uc1\\adeff37\\deff0\\stshfdbch0\\stshfloch0\\stshfhich0\\stshfbi0\\deflang1033\\deflangfe1033\\themelang1033\\themelangfe0\\themelangcs0{\\fonttbl{\\f0\\fbidi \\froman\\fcharset0\\fprq2{\\*\\panose 02020603050405020304}Times New Roman;}{\\f34\\fbidi \\froman\\fcharset0\\fprq2{\\*\\panose 02040503050406030204}Cambria Math;}
{\\f37\\fbidi \\fswiss\\fcharset0\\fprq2{\\*\\panose 020f0502020204030204}Calibri;}{\\flomajor\\f31500\\fbidi \\froman\\fcharset0\\fprq2{\\*\\panose 02020603050405020304}Times New Roman;}
{\\fdbmajor\\f31501\\fbidi \\froman\\fcharset0\\fprq2{\\*\\panose 02020603050405020304}Times New Roman;}{\\fhimajor\\f31502\\fbidi \\fswiss\\fcharset0\\fprq2{\\*\\panose 020f0302020204030204}Calibri Light;}
{\\fbimajor\\f31503\\fbidi \\froman\\fcharset0\\fprq2{\\*\\panose 02020603050405020304}Times New Roman;}{\\flominor\\f31504\\fbidi \\froman\\fcharset0\\fprq2{\\*\\panose 02020603050405020304}Times New Roman;}
{\\fdbminor\\f31505\\fbidi \\froman\\fcharset0\\fprq2{\\*\\panose 02020603050405020304}Times New Roman;}{\\fhiminor\\f31506\\fbidi \\fswiss\\fcharset0\\fprq2{\\*\\panose 020f0502020204030204}Calibri;}
{\\fbiminor\\f31507\\fbidi \\froman\\fcharset0\\fprq2{\\*\\panose 02020603050405020304}Times New Roman;}{\\f46\\fbidi \\froman\\fcharset238\\fprq2 Times New Roman CE;}{\\f47\\fbidi \\froman\\fcharset204\\fprq2 Times New Roman Cyr;}
{\\f49\\fbidi \\froman\\fcharset161\\fprq2 Times New Roman Greek;}{\\f50\\fbidi \\froman\\fcharset162\\fprq2 Times New Roman Tur;}{\\f51\\fbidi \\froman\\fcharset177\\fprq2 Times New Roman (Hebrew);}{\\f52\\fbidi \\froman\\fcharset178\\fprq2 Times New Roman (Arabic);}
{\\f53\\fbidi \\froman\\fcharset186\\fprq2 Times New Roman Baltic;}{\\f54\\fbidi \\froman\\fcharset163\\fprq2 Times New Roman (Vietnamese);}{\\f416\\fbidi \\fswiss\\fcharset238\\fprq2 Calibri CE;}{\\f417\\fbidi \\fswiss\\fcharset204\\fprq2 Calibri Cyr;}
{\\f419\\fbidi \\fswiss\\fcharset161\\fprq2 Calibri Greek;}{\\f420\\fbidi \\fswiss\\fcharset162\\fprq2 Calibri Tur;}{\\f421\\fbidi \\fswiss\\fcharset177\\fprq2 Calibri (Hebrew);}{\\f422\\fbidi \\fswiss\\fcharset178\\fprq2 Calibri (Arabic);}
{\\f423\\fbidi \\fswiss\\fcharset186\\fprq2 Calibri Baltic;}{\\f424\\fbidi \\fswiss\\fcharset163\\fprq2 Calibri (Vietnamese);}{\\flomajor\\f31508\\fbidi \\froman\\fcharset238\\fprq2 Times New Roman CE;}
{\\flomajor\\f31509\\fbidi \\froman\\fcharset204\\fprq2 Times New Roman Cyr;}{\\flomajor\\f31511\\fbidi \\froman\\fcharset161\\fprq2 Times New Roman Greek;}{\\flomajor\\f31512\\fbidi \\froman\\fcharset162\\fprq2 Times New Roman Tur;}
{\\flomajor\\f31513\\fbidi \\froman\\fcharset177\\fprq2 Times New Roman (Hebrew);}{\\flomajor\\f31514\\fbidi \\froman\\fcharset178\\fprq2 Times New Roman (Arabic);}{\\flomajor\\f31515\\fbidi \\froman\\fcharset186\\fprq2 Times New Roman Baltic;}
{\\flomajor\\f31516\\fbidi \\froman\\fcharset163\\fprq2 Times New Roman (Vietnamese);}{\\fdbmajor\\f31518\\fbidi \\froman\\fcharset238\\fprq2 Times New Roman CE;}{\\fdbmajor\\f31519\\fbidi \\froman\\fcharset204\\fprq2 Times New Roman Cyr;}
{\\fdbmajor\\f31521\\fbidi \\froman\\fcharset161\\fprq2 Times New Roman Greek;}{\\fdbmajor\\f31522\\fbidi \\froman\\fcharset162\\fprq2 Times New Roman Tur;}{\\fdbmajor\\f31523\\fbidi \\froman\\fcharset177\\fprq2 Times New Roman (Hebrew);}
{\\fdbmajor\\f31524\\fbidi \\froman\\fcharset178\\fprq2 Times New Roman (Arabic);}{\\fdbmajor\\f31525\\fbidi \\froman\\fcharset186\\fprq2 Times New Roman Baltic;}{\\fdbmajor\\f31526\\fbidi \\froman\\fcharset163\\fprq2 Times New Roman (Vietnamese);}
{\\fhimajor\\f31528\\fbidi \\fswiss\\fcharset238\\fprq2 Calibri Light CE;}{\\fhimajor\\f31529\\fbidi \\fswiss\\fcharset204\\fprq2 Calibri Light Cyr;}{\\fhimajor\\f31531\\fbidi \\fswiss\\fcharset161\\fprq2 Calibri Light Greek;}
{\\fhimajor\\f31532\\fbidi \\fswiss\\fcharset162\\fprq2 Calibri Light Tur;}{\\fhimajor\\f31533\\fbidi \\fswiss\\fcharset177\\fprq2 Calibri Light (Hebrew);}{\\fhimajor\\f31534\\fbidi \\fswiss\\fcharset178\\fprq2 Calibri Light (Arabic);}
{\\fhimajor\\f31535\\fbidi \\fswiss\\fcharset186\\fprq2 Calibri Light Baltic;}{\\fhimajor\\f31536\\fbidi \\fswiss\\fcharset163\\fprq2 Calibri Light (Vietnamese);}{\\fbimajor\\f31538\\fbidi \\froman\\fcharset238\\fprq2 Times New Roman CE;}
{\\fbimajor\\f31539\\fbidi \\froman\\fcharset204\\fprq2 Times New Roman Cyr;}{\\fbimajor\\f31541\\fbidi \\froman\\fcharset161\\fprq2 Times New Roman Greek;}{\\fbimajor\\f31542\\fbidi \\froman\\fcharset162\\fprq2 Times New Roman Tur;}
{\\fbimajor\\f31543\\fbidi \\froman\\fcharset177\\fprq2 Times New Roman (Hebrew);}{\\fbimajor\\f31544\\fbidi \\froman\\fcharset178\\fprq2 Times New Roman (Arabic);}{\\fbimajor\\f31545\\fbidi \\froman\\fcharset186\\fprq2 Times New Roman Baltic;}
{\\fbimajor\\f31546\\fbidi \\froman\\fcharset163\\fprq2 Times New Roman (Vietnamese);}{\\flominor\\f31548\\fbidi \\froman\\fcharset238\\fprq2 Times New Roman CE;}{\\flominor\\f31549\\fbidi \\froman\\fcharset204\\fprq2 Times New Roman Cyr;}
{\\flominor\\f31551\\fbidi \\froman\\fcharset161\\fprq2 Times New Roman Greek;}{\\flominor\\f31552\\fbidi \\froman\\fcharset162\\fprq2 Times New Roman Tur;}{\\flominor\\f31553\\fbidi \\froman\\fcharset177\\fprq2 Times New Roman (Hebrew);}
{\\flominor\\f31554\\fbidi \\froman\\fcharset178\\fprq2 Times New Roman (Arabic);}{\\flominor\\f31555\\fbidi \\froman\\fcharset186\\fprq2 Times New Roman Baltic;}{\\flominor\\f31556\\fbidi \\froman\\fcharset163\\fprq2 Times New Roman (Vietnamese);}
{\\fdbminor\\f31558\\fbidi \\froman\\fcharset238\\fprq2 Times New Roman CE;}{\\fdbminor\\f31559\\fbidi \\froman\\fcharset204\\fprq2 Times New Roman Cyr;}{\\fdbminor\\f31561\\fbidi \\froman\\fcharset161\\fprq2 Times New Roman Greek;}
{\\fdbminor\\f31562\\fbidi \\froman\\fcharset162\\fprq2 Times New Roman Tur;}{\\fdbminor\\f31563\\fbidi \\froman\\fcharset177\\fprq2 Times New Roman (Hebrew);}{\\fdbminor\\f31564\\fbidi \\froman\\fcharset178\\fprq2 Times New Roman (Arabic);}
{\\fdbminor\\f31565\\fbidi \\froman\\fcharset186\\fprq2 Times New Roman Baltic;}{\\fdbminor\\f31566\\fbidi \\froman\\fcharset163\\fprq2 Times New Roman (Vietnamese);}{\\fhiminor\\f31568\\fbidi \\fswiss\\fcharset238\\fprq2 Calibri CE;}
{\\fhiminor\\f31569\\fbidi \\fswiss\\fcharset204\\fprq2 Calibri Cyr;}{\\fhiminor\\f31571\\fbidi \\fswiss\\fcharset161\\fprq2 Calibri Greek;}{\\fhiminor\\f31572\\fbidi \\fswiss\\fcharset162\\fprq2 Calibri Tur;}
{\\fhiminor\\f31573\\fbidi \\fswiss\\fcharset177\\fprq2 Calibri (Hebrew);}{\\fhiminor\\f31574\\fbidi \\fswiss\\fcharset178\\fprq2 Calibri (Arabic);}{\\fhiminor\\f31575\\fbidi \\fswiss\\fcharset186\\fprq2 Calibri Baltic;}
{\\fhiminor\\f31576\\fbidi \\fswiss\\fcharset163\\fprq2 Calibri (Vietnamese);}{\\fbiminor\\f31578\\fbidi \\froman\\fcharset238\\fprq2 Times New Roman CE;}{\\fbiminor\\f31579\\fbidi \\froman\\fcharset204\\fprq2 Times New Roman Cyr;}
{\\fbiminor\\f31581\\fbidi \\froman\\fcharset161\\fprq2 Times New Roman Greek;}{\\fbiminor\\f31582\\fbidi \\froman\\fcharset162\\fprq2 Times New Roman Tur;}{\\fbiminor\\f31583\\fbidi \\froman\\fcharset177\\fprq2 Times New Roman (Hebrew);}
{\\fbiminor\\f31584\\fbidi \\froman\\fcharset178\\fprq2 Times New Roman (Arabic);}{\\fbiminor\\f31585\\fbidi \\froman\\fcharset186\\fprq2 Times New Roman Baltic;}{\\fbiminor\\f31586\\fbidi \\froman\\fcharset163\\fprq2 Times New Roman (Vietnamese);}}
{\\colortbl;\\red0\\green0\\blue0;\\red0\\green0\\blue255;\\red0\\green255\\blue255;\\red0\\green255\\blue0;\\red255\\green0\\blue255;\\red255\\green0\\blue0;\\red255\\green255\\blue0;\\red255\\green255\\blue255;\\red0\\green0\\blue128;\\red0\\green128\\blue128;\\red0\\green128\\blue0;
\\red128\\green0\\blue128;\\red128\\green0\\blue0;\\red128\\green128\\blue0;\\red128\\green128\\blue128;\\red192\\green192\\blue192;\\red0\\green0\\blue0;\\red0\\green0\\blue0;}{\\*\\defchp }{\\*\\defpap 
\\ql \\li0\\ri0\\widctlpar\\wrapdefault\\aspalpha\\aspnum\\faauto\\adjustright\\rin0\\lin0\\itap0 }\\noqfpromote {\\stylesheet{\\ql \\li0\\ri0\\widctlpar\\wrapdefault\\aspalpha\\aspnum\\faauto\\adjustright\\rin0\\lin0\\itap0 \\rtlch\\fcs1 \\af37\\afs22\\alang1025 \\ltrch\\fcs0 
\\f37\\fs22\\lang1033\\langfe1033\\cgrid\\langnp1033\\langfenp1033 \\snext0 \\sqformat \\spriority0 \\styrsid3551130 Normal;}{\\*\\cs10 \\additive \\ssemihidden \\sunhideused \\spriority1 \\styrsid3551130 Default Paragraph Font;}{\\*
\\ts11\\tsrowd\\trftsWidthB3\\trpaddl108\\trpaddr108\\trpaddfl3\\trpaddft3\\trpaddfb3\\trpaddfr3\\tblind0\\tblindtype3\\tsvertalt\\tsbrdrt\\tsbrdrl\\tsbrdrb\\tsbrdrr\\tsbrdrdgl\\tsbrdrdgr\\tsbrdrh\\tsbrdrv 
\\ql \\li0\\ri0\\widctlpar\\wrapdefault\\aspalpha\\aspnum\\faauto\\adjustright\\rin0\\lin0\\itap0 \\rtlch\\fcs1 \\af0\\afs20\\alang1025 \\ltrch\\fcs0 \\fs20\\lang1033\\langfe1033\\cgrid\\langnp1033\\langfenp1033 \\snext11 \\ssemihidden \\sunhideused Normal Table;}}{\\*\\pgptbl {\\pgp
\\ipgp0\\itap0\\li0\\ri0\\sb0\\sa0}}{\\*\\rsidtbl \\rsid2709252\\rsid3551130}{\\mmathPr\\mmathFont34\\mbrkBin0\\mbrkBinSub0\\msmallFrac0\\mdispDef1\\mlMargin0\\mrMargin0\\mdefJc1\\mwrapIndent1440\\mintLim0\\mnaryLim1}{\\*\\xmlnstbl {\\xmlns1 http://schemas.microsoft.com/office/wo
rd/2003/wordml}}\\paperw12240\\paperh15840\\margl1440\\margr1440\\margt1440\\margb1440\\gutter0\\ltrsect 
\\widowctrl\\ftnbj\\aenddoc\\trackmoves0\\trackformatting1\\donotembedsysfont1\\relyonvml0\\donotembedlingdata0\\grfdocevents0\\validatexml1\\showplaceholdtext0\\ignoremixedcontent0\\saveinvalidxml0\\showxmlerrors1\\noxlattoyen
\\expshrtn\\noultrlspc\\dntblnsbdb\\nospaceforul\\formshade\\horzdoc\\dgmargin\\dghspace180\\dgvspace180\\dghorigin300\\dgvorigin0\\dghshow1\\dgvshow1
\\jexpand\\pgbrdrhead\\pgbrdrfoot\\splytwnine\\ftnlytwnine\\htmautsp\\nolnhtadjtbl\\useltbaln\\alntblind\\lytcalctblwd\\lyttblrtgr\\lnbrkrule\\nobrkwrptbl\\snaptogridincell\\allowfieldendsel\\wrppunct\\asianbrkrule\\rsidroot3551130
\\newtblstyruls\\nogrowautofit\\usenormstyforlist\\noindnmbrts\\felnbrelev\\nocxsptable\\indrlsweleven\\noafcnsttbl\\afelev\\utinl\\hwelev\\spltpgpar\\notcvasp\\notbrkcnstfrctbl\\notvatxbx\\krnprsnet\\cachedcolbal \\nouicompat \\fet0{\\*\\wgrffmtfilter 2450}
\\nofeaturethrottle1\\ilfomacatclnup0\\ltrpar \\sectd \\ltrsect\\linex0\\endnhere\\sectdefaultcl\\sftnbj {\\*\\pnseclvl1\\pnucrm\\pnstart1\\pnindent720\\pnhang {\\pntxta .}}{\\*\\pnseclvl2\\pnucltr\\pnstart1\\pnindent720\\pnhang {\\pntxta .}}{\\*\\pnseclvl3
\\pndec\\pnstart1\\pnindent720\\pnhang {\\pntxta .}}{\\*\\pnseclvl4\\pnlcltr\\pnstart1\\pnindent720\\pnhang {\\pntxta )}}{\\*\\pnseclvl5\\pndec\\pnstart1\\pnindent720\\pnhang {\\pntxtb (}{\\pntxta )}}{\\*\\pnseclvl6\\pnlcltr\\pnstart1\\pnindent720\\pnhang {\\pntxtb (}{\\pntxta )}}
{\\*\\pnseclvl7\\pnlcrm\\pnstart1\\pnindent720\\pnhang {\\pntxtb (}{\\pntxta )}}{\\*\\pnseclvl8\\pnlcltr\\pnstart1\\pnindent720\\pnhang {\\pntxtb (}{\\pntxta )}}{\\*\\pnseclvl9\\pnlcrm\\pnstart1\\pnindent720\\pnhang {\\pntxtb (}{\\pntxta )}}\\pard\\plain \\ltrpar
\\ql \\li0\\ri0\\widctlpar\\wrapdefault\\aspalpha\\aspnum\\faauto\\adjustright\\rin0\\lin0\\itap0\\pararsid3551130 \\rtlch\\fcs1 \\af37\\afs22\\alang1025 \\ltrch\\fcs0 \\f37\\fs22\\lang1033\\langfe1033\\cgrid\\langnp1033\\langfenp1033 {\\field\\fldedit{\\*\\fldinst {\\rtlch\\fcs1 \\af37 
\\ltrch\\fcs0 \\insrsid3551130  INCLUDEPICTURE "cid:image001.png@01D56274.7F955880" \\\\* MERGEFORMATINET }}{\\fldrslt {\\rtlch\\fcs1 \\af37 \\ltrch\\fcs0 \\insrsid3551130 {\\*\\shppict{\\pict{\\*\\picprop\\shplid1025{\\sp{\\sn shapeType}{\\sv 75}}{\\sp{\\sn fFlipH}{\\sv 0}}
{\\sp{\\sn fFlipV}{\\sv 0}}{\\sp{\\sn pibName}{\\sv cid:image001.png@01D56274.7F955880}}{\\sp{\\sn pibFlags}{\\sv 74}}{\\sp{\\sn fLine}{\\sv 0}}{\\sp{\\sn wzName}{\\sv Picture 1}}{\\sp{\\sn fLayoutInCell}{\\sv 1}}}
\\picscalex150\\picscaley150\\piccropl0\\piccropr0\\piccropt0\\piccropb0\\picw2258\\pich2258\\picwgoal1280\\pichgoal1280\\pngblip\\bliptag897655604{\\*\\blipuid 3581233405128f118ef6f8b80321bbf2}
89504e470d0a1a0a0000000d4948445200000080000000800803000000f4e091f90000006c504c5445ffffff030303353535cececefcfcfc0b0b0bededed8888
88f9f9f93e3e3ee1e1e14c4c4c1d1d1d232323f3f3f3171717797979292929c3c3c36a6a6a5e5e5e949494585858b4b4b4a6a6a6c9c9c9323232464646111111
646464bababa7c7c7cd8d8d8aaaaaa8e8e8e9d9d9d2a07e730000003d949444154789ced5adbb6aa300c6cbc00a27847515151ffff1f775a6029d0a32904fa70
3a2fdbbd16d0c0b4d3641a211c1c1c1c1c1c1c1cba616b3b80fdc4eef81e1ced0690c0d56e007348ad72104c016e36034800606733803d06b0b2c8816400c0a2
141c01a656394006e6000b6b1c4c5280c42607371cdc9b59e460870c881820b234fe6405108bd01e075bc98010c8c1da4e00c8c00cff3cad7110490684e2e064
63fc130e1cca1f234b1cac730684f02d71800cf8ea87e4603cfcf8e3920121ce5638b8039c8b9fc8c166f800ce2503426436389083661fc1dc870ea0f2d9fd37
1d83a1b2f82d70505b7a1f136220d43680fbe01cd4b6c0ca941c028d2460333007713d155d0fccc1a59e087e08f310f0a05112468372f06a1664c8c168b800b0
1aa9db02a72139f0b01e6b1823c8c193e1d94b59ef12b00aea772207e98880d9affc3199b61a5f786b52e4e7ece747c8466dc62746b0d6dd5947b0265f5a8d60
fc0db85fc1826ae7dcb0e88211e7a48e25b1738f7cbd875207e9836b780fd72d4c63a37b7c19f27ec932fe6d81cfda98662ca7a8cd5d1a047739a576c6534a2c
0ff2bb751617b5a8d276866e623873b4cf48f11997b6f359454f5e3b1ae45fb1c336d956120ae4f3a85bedde4112263e70aca4d69210ceb8b44449c2d5f4451e
72f6cd78d4b485242caff2f3dfb93cd47c321b48e918d3748838ddbb9791243ce5d5071e1d2f91d1b753356da72fd6e111c18e188117d1121f731c579408d4f8
ada5eb3bc20bc18d8aba89f777f8b400faab0f289e2806c09649d54172855132f67d05403a9b487009f63305952df2fb7426d0d56d3c904539415de7bd7110d3
4e499183b41f0ee6b4f3316dedcc018d2da2475f1c24d4736ac9411f87a9e417939faa070e963a6a97d7c3a1b9ef6b1c1c06e826b74a7c9a99cfab170e3412eb
97668a5f1d8e3c5d4d2005aebac98479e2a3cb7e1b3e26038e75893faa8a252bf2ff55657a1025cb08b257e1e35f95a01589cfa4517f1345db0481ec5578ff9b
6d2a09e276514b03f99b0a2403efa4bce1f8e41ecc3b116eb8e99db1fb6040ebf8c4955280bda940768b94ef973b3e59fd92bc182a13266e0e8a5e05513a063a
c72750e5606146703776ecca9372e599acfea1f48fb71dc3cd41d1ab205edf1d9f0f49e06dec900c8414c7e72d09bc8d1d79afc2966213dc0a49e06dec900742
f9cbfd364ad4224d5fac8d1dea488ceef8e492c0d9d8210f054d1c9f5c1280ef40fbacddf5bf40394453360ec6a0cd7bbee2a17215a6c60ee5379a3a3ea13af8
e1e1e0dccaf1519acdd2d811e6898f395012580eb4fdd68e0f4a020707870e09ee93e13075d2e9c0a2db6987838383838383c3ff813f76bb29ecdb4237f40000000049454e44ae426082}}{\\nonshppict{\\pict\\picscalex100\\picscaley100\\piccropl0\\piccropr0\\piccropt0\\piccropb0
\\picw3387\\pich3387\\picwgoal1920\\pichgoal1920\\wmetafile8\\bliptag897655604{\\*\\blipuid 3581233405128f118ef6f8b80321bbf2}0100090000034a22000000002122000000000400000003010800050000000b0200000000050000000c0281008100030000001e00040000000701040004000000
0701040021220000410b2000cc008000800000000000800080000000000028000000800000008000000001000800000000000000000000000000000000000000
00000000000000000000ffffff00c3c3c3005e5e5e00fcfcfc00ededed0003030300b4b4b400a6a6a600646464004c4c4c0011111100f9f9f9000b0b0b00baba
ba006a6a6a00171717001d1d1d003e3e3e009494940023232300e1e1e100797979008e8e8e00c9c9c9003535350088888800cecece00323232007c7c7c002929
2900d8d8d800464646009d9d9d00f3f3f300aaaaaa00585858000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000001010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010405010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010105010101010101010101010101010101010101010101010101010101
010101010101010101010101010101010101010101010101010101010101010101010101010101240e0101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101011717010101010101010101010101010101010101010101010101010101
0101010101010101010101010101010101010101010101010101010101010101010101010101011a06160c010101010101010101010101010101010101010101
010101010101010101010101010101010101010101010101010101010101010101050a061b010101010101010101010101010101010101010101010101010101
010101010101010101010101010101010101010101010101010101010101010101010101010101150606191f0101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010e11061c01010101010101010101010101010101010101010101010101010101
010101010101010101010101010101010101010101010101010101010101010101010101010101011c06060d2101010101010101010101010101010101010101
0101010101010101010101010101010101010101010101010101010101010c160606061d01010101010101010101010101010101010101010101010101010101
010101010101010101010101010101010101010101010101010101010101010101010101010101011a0606060624220101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101011519060606061b01010101010101010101010101010101010101010101010101010101
010101010101010101010101010101010101010101010101010101010101010101010101010101011b0606060606140201010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101230d060606061e0101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101011c0606060606061a040101010101010101010101010101
010101010101010101010101010101010101010101010101010122090606060d0606160101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101011606061c0b060606121501010101010101010101010101
010101010101010101010101010101010101010101010101011b1e060606140606061b0101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101011b06060615120606060b23010101010101010101010101
010101010101010101010101010101010101010101010101130d060606241a060614010101010101010101010101010101010101010101010101010101010101
0101010101010101010101010101010101010101010101010101010101010101010101010101010101011406061a041d06060606092201010101010101010101
01010101010101010101010101010101010101010101050a0606060b210119060616010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010116060612010102140606061e1b010101010101010101
0101010101010101010101010101010101010101010e110606061c1f011506060618010101010101010101010101010101010101010101010101010101010101
0101010101010101010101010101010101010101010101010101010101010101010101010101010101010206060615010122240606060d1a0101010101010101
01010101010101010101010101010101010101041d060606060f0c01011706061401010101010101010101010101010101010101010101010101010101010101
010101010101010101010101010101010101010101010101010101010101010101010101010101010101011406061301010101210b0606062015010101010101
01010101010101010101010101010101010115120606061007010101011206061601010101010101010101010101010101010101010101010101010101010101
010101010101010101010101010101010101010101010101010101010101010101010101010101010101010f06061201010101011f1906060610070101010101
0101010101010101010101010101010101230b060606201501010101150606060201010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101020606060501010101010c16060606060f0c010101
0101010101010101010101010101010c09060606061a010101010101130606140101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101040b060621010101010101010e110606061e1f0101
01010101010101010101010101011b1e0606061418010101010101011206060f0101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010f06060a0101010101010101050a0606060d1301
01010101010101010101010101130d06060624220101010101010115060606020101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010706060d05010101010101010101130d0606060a
0501010101010101010101050a0606060d2101010101010101010113060611040101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010c0b060608010101010101010101011f1e060606
110e010101010101010102110606061c1f010101010101010101011206060f010101010101010101010101010101010101010101010101010101010101010101
0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010306060a01010101010101010101010c0f0606
0606160c01010101041d060606060f0c010101010101010101010506060602010101010101010101010101010101010101010101010101010101010101010101
0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010706060d0c0101010101010101010101010710
060606191f0101151206060610070101010101010101010101011306061004010101010101010101010101010101010101010101010101010101010101010101
0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010c0d0606230101010101010101010101010115
200606060d21230b0606061215010101010101010101010101012006060f01010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101240606030101010101010101010101010101
011a0d060606060606061a0401010101010101010101010101050606060e01010101010101010101010101010101010101010101010101010101010101010101
010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010806060b0c01010101010101010101010101
01011b1e0606060614020101010101010101010101010101012106060b0401010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101220d06060701010101010101010101010101
010101220924242422010101010101010101010101010101010a0606090101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010a06060301010101010101010101010101
01010101010101010101010101010101010101010101010105060606070101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010806061004010101010101010101010101
0101010101010101010101010101010101010101010101010806060b040101010101010101010101010101010101010101010101010101010101010101010101
0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101050606060e010101010101010101010101
0101010101010101010101010101010101010101010101010a060603010101010101010101010101010101010101010101010101010101010101010101010101
0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010a06060f010101010101010101010101
0101010101010101010101010101010101010101010101050d060607010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010113060610040101010101010101010101
01010101010101010101010101010101010101010101010806060b0c010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010105060606020101010101010101010101
01010101010101010101010101010101010101010101010a06060301010101010101010101010101010101010101010101010101010101010101010101010101
010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101011206060f0101010101010101010101
010101010101010101010101010101010101010101010c0d06060701010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101130606140101010101010101010101
010101010101010101010101010101010101010101010806060d0c01010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101150606061801010101010101010101
01010101010101010101010101010101010101010101240606030101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101011906061601010101010101010101
01010101010101010101010101010101010101010101140606230101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101011a06061601010101010101010101
01010101010101010101010101010101010101010101140606150101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101152006061601010101010101010101
01010101010101010101010101010101010101010101140606110e01010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010107100606110e01010101010101010101
010101010101010101010101010101010101010101010514060606160c0101010101010101010101010101010101010101010101010101010101010101010101
010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010c0f060606110e0101010101010101010101
010101010101010101010101010101010101010101010105140606061c1f01010101010101010101010101010101010101010101010101010101010101010101
0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101011f1c060606110e010101010101010101010101
01010101010101010101010101010101010101010101010105200606060d21010101010101010101010101010101010101010101010101010101010101010101
0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101210d0606060a0501010101010101010101010101
0101010101010101010101010101010101010101010101010101170d060606242201010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010122240606060d13010101010101010101010101010101
0101010101010101010101010101010101010101010101010101011b1e0606061402010101010101010101010101010101010101010101010101010101010101
010101010101010101010101010101010101010101010101010101010101010101010101010101010118140606061e1b01010101010101010101010101010101
010101010101010101010101010101010101010101010101010101012209060606061d0401010101010101010101010101010101010101010101010101010101
010101010101010101010101010101010101010101010101010101010101010101010101010101011a0d06060609220101010101010101010101010101010101
010101010101010101010101010101010101010101010101010101010101230b0606061215010101010101010101010101010101010101010101010101010101
010101010101010101010101010101010101010101010101010101010101010101010101010105200606060b2301010101010101010101010101010101010101
0101010101010101010101010101010101010101010101010101010101010115120606060b230101010101010101010101010101010101010101010101010101
010101010101010101010101010101010101010101010101010101010101010101010101010e1006060619150101010101010101010101010101010101010101
0101010101010101010101010101010101010101010101010101010101010101041a060606060322010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010c1606060606160c010101010101010101010101010101010101010101
0101010101010101010101010101010101010101010101010101010101010101010118140606061e180101010101010101010101010101010101010101010101
010101010101010101010101010101010101010101010101010101010101010101011f19060606110e0101010101010101010101010101010101010101010101
010101010101010101010101010101010101010101010101010101010101010101010122240606060d1a01010101010101010101010101010101010101010101
010101010101010101010101010101010101010101010101010101010101010101080d0606060a05010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101080b06060620150101010101010101010101010101010101010101
0101010101010101010101010101010101010101010101010101010101010122240606060d170101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101011f190606060b0701010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010118140606061e1b010101010101010101010101010101010101010101010101010101
0101010101010101010101010101010101010101010101010101010101010101010101010101010c1d060606060f0c0101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101011a0d060606032201010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010e110606061e1b01010101010101010101010101010101
01010101010101010101010101010101010101010101010101010105200606060b23010101010101010101010101010101010101010101010101010101010101
010101010101010101010101010101010101010101010101010101010101010101010101010101010101050a0606060d13010101010101010101010101010101
01010101010101010101010101010101010101010101010101010e10060606191501010101010101010101010101010101010101010101010101010101010101
0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101130d0606060a0501010101010101010101010101
0101010101010101010101010101010101010101010101010c1606060606160c0101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101051b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1c060606110e010101010101010101010101
01010101010101010101010101010101010101010101011f19060606060606060606060606060606060606060606060606060606060606060606100c01010101
01010101010101010101010101010105160606060606060606060606060606060606060606060606060606060606060606060606160c01010101010101010101
01010101010101010101010101010101010101010101080d0606060606060606060606060606060606060606060606060606060606060606060606100c010101
01010101010101010101010101010516060606060606060606060606060606060606060606060606060606060606060606060606061c1f010101010101010101
010101010101010101010101010101010101010122030606060606060606060606060606060606060606060606060606060606060606060606060606100c0101
01010101010101010101010101011606060b19191919191919191919191919191919191919191919191919191919191919191919191912180101010101010101
010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101050d0606070101
01010101010101010101010101011406061701010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010a0606090101
01010101010101010101010101180606061501010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101210606100401
01010101010101010101010101160606190101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101050606060e01
010101010101010101010101011406061a0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101012006060f01
0101010101010101010101011b060606150101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101011306061104
0101010101010101010101011606061c010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101011506060602
0101010101010101010101011e06061a010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010112060616
01010101010101010101011f0606061f010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010117060614
01010101010101010101011d06061c01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010115060606
1b010101010101010101011c06061a01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101190606
160101010101010101011f0606061b01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101011a0606
1e0101010101010101011a06061c0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101011f0606
061f01010101010101011c06061d0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101011c06
061a010101010101011f0606061b0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101011d06
061c010101010101011a06061e010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101011b06
0606150101010101011c060616010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010114
06061a0101010101150606061b010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010116
06061201010101011a06061401010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010118
06060615010101011906061601010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
14060613010101150606061801010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
0f060612010101170606140101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
02060606050101120606160101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
04100606130115060606020101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
010f06060a0113060614010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
010e060606051206060f010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01040b06060806060602010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010306060a06061104010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010706060d06060f01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010c0d060606060201010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010103060606100401010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
010101080606060f0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
0101010c0d06060e0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
010101010a060b040101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101080609010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101050607010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010304010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010201010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101040000002701ffff030000000000}}}}}\\sectd \\ltrsect\\linex0\\endnhere\\sectdefaultcl\\sftnbj {\\rtlch\\fcs1 \\af37 
\\ltrch\\fcs0 \\insrsid2709252 
\\par }{\\*\\themedata 504b030414000600080000002100e9de0fbfff0000001c020000130000005b436f6e74656e745f54797065735d2e786d6cac91cb4ec3301045f748fc83e52d4a
9cb2400825e982c78ec7a27cc0c8992416c9d8b2a755fbf74cd25442a820166c2cd933f79e3be372bd1f07b5c3989ca74aaff2422b24eb1b475da5df374fd9ad
5689811a183c61a50f98f4babebc2837878049899a52a57be670674cb23d8e90721f90a4d2fa3802cb35762680fd800ecd7551dc18eb899138e3c943d7e503b6
b01d583deee5f99824e290b4ba3f364eac4a430883b3c092d4eca8f946c916422ecab927f52ea42b89a1cd59c254f919b0e85e6535d135a8de20f20b8c12c3b0
0c895fcf6720192de6bf3b9e89ecdbd6596cbcdd8eb28e7c365ecc4ec1ff1460f53fe813d3cc7f5b7f020000ffff0300504b030414000600080000002100a5d6
a7e7c0000000360100000b0000005f72656c732f2e72656c73848fcf6ac3300c87ef85bd83d17d51d2c31825762fa590432fa37d00e1287f68221bdb1bebdb4f
c7060abb0884a4eff7a93dfeae8bf9e194e720169aaa06c3e2433fcb68e1763dbf7f82c985a4a725085b787086a37bdbb55fbc50d1a33ccd311ba548b6309512
0f88d94fbc52ae4264d1c910d24a45db3462247fa791715fd71f989e19e0364cd3f51652d73760ae8fa8c9ffb3c330cc9e4fc17faf2ce545046e37944c69e462
a1a82fe353bd90a865aad41ed0b5b8f9d6fd010000ffff0300504b0304140006000800000021006b799616830000008a0000001c0000007468656d652f746865
6d652f7468656d654d616e616765722e786d6c0ccc4d0ac3201040e17da17790d93763bb284562b2cbaebbf600439c1a41c7a0d29fdbd7e5e38337cedf14d59b
4b0d592c9c070d8a65cd2e88b7f07c2ca71ba8da481cc52c6ce1c715e6e97818c9b48d13df49c873517d23d59085adb5dd20d6b52bd521ef2cdd5eb9246a3d8b
4757e8d3f729e245eb2b260a0238fd010000ffff0300504b0304140006000800000021007b43bc5d8d070000cf200000160000007468656d652f7468656d652f
7468656d65312e786d6cec595f8b1bc9117f0fe43b0cf32eebdf8cfe2c960f692479cfdeb58d253bdc63afd49a696fcfb4e86eed5a1c86e07bca4b207077e425
90b73c1cc71ddc418ebce4c3186c92cb874875cf68d42db5ecddc504137605cb4ceb57d5bfaeaaae2a75dffdec654abd0bcc056159cfafdfa9f91ece666c4eb2
b8e73f9b8e2b1ddf131265734459867bfe1a0bffb37bbffdcd5d7424139c620fe43371847a7e22e5f2a85a15331846e20e5be20cbe5b309e2209af3caece39ba
04bd29ad366ab556354524f3bd0ca5a0f6f1624166d89b2a95febd8df21185d74c0a3530a37ca254634b4263e7e77585106b1151ee5d20daf3619e39bb9ce297
d2f7281212bee8f935fde757efddada2a34288ca03b286dc58ff157285c0fcbca1e7e4f1593969108441ab5fead7002af771a3f6a8356a95fa3400cd66b0d29c
8badb3dd8882026b80f24787ee617bd8ac5b78437f738f733f541f0baf41b9fe600f3f1e4760450baf41393edcc38783ee6068ebd7a01cdfdac3b76bfd61d0b6
f46b50424976be87ae85ad66b4596d0959307aec8477c360dc6e14cab728888632bad4140b96c943b196a2178c8f01a0801449927972bdc40b3483288e102567
9c7827244e20f096286302866b8ddab8d684ffea13e827ed5174849121ad780113b137a4f87862c6c952f6fc07a0d537206f7ff9e5cdeb9fdfbcfefb9bafbe7a
f3fa87626eadca923b46596ccafdfab73ffde72fbff7fefdd35f7ffdfa9b7cea5dbc30f1efbeffc3bb7ffcf37dea61c55b53bcfdf6c7773ffff8f6cf7ffcd777
5f3bb4f7393a33e1539262e13dc297de5396c2021dfcf119bf9ec43441c494e867b1401952b338f48f6462a11fad11450edc00db767cce21d5b880f7572f2cc2
9384af2471687c98a416f094313a60dc6985876a2ec3ccd35516bb27e72b13f714a10bd7dc11ca2c2f8f564bc8b1c4a5324ab045f30945994431ceb0f4d477ec
1c63c7eabe20c4b2eb29997126d8427a5f106f8088d32453726645d356e898a4e097b58b20f8dbb2cde9736fc0a86bd5437c6123616f20ea203fc5d432e37db4
922875a99ca2949a063f413271919cacf9ccc48d84044fc798326f34c742b8641e7358afe1f4879066dc6e3fa5ebd4467249ce5d3a4f10632672c8cea304a54b
177642b2c4c47e2ece214491f7844917fc94d93b44bd831f5076d0ddcf09b6dcfde16cf00c32ac49691b20ea9b1577f8f23e6656fc4ed67481b02bd5f4796aa5
d83e27cee818ac622bb44f30a6e812cd31f69e7dee6030604bcbe65bd20f12c82ac7d815580f901dabea3dc3027a25d5dcece7c91322ac909de0981de073bade
493c6b94a5881fd2fc08bc6eda7c04a52e7505c0633a3b37818f08f480102f4ea33c16a0c308ee835a9f24c82a60ea5db8e375cd2dff5d658fc1be7c61d1b8c2
be04197c6d1948eca6cc7b6d3345d49a601b3053045d862bdd8288e5fead882aae5a6ce5945bd89b76eb06e88eaca62725d9073ba09dde27fcdff43e8eddf071
ba1eb7622b655db3df3994528e77ba9c43b8ddde26627c4e3efdd6668856d9130cd5643f6fdd7636b79d8dff7fdfd91cdacfb7fdcca1aee3b69ff1a1cfb8ed67
8a23968fd3cf6c5b18e86ed4b1477edca30f7fd283673f0b42e944ae293e11faf847c0af9af91806959c3ef7c4e559e032814755e660020b1773a4653ccee4ef
884c26095ac21951dd574a6251a88e85b764028e8ef4b053b7c2d3557acae6f99167bdae8e37f3ca2a90dc8ed7c2721c8eab648e6eb5b7c778a57acd36d6c7ad
1b024af63a248cc96c124d0789f6665019491fee82d11c24f4ca3e0a8bae834547a9dfb86a8f05502bbd023fbb3df8b1def3c3004440084ee5a0459f2b3fe5ae
de78573bf3637afa9031ad0880367b13015b4f7715d783cb53abcb43ed0a9eb64818e16693d096d10d9e48e0c770119d6af42a34aeebebeed6a5163d650a3d1f
84d69646bbf33e1637f535c8ede6069a99998266de65cf6f35430899195af6fc051c1dc363ba84d811ea9717a231dcbfcc24cf37fc4d32cb920b394422c90dae
934e9e0d522231f728497bbe5a7ee9069ae91ca2b9d51b90103e59725d482b9f1a3970baed64bc58e09934dd6e8c284be7af90e1f35ce1fc568bdf1cac24d90a
dc3d49e697de195df1a708422c6cd79501e744c00d423db7e69cc0955899c8b6f1b753988ab46bde49e918cac7115d26a8a8286632cfe13a959774f45b6903e3
ad583318d430495108cf6255604da35ad5b4ac1a39878355f7c342ca7246d2dcd64c2baba8aae9ce62d60c9b32b063cb9b157983d5c6c490d3cc0a9fa7eedd94
dbdde4ba9d3ea1ac1260f0d27e8eaa7b85826050db4e6651538cf7d3b0cad9c5a85d3b360bfc00b5ab140923ebb7366a77ec56d608e7743078a3ca0f72bb510b
438b4d5fa92dadefcecdeb6d76f60292c710badc159542bb12ce7739828668a27b923c6dc01679298bad014fde8a939eff652dec0751238c2ab54e38aa04cda0
56e984fd66a51f86cdfa28acd78683c62b282c3249eb617e6f3f866b0cba2e6eeff5f8de0d7ebab9a9b933636995e91bfaaa26ae6ff0eb8dc337f81e81a4f365
ab31ee36bb8356a5dbec8f2bc170d0a974a3d6a0326c45ede17818859deef895ef5d6870d06f46416bd4a9b4ea5154095a3545bfd3adb48346a31fb4fb9d51d0
7f55b431b0f23c7d14b600f36a5ef7fe0b0000ffff0300504b0304140006000800000021000dd1909fb60000001b010000270000007468656d652f7468656d65
2f5f72656c732f7468656d654d616e616765722e786d6c2e72656c73848f4d0ac2301484f78277086f6fd3ba109126dd88d0add40384e4350d363f2451eced0d
ae2c082e8761be9969bb979dc9136332de3168aa1a083ae995719ac16db8ec8e4052164e89d93b64b060828e6f37ed1567914b284d262452282e3198720e274a
939cd08a54f980ae38a38f56e422a3a641c8bbd048f7757da0f19b017cc524bd62107bd5001996509affb3fd381a89672f1f165dfe514173d9850528a2c6cce0
239baa4c04ca5bbabac4df000000ffff0300504b01022d0014000600080000002100e9de0fbfff0000001c020000130000000000000000000000000000000000
5b436f6e74656e745f54797065735d2e786d6c504b01022d0014000600080000002100a5d6a7e7c0000000360100000b00000000000000000000000000300100
005f72656c732f2e72656c73504b01022d00140006000800000021006b799616830000008a0000001c00000000000000000000000000190200007468656d652f
7468656d652f7468656d654d616e616765722e786d6c504b01022d00140006000800000021007b43bc5d8d070000cf2000001600000000000000000000000000
d60200007468656d652f7468656d652f7468656d65312e786d6c504b01022d00140006000800000021000dd1909fb60000001b01000027000000000000000000
00000000970a00007468656d652f7468656d652f5f72656c732f7468656d654d616e616765722e786d6c2e72656c73504b050600000000050005005d010000920b00000000}
{\\*\\colorschememapping 3c3f786d6c2076657273696f6e3d22312e302220656e636f64696e673d225554462d3822207374616e64616c6f6e653d22796573223f3e0d0a3c613a636c724d
617020786d6c6e733a613d22687474703a2f2f736368656d61732e6f70656e786d6c666f726d6174732e6f72672f64726177696e676d6c2f323030362f6d6169
6e22206267313d226c743122207478313d22646b3122206267323d226c743222207478323d22646b322220616363656e74313d22616363656e74312220616363
656e74323d22616363656e74322220616363656e74333d22616363656e74332220616363656e74343d22616363656e74342220616363656e74353d22616363656e74352220616363656e74363d22616363656e74362220686c696e6b3d22686c696e6b2220666f6c486c696e6b3d22666f6c486c696e6b222f3e}
{\\*\\latentstyles\\lsdstimax375\\lsdlockeddef0\\lsdsemihiddendef0\\lsdunhideuseddef0\\lsdqformatdef0\\lsdprioritydef99{\\lsdlockedexcept \\lsdqformat1 \\lsdpriority0 \\lsdlocked0 Normal;\\lsdqformat1 \\lsdpriority9 \\lsdlocked0 heading 1;
\\lsdsemihidden1 \\lsdunhideused1 \\lsdqformat1 \\lsdpriority9 \\lsdlocked0 heading 2;\\lsdsemihidden1 \\lsdunhideused1 \\lsdqformat1 \\lsdpriority9 \\lsdlocked0 heading 3;\\lsdsemihidden1 \\lsdunhideused1 \\lsdqformat1 \\lsdpriority9 \\lsdlocked0 heading 4;
\\lsdsemihidden1 \\lsdunhideused1 \\lsdqformat1 \\lsdpriority9 \\lsdlocked0 heading 5;\\lsdsemihidden1 \\lsdunhideused1 \\lsdqformat1 \\lsdpriority9 \\lsdlocked0 heading 6;\\lsdsemihidden1 \\lsdunhideused1 \\lsdqformat1 \\lsdpriority9 \\lsdlocked0 heading 7;
\\lsdsemihidden1 \\lsdunhideused1 \\lsdqformat1 \\lsdpriority9 \\lsdlocked0 heading 8;\\lsdsemihidden1 \\lsdunhideused1 \\lsdqformat1 \\lsdpriority9 \\lsdlocked0 heading 9;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 index 1;
\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 index 2;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 index 3;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 index 4;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 index 5;
\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 index 6;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 index 7;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 index 8;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 index 9;
\\lsdsemihidden1 \\lsdunhideused1 \\lsdpriority39 \\lsdlocked0 toc 1;\\lsdsemihidden1 \\lsdunhideused1 \\lsdpriority39 \\lsdlocked0 toc 2;\\lsdsemihidden1 \\lsdunhideused1 \\lsdpriority39 \\lsdlocked0 toc 3;
\\lsdsemihidden1 \\lsdunhideused1 \\lsdpriority39 \\lsdlocked0 toc 4;\\lsdsemihidden1 \\lsdunhideused1 \\lsdpriority39 \\lsdlocked0 toc 5;\\lsdsemihidden1 \\lsdunhideused1 \\lsdpriority39 \\lsdlocked0 toc 6;
\\lsdsemihidden1 \\lsdunhideused1 \\lsdpriority39 \\lsdlocked0 toc 7;\\lsdsemihidden1 \\lsdunhideused1 \\lsdpriority39 \\lsdlocked0 toc 8;\\lsdsemihidden1 \\lsdunhideused1 \\lsdpriority39 \\lsdlocked0 toc 9;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Normal Indent;
\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 footnote text;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 annotation text;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 header;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 footer;
\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 index heading;\\lsdsemihidden1 \\lsdunhideused1 \\lsdqformat1 \\lsdpriority35 \\lsdlocked0 caption;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 table of figures;
\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 envelope address;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 envelope return;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 footnote reference;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 annotation reference;
\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 line number;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 page number;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 endnote reference;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 endnote text;
\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 table of authorities;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 macro;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 toa heading;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 List;
\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 List Bullet;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 List Number;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 List 2;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 List 3;
\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 List 4;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 List 5;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 List Bullet 2;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 List Bullet 3;
\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 List Bullet 4;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 List Bullet 5;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 List Number 2;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 List Number 3;
\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 List Number 4;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 List Number 5;\\lsdqformat1 \\lsdpriority10 \\lsdlocked0 Title;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Closing;
\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Signature;\\lsdsemihidden1 \\lsdunhideused1 \\lsdpriority1 \\lsdlocked0 Default Paragraph Font;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Body Text;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Body Text Indent;
\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 List Continue;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 List Continue 2;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 List Continue 3;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 List Continue 4;
\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 List Continue 5;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Message Header;\\lsdqformat1 \\lsdpriority11 \\lsdlocked0 Subtitle;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Salutation;
\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Date;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Body Text First Indent;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Body Text First Indent 2;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Note Heading;
\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Body Text 2;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Body Text 3;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Body Text Indent 2;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Body Text Indent 3;
\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Block Text;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Hyperlink;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 FollowedHyperlink;\\lsdqformat1 \\lsdpriority22 \\lsdlocked0 Strong;
\\lsdqformat1 \\lsdpriority20 \\lsdlocked0 Emphasis;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Document Map;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Plain Text;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 E-mail Signature;
\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 HTML Top of Form;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 HTML Bottom of Form;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Normal (Web);\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 HTML Acronym;
\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 HTML Address;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 HTML Cite;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 HTML Code;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 HTML Definition;
\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 HTML Keyboard;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 HTML Preformatted;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 HTML Sample;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 HTML Typewriter;
\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 HTML Variable;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Normal Table;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 annotation subject;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 No List;
\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Outline List 1;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Outline List 2;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Outline List 3;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Table Simple 1;
\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Table Simple 2;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Table Simple 3;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Table Classic 1;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Table Classic 2;
\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Table Classic 3;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Table Classic 4;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Table Colorful 1;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Table Colorful 2;
\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Table Colorful 3;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Table Columns 1;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Table Columns 2;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Table Columns 3;
\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Table Columns 4;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Table Columns 5;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Table Grid 1;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Table Grid 2;
\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Table Grid 3;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Table Grid 4;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Table Grid 5;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Table Grid 6;
\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Table Grid 7;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Table Grid 8;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Table List 1;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Table List 2;
\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Table List 3;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Table List 4;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Table List 5;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Table List 6;
\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Table List 7;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Table List 8;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Table 3D effects 1;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Table 3D effects 2;
\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Table 3D effects 3;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Table Contemporary;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Table Elegant;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Table Professional;
\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Table Subtle 1;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Table Subtle 2;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Table Web 1;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Table Web 2;
\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Table Web 3;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Balloon Text;\\lsdpriority39 \\lsdlocked0 Table Grid;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Table Theme;\\lsdsemihidden1 \\lsdlocked0 Placeholder Text;
\\lsdqformat1 \\lsdpriority1 \\lsdlocked0 No Spacing;\\lsdpriority60 \\lsdlocked0 Light Shading;\\lsdpriority61 \\lsdlocked0 Light List;\\lsdpriority62 \\lsdlocked0 Light Grid;\\lsdpriority63 \\lsdlocked0 Medium Shading 1;\\lsdpriority64 \\lsdlocked0 Medium Shading 2;
\\lsdpriority65 \\lsdlocked0 Medium List 1;\\lsdpriority66 \\lsdlocked0 Medium List 2;\\lsdpriority67 \\lsdlocked0 Medium Grid 1;\\lsdpriority68 \\lsdlocked0 Medium Grid 2;\\lsdpriority69 \\lsdlocked0 Medium Grid 3;\\lsdpriority70 \\lsdlocked0 Dark List;
\\lsdpriority71 \\lsdlocked0 Colorful Shading;\\lsdpriority72 \\lsdlocked0 Colorful List;\\lsdpriority73 \\lsdlocked0 Colorful Grid;\\lsdpriority60 \\lsdlocked0 Light Shading Accent 1;\\lsdpriority61 \\lsdlocked0 Light List Accent 1;
\\lsdpriority62 \\lsdlocked0 Light Grid Accent 1;\\lsdpriority63 \\lsdlocked0 Medium Shading 1 Accent 1;\\lsdpriority64 \\lsdlocked0 Medium Shading 2 Accent 1;\\lsdpriority65 \\lsdlocked0 Medium List 1 Accent 1;\\lsdsemihidden1 \\lsdlocked0 Revision;
\\lsdqformat1 \\lsdpriority34 \\lsdlocked0 List Paragraph;\\lsdqformat1 \\lsdpriority29 \\lsdlocked0 Quote;\\lsdqformat1 \\lsdpriority30 \\lsdlocked0 Intense Quote;\\lsdpriority66 \\lsdlocked0 Medium List 2 Accent 1;\\lsdpriority67 \\lsdlocked0 Medium Grid 1 Accent 1;
\\lsdpriority68 \\lsdlocked0 Medium Grid 2 Accent 1;\\lsdpriority69 \\lsdlocked0 Medium Grid 3 Accent 1;\\lsdpriority70 \\lsdlocked0 Dark List Accent 1;\\lsdpriority71 \\lsdlocked0 Colorful Shading Accent 1;\\lsdpriority72 \\lsdlocked0 Colorful List Accent 1;
\\lsdpriority73 \\lsdlocked0 Colorful Grid Accent 1;\\lsdpriority60 \\lsdlocked0 Light Shading Accent 2;\\lsdpriority61 \\lsdlocked0 Light List Accent 2;\\lsdpriority62 \\lsdlocked0 Light Grid Accent 2;\\lsdpriority63 \\lsdlocked0 Medium Shading 1 Accent 2;
\\lsdpriority64 \\lsdlocked0 Medium Shading 2 Accent 2;\\lsdpriority65 \\lsdlocked0 Medium List 1 Accent 2;\\lsdpriority66 \\lsdlocked0 Medium List 2 Accent 2;\\lsdpriority67 \\lsdlocked0 Medium Grid 1 Accent 2;\\lsdpriority68 \\lsdlocked0 Medium Grid 2 Accent 2;
\\lsdpriority69 \\lsdlocked0 Medium Grid 3 Accent 2;\\lsdpriority70 \\lsdlocked0 Dark List Accent 2;\\lsdpriority71 \\lsdlocked0 Colorful Shading Accent 2;\\lsdpriority72 \\lsdlocked0 Colorful List Accent 2;\\lsdpriority73 \\lsdlocked0 Colorful Grid Accent 2;
\\lsdpriority60 \\lsdlocked0 Light Shading Accent 3;\\lsdpriority61 \\lsdlocked0 Light List Accent 3;\\lsdpriority62 \\lsdlocked0 Light Grid Accent 3;\\lsdpriority63 \\lsdlocked0 Medium Shading 1 Accent 3;\\lsdpriority64 \\lsdlocked0 Medium Shading 2 Accent 3;
\\lsdpriority65 \\lsdlocked0 Medium List 1 Accent 3;\\lsdpriority66 \\lsdlocked0 Medium List 2 Accent 3;\\lsdpriority67 \\lsdlocked0 Medium Grid 1 Accent 3;\\lsdpriority68 \\lsdlocked0 Medium Grid 2 Accent 3;\\lsdpriority69 \\lsdlocked0 Medium Grid 3 Accent 3;
\\lsdpriority70 \\lsdlocked0 Dark List Accent 3;\\lsdpriority71 \\lsdlocked0 Colorful Shading Accent 3;\\lsdpriority72 \\lsdlocked0 Colorful List Accent 3;\\lsdpriority73 \\lsdlocked0 Colorful Grid Accent 3;\\lsdpriority60 \\lsdlocked0 Light Shading Accent 4;
\\lsdpriority61 \\lsdlocked0 Light List Accent 4;\\lsdpriority62 \\lsdlocked0 Light Grid Accent 4;\\lsdpriority63 \\lsdlocked0 Medium Shading 1 Accent 4;\\lsdpriority64 \\lsdlocked0 Medium Shading 2 Accent 4;\\lsdpriority65 \\lsdlocked0 Medium List 1 Accent 4;
\\lsdpriority66 \\lsdlocked0 Medium List 2 Accent 4;\\lsdpriority67 \\lsdlocked0 Medium Grid 1 Accent 4;\\lsdpriority68 \\lsdlocked0 Medium Grid 2 Accent 4;\\lsdpriority69 \\lsdlocked0 Medium Grid 3 Accent 4;\\lsdpriority70 \\lsdlocked0 Dark List Accent 4;
\\lsdpriority71 \\lsdlocked0 Colorful Shading Accent 4;\\lsdpriority72 \\lsdlocked0 Colorful List Accent 4;\\lsdpriority73 \\lsdlocked0 Colorful Grid Accent 4;\\lsdpriority60 \\lsdlocked0 Light Shading Accent 5;\\lsdpriority61 \\lsdlocked0 Light List Accent 5;
\\lsdpriority62 \\lsdlocked0 Light Grid Accent 5;\\lsdpriority63 \\lsdlocked0 Medium Shading 1 Accent 5;\\lsdpriority64 \\lsdlocked0 Medium Shading 2 Accent 5;\\lsdpriority65 \\lsdlocked0 Medium List 1 Accent 5;\\lsdpriority66 \\lsdlocked0 Medium List 2 Accent 5;
\\lsdpriority67 \\lsdlocked0 Medium Grid 1 Accent 5;\\lsdpriority68 \\lsdlocked0 Medium Grid 2 Accent 5;\\lsdpriority69 \\lsdlocked0 Medium Grid 3 Accent 5;\\lsdpriority70 \\lsdlocked0 Dark List Accent 5;\\lsdpriority71 \\lsdlocked0 Colorful Shading Accent 5;
\\lsdpriority72 \\lsdlocked0 Colorful List Accent 5;\\lsdpriority73 \\lsdlocked0 Colorful Grid Accent 5;\\lsdpriority60 \\lsdlocked0 Light Shading Accent 6;\\lsdpriority61 \\lsdlocked0 Light List Accent 6;\\lsdpriority62 \\lsdlocked0 Light Grid Accent 6;
\\lsdpriority63 \\lsdlocked0 Medium Shading 1 Accent 6;\\lsdpriority64 \\lsdlocked0 Medium Shading 2 Accent 6;\\lsdpriority65 \\lsdlocked0 Medium List 1 Accent 6;\\lsdpriority66 \\lsdlocked0 Medium List 2 Accent 6;
\\lsdpriority67 \\lsdlocked0 Medium Grid 1 Accent 6;\\lsdpriority68 \\lsdlocked0 Medium Grid 2 Accent 6;\\lsdpriority69 \\lsdlocked0 Medium Grid 3 Accent 6;\\lsdpriority70 \\lsdlocked0 Dark List Accent 6;\\lsdpriority71 \\lsdlocked0 Colorful Shading Accent 6;
\\lsdpriority72 \\lsdlocked0 Colorful List Accent 6;\\lsdpriority73 \\lsdlocked0 Colorful Grid Accent 6;\\lsdqformat1 \\lsdpriority19 \\lsdlocked0 Subtle Emphasis;\\lsdqformat1 \\lsdpriority21 \\lsdlocked0 Intense Emphasis;
\\lsdqformat1 \\lsdpriority31 \\lsdlocked0 Subtle Reference;\\lsdqformat1 \\lsdpriority32 \\lsdlocked0 Intense Reference;\\lsdqformat1 \\lsdpriority33 \\lsdlocked0 Book Title;\\lsdsemihidden1 \\lsdunhideused1 \\lsdpriority37 \\lsdlocked0 Bibliography;
\\lsdsemihidden1 \\lsdunhideused1 \\lsdqformat1 \\lsdpriority39 \\lsdlocked0 TOC Heading;\\lsdpriority41 \\lsdlocked0 Plain Table 1;\\lsdpriority42 \\lsdlocked0 Plain Table 2;\\lsdpriority43 \\lsdlocked0 Plain Table 3;\\lsdpriority44 \\lsdlocked0 Plain Table 4;
\\lsdpriority45 \\lsdlocked0 Plain Table 5;\\lsdpriority40 \\lsdlocked0 Grid Table Light;\\lsdpriority46 \\lsdlocked0 Grid Table 1 Light;\\lsdpriority47 \\lsdlocked0 Grid Table 2;\\lsdpriority48 \\lsdlocked0 Grid Table 3;\\lsdpriority49 \\lsdlocked0 Grid Table 4;
\\lsdpriority50 \\lsdlocked0 Grid Table 5 Dark;\\lsdpriority51 \\lsdlocked0 Grid Table 6 Colorful;\\lsdpriority52 \\lsdlocked0 Grid Table 7 Colorful;\\lsdpriority46 \\lsdlocked0 Grid Table 1 Light Accent 1;\\lsdpriority47 \\lsdlocked0 Grid Table 2 Accent 1;
\\lsdpriority48 \\lsdlocked0 Grid Table 3 Accent 1;\\lsdpriority49 \\lsdlocked0 Grid Table 4 Accent 1;\\lsdpriority50 \\lsdlocked0 Grid Table 5 Dark Accent 1;\\lsdpriority51 \\lsdlocked0 Grid Table 6 Colorful Accent 1;
\\lsdpriority52 \\lsdlocked0 Grid Table 7 Colorful Accent 1;\\lsdpriority46 \\lsdlocked0 Grid Table 1 Light Accent 2;\\lsdpriority47 \\lsdlocked0 Grid Table 2 Accent 2;\\lsdpriority48 \\lsdlocked0 Grid Table 3 Accent 2;
\\lsdpriority49 \\lsdlocked0 Grid Table 4 Accent 2;\\lsdpriority50 \\lsdlocked0 Grid Table 5 Dark Accent 2;\\lsdpriority51 \\lsdlocked0 Grid Table 6 Colorful Accent 2;\\lsdpriority52 \\lsdlocked0 Grid Table 7 Colorful Accent 2;
\\lsdpriority46 \\lsdlocked0 Grid Table 1 Light Accent 3;\\lsdpriority47 \\lsdlocked0 Grid Table 2 Accent 3;\\lsdpriority48 \\lsdlocked0 Grid Table 3 Accent 3;\\lsdpriority49 \\lsdlocked0 Grid Table 4 Accent 3;
\\lsdpriority50 \\lsdlocked0 Grid Table 5 Dark Accent 3;\\lsdpriority51 \\lsdlocked0 Grid Table 6 Colorful Accent 3;\\lsdpriority52 \\lsdlocked0 Grid Table 7 Colorful Accent 3;\\lsdpriority46 \\lsdlocked0 Grid Table 1 Light Accent 4;
\\lsdpriority47 \\lsdlocked0 Grid Table 2 Accent 4;\\lsdpriority48 \\lsdlocked0 Grid Table 3 Accent 4;\\lsdpriority49 \\lsdlocked0 Grid Table 4 Accent 4;\\lsdpriority50 \\lsdlocked0 Grid Table 5 Dark Accent 4;
\\lsdpriority51 \\lsdlocked0 Grid Table 6 Colorful Accent 4;\\lsdpriority52 \\lsdlocked0 Grid Table 7 Colorful Accent 4;\\lsdpriority46 \\lsdlocked0 Grid Table 1 Light Accent 5;\\lsdpriority47 \\lsdlocked0 Grid Table 2 Accent 5;
\\lsdpriority48 \\lsdlocked0 Grid Table 3 Accent 5;\\lsdpriority49 \\lsdlocked0 Grid Table 4 Accent 5;\\lsdpriority50 \\lsdlocked0 Grid Table 5 Dark Accent 5;\\lsdpriority51 \\lsdlocked0 Grid Table 6 Colorful Accent 5;
\\lsdpriority52 \\lsdlocked0 Grid Table 7 Colorful Accent 5;\\lsdpriority46 \\lsdlocked0 Grid Table 1 Light Accent 6;\\lsdpriority47 \\lsdlocked0 Grid Table 2 Accent 6;\\lsdpriority48 \\lsdlocked0 Grid Table 3 Accent 6;
\\lsdpriority49 \\lsdlocked0 Grid Table 4 Accent 6;\\lsdpriority50 \\lsdlocked0 Grid Table 5 Dark Accent 6;\\lsdpriority51 \\lsdlocked0 Grid Table 6 Colorful Accent 6;\\lsdpriority52 \\lsdlocked0 Grid Table 7 Colorful Accent 6;
\\lsdpriority46 \\lsdlocked0 List Table 1 Light;\\lsdpriority47 \\lsdlocked0 List Table 2;\\lsdpriority48 \\lsdlocked0 List Table 3;\\lsdpriority49 \\lsdlocked0 List Table 4;\\lsdpriority50 \\lsdlocked0 List Table 5 Dark;
\\lsdpriority51 \\lsdlocked0 List Table 6 Colorful;\\lsdpriority52 \\lsdlocked0 List Table 7 Colorful;\\lsdpriority46 \\lsdlocked0 List Table 1 Light Accent 1;\\lsdpriority47 \\lsdlocked0 List Table 2 Accent 1;\\lsdpriority48 \\lsdlocked0 List Table 3 Accent 1;
\\lsdpriority49 \\lsdlocked0 List Table 4 Accent 1;\\lsdpriority50 \\lsdlocked0 List Table 5 Dark Accent 1;\\lsdpriority51 \\lsdlocked0 List Table 6 Colorful Accent 1;\\lsdpriority52 \\lsdlocked0 List Table 7 Colorful Accent 1;
\\lsdpriority46 \\lsdlocked0 List Table 1 Light Accent 2;\\lsdpriority47 \\lsdlocked0 List Table 2 Accent 2;\\lsdpriority48 \\lsdlocked0 List Table 3 Accent 2;\\lsdpriority49 \\lsdlocked0 List Table 4 Accent 2;
\\lsdpriority50 \\lsdlocked0 List Table 5 Dark Accent 2;\\lsdpriority51 \\lsdlocked0 List Table 6 Colorful Accent 2;\\lsdpriority52 \\lsdlocked0 List Table 7 Colorful Accent 2;\\lsdpriority46 \\lsdlocked0 List Table 1 Light Accent 3;
\\lsdpriority47 \\lsdlocked0 List Table 2 Accent 3;\\lsdpriority48 \\lsdlocked0 List Table 3 Accent 3;\\lsdpriority49 \\lsdlocked0 List Table 4 Accent 3;\\lsdpriority50 \\lsdlocked0 List Table 5 Dark Accent 3;
\\lsdpriority51 \\lsdlocked0 List Table 6 Colorful Accent 3;\\lsdpriority52 \\lsdlocked0 List Table 7 Colorful Accent 3;\\lsdpriority46 \\lsdlocked0 List Table 1 Light Accent 4;\\lsdpriority47 \\lsdlocked0 List Table 2 Accent 4;
\\lsdpriority48 \\lsdlocked0 List Table 3 Accent 4;\\lsdpriority49 \\lsdlocked0 List Table 4 Accent 4;\\lsdpriority50 \\lsdlocked0 List Table 5 Dark Accent 4;\\lsdpriority51 \\lsdlocked0 List Table 6 Colorful Accent 4;
\\lsdpriority52 \\lsdlocked0 List Table 7 Colorful Accent 4;\\lsdpriority46 \\lsdlocked0 List Table 1 Light Accent 5;\\lsdpriority47 \\lsdlocked0 List Table 2 Accent 5;\\lsdpriority48 \\lsdlocked0 List Table 3 Accent 5;
\\lsdpriority49 \\lsdlocked0 List Table 4 Accent 5;\\lsdpriority50 \\lsdlocked0 List Table 5 Dark Accent 5;\\lsdpriority51 \\lsdlocked0 List Table 6 Colorful Accent 5;\\lsdpriority52 \\lsdlocked0 List Table 7 Colorful Accent 5;
\\lsdpriority46 \\lsdlocked0 List Table 1 Light Accent 6;\\lsdpriority47 \\lsdlocked0 List Table 2 Accent 6;\\lsdpriority48 \\lsdlocked0 List Table 3 Accent 6;\\lsdpriority49 \\lsdlocked0 List Table 4 Accent 6;
\\lsdpriority50 \\lsdlocked0 List Table 5 Dark Accent 6;\\lsdpriority51 \\lsdlocked0 List Table 6 Colorful Accent 6;\\lsdpriority52 \\lsdlocked0 List Table 7 Colorful Accent 6;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Mention;
\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Smart Hyperlink;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Hashtag;\\lsdsemihidden1 \\lsdunhideused1 \\lsdlocked0 Unresolved Mention;}}{\\*\\datastore 010500000200000018000000
4d73786d6c322e534158584d4c5265616465722e362e3000000000000000000000060000
d0cf11e0a1b11ae1000000000000000000000000000000003e000300feff090006000000000000000000000001000000010000000000000000100000feffffff00000000feffffff0000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
fffffffffffffffffdfffffffeffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
ffffffffffffffffffffffffffffffff52006f006f007400200045006e00740072007900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000016000500ffffffffffffffffffffffff0c6ad98892f1d411a65f0040963251e50000000000000000000000003073
2b87fc62d501feffffff00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffff00000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000
000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffff000000000000000000000000000000000000000000000000
0000000000000000000000000000000000000000000000000105000000000000}}`;
    let elem: HTMLElement = createElement('p', {
     id: 'imagePaste', innerHTML: localElem
   });
   editorObj = new EditorManager({ document: document, editableElement: document.getElementById('content-edit') });
   let elem1: HTMLElement = createElement('p', {
     id: 'imagePaste', innerHTML: localElem1
   });
   (editorObj.msWordPaste as any).breakLineAddition(elem1);
   (editorObj.msWordPaste as any).imageConversion(elem, rtfData);
   expect(elem.querySelectorAll('img')[0].getAttribute('src').indexOf('base64') >= 0);
  });

  afterAll(() => {
    rteObj.destroy();
  });
});
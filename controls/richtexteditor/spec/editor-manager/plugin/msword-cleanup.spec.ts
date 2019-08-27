/**
 * Paste CleanUp spec
 */
import { EditorManager } from '../../../src/editor-manager/index';
import { RichTextEditor } from '../../../src/rich-text-editor/base/rich-text-editor';
import { PasteCleanup } from '../../../src/rich-text-editor/actions/paste-clean-up';
import { renderRTE, setCursorPoint } from '../../rich-text-editor/render.spec';
import {
  CLS_RTE_PASTE_KEEP_FORMAT, CLS_RTE_PASTE_OK,
} from '../../../src/rich-text-editor/base/classes';
RichTextEditor.Inject(PasteCleanup);

describe('MSWord List Conversion testing', () => {
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

  afterAll(() => {
    rteObj.destroy();
  });
});
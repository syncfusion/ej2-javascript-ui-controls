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
    rteObj.element.getElementsByTagName('textarea')[0].focus();
    setCursorPoint(rteObj.element.getElementsByTagName('textarea')[0], 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let allElem: any = rteObj.element.getElementsByTagName('textarea')[0].firstElementChild.querySelectorAll('*');
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
    rteObj.element.getElementsByTagName('textarea')[0].focus();
    setCursorPoint(rteObj.element.getElementsByTagName('textarea')[0], 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let allElem: any = rteObj.element.getElementsByTagName('textarea')[0].firstElementChild.querySelectorAll('*');
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
    rteObj.element.getElementsByTagName('textarea')[0].focus();
    setCursorPoint(rteObj.element.getElementsByTagName('textarea')[0], 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let allElem: any = rteObj.element.getElementsByTagName('textarea')[0].firstElementChild.querySelectorAll('*');
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
    rteObj.element.getElementsByTagName('textarea')[0].focus();
    setCursorPoint(rteObj.element.getElementsByTagName('textarea')[0], 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let allElem: any = rteObj.element.getElementsByTagName('textarea')[0].firstElementChild.querySelectorAll('*');
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
    rteObj.element.getElementsByTagName('textarea')[0].focus();
    setCursorPoint(rteObj.element.getElementsByTagName('textarea')[0], 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let allElem: any = rteObj.element.getElementsByTagName('textarea')[0].firstElementChild.querySelectorAll('*');
      let expected: boolean = true;
      let expectedElem: string = `<ol level="1" style="list-style: decimal;"><li><p>One Type-5</p><ol level="2" style="list-style: lower-alpha;"><li style="list-style: lower-alpha;"><p>Two Type-5</p><ol level="3" style="list-style: lower-roman;"><li style="list-style: lower-roman;"><p>Three Type-5</p></li></ol></li><li><p>Four Type-5</p></li></ol></li><li><p>Five Type-5</p></li><li><p>Six Type-5</p><ol level="2" style="list-style: lower-alpha;"><li style="list-style: lower-alpha;"><p>Seven Type-5</p></li></ol></li></ol><p class="MsoNormal"><o:p>&nbsp;</o:p></p><ol level="1" style="list-style: decimal;"><li><p>Eight Separate Type-5</p></li><li><p>Nine Separate Type-5</p></li></ol>`;
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
    rteObj.element.getElementsByTagName('textarea')[0].focus();
    setCursorPoint(rteObj.element.getElementsByTagName('textarea')[0], 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let allElem: any = rteObj.element.getElementsByTagName('textarea')[0].firstElementChild.querySelectorAll('*');
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
    rteObj.element.getElementsByTagName('textarea')[0].focus();
    setCursorPoint(rteObj.element.getElementsByTagName('textarea')[0], 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let allElem: any = rteObj.element.getElementsByTagName('textarea')[0].firstElementChild.querySelectorAll('*');
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
    rteObj.element.getElementsByTagName('textarea')[0].focus();
    setCursorPoint(rteObj.element.getElementsByTagName('textarea')[0], 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let allElem: any = rteObj.element.getElementsByTagName('textarea')[0].firstElementChild.querySelectorAll('*');
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
    rteObj.element.getElementsByTagName('textarea')[0].focus();
    setCursorPoint(rteObj.element.getElementsByTagName('textarea')[0], 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let allElem: any = rteObj.element.getElementsByTagName('textarea')[0].firstElementChild.querySelectorAll('*');
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
    rteObj.element.getElementsByTagName('textarea')[0].focus();
    setCursorPoint(rteObj.element.getElementsByTagName('textarea')[0], 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let allElem: any = rteObj.element.getElementsByTagName('textarea')[0].firstElementChild.querySelectorAll('*');
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
    rteObj.element.getElementsByTagName('textarea')[0].focus();
    setCursorPoint(rteObj.element.getElementsByTagName('textarea')[0], 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let allElem: any = rteObj.element.getElementsByTagName('textarea')[0].firstElementChild.querySelectorAll('*');
      let expected: boolean = true;
      let expectedElem: string = `<ul level="1" style="list-style: disc;"><li><p>One Node-10</p></li></ul><h2></h2><ul level="1" style="list-style: disc;"><li><p>Two Node-10</p></li><li><p>Three Node-10</p></li></ul>`;
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
    rteObj.element.getElementsByTagName('textarea')[0].focus();
    setCursorPoint(rteObj.element.getElementsByTagName('textarea')[0], 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let allElem: any = rteObj.element.getElementsByTagName('textarea')[0].firstElementChild.querySelectorAll('*');
      let expected: boolean = true;
      let expectedElem: string = `<ul level="1" style="list-style: disc;"><li>One Node-10</li></ul><h2></h2><ul level="1" style="list-style: disc;"><li>Two Node-10</li><li>Three Node-10</li></ul>`;
      if (allElem[0].parentElement.innerHTML.trim().replace(/>\s+</g, '><') !== expectedElem) {
        expected = false;
      }
      expect(expected).toBe(true);
      done();
    }, 100);
  });

  it('MSWord List Conversion with Image Type 13', (done) => {
    /*
      •	One Node-10
      •	Two <img> Node-10
      •	Three Nod<img>e-10
    */
    let localElem: string = `
    <p class='MsoListParagraphCxSpFirst' style='text-indent:-.25in;mso-list:l0 level1 lfo1'><!--[if !supportLists]--><span style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><!--[endif]-->One Node-11<o:p></o:p></p>

<p class='MsoListParagraphCxSpLast' style='text-indent:-.25in;mso-list:l0 level1 lfo1'><!--[if !supportLists]--><span style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt &quot;Times New Roman&quot;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><!--[endif]-->Two <span style='mso-no-proof:yes'><!--[if gte vml 1]><v:shapetype
 id='_x0000_t75' coordsize='21600,21600' o:spt='75' o:preferrelative='t'
 path='m@4@5l@4@11@9@11@9@5xe' filled='f' stroked='f'>
 <v:stroke joinstyle='miter'/>
 <v:formulas>
  <v:f eqn='if lineDrawn pixelLineWidth 0'/>
  <v:f eqn='sum @0 1 0'/>
  <v:f eqn='sum 0 0 @1'/>
  <v:f eqn='prod @2 1 2'/>
  <v:f eqn='prod @3 21600 pixelWidth'/>
  <v:f eqn='prod @3 21600 pixelHeight'/>
  <v:f eqn='sum @0 0 1'/>
  <v:f eqn='prod @6 1 2'/>
  <v:f eqn='prod @7 21600 pixelWidth'/>
  <v:f eqn='sum @8 21600 0'/>
  <v:f eqn='prod @7 21600 pixelHeight'/>
  <v:f eqn='sum @10 21600 0'/>
 </v:formulas>
 <v:path o:extrusionok='f' gradientshapeok='t' o:connecttype='rect'/>
 <o:lock v:ext='edit' aspectratio='t'/>
</v:shapetype><v:shape id='Picture_x0020_2' o:spid='_x0000_i1025' type='#_x0000_t75'
 style='width:163.5pt;height:92pt;visibility:visible;mso-wrap-style:square'>
 <v:imagedata src='file:///C:/Users/REVANT~1.KRI/AppData/Local/Temp/msohtmlclip1/01/clip_image001.png'
  o:title=''/>
</v:shape><![endif]--><!--[if !vml]--><img id='img1' src="https://www.google.co.in/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png" width="218" height="123"><!--[endif]--></span>Node-11<o:p></o:p></p>
  `;
    keyBoardEvent.clipboardData = {
      getData: () => {
        return localElem;
      },
      items: []
    };
    rteObj.element.getElementsByTagName('textarea')[0].focus();
    setCursorPoint(rteObj.element.getElementsByTagName('textarea')[0], 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let allElem: any = rteObj.element.getElementsByTagName('textarea')[0].firstElementChild.querySelectorAll('*');
      let expected: boolean = true;
      let expectedElem: string = `<ul level="1" style="list-style: disc;"><li><p>One Node-11</p></li><li><p>Two<span><img id="img1" src="https://www.google.co.in/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png" width="218" height="123"></span>Node-11</p></li></ul>`;
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
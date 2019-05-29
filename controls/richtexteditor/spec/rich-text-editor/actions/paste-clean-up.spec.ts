/**
 * Paste CleanUp spec
 */
import { EditorManager } from "../../../src/editor-manager/index";
import { RichTextEditor } from "../../../src/rich-text-editor/base/rich-text-editor";
import { PasteCleanup } from "../../../src/rich-text-editor/actions/paste-clean-up";
import { renderRTE, destroy, setCursorPoint } from "../render.spec";
import {
  CLS_RTE_PASTE_KEEP_FORMAT, CLS_RTE_PASTE_REMOVE_FORMAT, CLS_RTE_PASTE_PLAIN_FORMAT
} from "../../../src/rich-text-editor/base/classes";
import {
  CLS_RTE_PASTE_OK, CLS_RTE_PASTE_CANCEL
} from "../../../src/rich-text-editor/base/classes";
RichTextEditor.Inject(PasteCleanup);

describe("paste cleanup testing", () => {
  let editorObj: EditorManager;
  let rteObj: RichTextEditor;
  let pasteCleanUp: PasteCleanup;
  let rteEle: HTMLElement;
  let element: HTMLElement;
  let keepFormatButton: HTMLElement;
  let keyBoardEvent: any = {
    preventDefault: () => { },
    type: "keydown",
    stopPropagation: () => { },
    ctrlKey: false,
    shiftKey: false,
    action: null,
    which: 64,
    key: ""
  };
  let defaultString: string = `
  <div style="color:red;" id="content-edit" contenteditable="true" class="e-node-deletable e-node-inner">
    <p class='first-p-node' style="color:red; margin:10px; font-size:20px; border:2px solid;">dom node
     <a href="https://www.google.com" tabindex="1">Google</a>
     <label id="label1"><i>First label Node</i></label>
     <label id="label2"><strong>Second label Node</strong></label>
     </p>
     <p class='last-p-node'>
       <label id="label3"><emp>Third Label Node</emp></label>
       <label id="label4"><b>Last Label Node</b></label>
       <span id='span1'>
       <img id='img1' src="https://www.google.co.in/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png" width="250" height="250">
       <label id="label5">Content</label>
       </span>
       <span id='span2'>the</span>
       <span id='span3'>the<img width="250" height="250"></span>
     </p>
   </div>
   `;

  beforeAll((done: Function) => {
    rteObj = renderRTE({
      pasteCleanupSettings: {
        deniedTags: ["label, a[href, !alt], table[title], img[!src, !id]"],
        prompt: true
      }
    });
    rteEle = rteObj.element;
    done();
  });
  it("Clicking 'Ctrl+v' repeatedly", (done) => {
    keyBoardEvent.clipboardData = {
      getData: () => {
        return defaultString;
      },
      items: []
    };
    rteObj.element.getElementsByTagName("textarea")[0].focus();
    setCursorPoint(rteObj.element.getElementsByTagName("textarea")[0], 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + "_pasteCleanupDialog").getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
        rteObj.onPaste(keyBoardEvent);
      }
      let allElem: any = rteObj.element.getElementsByTagName("textarea")[0].firstElementChild.querySelectorAll("*");
      let expected: boolean = true;
      for (let i: number = 0; i < allElem.length; i++) {
        for (let j: number = 0; j < rteObj.pasteCleanupSettings.deniedTags.length; j++) {
          if (allElem[i].tagName.toLowerCase() === rteObj.pasteCleanupSettings.deniedTags[j]) {
            expected = false;
          }
        }
      }
      expect(expected).toBe(true);
      done();
    }, 50);
  });
  it("Paste by Keep Formatting when Denied Tags are set", (done) => {
    keyBoardEvent.clipboardData = {
      getData: () => {
        return defaultString;
      },
      items: []
    };
    rteObj.element.getElementsByTagName("textarea")[0].focus();
    setCursorPoint(rteObj.element.getElementsByTagName("textarea")[0], 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + "_pasteCleanupDialog").getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let allElem: any = rteObj.element.getElementsByTagName("textarea")[0].firstElementChild.querySelectorAll("*");
      let expected: boolean = true;
      for (let i: number = 0; i < allElem.length; i++) {
        for (let j: number = 0; j < rteObj.pasteCleanupSettings.deniedTags.length; j++) {
          if (allElem[i].tagName.toLowerCase() === rteObj.pasteCleanupSettings.deniedTags[j]) {
            expected = false;
          }
        }
      }
      expect(expected).toBe(true);
      done();
    }, 50);
  });
  it("Paste by Keep Formatting when Denied Tags with only allowed attributes are set", (done) => {
    keyBoardEvent.clipboardData = {
      getData: () => {
        return defaultString;
      },
      items: []
    };
    rteObj.pasteCleanupSettings.deniedTags = ["label", "a[href]"];
    rteObj.dataBind();
    rteObj.element.getElementsByTagName("textarea")[0].focus();
    setCursorPoint(rteObj.element.getElementsByTagName("textarea")[0], 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + "_pasteCleanupDialog").getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let allElem: any = rteObj.element.getElementsByTagName("textarea")[0].firstElementChild.querySelectorAll("*");
      let expected: boolean = true;
      for (let i: number = 0; i < allElem.length; i++) {
        for (let j: number = 0; j < rteObj.pasteCleanupSettings.deniedTags.length; j++) {
          if (allElem[i].tagName.toLowerCase() === rteObj.pasteCleanupSettings.deniedTags[j]) {
            expected = false;
          }
        }
      }
      expect(expected).toBe(true);
      done();
    }, 50);
  });
  it("Paste by Keep Formatting when Denied Tags with only allowed attributes are set", (done) => {
    keyBoardEvent.clipboardData = {
      getData: () => {
        return defaultString;
      },
      items: []
    };
    rteObj.pasteCleanupSettings.deniedTags = ['i[class, id]', 'cite', 'b'];
    rteObj.dataBind();
    rteObj.element.getElementsByTagName("textarea")[0].focus();
    setCursorPoint(rteObj.element.getElementsByTagName("textarea")[0], 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + "_pasteCleanupDialog").getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let allElem: any = rteObj.element.getElementsByTagName("textarea")[0].firstElementChild.querySelectorAll("*");
      let expected: boolean = true;
      for (let i: number = 0; i < allElem.length; i++) {
        for (let j: number = 0; j < rteObj.pasteCleanupSettings.deniedTags.length; j++) {
          if (allElem[i].tagName.toLowerCase() === rteObj.pasteCleanupSettings.deniedTags[j]) {
            expected = false;
          }
        }
      }
      expect(expected).toBe(true);
      done();
    }, 50);
  });
  it("Paste by Keep Formatting when Denied Attributes are set", (done) => {
    keyBoardEvent.clipboardData = {
      getData: () => {
        return defaultString;
      },
      items: []
    };
    rteObj.pasteCleanupSettings.deniedAttrs = ["style", "id"];
    rteObj.dataBind();
    rteObj.element.getElementsByTagName("textarea")[0].focus();
    setCursorPoint(rteObj.element.getElementsByTagName("textarea")[0], 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + "_pasteCleanupDialog").getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let allElem: any = rteObj.element.getElementsByTagName("textarea")[0].firstElementChild.querySelectorAll("*");
      let expected: boolean = true;
      for (let i: number = 0; i < allElem.length; i++) {
        for (let j: number = 0; j < rteObj.pasteCleanupSettings.deniedAttrs.length; j++) {
          if (allElem[i].getAttribute(rteObj.pasteCleanupSettings.deniedAttrs[j])) {
            expected = false;
          }
        }
      }
      expect(expected).toBe(true);
      done();
    }, 50);
  });
  it("Paste by Keep Formatting when Allowed Style Properties are set", (done) => {
    let localElem: string = `<div style="color:red;" id="content-edit" contenteditable="true" class="e-node-deletable e-node-inner"><p class='first-p-node' style="color:red; margin:10px; font-size:20px; border:2px solid;">dom node</p></div>`;
    keyBoardEvent.clipboardData = {
      getData: () => {
        return localElem;
      },
      items: []
    };
    rteObj.pasteCleanupSettings.deniedTags = [];
    rteObj.pasteCleanupSettings.deniedAttrs = [];
    rteObj.pasteCleanupSettings.allowedStyleProps = ["color", "margin"];
    rteObj.dataBind()
    rteObj.element.getElementsByTagName("textarea")[0].focus();
    setCursorPoint(rteObj.element.getElementsByTagName("textarea")[0], 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + "_pasteCleanupDialog").getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let allElem: any = rteObj.element.getElementsByTagName("textarea")[0].firstElementChild.querySelectorAll("*");
      let expected: boolean = true;
      let expectedElem: string = `<div id="content-edit" contenteditable="true" class="e-node-deletable e-node-inner" style="color:red"><p class="first-p-node" style="color:red; margin:10px">dom node</p></div>`;
      if (allElem[0].parentElement.innerHTML !== expectedElem) {
        expected = false;
      }
      expect(expected).toBe(true);
      done();
    }, 100);
  });
  it("Paste by Clean Formatting", (done) => {
    let localElem: string = `<p><span style="color: rgb(255, 0, 0);">Test for clean format removing the style attribute</span></p>`;
    keyBoardEvent.clipboardData = {
      getData: () => {
        return localElem;
      },
      items: []
    };
    rteObj.pasteCleanupSettings.deniedTags = [];
    rteObj.pasteCleanupSettings.deniedAttrs = [];
    rteObj.pasteCleanupSettings.allowedStyleProps = [];
    rteObj.dataBind()
    rteObj.element.getElementsByTagName("textarea")[0].focus();
    setCursorPoint(rteObj.element.getElementsByTagName("textarea")[0], 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + "_pasteCleanupDialog").getElementsByClassName(CLS_RTE_PASTE_REMOVE_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let allElem: any = rteObj.element.getElementsByTagName("textarea")[0].firstElementChild.querySelectorAll("*");
      let expected: boolean = true;
      let expectedElem: string = `<p><span>Test for clean format removing the style attribute</span></p>`;
      if (allElem[0].parentElement.innerHTML !== expectedElem) {
        expected = false;
      }
      expect(expected).toBe(true);
      done();
    }, 100);
  });


  it("Paste to clean formatting without prompt", (done) => {
    let localElem: string = `<p><span style="color: rgb(255, 0, 0);">Test for clean format removing the style attribute</span></p>`;
    keyBoardEvent.clipboardData = {
      getData: () => {
        return localElem;
      },
      items: []
    };
    rteObj.pasteCleanupSettings.prompt = false;
    rteObj.pasteCleanupSettings.keepFormat = false;
    rteObj.pasteCleanupSettings.deniedTags = [];
    rteObj.pasteCleanupSettings.deniedAttrs = [];
    rteObj.pasteCleanupSettings.allowedStyleProps = [];
    rteObj.dataBind()
    rteObj.element.getElementsByTagName("textarea")[0].focus();
    setCursorPoint(rteObj.element.getElementsByTagName("textarea")[0], 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      let allElem: any = rteObj.element.getElementsByTagName("textarea")[0].firstElementChild.querySelectorAll("*");
      let expected: boolean = true;
      let expectedElem: string = `<p><span>Test for clean format removing the style attribute</span></p>`;
      if (allElem[0].parentElement.innerHTML !== expectedElem) {
        expected = false;
      }
      expect(expected).toBe(true);
      done();
    }, 100);
  });

  it("Paste to keep formatting without prompt", (done) => {
    let localElem: string = `<p><span style="color: rgb(255, 0, 0);">Test for clean format removing the style attribute</span></p>`;
    keyBoardEvent.clipboardData = {
      getData: () => {
        return localElem;
      },
      items: []
    };
    rteObj.pasteCleanupSettings.prompt = false;
    rteObj.pasteCleanupSettings.keepFormat = true;
    rteObj.pasteCleanupSettings.deniedTags = ['span'];
    rteObj.pasteCleanupSettings.deniedAttrs = [];
    rteObj.pasteCleanupSettings.allowedStyleProps = [];
    rteObj.dataBind()
    rteObj.element.getElementsByTagName("textarea")[0].focus();
    setCursorPoint(rteObj.element.getElementsByTagName("textarea")[0], 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      let allElem: any = rteObj.element.getElementsByTagName("textarea")[0].firstElementChild.querySelectorAll("*");
      let expected: boolean = true;
      let expectedElem: string = `<p>Test for clean format removing the style attribute</p>`;
      if (allElem[0].parentElement.innerHTML !== expectedElem) {
        expected = false;
      }
      expect(expected).toBe(true);
      done();
    }, 100);
  });

  it("Plain paste without prompt", (done) => {
    let localElem: string = `<ol level="1" style="list-style: decimal"><li><p>One Node-1</p></li><li><p>Two Node-1</p></li><li><p>Three Node-1</p></li></ol>`;
    keyBoardEvent.clipboardData = {
      getData: () => {
        return localElem;
      },
      items: []
    };
    rteObj.pasteCleanupSettings.prompt = false;
    rteObj.pasteCleanupSettings.plainText = true;
    rteObj.pasteCleanupSettings.deniedTags = [];
    rteObj.pasteCleanupSettings.deniedAttrs = [];
    rteObj.pasteCleanupSettings.allowedStyleProps = [];
    rteObj.dataBind()
    rteObj.element.getElementsByTagName("textarea")[0].focus();
    setCursorPoint(rteObj.element.getElementsByTagName("textarea")[0], 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      let allElem: any = rteObj.element.getElementsByTagName("textarea")[0].firstElementChild;
      let expected: boolean = true;
      let expectedElem: string = `<p>One Node-1</p><p>Two Node-1</p><p>Three Node-1</p>`;
      if (allElem.innerHTML !== expectedElem) {
        expected = false;
      }
      expect(expected).toBe(true);
      done();
    }, 100);
  });

  it("EJ2-24021- Plain paste without prompt ", (done) => {
    let localElem: string = `<ol level="1" style="list-style: decimal"><li>One <code>Node-1</code></li><li>Two <code>Node-1</code></li><li>Three <code>Node-1</code></li></ol>`;
    keyBoardEvent.clipboardData = {
      getData: () => {
        return localElem;
      },
      items: []
    };
    rteObj.pasteCleanupSettings.prompt = false;
    rteObj.pasteCleanupSettings.plainText = true;
    rteObj.pasteCleanupSettings.deniedTags = [];
    rteObj.pasteCleanupSettings.deniedAttrs = [];
    rteObj.pasteCleanupSettings.allowedStyleProps = [];
    rteObj.dataBind()
    rteObj.element.getElementsByTagName("textarea")[0].focus();
    setCursorPoint(rteObj.element.getElementsByTagName("textarea")[0], 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      let allElem: any = rteObj.element.getElementsByTagName("textarea")[0].firstElementChild;
      let expected: boolean = true;
      let expectedElem: string = `<p>One Node-1</p><p>Two Node-1</p><p>Three Node-1</p>`;
      if (allElem.innerHTML !== expectedElem) {
        expected = false;
      }
      expect(expected).toBe(true);
      done();
    }, 100);
  });

  it("Plain paste with prompt", (done) => {
    let localElem: string = `<ol level="1" style="list-style: decimal"><li><p>One Node-1</p></li><li><p>Two Node-1</p></li><li><p>Three Node-1</p></li></ol>`;
    keyBoardEvent.clipboardData = {
      getData: () => {
        return localElem;
      },
      items: []
    };
    rteObj.pasteCleanupSettings.prompt = true;
    rteObj.pasteCleanupSettings.deniedTags = [];
    rteObj.pasteCleanupSettings.deniedAttrs = [];
    rteObj.pasteCleanupSettings.allowedStyleProps = [];
    rteObj.dataBind()
    rteObj.element.getElementsByTagName("textarea")[0].focus();
    setCursorPoint(rteObj.element.getElementsByTagName("textarea")[0], 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + "_pasteCleanupDialog").getElementsByClassName(CLS_RTE_PASTE_PLAIN_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let allElem: any = rteObj.element.getElementsByTagName("textarea")[0].firstElementChild;
      let expected: boolean = true;
      let expectedElem: string = `<p>One Node-1</p><p>Two Node-1</p><p>Three Node-1</p>`;
      if (allElem.innerHTML !== expectedElem) {
        expected = false;
      }
      expect(expected).toBe(true);
      done();
    }, 100);
  });

  it("EJ2-26404 - Breakline issue - Plain paste with prompt", (done) => {
    let localElem: string = `<p>First para start <code>65</code>. Syncfusion<a href="http://syncfusion.com">link</a>is here</p><blockquote><p>Second para inside blockquote</p></blockquote>`;
    keyBoardEvent.clipboardData = {
      getData: () => {
        return localElem;
      },
      items: []
    };
    rteObj.pasteCleanupSettings.prompt = true;
    rteObj.pasteCleanupSettings.deniedTags = [];
    rteObj.pasteCleanupSettings.deniedAttrs = [];
    rteObj.pasteCleanupSettings.allowedStyleProps = [];
    rteObj.dataBind();
    rteObj.element.getElementsByTagName("textarea")[0].focus();
    setCursorPoint(rteObj.element.getElementsByTagName("textarea")[0], 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + "_pasteCleanupDialog").getElementsByClassName(CLS_RTE_PASTE_PLAIN_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let allElem: any = rteObj.element.getElementsByTagName("textarea")[0].firstElementChild;
      let expected: boolean = true;
      let expectedElem: string = `<p>First para start 65. Syncfusionlinkis here</p><p>Second para inside blockquote</p>`;
      if (allElem.innerHTML !== expectedElem) {
        expected = false;
      }
      expect(expected).toBe(true);
      done();
    }, 100);
  });
  
  it("EJ2-26404 - Breakline issue - Plain paste with prompt with br tags", (done) => {
    let localElem: string = `<p>To break lines<br>in a text,<br>use the br element.</p>`;
    keyBoardEvent.clipboardData = {
      getData: () => {
        return localElem;
      },
      items: []
    };
    rteObj.pasteCleanupSettings.prompt = true;
    rteObj.pasteCleanupSettings.deniedTags = [];
    rteObj.pasteCleanupSettings.deniedAttrs = [];
    rteObj.pasteCleanupSettings.allowedStyleProps = [];
    rteObj.dataBind();
    (rteObj as any).inputElement.focus();
    setCursorPoint((rteObj as any).inputElement, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + "_pasteCleanupDialog").getElementsByClassName(CLS_RTE_PASTE_PLAIN_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let allElem: any = (rteObj as any).inputElement.firstElementChild;
      let expected: boolean = true;
      let expectedElem: string = `<p>To break lines</p><p>in a text,</p><p>use the br element.</p>`;
      if (allElem.innerHTML !== expectedElem) {
        expected = false;
      }
      expect(expected).toBe(true);
      done();
    }, 100);
  });

  it("Paste URL", (done) => {
    keyBoardEvent.clipboardData = {
      getData: () => {
        return 'https://ej2.syncfusion.com';
      },
      items: []
    };
    rteObj.dataBind()
    rteObj.element.getElementsByTagName("textarea")[0].focus();
    setCursorPoint(rteObj.element.getElementsByTagName("textarea")[0], 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      let allElem: any = rteObj.element.getElementsByTagName("textarea")[0].firstElementChild;
      expect(allElem.children[0].tagName.toLowerCase() === 'a').toBe(true);
      expect(allElem.children[0].getAttribute('href') === 'https://ej2.syncfusion.com').toBe(true);
      done();
    }, 100);
  });

  it("Paste URL with other contents", (done) => {
    keyBoardEvent.clipboardData = {
      getData: () => {
        return 'Hi syncfusion website https://ej2.syncfusion.com is here';
      },
      items: []
    };
    rteObj.dataBind()
    rteObj.element.getElementsByTagName("textarea")[0].focus();
    setCursorPoint(rteObj.element.getElementsByTagName("textarea")[0], 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      let allElem: any = rteObj.element.getElementsByTagName("textarea")[0].firstElementChild;
      expect(allElem.children[1].tagName.toLowerCase() === 'a').toBe(true);
      expect(allElem.children[1].getAttribute('href') === 'https://ej2.syncfusion.com').toBe(true);
      let expected: boolean = false;
      let expectedElem: string = `<span>Hi syncfusion website </span><a class="e-rte-anchor" href="https://ej2.syncfusion.com" title="https://ej2.syncfusion.com">https://ej2.syncfusion.com</a><span> is here</span>`;
      if (allElem.innerHTML === expectedElem) {
        expected = true;
      }
      expect(expected).toBe(true);
      done();
    }, 100);
  });

  it("Paste Cancel", (done) => {
    let localElem: string = `Paste cancel`;
    keyBoardEvent.clipboardData = {
      getData: () => {
        return localElem;
      },
      items: []
    };
    rteObj.pasteCleanupSettings.prompt = true;
    rteObj.pasteCleanupSettings.deniedTags = [];
    rteObj.pasteCleanupSettings.deniedAttrs = [];
    rteObj.pasteCleanupSettings.allowedStyleProps = [];
    rteObj.dataBind()
    rteObj.element.getElementsByTagName("textarea")[0].focus();
    setCursorPoint(rteObj.element.getElementsByTagName("textarea")[0], 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_CANCEL);
        pasteOK[0].click();
      }
      let allElem: any = rteObj.element.getElementsByTagName("textarea")[0].firstElementChild;
      let expected: boolean = true;
      let expectedElem: string = `Paste cancel`;
      if (allElem.innerHTML === expectedElem) {
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
describe('EJ2-23795: Console error occurs when pasting the copied content using enter key', () => {
  let rteObj: RichTextEditor;
  let elem: HTMLElement;
  let editNode: HTMLTextAreaElement;
  let keyBoardEvent: any = { preventDefault: () => { }, type: 'keydown', stopPropagation: () => { }, ctrlKey: false, shiftKey: false, action: '', which: 8 };
  let innerHTML: string = `<p>Lists are a piece of cake
      They even auto continue as you type
      A double enter will end them
      Tabs and shift-tabs work too</p>`;
  let controlId: string;
  beforeAll(() => {
    rteObj = renderRTE({
      editorMode: 'HTML', value: innerHTML, toolbarSettings: {
        items: ['Formats', 'UnorderedList', 'ClearFormat']
      },
      pasteCleanupSettings: {
        prompt: true
      }
    });
    elem = rteObj.element;
    controlId = elem.id;
    editNode = rteObj.contentModule.getEditPanel() as HTMLTextAreaElement;
  });

  it(' Paste the content second time by enter key action in prompt', (done) => {
    let localElem: string = `<ol level="1" style="list-style: decimal"><li><p>One Node-1</p></li><li><p>Two Node-1</p></li><li><p>Three Node-1</p></li></ol>`;
    keyBoardEvent.clipboardData = {
      getData: () => {
        return localElem;
      },
      items: []
    };
    (rteObj as any).inputElement.focus();
    rteObj.onPaste(keyBoardEvent);
    if (rteObj.pasteCleanupSettings.prompt) {
      let keepFormat: any = document.getElementById(rteObj.getID() + "_pasteCleanupDialog").getElementsByClassName(CLS_RTE_PASTE_PLAIN_FORMAT);
      keepFormat[0].click();
      keepFormat[0].focus();
      let eventArgs = { keyCode: 13, altKey: false, ctrlKey: false, shiftKey: false };
      (document.getElementById(rteObj.getID() + "_pasteCleanupDialog") as any).ej2_instances[0].keyDown(eventArgs);
      setTimeout(() => {
        let allElem: any = (rteObj as any).inputElement.firstElementChild.firstElementChild;
        let expected: boolean = true;
        let expectedElem: string = `<p>One Node-1</p><p>Two Node-1</p><p>Three Node-1</p>`;
        if (allElem.innerHTML !== expectedElem) {
          expected = false;
        }
        expect(expected).toBe(true);
        (rteObj as any).inputElement.focus();
        rteObj.onPaste(keyBoardEvent);
        setTimeout(() => {
          let keepFormat: any = document.getElementById(rteObj.getID() + "_pasteCleanupDialog").getElementsByClassName(CLS_RTE_PASTE_PLAIN_FORMAT);
          keepFormat[0].click();
          keepFormat[0].focus();
          let eventArgs = { keyCode: 13, altKey: false, ctrlKey: false, shiftKey: false };
          (document.getElementById(rteObj.getID() + "_pasteCleanupDialog") as any).ej2_instances[0].keyDown(eventArgs);
          setTimeout(() => {
            let allElem: any = (rteObj as any).inputElement.firstElementChild.firstElementChild;
            let expected: boolean = true;
            let expectedElem: string = `<p>One Node-1</p><span><p>One Node-1</p><p>Two Node-1</p><p>Three Node-1</p></span><p>Two Node-1</p><p>Three Node-1</p>`;
            if (allElem.innerHTML !== expectedElem) {
              expected = false;
            }
            expect(expected).toBe(true);
            done();
          }, 50);
        }, 100);
      }, 50)
    }
  });
  afterAll(() => {
    destroy(rteObj);
  });
});

/**
 * Paste CleanUp spec
 */
import { EditorManager } from "../../../src/editor-manager/index";
import { createElement } from '@syncfusion/ej2-base';
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
  let beforeDialogOpenEvent: boolean = false;
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
      },
      beforeDialogOpen: beforeDialogOpen
    });
    rteEle = rteObj.element;
    editorObj = new EditorManager({ document: document, editableElement: document.getElementsByClassName("e-content")[0] });
    function beforeDialogOpen(args: any): void {
      beforeDialogOpenEvent = true;
    }
    done();
  });
  it("Clicking 'Ctrl+v' repeatedly", (done) => {
    keyBoardEvent.clipboardData = {
      getData: () => {
        return defaultString;
      },
      items: []
    };
    (rteObj as any).inputElement.focus();
    setCursorPoint((rteObj as any).inputElement, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + "_pasteCleanupDialog").getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
        rteObj.onPaste(keyBoardEvent);
      }
      let allElem: any = (rteObj as any).inputElement.firstElementChild.querySelectorAll("*");
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
    (rteObj as any).inputElement.focus();
    setCursorPoint((rteObj as any).inputElement, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + "_pasteCleanupDialog").getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let allElem: any = (rteObj as any).inputElement.firstElementChild.querySelectorAll("*");
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
    (rteObj as any).inputElement.focus();
    setCursorPoint((rteObj as any).inputElement, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + "_pasteCleanupDialog").getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let allElem: any = (rteObj as any).inputElement.firstElementChild.querySelectorAll("*");
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
    (rteObj as any).inputElement.focus();
    setCursorPoint((rteObj as any).inputElement, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + "_pasteCleanupDialog").getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let allElem: any = (rteObj as any).inputElement.firstElementChild.querySelectorAll("*");
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
    (rteObj as any).inputElement.focus();
    setCursorPoint((rteObj as any).inputElement, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + "_pasteCleanupDialog").getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let allElem: any =(rteObj as any).inputElement.firstElementChild.querySelectorAll("*");
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
    rteObj.dataBind();
    (rteObj as any).inputElement.focus();
    setCursorPoint((rteObj as any).inputElement, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + "_pasteCleanupDialog").getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let allElem: any =(rteObj as any).inputElement.firstElementChild.querySelectorAll("*");
      let expected: boolean = true;
      let expectedElem: string = `<div id="content-edit" contenteditable="true" class="e-node-deletable e-node-inner" style="color:red;"><p class="first-p-node" style="color:red; margin:10px;">dom node</p></div>`;
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
    rteObj.dataBind();
    (rteObj as any).inputElement.focus();
    setCursorPoint((rteObj as any).inputElement, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + "_pasteCleanupDialog").getElementsByClassName(CLS_RTE_PASTE_REMOVE_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let allElem: any = (rteObj as any).inputElement.firstElementChild.querySelectorAll("*");
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
    rteObj.dataBind();
    (rteObj as any).inputElement.focus();
    setCursorPoint((rteObj as any).inputElement, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      let allElem: any = (rteObj as any).inputElement.firstElementChild.querySelectorAll("*");
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
    rteObj.dataBind();
    (rteObj as any).inputElement.focus();
    setCursorPoint((rteObj as any).inputElement, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      let allElem: any = (rteObj as any).inputElement.firstElementChild.querySelectorAll("*");
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
    rteObj.dataBind();
    (rteObj as any).inputElement.focus();
    setCursorPoint((rteObj as any).inputElement, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      let allElem: any = (rteObj as any).inputElement.firstElementChild;
      let expected: boolean = true;
      let expectedElem: string = `<span>One Node-1</span><p>Two Node-1</p><p>Three Node-1</p>`;
      if (allElem.innerHTML !== expectedElem) {
        expected = false;
      }
      expect(expected).toBe(true);
      done();
    }, 100);
  });

  it("Plain paste without prompt with first tag as block node", (done) => {
    let localElem: string = `

    <!--StartFragment--><div class="r" style="font-weight: 400; margin: 0px; font-size: small; line-height: 1.57; color: rgb(34, 34, 34); font-family: arial, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial;"><a href="https://stackoverflow.com/questions/14535733/how-to-check-if-div-element-is-empty" ping="/url?sa=t&amp;source=web&amp;rct=j&amp;url=https://stackoverflow.com/questions/14535733/how-to-check-if-div-element-is-empty&amp;ved=2ahUKEwi0uumy88rkAhWHq48KHcruAHYQFjAAegQIAhAB" style="color: rgb(102, 0, 153); cursor: pointer; text-decoration: none;"><h3 class="LC20lb" style="font-size: 20px; font-weight: normal; margin: 0px; padding: 0px; display: inline-flex; max-width: 100%; line-height: 1.3;"><div class="ellip" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">How to check if div element is empty - Stack Overflow</div></h3><br><div class="TbwUpd" style="display: inline-block; line-height: 1.57; padding-bottom: 0px; padding-top: 1px;"><cite class="iUh30 bc" style="color: rgb(0, 102, 33); font-style: normal; font-size: 16px; padding-top: 1px; line-height: 1.5;">https://stackoverflow.com › questions › how-to-check-if-div-element-is-em...</cite></div></a><span><div class="action-menu ab_ctl" style="display: inline; position: relative; margin: 1px 3px 0px; user-select: none; vertical-align: middle;"><a class="GHDvEf ab_button" href="https://www.google.com/search?safe=off&amp;rlz=1C1GCEU_enIN858IN858&amp;sxsrf=ACYBGNQNtqskvF9E5O-LhbCduyrOpuksiw%3A1568278143880&amp;ei=fwZ6Xaq0NZOkwgPnyI7QDw&amp;q=how+to+check+if+the+element+is+empty+using+javascript&amp;oq=how+to+check+if+the+element+is+empty+using+javascript&amp;gs_l=psy-ab.3..0i22i30l4.3422.10049..10226...1.2..5.1044.7383.2j5j8j1j1j3j1j1......0....1..gws-wiz.......0i71.1WBHgC0t-pY&amp;ved=0ahUKEwjq77Kt88rkAhUTknAKHWekA_oQ4dUDCAs&amp;uact=5#" id="am-b0" aria-label="Result options" aria-expanded="false" aria-haspopup="true" role="button" jsaction="m.tdd;keydown:m.hbke;keypress:m.mskpe" data-ved="2ahUKEwi0uumy88rkAhWHq48KHcruAHYQ7B0wAHoECAIQAw" style="border-radius: 0px; cursor: default; font-family: arial, sans-serif; font-size: 11px; font-weight: bold; height: 12px; line-height: 27px; margin: 1px 0px 2px; min-width: 0px; padding: 0px; text-align: center; transition: none 0s ease 0s; user-select: none; background-color: white; background-image: none; border: 0px; color: rgb(68, 68, 68); box-shadow: 0px 0px 0px 0px; filter: none; width: 13px; text-decoration: none; display: inline-block;"><span class="mn-dwn-arw" style="border-color: rgb(0, 102, 33) transparent; border-style: solid; border-width: 5px 4px 0px; width: 0px; height: 0px; margin-left: 3px; top: 7.33333px; margin-top: -4px; position: absolute; left: 0px;"></span></a><div class="action-menu-panel ab_dropdown" role="menu" tabindex="-1" jsaction="keydown:m.hdke;mouseover:m.hdhne;mouseout:m.hdhue" data-ved="2ahUKEwi0uumy88rkAhWHq48KHcruAHYQqR8wAHoECAIQBA" style="background: rgb(255, 255, 255); border: 1px solid rgba(0, 0, 0, 0.2); font-size: 13px; padding: 0px; position: absolute; right: auto; top: 12px; white-space: nowrap; z-index: 3; transition: opacity 0.218s ease 0s; box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 4px; left: 0px; visibility: hidden;"><ol style="margin: 0px; padding: 0px; border: 0px;"><li class="action-menu-item ab_dropdownitem" role="menuitem" style="margin: 0px; padding: 0px; border: 0px; list-style: none; user-select: none; cursor: pointer;"><a class="fl" href="https://webcache.googleusercontent.com/search?q=cache:Q6gxbyHFlx8J:https://stackoverflow.com/questions/14535733/how-to-check-if-div-element-is-empty+&amp;cd=1&amp;hl=en&amp;ct=clnk&amp;gl=in" ping="/url?sa=t&amp;source=web&amp;rct=j&amp;url=https://webcache.googleusercontent.com/search%3Fq%3Dcache:Q6gxbyHFlx8J:https://stackoverflow.com/questions/14535733/how-to-check-if-div-element-is-empty%2B%26cd%3D1%26hl%3Den%26ct%3Dclnk%26gl%3Din&amp;ved=2ahUKEwi0uumy88rkAhWHq48KHcruAHYQIDAAegQIAhAF" style="text-decoration: none; color: rgb(51, 51, 51); cursor: pointer; font-size: 16px; display: block; padding: 7px 18px; outline: 0px;"></a></li></ol></div></div></span></div><div class="s" style="max-width: 48em; color: rgb(84, 84, 84); line-height: 1.57; font-family: arial, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial;"><div><br class="Apple-interchange-newline"><!--EndFragment-->
    
    </div></div>`;
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
    rteObj.dataBind();
    (rteObj as any).inputElement.focus();
    setCursorPoint((rteObj as any).inputElement, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      let allElem: any = (rteObj as any).inputElement.firstElementChild;
      let expected: boolean = false;
      let expectedElem: string = `<!--StartFragment--><span>How to check if div element is empty - Stack Overflow</span><div>https://stackoverflow.com › questions › how-to-check-if-div-element-is-em...</div><div><br><!--EndFragment--></div>`;
      if (allElem.innerHTML.trim() === expectedElem) {
        expected = true;
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
    rteObj.dataBind();
    (rteObj as any).inputElement.focus();
    setCursorPoint((rteObj as any).inputElement, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      let allElem: any = (rteObj as any).inputElement.firstElementChild;
      let expected: boolean = true;
      let expectedElem: string = `<span>One Node-1</span><div>Two Node-1</div><div>Three Node-1</div>`;
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
      let expectedElem: string = `<span>One Node-1</span><p>Two Node-1</p><p>Three Node-1</p>`;
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
      let expectedElem: string = `<span>First para start 65. Syncfusionlinkis here</span><p>Second para inside blockquote</p>`;
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
      let expected: boolean = false;
      let expectedElem: string = `<span>To break lines</span><p><br>in a text,<br>use the br element.</p>`;
      if (allElem.innerHTML === expectedElem) {
        expected = true;
      }
      expect(expected).toBe(true);
      done();
    }, 100);
  });

  it("EJ2-29670 - Web content with link and strong tag", (done) => {
    let localElem: string = `<div style="box-sizing: border-box; color: rgb(91, 91, 91); font-family: proxima-nova, sans-serif; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial;">"<strong style="box-sizing: border-box; font-weight: 700;"><font color="#000000" style="box-sizing: border-box;"><font face="Open Sans, Arial, sans-serif" style="box-sizing: border-box;"><font style="box-sizing: border-box; font-size: 10pt;">Lorem Ipsum</font></font></font></strong><font color="#000000" style="box-sizing: border-box;"><b style="box-sizing: border-box; font-weight: 700;"> </b></font><font color="#000000" style="box-sizing: border-box;"><font face="Open Sans, Arial, sans-serif" style="box-sizing: border-box;"><font style="box-sizing: border-box; font-size: 10pt;">is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</font></font></font></div><p align="CENTER" style="box-sizing: border-box; margin: 0px 0px 0in; line-height: 25px; color: rgb(91, 91, 91); font-family: proxima-nova, sans-serif; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial;"><b style="box-sizing: border-box; font-weight: 700;">For more information on what F.A.S.T. Complex/The Zone has to offer please go to our website at www.clickitonceabcd.com"</b></p>`;
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
      let expectedElem: string = `<span>"Lorem Ipsum&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span><p>For more information on what F.A.S.T. Complex/The Zone has to offer please go to our website at www.clickitonceabcd.com"</p>`;
      if (allElem.innerHTML !== expectedElem) {
        expected = false;
      }
      expect(expected).toBe(true);
      done();
    }, 100);
  });

  it("Paste URL", (done) => {
    keyBoardEvent.clipboardData = {
      getData: (e: any) => {
        if (e === "text/plain") {
          return 'https://ej2.syncfusion.com';
        } else {
          return '';
        }
      },
      items: []
    };
    rteObj.pasteCleanupSettings.prompt = false;
    rteObj.pasteCleanupSettings.plainText = false;
    rteObj.pasteCleanupSettings.keepFormat = true;
    rteObj.dataBind();
    (rteObj as any).inputElement.focus();
    setCursorPoint((rteObj as any).inputElement, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      let allElem: any =(rteObj as any).inputElement.firstElementChild;
      expect(allElem.children[0].children[0].tagName.toLowerCase() === 'a').toBe(true);
      expect(allElem.children[0].children[0].getAttribute('href') === 'https://ej2.syncfusion.com').toBe(true);
      done();
    }, 100);
  });

  it("Paste URL with 'www'", (done) => {
    keyBoardEvent.clipboardData = {
      getData: (e: any) => {
        if (e === "text/plain") {
          return 'www.ej2.syncfusion.com';
        } else {
          return '';
        }
      },
      items: []
    };
    rteObj.pasteCleanupSettings.prompt = false;
    rteObj.pasteCleanupSettings.plainText = false;
    rteObj.pasteCleanupSettings.keepFormat = true;
    rteObj.dataBind();
    (rteObj as any).inputElement.focus();
    setCursorPoint((rteObj as any).inputElement, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      let allElem: any = (rteObj as any).inputElement.firstElementChild;
      expect(allElem.children[0].children[0].tagName.toLowerCase() === 'a').toBe(true);
      expect(allElem.children[0].children[0].getAttribute('href') === 'www.ej2.syncfusion.com').toBe(true);
      done();
    }, 100);
  });

  it("Paste URL with other contents", (done) => {
    keyBoardEvent.clipboardData = {
      getData: (e: any) => {
        if (e === "text/plain") {
          return 'Hi syncfusion website https://ej2.syncfusion.com is here';
        } else {
          return '';
        }
      },
      items: []
    };
    rteObj.pasteCleanupSettings.prompt = false;
    rteObj.pasteCleanupSettings.plainText = false;
    rteObj.pasteCleanupSettings.keepFormat = true;
    rteObj.dataBind();
    (rteObj as any).inputElement.focus();
    setCursorPoint((rteObj as any).inputElement, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      let allElem: any = (rteObj as any).inputElement.firstElementChild;
      expect(allElem.children[0].childNodes[1].tagName.toLowerCase() === 'a').toBe(true);
      expect(allElem.children[0].childNodes[1].getAttribute('href') === 'https://ej2.syncfusion.com').toBe(true);
      let expected: boolean = false;
      let expectedElem: string = `<p>Hi syncfusion website <a classname="e-rte-anchor" href="https://ej2.syncfusion.com" title="https://ej2.syncfusion.com">https://ej2.syncfusion.com </a>is here</p>`;
      if (allElem.innerHTML === expectedElem) {
        expected = true;
      }
      expect(expected).toBe(true);
      done();
    }, 100);
  });

  it("Paste two URLs with other contents", (done) => {
    keyBoardEvent.clipboardData = {
      getData: (e: any) => {
        if (e === "text/plain") {
          return 'Hi syncfusion website https://ej2.syncfusion.com is here with another URL https://ej2.syncfusion.com text after second URL';
        } else {
          return '';
        }
      },
      items: []
    };
    rteObj.pasteCleanupSettings.prompt = false;
    rteObj.pasteCleanupSettings.plainText = false;
    rteObj.pasteCleanupSettings.keepFormat = true;
    rteObj.dataBind();
    (rteObj as any).inputElement.focus();
    setCursorPoint((rteObj as any).inputElement, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      let allElem: any = (rteObj as any).inputElement.firstElementChild;
      expect(allElem.children[0].childNodes[1].tagName.toLowerCase() === 'a').toBe(true);
      expect(allElem.children[0].childNodes[1].getAttribute('href') === 'https://ej2.syncfusion.com').toBe(true);
      let expected: boolean = false;
      let expectedElem: string = `<p>Hi syncfusion website <a classname="e-rte-anchor" href="https://ej2.syncfusion.com" title="https://ej2.syncfusion.com">https://ej2.syncfusion.com </a>is here with another URL <a classname="e-rte-anchor" href="https://ej2.syncfusion.com" title="https://ej2.syncfusion.com">https://ej2.syncfusion.com </a>text after second URL</p>`;
      if (allElem.innerHTML === expectedElem) {
        expected = true;
      }
      expect(expected).toBe(true);
      done();
    }, 100);
  });

  it("Paste notepad contents with space and enter with link", (done) => {
    keyBoardEvent.clipboardData = {
      getData: (e: any) => {
        if (e === "text/plain") {
          return `first line
        Second line with space https://ej2.syncfusion.com
   
   
third line`;
        } else {
          return '';
        }
      },
      items: []
    };
    rteObj.pasteCleanupSettings.prompt = false;
    rteObj.pasteCleanupSettings.plainText = false;
    rteObj.pasteCleanupSettings.keepFormat = true;
    rteObj.dataBind();
    (rteObj as any).inputElement.focus();
    setCursorPoint((rteObj as any).inputElement, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      let allElem: any = (rteObj as any).inputElement.firstElementChild;
      let expected: boolean = false;
      let expectedElem: string = `<p>first line</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Second line with space <a classname="e-rte-anchor" href="https://ej2.syncfusion.com" title="https://ej2.syncfusion.com">https://ej2.syncfusion.com </a></p><p><br></p><p><br></p><p>third line</p>`;
      if (allElem.innerHTML === expectedElem) {
        expected = true;
      }
      expect(expected).toBe(true);
      done();
    }, 100);
  });
  
  it("Paste content from Visual Studio with have HTML tags", (done) => {
    keyBoardEvent.clipboardData = {
      getData: (e: any) => {
        if (e === "text/plain") {
          return `using System;
          using System.Collections.Generic;
          using System.Linq;
          using System.Threading.Tasks;
          using System.Web.Mvc;
          
          namespace EJ2MVCSampleBrowser.Controllers
          {
              public partial class RichTextEditorController : Controller
              {
                  // GET: /<controller>/
                  public ActionResult API()
                  {
                      ViewBag.value = @"<p>RichTextEditor is a WYSIWYG editing control which will reduce the effort for users while trying to express their formatting word content as HTML or Markdown format.</p>
                              <p><b>API’s:</b></p>
                              <ul><li><p>maxLength - allows to restrict the maximum length to be entered.</p></li>
                              <li><p>readOnly - allows to change it as non-editable state.</p></li>
                              <li><p>enabled - enable or disable the RTE component.</p></li>
                              <li><p>enableHtmlEncode - Get the encoded string value through value property and source code panel</p></li>
                              <li><p>getValue - get the value of RTE.</p></li>
                              <li><p>getSelection - get the selected text of RTE.</p></li>
                              <li><p>selectAll - select all content in RTE.</p></li>
                              </ul>";
          
                      return View();
                  }
              }
          }`;
        } else {
          return '';
        }
      },
      items: []
    };
    rteObj.pasteCleanupSettings.prompt = false;
    rteObj.pasteCleanupSettings.plainText = false;
    rteObj.pasteCleanupSettings.keepFormat = true;
    rteObj.dataBind();
    (rteObj as any).inputElement.focus();
    setCursorPoint((rteObj as any).inputElement, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      let allElem: any = (rteObj as any).inputElement.firstElementChild;
      let expected: boolean = false;
      let expectedElem: string = `<p>using System;</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;using System.Collections.Generic;</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;using System.Linq;</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;using System.Threading.Tasks;</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;using System.Web.Mvc;</p><p><br></p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;namespace EJ2MVCSampleBrowser.Controllers</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;public partial class RichTextEditorController : Controller</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// GET: /&lt;controller&gt;/</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;public ActionResult API()</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ViewBag.value = @"&lt;p&gt;RichTextEditor is a WYSIWYG editing control which will reduce the effort for users while trying to express their formatting word content as HTML or Markdown format.&lt;/p&gt;</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;p&gt;&lt;b&gt;API’s:&lt;/b&gt;&lt;/p&gt;</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;ul&gt;&lt;li&gt;&lt;p&gt;maxLength - allows to restrict the maximum length to be entered.&lt;/p&gt;&lt;/li&gt;</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;li&gt;&lt;p&gt;readOnly - allows to change it as non-editable state.&lt;/p&gt;&lt;/li&gt;</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;li&gt;&lt;p&gt;enabled - enable or disable the RTE component.&lt;/p&gt;&lt;/li&gt;</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;li&gt;&lt;p&gt;enableHtmlEncode - Get the encoded string value through value property and source code panel&lt;/p&gt;&lt;/li&gt;</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;li&gt;&lt;p&gt;getValue - get the value of RTE.&lt;/p&gt;&lt;/li&gt;</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;li&gt;&lt;p&gt;getSelection - get the selected text of RTE.&lt;/p&gt;&lt;/li&gt;</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;li&gt;&lt;p&gt;selectAll - select all content in RTE.&lt;/p&gt;&lt;/li&gt;</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;/ul&gt;";</p><p><br></p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return View();</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}</p>`;
      if (allElem.innerHTML === expectedElem) {
        expected = true;
      }
      expect(expected).toBe(true);
      done();
    }, 100);
  });

  it("Paste notepad contents with space and enter", (done) => {
    keyBoardEvent.clipboardData = {
      getData: (e: any) => {
        if (e === "text/plain") {
          return `first line
        Second line with space
   
   
third line`;
        } else {
          return '';
        }
      },
      items: []
    };
    rteObj.pasteCleanupSettings.prompt = false;
    rteObj.pasteCleanupSettings.plainText = false;
    rteObj.pasteCleanupSettings.keepFormat = true;
    rteObj.dataBind();
    (rteObj as any).inputElement.focus();
    setCursorPoint((rteObj as any).inputElement, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      let allElem: any = (rteObj as any).inputElement.firstElementChild;
      let expected: boolean = false;
      let expectedElem: string = `<p>first line</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Second line with space</p><p><br></p><p><br></p><p>third line</p>`;
      if (allElem.innerHTML === expectedElem) {
        expected = true;
      }
      expect(expected).toBe(true);
      let elem: HTMLElement = editorObj.editableElement as HTMLElement;
      let start: HTMLElement = elem.querySelector('p');
      let end: HTMLElement = start;
      editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end, 0, 0);
      editorObj.execCommand("Alignments", 'JustifyRight', null);
      expect(start.style.textAlign === 'right').toBe(true);
      start.style.textAlign = '';
      editorObj.nodeSelection.Clear(document);
      done();
    }, 100);
  });

  it("Paste image 'PlainText'", (done) => {
    rteObj.pasteCleanupSettings.prompt = false;
    rteObj.pasteCleanupSettings.plainText = true;
    rteObj.dataBind();
    (rteObj as any).inputElement.focus();
    setCursorPoint((rteObj as any).inputElement, 0);
    let pasteCleanupObj: PasteCleanup = new PasteCleanup(rteObj, rteObj.serviceLocator);
    let elem: HTMLElement = createElement('span', {
      id: 'imagePaste', innerHTML: '<img src="https://cdn.syncfusion.com/content/images/company-logos/Syncfusion_Logo_Image.png" alt="Image result for syncfusion" class="e-resize e-img-focus">'
    });
    (pasteCleanupObj as any).imageFormatting(keyBoardEvent, {elements: [elem.firstElementChild]});
    setTimeout(() => {
      let allElem: any = (rteObj as any).inputElement.firstElementChild;
      let expected: boolean = true;
      let expectedElem: string = `<img src="https://cdn.syncfusion.com/content/images/company-logos/Syncfusion_Logo_Image.png" alt="Image result for syncfusion" class="e-resize e-img-focus">`;
      if (allElem.innerHTML !== expectedElem) {
        expected = true;
      }
      expect(expected).toBe(true);
      done();
    }, 100);
  });

  it("Paste image 'Prompt'", (done) => {
    rteObj.pasteCleanupSettings.prompt = true;
    rteObj.dataBind();
    (rteObj as any).inputElement.focus();
    setCursorPoint((rteObj as any).inputElement, 0);
    let pasteCleanupObj: PasteCleanup = new PasteCleanup(rteObj, rteObj.serviceLocator);
    let elem: HTMLElement = createElement('span', {
      id: 'imagePaste', innerHTML: '<img src="https://cdn.syncfusion.com/content/images/company-logos/Syncfusion_Logo_Image.png" alt="Image result for syncfusion" class="e-resize e-img-focus">'
    });
    (pasteCleanupObj as any).imageFormatting(keyBoardEvent, {elements: [elem.firstElementChild]});
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + "_pasteCleanupDialog").getElementsByClassName(CLS_RTE_PASTE_PLAIN_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let allElem: any = (rteObj as any).inputElement.firstElementChild;
      let expected: boolean = false;
      let expectedElem: string = `<img src="https://cdn.syncfusion.com/content/images/company-logos/Syncfusion_Logo_Image.png" alt="Image result for syncfusion" class="e-resize e-img-focus">`;
      if (allElem.innerHTML !== expectedElem) {
        expected = true;
      }
      expect(expected).toBe(true);
      done();
    }, 100);
  });

  it("Paste image 'keepFormat'", (done) => {
    rteObj.pasteCleanupSettings.prompt = false;
    rteObj.pasteCleanupSettings.plainText = false;
    rteObj.pasteCleanupSettings.keepFormat = true;
    rteObj.dataBind();
    (rteObj as any).inputElement.focus();
    setCursorPoint((rteObj as any).inputElement, 0);
    let pasteCleanupObj: PasteCleanup = new PasteCleanup(rteObj, rteObj.serviceLocator);
    let elem: HTMLElement = createElement('span', {
      id: 'imagePaste', innerHTML: '<img src="https://cdn.syncfusion.com/content/images/company-logos/Syncfusion_Logo_Image.png" alt="Image result for syncfusion" class="e-resize e-img-focus">'
    });
    (pasteCleanupObj as any).imageFormatting(keyBoardEvent, {elements: [elem.firstElementChild]});
    setTimeout(() => {
      let allElem: any = (rteObj as any).inputElement.firstElementChild;
      expect(allElem.children[0].tagName.toLowerCase() === 'img').toBe(true);
      let expected: boolean = false;
      let expectedElem: string = `<img src="https://cdn.syncfusion.com/content/images/company-logos/Syncfusion_Logo_Image.png" alt="Image result for syncfusion" class="e-resize e-img-focus">`;
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
    rteObj.dataBind();
    (rteObj as any).inputElement.focus();
    setCursorPoint((rteObj as any).inputElement, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_CANCEL);
        pasteOK[0].click();
      }
      let allElem: any =(rteObj as any).inputElement.firstElementChild;
      let expected: boolean = true;
      let expectedElem: string = `Paste cancel`;
      if (allElem.innerHTML === expectedElem) {
        expected = false;
      }
      expect(expected).toBe(true);
      done();
    }, 100);
  });
  it("Paste Dialog Event Trigger", (done) => {
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
    rteObj.pasteCleanupSettings.allowedStyleProps = ['color'];
    rteObj.dataBind();
    (rteObj as any).inputElement.focus();
    setCursorPoint((rteObj as any).inputElement, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_CANCEL);
        pasteOK[0].click();
      }
      expect(beforeDialogOpenEvent).toBe(true);
      done();
    }, 100);
  });
  afterAll(() => {
    rteObj.destroy();
  });
});

describe("Pasting text with max Length", () => {
  let editorObj: EditorManager;
  let rteObj: RichTextEditor;
  let pasteCleanUp: PasteCleanup;
  let rteEle: HTMLElement;
  let element: HTMLElement;
  let keepFormatButton: HTMLElement;
  let beforeDialogOpenEvent: boolean = false;
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
  let defaultString: string = `<div style="color:red;" id="content-edit" contenteditable="true" class="e-node-deletable e-node-inner"><p>dom node</p></div>`;

  beforeAll((done: Function) => {
    rteObj = renderRTE({
      pasteCleanupSettings: {
        prompt: true
      },
      showCharCount: true,
      maxLength: 10
    });
    rteEle = rteObj.element;
    editorObj = new EditorManager({ document: document, editableElement: document.getElementsByClassName("e-content")[0] });
    done();
  });
  it("pasting text exceeding max length testing", (done) => {
    let localElem: string = `<p>Syncfusion test case content with length more than 10</p>`;
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
        let keepFormat: any = document.getElementById(rteObj.getID() + "_pasteCleanupDialog");
        expect(keepFormat).toBeNull;
      }
      let allElem: any = (rteObj as any).inputElement.firstElementChild;
      let expected: boolean = true;
      let expectedElem: string = ``;
      if (allElem.textContent !== expectedElem) {
        expected = false;
      }
      expect(expected).toBe(true);
      done();
    }, 100);
  });
  afterAll(() => {
    destroy(rteObj);
  });
});
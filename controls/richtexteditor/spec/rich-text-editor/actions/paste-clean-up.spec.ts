/**
 * Paste CleanUp spec
 */
import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { EditorManager } from "../../../src/editor-manager/index";
import { RichTextEditor, PasteCleanup,actionComplete } from "../../../src/rich-text-editor/index";
import {
  CLS_RTE_PASTE_KEEP_FORMAT, CLS_RTE_PASTE_REMOVE_FORMAT, CLS_RTE_PASTE_PLAIN_FORMAT
} from "../../../src/rich-text-editor/base/classes";
import {
  CLS_RTE_PASTE_OK, CLS_RTE_PASTE_CANCEL
} from "../../../src/rich-text-editor/base/classes";
import { renderRTE, destroy, setCursorPoint } from "../render.spec";

describe("paste cleanup testing", () => {
  let editorObj: EditorManager;
  let rteObj: RichTextEditor;
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
  let defaultString: string = `<div style="color:red;" id="content-edit" contenteditable="true" class="e-node-deletable e-node-inner">
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
     </p></div>`;

  beforeAll((done: Function) => {
    rteObj = renderRTE({
      pasteCleanupSettings: {
        deniedTags: ["label, a[href, !alt], table[title], img[!src, !id]"],
        prompt: true
      },
      beforeDialogOpen: beforeDialogOpen
    });
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
    setCursorPoint((rteObj as any).inputElement.firstElementChild, 0);
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
    setCursorPoint((rteObj as any).inputElement.firstElementChild, 0);
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
    setCursorPoint((rteObj as any).inputElement.firstElementChild, 0);
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
    setCursorPoint((rteObj as any).inputElement.firstElementChild, 0);
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
    setCursorPoint((rteObj as any).inputElement.firstElementChild, 0);
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
    rteObj.value = '<p>1</p>';
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
    setCursorPoint((rteObj as any).inputElement.firstElementChild, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + "_pasteCleanupDialog").getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let pastedElm: any =(rteObj as any).inputElement.innerHTML;
      let expected: boolean = true;
      let expectedElem: string = `<div id="content-edit" contenteditable="true" class="e-node-deletable e-node-inner" style="color:red;"><p class="first-p-node" style="color:red; margin:10px;">dom node</p></div><p>1</p>`;
      if (pastedElm !== expectedElem) {
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
    rteObj.value = '<p>2</p>';
    rteObj.pasteCleanupSettings.deniedTags = [];
    rteObj.pasteCleanupSettings.deniedAttrs = [];
    rteObj.pasteCleanupSettings.allowedStyleProps = [];
    rteObj.dataBind();
    setCursorPoint((rteObj as any).inputElement.firstElementChild, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + "_pasteCleanupDialog").getElementsByClassName(CLS_RTE_PASTE_REMOVE_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let pastedElm: any = (rteObj as any).inputElement.innerHTML
      let expected: boolean = true;
      let expectedElem: string = `<p><span>Test for clean format removing the style attribute</span></p><p>2</p>`;
      if (pastedElm !== expectedElem) {
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
    rteObj.value = '<p>3</p>';
    rteObj.pasteCleanupSettings.prompt = false;
    rteObj.pasteCleanupSettings.keepFormat = false;
    rteObj.pasteCleanupSettings.deniedTags = [];
    rteObj.pasteCleanupSettings.deniedAttrs = [];
    rteObj.pasteCleanupSettings.allowedStyleProps = [];
    rteObj.dataBind();
    setCursorPoint((rteObj as any).inputElement.firstElementChild, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      let pastedElm: any = (rteObj as any).inputElement.innerHTML;
      let expected: boolean = true;
      let expectedElem: string = `<p><span>Test for clean format removing the style attribute</span></p><p>3</p>`;
      if (pastedElm !== expectedElem) {
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
    rteObj.value = '<p>4</p>';
    rteObj.pasteCleanupSettings.prompt = false;
    rteObj.pasteCleanupSettings.keepFormat = true;
    rteObj.pasteCleanupSettings.deniedTags = ['span'];
    rteObj.pasteCleanupSettings.deniedAttrs = [];
    rteObj.pasteCleanupSettings.allowedStyleProps = [];
    rteObj.dataBind();
    setCursorPoint((rteObj as any).inputElement.firstElementChild, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      let pastedElm: any = (rteObj as any).inputElement.innerHTML;
      let expected: boolean = true;
      let expectedElem: string = `<p>Test for clean format removing the style attribute</p><p>4</p>`;
      if (pastedElm !== expectedElem) {
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
    rteObj.value = '<p>5</p>'
    rteObj.pasteCleanupSettings.prompt = false;
    rteObj.pasteCleanupSettings.plainText = true;
    rteObj.pasteCleanupSettings.deniedTags = [];
    rteObj.pasteCleanupSettings.deniedAttrs = [];
    rteObj.pasteCleanupSettings.allowedStyleProps = [];
    rteObj.dataBind();
    setCursorPoint((rteObj as any).inputElement.firstElementChild, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      let pastedElm: any = (rteObj as any).inputElement.innerHTML
      let expected: boolean = true;
      let expectedElem: string = `<p><span>One Node-1</span></p><p>Two Node-1</p><p>Three Node-1</p><p>5</p>`;
      if (pastedElm !== expectedElem) {
        expected = false;
      }
      expect(expected).toBe(true);
      done();
    }, 100);
  });

  it("Plain paste without prompt with first tag as block node", (done) => {
    let localElem: string = `<!--StartFragment--><div class="r" style="font-weight: 400; margin: 0px; font-size: small; line-height: 1.57; color: rgb(34, 34, 34); font-family: arial, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial;"><a href="https://stackoverflow.com/questions/14535733/how-to-check-if-div-element-is-empty" ping="/url?sa=t&amp;source=web&amp;rct=j&amp;url=https://stackoverflow.com/questions/14535733/how-to-check-if-div-element-is-empty&amp;ved=2ahUKEwi0uumy88rkAhWHq48KHcruAHYQFjAAegQIAhAB" style="color: rgb(102, 0, 153); cursor: pointer; text-decoration: none;"><h3 class="LC20lb" style="font-size: 20px; font-weight: normal; margin: 0px; padding: 0px; display: inline-flex; max-width: 100%; line-height: 1.3;"><div class="ellip" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">How to check if div element is empty - Stack Overflow</div></h3><br><div class="TbwUpd" style="display: inline-block; line-height: 1.57; padding-bottom: 0px; padding-top: 1px;"><cite class="iUh30 bc" style="color: rgb(0, 102, 33); font-style: normal; font-size: 16px; padding-top: 1px; line-height: 1.5;">https://stackoverflow.com › questions › how-to-check-if-div-element-is-em...</cite></div></a><span><div class="action-menu ab_ctl" style="display: inline; position: relative; margin: 1px 3px 0px; user-select: none; vertical-align: middle;"><a class="GHDvEf ab_button" href="https://www.google.com/search?safe=off&amp;rlz=1C1GCEU_enIN858IN858&amp;sxsrf=ACYBGNQNtqskvF9E5O-LhbCduyrOpuksiw%3A1568278143880&amp;ei=fwZ6Xaq0NZOkwgPnyI7QDw&amp;q=how+to+check+if+the+element+is+empty+using+javascript&amp;oq=how+to+check+if+the+element+is+empty+using+javascript&amp;gs_l=psy-ab.3..0i22i30l4.3422.10049..10226...1.2..5.1044.7383.2j5j8j1j1j3j1j1......0....1..gws-wiz.......0i71.1WBHgC0t-pY&amp;ved=0ahUKEwjq77Kt88rkAhUTknAKHWekA_oQ4dUDCAs&amp;uact=5#" id="am-b0" aria-label="Result options" aria-expanded="false" aria-haspopup="true" role="button" jsaction="m.tdd;keydown:m.hbke;keypress:m.mskpe" data-ved="2ahUKEwi0uumy88rkAhWHq48KHcruAHYQ7B0wAHoECAIQAw" style="border-radius: 0px; cursor: default; font-family: arial, sans-serif; font-size: 11px; font-weight: bold; height: 12px; line-height: 27px; margin: 1px 0px 2px; min-width: 0px; padding: 0px; text-align: center; transition: none 0s ease 0s; user-select: none; background-color: white; background-image: none; border: 0px; color: rgb(68, 68, 68); box-shadow: 0px 0px 0px 0px; filter: none; width: 13px; text-decoration: none; display: inline-block;"><span class="mn-dwn-arw" style="border-color: rgb(0, 102, 33) transparent; border-style: solid; border-width: 5px 4px 0px; width: 0px; height: 0px; margin-left: 3px; top: 7.33333px; margin-top: -4px; position: absolute; left: 0px;"></span></a><div class="action-menu-panel ab_dropdown" role="menu" tabindex="-1" jsaction="keydown:m.hdke;mouseover:m.hdhne;mouseout:m.hdhue" data-ved="2ahUKEwi0uumy88rkAhWHq48KHcruAHYQqR8wAHoECAIQBA" style="background: rgb(255, 255, 255); border: 1px solid rgba(0, 0, 0, 0.2); font-size: 13px; padding: 0px; position: absolute; right: auto; top: 12px; white-space: nowrap; z-index: 3; transition: opacity 0.218s ease 0s; box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 4px; left: 0px; visibility: hidden;"><ol style="margin: 0px; padding: 0px; border: 0px;"><li class="action-menu-item ab_dropdownitem" role="menuitem" style="margin: 0px; padding: 0px; border: 0px; list-style: none; user-select: none; cursor: pointer;"><a class="fl" href="https://webcache.googleusercontent.com/search?q=cache:Q6gxbyHFlx8J:https://stackoverflow.com/questions/14535733/how-to-check-if-div-element-is-empty+&amp;cd=1&amp;hl=en&amp;ct=clnk&amp;gl=in" ping="/url?sa=t&amp;source=web&amp;rct=j&amp;url=https://webcache.googleusercontent.com/search%3Fq%3Dcache:Q6gxbyHFlx8J:https://stackoverflow.com/questions/14535733/how-to-check-if-div-element-is-empty%2B%26cd%3D1%26hl%3Den%26ct%3Dclnk%26gl%3Din&amp;ved=2ahUKEwi0uumy88rkAhWHq48KHcruAHYQIDAAegQIAhAF" style="text-decoration: none; color: rgb(51, 51, 51); cursor: pointer; font-size: 16px; display: block; padding: 7px 18px; outline: 0px;"></a></li></ol></div></div></span></div><div class="s" style="max-width: 48em; color: rgb(84, 84, 84); line-height: 1.57; font-family: arial, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial;"><div><br class="Apple-interchange-newline"><!--EndFragment--></div></div>`;
    keyBoardEvent.clipboardData = {
      getData: () => {
        return localElem;
      },
      items: []
    };
    rteObj.value = '<p>6</p>'
    rteObj.pasteCleanupSettings.prompt = false;
    rteObj.pasteCleanupSettings.plainText = true;
    rteObj.pasteCleanupSettings.deniedTags = [];
    rteObj.pasteCleanupSettings.deniedAttrs = [];
    rteObj.pasteCleanupSettings.allowedStyleProps = [];
    rteObj.dataBind();
    setCursorPoint((rteObj as any).inputElement.firstElementChild, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      let pastedElm: any = (rteObj as any).inputElement.innerHTML;
      let expected: boolean = false;
      let expectedElem: string = `<p><span>How to check if div element is empty - Stack Overflow</span></p><div>https://stackoverflow.com › questions › how-to-check-if-div-element-is-em...</div><div><br></div><p>6</p>`;
      if (pastedElm === expectedElem) {
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
    rteObj.value = '<p>7</p>';
    rteObj.pasteCleanupSettings.prompt = false;
    rteObj.pasteCleanupSettings.plainText = true;
    rteObj.pasteCleanupSettings.deniedTags = [];
    rteObj.pasteCleanupSettings.deniedAttrs = [];
    rteObj.pasteCleanupSettings.allowedStyleProps = [];
    rteObj.dataBind();
    setCursorPoint((rteObj as any).inputElement.firstElementChild, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      let pastedElm: any = (rteObj as any).inputElement.innerHTML;
      let expected: boolean = true;
      let expectedElem: string = `<p><span>One Node-1</span></p><div>Two Node-1</div><div>Three Node-1</div><p>7</p>`;
      if (pastedElm !== expectedElem) {
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
    rteObj.value = '<p>8</p>';
    rteObj.pasteCleanupSettings.prompt = true;
    rteObj.pasteCleanupSettings.deniedTags = [];
    rteObj.pasteCleanupSettings.deniedAttrs = [];
    rteObj.pasteCleanupSettings.allowedStyleProps = [];
    rteObj.dataBind();
    setCursorPoint((rteObj as any).inputElement.firstElementChild, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + "_pasteCleanupDialog").getElementsByClassName(CLS_RTE_PASTE_PLAIN_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let pastedElm: any = (rteObj as any).inputElement.innerHTML;
      let expected: boolean = true;
      let expectedElem: string = `<p><span>One Node-1</span></p><p>Two Node-1</p><p>Three Node-1</p><p>8</p>`;
      if (pastedElm !== expectedElem) {
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
    rteObj.value = '<p>9</p>';
    rteObj.pasteCleanupSettings.prompt = true;
    rteObj.pasteCleanupSettings.deniedTags = [];
    rteObj.pasteCleanupSettings.deniedAttrs = [];
    rteObj.pasteCleanupSettings.allowedStyleProps = [];
    rteObj.dataBind();
    setCursorPoint((rteObj as any).inputElement.firstElementChild, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + "_pasteCleanupDialog").getElementsByClassName(CLS_RTE_PASTE_PLAIN_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let pastedElm: any = (rteObj as any).inputElement.innerHTML;
      let expected: boolean = true;
      let expectedElem: string = `<p><span>First para start 65. Syncfusionlinkis here</span></p><p>Second para inside blockquote</p><p>9</p>`;
      if (pastedElm !== expectedElem) {
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
    rteObj.value = '<p>10</p>';
    rteObj.pasteCleanupSettings.prompt = true;
    rteObj.pasteCleanupSettings.deniedTags = [];
    rteObj.pasteCleanupSettings.deniedAttrs = [];
    rteObj.pasteCleanupSettings.allowedStyleProps = [];
    rteObj.dataBind();
    setCursorPoint((rteObj as any).inputElement.firstElementChild, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + "_pasteCleanupDialog").getElementsByClassName(CLS_RTE_PASTE_PLAIN_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let pastedElm: any = (rteObj as any).inputElement.innerHTML;
      let expected: boolean = false;
      let expectedElem: string = `<p><span>To break lines</span></p><p><br>in a text,<br>use the br element.</p><p>10</p>`;
      if (pastedElm === expectedElem) {
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
    rteObj.value = '<p>11</p>';
    rteObj.pasteCleanupSettings.prompt = true;
    rteObj.pasteCleanupSettings.deniedTags = [];
    rteObj.pasteCleanupSettings.deniedAttrs = [];
    rteObj.pasteCleanupSettings.allowedStyleProps = [];
    rteObj.dataBind();
    setCursorPoint((rteObj as any).inputElement.firstElementChild, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + "_pasteCleanupDialog").getElementsByClassName(CLS_RTE_PASTE_PLAIN_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let pastedElm: any = (rteObj as any).inputElement.innerHTML;
      let expected: boolean = true;
      let expectedElem: string = `<p><span>"Lorem Ipsum&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span></p><p>For more information on what F.A.S.T. Complex/The Zone has to offer please go to our website at www.clickitonceabcd.com"</p><p>11</p>`;
      if (pastedElm !== expectedElem) {
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
    rteObj.value = '<p>12</p>';
    rteObj.pasteCleanupSettings.prompt = false;
    rteObj.pasteCleanupSettings.plainText = false;
    rteObj.pasteCleanupSettings.keepFormat = true;
    rteObj.dataBind();
    (rteObj as any).inputElement.focus();
    setCursorPoint((rteObj as any).inputElement.firstElementChild, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      let pastedElm: any =(rteObj as any).inputElement.firstElementChild;
      expect(pastedElm.children[0].tagName.toLowerCase() === 'a').toBe(true);
      expect(pastedElm.children[0].getAttribute('href') === 'https://ej2.syncfusion.com').toBe(true);
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
    rteObj.value = '<p>13</p>';
    rteObj.pasteCleanupSettings.prompt = false;
    rteObj.pasteCleanupSettings.plainText = false;
    rteObj.pasteCleanupSettings.keepFormat = true;
    rteObj.dataBind();
    (rteObj as any).inputElement.focus();
    setCursorPoint((rteObj as any).inputElement.firstElementChild, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      let pastedElm: any = (rteObj as any).inputElement.firstElementChild;
      expect(pastedElm.children[0].tagName.toLowerCase() === 'a').toBe(true);
      expect(pastedElm.children[0].getAttribute('href') === 'www.ej2.syncfusion.com').toBe(true);
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
    rteObj.value = '<p>14</p>';
    rteObj.pasteCleanupSettings.prompt = false;
    rteObj.pasteCleanupSettings.plainText = false;
    rteObj.pasteCleanupSettings.keepFormat = true;
    rteObj.dataBind();
    setCursorPoint((rteObj as any).inputElement.firstElementChild, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      let pastedElm: any = (rteObj as any).inputElement;
      expect(pastedElm.children[0].childNodes[1].tagName.toLowerCase() === 'a').toBe(true);
      expect(pastedElm.children[0].childNodes[1].getAttribute('href') === 'https://ej2.syncfusion.com').toBe(true);
      let expected: boolean = false;
      let expectedElem: string = `<p>Hi syncfusion website <a classname="e-rte-anchor" href="https://ej2.syncfusion.com" title="https://ej2.syncfusion.com">https://ej2.syncfusion.com </a>is here</p><p>14</p>`;
      if (pastedElm.innerHTML === expectedElem) {
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
    rteObj.value = '<p>15</p>';
    rteObj.pasteCleanupSettings.prompt = false;
    rteObj.pasteCleanupSettings.plainText = false;
    rteObj.pasteCleanupSettings.keepFormat = true;
    rteObj.dataBind();
    setCursorPoint((rteObj as any).inputElement.firstElementChild, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      let pastedElm: any = (rteObj as any).inputElement;
      expect(pastedElm.children[0].childNodes[1].tagName.toLowerCase() === 'a').toBe(true);
      expect(pastedElm.children[0].childNodes[1].getAttribute('href') === 'https://ej2.syncfusion.com').toBe(true);
      let expected: boolean = false;
      let expectedElem: string = `<p>Hi syncfusion website <a classname="e-rte-anchor" href="https://ej2.syncfusion.com" title="https://ej2.syncfusion.com">https://ej2.syncfusion.com </a>is here with another URL <a classname="e-rte-anchor" href="https://ej2.syncfusion.com" title="https://ej2.syncfusion.com">https://ej2.syncfusion.com </a>text after second URL</p><p>15</p>`;
      if (pastedElm.innerHTML === expectedElem) {
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
    rteObj.value = '<p>16</p>';
    rteObj.pasteCleanupSettings.prompt = false;
    rteObj.pasteCleanupSettings.plainText = false;
    rteObj.pasteCleanupSettings.keepFormat = true;
    rteObj.dataBind();
    setCursorPoint((rteObj as any).inputElement.firstElementChild, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      let pastedElm: any = (rteObj as any).inputElement.innerHTML;
      let expected: boolean = false;
      let expectedElem: string = `<p>first line</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Second line with space <a classname="e-rte-anchor" href="https://ej2.syncfusion.com" title="https://ej2.syncfusion.com">https://ej2.syncfusion.com </a></p><p><br></p><p><br></p><p>third line</p><p>16</p>`;
      if (pastedElm === expectedElem) {
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
    rteObj.value = '<p>17</p>';
    rteObj.pasteCleanupSettings.prompt = false;
    rteObj.pasteCleanupSettings.plainText = false;
    rteObj.pasteCleanupSettings.keepFormat = true;
    rteObj.dataBind();
    setCursorPoint((rteObj as any).inputElement.firstElementChild, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      let pastedElm: any = (rteObj as any).inputElement.innerHTML;
      let expected: boolean = false;
      let expectedElem: string = `<p>using System;</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;using System.Collections.Generic;</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;using System.Linq;</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;using System.Threading.Tasks;</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;using System.Web.Mvc;</p><p><br></p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;namespace EJ2MVCSampleBrowser.Controllers</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;public partial class RichTextEditorController : Controller</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// GET: /&lt;controller&gt;/</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;public ActionResult API()</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ViewBag.value = @"&lt;p&gt;RichTextEditor is a WYSIWYG editing control which will reduce the effort for users while trying to express their formatting word content as HTML or Markdown format.&lt;/p&gt;</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;p&gt;&lt;b&gt;API’s:&lt;/b&gt;&lt;/p&gt;</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;ul&gt;&lt;li&gt;&lt;p&gt;maxLength - allows to restrict the maximum length to be entered.&lt;/p&gt;&lt;/li&gt;</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;li&gt;&lt;p&gt;readOnly - allows to change it as non-editable state.&lt;/p&gt;&lt;/li&gt;</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;li&gt;&lt;p&gt;enabled - enable or disable the RTE component.&lt;/p&gt;&lt;/li&gt;</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;li&gt;&lt;p&gt;enableHtmlEncode - Get the encoded string value through value property and source code panel&lt;/p&gt;&lt;/li&gt;</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;li&gt;&lt;p&gt;getValue - get the value of RTE.&lt;/p&gt;&lt;/li&gt;</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;li&gt;&lt;p&gt;getSelection - get the selected text of RTE.&lt;/p&gt;&lt;/li&gt;</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;li&gt;&lt;p&gt;selectAll - select all content in RTE.&lt;/p&gt;&lt;/li&gt;</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;/ul&gt;";</p><p><br></p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return View();</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}</p><p>17</p>`;
      if (pastedElm === expectedElem) {
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
    rteObj.value = '<p>18</p>';
    rteObj.pasteCleanupSettings.prompt = false;
    rteObj.pasteCleanupSettings.plainText = false;
    rteObj.pasteCleanupSettings.keepFormat = true;
    rteObj.dataBind();
    setCursorPoint((rteObj as any).inputElement.firstElementChild, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      let pastedElm: any = (rteObj as any).inputElement.innerHTML;
      let expected: boolean = false;
      let expectedElem: string = `<p>first line</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Second line with space</p><p><br></p><p><br></p><p>third line</p><p>18</p>`;
      if (pastedElm === expectedElem) {
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
    rteObj.value = '<p>19</p>';
    rteObj.pasteCleanupSettings.prompt = false;
    rteObj.pasteCleanupSettings.plainText = true;
    rteObj.dataBind();
    setCursorPoint((rteObj as any).inputElement.firstElementChild, 0);
    let pasteCleanupObj: PasteCleanup = new PasteCleanup(rteObj, rteObj.serviceLocator);
    let elem: HTMLElement = createElement('span', {
      id: 'imagePaste', innerHTML: '<img src="https://cdn.syncfusion.com/content/images/company-logos/Syncfusion_Logo_Image.png" alt="Image result for syncfusion" class="e-resize e-img-focus">'
    });
    (pasteCleanupObj as any).imageFormatting(keyBoardEvent, {elements: [elem.firstElementChild]});
    setTimeout(() => {
      let pastedElm: any = (rteObj as any).inputElement.innerHTML;
      let expected: boolean = true;
      let expectedElem: string = `<p><img src="https://cdn.syncfusion.com/content/images/company-logos/Syncfusion_Logo_Image.png" alt="Image result for syncfusion" class="e-resize e-img-focus"></p><p>19</p>`;
      if (pastedElm !== expectedElem) {
        expected = true;
      }
      expect(expected).toBe(true);
      done();
    }, 100);
  });

  it("Paste image 'Prompt'", (done) => {
    rteObj.value = '<p>20</p>';
    rteObj.pasteCleanupSettings.prompt = true;
    rteObj.dataBind();
    setCursorPoint((rteObj as any).inputElement.firstElementChild, 0);
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
      let pastedElm: any = (rteObj as any).inputElement.innerHTML;
      let expected: boolean = false;
      let expectedElem: string = `<p><img src="https://cdn.syncfusion.com/content/images/company-logos/Syncfusion_Logo_Image.png" alt="Image result for syncfusion" class="e-resize e-img-focus"></p><p>20</p>`;
      if (pastedElm !== expectedElem) {
        expected = true;
      }
      expect(expected).toBe(true);
      done();
    }, 100);
  });

  it("Paste image 'keepFormat'", (done) => {
    rteObj.value = '<p>21</p>';
    rteObj.pasteCleanupSettings.prompt = false;
    rteObj.pasteCleanupSettings.plainText = false;
    rteObj.pasteCleanupSettings.keepFormat = true;
    rteObj.dataBind();
    setCursorPoint((rteObj as any).inputElement.firstElementChild, 0);
    let pasteCleanupObj: PasteCleanup = new PasteCleanup(rteObj, rteObj.serviceLocator);
    let elem: HTMLElement = createElement('span', {
      id: 'imagePaste', innerHTML: '<img src="https://cdn.syncfusion.com/content/images/company-logos/Syncfusion_Logo_Image.png" alt="Image result for syncfusion" class="e-resize e-img-focus">'
    });
    (pasteCleanupObj as any).imageFormatting(keyBoardEvent, {elements: [elem.firstElementChild]});
    setTimeout(() => {
      let pastedElm: any = (rteObj as any).inputElement.innerHTML;
      expect(rteObj.inputElement.children[0].children[0].tagName.toLowerCase() === 'img').toBe(true);
      let expected: boolean = false;
      let expectedElem: string = `<p><img src="https://cdn.syncfusion.com/content/images/company-logos/Syncfusion_Logo_Image.png" alt="Image result for syncfusion" class="e-resize e-img-focus e-rte-image e-imginline"> 21</p>`;
      if (pastedElm === expectedElem) {
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
    setCursorPoint((rteObj as any).inputElement.firstElementChild, 0);
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
    setCursorPoint((rteObj as any).inputElement.firstElementChild, 0);
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
  it("Paste base64 images testing", (done) => {
    let localElem: string = `<div style="color:red;" id="content-edit" contenteditable="true" class="e-node-deletable e-node-inner">
    <img src="data:image/png;base64,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`
+ `96F41gHWylg6dldX1IYkYIqw/WOvbcgyIGhX1LJd0BU2aUs6ZVut9vr5Jm8AcETQS7lQkA1YOaOvWz4gTAKupvchoCQVMjBbCkk8H8GJ9KryxHEUmnezhOVxvexWT8QukFPGPFE4EkrZJDccsqA4/RmTfZc+uWBYNnJEp8EQWTL4U2plJG/jnUd4nESxa2s/hMgwGlNk9Ij81ohs9ypprtU3H0kw6dGADplGwLeqhYKz8UX026P6ZozDreGAHRplqiCchxzwcQXQuDS1UiM4ju3jqDTsCCgrDqEKHewAAKfBsISurznEcOfFAHolE0eOd61Mdy7c6bScRifSyPes9BPigB0yoa5UhkPrdYaHggaPQQ12eN7AY8KCg+BYiKg+JGnlLbcAPQUH5vlg3bK4SFg7hldGrfrfXqUlnGMMhqGuXfS3YAnBYWHoBAnCKiG80R2ndieFQKVNmfbIlqaDxhWhIdAgB0CIn60SKWTvBlfULuUpcfIZ/iAYUV4CJI9HQHHLW5NECLptcUztg6g2uADdsrhIWAvM9idpqoeVwlJXTwhye1qtkJyDW6B6q2i8BBEOhgBTy117BIaKvENB0yAIGCnHCICDYcV6RXlKOCutCuWVjKeY1cfFCKCPBzrU42VTZnbTbl9f4GP97xuXk0hIqjCnB3fXV1nOev2VRLHOSMpnxQigjJEkAk4UGEpzgd2LwoXQZrKBB2ogGFcsAdDRKDwAMGi7ngljdJcsAdDRFDgoAyCDlQuM7ePQIKBUSagT4xkG7ePgKXAWD8d0CfeCQSRLgiM+MAI7oAWwQQ876c/8CTqDvgiGBjxXEA+tLsQVcDkL89x6w/Yk4VcJx2//fEBMOU4MIS03+OJ2aQkwAUYo3i6AdMct5+zA5TjQJe2simTBQUu2c72uhyfzmTQAmK+FzRtGi6CSDlDZZZ0ynDRS6cH18lneExo9fMoqynBT2UOF0FEASGmkxkWrjcvw3lToC67DR6uKAbMd+Fab62sXPd4+JARsJecRQispJSrnewIrfPD680B7xkKNHo1p3gcuH0HEERycS7TUWJKOa9lYatDPUfqQnVxo1cZuBsgDNZvCEEkn443MulMAxC2UZ4aXXa0fE655hnqiyh0BJFqXNcWPg1ttKwwQjLc1yzZKXwEkaTW6/UA60yYbyZaTDeAANBNtrmTbgbBp6R1EJBdIEFjsJshC4IV4UDZlMHldd4KECqxzOWjewYtn8hiR5ZlxlxPuQuKJFVHKQuAdGrp8CprufXevUePqPKtY8iNHtmYunfvH0tea1bo2u8FGHphvgVtfUpq9xz8A6aWZEpyzpvB7feWpdlvmtheyoOlJQgYyn3/vUdB01vXJzbrEgCgxLLIpef1xKNw3sAVgLR/eLCz20sWmH9D9AsroV8KZQ+h3XsUMN98bfIUQSb+2Weff/6ZN33+2Rf/3E27H+rekkNiO24EmfTnXyxgH9MX/2w0XDIImt+6NikuVvjRF8sBAAifdzN2B5xJ317nrFhYSTdSjdFnKwEACF98PkrDfUyY/dRB4HVZYZDU6XKgV3oEh97d3goFsoLojPC+dvBU+dMMABZSUqlqiL4AbbvQhB0E7gO35/PV3JKfmYwAAAAjSURBVPXf3xYasfCkgRh0o7/4AtPnDsK/IrfKwMMGbmrQ+P8fqKtA+4EH0QAAAABJRU5ErkJggg==" alt="Image result for base64 image" style="background-color: unset; text-align: inherit; font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, sans-serif, -apple-system, BlinkMacSystemFont; outline: rgb(74, 144, 226) solid 2px;" class="e-resize e-img-focus" width="39" height="52">
    </div>`;
    keyBoardEvent.clipboardData = {
      getData: () => {
        return localElem;
      },
      items: []
    };
    rteObj.dataBind();
    (rteObj as any).inputElement.focus();
    setCursorPoint((rteObj as any).inputElement.firstElementChild, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + "_pasteCleanupDialog").getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let allElem: any =(rteObj as any).inputElement.firstElementChild.querySelectorAll("*");
      expect(allElem[0].parentElement.querySelector('img').getAttribute('src').indexOf('blob:') === 0).toBe(true);
      done();
    }, 100);
  });

  afterAll(() => {
    destroy(rteObj);
  });
});

describe("Pasting text with max Length", () => {
  let rteObj: RichTextEditor;
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

  beforeAll((done: Function) => {
    rteObj = renderRTE({
      pasteCleanupSettings: {
        prompt: true
      },
      showCharCount: true,
      maxLength: 10
    });
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
    setCursorPoint((rteObj as any).inputElement.firstElementChild, 0);
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

describe("To test image uploading", () => {
  let rteObj: RichTextEditor;
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

  beforeAll((done: Function) => {
    rteObj = renderRTE({
      pasteCleanupSettings: {
        prompt: true
      }
    });
    done();
  });
  it("To Paste base64 images and upload", (done) => {
    let pasteCleanupObj: PasteCleanup = new PasteCleanup(rteObj, rteObj.serviceLocator);
    let localElem: string = `<div style="color:red;" id="content-edit" contenteditable="true" class="e-node-deletable e-node-inner">
    <img src="data:image/png;base64,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`
+ `96F41gHWylg6dldX1IYkYIqw/WOvbcgyIGhX1LJd0BU2aUs6ZVut9vr5Jm8AcETQS7lQkA1YOaOvWz4gTAKupvchoCQVMjBbCkk8H8GJ9KryxHEUmnezhOVxvexWT8QukFPGPFE4EkrZJDccsqA4/RmTfZc+uWBYNnJEp8EQWTL4U2plJG/jnUd4nESxa2s/hMgwGlNk9Ij81ohs9ypprtU3H0kw6dGADplGwLeqhYKz8UX026P6ZozDreGAHRplqiCchxzwcQXQuDS1UiM4ju3jqDTsCCgrDqEKHewAAKfBsISurznEcOfFAHolE0eOd61Mdy7c6bScRifSyPes9BPigB0yoa5UhkPrdYaHggaPQQ12eN7AY8KCg+BYiKg+JGnlLbcAPQUH5vlg3bK4SFg7hldGrfrfXqUlnGMMhqGuXfS3YAnBYWHoBAnCKiG80R2ndieFQKVNmfbIlqaDxhWhIdAgB0CIn60SKWTvBlfULuUpcfIZ/iAYUV4CJI9HQHHLW5NECLptcUztg6g2uADdsrhIWAvM9idpqoeVwlJXTwhye1qtkJyDW6B6q2i8BBEOhgBTy117BIaKvENB0yAIGCnHCICDYcV6RXlKOCutCuWVjKeY1cfFCKCPBzrU42VTZnbTbl9f4GP97xuXk0hIqjCnB3fXV1nOev2VRLHOSMpnxQigjJEkAk4UGEpzgd2LwoXQZrKBB2ogGFcsAdDRKDwAMGi7ngljdJcsAdDRFDgoAyCDlQuM7ePQIKBUSagT4xkG7ePgKXAWD8d0CfeCQSRLgiM+MAI7oAWwQQ876c/8CTqDvgiGBjxXEA+tLsQVcDkL89x6w/Yk4VcJx2//fEBMOU4MIS03+OJ2aQkwAUYo3i6AdMct5+zA5TjQJe2simTBQUu2c72uhyfzmTQAmK+FzRtGi6CSDlDZZZ0ynDRS6cH18lneExo9fMoqynBT2UOF0FEASGmkxkWrjcvw3lToC67DR6uKAbMd+Fab62sXPd4+JARsJecRQispJSrnewIrfPD680B7xkKNHo1p3gcuH0HEERycS7TUWJKOa9lYatDPUfqQnVxo1cZuBsgDNZvCEEkn443MulMAxC2UZ4aXXa0fE655hnqiyh0BJFqXNcWPg1ttKwwQjLc1yzZKXwEkaTW6/UA60yYbyZaTDeAANBNtrmTbgbBp6R1EJBdIEFjsJshC4IV4UDZlMHldd4KECqxzOWjewYtn8hiR5ZlxlxPuQuKJFVHKQuAdGrp8CprufXevUePqPKtY8iNHtmYunfvH0tea1bo2u8FGHphvgVtfUpq9xz8A6aWZEpyzpvB7feWpdlvmtheyoOlJQgYyn3/vUdB01vXJzbrEgCgxLLIpef1xKNw3sAVgLR/eLCz20sWmH9D9AsroV8KZQ+h3XsUMN98bfIUQSb+2Weff/6ZN33+2Rf/3E27H+rekkNiO24EmfTnXyxgH9MX/2w0XDIImt+6NikuVvjRF8sBAAifdzN2B5xJ317nrFhYSTdSjdFnKwEACF98PkrDfUyY/dRB4HVZYZDU6XKgV3oEh97d3goFsoLojPC+dvBU+dMMABZSUqlqiL4AbbvQhB0E7gO35/PV3JKfmYwAAAAjSURBVPXf3xYasfCkgRh0o7/4AtPnDsK/IrfKwMMGbmrQ+P8fqKtA+4EH0QAAAABJRU5ErkJggg==" alt="Image result for base64 image" style="background-color: unset; text-align: inherit; font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, sans-serif, -apple-system, BlinkMacSystemFont; outline: rgb(74, 144, 226) solid 2px;" class="e-resize e-img-focus" width="39" height="52">
    </div>`;
    let base64 = `data:image/png;base64,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`
    + `96F41gHWylg6dldX1IYkYIqw/WOvbcgyIGhX1LJd0BU2aUs6ZVut9vr5Jm8AcETQS7lQkA1YOaOvWz4gTAKupvchoCQVMjBbCkk8H8GJ9KryxHEUmnezhOVxvexWT8QukFPGPFE4EkrZJDccsqA4/RmTfZc+uWBYNnJEp8EQWTL4U2plJG/jnUd4nESxa2s/hMgwGlNk9Ij81ohs9ypprtU3H0kw6dGADplGwLeqhYKz8UX026P6ZozDreGAHRplqiCchxzwcQXQuDS1UiM4ju3jqDTsCCgrDqEKHewAAKfBsISurznEcOfFAHolE0eOd61Mdy7c6bScRifSyPes9BPigB0yoa5UhkPrdYaHggaPQQ12eN7AY8KCg+BYiKg+JGnlLbcAPQUH5vlg3bK4SFg7hldGrfrfXqUlnGMMhqGuXfS3YAnBYWHoBAnCKiG80R2ndieFQKVNmfbIlqaDxhWhIdAgB0CIn60SKWTvBlfULuUpcfIZ/iAYUV4CJI9HQHHLW5NECLptcUztg6g2uADdsrhIWAvM9idpqoeVwlJXTwhye1qtkJyDW6B6q2i8BBEOhgBTy117BIaKvENB0yAIGCnHCICDYcV6RXlKOCutCuWVjKeY1cfFCKCPBzrU42VTZnbTbl9f4GP97xuXk0hIqjCnB3fXV1nOev2VRLHOSMpnxQigjJEkAk4UGEpzgd2LwoXQZrKBB2ogGFcsAdDRKDwAMGi7ngljdJcsAdDRFDgoAyCDlQuM7ePQIKBUSagT4xkG7ePgKXAWD8d0CfeCQSRLgiM+MAI7oAWwQQ876c/8CTqDvgiGBjxXEA+tLsQVcDkL89x6w/Yk4VcJx2//fEBMOU4MIS03+OJ2aQkwAUYo3i6AdMct5+zA5TjQJe2simTBQUu2c72uhyfzmTQAmK+FzRtGi6CSDlDZZZ0ynDRS6cH18lneExo9fMoqynBT2UOF0FEASGmkxkWrjcvw3lToC67DR6uKAbMd+Fab62sXPd4+JARsJecRQispJSrnewIrfPD680B7xkKNHo1p3gcuH0HEERycS7TUWJKOa9lYatDPUfqQnVxo1cZuBsgDNZvCEEkn443MulMAxC2UZ4aXXa0fE655hnqiyh0BJFqXNcWPg1ttKwwQjLc1yzZKXwEkaTW6/UA60yYbyZaTDeAANBNtrmTbgbBp6R1EJBdIEFjsJshC4IV4UDZlMHldd4KECqxzOWjewYtn8hiR5ZlxlxPuQuKJFVHKQuAdGrp8CprufXevUePqPKtY8iNHtmYunfvH0tea1bo2u8FGHphvgVtfUpq9xz8A6aWZEpyzpvB7feWpdlvmtheyoOlJQgYyn3/vUdB01vXJzbrEgCgxLLIpef1xKNw3sAVgLR/eLCz20sWmH9D9AsroV8KZQ+h3XsUMN98bfIUQSb+2Weff/6ZN33+2Rf/3E27H+rekkNiO24EmfTnXyxgH9MX/2w0XDIImt+6NikuVvjRF8sBAAifdzN2B5xJ317nrFhYSTdSjdFnKwEACF98PkrDfUyY/dRB4HVZYZDU6XKgV3oEh97d3goFsoLojPC+dvBU+dMMABZSUqlqiL4AbbvQhB0E7gO35/PV3JKfmYwAAAAjSURBVPXf3xYasfCkgRh0o7/4AtPnDsK/IrfKwMMGbmrQ+P8fqKtA+4EH0QAAAABJRU5ErkJggg==`;
    let fileName = 'SynfusionTestImage';
    keyBoardEvent.clipboardData = {
      getData: () => {
        return localElem;
      },
      items: []
    };
    let file: any = (pasteCleanupObj as any).base64ToFile(base64, fileName);
    setTimeout(() => {
      expect(file.name === 'SynfusionTestImage.png').toBe(true);
      done();
    }, 100);
  });
  afterAll(() => {
    destroy(rteObj);
  });
});

describe("To test action Complete event for the image and content", () => {
  let rteObj: RichTextEditor;
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
  let actionCompleteContent: boolean = false;
  let actionCompleteImg: boolean = false;
  beforeAll((done: Function) => {

    rteObj = renderRTE({
      pasteCleanupSettings: {
        prompt: true
      },
      actionComplete: actionCompleteFun
    });
    function actionCompleteFun(args: any): void {
      if (args.elements[0].classList.contains('pasteContent_RTE')) {
        actionCompleteContent = true;
      }
      if (args.imageElements[0].classList.contains('pasteContent_Img')) {
        actionCompleteImg = true;
      }
    }
    done();
  });
  it("Paste base64 images testing", (done) => {
    let localElem: string = `<div style="color:red;" id="content-edit" contenteditable="true" class="e-node-deletable e-node-inner">
    <img src="data:image/png;base64,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`
+ `96F41gHWylg6dldX1IYkYIqw/WOvbcgyIGhX1LJd0BU2aUs6ZVut9vr5Jm8AcETQS7lQkA1YOaOvWz4gTAKupvchoCQVMjBbCkk8H8GJ9KryxHEUmnezhOVxvexWT8QukFPGPFE4EkrZJDccsqA4/RmTfZc+uWBYNnJEp8EQWTL4U2plJG/jnUd4nESxa2s/hMgwGlNk9Ij81ohs9ypprtU3H0kw6dGADplGwLeqhYKz8UX026P6ZozDreGAHRplqiCchxzwcQXQuDS1UiM4ju3jqDTsCCgrDqEKHewAAKfBsISurznEcOfFAHolE0eOd61Mdy7c6bScRifSyPes9BPigB0yoa5UhkPrdYaHggaPQQ12eN7AY8KCg+BYiKg+JGnlLbcAPQUH5vlg3bK4SFg7hldGrfrfXqUlnGMMhqGuXfS3YAnBYWHoBAnCKiG80R2ndieFQKVNmfbIlqaDxhWhIdAgB0CIn60SKWTvBlfULuUpcfIZ/iAYUV4CJI9HQHHLW5NECLptcUztg6g2uADdsrhIWAvM9idpqoeVwlJXTwhye1qtkJyDW6B6q2i8BBEOhgBTy117BIaKvENB0yAIGCnHCICDYcV6RXlKOCutCuWVjKeY1cfFCKCPBzrU42VTZnbTbl9f4GP97xuXk0hIqjCnB3fXV1nOev2VRLHOSMpnxQigjJEkAk4UGEpzgd2LwoXQZrKBB2ogGFcsAdDRKDwAMGi7ngljdJcsAdDRFDgoAyCDlQuM7ePQIKBUSagT4xkG7ePgKXAWD8d0CfeCQSRLgiM+MAI7oAWwQQ876c/8CTqDvgiGBjxXEA+tLsQVcDkL89x6w/Yk4VcJx2//fEBMOU4MIS03+OJ2aQkwAUYo3i6AdMct5+zA5TjQJe2simTBQUu2c72uhyfzmTQAmK+FzRtGi6CSDlDZZZ0ynDRS6cH18lneExo9fMoqynBT2UOF0FEASGmkxkWrjcvw3lToC67DR6uKAbMd+Fab62sXPd4+JARsJecRQispJSrnewIrfPD680B7xkKNHo1p3gcuH0HEERycS7TUWJKOa9lYatDPUfqQnVxo1cZuBsgDNZvCEEkn443MulMAxC2UZ4aXXa0fE655hnqiyh0BJFqXNcWPg1ttKwwQjLc1yzZKXwEkaTW6/UA60yYbyZaTDeAANBNtrmTbgbBp6R1EJBdIEFjsJshC4IV4UDZlMHldd4KECqxzOWjewYtn8hiR5ZlxlxPuQuKJFVHKQuAdGrp8CprufXevUePqPKtY8iNHtmYunfvH0tea1bo2u8FGHphvgVtfUpq9xz8A6aWZEpyzpvB7feWpdlvmtheyoOlJQgYyn3/vUdB01vXJzbrEgCgxLLIpef1xKNw3sAVgLR/eLCz20sWmH9D9AsroV8KZQ+h3XsUMN98bfIUQSb+2Weff/6ZN33+2Rf/3E27H+rekkNiO24EmfTnXyxgH9MX/2w0XDIImt+6NikuVvjRF8sBAAifdzN2B5xJ317nrFhYSTdSjdFnKwEACF98PkrDfUyY/dRB4HVZYZDU6XKgV3oEh97d3goFsoLojPC+dvBU+dMMABZSUqlqiL4AbbvQhB0E7gO35/PV3JKfmYwAAAAjSURBVPXf3xYasfCkgRh0o7/4AtPnDsK/IrfKwMMGbmrQ+P8fqKtA+4EH0QAAAABJRU5ErkJggg==" alt="Image result for base64 image" style="background-color: unset; text-align: inherit; font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, sans-serif, -apple-system, BlinkMacSystemFont; outline: rgb(74, 144, 226) solid 2px;" class="e-resize e-img-focus" width="39" height="52">
    </div>`;
    keyBoardEvent.clipboardData = {
      getData: () => {
        return localElem;
      },
      items: []
    };
    rteObj.dataBind();
    (rteObj as any).inputElement.focus();
    setCursorPoint((rteObj as any).inputElement.firstElementChild, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      if (rteObj.pasteCleanupSettings.prompt) {
        let keepFormat: any = document.getElementById(rteObj.getID() + "_pasteCleanupDialog").getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
        keepFormat[0].click();
        let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
        pasteOK[0].click();
      }
      let allElem: any =(rteObj as any).inputElement.firstElementChild.querySelectorAll("*");
      expect(allElem[0].parentElement.querySelector('img').getAttribute('src').indexOf('blob:') === 0).toBe(true);
      expect(actionCompleteContent).toBe(true);
      expect(actionCompleteImg).toBe(true);
      done();
    }, 100);
  });
  afterAll(() => {
    destroy(rteObj);
  });
});

describe("To paste content inside table", () => {
  let rteObj: RichTextEditor;
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

  beforeAll((done: Function) => {
    rteObj = renderRTE({
      value: `<p><b>Description:</b></p><p>The Rich Text Editor (RTE) control is an easy to render in
      client side. Custom</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="firsttd" style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table><p>er easy to edit the contents and get the HTML content for
      the displayed content. A rich text editor control provides users with a toolbar
      that helps them to apply rich text formats to the text entered in the text
      area. </p>`,
      pasteCleanupSettings: {
        prompt: true
      }
    });
    done();
  });
  it("Paste content to RTE table", (done) => {
    let localElem: string = `<html>
    <body>
    <!--StartFragment--><p style="margin: 0px 0px 10px; color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, sans-serif, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial;">content to be pasted inside RTE table</p><p style="margin: 0px 0px 10px; color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, sans-serif, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial;"><span style="color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, sans-serif, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; white-space: normal; background-color: rgb(255, 255, 255); float: none; display: inline !important;">content to be pasted inside RTE table</span><span> </span><br></p><p style="margin: 0px 0px 10px; color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, sans-serif, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial;"><span style="color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, sans-serif, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; white-space: normal; background-color: rgb(255, 255, 255); float: none; display: inline !important;">content to be pasted inside RTE table</span> </p><!--EndFragment-->
    </body>
    </html>`;
    keyBoardEvent.clipboardData = {
      getData: () => {
        return localElem;
      },
      items: []
    };
    rteObj.pasteCleanupSettings.prompt = false;
    rteObj.pasteCleanupSettings.plainText = false;
    rteObj.pasteCleanupSettings.keepFormat = true;
    rteObj.dataBind();
    let selectNode = (rteObj as any).inputElement.querySelector('.firsttd');
    setCursorPoint(selectNode, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      let pastedElm: any = (rteObj as any).inputElement.querySelector('.firsttd').innerHTML;
      let expected: boolean = false;
      let expectedElem: string = `<p style="margin: 0px 0px 10px; color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, sans-serif, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; white-space: normal; background-color: rgb(255, 255, 255);">content to be pasted inside RTE table</p><p style="margin: 0px 0px 10px; color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, sans-serif, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; white-space: normal; background-color: rgb(255, 255, 255);"><span style="color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, sans-serif, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; white-space: normal; background-color: rgb(255, 255, 255); float: none; display: inline !important;">content to be pasted inside RTE table</span><span>&nbsp;</span><br></p><p style="margin: 0px 0px 10px; color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, sans-serif, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; white-space: normal; background-color: rgb(255, 255, 255);"><span style="color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, sans-serif, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; white-space: normal; background-color: rgb(255, 255, 255); float: none; display: inline !important;">content to be pasted inside RTE table</span>&nbsp;</p><br>`;
      if (pastedElm === expectedElem) {
        expected = true;
      }
      expect(expected).toBe(true);
      done();
    }, 100);
  });


  it("Paste content inside the RTE table", (done) => {
    rteObj.value = `<p><b>Description:</b></p><p>The Rich Text Editor (RTE) control is an easy to render in
    client side. Custom</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="firsttd" style="width: 50%;"><br></td><td style="width: 50%;"><br><br><br><span>spane2</span></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table><p>er easy to edit the contents and get the HTML content for
    the displayed content. A rich text editor control provides users with a toolbar
    that helps them to apply rich text formats to the text entered in the text
    area. </p>`;
    let localElem: string = `<html>
    <body>
    <!--StartFragment--><p style="margin: 0px 0px 10px; color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, sans-serif, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial;">content to be pasted inside RTE table</p><p style="margin: 0px 0px 10px; color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, sans-serif, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial;"><span style="color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, sans-serif, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; white-space: normal; background-color: rgb(255, 255, 255); float: none; display: inline !important;">content to be pasted inside RTE table</span><span> </span><br></p><p style="margin: 0px 0px 10px; color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, sans-serif, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial;"><span style="color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, sans-serif, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; white-space: normal; background-color: rgb(255, 255, 255); float: none; display: inline !important;">content to be pasted inside RTE table</span> </p><!--EndFragment-->
    </body>
    </html>`;
    keyBoardEvent.clipboardData = {
      getData: () => {
        return localElem;
      },
      items: []
    };
    rteObj.pasteCleanupSettings.prompt = false;
    rteObj.pasteCleanupSettings.plainText = false;
    rteObj.pasteCleanupSettings.keepFormat = true;
    rteObj.dataBind();
    let selectNode = (rteObj as any).inputElement.querySelector('.firsttd');
    setCursorPoint(selectNode, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      let pastedElm: any = (rteObj as any).inputElement.querySelector('.firsttd').innerHTML;
      let expected: boolean = false;
      let expectedElem: string = `<p style="margin: 0px 0px 10px; color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, sans-serif, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; white-space: normal; background-color: rgb(255, 255, 255);">content to be pasted inside RTE table</p><p style="margin: 0px 0px 10px; color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, sans-serif, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; white-space: normal; background-color: rgb(255, 255, 255);"><span style="color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, sans-serif, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; white-space: normal; background-color: rgb(255, 255, 255); float: none; display: inline !important;">content to be pasted inside RTE table</span><span>&nbsp;</span><br></p><p style="margin: 0px 0px 10px; color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, sans-serif, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; white-space: normal; background-color: rgb(255, 255, 255);"><span style="color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, sans-serif, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; white-space: normal; background-color: rgb(255, 255, 255); float: none; display: inline !important;">content to be pasted inside RTE table</span>&nbsp;</p><br>`;
      if (pastedElm === expectedElem) {
        expected = true;
      }
      expect(expected).toBe(true);
      done();
    }, 100);
  });
  afterAll(() => {
    destroy(rteObj);
  });
});

describe("Image paste", () => {
    let rteObj: RichTextEditor;
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

    beforeAll((done: Function) => {
        rteObj = renderRTE({
            insertImageSettings: {
                saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
                path: '/api/uploadbox/Save'
            }
        });
        done();
    });

    it(" 'Ctrl+v' image testing", (done) => {
        keyBoardEvent.clipboardData = {
            getData: () => { return `<html> <body> <!--StartFragment--><p>content<br/> <img class='pasteContent_Img' src='' /></p><!--EndFragment--> </body></html>` },
            types: ['text/html', 'Files'],
            files: { 0: { lastModified: 1594563447084, name: "image.png", size: 66216, type: "image/png", webkitRelativePath: "", lastModifiedDate: new Date() } },
            items: { 0: { kind: 'string', type: 'text/html' }, 1: { kind: 'file', type: 'image/png' }, }
        };
        setCursorPoint((rteObj as any).inputElement.firstElementChild, 0);
        rteObj.onPaste(keyBoardEvent);
        setTimeout(() => {
            let imgEle: any = (rteObj as any).inputElement.firstElementChild.querySelectorAll("img");
            expect(isNullOrUndefined(imgEle)).toBe(false);
            done();
        }, 50);
    });

    afterAll(() => {
        destroy(rteObj);
    });
});
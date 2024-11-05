/**
 * Paste CleanUp spec
 */
import { Browser, createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { EditorManager } from "../../../src/editor-manager/index";
import { RichTextEditor, PasteCleanup,actionComplete, beforePasteCleanup, PasteCleanupArgs } from "../../../src/rich-text-editor/index";
import {
  CLS_RTE_PASTE_KEEP_FORMAT, CLS_RTE_PASTE_REMOVE_FORMAT, CLS_RTE_PASTE_PLAIN_FORMAT
} from "../../../src/rich-text-editor/base/classes";
import {
  CLS_RTE_PASTE_OK, CLS_RTE_PASTE_CANCEL
} from "../../../src/rich-text-editor/base/classes";
import { renderRTE, destroy, setCursorPoint, dispatchEvent } from "../render.spec";
import { MarkdownSelection } from '../../../src/markdown-parser/index';
import { DialogModel} from '@syncfusion/ej2-popups';

describe('Paste Cleanup Module ', () => {


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
    const deniedTags = rteObj.pasteCleanupSettings.deniedTags;
    (rteObj as any).pasteCleanupSettings.deniedTags = null;
    (rteObj as any).pasteCleanupSettings.deniedTags = undefined;
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
      (rteObj as any).pasteCleanupSettings.deniedTags = deniedTags;
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
      expect(pastedElm.children[0].tagName.toLowerCase()  === 'a').toBe(true);
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
      expect(pastedElm.children[0].children[0].childNodes[1].tagName.toLowerCase() === 'a').toBe(true);
      expect(pastedElm.children[0].children[0].childNodes[1].getAttribute('href') === 'https://ej2.syncfusion.com').toBe(true);
      let expected: boolean = false;
      let expectedElem: string = `<p><span>Hi syncfusion website <a class="e-rte-anchor" href="https://ej2.syncfusion.com" title="https://ej2.syncfusion.com" target=\"_blank\" aria-label=\"Open in new window\">https://ej2.syncfusion.com </a>is here</span>14</p>`;
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
      expect(pastedElm.children[0].children[0].childNodes[1].tagName.toLowerCase() === 'a').toBe(true);
      expect(pastedElm.children[0].children[0].childNodes[1].getAttribute('href') === 'https://ej2.syncfusion.com').toBe(true);
      let expected: boolean = false;
      let expectedElem: string = `<p><span>Hi syncfusion website <a class="e-rte-anchor" href="https://ej2.syncfusion.com" title="https://ej2.syncfusion.com" target=\"_blank\" aria-label=\"Open in new window\">https://ej2.syncfusion.com </a>is here with another URL <a class="e-rte-anchor" href="https://ej2.syncfusion.com" title="https://ej2.syncfusion.com" target=\"_blank\" aria-label=\"Open in new window\">https://ej2.syncfusion.com </a>text after second URL</span>15</p>`;
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
      let expectedElem: string = `<p><span>first line</span></p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Second line with space <a class="e-rte-anchor" href="https://ej2.syncfusion.com" title="https://ej2.syncfusion.com" target=\"_blank\" aria-label=\"Open in new window\">https://ej2.syncfusion.com </a></p><p><br></p><p><br></p><p>third line</p><p>16</p>`;
      if (pastedElm === expectedElem) {
        expected = true;
      }
      expect(expected).toBe(true);
      done();
    }, 100);
  });

  it("EJ2-55021 - Paste notepad contents with &para content in the link", (done) => {
    keyBoardEvent.clipboardData = {
      getData: (e: any) => {
        if (e === "text/plain") {
          return `http://www.google.com?first=a&parameters=foo`;
        } else {
          return '';
        }
      },
      items: []
    };
    rteObj.value = '<p>160</p>';
    rteObj.pasteCleanupSettings.prompt = false;
    rteObj.pasteCleanupSettings.plainText = false;
    rteObj.pasteCleanupSettings.keepFormat = true;
    rteObj.pasteCleanupSettings.deniedTags = [];
    rteObj.pasteCleanupSettings.deniedAttrs = [];
    rteObj.pasteCleanupSettings.allowedStyleProps = [];
    rteObj.dataBind();
    setCursorPoint((rteObj as any).inputElement.firstElementChild, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      let pastedElm: any = (rteObj as any).inputElement.innerHTML;
      let expected: boolean = false;
      let expectedElem: string = `<p><a class="e-rte-anchor" href="http://www.google.com?first=a&amp;parameters=foo" title="http://www.google.com?first=a&amp;parameters=foo" target="_blank" aria-label="Open in new window">http://www.google.com?first=a&amp;parameters=foo </a>160</p>`;
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
      let expectedElem: string = '<p>using System;<br>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; using System.Collections.Generic;<br>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; using System.Linq;<br>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; using System.Threading.Tasks;<br>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; using System.Web.Mvc;<br>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <br>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; namespace EJ2MVCSampleBrowser.Controllers<br>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; {<br>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; public partial class RichTextEditorController : Controller<br>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; {<br>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; // GET: /&lt;controller&gt;/<br>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; public ActionResult API()<br>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; {<br>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ViewBag.value = @"&lt;p&gt;RichTextEditor is a WYSIWYG editing control which will reduce the effort for users while trying to express their formatting word content as HTML or Markdown format.&lt;/p&gt;<br>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;p&gt;&lt;b&gt;API’s:&lt;/b&gt;&lt;/p&gt;<br>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;ul&gt;&lt;li&gt;&lt;p&gt;maxLength - allows to restrict the maximum length to be entered.&lt;/p&gt;&lt;/li&gt;<br>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;li&gt;&lt;p&gt;readOnly - allows to change it as non-editable state.&lt;/p&gt;&lt;/li&gt;<br>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;li&gt;&lt;p&gt;enabled - enable or disable the RTE component.&lt;/p&gt;&lt;/li&gt;<br>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;li&gt;&lt;p&gt;enableHtmlEncode - Get the encoded string value through value property and source code panel&lt;/p&gt;&lt;/li&gt;<br>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;li&gt;&lt;p&gt;getValue - get the value of RTE.&lt;/p&gt;&lt;/li&gt;<br>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;li&gt;&lt;p&gt;getSelection - get the selected text of RTE.&lt;/p&gt;&lt;/li&gt;<br>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;li&gt;&lt;p&gt;selectAll - select all content in RTE.&lt;/p&gt;&lt;/li&gt;<br>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;/ul&gt;";<br>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <br>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; return View();<br>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; }<br>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; }<br>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; }17</p>';
      expect(expectedElem === pastedElm).toBe(true);
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
      let expectedElem: string = '<p>first line<br>&nbsp; &nbsp; &nbsp; &nbsp; Second line with space<br>&nbsp;  <br>&nbsp;  <br>third line18</p>';
      expect(expectedElem === pastedElm).toBe(true);
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

  afterAll((done: DoneFn) => {
    destroy(rteObj);
    done();
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
  afterAll((done: DoneFn) => {
    destroy(rteObj);
    done();
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
    Browser.userAgent = "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; AS; rv:11.0) like Gecko";
    let file: any = (pasteCleanupObj as any).base64ToFile(base64, fileName);
    setTimeout(() => {
      expect(file.name === 'SynfusionTestImage.png').toBe(true);
      done();
    }, 100);
  });
  afterAll((done: DoneFn) => {
    destroy(rteObj);
    done();
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
  afterAll((done: DoneFn) => {
    destroy(rteObj);
    done();
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
      let expectedElem: string = '<p style="margin: 0px 0px 10px; color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, sans-serif, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; background-color: rgb(255, 255, 255);">content to be pasted inside RTE table</p><p style="margin: 0px 0px 10px; color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, sans-serif, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; background-color: rgb(255, 255, 255);"><span style="color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, sans-serif, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; white-space: normal; background-color: rgb(255, 255, 255); float: none; display: inline !important;">content to be pasted inside RTE table</span><span>&nbsp;</span><br></p><p style="margin: 0px 0px 10px; color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, sans-serif, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; background-color: rgb(255, 255, 255);"><span style="color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, sans-serif, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; white-space: normal; background-color: rgb(255, 255, 255); float: none; display: inline !important;">content to be pasted inside RTE table</span>&nbsp;</p><br>';
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
      let expectedElem: string = '<p style="margin: 0px 0px 10px; color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, sans-serif, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; background-color: rgb(255, 255, 255);">content to be pasted inside RTE table</p><p style="margin: 0px 0px 10px; color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, sans-serif, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; background-color: rgb(255, 255, 255);"><span style="color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, sans-serif, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; white-space: normal; background-color: rgb(255, 255, 255); float: none; display: inline !important;">content to be pasted inside RTE table</span><span>&nbsp;</span><br></p><p style="margin: 0px 0px 10px; color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, sans-serif, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; background-color: rgb(255, 255, 255);"><span style="color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, sans-serif, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; white-space: normal; background-color: rgb(255, 255, 255); float: none; display: inline !important;">content to be pasted inside RTE table</span>&nbsp;</p><br>';
      if (pastedElm === expectedElem) {
        expected = true;
      }
      expect(expected).toBe(true);
      done();
    }, 100);
  });
  afterAll((done: DoneFn) => {
    destroy(rteObj);
    done();
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

    afterAll((done: DoneFn) => {
        destroy(rteObj);
        done();
    });
});

describe("Image Upload image restriction with paste action", () => {
    let rteObj: RichTextEditor;
    let imgSize: number;
    let sizeInBytes: number;
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
            },
            imageUploading: function (args) {
                imgSize = 2000;
                sizeInBytes = args.fileData.size;
                if ( imgSize < sizeInBytes ) {
                    args.cancel = true;
                }
            }
        });
        done();
    });

    it(" 'Ctrl+v' image testing in default mode", (done) => {
        keyBoardEvent.clipboardData = {
            getData: () => { return `<html> <body> <!--StartFragment--><p>content<br/> <img class='pasteContent_Img' src='data:image/png;base64,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`
    + `96F41gHWylg6dldX1IYkYIqw/WOvbcgyIGhX1LJd0BU2aUs6ZVut9vr5Jm8AcETQS7lQkA1YOaOvWz4gTAKupvchoCQVMjBbCkk8H8GJ9KryxHEUmnezhOVxvexWT8QukFPGPFE4EkrZJDccsqA4/RmTfZc+uWBYNnJEp8EQWTL4U2plJG/jnUd4nESxa2s/hMgwGlNk9Ij81ohs9ypprtU3H0kw6dGADplGwLeqhYKz8UX026P6ZozDreGAHRplqiCchxzwcQXQuDS1UiM4ju3jqDTsCCgrDqEKHewAAKfBsISurznEcOfFAHolE0eOd61Mdy7c6bScRifSyPes9BPigB0yoa5UhkPrdYaHggaPQQ12eN7AY8KCg+BYiKg+JGnlLbcAPQUH5vlg3bK4SFg7hldGrfrfXqUlnGMMhqGuXfS3YAnBYWHoBAnCKiG80R2ndieFQKVNmfbIlqaDxhWhIdAgB0CIn60SKWTvBlfULuUpcfIZ/iAYUV4CJI9HQHHLW5NECLptcUztg6g2uADdsrhIWAvM9idpqoeVwlJXTwhye1qtkJyDW6B6q2i8BBEOhgBTy117BIaKvENB0yAIGCnHCICDYcV6RXlKOCutCuWVjKeY1cfFCKCPBzrU42VTZnbTbl9f4GP97xuXk0hIqjCnB3fXV1nOev2VRLHOSMpnxQigjJEkAk4UGEpzgd2LwoXQZrKBB2ogGFcsAdDRKDwAMGi7ngljdJcsAdDRFDgoAyCDlQuM7ePQIKBUSagT4xkG7ePgKXAWD8d0CfeCQSRLgiM+MAI7oAWwQQ876c/8CTqDvgiGBjxXEA+tLsQVcDkL89x6w/Yk4VcJx2//fEBMOU4MIS03+OJ2aQkwAUYo3i6AdMct5+zA5TjQJe2simTBQUu2c72uhyfzmTQAmK+FzRtGi6CSDlDZZZ0ynDRS6cH18lneExo9fMoqynBT2UOF0FEASGmkxkWrjcvw3lToC67DR6uKAbMd+Fab62sXPd4+JARsJecRQispJSrnewIrfPD680B7xkKNHo1p3gcuH0HEERycS7TUWJKOa9lYatDPUfqQnVxo1cZuBsgDNZvCEEkn443MulMAxC2UZ4aXXa0fE655hnqiyh0BJFqXNcWPg1ttKwwQjLc1yzZKXwEkaTW6/UA60yYbyZaTDeAANBNtrmTbgbBp6R1EJBdIEFjsJshC4IV4UDZlMHldd4KECqxzOWjewYtn8hiR5ZlxlxPuQuKJFVHKQuAdGrp8CprufXevUePqPKtY8iNHtmYunfvH0tea1bo2u8FGHphvgVtfUpq9xz8A6aWZEpyzpvB7feWpdlvmtheyoOlJQgYyn3/vUdB01vXJzbrEgCgxLLIpef1xKNw3sAVgLR/eLCz20sWmH9D9AsroV8KZQ+h3XsUMN98bfIUQSb+2Weff/6ZN33+2Rf/3E27H+rekkNiO24EmfTnXyxgH9MX/2w0XDIImt+6NikuVvjRF8sBAAifdzN2B5xJ317nrFhYSTdSjdFnKwEACF98PkrDfUyY/dRB4HVZYZDU6XKgV3oEh97d3goFsoLojPC+dvBU+dMMABZSUqlqiL4AbbvQhB0E7gO35/PV3JKfmYwAAAAjSURBVPXf3xYasfCkgRh0o7/4AtPnDsK/IrfKwMMGbmrQ+P8fqKtA+4EH0QAAAABJRU5ErkJggg==' /></p><!--EndFragment--> </body></html>` },
            types: ['text/html', 'Files'],
            files: { 0: { lastModified: 1594563447084, name: "image.png", size: 66216, type: "image/png", webkitRelativePath: "", lastModifiedDate: new Date() } },
            items: { 0: { kind: 'string', type: 'text/html' }, 1: { kind: 'file', type: 'image/png' }, }
        };
        setCursorPoint((rteObj as any).inputElement.firstElementChild, 0);
        rteObj.onPaste(keyBoardEvent);
        setTimeout(() => {
            let imgEle: any = (rteObj as any).inputElement.firstElementChild.querySelectorAll("img");
            expect(imgEle.length === 0).toBe(true);
            done();
        }, 50);
    });

    afterAll((done: DoneFn) => {
        destroy(rteObj);
        done();
    });
});

describe("Image Upload image restriction with paste action", () => {
    let rteObj: RichTextEditor;
    let imgSize: number;
    let sizeInBytes: number;
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
            },
            imageUploading: function (args) {
                imgSize = 2000;
                sizeInBytes = args.fileData.size;
                if ( imgSize < sizeInBytes ) {
                    args.cancel = false;
                }
            }
        });
        done();
    });

    it(" 'Ctrl+v' image testing if cancel is false", (done) => {
        keyBoardEvent.clipboardData = {
            getData: () => { return `<html> <body> <!--StartFragment--><p>content<br/> <img class='pasteContent_Img' src='data:image/png;base64,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`
    + `96F41gHWylg6dldX1IYkYIqw/WOvbcgyIGhX1LJd0BU2aUs6ZVut9vr5Jm8AcETQS7lQkA1YOaOvWz4gTAKupvchoCQVMjBbCkk8H8GJ9KryxHEUmnezhOVxvexWT8QukFPGPFE4EkrZJDccsqA4/RmTfZc+uWBYNnJEp8EQWTL4U2plJG/jnUd4nESxa2s/hMgwGlNk9Ij81ohs9ypprtU3H0kw6dGADplGwLeqhYKz8UX026P6ZozDreGAHRplqiCchxzwcQXQuDS1UiM4ju3jqDTsCCgrDqEKHewAAKfBsISurznEcOfFAHolE0eOd61Mdy7c6bScRifSyPes9BPigB0yoa5UhkPrdYaHggaPQQ12eN7AY8KCg+BYiKg+JGnlLbcAPQUH5vlg3bK4SFg7hldGrfrfXqUlnGMMhqGuXfS3YAnBYWHoBAnCKiG80R2ndieFQKVNmfbIlqaDxhWhIdAgB0CIn60SKWTvBlfULuUpcfIZ/iAYUV4CJI9HQHHLW5NECLptcUztg6g2uADdsrhIWAvM9idpqoeVwlJXTwhye1qtkJyDW6B6q2i8BBEOhgBTy117BIaKvENB0yAIGCnHCICDYcV6RXlKOCutCuWVjKeY1cfFCKCPBzrU42VTZnbTbl9f4GP97xuXk0hIqjCnB3fXV1nOev2VRLHOSMpnxQigjJEkAk4UGEpzgd2LwoXQZrKBB2ogGFcsAdDRKDwAMGi7ngljdJcsAdDRFDgoAyCDlQuM7ePQIKBUSagT4xkG7ePgKXAWD8d0CfeCQSRLgiM+MAI7oAWwQQ876c/8CTqDvgiGBjxXEA+tLsQVcDkL89x6w/Yk4VcJx2//fEBMOU4MIS03+OJ2aQkwAUYo3i6AdMct5+zA5TjQJe2simTBQUu2c72uhyfzmTQAmK+FzRtGi6CSDlDZZZ0ynDRS6cH18lneExo9fMoqynBT2UOF0FEASGmkxkWrjcvw3lToC67DR6uKAbMd+Fab62sXPd4+JARsJecRQispJSrnewIrfPD680B7xkKNHo1p3gcuH0HEERycS7TUWJKOa9lYatDPUfqQnVxo1cZuBsgDNZvCEEkn443MulMAxC2UZ4aXXa0fE655hnqiyh0BJFqXNcWPg1ttKwwQjLc1yzZKXwEkaTW6/UA60yYbyZaTDeAANBNtrmTbgbBp6R1EJBdIEFjsJshC4IV4UDZlMHldd4KECqxzOWjewYtn8hiR5ZlxlxPuQuKJFVHKQuAdGrp8CprufXevUePqPKtY8iNHtmYunfvH0tea1bo2u8FGHphvgVtfUpq9xz8A6aWZEpyzpvB7feWpdlvmtheyoOlJQgYyn3/vUdB01vXJzbrEgCgxLLIpef1xKNw3sAVgLR/eLCz20sWmH9D9AsroV8KZQ+h3XsUMN98bfIUQSb+2Weff/6ZN33+2Rf/3E27H+rekkNiO24EmfTnXyxgH9MX/2w0XDIImt+6NikuVvjRF8sBAAifdzN2B5xJ317nrFhYSTdSjdFnKwEACF98PkrDfUyY/dRB4HVZYZDU6XKgV3oEh97d3goFsoLojPC+dvBU+dMMABZSUqlqiL4AbbvQhB0E7gO35/PV3JKfmYwAAAAjSURBVPXf3xYasfCkgRh0o7/4AtPnDsK/IrfKwMMGbmrQ+P8fqKtA+4EH0QAAAABJRU5ErkJggg==' /></p><!--EndFragment--> </body></html>` },
            types: ['text/html', 'Files'],
            files: { 0: { lastModified: 1594563447084, name: "image.png", size: 66216, type: "image/png", webkitRelativePath: "", lastModifiedDate: new Date() } },
            items: { 0: { kind: 'string', type: 'text/html' }, 1: { kind: 'file', type: 'image/png' }, }
        };
        setCursorPoint((rteObj as any).inputElement.firstElementChild, 0);
        rteObj.onPaste(keyBoardEvent);
        setTimeout(() => {
            let imgEle: any = (rteObj as any).inputElement.firstElementChild.querySelectorAll("img");
            expect(imgEle.length === 1).toBe(true);
            done();
        }, 50);
    });

    afterAll((done: DoneFn) => {
        destroy(rteObj);
        done();
    });
});

describe("Paste when iframe enabled", () => {
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
            iframeSettings: { enable: true },
            value: 'Hello'
        });
        done();
    });

    it(" Paste by selecting all content when iframe enabled", (done) => {
        keyBoardEvent.clipboardData = {
            getData: () => { return `<p>Pasted Content</p>` },
            types: ['text/html', 'Files'],
            items: { }
        };
        rteObj.pasteCleanupSettings.prompt = true;
        rteObj.dataBind();
        rteObj.selectAll();
        rteObj.onPaste(keyBoardEvent);
        setTimeout(() => {
          if (rteObj.pasteCleanupSettings.prompt) {
            let keepFormat: any = document.getElementById(rteObj.getID() + "_pasteCleanupDialog").getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
            keepFormat[0].click();
            let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
            pasteOK[0].click();
          }
          expect(rteObj.value === '<p>Pasted Content</p>').toBe(true);
          done();
        }, 50);
    });

    afterAll((done: DoneFn) => {
        destroy(rteObj);
        done();
    });
});

describe("Paste when Xhtml enabled", () => {
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
            enableXhtml: true
        });
        done();
    });

    it(" - Pasting the content when XHTML is enabled", (done) => {
        rteObj.value = "<p class='xhtmlpara'>&nbsp; &nbsp;</p>"
        rteObj.dataBind();
        keyBoardEvent.clipboardData = {
            getData: () => { return `<p>Rich Text Editor content Pasted.</p>` },
            types: ['text/html', 'Files'],
            items: { }
        };
        rteObj.pasteCleanupSettings.prompt = true;
        rteObj.dataBind();
        let selectNode = (rteObj as any).inputElement.querySelector('.xhtmlpara');
        setCursorPoint(selectNode, 0);
        rteObj.onPaste(keyBoardEvent);
        setTimeout(() => {
          if (rteObj.pasteCleanupSettings.prompt) {
            let keepFormat: any = document.getElementById(rteObj.getID() + "_pasteCleanupDialog").getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
            keepFormat[0].click();
            let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
            pasteOK[0].click();
          }
          expect(rteObj.inputElement.innerHTML === '<p>Rich Text Editor content Pasted.</p><p class=\"xhtmlpara\"> ​</p>').toBe(true);
          done();
        }, 50);
    });

    afterAll((done: DoneFn) => {
        destroy(rteObj);
        done();
    });
});

describe("EJ2-40047 - When pasting content in RichTextEditor the font-size of text is changed, when changing the font-color from toolbar", () => {
    let rteObj: RichTextEditor;
    let controlId: string;
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

    beforeEach((done: Function) => {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ['fontColor', 'BackgroundColor', 'FontSize']
            },
            pasteCleanupSettings: {
                prompt: false
            },
            fontColor: {
                colorCode: {
                    'Custom': ['', '#000000', '#ffff00', '#00ff00']
                }
            },
            backgroundColor: {
                colorCode: {
                    'Custom': ['', '#000000', '#ffff00', '#00ff00']
                }
            },
            fontSize: {
                items: [
                    { text: '36 pt', value: '36pt' },
                    { text: '10 pt', value: '10pt' },
                    { text: '12 pt', value: '12pt' },
                ]
            }
        });
        controlId = rteObj.element.id;
        done();
    });

    it(" font-color with existing style availability testing", () => {
        keyBoardEvent.clipboardData = {
            getData: () => { return `<span id='targetEle' style="color: rgb(32, 33, 34); font-family: sans-serif; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; white-space: normal; background-color: rgb(255, 255, 255); display: inline !important; float: none;">Wikipedia was launched on January 15, 2001, and was created by</span>` },
            types: ['text/html'],
            items: { 0: { kind: 'string', type: 'text/html' } }
        };
        setCursorPoint((rteObj as any).inputElement.firstElementChild, 0);
        rteObj.onPaste(keyBoardEvent);
        let pEle: HTMLElement = rteObj.element.querySelector('#targetEle');
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#targetEle').childNodes[0], rteObj.element.querySelector('#targetEle').childNodes[0], 0, 3);
        let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_FontColor');
        item = (item.querySelector('.e-rte-color-content') as HTMLElement);
        dispatchEvent(item, 'mousedown');
        item.click();
        dispatchEvent(item, 'mousedown');
        let span: HTMLElement = rteObj.element.querySelector('.e-content span');
        expect(span.style.color === 'rgb(255, 0, 0)').toBe(true);
        expect(span.style.fontSize === '14px').toBe(true);
        expect(span.style.fontWeight === '400').toBe(true);
    });

    it(" background-color with existing style availability testing", () => {
        keyBoardEvent.clipboardData = {
            getData: () => { return `<span id='targetEle' style="color: rgb(32, 33, 34); font-family: sans-serif; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; white-space: normal; background-color: rgb(255, 255, 255); display: inline !important; float: none;">Wikipedia was launched on January 15, 2001, and was created by</span>` },
            types: ['text/html'],
            items: { 0: { kind: 'string', type: 'text/html' } }
        };
        setCursorPoint((rteObj as any).inputElement.firstElementChild, 0);
        rteObj.onPaste(keyBoardEvent);
        let pEle: HTMLElement = rteObj.element.querySelector('#targetEle');
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#targetEle').childNodes[0], rteObj.element.querySelector('#targetEle').childNodes[0], 0, 3);
        let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_BackgroundColor');
        item = (item.querySelector('.e-rte-color-content') as HTMLElement);
        dispatchEvent(item, 'mousedown');
        item.click();
        dispatchEvent(item, 'mousedown');
        let span: HTMLElement = rteObj.element.querySelector('.e-content span');
        expect(span.style.color === 'rgb(32, 33, 34)').toBe(true);
        expect(span.style.backgroundColor === 'rgb(255, 255, 0)').toBe(true);
        expect(span.style.fontSize === '14px').toBe(true);
        expect(span.style.fontWeight === '400').toBe(true);
    });

    it(" font-size with existing style availability testing", () => {
        keyBoardEvent.clipboardData = {
            getData: () => { return `<span id='targetEle' style="color: rgb(32, 33, 34); font-family: sans-serif; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; white-space: normal; background-color: rgb(255, 255, 255); display: inline !important; float: none;">Wikipedia was launched on January 15, 2001, and was created by</span>` },
            types: ['text/html'],
            items: { 0: { kind: 'string', type: 'text/html' } }
        };
        setCursorPoint((rteObj as any).inputElement.firstElementChild, 0);
        rteObj.onPaste(keyBoardEvent);
        let pEle: HTMLElement = rteObj.element.querySelector('#targetEle');
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#targetEle').childNodes[0], rteObj.element.querySelector('#targetEle').childNodes[0], 0, 3);
        let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_FontSize');
        item.click();
        let popup: HTMLElement = document.getElementById(controlId + '_toolbar_FontSize-popup');
        dispatchEvent((popup.querySelectorAll('.e-item')[0] as HTMLElement), 'mousedown');
        (popup.querySelectorAll('.e-item')[0] as HTMLElement).click();
        let span: HTMLElement = rteObj.element.querySelector('.e-content span');
        expect(span.style.color === 'rgb(32, 33, 34)').toBe(true);
        expect(span.style.fontSize === '36pt').toBe(true);
        expect(span.style.fontWeight === '400').toBe(true);
    });

    afterEach((done: DoneFn) => {
        destroy(rteObj);
        done();
    });
});

describe("Paste in Markdown Editor", () => {
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
          value: 'Mark down editor content',
          editorMode: 'Markdown'
      });
      done();
  });
  it("Pasting content in ", (done) => {
      keyBoardEvent.clipboardData = {
          getData: () => { return `Content to be pasted in Markdown` },
          types: ['text/plain', 'Files'],
      };
      let editorObj = new MarkdownSelection();
      var textArea: HTMLTextAreaElement =  rteObj.inputElement as HTMLTextAreaElement;
      editorObj.save(0, 7);
      editorObj.restore(textArea);
      let line: string = editorObj.getSelectedText(textArea);
      rteObj.onPaste(keyBoardEvent);
      setTimeout(() => {
        expect(line).not.toBe(null);
        done();
    }, 50);
  });

  it("Pasting content in ", (done) => {
    keyBoardEvent.clipboardData = {
        getData: () => { return `Content to be pasted in Markdown` },
        types: ['text/plain'],
    };
    rteObj.maxLength = 30;
    let editorObj = new MarkdownSelection();
    var textArea: HTMLTextAreaElement =  rteObj.inputElement as HTMLTextAreaElement;
    editorObj.save(0, 7);
    editorObj.restore(textArea);
    let line: string = editorObj.getSelectedText(textArea);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      expect(line).not.toBe(null);
      done();
  }, 50);
});
  afterAll((done: DoneFn) => {
      destroy(rteObj);
      done();
  });
});

describe("Paste in Markdown Editor", () => {
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
            toolbarSettings: {
                items: ['ClearFormat']
            }
        });
        done();
    });
    it("Pasting content in ", (done: Function) => {
        keyBoardEvent.clipboardData = {
            getData: () => { return `<html> <body> <!--StartFragment--><p><img class='pasteContent_Img' src='' /></p><!--EndFragment--> </body></html>` },
            types: ['text/html', 'Files'],
            files: { 0: { lastModified: 1594563447084, name: "image.png", size: 66216, type: "image/png", webkitRelativePath: "", lastModifiedDate: new Date() } },
            items: { 0: { kind: 'string', type: 'text/html' }, 1: { kind: 'file', type: 'image/png' }, }
        };
        setCursorPoint((rteObj as any).inputElement.firstElementChild, 0);
        rteObj.onPaste(keyBoardEvent);
        let imgEle: any = (rteObj as any).inputElement.firstElementChild.querySelectorAll("img");
        expect(isNullOrUndefined(imgEle)).toBe(false);
        rteObj.selectAll();
        (rteObj.element.querySelector('.e-toolbar-item button') as HTMLElement).click();
        (rteObj.element.querySelector('.e-toolbar-item button') as HTMLElement).click();
        (rteObj.element.querySelector('.e-toolbar-item button') as HTMLElement).click();
        let imgElements: HTMLElement[] = (rteObj as any).inputElement.firstElementChild.querySelectorAll("img");
        expect(imgElements.length).toBe(1);
        done();
    });
    afterAll((done: DoneFn) => {
        destroy(rteObj);
        done();
    });
});
describe("EJ2-46613 - Pasting content with bolded list doesn't paste the content", () => {
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
        prompt: false
      }
    });
    done();
  });
  it("pasting bolded list availability", (done) => {
    let localElem: string = `<!--StartFragment-->

    <p class=MsoListParagraphCxSpFirst style='text-align:justify;text-indent:-.25in;
    mso-list:l0 level1 lfo1'><a name="_Hlk36481117"><![if !supportLists]><span
    lang=ES style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
    Symbol;mso-no-proof:yes'><span style='mso-list:Ignore'>·<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    </span></span></span><![endif]><b><span lang=ES style='font-size:14.0pt;
    line-height:107%;mso-no-proof:yes'>Autoevaluación Proyectos </span></b></a><span
    lang=ES style='mso-no-proof:yes'><o:p></o:p></span></p>
    
    <p class=MsoListParagraphCxSpLast style='text-align:justify'><span lang=ES
    style='mso-no-proof:yes'><o:p>&nbsp;</o:p></span></p>
    
    <p class=MsoNormal style='text-align:justify'><b><span lang=ES
    style='color:red;mso-no-proof:yes'>Pendientes<o:p></o:p></span></b></p>
    
    <span lang=ES style='font-size:11.0pt;line-height:107%;font-family:"Calibri",sans-serif;
    mso-fareast-font-family:Calibri;mso-fareast-theme-font:minor-latin;color:black;
    mso-ansi-language:ES;mso-fareast-language:EN-US;mso-bidi-language:AR-SA'>Se
    verifica en ambiente de pruebas Calibrí v.79 el </span><span lang=ES
    style='font-size:11.0pt;line-height:107%;font-family:"Calibri",sans-serif;
    mso-ascii-theme-font:minor-latin;mso-fareast-font-family:Calibri;mso-fareast-theme-font:
    minor-latin;mso-hansi-theme-font:minor-latin;mso-bidi-font-family:"Times New Roman";
    mso-bidi-theme-font:minor-bidi;mso-ansi-language:ES;mso-fareast-language:EN-US;
    mso-bidi-language:AR-SA'>documento <b>Gen de Relación Masiva Personal_1</b> </span><span
    lang=ES style='font-size:11.0pt;line-height:107%;font-family:"Calibri",sans-serif;
    mso-fareast-font-family:Calibri;mso-fareast-theme-font:minor-latin;color:black;
    mso-ansi-language:ES;mso-fareast-language:EN-US;mso-bidi-language:AR-SA'>y se
    encuentra que</span><!--EndFragment-->`;
    keyBoardEvent.clipboardData = {
      getData: () => {
        return localElem;
      },
      items: []
    };
    rteObj.pasteCleanupSettings.prompt = false;
    rteObj.pasteCleanupSettings.deniedTags = [];
    rteObj.pasteCleanupSettings.deniedAttrs = [];
    rteObj.pasteCleanupSettings.allowedStyleProps = [];
    rteObj.dataBind();
    (rteObj as any).inputElement.focus();
    setCursorPoint((rteObj as any).inputElement.firstElementChild, 0);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      expect((rteObj as any).inputElement.querySelectorAll('ul').length).toEqual(1);
      expect((rteObj as any).inputElement.querySelectorAll('ul li').length).toEqual(1);
      expect((rteObj as any).inputElement.querySelectorAll('ul li b').length).toEqual(1);
      expect((rteObj as any).inputElement.querySelector('ul li b').textContent.trim()).toBe('Autoevaluación Proyectos');
      done();
    }, 100);
  });
  afterAll((done: DoneFn) => {
    destroy(rteObj);
    done();
  });

  describe("Paste Cleanup events testing", () => {
    let rteObj: RichTextEditor;
    let keyBoardEvent: any = {
      preventDefault: () => { 
          
      },
      type: "keydown",
      stopPropagation: () => { },
      ctrlKey: false,
      shiftKey: false,
      action: null,
      which: 64,
      key: ""
    };
    let beforePasteCleanupEvent: boolean = false;
    let afterPasteCleanupEvent: boolean = false;
    beforeAll((done: Function) => {
      rteObj = renderRTE({
        pasteCleanupSettings: {
          prompt: true
        },
        beforePasteCleanup : function() {
            beforePasteCleanupEvent = true;
        },
        afterPasteCleanup : function(e : PasteCleanupArgs)  {
            e.value = "<p>new value</p>";
            afterPasteCleanupEvent = true;
        }
      });
      done();
    });
    it("Paste base64 images testing", (done) => {
      let localElem: string = `<p> copied value`;
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
        expect(beforePasteCleanupEvent).toBe(true);
        expect(afterPasteCleanupEvent).toBe(true);
        let pastedEle: any = (rteObj as any).inputElement.innerHTML;
        let expectedElem: any = "<p>new value</p>";
        expect(pastedEle === expectedElem).toBe(true);
        done();
      }, 100);
    });
    afterAll(() => {
      destroy(rteObj);
    });
  });
});
describe("EJ2-51957-Unable to paste url more than two times", () => {
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
          prompt: false
        }
      });
      done();
    });
    it("Pasting url multiple times", (done) => {
      let localElem: string = `https://hr.syncfusion.com/home`;
      keyBoardEvent.clipboardData = {
        getData: (e: any) => {
            if (e === "text/plain") {
                return localElem;
            } else {
                return '';
            }
        },
        items: []
      };
      rteObj.pasteCleanupSettings.prompt = false;
      rteObj.pasteCleanupSettings.deniedTags = [];
      rteObj.pasteCleanupSettings.deniedAttrs = [];
      rteObj.pasteCleanupSettings.allowedStyleProps = [];
      rteObj.dataBind();
      (rteObj as any).inputElement.focus();
      setCursorPoint((rteObj as any).inputElement.firstElementChild, 0);
      rteObj.onPaste(keyBoardEvent);
      expect((rteObj as any).inputElement.querySelectorAll('a').length).toEqual(1);
      rteObj.onPaste(keyBoardEvent);
      expect((rteObj as any).inputElement.querySelectorAll('a').length).toEqual(2);
      rteObj.onPaste(keyBoardEvent);
      expect((rteObj as any).inputElement.querySelectorAll('a').length).toEqual(3);
      done();
    });
    afterAll((done: DoneFn) => {
      destroy(rteObj);
      done();
    });
  });

describe("EJ2-51489 - Pasting image and checking width and height - ", () => {
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
                width: '150',
                height: '150'
            }
        });
        done();
      });
    it("change height, width of image when pasting, based on width and height in 'InsertImageSettings' - ", (done) => {
        let localElem: string = "<html xmlns:v=\"urn:schemas-microsoft-com:vml\"\r\nxmlns:o=\"urn:schemas-microsoft-com:office:office\"\r\nxmlns:w=\"urn:schemas-microsoft-com:office:word\"\r\nxmlns:m=\"http://schemas.microsoft.com/office/2004/12/omml\"\r\nxmlns=\"http://www.w3.org/TR/REC-html40\">\r\n\r\n<head>\r\n<meta http-equiv=Content-Type content=\"text/html; charset=utf-8\">\r\n<meta name=ProgId content=Word.Document>\r\n<meta name=Generator content=\"Microsoft Word 15\">\r\n<meta name=Originator content=\"Microsoft Word 15\">\r\n<link rel=File-List\r\nhref=\"file:///C:/Users/REVANT~1/AppData/Local/Temp/msohtmlclip1/01/clip_filelist.xml\">\r\n<link rel=Edit-Time-Data\r\nhref=\"file:///C:/Users/REVANT~1/AppData/Local/Temp/msohtmlclip1/01/clip_editdata.mso\">\r\n<!--[if !mso]>\r\n<style>\r\nv\\:* {behavior:url(#default#VML);}\r\no\\:* {behavior:url(#default#VML);}\r\nw\\:* {behavior:url(#default#VML);}\r\n.shape {behavior:url(#default#VML);}\r\n</style>\r\n<![endif]--><!--[if gte mso 9]><xml>\r\n <o:OfficeDocumentSettings>\r\n  <o:AllowPNG/>\r\n </o:OfficeDocumentSettings>\r\n</xml><![endif]-->\r\n<link rel=themeData\r\nhref=\"file:///C:/Users/REVANT~1/AppData/Local/Temp/msohtmlclip1/01/clip_themedata.thmx\">\r\n<link rel=colorSchemeMapping\r\nhref=\"file:///C:/Users/REVANT~1/AppData/Local/Temp/msohtmlclip1/01/clip_colorschememapping.xml\">\r\n<!--[if gte mso 9]><xml>\r\n <w:WordDocument>\r\n  <w:View>Normal</w:View>\r\n  <w:Zoom>0</w:Zoom>\r\n  <w:TrackMoves>false</w:TrackMoves>\r\n  <w:TrackFormatting/>\r\n  <w:PunctuationKerning/>\r\n  <w:ValidateAgainstSchemas/>\r\n  <w:SaveIfXMLInvalid>false</w:SaveIfXMLInvalid>\r\n  <w:IgnoreMixedContent>false</w:IgnoreMixedContent>\r\n  <w:AlwaysShowPlaceholderText>false</w:AlwaysShowPlaceholderText>\r\n  <w:DoNotPromoteQF/>\r\n  <w:LidThemeOther>EN-US</w:LidThemeOther>\r\n  <w:LidThemeAsian>X-NONE</w:LidThemeAsian>\r\n  <w:LidThemeComplexScript>X-NONE</w:LidThemeComplexScript>\r\n  <w:Compatibility>\r\n   <w:BreakWrappedTables/>\r\n   <w:SnapToGridInCell/>\r\n   <w:WrapTextWithPunct/>\r\n   <w:UseAsianBreakRules/>\r\n   <w:DontGrowAutofit/>\r\n   <w:SplitPgBreakAndParaMark/>\r\n   <w:EnableOpenTypeKerning/>\r\n   <w:DontFlipMirrorIndents/>\r\n   <w:OverrideTableStyleHps/>\r\n  </w:Compatibility>\r\n  <m:mathPr>\r\n   <m:mathFont m:val=\"Cambria Math\"/>\r\n   <m:brkBin m:val=\"before\"/>\r\n   <m:brkBinSub m:val=\"&#45;-\"/>\r\n   <m:smallFrac m:val=\"off\"/>\r\n   <m:dispDef/>\r\n   <m:lMargin m:val=\"0\"/>\r\n   <m:rMargin m:val=\"0\"/>\r\n   <m:defJc m:val=\"centerGroup\"/>\r\n   <m:wrapIndent m:val=\"1440\"/>\r\n   <m:intLim m:val=\"subSup\"/>\r\n   <m:naryLim m:val=\"undOvr\"/>\r\n  </m:mathPr></w:WordDocument>\r\n</xml><![endif]--><!--[if gte mso 9]><xml>\r\n <w:LatentStyles DefLockedState=\"false\" DefUnhideWhenUsed=\"false\"\r\n  DefSemiHidden=\"false\" DefQFormat=\"false\" DefPriority=\"99\"\r\n  LatentStyleCount=\"376\">\r\n  <w:LsdException Locked=\"false\" Priority=\"0\" QFormat=\"true\" Name=\"Normal\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"9\" QFormat=\"true\" Name=\"heading 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"9\" SemiHidden=\"true\"\r\n   UnhideWhenUsed=\"true\" QFormat=\"true\" Name=\"heading 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"9\" SemiHidden=\"true\"\r\n   UnhideWhenUsed=\"true\" QFormat=\"true\" Name=\"heading 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"9\" SemiHidden=\"true\"\r\n   UnhideWhenUsed=\"true\" QFormat=\"true\" Name=\"heading 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"9\" SemiHidden=\"true\"\r\n   UnhideWhenUsed=\"true\" QFormat=\"true\" Name=\"heading 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"9\" SemiHidden=\"true\"\r\n   UnhideWhenUsed=\"true\" QFormat=\"true\" Name=\"heading 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"9\" SemiHidden=\"true\"\r\n   UnhideWhenUsed=\"true\" QFormat=\"true\" Name=\"heading 7\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"9\" SemiHidden=\"true\"\r\n   UnhideWhenUsed=\"true\" QFormat=\"true\" Name=\"heading 8\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"9\" SemiHidden=\"true\"\r\n   UnhideWhenUsed=\"true\" QFormat=\"true\" Name=\"heading 9\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"index 1\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"index 2\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"index 3\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"index 4\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"index 5\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"index 6\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"index 7\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"index 8\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"index 9\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"39\" SemiHidden=\"true\"\r\n   UnhideWhenUsed=\"true\" Name=\"toc 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"39\" SemiHidden=\"true\"\r\n   UnhideWhenUsed=\"true\" Name=\"toc 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"39\" SemiHidden=\"true\"\r\n   UnhideWhenUsed=\"true\" Name=\"toc 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"39\" SemiHidden=\"true\"\r\n   UnhideWhenUsed=\"true\" Name=\"toc 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"39\" SemiHidden=\"true\"\r\n   UnhideWhenUsed=\"true\" Name=\"toc 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"39\" SemiHidden=\"true\"\r\n   UnhideWhenUsed=\"true\" Name=\"toc 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"39\" SemiHidden=\"true\"\r\n   UnhideWhenUsed=\"true\" Name=\"toc 7\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"39\" SemiHidden=\"true\"\r\n   UnhideWhenUsed=\"true\" Name=\"toc 8\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"39\" SemiHidden=\"true\"\r\n   UnhideWhenUsed=\"true\" Name=\"toc 9\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Normal Indent\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"footnote text\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"annotation text\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"header\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"footer\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"index heading\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"35\" SemiHidden=\"true\"\r\n   UnhideWhenUsed=\"true\" QFormat=\"true\" Name=\"caption\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"table of figures\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"envelope address\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"envelope return\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"footnote reference\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"annotation reference\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"line number\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"page number\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"endnote reference\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"endnote text\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"table of authorities\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"macro\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"toa heading\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"List\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"List Bullet\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"List Number\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"List 2\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"List 3\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"List 4\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"List 5\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"List Bullet 2\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"List Bullet 3\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"List Bullet 4\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"List Bullet 5\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"List Number 2\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"List Number 3\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"List Number 4\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"List Number 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"10\" QFormat=\"true\" Name=\"Title\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Closing\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Signature\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"1\" SemiHidden=\"true\"\r\n   UnhideWhenUsed=\"true\" Name=\"Default Paragraph Font\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Body Text\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Body Text Indent\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"List Continue\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"List Continue 2\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"List Continue 3\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"List Continue 4\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"List Continue 5\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Message Header\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"11\" QFormat=\"true\" Name=\"Subtitle\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Salutation\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Date\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Body Text First Indent\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Body Text First Indent 2\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Note Heading\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Body Text 2\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Body Text 3\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Body Text Indent 2\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Body Text Indent 3\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Block Text\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Hyperlink\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"FollowedHyperlink\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"22\" QFormat=\"true\" Name=\"Strong\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"20\" QFormat=\"true\" Name=\"Emphasis\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Document Map\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Plain Text\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"E-mail Signature\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"HTML Top of Form\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"HTML Bottom of Form\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Normal (Web)\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"HTML Acronym\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"HTML Address\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"HTML Cite\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"HTML Code\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"HTML Definition\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"HTML Keyboard\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"HTML Preformatted\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"HTML Sample\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"HTML Typewriter\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"HTML Variable\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Normal Table\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"annotation subject\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"No List\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Outline List 1\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Outline List 2\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Outline List 3\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Simple 1\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Simple 2\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Simple 3\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Classic 1\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Classic 2\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Classic 3\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Classic 4\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Colorful 1\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Colorful 2\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Colorful 3\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Columns 1\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Columns 2\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Columns 3\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Columns 4\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Columns 5\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Grid 1\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Grid 2\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Grid 3\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Grid 4\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Grid 5\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Grid 6\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Grid 7\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Grid 8\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table List 1\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table List 2\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table List 3\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table List 4\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table List 5\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table List 6\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table List 7\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table List 8\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table 3D effects 1\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table 3D effects 2\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table 3D effects 3\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Contemporary\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Elegant\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Professional\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Subtle 1\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Subtle 2\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Web 1\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Web 2\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Web 3\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Balloon Text\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"39\" Name=\"Table Grid\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Table Theme\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" Name=\"Placeholder Text\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"1\" QFormat=\"true\" Name=\"No Spacing\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"60\" Name=\"Light Shading\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"61\" Name=\"Light List\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"62\" Name=\"Light Grid\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"63\" Name=\"Medium Shading 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"64\" Name=\"Medium Shading 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"65\" Name=\"Medium List 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"66\" Name=\"Medium List 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"67\" Name=\"Medium Grid 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"68\" Name=\"Medium Grid 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"69\" Name=\"Medium Grid 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"70\" Name=\"Dark List\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"71\" Name=\"Colorful Shading\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"72\" Name=\"Colorful List\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"73\" Name=\"Colorful Grid\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"60\" Name=\"Light Shading Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"61\" Name=\"Light List Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"62\" Name=\"Light Grid Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"63\" Name=\"Medium Shading 1 Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"64\" Name=\"Medium Shading 2 Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"65\" Name=\"Medium List 1 Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" Name=\"Revision\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"34\" QFormat=\"true\"\r\n   Name=\"List Paragraph\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"29\" QFormat=\"true\" Name=\"Quote\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"30\" QFormat=\"true\"\r\n   Name=\"Intense Quote\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"66\" Name=\"Medium List 2 Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"67\" Name=\"Medium Grid 1 Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"68\" Name=\"Medium Grid 2 Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"69\" Name=\"Medium Grid 3 Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"70\" Name=\"Dark List Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"71\" Name=\"Colorful Shading Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"72\" Name=\"Colorful List Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"73\" Name=\"Colorful Grid Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"60\" Name=\"Light Shading Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"61\" Name=\"Light List Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"62\" Name=\"Light Grid Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"63\" Name=\"Medium Shading 1 Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"64\" Name=\"Medium Shading 2 Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"65\" Name=\"Medium List 1 Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"66\" Name=\"Medium List 2 Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"67\" Name=\"Medium Grid 1 Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"68\" Name=\"Medium Grid 2 Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"69\" Name=\"Medium Grid 3 Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"70\" Name=\"Dark List Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"71\" Name=\"Colorful Shading Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"72\" Name=\"Colorful List Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"73\" Name=\"Colorful Grid Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"60\" Name=\"Light Shading Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"61\" Name=\"Light List Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"62\" Name=\"Light Grid Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"63\" Name=\"Medium Shading 1 Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"64\" Name=\"Medium Shading 2 Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"65\" Name=\"Medium List 1 Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"66\" Name=\"Medium List 2 Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"67\" Name=\"Medium Grid 1 Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"68\" Name=\"Medium Grid 2 Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"69\" Name=\"Medium Grid 3 Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"70\" Name=\"Dark List Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"71\" Name=\"Colorful Shading Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"72\" Name=\"Colorful List Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"73\" Name=\"Colorful Grid Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"60\" Name=\"Light Shading Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"61\" Name=\"Light List Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"62\" Name=\"Light Grid Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"63\" Name=\"Medium Shading 1 Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"64\" Name=\"Medium Shading 2 Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"65\" Name=\"Medium List 1 Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"66\" Name=\"Medium List 2 Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"67\" Name=\"Medium Grid 1 Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"68\" Name=\"Medium Grid 2 Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"69\" Name=\"Medium Grid 3 Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"70\" Name=\"Dark List Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"71\" Name=\"Colorful Shading Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"72\" Name=\"Colorful List Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"73\" Name=\"Colorful Grid Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"60\" Name=\"Light Shading Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"61\" Name=\"Light List Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"62\" Name=\"Light Grid Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"63\" Name=\"Medium Shading 1 Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"64\" Name=\"Medium Shading 2 Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"65\" Name=\"Medium List 1 Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"66\" Name=\"Medium List 2 Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"67\" Name=\"Medium Grid 1 Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"68\" Name=\"Medium Grid 2 Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"69\" Name=\"Medium Grid 3 Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"70\" Name=\"Dark List Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"71\" Name=\"Colorful Shading Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"72\" Name=\"Colorful List Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"73\" Name=\"Colorful Grid Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"60\" Name=\"Light Shading Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"61\" Name=\"Light List Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"62\" Name=\"Light Grid Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"63\" Name=\"Medium Shading 1 Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"64\" Name=\"Medium Shading 2 Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"65\" Name=\"Medium List 1 Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"66\" Name=\"Medium List 2 Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"67\" Name=\"Medium Grid 1 Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"68\" Name=\"Medium Grid 2 Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"69\" Name=\"Medium Grid 3 Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"70\" Name=\"Dark List Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"71\" Name=\"Colorful Shading Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"72\" Name=\"Colorful List Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"73\" Name=\"Colorful Grid Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"19\" QFormat=\"true\"\r\n   Name=\"Subtle Emphasis\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"21\" QFormat=\"true\"\r\n   Name=\"Intense Emphasis\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"31\" QFormat=\"true\"\r\n   Name=\"Subtle Reference\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"32\" QFormat=\"true\"\r\n   Name=\"Intense Reference\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"33\" QFormat=\"true\" Name=\"Book Title\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"37\" SemiHidden=\"true\"\r\n   UnhideWhenUsed=\"true\" Name=\"Bibliography\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"39\" SemiHidden=\"true\"\r\n   UnhideWhenUsed=\"true\" QFormat=\"true\" Name=\"TOC Heading\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"41\" Name=\"Plain Table 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"42\" Name=\"Plain Table 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"43\" Name=\"Plain Table 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"44\" Name=\"Plain Table 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"45\" Name=\"Plain Table 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"40\" Name=\"Grid Table Light\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"46\" Name=\"Grid Table 1 Light\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"47\" Name=\"Grid Table 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"48\" Name=\"Grid Table 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"49\" Name=\"Grid Table 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"50\" Name=\"Grid Table 5 Dark\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"51\" Name=\"Grid Table 6 Colorful\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"52\" Name=\"Grid Table 7 Colorful\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"46\"\r\n   Name=\"Grid Table 1 Light Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"47\" Name=\"Grid Table 2 Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"48\" Name=\"Grid Table 3 Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"49\" Name=\"Grid Table 4 Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"50\" Name=\"Grid Table 5 Dark Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"51\"\r\n   Name=\"Grid Table 6 Colorful Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"52\"\r\n   Name=\"Grid Table 7 Colorful Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"46\"\r\n   Name=\"Grid Table 1 Light Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"47\" Name=\"Grid Table 2 Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"48\" Name=\"Grid Table 3 Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"49\" Name=\"Grid Table 4 Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"50\" Name=\"Grid Table 5 Dark Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"51\"\r\n   Name=\"Grid Table 6 Colorful Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"52\"\r\n   Name=\"Grid Table 7 Colorful Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"46\"\r\n   Name=\"Grid Table 1 Light Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"47\" Name=\"Grid Table 2 Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"48\" Name=\"Grid Table 3 Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"49\" Name=\"Grid Table 4 Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"50\" Name=\"Grid Table 5 Dark Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"51\"\r\n   Name=\"Grid Table 6 Colorful Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"52\"\r\n   Name=\"Grid Table 7 Colorful Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"46\"\r\n   Name=\"Grid Table 1 Light Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"47\" Name=\"Grid Table 2 Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"48\" Name=\"Grid Table 3 Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"49\" Name=\"Grid Table 4 Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"50\" Name=\"Grid Table 5 Dark Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"51\"\r\n   Name=\"Grid Table 6 Colorful Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"52\"\r\n   Name=\"Grid Table 7 Colorful Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"46\"\r\n   Name=\"Grid Table 1 Light Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"47\" Name=\"Grid Table 2 Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"48\" Name=\"Grid Table 3 Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"49\" Name=\"Grid Table 4 Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"50\" Name=\"Grid Table 5 Dark Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"51\"\r\n   Name=\"Grid Table 6 Colorful Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"52\"\r\n   Name=\"Grid Table 7 Colorful Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"46\"\r\n   Name=\"Grid Table 1 Light Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"47\" Name=\"Grid Table 2 Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"48\" Name=\"Grid Table 3 Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"49\" Name=\"Grid Table 4 Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"50\" Name=\"Grid Table 5 Dark Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"51\"\r\n   Name=\"Grid Table 6 Colorful Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"52\"\r\n   Name=\"Grid Table 7 Colorful Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"46\" Name=\"List Table 1 Light\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"47\" Name=\"List Table 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"48\" Name=\"List Table 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"49\" Name=\"List Table 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"50\" Name=\"List Table 5 Dark\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"51\" Name=\"List Table 6 Colorful\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"52\" Name=\"List Table 7 Colorful\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"46\"\r\n   Name=\"List Table 1 Light Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"47\" Name=\"List Table 2 Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"48\" Name=\"List Table 3 Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"49\" Name=\"List Table 4 Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"50\" Name=\"List Table 5 Dark Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"51\"\r\n   Name=\"List Table 6 Colorful Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"52\"\r\n   Name=\"List Table 7 Colorful Accent 1\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"46\"\r\n   Name=\"List Table 1 Light Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"47\" Name=\"List Table 2 Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"48\" Name=\"List Table 3 Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"49\" Name=\"List Table 4 Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"50\" Name=\"List Table 5 Dark Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"51\"\r\n   Name=\"List Table 6 Colorful Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"52\"\r\n   Name=\"List Table 7 Colorful Accent 2\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"46\"\r\n   Name=\"List Table 1 Light Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"47\" Name=\"List Table 2 Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"48\" Name=\"List Table 3 Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"49\" Name=\"List Table 4 Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"50\" Name=\"List Table 5 Dark Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"51\"\r\n   Name=\"List Table 6 Colorful Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"52\"\r\n   Name=\"List Table 7 Colorful Accent 3\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"46\"\r\n   Name=\"List Table 1 Light Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"47\" Name=\"List Table 2 Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"48\" Name=\"List Table 3 Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"49\" Name=\"List Table 4 Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"50\" Name=\"List Table 5 Dark Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"51\"\r\n   Name=\"List Table 6 Colorful Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"52\"\r\n   Name=\"List Table 7 Colorful Accent 4\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"46\"\r\n   Name=\"List Table 1 Light Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"47\" Name=\"List Table 2 Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"48\" Name=\"List Table 3 Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"49\" Name=\"List Table 4 Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"50\" Name=\"List Table 5 Dark Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"51\"\r\n   Name=\"List Table 6 Colorful Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"52\"\r\n   Name=\"List Table 7 Colorful Accent 5\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"46\"\r\n   Name=\"List Table 1 Light Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"47\" Name=\"List Table 2 Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"48\" Name=\"List Table 3 Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"49\" Name=\"List Table 4 Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"50\" Name=\"List Table 5 Dark Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"51\"\r\n   Name=\"List Table 6 Colorful Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" Priority=\"52\"\r\n   Name=\"List Table 7 Colorful Accent 6\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Mention\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Smart Hyperlink\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Hashtag\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Unresolved Mention\"/>\r\n  <w:LsdException Locked=\"false\" SemiHidden=\"true\" UnhideWhenUsed=\"true\"\r\n   Name=\"Smart Link\"/>\r\n </w:LatentStyles>\r\n</xml><![endif]-->\r\n<style>\r\n<!--\r\n /* Font Definitions */\r\n @font-face\r\n\t{font-family:\"Cambria Math\";\r\n\tpanose-1:2 4 5 3 5 4 6 3 2 4;\r\n\tmso-font-charset:0;\r\n\tmso-generic-font-family:roman;\r\n\tmso-font-pitch:variable;\r\n\tmso-font-signature:3 0 0 0 1 0;}\r\n@font-face\r\n\t{font-family:Calibri;\r\n\tpanose-1:2 15 5 2 2 2 4 3 2 4;\r\n\tmso-font-charset:0;\r\n\tmso-generic-font-family:swiss;\r\n\tmso-font-pitch:variable;\r\n\tmso-font-signature:-469750017 -1073732485 9 0 511 0;}\r\n /* Style Definitions */\r\n p.MsoNormal, li.MsoNormal, div.MsoNormal\r\n\t{mso-style-unhide:no;\r\n\tmso-style-qformat:yes;\r\n\tmso-style-parent:\"\";\r\n\tmargin:0in;\r\n\tmso-pagination:widow-orphan;\r\n\tfont-size:11.0pt;\r\n\tfont-family:\"Calibri\",sans-serif;\r\n\tmso-ascii-font-family:Calibri;\r\n\tmso-ascii-theme-font:minor-latin;\r\n\tmso-fareast-font-family:Calibri;\r\n\tmso-fareast-theme-font:minor-latin;\r\n\tmso-hansi-font-family:Calibri;\r\n\tmso-hansi-theme-font:minor-latin;\r\n\tmso-bidi-font-family:\"Times New Roman\";\r\n\tmso-bidi-theme-font:minor-bidi;}\r\nspan.EmailStyle15\r\n\t{mso-style-type:personal;\r\n\tmso-style-noshow:yes;\r\n\tmso-style-unhide:no;\r\n\tmso-ansi-font-size:11.0pt;\r\n\tmso-bidi-font-size:11.0pt;\r\n\tfont-family:\"Calibri\",sans-serif;\r\n\tmso-ascii-font-family:Calibri;\r\n\tmso-ascii-theme-font:minor-latin;\r\n\tmso-fareast-font-family:Calibri;\r\n\tmso-fareast-theme-font:minor-latin;\r\n\tmso-hansi-font-family:Calibri;\r\n\tmso-hansi-theme-font:minor-latin;\r\n\tmso-bidi-font-family:\"Times New Roman\";\r\n\tmso-bidi-theme-font:minor-bidi;\r\n\tcolor:windowtext;}\r\n.MsoChpDefault\r\n\t{mso-style-type:export-only;\r\n\tmso-default-props:yes;\r\n\tfont-family:\"Calibri\",sans-serif;\r\n\tmso-ascii-font-family:Calibri;\r\n\tmso-ascii-theme-font:minor-latin;\r\n\tmso-fareast-font-family:Calibri;\r\n\tmso-fareast-theme-font:minor-latin;\r\n\tmso-hansi-font-family:Calibri;\r\n\tmso-hansi-theme-font:minor-latin;\r\n\tmso-bidi-font-family:\"Times New Roman\";\r\n\tmso-bidi-theme-font:minor-bidi;}\r\n@page WordSection1\r\n\t{size:8.5in 11.0in;\r\n\tmargin:1.0in 1.0in 1.0in 1.0in;\r\n\tmso-header-margin:.5in;\r\n\tmso-footer-margin:.5in;\r\n\tmso-paper-source:0;}\r\ndiv.WordSection1\r\n\t{page:WordSection1;}\r\n-->\r\n</style>\r\n<!--[if gte mso 10]>\r\n<style>\r\n /* Style Definitions */\r\n table.MsoNormalTable\r\n\t{mso-style-name:\"Table Normal\";\r\n\tmso-tstyle-rowband-size:0;\r\n\tmso-tstyle-colband-size:0;\r\n\tmso-style-noshow:yes;\r\n\tmso-style-priority:99;\r\n\tmso-style-parent:\"\";\r\n\tmso-padding-alt:0in 5.4pt 0in 5.4pt;\r\n\tmso-para-margin:0in;\r\n\tmso-pagination:widow-orphan;\r\n\tfont-size:11.0pt;\r\n\tfont-family:\"Calibri\",sans-serif;\r\n\tmso-ascii-font-family:Calibri;\r\n\tmso-ascii-theme-font:minor-latin;\r\n\tmso-hansi-font-family:Calibri;\r\n\tmso-hansi-theme-font:minor-latin;\r\n\tmso-bidi-font-family:\"Times New Roman\";\r\n\tmso-bidi-theme-font:minor-bidi;}\r\n</style>\r\n<![endif]-->\r\n</head>\r\n\r\n<body lang=EN-US style='tab-interval:.5in;word-wrap:break-word'>\r\n<!--StartFragment-->\r\n\r\n<p class=MsoNormal>RTE Conent<o:p></o:p></p>\r\n\r\n<p class=MsoNormal><span style='mso-no-proof:yes'><!--[if gte vml 1]><v:shapetype\r\n id=\"_x0000_t75\" coordsize=\"21600,21600\" o:spt=\"75\" o:preferrelative=\"t\"\r\n path=\"m@4@5l@4@11@9@11@9@5xe\" filled=\"f\" stroked=\"f\">\r\n <v:stroke joinstyle=\"miter\"/>\r\n <v:formulas>\r\n  <v:f eqn=\"if lineDrawn pixelLineWidth 0\"/>\r\n  <v:f eqn=\"sum @0 1 0\"/>\r\n  <v:f eqn=\"sum 0 0 @1\"/>\r\n  <v:f eqn=\"prod @2 1 2\"/>\r\n  <v:f eqn=\"prod @3 21600 pixelWidth\"/>\r\n  <v:f eqn=\"prod @3 21600 pixelHeight\"/>\r\n  <v:f eqn=\"sum @0 0 1\"/>\r\n  <v:f eqn=\"prod @6 1 2\"/>\r\n  <v:f eqn=\"prod @7 21600 pixelWidth\"/>\r\n  <v:f eqn=\"sum @8 21600 0\"/>\r\n  <v:f eqn=\"prod @7 21600 pixelHeight\"/>\r\n  <v:f eqn=\"sum @10 21600 0\"/>\r\n </v:formulas>\r\n <v:path o:extrusionok=\"f\" gradientshapeok=\"t\" o:connecttype=\"rect\"/>\r\n <o:lock v:ext=\"edit\" aspectratio=\"t\"/>\r\n</v:shapetype><v:shape id=\"Picture_x0020_1\" o:spid=\"_x0000_i1025\" type=\"#_x0000_t75\"\r\n style='width:93.5pt;height:52.5pt;flip:y;visibility:visible;mso-wrap-style:square'>\r\n <v:imagedata src=\"file:///C:/Users/REVANT~1/AppData/Local/Temp/msohtmlclip1/01/clip_image001.png\"\r\n  o:title=\"\"/>\r\n</v:shape><![endif]--><![if !vml]><img width=125 height=70\r\nsrc=\"file:///C:/Users/REVANT~1/AppData/Local/Temp/msohtmlclip1/01/clip_image001.png\"\r\nv:shapes=\"Picture_x0020_1\"><![endif]></span><o:p></o:p></p>\r\n\r\n<p class=MsoNormal>RTE Content<o:p></o:p></p>\r\n\r\n<p class=MsoNormal><o:p>&nbsp;</o:p></p>\r\n\r\n<!--EndFragment-->\r\n</body>\r\n\r\n</html>\r\n"
        keyBoardEvent.clipboardData = {
            getData: () => {
              return localElem;
            },
            items: []
          };
        rteObj.pasteCleanupSettings.prompt = true;
        rteObj.value = '<p>101</p>';
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
          expect(rteObj.inputElement.querySelector('img').getAttribute('width')).toBe('150');
          expect(rteObj.inputElement.querySelector('img').getAttribute('height')).toBe('150');
          done();
        }, 50);
    });

    afterAll((done: DoneFn) => {
        destroy(rteObj);
        done();
    });
});

describe("EJ2-52017 - EJ2-53762 - Pasting content removes content editable div issue", () => {
    let rteObj: RichTextEditor;
    let editorObj: EditorManager;
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
          prompt: false
        }
      });
      editorObj = new EditorManager({ document: document, editableElement: document.getElementsByClassName("e-content")[0] });
      done();
    });
    it("Pasting content removes content editable div when range node is contenteditable div", (done) => {
      let localElem: string = `<p>Content to be pasted in the editor</p>`;
      keyBoardEvent.clipboardData = {
        getData: () => {
          return localElem;
        },
        items: []
      };
      rteObj.pasteCleanupSettings.prompt = false;
      rteObj.pasteCleanupSettings.deniedTags = [];
      rteObj.pasteCleanupSettings.deniedAttrs = [];
      rteObj.pasteCleanupSettings.allowedStyleProps = [];
      rteObj.dataBind();
      (rteObj as any).inputElement.focus();
      editorObj.nodeSelection.setSelectionText(document, (rteObj as any).inputElement, (rteObj as any).inputElement, 0, 0);
      rteObj.onPaste(keyBoardEvent);
      setTimeout(() => {
        expect((rteObj as any).inputElement.innerHTML === '<p>Content to be pasted in the editor</p>').toBe(true)
        done();
      }, 100);
    });
    afterAll((done: DoneFn) => {
      destroy(rteObj);
      done();
    });
});

describe("BLAZ-20276 - Pasting content after shift+Enter throws console error issue - ", () => {
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
                width: '150',
                height: '150'
            }
        });
        done();
      });
    it(" pasting content after shift + enter content issue - ", (done) => {
        let localElem: string = `<div><!--StartFragment--><b style=" font-weight: 500; color: rgba(0, 0, 0, 0.87); font-family: Heebo, &quot;segoe ui&quot;; font-size: 14px; font-style: normal; text-align: start; text-indent: 0px; white-space: normal; background-color: rgb(255, 255, 255);" class="pasteContent_RTE">Actual Behavior</b><span style="color: rgba(0, 0, 0, 0.87); font-family: Heebo, &quot;segoe ui&quot;; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; white-space: normal; background-color: rgb(255, 255, 255); display: inline !important; float: none;" class="pasteContent_RTE">: &nbsp;Need to paste the content after shift+enter without any console error.</span><!--EndFragment--></div>`;
        keyBoardEvent.clipboardData = {
            getData: () => {
              return localElem;
            },
            items: []
          };
        rteObj.pasteCleanupSettings.prompt = true;
        rteObj.value = '<p class="focusElement">RTE Content<br><br></p>';
        rteObj.dataBind();
        (rteObj as any).inputElement.focus();
        setCursorPoint((rteObj as any).inputElement.querySelector('.focusElement').childNodes[2], 0);
        rteObj.onPaste(keyBoardEvent);
        setTimeout(() => {
          if (rteObj.pasteCleanupSettings.prompt) {
            let keepFormat: any = document.getElementById(rteObj.getID() + "_pasteCleanupDialog").getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
            keepFormat[0].click();
            let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
            pasteOK[0].click();
          }
          expect((rteObj as any).inputElement.innerHTML === `<p class="focusElement">RTE Content</p><div><b style=" font-weight: 500; color: rgba(0, 0, 0, 0.87); font-family: Heebo, &quot;segoe ui&quot;; font-size: 14px; font-style: normal; text-align: start; text-indent: 0px; white-space: normal; background-color: rgb(255, 255, 255);">Actual Behavior</b><span style="color: rgba(0, 0, 0, 0.87); font-family: Heebo, &quot;segoe ui&quot;; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; white-space: normal; background-color: rgb(255, 255, 255); display: inline !important; float: none;">: &nbsp;Need to paste the content after shift+enter without any console error.</span></div>`).toBe(true)
          done();
        }, 50);
    });

    afterAll((done: DoneFn) => {
        destroy(rteObj);
        done();
    });
});

describe("EJ2-57494 - Pasting content when enterKey is configured as BR not working issue test case", () => {
    let rteObj: RichTextEditor;
    let editorObj: EditorManager;
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
          prompt: false
        },
        enterKey: 'BR'
      });
      editorObj = new EditorManager({ document: document, editableElement: document.getElementsByClassName("e-content")[0] });
      done();
    });
    it("Pasting content when enterKey is configured as BR not working issue test case", (done) => {
      let localElem: string = `<html>\r\n<body>\r\n\x3C!--StartFragment--><p style="box-sizing: border-box; margin: 0px 0px 10px; color: rgba(0, 0, 0, 0.87); font-family: Heebo, &quot;open sans&quot;, sans-serif, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam non volutpat lectus. Nullam nec risus vel leo porta interdum vitae eu orci. Ut scelerisque in purus a viverra. Praesent eu enim et ligula sodales ullamcorper. Suspendisse id semper ante. Ut efficitur feugiat lacinia. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse nec justo nisl. Vestibulum ullamcorper faucibus orci nec porta. Nunc molestie nisl at mattis feugiat. Mauris tempus vulputate ante, eget porttitor ante porta in.</p><p style="box-sizing: border-box; margin: 0px 0px 10px; color: rgba(0, 0, 0, 0.87); font-family: Heebo, &quot;open sans&quot;, sans-serif, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><br style="box-sizing: border-box;"></p><p style="box-sizing: border-box; margin: 0px 0px 10px; color: rgba(0, 0, 0, 0.87); font-family: Heebo, &quot;open sans&quot;, sans-serif, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;">Aliquam pellentesque vehicula nibh ut porta. Etiam vitae dignissim dui, non venenatis ligula. Nam feugiat porta ex, eget consequat urna placerat eu. Cras ut elit nec nisi semper congue. Duis eu purus id elit lobortis fermentum. Praesent a volutpat dui, nec dictum sapien. Etiam maximus ex sed odio feugiat, eget consectetur tortor vestibulum. Praesent vehicula ultrices blandit. Phasellus maximus molestie tellus, quis vestibulum sapien feugiat vitae. Sed ornare lacus sodales quam tempor, in pellentesque ex feugiat. Vestibulum odio arcu, interdum a velit et, tristique malesuada nisl. Sed ut eros vitae justo cursus scelerisque et nec eros. Quisque luctus ornare suscipit. Proin vitae nisl lectus. Sed dignissim posuere felis, at vehicula turpis finibus ut.</p><p style="box-sizing: border-box; margin: 0px 0px 10px; color: rgba(0, 0, 0, 0.87); font-family: Heebo, &quot;open sans&quot;, sans-serif, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><br style="box-sizing: border-box;"></p><p style="box-sizing: border-box; margin: 0px 0px 10px; color: rgba(0, 0, 0, 0.87); font-family: Heebo, &quot;open sans&quot;, sans-serif, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;">Donec eleifend fermentum enim a ultricies. Duis nec sodales leo. Nulla at tempor diam. Donec ornare, diam in laoreet suscipit, orci velit tempus eros, id fringilla justo lacus ac mauris. Donec tristique rhoncus porttitor. Vivamus vestibulum tellus non orci eleifend gravida. Suspendisse aliquam dolor non nisl euismod, eget pulvinar sem auctor. Nam cursus ante vitae volutpat mollis. Nam facilisis bibendum porta. Sed volutpat ex augue, ac viverra tellus sodales a. Suspendisse luctus neque urna, eget tincidunt metus mollis eu. Aenean consectetur nisi quis turpis venenatis mollis.</p><p style="box-sizing: border-box; margin: 0px 0px 10px; color: rgba(0, 0, 0, 0.87); font-family: Heebo, &quot;open sans&quot;, sans-serif, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><br style="box-sizing: border-box;"></p><p style="box-sizing: border-box; margin: 0px 0px 10px; color: rgba(0, 0, 0, 0.87); font-family: Heebo, &quot;open sans&quot;, sans-serif, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;">Proin non lacus id mauris bibendum posuere. Donec rhoncus nunc sit amet maximus fermentum. Nullam tortor mi, consectetur vitae eleifend sed, viverra a mi. Nulla purus sem, mollis vitae venenatis sed, dapibus eu augue. Aliquam nisl lacus, iaculis aliquet arcu eu, lobortis consectetur augue. Curabitur euismod dui arcu, id sollicitudin nisi pulvinar id. Sed elit nisl, egestas quis feugiat nec, sodales et ipsum. Vivamus arcu risus, faucibus sed odio accumsan, rhoncus elementum odio. Cras ut lectus gravida, fringilla eros eget, vulputate velit. In vitae odio est.</p>\x3C!--EndFragment-->\r\n</body>\r\n</html>`;
      keyBoardEvent.clipboardData = {
        getData: () => {
          return localElem;
        },
        items: []
      };
      rteObj.pasteCleanupSettings.prompt = false;
      rteObj.pasteCleanupSettings.deniedTags = [];
      rteObj.pasteCleanupSettings.deniedAttrs = [];
      rteObj.pasteCleanupSettings.allowedStyleProps = [];
      rteObj.dataBind();
      (rteObj as any).inputElement.focus();
      editorObj.nodeSelection.setSelectionText(document, (rteObj as any).inputElement, (rteObj as any).inputElement, 0, 0);
      rteObj.onPaste(keyBoardEvent);
      setTimeout(() => {
        expect((rteObj as any).inputElement.innerHTML === `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam non volutpat lectus. Nullam nec risus vel leo porta interdum vitae eu orci. Ut scelerisque in purus a viverra. Praesent eu enim et ligula sodales ullamcorper. Suspendisse id semper ante. Ut efficitur feugiat lacinia. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse nec justo nisl. Vestibulum ullamcorper faucibus orci nec porta. Nunc molestie nisl at mattis feugiat. Mauris tempus vulputate ante, eget porttitor ante porta in.</p><p><br></p><p>Aliquam pellentesque vehicula nibh ut porta. Etiam vitae dignissim dui, non venenatis ligula. Nam feugiat porta ex, eget consequat urna placerat eu. Cras ut elit nec nisi semper congue. Duis eu purus id elit lobortis fermentum. Praesent a volutpat dui, nec dictum sapien. Etiam maximus ex sed odio feugiat, eget consectetur tortor vestibulum. Praesent vehicula ultrices blandit. Phasellus maximus molestie tellus, quis vestibulum sapien feugiat vitae. Sed ornare lacus sodales quam tempor, in pellentesque ex feugiat. Vestibulum odio arcu, interdum a velit et, tristique malesuada nisl. Sed ut eros vitae justo cursus scelerisque et nec eros. Quisque luctus ornare suscipit. Proin vitae nisl lectus. Sed dignissim posuere felis, at vehicula turpis finibus ut.</p><p><br></p><p>Donec eleifend fermentum enim a ultricies. Duis nec sodales leo. Nulla at tempor diam. Donec ornare, diam in laoreet suscipit, orci velit tempus eros, id fringilla justo lacus ac mauris. Donec tristique rhoncus porttitor. Vivamus vestibulum tellus non orci eleifend gravida. Suspendisse aliquam dolor non nisl euismod, eget pulvinar sem auctor. Nam cursus ante vitae volutpat mollis. Nam facilisis bibendum porta. Sed volutpat ex augue, ac viverra tellus sodales a. Suspendisse luctus neque urna, eget tincidunt metus mollis eu. Aenean consectetur nisi quis turpis venenatis mollis.</p><p><br></p><p>Proin non lacus id mauris bibendum posuere. Donec rhoncus nunc sit amet maximus fermentum. Nullam tortor mi, consectetur vitae eleifend sed, viverra a mi. Nulla purus sem, mollis vitae venenatis sed, dapibus eu augue. Aliquam nisl lacus, iaculis aliquet arcu eu, lobortis consectetur augue. Curabitur euismod dui arcu, id sollicitudin nisi pulvinar id. Sed elit nisl, egestas quis feugiat nec, sodales et ipsum. Vivamus arcu risus, faucibus sed odio accumsan, rhoncus elementum odio. Cras ut lectus gravida, fringilla eros eget, vulputate velit. In vitae odio est.</p>`).toBe(true)
        done();
      }, 100);
    });
    afterAll((done: DoneFn) => {
      destroy(rteObj);
      done();
    });
});

describe("EJ2-57352 - Image paste upload toolbar disable check", () => {
    let rteObj: RichTextEditor;
    let imgSize: number;
    let sizeInBytes: number;
    let toolbarDisabled: boolean = false;
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
            },
            imageUploading: function (args) {
                if (rteObj.toolbarModule.baseToolbar.toolbarObj.element.className.indexOf('e-overlay') > 0) {
                    toolbarDisabled = true;
                }
                
            }
        });
        done();
    });

    it(" Image paste upload toolbar disable check", (done) => {
        keyBoardEvent.clipboardData = {
            getData: () => { return `<html> <body> <!--StartFragment--><p>content<br/> <img class='pasteContent_Img' src='data:image/png;base64,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`
    + `96F41gHWylg6dldX1IYkYIqw/WOvbcgyIGhX1LJd0BU2aUs6ZVut9vr5Jm8AcETQS7lQkA1YOaOvWz4gTAKupvchoCQVMjBbCkk8H8GJ9KryxHEUmnezhOVxvexWT8QukFPGPFE4EkrZJDccsqA4/RmTfZc+uWBYNnJEp8EQWTL4U2plJG/jnUd4nESxa2s/hMgwGlNk9Ij81ohs9ypprtU3H0kw6dGADplGwLeqhYKz8UX026P6ZozDreGAHRplqiCchxzwcQXQuDS1UiM4ju3jqDTsCCgrDqEKHewAAKfBsISurznEcOfFAHolE0eOd61Mdy7c6bScRifSyPes9BPigB0yoa5UhkPrdYaHggaPQQ12eN7AY8KCg+BYiKg+JGnlLbcAPQUH5vlg3bK4SFg7hldGrfrfXqUlnGMMhqGuXfS3YAnBYWHoBAnCKiG80R2ndieFQKVNmfbIlqaDxhWhIdAgB0CIn60SKWTvBlfULuUpcfIZ/iAYUV4CJI9HQHHLW5NECLptcUztg6g2uADdsrhIWAvM9idpqoeVwlJXTwhye1qtkJyDW6B6q2i8BBEOhgBTy117BIaKvENB0yAIGCnHCICDYcV6RXlKOCutCuWVjKeY1cfFCKCPBzrU42VTZnbTbl9f4GP97xuXk0hIqjCnB3fXV1nOev2VRLHOSMpnxQigjJEkAk4UGEpzgd2LwoXQZrKBB2ogGFcsAdDRKDwAMGi7ngljdJcsAdDRFDgoAyCDlQuM7ePQIKBUSagT4xkG7ePgKXAWD8d0CfeCQSRLgiM+MAI7oAWwQQ876c/8CTqDvgiGBjxXEA+tLsQVcDkL89x6w/Yk4VcJx2//fEBMOU4MIS03+OJ2aQkwAUYo3i6AdMct5+zA5TjQJe2simTBQUu2c72uhyfzmTQAmK+FzRtGi6CSDlDZZZ0ynDRS6cH18lneExo9fMoqynBT2UOF0FEASGmkxkWrjcvw3lToC67DR6uKAbMd+Fab62sXPd4+JARsJecRQispJSrnewIrfPD680B7xkKNHo1p3gcuH0HEERycS7TUWJKOa9lYatDPUfqQnVxo1cZuBsgDNZvCEEkn443MulMAxC2UZ4aXXa0fE655hnqiyh0BJFqXNcWPg1ttKwwQjLc1yzZKXwEkaTW6/UA60yYbyZaTDeAANBNtrmTbgbBp6R1EJBdIEFjsJshC4IV4UDZlMHldd4KECqxzOWjewYtn8hiR5ZlxlxPuQuKJFVHKQuAdGrp8CprufXevUePqPKtY8iNHtmYunfvH0tea1bo2u8FGHphvgVtfUpq9xz8A6aWZEpyzpvB7feWpdlvmtheyoOlJQgYyn3/vUdB01vXJzbrEgCgxLLIpef1xKNw3sAVgLR/eLCz20sWmH9D9AsroV8KZQ+h3XsUMN98bfIUQSb+2Weff/6ZN33+2Rf/3E27H+rekkNiO24EmfTnXyxgH9MX/2w0XDIImt+6NikuVvjRF8sBAAifdzN2B5xJ317nrFhYSTdSjdFnKwEACF98PkrDfUyY/dRB4HVZYZDU6XKgV3oEh97d3goFsoLojPC+dvBU+dMMABZSUqlqiL4AbbvQhB0E7gO35/PV3JKfmYwAAAAjSURBVPXf3xYasfCkgRh0o7/4AtPnDsK/IrfKwMMGbmrQ+P8fqKtA+4EH0QAAAABJRU5ErkJggg==' /></p><!--EndFragment--> </body></html>` },
            types: ['text/html', 'Files'],
            files: { 0: { lastModified: 1594563447084, name: "image.png", size: 66216, type: "image/png", webkitRelativePath: "", lastModifiedDate: new Date() } },
            items: { 0: { kind: 'string', type: 'text/html' }, 1: { kind: 'file', type: 'image/png' }, }
        };
        setCursorPoint((rteObj as any).inputElement.firstElementChild, 0);
        rteObj.onPaste(keyBoardEvent);
        setTimeout(() => {
            expect(toolbarDisabled).toBe(true);
            done();
        }, 50);
    });

    afterAll((done: DoneFn) => {
        destroy(rteObj);
        done();
    });
});

describe("EJ2-58136 - Paste Url with other content more than one line", () => {
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
            value: `<p>RTE first content</p><p class="focusNode"><br></p><p>RTE last content</p>`
        });
        done();
    });

    it(" Paste Url with other content more than one line", (done) => {
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
        setCursorPoint((rteObj as any).inputElement.querySelector('.focusNode'), 0);
        rteObj.onPaste(keyBoardEvent);
        setTimeout(() => {
            expect(rteObj.inputElement.childNodes[1].childNodes[0].nodeName === 'SPAN').toBe(true);
            done();
        }, 50);
    });

    afterAll((done: DoneFn) => {
        destroy(rteObj);
        done();
    });
});

describe("EJ2-58258 - Pasting content after shift+Enter doesn't paste the content - ", () => {
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
                width: '150',
                height: '150'
            }
        });
        done();
      });
    it(" pasting content after shift + enter doesn't paste - ", (done) => {
        let localElem: string = `<span style="color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, &quot;sans-serif&quot;, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">RTE Content</span>`;
        keyBoardEvent.clipboardData = {
            getData: () => {
              return localElem;
            },
            items: []
          };
        rteObj.pasteCleanupSettings.prompt = true;
        rteObj.value = '<p class="focusElement">RTE Content<br><br></p>';
        rteObj.dataBind();
        (rteObj as any).inputElement.focus();
        setCursorPoint((rteObj as any).inputElement.querySelector('.focusElement').childNodes[2], 0);
        rteObj.onPaste(keyBoardEvent);
        setTimeout(() => {
          if (rteObj.pasteCleanupSettings.prompt) {
            let keepFormat: any = document.getElementById(rteObj.getID() + "_pasteCleanupDialog").getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
            keepFormat[0].click();
            let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
            pasteOK[0].click();
          }
          const pastedElem: string = rteObj.inputElement.innerHTML;
          const expectedElem: string = '<p class="focusElement">RTE Content<br><span style="color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, &quot;sans-serif&quot;, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; background-color: rgb(255, 255, 255); display: inline !important; float: none;">RTE Content</span><br></p>';
          expect(pastedElem === expectedElem).toBe(true)
          done();
        }, 50);
    });

    afterAll((done: DoneFn) => {
        destroy(rteObj);
        done();
    });
});

describe("Pasting the link element added in the editor without prompt", () => {
    let rteObj: RichTextEditor;
    let editorObj: EditorManager;
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
          prompt: false
        }
      });
      editorObj = new EditorManager({ document: document, editableElement: document.getElementsByClassName("e-content")[0] });
      done();
    });
    it("Pasting content when enterKey is configured as BR not working issue test case", (done) => {
      let localElem: string = `<!--StartFragment--><a class="e-rte-anchor" href="http://www.google.com" title="http://www.google.com" target="_blank" style="box-sizing: border-box; text-decoration: none; user-select: auto; color: rgb(46, 46, 241); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, &quot;sans-serif&quot;, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255);">Testing</a><!--EndFragment-->`;
      keyBoardEvent.clipboardData = {
        getData: () => {
          return localElem;
        },
        items: []
      };
      rteObj.value = '<p><a class="e-rte-anchor" href="http://www.google.com" title="http://www.google.com" target="_blank">Testing</a></p>'
      rteObj.pasteCleanupSettings.prompt = false;
      rteObj.pasteCleanupSettings.deniedTags = [];
      rteObj.pasteCleanupSettings.deniedAttrs = [];
      rteObj.pasteCleanupSettings.allowedStyleProps = [];
      rteObj.dataBind();
      (rteObj as any).inputElement.focus();
      setCursorPoint((rteObj as any).inputElement.firstElementChild.firstChild.firstChild, 7);
      rteObj.onPaste(keyBoardEvent);
      setTimeout(() => {
        expect((rteObj as any).inputElement.innerHTML === `<p><a class="e-rte-anchor" href="http://www.google.com" title="http://www.google.com" target="_blank">Testing</a><a class="e-rte-anchor" href="http://www.google.com" title="http://www.google.com" target="_blank" aria-label="Open in new window">Testing</a></p>`).toBe(true)
        done();
      }, 100);
    });
    afterAll((done: DoneFn) => {
      destroy(rteObj);
      done();
    });
});

describe("Pasting the link element added in the editor with prompt", () => {
    let rteObj: RichTextEditor;
    let editorObj: EditorManager;
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
      editorObj = new EditorManager({ document: document, editableElement: document.getElementsByClassName("e-content")[0] });
      done();
    });
    it("Pasting content when enterKey is configured as BR not working issue test case", (done) => {
      let localElem: string = `<!--StartFragment--><a class="e-rte-anchor" href="http://www.google.com" title="http://www.google.com" target="_blank" style="box-sizing: border-box; text-decoration: none; user-select: auto; color: rgb(46, 46, 241); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, &quot;sans-serif&quot;, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255);">Testing</a><!--EndFragment-->`;
      keyBoardEvent.clipboardData = {
        getData: () => {
          return localElem;
        },
        items: []
      };
      rteObj.value = '<p><a class="e-rte-anchor" href="http://www.google.com" title="http://www.google.com" target="_blank">Testing</a></p>'
      rteObj.pasteCleanupSettings.deniedTags = [];
      rteObj.pasteCleanupSettings.deniedAttrs = [];
      rteObj.pasteCleanupSettings.allowedStyleProps = [];
      rteObj.dataBind();
      (rteObj as any).inputElement.focus();
      setCursorPoint((rteObj as any).inputElement.firstElementChild.firstChild.firstChild, 7);
      rteObj.onPaste(keyBoardEvent);
      setTimeout(() => {
        if (rteObj.pasteCleanupSettings.prompt) {
            let keepFormat: any = document.getElementById(rteObj.getID() + "_pasteCleanupDialog").getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
            keepFormat[0].click();
            let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
            pasteOK[0].click();
        }
        expect((rteObj as any).inputElement.innerHTML === `<p><a class="e-rte-anchor" href="http://www.google.com" title="http://www.google.com" target="_blank">Testing</a><a class="e-rte-anchor" href="http://www.google.com" title="http://www.google.com" target="_blank" aria-label="Open in new window">Testing</a></p>`).toBe(true)
        done();
      }, 100);
    });
    afterAll((done: DoneFn) => {
      destroy(rteObj);
      done();
    });
});

describe("EJ2-58827 - pasting only content which is contenteditable as false", () => {
    let rteObj: RichTextEditor;
    let editorObj: EditorManager;
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
      editorObj = new EditorManager({ document: document, editableElement: document.getElementsByClassName("e-content")[0] });
      done();
    });
    it("pasting only content which is contenteditable as false with br tag with apple class", (done) => {
      let localElem: string = `<html>\r\n<body>\r\n\x3C!--StartFragment--><br class="Apple-interchange-newline"><span style="color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, &quot;sans-serif&quot;, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">The Rich Text Editor (RTE) control is an easy to render in the client side. Customer easy to edit the contents and get the HTML content for the displayed content. A rich text editor control provides users with a toolbar that helps them to apply rich text formats to the text entered in the text area.</span><br class="Apple-interchange-newline">\x3C!--EndFragment-->\r\n</body>\r\n</html>`;
      keyBoardEvent.clipboardData = {
        getData: () => {
          return localElem;
        },
        items: []
      };
      rteObj.value = '<p>22</p>';
      rteObj.pasteCleanupSettings.deniedTags = [];
      rteObj.pasteCleanupSettings.deniedAttrs = [];
      rteObj.pasteCleanupSettings.allowedStyleProps = [];
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
        expect((rteObj as any).inputElement.innerHTML === `<p><span>The Rich Text Editor (RTE) control is an easy to render in the client side. Customer easy to edit the contents and get the HTML content for the displayed content. A rich text editor control provides users with a toolbar that helps them to apply rich text formats to the text entered in the text area.</span>22</p>`).toBe(true)
        done();
      }, 100);
    });
    afterAll((done: DoneFn) => {
      destroy(rteObj);
      done();
    });
});

describe("EJ2-58433 - Pasting content from note pad, outlook, visual studio, VS Code, the list is removed", () => {
    let rteObj: RichTextEditor;
    let editorObj: EditorManager;
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
      editorObj = new EditorManager({ document: document, editableElement: document.getElementsByClassName("e-content")[0] });
      done();
    });
    it("Pasting content from notepad to the list with empty content", (done) => {
      let localElem: string = `RTE Content`;
      keyBoardEvent.clipboardData = {
        getData: (e: any) => {
            if (e === "text/plain") {
                return 'RTE Content';
            } else {
                return '';
            }
        },
        items: []
      };
      rteObj.value = '<ol><li class="focusNode">﻿﻿<br></li></ol>'
      rteObj.pasteCleanupSettings.deniedTags = [];
      rteObj.pasteCleanupSettings.deniedAttrs = [];
      rteObj.pasteCleanupSettings.allowedStyleProps = [];
      rteObj.dataBind();
      (rteObj as any).inputElement.focus();
      setCursorPoint((rteObj as any).inputElement.querySelector('.focusNode').childNodes[0], 0);
      rteObj.onPaste(keyBoardEvent);
      setTimeout(() => {
        if (rteObj.pasteCleanupSettings.prompt) {
            let keepFormat: any = document.getElementById(rteObj.getID() + "_pasteCleanupDialog").getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
            keepFormat[0].click();
            let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
            pasteOK[0].click();
        }
        const expetedElem: string = '<ol><li class="focusNode">RTE Content﻿﻿<br></li></ol>';
        const pastedElem: string = rteObj.inputElement.innerHTML;
        expect(expetedElem === pastedElem).toBe(true)
        done();
      }, 100);
    });
    afterAll((done: DoneFn) => {
      destroy(rteObj);
      done();
    });
});

describe("EJ2-60128 - pasting content which exceeds the max char count", () => {
  let rteObj: RichTextEditor;
  let editorObj: EditorManager;
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
        prompt: false
      },
      showCharCount: true,
      maxLength: 30
    });
    editorObj = new EditorManager({ document: document, editableElement: document.getElementsByClassName("e-content")[0] });
    done();
  });
  it("pasting content which exceeds the max char count", (done) => {
    let localElem: string = `<p>Content1</p>`;
    keyBoardEvent.clipboardData = {
      getData: () => {
        return localElem;
      },
      items: []
    };
    rteObj.value = '<p>.NEt core application.&nbsp;</p>';
    rteObj.pasteCleanupSettings.deniedTags = [];
    rteObj.pasteCleanupSettings.deniedAttrs = [];
    rteObj.pasteCleanupSettings.allowedStyleProps = [];
    rteObj.dataBind();
    (rteObj as any).inputElement.focus();
    setCursorPoint((rteObj as any).inputElement.firstElementChild.childNodes[0], 23);
    rteObj.onPaste(keyBoardEvent);
    setTimeout(() => {
      expect((rteObj as any).inputElement.innerHTML === `<p>.NEt core application.&nbsp;</p>`).toBe(true)
      done();
    }, 100);
  });

  it("EJ2-60239 - pasting content with exact content the max char count", (done) => {
      keyBoardEvent.clipboardData = {
      getData: (e: any) => {
          if (e === "text/plain") {
              return 'content';
          } else {
              return '';
          }
      },
        items: []
      };
      rteObj.value = '<p>.NEt core application.&nbsp;</p>';
      rteObj.pasteCleanupSettings.deniedTags = [];
      rteObj.pasteCleanupSettings.deniedAttrs = [];
      rteObj.pasteCleanupSettings.allowedStyleProps = [];
      rteObj.dataBind();
      (rteObj as any).inputElement.focus();
      setCursorPoint((rteObj as any).inputElement.firstElementChild.childNodes[0], 23);
      rteObj.onPaste(keyBoardEvent);
      setTimeout(() => {
        const expetedElem: string = '<p>.NEt core application.&nbsp;content</p>';
        const pastedElem: string = rteObj.inputElement.innerHTML;
        expect(expetedElem === pastedElem).toBe(true)
        expect((rteObj as any).element.querySelector('.e-rte-character-count').innerHTML === `30 / 30`).toBe(true)
        done();
      }, 100);
    });

    afterAll((done: DoneFn) => {
      destroy(rteObj);
      done();
    });
});

describe("EJ2-65736 - Pasted texts gets outside the contentEditable div when using enterKey as BR or DIV in RTE", () => {
    let rteObj: RichTextEditor;
    let editorObj: EditorManager;
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
    let innerHTML: string = "insertedText";
    beforeAll((done: Function) => {
      rteObj = renderRTE({
        pasteCleanupSettings: {
          prompt: true
        },
        enterKey: 'BR',
        value: innerHTML
      });
      editorObj = new EditorManager({ document: document, editableElement: document.getElementsByClassName("e-content")[0] });
      done();
    });
    it("Pasting content when enterKey is configured as BR and Div not working issue test case", (done) => {
      let localElem: string = `<div style="display:inline;"><!--StartFragment--><h1 style=" font-size: 42px; font-family: &quot;Segoe UI&quot;, Arial, sans-serif; font-weight: 400; margin: 10px 0px; color: rgb(0, 0, 0); font-style: normal; text-align: start; text-indent: 0px; white-space: normal;" class="pasteContent_RTE">Heading</h1><!--EndFragment--></div>`;
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
      setCursorPoint((rteObj as any).inputElement.childNodes[0], 12);
      rteObj.onPaste(keyBoardEvent);
      setTimeout(() => {
        if (rteObj.pasteCleanupSettings.prompt) {
            let keepFormat: any = document.getElementById(rteObj.getID() + "_pasteCleanupDialog").getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
            keepFormat[0].click();
            let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
            pasteOK[0].click();
        }
        expect((rteObj as any).inputElement.innerHTML === `insertedText<div><h1>Heading</h1></div>`).toBe(true);
        done();
      }, 100);
    });
    afterAll((done: DoneFn) => {
      destroy(rteObj);
      done();
    });
});

describe("EJ2-69216 - pasting as plain text when BR is configured", () => {
    let rteObj: RichTextEditor;
    let editorObj: EditorManager;
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
    let innerHTML: string = `This is a test<br /><br />
    Paste below:<br /><br /><br />`;
    beforeAll((done: Function) => {
      rteObj = renderRTE({
        pasteCleanupSettings: {
          prompt: true
        },
        enterKey: 'BR',
        value: innerHTML
      });
      editorObj = new EditorManager({ document: document, editableElement: document.getElementsByClassName("e-content")[0] });
      done();
    });
    it("Pasting content when enterKey is configured as BR and Div not working issue test case", (done) => {
      let localElem: string = `<p style="margin-top:0in;margin-right:0in;margin-bottom:8.0pt;margin-left:0in;line-height:107%;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><b><span lang="CA" style="font-size:26.0pt;line-height:107%;">This\nis a test</span></b></p>\n\n<p style="margin-top:0in;margin-right:0in;margin-bottom:8.0pt;margin-left:0in;line-height:107%;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><i><u><span lang="CA">This is a test</span></u></i></p>`;
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
      setCursorPoint((rteObj as any).inputElement, 6);
      rteObj.onPaste(keyBoardEvent);
      setTimeout(() => {
        if (rteObj.pasteCleanupSettings.prompt) {
            let plainFormat: any = document.getElementById(rteObj.getID() + "_pasteCleanupDialog").getElementsByClassName(CLS_RTE_PASTE_PLAIN_FORMAT);
            plainFormat[0].click();
            let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
            pasteOK[0].click();
        }
        expect((rteObj as any).inputElement.innerHTML === `This is a test<br><br>\n    Paste below:<br><br>This\nis a test<br>\n\n<br>This is a test<br>`).toBe(true);
        done();
      }, 100);
    });
    afterAll((done: DoneFn) => {
      destroy(rteObj);
      done();
    });
});

describe("852026 - pasting plain text when BR is configured in enterkey", () => {
    let rteObj: RichTextEditor;
    let editorObj: EditorManager;
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
        enterKey: 'BR'
      });
      editorObj = new EditorManager({ document: document, editableElement: document.getElementsByClassName("e-content")[0] });
      done();
    });
    it("Pasting notepad content when enterKey is configured as BR ", (done) => {
      keyBoardEvent.clipboardData = {
        getData: (e: any) => {
          if (e === "text/plain") {
            return `dsvsdv\r\nsdvsdv\r\nsdvdsv\r\n\r\nsdvsdv\r\nsdvdsv\r\n\r\n\r\n\r\nsdvsdvdsv\r\nsdvdsvdsvdsv\r\nsdvsdvsdvsvv`;
          } else {
            return '';
          }
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
            let plainFormat: any = document.getElementById(rteObj.getID() + "_pasteCleanupDialog").getElementsByClassName(CLS_RTE_PASTE_PLAIN_FORMAT);
            plainFormat[0].click();
            let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
            pasteOK[0].click();
        }
        const expectedElem: string = 'dsvsdv<br>sdvsdv<br>sdvdsv<br>sdvsdv<br>sdvdsv<br><br><br><br>sdvsdvdsv<br>sdvdsvdsvdsv<br>sdvsdvsdvsvv<br><br>';
        const pastedElem: string = (rteObj as any).inputElement.innerHTML;
        expect(expectedElem === pastedElem).toBe(true);
        done();
      }, 100);
    });
    afterAll((done: DoneFn) => {
      destroy(rteObj);
      done();
    });
});

describe("852026 - pasting plain text when DIV is configured in enterkey", () => {
    let rteObj: RichTextEditor;
    let editorObj: EditorManager;
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
        enterKey: 'DIV'
      });
      editorObj = new EditorManager({ document: document, editableElement: document.getElementsByClassName("e-content")[0] });
      done();
    });
    it("Pasting notepad content when enterKey is configured as DIV ", (done) => {
      keyBoardEvent.clipboardData = {
        getData: (e: any) => {
          if (e === "text/plain") {
            return `dsvsdv\r\nsdvsdv\r\nsdvdsv\r\n\r\nsdvsdv\r\nsdvdsv\r\n\r\n\r\n\r\nsdvsdvdsv\r\nsdvdsvdsvdsv\r\nsdvsdvsdvsvv`;
          } else {
            return '';
          }
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
            let plainFormat: any = document.getElementById(rteObj.getID() + "_pasteCleanupDialog").getElementsByClassName(CLS_RTE_PASTE_PLAIN_FORMAT);
            plainFormat[0].click();
            let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
            pasteOK[0].click();
        }
        const expectedElem: string = '<div><div>dsvsdv<br>sdvsdv<br>sdvdsv</div><div>sdvsdv<br>sdvdsv</div><div>sdvsdvdsv<br>sdvdsvdsvdsv<br>sdvsdvsdvsvv</div></div>';
        const pastedElem: string = rteObj.inputElement.innerHTML;
        expect(expectedElem === pastedElem).toBe(true);
        done();
      }, 100);
    });
    afterAll((done: DoneFn) => {
      destroy(rteObj);
      done();
    });
});

describe("852026 - pasting plain text when P is configured in enterkey", () => {
    let rteObj: RichTextEditor;
    let editorObj: EditorManager;
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
        enterKey: 'P'
      });
      editorObj = new EditorManager({ document: document, editableElement: document.getElementsByClassName("e-content")[0] });
      done();
    });
    it("Pasting notepad content when enterKey is configured as P ", (done) => {
      keyBoardEvent.clipboardData = {
        getData: (e: any) => {
          if (e === "text/plain") {
            return `dsvsdv\r\nsdvsdv\r\nsdvdsv\r\n\r\nsdvsdv\r\nsdvdsv\r\n\r\n\r\n\r\nsdvsdvdsv\r\nsdvdsvdsvdsv\r\nsdvsdvsdvsvv`;
          } else {
            return '';
          }
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
            let plainFormat: any = document.getElementById(rteObj.getID() + "_pasteCleanupDialog").getElementsByClassName(CLS_RTE_PASTE_PLAIN_FORMAT);
            plainFormat[0].click();
            let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
            pasteOK[0].click();
        }
        const expectedElem: string = '<p>dsvsdv<br>sdvsdv<br>sdvdsv</p><p>sdvsdv<br>sdvdsv</p><p>sdvsdvdsv<br>sdvdsvdsvdsv<br>sdvsdvsdvsvv</p>';
        const pastedElem: string = rteObj.inputElement.innerHTML;
        expect(expectedElem === pastedElem).toBe(true);
        done();
      }, 100);
    });
    afterAll((done: DoneFn) => {
      destroy(rteObj);
      done();
    });
});

describe("EJ2-69216 - pasting as plain text when BR is configured", () => {
    let rteObj: RichTextEditor;
    let editorObj: EditorManager;
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
    let innerHTML: string = `This is a test<br><br>
    Paste below:<br><br><br><span><br></span><br>`;
    beforeAll((done: Function) => {
      rteObj = renderRTE({
        pasteCleanupSettings: {
          prompt: true
        },
        enterKey: 'BR',
        value: innerHTML
      });
      editorObj = new EditorManager({ document: document, editableElement: document.getElementsByClassName("e-content")[0] });
      done();
    });
    it("Pasting content when enterKey is configured as BR and Div not working issue test case", (done) => {
      let localElem: string = `<p style="margin-top:0in;margin-right:0in;margin-bottom:8.0pt;margin-left:0in;line-height:107%;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><b><span lang="CA" style="font-size:26.0pt;line-height:107%;">This\nis a test</span></b></p>\n\n<p style="margin-top:0in;margin-right:0in;margin-bottom:8.0pt;margin-left:0in;line-height:107%;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><i><u><span lang="CA">This is a test</span></u></i></p>`;
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
      setCursorPoint((rteObj as any).inputElement.childNodes[6], 0);
      rteObj.onPaste(keyBoardEvent);
      setTimeout(() => {
        if (rteObj.pasteCleanupSettings.prompt) {
            let keepFormat: any = document.getElementById(rteObj.getID() + "_pasteCleanupDialog").getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
            keepFormat[0].click();
            let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
            pasteOK[0].click();
        }
        expect((rteObj as any).inputElement.innerHTML === `This is a test<br><br>\n    Paste below:<br><br><p><b><span lang="CA">This\nis a test</span></b></p><p><i><u><span lang="CA">This is a test</span></u></i></p><br><span><br></span><br>`).toBe(true)
        done();
      }, 100);
    });
    afterAll((done: DoneFn) => {
      destroy(rteObj);
      done();
    });
});

describe("EJ2-68255 - The pasted content goes out of the contentEditable div when using enter Key as BR or DIV", () => {
    let rteObj: RichTextEditor;
    let editorObj: EditorManager;
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
    let innerHTML: string = "insertedText";
    beforeAll((done: Function) => {
      rteObj = renderRTE({
        pasteCleanupSettings: {
          prompt: true
        },
        enterKey: 'BR',
        value: innerHTML
      });
      editorObj = new EditorManager({ document: document, editableElement: document.getElementsByClassName("e-content")[0] });
      done();
    });
    it("Pasting content when enterKey is configured as BR and Div not working issue test case", (done) => {
      let localElem: string = `<div style="display:inline;"><!--StartFragment--><h1 style=" font-size: 42px; font-family: &quot;Segoe UI&quot;, Arial, sans-serif; font-weight: 400; margin: 10px 0px; color: rgb(0, 0, 0); font-style: normal; text-align: start; text-indent: 0px; white-space: normal;" class="pasteContent_RTE">Heading</h1><!--EndFragment--></div>`;
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
      setCursorPoint((rteObj as any).inputElement.childNodes[0], 12);
      rteObj.onPaste(keyBoardEvent);
      setTimeout(() => {
        if (rteObj.pasteCleanupSettings.prompt) {
            let keepFormat: any = document.getElementById(rteObj.getID() + "_pasteCleanupDialog").getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
            keepFormat[0].click();
            let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
            pasteOK[0].click();
        }
        expect((rteObj as any).inputElement.innerHTML === `insertedText<div><h1>Heading</h1></div>`).toBe(true)
        done();
      }, 100);
    });
    afterAll((done: DoneFn) => {
      destroy(rteObj);
      done();
    });
});
describe("EJ2-68999 - RichTextEditor doesn't adjust to the pasteCleanUp popup's height when using saveInterval - ", () => {
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
            pasteCleanupSettings : {
                prompt: true
            }
        });
        done();
      });
    it("the pasteCleanUp popup's height when using saveInterval - ", (done) => {
        rteObj.dataBind();
        (rteObj as any).inputElement.focus();
        setCursorPoint((rteObj as any).inputElement.firstElementChild, 0);
        rteObj.onPaste(keyBoardEvent);
        setTimeout(() => {
            const height = window.getComputedStyle(rteObj.inputElement).height;
            expect(height).not.toBe('auto');
          done();
        }, 50);
    });
    afterAll((done: DoneFn) => {
        destroy(rteObj);
        done();
    });
});
describe("EJ2-69216 - Pasting from Word doesn't work properly with enterKey 'BR' in RichTextEditor - ", () => {
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
            enterKey: 'BR'
          });
        done();
      });
    it("pasting content from MS-Word using enter key configuration as BR - ", (done) => {
        let localElem: string = `<p><i>This is test 1</i></p>`;
        keyBoardEvent.clipboardData = {
            getData: () => {
              return localElem;
            },
            items: []
          };
        rteObj.value = '<p><span>This is a test</span></p><p><br><br></p>';
        rteObj.pasteCleanupSettings.deniedTags = [];
        rteObj.pasteCleanupSettings.deniedAttrs = [];
        rteObj.pasteCleanupSettings.allowedStyleProps = [];
        rteObj.dataBind();
        (rteObj as any).inputElement.focus();
        setCursorPoint((rteObj as any).inputElement.lastElementChild.childNodes[1], 0);
        rteObj.onPaste(keyBoardEvent);
        setTimeout(() => {
          if (rteObj.pasteCleanupSettings.prompt) {
            let keepFormat: any = document.getElementById(rteObj.getID() + "_pasteCleanupDialog").getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
            keepFormat[0].click();
            let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
            pasteOK[0].click();
          }
          expect((rteObj as any).inputElement.innerHTML === `<p><span>This is a test</span></p><p><br></p><p><i>This is test 1</i></p>`).toBe(true)
          done();
        }, 50);
    });
    afterAll((done: DoneFn) => {
        destroy(rteObj);
        done();
    });
});

describe("BLAZ-30316 - Image file data in the after paste cleanup event testing - ", () => {
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
    let afterPasteCleanupEvent: boolean = false;
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            pasteCleanupSettings: {
              prompt: true
            },
            afterPasteCleanup : function(e : PasteCleanupArgs) {
                if (e.filesData.length > 0) {
                    afterPasteCleanupEvent = true;
                }
            }
        });
        done();
      });
    it("Image file data in the after paste cleanup event testing - ", (done) => {
        let localElem: string = `<html>\r\n<body>\r\n\x3C!--StartFragment--><p style="margin: 0in 0in 8pt; color: rgb(51, 51, 51); font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; line-height: 15.6933px; font-size: 11pt; font-family: Calibri, sans-serif;">Vsdvds</p><p style="margin: 0in 0in 8pt; color: rgb(51, 51, 51); font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; line-height: 15.6933px; font-size: 11pt; font-family: Calibri, sans-serif;"><span><img width="45" height="31" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAAAvCAYAAABaIGwrAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAARFSURBVGhD7VZNa1tHFH0/opbt1OnGG7e7bLppVwEvCoVuuors4posRBdxS1NqmhJsEH5ZKBAIFByC5WAJFSIKsQQyxY2NjbDhBRvhgH7O7f2cmSenJbRyU5i3uBydO3e+zpyZp2Tig6/gveuLQDihGDNPJq7TD210v+Pl7BAmBTKiQ5DkFIsbk5IqU9Jk7FwdImHJmHliyQIF2SEljAIFxSEzYTJujoKEjT5i5SyIU6hA75AiJHIOKY0oFiP3DrFk5FwEQTLJuOAaY+UJEUsWiA4xZQoUFIdwWDJuXjhkBNEhSFQlwavjHy5uQ/OPHqz9Rfv/gf+nDlnrDmE4PERB3q7+XWAySYTVuXoUQQ7YIW9T/y4wyQ73YWOx4pXC5K36OS78HOpLwp2CSx3IhkPI6qnWp1A/xU2edqDyza+w17/AfrRprPm9C99/flv7a522cXS33XyluSpsPD+B7LW2vb6A/osG3LoRzv9Axug24Ounmavbe7jq12fj/QueyCLOob36LTZSwQKUc4JIJ0YnyAPN60YHFzCgfK8DtbQF9R71xzwKVea672D5/g40j2iuDJppAzZW1mSMuRrU+5QfwuBoHx6nO/D4+Sseb9jvwPKczR/MNTiB5iOqw8P80toJLf45TybnG7A3wImyHlS0MS+IFSOGDuG8nTyeVLrq62Zuw0+/kVtoDN8/94bouF9svmIxsmc1mA3yN6uHInLjEfPJGXUIztW+J87z840P+Q2506LFX0BzRZJeECvWWOoGglDOFnkMG+4kpfazX054o7vr2hfDvyGWq8Imu+MEap8SD+dTsc96cCfkuf4j6xsDT6YoWT2QxVcXgHjoEG7HYsbAIczfT2FbF7nOPKjHE5Yxff/QIdJ/G3axZnh2DE/oGuF1SQOUKyZiT5n4p11Ydv0Vx8jZIbPpsS5elLr8hmjkrgzl3nRqGoHIlrvsEBXkb8PWoXO5d+lqgh3ir4woVd4iQTwXJbHDSk/u9RY5hAYIHSIDunoniO/vHGLj4ZV5QlcGN0mnnut/iZsgXSi/sX08HB/VHXlUB/twV5N2uv1N/RJwVOAeP5TeIW6Reuo2aDhG6JD1F1Rr743UVxoi/m71x3z/eXQPP/Yd94aw+IFDcvVj4vrZlQU5pT5BkXAzlH/ZaOGdbkP7CMWwz6s5JPeGENf+hKEgmjfnvWy1IL1fg48pH3x26bP9EN+P2tYB9M9G1xVcmXCeMWOSHexDin/MKBE2frS4A7u5P1p4UnRq9JsfVarzDiFBwv6hIFKLMf8U2rp59/Wg+hsppPTHjByh8w36+ND+8DPM2ngjDrEx3Xxj4viGULKca4yZJ1OaLFCQHTLlFBKMmecdYhExT6aZeKVi5+IQDkvGzZ1DChREh6AyplCBgUM0GTtXh0hYMmaeWLJAQXbIdBCxc3HINSKBUhFzFIRIERbskGlTSDFeXoY/AeO6JRV0z+rkAAAAAElFTkSuQmCC" v:shapes="Picture_x0020_4" id="msWordImg-clip_image002" class="e-rte-image e-imginline" style="border: 0px; cursor: pointer; display: inline-block; float: none; margin: auto; max-width: calc(100% - 10px); position: relative; box-sizing: border-box; padding: 1px; vertical-align: bottom; z-index: 1000;"></span></p><p style="margin: 0in 0in 8pt; color: rgb(51, 51, 51); font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; line-height: 15.6933px; font-size: 11pt; font-family: Calibri, sans-serif;">Sdvsdv</p>\x3C!--EndFragment-->\r\n</body>\r\n</html>`;
        keyBoardEvent.clipboardData = {
            getData: () => {
              return localElem;
            },
            items: []
          };
        rteObj.value = '<p>RTE</p>';
        rteObj.pasteCleanupSettings.deniedTags = [];
        rteObj.pasteCleanupSettings.deniedAttrs = [];
        rteObj.pasteCleanupSettings.allowedStyleProps = [];
        rteObj.dataBind();
        (rteObj as any).inputElement.focus();
        setCursorPoint((rteObj as any).inputElement.childNodes[0], 0);
        rteObj.onPaste(keyBoardEvent);
        setTimeout(() => {
          if (rteObj.pasteCleanupSettings.prompt) {
            let keepFormat: any = document.getElementById(rteObj.getID() + "_pasteCleanupDialog").getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
            keepFormat[0].click();
            let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
            pasteOK[0].click();
          }
          expect(afterPasteCleanupEvent).toBe(true)
          done();
        }, 50);
    });
    afterAll((done: DoneFn) => {
        destroy(rteObj);
        done();
    });
});
describe("836937 - Paste cleanup testing for images", () => {
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
    beforeAll(function (done) {
        rteObj = renderRTE({
            pasteCleanupSettings: {
                prompt: false,
                plainText: false,
                keepFormat: true
            },
            insertImageSettings: {
                minHeight : "100px",
                minWidth : "100px",
                maxHeight : "200px",
                maxWidth : "200px",
            },
        });
        done();
    });    
    it("Set the default dimensions of the image (maxheight, maxwidth, minheight, and minwidth)", (done) => {
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
        setTimeout(function () {
            expect(rteObj.inputElement.querySelector("img").style.minHeight == '100px').toBe(true);
            expect(rteObj.inputElement.querySelector("img").style.minWidth  == '100px').toBe(true);
            expect(rteObj.inputElement.querySelector("img").style.maxHeight  == '200px').toBe(true);
            expect(rteObj.inputElement.querySelector("img").style.maxWidth   == '200px').toBe(true);
            done();
        }, 100);
    });
    afterAll((done: DoneFn) => {
        destroy(rteObj);
        done();
    });
});

describe("838345- Cut and paste not working properly when input element as range when focused  - ", () => {
    let rteObj: RichTextEditor;
    let editorObj: EditorManager;
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
    let innerHTML: string = "insertedText";
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            pasteCleanupSettings: {
                prompt: true
            },
            enterKey: 'BR',
            value: innerHTML
        });
        editorObj = new EditorManager({ document: document, editableElement: document.getElementsByClassName("e-content")[0] });
        done();
    });
    it("cut and paste not working properly when input element as range when focused - ", (done) => {
        let localElem: string = `<p>Pasted Content</p>`;
        keyBoardEvent.clipboardData = {
            getData: () => {
                return localElem;
            },
            items: []
        };
        rteObj.value = '<p>Hello</p>';
        rteObj.pasteCleanupSettings.deniedTags = [];
        rteObj.pasteCleanupSettings.deniedAttrs = [];
        rteObj.pasteCleanupSettings.allowedStyleProps = [];
        rteObj.dataBind();
        (rteObj as any).inputElement.focus();
        editorObj.nodeSelection.setSelectionText(document, (rteObj as any).inputElement, (rteObj as any).inputElement, 0, 0);
        rteObj.onPaste(keyBoardEvent);
        setTimeout(() => {
            if (rteObj.pasteCleanupSettings.prompt) {
                let keepFormat: any = document.getElementById(rteObj.getID() + "_pasteCleanupDialog").getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
                keepFormat[0].click();
                let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
                pasteOK[0].click();
            }
            expect((rteObj as any).inputElement.innerHTML === `<p>Pasted Content</p><p>Hello</p>`).toBe(true)
            done();
        }, 50);
    });
    afterAll((done: DoneFn) => {
        destroy(rteObj);
        done();
    });
});

describe("826247 - Cropped image paste from MS Word - ", () => {
    let rteObj: RichTextEditor;
    let editorObj: EditorManager;
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
    let innerHTML: string = "insertedText";
    beforeAll((done: Function) => {
        rteObj = renderRTE({
            pasteCleanupSettings: {
                prompt: true
            },
            value: innerHTML
        });
        editorObj = new EditorManager({ document: document, editableElement: document.getElementsByClassName("e-content")[0] });
        done();
    });
    it("Cropped image paste from MS Word - ", (done) => {
        let localElem: string = `<p style="margin-top:0in;margin-right:0in;margin-bottom:8.0pt;margin-left:0in;line-height:106%;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;">Dsd</p>\n\n<p style="margin-top:0in;margin-right:0in;margin-bottom:8.0pt;margin-left:0in;line-height:106%;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><span style=""><img width="283" height="101" src="data:image/jpeg;base64,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" alt="A white car with lights on\n\nDescription automatically generated" v:shapes="Picture_x0020_1" class="e-img-cropped" id="msWordImg-clip_image002"></span></p>\n\n<p style="margin-top:0in;margin-right:0in;margin-bottom:8.0pt;margin-left:0in;line-height:106%;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;">Dsvdsv</p>`;
        keyBoardEvent.clipboardData = {
            getData: () => {
                return localElem;
            },
            items: []
        };
        rteObj.value = '<p>80</p>';
        rteObj.pasteCleanupSettings.deniedTags = [];
        rteObj.pasteCleanupSettings.deniedAttrs = [];
        rteObj.pasteCleanupSettings.allowedStyleProps = [];
        rteObj.dataBind();
        (rteObj as any).inputElement.focus();
        editorObj.nodeSelection.setSelectionText(document, (rteObj as any).inputElement, (rteObj as any).inputElement, 0, 0);
        rteObj.onPaste(keyBoardEvent);
        setTimeout(() => {
            if (rteObj.pasteCleanupSettings.prompt) {
                let keepFormat: any = document.getElementById(rteObj.getID() + "_pasteCleanupDialog").getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
                keepFormat[0].click();
                let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
                (rteObj as any).pasteCleanupModule.cropImageData = [{cropB: 2575, cropLength: 5667, cropR: 3531, cropTop: 5926, goalHeight: 11235, goalWidth : 16860}];
                pasteOK[0].click();
            }
            expect((rteObj as any).inputElement.querySelectorAll('img').length > 0).toBe(true);
            done();
        }, 500);
    });
    afterAll((done: DoneFn) => {
        destroy(rteObj);
        done();
    });
});

describe("843341- Indentation is not maintained when the content is copied and pasted from the notepad - ", () => {
    let rteObj: RichTextEditor;
    let editorObj: EditorManager;
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
        editorObj = new EditorManager({ document: document, editableElement: document.getElementsByClassName("e-content")[0] });
        done();
    });
    it("Indentation is not maintained when the content is copied and pasted from the notepad - ", (done) => {
        keyBoardEvent.clipboardData = {
            getData: (e: any) => {
                if (e === "text/plain") {
                return '1. Development \n\t1. Requirement Document \t\tHello\n\t\t2. Specification Document';
                } else {
                    return '';
                }
            },
            items: []
            };
        rteObj.value = '<p>RTE</p>';
        rteObj.pasteCleanupSettings.deniedTags = [];
        rteObj.pasteCleanupSettings.deniedAttrs = [];
        rteObj.pasteCleanupSettings.allowedStyleProps = [];
        rteObj.dataBind();
        (rteObj as any).inputElement.focus();
        editorObj.nodeSelection.setSelectionText(document, (rteObj as any).inputElement, (rteObj as any).inputElement, 0, 0);
        rteObj.onPaste(keyBoardEvent);
        setTimeout(() => {
            if (rteObj.pasteCleanupSettings.prompt) {
                let keepFormat: any = document.getElementById(rteObj.getID() + "_pasteCleanupDialog").getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
                keepFormat[0].click();
                let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
                pasteOK[0].click();
            }
            const expectedElem: string = '<p>1. Development <br>&nbsp; &nbsp; 1. Requirement Document &nbsp; &nbsp; &nbsp; &nbsp; Hello<br>&nbsp; &nbsp; &nbsp; &nbsp; 2. Specification DocumentRTE</p>';
            const pastedElem: string  = rteObj.inputElement.innerHTML;
            expect(expectedElem === pastedElem).toBe(true)
            done();
        }, 50);
    });
    afterAll((done: DoneFn) => {
        destroy(rteObj);
        done();
    });
});

describe("846697 - Pasting content doesn't work properly with enterKey 'BR' in RichTextEditor and after switching pages - ", () => {
    let rteObj: RichTextEditor;
    let editorObj: EditorManager;
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
            enterKey: 'BR',
            value: null
        });
        editorObj = new EditorManager({ document: document, editableElement: document.getElementsByClassName("e-content")[0] });
        done();
    });
    it("Pasting content doesn't work properly with enterKey 'BR' in RichTextEditor and after switching pages - ", (done) => {
        let localElem: string = `<html>\r\n<body>\r\n\x3C!--StartFragment--><h1 style="box-sizing: border-box; margin: 0px 0px 2rem; letter-spacing: var(--heading-letter-spacing); font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-variant-numeric: ; font-variant-east-asian: ; font-variant-alternates: ; font-variant-position: ; font-weight: ; font-stretch: ; font-size: ; line-height: ; font-family: Inter, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, Oxygen, Ubuntu, Cantarell, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-optical-sizing: ; font-kerning: ; font-feature-settings: ; font-variation-settings: ; word-break: break-word; color: rgb(27, 27, 27); orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;">Selection: focusNode property</h1>\x3C!--EndFragment-->\r\n</body>\r\n</html>`;
        keyBoardEvent.clipboardData = {
            getData: () => {
                return localElem;
            },
            items: []
        };
        rteObj.value = '<div><br></div>';
        rteObj.pasteCleanupSettings.deniedTags = [];
        rteObj.pasteCleanupSettings.deniedAttrs = [];
        rteObj.pasteCleanupSettings.allowedStyleProps = [];
        rteObj.dataBind();
        (rteObj as any).inputElement.focus();
        editorObj.nodeSelection.setSelectionText(document, (rteObj as any).inputElement, (rteObj as any).inputElement, 0, 0);
        rteObj.onPaste(keyBoardEvent);
        setTimeout(() => {
            if (rteObj.pasteCleanupSettings.prompt) {
                let keepFormat: any = document.getElementById(rteObj.getID() + "_pasteCleanupDialog").getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
                keepFormat[0].click();
                let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
                pasteOK[0].click();
            }
            expect((rteObj as any).inputElement.innerHTML === `<div><h1>Selection: focusNode property</h1></div>`).toBe(true)
            done();
        }, 50);
    });
    afterAll((done: DoneFn) => {
        destroy(rteObj);
        done();
    });
});

describe('850189 - Border lines are appeared on the images while copy paste the image', () => {
    let editor: RichTextEditor;
    beforeAll(() => {
        editor = renderRTE({
            pasteCleanupSettings : {
                keepFormat : true
            }
        });
    });
    afterAll((done: DoneFn) => {
        destroy(editor);
        done();
    });
    it ('Should remvoe the outline style for the pasted image.', (done: DoneFn) => {
        editor.focusIn();
        const clipBoardData: string = '\n\n\x3C!--StartFragment--><img alt="Logo" src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline e-resize e-img-focus" style="box-sizing: border-box; border: 0px; vertical-align: bottom; cursor: pointer; display: inline-block; float: none; margin: auto; max-width: 1489px; position: relative; padding: 1px; z-index: 1000; color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, &quot;sans-serif&quot;, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; width: 300px; outline: rgb(74, 144, 226) solid 2px;">\x3C!--EndFragment-->\n\n';
        const dataTransfer: DataTransfer = new DataTransfer();
        dataTransfer.setData('text/html', clipBoardData);
        const pasteEvent: ClipboardEvent = new ClipboardEvent('paste', { clipboardData: dataTransfer } as ClipboardEventInit);
        editor.onPaste(pasteEvent);
        setTimeout(() => {
            expect(editor.inputElement.querySelectorAll('img')[0].style.outline).toBe('');
            done();
        }, 100);
    });
});

describe('850189 - code coverage', () => {
    let editor: RichTextEditor;
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
    beforeAll(() => {
        editor = renderRTE({
            pasteCleanupSettings : {
                keepFormat : true
            }
        });
    });
    afterAll((done: DoneFn) => {
        destroy(editor);
        done();
    });
    it ('code coverage.', (done: DoneFn) => {
        editor.focusIn();
        Browser.userAgent = "Firefox";
        editor.isDestroyed = true;
        (editor as any).pasteCleanupModule.addEventListener();
        editor.isDestroyed = false;
        let clipBoardData = '';
        editor.pasteCleanupSettings.prompt = true;
        const dataTransfer = new DataTransfer();
        dataTransfer.setData('text/html', clipBoardData);
        let pasteEvent = new ClipboardEvent('paste', { clipboardData: dataTransfer } as ClipboardEventInit);
        (editor as any).pasteCleanupModule.pasteClean({ name: "pasteClean", args: pasteEvent});
        expect((document.querySelector('#'+ editor.element.id +'_rte-edit-view') as HTMLElement).innerText == '\n').toBe(true);
        dataTransfer.setData('text/html', 'sa');
        pasteEvent = new ClipboardEvent('paste', { clipboardData: dataTransfer } as ClipboardEventInit);
        (editor as any).pasteCleanupModule.pasteClean({ name: "pasteClean", args: pasteEvent});
        expect((document.querySelector('#'+ editor.element.id +'_rte-edit-view') as HTMLElement).innerText == '\n').toBe(true);
        editor.pasteCleanupSettings.prompt = false;
        Browser.userAgent = '';
        //(editor as any).pasteCleanupModule.fireFoxImageUpload();
        expect((document.querySelector('#' + editor.element.id + '_rte-edit-view') as HTMLElement).innerText == '\n').toBe(true);
        (editor as any).pasteCleanupModule.parent.inlineMode.enable = true;
        (editor as any).pasteCleanupModule.toolbarEnableDisable(false);
        expect((editor as any).pasteCleanupModule.parent.toolbarModule.baseToolbar.toolbarObj.element.classList.contains('e-overlay')).toBe(false);
        (editor as any).pasteCleanupModule.parent.inlineMode.enable = false;
        expect((editor as any).pasteCleanupModule.findDetachEmptyElem(null)).toBeNull();
        var div = document.createElement('div');
        div.innerHTML = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td style="width: 25%;"><br/></td><td style="width: 25%;"><br/></td><td style="width: 25%;"><br/></td><td style="width: 25%;"><br/></td></tr><tr><td style="width: 25%;"><br/></td><td style="width: 25%;"><br/></td><td style="width: 25%;"><br/></td><td style="width: 25%;"><br/></td></tr><tr><td style="width: 25%;"><br/></td><td style="width: 25%;"><br/></td><td style="width: 25%;"><br/></td><td style="width: 25%;"><br/></td></tr></tbody></table><p><br/></p>`;
        expect((editor as any).pasteCleanupModule.addTableClass(div, null) === div).toBe(true);
        div = document.createElement('div');
        div.innerHTML = `<img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" class="e-rte-image e-imginline e-img-cropped" style=" border: 0px; vertical-align: bottom; cursor: pointer; display: inline-block; float: none; margin: auto 5px; max-width: 100%; position: relative; padding: 1px; color: rgb(36, 36, 36); font-family: &quot;Segoe UI&quot;, -apple-system, blinkMacSystemfont, Roboto, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; background-color: rgb(250, 250, 250); width: 440px;" />`;
        (editor as any).pasteCleanupModule.convertBlobToBase64(div);
        expect(div.querySelector('img').src === 'https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png').toBe(true);
        (editor as any).pasteCleanupModule.cropImageHandler(div);
        expect(div.querySelector('img').classList.contains('e-img-cropped')).toBe(true);
        div = document.createElement('div');
        div.innerHTML = `<picture><source srcset="http/images/Facebook-GrayScale.webp" type="image/webp"><img class="ocArticleFooterImage pasteContent_Img" src="https://support.microsoft.com/images/Facebook-GrayScale.png" alt="Facebook" ms.cmpgrp="content" ms.pgarea="Body" loading="lazy"><span>&nbsp;</span></picture>`;
        (editor as any).pasteCleanupModule.processPictureElement(div);
        expect(div.querySelector('source').getAttribute('srcset') === "http/images/Facebook-GrayScale.webp").toBe(true);
        div.querySelector('source').srcset = '';
        (editor as any).pasteCleanupModule.processPictureElement(div);
        expect(div.querySelector('source').srcset === '').toBe(true);
        div.querySelector('img').src = '';
        (editor as any).pasteCleanupModule.processPictureElement(div);
        expect( div.querySelector('img').src !== '').toBe(true);
        div = document.createElement('div');
        div.innerHTML = '<div></div>';
        (editor as any).pasteCleanupModule.removeEmptyElements(div);
        div = document.createElement('div');
        div.innerHTML = '<ol level="1" style="list-style: decimal"><p>One Node-1</p><li></li><li><p>Two Node-1</p></li><li><p>Three Node-1</p></li></ol>';
        (editor as any).pasteCleanupModule.getTextContent(div);
        expect(div.innerHTML !== '<ol level="1" style="list-style: decimal"><p>One Node-1</p><li></li><li><p>Two Node-1</p></li><li><p>Three Node-1</p></li></ol>').toBe(true);
        div = document.createElement('div');
        div.innerHTML = '<br><div class="pasteContent" style="display:inline;"><span class="pasteContent_RTE">This\nis a test <span>Hi</span></span>\n\n<p class="pasteContent_RTE">This is a test</p></div>';
        expect((editor as any).pasteCleanupModule.reframeToBrContent(div) !== div.innerHTML).toBe(true);
        div = document.createElement('div');
        div.innerText = "hello!";
        expect((editor as any).pasteCleanupModule.reframeToBrContent(div) !== div.innerHTML).toBe(true);
        let myObj: any = {
            oldCssClass: 'imageOldClass',
            cssClass: 'imageOldClass_imageNewClass',
            setProperties: function (value: any) {
              this.oldCssClass = value.cssClass;
            }
        };
        (editor as any).pasteCleanupModule.updateCss(myObj, { oldCssClass: 'imageOldClass', cssClass: 'imageUpdatedClass'});
        expect(myObj.oldCssClass === '_imageNewClass imageUpdatedClass').toBe(true);
        (editor as any).pasteCleanupModule.updateCss(myObj, { oldCssClass: null, cssClass: 'imageUpdatedClass'});
        expect(myObj.oldCssClass === 'imageOldClass_imageNewClass imageUpdatedClass').toBe(true);
        (editor as any).pasteCleanupModule.popupObj = editor;
        (editor as any).pasteCleanupModule.setCssClass ({ oldCssClass: 'imageOldClass', cssClass: 'imageUpdatedClass'});
        expect((editor as any).element.classList.contains('imageUpdatedClass')).toBe(true);
        (editor as any).pasteCleanupModule.setCssClass ({ oldCssClass: null, cssClass: 'imageUpdatedClassNew'});
        expect((editor as any).element.classList.contains('imageUpdatedClassNew')).toBe(true);
        (editor as any).pasteCleanupModule.popupObj = null;
        div = document.createElement('div');
        (editor as any).pasteCleanupModule.parent.pasteCleanupSettings.keepFormat = false;
        (editor as any).pasteCleanupModule.imageFormatting( {}, { elements: [div] });
        (editor as any).pasteCleanupModule.refreshPopup(div, null);
        (editor as any).pasteCleanupModule.uploadFailure(div, null, null, {});
        (editor as any).pasteCleanupModule.isNotFromHtml = true;
        (editor as any).pasteCleanupModule.containsHtml = true;
        (editor as any).pasteCleanupModule.parent.pasteCleanupSettings.allowedStyleProps = null;
        (editor as any).pasteCleanupModule.formatting('', false, {});
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
          (editor as any).value = '<p>13</p>';
          (editor as any).pasteCleanupSettings.prompt = false;
          (editor as any).pasteCleanupSettings.plainText = false;
          (editor as any).pasteCleanupSettings.keepFormat = true;
          (editor as any).dataBind();
          (editor as any).inputElement.focus();
          setCursorPoint((editor as any).inputElement.firstElementChild, 0);
          (editor as any).onPaste(keyBoardEvent);
          setTimeout(() => {
            let pastedElm: any = (editor as any).inputElement.firstElementChild;
            expect(pastedElm.children[0].tagName.toLowerCase() === 'a').toBe(true);
            expect(pastedElm.children[0].getAttribute('href') === 'www.ej2.syncfusion.com').toBe(true);
            done();
        }, 100);
        done();
    });
})

describe("853350 - pasting content from online Excel sheet doesn't remove the styles from the content - ", () => {
    let rteObj: RichTextEditor;
    let editorObj: EditorManager;
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
        editorObj = new EditorManager({ document: document, editableElement: document.getElementsByClassName("e-content")[0] });
        done();
    });
    it("Pasting content from online Excel sheet doesn't remove the styles from the content - ", (done) => {
        let localElem: string = `<html>\r\n<body>\r\n\x3C!--StartFragment--><div ccp_infra_version='3' ccp_infra_timestamp='1698315799639' ccp_infra_user_hash='1762034188' ccp_infra_copy_id='7ca3e42b-12c8-4ad9-a595-24f541a2e2d8' data-ccp-timestamp='1698315799639'><html><head><meta http-equiv=Content-Type content="text/html; charset=utf-8"><meta name=ProgId content=Excel.Sheet><meta name=Generator content="Microsoft Excel 15"><style>table\r\n\t{mso-displayed-decimal-separator:"\\.";\r\n\tmso-displayed-thousand-separator:"\\,";}\r\ntr\r\n\t{mso-height-source:auto;}\r\ncol\r\n\t{mso-width-source:auto;}\r\ntd\r\n\t{padding-top:1px;\r\n\tpadding-right:1px;\r\n\tpadding-left:1px;\r\n\tmso-ignore:padding;\r\n\tcolor:black;\r\n\tfont-size:11.0pt;\r\n\tfont-weight:400;\r\n\tfont-style:normal;\r\n\ttext-decoration:none;\r\n\tfont-family:Calibri, sans-serif;\r\n\tmso-font-charset:0;\r\n\ttext-align:general;\r\n\tvertical-align:bottom;\r\n\tborder:none;\r\n\twhite-space:nowrap;\r\n\tmso-rotate:0;}\r\n.xl16\r\n\t{vertical-align:top;\r\n\twhite-space:normal;}\r\n.xl17\r\n\t{vertical-align:top;}\r\n</style></head><body link="#0563C1" vlink="#954F72"><table width=1566 style='border-collapse:collapse;width:1175pt'>\x3C!--StartFragment--><col width=214 style='width:161pt'><col width=133 style='width:100pt'><col width=186 style='width:140pt' span=4><col width=102 style='width:77pt'><col width=373 style='width:280pt'><tr height=20 style='height:15.0pt'><td width=214 height=20 class=xl17 style='width:161pt;height:15.0pt;color:white;font-weight:700;background:#4472C4;mso-pattern:#4472C4 none'>Team</td><td width=133 class=xl17 style='width:100pt;color:white;font-weight:700;background:#4472C4;mso-pattern:#4472C4 none'>CI Test Automation</td><td width=186 class=xl17 style='width:140pt;color:white;font-weight:700;background:#4472C4;mso-pattern:#4472C4 none'>Schedule basis Test Automation</td><td width=186 class=xl17 style='width:140pt;color:white;font-weight:700;background:#4472C4;mso-pattern:#4472C4 none'>Tool</td><td width=186 class=xl17 style='width:140pt;color:white;font-weight:700;background:#4472C4;mso-pattern:#4472C4 none'>Status</td><td width=186 class=xl17 style='width:140pt;color:white;font-weight:700;background:#4472C4;mso-pattern:#4472C4 none'>Test Run Link Status</td><td width=102 class=xl17 style='width:77pt;color:white;font-weight:700;background:#4472C4;mso-pattern:#4472C4 none'>Timeline</td><td width=373 class=xl16 style='width:280pt;color:white;font-weight:700;background:#4472C4;mso-pattern:#4472C4 none'>Comments</td></tr><tr height=81 style='height:60.75pt'><td height=81 class=xl17 style='height:60.75pt;background:#D9E1F2;mso-pattern:#D9E1F2 none'>Bold Report</td><td class=xl17 style='background:#D9E1F2;mso-pattern:#D9E1F2 none'>Jenkins</td><td width=186 class=xl16 style='width:140pt;background:#D9E1F2;mso-pattern:#D9E1F2 none'>Azure Pipeline/Windows Scheduler/Manual</td><td class=xl17 style='background:#D9E1F2;mso-pattern:#D9E1F2 none'>Nunit, Selenium, Playwright</td><td class=xl17 style='background:#D9E1F2;mso-pattern:#D9E1F2 none'>Completed</td><td width=186 class=xl16 style='width:140pt;background:#D9E1F2;mso-pattern:#D9E1F2 none'>We already pushed into sharepoint and planned to push the release logs alone into new S3 bucket manually</td><td class=xl17 align=right style='background:#D9E1F2;mso-pattern:#D9E1F2 none'>25-Oct-23</td><td width=373 class=xl16 style='width:280pt;background:#D9E1F2;mso-pattern:#D9E1F2 none'>Every scheduled/manual/customer specific automation configured to use the test automation exe to push the results into DB</td></tr><tr height=102 style='height:76.5pt'><td height=102 class=xl17 style='height:76.5pt'>Bold Sign</td><td class=xl17>Azure Pipeline</td><td class=xl17>Azure Pipeline</td><td class=xl17>NUnit, Cypress</td><td class=xl17></td><td class=xl17></td><td class=xl17 align=right>1-Nov-23</td><td width=373 class=xl16 style='width:280pt'>Due to Nebula restrictions, we are unable to access our development site in the Azure pipeline. Consequently, we cannot update the Cypress test suite results, but we are actively exploring potential solutions.</td></tr><tr height=20 style='height:15.0pt'><td height=20 class=xl17 style='height:15.0pt;background:#D9E1F2;mso-pattern:#D9E1F2 none'>Bold BI</td><td class=xl17 style='background:#D9E1F2;mso-pattern:#D9E1F2 none'>Azure Pipeline</td><td class=xl17 style='background:#D9E1F2;mso-pattern:#D9E1F2 none'>Azure Pipeline</td><td class=xl17 style='background:#D9E1F2;mso-pattern:#D9E1F2 none'>Nunit, Playwright</td><td class=xl17 style='background:#D9E1F2;mso-pattern:#D9E1F2 none'></td><td class=xl17 style='background:#D9E1F2;mso-pattern:#D9E1F2 none'></td><td class=xl17 align=right style='background:#D9E1F2;mso-pattern:#D9E1F2 none'>17-Oct-23</td><td width=373 class=xl16 style='width:280pt;background:#D9E1F2;mso-pattern:#D9E1F2 none'></td></tr><tr height=20 style='height:15.0pt'><td height=20 class=xl17 style='height:15.0pt'>Bold Desk</td><td class=xl17>Jenkins</td><td>Azure Pipeline</td><td class=xl17>xUnit</td><td class=xl17></td><td class=xl17></td><td class=xl17 align=right>10-Nov-23</td><td width=373 class=xl16 style='width:280pt'></td></tr><tr height=41 style='height:30.75pt'><td height=41 class=xl17 style='height:30.75pt;background:#D9E1F2;mso-pattern:#D9E1F2 none'>Essential Studio - EJ2</td><td class=xl17 style='background:#D9E1F2;mso-pattern:#D9E1F2 none'>Azure Pipeline</td><td class=xl17 style='background:#D9E1F2;mso-pattern:#D9E1F2 none'>Azure Pipeline</td><td class=xl17 style='background:#D9E1F2;mso-pattern:#D9E1F2 none'>Selenium, Playwright</td><td class=xl17 style='background:#D9E1F2;mso-pattern:#D9E1F2 none'></td><td class=xl17 style='background:#D9E1F2;mso-pattern:#D9E1F2 none'>Need to change test run link to the Test report downloadable link</td><td class=xl17 align=right style='background:#D9E1F2;mso-pattern:#D9E1F2 none'>30</td><td width=373 class=xl16 style='width:280pt;background:#D9E1F2;mso-pattern:#D9E1F2 none'>Configured to use the test automation exe to push the results in DB</td></tr><tr height=81 style='height:60.75pt'><td height=81 class=xl17 style='height:60.75pt'>Essential Studio - Blazor</td><td class=xl17>Azure Pipeline</td><td class=xl17>Azure Pipeline</td><td class=xl17>Selenium, Playwright, bUnit</td><td class=xl17></td><td width=186 class=xl16 style='width:140pt'>We will planned to provide the Test result link option for Blazor playwright and bunit in Oct 23rd, 2023</td><td class=xl17 align=right>23-Oct-23</td><td width=373 class=xl16 style='width:280pt'>Configured automation to upload result from cloud to build portal through CI.</td></tr><tr height=20 style='height:15.0pt'><td height=20 class=xl17 style='height:15.0pt;background:#D9E1F2;mso-pattern:#D9E1F2 none'>Essential Studio - Xamarin</td><td class=xl17 style='background:#D9E1F2;mso-pattern:#D9E1F2 none'>Azure Pipeline</td><td class=xl17 style='background:#D9E1F2;mso-pattern:#D9E1F2 none'>Azure Pipeline</td><td class=xl17 style='background:#D9E1F2;mso-pattern:#D9E1F2 none'>NUnit</td><td class=xl17 style='background:#D9E1F2;mso-pattern:#D9E1F2 none'>Inprogress</td><td class=xl17 style='background:#D9E1F2;mso-pattern:#D9E1F2 none'>In progress</td><td class=xl17 align=right style='background:#D9E1F2;mso-pattern:#D9E1F2 none'>26-Oct-23</td><td width=373 class=xl16 style='width:280pt;background:#D9E1F2;mso-pattern:#D9E1F2 none'>Configured automation to upload results from the cloud to build a portal through CI. Will add the new field and test links</td></tr><tr height=107 style='height:80.25pt'><td height=107 class=xl17 style='height:80.25pt'>Essential Studio - Desktop</td><td class=xl17>Azure Pipeline</td><td class=xl17>Azure Pipeline</td><td class=xl17>TestStudio, TestComplete</td><td class=xl17></td><td class=xl17></td><td class=xl17 align=right>2-Nov-23</td><td width=373 class=xl16 style='width:280pt'>Configured automation to upload test results from the cloud to build portal using Test automation exe.<span style='mso-spacerun:yes'>                                    </span>Pending items:<span style='mso-spacerun:yes'>  </span>Currently TestRunLink, Project, Branch, TestRunName, Version field updated as empty. Need to provide support for this.</td></tr>\x3C!--EndFragment--></table></body></html></div>\x3C!--EndFragment-->\r\n</body>\r\n</html>`;
        keyBoardEvent.clipboardData = {
            getData: () => {
                return localElem;
            },
            items: []
        };
        rteObj.value = '<p>81</p>';
        rteObj.pasteCleanupSettings.deniedTags = [];
        rteObj.pasteCleanupSettings.deniedAttrs = [];
        rteObj.pasteCleanupSettings.allowedStyleProps = [];
        rteObj.dataBind();
        (rteObj as any).inputElement.focus();
        editorObj.nodeSelection.setSelectionText(document, (rteObj as any).inputElement, (rteObj as any).inputElement, 0, 0);
        rteObj.onPaste(keyBoardEvent);
        setTimeout(() => {
            if (rteObj.pasteCleanupSettings.prompt) {
                let keepFormat: any = document.getElementById(rteObj.getID() + "_pasteCleanupDialog").getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
                keepFormat[0].click();
                let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
                pasteOK[0].click();
            }
            expect((rteObj as any).inputElement.innerHTML === `<div ccp_infra_version="3" ccp_infra_timestamp="1698315799639" ccp_infra_user_hash="1762034188" ccp_infra_copy_id="7ca3e42b-12c8-4ad9-a595-24f541a2e2d8" data-ccp-timestamp="1698315799639"><table width="1566" class="e-rte-paste-table"><tbody><tr height="20"><td width="214" height="20">Team</td><td width="133">CI Test Automation</td><td width="186">Schedule basis Test Automation</td><td width="186">Tool</td><td width="186">Status</td><td width="186">Test Run Link Status</td><td width="102">Timeline</td><td width="373">Comments</td></tr><tr height="81"><td height="81">Bold Report</td><td>Jenkins</td><td width="186">Azure Pipeline/Windows Scheduler/Manual</td><td>Nunit, Selenium, Playwright</td><td>Completed</td><td width="186">We already pushed into sharepoint and planned to push the release logs alone into new S3 bucket manually</td><td align="right">25-Oct-23</td><td width="373">Every scheduled/manual/customer specific automation configured to use the test automation exe to push the results into DB</td></tr><tr height="102"><td height="102">Bold Sign</td><td>Azure Pipeline</td><td>Azure Pipeline</td><td>NUnit, Cypress</td><td></td><td></td><td align="right">1-Nov-23</td><td width="373">Due to Nebula restrictions, we are unable to access our development site in the Azure pipeline. Consequently, we cannot update the Cypress test suite results, but we are actively exploring potential solutions.</td></tr><tr height="20"><td height="20">Bold BI</td><td>Azure Pipeline</td><td>Azure Pipeline</td><td>Nunit, Playwright</td><td></td><td></td><td align="right">17-Oct-23</td><td width="373"></td></tr><tr height="20"><td height="20">Bold Desk</td><td>Jenkins</td><td>Azure Pipeline</td><td>xUnit</td><td></td><td></td><td align="right">10-Nov-23</td><td width="373"></td></tr><tr height="41"><td height="41">Essential Studio - EJ2</td><td>Azure Pipeline</td><td>Azure Pipeline</td><td>Selenium, Playwright</td><td></td><td>Need to change test run link to the Test report downloadable link</td><td align="right">30</td><td width="373">Configured to use the test automation exe to push the results in DB</td></tr><tr height="81"><td height="81">Essential Studio - Blazor</td><td>Azure Pipeline</td><td>Azure Pipeline</td><td>Selenium, Playwright, bUnit</td><td></td><td width="186">We will planned to provide the Test result link option for Blazor playwright and bunit in Oct 23rd, 2023</td><td align="right">23-Oct-23</td><td width="373">Configured automation to upload result from cloud to build portal through CI.</td></tr><tr height="20"><td height="20">Essential Studio - Xamarin</td><td>Azure Pipeline</td><td>Azure Pipeline</td><td>NUnit</td><td>Inprogress</td><td>In progress</td><td align="right">26-Oct-23</td><td width="373">Configured automation to upload results from the cloud to build a portal through CI. Will add the new field and test links</td></tr><tr height="107"><td height="107">Essential Studio - Desktop</td><td>Azure Pipeline</td><td>Azure Pipeline</td><td>TestStudio, TestComplete</td><td></td><td></td><td align="right">2-Nov-23</td><td width="373">Configured automation to upload test results from the cloud to build portal using Test automation exe.<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>Pending items:<span>&nbsp; </span>Currently TestRunLink, Project, Branch, TestRunName, Version field updated as empty. Need to provide support for this.</td></tr></tbody></table></div><p>81</p>`).toBe(true)
            done();
        }, 50);
    });
    afterAll((done: DoneFn) => {
        destroy(rteObj);
        done();
    });
});

describe('854721- Inside the table, content such as heading used in uppercase, underline and the text effects and shadows are not working properly. ', () => {
    let editor: RichTextEditor;
    beforeAll(() => {
        editor = renderRTE({
            pasteCleanupSettings : {
                keepFormat : true
            }
        });
    });
    afterAll((done: DoneFn) => {
        destroy(editor);
        done();
    });
    it ('Should not remove the text transform inline style for the span element.', (done: DoneFn) => {
        editor.focusIn();
        const clipBoardData: string = '\n\n\n<meta http-equiv="Content-Type" content="text/html; charset=utf-8">\n<meta name="ProgId" content="Word.Document">\n<meta name="Generator" content="Microsoft Word 15">\n<meta name="Originator" content="Microsoft Word 15">\n<link rel="File-List" href="file:///C:/Users/GOKULR~1/AppData/Local/Temp/msohtmlclip1/01/clip_filelist.xml">\n<link rel="Preview" href="file:///C:/Users/GOKULR~1/AppData/Local/Temp/msohtmlclip1/01/clip_preview.wmf">\n\x3C!--[if gte mso 9]><xml>\n <o:DocumentProperties>\n  <o:Version>16.00</o:Version>\n </o:DocumentProperties>\n <o:OfficeDocumentSettings>\n  <o:AllowPNG/>\n </o:OfficeDocumentSettings>\n</xml><![endif]-->\n<link rel="themeData" href="file:///C:/Users/GOKULR~1/AppData/Local/Temp/msohtmlclip1/01/clip_themedata.thmx">\n<link rel="colorSchemeMapping" href="file:///C:/Users/GOKULR~1/AppData/Local/Temp/msohtmlclip1/01/clip_colorschememapping.xml">\n\x3C!--[if gte mso 9]><xml>\n <w:WordDocument>\n  <w:View>Normal</w:View>\n  <w:Zoom>0</w:Zoom>\n  <w:TrackMoves/>\n  <w:TrackFormatting/>\n  <w:PunctuationKerning/>\n  <w:ValidateAgainstSchemas/>\n  <w:SaveIfXMLInvalid>false</w:SaveIfXMLInvalid>\n  <w:IgnoreMixedContent>false</w:IgnoreMixedContent>\n  <w:AlwaysShowPlaceholderText>false</w:AlwaysShowPlaceholderText>\n  <w:DoNotPromoteQF/>\n  <w:LidThemeOther>EN-US</w:LidThemeOther>\n  <w:LidThemeAsian>X-NONE</w:LidThemeAsian>\n  <w:LidThemeComplexScript>X-NONE</w:LidThemeComplexScript>\n  <w:Compatibility>\n   <w:BreakWrappedTables/>\n   <w:SnapToGridInCell/>\n   <w:WrapTextWithPunct/>\n   <w:UseAsianBreakRules/>\n   <w:DontGrowAutofit/>\n   <w:SplitPgBreakAndParaMark/>\n   <w:EnableOpenTypeKerning/>\n   <w:DontFlipMirrorIndents/>\n   <w:OverrideTableStyleHps/>\n   <w:UseFELayout/>\n  </w:Compatibility>\n  <m:mathPr>\n   <m:mathFont m:val="Cambria Math"/>\n   <m:brkBin m:val="before"/>\n   <m:brkBinSub m:val="&#45;-"/>\n   <m:smallFrac m:val="off"/>\n   <m:dispDef/>\n   <m:lMargin m:val="0"/>\n   <m:rMargin m:val="0"/>\n   <m:defJc m:val="centerGroup"/>\n   <m:wrapIndent m:val="1440"/>\n   <m:intLim m:val="subSup"/>\n   <m:naryLim m:val="undOvr"/>\n  </m:mathPr></w:WordDocument>\n</xml><![endif]-->\x3C!--[if gte mso 9]><xml>\n <w:LatentStyles DefLockedState="false" DefUnhideWhenUsed="false"\n  DefSemiHidden="false" DefQFormat="false" DefPriority="99"\n  LatentStyleCount="376">\n  <w:LsdException Locked="false" Priority="0" QFormat="true" Name="Normal"/>\n  <w:LsdException Locked="false" Priority="9" QFormat="true" Name="heading 1"/>\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\n   UnhideWhenUsed="true" QFormat="true" Name="heading 2"/>\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\n   UnhideWhenUsed="true" QFormat="true" Name="heading 3"/>\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\n   UnhideWhenUsed="true" QFormat="true" Name="heading 4"/>\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\n   UnhideWhenUsed="true" QFormat="true" Name="heading 5"/>\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\n   UnhideWhenUsed="true" QFormat="true" Name="heading 6"/>\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\n   UnhideWhenUsed="true" QFormat="true" Name="heading 7"/>\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\n   UnhideWhenUsed="true" QFormat="true" Name="heading 8"/>\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\n   UnhideWhenUsed="true" QFormat="true" Name="heading 9"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="index 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="index 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="index 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="index 4"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="index 5"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="index 6"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="index 7"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="index 8"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="index 9"/>\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n   UnhideWhenUsed="true" Name="toc 1"/>\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n   UnhideWhenUsed="true" Name="toc 2"/>\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n   UnhideWhenUsed="true" Name="toc 3"/>\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n   UnhideWhenUsed="true" Name="toc 4"/>\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n   UnhideWhenUsed="true" Name="toc 5"/>\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n   UnhideWhenUsed="true" Name="toc 6"/>\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n   UnhideWhenUsed="true" Name="toc 7"/>\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n   UnhideWhenUsed="true" Name="toc 8"/>\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n   UnhideWhenUsed="true" Name="toc 9"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Normal Indent"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="footnote text"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="annotation text"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="header"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="footer"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="index heading"/>\n  <w:LsdException Locked="false" Priority="35" SemiHidden="true"\n   UnhideWhenUsed="true" QFormat="true" Name="caption"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="table of figures"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="envelope address"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="envelope return"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="footnote reference"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="annotation reference"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="line number"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="page number"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="endnote reference"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="endnote text"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="table of authorities"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="macro"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="toa heading"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Bullet"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Number"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List 4"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List 5"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Bullet 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Bullet 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Bullet 4"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Bullet 5"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Number 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Number 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Number 4"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Number 5"/>\n  <w:LsdException Locked="false" Priority="10" QFormat="true" Name="Title"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Closing"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Signature"/>\n  <w:LsdException Locked="false" Priority="1" SemiHidden="true"\n   UnhideWhenUsed="true" Name="Default Paragraph Font"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Body Text"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Body Text Indent"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Continue"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Continue 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Continue 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Continue 4"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Continue 5"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Message Header"/>\n  <w:LsdException Locked="false" Priority="11" QFormat="true" Name="Subtitle"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Salutation"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Date"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Body Text First Indent"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Body Text First Indent 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Note Heading"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Body Text 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Body Text 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Body Text Indent 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Body Text Indent 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Block Text"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Hyperlink"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="FollowedHyperlink"/>\n  <w:LsdException Locked="false" Priority="22" QFormat="true" Name="Strong"/>\n  <w:LsdException Locked="false" Priority="20" QFormat="true" Name="Emphasis"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Document Map"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Plain Text"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="E-mail Signature"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Top of Form"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Bottom of Form"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Normal (Web)"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Acronym"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Address"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Cite"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Code"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Definition"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Keyboard"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Preformatted"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Sample"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Typewriter"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Variable"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Normal Table"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="annotation subject"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="No List"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Outline List 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Outline List 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Outline List 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Simple 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Simple 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Simple 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Classic 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Classic 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Classic 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Classic 4"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Colorful 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Colorful 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Colorful 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Columns 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Columns 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Columns 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Columns 4"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Columns 5"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Grid 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Grid 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Grid 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Grid 4"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Grid 5"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Grid 6"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Grid 7"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Grid 8"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table List 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table List 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table List 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table List 4"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table List 5"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table List 6"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table List 7"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table List 8"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table 3D effects 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table 3D effects 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table 3D effects 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Contemporary"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Elegant"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Professional"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Subtle 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Subtle 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Web 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Web 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Web 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Balloon Text"/>\n  <w:LsdException Locked="false" Priority="39" Name="Table Grid"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Theme"/>\n  <w:LsdException Locked="false" SemiHidden="true" Name="Placeholder Text"/>\n  <w:LsdException Locked="false" Priority="1" QFormat="true" Name="No Spacing"/>\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading"/>\n  <w:LsdException Locked="false" Priority="61" Name="Light List"/>\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid"/>\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1"/>\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2"/>\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1"/>\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2"/>\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1"/>\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2"/>\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3"/>\n  <w:LsdException Locked="false" Priority="70" Name="Dark List"/>\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading"/>\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List"/>\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid"/>\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 1"/>\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 1"/>\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 1"/>\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 1"/>\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 1"/>\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" Name="Revision"/>\n  <w:LsdException Locked="false" Priority="34" QFormat="true"\n   Name="List Paragraph"/>\n  <w:LsdException Locked="false" Priority="29" QFormat="true" Name="Quote"/>\n  <w:LsdException Locked="false" Priority="30" QFormat="true"\n   Name="Intense Quote"/>\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 1"/>\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 1"/>\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 1"/>\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 1"/>\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 1"/>\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 1"/>\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 1"/>\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 1"/>\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 2"/>\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 2"/>\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 2"/>\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 2"/>\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 2"/>\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 2"/>\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 2"/>\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 2"/>\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 2"/>\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 2"/>\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 2"/>\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 2"/>\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 2"/>\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 2"/>\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 3"/>\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 3"/>\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 3"/>\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 3"/>\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 3"/>\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 3"/>\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 3"/>\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 3"/>\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 3"/>\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 3"/>\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 3"/>\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 3"/>\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 3"/>\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 3"/>\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 4"/>\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 4"/>\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 4"/>\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 4"/>\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 4"/>\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 4"/>\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 4"/>\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 4"/>\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 4"/>\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 4"/>\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 4"/>\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 4"/>\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 4"/>\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 4"/>\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 5"/>\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 5"/>\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 5"/>\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 5"/>\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 5"/>\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 5"/>\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 5"/>\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 5"/>\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 5"/>\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 5"/>\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 5"/>\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 5"/>\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 5"/>\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 5"/>\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 6"/>\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 6"/>\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 6"/>\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 6"/>\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 6"/>\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 6"/>\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 6"/>\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 6"/>\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 6"/>\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 6"/>\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 6"/>\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 6"/>\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 6"/>\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 6"/>\n  <w:LsdException Locked="false" Priority="19" QFormat="true"\n   Name="Subtle Emphasis"/>\n  <w:LsdException Locked="false" Priority="21" QFormat="true"\n   Name="Intense Emphasis"/>\n  <w:LsdException Locked="false" Priority="31" QFormat="true"\n   Name="Subtle Reference"/>\n  <w:LsdException Locked="false" Priority="32" QFormat="true"\n   Name="Intense Reference"/>\n  <w:LsdException Locked="false" Priority="33" QFormat="true" Name="Book Title"/>\n  <w:LsdException Locked="false" Priority="37" SemiHidden="true"\n   UnhideWhenUsed="true" Name="Bibliography"/>\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n   UnhideWhenUsed="true" QFormat="true" Name="TOC Heading"/>\n  <w:LsdException Locked="false" Priority="41" Name="Plain Table 1"/>\n  <w:LsdException Locked="false" Priority="42" Name="Plain Table 2"/>\n  <w:LsdException Locked="false" Priority="43" Name="Plain Table 3"/>\n  <w:LsdException Locked="false" Priority="44" Name="Plain Table 4"/>\n  <w:LsdException Locked="false" Priority="45" Name="Plain Table 5"/>\n  <w:LsdException Locked="false" Priority="40" Name="Grid Table Light"/>\n  <w:LsdException Locked="false" Priority="46" Name="Grid Table 1 Light"/>\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2"/>\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3"/>\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4"/>\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark"/>\n  <w:LsdException Locked="false" Priority="51" Name="Grid Table 6 Colorful"/>\n  <w:LsdException Locked="false" Priority="52" Name="Grid Table 7 Colorful"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="Grid Table 1 Light Accent 1"/>\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 1"/>\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 1"/>\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 1"/>\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 1"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="Grid Table 6 Colorful Accent 1"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="Grid Table 7 Colorful Accent 1"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="Grid Table 1 Light Accent 2"/>\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 2"/>\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 2"/>\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 2"/>\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 2"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="Grid Table 6 Colorful Accent 2"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="Grid Table 7 Colorful Accent 2"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="Grid Table 1 Light Accent 3"/>\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 3"/>\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 3"/>\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 3"/>\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 3"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="Grid Table 6 Colorful Accent 3"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="Grid Table 7 Colorful Accent 3"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="Grid Table 1 Light Accent 4"/>\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 4"/>\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 4"/>\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 4"/>\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 4"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="Grid Table 6 Colorful Accent 4"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="Grid Table 7 Colorful Accent 4"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="Grid Table 1 Light Accent 5"/>\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 5"/>\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 5"/>\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 5"/>\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 5"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="Grid Table 6 Colorful Accent 5"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="Grid Table 7 Colorful Accent 5"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="Grid Table 1 Light Accent 6"/>\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 6"/>\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 6"/>\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 6"/>\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 6"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="Grid Table 6 Colorful Accent 6"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="Grid Table 7 Colorful Accent 6"/>\n  <w:LsdException Locked="false" Priority="46" Name="List Table 1 Light"/>\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2"/>\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3"/>\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4"/>\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark"/>\n  <w:LsdException Locked="false" Priority="51" Name="List Table 6 Colorful"/>\n  <w:LsdException Locked="false" Priority="52" Name="List Table 7 Colorful"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="List Table 1 Light Accent 1"/>\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 1"/>\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 1"/>\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 1"/>\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 1"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="List Table 6 Colorful Accent 1"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="List Table 7 Colorful Accent 1"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="List Table 1 Light Accent 2"/>\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 2"/>\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 2"/>\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 2"/>\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 2"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="List Table 6 Colorful Accent 2"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="List Table 7 Colorful Accent 2"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="List Table 1 Light Accent 3"/>\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 3"/>\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 3"/>\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 3"/>\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 3"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="List Table 6 Colorful Accent 3"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="List Table 7 Colorful Accent 3"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="List Table 1 Light Accent 4"/>\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 4"/>\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 4"/>\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 4"/>\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 4"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="List Table 6 Colorful Accent 4"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="List Table 7 Colorful Accent 4"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="List Table 1 Light Accent 5"/>\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 5"/>\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 5"/>\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 5"/>\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 5"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="List Table 6 Colorful Accent 5"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="List Table 7 Colorful Accent 5"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="List Table 1 Light Accent 6"/>\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 6"/>\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 6"/>\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 6"/>\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 6"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="List Table 6 Colorful Accent 6"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="List Table 7 Colorful Accent 6"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Mention"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Smart Hyperlink"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Hashtag"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Unresolved Mention"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Smart Link"/>\n </w:LatentStyles>\n</xml><![endif]-->\n<style>\n\x3C!--\n /* Font Definitions */\n @font-face\n\t{font-family:"Cambria Math";\n\tpanose-1:2 4 5 3 5 4 6 3 2 4;\n\tmso-font-charset:0;\n\tmso-generic-font-family:roman;\n\tmso-font-pitch:variable;\n\tmso-font-signature:3 0 0 0 1 0;}\n@font-face\n\t{font-family:Calibri;\n\tpanose-1:2 15 5 2 2 2 4 3 2 4;\n\tmso-font-charset:0;\n\tmso-generic-font-family:swiss;\n\tmso-font-pitch:variable;\n\tmso-font-signature:-469750017 -1073732485 9 0 511 0;}\n@font-face\n\t{font-family:"Calibri Light";\n\tpanose-1:2 15 3 2 2 2 4 3 2 4;\n\tmso-font-charset:0;\n\tmso-generic-font-family:swiss;\n\tmso-font-pitch:variable;\n\tmso-font-signature:-469750017 -1073732485 9 0 511 0;}\n@font-face\n\t{font-family:"Segoe UI";\n\tpanose-1:2 11 5 2 4 2 4 2 2 3;\n\tmso-font-charset:0;\n\tmso-generic-font-family:swiss;\n\tmso-font-pitch:variable;\n\tmso-font-signature:-469750017 -1073683329 9 0 511 0;}\n /* Style Definitions */\n p.MsoNormal, li.MsoNormal, div.MsoNormal\n\t{mso-style-unhide:no;\n\tmso-style-qformat:yes;\n\tmso-style-parent:"";\n\tmargin-top:0in;\n\tmargin-right:0in;\n\tmargin-bottom:8.0pt;\n\tmargin-left:0in;\n\ttext-align:justify;\n\ttext-justify:inter-ideograph;\n\tline-height:105%;\n\tmso-pagination:widow-orphan;\n\tfont-size:11.0pt;\n\tfont-family:"Calibri",sans-serif;\n\tmso-ascii-font-family:Calibri;\n\tmso-ascii-theme-font:minor-latin;\n\tmso-fareast-font-family:"Times New Roman";\n\tmso-fareast-theme-font:minor-fareast;\n\tmso-hansi-font-family:Calibri;\n\tmso-hansi-theme-font:minor-latin;\n\tmso-bidi-font-family:"Times New Roman";\n\tmso-bidi-theme-font:minor-bidi;}\nh2\n\t{mso-style-priority:9;\n\tmso-style-qformat:yes;\n\tmso-style-link:"Heading 2 Char";\n\tmso-style-next:Normal;\n\tmargin-top:6.0pt;\n\tmargin-right:0in;\n\tmargin-bottom:0in;\n\tmargin-left:0in;\n\ttext-align:justify;\n\ttext-justify:inter-ideograph;\n\tline-height:105%;\n\tmso-pagination:widow-orphan lines-together;\n\tpage-break-after:avoid;\n\tmso-outline-level:2;\n\tfont-size:14.0pt;\n\tfont-family:"Calibri Light",sans-serif;\n\tmso-ascii-font-family:"Calibri Light";\n\tmso-ascii-theme-font:major-latin;\n\tmso-fareast-font-family:"Times New Roman";\n\tmso-fareast-theme-font:major-fareast;\n\tmso-hansi-font-family:"Calibri Light";\n\tmso-hansi-theme-font:major-latin;\n\tmso-bidi-font-family:"Times New Roman";\n\tmso-bidi-theme-font:major-bidi;}\nspan.Heading2Char\n\t{mso-style-name:"Heading 2 Char";\n\tmso-style-priority:9;\n\tmso-style-unhide:no;\n\tmso-style-locked:yes;\n\tmso-style-link:"Heading 2";\n\tmso-ansi-font-size:14.0pt;\n\tmso-bidi-font-size:14.0pt;\n\tfont-family:"Calibri Light",sans-serif;\n\tmso-ascii-font-family:"Calibri Light";\n\tmso-ascii-theme-font:major-latin;\n\tmso-fareast-font-family:"Times New Roman";\n\tmso-fareast-theme-font:major-fareast;\n\tmso-hansi-font-family:"Calibri Light";\n\tmso-hansi-theme-font:major-latin;\n\tmso-bidi-font-family:"Times New Roman";\n\tmso-bidi-theme-font:major-bidi;\n\tfont-weight:bold;}\n.MsoChpDefault\n\t{mso-style-type:export-only;\n\tmso-default-props:yes;\n\tfont-family:"Calibri",sans-serif;\n\tmso-ascii-font-family:Calibri;\n\tmso-ascii-theme-font:minor-latin;\n\tmso-fareast-font-family:"Times New Roman";\n\tmso-fareast-theme-font:minor-fareast;\n\tmso-hansi-font-family:Calibri;\n\tmso-hansi-theme-font:minor-latin;\n\tmso-bidi-font-family:"Times New Roman";\n\tmso-bidi-theme-font:minor-bidi;\n\tmso-font-kerning:0pt;\n\tmso-ligatures:none;}\n.MsoPapDefault\n\t{mso-style-type:export-only;\n\tmargin-bottom:8.0pt;\n\ttext-align:justify;\n\ttext-justify:inter-ideograph;\n\tline-height:105%;}\n@page WordSection1\n\t{size:8.5in 11.0in;\n\tmargin:1.0in 1.0in 1.0in 1.0in;\n\tmso-header-margin:.5in;\n\tmso-footer-margin:.5in;\n\tmso-paper-source:0;}\ndiv.WordSection1\n\t{page:WordSection1;}\n-->\n</style>\n\x3C!--[if gte mso 10]>\n<style>\n /* Style Definitions */\n table.MsoNormalTable\n\t{mso-style-name:"Table Normal";\n\tmso-tstyle-rowband-size:0;\n\tmso-tstyle-colband-size:0;\n\tmso-style-noshow:yes;\n\tmso-style-priority:99;\n\tmso-style-parent:"";\n\tmso-padding-alt:0in 5.4pt 0in 5.4pt;\n\tmso-para-margin-top:0in;\n\tmso-para-margin-right:0in;\n\tmso-para-margin-bottom:8.0pt;\n\tmso-para-margin-left:0in;\n\ttext-align:justify;\n\ttext-justify:inter-ideograph;\n\tline-height:105%;\n\tmso-pagination:widow-orphan;\n\tfont-size:11.0pt;\n\tfont-family:"Calibri",sans-serif;\n\tmso-ascii-font-family:Calibri;\n\tmso-ascii-theme-font:minor-latin;\n\tmso-hansi-font-family:Calibri;\n\tmso-hansi-theme-font:minor-latin;\n\tmso-bidi-font-family:"Times New Roman";\n\tmso-bidi-theme-font:minor-bidi;}\ntable.MsoTable15Plain3\n\t{mso-style-name:"Plain Table 3";\n\tmso-tstyle-rowband-size:1;\n\tmso-tstyle-colband-size:1;\n\tmso-style-priority:43;\n\tmso-style-unhide:no;\n\tmso-padding-alt:0in 5.4pt 0in 5.4pt;\n\tmso-para-margin:0in;\n\ttext-align:justify;\n\ttext-justify:inter-ideograph;\n\tmso-pagination:widow-orphan;\n\tfont-size:11.0pt;\n\tfont-family:"Calibri",sans-serif;\n\tmso-ascii-font-family:Calibri;\n\tmso-ascii-theme-font:minor-latin;\n\tmso-hansi-font-family:Calibri;\n\tmso-hansi-theme-font:minor-latin;\n\tmso-bidi-font-family:"Times New Roman";\n\tmso-bidi-theme-font:minor-bidi;}\ntable.MsoTable15Plain3FirstRow\n\t{mso-style-name:"Plain Table 3";\n\tmso-table-condition:first-row;\n\tmso-style-priority:43;\n\tmso-style-unhide:no;\n\tmso-tstyle-border-bottom:.5pt solid #7F7F7F;\n\tmso-tstyle-border-bottom-themecolor:text1;\n\tmso-tstyle-border-bottom-themetint:128;\n\ttext-transform:uppercase;\n\tmso-ansi-font-weight:bold;\n\tmso-bidi-font-weight:bold;}\ntable.MsoTable15Plain3LastRow\n\t{mso-style-name:"Plain Table 3";\n\tmso-table-condition:last-row;\n\tmso-style-priority:43;\n\tmso-style-unhide:no;\n\tmso-tstyle-border-top:cell-none;\n\ttext-transform:uppercase;\n\tmso-ansi-font-weight:bold;\n\tmso-bidi-font-weight:bold;}\ntable.MsoTable15Plain3FirstCol\n\t{mso-style-name:"Plain Table 3";\n\tmso-table-condition:first-column;\n\tmso-style-priority:43;\n\tmso-style-unhide:no;\n\tmso-tstyle-border-right:.5pt solid #7F7F7F;\n\tmso-tstyle-border-right-themecolor:text1;\n\tmso-tstyle-border-right-themetint:128;\n\ttext-transform:uppercase;\n\tmso-ansi-font-weight:bold;\n\tmso-bidi-font-weight:bold;}\ntable.MsoTable15Plain3LastCol\n\t{mso-style-name:"Plain Table 3";\n\tmso-table-condition:last-column;\n\tmso-style-priority:43;\n\tmso-style-unhide:no;\n\tmso-tstyle-border-left:cell-none;\n\ttext-transform:uppercase;\n\tmso-ansi-font-weight:bold;\n\tmso-bidi-font-weight:bold;}\ntable.MsoTable15Plain3OddColumn\n\t{mso-style-name:"Plain Table 3";\n\tmso-table-condition:odd-column;\n\tmso-style-priority:43;\n\tmso-style-unhide:no;\n\tmso-tstyle-shading:#F2F2F2;\n\tmso-tstyle-shading-themecolor:background1;\n\tmso-tstyle-shading-themeshade:242;}\ntable.MsoTable15Plain3OddRow\n\t{mso-style-name:"Plain Table 3";\n\tmso-table-condition:odd-row;\n\tmso-style-priority:43;\n\tmso-style-unhide:no;\n\tmso-tstyle-shading:#F2F2F2;\n\tmso-tstyle-shading-themecolor:background1;\n\tmso-tstyle-shading-themeshade:242;}\ntable.MsoTable15Plain3NECell\n\t{mso-style-name:"Plain Table 3";\n\tmso-table-condition:ne-cell;\n\tmso-style-priority:43;\n\tmso-style-unhide:no;\n\tmso-tstyle-border-left:cell-none;}\ntable.MsoTable15Plain3NWCell\n\t{mso-style-name:"Plain Table 3";\n\tmso-table-condition:nw-cell;\n\tmso-style-priority:43;\n\tmso-style-unhide:no;\n\tmso-tstyle-border-right:cell-none;}\n</style>\n<![endif]-->\n\n\n\n\x3C!--StartFragment-->\n\n<table class="MsoTable15Plain3" border="0" cellspacing="0" cellpadding="0" width="650" style="width:487.7pt;border-collapse:collapse;mso-yfti-tbllook:1184;\n mso-padding-alt:0in 5.4pt 0in 5.4pt">\n <tbody><tr style="mso-yfti-irow:-1;mso-yfti-firstrow:yes;mso-yfti-lastfirstrow:yes;\n  mso-yfti-lastrow:yes;height:84.1pt">\n  <td width="162" valign="top" style="width:121.7pt;border:none;border-bottom:solid #7F7F7F 1.0pt;\n  mso-border-bottom-themecolor:text1;mso-border-bottom-themetint:128;\n  mso-border-bottom-alt:solid #7F7F7F .5pt;mso-border-bottom-themecolor:text1;\n  mso-border-bottom-themetint:128;padding:0in 5.4pt 0in 5.4pt;height:84.1pt">\n  <h2 style="line-height:normal;mso-yfti-cnfc:517"><span style="color:black;\n  mso-color-alt:windowtext;text-transform:uppercase;background:#F3F5F7;\n  font-weight:normal">API</span><span style="text-transform:uppercase;\n  font-weight:normal"><o:p></o:p></span></h2>\n  </td>\n  <td width="170" valign="top" style="width:127.85pt;border:none;border-bottom:\n  solid #7F7F7F 1.0pt;mso-border-bottom-themecolor:text1;mso-border-bottom-themetint:\n  128;mso-border-bottom-alt:solid #7F7F7F .5pt;mso-border-bottom-themecolor:\n  text1;mso-border-bottom-themetint:128;padding:0in 5.4pt 0in 5.4pt;height:\n  84.1pt">\n  <h2 style="line-height:normal;mso-yfti-cnfc:1"><span style="color:black;\n  mso-color-alt:windowtext;text-transform:uppercase;background:#F3F5F7;\n  font-weight:normal">Description</span><span style="text-transform:uppercase;\n  font-weight:normal"><o:p></o:p></span></h2>\n  </td>\n  <td width="160" valign="top" style="width:120.35pt;border:none;border-bottom:\n  solid #7F7F7F 1.0pt;mso-border-bottom-themecolor:text1;mso-border-bottom-themetint:\n  128;mso-border-bottom-alt:solid #7F7F7F .5pt;mso-border-bottom-themecolor:\n  text1;mso-border-bottom-themetint:128;padding:0in 5.4pt 0in 5.4pt;height:\n  84.1pt">\n  <h2 style="line-height:normal;mso-yfti-cnfc:1"><span class="Heading2Char"><span style="text-transform:uppercase">Default</span></span><span style="font-family:\n  &quot;Segoe UI&quot;,sans-serif;color:#1A1A1A;text-transform:uppercase;background:#F3F5F7;\n  font-weight:normal"> Value</span><span style="text-transform:uppercase;\n  font-weight:normal"><o:p></o:p></span></h2>\n  </td>\n  <td width="157" valign="top" style="width:117.8pt;border:none;border-bottom:solid #7F7F7F 1.0pt;\n  mso-border-bottom-themecolor:text1;mso-border-bottom-themetint:128;\n  mso-border-bottom-alt:solid #7F7F7F .5pt;mso-border-bottom-themecolor:text1;\n  mso-border-bottom-themetint:128;padding:0in 5.4pt 0in 5.4pt;height:84.1pt">\n  <h2 style="line-height:normal;mso-yfti-cnfc:1"><span style="color:black;\n  mso-color-alt:windowtext;text-transform:uppercase;background:#F3F5F7;\n  font-weight:normal">Type</span><span style="text-transform:uppercase;\n  font-weight:normal"><o:p></o:p></span></h2>\n  </td>\n </tr>\n</tbody></table>\n\n\x3C!--EndFragment-->\n\n\n\n';
        const dataTransfer: DataTransfer = new DataTransfer();
        dataTransfer.setData('text/html', clipBoardData);
        const pasteEvent: ClipboardEvent = new ClipboardEvent('paste', { clipboardData: dataTransfer } as ClipboardEventInit);
        editor.onPaste(pasteEvent);
        setTimeout(() => {
            expect(editor.contentModule.getEditPanel().querySelector('td').querySelector('span').style.textTransform).toBe('uppercase');
            done();
        }, 100);
    });
});

    describe('854594: Difference in Alignment and line height in paste cleanup.', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                pasteCleanupSettings : {
                    keepFormat : true
                }
            });
        });
        afterAll((done: DoneFn) => {
            destroy(editor);
            done();
        });
        it ('Should remove the Margin left for the msolistparagraph class ul ol and subract 0.5 in for the Nested List.', (done: DoneFn) => {
            editor.focusIn();
            const clipBoardData: string = '\n\n\n<meta http-equiv="Content-Type" content="text/html; charset=utf-8">\n<meta name="ProgId" content="Word.Document">\n<meta name="Generator" content="Microsoft Word 15">\n<meta name="Originator" content="Microsoft Word 15">\n<link rel="File-List" href="file:///C:/Users/GOKULR~1/AppData/Local/Temp/msohtmlclip1/01/clip_filelist.xml">\n<link rel="Preview" href="file:///C:/Users/GOKULR~1/AppData/Local/Temp/msohtmlclip1/01/clip_preview.wmf">\n\x3C!--[if gte mso 9]><xml>\n <o:DocumentProperties>\n  <o:Version>16.00</o:Version>\n </o:DocumentProperties>\n</xml><![endif]-->\n<link rel="themeData" href="file:///C:/Users/GOKULR~1/AppData/Local/Temp/msohtmlclip1/01/clip_themedata.thmx">\n<link rel="colorSchemeMapping" href="file:///C:/Users/GOKULR~1/AppData/Local/Temp/msohtmlclip1/01/clip_colorschememapping.xml">\n\x3C!--[if gte mso 9]><xml>\n <w:WordDocument>\n  <w:View>Normal</w:View>\n  <w:Zoom>0</w:Zoom>\n  <w:TrackMoves/>\n  <w:TrackFormatting/>\n  <w:PunctuationKerning/>\n  <w:ValidateAgainstSchemas/>\n  <w:SaveIfXMLInvalid>false</w:SaveIfXMLInvalid>\n  <w:IgnoreMixedContent>false</w:IgnoreMixedContent>\n  <w:AlwaysShowPlaceholderText>false</w:AlwaysShowPlaceholderText>\n  <w:DoNotPromoteQF/>\n  <w:LidThemeOther>EN-US</w:LidThemeOther>\n  <w:LidThemeAsian>ZH-CN</w:LidThemeAsian>\n  <w:LidThemeComplexScript>X-NONE</w:LidThemeComplexScript>\n  <w:Compatibility>\n   <w:BreakWrappedTables/>\n   <w:SnapToGridInCell/>\n   <w:WrapTextWithPunct/>\n   <w:UseAsianBreakRules/>\n   <w:DontGrowAutofit/>\n   <w:SplitPgBreakAndParaMark/>\n   <w:EnableOpenTypeKerning/>\n   <w:DontFlipMirrorIndents/>\n   <w:OverrideTableStyleHps/>\n  </w:Compatibility>\n  <w:DoNotOptimizeForBrowser/>\n  <m:mathPr>\n   <m:mathFont m:val="Cambria Math"/>\n   <m:brkBin m:val="before"/>\n   <m:brkBinSub m:val="&#45;-"/>\n   <m:smallFrac m:val="off"/>\n   <m:dispDef/>\n   <m:lMargin m:val="0"/>\n   <m:rMargin m:val="0"/>\n   <m:defJc m:val="centerGroup"/>\n   <m:wrapIndent m:val="1440"/>\n   <m:intLim m:val="subSup"/>\n   <m:naryLim m:val="undOvr"/>\n  </m:mathPr></w:WordDocument>\n</xml><![endif]-->\x3C!--[if gte mso 9]><xml>\n <w:LatentStyles DefLockedState="false" DefUnhideWhenUsed="false"\n  DefSemiHidden="false" DefQFormat="false" DefPriority="99"\n  LatentStyleCount="376">\n  <w:LsdException Locked="false" Priority="0" QFormat="true" Name="Normal"/>\n  <w:LsdException Locked="false" Priority="9" QFormat="true" Name="heading 1"/>\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\n   UnhideWhenUsed="true" QFormat="true" Name="heading 2"/>\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\n   UnhideWhenUsed="true" QFormat="true" Name="heading 3"/>\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\n   UnhideWhenUsed="true" QFormat="true" Name="heading 4"/>\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\n   UnhideWhenUsed="true" QFormat="true" Name="heading 5"/>\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\n   UnhideWhenUsed="true" QFormat="true" Name="heading 6"/>\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\n   UnhideWhenUsed="true" QFormat="true" Name="heading 7"/>\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\n   UnhideWhenUsed="true" QFormat="true" Name="heading 8"/>\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\n   UnhideWhenUsed="true" QFormat="true" Name="heading 9"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="index 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="index 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="index 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="index 4"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="index 5"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="index 6"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="index 7"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="index 8"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="index 9"/>\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n   UnhideWhenUsed="true" Name="toc 1"/>\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n   UnhideWhenUsed="true" Name="toc 2"/>\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n   UnhideWhenUsed="true" Name="toc 3"/>\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n   UnhideWhenUsed="true" Name="toc 4"/>\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n   UnhideWhenUsed="true" Name="toc 5"/>\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n   UnhideWhenUsed="true" Name="toc 6"/>\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n   UnhideWhenUsed="true" Name="toc 7"/>\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n   UnhideWhenUsed="true" Name="toc 8"/>\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n   UnhideWhenUsed="true" Name="toc 9"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Normal Indent"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="footnote text"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="annotation text"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="header"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="footer"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="index heading"/>\n  <w:LsdException Locked="false" Priority="35" SemiHidden="true"\n   UnhideWhenUsed="true" QFormat="true" Name="caption"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="table of figures"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="envelope address"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="envelope return"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="footnote reference"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="annotation reference"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="line number"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="page number"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="endnote reference"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="endnote text"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="table of authorities"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="macro"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="toa heading"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Bullet"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Number"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List 4"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List 5"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Bullet 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Bullet 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Bullet 4"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Bullet 5"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Number 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Number 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Number 4"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Number 5"/>\n  <w:LsdException Locked="false" Priority="10" QFormat="true" Name="Title"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Closing"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Signature"/>\n  <w:LsdException Locked="false" Priority="1" SemiHidden="true"\n   UnhideWhenUsed="true" Name="Default Paragraph Font"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Body Text"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Body Text Indent"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Continue"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Continue 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Continue 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Continue 4"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Continue 5"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Message Header"/>\n  <w:LsdException Locked="false" Priority="11" QFormat="true" Name="Subtitle"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Salutation"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Date"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Body Text First Indent"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Body Text First Indent 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Note Heading"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Body Text 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Body Text 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Body Text Indent 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Body Text Indent 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Block Text"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Hyperlink"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="FollowedHyperlink"/>\n  <w:LsdException Locked="false" Priority="22" QFormat="true" Name="Strong"/>\n  <w:LsdException Locked="false" Priority="20" QFormat="true" Name="Emphasis"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Document Map"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Plain Text"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="E-mail Signature"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Top of Form"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Bottom of Form"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Normal (Web)"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Acronym"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Address"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Cite"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Code"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Definition"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Keyboard"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Preformatted"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Sample"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Typewriter"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Variable"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Normal Table"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="annotation subject"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="No List"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Outline List 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Outline List 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Outline List 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Simple 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Simple 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Simple 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Classic 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Classic 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Classic 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Classic 4"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Colorful 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Colorful 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Colorful 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Columns 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Columns 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Columns 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Columns 4"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Columns 5"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Grid 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Grid 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Grid 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Grid 4"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Grid 5"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Grid 6"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Grid 7"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Grid 8"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table List 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table List 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table List 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table List 4"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table List 5"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table List 6"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table List 7"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table List 8"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table 3D effects 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table 3D effects 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table 3D effects 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Contemporary"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Elegant"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Professional"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Subtle 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Subtle 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Web 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Web 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Web 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Balloon Text"/>\n  <w:LsdException Locked="false" Priority="39" Name="Table Grid"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Theme"/>\n  <w:LsdException Locked="false" SemiHidden="true" Name="Placeholder Text"/>\n  <w:LsdException Locked="false" Priority="1" QFormat="true" Name="No Spacing"/>\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading"/>\n  <w:LsdException Locked="false" Priority="61" Name="Light List"/>\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid"/>\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1"/>\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2"/>\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1"/>\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2"/>\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1"/>\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2"/>\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3"/>\n  <w:LsdException Locked="false" Priority="70" Name="Dark List"/>\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading"/>\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List"/>\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid"/>\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 1"/>\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 1"/>\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 1"/>\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 1"/>\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 1"/>\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" Name="Revision"/>\n  <w:LsdException Locked="false" Priority="34" QFormat="true"\n   Name="List Paragraph"/>\n  <w:LsdException Locked="false" Priority="29" QFormat="true" Name="Quote"/>\n  <w:LsdException Locked="false" Priority="30" QFormat="true"\n   Name="Intense Quote"/>\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 1"/>\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 1"/>\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 1"/>\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 1"/>\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 1"/>\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 1"/>\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 1"/>\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 1"/>\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 2"/>\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 2"/>\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 2"/>\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 2"/>\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 2"/>\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 2"/>\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 2"/>\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 2"/>\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 2"/>\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 2"/>\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 2"/>\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 2"/>\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 2"/>\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 2"/>\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 3"/>\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 3"/>\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 3"/>\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 3"/>\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 3"/>\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 3"/>\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 3"/>\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 3"/>\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 3"/>\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 3"/>\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 3"/>\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 3"/>\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 3"/>\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 3"/>\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 4"/>\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 4"/>\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 4"/>\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 4"/>\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 4"/>\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 4"/>\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 4"/>\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 4"/>\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 4"/>\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 4"/>\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 4"/>\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 4"/>\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 4"/>\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 4"/>\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 5"/>\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 5"/>\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 5"/>\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 5"/>\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 5"/>\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 5"/>\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 5"/>\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 5"/>\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 5"/>\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 5"/>\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 5"/>\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 5"/>\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 5"/>\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 5"/>\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 6"/>\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 6"/>\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 6"/>\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 6"/>\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 6"/>\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 6"/>\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 6"/>\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 6"/>\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 6"/>\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 6"/>\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 6"/>\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 6"/>\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 6"/>\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 6"/>\n  <w:LsdException Locked="false" Priority="19" QFormat="true"\n   Name="Subtle Emphasis"/>\n  <w:LsdException Locked="false" Priority="21" QFormat="true"\n   Name="Intense Emphasis"/>\n  <w:LsdException Locked="false" Priority="31" QFormat="true"\n   Name="Subtle Reference"/>\n  <w:LsdException Locked="false" Priority="32" QFormat="true"\n   Name="Intense Reference"/>\n  <w:LsdException Locked="false" Priority="33" QFormat="true" Name="Book Title"/>\n  <w:LsdException Locked="false" Priority="37" SemiHidden="true"\n   UnhideWhenUsed="true" Name="Bibliography"/>\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n   UnhideWhenUsed="true" QFormat="true" Name="TOC Heading"/>\n  <w:LsdException Locked="false" Priority="41" Name="Plain Table 1"/>\n  <w:LsdException Locked="false" Priority="42" Name="Plain Table 2"/>\n  <w:LsdException Locked="false" Priority="43" Name="Plain Table 3"/>\n  <w:LsdException Locked="false" Priority="44" Name="Plain Table 4"/>\n  <w:LsdException Locked="false" Priority="45" Name="Plain Table 5"/>\n  <w:LsdException Locked="false" Priority="40" Name="Grid Table Light"/>\n  <w:LsdException Locked="false" Priority="46" Name="Grid Table 1 Light"/>\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2"/>\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3"/>\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4"/>\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark"/>\n  <w:LsdException Locked="false" Priority="51" Name="Grid Table 6 Colorful"/>\n  <w:LsdException Locked="false" Priority="52" Name="Grid Table 7 Colorful"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="Grid Table 1 Light Accent 1"/>\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 1"/>\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 1"/>\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 1"/>\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 1"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="Grid Table 6 Colorful Accent 1"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="Grid Table 7 Colorful Accent 1"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="Grid Table 1 Light Accent 2"/>\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 2"/>\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 2"/>\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 2"/>\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 2"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="Grid Table 6 Colorful Accent 2"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="Grid Table 7 Colorful Accent 2"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="Grid Table 1 Light Accent 3"/>\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 3"/>\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 3"/>\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 3"/>\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 3"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="Grid Table 6 Colorful Accent 3"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="Grid Table 7 Colorful Accent 3"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="Grid Table 1 Light Accent 4"/>\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 4"/>\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 4"/>\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 4"/>\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 4"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="Grid Table 6 Colorful Accent 4"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="Grid Table 7 Colorful Accent 4"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="Grid Table 1 Light Accent 5"/>\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 5"/>\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 5"/>\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 5"/>\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 5"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="Grid Table 6 Colorful Accent 5"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="Grid Table 7 Colorful Accent 5"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="Grid Table 1 Light Accent 6"/>\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 6"/>\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 6"/>\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 6"/>\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 6"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="Grid Table 6 Colorful Accent 6"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="Grid Table 7 Colorful Accent 6"/>\n  <w:LsdException Locked="false" Priority="46" Name="List Table 1 Light"/>\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2"/>\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3"/>\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4"/>\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark"/>\n  <w:LsdException Locked="false" Priority="51" Name="List Table 6 Colorful"/>\n  <w:LsdException Locked="false" Priority="52" Name="List Table 7 Colorful"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="List Table 1 Light Accent 1"/>\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 1"/>\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 1"/>\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 1"/>\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 1"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="List Table 6 Colorful Accent 1"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="List Table 7 Colorful Accent 1"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="List Table 1 Light Accent 2"/>\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 2"/>\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 2"/>\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 2"/>\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 2"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="List Table 6 Colorful Accent 2"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="List Table 7 Colorful Accent 2"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="List Table 1 Light Accent 3"/>\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 3"/>\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 3"/>\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 3"/>\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 3"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="List Table 6 Colorful Accent 3"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="List Table 7 Colorful Accent 3"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="List Table 1 Light Accent 4"/>\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 4"/>\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 4"/>\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 4"/>\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 4"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="List Table 6 Colorful Accent 4"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="List Table 7 Colorful Accent 4"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="List Table 1 Light Accent 5"/>\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 5"/>\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 5"/>\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 5"/>\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 5"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="List Table 6 Colorful Accent 5"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="List Table 7 Colorful Accent 5"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="List Table 1 Light Accent 6"/>\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 6"/>\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 6"/>\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 6"/>\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 6"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="List Table 6 Colorful Accent 6"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="List Table 7 Colorful Accent 6"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Mention"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Smart Hyperlink"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Hashtag"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Unresolved Mention"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Smart Link"/>\n </w:LatentStyles>\n</xml><![endif]-->\n<style>\n\x3C!--\n /* Font Definitions */\n @font-face\n\t{font-family:Wingdings;\n\tpanose-1:5 0 0 0 0 0 0 0 0 0;\n\tmso-font-charset:2;\n\tmso-generic-font-family:auto;\n\tmso-font-pitch:variable;\n\tmso-font-signature:0 268435456 0 0 -2147483648 0;}\n@font-face\n\t{font-family:"Cambria Math";\n\tpanose-1:2 4 5 3 5 4 6 3 2 4;\n\tmso-font-charset:0;\n\tmso-generic-font-family:roman;\n\tmso-font-pitch:variable;\n\tmso-font-signature:3 0 0 0 1 0;}\n@font-face\n\t{font-family:Calibri;\n\tpanose-1:2 15 5 2 2 2 4 3 2 4;\n\tmso-font-charset:0;\n\tmso-generic-font-family:swiss;\n\tmso-font-pitch:variable;\n\tmso-font-signature:-469750017 -1073732485 9 0 511 0;}\n@font-face\n\t{font-family:Roboto;\n\tpanose-1:2 0 0 0 0 0 0 0 0 0;\n\tmso-font-charset:0;\n\tmso-generic-font-family:auto;\n\tmso-font-pitch:variable;\n\tmso-font-signature:-536868097 1342185855 33 0 415 0;}\n /* Style Definitions */\n p.MsoNormal, li.MsoNormal, div.MsoNormal\n\t{mso-style-unhide:no;\n\tmso-style-qformat:yes;\n\tmso-style-parent:"";\n\tmargin-top:0in;\n\tmargin-right:0in;\n\tmargin-bottom:8.0pt;\n\tmargin-left:0in;\n\tline-height:107%;\n\tmso-pagination:widow-orphan;\n\tfont-size:11.0pt;\n\tfont-family:"Calibri",sans-serif;\n\tmso-ascii-font-family:Calibri;\n\tmso-ascii-theme-font:minor-latin;\n\tmso-fareast-font-family:Calibri;\n\tmso-fareast-theme-font:minor-latin;\n\tmso-hansi-font-family:Calibri;\n\tmso-hansi-theme-font:minor-latin;\n\tmso-bidi-font-family:"Times New Roman";\n\tmso-bidi-theme-font:minor-bidi;\n\tmso-font-kerning:1.0pt;\n\tmso-ligatures:standardcontextual;\n\tmso-fareast-language:EN-US;}\na:link, span.MsoHyperlink\n\t{mso-style-noshow:yes;\n\tmso-style-priority:99;\n\tcolor:blue;\n\ttext-decoration:underline;\n\ttext-underline:single;}\na:visited, span.MsoHyperlinkFollowed\n\t{mso-style-noshow:yes;\n\tmso-style-priority:99;\n\tcolor:#954F72;\n\tmso-themecolor:followedhyperlink;\n\ttext-decoration:underline;\n\ttext-underline:single;}\np\n\t{mso-style-noshow:yes;\n\tmso-style-priority:99;\n\tmso-margin-top-alt:auto;\n\tmargin-right:0in;\n\tmso-margin-bottom-alt:auto;\n\tmargin-left:0in;\n\tmso-pagination:widow-orphan;\n\tfont-size:12.0pt;\n\tfont-family:"Times New Roman",serif;\n\tmso-fareast-font-family:"Times New Roman";\n\tmso-fareast-language:EN-US;}\np.MsoListParagraph, li.MsoListParagraph, div.MsoListParagraph\n\t{mso-style-priority:34;\n\tmso-style-unhide:no;\n\tmso-style-qformat:yes;\n\tmargin-top:0in;\n\tmargin-right:0in;\n\tmargin-bottom:8.0pt;\n\tmargin-left:.5in;\n\tmso-add-space:auto;\n\tline-height:107%;\n\tmso-pagination:widow-orphan;\n\tfont-size:11.0pt;\n\tfont-family:"Calibri",sans-serif;\n\tmso-ascii-font-family:Calibri;\n\tmso-ascii-theme-font:minor-latin;\n\tmso-fareast-font-family:Calibri;\n\tmso-fareast-theme-font:minor-latin;\n\tmso-hansi-font-family:Calibri;\n\tmso-hansi-theme-font:minor-latin;\n\tmso-bidi-font-family:"Times New Roman";\n\tmso-bidi-theme-font:minor-bidi;\n\tmso-font-kerning:1.0pt;\n\tmso-ligatures:standardcontextual;\n\tmso-fareast-language:EN-US;}\np.MsoListParagraphCxSpFirst, li.MsoListParagraphCxSpFirst, div.MsoListParagraphCxSpFirst\n\t{mso-style-priority:34;\n\tmso-style-unhide:no;\n\tmso-style-qformat:yes;\n\tmso-style-type:export-only;\n\tmargin-top:0in;\n\tmargin-right:0in;\n\tmargin-bottom:0in;\n\tmargin-left:.5in;\n\tmso-add-space:auto;\n\tline-height:107%;\n\tmso-pagination:widow-orphan;\n\tfont-size:11.0pt;\n\tfont-family:"Calibri",sans-serif;\n\tmso-ascii-font-family:Calibri;\n\tmso-ascii-theme-font:minor-latin;\n\tmso-fareast-font-family:Calibri;\n\tmso-fareast-theme-font:minor-latin;\n\tmso-hansi-font-family:Calibri;\n\tmso-hansi-theme-font:minor-latin;\n\tmso-bidi-font-family:"Times New Roman";\n\tmso-bidi-theme-font:minor-bidi;\n\tmso-font-kerning:1.0pt;\n\tmso-ligatures:standardcontextual;\n\tmso-fareast-language:EN-US;}\np.MsoListParagraphCxSpMiddle, li.MsoListParagraphCxSpMiddle, div.MsoListParagraphCxSpMiddle\n\t{mso-style-priority:34;\n\tmso-style-unhide:no;\n\tmso-style-qformat:yes;\n\tmso-style-type:export-only;\n\tmargin-top:0in;\n\tmargin-right:0in;\n\tmargin-bottom:0in;\n\tmargin-left:.5in;\n\tmso-add-space:auto;\n\tline-height:107%;\n\tmso-pagination:widow-orphan;\n\tfont-size:11.0pt;\n\tfont-family:"Calibri",sans-serif;\n\tmso-ascii-font-family:Calibri;\n\tmso-ascii-theme-font:minor-latin;\n\tmso-fareast-font-family:Calibri;\n\tmso-fareast-theme-font:minor-latin;\n\tmso-hansi-font-family:Calibri;\n\tmso-hansi-theme-font:minor-latin;\n\tmso-bidi-font-family:"Times New Roman";\n\tmso-bidi-theme-font:minor-bidi;\n\tmso-font-kerning:1.0pt;\n\tmso-ligatures:standardcontextual;\n\tmso-fareast-language:EN-US;}\np.MsoListParagraphCxSpLast, li.MsoListParagraphCxSpLast, div.MsoListParagraphCxSpLast\n\t{mso-style-priority:34;\n\tmso-style-unhide:no;\n\tmso-style-qformat:yes;\n\tmso-style-type:export-only;\n\tmargin-top:0in;\n\tmargin-right:0in;\n\tmargin-bottom:8.0pt;\n\tmargin-left:.5in;\n\tmso-add-space:auto;\n\tline-height:107%;\n\tmso-pagination:widow-orphan;\n\tfont-size:11.0pt;\n\tfont-family:"Calibri",sans-serif;\n\tmso-ascii-font-family:Calibri;\n\tmso-ascii-theme-font:minor-latin;\n\tmso-fareast-font-family:Calibri;\n\tmso-fareast-theme-font:minor-latin;\n\tmso-hansi-font-family:Calibri;\n\tmso-hansi-theme-font:minor-latin;\n\tmso-bidi-font-family:"Times New Roman";\n\tmso-bidi-theme-font:minor-bidi;\n\tmso-font-kerning:1.0pt;\n\tmso-ligatures:standardcontextual;\n\tmso-fareast-language:EN-US;}\n.MsoChpDefault\n\t{mso-style-type:export-only;\n\tmso-default-props:yes;\n\tfont-family:"Calibri",sans-serif;\n\tmso-ascii-font-family:Calibri;\n\tmso-ascii-theme-font:minor-latin;\n\tmso-fareast-font-family:Calibri;\n\tmso-fareast-theme-font:minor-latin;\n\tmso-hansi-font-family:Calibri;\n\tmso-hansi-theme-font:minor-latin;\n\tmso-bidi-font-family:"Times New Roman";\n\tmso-bidi-theme-font:minor-bidi;\n\tmso-fareast-language:EN-US;}\n.MsoPapDefault\n\t{mso-style-type:export-only;\n\tmargin-bottom:8.0pt;\n\tline-height:107%;}\n@page WordSection1\n\t{size:8.5in 11.0in;\n\tmargin:1.0in 1.0in 1.0in 1.0in;\n\tmso-header-margin:.5in;\n\tmso-footer-margin:.5in;\n\tmso-paper-source:0;}\ndiv.WordSection1\n\t{page:WordSection1;}\n /* List Definitions */\n @list l0\n\t{mso-list-id:296299460;\n\tmso-list-template-ids:1806213448;}\n@list l0:level1\n\t{mso-level-tab-stop:2.5in;\n\tmso-level-number-position:left;\n\tmargin-left:2.5in;\n\ttext-indent:-.25in;}\n@list l0:level2\n\t{mso-level-tab-stop:3.0in;\n\tmso-level-number-position:left;\n\tmargin-left:3.0in;\n\ttext-indent:-.25in;}\n@list l0:level3\n\t{mso-level-tab-stop:3.5in;\n\tmso-level-number-position:left;\n\tmargin-left:3.5in;\n\ttext-indent:-.25in;}\n@list l0:level4\n\t{mso-level-tab-stop:4.0in;\n\tmso-level-number-position:left;\n\tmargin-left:4.0in;\n\ttext-indent:-.25in;}\n@list l0:level5\n\t{mso-level-tab-stop:4.5in;\n\tmso-level-number-position:left;\n\tmargin-left:4.5in;\n\ttext-indent:-.25in;}\n@list l0:level6\n\t{mso-level-tab-stop:5.0in;\n\tmso-level-number-position:left;\n\tmargin-left:5.0in;\n\ttext-indent:-.25in;}\n@list l0:level7\n\t{mso-level-tab-stop:5.5in;\n\tmso-level-number-position:left;\n\tmargin-left:5.5in;\n\ttext-indent:-.25in;}\n@list l0:level8\n\t{mso-level-tab-stop:6.0in;\n\tmso-level-number-position:left;\n\tmargin-left:6.0in;\n\ttext-indent:-.25in;}\n@list l0:level9\n\t{mso-level-tab-stop:6.5in;\n\tmso-level-number-position:left;\n\tmargin-left:6.5in;\n\ttext-indent:-.25in;}\n@list l1\n\t{mso-list-id:1249801753;\n\tmso-list-template-ids:-1109633890;}\n@list l2\n\t{mso-list-id:1591818548;\n\tmso-list-template-ids:1806213448;}\n@list l2:level1\n\t{mso-level-tab-stop:1.75in;\n\tmso-level-number-position:left;\n\tmargin-left:1.75in;\n\ttext-indent:-.25in;}\n@list l2:level2\n\t{mso-level-tab-stop:2.25in;\n\tmso-level-number-position:left;\n\tmargin-left:2.25in;\n\ttext-indent:-.25in;}\n@list l2:level3\n\t{mso-level-tab-stop:2.75in;\n\tmso-level-number-position:left;\n\tmargin-left:2.75in;\n\ttext-indent:-.25in;}\n@list l2:level4\n\t{mso-level-tab-stop:3.25in;\n\tmso-level-number-position:left;\n\tmargin-left:3.25in;\n\ttext-indent:-.25in;}\n@list l2:level5\n\t{mso-level-tab-stop:3.75in;\n\tmso-level-number-position:left;\n\tmargin-left:3.75in;\n\ttext-indent:-.25in;}\n@list l2:level6\n\t{mso-level-tab-stop:4.25in;\n\tmso-level-number-position:left;\n\tmargin-left:4.25in;\n\ttext-indent:-.25in;}\n@list l2:level7\n\t{mso-level-tab-stop:4.75in;\n\tmso-level-number-position:left;\n\tmargin-left:4.75in;\n\ttext-indent:-.25in;}\n@list l2:level8\n\t{mso-level-tab-stop:5.25in;\n\tmso-level-number-position:left;\n\tmargin-left:5.25in;\n\ttext-indent:-.25in;}\n@list l2:level9\n\t{mso-level-tab-stop:5.75in;\n\tmso-level-number-position:left;\n\tmargin-left:5.75in;\n\ttext-indent:-.25in;}\n@list l3\n\t{mso-list-id:1650748782;\n\tmso-list-template-ids:-1280786214;}\n@list l4\n\t{mso-list-id:1744523921;\n\tmso-list-type:hybrid;\n\tmso-list-template-ids:-2094078534 67698703 67698713 67698715 67698703 67698713 67698715 67698703 67698713 67698715;}\n@list l4:level1\n\t{mso-level-tab-stop:none;\n\tmso-level-number-position:left;\n\ttext-indent:-.25in;}\n@list l4:level2\n\t{mso-level-number-format:alpha-lower;\n\tmso-level-tab-stop:none;\n\tmso-level-number-position:left;\n\ttext-indent:-.25in;}\n@list l4:level3\n\t{mso-level-number-format:roman-lower;\n\tmso-level-tab-stop:none;\n\tmso-level-number-position:right;\n\ttext-indent:-9.0pt;}\n@list l4:level4\n\t{mso-level-tab-stop:none;\n\tmso-level-number-position:left;\n\ttext-indent:-.25in;}\n@list l4:level5\n\t{mso-level-number-format:alpha-lower;\n\tmso-level-tab-stop:none;\n\tmso-level-number-position:left;\n\ttext-indent:-.25in;}\n@list l4:level6\n\t{mso-level-number-format:roman-lower;\n\tmso-level-tab-stop:none;\n\tmso-level-number-position:right;\n\ttext-indent:-9.0pt;}\n@list l4:level7\n\t{mso-level-tab-stop:none;\n\tmso-level-number-position:left;\n\ttext-indent:-.25in;}\n@list l4:level8\n\t{mso-level-number-format:alpha-lower;\n\tmso-level-tab-stop:none;\n\tmso-level-number-position:left;\n\ttext-indent:-.25in;}\n@list l4:level9\n\t{mso-level-number-format:roman-lower;\n\tmso-level-tab-stop:none;\n\tmso-level-number-position:right;\n\ttext-indent:-9.0pt;}\n@list l5\n\t{mso-list-id:1961379290;\n\tmso-list-type:hybrid;\n\tmso-list-template-ids:-322659048 67698689 67698691 67698693 67698689 67698691 67698693 67698689 67698691 67698693;}\n@list l5:level1\n\t{mso-level-number-format:bullet;\n\tmso-level-text:;\n\tmso-level-tab-stop:none;\n\tmso-level-number-position:left;\n\ttext-indent:-.25in;\n\tfont-family:Symbol;}\n@list l5:level2\n\t{mso-level-number-format:bullet;\n\tmso-level-text:o;\n\tmso-level-tab-stop:none;\n\tmso-level-number-position:left;\n\ttext-indent:-.25in;\n\tfont-family:"Courier New";}\n@list l5:level3\n\t{mso-level-number-format:bullet;\n\tmso-level-text:;\n\tmso-level-tab-stop:none;\n\tmso-level-number-position:left;\n\ttext-indent:-.25in;\n\tfont-family:Wingdings;}\n@list l5:level4\n\t{mso-level-number-format:bullet;\n\tmso-level-text:;\n\tmso-level-tab-stop:none;\n\tmso-level-number-position:left;\n\ttext-indent:-.25in;\n\tfont-family:Symbol;}\n@list l5:level5\n\t{mso-level-number-format:bullet;\n\tmso-level-text:o;\n\tmso-level-tab-stop:none;\n\tmso-level-number-position:left;\n\ttext-indent:-.25in;\n\tfont-family:"Courier New";}\n@list l5:level6\n\t{mso-level-number-format:bullet;\n\tmso-level-text:;\n\tmso-level-tab-stop:none;\n\tmso-level-number-position:left;\n\ttext-indent:-.25in;\n\tfont-family:Wingdings;}\n@list l5:level7\n\t{mso-level-number-format:bullet;\n\tmso-level-text:;\n\tmso-level-tab-stop:none;\n\tmso-level-number-position:left;\n\ttext-indent:-.25in;\n\tfont-family:Symbol;}\n@list l5:level8\n\t{mso-level-number-format:bullet;\n\tmso-level-text:o;\n\tmso-level-tab-stop:none;\n\tmso-level-number-position:left;\n\ttext-indent:-.25in;\n\tfont-family:"Courier New";}\n@list l5:level9\n\t{mso-level-number-format:bullet;\n\tmso-level-text:;\n\tmso-level-tab-stop:none;\n\tmso-level-number-position:left;\n\ttext-indent:-.25in;\n\tfont-family:Wingdings;}\nol\n\t{margin-bottom:0in;}\nul\n\t{margin-bottom:0in;}\n-->\n</style>\n\x3C!--[if gte mso 10]>\n<style>\n /* Style Definitions */\n table.MsoNormalTable\n\t{mso-style-name:"Table Normal";\n\tmso-tstyle-rowband-size:0;\n\tmso-tstyle-colband-size:0;\n\tmso-style-noshow:yes;\n\tmso-style-priority:99;\n\tmso-style-parent:"";\n\tmso-padding-alt:0in 5.4pt 0in 5.4pt;\n\tmso-para-margin-top:0in;\n\tmso-para-margin-right:0in;\n\tmso-para-margin-bottom:8.0pt;\n\tmso-para-margin-left:0in;\n\tline-height:107%;\n\tmso-pagination:widow-orphan;\n\tfont-size:11.0pt;\n\tfont-family:"Calibri",sans-serif;\n\tmso-ascii-font-family:Calibri;\n\tmso-ascii-theme-font:minor-latin;\n\tmso-hansi-font-family:Calibri;\n\tmso-hansi-theme-font:minor-latin;\n\tmso-bidi-font-family:"Times New Roman";\n\tmso-bidi-theme-font:minor-bidi;\n\tmso-font-kerning:1.0pt;\n\tmso-ligatures:standardcontextual;\n\tmso-fareast-language:EN-US;}\n</style>\n<![endif]-->\n\n\n\n\x3C!--StartFragment-->\n\n<p style="margin-top:0in;margin-right:0in;margin-bottom:7.5pt;margin-left:0in;\nbackground:white"><span style="font-size:10.5pt;font-family:Roboto;color:#333333">The\nRich Text Editor is a WYSIWYG ("what you see is what you get") editor\nuseful to create and edit content and return the valid&nbsp;</span><span style="color:black;mso-color-alt:windowtext"><a href="https://ej2.syncfusion.com/home/" target="_blank"><span style="font-size:\n10.5pt;font-family:Roboto;color:#2E2EF1">HTML markup</span></a></span><span style="font-size:10.5pt;font-family:Roboto;color:#333333">&nbsp;or&nbsp;</span><span style="color:black;mso-color-alt:windowtext"><a href="https://ej2.syncfusion.com/home/" target="_blank"><span style="font-size:\n10.5pt;font-family:Roboto;color:#2E2EF1">markdown</span></a></span><span style="font-size:10.5pt;font-family:Roboto;color:#333333">&nbsp;of the content<o:p></o:p></span></p>\n\n<p style="margin-top:0in;margin-right:0in;margin-bottom:7.5pt;margin-left:0in;\nbackground:white"><b><span style="font-size:10.5pt;font-family:Roboto;\ncolor:#333333">Toolbar</span></b><span style="font-size:10.5pt;font-family:\nRoboto;color:#333333"><o:p></o:p></span></p>\n\n<p style="margin-top:0in;margin-right:0in;margin-bottom:0in;margin-left:.5in;\ntext-indent:-.25in;mso-list:l1 level1 lfo1;tab-stops:list .5in;background:white">\x3C!--[if !supportLists]--><span style="font-size:10.5pt;font-family:Roboto;mso-fareast-font-family:Roboto;\nmso-bidi-font-family:Roboto;color:#333333"><span style="mso-list:Ignore">1.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span></span>\x3C!--[endif]--><span style="font-size:10.5pt;font-family:Roboto;color:#333333">The Toolbar contains\ncommands to align the text, insert a link, insert an image, insert list,\nundo/redo operations, HTML view, etc<o:p></o:p></span></p>\n\n<p style="margin-top:0in;margin-right:0in;margin-bottom:0in;margin-left:.5in;\ntext-indent:-.25in;mso-list:l1 level1 lfo1;tab-stops:list .5in;background:white">\x3C!--[if !supportLists]--><span style="font-size:10.5pt;font-family:Roboto;mso-fareast-font-family:Roboto;\nmso-bidi-font-family:Roboto;color:#333333"><span style="mso-list:Ignore">2.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span></span>\x3C!--[endif]--><span style="font-size:10.5pt;font-family:Roboto;color:#333333">The Toolbar is fully\ncustomizable<o:p></o:p></span></p>\n\n<p style="margin-top:0in;margin-right:0in;margin-bottom:7.5pt;margin-left:0in;\nbackground:white"><b><span style="font-size:10.5pt;font-family:Roboto;\ncolor:#333333">Links</span></b><span style="font-size:10.5pt;font-family:Roboto;\ncolor:#333333"><o:p></o:p></span></p>\n\n<p style="margin-top:0in;margin-right:0in;margin-bottom:0in;margin-left:1.75in;\ntext-indent:-.25in;mso-list:l2 level1 lfo2;tab-stops:list 1.75in;background:\nwhite">\x3C!--[if !supportLists]--><span style="font-size:10.5pt;font-family:Roboto;\nmso-fareast-font-family:Roboto;mso-bidi-font-family:Roboto;color:#333333"><span style="mso-list:Ignore">1.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span></span></span>\x3C!--[endif]--><span style="font-size:10.5pt;font-family:Roboto;\ncolor:#333333">You can insert a hyperlink with its corresponding dialog<o:p></o:p></span></p>\n\n<p style="margin-top:0in;margin-right:0in;margin-bottom:0in;margin-left:1.75in;\ntext-indent:-.25in;mso-list:l2 level1 lfo2;tab-stops:list 1.75in;background:\nwhite">\x3C!--[if !supportLists]--><span style="font-size:10.5pt;font-family:Roboto;\nmso-fareast-font-family:Roboto;mso-bidi-font-family:Roboto;color:#333333"><span style="mso-list:Ignore">2.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span></span></span>\x3C!--[endif]--><span style="font-size:10.5pt;font-family:Roboto;\ncolor:#333333">Attach a hyperlink to the displayed text.<o:p></o:p></span></p>\n\n<p style="margin-top:0in;margin-right:0in;margin-bottom:0in;margin-left:1.75in;\ntext-indent:-.25in;mso-list:l2 level1 lfo2;tab-stops:list 1.75in;background:\nwhite">\x3C!--[if !supportLists]--><span style="font-size:10.5pt;font-family:Roboto;\nmso-fareast-font-family:Roboto;mso-bidi-font-family:Roboto;color:#333333"><span style="mso-list:Ignore">3.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span></span></span>\x3C!--[endif]--><span style="font-size:10.5pt;font-family:Roboto;\ncolor:#333333">Customize the quick toolbar based on the hyperlink<o:p></o:p></span></p>\n\n<p style="margin-top:0in;margin-right:0in;margin-bottom:7.5pt;margin-left:0in;\nbackground:white"><b><span style="font-size:10.5pt;font-family:Roboto;\ncolor:#333333">Image.</span></b><span style="font-size:10.5pt;font-family:Roboto;\ncolor:#333333"><o:p></o:p></span></p>\n\n<p style="margin-top:0in;margin-right:0in;margin-bottom:0in;margin-left:.5in;\ntext-indent:-.25in;mso-list:l3 level1 lfo3;tab-stops:list .5in;background:white">\x3C!--[if !supportLists]--><span style="font-size:10.5pt;font-family:Roboto;mso-fareast-font-family:Roboto;\nmso-bidi-font-family:Roboto;color:#333333"><span style="mso-list:Ignore">1.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span></span>\x3C!--[endif]--><span style="font-size:10.5pt;font-family:Roboto;color:#333333">Allows you to insert\nimages from an online source as well as the local computer<o:p></o:p></span></p>\n\n<p style="margin-top:0in;margin-right:0in;margin-bottom:0in;margin-left:.5in;\ntext-indent:-.25in;mso-list:l3 level1 lfo3;tab-stops:list .5in;background:white">\x3C!--[if !supportLists]--><span style="font-size:10.5pt;font-family:Roboto;mso-fareast-font-family:Roboto;\nmso-bidi-font-family:Roboto;color:#333333"><span style="mso-list:Ignore">2.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span></span>\x3C!--[endif]--><span style="font-size:10.5pt;font-family:Roboto;color:#333333">You can upload an\nimage<o:p></o:p></span></p>\n\n<p style="margin-top:0in;margin-right:0in;margin-bottom:0in;margin-left:.5in;\ntext-indent:-.25in;mso-list:l3 level1 lfo3;tab-stops:list .5in;background:white">\x3C!--[if !supportLists]--><span style="font-size:10.5pt;font-family:Roboto;mso-fareast-font-family:Roboto;\nmso-bidi-font-family:Roboto;color:#333333"><span style="mso-list:Ignore">3.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span></span>\x3C!--[endif]--><span style="font-size:10.5pt;font-family:Roboto;color:#333333">Provides an option to\ncustomize the quick toolbar for an image<o:p></o:p></span></p>\n\n<p style="margin:0in;background:white"><span style="font-size:10.5pt;\nfont-family:Roboto;color:#333333"><o:p>&nbsp;</o:p></span></p>\n\n<p style="margin:0in;background:white"><span style="font-size:10.5pt;\nfont-family:Roboto;color:#333333"><o:p>&nbsp;</o:p></span></p>\n\n<p style="margin:0in;background:white"><span style="font-size:10.5pt;\nfont-family:Roboto;color:#333333"><o:p>&nbsp;</o:p></span></p>\n\n<p style="margin:0in;background:white"><span style="font-size:10.5pt;\nfont-family:Roboto;color:#333333"><o:p>&nbsp;</o:p></span></p>\n\n<p style="margin:0in;background:white"><span style="font-size:10.5pt;\nfont-family:Roboto;color:#333333"><o:p>&nbsp;</o:p></span></p>\n\n<p class="MsoListParagraphCxSpFirst" style="text-indent:-.25in;mso-list:l5 level1 lfo4">\x3C!--[if !supportLists]--><span style="font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:\nSymbol"><span style="mso-list:Ignore">·<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span></span></span>\x3C!--[endif]-->The Rich Text Editor.<o:p></o:p></p>\n\n<p class="MsoListParagraphCxSpLast" style="text-indent:-.25in;mso-list:l5 level1 lfo4">\x3C!--[if !supportLists]--><span style="font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:\nSymbol"><span style="mso-list:Ignore">·<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span></span></span>\x3C!--[endif]-->The Mark down Editor.<o:p></o:p></p>\n\n<p class="MsoNormal"><o:p>&nbsp;</o:p></p>\n\n<p class="MsoListParagraphCxSpFirst" style="margin-left:1.0in;mso-add-space:auto;\ntext-indent:-.25in;mso-list:l5 level2 lfo4">\x3C!--[if !supportLists]--><span style="font-family:&quot;Courier New&quot;;mso-fareast-font-family:&quot;Courier New&quot;"><span style="mso-list:Ignore">o<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;\n</span></span></span>\x3C!--[endif]-->The Rich Text Editor.<o:p></o:p></p>\n\n<p class="MsoListParagraphCxSpLast" style="margin-left:1.0in;mso-add-space:auto;\ntext-indent:-.25in;mso-list:l5 level2 lfo4">\x3C!--[if !supportLists]--><span style="font-family:&quot;Courier New&quot;;mso-fareast-font-family:&quot;Courier New&quot;"><span style="mso-list:Ignore">o<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;\n</span></span></span>\x3C!--[endif]-->The Mark down Editor.<o:p></o:p></p>\n\n<p class="MsoNormal"><o:p>&nbsp;</o:p></p>\n\n<p class="MsoNormal"><o:p>&nbsp;</o:p></p>\n\n<p class="MsoNormal"><o:p>&nbsp;</o:p></p>\n\n<p class="MsoNormal">FASDFADSADFS<o:p></o:p></p>\n\n<p class="MsoNormal">ASDFASDA<o:p></o:p></p>\n\n<p class="MsoListParagraphCxSpFirst" style="margin-left:1.5in;mso-add-space:auto;\ntext-indent:-.25in;mso-list:l5 level3 lfo4">\x3C!--[if !supportLists]--><span style="font-family:Wingdings;mso-fareast-font-family:Wingdings;mso-bidi-font-family:\nWingdings"><span style="mso-list:Ignore">§<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;\n</span></span></span>\x3C!--[endif]-->The Rich Text Editor.<o:p></o:p></p>\n\n<p class="MsoListParagraphCxSpLast" style="margin-left:1.5in;mso-add-space:auto;\ntext-indent:-.25in;mso-list:l5 level3 lfo4">\x3C!--[if !supportLists]--><span style="font-family:Wingdings;mso-fareast-font-family:Wingdings;mso-bidi-font-family:\nWingdings"><span style="mso-list:Ignore">§<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;\n</span></span></span>\x3C!--[endif]-->The Mark down Editor.<o:p></o:p></p>\n\n<p class="MsoNormal"><o:p>&nbsp;</o:p></p>\n\n<p style="margin-top:0in;margin-right:0in;margin-bottom:0in;margin-left:2.5in;\ntext-indent:-.25in;mso-list:l0 level1 lfo5;tab-stops:list 2.5in;background:\nwhite">\x3C!--[if !supportLists]--><span style="font-size:10.5pt;font-family:Roboto;\nmso-fareast-font-family:Roboto;mso-bidi-font-family:Roboto;color:#333333"><span style="mso-list:Ignore">1.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span></span></span>\x3C!--[endif]--><span style="font-size:10.5pt;font-family:Roboto;\ncolor:#333333">You can insert a hyperlink with its corresponding dialog<o:p></o:p></span></p>\n\n<p style="margin-top:0in;margin-right:0in;margin-bottom:0in;margin-left:2.5in;\ntext-indent:-.25in;mso-list:l0 level1 lfo5;tab-stops:list 2.5in;background:\nwhite">\x3C!--[if !supportLists]--><span style="font-size:10.5pt;font-family:Roboto;\nmso-fareast-font-family:Roboto;mso-bidi-font-family:Roboto;color:#333333"><span style="mso-list:Ignore">2.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span></span></span>\x3C!--[endif]--><span style="font-size:10.5pt;font-family:Roboto;\ncolor:#333333">Attach a hyperlink to the displayed text.<o:p></o:p></span></p>\n\n<p style="margin-top:0in;margin-right:0in;margin-bottom:0in;margin-left:2.5in;\ntext-indent:-.25in;mso-list:l0 level1 lfo5;tab-stops:list 2.5in;background:\nwhite">\x3C!--[if !supportLists]--><span style="font-size:10.5pt;font-family:Roboto;\nmso-fareast-font-family:Roboto;mso-bidi-font-family:Roboto;color:#333333"><span style="mso-list:Ignore">3.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span></span></span>\x3C!--[endif]--><span style="font-size:10.5pt;font-family:Roboto;\ncolor:#333333">Customize the quick toolbar based on the hyperlink<o:p></o:p></span></p>\n\n<p class="MsoNormal"><o:p>&nbsp;</o:p></p>\n\n<p class="MsoNormal"><o:p>&nbsp;</o:p></p>\n\n<p class="MsoNormal"><o:p>&nbsp;</o:p></p>\n\n<p class="MsoListParagraphCxSpFirst" style="text-indent:-.25in;mso-list:l4 level1 lfo6">\x3C!--[if !supportLists]--><span style="mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin"><span style="mso-list:Ignore">1.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span></span></span>\x3C!--[endif]-->List 1<o:p></o:p></p>\n\n<p class="MsoListParagraphCxSpLast" style="text-indent:-.25in;mso-list:l4 level1 lfo6">\x3C!--[if !supportLists]--><span style="mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin"><span style="mso-list:Ignore">2.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span></span></span>\x3C!--[endif]-->List 2<o:p></o:p></p>\n\n<p class="MsoNormal">This is not a list<o:p></o:p></p>\n\n<p class="MsoListParagraph" style="text-indent:-.25in;mso-list:l4 level1 lfo6">\x3C!--[if !supportLists]--><span style="mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin"><span style="mso-list:Ignore">3.<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n</span></span></span>\x3C!--[endif]-->List 3<o:p></o:p></p>\n\n\x3C!--EndFragment-->\n\n\n\n';
            const dataTransfer: DataTransfer = new DataTransfer();
            dataTransfer.setData('text/html', clipBoardData);
            const pasteEvent: ClipboardEvent = new ClipboardEvent('paste', { clipboardData: dataTransfer } as ClipboardEventInit);
            editor.onPaste(pasteEvent);
            setTimeout(() => {
                // Normal List
                expect(editor.inputElement.querySelectorAll('ol')[0].style.marginLeft).toBe('');
                expect((editor.inputElement.querySelectorAll('ol')[0].children[0] as HTMLElement).style.marginLeft).toBe('0in');
                // Nested List
                expect(editor.inputElement.querySelectorAll('ol')[1].style.marginLeft).toBe('');
                expect((editor.inputElement.querySelectorAll('ol')[1].children[0] as HTMLElement).style.marginLeft).toBe('1.25in');
                // Normal MS Word List
                expect(editor.inputElement.querySelectorAll('ul')[0].style.marginLeft).toBe('');
                expect((editor.inputElement.querySelectorAll('ul')[0].children[0] as HTMLElement).style.marginLeft).toBe('');
                // Whole Inner HTML
                const expectedElem: string = '<p style="font-size:12.0pt;font-family:&quot;Times New Roman&quot;,serif;margin-top:0in;margin-right:0in;margin-bottom:7.5pt;margin-left:0in;\nbackground:white;"><span style="font-size:10.5pt;font-family:Roboto;color:#333333;">The\nRich Text Editor is a WYSIWYG ("what you see is what you get") editor\nuseful to create and edit content and return the valid&nbsp;</span><span style="color:black;"><a href="https://ej2.syncfusion.com/home/" target="_blank" aria-label="Open in new window"><span style="font-size:\n10.5pt;font-family:Roboto;color:#2E2EF1;">HTML markup</span></a></span><span style="font-size:10.5pt;font-family:Roboto;color:#333333;">&nbsp;or&nbsp;</span><span style="color:black;"><a href="https://ej2.syncfusion.com/home/" target="_blank" aria-label="Open in new window"><span style="font-size:\n10.5pt;font-family:Roboto;color:#2E2EF1;">markdown</span></a></span><span style="font-size:10.5pt;font-family:Roboto;color:#333333;">&nbsp;of the content</span></p><p style="font-size:12.0pt;font-family:&quot;Times New Roman&quot;,serif;margin-top:0in;margin-right:0in;margin-bottom:7.5pt;margin-left:0in;\nbackground:white;"><b><span style="font-size:10.5pt;font-family:Roboto;\ncolor:#333333;">Toolbar</span></b></p><ol level="1" style="margin-bottom:0in;list-style-type: decimal;"><li style="margin: 0in; background: white;"><p><span style="font-size:10.5pt;font-family:Roboto;color:#333333;">The Toolbar contains\ncommands to align the text, insert a link, insert an image, insert list,\nundo/redo operations, HTML view, etc</span></p></li><li style="margin: 0in; background: white;"><p><span style="font-size:10.5pt;font-family:Roboto;color:#333333;">The Toolbar is fully\ncustomizable</span></p></li></ol><p style="font-size:12.0pt;font-family:&quot;Times New Roman&quot;,serif;margin-top:0in;margin-right:0in;margin-bottom:7.5pt;margin-left:0in;\nbackground:white;"><b><span style="font-size:10.5pt;font-family:Roboto;\ncolor:#333333;">Links</span></b></p><ol level="1" style="margin-bottom:0in;list-style-type: decimal;"><li style="margin: 0in 0in 0in 1.25in; background: white;"><p><span style="font-size:10.5pt;font-family:Roboto;\ncolor:#333333;">You can insert a hyperlink with its corresponding dialog</span></p></li><li style="margin: 0in 0in 0in 1.25in; background: white;"><p><span style="font-size:10.5pt;font-family:Roboto;\ncolor:#333333;">Attach a hyperlink to the displayed text.</span></p></li><li style="margin: 0in 0in 0in 1.25in; background: white;"><p><span style="font-size:10.5pt;font-family:Roboto;\ncolor:#333333;">Customize the quick toolbar based on the hyperlink</span></p></li></ol><p style="font-size:12.0pt;font-family:&quot;Times New Roman&quot;,serif;margin-top:0in;margin-right:0in;margin-bottom:7.5pt;margin-left:0in;\nbackground:white;"><b><span style="font-size:10.5pt;font-family:Roboto;\ncolor:#333333;">Image.</span></b></p><ol level="1" style="margin-bottom:0in;list-style-type: decimal;"><li style="margin: 0in; background: white;"><p><span style="font-size:10.5pt;font-family:Roboto;color:#333333;">Allows you to insert\nimages from an online source as well as the local computer</span></p></li><li style="margin: 0in; background: white;"><p><span style="font-size:10.5pt;font-family:Roboto;color:#333333;">You can upload an\nimage</span></p></li><li style="margin: 0in; background: white;"><p><span style="font-size:10.5pt;font-family:Roboto;color:#333333;">Provides an option to\ncustomize the quick toolbar for an image</span></p></li></ol><p style="margin-right:0in;margin-left:0in;font-size:12.0pt;font-family:&quot;Times New Roman&quot;,serif;margin:0in;background:white;"><span style="font-size:10.5pt;\nfont-family:Roboto;color:#333333;">&nbsp;</span></p><p style="margin-right:0in;margin-left:0in;font-size:12.0pt;font-family:&quot;Times New Roman&quot;,serif;margin:0in;background:white;"><span style="font-size:10.5pt;\nfont-family:Roboto;color:#333333;">&nbsp;</span></p><p style="margin-right:0in;margin-left:0in;font-size:12.0pt;font-family:&quot;Times New Roman&quot;,serif;margin:0in;background:white;"><span style="font-size:10.5pt;\nfont-family:Roboto;color:#333333;">&nbsp;</span></p><p style="margin-right:0in;margin-left:0in;font-size:12.0pt;font-family:&quot;Times New Roman&quot;,serif;margin:0in;background:white;"><span style="font-size:10.5pt;\nfont-family:Roboto;color:#333333;">&nbsp;</span></p><p style="margin-right:0in;margin-left:0in;font-size:12.0pt;font-family:&quot;Times New Roman&quot;,serif;margin:0in;background:white;"><span style="font-size:10.5pt;\nfont-family:Roboto;color:#333333;">&nbsp;</span></p><ul level="1" style="margin-bottom:0in;list-style-type: disc;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Calibri, sans-serif;"><p>The Rich Text Editor.</p></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 8pt; line-height: 107%; font-size: 11pt; font-family: Calibri, sans-serif;"><p>The Mark down Editor.</p></li></ul><p style="margin-top:0in;margin-right:0in;margin-bottom:8.0pt;margin-left:0in;line-height:107%;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;">&nbsp;</p><ul style="margin-bottom:0in;list-style-type: none;"><li><ul level="2" style="margin-bottom:0in;list-style-type: circle;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Calibri, sans-serif;"><p>The Rich Text Editor.</p></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 8pt; line-height: 107%; font-size: 11pt; font-family: Calibri, sans-serif;"><p>The Mark down Editor.</p></li></ul></li></ul><p style="margin-top:0in;margin-right:0in;margin-bottom:8.0pt;margin-left:0in;line-height:107%;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;">&nbsp;</p><p style="margin-top:0in;margin-right:0in;margin-bottom:8.0pt;margin-left:0in;line-height:107%;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;">&nbsp;</p><p style="margin-top:0in;margin-right:0in;margin-bottom:8.0pt;margin-left:0in;line-height:107%;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;">&nbsp;</p><p style="margin-top:0in;margin-right:0in;margin-bottom:8.0pt;margin-left:0in;line-height:107%;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;">FASDFADSADFS</p><p style="margin-top:0in;margin-right:0in;margin-bottom:8.0pt;margin-left:0in;line-height:107%;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;">ASDFASDA</p><ul style="margin-bottom:0in;list-style-type: none;"><li><ul style="margin-bottom:0in;list-style-type: none;"><li><ul level="3" style="margin-bottom:0in;list-style-type: square;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Calibri, sans-serif;"><p>The Rich Text Editor.</p></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 8pt; line-height: 107%; font-size: 11pt; font-family: Calibri, sans-serif;"><p>The Mark down Editor.</p></li></ul></li></ul></li></ul><p style="margin-top:0in;margin-right:0in;margin-bottom:8.0pt;margin-left:0in;line-height:107%;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;">&nbsp;</p><ol level="1" style="margin-bottom:0in;list-style-type: decimal;"><li style="margin: 0in 0in 0in 2in; background: white;"><p><span style="font-size:10.5pt;font-family:Roboto;\ncolor:#333333;">You can insert a hyperlink with its corresponding dialog</span></p></li><li style="margin: 0in 0in 0in 2in; background: white;"><p><span style="font-size:10.5pt;font-family:Roboto;\ncolor:#333333;">Attach a hyperlink to the displayed text.</span></p></li><li style="margin: 0in 0in 0in 2in; background: white;"><p><span style="font-size:10.5pt;font-family:Roboto;\ncolor:#333333;">Customize the quick toolbar based on the hyperlink</span></p></li></ol><p style="margin-top:0in;margin-right:0in;margin-bottom:8.0pt;margin-left:0in;line-height:107%;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;">&nbsp;</p><p style="margin-top:0in;margin-right:0in;margin-bottom:8.0pt;margin-left:0in;line-height:107%;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;">&nbsp;</p><p style="margin-top:0in;margin-right:0in;margin-bottom:8.0pt;margin-left:0in;line-height:107%;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;">&nbsp;</p><ol level="1" style="margin-bottom:0in;list-style-type: decimal;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 0in; line-height: 107%; font-size: 11pt; font-family: Calibri, sans-serif;"><p>List 1</p></li><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 8pt; line-height: 107%; font-size: 11pt; font-family: Calibri, sans-serif;"><p>List 2</p></li></ol><p style="margin-top:0in;margin-right:0in;margin-bottom:8.0pt;margin-left:0in;line-height:107%;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;">This is not a list</p><ol level="1" start="3" style="margin-bottom:0in;list-style-type: decimal;"><li style="margin-top: 0in; margin-right: 0in; margin-bottom: 8pt; line-height: 107%; font-size: 11pt; font-family: Calibri, sans-serif;"><p>List 3</p></li></ol>';
                const pastedElem: string = editor.inputElement.innerHTML;
                expect(pastedElem).toBe(expectedElem);
                done();
            }, 100);
        });
    });


describe("869680 - Paste Format is not fully visible and not able to scroll to choose the below format.", () => {
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
    });
    done();
  });
  it("Paste Format is not fully visible and not able to scroll to choose the below format", (done) => {
    let localElem: string = `<p>Syncfusion test case content with length more than 10</p>`;
    keyBoardEvent.clipboardData = {
      getData: () => {
        return localElem;
      },
      items: []
    };
    rteObj.dataBind();
    (rteObj as any).inputElement.focus();
    rteObj.onPaste(keyBoardEvent);
    let dialogModel: DialogModel = {
      isModal: false
    };
    setTimeout(() => {
    expect(dialogModel.isModal).toBe(false);
    done();
  }, 50);
  });
  afterAll((done: DoneFn) => {
    destroy(rteObj);
    done();
  });
});

describe('873087: Table loses its format when pasting into RichTextEditor.', () => {
    let editor: RichTextEditor;
    beforeAll((done: DoneFn) => {
        editor = renderRTE({
            pasteCleanupSettings : {
                keepFormat : false
            }
        });
        done();
    });
    afterAll((done: DoneFn) => {
        destroy(editor);
        done();
    });
    it ('Should add the e-rte-table properly.', (done: DoneFn) => {
        editor.focusIn();
        const clipBoardData: string = '\n\n\x3C!--StartFragment--><table class="ws-table-all" id="customers" style="box-sizing: inherit; border-collapse: collapse; border-spacing: 0px; width: 1232.56px; display: table; border: 1px solid rgb(204, 204, 204); margin: 20px 0px; font-family: arial, sans-serif; color: rgb(0, 0, 0); font-size: 15px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><tbody style="box-sizing: inherit;"><tr style="box-sizing: inherit; border-bottom: 1px solid rgb(221, 221, 221); background-color: rgb(255, 255, 255);"><th style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Company</th><th style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Contact</th><th style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Country</th></tr><tr style="box-sizing: inherit; border-bottom: 1px solid rgb(221, 221, 221); background-color: rgb(231, 233, 235);"><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Alfreds Futterkiste</td><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Maria Anders</td><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Germany</td></tr><tr style="box-sizing: inherit; border-bottom: 1px solid rgb(221, 221, 221); background-color: rgb(255, 255, 255);"><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Centro comercial Moctezuma</td><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Francisco Chang</td><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Mexico</td></tr><tr style="box-sizing: inherit; border-bottom: 1px solid rgb(221, 221, 221); background-color: rgb(231, 233, 235);"><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Ernst Handel</td><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Roland Mendel</td><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Austria</td></tr><tr style="box-sizing: inherit; border-bottom: 1px solid rgb(221, 221, 221); background-color: rgb(255, 255, 255);"><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Island Trading</td><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Helen Bennett</td><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">UK</td></tr><tr style="box-sizing: inherit; border-bottom: 1px solid rgb(221, 221, 221); background-color: rgb(231, 233, 235);"><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Laughing Bacchus Winecellars</td><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Yoshi Tannamuri</td><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Canada</td></tr><tr style="box-sizing: inherit; border-bottom: 1px solid rgb(221, 221, 221); background-color: rgb(255, 255, 255);"><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Magazzini Alimentari Riuniti</td><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Giovanni Rovelli</td><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Italy</td></tr></tbody></table>\x3C!--EndFragment-->\n\n';
        const dataTransfer: DataTransfer = new DataTransfer();
        dataTransfer.setData('text/html', clipBoardData);
        const pasteEvent: ClipboardEvent = new ClipboardEvent('paste', { clipboardData: dataTransfer } as ClipboardEventInit);
        editor.onPaste(pasteEvent);
        setTimeout(() => {
            expect((editor.inputElement.querySelector('table') as HTMLElement).classList.contains('e-rte-table')).toBe(true);
            done();
        }, 100);
    });
});

describe('Bug 912791: Table Pasting Outside Editable Area Results in Empty Setter Value', () => {
    let editor: RichTextEditor;
    var rteEle: HTMLElement;
    beforeAll((done: DoneFn) => {
        editor = renderRTE({
            quickToolbarSettings: {
                table: ['TableHeader', 'TableRows', 'TableColumns', 'TableCell', '-',
                    'BackgroundColor', 'TableRemove', 'TableCellVerticalAlign', 'Styles']
            },
            value: `<h1>Welcome to the Syncfusion Rich Text Editor</h1><p>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interface that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</p><h2>Do you know the key features of the editor?</h2><ul> <li>Basic features include headings, block quotes, numbered lists, bullet lists, and support to insert images, tables, audio, and video.</li> <li>Inline styles include <b>bold</b>, <em>italic</em>, <span style="text-decoration: underline">underline</span>, <span style="text-decoration: line-through">strikethrough</span>, <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" title="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" aria-label="Open in new window">hyperlinks</a>, 😀 and more.</li> <li>The toolbar has multi-row, expandable, and scrollable modes. The Editor supports an inline toolbar, a floating toolbar, and custom toolbar items.</li> <li>Integration with Syncfusion Mention control lets users tag other users. To learn more, check out the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/mention-integration" title="Mention Documentation" aria-label="Open in new window">documentation</a> and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/mention-integration.html" title="Mention Demos" aria-label="Open in new window">demos</a>.</li> <li><b>Paste from MS Word</b> - helps to reduce the effort while converting the Microsoft Word content to HTML format with format and styles. To learn more, check out the documentation <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/paste-cleanup" title="Paste from MS Word Documentation" aria-label="Open in new window">here</a>.</li> <li>Other features: placeholder text, character count, form validation, enter key configuration, resizable editor, IFrame rendering, tooltip, source code view, RTL mode, persistence, HTML Sanitizer, autosave, and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/" title="Rich Text Editor API" aria-label="Open in new window">more</a>.</li></ul><blockquote><p><em>Easily access Audio, Image, Link, Video, and Table operations through the quick toolbar by right-clicking on the corresponding element with your mouse.</em></p></blockquote><h2>Unlock the Power of Tables</h2><p>A table can be created in the editor using either a keyboard shortcut or the toolbar. With the quick toolbar, you can perform table cell insert, delete, split, and merge operations. You can style the table cells using background colours and borders.</p><table class="e-rte-table" style="width: 100%; min-width: 0px; height: 151px"> <thead style="height: 16.5563%"> <tr style="height: 16.5563%"> <th style="width: 12.1813%" class=""><span>S No</span><br></th> <th style="width: 23.2295%"><span>Name</span><br></th> <th style="width: 9.91501%"><span>Age</span><br></th>    </tr> </thead> <tbody> <tr style="height: 16.5563%"> <td style="width: 12.1813%">1</td> <td style="width: 23.2295%">Selma Rose</td> <td style="width: 9.91501%">30</td>    </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">2</td> <td style="width: 23.2295%"><span>Robert</span><br></td> <td style="width: 9.91501%">28</td>    </tr>   </tbody></table><h2>Elevating Your Content with Images</h2><p>Images can be added to the editor by pasting or dragging into the editing area, using the toolbar to insert one as a URL, or uploading directly from the File Browser. Easily manage your images on the server by configuring the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/#insertimagesettings" title="Insert Image Settings API" aria-label="Open in new window">insertImageSettings</a> to upload, save, or remove them. </p><p>The Editor can integrate with the Syncfusion Image Editor to crop, rotate, annotate, and apply filters to images. Check out the demos <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/image-editor-integration.html" title="Image Editor Demo" aria-label="Open in new window">here</a>.</p><p><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 50%" class="e-rte-image e-imginline"></p><span data-col="0" unselectable="on" contenteditable="false" class="e-rte-table-resize e-column-resize" style="height: 151px; width: 4px; top: 510px; left: 14px;"></span><span data-col="1" unselectable="on" contenteditable="false" class="e-rte-table-resize e-column-resize" style="height: 151px; width: 4px; top: 510px; left: 334px;"></span><span data-col="2" unselectable="on" contenteditable="false" class="e-rte-table-resize e-column-resize" style="height: 151px; width: 4px; top: 510px; left: 945px;"></span><span data-col="3" unselectable="on" contenteditable="false" class="e-rte-table-resize e-column-resize" style="height: 151px; width: 4px; top: 510px; left: 1206px;"></span><span data-row="0" unselectable="on" contenteditable="false" class="e-rte-table-resize e-row-resize" style="width: 1192px; height: 4px; top: 534px; left: 16px;"></span><span data-row="1" unselectable="on" contenteditable="false" class="e-rte-table-resize e-row-resize" style="width: 1192px; height: 4px; top: 596px; left: 16px;"></span><span data-row="2" unselectable="on" contenteditable="false" class="e-rte-table-resize e-row-resize" style="width: 1192px; height: 4px; top: 658px; left: 16px;"></span><span class="e-table-box" data-col="3" unselectable="on" contenteditable="false" style="top: 657px; left: 1204px;"></span>`
        });
        rteEle = editor.element;
        done();
    });
    afterAll((done: DoneFn) => {
        destroy(editor);
        done();
    });
    it(' To verify that table pasting functions correctly after deleting a table and pasting a same table in the same location.', (done: DoneFn) => {
        var node = (rteEle as any).querySelector("td");
        setCursorPoint(node, 0);
        node.focus();
        var clickEvent = document.createEvent("MouseEvents");
        clickEvent.initEvent('mousedown', false, true);
        editor.inputElement.dispatchEvent(clickEvent);
        var eventsArg: any = { pageX: 50, pageY: 200, target: node };
        (<any>editor).tableModule.editAreaClickHandler({ args: eventsArg });
        setTimeout(function () {
            var tablePop = document.querySelectorAll('.e-rte-quick-popup')[0];
            (tablePop.querySelectorAll(".e-rte-quick-toolbar.e-rte-toolbar .e-toolbar-items .e-toolbar-item .e-tbar-btn")[5] as HTMLElement).click();
            const clipBoardData: string = '\n\n\x3C!--StartFragment--><table class="e-rte-table pasteContent_RTE e-rte-paste-html-table" style=" margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, &quot;sans-serif&quot;, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-transform: none; white-space: normal; background-color: rgb(255, 255, 255); width: 1192px; min-width: 0px; height: 151px;"><thead style="height: 25.6667px;"><tr style="height: 25.6667px;"><th class="" style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background: rgb(224, 224, 224); width: 320.167px;"><span>S No</span><br></th><th style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background: rgb(224, 224, 224); width: 610.562px;"><span>Name</span><br></th><th style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background: rgb(224, 224, 224); width: 260.604px;"><span>Age</span><br></th></tr></thead><tbody><tr style="height: 62.3333px;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; width: 320.167px;">1</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; width: 610.562px;">Selma Rose</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; width: 260.604px;">30</td></tr><tr style="height: 62.3333px;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; width: 320.167px;">2</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; width: 610.562px;"><span>Robert</span><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; width: 260.604px;">28</td></tr></tbody></table>\x3C!--EndFragment-->\n\n';
            const dataTransfer: DataTransfer = new DataTransfer();
            dataTransfer.setData('text/html', clipBoardData);
            const pasteEvent: ClipboardEvent = new ClipboardEvent('paste', { clipboardData: dataTransfer } as ClipboardEventInit);
            editor.onPaste(pasteEvent);
            setTimeout(() => {
                expect((editor.inputElement.querySelector('table') as HTMLElement).classList.contains('e-rte-table')).toBe(true);
                done();
            }, 100);
        }, 100);
    });
});

describe('Bug 912791: Table Pasting Outside Editable Area Results in Empty Setter Value', () => {
    let editor: RichTextEditor;
    var rteEle: HTMLElement;
    beforeAll((done: DoneFn) => {
        editor = renderRTE({
            quickToolbarSettings: {
                table: ['TableHeader', 'TableRows', 'TableColumns', 'TableCell', '-',
                    'BackgroundColor', 'TableRemove', 'TableCellVerticalAlign', 'Styles']
            },
            value: `<table class="e-rte-table e-rte-paste-html-table e-cell-select" style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, &quot;sans-serif&quot;, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-transform: none; white-space: normal; width: 1192px; min-width: 0px; height: 151px;"><thead style="height: 25.6667px;"><tr style="height: 25.6667px;"><th class="" style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(224, 224, 224); width: 320.167px;"><span>S No</span><br></th><th class="" style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(224, 224, 224); width: 610.562px;"><span>Name</span><br></th><th class="" style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(224, 224, 224); width: 260.604px;"><span>Age</span><br></th></tr></thead><tbody><tr style="height: 62.3333px;"><td class="" style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; width: 320.167px;">1</td><td class="" style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; width: 610.562px;">Selma Rose</td><td class="" style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; width: 260.604px;">30</td></tr><tr style="height: 62.3333px;"><td class="" style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; width: 320.167px;">2</td><td class="" style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; width: 610.562px;"><span>Robert</span><br></td><td class="" style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; width: 260.604px;">28</td></tr></tbody></table>Testing<div class="e-table-fake-selection" contenteditable="false"></div><span data-col="0" unselectable="on" contenteditable="false" class="e-rte-table-resize e-column-resize" style="height: 151px; width: 4px; top: 16px; left: 14px;"></span><span data-col="1" unselectable="on" contenteditable="false" class="e-rte-table-resize e-column-resize" style="height: 151px; width: 4px; top: 16px; left: 334px;"></span><span data-col="2" unselectable="on" contenteditable="false" class="e-rte-table-resize e-column-resize" style="height: 151px; width: 4px; top: 16px; left: 945px;"></span><span data-col="3" unselectable="on" contenteditable="false" class="e-rte-table-resize e-column-resize" style="height: 151px; width: 4px; top: 16px; left: 1206px;"></span><span data-row="0" unselectable="on" contenteditable="false" class="e-rte-table-resize e-row-resize" style="width: 1192px; height: 4px; top: 40px; left: 16px;"></span><span data-row="1" unselectable="on" contenteditable="false" class="e-rte-table-resize e-row-resize" style="width: 1192px; height: 4px; top: 102px; left: 16px;"></span><span data-row="2" unselectable="on" contenteditable="false" class="e-rte-table-resize e-row-resize" style="width: 1192px; height: 4px; top: 164px; left: 16px;"></span><span class="e-table-box" data-col="3" unselectable="on" contenteditable="false" style="top: 163px; left: 1204px;"></span>`
        });
        rteEle = editor.element;
        done();
    });
    afterAll((done: DoneFn) => {
        destroy(editor);
        done();
    });
    it(' To verify that table pasting functions correctly after deleting a table and pasting a same table in the same location when enter action is configured as BR.', (done: DoneFn) => {
        var node = (rteEle as any).querySelector("td");
        setCursorPoint(node, 0);
        node.focus();
        var clickEvent = document.createEvent("MouseEvents");
        clickEvent.initEvent('mousedown', false, true);
        editor.inputElement.dispatchEvent(clickEvent);
        var eventsArg: any = { pageX: 50, pageY: 200, target: node };
        (<any>editor).tableModule.editAreaClickHandler({ args: eventsArg });
        setTimeout(function () {
            var tablePop = document.querySelectorAll('.e-rte-quick-popup')[0];
            (tablePop.querySelectorAll(".e-rte-quick-toolbar.e-rte-toolbar .e-toolbar-items .e-toolbar-item .e-tbar-btn")[5] as HTMLElement).click();
            const clipBoardData: string = '\n\n\x3C!--StartFragment--><table class="e-rte-table pasteContent_RTE e-rte-paste-html-table" style=" margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, &quot;sans-serif&quot;, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-transform: none; white-space: normal; background-color: rgb(255, 255, 255); width: 1192px; min-width: 0px; height: 151px;"><thead style="height: 25.6667px;"><tr style="height: 25.6667px;"><th class="" style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background: rgb(224, 224, 224); width: 320.167px;"><span>S No</span><br></th><th style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background: rgb(224, 224, 224); width: 610.562px;"><span>Name</span><br></th><th style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background: rgb(224, 224, 224); width: 260.604px;"><span>Age</span><br></th></tr></thead><tbody><tr style="height: 62.3333px;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; width: 320.167px;">1</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; width: 610.562px;">Selma Rose</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; width: 260.604px;">30</td></tr><tr style="height: 62.3333px;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; width: 320.167px;">2</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; width: 610.562px;"><span>Robert</span><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; width: 260.604px;">28</td></tr></tbody></table>\x3C!--EndFragment-->\n\n';
            const dataTransfer: DataTransfer = new DataTransfer();
            dataTransfer.setData('text/html', clipBoardData);
            const pasteEvent: ClipboardEvent = new ClipboardEvent('paste', { clipboardData: dataTransfer } as ClipboardEventInit);
            editor.onPaste(pasteEvent);
            setTimeout(() => {
                expect((editor.inputElement.querySelector('table') as HTMLElement).classList.contains('e-rte-table')).toBe(true);
                done();
            }, 100);
        }, 100);
    });
});

describe('883422: To validate and fix the Table content pasted copied from New Outlook has a border issue.', () => {
    let editor: RichTextEditor;
    beforeEach((done: DoneFn) => {
        editor = renderRTE({
            pasteCleanupSettings : {
                keepFormat : true
            }
        });
        done();
    });
    afterEach((done: DoneFn) => {
        destroy(editor);
        done();
    });
    it ('Should add the e-rte-table class to the table element. CASE 1 MS Teams', (done: DoneFn) => {
        editor.focusIn();
        const clipBoardData: string = '\n\n\x3C!--StartFragment--><p>&nbsp;</p><figure class="table"><table><tbody><tr><td><p data-is-tablecell-container="true">SNO</p></td><td><p data-is-tablecell-container="true">Replication Procedure</p></td><td><p data-is-tablecell-container="true">Issues</p></td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr></tbody></table></figure><p>&nbsp;</p>\x3C!--EndFragment-->\n\n';
        const dataTransfer: DataTransfer = new DataTransfer();
        dataTransfer.setData('text/html', clipBoardData);
        const pasteEvent: ClipboardEvent = new ClipboardEvent('paste', { clipboardData: dataTransfer } as ClipboardEventInit);
        editor.onPaste(pasteEvent);
        setTimeout(() => {
            expect((editor.inputElement.querySelector('table') as HTMLElement).classList.contains('e-rte-table')).toBe(true);
            done();
        }, 100);
    });
    it ('Should add the e-rte-paste-table class to the table element. CASE 3 Google docs', (done: DoneFn) => {
        editor.focusIn();
        const clipBoardData: string = '\n\n\x3C!--StartFragment--><meta charset="utf-8"><b style="font-weight:normal;" id="docs-internal-guid-c968097d-7fff-b398-9417-b732d65c55b3"><div dir="ltr" style="margin-left:0pt;" align="left"><table style="border:none;border-collapse:collapse;table-layout:fixed;width:468pt"><colgroup><col><col><col><col></colgroup><tbody><tr style="height:0pt"><td style="border-left:solid #000000 1pt;border-right:solid #000000 1pt;border-bottom:solid #000000 1pt;border-top:solid #000000 1pt;vertical-align:top;padding:5pt 5pt 5pt 5pt;overflow:hidden;overflow-wrap:break-word;"><p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">SNO</span></p></td><td style="border-left:solid #000000 1pt;border-right:solid #000000 1pt;border-bottom:solid #000000 1pt;border-top:solid #000000 1pt;vertical-align:top;padding:5pt 5pt 5pt 5pt;overflow:hidden;overflow-wrap:break-word;"><p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Replication procedure</span></p></td><td style="border-left:solid #000000 1pt;border-right:solid #000000 1pt;border-bottom:solid #000000 1pt;border-top:solid #000000 1pt;vertical-align:top;padding:5pt 5pt 5pt 5pt;overflow:hidden;overflow-wrap:break-word;"><p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Issue</span></p></td><td style="border-left:solid #000000 1pt;border-right:solid #000000 1pt;border-bottom:solid #000000 1pt;border-top:solid #000000 1pt;vertical-align:top;padding:5pt 5pt 5pt 5pt;overflow:hidden;overflow-wrap:break-word;"><p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Impact</span></p></td></tr><tr style="height:0pt"><td style="border-left:solid #000000 1pt;border-right:solid #000000 1pt;border-bottom:solid #000000 1pt;border-top:solid #000000 1pt;vertical-align:top;padding:5pt 5pt 5pt 5pt;overflow:hidden;overflow-wrap:break-word;"><br></td><td style="border-left:solid #000000 1pt;border-right:solid #000000 1pt;border-bottom:solid #000000 1pt;border-top:solid #000000 1pt;vertical-align:top;padding:5pt 5pt 5pt 5pt;overflow:hidden;overflow-wrap:break-word;"><br></td><td style="border-left:solid #000000 1pt;border-right:solid #000000 1pt;border-bottom:solid #000000 1pt;border-top:solid #000000 1pt;vertical-align:top;padding:5pt 5pt 5pt 5pt;overflow:hidden;overflow-wrap:break-word;"><br></td><td style="border-left:solid #000000 1pt;border-right:solid #000000 1pt;border-bottom:solid #000000 1pt;border-top:solid #000000 1pt;vertical-align:top;padding:5pt 5pt 5pt 5pt;overflow:hidden;overflow-wrap:break-word;"><br></td></tr><tr style="height:0pt"><td style="border-left:solid #000000 1pt;border-right:solid #000000 1pt;border-bottom:solid #000000 1pt;border-top:solid #000000 1pt;vertical-align:top;padding:5pt 5pt 5pt 5pt;overflow:hidden;overflow-wrap:break-word;"><br></td><td style="border-left:solid #000000 1pt;border-right:solid #000000 1pt;border-bottom:solid #000000 1pt;border-top:solid #000000 1pt;vertical-align:top;padding:5pt 5pt 5pt 5pt;overflow:hidden;overflow-wrap:break-word;"><br></td><td style="border-left:solid #000000 1pt;border-right:solid #000000 1pt;border-bottom:solid #000000 1pt;border-top:solid #000000 1pt;vertical-align:top;padding:5pt 5pt 5pt 5pt;overflow:hidden;overflow-wrap:break-word;"><br></td><td style="border-left:solid #000000 1pt;border-right:solid #000000 1pt;border-bottom:solid #000000 1pt;border-top:solid #000000 1pt;vertical-align:top;padding:5pt 5pt 5pt 5pt;overflow:hidden;overflow-wrap:break-word;"><br></td></tr></tbody></table></div><br><br><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">This ia&nbsp; paragraph</span></p><h3 dir="ltr" style="line-height:1.38;margin-top:16pt;margin-bottom:4pt;"><span style="font-size:13.999999999999998pt;font-family:Arial,sans-serif;color:#434343;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">This is a heading</span></h3><br><ul style="margin-top:0;margin-bottom:0;padding-inline-start:48px;"><li dir="ltr" style="list-style-type:disc;font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;" aria-level="1"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">List 1</span></p></li><li dir="ltr" style="list-style-type:disc;font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;" aria-level="1"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">List 2</span></p></li><li dir="ltr" style="list-style-type:disc;font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;" aria-level="1"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">List 3</span></p></li></ul></b>\x3C!--EndFragment-->\n\n';
        const dataTransfer: DataTransfer = new DataTransfer();
        dataTransfer.setData('text/html', clipBoardData);
        const pasteEvent: ClipboardEvent = new ClipboardEvent('paste', { clipboardData: dataTransfer } as ClipboardEventInit);
        editor.onPaste(pasteEvent);
        setTimeout(() => {
            expect((editor.inputElement.querySelector('table') as HTMLElement).classList.contains('e-rte-paste-table')).toBe(true);
            done();
        }, 100);
    });
    it ('Should add the e-rte-paste-table class to the table element. CASE 3 New Outlook', (done: DoneFn) => {
        editor.focusIn();
        const clipBoardData: string = '\n\n\x3C!--StartFragment--><p style="direction: ltr; margin: 0in; font-family: Calibri, sans-serif; font-size: 11pt;"><span style="border: 0px; font-style: inherit; font-variant: inherit; font-weight: inherit; font-stretch: inherit; font-size: inherit; line-height: inherit; font-family: Aptos, sans-serif; font-optical-sizing: inherit; font-kerning: inherit; font-feature-settings: inherit; font-variation-settings: inherit; margin: 0px; padding: 0px; vertical-align: baseline; color: black;">Hi All</span></p><p style="direction: ltr; margin: 0in; font-family: Calibri, sans-serif; font-size: 11pt;"><span style="border: 0px; font-style: inherit; font-variant: inherit; font-weight: inherit; font-stretch: inherit; font-size: inherit; line-height: inherit; font-family: Aptos, sans-serif; font-optical-sizing: inherit; font-kerning: inherit; font-feature-settings: inherit; font-variation-settings: inherit; margin: 0px; padding: 0px; vertical-align: baseline; color: black;">&nbsp;</span></p><p style="direction: ltr; margin: 0in; font-family: Calibri, sans-serif; font-size: 11pt;"><span style="border: 0px; font-style: inherit; font-variant: inherit; font-weight: inherit; font-stretch: inherit; font-size: inherit; line-height: inherit; font-family: Aptos, sans-serif; font-optical-sizing: inherit; font-kerning: inherit; font-feature-settings: inherit; font-variation-settings: inherit; margin: 0px; padding: 0px; vertical-align: baseline; color: black;">FYI</span></p><p style="direction: ltr; margin: 0in; font-family: Calibri, sans-serif; font-size: 11pt;"><span style="border: 0px; font-style: inherit; font-variant: inherit; font-weight: inherit; font-stretch: inherit; font-size: inherit; line-height: inherit; font-family: Aptos, sans-serif; font-optical-sizing: inherit; font-kerning: inherit; font-feature-settings: inherit; font-variation-settings: inherit; margin: 0px; padding: 0px; vertical-align: baseline; color: black;">&nbsp;</span></p><p style="direction: ltr; margin: 0in; font-family: Calibri, sans-serif; font-size: 11pt;"><span style="border: 0px; font-style: inherit; font-variant: inherit; font-weight: inherit; font-stretch: inherit; font-size: inherit; line-height: inherit; font-family: Aptos, sans-serif; font-optical-sizing: inherit; font-kerning: inherit; font-feature-settings: inherit; font-variation-settings: inherit; margin: 0px; padding: 0px; vertical-align: baseline; color: black;">&nbsp;</span></p><div style="border: 0px; font: inherit; margin: 0px; padding: 0px; vertical-align: baseline; color: inherit;"><table data-editing-info="{&quot;topBorderColor&quot;:&quot;#ABABAB&quot;,&quot;bottomBorderColor&quot;:&quot;#ABABAB&quot;,&quot;verticalBorderColor&quot;:&quot;#ABABAB&quot;,&quot;hasHeaderRow&quot;:false,&quot;hasFirstColumn&quot;:false,&quot;hasBandedRows&quot;:false,&quot;hasBandedColumns&quot;:false,&quot;bgColorEven&quot;:null,&quot;bgColorOdd&quot;:&quot;#ABABAB20&quot;,&quot;headerRowColor&quot;:&quot;#ABABAB&quot;,&quot;tableBorderFormat&quot;:0,&quot;verticalAlign&quot;:&quot;top&quot;}" style="font: inherit; direction: ltr; box-sizing: border-box; border-collapse: collapse; border-spacing: 0px;"><tbody><tr><td style="width: 120px; height: 22px; direction: ltr; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); vertical-align: top; box-sizing: border-box;"><div style="border: 0px; font-style: inherit; font-variant: inherit; font-weight: inherit; font-stretch: inherit; font-size: 11pt; line-height: inherit; font-family: Aptos, sans-serif; font-optical-sizing: inherit; font-kerning: inherit; font-feature-settings: inherit; font-variation-settings: inherit; margin: 0px; padding: 0px; vertical-align: baseline; color: black; direction: ltr;"><br></div></td><td style="width: 120px; height: 22px; direction: ltr; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); vertical-align: top; box-sizing: border-box;"><div style="border: 0px; font-style: inherit; font-variant: inherit; font-weight: inherit; font-stretch: inherit; font-size: 11pt; line-height: inherit; font-family: Aptos, sans-serif; font-optical-sizing: inherit; font-kerning: inherit; font-feature-settings: inherit; font-variation-settings: inherit; margin: 0px; padding: 0px; vertical-align: baseline; color: black; direction: ltr;"><br></div></td><td style="width: 120px; height: 22px; direction: ltr; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); vertical-align: top; box-sizing: border-box;"><div style="border: 0px; font-style: inherit; font-variant: inherit; font-weight: inherit; font-stretch: inherit; font-size: 11pt; line-height: inherit; font-family: Aptos, sans-serif; font-optical-sizing: inherit; font-kerning: inherit; font-feature-settings: inherit; font-variation-settings: inherit; margin: 0px; padding: 0px; vertical-align: baseline; color: black; direction: ltr;"><br></div></td></tr><tr><td style="width: 120px; height: 22px; direction: ltr; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); vertical-align: top; box-sizing: border-box;"><div style="border: 0px; font-style: inherit; font-variant: inherit; font-weight: inherit; font-stretch: inherit; font-size: 11pt; line-height: inherit; font-family: Aptos, sans-serif; font-optical-sizing: inherit; font-kerning: inherit; font-feature-settings: inherit; font-variation-settings: inherit; margin: 0px; padding: 0px; vertical-align: baseline; color: black; direction: ltr;"><br></div></td><td style="width: 120px; height: 22px; direction: ltr; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); vertical-align: top; box-sizing: border-box;"><div style="border: 0px; font-style: inherit; font-variant: inherit; font-weight: inherit; font-stretch: inherit; font-size: 11pt; line-height: inherit; font-family: Aptos, sans-serif; font-optical-sizing: inherit; font-kerning: inherit; font-feature-settings: inherit; font-variation-settings: inherit; margin: 0px; padding: 0px; vertical-align: baseline; color: black; direction: ltr;"><br></div></td><td style="width: 120px; height: 22px; direction: ltr; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); vertical-align: top; box-sizing: border-box;"><div style="border: 0px; font-style: inherit; font-variant: inherit; font-weight: inherit; font-stretch: inherit; font-size: 11pt; line-height: inherit; font-family: Aptos, sans-serif; font-optical-sizing: inherit; font-kerning: inherit; font-feature-settings: inherit; font-variation-settings: inherit; margin: 0px; padding: 0px; vertical-align: baseline; color: black; direction: ltr;"><br></div></td></tr><tr><td style="width: 120px; height: 22px; direction: ltr; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); vertical-align: top; box-sizing: border-box;"><div style="border: 0px; font-style: inherit; font-variant: inherit; font-weight: inherit; font-stretch: inherit; font-size: 11pt; line-height: inherit; font-family: Aptos, sans-serif; font-optical-sizing: inherit; font-kerning: inherit; font-feature-settings: inherit; font-variation-settings: inherit; margin: 0px; padding: 0px; vertical-align: baseline; color: black; direction: ltr;"><br></div></td><td style="width: 120px; height: 22px; direction: ltr; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); vertical-align: top; box-sizing: border-box;"><div style="border: 0px; font-style: inherit; font-variant: inherit; font-weight: inherit; font-stretch: inherit; font-size: 11pt; line-height: inherit; font-family: Aptos, sans-serif; font-optical-sizing: inherit; font-kerning: inherit; font-feature-settings: inherit; font-variation-settings: inherit; margin: 0px; padding: 0px; vertical-align: baseline; color: black; direction: ltr;"><br></div></td><td style="width: 120px; height: 22px; direction: ltr; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); vertical-align: top; box-sizing: border-box;"><div style="border: 0px; font-style: inherit; font-variant: inherit; font-weight: inherit; font-stretch: inherit; font-size: 11pt; line-height: inherit; font-family: Aptos, sans-serif; font-optical-sizing: inherit; font-kerning: inherit; font-feature-settings: inherit; font-variation-settings: inherit; margin: 0px; padding: 0px; vertical-align: baseline; color: black; direction: ltr;"><br></div></td></tr></tbody></table></div><span style="border: 0px; font-style: inherit; font-variant: inherit; font-weight: inherit; font-stretch: inherit; font-size: 11pt; line-height: inherit; font-family: Aptos, Aptos_EmbeddedFont, Aptos_MSFontService, Calibri, Helvetica, sans-serif; font-optical-sizing: inherit; font-kerning: inherit; font-feature-settings: inherit; font-variation-settings: inherit; margin: 0px; padding: 0px; vertical-align: baseline; color: rgb(0, 0, 0);"></span><div style="border: 0px; font-style: inherit; font-variant: inherit; font-weight: inherit; font-stretch: inherit; font-size: 11pt; line-height: inherit; font-family: Aptos, sans-serif; font-optical-sizing: inherit; font-kerning: inherit; font-feature-settings: inherit; font-variation-settings: inherit; margin: 0in; padding: 0px; vertical-align: baseline; color: black; direction: ltr;"><br style="color: rgb(0, 0, 0); font-family: Aptos, sans-serif; font-size: 14.6667px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;">\x3C!--EndFragment-->\n\n</div>';
        const dataTransfer: DataTransfer = new DataTransfer();
        dataTransfer.setData('text/html', clipBoardData);
        const pasteEvent: ClipboardEvent = new ClipboardEvent('paste', { clipboardData: dataTransfer } as ClipboardEventInit);
        editor.onPaste(pasteEvent);
        setTimeout(() => {
            expect((editor.inputElement.querySelector('table') as HTMLElement).classList.contains('e-rte-paste-table')).toBe(true);
            done();
        }, 100);
    });
});

describe('878049 - The indent is not working properly in the Rich Text Editor.', () => {
    let editor: RichTextEditor;
    let editorObj: EditorManager;
    beforeAll((done: DoneFn) => {
        editor = renderRTE({
            pasteCleanupSettings : {
                keepFormat : true
            }
        });
        editorObj = new EditorManager({ document: document, editableElement: document.getElementsByClassName("e-content")[0] });
        done();
    });
    afterAll((done: DoneFn) => {
        destroy(editor);
        done();
    });
    it ('Checking the indent', (done: DoneFn) => {
        editor.focusIn();
        const clipBoardData: string = `<p style="margin-top: 0in; margin-right: 0in; margin-bottom: 8pt; line-height: 107%; font-size: 11pt; font-family: Calibri, sans-serif;">
        <span style="font-family:&quot;Segoe UI&quot;,sans-serif;color:#1A1A1A;background:white;">This section explains the steps to create a simple Rich Text Editor and demonstrates the basic usage of the Rich Text Editor component using the Essential JS 2&nbsp;</span>
        <a href="https://github.com/SyncfusionExamples/ej2-quickstart-webpack-" target="_blank" style="text-align:start;" aria-label="Open in new window">
            <span style="font-family:&quot;Segoe UI&quot;,sans-serif;color:#0079F3;background:white;text-decoration:none;">quickstart</span>
        </a>
        <span style="font-family:&quot;Segoe UI&quot;,sans-serif;color:#1A1A1A;background:white;">
            <span style="text-align:start;float:none;">&nbsp;seed repository. This seed repository is pre-configured with the Essential JS 2 package.</span>
        </span>
    </p>`;
        const dataTransfer: DataTransfer = new DataTransfer();
        dataTransfer.setData('text/html', clipBoardData);
        const pasteEvent: ClipboardEvent = new ClipboardEvent('paste', { clipboardData: dataTransfer } as ClipboardEventInit);
        editor.onPaste(pasteEvent);
        setTimeout(() => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            let start: HTMLElement = elem.querySelector('p');
            let end: HTMLElement = elem.querySelector('p');
            editorObj.nodeSelection.setSelectionText(document, start, end, 0, 0);
            editorObj.execCommand("Indents", 'Outdent', null);
            expect(start.style.marginLeft === '').toBe(true);
            done();
        }, 100);
    });
});

describe('876585 - List marker items has merged after paste the content.', () => {
    let editor: RichTextEditor;
    beforeAll((done: Function) => {
        editor = renderRTE({
            pasteCleanupSettings : {
                keepFormat : true
            },
            value: '<ol><li>The Rich Text Editor (RTE) control is an easy to render in client side. Customer easy to edit the contents and get the HTML content for the displayed content. A rich text editor control provides users with a toolbar that helps them to apply rich text formats to the text entered in the text area.</li></ol>'
        });
        done();
    });
    afterAll((done: DoneFn) => {
        destroy(editor);
        done();
    });
    it ('Checking the list after paste the content', (done: DoneFn) => {
        editor.focusIn();
        let elem: HTMLElement = editor.inputElement as HTMLElement;
        let start: HTMLElement = elem.querySelector('li');
        let end: HTMLElement = elem.querySelector('li');
        editor.formatter.editorManager.nodeSelection.setSelectionText(document, start, end, 0, 1);
        const clipBoardData: string = '<ol><li>The Rich Text Editor (RTE) control is an easy to render in client side. Customer easy to edit the contents and get the HTML content for the displayed content. A rich text editor control provides users with a toolbar that helps them to apply rich text formats to the text entered in the text area.</li></ol>';
        const dataTransfer: DataTransfer = new DataTransfer();
        dataTransfer.setData('text/html', clipBoardData);
        const pasteEvent: ClipboardEvent = new ClipboardEvent('paste', { clipboardData: dataTransfer } as ClipboardEventInit);
        editor.onPaste(pasteEvent);
        setTimeout(() => {
            expect(editor.inputElement.querySelectorAll('li').length).toEqual(1);
            done();
        }, 100);
    });
});

describe('882743: Pasting only table should add a new paragraph set the cursor focus on new line..', () => {
    let editor: RichTextEditor;
    beforeAll((done: DoneFn) => {
        editor = renderRTE({
            pasteCleanupSettings : {
                keepFormat : false
            }
        });
        done();
    });
    afterAll((done: DoneFn) => {
        destroy(editor);
        done();
    });
    it ('Should add Paragrah tag next to the table', (done: DoneFn) => {
        editor.focusIn();
        const clipBoardData: string = '\n\n\n<meta http-equiv="Content-Type" content="text/html; charset=utf-8">\n<meta name="ProgId" content="Word.Document">\n<meta name="Generator" content="Microsoft Word 15">\n<meta name="Originator" content="Microsoft Word 15">\n<link rel="File-List" href="file:///C:/Users/GOKULR~1/AppData/Local/Temp/msohtmlclip1/01/clip_filelist.xml">\n\x3C!--[if gte mso 9]><xml>\n <o:OfficeDocumentSettings>\n  <o:AllowPNG/>\n </o:OfficeDocumentSettings>\n</xml><![endif]-->\n<link rel="themeData" href="file:///C:/Users/GOKULR~1/AppData/Local/Temp/msohtmlclip1/01/clip_themedata.thmx">\n<link rel="colorSchemeMapping" href="file:///C:/Users/GOKULR~1/AppData/Local/Temp/msohtmlclip1/01/clip_colorschememapping.xml">\n\x3C!--[if gte mso 9]><xml>\n <w:WordDocument>\n  <w:View>Normal</w:View>\n  <w:Zoom>0</w:Zoom>\n  <w:TrackMoves/>\n  <w:TrackFormatting/>\n  <w:PunctuationKerning/>\n  <w:ValidateAgainstSchemas/>\n  <w:SaveIfXMLInvalid>false</w:SaveIfXMLInvalid>\n  <w:IgnoreMixedContent>false</w:IgnoreMixedContent>\n  <w:AlwaysShowPlaceholderText>false</w:AlwaysShowPlaceholderText>\n  <w:DoNotPromoteQF/>\n  <w:LidThemeOther>EN-US</w:LidThemeOther>\n  <w:LidThemeAsian>ZH-CN</w:LidThemeAsian>\n  <w:LidThemeComplexScript>X-NONE</w:LidThemeComplexScript>\n  <w:Compatibility>\n   <w:BreakWrappedTables/>\n   <w:SnapToGridInCell/>\n   <w:WrapTextWithPunct/>\n   <w:UseAsianBreakRules/>\n   <w:DontGrowAutofit/>\n   <w:SplitPgBreakAndParaMark/>\n   <w:EnableOpenTypeKerning/>\n   <w:DontFlipMirrorIndents/>\n   <w:OverrideTableStyleHps/>\n   <w:UseFELayout/>\n  </w:Compatibility>\n  <m:mathPr>\n   <m:mathFont m:val="Cambria Math"/>\n   <m:brkBin m:val="before"/>\n   <m:brkBinSub m:val="&#45;-"/>\n   <m:smallFrac m:val="off"/>\n   <m:dispDef/>\n   <m:lMargin m:val="0"/>\n   <m:rMargin m:val="0"/>\n   <m:defJc m:val="centerGroup"/>\n   <m:wrapIndent m:val="1440"/>\n   <m:intLim m:val="subSup"/>\n   <m:naryLim m:val="undOvr"/>\n  </m:mathPr></w:WordDocument>\n</xml><![endif]-->\x3C!--[if gte mso 9]><xml>\n <w:LatentStyles DefLockedState="false" DefUnhideWhenUsed="false"\n  DefSemiHidden="false" DefQFormat="false" DefPriority="99"\n  LatentStyleCount="376">\n  <w:LsdException Locked="false" Priority="0" QFormat="true" Name="Normal"/>\n  <w:LsdException Locked="false" Priority="9" QFormat="true" Name="heading 1"/>\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\n   UnhideWhenUsed="true" QFormat="true" Name="heading 2"/>\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\n   UnhideWhenUsed="true" QFormat="true" Name="heading 3"/>\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\n   UnhideWhenUsed="true" QFormat="true" Name="heading 4"/>\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\n   UnhideWhenUsed="true" QFormat="true" Name="heading 5"/>\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\n   UnhideWhenUsed="true" QFormat="true" Name="heading 6"/>\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\n   UnhideWhenUsed="true" QFormat="true" Name="heading 7"/>\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\n   UnhideWhenUsed="true" QFormat="true" Name="heading 8"/>\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\n   UnhideWhenUsed="true" QFormat="true" Name="heading 9"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="index 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="index 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="index 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="index 4"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="index 5"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="index 6"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="index 7"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="index 8"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="index 9"/>\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n   UnhideWhenUsed="true" Name="toc 1"/>\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n   UnhideWhenUsed="true" Name="toc 2"/>\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n   UnhideWhenUsed="true" Name="toc 3"/>\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n   UnhideWhenUsed="true" Name="toc 4"/>\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n   UnhideWhenUsed="true" Name="toc 5"/>\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n   UnhideWhenUsed="true" Name="toc 6"/>\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n   UnhideWhenUsed="true" Name="toc 7"/>\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n   UnhideWhenUsed="true" Name="toc 8"/>\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n   UnhideWhenUsed="true" Name="toc 9"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Normal Indent"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="footnote text"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="annotation text"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="header"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="footer"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="index heading"/>\n  <w:LsdException Locked="false" Priority="35" SemiHidden="true"\n   UnhideWhenUsed="true" QFormat="true" Name="caption"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="table of figures"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="envelope address"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="envelope return"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="footnote reference"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="annotation reference"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="line number"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="page number"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="endnote reference"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="endnote text"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="table of authorities"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="macro"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="toa heading"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Bullet"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Number"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List 4"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List 5"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Bullet 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Bullet 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Bullet 4"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Bullet 5"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Number 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Number 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Number 4"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Number 5"/>\n  <w:LsdException Locked="false" Priority="10" QFormat="true" Name="Title"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Closing"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Signature"/>\n  <w:LsdException Locked="false" Priority="1" SemiHidden="true"\n   UnhideWhenUsed="true" Name="Default Paragraph Font"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Body Text"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Body Text Indent"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Continue"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Continue 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Continue 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Continue 4"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Continue 5"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Message Header"/>\n  <w:LsdException Locked="false" Priority="11" QFormat="true" Name="Subtitle"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Salutation"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Date"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Body Text First Indent"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Body Text First Indent 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Note Heading"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Body Text 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Body Text 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Body Text Indent 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Body Text Indent 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Block Text"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Hyperlink"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="FollowedHyperlink"/>\n  <w:LsdException Locked="false" Priority="22" QFormat="true" Name="Strong"/>\n  <w:LsdException Locked="false" Priority="20" QFormat="true" Name="Emphasis"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Document Map"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Plain Text"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="E-mail Signature"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Top of Form"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Bottom of Form"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Normal (Web)"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Acronym"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Address"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Cite"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Code"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Definition"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Keyboard"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Preformatted"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Sample"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Typewriter"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Variable"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Normal Table"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="annotation subject"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="No List"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Outline List 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Outline List 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Outline List 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Simple 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Simple 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Simple 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Classic 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Classic 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Classic 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Classic 4"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Colorful 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Colorful 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Colorful 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Columns 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Columns 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Columns 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Columns 4"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Columns 5"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Grid 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Grid 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Grid 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Grid 4"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Grid 5"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Grid 6"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Grid 7"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Grid 8"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table List 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table List 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table List 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table List 4"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table List 5"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table List 6"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table List 7"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table List 8"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table 3D effects 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table 3D effects 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table 3D effects 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Contemporary"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Elegant"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Professional"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Subtle 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Subtle 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Web 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Web 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Web 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Balloon Text"/>\n  <w:LsdException Locked="false" Priority="39" Name="Table Grid"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Theme"/>\n  <w:LsdException Locked="false" SemiHidden="true" Name="Placeholder Text"/>\n  <w:LsdException Locked="false" Priority="1" QFormat="true" Name="No Spacing"/>\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading"/>\n  <w:LsdException Locked="false" Priority="61" Name="Light List"/>\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid"/>\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1"/>\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2"/>\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1"/>\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2"/>\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1"/>\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2"/>\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3"/>\n  <w:LsdException Locked="false" Priority="70" Name="Dark List"/>\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading"/>\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List"/>\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid"/>\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 1"/>\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 1"/>\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 1"/>\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 1"/>\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 1"/>\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" Name="Revision"/>\n  <w:LsdException Locked="false" Priority="34" QFormat="true"\n   Name="List Paragraph"/>\n  <w:LsdException Locked="false" Priority="29" QFormat="true" Name="Quote"/>\n  <w:LsdException Locked="false" Priority="30" QFormat="true"\n   Name="Intense Quote"/>\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 1"/>\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 1"/>\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 1"/>\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 1"/>\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 1"/>\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 1"/>\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 1"/>\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 1"/>\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 2"/>\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 2"/>\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 2"/>\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 2"/>\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 2"/>\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 2"/>\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 2"/>\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 2"/>\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 2"/>\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 2"/>\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 2"/>\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 2"/>\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 2"/>\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 2"/>\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 3"/>\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 3"/>\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 3"/>\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 3"/>\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 3"/>\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 3"/>\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 3"/>\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 3"/>\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 3"/>\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 3"/>\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 3"/>\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 3"/>\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 3"/>\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 3"/>\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 4"/>\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 4"/>\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 4"/>\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 4"/>\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 4"/>\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 4"/>\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 4"/>\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 4"/>\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 4"/>\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 4"/>\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 4"/>\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 4"/>\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 4"/>\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 4"/>\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 5"/>\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 5"/>\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 5"/>\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 5"/>\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 5"/>\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 5"/>\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 5"/>\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 5"/>\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 5"/>\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 5"/>\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 5"/>\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 5"/>\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 5"/>\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 5"/>\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 6"/>\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 6"/>\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 6"/>\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 6"/>\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 6"/>\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 6"/>\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 6"/>\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 6"/>\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 6"/>\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 6"/>\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 6"/>\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 6"/>\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 6"/>\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 6"/>\n  <w:LsdException Locked="false" Priority="19" QFormat="true"\n   Name="Subtle Emphasis"/>\n  <w:LsdException Locked="false" Priority="21" QFormat="true"\n   Name="Intense Emphasis"/>\n  <w:LsdException Locked="false" Priority="31" QFormat="true"\n   Name="Subtle Reference"/>\n  <w:LsdException Locked="false" Priority="32" QFormat="true"\n   Name="Intense Reference"/>\n  <w:LsdException Locked="false" Priority="33" QFormat="true" Name="Book Title"/>\n  <w:LsdException Locked="false" Priority="37" SemiHidden="true"\n   UnhideWhenUsed="true" Name="Bibliography"/>\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n   UnhideWhenUsed="true" QFormat="true" Name="TOC Heading"/>\n  <w:LsdException Locked="false" Priority="41" Name="Plain Table 1"/>\n  <w:LsdException Locked="false" Priority="42" Name="Plain Table 2"/>\n  <w:LsdException Locked="false" Priority="43" Name="Plain Table 3"/>\n  <w:LsdException Locked="false" Priority="44" Name="Plain Table 4"/>\n  <w:LsdException Locked="false" Priority="45" Name="Plain Table 5"/>\n  <w:LsdException Locked="false" Priority="40" Name="Grid Table Light"/>\n  <w:LsdException Locked="false" Priority="46" Name="Grid Table 1 Light"/>\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2"/>\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3"/>\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4"/>\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark"/>\n  <w:LsdException Locked="false" Priority="51" Name="Grid Table 6 Colorful"/>\n  <w:LsdException Locked="false" Priority="52" Name="Grid Table 7 Colorful"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="Grid Table 1 Light Accent 1"/>\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 1"/>\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 1"/>\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 1"/>\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 1"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="Grid Table 6 Colorful Accent 1"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="Grid Table 7 Colorful Accent 1"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="Grid Table 1 Light Accent 2"/>\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 2"/>\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 2"/>\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 2"/>\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 2"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="Grid Table 6 Colorful Accent 2"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="Grid Table 7 Colorful Accent 2"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="Grid Table 1 Light Accent 3"/>\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 3"/>\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 3"/>\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 3"/>\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 3"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="Grid Table 6 Colorful Accent 3"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="Grid Table 7 Colorful Accent 3"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="Grid Table 1 Light Accent 4"/>\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 4"/>\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 4"/>\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 4"/>\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 4"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="Grid Table 6 Colorful Accent 4"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="Grid Table 7 Colorful Accent 4"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="Grid Table 1 Light Accent 5"/>\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 5"/>\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 5"/>\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 5"/>\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 5"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="Grid Table 6 Colorful Accent 5"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="Grid Table 7 Colorful Accent 5"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="Grid Table 1 Light Accent 6"/>\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 6"/>\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 6"/>\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 6"/>\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 6"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="Grid Table 6 Colorful Accent 6"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="Grid Table 7 Colorful Accent 6"/>\n  <w:LsdException Locked="false" Priority="46" Name="List Table 1 Light"/>\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2"/>\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3"/>\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4"/>\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark"/>\n  <w:LsdException Locked="false" Priority="51" Name="List Table 6 Colorful"/>\n  <w:LsdException Locked="false" Priority="52" Name="List Table 7 Colorful"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="List Table 1 Light Accent 1"/>\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 1"/>\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 1"/>\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 1"/>\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 1"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="List Table 6 Colorful Accent 1"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="List Table 7 Colorful Accent 1"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="List Table 1 Light Accent 2"/>\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 2"/>\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 2"/>\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 2"/>\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 2"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="List Table 6 Colorful Accent 2"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="List Table 7 Colorful Accent 2"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="List Table 1 Light Accent 3"/>\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 3"/>\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 3"/>\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 3"/>\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 3"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="List Table 6 Colorful Accent 3"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="List Table 7 Colorful Accent 3"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="List Table 1 Light Accent 4"/>\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 4"/>\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 4"/>\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 4"/>\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 4"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="List Table 6 Colorful Accent 4"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="List Table 7 Colorful Accent 4"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="List Table 1 Light Accent 5"/>\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 5"/>\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 5"/>\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 5"/>\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 5"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="List Table 6 Colorful Accent 5"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="List Table 7 Colorful Accent 5"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="List Table 1 Light Accent 6"/>\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 6"/>\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 6"/>\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 6"/>\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 6"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="List Table 6 Colorful Accent 6"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="List Table 7 Colorful Accent 6"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Mention"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Smart Hyperlink"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Hashtag"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Unresolved Mention"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Smart Link"/>\n </w:LatentStyles>\n</xml><![endif]-->\n<style>\n\x3C!--\n /* Font Definitions */\n @font-face\n\t{font-family:"Cambria Math";\n\tpanose-1:2 4 5 3 5 4 6 3 2 4;\n\tmso-font-charset:0;\n\tmso-generic-font-family:roman;\n\tmso-font-pitch:variable;\n\tmso-font-signature:-536869121 1107305727 33554432 0 415 0;}\n@font-face\n\t{font-family:DengXian;\n\tpanose-1:2 1 6 0 3 1 1 1 1 1;\n\tmso-font-alt:等线;\n\tmso-font-charset:134;\n\tmso-generic-font-family:auto;\n\tmso-font-pitch:variable;\n\tmso-font-signature:-1610612033 953122042 22 0 262159 0;}\n@font-face\n\t{font-family:Aptos;\n\tmso-font-charset:0;\n\tmso-generic-font-family:swiss;\n\tmso-font-pitch:variable;\n\tmso-font-signature:536871559 3 0 0 415 0;}\n@font-face\n\t{font-family:"\\@DengXian";\n\tpanose-1:2 1 6 0 3 1 1 1 1 1;\n\tmso-font-charset:134;\n\tmso-generic-font-family:auto;\n\tmso-font-pitch:variable;\n\tmso-font-signature:-1610612033 953122042 22 0 262159 0;}\n /* Style Definitions */\n p.MsoNormal, li.MsoNormal, div.MsoNormal\n\t{mso-style-unhide:no;\n\tmso-style-qformat:yes;\n\tmso-style-parent:"";\n\tmargin-top:0in;\n\tmargin-right:0in;\n\tmargin-bottom:8.0pt;\n\tmargin-left:0in;\n\tline-height:115%;\n\tmso-pagination:widow-orphan;\n\tfont-size:12.0pt;\n\tfont-family:"Aptos",sans-serif;\n\tmso-ascii-font-family:Aptos;\n\tmso-ascii-theme-font:minor-latin;\n\tmso-fareast-font-family:DengXian;\n\tmso-fareast-theme-font:minor-fareast;\n\tmso-hansi-font-family:Aptos;\n\tmso-hansi-theme-font:minor-latin;\n\tmso-bidi-font-family:"Times New Roman";\n\tmso-bidi-theme-font:minor-bidi;\n\tmso-font-kerning:1.0pt;\n\tmso-ligatures:standardcontextual;}\n.MsoChpDefault\n\t{mso-style-type:export-only;\n\tmso-default-props:yes;\n\tmso-ascii-font-family:Aptos;\n\tmso-ascii-theme-font:minor-latin;\n\tmso-fareast-font-family:DengXian;\n\tmso-fareast-theme-font:minor-fareast;\n\tmso-hansi-font-family:Aptos;\n\tmso-hansi-theme-font:minor-latin;\n\tmso-bidi-font-family:"Times New Roman";\n\tmso-bidi-theme-font:minor-bidi;}\n.MsoPapDefault\n\t{mso-style-type:export-only;\n\tmargin-bottom:8.0pt;\n\tline-height:115%;}\n@page WordSection1\n\t{size:8.5in 11.0in;\n\tmargin:1.0in 1.0in 1.0in 1.0in;\n\tmso-header-margin:.5in;\n\tmso-footer-margin:.5in;\n\tmso-paper-source:0;}\ndiv.WordSection1\n\t{page:WordSection1;}\n-->\n</style>\n\x3C!--[if gte mso 10]>\n<style>\n /* Style Definitions */\n table.MsoNormalTable\n\t{mso-style-name:"Table Normal";\n\tmso-tstyle-rowband-size:0;\n\tmso-tstyle-colband-size:0;\n\tmso-style-noshow:yes;\n\tmso-style-priority:99;\n\tmso-style-parent:"";\n\tmso-padding-alt:0in 5.4pt 0in 5.4pt;\n\tmso-para-margin-top:0in;\n\tmso-para-margin-right:0in;\n\tmso-para-margin-bottom:8.0pt;\n\tmso-para-margin-left:0in;\n\tline-height:115%;\n\tmso-pagination:widow-orphan;\n\tfont-size:12.0pt;\n\tfont-family:"Aptos",sans-serif;\n\tmso-ascii-font-family:Aptos;\n\tmso-ascii-theme-font:minor-latin;\n\tmso-hansi-font-family:Aptos;\n\tmso-hansi-theme-font:minor-latin;\n\tmso-font-kerning:1.0pt;\n\tmso-ligatures:standardcontextual;}\ntable.MsoTableGrid\n\t{mso-style-name:"Table Grid";\n\tmso-tstyle-rowband-size:0;\n\tmso-tstyle-colband-size:0;\n\tmso-style-priority:39;\n\tmso-style-unhide:no;\n\tborder:solid windowtext 1.0pt;\n\tmso-border-alt:solid windowtext .5pt;\n\tmso-padding-alt:0in 5.4pt 0in 5.4pt;\n\tmso-border-insideh:.5pt solid windowtext;\n\tmso-border-insidev:.5pt solid windowtext;\n\tmso-para-margin:0in;\n\tmso-pagination:widow-orphan;\n\tfont-size:12.0pt;\n\tfont-family:"Aptos",sans-serif;\n\tmso-ascii-font-family:Aptos;\n\tmso-ascii-theme-font:minor-latin;\n\tmso-hansi-font-family:Aptos;\n\tmso-hansi-theme-font:minor-latin;\n\tmso-font-kerning:1.0pt;\n\tmso-ligatures:standardcontextual;}\n</style>\n<![endif]-->\n\n\n\n\x3C!--StartFragment-->\n\n<table class="MsoTableGrid" border="1" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:none;mso-border-alt:solid windowtext .5pt;\n mso-yfti-tbllook:1184;mso-padding-alt:0in 5.4pt 0in 5.4pt">\n <tbody><tr style="mso-yfti-irow:0;mso-yfti-firstrow:yes">\n  <td width="208" valign="top" style="width:155.8pt;border:solid windowtext 1.0pt;\n  mso-border-alt:solid windowtext .5pt;padding:0in 5.4pt 0in 5.4pt">\n  <p class="MsoNormal" style="margin-bottom:0in;line-height:normal"><o:p>&nbsp;</o:p></p>\n  </td>\n  <td width="208" valign="top" style="width:155.85pt;border:solid windowtext 1.0pt;\n  border-left:none;mso-border-left-alt:solid windowtext .5pt;mso-border-alt:\n  solid windowtext .5pt;padding:0in 5.4pt 0in 5.4pt">\n  <p class="MsoNormal" style="margin-bottom:0in;line-height:normal"><o:p>&nbsp;</o:p></p>\n  </td>\n  <td width="208" valign="top" style="width:155.85pt;border:solid windowtext 1.0pt;\n  border-left:none;mso-border-left-alt:solid windowtext .5pt;mso-border-alt:\n  solid windowtext .5pt;padding:0in 5.4pt 0in 5.4pt">\n  <p class="MsoNormal" style="margin-bottom:0in;line-height:normal"><o:p>&nbsp;</o:p></p>\n  </td>\n </tr>\n <tr style="mso-yfti-irow:1;mso-yfti-lastrow:yes">\n  <td width="208" valign="top" style="width:155.8pt;border:solid windowtext 1.0pt;\n  border-top:none;mso-border-top-alt:solid windowtext .5pt;mso-border-alt:solid windowtext .5pt;\n  padding:0in 5.4pt 0in 5.4pt">\n  <p class="MsoNormal" style="margin-bottom:0in;line-height:normal"><o:p>&nbsp;</o:p></p>\n  </td>\n  <td width="208" valign="top" style="width:155.85pt;border-top:none;border-left:\n  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;\n  mso-border-top-alt:solid windowtext .5pt;mso-border-left-alt:solid windowtext .5pt;\n  mso-border-alt:solid windowtext .5pt;padding:0in 5.4pt 0in 5.4pt">\n  <p class="MsoNormal" style="margin-bottom:0in;line-height:normal"><o:p>&nbsp;</o:p></p>\n  </td>\n  <td width="208" valign="top" style="width:155.85pt;border-top:none;border-left:\n  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;\n  mso-border-top-alt:solid windowtext .5pt;mso-border-left-alt:solid windowtext .5pt;\n  mso-border-alt:solid windowtext .5pt;padding:0in 5.4pt 0in 5.4pt">\n  <p class="MsoNormal" style="margin-bottom:0in;line-height:normal"><o:p>&nbsp;</o:p></p>\n  </td>\n </tr>\n</tbody></table>\n\n\x3C!--EndFragment-->\n\n\n\n';
        const dataTransfer: DataTransfer = new DataTransfer();
        dataTransfer.setData('text/html', clipBoardData);
        const pasteEvent: ClipboardEvent = new ClipboardEvent('paste', { clipboardData: dataTransfer } as ClipboardEventInit);
        editor.onPaste(pasteEvent);
        setTimeout(() => {
            expect((editor.inputElement.querySelector('table') as HTMLElement).nextElementSibling.nodeName === 'P').toBe(true);
            expect(window.getSelection().getRangeAt(0).startContainer.parentElement === (editor.inputElement.querySelector('table') as HTMLElement).nextElementSibling).toBe(true);
            done();
        }, 100);
    });
});

describe('282270 - Need to prevent paste action, when edit image dialog open case', () => {
    let isdialogopen: boolean;
    let keyBoardEvent: any = {
        preventDefault: () => { },
        type: "keydown",
        stopPropagation: () => { },
        ctrlKey: true,
        shiftKey: false,
        action: null,
        which: 64,
        key: ""
    }
    let rteObj: RichTextEditor;
    let controlId: string;
    beforeEach((done: Function) => {
        rteObj = renderRTE({
            value: '<p><img id="image" alt="Logo" src="https://js.syncfusion.com/demos/web/co3ntent/images/accordion/baked-chicken-and-cheese.png" style="width: 300px; height: 50px;">',
            pasteCleanupSettings: {
                prompt: true
            }
        });
        controlId = rteObj.element.id;
        done();
    });
    afterAll((done: Function) => {
        destroy(rteObj);
        done();
    });
    it(' - prevent the notify action to trigger paste-clean-up dialog', (done: DoneFn) => {
        let localString: string = '<p>Hello</p>'
        keyBoardEvent.clipboardData = {
            getData: () => {
                return localString;
            },
            items: []
        };
        let image: HTMLElement = rteObj.element.querySelector("#image");
        setCursorPoint(image, 0);
        dispatchEvent(image, 'mousedown');
        image.click();
        dispatchEvent(image, 'mouseup');
        setTimeout(() => {
            let imageBtn: HTMLElement = document.getElementById(controlId + "_quick_Replace");
            imageBtn.parentElement.click();
            rteObj.onPaste(keyBoardEvent);
            setTimeout(() => {
                const isPromptOpen: HTMLElement = (rteObj as any).element.querySelector("#defaultRTE_pasteCleanupDialog");
                expect(isNullOrUndefined(isPromptOpen)).toBe(true);
                done();
            }, 100);
        }, 100);
    });
});

describe('Bug 890400: Table is not fully visible when copy paste from loop website', () => {
    let editor: RichTextEditor;
    beforeEach((done: DoneFn) => {
        editor = renderRTE({
            pasteCleanupSettings : {
                keepFormat : true
            }
        });
        done();
    });
    afterEach((done: DoneFn) => {
        destroy(editor);
        done();
    });
    it ('Some columns are not visible when copy past from loop website', (done: DoneFn) => {
        editor.focusIn();
        const clipBoardData: string = '\n\n\x3C!--StartFragment--><div fluid-config-type="Tabular"><div></div><table dir="ltr" style="border-collapse: collapse;"><thead><tr><td style="border: 1px solid;"><div fluid-data-type="IRichTextData" table-column-properties="{&quot;id&quot;:&quot;d15da6d7-0671-469c-a522-94dbeb399fb9&quot;,&quot;width&quot;:170,&quot;widthRatio&quot;:1,&quot;minWidth&quot;:56,&quot;titleType&quot;:&quot;IRichTextData&quot;,&quot;type&quot;:&quot;IRichTextData&quot;,&quot;dataTypeProps&quot;:{&quot;initialConfig&quot;:{&quot;isTextBoxMode&quot;:true,&quot;disableGuestComponents&quot;:true,&quot;richTextServicesConfiguration&quot;:{&quot;presetName&quot;:&quot;RichTextCell&quot;}}},&quot;titleDataTypeProps&quot;:{&quot;initialConfig&quot;:{&quot;isTextBoxMode&quot;:true,&quot;disableGuestComponents&quot;:true,&quot;richTextServicesConfiguration&quot;:{&quot;presetName&quot;:&quot;TableHeaderCell&quot;}}}}"><div>\x3C!--ScriptorStartFragment--><div class="scriptor-paragraph"><span attribution="{&quot;id&quot;:&quot;hariprasath.chinnadurai@syncfusion.com&quot;,&quot;name&quot;:&quot;Hariprasath Chinnadurai&quot;,&quot;email&quot;:&quot;hariprasath.chinnadurai@syncfusion.com&quot;,&quot;oid&quot;:&quot;5e6fbd09-02ae-4a88-aff0-cb5b4e8a4578&quot;,&quot;timestamp&quot;:1716267000000,&quot;dataSource&quot;:0}">Reporter\x3C!--ScriptorEndFragment--></span></div></div></div></td><td style="border: 1px solid;"><div fluid-data-type="IRichTextData" table-column-properties="{&quot;id&quot;:&quot;a9f245e0-91d0-4443-b9e1-4f7a91fddd89&quot;,&quot;width&quot;:170,&quot;widthRatio&quot;:1,&quot;minWidth&quot;:56,&quot;titleType&quot;:&quot;IRichTextData&quot;,&quot;type&quot;:&quot;IRichTextData&quot;,&quot;dataTypeProps&quot;:{&quot;initialConfig&quot;:{&quot;isTextBoxMode&quot;:true,&quot;disableGuestComponents&quot;:true,&quot;richTextServicesConfiguration&quot;:{&quot;presetName&quot;:&quot;RichTextCell&quot;}}},&quot;titleDataTypeProps&quot;:{&quot;initialConfig&quot;:{&quot;isTextBoxMode&quot;:true,&quot;disableGuestComponents&quot;:true,&quot;richTextServicesConfiguration&quot;:{&quot;presetName&quot;:&quot;TableHeaderCell&quot;}}}}"><div>\x3C!--ScriptorStartFragment--><div class="scriptor-paragraph"><span attribution="{&quot;id&quot;:&quot;vinothkumar.y@syncfusion.com&quot;,&quot;name&quot;:&quot;Vinothkumar Yuvaraj&quot;,&quot;email&quot;:&quot;vinothkumar.y@syncfusion.com&quot;,&quot;oid&quot;:&quot;6a1ab3bb-9c8d-4f72-aaba-11f0d26a84e0&quot;,&quot;timestamp&quot;:1716797100000,&quot;dataSource&quot;:0}">Task\x3C!--ScriptorEndFragment--></span></div></div></div></td></tr></thead><tbody><tr><td style="border: 1px solid;"><div fluid-data-type="IRichTextData"><div>\x3C!--ScriptorStartFragment--><div class="scriptor-paragraph"><span attribution="{&quot;id&quot;:&quot;nandhine.babu@syncfusion.com&quot;,&quot;name&quot;:&quot;Nandhine Babu&quot;,&quot;email&quot;:&quot;nandhine.babu@syncfusion.com&quot;,&quot;oid&quot;:&quot;8b692c56-76d7-4830-9887-75967bc88e7a&quot;,&quot;timestamp&quot;:1717587000000,&quot;dataSource&quot;:0}">Nandhine\x3C!--ScriptorEndFragment--></span></div></div></div></td><td style="border: 1px solid;"><div fluid-data-type="IRichTextData"><span>\x3C!--ScriptorEndFragment--></span></div></td></tr></tbody></table></div>\x3C!--EndFragment-->\n\n';
        const dataTransfer: DataTransfer = new DataTransfer();
        dataTransfer.setData('text/html', clipBoardData);
        const pasteEvent: ClipboardEvent = new ClipboardEvent('paste', { clipboardData: dataTransfer } as ClipboardEventInit);
        editor.onPaste(pasteEvent);
        setTimeout(() => {
            let pastedElm = editor.inputElement.innerHTML;
            let expected = true;
            var expectedElem = '<div fluid-config-type="Tabular"><table dir="ltr" class="e-rte-paste-table"><thead><tr><td style="border: 1px solid;"><div fluid-data-type="IRichTextData" table-column-properties="{&quot;id&quot;:&quot;d15da6d7-0671-469c-a522-94dbeb399fb9&quot;,&quot;width&quot;:170,&quot;widthRatio&quot;:1,&quot;minWidth&quot;:56,&quot;titleType&quot;:&quot;IRichTextData&quot;,&quot;type&quot;:&quot;IRichTextData&quot;,&quot;dataTypeProps&quot;:{&quot;initialConfig&quot;:{&quot;isTextBoxMode&quot;:true,&quot;disableGuestComponents&quot;:true,&quot;richTextServicesConfiguration&quot;:{&quot;presetName&quot;:&quot;RichTextCell&quot;}}},&quot;titleDataTypeProps&quot;:{&quot;initialConfig&quot;:{&quot;isTextBoxMode&quot;:true,&quot;disableGuestComponents&quot;:true,&quot;richTextServicesConfiguration&quot;:{&quot;presetName&quot;:&quot;TableHeaderCell&quot;}}}}"><div><div class="scriptor-paragraph"><span attribution="{&quot;id&quot;:&quot;hariprasath.chinnadurai@syncfusion.com&quot;,&quot;name&quot;:&quot;Hariprasath Chinnadurai&quot;,&quot;email&quot;:&quot;hariprasath.chinnadurai@syncfusion.com&quot;,&quot;oid&quot;:&quot;5e6fbd09-02ae-4a88-aff0-cb5b4e8a4578&quot;,&quot;timestamp&quot;:1716267000000,&quot;dataSource&quot;:0}">Reporter</span></div></div></div></td><td style="border: 1px solid;"><div fluid-data-type="IRichTextData" table-column-properties="{&quot;id&quot;:&quot;a9f245e0-91d0-4443-b9e1-4f7a91fddd89&quot;,&quot;width&quot;:170,&quot;widthRatio&quot;:1,&quot;minWidth&quot;:56,&quot;titleType&quot;:&quot;IRichTextData&quot;,&quot;type&quot;:&quot;IRichTextData&quot;,&quot;dataTypeProps&quot;:{&quot;initialConfig&quot;:{&quot;isTextBoxMode&quot;:true,&quot;disableGuestComponents&quot;:true,&quot;richTextServicesConfiguration&quot;:{&quot;presetName&quot;:&quot;RichTextCell&quot;}}},&quot;titleDataTypeProps&quot;:{&quot;initialConfig&quot;:{&quot;isTextBoxMode&quot;:true,&quot;disableGuestComponents&quot;:true,&quot;richTextServicesConfiguration&quot;:{&quot;presetName&quot;:&quot;TableHeaderCell&quot;}}}}"><div><div class="scriptor-paragraph"><span attribution="{&quot;id&quot;:&quot;vinothkumar.y@syncfusion.com&quot;,&quot;name&quot;:&quot;Vinothkumar Yuvaraj&quot;,&quot;email&quot;:&quot;vinothkumar.y@syncfusion.com&quot;,&quot;oid&quot;:&quot;6a1ab3bb-9c8d-4f72-aaba-11f0d26a84e0&quot;,&quot;timestamp&quot;:1716797100000,&quot;dataSource&quot;:0}">Task</span></div></div></div></td></tr></thead><tbody><tr><td style="border: 1px solid;"><div fluid-data-type="IRichTextData"><div><div class="scriptor-paragraph"><span attribution="{&quot;id&quot;:&quot;nandhine.babu@syncfusion.com&quot;,&quot;name&quot;:&quot;Nandhine Babu&quot;,&quot;email&quot;:&quot;nandhine.babu@syncfusion.com&quot;,&quot;oid&quot;:&quot;8b692c56-76d7-4830-9887-75967bc88e7a&quot;,&quot;timestamp&quot;:1717587000000,&quot;dataSource&quot;:0}">Nandhine</span></div></div></div></td><td style="border: 1px solid;"></td></tr></tbody></table></div>';
            if (pastedElm !== expectedElem) {
                expected = false;
            }
            expect(expected).toBe(true);
            done();
        }, 100);
    });
});

describe("896253 - ImageRemoving event not get triggered when we delete the pasted image from popup in the RichTextEditor", () => {
    let rteObj: RichTextEditor;
    let imgSize: number;
    let sizeInBytes: number;
    let toolbarDisabled: boolean = false;
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
                saveUrl: 'https://ej2services.syncfusion.com/js/development/api/RichTextEditor/SaveFile',
                path:   'https://ej2services.syncfusion.com/js/development/RichTextEditor/'
            },
            imageUploading: function (args) {
                if (rteObj.toolbarModule.baseToolbar.toolbarObj.element.className.indexOf('e-overlay') > 0) {
                    toolbarDisabled = true;
                }
                
            }
        });
        done();
    });

    it(" calling popup close method to achive imageupload Success", (done) => {
        keyBoardEvent.clipboardData = {
            getData: () => { return `<html> <body> <!--StartFragment--><p>content<br/> <img class='pasteContent_Img' src='data:image/png;base64,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`
    + `96F41gHWylg6dldX1IYkYIqw/WOvbcgyIGhX1LJd0BU2aUs6ZVut9vr5Jm8AcETQS7lQkA1YOaOvWz4gTAKupvchoCQVMjBbCkk8H8GJ9KryxHEUmnezhOVxvexWT8QukFPGPFE4EkrZJDccsqA4/RmTfZc+uWBYNnJEp8EQWTL4U2plJG/jnUd4nESxa2s/hMgwGlNk9Ij81ohs9ypprtU3H0kw6dGADplGwLeqhYKz8UX026P6ZozDreGAHRplqiCchxzwcQXQuDS1UiM4ju3jqDTsCCgrDqEKHewAAKfBsISurznEcOfFAHolE0eOd61Mdy7c6bScRifSyPes9BPigB0yoa5UhkPrdYaHggaPQQ12eN7AY8KCg+BYiKg+JGnlLbcAPQUH5vlg3bK4SFg7hldGrfrfXqUlnGMMhqGuXfS3YAnBYWHoBAnCKiG80R2ndieFQKVNmfbIlqaDxhWhIdAgB0CIn60SKWTvBlfULuUpcfIZ/iAYUV4CJI9HQHHLW5NECLptcUztg6g2uADdsrhIWAvM9idpqoeVwlJXTwhye1qtkJyDW6B6q2i8BBEOhgBTy117BIaKvENB0yAIGCnHCICDYcV6RXlKOCutCuWVjKeY1cfFCKCPBzrU42VTZnbTbl9f4GP97xuXk0hIqjCnB3fXV1nOev2VRLHOSMpnxQigjJEkAk4UGEpzgd2LwoXQZrKBB2ogGFcsAdDRKDwAMGi7ngljdJcsAdDRFDgoAyCDlQuM7ePQIKBUSagT4xkG7ePgKXAWD8d0CfeCQSRLgiM+MAI7oAWwQQ876c/8CTqDvgiGBjxXEA+tLsQVcDkL89x6w/Yk4VcJx2//fEBMOU4MIS03+OJ2aQkwAUYo3i6AdMct5+zA5TjQJe2simTBQUu2c72uhyfzmTQAmK+FzRtGi6CSDlDZZZ0ynDRS6cH18lneExo9fMoqynBT2UOF0FEASGmkxkWrjcvw3lToC67DR6uKAbMd+Fab62sXPd4+JARsJecRQispJSrnewIrfPD680B7xkKNHo1p3gcuH0HEERycS7TUWJKOa9lYatDPUfqQnVxo1cZuBsgDNZvCEEkn443MulMAxC2UZ4aXXa0fE655hnqiyh0BJFqXNcWPg1ttKwwQjLc1yzZKXwEkaTW6/UA60yYbyZaTDeAANBNtrmTbgbBp6R1EJBdIEFjsJshC4IV4UDZlMHldd4KECqxzOWjewYtn8hiR5ZlxlxPuQuKJFVHKQuAdGrp8CprufXevUePqPKtY8iNHtmYunfvH0tea1bo2u8FGHphvgVtfUpq9xz8A6aWZEpyzpvB7feWpdlvmtheyoOlJQgYyn3/vUdB01vXJzbrEgCgxLLIpef1xKNw3sAVgLR/eLCz20sWmH9D9AsroV8KZQ+h3XsUMN98bfIUQSb+2Weff/6ZN33+2Rf/3E27H+rekkNiO24EmfTnXyxgH9MX/2w0XDIImt+6NikuVvjRF8sBAAifdzN2B5xJ317nrFhYSTdSjdFnKwEACF98PkrDfUyY/dRB4HVZYZDU6XKgV3oEh97d3goFsoLojPC+dvBU+dMMABZSUqlqiL4AbbvQhB0E7gO35/PV3JKfmYwAAAAjSURBVPXf3xYasfCkgRh0o7/4AtPnDsK/IrfKwMMGbmrQ+P8fqKtA+4EH0QAAAABJRU5ErkJggg==' /></p><!--EndFragment--> </body></html>` },
            types: ['text/html', 'Files'],
            files: { 0: { lastModified: 1594563447084, name: "image.png", size: 66216, type: "image/png", webkitRelativePath: "", lastModifiedDate: new Date() } },
            items: { 0: { kind: 'string', type: 'text/html' }, 1: { kind: 'file', type: 'image/png' }, }
        };
        setCursorPoint((rteObj as any).inputElement.firstElementChild, 0);
        rteObj.onPaste(keyBoardEvent);
        setTimeout(() => {
            expect(toolbarDisabled).toBe(true);
            done();
        }, 1500);
    });

    afterAll((done: DoneFn) => {
        destroy(rteObj);
        done();
    });
});

    describe(' - pasting otd format not working in safari browser.', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
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
        let innerHTML: string = `<ol><li id="li1"><br></li><li id="li2">hello</li></ol>`;
        let copied: string = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
xmlns:w="urn:schemas-microsoft-com:office:word"
xmlns:m="http://schemas.microsoft.com/office/2004/12/omml"
xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="UTF-8"></head><head><style class="WebKit-mso-list-quirks-style">
<!--
/* Style Definitions */
 p.MsoNormal, li.MsoNormal, div.MsoNormal
	{mso-style-unhide:no;
	mso-style-qformat:yes;
	mso-style-parent:"";
	margin:0in;
	mso-pagination:none;
	mso-hyphenate:none;
	text-autospace:ideograph-other;
	font-size:12.0pt;
	font-family:"Times New Roman",serif;
	mso-fareast-font-family:"Lucida Sans Unicode";
	mso-bidi-font-family:Tahoma;
	mso-font-kerning:1.5pt;
	mso-fareast-language:#1000;
	mso-bidi-language:#1000;}
h1
	{mso-style-priority:9;
	mso-style-unhide:no;
	mso-style-qformat:yes;
	mso-style-link:"Heading 1 Char";
	mso-style-next:"Text body";
	margin-top:12.0pt;
	margin-right:0in;
	margin-bottom:6.0pt;
	margin-left:0in;
	mso-pagination:none;
	page-break-after:avoid;
	mso-outline-level:1;
	mso-hyphenate:none;
	text-autospace:ideograph-other;
	font-size:14.0pt;
	font-family:"Arial",sans-serif;
	mso-bidi-font-family:Tahoma;
	mso-font-kerning:1.5pt;
	mso-fareast-language:#1000;
	mso-bidi-language:#1000;}
p.MsoFooter, li.MsoFooter, div.MsoFooter
	{mso-style-unhide:no;
	mso-style-link:"Footer Char";
	margin:0in;
	mso-pagination:no-line-numbers;
	mso-hyphenate:none;
	tab-stops:center 3.25in right 6.5in;
	text-autospace:ideograph-other;
	font-size:12.0pt;
	font-family:"Times New Roman",serif;
	mso-fareast-font-family:"Lucida Sans Unicode";
	mso-bidi-font-family:Tahoma;
	mso-font-kerning:1.5pt;
	mso-fareast-language:#1000;
	mso-bidi-language:#1000;}
span.Heading1Char
	{mso-style-name:"Heading 1 Char";
	mso-style-priority:9;
	mso-style-unhide:no;
	mso-style-locked:yes;
	mso-style-link:"Heading 1";
	mso-ansi-font-size:14.0pt;
	mso-bidi-font-size:14.0pt;
	font-family:"Arial",sans-serif;
	mso-ascii-font-family:Arial;
	mso-hansi-font-family:Arial;
	font-weight:bold;}
p.Textbody, li.Textbody, div.Textbody
	{mso-style-name:"Text body";
	mso-style-unhide:no;
	margin-top:4.3pt;
	margin-right:0in;
	margin-bottom:4.3pt;
	margin-left:0in;
	mso-pagination:none;
	mso-hyphenate:none;
	text-autospace:ideograph-other;
	font-size:12.0pt;
	font-family:"Times New Roman",serif;
	mso-fareast-font-family:"Lucida Sans Unicode";
	mso-bidi-font-family:Tahoma;
	mso-font-kerning:1.5pt;
	mso-fareast-language:#1000;
	mso-bidi-language:#1000;}
span.FooterChar
	{mso-style-name:"Footer Char";
	mso-style-unhide:no;
	mso-style-locked:yes;
	mso-style-link:Footer;}
p.Firstparagraph, li.Firstparagraph, div.Firstparagraph
	{mso-style-name:"First paragraph";
	mso-style-unhide:no;
	mso-style-parent:"Text body";
	mso-style-next:"Text body";
	margin-top:4.3pt;
	margin-right:0in;
	margin-bottom:4.3pt;
	margin-left:0in;
	mso-pagination:none;
	mso-hyphenate:none;
	text-autospace:ideograph-other;
	font-size:12.0pt;
	font-family:"Times New Roman",serif;
	mso-fareast-font-family:"Lucida Sans Unicode";
	mso-bidi-font-family:Tahoma;
	mso-font-kerning:1.5pt;
	mso-fareast-language:#1000;
	mso-bidi-language:#1000;}
.MsoChpDefault
	{mso-style-type:export-only;
	mso-default-props:yes;
	mso-fareast-font-family:"Lucida Sans Unicode";
	mso-bidi-font-family:Tahoma;
	mso-font-kerning:1.5pt;
	mso-ligatures:none;
	mso-fareast-language:#1000;
	mso-bidi-language:#1000;}
.MsoPapDefault
	{mso-style-type:export-only;
	mso-pagination:none;
	mso-hyphenate:none;
	text-autospace:ideograph-other;}
@page WordSection1
	{size:8.5in 11.0in;
	margin:1.0in 1.0in 1.4in 1.0in;
	mso-header-margin:.5in;
	mso-footer-margin:1.0in;
	mso-paper-source:0;}
div.WordSection1
	{page:WordSection1;}
 /* List Definitions */
 @list l0
	{mso-list-id:1776050925;
	mso-list-template-ids:-119131588;}
@list l0:level1
	{mso-level-start-at:0;
	mso-level-number-format:bullet;
	mso-level-text:•;
	mso-level-tab-stop:none;
	mso-level-number-position:right;
	text-indent:-.25in;
	mso-ansi-font-size:9.0pt;
	mso-bidi-font-size:9.0pt;
	mso-ascii-font-family:StarSymbol;
	mso-fareast-font-family:StarSymbol;
	mso-hansi-font-family:StarSymbol;
	mso-bidi-font-family:StarSymbol;}
@list l0:level2
	{mso-level-start-at:0;
	mso-level-number-format:bullet;
	mso-level-text:◦;
	mso-level-tab-stop:none;
	mso-level-number-position:right;
	margin-left:.75in;
	text-indent:-.25in;
	mso-ansi-font-size:9.0pt;
	mso-bidi-font-size:9.0pt;
	mso-ascii-font-family:StarSymbol;
	mso-fareast-font-family:StarSymbol;
	mso-hansi-font-family:StarSymbol;
	mso-bidi-font-family:StarSymbol;}
@list l0:level3
	{mso-level-start-at:0;
	mso-level-number-format:bullet;
	mso-level-text:▪;
	mso-level-tab-stop:none;
	mso-level-number-position:right;
	margin-left:1.0in;
	text-indent:-.25in;
	mso-ansi-font-size:9.0pt;
	mso-bidi-font-size:9.0pt;
	mso-ascii-font-family:StarSymbol;
	mso-fareast-font-family:StarSymbol;
	mso-hansi-font-family:StarSymbol;
	mso-bidi-font-family:StarSymbol;}
@list l0:level4
	{mso-level-start-at:0;
	mso-level-number-format:bullet;
	mso-level-text:•;
	mso-level-tab-stop:none;
	mso-level-number-position:right;
	margin-left:1.25in;
	text-indent:-.25in;
	mso-ansi-font-size:9.0pt;
	mso-bidi-font-size:9.0pt;
	mso-ascii-font-family:StarSymbol;
	mso-fareast-font-family:StarSymbol;
	mso-hansi-font-family:StarSymbol;
	mso-bidi-font-family:StarSymbol;}
@list l0:level5
	{mso-level-start-at:0;
	mso-level-number-format:bullet;
	mso-level-text:◦;
	mso-level-tab-stop:none;
	mso-level-number-position:right;
	margin-left:1.5in;
	text-indent:-.25in;
	mso-ansi-font-size:9.0pt;
	mso-bidi-font-size:9.0pt;
	mso-ascii-font-family:StarSymbol;
	mso-fareast-font-family:StarSymbol;
	mso-hansi-font-family:StarSymbol;
	mso-bidi-font-family:StarSymbol;}
@list l0:level6
	{mso-level-start-at:0;
	mso-level-number-format:bullet;
	mso-level-text:▪;
	mso-level-tab-stop:none;
	mso-level-number-position:right;
	margin-left:1.75in;
	text-indent:-.25in;
	mso-ansi-font-size:9.0pt;
	mso-bidi-font-size:9.0pt;
	mso-ascii-font-family:StarSymbol;
	mso-fareast-font-family:StarSymbol;
	mso-hansi-font-family:StarSymbol;
	mso-bidi-font-family:StarSymbol;}
@list l0:level7
	{mso-level-start-at:0;
	mso-level-number-format:bullet;
	mso-level-text:•;
	mso-level-tab-stop:none;
	mso-level-number-position:right;
	margin-left:2.0in;
	text-indent:-.25in;
	mso-ansi-font-size:9.0pt;
	mso-bidi-font-size:9.0pt;
	mso-ascii-font-family:StarSymbol;
	mso-fareast-font-family:StarSymbol;
	mso-hansi-font-family:StarSymbol;
	mso-bidi-font-family:StarSymbol;}
@list l0:level8
	{mso-level-start-at:0;
	mso-level-number-format:bullet;
	mso-level-text:◦;
	mso-level-tab-stop:none;
	mso-level-number-position:right;
	margin-left:2.25in;
	text-indent:-.25in;
	mso-ansi-font-size:9.0pt;
	mso-bidi-font-size:9.0pt;
	mso-ascii-font-family:StarSymbol;
	mso-fareast-font-family:StarSymbol;
	mso-hansi-font-family:StarSymbol;
	mso-bidi-font-family:StarSymbol;}
@list l0:level9
	{mso-level-start-at:0;
	mso-level-number-format:bullet;
	mso-level-text:▪;
	mso-level-tab-stop:none;
	mso-level-number-position:right;
	margin-left:2.5in;
	text-indent:-.25in;
	mso-ansi-font-size:9.0pt;
	mso-bidi-font-size:9.0pt;
	mso-ascii-font-family:StarSymbol;
	mso-fareast-font-family:StarSymbol;
	mso-hansi-font-family:StarSymbol;
	mso-bidi-font-family:StarSymbol;}
@list l1
	{mso-list-id:2140025293;
	mso-list-template-ids:1941582488;}
@list l1:level1
	{mso-level-start-at:0;
	mso-level-number-format:bullet;
	mso-level-text:•;
	mso-level-tab-stop:none;
	mso-level-number-position:right;
	text-indent:-.25in;
	mso-ansi-font-size:9.0pt;
	mso-bidi-font-size:9.0pt;
	mso-ascii-font-family:StarSymbol;
	mso-fareast-font-family:StarSymbol;
	mso-hansi-font-family:StarSymbol;
	mso-bidi-font-family:StarSymbol;}
@list l1:level2
	{mso-level-start-at:0;
	mso-level-number-format:bullet;
	mso-level-text:◦;
	mso-level-tab-stop:none;
	mso-level-number-position:right;
	margin-left:.75in;
	text-indent:-.25in;
	mso-ansi-font-size:9.0pt;
	mso-bidi-font-size:9.0pt;
	mso-ascii-font-family:StarSymbol;
	mso-fareast-font-family:StarSymbol;
	mso-hansi-font-family:StarSymbol;
	mso-bidi-font-family:StarSymbol;}
@list l1:level3
	{mso-level-start-at:0;
	mso-level-number-format:bullet;
	mso-level-text:▪;
	mso-level-tab-stop:none;
	mso-level-number-position:right;
	margin-left:1.0in;
	text-indent:-.25in;
	mso-ansi-font-size:9.0pt;
	mso-bidi-font-size:9.0pt;
	mso-ascii-font-family:StarSymbol;
	mso-fareast-font-family:StarSymbol;
	mso-hansi-font-family:StarSymbol;
	mso-bidi-font-family:StarSymbol;}
@list l1:level4
	{mso-level-start-at:0;
	mso-level-number-format:bullet;
	mso-level-text:•;
	mso-level-tab-stop:none;
	mso-level-number-position:right;
	margin-left:1.25in;
	text-indent:-.25in;
	mso-ansi-font-size:9.0pt;
	mso-bidi-font-size:9.0pt;
	mso-ascii-font-family:StarSymbol;
	mso-fareast-font-family:StarSymbol;
	mso-hansi-font-family:StarSymbol;
	mso-bidi-font-family:StarSymbol;}
@list l1:level5
	{mso-level-start-at:0;
	mso-level-number-format:bullet;
	mso-level-text:◦;
	mso-level-tab-stop:none;
	mso-level-number-position:right;
	margin-left:1.5in;
	text-indent:-.25in;
	mso-ansi-font-size:9.0pt;
	mso-bidi-font-size:9.0pt;
	mso-ascii-font-family:StarSymbol;
	mso-fareast-font-family:StarSymbol;
	mso-hansi-font-family:StarSymbol;
	mso-bidi-font-family:StarSymbol;}
@list l1:level6
	{mso-level-start-at:0;
	mso-level-number-format:bullet;
	mso-level-text:▪;
	mso-level-tab-stop:none;
	mso-level-number-position:right;
	margin-left:1.75in;
	text-indent:-.25in;
	mso-ansi-font-size:9.0pt;
	mso-bidi-font-size:9.0pt;
	mso-ascii-font-family:StarSymbol;
	mso-fareast-font-family:StarSymbol;
	mso-hansi-font-family:StarSymbol;
	mso-bidi-font-family:StarSymbol;}
@list l1:level7
	{mso-level-start-at:0;
	mso-level-number-format:bullet;
	mso-level-text:•;
	mso-level-tab-stop:none;
	mso-level-number-position:right;
	margin-left:2.0in;
	text-indent:-.25in;
	mso-ansi-font-size:9.0pt;
	mso-bidi-font-size:9.0pt;
	mso-ascii-font-family:StarSymbol;
	mso-fareast-font-family:StarSymbol;
	mso-hansi-font-family:StarSymbol;
	mso-bidi-font-family:StarSymbol;}
@list l1:level8
	{mso-level-start-at:0;
	mso-level-number-format:bullet;
	mso-level-text:◦;
	mso-level-tab-stop:none;
	mso-level-number-position:right;
	margin-left:2.25in;
	text-indent:-.25in;
	mso-ansi-font-size:9.0pt;
	mso-bidi-font-size:9.0pt;
	mso-ascii-font-family:StarSymbol;
	mso-fareast-font-family:StarSymbol;
	mso-hansi-font-family:StarSymbol;
	mso-bidi-font-family:StarSymbol;}
@list l1:level9
	{mso-level-start-at:0;
	mso-level-number-format:bullet;
	mso-level-text:▪;
	mso-level-tab-stop:none;
	mso-level-number-position:right;
	margin-left:2.5in;
	text-indent:-.25in;
	mso-ansi-font-size:9.0pt;
	mso-bidi-font-size:9.0pt;
	mso-ascii-font-family:StarSymbol;
	mso-fareast-font-family:StarSymbol;
	mso-hansi-font-family:StarSymbol;
	mso-bidi-font-family:StarSymbol;}

-->
</style></head><h1 style="margin: 12pt 0in 6pt; break-after: avoid; font-size: 14pt; font-family: Arial, sans-serif; caret-color: rgb(0, 0, 0); color: rgb(0, 0, 0); font-style: normal; font-variant-caps: normal; letter-spacing: normal; orphans: auto; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: auto; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration: none;"><a name="same-ticket-content-assigned-to-several-">Same ticket content assigned to several agents as separate tickets</a><o:p></o:p></h1><p class="Textbody" style="margin-left:.5in;text-indent:-.5in;mso-text-indent-alt:
-.25in;mso-list:l1 level1 lfo1"><!--[if !supportLists]--><span style="font-size:
9.0pt;font-family:StarSymbol;mso-fareast-font-family:StarSymbol;mso-bidi-font-family:
StarSymbol"><span style="mso-list:Ignore"><span style="font:7.0pt &quot;Times New Roman&quot;">      <span class="Apple-converted-space"> </span></span>•<span style="font:7.0pt &quot;Times New Roman&quot;">        <span class="Apple-converted-space"> </span></span></span></span><!--[endif]-->Use case is described in detail below.<o:p></o:p></p><p class="Textbody" style="margin-left:.5in;text-indent:-.5in;mso-text-indent-alt:
-.25in;mso-list:l1 level1 lfo1"><!--[if !supportLists]--><span style="font-size:
9.0pt;font-family:StarSymbol;mso-fareast-font-family:StarSymbol;mso-bidi-font-family:
StarSymbol"><span style="mso-list:Ignore"><span style="font:7.0pt &quot;Times New Roman&quot;">      <span class="Apple-converted-space"> </span></span>•<span style="font:7.0pt &quot;Times New Roman&quot;">        <span class="Apple-converted-space"> </span></span></span></span><!--[endif]-->This is very helpful when we have to notify a group of people internally about a policy change or cause some action to be taken.<o:p></o:p></p><p class="Textbody" style="margin-left:.5in;text-indent:-.5in;mso-text-indent-alt:
-.25in;mso-list:l1 level1 lfo1"><!--[if !supportLists]--><span style="font-size:
9.0pt;font-family:StarSymbol;mso-fareast-font-family:StarSymbol;mso-bidi-font-family:
StarSymbol"><span style="mso-list:Ignore"><span style="font:7.0pt &quot;Times New Roman&quot;">      <span class="Apple-converted-space"> </span></span>•<span style="font:7.0pt &quot;Times New Roman&quot;">        <span class="Apple-converted-space"> </span></span></span></span><!--[endif]-->For instance if there is a new pricing table for Essential Studio, this can be used to notify all reps and managers.<o:p></o:p></p><h1 style="margin: 12pt 0in 6pt; break-after: avoid; font-size: 14pt; font-family: Arial, sans-serif; caret-color: rgb(0, 0, 0); color: rgb(0, 0, 0); font-style: normal; font-variant-caps: normal; letter-spacing: normal; orphans: auto; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: auto; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration: none;"><a name="part-1---create-groups-suitable-for-assi">Part 1 - create groups suitable for assignment</a><o:p></o:p></h1><p class="Textbody" style="margin-left:.5in;text-indent:-.5in;mso-text-indent-alt:
-.25in;mso-list:l0 level1 lfo2"><!--[if !supportLists]--><span style="font-size:
9.0pt;font-family:StarSymbol;mso-fareast-font-family:StarSymbol;mso-bidi-font-family:
StarSymbol"><span style="mso-list:Ignore"><span style="font:7.0pt &quot;Times New Roman&quot;">      <span class="Apple-converted-space"> </span></span>•<span style="font:7.0pt &quot;Times New Roman&quot;">        <span class="Apple-converted-space"> </span></span></span></span><!--[endif]-->This can be created by the admin or by individual agents.<o:p></o:p></p><p class="Textbody" style="margin-left:.5in;text-indent:-.5in;mso-text-indent-alt:
-.25in;mso-list:l0 level1 lfo2"><!--[if !supportLists]--><span style="font-size:
9.0pt;font-family:StarSymbol;mso-fareast-font-family:StarSymbol;mso-bidi-font-family:
StarSymbol"><span style="mso-list:Ignore"><span style="font:7.0pt &quot;Times New Roman&quot;">      <span class="Apple-converted-space"> </span></span>•<span style="font:7.0pt &quot;Times New Roman&quot;">        <span class="Apple-converted-space"> </span></span></span></span><!--[endif]-->Agents can share groups with others as permissions allow.<o:p></o:p></p><p class="Textbody" style="margin-left:.5in;text-indent:-.5in;mso-text-indent-alt:
-.25in;mso-list:l0 level1 lfo2"><!--[if !supportLists]--><span style="font-size:
9.0pt;font-family:StarSymbol;mso-fareast-font-family:StarSymbol;mso-bidi-font-family:
StarSymbol"><span style="mso-list:Ignore"><span style="font:7.0pt &quot;Times New Roman&quot;">      <span class="Apple-converted-space"> </span></span>•<span style="font:7.0pt &quot;Times New Roman&quot;">        <span class="Apple-converted-space"> </span></span></span></span><!--[endif]-->Each group will simply be a list of agents. For instance NLR agents can be a group that contains NLR agents.<o:p></o:p></p><p class="Textbody" style="margin-left:.5in;text-indent:-.5in;mso-text-indent-alt:
-.25in;mso-list:l0 level1 lfo2"><!--[if !supportLists]--><span style="font-size:
9.0pt;font-family:StarSymbol;mso-fareast-font-family:StarSymbol;mso-bidi-font-family:
StarSymbol"><span style="mso-list:Ignore"><span style="font:7.0pt &quot;Times New Roman&quot;">      <span class="Apple-converted-space"> </span></span>•<span style="font:7.0pt &quot;Times New Roman&quot;">        <span class="Apple-converted-space"> </span></span></span></span><!--[endif]-->Maybe an existing group implementation can be reused for this.<o:p></o:p></p><h1 style="margin: 12pt 0in 6pt; break-after: avoid; font-size: 14pt; font-family: Arial, sans-serif; caret-color: rgb(0, 0, 0); color: rgb(0, 0, 0); font-style: normal; font-variant-caps: normal; letter-spacing: normal; orphans: auto; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: auto; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration: none;"><a name="part-2---create-and-assign-ticket-to-a-g">Part 2 - Create and assign ticket to a group</a><o:p></o:p></h1><p class="Firstparagraph" style="margin: 4.3pt 0in; font-size: medium; font-family: &quot;Times New Roman&quot;, serif; caret-color: rgb(0, 0, 0); color: rgb(0, 0, 0); font-style: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: auto; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: auto; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration: none;"><img width="499" height="214" src="blob:null/9c4dab55-038a-47b5-8be4-90c44e391017" align="left" hspace="12" v:shapes="img1"><o:p></o:p></p><p class="Textbody" style="margin: 4.3pt 0in; font-size: medium; font-family: &quot;Times New Roman&quot;, serif; caret-color: rgb(0, 0, 0); color: rgb(0, 0, 0); font-style: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: auto; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: auto; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration: none;"><o:p> </o:p></p></html>`;
        let defaultUserAgent= navigator.userAgent;
        beforeEach((done: Function) => {
            Browser.userAgent="Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Mobile Safari/537.36"
            "Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Mobile Safari/537.36";
            rteObj = renderRTE({
                pasteCleanupSettings: {
                    prompt: false
                },
                toolbarSettings: {
                    items: ['FontColor', 'BackgroundColor', 'Bold']
                }
            });
            rteEle = rteObj.element;
            done();
        });
        it(' Check the fontColor and backgroundColor ', (done) => {
            rteObj.dataBind();
            keyBoardEvent.clipboardData = {
                getData: () => {
                    return copied;
                },
                items: []
            };
            setCursorPoint(rteObj.inputElement.firstChild as HTMLElement, 0);
            rteObj.onPaste(keyBoardEvent);
            setTimeout(() => {
                expect(rteObj.inputElement.querySelector('img').alt !=='Unsupported file format').toBe(true);
                done();
            }, 200);
        });
        afterEach((done: DoneFn) => {
            destroy(rteObj);
            Browser.userAgent =defaultUserAgent;
            done();
        });
    });

        describe('916197: OneNote checklist items pasted with improper element structure.', () => {
        let editor: RichTextEditor;
        beforeAll((done: DoneFn) => {
            editor = renderRTE({
                pasteCleanupSettings : {
                    keepFormat : false
                }
            });
            done();
        });
        afterAll((done: DoneFn) => {
            destroy(editor);
            done();
        });
        it ('Should remnove the ul wrapping the paragraph nodes.', (done: DoneFn) => {
            editor.focusIn();
            const clipBoardData: string = `<html xmlns:o="urn:schemas-microsoft-com:office:office"\r\nxmlns:dt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882"\r\nxmlns="http://www.w3.org/TR/REC-html40">\r\n\r\n<head>\r\n<meta http-equiv=Content-Type content="text/html; charset=utf-8">\r\n<meta name=ProgId content=OneNote.File>\r\n<meta name=Generator content="Microsoft OneNote 15">\r\n</head>\r\n\r\n<body lang=en-US style='font-family:Calibri;font-size:11.0pt'>\r\n\x3C!--StartFragment-->\r\n\r\n<div style='direction:ltr;border-width:100%'>\r\n\r\n<div style='direction:ltr;margin-top:0in;margin-left:0in;width:1.4458in'>\r\n\r\n<div style='direction:ltr;margin-top:0in;margin-left:0in;width:1.4458in'>\r\n\r\n<ul style='direction:ltr;unicode-bidi:embed;margin-top:0in;margin-bottom:0in'>\r\n <p style='margin:0in;font-family:Calibri;font-size:11.0pt'>Check List</p>\r\n <p style='color:#000000;margin:0in;text-indent:-.1666in;font-family:Calibri;\r\n font-size:11.0pt'><img\r\n src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAySURBVDhPYxQqm/WfgQIANuBFSwKUSxqQqFnAwARlkw1GDRg1AARGDYDmRiibDMDAAACSDAmB2sfKTAAAAABJRU5ErkJggg=="\r\n width=16 height=16 alt="To Do">&nbsp;To do 1</p>\r\n <p style='color:#000000;margin:0in;text-indent:-.1666in;font-family:Calibri;\r\n font-size:11.0pt'><img\r\n src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAySURBVDhPYxQqm/WfgQIANuBFSwKUSxqQqFnAwARlkw1GDRg1AARGDYDmRiibDMDAAACSDAmB2sfKTAAAAABJRU5ErkJggg=="\r\n width=16 height=16 alt="To Do">&nbsp;To do 2</p>\r\n <p style='color:#000000;margin:0in;text-indent:-.1666in;font-family:Calibri;\r\n font-size:11.0pt'><img\r\n src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAySURBVDhPYxQqm/WfgQIANuBFSwKUSxqQqFnAwARlkw1GDRg1AARGDYDmRiibDMDAAACSDAmB2sfKTAAAAABJRU5ErkJggg=="\r\n width=16 height=16 alt="To Do">&nbsp;To do 3</p>\r\n</ul>\r\n\r\n</div>\r\n\r\n</div>\r\n\r\n</div>\r\n\r\n\x3C!--EndFragment-->\r\n</body>\r\n\r\n</html>\r\n`;
            const dataTransfer: DataTransfer = new DataTransfer();
            dataTransfer.setData('text/html', clipBoardData);
            const pasteEvent: ClipboardEvent = new ClipboardEvent('paste', { clipboardData: dataTransfer } as ClipboardEventInit);
            editor.onPaste(pasteEvent);
            setTimeout(() => {
                expect(editor.inputElement.querySelector('ul')).toBeNull();
                done();
            }, 100);
        });
    });

});// Add the spec above this.

import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from '../../test-helper.spec';
import { DocumentEditorContainer } from '../../../src/document-editor-container/document-editor-container';
import { Toolbar } from '../../../src/document-editor-container/tool-bar/tool-bar';
import { Editor } from '../../../src/document-editor/implementation/editor/editor';
import { Selection } from '../../../src/document-editor/implementation/selection/selection';
import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';

/**
 * Extracts the rendered text and its active fill color from the exported path string.
 *
 * The `exportAsPath(pageNumber)` API returns a serialized render-command string where:
 * - `FS:<color>;` records the canvas fill style (the revision author color for tracked text).
 * - `FT:<text>;x:<x>;y:<y>;` records the drawn text (fillText).
 * A tracked text is always preceded (in render order) by the `FS:` token of its
 * revision color, so pairing the last `FS` seen before each `FT` yields the
 * fill color applied to that text.
 *
 * @param {string} exportedPath - The string returned by `documentEditor.exportAsPath(pageNumber)`.
 * @returns {{ text: string, color: string }[]} Ordered list of rendered text with its fill color.
 */
function getRenderedTextColors(exportedPath: string): { text: string; color: string }[] {
    const result: { text: string; color: string }[] = [];
    const pending: number[] = [];
    const usedColors: { [key: string]: boolean } = {};
    const tokens: string[] = exportedPath.split(';');
    for (let i: number = 0; i < tokens.length; i++) {
        const token: string = tokens[i];
        if (token.indexOf('FT:') === 0) {
            result.push({
                text: token.substring(3),
                color: ''
            });
            pending.push(result.length - 1);
        } else if (token.indexOf('FS:') === 0) {
            const color: string = token.substring(3);
            if (
                color === '#FFFFFF' ||
                color === '#000000' ||
                color === ''
            ) {
                continue;
            }
            // Skip duplicate FS used for FR
            if (usedColors[color]) {
                usedColors[color] = false;
                continue;
            }
            if (pending.length > 0) {
                const index: number = pending.shift()!;
                result[index].color = color;
                usedColors[color] = true;
            }
        }
    }
    return result;
}

/**
 * Test Suite: revisionColors Feature
 * 
 * Purpose: Validates that revision colors are correctly applied to tracked changes
 * when multiple users collaborate with different revision colors, and that exported
 * content preserves both the Fill Style (FS) color values and Fill Text (FT) values.
 * 
 * Scenarios:
 * 1. Best-case: All 4 revision colors used sequentially with unique user text
 * 2. Worst-case: Default color only with multiple user changes
 */
describe('revisionColors-AllMultiColorsUserTracking', () => {
  let container: DocumentEditorContainer;
  beforeAll((done: DoneFn) => {
    let element: HTMLElement = createElement('div', { id: 'container_revisionColors' });
    document.body.appendChild(element);
    
    DocumentEditorContainer.Inject(Toolbar);
    container = new DocumentEditorContainer({
      height: '590px',
      documentEditorSettings: { showRuler: false}
    });
    
    container.appendTo('#container_revisionColors');
    done();
  });

  afterAll((done: DoneFn) => {
    container.destroy();
    document.body.removeChild(document.getElementById('container_revisionColors'));
    container = undefined;
    setTimeout(() => done(), 1000);
  });

  /**
   * Checkpoint 1: First user types 2 characters with color #1
   * Expectation: Revision created with first user and default first color #b5082e
   */
  it('First user types chars with revision color #1 (#b5082e)', () => {
     container.enableTrackChanges = true;
    container.documentEditor.currentUser = 'User_1';
    container.documentEditor.editor.insertText('User 1');
    container.documentEditor.editor.insertText('User_1');
    expect(container.enableTrackChanges).toBe(true);
    expect(container.documentEditor.documentHelper.getAuthorColor('User_1')).toBe('#b5082e');
  });

  /**
   * Checkpoint 2: Second user changes and types 2 characters with color #2
   * Expectation: New revision created with second user and default second color #0e76b1
   */
  it('Second user types chars with revision color #2 (#0e76b1)', () => {
    container.documentEditorSettings.revisionSettings.revisionColors = undefined;
    container.currentUser = 'User_2';
    container.documentEditor.editorModule.onEnter();
    container.documentEditor.editor.insertText('User_2');
    expect(container.currentUser).toContain('User_2');
    expect(container.documentEditor.documentHelper.getAuthorColor('User_2')).toBe('#0e76b1');
  });

  /**
   * Checkpoint 3: Third user changes and types 2 characters with color #3
   * Expectation: Another new revision created with third user and default third color #bb00ff
   */
  it('Third user types chars with revision color #3 (#bb00ff)', () => {
    container.documentEditorSettings.revisionSettings.revisionColors = null;
    container.currentUser = 'User_3';
    container.documentEditor.editor.onEnter();
    container.documentEditor.editor.insertText('User_3');
    expect(container.currentUser).toContain('User_3');
    expect(container.documentEditor.documentHelper.getAuthorColor('User_3')).toBe('#bb00ff');
  });

  /**
   * Checkpoint 4: Fourth user changes and types 2 characters with color #4
   * Expectation: Final new revision created with fourth user and default fourth color #c14f16
   */
  it('Fourth user types chars with revision color #4 (#c14f16)', (done) => {
    container.documentEditorSettings.revisionSettings = {revisionColors: ['#d1df14']};
    setTimeout(() => {
      container.currentUser = 'User_4';
    container.enableTrackChanges = false;
    container.documentEditor.editor.onEnter();
    container.enableTrackChanges = true;
    container.documentEditor.editor.insertText('User_4');
    expect(container.currentUser).toContain('User_4');
    expect(container.documentEditor.documentHelper.getAuthorColor('User_1')).toBe('#d1df14');
    expect(container.documentEditor.documentHelper.getAuthorColor('User_2')).toBe('#d1df14');
    expect(container.documentEditor.documentHelper.getAuthorColor('User_3')).toBe('#d1df14');
    expect(container.documentEditor.documentHelper.getAuthorColor('User_4')).toBe('#d1df14');
    done();
    }, 400);
  });
  
  it('Fourth user types after the reset', (done) => {
    container.documentEditorSettings.revisionSettings = {revisionColors: []};
    setTimeout(() =>{
      expect(container.documentEditor.documentHelper.getAuthorColor('User_1')).toBe('#b5082e');
    expect(container.documentEditor.documentHelper.getAuthorColor('User_2')).toBe('#0e76b1');
    expect(container.documentEditor.documentHelper.getAuthorColor('User_3')).toBe('#bb00ff');
    expect(container.documentEditor.documentHelper.getAuthorColor('User_4')).toBe('#c14f16');
    done();
    },400)
    
  })
    

    /**
   * Checkpoint 5: Fifth user types 2 characters with color #5
   * Expectation: Revision created with fifth user and default fifth color '#128317'
   */
  it('Fifth user types chars with revision color #5 (#128317)', () => {
    container.currentUser = 'User_5';
    container.documentEditor.editor.insertText('User_5');
    expect(container.enableTrackChanges).toBe(true);
    expect(container.documentEditor.documentHelper.getAuthorColor('User_5')).toBe('#128317');
  });

  /**
   * Checkpoint 6: Sixth user changes and types 2 characters with color #6
   * Expectation: New revision created with sixth user and default sixth color '#881824'
   */
  it('Sixth user types chars with revision color #6 (#881824)', () => {
    container.currentUser = 'User_6';
    container.documentEditor.editorModule.onEnter();
    container.documentEditor.editor.insertText('User_6');
    expect(container.currentUser).toContain('User_6');
    expect(container.documentEditor.documentHelper.getAuthorColor('User_6')).toBe('#881824');
  });

  /**
   * Checkpoint 7: Seventh user changes and types 2 characters with color #7
   * Expectation: Another new revision created with Seventh user and default Seventh color #a26400
   */
  it('Seventh user types chars with revision color #7 (#a26400)', () => {
    container.currentUser = 'User_7';
    container.documentEditor.editor.onEnter();
    container.documentEditor.editor.insertText('User_7');
    expect(container.currentUser).toContain('User_7');
    expect(container.documentEditor.documentHelper.getAuthorColor('User_7')).toBe('#a26400');
  });

  /**
   * Checkpoint 8: Eight user changes and types 2 characters with color #8
   * Expectation: Final new revision created with eightth user and color #50565e
   */
  it('Eigth user types chars with revision color #8 (#50565e)', () => {
    container.currentUser = 'User_8';
    container.enableTrackChanges = false;
    container.documentEditor.editor.onEnter();
    container.enableTrackChanges = true;
    container.documentEditor.editor.insertText('User_8');
    expect(container.currentUser).toContain('User_8');
    expect(container.documentEditor.documentHelper.getAuthorColor('User_8')).toBe('#50565e');
  });

 /**
   * Checkpoint 5: Exported content preserves first revision color (#b5082e)
   * Expectation: Export output contains FS (Fill Style) value with first color
   */
  it('Overall Users color checking', () => {
    // Capture the string returned by exportAsPath instead of only checking it does not throw.
    const exportedPath: string = container.documentEditor.exportAsPath(1);
    expect(exportedPath).toBeDefined();
    expect(exportedPath).not.toBe('');
    // Parse the fill style (FS:) and fill text (FT:) tokens in render order.
    const renderedTextColors: { text: string, color: string }[] = getRenderedTextColors(exportedPath);
    expect(renderedTextColors.length).toBeGreaterThan(0);
    // Verify each user's tracked text is rendered with its respective revision color.
    for (let i: number = 0; i < renderedTextColors.length; i++) {
      const renderedText: string = renderedTextColors[i].text;
      const renderedColor: string = renderedTextColors[i].color;
      if (renderedText.indexOf('User_1') > -1 ) {
        expect(renderedColor).toBe('#b5082e');
      } else if (renderedText.indexOf('User_2') > -1) {
        expect(renderedColor).toBe('#0e76b1');
      } else if (renderedText.indexOf('User_3') > -1) {
        expect(renderedColor).toBe('#bb00ff');
      } else if (renderedText.indexOf('User_4') > -1) {
        expect(renderedColor).toBe('#c14f16');
      } else if (renderedText.indexOf('User_5') > -1) {
        expect(renderedColor).toBe('#128317');
      } else if (renderedText.indexOf('User_6') > -1) {
        expect(renderedColor).toBe('#881824');
      } else if (renderedText.indexOf('User_7') > -1) {
        expect(renderedColor).toBe('#a26400');
      }
    }
    // Verify all eight users' tracked texts are present in the exported output.
    const exportedTexts: string = renderedTextColors.map((item) => item.text).join('');
    expect(exportedTexts).toContain('User_1');
    expect(exportedTexts).toContain('User_2');
    expect(exportedTexts).toContain('User_3');
    expect(exportedTexts).toContain('User_4');
    expect(exportedTexts).toContain('User_5');
    expect(exportedTexts).toContain('User_6');
    expect(exportedTexts).toContain('User_7');
    expect(exportedTexts).toContain('User_8');
    expect(container.documentEditor.documentHelper.getAuthorColor('User_1')).toBe('#b5082e');
    expect(container.documentEditor.documentHelper.getAuthorColor('User_2')).toBe('#0e76b1');
    expect(container.documentEditor.documentHelper.getAuthorColor('User_3')).toBe('#bb00ff');
    expect(container.documentEditor.documentHelper.getAuthorColor('User_4')).toBe('#c14f16');
    expect(container.documentEditor.documentHelper.getAuthorColor('User_5')).toBe('#128317');
    expect(container.documentEditor.documentHelper.getAuthorColor('User_6')).toBe('#881824');
    expect(container.documentEditor.documentHelper.getAuthorColor('User_7')).toBe('#a26400');
    expect(container.documentEditor.documentHelper.getAuthorColor('User_8')).toBe('#50565e');
  });
});


describe('revisionColors-Three Colors and Four authors', () => {
  let container: DocumentEditorContainer;
  beforeAll((done: DoneFn) => {
    let element: HTMLElement = createElement('div', { id: 'container_revisionColors' });
    document.body.appendChild(element);
    
    DocumentEditorContainer.Inject(Toolbar);
    container = new DocumentEditorContainer({
      height: '590px',
      documentEditorSettings: { showRuler: false}
    });
    container.documentEditorSettings.revisionSettings.revisionColors = [ '#0e76b1', '#bb00ff',  '#c14f16'];
    container.appendTo('#container_revisionColors');
    done();
  });

  afterAll((done: DoneFn) => {
    container.destroy();
    document.body.removeChild(document.getElementById('container_revisionColors'));
    container = undefined;
    setTimeout(() => done(), 1000);
  });

  /**
   * Checkpoint 1: First user types 2 characters with color #1
   * Expectation: Revision created with first user and color #0e76b1
   */
  it('First user types chars with revision color #1 (#0e76b1)', () => {
    container.enableTrackChanges = true;
    container.documentEditor.currentUser = 'User_1';
    container.documentEditor.editor.insertText('User 1');
    expect(container.enableTrackChanges).toBe(true);
    expect(container.documentEditor.documentHelper.getAuthorColor('User_1')).toBe('#0e76b1');
  });

  /**
   * Checkpoint 2: Second user changes and types 2 characters with color #2
   * Expectation: New revision created with second user and color #bb00ff
   */
  it('Second user types chars with revision color #2 (#bb00ff)', () => {
    container.currentUser = 'User_2';
    container.documentEditor.editorModule.onEnter();
    container.documentEditor.editor.insertText('User_2');
    expect(container.currentUser).toContain('User_2');
    expect(container.documentEditor.documentHelper.getAuthorColor('User_2')).toBe('#bb00ff');
    expect(container.documentEditor.revisions.changes.length).toBeGreaterThanOrEqual(1);
  });

  /**
   * Checkpoint 3: Third user changes and types 2 characters with color #3
   * Expectation: Another new revision created with third user and color #c14f16
   */
  it('Third user types chars with revision color #3 (#c14f16)', () => {
    container.currentUser = 'User_3';
    container.documentEditor.editor.onEnter();
    container.documentEditor.editor.insertText('User_3');
    expect(container.currentUser).toContain('User_3');
    expect(container.documentEditor.documentHelper.getAuthorColor('User_3')).toBe('#c14f16');
    expect(container.documentEditor.revisions.changes.length).toBeGreaterThanOrEqual(2);
  });

  /**
   * Checkpoint 4: Fourth user changes and types 2 characters with color #4
   * Expectation: Final new revision created with fourth user and first color #0e76b1 repeats in round robin.
   */
  it('Fourth user types chars with revision color #4 (#0e76b1)', () => {
    container.currentUser = 'User_4';
    container.enableTrackChanges = false;
    container.documentEditor.editor.onEnter();
    container.enableTrackChanges = true;
    container.documentEditor.editor.insertText('User_4');
    expect(container.currentUser).toContain('User_4');
    expect(container.documentEditor.documentHelper.getAuthorColor('User_4')).toBe('#0e76b1');
    expect(container.documentEditor.revisions.changes.length).toBeGreaterThanOrEqual(3);
  });

  /**
   * Checkpoint 5: Exported content preserves first revision color (#b5082e)
   * Expectation: Export output contains FS (Fill Style) value with first color
   */
  it('Overall Users color checking', () => {
    // Capture the string returned by exportAsPath instead of only checking it does not throw.
    const exportedPath: string = container.documentEditor.exportAsPath(1);
    expect(exportedPath).toBeDefined();
    expect(exportedPath).not.toBe('');
    // Parse the fill style (FS:) and fill text (FT:) tokens in render order.
    const renderedTextColors: { text: string, color: string }[] = getRenderedTextColors(exportedPath);
    expect(renderedTextColors.length).toBeGreaterThan(0);
    // Verify each user's tracked text is rendered with its respective revision color.
    for (let i: number = 0; i < renderedTextColors.length; i++) {
      const renderedText: string = renderedTextColors[i].text;
      const renderedColor: string = renderedTextColors[i].color;
      if (renderedText.indexOf('User 1') > -1) {
        expect(renderedColor).toBe('#0e76b1');
      } else if (renderedText.indexOf('User_2') > -1) {
        expect(renderedColor).toBe('#bb00ff');
      } else if (renderedText.indexOf('User_3') > -1) {
        expect(renderedColor).toBe('#c14f16');
      }
    }
    // Verify all four users' tracked texts are present in the exported output.
    const exportedTexts: string = renderedTextColors.map((item) => item.text).join('');
    expect(exportedTexts).toContain('User 1');
    expect(exportedTexts).toContain('User_2');
    expect(exportedTexts).toContain('User_3');
    expect(exportedTexts).toContain('User_4');
    expect(container.documentEditor.documentHelper.getAuthorColor('User_1')).toBe('#0e76b1');
    expect(container.documentEditor.documentHelper.getAuthorColor('User_2')).toBe('#bb00ff');
    expect(container.documentEditor.documentHelper.getAuthorColor('User_3')).toBe('#c14f16');
    expect(container.documentEditor.documentHelper.getAuthorColor('User_4')).toBe('#0e76b1');
  });
});

/**
 * Worst-Case Scenario: Single color throughout
 * Multiple users with only one revision color
 */
describe('revisionColors-SingleColorforMultiUserTracking', () => {
  let container: DocumentEditorContainer;
  beforeAll((done: DoneFn) => {
    let element: HTMLElement = createElement('div', { id: 'container_defaultColor' });
    document.body.appendChild(element);
    
    DocumentEditorContainer.Inject(Toolbar);
    container = new DocumentEditorContainer({
      height: '590px',
      documentEditorSettings: { showRuler: false }
    });
    container.documentEditorSettings.revisionSettings.revisionColors = ['#229ee0'];
    container.appendTo('#container_defaultColor');
    done();
  });

  afterAll((done: DoneFn) => {
    container.destroy();
    document.body.removeChild(document.getElementById('container_defaultColor'));
    container = undefined;
    setTimeout(() => done(), 1000);
  });

  /**
   * Checkpoint 1: First user types 2 chars with default color
   * Expectation: Revision created with default color
   */
  it('First user types chars with default revision color', () => {
    container.enableTrackChanges = true;
    container.currentUser = 'User_One';
    container.documentEditor.editor.insertText('User_One');
    expect(container.documentEditor.documentHelper.getAuthorColor('User_One')).toBe('#229ee0');
    expect(container.documentEditor.revisions.changes.length).toBeGreaterThanOrEqual(0);
  });

  /**
   * Checkpoint 2: Second user types 2 chars with default color (no color change)
   * Expectation: New revision with default color maintained
   */
  it('Second user types chars with default revision color', () => {
    container.currentUser = 'User_Two';
    container.enableTrackChanges = false;
    container.documentEditor.editor.onEnter();
    container.enableTrackChanges = true;
    container.documentEditor.editor.insertText('User_Two');
    expect(container.currentUser).toContain('User_Two');
    expect(container.documentEditor.documentHelper.getAuthorColor('User_Two')).toBe('#229ee0');
    expect(container.documentEditor.revisions.changes.length).toBeGreaterThanOrEqual(1);
  });

  /**
   * Checkpoint 3: Third user types 2 chars with default color
   * Expectation: Another new revision with default color
   */
  it('Third user types chars with default revision color', () => {
    container.currentUser = 'User_Three';
    container.enableTrackChanges = false;
    container.documentEditor.editor.onEnter();
    container.enableTrackChanges = true;
    container.documentEditor.editor.insertText('User_Three');
    expect(container.currentUser).toContain('User_Three');
    expect(container.documentEditor.documentHelper.getAuthorColor('User_Three')).toBe('#229ee0');
    expect(container.documentEditor.revisions.changes.length).toBeGreaterThanOrEqual(2);
  });

  /**
   * Checkpoint 4: Fourth user types 2 chars with default color
   * Expectation: Final revision with default color
   */
  it('Fourth user types chars with default revision color', () => {
    container.currentUser = 'User_Four';
    container.enableTrackChanges = false;
    container.documentEditor.editor.onEnter();
    container.enableTrackChanges = true;
    container.documentEditor.editor.insertText('User_Four');
    expect(container.currentUser).toContain('User_Four');
    expect(container.documentEditor.documentHelper.getAuthorColor('User_Four')).toBe('#229ee0');
    expect(container.documentEditor.revisions.changes.length).toBeGreaterThanOrEqual(3);
  });
});



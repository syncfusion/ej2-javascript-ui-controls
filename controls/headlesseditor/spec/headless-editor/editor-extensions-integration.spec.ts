/**
 * Integration tests: EditorConfig extensions + EditorBuilder + Editor
 *
 * Tests that extensions are properly loaded, initialized, and accessible via the
 * mounted editor instance instead of only through a detached config object.
 */

import { HeadlessEditor } from '../../src/headless-editor/headless-editor';
import { EditorConfig } from '../../src/model/editor-config';
import { defineExtension } from '../../src/extensions/define-extension';
import { Command } from '../../src/commands/types';
import { paragraphExtension, headingExtension, blockquoteExtension } from '../../src/extensions/builtins';

const minimalExtensions = [paragraphExtension, headingExtension, blockquoteExtension];

function renderEditor(config: EditorConfig): { editor: HeadlessEditor; container: HTMLElement } {
  const container: HTMLElement = document.createElement('div');
  document.body.appendChild(container);

  const editor: HeadlessEditor = HeadlessEditor.create(config);
  editor.mount(container);

  return { editor, container };
}

function teardown(editor: HeadlessEditor, container: HTMLElement): void {
  try {
    editor.destroy();
  } catch {
    // already destroyed
  }

  if (container.parentNode) {
    container.parentNode.removeChild(container);
  }
}

describe('EditorConfig Extensions Integration', () => {
  describe('EditorConfig.extensions property', () => {
    it('should accept extensions array in EditorConfig', () => {
      const ext = defineExtension({
        name: 'test-ext'
      });

      const config: EditorConfig = {
        extensions: [ext]
      };

      expect(config.extensions).toBeDefined();
      expect(config.extensions?.length).toBe(1);
    });

    it('should load multiple extensions', () => {
      const ext1 = defineExtension({ name: 'ext1' });
      const ext2 = defineExtension({ name: 'ext2' });
      const ext3 = defineExtension({ name: 'ext3' });

      const config: EditorConfig = {
        extensions: [ext1, ext2, ext3]
      };

      expect(config.extensions?.length).toBe(3);
    });
  });

  describe('Editor initialization with extensions', () => {
    it('should initialize a rendered editor with extensions', () => {
      const ext = defineExtension({
        name: 'test-ext'
      });

      const config: EditorConfig = {
        extensions: [...minimalExtensions, ext]
      };

      const { editor, container } = renderEditor(config);

      expect(editor.integration.getView()).toBeDefined();
      expect(container.querySelector('.ProseMirror')).not.toBeNull();

      teardown(editor, container);
    });

    it('should call extension lifecycle hooks on the mounted editor', () => {
      let onRegisterCalled = false;

      const ext = defineExtension({
        name: 'lifecycle-test',
        onRegister: () => { onRegisterCalled = true; }
      });

      const config: EditorConfig = {
        extensions: [...minimalExtensions, ext]
      };

      const { editor, container } = renderEditor(config);

      expect(onRegisterCalled).toBeTruthy();
      expect(editor.integration.getView()).toBeDefined();

      teardown(editor, container);
    });
  });

  describe('Extension command registration', () => {
    it('should register extension commands with the mounted editor', () => {
      const ext = defineExtension({
        name: 'cmd-test',
        commands(): Command[] {
          return [
            {
              name: 'testCmd',
              canExecute: () => true,
              execute: () => { }
            }
          ];
        }
      });

      const config: EditorConfig = {
        extensions: [...minimalExtensions, ext]
      };

      const { editor, container } = renderEditor(config);

      expect(editor.commandRegistry.has('testCmd')).toBeTruthy();
      expect(editor.commands).toBeDefined();
      expect(editor.integration.getView()).toBeDefined();

      teardown(editor, container);
    });
  });
});

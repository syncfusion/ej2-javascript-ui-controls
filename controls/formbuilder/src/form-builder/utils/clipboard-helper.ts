import { FormNode } from '@syncfusion/ej2-form-renderer';
import { LocalNavigator } from '../types/form-schema';

/** @private */
export class ClipboardHelper {
  private static readonly CLIPBOARD_PREFIX = 'FORMBUILDER_FIELD:';

  /** @private */
  static async copyToClipboard(field: FormNode): Promise<void> {
    try {
      const jsonString = JSON.stringify(field, null, 2);
      const clipboardData = `${this.CLIPBOARD_PREFIX}${jsonString}`;
      await (navigator as LocalNavigator).clipboard.writeText(clipboardData);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      throw new Error(`Unable to copy field: ${error}`);
    }
  }

  /** @private */
  static async readFromClipboard(): Promise<FormNode | null> {
    try {
      const clipboardText = await (navigator as LocalNavigator).clipboard.readText();
      
      if (!clipboardText.startsWith(this.CLIPBOARD_PREFIX)) {
        console.warn('Clipboard does not contain form field data');
        return null;
      }

      const jsonString = clipboardText.substring(this.CLIPBOARD_PREFIX.length);
      const field = JSON.parse(jsonString) as FormNode;
      
      return field;
    } catch (error) {
      console.error('Failed to read from clipboard:', error);
      return null;
    }
  }

  /** @private */
  static async hasClipboardData(): Promise<boolean> {
    try {
      const clipboardText = await (navigator as LocalNavigator).clipboard.readText();
      return clipboardText.startsWith(this.CLIPBOARD_PREFIX);
    } catch (error) {
      return false;
    }
  }

  /** @private */
  static createUniqueField(sourceField: FormNode): FormNode {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    
    return {
      ...sourceField,
      id: `${sourceField.type}_${timestamp}_${random}`
    };
  }

  /** @private */
  static async clearData(): Promise<void> {
    try {
      await (navigator as LocalNavigator).clipboard.writeText('');
    } catch (error) {
      // ignore
    }
  }
}

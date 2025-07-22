/* eslint-disable @typescript-eslint/no-explicit-any */

import { BlockEditor } from "../../src/index";
import { BlockEditorModel } from "../../src/blockeditor/base/blockeditor-model";

export function createEditor(args: BlockEditorModel): BlockEditor {
    args.width = '400px';
    args.height = '400px';
    const editor: BlockEditor = new BlockEditor(args);
    return editor;
}
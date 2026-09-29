import { HeadlessEditor } from '../../src/headless-editor/headless-editor';
import { defineExtension } from '../../src/extensions/define-extension';
import { paragraphExtension } from '../../src/extensions/builtins/paragraph';
import type { Command, EditorTransaction } from '../../src/commands/types';

describe('DispatchRecorder through the rendered editor', () => {
	it('throws when one editor command dispatches more than once', () => {
		const container: HTMLElement = document.createElement('div');
		document.body.appendChild(container);
		const transaction: EditorTransaction = { brand: 'EditorTransaction' };
		const doubleDispatchCommand: Command<void> = {
			name: 'doubleDispatch',
			execute: (context) => {
				context.dispatch(transaction);
				context.dispatch(transaction);
			}
		};
		const extension = defineExtension({
			name: 'dispatch-recorder-test',
			commands: () => [doubleDispatchCommand]
		});
		const editor: HeadlessEditor = HeadlessEditor.create({ extensions: [paragraphExtension, extension] });

		try {
			editor.mount(container);
			expect(() => editor.execute('doubleDispatch')).toThrowError(
				/Command "doubleDispatch" called ctx\.dispatch\(\) more than once/
			);
		} finally {
			editor.destroy();
			container.remove();
		}
	});
});

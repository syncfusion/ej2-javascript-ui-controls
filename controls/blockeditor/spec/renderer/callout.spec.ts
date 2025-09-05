import { createElement, remove } from "@syncfusion/ej2-base";
import { BlockEditor, BlockModel, BlockType, ContentType } from "../../src/index";
import { createEditor } from "../common/util.spec";

describe('Callout Blocks', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending(); // skips test (in Chai)
            return;
        }
    });

    describe('Testing callout block', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                {
                    id: 'callout', type: BlockType.Callout,
                    props: {
                        children: [
                            {
                                id: 'callout-block-1', type: BlockType.Heading, props: { level: 1 },
                                content: [{ id: 'callout-content-1', type: ContentType.Text, content: 'Callout item 1' }],
                            },
                            {
                                id: 'callout-block-2', type: BlockType.Paragraph, content: [{ id: 'callout-content-2', type: ContentType.Text, content: 'Callout item 2' }],
                            }
                        ]
                    }
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        });

        it('should render in DOM correctly', () => {
            const blockElement = editorElement.querySelector('.e-block');
            expect(blockElement).not.toBeNull();
            expect(blockElement.classList).toContain('e-callout-block');
            expect(blockElement.querySelector('.e-callout-icon')).toBeDefined();
            const calloutChildBlocks = blockElement.querySelectorAll('.e-callout-content .e-block');
            expect(calloutChildBlocks.length).toBe(2);
            expect(calloutChildBlocks[0].querySelector('h1').textContent).toContain('Callout item 1');
            expect(calloutChildBlocks[1].querySelector('p').textContent).toContain('Callout item 2');
        });

        it('should render default block if children not specified', () => {
            const editorElement1: HTMLElement = createElement('div', { id: 'editor1' });
            document.body.appendChild(editorElement1);
            let editor1: BlockEditor = createEditor({
                blocks: [{ id: 'callout', type: BlockType.Callout }]
            });
            editor1.appendTo('#editor1');
            const calloutChildBlocks = editorElement1.querySelectorAll('.e-callout-content .e-block');
            expect(calloutChildBlocks.length).toBe(1);
            expect(calloutChildBlocks[0].querySelector('p').textContent.length).toBe(0);
            if (editor1) {
                editor1.destroy();
                editor1 = undefined;
            }
            remove(editorElement1);
        });
    });
});
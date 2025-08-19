import { createElement, remove } from '@syncfusion/ej2-base';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { BlockModel, UserModel } from '../../src/blockeditor/models';
import { BlockEditor, BlockType, ContentType, setCursorPosition, setSelectionRange, getBlockContentElement } from '../../src/index';
import { createEditor } from '../common/util.spec';

describe('Content types', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending(); // skips test (in Chai)
            return;
        }
    });

    describe('Ensuring basic rendering of content types', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                {
                    id: 'text-block',
                    type: BlockType.Paragraph,
                    content: [{ type: ContentType.Text, content: 'helloworld' }]
                },
                {
                    id: 'link-block',
                    type: BlockType.Paragraph,
                    content: [{ type: ContentType.Link, content: 'syncfusion', linkSettings: { url: 'www.syncfusion.com', openInNewWindow: true } }]
                },
                {
                    id: 'code-block',
                    type: BlockType.Paragraph,
                    content: [{ type: ContentType.Code, content: 'console.log("hello world")' }]
                },
                {
                    id: 'mention-block',
                    type: BlockType.Paragraph,
                    content: [{ type: ContentType.Mention, id: 'user1' }]
                },
                {
                    id: 'label-block',
                    type: BlockType.Paragraph,
                    content: [{ type: ContentType.Label, id: 'progress' }]
                },
                {
                    id: 'combined-block',
                    type: BlockType.Paragraph,
                    content: [
                        { type: ContentType.Text, content: 'To navigate to syncfusion site, ' },
                        { type: ContentType.Link, content: 'click here ', linkSettings: { url: 'www.syncfusion.com', openInNewWindow: true } },
                        { type: ContentType.Code, content: 'console.log("hello world"), ' },
                        { type: ContentType.Mention, id: 'user2' },
                        { type: ContentType.Label, id: 'progress' }
                    ]
                },
            ];
            const users: UserModel[] =  [
                { id: 'user1', user: 'John Paul' },
                { id: 'user2', user: 'John Snow' }
            ];
            editor = createEditor({ blocks: blocks, users: users });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        });

        it('ensure content type text rendering', () => {
            const blockElement = editorElement.querySelector('#text-block') as HTMLElement;
            expect(blockElement).not.toBeNull();
            const contentElement = getBlockContentElement(blockElement);
            expect(contentElement).not.toBeNull();
            expect(contentElement.textContent).toBe('helloworld');
        });

        it('ensure content type link rendering', () => {
            const blockElement = editorElement.querySelector('#link-block') as HTMLElement;
            expect(blockElement).not.toBeNull();
            const contentElement = getBlockContentElement(blockElement);
            expect(contentElement).not.toBeNull();
            const anchorEle = (contentElement.firstChild as HTMLElement);
            expect(anchorEle.tagName).toBe('A');
            expect(anchorEle.textContent).toBe('syncfusion');
            expect(anchorEle.getAttribute('href')).toBe('https://www.syncfusion.com');
            expect(anchorEle.getAttribute('target')).toBe('_blank');
            expect(editor.blocks[1].content[0].id).toBe(anchorEle.id);
        });

        it('ensure content type code rendering', () => {
            const blockElement = editorElement.querySelector('#code-block') as HTMLElement;
            expect(blockElement).not.toBeNull();
            const contentElement = getBlockContentElement(blockElement);
            expect(contentElement).not.toBeNull();
            const codeEle = (contentElement.firstChild as HTMLElement);
            expect(codeEle.tagName).toBe('CODE');
            expect(codeEle.textContent).toBe('console.log("hello world")');
            expect(editor.blocks[2].content[0].id).toBe(codeEle.id);
        });

        it('ensure content type mention rendering', () => {
            const blockElement = editorElement.querySelector('#mention-block') as HTMLElement;
            expect(blockElement).not.toBeNull();
            const contentElement = getBlockContentElement(blockElement);
            expect(contentElement).not.toBeNull();
            const mentionChipEle = (contentElement.firstChild as HTMLElement);
            expect(mentionChipEle.tagName).toBe('DIV');
            expect((mentionChipEle.querySelector('.em-content') as HTMLElement).textContent).toBe('John Paul');
            expect(editor.blocks[3].content[0].dataId).toBe(mentionChipEle.id);
            expect(editor.blocks[3].content[0].id).toBe(mentionChipEle.getAttribute('data-user-id'));
        });

        it('ensure content type label rendering', () => {
            const blockElement = editorElement.querySelector('#label-block') as HTMLElement;
            expect(blockElement).not.toBeNull();
            const contentElement = getBlockContentElement(blockElement);
            expect(contentElement).not.toBeNull();
            const labelChipEle = (contentElement.firstChild as HTMLElement);
            expect(labelChipEle.tagName).toBe('SPAN');
            expect(labelChipEle.textContent).toBe('Progress: In-progress');
            expect(editor.blocks[4].content[0].dataId).toBe(labelChipEle.id);
            expect(editor.blocks[4].content[0].id).toBe(labelChipEle.getAttribute('data-label-id'));
        });

        it('ensure all content types combined rendering', () => {
            const blockElement = editorElement.querySelector('#combined-block') as HTMLElement;
            expect(blockElement).not.toBeNull();
            const contentElement = getBlockContentElement(blockElement);
            expect(contentElement).not.toBeNull();
            expect(contentElement.textContent).toBe('To navigate to syncfusion site, click here console.log("hello world"), JSJohn SnowProgress: In-progress');
            const textEle = contentElement.firstChild as HTMLElement;
            expect(textEle.tagName).toBe('SPAN');
            expect(textEle.textContent).toBe('To navigate to syncfusion site, ');
            expect(editor.blocks[5].content[0].id).toBe(textEle.id);

            const anchorEle = contentElement.childNodes[1] as HTMLElement;
            expect(anchorEle.tagName).toBe('A');
            expect(anchorEle.textContent).toBe('click here ');
            expect(anchorEle.getAttribute('href')).toBe('https://www.syncfusion.com');
            expect(anchorEle.getAttribute('target')).toBe('_blank');
            expect(editor.blocks[5].content[1].id).toBe(anchorEle.id);

            const codeEle = contentElement.childNodes[2] as HTMLElement;
            expect(codeEle.tagName).toBe('CODE');
            expect(codeEle.textContent).toBe('console.log("hello world"), ');
            expect(editor.blocks[5].content[2].id).toBe(codeEle.id);

            const mentionEle = contentElement.childNodes[3] as HTMLElement;
            expect(mentionEle.tagName).toBe('DIV');
            expect((mentionEle.querySelector('.em-content') as HTMLElement).textContent).toBe('John Snow');

            const labelEle = contentElement.lastChild as HTMLElement;
            expect(labelEle.tagName).toBe('SPAN');
            expect(labelEle.textContent).toBe('Progress: In-progress');
        });
    });
});

/**
* This spec file contains test cases for:
* - Task List Extension
* - Hard Break Extension
*/

import {
    HeadlessEditor,
    TextNode,
    paragraphExtension
} from '../../../src/index';

import { taskListExtension } from '../../../src/extensions/builtins/task-list';
import { hardBreakExtension } from '../../../src/extensions/builtins/hard-break';

describe('Built-in: taskList with hardBreak', () => {
    let editor: HeadlessEditor;
    let container: HTMLElement;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);

        editor = HeadlessEditor.create({
            document: {
                type: 'document',
                id: crypto.randomUUID(),
                schemaVersion: 1,
                attrs: {},
                marks: [],
                children: [
                    {
                        type: 'taskList',
                        id: crypto.randomUUID(),
                        attrs: {},
                        marks: [],
                        children: [
                            {
                                type: 'taskItem',
                                id: crypto.randomUUID(),
                                attrs: {
                                    checked: true
                                },
                                marks: [],
                                children: [
                                    {
                                        type: 'paragraph',
                                        id: crypto.randomUUID(),
                                        attrs: {},
                                        marks: [],
                                        children: [
                                            {
                                                type: 'text',
                                                id: crypto.randomUUID(),
                                                attrs: {},
                                                children: [],
                                                text: 'Completed task',
                                                marks: []
                                            } as TextNode,
                                            {
                                                type: 'hard_break',
                                                id: crypto.randomUUID(),
                                                attrs: {},
                                                marks: [],
                                                children: []
                                            },
                                            {
                                                type: 'text',
                                                id: crypto.randomUUID(),
                                                attrs: {},
                                                children: [],
                                                text: 'Additional details',
                                                marks: []
                                            } as TextNode
                                        ]
                                    }
                                ]
                            },
                            {
                                type: 'taskItem',
                                id: crypto.randomUUID(),
                                attrs: {
                                    checked: false
                                },
                                marks: [],
                                children: [
                                    {
                                        type: 'paragraph',
                                        id: crypto.randomUUID(),
                                        attrs: {},
                                        marks: [],
                                        children: [
                                            {
                                                type: 'text',
                                                id: crypto.randomUUID(),
                                                attrs: {},
                                                children: [],
                                                text: 'Pending task',
                                                marks: []
                                            } as TextNode
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            extensions: [
                paragraphExtension,
                hardBreakExtension,
                taskListExtension
            ]
        });

        editor.mount(container);
    });

    afterEach(() => {
        if (editor && !editor.isDestroyed) {
            editor.destroy();
        }

        container.remove();
    });

    it('should render task list content with hard break and preserve checked states', () => {
        const document = editor.getDocument();

        expect(document.children.length).toBe(1);
        expect(document.children[0].type).toBe('taskList');

        const taskItems = document.children[0].children;

        expect(taskItems.length).toBe(2);

        expect(taskItems[0].attrs['checked']).toBe(true);
        expect(taskItems[1].attrs['checked']).toBe(false);

        expect(container.textContent).toContain('Completed task');
        expect(container.textContent).toContain('Additional details');
        expect(container.textContent).toContain('Pending task');
        expect(taskItems[0].children[0].children[1].type).toBe('hard_break');
        expect(container.querySelector('br')).not.toBeNull();
    });

    it('should preserve hard break content between document model and html output', () => {
        const document = editor.getDocument();
        const html = editor.getHtml();

        expect(
            document.children[0]
                .children[0]
                .children[0]
                .children[1]
                .type
        ).toBe('hard_break');

        expect(html).toContain('<br');
        expect(html).toContain('Completed task');
        expect(html).toContain('Additional details');
    });

    it('should preserve task item content after a hard break', () => {
        const taskItem =
            editor.getDocument().children[0].children[0];

        expect(
            (taskItem.children[0].children[0] as TextNode).text
        ).toBe('Completed task');

        expect(
            (taskItem.children[0].children[2] as TextNode).text
        ).toBe('Additional details');
    });

    it('should render multiple lines within a single task item', () => {
        const hardBreaks =
            container.querySelectorAll('br');

        expect(hardBreaks.length).toBe(1);

        expect(container.textContent)
            .toContain('Completed task');

        expect(container.textContent)
            .toContain('Additional details');
    });

    it('should preserve task ordering when a task item contains a hard break', () => {
        const taskItems =
            editor.getDocument().children[0].children;

        expect(
            (taskItems[0].children[0].children[0] as TextNode).text
        ).toBe('Completed task');

        expect(
            (taskItems[1].children[0].children[0] as TextNode).text
        ).toBe('Pending task');
    });

    it('should preserve checked and unchecked task states when task items contain hard breaks', () => {
        const taskItems =
            editor.getDocument().children[0].children;

        expect(taskItems[0].attrs['checked']).toBe(true);
        expect(taskItems[1].attrs['checked']).toBe(false);
    });

    it('should register task list and hard break extensions together', () => {
        const taskNodes =
            taskListExtension.config.nodes.call({
                options: { nested: true }
            } as any);

        const hardBreakNodes =
            hardBreakExtension.config.nodes();

        expect(taskNodes.length).toBe(2);
        expect(hardBreakNodes.length).toBe(1);

        expect(hardBreakNodes[0].name)
            .toBe('hard_break');
    });


    it('should preserve task list content with hard breaks after html serialization', () => {
        const html = editor.getHtml();

        expect(html).toContain('Completed task');
        expect(html).toContain('Additional details');
        expect(html).toContain('Pending task');
        expect(html).toContain('<br');
    });

    it('should register hard break dom specs keyboard shortcuts and non nested task list schema', () => {
        const hardBreakSpecs = hardBreakExtension.config.domSpecs.call({
            options: undefined
        } as any);

        const descriptor =
            hardBreakSpecs.nodes.hard_break.toDOM() as any[];

        expect(descriptor[0]).toBe('br');
        expect(descriptor[1]).toEqual({});

        const setHardBreak = jasmine
            .createSpy('setHardBreak')
            .and.returnValue(true);

        const hardBreakShortcuts =
            hardBreakExtension.config.keyboardShortcuts.call({
                editor: {
                    commands: {
                        setHardBreak
                    }
                }
            } as any);

        hardBreakShortcuts['Shift-Enter']();

        expect(setHardBreak).toHaveBeenCalled();

        const toggleTaskList = jasmine
            .createSpy('toggleTaskList')
            .and.returnValue(true);

        const toggleTaskChecked = jasmine
            .createSpy('toggleTaskChecked')
            .and.returnValue(true);

        const taskShortcuts =
            taskListExtension.config.keyboardShortcuts.call({
                editor: {
                    commands: {
                        toggleTaskList,
                        toggleTaskChecked
                    }
                }
            } as any);

        taskShortcuts['Mod-Shift-7']();
        taskShortcuts['Mod-Enter']();

        expect(toggleTaskList).toHaveBeenCalled();
        expect(toggleTaskChecked).toHaveBeenCalled();

        const nodes = taskListExtension.config.nodes.call({
            options: {
                nested: false
            }
        } as any);

        expect(nodes[1].content).toBeDefined();
    });

    it('should apply custom task item attributes handle checkbox changes and update checked state', () => {
        const toggleTaskChecked = jasmine
            .createSpy('toggleTaskChecked')
            .and.returnValue(true);

        const nodeViews = taskListExtension.config.nodeViews.call({
            options: {
                itemHtmlAttributes: {
                    'data-testid': 'task-item',
                    role: 'listitem'
                }
            },
            editor: {
                commands: {
                    toggleTaskChecked
                }
            }
        } as any);

        const nodeView = nodeViews.taskItem(
            {
                checked: true
            },
            {},
            () => 10
        );

        const li = nodeView.dom as HTMLElement;

        expect(li.getAttribute('data-testid'))
            .toBe('task-item');

        expect(li.getAttribute('role'))
            .toBe('listitem');

        expect(li.getAttribute('data-checked'))
            .toBe('true');

        const checkbox = li.querySelector(
            'input[type="checkbox"]'
        ) as HTMLInputElement;

        expect(checkbox.checked).toBe(true);

        checkbox.dispatchEvent(new Event('change'));

        expect(toggleTaskChecked)
            .toHaveBeenCalledWith({ pos: 10 });

        expect(
            nodeView.update({
                checked: false
            })
        ).toBe(true);

        expect(checkbox.checked).toBe(false);

        expect(li.getAttribute('data-checked'))
            .toBe('false');

        nodeView.destroy();
    });

    it('should serialize aligned task items and parse checked task list items using default html attributes', () => {
        const specs = taskListExtension.config.domSpecs.call({
            options: undefined
        } as any);

        const taskListDescriptor =
            specs.nodes.taskList.toDOM() as any[];

        expect(taskListDescriptor[0]).toBe('ul');
        expect(taskListDescriptor[1]).toEqual({
            'data-type': 'taskList'
        });

        const taskItemDescriptor =
            specs.nodes.taskItem.toDOM({
                checked: true,
                align: 'center'
            }) as any[];

        expect(taskItemDescriptor[0]).toBe('li');

        expect(taskItemDescriptor[1]['data-checked'])
            .toBe('true');

        expect(taskItemDescriptor[1]['style'])
            .toBe('text-align: center');

        const parseDOM =
            specs.nodes.taskItem.parseDOM!;

        expect(parseDOM[0].tag)
            .toBe('li[data-type="taskItem"]');

        expect(typeof parseDOM[0].getAttrs)
            .toBe('function');
    });

    it('should initialize task item node views with default attributes and execute checked task input rule configuration', () => {
        const rules = taskListExtension.config.inputRules!.call({} as any);

        expect(rules.length).toBe(2);

        const toggleTaskChecked = jasmine
            .createSpy('toggleTaskChecked')
            .and.returnValue(true);

        const nodeViews = taskListExtension.config.nodeViews.call({
            editor: {
                commands: {
                    toggleTaskChecked
                }
            },
            options: undefined
        } as any);

        const nodeView = nodeViews.taskItem(
            {
                checked: true
            },
            {},
            () => undefined
        );

        const li = nodeView.dom as HTMLElement;

        expect(li.getAttribute('data-type')).toBe('taskItem');
        expect(li.getAttribute('data-checked')).toBe('true');

        const checkbox = li.querySelector(
            'input[type="checkbox"]'
        ) as HTMLInputElement;

        expect(checkbox.checked).toBe(true);

        checkbox.dispatchEvent(new Event('change'));
        expect(toggleTaskChecked).toHaveBeenCalledWith(undefined);
        expect(nodeView.update({ checked: false })).toBe(true);
        expect(checkbox.checked).toBe(false);
        expect(li.getAttribute('data-checked')).toBe('false');

        nodeView.destroy();
    });

    it('should register task list metadata default options schema and commands', () => {
        const options = taskListExtension.config.defineOptions() as any;

        const nodes = taskListExtension.config.nodes.call({
            options
        } as any);

        const commands = taskListExtension.config.commands();

        expect(taskListExtension.name).toBe('task-list');

        expect(options.htmlAttributes).toEqual({});
        expect(options.itemHtmlAttributes).toEqual({});
        expect(options.nested).toBe(true);

        expect(nodes.length).toBe(2);

        expect(nodes[0].name).toBe('taskList');
        expect(nodes[1].name).toBe('taskItem');

        expect(commands.length).toBe(2);
    });

    it('should register hard break metadata default options schema and commands', () => {
        const options = hardBreakExtension.config.defineOptions() as any;

        const nodes = hardBreakExtension.config.nodes();

        const commands = hardBreakExtension.config.commands();

        expect(hardBreakExtension.name).toBe('hardBreak');

        expect(options.htmlAttributes).toEqual({});

        expect(nodes.length).toBe(1);

        expect(nodes[0].name).toBe('hard_break');
        expect(nodes[0].inline).toBe(true);
        expect(nodes[0].group).toBe('inline');

        expect(commands.length).toBe(1);
    });

});

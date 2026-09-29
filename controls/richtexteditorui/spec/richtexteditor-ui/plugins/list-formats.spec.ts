import { RichTextEditorUI, ToolbarSettingsModel, itemClickEventArgs } from '../../../src/richtexteditor-ui/index';
import { destroyRTE, renderRTE } from '../../base.spec';
import {
    BulletFormatList,
    BulletFormatLists,
    NumberFormatList,
    NumberFormatLists,
    getBulletFormatList,
    getNumberFormatList
} from '../../../src/core/plugins/list-formats';

describe('List Plugin - NumberFormatList / BulletFormatList catalogs', () => {

    describe('Numbered list catalog', () => {
        it('Should expose exactly five canonical numbered styles', () => {
            expect(NumberFormatLists.length).toBe(6);
        });

        it('Should include decimal, lowerAlpha, upperAlpha, lowerRoman, upperRoman', () => {
            const types: string[] = NumberFormatLists.map((entry: NumberFormatList) => entry.listType);
            expect(types).toContain('decimal');
            expect(types).toContain('lowerAlpha');
            expect(types).toContain('upperAlpha');
            expect(types).toContain('lowerRoman');
            expect(types).toContain('upperRoman');
        });

        it('Should wire every entry to the setListStyle command', () => {
            for (let i: number = 0; i < NumberFormatLists.length; i++) {
                expect(NumberFormatLists[i as number].command).toBe('setListStyle');
            }
        });

        it('Should resolve entries through getNumberFormatList()', () => {
            expect(getNumberFormatList('decimal')!.id).toBe('NumberDecimal');
            expect(getNumberFormatList('lowerAlpha')!.id).toBe('NumberLowerAlpha');
            expect(getNumberFormatList('upperRoman')!.id).toBe('NumberUpperRoman');
        });

        it('Should return undefined for unknown / missing types', () => {
            expect(getNumberFormatList(undefined)).toBeUndefined();
            expect(getNumberFormatList('square' as never)).toBeUndefined();
        });
    });

    describe('Bulleted list catalog', () => {
        it('Should expose exactly three canonical bulleted styles', () => {
            expect(BulletFormatLists.length).toBe(3);
        });

        it('Should include disc, circle, square', () => {
            const types: string[] = BulletFormatLists.map((entry: BulletFormatList) => entry.listType);
            expect(types).toContain('disc');
            expect(types).toContain('circle');
            expect(types).toContain('square');
        });

        it('Should wire every entry to the setListStyle command', () => {
            for (let i: number = 0; i < BulletFormatLists.length; i++) {
                expect(BulletFormatLists[i as number].command).toBe('setListStyle');
            }
        });

        it('Should resolve entries through getBulletFormatList()', () => {
            expect(getBulletFormatList('disc')!.id).toBe('BulletDisc');
            expect(getBulletFormatList('circle')!.id).toBe('BulletCircle');
            expect(getBulletFormatList('square')!.id).toBe('BulletSquare');
        });

        it('Should return undefined for unknown / missing types', () => {
            expect(getBulletFormatList(undefined)).toBeUndefined();
            expect(getBulletFormatList('decimal' as never)).toBeUndefined();
        });
    });
});

describe('List Plugin - Command Builder integration through RTE', () => {
    let editor: RichTextEditorUI;
    afterEach(() => {
        if (editor) { destroyRTE(editor); }
    });

    it('Should accept commands.numberedList().apply() without throwing', () => {
        editor = renderRTE({
            toolbarSettings: {
                items: ['BulletList', 'NumberedList'],
                type: 'MultiRow'
            }
        });
        expect((): void => {
            editor.commands().numberedList().apply();
        }).not.toThrow();
    });

    it('Should accept commands.bulletList().apply() without throwing', () => {
        editor = renderRTE({
            toolbarSettings: {
                items: ['BulletList', 'NumberedList'],
                type: 'MultiRow'
            }
        });
        expect((): void => {
            editor.commands().bulletList().apply();
        }).not.toThrow();
    });

    it('Should accept commands.setListStyle().listType("lowerAlpha").apply() without throwing', () => {
        editor = renderRTE({
            toolbarSettings: {
                items: ['BulletList', 'NumberedList'],
                type: 'MultiRow'
            }
        });
        expect((): void => {
            editor.commands().setListStyle().listType('lowerAlpha').apply();
        }).not.toThrow();
    });

    it('Should accept commands.numberedList().options({ listType: "decimal" }).apply() without throwing', () => {
        editor = renderRTE({
            toolbarSettings: {
                items: ['BulletList', 'NumberedList'],
                type: 'MultiRow'
            }
        });
        expect((): void => {
            editor.commands().numberedList().options({ listType: 'decimal' }).apply();
        }).not.toThrow();
    });

    it('Should accept commands.bulletList().options({ listType: "square" }).apply() without throwing', () => {
        editor = renderRTE({
            toolbarSettings: {
                items: ['BulletList', 'NumberedList'],
                type: 'MultiRow'
            }
        });
        expect((): void => {
            editor.commands().bulletList().options({ listType: 'square' }).apply();
        }).not.toThrow();
    });

    it('Should accept commands.indent().apply() and commands.outdent().apply() without throwing', () => {
        editor = renderRTE({
            toolbarSettings: {
                items: ['BulletList', 'NumberedList', 'Indent', 'Outdent'],
                type: 'MultiRow'
            } as ToolbarSettingsModel
        });
        expect((): void => {
            editor.commands().indent().apply();
            editor.commands().outdent().apply();
        }).not.toThrow();
    });
});

describe('List Plugin - toolbar interactions', () => {
    let editor: RichTextEditorUI;
    afterEach(() => {
        if (editor) { destroyRTE(editor); }
    });

    it('Should render BulletList and NumberedList buttons', (done: DoneFn) => {
        editor = renderRTE({
            toolbarSettings: {
                items: ['BulletList', 'NumberedList'],
                type: 'MultiRow'
            } as ToolbarSettingsModel
        });
        setTimeout((): void => {
            expect(!!document.querySelector('#' + editor.element.id + '_toolbar_BulletList')).toBe(true);
            expect(!!document.querySelector('#' + editor.element.id + '_toolbar_NumberedList')).toBe(true);
            done();
        }, 200);
    });

    it('Should fire itemClick with actionId "bulletList" when BulletList is clicked', (done: DoneFn) => {
        let actionId: string = '';
        editor = renderRTE({
            toolbarSettings: {
                items: ['BulletList'],
                type: 'MultiRow',
                itemClicked: (args: any) => {
                    actionId = args.item.id;
                }
            }
        });
        setTimeout((): void => {
            const bulletItem: HTMLElement | null = document.querySelector('#' + editor.element.id + '_toolbar_BulletList');
            expect(bulletItem).not.toBeNull();
            bulletItem!.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
            setTimeout((): void => {
                expect(actionId).not.toBeNull();
                done();
            }, 100);
        }, 200);
    });

    it('Should fire itemClick with actionId "numberedList" when NumberedList is clicked', (done: DoneFn) => {
        let actionId: string = '';
        editor = renderRTE({
            toolbarSettings: {
                items: ['NumberedList'],
                type: 'MultiRow',
                itemClicked: (args: any) => {
                    actionId = args.item.id;
                }
            }
        });
        setTimeout((): void => {
            const numberedItem: HTMLElement | null = document.querySelector('#' + editor.element.id + '_toolbar_NumberedList');
            expect(numberedItem).not.toBeNull();
            numberedItem!.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
            setTimeout((): void => {
                expect(actionId).not.toBeNull();
                done();
            }, 100);
        }, 200);
    });
});

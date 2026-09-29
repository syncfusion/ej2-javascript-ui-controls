import { createElement } from '@syncfusion/ej2-base';
import { DocumentEditorContainer } from '../../../src/document-editor-container/document-editor-container';
import { Ribbon } from '../../../src/document-editor-container/ribbon/ribbon';
import {
    NumberingGroup, NUMBER_LIST_ID
} from '../../../src/document-editor-container/ribbon/home-tab/numbering-group';
import { RIBBON_ID } from '../../../src/document-editor-container/ribbon/ribbon-base/ribbon-constants';

describe('Numbering Group Tests', () => {
    let container: DocumentEditorContainer;
    let containerElement: HTMLElement;
    let paragraphGroup: any;
    let ribbonModule: any;
    let ribbon: any;
    let ribbonId: string;
    let numberingGroup: any;
    let groupPrefix: string;

    beforeAll(() => {
        containerElement = document.createElement('div') as any;
        containerElement.id = 'ribbon';
        document.body.appendChild(containerElement);

        DocumentEditorContainer.Inject(Ribbon);
        container = new DocumentEditorContainer({
            height: "590px",
            toolbarMode: 'Ribbon',
            ribbonLayout: 'Classic'
        });
        container.serviceUrl = 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/';
        container.appendTo('#ribbon') as any;

        ribbonModule = (container as any).ribbonModule;
        ribbon = ribbonModule && (container as any).ribbonModule.ribbon;
        ribbonId = ribbon ? ribbon.element.id : '';
        paragraphGroup = (container as any).ribbonModule.tabManager.homeTab.paragraphGroup;
        groupPrefix = container.element.id + RIBBON_ID;
        numberingGroup = (paragraphGroup as any).numberingGroup;
    });

    afterAll(() => {
        if (container) {
            container.destroy();
            container = null;
        }
        if (containerElement) {
            document.body.removeChild(containerElement);
        }
    });

    // constructor
    it('constructor initializes ribbonId', () => {
        const actualRibbonId: string = (numberingGroup as any).ribbonId;
        const expectedRibbonId: string = container.element.id + RIBBON_ID;
        expect(actualRibbonId).toBe(expectedRibbonId);
    });

    // getNumberingListItem
    it('Getting numbering List Item', () => {
        expect(numberingGroup.getNumberingListItem).toBeDefined();
        expect(typeof numberingGroup.getNumberingListItem).toBe('function');
        const item: any = numberingGroup.getNumberingListItem();
        expect(item.keyTip).toBe('N');
        expect(item.ribbonTooltipSettings).toBeDefined();
        expect(item.ribbonTooltipSettings.content).toBe('Numbering');
    });

    // createNumberingSplitButton
    it('Creating Numbering split button', () => {
        const item: any = numberingGroup.getNumberingListItem();
        expect(item.splitButtonSettings).toBeDefined();
        expect(item.splitButtonSettings.iconCss).toContain('e-de-ctnr-numbering');
    });

    it('iconCss adds e-de-flip when enableRtl is true', () => {
        (container as any).enableRtl = true;
        const item: any = numberingGroup.getNumberingListItem();
        expect(item.splitButtonSettings.iconCss).toContain('e-de-flip');
        (container as any).enableRtl = false;
    });

    it('iconCss does not add e-de-flip when enableRtl is false', () => {
        (container as any).enableRtl = false;
        const item: any = numberingGroup.getNumberingListItem();
        expect(item.splitButtonSettings.iconCss).not.toContain('e-de-flip');
    });

    it('should create numbering split button correctly', () => {
        const result = (numberingGroup as any).createNumberingSplitButton();
        expect(result).toBeDefined();
        expect(result.target).toBeDefined();
        const div = result.target as HTMLElement;
        expect(div.id).toContain('_number_list_div');
        const ul = div.querySelector('ul');
        expect(ul).not.toBeNull();

        expect((numberingGroup as any).noneNumberTag).toBeDefined();
        expect((numberingGroup as any).numberList).toBeDefined();
        expect((numberingGroup as any).lowLetter).toBeDefined();
        expect((numberingGroup as any).upLetter).toBeDefined();
        expect((numberingGroup as any).lowRoman).toBeDefined();
        expect((numberingGroup as any).upRoman).toBeDefined();
        expect((numberingGroup as any).numberElements.none).toBe((numberingGroup as any).noneNumberTag);
        expect((numberingGroup as any).numberElements.number).toBe((numberingGroup as any).numberList);
        expect((numberingGroup as any).numberElements.lowletter).toBe((numberingGroup as any).lowLetter);
        expect(result.content).toBe('Numbering');
    });

    // getNumberingItems
    it('Getting numbering Item', () => {
        const items: any[] = numberingGroup.getNumberingItems();
        expect(items.length).toBeGreaterThan(0);
        const ids = items.map((it: any) => it.id);
        expect(ids).toContain(groupPrefix + '_number-none');
        expect(ids).toContain(groupPrefix + '_number-arabic');
        expect(ids).toContain(groupPrefix + '_number-lowletter');
        expect(ids).toContain(groupPrefix + '_number-upletter');
        expect(ids).toContain(groupPrefix + '_number-lowroman');
        expect(ids).toContain(groupPrefix + '_number-uproman');
    });

    // updateSelectedNumberedListType
    it('Update Selected numbered list', () => {
        expect(numberingGroup.updateSelectedNumberedListType).toBeDefined();
        expect(typeof numberingGroup.updateSelectedNumberedListType).toBe('function');
    });

    // handleNumberingSelection
    it('Handling numbering selection', () => {
        expect(numberingGroup.handleNumberingSelection).toBeDefined();
        expect(typeof numberingGroup.handleNumberingSelection).toBe('function');
    });

    // number click handlers exist
    it('all bullet click handlers are defined', () => {
        expect(numberingGroup.bulletNoneClick).toBeDefined();
        expect(typeof numberingGroup.bulletNoneClick).toBe('function');
        expect(numberingGroup.numberedLowLetterClick).toBeDefined();
        expect(typeof numberingGroup.numberedLowLetterClick).toBe('function');
        expect(numberingGroup.numberedUpLetterClick).toBeDefined();
        expect(typeof numberingGroup.numberedUpLetterClick).toBe('function');
    });

    // applyNumbering
    it('Applying numbering', () => {
        expect(container.documentEditor.isReadOnly).toBeDefined();
        expect(container.documentEditor.editorModule).toBeDefined();
    });

    // refreshHomeSelection
    it('refreshHomeSelection is defined and ribbonModule is initialized', () => {
        expect(numberingGroup.refreshHomeSelection).toBeDefined();
        expect(typeof numberingGroup.refreshHomeSelection).toBe('function');  
    });

    // destroy
    it('destroy can be called without error', () => {
        expect(() => numberingGroup.destroy()).not.toThrow();
    });

    it('destroy clears Number Testing', () => {
        expect((numberingGroup as any).noneNumberTag).toBeDefined();
        expect((numberingGroup as any).numberList).toBeDefined();
        expect((numberingGroup as any).lowLetter).toBeDefined();
        expect((numberingGroup as any).upLetter).toBeDefined();
        expect((numberingGroup as any).lowRoman).toBeDefined();
        expect((numberingGroup as any).upRoman).toBeDefined();
        numberingGroup.destroy();
        expect((numberingGroup as any).noneNumberTag).toBeNull();
        expect((numberingGroup as any).numberList).toBeNull();
        expect((numberingGroup as any).lowLetter).toBeNull();
        expect((numberingGroup as any).upLetter).toBeNull();
        expect((numberingGroup as any).lowRoman).toBeNull();
        expect((numberingGroup as any).upRoman).toBeNull();
    });
});

describe('NumberingGroup Coverage Tests', () => {
    let container: DocumentEditorContainer;
    let containerElement: HTMLElement;
    let numberingGroup: any;

    beforeAll(() => {
        containerElement = document.createElement('div');
        containerElement.id = 'numbering_ribbon';
        document.body.appendChild(containerElement);

        DocumentEditorContainer.Inject(Ribbon);

        container = new DocumentEditorContainer({
            height: '590px',
            toolbarMode: 'Ribbon',
            ribbonLayout: 'Classic'
        });

        container.serviceUrl =
            'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/';

        container.appendTo('#numbering_ribbon');

        numberingGroup = new NumberingGroup(container);
    });

    afterAll(() => {
        if (numberingGroup) {
            numberingGroup.destroy();
            numberingGroup = undefined;
        }

        if (container) {
            container.destroy();
            container = undefined;
        }

        if (containerElement) {
            document.body.removeChild(containerElement);
            containerElement = undefined;
        }
    });

    it('getNumberingItems should return expected numbering item configuration', () => {
        const numberingItems: any[] =
            (numberingGroup as any).getNumberingItems();

        expect(numberingItems).toBeDefined();
        expect(numberingItems.length).toBe(6);

        expect(numberingItems[0].id)
            .toBe((numberingGroup as any).ribbonId + '_number-none');

        expect(numberingItems[1].id)
            .toBe((numberingGroup as any).ribbonId + '_number-arabic');

        expect(numberingItems[2].id)
            .toBe((numberingGroup as any).ribbonId + '_number-lowletter');

        expect(numberingItems[3].id)
            .toBe((numberingGroup as any).ribbonId + '_number-upletter');

        expect(numberingItems[4].id)
            .toBe((numberingGroup as any).ribbonId + '_number-lowroman');

        expect(numberingItems[5].id)
            .toBe((numberingGroup as any).ribbonId + '_number-uproman');

        expect(numberingItems[0].text)
            .toBe((numberingGroup as any).localObj.getConstant('None'));

        expect(numberingItems[1].text)
            .toBe((numberingGroup as any).localObj.getConstant('Arabic'));

        expect(numberingItems[2].text)
            .toBe((numberingGroup as any).localObj.getConstant('Lower Letter'));

        expect(numberingItems[3].text)
            .toBe((numberingGroup as any).localObj.getConstant('Upper Letter'));

        expect(numberingItems[4].text)
            .toBe((numberingGroup as any).localObj.getConstant('Lower Roman'));

        expect(numberingItems[5].text)
            .toBe((numberingGroup as any).localObj.getConstant('Upper Roman'));
    });

    it('createNumberingSplitButton should create expected dropdown structure', () => {
        const splitButtonSettings: any =
            (numberingGroup as any).createNumberingSplitButton();

        expect(splitButtonSettings).toBeDefined();
        expect(splitButtonSettings.target).toBeDefined();

        const dropDownElement: HTMLElement =
            splitButtonSettings.target as HTMLElement;

        expect(dropDownElement.id)
            .toBe((numberingGroup as any).ribbonId + '_number_list_div');

        const listElement: HTMLElement =
            dropDownElement.querySelector('ul') as HTMLElement;

        expect(listElement).toBeDefined();

        expect(listElement.tagName)
            .toBe('UL');

        expect(listElement.id)
            .toBe((numberingGroup as any).ribbonId + '_numberListMenu');

        expect(listElement.className)
            .toContain('e-de-floating-menu');

        expect(listElement.className)
            .toContain('e-de-bullets-menu');

        expect(listElement.className)
            .toContain('e-de-list-container');

        expect(listElement.className)
            .toContain('e-de-list-thumbnail');

        expect(listElement.children.length)
            .toBe(6);

        expect((numberingGroup as any).noneNumberTag)
            .toBeTruthy();

        expect((numberingGroup as any).numberList)
            .toBeTruthy();

        expect((numberingGroup as any).lowLetter)
            .toBeTruthy();

        expect((numberingGroup as any).upLetter)
            .toBeTruthy();

        expect((numberingGroup as any).lowRoman)
            .toBeTruthy();

        expect((numberingGroup as any).upRoman)
            .toBeTruthy();
    });

    it('should initialize numbered list text values correctly', () => {
        (numberingGroup as any).createNumberingSplitButton();

        const numberedListText: string =
            ((numberingGroup as any).numberList.textContent || '');

        expect(numberedListText)
            .toContain('1.');

        expect(numberedListText)
            .toContain('2.');

        expect(numberedListText)
            .toContain('3.');
    });

    it('should initialize upper letter list text values correctly', () => {
        (numberingGroup as any).createNumberingSplitButton();

        const upperLetterText: string =
            ((numberingGroup as any).upLetter.textContent || '');

        expect(upperLetterText)
            .toContain('A.');

        expect(upperLetterText)
            .toContain('B.');

        expect(upperLetterText)
            .toContain('C.');
    });

    it('should initialize lower roman list text values correctly', () => {
        (numberingGroup as any).createNumberingSplitButton();

        const lowerRomanText: string =
            ((numberingGroup as any).lowRoman.textContent || '');

        expect(lowerRomanText)
            .toContain('i.');

        expect(lowerRomanText)
            .toContain('ii.');

        expect(lowerRomanText)
            .toContain('iii.');
    });

    it('should initialize upper roman list text values correctly', () => {
        (numberingGroup as any).createNumberingSplitButton();

        const upperRomanText: string =
            ((numberingGroup as any).upRoman.textContent || '');

        expect(upperRomanText)
            .toContain('I.');

        expect(upperRomanText)
            .toContain('II.');

        expect(upperRomanText)
            .toContain('III.');
    });

    it('beforeOpen should make dropdown visible', () => {
        const splitButtonSettings: any =
            (numberingGroup as any).createNumberingSplitButton();

        const dropDownElement: HTMLElement =
            splitButtonSettings.target as HTMLElement;

        splitButtonSettings.beforeOpen();

        expect(dropDownElement.style.visibility)
            .toBe('visible');
    });

    it('beforeClose should hide dropdown', () => {
        const splitButtonSettings: any =
            (numberingGroup as any).createNumberingSplitButton();

        const dropDownElement: HTMLElement =
            splitButtonSettings.target as HTMLElement;

        splitButtonSettings.beforeOpen();

        expect(dropDownElement.style.visibility)
            .toBe('visible');

        splitButtonSettings.beforeClose();

        expect(dropDownElement.style.visibility)
            .toBe('hidden');
    });

    it('should initialize number elements collection correctly', () => {
        (numberingGroup as any).createNumberingSplitButton();

        const numberElements: any =
            (numberingGroup as any).numberElements;

        expect(numberElements).toBeDefined();

        expect(numberElements.none)
            .toBe((numberingGroup as any).noneNumberTag);

        expect(numberElements.number)
            .toBe((numberingGroup as any).numberList);

        expect(numberElements.lowletter)
            .toBe((numberingGroup as any).lowLetter);

        expect(numberElements.upletter)
            .toBe((numberingGroup as any).upLetter);

        expect(numberElements.lowroman)
            .toBe((numberingGroup as any).lowRoman);

        expect(numberElements.uproman)
            .toBe((numberingGroup as any).upRoman);
    });

    it('destroy should clear initialized references', () => {
        (numberingGroup as any).createNumberingSplitButton();

        expect((numberingGroup as any).noneNumberTag)
            .toBeTruthy();

        expect((numberingGroup as any).numberList)
            .toBeTruthy();

        expect((numberingGroup as any).lowLetter)
            .toBeTruthy();

        expect((numberingGroup as any).upLetter)
            .toBeTruthy();

        expect((numberingGroup as any).lowRoman)
            .toBeTruthy();

        expect((numberingGroup as any).upRoman)
            .toBeTruthy();

        numberingGroup.destroy();

        expect((numberingGroup as any).noneNumberTag)
            .toBeNull();

        expect((numberingGroup as any).numberList)
            .toBeNull();

        expect((numberingGroup as any).lowLetter)
            .toBeNull();

        expect((numberingGroup as any).upLetter)
            .toBeNull();

        expect((numberingGroup as any).lowRoman)
            .toBeNull();

        expect((numberingGroup as any).upRoman)
            .toBeNull();

        // numberingGroup = new NumberingGroup(container);
    });

    it('destroy should handle null references safely', () => {
        const freshNumberingGroup: any =
            new NumberingGroup(container);
        // const ribbon: any = (container as any).ribbonModule;
        // const freshNumberingGroup: any =
        //     ribbon.tabManager.homeTab.homeParagraphGroup.numberingGroup;

        // Force every child ref to null to simulate a prior destroy()
        // or an instance that was never initialized.
        // freshNumberingGroup.noneNumberTag = null;
        // freshNumberingGroup.numberList = null;
        // freshNumberingGroup.lowLetter = null;
        // freshNumberingGroup.upLetter = null;
        // freshNumberingGroup.lowRoman = null;
        // freshNumberingGroup.upRoman = null;

        // The real assertion: destroy() must not throw on null refs.
        expect(() => freshNumberingGroup.destroy())
            .not.toThrow();

        // Verify the cleanup contract still holds post-destroy.
        expect(freshNumberingGroup.noneNumberTag)
            .toBeNull();

        expect(freshNumberingGroup.numberList)
            .toBeNull();

        expect(freshNumberingGroup.lowLetter)
            .toBeNull();

        expect(freshNumberingGroup.upLetter)
            .toBeNull();

        expect(freshNumberingGroup.lowRoman)
            .toBeNull();

        expect(freshNumberingGroup.upRoman)
            .toBeNull();
    });
});
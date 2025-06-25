import { createElement } from '@syncfusion/ej2-base';
import { DocumentEditorContainer } from '../../../src/document-editor-container/document-editor-container';
import { Ribbon } from '../../../src/document-editor-container/ribbon/ribbon';

// layout-tab.spec.js
describe('Layout Tab Tests', () => {
    let container: DocumentEditorContainer;
    let containerElement: HTMLElement;

    // Helper function to hide cursor animation
    function hideCursorAnimation() {
        const element: HTMLElement = document.querySelector('[class="e-de-blink-cursor e-de-cursor-animation"]');
        if (element) {
            element.style.display = 'none';
        }
    }

    beforeAll(() => {
        // Create container div for the document editor
        containerElement = document.createElement('div');
        containerElement.id = 'ribbon';
        document.body.appendChild(containerElement);

        // Initialize the DocumentEditorContainer
        DocumentEditorContainer.Inject(Ribbon);
        container = new DocumentEditorContainer({
            height: "590px",
            toolbarMode: 'Ribbon',
            ribbonLayout: 'Classic'
        });
        container.serviceUrl = 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/';
        container.appendTo('#ribbon');

        // Wait for the control to be fully initialized and rendered
        jasmine.clock().install();
        jasmine.clock().tick(500);
        hideCursorAnimation();

        // Click on Layout tab
        const layoutTab: HTMLElement = document.querySelector('div.e-toolbar-item.e-template[data-id="ribbon_ribbon_layout_tab"] div.e-tab-wrap[role="tab"]');
        if (layoutTab) {
            layoutTab.click();
            jasmine.clock().tick(100);
        } else {
            fail('Layout tab not found');
        }
    });

    afterAll(() => {
        // Clean up
        if (container) {
            container.destroy();
            container = null;
        }
        if (containerElement) {
            document.body.removeChild(containerElement);
        }
        jasmine.clock().uninstall();
    });



    // it('should open margins dropdown when clicked', () => {
    //     // Click Margins button
    //     const marginsBtn: HTMLElement = document.querySelector('[aria-label="Margins"]');
    //     marginsBtn.click();
    //     jasmine.clock().tick(100);
        
    //     // Verify dropdown menu appears
    //     const marginsDropdown = document.querySelector('ul[role="menu"]');
    //     expect(marginsDropdown).not.toBeNull();
      
        
    //     // Verify common margin options are visible
    //     const normalOption = document.querySelector('li[aria-label="Normal"]');
    //     expect(normalOption).not.toBeNull();
        
    //     const narrowOption = document.querySelector('li[aria-label="Narrow"]');
    //     expect(narrowOption).not.toBeNull();
        
    //     const customMarginsOption = document.querySelector('li[aria-label="Custom Margins..."]');
    //     expect(customMarginsOption).not.toBeNull();
        
    //     // Click outside to close dropdown
    //     document.body.click();
    //     jasmine.clock().tick(100);
    // });

    // it('should open orientation dropdown when clicked', () => {
    //     // Click Orientation button
    //     const orientationBtn: HTMLElement = document.querySelector('[aria-label="Orientation"]');
    //     orientationBtn.click();
    //     jasmine.clock().tick(100);
        
    //     // Verify dropdown menu appears
    //     const orientationDropdown = document.querySelector('ul[role="menu"]');
    //     expect(orientationDropdown).not.toBeNull();
       
        
    //     // Verify orientation options are visible
    //     const portraitOption = document.querySelector('li[aria-label="Portrait"]');
    //     expect(portraitOption).not.toBeNull();
        
    //     const landscapeOption = document.querySelector('li[aria-label="Landscape"]');
    //     expect(landscapeOption).not.toBeNull();
        
    //     // Click outside to close dropdown
    //     document.body.click();
    //     jasmine.clock().tick(100);
    // });

    // it('should open page size dropdown when clicked', () => {
    //     // Click Size button
    //     const sizeBtn: HTMLElement = document.querySelector('[aria-label="Size"]');
    //     sizeBtn.click();
    //     jasmine.clock().tick(100);
        
    //     // Verify dropdown menu appears
    //     const sizeDropdown = document.querySelector('ul[role="menu"]');
    //     expect(sizeDropdown).not.toBeNull();

        
    //     // Verify common page size options are visible
    //     const letterOption = document.querySelector('li[aria-label="Letter"]');
    //     expect(letterOption).not.toBeNull();
        
    //     const a4Option = document.querySelector('li[aria-label="A4"]');
    //     expect(a4Option).not.toBeNull();
        
    //     // Click outside to close dropdown
    //     document.body.click();
    //     jasmine.clock().tick(100);
    // });



    // it('should open breaks dropdown when clicked', () => {
    //     // Click Breaks button
    //     const breaksBtn: HTMLElement = document.querySelector('[aria-label="Breaks"]');
    //     breaksBtn.click();
    //     jasmine.clock().tick(100);
        
    //     // Verify dropdown menu appears
    //     const breaksDropdown = document.querySelector('ul[role="menu"]');
    //     expect(breaksDropdown).not.toBeNull();

        
    //     // Verify break options are visible
    //     const pageBreakOption = document.querySelector('li[aria-label="Page Break"]');
    //     expect(pageBreakOption).not.toBeNull();
        
    //     const columnBreakOption = document.querySelector('li[aria-label="Column Break"]');
    //     expect(columnBreakOption).not.toBeNull();
        
    //     const nextPageOption = document.querySelector('li[aria-label="Next Page"]');
    //     expect(nextPageOption).not.toBeNull();
        
    //     const continuousOption = document.querySelector('li[aria-label="Continuous"]');
    //     expect(continuousOption).not.toBeNull();
        
    //     // Click outside to close dropdown
    //     document.body.click();
    //     jasmine.clock().tick(100);
    // });

    it('should update indent left value when changed', () => {
        // Get the indent left input
        const indentLeftInput: HTMLInputElement = document.querySelectorAll('input.e-numerictextbox')[0] as HTMLInputElement;
        expect(indentLeftInput).not.toBeNull();
        
        // Get the initial value
        const initialValue = parseFloat(indentLeftInput.value);
        
        // Set a new value
        indentLeftInput.value = '72.0';
        // Trigger change event
        const event = document.createEvent('Event');
        event.initEvent('change', true, true);
        indentLeftInput.dispatchEvent(event);
        jasmine.clock().tick(100);
        
        // Verify the document properties have been updated
        const leftIndent = container.documentEditor.selection.paragraphFormat.leftIndent;
        expect(leftIndent).toBe(72.0); // 1 inch = 72.0 points
    });

    it('should update indent right value when changed', () => {
        // Get the indent right input
        const indentRightInput: HTMLInputElement = document.querySelectorAll('input.e-numerictextbox')[1] as HTMLInputElement;
        expect(indentRightInput).not.toBeNull();
        
        // Get the initial value
        const initialValue = parseFloat(indentRightInput.value);
        
        // Set a new value
        indentRightInput.value = '72.0';
        // Trigger change event
        const event = document.createEvent('Event');
        event.initEvent('change', true, true);
        indentRightInput.dispatchEvent(event);
        jasmine.clock().tick(100);
        
        // Verify the document properties have been updated
        const rightIndent = container.documentEditor.selection.paragraphFormat.rightIndent;
        expect(rightIndent).toBe(72.0); // 1 inch = 72.0 points
    });

    it('should update spacing before value when changed', () => {
        // Get the spacing before input
        const spacingBeforeInput: HTMLInputElement = document.querySelectorAll('input.e-numerictextbox')[2] as HTMLInputElement;
        expect(spacingBeforeInput).not.toBeNull();
        
        // Get the initial value
        const initialValue = parseFloat(spacingBeforeInput.value);
        
        // Set a new value
        spacingBeforeInput.value = '6.0';
        // Trigger change event
        const event = document.createEvent('Event');
        event.initEvent('change', true, true);
        spacingBeforeInput.dispatchEvent(event);
        jasmine.clock().tick(100);
        
        // Verify the document properties have been updated
        const beforeSpacing = container.documentEditor.selection.paragraphFormat.beforeSpacing;
        expect(beforeSpacing).toBe(6);
    });

    it('should update spacing after value when changed', () => {
        // Get the spacing after input
        const spacingAfterInput: HTMLInputElement = document.querySelectorAll('input.e-numerictextbox')[3] as HTMLInputElement;
        expect(spacingAfterInput).not.toBeNull();
        
        // Get the initial value
        const initialValue = parseFloat(spacingAfterInput.value);
        
        // Set a new value
        spacingAfterInput.value = '6.0';
        // Trigger change event
        const event = document.createEvent('Event');
        event.initEvent('change', true, true);
        spacingAfterInput.dispatchEvent(event);
        jasmine.clock().tick(100);
        
        // Verify the document properties have been updated
        const afterSpacing = container.documentEditor.selection.paragraphFormat.afterSpacing;
        expect(afterSpacing).toBe(6);
    });

    it('should change page orientation to landscape', () => {
        // Get the initial page width
        const initialWidth = container.documentEditor.selection.sectionFormat.pageWidth;
        
        // Click Orientation button
        const orientationBtn: HTMLElement = document.querySelector('[aria-label="Orientation"]');
        orientationBtn.click();
        jasmine.clock().tick(100);
        
        // Click Landscape option
        const landscapeOption: HTMLElement = document.querySelector('li[aria-label="Landscape"]');
        landscapeOption.click();
        jasmine.clock().tick(100);
        
        // Verify the document properties have been updated
        const currentWidth = container.documentEditor.selection.sectionFormat.pageWidth;
        expect(currentWidth).toBeGreaterThan(initialWidth);
    });

    it('should change page size to A4', () => {
        // Click Size button
        const sizeBtn: HTMLElement = document.querySelector('[aria-label="Size"]');
        sizeBtn.click();
        jasmine.clock().tick(100);
        
        // Click A4 option
        const a4Option: HTMLElement = document.querySelector('li[aria-label="A4"]');
        a4Option.click();
        jasmine.clock().tick(100);
        
        // Verify the document properties have been updated
        const width = container.documentEditor.selection.sectionFormat.pageWidth;
        const height = container.documentEditor.selection.sectionFormat.pageHeight;
        
        // A4 dimensions in points (approximately)
        expect(Math.round(height)).toBeCloseTo(595, -1); // ~8.27 inches
        expect(Math.round(width)).toBeCloseTo(842, -1); // ~11.69 inches
    });

    it('should change to two columns layout', () => {
        // Click Columns button
        const columnsBtn: HTMLElement = document.querySelector('[aria-label="Columns"]');
        columnsBtn.click();
        jasmine.clock().tick(100);
        
        // Click Two option
        const twoOption: HTMLElement = document.querySelector('li[aria-label="Two"]');
        twoOption.click();
        jasmine.clock().tick(100);
        
        // Verify the document properties have been updated
        const columns = container.documentEditor.selection.sectionFormat.numberOfColumns;
        expect(columns).toBe(2);
    });

    it('should insert page break when page break option is clicked', () => {
        // Get the initial page number
        const initialPage = container.documentEditor.selection.startPage;
        
        // Click Breaks button
        const breaksBtn: HTMLElement = document.querySelector('[aria-label="Breaks"]');
        breaksBtn.click();
        jasmine.clock().tick(100);
        
        // Click Page Break option
        const pageBreakOption: HTMLElement = document.querySelector('li[aria-label="Page Break"]');
        pageBreakOption.click();
        jasmine.clock().tick(100);
        
        // Verify a page break is inserted
        const currentPage = container.documentEditor.selection.startPage;
        expect(currentPage).toBeGreaterThan(initialPage);
    });

    it('should change document margins to normal preset', () => {
        // Click Margins button
        const marginsBtn: HTMLElement = document.querySelector('[aria-label="Margins"]');
        marginsBtn.click();
        jasmine.clock().tick(100);
        
        // Click Normal option
        const normalOption: HTMLElement = document.querySelector('li[aria-label="Normal"]');
        normalOption.click();
        jasmine.clock().tick(100);
        
        // Verify the document properties have been updated
        const topMargin = container.documentEditor.selection.sectionFormat.topMargin;
        const bottomMargin = container.documentEditor.selection.sectionFormat.bottomMargin;
        const leftMargin = container.documentEditor.selection.sectionFormat.leftMargin;
        const rightMargin = container.documentEditor.selection.sectionFormat.rightMargin;
        
        // Normal margins are typically 1 inch (72 points) on all sides
        expect(Math.round(topMargin)).toBeCloseTo(72, -1);
        expect(Math.round(bottomMargin)).toBeCloseTo(72, -1);
        expect(Math.round(leftMargin)).toBeCloseTo(72, -1);
        expect(Math.round(rightMargin)).toBeCloseTo(72, -1);
    });

    it('should change document margins to narrow preset', () => {
        // Click Margins button
        const marginsBtn: HTMLElement = document.querySelector('[aria-label="Margins"]');
        marginsBtn.click();
        jasmine.clock().tick(100);
        
        // Click Narrow option
        const narrowOption: HTMLElement = document.querySelector('li[aria-label="Narrow"]');
        narrowOption.click();
        jasmine.clock().tick(100);
        
        // Verify the document properties have been updated
        const topMargin = container.documentEditor.selection.sectionFormat.topMargin;
        const bottomMargin = container.documentEditor.selection.sectionFormat.bottomMargin;
        const leftMargin = container.documentEditor.selection.sectionFormat.leftMargin;
        const rightMargin = container.documentEditor.selection.sectionFormat.rightMargin;
        
        // Narrow margins are typically 0.5 inch (36 points) on all sides
        expect(Math.round(topMargin)).toBeCloseTo(36, -1);
        expect(Math.round(bottomMargin)).toBeCloseTo(36, -1);
        expect(Math.round(leftMargin)).toBeCloseTo(36, -1);
        expect(Math.round(rightMargin)).toBeCloseTo(36, -1);
    });

    // it('should show page setup dialog when launcher icon is clicked', () => {
    //     // Click on Page Setup launcher icon
    //     const launcherIcon: HTMLElement = document.querySelector('#_page_setup_group_launcher');
    //     launcherIcon.click();
    //     jasmine.clock().tick(100);
        
    //     const showDialogSpy = spyOn(container.documentEditor, 'showDialog').and.callThrough();
    //     // Verify hyperlink dialog appears
    //     expect(showDialogSpy).toHaveBeenCalledWith('PageSetup');
    // });
});
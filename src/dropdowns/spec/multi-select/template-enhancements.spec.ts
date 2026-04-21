import { MultiSelect } from '../../src/multi-select/multi-select';
import { createElement } from '@syncfusion/ej2-base';

let basicData: { [key: string]: Object }[] = [
    { id: 'list1', text: 'JAVA', icon: 'icon-java' },
    { id: 'list2', text: 'C#', icon: 'icon-csharp' },
    { id: 'list3', text: 'C++', icon: 'icon-cpp' },
    { id: 'list4', text: '.NET', icon: 'icon-net' },
    { id: 'list5', text: 'Oracle', icon: 'icon-oracle' }
];

describe('MultiSelect - Group 21: Template Enhancements', () => {
    let listObj: MultiSelect;
    let element: HTMLInputElement;
    beforeEach((): void => {
        element = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        document.body.appendChild(element);
    });
    afterEach((): void => {
        if (listObj) {
            listObj.destroy();
        }
        if (element) {
            element.remove();
        }
        document.body.innerHTML = '';
    });
    /**
     * Test 1: Should support item template
     * Validates custom item rendering
     */
    it('should support item template', (done) => {
        listObj = new MultiSelect({
            dataSource: basicData,
            fields: { text: 'text', value: 'id' },
            itemTemplate: '<div class="item-content"><span class="icon ${icon}"></span><span class="text">${text}</span></div>'
        });
        listObj.appendTo(element);
        listObj.showPopup();
        let items = (listObj as any).popupWrapper.querySelectorAll('.e-list-item');
        expect(items.length).toBeGreaterThan(0);
        // Check template was rendered
        let templateContent = items[0].querySelector('.item-content');
        expect(templateContent).toBeTruthy();
        done();
    });
    /**
     * Test 2: Should support value template
     * Validates custom chip rendering
     */
    it('should support value template', (done) => {
        listObj = new MultiSelect({
            dataSource: basicData,
            fields: { text: 'text', value: 'id' },
            valueTemplate: '<span class="value-chip">${text}</span>'
        });
        listObj.appendTo(element);
        listObj.value = ['list1'];
        listObj.dataBind();
        let chips = element.parentElement.parentElement.querySelectorAll('.value-chip');
        expect(chips.length).toBeGreaterThan(0);
        done();
    });
    /**
     * Test 3: Should support group header template
     * Validates custom group rendering
     */
    it('should support group header template', (done) => {
        let groupedData = [
            { text: 'JAVA', group: 'Programming' },
            { text: 'C#', group: 'Programming' },
            { text: 'Oracle', group: 'Database' }
        ];
        listObj = new MultiSelect({
            dataSource: groupedData,
            fields: { text: 'text', groupBy: 'group' },
            groupTemplate: '<strong>${group}</strong>'
        });
        listObj.appendTo(element);
        listObj.showPopup();
        let groupHeaders = (listObj as any).popupWrapper.querySelectorAll('strong');
        expect(groupHeaders.length).toBeGreaterThan(0);
        done();
    });
    /**
     * Test 4: Should support header template
     * Validates popup header customization
     */
    it('should support header template', (done) => {
        listObj = new MultiSelect({
            dataSource: basicData,
            fields: { text: 'text', value: 'id' },
            headerTemplate: '<div class="custom-header">Select Languages</div>'
        });
        listObj.appendTo(element);
        listObj.showPopup();
        let header = (listObj as any).popupWrapper.querySelector('.custom-header');
        expect(header).toBeTruthy();
        expect(header.textContent).toContain('Select Languages');
        done();
    });
    /**
     * Test 5: Should support footer template
     * Validates popup footer customization
     */
    it('should support footer template', (done) => {
        listObj = new MultiSelect({
            dataSource: basicData,
            fields: { text: 'text', value: 'id' },
            footerTemplate: '<div class="custom-footer"> Total Items Count: 5 </div>'
        });
        listObj.appendTo(element);
        listObj.showPopup();
        let footer = (listObj as any).popupWrapper.querySelector('.custom-footer');
        expect(footer).toBeTruthy();
        done();
    });
    /**
     * Test 6: Should handle template updates dynamically
     * Validates template changes at runtime
     */
    it('should handle template updates dynamically', (done) => {
        listObj = new MultiSelect({
            dataSource: basicData,
            fields: { text: 'text', value: 'id' },
            itemTemplate: '<div class="template-v1">${text}</div>'
        });
        listObj.appendTo(element);
        listObj.showPopup();
        let templateV1Items = (listObj as any).popupWrapper.querySelectorAll('.template-v1');
        expect(templateV1Items.length).toBeGreaterThan(0);
        // Update template
        listObj.itemTemplate = '<div class="template-v2"><strong>${text}</strong></div>';
        listObj.dataBind();
        let templateV2Items = (listObj as any).popupWrapper.querySelectorAll('.template-v2');
        expect(templateV2Items.length).toBeGreaterThan(0);
        done();
    });
    /**
     * Test 7: Should support nested template content
     * Validates complex template HTML
     */
    it('should support nested template content', (done) => {
        listObj = new MultiSelect({
            dataSource: basicData,
            fields: { text: 'text', value: 'id' },
            itemTemplate: '<div class="item-wrapper"><div class="item-icon"></div><div class="item-info"><span class="item-text">${text}</span><span class="item-desc">Description for ${text}</span></div></div>'
        });
        listObj.appendTo(element);
        listObj.showPopup();
        let wrappers = (listObj as any).popupWrapper.querySelectorAll('.item-wrapper');
        expect(wrappers.length).toBeGreaterThan(0);
        let firstWrapper = wrappers[0];
        let nested = firstWrapper.querySelector('.item-info');
        expect(nested).toBeTruthy();
        done();
    });
});

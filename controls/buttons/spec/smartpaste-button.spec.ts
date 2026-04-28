/* eslint-disable @typescript-eslint/no-explicit-any */
import { SmartPasteButton } from '../src/smart-paste-button/smart-paste-button';
import { Browser, createElement } from '@syncfusion/ej2-base';

/**
 * @param  {} 'Button'
 * @param  {} function(
 */
describe('SmartPaste Button', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending(); // skips test (in Chai)
            return;
        }
    });
    beforeEach((): void => {
        let Chromebrowser: string = "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36";
        Browser.userAgent = Chromebrowser;
    });

    let button: SmartPasteButton;
    const element: any = createElement('button', { id: 'button' });
    document.body.appendChild(element);

    describe('EnableSmartPaste functionality testing', () => {
        let button: SmartPasteButton;
        beforeAll(() => {
            const form = document.createElement('form');
            form.id = 'my-form';
            // Create and append Name input
            const nameP = document.createElement('p');
            nameP.innerHTML = `Name: 
                <input id="name" type="text" name="name" data-smartpaste-description="Name must be in the format: Initial FirstName LastName. For ex. D John Mark" />`;
            form.appendChild(nameP);
            // Create and append Address input
            const addressP = document.createElement('p');
            addressP.innerHTML = `Address line 1:
                <textarea id="address" name="address"></textarea>`;
            form.appendChild(addressP);
            // Create and append City input
            const cityP = document.createElement('p');
            cityP.innerHTML = `City:
                <input id="city" type="text" name="city" />`;
            form.appendChild(cityP);
            // Create and append Contact Number input
            const contactP = document.createElement('p');
            contactP.innerHTML = `Contact Number:
                <input id="contact" name="contact" data-smartpaste-description="Number must be in the format +91 xxxx xxxx" />`;
            form.appendChild(contactP);
            // Create and append Gender select
            const genderDiv = document.createElement('div');
            genderDiv.innerHTML = `
        <label for="gender" class="form-label">Gender:</label>
        <select id="gender" name="gender" class="form-input" 
        data-smartpaste-description="identify the gender using name">
            <option value="male">Male</option>
            <option value="female" selected>Female</option>
            <option value="others">Others</option>
        </select>`;
            form.appendChild(genderDiv);
            // Create and append Marital Status radio buttons
            const maritalStatusDiv = document.createElement('div');
            maritalStatusDiv.className = 'marital-status';
            maritalStatusDiv.innerHTML = `
        <label for="marital-status" class="form-label">Marital Status:</label><br>
        <input type="radio" id="single" name="marital-status" value="single">
        <label for="single" class="form-label">Single</label> <br>
        <input type="radio" id="married" name="marital-status" value="married"> 
        <label for="married" class="form-label">Married</label> <br>`;
            form.appendChild(maritalStatusDiv);
            // Create and append Smart Paste button
            const buttonDiv = document.createElement('div');
            buttonDiv.innerHTML = `<button id="smart-paste" type="button">Smart Paste</button>`;
            form.appendChild(buttonDiv);
            // Append the form to the body or another container
            document.body.appendChild(form);
        });

        afterAll(() => {
            button.destroy();
            document.getElementById('my-form').remove();
        });

        it('EnableSmartPaste set to true', () => {
            button = new SmartPasteButton({ 
                aiAssistHandler: function () {
                    let response: string = `FIELD name^^^D Jonathan Abraham
FIELD email^^^john@gmail.com
FIELD contact^^^+91 98762 54321
FIELD city^^^Springfield
FIELD gender^^^Male
FIELD marital-status^^^Single
FIELD address^^^4567 Elm St, Apt 9B`;
return response;
                }
            });
            button.appendTo('#smart-paste');
            const clipboardData = `Hello there, John here.
Please deliver the packages at 4567 Elm St, Apt 9B, Springfield.
john@gmail.com
+91 98762 54321
Im single person living at Springfield
Regards,
D Jonathan Abraham`;
            let customClipboard = document.createElement('textarea');
            customClipboard.setAttribute('id', 'custom-clipboard');
            customClipboard.value = clipboardData;
            document.body.appendChild(customClipboard);
            button.click();
            window.addEventListener('input', function (e: any) {
                switch (e.target.id) {
                    case 'name':
                        expect(e.target.value).toEqual('D Jonathan Abraham');
                        break;
                    case 'address':
                        expect(e.target.value).toEqual('4567 Elm St, Apt 9B');
                        break;
                    case 'city':
                        expect(e.target.value).toEqual('Springfield');
                        break;
                    case 'contact':
                        expect(e.target.value).toEqual('+91 98762 54321');
                        break;
                    case 'single':
                        expect(e.target.checked).toEqual(true);
                        break;
                    case 'gender':
                        expect(e.target.value).toEqual('male');
                }
            });
        });

        it('EnableSmartPaste set to true and click without clipboard content', () => {
            document.getElementById('custom-clipboard').remove();
            button.element.click();
        });
    });

    describe('EnableSmartPaste functionality testing for return cases', () => {
        let button: SmartPasteButton;
        afterAll(() => {
            button.destroy();
        });
        it('EnableSmartPaste set to true and click without form', () => {
            const element: any = createElement('button', { id: 'smart-paste' });
            document.body.appendChild(element);
            button = new SmartPasteButton({ 
                content: 'Smart Paste',
                aiAssistHandler: function () {
                    let response: string = `FIELD name^^^D Jonathan Abraham
FIELD email^^^john@gmail.com
FIELD contact^^^+91 98762 54321
FIELD city^^^Springfield
FIELD gender^^^Male
FIELD marital-status^^^Single
FIELD address^^^4567 Elm St, Apt 9B`;
return response;
                }
            });
            button.appendTo('#smart-paste');
            button.element.click();
        });
    });
});
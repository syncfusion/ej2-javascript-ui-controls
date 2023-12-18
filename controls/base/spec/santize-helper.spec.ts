/**
 * Sanitize HTML helper renderer spec
 */
import { SanitizeHtmlHelper } from '../src/sanitize-helper';
import { detach } from '../src/dom';

describe('Sanitize Html Helper', () => {
    let SanitizeInstance: SanitizeHtmlHelper = new SanitizeHtmlHelper();
    let innerHTML: string = `<div>
    <div id="inline-event" onmouseover='javascript:alert(1)'></div>
    <div id="onpropertychange" onpropertychange='javascript:alert(1)'></div>
    <script>alert('hi')</script>
    <style> </style>
    <img src="javascript:alert('XSS Image');"/>
    <iframe src="http://evil.com/xss.html"></iframe>
    <input type="image" src="javascript:alert('XSS Image');"/>
    <link rel="stylesheet" href="javascript:alert('XSS CSS');"/>
    <div id="background" style="background-image: url(javascript:alert('XSS Background'))">BackGround Image</div>
    <div id="expression" style="width: expression(alert('XSS'));">Expression</div>
    <object type="text/x-scriptlet" data="http://hacker.com/xss.html">
    </object>
    </div>
    `;
    let noCode: string = "There is no XSS code to attack"

    describe('XSS Attack Code while component initial rendering : ', () => {
        var value: string = SanitizeHtmlHelper.sanitize(innerHTML);
        var htmlObject = document.createElement('div');
        htmlObject.innerHTML = value;
        
        it('check the script element', () => {
            expect(htmlObject.querySelectorAll('script').length).toBe(0);
        });
        it('check the style element', () => {
            expect(htmlObject.querySelectorAll('style').length).toBe(0);
        });
        it('check the iframe element while src set as wrong', () => {
            expect(htmlObject.querySelectorAll('iframe').length).toBe(0);
        });
        it('check the image element while src set as wrong', () => {
            expect(htmlObject.querySelectorAll('img').length).toBe(0);
        });
        it('check the link element while href set as wrong', () => {
            expect(htmlObject.querySelectorAll('link').length).toBe(0);
        });
        it('check the object element while attribute set as type="text/x-scriptlet"', () => {
            expect(htmlObject.querySelectorAll('object').length).toBe(0);
        });
        it('check the input element while set the type="image" and srce as wrong', () => {
            expect(htmlObject.querySelectorAll('input').length).toBe(0);
        });

        it('check the div element attribute while background image style set as wrong', () => {
            expect(htmlObject.querySelector('#background').hasAttribute('style')).toBe(false);
            expect(htmlObject.querySelector('#expression').hasAttribute('style')).toBe(false);
        });

        it('check the div element attribute while inline event bind', () => {
            expect(htmlObject.querySelector('#inline-event').hasAttribute('onmouseover')).toBe(false);
        });

        it('should remove onpropertychange attribute', () => {
            expect(htmlObject.querySelector('#onpropertychange').hasAttribute('onpropertychange')).toBe(false);
        });
        afterAll(() => {
            detach(htmlObject);
        });
    })

    describe('XSS Attack with no Code  : ', () => {
        var newValue: string = SanitizeHtmlHelper.sanitize(noCode);
        var htmlObject = document.createElement('div');
        htmlObject.innerHTML = newValue;
        
        it('check the script element', () => {
            expect(htmlObject.querySelectorAll('script').length).toBe(0);
        });
        it('check the style element', () => {
            expect(htmlObject.querySelectorAll('style').length).toBe(0);
        });
        it('check the iframe element while src set as wrong', () => {
            expect(htmlObject.querySelectorAll('iframe').length).toBe(0);
        });
        it('check the image element while src set as wrong', () => {
            expect(htmlObject.querySelectorAll('img').length).toBe(0);
        });
        it('check the link element while href set as wrong', () => {
            expect(htmlObject.querySelectorAll('link').length).toBe(0);
        });
        it('check the object element while attribute set as type="text/x-scriptlet"', () => {
            expect(htmlObject.querySelectorAll('object').length).toBe(0);
        });
        it('check the input element while set the type="image" and srce as wrong', () => {
            expect(htmlObject.querySelectorAll('input').length).toBe(0);
        });
        afterAll(() => {
            detach(htmlObject);
        });
    })
    
    describe('Handle file name when using more then one & sign  : ', () => {
        var value='Test & Test & Test.jpg'
        var newValue: string = SanitizeHtmlHelper.sanitize(value);
        it('check the input and output appears same', () => {
            expect(newValue).toBe(value);
        });  
    })
});

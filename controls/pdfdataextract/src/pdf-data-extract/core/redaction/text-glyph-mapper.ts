import { TextGlyph } from '../text-structure';

export class _TextGlyphMapper {
    _text: string;
    _glyph: TextGlyph[];
    _isHex: boolean = false;
    set text(value: string) {
        this._text = value;
    }
    get text(): string {
        return this._text;
    }
    set glyph(value: TextGlyph[]) {
        this._glyph = value;
    }
    get glyph(): TextGlyph[] {
        return this._glyph;
    }
    _applyEscapeSequence(text: string): string {
        let escapedText: string = text;
        if (text.indexOf('(') !== -1) {
            escapedText = escapedText.replace(/\(/g, '\\(');
        }
        if (text.indexOf(')') !== -1) {
            escapedText = escapedText.replace(/\)/g, '\\)');
        }
        if (text.indexOf("'") !== -1) { // eslint-disable-line
            escapedText = escapedText.replace(/'/g, "\\'"); // eslint-disable-line
        }
        if (text.indexOf('\\') !== -1) {
            escapedText = escapedText.replace(/\\/g, '\\\\');
        }
        if (text.indexOf('\b') !== -1) {
            escapedText = escapedText.replace(/\b/g, '\\b');
        }
        if (text.indexOf('\f') !== -1) {
            escapedText = escapedText.replace(/\f/g, '\\f');
        }
        if (text.indexOf('\n') !== -1) {
            escapedText = escapedText.replace(/\n/g, '\\n');
        }
        if (text.indexOf('\r') !== -1) {
            escapedText = escapedText.replace(/\r/g, '\\r');
        }
        return escapedText;
    }
    _getText(): string {
        if (typeof (this.glyph) === 'undefined') {
            return this.text;
        } else {
            let finalText: string = '';
            let currentText: string = '';
            const subString: boolean = this.text.length >= 2;
            const start: boolean = this.text.startsWith('(');
            const end: boolean = this.text.endsWith(')');
            if (subString && start && !end) {
                currentText = this.text.substring(1, this.text.length);
            } else if (subString && !start && end) {
                currentText = this.text.substring(0, this.text.length - 1);
            } else if (subString) {
                currentText = this.text.substring(1, this.text.length - 1);
            }
            let replaceText: string = '';
            let otherText: string = '';
            let glyphs: TextGlyph[] = [];
            const glyphDictionary: Map<string, TextGlyph[]> = new Map<string, TextGlyph[]>();
            const dictionary: Map<string, string> = new Map<string, string> ();
            let rTcount: number = 0;
            let roTcount: number = 0;
            let isHex: boolean = false;
            for (let i: number = 0; i < this.glyph.length; i++) {
                if (this.glyph[Number.parseInt(i.toString(), 10)]._isReplace) {
                    if (otherText !== '') {
                        dictionary.set('O-' + roTcount++, otherText);
                        otherText = '';
                        isHex = this.glyph[Number.parseInt(i.toString(), 10)]._isHex;
                    }
                    glyphs.push(this.glyph[Number.parseInt(i.toString(), 10)]);
                    replaceText += this.glyph[Number.parseInt(i.toString(), 10)].text;
                } else {
                    if (replaceText !== '') {
                        const key: string = 'R-' + rTcount++;
                        glyphDictionary.set(key, glyphs);
                        dictionary.set(key, replaceText);
                        glyphs = [];
                        replaceText = '';
                    }
                    isHex = this.glyph[Number.parseInt(i.toString(), 10)]._isHex;
                    const text: string = this.glyph[Number.parseInt(i.toString(), 10)].text;
                    if (!isHex) {
                        otherText += this._applyEscapeSequence(text);
                    } else {
                        otherText += text;
                    }
                }
            }
            if (replaceText !== '') {
                const key: string = 'R-' + rTcount++;
                glyphDictionary.set(key, glyphs);
                dictionary.set(key, replaceText);
                glyphs = [];
                replaceText = '';
            }
            if (otherText !== '') {
                const key: string = 'O-' + roTcount++;
                dictionary.set(key, otherText);
                otherText = '';
            }
            dictionary.forEach((value: string, key: string) => {
                if (key.indexOf('O-') !== -1) {
                    if (isHex)  {
                        finalText += '<' + value + '>';
                    } else {
                        finalText += '(' + value + ')';
                    }
                } else {
                    finalText += ' -' + this._getReplacedCharacter(glyphDictionary.get(key)) + ' ';
                    currentText = this._replacedText(currentText, glyphDictionary.get(key));
                }
            });
            return finalText;
        }
    }
    _replacedText(text: string, glyphs: TextGlyph[]): string {
        if (!text) {
            return text;
        }
        let currentText: string = text;
        let count: number = 0;
        for (const gly of glyphs) {
            const unicode: string = gly.text;
            if (unicode) {
                count += unicode.length;
            }
        }
        currentText = currentText.substring(count);
        return currentText;
    }
    _getReplacedCharacter(glyphs: TextGlyph[]): number {
        let totalWidth: number = 0;
        for (let i: number = 0; i < glyphs.length; i++) {
            const width: number = glyphs[Number.parseInt(i.toString(), 10)]._width;
            if (glyphs[Number.parseInt(i.toString(), 10)].text !== ' ' ) {
                totalWidth += width;
            } else {
                const actualFontSize: number = (0.001 * width * glyphs[Number.parseInt(i.toString(), 10)].fontSize);
                totalWidth += (width + ((width / actualFontSize) * glyphs[Number.parseInt(i.toString(), 10)]._charSpacing) +
                               ((width / actualFontSize) * glyphs[Number.parseInt(i.toString(), 10)]._wordSpacing));
            }
        }
        return totalWidth;
    }
}

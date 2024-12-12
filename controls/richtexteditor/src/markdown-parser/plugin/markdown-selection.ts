/**
 * MarkdownSelection internal module
 *
 * @hidden
 * @deprecated
 */
export class MarkdownSelection {
    public selectionStart: number;
    public selectionEnd: number;
    /**
     * markdown getLineNumber method
     *
     * @param {HTMLTextAreaElement} textarea - specifies the text area element
     * @param {number} point - specifies the number value
     * @returns {number} - returns the value
     * @hidden
     * @deprecated
     */
    public getLineNumber(textarea: HTMLTextAreaElement, point: number): number {
        return textarea.value.substr(0, point).split('\n').length;
    }

    /**
     * markdown getSelectedText method
     *
     * @param {HTMLTextAreaElement} textarea - specifies the text area element
     * @returns {string} - specifies the string value
     * @hidden
     * @deprecated
     */
    public getSelectedText(textarea: HTMLTextAreaElement): string {
        const start: number = textarea.selectionStart;
        const end: number = textarea.selectionEnd;
        return textarea.value.substring(start, end);
    }

    /**
     * markdown getAllParents method
     *
     * @param {string} value - specifies the string value
     * @returns {string[]} - returns the string value
     * @hidden
     * @deprecated
     */
    public getAllParents(value: string): string[] {
        return value.split('\n');
    }

    /**
     * markdown getSelectedLine method
     *
     * @param {HTMLTextAreaElement} textarea - specifies the text area element
     * @returns {string} - returns the string value
     * @hidden
     * @deprecated
     */
    public getSelectedLine(textarea: HTMLTextAreaElement): string {
        const lines: string[] = this.getAllParents(textarea.value);
        const index: number = this.getLineNumber(textarea, textarea.selectionStart);
        return lines[index - 1];
    }
    /**
     * markdown getLine method
     *
     * @param {HTMLTextAreaElement} textarea - specifies the text area element
     * @param {number} index - specifies the number value
     * @returns {string} - returns the string value
     * @hidden
     * @deprecated
     */
    public getLine(textarea: HTMLTextAreaElement, index: number): string {
        const lines: string[] = this.getAllParents(textarea.value);
        return lines[index as number];
    }

    /**
     * markdown getSelectedParentPoints method
     *
     * @param {HTMLTextAreaElement} textarea - specifies the text area element
     * @returns {string} - returns the string value
     * @hidden
     * @deprecated
     */
    public getSelectedParentPoints(textarea: HTMLTextAreaElement): { [key: string]: string | number }[] {
        const lines: string[] = this.getAllParents(textarea.value);
        const start: number = this.getLineNumber(textarea, textarea.selectionStart);
        const end: number = this.getLineNumber(textarea, textarea.selectionEnd);
        const parents: string[] = this.getSelectedText(textarea).split('\n');
        const selectedPoints: { [key: string]: string | number }[] = [];
        const selectedLine: string = lines[start - 1];
        const startLength: number = lines.slice(0, start - 1).join('').length;
        const firstPoint: { [key: string]: string | number } = {};
        firstPoint.line = start - 1;
        firstPoint.start = startLength + (firstPoint.line as number);
        firstPoint.end = selectedLine !== '' ? (firstPoint.start as number) +
            selectedLine.length + 1 : (firstPoint.start as number) + selectedLine.length;
        firstPoint.text = selectedLine;
        selectedPoints.push(firstPoint);
        if (parents.length > 1) {
            for (let i: number = 1; i < parents.length - 1; i++) {
                const points: { [key: string]: string | number } = {};
                points.line = (selectedPoints[i - 1].line as number) + 1;
                points.start = parents[i as number] !== '' ? selectedPoints[i - 1].end : selectedPoints[i - 1].end;
                points.end = (points.start as number) + parents[i as number].length + 1;
                points.text = parents[i as number];
                selectedPoints.push(points);
            }
            const lastPoint: { [key: string]: string | number } = {};
            lastPoint.line = (selectedPoints[selectedPoints.length - 1].line as number) + 1;
            lastPoint.start = selectedPoints[selectedPoints.length - 1].end;
            lastPoint.end = (lastPoint.start as number) + lines[end - 1].length + 1;
            lastPoint.text = lines[end - 1];
            selectedPoints.push(lastPoint);
        }
        return selectedPoints;
    }

    /**
     * markdown setSelection method
     *
     * @param {HTMLTextAreaElement} textarea - specifies the text area element
     * @param {number} start - specifies the start vaulue
     * @param {number} end - specifies the end value
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public setSelection(textarea: HTMLTextAreaElement, start: number, end: number): void {
        textarea.setSelectionRange(start, end);
        textarea.focus();
    }

    /**
     * markdown save method
     *
     * @param {number} start - specifies the start vaulue
     * @param {number} end - specifies the end value
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public save(start: number, end: number): void {
        this.selectionStart = start;
        this.selectionEnd = end;
    }

    /**
     * markdown restore method
     *
     * @param {HTMLTextAreaElement} textArea - specifies the text area element
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public restore(textArea: HTMLTextAreaElement): void {
        this.setSelection(textArea, this.selectionStart, this.selectionEnd);
    }

    /**
     * markdown isStartWith method
     *
     * @param {string} line - specifies the string value
     * @param {string} command - specifies the string value
     * @returns {boolean} - returns the boolean value
     * @hidden
     * @deprecated
     */
    public isStartWith(line: string, command: string): boolean {
        let isStart: boolean = false;
        const regExp: RegExpConstructor = RegExp;
        if (line) {
            const reg: RegExp = line.trim() === command.trim() ?
                new regExp('^(' + this.replaceSpecialChar(command.trim()) + ')', 'gim') :
                new regExp('^(' + this.replaceSpecialChar(command) + ')', 'gim');
            isStart = reg.test(line.trim());
        }
        return isStart;
    }
    /**
     * markdown replaceSpecialChar method
     *
     * @param {string} value - specifies the string value
     * @returns {string} - returns the value
     * @hidden
     * @deprecated
     */
    public replaceSpecialChar(value: string): string {
        // eslint-disable-next-line
        return value.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/g, '\\$&');
    }
    /**
     * markdown isClear method
     *
     * @param {string} parents - specifies the parent element
     * @param {string} regex - specifies the regex value
     * @returns {boolean} - returns the boolean value
     * @hidden
     * @deprecated
     */
    public isClear(parents: { [key: string]: string | number }[], regex: string): boolean {
        const isClear: boolean = false;
        const regExp: RegExpConstructor = RegExp;
        for (let i: number = 0; i < parents.length; i++) {
            if (new regExp(regex, 'gim').test((parents[i as number].text as string))) {
                return true;
            }
        }
        return isClear;
    }
    /**
     * markdown getSelectedInlinePoints method
     *
     * @param {HTMLTextAreaElement} textarea - specifies the text area
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public getSelectedInlinePoints(textarea: HTMLTextAreaElement): { [key: string]: string | number } {
        const start: number = textarea.selectionStart;
        const end: number = textarea.selectionEnd;
        const selection: string = this.getSelectedText(textarea);
        return { start: start, end: end, text: selection };
    }
}

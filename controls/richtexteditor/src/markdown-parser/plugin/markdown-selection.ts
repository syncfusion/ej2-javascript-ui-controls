/**
 * MarkdownSelection internal module
 * @hidden
 */
export class MarkdownSelection {
    public selectionStart: number;
    public selectionEnd: number;
    public getLineNumber(textarea: HTMLTextAreaElement, point: number): number {
        return textarea.value.substr(0, point).split('\n').length;
    }

    public getSelectedText(textarea: HTMLTextAreaElement): string {
        let start: number = textarea.selectionStart;
        let end: number = textarea.selectionEnd;
        return textarea.value.substring(start, end);
    }

    public getAllParents(value: string): string[] {
        return value.split('\n');
    }

    public getSelectedLine(textarea: HTMLTextAreaElement): string {
        let lines: string[] = this.getAllParents(textarea.value);
        let index: number = this.getLineNumber(textarea, textarea.selectionStart);
        return lines[index - 1];
    }
    public getLine(textarea: HTMLTextAreaElement, index: number): string {
        let lines: string[] = this.getAllParents(textarea.value);
        return lines[index];
    }

    public getSelectedParentPoints(textarea: HTMLTextAreaElement): { [key: string]: string | number }[] {
        let lines: string[] = this.getAllParents(textarea.value);
        let start: number = this.getLineNumber(textarea, textarea.selectionStart);
        let end: number = this.getLineNumber(textarea, textarea.selectionEnd);
        let parents: string[] = this.getSelectedText(textarea).split('\n');
        let selectedPoints: { [key: string]: string | number }[] = [];
        let selectedLine: string = lines[start - 1];
        let startLength: number = lines.slice(0, start - 1).join('').length;
        let firstPoint: { [key: string]: string | number } = {};
        firstPoint.line = start - 1;
        firstPoint.start = startLength + (firstPoint.line as number);
        firstPoint.end = selectedLine !== '' ? (firstPoint.start as number) +
            selectedLine.length + 1 : (firstPoint.start as number) + selectedLine.length;
        firstPoint.text = selectedLine;
        selectedPoints.push(firstPoint);
        if (parents.length > 1) {
            for (let i: number = 1; i < parents.length - 1; i++) {
                let points: { [key: string]: string | number } = {};
                points.line = (selectedPoints[i - 1].line as number) + 1;
                points.start = parents[i] !== '' ? selectedPoints[i - 1].end : selectedPoints[i - 1].end;
                points.end = (points.start as number) + parents[i].length + 1;
                points.text = parents[i];
                selectedPoints.push(points);
            }
            let lastPoint: { [key: string]: string | number } = {};
            lastPoint.line = (selectedPoints[selectedPoints.length - 1].line as number) + 1;
            lastPoint.start = selectedPoints[selectedPoints.length - 1].end;
            lastPoint.end = (lastPoint.start as number) + lines[end - 1].length + 1;
            lastPoint.text = lines[end - 1];
            selectedPoints.push(lastPoint);
        }
        return selectedPoints;
    }

    public setSelection(textarea: HTMLTextAreaElement, start: number, end: number): void {
        textarea.setSelectionRange(start, end);
        textarea.focus();
    }

    public save(start: number, end: number): void {
        this.selectionStart = start;
        this.selectionEnd = end;
    }

    public restore(textArea: HTMLTextAreaElement): void {
        this.setSelection(textArea, this.selectionStart, this.selectionEnd);
    }

    public isStartWith(line: string, command: string): boolean {
        let isStart: boolean = false;
        if (line) {
            let reg: RegExp = line.trim() === command.trim() ?
                new RegExp('^(' + this.replaceSpecialChar(command.trim()) + ')', 'gim') :
                new RegExp('^(' + this.replaceSpecialChar(command) + ')', 'gim');
            isStart = reg.test(line.trim());
        }
        return isStart;
    }
    public replaceSpecialChar(value: string): string {
        return value.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/g, '\\$&');
    }
    public isClear(parents: { [key: string]: string | number }[], regex: string): boolean {
        let isClear: boolean = false;
        for (let i: number = 0; i < parents.length; i++) {
            if (new RegExp(regex, 'gim').test((parents[i].text as string))) {
                return true;
            }
        }
        return isClear;
    }
    public getRegex(syntax: string): RegExp {
        syntax = this.replaceSpecialChar(syntax);
        let regex: string = '^(' + syntax + ')|^(' + syntax.trim() + ')';
        return new RegExp(regex);
    }
    public getSelectedInlinePoints(textarea: HTMLTextAreaElement): { [key: string]: string | number } {
        let start: number = textarea.selectionStart;
        let end: number = textarea.selectionEnd;
        let selection: string = this.getSelectedText(textarea);
        return { start: start, end: end, text: selection };
    }

}


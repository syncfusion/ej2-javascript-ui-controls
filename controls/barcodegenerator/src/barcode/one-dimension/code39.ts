import { OneDimension } from '../one-dimension';

/**
 * code39 used to calculate the barcode of type 39
 */
export class Code39 extends OneDimension {

    /**
     * get the code value to check
     */
    private getCodeValue(): string[] {
        let codes: string[] = ['111221211', '211211112', '112211112',
            '212211111', '111221112', '211221111', '112221111', '111211212',
            '211211211', '112211211', '211112112', '112112112', '212112111', '111122112', '211122111', '112122111',
            '111112212', '211112211', '112112211', '111122211', '211111122', '112111122', '212111121', '111121122',
            '211121121', '112121121', '111111222', '211111221', '112111221', '111121221', '221111112', '122111112',
            '222111111', '121121112', '221121111', '122121111', '121111212', '221111211', '122111211', '121121211',
            '121212111', '121211121', '121112121', '111212121'];
        return codes;
    }

    /**
     * get the characters to check
     */
    private getCharacter(): string {
        let characters: string = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. *$/+%';
        return characters;
    }

    /**
     * Check sum method for the code 39 bar code
     */
    private checkSum(char: string, characters: string): number {
        let checksum: number = 0;
        for (let i: number = 0; i < char.length; i++) {
            let codeNumber: number = characters.indexOf(char[i]);
            checksum += codeNumber;
        }
        checksum = checksum % 43;
        return checksum;
    }

    /**
     * Validate the given input to check whether the input is valid one or not
     */
    /** @private */
    public validateInput(char: string): string {
        if (char.search(/^[0-9A-Z\-\.\ \$\/\+\%]+$/) === -1) {
            return 'Supports A-Z, 0-9, and symbols ( - . $ / + % SPACE).';
        } else {
            return undefined;
        }
    }

    private getPatternCollection(givenChar: string, characters: string, ): string[] {
        let codeNumber: number;
        let code: string[] = [];
        let codes: string[] = this.getCodeValue();
        for (let i: number = 0; i < givenChar.length; i++) {
            codeNumber = characters.indexOf(givenChar.charAt(i));
            code.push(codes[codeNumber]);
        }
        return code;
    }

    private appendStartStopCharacters(char: string): string {
        return '*' + char + '*';
    }

    /** @private */
    public drawCode39Extension(canvas: HTMLElement, encodedCharacter: string): void {
        this.draw(canvas, encodedCharacter);
    }
    /** @private */
    public draw(canvas: HTMLElement, encodedCharacter?: string): void {
        let givenCharacter: string = encodedCharacter ? encodedCharacter : this.value;
        let characters: string = this.getCharacter();
        if (this.enableCheckSum) {
            let checkSum: number = this.checkSum(givenCharacter, characters);
            givenCharacter += checkSum;
        }
        givenCharacter = this.appendStartStopCharacters(givenCharacter);
        let code: string[] = this.getPatternCollection(givenCharacter, characters);
        this.calculateBarCodeAttributes(code, canvas);
    }
}
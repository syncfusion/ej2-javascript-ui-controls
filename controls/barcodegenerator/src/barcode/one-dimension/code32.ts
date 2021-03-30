import { OneDimension } from '../one-dimension';

/**
 * code39 used to calculate the barcode of type 39
 */
export class Code32 extends OneDimension {
    /**
     * Validate the given input.
     *
     * @returns {string} Validate the given input.
     * @param {string} char - Provide the canvas element .
     * @private
     */
    public validateInput(char: string): string {
        if (char.length === 8 && char.match(/^[0-9]+$/)) {
            return undefined;
        } else {
            return 'Accepts 9 numeric characters.';
        }
    }

    /**
     * Validate the given input.
     *
     * @returns {object} Validate the given input.
     * @private
     */
    // eslint-disable-next-line
    private getCodeValue(): object[] {
        // eslint-disable-next-line
        let symbolTable: object[] = [['0', 0, ['111331311']], ['1', 1, ['311311113']], ['2', 2, ['113311113']], ['3', 3, ['313311111']],
            ['4', 4, ['111331113']], ['5', 5, ['311331111']], ['6', 6, ['113331111']], ['7', 7, ['111311313']], ['8', 8, ['311311311']],
            ['9', 9, ['113311311']], ['A', 10, ['113113113']], ['B', 11, ['113113113']], ['C', 12, ['313113111']], ['D', 13, ['111133113']],
            ['E', 14, ['221211']], ['F', 15, ['113133111']], ['G', 0x10, ['111113313']], ['H', 0x11, ['311113311']], ['I', 0x12, ['112311']],
            ['J', 0x13, ['111133311']], ['K', 20, ['311111133']], ['L', 0x15, ['113111133']], ['M', 0x16, ['313111131']],
            ['N', 0x17, ['111131133']],
            ['O', 0x18, ['121122']], ['P', 0x19, ['113131131']], ['Q', 0x1a, ['111111333']], ['R', 0x1b, ['311111331']],
            ['S', 0x1c, ['113111331']],
            ['T', 0x1d, ['111131331']], ['U', 30, ['331111113']], ['V', 0x1f, ['133111113']], ['W', 0x20, ['333111111']],
            ['X', 0x21, ['131131113']], ['Y', 0x22, ['331131111']], ['Z', 0x23, ['133131111']], ['*', 0, ['131131311']]
        ];
        return symbolTable;
    }


    private getPatternCollection(givenChar: string): string[] {
        const code: string[] = [];
        // eslint-disable-next-line
        const codes: object[] = this.getCodeValue();
        for (let i: number = 0; i <= givenChar.length; i++) {
            for (let j: number = 0; j < codes.length; j++) {
                if (givenChar[i] === codes[j][0]) {
                    code.push(codes[j][2][0]);
                }
            }
        }
        return code;
    }

    /**
     * Draw the barcode SVG.\
     *
     * @returns {void} Draw the barcode SVG .
     *  @param {HTMLElement} canvas - Provide the canvas element .
     * @private
     */
    public draw(canvas: HTMLElement): void {
        const value: string = this.value;
        const givenChar: string = '*' + value + '*';
        const codes: string[] = this.getPatternCollection(givenChar);
        this.calculateBarCodeAttributes(codes, canvas);
    }
}

/**
 * TtfTableInfo.ts class for EJ2-PDF
 */
export class TtfTableInfo {
    /**
     * offset from beginning of true type font file.
     */
    public offset : number;
    /**
     * length of the table.
     */
    public length : number;
    /**
     * table checksum;
     */
    public checksum : number;
    //Properties
    /**
     * Gets a value indicating whether this table is empty.
     * @private
     */
    public get empty() : boolean {
        let empty : boolean = (this.offset === this.length && this.length === this.checksum && this.checksum === 0);
        return empty;
    }
}
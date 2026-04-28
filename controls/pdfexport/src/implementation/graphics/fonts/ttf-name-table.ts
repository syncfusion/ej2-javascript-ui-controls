/**
 * TtfNameTable.ts class for EJ2-PDF
 */
import { TtfNameRecord } from './ttf-name-record';
export class TtfNameTable {
    /**
     * Local variable to store Format Selector.
     */
    public formatSelector : number;
    /**
     * Local variable to store Records Count.
     */
    public recordsCount : number;
    /**
     * Local variable to store Offset.
     */
    public offset : number;
    /**
     * Local variable to store Name Records.
     */
    public nameRecords : TtfNameRecord[];
}
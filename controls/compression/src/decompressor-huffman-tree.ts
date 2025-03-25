/* eslint-disable */
import { Utils, CompressedStreamReader } from './index';

export class DecompressorHuffmanTree{
    /// <summary>
    /// Maximum count of bits.
    /// </summary>
    private static MAX_BITLEN: number = 15;

    /// <summary>
    /// Build huffman tree.
    /// </summary>
    private m_Tree: Int16Array;

    /// <summary>
    /// Huffman tree for encoding and decoding lengths.
    /// </summary>
    public static m_LengthTree: DecompressorHuffmanTree;

    /// <summary>
    /// huffman tree for encoding and decoding distances.
    /// </summary>
    public static m_DistanceTree: DecompressorHuffmanTree;

    
    public constructor(lengths: Uint8Array) {
      
        this.buildTree( lengths );
    }
    public static init(): void {
    let lengths: Uint8Array;
        let index: number   ;

        // Generate huffman tree for lengths.
        lengths = new Uint8Array(288);
        index = 0;

        while( index < 144 )
        {
          lengths[ index++ ] = 8;
        }

        while( index < 256 )
        {
          lengths[ index++ ] = 9;
        }

        while( index < 280 )
        {
          lengths[ index++ ] = 7;
        }

        while( index < 288 )
        {
          lengths[ index++ ] = 8;
        }

        DecompressorHuffmanTree.m_LengthTree = new DecompressorHuffmanTree( lengths );

        // Generate huffman tree for distances.
        lengths = new Uint8Array(32);
        index = 0;

        while( index < 32 )
        {
          lengths[ index++ ] = 5;
        }

        DecompressorHuffmanTree.m_DistanceTree = new DecompressorHuffmanTree( lengths );
        
    }
    

        /// <summary>
    /// Prepares data for generating huffman tree.
    /// </summary>
    /// <param name="blCount">Array of counts of each code length.</param>
    /// <param name="nextCode">Numerical values of the smallest code for each code length.</param>
    /// <param name="lengths">Array of code lengths.</param>
    /// <param name="treeSize">Calculated tree size.</param>
    /// <returns>Code.</returns>
    private prepareData(blCount: number[], nextCode: number[], lengths:Uint8Array) : any
    {
      let code: number = 0;
      let treeSize: number = 512;

      // Count number of codes for each code length.
      for( let i = 0; i < lengths.length; i++ )
      {
        let length = lengths[ i ];

        if( length > 0 )
        {
          blCount[ length ]++;
        }
      }

      for( let bits = 1; bits <= DecompressorHuffmanTree.MAX_BITLEN; bits++ )
      {
        nextCode[ bits ] = code;
        code += blCount[ bits ] << ( 16 - bits );

        if( bits >= 10 )
        {
          let start = nextCode[ bits ] & 0x1ff80;
          let end = code & 0x1ff80;
          treeSize += ( end - start ) >> ( 16 - bits );
        }
      }

      /*      if( code != 65536 )
        throw new ZipException( "Code lengths don't add up properly." );*/

      return { 'code': code, 'treeSize': treeSize };
    }
    /// <summary>
    /// Generates huffman tree.
    /// </summary>
    /// <param name="blCount">Array of counts of each code length.</param>
    /// <param name="nextCode">Numerical values of the smallest code for each code length.</param>
    /// <param name="code">Precalculated code.</param>
    /// <param name="lengths">Array of code lengths.</param>
    /// <param name="treeSize">Calculated size of the tree.</param>
    /// <returns>Generated tree.</returns>
    private treeFromData(blCount: number[], nextCode: number[], lengths:Uint8Array, code: number, treeSize: number): Int16Array
    {
      let tree: Int16Array = new Int16Array(treeSize);
      let pointer: number = 512;
      let increment: number = 1 << 7;

      for( let bits = DecompressorHuffmanTree.MAX_BITLEN; bits >= 10; bits-- )
      {
        let end = code & 0x1ff80;
        code -= blCount[ bits ] << ( 16 - bits );
        let start = code & 0x1ff80;

        for( let i = start; i < end; i += increment )
        {
          tree[ Utils.bitReverse( i ) ] = Utils.bitConverterInt32ToInt16( ( -pointer << 4 ) | bits );
          pointer += 1 << ( bits - 9 );
        }
      }

      for( let i = 0; i < lengths.length; i++ )
      {
        let bits = lengths[ i ];

        if( bits == 0 )
        {
          continue;
        }

        code = nextCode[ bits ];
        let revcode = Utils.bitReverse( code );

        if( bits <= 9 )
        {
          do
          {
            tree[ revcode ] = Utils.bitConverterInt32ToInt16( ( i << 4 ) | bits );
            revcode += 1 << bits;
          }
          while( revcode < 512 );
        }
        else
        {
          let subTree = tree[ revcode & 511 ];
          let treeLen = 1 << ( subTree & 15 );
          subTree = -( subTree >> 4 );

          do
          {
            tree[ subTree | ( revcode >> 9 ) ] = Utils.bitConverterInt32ToInt16( ( i << 4 ) | bits );
            revcode += 1 << bits;
          }
          while( revcode < treeLen );
        }

        nextCode[ bits ] = code + ( 1 << ( 16 - bits ) );
      }

      return tree;
    }
        /// <summary>
    /// Builds huffman tree from array of code lengths.
    /// </summary>
    /// <param name="lengths">Array of code lengths.</param>
    private buildTree( lengths: Uint8Array ): void
    {
      // Count of codes for each code length.
      let blCount: number[] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
      // Numerical value of the smallest code for each code length.
      let nextCode: number[] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
      let prepareData: any = this.prepareData( blCount, nextCode, lengths);
      this.m_Tree = this.treeFromData( blCount, nextCode, lengths, prepareData.code, prepareData.treeSize );
    }
    /// <summary>
    /// Reads and decompresses one symbol.
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    public unpackSymbol( input: CompressedStreamReader ): number
    {
      let lookahead: number;
      let symbol: number;

      if( ( lookahead = input.peekBits( 9 ) ) >= 0 )
      {
        if( ( symbol = this.m_Tree[ lookahead ] ) >= 0 )
        {
          input.skipBits( (symbol & 15) );
          return symbol >> 4;
        }

        let subtree: number = -( symbol >> 4 );
        let bitlen: number = symbol & 15;

        if( ( lookahead = input.peekBits( bitlen ) ) >= 0 )
        {
          symbol = this.m_Tree[ subtree | ( lookahead >> 9 ) ];
          input.skipBits( (symbol & 15) );
          return symbol >> 4;
        }
        else
        {
          let bits = input.availableBits;
          lookahead = input.peekBits( bits );
          symbol = this.m_Tree[ subtree | ( lookahead >> 9 ) ];

          if( ( symbol & 15 ) <= bits )
          {
            input.skipBits( (symbol & 15) );
            return symbol >> 4;
          }
          else
          {
            return -1;
          }
        }
      }
      else
      {
        let bits = input.availableBits;
        lookahead = input.peekBits( bits );
        symbol = this.m_Tree[ lookahead ];

        if( symbol >= 0 && ( symbol & 15 ) <= bits )
        {
          input.skipBits( (symbol & 15) );
          return symbol >> 4;
        }
        else
        {
          return -1;
        }
      }
    }

    /// <summary>
    /// GET huffman tree for encoding and decoding lengths.
    /// </summary>
    public static get lengthTree(): DecompressorHuffmanTree{
        return this.m_LengthTree;
      
    }

    /// <summary>
    /// GET huffman tree for encoding and decoding distances.
    /// </summary>
    public static get distanceTree(): DecompressorHuffmanTree {
        return this.m_DistanceTree;
      
    }
    
}
/* eslint-enable */
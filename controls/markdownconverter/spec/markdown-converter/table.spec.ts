import { MarkdownConverter } from "../../src/markdown-converter/markdown-converter";

describe('MarkdownConverter - Tables (GFM)', () => {
  it('converts a basic table with header and one body row (pipes at both ends)', () => {
    const md = `| Foo | Bar |
| --- | --- |
| baz | qux |`;

    const html = MarkdownConverter.toHtml(md);

    expect(html).toBe(`<table>
<thead>
<tr>
<th>Foo</th>
<th>Bar</th>
</tr>
</thead>
<tbody><tr>
<td>baz</td>
<td>qux</td>
</tr>
</tbody></table>
`);
  });

  it('converts a basic table without outer pipes (GFM shorthand)', () => {
    const md = `Foo | Bar
--- | ---
baz | qux`;

    const html = MarkdownConverter.toHtml(md);

    expect(html).toBe(`<table>
<thead>
<tr>
<th>Foo</th>
<th>Bar</th>
</tr>
</thead>
<tbody><tr>
<td>baz</td>
<td>qux</td>
</tr>
</tbody></table>
`);
  });

  it('applies alignment for left, center, and right columns', () => {
    const md = `| Left | Center | Right |
| :--- | :----: | ----: |
| a    |   b    |     c |`;

    const html = MarkdownConverter.toHtml(md);

    // Note: If your renderer uses style="text-align:..." instead of align="...",
    // update the expectations accordingly.
    expect(html).toBe(`<table>
<thead>
<tr>
<th align="left">Left</th>
<th align="center">Center</th>
<th align="right">Right</th>
</tr>
</thead>
<tbody><tr>
<td align="left">a</td>
<td align="center">b</td>
<td align="right">c</td>
</tr>
</tbody></table>
`);
  });

  it('preserves inline formatting inside table cells', () => {
    const md = `| Col1     | Col2   |
| -------- | ------ |
| **bold** | \`code\` |`;

    const html = MarkdownConverter.toHtml(md);

    expect(html).toBe(`<table>
<thead>
<tr>
<th>Col1</th>
<th>Col2</th>
</tr>
</thead>
<tbody><tr>
<td><strong>bold</strong></td>
<td><code>code</code></td>
</tr>
</tbody></table>
`);
  });

  it('handles escaped pipes within cell content', () => {
    const md = `| A\\|B | C |
| ---- | - |
| val  | D |`;

    const html = MarkdownConverter.toHtml(md);

    expect(html).toBe(`<table>
<thead>
<tr>
<th>A|B</th>
<th>C</th>
</tr>
</thead>
<tbody><tr>
<td>val</td>
<td>D</td>
</tr>
</tbody></table>
`);
  });

  it('supports empty cells', () => {
    const md = `| A | B |
| --- | --- |
|     | 2   |
| 3   |     |`;

    const html = MarkdownConverter.toHtml(md);

    expect(html).toBe(`<table>
<thead>
<tr>
<th>A</th>
<th>B</th>
</tr>
</thead>
<tbody><tr>
<td></td>
<td>2</td>
</tr>
<tr>
<td>3</td>
<td></td>
</tr>
</tbody></table>
`);
  });

  it('renders paragraphs before and after a table', () => {
    const md = `Above

| X | Y |
| - | - |
| 1 | 2 |

Below`;

    const html = MarkdownConverter.toHtml(md);

    expect(html).toBe(`<p>Above</p>
<table>
<thead>
<tr>
<th>X</th>
<th>Y</th>
</tr>
</thead>
<tbody><tr>
<td>1</td>
<td>2</td>
</tr>
</tbody></table>
<p>Below</p>
`);
  });

  it('renders a table inside a blockquote', () => {
    const md = `> | A | B |
> | - | - |
> | 1 | 2 |`;

    const html = MarkdownConverter.toHtml(md);

    expect(html).toBe(`<blockquote>
<table>
<thead>
<tr>
<th>A</th>
<th>B</th>
</tr>
</thead>
<tbody><tr>
<td>1</td>
<td>2</td>
</tr>
</tbody></table>
</blockquote>
`);
  });

  it('handles extra spacing around pipes and cells', () => {
    const md = `|  Name   |  Value  |
| :------: | ------: |
|   a      |     10  |
|   b      |     20  |`;

    const html = MarkdownConverter.toHtml(md);

    // If your renderer uses style="text-align:..." adjust accordingly.
    expect(html).toBe(`<table>
<thead>
<tr>
<th align="center">Name</th>
<th align="right">Value</th>
</tr>
</thead>
<tbody><tr>
<td align="center">a</td>
<td align="right">10</td>
</tr>
<tr>
<td align="center">b</td>
<td align="right">20</td>
</tr>
</tbody></table>
`);
  });
});
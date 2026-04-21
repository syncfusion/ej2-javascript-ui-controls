import { PdfListFieldItem } from "./../src/pdf/core/annotations/annotation";
import { _ContentParser, _PdfRecord } from "./../src/pdf/core/content-parser";
import { PdfFontFamily, PdfStandardFont } from "./../src/pdf/core/fonts/pdf-standard-font";
import { PdfCheckBoxField, PdfComboBoxField, PdfRadioButtonListField, PdfTextBoxField } from "./../src/pdf/core/form/field";
import { PdfForm } from "./../src/pdf/core/form/form";
import { PdfBrush } from "./../src/pdf/core/graphics/pdf-graphics";
import { PdfDocument } from "./../src/pdf/core/pdf-document";
import { PdfBookmark, PdfBookmarkBase } from "./../src/pdf/core/pdf-outline";
import { PdfDestination, PdfPage } from "./../src/pdf/core/pdf-page";
import { _PdfDictionary, _PdfName, _PdfReference } from "./../src/pdf/core/pdf-primitives";
import { formPDF } from "./inputs.spec";

describe('User Interaction', () => {
    it('Bookmarks', () => {
        function drawTitle(page: PdfPage, title: string, x: number, y: number, brush: PdfBrush) {
            const font = new PdfStandardFont(PdfFontFamily.helvetica, 10);
            const bounds = { x: x, y: y, width: 500, height: 20 };
            page.graphics.drawString(title, font, bounds, brush);
        }
        const document = new PdfDocument();
        // Loop 3 times to add three pages representing Chapter 1, 2, and 3
        for (let i = 1; i <= 3; i++) {
            // For each iteration, add a new page to the document
            const page: PdfPage = document.addPage();
            // Compose the chapter title text (e.g., "Chapter 1")
            const chapterTitle = `Chapter ${i}`;
            // Draw the chapter title on the page at (10, 10) using a red brush
            drawTitle(page, chapterTitle, 10, 10, new PdfBrush({ r: 255, g: 0, b: 0 }));
            // Access the document's root bookmarks collection
            const bookmarks: PdfBookmarkBase = document.bookmarks;
            // Add a chapter-level bookmark with the chapter title
            const chapter: PdfBookmark = bookmarks.add(chapterTitle);
            // Set the chapter bookmark's destination to the chapter title position on the current page
            chapter.destination = new PdfDestination(page, { x: 10, y: 10 });
            // Color the chapter bookmark red
            chapter.color = { r: 255, g: 0, b: 0 };
            // Prepare section titles (e.g., "Section 1.1" and "Section 1.2")
            const sec1Title = `Section ${i}.1`;
            const sec2Title = `Section ${i}.2`;
            // Draw both section titles on the page at the specified coordinates using a green brush
            drawTitle(page, sec1Title, 30, 30, new PdfBrush({ r: 0, g: 255, b: 0 }));
            drawTitle(page, sec2Title, 30, 400, new PdfBrush({ r: 0, g: 255, b: 0 }));
            // Add a bookmark for Section 1 under the current chapter bookmark
            const section1: PdfBookmark = chapter.add(sec1Title);
            // Set the Section 1 bookmark destination to the section title position
            section1.destination = new PdfDestination(page, { x: 30, y: 30 });
            // Color the Section 1 bookmark dark green
            section1.color = { r: 0, g: 128, b: 0 };
            // Add a bookmark for Section 2 under the current chapter bookmark
            const section2: PdfBookmark = chapter.add(sec2Title);
            // Set the Section 2 bookmark destination to its title position
            section2.destination = new PdfDestination(page, { x: 30, y: 400 });
            // Color the Section 2 bookmark dark green
            section2.color = { r: 0, g: 128, b: 0 };
            // Define paragraph entries under Section 1 with their text and coordinates
            const subs1 = [
                { t: `Paragraph ${i}.1.1`, pt: { x: 50, y: 50 } },
                { t: `Paragraph ${i}.1.2`, pt: { x: 50, y: 150 } },
                { t: `Paragraph ${i}.1.3`, pt: { x: 50, y: 250 } }
            ];
            for (const s of subs1) {
                drawTitle(page, s.t, s.pt.x, s.pt.y, new PdfBrush({ r: 0, g: 0, b: 255 }));
                const b = section1.add(s.t);
                b.destination = new PdfDestination(page, s.pt);
                b.color = { r: 0, g: 0, b: 255 };
            }
            // Define paragraph entries under Section 2 with their text and coordinates
            const subs2 = [
                { t: `Paragraph ${i}.2.1`, pt: { x: 50, y: 420 } },
                { t: `Paragraph ${i}.2.2`, pt: { x: 50, y: 560 } },
                { t: `Paragraph ${i}.2.3`, pt: { x: 50, y: 680 } }
            ];
            for (const s of subs2) {
                drawTitle(page, s.t, s.pt.x, s.pt.y, new PdfBrush({ r: 0, g: 0, b: 255 }));
                const b = section2.add(s.t);
                b.destination = new PdfDestination(page, s.pt);
                b.color = { r: 0, g: 0, b: 255 };
            }
        }
        // Save and download PDF document
        const bytes = document.save();
        // Destory the document instance
        document.destroy();
        const parsed: PdfDocument = new PdfDocument(bytes);
        let parsedPage: PdfPage = parsed.getPage(0);
        // Outline level check
        const bookmarks = parsed.bookmarks;
        const [parentOne, parentTwo, parentThree] = bookmarks._bookMarkList;
        const [destRef1, destRef2, destRef3]: _PdfReference[] = [parentOne._dictionary.get('Dest')[0], parentTwo._dictionary.get('Dest')[0], parentThree._dictionary.get('Dest')[0]];
        expect(parentOne._next).toEqual(parentTwo);
        expect(parentTwo._next).toEqual(parentThree);
        expect(destRef1.objectNumber).toEqual(4);
        expect(destRef1.generationNumber).toEqual(0);
        expect(destRef2.objectNumber).toEqual(28);
        expect(destRef2.generationNumber).toEqual(0);
        expect(destRef3.objectNumber).toEqual(51);
        expect(destRef3.generationNumber).toEqual(0);
        let first = parentOne._dictionary.get('First');
        let last = parentOne._dictionary.get('Last');
        expect(last).toBeDefined();
        expect(first).toBeDefined();
        expect(first.get('Title')).toEqual('Section 1.1');
        let innerFirst = first.get('First');
        expect(innerFirst);
        expect(innerFirst.get('Title')).toEqual('Paragraph 1.1.1');
        let next = innerFirst.get('Next');
        expect(next.get('Title')).toEqual('Paragraph 1.1.2');
        next = next.get('Next');
        expect(next.get('Title')).toEqual('Paragraph 1.1.3');
        let outerNext = first.get('Next');
        expect(outerNext.get('Title')).toEqual('Section 1.2');
        innerFirst = outerNext.get('First');
        expect(innerFirst);
        expect(innerFirst.get('Title')).toEqual('Paragraph 1.2.1');
        next = innerFirst.get('Next');
        expect(next.get('Title')).toEqual('Paragraph 1.2.2');
        next = next.get('Next');
        expect(next.get('Title')).toEqual('Paragraph 1.2.3');
        //second parent
        first = parentTwo._dictionary.get('First');
        last = parentTwo._dictionary.get('Last');
        expect(last).toBeDefined();
        expect(first).toBeDefined();
        expect(first.get('Title')).toEqual('Section 2.1');
        innerFirst = first.get('First');
        expect(innerFirst);
        expect(innerFirst.get('Title')).toEqual('Paragraph 2.1.1');
        next = innerFirst.get('Next');
        expect(next.get('Title')).toEqual('Paragraph 2.1.2');
        next = next.get('Next');
        expect(next.get('Title')).toEqual('Paragraph 2.1.3');
        outerNext = first.get('Next');
        expect(outerNext.get('Title')).toEqual('Section 2.2');
        innerFirst = outerNext.get('First');
        expect(innerFirst);
        expect(innerFirst.get('Title')).toEqual('Paragraph 2.2.1');
        next = innerFirst.get('Next');
        expect(next.get('Title')).toEqual('Paragraph 2.2.2');
        next = next.get('Next');
        expect(next.get('Title')).toEqual('Paragraph 2.2.3');
        //third parent
        first = parentThree._dictionary.get('First');
        last = parentThree._dictionary.get('Last');
        expect(last).toBeDefined();
        expect(first).toBeDefined();
        expect(first.get('Title')).toEqual('Section 3.1');
        innerFirst = first.get('First');
        expect(innerFirst);
        expect(innerFirst.get('Title')).toEqual('Paragraph 3.1.1');
        next = innerFirst.get('Next');
        expect(next.get('Title')).toEqual('Paragraph 3.1.2');
        next = next.get('Next');
        expect(next.get('Title')).toEqual('Paragraph 3.1.3');
        outerNext = first.get('Next');
        expect(outerNext.get('Title')).toEqual('Section 3.2');
        innerFirst = outerNext.get('First');
        expect(innerFirst);
        expect(innerFirst.get('Title')).toEqual('Paragraph 3.2.1');
        next = innerFirst.get('Next');
        expect(next.get('Title')).toEqual('Paragraph 3.2.2');
        next = next.get('Next');
        expect(next.get('Title')).toEqual('Paragraph 3.2.3');
        expect(parentOne._dictionary.get('Next')).toBeDefined();
        expect(parentOne._dictionary.get('Title')).toEqual('Chapter 1');
        expect(parentTwo._dictionary.get('First')).toBeDefined();
        expect(parentTwo._dictionary.get('Last')).toBeDefined();
        expect(parentTwo._dictionary.get('Next')).toBeDefined();
        expect(parentTwo._dictionary.get('Prev')).toBeDefined();
        expect(parentTwo._dictionary.get('Title')).toEqual('Chapter 2');
        expect(parentThree._dictionary.get('First')).toBeDefined();
        expect(parentThree._dictionary.get('Last')).toBeDefined();
        expect(parentThree._dictionary.get('Prev')).toBeDefined();
        expect(parentThree._dictionary.get('Title')).toEqual('Chapter 3');
        let result: _PdfRecord[] = getRecords(parsedPage);
        expect(result[17]._operands).toEqual(['(Chapter 1)']);
        expect(result[23]._operands).toEqual(['(Section 1.1)']);
        expect(result[29]._operands).toEqual(['(Section 1.2)']);
        expect(result[35]._operands).toEqual(['(Paragraph 1.1.1)']);
        expect(result[41]._operands).toEqual(['(Paragraph 1.1.2)']);
        expect(result[47]._operands).toEqual(['(Paragraph 1.1.3)']);
        expect(result[53]._operands).toEqual(['(Paragraph 1.2.1)']);
        expect(result[59]._operands).toEqual(['(Paragraph 1.2.2)']);
        expect(result[65]._operands).toEqual(['(Paragraph 1.2.3)']);
        commonCheck(parsedPage, result);
        parsedPage = parsed.getPage(1);
        result = getRecords(parsedPage);
        expect(result[17]._operands).toEqual(['(Chapter 2)']);
        expect(result[23]._operands).toEqual(['(Section 2.1)']);
        expect(result[29]._operands).toEqual(['(Section 2.2)']);
        expect(result[35]._operands).toEqual(['(Paragraph 2.1.1)']);
        expect(result[41]._operands).toEqual(['(Paragraph 2.1.2)']);
        expect(result[47]._operands).toEqual(['(Paragraph 2.1.3)']);
        expect(result[53]._operands).toEqual(['(Paragraph 2.2.1)']);
        expect(result[59]._operands).toEqual(['(Paragraph 2.2.2)']);
        expect(result[65]._operands).toEqual(['(Paragraph 2.2.3)']);
        commonCheck(parsedPage, result);
        parsedPage = parsed.getPage(2);
        result = getRecords(parsedPage);
        expect(result[17]._operands).toEqual(['(Chapter 3)']);
        expect(result[23]._operands).toEqual(['(Section 3.1)']);
        expect(result[29]._operands).toEqual(['(Section 3.2)']);
        expect(result[35]._operands).toEqual(['(Paragraph 3.1.1)']);
        expect(result[41]._operands).toEqual(['(Paragraph 3.1.2)']);
        expect(result[47]._operands).toEqual(['(Paragraph 3.1.3)']);
        expect(result[53]._operands).toEqual(['(Paragraph 3.2.1)']);
        expect(result[59]._operands).toEqual(['(Paragraph 3.2.2)']);
        expect(result[65]._operands).toEqual(['(Paragraph 3.2.3)']);
        commonCheck(parsedPage, result);
        function getRecords(parsedPage: PdfPage) {
            const contents = parsedPage._pageDictionary.get('Contents');
            const ref = contents[2];
            const stream = parsedPage._crossReference._fetch(ref);
            const parser: _ContentParser = new _ContentParser(stream.getBytes());
            return parser._readContent();
        }
        function commonCheck(parsedPage: PdfPage, result: _PdfRecord[]) {
            const fontDictionary: _PdfDictionary = parsedPage._pageDictionary.get('Resources').get('Font');
            let HelveticaRef: string = result[11]._operands[0];
            let Helvetica: _PdfName = fontDictionary.get(HelveticaRef.slice(1)).get('BaseFont');
            expect(Helvetica.name).toEqual('Helvetica');
            HelveticaRef = result[21]._operands[0];
            Helvetica = fontDictionary.get(HelveticaRef.slice(1)).get('BaseFont');
            expect(Helvetica.name).toEqual('Helvetica');
            HelveticaRef = result[33]._operands[0];
            Helvetica = fontDictionary.get(HelveticaRef.slice(1)).get('BaseFont');
            expect(Helvetica.name).toEqual('Helvetica');
            HelveticaRef = result[39]._operands[0];
            Helvetica = fontDictionary.get(HelveticaRef.slice(1)).get('BaseFont');
            expect(Helvetica.name).toEqual('Helvetica');
            HelveticaRef = result[45]._operands[0];
            Helvetica = fontDictionary.get(HelveticaRef.slice(1)).get('BaseFont');
            expect(Helvetica.name).toEqual('Helvetica');
            HelveticaRef = result[51]._operands[0];
            Helvetica = fontDictionary.get(HelveticaRef.slice(1)).get('BaseFont');
            expect(Helvetica.name).toEqual('Helvetica');
            HelveticaRef = result[57]._operands[0];
            Helvetica = fontDictionary.get(HelveticaRef.slice(1)).get('BaseFont');
            expect(Helvetica.name).toEqual('Helvetica');
            HelveticaRef = result[63]._operands[0];
            Helvetica = fontDictionary.get(HelveticaRef.slice(1)).get('BaseFont');
            expect(Helvetica.name).toEqual('Helvetica');
            expect(result[0]._operator).toEqual('q');
            expect(result[0]._operands).toEqual([]);
            expect(result[1]._operator).toEqual('cm');
            expect(result[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '842.00']);
            expect(result[2]._operator).toEqual('re');
            expect(result[2]._operands).toEqual(['40.000', '-40.000', '515.000', '-762.000']);
            expect(result[3]._operator).toEqual('h');
            expect(result[3]._operands).toEqual([]);
            expect(result[4]._operator).toEqual('W');
            expect(result[4]._operands).toEqual([]);
            expect(result[5]._operator).toEqual('n');
            expect(result[5]._operands).toEqual([]);
            expect(result[6]._operator).toEqual('cm');
            expect(result[6]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-40.00']);
            expect(result[7]._operator).toEqual('BT');
            expect(result[7]._operands).toEqual([]);
            expect(result[8]._operator).toEqual('CS');
            expect(result[8]._operands).toEqual(['/DeviceRGB']);
            expect(result[9]._operator).toEqual('cs');
            expect(result[9]._operands).toEqual(['/DeviceRGB']);
            expect(result[10]._operator).toEqual('rg');
            expect(result[10]._operands).toEqual(['1.000', '0.000', '0.000']);
            expect(result[11]._operator).toEqual('Tf');
            expect(result[11]._operands[1]).toEqual('10.000');
            expect(result[12]._operator).toEqual('Tr');
            expect(result[12]._operands).toEqual(['0']);
            expect(result[13]._operator).toEqual('Tc');
            expect(result[13]._operands).toEqual(['0.000']);
            expect(result[14]._operator).toEqual('Tw');
            expect(result[14]._operands).toEqual(['0.000']);
            expect(result[15]._operator).toEqual('Tz');
            expect(result[15]._operands).toEqual(['100.000']);
            expect(result[16]._operator).toEqual('Tm');
            expect(result[16]._operands).toEqual(['1.00', '.00', '.00', '1.00', '10.00', '-19.31']);
            expect(result[17]._operator).toEqual("'");
            expect(result[18]._operator).toEqual('ET');
            expect(result[18]._operands).toEqual([]);
            expect(result[19]._operator).toEqual('BT');
            expect(result[19]._operands).toEqual([]);
            expect(result[20]._operator).toEqual('rg');
            expect(result[20]._operands).toEqual(['0.000', '1.000', '0.000']);
            expect(result[21]._operator).toEqual('Tf');
            expect(result[21]._operands[1]).toEqual('10.000');
            expect(result[22]._operator).toEqual('Tm');
            expect(result[22]._operands).toEqual(['1.00', '.00', '.00', '1.00', '30.00', '-39.31']);
            expect(result[23]._operator).toEqual("'");
            expect(result[24]._operator).toEqual('ET');
            expect(result[24]._operands).toEqual([]);
            expect(result[25]._operator).toEqual('BT');
            expect(result[25]._operands).toEqual([]);
            expect(result[26]._operator).toEqual('rg');
            expect(result[26]._operands).toEqual(['0.000', '1.000', '0.000']);
            expect(result[27]._operator).toEqual('Tf');
            expect(result[27]._operands[1]).toEqual('10.000');
            expect(result[28]._operator).toEqual('Tm');
            expect(result[28]._operands).toEqual(['1.00', '.00', '.00', '1.00', '30.00', '-409.31']);
            expect(result[29]._operator).toEqual("'");
            expect(result[30]._operator).toEqual('ET');
            expect(result[30]._operands).toEqual([]);
            expect(result[31]._operator).toEqual('BT');
            expect(result[31]._operands).toEqual([]);
            expect(result[32]._operator).toEqual('rg');
            expect(result[32]._operands).toEqual(['0.000', '0.000', '1.000']);
            expect(result[33]._operator).toEqual('Tf');
            expect(result[33]._operands[1]).toEqual('10.000');
            expect(result[34]._operator).toEqual('Tm');
            expect(result[34]._operands).toEqual(['1.00', '.00', '.00', '1.00', '50.00', '-59.31']);
            expect(result[35]._operator).toEqual("'");
            expect(result[36]._operator).toEqual('ET');
            expect(result[36]._operands).toEqual([]);
            expect(result[37]._operator).toEqual('BT');
            expect(result[37]._operands).toEqual([]);
            expect(result[38]._operator).toEqual('rg');
            expect(result[38]._operands).toEqual(['0.000', '0.000', '1.000']);
            expect(result[39]._operator).toEqual('Tf');
            expect(result[39]._operands[1]).toEqual('10.000');
            expect(result[40]._operator).toEqual('Tm');
            expect(result[40]._operands).toEqual(['1.00', '.00', '.00', '1.00', '50.00', '-159.31']);
            expect(result[41]._operator).toEqual("'");
            expect(result[42]._operator).toEqual('ET');
            expect(result[42]._operands).toEqual([]);
            expect(result[43]._operator).toEqual('BT');
            expect(result[43]._operands).toEqual([]);
            expect(result[44]._operator).toEqual('rg');
            expect(result[44]._operands).toEqual(['0.000', '0.000', '1.000']);
            expect(result[45]._operator).toEqual('Tf');
            expect(result[45]._operands[1]).toEqual('10.000');
            expect(result[46]._operator).toEqual('Tm');
            expect(result[46]._operands).toEqual(['1.00', '.00', '.00', '1.00', '50.00', '-259.31']);
            expect(result[47]._operator).toEqual("'");
            expect(result[48]._operator).toEqual('ET');
            expect(result[48]._operands).toEqual([]);
            expect(result[49]._operator).toEqual('BT');
            expect(result[49]._operands).toEqual([]);
            expect(result[50]._operator).toEqual('rg');
            expect(result[50]._operands).toEqual(['0.000', '0.000', '1.000']);
            expect(result[51]._operator).toEqual('Tf');
            expect(result[51]._operands[1]).toEqual('10.000');
            expect(result[52]._operator).toEqual('Tm');
            expect(result[52]._operands).toEqual(['1.00', '.00', '.00', '1.00', '50.00', '-429.31']);
            expect(result[53]._operator).toEqual("'");
            expect(result[54]._operator).toEqual('ET');
            expect(result[54]._operands).toEqual([]);
            expect(result[55]._operator).toEqual('BT');
            expect(result[55]._operands).toEqual([]);
            expect(result[56]._operator).toEqual('rg');
            expect(result[56]._operands).toEqual(['0.000', '0.000', '1.000']);
            expect(result[57]._operator).toEqual('Tf');
            expect(result[57]._operands[1]).toEqual('10.000');
            expect(result[58]._operator).toEqual('Tm');
            expect(result[58]._operands).toEqual(['1.00', '.00', '.00', '1.00', '50.00', '-569.31']);
            expect(result[59]._operator).toEqual("'");
            expect(result[60]._operator).toEqual('ET');
            expect(result[60]._operands).toEqual([]);
            expect(result[61]._operator).toEqual('BT');
            expect(result[61]._operands).toEqual([]);
            expect(result[62]._operator).toEqual('rg');
            expect(result[62]._operands).toEqual(['0.000', '0.000', '1.000']);
            expect(result[63]._operator).toEqual('Tf');
            expect(result[63]._operands[1]).toEqual('10.000');
            expect(result[64]._operator).toEqual('Tm');
            expect(result[64]._operands).toEqual(['1.00', '.00', '.00', '1.00', '50.00', '-689.31']);
            expect(result[65]._operator).toEqual("'");
            expect(result[66]._operator).toEqual('ET');
            expect(result[66]._operands).toEqual([]);
        }
        parsed.destroy();
    });
    it('Form Filling -With Flatten', () => {
        function getFormValues() {
            const name = 'Ragul';
            const gender = 'Male';
            const dob = '04/08/2003';
            const email = 'ragul.milton@example.com';
            const state = 'tamil nadu';
            const newsletter = true;
            return { name, gender, dob, email, state, newsletter }
        }
        function findByName(form: PdfForm, name: string) {
            for (let i = 0; i < form.count; i++) {
                const field = form.fieldAt(i);
                if (field && field.name === name) return field;
            }
            return undefined;
        }
        function getFieldRecords(fieldRef1: string): _PdfRecord[] {
            let fieldStream = XObject.get(fieldRef1.slice(1));
            let fieldparser: _ContentParser = new _ContentParser(fieldStream.getBytes());
            return fieldparser._readContent();
        }
        const pdfBytes = formPDF;
        // Read current form values from the page
        const values = getFormValues();
        // Create a PdfDocument from the fetched bytes
        const pdf = new PdfDocument(pdfBytes);
        // Get the PdfForm
        const form = pdf.form;
        // Map and set each field if present, then set appearance
        const nameField = findByName(form, 'name') as PdfTextBoxField | undefined;
        if (nameField) {
            nameField.text = values.name;
            nameField.setAppearance(true);
        }
        const gender = findByName(form, 'gender') as PdfRadioButtonListField | undefined;
        if (gender) {
            switch (values.gender) {
                case 'Male': gender.selectedIndex = 0; break;
                case 'Other': gender.selectedIndex = 1; break;
                case 'Female': gender.selectedIndex = 2; break;
            }
            gender.setAppearance(true);
        }
        const dobField = findByName(form, 'dob') as PdfTextBoxField | undefined;
        if (dobField) {
            dobField.text = values.dob;
            dobField.setAppearance(true);
        }
        const emailField = findByName(form, 'email') as PdfTextBoxField | undefined;
        if (emailField) {
            emailField.text = values.email;
            emailField.setAppearance(true);
        }
        const stateField = findByName(form, 'state') as PdfComboBoxField | undefined;
        if (stateField) {
            for (let i = 0; i < stateField.itemsCount; i++) {
                const item = stateField.itemAt(i) as PdfListFieldItem | undefined;
                if (item && item.text === values.state) {
                    stateField.selectedIndex = i;
                    break;
                }
            }
            stateField.setAppearance(true);
        }
        const newsField = findByName(form, 'newsletter') as PdfCheckBoxField | undefined;
        if (newsField) {
            newsField.checked = values.newsletter;
            newsField.setAppearance(true);
        }
        pdf.flatten = true;
        const bytes = pdf.save();
        pdf.destroy();
        const parsed: PdfDocument = new PdfDocument(bytes);
        const parsedPage: PdfPage = parsed.getPage(0);
        const contents = parsedPage._pageDictionary.get('Contents');
        const ref = contents[3];
        const stream = parsedPage._crossReference._fetch(ref);
        const parser: _ContentParser = new _ContentParser(stream.getBytes());
        const result: _PdfRecord[] = parser._readContent();
        const XObject: _PdfDictionary = parsedPage._pageDictionary.get('Resources').get('XObject');
        //Checking the values for the Check box field
        const checkbox = result[6]._operands[0];
        let fieldRecords = getFieldRecords(checkbox);
        expect(fieldRecords[0]._operator).toEqual('q');
        expect(fieldRecords[0]._operands.length).toBe(0);
        expect(fieldRecords[1]._operator).toEqual('re');
        expect(fieldRecords[1]._operands).toEqual(['1', '1', '11.4862', '12.16']);
        expect(fieldRecords[2]._operator).toEqual('W');
        expect(fieldRecords[2]._operands.length).toBe(0);
        expect(fieldRecords[3]._operator).toEqual('n');
        expect(fieldRecords[3]._operands.length).toBe(0);
        expect(fieldRecords[4]._operator).toEqual('BT');
        expect(fieldRecords[4]._operands.length).toBe(0);
        expect(fieldRecords[5]._operator).toEqual('Tf');
        expect(fieldRecords[5]._operands[1]).toEqual('12');
        expect(fieldRecords[6]._operator).toEqual('Td');
        expect(fieldRecords[6]._operands).toEqual(['1.6672', '3.0181']);
        expect(fieldRecords[7]._operator).toEqual('TL');
        expect(fieldRecords[7]._operands).toEqual(['11.556']);
        expect(fieldRecords[8]._operator).toEqual('Tj');
        expect(fieldRecords[8]._operands).toEqual(['(4)']);
        expect(fieldRecords[9]._operator).toEqual('ET');
        expect(fieldRecords[9]._operands.length).toBe(0);
        expect(fieldRecords[10]._operator).toEqual('Q');
        expect(fieldRecords[10]._operands.length).toBe(0);
        // Checking the values for the gender field since the 
        function checkCommonCasesInRadio(fieldRecords: _PdfRecord[]) {
            expect(fieldRecords[0]._operator).toEqual('cm');
            expect(fieldRecords[0]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '14.40']);
            expect(fieldRecords[1]._operator).toEqual('m');
            expect(fieldRecords[1]._operands).toEqual(['14.400', '-7.200']);
            expect(fieldRecords[2]._operator).toEqual('c');
            expect(fieldRecords[2]._operands).toEqual(['14.400', '-11.176', '11.176', '-14.400', '7.200', '-14.400']);
            expect(fieldRecords[3]._operator).toEqual('c');
            expect(fieldRecords[3]._operands).toEqual(['3.224', '-14.400', '0.000', '-11.176', '0.000', '-7.200']);
            expect(fieldRecords[4]._operator).toEqual('c');
            expect(fieldRecords[4]._operands).toEqual(['0.000', '-3.224', '3.224', '-0.000', '7.200', '0.000']);
            expect(fieldRecords[5]._operator).toEqual('c');
            expect(fieldRecords[5]._operands).toEqual(['11.176', '0.000', '14.400', '-3.224', '14.400', '-7.200']);
            expect(fieldRecords[6]._operator).toEqual('n');
            expect(fieldRecords[6]._operands.length).toBe(0);
            expect(fieldRecords[7]._operator).toEqual('m');
            expect(fieldRecords[7]._operands).toEqual(['13.900', '-7.200']);
            expect(fieldRecords[8]._operator).toEqual('c');
            expect(fieldRecords[8]._operands).toEqual(['13.900', '-10.900', '10.900', '-13.900', '7.200', '-13.900']);
            expect(fieldRecords[9]._operator).toEqual('c');
            expect(fieldRecords[9]._operands).toEqual(['3.500', '-13.900', '0.500', '-10.900', '0.500', '-7.200']);
            expect(fieldRecords[10]._operator).toEqual('c');
            expect(fieldRecords[10]._operands).toEqual(['0.500', '-3.500', '3.500', '-0.500', '7.200', '-0.500']);
            expect(fieldRecords[11]._operator).toEqual('c');
            expect(fieldRecords[11]._operands).toEqual(['10.900', '-0.500', '13.900', '-3.500', '13.900', '-7.200']);
            expect(fieldRecords[12]._operator).toEqual('n');
            expect(fieldRecords[12]._operands.length).toBe(0);

        }
        const maleRadio = result[20]._operands[0];
        fieldRecords = getFieldRecords(maleRadio);
        checkCommonCasesInRadio(fieldRecords);
        //Selected value will have the extra drawing
        expect(fieldRecords[13]._operator).toEqual('CS');
        expect(fieldRecords[13]._operands).toEqual(['/DeviceRGB']);
        expect(fieldRecords[14]._operator).toEqual('cs');
        expect(fieldRecords[14]._operands).toEqual(['/DeviceRGB']);
        expect(fieldRecords[15]._operator).toEqual('rg');
        expect(fieldRecords[15]._operands).toEqual(['0.000', '0.000', '0.000']);
        expect(fieldRecords[16]._operator).toEqual('m');
        expect(fieldRecords[16]._operands).toEqual(['10.550', '-7.200']);
        expect(fieldRecords[17]._operator).toEqual('c');
        expect(fieldRecords[17]._operands).toEqual(['10.550', '-9.050', '9.050', '-10.550', '7.200', '-10.550']);
        expect(fieldRecords[18]._operator).toEqual('c');
        expect(fieldRecords[18]._operands).toEqual(['5.350', '-10.550', '3.850', '-9.050', '3.850', '-7.200']);
        expect(fieldRecords[19]._operator).toEqual('c');
        expect(fieldRecords[19]._operands).toEqual(['3.850', '-5.350', '5.350', '-3.850', '7.200', '-3.850']);
        expect(fieldRecords[20]._operator).toEqual('c');
        expect(fieldRecords[20]._operands).toEqual(['9.050', '-3.850', '10.550', '-5.350', '10.550', '-7.200']);
        expect(fieldRecords[21]._operator).toEqual('h');
        expect(fieldRecords[21]._operands.length).toBe(0);
        expect(fieldRecords[22]._operator).toEqual('f');
        expect(fieldRecords[22]._operands.length).toBe(0);
        //Female in gender
        const femaleRadio = result[27]._operands[0];
        fieldRecords = getFieldRecords(femaleRadio);
        checkCommonCasesInRadio(fieldRecords);
        // Others in gender
        const otherRadio = result[34]._operands[0];
        fieldRecords = getFieldRecords(otherRadio);
        checkCommonCasesInRadio(fieldRecords);
        // checking the value for email    
        const email = result[40]._operands[0];
        fieldRecords = getFieldRecords(email);
        CheckCommonCasesInTextBox(fieldRecords);
        function CheckCommonCasesInTextBox(fieldRecords: _PdfRecord[]) {
            expect(fieldRecords[0]._operator).toEqual('BMC');
            expect(fieldRecords[0]._operands).toEqual(['/Tx']);
            expect(fieldRecords[1]._operator).toEqual('cm');
            expect(fieldRecords[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '18.00']);
            expect(fieldRecords[2]._operator).toEqual('re');
            expect(fieldRecords[2]._operands).toEqual(['0.000', '0.000', '195.556', '-18.000']);
            expect(fieldRecords[3]._operator).toEqual('n');
            expect(fieldRecords[3]._operands.length).toBe(0);
            expect(fieldRecords[4]._operator).toEqual('q');
            expect(fieldRecords[4]._operands.length).toBe(0);
            expect(fieldRecords[5]._operator).toEqual('re');
            expect(fieldRecords[5]._operands).toEqual(['0.000', '-3.220', '195.556', '-11.560']);
            expect(fieldRecords[6]._operator).toEqual('W');
            expect(fieldRecords[6]._operands.length).toBe(0);
            expect(fieldRecords[7]._operator).toEqual('n');
            expect(fieldRecords[7]._operands.length).toBe(0);
            expect(fieldRecords[8]._operator).toEqual('BT');
            expect(fieldRecords[8]._operands.length).toBe(0);
            expect(fieldRecords[9]._operator).toEqual('CS');
            expect(fieldRecords[9]._operands).toEqual(['/DeviceRGB']);
            expect(fieldRecords[10]._operator).toEqual('cs');
            expect(fieldRecords[10]._operands).toEqual(['/DeviceRGB']);
            expect(fieldRecords[11]._operator).toEqual('rg');
            expect(fieldRecords[11]._operands).toEqual(['0.000', '0.000', '0.000']);
            expect(fieldRecords[12]._operator).toEqual('Tf');
            expect(fieldRecords[12]._operands[1]).toEqual('10.000');
            expect(fieldRecords[13]._operator).toEqual('Tr');
            expect(fieldRecords[13]._operands).toEqual(['0']);
            expect(fieldRecords[14]._operator).toEqual('Tc');
            expect(fieldRecords[14]._operands).toEqual(['0.000']);
            expect(fieldRecords[15]._operator).toEqual('Tw');
            expect(fieldRecords[15]._operands).toEqual(['0.000']);
            expect(fieldRecords[16]._operator).toEqual('Tz');
            expect(fieldRecords[16]._operands).toEqual(['100.000']);
            expect(fieldRecords[17]._operator).toEqual('Tm');
            expect(fieldRecords[17]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '-12.53']);
            expect(fieldRecords[18]._operator).toEqual("'");
            expect(fieldRecords[19]._operator).toEqual('Td');
            expect(fieldRecords[19]._operands).toEqual(['0.000', '-8.340']);
            expect(fieldRecords[20]._operator).toEqual('ET');
            expect(fieldRecords[20]._operands.length).toBe(0);
            expect(fieldRecords[21]._operator).toEqual('Q');
            expect(fieldRecords[21]._operands.length).toBe(0);
            expect(fieldRecords[22]._operator).toEqual('EMC');
            expect(fieldRecords[22]._operands.length).toBe(0);
        }
        expect(fieldRecords[18]._operands).toEqual(['(ragul.milton@example.com)']);
        //checking the value for the name
        const nameTextBox = result[46]._operands[0];
        fieldRecords = getFieldRecords(nameTextBox);
        CheckCommonCasesInTextBox(fieldRecords);
        expect(fieldRecords[18]._operator).toEqual("'");
        expect(fieldRecords[18]._operands).toEqual(['(Ragul)']);
        //checking the value for the date 
        const dateField = result[52]._operands[0];
        fieldRecords = getFieldRecords(dateField);
        CheckCommonCasesInTextBox(fieldRecords);
        expect(fieldRecords[18]._operands).toEqual(['(04/08/2003)']);
    });
    it('Form Filling -Without Flatten', () => {
        function getFormValues() {
            const name = 'Jack';
            const gender = 'Female';
            const dob = '26/06/2004';
            const email = 'jack@example.com';
            const state = 'kerala';
            const newsletter = false;
            return { name, gender, dob, email, state, newsletter }
        }
        function findByName(form: PdfForm, name: string) {
            for (let i = 0; i < form.count; i++) {
                const field = form.fieldAt(i);
                if (field && field.name === name) return field;
            }
            return undefined;
        }
        const pdfBytes = formPDF;
        // Read current form values from the page
        const values = getFormValues();
        // Create a PdfDocument from the fetched bytes
        const pdf = new PdfDocument(pdfBytes);
        // Get the PdfForm
        const form = pdf.form;
        // Map and set each field if present, then set appearance
        const nameField = findByName(form, 'name') as PdfTextBoxField | undefined;
        if (nameField) {
            nameField.text = values.name;
            nameField.setAppearance(true);
        }
        const gender = findByName(form, 'gender') as PdfRadioButtonListField | undefined;
        if (gender) {
            switch (values.gender) {
                case 'Male': gender.selectedIndex = 0; break;
                case 'Other': gender.selectedIndex = 1; break;
                case 'Female': gender.selectedIndex = 2; break;
            }
            gender.setAppearance(true);
        }
        const dobField = findByName(form, 'dob') as PdfTextBoxField | undefined;
        if (dobField) {
            dobField.text = values.dob;
            dobField.setAppearance(true);
        }
        const emailField = findByName(form, 'email') as PdfTextBoxField | undefined;
        if (emailField) {
            emailField.text = values.email;
            emailField.setAppearance(true);
        }
        const stateField = findByName(form, 'state') as PdfComboBoxField | undefined;
        if (stateField) {
            for (let i = 0; i < stateField.itemsCount; i++) {
                const item = stateField.itemAt(i) as PdfListFieldItem | undefined;
                if (item && item.text === values.state) {
                    stateField.selectedIndex = i;
                    break;
                }
            }
            stateField.setAppearance(true);
        }
        const newsField = findByName(form, 'newsletter') as PdfCheckBoxField | undefined;
        if (newsField) {
            newsField.checked = values.newsletter;
            newsField.setAppearance(true);
        }
        const bytes = pdf.save();
        pdf.destroy();
        const parsed: PdfDocument = new PdfDocument(bytes);
        const parsedPage: PdfPage = parsed.getPage(0);
        expect(parsed.form.count).toEqual(6);
        //Check the form values
        let field = parsed.form.fieldAt(0);
        expect(field.getValue('V')).toEqual('26/06/2004');
        expect(parsed.form.fieldAt(1).getValue('V')).toEqual('Jack');
        expect(parsed.form.fieldAt(2).getValue('V')).toEqual('jack@example.com');
        expect(parsed.form.fieldAt(3).getValue('V')).toEqual('Female');
        expect(parsed.form.fieldAt(4).getValue('V')).toEqual('Alabama');
        //Apperance level check
        let annotations = parsedPage._pageDictionary.get('Annots');

        function CheckCommonCasesInTextBox(result: _PdfRecord[]) {
            expect(result[0]._operator).toEqual('BMC');
            expect(result[0]._operands).toEqual(['/Tx']);
            expect(result[1]._operator).toEqual('cm');
            expect(result[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '18.00']);
            expect(result[2]._operator).toEqual('re');
            expect(result[2]._operands).toEqual(['0.000', '0.000', '195.556', '-18.000']);
            expect(result[3]._operator).toEqual('n');
            expect(result[3]._operands.length).toBe(0);
            expect(result[4]._operator).toEqual('q');
            expect(result[4]._operands.length).toBe(0);
            expect(result[5]._operator).toEqual('re');
            expect(result[5]._operands).toEqual(['0.000', '-3.220', '195.556', '-11.560']);
            expect(result[6]._operator).toEqual('W');
            expect(result[6]._operands.length).toBe(0);
            expect(result[7]._operator).toEqual('n');
            expect(result[7]._operands.length).toBe(0);
            expect(result[8]._operator).toEqual('BT');
            expect(result[8]._operands.length).toBe(0);
            expect(result[9]._operator).toEqual('CS');
            expect(result[9]._operands).toEqual(['/DeviceRGB']);
            expect(result[10]._operator).toEqual('cs');
            expect(result[10]._operands).toEqual(['/DeviceRGB']);
            expect(result[11]._operator).toEqual('rg');
            expect(result[11]._operands).toEqual(['0.000', '0.000', '0.000']);
            expect(result[12]._operator).toEqual('Tf');
            expect(result[12]._operands[1]).toEqual('10.000');
            expect(result[13]._operator).toEqual('Tr');
            expect(result[13]._operands).toEqual(['0']);
            expect(result[14]._operator).toEqual('Tc');
            expect(result[14]._operands).toEqual(['0.000']);
            expect(result[15]._operator).toEqual('Tw');
            expect(result[15]._operands).toEqual(['0.000']);
            expect(result[16]._operator).toEqual('Tz');
            expect(result[16]._operands).toEqual(['100.000']);
            expect(result[17]._operator).toEqual('Tm');
            expect(result[17]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '-12.53']);
            expect(result[18]._operator).toEqual("'");
            expect(result[19]._operator).toEqual('Td');
            expect(result[19]._operands).toEqual(['0.000', '-8.340']);
            expect(result[20]._operator).toEqual('ET');
            expect(result[20]._operands.length).toBe(0);
            expect(result[21]._operator).toEqual('Q');
            expect(result[21]._operands.length).toBe(0);
            expect(result[22]._operator).toEqual('EMC');
            expect(result[22]._operands.length).toBe(0);
        }
        let result = getAnnotationRecords(annotations[0], parsedPage);
        expect(result[18]._operands).toEqual(['(Jack)']);
        CheckCommonCasesInTextBox(result);
        result = getAnnotationRecords(annotations[1], parsedPage);
        expect(result[18]._operands).toEqual(['(jack@example.com)']);
        CheckCommonCasesInTextBox(result);
        result = getAnnotationRecords(annotations[5], parsedPage);
        expect(result[18]._operands).toEqual(['(26/06/2004)']);
        CheckCommonCasesInTextBox(result);
        let annotation = parsedPage._crossReference._fetch(annotations[2]);
        expect(annotation.get('AS').name).toEqual('Off');
        let gendervalue = annotation.get('AP').get('N').get('Male');
        expect(gendervalue).toBeDefined();
        let parser: _ContentParser = new _ContentParser(gendervalue.getBytes());
        result = parser._readContent();
        checkCommonInRadioField(result);
        annotation = parsedPage._crossReference._fetch(annotations[3]);
        expect(annotation.get('AS').name).toEqual('Female');
        gendervalue = annotation.get('AP').get('N').get('Female');
        expect(gendervalue).toBeDefined();
        parser = new _ContentParser(gendervalue.getBytes());
        result = parser._readContent();
        checkCommonInRadioField(result);
        annotation = parsedPage._crossReference._fetch(annotations[4]);
        expect(annotation.get('AS').name).toEqual('Off');
        gendervalue = annotation.get('AP').get('N').get('Unspecified');
        expect(gendervalue).toBeDefined();
        parser = new _ContentParser(gendervalue.getBytes());
        result = parser._readContent();
        checkCommonInRadioField(result);
        function checkCommonInRadioField(result: _PdfRecord[]) {
            expect(result[0]._operator).toEqual('cm');
            expect(result[0]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '14.40']);
            expect(result[1]._operator).toEqual('m');
            expect(result[1]._operands).toEqual(['14.400', '-7.200']);
            expect(result[2]._operator).toEqual('c');
            expect(result[2]._operands).toEqual(['14.400', '-11.176', '11.176', '-14.400', '7.200', '-14.400']);
            expect(result[3]._operator).toEqual('c');
            expect(result[3]._operands).toEqual(['3.224', '-14.400', '0.000', '-11.176', '0.000', '-7.200']);
            expect(result[4]._operator).toEqual('c');
            expect(result[4]._operands).toEqual(['0.000', '-3.224', '3.224', '-0.000', '7.200', '0.000']);
            expect(result[5]._operator).toEqual('c');
            expect(result[5]._operands).toEqual(['11.176', '0.000', '14.400', '-3.224', '14.400', '-7.200']);
            expect(result[6]._operator).toEqual('n');
            expect(result[6]._operands.length).toBe(0);
            expect(result[7]._operator).toEqual('m');
            expect(result[7]._operands).toEqual(['13.900', '-7.200']);
            expect(result[8]._operator).toEqual('c');
            expect(result[8]._operands).toEqual(['13.900', '-10.900', '10.900', '-13.900', '7.200', '-13.900']);
            expect(result[9]._operator).toEqual('c');
            expect(result[9]._operands).toEqual(['3.500', '-13.900', '0.500', '-10.900', '0.500', '-7.200']);
            expect(result[10]._operator).toEqual('c');
            expect(result[10]._operands).toEqual(['0.500', '-3.500', '3.500', '-0.500', '7.200', '-0.500']);
            expect(result[11]._operator).toEqual('c');
            expect(result[11]._operands).toEqual(['10.900', '-0.500', '13.900', '-3.500', '13.900', '-7.200']);
            expect(result[12]._operator).toEqual('n');
            expect(result[12]._operands.length).toBe(0);
            expect(result[13]._operator).toEqual('CS');
            expect(result[13]._operands).toEqual(['/DeviceRGB']);
            expect(result[14]._operator).toEqual('cs');
            expect(result[14]._operands).toEqual(['/DeviceRGB']);
            expect(result[15]._operator).toEqual('rg');
            expect(result[15]._operands).toEqual(['0.000', '0.000', '0.000']);
            expect(result[16]._operator).toEqual('m');
            expect(result[16]._operands).toEqual(['10.550', '-7.200']);
            expect(result[17]._operator).toEqual('c');
            expect(result[17]._operands).toEqual(['10.550', '-9.050', '9.050', '-10.550', '7.200', '-10.550']);
            expect(result[18]._operator).toEqual('c');
            expect(result[18]._operands).toEqual(['5.350', '-10.550', '3.850', '-9.050', '3.850', '-7.200']);
            expect(result[19]._operator).toEqual('c');
            expect(result[19]._operands).toEqual(['3.850', '-5.350', '5.350', '-3.850', '7.200', '-3.850']);
            expect(result[20]._operator).toEqual('c');
            expect(result[20]._operands).toEqual(['9.050', '-3.850', '10.550', '-5.350', '10.550', '-7.200']);
            expect(result[21]._operator).toEqual('h');
            expect(result[21]._operands.length).toBe(0);
            expect(result[22]._operator).toEqual('f');
            expect(result[22]._operands.length).toBe(0);
        }
        annotation = parsedPage._crossReference._fetch(annotations[7]);
        let checkbox = annotation.get('AP').get('N').get('On');
        expect(checkbox).toBeDefined();
        parser = new _ContentParser(checkbox.getBytes());
        result = parser._readContent();
        expect(result[0]._operator).toEqual('q');
        expect(result[0]._operands.length).toBe(0);
        expect(result[1]._operator).toEqual('re');
        expect(result[1]._operands).toEqual(['1', '1', '11.4862', '12.16']);
        expect(result[2]._operator).toEqual('W');
        expect(result[2]._operands.length).toBe(0);
        expect(result[3]._operator).toEqual('n');
        expect(result[3]._operands.length).toBe(0);
        expect(result[4]._operator).toEqual('BT');
        expect(result[4]._operands.length).toBe(0);
        expect(result[5]._operator).toEqual('Tf');
        expect(result[5]._operands[1]).toEqual('12');
        expect(result[6]._operator).toEqual('Td');
        expect(result[6]._operands).toEqual(['1.6672', '3.0181']);
        expect(result[7]._operator).toEqual('TL');
        expect(result[7]._operands).toEqual(['11.556']);
        expect(result[8]._operator).toEqual('Tj');
        expect(result[8]._operands).toEqual(['(4)']);
        expect(result[9]._operator).toEqual('ET');
        expect(result[9]._operands.length).toBe(0);
        expect(result[10]._operator).toEqual('Q');
        expect(result[10]._operands.length).toBe(0);
    });
});
function getAnnotationRecords(ref: any, parsedPage: PdfPage): _PdfRecord[] {
    let annotation = parsedPage._crossReference._fetch(ref);
    let appearance = annotation.get('AP').get('N');
    let parser: _ContentParser = new _ContentParser(appearance.getBytes());
    return parser._readContent();
}
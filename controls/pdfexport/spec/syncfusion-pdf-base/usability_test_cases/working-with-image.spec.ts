import { PdfDocument, PdfPage, PdfGraphicsState, PdfBitmap, PdfStringFormat } from './../../../src/index';
import { RectangleF, PointF, SizeF, PdfSection, PdfGrid, PdfGridRow, PdfWordWrapType } from './../../../src/index';
import { PdfPen, PdfTextAlignment, PdfGridCellStyle } from './../../../src/index';
import { PdfColor, PdfSolidBrush, PdfGridBeginCellDrawEventArgs } from './../../../src/index';
import  { PdfGridBeginPageLayoutEventArgs, PdfGridEndPageLayoutEventArgs } from './../../../src/index';
import  { PdfVerticalAlignment, PdfGridEndCellDrawEventArgs } from './../../../src/index';
import { Utils } from './../utils.spec';
describe('UTC-01: DrawImage(overload-2)', () => {
    it('-DrawImage(overload-2)', (done) => {
        let fileReader : FileReader;
        let text: string;
        fileReader = new FileReader();
        fileReader.onload = (): void => {
           text = fileReader.result as string;
        }
        let sampleText : string = '';
        //Create a new PDF document.
        let document : PdfDocument = new PdfDocument();
        //Add a page.
        let page1 : PdfPage = document.pages.add();

        let logo : string = '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';
        let image : PdfBitmap = new PdfBitmap(logo);

        page1.graphics.drawImage(image, 0, 0, 100, 100);
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_image_01.pdf');
            }
            let reader: FileReader = new FileReader();
            reader.readAsArrayBuffer(xlBlob.blobData);
            reader.onload = (): void => {
                if (reader.readyState == 2) { // DONE == 2
                    expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
                    done();
                }
            }
        });
        document.destroy();
    })
});
describe('UTC-02: DrawImage(overload-1)', () => {
    it('-DrawImage(overload-1)', (done) => {
        let fileReader : FileReader;
        let text: string;
        fileReader = new FileReader();
        fileReader.onload = (): void => {
           text = fileReader.result as string;
        }
        let sampleText : string = '';
        //Create a new PDF document.
        let document : PdfDocument = new PdfDocument();
        //Add a page.
        let page1 : PdfPage = document.pages.add();

        let logo : string = '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';
        let image : PdfBitmap = new PdfBitmap(logo);

        page1.graphics.drawImage(image, 0, 110);
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_image_02.pdf');
            }
            let reader: FileReader = new FileReader();
            reader.readAsArrayBuffer(xlBlob.blobData);
            reader.onload = (): void => {
                if (reader.readyState == 2) { // DONE == 2
                    expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
                    done();
                }
            }
        });
        document.destroy();
    })
});
describe('UTC-03: image rotation', () => {
    it('-image rotation', (done) => {
        let fileReader : FileReader;
        let text: string;
        fileReader = new FileReader();
        fileReader.onload = (): void => {
           text = fileReader.result as string;
        }
        let sampleText : string = '';
        //Create a new PDF document.
        let document : PdfDocument = new PdfDocument();
        //Add a page.
        let page1 : PdfPage = document.pages.add();

        let logo : string = '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';
        let image : PdfBitmap = new PdfBitmap(logo);
        // draw the image
        page1.graphics.drawImage(image, 0, 0, 200, 100);

        // set RotateTransform with 25 degree of angle
        page1.graphics.rotateTransform(25);
        // draw the image after RotateTransformation
        page1.graphics.drawImage(image, 150, 200, 200, 100);
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_image_03.pdf');
            }
            let reader: FileReader = new FileReader();
            reader.readAsArrayBuffer(xlBlob.blobData);
            reader.onload = (): void => {
                if (reader.readyState == 2) { // DONE == 2
                    expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
                    done();
                }
            }
        });
        document.destroy();
    })
});
describe('UTC-04: image clipping', () => {
    it('-image clipping', (done) => {
        let fileReader : FileReader;
        let text: string;
        fileReader = new FileReader();
        fileReader.onload = (): void => {
           text = fileReader.result as string;
        }
        let sampleText : string = '';
        //Create a new PDF document.
        let document : PdfDocument = new PdfDocument();
        //Add a page.
        let page1 : PdfPage = document.pages.add();

        let logo : string = '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';
        let image : PdfBitmap = new PdfBitmap(logo);

        // draw the image
        page1.graphics.drawImage(image, 0, 0, 200, 100);
        // set clipping with rectangle bounds
        page1.graphics.setClip(new RectangleF(10, 200, 80, 80));
        // draw the image after clipping
        page1.graphics.drawImage(image, 10, 200, 200, 100);
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_image_04.pdf');
            }
            let reader: FileReader = new FileReader();
            reader.readAsArrayBuffer(xlBlob.blobData);
            reader.onload = (): void => {
                if (reader.readyState == 2) { // DONE == 2
                    expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
                    done();
                }
            }
        });
        document.destroy();
    })
});
describe('UTC-05: image with graphics state', () => {
    it('-image with graphics states', (done) => {
        let fileReader : FileReader;
        let text: string;
        fileReader = new FileReader();
        fileReader.onload = (): void => {
           text = fileReader.result as string;
        }
        let sampleText : string = '';
        //Create a new PDF document.
        let document : PdfDocument = new PdfDocument();
        //Add a page.
        let page1 : PdfPage = document.pages.add();

        let logo : string = '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';
        let image : PdfBitmap = new PdfBitmap(logo);

        // draw the image
        page1.graphics.drawImage(image, 0, 0, 200, 100);

        // save the graphics state
        let state1 : PdfGraphicsState = page1.graphics.save();
        // set clipping with rectangle bounds
        page1.graphics.setClip(new RectangleF(250, 20, 50, 50));
        // draw the image after clipping
        page1.graphics.drawImage(image, 250, 0, 200, 100);
        // restore the graphics state
        page1.graphics.restore(state1);

        // draw the text after clipping
        page1.graphics.drawImage(image, 0, 200, 200, 100);

        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_image_05.pdf');
            }
            let reader: FileReader = new FileReader();
            reader.readAsArrayBuffer(xlBlob.blobData);
            reader.onload = (): void => {
                if (reader.readyState == 2) { // DONE == 2
                    expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
                    done();
                }
            }
        });
        document.destroy();
    })
});
describe('UTC-06: Fix - Image stream redundancy', () => {
    it('-Fix - Image stream redundancy', (done) => {
        //Create a new PDF document.
        let document : PdfDocument = new PdfDocument();
        let section1 : PdfSection = document.sections.add() as PdfSection;
        //Add a page.
        let page1 : PdfPage = section1.pages.add();
        let page2 : PdfPage = section1.pages.add();
        let section2 : PdfSection = document.sections.add() as PdfSection;
        //Add a page.
        let page3 : PdfPage = section2.pages.add();
        let page4 : PdfPage = section2.pages.add();

        let logo : string = '/9j/4AAQSkZJRgABAQEAkACQAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCABiAGADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD8aQ+R+GKVjkAUwDFOPyNX60fmrJU5FPVcN+FV/PFOSUr1zTuTyjmXAP1zSE5r+nf4Q/8ABIv9nzxh8LPCl/J8L/AMNzf6PZzTvNocMokkaFCzE8HJJJ/wrrx/wRU+BMf+q+FPwqk4zi40WOLP4hGH61+VYfxNeKjKWFwU5qLs7Tpp/c5Jn2c+D3Tt7SvFXXaX6I/lYQbR+NP3gV/VRJ/wRn+CtiMt8A/hxcrjOYtJtG/Q4P6V+HH/AAUs/wCCN3xv+Bnxl+KfjXTfhBqmkfCSx1bUNTsLyyeCS0sNMErujFEkLxIseOGUYHGK+g4c4xeZ15UK2FnQ5Ve8+Wz1tZNN6nm5pw/LCU1UhUVS/wDLfTzdz4fbG2on6U0z5XvTC+RX2bkjwFFht96QgfWmlsUBs1kaakp4pZDkUmcmkduMVVyRoOKeDkd/xqOlzilcD+wz4BNj4D+C/wDsBWP/AKTpXqPh29ea1WJoJUVI1ZZTgpJkkYHOcjHcdCPfHlPwHkx8B/Bf/YCsf/SdK76w8MahJEl9p2uXdq8qrm2njW4tCRkfcOHXPGdrqOOnJz/KHAs75rXX91/+lI/bc3jbCwfmvyOv0+Zre6iCMVDSKCAeDk88V4l/wWD/AOUWfx//AOxG1T/0nevRrqfWrzZYzpLp7SPGy6np0kbiMiRDgpKpI3DI+6wxnkHFeJf8FcvDXiSz/wCCYnx2dvE8V1Zx+C9TaSGbS08yWP7NLlN6uuDymG28bOQc1+wYb+NH1X5nytf+HL0Z/I8eKYz/ADU9ulRY+av04+AFzmgcGjOKQHNAFgYFI5yaQEEUGmyLMGXbSU4/OfwprNtNSFmf2AfAmX/ixHgv/sBWP/pOlel6V4pbRLFI73T76G2jjVhdqgkhKkE5IUllx3yuOQc9cfAX/BI7/grX8Pf25vhTo3hKOVPDPxE8OabFa3egXcwLXqQxhTcWr8eahC5Zcb05yMYdvp/4I/trfCX43eMtV8MeDfijpX/CW6DfTaVqOhXFypuIbmGR4pAIJCHx5gOChwcCv5b4MyrFYPOsXSxcHGcVs+zlv6O2j2P2jM8ZRrYKjOjJNP8ARbHtOqeK7SbRJrm0ngu/slzHFKI5ATG4lUFW9CPQ814x/wAFcPFkd9/wSz+PMflyK0ngXUwOQR/x7tW98fvHmh/B/wCHd34x8ZpoGhaRpPkGTxAL1YbW3R5441EjPt2qxcDklc45zivAf+Civ7Wfwz+M3/BMf43ReE/HXhjxHJP4H1IINO1CO53H7M3AKEiv1rCwk6kZJaXR8viJxUJJvWzP5b15WjZRGcrS1+lnwD3GNFk/hQsZAp9BOKCiPdil3ZppXdQPlOKAHq2DSE5NJXR/CD4S+Ifj38VPD/gnwlp39reJ/FN9Fpul2X2iK3+1XEh2onmSssa5PdmAHc0A2krsyPCnizU/AviSx1nRdQvdJ1bTJ1ubS9tJmhntpVOVdHUgqwPQg1N4l8eax4t8eah4o1DULifX9Vv5NTur4NslkuZJDI8uVxhi5LcYwTxXZ/Gb9lHxX8BNE+3+IL/4czoLv7C9vofxE8Pa/eRS4YkPbWF7PMijYwLsgVTgEgsAfNWGRXJB0KsvbU7N7XXbe1/xOqcKtNezmmvJ/cfRGo/8FUPjz4j/AGYNe+D2vfEHVfE/gHxFBDBPY61tvpoFinjnj8q4kBmTDxL8u/bjI218+k5pg+alHynFb06cIfArXMalSUn7zuSJ0paarbVpwORWhi9wpGbFLSMuTQMg3ZNKDtNAiwaXZxU6mlkL5lfRf/BINs/8FUP2fP8AsetM/wDRwr5xNdl+zt8d9a/Zf+PPg/4jeHLbS7zXvBGrQaxYQalHJJaSzQtuVZVjdHKE9QrqfcUPYicOaDiuqf5Hp3/Cr/gr4o/az8MaN4a8V/EPxhJr/wAQ7fTda0/X/B1toFsLWa+EcwjubbVruR2+baP3cZwS25SAp+gvDfwj+A3jD/goD+0d4Gk+DMVj8PvgX4Z8b39hDaeKNUGr6xPprj7O89xJcPEuxkcRiOAAI4EouHXzG+X9Z/bA06XxRpfiDQPgb8JfBnibSdftvEUeqaTe+JJ5JZ4ZxP5bx3mr3EPlu4G4CMNj7rLVXw/+2r408PfG34wfECDTvDDa78a9N13S9che3nNpaxauzNcm2UTB0Zdx8su7gfxB6+RjgsbDCU6NO6lGnUXZc7hBQ9UmpWvqtz6qeLwk8XUrVLNSqU358inJzv5tON7b7Ho/hLTvh7oP7HetftFa38KPDOr3PiTxuvgPw14Fh1bWLfw3orQ2EV3dXs7/AG06jOzK6LHGL1FVnlZiyhIx7N+zH+yN8H/2m/j5+yb4uk8Dy+HvBfxp1fXfDvizwXbatfvZW95pFqjvNYXMsrXawTrNFJskuJGSRZF3lMKPkb4C/tS658CvhlrvgW78M+DPiJ8PvEtxDqF74Z8U29y1pFfw8RX1vPaT293bXCoXjLQzoHjdlkVxgDr9B/4KMeP/AAp+0V8NviDo2heCNEtPg9by2vg7wfZ2t0PD2jpMki3B2NcNcyyzPI0kk01w8rvt3OVRFXpq4fGqf7u+8ba6JKCUk+7crtb73umrHFGvhHT9617Svpq22+Vp9Ely3/wtfabPKPij4/0H4keKjd+GfBWmeBNGtI/scFjaX95fSXKo7bbi5luZpN1yylQ5hWGElMpDHkisGM4GKg0yzNpbENjczFzjpk1ZxzXvYOE4UYxqb219TzMZOnOvOVJWi27enQUjbSUZorpOJ7jEwwpdo9ahHJxR3pXNHFjzHg9aQxZpU6Ub6YXaGldlLGeaRjk06JctQNktLSZxSFwDQZWFZtppA+aRzk0gODQWPopN9KDmgl7lZPvj6Up/1lFFZmw9Pu0yiirIe4VJBRRTCWwk/wB/8KZRRQIkooooAKenSiigD//Z';
        let image : PdfBitmap = new PdfBitmap(logo);

        let sync : string = '/9j/4AAQSkZJRgABAQEAkACQAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAGRAXcDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD+f+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoorpvhT8Ppfib4ws9IgK/aL6aO2hVmChpJHCLkngDLDmlKSinKWyHGLk+WO7OZor9B/B3/BBT4garGjahPomm7gDl7vzsf98mvUfCX/Bv0luV/tfxdp5/vfZLM5/DeK+ExXibwxQ0li4v/DeX5Jo+vw/AOf1vhwzXrZfmz8p6K9e/bS+CMHwA+OGveGbdzNFo1/LZpMQA0yIxCsQOMkCvIa+2w2Ip4ijGvSd4ySa9Gro+Ur0J0asqNRWlFtP1QUUUVsZBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFdh8DNfPhn4iWN6ud1rKk4x6o6v/7LXH1reCZ/s/ia1PYkr+YNTKKlFxezHGTi1JH9Lng6/GqeEtMuFO4T2kUmR3ygNaVeEfs6ftTeCtP/AGbfBl5rfinR7CaXSoTIs9wAykDHI60nif8A4KX/AAW8MBs+NbC+K9RZgyn+lfwHV4ZzSeKqUaGHnLlk1pGT2dux/ZlPPsvjh4Va1aEbpPWSW69T8wv+C2fhL/hHv2vtfcKdl0Le7VucEyRgn9TXxhX2j/wVz/aK8GftLfE2LXPCVxczQrZpBO08AiLSKQBt7kYHWvi6v7Y4NhXhkWEp4qLjOMIpp6NNK2v3H8o8UyoyzfETw8lKDm2mttXcKKKK+mPACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigArqfh18Htd+Kc7RaJp97qNwAWENpbPPIwHU7UBOB61y1fuF/wAGZ/wj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Ngkg7tGf/rV6p46/aVSyhdbBUgToJ5uCfoK+XNO1SfSp/MgkMbdDjvSX2ozalNvmkaRj3JoA7fxj8arrXLlmEktzIf8AlrKeB9BXFajq1xqsu+eVpD2yeB9KrUUAFFFFABT4IjcTog6uwUfjTK2fA+kvqWuxNtzHAd7n0x0/WgD9Zv8AghB8KhpPg3xV4okj2m4aPTrdsdUHzP8A+PKte4/8FYPiR/wr/wDY18QQo5W511o9OjAP3ldgJB/3wWpn/BJxtCt/2O9Dt9Hvra6uA7zahHGwL2878srDseK+ff8AgvP8VBY2HhPwykvESy6pKoPQgFBn86/k2NOec+I9qido1L2f8tNaffy/if0g5wyrga8HrKnuu9T/ACv+B+U3i28+3eIbl+wfaPoOKzaV23uT6nNJX9ZH83ktpMILqN2XcqsCR617n4R+Okdn8PLuwthGm/LNJnDoD1yP5V4PSg4oA+svgt4qeP4YanJA2ZLYmeMtzgMoxx+BqPxn8Rr6z8HeG9UkuNksxkkmCHYsgVgOfauG+CnjS20jwFqEFxIym+tlSPCk/MpYfhXBePfiTc3NudJy7xWoMabmyEBwTtFAFH4seMYfGWu/aIsE7nZiPu846flXKUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUATWNr9uvI4QQvmMFye1fQXwC+FNjq1wVmZDBagM8WfmmPqfavngHBruvhv8AFS40HUId07wzRn93MD19j6igD6i+HXj/AMX/ALF/xEj8VeDLqQ2JIW8s3JaG4izzHIvceh6g4IIIFcT/AMFIv2rB+1T8RH8SQ20thbS2cFrHau2TCwUb+fc12Xw5+KFp49sfIn8tLzbh4z92Ueo/wrgfjv8AB6x0+1a7i8sW07YaBjyjHuleU8kwLzBZp7Ne2UXHm62dt++2nbU9JZti1gnl/O/ZNqXL5rt28z5koq74g0saNq0turb1Q8GqVeqeaFFFFAE0WoTwRbEmkRM52hiBUTMWbJ5J7mkooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigDqvAvxEm8P3USyyuFRgY5QfmiP8AhXW/FL4zXWtW8RluVuJxGFjC/dX/AGiPWvKKKAHTTNPKzuSzMcknuabRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAf//Z';
        let image2 : PdfBitmap = new PdfBitmap(sync);

        page1.graphics.drawImage(image, 0, 0, 100, 100);
        page1.graphics.drawImage(image2, 0, 110, 100, 100);
        page1.graphics.drawImage(image, 0, 220, 100, 100);

        page2.graphics.drawImage(image2, 0, 0, 100, 100);
        page2.graphics.drawImage(image, 0, 110, 100, 100);
        page2.graphics.drawImage(image2, 0, 220, 100, 100);

        page3.graphics.drawImage(image, 0, 0, 100, 100);
        page3.graphics.drawImage(image2, 0, 110, 100, 100);
        page3.graphics.drawImage(image, 0, 220, 100, 100);

        page4.graphics.drawImage(image2, 0, 0, 100, 100);
        page4.graphics.drawImage(image, 0, 110, 100, 100);
        page4.graphics.drawImage(image2, 0, 220, 100, 100);
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_image_06.pdf');
            }
            let reader: FileReader = new FileReader();
            reader.readAsArrayBuffer(xlBlob.blobData);
            reader.onload = (): void => {
                if (reader.readyState == 2) { // DONE == 2
                    expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
                    done();
                }
            }
        });
        document.destroy();
    })
});
// describe('UTC-07: draw grid with images', () => {
//     let document : PdfDocument = new PdfDocument()
//     let page : PdfPage = document.pages.add();
//     let pdfGrid : PdfGrid = new PdfGrid();
//     //Add three columns.
//     pdfGrid.columns.add(5);
//     //Add header.
//     pdfGrid.headers.add(1);
//     let pdfGridHeader1 : PdfGridRow = pdfGrid.headers.getHeader(0);
//     pdfGridHeader1.cells.getCell(0).value = 'ID';
//     pdfGridHeader1.cells.getCell(1).value = 'Company name';
//     pdfGridHeader1.cells.getCell(2).value = 'Employee';
//     pdfGridHeader1.cells.getCell(3).value = 'Salary';
//     pdfGridHeader1.cells.getCell(4).value = 'Company address';
//     //Add rows.
//     for (let i : number = 0 ; i < 10; i++) {
//         let pdfGridRow1 : PdfGridRow = pdfGrid.rows.addRow();
//         pdfGridRow1.cells.getCell(0).value = 'E' + (i + 1);
//         pdfGridRow1.cells.getCell(1).value = 'Syncfusion Software Private Limited';
//         if (i % 3 == 0) {
//             pdfGridRow1.cells.getCell(2).value = 'Clay Hero';
//             pdfGridRow1.cells.getCell(3).value = '$15,000';
//         } else if (i % 3 == 1) {
//             pdfGridRow1.cells.getCell(2).value = 'John';
//             pdfGridRow1.cells.getCell(3).value = '$15,000';
//         } else {
//             pdfGridRow1.cells.getCell(2).value = 'David';
//             pdfGridRow1.cells.getCell(3).value = '$15,000';
//         }
//         let logo : string = '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';
//         let image : PdfBitmap = new PdfBitmap(logo);
//         image.size = new SizeF(100, 100);
//         if (i == 2) {
//             pdfGridRow1.cells.getCell(3).value = image;
//         }
//         pdfGridRow1.cells.getCell(4).value = 'Eymard Complex, AJ217, 4th Avenue, Anna Nagar, Chennai -40.';
//         let stringFormat : PdfStringFormat = new PdfStringFormat();
//         stringFormat.wordWrap = PdfWordWrapType.None;
//         pdfGridRow1.cells.getCell(4).style.stringFormat = stringFormat;
//     }
//     //Drawing a grid.
//     pdfGrid.draw(page, new PointF(0, 10));

//     // save the PDF
//     document.save('utc_working_with_image_07.pdf');
// });
describe('UTC-08: draw image with transparency', () => {
    it('-draw image with transparency', (done) => {
        let document : PdfDocument = new PdfDocument();
        // add a page to the document
        let page1 : PdfPage = document.pages.add();
        // apply transparency to 100%
        page1.graphics.setTransparency(1);
        // draw the text and rectangle
        let logo : string = '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';
        let image : PdfBitmap = new PdfBitmap(logo);
        page1.graphics.drawImage(image, 20, 150, 40, 40);

        // apply transparency to 80%
        page1.graphics.setTransparency(0.8);
        page1.graphics.drawImage(image, 110, 150, 40, 40);

        // apply transparency to 60%
        page1.graphics.setTransparency(0.6);
        page1.graphics.drawImage(image, 190, 150, 40, 40);

        // apply transparency to 40%
        page1.graphics.setTransparency(0.4);
        page1.graphics.drawImage(image, 280, 150, 40, 40);

        // apply transparency to 20%
        page1.graphics.setTransparency(0.2);
        page1.graphics.drawImage(image, 370, 150, 40, 40);

        // apply transparency to 5%
        page1.graphics.setTransparency(0.05);
        page1.graphics.drawImage(image, 460, 150, 40, 40);
        // save the PDF
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_image_08.pdf');
            }
            let reader: FileReader = new FileReader();
            reader.readAsArrayBuffer(xlBlob.blobData);
            reader.onload = (): void => {
                if (reader.readyState == 2) { // DONE == 2
                    expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
                    done();
                }
            }
        });
        document.destroy();
    })
});
function tableBeginCellDraw(sender : PdfGrid, args : PdfGridBeginCellDrawEventArgs) : void {
    if (args.cellIndex == 2) {
        if (args.value == 'Profit') {
            args.style.backgroundBrush = new PdfSolidBrush(new PdfColor(100, 255, 100));
        } else if (args.value == 'Loss') {
            args.style.backgroundBrush = new PdfSolidBrush(new PdfColor(255, 100, 100));
        }
    }
}
function table_BeginCellDraw(sender : PdfGrid, args : PdfGridBeginCellDrawEventArgs) : void {
    if (args.rowIndex === 0) {
        args.graphics.drawRectangle(new PdfPen(new PdfColor(255, 0, 0), 2), args.bounds.x, args.bounds.y, args.bounds.width, args.bounds.height);
    }
    if (args.rowIndex === 1) {
        if (args.cellIndex === 1) {
            let cellStyle : PdfGridCellStyle = new PdfGridCellStyle();
            let format1 : PdfStringFormat = new PdfStringFormat();
            format1.alignment = PdfTextAlignment.Justify;
            format1.lineAlignment = PdfVerticalAlignment.Middle;
            cellStyle.stringFormat = format1;
            cellStyle.backgroundBrush = new PdfSolidBrush(new PdfColor(220,250,250));
            args.style = cellStyle;
        }
    }
    if (args.cellIndex === 1) {
        let cellStyle : PdfGridCellStyle = new PdfGridCellStyle();
        let format1 : PdfStringFormat = new PdfStringFormat();
        format1.alignment = PdfTextAlignment.Center;
        cellStyle.stringFormat = format1;
        cellStyle.textBrush = new PdfSolidBrush(new PdfColor(0, 0, 128));
        args.style = cellStyle;
    }
}
function table_EndCellDraw(sender : PdfGrid, args : PdfGridEndCellDrawEventArgs) : void {
    if (args.rowIndex === 1) {
        args.graphics.drawRectangle(new PdfPen(new PdfSolidBrush(new PdfColor(0, 128, 0)), 2), args.bounds.x, args.bounds.y, args.bounds.width, args.bounds.height);
    }
}
//Begin Page Layout Event Handler
function beginPageLayout2(sender : PdfGrid, e : PdfGridBeginPageLayoutEventArgs) : void {
    sender.rows.getRow(sender.rows.count - 1).height = 50;
}
function endPageLayout2(sender : PdfGrid, e : PdfGridEndPageLayoutEventArgs) : void {
    e.nextPage = e.result.page;
}
describe('UTC-05: table events', () => {
    it('-table events', (done) => {
        let fileReader : FileReader;
        let text: string;
        fileReader = new FileReader();
        fileReader.onload = (): void => {
           text = fileReader.result as string;
        }
        let sampleText : string = '';
        // create a new PDF document
        let document : PdfDocument = new PdfDocument();
        // add a pages to the document
        let page : PdfPage = document.pages.add();
        // create a PdfGrid
        let pdfGrid : PdfGrid = new PdfGrid();
        pdfGrid.beginCellDraw = tableBeginCellDraw;
        pdfGrid.endCellDraw = table_EndCellDraw;
        // add two columns
        pdfGrid.columns.add(3);
        // add header
        pdfGrid.headers.add(1);
        let pdfGridHeader : PdfGridRow = pdfGrid.headers.getHeader(0);
        pdfGridHeader.cells.getCell(0).value = 'Income';
        pdfGridHeader.cells.getCell(1).value = 'Expenditure';
        pdfGridHeader.cells.getCell(2).value = 'Result';
        // add rows
        let value11 : number = 10000;
        let value12 : number = 20000;
        let value21 : number = 20000;
        let value22 : number = 10000;
        let pdfGridRow1 : PdfGridRow = pdfGrid.rows.addRow();
        pdfGridRow1.cells.getCell(0).value = value11.toString();
        pdfGridRow1.cells.getCell(1).value = value12.toString();
        pdfGridRow1.cells.getCell(2).value = (value11 > value12) ? 'Profit' : 'Loss';
        let pdfGridRow2 : PdfGridRow = pdfGrid.rows.addRow();
        pdfGridRow2.cells.getCell(0).value = value21.toString();
        pdfGridRow2.cells.getCell(1).value = value22.toString();
        pdfGridRow2.cells.getCell(2).value = (value21 > value22) ? 'Profit' : 'Loss';
        pdfGrid.beginPageLayout = beginPageLayout2;
        pdfGrid.endPageLayout = endPageLayout2;
        pdfGrid.draw(page, new PointF(10, 20));

        // save the PDF
        //Save the document.
        document.save().then((xlBlob: { blobData: Blob }) => {
            if (Utils.isDownloadEnabled) {
                Utils.download(xlBlob.blobData, 'utc_working_with_image_05.pdf');
            }
            let reader: FileReader = new FileReader();
            reader.readAsArrayBuffer(xlBlob.blobData);
            reader.onload = (): void => {
                if (reader.readyState == 2) { // DONE == 2
                    expect((reader.result as ArrayBuffer).byteLength).toBeGreaterThanOrEqual(0);
                    done();
                }
            }
        });
        document.destroy();
    })
});
export const EXPORT_STYLES: string = `
html {
    height: auto;
    margin: 0;
}

body {
    margin: 0;
    color: #333;
    word-wrap: break-word;
}

.e-content {
    min-height: 100px;
    outline: 0 solid transparent;
    padding: 16px;
    position: relative;
    overflow-x: auto;
    font-weight: normal;
    line-height: 1.5;
    font-size: 14px;
    text-align: inherit;
    font-family: "Roboto", "Segoe UI", "GeezaPro", "DejaVu Serif", "sans-serif", "-apple-system", "BlinkMacSystemFont";
}

p {
   margin-top: 0;
    margin-right: 0;
    margin-bottom: 10px;
    margin-left: 0;
}

h1 {
    font-size: 2.857em;
    font-weight: 600;
    line-height: 1.2;
    margin-top: 10px;
    margin-right: 0;
    margin-bottom: 10px;
    margin-left: 0;
}

h2 {
    font-size: 2.285em;
    font-weight: 600;
    line-height: 1.2;
    margin-top: 10px;
    margin-right: 0;
    margin-bottom: 10px;
    margin-left: 0;
}

h3 {
    font-size: 2em;
    font-weight: 600;
    line-height: 1.2;
    margin-top: 10px;
    margin-right: 0;
    margin-bottom: 10px;
    margin-left: 0;
}

h4 {
    font-size: 1.714em;
    font-weight: 600;
    line-height: 1.2;
    margin-top: 10px;
    margin-right: 0;
    margin-bottom: 10px;
    margin-left: 0;
}

h5 {
    font-size: 1.428em;
    font-weight: 600;
    line-height: 1.2;
    margin-top: 10px;
    margin-right: 0;
    margin-bottom: 10px;
    margin-left: 0;
}

h6 {
    font-size: 1.142em;
    font-weight: 600;
    line-height: 1.5;
    margin-top: 10px;
    margin-right: 0;
    margin-bottom: 10px;
    margin-left: 0;
}

blockquote {
    margin-top: 10px;
    margin-right: 0;
    margin-bottom: 10px;
    margin-left: 0;
    padding-left: 12px;
    border-left: 2px solid #5c5c5c;
}

pre {
    border: 0;
    border-radius: 0;
    color: #333;
    font-size: inherit;
    line-height: inherit;
    margin-top: 0;
    margin-right: 0;
    margin-bottom: 10px;
    margin-left: 0;
    overflow: visible;
    padding: 0;
    white-space: pre-wrap;
    word-break: inherit;
    word-wrap: break-word;
}

code {
    background-color: #9d9d9d26;
    color: #ed484c;
}

strong {
    font-weight: bold;
}

b {
    font-weight: bold;
}

a {
    text-decoration: none;
    user-select: auto;
}

li {
    margin-bottom: 10px;
}

li ol {
    margin-block-start: 10px;
}

li ul {
    margin-block-start: 10px;
}

ul {
    list-style-type: disc;
}

ul ul {
    list-style-type: circle;
}

ol ul {
    list-style-type: circle;
}

ul ul ul {
    list-style-type: square;
}

ol ul ul {
    list-style-type: square;
}

ul ol ul {
    list-style-type: square;
}

ol ol ul {
    list-style-type: square;
}

table {
    margin-bottom: 10px;
    border-collapse: collapse;
}

th {
    background-color: rgba(157, 157, 157, .15);
    border: 1px solid #BDBDBD;
    height: 20px;
    min-width: 20px;
    padding: 2px 5px;
}

td {
    border: 1px solid #BDBDBD;
    height: 20px;
    min-width: 20px;
    padding: 2px 5px;
}

.e-rte-image {
    border: 0;
    cursor: pointer;
    display: block;
    float: none;
    margin: auto;
    max-width: 100%;
    position: relative;
}

.e-rte-audio {
    border: 0;
    cursor: pointer;
    display: block;
    float: none;
    margin: auto;
    max-width: 100%;
    position: relative;
}

.e-rte-video {
    border: 0;
    cursor: pointer;
    display: block;
    float: none;
    margin: auto;
    max-width: 100%;
    position: relative;
}

.e-imginline {
    margin-left: 5px;
    margin-right: 5px;
    display: inline-block;
    float: none;
    max-width: 100%;
    padding: 1px;
    vertical-align: bottom;
}

.e-audio-inline {
    margin-left: 5px;
    margin-right: 5px;
    display: inline-block;
    float: none;
    max-width: 100%;
    padding: 1px;
    vertical-align: bottom;
}

.e-video-inline {
    margin-left: 5px;
    margin-right: 5px;
    display: inline-block;
    float: none;
    max-width: 100%;
    padding: 1px;
    vertical-align: bottom;
}

.e-imgcenter {
    cursor: pointer;
    display: block;
    float: none;
    margin-top: 5px;
    margin-right: auto;
    margin-bottom: 5px;
    margin-left: auto;
    max-width: 100%;
    position: relative;
}

.e-video-center {
    cursor: pointer;
    display: block;
    float: none;
    margin-top: 5px;
    margin-right: auto;
    margin-bottom: 5px;
    margin-left: auto;
    max-width: 100%;
    position: relative;
}

.e-imgright {
    float: right;
    margin-top: 0;
    margin-right: auto;
    margin-bottom: 0;
    margin-left: auto;
    margin-left: 5px;
    text-align: right;
}

.e-video-right {
    float: right;
    margin-top: 0;
    margin-right: auto;
    margin-bottom: 0;
    margin-left: auto;
    margin-left: 5px;
    text-align: right;
}

.e-imgleft {
    float: left;
    margin-top: 0;
    margin-right: auto;
    margin-bottom: 0;
    margin-left: auto;
    margin-right: 5px;
    text-align: left;
}

.e-video-left {
    float: left;
    margin-top: 0;
    margin-right: auto;
    margin-bottom: 0;
    margin-left: auto;
    margin-right: 5px;
    text-align: left;
}

.e-rte-img-caption {
    display: inline-block;
    margin-top: 5px;
    margin-right: auto;
    margin-bottom: 5px;
    margin-left: auto;
    max-width: 100%;
    position: relative;
}

.e-caption-inline {
    display: inline-block;
    margin-top: 5px;
    margin-right: auto;
    margin-bottom: 5px;
    margin-left: auto;
    margin-left: 5px;
    margin-right: 5px;
    max-width: calc(100% - (2 * 5px));
    position: relative;
    text-align: center;
    vertical-align: bottom;
}

.e-img-wrap {
    display: inline-block;
    margin: auto;
    padding: 0;
    text-align: center;
    width: 100%;
}

.e-imgbreak {
    border: 0;
    cursor: pointer;
    display: block;
    float: none;
    margin-top: 5px;
    margin-right: auto;
    margin-bottom: 5px;
    margin-left: auto;
    max-width: 100%;
    position: relative;
}

.e-audio-break {
    border: 0;
    cursor: pointer;
    display: block;
    float: none;
    margin-top: 5px;
    margin-right: auto;
    margin-bottom: 5px;
    margin-left: auto;
    max-width: 100%;
    position: relative;
}

.e-video-break {
    border: 0;
    cursor: pointer;
    display: block;
    float: none;
    margin-top: 5px;
    margin-right: auto;
    margin-bottom: 5px;
    margin-left: auto;
    max-width: 100%;
    position: relative;
}
`;

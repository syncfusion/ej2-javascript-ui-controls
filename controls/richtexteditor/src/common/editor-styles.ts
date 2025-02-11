export const IFRAME_EDITOR_STYLES: string = `
@charset "UTF-8";

* {
    box-sizing: border-box;
}

html {
    height: auto;
}

html, body {
    margin: 0;
}

body {
    color: #333;
    word-wrap: break-word;
}

.e-content {
    background: unset;
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

.e-content p {
    margin: 0 0 10px;
    margin-bottom: 10px;
}

.e-content h1 {
    font-size: 2.857em;
    font-weight: 600;
    line-height: 1.2;
    margin: 10px 0;
}

.e-content h2 {
    font-size: 2.285em;
    font-weight: 600;
    line-height: 1.2;
    margin: 10px 0;
}

.e-content h3 {
    font-size: 2em;
    font-weight: 600;
    line-height: 1.2;
    margin: 10px 0;
}

.e-content h4 {
    font-size: 1.714em;
    font-weight: 600;
    line-height: 1.2;
    margin: 10px 0;
}

.e-content h5 {
    font-size: 1.428em;
    font-weight: 600;
    line-height: 1.2;
    margin: 10px 0;
}

.e-content h6 {
    font-size: 1.142em;
    font-weight: 600;
    line-height: 1.5;
    margin: 10px 0;
}

.e-content blockquote {
    margin: 10px 0;
    padding-left: 12px;
    border-left: 2px solid #5c5c5c;
}

.e-rtl.e-content blockquote {
    padding-left: 0;
    padding-right: 12px;
}

.e-content pre {
    border: 0;
    border-radius: 0;
    color: #333;
    font-size: inherit;
    line-height: inherit;
    margin: 0 0 10px;
    overflow: visible;
    padding: 0;
    white-space: pre-wrap;
    word-break: inherit;
    word-wrap: break-word;
}

.e-content code {
    background: #9d9d9d26;
    color: #ed484c;
}

.e-content strong,
.e-content b {
    font-weight: bold;
}

.e-content a {
    text-decoration: none;
    user-select: auto;
}

.e-content a:hover {
    text-decoration: underline;
}

.e-content li {
    margin-bottom: 10px;
}

.e-content li ol,
.e-content li ul {
    margin-block-start: 10px;
}

.e-content ul {
    list-style-type: disc;
}

.e-content ul ul,
.e-content ol ul {
    list-style-type: circle;
}

.e-content ul ul ul,
.e-content ol ul ul,
.e-content ul ol ul,
.e-content ol ol ul {
    list-style-type: square;
}

.e-content p:last-child,
.e-content pre:last-child,
.e-content blockquote:last-child {
    margin-bottom: 0;
}

.e-content h3 + h4,
.e-content h4 + h5,
.e-content h5 + h6 {
    margin-top: 0.6em;
}

.e-content ul:last-child {
    margin-bottom: 0;
}

.e-content table {
    margin-bottom: 10px;
    border-collapse: collapse;
    empty-cells: show;
}

.e-content table.e-cell-select {
    position: relative;
}

.e-content table.e-cell-select::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 2px solid #4a90e2;
    pointer-events: none;
}

table .e-cell-select {
    border: 1px double #4a90e2 !important;
}

.e-content table.e-rte-table th {
    background-color: #E0E0E0;
}

.e-rte-table td,
.e-rte-table th {
    border: 1px solid #BDBDBD;
    height: 20px;
    min-width: 20px;
    padding: 2px 5px;
}

.e-rte-table td.e-cell-select.e-multi-cells-select,
.e-rte-table th.e-cell-select.e-multi-cells-select {
    position: relative;
}

.e-rte-table td.e-cell-select.e-multi-cells-select::after,
.e-rte-table th.e-cell-select.e-multi-cells-select::after {
    background-color: rgba(13, 110, 253, 0.08);
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    bottom: 0;
    pointer-events: none;
    right: 0;
}

table td.e-multi-cells-select ::selection,
table th.e-multi-cells-select ::selection {
    background-color: transparent;
}

td.e-multi-cells-select,
th.e-multi-cells-select {
    user-select: none !important;
}

.e-rte-table.e-dashed-border td,
.e-rte-table.e-dashed-border th {
    border-style: dashed;
}

.e-rte-table.e-alternate-border tbody tr:nth-child(2n) {
    background-color: #F5F5F5;
}

.e-rte-image,
.e-rte-audio,
.e-rte-video  {
    border: 0;
    cursor: pointer;
    display: block;
    float: none;
    margin: auto;
    max-width: 100%;
    position: relative;
}

.e-rte-image.e-imginline,
.e-rte-audio.e-audio-inline,
.e-rte-video.e-video-inline {
    margin-left: 5px;
    margin-right: 5px;
    display: inline-block;
    float: none;
    max-width: 100%;
    padding: 1px;
    vertical-align: bottom;
}

.e-rte-image.e-imgcenter,
.e-rte-video.e-video-center {
    cursor: pointer;
    display: block;
    float: none;
    margin: 5px auto;
    max-width: 100%;
    position: relative;
}

.e-rte-image.e-imgright,
.e-rte-video.e-video-right {
    float: right;
    margin: 0 auto;
    margin-left: 5px;
    text-align: right;
}

.e-rte-image.e-imgleft,
.e-rte-video.e-video-left {
    float: left;
    margin: 0 auto;
    margin-right: 5px;
    text-align: left;
}

.e-rte-img-caption {
    display: inline-block;
    margin: 5px auto;
    max-width: 100%;
    position: relative;
}

.e-rte-img-caption.e-caption-inline {
    display: inline-block;
    margin: 5px auto;
    margin-left: 5px;
    margin-right: 5px;
    max-width: calc(100% - (2 * 5px));
    position: relative;
    text-align: center;
    vertical-align: bottom;
}

.e-rte-img-caption.e-imgcenter {
    display: contents;
    margin-left: auto;
    margin-right: auto;
}

.e-rte-img-caption.e-imgright {
    display: contents;
    margin-left: auto;
    margin-right: 0;
}

.e-rte-img-caption.e-imgleft {
    display: contents;
    margin-left: 0;
    margin-right: auto;
}

.e-img-caption.e-rte-img-caption.e-imgbreak {
    display: contents;
}

.e-rte-img-caption .e-img-inner {
    display: block;
    font-size: 16px;
    font-weight: initial;
    margin: auto;
    opacity: .9;
    position: relative;
    text-align: center;
    width: 100%;
}

.e-img-wrap {
    display: inline-block;
    margin: auto;
    padding: 0;
    text-align: center;
    width: 100%;
}

.e-imgleft,
.e-video-left {
    float: left;
    margin: 0 5px 0 0;
    text-align: left;
}

.e-imgright,
.e-video-right {
    float: right;
    margin: 0 0 0 5px;
    text-align: right;
}

.e-imgcenter,
.e-video-center {
    cursor: pointer;
    display: block;
    float: none;
    height: auto;
    margin: 5px auto;
    max-width: 100%;
    position: relative;
}

.e-control img:not(.e-resize) {
    border: 2px solid transparent;
    z-index: 1000
}

.e-imginline,
.e-audio-inline,
.e-video-inline {
    display: inline-block;
    float: none;
    margin-left: 5px;
    margin-right: 5px;
    vertical-align: bottom;
}

.e-imgbreak,
.e-audio-break,
.e-video-break {
    border: 0;
    cursor: pointer;
    display: block;
    float: none;
    margin: 5px auto;
    max-width: 100%;
    position: relative;
}

.e-rte-image.e-img-focus:not(.e-resize),
.e-audio-focus:not(.e-resize),
.e-video-focus:not(.e-resize) {
    border: solid 2px #4a90e2;
}

img.e-img-focus::selection,
audio.e-audio-focus::selection,
.e-video-focus::selection {
    background: transparent;
    color: transparent;
}

span.e-rte-imageboxmark,
span.e-rte-videoboxmark {
    width: 10px;
    height: 10px;
    position: absolute;
    display: block;
    background: #4a90e2;
    border: 1px solid #fff;
    z-index: 1000;
}

.e-mob-rte.e-mob-span span.e-rte-imageboxmark,
.e-mob-rte.e-mob-span span.e-rte-videoboxmark {
    background: #4a90e2;
    border: 1px solid #fff;
}

.e-mob-rte span.e-rte-imageboxmark,
.e-mob-rte span.e-rte-videoboxmark {
    background: #fff;
    border: 1px solid #4a90e2;
    border-radius: 15px;
    height: 20px;
    width: 20px;
}

.e-mob-rte.e-mob-span span.e-rte-imageboxmark,
.e-mob-rte.e-mob-span span.e-rte-videoboxmark {
    background: #4a90e2;
    border: 1px solid #fff;
}

.e-content img.e-resize,
.e-content video.e-resize {
    z-index: 1000;
}

.e-img-caption .e-img-inner {
    outline: 0;
}

.e-rte-img-caption.e-imgleft .e-img-inner {
    float: left;
    text-align: left;
}

.e-rte-img-caption.e-imgright .e-img-inner {
    float: right;
    text-align: right;
}

.e-rte-img-caption.e-imgleft .e-img-wrap,
.e-rte-img-caption.e-imgright .e-img-wrap {
    display: contents;
}

.e-img-caption a:focus-visible {
    outline: none;
}

.e-rte-img-caption .e-rte-image.e-imgright {
    margin-left: auto;
    margin-right: 0;
}

.e-rte-img-caption .e-rte-image.e-imgleft {
    margin: 0;
}

span.e-table-box {
    cursor: nwse-resize;
    display: block;
    height: 10px;
    position: absolute;
    width: 10px;
    background-color: #ffffff;
    border: 1px solid #BDBDBD;
}

span.e-table-box.e-rmob {
    height: 14px;
    width: 14px;
    background-color: #BDBDBD;
    border: 1px solid #BDBDBD;
}

.e-row-resize,
.e-column-resize {
    background-color: transparent;
    background-repeat: repeat;
    bottom: 0;
    cursor: col-resize;
    height: 1px;
    overflow: visible;
    position: absolute;
    width: 1px;
}

.e-row-resize {
    cursor: row-resize;
    height: 1px;
}

.e-table-rhelper {
    cursor: col-resize;
    opacity: .87;
    position: absolute;
}

.e-table-rhelper.e-column-helper {
    width: 1px;
}

.e-table-rhelper.e-row-helper {
    height: 1px;
}

.e-reicon::before {
    border-bottom: 6px solid transparent;
    border-right: 6px solid;
    border-top: 6px solid transparent;
    content: '';
    display: block;
    height: 0;
    position: absolute;
    right: 4px;
    top: 4px;
    width: 20px;
}

.e-reicon::after {
    border-bottom: 6px solid transparent;
    border-left: 6px solid;
    border-top: 6px solid transparent;
    content: '';
    display: block;
    height: 0;
    left: 4px;
    position: absolute;
    top: 4px;
    width: 20px;
    z-index: 3;
}

.e-row-helper.e-reicon::after {
    top: 10px;
    transform: rotate(90deg);
}

.e-row-helper.e-reicon::before {
    left: 4px;
    top: -20px;
    transform: rotate(90deg);
}


.e-table-rhelper {
    background-color: #4a90e2;
}

.e-rtl {
    direction: rtl;
}

.e-rte-placeholder::before {
    content: attr(placeholder);
    opacity: 0.54;
    overflow: hidden;
    padding-top: 16px;
    position: absolute;
    text-align: start;
    top: 0;
    z-index: 1;
}

.e-resize-enabled,
.e-count-enabled {
    padding-bottom: 0px;
}
`;

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
.e-rte-checklist > li:not(.e-rte-checklist-hidden) {
    list-style: none;
    position: relative;
}
.e-rte-checklist > li::before {
    content: '';
    position: absolute;
    top: 2px;
    box-sizing: content-box;
    left: -25px;
    width: 16px;
    height: 16px;
    border-radius: 2px;
    cursor: pointer;
}
.e-rte-checklist li.e-rte-checklist-checked::after {
    border-style: solid;
    border-width: 0 calc(16px / 8) calc(16px / 8) 0;
    box-sizing: content-box;
    content: '';
    display: block;
    height: 8px;
    width: 4px;
    left: -19px;
    position: absolute;
    top: 4.5px;
    transform: rotate(45deg);
    cursor: pointer;
}
.e-rtl {
    .e-rte-checklist li.e-rte-checklist-checked::after {
        right: -19px;
    }
    .e-rte-checklist > li::before {
        right: -25px;
    }
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

.e-content hr {
    margin: 10px 0;
    border: 2px solid rgba(176, 179, 184, 1);
}

.e-content hr:hover {
    cursor: default;
}

hr.e-rte-hr-focus {
    outline: 2px solid rgba(33, 150, 243, .3);
    outline-offset: 3px;
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
    border-spacing: 0;
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
    border: 2px double #4a90e2;
    pointer-events: none;
}

table .e-cell-select {
    border: 1px double #4a90e2 !important;
}

.e-content table.e-rte-table th {
    background-color: rgba(157, 157, 157, .15);
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

.e-rte-table.e-dashed-border > tbody > tr > td,
.e-rte-table.e-dashed-border > tbody > tr > th {
    border-style: dashed;
}

.e-rte-table.e-alternate-border > tbody > tr:nth-child(2n),
.e-rte-table.e-alternate-border > tbody > tr:nth-child(2n) > td,
.e-rte-table.e-alternate-border > tbody > tr:nth-child(2n) > th {
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

.e-content {
    .e-clickelem::after {
        left: 0;
        right: 0;
        z-index: 1;
    }
    .e-clickelem::before {
        left: 0;
        right: 0;
        z-index: 1;
    }
    .e-clickelem::before {
        bottom: 70%;
        top: 0;
    }
    .e-clickelem::after {
        bottom: 0;
        top: 70%;
    }

    .e-audio-wrap {
        display: inline-block;
    }

    .e-clickelem {
        display: block;
        margin: 0;
        outline: none;
        padding: 0;
        position: relative;
    }

    .e-clickelem::after {
        background: transparent;
        content: '';
        cursor: default;
        display: block;
        position: absolute;
    }

    .e-clickelem::before {
        background: transparent;
        content: '';
        cursor: default;
        display: block;
        position: absolute;
    }
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

.e-rte-table-resize.e-tb-col-insert,
.e-rte-table-resize.e-tb-row-insert {
  position: absolute;
  background-color: transparent;
  text-align: center;
  -webkit-box-align: center;
      -ms-flex-align: center;
          align-items: center;
  -webkit-box-pack: center;
      -ms-flex-pack: center;
          justify-content: center;
  opacity: 0;
  color: #0F6CBD;
}

.e-rte-table-resize.e-tb-col-insert {
  width: 26px;
  height: 22px;
}

.e-rte-table-resize.e-tb-row-insert {
  width: 22px;
  height: 26px;
}

.e-rte-table-resize.e-tb-row-insert.e-insert-cell-rtl {
  right: 2px;
}

.e-rte-table-resize.e-tb-col-insert .e-icons.e-circle-add,
.e-rte-table-resize.e-tb-row-insert .e-icons.e-circle-add {
  font-size: 16px;
  line-height: 16px;
  border: 1px;
  position: absolute;
}

.e-rte-table-resize.e-tb-col-insert .e-icons.e-circle-add {
  top: -1px;
  left: 5px;
}

.e-rte-table-resize.e-tb-row-insert .e-icons.e-circle-add {
  top: 5.5px;
  left: -0.8px;
}

.e-rte-table-resize.e-tb-row-insert .e-icons.e-circle-add.e-insert-cell-rtl {
  left: 7px;
}

.e-rte-table-resize.e-tb-col-insert .e-icons.e-circle,
.e-rte-table-resize.e-tb-row-insert .e-icons.e-circle {
  font-size: 8px;
  line-height: 8px;
  border: 1px;
  position: absolute;
}

.e-rte-table-resize.e-tb-row-insert .e-icons.e-circle {
  top: 9px;
  left: 4px;
}

.e-rte-table-resize.e-tb-col-insert .e-icons.e-circle {
  top: 4px;
  left: 9px;
}

.e-rte-table-resize.e-tb-row-insert .e-icons.e-circle.e-insert-cell-rtl {
  left: 10px;
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

.e-icons.e-circle::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  background-image: url('data:image/svg+xml,%3Csvg%20width%3D%228%22%20height%3D%228%22%20viewBox%3D%220%200%208%208%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%20%20%3Cg%20clip-path%3D%22url(%23clip0_circle_8)%22%3E%0A%20%20%20%20%3Crect%20width%3D%228%22%20height%3D%228%22%20fill%3D%22black%22%20fill-opacity%3D%220.01%22%2F%3E%0A%20%20%20%20%3Cpath%20d%3D%22M3.82767%200.571429L3.64626%200.589569L3.47392%200.60771L3.14739%200.680273L2.98413%200.725627L2.82086%200.780047L2.51247%200.907027L2.22222%201.07029L1.95011%201.25837L1.82313%201.35147L1.69615%201.46032L1.46032%201.69615L1.35147%201.82313L1.25837%201.95011L1.07029%202.22222L0.907027%202.51247L0.780047%202.82086L0.725627%202.98413L0.680273%203.14739L0.60771%203.47392L0.589569%203.64626L0.571429%203.82767V4.17233L0.589569%204.35374L0.60771%204.52608L0.680273%204.85261L0.725627%205.01587L0.780047%205.17914L0.907027%205.48753L1.07029%205.77778L1.25837%206.04989L1.35147%206.17687L1.46032%206.30385L1.69615%206.53968L1.82313%206.64853L1.95011%206.74163L2.22222%206.92971L2.51247%207.09297L2.82086%207.21995L2.98413%207.27437L3.14739%207.31973L3.47392%207.39229L3.64626%207.41043L3.82767%207.42857H4.17233L4.35374%207.41043L4.52608%207.39229L4.85261%207.31973L5.01587%207.27437L5.17914%207.21995L5.48753%207.09297L5.77778%206.92971L6.04989%206.74163L6.17687%206.64853L6.30385%206.53968L6.53968%206.30385L6.64853%206.17687L6.74163%206.04989L6.92971%205.77778L7.09297%205.48753L7.21995%205.17914L7.27437%205.01587L7.31973%204.85261L7.39229%204.52608L7.41043%204.35374L7.42857%204.17233V3.82767L7.41043%203.64626L7.39229%203.47392L7.31973%203.14739L7.27437%202.98413L7.21995%202.82086L7.09297%202.51247L6.92971%202.22222L6.74163%201.95011L6.64853%201.82313L6.53968%201.69615L6.30385%201.46032L6.17687%201.35147L6.04989%201.25837L5.77778%201.07029L5.48753%200.907027L5.17914%200.780047L5.01587%200.725627L4.85261%200.680273L4.52608%200.60771L4.35374%200.589569L4.17233%200.571429H3.82767ZM4%200L4.20862%200.00907027L4.41149%200.0181405L4.60771%200.0453515L4.80392%200.0816327L4.9977%200.126984L5.18821%200.181405L5.37869%200.244898L5.56009%200.317461L5.73242%200.390023L5.90476%200.480726L6.07709%200.580499L6.24036%200.680273L6.39456%200.798187L6.53968%200.916102L6.82993%201.17007L6.95691%201.30612L7.08389%201.45125L7.31973%201.75964L7.41953%201.9229L7.51934%202.0951L7.61014%202.26757L7.68254%202.43991L7.75514%202.62131L7.81859%202.81179L7.87301%203.0056L7.8844%203.19274L7.95467%203.39229L7.98186%203.5885L7.99093%203.79138L8%204L7.99093%204.20862L7.98186%204.41149L7.95467%204.60771L7.8844%204.80392L7.87301%204.9977L7.81859%205.18821L7.75514%205.37869L7.68254%205.56009L7.61014%205.73242L7.51934%205.90476L7.41953%206.07709L7.31973%206.24036L7.08389%206.54875L6.95691%206.69388L6.82993%206.82993L6.69388%206.95691L6.54875%207.08389L6.24036%207.31973L6.07709%207.41953L5.90476%207.51934L5.73242%207.61014L5.56009%207.68254L5.37869%207.75514L5.18821%207.81859L4.9977%207.87301L4.80392%207.8844L4.60771%207.95467L4.41149%207.98186L4.20862%207.99093L4%208L3.79138%207.99093L3.5885%207.98186L3.39229%207.95467L3.19274%207.8844L3.0056%207.87301L2.81179%207.81859L2.62131%207.75514L2.43991%207.68254L2.26757%207.61014L2.0951%207.51934L1.9229%207.41953L1.75964%207.31973L1.45125%207.08389L1.30612%206.95691L1.17007%206.82993L0.916102%206.53968L0.798187%206.39456L0.680273%206.24036L0.580499%206.07709L0.480726%205.90476L0.390023%205.73242L0.317461%205.56009L0.244898%205.37869L0.181405%205.18821L0.126984%204.9977L0.0816327%204.80392L0.0453515%204.60771L0.0181405%204.41149L0.00907027%204.20862L0%204L0.00907027%203.79138L0.0181405%203.5885L0.0453515%203.39229L0.0816327%203.19274L0.126984%203.0056L0.181405%202.81179L0.244898%202.62131L0.317461%202.43991L0.390023%202.26757L0.480726%202.0951L0.580499%201.9229L0.680273%201.75964L0.798187%201.60544L0.916102%201.46032L1.17007%201.17007L1.30612%201.04309L1.45125%200.916102L1.75964%200.680273L1.9229%200.580499L2.0951%200.480726L2.26757%200.390023L2.43991%200.317461L2.62131%200.244898L2.81179%200.181405L3.0056%200.126984L3.19274%200.0816327L3.39229%200.0453515L3.5885%200.0181405L3.79138%200.00907027L4%200Z%22%20fill%3D%22%230F6CBD%22%2F%3E%0A%20%20%3C%2Fg%3E%0A%20%20%3Cdefs%3E%0A%20%20%20%20%3CclipPath%20id%3D%22clip0_circle_8%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%228%22%20height%3D%228%22%20fill%3D%22white%22%2F%3E%0A%20%20%20%20%3C%2FclipPath%3E%0A%20%20%3C%2Fdefs%3E%0A%3C%2Fsvg%3E');
}

.e-icons.e-circle-add::before {
  content: '';
  display: inline-block;
  width: 16px;
  height: 16px;
  background-image: url('data:image/svg+xml,%3Csvg%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Cg%20clip-path%3D%22url(%23clip0_1124_24361)%22%3E%0A%3Crect%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22black%22%20fill-opacity%3D%220.01%22%2F%3E%0A%3Cpath%20d%3D%22M8.10169%204.27119L8.20339%204.30508L8.30508%204.35593L8.44068%204.49153L8.49153%204.59322L8.52542%204.69492L8.54237%204.79661V7.45763H11.2034L11.3051%207.47458L11.4068%207.50847L11.5085%207.55932L11.6441%207.69492L11.6949%207.79661L11.7288%207.89831V8.10169L11.6949%208.20339L11.6441%208.30508L11.5085%208.44068L11.4068%208.49153L11.3051%208.52542L11.2034%208.54237H8.54237V11.2034L8.52542%2011.3051L8.49153%2011.4068L8.44068%2011.5085L8.30508%2011.6441L8.20339%2011.6949L8.10169%2011.7288H7.89831L7.79661%2011.6949L7.69492%2011.6441L7.55932%2011.5085L7.50847%2011.4068L7.47458%2011.3051L7.45763%2011.2034V8.54237H4.79661L4.69492%208.52542L4.59322%208.49153L4.49153%208.44068L4.35593%208.30508L4.30508%208.20339L4.27119%208.10169V7.89831L4.30508%207.79661L4.35593%207.69492L4.49153%207.55932L4.59322%207.50847L4.69492%207.47458L4.79661%207.45763H7.45763V4.79661L7.47458%204.69492L7.50847%204.59322L7.55932%204.49153L7.69492%204.35593L7.79661%204.30508L7.89831%204.27119H8.10169ZM8%201.05085L7.64407%201.0678L7.28814%201.10169L6.94915%201.13559L6.59322%201.20339L6.27119%201.27119L5.9322%201.37288L5.61017%201.47458L5.30508%201.61017L4.98305%201.74576L4.69492%201.89831L4.11864%202.23729L3.84746%202.44068L3.59322%202.64407L3.08475%203.08475L2.64407%203.59322L2.44068%203.84746L2.23729%204.11864L1.89831%204.69492L1.74576%204.98305L1.61017%205.30508L1.47458%205.61017L1.37288%205.9322L1.27119%206.27119L1.20339%206.59322L1.13559%206.94915L1.10169%207.28814L1.0678%207.64407L1.05085%208L1.0678%208.35593L1.10169%208.71186L1.13559%209.05085L1.20339%209.40678L1.27119%209.72881L1.37288%2010.0678L1.47458%2010.3898L1.61017%2010.6949L1.74576%2011.0169L1.89831%2011.3051L2.23729%2011.8814L2.44068%2012.1525L2.64407%2012.4068L3.08475%2012.9153L3.59322%2013.3559L3.84746%2013.5593L4.11864%2013.7627L4.69492%2014.1017L4.98305%2014.2542L5.30508%2014.3898L5.61017%2014.5254L5.9322%2014.6271L6.27119%2014.7288L6.59322%2014.7966L6.94915%2014.8644L7.28814%2014.8983L7.64407%2014.9322L8%2014.9492L8.35593%2014.9322L8.71186%2014.8983L9.05085%2014.8644L9.40678%2014.7966L9.72881%2014.7288L10.0678%2014.6271L10.3898%2014.5254L10.6949%2014.3898L11.0169%2014.2542L11.3051%2014.1017L11.8814%2013.7627L12.1525%2013.5593L12.4068%2013.3559L12.9153%2012.9153L13.3559%2012.4068L13.5593%2012.1525L13.7627%2011.8814L14.1017%2011.3051L14.2542%2011.0169L14.3898%2010.6949L14.5254%2010.3898L14.6271%2010.0678L14.7288%209.72881L14.7966%209.40678L14.8644%209.05085L14.8983%208.71186L14.9322%208.35593L14.9492%208L14.9322%207.64407L14.8983%207.28814L14.8644%206.94915L14.7966%206.59322L14.7288%206.27119L14.6271%205.9322L14.5254%205.61017L14.3898%205.30508L14.2542%204.98305L14.1017%204.69492L13.7627%204.11864L13.5593%203.84746L13.3559%203.59322L12.9153%203.08475L12.4068%202.64407L12.1525%202.44068L11.8814%202.23729L11.3051%201.89831L11.0169%201.74576L10.6949%201.61017L10.3898%201.47458L10.0678%201.37288L9.72881%201.27119L9.40678%201.20339L9.05085%201.13559L8.71186%201.10169L8.35593%201.0678L8%201.05085ZM8.40678%200L8.81356%200.0338983L9.22034%200.0847458L9.61017%200.152542L10%200.237288L10.7458%200.474576L11.1186%200.627119L11.4746%200.779661L12.1525%201.15254L12.4746%201.35593L12.7966%201.57627L13.1017%201.81356L13.3898%202.0678L13.9322%202.61017L14.1864%202.89831L14.4237%203.20339L14.6441%203.52542L14.8475%203.84746L15.2203%204.52542L15.3729%204.88136L15.5254%205.25424L15.6441%205.61017L15.7627%206L15.8475%206.38983L15.9153%206.77966L15.9661%207.18644L16%207.59322V8.40678L15.9661%208.81356L15.9153%209.22034L15.8475%209.61017L15.7627%2010L15.6441%2010.3898L15.5254%2010.7458L15.3729%2011.1186L15.2203%2011.4746L14.8475%2012.1525L14.6441%2012.4746L14.4237%2012.7966L14.1864%2013.1017L13.9322%2013.3898L13.3898%2013.9322L13.1017%2014.1864L12.7966%2014.4237L12.4746%2014.6441L12.1525%2014.8475L11.4746%2015.2203L11.1186%2015.3729L10.7458%2015.5254L10%2015.7627L9.61017%2015.8475L9.22034%2015.9153L8.81356%2015.9661L8.40678%2016H7.59322L7.18644%2015.9661L6.77966%2015.9153L6.38983%2015.8475L6%2015.7627L5.25424%2015.5254L4.88136%2015.3729L4.52542%2015.2203L3.84746%2014.8475L3.52542%2014.6441L3.20339%2014.4237L2.89831%2014.1864L2.61017%2013.9322L2.0678%2013.3898L1.81356%2013.1017L1.57627%2012.7966L1.35593%2012.4746L1.15254%2012.1525L0.779661%2011.4746L0.627119%2011.1186L0.474576%2010.7458L0.237288%2010L0.152542%209.61017L0.0847458%209.22034L0.0338983%208.81356L0%208.40678V7.59322L0.0338983%207.18644L0.0847458%206.77966L0.152542%206.38983L0.237288%206L0.474576%205.25424L0.627119%204.88136L0.779661%204.52542L1.15254%203.84746L1.35593%203.52542L1.57627%203.20339L1.81356%202.89831L2.0678%202.61017L2.61017%202.0678L2.89831%201.81356L3.20339%201.57627L3.52542%201.35593L3.84746%201.15254L4.52542%200.779661L4.88136%200.627119L5.25424%200.474576L6%200.237288L6.38983%200.152542L6.77966%200.0847458L7.18644%200.0338983L7.59322%200H8.40678Z%22%20fill%3D%22%230F6CBD%22%2F%3E%0A%3C%2Fg%3E%0A%3Cdefs%3E%0A%3CclipPath%20id%3D%22clip0_1124_24361%22%3E%0A%3Crect%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22white%22%2F%3E%0A%3C%2FclipPath%3E%0A%3C%2Fdefs%3E%0A%3C%2Fsvg%3E%20%20%0A');
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
    background-color: #0F6CBD;
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
pre[data-language] {
    font-family: Space Mono;
    border-radius: 6px;
    padding: 20px 16px 16px;
    position: relative;
}
pre[data-language] code{
    background: none;
    color: #645454;
}
pre[data-language]::before {
    content: attr(data-language);
    font-family: 'Helvetica Neue';
    font-weight: 500;
    font-size: 12px;
    line-height: 18px;
    right: 8px;
    padding: 2px 4px;
    top: -1px;
    border-radius: 0px 0px 4px 4px;
    position: absolute;
}
`;

export const IFRAME_EDITOR_LIGHT_THEME_STYLES: string = `
pre[data-language] {
    background-color: rgba(157, 157, 157, 0.08);
    color: rgba(46, 46, 46, 1);
    border: 1px solid rgba(229, 231, 235, 1);
}
pre[data-language]::before {
    background-color: rgba(105, 105, 105, 1);
    color: rgba(249, 250, 251, 1);
}
.e-rte-checklist > li::before {
   border: 1px solid rgba(97, 97, 97, 1);
}
.e-rte-checklist li.e-rte-checklist-checked::before {
  background: rgba(15, 108, 189, 1);
  border: 1px solid rgba(15, 108, 189, 1);
}
.e-rte-checklist li.e-rte-checklist-checked::after {
  border-color: rgba(255, 255, 255, 1);
}
`;

export const IFRAME_EDITOR_DARK_THEME_STYLES: string = `
pre[data-language] {
    background-color: rgba(157, 157, 157, 0.08);
    color: rgba(245, 245, 245, 1);
    border: 1px solid rgba(40, 47, 60, 1);
}
pre[data-language]::before {
    background-color: rgba(189, 186, 186, 1);
    color: rgba(29, 36, 50, 1);
}
.e-rte-checklist > li::before {
   border: 1px solid rgba(173, 173, 173, 1);
}
.e-rte-checklist li.e-rte-checklist-checked::before {
  background: rgba(17, 94, 163, 1);
  border: 1px solid rgba(17, 94, 163, 1);
}
.e-rte-checklist li.e-rte-checklist-checked::after {
  border-color: rgba(255, 255, 255, 1);
}
`;


import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import $ from "jquery";
import MarkdownIt from "markdown-it";

import closeImg from "../icons/icons8-delete-50.png";

const PrevewDiv = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: white;
  & .preview-close {
    position: absolute;
    right: 0;
    top: 0;
    & > img {
      width: 22px;
      padding: 5px 8px;
      cursor: pointer;
      &:hover {
        background: gray;
      }
    }
  }
  & #showpreview {
    height: 100%;
    iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
  }
`;

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typography: true,
  breaks: true,
  // highlight: (str, lang) => {
  //   let hl;

  //   try {
  //     hl = Prism.highlight(str, Prism.languages[lang]);
  //   } catch (error) {
  //     hl = md.utils.escapeHtml(str);
  //   }

  //   return `<pre class="language-${lang}"><code class="language-${lang}">${hl}</code></pre>`;
  // },
});

function CreateShow({ title, tags, content }) {
  const iframeRef = useRef();
  useEffect(() => {
    $(iframeRef.current).contents().find("head").append(
      `<meta name="viewport" content="width=device-width, initial-scale=1">
      <script src="https://code.jquery.com/jquery-3.6.0.slim.js" integrity="sha256-HwWONEZrpuoh951cQD1ov2HUK5zA5DwJ1DNUXaM6FsY=" crossorigin="anonymous"></script>
      <link type="text/css" rel="stylesheet" href="http://static.penink.com/github-markdown.css">
      <link type="text/css" rel="stylesheet" href="http://static.penink.com/view.css">`
    );
  }, []);
  useEffect(() => {
    $(iframeRef.current).hide();
    const renderedDocument = md.render(content);
    $(iframeRef.current).contents().find("body").html(`
      <div class="markdown-body title">
        <h1>${title || "标题"}</h1>
        <div class="tags">
          <span>fdsfa</span>
          <span>fdsfa</span>
          <span>fdsfa</span>
        </div>
      </div>
      <article class="markdown-body">
        ${renderedDocument}
      </article>`);
    $(iframeRef.current).show();
  }, [title, tags, content]);

  return (
    <div id="showpreview">
      <iframe ref={iframeRef}></iframe>
    </div>
  );
}

function PreviewCreate({ title, tags, content }, ref) {
  const mountElem = document.getElementById("previewroot");
  const [open, setOpen] = useState(false);
  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
  }));
  const closePreview = (e) => {
    e.stopPropagation();
    setOpen(false);
  };
  return createPortal(
    open ? (
      <PrevewDiv>
        <CreateShow {...{ title, tags, content }} />
        <span className="preview-close" onClick={closePreview}>
          <img src={closeImg} />
        </span>
      </PrevewDiv>
    ) : null,
    mountElem
  );
}

export default forwardRef(PreviewCreate);

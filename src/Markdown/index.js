import { useEffect, useRef } from "react";
import styled from "styled-components";
import $ from "jquery";

const MarkdownViewDiv = styled.div`
  & textarea,
  & .textarea {
    outline: none;
    width: 100%;
    box-sizing: border-box;
    padding: 5px 10px;
    resize: vertical;
    border: none;
    height: auto;
    min-height: 100vh;
    line-height: 1.2;
    font-size: 1rem;
    resize: none;
    overflow: hidden;
  }
`;

export default function MarkdownView({ content, setContent }) {
  const textRef = useRef(null);
  useEffect(() => {
    autoGrowTextarea();
    const c = $(textRef.current);
    c.on("input", autoGrowTextarea);
    return () => {
      c.off("input", autoGrowTextarea);
    };
  }, []);
  function autoGrowTextarea() {
    var scroll_height = $(textRef.current).get(0).scrollHeight;
    $(textRef.current).css("height", scroll_height + "px");
  }
  // useEffect(() => {
  //   $(textRef.current).text(content);
  //   $(textRef.current).on("keydown", (e) => {
  //     if (e.key === "Enter") {
  //       document.execCommand("insertHTML", false, "\r\n");
  //       // prevent the default behaviour of return key pressed
  //       return false;
  //     }
  //   });
  // }, []);
  return (
    <MarkdownViewDiv id="editor">
      <textarea
        className="textarea"
        id="md-textarea"
        // contentEditable
        ref={textRef}
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
        }}
        // onInput={(e) => {
        //   // console.log('Text inside div', e.currentTarget.textContent)}
        //   setContent(e.currentTarget.textContent);
        // }}
        // dangerouslySetInnerHTML={{ __html: content }}
      />
    </MarkdownViewDiv>
  );
}

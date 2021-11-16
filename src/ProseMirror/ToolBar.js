import { useEffect, useState } from "react";
import { toggleMark, setBlockType, wrapIn } from "prosemirror-commands";
// import { schema } from "prosemirror-markdown";
import { schema } from "prosemirror-schema-basic";

import ListImg from "./icons/icons8-list-50.png";

import styled from "styled-components";

import Emitter from "../utils/emitter";

const ToolBarDiv = styled.div`
  position: relative;
  border-bottom: 1px solid gray;
  margin-bottom: 0px;
  height: 35px;
  overflow: hidden;
  user-select: none;
  flex-basis: 35px;
  flex-grow: 0;
  flex-shrink: 0;
  & > div {
    height: 100%;
    display: flex;
    justify-items: center;
  }

  & span.btn {
    font-size: 2rem;
    padding: 0 5px;
    height: 35px;

    text-align: center;
    display: inline-block;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border-left: 1px solid gray;
    &:hover {
      cursor: pointer;
      background: gray;
      color: #fff;
    }
  }
  & > div.toolbar {
    position: relative;
    flex-direction: column;

    & > div {
      display: flex;
      position: relative;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      display: flex;
      width: 680px;
      background: white;
      box-sizing: border-box;
      margin: 0 auto;
      border-right: 1px solid gray;
      & span.btn {
        font-size: 0.9rem;
        & a {
          text-decoration: none;
          text-decoration-color: inherit;
        }
      }
      & > div.saves {
        border: none;
        display: flex;
        align-items: center;
        /* justify-content: space-around; */
        position: absolute;
        right: -158px;
        /* width: 120px; */
        & span.btn {
          padding: 0 9px;
          border: none;
          border-right: 1px solid gray;
        }
      }

      & .menus {
        display: flex;
        align-items: center;
        justify-content: stretch;
        & > span {
          padding: 0 3px;
          border: 1px solid gray;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          &:hover {
            cursor: pointer;
          }
          & > img {
            width: 25px;
          }
        }
      }
    }
  }
`;

const ToggleMarStrongCmd = toggleMark(schema.marks.strong);
export default function ToolBar({
  saveDraft,
  publishWrite,
  dataId,
  showMyCreate,
  useMarkdown,
  setUseMarkdown,
  children,
}) {
  useEffect(() => {
    Emitter.on("view", view);
    return () => {
      Emitter.off("view", view);
    };

    function view(v) {
      const active = ToggleMarStrongCmd(v.state, null, v);
      console.log({ active });
    }
  });

  function preview() {
    window.open(`/writer/${dataId}`, "_blank");
  }
  return (
    <ToolBarDiv id="toolbar">
      <div style={{ position: "absolute", left: 0, top: 0 }}>
        <span style={{ fontSize: "1.5rem" }}>创作</span>
      </div>
      <div className="toolbar">
        <div>
          {children}
          <div>
            <span
              className="btn"
              onClick={() => {
                setUseMarkdown(true);
              }}
              style={{
                backgroundColor: (useMarkdown && "#8ab4f8") || "",
              }}
            >
              Markdown
            </span>
            <span
              className="btn"
              onClick={() => {
                setUseMarkdown(false);
              }}
              style={{
                backgroundColor: (!useMarkdown && "#8ab4f8") || "",
              }}
            >
              富文本
            </span>
          </div>
          <div className="saves">
            <span className="btn" onClick={preview}>
              预览
            </span>
            <span className="btn" onClick={saveDraft}>
              存草稿
            </span>
            <span className="btn" onClick={publishWrite}>
              发布
            </span>
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          backgroundColor: "white",
        }}
      >
        <span className="btn" onClick={showMyCreate}>
          <img src={ListImg} width="23px" />
        </span>
      </div>
    </ToolBarDiv>
  );
}

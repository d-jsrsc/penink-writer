import { useState } from "react";
import styled from "styled-components";

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
    font-size: 1.2rem;
    padding: 0 10px;
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
      justify-content: end;
      height: 100%;
      display: flex;
      width: 670px;
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
    }
  }
`;

export default function ToolBar({
  saveDraft,
  publishWrite,
  dataId,
  showMyCreate,
  useMarkdown,
  setUseMarkdown,
}) {
  function preview() {
    window.open(`/writer/${dataId}`, "_blank");
  }
  return (
    <ToolBarDiv>
      <div style={{ position: "absolute", left: 0, top: 0 }}>
        <span style={{ fontSize: "1.5rem" }}>创作你的创作</span>
      </div>
      <div className="toolbar">
        <div>
          <div>
            <span
              className="btn"
              onClick={() => {
                setUseMarkdown(true);
              }}
            >
              Markdown
            </span>
            <span
              className="btn"
              onClick={() => {
                setUseMarkdown(false);
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
      <div style={{ position: "absolute", right: 0, top: 0 }}>
        <span className="btn" onClick={showMyCreate}>
          <i className="fa fa-th-list" aria-hidden="true"></i>
        </span>
      </div>
    </ToolBarDiv>
  );
}

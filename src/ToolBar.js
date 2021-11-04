import styled from "styled-components";

const ToolBarDiv = styled.div`
  position: relative;
  border-bottom: 1px solid gray;
  margin-bottom: 20px;
  height: 35px;
  overflow: hidden;
  user-select: none;

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
    flex-direction: column;
    & > div {
      justify-content: end;
      height: 100%;
      display: flex;
      width: 670px;
      margin: 0 auto;
      border-right: 1px solid gray;
      & span.btn {
        font-size: 1rem;
        & a {
          text-decoration: none;
          text-decoration-color: inherit;
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
          <span className="btn" onClick={saveDraft}>
            存草稿
          </span>
          <span className="btn" onClick={publishWrite}>
            发布
          </span>
          {dataId && (
            <span className="btn" onClick={preview}>
              预览
            </span>
          )}
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
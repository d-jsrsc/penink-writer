import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

import { schema } from "./ProseMirror/schema";
import {
  defaultMarkdownParser,
  defaultMarkdownSerializer,
} from "./ProseMirror/markdown/index";
import ReactDOM from "react-dom";
import { EditorState, Plugin, PluginKey } from "prosemirror-state";
import { EditorView } from "prosemirror-view";

import ToolBar from "./ProseMirror/ToolBar";
import MyCreate from "./MyCreate/index";
import Tags, { genId } from "./Tags";
import SpliteLine from "./MyCreate/SplitLine";
import WriteList from "./MyCreate/WriteLists";

import MarkdownMeun from "./Toolbar/MarkdownMeun";
import { setUpPlugins } from "./ProseMirror/Plugins";

import logger from "./utils/logger";

import * as api from "./api/index";
import Emitter, { events } from "./utils/emitter";

import MenusGen from "./ProseMirror/Meuns";
import MarkdownView from "./Markdown/index";
import Preview from "./Preview";

const Layout = styled.div`
  display: flex;
  height: 100%;
  & > div {
    height: 100%;
    overflow-y: scroll;
  }
`;

const ColumnLeft = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;
const ColumnRight = styled.div`
  transition: margin 150ms ease-in-out, transform 100ms ease;
  width: 400px;
  flex-basis: 400px;
  flex-grow: 0;
  flex-shrink: 0;
  /* max-width: 400px; */
  /* flex: 0 0 400px; */
`;
const CreateDiv = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding-top: 20px;
  overflow-y: scroll;

  & > div {
    width: 780px;
    margin: 0 auto;
    &.title {
      margin-bottom: 5px;
      position: relative;
      & > input {
        box-sizing: border-box;
        width: 100%;
        font-size: 25px;
        border: none;
        border-bottom: 1px solid gray;
        font-weight: 600;
      }
    }
    &#writer {
      flex-grow: 1;

      & > #editor {
        min-height: 1000px;
        display: flex;
        align-items: stretch;
      }
      & .ProseMirror-menubar-wrapper,
      & .ProseMirror {
        width: 100%;
        /* & * {
          margin: 0em 0;
          padding: 0;
          line-height: 1.5;
        } */
      }
    }
  }
`;

function App() {
  const previewRef = useRef(null);
  const previewCreate = () => previewRef.current.open();

  const [dataId, setDataId] = useState("");
  const [editorTitle, setEditorTitle] = useState("");
  const [tags, setTags] = useState([]);

  const [width, setWidth] = useState(400);
  const [myCreateShow, setMyCreateShow] = useState(true);

  const [useMarkdown, setUseMarkdown] = useState(false);
  const [content, setContent] = useState("");
  useEffect(() => {
    const target = document.querySelector("#writer");
    if (!useMarkdown) {
      const editorView = new EditorView(target, {
        state: EditorState.create({
          doc: defaultMarkdownParser.parse(content),

          plugins: setUpPlugins({ schema }).concat([
            new Plugin({
              key: new PluginKey("console$"),
              view(edtorView) {
                return {
                  update(view, prevState) {
                    const docContent = defaultMarkdownSerializer.serialize(
                      view.state.doc
                    );
                    setContent(docContent);
                  },
                  destroy() {},
                };
              },
            }),
          ]),
        }),
        dispatchTransaction: (transaction) => {
          console.debug(transaction);
          // const docContent = defaultMarkdownSerializer.serialize(
          //   editorView.state.doc
          // );
          // setContent(docContent);
          const newState = editorView.state.apply(transaction);
          editorView.updateState(newState);
          Emitter.emit(events.ViewStateDispatch, newState);
        },
      });
      const MenusDom = MenusGen(editorView, schema);
      ReactDOM.render(MenusDom, document.getElementById("meuns"));
      return () => {
        logger.debug("destroy");
        editorView.destroy();
      };
    } else {
      ReactDOM.render(
        <MarkdownMeun setContent={setContent} />,
        document.getElementById("meuns")
      );
    }
  }, [useMarkdown]);

  function showMyCreate() {
    setMyCreateShow(!myCreateShow);
  }
  function saveDraft() {
    const data = {
      id: dataId,
      title: editorTitle,
      data: content,
      tags: tags.map((t) => t.value),
      draft: true,
    };
    api
      .saveDraft(data)
      .then((id) => {
        setDataId(id);
        data.id = id;
        Emitter.emit(events.updateSaved, data);
      })
      .catch((err) => console.error(err));
  }
  function publishWrite() {
    const data = {
      id: dataId,
      title: editorTitle,
      data: content,
      tags: tags.map((t) => t.value),
      draft: false,
    };
    api
      .publishWrite(data)
      .then((id) => {
        setDataId(id);
        data.id = id;
        Emitter.emit(events.updateSaved, data);
      })
      .catch((err) => console.error(err));
  }

  return (
    <>
      <Layout>
        <ColumnLeft>
          <ToolBar
            showMyCreate={showMyCreate}
            saveDraft={saveDraft}
            publishWrite={publishWrite}
            dataId={dataId}
            useMarkdown={useMarkdown}
            setUseMarkdown={setUseMarkdown}
            previewCreate={previewCreate}
          >
            <div id="meuns" />
          </ToolBar>
          <CreateDiv>
            <div className="title">
              <input
                placeholder="Title"
                value={editorTitle}
                onChange={(e) => {
                  const titleValue = e.target.value;
                  setEditorTitle(titleValue);
                }}
              ></input>
              <Tags tags={tags} setTags={setTags} />
            </div>
            {/* <div id={EDITTOR_HOLDER_ID} /> */}
            <div id="writer">
              {useMarkdown ? (
                <MarkdownView content={content} setContent={setContent} />
              ) : null}
            </div>
          </CreateDiv>
        </ColumnLeft>
        <ColumnRight
          style={{
            marginRight: myCreateShow ? "0px" : `-${width}px`,
            width: `${width}px`,
            flexBasis: `${width}px`,
          }}
        >
          <MyCreate
            SplitLine={
              <SpliteLine
                diffFunc={(willWidth) => {
                  if (willWidth > 700 || willWidth < 300) return;
                  setWidth(willWidth);
                }}
              />
            }
          >
            <WriteList
              setWriterData={({ id, title, tags, data }) => {
                setDataId(id);
                setEditorTitle(title);
                setContent(data);
                setTags(
                  (tags || []).map((v) => {
                    const id = genId();
                    return {
                      id,
                      value: v,
                    };
                  })
                );
              }}
            ></WriteList>
          </MyCreate>
        </ColumnRight>
      </Layout>
      <Preview
        ref={previewRef}
        title={editorTitle}
        tags={tags}
        content={content}
      />
    </>
  );
}

export default App;

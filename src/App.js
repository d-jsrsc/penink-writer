import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import CheckList from "@editorjs/checklist";
import Marker from "@editorjs/marker";
import Embed from "@editorjs/embed";
import LinkTool from "@editorjs/link";
import Image from "@editorjs/image";
import InlineCode from "@editorjs/inline-code";
import Table from "@editorjs/table";
import List from "@editorjs/list";
import Raw from "@editorjs/raw";

import ToolBar from "./ToolBar";
import MyCreate from "./MyCreate/index";
import SpliteLine from "./MyCreate/SplitLine";
import WriteList from "./MyCreate/WriteLists";

import * as api from "./api";

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
`;
const ColumnRight = styled.div`
  transition: margin 150ms ease-in-out, transform 100ms ease;
  width: 400px;
  /* max-width: 400px; */
  /* flex: 0 0 400px; */
`;
const CreateDiv = styled.div`
  flex: 0 0 1;
  display: flex;
  flex-direction: column;

  & > .title {
    width: 660px;
    margin: 0 auto;
    position: relative;
    & > input {
      width: 100%;
      font-size: 25px;
      border: none;
      border-bottom: 1px solid gray;
      font-weight: 700;
    }
  }
`;

const EDITTOR_HOLDER_ID = "editorjs";
function App() {
  const [dataId, setDataId] = useState("");
  const [editorTitle, setEditorTitle] = useState("");
  const [writerData, setWriterData] = useState({});
  const [reWriterData, setReWriterData] = useState({});
  const [width, setWidth] = useState(400);
  const [myCreateShow, setMyCreateShow] = useState(true);
  const ejInstance = useRef();
  useEffect(() => {
    if (!ejInstance.current) {
      initEditor();
    }
    return () => {
      ejInstance.current.destroy();
      ejInstance.current = null;
    };
  }, []);

  useEffect(() => {
    setWriterData(reWriterData);
    ejInstance.current?.render(reWriterData);
  }, [reWriterData]);

  function showMyCreate() {
    setMyCreateShow(!myCreateShow);
  }
  function saveDraft() {
    api
      .saveDraft({ id: dataId, title: editorTitle, data: writerData })
      .then((id) => setDataId(id))
      .catch((err) => console.error(err));
  }
  function publishWrite() {
    api
      .publishWrite({ id: dataId, title: editorTitle, data: writerData })
      .then((id) => setDataId(id))
      .catch((err) => console.error(err));
  }

  const initEditor = () => {
    const editor = new EditorJS({
      placeholder: "Let`s write an awesome story!",
      holder: EDITTOR_HOLDER_ID,
      logLevel: "ERROR",
      data: writerData,
      onReady: () => {
        ejInstance.current = editor;
        console.log("ready");
      },
      onChange: () => {
        ejInstance.current.saver
          .save()
          .then((data) => {
            setWriterData(data);
          })
          .catch(console.error);
      },
      tools: {
        header: {
          class: Header,
          config: {
            placeholder: "标题",
            levels: [2, 3, 4],
            defaultLevel: 3,
          },
        },
        image: {
          class: Image,
          config: {
            endpoints: {
              byFile: "/api/media/uploadfile", // Your backend file uploader endpoint
              byUrl: "/api/meida/fetchfile", // Your endpoint that provides uploading by Url
            },
            captionPlaceholder: "intro",
          },
        },
        checklist: CheckList,
        linkTool: LinkTool,
        marker: Marker,
        inlineCode: InlineCode,
        embed: {
          class: Embed,
          inlineToolbar: true,
        },
        table: Table,
        list: List,
        raw: Raw,
      },
    });
  };
  return (
    <Layout>
      <ColumnLeft>
        <ToolBar
          showMyCreate={showMyCreate}
          saveDraft={saveDraft}
          publishWrite={publishWrite}
          dataId={dataId}
        ></ToolBar>
        <CreateDiv>
          <div className="title">
            <input
              placeholder="题目"
              value={editorTitle}
              onChange={(e) => {
                const titleValue = e.target.value;
                setEditorTitle(titleValue);
              }}
            ></input>
          </div>
          <div id={EDITTOR_HOLDER_ID} />
        </CreateDiv>
      </ColumnLeft>
      <ColumnRight
        style={{
          marginRight: myCreateShow ? "0px" : `-${width}px`,
          width: `${width}px`,
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
            setWriterData={({ id, title, data }) => {
              setDataId(id);
              setEditorTitle(title);
              setReWriterData(data);
            }}
          ></WriteList>
        </MyCreate>
      </ColumnRight>
    </Layout>
  );
}

export default App;

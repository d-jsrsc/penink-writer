import { useEffect, useState } from "react";
import styled from "styled-components";

import * as api from "../api";
import Emitter, { events } from "../emitter";

const WriteListDiv = styled.div`
  height: calc(100% - 40px);
`;

const Tabs = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid gray;
  height: 30px;
  flex-grow: 1;
  & span {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: 1px solid gray;
    &:last-child {
      border-right: none;
    }
    &:hover {
      cursor: pointer;
    }
    &.select {
      color: #fff;
      background: gray;
    }
  }
`;

const WriterDiv = styled.div`
  height: calc(100% - 30px + 3px);
  overflow-y: scroll;
`;

const WriterCard = styled.div`
  margin: 15px 10px;
  border: 1px solid gray;
  border-radius: 5px;
  & > .writerc {
    padding: 10px;
    & > h2 {
      margin: 5px 0 12px 0;
      padding: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    & > .tags {
      & > span {
        padding: 1px 5px;
        border: 1px solid gray;
        margin-right: 5px;
        border-radius: 3px;
      }
    }
  }
  & > .footer {
    margin-top: 5px;
    border-top: 1px solid gray;
    display: flex;
    justify-content: space-between;
    & > .infos {
      display: inline-flex;
      align-items: center;
      & > span {
        margin-left: 10px;
        border: 1px solid gray;
        padding: 0px 3px;
        background: gray;
        color: #fff;
        border-radius: 3px;
      }
    }
    & > .btns {
      text-align: end;

      & > span {
        display: inline-block;
        padding: 5px 10px;
        border-left: 1px solid gray;
        &:hover {
          cursor: pointer;
          color: #fff;
          background: gray;
        }
      }
    }
  }
`;

const TABS = {
  ALL: {
    display: "全部",
    value: "all",
  },
  HAS_PUBLISHED: {
    display: "已发布",
    value: "published",
  },
  REVIEWING: {
    display: "待发布",
    value: "reviewing",
  },
  DRAFT: {
    display: "草稿",
    value: "draft",
  },
};

const PUBLISH_STATUS = {
  PUBLISHED: "published",
  REVIEWING: "reviewing", // (不能编辑) |
  PENDING_REVIEW: "pending_review",
  QUEUE: "queue",
};

export default function WriteList({ children, setWriterData }) {
  let _writes = [];
  const [writes, setWrites] = useState([]);
  const [filter, setFilter] = useState("");
  const [tab, setTab] = useState(TABS.ALL.value);
  useEffect(() => {
    loadMyList();
    Emitter.on(events.updateSaved, updateSaved);
    return () => {
      Emitter.off(events.updateSaved, updateSaved);
    };
  }, []);

  function loadMyList() {
    api
      .loadMyWrite()
      .then((data) => {
        setWrites(data);
        _writes = data;
      })
      .catch(console.error);
  }
  function updateSaved(data) {
    data._id = data.id;
    const index = _writes.findIndex((w) => w._id === data._id);
    if (index === -1) {
      _writes = [data, ..._writes];
      setWrites(_writes);
    } else {
      _writes = [..._writes.slice(0, index), data, ..._writes.slice(index + 1)];
      setWrites(_writes);
    }
  }

  return (
    <WriteListDiv>
      <Tabs onClick={(e) => e.stopPropagation()}>
        {Object.keys(TABS).map((k) => {
          return (
            <span
              key={k}
              className={tab === TABS[k].value ? "select" : ""}
              onClick={(e) => {
                e.stopPropagation();
                setTab(TABS[k].value);
                setFilter(TABS[k].value);
              }}
            >
              {TABS[k].display}
            </span>
          );
        })}
      </Tabs>
      <WriterDiv>
        {writes
          .filter((w) => {
            if (filter === TABS.DRAFT.value) {
              return w.draft === true;
            }
            if (filter === TABS.HAS_PUBLISHED.value) {
              return w.publishStatus === PUBLISH_STATUS.PUBLISHED;
            }
            if (filter === TABS.REVIEWING.value) {
              return [
                PUBLISH_STATUS.PENDING_REVIEW,
                PUBLISH_STATUS.REVIEWING,
              ].includes(w.publishStatus);
            }
            return true;
          })
          .map((w) => {
            return (
              <WriterCard key={w._id}>
                <div className="writerc">
                  <h2>{w.title}</h2>
                  <div className="tags">
                    {w.tags?.map((t, index) => {
                      return <span key={index}>{t}</span>;
                    })}
                  </div>
                </div>
                <div className="footer">
                  <div className="infos">
                    {w.draft ? (
                      <span>draft</span>
                    ) : (
                      <span>{w.publishStatus}</span>
                    )}
                  </div>
                  <div className="btns">
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        setWriterData({
                          id: w._id,
                          title: w.title,
                          data: w.data,
                          tags: w.tags,
                        });
                      }}
                    >
                      Edit
                    </span>
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`/writer/${w._id}`);
                      }}
                    >
                      Preview
                    </span>
                    <span>Del</span>
                  </div>
                </div>
              </WriterCard>
            );
          })}
      </WriterDiv>
    </WriteListDiv>
  );
}

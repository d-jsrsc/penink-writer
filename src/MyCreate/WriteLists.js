import { useEffect, useState } from "react";
import styled from "styled-components";

import * as api from "../api";

const WriteListDiv = styled.div`
  /* padding: 10px; */
`;

const Tabs = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid gray;
  height: 35px;
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
  /* padding: 0 10px; */
`;

const WriterCard = styled.div`
  margin: 15px 10px;
  border: 1px solid gray;
  border-radius: 5px;
  & > .writerc {
    padding: 10px;
  }
  & > .btns {
    margin-top: 5px;
    border-top: 1px solid gray;
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
  const [writes, setWrites] = useState([]);
  const [filter, setFilter] = useState("");
  const [tab, setTab] = useState(TABS.ALL);
  useEffect(() => {
    api
      .loadMyWrite()
      .then((data) => {
        setWrites(data);
      })
      .catch(console.error);
  }, []);

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
                <div className="writerc">{w.title}</div>
                <div className="btns">
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setWriterData({
                        id: w._id,
                        title: w.title,
                        data: w.data,
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
              </WriterCard>
            );
          })}
      </WriterDiv>
    </WriteListDiv>
  );
}

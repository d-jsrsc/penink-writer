import { useState } from "react";
import styled from "styled-components";

const TagsDiv = styled.div`
  margin: 5px 0 0 0;
  & > span {
    font-size: 0.8rem;
    padding: 2px 5px;
    margin-right: 2px;
    border-radius: 5px;
    position: relative;
    border: 1px solid gray;
    & > .hidden {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      display: none;
      /* text-align: center; */
      background: gray;
      color: #fff;
    }
    &:hover {
      cursor: pointer;
      & > .hidden {
        display: flex;

        justify-content: center;
        align-items: center;
      }
    }
  }
`;

export default function Tags({ tags, setTags }) {
  const [tag, setTag] = useState("");
  const [addTag, setAddTag] = useState(false);
  return (
    <TagsDiv>
      {tags.map((tag) => (
        <span
          key={tag.id}
          onClick={(e) => {
            e.stopPropagation();
            const tagIndex = tags.findIndex((t) => t.id === tag.id);
            setTags([...tags.slice(0, tagIndex), ...tags.slice(tagIndex + 1)]);
          }}
        >
          {tag.value}
          <span className="hidden">
            <i className="fa fa-times"></i>
          </span>
        </span>
      ))}
      {(addTag && (
        <span style={{ padding: 2 }}>
          <input
            placeholder="回车添加标签"
            style={{ border: "none" }}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                const id = genId();
                if (tag) {
                  setTags([
                    ...tags,
                    {
                      id,
                      value: tag,
                    },
                  ]);
                  setTag("");
                }
              }
            }}
            value={tag}
            onChange={(e) => {
              setTag(e.target.value);
            }}
          />
          <span
            className="add-close"
            onClick={(e) => {
              e.stopPropagation();
              setAddTag(false);
              setTag("");
            }}
          >
            <i className="fa fa-times"></i>
          </span>
        </span>
      )) || (
        <span
          style={{ color: "gray", borderColor: "gray" }}
          onClick={(e) => {
            e.stopPropagation();
            setAddTag(!addTag);
          }}
        >
          标签
          <span className="hidden">
            <i className="fa fa-plus"></i>
          </span>
        </span>
      )}
    </TagsDiv>
  );
}

export function genId() {
  return Math.random().toString(16).substr(2);
}

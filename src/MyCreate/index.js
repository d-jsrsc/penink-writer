import styled from "styled-components";

import Title from "./Title";

const MyCreateDiv = styled.div`
  position: relative;
  border-left: 1px solid #9a9a9a;
  height: 100%;
  overflow-y: scroll;
  user-select: none;
`;

export default function MyCreate({ children, SplitLine }) {
  return (
    <MyCreateDiv>
      {SplitLine}
      <Title></Title>
      {children}
    </MyCreateDiv>
  );
}

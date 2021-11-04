import styled from "styled-components";

const BarDiv = styled.div`
  border-bottom: 1px solid gray;
  height: 35px;
  display: flex;
  align-items: center;
  padding: 0 10px;
`;

export default function Title() {
  return (
    <BarDiv>
      我的创作
      {/** TODO 打包下载 .md */}
    </BarDiv>
  );
}

import { useRef, useEffect } from "react";
import styled from "styled-components";

const SplitLineDiv = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 1px;
  background: gray;
  &:hover {
    width: 3px;
    cursor: col-resize;
  }
`;
export default function SpliteLine({ diffFunc }) {
  const ref = useRef(null);
  useEffect(() => {
    let pageX, curCol, curColWidth;

    ref.current.addEventListener("mousedown", function (e) {
      pageX = e.pageX;
      curCol = e.target.parentElement;
      curColWidth = curCol.offsetWidth;
      document.body.style.cursor = "col-resize";
    });

    document.addEventListener("mousemove", function (e) {
      if (pageX) {
        const diffX = e.pageX - pageX;
        diffFunc(curColWidth - diffX);
      }
    });
    document.addEventListener("mouseup", function (e) {
      pageX = undefined;
      curCol = undefined;
      curColWidth = undefined;
      document.body.style.cursor = "default";
    });
  }, [diffFunc]);
  return <SplitLineDiv ref={ref}></SplitLineDiv>;
}

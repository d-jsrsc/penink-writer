import $ from "jquery";

export default function MarkdownMeun({ setContent }) {
  return (
    <div>
      <button
        onClick={() => {
          const cursorPosition = $("#md-textarea").prop("selectionStart");
          const mdtext = $("#md-textarea").text();

          console.log(
            { cursorPosition },
            mdtext.substring(0, cursorPosition),
            mdtext.substring(cursorPosition)
          );
          setContent(
            `${mdtext.substring(
              0,
              cursorPosition
            )}\n![](http://static.penink.com/img/defaultcardimg.png)\n\n${mdtext.substring(
              cursorPosition
            )}`
          );
        }}
      >
        Image
      </button>
    </div>
  );
}

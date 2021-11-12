import { EditorView } from "prosemirror-view";
import { EditorState } from "prosemirror-state";
import {
  schema,
  defaultMarkdownParser,
  defaultMarkdownSerializer,
} from "prosemirror-markdown";
import { exampleSetup } from "prosemirror-example-setup";
import { useEffect } from "react";

// class ProseMirrorView {
//   constructor(target, content) {
//     this.view = new EditorView(target, {
//       state: EditorState.create({
//         doc: defaultMarkdownParser.parse(content),
//         plugins: exampleSetup({ schema }),
//       }),
//     });
//   }

//   get content() {
//     return defaultMarkdownSerializer.serialize(this.view.state.doc);
//   }
//   focus() {
//     this.view.focus();
//   }
//   destroy() {
//     this.view.destroy();
//   }
// }

export default function ProseMirrorView() {
  useEffect(() => {
    let target = document.querySelector("#editor");
    let view = new EditorView(target, {
      state: EditorState.create({
        doc: defaultMarkdownParser.parse(""),
        plugins: exampleSetup({ schema }),
      }),
    });
    return () => {
      view.destroy();
    };
  }, []);
  return (
    <>
      <div id="editor"></div>
      <div id="content"></div>
    </>
  );
}

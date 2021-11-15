import { useEffect, useState } from "react";
import { toggleMark, setBlockType, wrapIn } from "prosemirror-commands";
import { undo, redo } from "prosemirror-history";

import logger from "../utils/logger";
import emitter, { events } from "../utils/emitter";

import H2 from "./icons/icons8-header-2-50.png";
import H3 from "./icons/icons8-header-3-50.png";
import Bold from "./icons/icons8-bold-50.png";
import Italic from "./icons/icons8-italic-50.png";
import sourceCode from "./icons/icons8-source-code-50.png";
import link from "./icons/icons8-link-50.png";
// import codeBlock from "./icons/icons8-code-50.png";
import image from "./icons/icons8-image-50.png";
import redoImg from "./icons/icons8-redo-50.png";
import undoImg from "./icons/icons8-undo-50.png";
import horizontalLineImg from "./icons/icons8-horizontal-line-50.png";

import "./Menus.css";

export default function MenusGen(editorview, schema) {
  const cmds = {
    h2: (e) => {
      const r = setBlockType(schema.nodes.heading, { level: 2 })(
        editorview.state,
        editorview.dispatch,
        editorview,
        e
      );
      editorview.focus();
    },
    h3: (e) => {
      const r = setBlockType(schema.nodes.heading, { level: 3 })(
        editorview.state,
        editorview.dispatch,
        editorview,
        e
      );
      console.log("h3", r);
      editorview.focus();
    },
    bold: () => {
      toggleMark(schema.marks.strong)(
        editorview.state,
        editorview.dispatch,
        editorview
      );
      editorview.focus();
    },
    italic: () => {
      toggleMark(schema.marks.em)(
        editorview.state,
        editorview.dispatch,
        editorview
      );
      editorview.focus();
    },
    underline: () => {
      toggleMark(schema.marks.underline)(
        editorview.state,
        editorview.dispatch,
        editorview
      );
      editorview.focus();
    },
    sourceCode: () => {
      toggleMark(schema.marks.code)(
        editorview.state,
        editorview.dispatch,
        editorview
      );
      editorview.focus();
    },
    link: (attrs) => {
      toggleMark(schema.marks.link, attrs)(
        editorview.state,
        editorview.dispatch,
        editorview
      );
      editorview.focus();
    },
    image: (attrs) => {
      editorview.dispatch(
        editorview.state.tr.replaceSelectionWith(
          schema.nodes.image.createAndFill(attrs)
        )
      );
      editorview.focus();
    },
    horizontalLine: () => {
      editorview.dispatch(
        editorview.state.tr.replaceSelectionWith(
          schema.nodes.horizontal_rule.create()
        )
      );
      editorview.focus();
    },
    undo: () => {
      undo(editorview.state, editorview.dispatch, editorview);
      editorview.focus();
    },
    redo: () => {
      redo(editorview.state, editorview.dispatch, editorview);
      editorview.focus();
    },
  };

  function execCmd(cmdname, options) {
    options = options || {};
    const { attrs } = options;
    if (["h2", "h3"].includes(cmdname)) {
      cmds[cmdname](options);
    } else if (["link", "image"].includes(cmdname)) {
      cmds[cmdname](attrs);
    } else {
      cmds[cmdname]();
    }
  }
  return <Toolbar execCmd={execCmd} schema={schema} />;
}

function markActive(state, type) {
  let { from, $from, to, empty } = state.selection;
  if (empty) return type.isInSet(state.storedMarks || $from.marks());
  else return state.doc.rangeHasMark(from, to, type);
}

function active(state, options) {
  let { $from, to, node } = state.selection;
  if (node) return node.hasMarkup(options.nodeType, options.attrs);
  return (
    to <= $from.end() && $from.parent.hasMarkup(options.nodeType, options.attrs)
  );
}

function canInsert(state, nodeType) {
  let $from = state.selection.$from;
  for (let d = $from.depth; d >= 0; d--) {
    let index = $from.index(d);
    if ($from.node(d).canReplaceWith(index, index, nodeType)) return true;
  }
  return false;
}

export function Toolbar({ execCmd, schema }) {
  const [boldActive, setBoldActive] = useState(false);
  const [italicActive, setItalicActive] = useState(false);
  // const [underlineActive, setUnderlineActive] = useState(false);
  const [sourceCodeActive, setSourceCodeActive] = useState(false);
  const [linkActive, setLinkActive] = useState(false);
  const [linkEnable, setLinkEnable] = useState(false);
  const [imageEnable, setImageEnable] = useState(true);
  const [horizonalEnable, setHorizonalEnable] = useState(true);
  const [redoEnable, setRedoEnable] = useState(false);
  const [undoEnable, setUndoEnable] = useState(false);
  const [h2Active, setH2Active] = useState(false);
  const [h3Active, setH3Active] = useState(false);

  useEffect(() => {
    emitter.on(events.ViewStateDispatch, stateDispatch);
    return () => {
      emitter.off(events.ViewStateDispatch, stateDispatch);
    };
  }, []);

  function stateDispatch(state) {
    const markBold = markActive(state, schema.marks.strong);
    const markItalic = markActive(state, schema.marks.em);
    // const markUnderline = markActive(state, schema.marks.underline);
    const markSourceCode = markActive(state, schema.marks.code);

    const markLink = markActive(state, schema.marks.link);
    const enableLink = !state.selection.empty;

    const enableImage = canInsert(state, schema.nodes.image);
    const enableHorizontal = canInsert(state, schema.nodes.horizontal_rule);

    // run: undo,
    const enableUndo = undo(state);
    const enableRedo = redo(state);

    const activeH2 = active(state, {
      nodeType: schema.nodes.heading,
      attrs: { level: 2 },
    });
    const activeH3 = active(state, {
      nodeType: schema.nodes.heading,
      attrs: { level: 3 },
    });

    logger.debug("%O", { enableUndo, enableRedo });

    setBoldActive(!!markBold);
    setItalicActive(!!markItalic);
    // setUnderlineActive(!!markUnderline);
    setSourceCodeActive(!!markSourceCode);
    setLinkActive(!!markLink);
    setLinkEnable(!!enableLink);
    setImageEnable(!!enableImage);
    setUndoEnable(!!enableUndo);
    setRedoEnable(enableRedo);
    setHorizonalEnable(enableHorizontal);
    setH2Active(activeH2);
    setH3Active(activeH3);
  }
  return (
    <>
      {/* <span>Toolbar</span>
      <span style={{ border: "none", outline: "none" }}>|</span> */}
      <span className={h2Active ? "active" : ""} onClick={() => execCmd("h2")}>
        <img src={H2}></img>
      </span>
      <span
        className={h3Active ? "active" : ""}
        onClick={(e) => execCmd("h3", e)}
      >
        <img src={H3}></img>
      </span>
      <span style={{ border: "none", outline: "none" }}>|</span>
      <span
        className={boldActive ? "active big" : "big"}
        onClick={() => execCmd("bold")}
      >
        <img src={Bold}></img>
      </span>
      <span
        className={italicActive ? "active big" : "big"}
        onClick={() => execCmd("italic")}
      >
        <img src={Italic}></img>
      </span>
      {/* <span
        className={underlineActive ? "active big" : "big"}
        onClick={() => execCmd("underline")}
      >
        <img src={Underline}></img>
      </span> */}
      <span
        className={sourceCodeActive ? "active big" : "big"}
        onClick={() => execCmd("sourceCode")}
      >
        <img src={sourceCode}></img>
      </span>
      <span
        className={linkActive ? "active big" : "big"}
        style={{ cursor: linkEnable ? "pointer" : "not-allowed" }}
        onClick={() => {
          if (linkEnable) {
            const href = window.prompt("link");
            execCmd("link", {
              attrs: {
                href,
              },
            });
          }
        }}
      >
        <img src={link}></img>
      </span>
      <span style={{ border: "none", outline: "none" }}>|</span>
      <span
        className={"big"}
        style={{ cursor: undoEnable ? "pointer" : "not-allowed" }}
        onClick={() => execCmd("undo")}
      >
        <img src={undoImg}></img>
      </span>
      <span
        className={"big"}
        style={{ cursor: redoEnable ? "pointer" : "not-allowed" }}
        onClick={() => execCmd("redo")}
      >
        <img src={redoImg}></img>
      </span>
      <span style={{ border: "none", outline: "none" }}>|</span>
      {/* <span className={"big"}>
        <img src={code}></img>
      </span> */}
      <span
        className={"big"}
        style={{ cursor: horizonalEnable ? "pointer" : "not-allowed" }}
        onClick={() => execCmd("horizontalLine")}
      >
        <img src={horizontalLineImg}></img>
      </span>
      <span
        className={"big"}
        style={{ cursor: imageEnable ? "pointer" : "not-allowed" }}
        onClick={() => {
          if (imageEnable) {
            execCmd("image", {
              attrs: {
                src: "https://imomoe.one/anime/20130138.html",
                title: "s",
                alt: "s",
              },
            });
          }
        }}
      >
        <img src={image}></img>
      </span>
    </>
  );
}

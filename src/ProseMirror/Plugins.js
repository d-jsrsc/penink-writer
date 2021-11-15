import { keymap } from "prosemirror-keymap";
import { history } from "prosemirror-history";
import { baseKeymap } from "prosemirror-commands";
import { dropCursor } from "prosemirror-dropcursor";
import { gapCursor } from "prosemirror-gapcursor";
import { Plugin } from "prosemirror-state";

import { buildKeymap } from "./keymap";
import { buildInputRules } from "./inputrules";

import Emitter from "../utils/emitter";

export function setUpPlugins(options) {
  let plugins = [
    buildInputRules(options.schema),
    keymap(buildKeymap(options.schema, options.mapKeys)),
    keymap(baseKeymap),
    dropCursor(),
    gapCursor(),
    new Plugin({
      view(editorView) {
        return {
          update: () => {
            console.log("plugin", editorView);
            Emitter.emit("view", editorView);
          },
        };
      },
    }),
  ];

  if (options.history !== false) plugins.push(history());
  return plugins;
}

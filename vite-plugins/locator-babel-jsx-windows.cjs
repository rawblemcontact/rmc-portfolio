"use strict";

const createLocatorPlugin = require("@locator/babel-jsx/dist/index.js").default;

const normalizePath = (value) =>
  typeof value === "string" ? value.split("\\").join("/") : value;

/** Windows-safe wrapper: forward slashes avoid invalid `\U` escapes in injected strings. */
module.exports = function locatorBabelJsxWindows(babel) {
  const plugin = createLocatorPlugin(babel);
  const programVisitor = plugin.visitor.Program;
  const originalEnter = programVisitor.enter;

  programVisitor.enter = function enter(path, state) {
    if (state?.filename) {
      state.filename = normalizePath(state.filename);
    }
    if (state?.cwd) {
      state.cwd = normalizePath(state.cwd);
    }
    return originalEnter.call(this, path, state);
  };

  return plugin;
};

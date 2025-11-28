// I copied this file from:
// https://github.com/remix-run/v1-compat-utils/blob/main/packages/v1-route-convention/src/lib.ts

import fs from "node:fs";
import path from "node:path";
import { minimatch } from "minimatch";
import { DefineRoutesFunction } from "@react-router/remix-config-routes-adapter";
import { RouteManifest } from "node_modules/@react-router/remix-config-routes-adapter/dist/manifest";

let paramPrefixChar = "$" as const;
let escapeStart = "[" as const;
let escapeEnd = "]" as const;
let optionalStart = "(" as const;
let optionalEnd = ")" as const;

const routeModuleExtsSet = new Set([".js", ".jsx", ".ts", ".tsx", ".md", ".mdx"]);

function isRouteModuleFile(filename: string): boolean {
  return routeModuleExtsSet.has(path.extname(filename));
}

export type CreateRoutesFromFoldersOptions = {
  /**
   * The directory where your app lives. Defaults to `app`.
   * @default "app"
   */
  appDirectory?: string;
  /**
   * A list of glob patterns to ignore when looking for route modules.
   * Defaults to `[]`.
   */
  ignoredFilePatterns?: string[];
  /**
   * The directory where your routes live. Defaults to `routes`.
   * This is relative to `appDirectory`.
   * @default "routes"
   */
  routesDirectory?: string;
};

/**
 * Defines routes using the filesystem convention in `app/routes`. The rules are:
 *
 * - Route paths are derived from the file path. A `.` in the filename indicates
 *   a `/` in the URL (a "nested" URL, but no route nesting). A `$` in the
 *   filename indicates a dynamic URL segment.
 * - Subdirectories are used for nested routes.
 *
 * For example, a file named `app/routes/gists/$username.tsx` creates a route
 * with a path of `gists/:username`.
 */
export function createRoutesFromFolders(defineRoutes: DefineRoutesFunction, options: CreateRoutesFromFoldersOptions = {}): RouteManifest {
  let { appDirectory = "app", ignoredFilePatterns = [], routesDirectory = "routes" } = options;

  let appRoutesDirectory = path.join(appDirectory, routesDirectory);
  let files: { [routeId: string]: string } = {};

  // First, find all route modules in app/routes
  visitFiles(appRoutesDirectory, (file) => {
    if (ignoredFilePatterns.some((pattern) => minimatch(file, pattern))) {
      return;
    }

    if (isRouteModuleFile(file)) {
      let relativePath = path.join(routesDirectory, file);
      let routeId = createRouteId(relativePath);
      files[routeId] = relativePath;
      return;
    }

    throw new Error(`Invalid route module file: ${path.join(appRoutesDirectory, file)}`);
  });

  let routeIds = Object.keys(files).sort(byLongestFirst);
  let parentRouteIds = getParentRouteIds(routeIds);
  let uniqueRoutes = new Map<string, string>();

  const ensureUniqueRoute = (uniqueRouteId: string | undefined, isPathlessLayoutRoute: boolean, fullPath: string, routeId: string) => {
    if (!uniqueRouteId || isPathlessLayoutRoute) {
      return;
    }
    if (uniqueRoutes.has(uniqueRouteId)) {
      throw new Error(
        `Path ${JSON.stringify(fullPath || "/")} defined by route ` +
          `${JSON.stringify(routeId)} conflicts with route ` +
          `${JSON.stringify(uniqueRoutes.get(uniqueRouteId))}`
      );
    }
    uniqueRoutes.set(uniqueRouteId, routeId);
  };

  const assertNoChildRoutesForIndex = (routeId: string) => {
    let invalidChildRoutes = routeIds.filter((id) => parentRouteIds[id] === routeId);
    if (invalidChildRoutes.length > 0) {
      throw new Error(`Child routes are not allowed in index routes. Please remove child routes of ${routeId}`);
    }
  };

  // Then, recurse through all routes using the public defineRoutes() API
  function defineNestedRoutes(defineRoute: DefineRouteFunction, parentId?: string): void {
    let childRouteIds = routeIds.filter((id) => {
      return parentRouteIds[id] === parentId;
    });

    for (let routeId of childRouteIds) {
      let routePath: string | undefined = createRoutePath(routeId.slice((parentId || routesDirectory).length + 1));

      let isIndexRoute = routeId.endsWith("/index");
      let fullPath = createRoutePath(routeId.slice(routesDirectory.length + 1));
      let uniqueRouteId = (fullPath || "") + (isIndexRoute ? "?index" : "");
      let isPathlessLayoutRoute = routeId.split("/").pop()?.startsWith("__") === true;

      /**
       * We do not try to detect path collisions for pathless layout route
       * files because, by definition, they create the potential for route
       * collisions _at that level in the tree_.
       *
       * Consider example where a user may want multiple pathless layout routes
       * for different subfolders
       *
       *   routes/
       *     account.tsx
       *     account/
       *       __public/
       *         login.tsx
       *         perks.tsx
       *       __private/
       *         orders.tsx
       *         profile.tsx
       *       __public.tsx
       *       __private.tsx
       *
       * In order to support both a public and private layout for `/account/*`
       * URLs, we are creating a mutually exclusive set of URLs beneath 2
       * separate pathless layout routes.  In this case, the route paths for
       * both account/__public.tsx and account/__private.tsx is the same
       * (/account), but we're again not expecting to match at that level.
       *
       * By only ignoring this check when the final portion of the filename is
       * pathless, we will still detect path collisions such as:
       *
       *   routes/parent/__pathless/foo.tsx
       *   routes/parent/__pathless2/foo.tsx
       *
       * and
       *
       *   routes/parent/__pathless/index.tsx
       *   routes/parent/__pathless2/index.tsx
       */
      ensureUniqueRoute(uniqueRouteId, isPathlessLayoutRoute, fullPath || "/", routeId);

      if (isIndexRoute) {
        assertNoChildRoutesForIndex(routeId);
        defineRoute(routePath, files[routeId], { index: true, id: routeId });
      } else {
        defineRoute(routePath, files[routeId], { id: routeId }, () => {
          defineNestedRoutes(defineRoute, routeId);
        });
      }
    }
  }

  return defineRoutes(defineNestedRoutes);
}

function isNewEscapeSequence(inEscapeSequence: number, char: string, prevChar: string | undefined) {
  return !inEscapeSequence && char === escapeStart && prevChar !== escapeStart;
}

function isCloseEscapeSequence(inEscapeSequence: number, char: string, nextChar: string | undefined) {
  return inEscapeSequence && char === escapeEnd && nextChar !== escapeEnd;
}

function isStartOfLayoutSegment(char: string, nextChar: string | undefined, rawSegmentBuffer: string) {
  return char === "_" && nextChar === "_" && !rawSegmentBuffer;
}

function isNewOptionalSegment(
  char: string,
  prevChar: string | undefined,
  inOptionalSegment: number,
  inEscapeSequence: number
) {
  return (
    char === optionalStart &&
    prevChar !== optionalStart &&
    (isSegmentSeparator(prevChar) || prevChar === undefined) &&
    !inOptionalSegment &&
    !inEscapeSequence
  );
}

function isCloseOptionalSegment(
  char: string,
  nextChar: string | undefined,
  inOptionalSegment: number,
  inEscapeSequence: number
) {
  return (
    char === optionalEnd && nextChar !== optionalEnd && (isSegmentSeparator(nextChar) || nextChar === undefined) && inOptionalSegment && !inEscapeSequence
  );
}

// TODO: Cleanup and write some tests for this function
export function createRoutePath(partialRouteId: string): string | undefined {
  type PathState = {
    result: string;
    rawSegmentBuffer: string;
    inEscapeSequence: number;
    inOptionalSegment: number;
    optionalSegmentIndex: number | null;
    skipSegment: boolean;
  };

  const state: PathState = {
    result: "",
    rawSegmentBuffer: "",
    inEscapeSequence: 0,
    inOptionalSegment: 0,
    optionalSegmentIndex: null,
    skipSegment: false,
  };

  const handleSkipSegment = (char: string) => {
    if (!state.skipSegment) return false;
    if (isSegmentSeparator(char)) state.skipSegment = false;
    return true;
  };

  const handleEscapeStart = (char: string, prevChar: string | undefined) => {
    if (!isNewEscapeSequence(state.inEscapeSequence, char, prevChar)) return false;
    state.inEscapeSequence++;
    return true;
  };

  const handleEscapeEnd = (char: string, nextChar: string | undefined) => {
    if (!isCloseEscapeSequence(state.inEscapeSequence, char, nextChar)) return false;
    state.inEscapeSequence--;
    return true;
  };

  const handleOptionalStart = (char: string, prevChar: string | undefined) => {
    if (!isNewOptionalSegment(char, prevChar, state.inOptionalSegment, state.inEscapeSequence)) return false;
    state.inOptionalSegment++;
    state.optionalSegmentIndex = state.result.length;
    state.result += optionalStart;
    return true;
  };

  const handleOptionalClose = (char: string, nextChar: string | undefined) => {
    if (!isCloseOptionalSegment(char, nextChar, state.inOptionalSegment, state.inEscapeSequence)) return false;
    if (state.optionalSegmentIndex !== null) {
      state.result = state.result.slice(0, state.optionalSegmentIndex) + state.result.slice(state.optionalSegmentIndex + 1);
    }
    state.optionalSegmentIndex = null;
    state.inOptionalSegment--;
    state.result += "?";
    return true;
  };

  const handleInEscape = (char: string) => {
    if (!state.inEscapeSequence) return false;
    state.result += char;
    return true;
  };

  const handleSegmentSeparator = (char: string) => {
    if (!isSegmentSeparator(char)) return false;
    if (state.rawSegmentBuffer === "index" && state.result.endsWith("index")) {
      state.result = state.result.replace(/\/?index$/, "");
    } else {
      state.result += "/";
    }
    state.rawSegmentBuffer = "";
    state.inOptionalSegment = 0;
    state.optionalSegmentIndex = null;
    return true;
  };

  const handleLayoutSegment = (char: string, nextChar: string | undefined) => {
    if (!isStartOfLayoutSegment(char, nextChar, state.rawSegmentBuffer)) return false;
    state.skipSegment = true;
    return true;
  };

  const handleParamPrefix = (char: string, nextChar: string | undefined) => {
    if (char !== paramPrefixChar) return false;
    if (nextChar === optionalEnd) {
      throw new Error(`Invalid route path: ${partialRouteId}. Splat route $ is already optional`);
    }
    state.result += nextChar === undefined ? "*" : ":";
    return true;
  };

  for (let i = 0; i < partialRouteId.length; i++) {
    const char = partialRouteId.charAt(i);
    const prevChar = i > 0 ? partialRouteId.charAt(i - 1) : undefined;
    const nextChar = i < partialRouteId.length - 1 ? partialRouteId.charAt(i + 1) : undefined;

    const handlers = [
      () => handleSkipSegment(char),
      () => handleEscapeStart(char, prevChar),
      () => handleEscapeEnd(char, nextChar),
      () => handleOptionalStart(char, prevChar),
      () => handleOptionalClose(char, nextChar),
      () => handleInEscape(char),
      () => handleSegmentSeparator(char),
      () => handleLayoutSegment(char, nextChar),
    ];
    if (handlers.some((handler) => handler())) continue;

    state.rawSegmentBuffer += char;
    if (handleParamPrefix(char, nextChar)) continue;

    state.result += char;
  }

  if (state.rawSegmentBuffer === "index" && state.result.endsWith("index")) {
    state.result = state.result.replace(/\/?index$/, "");
  } else {
    state.result = state.result.replace(/\/$/, "");
  }

  if (state.rawSegmentBuffer === "index" && state.result.endsWith("index?")) {
    throw new Error(`Invalid route path: ${partialRouteId}. Make index route optional by using (index)`);
  }

  return state.result || undefined;
}

function isSegmentSeparator(checkChar: string | undefined) {
  if (!checkChar) return false;
  return ["/", ".", path.win32.sep].includes(checkChar);
}

function getParentRouteIds(routeIds: string[]): Record<string, string | undefined> {
  return routeIds.reduce<Record<string, string | undefined>>(
    (parentRouteIds, childRouteId) => ({
      ...parentRouteIds,
      [childRouteId]: routeIds.find((id) => childRouteId.startsWith(`${id}/`)),
    }),
    {}
  );
}

function byLongestFirst(a: string, b: string): number {
  return b.length - a.length;
}

function visitFiles(dir: string, visitor: (file: string) => void, baseDir = dir): void {
  for (let filename of fs.readdirSync(dir)) {
    let file = path.resolve(dir, filename);
    let stat = fs.lstatSync(file);

    if (stat.isDirectory()) {
      visitFiles(file, visitor, baseDir);
    } else if (stat.isFile()) {
      visitor(path.relative(baseDir, file));
    }
  }
}

/*
eslint
  no-loop-func: "off",
*/

function createRouteId(file: string) {
  return normalizeSlashes(stripFileExtension(file));
}

function normalizeSlashes(file: string) {
  return file.split(path.win32.sep).join("/");
}

function stripFileExtension(file: string) {
  return file.replace(/\.[a-z0-9]+$/i, "");
}

interface DefineRouteOptions {
  /**
   * Should be `true` if the route `path` is case-sensitive. Defaults to
   * `false`.
   */
  caseSensitive?: boolean;

  /**
   * Should be `true` if this is an index route that does not allow child routes.
   */
  index?: boolean;

  /**
   * An optional unique id string for this route. Use this if you need to aggregate
   * two or more routes with the same route file.
   */
  id?: string;
}

type DefineRouteChildren = () => void;

type DefineRouteFunction = (
  /**
   * The path this route uses to match the URL pathname.
   */
  path: string | undefined,

  /**
   * The path to the file that exports the React component rendered by this
   * route as its default export, relative to the `app` directory.
   */
  file: string,

  /**
   * Options for defining routes, or a function for defining child routes.
   */
  optionsOrChildren?: DefineRouteOptions | DefineRouteChildren,

  /**
   * A function for defining child routes.
   */
  children?: DefineRouteChildren
) => void;

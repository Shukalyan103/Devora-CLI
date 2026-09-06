import path from "node:path";

export const WORKSPACE = process.cwd();

export function getSafePath(filePath = ".") {
  const resolvedPath = path.resolve(
    WORKSPACE,
    filePath
  );

  if (
    resolvedPath !== WORKSPACE &&
    !resolvedPath.startsWith(
      WORKSPACE + path.sep
    )
  ) {
    throw new Error(
      "Access denied: Path is outside the workspace."
    );
  }

  return resolvedPath;
}
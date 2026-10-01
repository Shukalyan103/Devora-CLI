import path from "node:path";

export const WORKSPACE = process.cwd();

export function getSafePath(filePath = ".") {
  const resolvedPath = path.resolve(WORKSPACE, filePath);
  
  // Normalize casing for Windows compatibility
  const normalizedResolved = path.normalize(resolvedPath).toLowerCase();
  const normalizedWorkspace = path.normalize(WORKSPACE).toLowerCase();
  if (
    normalizedResolved !== normalizedWorkspace &&
    !normalizedResolved.startsWith(normalizedWorkspace + path.sep)
  ) {
    throw new Error("Access denied: Path is outside the workspace.");
  }
  return resolvedPath;
}
import fs from "node:fs/promises"
import path from "node:path"

const MEMORY_DIR = path.join(process.cwd(), ".devora")

const MEMORY_FILES = path.join(MEMORY_DIR, "project-memory.json")

export const loadProjectMemory = async () => {
    try {
        const data = await fs.readFile(MEMORY_FILES, "utf-8")

        return JSON.parse(data)

    } catch (error) {
        return {
            project: [],
            decisions: [],
            importantFiles: [],
            notes: []
        }

    } 
}


export const saveProjectMemory = async (memory) => {
    await fs.mkdir(MEMORY_DIR, { recursive: true })
    await fs.writeFile(MEMORY_FILES, JSON.stringify(memory, null, 2))
}

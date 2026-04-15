import fs from 'fs/promises'

export const deleteFile = async (file) => {
    if (!file) return;
    try {
        await fs.unlink(file)
        console.log(`File deleted successfully`)
    } catch (error) {
        console.log("Error deleting file:", error.message);
    }

}
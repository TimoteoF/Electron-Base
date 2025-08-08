export async function getOsInfo() {
    return { platform: process.platform, node: process.version };
}

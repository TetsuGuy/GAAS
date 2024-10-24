
export interface ImageProvider {
    getImage(): Promise<{ buffer: Buffer, type: string }>
}
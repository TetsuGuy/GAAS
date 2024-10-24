
export interface ImageProvider<A = any,B = any,C = any> {
    getImage(): Promise<A>
    saveImage(): Promise<B>
    createImage(): Promise<C>
}
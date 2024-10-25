
export interface ImageProvider<A = any,B = any,C = any> {
    getImage(): Promise<A>
    saveImage(...options: any): Promise<B>
    createImage(): Promise<C>
}
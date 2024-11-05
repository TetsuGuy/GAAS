export interface ImageProvider {
  getImage(...options: any): Promise<any>
  saveImage(...options: any): Promise<any>
  createImage(...options: any): Promise<any>
  getRandomImage(...options: any): Promise<any>
}

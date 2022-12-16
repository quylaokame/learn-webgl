import Renderer from "./Renderer.js";

export default class ImageRenderer extends Renderer {

    initResourceList(){
        this.imgList = ["/img2.png", "/img1.png"];
        this.vsUrl = "/shader/texture.vert";
        this.fsUrl = "/shader/texture.frag";
    }

    draw(){
        this.drawImage(this.images[0], 200, 200);
        this.drawImage(this.images[1], 0, 200);
    }
}
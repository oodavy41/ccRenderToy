class Texture {
    static
    var count = 0;
    constructor(src, gl) {
        this.index = Texture.count;
        Texture.count++;
        this.img = new Image();
        var that = this;
        img.onload() = function(gl) {
            that.texture = gl.createTexture();
            gl.activeTexture(gl.TEXTURE0 + this.indexs);
            gl.bindTexture(gl.TEXTURE_2D, that.texture);
            gl.texImage2D(
                gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.bindTexture(gl.TEXTURE_2D, null);
        }
        this.img.src = src;
    }
}

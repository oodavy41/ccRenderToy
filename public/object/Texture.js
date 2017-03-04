class Texture {
    var count = 0;
    constructor(src, gl) {
        this.index = gl.TEXTURE0 + count;
        count++;
        this.img = new Image();
        var that = this;
        img.onload() = function(gl) {
            that.texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, that.texture);
            gl.texImage2D(
                gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.bindTexture(gl.TEXTURE_2D, null);
        }
        this.img.src = src;
    }
}

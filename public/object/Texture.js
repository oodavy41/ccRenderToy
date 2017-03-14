class Texture {

    constructor(src, gl) {
        this.index = Texture.count;
        Texture.count++;
        this.img = new Image();
        var that = this;
        this.img.onload = function () {

            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);


            that.texture = gl.createTexture();
            gl.activeTexture(gl.TEXTURE0 + that.index);
            console.log(that.index + ':' + src);
            gl.bindTexture(gl.TEXTURE_2D, that.texture);
            gl.texImage2D(
                gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this);
            gl.generateMipmap(gl.TEXTURE_2D);
            //gl.bindTexture(gl.TEXTURE_2D, null);

            loadProg--;
            progress.innerText = loadProg + '';
            promise();
        };
        this.img.src = src;
        loadProg++;
        progress.innerText = loadProg + '';
    }
}

Texture.count = 0;

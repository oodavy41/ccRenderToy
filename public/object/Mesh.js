class Mesh {
    //
    //arr格式 [[name,[arr],length],[name1,[arr1],len]...,[index_arr]]
    constructor() {
        this.arrs = null;
        this.material=null;
        this.arr_bkup = {};
        this.index_buffer = null;
        this.index_length=0;
    }

    set_mesh(arr){
        this.arrs=arr;
    }
    set_mat(mat){
        this.material=mat;
    }


    init(gl) {
        var program=this.material.prog;
        if(!prog)
            console.log("no Program Binded!");

        for (var i = 0, l = this.arrs.length; i < l; i++) {
            var arr = this.arrs[i];
            if (i < l - 1)
                this.arr_bkup[arr[0]] = upload_array_att(
                    arr[1], arr[0], program, gl, [arr[2], gl.FLOAT, false, 0, 0]);
            else {
                this.index_buffer = create_ibo(arr[1], gl);
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index_buffer);
                this.index_length=arr[1].length;
            }
        }
    }

    draw(gl){
        this.material.use(gl);
        gl.drawElements(gl.TRIANGLES, this.index_length, gl.UNSIGNED_SHORT, 0);
    }



}

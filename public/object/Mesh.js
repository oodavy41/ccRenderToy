class Mesh {
    //
    //arr格式 [{name,[arr],len},{name1,[arr1],len}...{index_name,[index_arr],index_length}]
    constructor(arrs) {
        this.arrs = arrs;
        this.arr_bkup = {};
        this.index_buffer = '';
    }


    create_draw(gl, program) {
        for (var i = 0, l = this.arrs.length; i < l; i++) {
            var arr = this.arrs[i];
            if (i < l - 1)
                this.arr_bkup[arr[0]] = upload_array_att(
                    arr[1], arr[0], program, gl, [arr[2], gl.FLOAT, false, 0, 0]);
            else {
                this.index_buffer = create_ibo(arr[0], gl);
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index_buffer);
            }
        }
    }



}

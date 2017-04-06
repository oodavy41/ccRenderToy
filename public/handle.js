function can_on_click() {
    thegl.mouseCTRL_flag = !thegl.mouseCTRL_flag;
}

function on_mouse_move(event) {
    if (thegl.mouseCTRL_flag) {
        var x = event.clientX;
        var y = event.clientY;
        thegl.client_pos[2] = x;
        thegl.client_pos[3] = y;
    }
}
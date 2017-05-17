function can_on_click() {
    thegl.mouseCTRL_flag = !thegl.mouseCTRL_flag;
}

function on_mouse_move(event) {
    if (thegl.mouseCTRL_flag) {
        var x = event.clientX;
        var y = event.clientY;
        thegl.client_pos[2] = x;
        thegl.client_pos[3] = y;
    } else {
        thegl.client_pos = [-1, 0, -1, 0];
    }
}

function on_key_press(event) {
    switch (event.keyCode) {
        case 119:
            thegl.movement[0] = 1;
            break;
        case 97:
            thegl.movement[1] = 1;
            break;
        case 115:
            thegl.movement[2] = 1;
            break;
        case 100:
            thegl.movement[3] = 1;
            break;
    }

}

function on_key_up(event) {
    switch (event.keyCode + 32) {
        case 119:
            thegl.movement[0] = 0;
            break;
        case 97:
            thegl.movement[1] = 0;
            break;
        case 115:
            thegl.movement[2] = 0;
            break;
        case 100:
            thegl.movement[3] = 0;
            break;
    }

}

function LDchangex(event) {
    document.getElementById('LDx').innerText=event.value;
    thegl.light_d[0]=event.value;
}
function LDchangey(event) {
    document.getElementById('LDy').innerText=event.value;
    thegl.light_d[1]=event.value;
}
function LDchangez(event) {
    document.getElementById('LDz').innerText=event.value;
    thegl.light_d[2]=event.value;
}
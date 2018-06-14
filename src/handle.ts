import { GLg } from "./GLCore/GL";

export class keyboardCtrl {
    thegl: GLg;

    constructor(glg: GLg) {
        this.thegl = glg;
    }


    canv_on_click() {
        this.thegl.mouseCTRL_flag = !this.thegl.mouseCTRL_flag;
    }

    on_mouse_move(event) {
        if (this.thegl.mouseCTRL_flag) {
            var x = event.clientX;
            var y = event.clientY;
            this.thegl.client_pos[2] = x;
            this.thegl.client_pos[3] = y;
        } else {
            this.thegl.client_pos = [-1, 0, -1, 0];
        }
    }

    on_key_press(event) {
        switch (event.keyCode) {
            case 119:
                this.thegl.movement[0] = 1;
                break;
            case 97:
                this.thegl.movement[1] = 1;
                break;
            case 115:
                this.thegl.movement[2] = 1;
                break;
            case 100:
                this.thegl.movement[3] = 1;
                break;
        }

    }

    on_key_up(event) {
        switch (event.keyCode + 32) {
            case 119:
                this.thegl.movement[0] = 0;
                break;
            case 97:
                this.thegl.movement[1] = 0;
                break;
            case 115:
                this.thegl.movement[2] = 0;
                break;
            case 100:
                this.thegl.movement[3] = 0;
                break;
        }

    }

    LDchangex(event) {
        document.getElementById('LDxL').innerText = event.value;
        this.thegl.light_d[0] = event.value;
    }
    LDchangey(event) {
        document.getElementById('LDyL').innerText = event.value;
        this.thegl.light_d[1] = event.value;
    }
    LDchangez(event) {
        document.getElementById('LDzL').innerText = event.value;
        this.thegl.light_d[2] = event.value;
    }
    mlchange(event) {
        document.getElementById('mtls').innerText = event.value;
    }
    snchange(event) {
        document.getElementById('stns').innerText = event.value;
    }

}

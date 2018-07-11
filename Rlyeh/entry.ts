

import { glclear } from './GLCore/glfuncs';
import { objLoader } from './loader';
import { Material } from './object/Material';
import { skybox, donghnut } from './baseModels';
import { Scenes } from './Scenes';
import './GLOBAL/GLOBAL.d';
import { TexManager } from './ResManager';
import { Transform } from './object/Transform';
import { GLg } from './GLCore/GL';
import { KeyBoardCtrl } from './handle';

let statuss = document.getElementById('statuss');
let progress = document.getElementById('progress');

window.onload = function () {
    let glc = document.getElementById('wobaglccc') as HTMLCanvasElement;
    let fps = document.getElementById('fps');
    let LDx = document.getElementById('LDx');
    let LDy = document.getElementById('LDy');
    let LDz = document.getElementById('LDz');
    let LDxL = document.getElementById('LDxL');
    let LDyL = document.getElementById('LDyL');
    let LDzL = document.getElementById('LDzL');
    let metals = document.getElementById('metals');
    let smooths = document.getElementById('smooths');



    let date = new Date();

    let demoSence = new Scenes(glc);
    let thegl = demoSence.GLCtrl;
    let texMgr = new TexManager(() => {
        statuss.innerText = 'Done';
        progress.innerText = '';

        demoSence.update();

    }, () => {
        progress.innerText = (1 - texMgr.loadProg / texMgr.max) + '%';
    });
    statuss.innerText = 'Loading...';

    let keyCtrl = new KeyBoardCtrl(thegl);

    glc.addEventListener('click', keyCtrl.canv_on_click);
    window.addEventListener('mousemove', keyCtrl.on_mouse_move);
    window.addEventListener('keypress', keyCtrl.on_key_press);
    window.addEventListener('keyup', keyCtrl.on_key_up);
    LDx.addEventListener('mousemove', keyCtrl.LDchangex);
    LDy.addEventListener('mousemove', keyCtrl.LDchangey);
    LDz.addEventListener('mousemove', keyCtrl.LDchangez);
    metals.addEventListener('mousemove', keyCtrl.mlchange);
    smooths.addEventListener('mousemove', keyCtrl.snchange);


    let light_direction = [-10, 0, -1, 0];
    let light_color = [1, 1, 1];
    let camera_pos = [-3, 6, 6];
    let camera_front = [0, 0, -1];
    let camera_up = [0, 1, 0];
    let camera_info = [Math.PI / 3, glc.width / glc.height, 0.01, 100];


    thegl.create(glc);
    thegl.set_light(light_direction, light_color);
    thegl.set_cam_pos(camera_pos);
    thegl.set_cam_front(camera_front);
    thegl.set_cam_up(camera_up);
    thegl.set_cam_info(camera_info);
    thegl.set_cam_ptype();


    let resPah = '../resource/';

    let sb = skybox([
        resPah + 'skyboxs/bs2/X.png',
        resPah + 'skyboxs/bs2/-X.png',
        resPah + 'skyboxs/bs2/Y.png',
        resPah + 'skyboxs/bs2/-Y.png',
        resPah + 'skyboxs/bs2/Z.png',
        resPah + 'skyboxs/bs2/-Z.png'
    ], thegl.gl, texMgr);

    sb.setEarlyDraw((transform: Transform, glg: GLg) => {
        transform.set_pos(thegl.camera_pos[0], thegl.camera_pos[1], thegl.camera_pos[2]);
        glg.gl.cullFace(glg.gl.FRONT);
    });
    sb.setLateDraw((transform: Transform, glg: GLg) => {
        glg.gl.cullFace(glg.gl.BACK);
    });


    // ----------------------------------

    let objs1 = objLoader(resPah + 'models/mwzz/', 'mwzz.obj', thegl.mtllib, thegl.gl, 'anim_phone', texMgr);

    let objs11 = objLoader(resPah + 'models/mwzz/', 'mwzz.obj', thegl.mtllib, thegl.gl, 'anim_edge_phone', texMgr);
    objs11.setEarlyDraw((transform: Transform, glg: GLg) => {
        glg.gl.cullFace(glg.gl.FRONT);
    });
    objs11.setLateDraw((transform: Transform, glg: GLg) => {
        glg.gl.cullFace(glg.gl.BACK);
    });


    // ----------------------------------

    let objs2 = objLoader(resPah + 'models/mwzz/', 'mwzz.obj', thegl.mtllib, thegl.gl, 'text_phone', texMgr);
    objs2.setInfo((tran: Transform) => {
        tran.set_pos(0, 0, 2);
    });


    // ----------------------------------


    let objsrefl = objLoader(resPah + 'models/mwzz/', 'mwzz.obj', thegl.mtllib, thegl.gl, 'reflect_mat', texMgr);
    objsrefl.setInfo((tran: Transform) => {
        tran.Mesh[0].material.set_uniform(
            Material.I1i,
            'tex',
            sb[0].Mesh[0].material.uniforms['tex'].value,
            thegl.gl
        );
        tran.set_pos(0, 0, 4);
    });


    //----------------------------------

    let objsrefr = objLoader(resPah + 'models/mwzz/', 'mwzz.obj', thegl.mtllib, thegl.gl, 'refract_mat', texMgr);
    objsrefr.setInfo((tran: Transform) => {
        tran.Mesh[0].material.set_uniform(
            Material.I1i,
            'tex',
            sb[0].Mesh[0].material.uniforms['tex'].value,
            thegl.gl
        );
        tran.Mesh[0].material.set_uniform(Material._1f, 'ratio', 1 / 1.52, thegl.gl);
        tran.set_pos(0, 0, 6);
    });


    //----------------------------------

    let objs3 = donghnut(30, 36, 1, 3, thegl);
    objs3.setInfo((tran: Transform) => {
        tran.set_pos(10, 3, 2);
        tran.Mesh[0].material.set_uniform(
            Material.I1i,
            'tex',
            sb[0].Mesh[0].material.uniforms['tex'].value,
            thegl.gl
        );
    });
    objs3.setEarlyDraw((transform: Transform, glg: GLg) => {
        let metalless = parseFloat((document.getElementById('metals') as HTMLInputElement).value);
        let smoothness = parseFloat((document.getElementById('smooths') as HTMLInputElement).value);
        transform.Mesh[0].material.set_uniform(Material._1f, 'metalless', metalless, thegl.gl);
        transform.Mesh[0].material.set_uniform(Material._1f, 'smoothness', smoothness, thegl.gl);
        transform.set_rz(date.getTime() / 2000);
        transform.set_rx(date.getTime() / 1000);
    });


    demoSence.LoadSence([sb, objs1, objs11, objs2, objsrefl, objsrefr, objs3]);

    demoSence.Run();

};

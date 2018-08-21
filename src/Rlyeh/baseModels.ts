
import {att_c, att_n, att_p} from './GLOBAL/GLOBAL';
import {Material, MTL_TYPE} from './object/Material';
import {Mesh} from './object/Mesh';
import {RObject} from './object/Object';
import {CubeTexture} from './object/Texture';
import {Transform} from './object/Transform';
import {ResManager} from './ResManager';

export function donghnut(
    row: number, column: number, irad: number, rad: number,
    gl: WebGLRenderingContext, resManager: ResManager) {
  const pos = new Array(), nor = new Array(), col = new Array(),

        idx = new Array();
  for (let i = 0; i <= row; i++) {
    const r = Math.PI * 2 / row * i;
    const rr = Math.cos(r);
    const ry = Math.sin(r);
    for (let ii = 0; ii <= column; ii++) {
      const tr = Math.PI * 2 / column * ii;
      const tx = (rr * irad + rad) * Math.cos(tr);
      const ty = ry * irad;
      const tz = (rr * irad + rad) * Math.sin(tr);
      const rx = rr * Math.cos(tr);
      const rz = rr * Math.sin(tr);
      pos.push(tx, ty, tz);
      nor.push(rx, ry, rz);
      const tc = hsva(360 / column * ii, 1, 1, 1);
      col.push(tc[0], tc[1], tc[2], tc[3]);
    }
  }
  for (let i = 0; i < row; i++) {
    for (let ii = 0; ii < column; ii++) {
      const r = (column + 1) * i + ii;
      idx.push(r, r + column + 1, r + 1);
      idx.push(r + column + 1, r + column + 2, r + 1);
    }
  }

  const ret = new Transform();
  const mesh = new Mesh();
  mesh.set_mesh([[att_p, pos, 3], [att_c, col, 4], [att_n, nor, 3], idx]);
  const mat = new Material(
      'assets/resource/shaders/base_phone.vert',
      'assets/resource/shaders/base_phone.frag', gl, resManager);
  mesh.set_mat(mat);
  ret.add_mesh(mesh);
  return new RObject({
    donghnut: ret,
  });
}

export function hsva(h: number, s: number, v: number, a: number) {
  if (s > 1 || v > 1 || a > 1) {
    return;
  }
  const th = h % 360;
  const i = Math.floor(th / 60);
  const f = th / 60 - i;
  const m = v * (1 - s);
  const n = v * (1 - s * f);
  const k = v * (1 - s * (1 - f));
  const color = new Array();
  if (s === 0) {
    color.push(v, v, v, a);
  } else {
    const r = new Array(v, n, m, m, k, v);
    const g = new Array(k, v, v, n, m, m);
    const b = new Array(m, m, k, v, v, n);
    color.push(r[i], g[i], b[i], a);
  }
  return color;
}

export function cube(side) {
  const s = (side || 1) / 2;
  const coords = [];
  const normals = [];
  const texCoords = [];
  const indices = [];
  function face(xyz, nrm) {
    const start = coords.length / 3;
    let i;
    for (i = 0; i < 12; i++) {
      coords.push(xyz[i]);
    }
    for (i = 0; i < 4; i++) {
      normals.push(nrm[0], nrm[1], nrm[2]);
    }
    texCoords.push(0, 0, 1, 0, 1, 1, 0, 1);
    indices.push(start, start + 1, start + 2, start, start + 2, start + 3);
  }
  face([-s, -s, s, s, -s, s, s, s, s, -s, s, s], [0, 0, 1]);
  face([-s, -s, -s, -s, s, -s, s, s, -s, s, -s, -s], [0, 0, -1]);
  face([-s, s, -s, -s, s, s, s, s, s, s, s, -s], [0, 1, 0]);
  face([-s, -s, -s, s, -s, -s, s, -s, s, -s, -s, s], [0, -1, 0]);
  face([s, -s, -s, s, s, -s, s, s, s, s, -s, s], [1, 0, 0]);
  face([-s, -s, -s, -s, -s, s, -s, s, s, -s, s, -s], [-1, 0, 0]);

  return [coords, texCoords, normals, indices];
}

export function skybox(
    srcs: string[], gl: WebGLRenderingContext, resManager: ResManager) {
  const m = cube(50);

  const ret = new Transform();
  const mesh = new Mesh();
  mesh.set_mesh([[att_p, m[0], 3], m[3]]);
  const mat = new Material(
      'assets/resource/shaders/skybox.vert',
      'assets/resource/shaders/skybox.frag', gl, resManager);
  const tex = new CubeTexture(srcs, gl, mat, resManager);
  mat.setUniformI1i('tex', tex, gl);
  mat.setUniform_1b('usetex', true, gl);
  mesh.set_mat(mat);
  ret.add_mesh(mesh);
  return new RObject({
    skybox: ret,
  });
}

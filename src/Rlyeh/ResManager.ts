export class ResManager {
  resRoot: string;
  modelsPath: string;
  shadersPath: string;
  skyboxPath: string;
  pool: {[key: string]: string|HTMLImageElement};

  constructor(root: string, model: string, shader: string, skybox: string) {
    this.pool = {};
    this.resRoot = root;
    this.modelsPath = model;
    this.shadersPath = shader;
    this.skyboxPath = skybox;
  }

  add(path: string, res: string|HTMLImageElement) {
    this.pool[path] = res;
  }

  get(path: string) {
    if (!this.pool[path]) {
      console.error('resManagr', 'individual path：' + path);
    } else {
      return this.pool[path];
    }
  }
}

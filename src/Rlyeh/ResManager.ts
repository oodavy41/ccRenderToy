export class ResManager {
  pool: {[key: string]: string|HTMLImageElement};

  constructor() {
    this.pool = {};
  }

  add(path: string, res: string|HTMLImageElement) {
    this.pool[path] = res;
  }

  get(path: string) {
    if (!this.pool[path]) {
      console.error('resManagr', 'indivial path' + path);
    } else {
      return this.pool[path];
    }
  }
}

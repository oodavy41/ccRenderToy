export class ResManager {

    pool: {};

    constructor() {
        this.pool = {};
    }

    add(path: string, res: any) {
        this.pool[path] = res;
    }

    get(path: string) {
        let ret = this.pool[path];
        return ret;
    }
}

export class ResManager {

    pool: { [key: string]: string | HTMLImageElement };

    constructor() {
        this.pool = {};
    }

    add(path: string, res: string | HTMLImageElement) {
        this.pool[path] = res;
    }

    get(path: string) {
        let ret = this.pool[path];
        return ret;
    }
}

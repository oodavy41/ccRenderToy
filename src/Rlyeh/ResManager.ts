export class ResManager {

    pool: {};

    constructor() {
        this.pool = {};
    }

    add(path: string, res: any) {
        this.pool[path] = res;
    }

    get(path: string) {
        return this.pool[path];
    }
}

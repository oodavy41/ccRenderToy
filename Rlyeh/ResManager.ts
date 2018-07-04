export class TexManager {

    loadProg: number;
    max: number;
    private promise: Function;
    private onProgChange: Function;

    constructor(promise: Function, onProgC: Function) {
        this.loadProg = 0;
        this.max = 0;
        this.promise = promise;
        this.onProgChange = onProgC;
    }

    request() {
        this.loadProg++;
        this.max++;
    }

    receive() {
        this.loadProg--;
        this.onProgChange()
        if (this.loadProg == 0) {
            this.promise();
        }
    }


}
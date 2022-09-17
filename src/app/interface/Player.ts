export class Player {
    seed: number;
    name: string;

    isWinner: boolean;

    constructor(seed: number, name: string) {
        this.seed = seed;
        this.name = name;
        this.isWinner = false;
    }

    public getSeed(): number {
        return this.seed;
    }

    public getName(): string {
        return this.name
    }

    public getInnerHTMLName(): string {
        return this.name.replace(/\s/g, '&nbsp;');
    }

    public clone(): Player {
        return new Player(this.seed, "Player " + this.seed);
    }

    isPlayerSet(): boolean {
        return this.seed !== 0;
    }

    unsetPlayer(): void {
        this.name = ''
        this.seed = 0;
    }

    static getVoidPlayer() {
        return new Player(0, '');
    }

}

export interface DoubleBinaryLeaf<T> {
  player1: T | undefined;
  player2: T | undefined;
  rightChild: DoubleBinaryLeaf<T> | undefined;
  leftChild: DoubleBinaryLeaf<T> | undefined;
}

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

  public clone(): Player {
    return new Player(this.seed, "" + this.name);
  }

  isPlayerSet(): boolean {
    return this.seed !== 0;
  }

  unsetPlayer(): void {
    this.name = 'Player 0'
    this.seed = 0;
  }

}

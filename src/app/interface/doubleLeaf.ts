export interface DoubleBinaryLeaf<T> {
  value1: T | undefined;
  value2: T | undefined;
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

}

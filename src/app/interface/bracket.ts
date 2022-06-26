import {DoubleBinaryLeaf, Player} from "./doubleLeaf";
// https://www.printyourbrackets.com/36seeded.html
// https://www.printyourbrackets.com/pdfbrackets/36-team-portrait-seeded.pdf
export class Bracket implements DoubleBinaryLeaf<Player> {
  leftChild: Bracket | undefined;
  rightChild: Bracket | undefined;
  parent: Bracket | null;
  player1: Player;
  player2: Player;

  winner: Player | undefined;

  maxDepth: number;

  constructor(player1: Player, player2: Player, parent: Bracket | null, maxDepth: number) {
    this.player1 = player1;
    this.player2 = player2;

    this.parent = parent;
    this.leftChild = undefined;
    this.rightChild = undefined;

    this.maxDepth = maxDepth;
  }

  public createNewLayers(depth: number, maxDepth: number) {
    this.maxDepth = maxDepth;
    if (depth < maxDepth) {
      if (this.rightChild === undefined || this.leftChild === undefined) {
        this.leftChild = new Bracket(this.player1.clone(), Bracket.getFirstOpponent(this.player1, depth), this, this.maxDepth);
        this.rightChild = new Bracket(this.player2.clone(), Bracket.getFirstOpponent(this.player2, depth), this, this.maxDepth);
        this.player1.unsetPlayer();
        this.player2.unsetPlayer();
      }
      this.rightChild.createNewLayers(depth + 1, maxDepth);
      this.leftChild.createNewLayers(depth + 1, maxDepth);
    }
  }

  public addOneAsLeftMostLeaf(depth: number, added: boolean): boolean {
    if (depth < this.maxDepth && !added) {
      if (this.leftChild === undefined) {
        this.leftChild = new Bracket(this.player1.clone(), Bracket.getFirstOpponent(this.player1.clone(), depth + 1), this, this.maxDepth);
        return true;
      }
      if (this.rightChild === undefined) {
        this.rightChild = new Bracket(this.player2.clone(), Bracket.getFirstOpponent(this.player1.clone(), depth + 1), this, this.maxDepth);
        return true;
      }
      if (!added) {
        added = this.leftChild.addOneAsLeftMostLeaf(depth + 1, added);
      }
      if (!added) {
        added = this.rightChild.addOneAsLeftMostLeaf(depth + 1, added);
      }
      return added;
    }
    return false;
  }

  public getLeftMostLeaf(node: Bracket): Bracket {
    if (this.leftChild !== undefined) {
      return this.getLeftMostLeaf(this.leftChild);
    }
    return this;
  }

  public getSubNodesAtSpecificDepth(depth: number, desiredDepth: number): Bracket[] {
    if (depth === desiredDepth) {
      return [this];
    } else {
      // @ts-ignore
      return [...this.leftChild?.getSubNodesAtSpecificDepth(depth + 1, desiredDepth), ...this.rightChild?.getSubNodesAtSpecificDepth(depth + 1, desiredDepth)];
    }
  }

  private static getFirstOpponent(player: Player, depth: number): Player {
    const placement = this.getFirstOpponentSeed(player.seed, depth);
    return new Player(placement,"Player " + placement);
  }

  private static getFirstOpponentSeed(seed: number, depth: number): number {
    return Math.pow(2, depth + 1) + 1 - seed;
  }

  public addNextOpponnent(depth: number, added: boolean, nextOpponentSeed: number, bracketSeedOpponent: number): boolean {
    if (depth < this.maxDepth && !added) {
      if (this.player1.seed === bracketSeedOpponent) {
        if (this.leftChild === undefined) {
          this.leftChild = new Bracket(this.player1.clone(), Bracket.getFirstOpponent(this.player1, depth + 1), this, this.maxDepth);
          this.player1.unsetPlayer();
          return true;
        }
        if (this.rightChild === undefined) {
          this.rightChild = new Bracket(this.player1.clone(), Bracket.getFirstOpponent(this.player1, depth + 1), this, this.maxDepth);
          this.player1.unsetPlayer();
          return true;
        }
      } else if (this.player2.seed === bracketSeedOpponent) {
        if (this.leftChild === undefined) {
          this.leftChild = new Bracket(this.player2.clone(), Bracket.getFirstOpponent(this.player2, depth + 1), this, this.maxDepth);
          this.player2.unsetPlayer();
          return true;
        }
        if (this.rightChild === undefined) {
          this.rightChild = new Bracket(this.player2.clone(), Bracket.getFirstOpponent(this.player2, depth + 1), this, this.maxDepth);
          this.player2.unsetPlayer();
          return true;
        }
      }
      if (!added && this.leftChild !== undefined) {
        added = this.leftChild.addNextOpponnent(depth + 1, added, nextOpponentSeed, bracketSeedOpponent);
      }
      if (!added && this.rightChild !== undefined) {
        added = this.rightChild.addNextOpponnent(depth + 1, added, nextOpponentSeed, bracketSeedOpponent);
      }
      return added;
    }
    return false;
  }

  public addNextOpponentInterface() {
    const nextOpponentSeed = this.getNextOpponentSeed()
    console.log(Bracket.getFirstOpponentSeed(nextOpponentSeed, this.maxDepth));
    console.log(nextOpponentSeed);
    this.addNextOpponnent(0, false, nextOpponentSeed, Bracket.getFirstOpponentSeed(nextOpponentSeed, this.maxDepth));
  }

  public getNextOpponentSeed(): number {
    if (this.leftChild !== undefined && this.rightChild !== undefined)
      return Math.max(this.player1.seed, this.player2.seed, this.leftChild.getNextOpponentSeed(), this.rightChild.getNextOpponentSeed());
    else if (this.leftChild !== undefined)
      return Math.max(this.player1.seed, this.player2.seed, this.leftChild.getNextOpponentSeed());
    else if (this.rightChild !== undefined)
      return Math.max(this.player1.seed, this.player2.seed,this.rightChild.getNextOpponentSeed());
    else
      // On ne retourne plus 1 qu'ici parce que le plus grand est forcément dans une leaf, vu la construction de l'arbre
      return Math.max(this.player1.seed, this.player2.seed) + 1;
  }

  declareWinner(bracket: Bracket) {
    if (bracket === this.leftChild && bracket.winner) {
      this.player1 = bracket.winner;
    } else if (bracket === this.rightChild && bracket.winner) {
      this.player2 = bracket.winner;
    }
  }

  public createLoserLayer(depth: number, maxDepth: number) {
    /*
    this.maxDepth = maxDepth;
    if (depth < maxDepth) {
      if (this.rightChild === undefined || this.leftChild === undefined) {
        this.leftChild = new Bracket(this.player1.clone(), Bracket.getFirstOpponent(this.player1, depth), this, this.maxDepth);
        this.rightChild = new Bracket(this.player2.clone(), Bracket.getFirstOpponent(this.player2, depth), this, this.maxDepth);
        this.player1.unsetPlayer();
        this.player2.unsetPlayer();
      }
      this.rightChild.createNewLayers(depth + 1, maxDepth);
      this.leftChild.createNewLayers(depth + 1, maxDepth);
    }
    */
    this.maxDepth = maxDepth;
    if (depth < maxDepth * 2) {
      if (depth % 2 === 0) {
        this.leftChild = new Bracket(this.player1.clone(), Bracket.getFirstOpponent(this.player1, depth), this, this.maxDepth);
        this.leftChild.createLoserLayer(depth + 1, maxDepth);
      } else {
        this.leftChild = undefined;
      }
      this.rightChild = new Bracket(this.player2.clone(), Bracket.getFirstOpponent(this.player2, depth), this, this.maxDepth);
      this.player1.unsetPlayer();
      this.player2.unsetPlayer();
      this.rightChild.createLoserLayer(depth + 1, maxDepth);
    }
  }

  public maxBracketDepth(depth: number): number {
    if (this.leftChild === undefined && this.rightChild === undefined) {
      return depth;
    } else {
      return Math.max(
        this.leftChild ? this.leftChild.maxBracketDepth(depth + 1) : depth,
        this.rightChild ? this.rightChild.maxBracketDepth(depth + 1) : depth
      );
    }
  }

}

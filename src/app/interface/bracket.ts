import {DoubleBinaryLeaf, Player} from "./doubleLeaf";
// https://www.printyourbrackets.com/36seeded.html
// https://www.printyourbrackets.com/pdfbrackets/36-team-portrait-seeded.pdf
export class Bracket implements DoubleBinaryLeaf<Player> {
  leftChild: Bracket | undefined;
  rightChild: Bracket | undefined;
  parent: Bracket | null;
  player1: Player;
  player2: Player;
  matchNumber: number = 999;

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

  public getNbLeaf(): number {
    if (this.leftChild !== undefined && this.rightChild !== undefined)
      return this.leftChild.getNbLeaf() + this.rightChild.getNbLeaf();
    else if (this.leftChild === undefined && this.rightChild !== undefined)
      return 1 + this.rightChild.getNbLeaf();
    else if  (this.leftChild !== undefined && this.rightChild == undefined)
      return this.leftChild.getNbLeaf() + 1;
    else
      return 2
  }

  public getNbLeafFromRoot(): number {
    let root;
    if (this.parent !== null) {
      let parent = this.parent
      while (parent.parent !== null) {
        parent = parent.parent;
      }
      root = parent;
    } else {
      root = this
    }
    return root.getNbLeaf();
  }

  /*
  // @ts-ignore
  public getNbLeaf(): number {
    if (this.player1.isPlayerSet() && this.player2.isPlayerSet())
      return 2;
    else if (this.player1.isPlayerSet() && !this.player2.isPlayerSet() && this.rightChild !== undefined)
      return 1 + this.rightChild.getNbLeaf();
    else if  (!this.player1.isPlayerSet() && this.leftChild !== undefined && this.player2.isPlayerSet())
      return this.leftChild.getNbLeaf() + 1;
    else if (this.rightChild !== undefined && this.leftChild !== undefined)
      return this.leftChild.getNbLeaf() + this.rightChild.getNbLeaf()
  }
  */

  public getSubNodesAtSpecificDepth(depth: number, desiredDepth: number): Bracket[] {
    if (depth === desiredDepth) {
      return [this];
    } else {
      if (this.leftChild !== undefined && this.rightChild !== undefined)
        return [...this.leftChild.getSubNodesAtSpecificDepth(depth + 1, desiredDepth), ...this.rightChild.getSubNodesAtSpecificDepth(depth + 1, desiredDepth)];
      else if (this.leftChild !== undefined && this.rightChild === undefined)
        return [...this.leftChild.getSubNodesAtSpecificDepth(depth + 1, desiredDepth)]
      else if (this.leftChild === undefined && this.rightChild !== undefined)
        return [...this.rightChild.getSubNodesAtSpecificDepth(depth + 1, desiredDepth)]
      else
        return []
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
      } else if (this.player2.seed === bracketSeedOpponent) {
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
    // console.log(Bracket.getFirstOpponentSeed(nextOpponentSeed, this.maxDepth));
    // console.log(nextOpponentSeed);
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
    this.maxDepth = maxDepth;
    if (depth < maxDepth * 2) {
      if (depth % 2 === 0) {
        this.leftChild = new Bracket(this.player1.clone(), new Player(this.getNbLeafFromRoot() + 1 , 'Player ' + (this.getNbLeafFromRoot() + 1)), this, this.maxDepth);
        this.leftChild.createLoserLayer(depth + 1, maxDepth);
      } else {
        this.leftChild = undefined;
      }
      this.rightChild = new Bracket(this.player2.clone(), new Player(this.getNbLeafFromRoot() + 1 , 'Player ' + (this.getNbLeafFromRoot() + 1)), this, this.maxDepth);
      this.player1.unsetPlayer();
      this.player2.unsetPlayer();
      this.rightChild.createLoserLayer(depth + 1, maxDepth);
    }
  }

  public addNextLoserOpponnent(depth: number, added: boolean, nextOpponentSeed: number, bracketSeedOpponent: number, maxDepth: number): boolean {
    this.maxDepth = maxDepth;
    // console.log(maxDepth);
    if (!added && depth < this.maxDepth * 2) {
      if (depth % 2 !== 0) {
        if (this.rightChild !== undefined)
          added = this.rightChild.addNextLoserOpponnent(depth + 1, added, nextOpponentSeed, bracketSeedOpponent, maxDepth)
        else {
          this.rightChild = new Bracket(this.player2.clone(), new Player(this.getNbLeafFromRoot() + 1 , 'Player ' + (this.getNbLeafFromRoot() + 1)), this, this.maxDepth);
          // this.player2.unsetPlayer();
          this.player2.name = 'rightChild dad';
          return true;
        }
      } else {
        if (this.leftChild === undefined) {
          this.leftChild = new Bracket(this.player1.clone(), new Player(this.getNbLeaf() + 1 , 'Player ' + (this.getNbLeaf() + 1)), this, this.maxDepth);
          // this.player1.unsetPlayer();
          this.player1.name = 'leftChild dad';
          return true;
        } else if (this.rightChild === undefined) {
          this.rightChild = new Bracket(this.player2.clone(), new Player(this.getNbLeaf() + 1 , 'Player ' + (this.getNbLeaf() + 1)), this, this.maxDepth);
          // this.player2.unsetPlayer();
          this.player2.name = 'rightChild dad';
          return true;
        } else {
          // console.log('------')
          // console.log(depth + " | " + this.player1.seed + " & " + this.player2.seed)
          // console.log(" - self maxDepthOfBracket : " + this.maxDepthOfBracket())
          // console.log(" - self maxDepthWidth : " + this.maxDepthWidth(depth))
          // console.log(" - left maxDepthOfBracket : " + this.leftChild.maxDepthOfBracket())
          // console.log(" - right maxDepthOfBracket : " + this.rightChild.maxDepthOfBracket())
          // console.log(" - left maxDepthWidth : " + this.leftChild.maxDepthWidth(depth))
          // console.log(" - right maxDepthWidth : " + this.rightChild.maxDepthWidth(depth))
          // console.log(this.getSubNodesAtSpecificDepth(depth, this.maxDepthOfBracket() + 2))
          if (this.leftChild.maxDepthOfBracket() > this.rightChild.maxDepthOfBracket() || this.leftChild.maxDepthWidth(depth) > this.rightChild.maxDepthWidth(depth)) {
            added = this.rightChild.addNextLoserOpponnent(depth + 1, added, nextOpponentSeed, bracketSeedOpponent, maxDepth)
            // console.log('Choix à droite !')
          }
          if (!added) {
            added = this.leftChild.addNextLoserOpponnent(depth + 1, added, nextOpponentSeed, bracketSeedOpponent, maxDepth)
          }
        }
      }
      return added;
    }
    // console.log("Raté ... depth : " + depth + " | " + this.player1.name + " & " + this.player2.name);
    return false;
  }

  public maxDepthWidth(depth: number): number {
    return this.getSubNodesAtSpecificDepth(1, this.maxDepthOfBracket()).length
  }

  public addNextLoserOpponentInterface(nbPlayer: number) {
    const nbLooser = nbPlayer - 1;
    const x = Math.floor(Math.log2(nbPlayer - 1) / Math.log2(2));
    // console.log('x :', x);
    let nbOfLeftAlone = 0;
    for (let i = 1; i < x; i++) {
      nbOfLeftAlone += Math.pow(2, i);
    }
    nbOfLeftAlone++;
    // console.log('nbOfLeftAlone :', nbOfLeftAlone);
    const test = nbOfLeftAlone + Math.pow(2, x - 1) * 2;
    // console.log('test :', test);
    // console.log('Math.pow(2, x - 1) :', Math.pow(2, x - 1));
    this.maxDepth = x;
    // console.log('maxDepth :', this.maxDepth);
    const nextOpponentSeed = this.getNextOpponentSeed()
    // console.log(Bracket.getFirstOpponentSeed(nextOpponentSeed, this.maxDepth));
    // console.log(nextOpponentSeed);
    this.addNextLoserOpponnent(1, false, nextOpponentSeed, Bracket.getFirstOpponentSeed(nextOpponentSeed, this.maxDepth), this.maxDepth);
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

  public maxDepthOfBracket(): number {
    if (this.leftChild !== undefined && this.rightChild !== undefined)
      return 1 + Math.max(this.leftChild.maxDepthOfBracket(), this.rightChild.maxDepthOfBracket())
    else if (this.leftChild !== undefined && this.rightChild === undefined)
      return 1 + this.leftChild.maxDepthOfBracket()
    else if (this.leftChild === undefined && this.rightChild !== undefined)
      return 1 + this.rightChild.maxDepthOfBracket()
    else
      return 1;
  }

}

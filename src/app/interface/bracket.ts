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

  public getMaxDepthFromRoot(): number {
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
    return root.maxDepthOfBracket();
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
      if (this.leftChild !== undefined && this.rightChild !== undefined) {
        return [...this.leftChild.getSubNodesAtSpecificDepth(depth + 1, desiredDepth), ...this.rightChild.getSubNodesAtSpecificDepth(depth + 1, desiredDepth)];
      } else if (this.leftChild !== undefined && this.rightChild === undefined) {
        return [...this.leftChild.getSubNodesAtSpecificDepth(depth + 1, desiredDepth)]
      } else if (this.leftChild === undefined && this.rightChild !== undefined) {
        return [...this.rightChild.getSubNodesAtSpecificDepth(depth + 1, desiredDepth)]
      } else
        return []
    }
  }

  public getSubNodesAtSpecificDepthWithLogs(depth: number, desiredDepth: number): Bracket[] {
    console.log('Je suis :', this)
    // console.log('Je suis :', this.matchNumber);
    if (depth === desiredDepth) {
      console.log('Je me suis retourné');
      console.log(this.rightChild);
      console.log(this.leftChild);
      return [this];
    } else {
      if (this.leftChild !== undefined && this.rightChild !== undefined) {
        console.log("J'ai retourné les deux");
        return [...this.leftChild.getSubNodesAtSpecificDepthWithLogs(depth + 1, desiredDepth), ...this.rightChild.getSubNodesAtSpecificDepthWithLogs(depth + 1, desiredDepth)];
      } else if (this.leftChild !== undefined && this.rightChild === undefined) {
        console.log("J'ai retourné leftChild");
        return [...this.leftChild.getSubNodesAtSpecificDepthWithLogs(depth + 1, desiredDepth)]
      } else if (this.leftChild === undefined && this.rightChild !== undefined) {
        console.log("J'ai retourné rightChild");
        return [...this.rightChild.getSubNodesAtSpecificDepthWithLogs(depth + 1, desiredDepth)]
      } else
        console.log("Je n'ai rien retourné");
      return []
    }
  }

  private static getFirstOpponent(player: Player, depth: number): Player {
    const placement = this.getFirstOpponentSeed(player.getSeed(), depth);
    return new Player(placement,"Player " + placement);
  }

  private static getFirstOpponentSeed(seed: number, depth: number): number {
    return Math.pow(2, depth + 1) + 1 - seed;
  }

  public addNextOpponnent(depth: number, added: boolean, nextOpponentSeed: number, bracketSeedOpponent: number): boolean {
    if (depth < this.maxDepth && !added) {
      if (this.player1.getSeed() === bracketSeedOpponent) {
        if (this.leftChild === undefined) {
          this.leftChild = new Bracket(this.player1.clone(), Bracket.getFirstOpponent(this.player1, depth + 1), this, this.maxDepth);
          this.player1.unsetPlayer();
          return true;
        }
      } else if (this.player2.getSeed() === bracketSeedOpponent) {
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
      return Math.max(this.player1.getSeed(), this.player2.getSeed(), this.leftChild.getNextOpponentSeed(), this.rightChild.getNextOpponentSeed());
    else if (this.leftChild !== undefined)
      return Math.max(this.player1.getSeed(), this.player2.getSeed(), this.leftChild.getNextOpponentSeed());
    else if (this.rightChild !== undefined)
      return Math.max(this.player1.getSeed(), this.player2.getSeed(),this.rightChild.getNextOpponentSeed());
    else
      // On ne retourne plus 1 qu'ici parce que le plus grand est forcément dans une leaf, vu la construction de l'arbre
      return Math.max(this.player1.getSeed(), this.player2.getSeed()) + 1;
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

  public addNextLoserOpponnent(depth: number, added: boolean, nextOpponentSeed: number, bracketSeedOpponent: number, maxDepth: number, i: number): boolean {
    this.maxDepth = maxDepth;
    // console.log(maxDepth);
    if (!added && depth < this.maxDepth * 2) {
      if (depth % 2 !== 0) {
        console.log('Je suis sens unique.');
        if (this.rightChild !== undefined) {
          console.log("Et j'envoie sur ma droite, car déjà définie.")
          added = this.rightChild.addNextLoserOpponnent(depth + 1, added, nextOpponentSeed, bracketSeedOpponent, maxDepth, i)
        } else {
          this.rightChild = new Bracket(this.player2.clone(), new Player(this.getNbLeafFromRoot() + 1 , 'Player ' + (this.getNbLeafFromRoot() + 1)), this, this.maxDepth);
          this.player2.unsetPlayer();
          this.player1 = new Player(0, 'Perdant de x');
          console.log(this.rightChild);
          // this.player2.name = 'rightChild dad';
          console.log(this)
          return true;
        }
      } else {
        if (this.rightChild === undefined) {
          this.rightChild = new Bracket(this.player2.clone(), new Player(this.getNbLeaf() + 1 , 'Player ' + (this.getNbLeaf() + 1)), this, this.maxDepth);
          this.player2.unsetPlayer();
          // console.log(this.rightChild);
          // this.player2.name = 'rightChild dad';
          console.log(this)
          return true;
        } else if (this.leftChild === undefined) {
          this.leftChild = new Bracket(this.player1.clone(), new Player(this.getNbLeaf() + 1 , 'Player ' + (this.getNbLeaf() + 1)), this, this.maxDepth);
          this.player1.unsetPlayer();
          // console.log(this.leftChild);
          // this.player1.name = 'leftChild dad';
          console.log(this)
          return true;
        } else  {
          // console.log('------')
          // console.log(depth + " | " + this.player1.seed + " & " + this.player2.seed)
          // console.log(" - self maxDepthOfBracket : " + this.maxDepthOfBracket())
          // console.log(" - self maxDepthWidth : " + this.maxDepthWidth(depth))
          // console.log(" - left maxDepthOfBracket : " + this.leftChild.maxDepthOfBracket())
          // console.log(" - right maxDepthOfBracket : " + this.rightChild.maxDepthOfBracket())
          // console.log(" - left maxDepthWidth : " + this.leftChild.maxDepthWidth(depth))
          // console.log(" - right maxDepthWidth : " + this.rightChild.maxDepthWidth(depth))
          // console.log(this.getSubNodesAtSpecificDepth(depth, this.maxDepthOfBracket() + 2))
          // if (this.leftChild.maxBracketDepth(1) > this.rightChild.maxBracketDepth(1)
          //   || (this.leftChild.maxDepthWidth() > this.rightChild.maxDepthWidth() || (
          //      i % 4 > 1 && this.parent &&  this.parent.isRoot()) )) {
          //   console.log('--!!!!!!!!!!!!!!--!!!!!!!!!!!!!!--');
          //   console.log(i%4)
          //   console.log(this);
          //   console.log(this.leftChild.getSubNodesAtSpecificDepthWithLogs(1, this.leftChild.maxBracketDepth(1)));
          //   console.log(this.rightChild.getSubNodesAtSpecificDepthWithLogs(1, this.rightChild.maxBracketDepth(1)));
          //   console.log(this.leftChild.maxDepthOfBracket() > this.rightChild.maxDepthOfBracket());
          //   console.log(this.leftChild.maxBracketDepth(1) + '>' + this.rightChild.maxBracketDepth(1));
          //   console.log(this.leftChild.maxDepthWidth() > this.rightChild.maxDepthWidth());
          //   console.log(this.maxDepthOfBracket());
          //   added = this.rightChild.addNextLoserOpponnent(depth + 1, added, nextOpponentSeed, bracketSeedOpponent, maxDepth, i)
          //   console.log('Choix à droite !')
          // }
          // if (this.maxBracketDepth(1) === 2 && (i%x)%y === 0)
          /*
          * L'idée est de voir si il y a un motif qui se dégage de la pette échelle, un motif de l'échelle plus gande, et un motif de l'encore plus grande.
          * Et voir comment on peut les appliquer, comment on les détecte.
          * Mais il me semble que l'histoire du motif est une bonne piste.
          * Meilleure que les autres, en tout cas !
          */
          console.log('-------------')
          console.log(this)
          console.log('i :', i)
          // console.log('this.getDepth(1) :', this.getDepth(1))
          // console.log('this.getDepth(1) * 2 :', this.getDepth(1) * 2)
          // console.log('i % this.getDepth(1) * 2 :', i % (this.getDepth(1) * 2))
          // console.log('this.getDepth(1) - 1 :', this.getDepth(1) - 1)
          // console.log((i % (this.getDepth(1) * 2))  + '>' + (this.getDepth(1) - 1))
          // console.log((i % (this.getDepth(1) * 2)) > (this.getDepth(1) - 1))

          // console.log('___')
          // console.log('this.getDepth(1) :', this.getDepth(1))
          // console.log('this.getDepth(1) / 2 :', this.getDepth(1) / 2)
          // console.log('this.getDepth(0) :', this.getDepth(0))
          // console.log('this.getDepth(0) - 1 :', this.getDepth(0) - 1)
          // console.log('this.getDepth(0) / 2 :', this.getDepth(0) / 2)
          // console.log('2 * (this.getDepth(0) - 1) :',  2 * (this.getDepth(0) - 1))
          // console.log('((this.getDepth(1) * 2) / (2 * (this.getDepth(0) - 1))) :', ((this.getDepth(1) * 2) / (2 * (this.getDepth(0) - 1))))
          // console.log('((this.getDepth(1) * 2) / Math.pow(2, this.getDepth(0) - 1)) :', ((this.getDepth(1) * 2) / (2 * (this.getDepth(0) - 1))))
          // console.log()
          // console.log()
          console.log('this.getDepth(1) :', this.getDepth(1))
          console.log('this.getDepth(1) / 2 :', this.getDepth(1) / 2)
          console.log('(this.getDepth(1) / 2) + 1 :', (this.getDepth(1) / 2) + 1)
          console.log('Math.pow(2, (this.getDepth(1) / 2) + 1) :',  Math.pow(2, (this.getDepth(1) / 2) + 1))
          console.log('i % Math.pow(2, (this.getDepth(1) / 2) + 1) :',  i % Math.pow(2, (this.getDepth(1) / 2) + 1))
          console.log('(Math.pow(2, (this.getDepth(1) / 2) + 1) / 2) - 1 :',  (Math.pow(2, (this.getDepth(1) / 2) + 1) / 2) - 1)
          console.log((i % Math.pow(2, (this.getDepth(1) / 2) + 1)) + '>' + ((Math.pow(2, (this.getDepth(1) / 2) + 1) / 2) - 1))
          console.log(i % Math.pow(2, (this.getDepth(1) / 2) + 1) > (Math.pow(2, (this.getDepth(1) / 2) + 1) / 2) - 1)
          console.log(added)
          // console.log(this.maxBracketDepth(0))
          // console.log(i % 4 > 1 && this.parent && this.parent.isRoot())
          // console.log(this.leftChild === undefined && this.rightChild === undefined)
          // console.log(this.maxBracketDepth(0) === 1)
          // console.log(this.maxBracketDepth(0) === 3 && this.leftChild.maxBracketDepth(1) > this.rightChild.maxBracketDepth(1))
          // console.log(this.maxBracketDepth(0) === 3 && this.leftChild.maxBracketDepth(1) === 3 && this.rightChild.maxDepthWidth() === 2)
          // console.log()
          if (
            i % Math.pow(2, (this.getDepth(1) / 2) + 1) > (Math.pow(2, (this.getDepth(1) / 2) + 1) / 2) - 1
            || this.leftChild.maxBracketDepth(0) > this.rightChild.maxBracketDepth(0)
            // ||
            // !(this.parent &&  this.parent.isRoot()) &&
            // (
            //   this.leftChild === undefined && this.rightChild === undefined ||
            //   this.maxBracketDepth(0) === 1 ||
            //   (this.maxBracketDepth(0) === 3 &&
            //   (
            //     this.leftChild.maxBracketDepth(0) > this.rightChild.maxBracketDepth(0) ||
            //     this.leftChild.maxBracketDepth(0) === 2 && this.maxDepthWidth() === 2
            //   ))
            // )
          ) {
            console.log("J'envoie à droite !")
            added = this.rightChild.addNextLoserOpponnent(depth + 1, added, nextOpponentSeed, bracketSeedOpponent, maxDepth, i)
          }
        if ((i % Math.pow(2, (this.getDepth(1) / 2) + 1) > (Math.pow(2, (this.getDepth(1) / 2) + 1) / 2) - 1) && !added){
          console.error("En fait non !")
        }
          if (!added) {
            console.log("J'envoie à gauche, sur :", this.leftChild);
            added = this.leftChild.addNextLoserOpponnent(depth + 1, added, nextOpponentSeed, bracketSeedOpponent, maxDepth, i)
          }
        }
      }
      return added;
    }
    // console.log("Raté ... depth : " + depth + " | " + this.player1.name + " & " + this.player2.name);
    return false;
  }

  public maxDepthWidth(): number {
    return this.getSubNodesAtSpecificDepth(1, this.maxBracketDepth(1)).length
  }

  public addNextLoserOpponentInterface(nbPlayer: number, i: number) {
    const x = Math.floor(Math.log2(i - 1 ) / Math.log2(2));
    // console.log('x :', x);
    let nbOfLeftAlone = 0;
    for (let i = 1; i < x; i++) {
      nbOfLeftAlone += Math.pow(2, i);
    }
    nbOfLeftAlone++;
    // console.log('nbOfLeftAlone :', nbOfLeftAlone);
    // const test = nbOfLeftAlone + Math.pow(2, x - 1) * 2;
    // console.log('test :', test);
    // console.log('Math.pow(2, x - 1) :', Math.pow(2, x - 1));
    this.maxDepth = x;
    // console.log('maxDepth :', this.maxDepth);
    const nextOpponentSeed = this.getNextOpponentSeed()
    // console.log(Bracket.getFirstOpponentSeed(nextOpponentSeed, this.maxDepth));
    // console.log(nextOpponentSeed);
    this.addNextLoserOpponnent(1, false, nextOpponentSeed, Bracket.getFirstOpponentSeed(nextOpponentSeed, this.maxDepth), this.maxDepth, i);
  }

  public maxBracketDepth(depth: number): number {
    // console.log('maxBracketDepth', this);
    if (this.leftChild === undefined && this.rightChild === undefined) {
      return depth;
    } else {
      return Math.max(
        this.leftChild !== undefined ? this.leftChild.maxBracketDepth(depth + 1) : depth,
        this.rightChild !== undefined ? this.rightChild.maxBracketDepth(depth + 1) : depth
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

  print(): any {
    if (this.leftChild === undefined && this.rightChild === undefined) {
      return {'amatchNumber' : this.matchNumber};
    } else if (this.leftChild !== undefined && this.rightChild === undefined) {
      return {'amatchNumber' : this.matchNumber, 'l' : this.leftChild.print()}
    } else if (this.leftChild === undefined && this.rightChild !== undefined) {
      return {'amatchNumber' : this.matchNumber, 'r' : this.rightChild.print()}
    } else if (this.leftChild !== undefined && this.rightChild !== undefined) {
      return {'amatchNumber' : this.matchNumber, 'r' : this.rightChild.print(), 'l' : this.leftChild.print()}
    } else
      throw new Error('print failed');

  }

  isRoot() {
    return this.parent === null;
  }

  getDepth(depth: number): number {
    if(this.parent)
      return this.parent.getDepth(depth + 1);
    else
      return depth;
  }

  setPlayers(players: Player[]) {
    if(this.player1.isPlayerSet()) {
      let i = 0;
      this.player1 = players[this.player1.seed - 1];
    } else {
      this.leftChild?.setPlayers(players);
    }

    if(this.player2.isPlayerSet()) {
      let i = 0;
      this.player2 = players[this.player2.seed - 1];
    } else {
      this.rightChild?.setPlayers(players);
    }

  }

}

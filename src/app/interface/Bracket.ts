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

    constructor(player1: Player, player2: Player, parent: Bracket | null, maxDepth: number, leftChild: Bracket | undefined = undefined, rightChild: Bracket | undefined = undefined) {
        this.player1 = player1;
        this.player2 = player2;

        this.parent = parent;
        this.leftChild = leftChild;
        this.rightChild = rightChild;

        this.maxDepth = maxDepth;
    }

    // public addOneAsLeftMostLeaf(depth: number, added: boolean): boolean {
    //     if (depth < this.maxDepth && !added) {
    //         if (this.leftChild === undefined) {
    //             this.leftChild = new Bracket(this.player1.clone(), Bracket.getFirstOpponent(this.player1.clone(), depth + 1), this, this.maxDepth);
    //             return true;
    //         }
    //         if (this.rightChild === undefined) {
    //             this.rightChild = new Bracket(this.player2.clone(), Bracket.getFirstOpponent(this.player1.clone(), depth + 1), this, this.maxDepth);
    //             return true;
    //         }
    //         if (!added) {
    //             added = this.leftChild.addOneAsLeftMostLeaf(depth + 1, added);
    //         }
    //         if (!added) {
    //             added = this.rightChild.addOneAsLeftMostLeaf(depth + 1, added);
    //         }
    //         return added;
    //     }
    //     return false;
    // }

    public getLeftMostLeaf(): Bracket {
        if (this.leftChild !== undefined) {
            return this.leftChild.getLeftMostLeaf();
        }
        return this;
    }

    public getNbLeaf(): number {
        if (this.leftChild !== undefined && this.rightChild !== undefined)
            return this.leftChild.getNbLeaf() + this.rightChild.getNbLeaf();
        else if (this.leftChild === undefined && this.rightChild !== undefined)
            return 1 + this.rightChild.getNbLeaf();
        else if (this.leftChild !== undefined && this.rightChild == undefined)
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

    protected static getFirstOpponent(player: Player, depth: number): Player {
        const placement = this.getFirstOpponentSeed(player.getSeed(), depth);
        return new Player(placement, "Player " + placement);
    }

    protected static getFirstOpponentSeed(seed: number, depth: number): number {
        return Math.pow(2, depth + 1) + 1 - seed;
    }

    public getNextOpponentSeed(): number {
        if (this.leftChild !== undefined && this.rightChild !== undefined)
            return Math.max(this.player1.getSeed(), this.player2.getSeed(), this.leftChild.getNextOpponentSeed(), this.rightChild.getNextOpponentSeed());
        else if (this.leftChild !== undefined)
            return Math.max(this.player1.getSeed(), this.player2.getSeed(), this.leftChild.getNextOpponentSeed());
        else if (this.rightChild !== undefined)
            return Math.max(this.player1.getSeed(), this.player2.getSeed(), this.rightChild.getNextOpponentSeed());
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

    public maxDepthWidth(): number {
        return this.getSubNodesAtSpecificDepth(1, this.maxBracketDepth(1)).length
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
            return {'amatchNumber': this.matchNumber};
        } else if (this.leftChild !== undefined && this.rightChild === undefined) {
            return {'amatchNumber': this.matchNumber, 'l': this.leftChild.print()}
        } else if (this.leftChild === undefined && this.rightChild !== undefined) {
            return {'amatchNumber': this.matchNumber, 'r': this.rightChild.print()}
        } else if (this.leftChild !== undefined && this.rightChild !== undefined) {
            return {'amatchNumber': this.matchNumber, 'r': this.rightChild.print(), 'l': this.leftChild.print()}
        } else
            throw new Error('print failed');

    }

    isRoot() {
        return this.parent === null;
    }

    getDepth(depth: number): number {
        if (this.parent)
            return this.parent.getDepth(depth + 1);
        else
            return depth;
    }

    setPlayers(players: Player[]) {
        if (this.player1.isPlayerSet()) {
            this.player1 = players[this.player1.seed - 1];
        } else {
            this.leftChild?.setPlayers(players);
        }

        if (this.player2.isPlayerSet()) {
            this.player2 = players[this.player2.seed - 1];
        } else {
            this.rightChild?.setPlayers(players);
        }

    }

}

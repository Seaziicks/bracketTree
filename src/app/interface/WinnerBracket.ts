import {Bracket} from "./Bracket";
import {Player} from "./DoubleLeaf";

export class WinnerBracket extends Bracket {

    leftChild: WinnerBracket | undefined;
    rightChild: WinnerBracket | undefined;

    constructor(player1: Player, player2: Player, parent: Bracket | null, maxDepth: number, leftChild : WinnerBracket | undefined = undefined, rightChild : WinnerBracket | undefined = undefined) {
        super(player1, player2, parent, maxDepth, leftChild, rightChild);
    }

    public createNewLayers(depth: number, maxDepth: number) {
        this.maxDepth = maxDepth;
        if (depth < maxDepth) {
            if (this.rightChild === undefined || this.leftChild === undefined) {
                this.leftChild = new WinnerBracket(this.player1.clone(), Bracket.getFirstOpponent(this.player1, depth), this, this.maxDepth);
                this.rightChild = new WinnerBracket(this.player2.clone(), Bracket.getFirstOpponent(this.player2, depth), this, this.maxDepth);
                this.player1.unsetPlayer();
                this.player2.unsetPlayer();
            }
            this.rightChild.createNewLayers(depth + 1, maxDepth);
            this.leftChild.createNewLayers(depth + 1, maxDepth);
        }
    }

    public addNextOpponnent(depth: number, added: boolean, nextOpponentSeed: number, bracketSeedOpponent: number): boolean {
        if (depth < this.maxDepth && !added) {
            if (this.player1.getSeed() === bracketSeedOpponent) {
                if (this.leftChild === undefined) {
                    this.leftChild = new WinnerBracket(this.player1.clone(), Bracket.getFirstOpponent(this.player1, depth + 1), this, this.maxDepth);
                    this.player1.unsetPlayer();
                    return true;
                }
            } else if (this.player2.getSeed() === bracketSeedOpponent) {
                if (this.rightChild === undefined) {
                    this.rightChild = new WinnerBracket(this.player2.clone(), Bracket.getFirstOpponent(this.player2, depth + 1), this, this.maxDepth);
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
}

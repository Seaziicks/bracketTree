import {Bracket} from "./Bracket";
import {Player} from "./Player";

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

    public addNextOpponnent(depth: number, added: WinnerBracket | undefined, nextOpponentSeed: number, bracketSeedOpponent: number): WinnerBracket | undefined {
        // console.log(depth < this.maxDepth);
        // console.log("nextOpponentSeed", nextOpponentSeed);
        // console.log("bracketSeedOpponent", bracketSeedOpponent);
        if (depth < this.maxDepth && !added) {
            if (this.player1.getSeed() === bracketSeedOpponent) {
                if (this.leftChild === undefined) {
                    this.leftChild = new WinnerBracket(this.player1.clone(), Bracket.getFirstOpponent(this.player1, depth + 1), this, this.maxDepth);
                    this.player1.unsetPlayer();
                    return this.leftChild;
                }
            } else if (this.player2.getSeed() === bracketSeedOpponent) {
                if (this.rightChild === undefined) {
                    this.rightChild = new WinnerBracket(this.player2.clone(), Bracket.getFirstOpponent(this.player2, depth + 1), this, this.maxDepth);
                    this.player2.unsetPlayer();
                    return this.rightChild;
                }
            }
            if (!added && this.leftChild !== undefined) {
                added = this.leftChild.addNextOpponnent(depth + 1, added, nextOpponentSeed, bracketSeedOpponent);
            }
            if (!added && this.rightChild !== undefined) {
                added = this.rightChild.addNextOpponnent(depth + 1, added, nextOpponentSeed, bracketSeedOpponent);
            }
            // console.log("ok : ", added)
            return added;
        }
        console.error("Ah rarf !");
        return undefined;
    }

    public addNextOpponentInterface(nbPlayers: number, i: number): WinnerBracket | undefined {
        const nextOpponentSeed = this.getNextOpponentSeed()
        // console.log(Bracket.getFirstOpponentSeed(nextOpponentSeed, this.maxDepth));
        // console.log(nextOpponentSeed);
        this.maxDepth = Math.floor(Math.log2(nbPlayers) / Math.log2(2));
        // console.log(this.maxDepth);
        const depth = Math.floor(Math.log2(i) / Math.log2(2));
        return this.addNextOpponnent(0, undefined, nextOpponentSeed, Bracket.getFirstOpponentSeed(nextOpponentSeed, depth));
    }
}

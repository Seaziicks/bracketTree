import {Bracket} from "./Bracket";
import {Player} from "./doubleLeaf";

export class LoserBracket extends Bracket {

    leftChild: LoserBracket | undefined;
    rightChild: LoserBracket | undefined;

    constructor(player1: Player, player2: Player, parent: Bracket | null, maxDepth: number, leftChild: LoserBracket | undefined = undefined, rightChild: LoserBracket | undefined = undefined) {
        super(player1, player2, parent, maxDepth, leftChild, rightChild);
    }

    public createLoserLayer(depth: number, maxDepth: number) {
        this.maxDepth = maxDepth;
        if (depth < maxDepth * 2) {
            if (depth % 2 === 0) {
                this.leftChild = new LoserBracket(this.player1.clone(), new Player(this.getNbLeafFromRoot() + 1, 'Player ' + (this.getNbLeafFromRoot() + 1)), this, this.maxDepth);
                this.leftChild.createLoserLayer(depth + 1, maxDepth);
            } else {
                this.leftChild = undefined;
            }
            this.rightChild = new LoserBracket(this.player2.clone(), new Player(this.getNbLeafFromRoot() + 1, 'Player ' + (this.getNbLeafFromRoot() + 1)), this, this.maxDepth);
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
                    this.rightChild = new LoserBracket(this.player2.clone(), new Player(this.getNbLeafFromRoot() + 1, 'Player ' + (this.getNbLeafFromRoot() + 1)), this, this.maxDepth);
                    this.player2.unsetPlayer();
                    this.player1 = new Player(0, 'Perdant de x');
                    console.log(this.rightChild);
                    // this.player2.name = 'rightChild dad';
                    console.log(this)
                    return true;
                }
            } else {
                if (this.rightChild === undefined) {
                    this.rightChild = new LoserBracket(this.player2.clone(), new Player(this.getNbLeafFromRoot() + 1, 'Player ' + (this.getNbLeafFromRoot() + 1)), this, this.maxDepth);
                    this.player2.unsetPlayer();
                    // console.log(this.rightChild);
                    // this.player2.name = 'rightChild dad';
                    console.log(this)
                    return true;
                } else if (this.leftChild === undefined) {
                    this.leftChild = new LoserBracket(this.player1.clone(), new Player(this.getNbLeafFromRoot() + 1, 'Player ' + (this.getNbLeafFromRoot() + 1)), this, this.maxDepth);
                    this.player1.unsetPlayer();
                    // console.log(this.leftChild);
                    // this.player1.name = 'leftChild dad';
                    console.log(this)
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
                    console.log('i % 4 :', i % 4)
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
                    // console.log('this.getDepth(1) :', this.getDepth(1))
                    // console.log('this.getDepth(1) / 2 :', this.getDepth(1) / 2)
                    // console.log('(this.getDepth(1) / 2) + 1 :', (this.getDepth(1) / 2) + 1)
                    // console.log('Math.pow(2, (this.getDepth(1) / 2) + 1) :',  Math.pow(2, (this.getDepth(1) / 2) + 1))
                    // console.log('i % Math.pow(2, (this.getDepth(1) / 2) + 1) :',  i % Math.pow(2, (this.getDepth(1) / 2) + 1))
                    // console.log('(Math.pow(2, (this.getDepth(1) / 2) + 1) / 2) - 1 :',  (Math.pow(2, (this.getDepth(1) / 2) + 1) / 2) - 1)
                    // console.log((i % Math.pow(2, (this.getDepth(1) / 2) + 1)) + '>' + ((Math.pow(2, (this.getDepth(1) / 2) + 1) / 2) - 1))
                    // console.log(i % Math.pow(2, (this.getDepth(1) / 2) + 1) > (Math.pow(2, (this.getDepth(1) / 2) + 1) / 2) - 1)
                    console.log("this.maxDepthOfBracket()", this.maxDepthOfBracket())
                    console.log("this.getDepth(1)", this.getDepth(1))
                    // console.log(((i % 4 == 2 || i % 4 == 3) && this.getDepth(1) == 2 && this.maxDepthOfBracket() > 1))
                    // console.log(this.maxBracketDepth(0))
                    // console.log(i % 4 > 1 && this.parent && this.parent.isRoot())
                    // console.log(this.leftChild === undefined && this.rightChild === undefined)
                    // console.log(this.maxBracketDepth(0) === 1)
                    // console.log(this.maxBracketDepth(0) === 3 && this.leftChild.maxBracketDepth(1) > this.rightChild.maxBracketDepth(1))
                    // console.log(this.maxBracketDepth(0) === 3 && this.leftChild.maxBracketDepth(1) === 3 && this.rightChild.maxDepthWidth() === 2)
                    // console.log()
                    // const test = Math.pow(2, (this.getDepth(1) / 2)) + 2;
                    // console.log("Math.pow(2, (this.getDepth(1) / 2)) : ", Math.pow(2, (this.getDepth(1) / 2)))
                    // console.log("test : ", test);
                    const ibis = (Math.ceil(i / (Math.pow(2, (this.getDepth(1) / 2) - 1))));
                    // console.log("this.getDepth(1) : ", this.getDepth(1));
                    // console.log("this.getDepth(1) / 2 : ", this.getDepth(1) / 2);
                    // console.log("(Math.pow(2, this.getDepth(1) / 2)) : ", (Math.pow(2, this.getDepth(1) / 2)));
                    // console.log("(Math.pow(2, this.getDepth(1) / 2) - 1) : ", (Math.pow(2, (this.getDepth(1) / 2) - 1) ));
                    // console.log("i / (Math.pow(2, this.getDepth(1) / 2) - 1) : ", i / (Math.pow(2, (this.getDepth(1) / 2) - 1)));
                    // console.log("ibis : ", ibis);
                    // console.log("ibis % 4 : ", ibis % 4);
                    // console.log(((ibis % 4 == 2 || ibis % 4 == 3) && this.getDepth(1) > 1 && this.maxDepthOfBracket() > 1 && this.getDepth(1) < 6));
                    // console.log(((ibis % 4 == 2 || ibis % 4 == 3) && this.getDepth(1) > 1 && this.maxDepthOfBracket() > 1 && this.getDepth(1) > 5));
                    // console.log((this.leftChild.maxBracketDepth(1) > this.rightChild.maxBracketDepth(1)))
                    // console.log(added)
                    if (ibis % 4 > 1 && this.getDepth(1) > 1 && this.maxDepthOfBracket() > 1) {
                        console.log("J'envoie à droite !")
                        added = this.rightChild.addNextLoserOpponnent(depth + 1, added, nextOpponentSeed, bracketSeedOpponent, maxDepth, i)
                        console.log(added);
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

    public addNextLoserOpponentInterface(nbPlayer: number, i: number) {
        const x = Math.floor(Math.log2(i - 1) / Math.log2(2));
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
}

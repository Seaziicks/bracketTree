import {Bracket} from "./Bracket";
import {Player} from "./Player";
import {WinnerBracket} from "./WinnerBracket";
import {LoserBracket} from "./LoserBracket";

// https://challonge.com/fr/fe6of1v2
export class DoubleEliminationBracket {
    winnerBracket: WinnerBracket;
    loserBracket: LoserBracket | undefined;

    playerList: Player[];
    nbPlayer: number;

    constructor(playerList: Player[]) {
        this.nbPlayer = playerList.length;
        if (this.nbPlayer < 3) {
            throw new Error("Le nombre de joueur doit être supérieur ou égale à 3.")
        }
        this.playerList = playerList;
        this.winnerBracket = new WinnerBracket(new Player(1, "Player 1"), new Player(2, "Player 2"), null, 0);
        this.createLoserBracket().then();
    }

    async createBrackets(players: Player[]) {
        // this.winnerBracket = this.createWinnerBracket();
        // this.loserBracket = await this.createLoserBracket();
        await this.createBothBrackets().then((brackets) => {
            this.winnerBracket = brackets.WinnerBracket;
            this.loserBracket = brackets.LoserBracket;
        }).finally();
        this.winnerBracket.setPlayers(players);
        this.defineOrder();
    }

    createWinnerBracket() {
        let winnerBracket = new WinnerBracket(new Player(1, "Player 1"), new Player(2, "Player 2"), null, 0);
        const layeredDepth = Math.floor(Math.log2(this.nbPlayer) / Math.log2(2));
        winnerBracket.createNewLayers(1, layeredDepth);
        for (let i = 0; i < this.nbPlayer - Math.pow(2, layeredDepth); i++) {
            winnerBracket.addNextOpponentInterface(this.nbPlayer, i);
        }
        return winnerBracket
    }

    async createLoserBracket() {
        console.log('=======================================')
        let loserBracket = undefined;
        if (this.winnerBracket.getNbMatch() > 2) {
            loserBracket = new LoserBracket(Player.getVoidPlayer(), Player.getVoidPlayer(), null, 0,
                undefined, undefined, this.winnerBracket, this.winnerBracket.rightChild);

            // Ici on essaye de traficoter pour avoir le nombre qu'on veut.
            // const layeredDepth = Math.floor(Math.log2(this.nbPlayer - 1) / Math.log2(2));
            // const nbMatchWithLoserBracket = this.nbPlayer * 2 - 2;
            for (let i = 2; i < this.nbPlayer - 1; i++) {
                console.log('-----------------------------');
                console.log('i :', i + 1);
                // await new Promise(f => setTimeout(f, 10));
                // console.log(loserBracket.print());
                // console.log(loserBracket);
                loserBracket.addNextLoserOpponentInterface(this.nbPlayer, i + 2);
                // this.defineLoserPlacement();
            }
        }
        return loserBracket;
    }

    async createBothBrackets(): Promise<{ WinnerBracket: WinnerBracket, LoserBracket: LoserBracket | undefined }> {
        let winnerBracket = new WinnerBracket(new Player(1, "Player 1"), new Player(2, "Player 2"), null, 0);
        let lastWinnerPlaced = undefined;
        let loserBracket = undefined;
        let lastLoserMatchPlaced;
        // console.log(this.nbPlayer)
        console.log(winnerBracket);
        if (this.nbPlayer > 2) {
            loserBracket = new LoserBracket(Player.getVoidPlayer(), Player.getVoidPlayer(), null, 0,
                undefined, undefined, winnerBracket, winnerBracket.rightChild);


            console.log('=======================================')
            console.log("this.nbPlayer : ", this.nbPlayer);
            for (let i = 2; i < this.nbPlayer; i++) {
                console.log('-----------------------------');
                console.log("i < this.nbPlayer : ", i + " < " + this.nbPlayer);
                /*
                 * Cette partie par en cacahuete, car le schema que je copie est delirant.
                 * Il faut regarder dans la partie Screenshot pour comprendre.
                 * Se concentrer uniquement sur l'arbre loser, et voir quels matchs sont affectes.
                 * Les problemes apparaissent pour chaque 2^n, avec un melange incomprehensible, que j'ai essaye de mimer jusqu'a 32.
                 * Et encore, c'est pas vraiment fait, mais disons que pour l'instant, ça me convient !
                 *
                 * Journal de bord, jours ... je ne sais plus quel jour on est ...
                 * Apres moult observations, j'ai reussi a mimer jusqu'a 127.
                 * Je pourrais le faire pour 255, mais il faudrait que je m'investisse d'avantage.
                 * Le cote rassurant, c'est qu'un patern se dessine, qui semble facilement factorisable !
                 * Mais la, franchement, flemme ....
                 */
                if (lastWinnerPlaced &&
                    Math.floor(Math.log2(lastWinnerPlaced.player2.getSeed()) / Math.log2(2)) === Math.log2(lastWinnerPlaced.player2.getSeed()) / Math.log2(2)
                    && Math.log2(lastWinnerPlaced.player2.getSeed()) / Math.log2(2) !== 2) {
                    console.log((Math.log2(lastWinnerPlaced.player2.getSeed()) / Math.log2(2) - 2));
                    console.warn("Coup de baguette magique !");
                    this.makeMagicHappen(loserBracket, i);
                }
                lastWinnerPlaced = winnerBracket.addNextOpponentInterface(this.nbPlayer, i);
                // console.log(lastWinnerPlaced);

                if (!lastWinnerPlaced) {
                    // throw new Error("Candidat non place dans l'arbre winner.");
                    console.error("Candidat non place dans l'arbre winner.");
                } else {
                    // Ici on essaye de traficoter pour avoir le nombre qu'on veut.
                    // const layeredDepth = Math.floor(Math.log2(this.nbPlayer - 1) / Math.log2(2));
                    // const nbMatchWithLoserBracket = this.nbPlayer * 2 - 2;
                    // console.log('i :', i + 1);
                    // console.log('i :', i);
                    // console.log('this.nbPlayer - 1 :', this.nbPlayer - 1);
                    // await new Promise(f => setTimeout(f, 10));
                    // console.log(loserBracket.print());
                    // console.log(loserBracket);
                    // console.log(i < this.nbPlayer - 1);
                    // console.log(i > 2);
                    // console.log(i < this.nbPlayer - 1 && i > 2);
                    if (i == 2)
                        loserBracket.waitingMatchRight = winnerBracket.rightChild;
                    if (i < this.nbPlayer && i > 2) {
                        lastLoserMatchPlaced = loserBracket.addNextLoserOpponentInterface(this.nbPlayer, i + 1);
                        // console.warn(lastLoserMatchPlaced);
                        if (!lastLoserMatchPlaced)
                            throw new Error("Match non place dans l'arbre loser.");
                        else
                            this.defineLoserPlacement(lastWinnerPlaced, lastLoserMatchPlaced, loserBracket);
                    }
                }

            }
        }

        return {WinnerBracket: winnerBracket, LoserBracket: loserBracket};
    }

    public defineOrder() {

        let nbWinnerPlaced = 0;
        let nbLoserPlaced = 0;

        let matchNumber = 1;
        let loserPlacementDepth = this.loserBracket?.maxDepthOfBracket() ?? 0;
        let winnerPlacementDepth = this.winnerBracket.maxDepthOfBracket();

        while (nbWinnerPlaced + nbLoserPlaced < (this.nbPlayer * 2) - 2 && winnerPlacementDepth >= 0 && loserPlacementDepth >= 0) {
            // console.log('========================================')
            // console.log('Placement n° %d', maxDepth - winnerPlacementDepth + 1);
            let winnerMatchs = this.winnerBracket.getSubNodesAtSpecificDepth(1, winnerPlacementDepth);
            // console.log('Sub nodes winner :', winnerMatchs);
            // console.log('Sub nodes loser',loserMatchs);
            // console.log('Loser max depth :', this.loserBracket.maxDepthOfBracket());
            // console.log('2 * (winnerPlacementDepth - 1):', 2 * (winnerPlacementDepth - 1));
            // console.log('winnerPlacementDepth :', winnerPlacementDepth);
            winnerMatchs.forEach((match) => {
                if (match.rightChild === undefined && match.leftChild === undefined) {
                    match.matchNumber = matchNumber;
                    matchNumber++;
                    nbWinnerPlaced++;
                }
            });
            winnerMatchs.forEach((match) => {
                if (match.matchNumber === 999) {
                    match.matchNumber = matchNumber;
                    matchNumber++;
                    nbWinnerPlaced++;
                }
            });
            winnerPlacementDepth--;
            // console.log('nbWinnerPlaced :', nbWinnerPlaced);
            // console.log('nbLoserPlaced :', nbLoserPlaced);
            // console.log('nbWinnerPlaced - nbLoserPlaced :', nbWinnerPlaced - nbLoserPlaced);
            // console.log('loserMatchs.length * 2 :', loserMatchs.length * 2);
            // console.log('loserMatchs.length :', loserMatchs.length);
            //
            //
            // console.log(nbWinnerPlaced - nbLoserPlaced > loserMatchs.length * 2)
            if (this.loserBracket) {
                let loserMatchs = this.loserBracket.getSubNodesAtSpecificDepth(1, loserPlacementDepth);

                while (nbWinnerPlaced - nbLoserPlaced > loserMatchs.length && loserPlacementDepth > 0) {
                    loserMatchs.forEach((match) => {
                        if (match.rightChild === undefined && match.leftChild === undefined) {
                            match.matchNumber = matchNumber
                            matchNumber++;
                            nbLoserPlaced++;
                        }
                    });
                    loserMatchs.forEach((match) => {
                        if (match.matchNumber === 999) {
                            match.matchNumber = matchNumber;
                            matchNumber++;
                            nbLoserPlaced++;
                        }
                    });
                    loserPlacementDepth--;
                    loserMatchs = this.loserBracket.getSubNodesAtSpecificDepth(1, loserPlacementDepth);
                }
                // winnerMatchs.sort((a, b) => Math.min(a.player1.seed, a.player2.seed) - Math.min(b.player1.seed, b.player2.seed));
                // console.log('Classé winner :', winnerMatchs);
                // console.log('Classé looser :', loserMatchs);
            }
        }
    }

    public defineLoserPlacement(lastWinnerPlaced: WinnerBracket, lastLoserMatchPlaced: LoserBracket, loserBracket: LoserBracket) {
        // let nbWinnerPlace = 0;
        // let nbLoserPlace = 0;
        //
        // let matchNumber = 1;
        // let loserPlacement = this.loserBracket.maxDepthOfBracket();
        // let winnerPlacement = this.winnerBracket.maxDepthOfBracket();

        // if (this.loserBracket) {
        //     if (lastLoserMatchPlaced.parent instanceof LoserBracket)
        //         lastLoserMatchPlaced.parent.reorderWaitingMatch();
        //     else
        //         console.warn(lastLoserMatchPlaced.parent)
        // }
        // console.log(lastWinnerPlaced);
        // console.log("lastWinnerPlaced.player2.getSeed()", lastWinnerPlaced.player2.getSeed());
        // console.log(Math.floor(Math.log2(lastWinnerPlaced.player2.getSeed()) / Math.log2(2)));
        // console.log(Math.log2(lastWinnerPlaced.player2.getSeed()) / Math.log2(2));
        // console.warn(lastLoserMatchPlaced.parent)
        // console.warn(lastLoserMatchPlaced.parent instanceof LoserBracket)
        if (lastLoserMatchPlaced.parent instanceof LoserBracket) {
            // console.log(lastLoserMatchPlaced.parent.waitingMatchLeft);
            // console.log(lastLoserMatchPlaced.parent.waitingMatchRight);
            lastLoserMatchPlaced.parent.reorderWaitingMatch();
            if (lastLoserMatchPlaced.parent.waitingMatchRight) {
                lastLoserMatchPlaced.waitingMatchLeft = lastLoserMatchPlaced.parent.waitingMatchRight;
                lastLoserMatchPlaced.parent.waitingMatchRight = undefined;
            } else if (lastLoserMatchPlaced.parent.waitingMatchLeft) {
                lastLoserMatchPlaced.waitingMatchLeft = lastLoserMatchPlaced.parent.waitingMatchLeft;
                lastLoserMatchPlaced.parent.waitingMatchLeft = undefined;
                lastLoserMatchPlaced.parent.swapChildren();
            } else {
                // console.log(lastLoserMatchPlaced.parent)
                console.error("Il y a un problème quelque part.");
            }
            lastLoserMatchPlaced.waitingMatchRight = lastWinnerPlaced;
            lastLoserMatchPlaced.reorderWaitingMatch();
        }
    }

    // Pas fini, car la construction de l'arbre loser ne marche pas encore ...
    // Pas besoin finalement ...
    // hasEmptyLeaf(bracket: Bracket) {
    //     return true;
    // }

    getWinnerBracket(): WinnerBracket {
        return this.winnerBracket;
    }

    getLoserBracket(): LoserBracket | undefined {
        return this.loserBracket ?? undefined;
    }

    getFullBracket() {
        const finalMatch = new Bracket(Player.getVoidPlayer(), Player.getVoidPlayer(), null, 0, this.winnerBracket, this.loserBracket);
        if (finalMatch.leftChild && finalMatch.rightChild)
            finalMatch.matchNumber = Math.max(finalMatch.leftChild?.matchNumber, finalMatch.rightChild?.matchNumber) + 1
        else if (finalMatch.leftChild)
            finalMatch.matchNumber = finalMatch.leftChild.matchNumber + 1
        else if (finalMatch.rightChild)
            finalMatch.matchNumber = finalMatch.rightChild.matchNumber + 1
        else
            finalMatch.matchNumber = 1
        return finalMatch;
    }

    makeMagicHappen(loserBracket: LoserBracket, index: number) {
        let layers;
        switch (index) {
            case 2:
                break;
            case 4:
                break;
            case 8:
                for (let index = 0; index < 1; index++) {
                    layers = loserBracket.getSubNodesAtSpecificDepth(1, ((index + 1) * 2));
                    for (let layer of layers) {
                        if (layer instanceof LoserBracket) {
                            layer.swapChildren();
                        }
                    }
                }
                break;
            case 16:
                for (let index = 0; index < 2; index++) {
                    layers = loserBracket.getSubNodesAtSpecificDepth(1, ((index + 1) * 2));
                    for (let layer of layers) {
                        if (layer instanceof LoserBracket) {
                            layer.swapChildren();
                            if (index === 1) {
                                this.swapMatchs(layer.getSubNodesAtSpecificDepth(1, 2));
                            }
                        }
                    }
                }
                break;
            case 32:
                for (let index = 0; index < 3; index++) {
                    layers = loserBracket.getSubNodesAtSpecificDepth(1, ((index + 1) * 2));
                    for (let layer of layers) {
                        if (layer instanceof LoserBracket) {
                            layer.swapChildren();
                            if (index === 1) {
                                this.swapMatchs(layer.getSubNodesAtSpecificDepth(1, 4));
                            }
                        }
                    }
                }
                break;
            case 64:
                for (let index = 0; index < 4; index++) {
                    layers = loserBracket.getSubNodesAtSpecificDepth(1, ((index + 1) * 2));
                    for (let layer of layers) {
                        if (layer instanceof LoserBracket) {
                            layer.swapChildren();
                            if (index === 1) {
                                this.swapMatchs(layer.getSubNodesAtSpecificDepth(1, 2));
                                this.swapMatchs(layer.getSubNodesAtSpecificDepth(1, 6));
                            }
                        }
                    }
                }
                break;
            case 128:
                throw new Error("Comportement encore non observé, je ne peux pas construire d'arbre aussi grand.")
                // break;
        }

    }

    swapMatchs(brackets: Bracket[]) {
       if (brackets.length % 2 !== 0)
           throw new Error("Nombre impaire de bracket, pas normal, swap impossible");
       for (let i = 0; i < brackets.length / 2; i++) {
           const bracket = brackets[i];
           const bracketToSwapWith = brackets[brackets.length - i - 1];
           if (bracket instanceof LoserBracket && bracketToSwapWith instanceof LoserBracket) {
               const transition = bracket.waitingMatchLeft;
               bracket.waitingMatchLeft = bracketToSwapWith.waitingMatchLeft;
               bracketToSwapWith.waitingMatchLeft = transition;
           } else {
               throw new Error("Un des bracket n'est pas un loser Bracket, problème !");
           }
       }
    }

}

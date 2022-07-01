import {Bracket} from "./bracket";
import {Player} from "./doubleLeaf";
// https://challonge.com/fr/otournament5
export class DoubleEliminationBracket {
  winnerBracket: Bracket;
  loserBracket: Bracket;

  playerList: Player[];
  nbPlayer: number;

  constructor(playerList: Player[]) {
    this.nbPlayer = playerList.length;
    if (this.nbPlayer < 3 ) {
      throw new Error("Le nombre de joueur doit être supérieur ou égale à 3.")
    }
    this.playerList = playerList;
    this.winnerBracket = this.createWinnerBracket();
    this.loserBracket =  this.createLoserBracket();
  }

  createWinnerBracket() {
    let winnerBracket = new Bracket(new Player(1, "Player 1"), new Player(2, "Player 2"), null, 0);
    const layeredDepth = Math.floor(Math.log2(this.nbPlayer) / Math.log2(2));
    winnerBracket.createNewLayers(1, layeredDepth);
    for (let i = 0; i < this.nbPlayer - Math.pow(2, layeredDepth); i++) {
      winnerBracket.addNextOpponentInterface();
    }
    return winnerBracket
  }

  createLoserBracket() {
    let loserBracket = new Bracket(new Player(1, "Player 1"), new Player(2, "Player 2"), null, 0);

    // Ici on essaye de traficoter pour avoir le nombre qu'on veut.
    // const layeredDepth = Math.floor(Math.log2(this.nbPlayer - 1) / Math.log2(2));
    // const nbMatchWithLoserBracket = this.nbPlayer * 2 - 2;
    for (let i = 0; i < this.nbPlayer - 3; i++) {
      loserBracket.addNextLoserOpponentInterface(this.nbPlayer);
    }
    return loserBracket;
  }

  public defineOrder() {

    let nbWinnerPlace = 0;
    let nbLoserPlace = 0;

    let matchNumber = 1;
    let loserPlacement = this.loserBracket.maxDepthOfBracket();
    let winnerPlacement = this.winnerBracket.maxDepthOfBracket();

    while (nbWinnerPlace + nbLoserPlace < (this.nbPlayer * 2) - 2 && winnerPlacement >= 0 && loserPlacement >= 0) {
      // console.log('========================================')
      // console.log('Placement n° %d', maxDepth - winnerPlacement + 1);
      let winnerMatchs = this.winnerBracket.getSubNodesAtSpecificDepth(1, winnerPlacement);
      let loserMatchs = this.loserBracket.getSubNodesAtSpecificDepth(1, loserPlacement);
      // console.log('Sub nodes winner :', winnerMatchs);
      // console.log('Sub nodes loser',loserMatchs);
      // console.log('Loser max depth :', this.loserBracket.maxDepthOfBracket());
      // console.log('2 * (winnerPlacement - 1):', 2 * (winnerPlacement - 1));
      // console.log('winnerPlacement :', winnerPlacement);
      winnerMatchs.forEach( (match) => {
        match.matchNumber = matchNumber;
        matchNumber++;
        nbWinnerPlace++;
      });
      winnerPlacement--;
      // console.log('nbWinnerPlace :', nbWinnerPlace);
      // console.log('nbLoserPlace :', nbLoserPlace);
      // console.log('nbWinnerPlace - nbLoserPlace :', nbWinnerPlace - nbLoserPlace);
      // console.log('loserMatchs.length * 2 :', loserMatchs.length * 2);
      // console.log('loserMatchs.length :', loserMatchs.length);
      //
      //
      // console.log(nbWinnerPlace - nbLoserPlace > loserMatchs.length * 2)

      while (nbWinnerPlace - nbLoserPlace > loserMatchs.length && loserPlacement > 0) {
        loserMatchs.forEach( (match) => {
          match.matchNumber = matchNumber
          matchNumber++;
          nbLoserPlace++;
        });
        loserPlacement--;
        loserMatchs = this.loserBracket.getSubNodesAtSpecificDepth(1, loserPlacement);
      }
      // winnerMatchs.sort((a, b) => Math.min(a.player1.seed, a.player2.seed) - Math.min(b.player1.seed, b.player2.seed));
      // console.log('Classé winner :', winnerMatchs);
      // console.log('Classé looser :', loserMatchs);
    }

  }

}

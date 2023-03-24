let Increase = class {
    gomoku = new Gomoku();
    point = 0;

    win() {
        if (!this.gomoku.over) { return; }
        if (this.gomoku.winner == -1) {
        } else if (this.gomoku.winner == 1) {
            this.point += 1;
            this.gomoku.reset();
        }
        this.updateUI();
    }

    init() {
        this.gomoku.init(this);
        this.updateUI();
    }

    updateUI() {
        if (this.point > 0) {
            $("#chessPoint").text(this.point);
            $("#p-chessPoint").show();
        } else {
            $("#p-chessPoint").hide();
        }
    }


}

$(document).ready(function () {
    let game = new Increase();
    game.init();
});
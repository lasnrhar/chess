let Increase = class {
    gomoku = new Gomoku();
    game = {
        totalPoint: 0,
        point: 0,
        autoplay: {
            level: 0,
            max: 10,
            cost: 5
        },
    }

    win() {
        if (!this.gomoku.over) { return false; }
        if (this.gomoku.winner == -1) {
            this.gomoku.reset();
            this.refreshUI();
            return false;
        } else if (this.gomoku.winner == 1) {
            this.game.point += 1;
            this.game.totalPoint += 1;
            this.gomoku.reset();
            this.refreshUI();
            return true;
        }
    }

    init() {
        this.gomoku.init(this);
        this.refreshUI();
    }

    refreshUI() {
        if (this.game.totalPoint > 0) {
            $("#p-control").show();
        } else {
            $("#p-control").hide();
        }
        $("#p-update").html('');

        this.refreshUpdatePanel('autoplay');
        $("#v-chesspoint").text(this.game.point);
    }

    refreshUpdatePanel(item) {
        let html = "";
        html += "<div class='update-panel'>";


        html += `<span>auto play(<span id='v-u-${item}'>${this.game[item].level}/${this.game[item].max}</span>)</span>`;
        html += `<button onclick="game.update('${item}')">update(${this.game[item].cost})</button>`;

        html += "</div>";
        $("#p-update").append(html);
    }

    resetGomoku() {
        this.gomoku.reset();
    }

    update(item) {
        if (this.game.point >= this.game[item].cost) {
            this.game[item].level += 1;
            this.game.point -= this.game[item].cost;
        }

        this.refreshUI();
        this.startAuto();
    }

    cheat(){
        this.game.point += 1000;
        this.game.totalPoint += 1000;
        this.refreshUI();
    }

    interval = null;
    startAuto() {
        if (this.interval) {
            clearInterval(this.interval);
        }
        let that = this;
        let time = 1000 / (that.game.autoplay.level + 1);
        this.interval = setInterval(() => {
            that.gomoku.autoPlay();
        }, time);
    }
}

let game = new Increase();

$(document).ready(function () {
    game.init();
});
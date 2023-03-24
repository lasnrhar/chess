let Gomoku = class {
    chess = null;
    ctx = null;
    pieces = [];
    cursors = ['default', 'pointer'];
    currentCursor = 0;
    black = true;
    size = 0;
    over = false;
    winner = 0;
    increase = null;

    drawChessboard(width, height) {
        this.ctx.strokeStyle = "#BFBFBF";
        let pos = width / 15;
        this.ctx.beginPath();
        for (let i = 0; i < 16; i++) {
            this.ctx.moveTo(i * pos + 10, 10);
            this.ctx.lineTo(i * pos + 10, width + 10);
            this.ctx.stroke();
            this.ctx.moveTo(10, i * pos + 10);
            this.ctx.lineTo(height + 10, i * pos + 10);
            this.ctx.stroke();
        }
    }

    buildChess(x, y) {
        let startX = (x * this.size) - (20 / 2) + 10;
        let startY = (y * this.size) - (20 / 2) + 10;
        this.pieces[x][y] = {
            points: [{ x: startX, y: startY },
            { x: startX, y: startY + 20 },
            { x: startX + 20, y: startY },
            { x: startX + 20, y: startY + 20 }],
            position: { x, y },
            cursor: 1,
            val: 0
        };
    }

    handleMouseMove(e) {
        e.preventDefault();
        e.stopPropagation();

        let mouseX = e.offsetX;
        let mouseY = e.offsetY;

        let piece = this.findPiece(mouseX, mouseY);
        if (!piece) {
            if (this.currentCursor > 0) {
                this.currentCursor = 0;
                this.chess.style.cursor = this.cursors[this.currentCursor];
            }
            return;
        }
        let newCursor = piece.cursor;
        if (!newCursor == this.currentCursor) {
            this.currentCursor = newCursor;
            this.chess.style.cursor = this.cursors[this.currentCursor];
        }
    }

    play(e) {
        if (this.over) { return; }
        if (!e) { return; }
        e.preventDefault();
        e.stopPropagation();

        let piece = this.findPiece(e.offsetX, e.offsetY);
        this.playPiece(piece);
    }

    playPiece(piece) {
        if (piece && piece.val == 0) {
            piece.val = 1;
            this.drawPiece(piece);

            this.checkWin(piece);
            if (!this.increase.win()) {
                this.aiPlay(piece);
            }

        }
    }

    findPiece(x, y) {
        for (const line of this.pieces) {
            for (const piece of line) {
                let points = piece.points;
                let isInsidePiece =
                    (points[0].x <= x && points[0].y <= y) && // top left
                    (points[1].x <= x && points[1].y >= y) && // bottom left
                    (points[2].x >= x && points[2].y <= y) && // top right
                    (points[3].x >= x && points[3].y >= y); // bottom right
                if (isInsidePiece) {
                    return piece;
                }
            }
        }
    }

    drawPiece(piece) {
        let position = piece.position;
        let x = position.x;
        let y = position.y;
        this.ctx.fillStyle = piece.val == 1 ? "#000000" : "#FFFFFF";
        this.ctx.beginPath();
        this.ctx.arc(x * this.size + 10, y * this.size + 10, 6, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.strokeStyle = piece.val == 1 ? "#FFFFFF" : "#000000";
        this.ctx.beginPath();
        this.ctx.arc(x * this.size + 10, y * this.size + 10, 5, 0, 2 * Math.PI);
        this.ctx.stroke();
    }

    checkWin(piece) {
        if (this.over) { return; }
        if (!piece) { return; }
        let val = piece.val;
        let x = piece.position.x;
        let y = piece.position.y;

        let count = 1;
        // up and down
        for (let i = 1; i < 5; i++) {
            if (y - i < 0) {
                break;
            }
            if (this.pieces[x][y - i].val == val) {
                count++;
            } else {
                break;
            }
        }
        for (let i = 1; i < 5; i++) {
            if (y + i > 15) {
                break;
            }
            if (this.pieces[x][y + i].val == val) {
                count++;
            } else {
                break;
            }
        }

        if (count >= 5) {
            this.over = true;
            this.winner = val;
            return;
        }

        count = 1;
        // left and right
        for (let i = 1; i < 5; i++) {
            if (x - i < 0) {
                break;
            }
            if (this.pieces[x - i][y].val == val) {
                count++;
            } else {
                break;
            }
        }
        for (let i = 1; i < 5; i++) {
            if (x + i > 15) {
                break;
            }
            if (this.pieces[x + i][y].val == val) {
                count++;
            } else {
                break;
            }
        }
        if (count >= 5) {
            this.over = true;
            this.winner = val;
            return;
        }

        // left up and right down
        count = 1;
        for (let i = 1; i < 5; i++) {
            if (x - i < 0 || y - i < 0) {
                break;
            }
            if (this.pieces[x - i][y - i].val == val) {
                count++;
            } else {
                break;
            }
        }
        for (let i = 1; i < 5; i++) {
            if (x + i > 15 || y + i > 15) {
                break;
            }
            if (this.pieces[x + i][y + i].val == val) {
                count++;
            } else {
                break;
            }
        }
        if (count >= 5) {
            this.over = true;
            this.winner = val;
            return;
        }

        // left down and right up
        count = 1;
        for (let i = 1; i < 5; i++) {
            if (x - i < 0 || y + i > 15) {
                break;
            }
            if (this.pieces[x - i][y + i].val == val) {
                count++;
            } else {
                break;
            }
        }
        for (let i = 1; i < 5; i++) {
            if (x + i > 15 || y - i < 0) {
                break;
            }
            if (this.pieces[x + i][y - i].val == val) {
                count++;
            } else {
                break;
            }
        }
        if (count >= 5) {
            this.over = true;
            this.winner = val;
            return;
        }
    }

    aiPlay(piece) {
        if (this.over) { return; }

        let whitePiece = this.findClosestEmptyPiece(piece.position.x, piece.position.y);
        this.drawPiece(whitePiece);
        whitePiece.val = -1;
        this.checkWin(whitePiece);
    }

    findClosestEmptyPiece(x, y) {
        let closest = null;
        let minDistance = 10000000;
        for (const line of this.pieces) {
            for (const piece of line) {
                if (piece.val == 0) {
                    let distance = Math.sqrt(Math.pow(x - piece.position.x, 2) + Math.pow(y - piece.position.y, 2));
                    if (distance < minDistance && this.getRandomBool()) {
                        minDistance = distance;
                        closest = piece;
                    }
                }
            }
        }
        return closest;
    }

    getRandomBool() {
        return Math.random() >= 0.3;
    }

    getRandomPiece(val) {
        let emptyPieces = [];
        for (const line of this.pieces) {
            for (const piece of line) {
                if (piece.val == val) {
                    emptyPieces.push(piece);
                }
            }
        }
        if (emptyPieces.length == 0) {
            return this.getRandomPiece(0);
        }
        return emptyPieces[Math.floor(Math.random() * emptyPieces.length)];
    }

    autoPlay() {
        let piece = this.getRandomPiece(1);
        let nextPiece = this.findClosestEmptyPiece(piece.position.x, piece.position.y);
        this.playPiece(nextPiece);
        this.increase.win();
    }

    init(increase) {
        this.increase = increase;
        this.chess = document.getElementById("chessboard");
        this.ctx = this.chess.getContext('2d');
        let width = 500;
        let height = 500;
        this.size = width / 15;

        this.drawChessboard(width, height);

        for (let i = 0; i <= 15; i++) {
            this.pieces.push([]);
            for (let j = 0; j <= 15; j++) {
                this.pieces[i].push({});
                this.buildChess(i, j);
            }
        }

        let that = this;
        $(this.chess).mousemove(function (e) {
            that.handleMouseMove(e);
        });
        $(this.chess).click(function (e) {
            that.play(e);
        });
    }

    reset() {
        for (const line of this.pieces) {
            for (const piece of line) {
                piece.val = 0;
            }
        }
        this.over = false;
        this.black = true;
        this.winner = 0;
        this.ctx.clearRect(0, 0, 520, 520);
        this.drawChessboard(500, 500);
    }
}
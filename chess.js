let game = {
    chess: null,
    ctx: null,
    pieces: [],
    cursors: ['default', 'pointer'],
    currentCursor: 0,
    black: true,
    size: 0,
    over: false,
    winner: 0
}


function drawChessboard(width, height) {
    game.ctx.strokeStyle = "#BFBFBF";
    let pos = width / 15;
    for (let i = 0; i < 16; i++) {
        game.ctx.moveTo(i * pos, 0);
        game.ctx.lineTo(i * pos, width);
        game.ctx.stroke();
        game.ctx.moveTo(0, i * pos);
        game.ctx.lineTo(height, i * pos);
        game.ctx.stroke();
    }
}

function buildChess(x, y) {
    let startX = (x * game.size) - (20 / 2);
    let startY = (y * game.size) - (20 / 2);
    game.pieces[x - 1][y - 1] = {
        points: [{ x: startX, y: startY },
        { x: startX, y: startY + 20 },
        { x: startX + 20, y: startY },
        { x: startX + 20, y: startY + 20 }],
        position: { x: x - 1, y: y - 1 },
        cursor: 1,
        val: 0
    };
}

function handleMouseMove(e) {
    e.preventDefault();
    e.stopPropagation();

    let mouseX = e.offsetX;
    let mouseY = e.offsetY;

    let piece = findPiece(mouseX, mouseY);
    if (!piece) {
        if (game.currentCursor > 0) {
            game.currentCursor = 0;
            game.chess.style.cursor = game.cursors[game.currentCursor];
        }
        return;
    }
    let newCursor = piece.cursor;
    if (!newCursor == game.currentCursor) {
        game.currentCursor = newCursor;
        game.chess.style.cursor = game.cursors[game.currentCursor];
    }
}

function play(e) {
    if (game.over) { return; }
    if (!e) { return; }
    e.preventDefault();
    e.stopPropagation();

    let piece = findPiece(e.offsetX, e.offsetY);
    if (piece && piece.val == 0) {
        drawPiece(piece);
        piece.val = game.black ? 1 : -1;
        game.black = !game.black;
    }
    checkWin(piece);
}

function findPiece(x, y) {
    for (const line of game.pieces) {
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

function drawPiece(piece) {
    let position = piece.position;
    let x = position.x + 1;
    let y = position.y + 1;
    game.ctx.fillStyle = game.black ? "#FFFFFF" : "#000000";
    game.ctx.beginPath();
    game.ctx.arc(x * game.size, y * game.size, 6, 0, 2 * Math.PI);
    game.ctx.fill();
    game.ctx.strokeStyle = game.black ? "#000000" : "#FFFFFF";
    game.ctx.beginPath();
    game.ctx.arc(x * game.size, y * game.size, 5, 0, 2 * Math.PI);
    game.ctx.stroke();
}

function checkWin(piece) {
    if (game.over) { return; }
    if (!piece) { return; }
    let count = 1;
    let val = piece.val;
    let x = piece.position.x;
    let y = piece.position.y;
    // up and down
    for (let i = 1; i < 5; i++) {
        if (y - i < 0) {
            break;
        }
        if (game.pieces[x][y - i].val == val) {
            count++;
        } else {
            break;
        }
    }
    for (let i = 1; i < 5; i++) {
        if (y + i >= 13) {
            break;
        }
        if (game.pieces[x][y + i].val == val) {
            count++;
        } else {
            break;
        }
    }

    if (count >= 5) {
        game.over = true;
        game.winner = val;
        return;
    }

    count = 1;
    // left and right
    for (let i = 1; i < 5; i++) {
        if (x - i < 0) {
            break;
        }
        if (game.pieces[x - i][y].val == val) {
            count++;
        } else {
            break;
        }
    }
    for (let i = 1; i < 5; i++) {
        if (x + i >= 13) {
            break;
        }
        if (game.pieces[x + i][y].val == val) {
            count++;
        } else {
            break;
        }
    }
    if (count >= 5) {
        game.over = true;
        game.winner = val;
        return;
    }

    // left up and right down
    count = 1;
    for (let i = 1; i < 5; i++) {
        if (x - i < 0 || y - i < 0) {
            break;
        }
        if (game.pieces[x - i][y - i].val == val) {
            count++;
        } else {
            break;
        }
    }
    for (let i = 1; i < 5; i++) {
        if (x + i >= 13 || y + i >= 13) {
            break;
        }
        if (game.pieces[x + i][y + i].val == val) {
            count++;
        } else {
            break;
        }
    }
    if (count >= 5) {
        game.over = true;
        game.winner = val;
        return;
    }

    // left down and right up
    count = 1;
    for (let i = 1; i < 5; i++) {
        if (x - i < 0 || y + i >= 13) {
            break;
        }
        if (game.pieces[x - i][y + i].val == val) {
            count++;
        } else {
            break;
        }
    }
    for (let i = 1; i < 5; i++) {
        if (x + i >= 13 || y - i < 0) {
            break;
        }
        if (game.pieces[x + i][y - i].val == val) {
            count++;
        } else {
            break;
        }
    }
    if (count >= 5) {
        game.over = true;
        game.winner = val;
        return;
    }

}

function win() {
    if (!game.over) { return; }
    if (game.winner == 1) {
        alert("White win!");
    } else if (game.winner == -1) {
        alert("Black win!");
    }
}

$(document).ready(function () {
    game.chess = document.getElementById("chessboard");
    game.ctx = game.chess.getContext('2d');
    let width = game.chess.width;
    let height = game.chess.height;
    game.size = width / 15;

    drawChessboard(width, height);

    for (let i = 1; i < 15; i++) {
        game.pieces.push([]);
        for (let j = 1; j < 15; j++) {
            game.pieces[i - 1].push({});
            buildChess(i, j);
        }
    }

    $(game.chess).mousemove(function (e) { handleMouseMove(e); });
    $(game.chess).click(function (e) { play(e); win(); });
});
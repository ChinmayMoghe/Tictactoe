window.addEventListener("DOMContentLoaded",()=>{
    let boardState = [0,1,2,3,4,5,6,7,8];
    let remainingMoves;
    const movesSymbols = {x:"\u2718",o:"\u0555"};
    let aiPlayer = {symbol:"",message:"I win Human"};
    let humanPlayer ={symbol:"",message:"You win"};
    let boxes = document.querySelectorAll(".game-layout>div");
    const calculateRemainingMoves = (board)=>{
        return board.filter(state=>typeof(state)=="number");
    };
    //changes the board State
    const changeBoardState = (id)=>{
        boardState[id] = document.getElementById(id).innerText;
        remainingMoves = calculateRemainingMoves(boardState);
    };
    //add symbol to clicked Div or PC div
    const addSymbol = (id,player)=>{
        document.getElementById(id).innerText = player.symbol;
        return id;
    };
    //click handler for popup
    const modalPopup = ()=>{
        document.querySelector(".modal").style.display = "grid";
        const xDiv = document.getElementById("x");
        const oDiv = document.getElementById("o");
        const setHumanSymbol = (event)=>{
            humanPlayer.symbol = movesSymbols[event.target.id];
            const aiSymbolKey = Object.keys(movesSymbols).filter(x=>x!=event.target.id)[0];
            aiPlayer.symbol = movesSymbols[aiSymbolKey];
            xDiv.removeEventListener("click",setHumanSymbol);
            oDiv.removeEventListener("click",setHumanSymbol);
            document.querySelector(".modal").style.display = "none";
        };
        xDiv.addEventListener("click",setHumanSymbol);
        oDiv.addEventListener("click",setHumanSymbol);

    };
    //click Handler for game
    const gameClickHandler = (event)=>{
        temporaryRemoveAllEventListener(remainingMoves);
        let moveId = addSymbol(event.target.id,humanPlayer);
        changeBoardState(moveId);
        const status = checkBoardState(remainingMoves);
        if(status.winner==null){
            moveId = addSymbol(makeAIMove(),aiPlayer);
            changeBoardState(moveId)
            let winStatus = checkBoardState(remainingMoves);
            if(winStatus.winner==aiPlayer.symbol || winStatus.winner==humanPlayer.symbol||winStatus.winner==0){
                showWinnerPopup(winStatus);
            }
            addEventListners(remainingMoves);
        }else{
            showWinnerPopup(status);
        }
    };
    //temporary remove all eventListeners - so user click is disabled 
    //when PC is making a move
    const temporaryRemoveAllEventListener=(remainingMoves)=>{
        remainingMoves.forEach(id=>document.getElementById(id).removeEventListener("click",gameClickHandler));
    }
    //add event listeners to all divs
    const addEventListners = (remainingMoves)=>{
        remainingMoves.forEach(id => {
            document.getElementById(id).addEventListener("click",gameClickHandler);
        });
    };

    //minimax algorithm - unbeatable AI
    const minimax = (board,player)=>{
        let availableSpots = calculateRemainingMoves(board);
        let status = checkBoardState(availableSpots);
        if(status.winner==aiPlayer.symbol){
            return {score:10};
        }else if(status.winner==humanPlayer.symbol){
            return {score:-10};
        }else if(status.winner===0){
            return {score:0};
        }
        let moves = [];
        for(var i=0;i<availableSpots.length;i++){
            const move = {};
            move.index = board[availableSpots[i]];
            board[availableSpots[i]] = player.symbol;
            if(player == aiPlayer){
                let result = minimax(board,humanPlayer);
                move.score = result.score;
            }else{
                let result = minimax(board,aiPlayer);
                move.score = result.score;
            }
            board[availableSpots[i]] = move.index;
            moves.push(move);
        }
        let bestMove;
        if(player==aiPlayer){
            let bestScore = -10000;
            for(var i=0;i<moves.length;i++){
                if(moves[i].score>bestScore){
                    bestScore = moves[i].score
                    bestMove = i;
                }
            }
        }else{
            let bestScore = 10000;
            for(var i=0;i<moves.length;i++){
                if(moves[i].score<bestScore){
                    bestScore = moves[i].score
                    bestMove = i;
                }
            }
        }
        return moves[bestMove];
    }
    //let PC make a move
    const makeAIMove = (remainingMoves)=>{
        return minimax(boardState,aiPlayer).index;
    };
    //check horizontal wins
    const checkHorizontalWin = ()=>{
        if(boardState[0]==boardState[1] && boardState[1]==boardState[2]){
            return {winner:aiPlayer.symbol==boardState[0]?aiPlayer.symbol:humanPlayer.symbol};
        }
        else if(boardState[3]==boardState[4] && boardState[4]==boardState[5]){
            return {winner:aiPlayer.symbol==boardState[3]?aiPlayer.symbol:humanPlayer.symbol};
        }
        else if(boardState[6]==boardState[7] && boardState[7]==boardState[8]){
            return {winner:aiPlayer.symbol==boardState[6]?aiPlayer.symbol:humanPlayer.symbol};
        }
    };
    //check vertical wins
    const checkVerticalWin = ()=>{
        if(boardState[0]==boardState[3] && boardState[3]==boardState[6]){
            return {winner:aiPlayer.symbol==boardState[0]?aiPlayer.symbol:humanPlayer.symbol};
        }
        else if(boardState[1]==boardState[4] && boardState[4]==boardState[7]){
            return {winner:aiPlayer.symbol==boardState[1]?aiPlayer.symbol:humanPlayer.symbol};
        }
        else if(boardState[2]==boardState[5] && boardState[5]==boardState[8]){
            return {winner:aiPlayer.symbol==boardState[2]?aiPlayer.symbol:humanPlayer.symbol};
        }
    };
    //check diagonal wins
    const checkDiagonalWin = ()=>{
        if(boardState[0]==boardState[4] && boardState[4]==boardState[8]){
            return {winner:aiPlayer.symbol==boardState[0]?aiPlayer.symbol:humanPlayer.symbol};
        }
        else if(boardState[2]==boardState[4] && boardState[4]==boardState[6]){
            return {winner:aiPlayer.symbol==boardState[2]?aiPlayer.symbol:humanPlayer.symbol};
        }
    };
    // compute state of board after each move - possibly return who wins the game
    const checkBoardState = (availableMoves)=>{
        let winObj = {};
        if(checkHorizontalWin()){
            winObj = checkHorizontalWin();
        }else if(checkVerticalWin()){
            winObj = checkVerticalWin();
        }
        else if(checkDiagonalWin()){
            winObj = checkDiagonalWin();
        }else if(availableMoves.length==0){
            winObj = {winner:0};
        }
        else{
            //continue the game
            winObj = {winner:null};
        }
        return winObj;
    };
    //game start
    const gameStart = (()=>{
        modalPopup();
        remainingMoves = calculateRemainingMoves(boardState);
        addEventListners(remainingMoves);
    })();

    const showWinnerPopup = (winStatus)=>{
        const winnerMessage = document.querySelector(".winnerMessage");
        if(winStatus.winner==aiPlayer.symbol){
            winnerMessage.innerText =aiPlayer.message;
        }else if(winStatus.winner==humanPlayer.symbol){
            winnerMessage.innerText =humanPlayer.message;
        }else if(winStatus.winner==0){
            winnerMessage.innerText = "No One Wins";
        }
        document.querySelector(".winnerPopup").style.display = "flex";
        document.querySelector(".restart-button").addEventListener("click",resetBoard);
    }

    //reset board after a match is done -reset game
    const resetBoard =()=>{
        document.querySelector(".winnerPopup").style.display = "none";
        boardState = [0,1,2,3,4,5,6,7,8];
        remainingMoves = calculateRemainingMoves(boardState);
        remainingMoves.forEach(id=>{
            document.getElementById(id).innerText="";
    });
    addEventListners(remainingMoves);
    modalPopup();
    };
});


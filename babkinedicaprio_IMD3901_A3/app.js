const express   = require('express');
const app       = express();
const http      = require('http');
const server    = require('http').createServer(app);
const io        = require('socket.io')(server);

const LISTEN_PORT = 8080;

server.listen(LISTEN_PORT);
app.use(express.static(__dirname + '/public')); //set root path of server ...

console.log("Listening on port: " + LISTEN_PORT );

//this is call a "route" - basically a url path from your website for static pages
app.get( '/', function( req, res ){ 
    res.sendFile( __dirname + '/public/index.html' );
});
app.get( '/player', function( req, res ){ 
    res.sendFile( __dirname + '/public/player.html' );
});
app.get( '/dealer', function( req, res ){ 
    res.sendFile( __dirname + '/public/dealer.html' );
});

// Find out what are the id's of the player and the dealer
let dealerID;
let playerID;
let playersList = [];

//Initialize the deck
//The "deck" doesn't have to be a number and a suite, it just has to hold the value of the cards
let deck = [];
let playerHandValue;
let dealerHandValue;

// App functionality
io.on('connection', (socket) => {

    socket.on("dealerIsConnected", (data) => {
        console.log('dealer connected');
        dealerID = data.socketID;
        playerConnects(dealerID, 'dealer');
    });
    socket.on("playerIsConnected", (data) => {
        console.log('player connected');
        playerID = data.socketID;
        playerConnects(playerID, 'player');
    });
    
    // When a user disconnects
    socket.on('disconnect', () => {
        console.log('user disconnected');
        disconnectPlayer(socket);
    });

    socket.on("startGame", () => {
        playerHandValue = 0;
	    dealerHandValue = 0;
        console.log("playerHandValue = " + playerHandValue);
        console.log("dealerHandValue = " + dealerHandValue);
        //Initialize the deck
		//The "deck" doesn't have to be a number and a suite, it just has to hold the value of the cards
		deck = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, "A", 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, "A", 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, "A", 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];
		//Shuffle the deck
		shuffle(deck);
        // Draw 4 cards, we're going to give two of them to each player and increment their score
        //Give a card to the player
		playerHandValue = drawCard(deck, playerHandValue);
		//Give card to the dealer
		dealerHandValue = drawCard(deck, dealerHandValue);
		//Give a card to the player
		playerHandValue = drawCard(deck, playerHandValue);
		//Give card to the dealer
		dealerHandValue = drawCard(deck, dealerHandValue);

        // Emit to the dealer his score
        io.to(dealerID).emit('update_score', {dealerHandValue});
        // Emit to the player his score
        io.to(playerID).emit('update_score', {playerHandValue});
        
        // Check if anyone has won already
        hasWon(playerHandValue, dealerHandValue);
    });

    // When a user draws a card, find out if it is the dealer, or the player and draw a card in consequence
    socket.on('hit_me', (data) => {

        switch(data.socketID) {
            case dealerID:
                dealerHandValue = drawCard(deck, dealerHandValue);
                break;
            case playerID:
                playerHandValue = drawCard(deck, playerHandValue);
                break;
        }
        // Emit to the dealer his score
        io.to(dealerID).emit('update_score', {dealerHandValue});
        // Emit to the player his score
        io.to(playerID).emit('update_score', {playerHandValue});
        
        // Check if anyone has won already
        hasWon(playerHandValue, dealerHandValue);
    });

    // When a user stays
    socket.on('stay', () => {
        // Emit to the dealer that the player stays
        io.to(dealerID).emit('player_stayed');
    });

    // Checks if anyone has won, if so, launches an alert
	function hasWon(playerHandValue, dealerHandValue) {
		// Checks if anyone has 21, if it's the case, alert who the winner is
		if (playerHandValue == 21 || dealerHandValue > 21) {
			console.log("Player has won ");
            io.emit('player_won');
		} else if (dealerHandValue == 21 || playerHandValue > 21) {
			console.log("Dealer has won ");
            io.emit('dealer_won');
		}
	}

    // Function that shuffles the deck
	function shuffle(deck) {
		for (var i = deck.length - 1; i > 0; i--) {
  			const j = Math.floor(Math.random() * i);
  			const temp = deck[i];
  			deck[i] = deck[j];
  			deck[j] = temp;
		}
		return deck;
	}// End of shuffle

    // Function that gives a card, removes card from deck and returns the score of that card
	function drawCard(deck, scoreToIncrement) {
		// 1st card in the deck
		var cardToReturn = deck[0];
		// Remove that card from the deck
		deck.shift();

		var scoreToIncrement = scoreToIncrement;
		// Check if card is an ace + increment the value of the hand by the value of the card
		if (deck[0] === "A") {
			if (scoreToIncrement > 11) {
				scoreToIncrement += 1;
			} else {
				scoreToIncrement += 11;
			}
		    } else {
			    scoreToIncrement += deck[0];
		    }

		// And return it
		return scoreToIncrement;
	}// End of giveCard


    // =========================
    // Player management systems
    function playerConnects(socket, role) {
        var newPlayer = {
            id: socket,
            role: role,
        }

        // Add this player to the list
        playersList.push(newPlayer);

        // If there are two players (one dealer and one player, then we begin)
        if (playersList.length == 2) {
            // Let all players know that enough players have joined
            io.emit('players_ready');
        }
    }

    // Loops through the list of players and returns the index
    function getPlayerIndex(playerId) {
        for (var i = 0; i < playersList.length; i++) {
            if (playersList[i].id == playerId) {
                return i;
            }
        }
    
        // If the player was not found
        return -1;
    }

    function disconnectPlayer(socket) {
        var thisPlayerIndex = getPlayerIndex(socket);

        // Remove the player from the array
        playersList.splice(thisPlayerIndex, 1);
        console.log(playersList);
    }
    // End of player management


});// End of IO


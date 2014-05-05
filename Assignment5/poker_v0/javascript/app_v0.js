/**
    Pairs - When two players have a pair, the highest pair wins.
    When both players have the same pair, the next highest card wins.
    This card is called the 'Kicker'.   For example, 5-5-J-7-4 beats 5-5-9-8-7.
    If the Pairs and the Kickers are the same, the consideration continues onward
    to the next highest card in the hand.   5-5-J-6-4 beats 5-5-J-5-3.   This evaluation
    process continues until both hands are exactly the same or there is a winner.

    Two Pairs - the higher ranked pair wins.   A-A-7-7-3 beats K-K-J-J-9.   If the top pairs
    are equal, the second pair breaks the tie.   If both the top pair and the second pair are
    equal, the kicker (the next highest card) breaks the tie.

    Three-of-a-Kind - the higher ranking card wins.   J-J-J-7-6 beats 10-10-10-8-7.

    Straights - the Straight with the highest ranking card wins.   A-K-Q-J-10 beats 10-9-8-7-6,
    as the A beats the 10.   If both Straights contain cards of the same rank, the pot is split.

    Flush - the Flush with the highest ranking card wins.   A-9-8-7-5 beats K-Q-J-5-4.   If
    the highest cards in each Flush are the same, the next highest cards are compared.   This
    process continues until either the hands are shown to be exactly the same, or there is a winner.

    Full House - the hand with the higher ranking set of three cards wins.   K-K-K-4-4 beats J-J-J-A-A.

    Four of a Kind - the higher ranked set of four cards wins.   7-7-7-7-2 beats 5-5-5-5-A.

    Straight Flush - ties are broken in the same manner as a straight, as the highest ranking card is the winner.

    Royal Flush - Sorry, Two or more Royal Flushes split the pot.
**/

var poker_hands = ["1kind", "pair", "2pair", "3kind", "straight", "flush", "fullhouse", "4kind", "straightflush"];  //lowest to highest

var rank_to_number = {
         "two":    1,
         "three":  2,
         "four":   3,
         "five":   4,
         "six":    5,
         "seven":  6,
         "eight":  7,
         "nine":   8,
         "ten":    9,
         "jack":  10,
         "queen": 11,
         "king":  12,
         "ace":   13   //special case - can be used as low for straight
  };

var slim = {"handle": "slim",
            "bluffer": true,
            "winnings": 0};

var annie = {"handle": "annie",
             "bluffer": true,
             "winnings": 0};

var pete = {"handle": "pete",
            "bluffer": false,
            "winnings": 0};

var slim_hand=[
  { "rank":"two", "suit":"spades" },
  { "rank":"three", "suit":"spades" },
  { "rank":"two", "suit":"spades" },
  { "rank":"three", "suit":"hearts" },
  { "rank":"three", "suit":"spades"}
]; 

var annie_hand=[
  { "rank":"two", "suit":"hearts" },
  { "rank":"four", "suit":"clubs" },
  { "rank":"four", "suit":"spades" },
  { "rank":"two", "suit":"hearts" },
  { "rank":"four", "suit":"spades" }
];

var pete_hand=[
  { "rank":"two", "suit":"spades" },
  { "rank":"three", "suit":"spades" },
  { "rank":"four", "suit":"spades" },
  { "rank":"five", "suit":"spades" },
  { "rank":"ace", "suit":"spades" }
];

//*** testing functions in this file-- use this "the_deal"
var the_deal = [ {"person": slim, "hand": slim_hand, "counts": null, "value": null, "place": 0, "highcard": 0, "highRank": 0},   //e.g., counts = {"two": 3, "five": 1, "jack": 1}
                 {"person": annie, "hand": annie_hand, "counts": null, "value": null, "place": 0, "highcard": 0, "highRank": 0}, //e.g., place = 1,2,3. Ties have same number.
                 {"person": pete, "hand": pete_hand, "counts": null, "value": null, "place": 0, "highcard": 0, "highRank": 0}     //e.g., value = 1kind, pair, straight, etc.
                ];  //highcard - the highest card in their hand. ie "ace" = 13. //highRank - where their hand stands commpared to the poker_hands array


//*** Dummy Data for html file. Use this "the_deal"
// var the_deal = [ {"person": slim, "hand": slim_hand, "counts": null, "value": "2pair", "place": 2, "highcard": 0, "highRank": 0},   //e.g., counts = {"two": 3, "five": 1, "jack": 1}
//                  {"person": annie, "hand": annie_hand, "counts": null, "value": "1kind", "place": 3, "highcard": 0, "highRank": 0}, //e.g., place = 1,2,3. Ties have same number.
//                  {"person": pete, "hand": pete_hand, "counts": null, "value": "fullhouse", "place": 1, "highcard": 0, "highRank": 0}     //e.g., value = 1kind, pair, straight, etc.
//                 ];  //highcard - the highest card in their hand. ie "ace" = 13. //highRank - where their hand stands commpared to the poker_hands array

//DONE!
function computeCounts(){
  the_deal.forEach( function ( player, i ){
    var ranks = player.hand.map( function ( card_obj ){ //takes an array player.hand and returns a new array player.hand.rank
      return card_obj.rank;
    });
    var counts = ranks.reduce( function (count_obj, rank){            //e.g., ["two", "king", "nine", ...]
        if( rank in count_obj ){
            count_obj[rank]++;
            return count_obj;
          } else{
            count_obj[rank] = 1;
            return count_obj;
          }
      }, { /* omitted */ });
     player.counts = counts;    //e.g., counts = {"two": 3, "five": 1, "jack": 1}
   //  console.log(JSON.stringify(player.counts, null, 4)); // important for later
  });
}

//DONE!
function largestRank( rank_array ){ //e.g., rank_array = ["two", "king", "nine", ...]
    //return largest rank in array, e.g., "king"
     return rank_array.reduce (function (high, cur){
      if( rank_to_number[cur] > rank_to_number[high] ) return cur; else return high;
     }, "two");
}

//DONE!
function smallestRank( rank_array ){
      return rank_array.reduce (function (low, cur){
        if( rank_to_number[cur] < rank_to_number[low] ) return cur; else return low;
       }, "ace");
}

//DONE!
function exactlyK( counter_obj, k ){  //e.g., counter_obj = {"two": 1, "ace": 3, "nine": 1}, k = 3 => ["ace"]. if k = 2 => []. k = 1 => ["two", "nine"]
  //return array of ranks that appear k times in hand
  return Object.keys( counter_obj ).filter (function ( rank ) { //filter takes in an array and returns true or false; if true - map object is copied to new array we're buliding.
      return counter_obj[rank] == k;
  });
}

//DONE!
function computeGroup( player ){
  var counts = player.counts; //e.g. {"two": 1, "ace": 3, "nine": 1}
  if ( exactlyK( counts, 4).length){
    return "4kind";
  } else if ( exactlyK( counts, 3).length){
    return "3kind";
  } else if ( exactlyK( counts, 2).length){
    return "2kind";
  } else if (exactlyK( counts, 1).length){
    return "1kind";
  } else {
    console.log("problem!!!");
  }
  //return 4kind, 3kind, 2pair, pair, 1kind as appropriate (always highest possible)
}

//DONE!
function isFullHouse( player ){
  //return true if player holds full-house
    var counts = player.counts; //e.g. {"two": 1, "ace": 3, "nine": 1}
    return ( exactlyK( counts, 3).length && exactlyK(counts, 2).length);
}

//DONE!
function isStraight( player ){
      //return true for both normal straight and special ace-low straight
    var counts = player.counts; //e.g. {"two": 1, "ace": 3, "nine": 1}
    var hand = [];
    player.hand.forEach(function ( obj, i ){
        hand[i] = obj.rank;
    });
    var large = rank_to_number[largestRank(hand)];
    player.highcard = large;
    var small = rank_to_number[smallestRank(hand)];
    var math = large - small + 1;
    return ( (math == 5 || math == 13) && computeGroup(player)==="1kind");
}

//DONE!
function isFlush( player ){
    //return true if all suits the same
    var suits = [];
    player.hand.forEach(function ( obj, i ){
        suits[i] = obj.suit;
        console.log(suits[i]);
    });
    var first = suits[0];
    return suits.slice(1).every( function ( suit ){
      return suit == first;
    });
}

//DONE!
function isStraightFlush( player ){
    return ( isFlush(player) && isStraight(player) );
}

//DONE!
function computeValues(){
    //for each player, compute value of hand and then fill in player.value
    the_deal.forEach( function ( player, i ){
      var value = null;
      var test1 = isStraightFlush ( player );
      var test2 = computeGroup( player ); //four of a kind
      var test3 = isFullHouse( player );  //full house 
      var test4 = isFlush( player );
      var test5 = isStraight( player );
      var cnt = player.counts;
      var cnt2 = 0;

      if(test1 == true){
        value = "straightflush";  //straight flush
      } else if(test2 == "4kind"){
        value = "4kind";          //4 of a kind
      } else if(test3 == true){
        value = "fullhouse";      //full house
      } else if(test4 == true){
        value = "flush";          //flush
      } else if(test5 == true){
        value = "straight";       //straight
      } else if(test2 == "3kind"){
        value = "3kind";          //3 of a kind 
      } else if(test2 == "2kind"){
        //check to see if 2 pair 
        $.each(cnt, function( index, value ){ // goes through each count to see if there is a pair
          if(value == 2){
              cnt2++;
          }
        });
        if(cnt2 == 2){
          value = "2pair";
        } else{
          value = "pair";
        }
      } else {
        value = "1kind";
      }
      console.log("Value: " + value);
      player.value = value;
      console.log(player);
    });
}


function computePlaces(){
  the_deal.forEach( function ( player, i ){
    var name = player.person.handle;
    // check their value and compare
    var value = player.value; // (ie. pair)
    console.log("value: " + value);
    var j = 0;  // value of player
    var arrayLen = poker_hands.length;
    
    //go through poker_hands and find how far in the array the player is
    for(var k = 0; k < arrayLen; k++){
      if(poker_hands[k] == value){
        j = k;
      }
    }
    //assign highRank to the player.. farther in the array is higher the rank (ie. 9) -- this is a number
    if( name == "slim"){
      player.highRank = j
      console.log("slim's highRank: " + player.highRank);
    } else if( name == "pete"){
      player.highRank = j
      console.log("pete's highRank: " + player.highRank);
    } else if( name == "annie"){
      player.highRank = j
      console.log("annie's highRank: " + player.highRank);
    } else {
      console.log("ERROR: in ComputerPlaces()");
    }
  });

  //iterate throught players again -- because now they all have a highRank
    var winner; //used to determine when a winner is returned from kickerSequence
    var place = 0;

      //compare the two players in case of a tie
    if(the_deal[0].highRank == the_deal[1].highRank){  
      console.log("entered here.");
      winner = kickerSequence(the_deal[0], the_deal[1]);

      if(the_deal[0].highRank > the_deal[2]){
        the_deal[2].place = 3;
        if(winner == "player1"){
          the_deal[0].place = 1;
          the_deal[1].place = 2;
        } else if(winner == "player2") {
          the_deal[0].place = 2;
          the_deal[1].place = 1;
        } else{
          console.log("True tie");
        }
      } else{
        the_deal[2].place = 1;
        if(winner == "player1"){
          the_deal[0].place = 2;
          the_deal[1].place = 3;
        } else if(winner == "player2") {
          the_deal[0].place = 3;
          the_deal[1].place = 2;
        } else{
          console.log("True tie");
        }
      }


    } else if(the_deal[0].highRank == the_deal[2].highRank){
      winner = kickerSequence(the_deal[0], the_deal[2]);
    } else if(the_deal[1].highRank == the_deal[2].highRank){
      winner = kickerSequence(the_deal[1], the_deal[2]);


      //END OF TIES
    } else if (the_deal[0].highRank > the_deal[1].highRank && the_deal[0].highRank > the_deal[2].highRank){ // player1 gets 1st place
      the_deal[0].place = 1;
      if(the_deal[1].highRank > the_deal[2].highcard){
        the_deal[1].place = 2;
        the_deal[2].place = 3;
      } else{
        the_deal[1].place = 3;
        the_deal[2].place = 2;
      }
    } else if(the_deal[0].highRank > the_deal[1].highRank && the_deal[0].highRank < the_deal[2].highRank){ //player1 gets 2nd place
      the_deal[0].place = 2;
      if(the_deal[1].highRank > the_deal[2].highcard){
        the_deal[1].place = 1;
        the_deal[2].place = 3;
      } else{
        the_deal[1].place = 3;
        the_deal[2].place = 1;
      }
    } else if(the_deal[0].highRank < the_deal[1].highRank && the_deal[0].highRank < the_deal[2].highRank){ // player1 gets 3rd place
      the_deal[0].place = 3;
      if(the_deal[1].highRank > the_deal[2].highcard){
        the_deal[1].place = 1;
        the_deal[2].place = 2;
      } else{
        the_deal[1].place = 2;
        the_deal[2].place = 1;
      }
    } else{
      console.log("something fishy is going on here");
    }

    console.log("***************");
    console.log(the_deal[0].person.handle + " " + the_deal[0].place);
    console.log(the_deal[1].person.handle + " " + the_deal[1].place);
    console.log(the_deal[2].person.handle + " " + the_deal[2].place);
  
  //use values of players' hands to figure out their placement (1,2,3)
  //Tricky part is ties on hand value, e.g., slim and pete both have 1kind.
  //Then have to invoke tie-breaker rules (see top of file). Challenging problem!
}




function kickerSequence( player1, player2 ){
  console.log("entered kicker");
    //for 1kind and flush ties, sort ranks and compare one by one.
    //return winning player or null if true tie
    var winner;
    
    var p1 = player1.highcard;  // highest card in hand
    var p1val = player1.value; //type fullhouse

    console.log("player1: " + p1, p1val);
    var group1 = computeGroup(player1);
    console.log(group1); //3kind


    var p1counts = player1.counts; //e.g. {"two": 1, "ace": 3, "nine": 1}
    console.log(p1counts);
    var p2counts = player2.counts;
    
    var p2 = player2.highcard;
    var p2val = player2.value;

    //temp variables
    var t1, t2; // player 1
    var q1, q2; // player 2

  // BEGIN FULL HOUSE, compare 3 of a kind then 2 of a kind
      $.each(p1counts, function(key, value) {
        console.log(key, value);
        if (value == 3){
          t1 = key;
        }
        if (value == 2){
          t2 = key;
        }
      });

      $.each(p2counts, function(key, value) {
        console.log(key, value);
        if (value == 3){
          q1 = key;
        }
        if (value == 2){
          q2 = key;
        }
      });

      if(t1 > q1){
        return "player1";
      } else if(q1 > t1){
        return "player2";
      } else if(t2 > q2){
        return "player1";
      } else if(q2 > t2){
        return "player2";
      } else{
        //continue on comparing
      }

      //END OF FULL HOUSE




    console.log("player2: " + p2, p2val);
    if(p1 > p2){
      return "player1";
    } else if( p2 > p1){
      return "player2";
    } else if( p1 == p2 ){
      console.log("they tied in the kicker");
    } else{
      console.log("lalala");
    }
}



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
  // { "rank":"two", "suit":"spades" },
  // { "rank":"four", "suit":"spades" },
  // { "rank":"two", "suit":"spades" },
  // { "rank":"king", "suit":"spades" },
  // { "rank":"eight", "suit":"spades"}
]; 

var annie_hand=[
  // { "rank":"two", "suit":"hearts" },
  // { "rank":"three", "suit":"clubs" },
  // { "rank":"four", "suit":"spades" },
  // { "rank":"five", "suit":"hearts" },
  // { "rank":"six", "suit":"spades" }
];

var pete_hand=[
  // { "rank":"two", "suit":"spades" },
  // { "rank":"three", "suit":"spades" },
  // { "rank":"four", "suit":"spades" },
  // { "rank":"five", "suit":"spades" },
  // { "rank":"ace", "suit":"spades" }
];

var the_deal = [ {"person": slim, "hand": slim_hand, "counts": null, "value": "1kind", "place": 3, "highcard": null},   //e.g., counts = {"two": 3, "five": 1, "jack": 1}
                 {"person": annie, "hand": annie_hand, "counts": null, "value": "pair", "place": 2, "highcard": null}, //e.g., place = 1,2,3. Ties have same number.
                 {"person": pete, "hand": pete_hand, "counts": null, "value": "fullhouse", "place": 1, "highcard": null}     //e.g., value = 1kind, pair, straight, etc.
                ];


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


function largestRank( rank_array ){ //e.g., rank_array = ["two", "king", "nine", ...]
    //return largest rank in array, e.g., "king"
     return rank_array.reduce (function (high, cur){
      if( rank_to_number[cur] > rank_to_number[high] ) return cur; else return high;
     }, "two");
}

function smallestRank( rank_array ){
      return rank_array.reduce (function (low, cur){
        if( rank_to_number[cur] < rank_to_number[low] ) return cur; else return low;
       }, "ace");
}

function exactlyK( counter_obj, k ){  //e.g., counter_obj = {"two": 1, "ace": 3, "nine": 1}, k = 3 => ["ace"]. if k = 2 => []. k = 1 => ["two", "nine"]
  //return array of ranks that appear k times in hand
  return Object.keys( counter_obj ).filter (function ( rank ) { //filter takes in an array and returns true or false; if true - map object is copied to new array we're buliding.
      return counter_obj[rank] == k;
  });
}

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

function isFullHouse( player ){
  //return true if player holds full-house
    var counts = player.counts; //e.g. {"two": 1, "ace": 3, "nine": 1}
    return ( exactlyK( counts, 3).length && exactlyK(counts, 2).length);
}

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

function isStraightFlush( player ){
    return ( isFlush(player) && isStraight(player) );
}


function computeValues(){
    //for each player, compute value of hand and then fill in player.value
    the_deal.forEach( function ( player, i ){
      var value = null;
//      console.log(player);
      var test1 = isStraightFlush ( player );
//      console.log("test1: " + test1);
      var test2 = computeGroup( player ); //four of a kind
//      console.log("highest kind: " + test2);
      var test3 = isFullHouse( player );  //full house 
//      console.log("test3: " + test3);
      var test4 = isFlush( player );
//      console.log("test4: " + test4);
      var test5 = isStraight( player );
 //     console.log("test5: " + test5);

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
      } else if(test2 == "2 kind"){
        value = "pair";           //2pair pair ---still need
      } else {
        value = "1pair";
      }
      console.log("Value: " + value);
      player.value = value;
      console.log(player);

    });
}

function computePlaces(){
  the_deal.forEach( function ( player, i ){
    var place = 0;
    


    player.place = place;
  });


  //use values of players' hands to figure out their placement (1,2,3)
  //Tricky part is ties on hand value, e.g., slim and pete both have 1kind.
  //Then have to invoke tie-breaker rules (see top of file). Challenging problem!
  }

function kickerSequence( player1, player2 ){

    //for 1kind and flush ties, sort ranks and compare one by one.
    //return winning player or null if true tie
}



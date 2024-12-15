//Slot reels are the vertical positions(col) in a slot that spin around when you hit the spin button. 
// There are typically multiple reels, each of which will display a predetermined number of symbols. 
// The aim of a slot game is to land matching combinations across the reels.

//1.deposit some money before betting
//2.determine the no. of lines
//3.collect a bet amount
//4. spin the machine
//5. check if won
//6. reward the money if won
//7.terminate or renew when money over or play again

//call js by 'node {project_name}.js
//this is usual way known
// function deposit(){
//     return 1
// }

//this is es6 version of function, better to use now
//Arrow functions are not hoisted. They must be defined before they are used.
//Using const is safer than using var, because a function expression is always a constant value.

const prompt_func = require("prompt-sync")(); //the package we use to input data for deposit
//give () at last as we require this module we r using and the parenthesis gives access to func that we use to get user input

//depict how big the slot machine is using var and how many symbols we may have in each row
//first find no. of rows and columns i.e no of reels, and symbols--value of each symbol and its quantity
//convention sequence, 1st imports top, then global var - classes n func,the main line
//convention global var written all cap that are const

const ROWS = 3;
const COLS = 4;
//can use {"A":2 or A:2} same
const SYMBOL_QUANTITY = {
    A : 2, B : 4,C:6, D:8//these sym are what we might have in col or rows ie all possible outcome and randomly select from here
}//keys mapped to some val, symbol[A] --> 2

const SYMBOL_VALUES = {
    A:5, B:4,C:3,D:2 //that means if I get a line of A(s),it will be multiplied by 5, ie multiplier val
}


const deposit = () => {
    while (true){
        const depositAmount = prompt_func("Enter a deposit amount: ");
        const numberDepositAmount = parseFloat(depositAmount);
    
        if (isNaN(numberDepositAmount) || numberDepositAmount <= 0){
            console.log("Invalid deposit amount, try again.");
        } else{
            return numberDepositAmount
        }
    }   
};

const getNumberOfLines = () => {
    while (true){
        const lines = prompt_func("Enter the number of lines to bet on (1-3): ");
        const numberOfLines = parseFloat(lines);//parsefloat takes str n converts into its floating point val
        //'17.2'--17.2, 'hello' -- NaN(not a number)        
    
        if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3){
            console.log("Invalid number of lines, try again.");
        } else{
            return numberOfLines
        }
    }   
};
//parameter of getBet is the balance as we need checking
const getBet = (balance,lines) => {
    while (true){
        const bet = prompt_func("Enter the betting amount per line: ");
        const numBet = parseFloat(bet);//parsefloat takes str n converts into its floating point val
        //'17.2'--17.2, 'hello' -- NaN(not a number)        
    
        if (isNaN(numBet) || numBet <= 0 || numBet > (balance/lines)){
            console.log("Invalid bet, try again.");
        } else{
            return numBet
        }
    }   
};

//array is a reference type in js ie I can manipulate whats inside the array without changing its reference to the array itself,we arent changing what array I'm using, we r just adding elems
//so i dont need to reassign a new val to symbols,i can just add inside whatever i want n it wont contradict principle of const

const spin = () => {
    const symbols_l2 = [];
    for ( const [sym, count] of Object.entries(SYMBOL_QUANTITY)){
        for (let i = 0; i < count; i ++){
            symbols_l2.push(sym)//symbols_l2 has only the symbols available to use, not quantity or its worth
        }
    }

    const reels = [] 
    for (let i = 0; i < COLS; i ++){
        reels.push([])//reels are columns
        const reelSymbols = [...symbols_l2];//copies symbol_l2,we have unique arrays for that specific reels--cz init we want all sym,but as a symbol added randomly;
        //that sym must be removed from reelsSym so that 1st col has no repeat, but again have all elem for 2nd col
        for (let j = 0; j < ROWS; j++){
            const randomIndex = Math.floor(Math.random() * reelSymbols.length); 
            //let [A,B,C] er random ind = 1(len = 3, opt 0,1,2),sym[1] =B, so B added to select, sliced B, now [A,C] so random choice*2 -- 0,1(as math.floor)
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);//reels er 1st col e added all, when all over, i+=1, 2nd col of reels added
            reelSymbols.splice(randomIndex,1);//1 is cz remove only one elem
        }
    }
    return reels;//return all col
};
//this below codes problem as num of col n row not same
const transpose = (reels) =>{
    const rows = [];

    for (let i = 0; i < ROWS; i++){
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
};
// const zip = (arr) =>{ 
//     return arr[0].map((_, i) => arr.map(array => array[i]));
// }
// const transpose = (reels) =>{
//     return zip(reels);
// } this is alt transpose

const printSpins = (rows) => {
    for (const row of rows){//like for item in item_lst - iterate by items
        let rowString = "";//we want like A|B|C
        for (const [i, symbol] of row.entries()){
            rowString += symbol
            if (i != row.length - 1){
                rowString += "|"
            }
        }
        console.log(rowString)
    }
}

const getWinnings = (rows, bet, lines) =>{
    let winnings = 0;

    for (let row = 0; row < lines; row ++){
        const sym = rows[row];
        let allSame = true;

        for (const s of sym) {
            if (s != sym[0]){//i m using 1st sym as reference, i check all the symbols if they equal to 1st sym
                allSame = false;//in case any sym not equal to 1st, means all not equal,so break
                break
            }
        }
        if (allSame){
            winnings += bet*SYMBOL_VALUES[sym[0]] //if all A, then win- so SYMBOL_VALUES[A] -->5, so multiplier of bet is 5
        }
    }
    return winnings
}

game = () => {
    let balance = deposit();  
    
    while (true){
        console.log("You have a balance of $"+balance );
        const numberOfLines = getNumberOfLines(); 
        const bet = getBet(balance, numberOfLinesnn); 
        balance -= bet * numberOfLines; //we update balance as it decreases after betting 
        const reels = spin();
        const rows = transpose(reels);
        printSpins(rows);
        const winnings = getWinnings(rows, bet, numberOfLines);
        balance += winnings;
        console.log("You won, $"+winnings.toString());

        if (balance <= 0){
            console.log("You ran out of money!");
            break;
        }
        const playAgain = prompt_func("Do you want to play again (y/n?");

        if (playAgain != "y") break;//game terminates if user says n(no) or ran out of money
    }
    
};

game();

//Math.random() returns a random number between 0 (inclusive),  and 1 (exclusive)
//Math.random() always returns a number lower than 1
//Math.random() used with Math.floor() can be used to return random integers.
// Returns a random integer from 0 to 9:  Math.floor(Math.random() * 10)
// Returns a random integer from 1 to 10:  Math.floor(Math.random() * 10) + 1;

//The splice() method adds and/or removes array elements.
//The splice() method overwrites the original array.
//array.splice(index, count, item1, ....., itemX)
//index: Required. The index (position) to add or remove items. A negative value counts from the end of the array.
//count: Optional.Number of items to be removed.
//item1, ...,: Optional. The new elements(s) to be added.

//[1,2,3][4,5,6][6,7,8][9 0 1] be the columns, but for checking we need the row val to be same
//so we transpose n check if row all same
//[1,4,6,9]
//[2,5,7,0]
//[3,6,8,1]

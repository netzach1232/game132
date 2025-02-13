const cards = ['7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
let results = [];
let currentDraw = 0;
let totalWinnings = 0;
let totalDraws = 0;

async function loadResults() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/netzach1232/game132/main/lottery.csv');
        if (!response.ok) throw new Error('בעיה בטעינת הקובץ');

        const data = await response.text();
        const rows = data.split("\n").map(row => row.split(","));

        console.log("כותרות מה-CSV:", rows[0]);

        results = rows.slice(1).map(row => row.slice(2, 6)); // שמירת 4 הקלפים מכל שורה
    } catch (error) {
        console.error("שגיאה בטעינת הקובץ: ", error);
    }
}

function populateSelects() {
    let suits = ['alea', 'heart', 'diamond', 'clover'];
    suits.forEach(suit => {
        let select = document.getElementById(suit);
        cards.forEach(card => {
            let option = document.createElement('option');
            option.value = card;
            option.textContent = card;
            select.appendChild(option);
        });
    });
}

function drawLottery() {
    if (currentDraw < results.length) {
        let chosenCards = {
            alea: document.getElementById('alea').value,
            heart: document.getElementById('heart').value,
            diamond: document.getElementById('diamond').value,
            clover: document.getElementById('clover').value
        };
        
        let betAmount = parseInt(document.getElementById('bet').value);
        let drawnResults = results[currentDraw];
        document.getElementById('results').innerText = `תוצאות: ${drawnResults.join(', ')}`;
        
        let messageBox = document.getElementById('message');
        let winnings = 0;
        
        Object.keys(chosenCards).forEach((key, index) => {
            if (chosenCards[key] === drawnResults[index]) {
                winnings += betAmount * 5;
            }
        });
        
        totalWinnings += winnings;
        totalDraws++;
        document.getElementById('winnings').innerText = `סכום זכייה: ${totalWinnings}`;
        document.getElementById('drawCount').innerText = `מספר ההגרלות שביצעת: ${totalDraws}`;
        
        if (winnings > 0) {
            messageBox.innerText = "זכית!";
            messageBox.style.color = "green";
        } else {
            messageBox.innerText = "לא זכית!";
            messageBox.style.color = "red";
        }
        
        setTimeout(() => { messageBox.innerText = ""; }, 2000);
        currentDraw++;
    } else {
        document.getElementById('results').innerText = "אין יותר הגרלות זמינות";
    }
}

function resetLottery() {
    currentDraw = 0;
    totalWinnings = 0;
    totalDraws = 0;
    document.getElementById('results').innerText = "תוצאות יופיעו כאן";
    document.getElementById('winnings').innerText = "סכום זכייה: 0";
    document.getElementById('message').innerText = "";
    document.getElementById('drawCount').innerText = "מספר ההגרלות שביצעת: 0";
}

window.onload = async function() {
    await loadResults();
    populateSelects();
};

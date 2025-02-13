const cards = ['7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
let results = [];
let currentDraw = 0;
let totalWinnings = 0;

async function loadResults() {
    const response = await fetch('lottery.csv'); // קובץ ההגרלות צריך להיות באותה תיקייה
    const data = await response.text();
    const rows = data.split("\n").map(row => row.split(",")); // מחלק את הנתונים
    const leafIndex = rows[0].indexOf("עלה"); // מוצא את עמודת 'עלה'
    results = rows.slice(1).map(row => row[leafIndex]).filter(val => val); // שומר רק את הנתונים של עלה
}

function populateSelects() {
    let select = document.getElementById('alea');
    cards.forEach(card => {
        let option = document.createElement('option');
        option.value = card;
        option.textContent = card;
        select.appendChild(option);
    });
}

function drawLottery() {
    if (currentDraw < results.length) {
        let chosenCard = document.getElementById('alea').value;
        let betAmount = parseInt(document.getElementById('bet').value);
        let result = results[currentDraw];
        document.getElementById('results').innerText = `תוצאה: ${result}`;
        
        let messageBox = document.getElementById('message');
        if (chosenCard === result) {
            totalWinnings += betAmount * 5;
            messageBox.innerText = "זכית!";
            messageBox.style.color = "green";
        } else {
            totalWinnings -= betAmount;
            messageBox.innerText = "הפסדת!";
            messageBox.style.color = "red";
        }
        
        document.getElementById('winnings').innerText = `סכום זכייה: ${totalWinnings}`;
        
        setTimeout(() => { messageBox.innerText = ""; }, 2000);
        currentDraw++;
    }
}

function resetLottery() {
    currentDraw = 0;
    totalWinnings = 0;
    document.getElementById('results').innerText = "תוצאות יופיעו כאן";
    document.getElementById('winnings').innerText = "סכום זכייה: 0";
    document.getElementById('message').innerText = "";
}

window.onload = async function() {
    await loadResults();
    populateSelects();
};
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

        results = rows.slice(1).map(row => row.slice(2, 7)); // שמירת כל התוצאות של העלה
    } catch (error) {
        console.error("שגיאה בטעינת הקובץ: ", error);
    }
}

function populateSelects() {
    let cardSelectionDiv = document.getElementById("cardSelection");
    cardSelectionDiv.innerHTML = "";
    
    let numCards = parseInt(document.getElementById("numCards").value);
    for (let i = 0; i < numCards; i++) {
        let select = document.createElement("select");
        select.classList.add("cardSelect");
        cards.forEach(card => {
            let option = document.createElement("option");
            option.value = card;
            option.textContent = card;
            select.appendChild(option);
        });
        cardSelectionDiv.appendChild(select);
    }
}

document.getElementById("numCards").addEventListener("change", populateSelects);

function drawLottery() {
    if (currentDraw >= results.length) {
        document.getElementById('results').innerText = "אין יותר הגרלות זמינות";
        return;
    }
    
    let chosenCards = Array.from(document.getElementsByClassName("cardSelect"))
        .map(select => select.value);
    
    let betAmount = parseInt(document.getElementById("bet").value);
    let drawnResults = results[currentDraw].slice(0, chosenCards.length);
    document.getElementById('results').innerText = `תוצאות: ${drawnResults.join(', ')}`;
    
    let winnings = 0;
    chosenCards.forEach((card, index) => {
        if (card === drawnResults[index]) {
            winnings += betAmount * 5;
        }
    });
    
    totalWinnings += winnings;
    totalDraws++;
    document.getElementById('winnings').innerText = `סכום זכייה: ${totalWinnings}`;
    document.getElementById('drawCount').innerText = `מספר ההגרלות שביצעת: ${totalDraws}`;
    
    let messageBox = document.getElementById('message');
    if (winnings > 0) {
        messageBox.innerText = "זכית!";
        messageBox.style.color = "green";
    } else {
        messageBox.innerText = "לא זכית!";
        messageBox.style.color = "red";
    }
    
    setTimeout(() => { messageBox.innerText = ""; }, 2000);
    currentDraw++;
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

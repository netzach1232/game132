const cards = ['7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
let results = [];
let currentDraw = 0;
let totalWinnings = 0;
let totalDraws = 0; // ספירת מספר ההגרלות

async function loadResults() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/netzach1232/game132/main/lottery.csv');
        if (!response.ok) throw new Error('בעיה בטעינת הקובץ');

        const data = await response.text();
        const rows = data.split("\n").map(row => row.split(","));

        console.log("כותרות מה-CSV:", rows[0]); // נבדוק איך נראות הכותרות האמיתיות

        const leafIndex = rows[0].findIndex(col => col.includes("???")); // מחפש כל עמודה עם "???"
        if (leafIndex === -1) throw new Error('עמודת ??? לא נמצאה');

        results = rows.slice(1).map(row => row[leafIndex]).filter(val => val);
    } catch (error) {
        console.error("שגיאה בטעינת הקובץ: ", error);
    }
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
    let numCards = parseInt(document.getElementById('numCards').value); // מספר הקלפים להגרלה
    if (currentDraw + numCards <= results.length) {
        let drawnResults = results.slice(currentDraw, currentDraw + numCards);
        document.getElementById('results').innerText = `תוצאות: ${drawnResults.join(', ')}`;
        currentDraw += numCards;
        totalDraws++;
        document.getElementById('drawCount').innerText = `מספר ההגרלות שביצעת: ${totalDraws}`;
    } else {
        document.getElementById('results').innerText = "אין מספיק הגרלות זמינות";
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

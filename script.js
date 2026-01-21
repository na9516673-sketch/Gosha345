// CLOCK
const mainClock = document.getElementById('mainClock');
function updateClock(){
    const d = new Date();
    mainClock.textContent = d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0');
}
setInterval(updateClock, 1000);
updateClock();

// BATTERY
const batteryFill = document.getElementById('batteryFill');
const batteryText = document.getElementById('batteryText');
if(navigator.getBattery){
    navigator.getBattery().then(b => {
        function update(){
            const l = Math.round(b.level * 100);
            batteryText.textContent = l + '%';
            batteryFill.style.width = l + '%';
            batteryFill.style.background = l >= 50 ? '#4cd964' : l >= 20 ? '#ffcc00' : '#ff3b30';
        }
        update();
        b.addEventListener('levelchange', update);
    });
} else {
    batteryText.textContent = 'N/A';
    batteryFill.style.width='0%';
}

// OPEN/CLOSE APPS
function openApp(id){document.getElementById(id).style.display='flex'}
function closeApp(id){document.getElementById(id).style.display='none'}

// CALCULATOR
const display = document.getElementById('calcDisplay');
function pressCalc(v){display.value+=v;}
function clearCalc(){display.value='';}
function toggleSign(){
    if(display.value.startsWith('-')) display.value=display.value.slice(1);
    else display.value='-'+display.value;
}
function calculate(){
    try{
        display.value = Function("return "+display.value.replace(/×/g,'*').replace(/÷/g,'/'))();
    } catch {
        display.value = 'Ошибка';
    }
}
document.getElementById('calculator-icon').addEventListener('click',()=>openApp('calculatorApp'));

// NOTES APP
const notesArea = document.getElementById('notesArea');
const notesKey = 'tabletNotes';
notesArea.value = localStorage.getItem(notesKey) || '';
notesArea.addEventListener('input', () => { localStorage.setItem(notesKey, notesArea.value); });
document.getElementById('notes-icon').addEventListener('click', () => openApp('notesApp'));

// DOCK ICONS
document.getElementById('yandex-browser').addEventListener('click',()=>window.open('https://ya.ru','_blank'));
document.getElementById('youtube-icon').addEventListener('click',()=>window.open('https://m.youtube.com/','_blank'));
document.getElementById('chatgpt-icon').addEventListener('click',()=>window.open('https://chat.openai.com/','_blank'));

// SEARCH BAR
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('keypress', e => {
    if(e.key==='Enter'){
        const q = searchInput.value.trim();
        if(q) window.open('https://www.google.com/search?q='+encodeURIComponent(q),'_blank');
    }
});

// MICROPHONE
const micButton = document.querySelector('.search-mic');
if('webkitSpeechRecognition' in window || 'SpeechRecognition' in window){
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'ru-RU';
    recognition.interimResults = false;
    recognition.onresult = event => {
        const t = event.results[0][0].transcript;
        searchInput.value = t;
        window.open('https://www.google.com/search?q='+encodeURIComponent(t),'_blank');
    };
    micButton.addEventListener('click',()=>recognition.start());
} else {
    micButton.addEventListener('click',()=>alert('Ваш браузер не поддерживает распознавание речи.'));
}

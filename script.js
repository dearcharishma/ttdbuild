/* --- GOOGLE FORMS CONFIGURATION --- */
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdxTnzlOo4MWCa7iZfjwB74PALB0FBqFRhphLm7QgkHHHgC-w/formResponse"; 

const GOOGLE_ENTRY_IDS = {
    name: "entry.529143333",
    rating: "entry.119376603",
    message: "entry.2127328013"
};

/* --- AUDIO & FLOWERS --- */
const bgMusic = document.getElementById('bgMusic');
const audioControlBtn = document.querySelector('.audio-control');
let isPlaying = false; 

window.addEventListener('load', () => {
    bgMusic.pause(); isPlaying = false; audioControlBtn.classList.remove('playing');
    startFlowerRain();
});

function toggleAudio() {
    if (isPlaying) { bgMusic.pause(); audioControlBtn.classList.remove('playing'); isPlaying = false; }
    else { bgMusic.play(); audioControlBtn.classList.add('playing'); isPlaying = true; }
}

function startFlowerRain() {
    for(let i=0; i<5; i++) setTimeout(() => spawnFlower(true), i * 800);
    scheduleNextFlower();
}
function scheduleNextFlower() {
    const nextTime = Math.random() * 1500 + 1500; 
    setTimeout(() => { spawnFlower(false); scheduleNextFlower(); }, nextTime);
}
function spawnFlower(isInitial) {
    const container = document.getElementById('flowerContainer');
    const flower = document.createElement('div');
    flower.classList.add('flower');
    flower.innerHTML = '<img src="flowers.png" alt="flower">';
    const size = Math.random() * 20 + 40; 
    flower.style.width = `${size}px`; flower.style.height = `${size}px`;
    flower.style.left = Math.random() * 95 + 'vw';
    const fallDuration = Math.random() * 5 + 10; 
    const swayDuration = Math.random() * 3 + 4;
    flower.style.animationName = 'fall, sway';
    flower.style.animationDuration = `${fallDuration}s, ${swayDuration}s`;
    flower.style.animationTimingFunction = 'linear, ease-in-out';
    flower.style.animationIterationCount = '1, infinite';
    if (isInitial) flower.style.top = '-15%';
    container.appendChild(flower);
    setTimeout(() => { flower.remove(); }, fallDuration * 1000);
}

/* --- FEEDBACK LOGIC --- */
function openFeedback() { document.getElementById('feedbackModal').classList.add('active'); }
function closeFeedback() { document.getElementById('feedbackModal').classList.remove('active'); }

function setRating(n) {
    document.getElementById('selectedRating').value = n;
    const stars = document.querySelectorAll('.star-rating i');
    stars.forEach((star, index) => {
        if (index < n) star.classList.add('active');
        else star.classList.remove('active');
    });
}

function submitFeedback() {
    const name = document.getElementById('fbName').value;
    const rating = document.getElementById('selectedRating').value;
    const msg = document.getElementById('fbMsg').value;

    if (!name || rating == "0" || !msg) {
        alert("Please fill all fields and select a rating.");
        return;
    }

    // Construct Form Data
    const formData = new FormData();
    formData.append(GOOGLE_ENTRY_IDS.name, name);
    formData.append(GOOGLE_ENTRY_IDS.rating, rating + " Stars");
    formData.append(GOOGLE_ENTRY_IDS.message, msg);

    // Submit via fetch (no-cors mode to bypass CORS error)
    fetch(GOOGLE_FORM_URL, {
        method: "POST",
        mode: "no-cors",
        body: formData
    }).then(() => {
        alert("Thank you! Your feedback has been sent.");
        closeFeedback();
        document.getElementById('fbName').value = "";
        document.getElementById('fbMsg').value = "";
        setRating(0);
    }).catch(err => {
        alert("Error sending feedback. Please check your connection.");
        console.error(err);
    });
}

/* --- CALCULATOR LOGIC --- */
function toggleView() {
    const isChecked = document.getElementById('modeToggle').checked;
    const standardView = document.getElementById('standardView');
    const backdatedView = document.getElementById('backdatedView');
    const lblAuto = document.getElementById('lblAuto');
    const lblManual = document.getElementById('lblManual');
    if (isChecked) { standardView.classList.add('hidden'); backdatedView.classList.remove('hidden'); lblAuto.classList.remove('active'); lblManual.classList.add('active'); } 
    else { standardView.classList.remove('hidden'); backdatedView.classList.add('hidden'); lblAuto.classList.add('active'); lblManual.classList.remove('active'); }
}
function swapAutoDarshans() { const prev = document.getElementById('prevDarshan'); const next = document.getElementById('nextDarshan'); const temp = prev.value; prev.value = next.value; next.value = temp; }
function swapManualDarshans() { const t1 = document.getElementById('bdType1'); const t2 = document.getElementById('bdType2'); const temp = t1.value; t1.value = t2.value; t2.value = temp; }

function getGapRules(prevType, nextType) {
    let requiredGap = 0; let isStrictNextDay = false;
    if ((prevType === 'lucky_online' && nextType === 'lucky_online') || (prevType === 'lucky_offline' && nextType === 'lucky_offline') || (prevType === 'arjitha' && nextType === 'arjitha')) { requiredGap = 180; }
    else if (prevType === 'ssd_local' && (nextType === 'ssd_local' || nextType === 'ssd_free' || nextType === 'footpath')) { requiredGap = 90; }
    else if (prevType === 'senior' && nextType === 'senior') { requiredGap = 90; }
    else if (prevType === 'voluntary' && nextType === 'voluntary') { requiredGap = 90; }
    else if (prevType === 'anga' && nextType === 'anga') { requiredGap = 90; }
    else if (prevType === 'voluntary' && nextType === 'lucky_offline') { requiredGap = 1; isStrictNextDay = true; }
    else if ((prevType === 'ssd_free' || prevType === 'footpath') && nextType === 'ssd_local') { requiredGap = 30; }
    else if ((prevType === 'ssd_free' || prevType === 'footpath') && (nextType === 'ssd_free' || nextType === 'footpath')) { requiredGap = 30; }
    else if (prevType === 'local_seva' && nextType === 'local_seva') { requiredGap = 30; }
    else if ((prevType === 'sed' && nextType === 'sed') || (prevType === 'virtual' && nextType === 'virtual') || (prevType === 'homam' && nextType === 'homam') || (prevType === 'infant' && nextType === 'infant')) { requiredGap = 30; }
    else if ((prevType === 'room_tiru_online' || prevType === 'room_tiru_offline') && (nextType === 'room_tiru_online' || nextType === 'room_tiru_offline')) { requiredGap = 30; }
    else if ((prevType === 'room_tpt_online' || prevType === 'room_tpt_offline') && (nextType === 'room_tpt_online' || nextType === 'room_tpt_offline')) { requiredGap = 30; }
    return { gap: requiredGap, isStrict: isStrictNextDay };
}

function calculateStandardGap() {
    const prevType = document.getElementById('prevDarshan').value;
    const prevDateVal = document.getElementById('prevDate').value;
    const nextType = document.getElementById('nextDarshan').value;

    if (!prevType || !prevDateVal || !nextType) {
        alert("Please fill in all details.");
        return;
    }

    const lastDate = new Date(prevDateVal);
    const today = new Date();
    lastDate.setHours(0,0,0,0);
    today.setHours(0,0,0,0);

    const timeDiff = today.getTime() - lastDate.getTime();
    const daysPassed = Math.floor(timeDiff / (1000 * 3600 * 24));

    // Get Rule
    const rule = getGapRules(prevType, nextType);
    let safeGap = rule.gap;

    // Apply Safe Date Logic (+1 day unless strict)
    if (rule.gap > 0) {
        if (rule.isStrict) {
            safeGap = rule.gap; 
        } else {
            safeGap = rule.gap + 1; 
        }
    }

    const daysRemaining = safeGap - daysPassed;
    showModal(daysRemaining, rule.gap, safeGap, lastDate, today);
}

function calculateBackdatedGap() {
    const t1 = document.getElementById('bdType1').value; 
    const d1v = document.getElementById('bdDate1').value;
    const t2 = document.getElementById('bdType2').value; 
    const d2v = document.getElementById('bdDate2').value;

    if (!t1 || !d1v || !t2 || !d2v) { alert("Please fill in both dates."); return; }
    
    const d1 = new Date(d1v); const d2 = new Date(d2v);
    d1.setHours(0,0,0,0); d2.setHours(0,0,0,0);
    
    const actualGap = Math.floor(Math.abs(d2.getTime() - d1.getTime()) / (1000 * 3600 * 24));
    const rule = getGapRules(t1, t2);
    
    // Calculate Safe Gap
    let safeGap = rule.gap;
    if (rule.gap > 0) {
        if (rule.isStrict) safeGap = rule.gap;
        else safeGap = rule.gap + 1;
    }

    let isSuccess = false;
    let daysShort = 0;

    if (rule.gap === 0) {
        isSuccess = true;
    } else {
        if (actualGap >= safeGap) {
            isSuccess = true;
        } else {
            isSuccess = false;
            daysShort = safeGap - actualGap;
        }
    }

    const eligibleDate = new Date(d1); 
    eligibleDate.setDate(d1.getDate() + safeGap);
    
    // Passing all params (including eligibleDate) but we WON'T use it in the message for failure
    showModalComparison(isSuccess, actualGap, rule.gap, eligibleDate, daysShort);
}

function showModal(daysRemaining, requiredGap, safeGap, lastDate, today) {
    const modal = document.getElementById('resultModal');
    const content = document.getElementById('modalContent');
    const icon = document.getElementById('modalIcon'); 
    const title = document.getElementById('modalTitle'); 
    const msg = document.getElementById('modalMsg');
    
    content.classList.remove('status-success', 'status-wait');
    
    if (daysRemaining <= 0 || requiredGap === 0) {
        content.classList.add('status-success'); 
        icon.innerHTML = '✅'; 
        title.innerHTML = 'You are Eligible!'; 
        title.style.color = '#2ecc71';
        msg.innerHTML = requiredGap > 0 ? `Mandatory gap of ${requiredGap} days is completed.<br><strong>Govinda!</strong>` : `No Gap Required.<br><strong>Govinda!</strong>`;
    } else {
        content.classList.add('status-wait'); 
        icon.innerHTML = '⏳'; 
        title.innerHTML = 'Please Wait'; 
        title.style.color = '#e74c3c';
        
        const ed = new Date(lastDate); 
        ed.setDate(lastDate.getDate() + safeGap);
        const dateString = ed.toLocaleDateString('en-IN', {day:'numeric',month:'long',year:'numeric'});

        // Strict check for future date (Auto Mode)
        if (lastDate > today) {
            msg.innerHTML = `Based on your planned visit.<br>Gap Required: ${requiredGap} Days<br>Next eligible date: <br><span style="color:#FFD700;font-size:1.2rem;font-weight:bold;display:block;margin-top:5px;">${dateString}</span>`;
        } else {
            msg.innerHTML = `You need to wait <strong>${daysRemaining} more days</strong>.<br>Gap Required: ${requiredGap} Days<br>Next eligible date: <br><span style="color:#FFD700;font-size:1.2rem;font-weight:bold;display:block;margin-top:5px;">${dateString}</span>`;
        }
    }
    modal.classList.add('active');
}

function showModalComparison(isSuccess, actualGap, requiredGap, eligibleDate, daysShort) {
    const modal = document.getElementById('resultModal');
    const content = document.getElementById('modalContent');
    const icon = document.getElementById('modalIcon'); 
    const title = document.getElementById('modalTitle'); 
    const msg = document.getElementById('modalMsg');
    
    content.classList.remove('status-success', 'status-wait');
    
    // Removed "Next eligible" line from Failure Message as requested
    if (isSuccess) {
        content.classList.add('status-success'); 
        icon.innerHTML = '✅'; 
        title.innerHTML = 'Dates are Compatible'; 
        title.style.color = '#2ecc71';
        msg.innerHTML = `Gap Found: <strong>${actualGap} Days</strong><br>Gap Required: ${requiredGap} Days<br><strong>Govinda!</strong>`;
    } else {
        content.classList.add('status-wait'); 
        icon.innerHTML = '⏳'; 
        title.innerHTML = 'Gap Insufficient'; 
        title.style.color = '#e74c3c';
        msg.innerHTML = `Gap Found: <strong>${actualGap} Days</strong><br>You need to wait <strong>${daysShort} more days</strong>.<br>Gap Required: ${requiredGap} Days`;
    }
    modal.classList.add('active');
}

function closeModal() { document.getElementById('resultModal').classList.remove('active'); }

/* --- AUDIO CONTROL LOGIC --- */
const bgMusic = document.getElementById('bgMusic');
const audioControlBtn = document.querySelector('.audio-control');
let isPlaying = false; // Start False

// On load, default to Muted/Paused
window.addEventListener('load', () => {
    bgMusic.pause();
    isPlaying = false;
    audioControlBtn.classList.remove('playing'); // Ensure it is Grey
});

function toggleAudio() {
    if (isPlaying) {
        bgMusic.pause();
        audioControlBtn.classList.remove('playing'); // Turn Grey
        isPlaying = false;
    } else {
        bgMusic.play();
        audioControlBtn.classList.add('playing'); // Turn Gold
        isPlaying = true;
    }
}


/* --- CALCULATOR LOGIC --- */
function calculateGap() {
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

    // --- RULES ENGINE ---
    let requiredGap = 0; 
    let isStrictNextDay = false; // Special flag for the "Next Day" exception

    // 1. 180 DAYS GAP RULES
    if (
        (prevType === 'lucky_online' && nextType === 'lucky_online') ||
        (prevType === 'lucky_offline' && nextType === 'lucky_offline') ||
        (prevType === 'arjitha' && nextType === 'arjitha')
    ) {
        requiredGap = 180;
    }

    // 2. 90 DAYS GAP RULES
    // SSD Local -> Any SSD/Local/Footpath = 90
    else if (
        prevType === 'ssd_local' && 
        (nextType === 'ssd_local' || nextType === 'ssd_free' || nextType === 'footpath')
    ) {
        requiredGap = 90;
    }
    // Senior Citizen -> Senior Citizen (90 days)
    else if (prevType === 'senior' && nextType === 'senior') {
        requiredGap = 90;
    }
    // Voluntary -> Voluntary
    else if (prevType === 'voluntary' && nextType === 'voluntary') {
        requiredGap = 90;
    }
    // Anga -> Anga
    else if (prevType === 'anga' && nextType === 'anga') {
        requiredGap = 90;
    }

    // 3. 1 DAY GAP RULE (Specific Exception)
    else if (prevType === 'voluntary' && nextType === 'lucky_offline') {
        requiredGap = 1;
        isStrictNextDay = true; // Mark this so we don't add the extra +1 safe day
    }

    // 4. 30 DAYS GAP RULES
    
    // SSD General/Footpath -> SSD Local (Vice Versa of the 90 day rule)
    else if (
        (prevType === 'ssd_free' || prevType === 'footpath') && 
        nextType === 'ssd_local'
    ) {
        requiredGap = 30;
    }

    // General Free SSD / DD (Footpath) Interactions (General -> General)
    else if (
        (prevType === 'ssd_free' || prevType === 'footpath') &&
        (nextType === 'ssd_free' || nextType === 'footpath')
    ) {
        requiredGap = 30;
    }
    
    // Local Temple Seva - Local Temple Seva
    else if (prevType === 'local_seva' && nextType === 'local_seva') {
        requiredGap = 30;
    }
    // Same Category Restrictions
    else if (
        (prevType === 'sed' && nextType === 'sed') ||
        (prevType === 'virtual' && nextType === 'virtual') ||
        (prevType === 'homam' && nextType === 'homam') ||
        (prevType === 'infant' && nextType === 'infant')
    ) {
        requiredGap = 30;
    }
    // Accommodation: Tirumala Group (Online/Offline mixed)
    else if (
        (prevType === 'room_tiru_online' || prevType === 'room_tiru_offline') &&
        (nextType === 'room_tiru_online' || nextType === 'room_tiru_offline')
    ) {
        requiredGap = 30;
    }
    // Accommodation: Tirupati Group (Online/Offline mixed)
    else if (
        (prevType === 'room_tpt_online' || prevType === 'room_tpt_offline') &&
        (nextType === 'room_tpt_online' || nextType === 'room_tpt_offline')
    ) {
        requiredGap = 30;
    }

    // 5. NO GAP (Implicitly 0 for everything else)
    
    // --- SAFE DATE LOGIC ---
    let safeGap = requiredGap;
    let daysRemaining = 0;

    if (requiredGap === 0) {
        // FIX: If No Gap is required, Always Success (even for future dates)
        daysRemaining = 0;
        safeGap = 0;
    } else {
        // Calculate Safe Gap if requiredGap > 0
        if (isStrictNextDay) {
            // For Voluntary -> Lucky Offline, keep it exactly 1 day (next day)
            safeGap = requiredGap; 
        } else {
            // For everything else, add 1 extra day for safety
            safeGap = requiredGap + 1; 
        }
        daysRemaining = safeGap - daysPassed;
    }

    showModal(daysRemaining, requiredGap, safeGap, lastDate);
}

function showModal(daysRemaining, requiredGap, safeGap, lastDate) {
    const modal = document.getElementById('resultModal');
    const content = document.getElementById('modalContent');
    const icon = document.getElementById('modalIcon');
    const title = document.getElementById('modalTitle');
    const msg = document.getElementById('modalMsg');

    // Clear previous classes
    content.classList.remove('status-success', 'status-wait');

    if (daysRemaining <= 0) {
        // SUCCESS
        content.classList.add('status-success');
        icon.innerHTML = '✅';
        title.innerHTML = 'You are Eligible!';
        title.style.color = '#2ecc71'; // Greenish Gold
        
        if (requiredGap > 0) {
            msg.innerHTML = `Mandatory gap of ${requiredGap} days is completed.<br>You can proceed with booking.<br><strong>Govinda!</strong>`;
        } else {
                msg.innerHTML = `No Gap Required for this combination.<br>You can proceed with booking.<br><strong>Govinda!</strong>`;
        }
        
    } else {
        // WAIT
        content.classList.add('status-wait');
        icon.innerHTML = '⏳';
        title.innerHTML = 'Please Wait';
        title.style.color = '#e74c3c'; // Soft Red
        
        const eligibleDate = new Date(lastDate);
        eligibleDate.setDate(lastDate.getDate() + safeGap); // Use calculated safeGap
        const dateString = eligibleDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
        
        if (daysRemaining > requiredGap) {
                // Future date selected (Planning Mode)
                msg.innerHTML = `Based on your planned visit.<br>Gap Required: ${requiredGap} Days<br>Next eligible date: <br><span style="color:#FFD700; font-size:1.2rem; font-weight:bold; display:block; margin-top:5px;">${dateString}</span>`;
        } else {
                // Past date selected (Waiting Mode)
                msg.innerHTML = `You need to wait <strong>${daysRemaining} more days</strong>.<br>Gap Required: ${requiredGap} Days<br>Next eligible date: <br><span style="color:#FFD700; font-size:1.2rem; font-weight:bold; display:block; margin-top:5px;">${dateString}</span>`;
        }
    }

    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('resultModal').classList.remove('active');
}

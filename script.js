/* --- AUDIO CONTROL LOGIC --- */
const bgMusic = document.getElementById('bgMusic');
const speakerIcon = document.getElementById('speakerIcon');
let isPlaying = false; // Start False

// On load, default to Muted/Paused
window.addEventListener('load', () => {
    bgMusic.pause();
    isPlaying = false;
    speakerIcon.innerHTML = '🔇';
});

function toggleAudio() {
    if (isPlaying) {
        bgMusic.pause();
        speakerIcon.innerHTML = '🔇';
        isPlaying = false;
    } else {
        bgMusic.play();
        speakerIcon.innerHTML = '🎵';
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

    // 1. 180 DAYS GAP RULES
    if (
        (prevType === 'lucky_online' && nextType === 'lucky_online') ||
        (prevType === 'lucky_offline' && nextType === 'lucky_offline') ||
        (prevType === 'arjitha' && nextType === 'arjitha')
    ) {
        requiredGap = 180;
    }

    // 2. 90 DAYS GAP RULES
    // Locals interactions with Locals, Free SSD, or Footpath (DD)
    else if (
        (prevType === 'ssd_local' && (nextType === 'ssd_local' || nextType === 'ssd_free' || nextType === 'footpath')) ||
        ((prevType === 'ssd_free' || prevType === 'footpath') && nextType === 'ssd_local')
    ) {
        requiredGap = 90;
    }
    // Other 90 day rules
    else if (prevType === 'voluntary' && nextType === 'voluntary') {
        requiredGap = 90;
    }
    else if (prevType === 'anga' && nextType === 'anga') {
        requiredGap = 90;
    }

    // 3. 1 DAY GAP RULE
    else if (prevType === 'voluntary' && nextType === 'lucky_offline') {
        requiredGap = 1;
    }

    // 4. 30 DAYS GAP RULES
    
    // NEW RULES
    // Senior Citizen - Senior Citizen
    else if (prevType === 'senior' && nextType === 'senior') {
        requiredGap = 90;
    }
    // Local Temple Seva - Local Temple Seva
    else if (prevType === 'local_seva' && nextType === 'local_seva') {
        requiredGap = 30;
    }

    // General Free SSD / DD (Footpath) Interactions
    else if (
        (prevType === 'ssd_free' || prevType === 'footpath') &&
        (nextType === 'ssd_free' || nextType === 'footpath')
    ) {
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
    
    const daysRemaining = requiredGap - daysPassed;
    showModal(daysRemaining, requiredGap, lastDate);
}

function showModal(daysRemaining, requiredGap, lastDate) {
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
        eligibleDate.setDate(lastDate.getDate() + requiredGap);
        const dateString = eligibleDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
        
        if (daysRemaining > requiredGap) {
                // Future date selected
                msg.innerHTML = `Based on your planned visit.<br>Gap Required: ${requiredGap} Days<br>Next eligible date: <br><span style="color:#FFD700; font-size:1.2rem; font-weight:bold; display:block; margin-top:5px;">${dateString}</span>`;
        } else {
                msg.innerHTML = `You need to wait <strong>${daysRemaining} more days</strong>.<br>Gap Required: ${requiredGap} Days<br>Next eligible date: <br><span style="color:#FFD700; font-size:1.2rem; font-weight:bold; display:block; margin-top:5px;">${dateString}</span>`;
        }
    }

    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('resultModal').classList.remove('active');
}

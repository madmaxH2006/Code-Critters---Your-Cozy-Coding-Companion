document.addEventListener('DOMContentLoaded', () => {
    // --- Get references to ALL HTML elements ---
    const trickFeed = document.getElementById('trick-feed');
    const questBoard = document.getElementById('quest-board');
    const flowerBed = document.getElementById('flower-bed');
    const rewardOverlay = document.getElementById('reward-overlay');
    const rewardCat = document.getElementById('reward-cat');
    const confettiContainer = document.getElementById('confetti-container');
    const userLevelDisplay = document.getElementById('user-level');
    const xpBarFill = document.getElementById('xp-bar-fill');
    const sparklePointsDisplay = document.getElementById('sparkle-points');
    const userListContainer = document.getElementById('user-list');
    const pairingModal = document.getElementById('pairing-modal');
    const pairingText = document.getElementById('pairing-text');
    const partnerAvatarImg = document.querySelector('.partner-avatar');
    
    // --- NEW: References for the "Living Player Card" ---
    const gardenSection = document.getElementById('user-garden');
    const userAvatar = document.getElementById('user-avatar');
    const xpSparkle = document.getElementById('xp-sparkle');

    // --- DATA ---
    const currentUser = { name: "CoderJane", avatar: "https://i.pravatar.cc/100?u=user123", level: 1, xp: 20, sparklePoints: 50, flowers: ["/public/images/flower-bloom.png"] };
    const XP_PER_LEVEL = 100;
    const quests = [ { id: 1, title: "Story: Fix the path with a CSS `gap`!", xp: 30, points: 5 }, { id: 2, title: "JS Challenge: `console.log` your pet's name!", xp: 40, points: 10 }];
    const fakeOnlineUsers = [ { name: "PixelPal", avatar: "https://i.pravatar.cc/100?u=pal" }, { name: "CodeNinja", avatar: "https://i.pravatar.cc/100?u=ninja" }, { name: "ScriptKitty", avatar: "https://i.pravatar.cc/100?u=kitty" }];
    let isPaired = false;

    // --- RENDER FUNCTIONS ---
    function renderGarden() { updateProfileUI(); flowerBed.innerHTML = ''; currentUser.flowers.forEach(src => flowerBed.innerHTML += `<img src="${src}" alt="A pixel flower" class="flower">`); }
    function updateProfileUI() { userLevelDisplay.textContent = `Lvl. ${currentUser.level}`; sparklePointsDisplay.textContent = `✨ ${currentUser.sparklePoints}`; const xpPercentage = (currentUser.xp / XP_PER_LEVEL) * 100; xpBarFill.style.width = `${xpPercentage}%`; }
    function renderQuests(partnerName = null) { questBoard.innerHTML = ''; quests.forEach(quest => { const partnerInfo = partnerName ? `<div class="partnered-quest-info">🤝 vs. ${partnerName}</div>` : ''; questBoard.innerHTML += `<div class="card"><p>${quest.title}</p>${partnerInfo}<button class="quest-button" data-quest-id="${quest.id}" data-xp="${quest.xp}" data-points="${quest.points}">Complete!</button></div>`; }); }
    function renderPartnerList() { userListContainer.innerHTML = ''; fakeOnlineUsers.forEach(user => { userListContainer.innerHTML += `<div class="user-entry" data-partner-name="${user.name}" data-partner-avatar="${user.avatar}"><img src="${user.avatar}" alt="${user.name}"><span class="user-name">${user.name}</span><button class="invite-button">Invite</button></div>`; }); }
    function renderTricks(tricksArray) { trickFeed.innerHTML = ''; tricksArray.forEach(trick => { trickFeed.innerHTML += `<div class="card"><div class="card-header"><img src="${trick.avatar}" alt="${trick.user}" class="card-avatar"><strong>${trick.user}</strong></div><div class="card-content"><p>${trick.trick}</p><pre><code>${trick.code.replace(/</g, "<").replace(/>/g, ">")}</code></pre></div><div class="card-footer"><button class="like-button">❤️</button><span>${trick.likes} Likes</span></div></div>`; }); addCardTiltEffect(); }
    
    // --- ANIMATION & FEEDBACK FUNCTIONS ---
    const CUTE_COLORS = ['#f4a261', '#e76f51', '#2a9d8f', '#e9c46a', '#d4a373'];
    function createConfetti() { for (let i = 0; i < 100; i++) { const c = document.createElement('div'); c.classList.add('confetti'); c.style.backgroundColor = CUTE_COLORS[Math.floor(Math.random() * CUTE_COLORS.length)]; const x = (Math.random() - 0.5) * window.innerWidth * 1.5; const y = (Math.random() - 0.5) * window.innerHeight * 1.5; c.style.setProperty('--x-end', `${x}px`); c.style.setProperty('--y-end', `${y}px`); confettiContainer.appendChild(c); } }
    function showRewardAnimation() { rewardOverlay.classList.remove('hidden'); createConfetti(); setTimeout(() => rewardCat.classList.add('grow'), 100); setTimeout(() => { rewardOverlay.classList.add('hidden'); rewardCat.classList.remove('grow'); confettiContainer.innerHTML = ''; }, 4000); }
    function showFeedbackPopup(text, element) { const p = document.createElement('div'); p.textContent = text; p.classList.add('feedback-popup'); element.style.position = 'relative'; element.appendChild(p); setTimeout(() => p.remove(), 1500); }
    
    // --- NEW: "Pop" animation for stats ---
    function triggerPopAnimation(element) {
        element.classList.add('is-popping');
        element.addEventListener('animationend', () => {
            element.classList.remove('is-popping');
        }, { once: true });
    }

    // --- EVENT LISTENERS ---
    
    // --- HEAVILY UPGRADED QUEST LISTENER ---
    questBoard.addEventListener('click', (e) => {
        const button = e.target;
        if (button.classList.contains('quest-button') && !button.disabled) {
            const xpGained = parseInt(button.dataset.xp, 10);
            const pointsGained = parseInt(button.dataset.points, 10);
            const oldXp = currentUser.xp;

            showRewardAnimation();
            showFeedbackPopup(`+${xpGained} XP`, button);
            
            // Animate Sparkle Points
            setTimeout(() => {
                showFeedbackPopup(`+${pointsGained} ✨`, button);
                currentUser.sparklePoints += pointsGained;
                sparklePointsDisplay.textContent = `✨ ${currentUser.sparklePoints}`;
                triggerPopAnimation(sparklePointsDisplay);
            }, 300);

            // Animate XP Bar with Sparkle
            const oldXpPercentage = (oldXp / XP_PER_LEVEL) * 100;
            xpSparkle.style.left = `${oldXpPercentage}%`;
            xpSparkle.style.opacity = '1';

            currentUser.xp += xpGained;

            // Handle Level Up
            if (currentUser.xp >= XP_PER_LEVEL) {
                currentUser.level++;
                currentUser.xp -= XP_PER_LEVEL;
                showFeedbackPopup(`LEVEL UP!`, document.getElementById('user-level'));
                triggerPopAnimation(userLevelDisplay);
            }

            const newXpPercentage = (currentUser.xp / XP_PER_LEVEL) * 100;
            setTimeout(() => {
                xpBarFill.style.width = `${newXpPercentage}%`;
                xpSparkle.style.left = `${newXpPercentage}%`;
            }, 50);

            setTimeout(() => { xpSparkle.style.opacity = '0'; }, 600);
            
            currentUser.flowers.push('/public/images/flower-bloom.png');
            renderGarden(); // This is called here but UI updates are handled above for animation
            button.disabled = true; button.textContent = 'Done!';
        }
    });
    
    trickFeed.addEventListener('click', (e) => { if(e.target.classList.contains('like-button')) e.target.classList.toggle('liked'); });
    userListContainer.addEventListener('click', (e) => { /* ... (pairing logic is unchanged) ... */ if (e.target.classList.contains('invite-button') && !isPaired) { const userEntry = e.target.closest('.user-entry'); const partnerName = userEntry.dataset.partnerName; const partnerAvatar = userEntry.dataset.partnerAvatar; isPaired = true; pairingText.textContent = `Summoning a partner...`; partnerAvatarImg.src = partnerAvatar; pairingModal.classList.remove('hidden'); setTimeout(() => { pairingModal.classList.add('is-pairing'); }, 100); document.querySelectorAll('.invite-button').forEach(btn => btn.disabled = true); setTimeout(() => { pairingText.textContent = `Paired with ${partnerName}!`; }, 1800); setTimeout(() => { pairingModal.classList.add('hidden'); pairingModal.classList.remove('is-pairing'); renderQuests(partnerName); }, 4000); } });

    // --- Page transition logic & 3D Card Tilt ---
    document.querySelectorAll('.main-nav a, a.post-button').forEach(link => { link.addEventListener('click', function(e) { const dest = this.href; if (!dest || dest === window.location.href) return; e.preventDefault(); document.body.classList.add('fade-out'); setTimeout(() => { window.location = dest; }, 500); }); });
    function addCardTiltEffect() { const cards = document.querySelectorAll('#trick-feed .card'); cards.forEach(card => { card.addEventListener('mousemove', (e) => { const rect = card.getBoundingClientRect(); const x = e.clientX - rect.left; const y = e.clientY - rect.top; const { width, height } = rect; const rotateX = (y / height - 0.5) * -20; const rotateY = (x / width - 0.5) * 20; card.style.transition = 'none'; card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`; }); card.addEventListener('mouseleave', () => { card.style.transition = 'transform 0.5s ease'; card.style.transform = 'rotateX(0) rotateY(0)'; }); }); }

    // --- NEW: 3D Avatar Tilt Logic ---
    function addAvatarTiltEffect() {
        if (!gardenSection || !userAvatar) return;
        gardenSection.addEventListener('mousemove', (e) => {
            const rect = gardenSection.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const { width, height } = rect;
            const rotateX = (y / height - 0.5) * -30; // More dramatic tilt
            const rotateY = (x / width - 0.5) * 30;
            userAvatar.style.transition = 'none';
            userAvatar.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.1)`; // Scale up on hover
        });
        gardenSection.addEventListener('mouseleave', () => {
            userAvatar.style.transition = 'transform 0.5s ease';
            userAvatar.style.transform = 'rotateX(0) rotateY(0) scale(1)'; // Return to normal
        });
    }

    // --- INITIAL PAGE LOAD ---
    function loadInitialData() { fetch('http://localhost:3000/api/tricks').then(res => { if(!res.ok) throw new Error("Server connection failed"); return res.json()}).then(data => renderTricks(data)).catch(err => { console.error("Could not fetch tricks:", err); trickFeed.innerHTML = "<p>Oh no! Could not connect to the server to get coding tricks. Is the backend running?</p>"; }); }

    renderGarden();
    renderQuests();
    renderPartnerList();
    loadInitialData();
    addAvatarTiltEffect(); // Activate the new avatar animation!
});
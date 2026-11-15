const appData = {
    hotels: [
        { id: 1, name: "NV Grand Palace", city: "Indore", price: "₹2,500/night", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945", likes: 12, comments: ["Great stay!", "Clean rooms"] },
        { id: 2, name: "Royal View Hotel", city: "Bhopal", price: "₹3,000/night", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b", likes: 8, comments: ["Awesome hospitality."] },
        { id: 3, name: "Sunset Resort", city: "Udaipur", price: "₹4,500/night", image: "https://images.unsplash.com/photo-1590490360182-c33d57733427", likes: 25, comments: ["Loved the lake view!"] }
    ],
    packages: [
        { id: 1, name: "Goa Beach Retreat", city: "Goa", price: "₹12,000 / 3 Days", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2", likes: 40, comments: ["Best package ever."] },
        { id: 2, name: "Manali Snow Adventure", city: "Manali", price: "₹15,000 / 4 Days", image: "https://images.unsplash.com/photo-1605648916361-9bc12ad6a566", likes: 31, comments: ["Incredible experience!"] }
    ],
    tickets: [
        { id: 1, name: "Express Bus (Indore to Bhopal)", city: "Indore", timing: "08:00 AM - 12:30 PM", price: "₹600", image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957", likes: 15, comments: ["Reached on time."] },
        { id: 2, name: "Luxury Sleeper (Bhopal to Mumbai)", city: "Bhopal", timing: "09:30 PM - 07:00 AM", price: "₹1,400", image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e", likes: 22, comments: ["Very comfortable bus."] }
    ]
};

let currentSelectedItem = null;

document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    document.getElementById('login-page').classList.remove('active-page');
    document.getElementById('home-page').classList.add('active-page');
    
    initAppFilters();
    renderHotels(appData.hotels);
    renderPackages(appData.packages);
    renderTickets(appData.tickets);
});

function switchTab(tabName) {
    document.getElementById('home-page').style.display = 'none';
    document.querySelectorAll('.app-section').forEach(sec => sec.classList.remove('active-section'));

    if(tabName === 'home') {
        document.getElementById('home-page').style.display = 'block';
    } else if(tabName === 'hotels') {
        document.getElementById('hotels-section').classList.add('active-section');
    } else if(tabName === 'packages') {
        document.getElementById('packages-section').classList.add('active-section');
    } else if(tabName === 'tickets') {
        document.getElementById('tickets-section').classList.add('active-section');
    }
}

function initAppFilters() {
    const allCities = [...new Set([
        ...appData.hotels.map(h => h.city),
        ...appData.packages.map(p => p.city),
        ...appData.tickets.map(t => t.city)
    ])];

    ['hotel-city-filter', 'package-city-filter', 'ticket-city-filter'].forEach(filterId => {
        const select = document.getElementById(filterId);
        allCities.forEach(city => {
            const opt = document.createElement('option');
            opt.value = city;
            opt.textContent = city;
            select.appendChild(opt);
        });
    });
}

function renderHotels(hotels) {
    const container = document.getElementById('hotels-container');
    container.innerHTML = hotels.map(h => `
        <div class="card">
            <img src="${h.image}" class="card-img" alt="${h.name}">
            <div class="card-body">
                <div class="card-title">${h.name}</div>
                <div class="card-info"><i class="fas fa-map-marker-alt"></i> City: ${h.city}</div>
                <div class="card-info">Price: ${h.price}</div>
                <div class="social-actions">
                    <button class="social-btn" onclick="handleLike('hotel', ${h.id})"><i class="far fa-thumbs-up"></i> Like (${h.likes})</button>
                    <button class="social-btn" onclick="toggleCommentBox('hotel-${h.id}')"><i class="far fa-comment"></i> Comment (${h.comments.length})</button>
                    <button class="social-btn" onclick="shareItem('${h.name}')"><i class="fas fa-share"></i> Share</button>
                </div>
                <div id="comment-box-hotel-${h.id}" class="comment-section" style="display:none;">
                    <div class="comment-list">${h.comments.map(c => `<p style="margin:2px 0; background:#f1f1f1; padding:3px 6px; border-radius:3px;">${c}</p>`).join('')}</div>
                    <div class="comment-input-box">
                        <input type="text" id="input-hotel-${h.id}" placeholder="Write comment...">
                        <button onclick="addComment('hotel', ${h.id})">Post</button>
                    </div>
                </div>
            </div>
            <div class="card-footer">
                <button class="btn-primary" onclick="openBookingModal('Hotel', '${h.name}')">Book Now</button>
            </div>
        </div>
    `).join('');
}

function renderPackages(packages) {
    const container = document.getElementById('packages-container');
    container.innerHTML = packages.map(p => `
        <div class="card">
            <img src="${p.image}" class="card-img" alt="${p.name}">
            <div class="card-body">
                <div class="card-title">${p.name}</div>
                <div class="card-info"><i class="fas fa-map-marker-alt"></i> Destination: ${p.city}</div>
                <div class="card-info">Cost: ${p.price}</div>
                <div class="social-actions">
                    <button class="social-btn" onclick="handleLike('package', ${p.id})"><i class="far fa-thumbs-up"></i> Like (${p.likes})</button>
                    <button class="social-btn" onclick="toggleCommentBox('package-${p.id}')"><i class="far fa-comment"></i> Comment (${p.comments.length})</button>
                    <button class="social-btn" onclick="shareItem('${p.name}')"><i class="fas fa-share"></i> Share</button>
                </div>
                <div id="comment-box-package-${p.id}" class="comment-section" style="display:none;">
                    <div class="comment-list">${p.comments.map(c => `<p style="margin:2px 0; background:#f1f1f1; padding:3px 6px; border-radius:3px;">${c}</p>`).join('')}</div>
                    <div class="comment-input-box">
                        <input type="text" id="input-package-${p.id}" placeholder="Write comment...">
                        <button onclick="addComment('package', ${p.id})">Post</button>
                    </div>
                </div>
            </div>
            <div class="card-footer">
                <button class="btn-primary" onclick="openBookingModal('Package', '${p.name}')">Book Now</button>
            </div>
        </div>
    `).join('');
}

function renderTickets(tickets) {
    const container = document.getElementById('tickets-container');
    container.innerHTML = tickets.map(t => `
        <div class="card">
            <img src="${t.image}" class="card-img" alt="${t.name}">
            <div class="card-body">
                <div class="card-title">${t.name}</div>
                <div class="card-info"><i class="fas fa-map-marker-alt"></i> Route Hub: ${t.city}</div>
                <div class="timing-badge"><i class="far fa-clock"></i> Timing: ${t.timing}</div>
                <div class="card-info">Fare: ${t.price}</div>
                <div class="social-actions">
                    <button class="social-btn" onclick="handleLike('ticket', ${t.id})"><i class="far fa-thumbs-up"></i> Like (${t.likes})</button>
                    <button class="social-btn" onclick="toggleCommentBox('ticket-${t.id}')"><i class="far fa-comment"></i> Comment (${t.comments.length})</button>
                    <button class="social-btn" onclick="shareItem('${t.name}')"><i class="fas fa-share"></i> Share</button>
                </div>
                <div id="comment-box-ticket-${t.id}" class="comment-section" style="display:none;">
                    <div class="comment-list">${t.comments.map(c => `<p style="margin:2px 0; background:#f1f1f1; padding:3px 6px; border-radius:3px;">${c}</p>`).join('')}</div>
                    <div class="comment-input-box">
                        <input type="text" id="input-ticket-${t.id}" placeholder="Write comment...">
                        <button onclick="addComment('ticket', ${t.id})">Post</button>
                    </div>
                </div>
            </div>
            <div class="card-footer">
                <button class="btn-primary" onclick="openBookingModal('Ticket', '${t.name}')">Book Now</button>
            </div>
        </div>
    `).join('');
}

function filterHotels() {
    const city = document.getElementById('hotel-city-filter').value;
    const filtered = city === 'all' ? appData.hotels : appData.hotels.filter(h => h.city === city);
    renderHotels(filtered);
}

function filterPackages() {
    const city = document.getElementById('package-city-filter').value;
    const filtered = city === 'all' ? appData.packages : appData.packages.filter(p => p.city === city);
    renderPackages(filtered);
}

function filterTickets() {
    const city = document.getElementById('ticket-city-filter').value;
    const filtered = city === 'all' ? appData.tickets : appData.tickets.filter(t => t.city === city);
    renderTickets(filtered);
}

function handleLike(type, id) {
    const list = appData[type + 's'];
    const item = list.find(x => x.id === id);
    if(item) {
        item.likes += 1;
        if(type === 'hotel') renderHotels(appData.hotels);
        if(type === 'package') renderPackages(appData.packages);
        if(type === 'ticket') renderTickets(appData.tickets);
    }
}

function toggleCommentBox(boxId) {
    const box = document.getElementById('comment-box-' + boxId);
    box.style.display = box.style.display === 'none' ? 'block' : 'none';
}

function addComment(type, id) {
    const input = document.getElementById(`input-${type}-${id}`);
    const text = input.value.trim();
    if(text) {
        const list = appData[type + 's'];
        const item = list.find(x => x.id === id);
        if(item) {
            item.comments.push(text);
            input.value = '';
            if(type === 'hotel') renderHotels(appData.hotels);
            if(type === 'package') renderPackages(appData.packages);
            if(type === 'ticket') renderTickets(appData.tickets);
            document.getElementById(`comment-box-${type}-${id}`).style.display = 'block';
        }
    }
}

function shareItem(name) {
    if (navigator.share) {
        navigator.share({ title: 'NV TRAVELSS', text: `Check out this amazing option: ${name}`, url: window.location.href });
    } else {
        alert(`Link copied for: ${name}`);
    }
}

function openBookingModal(type, name) {
    currentSelectedItem = { type, name };
    document.getElementById('modal-title').textContent = `Book ${type}: ${name}`;
    document.getElementById('booking-modal').style.display = 'block';
}

function closeBookingModal() {
    document.getElementById('booking-modal').style.display = 'none';
}

function submitBooking(e) {
    e.preventDefault();
    const name = document.getElementById('booker-name').value;
    alert(`Success! Your ${currentSelectedItem.type} booking for "${currentSelectedItem.name}" is confirmed, ${name}.`);
    closeBookingModal();
    document.getElementById('booking-form').reset();
}

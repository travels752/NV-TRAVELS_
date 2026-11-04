/* NV TRAVELSS - ALL OPTIONS */

function openPage(title, content) {
  document.getElementById("pageTitle").textContent = title;
  document.getElementById("pageContent").innerHTML = content;
  document.getElementById("page").style.display = "block";
  document.getElementById("page").scrollTop = 0;
}

function closePage() {
  document.getElementById("page").style.display = "none";
}

function goHome() {
  closePage();
}

function field(label, placeholder, type = "text") {
  return `
    <div class="field">
      <label>${label}</label>
      <input type="${type}" placeholder="${placeholder}">
    </div>`;
}

function choose(service) {

  if (service === "Ride") {
    openPage("Book Your Ride", `
      <div class="info">🚕 Book a ride with NV TRAVELSS</div>
      ${field("Pickup Location", "Enter pickup location")}
      ${field("Destination", "Enter destination")}
      <div class="field">
        <label>Select Vehicle</label>
        <select id="vehicle">
          <option>Bike - ₹10/km</option>
          <option>Auto - ₹15/km</option>
          <option>Hatchback - ₹16/km</option>
          <option>Sedan - ₹18/km</option>
          <option>SUV - ₹22/km</option>
          <option>MUV - ₹24/km</option>
          <option>Premium - ₹30/km</option>
          <option>6-7 Seater - ₹25/km</option>
          <option>8-12 Seater - ₹30/km</option>
          <option>Tempo Traveller - ₹35/km</option>
          <option>Mini Bus - ₹45/km</option>
          <option>Bus - ₹60/km</option>
        </select>
      </div>
      <button class="primary" onclick="bookingMessage('Ride')">Find Drivers</button>
    `);
  }

  else if (service === "Hotel") {
    openPage("Hotel Booking", `
      ${field("City / Destination", "Where do you need a hotel?")}
      ${field("Check-in Date", "", "date")}
      ${field("Check-out Date", "", "date")}
      ${field("Guests", "Number of guests", "number")}
      <button class="primary" onclick="bookingMessage('Hotel')">Search Hotels</button>
    `);
  }

  else if (service === "Packages") {
    openPage("Travel Packages", `
      ${field("Destination", "Enter destination")}
      ${field("Number of Days", "Example: 3 days", "number")}
      ${field("Number of Travelers", "Travelers", "number")}
      <button class="primary" onclick="bookingMessage('Package')">Explore Packages</button>
    `);
  }

  else if (service === "Tickets") {
    openPage("Book Tickets", `
      <div class="services">
        <div class="service" onclick="choose('Bus Tickets')">
          <i class="fa-solid fa-bus"></i><b>Bus Tickets</b>
        </div>
        <div class="service" onclick="choose('Train Tickets')">
          <i class="fa-solid fa-train"></i><b>Train Tickets</b>
        </div>
        <div class="service" onclick="choose('Flight Tickets')">
          <i class="fa-solid fa-plane"></i><b>Flight Tickets</b>
        </div>
      </div>
    `);
  }

  else if (service === "Bus Tickets" ||
           service === "Train Tickets" ||
           service === "Flight Tickets") {
    openPage(service, `
      ${field("From", "Departure city")}
      ${field("To", "Arrival city")}
      ${field("Journey Date", "", "date")}
      ${field("Passengers", "Number of passengers", "number")}
      <button class="primary" onclick="bookingMessage('Ticket')">Continue</button>
      <div class="info">Ticket booking provider connection is required for actual ticket reservations.</div>
    `);
  }

  else if (service === "Reels") {
    openPage("NV Travelss Reels", `
      <div class="info">🎬 Discover travel videos and experiences.</div>
      <div class="info">❤️ Like &nbsp; 💬 Comment &nbsp; ↗ Share &nbsp; 🔖 Save</div>
      <button class="primary" onclick="choose('Post')">Create Post</button>
      <p style="margin-top:15px;font-size:13px;color:#718096">
        Reels will appear here after video upload and storage are connected.
      </p>
    `);
  }

  else if (service === "Post") {
    openPage("Create Post", `
      <div class="field">
        <label>Write Something</label>
        <textarea rows="5" placeholder="Share your travel experience..."></textarea>
      </div>
      ${field("Select Photo or Video", "", "file")}
      <button class="primary" onclick="bookingMessage('Post')">Share Post</button>
    `);
  }

  else if (service === "Search") {
    openPage("Search", `
      ${field("Search", "Search places, hotels, rides...")}
      <button class="primary" onclick="bookingMessage('Search')">Search</button>
    `);
  }

  else if (service === "Profile") {
    openPage("My Profile", `
      <div class="info">👤 My Account</div>
      <div class="info" onclick="choose('My Rides')">🚕 My Rides</div>
      <div class="info" onclick="choose('My Bookings')">🏨 My Bookings</div>
      <div class="info" onclick="choose('My Posts')">🎬 My Posts</div>
      <div class="info" onclick="choose('Settings')">⚙️ Settings</div>
    `);
  }

  else if (service === "My Rides" ||
           service === "My Bookings" ||
           service === "My Posts" ||
           service === "Settings") {
    openPage(service, `
      <div class="info">Your ${service.toLowerCase()} will appear here after account and database connection.</div>
    `);
  }
}

function bookingMessage(type) {
  alert(type + " form is ready. Actual booking and saving require Supabase connection.");
}


const inputStyle = `
  width:100%;padding:14px;margin:8px 0;
  border:1px solid #dbe2ea;border-radius:12px;
  background:white;color:#172033;box-sizing:border-box;
  font-size:14px;
`;

const buttonStyle = `
  width:100%;padding:14px;margin-top:12px;
  border:0;border-radius:12px;background:#2563eb;
  color:white;font-weight:bold;font-size:15px;
`;

function choose(service) {
  if (service === "Home") {
    closePage();
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  if (service === "Reels" || service.includes("Reel") || service === "Post" || service === "View All Reels") {
    openReels();
    return;
  }

  if (service === "Search") {
    openPage("Search", `
      <input id="searchPlace" placeholder="जगह का नाम लिखें" style="${inputStyle}">
      <button style="${buttonStyle}" onclick="searchPlace()">Search</button>
      <div id="searchResult"></div>
    `);
    return;
  }

  if (["Bus Ticket", "Train Ticket", "Flight Ticket"].includes(service)) {
    openPage(service, ticketForm(service));
    return;
  }

  const pages = {
    "Ride": `
      <h3>Book Your Ride 🚕</h3>
      <input id="pickup" placeholder="Pickup Location" style="${inputStyle}">
      <input id="destination" placeholder="Destination" style="${inputStyle}">
      <select id="vehicle" style="${inputStyle}">
        <option>Bike</option><option>Auto</option>
        <option>Hatchback</option><option>Sedan</option>
        <option>SUV</option><option>MUV</option>
        <option>Premium</option><option>6-7 Seater</option>
        <option>8-12 Seater</option><option>Tempo Traveller</option>
        <option>Mini Bus</option><option>Bus</option>
      </select>
      <button style="${buttonStyle}" onclick="submitRide()">Find Drivers</button>
      <div id="rideResult"></div>
    `,
    "Hotel": `
      <h3>Find Your Hotel 🏨</h3>
      <input id="hotelPlace" placeholder="City / Destination" style="${inputStyle}">
      <input id="hotelDate" type="date" style="${inputStyle}">
      <input id="hotelGuests" type="number" min="1" placeholder="Guests" style="${inputStyle}">
      <button style="${buttonStyle}" onclick="showMessage('Hotel search')">Search Hotels</button>
    `,
    "Packages": `
      <h3>Explore Tour Packages 🌍</h3>
      <input id="packagePlace" placeholder="Destination" style="${inputStyle}">
      <select id="packageDays" style="${inputStyle}">
        <option>1 Day</option><option>2 Days</option>
        <option>3 Days</option><option>5 Days</option>
        <option>7 Days</option><option>10 Days</option>
      </select>
      <button style="${buttonStyle}" onclick="showMessage('Package search')">Find Packages</button>
    `,
    "Tickets": ticketForm("Bus Ticket"),
    "Profile": `
      <h3>My Profile 👤</h3>
      <input id="profileName" placeholder="Your Name" style="${inputStyle}">
      <input id="profilePhone" type="tel" placeholder="Mobile Number" style="${inputStyle}">
      <button style="${buttonStyle}" onclick="saveProfile()">Save Profile</button>
      <h3 style="margin-top:22px">My Bookings</h3>
      <p>Ride History</p><p>Hotel Bookings</p><p>My Posts & Reels</p>
    `,
    "Notifications": `<h3>Notifications 🔔</h3><p>अभी कोई नई Notification नहीं है।</p>`,
    "Mountains": `<h3>Mountain Destinations 🏔️</h3><p>Manali • Kashmir • Shimla</p>`,
    "Beaches": `<h3>Beach Destinations 🏖️</h3><p>Goa • Beaches</p>`,
    "City Tours": `<h3>City Tours 🏙️</h3>`,
    "Adventure": `<h3>Adventure Trips 🧭</h3>`,
    "View All Destinations": `<h3>Popular Destinations</h3><p>Manali • Goa • Kashmir • Shimla</p>`,
    "Manali": `<h3>Manali 🏔️</h3><p>Explore Manali with NV Travelss.</p>`,
    "Goa": `<h3>Goa 🏖️</h3><p>Explore Goa with NV Travelss.</p>`,
    "Kashmir": `<h3>Kashmir ❄️</h3><p>Explore Kashmir with NV Travelss.</p>`,
    "Shimla": `<h3>Shimla 🏔️</h3><p>Explore Shimla with NV Travelss.</p>`
  };

  if (pages[service] !== undefined) {
    openPage(service, pages[service]);
  } else {
    showMessage(service + " का विकल्प तैयार किया जा रहा है।");
  }
}

function ticketForm(type) {
  return `
    <h3>Book ${type} 🎫</h3>
    <input id="ticketFrom" placeholder="From" style="${inputStyle}">
    <input id="ticketTo" placeholder="To" style="${inputStyle}">
    <input id="ticketDate" type="date" style="${inputStyle}">
    <button style="${buttonStyle}" onclick="showMessage('Ticket booking')">Search Tickets</button>
  `;
}

function openPage(title, content) {
  closePage();

  const page = document.createElement("section");
  page.id = "nvExtraPage";
  page.style.cssText = `
    position:fixed;inset:0;z-index:99999;
    background:#f8fafc;overflow-y:auto;
    padding:20px;color:#172033;
    font-family:Arial,sans-serif;
  `;

  page.innerHTML = `
    <button onclick="closePage()" style="
      padding:10px 18px;border:0;border-radius:10px;
      background:#e2e8f0;color:#172033;font-weight:bold;">
      ← Back
    </button>
    <h2 style="font-size:23px;font-weight:bold;margin:22px 0;">${escapeHTML(title)}</h2>
    <div>${content}</div>
  `;

  document.body.appendChild(page);
}

function closePage() {
  const page = document.getElementById("nvExtraPage");
  if (page) page.remove();
}

function showMessage(message) {
  alert(message + " का ऑनलाइन सिस्टम अभी कनेक्ट नहीं है।");
}

function searchPlace() {
  const value = document.getElementById("searchPlace")?.value.trim();
  if (!value) return alert("जगह का नाम लिखें।");

  document.getElementById("searchResult").innerHTML =
    `<p style="margin-top:15px">आपने खोजा: ${escapeHTML(value)}</p>`;
}

function submitRide() {
  const pickup = document.getElementById("pickup")?.value.trim();
  const destination = document.getElementById("destination")?.value.trim();
  const vehicle = document.getElementById("vehicle")?.value;

  if (!pickup || !destination) {
    alert("Pickup और Destination भरें।");
    return;
  }

  document.getElementById("rideResult").innerHTML = `
    <div style="padding:14px;margin-top:15px;background:#dbeafe;border-radius:12px;">
      <b>Ride Request</b>
      <p>Pickup: ${escapeHTML(pickup)}</p>
      <p>Destination: ${escapeHTML(destination)}</p>
      <p>Vehicle: ${escapeHTML(vehicle)}</p>
      <p>अभी ड्राइवर सिस्टम कनेक्ट करना बाकी है।</p>
    </div>
  `;
}

function saveProfile() {
  const name = document.getElementById("profileName")?.value.trim();
  const phone = document.getElementById("profilePhone")?.value.trim();

  if (!name || !phone) return alert("नाम और मोबाइल नंबर भरें।");
  if (!/^[0-9]{10}$/.test(phone)) return alert("10 अंकों का मोबाइल नंबर लिखें।");

  localStorage.setItem("nvUserName", name);
  localStorage.setItem("nvUserPhone", phone);
  alert("प्रोफाइल इस डिवाइस में सेव हो गई।");
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;",
    '"': "&quot;", "'": "&#39;"
  })[char]);
}

/* REELS */

function openReels() {
  closePage();

  let reels = document.getElementById("reelsPage");

  if (!reels) {
    reels = document.createElement("section");
    reels.id = "reelsPage";
    reels.style.cssText = `
      position:fixed;inset:0;z-index:100000;
      background:#101827;color:white;overflow-y:auto;
      padding:16px;font-family:Arial,sans-serif;
    `;

    reels.innerHTML = `
      <button onclick="closeReels()" style="padding:10px 18px;border:0;border-radius:10px;">
        ← Back
      </button>

      <h2 style="font-size:22px;font-weight:bold;margin:20px 0;">
        NV TRAVELSS REELS
      </h2>

      <label style="display:block;padding:15px;background:#26364d;border-radius:12px;">
        + Upload Your Video
        <input type="file" id="reelUpload" accept="video/*"
          onchange="previewReel(event)" style="display:block;margin-top:12px;">
      </label>

      <div id="reelFeed" style="margin-top:20px;"></div>
    `;

    document.body.appendChild(reels);
  }

  reels.style.display = "block";
  window.scrollTo(0, 0);
}

function previewReel(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith("video/")) {
    alert("कृपया वीडियो चुनें।");
    return;
  }

  if (file.size > 100 * 1024 * 1024) {
    alert("वीडियो 100 MB से छोटा चुनें।");
    return;
  }

  const url = URL.createObjectURL(file);
  const feed = document.getElementById("reelFeed");

  const post = document.createElement("div");
  post.style.cssText =
    "margin-bottom:25px;background:#26364d;padding:12px;border-radius:14px;";

  const video = document.createElement("video");
  video.src = url;
  video.controls = true;
  video.playsInline = true;
  video.style.cssText = "width:100%;max-height:500px;border-radius:12px;";

  const like = document.createElement("button");
  like.textContent = "♡ Like 0";
  like.style.cssText = "padding:12px;margin:10px 5px;";

  let likes = 0;
  like.onclick = () => {
    likes++;
    like.textContent = "♥ Like " + likes;
  };

  const share = document.createElement("button");
  share.textContent = "Share";
  share.style.cssText = "padding:12px;margin:10px 5px;";

  share.onclick = async () => {
    try {
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: "NV Travelss Reel",
          files: [file]
        });
      } else {
        alert("इस डिवाइस में वीडियो शेयरिंग उपलब्ध नहीं है।");
      }
    } catch (error) {
      if (error.name !== "AbortError") alert("वीडियो शेयर नहीं हो पाया।");
    }
  };

  const caption = document.createElement("p");
  caption.textContent = file.name;
  caption.style.cssText = "margin:8px 0;color:white;";

  post.append(video, caption, like, share);
  feed.prepend(post);

  event.target.value = "";
}

function closeReels() {
  const reels = document.getElementById("reelsPage");
  if (reels) reels.style.display = "none";
  window.scrollTo(0, 0);
    }

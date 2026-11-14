
/* ==========================================
   NV TRAVELSS - COMPLETE SCRIPT
   CITY + OUTSTATION ECONOMY RATES
   12 VEHICLES + 15% DRIVER COMMISSION
========================================== */

(function () {
  "use strict";

  const STORE = "nv_travelss_booking_requests";
  const COMMISSION_STORE = "nv_driver_commissions";

  const VEHICLES = [
    { name: "Bike", city: 11, economy: 8, image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500" },
    { name: "Auto", city: 15, economy: 11, image: "https://images.unsplash.com/photo-1591768793355-74d04bb6608f?w=500" },
    { name: "Hatchback", city: 16, economy: 12, image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500" },
    { name: "Sedan", city: 19, economy: 14, image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=500" },
    { name: "SUV", city: 24, economy: 18, image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=500" },
    { name: "MUV", city: 26, economy: 20, image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500" },
    { name: "Premium", city: 32, economy: 24, image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500" },
    { name: "6-7 Seater", city: 27, economy: 21, image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500" },
    { name: "8-12 Seater", city: 32, economy: 24, image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=500" },
    { name: "Tempo Traveller", city: 37, economy: 28, image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=500" },
    { name: "Mini Bus", city: 47, economy: 38, image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=500" },
    { name: "Bus", city: 60, economy: 50, image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=500" }
  ];

  const bookingOptions = {
    ride: {
      title: "Book Your Ride",
      fields: [
        ["Pickup Location", "text"],
        ["Destination", "text"],
        ["Travel Type", "select", ["City Ride", "Outstation Economy"]],
        ["Travel Date", "date"],
        ["Travel Time", "time"],
        ["Vehicle", "vehicle"]
      ]
    },
    hotel: {
      title: "Hotel Booking",
      fields: [
        ["City / Location", "text"],
        ["Hotel Name (Optional)", "text"],
        ["Check-in Date", "date"],
        ["Check-out Date", "date"],
        ["Number of Guests", "number"]
      ]
    },
    packages: {
      title: "Tour Packages",
      fields: [
        ["Destination", "text"],
        ["Number of Days", "number"],
        ["Travel Date", "date"],
        ["Number of People", "number"]
      ]
    },
    bus: {
      title: "Bus Ticket Request",
      fields: [
        ["From", "text"],
        ["To", "text"],
        ["Journey Date", "date"],
        ["Passengers", "number"]
      ]
    },
    train: {
      title: "Train Ticket Request",
      fields: [
        ["From", "text"],
        ["To", "text"],
        ["Journey Date", "date"],
        ["Passengers", "number"]
      ]
    },
    flight: {
      title: "Flight Ticket Request",
      fields: [
        ["From", "text"],
        ["To", "text"],
        ["Journey Date", "date"],
        ["Passengers", "number"]
      ]
    }
  };

  let selectedVehicle = "";
  let selectedRateType = "City Ride";

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;",
      '"': "&quot;", "'": "&#39;"
    }[char]));
  }

  function getSavedRequests() {
    try {
      return JSON.parse(localStorage.getItem(STORE) || "[]");
    } catch (error) {
      return [];
    }
  }

  function saveRequest(request) {
    const requests = getSavedRequests();
    requests.push({
      id: "NV-" + Date.now(),
      createdAt: new Date().toISOString(),
      status: "Request Saved",
      ...request
    });
    localStorage.setItem(STORE, JSON.stringify(requests));
  }

  function closePage() {
    document.getElementById("nv-function-page")?.remove();
  }

  function openPage(title, content) {
    closePage();

    const page = document.createElement("div");
    page.id = "nv-function-page";
    page.style.cssText =
      "position:fixed;inset:0;z-index:999999;overflow-y:auto;" +
      "background:#0b132b;padding:16px;font-family:Arial,sans-serif;";

    page.innerHTML = `
      <div style="max-width:460px;min-height:250px;margin:20px auto;
        padding:20px;background:white;border-radius:20px;box-sizing:border-box">
        <div style="display:flex;justify-content:space-between;
          align-items:center;gap:12px;margin-bottom:20px">
          <h2 style="margin:0;color:#0b132b;font-size:21px;font-weight:800">
            ${escapeHTML(title)}
          </h2>
          <button type="button" id="nv-function-close"
            style="width:38px;height:38px;border:0;border-radius:50%;
            background:#0b132b;color:white;font-size:24px">×</button>
        </div>
        ${content}
      </div>`;

    document.body.appendChild(page);
    page.querySelector("#nv-function-close").onclick = closePage;
    return page;
  }

  function getVehicleRate(vehicle, type) {
    const item = VEHICLES.find(v => v.name === vehicle);
    if (!item) return 0;
    return type === "Outstation Economy" ? item.economy : item.city;
  }

  function vehicleCards() {
    return `
      <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px">
        ${VEHICLES.map(v => {
          const rate = getVehicleRate(v.name, selectedRateType);
          return `
            <button type="button" class="nv-new-vehicle"
              data-vehicle="${escapeHTML(v.name)}"
              style="padding:8px;border:2px solid #dbe3ef;
              border-radius:14px;background:white;text-align:center;color:#0b132b">
              <img src="${escapeHTML(v.image)}" alt="${escapeHTML(v.name)}"
                loading="lazy" style="width:100%;height:95px;object-fit:cover;border-radius:9px"
                onerror="this.style.display='none'">
              <div style="font-weight:800;margin-top:8px">${escapeHTML(v.name)}</div>
              <div style="color:#16a34a;font-size:13px;font-weight:700;margin-top:4px">
                ₹${rate}/km
              </div>
            </button>`;
        }).join("")}
      </div>`;
  }

  function openBooking(type) {
    const config = bookingOptions[type];
    if (!config) return;

    if (type === "ride") {
      selectedVehicle = "";
      selectedRateType = "City Ride";
    }

    let fields = "";

    config.fields.forEach((field, index) => {
      const label = field[0];
      const inputType = field[1];
      const id = "nv-book-field-" + index;

      fields += `<label style="display:block;margin:13px 0 6px;color:#26324b;
        font-size:14px;font-weight:700">${escapeHTML(label)}</label>`;

      if (inputType === "vehicle") {
        fields += `
          <input type="hidden" id="${id}">
          <div id="nv-vehicle-list">${vehicleCards()}</div>`;
      } else if (inputType === "select") {
        fields += `
          <select id="${id}" required style="width:100%;padding:13px;
            border:1px solid #d6dce8;border-radius:10px;background:white;box-sizing:border-box">
            <option value="">Select ${escapeHTML(label)}</option>
            ${field[2].map(option =>
              `<option value="${escapeHTML(option)}">${escapeHTML(option)}</option>`
            ).join("")}
          </select>`;
      } else {
        const required = label.toLowerCase().includes("optional") ? "" : "required";
        fields += `
          <input id="${id}" type="${inputType}" ${required}
            ${inputType === "number" ? 'min="1"' : ""}
            placeholder="${escapeHTML(label)}"
            style="width:100%;padding:13px;border:1px solid #d6dce8;
            border-radius:10px;box-sizing:border-box">`;
      }
    });

    const page = openPage(config.title, `
      <form id="nv-booking-form">
        ${fields}
        <div id="nv-selected-rate" style="margin-top:14px;color:#16a34a;font-weight:800"></div>
        <button type="submit" style="width:100%;padding:15px;margin-top:22px;
          border:0;border-radius:12px;background:#0b132b;color:white;
          font-size:16px;font-weight:800">Submit Request</button>
      </form>
      <p style="font-size:12px;color:#64748b">
        यह Request है, Confirmed Booking या Ticket नहीं।
      </p>`);

    function bindVehicleCards() {
      page.querySelectorAll(".nv-new-vehicle").forEach(card => {
        card.onclick = function () {
          selectedVehicle = card.dataset.vehicle;
          page.querySelector("#nv-book-field-5").value = selectedVehicle;

          page.querySelectorAll(".nv-new-vehicle").forEach(item => {
            item.style.borderColor = "#dbe3ef";
            item.style.background = "white";
          });

          card.style.borderColor = "#16a34a";
          card.style.background = "#ecfdf5";

          const rate = getVehicleRate(selectedVehicle, selectedRateType);
          page.querySelector("#nv-selected-rate").textContent =
            selectedVehicle + " — ₹" + rate + "/km";
        };
      });
    }

    if (type === "ride") {
      const rateSelect = page.querySelector("#nv-book-field-2");

      rateSelect.onchange = function () {
        selectedRateType = rateSelect.value;
        selectedVehicle = "";
        page.querySelector("#nv-book-field-5").value = "";
        page.querySelector("#nv-vehicle-list").innerHTML = vehicleCards();
        page.querySelector("#nv-selected-rate").textContent = "";
        bindVehicleCards();
      };

      bindVehicleCards();
    }

    page.querySelector("#nv-booking-form").onsubmit = function (event) {
      event.preventDefault();
      const data = { service: type };

      for (let index = 0; index < config.fields.length; index++) {
        const field = config.fields[index];
        const input = page.querySelector("#nv-book-field-" + index);

        if (!input || !input.value.trim()) {
          alert(field[0] + " भरें या चुनें।");
          return;
        }

        data[field[0]] = input.value.trim();
      }

      if (type === "ride") {
        const rate = getVehicleRate(data.Vehicle, data["Travel Type"]);
        if (!rate) {
          alert("कृपया गाड़ी चुनें।");
          return;
        }

        data["Vehicle Rate"] = "₹" + rate + "/km";
        data["Distance Rule"] = data["Travel Type"] === "City Ride"
          ? "Round Trip / 2-Way" : "One Way";
      }

      saveRequest(data);

      const successPage = openPage("Request Saved", `
        <div style="text-align:center;padding:20px 5px">
          <div style="font-size:48px;color:#16a34a">✓</div>
          <h3 style="color:#0b132b">Request Saved Successfully</h3>
          ${type === "ride" ? `
            <h3>${escapeHTML(data.Vehicle)}</h3>
            <p>${escapeHTML(data["Vehicle Rate"])}</p>
            <p>${escapeHTML(data["Travel Type"])}</p>` : ""}
          <p style="color:#64748b">तुम्हारी Request इस डिवाइस में सेव हो गई है।
            अभी Booking Confirm नहीं हुई है।</p>
          <button type="button" id="nv-success-done"
            style="padding:13px 30px;background:#0b132b;color:white;
            border:0;border-radius:10px">Done</button>
        </div>`);

      successPage.querySelector("#nv-success-done").onclick = closePage;
    };
  }

  function openTickets() {
    const page = openPage("Choose Ticket", `
      <div style="display:grid;gap:12px">
        <button data-ticket="bus" class="nv-ticket-choice">🚌 Bus Ticket</button>
        <button data-ticket="train" class="nv-ticket-choice">🚆 Train Ticket</button>
        <button data-ticket="flight" class="nv-ticket-choice">✈️ Flight Ticket</button>
      </div>
      <style>
        .nv-ticket-choice {
          padding:17px;text-align:left;border:1px solid #dbe3ef;
          border-radius:12px;background:#f1f5f9;color:#0b132b;
          font-size:16px;font-weight:800;
        }
      </style>`);

    page.querySelectorAll("[data-ticket]").forEach(button => {
      button.onclick = () => openBooking(button.dataset.ticket);
    });
  }

  function showMessage(title, message) {
    const page = openPage(title, `
      <p style="color:#475569;line-height:1.7">${escapeHTML(message)}</p>
      <button id="nv-message-close" style="margin-top:18px;padding:13px 25px;
        background:#0b132b;color:white;border:0;border-radius:10px">Close</button>`);
    page.querySelector("#nv-message-close").onclick = closePage;
  }

  function showProfile() {
    const name = localStorage.getItem("nvUserName") || "Guest";
    const phone = localStorage.getItem("nvUserPhone") || "Not added";
    const role = localStorage.getItem("nvUserRole") || "Customer";
    showMessage("My Profile", "Name: " + name + " | Mobile: " + phone + " | Account: " + role);
  }

  function showSearch() {
    const page = openPage("Search", `
      <input id="nv-search-text" type="search" placeholder="Search here..."
        style="width:100%;padding:14px;border:1px solid #d6dce8;
        border-radius:10px;box-sizing:border-box">
      <button id="nv-search-button" style="width:100%;padding:14px;
        margin-top:12px;border:0;border-radius:10px;background:#0b132b;color:white">
        Search
      </button>
      <div id="nv-search-output" style="margin-top:15px;color:#475569"></div>`);

    page.querySelector("#nv-search-button").onclick = function () {
      const query = page.querySelector("#nv-search-text").value.trim().toLowerCase();
      const output = page.querySelector("#nv-search-output");

      if (!query) {
        output.textContent = "कृपया कुछ लिखें।";
        return;
      }

      const matches = Object.keys(bookingOptions).filter(key => key.includes(query));
      output.textContent = matches.length
        ? "Available options: " + matches.join(", ")
        : "कोई matching booking option नहीं मिला।";
    };
  }

  function showSavedRequests() {
    const requests = getSavedRequests();

    if (!requests.length) {
      showMessage("My Requests", "अभी कोई booking request सेव नहीं है।");
      return;
    }

    const rows = requests.map(request => `
      <div style="padding:12px;margin:10px 0;background:#f1f5f9;
        border-radius:10px;color:#26324b">
        <b>${escapeHTML(request.service)}</b><br>
        <small>${escapeHTML(request.id)}</small><br>
        <small>${escapeHTML(request.status)}</small>
      </div>`).join("");

    openPage("My Requests", rows);
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
  }

  const aliases = {
    ride: "ride",
    hotel: "hotel",
    packages: "packages",
    package: "packages",
    tickets: "tickets",
    ticket: "tickets",
    bus: "bus",
    "bus ticket": "bus",
    "bus tickets": "bus",
    train: "train",
    "train ticket": "train",
    "train tickets": "train",
    flight: "flight",
    "flight ticket": "flight",
    "flight tickets": "flight"
  };

  window.choose = function (option) {
    const value = normalize(option);
    const action = aliases[value] || value;

    if (action === "home") {
      closePage();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (bookingOptions[action]) {
      openBooking(action);
      return;
    }

    switch (action) {
      case "tickets":
        openTickets();
        break;
      case "profile":
        showProfile();
        break;
      case "notifications":
        showMessage("Notifications", "अभी कोई नई notification उपलब्ध नहीं है।");
        break;
      case "search":
        showSearch();
        break;
      case "reels":
      case "view all reels":
        showMessage("Latest Reels",
          "Reels upload और like/comment के लिए database और storage जोड़ना होगा।");
        break;
      case "view all destinations":
        showMessage("Popular Destinations",
          "Manali, Goa, Kashmir और Shimla Home Page पर उपलब्ध हैं।");
        break;
      case "my requests":
      case "history":
        showSavedRequests();
        break;
      default:
        showMessage(option || "NV Travelss",
          "यह विकल्प चुना गया है। इसका पूरा ऑनलाइन सिस्टम जोड़ना बाकी है।");
    }
  };

  window.closeNVPage = closePage;
  window.nvVehicleRates = VEHICLES;
  window.nvGetVehicleRate = getVehicleRate;

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closePage();
  });

})();

/* ==========================================
   NV TRAVELSS - DRIVER COMMISSION
   ALL VEHICLES - 15%
========================================== */

(function () {
  "use strict";

  const RATE = 15;
  const STORE = "nv_driver_commissions";

  const VEHICLES = [
    "Bike", "Auto", "Hatchback", "Sedan", "SUV", "MUV",
    "Premium", "6-7 Seater", "8-12 Seater",
    "Tempo Traveller", "Mini Bus", "Bus"
  ];

  window.nvCalculateCommission = function (fare) {
    fare = Number(fare);
    if (!Number.isFinite(fare) || fare < 0) return null;

    const commission = Math.round(fare * RATE) / 100;
    const driverEarning = Math.round((fare - commission) * 100) / 100;

    return {
      fare,
      commissionRate: RATE,
      commission,
      driverEarning
    };
  };

  window.nvSaveRideCommission = function (ride) {
    if (!ride || !VEHICLES.includes(ride.vehicle)) {
      return { success: false, message: "Invalid vehicle" };
    }

    const result = window.nvCalculateCommission(ride.fare);
    if (!result) return { success: false, message: "Invalid fare" };

    let records = [];
    try {
      records = JSON.parse(localStorage.getItem(STORE) || "[]");
      if (!Array.isArray(records)) records = [];
    } catch (error) {
      records = [];
    }

    const record = {
      id: "NV-COM-" + Date.now(),
      vehicle: ride.vehicle,
      fare: result.fare,
      commissionRate: RATE,
      commission: result.commission,
      driverEarning: result.driverEarning,
      createdAt: new Date().toISOString(),
      status: "Calculated"
    };

    records.push(record);
    localStorage.setItem(STORE, JSON.stringify(records));

    return { success: true, data: record };
  };

  window.nvGetCommissionRecords = function () {
    try {
      const records = JSON.parse(localStorage.getItem(STORE) || "[]");
      return Array.isArray(records) ? records : [];
    } catch (error) {
      return [];
    }
  };

  console.log("NV TRAVELSS: 15% commission system loaded.");

})();

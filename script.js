
/* ==========================================
   NV TRAVELSS - COMPLETE BUTTON FUNCTIONALITY
   Home Page design remains untouched.
========================================== */

(function () {
  "use strict";

  const STORE = "nv_travelss_booking_requests";

  const bookingOptions = {
    ride: {
      title: "Book Your Ride",
      fields: [
        ["Pickup Location", "text"],
        ["Destination", "text"],
        ["Travel Date", "date"],
        ["Travel Time", "time"],
        ["Vehicle", "select", [
          "Bike", "Auto", "Hatchback", "Sedan", "SUV", "MUV",
          "Premium", "6-7 Seater", "8-12 Seater",
          "Tempo Traveller", "Mini Bus", "Bus"
        ]]
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

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[char];
    });
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

    page.style.cssText = [
      "position:fixed",
      "inset:0",
      "z-index:999999",
      "overflow-y:auto",
      "background:#0b132b",
      "padding:16px",
      "font-family:Arial,sans-serif"
    ].join(";");

    page.innerHTML = `
      <div style="
        max-width:460px;
        min-height:250px;
        margin:20px auto;
        padding:20px;
        background:white;
        border-radius:20px;
        box-sizing:border-box;
      ">
        <div style="
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:12px;
          margin-bottom:20px;
        ">
          <h2 style="margin:0;color:#0b132b;font-size:21px;font-weight:800">
            ${escapeHTML(title)}
          </h2>
          <button type="button" id="nv-function-close"
            aria-label="Close"
            style="
              width:38px;height:38px;border:0;border-radius:50%;
              background:#0b132b;color:white;font-size:24px;
            ">×</button>
        </div>
        ${content}
      </div>
    `;

    document.body.appendChild(page);
    page.querySelector("#nv-function-close").onclick = closePage;

    return page;
  }

   
function openBooking(type) {
  const config = bookingOptions[type];
  if (!config) return;

  let fields = "";

  config.fields.forEach(function(field, index) {
    const label = field[0];
    const inputType = field[1];
    const id = "nv-book-field-" + index;

    fields += `
      <label style="display:block;margin:13px 0 6px;
        color:#26324b;font-size:14px;font-weight:700">
        ${escapeHTML(label)}
      </label>
    `;

    if (type === "ride" && label === "Vehicle") {
      fields += `
        <input type="hidden" id="${id}" required>

        <div style="
          display:grid;
          grid-template-columns:repeat(2,minmax(0,1fr));
          gap:12px;
        ">
          ${NV_VEHICLE_DATA.map(function(v) {
            return `
              <button type="button"
                class="nv-new-vehicle"
                data-vehicle="${escapeHTML(v.name)}"
                style="
                  padding:8px;
                  border:2px solid #dbe3ef;
                  border-radius:14px;
                  background:white;
                  text-align:center;
                  color:#0b132b;
                  overflow:hidden;
                ">
                <img src="${escapeHTML(v.image)}"
                  alt="${escapeHTML(v.name)}"
                  loading="lazy"
                  style="width:100%;height:95px;
                  object-fit:cover;border-radius:9px"
                  onerror="this.style.display='none'">

                <div style="font-weight:800;margin-top:8px">
                  ${escapeHTML(v.name)}
                </div>

                <div style="color:#16a34a;
                  font-size:13px;font-weight:700;margin-top:4px">
                  ₹${v.rate}/km
                </div>
              </button>
            `;
          }).join("")}
        </div>
      `;
    } else if (inputType === "select") {
      fields += `
        <select id="${id}" required style="
          width:100%;padding:13px;border:1px solid #d6dce8;
          border-radius:10px;background:white;box-sizing:border-box">
          <option value="">Select Vehicle</option>
          ${field[2].map(option =>
            `<option value="${escapeHTML(option)}">${escapeHTML(option)}</option>`
          ).join("")}
        </select>
      `;
    } else {
      const required = label.toLowerCase().includes("optional")
        ? "" : "required";

      fields += `
        <input id="${id}" type="${inputType}" ${required}
          ${inputType === "number" ? 'min="1"' : ""}
          placeholder="${escapeHTML(label)}"
          style="width:100%;padding:13px;
          border:1px solid #d6dce8;border-radius:10px;
          box-sizing:border-box">
      `;
    }
  });

  const page = openPage(config.title, `
    <form id="nv-booking-form">
      ${fields}

      <button type="submit" style="
        width:100%;padding:15px;margin-top:22px;
        border:0;border-radius:12px;background:#0b132b;
        color:white;font-size:16px;font-weight:800">
        Submit Request
      </button>
    </form>

    <p style="font-size:12px;color:#64748b">
      यह अभी Request है, Confirmed Booking या Ticket नहीं।
    </p>
  `);

  // Vehicle selection
  page.querySelectorAll(".nv-new-vehicle").forEach(function(card) {
    card.onclick = function() {
      page.querySelectorAll(".nv-new-vehicle").forEach(function(item) {
        item.style.borderColor = "#dbe3ef";
        item.style.background = "white";
      });

      card.style.borderColor = "#16a34a";
      card.style.background = "#ecfdf5";

      page.querySelector("#nv-book-field-" +
        config.fields.findIndex(f => f[0] === "Vehicle")
      ).value = card.dataset.vehicle;

      localStorage.setItem("nvSelectedVehicle", card.dataset.vehicle);
    };
  });

  page.querySelector("#nv-booking-form").onsubmit = function(event) {
    event.preventDefault();

    const data = {service:type};

    for (let index = 0; index < config.fields.length; index++) {
      const field = config.fields[index];
      const input = page.querySelector("#nv-book-field-" + index);

      if (!input || !input.value.trim()) {
        alert(field[0] + " चुनें या भरें।");
        return;
      }

      data[field[0]] = input.value.trim();
    }

    if (type === "ride") {
      const selected = NV_VEHICLE_DATA.find(
        v => v.name === data.Vehicle
      );

      if (!selected) {
        alert("कृपया गाड़ी की फोटो देखकर गाड़ी चुनें।");
        return;
      }

      data["Vehicle Rate"] = "₹" + selected.rate + "/km";
    }

    saveRequest(data);

    const successPage = openPage("Request Saved", `
      <div style="text-align:center;padding:20px 5px">
        <div style="font-size:48px;color:#16a34a">✓</div>

        <h3 style="color:#0b132b">
          Request Saved Successfully
        </h3>

        ${type === "ride" ? `
          <h3>${escapeHTML(data.Vehicle)}</h3>
          <p>${escapeHTML(data["Vehicle Rate"])}</p>
        ` : ""}

        <p style="color:#64748b">
          तुम्हारी रिक्वेस्ट इस डिवाइस में सेव हो गई है।
          अभी बुकिंग कन्फर्म नहीं हुई है।
        </p>

        <button type="button" id="nv-success-done"
          style="padding:13px 30px;background:#0b132b;
          color:white;border:0;border-radius:10px">
          Done
        </button>
      </div>
    `);

    successPage.querySelector("#nv-success-done").onclick = closePage;
  };
}
   
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
      </style>
    `);

    page.querySelectorAll("[data-ticket]").forEach(function (button) {
      button.onclick = function () {
        openBooking(button.dataset.ticket);
      };
    });
  }

  function showMessage(title, message) {
    const page = openPage(title, `
      <p style="color:#475569;line-height:1.7">
        ${escapeHTML(message)}
      </p>
      <button id="nv-message-close" style="
        margin-top:18px;padding:13px 25px;
        background:#0b132b;color:white;border:0;border-radius:10px;
      ">Close</button>
    `);

    page.querySelector("#nv-message-close").onclick = closePage;
  }

  function showProfile() {
    const name = localStorage.getItem("nvUserName") || "Guest";
    const phone = localStorage.getItem("nvUserPhone") || "Not added";
    const role = localStorage.getItem("nvUserRole") || "Customer";

    showMessage(
      "My Profile",
      "Name: " + name + " | Mobile: " + phone + " | Account: " + role
    );
  }

  function showNotifications() {
    showMessage("Notifications", "अभी कोई नई notification उपलब्ध नहीं है।");
  }

  function showSearch() {
    const page = openPage("Search", `
      <input id="nv-search-text" type="search"
        placeholder="Search here..."
        style="
          width:100%;padding:14px;border:1px solid #d6dce8;
          border-radius:10px;box-sizing:border-box;
        ">
      <button id="nv-search-button" style="
        width:100%;padding:14px;margin-top:12px;
        border:0;border-radius:10px;background:#0b132b;color:white;
      ">Search</button>
      <div id="nv-search-output" style="margin-top:15px;color:#475569"></div>
    `);

    page.querySelector("#nv-search-button").onclick = function () {
      const query = page.querySelector("#nv-search-text").value.trim();
      const output = page.querySelector("#nv-search-output");

      if (!query) {
        output.textContent = "कृपया कुछ लिखें।";
        return;
      }

      const matches = Object.keys(bookingOptions).filter(function (key) {
        return key.includes(query.toLowerCase());
      });

      output.textContent = matches.length
        ? "Available options: " + matches.join(", ")
        : "इस शब्द के लिए कोई matching booking option नहीं मिला।";
    };
  }

  function showSavedRequests() {
    const requests = getSavedRequests();

    if (!requests.length) {
      showMessage("My Requests", "अभी कोई booking request सेव नहीं है।");
      return;
    }

    const rows = requests.map(function (request) {
      return `
        <div style="
          padding:12px;margin:10px 0;background:#f1f5f9;
          border-radius:10px;color:#26324b;
        ">
          <b>${escapeHTML(request.service)}</b><br>
          <small>${escapeHTML(request.id)}</small><br>
          <small>${escapeHTML(request.status)}</small>
        </div>
      `;
    }).join("");

    openPage("My Requests", rows);
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase()
      .replace(/\s+/g, " ");
  }

  const aliases = {
    "ride": "ride",
    "hotel": "hotel",
    "packages": "packages",
    "package": "packages",
    "tickets": "tickets",
    "ticket": "tickets",
    "bus": "bus",
    "bus ticket": "bus",
    "bus tickets": "bus",
    "train": "train",
    "train ticket": "train",
    "train tickets": "train",
    "flight": "flight",
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
        showNotifications();
        break;

      case "search":
        showSearch();
        break;

      case "reels":
      case "view all reels":
        showMessage(
          "Latest Reels",
          "Reels का पूरा वीडियो अपलोड और like/comment सिस्टम चालू करने के लिए database और storage जोड़ना होगा।"
        );
        break;

      case "view all destinations":
        showMessage(
          "Popular Destinations",
          "Manali, Goa, Kashmir और Shimla के विकल्प Home Page पर उपलब्ध हैं।"
        );
        break;

      case "mountains":
      case "beaches":
      case "city tours":
      case "adventure":
        showMessage("Explore " + option, "Selected category: " + option);
        break;

      case "my requests":
      case "history":
        showSavedRequests();
        break;

      default:
        showMessage(
          option || "NV Travelss",
          "यह विकल्प चुना गया है। इसका पूरा ऑनलाइन सिस्टम जोड़ना अभी बाकी है।"
        );
    }
  };

  window.closeNVPage = closePage;

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closePage();
  });

})();

/* NV TRAVELSS VEHICLE SELECTION */

window.nvSelectVehicle = function(card, vehicle) {
  document.querySelectorAll('.nv-vehicle-card')
    .forEach(function(item) {
      item.classList.remove('selected');
    });

  card.classList.add('selected');

  document.getElementById('nvSelectedVehicle').value = vehicle;
  localStorage.setItem('nvSelectedVehicle', vehicle);
};

/* ==========================================
   NV TRAVELSS - DRIVER COMMISSION SYSTEM
   ALL VEHICLES - 15%
========================================== */

(function () {
  "use strict";

  const NV_COMMISSION_RATE = 15;

  const NV_VEHICLES = [
    "Bike",
    "Auto",
    "Hatchback",
    "Sedan",
    "SUV",
    "MUV",
    "Premium",
    "6-7 Seater",
    "8-12 Seater",
    "Tempo Traveller",
    "Mini Bus",
    "Bus"
  ];

  // Commission calculation
  window.nvCalculateCommission = function (fare) {
    fare = Number(fare);

    if (!Number.isFinite(fare) || fare < 0) {
      return null;
    }

    const commission = Math.round(fare * NV_COMMISSION_RATE) / 100;
    const driverEarning = Math.round((fare - commission) * 100) / 100;

    return {
      fare: fare,
      commissionRate: NV_COMMISSION_RATE,
      commission: commission,
      driverEarning: driverEarning
    };
  };

  // Save ride commission details
  window.nvSaveRideCommission = function (ride) {
    if (!ride || !ride.vehicle) {
      return { success: false, message: "Vehicle missing" };
    }

    if (!NV_VEHICLES.includes(ride.vehicle)) {
      return { success: false, message: "Invalid vehicle" };
    }

    const result = window.nvCalculateCommission(ride.fare);

    if (!result) {
      return { success: false, message: "Invalid fare" };
    }

    const record = {
      id: "NV-COM-" + Date.now(),
      vehicle: ride.vehicle,
      fare: result.fare,
      commissionRate: 15,
      commission: result.commission,
      driverEarning: result.driverEarning,
      createdAt: new Date().toISOString(),
      status: "Calculated"
    };

    const records = JSON.parse(
      localStorage.getItem("nv_driver_commissions") || "[]"
    );

    records.push(record);

    localStorage.setItem(
      "nv_driver_commissions",
      JSON.stringify(records)
    );

    return {
      success: true,
      data: record
    };
  };

  // Get saved commission records
  window.nvGetCommissionRecords = function () {
    try {
      return JSON.parse(
        localStorage.getItem("nv_driver_commissions") || "[]"
      );
    } catch (error) {
      return [];
    }
  };

  console.log("NV TRAVELSS: 15% commission system loaded.");

})();

/* ==========================================
   NV TRAVELSS - DRIVER COMMISSION SYSTEM
   ALL VEHICLES - 15%
========================================== */

(function () {
  "use strict";

  const NV_COMMISSION_RATE = 15;

  const NV_VEHICLES = [
    "Bike",
    "Auto",
    "Hatchback",
    "Sedan",
    "SUV",
    "MUV",
    "Premium",
    "6-7 Seater",
    "8-12 Seater",
    "Tempo Traveller",
    "Mini Bus",
    "Bus"
  ];

  // Commission calculation
  window.nvCalculateCommission = function (fare) {
    fare = Number(fare);

    if (!Number.isFinite(fare) || fare < 0) {
      return null;
    }

    const commission = Math.round(fare * NV_COMMISSION_RATE) / 100;
    const driverEarning = Math.round((fare - commission) * 100) / 100;

    return {
      fare: fare,
      commissionRate: NV_COMMISSION_RATE,
      commission: commission,
      driverEarning: driverEarning
    };
  };

  // Save ride commission details
  window.nvSaveRideCommission = function (ride) {
    if (!ride || !ride.vehicle) {
      return { success: false, message: "Vehicle missing" };
    }

    if (!NV_VEHICLES.includes(ride.vehicle)) {
      return { success: false, message: "Invalid vehicle" };
    }

    const result = window.nvCalculateCommission(ride.fare);

    if (!result) {
      return { success: false, message: "Invalid fare" };
    }

    const record = {
      id: "NV-COM-" + Date.now(),
      vehicle: ride.vehicle,
      fare: result.fare,
      commissionRate: 15,
      commission: result.commission,
      driverEarning: result.driverEarning,
      createdAt: new Date().toISOString(),
      status: "Calculated"
    };

    const records = JSON.parse(
      localStorage.getItem("nv_driver_commissions") || "[]"
    );

    records.push(record);

    localStorage.setItem(
      "nv_driver_commissions",
      JSON.stringify(records)
    );

    return {
      success: true,
      data: record
    };
  };

  // Get saved commission records
  window.nvGetCommissionRecords = function () {
    try {
      return JSON.parse(
        localStorage.getItem("nv_driver_commissions") || "[]"
      );
    } catch (error) {
      return [];
    }
  };

  console.log("NV TRAVELSS: 15% commission system loaded.");

})();


/* =====================================
   NV TRAVELSS
   HOME PAGE SAFE - APP FUNCTIONALITY
   ===================================== */

(function () {
  "use strict";

  let currentService = "";

  function saveBooking(booking) {
    const bookings = JSON.parse(
      localStorage.getItem("nvBookings") || "[]"
    );

    booking.id = "NV" + Date.now();
    booking.createdAt = new Date().toISOString();
    booking.status = "Pending";

    bookings.push(booking);

    localStorage.setItem(
      "nvBookings",
      JSON.stringify(bookings)
    );

    return booking;
  }

  function closePage() {
    const page = document.getElementById("nv-service-page");
    if (page) page.remove();
  }

  function openPage(service) {
    currentService = service;

    closePage();

    const fields = {
      Ride: [
        ["Pickup Location", "pickup"],
        ["Destination", "destination"],
        ["Travel Date", "date", "date"],
        ["Select Vehicle", "vehicle", "vehicle"]
      ],
      Hotel: [
        ["City / Location", "location"],
        ["Check-in", "checkin", "date"],
        ["Check-out", "checkout", "date"],
        ["Guests", "guests", "number"]
      ],
      Packages: [
        ["Destination", "destination"],
        ["Number of Days", "days", "number"],
        ["Travel Date", "date", "date"],
        ["Travelers", "travelers", "number"]
      ],
      "Bus Tickets": [
        ["From", "from"],
        ["To", "to"],
        ["Journey Date", "date", "date"],
        ["Passengers", "passengers", "number"]
      ],
      "Train Tickets": [
        ["From Station", "from"],
        ["To Station", "to"],
        ["Journey Date", "date", "date"],
        ["Passengers", "passengers", "number"]
      ],
      "Flight Tickets": [
        ["From Airport / City", "from"],
        ["To Airport / City", "to"],
        ["Departure Date", "date", "date"],
        ["Passengers", "passengers", "number"]
      ]
    };

    const selectedFields = fields[service];

    if (!selectedFields) {
      alert(service + " का विकल्प जल्द उपलब्ध होगा।");
      return;
    }

    const page = document.createElement("div");

    page.id = "nv-service-page";

    page.innerHTML = `
      <div class="nv-booking-box">

        <button type="button"
          class="nv-close"
          onclick="closeNVPage()">✕</button>

        <h2>NV TRAVELSS</h2>
        <h3>${service}</h3>

        <form id="nv-booking-form">

          ${selectedFields.map(field => {
            let type = field[2] || "text";

            if (field[1] === "vehicle") {
              return `
                <label>${field[0]}</label>
                <select name="${field[1]}" required>
                  <option value="">Select Vehicle</option>
                  <option>Bike</option>
                  <option>Auto</option>
                  <option>Hatchback</option>
                  <option>Sedan</option>
                  <option>SUV</option>
                  <option>MUV</option>
                  <option>Premium</option>
                  <option>6-7 Seater</option>
                  <option>8-12 Seater</option>
                  <option>Tempo Traveller</option>
                  <option>Mini Bus</option>
                  <option>Bus</option>
                </select>
              `;
            }

            return `
              <label>${field[0]}</label>
              <input
                type="${type}"
                name="${field[1]}"
                placeholder="${field[0]}"
                ${type === "number" ? 'min="1"' : ""}
                required
              >
            `;
          }).join("")}

          <label>Your Name</label>
          <input name="customerName"
            placeholder="Enter your name" required>

          <label>Mobile Number</label>
          <input name="phone"
            type="tel"
            pattern="[0-9]{10}"
            maxlength="10"
            placeholder="10 digit mobile number"
            required>

          <button type="submit" class="nv-submit">
            Submit Booking
          </button>

        </form>

        <div id="nv-booking-result"></div>

      </div>
    `;

    document.body.appendChild(page);

    document.getElementById("nv-booking-form")
      .addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(this);
        const booking = {
          service: currentService
        };

        formData.forEach((value, key) => {
          booking[key] = value;
        });

        const saved = saveBooking(booking);

        document.getElementById("nv-booking-result")
          .innerHTML = `
            <h3>Booking Request Saved!</h3>
            <p>Booking ID: ${saved.id}</p>
            <p>Status: Pending</p>
          `;

        this.reset();
      });
  }

  window.choose = function (service) {
    if (service === "Home") {
      closePage();
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
      return;
    }

    openPage(service);
  };

  window.closeNVPage = closePage;

})();

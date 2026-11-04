
/* NV TRAVELSS - ALL OPTIONS OPEN */

(function () {
  const pageStyle = `
    position:fixed; inset:0; z-index:99999;
    background:#f5f7fb; overflow-y:auto;
    padding:22px; font-family:Arial,sans-serif;
  `;

  function openPage(title, content) {
    let old = document.getElementById("nvDynamicPage");
    if (old) old.remove();

    const page = document.createElement("div");
    page.id = "nvDynamicPage";
    page.style.cssText = pageStyle;

    page.innerHTML = `
      <div style="display:flex;align-items:center;gap:15px;margin-bottom:25px">
        <button id="nvBack" style="border:0;background:#10234d;color:white;padding:12px 18px;border-radius:12px">← Back</button>
        <h2 style="color:#10234d;margin:0">${title}</h2>
      </div>
      ${content}
    `;

    document.body.appendChild(page);
    document.getElementById("nvBack").onclick = () => page.remove();
  }

  function field(label, placeholder) {
    return `
      <label style="display:block;margin:15px 0 6px;font-weight:bold">${label}</label>
      <input placeholder="${placeholder}" style="width:100%;padding:15px;border:1px solid #ccc;border-radius:12px;font-size:16px">
    `;
  }

  window.choose = function(service) {
    if (service === "Home") {
      document.getElementById("nvDynamicPage")?.remove();
      window.scrollTo({top:0,behavior:"smooth"});
      return;
    }

    if (service === "Reels") {
      const reels = document.getElementById("reels");
      if (reels) {
        reels.scrollIntoView({behavior:"smooth"});
      } else {
        openPage("Reels", "<p>Reels section is ready to be connected.</p>");
      }
      return;
    }

    if (service === "Ride") {
      openPage("Book Your Ride", `
        ${field("Pickup Location","Enter pickup location")}
        ${field("Destination","Enter destination")}
        <label style="display:block;margin:15px 0 6px;font-weight:bold">Select Vehicle</label>
        <select id="nvVehicle" style="width:100%;padding:15px;border-radius:12px">
          <option>Bike</option><option>Auto</option>
          <option>Hatchback</option><option>Sedan</option>
          <option>SUV</option><option>MUV</option>
          <option>Premium</option><option>6-7 Seater</option>
          <option>8-12 Seater</option><option>Tempo Traveller</option>
          <option>Mini Bus</option><option>Bus</option>
        </select>
        <button onclick="alert('Ride form ready. Database connection is still pending.')" style="width:100%;padding:16px;margin-top:22px;background:#10234d;color:white;border:0;border-radius:12px">Continue</button>
      `);
      return;
    }

    if (service === "Hotel") {
      openPage("Hotel Booking", `
        ${field("City","Enter city")}
        ${field("Check-in Date","DD/MM/YYYY")}
        ${field("Check-out Date","DD/MM/YYYY")}
        ${field("Guests","Number of guests")}
        <button onclick="alert('Hotel booking form ready. Database connection is still pending.')" style="width:100%;padding:16px;margin-top:20px;background:#10234d;color:white;border:0;border-radius:12px">Search Hotels</button>
      `);
      return;
    }

    if (service === "Packages") {
      openPage("Travel Packages", `
        ${field("Destination","Where do you want to go?")}
        ${field("Number of Days","Example: 3 Days")}
        ${field("Travelers","Number of travelers")}
        <button onclick="alert('Package search form ready.')" style="width:100%;padding:16px;margin-top:20px;background:#10234d;color:white;border:0;border-radius:12px">Explore Packages</button>
      `);
      return;
    }

    if (service === "Tickets") {
      openPage("Book Tickets", `
        <h3>Choose Ticket Type</h3>
        <button onclick="window.choose('Bus Tickets')" style="padding:15px;width:100%;margin:8px 0">🚌 Bus Tickets</button>
        <button onclick="window.choose('Train Tickets')" style="padding:15px;width:100%;margin:8px 0">🚆 Train Tickets</button>
        <button onclick="window.choose('Flight Tickets')" style="padding:15px;width:100%;margin:8px 0">✈️ Flight Tickets</button>
      `);
      return;
    }

    if (["Bus Tickets","Train Tickets","Flight Tickets"].includes(service)) {
      openPage(service, `
        ${field("From","Departure city")}
        ${field("To","Destination city")}
        ${field("Journey Date","DD/MM/YYYY")}
        <button onclick="alert('Ticket search form ready. Booking connection is still pending.')" style="width:100%;padding:16px;margin-top:20px;background:#10234d;color:white;border:0;border-radius:12px">Search Tickets</button>
      `);
      return;
    }

    if (service === "Profile") {
      openPage("My Profile", `
        ${field("Full Name","Enter your name")}
        ${field("Mobile Number","Enter mobile number")}
        <button onclick="alert('Profile form ready. Saving connection is still pending.')" style="width:100%;padding:16px;margin-top:20px;background:#10234d;color:white;border:0;border-radius:12px">Save Profile</button>
      `);
      return;
    }

    if (service === "Search") {
      openPage("Search", `
        ${field("Search","Places, hotels, packages...")}
        <button onclick="alert('Search connection is still pending.')" style="width:100%;padding:16px;margin-top:20px;background:#10234d;color:white;border:0;border-radius:12px">Search</button>
      `);
      return;
    }

    openPage(service, "<p>This section is ready for the next development step.</p>");
  };

  window.openReels = function() {
    window.choose("Reels");
  };

})();

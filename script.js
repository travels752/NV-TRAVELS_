
/* HOTEL, PACKAGES AND TICKETS - NV TRAVELSS */

/* DEMO LISTINGS
   Real hotel/train/flight availability requires live provider APIs.
*/

const serviceListings = {
 hotel: [
  {
   name:"Featured Luxury Hotel",
   type:"Premium Stay",
   image:"https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
   detail:"Comfortable rooms • Demo listing"
  },
  {
   name:"Featured City Hotel",
   type:"City Stay",
   image:"https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800",
   detail:"City accommodation • Demo listing"
  },
  {
   name:"Featured Resort",
   type:"Resort",
   image:"https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
   detail:"Relaxing stay • Demo listing"
  }
 ],
 bus: [
  {
   name:"AC Sleeper Bus",
   type:"Sleeper Coach",
   image:"https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800",
   detail:"AC sleeper • Demo option"
  },
  {
   name:"Luxury AC Coach",
   type:"Luxury Coach",
   image:"https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800",
   detail:"Luxury coach • Demo option"
  }
 ],
 train: [
  {
   name:"Express Train",
   type:"Express",
   image:"https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800",
   detail:"Train option • Demo listing"
  },
  {
   name:"Premium Train",
   type:"Premium",
   image:"https://images.unsplash.com/photo-1515169067868-5387ec356754?w=800",
   detail:"Premium journey • Demo listing"
  }
 ],
 flight: [
  {
   name:"Domestic Flight",
   type:"Economy",
   image:"https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800",
   detail:"Domestic flight • Demo option"
  },
  {
   name:"Premium Flight",
   type:"Premium",
   image:"https://images.unsplash.com/photo-1542296332-2e4473faf563?w=800",
   detail:"Premium journey • Demo option"
  }
 ],
 package: [
  {
   name:"Mountain Tour Package",
   type:"Adventure Tour",
   image:"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
   detail:"Mountain holiday • Demo package"
  },
  {
   name:"Beach Holiday Package",
   type:"Beach Tour",
   image:"https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800",
   detail:"Beach holiday • Demo package"
  },
  {
   name:"Kashmir Tour Package",
   type:"Nature Tour",
   image:"https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=800",
   detail:"Nature holiday • Demo package"
  }
 ]
};

let listingContext = {type:"", city:"", extra:{}};

/* COMMON LISTING CARD */
function renderServiceListings(type, city, extra={}) {
 const items = serviceListings[type] || [];
 const titles = {
  hotel:"Recommended Hotels",
  bus:"Recommended Buses",
  train:"Recommended Trains",
  flight:"Recommended Flights",
  package:"Recommended Tour Packages"
 };

 listingContext = {type, city, extra};

 const cards = items.map((item,index)=>`
  <div class="content-card" style="padding:12px">
   <div style="position:relative">
    <img
     src="${item.image}"
     alt="${safe(item.name)}"
     style="width:100%;height:175px;object-fit:cover;border-radius:13px"
     onerror="this.style.display='none'">
    <span style="display:inline-block;background:#eaf3ff;color:#1769e8;padding:6px 10px;border-radius:20px;font-size:10px;font-weight:800;margin-top:9px">
     ★ Recommended
    </span>
   </div>

   <h3 style="margin-top:10px">${safe(item.name)}</h3>
   <p>${safe(item.type)} • ${safe(item.detail)}</p>
   ${city ? `<p><b>Destination:</b> ${safe(city)}</p>` : ""}

   <div style="display:flex;gap:7px;flex-wrap:wrap;margin-top:10px">
    <button class="action-btn" onclick="likeListing('${type}',${index})">
     <i class="fa-regular fa-heart"></i> Like
    </button>
    <button class="action-btn" onclick="commentListing('${type}',${index})">
     <i class="fa-regular fa-comment"></i> Comment
    </button>
    <button class="action-btn" onclick="shareListing('${type}',${index})">
     <i class="fa-solid fa-share"></i> Share
    </button>
    <button class="action-btn" onclick="bookListing('${type}',${index})">
     <i class="fa-solid fa-ticket"></i> Book
    </button>
   </div>
  </div>
 `).join("");

 const html = `
  <div class="content-card">
   <h3>${titles[type]}</h3>
   <p>${city ? "Destination: "+safe(city) : "Explore available options"}</p>
   <p style="margin-top:5px;font-size:10px;color:#8492a6">
    Demo listings. Confirm actual availability before booking.
   </p>
  </div>
  ${cards}
 `;

 modal(titles[type],html);
}

/* LIKE */
function likeListing(type,index) {
 const key = "nv_listing_likes";
 const likes = read(key,{});
 const id = type+"_"+index;
 likes[id] = !likes[id];
 write(key,likes);
 notify(likes[id] ? "आपने Like किया ❤️" : "Like हटाया गया");
}

/* COMMENT */
function commentListing(type,index) {
 const item = serviceListings[type]?.[index];
 if(!item) return;

 const comment = prompt(item.name+" पर अपना Comment लिखें:");
 if(!comment || !comment.trim()) return;

 const all = read("nv_listing_comments",[]);
 all.unshift({
  type,
  item:item.name,
  comment:comment.trim(),
  customer:currentUser?.name || "Customer",
  date:new Date().toLocaleString("en-IN")
 });
 write("nv_listing_comments",all);
 notify("Comment सेव हो गया");
}

/* SHARE */
function shareListing(type,index) {
 const item = serviceListings[type]?.[index];
 if(!item) return;

 const textToShare = "NV TRAVELSS - "+item.name+" ("+item.type+")";

 if(navigator.share) {
  navigator.share({title:item.name,text:textToShare})
   .catch(()=>notify("Share नहीं हो पाया"));
 } else if(navigator.clipboard) {
  navigator.clipboard.writeText(textToShare)
   .then(()=>notify("Share text कॉपी हो गया"))
   .catch(()=>notify("Share उपलब्ध नहीं है"));
 } else {
  notify("इस डिवाइस पर Share उपलब्ध नहीं है");
 }
}

/* BOOK LISTING */
function bookListing(type,index) {
 const item = serviceListings[type]?.[index];
 if(!item) return;

 const data = {
  type:type.toUpperCase()+" Booking",
  itemName:item.name,
  itemType:item.type,
  destination:listingContext.city || "",
  ...listingContext.extra
 };

 saveBooking(data);
 closeModal();
}

/* HOTEL */
function hotelForm() {
 modal("Hotel Booking",`
  <div class="field">
   <label>DESTINATION CITY</label>
   <input id="hotelCity" placeholder="जैसे Indore, Bhopal, Mumbai">
  </div>
  <div class="field">
   <label>CHECK IN</label>
   <input type="date" id="checkIn">
  </div>
  <div class="field">
   <label>CHECK OUT</label>
   <input type="date" id="checkOut">
  </div>
  <div class="field">
   <label>ROOMS</label>
   <select id="rooms">
    <option>1 Room</option>
    <option>2 Rooms</option>
    <option>3 Rooms</option>
    <option>4 Rooms</option>
   </select>
  </div>
  <button class="primary" onclick="submitHotel()">SEARCH HOTELS</button>
 `);
}

function submitHotel() {
 const city = document.getElementById("hotelCity").value.trim();
 const checkIn = document.getElementById("checkIn").value;
 const checkOut = document.getElementById("checkOut").value;
 const rooms = document.getElementById("rooms").value;

 if(!city) {
  notify("Destination city लिखें");
  return;
 }

 if(checkIn && checkOut && checkOut <= checkIn) {
  notify("Check-out तारीख सही चुनें");
  return;
 }

 closeModal();
 renderServiceListings("hotel",city,{checkIn,checkOut,rooms});
}

/* PACKAGES */
function packageForm() {
 modal("Tour Packages",`
  <div class="field">
   <label>SELECT DESTINATION</label>
   <select id="packageCity">
    <option>Manali</option>
    <option>Goa</option>
    <option>Kashmir</option>
    <option>Shimla</option>
    <option>Jaipur</option>
    <option>Udaipur</option>
    <option>Kerala</option>
    <option>Indore</option>
   </select>
  </div>
  <div class="field">
   <label>NUMBER OF DAYS</label>
   <select id="packageDays">
    <option>2 Days</option>
    <option>3 Days</option>
    <option>4 Days</option>
    <option>5 Days</option>
    <option>7 Days</option>
    <option>10 Days</option>
   </select>
  </div>
  <div class="field">
   <label>TRAVEL DATE</label>
   <input type="date" id="packageDate">
  </div>
  <div class="field">
   <label>NUMBER OF PERSONS</label>
   <input type="number" id="packagePeople" min="1" value="2">
  </div>
  <button class="primary" onclick="submitPackage()">VIEW PACKAGES</button>
 `);
}

function submitPackage() {
 const city = document.getElementById("packageCity").value;
 const days = document.getElementById("packageDays").value;
 const date = document.getElementById("packageDate").value;
 const people = document.getElementById("packagePeople").value;

 if(!people || Number(people)<1) {
  notify("Persons की संख्या सही भरें");
  return;
 }

 closeModal();
 renderServiceListings("package",city,{days,date,people});
}

/* BUS / TRAIN / FLIGHT TICKETS */
function ticketsForm(type) {
 currentTicket = type || "bus";
 renderTickets();
}

function renderTickets() {
 const labels = {
  bus:"Bus",
  train:"Train",
  flight:"Flight"
 };

 modal("Book "+labels[currentTicket],`
  <div class="ticket-tab-row">
   <button class="t-tab ${currentTicket==="bus"?"active":""}" onclick="switchTicket('bus')">Bus</button>
   <button class="t-tab ${currentTicket==="train"?"active":""}" onclick="switchTicket('train')">Train</button>
   <button class="t-tab ${currentTicket==="flight"?"active":""}" onclick="switchTicket('flight')">Flight</button>
  </div>

  <div class="field">
   <label>FROM</label>
   <input id="ticketFrom" placeholder="Departure city">
  </div>
  <div class="field">
   <label>TO</label>
   <input id="ticketTo" placeholder="Arrival city">
  </div>
  <div class="field">
   <label>JOURNEY DATE</label>
   <input type="date" id="ticketDate">
  </div>
  <div class="field">
   <label>PASSENGERS</label>
   <input type="number" id="ticketPeople" min="1" value="1">
  </div>

  <button class="primary" onclick="submitTicket()">SEARCH ${labels[currentTicket].toUpperCase()} OPTIONS</button>
  <p style="font-size:10px;color:#8190a6;margin-top:10px">
   ये Demo options हैं। वास्तविक टिकट उपलब्धता और टिकट जारी करने के लिए booking provider जरूरी है।
  </p>
 `);
}

function switchTicket(type) {
 currentTicket = type;
 renderTickets();
}

function submitTicket() {
 const from = document.getElementById("ticketFrom").value.trim();
 const to = document.getElementById("ticketTo").value.trim();
 const date = document.getElementById("ticketDate").value;
 const people = document.getElementById("ticketPeople").value;

 if(!from || !to) {
  notify("From और To भरें");
  return;
 }

 if(from.toLowerCase()===to.toLowerCase()) {
  notify("From और To अलग-अलग होने चाहिए");
  return;
 }

 if(!people || Number(people)<1) {
  notify("Passengers की संख्या सही भरें");
  return;
 }

 const type = currentTicket;
 closeModal();

 renderServiceListings(type,to,{
  from,
  to,
  date,
  people
 });
}

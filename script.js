
function choose(service) {
  if (service === "Home") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  if (service === "Reels") {
    openReels();
    return;
  }

  alert(service + " का पेज अभी बनाया नहीं गया है।");
}

function openReels() {
  let reels = document.getElementById("reelsPage");

  if (!reels) {
    reels = document.createElement("section");
    reels.id = "reelsPage";

    reels.innerHTML = `
      <div style="padding:16px;background:#101827;color:white;min-height:100vh;">
        <button onclick="closeReels()" style="padding:10px 18px;border:0;border-radius:10px;">
          ← Back
        </button>

        <h2 style="margin:20px 0;">NV TRAVELSS REELS</h2>

        <label style="display:block;padding:15px;background:#26364d;border-radius:12px;">
          + Upload Your Video
          <input type="file" id="reelUpload" accept="video/*"
            onchange="previewReel(event)"
            style="display:block;margin-top:12px;">
        </label>

        <div id="reelFeed" style="margin-top:20px;"></div>
      </div>
    `;

    document.body.appendChild(reels);
  }

  reels.style.display = "block";
  window.scrollTo(0, 0);
}

function previewReel(event) {
  const file = event.target.files[0];

  if (!file) return;

  if (!file.type.startsWith("video/")) {
    alert("कृपया वीडियो चुनें।");
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
  share.style.cssText = "padding:12px;";

  share.onclick = async () => {
    if (navigator.share) {
      await navigator.share({ title: "NV Travelss Reel", url });
    } else {
      alert("इस ब्राउज़र में Share उपलब्ध नहीं है।");
    }
  };

  post.append(video, like, share);
  feed.prepend(post);
}

function closeReels() {
  const reels = document.getElementById("reelsPage");
  if (reels) reels.style.display = "none";

  window.scrollTo(0, 0);
}

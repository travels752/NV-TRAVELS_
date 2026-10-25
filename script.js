
function choose(service) {
  if (service === "Home") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  alert(service + " का पेज अभी बनाया नहीं गया है।");
}

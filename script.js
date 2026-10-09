(function () {
  var cards = Array.prototype.slice.call(document.querySelectorAll(".grid .card"));
  var images = [];

  cards.forEach(function (card) {
    var img = card.querySelector("img");
    if (!img) return;
    img.dataset.lbIndex = String(images.length);
    images.push({ src: img.currentSrc || img.src, alt: img.alt || "" });
  });

  if (!images.length) return;

  var index = 0;
  var lb = document.createElement("div");
  lb.className = "lightbox";
  lb.setAttribute("aria-hidden", "true");
  lb.innerHTML =
    '<button class="lb-btn lb-close" type="button" aria-label="Cerrar">&#10005;</button>' +
    '<button class="lb-btn lb-fs" type="button" aria-label="Pantalla completa">&#9974;</button>' +
    '<button class="lb-btn lb-prev" type="button" aria-label="Anterior">&#8249;</button>' +
    '<img class="lb-img" alt="">' +
    '<button class="lb-btn lb-next" type="button" aria-label="Siguiente">&#8250;</button>' +
    '<span class="lb-counter"></span>';
  document.body.appendChild(lb);

  var imgEl = lb.querySelector(".lb-img");
  var counter = lb.querySelector(".lb-counter");

  function render() {
    var item = images[index];
    imgEl.src = item.src;
    imgEl.alt = item.alt;
    counter.textContent = index + 1 + " / " + images.length;
  }

  function open(i) {
    index = (i + images.length) % images.length;
    render();
    lb.classList.add("open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function close() {
    lb.classList.remove("open");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (document.fullscreenElement) document.exitFullscreen();
  }

  function prev() { open(index - 1); }
  function next() { open(index + 1); }

  cards.forEach(function (card) {
    var img = card.querySelector("img");
    if (!img) return;
    card.addEventListener("click", function () { open(Number(img.dataset.lbIndex)); });
  });

  lb.querySelector(".lb-close").addEventListener("click", close);
  lb.querySelector(".lb-prev").addEventListener("click", prev);
  lb.querySelector(".lb-next").addEventListener("click", next);
  lb.querySelector(".lb-fs").addEventListener("click", function () {
    if (!document.fullscreenElement) {
      if (lb.requestFullscreen) lb.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  });

  lb.addEventListener("click", function (e) {
    if (e.target === lb) close();
  });

  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("open")) return;
    if (e.key === "ArrowLeft") prev();
    else if (e.key === "ArrowRight") next();
    else if (e.key === "Escape") close();
  });

  var startX = 0;
  var startY = 0;
  var dragging = false;

  lb.addEventListener("pointerdown", function (e) {
    startX = e.clientX;
    startY = e.clientY;
    dragging = true;
  });

  lb.addEventListener("pointerup", function (e) {
    if (!dragging) return;
    dragging = false;
    var dx = e.clientX - startX;
    var dy = e.clientY - startY;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) next();
      else prev();
    }
  });

  lb.addEventListener("pointercancel", function () { dragging = false; });
})();

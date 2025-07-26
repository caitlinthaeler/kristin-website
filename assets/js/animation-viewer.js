document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("animation-modal");
  const closeBtn = document.getElementById("close-modal");
  const mainAnimation = document.getElementById("main-animation");
  const thumbnails = document.querySelectorAll(".thumbnail");
  const carouselItems = document.querySelectorAll(".carousel-item");
  const animations = window.animationsData || [];
  let currentIndex = 0;

  function showAnimation(index) {
    if (index < 0) index = animations.length - 1;
    if (index >= animations.length) index = 0;

    currentIndex = index;

    const animation = animations[index];
    if (!animation) return;

    mainAnimation.innerHTML = "";

    const ext = animation.filename.split(".").pop().toLowerCase();
    let el;

    if (["mp4", "webm"].includes(ext)) {
      el = document.createElement("video");
      el.src = animation.filename;
      el.controls = true;
      el.autoplay = true;
      el.loop = true;
    } else {
      el = document.createElement("img");
      el.src = animation.filename;
    }

    mainAnimation.appendChild(el);

    carouselItems.forEach((item) => item.classList.remove("selected"));
    if (carouselItems[index]) carouselItems[index].classList.add("selected");

    // Scroll carousel item into view smoothly
    carouselItems[index].scrollIntoView({ behavior: "smooth", inline: "center" });
  }

  thumbnails.forEach((thumb) => {
    thumb.addEventListener("click", (e) => {
      const idx = parseInt(e.target.dataset.index);
      showAnimation(idx);
      modal.classList.remove("hidden");
    });
  });

  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  carouselItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      const idx = parseInt(e.currentTarget.dataset.index);
      showAnimation(idx);
    });
  });

  // Arrow key navigation
  document.addEventListener("keydown", (e) => {
    if (modal.classList.contains("hidden")) return; // only active when modal is visible

    if (e.key === "ArrowLeft") {
      showAnimation(currentIndex - 1);
    } else if (e.key === "ArrowRight") {
      showAnimation(currentIndex + 1);
    }
  });
});

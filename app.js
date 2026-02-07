const toast = document.getElementById("toast");
const floatingLayer = document.querySelector(".floating-layer");
const confettiLayer = document.getElementById("confetti-layer");
const hero = document.getElementById("hero");
const heroBg = document.getElementById("heroBg");
const heroPreview = document.getElementById("hero-preview");
const heroPreviewOverlay = document.querySelector(".hero-media-overlay");
const introVideo = document.getElementById("intro-video");
const introLines = Array.from(
  document.querySelectorAll("#intro-text .intro-line")
);
const introToggle = document.getElementById("intro-toggle");
const introReplay = document.getElementById("intro-replay");

const screens = {
  intro: document.getElementById("screen-intro"),
  question: document.getElementById("screen-question"),
  celebration: document.getElementById("screen-celebration"),
  brief: document.getElementById("screen-brief"),
  decrypt: document.getElementById("screen-decrypt"),
  tasks: document.getElementById("screen-tasks"),
  video1: document.getElementById("screen-video1"),
  video2: document.getElementById("screen-video2"),
  end: document.getElementById("screen-end"),
  plant: document.getElementById("screen-plant"),
  hero: document.getElementById("hero"),
  note: document.getElementById("screen-note"),
  game: document.getElementById("screen-game"),
  game2: document.getElementById("screen-game2"),
  valentine: document.getElementById("screen-valentine"),
  hooray: document.getElementById("screen-hooray"),
  video: document.getElementById("screen-video"),
  finish: document.getElementById("screen-finish")
};

const continueBtn = document.getElementById("continue-btn");
const questionBtn = document.getElementById("question-btn");
const surpriseBtn = document.getElementById("surprise-btn");
const plantBtn = document.getElementById("plant-btn");
const startGameBtn = document.getElementById("start-game");
const startGame2Btn = document.getElementById("start-game2");
const yesBtn = document.getElementById("yes-btn");
const noBtn = document.getElementById("no-btn");
const restartBtn = document.getElementById("restart-btn");
const celebrationBtn = document.getElementById("celebration-btn");
const briefBtn = document.getElementById("brief-btn");
const messageText = document.getElementById("message-text");
const messageNextBtn = document.getElementById("message-next-btn");
const task1Btn = document.getElementById("task1-btn");
const task2Btn = document.getElementById("task2-btn");
const task3Btn = document.getElementById("task3-btn");
const replayBtn = document.getElementById("replay-btn");
const briefBody = document.getElementById("brief-body");

const gameArea = document.getElementById("game-area");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const gameMessage = document.getElementById("game-message");

const game2Area = document.getElementById("game2-area");
const score2El = document.getElementById("score2");
const time2El = document.getElementById("time2");
const game2Message = document.getElementById("game-message2");
const valentineArea = document.getElementById("valentine-area");
const task2Item = document.getElementById("task2-item");
const task3Item = document.getElementById("task3-item");

const montage = document.getElementById("montage");
const videoOverlay = document.getElementById("video-overlay");
const videoFallback = document.getElementById("video-fallback");
const plantVideo = document.getElementById("plant-video");
const video1 = document.getElementById("video1");
const video2 = document.getElementById("video2");
const video1Quote = document.getElementById("video1-quote");
const video2Quote = document.getElementById("video2-quote");
const decryptBar = document.getElementById("decrypt-bar");
const decryptText = document.getElementById("decrypt-text");

let gameTimer = null;
let spawnTimer = null;
let timeLeft = 20;
let score = 0;
let videoStopTimer = null;
let countdownTimer = null;
let heroRaf = null;
let lastNoMove = 0;
let introTimer = null;
let introTextTimer = null;
let introPaused = false;
let introTextRemaining = 15800;
let introTextStart = 0;
let game2Timer = null;
let spawnTimer2 = null;
let timeLeft2 = 18;
let score2 = 0;

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toast._t);
  toast._t = window.setTimeout(() => toast.classList.remove("show"), 2000);
};

const runBriefTypewriter = () => {
  if (!briefBody) return;
  const full = briefBody.dataset.full || "";
  briefBody.textContent = "";
  let idx = 0;
  const tick = () => {
    briefBody.textContent = full.slice(0, idx);
    idx += 1;
    if (idx <= full.length) {
      setTimeout(tick, 18);
    }
  };
  tick();
};

const showScreen = (name) => {
  Object.values(screens).forEach((screen) => screen.classList.add("hidden"));
  screens[name].classList.remove("hidden");
  if (name === "hero" && screens.hero) {
    screens.hero.classList.add("video-only");
  } else if (screens.hero) {
    screens.hero.classList.remove("video-only");
  }
};

const setupHeroMotion = () => {
  if (!hero || !heroBg) return;
  let cx = 0;
  let cy = 0;
  let tx = 0;
  let ty = 0;

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const lerp = (a, b, t) => a + (b - a) * t;

  const animate = () => {
    cx = lerp(cx, tx, 0.07);
    cy = lerp(cy, ty, 0.07);
    heroBg.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
    heroRaf = requestAnimationFrame(animate);
  };

  heroRaf = requestAnimationFrame(animate);

  const handlePointer = (e) => {
    const rect = hero.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    tx = clamp(px * 80, -80, 80);
    ty = clamp(py * 80, -80, 80);
  };

  hero.addEventListener("pointermove", handlePointer);

  hero.addEventListener("mouseleave", () => {
    tx = 0;
    ty = 0;
  });

  if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", (e) => {
      const gamma = e.gamma || 0;
      const beta = e.beta || 0;
      const px = clamp(gamma / 30, -0.5, 0.5);
      const py = clamp(beta / 30, -0.5, 0.5);
      tx = clamp(px * 80, -80, 80);
      ty = clamp(py * 80, -80, 80);
    });
  }

  if (heroPreview) {
    heroPreview.play().catch(() => {});
  }
};

const setupFloatingHearts = () => {
  if (!floatingLayer) return;
  const count = 16;
  for (let i = 0; i < count; i += 1) {
    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.setProperty("--drift", `${Math.random() * 60 - 30}px`);
    heart.style.animationDelay = `${Math.random() * 10}s`;
    heart.style.animationDuration = `${12 + Math.random() * 10}s`;
    heart.style.transform = `translateY(${Math.random() * 50}vh) rotate(45deg)`;
    const size = 10 + Math.random() * 14;
    heart.style.width = `${size}px`;
    heart.style.height = `${size}px`;
    heart.style.opacity = `${0.35 + Math.random() * 0.4}`;
    floatingLayer.appendChild(heart);
  }
};

const setupConfetti = () => {
  if (!confettiLayer) return;
  const colors = ["#ff7ac1", "#ffb3d9", "#ffffff", "#ffd1e8"];
  for (let i = 0; i < 36; i += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.animationDelay = `${Math.random() * 2}s`;
    piece.style.background = colors[i % colors.length];
    confettiLayer.appendChild(piece);
  }
};

const resetGame = () => {
  score = 0;
  timeLeft = 20;
  scoreEl.textContent = "0";
  timeEl.textContent = "20";
  gameMessage.textContent = "";
  gameArea.innerHTML = "";
  clearInterval(gameTimer);
  clearInterval(spawnTimer);
};

const resetGame2 = () => {
  score2 = 0;
  timeLeft2 = 18;
  score2El.textContent = "0";
  time2El.textContent = "18";
  game2Message.textContent = "";
  game2Area.innerHTML = "";
  clearInterval(game2Timer);
  clearInterval(spawnTimer2);
};

const burstSparkles = (x, y) => {
  const count = 8;
  for (let i = 0; i < count; i += 1) {
    const sparkle = document.createElement("span");
    sparkle.className = "sparkle";
    const angle = (Math.PI * 2 * i) / count;
    const distance = 20 + Math.random() * 16;
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;
    sparkle.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
    sparkle.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);
    gameArea.appendChild(sparkle);
    sparkle.addEventListener("animationend", () => sparkle.remove());
  }
};

const spawnHeart = () => {
  const heart = document.createElement("div");
  heart.className = "heart";
  const size = 26 + Math.random() * 20;
  heart.style.width = `${size}px`;
  heart.style.height = `${size}px`;
  const maxX = gameArea.clientWidth - size;
  const maxY = gameArea.clientHeight - size;
  heart.style.left = `${Math.random() * maxX}px`;
  heart.style.top = `${Math.random() * maxY}px`;
  heart.addEventListener("click", () => {
    score += 1;
    scoreEl.textContent = String(score);
    burstSparkles(heart.offsetLeft + size / 2, heart.offsetTop + size / 2);
    heart.remove();
    if (score >= 7) {
      endGame();
    }
  });
  gameArea.appendChild(heart);
};

const spawnStar = () => {
  const star = document.createElement("div");
  star.className = "sparkle";
  star.style.opacity = "1";
  const size = 14 + Math.random() * 16;
  const maxX = game2Area.clientWidth - size;
  const maxY = game2Area.clientHeight - size;
  star.style.left = `${Math.random() * maxX}px`;
  star.style.top = `${Math.random() * maxY}px`;
  star.style.width = `${size}px`;
  star.style.height = `${size}px`;
  star.addEventListener("click", () => {
    score2 += 1;
    score2El.textContent = String(score2);
    star.remove();
    if (score2 >= 10) {
      endGame2();
    }
  });
  game2Area.appendChild(star);
};

const startGame = () => {
  resetGame();
  spawnHeart();
  spawnTimer = setInterval(spawnHeart, 700);
  gameTimer = setInterval(() => {
    timeLeft -= 1;
    timeEl.textContent = String(timeLeft);
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
};

const endGame = () => {
  clearInterval(gameTimer);
  clearInterval(spawnTimer);
  showScreen("game2");
};

const startGame2 = () => {
  resetGame2();
  spawnStar();
  spawnTimer2 = setInterval(spawnStar, 800);
  game2Timer = setInterval(() => {
    timeLeft2 -= 1;
    time2El.textContent = String(timeLeft2);
    if (timeLeft2 <= 0) {
      endGame2();
    }
  }, 1000);
};

const endGame2 = () => {
  clearInterval(game2Timer);
  clearInterval(spawnTimer2);
  showScreen("note");
};

const moveNoButton = (x, y) => {
  if (!valentineArea || !noBtn) return;
  const area = valentineArea.getBoundingClientRect();
  const btn = noBtn.getBoundingClientRect();
  const yesRect = yesBtn ? yesBtn.getBoundingClientRect() : null;
  const maxX = Math.max(area.width - btn.width, 0);
  const maxY = Math.max(area.height - btn.height, 0);

  let nx = Math.random() * maxX;
  let ny = Math.random() * maxY;

  if (typeof x === "number" && typeof y === "number") {
    const dx = x - area.left;
    const dy = y - area.top;
    const distance = Math.hypot(dx - nx, dy - ny);
    if (distance < 140) {
      nx = (nx + 180) % maxX;
      ny = (ny + 120) % maxY;
    }
  }

  if (yesRect) {
    const yesX = yesRect.left - area.left + yesRect.width / 2;
    const yesY = yesRect.top - area.top + yesRect.height / 2;
    const noX = nx + btn.width / 2;
    const noY = ny + btn.height / 2;
    const yesDistance = Math.hypot(noX - yesX, noY - yesY);
    if (yesDistance < 140) {
      nx = (nx + 200) % maxX;
      ny = (ny + 140) % maxY;
    }
  }

  noBtn.style.left = `${nx}px`;
  noBtn.style.top = `${ny}px`;
};

const playVideo = async () => {
  videoOverlay.classList.remove("active");
  try {
    await montage.play();
    showToast("Playing video");
    clearTimeout(videoStopTimer);
    videoStopTimer = setTimeout(() => montage.pause(), 60000);
  } catch (err) {
    videoOverlay.classList.add("active");
    showToast("Tap to play video");
  }
};

const resetAll = () => {
  resetGame();
  resetGame2();
  if (video1) {
    video1.pause();
    video1.currentTime = 0;
  }
  if (video2) {
    video2.pause();
    video2.currentTime = 0;
  }
  if (plantVideo) {
    plantVideo.pause();
    plantVideo.currentTime = 0;
  }
  if (heroBg && heroBg.pause) {
    heroBg.pause();
    heroBg.currentTime = 0;
  }
  montage.pause();
  montage.currentTime = 0;
  videoOverlay.classList.add("active");
  showScreen("intro");
  startIntroCinematic();
};

const resetIntroText = () => {
  introLines.forEach((line) => line.classList.remove("animate"));
  if (continueBtn) {
    continueBtn.classList.remove("show");
  }
};

const playIntroSequence = () => {
  if (!introVideo) return 0;
  if (introTimer) {
    clearInterval(introTimer);
  }
  introTimer = setInterval(() => {
    if (introPaused) return;
    if (introVideo.paused && !introVideo.ended) {
      introVideo.play().catch(() => {});
    }
  }, 500);
  introVideo.currentTime = 0;
  introVideo.playbackRate = 0.75;
  introVideo.play().catch(() => {});
  return introVideo.duration ? introVideo.duration * 1000 : 0;
};


const startIntroCinematic = () => {
  if (!screens.intro || !continueBtn) return;
  continueBtn.disabled = true;
  continueBtn.classList.remove("show");
  introPaused = false;
  if (introToggle) {
    introToggle.textContent = "Pause Intro";
    introToggle.classList.remove("hidden");
  }
  if (screens.intro) {
    screens.intro.classList.remove("intro-paused");
  }
  resetIntroText();
  if (introTimer) {
    clearInterval(introTimer);
    introTimer = null;
  }
  if (introTextTimer) {
    clearTimeout(introTextTimer);
    introTextTimer = null;
  }
  playIntroSequence();
  introLines.forEach((line) => {
    line.classList.remove("animate");
    void line.offsetWidth;
    line.classList.add("animate");
  });
  if (continueBtn) {
    introTextRemaining = 15800;
    introTextStart = Date.now();
    introTextTimer = setTimeout(() => {
      continueBtn.classList.add("show");
      continueBtn.disabled = false;
      if (introToggle) {
        introToggle.classList.add("hidden");
      }
    }, introTextRemaining);
  }
};

const startPlantVideo = () => {
  showScreen("plant");
  if (plantVideo) {
    plantVideo.currentTime = 0;
    plantVideo.muted = false;
    plantVideo.load();
    plantVideo.play().catch(() => {
      showToast("Tap to play");
    });
  }
};

const startVideo1 = () => {
  showScreen("video1");
  if (video1Quote) {
    const text = video1Quote.dataset.text || "";
    typeVideoQuote(video1Quote, text, 24);
  }
  if (video1) {
    video1.currentTime = 0;
    video1.play().catch(() => showToast("Tap to play"));
  }
};

const startVideo2 = () => {
  showScreen("video2");
  if (video2Quote) {
    const text = video2Quote.dataset.text || "";
    typeVideoQuote(video2Quote, text, 24);
  }
  if (video2) {
    video2.currentTime = 0;
    video2.play().catch(() => showToast("Tap to play"));
  }
};

const startDecrypt = () => {
  showScreen("decrypt");
  if (!decryptBar || !decryptText) return;
  decryptBar.style.width = "0%";
  decryptText.textContent = "0%";
  let progress = 0;
  const timer = setInterval(() => {
    progress += 8;
    if (progress >= 100) {
      progress = 100;
      clearInterval(timer);
      showScreen("tasks");
    }
    decryptBar.style.width = `${progress}%`;
    decryptText.textContent = `${progress}%`;
  }, 120);
};

const typeVideoQuote = (el, text, speed = 24) => {
  if (!el) return;
  const parts = text.split("|");
  el.innerHTML = "";
  el.classList.add("typing");
  let idx = 0;
  const full = parts.join("\n");
  const tick = () => {
    const slice = full.slice(0, idx);
    el.innerHTML = slice.replace("\n", "<br />");
    idx += 1;
    if (idx <= full.length) {
      setTimeout(tick, speed);
    } else {
      el.classList.remove("typing");
      setTimeout(() => el.classList.add("hide"), 1400);
    }
  };
  el.classList.remove("hide");
  tick();
};
const startMessageType = () => {
  if (!messageText || !messageNextBtn) return;
  const message =
    "Agent, your mission is simple:\nComplete the steps.\nUnlock the final reveal.\nNo mistakes… just love.";
  messageText.textContent = "";
  messageText.classList.add("typing");
  messageNextBtn.disabled = true;
  let idx = 0;
  const tick = () => {
    messageText.textContent = message.slice(0, idx);
    idx += 1;
    if (idx <= message.length) {
      setTimeout(tick, 28);
    } else {
      messageText.classList.remove("typing");
      messageNextBtn.disabled = false;
    }
  };
  tick();
};

const toggleIntroPlayback = () => {
  if (!introVideo || !introTimer) return;
  introPaused = !introPaused;
  if (screens.intro) {
    screens.intro.classList.toggle("intro-paused", introPaused);
  }
  if (introToggle) {
    introToggle.textContent = introPaused ? "Resume Intro" : "Pause Intro";
  }
  if (introVideo) {
    if (introPaused) {
      introVideo.pause();
    } else {
      introVideo.play().catch(() => {});
    }
  }
  if (continueBtn) {
    if (introPaused) {
      if (introTextTimer) {
        clearTimeout(introTextTimer);
      }
      introTextRemaining -= Date.now() - introTextStart;
    } else {
      introTextStart = Date.now();
      introTextTimer = setTimeout(() => {
        continueBtn.classList.add("show");
        continueBtn.disabled = false;
        if (introToggle) {
          introToggle.classList.add("hidden");
        }
      }, Math.max(introTextRemaining, 0));
    }
  }
};
continueBtn.addEventListener("click", () => {
  showScreen("question");
});

if (questionBtn) {
  questionBtn.addEventListener("click", () => {
    showScreen("valentine");
    moveNoButton();
  });
}
if (plantVideo) {
  plantVideo.addEventListener("ended", () => {
    showScreen("hero");
    if (heroBg && heroBg.play) {
      heroBg.muted = false;
      heroBg.play().catch(() => {});
    }
  });
}

if (heroBg) {
  heroBg.addEventListener("ended", () => {
    showScreen("finish");
  });
}

if (startGameBtn) {
  startGameBtn.addEventListener("click", () => {
    startGame();
  });
}

if (startGame2Btn) {
  startGame2Btn.addEventListener("click", () => {
    startGame2();
  });
}

if (yesBtn) {
  yesBtn.addEventListener("click", () => {
    showScreen("celebration");
  });
}

if (celebrationBtn) {
  celebrationBtn.addEventListener("click", () => {
    showScreen("brief");
    runBriefTypewriter();
  });
}

if (briefBtn) {
  briefBtn.addEventListener("click", () => {
    startDecrypt();
  });
}

if (messageNextBtn) {
  messageNextBtn.addEventListener("click", () => {
    startDecrypt();
  });
}

if (introToggle) {
  introToggle.addEventListener("click", toggleIntroPlayback);
}

if (introReplay) {
  introReplay.addEventListener("click", () => {
    startIntroCinematic();
  });
}

if (introVideo) {
  introVideo.addEventListener("ended", () => {
    if (introTimer) {
      clearInterval(introTimer);
      introTimer = null;
    }
  });
}


if (task1Btn) {
  task1Btn.addEventListener("click", (e) => {
    e.currentTarget.closest(".task-item")?.classList.add("done");
    e.currentTarget.textContent = "Completed ✔";
    e.currentTarget.disabled = true;
    showToast("System check passed");
    if (task2Btn) {
      task2Btn.disabled = false;
      task2Btn.textContent = "I'm Ready 😌";
      if (task2Item) {
        task2Item.classList.remove("hidden");
        task2Item.classList.add("reveal", "unlock-glow");
        setTimeout(() => task2Item.classList.remove("unlock-glow"), 1200);
      }
    }
  });
}

if (task2Btn) {
  task2Btn.addEventListener("click", (e) => {
    e.currentTarget.closest(".task-item")?.classList.add("done");
    e.currentTarget.textContent = "Syncing timer…";
    e.currentTarget.disabled = true;
    setTimeout(() => {
      if (task3Btn) {
        task3Btn.disabled = false;
        task3Btn.textContent = "Start Countdown";
        if (task3Item) {
          task3Item.classList.remove("hidden");
          task3Item.classList.add("reveal", "unlock-glow");
          setTimeout(() => task3Item.classList.remove("unlock-glow"), 1200);
        }
      }
    }, 600);
  });
}

if (task3Btn) {
  task3Btn.addEventListener("click", (e) => {
    e.currentTarget.closest(".task-item")?.classList.add("done");
    const countdown = document.createElement("div");
    countdown.className = "countdown-overlay";
    countdown.textContent = "3";
    document.body.appendChild(countdown);
    let n = 3;
    const tick = setInterval(() => {
      n -= 1;
      if (n === 0) {
        clearInterval(tick);
        countdown.remove();
        if (screens.tasks) {
          screens.tasks.classList.add("fade-out");
        }
        setTimeout(() => {
          if (screens.tasks) {
            screens.tasks.classList.remove("fade-out");
          }
          startVideo1();
        }, 500);
      } else {
        countdown.textContent = String(n);
      }
    }, 700);
  });
}

if (plantBtn) {
  plantBtn.addEventListener("click", startPlantVideo);
}

if (valentineArea) {
  valentineArea.addEventListener("mousemove", (e) => {
    const now = Date.now();
    if (now - lastNoMove < 220) return;
    lastNoMove = now;
    moveNoButton(e.clientX, e.clientY);
  });

  valentineArea.addEventListener("touchstart", () => {
    moveNoButton();
  });

  valentineArea.addEventListener("touchmove", () => {
    moveNoButton();
  });
}

if (noBtn) {
  noBtn.addEventListener("mouseenter", (e) => {
    moveNoButton(e.clientX, e.clientY);
  });
  noBtn.addEventListener("touchstart", (e) => {
    const touch = e.touches && e.touches[0];
    moveNoButton(touch ? touch.clientX : undefined, touch ? touch.clientY : undefined);
  });
}

if (restartBtn) {
  restartBtn.addEventListener("click", resetAll);
}

if (videoOverlay) {
  videoOverlay.addEventListener("click", playVideo);
}
if (montage) {
  montage.addEventListener("click", playVideo);
}

if (montage) {
  montage.addEventListener("error", () => {
    videoFallback.hidden = false;
    videoOverlay.classList.remove("active");
  });

  montage.addEventListener("ended", () => {
    clearTimeout(videoStopTimer);
    showScreen("finish");
  });
}

if (video1) {
  video1.addEventListener("ended", () => {
    startVideo2();
  });
}

if (video2) {
  video2.addEventListener("ended", () => {
    showScreen("end");
  });
}

if (replayBtn) {
  replayBtn.addEventListener("click", () => {
    showScreen("celebration");
  });
}

setupFloatingHearts();
setupConfetti();
setupHeroMotion();
startIntroCinematic();
moveNoButton();
videoOverlay.classList.add("active");
if (
  heroPreviewOverlay &&
  heroPreview &&
  screens.hero &&
  !screens.hero.classList.contains("video-only")
) {
  heroPreviewOverlay.classList.add("active");
  heroPreviewOverlay.addEventListener("click", () => {
    heroPreview.muted = false;
    heroPreview.play().catch(() => {});
    heroPreviewOverlay.classList.remove("active");
  });
  heroPreview.addEventListener("play", () => {
    heroPreviewOverlay.classList.remove("active");
  });
}
// avatar-rotate.js
// Rotating portrait minigame (8-frame sequences) + triangle button controls

const FRAME_COUNT = 8;
const FRAME_INTERVAL_MS = 180;

// Build an array of frame file paths: folder/prefix0.png ... prefix7.png
function makeFrames(folder, prefix) {
    return Array.from({ length: FRAME_COUNT }, (_, i) => `${folder}/${prefix}${i}.png`);
}

// --- Base head frames ---
const headFrames = makeFrames("Images/avatar/head", "head-");

// --- Hair styles (add/remove styles here) ---
const hairSets = [
    { key: "none", frames: null },
    { key: "style-1", frames: makeFrames("Images/avatar/hair-style-1", "hair-style-1-") },
    { key: "style-2", frames: makeFrames("Images/avatar/hair-style-2", "hair-style-2-") }
];

// --- Face decor (combined nose+lips) ---
const decorSets = [
    { key: "none", frames: null },
    { key: "face-decor", frames: makeFrames("Images/avatar/face-decor", "face-decor-") }
];

// --- State ---
let frameIndex = 0;
let hairIndex = 0;   // starts on style-1
let decorIndex = 0;  // starts on none

const headImg = document.getElementById("avatar-head");
const hairImg = document.getElementById("avatar-hair");
const decorImg = document.getElementById("avatar-decor");

function shiftIndex(current, direction, length) {
    let next = current + direction;
    if (next < 0) next = length - 1;
    if (next >= length) next = 0;
    return next;
}

function applyLayer(imgEl, framesOrNull) {
    if (!imgEl) return;

    if (!framesOrNull) {
        imgEl.src = "Images/avatar/blank.png";
        imgEl.style.opacity = 0;
        return;
    }

    imgEl.src = framesOrNull[frameIndex];
    imgEl.style.opacity = 1;
}

function tick() {
    frameIndex = (frameIndex + 1) % FRAME_COUNT;

    // head
    if (headImg) headImg.src = headFrames[frameIndex];

    // hair
    applyLayer(hairImg, hairSets[hairIndex].frames);

    // decor
    applyLayer(decorImg, decorSets[decorIndex].frames);
}

if (headImg) {
    // start animation
    setInterval(tick, FRAME_INTERVAL_MS);

    // buttons
    document.querySelectorAll(".triangle-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const control = btn.getAttribute("data-control");
            const dir = parseInt(btn.getAttribute("data-dir"), 10) || 0;

            if (control === "hair") {
                hairIndex = shiftIndex(hairIndex, dir, hairSets.length);
            } else if (control === "decor") {
                decorIndex = shiftIndex(decorIndex, dir, decorSets.length);
            }
        });
    });
}

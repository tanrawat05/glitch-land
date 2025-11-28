// ===============================
//  MATRIX CHARACTERS BACKGROUND
// ===============================
function initMatrixLayer() {
    const canvas = document.getElementById("matrixGrid");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const chars =
        "0123456789ABCDEF" +
        "!@#$%^&*()<>?{}|\\][]";

    const fontSize = 14;                   // 🔥 smaller characters
    const charSpacing = fontSize * 0.70;   // 🔥 tighter spacing

    let columns = 0;
    let rows = 0;
    let grid = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        setupGrid();
    }

    function setupGrid() {
        columns = Math.floor(canvas.width / charSpacing);
        rows = Math.floor(canvas.height / fontSize);

        grid = Array(rows).fill().map(() =>
            Array(columns).fill().map(() => ({
                char: chars[Math.floor(Math.random() * chars.length)],
                brightness: Math.floor(Math.random() * 3)
            }))
        );
    }

    function drawGrid() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = `${fontSize}px monospace`;

        // Draw characters
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < columns; x++) {
                const cell = grid[y][x];

                if (Math.random() < 0.02)
                    cell.brightness = Math.floor(Math.random() * 3);

                if (Math.random() < 0.05)
                    cell.char = chars[Math.floor(Math.random() * chars.length)];

                // 🔥 Reduced opacity for ALL brightness levels
                let color;
                switch (cell.brightness) {
                    case 2:
                        color = "rgba(115,115,115,0.35)"; // previously 0.55
                        break;
                    case 1:
                        color = "rgba(85,85,85,0.25)";   // previously 0.40
                        break;
                    case 0:
                        color = "rgba(55,55,55,0.18)";   // previously 0.30
                        break;
                }

                ctx.fillStyle = color;
                ctx.fillText(cell.char, x * charSpacing, y * fontSize);
            }
        }

        // ===============================
        //  SOFT EDGE FADE
        // ===============================
        const radius = Math.min(canvas.width, canvas.height) * 0.42; // slightly smaller central circle
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        const gradient = ctx.createRadialGradient(
            cx, cy, 0,
            cx, cy, radius * 1.30
        );

        gradient.addColorStop(0.0, "rgba(0,0,0,1)");
        gradient.addColorStop(0.5, "rgba(0,0,0,0.7)");
        gradient.addColorStop(0.75, "rgba(0,0,0,0.3)");
        gradient.addColorStop(1.0, "rgba(0,0,0,0)");

        ctx.globalCompositeOperation = "destination-in";
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = "source-over";
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    setInterval(drawGrid, 66);
}

// ===============================
//  SCROLL LOADING + IMAGES
// ===============================
function initScrollAnimation() {
    const progress = document.querySelector(".progress");
    const loadingLabel = document.querySelector(".loading-label");

    const headphones = document.querySelector(".headphones");
    const phone = document.querySelector(".phone");
    const cd = document.querySelector(".cd");
    const vhs = document.querySelector(".vhs");

    if (!progress || !loadingLabel) return;

    let scrollProgress = 0;
    const maxScroll = 1500;

    function handleScroll(event) {
        const delta = event.deltaY || event.wheelDelta || -event.detail || 0;

        scrollProgress += delta * 0.3;
        scrollProgress = Math.min(Math.max(scrollProgress, 0), maxScroll);

        const percent = Math.floor((scrollProgress / maxScroll) * 100);

        progress.style.width = percent + "%";
        loadingLabel.textContent = percent >= 100 ? "COMPLETE!" : percent + "%";

        if (percent >= 25) headphones.classList.add("reveal");
        if (percent >= 50) phone.classList.add("reveal");
        if (percent >= 75) cd.classList.add("reveal");
        if (percent >= 100) vhs.classList.add("reveal");

        if (percent < 100) vhs.classList.remove("reveal");
        if (percent < 75) cd.classList.remove("reveal");
        if (percent < 50) phone.classList.remove("reveal");
        if (percent < 25) headphones.classList.remove("reveal");
    }

    window.addEventListener("wheel", handleScroll, { passive: true });
    window.addEventListener("DOMMouseScroll", handleScroll, { passive: true });
}

// ===============================
//  INIT BOTH FEATURES
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    initMatrixLayer();
    initScrollAnimation();
});

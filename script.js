/* =========================
   1. SMOOTH SCROLL ANIMATION (UP & DOWN)
========================= */
document.addEventListener("DOMContentLoaded", function () {
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.15 // Memicu animasi saat elemen 15% terlihat di layar
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            } else {
                entry.target.classList.remove("active");
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
    revealElements.forEach(el => observer.observe(el));
});


/* =========================
   2. RSVP & KOMENTAR SYSTEM
========================= */
const form = document.getElementById("rsvpForm");
const messageList = document.getElementById("messageList");

let comments = JSON.parse(localStorage.getItem("comments")) || [];

if (messageList) {
    renderComments();
}

if (form) {
    form.addEventListener("submit", function(e){
        e.preventDefault();

        const nama = document.getElementById("nama").value.trim();
        const kehadiran = document.getElementById("status").value;
        const pesan = document.getElementById("pesan").value.trim();

        if (!nama || !kehadiran || !pesan) {
            alert("Mohon isi semua kolom!");
            return;
        }

        const data = {
            nama: nama,
            kehadiran: kehadiran,
            pesan: pesan,
            waktu: new Date().toLocaleString("id-ID")
        };

        comments.unshift(data);
        localStorage.setItem("comments", JSON.stringify(comments));

        renderComments();
        form.reset();

        // Auto scroll halus ke section ucapan setelah submit
        const ucapanSection = document.getElementById("ucapan");
        if (ucapanSection) {
            ucapanSection.scrollIntoView({ behavior: "smooth" });
        }
    });
}

function renderComments(){
    if (!messageList) return;

    messageList.innerHTML = "";

    if (comments.length === 0) {
        messageList.innerHTML = `<p style="text-align:center; color:#888; padding:15px;">Belum ada ucapan.</p>`;
        return;
    }

    comments.forEach(item => {
        const statusClass = item.kehadiran === "Hadir" ? "status-hadir" : "status-tidak";

        messageList.innerHTML += `
        <div class="comment">
            <div class="comment-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <div class="comment-name" style="margin-bottom: 0;">${item.nama}</div>
                <div class="comment-status ${statusClass}">${item.kehadiran}</div>
            </div>
            <div class="comment-message">${item.pesan}</div>
            <div class="comment-time">${item.waktu}</div>
        </div>
        `;
    });
}


/* =========================
   3. FUNGSI SALIN TEKS (REKENING / E-WALLET)
========================= */
function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert("Berhasil disalin: " + text);
    }).catch(err => {
        console.error("Gagal menyalin text: ", err);
    });
}


/* =========================
   4. AUTO DETECT DEVICE CALENDAR (TARGET: 6 DESEMBER 2026)
========================= */
function addToCalendar() {
    const eventTitle = "Pernikahan Mempelai";
    const eventDetails = "Acara Pernikahan kami. Mohon doa restunya.";
    const eventLocation = "Jl. Arteri Ringroad, Asam Kumbang, Medan Selayang";
    
    // Target 6 Desember 2026
    const startTime = "20261206T080000Z";
    const endTime = "20261206T210000Z";

    const isIOS = /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent) && !window.MSStream;

    if (isIOS) {
        const icsContent = 
            "BEGIN:VCALENDAR\n" +
            "VERSION:2.0\n" +
            "BEGIN:VEVENT\n" +
            "SUMMARY:" + eventTitle + "\n" +
            "DESCRIPTION:" + eventDetails + "\n" +
            "LOCATION:" + eventLocation + "\n" +
            "DTSTART:" + startTime + "\n" +
            "DTEND:" + endTime + "\n" +
            "END:VEVENT\n" +
            "END:VCALENDAR";

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', 'pernikahan.ics');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(eventDetails)}&location=${encodeURIComponent(eventLocation)}`;
        window.open(googleUrl, '_blank');
    }
}


/* =========================
   5. GALERI AUTO SCROLL
========================= */
const track = document.getElementById("galeriTrack");
if (track) {
    let scrollAmount = 0;
    function autoScrollGallery() {
        scrollAmount += 1;
        if (scrollAmount >= track.scrollWidth - track.clientWidth) {
            scrollAmount = 0;
        }
        track.scrollTo({
            left: scrollAmount,
            behavior: "smooth"
        });
    }

    let autoScrollInterval = setInterval(autoScrollGallery, 30);

    track.addEventListener("mouseenter", () => clearInterval(autoScrollInterval));
    track.addEventListener("mouseleave", () => {
        autoScrollInterval = setInterval(autoScrollGallery, 30);
    });
}


/* =========================
   6. SLIDESHOW IPOD
========================= */
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.ipod-slide');
let slideInterval;

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    currentSlideIndex = (index + slides.length) % slides.length;
    slides[currentSlideIndex].classList.add('active');
}

function changeSlide(direction) {
    showSlide(currentSlideIndex + direction);
    resetInterval();
}

function startSlideshow() {
    slideInterval = setInterval(() => {
        showSlide(currentSlideIndex + 1);
    }, 3500); 
}

function resetInterval() {
    clearInterval(slideInterval);
    startSlideshow();
}


/* =========================
   7. KONTROL MUSIK & AUTOPLAY
========================= */
function toggleMusic() {
    const music = document.getElementById('bgMusic');
    const vinyl = document.getElementById('vinylRecord');
    const playPauseIcon = document.getElementById('playPauseIcon');

    if (music.paused) {
        music.play().then(() => {
            vinyl.classList.add('playing');
            playPauseIcon.innerHTML = '&#10074;&#10074;';
        }).catch(err => {
            console.log("Gagal memutar musik:", err);
        });
    } else {
        music.pause();
        vinyl.classList.remove('playing');
        playPauseIcon.innerHTML = '&#9658;';
    }
}

function initAutoplay() {
    const music = document.getElementById('bgMusic');
    const vinyl = document.getElementById('vinylRecord');
    const playPauseIcon = document.getElementById('playPauseIcon');

    if (!music) return;

    music.loop = true;
    let playPromise = music.play();

    if (playPromise !== undefined) {
        playPromise.then(() => {
            vinyl.classList.add('playing');
            playPauseIcon.innerHTML = '&#10074;&#10074;';
        }).catch(error => {
            const triggerPlay = () => {
                music.play().then(() => {
                    vinyl.classList.add('playing');
                    playPauseIcon.innerHTML = '&#10074;&#10074;';
                    document.removeEventListener('click', triggerPlay);
                    document.removeEventListener('touchstart', triggerPlay);
                    document.removeEventListener('scroll', triggerPlay);
                }).catch(e => console.log("Menunggu interaksi pengguna..."));
            };

            document.addEventListener('click', triggerPlay);
            document.addEventListener('touchstart', triggerPlay);
            document.addEventListener('scroll', triggerPlay);
        });
    }
}

function toggleGaleriGrid() {
    const grid = document.getElementById('galeriGrid');
    const toggleText = document.getElementById('toggleText');
    const toggleBtn = document.getElementById('toggleGaleriBtn');

    if (!grid) return;

    grid.classList.toggle('hidden-grid');
    toggleBtn.classList.toggle('active');

    if (grid.classList.contains('hidden-grid')) {
        toggleText.textContent = "Lihat Foto Lainnya";
    } else {
        toggleText.textContent = "Tutup Foto";
    }
}


/* =========================
   8. TOGGLE DROPDOWN (E-WALLET & KADO)
========================= */
function toggleDropdown(contentId, headerElement) {
    const content = document.getElementById(contentId);
    if (!content) return;

    content.classList.toggle("show");
    headerElement.classList.toggle("active");

    if (content.style.maxHeight) {
        content.style.maxHeight = null;
    } else {
        content.style.maxHeight = content.scrollHeight + "px";
    }
}


/* =========================
   9. COUNTDOWN TIMER (MENUJU 6 DESEMBER 2026)
========================= */
document.addEventListener("DOMContentLoaded", function () {
    const targetDate = new Date("December 6, 2026 00:00:00").getTime();

    const countdownTimer = setInterval(function() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const daysElem = document.getElementById("days");
        const hoursElem = document.getElementById("hours");
        const minutesElem = document.getElementById("minutes");
        const secondsElem = document.getElementById("seconds");

        if (daysElem && hoursElem && minutesElem && secondsElem) {
            daysElem.innerText = String(Math.max(0, days)).padStart(2, '0');
            hoursElem.innerText = String(Math.max(0, hours)).padStart(2, '0');
            minutesElem.innerText = String(Math.max(0, minutes)).padStart(2, '0');
            secondsElem.innerText = String(Math.max(0, seconds)).padStart(2, '0');
        }

        if (distance < 0) {
            clearInterval(countdownTimer);
            if (daysElem) daysElem.innerText = "00";
            if (hoursElem) hoursElem.innerText = "00";
            if (minutesElem) minutesElem.innerText = "00";
            if (secondsElem) secondsElem.innerText = "00";
        }
    }, 1000);

    if (slides.length > 0) {
        startSlideshow();
    }
    initAutoplay(); 
});

function toggleGaleriGrid() {
    const grid = document.getElementById('galeriGrid');
    const btn = document.getElementById('toggleGaleriBtn');
    const toggleText = document.getElementById('toggleText');
    
    // Membuka atau menutup sisa foto
    grid.classList.toggle('show-all');
    btn.classList.toggle('active');
    
    if (grid.classList.contains('show-all')) {
        toggleText.textContent = "Tutup Sembunyikan";
    } else {
        toggleText.textContent = "Lihat Foto Lainnya";
    }
}
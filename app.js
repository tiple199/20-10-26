/**
 * 20/10 VIETNAMESE WOMEN'S DAY - LUXURY BOUQUET EXPERIENCE
 */

document.addEventListener('DOMContentLoaded', () => {
  initPetalsCanvas();
  initAudioEngine();
  initViewControls();
  initHotspotPins();
  initGreetingCard();
  initPeaceModal();
});

/* ==========================================================
   1. AMBIENT PETALS & FAIRY DUST CANVAS (FULLSCREEN)
   ========================================================== */
let triggerPetalShower = null;

function initPetalsCanvas() {
  const canvas = document.getElementById('petalsCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const maxAmbient = 24;

  class AmbientParticle {
    constructor(isBurst = false, x, y) {
      this.reset(isBurst, x, y);
    }

    reset(isBurst = false, x, y) {
      this.type = Math.random() < 0.6 ? 'petal' : Math.random() < 0.85 ? 'heart' : 'sparkle';
      if (isBurst) {
        this.x = x !== undefined ? x : width / 2;
        this.y = y !== undefined ? y : height / 2;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 7 + 2.5;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - 1.5;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.012;
      } else {
        this.x = Math.random() * width;
        this.y = -20;
        this.vx = (Math.random() - 0.5) * 1.2 + 0.2;
        this.vy = Math.random() * 1.4 + 0.9;
        this.life = 1;
        this.decay = 0;
      }

      this.size = Math.random() * 12 + 8;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.04;
      this.color = Math.random() < 0.45 ? '#fb7185' : Math.random() < 0.75 ? '#fda4af' : '#fbbf24';
      this.opacity = Math.random() * 0.6 + 0.35;
    }

    update() {
      if (this.decay > 0) {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.06;
        this.life -= this.decay;
        this.rotation += this.rotSpeed;
        return this.life > 0;
      }

      this.x += this.vx + Math.sin(this.y * 0.012) * 0.6;
      this.y += this.vy;
      this.rotation += this.rotSpeed;

      if (this.y > height + 25) this.reset(false);
      return true;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = Math.max(0, this.opacity * this.life);

      if (this.type === 'petal') {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size, this.size / 3, 0, this.size);
        ctx.bezierCurveTo(this.size, this.size / 3, this.size / 2, -this.size / 2, 0, 0);
        ctx.fill();
      } else if (this.type === 'heart') {
        ctx.fillStyle = this.color;
        const s = this.size * 0.55;
        ctx.beginPath();
        ctx.moveTo(0, s / 4);
        ctx.quadraticCurveTo(0, 0, s / 4, 0);
        ctx.quadraticCurveTo(s / 2, 0, s / 2, s / 4);
        ctx.quadraticCurveTo(s / 2, 0, (s * 3) / 4, 0);
        ctx.quadraticCurveTo(s, 0, s, s / 4);
        ctx.quadraticCurveTo(s, s / 2, (s * 3) / 4, (s * 3) / 4);
        ctx.lineTo(s / 2, s);
        ctx.lineTo(s / 4, (s * 3) / 4);
        ctx.quadraticCurveTo(0, s / 2, 0, s / 4);
        ctx.fill();
      } else {
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          ctx.lineTo(Math.cos((i * Math.PI) / 2) * this.size, Math.sin((i * Math.PI) / 2) * this.size);
          ctx.lineTo(
            Math.cos((i * Math.PI) / 2 + Math.PI / 4) * (this.size / 3),
            Math.sin((i * Math.PI) / 2 + Math.PI / 4) * (this.size / 3)
          );
        }
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
    }
  }

  for (let i = 0; i < maxAmbient; i++) {
    const p = new AmbientParticle();
    p.y = Math.random() * height;
    particles.push(p);
  }

  triggerPetalShower = function (count = 55, x, y) {
    for (let i = 0; i < count; i++) {
      particles.push(new AmbientParticle(true, x, y));
    }
  };

  function render() {
    ctx.clearRect(0, 0, width, height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const active = particles[i].update();
      if (!active) {
        particles.splice(i, 1);
      } else {
        particles[i].draw();
      }
    }
    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================
   2. SYNTHESIZED WEB AUDIO (RANDOM HEARTWARMING SONG JUKEBOX)
   ========================================================== */
let audioCtx = null;
let isMusicActive = false;
let musicTimeout = null;
let currentSongIndex = -1;

const NOTE_FREQ = {
  'G2': 98.00,  'A2': 110.00, 'B2': 123.47,
  'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'E3': 164.81, 'F3': 174.61, 'F#3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'A3': 220.00, 'Bb3': 233.08, 'B3': 246.94,
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'Bb4': 466.16, 'B4': 493.88,
  'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'A5': 880.00, 'B5': 987.77,
  'C6': 1046.50
};

const songCatalog = [
  {
    title: 'Nhật Ký Của Mẹ',
    artist: 'Nguyễn Văn Chung',
    tempo: 440,
    notes: [
      { note: 'E4', dur: 1 }, { note: 'A4', dur: 1 }, { note: 'B4', dur: 1 }, { note: 'C5', dur: 2 },
      { note: 'B4', dur: 1 }, { note: 'A4', dur: 1 }, { note: 'E4', dur: 2 },
      { note: 'F4', dur: 1 }, { note: 'A4', dur: 1 }, { note: 'C5', dur: 1 }, { note: 'B4', dur: 2 },
      { note: 'A4', dur: 1 }, { note: 'G4', dur: 1 }, { note: 'E4', dur: 2 },
      { note: 'D4', dur: 1 }, { note: 'F4', dur: 1 }, { note: 'A4', dur: 1 }, { note: 'G4', dur: 2 },
      { note: 'F4', dur: 1 }, { note: 'E4', dur: 1 }, { note: 'C4', dur: 2 },
      { note: 'D4', dur: 1 }, { note: 'E4', dur: 1 }, { note: 'F4', dur: 1 }, { note: 'E4', dur: 1 },
      { note: 'D4', dur: 1 }, { note: 'C4', dur: 1 }, { note: 'B3', dur: 1 }, { note: 'A3', dur: 3 },
    ],
    bassChords: [
      ['A3', 'C4', 'E4'], ['F3', 'A3', 'C4'], ['D3', 'F3', 'A3'], ['E3', 'G#3', 'B3'], ['A3', 'C4', 'E4']
    ]
  },
  {
    title: 'Gặp Mẹ Trong Mơ',
    artist: 'Nhạc Mông Cổ / Lời Việt',
    tempo: 420,
    notes: [
      { note: 'A4', dur: 1 }, { note: 'D5', dur: 2 }, { note: 'E5', dur: 1 }, { note: 'F5', dur: 2 },
      { note: 'E5', dur: 1 }, { note: 'D5', dur: 2 }, { note: 'A4', dur: 2 },
      { note: 'F4', dur: 1 }, { note: 'G4', dur: 1 }, { note: 'A4', dur: 2 }, { note: 'D5', dur: 2 },
      { note: 'C5', dur: 1 }, { note: 'A4', dur: 1 }, { note: 'G4', dur: 2 },
      { note: 'A4', dur: 1 }, { note: 'D5', dur: 2 }, { note: 'F5', dur: 1 }, { note: 'G5', dur: 2 },
      { note: 'F5', dur: 1 }, { note: 'E5', dur: 1 }, { note: 'D5', dur: 3 },
      { note: 'D5', dur: 1 }, { note: 'E5', dur: 1 }, { note: 'F5', dur: 2 }, { note: 'E5', dur: 1 },
      { note: 'D5', dur: 1 }, { note: 'A4', dur: 2 }, { note: 'D5', dur: 3 },
    ],
    bassChords: [
      ['D3', 'F3', 'A3'], ['Bb3', 'D4', 'F4'], ['G3', 'Bb3', 'D4'], ['A3', 'C#4', 'E4'], ['D3', 'F3', 'A3']
    ]
  },
  {
    title: 'Bông Hồng Cài Áo',
    artist: 'Phạm Thế Mỹ',
    tempo: 460,
    notes: [
      { note: 'C4', dur: 1 }, { note: 'E4', dur: 1 }, { note: 'G4', dur: 2 }, { note: 'A4', dur: 1 },
      { note: 'G4', dur: 1 }, { note: 'E4', dur: 1 }, { note: 'G4', dur: 2 },
      { note: 'A4', dur: 1 }, { note: 'C5', dur: 2 }, { note: 'D5', dur: 1 }, { note: 'C5', dur: 2 },
      { note: 'A4', dur: 1 }, { note: 'G4', dur: 1 }, { note: 'E4', dur: 2 },
      { note: 'G4', dur: 1 }, { note: 'A4', dur: 1 }, { note: 'C5', dur: 2 }, { note: 'E5', dur: 2 },
      { note: 'D5', dur: 1 }, { note: 'C5', dur: 1 }, { note: 'A4', dur: 2 },
      { note: 'C5', dur: 1 }, { note: 'A4', dur: 1 }, { note: 'G4', dur: 2 }, { note: 'E4', dur: 1 },
      { note: 'D4', dur: 1 }, { note: 'E4', dur: 1 }, { note: 'C4', dur: 3 },
    ],
    bassChords: [
      ['C3', 'E3', 'G3'], ['A2', 'C3', 'E3'], ['F3', 'A3', 'C4'], ['G3', 'B3', 'D4'], ['C3', 'E3', 'G3']
    ]
  },
  {
    title: 'River Flows In You',
    artist: 'Yiruma (Piano)',
    tempo: 380,
    notes: [
      { note: 'A4', dur: 1 }, { note: 'G#4', dur: 1 }, { note: 'A4', dur: 2 }, { note: 'E4', dur: 2 },
      { note: 'A4', dur: 1 }, { note: 'B4', dur: 1 }, { note: 'C#5', dur: 2 }, { note: 'B4', dur: 1 },
      { note: 'A4', dur: 2 }, { note: 'C#5', dur: 1 }, { note: 'D5', dur: 1 }, { note: 'E5', dur: 2 },
      { note: 'D5', dur: 1 }, { note: 'C#5', dur: 1 }, { note: 'B4', dur: 2 }, { note: 'A4', dur: 1 },
      { note: 'B4', dur: 3 }, { note: 'A4', dur: 1 }, { note: 'G#4', dur: 1 }, { note: 'A4', dur: 2 },
      { note: 'E4', dur: 2 }, { note: 'C#5', dur: 1 }, { note: 'B4', dur: 1 }, { note: 'A4', dur: 2 },
      { note: 'G#4', dur: 1 }, { note: 'A4', dur: 3 },
    ],
    bassChords: [
      ['A2', 'E3', 'A3'], ['F#3', 'A3', 'C#4'], ['D3', 'F#3', 'A3'], ['E3', 'G#3', 'B3'], ['A2', 'E3', 'A3']
    ]
  },
  {
    title: 'Canon In D Major',
    artist: 'Johann Pachelbel',
    tempo: 400,
    notes: [
      { note: 'F#4', dur: 2 }, { note: 'E4', dur: 2 }, { note: 'D4', dur: 2 }, { note: 'C#4', dur: 2 },
      { note: 'B3', dur: 2 }, { note: 'A3', dur: 2 }, { note: 'B3', dur: 2 }, { note: 'C#4', dur: 2 },
      { note: 'D4', dur: 2 }, { note: 'F#4', dur: 2 }, { note: 'A4', dur: 2 }, { note: 'G4', dur: 2 },
      { note: 'F#4', dur: 2 }, { note: 'D4', dur: 2 }, { note: 'F#4', dur: 2 }, { note: 'E4', dur: 2 },
      { note: 'D4', dur: 1 }, { note: 'C#4', dur: 1 }, { note: 'D4', dur: 1 }, { note: 'B3', dur: 1 },
      { note: 'A3', dur: 1 }, { note: 'F#4', dur: 1 }, { note: 'G4', dur: 1 }, { note: 'A4', dur: 1 },
      { note: 'B4', dur: 2 }, { note: 'A4', dur: 1 }, { note: 'G4', dur: 1 }, { note: 'F#4', dur: 3 },
    ],
    bassChords: [
      ['D3', 'F#3', 'A3'], ['A2', 'C#3', 'E3'], ['B2', 'D3', 'F#3'], ['F#3', 'A3', 'C#4'],
      ['G3', 'B3', 'D4'], ['D3', 'F#3', 'A3'], ['G3', 'B3', 'D4'], ['A3', 'C#4', 'E4']
    ]
  }
];

function initAudioEngine() {
  const btnMusic = document.getElementById('btn-toggle-music');
  if (!btnMusic) return;

  function ensureAudio() {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioCtxClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  btnMusic.addEventListener('click', () => {
    ensureAudio();
    if (isMusicActive) {
      stopMusic();
      btnMusic.classList.remove('playing');
      btnMusic.setAttribute('title', 'Bật bài hát ngẫu nhiên');
      showToast('Đã dừng nhạc 🔇', 'fa-volume-xmark');
    } else {
      // Pick a random song distinct from the previous one
      let nextIdx;
      do {
        nextIdx = Math.floor(Math.random() * songCatalog.length);
      } while (songCatalog.length > 1 && nextIdx === currentSongIndex);

      currentSongIndex = nextIdx;
      const song = songCatalog[currentSongIndex];

      playRandomSong(song);
      btnMusic.classList.add('playing');
      btnMusic.setAttribute('title', `Đang phát: ${song.title} (Bấm để dừng)`);
      showToast(`Đang phát ngẫu nhiên: 🎵 ${song.title} (${song.artist})`, 'fa-music');
      if (triggerPetalShower) triggerPetalShower(35);
    }
    isMusicActive = !isMusicActive;
  });
}

// Warm Acoustic Piano Synthesizer Voice
function playPianoNote(freq, durSeconds = 0.9, gainLevel = 0.08) {
  if (!audioCtx || audioCtx.state !== 'running') return;
  try {
    const now = audioCtx.currentTime;

    // 1. Primary body oscillator (triangle for acoustic warmth)
    const osc1 = audioCtx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, now);

    // 2. Overtone oscillator (sine with delicate +4 cents shimmer)
    const osc2 = audioCtx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq, now);
    osc2.detune.setValueAtTime(4, now);

    // 3. Lowpass filter for smooth grand piano resonance
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2400, now);
    filter.frequency.exponentialRampToValueAtTime(700, now + durSeconds);

    // 4. Velvet Gain Envelope
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(gainLevel, now + 0.018); // hammer strike
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durSeconds);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + durSeconds);
    osc2.stop(now + durSeconds);
  } catch (e) {
    console.warn(e);
  }
}

// Gentle arpeggiated bass chord
function playChord(chordNotes, durSeconds = 1.4, gainLevel = 0.035) {
  chordNotes.forEach((noteName, idx) => {
    const freq = NOTE_FREQ[noteName];
    if (freq) {
      setTimeout(() => {
        if (isMusicActive) playPianoNote(freq, durSeconds, gainLevel);
      }, idx * 28);
    }
  });
}

function playRandomSong(song) {
  stopMusic();

  let noteIdx = 0;
  let chordIdx = 0;
  const notes = song.notes;
  const chords = song.bassChords;
  const baseTempo = song.tempo;

  function scheduleNextNote() {
    if (!isMusicActive) return;

    const current = notes[noteIdx];
    const freq = NOTE_FREQ[current.note];
    const durSec = (current.dur * baseTempo * 1.5) / 1000;

    if (freq) {
      playPianoNote(freq, durSec, 0.08);
    }

    // Accompany with gentle chord every 4 notes or on measure starts
    if (noteIdx % 4 === 0 && chords.length > 0) {
      playChord(chords[chordIdx], 1.6, 0.032);
      chordIdx = (chordIdx + 1) % chords.length;
    }

    noteIdx = (noteIdx + 1) % notes.length;

    // Schedule next note with exact tempo
    const delayMs = current.dur * baseTempo;
    musicTimeout = setTimeout(scheduleNextNote, delayMs);
  }

  scheduleNextNote();
}

function stopMusic() {
  if (musicTimeout) {
    clearTimeout(musicTimeout);
    musicTimeout = null;
  }
}

function playSound(type = 'chime') {
  if (!audioCtx) {
    const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioCtxClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const now = audioCtx.currentTime;
  const notes = type === 'fanfare' ? [523.25, 659.25, 783.99, 1046.5] : [587.33, 739.99, 880.0];

  notes.forEach((freq, idx) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + idx * 0.09);

    gain.gain.setValueAtTime(0.001, now + idx * 0.09);
    gain.gain.exponentialRampToValueAtTime(0.12, now + idx * 0.09 + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.09 + 0.6);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now + idx * 0.09);
    osc.stop(now + idx * 0.09 + 0.6);
  });
}

/* ==========================================================
   3. VIEW CONTROLS (NGẮM HOA TRƯỚC -> MỞ THIỆP CHÚC)
   ========================================================== */
function initViewControls() {
  const frame = document.getElementById('appFrame');
  const btnToggleTop = document.getElementById('btn-toggle-view');
  const viewText = document.getElementById('viewModeText');
  const viewIcon = document.getElementById('viewModeIcon');

  const btnOpenCard = document.getElementById('btnOpenCard');
  const btnMinimizeCard = document.getElementById('btnMinimizeCard');

  function updateViewUI() {
    const isViewOnly = frame.classList.contains('view-only');
    if (viewText) {
      viewText.textContent = isViewOnly ? 'Xem Thiệp' : 'Ngắm Hoa';
    }
    if (viewIcon) {
      viewIcon.className = isViewOnly ? 'fa-solid fa-envelope-open-text' : 'fa-solid fa-eye';
    }
  }

  // Open Card from Hero Button
  if (btnOpenCard && frame) {
    btnOpenCard.addEventListener('click', () => {
      frame.classList.remove('view-only');
      updateViewUI();
      playSound('fanfare');
      if (triggerPetalShower) triggerPetalShower(35);
      showToast('Đã mở thiệp chúc mừng 20/10 💌', 'fa-envelope-open-text');
    });
  }

  // Minimize Card back to Flower View
  if (btnMinimizeCard && frame) {
    btnMinimizeCard.addEventListener('click', () => {
      frame.classList.add('view-only');
      updateViewUI();
      playSound('chime');
      showToast('Đang ngắm hoa tuyệt đẹp 🌹✨', 'fa-eye');
    });
  }

  // Top Bar Toggle
  if (btnToggleTop && frame) {
    btnToggleTop.addEventListener('click', () => {
      frame.classList.toggle('view-only');
      const isViewOnly = frame.classList.contains('view-only');
      updateViewUI();
      playSound('chime');
      showToast(
        isViewOnly
          ? 'Đã ẩn thiệp để ngắm trọn vẹn bó hoa tuyệt đẹp! 🌹✨'
          : 'Đã mở thiệp chúc mừng 💌',
        isViewOnly ? 'fa-eye' : 'fa-envelope-open-text'
      );
    });
  }

  updateViewUI();
}

/* ==========================================================
   4. HOTSPOT ANNOTATION PINS ON THE BOUQUET
   ========================================================== */
function initHotspotPins() {
  const pins = document.querySelectorAll('.pin-dot');
  pins.forEach((pin) => {
    pin.addEventListener('click', (e) => {
      e.stopPropagation();
      const title = pin.getAttribute('data-title');
      const desc = pin.getAttribute('data-desc');

      const rect = pin.getBoundingClientRect();
      if (triggerPetalShower) {
        triggerPetalShower(35, rect.left + rect.width / 2, rect.top + rect.height / 2);
      }
      playSound('fanfare');
      showToast(`${title}: ${desc}`, 'fa-sparkles');
    });
  });
}

/* ==========================================================
   5. SINGLE GREETING CARD (VOICE & COPY)
   ========================================================== */
function initGreetingCard() {
  const salutation = document.getElementById('salutationText');
  const msg = document.getElementById('messageText');
  const sign = document.getElementById('signatureText');

  // Voice Read
  const btnVoice = document.getElementById('btn-voice-read');
  if (btnVoice) {
    btnVoice.addEventListener('click', () => {
      if (!('speechSynthesis' in window)) {
        showToast('Trình duyệt không hỗ trợ đọc tự động', 'fa-circle-exclamation');
        return;
      }
      window.speechSynthesis.cancel();
      const text = `${salutation ? salutation.textContent : ''}. ${msg ? msg.textContent : ''}`;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.95;

      utterance.onstart = () => {
        showToast('Đang phát giọng đọc lời chúc 🗣️', 'fa-volume-high');
        playSound('chime');
      };
      window.speechSynthesis.speak(utterance);
    });
  }

  // Copy to clipboard
  const btnCopy = document.getElementById('btn-copy-wish');
  if (btnCopy) {
    btnCopy.addEventListener('click', () => {
      const salText = salutation ? salutation.textContent : 'Kính Gửi Người Phụ Nữ Đáng Quý,';
      const msgText = msg ? msg.textContent : '';
      const signText = sign ? sign.textContent : '';
      const full = `🌸 CHÚC MỪNG NGÀY PHỤ NỮ VIỆT NAM 20/10 🌸\n\n${salText}\n${msgText}\n\n${signText}`;

      navigator.clipboard.writeText(full).then(() => {
        showToast('Đã sao chép lời chúc thành công! Bạn có thể dán vào Zalo/Tin nhắn 📋', 'fa-check');
        playSound('fanfare');
        if (triggerPetalShower) triggerPetalShower(35);
      });
    });
  }
}

/* ==========================================================
   6. PEACEFUL BLESSINGS MODAL (ĐỜI THỰC, SÂU SẮC, CHO MẸ & GIA ĐÌNH)
   ========================================================== */
const peaceBlessingsList = [
  {
    title: 'Sức Khỏe Dồi Dào & Thảnh Thơi An Yên',
    desc: '"Cảm ơn những hy sinh, chăm sóc thầm lặng bao năm qua. Chúc bạn/mẹ luôn dồi dào sức khỏe, giấc ngủ sâu ngon, mỗi sáng thức dậy với tâm hồn thanh thản, không còn những muộn phiền âu lo."',
  },
  {
    title: 'Gia Đình Ấm Áp & Đầy Ắp Tiếng Cười',
    desc: '"Cầu chúc cho mái ấm gia đình luôn ngập tràn niềm vui, hòa thuận và yêu thương. Chúc người phụ nữ của gia đình luôn là bến đỗ bình yên, ấm áp và luôn được trân quý mỗi ngày."',
  },
  {
    title: 'Tâm Hồn An Nhiên, Vạn Sự Hanh Thông',
    desc: '"Cuộc đời dẫu có thăng trầm hay bộn bề, chúc bạn luôn giữ được sự an nhiên trong tâm hồn, bớt đi những vất vả, đón nhận nhiều niềm vui giản dị nhưng sâu sắc."',
  },
  {
    title: 'Hạnh Phúc Trọn Vẹn & Được Nâng Niu',
    desc: '"Người phụ nữ luôn xứng đáng được yêu thương, chở che và trân trọng. Chúc bạn có một ngày 20/10 thật nhiều hoa, nhiều nụ cười và luôn cảm nhận được sự ấm áp từ những người thân thương."',
  },
  {
    title: 'Bình An Trong Từng Phút Giây',
    desc: '"Mong rằng mọi điều tốt đẹp nhất sẽ luôn đồng hành cùng bạn. Cầu chúc sức khỏe, may mắn và sự bình yên luôn hiện diện bên bạn và những người thân yêu."',
  },
];

function initPeaceModal() {
  const peaceModal = document.getElementById('peaceModal');
  const btnOpenPeace = document.getElementById('btnOpenPeace');
  const btnClosePeace = document.getElementById('btnClosePeace');
  const btnNextPeace = document.getElementById('btnNextPeace');
  const btnCopyPeace = document.getElementById('btnCopyPeace');
  const peaceTitle = document.getElementById('peaceTitle');
  const peaceDesc = document.getElementById('peaceDesc');

  let curIdx = 0;

  function renderPeace(idx) {
    const item = peaceBlessingsList[idx];
    if (peaceTitle) peaceTitle.textContent = item.title;
    if (peaceDesc) peaceDesc.textContent = item.desc;
  }

  // Open Modal
  if (btnOpenPeace) {
    btnOpenPeace.addEventListener('click', () => {
      peaceModal.classList.add('show');
      renderPeace(curIdx);
      playSound('fanfare');
      if (triggerPetalShower) triggerPetalShower(35);
    });
  }

  // Close Modal
  if (btnClosePeace) {
    btnClosePeace.addEventListener('click', () => peaceModal.classList.remove('show'));
  }

  // Next Blessing
  if (btnNextPeace) {
    btnNextPeace.addEventListener('click', () => {
      curIdx = (curIdx + 1) % peaceBlessingsList.length;
      renderPeace(curIdx);
      playSound('chime');
      showToast('Đã mở lời chúc bình an mới! 🕊️', 'fa-dove');
    });
  }

  // Copy Blessing
  if (btnCopyPeace) {
    btnCopyPeace.addEventListener('click', () => {
      const item = peaceBlessingsList[curIdx];
      const text = `🕊️ LỜI CHÚC BÌNH AN 20/10: ${item.title} 🕊️\n\n${item.desc}`;
      navigator.clipboard.writeText(text).then(() => {
        showToast('Đã sao chép lời chúc bình an! 📋', 'fa-check');
        playSound('fanfare');
      });
    });
  }

  // Close on backdrop click & Escape
  if (peaceModal) {
    peaceModal.addEventListener('click', (e) => {
      if (e.target === peaceModal) {
        peaceModal.classList.remove('show');
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && peaceModal) {
      peaceModal.classList.remove('show');
    }
  });

  // Shower Petals Button
  const btnShowerPetals = document.getElementById('btnShowerPetals');
  if (btnShowerPetals) {
    btnShowerPetals.addEventListener('click', (e) => {
      const rect = btnShowerPetals.getBoundingClientRect();
      if (triggerPetalShower) {
        triggerPetalShower(70, rect.left + rect.width / 2, rect.top);
      }
      playSound('fanfare');
      showToast('Tung mưa ngàn cánh hoa hồng & tim chúc mừng! 🌸💖', 'fa-wand-magic-sparkles');
    });
  }
}

/* ==========================================================
   TOAST HELPER
   ========================================================== */
function showToast(message, icon = 'fa-heart') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span class="toast-icon"><i class="fa-solid ${icon}"></i></span><span>${escapeHtml(
    message
  )}</span>`;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3200);
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

const menuBtn = document.querySelector("#menu-btn");
const nav = document.querySelector("#nav");
const temaBtn = document.querySelector("#tema-btn");

menuBtn.addEventListener("click", () => {
  const buka = nav.classList.toggle("buka");
  menuBtn.setAttribute("aria-expanded", buka);
});

function setTema(gelap) {
  document.body.classList.toggle("gelap", gelap);
  temaBtn.textContent = gelap ? "Terang" : "Gelap";
  temaBtn.setAttribute("aria-pressed", gelap);
}

let tersimpan = false;
try {
  tersimpan = localStorage.getItem("tema") === "gelap";
} catch {}
setTema(tersimpan);

temaBtn.addEventListener("click", () => {
  const gelap = !document.body.classList.contains("gelap");
  setTema(gelap);
  try {
    localStorage.setItem("tema", gelap ? "gelap" : "terang");
  } catch {}
});

const el = (tag, kelas, teks) => {
  const e = document.createElement(tag);
  if (kelas) e.className = kelas;
  if (teks) e.textContent = teks;
  return e;
};

function buatKartu(r) {
  const kartu = el("article", "kartu");
  const chip = el("div", "chip-baris");
  [r.kategori, `${r.waktu} menit`, r.level].forEach(t => chip.append(el("span", "chip", t)));

  const rinci = el("details");
  rinci.append(el("summary", "", "Lihat bahan dan langkah"));
  rinci.append(el("h4", "", "Bahan"), el("p", "", r.bahan));

  if (r.langkah) {
    const urut = el("ol");
    r.langkah.forEach(l => urut.append(el("li", "", l)));
    rinci.append(el("h4", "", "Langkah"), urut);
  }

  const foto = el("img", "foto");
  foto.src = r.gambar;
  foto.alt = `Ilustrasi ${r.nama}`;
  foto.width = 400;
  foto.height = 300;
  foto.loading = "lazy";

  kartu.append(foto, el("h3", "", r.nama), chip, el("p", "", r.ringkas), rinci);
  return kartu;
}

async function muat(status, tampil) {
  status.textContent = "Memuat resep...";
  try {
    const res = await fetch("data.json");
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    if (data.length === 0) {
      status.textContent = "Belum ada resep yang tersedia.";
      return;
    }
    status.textContent = "";
    tampil(data);
  } catch {
    status.textContent = "Resep gagal dimuat. Periksa koneksi, lalu coba lagi.";
    const ulang = el("button", "tombol kecil", "Coba lagi");
    ulang.type = "button";
    ulang.addEventListener("click", () => muat(status, tampil));
    status.append(ulang);
  }
}

const unggulan = document.querySelector("#unggulan");
if (unggulan) {
  muat(document.querySelector("#status-unggulan"), data => {
    unggulan.replaceChildren(...data.filter(r => r.unggulan).map(buatKartu));
  });
}

const daftar = document.querySelector("#daftar");
if (daftar) {
  const cari = document.querySelector("#cari");
  const pilih = document.querySelector("#kategori");
  const jumlah = document.querySelector("#jumlah");
  let semua = [];

  const tampilkan = () => {
    const kata = cari.value.trim().toLowerCase();
    const hasil = semua.filter(r =>
      (pilih.value === "semua" || r.kategori === pilih.value) &&
      `${r.nama} ${r.bahan}`.toLowerCase().includes(kata)
    );
    daftar.replaceChildren(...hasil.map(buatKartu));
    jumlah.textContent = hasil.length === 0
      ? "Tidak ada resep yang cocok. Coba kata kunci atau kategori lain."
      : `Menampilkan ${hasil.length} dari ${semua.length} resep`;
  };

  muat(document.querySelector("#status"), data => {
    semua = data;
    tampilkan();
  });

  cari.addEventListener("input", tampilkan);
  pilih.addEventListener("change", tampilkan);
  document.querySelector("#saring").addEventListener("submit", e => e.preventDefault());
}

const form = document.querySelector("#form-kontak");
if (form) {
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const aturan = {
    nama: v => v === "" ? "Nama wajib diisi." : v.length < 3 ? "Nama minimal 3 huruf." : "",
    email: v => v === "" ? "Email wajib diisi." : !emailValid.test(v) ? "Format email belum benar, contoh: nama@email.com." : "",
    pesan: v => v === "" ? "Pesan wajib diisi." : v.length < 10 ? "Pesan minimal 10 karakter." : ""
  };
  const sukses = document.querySelector("#sukses");

  const periksa = nama => {
    const input = form.elements[nama];
    const pesan = aturan[nama](input.value.trim());
    document.querySelector(`#error-${nama}`).textContent = pesan;
    input.classList.toggle("salah", pesan !== "");
    input.setAttribute("aria-invalid", pesan !== "");
    return pesan === "";
  };

  Object.keys(aturan).forEach(nama => {
    const input = form.elements[nama];
    input.addEventListener("blur", () => periksa(nama));
    input.addEventListener("input", () => {
      if (input.classList.contains("salah")) periksa(nama);
    });
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    sukses.textContent = "";
    const hasil = Object.keys(aturan).map(periksa);
    if (hasil.includes(false)) {
      form.querySelector(".salah").focus();
      return;
    }
    sukses.textContent = "Pesan terkirim. Terima kasih, kami balas secepatnya.";
    form.reset();
  });
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}

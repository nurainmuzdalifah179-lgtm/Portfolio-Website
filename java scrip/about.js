document.addEventListener('DOMContentLoaded', () => {

    const slider = document.getElementById('toggleSlider');
    const track = document.querySelector('.toggle-track');
    const body = document.body;

    let isDragging = false;
    let currentTheme = localStorage.getItem('theme') || 'default-mode'; // Muat tema dari localStorage

    // Fungsi untuk menerapkan tema
    const applyTheme = (theme) => {
        body.className = theme; // Hapus semua class lama dan ganti dengan yang baru
        localStorage.setItem('theme', theme); // Simpan tema ke localStorage

        // Geser slider ke posisi yang sesuai
        const trackWidth = track.offsetWidth;
        const sliderWidth = slider.offsetWidth;
        let newPosition = 0;

        if (theme === 'dark-mode') {
            newPosition = 5; // Posisi kiri
        } else if (theme === 'default-mode') {
            newPosition = (trackWidth / 2) - (sliderWidth / 2); // Posisi tengah
        } else if (theme === 'light-mode') {
            newPosition = trackWidth - sliderWidth - 5; // Posisi kanan
        }
        
        slider.style.left = `${newPosition}px`;
    };

    // Inisialisasi tema saat halaman dimuat
    applyTheme(currentTheme);

    // --- LOGIKA DRAG & DROP ---
    const startDrag = (e) => {
        isDragging = true;
        slider.style.cursor = 'grabbing';
        slider.style.transition = 'none'; // Matikan transisi saat drag
    };

    const drag = (e) => {
        if (!isDragging) return;

        e.preventDefault();
        
        const trackRect = track.getBoundingClientRect();
        const sliderWidth = slider.offsetWidth;
        
        // Dapatkan posisi mouse atau sentuhan
        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        
        // Hitung posisi baru slider
        let newPosition = clientX - trackRect.left - (sliderWidth / 2);
        
        // Batasi pergerakan slider agar tidak keluar dari track
        const maxPosition = trackRect.width - sliderWidth - 5;
        newPosition = Math.max(5, Math.min(newPosition, maxPosition));
        
        slider.style.left = `${newPosition}px`;
    };

    const endDrag = () => {
        if (!isDragging) return;
        
        isDragging = false;
        slider.style.cursor = 'grab';
        slider.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease'; // Aktifkan kembali transisi

        // --- LOGIKA "SNAP" KE POSISI TERDEKAT ---
        const trackWidth = track.offsetWidth;
        const sliderWidth = slider.offsetWidth;
        const sliderPosition = parseFloat(slider.style.left);
        
        // Tentukan batas untuk setiap tema
        const leftBoundary = (trackWidth / 3) - (sliderWidth / 2);
        const rightBoundary = (2 * trackWidth / 3) - (sliderWidth / 2);

        let selectedTheme;
        if (sliderPosition < leftBoundary) {
            selectedTheme = 'dark-mode';
        } else if (sliderPosition > rightBoundary) {
            selectedTheme = 'light-mode';
        } else {
            selectedTheme = 'default-mode';
        }

        applyTheme(selectedTheme);
    };

    // Event Listeners untuk mouse
    slider.addEventListener('mousedown', startDrag);
    window.addEventListener('mousemove', drag);
    window.addEventListener('mouseup', endDrag);

    // Event Listeners untuk sentuhan (mobile)
    slider.addEventListener('touchstart', startDrag);
    window.addEventListener('touchmove', drag);
    window.addEventListener('touchend', endDrag);
});
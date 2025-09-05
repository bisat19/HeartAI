document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.form-slide');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const submitBtn = document.getElementById('submit-btn');
    const progressSteps = document.querySelectorAll('.progress-step');
    const form = document.getElementById('prediction-form');

    let currentSlide = 0;

    // Fungsi untuk menampilkan slide berdasarkan indeksnya
    const showSlide = (slideIndex) => {
        // Sembunyikan semua slide terlebih dahulu
        slides.forEach(slide => {
            slide.classList.remove('active');
        });

        // Tampilkan slide yang aktif
        slides[slideIndex].classList.add('active');

        // Update progress bar
        progressSteps.forEach((step, index) => {
            if (index <= slideIndex) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        // Atur visibilitas tombol
        if (slideIndex === 0) {
            prevBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'inline-block';
        }

        if (slideIndex === slides.length - 1) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'inline-block';
        } else {
            nextBtn.style.display = 'inline-block';
            submitBtn.style.display = 'none';
        }
    };

    // Event listener untuk tombol "Selanjutnya"
    nextBtn.addEventListener('click', () => {
        if (currentSlide < slides.length - 1) {
            currentSlide++;
            showSlide(currentSlide);
        }
    });

    // Event listener untuk tombol "Sebelumnya"
    prevBtn.addEventListener('click', () => {
        if (currentSlide > 0) {
            currentSlide--;
            showSlide(currentSlide);
        }
    });

    // Event listener untuk form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Mencegah form reload halaman

        // Di sini Anda akan menambahkan logika untuk mengirim data ke model ML
        // Untuk sekarang, kita hanya akan menampilkan alert
        
        const formData = new FormData(form);
        let data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        console.log("Data yang akan dikirim:", data);
        alert('Formulir berhasil dikirim! Logika prediksi akan berjalan di sini.');
        
        // Anda bisa me-reset form jika diperlukan
        // form.reset();
        // currentSlide = 0;
        // showSlide(currentSlide);
    });

    // Inisialisasi: tampilkan slide pertama saat halaman dimuat
    showSlide(currentSlide);
});
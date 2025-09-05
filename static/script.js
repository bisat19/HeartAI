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

    // Event listener untuk form submission (INI YANG DIUBAH)
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Mencegah form reload halaman
        
        // Tampilkan loading state jika perlu
        submitBtn.innerText = 'Predicting...';
        submitBtn.disabled = true;

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Kirim data ke Flask backend
        fetch('https://psychic-enigma-v4645wp9wrgcpjqq-5000.app.github.dev/predict', { // URL Flask API Anda
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(result => {
            if (result.error) {
                alert(`An error occurred: ${result.error}`);
                submitBtn.innerText = 'Predict';
                submitBtn.disabled = false;
            } else {
                // Simpan hasil ke sessionStorage untuk diakses di halaman berikutnya
                sessionStorage.setItem('predictionResult', JSON.stringify(result));
                // Arahkan ke halaman hasil
                window.location.href = '/result';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Could not connect to the prediction service.');
            submitBtn.innerText = 'Predict';
            submitBtn.disabled = false;
        });
    });

    // Inisialisasi: tampilkan slide pertama saat halaman dimuat
    showSlide(currentSlide);
});
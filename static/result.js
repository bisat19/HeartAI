document.addEventListener('DOMContentLoaded', () => {
    // Ambil data hasil dari sessionStorage
    const resultData = sessionStorage.getItem('predictionResult');

    if (!resultData) {
        // Jika tidak ada data, kembalikan ke halaman form
        window.location.href = '/';
        return;
    }

    const results = JSON.parse(resultData);

    // Update elemen HTML dengan data hasil
    const healthPercentageEl = document.getElementById('health-percentage');
    const riskStatusEl = document.getElementById('risk-status');
    const preventionTipsEl = document.getElementById('prevention-tips');

    healthPercentageEl.textContent = results.health_percentage;
    riskStatusEl.textContent = results.risk_status;

    // Tampilkan prevention tips
    preventionTipsEl.innerHTML = ''; // Kosongkan dulu
    results.prevention_tips.forEach(tip => {
        const tipElement = document.createElement('div');
        tipElement.className = 'tip-item';
        tipElement.innerHTML = `
            <span class="icon">${tip.icon}</span>
            <span class="text">${tip.text}</span>
        `;
        preventionTipsEl.appendChild(tipElement);
    });

    // Buat Chart Lingkaran (Doughnut Chart)
    const ctx = document.getElementById('healthChart').getContext('2d');
    const healthValue = parseInt(results.health_percentage);
    const remainingValue = 100 - healthValue;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [healthValue, remainingValue],
                backgroundColor: [
                    '#D32F2F', // Warna merah untuk persentase kesehatan
                    '#F5F5F5'  // Warna abu-abu untuk sisa
                ],
                borderColor: [
                    '#D32F2F',
                    '#F5F5F5'
                ],
                borderWidth: 1,
                cutout: '80%' // Membuat lubang tengah lebih besar
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    enabled: false // Menonaktifkan tooltip saat hover
                }
            },
            events: [] // Menonaktifkan semua event interaksi
        }
    });

    // Hapus data dari sessionStorage setelah digunakan agar tidak muncul lagi jika halaman direfresh
    // sessionStorage.removeItem('predictionResult');
});
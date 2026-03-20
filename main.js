document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const themeToggle = document.getElementById('theme-toggle');
    const numbersContainer = document.getElementById('numbers-container');
    const htmlElement = document.documentElement;

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateToggleText(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateToggleText(newTheme);
        });
    }

    function updateToggleText(theme) {
        if (themeToggle) {
            themeToggle.textContent = theme === 'light' ? '🌙 Switch to Dark' : '☀️ Switch to Light';
        }
    }

    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            const numbers = new Set();
            while (numbers.size < 6) {
                const randomNumber = Math.floor(Math.random() * 45) + 1;
                numbers.add(randomNumber);
            }

            const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);
            numbersContainer.textContent = sortedNumbers.join(', ');
        });
    }
});

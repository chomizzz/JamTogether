document.addEventListener("DOMContentLoaded", function() {
    const inputs = document.querySelectorAll(".field");

    inputs.forEach(input => {
        input.addEventListener("focus", () => {
            input.classList.remove("animate-pulse", "border-red-500");
        });

        input.addEventListener("input", () => {
            input.classList.remove("animate-pulse","border-red-500");
        });
    });
});
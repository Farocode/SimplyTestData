function initializeClipboard() {
    const copyButtons = document.querySelectorAll(".copy-btn");

    copyButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const targetId = button.getAttribute("data-target");
            const targetEl = document.getElementById(targetId);
            if (!targetEl) return;

            const textToCopy =
                "value" in targetEl && (targetEl.tagName === "TEXTAREA" || targetEl.tagName === "INPUT")
                    ? targetEl.value
                    : targetEl.textContent;

            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalContent = button.textContent;
                button.textContent = "✅";
                button.classList.add("copied");

                setTimeout(() => {
                    button.textContent = originalContent;
                    button.classList.remove("copied");
                }, 1000);
            });
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initializeClipboard();
});

document.querySelectorAll(".tab-button").forEach(button => {
    button.addEventListener("click", () => {
        const tabName = button.getAttribute("data-tab");

        document.querySelectorAll(".tab-button").forEach(btn => btn.classList.remove("active"));
        document.querySelectorAll(".tab-content").forEach(content => content.classList.remove("active"));

        button.classList.add("active");
        document.getElementById(`tab-${tabName}`)?.classList.add("active");
    })
})
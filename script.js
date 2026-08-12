/* =====================================================
   PROJECT CAROUSEL
   ===================================================== */

const projects = document.querySelectorAll(".project-card");
const dots = document.querySelectorAll(".dot");

const previousButton = document.getElementById("prevProject");
const nextButton = document.getElementById("nextProject");

let currentProject = 0;


/* ---------- Show Project ---------- */

function showProject(index) {

    projects.forEach((project) => {
        project.classList.remove("active");
    });

    dots.forEach((dot) => {
        dot.classList.remove("active");
    });

    projects[index].classList.add("active");
    dots[index].classList.add("active");

    currentProject = index;
}


/* ---------- Next ---------- */

function nextProject() {

    currentProject++;

    if (currentProject >= projects.length) {
        currentProject = 0;
    }

    showProject(currentProject);
}


/* ---------- Previous ---------- */

function previousProject() {

    currentProject--;

    if (currentProject < 0) {
        currentProject = projects.length - 1;
    }

    showProject(currentProject);
}


/* ---------- Buttons ---------- */

nextButton.addEventListener("click", nextProject);

previousButton.addEventListener("click", previousProject);


/* ---------- Dots ---------- */

dots.forEach((dot) => {

    dot.addEventListener("click", () => {

        const index = Number(dot.dataset.index);

        showProject(index);

    });

});


/* ---------- Auto Rotate ---------- */

setInterval(() => {

    nextProject();

}, 5000);

/* =====================================================
   CONTACT FORM
   ===================================================== */

const contactForm = document.getElementById("contactForm");
const sendButton = contactForm?.querySelector("button");

if (contactForm && sendButton) {

    contactForm.addEventListener("submit", function (event) {

        event.preventDefault();

        // Change button text
        sendButton.textContent = "[ Message Sent ✓ ]";

        // Disable button temporarily
        sendButton.disabled = true;

        // After 2 seconds, clear form and restore button
        setTimeout(function () {

            contactForm.reset();

            sendButton.textContent = "[ Send ]";

            sendButton.disabled = false;

        }, 2000);

    });

}

/* =====================================================
   CV DOWNLOAD
   ===================================================== */

const downloadCV = document.getElementById("downloadCV");

if (downloadCV) {

    downloadCV.addEventListener("click", function (event) {

        event.preventDefault();

        const link = document.createElement("a");

        link.href = "cv.pdf";
        link.download = "Ashan_Chathuranga_CV.pdf";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Show success message
        const originalText = downloadCV.textContent;

        downloadCV.textContent = "[ CV Downloaded ✓ ]";

        downloadCV.style.pointerEvents = "none";

        setTimeout(function () {

            downloadCV.textContent = originalText;

            downloadCV.style.pointerEvents = "auto";

        }, 3000);

    });
}
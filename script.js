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
(function () {
  const projects = Array.isArray(window.EQUIM_PROJECTS) ? window.EQUIM_PROJECTS : [];

  if (!projects.length) {
    return;
  }

  const categoryLabel = {
    all: "Todos",
    cereales: "Cereales",
    puertos: "Puertos",
    izaje: "Izaje"
  };

  function slugify(value) {
    return value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function projectUrl(project) {
    return "proyecto.html?slug=" + encodeURIComponent(slugify(project.title));
  }

  function renderCard(project) {
    return `
      <article class="project-card" data-aos="fade-up">
        <img class="project-card-image" src="${project.photo}" alt="${project.title}" loading="lazy">
        <div class="project-card-body">
          <span class="category-pill">${categoryLabel[project.category] || project.category}</span>
          <h3 class="project-card-title h4 font-playfair-display">${project.title}</h3>
          <p>${project.summary}</p>
          <div class="project-card-meta">
            <span><strong>Ubicación:</strong> ${project.location}</span>
            <span><strong>Cliente:</strong> ${project.client}</span>
          </div>
          <a href="${projectUrl(project)}">Ver proyecto</a>
        </div>
      </article>
    `;
  }

  function renderInto(selector, items) {
    document.querySelectorAll(selector).forEach((container) => {
      container.innerHTML = items.map(renderCard).join("");
    });
  }

  renderInto("[data-project-featured]", projects.filter((item) => item.featured).slice(0, 3));
  renderInto("[data-project-latest]", projects.slice(0, 3));

  const grid = document.querySelector("[data-projects-grid]");
  const filterButtons = document.querySelectorAll("[data-project-filter]");

  if (grid) {
    const updateGrid = (filter) => {
      const visibleProjects = filter === "all"
        ? projects
        : projects.filter((item) => item.category === filter);

      grid.innerHTML = visibleProjects.map(renderCard).join("");

      filterButtons.forEach((button) => {
        button.classList.toggle("is-active", button.dataset.projectFilter === filter);
      });
    };

    updateGrid("all");

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        updateGrid(button.dataset.projectFilter || "all");
      });
    });
  }

  const detailContainer = document.querySelector("[data-project-detail]");

  if (detailContainer) {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("slug");
    const activeProject = projects.find((item) => slugify(item.title) === slug) || projects[0];

    const titleTarget = document.querySelector("[data-project-title]");
    if (titleTarget) {
      titleTarget.textContent = activeProject.title;
    }

    const galleryHtml = (activeProject.images && activeProject.images.length)
      ? `<div class="detail-gallery">
          ${activeProject.images.map((src) => `<img class="detail-gallery-image" src="${src}" alt="${activeProject.title}" loading="lazy">`).join("")}
        </div>`
      : "";

    const brochuresHtml = (activeProject.brochures && activeProject.brochures.length)
      ? `<div class="detail-brochures mt-6">
          <strong class="detail-brochures-label">Documentación</strong>
          <div class="detail-brochures-links">
            ${activeProject.brochures.map((b) => `<a class="btn-secondary btn-sm" href="${b.href}" target="_blank" rel="noopener">↓ ${b.label}</a>`).join("")}
          </div>
        </div>`
      : "";

    detailContainer.innerHTML = `
      <div class="detail-layout">
        <div>
          <img class="detail-hero-image js-lightbox-trigger" src="${activeProject.photo}" alt="${activeProject.title}" data-lightbox-src="${activeProject.photo}">
          ${galleryHtml}
        </div>
        <article class="detail-card">
          <span class="category-pill">${categoryLabel[activeProject.category] || activeProject.category}</span>
          <h2 class="h2 font-playfair-display mt-4">${activeProject.title}</h2>
          <p class="mt-4">${activeProject.summary}</p>
          <div class="detail-meta mt-6">
            <div class="detail-meta-item">
              <strong>Ubicación</strong>
              <span>${activeProject.location}</span>
            </div>
            <div class="detail-meta-item">
              <strong>Cliente</strong>
              <span>${activeProject.client}</span>
            </div>
            <div class="detail-meta-item">
              <strong>Categoría</strong>
              <span>${categoryLabel[activeProject.category] || activeProject.category}</span>
            </div>
          </div>
          ${brochuresHtml}
        </article>
      </div>
    `;

    const galleryTriggers = detailContainer.querySelectorAll(".detail-gallery-image");
    galleryTriggers.forEach((img) => {
      img.classList.add("js-lightbox-trigger");
      img.setAttribute("data-lightbox-src", img.getAttribute("src") || "");
    });

    const lightboxState = {
      overlay: null,
      image: null,
      closeButton: null
    };

    const closeLightbox = () => {
      if (!lightboxState.overlay) {
        return;
      }
      lightboxState.overlay.classList.remove("is-open");
      lightboxState.overlay.setAttribute("aria-hidden", "true");
      document.body.classList.remove("lightbox-open");
    };

    const openLightbox = (src, alt) => {
      if (!src) {
        return;
      }

      if (!lightboxState.overlay) {
        const overlay = document.createElement("div");
        overlay.className = "lightbox-overlay";
        overlay.setAttribute("aria-hidden", "true");
        overlay.innerHTML = `
          <div class="lightbox-dialog" role="dialog" aria-modal="true" aria-label="Imagen ampliada del proyecto">
            <button type="button" class="lightbox-close" aria-label="Cerrar imagen">×</button>
            <img class="lightbox-image" src="" alt="">
          </div>
        `;
        document.body.appendChild(overlay);

        lightboxState.overlay = overlay;
        lightboxState.image = overlay.querySelector(".lightbox-image");
        lightboxState.closeButton = overlay.querySelector(".lightbox-close");

        overlay.addEventListener("click", (event) => {
          if (event.target === overlay) {
            closeLightbox();
          }
        });

        if (lightboxState.closeButton) {
          lightboxState.closeButton.addEventListener("click", closeLightbox);
        }

        document.addEventListener("keydown", (event) => {
          if (event.key === "Escape" && lightboxState.overlay && lightboxState.overlay.classList.contains("is-open")) {
            closeLightbox();
          }
        });
      }

      if (lightboxState.image) {
        lightboxState.image.src = src;
        lightboxState.image.alt = alt || "Imagen ampliada";
      }

      if (lightboxState.overlay) {
        lightboxState.overlay.classList.add("is-open");
        lightboxState.overlay.setAttribute("aria-hidden", "false");
      }

      document.body.classList.add("lightbox-open");
    };

    detailContainer.querySelectorAll(".js-lightbox-trigger").forEach((image) => {
      image.addEventListener("click", () => {
        openLightbox(image.getAttribute("data-lightbox-src"), image.getAttribute("alt"));
      });
    });

    const relatedContainer = document.querySelector("[data-project-related]");
    if (relatedContainer) {
      const related = projects
        .filter((item) => item.title !== activeProject.title)
        .slice(0, Number(relatedContainer.dataset.projectRelated || 3));

      relatedContainer.innerHTML = related.map(renderCard).join("");
    }
  }
})();

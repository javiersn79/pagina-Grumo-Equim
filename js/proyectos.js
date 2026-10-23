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
      container.innerHTML = items.map((project) => renderCard(project)).join("");
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

      grid.innerHTML = visibleProjects.map((project) => renderCard(project)).join("");

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

    document.body.classList.add("illustrated-project-page");

    if (slugify(activeProject.title) === "horno-ciclonico-con-secadora-de-torre") {
      document.body.classList.add("cyclone-project-page");
      if (titleTarget) {
        titleTarget.innerHTML = 'Horno ciclónico con <span>secadora de torre</span>';
      }
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
          ${activeProject.capacity ? `<p>Con capacidad desde <strong>${activeProject.capacity}</strong></p>` : ""}
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

    const photos = Array.from(detailContainer.querySelectorAll(".js-lightbox-trigger"));
    let overlay;
    let currentIndex = 0;
    let opener;

    const showPhoto = (index) => {
      currentIndex = (index + photos.length) % photos.length;
      const photo = photos[currentIndex];
      overlay.querySelector(".lightbox-image").src = photo.dataset.lightboxSrc;
      overlay.querySelector(".lightbox-image").alt = `${photo.alt} — Foto ${currentIndex + 1} de ${photos.length}`;
      overlay.querySelector(".lightbox-counter").textContent = `${currentIndex + 1} / ${photos.length}`;
    };

    const closeLightbox = () => {
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
      overlay.inert = true;
      document.body.classList.remove("lightbox-open");
      if (opener) opener.focus();
    };

    const openLightbox = (index, trigger) => {
      if (!overlay) {
        overlay = document.createElement("div");
        overlay.className = "lightbox-overlay";
        overlay.innerHTML = `
          <div class="lightbox-dialog" role="dialog" aria-modal="true" aria-label="Galería del proyecto">
            <button type="button" class="lightbox-close" aria-label="Cerrar galería">×</button>
            <img class="lightbox-image" alt="">
            <div class="lightbox-navigation">
              <button type="button" class="lightbox-prev" aria-label="Foto anterior">← Anterior</button>
              <span class="lightbox-counter" role="status" aria-live="polite"></span>
              <button type="button" class="lightbox-next" aria-label="Foto siguiente">Siguiente →</button>
            </div>
          </div>`;
        document.body.appendChild(overlay);
        overlay.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
        overlay.querySelector(".lightbox-prev").addEventListener("click", () => showPhoto(currentIndex - 1));
        overlay.querySelector(".lightbox-next").addEventListener("click", () => showPhoto(currentIndex + 1));
        overlay.querySelectorAll(".lightbox-prev, .lightbox-next").forEach(button => { button.hidden = photos.length < 2; });
        overlay.addEventListener("click", event => { if (event.target === overlay) closeLightbox(); });
        document.addEventListener("keydown", event => {
          if (!overlay.classList.contains("is-open")) return;
          if (event.key === "Escape") closeLightbox();
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            showPhoto(currentIndex + (event.key === "ArrowRight" ? 1 : -1));
          }
          if (event.key === "Tab") {
            const buttons = Array.from(overlay.querySelectorAll("button")).filter(button => !button.hidden);
            const first = buttons[0];
            const last = buttons[buttons.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
          }
        });
      }
      opener = trigger;
      showPhoto(index);
      overlay.inert = false;
      overlay.classList.add("is-open");
      overlay.setAttribute("aria-hidden", "false");
      document.body.classList.add("lightbox-open");
      overlay.querySelector(".lightbox-close").focus();
    };

    photos.forEach((photo, index) => {
      photo.tabIndex = 0;
      photo.setAttribute("role", "button");
      photo.setAttribute("aria-label", `Ampliar foto ${index + 1} de ${photos.length}: ${photo.alt}`);
      photo.addEventListener("click", () => openLightbox(index, photo));
      photo.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openLightbox(index, photo);
        }
      });
    });

    const relatedContainer = document.querySelector("[data-project-related]");
    if (relatedContainer) {
      const related = projects
        .filter((item) => item.title !== activeProject.title)
        .slice(0, Number(relatedContainer.dataset.projectRelated || 3));

      relatedContainer.innerHTML = related.map((project) => renderCard(project)).join("");
    }
  }
})();

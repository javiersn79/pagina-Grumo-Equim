(function () {
  const site = window.EQUIM_SITE;

  if (!site) {
    return;
  }

  function renderClients() {
    document.querySelectorAll("[data-client-grid]").forEach((container) => {
      container.innerHTML = site.clients.map((client) => `
        <article class="client-plaque">
          <div class="client-plaque-logo">
            <img class="client-logo" src="${client.logo}" alt="${client.name}">
          </div>
          <strong>${client.name}</strong>
          <span>${client.sector}</span>
        </article>
      `).join("");
    });
  }

  function renderNavigation() {
    if (!site.navigation) {
      return;
    }

    document.querySelectorAll("[data-site-nav]").forEach((container) => {
      const activeKey = container.dataset.siteNav;
      container.innerHTML = site.navigation.map((item) => `
        <a class="nav-link${item.key === activeKey ? " is-active" : ""}" href="${item.href}">${item.label}</a>
      `).join("");
    });

    document.querySelectorAll("[data-mobile-nav]").forEach((container) => {
      const activeKey = container.dataset.mobileNav;
      container.innerHTML = site.navigation.map((item) => `
        <a class="mobile-nav-link${item.key === activeKey ? " is-active" : ""}" href="${item.href}">${item.label}</a>
      `).join("");
    });
  }

  function renderCtaVariants() {
    if (!site.ctas) {
      return;
    }

    document.querySelectorAll("[data-cta-variant]").forEach((container) => {
      const variant = site.ctas[container.dataset.ctaVariant];

      if (!variant) {
        return;
      }

      const points = variant.contactPoints
        ? `
          <div class="cta-band-points">
            ${contactItems(variant.contactPoints === "full").map((item) => `
              <div>
                <strong>${item.label}</strong>
                <a href="${item.href}">${item.value}</a>
              </div>
            `).join("")}
          </div>
        `
        : "";

      const actions = variant.actions.map((action) => `
        <a class="${action.kind === "secondary" ? "btn-secondary" : "btn-primary"}" href="${action.href}">${action.label}</a>
      `).join("");

      container.innerHTML = `
        <div class="cta-band${variant.compact ? " cta-band-compact" : ""}">
          <div class="cta-band-copy">
            <span class="eyebrow">${variant.eyebrow}</span>
            <h2 class="h2 font-playfair-display">${variant.title}</h2>
            <p>${variant.body}</p>
          </div>
          <div class="cta-band-panel">
            ${points}
            <div class="hero-actions">
              ${actions}
            </div>
          </div>
        </div>
      `;
    });
  }

  function contactItems(includeInfo) {
    const base = includeInfo ? site.contact.channels : site.contact.channels.filter((item) => item.label !== "Información");
    return [...base, site.contact.email];
  }

  function renderContactPoints() {
    document.querySelectorAll("[data-contact-points]").forEach((container) => {
      const mode = container.dataset.contactPoints || "full";
      const items = contactItems(mode === "full");

      container.innerHTML = items.map((item) => `
        <div>
          <strong>${item.label}</strong>
          <a href="${item.href}">${item.value}</a>
        </div>
      `).join("");
    });
  }

  function renderAddress() {
    document.querySelectorAll("[data-contact-address]").forEach((container) => {
      container.innerHTML = `
        <h2 class="h3 font-playfair-display">${site.contact.city}</h2>
        ${site.contact.address.map((line) => `<p>${line}</p>`).join("")}
      `;
    });
  }

  function renderContactFooter() {
    document.querySelectorAll("[data-contact-footer]").forEach((container) => {
      const items = contactItems(false);

      container.innerHTML = items.map((item) => `
        <li><a href="${item.href}">${item.value}</a></li>
      `).join("");
    });
  }

  function renderMailLinks() {
    document.querySelectorAll("[data-contact-mail-link]").forEach((link) => {
      link.setAttribute("href", site.contact.email.href);
      if (!link.textContent.trim()) {
        link.textContent = site.contact.email.value;
      }
    });
  }

  function renderReorganizationDocs() {
    if (!site.reorganization) {
      return;
    }

    document.querySelectorAll("[data-reorganization-docs]").forEach((container) => {
      container.innerHTML = site.reorganization.documents.map((doc) => `
        <a class="document-item" href="${doc.href}" target="_blank" rel="noopener">
          <strong>${doc.title}</strong>
          <span>${doc.summary}</span>
        </a>
      `).join("");
    });
  }

  function renderReorganizationContact() {
    if (!site.reorganization) {
      return;
    }

    document.querySelectorAll("[data-reorganization-contact]").forEach((container) => {
      container.innerHTML = `
        Referencia visible en documentos públicos:
        <a href="${site.reorganization.contact.email.href}">${site.reorganization.contact.email.value}</a>
        y PBX
        <a href="${site.reorganization.contact.phone.href}">${site.reorganization.contact.phone.value}</a>.
      `;
    });

    document.querySelectorAll("[data-reorganization-footer]").forEach((container) => {
      container.innerHTML = `
        <li><a href="${site.reorganization.contact.email.href}">${site.reorganization.contact.email.value}</a></li>
      `;
    });
  }

  function renderFooterColumn(column) {
    if (column.kind === "contact") {
      const items = contactItems(false);
      return `
        <div>
          <h3>${column.title}</h3>
          <ul class="footer-list">
            ${items.map((item) => `<li><a href="${item.href}">${item.value}</a></li>`).join("")}
          </ul>
        </div>
      `;
    }

    if (column.kind === "reorganization-contact" && site.reorganization) {
      return `
        <div>
          <h3>${column.title}</h3>
          <ul class="footer-list">
            <li><a href="${site.reorganization.contact.email.href}">${site.reorganization.contact.email.value}</a></li>
          </ul>
        </div>
      `;
    }

    return `
      <div>
        <h3>${column.title}</h3>
        <ul class="footer-list">
          ${column.links.map((link) => `
            <li><a href="${link.href}"${link.external ? ' target="_blank" rel="noopener"' : ""}>${link.label}</a></li>
          `).join("")}
        </ul>
      </div>
    `;
  }

  function renderFooterVariants() {
    if (!site.footers) {
      return;
    }

    document.querySelectorAll("[data-footer-variant]").forEach((container) => {
      const variant = site.footers[container.dataset.footerVariant];

      if (!variant) {
        return;
      }

      container.innerHTML = `
        <div>
          <a class="brand-lockup brand-lockup-footer" href="index.html" aria-label="GRUMO y EQUIM">
            <img class="brand-logo" src="./assets/equim-brand/grumo-logo-nuevo.png" alt="GRUMO">
            <img class="brand-logo" src="./assets/equim-brand/equim-logo-nuevo.png" alt="EQUIM">
          </a>
          <p class="footer-copy">${variant.copy}</p>
        </div>
        ${variant.columns.map(renderFooterColumn).join("")}
      `;
    });
  }

  renderAddress();
  renderClients();
  renderNavigation();
  renderCtaVariants();
  renderContactPoints();
  renderContactFooter();
  renderMailLinks();
  renderReorganizationDocs();
  renderReorganizationContact();
  renderFooterVariants();
})();

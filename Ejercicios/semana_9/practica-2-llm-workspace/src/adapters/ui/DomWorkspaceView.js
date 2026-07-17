const formatTime = totalSeconds => {
  const safe = Math.max(0, totalSeconds);
  const minutes = Math.floor(safe / 60).toString().padStart(2, "0");
  const seconds = Math.floor(safe % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const storageJson = storage => {
  try {
    const data = {};
    for (let index = 0; index < storage.length; index += 1) {
      const key = storage.key(index);
      data[key] = JSON.parse(storage.getItem(key));
    }
    return JSON.stringify(data, null, 2);
  } catch {
    return "No disponible";
  }
};

export class DomWorkspaceView {
  constructor(documentRef = document) {
    this.documentRef = documentRef;
    this.windowRef = documentRef.defaultView ?? window;
    this.lastFocusedElement = null;
    this.lastResponse = "Esperando interaccion";
    this.elements = {
      conversation: documentRef.getElementById("conversation"),
      emptyConversation: documentRef.getElementById("emptyConversation"),
      favorites: documentRef.getElementById("favoritesList"),
      emptyFavorites: documentRef.getElementById("emptyFavorites"),
      favoritesCount: documentRef.getElementById("favoritesCount"),
      prompt: documentRef.getElementById("prompt"),
      send: documentRef.getElementById("sendButton"),
      saveFavorite: documentRef.getElementById("saveFavoriteButton"),
      login: documentRef.getElementById("loginButton"),
      tokenBadge: documentRef.getElementById("tokenBadge"),
      tokenText: documentRef.getElementById("tokenText"),
      tokenProgress: documentRef.getElementById("tokenProgress"),
      sessionMessageCount: documentRef.getElementById("sessionMessageCount"),
      localFavoriteCount: documentRef.getElementById("localFavoriteCount"),
      cookieState: documentRef.getElementById("cookieState"),
      modal: documentRef.getElementById("sessionModal"),
      closeModal: documentRef.getElementById("closeModalButton"),
      renewToken: documentRef.getElementById("renewTokenButton"),
      typing: documentRef.getElementById("typingIndicator"),
      toastRegion: documentRef.getElementById("toastRegion"),
      sessionStoragePreview: documentRef.getElementById("sessionStoragePreview"),
      localStoragePreview: documentRef.getElementById("localStoragePreview"),
      cookiePreview: documentRef.getElementById("cookiePreview"),
      lastResponsePreview: documentRef.getElementById("lastResponsePreview"),
      inspectorBody: documentRef.getElementById("inspectorBody"),
      toggleInspector: documentRef.getElementById("toggleInspectorButton"),
      preloader: documentRef.getElementById("preloader"),
      preloaderCount: documentRef.getElementById("preloaderCount"),
      scrollProgress: documentRef.getElementById("scrollProgress"),
      header: documentRef.getElementById("siteHeader"),
      menuButton: documentRef.getElementById("menuButton"),
      mobileMenu: documentRef.getElementById("mobileMenu"),
      closeMenu: documentRef.getElementById("closeMenuButton"),
      cursor: documentRef.getElementById("cursor")
    };
    this.setupMotion();
    this.setupNavigation();
    this.setupAccordions();
    this.setupInspectorToggle();
  }

  bindSend(handler) {
    this.elements.send.addEventListener("click", () => handler(this.getPrompt()));
    this.elements.prompt.addEventListener("keydown", event => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handler(this.getPrompt());
      }
    });
    this.elements.conversation.addEventListener("click", event => {
      const button = event.target.closest("button[data-message-action]");
      if (!button) return;
      const message = button.closest(".message")?.querySelector(".message__content")?.textContent ?? "";
      if (button.dataset.messageAction === "copy") {
        navigator.clipboard?.writeText(message);
        this.showToast("Mensaje copiado.", "success");
      }
      if (button.dataset.messageAction === "reuse") this.setPrompt(message);
    });
  }

  bindSaveFavorite(handler) { this.elements.saveFavorite.addEventListener("click", () => handler(this.getPrompt())); }
  bindLogin(handler) { this.elements.login.addEventListener("click", handler); this.elements.renewToken.addEventListener("click", handler); }

  bindCloseModal(handler) {
    this.elements.closeModal.addEventListener("click", handler);
    this.elements.modal.addEventListener("click", event => { if (event.target === this.elements.modal) handler(); });
    this.documentRef.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        if (!this.elements.modal.hidden) handler();
        if (!this.elements.mobileMenu.hidden) this.closeMobileMenu();
      }
      if (event.key === "Tab" && !this.elements.modal.hidden) this.trapFocus(event, this.elements.modal);
    });
  }

  bindFavoriteActions({ onUse, onRemove }) {
    this.elements.favorites.addEventListener("click", event => {
      const button = event.target.closest("button[data-action]");
      if (!button) return;
      const index = Number(button.dataset.index);
      if (button.dataset.action === "use") { onUse(index); this.showToast("Favorito reutilizado en el composer.", "success"); }
      if (button.dataset.action === "remove" && this.windowRef.confirm("Eliminar este favorito?")) onRemove(index);
    });
  }

  getPrompt() { return this.elements.prompt.value.trim(); }
  setPrompt(value) { this.elements.prompt.value = value; this.elements.prompt.classList.add("is-reused"); setTimeout(() => this.elements.prompt.classList.remove("is-reused"), 450); this.focusPrompt(); }
  clearPrompt() { this.elements.prompt.value = ""; }
  focusPrompt() { this.elements.prompt.focus({ preventScroll: true }); }

  renderConversation(messages) {
    this.elements.conversation.querySelectorAll(".message").forEach(node => node.remove());
    for (const message of messages) this.elements.conversation.insertBefore(this.createMessageNode(message), this.elements.typing);
    this.elements.emptyConversation.hidden = messages.length > 0;
    this.elements.sessionMessageCount.textContent = String(messages.length);
    this.updateInspector(`Conversacion renderizada: ${messages.length} mensajes`);
    this.scrollConversation();
  }

  createMessageNode(message) {
    const article = this.documentRef.createElement("article");
    article.className = `message message--${message.rol}`;
    article.setAttribute("aria-label", message.rol === "user" ? "Mensaje del usuario" : "Respuesta de la IA");
    const avatar = this.documentRef.createElement("div");
    avatar.className = "message__avatar";
    avatar.textContent = message.rol === "user" ? "TU" : "IA";
    const wrap = this.documentRef.createElement("div");
    const content = this.documentRef.createElement("p");
    content.className = "message__content";
    content.textContent = message.contenido;
    const actions = this.documentRef.createElement("div");
    actions.className = "message__actions";
    actions.innerHTML = '<button class="mini-button" type="button" data-message-action="copy">Copiar</button><button class="mini-button" type="button" data-message-action="reuse">Reusar</button>';
    wrap.append(content, actions);
    article.append(avatar, wrap);
    return article;
  }

  renderFavorites(favorites) {
    this.elements.favorites.querySelectorAll(".favorite").forEach(node => node.remove());
    favorites.forEach((favorite, index) => {
      const item = this.documentRef.createElement("article");
      item.className = "favorite";
      const text = this.documentRef.createElement("p");
      text.className = "favorite__text";
      text.textContent = favorite;
      const actions = this.documentRef.createElement("div");
      actions.className = "favorite__actions";
      actions.innerHTML = `<button class="ghost-button" type="button" data-action="use" data-index="${index}" aria-label="Usar este prompt">Usar</button><button class="icon-button" type="button" data-action="remove" data-index="${index}" aria-label="Eliminar este prompt">×</button>`;
      item.append(text, actions);
      this.elements.favorites.appendChild(item);
    });
    this.elements.emptyFavorites.hidden = favorites.length > 0;
    this.elements.favoritesCount.textContent = String(favorites.length);
    this.elements.localFavoriteCount.textContent = String(favorites.length);
    this.updateInspector(`Favoritos renderizados: ${favorites.length}`);
  }

  setBusy(isBusy) {
    this.elements.send.disabled = isBusy;
    this.elements.prompt.disabled = isBusy;
    this.elements.typing.hidden = !isBusy;
    this.elements.send.classList.toggle("is-loading", isBusy);
    this.updateInspector(isBusy ? "Enviando prompt a ApiLLM" : "Workspace listo");
    if (isBusy) this.scrollConversation();
  }

  updateSessionStatus(status) {
    const badge = this.elements.tokenBadge;
    const state = status.state === "active" && status.remainingSeconds <= 30 ? "warning" : status.state;
    badge.dataset.state = state;
    this.elements.tokenProgress.style.transform = `scaleX(${status.progress ?? 0})`;
    if (status.state === "active") {
      this.elements.tokenText.textContent = `Token expira en ${formatTime(status.remainingSeconds)}`;
      this.elements.cookieState.textContent = status.remainingSeconds <= 30 ? "Por expirar" : "Activa";
      this.elements.login.textContent = "Renovar token";
    } else if (status.state === "expired") {
      this.elements.tokenText.textContent = "Token expirado";
      this.elements.cookieState.textContent = "Expirada";
      this.elements.login.textContent = "Iniciar sesion";
    } else {
      this.elements.tokenText.textContent = "Sin sesion";
      this.elements.cookieState.textContent = "Ausente";
      this.elements.login.textContent = "Iniciar sesion";
    }
    this.updateInspector();
  }

  showSessionExpiredModal() { this.lastFocusedElement = this.documentRef.activeElement; this.elements.modal.hidden = false; requestAnimationFrame(() => this.elements.modal.classList.add("is-visible")); this.elements.renewToken.focus(); this.updateInspector("401: conversacion limpiada, favoritos conservados"); }
  hideSessionExpiredModal() { this.elements.modal.classList.remove("is-visible"); setTimeout(() => { this.elements.modal.hidden = true; (this.lastFocusedElement ?? this.elements.prompt).focus({ preventScroll: true }); }, 180); }

  showToast(message, type = "info") {
    this.lastResponse = message;
    const toast = this.documentRef.createElement("div");
    toast.className = `toast toast--${type}`;
    toast.setAttribute("role", "status");
    toast.textContent = message;
    this.elements.toastRegion.appendChild(toast);
    this.updateInspector(message);
    setTimeout(() => toast.classList.add("is-visible"), 10);
    setTimeout(() => { toast.classList.remove("is-visible"); setTimeout(() => toast.remove(), 180); }, 3200);
  }

  scrollConversation() { requestAnimationFrame(() => { this.elements.conversation.scrollTop = this.elements.conversation.scrollHeight; }); }

  updateInspector(lastResponse = this.lastResponse) {
    this.lastResponse = lastResponse;
    if (!this.elements.sessionStoragePreview) return;
    this.elements.sessionStoragePreview.textContent = storageJson(this.windowRef.sessionStorage);
    this.elements.localStoragePreview.textContent = storageJson(this.windowRef.localStorage);
    this.elements.cookiePreview.textContent = this.documentRef.cookie || "llm_token: ausente";
    this.elements.lastResponsePreview.textContent = lastResponse;
  }

  setupInspectorToggle() {
    this.elements.toggleInspector?.addEventListener("click", () => {
      const isHidden = this.elements.inspectorBody.hidden;
      this.elements.inspectorBody.hidden = !isHidden;
      this.elements.toggleInspector.setAttribute("aria-expanded", String(isHidden));
      this.elements.toggleInspector.textContent = isHidden ? "Cerrar panel" : "Abrir panel";
    });
  }

  setupAccordions() {
    this.documentRef.querySelectorAll("[data-accordion-trigger]").forEach(trigger => {
      trigger.addEventListener("click", () => {
        const panel = this.documentRef.getElementById(trigger.getAttribute("aria-controls"));
        const group = trigger.closest("[data-accordion-group]");
        group?.querySelectorAll("[data-accordion-trigger]").forEach(other => {
          if (other !== trigger) {
            other.setAttribute("aria-expanded", "false");
            this.documentRef.getElementById(other.getAttribute("aria-controls"))?.setAttribute("hidden", "");
          }
        });
        const expanded = trigger.getAttribute("aria-expanded") === "true";
        trigger.setAttribute("aria-expanded", String(!expanded));
        panel.hidden = expanded;
      });
    });
  }

  setupNavigation() {
    this.elements.menuButton?.addEventListener("click", () => this.openMobileMenu());
    this.elements.closeMenu?.addEventListener("click", () => this.closeMobileMenu());
    this.elements.mobileMenu?.addEventListener("click", event => { if (event.target === this.elements.mobileMenu) this.closeMobileMenu(); });
    this.elements.mobileMenu?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => this.closeMobileMenu()));
  }

  openMobileMenu() { this.lastFocusedElement = this.documentRef.activeElement; this.elements.mobileMenu.hidden = false; this.documentRef.body.classList.add("menu-open"); this.elements.menuButton.setAttribute("aria-expanded", "true"); requestAnimationFrame(() => this.elements.mobileMenu.classList.add("is-open")); this.elements.closeMenu.focus(); }
  closeMobileMenu() { this.elements.mobileMenu.classList.remove("is-open"); this.documentRef.body.classList.remove("menu-open"); this.elements.menuButton.setAttribute("aria-expanded", "false"); setTimeout(() => { this.elements.mobileMenu.hidden = true; this.lastFocusedElement?.focus?.({ preventScroll: true }); }, 220); }

  setupMotion() {
    const prefersReduced = this.windowRef.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.documentRef.getElementById("footerYear").textContent = String(new Date().getFullYear());
    if (!prefersReduced) this.runPreloader(); else this.elements.preloader?.remove();
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("is-visible"); }), { threshold: 0.12 });
    this.documentRef.querySelectorAll(".reveal,.reveal-lines,.reveal-image").forEach(node => observer.observe(node));
    this.setupScrollState();
    this.setupCursor();
    this.setupCounters();
  }

  runPreloader() {
    const quick = this.windowRef.sessionStorage.getItem("context_atelier_seen") === "true";
    const duration = quick ? 450 : 1700;
    const started = performance.now();
    const tick = now => {
      const progress = Math.min(1, (now - started) / duration);
      this.elements.preloaderCount.textContent = String(Math.round(progress * 100));
      if (progress < 1) requestAnimationFrame(tick);
      else { this.windowRef.sessionStorage.setItem("context_atelier_seen", "true"); this.elements.preloader.classList.add("is-done"); setTimeout(() => this.elements.preloader.remove(), 850); }
    };
    requestAnimationFrame(tick);
  }

  setupScrollState() {
    let lastY = this.windowRef.scrollY;
    let ticking = false;
    const links = [...this.documentRef.querySelectorAll("[data-nav-link]")];
    const sections = [...this.documentRef.querySelectorAll("[data-section]")];
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = this.windowRef.scrollY;
        const max = this.documentRef.documentElement.scrollHeight - this.windowRef.innerHeight;
        this.elements.scrollProgress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
        this.elements.header.classList.toggle("is-scrolled", y > 24);
        this.elements.header.classList.toggle("is-hidden", y > lastY && y > 220);
        lastY = y;
        const current = sections.findLast(section => section.getBoundingClientRect().top <= 140)?.id;
        links.forEach(link => link.classList.toggle("is-active", link.getAttribute("href") === `#${current}`));
        ticking = false;
      });
    };
    this.windowRef.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  setupCursor() {
    if (!this.windowRef.matchMedia("(pointer: fine)").matches || !this.elements.cursor) return;
    this.documentRef.addEventListener("pointermove", event => {
      this.elements.cursor.style.setProperty("--x", `${event.clientX}px`);
      this.elements.cursor.style.setProperty("--y", `${event.clientY}px`);
    });
    this.documentRef.querySelectorAll("a,button,[data-cursor-label]").forEach(node => {
      node.addEventListener("pointerenter", () => { this.elements.cursor.querySelector("span").textContent = node.dataset.cursorLabel || "Open"; this.elements.cursor.classList.add("is-visible"); });
      node.addEventListener("pointerleave", () => this.elements.cursor.classList.remove("is-visible"));
    });
  }

  setupCounters() {
    const counters = this.documentRef.querySelectorAll("[data-count]");
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const node = entry.target;
      const target = Number(node.dataset.count);
      const start = performance.now();
      const animate = now => {
        const progress = Math.min(1, (now - start) / 900);
        node.textContent = String(Math.round(target * progress));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
      observer.unobserve(node);
    }), { threshold: 0.45 });
    counters.forEach(counter => observer.observe(counter));
  }

  trapFocus(event, root) {
    const focusables = [...root.querySelectorAll('button,[href],input,textarea,select,[tabindex]:not([tabindex="-1"])')].filter(node => !node.disabled);
    const first = focusables[0];
    const last = focusables.at(-1);
    if (!first || !last) return;
    if (event.shiftKey && this.documentRef.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && this.documentRef.activeElement === last) { event.preventDefault(); first.focus(); }
  }
}

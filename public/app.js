const PER_PAGE = 20;

const state = {
  category: "문제집",
  query: "",
  page: 1,
  materials: []
};

const pageTitle = document.getElementById("pageTitle");
const resultCount = document.getElementById("resultCount");
const materialList = document.getElementById("materialList");
const emptyState = document.getElementById("emptyState");
const emptyMessage = document.getElementById("emptyMessage");
const pagination = document.getElementById("pagination");
const searchInput = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");

function normalize(value) {
  return String(value ?? "").toLowerCase().replace(/\s+/g, " ").trim();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function currentItems() {
  const query = normalize(state.query);
  let items = state.materials.filter(item => item.category === state.category);

  if (query.length >= 2) {
    items = items.filter(item => normalize(item.name).includes(query));
  }

  return items;
}

function render() {
  const items = currentItems();
  const totalPages = Math.max(1, Math.ceil(items.length / PER_PAGE));
  state.page = Math.min(state.page, totalPages);

  const start = (state.page - 1) * PER_PAGE;
  const pageItems = items.slice(start, start + PER_PAGE);

  pageTitle.textContent = state.category;
  resultCount.textContent = state.query.trim().length >= 2
    ? `검색 결과 ${items.length}개`
    : `전체 ${items.length}개`;

  clearSearch.hidden = state.query.length === 0;

  if (pageItems.length === 0) {
    materialList.innerHTML = "";
    emptyState.hidden = false;
    emptyMessage.textContent = state.query.trim().length >= 2
      ? "검색어와 일치하는 자료가 없습니다."
      : "등록된 자료가 아직 없습니다.";
  } else {
    emptyState.hidden = true;
    materialList.innerHTML = pageItems.map(item => `
      <article class="material-card">
        <div class="material-info">
          <h2 class="material-title" title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</h2>
          <div class="material-meta">PDF</div>
        </div>
        <div class="material-actions">
          <a class="action" href="${encodeURI(item.url)}" target="_blank" rel="noopener">보기</a>
          <a class="action download" href="${encodeURI(item.url)}" download>다운로드</a>
        </div>
      </article>
    `).join("");
  }

  renderPagination(totalPages);
}

function renderPagination(totalPages) {
  if (totalPages <= 1) {
    pagination.innerHTML = "";
    return;
  }

  const buttons = [];
  buttons.push(`<button class="page-button" data-page="${state.page - 1}" ${state.page === 1 ? "disabled" : ""}>‹</button>`);

  const maxButtons = 7;
  let start = Math.max(1, state.page - 3);
  let end = Math.min(totalPages, start + maxButtons - 1);
  start = Math.max(1, end - maxButtons + 1);

  for (let i = start; i <= end; i++) {
    buttons.push(`<button class="page-button ${i === state.page ? "active" : ""}" data-page="${i}">${i}</button>`);
  }

  buttons.push(`<button class="page-button" data-page="${state.page + 1}" ${state.page === totalPages ? "disabled" : ""}>›</button>`);
  pagination.innerHTML = buttons.join("");
}

async function loadMaterials() {
  try {
    const response = await fetch("materials.json", { cache: "no-store" });
    if (!response.ok) throw new Error("materials.json을 불러오지 못했습니다.");
    state.materials = await response.json();
    render();
  } catch (error) {
    state.materials = [];
    materialList.innerHTML = "";
    emptyState.hidden = false;
    emptyMessage.textContent = "자료 목록을 불러오지 못했습니다.";
    pagination.innerHTML = "";
    console.error(error);
  }
}

document.querySelectorAll(".nav-item").forEach(button => {
  button.addEventListener("click", () => {
    state.category = button.dataset.category;
    state.page = 1;
    document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    render();
  });
});

searchInput.addEventListener("input", event => {
  state.query = event.target.value;
  state.page = 1;
  render();
});

clearSearch.addEventListener("click", () => {
  searchInput.value = "";
  state.query = "";
  state.page = 1;
  render();
  searchInput.focus();
});

pagination.addEventListener("click", event => {
  const button = event.target.closest("[data-page]");
  if (!button || button.disabled) return;
  state.page = Number(button.dataset.page);
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

loadMaterials();

const header = document.querySelector(".header");
const navLinks = document.querySelector(".header-links-container");
const asideContent = document.querySelector(".aside-content");
const contentSection = document.querySelector(".content");

const headerMenuToggle = document.createElement("button");

const pageParams = new URLSearchParams(window.location.search);

let currentPage = parseInt(pageParams.get("page"), 10) || 1;

const prevPageBtn = document.createElement("div");
prevPageBtn.classList.add("page-control-action");
prevPageBtn.innerText = "⭠ Previous";

const nextPageBtn = document.createElement("div");
nextPageBtn.classList.add("page-control-action");
nextPageBtn.innerText = "Next ⭢";
nextPageBtn.style.textAlign = "right";

async function getPosts(page = 1) {
  const response = await fetch(
    `https://gorest.co.in/public/v2/posts?page=${page}`
  );

  const data = await response.json();

  return data;
}

function loading() {
  for (let index = 0; index < 5; index++) {
    const post = document.createElement("div");
    post.classList.add("post");

    post.innerHTML = `
    <div class="post-header">
        <div class="post-header-details">
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text"></div>
        </div>
    </div>

    <div class="post-content">
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text"></div>
    </div>
    `;

    contentSection.append(post);
  }
}

function clearContent() {
  const posts = document.querySelectorAll(".post");

  posts.forEach((post) => {
    post.remove();
  });

  const pageControl = document.querySelector(".page-control");

  if (document.contains(pageControl)) {
    pageControl.parentNode.removeChild(pageControl);
  }
}

function fillContent(posts = []) {
  posts.forEach((p) => {
    const post = document.createElement("div");
    post.classList.add("post");

    post.innerHTML = `
    <div class="post-header">
        <div class="post-header-details">
          <a href="./post/index.html?id=${p.id}" id="${p.id}" class="post-header-title">
            ${p.title}
          </a>
        </div>
    </div>

    <div class="post-content">
      ${p.body}
    </div>
    `;

    contentSection.append(post);
  });

  const main = document.querySelector(".post");

  if (main) {
    const elementRect = main.getBoundingClientRect();
    const absoluteElementTop = elementRect.top + window.pageYOffset + "15%";
    window.scrollTo({ top: absoluteElementTop, behavior: "smooth" });
  }
}

async function loadPosts(page = 1) {
  try {
    loading();

    const [posts1, posts2] = await Promise.all([
      getPosts(page),
      getPosts(page + 1),
    ]);

    if (posts1.length > 0) {
      clearContent();
      fillContent(posts1);
    }

    const pageControlPanel = document.createElement("div");
    pageControlPanel.classList.add("page-control");

    if (currentPage > 1) {
      pageControlPanel.append(prevPageBtn);
    }

    if (posts2.length > 0) {
      pageControlPanel.append(nextPageBtn);
    }

    contentSection.append(pageControlPanel);
  } catch (error) {
    console.error(error);
  }
}

loadPosts(currentPage);

headerMenuToggle.classList.add("btn", "btn-outlined");
headerMenuToggle.innerText = "☰";

header.append(headerMenuToggle);

function openNextPage() {
  clearContent();

  currentPage += 1;

  window.history.pushState("null", "title", `./index.html?page=${currentPage}`);

  loadPosts(currentPage);
}

function openPrevPage() {
  clearContent();

  currentPage -= 1;

  if (currentPage !== 1) {
    window.history.pushState(
      "null",
      "title",
      `./index.html?page=${currentPage}`
    );
  } else {
    window.history.pushState("null", "title", "./index.html");
  }

  loadPosts(currentPage);
}

nextPageBtn.addEventListener("click", () => openNextPage());
prevPageBtn.addEventListener("click", () => openPrevPage());

const recommendations = [
  "Programming",
  "Data Science",
  "Technology",
  "Self Improvement",
  "Writing",
  "Relationships",
  "Machine Learning",
  "Politics",
];

recommendations.forEach((recommendation) => {
  const rec = document.createElement("a");
  rec.classList.add("recommendation");
  rec.href = "#";
  rec.innerHTML = recommendation;

  asideContent.append(rec);
});

headerMenuToggle.addEventListener("click", () => {
  if (headerMenuToggle.classList.contains("menu-active")) {
    headerMenuToggle.classList.remove("menu-active");
    navLinks.classList.remove("header-links-container-active");
    window.document.body.style.overflow = "unset";
    headerMenuToggle.innerText = "☰";
  } else {
    headerMenuToggle.classList.add("menu-active");
    navLinks.classList.add("header-links-container-active");
    window.document.body.style.overflow = "hidden";
    headerMenuToggle.innerText = "✕";
  }
});

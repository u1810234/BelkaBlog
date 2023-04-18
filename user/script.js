const header = document.querySelector(".header");
const navLinks = document.querySelector(".header-links-container");
const headerMenuToggle = document.createElement("button");
const contentMain = document.querySelector(".content-main");

const profileInfo = document.querySelector(".profile-info");

const pageParams = new URLSearchParams(window.location.search);

const currentPostID = parseInt(pageParams.get("id"), 10);

const skeletonText = document.createElement("div");
skeletonText.classList.add("skeleton-text", "skeleton");

const authorCache = new Map();

const getPostAuthor = async (id) => {
  profileInfo.innerHTML = `
        <h2 class="profile-name skeleton skeleton-text"></h2>
        <p class="profile-email skeleton skeleton-text"></p>
        <span class="profile-status skeleton skeleton-text skeleton-status"></span>
    `;
  if (authorCache.has(id)) {
    return authorCache.get(id);
  }

  try {
    const response = await fetch(`https://gorest.co.in/public/v2/users/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch post author: ${response.status}`);
    }

    const data = await response.json();

    authorCache.set(id, data);

    return data;
  } catch (error) {
    console.error(`Error fetching post author: ${error}`);
    const templateResponse = {
      id,
      name: "Unknown",
      status: "Last seen a long time ago",
    };
    return templateResponse;
  }
};

getPostAuthor(currentPostID).then((user) => {
  document.title = user.name + " | BelkaBlog User";
  profileInfo.innerHTML = "";

  profileInfo.innerHTML = `
    <h2 class="profile-name">${user.name}</h2>
    <p class="profile-email">${user.email}</p>
    <span class="profile-status ${
      user.status === "active" ? "online" : "offline"
    }">
    ${user.status}</span>
`;
});

headerMenuToggle.classList.add("btn", "btn-outlined");
headerMenuToggle.innerText = "☰";

header.append(headerMenuToggle);

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

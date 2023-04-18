const header = document.querySelector(".header");
const navLinks = document.querySelector(".header-links-container");
const headerMenuToggle = document.createElement("button");

const contentMain = document.querySelector(".content-main");
const postComments = document.getElementById("comments-section-prev-comments");
const pagePost = document.createElement("div");

const pageParams = new URLSearchParams(window.location.search);

const currentPostID = parseInt(pageParams.get("id"), 10);

const snackbar = document.getElementById("snackbar");

const getPost = async (id) => {
  try {
    const response = await fetch(`https://gorest.co.in/public/v2/posts/${id}`);

    if (!response.ok) {
      // If response is not OK, throw an error
      throw new Error("Failed to fetch post");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    // Redirect to 404 page
    window.location.href = "../404.html"; // Update with the appropriate URL for your 404 page
  }
};

const authorCache = new Map();

const getPostAuthor = async (id) => {
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

const getPostComments = async (postID) => {
  const response = await fetch(
    `https://gorest.co.in/public/v2/posts/${postID}/comments`
  );

  const data = await response.json();

  return data;
};

const fillContent = (contentAuthor, contentData) => {
  pagePost.classList.add("page-post");
  pagePost.innerHTML = `
      <div class="page-post-header">
          <h1 class="page-post-header-text">
              ${contentData.title}
          </h1>
  
          <span class="page-post-header-author">${contentAuthor.name} · ${contentAuthor.status}</span>
      </div>
  
      <div class="page-post-content">
          ${contentData.body}
      </div>
    `;

  const postActionsContainerElement = document.createElement("div");
  postActionsContainerElement.classList.add("page-post-footer");

  const postActionLike = document.createElement("div");
  postActionLike.classList.add("page-post-action");
  postActionLike.innerHTML = `
      <div class="post-action-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M64 288L39.8 263.8C14.3 238.3 0 203.8 0 167.8C0 92.8 60.8 32 135.8 32c36 0 70.5 14.3 96 39.8L256 96l24.2-24.2c25.5-25.5 60-39.8 96-39.8C451.2 32 512 92.8 512 167.8c0 36-14.3 70.5-39.8 96L448 288 256 480 64 288z"/></svg>
      </div>
      <span class="post-action-text">
        Like
      </span>
    `;

  postActionLike.addEventListener("click", () =>
    openSnackbar("warning", "Will be added soon")
  );

  const postActionComment = document.createElement("a");
  postActionComment.classList.add("page-post-action");

  postActionComment.href = `#comments-section`;

  postActionComment.innerHTML = `
      <div class="post-action-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4l0 0 0 0 0 0 0 0 .3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z"/></svg>
      </div>
      <span class="post-action-text">
        Comment
      </span>
    `;

  const postActionShare = document.createElement("div");
  postActionShare.classList.add("page-post-action");
  postActionShare.innerHTML = `
        <div class="post-action-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M307 34.8c-11.5 5.1-19 16.6-19 29.2v64H176C78.8 128 0 206.8 0 304C0 417.3 81.5 467.9 100.2 478.1c2.5 1.4 5.3 1.9 8.1 1.9c10.9 0 19.7-8.9 19.7-19.7c0-7.5-4.3-14.4-9.8-19.5C108.8 431.9 96 414.4 96 384c0-53 43-96 96-96h96v64c0 12.6 7.4 24.1 19 29.2s25 3 34.4-5.4l160-144c6.7-6.1 10.6-14.7 10.6-23.8s-3.8-17.7-10.6-23.8l-160-144c-9.4-8.5-22.9-10.6-34.4-5.4z"/></svg>
        </div>
        <span class="post-action-text">
          Share
        </span>
    `;

  postActionShare.addEventListener("click", () =>
    openSnackbar("warning", "Will be added soon")
  );

  postActionsContainerElement.append(
    postActionLike,
    postActionComment,
    postActionShare
  );

  pagePost.append(postActionsContainerElement);

  contentMain.append(pagePost);
};

const fillComments = (comments) => {
  if (comments.length > 0) {
    comments.forEach((comment) => {
      const commentElement = document.createElement("div");
      commentElement.classList.add("comment");
      commentElement.innerHTML = `
              <div class="comment-header">
                  ${comment.name}
              </div>
              
              <div class="comment-body">
                  ${comment.body}
              </div>
              `;

      postComments.append(commentElement);
    });
  }
};

(async () => {
  const [post, comments] = await Promise.all([
    getPost(currentPostID),
    getPostComments(currentPostID),
  ]);

  const userData = await getPostAuthor(post.user_id);
  fillContent(userData, post);
  fillComments(comments);
})();

function openSnackbar(type, text) {
  snackbar.classList.add("show", type);
  snackbar.innerText = text;
  setTimeout(() => {
    snackbar.classList.remove("show", type);
  }, 3000);
}

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

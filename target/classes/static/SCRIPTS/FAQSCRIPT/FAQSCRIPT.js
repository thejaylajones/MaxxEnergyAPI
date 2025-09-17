// FAQ Accordion
document.querySelectorAll(".accordion").forEach(btn => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("active");
    const panel = btn.nextElementSibling;
    panel.style.display = panel.style.display === "block" ? "none" : "block";
  });
});

const pages = [
  { title: "Home", url: "index.html" },
  { title: "About", url: "about.html" },
  { title: "FAQ", url: "faq.html" },
  { title: "Contact", url: "contact.html" }
];

const searchBox = document.getElementById("searchBox");
const searchBtn = document.getElementById("searchBtn");
const resultsDiv = document.getElementById("results");

function extractSentences(text) {
  // Split text into sentences using period, exclamation, or question mark
  return text.match(/[^.!?]+[.!?]+/g) || [];
}

function searchSite(query) {
  resultsDiv.innerHTML = "<h3>Results:</h3>";
  if (query.trim() === "") {
    resultsDiv.innerHTML += "<p>Please enter a search term.</p>";
    return;
  }
  let found = false;
  let completed = 0;
  const lowerQuery = query.toLowerCase();

  pages.forEach(page => {
    fetch(page.url)
      .then(response => response.text())
      .then(data => {
        // Remove HTML tags and get text content
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, "text/html");
        const text = doc.body ? doc.body.textContent : "";

        // Find sentences containing the query
        const sentences = extractSentences(text);
        const matches = sentences.filter(sentence =>
          sentence.toLowerCase().includes(lowerQuery)
        );

        if (matches.length > 0) {
          found = true;
          resultsDiv.innerHTML += `<p><a href="${page.url}" target="_blank">${page.title}</a></p>`;
          matches.forEach(sentence => {
            // Highlight the search word
            const highlighted = sentence.replace(
              new RegExp(`(${query})`, "gi"),
              '<mark>$1</mark>'
            );
            resultsDiv.innerHTML += `<div style="margin-left:1em;">${highlighted}</div>`;
          });
        }
      })
      .catch(() => {})
      .finally(() => {
        completed++;
        if (completed === pages.length && !found) {
          resultsDiv.innerHTML += "<p>No results found.</p>";
        }
      });
  });
}

searchBtn.addEventListener("click", () => {
  searchSite(searchBox.value);
});

searchBox.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    searchSite(searchBox.value);
  }
});

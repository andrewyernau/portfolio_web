// The form keeps what was typed when a request never reached the application.
for (const type of ["htmx:responseError", "htmx:sendError"]) {
  document.addEventListener(type, () => {
    const notice = document.getElementById("contact-failure");
    if (notice) notice.hidden = false;
  });
}
document.addEventListener("htmx:beforeRequest", () => {
  const notice = document.getElementById("contact-failure");
  if (notice) notice.hidden = true;
});

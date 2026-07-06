window.addEventListener('beforeunload', event => {
  if (window.__allowPageUnload) return;
  event.preventDefault();
  event.returnValue = '';
});

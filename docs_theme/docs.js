(() => {
  const locale = document.documentElement.lang === 'zh' ? 'zh-CN' : 'en';
  try { localStorage.setItem('liquid-agent-language-v1', locale); } catch { /* Storage is optional. */ }

  // Static documentation is also an open local application page. Its lifetime
  // must not be mistaken for closing the application when navigating from React.
  if (!['localhost', '127.0.0.1', '::1', '[::1]'].includes(location.hostname)) return;
  const home = document.querySelector('.docs-home');
  if (!home) return;
  const root = new URL(home.href);
  root.hash = '';
  const clientId = `docs-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  let watcher;
  let closed = false;
  const watch = () => {
    closed = false;
    watcher = new EventSource(new URL(`api/system/page-watch?client_id=${clientId}`, root));
    watcher.onerror = () => undefined;
  };
  fetch(new URL('api/system/health', root)).then(response => response.ok ? response.json() : null).then(health => {
    if (health?.app === 'liquidbiopsy-agent-web' && !closed) watch();
  }).catch(() => undefined);
  window.addEventListener('pagehide', () => {
    closed = true;
    if (!watcher) return;
    watcher.close();
    navigator.sendBeacon?.(new URL(`api/system/page-close?client_id=${clientId}`, root));
  });
  window.addEventListener('pageshow', event => { if (event.persisted && watcher) watch(); });
})();

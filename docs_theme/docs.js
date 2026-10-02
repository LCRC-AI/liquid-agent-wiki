(() => {
  const locale = document.documentElement.lang === 'zh' ? 'zh-CN' : 'en';
  try { localStorage.setItem('liquid-agent-language-v1', locale); } catch { /* Storage is optional. */ }
})();

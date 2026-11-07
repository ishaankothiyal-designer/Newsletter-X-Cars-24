(() => {
  'use strict';
  const script = document.currentScript;
  const root = new URL('.', script.src);
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = new URL('version-picker.css', root).href;
  document.head.append(stylesheet);

  fetch(new URL('versions.json', root)).then(response => {
    if (!response.ok) throw new Error('Version list unavailable');
    return response.json();
  }).then(manifest => {
    const header = document.querySelector('.reader-header');
    if (!header) return;
    const active = manifest.versions.find(version => location.pathname === new URL(version.path, root).pathname || location.pathname === new URL(version.path + 'index.html', root).pathname)
      || manifest.versions.find(version => version.id === manifest.default);
    const button = document.createElement('button');
    button.className = 'version-button';
    button.type = 'button';
    button.textContent = 'Versions';
    button.setAttribute('aria-haspopup', 'dialog');
    button.setAttribute('aria-controls', 'version-dialog');
    button.setAttribute('aria-label', `Switch version. Current: ${active.name}`);
    const dialog = document.createElement('dialog');
    dialog.id = 'version-dialog';
    dialog.setAttribute('aria-labelledby', 'version-title');
    dialog.innerHTML = '<div class="dialog-head"><span class="eyebrow">Saved designs</span><button type="button" class="version-close" aria-label="Close versions">×</button></div><h2 id="version-title">Choose a version.</h2><p class="dialog-intro">Explore earlier designs. Switching keeps you on the same story where available.</p><nav class="version-list" aria-label="Newsletter versions"></nav>';
    const list = dialog.querySelector('.version-list');
    [...manifest.versions].reverse().forEach(version => {
      const link = document.createElement('a');
      link.className = 'version-option';
      const url = new URL(version.path, root);
      url.hash = location.hash;
      link.href = url.href;
      if (version.id === active.id) link.setAttribute('aria-current', 'page');
      const name = document.createElement('strong');
      name.textContent = `${version.id.toUpperCase()} · ${version.name}`;
      const detail = document.createElement('span');
      detail.textContent = version.description;
      const meta = document.createElement('small');
      meta.textContent = `${version.date}${version.id === active.id ? ' · Viewing' : ''}${version.id === manifest.default ? ' · Default' : ''}`;
      link.append(name, detail, meta);
      // Refresh at activation: the reader changes its hash without hashchange events.
      link.addEventListener('click', () => {
        const destination = new URL(version.path, root);
        destination.hash = location.hash;
        link.href = destination.href;
      });
      list.append(link);
    });
    dialog.addEventListener('keydown', event => event.stopPropagation());
    dialog.querySelector('.version-close').addEventListener('click', () => dialog.close());
    button.addEventListener('click', () => {
      list.querySelectorAll('a').forEach(link => {
        const url = new URL(link.href);
        url.hash = location.hash;
        link.href = url.href;
      });
      dialog.showModal();
    });
    dialog.addEventListener('click', event => {
      const bounds = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
    });
    document.body.append(dialog);
    header.insertBefore(button, document.getElementById('menu'));
  }).catch(error => console.warn('Could not load saved versions:', error.message));
})();

document.getElementById('check_for_updates').addEventListener('click', () => {
    window.electronAPI.checkForUpdates();
});
  
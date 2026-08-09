function openDeveloperModal() {
  const modal = document.getElementById('developerModal');
  if (modal) {
    modal.classList.add('active');
    if (typeof lucide !== 'undefined') {
      lucide.createIcons(); // Refreshes Lucide icons inside the modal
    }
  }
}

function closeDeveloperModal() {
  const modal = document.getElementById('developerModal');
  if (modal) {
    modal.classList.remove('active');
  }
}

// Close modal when clicking outside the content box
window.addEventListener('click', (e) => {
  const modal = document.getElementById('developerModal');
  if (e.target === modal) {
    closeDeveloperModal();
  }
});
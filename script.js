const cameraInput = document.querySelector('#cameraInput');
const galleryInput = document.querySelector('#galleryInput');
const cameraButton = document.querySelector('#cameraButton');
const galleryButton = document.querySelector('#galleryButton');
const pendingButton = document.querySelector('#pendingButton');
const statusMessage = document.querySelector('#statusMessage');
const pendingText = document.querySelector('#pendingText');

const STORAGE_KEY = 'compleanno-simone-pending-files';

function getPendingFiles() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function updatePendingText() {
  const count = getPendingFiles().length;
  pendingText.textContent = count === 0
    ? 'Nessun file pronto per l\'invio'
    : `${count} file selezionat${count === 1 ? 'o' : 'i'} in attesa`;
}

function saveSelectedFiles(fileList) {
  const files = Array.from(fileList || []);
  if (!files.length) return;

  // In questa fase salviamo solo i dati descrittivi della selezione.
  // L'invio reale al Synology verrà collegato successivamente.
  const current = getPendingFiles();
  const selected = files.map((file) => ({
    name: file.name,
    type: file.type || 'file',
    size: file.size,
    selectedAt: new Date().toISOString()
  }));

  localStorage.setItem(STORAGE_KEY, JSON.stringify([...current, ...selected]));
  updatePendingText();
  statusMessage.textContent = `${files.length} file selezionat${files.length === 1 ? 'o' : 'i'}. Per ora è solo una prova: l'invio al NAS verrà collegato dopo.`;
}

cameraButton.addEventListener('click', () => cameraInput.click());
galleryButton.addEventListener('click', () => galleryInput.click());
cameraInput.addEventListener('change', (event) => saveSelectedFiles(event.target.files));
galleryInput.addEventListener('change', (event) => saveSelectedFiles(event.target.files));

pendingButton.addEventListener('click', () => {
  const count = getPendingFiles().length;
  statusMessage.textContent = count
    ? `Ci sono ${count} file in attesa. In futuro questo pulsante li invierà al Synology.`
    : 'Non hai ancora selezionato foto o video.';
});

updatePendingText();

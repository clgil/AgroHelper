// Tab functionality
document.querySelectorAll('.tab-button').forEach(button => {
  button.addEventListener('click', () => {
    // Remove active class from all tabs
    document.querySelectorAll('.tab-button').forEach(btn => {
      btn.classList.remove('active', 'text-green-600', 'border-green-500');
      btn.classList.add('text-gray-500', 'border-transparent');
    });
    
    // Add active class to clicked tab
    button.classList.add('active', 'text-green-600', 'border-green-500');
    button.classList.remove('text-gray-500', 'border-transparent');
    
    // Hide all tab content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.add('hidden');
    });
    
    // Show selected tab content
    const tabId = button.getAttribute('data-tab') + '-tab';
    document.getElementById(tabId).classList.remove('hidden');
  });
});

// Drag and drop functionality
const dragArea = document.getElementById('drag-area');
const fileInput = document.getElementById('file-input');
const previewImg = document.getElementById('preview-img');
const imagePreview = document.getElementById('image-preview');
const clearPreview = document.getElementById('clear-preview');
const analyzeBtn = document.getElementById('analyze-btn');
const resultsSection = document.getElementById('results-section');
const resultsContainer = document.getElementById('results-container');

// Drag events
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dragArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
  dragArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
  dragArea.addEventListener(eventName, unhighlight, false);
});

function highlight() {
  dragArea.classList.add('active');
}

function unhighlight() {
  dragArea.classList.remove('active');
}

// Handle file drop
dragArea.addEventListener('drop', handleDrop, false);
function handleDrop(e) {
  const dt = e.dataTransfer;
  const files = dt.files;
  if (files.length) {
    fileInput.files = files;
    updatePreview(files[0]);
  }
}

// Handle file input change
fileInput.addEventListener('change', function() {
  if (this.files && this.files[0]) {
    updatePreview(this.files[0]);
  }
});

// Update preview
function updatePreview(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    previewImg.src = e.target.result;
    imagePreview.classList.remove('hidden');
    analyzeBtn.disabled = false;
  };
  reader.readAsDataURL(file);
}

// Clear preview
clearPreview.addEventListener('click', function() {
  fileInput.value = '';
  imagePreview.classList.add('hidden');
  analyzeBtn.disabled = true;
  resultsSection.classList.add('hidden');
});

// Mock AI analysis
analyzeBtn.addEventListener('click', function() {
  // Show loading state
  analyzeBtn.disabled = true;
  analyzeBtn.innerHTML = '<svg class="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';
  
  // Simulate API call
  setTimeout(() => {
    // Mock results
    const results = [
      {
        plague: 'Gusano cogollero',
        scientific: 'Spodoptera frugiperda',
        confidence: 87,
        description: 'Plaga común en maíz que ataca las hojas jóvenes y el cogollo. Se observan dańos en forma de mordeduras irregulares.',
        solutions: [
          'Aplicar solución de ceniza de tabaco (1kg por 10L de agua)',
          'Introducir enemigos naturales como trichogramma',
          'Rotar cultivos con leguminosas'
        ],
        severity: 'alta'
      },
      {
        plague: 'Pulgón',
        scientific: 'Aphidoidea',
        confidence: 63,
        description: 'Insecto chupador que afecta múltiples cultivos y transmite virus. Se observan colonias en brotes tiernos.',
        solutions: [
          'Aplicar jabón potásico (200g por 10L de agua)',
          'Usar extracto de ajo y cebolla',
          'Fomentar la presencia de mariquitas'
        ],
        severity: 'media'
      }
    ];
    
    // Display results
    displayResults(results);
    
    // Reset button
    analyzeBtn.disabled = false;
    analyzeBtn.textContent = 'Analizar Imagen';
  }, 2000);
});

function displayResults(results) {
  resultsContainer.innerHTML = '';
  
  results.forEach((result, index) => {
    const resultCard = document.createElement('div');
    resultCard.className = 'result-card bg-gray-50 rounded-lg p-4 border-l-4 transition-all duration-300';
    resultCard.style.borderLeftColor = result.severity === 'alta' ? '#ef4444' : result.severity === 'media' ? '#f59e0b' : '#10b981';
    
    resultCard.innerHTML = `
      <div class="flex justify-between items-start mb-2">
        <h4 class="font-semibold text-gray-900">${result.plague}</h4>
        <span class="text-sm font-medium px-2 py-1 rounded-full ${result.severity === 'alta' ? 'bg-red-100 text-red-800' : result.severity === 'media' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}">
          ${result.severity === 'alta' ? 'Alta' : result.severity === 'media' ? 'Media' : 'Baja'} severidad
        </span>
      </div>
      
      <p class="text-sm text-gray-600 mb-3 italic">${result.scientific}</p>
      
      <div class="flex items-center mb-3">
        <div class="flex-1 bg-gray-200 rounded-full h-2">
          <div class="bg-${result.severity === 'alta' ? 'red' : result.severity === 'media' ? 'yellow' : 'green'}-500 h-2 rounded-full" style="width: ${result.confidence}%"></div>
        </div>
        <span class="ml-3 text-sm font-medium text-gray-700">${result.confidence}% de confianza</span>
      </div>
      
      <p class="text-gray-700 mb-4 text-sm">${result.description}</p>
      
      <div>
        <h5 class="font-medium text-gray-900 mb-2">Soluciones recomendadas:</h5>
        <ul class="list-disc list-inside text-sm text-gray-700 space-y-1">
          ${result.solutions.map(solution => `<li>${solution}</li>`).join('')}
        </ul>
      </div>
    `;
    
    resultsContainer.appendChild(resultCard);
    
    // Animate in
    setTimeout(() => {
      resultCard.classList.add('visible');
    }, index * 100);
  });
  
  resultsSection.classList.remove('hidden');
}

// Describe button functionality
document.getElementById('describe-btn').addEventListener('click', function() {
  const crop = document.getElementById('crop-select').value;
  const symptoms = document.getElementById('symptoms-input').value.trim();
  
  if (!crop || !symptoms) {
    alert('Por favor, selecciona un cultivo y describe los síntomas.');
    return;
  }
  
  // Show loading
  this.disabled = true;
  this.innerHTML = '<svg class="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';
  
  // Simulate analysis
  setTimeout(() => {
    const mockResults = [
      {
        plague: crop === 'maiz' ? 'Gusano cogollero' : crop === 'tomate' ? 'Mosca blanca' : 'Pulgón',
        scientific: crop === 'maiz' ? 'Spodoptera frugiperda' : crop === 'tomate' ? 'Bemisia tabaci' : 'Aphidoidea',
        confidence: Math.floor(Math.random() * 30) + 60,
        description: `Posible ${crop === 'maiz' ? 'dańo por gusano cogollero' : crop === 'tomate' ? 'infestación por mosca blanca' : 'ataque de pulgón'} basado en los síntomas descritos.`,
        solutions: [
          'Inspeccionar regularmente las plantas en horas de la mańana',
          'Aplicar soluciones biológicas cada 7-10 días',
          'Eliminar plantas muy afectadas para evitar propagación'
        ],
        severity: Math.random() > 0.5 ? 'alta' : 'media'
      }
    ];
    
    displayResults(mockResults);
    
    // Reset button
    this.disabled = false;
    this.textContent = 'Identificar Problema';
  }, 1500);
});

// Theme toggle
document.getElementById('theme-toggle').addEventListener('click', function() {
  // In a real app, this would toggle between light and dark mode
  alert('Modo oscuro no disponible en esta demo. En una implementación real, alternaría entre temas claro y oscuro.');
});

// Offline status simulation
let isOnline = true;
window.addEventListener('online', () => {
  isOnline = true;
  document.getElementById('offline-status').innerHTML = '<div class="w-2 h-2 bg-green-400 rounded-full"></div><span>Online</span>';
});

window.addEventListener('offline', () => {
  isOnline = false;
  document.getElementById('offline-status').innerHTML = '<div class="w-2 h-2 bg-red-400 rounded-full"></div><span>Offline</span>';
});

// Initialize TensorFlow.js (in a real app)
async function initTensorFlow() {
  try {
    await tf.ready();
    console.log('TensorFlow.js is ready');
    // In a real app, you would load the pre-trained model here
    // const model = await tf.loadGraphModel('path/to/model.json');
  } catch (error) {
    console.error('Error loading TensorFlow.js:', error);
  }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  initTensorFlow();
  
  // Check initial online status
  if (!navigator.onLine) {
    document.getElementById('offline-status').innerHTML = '<div class="w-2 h-2 bg-red-400 rounded-full"></div><span>Offline</span>';
  }
});
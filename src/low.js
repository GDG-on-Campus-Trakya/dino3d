// Styles
import './styles/css/style.min.css'

// UI Components
import { createPreloader } from './ui/preloader'
import { createErrorScreen } from './ui/errorScreen'
import { createGameOver } from './ui/gameOver'

// Initialize UI (low quality - no modal)
document.body.innerHTML = `
  ${createPreloader()}
  ${createErrorScreen()}
  ${createGameOver()}
`

// Load Three.js and dependencies from CDN
async function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

// Load all required scripts
async function init() {
  try {
    // Load Three.js and addons
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/87/three.min.js')
    await loadScript('https://cdn.jsdelivr.net/npm/three@0.87.1/examples/js/controls/OrbitControls.js')
    await loadScript('https://cdn.jsdelivr.net/npm/three@0.87.1/examples/js/loaders/OBJLoader.js')
    await loadScript('https://cdn.jsdelivr.net/npm/three@0.87.1/examples/js/postprocessing/EffectComposer.js')
    await loadScript('https://cdn.jsdelivr.net/npm/three@0.87.1/examples/js/postprocessing/RenderPass.js')
    await loadScript('https://cdn.jsdelivr.net/npm/three@0.87.1/examples/js/postprocessing/ShaderPass.js')
    await loadScript('https://cdn.jsdelivr.net/npm/three@0.87.1/examples/js/postprocessing/SAOPass.js')
    await loadScript('https://cdn.jsdelivr.net/npm/three@0.87.1/examples/js/shaders/CopyShader.js')
    await loadScript('https://cdn.jsdelivr.net/npm/three@0.87.1/examples/js/shaders/SAOShader.js')

    // Load other libraries
    await loadScript('/libs/vox/vox.min.js')
    await loadScript('/libs/nebula/three-nebula.js')
    await loadScript('/libs/howler/howler.min.js')
    await loadScript('/libs/visibly/visibly.js')

    // Load game (low quality version)
    await loadScript('/main-low.js')
  } catch (error) {
    console.error('Failed to load scripts:', error)
  }
}

init()
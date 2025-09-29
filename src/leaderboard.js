// Styles
import './styles/css/style.min.css'
import './styles/css/leaderboard.css'

// Create leaderboard UI
document.body.className = 'leaderboard-page'
document.body.innerHTML = `
  <div class="leaderboard-container">
    <div id="easter-egg-trigger" class="easter-egg-trigger"></div>
    <div class="leaderboard-header">
      <h1>🏆 LİDERLİK TABLOSU</h1>
      <a href="/" class="back-button">← Oyuna Dön</a>
    </div>

    <div class="leaderboard-content">
      <div id="leaderboard-list" class="leaderboard-list">
        <!-- Leaderboard entries will be inserted here -->
      </div>

      <div class="leaderboard-empty hidden" id="leaderboard-empty">
        <p>Henüz kayıt yok!</p>
        <p class="small">Oyunu oyna ve ilk sıralamaya gir!</p>
      </div>
    </div>
  </div>
`

// Load leaderboard manager
async function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

async function init() {
  await loadScript('/js/src/leaderboard_manager.js')

  // Wait a bit for the class to be available
  await new Promise(resolve => setTimeout(resolve, 100))

  // Initialize leaderboard
  const leaderboardManager = new LeaderboardManager()

  function displayLeaderboard() {
    const leaderboard = leaderboardManager.getLeaderboard()
    const listElement = document.getElementById('leaderboard-list')
    const emptyElement = document.getElementById('leaderboard-empty')

    if (leaderboard.length === 0) {
      listElement.innerHTML = ''
      emptyElement.classList.remove('hidden')
      return
    }

    emptyElement.classList.add('hidden')

    const html = leaderboard.map((entry, index) => {
      const rank = index + 1
      const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}.`
      const rankClass = rank <= 3 ? `rank-${rank}` : ''
      const date = new Date(entry.date)
      const dateStr = date.toLocaleDateString('tr-TR')

      return `
        <div class="leaderboard-entry ${rankClass}">
          <div class="entry-rank">${medal}</div>
          <div class="entry-name">${escapeHtml(entry.name)}</div>
          <div class="entry-score">${entry.score.toLocaleString('tr-TR')}</div>
          <div class="entry-date">${dateStr}</div>
        </div>
      `
    }).join('')

    listElement.innerHTML = html
  }

  function escapeHtml(text) {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }

  // Easter egg - triple click top right corner to clear leaderboard
  let clickCount = 0
  let clickTimer = null
  const easterEggTrigger = document.getElementById('easter-egg-trigger')

  easterEggTrigger.addEventListener('click', function() {
    clickCount++

    // Reset counter after 1 second
    clearTimeout(clickTimer)
    clickTimer = setTimeout(() => {
      clickCount = 0
    }, 1000)

    // Show visual feedback
    if (clickCount === 1) {
      easterEggTrigger.style.background = 'rgba(255, 107, 107, 0.1)'
    } else if (clickCount === 2) {
      easterEggTrigger.style.background = 'rgba(255, 107, 107, 0.3)'
    }

    // Activate easter egg on triple click
    if (clickCount === 3) {
      easterEggTrigger.style.background = 'rgba(255, 107, 107, 0.5)'

      if (confirm('🗑️ Liderlik tablosunu temizlemek istediğinizden emin misiniz?')) {
        leaderboardManager.clearLeaderboard()
        displayLeaderboard()

        // Show success message
        easterEggTrigger.style.background = 'rgba(76, 175, 80, 0.5)'
        setTimeout(() => {
          easterEggTrigger.style.background = ''
        }, 500)
      } else {
        easterEggTrigger.style.background = ''
      }

      clickCount = 0
    }
  })

  // Display leaderboard on load
  displayLeaderboard()
}

init()
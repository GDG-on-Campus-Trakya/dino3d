export function createGameOver() {
  return `
    <div id="game-restart" class="hidden">
      <h1>OYUN BİTTİ</h1>
      <img src="/media/repeat.png">
      <div class="restart-buttons">
        <button id="view-leaderboard-btn" class="leaderboard-btn">Liderlik Tablosu</button>
      </div>
    </div>
  `
}
export function createModal() {
  return `
    <div id="name-input-modal" class="modal hidden">
      <div class="modal-content">
        <h2>Tebrikler!</h2>
        <p>Skorun: <span id="final-score">0</span></p>
        <p class="modal-subtitle">Liderlik tablosuna girmek için adını gir:</p>
        <input type="text" id="player-name-input" maxlength="20" placeholder="Adınız..." autocomplete="off">
        <div class="modal-buttons">
          <button id="submit-score-btn" class="submit-btn">Kaydet</button>
          <button id="skip-score-btn" class="skip-btn">Atla</button>
        </div>
      </div>
    </div>
  `
}
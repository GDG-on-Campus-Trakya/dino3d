export function createErrorScreen() {
  return `
    <div id="chrome-no-internet">
      <div class="poster"></div>
      <h1>İnternet Bağlantısı Yok</h1>
      <div class="info">
        <p>Aşağıdakileri deneyin:</p>
        <ul>
          <li>Ağ kablolarını, modemi ve yönlendiriciyi kontrol edin.</li>
          <li>Wi-Fi ağına tekrar bağlanın.</li>
          <li id="game-start" class="hidden">&laquo;Oyunu Başlat&raquo;</li>
        </ul>
        <small>ERR_LOADING_ASSETS</small>
        <small id="game-load-progress">0%</small>
      </div>
    </div>
  `
}
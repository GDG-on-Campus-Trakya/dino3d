export function createPreloader() {
  return `
    <div id="preloader">
      <div class="progress">
        <div class="chart">
          <div id="game-load-progress" class="bar lime bar-0">
            <div class="face top">
              <div class="growing-bar"></div>
            </div>
            <div class="face side-0">
              <div class="growing-bar"></div>
            </div>
            <div class="face floor">
              <div class="growing-bar"></div>
            </div>
            <div class="face side-a"></div>
            <div class="face side-b"></div>
            <div class="face side-1">
              <div class="growing-bar"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}
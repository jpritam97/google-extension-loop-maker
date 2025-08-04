// Simple Auto Clicker Loop
class SimpleAutoClicker {
  constructor() {
    this.startTime = null;
    this.endTime = null;
    this.isLooping = false;
    this.currentVideo = null;
    this.waitingForStartClick = false;
    this.waitingForEndClick = false;
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    console.log('Simple Auto Clicker: Setting up...');
    
    // Don't create panel automatically - wait for extension icon click
    // this.createControls();
    
    // Try to find videos and audio for functionality
    const videos = document.querySelectorAll('video');
    const audios = document.querySelectorAll('audio');
    console.log('Simple Auto Clicker: Found', videos.length, 'videos and', audios.length, 'audio elements');
    
    if (videos.length > 0) {
      this.currentVideo = videos[0]; // Use the first video found
    } else if (audios.length > 0) {
      this.currentVideo = audios[0]; // Use the first audio found
    } else {
      // Try to find YouTube Music player
      this.findYouTubeMusicPlayer();
    }
    
    // Add click listener to document for timeline clicks
    this.setupTimelineClick();
    
    // Periodic check for YouTube Music elements (they might load dynamically)
    if (window.location.hostname.includes('music.youtube.com')) {
      console.log('Simple Auto Clicker: YouTube Music detected, setting up periodic checks');
      
      // Debug timeline detection after a short delay
      setTimeout(() => {
        this.debugTimelineDetection();
      }, 1000);
      
      setInterval(() => {
        if (!this.currentVideo) {
          console.log('Simple Auto Clicker: No media found, retrying...');
          this.findYouTubeMusicPlayer();
        }
      }, 2000);
    }
  }

  createControls() {
    // Skip if controls already exist
    if (document.querySelector('.simple-auto-clicker')) {
      console.log('Simple Auto Clicker: Controls already exist');
      return;
    }

    console.log('Simple Auto Clicker: Creating new controls');
    
    // Create floating control panel
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'simple-auto-clicker';
    controlsContainer.innerHTML = `
      <div class="control-panel">
        <div class="drag-handle">
          <span class="drag-dots">⋮⋮⋮</span>
          <button class="close-btn" title="Close panel">✕</button>
        </div>
        <div class="buttons">
          <button class="start-btn" title="Click to store current time as start">Start</button>
          <button class="end-btn" title="Click to store current time as end">End</button>
          <button class="resume-btn" title="Resume video">▶</button>
          <button class="pause-btn" title="Pause video">⏸</button>
          <button class="refresh-btn" title="Refresh status">🔄</button>
        </div>
        <div class="status">
          <span class="start-time">Start: --</span>
          <span class="end-time">End: --</span>
        </div>
        <div class="loop-status">
          <span class="loop-indicator">Loop: OFF</span>
        </div>
      </div>
    `;

    // Add to page
    document.body.appendChild(controlsContainer);

    // Add event listeners
    const startBtn = controlsContainer.querySelector('.start-btn');
    const endBtn = controlsContainer.querySelector('.end-btn');
    const resumeBtn = controlsContainer.querySelector('.resume-btn');
    const pauseBtn = controlsContainer.querySelector('.pause-btn');

    startBtn.addEventListener('click', () => this.waitForStartClick(controlsContainer));
    endBtn.addEventListener('click', () => this.waitForEndClick(controlsContainer));
    resumeBtn.addEventListener('click', () => this.resumeVideo());
    pauseBtn.addEventListener('click', () => this.pauseVideo());
    
    const refreshBtn = controlsContainer.querySelector('.refresh-btn');
    refreshBtn.addEventListener('click', () => this.refreshStatus(controlsContainer));
    
    const closeBtn = controlsContainer.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => this.closePanel(controlsContainer));

    // Make panel draggable
    this.makeDraggable(controlsContainer);
  }

  waitForStartClick(controlsContainer) {
    if (!this.currentVideo) {
      this.showNotification('No video or audio found!', 'error');
      return;
    }
    
    this.waitingForStartClick = true;
    this.waitingForEndClick = false;
    
    const startBtn = controlsContainer.querySelector('.start-btn');
    startBtn.style.background = '#ff9800';
    startBtn.textContent = 'Click Media Timeline';
    
    this.showNotification('Click anywhere on the video/audio timeline to set start time');
  }

  waitForEndClick(controlsContainer) {
    if (!this.currentVideo) {
      this.showNotification('No video or audio found!', 'error');
      return;
    }
    
    this.waitingForEndClick = true;
    this.waitingForStartClick = false;
    
    const endBtn = controlsContainer.querySelector('.end-btn');
    endBtn.style.background = '#ff9800';
    endBtn.textContent = 'Click Media Timeline';
    
    this.showNotification('Click anywhere on the video/audio timeline to set end time');
  }

  setStartTime(controlsContainer) {
    if (!this.currentVideo) {
      this.showNotification('No video or audio found!', 'error');
      return;
    }
    
    // For YouTube Music proxy, get current time from progress bar
    if (this.currentVideo.currentTime === 0 && typeof this.currentVideo.currentTime === 'number') {
      this.updateYouTubeMusicTime();
    }
    
    this.startTime = this.currentVideo.currentTime;
    const startTimeDisplay = controlsContainer.querySelector('.start-time');
    startTimeDisplay.textContent = `Start: ${this.formatTime(this.startTime)}`;
    startTimeDisplay.style.color = '#4CAF50';
    
    // Reset button
    const startBtn = controlsContainer.querySelector('.start-btn');
    startBtn.style.background = '#4CAF50';
    startBtn.textContent = 'Start';
    
    this.waitingForStartClick = false;
    this.showNotification(`Start time set: ${this.formatTime(this.startTime)}`);
    
    // If we have both start and end times, start the loop
    if (this.startTime && this.endTime) {
      this.startLoop(controlsContainer);
    }
  }

  setEndTime(controlsContainer) {
    if (!this.currentVideo) {
      this.showNotification('No video or audio found!', 'error');
      return;
    }
    
    // For YouTube Music proxy, get current time from progress bar
    if (this.currentVideo.currentTime === 0 && typeof this.currentVideo.currentTime === 'number') {
      this.updateYouTubeMusicTime();
    }
    
    this.endTime = this.currentVideo.currentTime;
    const endTimeDisplay = controlsContainer.querySelector('.end-time');
    endTimeDisplay.textContent = `End: ${this.formatTime(this.endTime)}`;
    endTimeDisplay.style.color = '#f44336';
    
    // Reset button
    const endBtn = controlsContainer.querySelector('.end-btn');
    endBtn.style.background = '#f44336';
    endBtn.textContent = 'End';
    
    this.waitingForEndClick = false;
    this.showNotification(`End time set: ${this.formatTime(this.endTime)}`);
    
    // If we have both start and end times, start the loop
    if (this.startTime && this.endTime) {
      this.startLoop(controlsContainer);
    }
  }

  refreshStatus(controlsContainer) {
    console.log('Refresh button clicked - clearing all timestamps');
    
    // Clear all timestamps and reset to initial state
    this.startTime = null;
    this.endTime = null;
    this.isLooping = false;
    this.waitingForStartClick = false;
    this.waitingForEndClick = false;
    
    console.log('Timestamps cleared - startTime:', this.startTime, 'endTime:', this.endTime);
    
    // Reset start time display
    const startTimeDisplay = controlsContainer.querySelector('.start-time');
    startTimeDisplay.textContent = 'Start: --';
    startTimeDisplay.style.color = '#666';
    
    // Reset end time display
    const endTimeDisplay = controlsContainer.querySelector('.end-time');
    endTimeDisplay.textContent = 'End: --';
    endTimeDisplay.style.color = '#666';
    
    // Reset loop status
    const loopIndicator = controlsContainer.querySelector('.loop-indicator');
    loopIndicator.textContent = 'Loop: OFF';
    loopIndicator.style.color = '#666';
    
    // Reset button colors and text
    const startBtn = controlsContainer.querySelector('.start-btn');
    startBtn.style.background = '#4CAF50';
    startBtn.textContent = 'Start';
    
    const endBtn = controlsContainer.querySelector('.end-btn');
    endBtn.style.background = '#f44336';
    endBtn.textContent = 'End';
    
    console.log('Display updated - should show Start: -- and End: --');
    this.showNotification('All timestamps cleared! Ready for new loop.');
  }

  closePanel(controlsContainer) {
    controlsContainer.style.display = 'none';
    this.showNotification('Panel closed. Click extension icon to show again.');
  }

  showFloatingPanel() {
    // Check if panel already exists
    let existingPanel = document.querySelector('.simple-auto-clicker');
    
    if (existingPanel) {
      // If panel exists but is hidden, show it
      if (existingPanel.style.display === 'none') {
        existingPanel.style.display = 'block';
        this.showNotification('Panel shown!');
      } else {
        this.showNotification('Panel is already visible!');
      }
    } else {
      // Create new panel if it doesn't exist
      this.createControls();
      this.showNotification('Panel created!');
    }
  }

  startLoop(controlsContainer) {
    if (!this.currentVideo) {
      this.showNotification('No video or audio found!', 'error');
      return;
    }
    
    this.isLooping = true;
    
    const loopIndicator = controlsContainer.querySelector('.loop-indicator');
    loopIndicator.textContent = 'Loop: ON';
    loopIndicator.style.color = '#4CAF50';
    
    // Add timeupdate listener for automatic looping
    this.currentVideo.addEventListener('timeupdate', () => this.handleTimeUpdate());
    
    this.showNotification('Automatic loop started!');
  }

  resumeVideo() {
    if (!this.currentVideo) {
      this.showNotification('No video or audio found!', 'error');
      return;
    }
    
    try {
      this.currentVideo.play();
      this.showNotification('Media resumed');
    } catch (error) {
      this.showNotification('Could not resume media', 'error');
    }
  }

  pauseVideo() {
    if (!this.currentVideo) {
      this.showNotification('No video or audio found!', 'error');
      return;
    }
    
    try {
      this.currentVideo.pause();
      this.showNotification('Media paused');
    } catch (error) {
      this.showNotification('Could not pause media', 'error');
    }
  }

  handleTimeUpdate() {
    if (!this.isLooping || !this.currentVideo) return;
    
    // Check if video reached end time
    if (this.currentVideo.currentTime >= this.endTime) {
      // Automatically jump to start time (this is like clicking the start button)
      this.currentVideo.currentTime = this.startTime;
      this.showNotification(`Jumped to start: ${this.formatTime(this.startTime)}`);
    }
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  makeDraggable(controlsContainer) {
    let isDragging = false;
    let startX, startY, startLeft, startTop;

    const dragHandle = controlsContainer.querySelector('.drag-handle');
    
    dragHandle.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startLeft = parseInt(controlsContainer.style.left) || 0;
      startTop = parseInt(controlsContainer.style.top) || 0;
      
      controlsContainer.style.cursor = 'grabbing';
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      controlsContainer.style.left = (startLeft + deltaX) + 'px';
      controlsContainer.style.top = (startTop + deltaY) + 'px';
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        controlsContainer.style.cursor = 'default';
      }
    });
  }

  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'error' ? '#f44336' : '#4CAF50'};
      color: white;
      padding: 10px 15px;
      border-radius: 5px;
      font-family: Arial, sans-serif;
      font-size: 14px;
      z-index: 10001;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 2000);
  }

  findYouTubeMusicPlayer() {
    console.log('Simple Auto Clicker: Searching for YouTube Music player...');
    
    // More comprehensive YouTube Music selectors
    const ytMusicSelectors = [
      'ytmusic-player',
      '[data-testid="player"]',
      '[data-testid="player-bar"]',
      '.ytmusic-player',
      '#player',
      '[role="application"]',
      'ytmusic-app',
      '[data-testid="music-player"]',
      '.music-player',
      '[data-testid="progress-bar"]',
      '.progress-bar'
    ];
    
    for (const selector of ytMusicSelectors) {
      const player = document.querySelector(selector);
      if (player) {
        console.log('Simple Auto Clicker: Found YouTube Music player:', selector);
        
        // Try to find the actual media element within the player
        const mediaElement = player.querySelector('video, audio, [data-testid="media"]');
        if (mediaElement) {
          this.currentVideo = mediaElement;
          console.log('Simple Auto Clicker: Found media element in YouTube Music player');
          return;
        }
        
        // If no media element found, create a proxy for the player
        this.createYouTubeMusicProxy(player);
        return;
      }
    }
    
    // Try to find any element with time-related attributes
    const timeElements = document.querySelectorAll('[aria-valuenow], [data-time], [data-current-time]');
    console.log('Simple Auto Clicker: Found', timeElements.length, 'time-related elements');
    
    if (timeElements.length > 0) {
      console.log('Simple Auto Clicker: Creating proxy from time elements');
      this.createYouTubeMusicProxyFromElements(timeElements);
      return;
    }
    
    console.log('Simple Auto Clicker: No YouTube Music player found');
  }

  createYouTubeMusicProxy(player) {
    // Create a proxy object that mimics video/audio API for YouTube Music
    this.currentVideo = {
      currentTime: 0,
      duration: 0,
      play: () => {
        const playButton = document.querySelector('[data-testid="play-pause-button"], .play-button, [aria-label*="Play"], [aria-label*="play"], [title*="Play"], [title*="play"]');
        if (playButton) {
          console.log('Simple Auto Clicker: Clicking play button');
          playButton.click();
        } else {
          console.log('Simple Auto Clicker: No play button found');
        }
      },
      pause: () => {
        const pauseButton = document.querySelector('[data-testid="play-pause-button"], .pause-button, [aria-label*="Pause"], [aria-label*="pause"], [title*="Pause"], [title*="pause"]');
        if (pauseButton) {
          console.log('Simple Auto Clicker: Clicking pause button');
          pauseButton.click();
        } else {
          console.log('Simple Auto Clicker: No pause button found');
        }
      },
      addEventListener: (event, callback) => {
        // Listen for time updates from YouTube Music
        if (event === 'timeupdate') {
          setInterval(() => {
            this.updateYouTubeMusicTime();
            callback();
          }, 100);
        }
      }
    };
    
    console.log('Simple Auto Clicker: Created YouTube Music proxy');
  }

  createYouTubeMusicProxyFromElements(timeElements) {
    // Create a proxy object from time-related elements
    this.currentVideo = {
      currentTime: 0,
      duration: 0,
      play: () => {
        const playButton = document.querySelector('[data-testid="play-pause-button"], .play-button, [aria-label*="Play"], [aria-label*="play"], [title*="Play"], [title*="play"]');
        if (playButton) {
          console.log('Simple Auto Clicker: Clicking play button');
          playButton.click();
        } else {
          console.log('Simple Auto Clicker: No play button found');
        }
      },
      pause: () => {
        const pauseButton = document.querySelector('[data-testid="play-pause-button"], .pause-button, [aria-label*="Pause"], [aria-label*="pause"], [title*="Pause"], [title*="pause"]');
        if (pauseButton) {
          console.log('Simple Auto Clicker: Clicking pause button');
          pauseButton.click();
        } else {
          console.log('Simple Auto Clicker: No pause button found');
        }
      },
      addEventListener: (event, callback) => {
        // Listen for time updates from YouTube Music
        if (event === 'timeupdate') {
          setInterval(() => {
            this.updateYouTubeMusicTimeFromElements(timeElements);
            callback();
          }, 100);
        }
      }
    };
    
    console.log('Simple Auto Clicker: Created YouTube Music proxy from time elements');
  }

  updateYouTubeMusicTime() {
    // Try to get current time from YouTube Music progress bar
    const progressBar = document.querySelector('[data-testid="progress-bar"], .progress-bar, [role="slider"]');
    if (progressBar) {
      const ariaValueNow = progressBar.getAttribute('aria-valuenow');
      const ariaValueMax = progressBar.getAttribute('aria-valuemax');
      
      if (ariaValueNow && ariaValueMax) {
        const currentTime = parseFloat(ariaValueNow);
        const duration = parseFloat(ariaValueMax);
        
        this.currentVideo.currentTime = currentTime;
        this.currentVideo.duration = duration;
        console.log('Simple Auto Clicker: Updated time from progress bar:', currentTime, '/', duration);
      }
    }
  }

  updateYouTubeMusicTimeFromElements(timeElements) {
    // Try to get current time from any time-related element
    for (const element of timeElements) {
      const ariaValueNow = element.getAttribute('aria-valuenow');
      const ariaValueMax = element.getAttribute('aria-valuemax');
      const dataTime = element.getAttribute('data-time');
      const dataCurrentTime = element.getAttribute('data-current-time');
      
      if (ariaValueNow && ariaValueMax) {
        const currentTime = parseFloat(ariaValueNow);
        const duration = parseFloat(ariaValueMax);
        
        this.currentVideo.currentTime = currentTime;
        this.currentVideo.duration = duration;
        console.log('Simple Auto Clicker: Updated time from element:', currentTime, '/', duration);
        return;
      } else if (dataTime) {
        const time = parseFloat(dataTime);
        this.currentVideo.currentTime = time;
        console.log('Simple Auto Clicker: Updated time from data-time:', time);
        return;
      } else if (dataCurrentTime) {
        const time = parseFloat(dataCurrentTime);
        this.currentVideo.currentTime = time;
        console.log('Simple Auto Clicker: Updated time from data-current-time:', time);
        return;
      }
    }
  }

  // Debug method to manually test timeline detection
  debugTimelineDetection() {
    console.log('Simple Auto Clicker: Debugging timeline detection...');
    
    // Find all possible timeline elements
    const possibleTimelines = document.querySelectorAll(`
      [data-testid="progress-bar"],
      .progress-bar,
      [role="slider"],
      [data-testid="player-bar"],
      [data-testid="seek-bar"],
      [data-testid="time-range"],
      [class*="progress"],
      [class*="seek"],
      [class*="timeline"],
      [class*="bar"],
      [aria-valuenow],
      [data-time],
      [data-current-time]
    `);
    
    console.log('Simple Auto Clicker: Found', possibleTimelines.length, 'possible timeline elements:');
    possibleTimelines.forEach((el, index) => {
      console.log(`  ${index + 1}.`, el.tagName, el.className, el.getAttribute('data-testid'), el.getAttribute('aria-valuenow'));
    });
  }

  setupTimelineClick() {
    document.addEventListener('click', (e) => {
      if (!this.waitingForStartClick && !this.waitingForEndClick) return;
      
      console.log('Simple Auto Clicker: Click detected on:', e.target.tagName, e.target.className, 'id:', e.target.id);
      
      // Check if click is on video, audio, or media timeline
      const video = e.target.closest('video');
      const audio = e.target.closest('audio');
      const timeline = e.target.closest('[class*="progress"], [class*="timeline"], [class*="seek"], [class*="bar"]');
      
      // YouTube Music specific timeline detection - more comprehensive
      const ytMusicTimeline = e.target.closest(`
        [data-testid="progress-bar"], 
        .progress-bar, 
        [role="slider"], 
        [data-testid="player-bar"],
        [data-testid="seek-bar"],
        [data-testid="time-range"],
        [class*="progress"],
        [class*="seek"],
        [class*="timeline"],
        [class*="bar"],
        [aria-valuenow],
        [data-time],
        [data-current-time]
      `);
      
      // Also check for any clickable progress elements
      const anyProgressElement = e.target.closest('[onclick*="seek"], [onclick*="time"], [onclick*="progress"]');
      
      // YouTube Music specific: check if we're on YouTube Music and click is anywhere on the page
      const isYouTubeMusic = window.location.hostname.includes('music.youtube.com');
      const isAnyClickOnYouTubeMusic = isYouTubeMusic && (this.waitingForStartClick || this.waitingForEndClick);
      
      console.log('Simple Auto Clicker: Timeline detection - video:', !!video, 'audio:', !!audio, 'timeline:', !!timeline, 'ytMusicTimeline:', !!ytMusicTimeline, 'anyProgressElement:', !!anyProgressElement, 'isYouTubeMusic:', isYouTubeMusic);
      
      if (video || audio || timeline || ytMusicTimeline || anyProgressElement || isAnyClickOnYouTubeMusic) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Simple Auto Clicker: Timeline click detected!');
        
        const controlsContainer = document.querySelector('.simple-auto-clicker');
        if (!controlsContainer) {
          console.log('Simple Auto Clicker: No controls container found');
          return;
        }
        
        if (this.waitingForStartClick) {
          console.log('Simple Auto Clicker: Setting start time...');
          this.setStartTime(controlsContainer);
        } else if (this.waitingForEndClick) {
          console.log('Simple Auto Clicker: Setting end time...');
          this.setEndTime(controlsContainer);
        }
      } else {
        console.log('Simple Auto Clicker: Click not on timeline, ignoring');
      }
    });
  }

  // Handle messages from popup and background
  handlePopupMessage(request, sender, sendResponse) {
    if (request.action === "getStatus") {
      sendResponse({
        startTime: this.startTime,
        endTime: this.endTime,
        isLooping: this.isLooping
      });
    } else if (request.action === "showPanel") {
      // Show the floating panel when extension icon is clicked
      this.showFloatingPanel();
      sendResponse({success: true});
    }
  }
}

// Initialize the auto clicker
console.log('Simple Auto Clicker: Starting...');
const autoClicker = new SimpleAutoClicker();

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  autoClicker.handlePopupMessage(request, sender, sendResponse);
  return true; // Keep the message channel open for async response
}); 
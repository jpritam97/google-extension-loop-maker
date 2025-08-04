// Function to format time (MM:SS)
function formatTime(seconds) {
  if (!seconds || seconds === null) return '--:--';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Function to update the display
function updateDisplay() {
  // Get data from the current tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: "getStatus"}, function(response) {
      if (response) {
        document.getElementById('startTimeDisplay').textContent = `Start: ${formatTime(response.startTime)}`;
        document.getElementById('endTimeDisplay').textContent = `End: ${formatTime(response.endTime)}`;
        
        const loopStatus = document.getElementById('loopStatusDisplay');
        if (response.isLooping) {
          loopStatus.textContent = 'Loop: ON';
          loopStatus.classList.add('active');
        } else {
          loopStatus.textContent = 'Loop: OFF';
          loopStatus.classList.remove('active');
        }
      }
    });
  });
}

// Update display when popup opens
document.addEventListener('DOMContentLoaded', function() {
  updateDisplay();
  
  // Add refresh button functionality
  document.getElementById('refreshBtn').addEventListener('click', function() {
    updateDisplay();
  });
}); 
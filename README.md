# Simple Auto Clicker Loop - Chrome Extension

A powerful Chrome extension that automatically loops video and audio content between custom start and end points. Perfect for learning, practicing, or reviewing specific segments of media content.

## 🎯 Features

### Core Functionality
- **Automatic Loop Control**: Set start and end points, then let the extension automatically loop between them
- **Universal Media Support**: Works with HTML5 video and audio elements on any website
- **YouTube Music Support**: Special handling for YouTube Music's custom player interface
- **Floating Control Panel**: Draggable panel that hovers over any webpage
- **Direct Extension Access**: Click the extension icon to toggle the control panel

### User Interface
- **Start/End Buttons**: Click to store current media time as start or end point
- **Resume/Pause Controls**: Manual playback control buttons
- **Refresh Button**: Clear all timestamps and reset the loop
- **Real-time Status Display**: Shows current start time, end time, and loop status
- **Draggable Panel**: Move the control panel anywhere on the screen
- **Close Button**: Hide the panel (click extension icon to show again)

### Advanced Features
- **Click-to-Set Timeline**: Click Start/End button, then click anywhere on the media timeline to set the point
- **Automatic Loop Detection**: Loop starts automatically when both start and end times are set
- **Persistent State**: Remembers your settings while browsing
- **Cross-Platform Compatibility**: Works on any website with video or audio content

## 📁 Project Structure

```
Google extension/
├── manifest.json                    # Extension configuration
├── simple-auto-clicker.js          # Main content script
├── simple-auto-clicker.css         # Styles for the floating panel
├── background.js                   # Service worker for extension icon
├── simple-auto-clicker-popup.html  # Popup HTML (status display)
├── simple-auto-clicker-popup.js    # Popup JavaScript logic
├── icon16.png                      # Extension icon (16x16)
├── icon48.png                      # Extension icon (48x48)
├── icon128.png                     # Extension icon (128x128)
└── README.md                       # This file
```

## 🚀 Installation

### Method 1: Load as Unpacked Extension (Recommended)

1. **Download the Extension**
   - Download all files to a folder on your computer
   - Ensure all files are in the same directory

2. **Open Chrome Extensions Page**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)

3. **Load the Extension**
   - Click "Load unpacked"
   - Select the folder containing all the extension files
   - The extension should appear in your extensions list

4. **Verify Installation**
   - You should see "Simple Auto Clicker Loop" in your extensions
   - The extension icon should appear in your Chrome toolbar

### Method 2: Manual File Setup

1. **Create Extension Directory**
   ```bash
   mkdir simple-auto-clicker-extension
   cd simple-auto-clicker-extension
   ```

2. **Copy All Files**
   - Copy all project files to this directory
   - Ensure file names match exactly (case-sensitive)

3. **Load in Chrome**
   - Follow steps 2-4 from Method 1

## 🎮 How to Use

### Basic Usage

1. **Open the Control Panel**
   - Click the extension icon in your Chrome toolbar
   - A floating control panel will appear on the webpage

2. **Set Start Point**
   - Navigate to the desired start time in your video/audio
   - Click the "Start" button
   - The current time will be stored as the start point

3. **Set End Point**
   - Navigate to the desired end time in your video/audio
   - Click the "End" button
   - The current time will be stored as the end point

4. **Automatic Loop**
   - Once both start and end points are set, the loop will start automatically
   - The media will automatically jump to the start point when it reaches the end point

### Advanced Usage

#### Click-to-Set Timeline Method
1. **Click Start/End Button**: Click either "Start" or "End" button
2. **Click on Timeline**: Click anywhere on the video/audio progress bar
3. **Time is Set**: The time at that position will be stored

#### Manual Controls
- **Resume Button (▶)**: Resume playback
- **Pause Button (⏸)**: Pause playback
- **Refresh Button (🔄)**: Clear all timestamps and reset the loop

#### Panel Management
- **Drag Panel**: Click and drag the panel header to move it around
- **Close Panel**: Click the "✕" button to hide the panel
- **Show Panel**: Click the extension icon to show the panel again

### Supported Websites

#### General Support
- **Any HTML5 Video**: YouTube, Vimeo, Netflix, etc.
- **Any HTML5 Audio**: Podcast players, music streaming, etc.
- **Custom Video Players**: Most modern video players

#### Special Support
- **YouTube Music**: Custom implementation for YouTube Music's unique player
- **Dynamic Content**: Automatically detects newly loaded media

## 🔧 Technical Details

### Architecture

#### Manifest V3 Structure
```json
{
  "manifest_version": 3,
  "name": "Simple Auto Clicker Loop",
  "version": "1.0",
  "permissions": ["activeTab"],
  "content_scripts": [...],
  "background": {...},
  "action": {...}
}
```

#### Key Components

1. **Content Script (`simple-auto-clicker.js`)**
   - Main logic for media detection and loop control
   - Creates and manages the floating control panel
   - Handles user interactions and time management
   - Special YouTube Music support

2. **Background Script (`background.js`)**
   - Service worker for extension icon clicks
   - Sends messages to content script to show/hide panel

3. **Popup (`simple-auto-clicker-popup.html/js`)**
   - Displays current status (start time, end time, loop status)
   - Provides refresh functionality

4. **Styles (`simple-auto-clicker.css`)**
   - Modern, responsive design for the floating panel
   - Draggable interface with backdrop blur effects

### Core Classes

#### SimpleAutoClicker Class
```javascript
class SimpleAutoClicker {
  constructor() {
    this.startTime = null;
    this.endTime = null;
    this.isLooping = false;
    this.currentVideo = null;
    this.waitingForStartClick = false;
    this.waitingForEndClick = false;
  }
}
```

#### Key Methods
- `setup()`: Initialize extension and detect media
- `createControls()`: Create floating control panel
- `setStartTime()`: Store current time as start point
- `setEndTime()`: Store current time as end point
- `startLoop()`: Begin automatic looping
- `handleTimeUpdate()`: Monitor playback and trigger loops

### YouTube Music Support

The extension includes special handling for YouTube Music's custom player:

```javascript
findYouTubeMusicPlayer() {
  // Extensive selectors for YouTube Music elements
  const selectors = [
    'ytmusic-player',
    '[data-testid="player"]',
    '[data-testid="progress-bar"]',
    // ... more selectors
  ];
}
```

## 🐛 Troubleshooting

### Common Issues

#### Extension Not Loading
**Problem**: "Manifest file is missing or unreadable"
**Solution**: 
- Ensure `manifest.json` is in the root directory
- Check file permissions
- Verify all required files are present

#### Icons Not Loading
**Problem**: "Could not load icon 'icon16.png'"
**Solution**:
- Ensure icon files are in the same directory as `manifest.json`
- Verify icon file names match exactly
- Check file permissions

#### Buttons Not Appearing
**Problem**: No floating panel visible
**Solution**:
1. Check browser console for errors (F12 → Console)
2. Ensure extension is loaded in `chrome://extensions/`
3. Click the extension icon to show the panel
4. Check if the page has any video/audio content

#### YouTube Music Not Working
**Problem**: Extension doesn't work on YouTube Music
**Solution**:
- Wait a few seconds for the page to fully load
- Try refreshing the page
- Check console for any error messages
- The extension should automatically detect YouTube Music

#### Timeline Clicks Not Working
**Problem**: Clicking on timeline doesn't set time
**Solution**:
1. Make sure you clicked the "Start" or "End" button first
2. Try clicking directly on the progress bar
3. For YouTube Music, try clicking anywhere on the page after clicking Start/End

### Debug Mode

To enable debug logging:

1. **Open Developer Tools**: F12 or Right-click → Inspect
2. **Go to Console Tab**: Look for messages starting with "Simple Auto Clicker:"
3. **Check for Errors**: Red error messages indicate problems

### Console Messages

The extension logs various messages to help with debugging:

```
Simple Auto Clicker: Starting...
Simple Auto Clicker: Setting up...
Simple Auto Clicker: Found X videos and Y audio elements
Simple Auto Clicker: YouTube Music detected, setting up periodic checks
Simple Auto Clicker: Timeline click detected!
Simple Auto Clicker: Setting start time...
```

## 🔄 Updates and Maintenance

### Recent Changes
- **v1.0**: Initial release with basic loop functionality
- Added YouTube Music support
- Implemented floating panel design
- Added click-to-set timeline functionality
- Improved error handling and debugging

### Future Enhancements
- [ ] Support for more custom video players
- [ ] Keyboard shortcuts for quick access
- [ ] Multiple loop points support
- [ ] Export/import loop settings
- [ ] Custom loop intervals
- [ ] Audio-only mode optimization

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

If you encounter any issues:

1. **Check the troubleshooting section** above
2. **Look at browser console** for error messages
3. **Verify extension is loaded** in `chrome://extensions/`
4. **Try on different websites** to isolate the issue

## 🎯 Use Cases

### Perfect For:
- **Language Learning**: Loop pronunciation segments
- **Music Practice**: Repeat difficult sections
- **Video Tutorials**: Review specific steps
- **Podcast Segments**: Replay important parts
- **Sports Analysis**: Review specific plays
- **Educational Content**: Focus on key concepts

### Example Scenarios:
1. **YouTube Music**: Loop your favorite song's chorus
2. **Educational Videos**: Repeat complex explanations
3. **Language Learning**: Practice pronunciation with native speakers
4. **Tutorial Videos**: Master specific techniques
5. **Podcasts**: Replay important insights

---

**Happy Looping! 🎵** 
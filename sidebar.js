// Sidebar Component for Pooja's Blog

// Initialize the sidebar
function initializeSidebar() {
  const sidebar = document.getElementById('sidebar');
  
  // Render sidebar content
  renderSidebar();
  
  // Initialize the category filter functionality
  initializeCategoryFilter();
  
  // Initialize profile image functionality
  initializeProfileImage();
  
  console.log('Sidebar successfully initialized!');
}

// Apply sidebar styling
function applySidebarStyles() {
  // Styles are already in the main CSS
}

// Get profile data from storage
function getProfileData() {
  const defaultProfile = {
    name: "Pooja",
    tagline: "Personal thoughts & adventures",
    image: null
  };
  
  const profileData = storage.getItem('poojaBlogProfile');
  return profileData ? JSON.parse(profileData) : defaultProfile;
}

// Save profile data to storage
function saveProfileData(data) {
  storage.setItem('poojaBlogProfile', JSON.stringify(data));
}

// Render the sidebar content
function renderSidebar() {
  const sidebar = document.getElementById('sidebar');
  const profile = getProfileData();
  
  // Create the sidebar content
  const content = `
    <div style="padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <div id="profile-container" style="position: relative; margin: 0 auto 15px; width: 100px; height: 100px; border-radius: 50%; border: 3px solid #a78bfa; overflow: hidden; cursor: pointer;" onclick="document.getElementById('profile-upload').click()">
          ${profile.image 
            ? `<img src="${profile.image}" alt="Profile" style="width: 100%; height: 100%; object-fit: cover;">`
            : `<div style="width: 100%; height: 100%; background-color: #c4b5fd; display: flex; align-items: center; justify-content: center; font-size: 36px; color: white;">👤</div>`
          }
          <div style="position: absolute; bottom: 0; left: 0; right: 0; background-color: rgba(0,0,0,0.5); color: white; font-size: 12px; text-align: center; padding: 4px;">Edit</div>
        </div>
        <input type="file" id="profile-upload" accept="image/*" style="display: none;" onchange="handleProfileImageUpload(event)">
        
        <h2 style="color: white; font-size: 24px; margin-bottom: 5px;" id="profile-name">${profile.name}</h2>
        <p style="color: #e2d9f3; font-size: 14px;" id="profile-tagline">${profile.tagline}</p>
        <button onclick="editProfileInfo()" style="margin-top: 10px; background: transparent; border: 1px solid #a78bfa; color: #e2d9f3; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 12px;">Edit Profile</button>
      </div>
      
      <div style="margin-bottom: 30px;">
        <div style="color: white; font-weight: 600; margin-bottom: 10px; font-size: 16px;">Main Menu</div>
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li style="margin-bottom: 10px;">
            <a href="#" onclick="showAllPosts(); return false;" style="color: #e2d9f3; text-decoration: none; display: flex; align-items: center;">
              <span style="margin-right: 10px;">🏠</span> Home
            </a>
          </li>
          <li style="margin-bottom: 10px;">
            <a href="#" onclick="toggleCreatePost(); return false;" style="color: #e2d9f3; text-decoration: none; display: flex; align-items: center;">
              <span style="margin-right: 10px;">✏️</span> New Post
            </a>
          </li>
        </ul>
      </div>
      
      <div style="margin-bottom: 30px;">
        <div style="color: white; font-weight: 600; margin-bottom: 10px; font-size: 16px;">Categories</div>
        <ul id="categories-list" style="list-style: none; padding: 0; margin: 0;">
          <!-- Categories will be populated dynamically -->
        </ul>
      </div>
      
      <div style="margin-bottom: 30px;">
        <div style="color: white; font-weight: 600; margin-bottom: 10px; font-size: 16px;">Recent Posts</div>
        <ul id="recent-posts" style="list-style: none; padding: 0; margin: 0;">
          <!-- Recent posts will be populated dynamically -->
        </ul>
      </div>
      
      <div style="margin-top: 50px; text-align: center;">
        <div style="color: #a78bfa; font-size: 12px;">© ${new Date().getFullYear()} Pooja's Blog</div>
        <div style="color: #a78bfa; font-size: 12px; margin-top: 5px;">All rights reserved</div>
      </div>
    </div>
  `;
  
  sidebar.innerHTML = content;
  updateRecentPosts();
  updateCategories();
}

// Initialize profile image functionality
function initializeProfileImage() {
  window.handleProfileImageUpload = function(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
      const profile = getProfileData();
      profile.image = e.target.result;
      saveProfileData(profile);
      renderSidebar();
    };
    reader.readAsDataURL(file);
  };
  
  window.editProfileInfo = function() {
    const profile = getProfileData();
    
    const newName = prompt("Enter your name:", profile.name);
    if (newName !== null && newName.trim() !== '') {
      profile.name = newName.trim();
    }
    
    const newTagline = prompt("Enter your tagline:", profile.tagline);
    if (newTagline !== null) {
      profile.tagline = newTagline.trim();
    }
    
    saveProfileData(profile);
    renderSidebar();
  };
}

// Update the recent posts section
function updateRecentPosts() {
  const recentPostsElement = document.getElementById('recent-posts');
  if (!recentPostsElement) return;
  
  // Get posts from the app state
  const posts = JSON.parse(storage.getItem('poojaBlogPosts') || '[]');
  const recentPosts = posts.slice(0, 3); // Get the 3 most recent posts
  
  if (recentPosts.length === 0) {
    recentPostsElement.innerHTML = `
      <li style="color: #c4b5fd; font-style: italic;">No posts yet</li>
    `;
    return;
  }
  
  let html = '';
  recentPosts.forEach(post => {
    html += `
      <li style="margin-bottom: 12px;">
        <a href="#" onclick="viewPost(${post.id}); return false;" style="color: #e2d9f3; text-decoration: none; display: block;">
          <div style="font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(post.title)}</div>
          <div style="font-size: 12px; color: #c4b5fd;">${post.date}</div>
        </a>
      </li>
    `;
  });
  
  recentPostsElement.innerHTML = html;
}

// Extract and update categories
function updateCategories() {
  const categoriesElement = do

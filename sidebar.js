// Sidebar Component for Pooja's Blog

// Initialize the sidebar
function initializeSidebar() {
  const sidebar = document.getElementById('sidebar');
  
  // Render sidebar content
  renderSidebar();
  
  // Initialize the category filter functionality
  initializeCategoryFilter();
  
  console.log('Sidebar successfully initialized!');
}

// Apply sidebar styling
function applySidebarStyles() {
  // Styles are already in the main CSS
}

// Render the sidebar content
function renderSidebar() {
  const sidebar = document.getElementById('sidebar');
  
  // Create the sidebar content
  const content = `
    <div style="padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="color: white; font-size: 24px; margin-bottom: 5px;">Pooja's Blog</h2>
        <p style="color: #e2d9f3; font-size: 14px;">Personal thoughts & adventures</p>
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
  const categoriesElement = document.getElementById('categories-list');
  if (!categoriesElement) return;
  
  // Get posts from the app state
  const posts = JSON.parse(storage.getItem('poojaBlogPosts') || '[]');
  
  // Extract categories from post titles and content (simplified approach)
  const categories = new Set();
  posts.forEach(post => {
    // Add the first word of each title as a category (just as an example)
    const firstWord = post.title.split(' ')[0].toLowerCase();
    if (firstWord && firstWord.length > 3) {
      categories.add(firstWord);
    }
  });
  
  if (categories.size === 0) {
    categoriesElement.innerHTML = `
      <li style="color: #c4b5fd; font-style: italic;">No categories yet</li>
    `;
    return;
  }
  
  let html = '';
  html += `
    <li style="margin-bottom: 10px;">
      <a href="#" onclick="showAllPosts(); return false;" style="color: #e2d9f3; text-decoration: none; display: flex; align-items: center;">
        <span style="margin-right: 10px;">📁</span> All
      </a>
    </li>
  `;
  
  Array.from(categories).forEach(category => {
    html += `
      <li style="margin-bottom: 10px;">
        <a href="#" onclick="filterByCategory('${category}'); return false;" style="color: #e2d9f3; text-decoration: none; display: flex; align-items: center;">
          <span style="margin-right: 10px;">📂</span> ${capitalizeFirstLetter(category)}
        </a>
      </li>
    `;
  });
  
  categoriesElement.innerHTML = html;
}

// Initialize category filter functionality
function initializeCategoryFilter() {
  window.showAllPosts = function() {
    // Simply redraw the app to show all posts
    renderApp();
    
    // On mobile, close the sidebar after selection
    if (window.innerWidth <= 768) {
      toggleSidebar();
    }
  };
  
  window.filterByCategory = function(category) {
    // Get posts from storage
    const allPosts = JSON.parse(storage.getItem('poojaBlogPosts') || '[]');
    
    // Filter posts that contain the category (simple approach)
    const filteredPosts = allPosts.filter(post => {
      return post.title.toLowerCase().includes(category.toLowerCase()) || 
             post.content.toLowerCase().includes(category.toLowerCase());
    });
    
    // Temporarily override the state posts with filtered posts
    const originalPosts = state.posts;
    state.posts = filteredPosts;
    
    // Render the app
    renderApp();
    
    // Restore the original posts to state
    state.posts = originalPosts;
    
    // On mobile, close the sidebar after selection
    if (window.innerWidth <= 768) {
      toggleSidebar();
    }
  };
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Helper function to escape HTML (reusing from main.js)
// This will be used if escapeHtml is not defined in the global scope
if (typeof escapeHtml !== 'function') {
  function escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

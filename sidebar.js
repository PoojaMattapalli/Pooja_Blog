// Sidebar Component for Pooja's Blog

// Initialize the sidebar
function initializeSidebar() {
  const sidebar = document.getElementById('sidebar');
  
  // Apply sidebar styles
  applySidebarStyles();
  
  // Render sidebar content
  renderSidebar();
  
  // Initialize the category filter functionality
  initializeCategoryFilter();
  
  console.log('Sidebar successfully initialized!');
}

// Apply sidebar styling

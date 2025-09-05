// Fix for Manager Dashboard Button
console.log('🔧 Fixing Manager Dashboard Button...');

// Test if the function exists
if (typeof window.enterManagerView === 'function') {
    console.log('✅ enterManagerView function exists');
} else {
    console.log('❌ enterManagerView function missing');
}

// Test if the button exists
const managerButton = document.getElementById('managerPortalButton');
if (managerButton) {
    console.log('✅ Manager button found');
    
    // Remove any existing listeners
    managerButton.replaceWith(managerButton.cloneNode(true));
    
    // Add new listener
    const newButton = document.getElementById('managerPortalButton');
    newButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('🔧 Manager button clicked!');
        
        if (typeof window.enterManagerView === 'function') {
            window.enterManagerView();
        } else {
            console.error('❌ enterManagerView function not available');
        }
    });
    
    console.log('✅ Manager button listener fixed');
} else {
    console.log('❌ Manager button not found');
}


#!/usr/bin/env python3

import re

def fix_manager_button():
    print("🔧 Fixing Manager Dashboard Button...")
    
    # Read the current index.html file
    with open('index.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix the broken event listener
    broken_pattern = r'            // Manager portal button\n            const managerButton = document\.getElementById\(\'managerPortalButton\'\);\n            if \(managerButton\) \{\n                managerButton\.addEventListener\(\'click\', function\(e\) \{\n                    e\.stopPropagation\(\);\n                    window\.enterManagerView\(\);\n                \}\n        /\* ========================================\n           REFINED LANDING PAGE STYLES\n           ======================================== \*/'
    
    fixed_code = '''            // Manager portal button
            const managerButton = document.getElementById('managerPortalButton');
            if (managerButton) {
                managerButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('🔧 Manager button clicked!');
                    window.enterManagerView();
                });
                console.log('✅ Manager button listener added');
            }
        }
        /* ========================================
           REFINED LANDING PAGE STYLES
           ======================================== */'''
    
    # Replace the broken code
    content = re.sub(broken_pattern, fixed_code, content, flags=re.DOTALL)
    
    # Write the updated content back to the file
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ Manager Dashboard Button fixed!")
    print("🔧 Changes made:")
    print("   - Fixed missing closing bracket in event listener")
    print("   - Added proper if statement closure")
    print("   - Added preventDefault() for better event handling")
    print("   - Added console logging for debugging")
    print("   - Added success confirmation log")

if __name__ == "__main__":
    fix_manager_button()


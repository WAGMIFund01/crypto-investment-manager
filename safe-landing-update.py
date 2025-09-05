#!/usr/bin/env python3

import re

def safe_landing_update():
    print("🔧 Implementing safe landing page refinements...")
    
    # Read the current index.html file
    with open('index.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Step 1: Add the refined CSS styles
    refined_css = """
        /* ========================================
           REFINED LANDING PAGE STYLES
           ======================================== */

        /* Enhanced Input Field */
        .investor-form input:hover {
            border-color: var(--primary-orange);
        }

        .investor-form input:focus {
            outline: none;
            border-color: var(--primary-orange);
            box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
        }

        /* Primary Button Enhancements */
        .investor-btn:hover {
            background: var(--primary-green);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
        }

        /* Secondary Manager Button */
        .manager-btn:hover {
            background: var(--neutral-border);
            color: var(--text-primary);
            border-color: var(--text-primary);
        }

        /* Login Title Styling */
        .login-title {
            position: relative;
        }

        .login-title::after {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 50%;
            transform: translateX(-50%);
            width: 40px;
            height: 2px;
            background: var(--primary-orange);
            border-radius: 1px;
        }

        /* Responsive Design for Refined Layout */
        @media (max-width: 768px) {
            .login-container {
                max-width: 90% !important;
                padding: var(--space-8) !important;
            }
            
            .brand-name {
                font-size: 2.5rem !important;
            }
            
            .manager-access {
                position: static !important;
                text-align: center !important;
                margin-top: var(--space-6) !important;
            }
            
            .manager-btn {
                width: 100% !important;
                max-width: 200px !important;
            }
        }

        @media (max-width: 480px) {
            .login-container {
                padding: var(--space-6) !important;
            }
            
            .brand-name {
                font-size: 2rem !important;
            }
            
            .investor-form input {
                padding: var(--space-3) var(--space-4) !important;
                font-size: var(--font-size-caption) !important;
            }
        }
"""
    
    # Add CSS before closing </style> tag
    content = content.replace('        }', '        }' + refined_css)
    
    # Step 2: Replace the landing page HTML with refined version
    new_landing_html = """        <!-- REFINED LOGIN/SELECTION SCREEN -->
        <div id="loginScreen" class="login-screen" style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; background: var(--neutral-dark); padding: var(--space-6); position: relative;">
            
            <!-- Main Login Container -->
            <div class="login-container" style="max-width: 500px; width: 100%; background: var(--neutral-surface); border: 1px solid var(--neutral-border); border-radius: var(--radius-card); box-shadow: var(--shadow-card); padding: var(--space-12); margin-bottom: var(--space-8);">
                
                <!-- Brand Hero Area -->
                <div class="brand-hero" style="text-align: center; margin-bottom: var(--space-10);">
                    <h1 class="brand-name" style="font-size: 3rem; font-weight: var(--font-weight-semibold); color: var(--primary-green); margin: 0 0 var(--space-2) 0; letter-spacing: 0.05em;">
                        WAGMI
                    </h1>
                    <p class="brand-tagline" style="font-size: var(--font-size-body); color: var(--text-secondary); margin: 0; font-weight: var(--font-weight-normal);">
                        We're All Gonna Make It
                    </p>
                </div>

                <!-- Primary: Investor Login Section -->
                <div class="investor-login-section" style="text-align: center;">
                    <h2 class="login-title" style="font-size: var(--font-size-h3); font-weight: var(--font-weight-semibold); color: var(--text-primary); margin: 0 0 var(--space-6) 0;">
                        Investor Login
                    </h2>
                    
                    <div class="investor-form" style="margin-bottom: var(--space-6);">
                        <input type="text" id="investorIdInput" placeholder="Enter your Investor ID (e.g., OAG)" style="width: 100%; padding: var(--space-4) var(--space-5); border: 2px solid var(--neutral-border); border-radius: var(--radius-button); background: var(--neutral-dark); color: var(--text-primary); font-size: var(--font-size-body); margin-bottom: var(--space-3); text-align: center; transition: var(--transition-fast);">
                        <div id="investorError" class="error-message" style="color: var(--status-error); font-size: var(--font-size-caption); text-align: center; display: none;">
                            Invalid Investor ID
                        </div>
                    </div>
                    
                    <button class="btn btn-primary investor-btn" id="investorPortalButton" style="width: 100%; padding: var(--space-4) var(--space-6); background: var(--primary-orange); color: var(--neutral-dark); border: none; border-radius: var(--radius-button); font-size: var(--font-size-body); font-weight: var(--font-weight-semibold); cursor: pointer; transition: var(--transition-fast);">
                        Access My Portfolio
                    </button>
                </div>
            </div>

            <!-- Secondary: Manager Dashboard Access (Bottom Right) -->
            <div class="manager-access" style="position: absolute; bottom: var(--space-6); right: var(--space-6);">
                <button class="btn btn-secondary manager-btn" id="managerPortalButton" style="padding: var(--space-2) var(--space-4); background: transparent; color: var(--text-muted); border: 1px solid var(--neutral-border); border-radius: var(--radius-button); font-size: var(--font-size-caption); font-weight: var(--font-weight-normal); cursor: pointer; transition: var(--transition-fast);">
                    Manager Dashboard
                </button>
            </div>
        </div>"""
    
    # Find and replace the login screen section
    pattern = r'        <!-- Login/Selection Screen -->.*?        </div>\s*\n\s*<!-- Investor ID Input Modal -->'
    content = re.sub(pattern, new_landing_html + '\n\n        <!-- Investor ID Input Modal -->', content, flags=re.DOTALL)
    
    # Write the updated content back to the file
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ Safe landing page update complete!")
    print("🎯 Refinements implemented:")
    print("   - Investor Login as primary focus (centered)")
    print("   - Manager Dashboard demoted to bottom right")
    print("   - Enhanced visual hierarchy")
    print("   - Improved responsive design")
    print("   - Better button styling and interactions")

if __name__ == "__main__":
    safe_landing_update()


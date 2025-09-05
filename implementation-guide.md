# 🚀 COMPLETE LANDING PAGE REPLACEMENT GUIDE

## Step 1: Add New CSS to Foundation Section

Add this CSS before the closing `</style>` tag in your index.html file (around line 1390):

```css
        /* ========================================
           NEW LANDING PAGE DESIGN SYSTEM
           ======================================== */

        /* Login Screen */
        .login-screen {
            background: var(--neutral-dark) !important;
        }

        .login-container {
            background: var(--neutral-surface) !important;
            border: 1px solid var(--neutral-border) !important;
            border-radius: var(--radius-card) !important;
            box-shadow: var(--shadow-card) !important;
        }

        /* Brand Hero */
        .brand-name {
            font-size: 3rem;
            font-weight: var(--font-weight-semibold);
            color: var(--primary-green);
            margin: 0 0 var(--space-2) 0;
            letter-spacing: 0.05em;
        }

        .brand-tagline {
            font-size: var(--font-size-body);
            color: var(--text-secondary);
            margin: 0;
            font-weight: var(--font-weight-normal);
        }

        /* Login Cards */
        .login-card {
            background: var(--neutral-surface);
            border: 1px solid var(--neutral-border);
            border-radius: var(--radius-card);
            transition: var(--transition-fast);
        }

        .login-card:hover {
            border-color: var(--primary-green);
            box-shadow: 0 4px 12px rgba(0, 212, 170, 0.1);
        }

        .card-title {
            font-size: var(--font-size-body);
            font-weight: var(--font-weight-semibold);
            color: var(--text-primary);
            margin: 0 0 var(--space-6) 0;
        }

        /* Button Enhancements */
        .manager-btn:hover {
            background: var(--primary-green);
            color: var(--neutral-dark);
        }

        .investor-btn:hover {
            background: var(--primary-orange);
            color: var(--neutral-dark);
        }

        /* Input Field */
        .investor-form input {
            width: 100%;
            padding: var(--space-3) var(--space-4);
            border: 1px solid var(--neutral-border);
            border-radius: var(--radius-button);
            background: var(--neutral-dark);
            color: var(--text-primary);
            font-size: var(--font-size-body);
            transition: var(--transition-fast);
        }

        .investor-form input:focus {
            outline: none;
            border-color: var(--primary-orange);
            box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
        }

        .investor-form input::placeholder {
            color: var(--text-muted);
        }

        /* Error Message */
        .error-message {
            color: var(--status-error);
            font-size: var(--font-size-caption);
            text-align: left;
            margin-top: var(--space-1);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .login-options {
                grid-template-columns: 1fr !important;
                gap: var(--space-4) !important;
            }
            
            .brand-name {
                font-size: 2.5rem !important;
            }
            
            .login-container {
                padding: var(--space-8) !important;
            }
        }
```

## Step 2: Replace Landing Page HTML

Replace the entire landing page section (from line 1395 to around line 1459) with this new HTML:

```html
        <!-- NEW LOGIN/SELECTION SCREEN -->
        <div id="loginScreen" class="login-screen" style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: var(--neutral-dark); padding: var(--space-6);">
            <div class="login-container" style="max-width: 800px; width: 100%; background: var(--neutral-surface); border: 1px solid var(--neutral-border); border-radius: var(--radius-card); box-shadow: var(--shadow-card); padding: var(--space-12);">
                
                <!-- Brand Hero Area -->
                <div class="brand-hero" style="text-align: center; margin-bottom: var(--space-10);">
                    <h1 class="brand-name" style="font-size: 3rem; font-weight: var(--font-weight-semibold); color: var(--primary-green); margin: 0 0 var(--space-2) 0; letter-spacing: 0.05em;">
                        WAGMI
                    </h1>
                    <p class="brand-tagline" style="font-size: var(--font-size-body); color: var(--text-secondary); margin: 0; font-weight: var(--font-weight-normal);">
                        We're All Gonna Make It
                    </p>
                </div>

                <!-- Dual Login Options -->
                <div class="login-options" style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-6);">
                    
                    <!-- Fund Manager Login Card -->
                    <div class="login-card" style="background: var(--neutral-surface); border: 1px solid var(--neutral-border); border-radius: var(--radius-card); padding: var(--space-8); text-align: center;">
                        <h3 class="card-title" style="font-size: var(--font-size-body); font-weight: var(--font-weight-semibold); color: var(--text-primary); margin: 0 0 var(--space-6) 0;">
                            Fund Manager Login
                        </h3>
                        <button class="btn btn-outline manager-btn" id="managerPortalButton" style="width: 100%; padding: var(--space-4) var(--space-6); border: 2px solid var(--primary-green); color: var(--primary-green); background: transparent; border-radius: var(--radius-button); font-size: var(--font-size-body); font-weight: var(--font-weight-semibold); cursor: pointer; transition: var(--transition-fast);">
                            Access Manager Dashboard
                        </button>
                    </div>

                    <!-- Investor Login Card -->
                    <div class="login-card" style="background: var(--neutral-surface); border: 1px solid var(--neutral-border); border-radius: var(--radius-card); padding: var(--space-8); text-align: center;">
                        <h3 class="card-title" style="font-size: var(--font-size-body); font-weight: var(--font-weight-semibold); color: var(--text-primary); margin: 0 0 var(--space-6) 0;">
                            Investor Login
                        </h3>
                        <div class="investor-form" style="margin-bottom: var(--space-4);">
                            <input type="text" id="investorIdInput" placeholder="OAG" style="width: 100%; padding: var(--space-3) var(--space-4); border: 1px solid var(--neutral-border); border-radius: var(--radius-button); background: var(--neutral-dark); color: var(--text-primary); font-size: var(--font-size-body); margin-bottom: var(--space-2);">
                            <div id="investorError" class="error-message" style="color: var(--status-error); font-size: var(--font-size-caption); text-align: left; display: none;">
                                Invalid Investor ID
                            </div>
                        </div>
                        <button class="btn btn-outline investor-btn" id="investorPortalButton" style="width: 100%; padding: var(--space-4) var(--space-6); border: 2px solid var(--primary-orange); color: var(--primary-orange); background: transparent; border-radius: var(--radius-button); font-size: var(--font-size-body); font-weight: var(--font-weight-semibold); cursor: pointer; transition: var(--transition-fast);">
                            Access Portfolio
                        </button>
                    </div>
                </div>
            </div>
        </div>
```

## What This Achieves:

1. **Professional Design** - Clean, minimal layout matching your inspiration
2. **Dual Login Cards** - Side-by-side Manager and Investor options
3. **Enhanced Input Field** - Proper styling for Investor ID input
4. **Responsive Design** - Stacks vertically on mobile
5. **Hover Effects** - Subtle interactions on cards and buttons
6. **Error Handling** - Built-in error message display
7. **Consistent Styling** - Uses your design system variables

## Testing:

After implementation, test:
- Desktop layout (side-by-side cards)
- Mobile layout (stacked cards)
- Button hover effects
- Input field focus states
- Error message display
- Responsive breakpoints

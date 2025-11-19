// Form validation and functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeForms();
    initializeImageFallbacks();
});

function initializeForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Add submit event listener
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                showFormSuccess(this);
            }
        });

        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
                // Real-time validation for certain fields
                if (this.type === 'email' || this.type === 'tel') {
                    validateField(this);
                }
            });
        });

        // Special handling for donation amount buttons
        if (form.classList.contains('donation-form')) {
            initializeDonationButtons();
        }
    });
}

function initializeDonationButtons() {
    const amountButtons = document.querySelectorAll('.amount-btn');
    const customAmountInput = document.querySelector('#custom-amount');
    const donationAmountInput = document.querySelector('#donation-amount');

    amountButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            amountButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Set the donation amount
            const amount = this.getAttribute('data-amount');
            if (donationAmountInput) {
                donationAmountInput.value = amount;
            }
            
            // Clear custom amount
            if (customAmountInput) {
                customAmountInput.value = '';
            }
        });
    });

    // Handle custom amount input
    if (customAmountInput) {
        customAmountInput.addEventListener('input', function() {
            // Remove active class from amount buttons when custom amount is entered
            amountButtons.forEach(b => b.classList.remove('active'));
            if (donationAmountInput) {
                donationAmountInput.value = this.value;
            }
        });
    }
}

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Clear previous error
    clearFieldError(field);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        errorMessage = getFieldErrorMessage(field, 'required');
        isValid = false;
    }
    
    // Email validation
    else if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errorMessage = getFieldErrorMessage(field, 'email');
            isValid = false;
        }
    }
    
    // Phone validation
    else if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            errorMessage = getFieldErrorMessage(field, 'phone');
            isValid = false;
        }
    }
    
    // Minimum length validation
    else if (field.hasAttribute('minlength') && value.length < field.getAttribute('minlength')) {
        errorMessage = getFieldErrorMessage(field, 'minlength');
        isValid = false;
    }
    
    // Number validation for donation amounts
    else if (field.type === 'number' && value) {
        const numValue = parseFloat(value);
        if (isNaN(numValue) || numValue < 10) {
            errorMessage = getFieldErrorMessage(field, 'number');
            isValid = false;
        }
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        showFieldSuccess(field);
    }
    
    return isValid;
}

function getFieldErrorMessage(field, type) {
    const fieldName = field.labels?.[0]?.textContent?.replace('*', '').trim() || 'This field';
    
    switch(type) {
        case 'required':
            return `${fieldName} is required`;
        case 'email':
            return 'Please enter a valid email address';
        case 'phone':
            return 'Please enter a valid phone number';
        case 'minlength':
            return `${fieldName} must be at least ${field.getAttribute('minlength')} characters`;
        case 'number':
            return 'Please enter a valid amount (minimum R10)';
        default:
            return 'Please check this field';
    }
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

function showFieldSuccess(field) {
    field.classList.remove('error');
    field.style.borderColor = '#27ae60';
    
    // Remove success color after 2 seconds
    setTimeout(() => {
        field.style.borderColor = '';
    }, 2000);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function showFormSuccess(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    
    // Simulate AJAX request
    setTimeout(() => {
        // Show success state
        submitBtn.textContent = '✓ Message Sent!';
        submitBtn.style.background = '#27ae60';
        
        // Show success message
        const successDiv = document.createElement('div');
        successDiv.className = 'form-success';
        successDiv.innerHTML = `
            <strong>Thank you for your message!</strong><br>
            We have received your inquiry and will get back to you within 24 hours.
        `;
        form.prepend(successDiv);
        
        // Reset form after delay
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
            submitBtn.style.opacity = '1';
            form.reset();
            
            // Remove success message after 5 seconds
            setTimeout(() => {
                if (successDiv.parentNode) {
                    successDiv.remove();
                }
            }, 5000);
        }, 3000);
    }, 1500);
}

// Image fallback handling
function initializeImageFallbacks() {
    const images = document.querySelectorAll('img[src*="unsplash"]');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            console.log('Image failed to load:', this.src);
            // You could set a fallback image here
            // this.src = 'images/fallback.jpg';
        });
        
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        // Set initial opacity for fade-in effect
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });
}

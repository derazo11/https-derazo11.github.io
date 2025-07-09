// DOM Elements
const contactForm = document.getElementById('contactForm');
const submitBtn = document.querySelector('.submit-btn');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Main initialization function
function initializeApp() {
    setupSmoothScrolling();
    setupFormHandling();
    setupScrollAnimations();
    setupFormValidation();
}

// Smooth scrolling for navigation links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Form handling and submission
function setupFormHandling() {
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmission);
    }
}

// Handle form submission
function handleFormSubmission(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    showLoadingState();
    
    // Create FormData object
    const formData = new FormData(contactForm);
    
    // Submit form using fetch API
    fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            showSuccessMessage();
            contactForm.reset();
        } else {
            throw new Error('Error en el envío del formulario');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showErrorMessage('Hubo un error al enviar el formulario. Por favor, intenta nuevamente.');
    })
    .finally(() => {
        hideLoadingState();
    });
}

// Form validation
function validateForm() {
    const requiredFields = contactForm.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'Este campo es obligatorio');
            isValid = false;
        } else {
            clearFieldError(field);
        }
    });
    
    // Validate email format
    const emailField = contactForm.querySelector('#email');
    if (emailField && emailField.value.trim()) {
        if (!isValidEmail(emailField.value)) {
            showFieldError(emailField, 'Por favor, introduce un email válido');
            isValid = false;
        }
    }
    
    return isValid;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show field error
function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = '#ef4444';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
    field.style.borderColor = '#ef4444';
}

// Clear field error
function clearFieldError(field) {
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
    field.style.borderColor = '';
}

// Show success message
function showSuccessMessage() {
    const existingMessage = document.querySelector('.form-status');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const successDiv = document.createElement('div');
    successDiv.className = 'form-status success';
    successDiv.textContent = '¡Mensaje enviado exitosamente! Te contactaremos pronto.';
    
    contactForm.parentNode.insertBefore(successDiv, contactForm);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// Show error
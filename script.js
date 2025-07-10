// Smooth scrolling for navigation links
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

        // Form handling
        const contactForm = document.getElementById('contactForm');
        const submitBtn = document.querySelector('.submit-btn');


        function validateForm() {
            const requiredFields = contactForm.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                clearFieldError(field);
                
                if (!field.value.trim()) {
                    showFieldError(field, 'Este campo es obligatorio');
                    isValid = false;
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

        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        function showFieldError(field, message) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.style.color = '#ef4444';
            errorDiv.style.fontSize = '0.875rem';
            errorDiv.style.marginTop = '0.25rem';
            errorDiv.textContent = message;
            
            field.parentNode.appendChild(errorDiv);
            field.style.borderColor = '#ef4444';
        }

        function clearFieldError(field) {
            const errorDiv = field.parentNode.querySelector('.field-error');
            if (errorDiv) {
                errorDiv.remove();
            }
            field.style.borderColor = '';
        }

        function sendEmail(data) {
            // Using FormSubmit.co - more reliable configuration
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = 'https://formsubmit.co/erazotech95@gmail.com';
            form.style.display = 'none';

            // Add hidden fields for FormSubmit configuration
            const hiddenFields = {
                '_subject': 'Nueva consulta desde la web - Erazo Tech',
                '_captcha': 'false',
                '_template': 'table',
                '_next': window.location.href + '?sent=true'
            };

            // Add form data
            Object.entries({...data, ...hiddenFields}).forEach(([key, value]) => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = value;
                form.appendChild(input);
            });

            document.body.appendChild(form);
            form.submit();
        }

        // Check if form was submitted successfully
        if (window.location.search.includes('sent=true')) {
            showSuccessMessage();
            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        function showSuccessMessage() {
            const existingMessage = document.querySelector('.form-status');
            if (existingMessage) {
                existingMessage.remove();
            }

            const successDiv = document.createElement('div');
            successDiv.className = 'form-status success';
            successDiv.innerHTML = '✅ ¡Mensaje enviado exitosamente! Te contactaremos pronto.';
            
            contactForm.parentNode.insertBefore(successDiv, contactForm);
            
            // Reset form
            contactForm.reset();
            
            // Remove message after 5 seconds
            setTimeout(() => {
                successDiv.remove();
            }, 5000);
        }

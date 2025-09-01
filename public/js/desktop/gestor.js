// Desktop Profile/Gestor Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize contact functionality
    initializeContactActions();
    
    // Initialize appointment booking
    initializeAppointmentBooking();
    
    // Initialize BBVA assistant
    initializeBBVAAssistant();
    
    // Initialize profile actions
    initializeProfileActions();
    
    // Initialize service cards
    initializeServiceCards();
    
    console.log('👤 Desktop profile scripts loaded');
});

// Contact actions functionality
function initializeContactActions() {
    const callBtn = document.querySelector('.call-btn');
    const chatBtn = document.querySelector('.chat-btn');
    const contactOptions = document.querySelectorAll('.contact-option');
    
    if (callBtn) {
        callBtn.addEventListener('click', (e) => {
            e.preventDefault();
            initiateCall();
        });
    }
    
    if (chatBtn) {
        chatBtn.addEventListener('click', (e) => {
            e.preventDefault();
            startChat();
        });
    }
    
    // Contact options in sidebar
    contactOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            const contactType = option.querySelector('strong').textContent;
            
            switch(contactType) {
                case 'Call Us':
                    initiateCall();
                    break;
                case 'Send Message':
                    openMessageComposer();
                    break;
                case 'Book Meeting':
                    openAppointmentBooker();
                    break;
                default:
                    showToast(`${contactType} functionality coming soon`, 'info');
            }
        });
    });
}

function initiateCall() {
    showToast('Connecting you to our support team...', 'info');
    
    // In a real app, this might:
    // - Open a WebRTC call interface
    // - Show callback request form
    // - Redirect to phone dialer on mobile
    
    setTimeout(() => {
        showToast('Call initiated - You should receive a call shortly', 'success');
    }, 2000);
}

function startChat() {
    showToast('Opening chat with support...', 'info');
    
    // In a real app, this would open a chat widget
    setTimeout(() => {
        openChatWidget();
    }, 1000);
}

function openChatWidget() {
    // Create chat widget
    const chatWidget = document.createElement('div');
    chatWidget.className = 'chat-widget';
    chatWidget.innerHTML = `
        <div class="chat-header">
            <h4>BBVA Support Chat</h4>
            <button class="close-chat" onclick="closeChatWidget()">&times;</button>
        </div>
        <div class="chat-messages">
            <div class="message support-message">
                <div class="message-avatar">S</div>
                <div class="message-content">
                    <p>Hello! How can I help you today?</p>
                    <span class="message-time">Now</span>
                </div>
            </div>
        </div>
        <div class="chat-input">
            <input type="text" placeholder="Type your message..." id="chat-input">
            <button onclick="sendChatMessage()">Send</button>
        </div>
    `;
    
    // Add chat styles
    if (!document.querySelector('#chat-widget-styles')) {
        const styles = document.createElement('style');
        styles.id = 'chat-widget-styles';
        styles.textContent = `
            .chat-widget {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 350px;
                height: 400px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                z-index: 10000;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
            
            .chat-header {
                background: #0066cc;
                color: white;
                padding: 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .chat-header h4 {
                margin: 0;
                font-size: 1rem;
                font-weight: 600;
            }
            
            .close-chat {
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
            }
            
            .close-chat:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            .chat-messages {
                flex: 1;
                padding: 16px;
                overflow-y: auto;
                background: #f8f9fa;
            }
            
            .message {
                display: flex;
                gap: 8px;
                margin-bottom: 16px;
            }
            
            .message-avatar {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #0066cc;
                color: white;
                font-size: 0.8rem;
                flex-shrink: 0;
            }
            
            .support-message .message-avatar {
                background: #6b7280;
            }
            
            .message-content {
                flex: 1;
                background: white;
                padding: 8px 12px;
                border-radius: 8px;
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
            }
            
            .message-content p {
                margin: 0 0 4px 0;
                font-size: 0.9rem;
                line-height: 1.4;
            }
            
            .message-time {
                font-size: 0.7rem;
                color: #9ca3af;
            }
            
            .chat-input {
                padding: 16px;
                border-top: 1px solid #e5e7eb;
                display: flex;
                gap: 8px;
            }
            
            .chat-input input {
                flex: 1;
                padding: 8px 12px;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                font-size: 0.9rem;
            }
            
            .chat-input button {
                padding: 8px 16px;
                background: #0066cc;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 0.9rem;
                font-weight: 500;
            }
            
            .chat-input button:hover {
                background: #0052a3;
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(chatWidget);
    
    // Focus input
    setTimeout(() => {
        document.getElementById('chat-input').focus();
    }, 100);
    
    showToast('Chat opened - Support agent available', 'success');
}

function closeChatWidget() {
    const chatWidget = document.querySelector('.chat-widget');
    if (chatWidget) {
        chatWidget.remove();
    }
}

function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const messagesContainer = document.querySelector('.chat-messages');
    
    if (input && input.value.trim() && messagesContainer) {
        const message = input.value.trim();
        
        // Add user message
        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'message user-message';
        userMessageDiv.innerHTML = `
            <div class="message-avatar">U</div>
            <div class="message-content">
                <p>${message}</p>
                <span class="message-time">Now</span>
            </div>
        `;
        
        messagesContainer.appendChild(userMessageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        input.value = '';
        
        // Simulate support response
        setTimeout(() => {
            const supportMessage = document.createElement('div');
            supportMessage.className = 'message support-message';
            supportMessage.innerHTML = `
                <div class="message-avatar">S</div>
                <div class="message-content">
                    <p>Thank you for your message. A support representative will assist you shortly.</p>
                    <span class="message-time">Now</span>
                </div>
            `;
            
            messagesContainer.appendChild(supportMessage);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 1500);
    }
}

function openMessageComposer() {
    showToast('Opening secure message composer...', 'info');
    // In a real app, this would open a secure message form
}

// Appointment booking functionality
function initializeAppointmentBooking() {
    const bookBtn = document.querySelector('.appointment-actions .btn-primary');
    const appointmentLink = document.querySelector('.appointment-link');
    
    if (bookBtn) {
        bookBtn.addEventListener('click', () => {
            openAppointmentBooker();
        });
    }
    
    if (appointmentLink) {
        appointmentLink.addEventListener('click', (e) => {
            e.preventDefault();
            showAppointmentBenefits();
        });
    }
}

function openAppointmentBooker() {
    showToast('Opening appointment booking system...', 'info');
    
    // In a real app, this would open an appointment booking modal or page
    setTimeout(() => {
        showToast('Appointment booking system loaded', 'success');
    }, 2000);
}

function showAppointmentBenefits() {
    const benefits = [
        'No waiting in line',
        'Guaranteed service time',
        'Easy rescheduling',
        'SMS reminders'
    ];
    
    showToast(`Benefits: ${benefits.join(' • ')}`, 'info', 5000);
}

// BBVA Assistant functionality
function initializeBBVAAssistant() {
    const assistantBtn = document.querySelector('.assistant-card .btn-primary');
    
    if (assistantBtn) {
        assistantBtn.addEventListener('click', () => {
            startBBVAAssistant();
        });
    }
}

function startBBVAAssistant() {
    showToast('Starting Blue BBVA virtual assistant...', 'info');
    
    // In a real app, this would launch the AI assistant interface
    setTimeout(() => {
        showToast('Blue BBVA assistant is ready to help!', 'success');
    }, 2000);
}

// Profile actions functionality
function initializeProfileActions() {
    const editBtn = document.querySelector('.header-actions .btn-primary');
    const privacyBtn = document.querySelector('.header-actions .btn-secondary');
    const viewProfileLink = document.querySelector('.view-full-profile');
    
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            openProfileEditor();
        });
    }
    
    if (privacyBtn) {
        privacyBtn.addEventListener('click', () => {
            openPrivacySettings();
        });
    }
    
    if (viewProfileLink) {
        viewProfileLink.addEventListener('click', (e) => {
            e.preventDefault();
            viewFullProfile();
        });
    }
}

function openProfileEditor() {
    showToast('Opening profile editor...', 'info');
    // In a real app, this would open the profile editing interface
}

function openPrivacySettings() {
    showToast('Opening privacy settings...', 'info');
    // In a real app, this would open privacy settings
}

function viewFullProfile() {
    showToast('Loading complete profile information...', 'info');
    // In a real app, this would navigate to the full profile page
}

// Service cards functionality
function initializeServiceCards() {
    const serviceItems = document.querySelectorAll('.service-item');
    
    serviceItems.forEach(item => {
        item.addEventListener('click', () => {
            const serviceTitle = item.querySelector('h3').textContent;
            showToast(`Opening ${serviceTitle} service...`, 'info');
            
            // In a real app, this would navigate to the specific service
            setTimeout(() => {
                showToast(`${serviceTitle} service loaded`, 'success');
            }, 1500);
        });
    });
}

// Export functions for global access
window.closeChatWidget = closeChatWidget;
window.sendChatMessage = sendChatMessage;
window.initiateCall = initiateCall;
window.startChat = startChat;
window.openAppointmentBooker = openAppointmentBooker;

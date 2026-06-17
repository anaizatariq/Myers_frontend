/* ============================================
   MYERS COLLEGE CHATBOT — WIDGET JS
   Simple, clean, easy to understand
   ============================================ */

(function () {

  // --- CONFIG ---
  const API_URL = 'https://myers-backend.onrender.com/api/chat/';
  const WELCOME_MSG = "Assalam-o-Alaikum! 👋 I'm the Myer's College assistant. How can I help you today? Ask me about admissions, courses, faculty, facilities, or anything about the college!";

  // Conversation history (keeps last messages for context)
  let conversationHistory = []; 

  // --- CREATE THE WIDGET HTML ---
  function createWidget() {
    // Toggle Button
    const toggle = document.createElement("button");
    toggle.id = "chatbot-toggle";
    toggle.setAttribute("aria-label", "Open Chat");
    // Clean, universally recognized premium chat icon
    toggle.innerHTML = '<i class="bi bi-chat-dots-fill"></i>';
    document.body.appendChild(toggle);

    // Proactive Popup Tooltip
    const tooltip = document.createElement("div");
    tooltip.id = "chatbot-tooltip";
    tooltip.innerHTML = 'Have questions about Admissions?<br><strong>Chat with our Guide!</strong><span class="tooltip-close">&times;</span>';
    document.body.appendChild(tooltip);

    // Chat Window
    const window_el = document.createElement("div");
    window_el.id = "chatbot-window";
    window_el.innerHTML = `
      <!-- Header -->
      <div class="chatbot-header">
        <div class="chatbot-header-avatar">
          <i class="bi bi-mortarboard-fill" style="color:var(--gold);"></i>
        </div>
        <div class="chatbot-header-info">
          <h4>Myer's Assistant</h4>
          <p><span class="online-dot"></span> Online — Ask me anything</p>
        </div>
        <button class="chatbot-close-btn" aria-label="Close Chat">
          <i class="bi bi-chevron-down"></i>
        </button>
      </div>

      <!-- Messages -->
      <div id="chatbot-messages"></div>

      <!-- Quick Suggestions -->
      <div class="chatbot-suggestions" id="chatbot-suggestions">
        <button data-q="What courses do you offer?">Courses</button>
        <button data-q="How to apply for admission?">Admissions</button>
        <button data-q="What are the fees?">Fees</button>
        <button data-q="Tell me about the faculty">Faculty</button>
        <button data-q="What facilities are available?">Facilities</button>
        <button data-q="What clubs does Myers have?">Clubs</button>
      </div>

      <!-- Input -->
      <div class="chatbot-input-area">
        <textarea id="chatbot-input" placeholder="Type your question..." rows="1"></textarea>
        <button id="chatbot-send" aria-label="Send Message">
          <i class="bi bi-send-fill"></i>
        </button>
      </div>
    `;
    document.body.appendChild(window_el);

    // --- WIRE UP EVENTS ---
    const toggleBtn = document.getElementById("chatbot-toggle");
    const chatWindow = document.getElementById("chatbot-window");
    const input = document.getElementById("chatbot-input");
    const sendBtn = document.getElementById("chatbot-send");
    const messagesEl = document.getElementById("chatbot-messages");
    const suggestionsEl = document.getElementById("chatbot-suggestions");

    // Tooltip rotation logic
    const tooltipMessages = [
      'Have questions about Admissions?<br><strong>Chat with our Guide!</strong>',
      'Curious about our Campus Facilities?<br><strong>Ask me anything!</strong>',
      'Want to know about Upcoming Events?<br><strong>I can help you!</strong>'
    ];
    let currentTooltipIndex = 0;
    let tooltipInterval;

    // Show tooltip after 2.5 seconds
    setTimeout(() => {
      if (!chatWindow.classList.contains("open") && !sessionStorage.getItem("myers_chat_tooltip_closed")) {
        tooltip.classList.add("show");
        
        // Start rotating messages every 6 seconds
        tooltipInterval = setInterval(() => {
          if (chatWindow.classList.contains("open")) {
            clearInterval(tooltipInterval);
            return;
          }
          currentTooltipIndex = (currentTooltipIndex + 1) % tooltipMessages.length;
          
          // Fade out, change text, fade in
          tooltip.style.opacity = '0';
          setTimeout(() => {
            tooltip.innerHTML = tooltipMessages[currentTooltipIndex] + '<span class="tooltip-close">&times;</span>';
            // Re-attach listener since we overwrote innerHTML
            tooltip.querySelector('.tooltip-close').addEventListener('click', closeTooltip);
            tooltip.style.opacity = '1';
          }, 400);
          
        }, 6000);
      }
    }, 2500);

    function closeTooltip(e) {
      if(e) e.stopPropagation();
      tooltip.classList.remove("show");
      sessionStorage.setItem("myers_chat_tooltip_closed", "true");
      if (tooltipInterval) clearInterval(tooltipInterval);
    }

    // Close tooltip manually
    tooltip.addEventListener('click', (e) => {
      if (e.target.classList.contains('tooltip-close')) {
        closeTooltip(e);
      } else {
        // Clicking the tooltip body opens chat
        closeTooltip();
        toggleBtn.click();
      }
    });

    // Close chat function
    function closeChat() {
      chatWindow.classList.remove("open");
      toggleBtn.classList.remove("active");
      toggleBtn.style.display = 'flex'; // Restore visibility if hidden on mobile
      toggleBtn.innerHTML = '<i class="bi bi-chat-dots-fill"></i>';
    }

    // Toggle open/close
    toggleBtn.addEventListener("click", function () {
      tooltip.classList.remove("show"); // Always hide tooltip when opening
      if (tooltipInterval) clearInterval(tooltipInterval);
      
      const isOpen = chatWindow.classList.contains("open");
      if (isOpen) {
        closeChat();
      } else {
        chatWindow.classList.add("open");
        toggleBtn.classList.add("active");
        
        // On mobile, hide the floating toggle to prevent overlap with input area
        if (window.innerWidth <= 768) {
          toggleBtn.style.display = 'none';
        } else {
          toggleBtn.innerHTML = '<i class="bi bi-x-lg"></i>';
        }
        
        input.focus();
        // Show welcome message on first open
        if (messagesEl.children.length === 0) {
          addMessage("bot", WELCOME_MSG);
        }
      }
    });

    // Elegant header close button
    const closeBtn = chatWindow.querySelector(".chatbot-close-btn");
    closeBtn.addEventListener("click", function () {
      closeChat();
    });

    // Send on button click
    sendBtn.addEventListener("click", function () {
      sendMessage();
    });

    // Send on Enter (Shift+Enter for new line)
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    // Auto-resize textarea
    input.addEventListener("input", function () {
      this.style.height = "auto";
      this.style.height = Math.min(this.scrollHeight, 80) + "px";
    });

    // Quick suggestion buttons
    suggestionsEl.addEventListener("click", function (e) {
      const btn = e.target.closest("button[data-q]");
      if (!btn) return;
      input.value = btn.dataset.q;
      sendMessage();
    });

    // --- SEND MESSAGE ---
    function sendMessage() {
      const text = input.value.trim();
      if (!text) return;

      // Show user message
      addMessage("user", text);
      input.value = "";
      input.style.height = "auto";

      // Hide suggestions after first message
      suggestionsEl.style.display = "none";

      // Disable input while waiting
      input.disabled = true;
      sendBtn.disabled = true;

      // Show typing indicator
      const typingEl = showTyping();

      // Call API
      fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          conversation_history: conversationHistory.slice(-6),
        }),
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          removeTyping(typingEl);
          const reply = data.reply || "Sorry, something went wrong. Please try again.";
          addMessage("bot", reply);
        })
        .catch(function () {
          removeTyping(typingEl);
          addMessage("bot", "I couldn't connect right now. Please try again or call +92-543-541610.");
        })
        .finally(function () {
          input.disabled = false;
          sendBtn.disabled = false;
          input.focus();
        });
    }

    // --- ADD MESSAGE TO CHAT ---
    function addMessage(role, text) {
      // Save to history
      conversationHistory.push({ role: role === "bot" ? "assistant" : "user", content: text });

      // Create message element
      var msgDiv = document.createElement("div");
      msgDiv.className = "chat-msg " + role;

      if (role === "bot") {
        msgDiv.innerHTML =
          '<div class="chat-msg-avatar"><i class="bi bi-mortarboard-fill"></i></div>' +
          '<div class="chat-bubble">' + formatText(text) + '</div>';
      } else {
        msgDiv.innerHTML = '<div class="chat-bubble">' + escapeHtml(text) + '</div>';
      }

      messagesEl.appendChild(msgDiv);
      
      // Smart Premium Scrolling UX
      setTimeout(() => {
        if (role === "bot" && msgDiv.offsetHeight > (messagesEl.clientHeight * 0.8)) {
          // If bot message is very long, smoothly scroll to the top of the message
          messagesEl.scrollTo({ top: msgDiv.offsetTop - 20, behavior: "smooth" });
        } else {
          // Normal behavior: scroll to bottom
          messagesEl.scrollTo({ top: messagesEl.scrollHeight, behavior: "smooth" });
        }
      }, 50);
    }

    // --- TYPING INDICATOR ---
    function showTyping() {
      var div = document.createElement("div");
      div.className = "chat-msg bot";
      div.innerHTML =
        '<div class="chat-msg-avatar"><i class="bi bi-mortarboard-fill"></i></div>' +
        '<div class="chat-bubble"><div class="typing-indicator"><span></span><span></span><span></span></div></div>';
      messagesEl.appendChild(div);
      setTimeout(() => {
        messagesEl.scrollTo({ top: messagesEl.scrollHeight, behavior: "smooth" });
      }, 10);
      return div;
    }

    function removeTyping(el) {
      if (el && el.parentNode) el.parentNode.removeChild(el);
    }

    // --- FORMAT BOT RESPONSE ---
    function formatText(text) {
      // Convert markdown-like formatting to HTML
      var html = escapeHtml(text);
      // Bold: **text**
      html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Line breaks
      html = html.replace(/\n/g, '<br>');
      // Bullet points
      html = html.replace(/^- (.*?)(<br>|$)/gm, '• $1$2');
      return html;
    }

    // --- ESCAPE HTML ---
    function escapeHtml(text) {
      var div = document.createElement("div");
      div.appendChild(document.createTextNode(text));
      return div.innerHTML;
    }
  }

  // --- INIT ---
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createWidget);
  } else {
    createWidget();
  }

})();

// Store form data in sessionStorage as user progresses through the form
const formData = {
  businessName: "",
  contactPerson: "",
  phoneNumber: "",
  businessType: "",
  deliverySpeed: "",
  reliability: "",
  operationalChallenges: "",
  criticalIncidents: "",
  pricingPerception: "",
  valueAssessment: "",
  overallSatisfaction: "",
  improvements: "",
  desiredFeatures: "",
  recommendation: "",
};

// Load saved form data from sessionStorage
function loadFormData() {
  const saved = sessionStorage.getItem("surveyData");
  if (saved) {
    Object.assign(formData, JSON.parse(saved));
  }
}

// Save form data to sessionStorage
function saveFormData() {
  sessionStorage.setItem("surveyData", JSON.stringify(formData));
}

// Collect form data from current page
function collectFormData() {
  const inputs = document.querySelectorAll(
    'input[type="text"], input[type="tel"], textarea, input[type="radio"]:checked',
  );

  inputs.forEach((input) => {
    const key = input.id || input.name;
    if (key && formData.hasOwnProperty(key)) {
      formData[key] = input.value;
    }
  });

  saveFormData();
}

// Submit feedback to backend
async function submitFeedback() {
  try {
    const submitBtn = document.querySelector(
      'button[onclick="submitFeedback()"]',
    );
    if (submitBtn) {
      submitBtn.disabled = true;
      const originalHTML = submitBtn.innerHTML;
      submitBtn.innerHTML =
        '<span class="inline-flex items-center gap-2"><svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Submitting...</span>';

      collectFormData();

      const response = await fetch("/api/submit-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        // Clear saved data and redirect to thank you page
        sessionStorage.removeItem("surveyData");
        window.location.href = "../thank%20you%20page/code.html";
      } else {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
        alert("Error: " + result.message);
      }
    }
  } catch (error) {
    console.error("Submission error:", error);
    const submitBtn = document.querySelector(
      'button[onclick="submitFeedback()"]',
    );
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML =
        submitBtn.getAttribute("data-original-html") ||
        '<span class="font-label text-sm font-semibold uppercase tracking-widest">Submit</span><span class="material-symbols-outlined text-sm" data-icon="arrow_forward_ios">arrow_forward_ios</span>';
    }
    alert(
      "Error submitting feedback. Please check your connection and try again.",
    );
  }
}

// Populate form fields with saved data
function populateFormData() {
  loadFormData();

  for (const [key, value] of Object.entries(formData)) {
    const element =
      document.getElementById(key) || document.querySelector(`[name="${key}"]`);
    if (element) {
      if (element.type === "radio") {
        document
          .querySelector(`input[name="${key}"][value="${value}"]`)
          ?.click();
      } else {
        element.value = value;
      }
    }
  }
}

// Initialize on page load
window.addEventListener("DOMContentLoaded", () => {
  populateFormData();
});

// Save data when navigating away
window.addEventListener("beforeunload", () => {
  collectFormData();
});

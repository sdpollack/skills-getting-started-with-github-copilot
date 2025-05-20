document.addEventListener("DOMContentLoaded", async () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Fetch activities from the backend
  const res = await fetch("/activities");
  const activities = await res.json();

  // Clear loading text
  activitiesList.innerHTML = "";

  // Populate activity select dropdown
  activitySelect.innerHTML = '<option value="">-- Select an activity --</option>';

  Object.entries(activities).forEach(([name, details]) => {
    // Create card
    const card = document.createElement("div");
    card.className = "activity-card";

    // Title
    const title = document.createElement("h4");
    title.textContent = name;
    card.appendChild(title);

    // Description
    const desc = document.createElement("p");
    desc.textContent = details.description;
    card.appendChild(desc);

    // Schedule
    const schedule = document.createElement("p");
    schedule.innerHTML = `<strong>Schedule:</strong> ${details.schedule}`;
    card.appendChild(schedule);

    // Max participants
    const max = document.createElement("p");
    max.innerHTML = `<strong>Max Participants:</strong> ${details.max_participants}`;
    card.appendChild(max);

    // Participants section
    const participantsSection = document.createElement("div");
    participantsSection.className = "participants-section";
    const participantsTitle = document.createElement("strong");
    participantsTitle.textContent = "Participants:";
    participantsSection.appendChild(participantsTitle);

    if (details.participants && details.participants.length > 0) {
      const ul = document.createElement("ul");
      ul.className = "participants-list";
      ul.style.marginLeft = "32px"; // Indent the list a bit more
      details.participants.forEach(email => {
        const li = document.createElement("li");
        li.textContent = email;
        ul.appendChild(li);
      });
      participantsSection.appendChild(ul);
    } else {
      const none = document.createElement("span");
      none.textContent = " None yet";
      participantsSection.appendChild(none);
    }
    card.appendChild(participantsSection);

    activitiesList.appendChild(card);

    // Add to select dropdown
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    activitySelect.appendChild(option);
  });

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });
});

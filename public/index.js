const newPostButton = document.getElementById('newPostButton');
const formOverlay = document.getElementById('formOverlay');
const closeButton = document.getElementById('closeNPButton');
const contentInput = document.getElementById('NPbody');
const charCountDisplay  = document.getElementById('NPcharCount');

let selectedTitle = "";

// Show the form overlay
newPostButton.addEventListener('click', () => {
    formOverlay.style.display = 'flex';
});


// Close the form overlay
closeButton.addEventListener('click', () => {
    formOverlay.style.display = 'none';
});


// Find the form by its ID
const newPostForm = document.getElementById("newPostForm");

// Add a single submit event listener to the form
if (newPostForm) {
    newPostForm.addEventListener("submit", function() {
        // Show the loader when the form is submitted
        const loader = document.getElementById('loaderOverlay');
        if (loader) {
            // Remove the hidden class to make it visible again
            loader.classList.remove('hidden');
        }
        // You can optionally disable the button to prevent double submission
        document.getElementById("submitBtn").disabled = true;
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const adminSvg = document.getElementById("adminsvg");
    const adminButtons = document.querySelectorAll(".admin-btn");

    if (adminSvg) {
        adminSvg.addEventListener("click", function (event) {
            event.preventDefault(); // Prevents the default behavior of the anchor tag
            
            adminButtons.forEach(button => {
                if (button.style.display === "none" || button.style.display === "") {
                    button.style.display = "block";
                } else {
                    button.style.display = "none";
                }
            });
        });
    }
});


contentInput.addEventListener('input', () => {
    const text = contentInput.value;
    const charCount = text.length;

    if (charCount > 300) {
        // Limit to 300 characters
        contentInput.value = text.slice(0, 300);
    }

    // Update character count display
    charCountDisplay.textContent = `${Math.min(charCount, 300)}/300`;
});


  function displayContent(id,image, imageid, title, body, author, typeOfArt) {
    selectedTitle = title;
    selectedId = id;
    selectedImgId = imageid;
    // Populate the view section
    document.getElementById('viewImage').src = image;
    document.getElementById('viewTitle').innerText = title;
    document.getElementById('viewBody').innerText = body;
    document.getElementById('viewAuthor').innerText = `Author: ${author}`;

     // Store values for editing
     document.getElementById("editTitle").value = title;
     document.getElementById("editBody").value = body;
     document.getElementById("editAuthor").value = author;
     document.getElementById("editArtType").value = typeOfArt;
     document.getElementById("editImage").value = image;

    // Show the overlay and view section
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('viewSection').style.display = 'block';
  }

  
  function swapDeleteIcon(isHover) {
    document.getElementById("deleteIcon").src = isHover ? "whiteDeleteSvg.svg" : "deleteSvg.svg";
  }
  function swapEditIcon(isHover) {
    document.getElementById("editIcon").src = isHover ? "whiteEditSvg.svg" : "editSvg.svg";
  }

  function deletePost() {
    fetch("/delete", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ id:selectedId, imageid: selectedImgId  }) 
    }).then(() => window.location.reload());
  }
  function openEditForm() {
    document.getElementById("viewSection").style.display = "none";
    const title = document.getElementById("editTitle").value;
    const body = document.getElementById("editBody").value;
    const author = document.getElementById("editAuthor").value;
    const selectedArtType = document.getElementById("editArtType").value;

    document.getElementById("editMode").value = "true";
    document.getElementById("oldId").value = selectedId;
    document.getElementById("oldImgId").value = selectedImgId;
    document.getElementById("NPtitle").value = title;
    document.getElementById("NPbody").value = body;
    document.getElementById("NPauthorName").value = author;
    document.getElementById("NPdropdown").value = selectedArtType;

    document.getElementById("formOverlay").style.display = "flex";

}

function removePostData(){
  document.getElementById("NPtitle").value = "";
  document.getElementById("NPbody").value = "";
  document.getElementById("NPauthorName").value = "";
  document.getElementById("NPdropdown").value = "";
}


function closeView() {
  // Hide the overlay and view section
  document.getElementById('overlay').style.display = 'none';
  document.getElementById('viewSection').style.display = 'none';
}

document.getElementById("newPostForm").addEventListener("submit", async function (event) {
  event.preventDefault();

  const formData = new FormData(this);

  console.log("Sending Form Data:", formData); // Debugging

  const response = await fetch("/submit", {
    method: "POST",
    body: formData
  });

  const data = await response.json();
  console.log("Server Response:", data); // Debugging

  if (data.success) {
    window.location.reload();
  } else {
    alert("Error submitting post: " + data.message);
  }
});





// ===== MUSIC CONTROLLER LOGIC (with one-time tooltip) =====
document.addEventListener('DOMContentLoaded', () => {
    const music = document.getElementById('background-music');
    music.volume = 0.3
    const controller = document.getElementById('music-controller');
    const trackSelector = document.getElementById('track-selector');
    const tooltip = document.querySelector('.tooltip-text');

    // Show the tooltip on page load
    if (tooltip) {
        tooltip.classList.add('visible');
    }

    // This handles the main play/pause button
    controller.addEventListener('click', () => {
        // Hide the tooltip permanently on the first click
        if (tooltip && tooltip.classList.contains('visible')) {
            tooltip.classList.remove('visible');
        }

        if (music.paused) {
            music.play().catch(error => {
                console.log("Could not play audio:", error);
            });
        } else {
            music.pause();
        }
    });

    // This handles changing the track
    trackSelector.addEventListener('change', (event) => {
        const wasPlaying = !music.paused;
        music.src = event.target.value;
        music.load(); 

        if (wasPlaying) {
            music.play().catch(e => console.log("Error playing new track:", e));
        }
    });

    // --- UI Syncing ---
    music.addEventListener('play', () => {
        controller.classList.add('playing');
        controller.classList.remove('paused');
    });

    music.addEventListener('pause', () => {
        if (controller.classList.contains('playing')) {
            controller.classList.add('paused');
        }
    });

    // Attempt to play on load
    music.play().catch(error => {
        console.log("Autoplay was prevented. A user click is required.");
    });
});

// ===== CURSOR LEAF TRAIL LOGIC (Less Intense) =====

let canCreateLeaf = true; // A flag to control leaf creation

document.addEventListener('mousemove', function(e) {
    if (canCreateLeaf) {
        // Create a new element for the leaf
        let leaf = document.createElement('div');
        leaf.classList.add('leaf-trail');
        
        document.body.appendChild(leaf);

        // Position the leaf at the cursor's coordinates
        leaf.style.left = e.clientX + 'px';
        leaf.style.top = e.clientY + 'px';

        // --- ADJUST THIS VALUE FOR SMALLER/LARGER LEAVES ---
        let size = Math.random() * 20 + 10; // Smaller: now 10px to 30px
        leaf.style.width = size + 'px';
        leaf.style.height = size + 'px';
        
        // Remove the leaf after its animation is finished
        setTimeout(() => {
            leaf.remove();
        }, 1500); // Must match the CSS animation duration (1.5s)

        // Prevent new leaves from being created for a short time
        canCreateLeaf = false;
        setTimeout(() => {
            canCreateLeaf = true;
        }, 75); // --- ADJUST THIS VALUE FOR DENSITY (higher number = fewer leaves) ---
    }
});
// ===== PAGE LOADER LOGIC =====
window.addEventListener('load', () => {
    const loader = document.getElementById('loaderOverlay');
    if (loader) {
        loader.classList.add('hidden');
    }
});
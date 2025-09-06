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


document.getElementById("newPostForm").addEventListener("submit", function() {
  document.getElementById("submitBtn").disabled = true; // Disable submit button
  document.getElementById("formContent").classList.add("submitting"); // Apply fade-out effect
  document.getElementById("loaderOverlay").style.display = "flex"; // Show loader
});

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






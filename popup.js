document.addEventListener('DOMContentLoaded', function() {
    displayLinkList();
  
    var addLinkButton = document.getElementById('add-link-button');
    addLinkButton.addEventListener('click', addLink);
  });
  
  function displayLinkList() {
    var linkListContainer = document.getElementById('link-list');
  
    // Clear the existing link list
    linkListContainer.innerHTML = '';
  
    // Retrieve links from storage
    chrome.storage.sync.get('links', function(result) {
      var links = result.links || [];
  
      for (var i = 0; i < links.length; i++) {
        var link = links[i];
        var listItem = document.createElement('li');
        listItem.classList.add('link-item');
  
        var labelInput = document.createElement('input');
        labelInput.type = 'text';
        labelInput.value = link.text;
  
        var deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', deleteLink.bind(null, i));
  
        var copyButton = document.createElement('button');
        copyButton.classList.add('copy-button');
        copyButton.textContent = 'Copy';
        copyButton.addEventListener('click', copyLinkURL.bind(null, link.url));
  
        var anchor = document.createElement('button');
        anchor.href = link.url;
        anchor.target = '_blank';
        anchor.textContent = link.url;
  
       // listItem.appendChild(labelInput);
       listItem.appendChild(anchor);
        listItem.appendChild(deleteButton);
        listItem.appendChild(copyButton);
        //listItem.appendChild(anchor);
        linkListContainer.appendChild(listItem);
      }
    });
  }
  
  function addLink() {
    var linkInput = document.getElementById('add-link-input');
    var url = linkInput.value.trim();
  
    if (url !== '') {
      // Retrieve existing links from storage
      chrome.storage.sync.get('links', function(result) {
        var links = result.links || [];
  
        // Create a new link object
        var newLink = {
          text: url,
          url: url
        };
  
        // Add the new link to the array
        links.push(newLink);
  
        // Save the updated links array to storage
        chrome.storage.sync.set({ links: links }, function() {
          // Update the link list in the UI
          displayLinkList();
          linkInput.value = '';
        });
      });
    }
  }
  
  function deleteLink(index) {
    // Retrieve existing links from storage
    chrome.storage.sync.get('links', function(result) {
      var links = result.links || [];
  
      // Remove the link at the specified index
      links.splice(index, 1);
  
      // Save the updated links array to storage
      chrome.storage.sync.set({ links: links }, function() {
        // Update the link list in the UI
        displayLinkList();
      });
    });
  }
  
  function copyLinkURL(url) {
    var tempInput = document.createElement('input');
    tempInput.value = url;
   // document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
  }
  
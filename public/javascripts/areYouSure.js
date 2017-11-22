deleteBtn.addEventListener("click", function(event){
        var sure = confirm("Are you sure you want to delete this bird?");
        if (!sure) {
            event.preventDefault();   // don't actually click the button or send a request to the server.
        }
    });

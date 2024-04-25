class Comment
{
    constructor(name, text, date)
    {
        this.name = name;
        this.text = text;
        this.date = date;
        this.color = randomColor();
    }
}

class CommentService //CRUD: Create, Read, Update, and Delete
{
    //API
    static url = "https://6627030ab625bf088c07201b.mockapi.io/comments";

    //CREATE method
    static createComment(comment) //post comment to API
    {
        return $.post(this.url, comment);
    }

    //READ methods
    static getAllComments() //return all comments from API
    {
        console.log("getting comments...")
        return $.get(this.url);
    }

    static getComment(id) //return specific comment by ID
    {
        return $.get(this.url + `/${id}`);
    }

    //UPDATE method
    static updateComments(comment)
    {
        return $.ajax(
            {
                url: this.url + `/${comment._id}`,
                dataType: "json",
                data: JSON.stringify(comment),
                contentType: "application/json",
                type: "PUT"
            });
    }

    //DELETE method
    static deleteComment(id)
    {
        return $.ajax(
        {
            url: this.url + `/${id}`,
            type: "DELETE"
        });
    }
}

class DOMManager
{
    static comments;

    static getAllComments() //grab all comments from API, then when promise is ready, pass them to render() method
    {
        CommentService.getAllComments().then(comments => this.render(comments));
    }

    static deleteComment(id) //delete comment by ID
    {
        console.log(`deleting comment #${id}...`);
        //delete comment
        CommentService.deleteComment(id)
        .then(() => 
        {
            console.log("delete successful")
            //refresh comments when promise is fulfilled
            return CommentService.getAllComments();
        })
        //re-render comments
        .then((comments) => this.render(comments));

    }

    static createComment(name, text, date) //create new comment
    {
        console.log(`creating new comment...`);
        //create comment
        CommentService.createComment(new Comment(name, text, date))
        .then(() =>
        {
            console.log("new comment successful")
            //refresh comments when promise is fulfilled
            return CommentService.getAllComments();
        })
        //re-render comments
        .then((comments) => this.render(comments));
    }

    static render(comments) //edit the DOM to add all of the comments
    {
        this.comments = comments;

        //clear the page (so there aren't duplicate comments when we populate the page with comments)
        $("#app").empty();
        
        for (let comment of comments) //for each comment in comments array
        {
            //console.log(`rendering comment #${comment.id}`);

            //insert HTML into the app div, containing the comment
            $("#app").append(
                `<div id="${comment.id}" class="card card-${comment.color} shadow-sm comment">
                    <h5 class="card-header card-header-${comment.color} comment-stuff">
                        <div style="float: left">${comment.name}</div>
                        <div style="float: right"><h6>${comment.date}</h6></div>
                        <div style="clear: both;"></div>
                    </h5>
                    <div class="card-body comment-stuff">
                        <p>${comment.text}</p>
                        <button class="btn btn-outline-primary" onclick="alertFunction()">Reply</button>

                        <button class="btn btn-outline-danger" onclick="DOMManager.deleteComment('${comment.id}')">Delete</button>
                    </div>
                </div>
                `
            );
        }

    }
}

//new comment button
$("#submit-comment").on("click", function()
{
    let name = $('#name');
    let text = $('#new-comment-text');
    //JS built-in time/date object
    let date = new Date();
    let day = date.toLocaleDateString();
    var options =
    {
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }
    let time = date.toLocaleTimeString("en-US", options);
    let dateString = `${day} ${time}`;

    //data validation
    if(name.val() == "")
    {
        //undo any style changes
        name.css("border-color", "");
        text.css("border-color", "");

        //highlight input field
        name.css("border-color", "red");
        alert("You must enter a name to leave a comment.");
    }
    else if(text.val() == "")
    {
        name.css("border-color", "");
        text.css("border-color", "");

        //highlight input field
        text.css("border-color", "red");
        alert("You must enter some text to leave a comment.");
    }
    else
    {
        //post comment
        DOMManager.createComment(name.val(), text.val(), dateString);

        //reset fields
        name.val("");
        text.val("");
        name.css("border-color", "");
        text.css("border-color", "");
    }
});

//misc functions
function randomColor() 
{
    let randomNum = Math.floor(Math.random() * (7 - 1) + 1);

    if(randomNum == 1)
    {
        return "red";
    }
    else if(randomNum == 2)
    {
        return "orange";
    }
    else if(randomNum == 3)
    {
        return "yellow";
    }
    else if(randomNum == 4)
    {
        return "green";
    }
    else if(randomNum == 5)
    {
        return "grey";
    }
    else if(randomNum == 6)
    {
        return "blue";
    }
    else if(randomNum == 7)
    {
        return "purple";
    }
}

function alertFunction()
{
    alert("Replies are not functional at this time. :)");
}

//when page loads, get comments from API
DOMManager.getAllComments();
class Comment
{
    constructor(name, text, date)
    {
        this.name = name;
        this.text = text;
        this.date = date;
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
                `<div id="${comment.id}" class="card shadow-sm comment">
                    <h5 class="card-header comment-stuff">
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
    let name = $('#name').val();
    let text = $('#new-comment-text').val();

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

    //create the comment
    DOMManager.createComment(name, text, dateString);

    //reset fields
    $('#name').val("");
    $('#new-comment-text').val("");
});

function alertFunction()
{
    alert("Replies are not functional at this time. :)");
}

//when page loads, get comments from API
DOMManager.getAllComments();
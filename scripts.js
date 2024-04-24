class Comment
{
    constructor(name, email, comment)
    {
        this.name = name;
        this.email = email;
        this.date = date;
        this.comment = comment;
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
        console.log($.get(this.url));
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
            url: this.url + `/${comment._id}`,
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

    static render(comments) //edit the DOM to add all of the comments
    {
        this.comments = comments;

        //clear the page (so there aren't duplicate comments when we populate the page with comments)
        $("#app").empty();
        
        for (let comment of comments) //for each comment in comments array
        {
            //insert HTML into the app div, containing the comment
            $("#app").append(
                `<div id="${comment._id}" class="card shadow-sm comment">
                    <h5 class="card-header comment-stuff">
                        <div style="float: left">${comment.name}</div>
                        <div style="float: right"><h6>${comment.createdAt}</h6></div>
                        <div style="clear: both;"></div>
                    </h5>
                    <div class="card-body comment-stuff">
                        <p>${comment.text}</p>
                    </div>
                </div>
                `
            );
        }

    }
}

DOMManager.getAllComments();
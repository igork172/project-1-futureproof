let idArray
try {
    idArray = JSON.parse(getCookie('idArray'));
} catch (err) {
    idArray = [1, 2, 3, 4, 5];
};

const showGif = () => {
    var query = document.getElementById('query').value;
    var xhr = $.get(`https://api.giphy.com/v1/gifs/search?api_key=EsXT2LFJzPBqw9GMg0nHB9fUlNsG5x4F&q=${query}&limit=25&offset=0&rating=G&lang=en`)
    xhr.done(function (data) {
        console.log(query)
        console.log(data)
        console.log(data.data[0].images.original.url)
        let gifUrl = data.data[0].images.original.url;
        return gifUrl;
    });
};

$(document).ready(() => {

    // LISTEN FOR BUTTON CLICK ON SUBMIT
    $("#submit").click((event) => {
        event.preventDefault();
        let gifUrl = '';
        var query = document.getElementById('query').value;
        var xhr = $.get(`https://api.giphy.com/v1/gifs/search?api_key=EsXT2LFJzPBqw9GMg0nHB9fUlNsG5x4F&q=${query}&limit=25&offset=0&rating=G&lang=en`)
        
        xhr.done(function (data) {
            console.log(query)
            console.log(data)
            console.log(data.data[0].images.original.url)
            gifUrl = data.data[0].images.original.url;

        });
        console.log(gifUrl);



        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        //VERY HACKY, NOT GOOD CODE, REPLACE IWHT PROPER ASYNC AWAIT PROMISE FUNCTION.
        sleep(500).then(() => {
            // GET VALUES FROM SUBMISSION FORM
        let submission = {
            id: null,
            title: $("#title").val(),
            message: $("#message").val(),
            gif: gifUrl,
            dateTime: null,
            commentArray: null,

        };
        // POSTS SUBMISSION TO SERVER
        $.post(`/submission`, submission, (data) => {
            console.log(data);
            displayContent(data); //change to data later
        });

        $('input[type="text"], textarea').val('')

    });
        });

       

    // LISTEN FOR BUTTON CLICK ON COMMENT
    for (let s = 0; s < 5; s++) {
        $(`#comment${s+1}`).click((event) => {
            event.preventDefault();
            commentFunction(s + 1);
        });
    }
});

const commentFunction = (number) => {
    event.preventDefault();
    // GET VALUES FROM COMMENT FORM
    let comment = {
        id: Number(idArray[number - 1]),
        message: $(`#textarea${number}`).val(),
        dateTime: null
    };
    // POSTS COMMENT TO SERVER
    $.post(`/comments`, comment, (data) => {
        displayContent(data);
        $('input[type="text"], textarea').val('')

    })
};

const emojiFunction = (submissionID, emojiIndex) => {
    event.preventDefault();
    // GET VALUES FROM COMMENT FORM

    let emoji = [submissionID, emojiIndex];

    // POSTS COMMENT TO SERVER
    $.post(`/emojis`, emoji, (data) => {
        displayContent(data);
    })
};


const displayContent = (arg) => {
    //arg = JSON.parse(arg);
    console.log(arg);
    arg = JSON.parse(arg);
    console.log(arg.submissions);
    console.log(arg.submissions[0]['commentArray[]']);
    console.log(typeof (arg.submissions[0]['commentArray[]']));
    console.log(Object.keys(arg.submissions).length)
    for (let x = 0; x < 5; x++) {
        document.getElementById(`post-container${x+1}`).style.display = "none";
    }
    for (let i = 0; i < Object.keys(arg.submissions).length; i++) {
        let id = arg.submissions[i].id;
        idArray[i] = id;
        document.getElementById(`post-title${i+1}`).innerHTML = arg.submissions[i].title;
        document.getElementById(`post-message${i+1}`).innerHTML = arg.submissions[i].message;
        document.getElementById(`post-gif${i+1}`).src = arg.submissions[i].gif;
        console.log(arg.submissions[i]['commentArray[]'].length)
        for (let j = 0; j < arg.submissions[i]['commentArray[]'].length; j++) {
            document.getElementById(`display-comment${i+1}-${j+1}`).innerHTML = arg.submissions[i]['commentArray[]'][j];
        };
        // for (let k= 0; k < 3; k++){
        //     document.getElementById(`span${i+1}-${k+1}`).innerHTML = arg.submissions[i].emoji[k];
        //     $(`#post-emoji${i+1}-${k+1}`).click((event) => {
        //         event.preventDefault();
        //         emojiFunction(id, k);
        //     });
        // }    
        document.getElementById(`post-container${i+1}`).style.display = "flex";
    };
    //createCookie('idArray', JSON.stringify(idArray));


};
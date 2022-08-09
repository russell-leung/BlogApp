//how to expect a 500 response???

let app = new Vue({
    el: "#vueApp",
    data: {
        articles: null,
        token: '',
        loggedIn: false,
        email: '',
        password: '',
        title: '',
        body: '',
    },
    methods: {

        /**
         * Checks to see if user's token is valid, if so, it logs the user in
         */
        loginStatus(){

            //request to api to check token
            fetch("http://localhost:8080/login", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.token}`,
                }
            })
            .then(response => response.json())
            .then(data => ( this.loggedIn = data.success ));

        },

        /**
         * grab token based off user credentials
         * @param {*} email 
         * @param {*} password 
         */
        getToken(email, password){

            if(email === '' || password === ''){
                alert('Login Failed');
                return;
            }

            fetch("http://localhost:8080/get-token", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({'email': email, 'password': password}),
            }).then((response) => response.json())
            .then((data) => {
                console.log('Success:', data);
                this.token = data.token;
                this.saveToken();
                this.email = '';
                this.password = '';

                //redirect back to home page
                window.location.replace('index.html');
                alert('Login Successful');
            })
            .catch((error) => {
                console.error('Error:', error);
                this.email = '';
                this.password = '';

                alert('Login Failed');
            });

        },

        /**
         * register users into the api
         * @param {*} email 
         * @param {*} password 
         */
        register(email, password){

            fetch("http://localhost:8080/users", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({'email': email, 'password': password}),
            }).then((response) => response.json())
            .then((data) => {

                if(data.success){
                    console.log('Success:', data);
                    //redirect back to home page
                    window.location.replace('index.html');
                    alert('Registration Successful');
                } else {
                    console.log('Error:', data)
                    alert('Registration Failed');
                }
                
                this.email = '';
                this.password = '';
            });

        },

        /**
         * makes users' post and saves it to the api
         * @param {*} title 
         * @param {*} body 
         */
        makePost(title, body){

            fetch("http://localhost:8080/articles", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.token}`
                },
                body: JSON.stringify({'title': title, 'body': body}),
            }).then((response) => response.json())
            .then((data) => {

                if(data.success){
                    console.log('Success:', data);
                    //redirect back to home page
                    window.location.replace('index.html');
                    alert('Registration Successful');
                } else {
                    console.log('Error:', data)
                    alert('Post Creation Failed');
                }
                
                this.title = '';
                this.body = '';
            });
        },

        /**
         * edit existing posts
         * @param {*} id 
         * @param {*} title 
         * @param {*} body 
         */
        editPosts(id, title, body){

            fetch(`http://localhost:8080/articles/${id}`, {
                method: "PUT",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.token}`,
                },
                body: JSON.stringify({'title': title, 'body': body}),
            }).then((response) => response.json())
            .then((data) => {

                if(data.success){
                    console.log('Success:', data);
                    //refresh
                    window.location.reload()
                    alert('Post Edit Successful');
                } else {
                    console.log('Error:', data)
                    alert('Post Edit Failed');
                }
                
                this.title = '';
                this.body = '';
            });
            
        },

        /**
         * delete posts
         * @param {*} id 
         */
        deletePost(id){

            fetch(`http://localhost:8080/articles/${id}`, {
                method: "DELETE",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.token}`,
                },
            }).then((response) => response.json())
            .then((data) => {

                if(data.success){
                    console.log('Success:', data);
                    //refresh
                    window.location.reload()
                    alert('Post Deleted');
                } else {
                    console.log('Error:', data)
                    alert('Post Deletion Failed');
                }
                
                this.title = '';
                this.body = '';
            });

        },

        /**
         * logs user out and deletes token from memory
         */
        logout() {
            this.token = '';
            this.saveToken();
            window.location.replace('index.html');
            alert('Successfully Logged Out!');
        },

        /**
         * saves token to persistant memory
         */
        saveToken(){
            const parsed = JSON.stringify(this.token);
            localStorage.setItem("token", parsed);
        }
    },
    mounted() {

        //checks for pre-existing token
        if(localStorage.getItem('token')){
            try {
                this.token = JSON.parse(localStorage.getItem("token"));
            } catch(e) {
                localStorage.removeItem('token');
            }
        }

        // update login status based off the pre-existing token if there is one
        this.loginStatus(this.token);

        //fetch the articles which is public facing (no auth needed)
        fetch("http://localhost:8080/articles.json")
        .then(response => response.json())
        .then(data => (this.articles = data.articles));
    },
});
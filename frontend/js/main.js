let app = new Vue({
    el: "#vueApp",
    data: {
        articles: null,
        token: '',
        loggedIn: false,
        userID: null,
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

            //make sure the token isnt null
            if(this.token === '') {
                return;
            }

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

            const loader = document.querySelector("#loader");
            loader.removeAttribute('hidden');

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
                this.userID = data.id;
                this.saveUser();
                this.email = '';
                this.password = '';

                loader.setAttribute('hidden', '');

                //redirect back to home page
                window.location.replace('index.html');
                alert('Login Successful');
            })
            .catch((error) => {
                console.error('Error:', error);
                this.email = '';
                this.password = '';

                loader.setAttribute('hidden', '');

                alert('Login Failed');
            });

        },

        /**
         * register users into the api
         * @param {*} email 
         * @param {*} password 
         */
        register(email, password){

            const loader = document.querySelector("#loader");
            loader.removeAttribute('hidden');

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

                loader.setAttribute('hidden', '');
                
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

            const loader = document.querySelector("#loader");
            loader.removeAttribute('hidden');

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
                    alert('Post Made Successfully');
                } else {
                    console.log('Error:', data)
                    alert('Post Creation Failed');
                }
                
                loader.setAttribute('hidden', '');

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

            const loader = document.querySelector("#loader");
            loader.removeAttribute('hidden');

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

                loader.setAttribute('hidden', '');
                
                this.title = '';
                this.body = '';
            });
            
        },

        /**
         * delete posts
         * @param {*} id 
         */
        deletePost(id){

            const loader = document.querySelector("#loader");
            loader.removeAttribute('hidden');

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
                    window.location.reload();
                    alert('Post Deleted');
                } else {
                    console.log('Error:', data)
                    alert('Post Deletion Failed');
                }

                loader.setAttribute('hidden', '');
            });

        },

        /**
         * logs user out and deletes token from memory
         */
        logout() {
            this.token = '';
            this.userID = '';
            this.saveUser();
            window.location.replace('index.html');
            alert('Successfully Logged Out!');
        },

        /**
         * saves token to persistant memory
         */
        saveUser(){
            localStorage.setItem("token", JSON.stringify(this.token));
            localStorage.setItem("userID", JSON.stringify(this.userID));
        },

        /**
         * delete user account
         */
        deleteAccount(){

            const loader = document.querySelector("#loader");
            loader.removeAttribute('hidden');

            fetch(`http://localhost:8080/users/${this.userID}`, {
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
                    //logs user out ensuring statless auth doesn't continue
                    this.logout();
                    alert('User Deleted');
                } else {
                    console.log('Error:', data)
                    alert('User Deletion Failed');
                }

                loader.setAttribute('hidden', '');
                
            });
        },

        /**
         * opens form popup for email change
         */
        openForm() {
            document.querySelector("#form-popup").style.display = "flex";
        },

        /**
         * closes form popup for email change
         */
        closeForm() {
            document.querySelector("#form-popup").style.display = "none";
        },
        
        /**
         * change user email
         * @param {*} email 
         */
        changeEmail(email) {

            const loader = document.querySelector("#loader");
            loader.removeAttribute('hidden');

            fetch(`http://localhost:8080/users/${this.userID}`, {
                method: "PUT",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.token}`,
                },
                body: JSON.stringify({'email': email}),
            }).then((response) => response.json())
            .then((data) => {

                if(data.success){
                    console.log('Success:', data);
                    //refresh
                    window.location.reload()
                    alert(`User Email Edit Successful, New email: ${email}`);
                } else {
                    console.log('Error:', data)
                    alert('User Email Edit Failed');
                }

                loader.setAttribute('hidden', '');
                
                this.email = '';
            });
        },

    },
    mounted() {

        //enables loader while pending api response
        const loader = document.querySelector("#loader");
        loader.removeAttribute('hidden');

        //checks for pre-existing user
        if(localStorage.getItem('token')){
            try {
                this.token = JSON.parse(localStorage.getItem("token"));
                this.userID = JSON.parse(localStorage.getItem("userID"));
            } catch(e) {
                localStorage.removeItem('token');
                localStorage.removeItem('id');
            }
        }

        // update login status based off the pre-existing token if there is one
        this.loginStatus(this.token);

        //fetch the articles which is public facing (no auth needed)
        fetch("http://localhost:8080/articles.json")
        .then(response => response.json())
        .then(data => {
            this.articles = data.articles;
            //rehides loader after api sends response
            loader.setAttribute('hidden', '');
        });
    },
});
// Queste istruzioni servono per generare la componente per effettuare il login o la registrazione sul sito.

const bigWrapper = document.createElement("div");
bigWrapper.classList.add("big-wrapper");
bigWrapper.innerHTML = 
`
<div class="wrapper">
<span class="icon-close">
<i class="bi bi-x-lg"></i>
</span>
<div class="form-box login">
<div class="d-flex justify-content-center mb-5">
<img src="./downloads/logo-hackthegame.png" width="200px" alt="">
</div>
<h2>Sign In</h2>
<form id="formL" action="/">
<div class="input-box">
<span class="icon"><i class="bi bi-envelope"></i></span>
<input id="emailL" name="emailL" type="text">
<label for="emailL">Email</label>
<div class="error"></div>
</div>
<div class="input-box">
<button class="icon-eye login-eye" type="button"><i class="bi bi-eye-slash-fill"></i></button>
<input id="passwordL" name="passwordL" type="password">
<label for="passwordL">Password</label>
<div class="error"></div>
</div>
<div class="remember-forgot">
<label>
<input type="checkbox">
Remember me
</label>
<a href="#">Forgot Password?</a>
</div>
<button class="btn-sub" type="submit">Login</button>
<div class="text-center mt-4">
<a class="custom--a" href="#">Privacy Policy</a>
</div>
<div class="login-register">
<p>Don't have an account?
<a href="#" class="register-link">Sign Up</a>
</p>
</div>
</form>
</div>
<div class="form-box register">
<div class="d-flex justify-content-center mb-5">
<img src="./downloads/logo-hackthegame.png" width="200px" alt="">
</div>
<h2>Sign Up</h2>
<form id="form" action="/">
<div class="input-box">
<input id="username" name="username" type="text">
<label for="username">Username</label>
<div class="error"></div>
<div class="info"><i class="bi bi-info-circle"></i></div>
<div class="info-text">
<p>The Username must be between 3 and 30 characters long, whitespace characters at the start or the end of the username will be removed.</p>
</div>
</div>
<div class="input-box">
<span class="icon"><i class="bi bi-envelope"></i></span>
<input id="email" name="email" type="text">
<label for="email">Email</label>
<div class="error"></div>
</div>
<div class="input-box">
<button class="icon-eye reg-eye" type="button"><i class="bi bi-eye-slash-fill"></i></button>
<input id="password" name="password" type="password">
<label for="password">Password</label>
<div class="error"></div>
<div class="info"><i class="bi bi-info-circle"></i></div>
<div class="info-text">
<p>The Password must contain at least 8 characters, a small letter, a capital letter, a number, a special character and no whitespace.</p>
</div>
</div>
<div class="input-box">
<button class="icon-eye reg-eye" type="button"><i class="bi bi-eye-slash-fill"></i></button>
<input id="password2" name="password2" type="password">
<label for="password">Confirm Password</label>
<div class="error"></div>
<div class="info"><i class="bi bi-info-circle"></i></div>
<div class="info-text">
<p>The Passwords must match.</p>
</div>                
</div>
<div class="remember-forgot">
<label>
<input type="checkbox">
I agree to the <a class="ms-1" href="#">terms and conditions</a>
</label>
</div>
<button class="btn-sub" type="submit">Continue</button>
<div class="text-center mt-4">
<a class="custom--a" href="#">Privacy Policy</a>
</div>
<div class="login-register">
<p>Already have an account?
<a href="#" class="login-link">Sign In</a>
</p>
</div>
</form>
</div>
</div>  `;

const btnPopup = document.querySelector('.btnLogin-popup');

// Questo addEventListener serve a mostrare la componente per effettuare il login o la registrazione sul sito.

btnPopup.addEventListener("click", ()=>{
    bigWrapper.style.opacity = "1";
    document.body.style.overflow = "hidden";
    document.body.insertBefore(bigWrapper, document.body.children[0]);
    const wrapper = document.querySelector('.wrapper');
    const loginLink = document.querySelector('.login-link');
    const registerLink = document.querySelector('.register-link');
    const iconClose = document.querySelector('.icon-close');
    const iconEye = document.querySelectorAll('.icon-eye');
    const info = document.querySelectorAll('.info');
    
    wrapper.classList.add("active-popup");

    // Questi addEventListener servono per scambiare il form di login e registrazione.
    
    registerLink.addEventListener("click", ()=>{
        wrapper.classList.add("active");
    })
    
    loginLink.addEventListener("click", ()=>{
        wrapper.classList.remove("active");
    })

    // Questo addEventListener serve per nascondere la componente per effettuare il login o la registrazione sul sito. 
    
    iconClose.addEventListener("click", ()=>{
        document.body.style.overflow = "visible";
        wrapper.classList.remove("active-popup");
        bigWrapper.style.opacity = 0;
        setTimeout(() => {
            bigWrapper.remove();
        }, 400);
    })

    // Queste istruzioni servono per mostrare o nascondere le password scambiando a loro volta le icone.
    
    for (let i = 0; i < iconEye.length; i++) {
        iconEye[i].addEventListener('click', ()=>{
            if (iconEye[i].children[0].classList.contains("bi-eye-slash-fill")) {
                iconEye[i].children[0].classList.remove("bi-eye-slash-fill");
                iconEye[i].children[0].classList.add("bi-eye-fill");
                iconEye[i].parentElement.querySelector("input").type = "text"
            } else {
                iconEye[i].children[0].classList.remove("bi-eye-fill");
                iconEye[i].children[0].classList.add("bi-eye-slash-fill");
                iconEye[i].parentElement.querySelector("input").type = "password"
            }
        })
    }

    // Queste istruzioni permettono di visualizzare le informazioni quando il cursore del mouse è posizionato sulle relative icone.
    
    for (let i = 0; i < info.length; i++) {
        info[i].addEventListener('mouseover', ()=>{
            info[i].parentElement.querySelector(".info-text").classList.add("info-show")
        })
        info[i].addEventListener('mouseout', ()=>{
            info[i].parentElement.querySelector(".info-text").classList.remove("info-show")
        })
    }

    // Questo addEventListener serve a far scomparire la componente per effettuare il login o la registrazione sul sito quando si clicca in qualsiasi punto fuori da esso.
    
    document.addEventListener("click", (e)=>{
        if (e.target.closest(".btnLogin-popup")==null && e.target.closest(".wrapper")==null) {
            document.body.style.overflow = "visible";
            wrapper.classList.remove("active-popup");
            bigWrapper.style.opacity = 0;
            setTimeout(() => {
                bigWrapper.remove();
            }, 400);
        }
    })
    
    const input = Array.from(document.querySelectorAll("input"));

    // Queste istruzioni servono a far alzare o abbassare le label dei vari input quando si focalizza su di essi, inoltre le label restano sollevate fintanto che c'è del testo dentro.
    
    checkInputStyleII(input);
    
    document.addEventListener('click', (e)=>{
        for (let i = 0; i < input.length; i++) {
            if (input[i].parentElement.querySelector("label")) {
                input[i].parentElement.querySelector("label").style.top = "50%";
            }
        }
        checkInputStyleII(input);
        if (e.target.closest('input') && e.target.closest('input').type!="checkbox") {
            e.target.parentElement.querySelector("label").style.top = "-5px";    
        } 
    })

    // Le varie istruzioni di seguito servono a validare i vari campi di input di ambo i form controllando che i dati inseriti rispettino gli standard richiesti.
    
    const formL = document.querySelector("#formL");
    const emailL = document.querySelector("#emailL");
    const passwordL = document.querySelector("#passwordL");
    
    const form = document.querySelector("#form");
    const username = document.querySelector("#username");
    const email = document.querySelector("#email");
    const password = document.querySelector("#password");
    const password2 = document.querySelector("#password2");
    
    formL.addEventListener("submit", (e)=>{
        e.preventDefault();
        validateInputsL();
    })
    
    form.addEventListener("submit", (e)=>{
        e.preventDefault();
        validateInputs();
    })

    // La funzione per validare i campi di input del form di Login.
    
    function validateInputsL() {
        const emailValue = emailL.value.trim();
        const passwordValue = passwordL.value;
        
        if (emailValue === '') {
            setError(emailL, 'Email is required')    
        } else if (!isValidEmail(emailValue)) {
            setError(emailL, 'Provide a valid email address')    
        } else {
            setSuccess(emailL)
        }
        
        if(passwordValue === '')
        setError(passwordL, 'Password is required');
        else 
        setSuccess(passwordL);
    }
    
    // La funzione per validare i campi di input del form di Registrazione.

    function validateInputs() {
        const usernameValue = username.value.trim();
        const emailValue = email.value.trim();
        const passwordValue = password.value;
        const password2Value = password2.value;
        
        if (usernameValue === '') {
            setError(username, 'Username is required')    
        } else if (usernameValue.length < 3) {
            setError(username, 'The username must contain at least 3 characters')
        } else if (usernameValue.length > 30) {
            setError(username, 'The username must contain at max 30 characters')    
        } else {
            setSuccess(username)
        }
        
        if (emailValue === '') {
            setError(email, 'Email is required')    
        } else if (!isValidEmail(emailValue)) {
            setError(email, 'Provide a valid email address')    
        } else {
            setSuccess(email)
        }
        
                
        if(passwordValue === '') {
            setError(password, 'Password is required');
        } else if (passwordValue.length < 8 ) {
            setError(password, 'The Password must contain at least 8 characters')
        } else if (!isValidPassword(passwordValue)) {
            
            let textError = ["The Password must contain at least "];
            if (!hasLowerCase(passwordValue)) 
            textError.push("a small letter, ")
            if (!hasUpperCase(passwordValue)) 
            textError.push("a capital letter, ")
            if (!hasDigit(passwordValue)) 
            textError.push("a number, ")
            if (!hasSpecialChar(passwordValue)) 
            textError.push("a special character, ")
            if (textError.length == 2) {
                textError[textError.length-1] = textError[textError.length-1].replace(", ", "");
            } else {
                textError[textError.length-1] = textError[textError.length-1].replace("a ", "and a ").replace(", ", "");
            }
            textError.push(" yet")
            if (hasWhitespace(passwordValue)){
                if (textError.length == 2) {
                    textError = ["Don't use whitespace characters"];
                } else {
                    textError.push (", don't use whitespace characters");
                }
            } 
            setError(password, textError.join(""));

        } else {
            setSuccess(password);
        }
                
        if(password2Value === '') {
            setError(password2, 'Password is required');
        } else if (password2Value !== passwordValue) {
            setError(password2, "Passwords do not match");
        } else {
            setSuccess(password2);
        }
    }
    
})

// La funzioni per controllare lo stile delle label.

function checkInputStyle(value, inputIndex) {
    if (value === '' && inputIndex.parentElement.querySelector("label")) {
        inputIndex.parentElement.querySelector("label").style.top = "50%";
    } else if (inputIndex.parentElement.querySelector("label")) {
        inputIndex.parentElement.querySelector("label").style.top = "-5px";
    }
}

function checkInputStyleII(input) {
    for (let i = 0; i < input.length; i++) {
        checkInputStyle(input[i].value, input[i])
        input[i].addEventListener('focus', (e)=>{
            checkInputStyle(e.target.value, input[i])
        })
    }
}

// La funzione di display nel caso in cui i dati inseriti non siano corretti.

function setError(element, message) {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');
    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success');
}

// La funzione di display nel caso in cui i dati inseriti siano corretti.

function setSuccess(element) {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');
    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
}

// Varie funzioni che controllano attraverso espressioni regolari che i dati inseriti rispettino vari standard richiesti.

const isValidEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const isValidPassword = password => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)/;
    const whitespace = /^(?=.*\s)/;
    return re.test(password) && !whitespace.test(password); 
}

const hasLowerCase = password => {
    const lCase = /^(?=.*[a-z])/;        
    return lCase.test(password);
}

const hasUpperCase = password => {
    const uCase = /^(?=.*[A-Z])/;        
    return uCase.test(password);
}

const hasDigit = password => {
    const digit = /^(?=.*\d)/;           
    return digit.test(password);
}

const hasSpecialChar = password => {
    const sChar = /[^\w ]/;          
    return sChar.test(password);
}

const hasWhitespace = password => {
    const whitespace = /^(?=.*\s)/;
    return whitespace.test(password);
}

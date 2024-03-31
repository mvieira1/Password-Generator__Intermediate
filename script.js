document.addEventListener('DOMContentLoaded', () => {

    function getUppercaseLetter(){
        let randomCode = Math.floor(Math.random() * (90-65+1) + 65);
        return String.fromCharCode(randomCode);
    };

    function getLowercaseLetter(){
        let randomCode = Math.floor(Math.random() * (122-97+1) + 97); //* 26 = [0, 26[ + 97 = [97, 123[
        return String.fromCharCode(randomCode); //retorna a string correspondente à sequência de Unicode values (UTF-16 values), que passamos como argumento. Neste caso, só vou passar um valor, por isso, só vai retornar um character
    };

    //String.fromCharCode(97); //letra 'a'
    //String.fromCharCode(122); //letra 'z'
    //String.fromCharCode(65); //letra 'A'
    //String.fromCharCode(90); //letra 'Z'
    //33 ao 47 + 58 ao 64 + 91 ao 96 + 123 ao 126 são símbolos

    function getNumber(){
        let randomCode = Math.floor(Math.random() * 10 + 48);
        return String.fromCharCode(randomCode);
    };

    function getSymbol(){
        
        //Podia, simplesmente, ter escrito uma string de símbolos e ir buscar um, aleatoriamente, mas vou usar os codes para praticar o uso do .fromCharCode da String

        let codesArray = [];

        for(let i = 33; i < 48; i++){
            codesArray.push(i);
        };

        for(let i = 58; i < 65; i++){
            codesArray.push(i);
        };

        for(let i = 91; i < 97; i++){
            codesArray.push(i);
        };

        for(let i = 123; i < 127; i++){
            codesArray.push(i);
        };

        //console.log(codesArray);
        //let symbolsArray = codesArray.map(code => String.fromCharCode(code));
        //console.log(symbolsArray);
        //console.log(symbolsArray.length);

        let randomCode = codesArray[Math.floor(Math.random() * codesArray.length)];
        return String.fromCharCode(randomCode);
    };

    let passLengthInput = document.querySelector('#password-length'); //vai buscar o primeiro elemento que dá match com o selector
    let currentPassLength = document.getElementById('pass-length');

    let length = 0; //predefined length/length inicial

    passLengthInput.addEventListener('change', (eventObject) => {
        currentPassLength.innerText = eventObject.target.value;
        length = eventObject.target.value;
    });

    let checkboxes = document.querySelectorAll('input[type="checkbox"]');

    let definedSettings = {
        "uppercase": false,
        "lowercase": false,
        "numbers": false,
        "symbols": false
    };

    let checkedSettings = [];
    let checkedCount = 0;

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (eventObject) => { //Sempre que existe uma mudança no valor da checkbox, atualizo o definedSettings
            
            if(checkbox.checked){
                definedSettings[eventObject.target.name] = true;
            }else{
                definedSettings[eventObject.target.name] = false;
            };

            console.log(definedSettings);
            //{uppercase: false, lowercase: true, numbers: false, symbols: false}

            //Sempre que uma checkbox é selecionada/deselecionada, vou ver se existe alguma checked option e só nesse caso é que dou enabled do button, otherwise, a app vai crashar
            checkedSettings = Object.keys(definedSettings).filter(key => definedSettings[key] === true);
            checkedCount = checkedSettings.length;
            checkedCount === 0 ? button.disabled = true : button.disabled = false;
        });
    });

    const settingsFunctions = {
        "uppercase": getUppercaseLetter,
        "lowercase": getLowercaseLetter,
        "numbers": getNumber,
        "symbols": getSymbol
    };

    let generatedPass = document.querySelector('.generated-pass');
    generatePassword.value = 'P4S$w0rd';

    const button = document.querySelector('button');

    button.addEventListener('click', generatePassword);

    function generatePassword(){

        let password = '';

        //vou criar um array só com os nomes dos settings que foram checked para depois loop through it e invocar as respetivas funções até atingir a length
        //let checkedSettings = Object.keys(definedSettings).filter(key => definedSettings[key] === true);
        let checkedSettingsFunctions = checkedSettings.map(setting => settingsFunctions[setting]);
        //Vou baralhar o array para os charcater types não ficarem sempre na mesma ordem, quando faço o forEach. Por ex., se der check aos 4 tipos, a password terá sempre maiúscula > minúscula > number > symbol > maiúscula > minúscula > number > symbol > ...
        let shuffledArray = checkedSettingsFunctions.sort((a, b) => 0.5 - Math.random());

        let checkedCount = checkedSettings.length;

        /* Já não preciso disto, pq deu disable do butão, quando não há checked options
        if(checkedCount === 0){
            password = '';
        };
        */

        for(let i = 0; i < length; i += checkedCount){
            shuffledArray.forEach(settingFunction => {
                password += settingFunction()
            });
        };

        //PROBLEMA: se a length for, por ex., 1 e o user selecionar todas as checkboxes, o .forEach acima vai ser corrido uma vez para cada checked setting, ou seja, vamos gerar na mesma 4 caracteres para uma password length de 1. Não queremos isso.

        //SOLUÇÃO: truncar a password

        let finalPassword = password.slice(0, length);

        generatedPass.value = finalPassword;

        passwordStrength(finalPassword);

    };

    const strengthName = document.querySelector('.strength-name');

    function passwordStrength(pass){

        let passwordScore = 100;

        passwordScore = passwordScore
        - lengthWeakness(pass) //length weakness
        - charactersWeakness(pass, /[A-Z]/g) //evaluates the uppercase weakness
        - charactersWeakness(pass, /[a-z]/g) //lowercase weakness
        - charactersWeakness(pass, /[0-9]/g) //numbers weakness
        - charactersWeakness(pass, /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g); //symbols weakness
        - repeatedCharacteres(pass, passwordScore); //evaluates the weakness of having 2 equal characters in a row

        console.log(passwordScore);

        const rectangles = Array.from(document.querySelectorAll('.rectangle'));

        if(pass.length === 0){

            strengthName.innerText = "Invalid";

            rectangles.forEach(rectangle => {
                rectangle.classList.remove('active');
            });

        }else if(passwordScore < 50){

            strengthName.innerText = "Weak";

            rectangles.forEach(rectangle => {
                rectangle.classList.remove('active');
            });

            rectangles[0].classList.add('active');

        }else if(passwordScore >= 50 && passwordScore < 70){

            strengthName.innerText = "Medium";

            rectangles.forEach(rectangle => {
                rectangle.classList.remove('active');
            });

            rectangles[0].classList.add('active');
            rectangles[1].classList.add('active');

        }else if(passwordScore >= 70 && passwordScore < 90){

            strengthName.innerText = "Strong";

            rectangles.forEach(rectangle => {
                rectangle.classList.remove('active');
            });

            rectangles[0].classList.add('active');
            rectangles[1].classList.add('active');
            rectangles[2].classList.add('active');

        }else if(passwordScore >= 90){

            strengthName.innerText = "Unbeatable";

            rectangles.forEach(rectangle => {
                rectangle.classList.remove('active');
            });

            rectangles[0].classList.add('active');
            rectangles[1].classList.add('active');
            rectangles[2].classList.add('active');
            rectangles[3].classList.add('active');

        };

    };

    function lengthWeakness(pass){

        subtraction = 0;

        if(pass.length < 5){
            subtraction = 40;
        };

        if(pass.length >= 5 && pass.length <= 10){
            subtraction = 15;
        };

        return subtraction;
    };

    function charactersWeakness(pass, regex){

        subtraction = 0;

        let matches = pass.match(regex) || [];

        if(matches.length === 0){
            subtraction = 20;
        };

        if(matches.length > 0 && matches.length <= 2){
            subtraction = 5;
        };

        return subtraction;
    };

    function repeatedCharacteres(pass){

        let repeatedCharMatches = pass.match(/(.)\1/g) || [];

        subtraction = repeatedCharMatches.length * 10;

        return subtraction;

    };

    /*
    function lowercaseStrength(finalPassword){
        //Em vez de verificar apenas se o user optou ou não por incluir letras minúsculas, vou antes avaliar o número de lowercase characters e aproveitar para relembrar regular expressions

        let lowercaseMatches = finalPassword.match(/[a-z]/g) || [];
        //console.log(lowerCaseMatches); //['y', 's', 'p', 'q', 'r'], por exemplo

        if(lowercaseMatches.length === 0){
            passwordScore -= 20;
        };

        if(lowercaseMatches.length <= 2){
            passwordScore -= 5;
        };

    };

    function numbersStrength(finalPassword){
        
        let numbersMatches = finalPassword.match(/[0-9]/g) || [];

        if(numbersMatches.length === 0){
            passwordScore -= 20;
        };

        if(numbersMatches.length <= 2){
            passwordScore -= 5;
        };

    };

    function symbolsStrength(finalPassword){
        
        let numbersMatches = finalPassword.match(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g) || [];
        //Aqui, podia ter feito o negativo dos números e das letras, mas vou fazer assim, para salvaguardar que só estou mesmo a procurar no conjunto de 32 caracteres do teclado português/inglês (o mesmo que selecionei antes)

        if(numbersMatches.length === 0){
            passwordScore -= 20;
        };

        if(numbersMatches.length <= 2){
            passwordScore -= 5;
        };

    };
    */

    const copy = document.querySelector('.copy-clipboard');

    copy.addEventListener('click', () => {
        navigator.clipboard.writeText(generatedPass.value);
    });

});
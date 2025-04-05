const plaintextInput = document.getElementById('plaintext');
const algorithmSelect = document.getElementById('algorithm');
const encryptBtn = document.getElementById('encryptBtn');
const ciphertextOutput = document.getElementById('ciphertext');
const errorMessage = document.getElementById('error-message');
const copyBtn = document.getElementById('copyBtn');
const keySection = document.getElementById('keySection');
const keyInput = document.getElementById('key');

algorithmSelect.addEventListener('change', () => {
    if (algorithmSelect.value === 'aes') {
        keySection.style.display = 'block';
    } else {
        keySection.style.display = 'none';
    }
});

encryptBtn.addEventListener('click', () => {
    const plaintext = plaintextInput.value;
    const selectedAlgorithm = algorithmSelect.value;
    const key = keyInput.value;

    errorMessage.textContent = ''; // Clear any previous errors
    ciphertextOutput.value = ''; // Clear previous output

    if (!plaintext) {
        errorMessage.textContent = 'Please enter plain text.';
        return;
    }

    if (!selectedAlgorithm) {
        errorMessage.textContent = 'Please select an encryption algorithm.';
        return;
    }

    let result = '';

    switch (selectedAlgorithm) {
        case 'caesar':
            result = caesarEncrypt(plaintext, 3); // Example shift of 3
            break;
        case 'aes':
            if (!key) {
                errorMessage.textContent = 'Please enter a key for AES encryption.';
                return;
            }
            result = aesEncrypt(plaintext, key);
            break;
        case 'base64':
            result = base64Encode(plaintext);
            break;
        case 'sha256':
            result = sha256Hash(plaintext);
            break;
        default:
            errorMessage.textContent = 'Invalid algorithm selected.';
            return;
    }

    ciphertextOutput.value = result;
});

copyBtn.addEventListener('click', () => {
    ciphertextOutput.select();
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    alert('Result copied to clipboard!');
});

// Encryption/Hashing Functions

function caesarEncrypt(text, shift) {
    let result = '';
    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        if (char.match(/[a-z]/i)) {
            const code = text.charCodeAt(i);
            let shiftedCode;
            if (code >= 65 && code <= 90) { // Uppercase
                shiftedCode = ((code - 65 + shift) % 26) + 65;
            } else if (code >= 97 && code <= 122) { // Lowercase
                shiftedCode = ((code - 97 + shift) % 26) + 97;
            }
            char = String.fromCharCode(shiftedCode);
        }
        result += char;
    }
    return result;
}

function aesEncrypt(text, key) {
    try {
        const ciphertext = CryptoJS.AES.encrypt(text, key).toString();
        return ciphertext;
    } catch (e) {
        errorMessage.textContent = 'Error encrypting with AES. Please check your key.';
        return '';
    }
}

function base64Encode(text) {
    try {
        return btoa(text);
    } catch (e) {
        errorMessage.textContent = 'Error encoding with Base64.';
        return '';
    }
}

function sha256Hash(text) {
    try {
        return CryptoJS.SHA256(text).toString();
    } catch (e) {
        errorMessage.textContent = 'Error generating SHA-256 hash.';
        return '';
    }
}
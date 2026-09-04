type PasswordContext = {
  email?: string;
  displayName?: string;
};

// This local denylist covers the most common credentials found in public
// breach corpora. It deliberately runs in the browser: no password, hash, or
// password prefix is sent to a third-party service.
const COMMON_COMPROMISED_PASSWORDS = new Set([
  "123456", "1234567", "12345678", "123456789", "1234567890",
  "abc123", "admin", "admin123", "iloveyou", "letmein", "password",
  "password1", "password123", "qwerty", "qwerty123", "senha", "senha123",
  "brasil", "brasil123", "welcome", "welcome123", "access", "baseball",
  "computer", "football", "freedom", "google", "login", "master", "monkey",
  "princess", "secret", "starwars", "superman", "test", "teste", "trustno1",
  "usuario", "usuario123", "passw0rd", "p@ssword", "p@ssw0rd", "123456a",
  "123456789a", "1q2w3e4r", "1qaz2wsx", "654321", "987654321",
]);

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function hasSimpleSequence(value: string) {
  const sequences = ["01234567890", "abcdefghijklmnopqrstuvwxyz", "qwertyuiop", "asdfghjkl", "zxcvbnm"];
  return sequences.some((sequence) => {
    const directions = [sequence, sequence.split("").reverse().join("")];
    return directions.some((direction) => {
      for (let index = 0; index <= direction.length - 4; index += 1) {
        if (value.includes(direction.slice(index, index + 4))) return true;
      }
      return false;
    });
  });
}

export function validateNewPassword(password: string, context: PasswordContext = {}): string | null {
  if (password.length < 12) return "Use uma senha com pelo menos 12 caracteres.";
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
    return "Use letras maiúsculas e minúsculas, números e um símbolo.";
  }

  const compact = normalize(password).replace(/\s/g, "");
  const canonical = compact.replace(/[^a-z0-9]/g, "");
  if (COMMON_COMPROMISED_PASSWORDS.has(compact) || COMMON_COMPROMISED_PASSWORDS.has(canonical)) return "Essa senha é muito comum ou já foi exposta. Escolha outra.";
  if (/(.)\1{3,}/.test(password) || new Set(password).size < 6 || hasSimpleSequence(canonical)) {
    return "Evite sequências, repetições e padrões fáceis de adivinhar.";
  }

  const emailName = normalize(context.email?.split("@")[0] ?? "").replace(/[^a-z0-9]/g, "");
  const nameTokens = normalize(context.displayName ?? "").split(/[^a-z0-9]+/).filter((token) => token.length >= 3);
  if ((emailName.length >= 3 && compact.includes(emailName)) || nameTokens.some((token) => compact.includes(token))) {
    return "Não use seu nome ou e-mail como parte da senha.";
  }

  return null;
}


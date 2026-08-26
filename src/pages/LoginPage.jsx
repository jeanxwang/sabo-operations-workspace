import { useState } from "react";
import { mockUsers } from "../data/mockUsers";
import "./LoginPage.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  function handleLogin(event) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setErrorMessage("Email kerja dan kata sandi wajib diisi.");
      return;
    }

    const user = mockUsers.find(
      (item) =>
        item.email.toLowerCase() === normalizedEmail &&
        item.password === password
    );

    if (!user) {
      setErrorMessage("Email atau kata sandi tidak sesuai.");
      return;
    }

    localStorage.setItem(
      "sabo_current_user",
      JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      })
    );

    console.log(`Berhasil masuk sebagai ${user.name}`, user);
  }

  return (
    <main className="login-page">
      <header className="login-brand">
        <span className="brand-mark" aria-hidden="true">S</span>
        <span>SABO Operations Workspace</span>
      </header>

      <section className="login-hero" aria-label="Informasi portal">
        <div>
          <h1>
            Portal Operasional
            <br />
            Schoters
          </h1>

          <p>
            Satu akses internal untuk mengelola aktivitas operasional,
            pendampingan student, koordinasi tim, dan data layanan Schoters.
          </p>
        </div>
      </section>

      <div className="login-divider" aria-hidden="true"></div>

      <section className="login-form-section" aria-label="Form login">
        <div className="login-card">
          <div className="login-card-header">
            <h2>Selamat datang kembali</h2>
            <p>Masukkan kredensial Anda untuk mengakses workspace</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Kerja</label>
              <input
                id="email"
                type="email"
                placeholder="nama@schoters.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <div className="password-label-row">
                <label htmlFor="password">Kata Sandi</label>
                <a href="mailto:platform@schoters.com?subject=Lupa kata sandi SABO">
                  Lupa kata sandi?
                </a>
              </div>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
              />
            </div>

            {errorMessage && (
              <p className="form-message form-message-error">{errorMessage}</p>
            )}

            {/* {successMessage && (
              <p className="form-message form-message-success">
                {successMessage}
              </p>
            )} */}

            <div className="login-button-wrapper">
              <button type="submit">Masuk</button>
            </div>
          </form>

          <p className="login-help">
            Mengalami kendala saat masuk?{" "}
            <a href="mailto:platform@schoters.com?subject=Kendala login SABO">
              Hubungi Platform Team
            </a>
          </p>
        </div>
      </section>

      <footer className="login-footer">
        © 2026 Schoters. Hak Cipta Dilindungi.
      </footer>
    </main>
  );
}
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpar mensagens quando usuário começar a digitar
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = () => {
    if (!formData.username || !formData.password || !formData.confirmPassword) {
      setError('Por favor, preencha todos os campos');
      return false;
    }

    if (formData.username.length < 3) {
      setError('Nome de usuário deve ter pelo menos 3 caracteres');
      return false;
    }

    if (formData.password.length < 4) {
      setError('Senha deve ter pelo menos 4 caracteres');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não conferem');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      // Cadastrar usuário
      const registerResponse = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });

      const registerData = await registerResponse.json();

      if (registerResponse.ok) {
        setSuccess('Usuário cadastrado com sucesso! Fazendo login...');
        
        // Fazer login automaticamente após cadastro
        setTimeout(async () => {
          try {
            const loginResponse = await fetch('http://localhost:3000/auth/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                username: formData.username,
                password: formData.password
              })
            });

            const loginData = await loginResponse.json();

            if (loginResponse.ok) {
              onLogin(loginData.token, { username: formData.username });
            } else {
              setError('Cadastro realizado, mas erro no login automático. Tente fazer login manualmente.');
            }
          } catch (err) {
            setError('Cadastro realizado, mas erro no login automático. Tente fazer login manualmente.');
          }
        }, 1500);

      } else {
        setError(registerData.error || 'Erro ao cadastrar usuário');
      }
    } catch (err) {
      console.error('Erro na requisição:', err);
      setError('Erro de conexão. Verifique se o servidor está rodando.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">📝 Cadastro</h2>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="username">Usuário</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Escolha um nome de usuário"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Crie uma senha"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar Senha</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Digite a senha novamente"
            disabled={loading}
          />
        </div>

        <button 
          type="submit" 
          className="auth-btn"
          disabled={loading}
        >
          {loading ? '🔄 Cadastrando...' : '🚀 Cadastrar'}
        </button>
      </form>

      <div className="auth-switch">
        Já tem uma conta? {' '}
        <Link to="/login">Faça login aqui</Link>
      </div>
    </div>
  );
};

export default Register;
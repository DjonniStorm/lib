import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

type FormData = {
  email: string;
  password: string;
  card: string;
  name: string;
};

export const RegisterPage = (): React.JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log(data);
    reset();
  };

  return (
    <main className="flex-1 grid sm:grid-cols-1 md:grid-cols-2 gap-4 p-4 items-center justify-center">
      <section className="p-4 flex justify-center">
        <div className="border rounded p-4 flex flex-col gap-2 px-4 object-contain">
          <h2 className="text-center text-2xl">Добро пожаловать</h2>
          <form
            className="flex flex-col gap-2 px-4"
            onSubmit={handleSubmit(data => onSubmit(data))}
          >
            <label className="flex flex-col">
              <span className="text-gray-700">Введите имя:</span>
              <input
                id="name"
                type="text"
                className="border rounded auth-input"
                autoComplete="name"
                placeholder="Имя"
                required
                {...register('name', {
                  required: 'Name is required',
                })}
              />
              {errors.name && (
                <span className="text-red-600">{errors.name.message}</span>
              )}
            </label>
            <label className="flex flex-col">
              <span className="text-gray-700">Введите email:</span>
              <input
                id="email"
                type="email"
                className="border rounded auth-input"
                autoComplete="email"
                placeholder="Email"
                required
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'Invalid email address',
                  },
                })}
              />
              {errors.email && (
                <span className="text-red-600">{errors.email.message}</span>
              )}
            </label>
            <label className="flex flex-col">
              <span className="text-gray-700">Введите пароль:</span>
              <input
                id="password"
                type="password"
                className="border rounded auth-input"
                autoComplete="password"
                placeholder="Пароль"
                required
                {...register('password', {
                  required: 'password is required',
                })}
              />
              {errors.password && (
                <span className="text-red-600">{errors.password.message}</span>
              )}
            </label>
            <label className="flex flex-col">
              <span className="text-gray-700">Введите номер карты:</span>
              <input
                id="card"
                type="text"
                className="border rounded auth-input"
                autoComplete="card"
                placeholder="Номер карты"
                required
                {...register('card', {
                  required: 'Card number is required',
                })}
              />
              {errors.card && (
                <span className="text-red-600">{errors.card.message}</span>
              )}
            </label>

            <Button
              type="submit"
              className="rounded-xl border border-gray-900 cursor-pointer p-2 transition active:bg-gray-700"
            >
              Зарегистрироваться
            </Button>
          </form>
          <Link to={'/login'} className="text-center text-gray-700">
            <div>Войти</div>
          </Link>
        </div>
      </section>
      <section className="hidden sm:hidden md:block">
        <img src="/images/posters/book-shkaf.svg" />
      </section>
    </main>
  );
};

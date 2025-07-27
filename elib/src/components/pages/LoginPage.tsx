import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

type FormData = {
  email: string;
  password: string;
};

export const LoginPage = (): React.JSX.Element => {
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
          <h2 className="text-center text-2xl">С Возвращением</h2>
          <form
            className="flex flex-col gap-2 px-4"
            onSubmit={handleSubmit(data => onSubmit(data))}
          >
            <input
              id="email"
              type="email"
              className="border rounded auth-input"
              autoComplete="email"
              placeholder="Email"
              required
              {...register('email', {
                required: 'введите email',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: 'некорректный email',
                },
              })}
            />
            {errors.email && (
              <span className="text-red-600">{errors.email.message}</span>
            )}
            <input
              id="password"
              type="password"
              className="border rounded auth-input"
              autoComplete="password"
              placeholder="Пароль"
              required
              {...register('password', {
                required: 'придумайте пароль',
              })}
            />
            {errors.password && (
              <span className="text-red-600">{errors.password.message}</span>
            )}
            <Button
              type="submit"
              className="rounded-xl cursor-pointer p-2 transition active:bg-gray-700"
            >
              Войти
            </Button>
          </form>
          <Link to={'/register'} className="text-center text-gray-700">
            <div>Впервые у нас?</div>
          </Link>
        </div>
      </section>
      <section className="hidden sm:hidden md:block">
        <img src="/images/posters/book-shkaf.svg" />
      </section>
    </main>
  );
};
